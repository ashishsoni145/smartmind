export { greeting } from '../../utils/format';

export function toUserMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Request failed.';
}
