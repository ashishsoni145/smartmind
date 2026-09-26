#!/usr/bin/env bash
#
# Turn a failed Gradle build log into GitHub Actions check annotations.
#
#   report-build-failure.sh <log-file> <task-name>
#
# Why this exists: a Gradle failure prints its useful part - the "What went wrong" section and the
# first compiler error - somewhere in the middle of thousands of lines of task output. Reading it
# normally means downloading the job log, which is served from Actions blob storage that is not
# reachable from every environment (a sandboxed agent, a locked-down network, the mobile app).
# Check annotations are served by api.github.com instead, so publishing the diagnostic as an
# annotation makes the failure legible everywhere the run itself is visible.
#
# It never prints more than the log already contains, and it masks nothing: Gradle build output has
# no secrets in it, because signing credentials are read from the environment by AGP and are not
# echoed. If that ever changes, fix it at the source rather than filtering here.
#
# Exit status is always 0. The caller owns the build's exit status; a diagnostic helper must not be
# able to mask or replace it.

set -u

LOG="${1:-}"
TASK="${2:-Gradle build}"

# Annotations are truncated well before they are huge, so chunk deliberately instead of losing the
# tail silently. Chunking is by whole lines and the escaped text is joined with a literal %0A, so a
# chunk boundary can never split an escape sequence and corrupt the annotation.
CHUNK=850

# Workflow-command fields encode % and newlines specially. Newlines are handled by the read loop in
# emit(), so this only has to neutralise % and drop carriage returns.
escape() {
  local s="$1"
  s="${s//%/%25}"
  s="${s//$'\r'/}"
  printf '%s' "$s"
}

emit() {
  local title="$1"
  local body="$2"
  [ -z "$body" ] && return 0

  local out="" len=0 part=1 line esc
  while IFS= read -r line || [ -n "$line" ]; do
    esc="$(escape "$line")"
    # +5 accounts for the %0A separator that will join this line to the previous one.
    if [ -n "$out" ] && [ $((len + ${#esc} + 5)) -gt "$CHUNK" ]; then
      echo "::error title=$(escape "${title} (part ${part})")::${out}"
      out=""
      len=0
      part=$((part + 1))
    fi
    if [ -n "$out" ]; then
      out="${out}%0A${esc}"
      len=$((len + 5 + ${#esc}))
    else
      out="$esc"
      len=${#esc}
    fi
  done <<< "$body"

  if [ -n "$out" ]; then
    if [ "$part" -gt 1 ]; then
      echo "::error title=$(escape "${title} (part ${part})")::${out}"
    else
      echo "::error title=$(escape "$title")::${out}"
    fi
  fi
}

if [ -z "$LOG" ] || [ ! -f "$LOG" ]; then
  echo "::error title=$(escape "$TASK") failed::No build log was captured, so the cause cannot be reported."
  exit 0
fi

# 1. Gradle's own summary of the failure - the part a human scrolls to first.
#
# Capped at SECTION_CAP bytes. emit() chunks by line, so this bounds how many annotations one
# section can produce (about 5 at the default CHUNK); without it a pathological R8 or manifest
# failure could emit dozens and GitHub would start dropping them. The first errors section below is
# bounded by line count instead, which is the more useful limit for compiler diagnostics.
SECTION_CAP=4000
WHAT_WENT_WRONG="$(sed -n '/^\* What went wrong:/,/^\* Try:/p' "$LOG" | head -c "$SECTION_CAP")"
emit "${TASK} failed - what went wrong" "$WHAT_WENT_WRONG"

# 2. The first real errors, in the order they appeared: Kotlin/Java compiler diagnostics, R8 and
#    resource-linking failures, and the task that died so the reader sees which one it was.
ERRORS="$(grep -aE "^(e: |error:|FAILURE:|Caused by:|> Task .*FAILED|Execution failed for task|A problem occurred)" "$LOG" | head -40)"
emit "${TASK} failed - first errors" "$ERRORS"

# 3. R8 and AAPT2 are the most common release-only failures and both bury the real complaint under a
#    generic wrapper, so surface their detail lines explicitly.
emit "${TASK} failed - R8/ProGuard detail" "$(grep -aE "R8|Missing class|cannot be mapped|ProGuard|shrinker" "$LOG" | head -20)"
emit "${TASK} failed - AAPT/manifest detail" "$(grep -aE "AAPT|aapt2|resource linking failed|Manifest merger" "$LOG" | head -20)"

# 4. Metro/Hermes bundling has its own failure shape, and a distributed build is the first time the
#    bundle is produced at all, so give it a section too.
emit "${TASK} failed - bundle/Hermes detail" "$(grep -aE "Metro|metro|Bundling|hermesc|Hermes|Unable to resolve module|SyntaxError" "$LOG" | head -20)"

# 5. If nothing matched, the log was not the shape we expected - hand over the tail rather than
#    reporting nothing at all.
if [ -z "$WHAT_WENT_WRONG" ] && [ -z "$ERRORS" ]; then
  emit "${TASK} failed - unrecognised output, last 60 lines" "$(tail -60 "$LOG")"
fi

exit 0
