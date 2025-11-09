class dashboardView {
  _parentElement =  document.querySelector('.sb-nav');

  addHandlerNavigatePage(handler){
    this._parentElement.addEventListener('click',function(e){
        const navMenu = e.target.closest('.nav-link');
        if(!navMenu) return;
        const childLinks = document.querySelectorAll('.nav-link');
        childLinks.forEach(nav => nav.classList.remove('nav-link-active'));
        // console.log(navMenu);
        navMenu.classList.add('nav-link-active');
        const toNavMenu = navMenu.dataset.navLink;
        if(toNavMenu) handler(toNavMenu);
    })
  }
}

export default new dashboardView();