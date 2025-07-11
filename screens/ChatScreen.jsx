import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Send, Paperclip, Mic } from 'lucide-react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../../context/AuthContext';

const ChatScreen = ({ route, navigation }) => {
  const { userId, userName, userAvatar } = route.params;
  const currentUser = auth().currentUser;
  const db = firestore();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef();

  const chatId =
    currentUser.uid < userId
      ? `${currentUser.uid}_${userId}`
      : `${userId}_${currentUser.uid}`;

  useEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const trimmedMessage = newMessage.trim();
    const timestamp = firestore.FieldValue.serverTimestamp();

    try {
      const messageRef = db
        .collection('chats')
        .doc(chatId)
        .collection('messages');

      await messageRef.add({
        text: trimmedMessage,
        senderId: currentUser.uid,
        receiverId: userId,
        createdAt: timestamp,
      });

      // 🔄 Update lastMessage for both users
      const userRef1 = db.collection('users').doc(currentUser.uid);
      const userRef2 = db.collection('users').doc(userId);

      const updates = {
        lastMessage: trimmedMessage,
        lastSeen: timestamp, // optionally update lastSeen too
      };

      await Promise.all([userRef1.update(updates), userRef2.update(updates)]);

      setNewMessage('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center pl-3"
        >
          <ArrowLeft size={24} color="#3b82f6" />
          <Image
            source={{ uri: userAvatar }}
            className="w-8 h-8 rounded-full ml-3"
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View className="ml-1">
          <Text className="font-semibold text-base">{userName}</Text>
          <Text className="text-green-500 text-xs">Online</Text>
        </View>
      ),
    });
  }, [navigation, userName, userAvatar]);

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === currentUser.uid;
    return (
      <View className={`mb-2 px-4 ${isMe ? 'items-end' : 'items-start'}`}>
        <View
          className={`p-3 rounded-xl shadow-sm max-w-[80%] ${
            isMe ? 'bg-blue-500 rounded-br-none' : 'bg-gray-200 rounded-bl-none'
          }`}
        >
          <Text className={`text-sm ${isMe ? 'text-white' : 'text-gray-800'}`}>
            {item.text}
          </Text>
          <Text
            className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}
          >
            {item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 10, paddingBottom: 90 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 shadow-sm">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="p-2">
            <Paperclip size={22} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Mic size={22} color="#6b7280" />
          </TouchableOpacity>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-sm"
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full ${
              newMessage.trim() ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
