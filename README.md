# Budget-Prep 💰  
*A Personal Budget & Expense Tracking Application*

Budget-Prep is a responsive personal finance web application built using **pure JavaScript** (no frontend frameworks).  
The application allows users to track expenses, manage budgets, and analyze spending trends through interactive charts and a clean, mobile-friendly UI.

This project was designed to demonstrate **strong JavaScript fundamentals, application architecture, and UI/UX problem-solving**.

---

## 🔗 Live Demo
> https://budgetprep.abuzarkhan1998.in

---

## ✨ Key Features

- Add, edit, and delete expense transactions
- Category-based expense tracking
- Monthly and category-wise analytics
- Top spending categories visualization
- Current vs previous month comparison
- Fully responsive layout (desktop → mobile)
- Sidebar navigation with mobile overlay menu
- Card-based UI for transactions on small screens
- Graceful empty states when no data is available

---

## 🧰 Tech Stack

- **HTML5**
- **CSS3**
  - Flexbox
  - CSS Grid
  - Media Queries
- **JavaScript (ES6+)**
- **Parcel** (bundler)
- **ApexCharts** (data visualization)
- **Flatpickr** (date picker)
- **Lucide Icons**

> No frontend frameworks (React, Vue, etc.) were used.

---

## 🏗️ Application Architecture

### MVC (Model–View–Controller)

The project follows a **clear MVC architecture**:

#### 🧠 Model
- Maintains the **application state**
- Handles all **data manipulation**
- Contains **API calls**
- Acts as the single source of truth for the app

#### 🎮 Controller
- Handles **business logic**
- Orchestrates communication between Model and Views
- Responds to user actions and updates state accordingly

#### 🖥️ View Layer
- Each View is implemented as a **class**
- Responsible only for **DOM rendering and UI updates**
- `View.js` acts as a **parent/base class**
- Child views extend shared rendering and helper methods

---

## 🔄 Publisher–Subscriber Pattern

The project uses a **Publisher–Subscriber (Pub/Sub)** pattern to manage events:

- Views **publish events** (e.g. button clicks, form submissions)
- Controller **subscribes to these events**
- Ensures:
  - Loose coupling between components
  - Better scalability
  - Cleaner separation of concerns

This pattern keeps event handling organized and avoids tightly coupled logic.

---

## 📊 Charts & Analytics

All charts are implemented using **ApexCharts** and are fully dynamic:

- Donut chart for category-wise spending
- Bar chart for monthly expense trends
- Line chart for category spending trends
- Horizontal bar chart for top expense categories
- Grouped bar chart for current vs previous month comparison

Each chart includes:
- Custom tooltips
- Currency formatting
- Responsive behavior
- Dynamic color handling

---

## 📱 Responsive Design Strategy

- Desktop: Sidebar + main content layout using CSS Grid
- Tablet: Adjusted spacing and chart sizing
- Mobile:
  - Sidebar becomes an overlay navigation
  - Transactions switch from table layout to cards
  - Long text handled using ellipsis without layout breakage
  - Horizontal scrolling issues carefully resolved

---

## 🧠 Key Learnings & Challenges

This project helped me gain hands-on experience with:

- Building scalable JavaScript apps without frameworks
- Applying MVC in real-world scenarios
- Managing shared state across views
- Implementing Pub/Sub for clean event handling
- Debugging complex CSS overflow and layout issues
- Designing responsive UIs for data-heavy screens
- Integrating third-party libraries in a modular way

---

## 🚀 Getting Started (Local Setup)

1. Clone the repository
   ```bash
   git clone https://github.com/abuzarkhan1998/BudgetPrep.git
