import "@/global.css";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";
import { auth } from "../utils/firebaseConfig";
// import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthStateChanged, User } from 'firebase/auth';


export default function Layout(){

  const [user, setUser] =useState<User | null>(null)
  const [initializing, setInitializing] = useState(true);  // show laoding spinner while checking auth state

  // const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
  //   console.log('onAuthStateChanged', user);
  //   setUser(user);
  // }

  // useEffect(() => {
  //   const subscriber = onAuthStateChanged(auth, (user: User | null) => {
  //     console.log('Auth state change', user);
  //     setUser(user);
  //     if(initializing) setInitializing(false);
  //   });

  //   return subscriber;
  // }, []);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user: User | null) => {
      console.log('Auth state change', user);
      setInitializing(false);
      if(user){
        router.replace('/(tabs)');
      }else{
        router.replace('/(auth)/signin');
      }
    });
    return subscriber;
  }, []);

  if(initializing){
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small"/>
      </View>
    )
  }

  return (
    <GluestackUIProvider mode="light">
      <Stack/>
    </GluestackUIProvider>
  );
}