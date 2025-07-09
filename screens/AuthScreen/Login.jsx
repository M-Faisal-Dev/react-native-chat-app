import React, { useState, useContext } from 'react';
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
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react-native';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
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
      Alert.alert(
        'Login Failed',
        err.message || 'An error occurred during login',
      );
    } finally {
      setLoading(false);
    }
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
            style={{ width: 96, height: 96 }}
            className="mb-8"
          />

          {/* Title */}
          <Text className="text-3xl font-bold text-slate-800 mb-2">
            Welcome Back
          </Text>
          <Text className="text-lg text-slate-500 mb-8">
            Login to your account
          </Text>

          {/* Email Input */}
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
                autoCorrect={false}
                value={formData.email}
                onChangeText={text => handleChange('email', text)}
                // onFocus={() => setFocusedField('email')}
                // onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="w-full mb-1">
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
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            className="self-end mb-6"
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text className="text-slate-500 text-sm font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            className={`w-full bg-gray-800 rounded-md px-2 py-4 flex-row justify-center items-center ${
              loading ? 'opacity-80' : ''
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text className="text-white text-base font-semibold mr-2">
                  Login
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
              Sign in with Google
            </Text>
          </TouchableOpacity>

          {/* Sign Up */}
          <View className="flex-row">
            <Text className="text-slate-500 text-sm">
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-gray-900 text-sm font-semibold ml-1">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
