import { Notify } from 'notiflix';

const messages = {
  error: 'Sorry, there are no images matching your search query. Please try again',
  success: 'Searching has started',
  end: "We're sorry, but you've reached the end of search results.",
  warning: 'Type something to start searching...',
};

function alertNotification(messageType, message = messages, amountOfImagesFound = '') {
  switch (messageType) {
    case 'error':
      Notify.failure(message.error);
      break;
    case 'success':
      Notify.success(message?.success || `Hooray! We found ${amountOfImagesFound} images.`);
      break;
    case 'end':
      Notify.info(message.end, { timeout: 10000 });
      break;
    case 'warning':
      Notify.warning(message.warning);
  }
}

export { alertNotification };
