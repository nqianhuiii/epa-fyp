import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Quiz } from "../types/QuizType";

export const fetchQuizzes = async(): Promise<Quiz[]> => {
    try {
      const q = query(
        collection(db, 'quizzes'),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q);
      const quizzes: Quiz[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        quizzes.push({
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            questions: data.questions || [],
            timeLimit: data.timeLimit || 0,
            passingScore: data.passingScore || 0,
            shuffleQuestions: data.shuffleQuestions || false,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
            });
      });

      return quizzes;
    } catch (error) {
      console.log('Error fetching quizzes:', error);
      throw new Error('Failed to fetch quizzes');
    }
}

