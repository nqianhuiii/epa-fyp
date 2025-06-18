import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { FlashcardSet } from "../types/FlashcardType";

export const fetchFlashcards = async (): Promise<FlashcardSet[]> => {
  try {
    const q = query(
      collection(db, 'flashcards'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const flashcards: FlashcardSet[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      flashcards.push({
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        cards: data.cards || [], 
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
      });
    });

    return flashcards;
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw new Error('Failed to fetch flashcards');
  }
};
