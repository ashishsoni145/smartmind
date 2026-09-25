import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TextInput,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { radius, space, type as typeScale } from '../theme/tokens';
import { parseMarkdown } from '../utils/markdown';
import { errorKindLabel, type UserFacingError } from '../utils/errors';

type Tone = 'default' | 'secondary' | 'muted' | 'danger' | 'warning' | 'success' | 'accent' | 'inverse';
type Variant = 'display' | 'title' | 'heading' | 'body' | 'small' | 'caption' | 'mono';

/**
 * Themed text. React Native's Text defaults to black, which is invisible on the dark theme,
 * so every screen goes through this component instead of the raw primitive.
 */
export function Text({
  tone = 'default',
  variant = 'body',
  weight,
  style,
  ...rest
}: TextProps & { tone?: Tone; variant?: Variant; weight?: '400' | '500' | '600' | '700' }) {
  const theme = useTheme();
  const color =
    tone === 'secondary' ? theme.colors.textSecondary
      : tone === 'muted' ? theme.colors.textMuted
        : tone === 'danger' ? theme.colors.danger
          : tone === 'warning' ? theme.colors.warning
            : tone === 'success' ? theme.colors.success
              : tone === 'accent' ? theme.colors.accent
                : tone === 'inverse' ? theme.colors.inverse
                  : theme.colors.text;
  return (
    <RNText
      maxFontSizeMultiplier={variant === 'display' ? 1.4 : 2}
      {...rest}
      style={[textVariants[variant], { color }, weight ? { fontWeight: weight } : null, style]}
    />
  );
}

export function Screen({
  children,
  scroll = true,
  refreshing = false,
  onRefresh,
  padded = true,
  headerless = false,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  padded?: boolean;
  /** Screens without a native-stack header must pad the status bar themselves. */
  headerless?: boolean;
}) {
  const theme = useTheme();
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scroll, !padded && styles.unpadded]}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.accent} colors={[theme.colors.accent]} /> : undefined}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, padded && styles.fixedPadding]}>{children}</View>
  );
  return <SafeAreaView edges={headerless ? ['top', 'bottom', 'left', 'right'] : ['bottom', 'left', 'right']} style={[styles.fill, { backgroundColor: theme.colors.background }]}>{body}</SafeAreaView>;
}

export function Card({ children, style, tone = 'default' }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: 'default' | 'warning' | 'danger' | 'success' | 'accent' }) {
  const theme = useTheme();
  const background =
    tone === 'warning' ? theme.colors.warningSoft
      : tone === 'danger' ? theme.colors.dangerSoft
        : tone === 'success' ? theme.colors.successSoft
          : tone === 'accent' ? theme.colors.accentSoft
            : theme.colors.card;
  return (
    <View style={[styles.card, { backgroundColor: background, borderColor: theme.colors.border }, style]}>
      {children}
    </View>
  );
}

export function Heading({ children, subtitle, compact }: { children: string; subtitle?: string; compact?: boolean }) {
  return (
    <View style={[styles.heading, compact && { marginBottom: 0 }]}>
      <Text accessibilityRole="header" variant={compact ? 'title' : 'display'} weight="700" style={{ letterSpacing: -0.5 }}>
        {children}
      </Text>
      {subtitle ? <Text tone="secondary" style={{ lineHeight: 22 }}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionTitle({ children, action, onAction }: { children: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionRow}>
      <Text accessibilityRole="header" variant="heading" weight="700">{children}</Text>
      {action && onAction ? (
        <Pressable accessibilityRole="button" accessibilityLabel={action} onPress={onAction} hitSlop={8} style={styles.linkHit}>
          <Text tone="accent" weight="600">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Button({
  label,
  onPress,
  disabled,
  loading,
  tone = 'primary',
  accessibilityHint,
  compact,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'primary' | 'secondary' | 'ghost' | 'danger';
  accessibilityHint?: string;
  compact?: boolean;
}) {
  const theme = useTheme();
  const background =
    tone === 'primary' ? theme.colors.accent
      : tone === 'danger' ? theme.colors.danger
        : tone === 'secondary' ? theme.colors.elevated
          : 'transparent';
  const color = tone === 'primary' || tone === 'danger' ? '#FFFFFF' : theme.colors.text;
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        { backgroundColor: background, borderColor: tone === 'ghost' ? theme.colors.borderStrong : 'transparent', opacity: inactive ? 0.55 : pressed ? 0.85 : 1 },
      ]}>
      {loading ? <ActivityIndicator color={color} /> : null}
      <Text weight="600" style={{ color, fontSize: compact ? 14 : 16 }}>{label}</Text>
    </Pressable>
  );
}

export function ListRow({
  title,
  subtitle,
  meta,
  onPress,
  accessibilityHint,
  trailing,
}: {
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  onPress?: () => void;
  accessibilityHint?: string;
  trailing?: React.ReactNode;
}) {
  const theme = useTheme();
  const content = (
    <View style={styles.rowInner}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text weight="600" numberOfLines={2}>{title}</Text>
        {subtitle ? <Text tone="secondary" variant="small" numberOfLines={2}>{subtitle}</Text> : null}
      </View>
      {meta ? <Text tone="muted" variant="small">{meta}</Text> : null}
      {trailing}
      {onPress ? <Text tone="muted" accessibilityElementsHidden importantForAccessibility="no">›</Text> : null}
    </View>
  );
  if (!onPress) {
    return <View style={[styles.row, { borderColor: theme.colors.border }]}>{content}</View>;
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.row, { borderColor: theme.colors.border, backgroundColor: pressed ? theme.colors.elevated : 'transparent' }]}>
      {content}
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
  placeholder,
  hint,
  error,
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string | null;
  autoComplete?: 'email' | 'password' | 'current-password' | 'new-password' | 'name' | 'off';
  editable?: boolean;
  textContentType?: 'emailAddress' | 'password' | 'newPassword' | 'name' | 'none';
  returnKeyType?: 'done' | 'next' | 'send' | 'go';
  onSubmitEditing?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <Text tone="secondary" variant="small" weight="600">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={hint}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        autoComplete={autoComplete}
        textContentType={textContentType}
        multiline={multiline}
        placeholder={placeholder}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        editable={editable}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          multiline && styles.multiline,
          { color: theme.colors.text, borderColor: error ? theme.colors.danger : theme.colors.border, backgroundColor: theme.colors.surface },
        ]}
      />
      {error ? <Text tone="danger" variant="small" accessibilityLiveRegion="polite">{error}</Text> : hint ? <Text tone="muted" variant="caption">{hint}</Text> : null}
    </View>
  );
}

/** Loading / error / empty / content switch. Every data screen uses it so no state is blank. */
export function StateView({
  loading,
  error,
  empty,
  onRetry,
  children,
  loadingLabel = 'Loading',
}: {
  loading?: boolean;
  error?: string | UserFacingError | null;
  empty?: string | null;
  onRetry?: () => void;
  children?: React.ReactNode;
  loadingLabel?: string;
}) {
  const theme = useTheme();
  if (loading) {
    return (
      <View accessibilityLabel={loadingLabel} accessibilityRole="progressbar" style={styles.state}>
        <View style={[styles.skeleton, { backgroundColor: theme.colors.elevated }]} />
        <View style={[styles.skeletonShort, { backgroundColor: theme.colors.elevated }]} />
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }
  if (error) {
    const message = typeof error === 'string' ? error : error.message;
    const label = typeof error === 'string' ? 'Error' : errorKindLabel(error.kind);
    return (
      <Card tone="danger">
        <Text weight="700" accessibilityLiveRegion="polite">{label}</Text>
        <Text tone="secondary">{message}</Text>
        {onRetry ? <Button label="Retry" tone="secondary" onPress={onRetry} compact /> : null}
      </Card>
    );
  }
  if (empty) {
    return (
      <Card>
        <Text tone="secondary">{empty}</Text>
      </Card>
    );
  }
  return <>{children}</>;
}

/**
 * Short status message. `label` is the bold heading, `children` the body; either may be omitted.
 * When only `label` is given it is rendered as the body so single-line notices stay compact.
 */
export function InlineNotice({ children, tone = 'warning', label }: { children?: string; tone?: 'warning' | 'danger' | 'success' | 'accent'; label?: string }) {
  const heading = children ? label : undefined;
  const text = children ?? label ?? '';
  return (
    <Card tone={tone} style={{ paddingVertical: space.md }}>
      {heading ? <Text weight="700" variant="small">{heading}</Text> : null}
      <Text tone={heading ? 'secondary' : 'default'} variant="small" accessibilityLiveRegion="polite">{text}</Text>
    </Card>
  );
}

export function Chip({ label, active, onPress, disabled }: { label: string; active?: boolean; onPress?: () => void; disabled?: boolean }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: Boolean(active), disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? theme.colors.accentSoft : theme.colors.surface, borderColor: active ? theme.colors.accent : theme.colors.border, opacity: disabled ? 0.5 : 1 },
      ]}>
      <Text variant="small" weight={active ? '600' : '400'} style={{ color: active ? theme.colors.accent : theme.colors.textSecondary }}>
        {active ? '✓ ' : ''}{label}
      </Text>
    </Pressable>
  );
}

export function Meter({ label, value }: { label: string; value: number | null }) {
  const theme = useTheme();
  const width = value == null ? 0 : Math.max(0, Math.min(100, value <= 1 ? value * 100 : value));
  return (
    <View accessibilityLabel={value == null ? `${label} unavailable` : `${label} ${Math.round(width)} percent`}>
      <Text tone="secondary" variant="small" style={{ marginBottom: 6 }}>{label}</Text>
      <View style={[styles.track, { backgroundColor: theme.colors.elevated }]}>
        <View style={[styles.fillBar, { width: `${width}%`, backgroundColor: theme.colors.accent }]} />
      </View>
      <Text style={{ marginTop: 4 }}>{value == null ? 'Not available' : `${Math.round(width)}`}</Text>
    </View>
  );
}

export function BarChart({ values, labels, accessibilityLabel = 'Chart' }: { values: number[]; labels: string[]; accessibilityLabel?: string }) {
  const theme = useTheme();
  const max = Math.max(1, ...values);
  return (
    <View accessibilityLabel={`${accessibilityLabel}: ${labels.map((l, i) => `${l} ${values[i] ?? 0}`).join(', ')}`} style={styles.chart}>
      {values.map((value, index) => (
        <View key={`${labels[index] ?? index}`} style={styles.barCol}>
          <View style={[styles.barTrack, { backgroundColor: theme.colors.elevated }]}>
            <View style={[styles.bar, { height: `${(value / max) * 100}%`, backgroundColor: theme.colors.violet }]} />
          </View>
          <Text variant="caption" tone="muted" numberOfLines={1}>{labels[index] ?? ''}</Text>
        </View>
      ))}
    </View>
  );
}

export function MarkdownView({ source }: { source: string }) {
  const theme = useTheme();
  const blocks = React.useMemo(() => parseMarkdown(source), [source]);
  return (
    <View>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return <Text key={index} variant="heading" weight="700" style={{ marginBottom: 6 }}>{block.text}</Text>;
        }
        if (block.type === 'code' || block.type === 'math') {
          return (
            <Text key={index} variant="mono" style={[styles.code, { backgroundColor: theme.colors.elevated }]}>
              {block.text}
            </Text>
          );
        }
        if (block.type === 'list') {
          return (
            <View key={index} style={{ marginBottom: 6 }}>
              {block.items.map((item, itemIndex) => (
                <Text key={`${index}-${itemIndex}`} style={{ marginBottom: 4, lineHeight: 22 }}>
                  {'\u2022'} {item}
                </Text>
              ))}
            </View>
          );
        }
        return (
          <Text key={index} tone={block.type === 'quote' ? 'secondary' : 'default'} style={{ marginBottom: 8, lineHeight: 22 }}>
            {block.text}
          </Text>
        );
      })}
    </View>
  );
}

export function Row({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.flexRow, style]}>{children}</View>;
}

export function Divider() {
  const theme = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.border }} />;
}

const textVariants = StyleSheet.create({
  display: { fontSize: typeScale.display, fontWeight: '700', lineHeight: 36 },
  title: { fontSize: typeScale.title, fontWeight: '700', lineHeight: 28 },
  heading: { fontSize: typeScale.heading, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: typeScale.body, lineHeight: 22 },
  small: { fontSize: typeScale.small, lineHeight: 20 },
  caption: { fontSize: typeScale.caption, lineHeight: 16 },
  mono: { fontSize: typeScale.small, fontFamily: 'monospace', lineHeight: 20 },
});

const styles = StyleSheet.create({
  fill: { flex: 1 },
  fixedPadding: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.md, gap: space.md },
  scroll: { padding: space.lg, gap: space.md, paddingBottom: 40 },
  unpadded: { padding: 0 },
  card: { borderWidth: 1, borderRadius: radius.md, padding: space.lg, gap: space.sm },
  heading: { gap: 6, marginBottom: space.xs },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  linkHit: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  button: { minHeight: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, borderWidth: 1, flexDirection: 'row', gap: 8 },
  buttonCompact: { minHeight: 44, paddingHorizontal: 14 },
  row: { borderBottomWidth: StyleSheet.hairlineWidth, minHeight: 56, justifyContent: 'center', paddingVertical: space.sm },
  rowInner: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  field: { gap: 6 },
  input: { minHeight: 48, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, fontSize: 16 },
  multiline: { minHeight: 96, textAlignVertical: 'top', paddingTop: 12 },
  state: { gap: 10, paddingVertical: 12 },
  skeleton: { height: 18, borderRadius: 8, width: '80%' },
  skeletonShort: { height: 12, borderRadius: 8, width: '45%' },
  chip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, minHeight: 40, alignItems: 'center', justifyContent: 'center' },
  track: { height: 8, borderRadius: 8, overflow: 'hidden' },
  fillBar: { height: 8 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 140 },
  barCol: { flex: 1, alignItems: 'center', height: '100%' },
  barTrack: { flex: 1, width: '70%', justifyContent: 'flex-end', borderRadius: 8, overflow: 'hidden' },
  bar: { width: '100%' },
  code: { padding: 10, borderRadius: 10, marginBottom: 8 },
  flexRow: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap', alignItems: 'center' },
});

export function muted(color: string): TextStyle {
  return { color, fontSize: typeScale.small };
}
