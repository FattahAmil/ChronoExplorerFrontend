export interface HistoricalPeriod {
  id: string | number;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  color: string; // For CSS hex or class name
}

export interface HistoricalEvent {
  id: string | number;
  date: Date | string;
  title: string;
  summary: string;
  imageUrl?: string; // Optional
  periodId?: string | number; // Optional, for linking
  groupIds?: (string | number)[]; // Optional, for linking
  detailedDescription: string;
  sources?: { name: string; url?: string }[]; // Array of source objects
  media?: { type: 'image' | 'video' | 'audio'; url: string; description?: string }[]; // Array of media objects
}

export interface ThematicGroup {
  id: string | number;
  name: string;
  description?: string; // Optional
}

export interface TimelineData {
  periods: HistoricalPeriod[];
  events: HistoricalEvent[];
  groups: ThematicGroup[];
}
