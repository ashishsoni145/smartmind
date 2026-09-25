export function backPolicy(canGoBack: boolean, exitArmed: boolean): 'go-back' | 'arm-exit' | 'exit' {
  if (canGoBack) return 'go-back';
  if (!exitArmed) return 'arm-exit';
  return 'exit';
}
