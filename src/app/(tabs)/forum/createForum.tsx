import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import { useAlert } from "../../../components/custom/alertProvider";
import BackButton from "../../../components/custom/customBackButton";
import CustomInputWithErrorMsg from "../../../components/custom/customInputWithErrorMsg";
import { Button, ButtonText } from "../../../components/ui/button";
import { FormControl, FormControlHelperText, FormControlLabelText } from "../../../components/ui/form-control";
import { Image } from "../../../components/ui/image";
import { Text } from "../../../components/ui/text";
import { Textarea, TextareaInput } from "../../../components/ui/textarea";
import { VStack } from "../../../components/ui/vstack";
import { useForumController } from "../../../hooks/useForumController";
import { useImagePicker } from "../../../hooks/useImagePicker";
import { useAuthStore } from "../../../store/authStore";
import { validateForumForm } from "../../../utils/formValidation";

type FormField = 'title' | 'description';
interface FormErrors {
    title?: string;
    description?: string;
}

export default function CreateForum() {
    const [formState, setFormState] = useState<{title: string, description: string}>({title: '', description: ''});
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const { images, pickImages, removeImage } = useImagePicker(5);
    const { createPost } = useForumController();
    const { user } = useAuthStore();

    const updateFormField = useCallback((field: FormField, value: string) => {
        setFormState(prev => ({...prev, [field]: value}));

        // clear error when typing
        if(formErrors[field]){
            setFormErrors(prev => ({...prev, [field]: ''}));
        }
    }, [formErrors]);

    const handleImageUpload = async() => {
        const result = await pickImages(); 

        if(!result.success && result.error === 'limit'){
            showAlert("You can select only up to 5 images", "error");
        }else if(!result.success && result.error === 'permission'){
            showAlert("Please allow access to your photo library", "error");
        }
    }

    // const validateForm = () => {
    //     const { isValid, errors } = validateForumForm(title, description);
    //     setTitleError(errors.titleError);
    //     setDescriptionError(errors.descriptionError);
    //     return isValid;
    // }

    const handleSubmit = async () => {
        // Validate inputs first
        const {isValid, errors} = validateForumForm(formState.title, formState.description);

        if(!isValid){
            setFormErrors(errors);
            return;
        }

        setLoading(true);
        try {
          await createPost(
            {
              title: formState.title,
              description: formState.description,
              images
            },
            user?.uid || "", // assuming user is available from useAuthStore
            (errorMsg) => {
              showAlert(errorMsg, "error");
            }
          );
          
          showAlert("Your post has been created successfully", "success");
          
          router.back();
        } catch (error) {
          console.error("Error in handleSubmit:", error);
        } finally {
          setLoading(false);
        }
      };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ 
                headerShown: true, 
                headerTitle: "Create Post", 
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
                        label="Title"
                        value={formState.title}
                        placeholder="Enter title of your post"
                        onChangeText={(value) => updateFormField('title', value)}
                        error={formErrors.title}
                    />   

                    <FormControl className="mt-6">
                        <FormControlLabelText className="text-xl text-black-900 mb-2">
                            Description
                        </FormControlLabelText>
                        <Textarea 
                            size="md" 
                            style={{ height: 120 }} 
                            className="rounded-xl border-0 bg-gray-100 shadow-none"
                        >
                        <TextareaInput
                            value={formState.description}
                            onChangeText={(value) => updateFormField('description', value)}
                            type="text"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Enter the forum description"
                            className={`h-full w-full rounded-xl px-3 py-2 ${
                                formErrors.description ? 'border border-red-500 focus:border-red-500' : 'border-0'
                            }`}
                        />
                    </Textarea>
                        {formErrors.description && (
                            <FormControlHelperText className="text-red-500 mt-1">
                            {formErrors.description}
                            </FormControlHelperText>
                        )}
                    </FormControl>

                    <FormControl className="mt-6">
                        <FormControlLabelText className="text-xl text-black-900 mb-2">
                            Images (Maximum 5)
                        </FormControlLabelText>
                        <View className="mt-2">
                            {images.length > 0 ? (
                                <View className="flex-row flex-wrap">
                                    {images.map((imageUri, index) => (
                                        <View key={index} className="relative mr-2 mb-2">
                                            <Image
                                                source={{ uri: imageUri }}
                                                className="w-24 h-24 rounded-lg"
                                                resizeMode="cover"
                                                alt="preview img"
                                            />
                                            <TouchableOpacity
                                                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                                                onPress={() => removeImage(index)}
                                            >
                                                <Ionicons name="close" size={16} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    {images.length < 5 && (
                                        <TouchableOpacity
                                            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center mr-2 mb-2"
                                            onPress={handleImageUpload}
                                        >
                                            <Ionicons name="add" size={24} color="#d1d5db" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                <TouchableOpacity
                                    className="mt-1 border-2 border-dashed border-gray-300 rounded-lg h-40 items-center justify-center" 
                                    onPress={handleImageUpload}
                                >
                                    <Ionicons name="images-outline" size={36} color="#d1d5db" />
                                    <Text className="mt-2 text-gray-400">Tap to upload images (up to 5)</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </FormControl>        

                {loading ? (
                    <ActivityIndicator size={"small"} color="#0D5BC4" className="mt-8"/>
                ) : (
                    <Button className="bg-emerald-400 mt-10 rounded-xl h-11" onPress={handleSubmit}>
                        <ButtonText>Post</ButtonText>
                    </Button>
                )}
                </VStack>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

