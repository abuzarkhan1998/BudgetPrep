import { createIcons, icons } from "lucide";
import View from "./View.js";

class addTransactionView extends View{
    _modalEle;
    renderView(sectionClass){
        this._parentContainer = document.querySelector(`.${sectionClass}`);
        this._parentContainer.insertAdjacentHTML('beforeend',this._returnMarkup());
        this._modalEle = document.querySelector(".expense-form-container");
        this._modalEle.style.display = 'block';
        this._addBackDrop();
        createIcons({ icons });
        this._closeModalBtnListner();
    }

    _addBackDrop(){
        const backDrop = `<div class="modal-backdrop"></div>`;
        this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
        const backDropEl = document.querySelector(".modal-backdrop");
        backDropEl.classList.add("active");
    }

    _closeModalBtnListner(){
        document.querySelector('.exp-form-close').addEventListener('click',this._closeModal);
    }

    _closeModal(){
        console.log('click');
        const backDropEl = document.querySelector(".modal-backdrop");
         if (backDropEl) {
          backDropEl.remove();
        }
        const modalEl = document.querySelector('.expense-form-container');
        if(modalEl){
            modalEl.remove();
        }
    }

    _returnMarkup(){
        return ` <div class="expense-form-container modal">
                <div class="expense-form-header mb-md-1">
                    <p class="form-exp-text">Add Expense</p>
                    <button class="btn exp-form-close"><i data-lucide="x"></i></button>
                </div>
                <form id="expense-form" class="expense-form mb-md-1">
                    <div class="exp-form-group">
                        <label for="select-categories" class="form-label">Category</label>
                        <select id="select-categories" class="expense-form-categories form-input-fields">
                            <option>Please choos an option</option>
                            <option>Option</option>
                            <option>Option</option>
                            <option>Option</option>
                            <option>Option</option>
                        </select>
                    </div>
                    <div class="form-amt-container">
                        <div class="exp-form-group">
                            <label for="exp-form-amt" class="form-label">Amount</label>
                            <input id="exp-form-amt" type="tel" placeholder="100"
                                class="expense-form-categories form-input-fields" />
                        </div>

                        <div class="exp-form-group">
                            <label for="exp-form-date" class="form-label">Date</label>
                            <input id="exp-form-date" type="date" placeholder="24/08/2025"
                                class="expense-form-categories form-input-fields" />
                        </div>
                    </div>
                    <div class="exp-form-group">
                        <label for="exp-form-desc" class="form-label">Description</label>
                        <input id="exp-form-desc" placeholder="Add Description"
                            class="expense-form-categories form-input-fields" />
                    </div>
                </form>
                <div class="form-btn-container">
                    <button class="btn btn-primary exp-form-btn transition-3">Add Expense</button>
                </div>
            </div>`;
    }
}

export default new addTransactionView();