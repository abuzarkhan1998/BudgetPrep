import { createIcons, icons } from "lucide";
import View from "./View.js";

class transactionsView extends View {
  _addTransactionBtn;

  renderView() {
    this._clearView();
    this._parentContainer.insertAdjacentHTML(
      "afterbegin",
      this._returnMarkup()
    );
    createIcons({ icons });
    this._addTransactionBtn = document.querySelector(".btn-add-expense");
    this._successModal = document.querySelector(".modal-success");
    this._toastrModalBtns = document.querySelectorAll(".modal-notification-btn");
    this._closeToastrEl();
  }

  openTransactionModal(handler){
    this._addTransactionBtn.addEventListener('click',function(e){
        handler('section-transaction');
    })
  }

  _returnMarkup() {
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

            <div class="container trans-filter-container mb-md-2">
                <div class="trans-input-group">
                    <label for="filter-categories" class="trans-form-label">Categories</label>
                    <select id="filter-categories" class="trans-input-field">
                        <option value="Cat 1">Cat 1</option>
                        <option value="Cat 1">Cat 2</option>
                        <option value="Cat 1">Cat 3</option>
                        <option value="Cat 1">Cat 4</option>
                    </select>
                </div>
                <div class="trans-input-group">
                    <label for="filter-start-date" class="trans-form-label">Start Date</label>
                    <input type="text" id="filter-start-date" class="trans-input-field" />
                </div>
                <div class="trans-input-group">
                    <label for="filter-end-date" class="trans-form-label">End Date</label>
                    <input type="text" id="filter-end-date" class="trans-input-field" />
                </div>
                <div class="trans-btn-group">
                    <button class="btn-primary btn-trans transition-3 btn"><i
                            data-lucide="list-filter"></i>Filter</button>
                    <button class="btn-primary btn-trans transition-3 btn"><i
                            data-lucide="download"></i>Download</button>
                </div>
            </div>

            <div class="container transaction-table-container mb-md-1">
                <table class="transaction-table">
                    <thead class="trans-head-table-container">
                        <tr class="trans-head-table-row">
                            <th class="trans-head-table"><span
                                    class="thead-sort-column"><span>Date</span><span>&uarr;</span><span>&darr;</span></span>
                            </th>
                            <th class="trans-head-table"><span
                                    class="thead-sort-column"><span>Category</span><span>&uarr;</span><span>&darr;</span></span>
                            </th>
                            <th class="trans-head-table">Description</th>
                            <th class="trans-head-table"><span
                                    class="thead-sort-column"><span>Amount</span><span>&uarr;</span><span>&darr;</span></span>
                            </th>
                            <th class="trans-head-table">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="trans-table-body">
                        <tr class="trans-table-row">
                            <td>Oct 15, 2025</td>
                            <td>Food</td>
                            <td>Lunch at Cafe</td>
                            <td>350</td>
                            <td class="trans-table-button-col">
                                <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                            </td>
                        </tr>
                        <tr class="trans-table-row">
                            <td>Oct 15, 2025</td>
                            <td>Food</td>
                            <td>Lunch at Cafe</td>
                            <td>350</td>
                            <td class="trans-table-button-col">
                                <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                            </td>
                        </tr>
                        <tr class="trans-table-row">
                            <td>Oct 15, 2025</td>
                            <td>Food</td>
                            <td>Lunch at Cafe</td>
                            <td>350</td>
                            <td class="trans-table-button-col">
                                <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Oct 15, 2025</td>
                            <td>Food</td>
                            <td>Lunch at Cafe</td>
                            <td>350</td>
                            <td class="trans-table-button-col">
                                <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                            </td>
                        </tr>
                        <tr class="trans-table-row">
                            <td>Oct 15, 2025</td>
                            <td>Food</td>
                            <td>Lunch at Cafe</td>
                            <td>350</td>
                            <td class="trans-table-button-col">
                                <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                            </td>
                        </tr>
                        <tr class="trans-table-row">
                            <td>Oct 15, 2025</td>
                            <td>Food</td>
                            <td>Lunch at Cafe</td>
                            <td>350</td>
                            <td class="trans-table-button-col">
                                <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="container pagination-container">
                <div class="total-records-container">
                    <p>Page 1 of 5 Pages</p>
                    <p class="total-records">100 Total Records</p>
                </div>
                <div class="pagination-btn-container">
                    <div class="pagination-btn-div">
                        <button class="btn pagination-btn">1</button>
                    </div>
                    <div class="pagination-btn-div">
                        <button class="btn pagination-btn">2</button>
                    </div>
                    <div class="pagination-btn-div">
                        <button class="btn pagination-btn pagination-btn-active">3</button>
                    </div>
                    <div class="pagination-btn-div">
                        <button class="btn pagination-btn">4</button>
                    </div>
                    <div class="pagination-btn-div">
                        <button class="btn pagination-btn">5</button>
                    </div>
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
}

export default new transactionsView();
