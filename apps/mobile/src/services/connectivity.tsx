import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { probeServer } from '../api/client';

export type ConnectivityState = 'unknown' | 'online' | 'offline' | 'server_error' | 'not_configured';

type ConnectivityValue = {
  state: ConnectivityState;
  checkedAt: number | null;
  /** Re-probe now; returns the new state. */
  refresh: () => Promise<ConnectivityState>;
  /** Report the outcome of a real request so the banner reflects reality without extra probes. */
  reportOnline: () => void;
  reportOffline: () => void;
};

const ConnectivityContext = createContext<ConnectivityValue | null>(null);

/**
 * Reachability of the SharpMind backend. There is no NetInfo dependency; this uses one
 * cheap unauthenticated health probe on launch, on foreground, and on demand.
 */
export function ConnectivityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConnectivityState>('unknown');
  const [checkedAt, setCheckedAt] = useState<number | null>(null);
  const inFlight = useRef<Promise<ConnectivityState> | null>(null);

  const refresh = useCallback(async () => {
    if (inFlight.current) return inFlight.current;
    const task = probeServer().then((next) => {
      setState(next);
      setCheckedAt(Date.now());
      inFlight.current = null;
      return next;
    });
    inFlight.current = task;
    return task;
  }, []);

  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const value = useMemo<ConnectivityValue>(() => ({
    state,
    checkedAt,
    refresh,
    reportOnline: () => setState((current) => (current === 'not_configured' ? current : 'online')),
    reportOffline: () => setState((current) => (current === 'not_configured' ? current : 'offline')),
  }), [checkedAt, refresh, state]);

  return <ConnectivityContext.Provider value={value}>{children}</ConnectivityContext.Provider>;
}

export function useConnectivity(): ConnectivityValue {
  const value = useContext(ConnectivityContext);
  if (!value) throw new Error('ConnectivityProvider is missing');
  return value;
}
