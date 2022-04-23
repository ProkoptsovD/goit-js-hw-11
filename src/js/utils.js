import { refs } from '../js/refs.js';
import { makeGalleryCardsMarkup } from './make-gallery-cards-markup.js';

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

function clearGallery() {
  refs.gallery.innerHTML = '';
}

export { parseData, renderImages, clearGallery };
