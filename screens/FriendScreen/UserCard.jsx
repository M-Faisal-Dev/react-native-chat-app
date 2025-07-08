import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Check, X, UserPlus } from 'lucide-react-native';

const UserCard = ({
  item,
  activeTab,
  onAccept,
  onReject,
  onSendRequest,
  isRequestSent,
}) => {
  console.log(item, 'this is item id');

  return (
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
          <TouchableOpacity onPress={() => onReject(item.uid)}>
            <View className="w-9 h-9 rounded-full border border-gray-500 items-center justify-center">
              <X size={20} color="#4B5563" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onAccept(item.uid)}>
            <View className="w-9 h-9 rounded-full border border-blue-600 items-center justify-center">
              <Check size={20} color="#2563EB" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'explore' && (
        <TouchableOpacity
          onPress={() => onSendRequest(item)}
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
};

export default UserCard;
