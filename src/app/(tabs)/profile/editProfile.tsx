import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import { useAlert } from "../../../components/custom/alertProvider";
import BackButton from "../../../components/custom/customBackButton";
import { Button, ButtonText } from "../../../components/ui/button";
import { FormControl, FormControlHelperText, FormControlLabelText } from "../../../components/ui/form-control";
import { Input, InputField } from "../../../components/ui/input";
import { VStack } from "../../../components/ui/vstack";
import { useAuthController } from "../../../hooks/useAuthController";
import { useAuthStore } from "../../../store/authStore";
import { validateUserProfileForm } from "../../../utils/formValidation";

export default function EditProfile() {
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    // const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [fullNameError, setFullNameError] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const { customUserData, user } = useAuthStore();
    const { updateProfile } = useAuthController();
    const { showAlert } = useAlert();

    // set the initial form fields with the user data 
    useEffect(() => {
        if(customUserData){
            setFullName(customUserData.fullName || '');
            setUserName(customUserData.userName || '');
        }
    }, [customUserData]);
    
    const validateForm = () => {
        const { isValid, errors } = validateUserProfileForm(fullName, userName);
        setFullNameError(errors.fullNameError);
        setUserNameError(errors.userNameError);
        return isValid;
    }

    const handleUpdateProfile = async() => {
        if(!validateForm()) return;

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
                headerShadowVisible: false,
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
                <VStack className="flex-1 px-5 pb-6">
                <FormControl className="mt-8">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        Full Name
                    </FormControlLabelText>
                    <Input className="h-11 rounded-xl border-0 shadow-none p-0">
                        <InputField
                            value={fullName}
                            onChangeText={setFullName}
                            type="text"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Enter your full name"
                            className={`rounded-xl border px-3 py-2  ${
                                fullNameError 
                                  ? 'border-red-500 focus:border-red-500' 
                                  : 'border-gray-300 focus:border-gray-300'
                              }`}
                        />
                    </Input>
                    {fullNameError ? (
                        <FormControlHelperText className="text-red-500 mt-1">
                            {fullNameError}
                        </FormControlHelperText>
                    ) : null}
                </FormControl>

                <FormControl className="mt-6">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        User Name
                    </FormControlLabelText>
                    <Input className="h-11 rounded-xl border-0 shadow-none p-0">
                        <InputField
                            value={userName}
                            onChangeText={setUserName}
                            type="text"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Enter your username"
                            className={`rounded-xl border px-3 py-2  ${
                                userNameError
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:border-gray-300'
                            }`}
                        />
                    </Input>
                    {userNameError ? (
                        <FormControlHelperText className="text-red-500 mt-1">
                            {userNameError}
                        </FormControlHelperText>
                    ) : null}                    
                </FormControl>

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

