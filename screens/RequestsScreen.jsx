import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import { MessageCircle, Check, X, UserPlus } from 'lucide-react-native';

const dummyUsers = [
  {
    id: '3',
    name: 'Ayesha Khan',
    title: 'Frontend Developer',
    mutualConnections: 6,
    avatar: 'https://i.pravatar.cc/150?img=15',
    date: 'Today',
  },
  {
    id: '4',
    name: 'Hamza Tariq',
    title: 'UI/UX Designer',
    mutualConnections: 10,
    avatar: 'https://i.pravatar.cc/150?img=9',
    date: 'Yesterday',
  },
];

const dummyRequests = [
  {
    id: '1',
    name: 'Ali Raza',
    title: 'Senior Flutter Developer',
    mutualConnections: 24,
    avatar: 'https://i.pravatar.cc/150?img=1',
    date: 'Today',
  },
];

const dummyFriends = [
  {
    id: '2',
    name: 'Zainab Bukhari',
    title: 'Backend Developer',
    mutualConnections: 12,
    avatar: 'https://i.pravatar.cc/150?img=11',
    date: 'This week',
  },
];

export default function LinkedInStyleScreen() {
  const [activeTab, setActiveTab] = useState('requests'); // or 'explore'
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState(dummyRequests);
  const [friends, setFriends] = useState(dummyFriends);
  const [sentRequests, setSentRequests] = useState([]);

  const handleAccept = id => {
    const accepted = requests.find(item => item.id === id);
    setRequests(prev => prev.filter(item => item.id !== id));
    setFriends(prev => [...prev, accepted]);
  };

  const handleReject = id => {
    setRequests(prev => prev.filter(item => item.id !== id));
  };

  const handleSendRequest = user => {
    setSentRequests(prev => [...prev, user.id]);
  };

  const isRequestSent = id => sentRequests.includes(id);
  const isAlreadyFriend = id => friends.some(f => f.id === id);

  const filteredList =
    activeTab === 'requests'
      ? requests.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        )
      : activeTab === 'friends'
        ? friends.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()),
          )
        : dummyUsers.filter(
            item =>
              item.name.toLowerCase().includes(search.toLowerCase()) &&
              !isAlreadyFriend(item.id) &&
              !isRequestSent(item.id),
          );

  const renderCard = ({ item }) => (
    <View className="bg-blue-100 flex-row items-center p-4 rounded-xl mb-3">
      <Image
        source={{ uri: item.avatar }}
        className="w-14 h-14 rounded-full mr-4 border-2 border-green-500"
      />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {item.name}
        </Text>
        <Text className="text-gray-700 text-sm" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-gray-500 text-xs mt-1">
          {item.mutualConnections} mutual connections
        </Text>
        <Text className="text-gray-400 text-xs">{item.date}</Text>
      </View>

      {activeTab === 'requests' && (
        <View className="flex-row space-x-3 ml-2">
          <TouchableOpacity onPress={() => handleReject(item.id)}>
            <View className="w-9 h-9 rounded-full border border-gray-500 items-center justify-center">
              <X size={20} color="#4B5563" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAccept(item.id)}>
            <View className="w-9 h-9 rounded-full border border-blue-600 items-center justify-center">
              <Check size={20} color="#2563EB" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'explore' && (
        <TouchableOpacity
          onPress={() => handleSendRequest(item)}
          disabled={isRequestSent(item.id)}
        >
          <View
            className={`w-9 h-9 rounded-full border ${
              isRequestSent(item.id) ? 'border-gray-400' : 'border-green-600'
            } items-center justify-center`}
          >
            <UserPlus
              size={20}
              color={isRequestSent(item.id) ? '#9CA3AF' : '#16A34A'}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
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

      {/* Tabs */}
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
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      <Text className="text-base font-bold text-gray-800 mb-2">
        {activeTab === 'requests'
          ? 'New Requests'
          : activeTab === 'friends'
            ? `Your Friends (${friends.length})`
            : 'People You May Know'}
      </Text>

      {/* List */}
      {filteredList.length > 0 ? (
        <FlatList
          data={filteredList}
          keyExtractor={item => item.id}
          renderItem={renderCard}
        />
      ) : (
        <Text className="text-center text-gray-400 mt-10">
          No{' '}
          {activeTab === 'requests'
            ? 'requests'
            : activeTab === 'friends'
              ? 'friends'
              : 'users'}{' '}
          found.
        </Text>
      )}
    </View>
  );
}
