import React, { useEffect, useState } from 'react';
import { AppState, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from '../navigation/RootNavigator';
import { AuthProvider } from '../services/auth';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';
import { resolveApiUrl } from '../config/public-env';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 20_000,
    },
  },
});

function ConnectivityBanner() {
  const theme = useTheme();
  const [offline, setOffline] = useState(false);
  const api = resolveApiUrl();
  useEffect(() => {
    let cancelled = false;
    async function probe() {
      if (!api.url) {
        if (!cancelled) setOffline(true);
        return;
      }
      try {
        const response = await fetch(api.url.replace(/\/api\/v1$/, '') + '/health');
        if (!cancelled) setOffline(!response.ok && response.status !== 404);
      } catch {
        if (!cancelled) setOffline(true);
      }
    }
    probe();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') probe();
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, [api.url]);
  if (!offline && api.source !== 'missing') return null;
  return (
    <View style={{ backgroundColor: theme.colors.warningSoft, padding: 10 }}>
      <Text style={{ color: theme.colors.text }}>
        {api.source === 'missing'
          ? 'Release build has no API URL. Data calls stay disabled.'
          : api.source === 'emulator-debug'
            ? 'Debug API default is the emulator loopback. Cached server data is labeled when shown; nothing is fabricated.'
            : 'Network looks unavailable. SharpMind will not invent scores or AI replies.'}
      </Text>
    </View>
  );
}

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <ConnectivityBanner />
              <RootNavigator />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
