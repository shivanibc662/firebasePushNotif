import "expo-router/entry";
import * as Notifications from 'expo-notifications';

 Notifications.addNotificationReceivedListener((notification) => {
    console.log('Notification received:', notification);
  });