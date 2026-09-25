export type RuleType = 'APP_BLOCK' | 'CONTENT_RESTRICTION' | 'TIME_LIMIT' | 'FOCUS_ONLY';

export type RestrictionRule = {
  id: string;
  packageName: string;
  ruleType: RuleType;
  target: string;
  enabled: boolean;
  priority: number;
  focusSessionId: string | null;
  createdAt: string;
};

const TYPES: RuleType[] = ['APP_BLOCK', 'CONTENT_RESTRICTION', 'TIME_LIMIT', 'FOCUS_ONLY'];

export function validateRules(rules: RestrictionRule[]): { ok: true } | { ok: false; message: string } {
  const ids = new Set<string>();
  for (const rule of rules) {
    if (!rule.id || ids.has(rule.id)) {
      return { ok: false, message: 'Each restriction rule needs a unique id.' };
    }
    ids.add(rule.id);
    if (!TYPES.includes(rule.ruleType)) {
      return { ok: false, message: `Unsupported rule type ${rule.ruleType}.` };
    }
    if (!rule.packageName || rule.packageName.includes(' ')) {
      return { ok: false, message: 'A restriction rule needs a package name.' };
    }
    if (rule.packageName === 'com.android.settings' || rule.packageName === 'com.sharpmind.app') {
      return { ok: false, message: 'SharpMind will not restrict Settings or itself.' };
    }
    if (rule.ruleType === 'TIME_LIMIT' && (!Number.isFinite(Number(rule.target)) || Number(rule.target) <= 0)) {
      return { ok: false, message: 'A time limit needs a positive number of seconds.' };
    }
    if (rule.ruleType === 'CONTENT_RESTRICTION' && !rule.target) {
      return { ok: false, message: 'A content restriction needs a target such as shorts or reels.' };
    }
  }
  return { ok: true };
}

export function selectiveSupport(packageName: string): string[] {
  if (packageName === 'com.google.android.youtube') return ['shorts'];
  if (packageName === 'com.instagram.android' || packageName === 'com.facebook.katana') return ['reels'];
  return [];
}
