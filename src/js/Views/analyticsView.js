import View from "./View";
import ApexCharts from "apexcharts";
import { CURRENCYFORMAT } from "../config.js";


class analyticsView extends View {
  _data;
  _currencyFormatter;

  renderView(data) {
    this._data = data;
    console.log(this._data);
    this._clearView();
    this._parentContainer.insertAdjacentHTML(
      "afterbegin",
      this._returnMarkup()
    );
    this._currencyFormatter = new Intl.NumberFormat("en-US", CURRENCYFORMAT);
    this._initFields();
  }

  _initFields() {
    this._displayCategorySpendingChart();
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
          formatter: (value,{seriesIndex,w}) => {
           const categoryName = w.globals.seriesNames[seriesIndex];
            return `${categoryName}: ${
              this._data.currencySymbol
            }${this._formatCurrencyValue(value)}`;
          },
        },
      },
    };

    var chart = new ApexCharts(
      document.querySelector(".category-spending-trend"),
      options
    );
    chart.render();
  }

  _formatCurrencyValue(val) {
    return this._currencyFormatter.format(val);
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
                        <option>Last 3 Months</option>
                        <option>Last 6 Months</option>
                        <option>Last 12 Months</option>
                    </select>
                </div>
            </div>

            <div class="container spending-chart-container mb-md-2">
                <p class="dashboard-summary-heading">Category Spending Trend</p>
                <div class="category-spending-trend"></div>
            </div>

            <div class="container analytics-categories-container">
                <div class="anlytics-categories-chart-container">
                    <p class="dashboard-summary-heading">Top 3 Expense Categories</p>
                </div>
                <div class="anlytics-categories-chart-container">
                    <p class="dashboard-summary-heading">Current vs Previous Month</p>
                </div>
            </div>
        </section>`;
  }
}

export default new analyticsView();
