import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { radius, space, type as typeScale } from '../theme/tokens';
import { parseMarkdown } from '../utils/markdown';

export function Screen({
  children,
  scroll = true,
  refreshing = false,
  onRefresh,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  const theme = useTheme();
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={styles.scroll}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.accent} /> : undefined}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={styles.fill}>{children}</View>
  );
  return <SafeAreaView style={[styles.fill, { backgroundColor: theme.colors.background }]}>{body}</SafeAreaView>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, style]}>
      {children}
    </View>
  );
}

export function Heading({ children, subtitle }: { children: string; subtitle?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.heading}>
      <Text accessibilityRole="header" style={[styles.display, { color: theme.colors.text }]} maxFontSizeMultiplier={1.4}>
        {children}
      </Text>
      {subtitle ? <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text> : null}
    </View>
  );
}

export function Button({
  label,
  onPress,
  disabled,
  tone = 'primary',
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'primary' | 'ghost' | 'danger';
  accessibilityHint?: string;
}) {
  const theme = useTheme();
  const background = tone === 'primary' ? theme.colors.accent : tone === 'danger' ? theme.colors.danger : 'transparent';
  const color = tone === 'ghost' ? theme.colors.text : theme.colors.inverse;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background, borderColor: theme.colors.border, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}>
      <Text style={[styles.buttonText, { color }]}>{label}</Text>
    </Pressable>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  multiline?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        multiline={multiline}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          multiline && styles.multiline,
          { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
        ]}
      />
    </View>
  );
}

export function StateView({
  loading,
  error,
  empty,
  onRetry,
  children,
}: {
  loading?: boolean;
  error?: string | null;
  empty?: string | null;
  onRetry?: () => void;
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  if (loading) {
    return (
      <View accessibilityLabel="Loading" style={styles.state}>
        <View style={[styles.skeleton, { backgroundColor: theme.colors.elevated }]} />
        <View style={[styles.skeletonShort, { backgroundColor: theme.colors.elevated }]} />
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }
  if (error) {
    return (
      <Card>
        <Text style={{ color: theme.colors.danger }}>{error}</Text>
        {onRetry ? <Button label="Retry" onPress={onRetry} /> : null}
      </Card>
    );
  }
  if (empty) {
    return (
      <Card>
        <Text style={{ color: theme.colors.textSecondary }}>{empty}</Text>
      </Card>
    );
  }
  return <>{children}</>;
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: active ? theme.colors.accentSoft : theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={{ color: active ? theme.colors.accent : theme.colors.textSecondary }}>{label}</Text>
    </Pressable>
  );
}

export function Meter({ label, value }: { label: string; value: number | null }) {
  const theme = useTheme();
  const width = value == null ? 0 : Math.max(0, Math.min(100, value <= 1 ? value * 100 : value));
  return (
    <View accessibilityLabel={value == null ? `${label} unavailable` : `${label} ${Math.round(width)} percent`}>
      <Text style={{ color: theme.colors.textSecondary, marginBottom: 6 }}>{label}</Text>
      <View style={[styles.track, { backgroundColor: theme.colors.elevated }]}>
        <View style={[styles.fillBar, { width: `${width}%`, backgroundColor: theme.colors.accent }]} />
      </View>
      <Text style={{ color: theme.colors.text, marginTop: 4 }}>{value == null ? 'Not available' : `${Math.round(width)}`}</Text>
    </View>
  );
}

export function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const theme = useTheme();
  const max = Math.max(1, ...values);
  return (
    <View accessibilityLabel="Chart" style={styles.chart}>
      {values.map((value, index) => (
        <View key={`${labels[index] ?? index}`} style={styles.barCol}>
          <View style={[styles.barTrack, { backgroundColor: theme.colors.elevated }]}>
            <View style={[styles.bar, { height: `${(value / max) * 100}%`, backgroundColor: theme.colors.violet }]} />
          </View>
          <Text style={[styles.caption, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {labels[index] ?? ''}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function MarkdownView({ source }: { source: string }) {
  const theme = useTheme();
  const blocks = parseMarkdown(source);
  return (
    <View>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <Text key={index} style={[styles.headingText, { color: theme.colors.text }]}>
              {block.text}
            </Text>
          );
        }
        if (block.type === 'code' || block.type === 'math') {
          return (
            <Text key={index} style={[styles.code, { color: theme.colors.text, backgroundColor: theme.colors.elevated }]}>
              {block.type === 'math' ? block.text : block.text}
            </Text>
          );
        }
        if (block.type === 'list') {
          return (
            <View key={index}>
              {block.items.map((item) => (
                <Text key={item} style={{ color: theme.colors.text, marginBottom: 4 }}>
                  • {item}
                </Text>
              ))}
            </View>
          );
        }
        return (
          <Text key={index} style={{ color: block.type === 'quote' ? theme.colors.textSecondary : theme.colors.text, marginBottom: 8 }}>
            {block.text}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { padding: space.lg, gap: space.md, paddingBottom: 120 },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: space.lg, gap: space.sm },
  heading: { gap: 6, marginBottom: space.sm },
  display: { fontSize: typeScale.display, fontWeight: '700', letterSpacing: -0.6 },
  subtitle: { fontSize: typeScale.body, lineHeight: 22 },
  button: { minHeight: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, borderWidth: 1 },
  buttonText: { fontSize: 16, fontWeight: '700' },
  field: { gap: 6 },
  label: { fontSize: typeScale.small },
  input: { minHeight: 48, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, fontSize: 16 },
  multiline: { minHeight: 96, textAlignVertical: 'top', paddingTop: 12 },
  state: { gap: 10, paddingVertical: 12 },
  skeleton: { height: 18, borderRadius: 8, width: '80%' },
  skeletonShort: { height: 12, borderRadius: 8, width: '45%' },
  chip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, minHeight: 36, alignItems: 'center', justifyContent: 'center' },
  track: { height: 8, borderRadius: 8, overflow: 'hidden' },
  fillBar: { height: 8 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 140 },
  barCol: { flex: 1, alignItems: 'center', height: '100%' },
  barTrack: { flex: 1, width: '70%', justifyContent: 'flex-end', borderRadius: 8, overflow: 'hidden' },
  bar: { width: '100%' },
  caption: { fontSize: 11, marginTop: 4 },
  headingText: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  code: { fontFamily: 'monospace', padding: 10, borderRadius: 10, marginBottom: 8 },
});

export function muted(color: string): TextStyle {
  return { color, fontSize: typeScale.small };
}
