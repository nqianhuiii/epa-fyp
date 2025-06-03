export interface Textbook {
  id: string;
  fileName: string;
  pdfUrl: string;
  title: string;
}

// Navigation types for React Navigation
export type TextbookStackParamList = {
  TextbookList: undefined;
  TextbookViewer: {
    textbook: Textbook;
  };
};

// Component props
export interface TextbookCardProps {
  textbook: Textbook;
  onPress: (textbook: Textbook) => void;
}

export interface TextbookListProps {
  textbooks: Textbook[];
  loading?: boolean;
  onRefresh?: () => void;
  onTextbookPress: (textbook: Textbook) => void;
}