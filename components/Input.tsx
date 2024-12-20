import React from 'react';
import { 
  TextInput, 
  View, 
  Text, 
  StyleSheet, 
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: string;
  onIconPress?: () => void;
  containerStyle?: any;
}

export function Input({ 
  label, 
  error, 
  icon,
  onIconPress,
  containerStyle,
  ...props 
}: InputProps) {
  const { spacing, fontSize } = useResponsive();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label,
          { 
            marginBottom: spacing.xs,
            fontSize: fontSize.sm 
          }
        ]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        { 
          height: spacing.xl,
          paddingHorizontal: spacing.md 
        },
        error && styles.inputError
      ]}>
        <TextInput
          style={[
            styles.input,
            { fontSize: fontSize.md }
          ]}
          placeholderTextColor="#999"
          {...props}
        />
        {icon && (
          <TouchableOpacity 
            onPress={onIconPress}
            style={[
              styles.iconContainer,
              { padding: spacing.xs }
            ]}
          >
            <Ionicons 
              name={icon} 
              size={fontSize.lg} 
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={[
          styles.errorText,
          { 
            marginTop: spacing.xs,
            fontSize: fontSize.sm 
          }
        ]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: '#333',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
  },
}); 