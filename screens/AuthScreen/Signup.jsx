import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log('Signup data:', formData);
    // Add your signup logic here
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In clicked');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="flex-1 items-center justify-center p-4">
        <Image
          source={require('../../assets/logo.png')}
          className="w-32 h-32 mb-8"
        />

        <Text className="text-2xl font-bold mb-6 text-gray-800">
          Create Account
        </Text>

        <View className="w-full mb-4">
          <Text className="text-gray-700 mb-1">Full Name</Text>
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-300"
            placeholder="John Doe"
            value={formData.name}
            onChangeText={text => handleChange('name', text)}
          />
        </View>

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

        <View className="w-full mb-4">
          <Text className="text-gray-700 mb-1">Password</Text>
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-300"
            placeholder="••••••••"
            secureTextEntry
            value={formData.password}
            onChangeText={text => handleChange('password', text)}
          />
        </View>

        <View className="w-full mb-6">
          <Text className="text-gray-700 mb-1">Confirm Password</Text>
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-300"
            placeholder="••••••••"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={text => handleChange('confirmPassword', text)}
          />
        </View>

        <TouchableOpacity
          className="w-full bg-blue-500 p-3 rounded-lg mb-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-bold">Sign Up</Text>
        </TouchableOpacity>

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

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="text-blue-500">Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
