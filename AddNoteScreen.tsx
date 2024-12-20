import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Audio from 'expo-av';
import { storage } from '../services/storage';
import { permissions } from '../services/permissions';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export default function AddNoteScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const recordingAnimation = useRef(new Animated.Value(1)).current;

  const animateRecording = () => {
    Animated.sequence([
      Animated.timing(recordingAnimation, {
        toValue: 0.7,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(recordingAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isRecording) {
        animateRecording();
      }
    });
  };

  const pickImage = async () => {
    try {
      const hasPermission = await permissions.requestMediaLibraryPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await permissions.requestAudioPermissions();
      if (!hasPermission) return;

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        
        setRecording(recording);
        setIsRecording(true);
        animateRecording();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setAudioUri(uri);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível parar a gravação.');
    }
  };

  const saveNote = async () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Por favor, adicione um título para a nota');
      return;
    }

    try {
      setIsSaving(true);
      const newNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        timestamp: Date.now(),
        image,
        audio: audioUri,
      };

      await storage.saveNote(newNote);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a nota.');
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
          onPress={saveNote}
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

      <View style={styles.mediaButtons}>
        <Button
          title="Adicionar Imagem"
          icon="image"
          variant="outline"
          onPress={pickImage}
          size="small"
        />

        <Button
          title={isRecording ? "Parar Gravação" : "Gravar Áudio"}
          icon={isRecording ? "stop-circle" : "mic"}
          variant={isRecording ? "danger" : "outline"}
          onPress={isRecording ? stopRecording : startRecording}
          size="small"
        />
      </View>

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
  mediaButtons: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
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