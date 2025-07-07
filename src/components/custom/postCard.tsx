import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from 'date-fns';
import { Image, ScrollView, TouchableOpacity, View, Pressable, Animated } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "../../components/ui/avatar";
import { Text } from "../../components/ui/text";
import { useAuthStore } from "../../store/authStore";
import { useForumStore } from "../../store/forumStore";
import { useRef, useEffect } from "react";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrls?: string[];
  userId: string;
  username?: string;
  likedBy?: string[];
  createdAt: {
    toDate: () => Date;
  };
}

interface PostCardProps {
  post: Post;
  commentsCount?: number;
  onPostPress?: (postId: string) => void;
  onLikePress: (postId: string) => void;
  isDetailView?: boolean;
  onImagePress?: (imageUrl: string) => void;
  onLongPress?: (postId: string) => void;
  isSelected?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  commentsCount,
  onPostPress,
  onLikePress,
  isDetailView = false,
  onImagePress,
  onLongPress,
  isSelected = false
}) => {
  const { user, customUserData } = useAuthStore();
  const isLiked = post.likedBy?.includes(user?.uid ?? "");
  
  const getCommentsCount = useForumStore(state => state.getCommentsCount);
  const commentCount = commentsCount ?? getCommentsCount(post.id);

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handlePostPress = () => {
    if (onPostPress) {
      onPostPress(post.id);
    }
  };

  const handleLikePress = (e?: any) => {
    if (e) e.stopPropagation();
  
    onLikePress(post.id);
  };

  const handleImagePress = (imageUrl: string, e?: any) => {
    if (e) e.stopPropagation();
    if (onImagePress) {
      onImagePress(imageUrl);
    }
  };

  const handleLongPress = () => {
    if(onLongPress) {
      onLongPress(post.id);
    }
  };


  const renderContent = () => (
    <View className="px-5">
      {/* User Info with enhanced styling */}
      <View className="flex-row items-center gap-2">
        <View className="relative">
          <Avatar size="md" >
            <AvatarFallbackText>Img</AvatarFallbackText>
            <AvatarImage
              source={{ 
                uri: customUserData?.profilePhotoUrl || 'https://api.dicebear.com/7.x/avataaars/png?seed=rohaini&backgroundColor=10b981'
              }}
            />
          </Avatar>
        </View>
        
        <View className="flex-1">
          <View className="flex-row items-center space-x-2">
            <Text className="font-bold text-gray-800">{post.username || 'Pelajar'}</Text>
          </View>
          <Text className="text-xs text-gray-500">
            {post.createdAt && formatDate(post.createdAt.toDate())}
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <View className="flex-row items-start justify-between mb-2">
          <Text className={`${isDetailView ? 'text-xl' : 'text-lg'} font-bold text-gray-800 flex-1 mr-2`}>
            {post.title}
          </Text>
        </View>
        
        <Text 
          className={`${isDetailView ? 'text-base' : 'text-sm'} text-gray-600 leading-relaxed mb-3`} 
          numberOfLines={isDetailView ? undefined : 3}
        >
          {post.description}
        </Text>
      </View>

      {/* Post Images with enhanced styling */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <View className="mb-4">
          {isDetailView && post.imageUrls.length === 1 ? (
            <TouchableOpacity 
              onPress={(e) => handleImagePress(post.imageUrls![0], e)}
              className="rounded-xl overflow-hidden shadow-md"
            >
              <Image
                source={{ uri: post.imageUrls[0] }}
                className="w-full h-64"
                resizeMode="cover"
              />
              {/* Image overlay for better interaction feedback */}
              <View className="absolute inset-0 bg-black opacity-0 active:opacity-10" />
            </TouchableOpacity>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-2">
              {post.imageUrls.map((imageUrl, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={(e) => handleImagePress(imageUrl, e)}
                  className="rounded-lg overflow-hidden shadow-sm mr-2"
                >
                  <Image
                    source={{ uri: imageUrl }}
                    className={`${isDetailView ? 'w-32 h-32' : 'w-24 h-24'}`}
                    resizeMode="cover"
                  />

                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Enhanced Likes and Comments section */}
      <View className="pt-3 border-t border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            {/* Like button with animation */}
              <TouchableOpacity 
                onPress={handleLikePress} 
                className={`flex-row items-center px-3 py-2 rounded-full ${
                  isLiked ? 'bg-emerald-50' : 'bg-gray-50'
                }`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                  size={18}
                  color={isLiked ? "#10B981" : "#6B7280"}
                />
                <Text className={`ml-2 text-sm font-medium ${
                  isLiked ? 'text-emerald-600' : 'text-gray-600'
                }`}>
                  {post.likedBy?.length || 0} Suka
                </Text>
              </TouchableOpacity>

            {/* Comment button */}
            <TouchableOpacity className="flex-row items-center px-3 py-2 rounded-full bg-gray-50">
              <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
              <Text className="ml-2 text-sm font-medium text-gray-600">
                {commentCount} Komen
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (isDetailView) {
    return (
      <View
        className= "bg-white border-emerald-200 border-2 rounded-xl shadow-sm pt-4 pb-4 mb-3 mx-2"
      >
        {renderContent()}
        
        {/* Enhanced selection indicator */}
        {isSelected && (
          <View className="absolute top-3 right-3">
            <View className="w-7 h-7 rounded-full bg-emerald-400 items-center justify-center shadow-md">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          </View>
        )}
      </View>
    );
  }

  // ForumScreen, not detail view
  return (
      <Pressable
        className= "bg-white rounded-xl shadow-sm pt-4 pb-4 mb-3 mx-2 border-2 border-emerald-200"
        onPress={handlePostPress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        android_ripple={{ color: '#f0f0f0', borderless: false }}
        style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}
      >
        {renderContent()}
        
        {/* Enhanced selection indicator */}
        {isSelected && (
          <View className="absolute top-3 right-3">
            <View className="w-7 h-7 rounded-full bg-emerald-400 items-center justify-center shadow-md">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          </View>
        )}
      </Pressable>
  );
}

export default PostCard;