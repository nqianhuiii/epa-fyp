import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {
  Avatar,
  AvatarFallbackText
} from "../../../components/ui/avatar";
import { HStack } from "../../../components/ui/hstack";
import { Text } from "../../../components/ui/text";
import { VStack } from "../../../components/ui/vstack";
import { useForumController } from "../../../hooks/useForumController";
import { useAuthStore } from "../../../store/authStore";
import PostCard from "../../../components/custom/postCard";
import { useForumStore } from "../../../store/forumStore";
import { formatDistanceToNow } from 'date-fns';
import BackButton from "../../../components/custom/customBackButton";

export default function ForumDetailScreen() {
  const { id } = useLocalSearchParams();
  const postId = Array.isArray(id) ? id[0] : id;

  const [post, setPost] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const { commentsByPost, addComment, toggleLike } = useForumStore();
  const comments = commentsByPost[postId] || [];
  const { getPostById, getCommentsByPostId } = useForumController();
  const { user } = useAuthStore();

  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadPostDetails();

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [postId]);

  const loadPostDetails = async () => {
    setIsLoading(true);
    try {
      if (postId) {
        const postData = await getPostById(postId);
        setPost(postData);
        await getCommentsByPostId(postId);
      }
    } catch (error) {
      console.error("Failed to load post details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user?.uid || !post) return;

    try {
      await toggleLike(post.id, user.uid);
      setPost((prevPost: { likedBy: string[]; }) => {
        const isLiked = prevPost.likedBy?.includes(user.uid) || false;
        const updatedLikedBy = isLiked
          ? prevPost.likedBy.filter((uid: string) => uid !== user.uid)
          : [...(prevPost.likedBy || []), user.uid];

        return {
          ...prevPost,
          likedBy: updatedLikedBy
        };
      });
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user?.uid || !postId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Use the store's addComment method instead of the controller
      // This will handle both API call and state update
      await addComment(postId, {
        text: newComment.trim(),
        userId: user.uid,
      });
      
      setNewComment("");
      
      // Auto scroll to the bottom after adding a comment
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagePress = (imageUrl: string) => {
    console.log("Image pressed:", imageUrl);
  };

  const renderCommentItem = ({ item }: { item: any }) => (
    <View className="px-5 py-3 border-b border-gray-100">
      <HStack space="md" className="items-start">
        <Avatar size="sm">
          <AvatarFallbackText>{(item.username || '?').charAt(0)}</AvatarFallbackText>
        </Avatar>

        <VStack className="flex-1">
          <HStack className="justify-between items-center">
            <Text className="font-bold">{item.username}</Text>
            <Text className="text-xs text-gray-500">
              {formatDistanceToNow(
                item.createdAt instanceof Date
                  ? item.createdAt
                  : item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt),
                { addSuffix: true }
              )}
            </Text>
          </HStack>

          <Text className="mt-1">{item.text}</Text>
        </VStack>
      </HStack>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="small" color="#10B981" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500">Post not found</Text>
        <TouchableOpacity
          className="mt-4 px-6 py-2 bg-emerald-400 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <Stack.Screen
        options={{
          headerTitle: "Post",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
          headerLeft: () => BackButton()
        }}
      />

      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <PostCard
            post={post}
            isDetailView={true}
            commentsCount={comments.length}
            onLikePress={handleLike}
            onImagePress={handleImagePress}
          />

          <View className="mt-2 bg-white h-full">
            <View className="px-5 py-3 border-b border-gray-200">
              <Text className="font-bold text-lg">Comments ({comments.length})</Text>
            </View>

            {comments.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-gray-500">No comments yet. Be the first to comment!</Text>
              </View>
            ) : (
              comments.map(comment =>
                <View key={comment.id}>
                  {renderCommentItem({ item: comment })}
                </View>
              )
            )}
          </View>
        </ScrollView>

        <View className="border-t border-gray-200 bg-white px-4 py-2">
          <HStack space="md" className="items-center">
            <Avatar size="sm">
              <AvatarFallbackText>{(user?.displayName || 'U').charAt(0)}</AvatarFallbackText>
            </Avatar>

            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
              <TextInput
                ref={inputRef}
                className="flex-1"
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={500}
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }}
              />

              <TouchableOpacity
                disabled={!newComment.trim() || isSubmitting}
                onPress={handleSubmitComment}
                className="ml-2"
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={!newComment.trim() || isSubmitting ? "#A1A1AA" : "#10B981"}
                />
              </TouchableOpacity>
            </View>
          </HStack>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
