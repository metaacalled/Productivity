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
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (this.charts.goalsChart) {
            this.charts.goalsChart.destroy();
        }
        
        // Get goals
        const goals = this.storageService.getGoals();
        
        // Filter goals based on period
        let filteredGoals;
        
        if (period === 'current') {
            // Only non-completed goals
            filteredGoals = goals.filter(goal => !goal.completed);
        } else {
            // All goals
            filteredGoals = goals;
        }
        
        // Sort goals by progress (descending)
        filteredGoals.sort((a, b) => b.progress - a.progress);
        
        // Limit to top 10 goals
        const topGoals = filteredGoals.slice(0, 10);
        
        // Prepare chart data
        const labels = topGoals.map(goal => goal.title);
        const data = topGoals.map(goal => goal.progress);
        const backgroundColors = topGoals.map(goal => {
            if (goal.completed) {
                return 'rgba(40, 167, 69, 0.5)'; // Green for completed
            } else if (goal.progress >= 75) {
                return 'rgba(23, 162, 184, 0.5)'; // Blue for high progress
            } else if (goal.progress >= 50) {
                return 'rgba(255, 193, 7, 0.5)'; // Yellow for medium progress
            } else if (goal.progress >= 25) {
                return 'rgba(255, 153, 0, 0.5)'; // Orange for low progress
            } else {
                return 'rgba(220, 53, 69, 0.5)'; // Red for very low progress
            }
        });
        
        // Create chart
        this.charts.goalsChart = new Chart(chartCanvas, {
            type: 'horizontalBar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Progress (%)',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.5', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    updateTaskCategoriesChart() {
        const chartCanvas = document.getElementById('task-categories-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (this.charts.taskCategoriesChart) {
            this.charts.taskCategoriesChart.destroy();
        }
        
        // Get tasks
        const tasks = this.storageService.getTasks();
        
        // Group tasks by category
        const tasksByCategory = new Map();
        
        tasks.forEach(task => {
            const category = task.category || 'Uncategorized';
            
            if (tasksByCategory.has(category)) {
                tasksByCategory.set(category, tasksByCategory.get(category) + 1);
            } else {
                tasksByCategory.set(category, 1);
            }
        });
        
        // Sort categories by count (descending)
        const sortedCategories = Array.from(tasksByCategory.entries())
            .sort((a, b) => b[1] - a[1]);
        
        // Prepare chart data
        const labels = sortedCategories.map(entry => entry[0]);
        const data = sortedCategories.map(entry => entry[1]);
        
        // Generate colors
        const backgroundColors = this.generateColors(labels.length, 0.7);
        const borderColors = this.generateColors(labels.length, 1);
        
        // Create chart
        this.charts.taskCategoriesChart = new Chart(chartCanvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    updateGradesChart() {
        const chartCanvas = document.getElementById('grades-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (this.charts.gradesChart) {
            this.charts.gradesChart.destroy();
        }
        
        // Get marks
        const marks = this.storageService.getMarks();
        
        // Group marks by grade range
        const gradeRanges = [
            { name: 'A (90-100%)', min: 90, max: 100, color: 'rgba(40, 167, 69, 0.7)' },
            { name: 'B (80-89%)', min: 80, max: 89, color: 'rgba(23, 162, 184, 0.7)' },
            { name: 'C (70-79%)', min: 70, max: 79, color: 'rgba(255, 193, 7, 0.7)' },
            { name: 'D (60-69%)', min: 60, max: 69, color: 'rgba(255, 153, 0, 0.7)' },
            { name: 'F (0-59%)', min: 0, max: 59, color: 'rgba(220, 53, 69, 0.7)' }
        ];
        
        const gradeDistribution = gradeRanges.map(range => ({
            ...range,
            count: 0
        }));
        
        // Count marks in each grade range
        marks.forEach(mark => {
            const finalGrade = this.calculateFinalGrade(mark);
            
            if (finalGrade !== null) {
                for (const range of gradeDistribution) {
                    if (finalGrade >= range.min && finalGrade <= range.max) {
                        range.count++;
                        break;
                    }
                }
            }
        });
        
        // Prepare chart data
        const labels = gradeDistribution.map(range => range.name);
        const data = gradeDistribution.map(range => range.count);
        const backgroundColors = gradeDistribution.map(range => range.color);
        const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));
        
        // Create chart
        this.charts.gradesChart = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Subjects',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
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
    
    updateUpcomingTasks() {
        const container = document.getElementById('upcoming-tasks-container');
        if (!container) return;
        
        // Get tasks
        const tasks = this.storageService.getTasks();
        
        // Filter for upcoming tasks (not completed, with due date in the future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingTasks = tasks.filter(task => {
            if (task.completed || !task.dueDate) return false;
            
            const dueDate = new Date(task.dueDate);
            return dueDate >= today;
        });
        
        // Sort by due date (ascending)
        upcomingTasks.sort((a, b) => {
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
        
        // Limit to 5 tasks
        const topTasks = upcomingTasks.slice(0, 5);
        
        // Render tasks
        if (topTasks.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-3">No upcoming tasks</div>';
            return;
        }
        
        let html = '<ul class="list-group">';
        
        topTasks.forEach(task => {
            const dueDate = new Date(task.dueDate);
            const dueDateStr = this.uiService.formatDate(task.dueDate);
            
            // Check if task is due today
            const isToday = dueDate.toDateString() === today.toDateString();
            const dueDateClass = isToday ? 'text-primary' : '';
            const dueDateLabel = isToday ? 'Today' : dueDateStr;
            
            html += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${task.title}</h6>
                        <small class="${dueDateClass}">${dueDateLabel}</small>
                    </div>
                    <span class="badge bg-${this.getPriorityClass(task.priority)}">${this.capitalizeFirstLetter(task.priority)}</span>
                </li>
            `;
        });
        
        html += '</ul>';
        container.innerHTML = html;
    }
    
    updateInsights() {
        const container = document.getElementById('insights-container');
        if (!container) return;
        
        // Get data
        const tasks = this.storageService.getTasks();
        const notes = this.storageService.getNotes();
        const goals = this.storageService.getGoals();
        const marks = this.storageService.getMarks();
        
        // Generate insights
        const insights = [];
        
        // Task completion rate
        if (tasks.length > 0) {
            const completedTasks = tasks.filter(task => task.completed);
            const completionRate = Math.round((completedTasks.length / tasks.length) * 100);
            
            insights.push({
                text: `Your task completion rate is ${completionRate}%`,
                icon: 'bi-check-circle',
                color: this.getCompletionRateColor(completionRate)
            });
        }
        
        // Overdue tasks
        const today = new Date();
        const overdueTasks = tasks.filter(task => {
            if (task.completed || !task.dueDate) return false;
            
            const dueDate = new Date(task.dueDate);
            return dueDate < today;
        });
        
        if (overdueTasks.length > 0) {
            insights.push({
                text: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
                icon: 'bi-exclamation-triangle',
                color: 'warning'
            });
        }
        
        // Goals progress
        if (goals.length > 0) {
            const activeGoals = goals.filter(goal => !goal.completed);
            
            if (activeGoals.length > 0) {
                const totalProgress = activeGoals.reduce((sum, goal) => sum + goal.progress, 0);
                const averageProgress = Math.round(totalProgress / activeGoals.length);
                
                insights.push({
                    text: `Your active goals are ${averageProgress}% complete on average`,
                    icon: 'bi-trophy',
                    color: this.getProgressColor(averageProgress)
                });
            }
        }
        
        // Grade average
        if (marks.length > 0) {
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
                const letterGrade = this.getLetterGrade(average);
                
                insights.push({
                    text: `Your average grade is ${average}% (${letterGrade})`,
                    icon: 'bi-mortarboard',
                    color: this.getGradeColor(average)
                });
            }
        }
        
        // Productivity streak
        const streak = this.calculateProductivityStreak();
        if (streak > 0) {
            insights.push({
                text: `You have a ${streak}-day productivity streak!`,
                icon: 'bi-lightning',
                color: 'primary'
            });
        }
        
        // Render insights
        if (insights.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-3">No insights available yet</div>';
            return;
        }
        
        let html = '<div class="list-group">';
        
        insights.forEach(insight => {
            html += `
                <div class="list-group-item">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <i class="bi ${insight.icon} text-${insight.color} fs-4"></i>
                        </div>
                        <div>
                            ${insight.text}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    calculateProductivityStreak() {
        // Get tasks
        const tasks = this.storageService.getTasks();
        
        // Get completed tasks with completion dates
        const completedTasks = tasks
            .filter(task => task.completed && task.completedDate)
            .map(task => new Date(task.completedDate).toDateString());
        
        if (completedTasks.length === 0) {
            return 0;
        }
        
        // Get unique dates
        const uniqueDates = new Set(completedTasks);
        
        // Check for streak
        const today = new Date().toDateString();
        let currentDate = new Date();
        let streak = 0;
        
        // Check if there's activity today
        if (uniqueDates.has(today)) {
            streak = 1;
        } else {
            return 0; // No activity today, no streak
        }
        
        // Check previous days
        for (let i = 1; i <= 30; i++) { // Check up to 30 days back
            currentDate.setDate(currentDate.getDate() - 1);
            const dateStr = currentDate.toDateString();
            
            if (uniqueDates.has(dateStr)) {
                streak++;
            } else {
                break; // Streak broken
            }
        }
        
        return streak;
    }
    
    calculateFinalGrade(mark) {
        if (!mark.components || mark.components.length === 0) {
            return null;
        }
        
        let totalWeightedGrade = 0;
        let totalWeight = 0;
        
        mark.components.forEach(component => {
            if (component.grade !== null && component.grade !== undefined) {
                totalWeightedGrade += component.grade * component.weight;
                totalWeight += component.weight;
            }
        });
        
        if (totalWeight === 0) {
            return null;
        }
        
        return Math.round((totalWeightedGrade / totalWeight) * 10) / 10; // Round to 1 decimal place
    }
    
    getLetterGrade(grade) {
        if (grade === null || grade === undefined) return 'N/A';
        
        if (grade >= 97) return 'A+';
        if (grade >= 93) return 'A';
        if (grade >= 90) return 'A-';
        if (grade >= 87) return 'B+';
        if (grade >= 83) return 'B';
        if (grade >= 80) return 'B-';
        if (grade >= 77) return 'C+';
        if (grade >= 73) return 'C';
        if (grade >= 70) return 'C-';
        if (grade >= 67) return 'D+';
        if (grade >= 63) return 'D';
        if (grade >= 60) return 'D-';
        return 'F';
    }
    
    getPriorityClass(priority) {
        switch (priority) {
            case 'high':
                return 'danger';
            case 'medium':
                return 'warning';
            case 'low':
                return 'info';
            default:
                return 'secondary';
        }
    }
    
    getCompletionRateColor(rate) {
        if (rate >= 80) return 'success';
        if (rate >= 60) return 'primary';
        if (rate >= 40) return 'info';
        if (rate >= 20) return 'warning';
        return 'danger';
    }
    
    getProgressColor(progress) {
        if (progress >= 80) return 'success';
        if (progress >= 60) return 'primary';
        if (progress >= 40) return 'info';
        if (progress >= 20) return 'warning';
        return 'danger';
    }
    
    getGradeColor(grade) {
        if (grade >= 90) return 'success';
        if (grade >= 80) return 'primary';
        if (grade >= 70) return 'info';
        if (grade >= 60) return 'warning';
        return 'danger';
    }
    
    generateColors(count, alpha = 1) {
        const colors = [];
        const hueStep = 360 / count;
        
        for (let i = 0; i < count; i++) {
            const hue = i * hueStep;
            colors.push(`hsla(${hue}, 70%, 60%, ${alpha})`);
        }
        
        return colors;
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    loadChartJs() {
        // Check if Chart.js is already loaded
        if (typeof Chart !== 'undefined') {
            this.refreshView();
            return;
        }
        
        // Create script element
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.async = true;
        
        // Add to document
        document.head.appendChild(script);
        
        // Wait for script to load
        script.onload = () => {
            console.log('Chart.js loaded');
            this.refreshView();
        };
    }
}
