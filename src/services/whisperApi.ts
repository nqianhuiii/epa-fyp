import * as FileSystem from 'expo-file-system';

export interface WhisperResponse {
  text: string;
}

export class WhisperApiService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/audio/transcriptions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async transcribeAudio(audioUri: string, language?: 'en' | 'ms'): Promise<string> {
    try {
      // Read the audio file
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (!fileInfo.exists) {
        throw new Error('Audio file does not exist');
      }

      // Create FormData for the request
      const formData = new FormData();
      
      // Add the audio file
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'audio.m4a',
      } as any);
      
      // Add model
      formData.append('model', 'whisper-1');
      
      // Add language if specified
      if (language) {
        formData.append('language', language);
      }
      
      // Add response format
      formData.append('response_format', 'json');

      // Make the API request
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
      }

      const data: WhisperResponse = await response.json();
      return data.text.trim();

    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }
}