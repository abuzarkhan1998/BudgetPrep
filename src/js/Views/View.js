import { createIcons, icons } from "lucide";

export default class View {
_parentContainer = document.querySelector("main");
_successModal;
_toastrModalBtns;

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
        // console.log("clicked");
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
}
