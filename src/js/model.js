import { COUNTRY_API, COUNTRYAPI_KEY } from "./config.js";

export const state = {
  isInitialized: false,
  userDetails: {
    profile: {},
    budget:0,
    categories: [
      { id: 1, name: "Food & Groceries", color: "#8dc4ff", isDefault: true },
      { id: 1, name: "Rent & Utilities", color: "#60d2ca", isDefault: true },
      { id: 1, name: "Transportation", color: "#b089f4", isDefault: true },
    ],
    colors:['#8dc4ff','#60d2ca','#b089f4','#E57373','#FFB74D','#FFD54F','#81C784','#4DB6AC', '#64B5F6', '#BA68C8', '#B0BEC5']
  },
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
console.log(state);
}

export const updateUserBudget = function(formData){
state.userDetails.budget = formData.budget;
console.log(state);
}

export const returnUserDetails = function()
{
    return state.userDetails;
}