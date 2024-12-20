import { Alert } from 'react-native';
import { ErrorType } from '../types';

class ErrorHandler {
  private logError(error: ErrorType) {
    // Em produção, você pode enviar para um serviço de log como Sentry
    console.error('Error:', {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
    });
  }

  public handleError(error: any): ErrorType {
    let formattedError: ErrorType;

    if (error.code && error.message) {
      formattedError = error;
    } else if (error instanceof Error) {
      formattedError = {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        details: error.stack,
      };
    } else {
      formattedError = {
        code: 'UNKNOWN_ERROR',
        message: 'Ocorreu um erro inesperado.',
        details: error,
      };
    }

    this.logError(formattedError);
    return formattedError;
  }

  public showError(error: ErrorType) {
    const friendlyMessage = this.getFriendlyMessage(error.code);
    Alert.alert('Erro', friendlyMessage);
  }

  private getFriendlyMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'STORAGE_ERROR': 'Não foi possível salvar os dados. Por favor, tente novamente.',
      'PERMISSION_DENIED': 'Permissão negada. Verifique as configurações do seu dispositivo.',
      'MEDIA_ERROR': 'Erro ao processar mídia. Verifique se o arquivo é válido.',
      'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet.',
      'UNKNOWN_ERROR': 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    };

    return errorMessages[errorCode] || errorMessages['UNKNOWN_ERROR'];
  }
}

export const errorHandler = new ErrorHandler(); 