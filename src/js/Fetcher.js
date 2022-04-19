import axios from 'axios';

export default class Fetcher {
  #API_CONFIG;
  #SEARCH_CONFIG;
  #url;
  #totalFound;

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
    this.#totalFound = 0;
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
      return await axios.get(this.#makeURL(userQuery));
    } catch (error) {
      console.log(error.stack);
    }
  }

  pagination(hits) {
    const numberOfPages = Math.ceil(+hits / +this.#SEARCH_CONFIG.per_page);
    const pages = [];
    for (let i = 1; i <= numberOfPages; i += 1) {
      pages.push(this.#url + '$page=' + i);
    }

    return pages;
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
