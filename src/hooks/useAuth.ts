import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
    const setUser = useAuthStore((state) => state.setUser)
    const [initializing, setInitializing] = useState(true);
    
    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, (user) => {
          console.log('Auth state change', user);
          setUser(user);
          setInitializing(false);
        });
        
        return subscriber;
    }, []);

    return initializing;
}