import axios from 'axios';

export default class Fetcher {
  #API_CONFIG;
  #SEARCH_CONFIG;
  #url;
  #pages;

  constructor(searchConfig = {}, apiConfig = {}) {
    this.#API_CONFIG = {
      authToken: '26833467-1cbfd866f0eba1c472f46f3e4',
      baseUrl: 'https://pixabay.com/api/',
    };
    this.#SEARCH_CONFIG = {
      per_page: '20',
      order: 'popular',
      editors_choice: false,
      category: 'all',
      orientation: 'horizontal',
      image_type: 'photo',
      safesearch: true,
    };

    this.#url = null;
    this.#pages = null;
    this.#setApiConfig(apiConfig);
    this.setSearchConfig(searchConfig);
  }

  #setApiConfig(options) {
    this.#API_CONFIG = Object.assign(this.#API_CONFIG, options);
  }
  setSearchConfig(options) {
    this.#SEARCH_CONFIG = Object.assign(this.#SEARCH_CONFIG, options);
  }

  async find(userQuery) {
    try {
      if (!userQuery) {
        return;
      }

      const url = userQuery.includes(this.#API_CONFIG.baseUrl)
        ? userQuery
        : this.#makeURL(userQuery);

      const rawData = await axios.get(url);
      const pagesQuantaty = await rawData.data.totalHits;
      this.pages = pagesQuantaty;

      return rawData;
    } catch (error) {
      console.log(error.stack);
    }
  }

  get pages() {
    return this.#pages;
  }

  set pages(newAmount) {
    this.#pages = newAmount;
  }

  #makePaginationURL() {
    const numberOfPages = Math.ceil(+this.pages / +this.#SEARCH_CONFIG.per_page);
    const pagesLinks = [];
    for (let i = 1; i <= numberOfPages; i += 1) {
      pagesLinks.push(this.#url + '$page=' + i);
    }

    return pagesLinks;
  }

  async *paginator() {
    const pages = this.#makePaginationURL();

    for (let i = 1; i < this.pages; i += 1) {
      yield await this.find(pages[i]);
    }
  }

  #makeURL(query) {
    const { authToken, baseUrl } = this.#API_CONFIG;
    const searchParams = Object.keys(this.#SEARCH_CONFIG).map(
      param => `&${param}=${this.#SEARCH_CONFIG[param]}`,
    ).join``;
    const sanitizedQuery = query.trim();

    const url = `${baseUrl}?key=${authToken}${
      sanitizedQuery ? '&q=' + sanitizedQuery : ''
    }${searchParams}`;

    this.#url = url;

    return url;
  }
}
