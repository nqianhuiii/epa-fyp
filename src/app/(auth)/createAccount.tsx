import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { Alert, AlertIcon, AlertText } from "../../components/ui/alert";
import { Button, ButtonText } from "../../components/ui/button";
import { FormControl, FormControlLabelText } from "../../components/ui/form-control";
import { Heading } from "../../components/ui/heading";
import { EyeIcon, EyeOffIcon, InfoIcon } from "../../components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../../components/ui/input";
import { Text } from "../../components/ui/text";
import { VStack } from "../../components/ui/vstack";
import { useAuthController } from "../../hooks/useAuthController";

export default function CreateAccount(){
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword]  = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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
            <KeyboardAvoidingView behavior="padding" >
                <VStack className="pt-24">
                    <Heading className="text-3xl text-green-400">Create Account</Heading>
                    <Text className="text-gray-500 text-base pt-4">Let's get you started with your new account!</Text>

                    <FormControl>
                        <FormControlLabelText className="text-xl text-black-900 mt-12 mb-2">
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

                    <FormControl>
                        <FormControlLabelText className="text-xl text-black-900 mt-8 mb-2">
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

                    <FormControl>
                        <FormControlLabelText className="text-xl text-black-900 mt-8 mb-2">
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
                    </Input>

                    <FormControl>
                        <FormControlLabelText className="text-xl text-black-900 mt-8 mb-2">
                            Password
                        </FormControlLabelText>
                    </FormControl>
                    <Input>
                        <InputField
                            value={password}
                            onChangeText={setPassword}
                            type={showPassword ? "text" : "password"}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Enter password"
                            placeholderTextColor="#A0AEC0"
                        />
                        <InputSlot className="pr-3" onPress={togglePasswordVisibility}>
                            <InputIcon as={showPassword? EyeIcon : EyeOffIcon}></InputIcon>
                        </InputSlot>
                    </Input>

                    {loading ? (
                        <ActivityIndicator size={"small"} color="#0D5BC4" className="mt-8"/>
                        ) : (
                            <>
                                <Button className="bg-emerald-400 mt-10 rounded-lg" onPress={handleSignUp}>
                                    <ButtonText>Create Account</ButtonText>
                                </Button>
                                <Button className="border border-green-500 bg-white font-medium mt-5 mb-4 rounded-lg" onPress={() => router.back()}>
                                    <ButtonText className="text-green-500">Have an account already?</ButtonText>
                                </Button> 
                            </>
                        )
                    }
            </VStack>
          </KeyboardAvoidingView>
      </SafeAreaView>
    )
}
