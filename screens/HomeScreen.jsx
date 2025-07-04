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

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // 🔥 Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const firestore = getFirestore();
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(
          query(usersCollection, orderBy('name')),
        );

        const userList = usersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            avatar: data.avatar || 'https://i.pravatar.cc/150?img=1',
            lastMessage: data.lastMessage || 'Say hello!',
            time: data.lastSeen?.toDate().toLocaleTimeString() || 'Now',
            unread: data.unread || 0,
          };
        });

        setUsers(userList);
        setFilteredUsers(userList);
      } catch (err) {
        console.error('🔥 Firestore fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔍 Filter search
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

  // 🧱 Render user row
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
      {/* 🔎 Search Bar */}
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
