import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type AppNavigationProp = StackNavigationProp<RootStackParamList>;

export function useAppNavigation() {
  const navigation = useNavigation<AppNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, keyof RootStackParamList>>();

  const navigateToAddNote = () => {
    navigation.navigate('AddNote');
  };

  const navigateToEditNote = (note: RootStackParamList['EditNote']['note']) => {
    navigation.navigate('EditNote', { note });
  };

  const navigateToMain = () => {
    navigation.replace('Main');
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return {
    navigation,
    route,
    navigateToAddNote,
    navigateToEditNote,
    navigateToMain,
    goBack,
  };
} 