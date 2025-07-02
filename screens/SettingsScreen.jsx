import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  ChevronRight,
  Lock,
  Bell,
  Moon,
  Palette,
  Globe,
  Shield,
  HelpCircle,
  LogOut,
} from 'lucide-react-native';

const SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <Lock size={20} color="#6b7280" />,
          label: 'Privacy',
          screen: 'Privacy',
        },
        {
          icon: <Bell size={20} color="#6b7280" />,
          label: 'Notifications',
          screen: 'Notifications',
        },
        {
          icon: <Moon size={20} color="#6b7280" />,
          label: 'Dark Mode',
          rightComponent: (
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
            />
          ),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Palette size={20} color="#6b7280" />,
          label: 'Appearance',
          screen: 'Appearance',
        },
        {
          icon: <Globe size={20} color="#6b7280" />,
          label: 'Language',
          value: 'English (US)',
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon: <Shield size={20} color="#6b7280" />,
          label: 'Account Security',
          screen: 'AccountSecurity',
        },
        {
          icon: <Lock size={20} color="#6b7280" />,
          label: 'Biometric Login',
          rightComponent: (
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
            />
          ),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={20} color="#6b7280" />,
          label: 'Help Center',
          screen: 'HelpCenter',
        },
        {
          icon: <Shield size={20} color="#6b7280" />,
          label: 'Terms & Privacy Policy',
          screen: 'Terms',
        },
      ],
    },
    {
      title: 'Actions',
      items: [
        {
          icon: <LogOut size={20} color="#ef4444" />,
          label: 'Log Out',
          textColor: 'text-red-500',
          action: () => console.log('Logout'),
        },
      ],
    },
  ];

  return (
    <ScrollView className="bg-gray-50 flex-1">
      {/* Profile Header */}
      <View className="bg-white p-4 mb-4">
        <View className="flex-row items-center">
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            className="w-16 h-16 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">John Doe</Text>
            <Text className="text-gray-500">john.doe@example.com</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} className="mb-6 bg-white">
          <Text className="text-gray-500 text-sm font-medium px-4 py-2">
            {section.title}
          </Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              className={`flex-row items-center px-4 py-3 ${itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''}`}
              onPress={
                item.action ||
                (() => item.screen && navigation.navigate(item.screen))
              }
            >
              <View className="mr-3">{item.icon}</View>
              <Text className={`flex-1 ${item.textColor || 'text-gray-900'}`}>
                {item.label}
              </Text>
              {item.value && (
                <Text className="text-gray-500 mr-2">{item.value}</Text>
              )}
              {item.rightComponent || (
                <ChevronRight size={20} color="#d1d5db" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* App Version */}
      <View className="items-center py-4">
        <Text className="text-gray-400 text-sm">App Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
