export default class BackOnTop {
  constructor(targetElement) {
    this.toTopBtn = targetElement;
    this.rootElement = document.documentElement;

    this.init();
  }

  init() {
    this.toTopBtn.addEventListener('click', this.scrollToTop);
    document.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const SCROLL_VALUE_TO_SHOW_BTN = 0.2;
    const scrollTotal = this.rootElement.scrollHeight - this.rootElement.clientHeight;

    if (this.rootElement.scrollTop / scrollTotal > SCROLL_VALUE_TO_SHOW_BTN) {
      this.show();
    } else {
      this.hide();
    }
  };
  scrollToTop = () => {
    const SCROLL_PIXELS = 0;

    document.documentElement.scrollTo({
      top: SCROLL_PIXELS,
      behavior: 'smooth',
    });
  };
  show = () => {
    this.toTopBtn.classList.add('show');
  };
  hide = () => {
    this.toTopBtn.classList.remove('show');
  };
}
