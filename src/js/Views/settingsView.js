class settingsView {

    _parentContainer = document.querySelector('main');
    _tabContainer;


    renderView(){
        // console.log(this._parentContainer);
        this._parentContainer.textContent = "";
        this._parentContainer.insertAdjacentHTML('afterbegin',this._returnMarkup());
        this._tabContainer = document.querySelector('.settings-parent-div');
    }

    navigateTabs(){
        this._tabContainer.addEventListener('click',function(e){
            // console.log(e);
            const selectedTab = e.target.closest('.settings-tab');
            if(!selectedTab) return;
            document.querySelectorAll('.settings-tab').forEach(tab=>tab.classList.remove('active'));
            // console.log(selectedTab);
            selectedTab.classList.add('active');
        })
    }

    _returnMarkup(){
        return `<section class="main-section section-settings">
            <div class="dashboard-content">
                <div class="dashboard-container">
                    <div class="dashboard-heading-container">
                        <h2 class="heading-secondary">Settings</h2>
                        <p class="heading-desc">Personalize your expense tracker. Set your monthly budget and manage
                            your custom categories.</p>
                    </div>
                </div>
            </div>

            <div class="container settings-tab-container mb-md-1">
                <div class="settings-parent-div">
                    <span class="settings-tab active">Profile</span>
                    <span class="settings-tab">Budget</span>
                    <span class="settings-tab">Categories</span>
                </div>
            </div>

            <div class="container settings-profile-container">
                <div class="profile-header-container mb-md-2">
                    <p class="profile-header">Profile</p>
                    <p class="profile-header-desc">Update your personal details here.</p>
                </div>
                <div>
                    <form id="settings-profile-form" class="profile-settings-form">
                        <div class="settings-field-container">
                            <span class="settings-form-label">Name *</span>
                            <div class="settings-profile-name-container">
                                <input type="text" id="settings-first-name" class="settings-profile-input" />
                                <input type="text" id="settings-last-name" class="settings-profile-input" />
                            </div>
                        </div>
                        <div class="settings-field-container">
                            <span class="settings-form-label">Country *</span>
                            <select id="settings-country" class="settings-profile-input">
                                <option>USA</option>
                                <option>India</option>
                                <option>India</option>
                                <option>India</option>
                                <option>India</option>
                                <option>India</option>
                            </select>
                        </div>
                        <div class="settings-field-container">
                            <span class="settings-form-label">Currency</span>
                            <span class="settings-currency">$</span>
                        </div>
                        <div class="settings-field-container">
                            <span class="settings-form-label"></span>
                            <div class="profile-settings-button-container">
                                <button class="btn btn-primary settings-profile-btn">Save Changes</button>
                                <button class="btn btn-primary settings-profile-btn">Clear All Data</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="container settings-budget-container hidden">
                <div class="profile-header-container mb-md-2">
                    <p class="profile-header">Budget</p>
                    <p class="profile-header-desc">Define your monthly budget and monitor your spending.</p>
                </div>
                <div>
                    <form id="settings-budget-form">
                        <div class="settings-field-container">
                            <span class="settings-form-label">Monthly Budget *</span>
                            <div class="settings-budget-input-container">
                                <label class="settings-budget-label">$</label>
                                <input type="text" id="settings-monthly-budget"
                                    class="settings-profile-input settings-budget-input" />
                            </div>
                        </div>
                        <div class="settings-field-container">
                            <span class="settings-form-label"></span>
                            <div class="profile-settings-button-container">
                                <button class="btn btn-primary settings-profile-btn">Save Budget</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="container settings-categories-container hidden">
                <div class="mb-md-4 setings-add-categories-container">
                    <div class="profile-header-container mb-md-2">
                        <p class="profile-header">Categories</p>
                        <p class="profile-header-desc">Add or edit categories for tracking your spending.</p>
                    </div>
                    <div>
                        <form id="settings-add-category-form">
                            <div class="settings-field-container">
                                <span class="settings-form-label">Category Name *</span>
                                <input type="text" id="settings-category-name" class="settings-profile-input" />
                            </div>
                            <div class="settings-field-container">
                                <span class="settings-form-label">Color *</span>
                                <div class="color-picker-container">
                                    <input type="color" list="categoryColors" id="colors" />
                                    <span id="color-code">#79B2D6</span>
                                    <datalist id="categoryColors">
                                        <option value="#E57373"></option>
                                        <option value="#FFB74D"></option>
                                        <option value="#FFD54F"></option>
                                        <option value="#81C784"></option>
                                        <option value="#4DB6AC"></option>
                                        <option value="#64B5F6"></option>
                                        <option value="#BA68C8"></option>
                                        <option value="#B0BEC5"></option>
                                    </datalist>
                                </div>
                            </div>
                            <div class="settings-field-container">
                                <span class="settings-form-label"></span>
                                <div class="profile-settings-button-container">
                                    <button class="btn btn-primary settings-profile-btn">Add Category</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="settings-edit-category-container">
                    <p class="profile-header mb-md-1">Your Categories</p>
                    <div class="settings-categories-lists-container">
                        <ul class="settings-categories-lists">
                            <li class="settings-categories-lists-item trans-table-button-col">
                                <div class="category-list-name-container">
                                    <span class="categories-list-color"></span>
                                    <span class="categories-list-name">Food</span>
                                </div>
                                <div>
                                    <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                    <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                                </div>
                            </li>
                            <li class="settings-categories-lists-item trans-table-button-col">
                                <div class="category-list-name-container">
                                    <span class="categories-list-color"></span>
                                    <span class="categories-list-name">Food</span>
                                </div>
                                <div>
                                    <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                    <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                                </div>
                            </li>
                            <li class="settings-categories-lists-item trans-table-button-col">
                                <div class="category-list-name-container">
                                    <span class="categories-list-color"></span>
                                    <span class="categories-list-name">Food</span>
                                </div>
                                <div>
                                    <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                    <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                                </div>
                            </li>
                            <li class="settings-categories-lists-item trans-table-button-col">
                                <div class="category-list-name-container">
                                    <span class="categories-list-color"></span>
                                    <span class="categories-list-name">Food</span>
                                </div>
                                <div>
                                    <button class="btn edit-btn"><i data-lucide="square-pen"></i></button>
                                    <button class="btn delete-btn"><i data-lucide="trash-2"></i></button>
                                </div>
                            </li>
                            <li class="settings-categories-lists-item categories-edit-list-field">
                                <div class="category-list-name-container">
                                    <div class="color-picker-container">
                                        <input type="color" list="categoryColors" id="colors" />
                                        <span id="color-code">#79B2D6</span>
                                        <datalist id="categoryColors">
                                            <option value="#E57373"></option>
                                            <option value="#FFB74D"></option>
                                            <option value="#FFD54F"></option>
                                            <option value="#81C784"></option>
                                            <option value="#4DB6AC"></option>
                                            <option value="#64B5F6"></option>
                                            <option value="#BA68C8"></option>
                                            <option value="#B0BEC5"></option>
                                        </datalist>
                                    </div>
                                    <input type="text" id="settings-category-edit-name" class="settings-profile-input" />
                                </div>
                                <div class="category-edit-btn-container">
                                    <button class="btn edit-category-save-btn"><i data-lucide="check"></i></button>
                                    <button class="btn edit-category-cancel-btn"><i data-lucide="x"></i></button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>`;
    }
}

export default new settingsView();