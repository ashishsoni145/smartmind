import { TabIcon } from './TabIcons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, View } from 'react-native';
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ForgotPasswordScreen, LoginScreen, SignupScreen } from '../screens/auth/AuthScreens';
import { HomeScreen } from '../screens/home/HomeScreen';
import { OnboardingScreen, NotificationsScreen, ProfileScreen, SubscriptionScreen } from '../screens/profile/ProfileScreens';
import { TutorChatScreen, TutorListScreen } from '../screens/tutor/TutorScreens';
import {
  ClassroomScreen,
  LibraryScreen,
  MaterialScreen,
  MistakeDetailScreen,
  MistakesScreen,
  PlannerScreen,
  RevisionScreen,
  StudyHubScreen,
  TestDetailScreen,
  TestResultsScreen,
  TestRunnerScreen,
  TestsScreen,
  TopicScreen,
} from '../screens/study/StudyScreens';
import { FocusHomeScreen, FocusSessionScreen, FocusSetupScreen, PermissionSetupScreen } from '../screens/focus/FocusScreens';
import { AnalyticsScreen, HistoryScreen, MasteryScreen, ProgressHubScreen, ReadinessScreen } from '../screens/progress/ProgressScreens';
import { Button, Screen, Text } from '../components/ui';
import { toUserError } from '../utils/errors';
import { useAuth } from '../services/auth';
import { useStudent } from '../hooks/useStudent';
import { useTheme } from '../theme/ThemeProvider';
import { backPolicy } from './backPolicy';
import type { AuthStackParamList, FocusStackParamList, HomeStackParamList, MainTabParamList, ProgressStackParamList, StudyStackParamList, TutorStackParamList } from './types';

export const navigationRef = createNavigationContainerRef();

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const TutorStack = createNativeStackNavigator<TutorStackParamList>();
const StudyStack = createNativeStackNavigator<StudyStackParamList>();
const FocusStack = createNativeStackNavigator<FocusStackParamList>();
const ProgressStack = createNativeStackNavigator<ProgressStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function stackOptions(background: string, text: string) {
  return {
    headerStyle: { backgroundColor: background },
    headerTintColor: text,
    contentStyle: { backgroundColor: background },
  };
}

function HomeStackScreen() {
  const theme = useTheme();
  return (
    <HomeStack.Navigator screenOptions={stackOptions(theme.colors.background, theme.colors.text)}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
      <HomeStack.Screen name="Subscription" component={SubscriptionScreen} />
      <HomeStack.Screen name="Onboarding" component={OnboardingScreen} />
    </HomeStack.Navigator>
  );
}

function TutorStackScreen() {
  const theme = useTheme();
  return (
    <TutorStack.Navigator screenOptions={stackOptions(theme.colors.background, theme.colors.text)}>
      <TutorStack.Screen name="TutorList" component={TutorListScreen} options={{ title: 'AI Tutor' }} />
      <TutorStack.Screen name="TutorChat" component={TutorChatScreen} options={{ title: 'Conversation' }} />
    </TutorStack.Navigator>
  );
}

function StudyStackScreen() {
  const theme = useTheme();
  return (
    <StudyStack.Navigator screenOptions={stackOptions(theme.colors.background, theme.colors.text)}>
      <StudyStack.Screen name="StudyHub" component={StudyHubScreen} options={{ title: 'Study' }} />
      <StudyStack.Screen name="Planner" component={PlannerScreen} />
      <StudyStack.Screen name="Classroom" component={ClassroomScreen} />
      <StudyStack.Screen name="Topic" component={TopicScreen} />
      <StudyStack.Screen name="Library" component={LibraryScreen} />
      <StudyStack.Screen name="Material" component={MaterialScreen} />
      <StudyStack.Screen name="Tests" component={TestsScreen} />
      <StudyStack.Screen name="TestDetail" component={TestDetailScreen} options={{ title: 'Test' }} />
      <StudyStack.Screen name="TestRunner" component={TestRunnerScreen} options={{ title: 'Attempt', headerBackVisible: false }} />
      <StudyStack.Screen name="TestResults" component={TestResultsScreen} options={{ title: 'Results' }} />
      <StudyStack.Screen name="Revision" component={RevisionScreen} />
      <StudyStack.Screen name="Mistakes" component={MistakesScreen} />
      <StudyStack.Screen name="MistakeDetail" component={MistakeDetailScreen} options={{ title: 'Mistake' }} />
    </StudyStack.Navigator>
  );
}

function FocusStackScreen() {
  const theme = useTheme();
  return (
    <FocusStack.Navigator screenOptions={stackOptions(theme.colors.background, theme.colors.text)}>
      <FocusStack.Screen name="FocusHome" component={FocusHomeScreen} options={{ title: 'Focus' }} />
      <FocusStack.Screen name="FocusSetup" component={FocusSetupScreen} options={{ title: 'Configure' }} />
      <FocusStack.Screen name="Permissions" component={PermissionSetupScreen} />
      <FocusStack.Screen name="FocusSession" component={FocusSessionScreen} options={{ title: 'Session' }} />
    </FocusStack.Navigator>
  );
}

function ProgressStackScreen() {
  const theme = useTheme();
  return (
    <ProgressStack.Navigator screenOptions={stackOptions(theme.colors.background, theme.colors.text)}>
      <ProgressStack.Screen name="ProgressHub" component={ProgressHubScreen} options={{ title: 'Progress' }} />
      <ProgressStack.Screen name="Analytics" component={AnalyticsScreen} />
      <ProgressStack.Screen name="Readiness" component={ReadinessScreen} />
      <ProgressStack.Screen name="Mastery" component={MasteryScreen} />
      <ProgressStack.Screen name="History" component={HistoryScreen} options={{ title: 'Study history' }} />
    </ProgressStack.Navigator>
  );
}

function MainTabs() {
  const theme = useTheme();
  const [exitArmed, setExitArmed] = useState(false);
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const decision = backPolicy(navigationRef.isReady() && navigationRef.canGoBack(), exitArmed);
      if (decision === 'go-back') return false;
      if (decision === 'arm-exit') {
        setExitArmed(true);
        setTimeout(() => setExitArmed(false), 2000);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [exitArmed]);
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, minHeight: 64 },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: { fontSize: 12 },
      }}>
      <Tabs.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="TutorTab"
        component={TutorStackScreen}
        options={{
          title: 'AI Tutor',
          tabBarIcon: ({ color, focused }) => <TabIcon name="tutor" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="StudyTab"
        component={StudyStackScreen}
        options={{
          title: 'Study',
          tabBarIcon: ({ color, focused }) => <TabIcon name="study" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="FocusTab"
        component={FocusStackScreen}
        options={{
          title: 'Focus',
          tabBarIcon: ({ color, focused }) => <TabIcon name="focus" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="ProgressTab"
        component={ProgressStackScreen}
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => <TabIcon name="progress" color={color} focused={focused} />,
        }}
      />
    </Tabs.Navigator>
  );
}

function Authenticated() {
  const student = useStudent();
  const auth = useAuth();
  const completed = (student.profile as { onboardingCompleted?: boolean } | null)?.onboardingCompleted;
  if (student.loading) return <Boot label="Loading academic profile" />;
  if (student.error && !student.profile && !student.me) {
    // Profile never loaded (offline, server down, 5xx). Do not drop the user into tabs full of errors.
    const error = toUserError(student.error);
    return <ProfileUnavailable message={error.message} onRetry={() => student.refetch()} onSignOut={() => auth.signOut()} />;
  }
  if (student.profile && completed === false) return <OnboardingGate />;
  return <MainTabs />;
}

function ProfileUnavailable({ message, onRetry, onSignOut }: { message: string; onRetry: () => void; onSignOut: () => void }) {
  return (
    <Screen headerless>
      <View style={{ flex: 1, justifyContent: 'center', gap: 12, paddingVertical: 48 }}>
        <Text variant="title" weight="700">Could not load your profile</Text>
        <Text tone="secondary">{message}</Text>
        <Button label="Try again" onPress={onRetry} />
        <Button label="Sign out" tone="ghost" onPress={onSignOut} />
      </View>
    </Screen>
  );
}

function OnboardingGate() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <OnboardingScreen standalone />
    </View>
  );
}

function Boot({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background, gap: 12 }}>
      <ActivityIndicator color={theme.colors.accent} />
      <Text tone="secondary">{label}</Text>
    </View>
  );
}

export function RootNavigator() {
  const auth = useAuth();
  const theme = useTheme();
  if (!auth.ready) return <Boot label="Restoring session" />;
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={{
        prefixes: ['sharpmind://app'],
        config: {
          screens: {
            HomeTab: { screens: { Home: 'home', Profile: 'profile', Notifications: 'notifications', Subscription: 'subscription' } },
            StudyTab: { screens: { StudyHub: 'study', Planner: 'study/planner', Revision: 'study/revision', Tests: 'study/tests' } },
            FocusTab: { screens: { FocusHome: 'focus', FocusSession: 'focus/session', Permissions: 'focus/permissions' } },
            ProgressTab: { screens: { ProgressHub: 'progress' } },
          },
        },
      }}
      theme={{
        ...DefaultTheme,
        dark: theme.name === 'dark',
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.accent,
        },
      }}>
      {auth.user ? <Authenticated /> : (
        <AuthStack.Navigator screenOptions={stackOptions(theme.colors.background, theme.colors.text)}>
          <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <AuthStack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign up' }} />
          <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset password' }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

export { backPolicy };
