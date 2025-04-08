// Tasks Controller
import { Task } from '../models/task.js';

export class TasksController {
    constructor(storageService, uiService) {
        this.storageService = storageService;
        this.uiService = uiService;
        this.tasksView = document.getElementById('tasks-view');
    }
    
    init() {
        // Initialize the tasks view
        this.setupTasksView();
    }
    
    setupTasksView() {
        // Create the tasks view HTML structure
        this.tasksView.innerHTML = `
            <div class="row mb-4">
                <div class="col-md-8">
                    <div class="input-group">
                        <input type="text" class="form-control" id="tasks-search" placeholder="Search tasks...">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Filter
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" id="tasks-filter-menu">
                            <li><a class="dropdown-item" href="#" data-filter="all">All Tasks</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="active">Active Tasks</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="completed">Completed Tasks</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="overdue">Overdue Tasks</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Priority</h6></li>
                            <li><a class="dropdown-item" href="#" data-filter-priority="high">High Priority</a></li>
                            <li><a class="dropdown-item" href="#" data-filter-priority="medium">Medium Priority</a></li>
                            <li><a class="dropdown-item" href="#" data-filter-priority="low">Low Priority</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Categories</h6></li>
                            <div id="category-filters"></div>
                        </ul>
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    <button class="btn btn-primary" id="new-task-btn">
                        <i class="bi bi-plus-lg me-1"></i>New Task
                    </button>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Tasks</h5>
                            <span class="badge bg-primary" id="tasks-count">0</span>
                        </div>
                        <div class="list-group list-group-flush" id="tasks-list">
                            <div class="text-center text-muted py-3" id="tasks-empty-message">No tasks found</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card" id="task-detail-card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Task Details</h5>
                            <div>
                                <button class="btn btn-sm btn-outline-success me-1" id="complete-task-btn">
                                    <i class="bi bi-check-lg"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" id="delete-task-btn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="task-detail-placeholder" class="text-center text-muted py-5">
                                <i class="bi bi-check2-square display-4"></i>
                                <p class="mt-3">Select a task to view details or create a new task</p>
                            </div>
                            <div id="task-detail-content" class="d-none">
                                <div class="mb-3">
                                    <input type="text" class="form-control form-control-lg" id="task-title" placeholder="Task Title">
                                </div>
                                <div class="mb-3">
                                    <label for="task-description" class="form-label">Description</label>
                                    <textarea class="form-control" id="task-description" rows="3" placeholder="Task Description"></textarea>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="task-due-date" class="form-label">Due Date</label>
                                        <input type="datetime-local" class="form-control" id="task-due-date">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="task-priority" class="form-label">Priority</label>
                                        <select class="form-select" id="task-priority">
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="task-category" class="form-label">Category</label>
                                        <input type="text" class="form-control" id="task-category" list="task-categories" placeholder="Category">
                                        <datalist id="task-categories"></datalist>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="task-status" class="form-label">Status</label>
                                        <select class="form-select" id="task-status">
                                            <option value="not-started">Not Started</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Subtasks</label>
                                    <div id="subtasks-container" class="mb-2"></div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="new-subtask" placeholder="Add a subtask">
                                        <button class="btn btn-outline-secondary" id="add-subtask-btn">Add</button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Linked Notes</label>
                                    <div id="linked-notes-container" class="mb-2"></div>
                                    <button class="btn btn-sm btn-outline-primary" id="link-note-btn">
                                        <i class="bi bi-link me-1"></i>Link a Note
                                    </button>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted" id="task-last-updated"></small>
                                    <button class="btn btn-primary" id="save-task-btn">Save Task</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal for linking notes -->
            <div class="modal fade" id="link-note-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Link a Note</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="link-note-search" placeholder="Search notes...">
                            </div>
                            <div class="list-group" id="link-note-list"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.addEventListeners();
    }
    
    addEventListeners() {
        // New task button
        const newTaskBtn = document.getElementById('new-task-btn');
        if (newTaskBtn) {
            newTaskBtn.addEventListener('click', () => this.createNewTask());
        }
        
        // Save task button
        const saveTaskBtn = document.getElementById('save-task-btn');
        if (saveTaskBtn) {
            saveTaskBtn.addEventListener('click', () => this.saveCurrentTask());
        }
        
        // Complete task button
        const completeTaskBtn = document.getElementById('complete-task-btn');
        if (completeTaskBtn) {
            completeTaskBtn.addEventListener('click', () => this.toggleCompleteCurrentTask());
        }
        
        // Delete task button
        const deleteTaskBtn = document.getElementById('delete-task-btn');
        if (deleteTaskBtn) {
            deleteTaskBtn.addEventListener('click', () => this.deleteCurrentTask());
        }
        
        // Add subtask button
        const addSubtaskBtn = document.getElementById('add-subtask-btn');
        if (addSubtaskBtn) {
            addSubtaskBtn.addEventListener('click', () => this.addSubtaskToCurrentTask());
        }
        
        // Link note button
        const linkNoteBtn = document.getElementById('link-note-btn');
        if (linkNoteBtn) {
            linkNoteBtn.addEventListener('click', () => this.showLinkNoteModal());
        }
        
        // Search input
        const searchInput = document.getElementById('tasks-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.searchTasks(searchInput.value));
        }
        
        // Filter menu
        const filterMenu = document.getElementById('tasks-filter-menu');
        if (filterMenu) {
            filterMenu.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-filter')) {
                    const filter = e.target.getAttribute('data-filter');
                    this.filterTasks(filter);
                } else if (e.target.hasAttribute('data-filter-priority')) {
                    const priority = e.target.getAttribute('data-filter-priority');
                    this.filterTasksByPriority(priority);
                } else if (e.target.hasAttribute('data-filter-category')) {
                    const category = e.target.getAttribute('data-filter-category');
                    this.filterTasksByCategory(category);
                }
            });
        }
    }
    
    refreshView() {
        this.loadTasks();
        this.updateCategoryFilters();
        this.updateTaskCategories();
    }
    
    loadTasks() {
        const tasks = this.storageService.getTasks();
        const tasksList = document.getElementById('tasks-list');
        const tasksCount = document.getElementById('tasks-count');
        const tasksEmptyMessage = document.getElementById('tasks-empty-message');
        
        // Update tasks count
        if (tasksCount) {
            tasksCount.textContent = tasks.length;
        }
        
        // Clear current list
        if (tasksList) {
            tasksList.innerHTML = '';
            
            if (tasks.length === 0) {
                if (tasksEmptyMessage) {
                    tasksEmptyMessage.classList.remove('d-none');
                }
            } else {
                if (tasksEmptyMessage) {
                    tasksEmptyMessage.classList.add('d-none');
                }
                
                // Sort tasks by due date (closest first) and then by priority
                const sortedTasks = [...tasks].sort((a, b) => {
                    // First sort by completion status
                    if (a.completed && !b.completed) return 1;
                    if (!a.completed && b.completed) return -1;
                    
                    // Then sort by due date
                    if (a.dueDate && b.dueDate) {
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    }
                    if (a.dueDate && !b.dueDate) return -1;
                    if (!a.dueDate && b.dueDate) return 1;
                    
                    // Then sort by priority
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                });
                
                // Add tasks to list
                sortedTasks.forEach(task => {
                    const taskItem = document.createElement('a');
                    taskItem.href = '#';
                    taskItem.className = `list-group-item list-group-item-action task-item ${task.completed ? 'completed' : ''} ${task.priority}-priority`;
                    taskItem.setAttribute('data-task-id', task.id);
                    
                    // Check if task is overdue
                    let overdueClass = '';
                    let overdueLabel = '';
                    if (task.dueDate && !task.completed) {
                        const dueDate = new Date(task.dueDate);
                        const now = new Date();
                        if (dueDate < now) {
                            overdueClass = 'text-danger';
                            overdueLabel = '<span class="badge bg-danger ms-1">Overdue</span>';
                        }
                    }
                    
                    // Format due date
                    const dueDateText = task.dueDate 
                        ? `<div class="small ${overdueClass}">Due: ${this.uiService.formatDate(task.dueDate, 'datetime')}</div>` 
                        : '';
                    
                    // Calculate progress
                    const progress = task.getProgress ? task.getProgress() : this.calculateTaskProgress(task);
                    const progressBar = progress > 0 
                        ? `<div class="progress mt-1" style="height: 4px;"><div class="progress-bar" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="10
(Content truncated due to size limit. Use line ranges to read in chunks)