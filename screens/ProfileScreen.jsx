import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Briefcase,
} from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const uid = auth().currentUser.uid;
        const doc = await firestore().collection('users').doc(uid).get();
        if (doc.exists) {
          setUser(doc.data());
        } else {
          console.warn('User document does not exist.');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading Profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-gray-100 flex-1">
      {/* Header with Edit Button */}
      <View className="bg-white p-6 shadow-md">
        <View className="flex-row justify-end mb-4">
          <TouchableOpacity
            className="flex-row items-center bg-blue-100 px-4 py-2 rounded-full"
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Edit size={18} color="#3b82f6" />
            <Text className="text-blue-600 font-semibold ml-2">Edit</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mb-6">
          <Image
            source={{ uri: user.avatar }}
            className="w-28 h-28 rounded-full mb-4 border-4 border-white shadow"
          />
          <Text className="text-2xl font-bold text-gray-900">{user.name}</Text>
          <Text className="text-blue-500 text-base font-medium">
            {user.username}
          </Text>
          <Text className="text-center text-gray-600 mt-2 px-6">
            {user.bio}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around border-t border-b border-gray-200 py-4">
          {[
            { label: 'Posts', value: user.posts },
            { label: 'Followers', value: user.followers },
            { label: 'Following', value: user.following },
          ].map((item, index) => (
            <View key={index} className="items-center">
              <Text className="text-lg font-bold text-gray-900">
                {item.value}
              </Text>
              <Text className="text-gray-500 text-sm">{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Personal Information */}
      <View className="bg-white mt-4 mx-4 rounded-xl p-5 shadow-md">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </Text>
        <View className="space-y-5">
          {[
            {
              icon: <Briefcase size={20} color="#6b7280" />,
              label: 'Profession',
              value: user.profession,
            },
            {
              icon: <MapPin size={20} color="#6b7280" />,
              label: 'Location',
              value: `${user.location}\n${user.country}`,
            },
            {
              icon: <Mail size={20} color="#6b7280" />,
              label: 'Email',
              value: user.email,
            },
            {
              icon: <Phone size={20} color="#6b7280" />,
              label: 'Phone',
              value: user.phone,
            },
            {
              icon: <Calendar size={20} color="#6b7280" />,
              label: 'Birth Date',
              value: user.birthDate,
            },
            {
              icon: <Globe size={20} color="#6b7280" />,
              label: 'Website',
              value: user.website,
              isLink: true,
            },
          ].map((item, index) => (
            <View key={index} className="flex-row items-start gap-3">
              {item.icon}
              <View className="flex-1">
                <Text className="text-gray-500 text-sm">{item.label}</Text>
                <Text
                  className={`text-gray-900 ${item.isLink ? 'text-blue-600 underline' : ''}`}
                  onPress={() => item.isLink && Linking.openURL(item.value)}
                >
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* About Me */}
      <View className="bg-white mt-4 mx-4 rounded-xl p-5 shadow-md mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          About Me
        </Text>
        <Text className="text-gray-700 leading-relaxed">
          Experienced mobile developer with 8+ years in the industry.
          Specialized in React Native development and UI/UX design. Passionate
          about creating performant and beautiful mobile applications.
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
