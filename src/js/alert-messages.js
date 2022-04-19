import { Notify } from 'notiflix';

const messages = {
  error: 'Sorry, there are no images matching your search query. Please try again',
  success: 'Searching has started',
  end: "We're sorry, but you've reached the end of search results.",
};

function alertMessage(messageType, message = messages) {
  switch (messageType) {
    case 'error':
      Notify.failure(message.error);
      break;
    case 'success':
      Notify.success(message.success);
      break;
    case 'end':
      Notify.info(message.end);
      break;
  }
}

export { alertMessage };
