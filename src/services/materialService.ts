import { collection, getDocs, doc, getDoc, query, orderBy} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Textbook } from '../types/ResourceType';

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