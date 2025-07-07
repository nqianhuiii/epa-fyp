import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import { Alert, AlertIcon, AlertText } from "../../components/ui/alert";
import { Button, ButtonText } from "../../components/ui/button";
import { FormControl, FormControlLabelText } from "../../components/ui/form-control";
import { Heading } from "../../components/ui/heading";
import { InfoIcon } from "../../components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../../components/ui/input";
import { Text } from "../../components/ui/text";
import { VStack } from "../../components/ui/vstack";
import { useAuthController } from "../../hooks/useAuthController";
import CustomInputWithErrorMsg from "../../components/custom/customInputWithErrorMsg";
import { Ionicons } from '@expo/vector-icons';
import CustomActivityIndicator from "../../components/custom/customActivityIndicator";

export default function CreateAccount(){
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword]  = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fullNameError, setFullNameError] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const {signUp} = useAuthController();

    const handleError = (message: string) => {
      console.log("Setting error:", message);
      setErrorMessage(message);
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 3000);
    }

    const handleSignUp = async() => {
      setLoading(true);
      await signUp(email, password, fullName, userName, handleError);
      setLoading(false);
    }

    const togglePasswordVisibility = () => {
        setShowPassword((showState) => !showState);
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
                />

                <FormControl className="mt-6">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        Nama Pengguna
                    </FormControlLabelText>
                </FormControl>
                <Input className="rounded-xl h-11 bg-gray-100 border-0">
                    <InputField
                        value={userName}
                        onChangeText={setUserName}
                        type="text"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Masukkan nama pengguna anda"
                    />
                </Input>

                <FormControl className="mt-6">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        Emel
                    </FormControlLabelText>
                </FormControl>
                <Input className="rounded-xl h-11 bg-gray-100 border-0">
                    <InputField
                        value={email}
                        onChangeText={setEmail}
                        type="text"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Masukkan emel anda"
                    />
                </Input>

                <FormControl className="mt-6">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        Kata Laluan
                    </FormControlLabelText>
                </FormControl>
                <Input className="rounded-xl h-11 bg-gray-100 border-0">
                    <InputField
                        value={password}
                        onChangeText={setPassword}
                        type={showPassword ? "text" : "password"}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Masukkan kata laluan anda"
                    />
                    <InputSlot className="pr-3" onPress={togglePasswordVisibility}>
                        <Ionicons 
                            name={showPassword ? "eye-outline" : "eye-off-outline"} 
                            size={24} 
                            color="gray" 
                        />
                    </InputSlot>
                </Input>

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