// Calendar Controller
import { Task } from '../models/task.js';

export class CalendarController {
    constructor(storageService, uiService) {
        this.storageService = storageService;
        this.uiService = uiService;
        this.calendarView = document.getElementById('calendar-view');
        this.currentDate = new Date();
        this.currentView = 'month'; // month, week, day
    }
    
    init() {
        // Initialize the calendar view
        this.setupCalendarView();
    }
    
    setupCalendarView() {
        // Create the calendar view HTML structure
        this.calendarView.innerHTML = `
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-secondary" id="prev-btn">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <button type="button" class="btn btn-outline-secondary" id="today-btn">Today</button>
                        <button type="button" class="btn btn-outline-secondary" id="next-btn">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                    <h3 id="calendar-title">April 2025</h3>
                </div>
                <div class="col-md-4 text-end">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-secondary view-btn" data-view="month">Month</button>
                        <button type="button" class="btn btn-outline-secondary view-btn" data-view="week">Week</button>
                        <button type="button" class="btn btn-outline-secondary view-btn" data-view="day">Day</button>
                    </div>
                </div>
            </div>
            
            <div id="calendar-container">
                <!-- Calendar content will be dynamically generated -->
            </div>
            
            <!-- Modal for adding/editing events -->
            <div class="modal fade" id="event-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="event-modal-title">Add Task</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="event-form">
                                <div class="mb-3">
                                    <label for="event-title" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="event-title" required>
                                </div>
                                <div class="mb-3">
                                    <label for="event-description" class="form-label">Description</label>
                                    <textarea class="form-control" id="event-description" rows="3"></textarea>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="event-date" class="form-label">Date</label>
                                        <input type="date" class="form-control" id="event-date" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="event-time" class="form-label">Time</label>
                                        <input type="time" class="form-control" id="event-time">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="event-priority" class="form-label">Priority</label>
                                        <select class="form-select" id="event-priority">
                                            <option value="low">Low</option>
                                            <option value="medium" selected>Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="event-category" class="form-label">Category</label>
                                        <input type="text" class="form-control" id="event-category" list="event-categories" placeholder="Category">
                                        <datalist id="event-categories"></datalist>
                                    </div>
                                </div>
                                <input type="hidden" id="event-id">
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger d-none" id="delete-event-btn">Delete</button>
                            <button type="button" class="btn btn-primary" id="save-event-btn">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.addEventListeners();
        
        // Set active view button
        this.setActiveViewButton();
        
        // Render calendar
        this.renderCalendar();
    }
    
    addEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const todayBtn = document.getElementById('today-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.navigateCalendar('prev');
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.navigateCalendar('next');
            });
        }
        
        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                this.navigateCalendar('today');
            });
        }
        
        // View buttons
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                this.changeView(view);
            });
        });
        
        // Save event button
        const saveEventBtn = document.getElementById('save-event-btn');
        if (saveEventBtn) {
            saveEventBtn.addEventListener('click', () => {
                this.saveEvent();
            });
        }
        
        // Delete event button
        const deleteEventBtn = document.getElementById('delete-event-btn');
        if (deleteEventBtn) {
            deleteEventBtn.addEventListener('click', () => {
                this.deleteEvent();
            });
        }
    }
    
    refreshView() {
        this.renderCalendar();
        this.updateEventCategories();
    }
    
    renderCalendar() {
        // Update calendar title
        this.updateCalendarTitle();
        
        // Render appropriate view
        switch (this.currentView) {
            case 'month':
                this.renderMonthView();
                break;
            case 'week':
                this.renderWeekView();
                break;
            case 'day':
                this.renderDayView();
                break;
        }
    }
    
    updateCalendarTitle() {
        const calendarTitle = document.getElementById('calendar-title');
        if (calendarTitle) {
            const options = { year: 'numeric', month: 'long' };
            if (this.currentView === 'day') {
                options.day = 'numeric';
            }
            calendarTitle.textContent = this.currentDate.toLocaleDateString(undefined, options);
        }
    }
    
    renderMonthView() {
        const calendarContainer = document.getElementById('calendar-container');
        if (!calendarContainer) return;
        
        // Get current month's first day and last day
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Get day of week for first day (0 = Sunday, 6 = Saturday)
        const firstDayOfWeek = firstDay.getDay();
        
        // Get total days in month
        const totalDays = lastDay.getDate();
        
        // Get tasks for the month
        const tasks = this.getTasksForMonth(year, month);
        
        // Create calendar grid
        let calendarHTML = `
            <div class="calendar-grid">
                <div class="calendar-header">
                    <div class="calendar-cell">Sun</div>
                    <div class="calendar-cell">Mon</div>
                    <div class="calendar-cell">Tue</div>
                    <div class="calendar-cell">Wed</div>
                    <div class="calendar-cell">Thu</div>
                    <div class="calendar-cell">Fri</div>
                    <div class="calendar-cell">Sat</div>
                </div>
                <div class="calendar-body">
        `;
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDayOfWeek; i++) {
            const prevMonthDate = new Date(year, month, -firstDayOfWeek + i + 1);
            const dayNumber = prevMonthDate.getDate();
            calendarHTML += `
                <div class="calendar-cell calendar-day other-month" data-date="${prevMonthDate.toISOString().split('T')[0]}">
                    <div class="day-number">${dayNumber}</div>
                </div>
            `;
        }
        
        // Add cells for each day of the month
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = date.getTime() === today.getTime() ? 'today' : '';
            
            // Get tasks for this day
            const dayTasks = tasks.filter(task => {
                if (!task.dueDate) return false;
                const taskDate = new Date(task.dueDate);
                return taskDate.getFullYear() === year && 
                       taskDate.getMonth() === month && 
                       taskDate.getDate() === day;
            });
            
            // Create day cell
            calendarHTML += `
                <div class="calendar-cell calendar-day ${isToday}" data-date="${dateStr}">
                    <div class="day-number">${day}</div>
                    <div class="day-events">
            `;
            
            // Add tasks to day cell (limit to 3 visible tasks)
            const visibleTasks = dayTasks.slice(0, 3);
            const hiddenTasks = dayTasks.length > 3 ? dayTasks.slice(3) : [];
            
            visibleTasks.forEach(task => {
                const priorityClass = `priority-${task.priority}`;
                const completedClass = task.completed ? 'completed' : '';
                
                calendarHTML += `
                    <div class="calendar-event ${priorityClass} ${completedClass}" data-task-id="${task.id}">
                        <div class="event-title">${task.title}</div>
                    </div>
                `;
            });
            
            // Add indicator for hidden tasks
            if (hiddenTasks.length > 0) {
                calendarHTML += `
                    <div class="more-events">+${hiddenTasks.length} more</div>
                `;
            }
            
            calendarHTML += `
                    </div>
                </div>
            `;
        }
        
        // Add empty cells for days after last day of month
        const lastDayOfWeek = lastDay.getDay();
        const remainingCells = 6 - lastDayOfWeek;
        
        for (let i = 1; i <= remainingCells; i++) {
            const nextMonthDate = new Date(year, month + 1, i);
            const dayNumber = nextMonthDate.getDate();
            calendarHTML += `
                <div class="calendar-cell calendar-day other-month" data-date="${nextMonthDate.toISOString().split('T')[0]}">
                    <div class="day-number">${dayNumber}</div>
                </div>
            `;
        }
        
        calendarHTML += `
                </div>
            </div>
        `;
        
        // Set calendar HTML
        calendarContainer.innerHTML = calendarHTML;
        
        // Add event listeners to day cells
        const dayCells = document.querySelectorAll('.calendar-day');
        dayCells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                // Don't open modal if clicking on an event
                if (e.target.closest('.calendar-event')) {
                    const taskId = e.target.closest('.calendar-event').getAttribute('data-task-id');
                    this.openTaskDetails(taskId);
                    return;
                }
                
                // Don't open modal if clicking on "more events"
                if (e.target.closest('.more-events')) {
                    const date = cell.getAttribute('data-date');
                    this.showDayView(date);
                    return;
                }
                
                const date = cell.getAttribute('data-date');
                this.openEventModal(date);
            });
        });
        
        // Add event listeners to events
        const events = document.querySelectorAll('.calendar-event');
        events.forEach(event => {
            event.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = event.getAttribute('data-task-id');
                this.openTaskDetails(taskId);
            });
        });
        
        // Add event listeners to "more events" indicators
        const moreEvents = document.querySelectorAll('.more-events');
        moreEvents.forEach(more => {
            more.addEventListener('click', (e) => {
                e.stopPropagation();
                const date = more.closest('.calendar-day').getAttribute('data-date');
                this.showDayView(date);
            });
        });
    }
    
    renderWeekView() {
        const calendarContainer = document.getElementById('calendar-container');
        if (!calendarContainer) return;
        
        // Get current week's first day (Sunday) and last day (Saturday)
        const currentDate = new Date(this.currentDate);
        const day = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
        const diff = currentDate.getDate() - day;
        const firstDay = new Date(currentDate);
        firstDay.setDate(diff);
        firstDay.setHours(0, 0, 0, 0);
        
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);
        
        // Get tasks for the week
        const tasks = this.getTasksForDateRange(firstDay, lastDay);
        
        // Create time slots (from 7 AM to 9 PM)
        const timeS
(Content truncated due to size limit. Use line ranges to read in chunks)