export interface DayCard {
  day: number;
  isOpen: boolean;
  isLocked: boolean;
  content?: CardContent;
}

export interface CardContent {
  imageUrl: string;
  quoteJp: string;
  quoteZh: string;
  source: string; // The author or character name
  workTitle: string; // The book, movie, or series title
}

export interface UserProfile {
  name: string;
  description: string;
}

export enum AppState {
  ONBOARDING,
  CALENDAR,
  VIEWING_CARD
}