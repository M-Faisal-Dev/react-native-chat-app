import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const EditProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    bio: '',
    profession: '',
    location: '',
    country: '',
    email: '',
    phone: '',
    birthDate: '',
    website: '',
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const uid = auth().currentUser.uid;
        const doc = await firestore().collection('users').doc(uid).get();
        if (doc.exists) {
          setUserData(prev => ({ ...prev, ...doc.data() }));
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const uid = auth().currentUser.uid;
      await firestore().collection('users').doc(uid).update(userData);
      Alert.alert('Success', 'Profile updated!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading Profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4 text-gray-800">
        Edit Profile
      </Text>

      {[
        { label: 'Name', field: 'name' },
        { label: 'Username', field: 'username' },
        { label: 'Bio', field: 'bio', multiline: true },
        { label: 'Profession', field: 'profession' },
        { label: 'Location', field: 'location' },
        { label: 'Country', field: 'country' },
        { label: 'Email', field: 'email' },
        { label: 'Phone', field: 'phone' },
        { label: 'Birth Date', field: 'birthDate' },
        { label: 'Website', field: 'website' },
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <Text className="text-sm text-gray-600 mb-1">{item.label}</Text>
          <TextInput
            value={userData[item.field]}
            onChangeText={text => handleChange(item.field, text)}
            placeholder={`Enter ${item.label}`}
            multiline={item.multiline}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={handleUpdate}
        disabled={updating}
        className="bg-blue-500 rounded-full py-3 mt-6"
      >
        <Text className="text-center text-white font-semibold text-base">
          {updating ? 'Updating...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;
