export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  image?: string;
  audio?: string;
}

export interface UserData {
  name: string;
  age: string;
  profilePhoto?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  sortBy: 'date' | 'title';
  notificationsEnabled: boolean;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  AddNote: undefined;
  EditNote: { note: Note };
};

export type MainTabParamList = {
  Notes: undefined;
  Profile: undefined;
};

export type ErrorType = {
  code: string;
  message: string;
  details?: any;
}; 