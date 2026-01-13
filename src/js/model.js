import { COUNTRY_API, COUNTRYAPI_KEY, DATAPERPAGE } from "./config.js";

export let state = {
  isInitialized: false,
  userDetails: {
    profile: {},
    budget: 0,
    categories: [
      { id: 1, name: "Food & Groceries", color: "#8dc4ff", isDefault: true },
      { id: 2, name: "Rent & Utilities", color: "#60d2ca", isDefault: true },
      { id: 3, name: "Transportation", color: "#b089f4", isDefault: true },
    ],
    colors: [
      "#8dc4ff",
      "#60d2ca",
      "#b089f4",
      "#e57373",
      "#ffB74d",
      "#ffd54f",
      "#81c784",
      "#4db6ac",
      "#64b5f6",
      "#ba68c8",
      "#b0bec5",
    ],
  },
  transactions: [],
  currentPage: 1,
  transactionSortState: {
    field: "date",
    direction: "desc",
  },
};

export const getCountriesFromApi = async function () {
  try {
    const apiResponse = await fetch(COUNTRY_API, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!apiResponse) {
      throw new Error("API fetch failed");
    }
    const responseData = await apiResponse.json();
    // console.log(responseData);
    const data = responseData.map((res) => {
      const currency = Array.isArray(res.currencies) ? res.currencies[0] : null;
      return {
        countryName: res.name,
        currencyName: currency?.name || "NA",
        currencySymbol: currency?.symbol || "NA",
      };
    });
    // console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const updateProfileDetails = function (formData) {
  state.userDetails.profile = formData;
  // console.log(state);
  saveDatatoLocalStorage();
};

export const updateUserBudget = function (formData) {
  state.userDetails.budget = formData.budget;
  // console.log(state);
  saveDatatoLocalStorage();
};

export const addCategories = function (formData) {
  const newId = +state.userDetails.categories.at(-1).id + 1;
  console.log(newId);
  const data = {
    id: newId,
    name: formData.name,
    color: formData.color,
    isDefault: false,
  };
  state.userDetails.categories.push(data);
  // console.log(state);
  saveDatatoLocalStorage();
};

export const updateCategory = function (ctgr) {
  const category = state.userDetails.categories.find(
    (cat) => cat.id === ctgr.id
  );
  if (!category) {
    console.error(`Category with ID ${ctgr.id} not found`);
    return;
  }
  category.name = ctgr.name;
  category.color = ctgr.color;
  saveDatatoLocalStorage();
  console.log(state);
};

export const returnUserDetails = function () {
  const data = localStorage.getItem("budgetData");
  if (!data) return state.userDetails;
  const savedState = JSON.parse(data);
  Object.assign(state, savedState);
  return state.userDetails;
};

export const deleteCategory = function (categoryId) {
  const categoryIndex = state.userDetails.categories.findIndex(
    (cat) => cat.id === categoryId
  );
  if (!categoryIndex) return;
  console.log(categoryIndex);
  state.userDetails.categories.splice(categoryIndex, 1);
  saveDatatoLocalStorage();
};

export const addTransactions = function (formData) {
  let newID = 1;
  if (state.transactions.length > 0) {
    const transactions = state.transactions.sort((a,b) => {
      return a.id - b.id;
    });
    // console.log(transactions)
    newID = transactions.at(-1).id + 1;
  }
  const category = state.userDetails.categories.find(
    (cat) => cat.name === formData.categoryName
  );
  if (!category) return;
  const newTransaction = {
    id: newID,
    date: formData.date,
    categoryId: category.id,
    categoryName: formData.categoryName,
    description: formData.description,
    amount: formData.amount,
  };
  state.transactions.push(newTransaction);
  console.log(state);
  saveDatatoLocalStorage();
};

export const updateTransactions = function (formData, id) {
  // console.log(formData, id,typeof id);
  if (!id) return;
  const transaction = state.transactions.find(tran => tran.id === id);
  if(!transaction) return;
  console.log(transaction);
  const category = state.userDetails.categories.find(
    (cat) => cat.name === formData.categoryName
  );
  if (!category) return;
  transaction.date = formData.date;
  transaction.categoryId = category.id;
  transaction.categoryName = formData.categoryName;
  transaction.description = formData.description;
  transaction.amount = formData.amount;
  console.log(state);
  saveDatatoLocalStorage();
};
// export const updatePagination = function(pageNo){

// }

export const displayTransactions = function (pageNo = 1,transactions) {
  state.currentPage = pageNo;
  const sortedTransactions = returnSortedTransactionsData(transactions);
  const start = (pageNo - 1) * DATAPERPAGE;
  const end = pageNo * DATAPERPAGE;
  const transactionsData = sortedTransactions.slice(start, end);
  return {
    pageNo,
    transactionsData,
    totalTransactions: transactions.length,
    transactionSortState: state.transactionSortState,
    categories: state.userDetails.categories,
    currency : state.userDetails.profile.currency
  };
};

const returnSortedTransactionsData = function (transactions) {
  const { field, direction } = state.transactionSortState;
  const sortedTransactions = transactions.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];
    if (field === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    if (field === "amount") {
      valA = +valA;
      valB = +valB;
    }
    if (typeof valA === "string") {
      return direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return direction === "asc" ? valA - valB : valB - valA;
  });

  return sortedTransactions;
};

export const updateSortedTransactions = function (sortedTransactions) {
  if (!sortedTransactions) return;
  state.transactionSortState = sortedTransactions;
  saveDatatoLocalStorage();
  return state.currentPage;
};

export const filterTransactions = function (category, startDate, endDate,pageno=1) {
  if (!category && !startDate && !endDate) return;
  // console.log(state.transactions);
  const filteredData = state.transactions.filter((tran) => {
    if (category && category !== "all" && tran.categoryName !== category) {
      // console.log("Category is not filtered");
      return false;
    }
    const tranDate = new Date(tran.date);
    // console.log(tranDate);
    if (startDate && tranDate < new Date(startDate)) {
      // console.log("startDate is not filtered");
      return false;
    }
    if (endDate && tranDate > new Date(endDate)) {
      // console.log("endDate is not filtered");
      return false;
    }
    return true;
  });
  return displayTransactions(pageno,filteredData);
};

export const getIndividualTransaction = function(id){
  if(!id) return;
  // console.log(id);
  return state.transactions.find(tran => tran.id === +id);
  // console.log(transaction);
}

export const deleteTransaction = function (transId) {
  const index = state.transactions.findIndex((tran) => tran.id === +transId);
  console.log(index);
  if (index === -1) return;
  state.transactions.splice(index, 1);
  saveDatatoLocalStorage();
};

export const exportTransactions = function(){
  const sortedTransactions = returnSortedTransactionsData(state.transactions);
  const transactions = state.transactions.map(tran =>{
    const data = {
      Date : tran.date,
      Category : tran.categoryName,
      Description: tran.description,
      Amount: tran.amount
    };
    return data;
  })
  return transactions;
}

export const dashboardData = function(month,year){
   const currentMonthExpense = state.transactions.filter(tran => {
    return (new Date(tran.date).getMonth() === month && new Date(tran.date).getFullYear() === year);
   }).reduce((acc, tran) => acc + +tran.amount,0);
   let remainingBudget = state.userDetails.budget - currentMonthExpense;
   if(remainingBudget < 0) remainingBudget = 0;
  //  console.log(currentMontExpense);
  const currentMonthTransactions = state.transactions.filter(tran=>{
    return (new Date(tran.date).getMonth() === month && new Date(tran.date).getFullYear() === year);
  });
  // console.log(currentMonthTransactions);
  // // const categories = [...new Set(currentMonthTransactions.map(tran=>tran.categoryName))];
  // const categoriesLabel = state.userDetails.categories.map(cat=>cat.name);
  // console.log(categoriesLabel);
  // const categoriesColors = state.userDetails.categories.map(cat=>cat.color);
  // console.log(categoriesColors);
    const categoryTotals = currentMonthTransactions.reduce((acc,tran)=>{
      const amount = +tran.amount;

      if(!acc[tran.categoryName]){
        acc[tran.categoryName] = amount;
      }
      else{
        acc[tran.categoryName] += amount;
      }
      return acc;
    },{});
    // console.log(categoryTotals);

  const categoriesDetails = state.userDetails.categories.map(cat=>{
    return{
      name:cat.name,
      amount:categoryTotals[cat.name] ?? 0,
      color: cat.color
    }
  }).filter(cat=>cat.amount > 0);

  const sixMonthsArray = [];
  const monthlyExpenseArray = [];

  for(let i=0; i < 6; i++){
    let currYear = year;
    const curDate = new Date(currYear, month - i, 1);

    const curMonth = curDate.getMonth();
    const curYear =  curDate.getFullYear();

    const curMonthExpense = state.transactions.filter(tran=>{
    return (new Date(tran.date).getMonth() === curMonth && new Date(tran.date).getFullYear() === curYear);}).reduce((acc,tran)=>acc + +tran.amount,0);

    monthlyExpenseArray.unshift(curMonthExpense);

    sixMonthsArray.unshift({
      month: curMonth,
      year: curYear,
      label: `${curDate.toLocaleString('en-US',{month: 'short'})}-${String(curYear).slice(-2)}`
    })
  }
  console.log(sixMonthsArray);
  console.log(monthlyExpenseArray);
  // console.log(categoriesDetails);

   return {
    budget: state.userDetails.budget,
    monthExpense: currentMonthExpense,
    currencySymbol:state.userDetails.profile.currency,
    remainingBudget,
    categorySpending:{
      categories: categoriesDetails.map(cat=> cat.name),
      amount: categoriesDetails.map(cat=> cat.amount),
      colors: categoriesDetails.map(cat=> cat.color)
    },
    monthlyTrend:{
      monthLabel : sixMonthsArray.map(month=>month.label),
      expenses: monthlyExpenseArray
    }
  };
}

export const returnDataForAnalytics = function(month,year,timePeriod=3){
  if(!timePeriod) return;
  console.log(month,year);
  const monthsArray = [];
  const categoryChartsData = [];
  const colorsArray = [];
  const startDate = new Date(year, month-timePeriod+1,1);
  const endDate = new Date(year, month+1,0 );
  const filteredTransactions = state.transactions.filter(tran=>{
    return new Date(tran.date) >= startDate && new Date(tran.date) <= endDate
  });
  const groupedByCategoriesTrans = filteredTransactions.reduce((acc,tran)=>{
    const key = tran.categoryName;

    if(!acc[key]){
      acc[key] = [];
    }

    acc[key].push(tran);
    return acc;
  },{});

  Object.entries(groupedByCategoriesTrans).forEach(([catName,transactions])=>{
    const monthlyTotals = [];
    for(let i = timePeriod - 1; i>=0; i--){
      const targetMonth = month - i;
      const {start,end} = getMonthRange(year, targetMonth);
      // console.log(start);
      // console.log(end);

      const monthTotal =  transactions.reduce((sum,tran)=>{
        const tranDate = new Date(tran.date);
        if(tranDate >= start && tranDate<= end){
          return sum + Number(tran.amount);
        }
        return sum;
      },0);

      monthlyTotals.push(monthTotal);
    }
    categoryChartsData.push({
      name:catName,
      data:monthlyTotals
    });
    // console.log(monthlyTotals);
  })
  
  for(let i=0; i<timePeriod; i++){
    const fullDate = new Date(year,month-i,1);
    const curMonth = fullDate.getMonth();
    const currYear =  fullDate.getFullYear();
    monthsArray.unshift({
      month: curMonth,
      year: currYear,
      label: `${fullDate.toLocaleString('en-US', {month:'short'})}-${String(currYear).slice(-2)}`
    });
  }
  // console.log(monthsArray);
  // console.log(categoryWiseTotal);

  categoryChartsData.forEach(data=>{
    const color = returnColorForChart(data.name);
    colorsArray.push(color);
  })

  const categoryWiseTotal = filteredTransactions.reduce((acc,tran)=>{
      const amount = +tran.amount;

      if(!acc[tran.categoryName]){
        acc[tran.categoryName] = amount;
      }
      else{
        acc[tran.categoryName] += amount;
      }
      return acc;
    },{});

    const topCategories = Object.entries(categoryWiseTotal).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([name,amount])=>({name,amount}));
    // console.log(topCategories);

  return {
    currencySymbol:state.userDetails.profile.currency,
    categorySpendTrend: {
      monthsLabel: monthsArray.map(month=> month.label),
      chartsData:categoryChartsData,
      colors:colorsArray
    },
    topExpenseCategories:{
      categoryName:topCategories.map(cat=>cat.name),
      amount:topCategories.map(cat=>cat.amount)
    }
  }
}

const getMonthRange = function (year, month){
  const start = new Date(year,month,1);
  const end = new Date (year, month+1, 0);
  return {start,end};
}
const returnColorForChart =  function(categoryName){
  const catName = state.userDetails.categories.find(cat=> cat.name === categoryName);
  if(catName){
    return catName.color;
  }
  return '#ccc';
}

const init = function () {
  const storageData = localStorage.getItem("budgetData");
  if (storageData) state = JSON.parse(storageData);
  console.log(state);
  // state.transactions = [];
  // saveDatatoLocalStorage();
};

const saveDatatoLocalStorage = function () {
  localStorage.setItem("budgetData", JSON.stringify(state));
};

init();
