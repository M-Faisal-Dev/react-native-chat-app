import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <View className="flex-row justify-around mb-3 border-b border-gray-300">
      {['requests', 'friends', 'explore'].map(tab => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          className="pb-2"
        >
          <Text
            className={`text-sm font-semibold capitalize ${
              activeTab === tab
                ? 'text-gray-600 border-b-2 border-gray-600'
                : 'text-gray-500'
            }`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabNavigation;
