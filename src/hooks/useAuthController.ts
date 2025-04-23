import { FirebaseError } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { loginUser, registerUser } from "../services/authService";
import { createUserAccount, getUserData, updateUserAccount } from "../services/userService";
import { useAuthStore } from "../store/authStore";
import { auth } from "../utils/firebaseConfig";

export const useAuthController = () => {

    const signUp = async (email: string, password: string, fullName: string, userName: string, onError: (msg:string) => void) => {
        try{
            // create auth account
            const userCredential = await registerUser(email, password);

            // create user profile in firestore
            await createUserAccount(userCredential.user.uid, {
                fullName, 
                userName,
                email,
                createdAt: new Date(),
            });

            // update zustand store
            useAuthStore.getState().setUser(userCredential.user, {fullName, userName});

            onError("Verification email sent. Please verify before logging in.");
        }catch(e:any){
            const err = e as FirebaseError;
            onError(err.message);
        }
    }

    const signIn = async (email: string, password: string, onError: (msg:string) => void) => {
        try{
            const userCredential = await loginUser(email, password);

            // check if email is not verified
            if(!userCredential.user.emailVerified){
                onError("Email not verified.");
                auth.signOut();                
                return;
            }

            const userData = await getUserData(userCredential.user.uid);

            // update zustand store
            useAuthStore.getState().setUser(
                userCredential.user, 
                {
                    fullName: userData?.fullName,
                    userName: userData?.userName,
                }   
            );

        }catch(e:any){
            const err = e as FirebaseError;

            let message = "An error occurred";
            switch(err.code) {
              case "auth/invalid-email":
                message = "Invalid email address";
                break;
              case "auth/user-not-found":
              case "auth/wrong-password":
                message = "Invalid email or password";
                break;
              default:
                message = err.message;
            }

            onError(message);
        }
    }

    // to load user data on app initialization
    const initializeAuth = () => {

        return onAuthStateChanged(auth, async (user)=> {
            if(user){
                if(user?.emailVerified){

                    const userData = await getUserData(user.uid);
    
                    useAuthStore.getState().setUser(
                        user, 
                        {
                            fullName: userData?.fullName,
                            userName: userData?.userName,
                        }   
                    );
                }else{
                    // handle unverified email
                    auth.signOut();
                    useAuthStore.getState().clearUser();
                }
            }else{
                // user is signed out
                useAuthStore.getState().clearUser();
            }
        })
    }

    const updateProfile = async(userId: string, profileData: {fullName: string, userName: string}) => {
        try{
            // update profile in firestore
            await updateUserAccount(userId, profileData);

            // update zustand store
            const user = useAuthStore.getState().user;
            if(user){
                useAuthStore.getState().setUser(
                    user, 
                    {
                        fullName: profileData.fullName,
                        userName: profileData.userName,
                    }   
                );
            }
        }catch(e:any){
            // need proper error message display 
            console.log(e);
        }
    }

    return {signUp, signIn, initializeAuth, updateProfile};
}