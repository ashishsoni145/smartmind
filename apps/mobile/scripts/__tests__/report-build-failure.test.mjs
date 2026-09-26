/**
 * Tests for scripts/report-build-failure.sh.
 *
 * This helper is the only way to see a Gradle failure when Actions log storage is unreachable, which
 * includes the sandboxed environment this repository is usually maintained from. If it silently
 * breaks, a failed build becomes an unexplained red job - so it gets tests like anything else.
 */
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.resolve(here, '../report-build-failure.sh');

const REALISTIC_LOG = `> Task :app:writePublicConfig
> Task :app:createBundleQaStandaloneJsAndAssets
> Task :app:compileQaStandaloneKotlin
e: file:///work/app/src/main/java/com/sharpmind/app/bridge/SecureStore.kt:42:9 unresolved reference: encrypt
> Task :app:minifyQaStandaloneWithR8
Missing class detected while running R8: com.facebook.react.uimanager.SomeClass
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:minifyQaStandaloneWithR8'.
> A failure occurred while executing R8Task
   Progress was 100% complete.

* Try:
> Run with --stacktrace option to get the stack trace.

BUILD FAILED in 3m 12s
`;

function run(logContents, task = 'assembleQaStandalone') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sm-build-log-'));
  const logFile = logContents === null ? path.join(dir, 'absent.log') : path.join(dir, 'build.log');
  if (logContents !== null) fs.writeFileSync(logFile, logContents);
  const result = spawnSync('bash', [script, logFile, task], { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  return { ...result, output: `${result.stdout}\n${result.stderr}` };
}

describe('report-build-failure.sh', () => {
  test('exists and is syntactically valid bash', () => {
    assert.ok(fs.existsSync(script), 'scripts/report-build-failure.sh must exist');
    const check = spawnSync('bash', ['-n', script], { encoding: 'utf8' });
    assert.equal(check.status, 0, `bash -n reported: ${check.stderr}`);
  });

  test('surfaces the What went wrong section, the first errors and the R8 detail', () => {
    const { output } = run(REALISTIC_LOG);
    assert.match(output, /what went wrong/);
    assert.match(output, /Execution failed for task ':app:minifyQaStandaloneWithR8'/);
    assert.match(output, /first errors/);
    assert.match(output, /unresolved reference: encrypt/);
    assert.match(output, /R8\/ProGuard detail/);
    assert.match(output, /Missing class detected while running R8/);
  });

  test('emits valid workflow commands, with % and newlines escaped', () => {
    const { output } = run(REALISTIC_LOG);
    const annotations = output.split('\n').filter((line) => line.startsWith('::error '));
    assert.ok(annotations.length >= 3, `expected several annotations, got ${annotations.length}`);
    for (const line of annotations) {
      const parsed = /^::error title=([^:]*)::([\s\S]*)$/.exec(line);
      assert.ok(parsed, `malformed annotation: ${line}`);
      const [, title, message] = parsed;
      assert.ok(title.length > 0, 'annotation has an empty title');
      // Every % that survives must be part of a workflow-command escape; a bare one would corrupt
      // the annotation, because GitHub parses %XX in the message.
      assert.equal(message.replace(/%(25|0A|0D)/g, '').includes('%'), false,
        `unescaped % in annotation: ${line}`);
      assert.ok(!message.includes('\n'), 'annotation message contains a raw newline');
    }
    // The literal "100% complete" from the log must arrive as "100%25 complete".
    assert.match(output, /100%25 complete/);
  });

  test('always exits 0 so it can never mask the build exit status', () => {
    assert.equal(run(REALISTIC_LOG).status, 0);
    assert.equal(run('').status, 0);
    assert.equal(run(null).status, 0, 'a missing log file must not change the caller exit status');
  });

  test('a missing log file says so instead of printing nothing', () => {
    const { output } = run(null);
    assert.match(output, /No build log was captured/);
  });

  test('unrecognised output falls back to the tail rather than reporting nothing', () => {
    const { output } = run('something entirely unexpected\n'.repeat(80));
    assert.match(output, /unrecognised output, last 60 lines/);
  });

  test('a long section is chunked into parts instead of being truncated away', () => {
    const body = Array.from({ length: 60 }, (_, i) => `line ${i} ${'y'.repeat(70)}`).join('\n');
    const { output } = run(`* What went wrong:\n${body}\n\n* Try:\n`);
    assert.match(output, /part 1\)/);
    assert.match(output, /part 2\)/);
    // Every chunk must still be a well-formed annotation, and no line may be lost between them.
    const parts = output.split('\n').filter((l) => l.startsWith('::error '));
    assert.ok(parts.length >= 2, `expected the section to be chunked, got ${parts.length}`);
    for (const line of parts) {
      assert.match(line, /^::error title=[^:]*::/);
    }
    const rejoined = parts.map((l) => l.slice(l.indexOf('::', 8) + 2)).join('%0A').replace(/%0A/g, '\n');
    // Probe lines that sit inside the script's SECTION_CAP (4000 bytes, ~51 of these 78-byte
    // lines). Chunking must not lose anything within the cap; content past it is deliberately
    // dropped so one pathological section cannot crowd out every other annotation.
    for (const probe of [0, 20, 40]) {
      assert.ok(rejoined.includes(`line ${probe} `), `chunking dropped line ${probe}`);
    }
  });

  test('a pathological section is capped so it cannot crowd out other annotations', () => {
    const body = Array.from({ length: 400 }, (_, i) => `line ${i} ${'z'.repeat(70)}`).join('\n');
    const { output } = run(`* What went wrong:\n${body}\n\n* Try:\n`);
    const parts = output.split('\n').filter((l) => l.startsWith('::error title='));
    assert.ok(parts.length <= 8, `expected a bounded annotation count, got ${parts.length}`);
    assert.ok(parts.length >= 2, 'the section should still be chunked, not silently dropped');
  });
});
