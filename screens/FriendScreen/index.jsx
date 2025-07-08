import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Header from './Header';
import TabNavigation from './TabNavigation';
import UserCard from './UserCard';
import { arrayRemove, writeBatch, doc } from '@react-native-firebase/firestore';

export default function LinkedInStyleScreen() {
  const [activeTab, setActiveTab] = useState('requests');
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [exploreUsers, setExploreUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        setLoading(true);
        const currentUserId = currentUser.uid;

        // Get current user data
        const currentUserRef = firestore()
          .collection('users')
          .doc(currentUserId);
        const currentUserSnap = await currentUserRef.get();
        const currentUserData = currentUserSnap.data();

        // Get friend requests
        const requestIds = currentUserData?.inviteRequest || [];
        if (requestIds.length > 0) {
          const requestQuery = firestore()
            .collection('users')
            .where('uid', 'in', requestIds);
          const requestSnapshot = await requestQuery.get();
          setRequests(requestSnapshot.docs.map(doc => doc.data()));
        } else {
          setRequests([]);
        }

        // Get friends
        const friendIds = currentUserData?.friend || [];
        if (friendIds.length > 0) {
          const friendQuery = firestore()
            .collection('users')
            .where('uid', 'in', friendIds);
          const friendSnapshot = await friendQuery.get();
          setFriends(friendSnapshot.docs.map(doc => doc.data()));
        } else {
          setFriends([]);
        }

        // Get users to explore
        const allUsersQuery = firestore()
          .collection('users')
          .where('uid', '!=', currentUserId);
        const allUsersSnapshot = await allUsersQuery.get();
        const allUsers = allUsersSnapshot.docs.map(doc => doc.data());

        const exploreUsers = allUsers.filter(
          user =>
            !friendIds.includes(user.uid) &&
            !requestIds.includes(user.uid) &&
            !(currentUserData?.sentRequests || []).includes(user.uid),
        );
        setExploreUsers(exploreUsers);

        // Get sent requests
        setSentRequests(currentUserData?.sentRequests || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAccept = async id => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return;
      const currentUserId = currentUser.uid;

      // Batch write for atomic updates
      const batch = firestore().batch();

      const currentUserRef = firestore().collection('users').doc(currentUserId);
      batch.update(currentUserRef, {
        friend: firestore.FieldValue.arrayUnion(id),
        inviteRequest: firestore.FieldValue.arrayRemove(id),
      });

      const friendUserRef = firestore().collection('users').doc(id);
      batch.update(friendUserRef, {
        friend: firestore.FieldValue.arrayUnion(currentUserId),
        sentRequests: firestore.FieldValue.arrayRemove(currentUserId),
      });

      await batch.commit();

      // Update local state
      const acceptedUser = requests.find(user => user.uid === id);
      setRequests(prev => prev.filter(user => user.uid !== id));
      setFriends(prev => [...prev, acceptedUser]);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleReject = async id => {
    try {
      const currentUser = auth().currentUser;
      console.log(currentUser, 'this is current user');
      console.log(id, 'this is id');
      if (!currentUser || !id) {
        console.error('Missing user or senderId');
        return;
      }

      const currentUserId = currentUser.uid;

      const currentUserRef = doc(firestore(), 'users', currentUserId);
      const senderRef = doc(firestore(), 'users', id);

      const batch = writeBatch(firestore());

      batch.update(currentUserRef, {
        inviteRequest: arrayRemove(id),
      });

      batch.update(senderRef, {
        sentRequests: arrayRemove(currentUserId),
      });

      await batch.commit();

      setRequests(prev => prev.filter(user => user.uid !== id));
      console.log('✅ Friend request rejected.');
    } catch (error) {
      console.error('❌ Error rejecting friend request:', error);
    }
  };

  const handleSendRequest = async user => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return;
      const currentUserId = currentUser.uid;

      const batch = firestore().batch();

      const currentUserRef = firestore().collection('users').doc(currentUserId);
      batch.update(currentUserRef, {
        sentRequests: firestore.FieldValue.arrayUnion(user.uid),
      });

      const friendUserRef = firestore().collection('users').doc(user.uid);
      batch.update(friendUserRef, {
        inviteRequest: firestore.FieldValue.arrayUnion(currentUserId),
      });

      await batch.commit();

      setSentRequests(prev => [...prev, user.uid]);
      setExploreUsers(prev => prev.filter(u => u.uid !== user.uid));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const isRequestSent = id => sentRequests.includes(id);
  const isAlreadyFriend = id => friends.some(f => f.uid === id);

  const filteredList =
    activeTab === 'requests'
      ? requests.filter(item =>
          item.name?.toLowerCase().includes(search.toLowerCase()),
        )
      : activeTab === 'friends'
        ? friends.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase()),
          )
        : exploreUsers.filter(
            item =>
              item.name?.toLowerCase().includes(search.toLowerCase()) &&
              !isAlreadyFriend(item.uid) &&
              !isRequestSent(item.uid),
          );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Header search={search} setSearch={setSearch} />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <Text className="text-base font-bold text-gray-800 mb-2">
        {activeTab === 'requests'
          ? `New Requests (${requests.length})`
          : activeTab === 'friends'
            ? `Your Friends (${friends.length})`
            : 'People You May Know'}
      </Text>

      {filteredList.length > 0 ? (
        <FlatList
          data={filteredList}
          keyExtractor={item => item.uid}
          renderItem={({ item }) => (
            <UserCard
              item={item}
              activeTab={activeTab}
              onAccept={handleAccept}
              onReject={handleReject}
              onSendRequest={handleSendRequest}
              isRequestSent={isRequestSent}
            />
          )}
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
