import { createIcons, icons } from "lucide";

export default class View {
  _parentContainer = document.querySelector("main");
  _successModal;
  _toastrModalBtns;
  _profileInitBtn;
  _budgetInitBtn;

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
      }
    });
    return isValidationError;
  }

  _clearView() {
    this._parentContainer.textContent = "";
  }

  renderSpinner() {
    // this._clearView();
    const backDrop = `<div class="modal-backdrop"></div>`;
    const renderSpinner = `<div class="spinner"><i data-lucide="loader-circle"></i></div>`;
    this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
    this._parentContainer.insertAdjacentHTML("afterbegin", renderSpinner);
    const spinnerEl = document.querySelector(".spinner");
    const backDropEl = document.querySelector(".modal-backdrop");
    spinnerEl.classList.add("active");
    backDropEl.classList.add("active");
    createIcons({ icons });
  }

  displaySuccessMessage(toastrDesc, buttonDesc) {
    const toastrDescEl = this._successModal.querySelector(
      ".modal-notification-message"
    );
    const btnEl = this._successModal.querySelector(".modal-notification-btn");
    console.log(btnEl);
    toastrDescEl.textContent = toastrDesc;
    btnEl.textContent = buttonDesc;
    const backDrop = `<div class="modal-backdrop"></div>`;
    this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
    this._successModal.classList.remove("hidden");
    const backDropEl = document.querySelector(".modal-backdrop");
    backDropEl.classList.add("active");
  }

  _closeToastrEl() {
    this._toastrModalBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        console.log("clicked");
        e.preventDefault();
        const modals = document.querySelectorAll(".notification-modal");
        modals.forEach((modal) => modal.classList.add("hidden"));
        const backDropEl = document.querySelector(".modal-backdrop");
        if (backDropEl) {
          backDropEl.remove();
        }
      });
    });
  }

  _isUserdetailsInitialized(isInitObj) {
    // console.log(isInitObj);
    if (!isInitObj.isProfile) {
      const profileInitEle = `<div class="modal notification-modal modal-info profile-init-modal">
            <div class="modal-notification-icon mb-sm-3"><i data-lucide="circle-alert"></i></div>
            <p class="modal-notification-title mb-sm-2">Info!</p>
            <p class="modal-notification-message mb-sm-3">Complete your profile to continue</p>
            <button class="btn btn-primary profile-init-btn">Go to Settings</button>
        </div>`;
      this._parentContainer.insertAdjacentHTML("beforeend", profileInitEle);
      const backDrop = `<div class="modal-backdrop"></div>`;
      this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
      const backDropEl = document.querySelector(".modal-backdrop");
      backDropEl.classList.add("active");
      this._profileInitBtn = document.querySelector('.profile-init-btn');
      // console.log(this._profileInitBtn);
    }
    else if(isInitObj.isProfile && !isInitObj.isBudget){
      const budgetInitEle = `<div class="modal notification-modal modal-info budget-init-modal">
            <div class="modal-notification-icon mb-sm-3"><i data-lucide="circle-alert"></i></div>
            <p class="modal-notification-title mb-sm-2">Info!</p>
            <p class="modal-notification-message mb-sm-3">Add your budget to continue</p>
            <button class="btn btn-primary budget-init-btn">Go to Settings</button>
        </div>`;
      this._parentContainer.insertAdjacentHTML("beforeend", budgetInitEle);
      const backDrop = `<div class="modal-backdrop"></div>`;
      this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
      const backDropEl = document.querySelector(".modal-backdrop");
      backDropEl.classList.add("active");
      this._budgetInitBtn = document.querySelector('.budget-init-btn');
    }
    createIcons({ icons });
  }

  navigateToProfile(handler){
    if(!this._profileInitBtn) return;
    this._profileInitBtn.addEventListener('click',(e)=>{
       const backDrop = document.querySelector('.modal-backdrop');
      const profileModal = document.querySelector('.profile-init-modal');
      if(profileModal){
        profileModal.remove();
      }
      if(backDrop){
        backDrop.remove();
      }
      // console.log(profileModal);
      handler('settings','settings-profile-container');
    })
  }

  navigateToBudget(handler){
     if(!this._budgetInitBtn) return;
     this._budgetInitBtn.addEventListener('click',(e)=>{
       const backDrop = document.querySelector('.modal-backdrop');
      const profileModal = document.querySelector('.budget-init-modal');
      if(profileModal){
        profileModal.remove();
      }
      if(backDrop){
        backDrop.remove();
      }
      // console.log(profileModal);
      handler('settings','settings-budget-container');
     })
  }

}
