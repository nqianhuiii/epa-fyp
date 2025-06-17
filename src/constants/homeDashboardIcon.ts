import { ImageSourcePropType } from "react-native";
import Book from "../../assets/images/dashboard-icon/book.png";
import Exam from "../../assets/images/dashboard-icon/exam.png";
import Flashcard from "../../assets/images/dashboard-icon/flash-card.png";
import Notes from "../../assets/images/dashboard-icon/notes.png";
import Quiz from "../../assets/images/dashboard-icon/quiz.png";
import Workshop from "../../assets/images/dashboard-icon/workshop.png"
import { router } from "expo-router";

interface IconItem {
    id: number,
    label: string, 
    image: ImageSourcePropType, 
    onPress: () => void;
}

export const dashboardIcon: IconItem [] = [
    {id: 1, label: "Buku Teks", image: Book, onPress: () => router.push('/screens/textbook/TextbookListScreen')},
    {id: 2, label: "Nota", image: Notes, onPress: () => router.push('/screens/notes/NotesListScreen')},
    {id: 3, label: "Soalan", image: Exam, onPress: () => router.push('/screens/exercises/ExercisesListScreen')},
    {id: 4, label: "Sesi Belajar", image: Workshop, onPress: () => router.push('/screens/studySessions/sessionsListScreen')},
    {id: 5, label: "Kuiz", image: Quiz, onPress: () => router.push('/screens/quiz/QuizListScreen')},
    {id: 6, label: "Kad Imbasan", image: Flashcard, onPress: () => console.log("This is flashcard")},
]

