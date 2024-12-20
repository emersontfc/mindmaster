import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { storage } from '../services/storage';
import { Logo } from '../components/Logo';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  image?: string;
  audio?: string;
}

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotes();
    });

    return unsubscribe;
  }, [navigation]);

  const loadNotes = async () => {
    try {
      setRefreshing(true);
      const storedNotes = await storage.getAllNotes();
      setNotes(storedNotes);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as notas.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta nota?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.deleteNote(id);
              setNotes(notes.filter(note => note.id !== id));
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a nota.');
            }
          },
        },
      ],
    );
  };

  const renderRightActions = (progress: any, dragX: any, note: Note) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditNote', { note })}
        >
          <Animated.View style={[{ transform: [{ scale }] }]}>
            <Ionicons name="pencil" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteNote(note.id)}
        >
          <Animated.View style={[{ transform: [{ scale }] }]}>
            <Ionicons name="trash" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>Nenhuma nota ainda</Text>
      <Text style={styles.emptyStateText}>
        Toque no botão + para criar sua primeira nota
      </Text>
    </View>
  );

  const renderNoteItem = ({ item }: { item: Note }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
      overshootRight={false}
    >
      <TouchableOpacity
        style={styles.noteItem}
        onPress={() => navigation.navigate('EditNote', { note: item })}
        activeOpacity={0.7}
      >
        <View style={styles.noteHeader}>
          <Text style={styles.noteTitle}>{item.title}</Text>
          <Text style={styles.noteDate}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.noteContent} numberOfLines={2}>
          {item.content}
        </Text>
        {(item.image || item.audio) && (
          <View style={styles.mediaIndicator}>
            {item.image && (
              <View style={styles.iconContainer}>
                <Ionicons name="image" size={20} color="#666" />
              </View>
            )}
            {item.audio && (
              <View style={styles.iconContainer}>
                <Ionicons name="mic" size={20} color="#666" />
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo size="small" />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddNote')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
          onPress={() => setSortBy('date')}
          activeOpacity={0.7}
        >
          <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
            Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'title' && styles.sortButtonActive]}
          onPress={() => setSortBy('title')}
          activeOpacity={0.7}
        >
          <Text style={[styles.sortButtonText, sortBy === 'title' && styles.sortButtonTextActive]}>
            Título
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes.sort((a, b) => {
          if (sortBy === 'date') {
            return b.timestamp - a.timestamp;
          }
          return a.title.localeCompare(b.title);
        })}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        style={styles.notesList}
        contentContainerStyle={[
          styles.notesListContent,
          notes.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        onRefresh={loadNotes}
        refreshing={refreshing}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sortContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  sortButtonActive: {
    backgroundColor: '#007BFF',
  },
  sortButtonText: {
    color: '#007BFF',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  notesList: {
    flex: 1,
  },
  notesListContent: {
    padding: 8,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  noteItem: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: '#1a1a1a',
  },
  noteDate: {
    color: '#666',
    fontSize: 12,
  },
  noteContent: {
    color: '#444',
    lineHeight: 20,
  },
  mediaIndicator: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  iconContainer: {
    backgroundColor: '#f0f0f0',
    padding: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  actionButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#ffa500',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
}); 