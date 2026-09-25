import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  startFocusSession(configJson: string): Promise<string>;
  stopFocusSession(confirmStrict: boolean): Promise<string>;
  cancelFocusSession(confirmStrict: boolean): Promise<string>;
  pauseFocusSession(): Promise<string>;
  resumeFocusSession(): Promise<string>;
  getFocusStatus(): Promise<string>;
  linkBackendSession(sessionId: string): Promise<string>;
  retryFocusPermissions(): Promise<string>;
  getRequiredPermissions(): Promise<string>;
  openAccessibilitySettings(): Promise<string>;
  openUsageAccessSettings(): Promise<string>;
  openNotificationSettings(): Promise<string>;
  isAccessibilityEnabled(): Promise<boolean>;
  isUsageAccessEnabled(): Promise<boolean>;
  getInstalledSupportedApps(): Promise<string>;
  setRestrictionRules(rulesJson: string): Promise<string>;
  getActiveRestrictions(): Promise<string>;
  secureGet(key: string): Promise<string>;
  secureSet(key: string, value: string): Promise<string>;
  secureDelete(key: string): Promise<string>;
  cacheRead(key: string): Promise<string>;
  cacheWrite(key: string, value: string): Promise<string>;
  cacheRemove(key: string): Promise<string>;
  scheduleReminder(id: string, title: string, body: string, triggerAtEpochMs: number): Promise<string>;
  cancelReminder(id: string): Promise<string>;
  pickImage(): Promise<string>;
  readFileBase64(uri: string): Promise<string>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.get<Spec>('SharpMindAndroid');
