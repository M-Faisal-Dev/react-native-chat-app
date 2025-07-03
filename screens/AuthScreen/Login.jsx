import React, { useState, useEffect, useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In clicked');
  };
  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      console.log('Login error:', err);
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadMessage = async () => {
    try {
      await firestore().collection('messages').add({
        text: 'Hello from Faisal',
        senderId: 'faisal_001',
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      console.log('Message sent!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    // Call the uploadMessage function when the component mounts
    uploadMessage();
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="flex-1 items-center justify-center p-4">
        <Image
          source={require('../../assets/logo.png')}
          className="w-32 h-32 mb-8"
        />

        <Text className="text-2xl font-bold mb-6 text-gray-800">Login</Text>

        <View className="w-full mb-4">
          <Text className="text-gray-700 mb-1">Email</Text>
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-300"
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
          />
        </View>

        <View className="w-full mb-6">
          <Text className="text-gray-700 mb-1">Password</Text>
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-300"
            placeholder="••••••••"
            secureTextEntry
            value={formData.password}
            onChangeText={text => handleChange('password', text)}
          />
        </View>

        <TouchableOpacity
          className="w-full flex-row items-center justify-center bg-white p-3 rounded-lg border border-gray-300 mb-4"
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#DB4437" />
          ) : (
            <>
              <Image
                source={require('../../assets/google.png')} // Make sure you have this image in your assets
                style={{ width: 20, height: 20, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text className="text-gray-700 font-medium">
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-blue-500 p-3 rounded-lg mb-4"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-bold">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mb-4"
          onPress={() => navigation.navigate('Signup')}
        >
          <Text className="text-blue-500">Don't have an account? Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text className="text-gray-500">Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
