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
        const timeSlots = [];
        for (let hour = 7; hour <= 21; hour++) {
            timeSlots.push(`${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`);
        }
        
        // Create week view
        let weekHTML = `
            <div class="week-view">
                <div class="week-header">
                    <div class="week-time-column"></div>
        `;
        
        // Add day headers
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(firstDay);
            date.setDate(firstDay.getDate() + i);
            
            const isToday = date.getTime() === today.getTime() ? 'today' : '';
            const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
            const dayNumber = date.getDate();
            
            weekHTML += `
                <div class="week-day-column ${isToday}">
                    <div class="week-day-header" data-date="${date.toISOString().split('T')[0]}">
                        <div class="week-day-name">${dayName}</div>
                        <div class="week-day-number">${dayNumber}</div>
                    </div>
                </div>
            `;
        }
        
        weekHTML += `
                </div>
                <div class="week-body">
                    <div class="week-time-column">
        `;
        
        // Add time slots
        timeSlots.forEach(timeSlot => {
            weekHTML += `
                <div class="week-time-slot">
                    <div class="week-time">${timeSlot}</div>
                </div>
            `;
        });
        
        weekHTML += `
                    </div>
        `;
        
        // Add day columns
        for (let i = 0; i < 7; i++) {
            const date = new Date(firstDay);
            date.setDate(firstDay.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            weekHTML += `
                <div class="week-day-column">
            `;
            
            // Add time slots for each day
            timeSlots.forEach((timeSlot, index) => {
                weekHTML += `
                    <div class="week-time-slot" data-date="${dateStr}" data-hour="${index + 7}">
                `;
                
                // Get tasks for this time slot
                const slotTasks = tasks.filter(task => {
                    if (!task.dueDate) return false;
                    const taskDate = new Date(task.dueDate);
                    return taskDate.getFullYear() === date.getFullYear() && 
                           taskDate.getMonth() === date.getMonth() && 
                           taskDate.getDate() === date.getDate() &&
                           taskDate.getHours() === (index + 7);
                });
                
                // Add tasks to time slot
                slotTasks.forEach(task => {
                    const priorityClass = `priority-${task.priority}`;
                    const completedClass = task.completed ? 'completed' : '';
                    
                    weekHTML += `
                        <div class="week-event ${priorityClass} ${completedClass}" data-task-id="${task.id}">
                            <div class="event-title">${task.title}</div>
                        </div>
                    `;
                });
                
                weekHTML += `
                    </div>
                `;
            });
            
            weekHTML += `
                </div>
            `;
        }
        
        weekHTML += `
                </div>
            </div>
        `;
        
        // Set week view HTML
        calendarContainer.innerHTML = weekHTML;
        
        // Add event listeners to day headers
        const dayHeaders = document.querySelectorAll('.week-day-header');
        dayHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const date = header.getAttribute('data-date');
                this.showDayView(date);
            });
        });
        
        // Add event listeners to time slots
        const timeSlotss = document.querySelectorAll('.week-time-slot');
        timeSlotss.forEach(slot => {
            if (!slot.hasAttribute('data-date')) return; // Skip time label slots
            
            slot.addEventListener('click', (e) => {
                // Don't open modal if clicking on an event
                if (e.target.closest('.week-event')) {
                    const taskId = e.target.closest('.week-event').getAttribute('data-task-id');
                    this.openTaskDetails(taskId);
                    return;
                }
                
                const date = slot.getAttribute('data-date');
                const hour = slot.getAttribute('data-hour');
                this.openEventModal(date, hour);
            });
        });
        
        // Add event listeners to events
        const events = document.querySelectorAll('.week-event');
        events.forEach(event => {
            event.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = event.getAttribute('data-task-id');
                this.openTaskDetails(taskId);
            });
        });
    }
    
    renderDayView() {
        const calendarContainer = document.getElementById('calendar-container');
        if (!calendarContainer) return;
        
        // Get current day
        const currentDate = new Date(this.currentDate);
        currentDate.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        
        // Get tasks for the day
        const tasks = this.getTasksForDateRange(currentDate, nextDay);
        
        // Create time slots (from 7 AM to 9 PM)
        const timeSlots = [];
        for (let hour = 7; hour <= 21; hour++) {
            timeSlots.push(`${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`);
        }
        
        // Create day view
        const isToday = currentDate.getTime() === new Date().setHours(0, 0, 0, 0);
        const todayClass = isToday ? 'today' : '';
        const dateStr = currentDate.toISOString().split('T')[0];
        
        let dayHTML = `
            <div class="day-view">
                <div class="day-header ${todayClass}">
                    <div class="day-date">
                        ${currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <div class="day-body">
                    <div class="day-time-column">
        `;
        
        // Add time slots
        timeSlots.forEach(timeSlot => {
            dayHTML += `
                <div class="day-time-slot">
                    <div class="day-time">${timeSlot}</div>
                </div>
            `;
        });
        
        dayHTML += `
                    </div>
                    <div class="day-events-column">
        `;
        
        // Add time slots for events
        timeSlots.forEach((timeSlot, index) => {
            dayHTML += `
                <div class="day-time-slot" data-date="${dateStr}" data-hour="${index + 7}">
            `;
            
            // Get tasks for this time slot
            const slotTasks = tasks.filter(task => {
                if (!task.dueDate) return false;
                const taskDate = new Date(task.dueDate);
                return taskDate.getHours() === (index + 7);
            });
            
            // Add tasks to time slot
            slotTasks.forEach(task => {
                const priorityClass = `priority-${task.priority}`;
                const completedClass = task.completed ? 'completed' : '';
                
                dayHTML += `
                    <div class="day-event ${priorityClass} ${completedClass}" data-task-id="${task.id}">
                        <div class="event-time">${new Date(task.dueDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                        <div class="event-title">${task.title}</div>
                    </div>
                `;
            });
            
            dayHTML += `
                </div>
            `;
        });
        
        dayHTML += `
                    </div>
                </div>
                <div class="day-footer">
                    <div class="day-all-day-events">
                        <h5>All Day / No Time</h5>
                        <div class="day-all-day-events-list">
        `;
        
        // Get tasks without specific time
        const allDayTasks = tasks.filter(task => {
            if (!task.dueDate) return true;
            const taskDate = new Date(task.dueDate);
            return taskDate.getHours() === 0 && taskDate.getMinutes() === 0;
        });
        
        if (allDayTasks.length === 0) {
            dayHTML += `
                <div class="text-muted">No all-day tasks</div>
            `;
        } else {
            allDayTasks.forEach(task => {
                const priorityClass = `priority-${task.priority}`;
                const completedClass = task.completed ? 'completed' : '';
                
                dayHTML += `
                    <div class="day-event ${priorityClass} ${completedClass}" data-task-id="${task.id}">
                        <div class="event-title">${task.title}</div>
                    </div>
                `;
            });
        }
        
        dayHTML += `
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Set day view HTML
        calendarContainer.innerHTML = dayHTML;
        
        // Add event listeners to time slots
        const timeSlotsss = document.querySelectorAll('.day-time-slot');
        timeSlotsss.forEach(slot => {
            if (!slot.hasAttribute('data-date')) return; // Skip time label slots
            
            slot.addEventListener('click', (e) => {
                // Don't open modal if clicking on an event
                if (e.target.closest('.day-event')) {
                    const taskId = e.target.closest('.day-event').getAttribute('data-task-id');
                    this.openTaskDetails(taskId);
                    return;
                }
                
                const date = slot.getAttribute('data-date');
                const hour = slot.getAttribute('data-hour');
                this.openEventModal(date, hour);
            });
        });
        
        // Add event listeners to events
        const events = document.querySelectorAll('.day-event');
        events.forEach(event => {
            event.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = event.getAttribute('data-task-id');
                this.openTaskDetails(taskId);
            });
        });
    }
    
    navigateCalendar(direction) {
        switch (direction) {
            case 'prev':
                if (this.currentView === 'month') {
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                } else if (this.currentView === 'week') {
                    this.currentDate.setDate(this.currentDate.getDate() - 7);
                } else if (this.currentView === 'day') {
                    this.currentDate.setDate(this.currentDate.getDate() - 1);
                }
                break;
            case 'next':
                if (this.currentView === 'month') {
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                } else if (this.currentView === 'week') {
                    this.currentDate.setDate(this.currentDate.getDate() + 7);
                } else if (this.currentView === 'day') {
                    this.currentDate.setDate(this.currentDate.getDate() + 1);
                }
                break;
            case 'today':
                this.currentDate = new Date();
                break;
        }
        
        this.renderCalendar();
    }
    
    changeView(view) {
        this.currentView = view;
        this.setActiveViewButton();
        this.renderCalendar();
    }
    
    setActiveViewButton() {
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            if (btn.getAttribute('data-view') === this.currentView) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    showDayView(dateStr) {
        this.currentDate = new Date(dateStr);
        this.changeView('day');
    }
    
    openEventModal(dateStr, hour = null) {
        const eventModal = new bootstrap.Modal(document.getElementById('event-modal'));
        const eventForm = document.getElementById('event-form');
        const eventTitle = document.getElementById('event-title');
        const eventDescription = document.getElementById('event-description');
        const eventDate = document.getElementById('event-date');
        const eventTime = document.getElementById('event-time');
        const eventPriority = document.getElementById('event-priority');
        const eventCategory = document.getElementById('event-category');
        const eventId = document.getElementById('event-id');
        const modalTitle = document.getElementById('event-modal-title');
        const deleteEventBtn = document.getElementById('delete-event-btn');
        
        // Reset form
        eventForm.reset();
        eventId.value = '';
        modalTitle.textContent = 'Add Task';
        deleteEventBtn.classList.add('d-none');
        
        // Set date
        eventDate.value = dateStr;
        
        // Set time if provided
        if (hour !== null) {
            const hourStr = hour.toString().padStart(2, '0');
            eventTime.value = `${hourStr}:00`;
        }
        
        // Update event categories
        this.updateEventCategories();
        
        // Show modal
        eventModal.show();
    }
    
    openTaskDetails(taskId) {
        // Get task from storage
        const tasks = this.storageService.getTasks();
        const task = tasks.find(t => t.id === taskId);
        
        if (!task) return;
        
        // Open event modal with task details
        const eventModal = new bootstrap.Modal(document.getElementById('event-modal'));
        const eventForm = document.getElementById('event-form');
        const eventTitle = document.getElementById('event-title');
        const eventDescription = document.getElementById('event-description');
        const eventDate = document.getElementById('event-date');
        const eventTime = document.getElementById('event-time');
        const eventPriority = document.getElementById('event-priority');
        const eventCategory = document.getElementById('event-category');
        const eventId = document.getElementById('event-id');
        const modalTitle = document.getElementById('event-modal-title');
        const deleteEventBtn = document.getElementById('delete-event-btn');
        
        // Reset form
        eventForm.reset();
        
        // Set task details
        eventTitle.value = task.title;
        eventDescription.value = task.description || '';
        eventPriority.value = task.priority;
        eventCategory.value = task.category || '';
        eventId.value = task.id;
        modalTitle.textContent = 'Edit Task';
        deleteEventBtn.classList.remove('d-none');
        
        // Set date and time
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            
            // Format date for input
            const year = dueDate.getFullYear();
            const month = String(dueDate.getMonth() + 1).padStart(2, '0');
            const day = String(dueDate.getDate()).padStart(2, '0');
            eventDate.value = `${year}-${month}-${day}`;
            
            // Format time for input
            const hours = String(dueDate.getHours()).padStart(2, '0');
            const minutes = String(dueDate.getMinutes()).padStart(2, '0');
            eventTime.value = `${hours}:${minutes}`;
        }
        
        // Update event categories
        this.updateEventCategories();
        
        // Show modal
        eventModal.show();
    }
    
    saveEvent() {
        const eventTitle = document.getElementById('event-title').value;
        const eventDescription = document.getElementById('event-description').value;
        const eventDate = document.getElementById('event-date').value;
        const eventTime = document.getElementById('event-time').value;
        const eventPriority = document.getElementById('event-priority').value;
        const eventCategory = document.getElementById('event-category').value;
        const eventId = document.getElementById('event-id').value;
        
        // Validate form
        if (!eventTitle || !eventDate) {
            this.uiService.showToast('Please fill in all required fields', 'warning');
            return;
        }
        
        // Create date object
        let dueDate = new Date(eventDate);
        
        // Add time if provided
        if (eventTime) {
            const [hours, minutes] = eventTime.split(':');
            dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
            dueDate.setHours(0, 0, 0, 0);
        }
        
        // Check if adding new task or updating existing
        if (eventId) {
            // Update existing task
            const tasks = this.storageService.getTasks();
            const taskIndex = tasks.findIndex(t => t.id === eventId);
            
            if (taskIndex === -1) return;
            
            // Update task
            const updatedTask = new Task(tasks[taskIndex]);
            updatedTask.update({
                title: eventTitle,
                description: eventDescription,
                dueDate: dueDate.toISOString(),
                priority: eventPriority,
                category: eventCategory
            });
            
            // Save to storage
            this.storageService.updateTask(updatedTask);
            
            // Show success message
            this.uiService.showToast('Task updated successfully', 'success');
        } else {
            // Create new task
            const newTask = new Task({
                title: eventTitle,
                description: eventDescription,
                dueDate: dueDate.toISOString(),
                priority: eventPriority,
                category: eventCategory,
                status: 'not-started'
            });
            
            // Add to storage
            this.storageService.addTask(newTask);
            
            // Show success message
            this.uiService.showToast('Task added successfully', 'success');
        }
        
        // Close modal
        const eventModal = bootstrap.Modal.getInstance(document.getElementById('event-modal'));
        eventModal.hide();
        
        // Refresh calendar
        this.refreshView();
    }
    
    deleteEvent() {
        const eventId = document.getElementById('event-id').value;
        
        if (!eventId) return;
        
        // Confirm deletion
        this.uiService.confirmDialog('Are you sure you want to delete this task? This action cannot be undone.', () => {
            // Delete task
            this.storageService.deleteTask(eventId);
            
            // Close modal
            const eventModal = bootstrap.Modal.getInstance(document.getElementById('event-modal'));
            eventModal.hide();
            
            // Refresh calendar
            this.refreshView();
            
            // Show success message
            this.uiService.showToast('Task deleted successfully', 'success');
        });
    }
    
    updateEventCategories() {
        const tasks = this.storageService.getTasks();
        const eventCategoriesDatalist = document.getElementById('event-categories');
        
        if (eventCategoriesDatalist) {
            // Get all unique categories
            const allCategories = new Set();
            tasks.forEach(task => {
                if (task.category) {
                    allCategories.add(task.category);
                }
            });
            
            // Clear current options
            eventCategoriesDatalist.innerHTML = '';
            
            // Add category options
            Array.from(allCategories).sort().forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                eventCategoriesDatalist.appendChild(option);
            });
        }
    }
    
    getTasksForMonth(year, month) {
        const tasks = this.storageService.getTasks();
        
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate.getFullYear() === year && dueDate.getMonth() === month;
        });
    }
    
    getTasksForDateRange(startDate, endDate) {
        const tasks = this.storageService.getTasks();
        
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate >= startDate && dueDate < endDate;
        });
    }
}
