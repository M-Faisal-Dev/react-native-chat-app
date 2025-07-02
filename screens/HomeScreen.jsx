import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch mock users
  useEffect(() => {
    const fetchUsers = async () => {
      setTimeout(() => {
        const mockUsers = [
          {
            id: '1',
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            lastMessage: 'Hey, how are you doing?',
            time: '10:30 AM',
            unread: 2,
          },
          {
            id: '2',
            name: 'Jane Smith',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            lastMessage: 'Can we meet tomorrow?',
            time: 'Yesterday',
            unread: 0,
          },
          {
            id: '3',
            name: 'Alex Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            lastMessage: 'The project is due next week',
            time: 'Monday',
            unread: 5,
          },
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setLoading(false);
      }, 1000);
    };
    fetchUsers();
  }, []);

  // Filter search
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row py-3 border-b border-gray-200 items-center"
      onPress={() =>
        navigation.navigate('Chat', {
          userId: item.id,
          userName: item.name,
        })
      }
    >
      <Image
        source={{ uri: item.avatar }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        <View className="flex-row justify-between mb-1">
          <Text className="text-base font-semibold">{item.name}</Text>
          <Text className="text-xs text-gray-500">{item.time}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600 flex-1 mr-2" numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View className="bg-blue-500 rounded-full w-5 h-5 justify-center items-center">
              <Text className="text-white text-xs font-bold">
                {item.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* ✅ Custom Search Bar */}
      <View className="px-4 pt-4 pb-2">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search users..."
          placeholderTextColor="#9ca3af"
          className="bg-gray-100 px-4 py-2 rounded-full text-base text-black"
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-12">
            <Text className="text-base text-gray-500">No users found</Text>
          </View>
        }
      />
    </View>
  );
};

export default HomeScreen;
