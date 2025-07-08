import { router, Stack, useFocusEffect } from "expo-router";
import { SafeAreaView, View, ScrollView } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "../../../components/ui/avatar";
import { Button, ButtonText } from "../../../components/ui/button";
import { Heading } from "../../../components/ui/heading";
import { HStack } from "../../../components/ui/hstack";
import { Text } from "../../../components/ui/text";
import { VStack } from "../../../components/ui/vstack";
import { auth } from "../../../config/firebaseConfig";
import { useAuthStore } from "../../../store/authStore";
import { useQuizStore } from "../../../store/quizStore";
import { useFlashcardStore } from "../../../store/flashcardStore";
import { useCallback, useMemo } from "react";
import { FeatureCard } from "../../../components/custom/profile/FeatureCard";
import { StatsCard } from "../../../components/custom/profile/StatCard";

export default function Profile(){
    const { customUserData } = useAuthStore();
    const { attempts: quizAttempts } = useQuizStore();
    const { attempts: flashcardAttempts } = useFlashcardStore();
    
    // Calculate quiz statistics
    const quizStats = useMemo(() => {
        if (!quizAttempts || quizAttempts.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                bestScore: 0,
                totalTimeSpent: 0,
                uniqueQuizzes: 0
            };
        }

        const totalAttempts = quizAttempts.length;
        const totalScore = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
        const averageScore = Math.round(totalScore / totalAttempts);
        const bestScore = Math.max(...quizAttempts.map(a => a.score));
        const totalTimeSpent = quizAttempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
        const uniqueQuizzes = new Set(quizAttempts.map(a => a.quizId)).size;

        return {
            totalAttempts,
            averageScore,
            bestScore,
            totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
            uniqueQuizzes
        };
    }, [quizAttempts]);

    // Calculate flashcard statistics
    const flashcardStats = useMemo(() => {
        if (!flashcardAttempts || flashcardAttempts.length === 0) {
            return {
                totalAttempts: 0,
                totalKuasai: 0,
                totalBelumKuasai: 0,
                averageKuasaiPercentage: 0,
                totalTimeSpent: 0,
                uniqueSets: 0
            };
        }

        const totalAttempts = flashcardAttempts.length;
        const totalKuasai = flashcardAttempts.reduce((sum, attempt) => sum + attempt.kuasaiCount, 0);
        const totalBelumKuasai = flashcardAttempts.reduce((sum, attempt) => sum + attempt.belumKuasaiCount, 0);
        const totalAnswered = totalKuasai + totalBelumKuasai;
        const averageKuasaiPercentage = totalAnswered > 0 ? Math.round((totalKuasai / totalAnswered) * 100) : 0;
        const totalTimeSpent = flashcardAttempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
        const uniqueSets = new Set(flashcardAttempts.map(a => a.flashcardSetId)).size;

        return {
            totalAttempts,
            totalKuasai,
            totalBelumKuasai,
            averageKuasaiPercentage,
            totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
            uniqueSets
        };
    }, [flashcardAttempts]);
 
    useFocusEffect(
      useCallback(() => {
        console.log("Profile screen focused, customUserData:", customUserData);
        console.log("Quiz stats:", quizStats);
        console.log("Flashcard stats:", flashcardStats);
      }, [customUserData, quizStats, flashcardStats])
    );

    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Stack.Screen options={{ headerShown: true, headerTitle: "Profil"}}/>
        
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* User Profile Section */}
            <View className="px-5 py-3">
                <View className="bg-white rounded-xl px-5 py-5 shadow-sm">
                    <HStack className="justify-between">
                        <HStack space="md" className="flex-1">
                            <Avatar size="xl">
                                <AvatarFallbackText>
                                    {customUserData?.fullName ? customUserData.fullName.charAt(0).toUpperCase() : "U"}
                                </AvatarFallbackText>
                                <AvatarImage
                                    source={{ 
                                        uri: customUserData?.profilePhotoUrl || 'https://api.dicebear.com/7.x/avataaars/png?seed=rohaini&backgroundColor=10b981'
                                    }}
                                />
                            </Avatar> 
                            <VStack space="sm" className="p-2 flex-1">
                                <Heading size="md" className="flex-wrap">
                                    {customUserData?.fullName || "Nama Pernuh Pengguna"}
                                </Heading>
                                <Text size="sm" className="text-gray-600">
                                    @{customUserData?.userName || "username"}
                                </Text>
                            </VStack>           
                        </HStack>
                    </HStack>
                </View>
            </View>

            {/* Quiz Statistics Section */}
            <View className="px-5 py-2">
                <Heading size="sm" className="mb-3 text-gray-700">🔖 Statistik Kuiz</Heading>
                
                <FeatureCard 
                    title="Skor Purata"
                    value={`${quizStats.averageScore}%`}
                    subtitle={`daripada ${quizStats.totalAttempts} cubaan`}
                    icon="📈"
                    bgColor="bg-purple-500"
                />
                
                <HStack className="mb-3">
                    <StatsCard 
                        title="Skor Terbaik" 
                        value={`${quizStats.bestScore}%`}
                        bgColor="bg-purple-100"
                        textColor="text-purple-600"
                        valueColor="text-purple-700"
                    />
                    <StatsCard 
                        title="Set Kuiz" 
                        value={quizStats.uniqueQuizzes}
                        subtitle="berbeza"
                        bgColor="bg-purple-100"
                        textColor="text-purple-600"
                        valueColor="text-purple-700"
                    />
                </HStack>
            </View>

            {/* Flashcard Statistics Section */}
            <View className="px-5 py-2">
                <Heading size="sm" className="mb-3 text-gray-700">🔖 Statistik Kad Imbas</Heading>
                
                <FeatureCard 
                    title="Kadar Penguasaan"
                    value={`${flashcardStats.averageKuasaiPercentage}%`}
                    subtitle={`daripada ${flashcardStats.totalAttempts} cubaan`}
                    icon="🎓"
                    bgColor="bg-blue-500" 
                />
                
                {/* <HStack className="mb-3">
                    <StatsCard 
                        title="Sesi Kad Imbas" 
                        value={flashcardStats.totalAttempts}
                        subtitle="kali"
                        bgColor="bg-blue-50"
                        textColor="text-blue-600"
                        valueColor="text-blue-700"
                    />
                    <StatsCard 
                        title="Set Kad Imbas" 
                        value={flashcardStats.uniqueSets}
                        subtitle="berbeza"
                        bgColor="bg-indigo-50"
                        textColor="text-indigo-600"
                        valueColor="text-indigo-700"
                    />
                </HStack> */}
                
                <HStack className="mb-3">
                    <StatsCard 
                        title="Kad Kuasai" 
                        value={flashcardStats.totalKuasai}
                        subtitle="kad"
                        bgColor="bg-green-50"
                        textColor="text-green-600"
                        valueColor="text-green-700"
                    />
                    <StatsCard 
                        title="Kad Belum Kuasai" 
                        value={flashcardStats.totalBelumKuasai}
                        subtitle="kad"
                        bgColor="bg-orange-50"
                        textColor="text-orange-600"
                        valueColor="text-orange-700"
                    />
                </HStack>
            </View>

            {/* Action Buttons */}
            <View className="px-5 py-3 pb-6">    
                <Button className="bg-emerald-500 rounded-xl h-12 mb-3" onPress={() => router.push('/(tabs)/profile/editProfile')}> 
                    <ButtonText className="font-medium">Edit Profil</ButtonText>
                </Button>
                <Button className="border-2 border-emerald-500 bg-white rounded-xl h-12" onPress={() => auth.signOut()}>
                    <ButtonText className="text-emerald-500 font-medium">Log Keluar</ButtonText>
                </Button> 
            </View>
        </ScrollView>
      </SafeAreaView>
    );
}