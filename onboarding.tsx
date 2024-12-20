// onboarding.tsx - Onboarding screen
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setProfilePhoto(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (name && age && profilePhoto) {
      const userData = { name, age, profilePhoto };
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      setIsSubmitted(true);
    } else {
      alert('Please fill all fields and select a profile photo.');
    }
  };

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Bem-vindo ao MindMaster,</Text>
        <Text style={styles.nameText}>{name}!</Text>
        <Image source={{ uri: profilePhoto }} style={styles.welcomeProfileImage} />
        <Text style={styles.text}>Idade: {age}</Text>
        <Text style={styles.subtitleText}>Seu espaço pessoal para organizar pensamentos e ideias.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Bem-vindo ao MindMaster</Text>
        <Text style={styles.subtitle}>Seu bloco de notas inteligente</Text>
        
        <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>Adicionar Foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Sua idade"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          placeholderTextColor="#666"
        />
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 123, 255, 0.3)', // Cor azul semi-transparente
  },
  formContainer: {
    flex: 1,
    padding: 20,
    marginTop: -50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  photoButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007BFF',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007BFF',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007BFF',
  },
  welcomeProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 20,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#007BFF',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
});
