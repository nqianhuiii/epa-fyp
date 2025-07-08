import { useRouter } from "expo-router";
import { JSX, RefAttributes, useState } from "react";
import { ColorValue, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { Alert, AlertIcon, AlertText } from "../../components/ui/alert";
import { Button, ButtonText } from "../../components/ui/button";
import { FormControl, FormControlLabelText } from "../../components/ui/form-control";
import { Heading } from "../../components/ui/heading";
import { InfoIcon } from "../../components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../../components/ui/input";
import { Text } from "../../components/ui/text";
import { VStack } from "../../components/ui/vstack";
import { useAuthController } from "../../hooks/useAuthController";
import { Ionicons } from '@expo/vector-icons';
import CustomActivityIndicator from "../../components/custom/customActivityIndicator";
import CustomInputWithErrorMsg from "../../components/custom/customInputWithErrorMsg";
import { validateLoginForm } from "../../utils/formValidation";

export default function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword]  = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const {signIn} = useAuthController();


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
      const { isValid, errors } = validateLoginForm(email);
      setEmailError(errors.emailError);
      // setPasswordError(errors.passwordError)
      return isValid;
    }

    const handleSignIn = async() => {
      if(!validateForm()) return;
      setLoading(true);

      await signIn(email, password, handleError);
      console.log("value of showError", showError);
      setLoading(false);
    }

    const togglePasswordVisibility = () => {
        setShowPassword((showState) => !showState);
    }

    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white px-5">
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
            <VStack className="pt-24 px-5">
              <Heading className="text-3xl text-emerald-400">Log Masuk</Heading>
              <Text className="text-gray-500 text-base pt-4">Selemat Kembali ke EPA</Text>

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
                  <Button className="bg-emerald-400 mt-8 rounded-xl h-11" onPress={handleSignIn}>
                    <ButtonText>Log Masuk</ButtonText>
                  </Button>
                  <Button className="border border-emerald-400 bg-white font-medium mt-5 mb-4 rounded-xl h-11" onPress={() => router.push('/(auth)/createAccount')}>
                    <ButtonText className="text-emerald-400">Cipta Akaun</ButtonText>
                  </Button> 
                </>
              )}
            </VStack>
          </KeyboardAvoidingView>
        </SafeAreaView>
    )
}