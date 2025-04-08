// Main Application Controller
import { NotesController } from './controllers/notes-controller.js';
import { TasksController } from './controllers/tasks-controller.js';
import { CalendarController } from './controllers/calendar-controller.js';
import { GoalsController } from './controllers/goals-controller.js';
import { MarksController } from './controllers/marks-controller.js';
import { DashboardController } from './controllers/dashboard-controller.js';
import { SettingsController } from './controllers/settings-controller.js';

export class AppController {
    constructor(storageService, uiService) {
        this.storageService = storageService;
        this.uiService = uiService;
        
        // Initialize feature controllers
        this.notesController = new NotesController(storageService, uiService);
        this.tasksController = new TasksController(storageService, uiService);
        this.calendarController = new CalendarController(storageService, uiService);
        this.goalsController = new GoalsController(storageService, uiService);
        this.marksController = new MarksController(storageService, uiService);
        this.dashboardController = new DashboardController(storageService, uiService);
        this.settingsController = new SettingsController(storageService, uiService);
        
        // Navigation elements
        this.navLinks = document.querySelectorAll('.nav-link');
        this.viewContainer = document.getElementById('view-container');
        this.viewTitle = document.getElementById('current-view-title');
        
        // Data import/export elements
        this.exportBtn = document.getElementById('export-data');
        this.importBtn = document.getElementById('import-data');
        this.dataModal = new bootstrap.Modal(document.getElementById('data-modal'));
        this.dataModalTitle = document.getElementById('data-modal-title');
        this.dataModalBody = document.getElementById('data-modal-body');
        this.dataModalAction = document.getElementById('data-modal-action');
    }
    
    init() {
        // Initialize all controllers
        this.notesController.init();
        this.tasksController.init();
        this.calendarController.init();
        this.goalsController.init();
        this.marksController.init();
        this.dashboardController.init();
        this.settingsController.init();
        
        // Set up navigation
        this.setupNavigation();
        
        // Set up data import/export
        this.setupDataHandling();
        
        // Show dashboard by default
        this.showView('dashboard');
        
        // Load initial data
        this.loadInitialData();
    }
    
    setupNavigation() {
        // Add click event listeners to all navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = link.getAttribute('data-view');
                this.showView(viewName);
                
                // Update active link
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }
    
    showView(viewName) {
        // Hide all views
        const views = document.querySelectorAll('.view-content');
        views.forEach(view => view.classList.remove('active-view'));
        
        // Show selected view
        const selectedView = document.getElementById(`${viewName}-view`);
        if (selectedView) {
            selectedView.classList.add('active-view');
            this.viewTitle.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
        }
        
        // Refresh the view content
        this.refreshView(viewName);
    }
    
    refreshView(viewName) {
        switch (viewName) {
            case 'dashboard':
                this.dashboardController.refreshView();
                break;
            case 'notes':
                this.notesController.refreshView();
                break;
            case 'tasks':
                this.tasksController.refreshView();
                break;
            case 'calendar':
                this.calendarController.refreshView();
                break;
            case 'goals':
                this.goalsController.refreshView();
                break;
            case 'marks':
                this.marksController.refreshView();
                break;
            case 'settings':
                this.settingsController.refreshView();
                break;
        }
    }
    
    setupDataHandling() {
        // Export data
        this.exportBtn.addEventListener('click', () => {
            this.dataModalTitle.textContent = 'Export Data';
            this.dataModalBody.innerHTML = `
                <p>Export all your productivity data as a JSON file. This file can be used to backup or transfer your data.</p>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="export-notes" checked>
                    <label class="form-check-label" for="export-notes">Notes</label>
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="export-tasks" checked>
                    <label class="form-check-label" for="export-tasks">Tasks</label>
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="export-goals" checked>
                    <label class="form-check-label" for="export-goals">Goals</label>
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="export-marks" checked>
                    <label class="form-check-label" for="export-marks">Marks/Grades</label>
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="export-relationships" checked>
                    <label class="form-check-label" for="export-relationships">Task-Note Relationships</label>
                </div>
            `;
            this.dataModalAction.textContent = 'Export';
            this.dataModalAction.onclick = () => this.exportData();
            this.dataModal.show();
        });
        
        // Import data
        this.importBtn.addEventListener('click', () => {
            this.dataModalTitle.textContent = 'Import Data';
            this.dataModalBody.innerHTML = `
                <p>Import your productivity data from a JSON file. This will merge with or replace your existing data.</p>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="radio" name="import-mode" id="import-merge" value="merge" checked>
                    <label class="form-check-label" for="import-merge">Merge with existing data</label>
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="radio" name="import-mode" id="import-replace" value="replace">
                    <label class="form-check-label" for="import-replace">Replace existing data</label>
                </div>
                <div class="file-upload-area" id="import-drop-area">
                    <p>Drag & drop your JSON file here or</p>
                    <input type="file" id="import-file" accept=".json" class="d-none">
                    <button class="btn btn-primary" id="import-file-btn">Select File</button>
                    <p class="mt-2" id="import-file-name"></p>
                </div>
            `;
            
            // Set up file selection
            setTimeout(() => {
                const importFileBtn = document.getElementById('import-file-btn');
                const importFile = document.getElementById('import-file');
                const importFileName = document.getElementById('import-file-name');
                const dropArea = document.getElementById('import-drop-area');
                
                importFileBtn.addEventListener('click', () => {
                    importFile.click();
                });
                
                importFile.addEventListener('change', (e) => {
                    if (e.target.files.length > 0) {
                        importFileName.textContent = e.target.files[0].name;
                    }
                });
                
                // Drag and drop functionality
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropArea.addEventListener(eventName, (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }, false);
                });
                
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropArea.addEventListener(eventName, () => {
                        dropArea.classList.add('dragover');
                    }, false);
                });
                
                ['dragleave', 'drop'].forEach(eventName => {
                    dropArea.addEventListener(eventName, () => {
                        dropArea.classList.remove('dragover');
                    }, false);
                });
                
                dropArea.addEventListener('drop', (e) => {
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        importFile.files = files;
                        importFileName.textContent = files[0].name;
                    }
                }, false);
            }, 500);
            
            this.dataModalAction.textContent = 'Import';
            this.dataModalAction.onclick = () => this.importData();
            this.dataModal.show();
        });
    }
    
    exportData() {
        // Get selected data types to export
        const exportNotes = document.getElementById('export-notes').checked;
        const exportTasks = document.getElementById('export-tasks').checked;
        const exportGoals = document.getElementById('export-goals').checked;
        const exportMarks = document.getElementById('export-marks').checked;
        const exportRelationships = document.getElementById('export-relationships').checked;
        
        // Collect data from storage
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            data: {}
        };
        
        if (exportNotes) {
            exportData.data.notes = this.storageService.getNotes();
        }
        
        if (exportTasks) {
            exportData.data.tasks = this.storageService.getTasks();
        }
        
        if (exportGoals) {
            exportData.data.goals = this.storageService.getGoals();
        }
        
        if (exportMarks) {
            exportData.data.marks = this.storageService.getMarks();
        }
        
        if (exportRelationships) {
            exportData.data.relationships = this.storageService.getRelationships();
        }
        
        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `productivity-data-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Close modal and show success message
        this.dataModal.hide();
        this.uiService.showToast('Data exported successfully!', 'success');
    }
    
    importData() {
        const importFile = document.getElementById('import-file');
        const importMode = document.querySelector('input[name="import-mode"]:checked').value;
        
        if (importFile.files.length === 0) {
            this.uiService.showToast('Please select a file to import', 'warning');
            return;
        }
        
        const file = importFile.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // Validate data format
                if (!importData.version || !importData.data) {
                    throw new Error('Invalid data format');
                }
                
                // Import data based on selected mode
                if (importMode === 'replace') {
                    // Replace all data
                    if (importData.data.notes) {
                        this.storageService.setNotes(importData.data.notes);
                    }
                    
                    if (importData.data.tasks) {
                        this.storageService.setTasks(importData.data.tasks);
                    }
                    
                    if (importData.data.goals) {
                        this.storageService.setGoals(importData.data.goals);
                    }
                    
                    if (importData.data.marks) {
                        this.storageService.setMarks(importData.data.marks);
                    }
                    
                    if (importData.data.relationships) {
                        this.storageService.setRelationships(importData.data.relationships);
                    }
                } else {
                    // Merge with existing data
                    if (importData.data.notes) {
                        this.storageService.mergeNotes(importData.data.notes);
                    }
                    
                    if (importData.data.tasks) {
                        this.storageService.mergeTasks(importData.data.tasks);
                    }
                    
                    if (importData.data.goals) {
                        this.storageService.mergeGoals(importData.data.goals);
                    }
                    
                    if (importData.data.marks) {
                        this.storageService.mergeMarks(importData.data.marks);
                    }
                    
                    if (importData.data.relationships) {
                        this.storageService.mergeRelationships(importData.data.relationships);
                    }
                }
                
                // Close modal and show success message
                this.dataModal.hide();
                this.uiService.showToast('Data imported successfully!', 'success');
                
                // Refresh all views
                this.refreshAllViews();
                
            } catch (error) {
                console.error('Import error:', error);
                this.uiService.showToast('Error importing data: ' + error.message, 'danger');
            }
        };
        
        reader.readAsText(file);
    }
    
    refreshAllViews() {
        this.dashboardController.refreshView();
        this.notesController.refreshView();
        this.tasksController.refreshView();
        this.calendarController.refreshView();
        this.goalsController.refreshView();
        this.marksController.refreshView();
    }
    
    loadInitialData() {
        // Check if this is the first run
        if (this.storageService.isFirstRun()) {
            // Load sample data for demonstration
            this.loadSampleData();
        }
    }
    
    loadSampleData() {
        // Sample notes
        const sampleNotes = [
            {
                id: 'note-1',
                title: 'Welcome to Productivity App',
                content: 'This is a sample note to help you get started with the app. You can cre
(Content truncated due to size limit. Use line ranges to read in chunks)