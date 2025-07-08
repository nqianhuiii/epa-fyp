import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import { Alert, AlertIcon, AlertText } from "../../components/ui/alert";
import { Button, ButtonText } from "../../components/ui/button";
import { Heading } from "../../components/ui/heading";
import { InfoIcon } from "../../components/ui/icon";
import { Text } from "../../components/ui/text";
import { VStack } from "../../components/ui/vstack";
import { useAuthController } from "../../hooks/useAuthController";
import CustomInputWithErrorMsg from "../../components/custom/customInputWithErrorMsg";
import CustomActivityIndicator from "../../components/custom/customActivityIndicator";
import { validateCreateProfileForm } from "../../utils/formValidation";
import { useAlert } from "../../components/custom/alertProvider";

export default function CreateAccount(){
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword]  = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fullNameError, setFullNameError] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const {signUp} = useAuthController();
    const { showAlert } = useAlert();

    const handleError = (message: string) => {
      console.log("Setting error:", message);
      setErrorMessage(message);
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 3000);
    }

    const validateForm = () => {
        const { isValid, errors } = validateCreateProfileForm(fullName, userName, email, password);
        setFullNameError(errors.fullNameError);
        setUserNameError(errors.userNameError);
        setEmailError(errors.emailError);
        setPasswordError(errors.passwordError)
        return isValid;
    }

    const handleSignUp = async() => {
      if(!validateForm()) return;

      setLoading(true);
      await signUp(email, password, fullName, userName, handleError);
      setLoading(false);
      showAlert("Pendaftaran berjaya! Sila semak emel untuk pengesahan", "success");
    }

    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {showError && (
                <Alert action="warning" variant="solid">
                    <AlertIcon as={InfoIcon}/>
                    <AlertText>{errorMessage}</AlertText>
                </Alert>
            )}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
            <ScrollView 
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
            >
                <VStack className="flex-1 px-5 pt-12 pb-6">
                <Heading className="text-3xl text-emerald-400">Cipta Akaun</Heading>
                <Text className="text-gray-500 text-base pt-4">Mari mulakan dengan akaun baharu anda!</Text>

                <CustomInputWithErrorMsg
                    label="Name Penuh"
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
                    label="Emel"
                    value={email}
                    placeholder="Masukkan emel anda"
                    onChangeText={setEmail}
                    error={emailError}
                    required={true}
                />

                <CustomInputWithErrorMsg
                    label="Kata Laluan"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Masukkan kata laluan anda"
                    secureTextEntry={true}
                    showTogglePassword={true}
                    showPassword={showPassword}
                    onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
                    required={true}
                    error={passwordError}
                />

                {loading ? (
                    <CustomActivityIndicator/>
                ) : (
                    <>
                        <Button className="bg-emerald-400 mt-10 rounded-xl h-11" onPress={handleSignUp}>
                            <ButtonText>Cipta Akaun</ButtonText>
                        </Button>
                        <Button className="border border-emerald-400 bg-white font-medium mt-5 mb-4 rounded-xl h-11" onPress={() => router.back()}>
                            <ButtonText className="text-emerald-400">Sudah ada akaun?</ButtonText>
                        </Button> 
                    </>
                )}
                </VStack>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}