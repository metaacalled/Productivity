// Dashboard Controller
export class DashboardController {
    constructor(storageService, uiService) {
        this.storageService = storageService;
        this.uiService = uiService;
        this.dashboardView = document.getElementById('dashboard-view');
        this.charts = {};
    }
    
    init() {
        // Initialize the dashboard view
        this.setupDashboardView();
        
        // Load Chart.js if not already loaded
        this.loadChartJs();
    }
    
    setupDashboardView() {
        // Create the dashboard view HTML structure
        this.dashboardView.innerHTML = `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h2 class="card-title">Welcome to Your Productivity Dashboard</h2>
                            <p class="card-text">
                                Here's an overview of your productivity metrics and progress across all areas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-3 mb-4 mb-md-0">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h1 id="tasks-count" class="display-4">0</h1>
                            <p class="lead">Tasks</p>
                            <div class="small text-muted">
                                <span id="tasks-completed-count">0</span> completed
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4 mb-md-0">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h1 id="notes-count" class="display-4">0</h1>
                            <p class="lead">Notes</p>
                            <div class="small text-muted">
                                <span id="notes-tags-count">0</span> unique tags
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4 mb-md-0">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h1 id="goals-count" class="display-4">0</h1>
                            <p class="lead">Goals</p>
                            <div class="small text-muted">
                                <span id="goals-completed-count">0</span> completed
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h1 id="marks-count" class="display-4">0</h1>
                            <p class="lead">Subjects</p>
                            <div class="small text-muted">
                                <span id="marks-average">N/A</span> average grade
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6 mb-4 mb-md-0">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Task Completion</h5>
                            <div class="btn-group btn-group-sm" role="group">
                                <button type="button" class="btn btn-outline-secondary active" data-period="week" data-chart="tasks">Week</button>
                                <button type="button" class="btn btn-outline-secondary" data-period="month" data-chart="tasks">Month</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container" style="position: relative; height: 250px;">
                                <canvas id="tasks-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Goal Progress</h5>
                            <div class="btn-group btn-group-sm" role="group">
                                <button type="button" class="btn btn-outline-secondary active" data-period="current" data-chart="goals">Current</button>
                                <button type="button" class="btn btn-outline-secondary" data-period="all" data-chart="goals">All</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container" style="position: relative; height: 250px;">
                                <canvas id="goals-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6 mb-4 mb-md-0">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="mb-0">Task Categories</h5>
                        </div>
                        <div class="card-body">
                            <div class="chart-container" style="position: relative; height: 250px;">
                                <canvas id="task-categories-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="mb-0">Grade Distribution</h5>
                        </div>
                        <div class="card-body">
                            <div class="chart-container" style="position: relative; height: 250px;">
                                <canvas id="grades-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-8 mb-4 mb-md-0">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="mb-0">Upcoming Tasks</h5>
                        </div>
                        <div class="card-body">
                            <div id="upcoming-tasks-container">
                                <div class="text-center text-muted py-3">No upcoming tasks</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="mb-0">Productivity Insights</h5>
                        </div>
                        <div class="card-body">
                            <div id="insights-container">
                                <div class="text-center text-muted py-3">Loading insights...</div>
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
        // Period buttons for charts
        const periodButtons = document.querySelectorAll('[data-period]');
        periodButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const period = e.target.getAttribute('data-period');
                const chartType = e.target.getAttribute('data-chart');
                
                // Update active button
                const buttonGroup = e.target.closest('.btn-group');
                buttonGroup.querySelectorAll('.btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Update chart
                if (chartType === 'tasks') {
                    this.updateTasksChart(period);
                } else if (chartType === 'goals') {
                    this.updateGoalsChart(period);
                }
            });
        });
    }
    
    refreshView() {
        // Update data counts
        this.updateDataCounts();
        
        // Update charts
        this.updateAllCharts();
        
        // Update upcoming tasks
        this.updateUpcomingTasks();
        
        // Update insights
        this.updateInsights();
    }
    
    updateDataCounts() {
        // Get data
        const tasks = this.storageService.getTasks();
        const notes = this.storageService.getNotes();
        const goals = this.storageService.getGoals();
        const marks = this.storageService.getMarks();
        
        // Update task counts
        const tasksCount = document.getElementById('tasks-count');
        const tasksCompletedCount = document.getElementById('tasks-completed-count');
        
        if (tasksCount) {
            tasksCount.textContent = tasks.length;
        }
        
        if (tasksCompletedCount) {
            const completedTasks = tasks.filter(task => task.completed);
            tasksCompletedCount.textContent = completedTasks.length;
        }
        
        // Update notes counts
        const notesCount = document.getElementById('notes-count');
        const notesTagsCount = document.getElementById('notes-tags-count');
        
        if (notesCount) {
            notesCount.textContent = notes.length;
        }
        
        if (notesTagsCount) {
            const allTags = new Set();
            notes.forEach(note => {
                note.tags.forEach(tag => allTags.add(tag));
            });
            notesTagsCount.textContent = allTags.size;
        }
        
        // Update goals counts
        const goalsCount = document.getElementById('goals-count');
        const goalsCompletedCount = document.getElementById('goals-completed-count');
        
        if (goalsCount) {
            goalsCount.textContent = goals.length;
        }
        
        if (goalsCompletedCount) {
            const completedGoals = goals.filter(goal => goal.completed);
            goalsCompletedCount.textContent = completedGoals.length;
        }
        
        // Update marks counts
        const marksCount = document.getElementById('marks-count');
        const marksAverage = document.getElementById('marks-average');
        
        if (marksCount) {
            marksCount.textContent = marks.length;
        }
        
        if (marksAverage) {
            let totalGrade = 0;
            let gradeCount = 0;
            
            marks.forEach(mark => {
                const finalGrade = this.calculateFinalGrade(mark);
                if (finalGrade !== null) {
                    totalGrade += finalGrade;
                    gradeCount++;
                }
            });
            
            if (gradeCount > 0) {
                const average = Math.round((totalGrade / gradeCount) * 10) / 10;
                marksAverage.textContent = `${average}%`;
            } else {
                marksAverage.textContent = 'N/A';
            }
        }
    }
    
    updateAllCharts() {
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.log('Chart.js not loaded yet');
            return;
        }
        
        // Update tasks chart (default: week)
        this.updateTasksChart('week');
        
        // Update goals chart (default: current)
        this.updateGoalsChart('current');
        
        // Update task categories chart
        this.updateTaskCategoriesChart();
        
        // Update grades chart
        this.updateGradesChart();
    }
    
    updateTasksChart(period = 'week') {
        const chartCanvas = document.getElementById('tasks-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (this.charts.tasksChart) {
            this.charts.tasksChart.destroy();
        }
        
        // Get tasks
        const tasks = this.storageService.getTasks();
        
        // Determine date range based on period
        const today = new Date();
        let startDate;
        let dateFormat;
        let groupByKey;
        
        if (period === 'week') {
            // Last 7 days
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 6);
            dateFormat = { weekday: 'short' }; // e.g., "Mon"
            groupByKey = date => date.toLocaleDateString(undefined, { weekday: 'short' });
        } else if (period === 'month') {
            // Last 30 days
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 29);
            dateFormat = { month: 'short', day: 'numeric' }; // e.g., "Apr 8"
            groupByKey = date => date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
        
        // Reset hours to start of day
        startDate.setHours(0, 0, 0, 0);
        today.setHours(23, 59, 59, 999);
        
        // Filter tasks by completion date within range
        const filteredTasks = tasks.filter(task => {
            if (!task.completed || !task.completedDate) return false;
            
            const completedDate = new Date(task.completedDate);
            return completedDate >= startDate && completedDate <= today;
        });
        
        // Group tasks by date
        const tasksByDate = new Map();
        
        // Initialize all dates in range
        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            const key = groupByKey(new Date(d));
            tasksByDate.set(key, 0);
        }
        
        // Count tasks by date
        filteredTasks.forEach(task => {
            const completedDate = new Date(task.completedDate);
            const key = groupByKey(completedDate);
            
            if (tasksByDate.has(key)) {
                tasksByDate.set(key, tasksByDate.get(key) + 1);
            }
        });
        
        // Prepare chart data
        const labels = Array.from(tasksByDate.keys());
        const data = Array.from(tasksByDate.values());
        
        // Create chart
        this.charts.tasksChart = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tasks Completed',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    updateGoalsChart(period = 'current') {
        const chartCanvas = document.getElementById('goals-chart');
        if
(Content truncated due to size limit. Use line ranges to read in chunks)