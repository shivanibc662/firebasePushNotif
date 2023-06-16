import React, {useEffect,useState} from 'react';
import { useRouter, Link, Redirect,useSearchParams} from 'expo-router';
import { useNavigation, useRoute } from '@react-navigation/native';
import {View,Text,Image,Button,StyleSheet,ScrollView,KeyboardAvoidingView} from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { useForm, Controller} from 'react-hook-form' ; 
import {db,auth} from '../../firebase' ; 
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
import { doc,setDoc,addDoc,getDoc,getDocs,updateDoc,getRef,collection} from 'firebase/firestore';
import {onSnapshot,query,where,orderBy,serverTimestamp} from 'firebase/firestore';

const receiverAccess = () => {
  const navigation = useRouter();
  const [adminID, setAdminID] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    
  let userId =  getUserCredentials();
  }, [auth]); // added currentUser to the dependency array
  console.log("adminPassword: ",adminPassword)
  //=================================================
  const {control, handleSubmit, watch, setValue,} = useForm({
    defaultValues: {
    },
  });
  
  const getUserCredentials = async () => {
    auth.onAuthStateChanged(async authUser => { // marked the callback function with the async keyword
      if (authUser) {
        setAdminEmail(authUser.email);
        setAdminID(authUser.uid);
        console.log("currentUser.uid is: " + authUser.uid);
        const receiverRef = doc(collection(db, 'Receiver'), authUser.uid);
        const receiverDoc = await getDoc(receiverRef);
        const adminName = receiverDoc?.data()?.name;
        const adminPassword = receiverDoc?.data()?.pin;
        setAdminName(adminName);          
        setAdminPassword(adminPassword);
      }
      return authUser.uid
    }); // added missing closing parenthesis here
  };

  const onCreatePress = async (data) => {
    console.log(data)
    // let userId =  await getUserCredentials();
    let param = {
      url: "https://us-central1-fir-noti-c7bd6.cloudfunctions.net/sendMessage",
      body: {
        message: data?.name,
        recipientId: "qgPKaKt0VhV41RKKObeR",
        senderId: "lFwpvBr7omz86x7r96eo"
      }
    }
    const response = await API(param.url,param.body)
    console.log("response =>>> ", response);
      // navigation.push(`/receiverAccess/ThankYou`);
  };

  if (true){
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.root}>
            <View style={styles.textInputContainer}>
                        
              <Text style={styles.label}>{adminName}'s Message</Text>
              <CustomInput 
                name = "name"
                placeholder = ""
                rules = {{required: ' ! '}}
                control = {control}
              />                                                    

            </View>

            <CustomButton 
              text="Send Message" 
              onPress={handleSubmit(onCreatePress)} 
            />

          </View>
        </ScrollView>
    );
  }  
};

const styles = StyleSheet.create({
  root: {
    padding: 25,
    marginTop: 10,
    marginBottom: 200,   
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,  
  }, 
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 5, 
    color: '#3A4552',
  },  
  toggleswitchtext: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    paddingLeft: 10,
    marginTop: 0,
    marginBottom: 5, 
    color: 'gray',
  }, 
  toggleswitchcontainter: {
    flexDirection: "row", 
    alignItems: "center" ,
    marginTop: 30,
  }, 
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },  
});
export default receiverAccess;