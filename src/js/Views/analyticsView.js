import View from "./View";
import ApexCharts from "apexcharts";
import { CURRENCYFORMAT } from "../config.js";


class analyticsView extends View {
  _data;
  _currencyFormatter;
  _timePeriodSelectEl;

  renderView(data,timePeriod) {
    this._data = data;
    console.log(this._data);
    this._clearView();
    this._parentContainer.insertAdjacentHTML(
      "afterbegin",
      this._returnMarkup()
    );
    this._currencyFormatter = new Intl.NumberFormat("en-US", CURRENCYFORMAT);
    this._timePeriodSelectEl = document.getElementById('analytics-select');
    this._timePeriodSelectEl.value = timePeriod;
    this._initFields();
  }

  _initFields() {
    this._displayCategorySpendingChart();
    this._displayExpenseCategoriesChart();
    this._displayCurrentVsPreviousChart();
  }

  _displayCategorySpendingChart() {
    var options = {
      series: this._data.categorySpendTrend.chartsData,
      colors: this._data.categorySpendTrend.colors,
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: this._data.categorySpendTrend.monthsLabel,
      },
      tooltip: {
        y: {
          title: {
            formatter: () => "",
          },
          formatter: (value, { seriesIndex, w }) => {
            const categoryName = w.globals.seriesNames[seriesIndex];
            return `${categoryName}: ${
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
      document.querySelector(".category-spending-trend"),
      options
    );
    chart.render();
  }

  _displayExpenseCategoriesChart() {
    var options = {
      series: [
        {
          data: this._data.topExpenseCategories.amount,
        },
      ],
      colors: this._data.topExpenseCategories.color,
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 14,
          borderRadiusApplication: "end",
          barHeight: "35%",
          borderRadiusWhenStacked: "last",
          horizontal: true,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) =>
          `${this._data.currencySymbol}${val.toLocaleString()}`,
        offsetX: 10,
      },
      xaxis: {
        categories: this._data.topExpenseCategories.categoryName,
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
      document.querySelector(".expense-categories-chart"),
      options
    );
    chart.render();
  }

  _displayCurrentVsPreviousChart() {
    var options = {
      series: [
        {
          data: this._data.monthComparisonChart.amount,
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
          columnWidth: "25%",
          borderRadius: 8,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: this._data.monthComparisonChart.months,
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
      document.querySelector(".expense-comparison-chart"),
      options
    );
    chart.render();
  }

  _formatCurrencyValue(val) {
    return this._currencyFormatter.format(val);
  }

  changeTimePeriod(handler){
    this._timePeriodSelectEl.addEventListener('change',(e)=>{
      const timePeriod = e.target.value;
      if(!timePeriod) return;
      handler(timePeriod);
    })
  }

  _returnMarkup() {
    return `<section class="section-analytics main-section">
            <div class="dashboard-content">
                <div class="dashboard-container">
                    <div class="dashboard-heading-container">
                        <h2 class="heading-secondary">Analytics</h2>
                        <p class="heading-desc">Discover spending trends and patterns over time. Compare monthly
                            insights and identify your top expense categories.</p>
                    </div>
                </div>
            </div>

            <div class="container mb-md-2">
                <div class="analytics-select-container trans-input-group">
                    <label for="analytics-select" class="trans-form-label">Time Period</label>
                    <select id="analytics-select" class="trans-input-field">
                        <option value="3">Last 3 Months</option>
                        <option value="6">Last 6 Months</option>
                        <option value="12">Last 12 Months</option>
                    </select>
                </div>
            </div>

            <div class="container spending-chart-container mb-md-2">
                <p class="dashboard-summary-heading">Category Spending Trend</p>
                <div class="category-spending-trend"></div>
            </div>

            <div class="container analytics-categories-container">
                <div class="anlytics-categories-chart-container">
                    <p class="dashboard-summary-heading center-text">Top 3 Expense Categories</p>
                    <div class="expense-categories-chart"></div>
                </div>
                <div class="anlytics-categories-chart-container">
                    <p class="dashboard-summary-heading center-text">Current vs Previous Month</p>
                    <div class="expense-comparison-chart"></div>
                </div>
            </div>
        </section>`;
  }
}

export default new analyticsView();
