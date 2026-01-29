class sideBarView {
  _parentElement = document.querySelector(".sb-nav");
  _navBtnEl = document.querySelector(".nav-btn");

  addHandlerNavigatePage(handler) {
    this._parentElement.addEventListener("click", (e) => {
      e.preventDefault();
      const navMenu = e.target.closest(".nav-link");
      if (!navMenu) return;
      if (this._parentElement.classList.contains("nav-open")) {
        this._toggleNav();
      }
      const childLinks = document.querySelectorAll(".nav-link");
      childLinks.forEach((nav) => nav.classList.remove("nav-link-active"));
      // console.log(navMenu);
      navMenu.classList.add("nav-link-active");
      const toNavMenu = navMenu.dataset.navLink;
      if (toNavMenu) handler(toNavMenu);
    });
  }

  toggleNavMenuForMobile() {
    this._navBtnEl.addEventListener("click", this._toggleNav);
  }

  _toggleNav() {
    const navMenu = document.querySelector(".sb-nav");
    const menuBtn = document.querySelector(".nav-menu-btn");
    const closeBtn = document.querySelector(".nav-close-btn");
    const bodyEl = document.querySelector("body");
    const htmlEl = document.querySelector("html");
    navMenu.classList.toggle("nav-open");
    menuBtn.classList.toggle("hidden");
    closeBtn.classList.toggle("hidden");
    bodyEl.classList.toggle("disable-y-overflow");
    htmlEl.classList.toggle("disable-y-overflow");
  }
}

export default new sideBarView();
