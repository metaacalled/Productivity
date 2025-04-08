// Goals Controller
import { Goal } from '../models/goal.js';

export class GoalsController {
    constructor(storageService, uiService) {
        this.storageService = storageService;
        this.uiService = uiService;
        this.goalsView = document.getElementById('goals-view');
    }
    
    init() {
        // Initialize the goals view
        this.setupGoalsView();
    }
    
    setupGoalsView() {
        // Create the goals view HTML structure
        this.goalsView.innerHTML = `
            <div class="row mb-4">
                <div class="col-md-8">
                    <div class="input-group">
                        <input type="text" class="form-control" id="goals-search" placeholder="Search goals...">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Filter
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" id="goals-filter-menu">
                            <li><a class="dropdown-item" href="#" data-filter="all">All Goals</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="active">In Progress</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="completed">Completed</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Categories</h6></li>
                            <div id="goal-category-filters"></div>
                        </ul>
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    <button class="btn btn-primary" id="new-goal-btn">
                        <i class="bi bi-plus-lg me-1"></i>New Goal
                    </button>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Goals</h5>
                            <span class="badge bg-primary" id="goals-count">0</span>
                        </div>
                        <div class="list-group list-group-flush" id="goals-list">
                            <div class="text-center text-muted py-3" id="goals-empty-message">No goals found</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card" id="goal-detail-card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Goal Details</h5>
                            <div>
                                <button class="btn btn-sm btn-outline-success me-1" id="complete-goal-btn">
                                    <i class="bi bi-check-lg"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" id="delete-goal-btn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="goal-detail-placeholder" class="text-center text-muted py-5">
                                <i class="bi bi-trophy display-4"></i>
                                <p class="mt-3">Select a goal to view details or create a new goal</p>
                            </div>
                            <div id="goal-detail-content" class="d-none">
                                <div class="mb-3">
                                    <input type="text" class="form-control form-control-lg" id="goal-title" placeholder="Goal Title">
                                </div>
                                <div class="mb-3">
                                    <label for="goal-description" class="form-label">Description</label>
                                    <textarea class="form-control" id="goal-description" rows="3" placeholder="Goal Description"></textarea>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="goal-target-date" class="form-label">Target Date</label>
                                        <input type="date" class="form-control" id="goal-target-date">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="goal-category" class="form-label">Category</label>
                                        <input type="text" class="form-control" id="goal-category" list="goal-categories" placeholder="Category">
                                        <datalist id="goal-categories"></datalist>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="goal-recurring" class="form-label">Recurring</label>
                                    <select class="form-select" id="goal-recurring">
                                        <option value="">Not recurring</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Progress</label>
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1 me-2">
                                            <div class="progress" style="height: 10px;">
                                                <div class="progress-bar" id="goal-progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                                            </div>
                                        </div>
                                        <div>
                                            <input type="number" class="form-control" id="goal-progress" min="0" max="100" style="width: 80px;">
                                        </div>
                                        <div class="ms-1">%</div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Milestones</label>
                                    <div id="milestones-container" class="mb-2"></div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="new-milestone" placeholder="Add a milestone">
                                        <button class="btn btn-outline-secondary" id="add-milestone-btn">Add</button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <label class="form-label">Streak</label>
                                        <span class="badge bg-primary" id="streak-count">0 days</span>
                                    </div>
                                    <div class="streak-calendar" id="streak-calendar">
                                        <!-- Streak calendar will be dynamically generated -->
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted" id="goal-last-updated"></small>
                                    <button class="btn btn-primary" id="save-goal-btn">Save Goal</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.addEventListeners();
    }
    
    addEventListeners() {
        // New goal button
        const newGoalBtn = document.getElementById('new-goal-btn');
        if (newGoalBtn) {
            newGoalBtn.addEventListener('click', () => this.createNewGoal());
        }
        
        // Save goal button
        const saveGoalBtn = document.getElementById('save-goal-btn');
        if (saveGoalBtn) {
            saveGoalBtn.addEventListener('click', () => this.saveCurrentGoal());
        }
        
        // Complete goal button
        const completeGoalBtn = document.getElementById('complete-goal-btn');
        if (completeGoalBtn) {
            completeGoalBtn.addEventListener('click', () => this.toggleCompleteCurrentGoal());
        }
        
        // Delete goal button
        const deleteGoalBtn = document.getElementById('delete-goal-btn');
        if (deleteGoalBtn) {
            deleteGoalBtn.addEventListener('click', () => this.deleteCurrentGoal());
        }
        
        // Add milestone button
        const addMilestoneBtn = document.getElementById('add-milestone-btn');
        if (addMilestoneBtn) {
            addMilestoneBtn.addEventListener('click', () => this.addMilestoneToCurrentGoal());
        }
        
        // Progress input
        const goalProgress = document.getElementById('goal-progress');
        if (goalProgress) {
            goalProgress.addEventListener('input', () => this.updateProgressBar());
        }
        
        // Search input
        const searchInput = document.getElementById('goals-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.searchGoals(searchInput.value));
        }
        
        // Filter menu
        const filterMenu = document.getElementById('goals-filter-menu');
        if (filterMenu) {
            filterMenu.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-filter')) {
                    const filter = e.target.getAttribute('data-filter');
                    this.filterGoals(filter);
                } else if (e.target.hasAttribute('data-filter-category')) {
                    const category = e.target.getAttribute('data-filter-category');
                    this.filterGoalsByCategory(category);
                }
            });
        }
    }
    
    refreshView() {
        this.loadGoals();
        this.updateCategoryFilters();
        this.updateGoalCategories();
    }
    
    loadGoals() {
        const goals = this.storageService.getGoals();
        const goalsList = document.getElementById('goals-list');
        const goalsCount = document.getElementById('goals-count');
        const goalsEmptyMessage = document.getElementById('goals-empty-message');
        
        // Update goals count
        if (goalsCount) {
            goalsCount.textContent = goals.length;
        }
        
        // Clear current list
        if (goalsList) {
            goalsList.innerHTML = '';
            
            if (goals.length === 0) {
                if (goalsEmptyMessage) {
                    goalsEmptyMessage.classList.remove('d-none');
                }
            } else {
                if (goalsEmptyMessage) {
                    goalsEmptyMessage.classList.add('d-none');
                }
                
                // Sort goals by target date (closest first) and then by progress
                const sortedGoals = [...goals].sort((a, b) => {
                    // First sort by completion status
                    if (a.completed && !b.completed) return 1;
                    if (!a.completed && b.completed) return -1;
                    
                    // Then sort by target date
                    if (a.targetDate && b.targetDate) {
                        return new Date(a.targetDate) - new Date(b.targetDate);
                    }
                    if (a.targetDate && !b.targetDate) return -1;
                    if (!a.targetDate && b.targetDate) return 1;
                    
                    // Then sort by progress (higher progress first)
                    return b.progress - a.progress;
                });
                
                // Add goals to list
                sortedGoals.forEach(goal => {
                    const goalItem = document.createElement('a');
                    goalItem.href = '#';
                    goalItem.className = `list-group-item list-group-item-action goal-item ${goal.completed ? 'completed' : ''}`;
                    goalItem.setAttribute('data-goal-id', goal.id);
                    
                    // Check if goal is overdue
                    let overdueClass = '';
                    let overdueLabel = '';
                    if (goal.targetDate && !goal.completed) {
                        const targetDate = new Date(goal.targetDate);
                        const now = new Date();
                        if (targetDate < now) {
                            overdueClass = 'text-danger';
                            overdueLabel = '<span class="badge bg-danger ms-1">Overdue</span>';
                        }
                    }
                    
                    // Format target date
                    const targetDateText = goal.targetDate 
                        ? `<div class="small ${overdueClass}">Target: ${this.uiService.formatDate(goal.targetDate)}</div>` 
                        : '';
                    
                    // Create progress bar
                    const progressBar = this.uiService.createProgressBar(goal.progress);
                    
                    goalItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h6 class="mb-1 ${goal.completed ? 'text-decoration-line-through' : ''}">${goal.title}</h6>
                                <div class="d-flex align-items-center">
                                    <span class="badge bg-secondary">${goal.category || 'General'}</span>
                                    ${overdueLabel}
                                    ${goal.recurring ? `<span class="badge bg-info ms-1">${this.capitalizeFirstLetter(goal.recurring)}</span>` : ''}
                                </div>
                                ${targetDateText}
                                <div class="mt-2">${progressBar}</div>
                            </div>
                            ${goal.streakCount > 0 ? `<span class="badge bg-primary">${goal.streakCount} day streak</span>` : ''}
                        </div>
                    `;
                    
                    goalItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.selectGoal(goal.id);
                    });
                    
                    goalsList.appendChild(goalItem);
                });
            }
        }
    }
    
    updateCategoryFilters() {
        const goals = this.storageService.getGoals();
        const categoryFiltersContainer = document.getElementById('goal-category-filters');
        
        if (categoryFiltersContainer) {
            // Get all unique categories
            const allCategories = new Set();
            goals.forEach(goal => {
                if (goal.category) {
                    allCategories.add(goal.category);
                }
            });
            
            // Clear current filters
            categoryFiltersContainer.innerHTML = '';
            
            // Add category filters
            if (allCategories.size === 0) {
                categoryFiltersContainer.innerHTML = '<li><a class="dropdown-item disabled" href="#">No categories found</a></li>';
            } else {
                Array.from(allCategories).sort().forEach(category => {
                    const categoryItem = document.createElement('li');
                    categoryItem.innerHTML = `<a class="dropdown-item" href="#" data-filter-category="${category}">${category}</a>`;
                    categoryFiltersContainer.appendChild(categoryItem);
                });
            }
        }
    }
    
    updateGoalCategories() {
        const goals = this.storageService.getGoals();
        const goalCategoriesDatalist = document.getElementById('goal-categories');
        
        if (goalCategoriesDatalist) {
            // Get all unique categories
            const allCategories = new Set();
            goals.forEach(goal => {
                if (goal.category) {
                    allCategories.add(goal.category);
                }
            });
            
            // Clear current options
            goalCategoriesDatalist.innerHTML = '';
            
            // Add category options
            Array.from(allCategories).sort().forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                goalCategoriesDatalist.appendChild(option);
            });
        }
    }
    
    createNewGoal() {
        // Create a new goal
        const newGoal = new Goal();
        
        // Add to storage
        this.storageService.addGoal(newGoal);
        
        // Refresh goals list
        this.refreshView();
        
        // Select the new goal
        this.selectGoal(newGoal.id);
        
        // Show success message
        this.uiService.showToast('New goal created', 'success');
    }
    
    selectGoal(goalId) {
        // Get goal from storage
        const goals = this.storageService.getGoals();
        const goal = goals.find(g => g.id === goalId);
        
        if (!goal) return;
        
        // Update UI to show selected goal
        const goalDetailPlaceholder = document.getElementById('goal-detail-placeholder');
        const goalDetailContent = document.getElementById('goal-detail-content');
        const goalTitle = document.getElementById('goal-title');
        const goalDescription = document.getElementById('goal-description');
        const goalTargetDate = document.getElementById('goal-target-date');
        const goalCategory = document.getElementById('goal-category');
        const goalRecurring = document.getElementById('goal-recurring');
        const goalProgress = document.getElementById('goal-progress');
        const goalProgressBar = document.getElementById('goal-progress-bar');
        const milestonesContainer = document.getElementById('milestones-container');
        const streakCount = document.getElementById('streak-count');
        const streakCalendar = document.getElementById('streak-calendar');
        const goalLastUpdated = document.getElementById('goal-last-updated');
        const completeGoalBtn = document.getElementById('complete-goal-btn');
        
        // Update goal list selection
        const goalItems = document.querySelectorAll('.goal-item');
        goalItems.forEach(item => {
            if (item.getAttribute('data-goal-id') === goalId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show goal details
        if (goalDetailPlaceholder) goalDetailPlaceholder.classList.add('d-none');
        if (goalDetailContent) goalDetailContent.classList.remove('d-none');
        
        // Set goal data
        if (goalTitle) goalTitle.value = goal.title;
        if (goalDescription) goalDescription.value = goal.description || '';
        
        // Format target date for date input
        if (goalTargetDate) {
            if (goal.targetDate) {
                const targetDate = new Date(goal.targetDate);
                const year = targetDate.getFullYear();
                const month = String(targetDate.getMonth() + 1).padStart(2, '0');
                const day = String(targetDate.getDate()).padStart(2, '0');
                
                goalTargetDate.value = `${year}-${month}-${day}`;
            } else {
                goalTargetDate.value = '';
            }
        }
        
        if (goalCategory) goalCategory.value = goal.category || '';
        if (goalRecurring) goalRecurring.value = goal.recurring || '';
        
        // Set progress
        if (goalProgress) goalProgress.value = goal.progress;
        if (goalProgressBar) {
            goalProgressBar.style.width = `${goal.progress}%`;
            goalProgressBar.setAttribute('aria-valuenow', goal.progress);
            goalProgressBar.textContent = `${goal.progress}%`;
        }
        
        // Set complete button text
        if (completeGoalBtn) {
            if (goal.completed) {
                completeGoalBtn.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
                completeGoalBtn.title = 'Mark as Incomplete';
            } else {
                completeGoalBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
                completeGoalBtn.title = 'Mark as Complete';
            }
        }
        
        // Set milestones
        if (milestonesContainer) {
            milestonesContainer.innerHTML = '';
            
            if (goal.milestones && goal.milestones.length > 0) {
                goal.milestones.forEach(milestone => {
                    const milestoneElement = document.createElement('div');
                    milestoneElement.className = 'form-check mb-2';
                    milestoneElement.innerHTML = `
                        <input class="form-check-input milestone-checkbox" type="checkbox" id="milestone-${milestone.id}" ${milestone.completed ? 'checked' : ''}>
                        <label class="form-check-label ${milestone.completed ? 'text-decoration-line-through' : ''}" for="milestone-${milestone.id}">
                            ${milestone.title}
                        </label>
                        <button type="button" class="btn-close btn-close-sm float-end" aria-label="Remove milestone"></button>
                    `;
                    
                    // Add event listener to checkbox
                    const checkbox = milestoneElement.querySelector('.milestone-checkbox');
                    checkbox.addEventListener('change', () => {
                        this.toggleMilestoneCompletion(goalId, milestone.id);
                    });
                    
                    // Add event listener to remove button
                    const removeBtn = milestoneElement.querySelector('.btn-close');
                    removeBtn.addEventListener('click', () => {
                        this.removeMilestone(goalId, milestone.id);
                    });
                    
                    milestonesContainer.appendChild(milestoneElement);
                });
            } else {
                milestonesContainer.innerHTML = '<p class="text-muted small">No milestones added yet</p>';
            }
        }
        
        // Set streak count
        if (streakCount) {
            streakCount.textContent = `${goal.streakCount || 0} day${goal.streakCount !== 1 ? 's' : ''}`;
        }
        
        // Set streak calendar
        if (streakCalendar) {
            this.renderStreakCalendar(streakCalendar, goal);
        }
        
        // Set last updated
        if (goalLastUpdated) {
            goalLastUpdated.textContent = `Last updated: ${this.uiService.formatDate(goal.updated, 'datetime')}`;
        }
        
        // Store current goal ID in the form
        goalDetailContent.setAttribute('data-goal-id', goalId);
    }
    
    saveCurrentGoal() {
        const goalDetailContent = document.getElementById('goal-detail-content');
        const goalId = goalDetailContent.getAttribute('data-goal-id');
        
        if (!goalId) return;
        
        // Get goal data from form
        const goalTitle = document.getElementById('goal-title').value;
        const goalDescription = document.getElementById('goal-description').value;
        const goalTargetDate = document.getElementById('goal-target-date').value;
        const goalCategory = document.getElementById('goal-category').value;
        const goalRecurring = document.getElementById('goal-recurring').value;
        const goalProgress = document.getElementById('goal-progress').value;
        
        // Get goal from storage
        const goals = this.storageService.getGoals();
        const goalIndex = goals.findIndex(g => g.id === goalId);
        
        if (goalIndex === -1) return;
        
        // Update goal
        const updatedGoal = new Goal(goals[goalIndex]);
        updatedGoal.update({
            title: goalTitle,
            description: goalDescription,
            targetDate: goalTargetDate ? new Date(goalTargetDate).toISOString() : null,
            category: goalCategory,
            recurring: goalRecurring || null,
            progress: parseInt(goalProgress) || 0
        });
        
        // Save to storage
        this.storageService.updateGoal(updatedGoal);
        
        // Refresh goals list
        this.refreshView();
        
        // Re-select the goal
        this.selectGoal(goalId);
        
        // Show success message
        this.uiService.showToast('Goal saved successfully', 'success');
    }
    
    toggleCompleteCurrentGoal() {
        const goalDetailContent = document.getElementById('goal-detail-content');
        const goalId = goalDetailContent.getAttribute('data-goal-id');
        
        if (!goalId) return;
        
        // Get goal from storage
        const goals = this.storageService.getGoals();
        const goalIndex = goals.findIndex(g => g.id === goalId);
        
        if (goalIndex === -1) return;
        
        // Toggle completion status
        const updatedGoal = new Goal(goals[goalIndex]);
        
        if (updatedGoal.completed) {
            updatedGoal.uncomplete();
        } else {
            updatedGoal.complete();
        }
        
        // Save to storage
        this.storageService.updateGoal(updatedGoal);
        
        // Refresh goals list
        this.refreshView();
        
        // Re-select the goal
        this.selectGoal(goalId);
        
        // Show success message
        const action = updatedGoal.completed ? 'completed' : 'marked as incomplete';
        this.uiService.showToast(`Goal ${action} successfully`, 'success');
    }
    
    deleteCurrentGoal() {
        const goalDetailContent = document.getElementById('goal-detail-content');
        const goalId = goalDetailContent.getAttribute('data-goal-id');
        
        if (!goalId) return;
        
        // Confirm deletion
        this.uiService.confirmDialog('Are you sure you want to delete this goal? This action cannot be undone.', () => {
            // Delete goal
            this.storageService.deleteGoal(goalId);
            
            // Refresh goals list
            this.refreshView();
            
            // Reset goal detail view
            const goalDetailPlaceholder = document.getElementById('goal-detail-placeholder');
            if (goalDetailPlaceholder) goalDetailPlaceholder.classList.remove('d-none');
            
            if (goalDetailContent) {
                goalDetailContent.classList.add('d-none');
                goalDetailContent.removeAttribute('data-goal-id');
            }
            
            // Show success message
            this.uiService.showToast('Goal deleted successfully', 'success');
        });
    }
    
    addMilestoneToCurrentGoal() {
        const goalDetailContent = document.getElementById('goal-detail-content');
        const goalId = goalDetailContent.getAttribute('data-goal-id');
        const newMilestoneInput = document.getElementById('new-milestone');
        
        if (!goalId || !newMilestoneInput) return;
        
        // Get milestone title
        const milestoneTitle = newMilestoneInput.value.trim();
        if (!milestoneTitle) return;
        
        // Get goal from storage
        const goals = this.storageService.getGoals();
        const goalIndex = goals.findIndex(g => g.id === goalId);
        
        if (goalIndex === -1) return;
        
        // Add milestone
        const updatedGoal = new Goal(goals[goalIndex]);
        updatedGoal.addMilestone(milestoneTitle);
        
        // Save to storage
        this.storageService.updateGoal(updatedGoal);
        
        // Clear input
        newMilestoneInput.value = '';
        
        // Refresh goal view
        this.selectGoal(goalId);
    }
    
    toggleMilestoneCompletion(goalId, milestoneId) {
        // Get goal from storage
        const goals = this.storageService.getGoals();
        const goalIndex = goals.findIndex(g => g.id === goalId);
        
        if (goalIndex === -1) return;
        
        // Find milestone
        const goal = goals[goalIndex];
        const milestoneIndex = goal.milestones.findIndex(m => m.id === milestoneId);
        
        if (milestoneIndex === -1) return;
        
        // Toggle completion status
        const updatedGoal = new Goal(goal);
        updatedGoal.updateMilestone(milestoneId, {
            completed: !goal.milestones[milestoneIndex].completed
        });
        
        // Save to storage
        this.storageService.updateGoal(updatedGoal);
        
        // Update UI
        const checkbox = document.getElementById(`milestone-${milestoneId}`);
        const label = checkbox.nextElementSibling;
        
        if (checkbox.checked) {
            label.classList.add('text-decoration-line-through');
        } else {
            label.classList.remove('text-decoration-line-through');
        }
        
        // Update progress
        const goalProgress = document.getElementById('goal-progress');
        const goalProgressBar = document.getElementById('goal-progress-bar');
        
        if (goalProgress && goalProgressBar) {
            goalProgress.value = updatedGoal.progress;
            goalProgressBar.style.width = `${updatedGoal.progress}%`;
            goalProgressBar.setAttribute('aria-valuenow', updatedGoal.progress);
            goalProgressBar.textContent = `${updatedGoal.progress}%`;
        }
    }
    
    removeMilestone(goalId, milestoneId) {
        // Get goal from storage
        const goals = this.storageService.getGoals();
        const goalIndex = goals.findIndex(g => g.id === goalId);
        
        if (goalIndex === -1) return;
        
        // Remove milestone
        const updatedGoal = new Goal(goals[goalIndex]);
        updatedGoal.removeMilestone(milestoneId);
        
        // Save to storage
        this.storageService.updateGoal(updatedGoal);
        
        // Refresh goal view
        this.selectGoal(goalId);
    }
    
    updateProgressBar() {
        const goalProgress = document.getElementById('goal-progress');
        const goalProgressBar = document.getElementById('goal-progress-bar');
        
        if (goalProgress && goalProgressBar) {
            const progress = parseInt(goalProgress.value) || 0;
            goalProgressBar.style.width = `${progress}%`;
            goalProgressBar.setAttribute('aria-valuenow', progress);
            goalProgressBar.textContent = `${progress}%`;
        }
    }
    
    renderStreakCalendar(container, goal) {
        // Clear container
        container.innerHTML = '';
        
        // If no streak, show message
        if (!goal.streakCount || goal.streakCount === 0) {
            container.innerHTML = '<p class="text-muted small">No streak yet. Start completing your goal regularly!</p>';
            return;
        }
        
        // Create streak calendar
        const today = new Date();
        const calendarHTML = `
            <div class="streak-calendar-grid">
        `;
        
        // Add streak days
        let streakHTML = '';
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
            
            // Check if this day is part of the streak
            const isStreakDay = i < goal.streakCount;
            const streakClass = isStreakDay ? 'streak-day' : '';
            
            streakHTML = `
                <div class="streak-day ${streakClass}" title="${dateStr}">
                    <div class="streak-day-name">${dayName}</div>
                    <div class="streak-day-indicator">
                        ${isStreakDay ? '<i class="bi bi-check-circle-fill"></i>' : '<i class="bi bi-circle"></i>'}
                    </div>
                </div>
            ` + streakHTML; // Prepend to show most recent day on the right
        }
        
        container.innerHTML = calendarHTML + streakHTML + '</div>';
    }
    
    searchGoals(query) {
        if (!query) {
            // If query is empty, show all goals
            this.loadGoals();
            return;
        }
        
        // Get all goals
        const goals = this.storageService.getGoals();
        
        // Filter goals by query
        const filteredGoals = goals.filter(goal => {
            const titleMatch = goal.title.toLowerCase().includes(query.toLowerCase());
            const descriptionMatch = goal.description && goal.description.toLowerCase().includes(query.toLowerCase());
            const categoryMatch = goal.category && goal.category.toLowerCase().includes(query.toLowerCase());
            
            return titleMatch || descriptionMatch || categoryMatch;
        });
        
        // Update goals list with filtered goals
        this.displayFilteredGoals(filteredGoals);
    }
    
    filterGoals(filter) {
        // Get all goals
        const goals = this.storageService.getGoals();
        
        // Filter goals based on selected filter
        let filteredGoals = [];
        
        switch (filter) {
            case 'all':
                filteredGoals = goals;
                break;
            case 'active':
                filteredGoals = goals.filter(goal => !goal.completed);
                break;
            case 'completed':
                filteredGoals = goals.filter(goal => goal.completed);
                break;
            default:
                filteredGoals = goals;
        }
        
        // Update goals list with filtered goals
        this.displayFilteredGoals(filteredGoals);
    }
    
    filterGoalsByCategory(category) {
        // Get all goals
        const goals = this.storageService.getGoals();
        
        // Filter goals by category
        const filteredGoals = goals.filter(goal => goal.category === category);
        
        // Update goals list with filtered goals
        this.displayFilteredGoals(filteredGoals);
    }
    
    displayFilteredGoals(filteredGoals) {
        const goalsList = document.getElementById('goals-list');
        const goalsEmptyMessage = document.getElementById('goals-empty-message');
        
        // Clear current list
        if (goalsList) {
            goalsList.innerHTML = '';
            
            if (filteredGoals.length === 0) {
                if (goalsEmptyMessage) {
                    goalsEmptyMessage.classList.remove('d-none');
                    goalsEmptyMessage.textContent = 'No goals match your search';
                }
            } else {
                if (goalsEmptyMessage) {
                    goalsEmptyMessage.classList.add('d-none');
                }
                
                // Sort goals by target date (closest first) and then by progress
                const sortedGoals = [...filteredGoals].sort((a, b) => {
                    // First sort by completion status
                    if (a.completed && !b.completed) return 1;
                    if (!a.completed && b.completed) return -1;
                    
                    // Then sort by target date
                    if (a.targetDate && b.targetDate) {
                        return new Date(a.targetDate) - new Date(b.targetDate);
                    }
                    if (a.targetDate && !b.targetDate) return -1;
                    if (!a.targetDate && b.targetDate) return 1;
                    
                    // Then sort by progress (higher progress first)
                    return b.progress - a.progress;
                });
                
                // Add goals to list
                sortedGoals.forEach(goal => {
                    const goalItem = document.createElement('a');
                    goalItem.href = '#';
                    goalItem.className = `list-group-item list-group-item-action goal-item ${goal.completed ? 'completed' : ''}`;
                    goalItem.setAttribute('data-goal-id', goal.id);
                    
                    // Check if goal is overdue
                    let overdueClass = '';
                    let overdueLabel = '';
                    if (goal.targetDate && !goal.completed) {
                        const targetDate = new Date(goal.targetDate);
                        const now = new Date();
                        if (targetDate < now) {
                            overdueClass = 'text-danger';
                            overdueLabel = '<span class="badge bg-danger ms-1">Overdue</span>';
                        }
                    }
                    
                    // Format target date
                    const targetDateText = goal.targetDate 
                        ? `<div class="small ${overdueClass}">Target: ${this.uiService.formatDate(goal.targetDate)}</div>` 
                        : '';
                    
                    // Create progress bar
                    const progressBar = this.uiService.createProgressBar(goal.progress);
                    
                    goalItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h6 class="mb-1 ${goal.completed ? 'text-decoration-line-through' : ''}">${goal.title}</h6>
                                <div class="d-flex align-items-center">
                                    <span class="badge bg-secondary">${goal.category || 'General'}</span>
                                    ${overdueLabel}
                                    ${goal.recurring ? `<span class="badge bg-info ms-1">${this.capitalizeFirstLetter(goal.recurring)}</span>` : ''}
                                </div>
                                ${targetDateText}
                                <div class="mt-2">${progressBar}</div>
                            </div>
                            ${goal.streakCount > 0 ? `<span class="badge bg-primary">${goal.streakCount} day streak</span>` : ''}
                        </div>
                    `;
                    
                    goalItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.selectGoal(goal.id);
                    });
                    
                    goalsList.appendChild(goalItem);
                });
            }
        }
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
