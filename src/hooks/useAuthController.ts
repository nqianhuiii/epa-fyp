import { useAuthStore } from "../store/authStore";
import { loginUser, registerUser } from "../services/authService";
import { FirebaseError } from "firebase/app";

export const useAuthController = () => {
    const setUser = useAuthStore((state) => state.setUser)

    const signUp = async (email: string, password: string, onError: (msg:string) => void) => {
        try{
            const userCredential = await registerUser(email, password);
            setUser(userCredential.user);
            alert('Check your email for verification');
        }catch(e:any){
            const err = e as FirebaseError;
            onError(err.message);
        }
    }

    const signIn = async (email: string, password: string, onError: (msg:string) => void) => {
        try{
            const userCredential = await loginUser(email, password);
            setUser(userCredential.user);
            alert('Successfully signed in');
        }catch(e:any){
            const err = e as FirebaseError;
            onError(err.message);
        }
    }

    return {signUp, signIn};
}