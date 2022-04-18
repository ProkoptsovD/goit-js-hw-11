//================== npm pakages ======================//
import SimpleLightbox from 'simplelightbox';

//================== fn & classes =====================//
import Fetcher from './js/Fetcher.js';
import { refs } from './js/refs';
import { makeGalleryCardsMarkup } from './js/make-gallery-cards-markup.js';
import { alertMessage } from './js/alert-messages.js';

//==================== configs ========================//
import simpleOptions from './js/simplelightbox-options';

//==================== styles ==========================//
import 'simplelightbox/dist/simple-lightbox.min.css';

refs.form.addEventListener('submit', onFormSubmitFetchAndRenderImages);

const pixabay = new Fetcher();

async function onFormSubmitFetchAndRenderImages(e) {
  e.preventDefault();

  const searchQuery = e.target[0].value.toLowerCase().trim();

  const rawImagesData = await pixabay.find(searchQuery);
  const parsedImagesData = await rawImagesData.data.hits;
  const readyForRenderImagesData = await Promise.all(parsedImagesData.map(extractImageData));

  renderImages(readyForRenderImagesData);
  const lightbox = new SimpleLightbox('.gallery a', simpleOptions);

  e.target.reset(); // form reset after submit
}

async function extractImageData(image) {
  const { webformatURL, largeImageURL, views, downloads, likes, tags, comments } = image;
  const links = {};
  const metaData = {};

  metaData.views = views;
  metaData.downloads = downloads;
  metaData.likes = likes;
  metaData.tags = tags;
  metaData.comments = comments;

  links.webformatURL = webformatURL;
  links.largeImageURL = largeImageURL;
  links.metaData = metaData;

  return links;
}

function renderImages(data) {
  const galleryCardsMarkup = makeGalleryCardsMarkup(data);

  refs.gallery.insertAdjacentHTML('beforeend', galleryCardsMarkup);
}
