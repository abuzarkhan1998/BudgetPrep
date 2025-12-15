import { COUNTRY_API, COUNTRYAPI_KEY } from "./config.js";

export let state = {
  isInitialized: false,
  userDetails: {
    profile: {},
    budget:0,
    categories: [
      { id: 1, name: "Food & Groceries", color: "#8dc4ff", isDefault: true },
      { id: 2, name: "Rent & Utilities", color: "#60d2ca", isDefault: true },
      { id: 3, name: "Transportation", color: "#b089f4", isDefault: true },
    ],
    colors:['#8dc4ff','#60d2ca','#b089f4','#e57373','#ffB74d','#ffd54f','#81c784','#4db6ac', '#64b5f6', '#ba68c8', '#b0bec5']
  },
  transactions:[],
  currentPage:1
};

export const getCountriesFromApi = async function () {
  try {
        const apiResponse = await fetch(COUNTRY_API, {
      method: "GET",
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!apiResponse) {
      throw new Error("API fetch failed");
    }
    const responseData = await apiResponse.json();
    // console.log(responseData);
    const data = responseData.map(res=>{
        const currency = Array.isArray(res.currencies) ? res.currencies[0] : null;
        return{
            countryName:res.name,
            currencyName : currency?.name || "NA",
            currencySymbol: currency?.symbol || "NA"
        }
    });
    // console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const updateProfileDetails = function(formData){
state.userDetails.profile = formData;
// console.log(state);
saveDatatoLocalStorage();
}

export const updateUserBudget = function(formData){
state.userDetails.budget = formData.budget;
// console.log(state);
saveDatatoLocalStorage();
}

export const addCategories = function(formData){
    const newId = +state.userDetails.categories.at(-1).id+1;
    console.log(newId);
    const data = {
        id: newId,
        name:formData.name,
        color:formData.color,
        isDefault:false
    };
    state.userDetails.categories.push(data);
    // console.log(state);
    saveDatatoLocalStorage();
}

export const updateCategory = function(ctgr){
  const category = state.userDetails.categories.find(cat => cat.id === ctgr.id);
   if (!category) {
    console.error(`Category with ID ${ctgr.id} not found`);
    return;
  }
  category.name = ctgr.name;
  category.color = ctgr.color;
  saveDatatoLocalStorage();
  console.log(state);
}

export const returnUserDetails = function()
{
    const data = localStorage.getItem('budgetData');
    if(!data) return state.userDetails;
    const savedState = JSON.parse(data);
    Object.assign(state,savedState);
    return state.userDetails;
}

export const deleteCategory = function(categoryId){
  const categoryIndex = state.userDetails.categories.findIndex(cat => cat.id === categoryId);
  if(!categoryIndex) return;
  console.log(categoryIndex);
  state.userDetails.categories.splice(categoryIndex,1);
  saveDatatoLocalStorage();
}

export const addTransactions =  function(formData){
  let newID = 1;
  if(state.transactions.length > 0){
    newID = state.transactions.at(-1).id+1;
  }
  const category = state.userDetails.categories.find(cat=> cat.name === formData.categoryName);
  if(!category) return
  const newTransaction = {
    id:newID,
    date : formData.date,
    categoryId: category.id,
    categoryName: formData.categoryName,
    description: formData.description,
    amount:formData.amount
  }
  state.transactions.push(newTransaction);
  console.log(state);
  saveDatatoLocalStorage();
}

const init = function(){
  const storageData = localStorage.getItem('budgetData');
  if(storageData)  state = JSON.parse(storageData);
  console.log(state);
  // state.transactions = [];
  // saveDatatoLocalStorage();
}

const saveDatatoLocalStorage = function(){
    localStorage.setItem('budgetData',JSON.stringify(state));
}

init();