import { useState } from "react";
import { fetchStudySessions } from "../services/studySessionService";
import { StudySession } from "../types/SessionType";

export const useStudySessionsController = () => {
    const [studySessions, setStudySessions] = useState<StudySession[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getStudySessions = async () => {
        try {
        setIsLoading(true);
        const allSessions = await fetchStudySessions();
        setStudySessions(allSessions);
        return { success: true, data: allSessions };
        } catch (error: any) {
        console.error('Error fetching sessions:', error);
        return { success: false, error: error.message || 'Unknown error' };
        } finally {
        setIsLoading(false);
        }
    };

  return{studySessions, isLoading, getStudySessions};
}