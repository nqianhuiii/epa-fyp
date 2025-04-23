import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import { useAlert } from "../../../components/custom/alertProvider";
import BackButton from "../../../components/custom/customBackButton";
import { Button, ButtonText } from "../../../components/ui/button";
import { FormControl, FormControlLabelText } from "../../../components/ui/form-control";
import { Input, InputField } from "../../../components/ui/input";
import { VStack } from "../../../components/ui/vstack";
import { useAuthController } from "../../../hooks/useAuthController";
import { useAuthStore } from "../../../store/authStore";

export default function EditProfile() {
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { customUserData, user } = useAuthStore();
    const { updateProfile } = useAuthController();
    const { showAlert } = useAlert();

    useEffect(() => {
        if(customUserData){
            setFullName(customUserData.fullName || '');
            setUserName(customUserData.userName || '');
        }
    }, [customUserData]);
    
    const handleUpdateProfile = async() => {
        if(!user){
            showAlert("User not found", "error");
            return;
        }

        setLoading(true);
        try{
            await updateProfile(user.uid, { fullName, userName});
            showAlert("Profile updated successfully", "success");
            router.back();
        }catch(e:any){
            showAlert(`Error updating profile: ${e.message}`, "error");
        }
        setLoading(false);
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ 
                headerShown: true, 
                headerTitle: "Edit Profile", 
                headerBackTitle: '',
                headerLeft: () => BackButton()}}/>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
            <ScrollView 
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
            >
                <VStack className="flex-1 px-4 pb-6">
                <FormControl className="mt-8">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        Full Name
                    </FormControlLabelText>
                </FormControl>
                <Input>
                    <InputField
                        value={fullName}
                        onChangeText={setFullName}
                        type="text"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter your full name"
                        className="rounded-lg"
                    />
                </Input>

                <FormControl className="mt-6">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        User Name
                    </FormControlLabelText>
                </FormControl>
                <Input>
                    <InputField
                        value={userName}
                        onChangeText={setUserName}
                        type="text"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter your username"
                        className="rounded-lg"
                    />
                </Input>

                {/* <FormControl className="mt-6">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        Email Address
                    </FormControlLabelText>
                </FormControl>
                <Input>
                    <InputField
                        value={email}
                        onChangeText={setEmail}
                        type="text"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter your email"
                        className="rounded-lg"
                    />
                </Input> */}


                {loading ? (
                    <ActivityIndicator size={"small"} color="#0D5BC4" className="mt-8"/>
                ) : (
                    <Button className="bg-emerald-400 mt-10 rounded-lg" onPress={handleUpdateProfile} >
                        <ButtonText>Edit Profile</ButtonText>
                    </Button>
                )}
                </VStack>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

