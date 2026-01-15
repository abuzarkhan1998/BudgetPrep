import View from "./View.js";
import { createIcons, icons } from "lucide";
import { CURRENCYFORMAT } from "../config.js";
import ApexCharts from "apexcharts";

class dashboardView extends View {
  _addTransactionBtn;
  _data;
  _currencyFormatter;
  _progressContainerEl;
  _progressFillEl;

  renderView(data) {
    this._data = data;
    this._currencyFormatter = new Intl.NumberFormat("en-US", CURRENCYFORMAT);
    // console.log(this._data);
    this._clearView();
    this._parentContainer.insertAdjacentHTML(
      "afterbegin",
      this._returnMarkup()
    );
    this._progressContainerEl = document.querySelector(".progress-container");
    this._progressFillEl = document.querySelector(".progress-fill");
    createIcons({ icons });
    this._addTransactionBtn = document.querySelector(".btn-add-expense");
    this._successModal = document.querySelector(".modal-success");
    this._toastrModalBtns = document.querySelectorAll(".modal-notification-btn");
    // console.log(this._toastrModalBtns);
    this._initFields();
    this._closeToastrEl();
  }

  openAddTransactionView(handler) {
    this._addTransactionBtn.addEventListener("click", (e) => {
      handler("section-dashboard", false);
    });
  }

  _initFields() {
    // this._displayBarProgress();
    this._displayCategorySpending();
    this._displayMonthlyTrend();
  }

  _displayBarProgress() {
    const percent = Math.min(
      (this._data.monthExpense / this._data.budget) * 100,
      100
    );
    console.log(percent);
    console.log(this._progressContainerEl);
    this._progressFillEl.style.width = `${percent}%`;
    if (percent < 60) {
      this._progressFillEl.style.backgroundColor = "#64d68e";
      this._progressContainerEl.style.border = "1.5px solid #1b9e4b";
    } else if (percent >= 60 && percent < 85) {
      this._progressFillEl.style.backgroundColor = "#f9c56d";
      this._progressContainerEl.style.border = "1.5px solid #bd8c39";
    } else {
      this._progressFillEl.style.backgroundColor = "#f26969";
      this._progressContainerEl.style.border = "1.5px solid #bf3636";
    }
  }

  _displayCategorySpending() {
    var options = {
      series: this._data.categorySpending.amount,

      chart: {
        type: "donut",
        width: "100%",
        height: 320,
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      labels: this._data.categorySpending.categories,
      colors: this._data.categorySpending.colors,
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "14px",
                fontWeight: 500,
              },
              value: {
                show: true,
                fontSize: "16px",
                fontWeight: 600,
                formatter: (val) =>
                  `${this._data.currencySymbol}${this._formatCurrencyValue(
                    val
                  )}`,
              },
              total: {
                show: true,
                label: "Total Spending",
                fontSize: "13px",
                fontWeight: 500,
                formatter: () =>
                  `${this._data.currencySymbol}${this._formatCurrencyValue(
                    this._data.categorySpending.amount.reduce(
                      (a, b) => a + b,
                      0
                    )
                  )}`,
              },
            },
          },
        },
      },

      dataLabels: {
        enabled: true,
        formatter: (val) => `${Math.round(val)}%`,
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
        dropShadow: {
          enabled: false,
        },
      },

      stroke: {
        show: true,
        width: 2,
        colors: ["#fff"],
      },

      legend: {
        position: "bottom",
        fontSize: "14px",
        fontWeight: 500,
        labels: {
          colors: "#555",
        },
        formatter: (seriesName, opts) => {
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${seriesName} — ${
            this._data.currencySymbol
          }${this._formatCurrencyValue(value)}`;
        },
      },

      tooltip: {
        y: {
          formatter: (val) =>
            `${this._data.currencySymbol}${this._formatCurrencyValue(val)}`,
        },
      },

      subtitle: {
        text: "Current Month",
        align: "center",
        offsetY: 0,
        style: {
          fontSize: "13px",
          color: "#777",
        },
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 260,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    var chart = new ApexCharts(
      document.querySelector(".dashboard-category-spending"),
      options
    );
    chart.render();
  }

  _formatCurrencyValue(val) {
    return this._currencyFormatter.format(val);
  }

  _displayMonthlyTrend() {
    var options = {
      series: [
        {
          data: this._data.monthlyTrend.expenses,
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          borderRadius: 6,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: this._data.monthlyTrend.monthLabel,
      },
      tooltip: {
        y: {
          title: {
            formatter: () => "",
          },
          formatter: (value) => {
            return `Expense: ${
              this._data.currencySymbol
            }${this._formatCurrencyValue(value)}`;
          },
        },
      },
      grid: {
        borderColor: "#f1f1f1",
        strokeDashArray: 4,
      },
    };

    var chart = new ApexCharts(
      document.querySelector(".dashboard-monthly-trend"),
      options
    );
    chart.render();
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
                 <p class="dashboard-summary-heading">This Month Overview</p>
                 <div class="dashboard-expense-content">
                     <div class="summary-tab-container">
                         <div class="summary-details-container">
                             <p class="summary-details-name">Total Budget</p>
                             <p class="summary-details-amount mb-sm-3">${
                               this._data.currencySymbol
                             }${this._currencyFormatter.format(
      this._data.budget
    )}</p>
                         </div>
                         <div class="summary-tab-icon-container">
                                 <div class="tab-icon-background"><i data-lucide="banknote-arrow-down"></i> </div>
                         </div>
                     </div>
                     <div class="summary-tab-container">
                         <div class="summary-details-container">
                             <p class="summary-details-name">Total Spent</p>
                             <p class="summary-details-amount mb-sm-3">${
                               this._data.currencySymbol
                             }${this._currencyFormatter.format(
      this._data.monthExpense
    )}</p>
                         </div>
                         <div class="summary-tab-icon-container">
                                 <div class="tab-icon-background"><i data-lucide="banknote-arrow-up"></i> </div>
                         </div>
                     </div>
                     <div class="summary-tab-container">
                         <div class="summary-details-container">
                             <p class="summary-details-name">Remaining Budget</p>
                             <p class="summary-details-amount mb-sm-3">${
                               this._data.currencySymbol
                             }${this._currencyFormatter.format(
      this._data.remainingBudget
    )}</p>
                         </div>
                         <div class="summary-tab-icon-container">
                                 <div class="tab-icon-background"><i data-lucide="banknote"></i> </div>
                         </div>
                     </div>
                 </div>
             </div>

            <div class="container dashboard-chart-container">
                <div class="dashboard-pie-container border-med">
                <p class="dashboard-summary-heading center-text">Spending by Category</p>
                <div class="dashboard-category-spending"></div>
                </div>
                <div class="dashboard-bar-container border-med">
                <p class="dashboard-summary-heading center-text">Monthly Trend</p>
                <div class="dashboard-monthly-trend"></div>
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
}

export default new dashboardView();
