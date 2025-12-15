import { createIcons, icons } from "lucide";
import View from "./View.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {DATAPERPAGE} from "../config.js";

class addTransactionView extends View {
  _modalEle;
  _categoriesDropDownEl;
  _data;
  _submitFormBtn;
  _transactionForm;

  renderView(sectionClass, categoriesData) {
    this._parentContainer = document.querySelector(`.${sectionClass}`);
    this._data = categoriesData;
    this._parentContainer.insertAdjacentHTML("beforeend", this._returnMarkup());
    flatpickr("#exp-form-date", {
      dateFormat: "m/d/Y",
      defaultDate: "today",
    });
    this._modalEle = document.querySelector(".expense-form-container");
    this._modalEle.style.display = "block";
    this._categoriesDropDownEl = document.getElementById("select-categories");
    this._addBackDrop();
    this._initInputValues();
    createIcons({ icons });
    this._submitFormBtn = document.querySelector(".exp-form-btn");
    this._transactionForm = document.getElementById("expense-form");
    this._successModal = document.querySelector(".modal-success");
    this._toastrModalBtns = document.querySelectorAll(".modal-notification-btn");
    this._closeModalBtnListner();
    this._preventTextCharacters();
    this._closeToastrEl();
  }

  _addBackDrop() {
    const backDrop = `<div class="modal-backdrop"></div>`;
    this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
    const backDropEl = document.querySelector(".modal-backdrop");
    backDropEl.classList.add("active");
  }

  _closeModalBtnListner() {
    document
      .querySelector(".exp-form-close")
      .addEventListener("click", this.closeModal);
  }

  closeModal() {
    // console.log("click");
    const backDropEl = document.querySelector(".modal-backdrop");
    if (backDropEl) {
      backDropEl.remove();
    }
    const modalEl = document.querySelector(".expense-form-container");
    if (modalEl) {
      modalEl.remove();
    }
  }

  _initInputValues() {
    // console.log(this._categoriesDropDownEl);
    // console.log(this._data);
    if (!this._data) return;
    this._data.forEach((cat) => {
      const optionEl = `<option>${cat.name}</option>`;
      this._categoriesDropDownEl.insertAdjacentHTML("beforeend", optionEl);
    });
  }

  updateTransactions(handler) {
    this._transactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // console.log(e.target);
      //console.log("form clicked");
      const validationInputs = this._transactionForm.querySelectorAll("[data-validate]");
    //   console.log(validationInputs);
       const requiredValidation = this._inputRequiredValidation(validationInputs);
       if(requiredValidation) return;
      const data = [...new FormData(e.target)]; 
      const formData = Object.fromEntries(data);
    //   console.log(formData);
    handler(formData);
    });
  }

  _preventTextCharacters() {
    document.getElementById("exp-form-amt")
      .addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/\D/g, "");
      });
  }

  _returnMarkup() {
    return ` <div class="expense-form-container modal">
                <div class="expense-form-header mb-md-1">
                    <p class="form-exp-text">Add Expense</p>
                    <button class="btn exp-form-close"><i data-lucide="x"></i></button>
                </div>
                <form id="expense-form" class="expense-form">
                    <div class="exp-form-group">
                        <label for="select-categories" class="form-label">Category</label>
                        <div>
                          <select id="select-categories" class="expense-form-categories form-input-fields" name="categoryName" data-validate="category-name">
                             <option value="">Please choose an option</option>
                          </select>
                          <p class="validation-label hidden" data-validator="category-name"></p>
                        </div>
                    </div>
                    <div class="form-amt-container">
                        <div class="exp-form-group">
                            <label for="exp-form-amt" class="form-label">Amount</label>
                            <div>
                              <input id="exp-form-amt" type="tel" placeholder="100" class="expense-form-categories form-input-fields" name="amount" data-validate="amount"/>
                              <p class="validation-label hidden" data-validator="amount"></p>
                            </div>
                        </div>

                        <div class="exp-form-group">
                            <label for="exp-form-date" class="form-label">Date</label>
                            <div>
                              <input id="exp-form-date" type="text" placeholder="Select Date" class="expense-form-categories form-input-fields" name="date" data-validate="date"/>
                              <p class="validation-label hidden" data-validator="date"></p>
                            </div>
                        </div>
                    </div>
                    <div class="exp-form-group">
                        <label for="exp-form-desc" class="form-label">Description</label>
                        <input id="exp-form-desc" placeholder="Add Description"
                            class="expense-form-categories form-input-fields" name="description"/>
                    </div>
                    <div class="form-btn-container">
                      <button type="submit" class="btn btn-primary exp-form-btn transition-3">Add Expense</button>
                    </div>
                </form>
            </div>`;
  }
}

export default new addTransactionView();
