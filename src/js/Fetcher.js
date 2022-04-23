import axios from 'axios';

export default class Fetcher {
  #API_CONFIG;
  #SEARCH_CONFIG;
  #pagesLeft;

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

    this.url = null;
    this.#pagesLeft = null;
    this.totalHits = null;
    this.counter = 1;

    this.gen = null;

    this.#setApiConfig(apiConfig);
    this.setSearchConfig(searchConfig);
  }

  init() {
    this.gen = this.resetableGenerator(this.paginator);
  }

  #setApiConfig(options) {
    this.#API_CONFIG = Object.assign(this.#API_CONFIG, options);
  }
  setSearchConfig(options) {
    this.#SEARCH_CONFIG = Object.assign(this.#SEARCH_CONFIG, options);
  }

  async find(userQuery) {
    try {
      const rawData = await axios.get(this.#makeURL(userQuery));

      await this.#setPageInfo(rawData);

      return rawData;
    } catch (error) {
      console.log(error.stack);
    }
  }

  async #setPageInfo(response) {
    const pagesQuantaty = await response.data.totalHits;
    this.totalHits = await pagesQuantaty;
    this.#pagesLeft = Math.ceil((await pagesQuantaty) / this.#SEARCH_CONFIG.per_page);
  }

  get pagesLeft() {
    return this.#pagesLeft;
  }

  set pagesLeft(newAmount) {
    this.#pagesLeft = newAmount;
  }

  *paginator(...args) {
    const currrentPageUrl = args[0];
    const numberOfPages = args[1];

    for (let i = 2; i <= numberOfPages; i += 1) {
      yield `${currrentPageUrl}&page=${i}`;
    }
  }

  async loadMore(url) {
    try {
      return await axios.get(url);
    } catch (err) {
      console.log(err);
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

    this.url = url;

    return url;
  }

  reset() {
    this.#pagesLeft = null;
    this.url = null;
  }

  resetableGenerator(f) {
    const proxy = new Proxy(f, {
      apply(target, thisArg, argumentsList) {
        const base = target.call(thisArg, ...argumentsList);
        const basenext = base.next;
        let generator = base;
        base.next = function next() {
          return generator === base
            ? basenext.call(base) // generator is the original one
            : generator.next(); // generator is the reset one
        };
        // define reset to use the original arguments to create
        // a new generator and assign it to the generator variable
        Object.defineProperty(generator, 'reset', {
          enumerable: false,
          value: () => (generator = target.call(thisArg, ...argumentsList)),
        });
        // return the generator, which now has a reset method
        return generator;
      },
    });
    // return proxy which will create a generator with a reset method
    return proxy;
  }
}
