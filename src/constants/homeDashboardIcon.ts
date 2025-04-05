import { ImageSourcePropType } from "react-native";
import Book from "../../assets/images/dashboard-icon/book.png";
import Exam from "../../assets/images/dashboard-icon/exam.png";
import Flashcard from "../../assets/images/dashboard-icon/flash-card.png";
import Notes from "../../assets/images/dashboard-icon/notes.png";
import Quiz from "../../assets/images/dashboard-icon/quiz.png";

interface IconItem {
    id: number,
    label: string, 
    image: ImageSourcePropType, 
    onPress: () => void;
}

export const dashboardIcon: IconItem [] = [
    {id: 1, label: "Text Book", image: Book, onPress: () => console.log("This is textbook")},
    {id: 2, label: "Notes", image: Notes, onPress: () => console.log("This is note")},
    {id: 3, label: "Past Year", image: Exam, onPress: () => console.log("This is past year")},
    {id: 4, label: "Quiz", image: Quiz, onPress: () => console.log("This is quiz")},
    {id: 5, label: "Flashcard", image: Flashcard, onPress: () => console.log("This is flashcard")},
]

