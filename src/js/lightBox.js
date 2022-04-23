//================== npm pakages ======================//
import SimpleLightbox from 'simplelightbox';

//==================== configs and refs ========================//
import { simpleOptions } from '../js/simplelightbox-options.js';
import { refs } from '../js/refs.js';

const lightBox = {
  galery: null,

  renderGalleryStyles() {
    this.galery = new SimpleLightbox(refs.gallerySimpleLightBox, simpleOptions);
  },
};

export { lightBox };
