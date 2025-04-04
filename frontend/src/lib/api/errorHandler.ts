import { useToastStore } from '../../stores/toastStore';

export const handleApiError = (error: any) => {
  const { addToast } = useToastStore.getState();
  
  // Extract error message from different error formats
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with an error
    const data = error.response.data;
    
    if (typeof data === 'string') {
      errorMessage = data;
    } else if (data.message) {
      errorMessage = data.message;
    } else if (data.error) {
      errorMessage = data.error;
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'Unable to connect to the server. Please check your internet connection.';
  } else if (error.message) {
    // Error occurred during request setup
    errorMessage = error.message;
  }
  
  // Show error toast
  addToast('error', errorMessage);
  
  // Return the error for further handling if needed
  return error;
}; 