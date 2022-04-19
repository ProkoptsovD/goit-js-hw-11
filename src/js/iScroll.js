import axios from 'axios';

export default class iScroll {
  constructor(parentDOMElement) {
    this.target = parentDOMElement;
    this.intervalID = null;
  }

  getPosition() {
    const parent = this.target.getBoundingClientRect();
    const firstChild = this.target.firstElementChild.getBoundingClientRect();
    const lastChild = this.target.lastElementChild.getBoundingClientRect();

    return { parent, firstChild, lastChild };
  }

  requestPoint(paginationList) {
    this.intervalID = setInterval(() => {
      const { parent, firstChild } = this.getPosition();
      const cardHeight = firstChild.height;
      const cardPosY = firstChild.y;
      const paretHeight = parent.height;
      const isTimeToFetch = Math.abs(cardPosY) >= paretHeight - cardHeight * 4;
    }, 400);
  }

  async nextPage(url) {
    try {
      return await axios.get(url);
    } catch (error) {
      console.log(error.stack);
    }
  }

  removeScroll() {
    clearInterval(this.intervalID);
  }
}
