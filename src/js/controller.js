import { createIcons, icons } from "lucide";
import * as Model from "./model.js";
import dashboardView from "./Views/dashboardView.js";
import settingsView from "./Views/settingsView.js";

const controlNavigation = async function (targetPage,targetTab = 'settings-profile-container') {
//   console.log(targetPage);
setUrl(targetPage);
if(targetPage === 'settings')
{
    settingsView.renderSpinner();
    const apiData = await Model.getCountriesFromApi();
    const userData = Model.returnUserDetails();
    // console.log(apiData);
    settingsView.renderView(apiData,userData,targetTab);
    settingsView.navigateTabs();
    settingsView.addHandlerShowCurrency();
    settingsView.selectCountry();
    settingsView.submitProfileForm(updateProfileDetails);
    settingsView.submitBudgetForm(updateUserBudget);
    settingsView.preventTextCharacters();
    settingsView._handleClickonColorPicker();
    settingsView.addCategoryForm(addCategoryForm);
    settingsView.updateCategory(updateCategory);
}
};

const setUrl = function(targetUrl){
    const url = new URL(window.location.href);
    const newUrl = `${url.origin}/${targetUrl}`;
    // console.log(newUrl);
    history.pushState({},'',newUrl);
}

const updateProfileDetails = async function(formData){
    settingsView.renderSpinner();
    console.log(formData);
    Model.updateProfileDetails(formData);
    await controlNavigation('settings');
    settingsView.displaySuccessMessage('Profile Details Updated','OK');
}

const updateUserBudget = async function(formData)
{
    settingsView.renderSpinner();
    console.log(formData);
    Model.updateUserBudget(formData);
    await controlNavigation('settings','settings-budget-container');
    settingsView.displaySuccessMessage('Budget Details Updated','OK');
}

const addCategoryForm = async function(formData){
// console.log(formData);
Model.addCategories(formData);
await controlNavigation('settings','settings-categories-container');
settingsView.displaySuccessMessage('Category Added Successfully','OK');
}

const updateCategory = async function(catId,catName,color){
    // console.log(catId,catName,color);
    const category = {
        id:+catId,
        name:catName,
        color
    }
    Model.updateCategory(category);
    await controlNavigation('settings','settings-categories-container');
    settingsView.displaySuccessMessage('Category Updated Successfully','OK');
}

// const returnUserDetails = function(){
//     const colorsData = Model.returnUserDetails();
//     return colorsData;
// }

const init = function () {
  createIcons({ icons });
  dashboardView.addHandlerNavigatePage(controlNavigation);
};

init();
