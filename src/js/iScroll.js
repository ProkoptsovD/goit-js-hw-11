import debounce from 'lodash.debounce';

export default class iScroll {
  #startPosition;
  #debouncedTrackElementPosition;

  constructor(parentDOMElement) {
    this.target = parentDOMElement;
    this.#startPosition = null;
    this.#debouncedTrackElementPosition = debounce(this.#trackElementPosition, 100);
  }

  #getPosition = () => {
    const parent = this.target.getBoundingClientRect();
    const firstChild = this.target.firstElementChild.getBoundingClientRect();
    const lastChild = this.target.lastElementChild.getBoundingClientRect();

    return { parent, firstChild, lastChild };
  };

  setStartPosition = () => {
    const { lastChild } = this.#getPosition();
    this.#startPosition = lastChild.y;
  };

  #trackElementPosition = () => {
    const { lastChild } = this.#getPosition();

    if (lastChild.y < this.#startPosition / 4) {
      this.#throwEvent();
    }
  };

  #throwEvent = () => {
    const loadMore = new CustomEvent('load-more', { bubbles: true });
    this.target.lastChild.dispatchEvent(loadMore);
  };

  watchFetchPoint = () => {
    window.addEventListener('scroll', this.#debouncedTrackElementPosition);
  };

  removeScroll = () => {
    window.removeEventListener('scroll', this.#debouncedTrackElementPosition);
  };

  reset() {
    this.#startPosition = null;
  }
}
