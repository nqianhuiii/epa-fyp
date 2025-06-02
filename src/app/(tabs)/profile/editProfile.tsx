import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import { useAlert } from "../../../components/custom/alertProvider";
import BackButton from "../../../components/custom/customBackButton";
import { Button, ButtonText } from "../../../components/ui/button";
import { VStack } from "../../../components/ui/vstack";
import { useAuthController } from "../../../hooks/useAuthController";
import { useAuthStore } from "../../../store/authStore";
import { validateUserProfileForm } from "../../../utils/formValidation";
import CustomInputWithErrorMsg from "../../../components/custom/customInputWithErrorMsg";
import CustomActivityIndicator from "../../../components/custom/customActivityIndicator";

export default function EditProfile() {
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [schoolName, setSchoolName] = useState('');

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
            setPhoneNumber(customUserData.phoneNumber || '');
            setSchoolName(customUserData.schoolName || '')
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
            showAlert("Pengguna tidak wujud", "error");
            return;
        }

        setLoading(true);
        try{
            await updateProfile(user.uid, { fullName, userName, phoneNumber, schoolName});
            showAlert("Profil berjaya dikemas kini", "success");
            router.back();
        }catch(e:any){
            showAlert(`Gagal mengemas kini profil: ${e.message}`, "error");
        }
        setLoading(false);
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ 
                headerShown: true, 
                headerTitle: "Edit Profil", 
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
                    <CustomInputWithErrorMsg
                        label="Nama Penuh"
                        value={fullName}
                        placeholder="Masukkan nama penuh anda"
                        onChangeText={setFullName}
                        error={fullNameError}
                        required={true}
                    />
                    <CustomInputWithErrorMsg
                        label="Nama Pengguna"
                        value={userName}
                        placeholder="Masukkan name pengguna anda"
                        onChangeText={setUserName}
                        error={userNameError}
                        required={true}
                    />
                    <CustomInputWithErrorMsg
                        label="Nombor Telefon"
                        value={phoneNumber}
                        placeholder="Masukkan nombor telefon anda"
                        onChangeText={setPhoneNumber}
                    />
                    <CustomInputWithErrorMsg
                        label="Nama Sekolah"
                        value={schoolName}
                        placeholder="Masukkan nama sekolah anda"
                        onChangeText={setSchoolName}
                    />
                    {loading ? (
                        <CustomActivityIndicator/>
                    ) : (
                        <Button className="bg-emerald-400 mt-10 rounded-xl h-11" onPress={handleUpdateProfile} >
                            <ButtonText>Edit Profil</ButtonText>
                        </Button>
                    )}
                </VStack>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

