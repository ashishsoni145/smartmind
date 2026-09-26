import React, { useCallback, useMemo } from 'react';
import { Pressable, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiClientError } from '@sharpmind/api-client';
import { RootNavigator } from '../navigation/RootNavigator';
import { AuthProvider } from '../services/auth';
import { ConnectivityProvider, useConnectivity } from '../services/connectivity';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';
import { resolveApiUrl } from '../config/public-env';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Text } from '../components/ui';
import { toUserError } from '../utils/errors';

function createQueryClient(onOffline: () => void, onOnline: () => void) {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        const mapped = toUserError(error);
        if (mapped.offline) onOffline();
      },
      onSuccess: () => onOnline(),
    }),
    defaultOptions: {
      queries: {
        // Reads retry once unless the server said the request itself is wrong.
        retry: (failureCount, error) => {
          if (error instanceof ApiClientError && error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) return false;
          return failureCount < 1;
        },
        staleTime: 20_000,
        gcTime: 10 * 60_000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Mutations are never retried automatically: a retried submit could duplicate work.
        retry: false,
      },
    },
  });
}

function ConnectivityBanner() {
  const theme = useTheme();
  const connectivity = useConnectivity();
  const insets = useSafeAreaInsets();
  const api = resolveApiUrl();
  let label: string | null = null;
  let detail: string | null = null;
  if (api.source === 'missing' || api.source === 'invalid') {
    // Honest failure: no invented data, no silent retarget to a developer machine.
    label = api.source === 'invalid' ? 'Misconfigured' : 'Not configured';
    detail = api.reason || 'This build has no usable backend URL. Data calls stay disabled.';
  } else if (connectivity.state === 'offline') {
    label = 'Offline';
    detail = 'SharpMind cannot reach the server. Nothing is invented; reconnect to sync.';
  } else if (connectivity.state === 'server_error') {
    label = 'Server error';
    detail = 'The SharpMind server is responding with errors. Try again shortly.';
  }
  if (!label) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${detail}. Tap to check again.`}
      onPress={() => connectivity.refresh()}
      style={[styles.banner, { backgroundColor: theme.colors.warningSoft, paddingTop: insets.top + 8, borderBottomColor: theme.colors.border }]}>
      <Text weight="700" variant="small">{label}</Text>
      <Text tone="secondary" variant="small">{detail} Tap to retry.</Text>
    </Pressable>
  );
}

function Shell() {
  const connectivity = useConnectivity();
  const client = useMemo(() => createQueryClient(connectivity.reportOffline, connectivity.reportOnline), [connectivity.reportOffline, connectivity.reportOnline]);
  const onSignedOut = useCallback(() => {
    // Drop every cached query so the next account never sees the previous student's data.
    client.clear();
  }, [client]);
  const theme = useTheme();
  return (
    <QueryClientProvider client={client}>
      <AuthProvider onSignedOut={onSignedOut}>
        <StatusBar barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'} />
        <ConnectivityBanner />
        <ErrorBoundary scope="navigation">
          <RootNavigator />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export function App() {
  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <ErrorBoundary scope="root">
          <ThemeProvider>
            <ConnectivityProvider>
              <Shell />
            </ConnectivityProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  banner: { paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth, gap: 2 },
});
