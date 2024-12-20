import { useState, useCallback, useEffect, useMemo } from 'react';
import { storage } from '../services/storage';
import { errorHandler } from '../services/errorHandler';
import { Note } from '../types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const loadNotes = useCallback(async () => {
    try {
      setRefreshing(true);
      const storedNotes = await storage.getAllNotes();
      setNotes(storedNotes);
    } catch (error) {
      const formattedError = errorHandler.handleError(error);
      errorHandler.showError(formattedError);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp - a.timestamp;
      }
      return a.title.localeCompare(b.title);
    });
  }, [notes, sortBy]);

  const addNote = useCallback(async (note: Omit<Note, 'id' | 'timestamp'>) => {
    try {
      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      await storage.saveNote(newNote);
      setNotes(prev => [...prev, newNote]);
      return true;
    } catch (error) {
      const formattedError = errorHandler.handleError(error);
      errorHandler.showError(formattedError);
      return false;
    }
  }, []);

  const updateNote = useCallback(async (updatedNote: Note) => {
    try {
      await storage.updateNote(updatedNote);
      setNotes(prev => 
        prev.map(note => note.id === updatedNote.id ? updatedNote : note)
      );
      return true;
    } catch (error) {
      const formattedError = errorHandler.handleError(error);
      errorHandler.showError(formattedError);
      return false;
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    try {
      await storage.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      return true;
    } catch (error) {
      const formattedError = errorHandler.handleError(error);
      errorHandler.showError(formattedError);
      return false;
    }
  }, []);

  return {
    notes: sortedNotes,
    loading,
    refreshing,
    sortBy,
    setSortBy,
    loadNotes,
    addNote,
    updateNote,
    deleteNote,
  };
} 