import { createIcons, icons } from "lucide";
import * as Model from "./model.js";
import dashboardView from "./Views/dashboardView.js";
import settingsView from "./Views/settingsView.js";

const controlNavigation = async function (targetPage) {
//   console.log(targetPage);
setUrl(targetPage);
if(targetPage === 'settings')
{
    settingsView.renderView();
    settingsView.navigateTabs();
    const apiData = await Model.getCountriesFromApi();
    console.log(apiData);
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
