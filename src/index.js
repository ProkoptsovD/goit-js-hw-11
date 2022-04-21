//================== npm pakages ======================//
import SimpleLightbox from 'simplelightbox';

//================== refs, fns & classes =====================//
import Fetcher from './js/Fetcher.js';
import iScroll from './js/iScroll.js';
import BackOnTop from './js/BackOnTop.js';

import { refs } from './js/refs';
import { makeGalleryCardsMarkup } from './js/make-gallery-cards-markup.js';
import { alertMessage } from './js/alert-messages.js';
import { sortBy } from './js/sort-by.js';

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

  alertMessage('success', {
    success: `Hooray! We found ${pixabay.totalHits} images.`,
  });

  e.target.reset(); // form reset after submit
  showSortByBtns(); // shows sorting buttons

  //======================== pagination =========================//
  infiniteScroll.setStartPosition();
  infiniteScroll.watchFetchPoint();
  const pagination = pixabay.gen(pixabay.url, pixabay.pagesLeft);
  const onCustomEventLoadMoreBinded = onCustomEventLoadMore.bind(this, pagination);

  refs.gallery.addEventListener('load-more', onCustomEventLoadMoreBinded);
  refs.submitBtn.addEventListener('click', () => {
    console.log('pagination is reseted');
    pagination.reset();
    refs.gallery.removeEventListener('load-more', onCustomEventLoadMoreBinded);
  });
}

function wathcSortByBtnClicked() {
  refs.sortBy.addEventListener('click', e => {
    const INPUT_ELEMENT = 'INPUT';
    const LABEL_ELEMENT = 'LABEL';

    const isInputBtnClicked = e.target.nodeName === INPUT_ELEMENT;
    const isLabelFieldClicked = e.target.nodeName === LABEL_ELEMENT;

    const sortCriterion = isInputBtnClicked ? e.target.value : e.target.textContent;

    console.log(sortCriterion);
  });
}

async function onCustomEventLoadMore(pagination) {
  let url = pagination.next().value;
  console.log(url);
  let response = await pixabay.loadMore(url);

  const areLastImagesLoaded = !response?.data?.hits.length;

  if (areLastImagesLoaded) {
    refs.gallery.removeEventListener('load-more', onCustomEventLoadMore);
    scroll.removeScroll();
    scroll.reset();
    pixabay.reset();

    return;
  }

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

function showSortByBtns() {
  refs.sortBy.classList.add('show');
}
