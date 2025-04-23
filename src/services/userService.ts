import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const createUserAccount = async (
    userId: string, 
    userData: {
        fullName: string;
        userName: string;
        email: string;
        createdAt: Date; 
    }
) => {
    await setDoc(doc(db, "users", userId), {
        ...userData,
        upadatedAt: new Date(),
    })
}

export const getUserData = async (userId: string) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
}

export const updateUserAccount = async(
    userId:string,
    userData: {
        fullName: string;
        userName: string;
    }
 ) => {
    await updateDoc(doc(db, "users", userId), {
        ...userData,
        updatedAt: new Date(),
    })
 }
