import { User } from 'firebase/auth';
import {create} from 'zustand';

interface CustomUserData {
    fullName: string;
    userName: string;
}

interface AuthState {
    user: User | null;
    customUserData: CustomUserData | null;
    setUser: (user: User | null, customUserData?:CustomUserData) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null, 
    customUserData: null,
    setUser: (user, customData) => set({ user, customUserData: customData }),
    clearUser: () => set({user: null, customUserData: null}),
}));

