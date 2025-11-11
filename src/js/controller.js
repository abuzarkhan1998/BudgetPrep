import { createIcons, icons } from "lucide";
import * as Model from "../js/Views/settingsView";
import dashboardView from "./Views/dashboardView";
import settingsView from "./Views/settingsView";

const controlNavigation = function (targetPage) {
//   console.log(targetPage);
setUrl(targetPage);
if(targetPage === 'settings')
{
    settingsView.renderView();
    settingsView.navigateTabs();
}
};

const setUrl = function(targetUrl){
    const url = new URL(window.location.href);
    const newUrl = `${url.origin}/${targetUrl}`;
    // console.log(newUrl);
    history.pushState({},'',newUrl);
}


const init = function () {
  createIcons({ icons });
  dashboardView.addHandlerNavigatePage(controlNavigation);
};

init();
