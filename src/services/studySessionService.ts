import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { StudySession } from "../types/SessionType";

export const fetchStudySessions = async(): Promise<StudySession[]> => {
    try {
      const q = query(
        collection(db, 'studySessions'),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q);
      const sessions: StudySession[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          title: data.title || '',
          teacherName: data.teacherName || '',
          tutorImage: data.tutorImage || null,
          date: data.date || '',
          time: data.time || '',
          description: data.description || '',
          meetingLink: data.meetingLink || null,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || '',
        });
      });

      return sessions;
    } catch (error) {
      console.log('Error fetching study sessions:', error);
      throw new Error('Failed to fetch study sessions');
    }
}

export const fetchStudySessionsThisMonth = async (): Promise<StudySession[]> => {
  try {
    const q = query(
      collection(db, 'studySessions'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const sessions: StudySession[] = [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const parsedDate = new Date(data.date); // data.date is "Jun 30, 2025"

      if (parsedDate.getMonth() === currentMonth && parsedDate.getFullYear() === currentYear) {
        sessions.push({
          id: doc.id,
          title: data.title || '',
          teacherName: data.teacherName || '',
          tutorImage: data.tutorImage || null,
          date: data.date || '',
          time: data.time || '',
          description: data.description || '',
          meetingLink: data.meetingLink || null,
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
        });
      }
    });

    return sessions;
  } catch (error) {
    console.error('Error filtering sessions:', error);
    throw new Error('Failed to fetch filtered sessions');
  }
};
