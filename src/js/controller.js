import { createIcons, icons } from "lucide";
import * as Model from "./model.js";
import sideBarView from "./Views/sideBarView.js";
import settingsView from "./Views/settingsView.js";
import transactionsView from "./Views/transactionsView.js";
import addTransactionView from "./Views/addTransactionView.js";
import dashboardView from "./Views/dashboardView.js";
import Papa from "papaparse";

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
    displayTransactionswithPagination(1);
    // const transactionsData = Model.displayTransactions(
    //   1,
    //   Model.state.transactions
    // );
    // transactionsView.renderView(transactionsData);
    // transactionsView.selectTransactionPage(displayTransactionswithPagination);
    // transactionsView.sortTransactionsHandler(sortTransactions);
    // transactionsView.openTransactionModal(openAddTransactionsView);
    // transactionsView.filterData(filerTransactions);
    // transactionsView.renderView(Model.state.transactions);
  }
  if(targetPage == "dashboard"){
    const data = returndetailsforDashboard();
    dashboardView.renderView(data);
    dashboardView.openAddTransactionView(openAddTransactionsView);
  }
  if(targetPage == "analytics"){
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
const displayTransactionswithPagination = function (pageNo, transactions) {

  let transactionsData;
  const params = new URLSearchParams(window.location.search);
  if (params.toString()) {
    const categoryParams = params.get("category");
    const startDateParams = params.get("startDate");
    const endDateParams = params.get("endDate");
    // console.log("has params", categoryParams, startDateParams, endDateParams);
    transactionsData = Model.filterTransactions(
      categoryParams,
      startDateParams,
      endDateParams,
      pageNo
    );
    // console.log(transactionsData);
  } else {
   transactionsData = Model.displayTransactions(
      pageNo,
      Model.state.transactions
    );
    console.log(transactionsData);
  }
  transactionsView.renderView(transactionsData);
  transactionsView.selectTransactionPage(displayTransactionswithPagination);
  transactionsView.sortTransactionsHandler(sortTransactions);
  transactionsView.openTransactionModal(openAddTransactionsView);
  transactionsView.filterData(filerTransactions);
  transactionsView.editTransactionsHandler(openAddTransactionsView);
  transactionsView.deleteTransactionsHandler(deleteTransactions);
  transactionsView.exportTransactionsHanlder(exportTransactions);
};

const sortTransactions = function (obj) {
  // console.log(obj);
  if (!obj) return;
  const pageNo = Model.updateSortedTransactions(obj);
  displayTransactionswithPagination(pageNo);
};

const filerTransactions = function (category, startDate, endDate) {
  if (!category && !startDate && !endDate) return;
  console.log(category, startDate, endDate);
  const url = new URL(window.location.href);
  if (category) {
    url.searchParams.set("category", category);
  } else {
    url.searchParams.delete("category");
  }
  if (startDate) {
    url.searchParams.set("startDate", startDate);
  } else {
    url.searchParams.delete("startDate");
  }
  if (endDate) {
    url.searchParams.set("endDate", endDate);
  } else {
    url.searchParams.delete("endDate");
  }
  window.history.replaceState({}, '', url);
  const transactionsData = Model.filterTransactions(
    category,
    startDate,
    endDate
  );
  console.log(transactionsData);
  // transactionsView.displayUpdatedTransactions(transactionsData);
  transactionsView.renderView(transactionsData);
  transactionsView.selectTransactionPage(displayTransactionswithPagination);
  transactionsView.sortTransactionsHandler(sortTransactions);
  transactionsView.openTransactionModal(openAddTransactionsView);
  transactionsView.filterData(filerTransactions);
  transactionsView.editTransactionsHandler(openAddTransactionsView);
  transactionsView.deleteTransactionsHandler(deleteTransactions);
  transactionsView.exportTransactionsHanlder(exportTransactions);
};

const exportTransactions = function(){
  const data = Model.exportTransactions();
  // console.log(data);
  const csv = Papa.unparse(data);
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "transactions.csv";
  a.click();
}

//---------Add Transactions View--------
const openAddTransactionsView = function (sectionClass,isEdit=false,id =0) {
  let transaction;
  // console.log(id);
  if(isEdit){
    transaction = Model.getIndividualTransaction(id);
  }
  if(isEdit && !transaction) return;
  // console.log(transaction)
  const userData = Model.returnUserDetails();
  // console.log('click');
  addTransactionView.renderView(
      sectionClass,
      userData.categories,
      isEdit,
      transaction
    );
  addTransactionView.updateTransactions(updateTransactions);
};

const updateTransactions = function (
  formData,
  sectionClass,
  isEdit = false,
  id = 0
) {
  // console.log(formData);
  transactionsView.renderSpinner();
  if (isEdit) {
    // console.log(id,formData);
    Model.updateTransactions(formData, id);
  } else {
    Model.addTransactions(formData);
  }
  addTransactionView.closeModal();
  const modalMessage = isEdit
    ? "Transaction Updated Successfully"
    : "Transaction Added Successfully";
  if (sectionClass === "section-transaction") {
    controlNavigation("transactions");
    transactionsView.displaySuccessMessage(modalMessage, "OK");
  } else if (sectionClass === "section-dashboard") {
    controlNavigation("dashboard");
    dashboardView.displaySuccessMessage(modalMessage, "OK");
  }
};

const deleteTransactions = function(transId){
  console.log(transId);
  Model.deleteTransaction(transId);
  controlNavigation("transactions");
  transactionsView.displaySuccessMessage('Transaction Updated Successfully', "OK");
};

//---------Dashboard View--------

const returndetailsforDashboard = function (){
  // const today = new Date();
  // console.log(today);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  // console.log(currentMonth);
  const dashboardData =Model.dashboardData(currentMonth,currentYear);
  // console.log(dashboardData);
  return dashboardData;
}

const init = function () {
  createIcons({ icons });
  sideBarView.addHandlerNavigatePage(controlNavigation);
};

init();
