import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, View } from "react-native";
import { Button, ButtonText } from "../../components/ui/button";
import { FormControl, FormControlLabelText } from "../../components/ui/form-control";
import { Heading } from "../../components/ui/heading";
import { EyeIcon, EyeOffIcon } from "../../components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../../components/ui/input";
import { Text } from "../../components/ui/text";
import { VStack, } from "../../components/ui/vstack";
import { auth } from "../../utils/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function SignIn(){

    const [email, setEmail] = useState('');
    const [password, setPassword]  = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const signUp = async () => {
        setLoading(true);
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Check your email for verification');
        }catch(e:any){
            const err = e as FirebaseError;
            alert('Registration failed' + err.message);
        }finally{
            setLoading(false);
        }
    }

    const signIn = async () => {
        setLoading(true);
        try{
            await signInWithEmailAndPassword(auth, email, password);
        }catch(e:any){
            const err = e as FirebaseError;
            alert('Sign in failed' + err.message);
        }finally{
            setLoading(false);
        }      
    }

    const togglePasswordVisibility = () => {
        setShowPassword((showState) => !showState);
    }

    return (
        <View className="bg-white">
            <KeyboardAvoidingView behavior="padding">
                <VStack>
                    <Heading className="text-3xl text-green-400 pt-16">Login</Heading>
                    <Text className="text-gray-500 text-base pt-4">Welcome back to the app</Text>
                    <FormControl>
                        <FormControlLabelText className="text-xl text-black-900 pt-12 pb-2">
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
                        <FormControlLabelText className="text-xl text-black-900 pt-8 pb-2">
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
                        <ActivityIndicator size={"small"} color="#0D5BC4" className="pt-8"/>
                        ) : (
                            <>
                                <Button className="bg-emerald-400 mt-10 rounded-lg" onPress={signIn}>
                                    <ButtonText>Sign In</ButtonText>
                                </Button>
                                <Button className="bg-emerald-400 mt-10 rounded-lg" onPress={signUp}>
                                    <ButtonText>Create Account</ButtonText>
                                </Button> 
                            </>
                        )
                    }
            </VStack>
          </KeyboardAvoidingView>
      </View>
    )
}
