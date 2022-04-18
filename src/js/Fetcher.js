import axios from 'axios';

export default class Fetcher {
  #API_CONFIG;
  #SEARCH_CONFIG;

  constructor(apiConfig = {}, searchConfig = {}) {
    this.#API_CONFIG = {
      authToken: '26833467-1cbfd866f0eba1c472f46f3e4',
      baseUrl: 'https://pixabay.com/api/',
    };
    this.#SEARCH_CONFIG = {
      page: '1',
      per_page: 10,
      order: 'popular',
      editors_choice: false,
      category: 'all',
      orientation: 'horizontal',
      image_type: 'photo',
      safesearch: true,
    };
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

  #makeURL(query) {
    const { authToken, baseUrl } = this.#API_CONFIG;
    const searchParams = Object.keys(this.#SEARCH_CONFIG).map(
      param => `&${param}=${this.#SEARCH_CONFIG[param]}`,
    ).join``;
    const sanitizedQuery = query.trim();

    const url = `${baseUrl}?key=${authToken}${
      sanitizedQuery ? '&q=' + sanitizedQuery : ''
    }${searchParams}`;

    return url;
  }
}
