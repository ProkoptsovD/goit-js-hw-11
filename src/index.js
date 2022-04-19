//================== npm pakages ======================//
import SimpleLightbox from 'simplelightbox';
import throttle from 'lodash.throttle';
import axios from 'axios';

//================== refs, fns & classes =====================//
import Fetcher from './js/Fetcher.js';
import iScroll from './js/iScroll.js';
import { refs } from './js/refs';
import { makeGalleryCardsMarkup } from './js/make-gallery-cards-markup.js';
import { alertMessage } from './js/alert-messages.js';

//==================== configs ========================//
import { simpleOptions } from './js/simplelightbox-options';
import { searchOptions } from './js/search-options';

//==================== styles ==========================//
import 'simplelightbox/dist/simple-lightbox.min.css';

//====================== CODE ITSELF ==============================//

refs.form.addEventListener('submit', onFormSubmitFetchAndRenderImages);

const pixabay = new Fetcher(searchOptions);

async function onFormSubmitFetchAndRenderImages(e) {
  e.preventDefault();

  const searchQuery = e.target[0].value.toLowerCase().trim();

  const response = await pixabay.find(searchQuery);
  const data = await parseData(response);

  if (!data.length) {
    alertMessage('error');
    return;
  }

  clearGallery();
  renderImages(data);
  renderGalleryStyles();

  alertMessage('success', {
    success: `Hooray! We found  images.`,
  });
  e.target.reset(); // form reset after submit

  //======================== pagination =========================//
  // const page = pixabay.paginator();
  // const a = await page.next();
  // const b = await a.value.data.hits;
  // console.log(b);
}

async function parseData(rawData) {
  try {
    const parsedData = await rawData.data.hits;
    const readyForRenderData = await Promise.all(parsedData.map(extractImageData));

    return readyForRenderData;
  } catch (err) {
    console.log(err);
  }
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

function renderGalleryStyles() {
  const lightbox = new SimpleLightbox('.gallery a', simpleOptions);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
