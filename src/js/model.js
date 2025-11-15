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
    console.log(responseData);
    const data = responseData.map(res=>{
        const currency = Array.isArray(res.currencies) ? res.currencies[0] : null;
        return{
            countryName:res.name,
            currencyName : currency?.name || "NA",
            currencySymbol: currency?.symbol || "NA"
        }
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};