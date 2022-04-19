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

  const rawImagesData = await pixabay.find(searchQuery);
  const parsedImagesData = await rawImagesData.data.hits;

  if (!parsedImagesData.length) {
    alertMessage('error');
    return;
  }

  clearGallery();

  const readyForRenderImagesData = await Promise.all(parsedImagesData.map(extractImageData));
  renderImages(readyForRenderImagesData);

  const lightbox = new SimpleLightbox('.gallery a', simpleOptions);

  alertMessage('success', {
    success: `Hooray! We found ${rawImagesData.data.totalHits} images.`,
  });
  e.target.reset(); // form reset after submit

  //======================== pagination =========================//
  const pages = pixabay.pagination(await rawImagesData.data.totalHits);

  requestPoint(pages);
}
function getPosition() {
  const parent = refs.gallery.getBoundingClientRect();
  const firstChild = refs.gallery.firstElementChild.getBoundingClientRect();
  const lastChild = refs.gallery.lastElementChild.getBoundingClientRect();

  return { parent, firstChild, lastChild };
}

async function requestPoint(paginationList) {
  const intervalID = setInterval(() => {
    const { parent, firstChild } = getPosition();
    const cardHeight = firstChild.height;
    const cardPosY = firstChild.y;
    const paretHeight = parent.height;
    const isTimeToFetch = Math.abs(cardPosY) >= paretHeight - cardHeight * 4;

    let _pageNumber = 1;

    if (isTimeToFetch) {
      axios.get(paginationList[_pageNumber]).then(response => {
        const parsedImagesData = response.data.hits;

        console.log(parsedImagesData);
        const readyForRenderImagesData = Promise.all(parsedImagesData.map(extractImageData));
        console.log(readyForRenderImagesData);
        renderImages(readyForRenderImagesData);

        _pageNumber += 1;
      });
    }
  }, 1000);
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

function clearGallery() {
  refs.gallery.innerHTML = '';
}
