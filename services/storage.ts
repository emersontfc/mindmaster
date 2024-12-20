import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  NOTES: '@notes',
  USER_DATA: '@user_data',
  APP_SETTINGS: '@app_settings',
};

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  image?: string;
  audio?: string;
}

interface UserData {
  name: string;
  age: string;
  profilePhoto: string;
}

class StorageService {
  // Notas
  async saveNote(note: Note): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const updatedNotes = [...notes, note];
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error saving note:', error);
      throw new Error('Não foi possível salvar a nota.');
    }
  }

  async getAllNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  async updateNote(updatedNote: Note): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const updatedNotes = notes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      );
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error updating note:', error);
      throw new Error('Não foi possível atualizar a nota.');
    }
  }

  async deleteNote(noteId: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const updatedNotes = notes.filter(note => note.id !== noteId);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error('Não foi possível excluir a nota.');
    }
  }

  // Dados do usuário
  async saveUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Não foi possível salvar os dados do usuário.');
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const userDataJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userDataJson ? JSON.parse(userDataJson) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Estatísticas
  async getNoteStatistics() {
    try {
      const notes = await this.getAllNotes();
      return {
        totalNotes: notes.length,
        totalImages: notes.filter(note => note.image).length,
        totalAudios: notes.filter(note => note.audio).length,
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalNotes: 0,
        totalImages: 0,
        totalAudios: 0,
      };
    }
  }

  // Limpar dados
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Não foi possível limpar os dados.');
    }
  }
}

export const storage = new StorageService(); 