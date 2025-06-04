import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Exercise, Notes, Textbook } from '../types/ResourceType';

export class TextbookService {
  private collectionName = 'textbooks';

  /**
   * Get all textbooks from Firestore
   */
  async getAllTextbooks(): Promise<Textbook[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('title', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const textbooks: Textbook[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        textbooks.push({
          id: doc.id,
          fileName: data.fileName || '',
          pdfUrl: data.pdfUrl || '',
          title: data.title || '',
        });
      });

      return textbooks;
    } catch (error) {
      console.error('Error fetching textbooks:', error);
      throw new Error('Failed to fetch textbooks');
    }
  }

  /**
   * Get a specific textbook by ID
   */
  async getTextbookById(id: string): Promise<Textbook | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          fileName: data.fileName || '',
          pdfUrl: data.pdfUrl || '',
          title: data.title || '',
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching textbook:', error);
      throw new Error('Failed to fetch textbook');
    }
  }
}

export class NotesService {

  async getAllNotes(): Promise<Notes[]> {
    try {
      const q = query(
        collection(db, 'notes'),
        orderBy('title', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const notes: Notes[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notes.push({
          id: doc.id,
          fileName: data.fileName || '',
          pdfUrl: data.pdfUrl || '',
          title: data.title || '',
          chapter: data.chapter || ''
        });
      });

      return notes;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error('Failed to fetch notes');
    }
  }

  async getNotesById(id: string): Promise<Notes | null> {
    try {
      const docRef = doc(db, 'notes', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          fileName: data.fileName || '',
          pdfUrl: data.pdfUrl || '',
          title: data.title || '',
          chapter: data.chapter || ''
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error('Failed to fetch notes');
    }
  }
}

export class ExerciseService {


  async getAllExercise(typeFilter?: string): Promise<Exercise[]> {
    try {
      let q = query(
        collection(db, 'exercises'),
        orderBy('title', 'asc')
      );

      // Add type filter if provided
      if (typeFilter && typeFilter !== 'all') {
        q = query(
          collection(db, 'exercises'),
          where('type', '==', typeFilter),
          orderBy('title', 'asc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const exercise: Exercise[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        exercise.push({
          id: doc.id,
          fileName: data.fileName || '',
          pdfUrl: data.pdfUrl || '',
          title: data.title || '',
          chapter: data.chapter || '',
          type: data.type || ''
        });
      });

      return exercise;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw new Error('Failed to fetch exercise');
    }
  }


  async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const docRef = doc(db, 'exercises', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          fileName: data.fileName || '',
          pdfUrl: data.pdfUrl || '',
          title: data.title || '',
          chapter: data.chapter || '',
          type: data.type || ''
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw new Error('Failed to fetch exercise');
    }
  }
}