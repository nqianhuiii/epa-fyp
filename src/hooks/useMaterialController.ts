import { Textbook } from '../types/ResourceType';
import { TextbookService } from '../services/materialService';

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

