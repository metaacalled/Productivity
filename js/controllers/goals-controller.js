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
            goals.forEach(goa
(Content truncated due to size limit. Use line ranges to read in chunks)