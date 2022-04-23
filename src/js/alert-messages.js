import { Notify } from 'notiflix';

const messages = {
  error: 'Sorry, there are no images matching your search query. Please try again',
  success: 'Searching has started',
  end: 'No more images to download are left',
  warning: 'Type something to start searching...',
};

function alertMessage(messageType, message = messages, amountOfImagesFound = '') {
  switch (messageType) {
    case 'error':
      Notify.failure(message.error);
      break;
    case 'success':
      Notify.success(message?.success || `Hooray! We found ${amountOfImagesFound} images.`);
      break;
    case 'end':
      Notify.info(message.end, { timeout: 5000 });
      break;
    case 'warning':
      Notify.warning(message.warning);
  }
}

export { alertMessage };
