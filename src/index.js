//================== refs, fns & classes =====================//
import Fetcher from './js/Fetcher.js';
import iScroll from './js/iScroll.js';
import BackOnTop from './js/BackOnTop.js';

import { refs } from './js/refs';
import { lightBox } from './js/lightBox.js';
import { parseData, renderImages, clearGallery } from './js/utils.js';
import { alertNotification } from './js/alert-messages.js';

//==================== configs ========================//
import { searchOptions } from './js/search-options';

//==================== styles ==========================//
import 'simplelightbox/dist/simple-lightbox.min.css';

//====================== CODE ITSELF ==============================//

refs.form.addEventListener('submit', onFormSubmitFetchAndRenderImages);

const pixabay = new Fetcher(searchOptions);
const infiniteScroll = new iScroll(refs.gallery);
const backOnTopBtn = new BackOnTop(refs.toTopBtn);

pixabay.initPagination();

async function onFormSubmitFetchAndRenderImages(e) {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value.toLowerCase().trim();

  if (!searchQuery) {
    alertNotification('warning');

    return;
  }

  const response = await pixabay.find(searchQuery);
  const data = await parseData(response);

  if (!data.length) {
    alertNotification('error');

    return;
  }

  clearGallery();
  renderImages(data);
  lightBox.renderGalleryStyles();
  alertNotification('success', null, pixabay.totalHits);

  this.reset(); // form reset after submit

  //======================== pagination block =========================//

  infiniteScroll.setStartPosition(); // cathes gallery's last element start position
  infiniteScroll.watchFetchPoint(); // calculates if the last element has reached to the gallery bottom and throws custom Event
  pixabay.startPagination(); // launches the generator which on every Event gives next pages for the current query

  refs.gallery.addEventListener('load-more', onCustomEventLoadMore);

  // resets pagination generator, if not all images found were loaded.
  // For example were found 7 pages of images, but user loaded only 3 of 7
  // so we need to reset generator and all set values both from iScroll and Fetcher(pixabay instance)
  refs.form.addEventListener(
    'submit',
    () => {
      refs.gallery.removeEventListener('load-more', onCustomEventLoadMore);

      infiniteScroll.removeScroll();
      infiniteScroll.reset();
      pixabay.pagination.reset();
    },
    { once: true },
  );
}

async function onCustomEventLoadMore() {
  const nextPageUrl = pixabay.pagination.next().value;
  const noImagesAreLeft = !(await nextPageUrl);

  if (noImagesAreLeft) {
    refs.gallery.removeEventListener('load-more', onCustomEventLoadMore); // if all pages are loaded, reset all values
    infiniteScroll.removeScroll();
    infiniteScroll.reset();
    pixabay.reset();

    alertNotification('end');

    return;
  }

  const response = await pixabay.loadMore(nextPageUrl);
  const dataImages = await parseData(response);

  renderImages(dataImages);
  lightBox.galery.refresh();
}
