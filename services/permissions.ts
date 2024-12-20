import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Audio from 'expo-av';
import { Alert, Linking, Platform } from 'react-native';

class PermissionsService {
  async requestCameraPermissions() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à câmera para tirar fotos.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configurações', onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
    return true;
  }

  async requestMediaLibraryPermissions() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à galeria para salvar e carregar imagens.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configurações', onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
    return true;
  }

  async requestAudioPermissions() {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso ao microfone para gravar áudios.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configurações', onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
    return true;
  }

  async requestAllPermissions() {
    const permissions = [];
    
    if (Platform.OS !== 'web') {
      permissions.push(
        this.requestCameraPermissions(),
        this.requestMediaLibraryPermissions(),
        this.requestAudioPermissions()
      );
    }

    const results = await Promise.all(permissions);
    return results.every(result => result === true);
  }
}

export const permissions = new PermissionsService(); 