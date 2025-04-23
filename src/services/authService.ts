import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
  
export const registerUser = async(email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if(userCredential.user){
        await sendEmailVerification(userCredential.user);
        await auth.signOut(); // force the user to sign out after verification email is sent, and need re-signin again
    }
    
    return userCredential;
}

export const loginUser = async(email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
}

// GoogleSignin.configure({
//     webClientId:'444616892950-b3kcgok3f5pmnelp2daal298dlhil887.apps.googleusercontent.com'
// })

// export const loginWithGoogle = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       console.log(userInfo);
//       return userInfo;
//     } catch (error) {
//       console.error('Google Sign-In Error:', error);
  
//       // Type guard for NativeModuleError (Google Sign-In specific errors)
//       if (error && typeof error === 'object' && 'code' in error) {
//         switch (error.code) {
//           case statusCodes.SIGN_IN_CANCELLED:
//             throw new Error('User cancelled the sign-in flow');
//           case statusCodes.IN_PROGRESS:
//             throw new Error('Sign-in is already in progress');
//           case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//             throw new Error('Play Services not available or outdated');
//           default:
//             throw new Error(`Google Sign-In Error: ${error.code}`);
//         }
//       }
//       // Handle non-Google errors
//       else if (error instanceof Error) {
//         throw new Error(error.message);
//       }
//       // Fallback for completely unknown errors
//       else {
//         throw new Error('An unknown error occurred during Google Sign-In');
//       }
//     }
//   };