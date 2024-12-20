import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../services/storage';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export default function EditNoteScreen({ route, navigation }) {
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [image, setImage] = useState(note.image);
  const [audioUri, setAudioUri] = useState(note.audio);
  const [isSaving, setIsSaving] = useState(false);

  const updateNote = async () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Por favor, adicione um título para a nota');
      return;
    }

    try {
      setIsSaving(true);
      const updatedNote = {
        ...note,
        title: title.trim(),
        content: content.trim(),
        image,
        audio: audioUri,
        timestamp: Date.now(), // Atualiza o timestamp
      };

      await storage.updateNote(updatedNote);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a nota.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <Button
          icon="arrow-back"
          variant="secondary"
          size="small"
          onPress={() => navigation.goBack()}
        />
        <Button
          title="Salvar"
          onPress={updateNote}
          loading={isSaving}
          disabled={!title.trim()}
        />
      </View>

      <Input
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        label="Título da nota"
      />

      <Input
        value={content}
        onChangeText={setContent}
        placeholder="Conteúdo da nota..."
        multiline
        numberOfLines={10}
        label="Conteúdo"
      />

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <Button
            icon="close-circle"
            variant="danger"
            size="small"
            style={styles.removeButton}
            onPress={() => setImage(null)}
          />
        </View>
      )}

      {audioUri && (
        <View style={styles.audioContainer}>
          <Ionicons name="musical-note" size={24} color="#007BFF" />
          <Text style={styles.audioText}>Áudio gravado</Text>
          <Button
            icon="close-circle"
            variant="danger"
            size="small"
            onPress={() => setAudioUri(null)}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  imageContainer: {
    margin: 16,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  audioText: {
    marginLeft: 8,
    flex: 1,
    color: '#1a1a1a',
  },
}); 