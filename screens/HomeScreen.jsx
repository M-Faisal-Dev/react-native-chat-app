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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let unsubscribers = [];

    const fetchFriendsAndListen = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        const currentUserRef = firestore()
          .collection('users')
          .doc(currentUser.uid);
        const currentUserDoc = await currentUserRef.get();
        const currentUserData = currentUserDoc.data();

        const friendUIDs = currentUserData?.friend || [];
        if (friendUIDs.length === 0) {
          setUsers([]);
          setFilteredUsers([]);
          return;
        }

        const friendsData = await Promise.all(
          friendUIDs.map(uid => firestore().collection('users').doc(uid).get()),
        );

        const initialList = friendsData.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            avatar: data.avatar || 'https://i.pravatar.cc/150?img=1',
            lastMessage: 'Say hello!',
            time: '',
            unread: 0,
          };
        });

        setUsers(initialList);
        setFilteredUsers(initialList);

        // Start real-time listeners for each chat
        initialList.forEach(friend => {
          const friendId = friend.id;
          const chatId =
            currentUser.uid < friendId
              ? `${currentUser.uid}_${friendId}`
              : `${friendId}_${currentUser.uid}`;

          const unsubscribe = firestore()
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .onSnapshot(snapshot => {
              const lastMsg = snapshot.docs[0]?.data();
              if (lastMsg) {
                setUsers(prevUsers =>
                  prevUsers.map(u =>
                    u.id === friendId
                      ? {
                          ...u,
                          lastMessage: lastMsg.text || 'Say hello!',
                          time:
                            lastMsg.createdAt?.toDate().toLocaleTimeString() ||
                            '',
                        }
                      : u,
                  ),
                );
                setFilteredUsers(prevUsers =>
                  prevUsers.map(u =>
                    u.id === friendId
                      ? {
                          ...u,
                          lastMessage: lastMsg.text || 'Say hello!',
                          time:
                            lastMsg.createdAt?.toDate().toLocaleTimeString() ||
                            '',
                        }
                      : u,
                  ),
                );
              }
            });

          unsubscribers.push(unsubscribe);
        });
      } catch (err) {
        console.error('🔥 Error fetching friends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsAndListen();

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // 🔍 Search Filter
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
            <Text className="text-base text-gray-500">No friends found</Text>
          </View>
        }
      />
    </View>
  );
};

export default HomeScreen;
