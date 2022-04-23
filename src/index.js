//================== npm pakages ======================//
import SimpleLightbox from 'simplelightbox';

//================== refs, fns & classes =====================//
import Fetcher from './js/Fetcher.js';
import iScroll from './js/iScroll.js';
import BackOnTop from './js/BackOnTop.js';

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
const infiniteScroll = new iScroll(refs.gallery);
const n = new BackOnTop(refs.toTopBtn);

pixabay.init();

async function onFormSubmitFetchAndRenderImages(e) {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value.toLowerCase().trim();

  if (!searchQuery) {
    alertMessage('warning');

    return;
  }

  const response = await pixabay.find(searchQuery);
  const data = await parseData(response);

  if (!data.length) {
    alertMessage('error');
    return;
  }

  clearGallery();
  renderImages(data);
  renderGalleryStyles();

  alertMessage('success', null, pixabay.totalHits);

  this.reset(); // form reset after submit

  //======================== pagination =========================//
  infiniteScroll.setStartPosition();
  infiniteScroll.watchFetchPoint();
  const pagination = pixabay.gen(pixabay.url, pixabay.pagesLeft);
  const onCustomEventLoadMoreBinded = onCustomEventLoadMore.bind(this, pagination, infiniteScroll);

  refs.gallery.addEventListener('load-more', onCustomEventLoadMoreBinded);
  refs.form.addEventListener(
    'submit',
    () => {
      refs.gallery.removeEventListener('load-more', onCustomEventLoadMoreBinded);
      infiniteScroll.removeScroll();
      infiniteScroll.reset();
      pagination.reset();
    },
    { once: true },
  );
}

async function onCustomEventLoadMore(pagination, infiniteScroll) {
  const nextPageUrl = pagination.next().value;
  const noImagesAreLeft = !(await nextPageUrl);

  if (noImagesAreLeft) {
    refs.gallery.removeEventListener('load-more', onCustomEventLoadMore);
    infiniteScroll.removeScroll();
    infiniteScroll.reset();
    pixabay.reset();

    alertMessage('end');

    return;
  }

  const response = await pixabay.loadMore(nextPageUrl);
  const dataImages = await parseData(response);

  renderImages(dataImages);
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
