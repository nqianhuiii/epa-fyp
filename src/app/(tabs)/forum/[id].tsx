import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View} from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "../../../components/ui/avatar";
import { HStack } from "../../../components/ui/hstack";
import { Text } from "../../../components/ui/text";
import { VStack } from "../../../components/ui/vstack";
import { useForumController } from "../../../hooks/useForumController";
import { useAuthStore } from "../../../store/authStore";
import { PostCard } from "../../../components/custom/postCard";
import { useForumStore } from "../../../store/forumStore";
import { formatDistanceToNow } from 'date-fns';
import BackButton from "../../../components/custom/customBackButton";

interface Comment {
  id: string;
  text: string;
  userId: string;
  username: string;
  createdAt: {
    toDate: () => Date;
  };
}

export default function ForumDetailScreen() {
  const { id } = useLocalSearchParams();
  const postId = Array.isArray(id) ? id[0] : id;
  
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const { getPostById, getCommentsByPostId, addComment } = useForumController();
  const { user } = useAuthStore();
  const { toggleLike } = useForumStore();
  
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadPostDetails();
    
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

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
        
        const commentsData = await getCommentsByPostId(postId);
        setComments(commentsData);
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
      
      // Update UI after like toggle
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
      const commentData = {
        text: newComment.trim(),
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        postId,
      };
      
      const newCommentId = await addComment(postId,commentData);
      
      // Add the new comment to the list with optimistic update
      const optimisticComment = {
        id: newCommentId,
        text: newComment.trim(),
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        createdAt: {
          toDate: () => new Date(),
        },
      };
      
      setComments(prev => [...prev, optimisticComment]);
      setNewComment("");
      
      // Reload comments to ensure consistency
      const updatedComments = await getCommentsByPostId(postId);
      setComments(updatedComments);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagePress = (imageUrl: string) => {
    // Handle image press - could navigate to full screen image view
    console.log("Image pressed:", imageUrl);
  };

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View className="px-5 py-3 border-b border-gray-100">
      <HStack space="md" className="items-start">
        <Avatar size="sm">
          <AvatarFallbackText>{item.username.charAt(0)}</AvatarFallbackText>
        </Avatar>
        
        <VStack className="flex-1">
          <HStack className="justify-between items-center">
            <Text className="font-bold">{item.username}</Text>
            <Text className="text-xs text-gray-500">
              {formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })}
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
          headerLeft: ()  => BackButton()
        }}
      />
      
      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Post Details */}
          <PostCard
            post={post}
            isDetailView={true}
            commentsCount={comments.length}
            onLikePress={handleLike}
            onImagePress={handleImagePress}
          />
          
          {/* Comments Section */}
          <View className="mt-2 bg-white h-full">
            <View className="px-5 py-3 border-b border-gray-200">
              <Text className="font-bold text-lg">Comments ({comments.length})</Text>
            </View>
            
            {comments.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-gray-500">No comments yet. Be the first to comment!</Text>
              </View>
            ) : (
              comments.map(comment => renderCommentItem({ item: comment }))
            )}
          </View>
        </ScrollView>
        
        {/* Comment Input Area */}
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
                  color={"#10B981"}
                />
              </TouchableOpacity>
            </View>
          </HStack>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}