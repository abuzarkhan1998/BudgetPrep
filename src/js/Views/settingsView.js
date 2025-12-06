import { createIcons, icons } from "lucide";
import View from "./View.js";

class settingsView extends View {
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
  _addCategoryColorCodeInput;
  _addCategoryForm;
  _toastrModalBtns;
  _categoryListsEl;
  _confirmationModal;
  _deleteConfirmationBtn;

  renderView(apiResponse, userData, targetTab) {
    // console.log(this._parentContainer);
    this._userDetails = userData;
    console.log(this._userDetails);
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
    this._displayActiveTab(targetTab);
    this._currencyDisplayLabel = document.querySelector(".settings-currency");
    this._profileForm = document.getElementById("settings-profile-form");
    this._budgetForm = document.getElementById("settings-budget-form");
    this._colorsDataListEl = document.querySelectorAll(".categories-colors");
    this._colorcodeLabel = document.getElementById("color-code");
    this._colorPickerContainers = document.querySelectorAll(
      ".color-picker-container"
    );
    this._addCategoryColorCodeInput = document.querySelector(".color-input");
    this._addCategorycolorCodeLabel = document.querySelector(
      ".add-category-color-code"
    );
    this._addCategoryForm = document.getElementById(
      "settings-add-category-form"
    );
    this._successModal = document.querySelector(".modal-success");
    this._toastrModalBtns = document.querySelectorAll(
      ".modal-notification-btn"
    );
    this._categoryListsEl = document.querySelector(
      ".settings-categories-lists"
    );
    this._confirmationModal = document.querySelector(".confirmation-modal");
    this._deleteConfirmationBtn = document.querySelector(".modal-confirmation-btn");
    // console.log(this._categoryListsEl);
    // console.log(this._toastrModalBtns);
    createIcons({ icons });
    this._countryData = apiResponse;
    // console.log(this._countryData);
    this._initData();
    // console.log(this._countryData);
    this.navigateTabs();
    this.addHandlerShowCurrency();
    this.selectCountry();
    this.preventTextCharacters();
    this._initializeCategoryColor();
    this.selectColor();
    this._closeToastrEl();
    this._openCategoryEditor();
    this._cancelEdit();
    this._openDeleteConfirmationModal();
    this._handleClickonColorPicker();
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
      const currencyInputField = document.getElementById(
        "settings-currency-input"
      );
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
      // console.log("Form Submitted");
      // console.log(e);
      const data = [...new FormData(e.target)];
      const formData = Object.fromEntries(data);
      handler(formData);
    });
  }

  // _inputRequiredValidation(inputFields) {
  //   let isValidationError = false;
  //   inputFields.forEach((input) => {
  //     const key = input.dataset.validate;
  //     const validator = document.querySelector(`[data-validator="${key}"]`);
  //     // console.log(`Validation start for ${key}`);
  //     // console.log(input);
  //     // console.log(validator);
  //     if (!validator) return;
  //     if (input.value.trim() === "") {
  //       validator.textContent = `${key.replace("-", " ")} is required`;
  //       validator.classList.remove("hidden");
  //       isValidationError = true;
  //     } else {
  //       validator.textContent = "";
  //       validator.classList.add("hidden");
  //     }
  //   });
  //   return isValidationError;
  // }

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

  submitBudgetForm(handler) {
    this._budgetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // console.log(this._budgetForm);
      const budgetFormInput =
        this._budgetForm.querySelectorAll("[data-validate]");
      const requiredValidation = this._inputRequiredValidation(budgetFormInput);
      if (requiredValidation) return;
      const data = [...new FormData(e.target)];
      const formData = Object.fromEntries(data);
      formData.budget = +formData.budget;
      handler(formData);
    });
  }

  preventTextCharacters() {
    document
      .querySelector(".settings-budget-input")
      .addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/\D/g, "");
      });
  }

  getUserDetails(handler) {
    const userData = handler();
    return userData;
  }

  _initializeCategoryColor() {
    const filteredColors = this._userDetails.colors.filter(
      (color) =>
        !this._userDetails.categories.some(
          (cat) => cat.color.toLowerCase() === color.toLowerCase()
        )
    );
    // console.log(filteredColors);
    this._colorsDataListEl.forEach((el) => {
      // console.log(el);
      filteredColors.forEach((color) => {
        const optionEl = `<option value="${color}"></option>`;
        el.insertAdjacentHTML("afterbegin", optionEl);
      });
    });
    this._addCategoryColorCodeInput.value =
      this._addCategorycolorCodeLabel.textContent = filteredColors[0];
  }

  _handleClickonColorPicker() {
    this._colorPickerContainers.forEach((ele) => {
      ele.addEventListener("click", (e) => {
        // console.log(e.target);
        const childInputEle = ele.querySelector(".color-input");
        // console.log(childInputEle);
        childInputEle.click();
      });
    });
  }

  selectColor() {
    this._addCategoryColorCodeInput.addEventListener("input", function (e) {
      console.log(e);
      const parentContainer = e.target.closest(".color-picker-container");
      const spanElement = parentContainer.querySelector(".color-code-label");
      spanElement.textContent = e.target.value;
    });
  }

  addCategoryForm(handler) {
    this._addCategoryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // console.log(e);
      const inputField =
        this._addCategoryForm.querySelectorAll("[data-validate]");
      const requiredValidation = this._inputRequiredValidation(inputField);
      const repeatingValidation = this._validaterepeatingCategories();
      if (requiredValidation || repeatingValidation) return;
      const formData = [...new FormData(e.target)];
      const data = Object.fromEntries(formData);
      handler(data);
    });
  }

  _validaterepeatingCategories() {
    const categoryNameInputElement = document.getElementById(
      "settings-category-name"
    );
    const validatorElement = document.querySelector(
      `[data-validator="category-name"]`
    );
    if (categoryNameInputElement.value.trim() === "") return false;
    if (
      this._userDetails.categories.some(
        (cat) => cat.name === categoryNameInputElement.value
      )
    ) {
      validatorElement.textContent = "category name cannot be repeated";
      validatorElement.classList.remove("hidden");
      return true;
    } else {
      validatorElement.textContent = "";
      validatorElement.classList.add("hidden");
      return false;
    }
  }

  // _clearView() {
  //   this._parentContainer.textContent = "";
  // }

  // renderSpinner() {
  //   // this._clearView();
  //   const backDrop = `<div class="modal-backdrop"></div>`;
  //   const renderSpinner = `<div class="spinner"><i data-lucide="loader-circle"></i></div>`;
  //   this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
  //   this._parentContainer.insertAdjacentHTML("afterbegin", renderSpinner);
  //   const spinnerEl = document.querySelector(".spinner");
  //   const backDropEl = document.querySelector(".modal-backdrop");
  //   spinnerEl.classList.add("active");
  //   backDropEl.classList.add("active");
  //   createIcons({ icons });
  // }

  _initData() {
    if (!this._userDetails) return;
    // console.log(this._userDetails);
    if(this._userDetails.profile.country){

    }
    document.getElementById("settings-first-name").value =
      this._userDetails.profile.firstName;
    document.getElementById("settings-last-name").value =
      this._userDetails.profile.lastName;
    this._currencyInputField.value = this._userDetails.profile.country;
    document.getElementById("settings-currency-input").value =
      this._currencyDisplayLabel.textContent =
      document.querySelector(".settings-budget-label").textContent =
        this._userDetails.profile.currency;
    document.getElementById("settings-monthly-budget").value =
      this._userDetails.budget;
  }

  // displaySuccessMessage(toastrDesc, buttonDesc) {
  //   const toastrDescEl = this._successModal.querySelector(
  //     ".modal-notification-message"
  //   );
  //   const btnEl = this._successModal.querySelector(".modal-notification-btn");
  //   console.log(btnEl);
  //   toastrDescEl.textContent = toastrDesc;
  //   btnEl.textContent = buttonDesc;
  //   const backDrop = `<div class="modal-backdrop"></div>`;
  //   this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
  //   this._successModal.classList.remove("hidden");
  //   const backDropEl = document.querySelector(".modal-backdrop");
  //   backDropEl.classList.add("active");
  // }

  // _closeToastrEl() {
  //   this._toastrModalBtns.forEach((btn) => {
  //     btn.addEventListener("click", function (e) {
  //       // console.log("clicked");
  //       e.preventDefault();
  //       const modals = document.querySelectorAll(".notification-modal");
  //       modals.forEach((modal) => modal.classList.add("hidden"));
  //       const backDropEl = document.querySelector(".modal-backdrop");
  //       if (backDropEl) {
  //         backDropEl.remove();
  //       }
  //     });
  //   });
  // }

  _displayActiveTab(tab) {
    const tabEl = document.querySelector(`[data-settings-tab=${tab}]`);
    // console.log(tabEl);
    if (!tabEl) return;
    document
      .querySelectorAll(".settings-tab")
      .forEach((tab) => tab.classList.remove("active"));
    document
      .querySelectorAll(".settings-tab-div")
      .forEach((divTab) => divTab.classList.add("hidden"));
    tabEl.classList.add("active");
    const selectActiveTabDiv = document.querySelector(
      `.${tabEl.dataset.settingsTab}`
    );
    if (selectActiveTabDiv) selectActiveTabDiv.classList.remove("hidden");
  }

  _openCategoryEditor() {
    this._categoryListsEl.addEventListener("click", (e) => {
      // e.preventDefault();
      const editBtn = e.target.closest(".edit-btn");
      if (!editBtn) return;
      // console.log(editBtn);
      const listEl = editBtn.closest(".settings-categories-lists-item");
      const categoryId = listEl.dataset.categoryId;
      // console.log(listEl);
      listEl.classList.remove("trans-table-button-col");
      listEl.classList.add("categories-edit-list-field");
      listEl.textContent = ``;
      listEl.innerHTML = `<div class="category-list-name-container">
                                    <div class="color-picker-container edit-category-color-picker">
                                        <input type="color" list="categoryColors" class="color-input edit-category-color-input" name="color-${categoryId}" />
                                        <span id="color-code" class="edit-category-color-code color-code-label"></span>
                                        <datalist id="categoryColors" class="categories-colors">
                                        </datalist>
                                    </div>
                                    <div>
                                      <input type="text" id="settings-category-edit-name" class="settings-profile-input" data-validate="category-name"/>
                                      <p class="validation-label hidden" data-validator="category-name"></p>
                                    </div>
                                </div>
                                <div class="category-edit-btn-container">
                                    <button class="btn edit-category-save-btn"><i data-lucide="check"></i></button>
                                    <button class="btn edit-category-cancel-btn"><i data-lucide="x"></i></button>
                                </div>`;
      createIcons({ icons });
      //  console.log(categoryId,typeof(categoryId));
      const selectedCategory = this._userDetails.categories.find(
        (cat) => cat.id === +categoryId
      );
      //  console.log(selectedCategory);
      const colorSpanEl = listEl.querySelector(".color-code-label");
      //  console.log(colorSpanEl);
      const colorPickerEl = listEl.querySelector(".edit-category-color-input");
      const catNameEl = listEl.querySelector(".settings-profile-input");
      colorSpanEl.textContent = colorPickerEl.value = selectedCategory.color;
      catNameEl.value = selectedCategory.name;
      // this._initializeEditCategoryColor(listEl);
      this._colorPickerContainers = document.querySelectorAll(
        ".color-picker-container"
      );
      this._handleClickonColorPicker();
      this._editCategorySelectColors();
    });
  }

  _cancelEdit() {
    this._categoryListsEl.addEventListener("click", (e) => {
      // e.preventDefault();
      const cancelBtn = e.target.closest(".edit-category-cancel-btn");
      if (!cancelBtn) return;
      // console.log(cancelBtn);
      const listEl = cancelBtn.closest(".settings-categories-lists-item");
      console.log(listEl);
      listEl.classList.remove("categories-edit-list-field");
      listEl.classList.add("trans-table-button-col");
      const categoryId = listEl.dataset.categoryId;
      const selectedCategory = this._userDetails.categories.find(
        (cat) => cat.id === +categoryId
      );
      listEl.textContent = "";
      listEl.innerHTML = `<div class="category-list-name-container">
                 <span class="categories-list-color" style="background-color:${selectedCategory.color}"></span>
                 <span class="categories-list-name">${selectedCategory.name}</span>
             </div>
             <div>
                 <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                 <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
             </div>`;
      createIcons({ icons });
    });
  }

  _openDeleteConfirmationModal() {
    this._categoryListsEl.addEventListener("click", (e) => {
      const deleteBtn = e.target.closest(".delete-btn");
      if (!deleteBtn) return;
      this._confirmationModal.classList.remove("hidden");
      const backDrop = `<div class="modal-backdrop"></div>`;
      this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
      const backDropEl = document.querySelector(".modal-backdrop");
      backDropEl.classList.add("active");
      const listEl = deleteBtn.closest(".settings-categories-lists-item");
      const categoryId = listEl.dataset.categoryId;
      this._confirmationModal.dataset.categoryId = categoryId
    });
  }

  updateCategory(handler) {
    this._categoryListsEl.addEventListener("click", (e) => {
      // e.preventDefault();
      const confirmBtn = e.target.closest(".edit-category-save-btn");
      if (!confirmBtn) return;
      // console.log("Clicked");
      const listEl = confirmBtn.closest(".settings-categories-lists-item");
      // console.log(listEl);
      const inputField = listEl.querySelectorAll("[data-validate]");
      // console.log(inputField);
      const repeatingValidation = this._validateEditCategories(listEl);
      if (repeatingValidation) return;
      const catName = listEl.querySelector(".settings-profile-input").value;
      const color = listEl.querySelector(".color-input").value;
      // console.log(catName,color);
      handler(listEl.dataset.categoryId, catName, color);
    });
  }

  _validateEditCategories(listEl) {
    const inputField = listEl.querySelector(".settings-profile-input");
    const key = inputField.dataset.validate;
    const validatorEl = listEl.querySelector(`[data-validator="${key}"]`);
    // console.log(inputField);
    // console.log(validatorEl);
    const filteredData = this._userDetails.categories.filter(
      (cat) => cat.id !== +listEl.dataset.categoryId
    );
    // console.log(filteredData);
    if (inputField.value.trim() === "") {
      validatorEl.textContent = `${key.replace("-", " ")} is required`;
      validatorEl.classList.remove("hidden");
      return true;
    } else if (filteredData.some((cat) => cat.name === inputField.value)) {
      validatorEl.textContent = "category name cannot be repeated";
      validatorEl.classList.remove("hidden");
      return true;
    } else {
      validatorEl.textContent = "";
      validatorEl.classList.add("hidden");
      return false;
    }
  }

  _editCategorySelectColors() {
    document.querySelectorAll(".edit-category-color-input").forEach((ele) => {
      ele.addEventListener("input", (e) => {
        const parentContainer = e.target.closest(".color-picker-container");
        const spanElement = parentContainer.querySelector(".color-code-label");
        spanElement.textContent = e.target.value;
      });
    });
  }

  deleteCategory(handler){
    this._deleteConfirmationBtn.addEventListener("click",(e)=>{
      const categoryId = this._confirmationModal.dataset.categoryId;
      // console.log(categoryId);
      this._confirmationModal.classList.add('hidden');
      const backDropEl = document.querySelector(".modal-backdrop");
        if (backDropEl) {
          backDropEl.remove();
        }
      handler(+categoryId);
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
                    <span class="settings-tab" data-settings-tab="settings-profile-container">Profile</span>
                    <span class="settings-tab" data-settings-tab="settings-budget-container">Budget</span>
                    <span class="settings-tab" data-settings-tab="settings-categories-container">Categories</span>
                </div>
            </div>

            <div class="container settings-profile-container settings-tab-div hidden">
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
                                <div>
                                 <input type="text" id="settings-category-name" class="settings-profile-input" name="name" data-validate="category-name"/>
                                 <p class="validation-label hidden" data-validator="category-name"></p>
                                </div>
                            </div>
                            <div class="settings-field-container">
                                <span class="settings-form-label">Color *</span>
                                <div class="color-picker-container add-category-color-picker">
                                    <input type="color" list="categoryColors" class="color-input add-category-color-input" name="color" />
                                    <span id="color-code" class="add-category-color-code color-code-label"></span>
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
                        ${this._userDetails.categories
                          .map((data) => this._renderCategoryList(data))
                          .join("")}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        <div class="modal notification-modal modal-success hidden">
            <div class="modal-notification-icon mb-sm-3"><i data-lucide="circle-check"></i></div>
            <p class="modal-notification-title mb-sm-2">Success!</p>
            <p class="modal-notification-message mb-sm-3"></p>
            <button class="btn btn-primary modal-notification-btn"></button>
        </div>
        <div class="modal notification-modal modal-error hidden">
            <div class="modal-notification-icon mb-sm-3"><i data-lucide="circle-x"></i></div>
            <p class="modal-notification-title mb-sm-2">Error!</p>
            <p class="modal-notification-message mb-sm-3"></p>
            <button class="btn btn-primary modal-notification-btn">OK</button>
        </div>
        <div class="modal notification-modal modal-info hidden">
            <div class="modal-notification-icon mb-sm-3"><i data-lucide="circle-alert"></i></div>
            <p class="modal-notification-title mb-sm-2">Info!</p>
            <p class="modal-notification-message mb-sm-3"></p>
            <button class="btn btn-primary modal-notification-btn">OK</button>
        </div>
         <div class="modal notification-modal modal-info hidden confirmation-modal">
            <div class="modal-notification-icon mb-sm-3"><i data-lucide="circle-alert"></i></div>
            <p class="modal-notification-title mb-sm-2">Are you sure?</p>
            <p class="modal-notification-message mb-sm-3">Once deleted, it cannot be retrieveid.</p>
            <div class="confirmation-modal-btn-container">
              <button class="btn btn-primary modal-confirmation-btn">Delete</button>
              <button class="btn btn-secondary modal-notification-btn">Cancel</button>
            </div>
        </div>`;
  }

  _renderCategoryList(cat) {
    return `<li class="settings-categories-lists-item trans-table-button-col" data-category-id=${
      cat.id
    }>
             <div class="category-list-name-container">
                 <span class="categories-list-color" style="background-color:${
                   cat.color
                 }"></span>
                 <span class="categories-list-name">${cat.name}</span>
             </div>
             <div>
                 <button class="btn edit-btn ${
                   cat.id === 1 || cat.id === 2 || cat.id === 3
                     ? "btn-disabled"
                     : ""
                 }" ${
      cat.id === 1 || cat.id === 2 || cat.id === 3 ? "disabled" : ""
    }><i data-lucide="square-pen"></i></button>
                 <button class="btn delete-btn ${
                   cat.id === 1 || cat.id === 2 || cat.id === 3
                     ? "btn-disabled"
                     : ""
                 }" ${
      cat.id === 1 || cat.id === 2 || cat.id === 3 ? "disabled" : ""
    }><i data-lucide="trash-2"></i></button>
             </div>
            </li>`;
  }
}

export default new settingsView();
