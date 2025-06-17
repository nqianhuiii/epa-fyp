import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import { useAlert } from "../../../../components/custom/alertProvider";
import BackButton from "../../../../components/custom/customBackButton";
import CustomInputWithErrorMsg from "../../../../components/custom/customInputWithErrorMsg";
import { Button, ButtonText } from "../../../../components/ui/button";
import { FormControl, FormControlHelperText, FormControlLabelText } from "../../../../components/ui/form-control";
import { Image } from "../../../../components/ui/image";
import { Text } from "../../../../components/ui/text";
import { Textarea, TextareaInput } from "../../../../components/ui/textarea";
import { VStack } from "../../../../components/ui/vstack";
import { useForumController } from "../../../../hooks/useForumController";
import { useImagePicker } from "../../../../hooks/useImagePicker";
import { useAuthStore } from "../../../../store/authStore";
import { validateForumForm } from "../../../../utils/formValidation";
import LoadingScreenWithHeader from "../../../../components/custom/loadingScreenWithHeader";
import CustomActivityIndicator from "../../../../components/custom/customActivityIndicator";
import { window } from "@/constants/sizes";

type FormField = 'title' | 'description';
interface FormErrors {
    title?: string;
    description?: string;
}

interface Post {
    id: string;
    title?: string;
    description?: string;
    imageUrls?: string[];
    userId?: string;
    username?: string;
    likedBy?: string[];
    createdAt?: {
        toDate: () => Date;
    } | Date;
}

export default function EditForum() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [formState, setFormState] = useState<{title: string, description: string}>({title: '', description: ''});
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true); // loading indicator when fetching the selected post for edit
    const [originalPost, setOriginalPost] = useState<Post | null>(null);
    
    const { showAlert } = useAlert();
    const { images, pickImages, removeImage, setImages } = useImagePicker(5);

    // const { getPostById, updatePost } = useForumController();
    const { getPostById, handleUpdatePost } = useForumController();
    const { user } = useAuthStore();


    // Load existing post data
    useEffect(() => {
        const loadPostData = async () => {
            if (!id) {
                showAlert("Post ID not found", "error");
                router.back();
                return;
            }

            try {
                setInitialLoading(true);
                const post = await getPostById(id);
                
                if (!post) {
                    showAlert("Post not found", "error");
                    router.back();
                    return;
                }

                // Check if the post has the required properties
                if (!('title' in post) || !('description' in post) || !('userId' in post)) {
                    console.error("Post object is missing required properties:", post);
                    showAlert("Invalid post data", "error");
                    router.back();
                    return;
                }

                // Check if user owns this post
                if (post.userId !== user?.uid) {
                    showAlert("You can only edit your own posts", "error");
                    router.back();
                    return;
                }

                setOriginalPost(post);
                setFormState({
                    title: post.title || '',
                    description: post.description || ''
                });

                // Set existing images if any
                if (post.imageUrls && post.imageUrls.length > 0) {
                    setImages(post.imageUrls);
                }

            } catch (error) {
                console.log("Error loading post:", error);
                showAlert("Failed to load post data", "error");
                router.back();
            } finally {
                setInitialLoading(false);
            }
        };

        loadPostData();
    }, [id, user?.uid]);

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

    const hasChanges = () => {
        if (!originalPost) return false;
        
        return (
            formState.title !== originalPost.title ||
            formState.description !== originalPost.description ||
            JSON.stringify(images) !== JSON.stringify(originalPost.imageUrls || [])
        );
    };

    const handleSubmit = async () => {
        // Check if there are any changes
        if (!hasChanges()) {
            showAlert("No changes detected", "info");
            return;
        }

        // Validate inputs first
        const {isValid, errors} = validateForumForm(formState.title, formState.description);

        if(!isValid){
            setFormErrors(errors);
            return;
        }

        setLoading(true);
        try {
          await handleUpdatePost(
            id,
            {
              title: formState.title,
              description: formState.description,
              images
            },
            user?.uid || "",
            (errorMsg) => {
              showAlert(errorMsg, "error");
            }
          );
          
          showAlert("Post anda telah berjaya dikemas kini", "success");
          
          router.back();
        } catch (error) {
          console.log("Error in handleSubmit:", error);
          showAlert("Gagal mengemas kini post", "error");
        } finally {
          setLoading(false);
        }
    };

    // Show loading while fetching post data
    if (initialLoading) {
        return (
            <LoadingScreenWithHeader
                title="Edit post"
                message="Sedang memuatkan post"
                showBackButton={true}
            />
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ 
                headerShown: true, 
                headerTitle: "Edit Post", 
                headerShadowVisible: false,
                headerBackTitle: '',
                headerLeft: () => BackButton()
            }}/>
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
                        label="Tajuk"
                        value={formState.title}
                        placeholder="Masukkan tajuk post anda"
                        onChangeText={(value) => updateFormField('title', value)}
                        error={formErrors.title}
                        required={true}
                    />   

                    <FormControl className="mt-6">
                        <FormControlLabelText className="text-xl text-black-900 mb-2">
                            Huraian
                            <Text style={{ color: 'red' }}> *</Text>
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
                            placeholder="Masukkan huraian post anda"
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
                             Gambar (Maksimum 5)
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
                                    <Text className="mt-2 text-gray-400">Tekan sini ntuk muat naik gambar (sehingga 5)</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </FormControl>        

                {loading ? (
                    <CustomActivityIndicator/>
                ) : (
                    <Button 
                        className={`mt-10 rounded-xl h-11 ${
                            hasChanges() ? 'bg-emerald-400' : 'bg-gray-300'
                        }`} 
                        onPress={handleSubmit}
                        disabled={!hasChanges()}
                    >
                        <ButtonText className={hasChanges() ? 'text-white' : 'text-gray-500'}>
                            Kemas Kini Post
                        </ButtonText>
                    </Button>
                )}
                </VStack>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}