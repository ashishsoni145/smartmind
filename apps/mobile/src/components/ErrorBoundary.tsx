import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme/tokens';

type Props = { children: React.ReactNode; scope?: string };
type State = { error: Error | null; resetKey: number };

/**
 * Last-resort boundary. Renders a recoverable screen instead of a white screen.
 * Debug builds log the stack; release builds log only the error name and scope,
 * never message payloads that could contain student content.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, resetKey: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (__DEV__) {
      console.error(`[SharpMind:${this.props.scope || 'app'}]`, error, info.componentStack);
    } else {
      console.warn(`[SharpMind:${this.props.scope || 'app'}] render failure: ${error.name}`);
    }
  }

  reset = () => this.setState((state) => ({ error: null, resetKey: state.resetKey + 1 }));

  render() {
    if (!this.state.error) {
      return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>;
    }
    return (
      <View style={styles.root} accessibilityRole="alert">
        <Text style={styles.title}>Something broke on this screen</Text>
        <Text style={styles.body}>
          SharpMind stopped rendering this part of the app to avoid showing wrong information. Your server data was not changed.
        </Text>
        {__DEV__ ? <Text style={styles.debug}>{this.state.error.message}</Text> : null}
        <Pressable accessibilityRole="button" onPress={this.reset} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.background, padding: 24, justifyContent: 'center', gap: 12 },
  title: { color: palette.text, fontSize: 22, fontWeight: '700' },
  body: { color: palette.textSecondary, fontSize: 16, lineHeight: 22 },
  debug: { color: palette.warning, fontFamily: 'monospace', fontSize: 12 },
  button: { minHeight: 48, borderRadius: 14, backgroundColor: palette.accent, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
});
