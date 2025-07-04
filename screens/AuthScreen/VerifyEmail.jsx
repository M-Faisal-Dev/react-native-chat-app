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
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';

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

  const checkVerification = async ({
    setIsLoading,
    setIsVerified,
    setUser,
  }) => {
    setIsLoading(true);

    try {
      const auth = getAuth();
      const firestore = getFirestore();
      const user = auth.currentUser;

      // Refresh auth state
      await user.reload();

      if (user.emailVerified) {
        const userRef = doc(firestore, 'users', user.uid);
        const snapshot = await getDoc(userRef);

        console.log('Checking user document:', snapshot.exists());

        if (!snapshot.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName || '',
            username: '', // Let user set this later
            email: user.email || '',
            phone: user.phoneNumber || '',
            avatar: user.photoURL || '',
            bio: '',
            location: '',
            country: '',
            birthDate: '',
            website: '',
            profession: '',
            totalContacts: 0,
            status: 'online',
            lastSeen: new Date(),
            createdAt: serverTimestamp(),
          });

          console.log('✅ User saved to Firestore');
        } else {
          console.log('⚠️ User already exists in Firestore');
        }

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
              onPress={() =>
                checkVerification({
                  setIsLoading,
                  setIsVerified,
                  setUser,
                })
              }
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
