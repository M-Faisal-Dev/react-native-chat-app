import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../../context/AuthContext';

const VerifyEmailScreen = ({ navigation }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(300); // 5-minute timer (in seconds)
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext);

  // Timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          Alert.alert(
            'Time’s Up',
            'Verification time expired. Please try again.',
          );
          navigation.navigate('Login'); // Redirect to login if time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigation]);

  // Format timer as MM:SS
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Check email verification status
  const checkVerification = async () => {
    setIsLoading(true);
    try {
      const user = auth().currentUser;
      await user.reload(); // Reload user data
      if (user.emailVerified) {
        console.log(
          user,
          'this is the user object after reload, it should have emailVerified set to true if the email is verified. ',
        );
        setIsVerified(true);
        setUser(user);
      } else {
        Alert.alert('Not Verified', 'Please verify your email first.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email
  const resendEmail = async () => {
    setIsLoading(true);
    try {
      const user = auth().currentUser;
      await user.sendEmailVerification();
      Alert.alert('Email Sent', 'Verification email has been resent.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification email.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center p-6">
      <View className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <Text className="text-2xl font-bold text-center text-gray-800 mb-4">
          Verify Your Email
        </Text>
        <Text className="text-center text-gray-600 mb-6">
          Please check your email and click the verification link to continue.
        </Text>
        <View className="flex-row justify-center mb-6">
          <Text className="text-lg font-semibold text-red-500">
            Time remaining: {formatTime(timer)}
          </Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#3B82F6" />
        ) : (
          <>
            <TouchableOpacity
              className="bg-blue-500 rounded-lg py-3 mb-4"
              onPress={checkVerification}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-semibold">
                I've Verified My Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-300 rounded-lg py-3"
              onPress={resendEmail}
              disabled={isLoading}
            >
              <Text className="text-gray-800 text-center font-semibold">
                Resend Verification Email
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default VerifyEmailScreen;
