function makeGalleryCardsMarkup(images) {
  return images.map(
    ({ webformatURL, largeImageURL, metaData: { views, downloads, likes, tags, comments } }) => {
      return `
            <li class="post">
              <a class="gallery__item" href="${largeImageURL}">
                <div class="photo-card">
                  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                  <div class="info">
                    <p class="info-item">
                      ${likes}
                      <b>Likes</b>
                    </p>
                    <p class="info-item">
                      ${views}
                      <b>Views</b>
                    </p>
                    <p class="info-item">
                      ${comments}
                      <b>Comments</b>
                    </p>
                    <p class="info-item">
                      ${downloads}
                      <b>Downloads</b>
                    </p>
                  </div>
                </div>
              </a>
            </li>
      `;
    },
  ).join``;
}

export { makeGalleryCardsMarkup };
