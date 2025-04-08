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
                        ? `<div class="progress mt-1" style="height: 4px;"><div class="progress-bar" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div></div>` 
                        : '';
                    
                    taskItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1 ${task.completed ? 'text-decoration-line-through' : ''}">${task.title}</h6>
                                <div class="d-flex align-items-center">
                                    ${this.uiService.createPriorityBadge(task.priority)}
                                    <span class="badge bg-secondary ms-1">${task.category}</span>
                                    ${overdueLabel}
                                </div>
                                ${dueDateText}
                                ${progressBar}
                            </div>
                            <div class="form-check">
                                <input class="form-check-input task-complete-checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
                            </div>
                        </div>
                    `;
                    
                    // Add event listener to task item
                    taskItem.addEventListener('click', (e) => {
                        // Don't select task if checkbox was clicked
                        if (e.target.classList.contains('task-complete-checkbox')) {
                            e.preventDefault();
                            this.toggleTaskCompletion(task.id);
                            return;
                        }
                        
                        e.preventDefault();
                        this.selectTask(task.id);
                    });
                    
                    // Add event listener to checkbox
                    const checkbox = taskItem.querySelector('.task-complete-checkbox');
                    if (checkbox) {
                        checkbox.addEventListener('change', (e) => {
                            e.stopPropagation();
                            this.toggleTaskCompletion(task.id);
                        });
                    }
                    
                    tasksList.appendChild(taskItem);
                });
            }
        }
    }
    
    updateCategoryFilters() {
        const tasks = this.storageService.getTasks();
        const categoryFiltersContainer = document.getElementById('category-filters');
        
        if (categoryFiltersContainer) {
            // Get all unique categories
            const allCategories = new Set();
            tasks.forEach(task => {
                if (task.category) {
                    allCategories.add(task.category);
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
    
    updateTaskCategories() {
        const tasks = this.storageService.getTasks();
        const taskCategoriesDatalist = document.getElementById('task-categories');
        
        if (taskCategoriesDatalist) {
            // Get all unique categories
            const allCategories = new Set();
            tasks.forEach(task => {
                if (task.category) {
                    allCategories.add(task.category);
                }
            });
            
            // Clear current options
            taskCategoriesDatalist.innerHTML = '';
            
            // Add category options
            Array.from(allCategories).sort().forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                taskCategoriesDatalist.appendChild(option);
            });
        }
    }
    
    createNewTask() {
        // Create a new task
        const newTask = new Task();
        
        // Add to storage
        this.storageService.addTask(newTask);
        
        // Refresh tasks list
        this.refreshView();
        
        // Select the new task
        this.selectTask(newTask.id);
        
        // Show success message
        this.uiService.showToast('New task created', 'success');
    }
    
    selectTask(taskId) {
        // Get task from storage
        const tasks = this.storageService.getTasks();
        const task = tasks.find(t => t.id === taskId);
        
        if (!task) return;
        
        // Update UI to show selected task
        const taskDetailPlaceholder = document.getElementById('task-detail-placeholder');
        const taskDetailContent = document.getElementById('task-detail-content');
        const taskTitle = document.getElementById('task-title');
        const taskDescription = document.getElementById('task-description');
        const taskDueDate = document.getElementById('task-due-date');
        const taskPriority = document.getElementById('task-priority');
        const taskCategory = document.getElementById('task-category');
        const taskStatus = document.getElementById('task-status');
        const subtasksContainer = document.getElementById('subtasks-container');
        const linkedNotesContainer = document.getElementById('linked-notes-container');
        const taskLastUpdated = document.getElementById('task-last-updated');
        const completeTaskBtn = document.getElementById('complete-task-btn');
        
        // Update task list selection
        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            if (item.getAttribute('data-task-id') === taskId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show task details
        if (taskDetailPlaceholder) taskDetailPlaceholder.classList.add('d-none');
        if (taskDetailContent) taskDetailContent.classList.remove('d-none');
        
        // Set task data
        if (taskTitle) taskTitle.value = task.title;
        if (taskDescription) taskDescription.value = task.description || '';
        
        // Format due date for datetime-local input
        if (taskDueDate) {
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                const year = dueDate.getFullYear();
                const month = String(dueDate.getMonth() + 1).padStart(2, '0');
                const day = String(dueDate.getDate()).padStart(2, '0');
                const hours = String(dueDate.getHours()).padStart(2, '0');
                const minutes = String(dueDate.getMinutes()).padStart(2, '0');
                
                taskDueDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
            } else {
                taskDueDate.value = '';
            }
        }
        
        if (taskPriority) taskPriority.value = task.priority;
        if (taskCategory) taskCategory.value = task.category || '';
        if (taskStatus) taskStatus.value = task.status;
        
        // Set complete button text
        if (completeTaskBtn) {
            if (task.completed) {
                completeTaskBtn.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
                completeTaskBtn.title = 'Mark as Incomplete';
            } else {
                completeTaskBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
                completeTaskBtn.title = 'Mark as Complete';
            }
        }
        
        // Set subtasks
        if (subtasksContainer) {
            subtasksContainer.innerHTML = '';
            
            if (task.subtasks && task.subtasks.length > 0) {
                task.subtasks.forEach(subtask => {
                    const subtaskElement = document.createElement('div');
                    subtaskElement.className = 'form-check mb-2';
                    subtaskElement.innerHTML = `
                        <input class="form-check-input subtask-checkbox" type="checkbox" id="subtask-${subtask.id}" ${subtask.completed ? 'checked' : ''}>
                        <label class="form-check-label ${subtask.completed ? 'text-decoration-line-through' : ''}" for="subtask-${subtask.id}">
                            ${subtask.title}
                        </label>
                        <button type="button" class="btn-close btn-close-sm float-end" aria-label="Remove subtask"></button>
                    `;
                    
                    // Add event listener to checkbox
                    const checkbox = subtaskElement.querySelector('.subtask-checkbox');
                    checkbox.addEventListener('change', () => {
                        this.toggleSubtaskCompletion(taskId, subtask.id);
                    });
                    
                    // Add event listener to remove button
                    const removeBtn = subtaskElement.querySelector('.btn-close');
                    removeBtn.addEventListener('click', () => {
                        this.removeSubtask(taskId, subtask.id);
                    });
                    
                    subtasksContainer.appendChild(subtaskElement);
                });
            }
        }
        
        // Set linked notes
        if (linkedNotesContainer) {
            linkedNotesContainer.innerHTML = '';
            
            // Get relationships for this task
            const relationships = this.storageService.getRelationships();
            const taskRelationships = relationships.filter(rel => rel.taskId === taskId);
            
            if (taskRelationships.length > 0) {
                // Get all notes
                const notes = this.storageService.getNotes();
                
                taskRelationships.forEach(rel => {
                    const note = notes.find(n => n.id === rel.noteId);
                    if (note) {
                        const noteElement = document.createElement('div');
                        noteElement.className = 'linked-note mb-2 p-2 border rounded';
                        noteElement.innerHTML = `
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="mb-1">${note.title}</h6>
                                    <p class="mb-0 small text-truncate">${note.content}</p>
                                </div>
                                <button type="button" class="btn-close btn-close-sm" aria-label="Remove link"></button>
                            </div>
                        `;
                        
                        // Add event listener to view note
                        noteElement.addEventListener('click', (e) => {
                            if (!e.target.classList.contains('btn-close')) {
                                // Switch to notes view and select this note
                                const notesLink = document.querySelector('.nav-link[data-view="notes"]');
                                if (notesLink) {
                                    notesLink.click();
                                    
                                    // Wait for notes view to load
                                    setTimeout(() => {
                                        // Find and select the note
                                        const noteItem = document.querySelector(`.note-item[data-note-id="${note.id}"]`);
                                        if (noteItem) {
                                            noteItem.click();
                                        }
                                    }, 100);
                                }
                            }
                        });
                        
                        // Add event listener to remove link
                        const removeBtn = noteElement.querySelector('.btn-close');
                        removeBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.removeNoteLink(rel.id);
                        });
                        
                        linkedNotesContainer.appendChild(noteElement);
                    }
                });
            } else {
                linkedNotesContainer.innerHTML = '<p class="text-muted small">No notes linked to this task</p>';
            }
        }
        
        // Set last updated
        if (taskLastUpdated) {
            taskLastUpdated.textContent = `Last updated: ${this.uiService.formatDate(task.updated, 'datetime')}`;
        }
        
        // Store current task ID in the form
        taskDetailContent.setAttribute('data-task-id', taskId);
    }
    
    saveCurrentTask() {
        const taskDetailContent = document.getElementById('task-detail-content');
        const taskId = taskDetailContent.getAttribute('data-task-id');
        
        if (!taskId) return;
        
        // Get task data from form
        const taskTitle = document.getElementById('task-title').value;
        const taskDescription = document.getElementById('task-description').value;
        const taskDueDate = document.getElementById('task-due-date').value;
        const taskPriority = document.getElementById('task-priority').value;
        const taskCategory = document.getElementById('task-category').value;
        const taskStatus = document.getElementById('task-status').value;
        
        // Get task from storage
        const tasks = this.storageService.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) return;
        
        // Update task
        const updatedTask = new Task(tasks[taskIndex]);
        updatedTask.update({
            title: taskTitle,
            description: taskDescription,
            dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : null,
            priority: taskPriority,
            category: taskCategory,
            status: taskStatus
        });
        
        // Save to storage
        this.storageService.updateTask(updatedTask);
        
        // Refresh tasks list
        this.refreshView();
        
        // Re-select the task
        this.selectTask(taskId);
        
        // Show success message
        this.uiService.showToast('Task saved successfully', 'success');
    }
    
    toggleCompleteCurrentTask() {
        const taskDetailContent = document.getElementById('task-detail-content');
        const taskId = taskDetailContent.getAttribute('data-task-id');
        
        if (!taskId) return;
        
        this.toggleTaskCompletion(taskId);
    }
    
    toggleTaskCompletion(taskId) {
        // Get task from storage
        const tasks = this.storageService.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) return;
        
        // Toggle completion status
        const updatedTask = new Task(tasks[taskIndex]);
        updatedTask.update({
            completed: !updatedTask.completed
        });
        
        // Save to storage
        this.storageService.updateTask(updatedTask);
        
        // Refresh tasks list
        this.refreshView();
        
        // Re-select the task if it's currently selected
        const taskDetailContent = document.getElementById('task-detail-content');
        if (taskDetailContent && taskDetailContent.getAttribute('data-task-id') === taskId) {
            this.selectTask(taskId);
        }
        
        // Show success message
        const action = updatedTask.completed ? 'completed' : 'marked as incomplete';
        this.uiService.showToast(`Task ${action} successfully`, 'success');
    }
    
    deleteCurrentTask() {
        const taskDetailContent = document.getElementById('task-detail-content');
        const taskId = taskDetailContent.getAttribute('data-task-id');
        
        if (!taskId) return;
        
        // Confirm deletion
        this.uiService.confirmDialog('Are you sure you want to delete this task? This action cannot be undone.', () => {
            // Delete task
            this.storageService.deleteTask(taskId);
            
            // Delete any relationships associated with this task
            const relationships = this.storageService.getRelationships();
            const filteredRelationships = relationships.filter(rel => rel.taskId !== taskId);
            this.storageService.setRelationships(filteredRelationships);
            
            // Refresh tasks list
            this.refreshView();
            
            // Reset task detail view
            const taskDetailPlaceholder = document.getElementById('task-detail-placeholder');
            if (taskDetailPlaceholder) taskDetailPlaceholder.classList.remove('d-none');
            
            if (taskDetailContent) {
                taskDetailContent.classList.add('d-none');
                taskDetailContent.removeAttribute('data-task-id');
            }
            
            // Show success message
            this.uiService.showToast('Task deleted successfully', 'success');
        });
    }
    
    addSubtaskToCurrentTask() {
        const taskDetailContent = document.getElementById('task-detail-content');
        const taskId = taskDetailContent.getAttribute('data-task-id');
        const newSubtaskInput = document.getElementById('new-subtask');
        
        if (!taskId || !newSubtaskInput) return;
        
        // Get subtask title
        const subtaskTitle = newSubtaskInput.value.trim();
        if (!subtaskTitle) return;
        
        // Get task from storage
        const tasks = this.storageService.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) return;
        
        // Add subtask
        const updatedTask = new Task(tasks[taskIndex]);
        updatedTask.addSubtask(subtaskTitle);
        
        // Save to storage
        this.storageService.updateTask(updatedTask);
        
        // Clear input
        newSubtaskInput.value = '';
        
        // Refresh task view
        this.selectTask(taskId);
    }
    
    toggleSubtaskCompletion(taskId, subtaskId) {
        // Get task from storage
        const tasks = this.storageService.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) return;
        
        // Find subtask
        const task = tasks[taskIndex];
        const subtaskIndex = task.subtasks.findIndex(s => s.id === subtaskId);
        
        if (subtaskIndex === -1) return;
        
        // Toggle completion status
        const updatedTask = new Task(task);
        updatedTask.updateSubtask(subtaskId, {
            completed: !task.subtasks[subtaskIndex].completed
        });
        
        // Save to storage
        this.storageService.updateTask(updatedTask);
        
        // Update UI
        const checkbox = document.getElementById(`subtask-${subtaskId}`);
        const label = checkbox.nextElementSibling;
        
        if (checkbox.checked) {
            label.classList.add('text-decoration-line-through');
        } else {
            label.classList.remove('text-decoration-line-through');
        }
    }
    
    removeSubtask(taskId, subtaskId) {
        // Get task from storage
        const tasks = this.storageService.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) return;
        
        // Remove subtask
        const updatedTask = new Task(tasks[taskIndex]);
        updatedTask.removeSubtask(subtaskId);
        
        // Save to storage
        this.storageService.updateTask(updatedTask);
        
        // Refresh task view
        this.selectTask(taskId);
    }
    
    showLinkNoteModal() {
        const taskDetailContent = document.getElementById('task-detail-content');
        const taskId = taskDetailContent.getAttribute('data-task-id');
        
        if (!taskId) return;
        
        // Get all notes
        const notes = this.storageService.getNotes();
        
        // Get existing relationships for this task
        const relationships = this.storageService.getRelationships();
        const taskRelationships = relationships.filter(rel => rel.taskId === taskId);
        const linkedNoteIds = taskRelationships.map(rel => rel.noteId);
        
        // Filter out already linked notes
        const availableNotes = notes.filter(note => !linkedNoteIds.includes(note.id));
        
        // Show modal
        const linkNoteModal = new bootstrap.Modal(document.getElementById('link-note-modal'));
        const linkNoteList = document.getElementById('link-note-list');
        const linkNoteSearch = document.getElementById('link-note-search');
        
        // Clear previous content
        linkNoteList.innerHTML = '';
        linkNoteSearch.value = '';
        
        // Add notes to list
        if (availableNotes.length === 0) {
            linkNoteList.innerHTML = '<div class="text-center text-muted py-3">No available notes to link</div>';
        } else {
            availableNotes.forEach(note => {
                const noteItem = document.createElement('a');
                noteItem.href = '#';
                noteItem.className = 'list-group-item list-group-item-action';
                
                const tagsHtml = note.tags.length > 0 
                    ? `<div class="mt-1">${this.uiService.createTagElements(note.tags)}</div>` 
                    : '';
                
                noteItem.innerHTML = `
                    <h6 class="mb-1">${note.title}</h6>
                    <p class="mb-1 text-truncate">${note.content}</p>
                    ${tagsHtml}
                    <small class="text-muted">${this.uiService.formatDate(note.updated, 'relative')}</small>
                `;
                
                noteItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.linkNoteToTask(taskId, note.id);
                    linkNoteModal.hide();
                });
                
                linkNoteList.appendChild(noteItem);
            });
        }
        
        // Add search functionality
        linkNoteSearch.addEventListener('input', () => {
            const query = linkNoteSearch.value.toLowerCase();
            
            // Filter notes by query
            const filteredNotes = availableNotes.filter(note => {
                const titleMatch = note.title.toLowerCase().includes(query);
                const contentMatch = note.content.toLowerCase().includes(query);
                const tagMatch = note.tags.some(tag => tag.toLowerCase().includes(query));
                
                return titleMatch || contentMatch || tagMatch;
            });
            
            // Update list
            linkNoteList.innerHTML = '';
            
            if (filteredNotes.length === 0) {
                linkNoteList.innerHTML = '<div class="text-center text-muted py-3">No notes match your search</div>';
            } else {
                filteredNotes.forEach(note => {
                    const noteItem = document.createElement('a');
                    noteItem.href = '#';
                    noteItem.className = 'list-group-item list-group-item-action';
                    
                    const tagsHtml = note.tags.length > 0 
                        ? `<div class="mt-1">${this.uiService.createTagElements(note.tags)}</div>` 
                        : '';
                    
                    noteItem.innerHTML = `
                        <h6 class="mb-1">${note.title}</h6>
                        <p class="mb-1 text-truncate">${note.content}</p>
                        ${tagsHtml}
                        <small class="text-muted">${this.uiService.formatDate(note.updated, 'relative')}</small>
                    `;
                    
                    noteItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.linkNoteToTask(taskId, note.id);
                        linkNoteModal.hide();
                    });
                    
                    linkNoteList.appendChild(noteItem);
                });
            }
        });
        
        linkNoteModal.show();
    }
    
    linkNoteToTask(taskId, noteId) {
        // Create relationship
        const relationship = {
            id: 'rel-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            taskId: taskId,
            noteId: noteId,
            type: 'reference',
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        // Add to storage
        this.storageService.addRelationship(relationship);
        
        // Refresh task view
        this.selectTask(taskId);
        
        // Show success message
        this.uiService.showToast('Note linked successfully', 'success');
    }
    
    removeNoteLink(relationshipId) {
        // Get current task ID
        const taskDetailContent = document.getElementById('task-detail-content');
        const taskId = taskDetailContent.getAttribute('data-task-id');
        
        if (!taskId) return;
        
        // Delete relationship
        const relationships = this.storageService.getRelationships();
        const filteredRelationships = relationships.filter(rel => rel.id !== relationshipId);
        this.storageService.setRelationships(filteredRelationships);
        
        // Refresh task view
        this.selectTask(taskId);
        
        // Show success message
        this.uiService.showToast('Note link removed', 'success');
    }
    
    searchTasks(query) {
        if (!query) {
            // If query is empty, show all tasks
            this.loadTasks();
            return;
        }
        
        // Get all tasks
        const tasks = this.storageService.getTasks();
        
        // Filter tasks by query
        const filteredTasks = tasks.filter(task => {
            const titleMatch = task.title.toLowerCase().includes(query.toLowerCase());
            const descriptionMatch = task.description && task.description.toLowerCase().includes(query.toLowerCase());
            const categoryMatch = task.category && task.category.toLowerCase().includes(query.toLowerCase());
            
            return titleMatch || descriptionMatch || categoryMatch;
        });
        
        // Update tasks list with filtered tasks
        this.displayFilteredTasks(filteredTasks);
    }
    
    filterTasks(filter) {
        // Get all tasks
        const tasks = this.storageService.getTasks();
        
        // Filter tasks based on selected filter
        let filteredTasks = [];
        
        switch (filter) {
            case 'all':
                filteredTasks = tasks;
                break;
            case 'active':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            case 'overdue':
                filteredTasks = tasks.filter(task => {
                    if (!task.dueDate || task.completed) return false;
                    return new Date(task.dueDate) < new Date();
                });
                break;
            default:
                filteredTasks = tasks;
        }
        
        // Update tasks list with filtered tasks
        this.displayFilteredTasks(filteredTasks);
    }
    
    filterTasksByPriority(priority) {
        // Get all tasks
        const tasks = this.storageService.getTasks();
        
        // Filter tasks by priority
        const filteredTasks = tasks.filter(task => task.priority === priority);
        
        // Update tasks list with filtered tasks
        this.displayFilteredTasks(filteredTasks);
    }
    
    filterTasksByCategory(category) {
        // Get all tasks
        const tasks = this.storageService.getTasks();
        
        // Filter tasks by category
        const filteredTasks = tasks.filter(task => task.category === category);
        
        // Update tasks list with filtered tasks
        this.displayFilteredTasks(filteredTasks);
    }
    
    displayFilteredTasks(filteredTasks) {
        const tasksList = document.getElementById('tasks-list');
        const tasksEmptyMessage = document.getElementById('tasks-empty-message');
        
        // Clear current list
        if (tasksList) {
            tasksList.innerHTML = '';
            
            if (filteredTasks.length === 0) {
                if (tasksEmptyMessage) {
                    tasksEmptyMessage.classList.remove('d-none');
                    tasksEmptyMessage.textContent = 'No tasks match your search';
                }
            } else {
                if (tasksEmptyMessage) {
                    tasksEmptyMessage.classList.add('d-none');
                }
                
                // Sort tasks by due date (closest first) and then by priority
                const sortedTasks = [...filteredTasks].sort((a, b) => {
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
                        ? `<div class="progress mt-1" style="height: 4px;"><div class="progress-bar" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div></div>` 
                        : '';
                    
                    taskItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1 ${task.completed ? 'text-decoration-line-through' : ''}">${task.title}</h6>
                                <div class="d-flex align-items-center">
                                    ${this.uiService.createPriorityBadge(task.priority)}
                                    <span class="badge bg-secondary ms-1">${task.category}</span>
                                    ${overdueLabel}
                                </div>
                                ${dueDateText}
                                ${progressBar}
                            </div>
                            <div class="form-check">
                                <input class="form-check-input task-complete-checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
                            </div>
                        </div>
                    `;
                    
                    // Add event listener to task item
                    taskItem.addEventListener('click', (e) => {
                        // Don't select task if checkbox was clicked
                        if (e.target.classList.contains('task-complete-checkbox')) {
                            e.preventDefault();
                            this.toggleTaskCompletion(task.id);
                            return;
                        }
                        
                        e.preventDefault();
                        this.selectTask(task.id);
                    });
                    
                    // Add event listener to checkbox
                    const checkbox = taskItem.querySelector('.task-complete-checkbox');
                    if (checkbox) {
                        checkbox.addEventListener('change', (e) => {
                            e.stopPropagation();
                            this.toggleTaskCompletion(task.id);
                        });
                    }
                    
                    tasksList.appendChild(taskItem);
                });
            }
        }
    }
    
    calculateTaskProgress(task) {
        if (task.completed) return 100;
        if (!task.subtasks || task.subtasks.length === 0) {
            return task.status === 'in-progress' ? 50 : 0;
        }
        
        const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
        return Math.round((completedSubtasks / task.subtasks.length) * 100);
    }
}
