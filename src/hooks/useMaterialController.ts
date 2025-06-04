import { Exercise, Notes, Textbook } from '../types/ResourceType';
import { ExerciseService, NotesService, TextbookService } from '../services/materialService';

export class TextbookController {
  private textbookService: TextbookService;

  constructor() {
    this.textbookService = new TextbookService();
  }

  /**
   * Get all textbooks
   */
  async getAllTextbooks(): Promise<Textbook[]> {
    try {
      return await this.textbookService.getAllTextbooks();
    } catch (error) {
      console.error('Controller - Error getting all textbooks:', error);
      throw error;
    }
  }

  /**
   * Get a specific textbook by ID
   */
  async getTextbookById(id: string): Promise<Textbook | null> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Textbook ID is required');
      }

      return await this.textbookService.getTextbookById(id);
    } catch (error) {
      console.error('Controller - Error getting textbook by ID:', error);
      throw error;
    }
  }
}

export class NotesController {
  private notesService: NotesService;

  constructor() {
    this.notesService = new NotesService();
  }

  async getAllNotes(): Promise<Notes[]> {
    try {
      return await this.notesService.getAllNotes();
    } catch (error) {
      console.error('Controller - Error getting all notes:', error);
      throw error;
    }
  }

  async getNotesById(id: string): Promise<Notes | null> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Notes ID is required');
      }

      return await this.notesService.getNotesById(id);
    } catch (error) {
      console.error('Controller - Error getting notes by ID:', error);
      throw error;
    }
  }
}

export class ExerciseController {
  private exerciseService: ExerciseService;

  constructor() {
    this.exerciseService = new ExerciseService();
  }

  async getAllExercise(typeFilter?: string): Promise<Exercise[]> {
    try {
      return await this.exerciseService.getAllExercise(typeFilter);
    } catch (error) {
      console.error('Controller error fetching exercises:', error);
      throw error;
    }
  }


  async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Exercise ID is required');
      }

      return await this.exerciseService.getExerciseById(id);
    } catch (error) {
      console.error('Controller - Error getting exercise by ID:', error);
      throw error;
    }
  }
}

