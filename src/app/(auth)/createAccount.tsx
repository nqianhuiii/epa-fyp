import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
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
                <Heading className="text-3xl text-emerald-400">Create Account</Heading>
                <Text className="text-gray-500 text-base pt-4">Let's get you started with your new account!</Text>

                <CustomInputWithErrorMsg
                        label="Full Name"
                        value={fullName}
                        placeholder="Enter your full name"
                        onChangeText={setFullName}
                        error={fullNameError}
                />

                <FormControl className="mt-6">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        User Name
                    </FormControlLabelText>
                </FormControl>
                <Input className="rounded-xl h-11 bg-gray-100 border-0">
                    <InputField
                        value={userName}
                        onChangeText={setUserName}
                        type="text"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter your username"
                    />
                </Input>

                <FormControl className="mt-6">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        Email Address
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
                        placeholder="Enter your email"
                    />
                </Input>

                <FormControl className="mt-6">
                    <FormControlLabelText className="text-xl text-black-900 mb-2">
                        Password
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
                        placeholder="Enter password"
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
                    <ActivityIndicator size={"small"} color="#0D5BC4" className="mt-8"/>
                ) : (
                    <>
                        <Button className="bg-emerald-400 mt-10 rounded-xl h-11" onPress={handleSignUp}>
                            <ButtonText>Create Account</ButtonText>
                        </Button>
                        <Button className="border border-emerald-400 bg-white font-medium mt-5 mb-4 rounded-xl h-11" onPress={() => router.back()}>
                            <ButtonText className="text-emerald-400">Have an account already?</ButtonText>
                        </Button> 
                    </>
                )}
                </VStack>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}