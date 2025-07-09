import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  Mail,
  Lock,
  User,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react-native';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      await userCredential.user.sendEmailVerification();

      await userCredential.user.updateProfile({ displayName: name });

      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('VerifyEmail');
    } catch (error) {
      console.log(error);
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In clicked');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 items-center justify-center px-6 py-12">
          {/* Logo */}
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 66, height: 66 }}
            className="mb-4"
          />

          {/* Title */}
          <Text className="text-2xl font-bold text-slate-800 mb-2">
            Create Account
          </Text>
          <Text className="text-base text-slate-500 mb-4">
            Sign up to get started
          </Text>

          {/* Name Field */}
          <View className="w-full mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-2">
              Full Name
            </Text>
            <View
              className={`flex-row items-center bg-white border rounded-md px-4 py-1 ${
                focusedField === 'name'
                  ? 'border-blue-500 shadow-sm shadow-blue-200'
                  : 'border-slate-200'
              }`}
            >
              <User size={20} color="#9ca3af" style={{ marginRight: 12 }} />
              <TextInput
                className="flex-1 text-slate-800 text-base"
                placeholder="Enter your name"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onChangeText={text => handleChange('name', text)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Email Field */}
          <View className="w-full mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-2">
              Email Address
            </Text>
            <View
              className={`flex-row items-center bg-white border rounded-md px-4 py-1 ${
                focusedField === 'email'
                  ? 'border-blue-500 shadow-sm shadow-blue-200'
                  : 'border-slate-200'
              }`}
            >
              <Mail size={20} color="#9ca3af" style={{ marginRight: 12 }} />
              <TextInput
                className="flex-1 text-slate-800 text-base"
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={text => handleChange('email', text)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Password Field */}
          <View className="w-full mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-2">
              Password
            </Text>
            <View
              className={`flex-row items-center bg-white border rounded-md px-4 py-1 ${
                focusedField === 'password'
                  ? 'border-blue-500 shadow-sm shadow-blue-200'
                  : 'border-slate-200'
              }`}
            >
              <Lock size={20} color="#9ca3af" style={{ marginRight: 12 }} />
              <TextInput
                className="flex-1 text-slate-800 text-base"
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={text => handleChange('password', text)}
                // onFocus={() => setFocusedField('password')}
                // onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-2"
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Field */}
          <View className="w-full mb-6">
            <Text className="text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </Text>
            <View
              className={`flex-row items-center bg-white border rounded-md px-4 py-1 ${
                focusedField === 'confirmPassword'
                  ? 'border-blue-500 shadow-sm shadow-blue-200'
                  : 'border-slate-200'
              }`}
            >
              <Lock size={20} color="#9ca3af" style={{ marginRight: 12 }} />
              <TextInput
                className="flex-1 text-slate-800 text-base"
                placeholder="Confirm your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showConfirmPassword}
                value={formData.confirmPassword}
                onChangeText={text => handleChange('confirmPassword', text)}
                // onFocus={() => setFocusedField('confirmPassword')}
                // onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-2"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            className={`w-full bg-gray-800 rounded-md px-2 py-4 flex-row justify-center items-center ${
              loading ? 'opacity-80' : ''
            }`}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text className="text-white text-base font-semibold mr-2">
                  Sign Up
                </Text>
                <ChevronRight size={20} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center w-full my-6">
            <View className="flex-1 h-px bg-slate-200" />
            <Text className="px-3 text-slate-500 text-sm">
              or continue with
            </Text>
            <View className="flex-1 h-px bg-slate-200" />
          </View>

          {/* Google Sign In */}
          <TouchableOpacity
            className={`w-full bg-white border border-slate-200 rounded-md px-6 py-3 flex-row justify-center items-center mb-6 ${
              loading ? 'opacity-70' : ''
            }`}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <Image
              source={require('../../assets/google.png')}
              style={{ width: 20, height: 20, marginRight: 12 }}
            />
            <Text className="text-slate-700 text-base font-medium">
              Sign up with Google
            </Text>
          </TouchableOpacity>

          {/* Already have an account */}
          <View className="flex-row">
            <Text className="text-slate-500 text-sm">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-gray-900 text-sm font-semibold ml-1">
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
