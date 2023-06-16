import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import {View,Text }from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Page() {

const channelId = 'test1234';
const channelName = 'pushNotif';
const channelDescription = 'Your Channel Description';
const channelImportance = Notifications.AndroidImportance.HIGH; // Choose the importance level

// Create and configure the notification channel
async function createNotificationChannel() {
  const channel = {
    name: channelName,
    description: channelDescription,
    sound: true,
    priority: channelImportance,
    alert: true,
  };
  await Notifications.setNotificationChannelAsync(channelId, channel);
}
// Call the function to create the notification channel

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log('Device token:', token);

      setToken(token)

    });

    const setToken = async (token) => {
        try {
          await AsyncStorage.setItem('@fcm_token', token)
        } catch (e) {
          console.log("token err ",e);
          // saving error
        }
      // let param = {
      //   url : "https://us-central1-fir-noti-c7bd6.cloudfunctions.net/sendToken",
      //   body: {
      //     token: token,
      //     userId: ''
      //   }
      // }
      // let res = await API(param.url, param.body)
    }

    createNotificationChannel();

    // Handle incoming notifications when the app is in the foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    // Clean up subscriptions
    return () => {
      foregroundSubscription.remove();
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for notifications');
      return;
    }

    // token = (await Notifications.getDevicePushTokenAsync({
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: '798b5f22-921e-45b7-ab95-2fcc96d47885',
    })).data;

    return token;
  }


  return <Redirect href="/login" />
};
