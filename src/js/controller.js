import { createIcons, icons } from "lucide";
import * as Model from "./model.js";
import dashboardView from "./Views/dashboardView.js";
import settingsView from "./Views/settingsView.js";
import transactionsView from "./Views/transactionsView.js";
import addTransactionView from "./Views/addTransactionView.js";

const controlNavigation = async function (
  targetPage,
  targetTab = "settings-profile-container"
) {
  //   console.log(targetPage);
  setUrl(targetPage);
  if (targetPage === "settings") {
    settingsView.renderSpinner();
    const apiData = await Model.getCountriesFromApi();
    const userData = Model.returnUserDetails();
    // console.log(apiData);
    settingsView.renderView(apiData, userData, targetTab);
    settingsView.submitProfileForm(updateProfileDetails);
    settingsView.submitBudgetForm(updateUserBudget);
    settingsView.addCategoryForm(addCategoryForm);
    settingsView.updateCategory(updateCategory);
    settingsView.deleteCategory(deleteCategory);
  }
  if (targetPage == "transactions") {
    transactionsView.renderView(Model.state.transactions);
    transactionsView.openTransactionModal(openAddTransactionsView);
  }
};

const setUrl = function (targetUrl) {
  const url = new URL(window.location.href);
  const newUrl = `${url.origin}/${targetUrl}`;
  // console.log(newUrl);
  history.pushState({}, "", newUrl);
};


//---------Settings View--------

const updateProfileDetails = async function (formData) {
  settingsView.renderSpinner();
  console.log(formData);
  Model.updateProfileDetails(formData);
  await controlNavigation("settings");
  settingsView.displaySuccessMessage("Profile Details Updated", "OK");
};

const updateUserBudget = async function (formData) {
  settingsView.renderSpinner();
  console.log(formData);
  Model.updateUserBudget(formData);
  await controlNavigation("settings", "settings-budget-container");
  settingsView.displaySuccessMessage("Budget Details Updated", "OK");
};

const addCategoryForm = async function (formData) {
  // console.log(formData);
  Model.addCategories(formData);
  await controlNavigation("settings", "settings-categories-container");
  settingsView.displaySuccessMessage("Category Added Successfully", "OK");
};

const updateCategory = async function (catId, catName, color) {
  // console.log(catId,catName,color);
  const category = {
    id: +catId,
    name: catName,
    color,
  };
  Model.updateCategory(category);
  await controlNavigation("settings", "settings-categories-container");
  settingsView.displaySuccessMessage("Category Updated Successfully", "OK");
};

const deleteCategory = async function (categoryId) {
  // console.log(categoryId);
  Model.deleteCategory(categoryId);
  await controlNavigation("settings", "settings-categories-container");
  settingsView.displaySuccessMessage("Category Deleted Successfully", "OK");
};

// const returnUserDetails = function(){
//     const colorsData = Model.returnUserDetails();
//     return colorsData;
// }


//---------Transactions View--------


//---------Add Transactions View--------
const openAddTransactionsView = function(sectionClass){
    const userData = Model.returnUserDetails();
    // console.log('click');
    addTransactionView.renderView(sectionClass,userData.categories);
    addTransactionView.updateTransactions(updateTransactions);
}

const updateTransactions = function(formData){
  // console.log(formData);
  transactionsView.renderSpinner();
  Model.addTransactions(formData);
  addTransactionView.closeModal();
  controlNavigation("transactions");
  transactionsView.displaySuccessMessage("Transaction Added Successfully", "OK");
}

const init = function () {
  createIcons({ icons });
  dashboardView.addHandlerNavigatePage(controlNavigation);
};

init();
