import React, { useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { Home, MessageCircle, User, Settings } from 'lucide-react-native';

// Screens
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/AuthScreen/Login';
import SignupScreen from './screens/AuthScreen/Signup';

// Create navigators outside components
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Memoized tab icons component
const TabIcon = ({ route, color, size }) => {
  switch (route) {
    case 'Home':
      return <Home color={color} size={size} />;
    case 'Chat':
      return <MessageCircle color={color} size={size} />;
    case 'Profile':
      return <User color={color} size={size} />;
    case 'Settings':
      return <Settings color={color} size={size} />;
    default:
      return null;
  }
};

// Main tabs component
const MainTabs = React.memo(() => {
  const isDarkMode = useColorScheme() === 'dark';

  const tabBarOptions = useCallback(
    () => ({
      tabBarActiveTintColor: isDarkMode ? '#f43f5e' : '#e11d48',
      tabBarInactiveTintColor: isDarkMode ? '#9ca3af' : '#6b7280',
      tabBarStyle: {
        backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
        borderTopWidth: 0,
        paddingBottom: 4,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
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
      {/* <Tab.Screen name="Chat" component={ChatScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
});

// Auth stack component
const AuthStack = React.memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
));

// Main app component
export default function App() {
  const [isLoggedIn] = useState(true); // In real app, use context or state management

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
