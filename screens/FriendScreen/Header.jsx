import React from 'react';
import { View, Image, TextInput, TouchableOpacity } from 'react-native';
import { MessageCircle } from 'lucide-react-native';

const Header = ({ search, setSearch }) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=4' }}
        className="w-10 h-10 rounded-full"
      />
      <TextInput
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
        className="flex-1 mx-3 px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-900"
        placeholderTextColor="#9CA3AF"
      />
      <TouchableOpacity>
        <MessageCircle size={24} color="#4B5563" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
