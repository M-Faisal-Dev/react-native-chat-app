import React, { useCallback, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { Home, User, Settings, Network } from 'lucide-react-native';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Screens
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import RequestsScreen from './screens/FriendScreen/index';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/AuthScreen/Login';
import SignupScreen from './screens/AuthScreen/Signup';
import VerifyEmailScreen from './screens/AuthScreen/VerifyEmail';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab icons
const TabIcon = ({ route, color, size }) => {
  switch (route) {
    case 'Home':
      return <Home color={color} size={size} />;
    case 'Profile':
      return <User color={color} size={size} />;
    case 'Settings':
      return <Settings color={color} size={size} />;
    case 'Network':
      return <Network color={color} size={size} />;
    default:
      return null;
  }
};

// Tabs only (excluding Chat)
const MainTabs = React.memo(() => {
  const isDarkMode = useColorScheme() === 'dark';

  const tabBarOptions = useCallback(
    () => ({
      tabBarActiveTintColor: isDarkMode ? '#f43f5e' : '#e11d48', // rose-500 / rose-600
      tabBarInactiveTintColor: isDarkMode ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
      tabBarStyle: {
        backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb', // gray-800 / gray-50
        borderTopWidth: 0,
        paddingBottom: 4,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '300', // ↓ lighter than default
        marginBottom: 4,
      },
      headerShown: false,
    }),
    [isDarkMode],
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...tabBarOptions(),
        tabBarIcon: ({ color, size }) => (
          <TabIcon route={route.name} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Network" component={RequestsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
});

// Auth screens
const AuthStack = React.memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
  </Stack.Navigator>
));

// App logic
const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

// Final export
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
