import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from 'date-fns';
import { Image, ScrollView, TouchableOpacity, View, Pressable } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "../../components/ui/avatar";
import { HStack } from "../../components/ui/hstack";
import { Text } from "../../components/ui/text";
import { VStack } from "../../components/ui/vstack";
import { useAuthStore } from "../../store/authStore";
import { useForumStore } from "../../store/forumStore";

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
  const { user } = useAuthStore();
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
      {/* User Info */}
      <HStack space="md" className="items-center">
        <Avatar size="md">
          <AvatarFallbackText>Img</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
            }}
          />
        </Avatar>
        <VStack>
          <Text className="font-bold">{post.username || 'Unknown'}</Text>
          <Text className="text-xs text-gray-500">
            {post.createdAt && formatDate(post.createdAt.toDate())}
          </Text>
        </VStack>
      </HStack>

      {/* Post Content */}
      <Text className={`${isDetailView ? 'text-xl' : 'text-lg'} font-bold mt-3`}>{post.title}</Text>
      <Text className={`${isDetailView ? 'text-base' : ''} mt-1 mb-3`} numberOfLines={isDetailView ? undefined : 2}>
        {post.description}
      </Text>

      {/* Post Images */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <View className="mb-3">
          {isDetailView && post.imageUrls.length === 1 ? (
            <TouchableOpacity onPress={(e) => handleImagePress(post.imageUrls![0], e)}>
              <Image
                source={{ uri: post.imageUrls[0] }}
                className="w-full h-64 rounded-lg"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {post.imageUrls.map((imageUrl, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={(e) => handleImagePress(imageUrl, e)}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    className={`${isDetailView ? 'w-32 h-32' : 'w-24 h-24'} rounded-lg mr-2`}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Likes and Comments */}
      <View className="mt-4 flex-row items-center">
        <TouchableOpacity onPress={handleLikePress} className="flex-row items-center mr-6">
          <Ionicons
            name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
            size={20}
            color={isLiked ? "#10B981" : "#4B5563"}
          />
          <Text className="ml-2">{post.likedBy?.length || 0} Likes</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="chatbubble-outline" size={20} color="#4B5563" />
          <Text className="ml-2">{commentCount} Comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isDetailView) {
    return (
      <View 
        className={`bg-white pt-4 pb-3 mb-2 ${isSelected ? 'border-2 border-emerald-400 bg-emerald-50' : ''}`}
      >
        {renderContent()}
        
        {/* Selection indicator */}
        {isSelected && (
          <View className="absolute top-2 right-2">
            <View className="w-6 h-6 rounded-full bg-emerald-400 items-center justify-center">
              <Ionicons name="checkmark" size={18} color="white" />
            </View>
          </View>
        )}
      </View>
    );
  }

  // ForumScreen, not detail view
  return (
    <Pressable
      className={`bg-white pt-4 pb-3 mb-2 ${isSelected ? 'border-2 border-emerald-400 bg-emerald-50' : ''}`}
      onPress={handlePostPress}
      onLongPress={handleLongPress}
      delayLongPress={500} // 500ms for long press
      android_ripple={{ color: '#e6e6e6' }}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
    >
      {renderContent()}
    </Pressable>
  );
}

export default PostCard;