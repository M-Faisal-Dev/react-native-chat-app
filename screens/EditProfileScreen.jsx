import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  User,
  FileText,
  MapPin,
  Flag,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Camera,
} from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const CLOUDINARY_URL =
  'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload';
const UPLOAD_PRESET = 'your-upload-preset';

const iconMap = {
  name: <User size={20} color="#9ca3af" style={{ marginRight: 12 }} />,
  bio: <FileText size={20} color="#9ca3af" style={{ marginRight: 12 }} />,
  location: <MapPin size={20} color="#9ca3af" style={{ marginRight: 12 }} />,
  country: <Flag size={20} color="#9ca3af" style={{ marginRight: 12 }} />,
  email: <Mail size={20} color="#9ca3af" style={{ marginRight: 12 }} />,
  phone: <Phone size={20} color="#9ca3af" style={{ marginRight: 12 }} />,
  birthDate: <Calendar size={20} color="#9ca3af" style={{ marginRight: 12 }} />,
};

const allowedKeys = [
  'avatar',
  'name',
  'bio',
  'location',
  'country',
  'email',
  'phone',
  'birthDate',
];

export default function EditProfileScreen() {
  const [userData, setUserData] = useState({
    avatar: '',
    name: '',
    bio: '',
    location: '',
    country: '',
    email: '',
    phone: '',
    birthDate: '',
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const uid = auth().currentUser?.uid;
        if (!uid) return;

        const doc = await firestore().collection('users').doc(uid).get();
        if (doc.exists) {
          const rawData = doc.data();
          const cleanData = Object.keys(rawData)
            .filter(key => allowedKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = rawData[key];
              return obj;
            }, {});
          setUserData(prev => ({ ...prev, ...cleanData }));
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (key, value) => {
    setUserData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) return;

      const dataToUpdate = {};
      allowedKeys.forEach(key => {
        if (key !== 'avatar') dataToUpdate[key] = userData[key];
      });

      await firestore().collection('users').doc(uid).update(dataToUpdate);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Update Error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async () => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.didCancel || response.errorCode) return;

      const asset = response.assets?.[0];
      if (!asset?.uri) return;

      try {
        setUploadingImage(true);

        const formData = new FormData();
        formData.append('file', {
          uri: asset.uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
        formData.append('upload_preset', UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.secure_url) {
          handleChange('avatar', data.secure_url);
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to upload image');
      } finally {
        setUploadingImage(false);
      }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-4 text-base text-slate-700">
          Loading your profile...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-1 items-center justify-center px-6 py-8">
          <TouchableOpacity
            onPress={handleImageUpload}
            className="items-center mb-6"
          >
            <Image
              source={{
                uri: userData.avatar || 'https://via.placeholder.com/120',
              }}
              className="w-28 h-28 rounded-full border"
            />
            {uploadingImage && (
              <ActivityIndicator className="absolute mt-12" color="#000" />
            )}
            <View className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow">
              <Camera size={20} color="#000" />
            </View>
          </TouchableOpacity>

          {Object.entries(userData)
            .filter(([key]) => key !== 'avatar')
            .map(([key, value]) => (
              <View key={key} className="w-full mb-4">
                <Text className="text-sm font-medium text-slate-700 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </Text>
                <View className="flex-row items-center bg-white border rounded-md px-4 py-1 border-slate-200">
                  {iconMap[key] || (
                    <User
                      size={20}
                      color="#9ca3af"
                      style={{ marginRight: 12 }}
                    />
                  )}
                  <TextInput
                    className="flex-1 text-slate-800 text-base"
                    placeholder={`Enter your ${key}`}
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={text => handleChange(key, text)}
                  />
                </View>
              </View>
            ))}

          <TouchableOpacity
            className={`w-full bg-gray-800 rounded-md px-2 py-4 flex-row justify-center items-center ${
              updating ? 'opacity-80' : ''
            }`}
            onPress={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text className="text-white text-base font-semibold mr-2">
                  Save Changes
                </Text>
                <ChevronRight size={20} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
