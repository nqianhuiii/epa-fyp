import { useState } from "react";
import { fetchQuizzes } from "../services/quizService";
import { Quiz } from "../types/QuizType";

export const QuizController = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getQuizzes = async () => {
        try {
        setIsLoading(true);
        const allQuizzes = await fetchQuizzes();
        setQuizzes(allQuizzes);
        return { success: true, data: allQuizzes };
        } catch (error: any) {
        console.error('Error fetching quizzes:', error);
        return { success: false, error: error.message || 'Unknown error' };
        } finally {
        setIsLoading(false);
        }
    };

  return{quizzes, isLoading, getQuizzes};
}