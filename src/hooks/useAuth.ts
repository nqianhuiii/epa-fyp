import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "../store/authStore";
import { auth } from "../utils/firebaseConfig";
import { router } from "expo-router";

export const useAuth = () => {
    const setUser = useAuthStore((state) => state.setUser)
    const [initializing, setInitializing] = useState(true);  // to show laoding spinner while checking auth state
    
    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, (user) => {
          console.log('Auth state change', user);
          setUser(user);
          setInitializing(false);

          router.replace(user? '/(tabs)' : '/(auth)/signin');
        });
        return subscriber;
      }, []);

      return initializing;
}