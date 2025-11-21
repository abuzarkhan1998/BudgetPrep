import { createIcons, icons } from "lucide";
import * as Model from "./model.js";
import dashboardView from "./Views/dashboardView.js";
import settingsView from "./Views/settingsView.js";

const controlNavigation = async function (targetPage) {
//   console.log(targetPage);
setUrl(targetPage);
if(targetPage === 'settings')
{
    const apiData = await Model.getCountriesFromApi();
    const userData = Model.returnUserDetails();
    // console.log(apiData);
    settingsView.renderView(apiData,userData);
    settingsView.navigateTabs();
    settingsView.addHandlerShowCurrency();
    settingsView.selectCountry();
    settingsView.submitProfileForm(updateProfileDetails);
    settingsView.submitBudgetForm(updateUserBudget);
    settingsView.preventTextCharacters();
    settingsView._handleClickonColorPicker();
}
};

const setUrl = function(targetUrl){
    const url = new URL(window.location.href);
    const newUrl = `${url.origin}/${targetUrl}`;
    // console.log(newUrl);
    history.pushState({},'',newUrl);
}

const updateProfileDetails = function(formData){
    console.log(formData);
    Model.updateProfileDetails(formData);
}

const updateUserBudget = function(formData)
{
    console.log(formData);
    Model.updateUserBudget(formData);
}

const returnUserDetails = function(){
    const colorsData = Model.returnUserDetails();
    return colorsData;
}

const init = function () {
  createIcons({ icons });
  dashboardView.addHandlerNavigatePage(controlNavigation);
};

init();
