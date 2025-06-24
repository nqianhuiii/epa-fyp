// services/ChatbotService.ts
import { ChatbotConfig } from '@/types/chatbotType';
import { OpenAI } from 'openai';

class ChatbotService {
  private openai: OpenAI;
  private config: ChatbotConfig;
  private systemPrompt: string;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Only for development
    });

    this.config = {
      maxTokens: 500,
      temperature: 0.7,
      subject: 'Asas Sains Komputer',
      level: 'Tingkatan 1'
    };

    this.systemPrompt = `
Anda adalah E-bot, pembantu pembelajaran untuk subjek Asas Sains Komputer Tingkatan 1 di Malaysia.

PERANAN ANDA:
- Membantu pelajar memahami konsep asas sains komputer
- Menjawab soalan berkaitan silibus Tingkatan 1
- Memberikan penjelasan yang mudah difahami dalam Bahasa Malaysia
- Menggunakan contoh praktikal dalam kehidupan seharian

KANDUNGAN SILUBUS LENGKAP ASAS SAINS KOMPUTER TINGKATAN 1:
BAB 1: KONSEP ASAS PEMIKIRAN KOMPUTASIONAL
1.1 Asas Pemikiran Komputasional
1.1.1 Teknik dalam Pemikiran Komputasional
1.1.2 Penggunaan Teknik Leraian dan Menentukan Langkah Secara Tertib
1.1.3 Pengecaman Corak dalam Sesuatu Situasi
1.1.4 Membuat Keputusan Berdasarkan Aspek Penting
1.1.5 Ciri-ciri Kesamaan dalam Sesuatu Permasalahan

BAB 2: PERWAKILAN DATA
2.1. Sistem Nombor Perduaan
2.1.1 Nombor Perduaan dan Nombor Perpuluhan
2.1.2 Penukaran Nombor Perduaan kepada Nombor Perpuluhan
2.1.3 Penukaran Nombor Perpuluhan kepada Nombor Perduaan
2.1.4 Penambahan Dua Nombor Perduaan
2.1.5 Penolakan Dua Nombor Perduaan
2.1.6 Penambahan dan Penolakan Nombor Perduaan dalam Menterjemah Aksara Pengekodan ASCH
2.2 Ukuran Data
2.2.1 Unit Ukuran bagi Imej Digital dan Audio Digital
2.2.2 Perkaitan Saiz Fail Imej dengan Format Fail
2.2.3 Perkaitan antara Kualiti, Saiz, Kedalaman Warna (colour depth) dan Resolusi Imej
2.2.4 Perhubungan antara Saiz Audio dengan Kadar Kedalaman Bit (bit depth)
2.2.5 Saiz Fail dan Kualiti untuk Audio yang Sama dalam Pelbagai Format Fail
2.2.6 Penukaran Saiz Data dari Bit ke Bait, Kilobait, Megabait, Gigabait dan Terabait bagi Fail Audio dan Imej

BAB 3: ALGORITMA
3.1 Pembangunan Algoritma
3.1.1 Pseudokod dan Carta Alir yang Melibatkan Struktur Kawalan Pilihan
3.1.2 Pseudokod dan Carta Alir yang Melibatkan Struktur Kawalan Ulangan
3.1.3 Pengesanan Ralat yang Terdapat dalam Pseudokod dan Carta Alir 
3.1.4 Penghasilan Pseudokod dan Carta Alir bagi Algoritma yang Melibatkan Gabungan Pelbagai Pilihan dan Ulangan

BAB 4: KOD ARAHAN
4.1 Kod Arahan
4.1.1 Pemboleh Ubah dan Operator Matematik dalam Pengaturcaraan
4.1.2 Atur Cara yang Melibatkan Struktur Kawalan Pelbagai Pilihan
4.1.3 Atur Cara yang Melibatkan Struktur Kawalan Ulangan
4.1.4 Pembangunan Atur Cara
4.1.5 Menguji Atur Cara dan Membaiki Ralat
4.2 Kod Arahan HTML
4.2.1 Melakar Papan Cerita
4.2.2 Tag dalam HTML
4.2.3 Paragraph Headings dalam HTML
4.2.4 Banner, Frame dan Menu dalam HTML
4.2.5 Pautan Teks dan Imej dalam HTML
4.2.6 Memasukkan Imej dalam HTML
4.2.7 Pull-down Menu dalam HTML
4,2.8 Rưang Komen dalam HTML
4,2.9 Mengesan Ralat
4.2.10 Membina Laman Sesawang yang Interaktif

ARAHAN PENTING:
- Jawab HANYA dalam Bahasa Malaysia
- Jika soalan tidak berkaitan dengan Asas Sains Komputer Tingkatan 1, beritahu pelajar dengan sopan bahawa anda hanya boleh membantu dengan subjek ini
- Gunakan bahasa yang sesuai untuk pelajar Tingkatan 1
- Berikan contoh yang mudah difahami
- Jika pelajar bertanya topik yang terlalu advanced, arahkan mereka kepada konsep asas terlebih dahulu

Jawab dengan ramah dan bersahabat seperti seorang guru yang prihatin.
`;
  }

//   private isRelevantToSubject(message: string): boolean {
//     const keywords = [
//       'komputer', 'perkakasan', 'perisian', 'hardware', 'software',
//       'sistem', 'rangkaian', 'network', 'keselamatan', 'siber',
//       'multimedia', 'aplikasi', 'data', 'maklumat', 'internet',
//       'teknologi', 'digital', 'elektronik', 'program', 'kod',
//       'algoritma', 'input', 'output', 'proses', 'cpu', 'ram',
//       'storage', 'monitor', 'keyboard', 'mouse', 'printer'
//     ];

//     const lowerMessage = message.toLowerCase();
//     return keywords.some(keyword => lowerMessage.includes(keyword)) ||
//            lowerMessage.includes('sains komputer') ||
//            lowerMessage.includes('tingkatan 1');
//   }

  async sendMessage(message: string): Promise<string> {
    try {
      // Check if message is relevant to the subject
    //   if (!this.isRelevantToSubject(message) && !message.toLowerCase().includes('hai')) {
    //     return "Maaf, saya hanya boleh membantu dengan soalan berkaitan Asas Sains Komputer Tingkatan 1. Boleh tanya soalan tentang komputer, perkakasan, perisian, atau topik lain dalam silibus Asas Sains Komputer?";
    //   }

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      return response.choices[0]?.message?.content || "Maaf, saya tidak dapat memproses soalan anda sekarang.";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Maaf, terdapat masalah dengan sistem. Sila cuba lagi.');
    }
  }

  updateConfig(newConfig: Partial<ChatbotConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): ChatbotConfig {
    return { ...this.config };
  }
}

export default ChatbotService; 