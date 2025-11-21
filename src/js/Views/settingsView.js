import { createIcons, icons } from "lucide";

class settingsView {
  _parentContainer = document.querySelector("main");
  _tabContainer;
  _countryData;
  _currencyInputField;
  _currencyOptionsContainer;
  _currencyDisplayLabel;
  _profileForm;
  _firstNameInput;
  _lastNameInput;
  _countryNameInput;
  _budgetForm;
  _colorsDataListEl;
  _userDetails;
  _addCategorycolorCodeLabel;
  _editCategorycolorCodeLabel;
  _colorPickerContainers;

  renderView(apiResponse,userData) {
    // console.log(this._parentContainer);
    this._parentContainer.textContent = "";
    this._parentContainer.insertAdjacentHTML(
      "afterbegin",
      this._returnMarkup()
    );
    this._tabContainer = document.querySelector(".settings-parent-div");
    this._currencyInputField = document.getElementById(
      "settings-country-input"
    );
    this._currencyOptionsContainer = document.querySelector(
      ".custom-select-options"
    );
    this._currencyDisplayLabel = document.querySelector(".settings-currency");
    this._profileForm = document.getElementById("settings-profile-form");
    this._budgetForm = document.getElementById("settings-budget-form");
    this._colorsDataListEl = document.querySelectorAll(".categories-colors");
    this._colorcodeLabel = document.getElementById("color-code");
    this._colorPickerContainers = document.querySelectorAll(".color-picker-container");
    createIcons({ icons });
    this._countryData = apiResponse;
    // console.log(this._countryData);
    this._userDetails = userData;
    console.log(this._userDetails);
    this._initializeCategoryColor();
  }

  navigateTabs() {
    this._tabContainer.addEventListener("click", function (e) {
      // console.log(e);
      const selectedTab = e.target.closest(".settings-tab");
      if (!selectedTab) return;
      document
        .querySelectorAll(".settings-tab")
        .forEach((tab) => tab.classList.remove("active"));
      document
        .querySelectorAll(".settings-tab-div")
        .forEach((divTab) => divTab.classList.add("hidden"));
      // console.log(selectedTab);
      selectedTab.classList.add("active");

      const selectActiveTabDiv = document.querySelector(
        `.${selectedTab.dataset.settingsTab}`
      );
    //   console.log(selectActiveTabDiv);
      if (selectActiveTabDiv) selectActiveTabDiv.classList.remove("hidden");
    });
  }

  addHandlerShowCurrency() {
    this._currencyInputField.addEventListener("keyup", (e) => {
      //  console.log(e.target.value);
      if (!e.target.value) {
        this._currencyOptionsContainer.style.display = "none";
        return;
      }
      //  console.log(this._countryData);
      const filteredData = this._countryData.filter((data) =>
        data.countryName.toLowerCase().includes(e.target.value.toLowerCase())
      );
      //  console.log(filteredData);
      this._displayCountriesOptions(filteredData);
    });
  }

  _displayCountriesOptions(data) {
    this._currencyOptionsContainer.style.display = "block";
    this._currencyOptionsContainer.innerHTML = "";
    data.forEach((option) => {
      const optionEl = `<div class="country-option" data-country-name="${option.countryName}">${option.countryName}</div>`;
      this._currencyOptionsContainer.insertAdjacentHTML("afterbegin", optionEl);
    });
  }

  selectCountry() {
    this._currencyOptionsContainer.addEventListener("click", (e) => {
     const currencyInputField = document.getElementById('settings-currency-input');
      const optionEl = e.target.closest(".country-option");
      if (!optionEl) return;
    //   console.log(optionEl);
      const selectedCurrency = this._countryData.find(
        (val) =>
          val.countryName.toLowerCase() ===
          optionEl.dataset.countryName.toLowerCase()
      );
    //   console.log(selectedCurrency);
      this._currencyInputField.value = "";
      this._currencyInputField.value = optionEl.dataset.countryName;
      this._currencyOptionsContainer.innerHTML = "";
      this._currencyOptionsContainer.style.display = "none";
      this._currencyDisplayLabel.textContent = selectedCurrency.currencySymbol
        ? selectedCurrency.currencySymbol
        : selectedCurrency.currencyName;
     currencyInputField.value = selectedCurrency.currencySymbol
        ? selectedCurrency.currencySymbol
        : selectedCurrency.currencyName;
    });
  }

  submitProfileForm(handler) {
    this._profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const profilevalidationInputs =
        this._profileForm.querySelectorAll("[data-validate]");
      // console.log(profilevalidationInputs);
      const requiredValidation = this._inputRequiredValidation(
        profilevalidationInputs
      );
      const countryValidation = this._validateCountryField();
      if (requiredValidation || countryValidation) return;
      console.log("Form Submitted");
      console.log(e);
      const data = [...new FormData(e.target)];
      const formData = Object.fromEntries(data);
      handler(formData);
    });
  }

  _inputRequiredValidation(inputFields) {
    let isValidationError = false;
    inputFields.forEach((input) => {
      const key = input.dataset.validate;
      const validator = document.querySelector(`[data-validator="${key}"]`);
      // console.log(`Validation start for ${key}`);
      // console.log(input);
      // console.log(validator);
      if (!validator) return;
      if (input.value.trim() === "") {
        validator.textContent = `${key.replace("-", " ")} is required`;
        validator.classList.remove("hidden");
        isValidationError = true;
      } else {
        validator.textContent = "";
        validator.classList.add("hidden");
        isValidationError = false;
      }
    });
    return isValidationError;
  }

  _validateCountryField() {
    const countryInputElement = document.getElementById(
      "settings-country-input"
    );
    const validatorElement = document.querySelector(
      `[data-validator="country"]`
    );
    if (countryInputElement.value.trim() === "") return false;
    if (this._currencyDisplayLabel.textContent === "") {
      validatorElement.textContent =
        "please select a proper country from the dropdown list";
      validatorElement.classList.remove("hidden");
      return true;
    } else {
      validatorElement.textContent = "";
      validatorElement.classList.add("hidden");
      return false;
    }
  }

  submitBudgetForm(handler){
    this._budgetForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        // console.log(this._budgetForm);
        const budgetFormInput = this._budgetForm.querySelectorAll("[data-validate]");
        const requiredValidation = this._inputRequiredValidation(budgetFormInput);
        if (requiredValidation) return;
        const data = [...new FormData(e.target)];
        const formData = Object.fromEntries(data);
        formData.budget = +formData.budget;
        handler(formData);
    })
  }

  preventTextCharacters(){
    document.querySelector('.settings-budget-input').addEventListener('input',function(e){
        e.target.value = e.target.value.replace(/\D/g,"");
    })
  }

  getUserDetails(handler){
    const userData = handler();
    return userData;
  }

  _initializeCategoryColor(){
    const filteredColors = this._userDetails.colors.filter(color => !this._userDetails.categories.some(cat=>cat.color === color));
    console.log(filteredColors);
    this._colorsDataListEl.forEach(el=>{
        // console.log(el);
        filteredColors.forEach(color=>{
            const optionEl = `<option value="${color}"></option>`;
            el.insertAdjacentHTML('afterbegin',optionEl);
        });
    });
  }

 _handleClickonColorPicker(){
    this._colorPickerContainers.forEach(ele =>{
       ele.addEventListener('click',(e)=>{
        console.log(e);
        const childInputEle = ele.querySelector('.color-input');
        console.log(childInputEle);
        childInputEle.click();
       });
    });
 }

  _returnMarkup() {
    return `<section class="main-section section-settings">
            <div class="dashboard-content">
                <div class="dashboard-container">
                    <div class="dashboard-heading-container">
                        <h2 class="heading-secondary">Settings</h2>
                        <p class="heading-desc">Personalize your expense tracker. Set your monthly budget and manage
                            your custom categories.</p>
                    </div>
                </div>
            </div>

            <div class="container settings-tab-container mb-md-1">
                <div class="settings-parent-div">
                    <span class="settings-tab active" data-settings-tab="settings-profile-container">Profile</span>
                    <span class="settings-tab" data-settings-tab="settings-budget-container">Budget</span>
                    <span class="settings-tab" data-settings-tab="settings-categories-container">Categories</span>
                </div>
            </div>

            <div class="container settings-profile-container settings-tab-div">
                <div class="profile-header-container mb-md-2">
                    <p class="profile-header">Profile</p>
                    <p class="profile-header-desc">Update your personal details here.</p>
                </div>
                <div>
                    <form id="settings-profile-form" class="profile-settings-form">
                        <div class="settings-field-container">
                            <span class="settings-form-label">Name *</span>
                            <div class="settings-profile-name-container">
                                <div>
                                  <input type="text" id="settings-first-name" class="settings-profile-input" data-validate="first-name" name="firstName" />
                                  <p class="validation-label hidden" data-validator="first-name"></p>
                                </div>
                                <div>
                                  <input type="text" id="settings-last-name" class="settings-profile-input" data-validate="last-name" name="lastName"/>
                                  <p class="validation-label hidden" data-validator="last-name"></p>
                                </div>
                            </div>
                        </div>
                        <div class="settings-field-container">
                            <span class="settings-form-label">Country *</span>
                            <div class="custom-select">
                              <input id="settings-country-input" type="text" placeholder="Search country..." class="custom-select-input" name="country" data-validate="country" />
                              <div class="custom-select-options"></div>
                              <p class="validation-label hidden" data-validator="country"></p>
                            </div>
                        </div>
                        <div class="settings-field-container">
                            <span class="settings-form-label">Currency</span>
                            <span class="settings-currency"></span>
                            <input type="hidden" name="currency" id="settings-currency-input">
                        </div>
                        <div class="settings-field-container">
                            <span class="settings-form-label"></span>
                            <div class="profile-settings-button-container">
                                <button class="btn btn-primary settings-profile-btn">Save Changes</button>
                                <button class="btn btn-primary settings-profile-btn">Clear All Data</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="container settings-budget-container hidden settings-tab-div">
                <div class="profile-header-container mb-md-2">
                    <p class="profile-header">Budget</p>
                    <p class="profile-header-desc">Define your monthly budget and monitor your spending.</p>
                </div>
                <div>
                    <form id="settings-budget-form">
                        <div class="settings-field-container">
                            <span class="settings-form-label">Monthly Budget *</span>
                            <div class="settings-budget-input-container">
                                <label class="settings-budget-label">$</label>
                                <input type="text" id="settings-monthly-budget"
                                    class="settings-profile-input settings-budget-input" data-validate="monthly-budget" name="budget" inputmode="numeric" />
                                <p class="validation-label hidden" data-validator="monthly-budget"></p>
                            </div>
                        </div>
                        <div class="settings-field-container">
                            <span class="settings-form-label"></span>
                            <div class="profile-settings-button-container">
                                <button class="btn btn-primary settings-profile-btn">Save Budget</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="container settings-categories-container hidden settings-tab-div">
                <div class="mb-md-4 setings-add-categories-container">
                    <div class="profile-header-container mb-md-2">
                        <p class="profile-header">Categories</p>
                        <p class="profile-header-desc">Add or edit categories for tracking your spending.</p>
                    </div>
                    <div>
                        <form id="settings-add-category-form">
                            <div class="settings-field-container">
                                <span class="settings-form-label">Category Name *</span>
                                <input type="text" id="settings-category-name" class="settings-profile-input" />
                            </div>
                            <div class="settings-field-container">
                                <span class="settings-form-label">Color *</span>
                                <div class="color-picker-container add-category-color-picker">
                                    <input type="color" list="categoryColors" class="color-input" />
                                    <span id="color-code" class="add-category-color-code color-code-label">#79B2D6</span>
                                    <datalist id="categoryColors" class="categories-colors">
                                    </datalist>
                                </div>
                            </div>
                            <div class="settings-field-container">
                                <span class="settings-form-label"></span>
                                <div class="profile-settings-button-container">
                                    <button class="btn btn-primary settings-profile-btn">Add Category</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="settings-edit-category-container">
                    <p class="profile-header mb-md-1">Your Categories</p>
                    <div class="settings-categories-lists-container">
                        <ul class="settings-categories-lists">
                            <li class="settings-categories-lists-item trans-table-button-col">
                                <div class="category-list-name-container">
                                    <span class="categories-list-color"></span>
                                    <span class="categories-list-name">Food</span>
                                </div>
                                <div>
                                    <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                    <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                                </div>
                            </li>
                            <li class="settings-categories-lists-item trans-table-button-col">
                                <div class="category-list-name-container">
                                    <span class="categories-list-color"></span>
                                    <span class="categories-list-name">Food</span>
                                </div>
                                <div>
                                    <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                    <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                                </div>
                            </li>
                            <li class="settings-categories-lists-item trans-table-button-col">
                                <div class="category-list-name-container">
                                    <span class="categories-list-color"></span>
                                    <span class="categories-list-name">Food</span>
                                </div>
                                <div>
                                    <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                    <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                                </div>
                            </li>
                            <li class="settings-categories-lists-item trans-table-button-col">
                                <div class="category-list-name-container">
                                    <span class="categories-list-color"></span>
                                    <span class="categories-list-name">Food</span>
                                </div>
                                <div>
                                    <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                    <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                                </div>
                            </li>
                            <li class="settings-categories-lists-item categories-edit-list-field">
                                <div class="category-list-name-container">
                                    <div class="color-picker-container edit-category-color-picker">
                                        <input type="color" list="categoryColors" class="color-input" />
                                        <span id="color-code" class="edit-category-color-code color-code-label">#79B2D6</span>
                                        <datalist id="categoryColors" class="categories-colors">
                                        </datalist>
                                    </div>
                                    <input type="text" id="settings-category-edit-name" class="settings-profile-input" />
                                </div>
                                <div class="category-edit-btn-container">
                                    <button class="btn edit-category-save-btn"><i data-lucide="check"></i></button>
                                    <button class="btn edit-category-cancel-btn"><i data-lucide="x"></i></button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>`;
  }
}

export default new settingsView();
