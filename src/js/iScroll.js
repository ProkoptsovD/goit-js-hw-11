import axios from 'axios';

export default class iScroll {
  constructor(parentDOMElement) {
    this.target = parentDOMElement;
    this.intervalID = null;
    this.startPos = null;
  }

  getPosition() {
    const parent = this.target.getBoundingClientRect();
    const firstChild = this.target.firstElementChild.getBoundingClientRect();
    const lastChild = this.target.lastElementChild.getBoundingClientRect();

    return { parent, firstChild, lastChild };
  }

  requestPoint() {
    const { lastChild } = this.getPosition();
    this.startPos = lastChild.y;
    this.intervalID = setInterval(() => {
      const { parent, lastChild } = this.getPosition();

      if (lastChild.y < this.startPos / 4) {
        const r = new CustomEvent('fetch-time', { bubbles: true });
        this.target.lastChild.dispatchEvent(r);
      }
    }, 2000);
  }

  removeScroll() {
    clearInterval(this.intervalID);
  }
}
