import View from "./View.js";
import { createIcons, icons } from "lucide";
import { CURRENCYFORMAT } from "../config.js";

class dashboardView extends View {
 _addTransactionBtn;
 _data;
 _currencyFormatter;
 _progressContainerEl;
 _progressFillEl;

  renderView(data) {
    this._data = data;
    this._currencyFormatter = new Intl.NumberFormat('en-US',CURRENCYFORMAT);
    console.log(this._data);
    this._clearView();
    this._parentContainer.insertAdjacentHTML(
      "afterbegin",
      this._returnMarkup()
    );
    this._progressContainerEl = document.querySelector(".progress-container");
    this._progressFillEl =  document.querySelector(".progress-fill");
    createIcons({ icons });
    this._addTransactionBtn = document.querySelector(".btn-add-expense");
    this._initFields();
  }

  openAddTransactionView(handler){
    this._addTransactionBtn.addEventListener("click",(e)=>{
        handler("section-dashboard", false);
    });
  }

  _initFields(){
    this._displayBarProgress();
  }

  _displayBarProgress(){
    const percent = Math.min((this._data.monthExpense / this._data.budget) * 100,100);
    console.log(percent);
    console.log(this._progressContainerEl);
    this._progressFillEl.style.width = `${percent}%`;
    if(percent<60){
        this._progressFillEl.style.backgroundColor = '#64d68e';
        this._progressContainerEl.style.border = '1.5px solid #1b9e4b';
    }
    else if(percent >= 60 &&   percent < 85){
        this._progressFillEl.style.backgroundColor = '#f9c56d';
        this._progressContainerEl.style.border = '1.5px solid #bd8c39';
    }
    else{
        this._progressFillEl.style.backgroundColor = '#f26969';
        this._progressContainerEl.style.border = '1.5px solid #bf3636';
    }
  }

  _returnMarkup() {
    return `<section class="section-dashboard main-section">
            <div class="dashboard-content">
                <div class="dashboard-container">
                    <div class="dashboard-heading-container">
                        <h2 class="heading-secondary">Dashboard</h2>
                        <p class="heading-desc">Get a quick overview of your monthly spending, remaining budget, and key
                            financial insights at a glance.</p>
                    </div>
                    <div class="dashboard-button-container">
                        <button class="btn btn-primary btn-add-expense transition-3"><i data-lucide="plus"
                                class="btn-plus-icon"></i> Add Expense</button>
                    </div>
                </div>
            </div>

             <div class="container dashboard-summary-container">
                 <p class="dashboard-summary-heading">Summary</p>
                 <div class="dashboard-expense-content">
                     <div class="summary-tab-container">
                         <div class="summary-details-container">
                             <p class="summary-details-name">Total Budget</p>
                             <p class="summary-details-amount mb-sm-3">${this._data.currencySymbol}${this._currencyFormatter.format(this._data.budget)}</p>
                         </div>
                         <div class="summary-tab-icon-container">
                                 <div class="tab-icon-background"><i data-lucide="banknote-arrow-down"></i> </div>
                         </div>
                     </div>
                     <div class="summary-tab-container">
                         <div class="summary-details-container">
                             <p class="summary-details-name">Remaining Budget</p>
                             <p class="summary-details-amount mb-sm-3">${this._data.currencySymbol}${this._currencyFormatter.format(this._data.remainingBudget)}</p>
                         </div>
                         <div class="summary-tab-icon-container">
                                 <div class="tab-icon-background"><i data-lucide="banknote-arrow-up"></i> </div>
                         </div>
                     </div>
                 </div>
             </div>

            <div class="container dashboard-chart-container">
                <div class="dashboard-pie-container border-med">
                </div>
                <div class="dashboard-bar-container border-med"></div>
            </div>
        </section>`;
  }
}

export default new dashboardView();
