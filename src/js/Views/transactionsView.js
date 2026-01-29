import { createIcons, icons } from "lucide";
import View from "./View.js";
import { DATEOPTION, DATAPERPAGE, CURRENCYFORMAT } from "../config.js";

class transactionsView extends View {
  _addTransactionBtn;
  _data;
  _pageNo;
  _totalTransactionsPages;
  _paginationBtnContainer;
  _totalTransactionsNumber;
  _sortState;
  _filterCategoriesEl;
  _filterStartDateEl;
  _filterEndDateEl;
  _categoriesData;
  _tableContainerEl;
  _recordsContainerEl;
  _tableEl;
  _confirmationModal;
  _deleteConfirmationBtn;
  _downloadTransactionBtn;
  _currencyFormatter;
  _currencySymbol;
  _isInitialized;
  _mobileTransactionsTableEl;

  renderView(viewData) {
    this._clearView();
    ({
      transactionsData: this._data,
      pageNo: this._pageNo,
      totalTransactions: this._totalTransactionsNumber,
      transactionSortState: this._sortState,
      categories: this._categoriesData,
      currency: this._currencySymbol,
      isInitialized: this._isInitialized,
    } = viewData);
    console.log(viewData);
    // this._data = transactions;
    console.log(this._data);
    this._totalTransactionsPages = Math.ceil(
      this._totalTransactionsNumber / DATAPERPAGE
    );
    this._currencyFormatter = new Intl.NumberFormat("en-US", CURRENCYFORMAT);
    // const sortedByDateCategories = this._data.sort((a, b) => new Date(b.date) - new Date(a.date));
    // console.log(this._totalTransactionsPages);
    this._parentContainer.insertAdjacentHTML(
      "afterbegin",
      this._returnMarkup()
    );
    this._paginationBtnContainer = document.querySelector(
      ".pagination-btn-container"
    );
    this.returnPageNumberMarkup();
    this.displayActivePageBtn();
    this._displaySortedIcon();
    flatpickr(".trans-filter-date", {
      dateFormat: "m/d/Y",
    });
    createIcons({ icons });
    this._addTransactionBtn = document.querySelector(".btn-add-expense");
    this._successModal = document.querySelector(".modal-success");
    this._toastrModalBtns = document.querySelectorAll(
      ".modal-notification-btn"
    );
    this._filterCategoriesEl = document.getElementById("filter-categories");
    this._filterStartDateEl = document.getElementById("filter-start-date");
    this._filterEndDateEl = document.getElementById("filter-end-date");
    this._tableContainerEl = document.querySelector(
      ".transaction-table-container"
    );
    this._recordsContainerEl = document.querySelector(
      ".total-records-container"
    );
    this._tableEl = document.querySelector(".trans-table-body");
    this._mobileTransactionsTableEl = document.querySelector(".mobile-transactions-cards-container");
    this._confirmationModal = document.querySelector(".confirmation-modal");
    this._deleteConfirmationBtn = document.querySelector(
      ".modal-confirmation-btn"
    );
    this._downloadTransactionBtn = document.querySelector(".btn-trans-dwnld");
    this._closeToastrEl();
    this._initCategoryDropdown();
    this._openDeleteConfirmationModal();
    this._openDeleteConfirmationModalForMobile();
    this._isUserdetailsInitialized(this._isInitialized);
    // this.returntransactionMarkup();
  }

  openTransactionModal(handler) {
    this._addTransactionBtn.addEventListener("click", function (e) {
      handler("section-transaction", false);
    });
  }

  selectTransactionPage(handler) {
    this._paginationBtnContainer.addEventListener("click", (e) => {
      e.preventDefault();
      const btn = e.target.closest(".pagination-btn");
      if (!btn) return;
      if (btn.classList.contains("pagination-btn-active")) return;
      // console.log(btn);
      const paginationNumber = btn.dataset.currentPage;
      // console.log(paginationNumber);
      handler(paginationNumber, this._data);
    });
  }

  displayActivePageBtn() {
    const btn = document.querySelector(`[data-current-page="${this._pageNo}"]`);
    // console.log(btn);
    if (!btn) return;
    btn.classList.add("pagination-btn-active");
  }

  _displaySortedIcon() {
    // console.log(this._sortState);
    let sortField = this._sortState.field;
    if (sortField === "categoryName") {
      sortField = "category-name";
    }
    const ele = document.querySelector(`[data-sort=${sortField}]`);
    if (!ele) return;
    // console.log(ele);
    const arrowEle =
      this._sortState.direction === "asc"
        ? "<span>&uarr;</span>"
        : "<span>&darr;</span>";
    ele.insertAdjacentHTML("beforeend", arrowEle);
  }

  sortTransactionsHandler(handler) {
    const theadEl = document.querySelector(".trans-head-table-row");
    if (!theadEl) return;
    document
      .querySelector(".trans-head-table-row")
      .addEventListener("click", (e) => {
        const ele = e.target.closest(".thead-sort-column");
        if (!ele) return;
        // console.log(ele);
        let fieldEl = ele.dataset.sort;
        //console.log(fieldEl);
        if (fieldEl === "category-name") {
          fieldEl = "categoryName";
        }
        // console.log(this._sortState,this._totalTransactionsNumber);
        let Obj;
        if (fieldEl === this._sortState.field) {
          Obj = {
            field: fieldEl,
            direction: this._sortState.direction === "asc" ? "desc" : "asc",
          };
        } else {
          Obj = {
            field: fieldEl,
            direction: "asc",
          };
        }

        handler(Obj);
      });
  }

  _initCategoryDropdown() {
    // console.log(this._categoriesData);
    this._categoriesData.forEach((cat) => {
      const optionEle = `<option value="${cat.name}">${cat.name}</option>`;
      this._filterCategoriesEl.insertAdjacentHTML("beforeend", optionEle);
    });
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const categoryParams = params.get("category");
    const startDateParams = params.get("startDate");
    const endDateParams = params.get("endDate");
    // console.log(categoryParams,startDateParams,endDateParams);
    if (categoryParams) this._filterCategoriesEl.value = categoryParams;
    if (startDateParams) this._filterStartDateEl.value = startDateParams;
    if (endDateParams) this._filterEndDateEl.value = endDateParams;
  }

  filterData(handler) {
    document
      .querySelector(".btn-trans-filter")
      .addEventListener("click", (e) => {
        const categoryNameEl = document.getElementById("filter-categories");
        const startDateEl = document.getElementById("filter-start-date");
        const endDateEl = document.getElementById("filter-end-date");
        // console.log(categoryNameEl.value);
        // console.log(startDateEl.value);
        // console.log(endDateEl.value);
        const validator = this._validateFilterDates(
          startDateEl.value,
          endDateEl.value
        );
        if (validator) return;
        if (!categoryNameEl.value && !startDateEl.value && !endDateEl.value)
          return;
        // console.log(categoryNameEl.value, startDateEl.value, endDateEl.value);
        handler(categoryNameEl.value, startDateEl.value, endDateEl.value);
      });
  }

  _validateFilterDates(startDate, endDate) {
    if (!startDate || !endDate) return;
    // console.log(new Date(startDate), new Date(endDate));
    const validatorEl = document.querySelector('[data-validator="end-date"]');
    if (startDate > endDate) {
      if (!validatorEl) return;
      validatorEl.textContent = "start date cannot be greater than end date";
      validatorEl.classList.remove("hidden-visibility");
      return true;
    }
    validatorEl.classList.add("hidden-visibility");
    return false;
  }

  displayUpdatedTransactions(data) {
    this._data = data;
    this._totalTransactionsNumber = this._data.length;
    this._totalTransactionsPages = Math.ceil(
      this._totalTransactionsNumber / DATAPERPAGE
    );
    this.updateTransactionsTableDOM();
    this._displaySortedIcon();
    this._paginationBtnContainer.textContent = "";
    this.returnPageNumberMarkup();
    this.displayActivePageBtn();
    this._updatePagesNumberDOM();
    createIcons({ icons });
  }

  editTransactionsHandler(handler) {
    if (!this._tableEl) return;
    this._tableEl.addEventListener("click", (e) => {
      const editBtnEl = e.target.closest(".edit-btn");
      if (!editBtnEl) return;
      // console.log(editBtnEl);
      const btnRowEl = e.target.closest(".trans-table-row");
      if (!btnRowEl) return;
      // console.log(btnRowEl);
      const transId = btnRowEl.dataset.transactionId;
      if (!transId) return;
      // console.log(transId);
      handler("section-transaction", true, transId);
    });
  }

   editTransactionsHandlerForMobile(handler) {
    if (!this._mobileTransactionsTableEl) return;
    this._mobileTransactionsTableEl.addEventListener("click", (e) => {
      const editBtnEl = e.target.closest(".edit-btn");
      if (!editBtnEl) return;
      // console.log(editBtnEl);
      const btnRowEl = e.target.closest(".trans-table-row");
      if (!btnRowEl) return;
      // console.log(btnRowEl);
      const transId = btnRowEl.dataset.transactionId;
      if (!transId) return;
      // console.log(transId);
      handler("section-transaction", true, transId);
    });
  }

  _openDeleteConfirmationModal() {
    if (!this._tableEl) return;
    this._tableEl.addEventListener("click", (e) => {
      const deleteBtn = e.target.closest(".delete-btn");
      if (!deleteBtn) return;
      const btnRowEl = e.target.closest(".trans-table-row");
      if (!btnRowEl) return;
      // console.log(btnRowEl);
      const transId = btnRowEl.dataset.transactionId;
      if (!transId) return;
      this._confirmationModal.classList.remove("hidden");
      const backDrop = `<div class="modal-backdrop"></div>`;
      this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
      const backDropEl = document.querySelector(".modal-backdrop");
      backDropEl.classList.add("active");
      this._confirmationModal.dataset.transactionId = transId;
    });
  }

  _openDeleteConfirmationModalForMobile() {
    if (!this._mobileTransactionsTableEl) return;
    this._mobileTransactionsTableEl.addEventListener("click", (e) => {
      const deleteBtn = e.target.closest(".delete-btn");
      if (!deleteBtn) return;
      const btnRowEl = e.target.closest(".trans-table-row");
      if (!btnRowEl) return;
      // console.log(btnRowEl);
      const transId = btnRowEl.dataset.transactionId;
      if (!transId) return;
      this._confirmationModal.classList.remove("hidden");
      const backDrop = `<div class="modal-backdrop"></div>`;
      this._parentContainer.insertAdjacentHTML("afterbegin", backDrop);
      const backDropEl = document.querySelector(".modal-backdrop");
      backDropEl.classList.add("active");
      this._confirmationModal.dataset.transactionId = transId;
    });
  }

  deleteTransactionsHandler(handler) {
    this._deleteConfirmationBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // console.log(e.target);
      const modalDiv = e.target.closest(".confirmation-modal");
      // console.log(modalDiv);
      if (!modalDiv) return;
      const transId = modalDiv.dataset.transactionId;
      if (!transId) return;
      // console.log(transId);
      handler(transId);
    });
  }

  exportTransactionsHanlder(handler) {
    this._downloadTransactionBtn.addEventListener("click", (e) => {
      console.log("btn clicked");
      handler();
    });
  }

  updateTransactionsTableDOM() {
    this._tableContainerEl.textContent = "";
    const tableEl = `<table class="transaction-table">
        <thead class="trans-head-table-container">
            <tr class="trans-head-table-row">
                <th class="trans-head-table"><span class="thead-sort-column" data-sort="date"><span>Date</span></span>
                </th>
                <th class="trans-head-table"><span class="thead-sort-column"
                        data-sort="category-name"><span>Category</span></span>
                </th>
                <th class="trans-head-table">Description</th>
                <th class="trans-head-table"><span class="thead-sort-column"
                        data-sort="amount"><span>Amount</span></span>
                </th>
                <th class="trans-head-table">Actions</th>
            </tr>
        </thead>
        <tbody class="trans-table-body">
            ${this._data
              .map((cat) => {
                return this.returnTransactionMarkup(cat);
              })
              .join("")}
        </tbody>
    </table>`;
    this._tableContainerEl.insertAdjacentHTML("afterbegin", tableEl);
  }

  _updatePagesNumberDOM() {
    this._recordsContainerEl.textContent = "";
    this._recordsContainerEl.insertAdjacentHTML(
      "afterbegin",
      `<p>Page ${this._pageNo} of ${this._totalTransactionsPages} Pages</p>
        <p class="total-records">${this._totalTransactionsNumber} Total Records</p>`
    );
  }

  _returnMarkup() {
    const hasData = this._data && this._data.length > 0;
    console.log(hasData);
    return ` <section class="section-transaction main-section">
            <div class="dashboard-content">
                <div class="dashboard-container">
                    <div class="dashboard-heading-container">
                        <h2 class="heading-secondary">Transactions</h2>
                        <p class="heading-desc">View, search, and manage all your expenses in one place. Filter, edit,
                            or download your spending records.</p>
                    </div>
                    <div class="dashboard-button-container">
                        <button class="btn btn-primary btn-add-expense transition-3"><i data-lucide="plus"
                                class="btn-plus-icon"></i> Add Expense</button>
                    </div>
                </div>
            </div>

            <div class="container trans-filter-container mb-sm-3">
                <div class="trans-input-group">
                    <label for="filter-categories" class="trans-form-label">Categories</label>
                    <div>
                     <select id="filter-categories" class="trans-input-field">
                         <option value="all">All</option>
                     </select>
                     <p class="transaction-validation hidden-visibility"></p>
                    </div>
                </div>
                <div class="trans-input-group">
                    <label for="filter-start-date" class="trans-form-label">Start Date</label>
                    <div>
                     <input type="text" id="filter-start-date" class="trans-input-field trans-filter-date" />
                     <p class="transaction-validation hidden-visibility"></p>
                    </div>
                </div>
                <div class="trans-input-group">
                    <label for="filter-end-date" class="trans-form-label">End Date</label>
                    <div>
                      <input type="text" id="filter-end-date" class="trans-input-field trans-filter-date" data-validate="end-date"/>
                      <p class="validation-label transaction-validation hidden-visibility" data-validator="end-date"></p>
                    </div>
                </div>
                <div class="trans-btn-group">
                  <div>
                      <button class="btn-primary btn-trans transition-3 btn btn-trans-filter"><i
                              data-lucide="list-filter"></i>Filter</button>
                      <p class="transaction-validation hidden-visibility"></p>
                   </div>
                   <div>
                      <button class="btn-primary btn-trans transition-3 btn btn-trans-dwnld"><i
                            data-lucide="download"></i>Download</button>
                       <p class="transaction-validation hidden-visibility"></p>
                    </div>
                </div>
            </div>

            <div class="container transaction-table-container mb-md-1 pos-relative min-height-25">
              ${
                hasData
                  ? `<table class="transaction-table">
                    <thead class="trans-head-table-container">
                        <tr class="trans-head-table-row">
                            <th class="trans-head-table"><span
                                    class="thead-sort-column" data-sort="date"><span>Date</span></span>
                            </th>
                            <th class="trans-head-table"><span
                                    class="thead-sort-column" data-sort="category-name"><span>Category</span></span>
                            </th>
                            <th class="trans-head-table">Description</th>
                            <th class="trans-head-table"><span
                                    class="thead-sort-column" data-sort="amount"><span>Amount</span></span>
                            </th>
                            <th class="trans-head-table">Actions</th>
                        </tr>
                    </thead>
                   <tbody class="trans-table-body">
            ${this._data
              .map((cat) => {
                return this.returnTransactionMarkup(cat);
              })
              .join("")}
            </tbody>
                </table>`
                  : `<div class="no-data-found">
                   <i data-lucide="triangle-alert"></i> 
                   <p class="no-data-text">No data yet — start by adding expenses.</p>
                 </div>`
              }

              ${
                hasData
                  ? `
                <div class="mobile-transactions-cards-container">
                ${this._data
                  .map((cat) => {
                    return this.returnTransactionMarkupforMobile(cat);
                  })
                  .join("")}
              </div>
                `
                  : `<div class="no-data-found">
                   <i data-lucide="triangle-alert"></i> 
                   <p class="no-data-text">No data yet — start by adding expenses.</p>
                 </div>`
              }

            </div>

            <div class="container pagination-container">
                <div class="total-records-container">
                    <p>Page ${this._pageNo} of ${
      this._totalTransactionsPages
    } Pages</p>
                    <p class="total-records">${
                      this._totalTransactionsNumber
                    } Total Records</p>
                </div>
                <div class="pagination-btn-container">
                </div>
                <div class="pagination-empty-div"></div>
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

  returnTransactionMarkup(transaction) {
    return `<tr class="trans-table-row" data-transaction-id=${transaction.id}>
                            <td class="overflow-ellipsis">${new Intl.DateTimeFormat(
                              "en-US",
                              DATEOPTION
                            ).format(new Date(transaction.date))}</td>
                            <td class="overflow-ellipsis">${
                              transaction.categoryName
                            }</td>
                            <td class="overflow-ellipsis">${
                              transaction.description
                            }</td>
                            <td class="overflow-ellipsis">${
                              this._currencySymbol
                            }${this._currencyFormatter.format(
      transaction.amount
    )}</td>
                            <td class="trans-table-button-col">
                                <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                            </td>
                        </tr>`;
  }

  returnTransactionMarkupforMobile(transaction) {
    return `
     <div class="transaction-card trans-table-row" data-transaction-id=${
       transaction.id}>
                <div class="card-date-container">${new Intl.DateTimeFormat(
                  "en-US",
                  DATEOPTION
                ).format(new Date(transaction.date))}</div>
                <div class="card-details-container">
                    <div class="card-category-container">
                        <p class="overflow-ellipsis card-category-name">${transaction.categoryName}</p>
                        <p class="overflow-ellipsis card-description">${transaction.description}</p>
                    </div>
                    <p class="overflow-ellipsis card-amount">${ this._currencySymbol}${this._currencyFormatter.format(transaction.amount)}</p>
                </div>
                <div class="card-buttons-container trans-table-button-col">
                     <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                </div>
              </div>
    `;
  }

  returnPageNumberMarkup() {
    for (let i = 1; i <= this._totalTransactionsPages; i++) {
      const html = `<div class="pagination-btn-div">
                        <button class="btn pagination-btn" data-current-page="${i}">${i}</button>
                    </div>`;
      this._paginationBtnContainer.insertAdjacentHTML("beforeend", html);
    }
  }
}

export default new transactionsView();
