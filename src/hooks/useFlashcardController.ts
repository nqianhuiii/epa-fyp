import { useState } from "react";
import { fetchFlashcards } from "../services/flashcardService";
import { FlashcardSet } from "../types/FlashcardType";

export const FlashcardController = () => {
    const [flashcards, setFlashcards] = useState<FlashcardSet[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getFlashcards = async () => {
        try {
        setIsLoading(true);
        const allFlashcards = await fetchFlashcards();
        setFlashcards(allFlashcards);
        return { success: true, data: allFlashcards };
        } catch (error: any) {
        console.error('Error fetching flashcards:', error);
        return { success: false, error: error.message || 'Unknown error' };
        } finally {
        setIsLoading(false);
        }
    };

  return{flashcards, isLoading, getFlashcards};
}