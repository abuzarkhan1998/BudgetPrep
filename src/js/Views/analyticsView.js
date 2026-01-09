import View from "./View";
import ApexCharts from "apexcharts";


class analyticsView extends View {
  renderView() {
    this._clearView();
    this._parentContainer.insertAdjacentHTML("afterbegin",this._returnMarkup());
    this._initFields();
  }

  _initFields(){
    this._displayCategorySpendingChart();
  }

  _displayCategorySpendingChart(){
    var options = {
          series: [{
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        },
        {
            name: "Laptop",
            data: [20, 31, 55, 21, 19, 82, 79, 91, 18]
        }],
          chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
        };

        var chart = new ApexCharts(document.querySelector(".category-spending-trend"), options);
        chart.render();
  }

  _returnMarkup(){
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
                    <p class="dashboard-summary-heading">Top 3 Expence Categories</p>
                </div>
                <div class="anlytics-categories-chart-container">
                    <p class="dashboard-summary-heading">Current vs Previous Month</p>
                </div>
            </div>
        </section>`;
  }
}

export default new analyticsView();
