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
    const scrollTotal = this.rootElement.scrollHeight - this.rootElement.clientHeight;
    if (this.rootElement.scrollTop / scrollTotal > 0.2) {
      this.show();
    } else {
      this.hide();
    }
  };
  scrollToTop = () => {
    console.log('here');
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  show = () => {
    this.toTopBtn.classList.add('show');
  };
  hide = () => {
    this.toTopBtn.classList.remove('show', 'show');
  };
}
