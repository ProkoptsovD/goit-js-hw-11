import { Notify } from 'notiflix';

const alertMessages = {
  error: 'Sorry, there are no images matching your search query. Please try again',
  success: 'All is good',
};

function alertMessage(messageType, messages = alertMessages) {
  switch (messageType) {
    case 'error':
      Notify.failure(messages.error);
      break;
    case 'success':
      Notify.success(messages.success);
      break;
  }
}

export { alertMessage };
