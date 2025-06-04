// utils/chapterUtils.ts

export interface ChapterConfig {
  id: number;
  shortName: string;
  fullName: string;
  keywords: string[];
}

// Chapter configuration - easy to maintain and extend
export const CHAPTER_CONFIG: ChapterConfig[] = [
  {
    id: 1,
    shortName: 'Bab 1',
    fullName: 'Bab 1: Konsep Asas Pemikiran Komputasional',
    keywords: ['bab 1', 'konsep asas', 'pemikiran komputasional', 'computational thinking']
  },
  {
    id: 2,
    shortName: 'Bab 2',
    fullName: 'Bab 2: Perwakilan Data',
    keywords: ['bab 2', 'perwakilan data', 'data representation']
  },
  {
    id: 3,
    shortName: 'Bab 3',
    fullName: 'Bab 3: Algoritma',
    keywords: ['bab 3', 'algoritma', 'algorithm']
  },
  {
    id: 4,
    shortName: 'Bab 4',
    fullName: 'Bab 4: Pengaturcaraan',
    keywords: ['bab 4', 'pengaturcaraan', 'programming']
  },
  {
    id: 5,
    shortName: 'Bab 5',
    fullName: 'Bab 5: Sistem Maklumat',
    keywords: ['bab 5', 'sistem maklumat', 'information system']
  }
];

/**
 * Smart chapter grouping function that matches chapter strings to standardized chapter names
 * @param chapterString - The raw chapter string from the database
 * @returns Standardized chapter name or 'Lain-lain' if no match found
 */
export const getChapterGroup = (chapterString: string | undefined): string | undefined => {
  if (!chapterString || chapterString.trim() === '') {
    return undefined;
  }

  const chapter = chapterString.toLowerCase().trim();

  for (const config of CHAPTER_CONFIG) {
    const hasMatch = config.keywords.some(keyword =>
      chapter.includes(keyword.toLowerCase())
    );

    if (hasMatch) {
      return config.fullName;
    }
  }

  return chapterString.trim(); // fallback to raw string if no match
};

/**
 * Get all available chapters for dropdown/selection
 * @returns Array of chapter options
 */
export const getChapterOptions = () => {
  return CHAPTER_CONFIG.map(config => ({
    value: config.fullName,
    label: config.fullName,
    shortLabel: config.shortName
  }));
};

/**
 * Group items by chapter using smart matching
 * @param items - Array of items with chapter property
 * @param getChapterFn - Function to extract chapter from item (optional, defaults to item.chapter)
 * @returns Object with chapters as keys and arrays of items as values
 */
export const groupByChapter = <T extends { chapter?: string }>(
  items: T[],
  getChapterFn?: (item: T) => string | undefined
): Record<string, T[]> => {
  return items.reduce((acc, item) => {
    const chapterString = getChapterFn ? getChapterFn(item) : item.chapter;
    const chapter = getChapterGroup(chapterString);

    if (!chapter) {
      return acc;
    }

    if (!acc[chapter]) {
      acc[chapter] = [];
    }

    acc[chapter].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Sort chapters in logical order (Bab 1, Bab 2, etc., then others alphabetically)
 * @param chapters - Array of chapter names
 * @returns Sorted array of chapter names
 */
export const sortChapters = (chapters: string[]): string[] => {
  return chapters.sort((a, b) => {
    // Find chapter configs for both
    const configA = CHAPTER_CONFIG.find(config => a === config.fullName);
    const configB = CHAPTER_CONFIG.find(config => b === config.fullName);
    
    // If both are configured chapters, sort by ID
    if (configA && configB) {
      return configA.id - configB.id;
    }
    
    // If only one is configured, put configured first
    if (configA) return -1;
    if (configB) return 1;
    
    // If neither is configured, sort alphabetically
    return a.localeCompare(b);
  });
};

