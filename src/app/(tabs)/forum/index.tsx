import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { router, Stack, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { useForumTabStore } from "../../..//store/forumTabStore";
import { HeaderLeftButton } from "../../../components/custom/headerLeftButton";
import { HeaderRightButton } from "../../../components/custom/headerRightButton";
import PostCard from "../../../components/custom/postCard";
import { Button, ButtonText } from "../../../components/ui/button";
import { HStack } from "../../../components/ui/hstack";
import { Text } from "../../../components/ui/text";
import { useForumController } from "../../../hooks/useForumController";
import { usePostActionSelection } from "../../../hooks/usePostActionSelection";
import { getCommentsByPostId } from "../../../services/forumService";
import { useAuthStore } from "../../../store/authStore";
import { useForumStore } from "../../../store/forumStore";
import CustomActivityIndicator from "../../../components/custom/customActivityIndicator";

export default function ForumScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAllPosts, getPostsByUserId } = useForumController();
  const { user } = useAuthStore();
  const { toggleLike, updatePostLikes, updatePostComments } = useForumStore();
  const { setGlobalActiveTab } = useForumTabStore();
  const { selectedPost, handleLongPress, cancelSelection, handleEditPost, openDeleteDialog } = usePostActionSelection(activeTab, setPosts);
  const navigation = useNavigation();
  
  useFocusEffect(
  React.useCallback(() => {
    loadPosts();
  }, [activeTab])
);

  useLayoutEffect(() => {
    if(selectedPost){
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            onEdit={() => handleEditPost(selectedPost)}
            onCancel={() => cancelSelection()}
          />           
        ), 
        headerLeft: () => (
          <HeaderLeftButton
             onDelete={() => openDeleteDialog(selectedPost)}
          />
        )
      });
    }else{
      navigation.setOptions({headerRight: () => null, headerLeft: () => null});
    }
  }, [selectedPost]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      let data = [];
      if (activeTab === "all") {
        data = await getAllPosts();
      } else {
        data = await getPostsByUserId(user?.uid);
      }

      data.forEach((post) => {
        if (post.likedBy) {
          updatePostLikes(post.id, post.likedBy);
        }
      });

      setPosts(data);
      loadCommentsForPosts(data); // load post first, then comments
    } catch (error) {
      console.error("Gagal memuatkan post", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCommentsForPosts = async (posts: any[]) => {
    try {
      await Promise.all(
        posts.map(async (post) => {
          try {
            const comments = await getCommentsByPostId(post.id);
            updatePostComments(post.id, comments);
          } catch (error) {
            console.error(`Gagal memuatkan komen untuk post ${post.id}:`, error);
            updatePostComments(post.id, []);
          }
        })
      );
    } catch (error) {
      console.error("Gagal memuatkan komen untuk post:", error);
    }
  };

  const navigateToDetail = (postId: string) => {
    router.push(`/(tabs)/forum/${postId}`);
  };

  const handleLike = async (postId: string) => {
    if (user?.uid) {
      try {
        await toggleLike(postId, user.uid);

        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              const isLiked = post.likedBy?.includes(user.uid) || false;
              const updatedLikedBy = isLiked
                ? post.likedBy.filter((uid: string) => uid !== user.uid)
                : [...(post.likedBy || []), user.uid];

              return {
                ...post,
                likedBy: updatedLikedBy,
              };
            }
            return post;
          })
        );
      } catch (error) {
        console.error("Gagal memuatkan data suka", error);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: selectedPost ? "Tindakan Post" : "Forum",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      />

      <View className="px-4 py-4 ">
        <HStack className="justify-between" space="md">
          <Button
            className={`${
              activeTab === "all"
                ? "bg-emerald-400"
                : "bg-white border border-emerald-400"
            } rounded-lg flex-1`}
            onPress={() => {
              setActiveTab("all");
              setGlobalActiveTab("all");
              cancelSelection();
            }}
          >
            <ButtonText
              className={
                activeTab === "all" ? "text-white" : "text-emerald-400"
              }
            >
              Semua Post
            </ButtonText>
          </Button>
          <Button
            className={`${
              activeTab === "my"
                ? "bg-emerald-400"
                : "bg-white border border-emerald-400"
            } rounded-lg flex-1`}
            onPress={() => {
              setActiveTab("my");
              setGlobalActiveTab("my");
              cancelSelection();
            }}
          >
            <ButtonText
              className={
                activeTab === "my" ? "text-white" : "text-emerald-400"
              }
            >
              Post Saya
            </ButtonText>
          </Button>
        </HStack>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <CustomActivityIndicator/>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 80 }}
        >
          {posts.length === 0 ? (
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-500 text-center text-lg">
                {activeTab === "all"
                  ? "Tiada post tersedia"
                  : "Anda belum mencipta sebarang post"}
              </Text>
            </View>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostPress={navigateToDetail}
                onLongPress={() => handleLongPress(post.id)}
                isSelected={post.id === selectedPost}
                onLikePress={() => {
                  if (user?.uid) {
                    handleLike(post.id);
                  }
                }}
              />
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        className="absolute bottom-20 right-6 w-14 h-14 bg-emerald-400 rounded-full items-center justify-center"
        onPress={() => router.push("/(tabs)/forum/createForum")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
