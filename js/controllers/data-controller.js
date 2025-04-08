// Data Export/Import Controller
export class DataController {
    constructor(storageService, uiService) {
        this.storageService = storageService;
        this.uiService = uiService;
        this.dataView = document.getElementById('data-view');
    }
    
    init() {
        // Initialize the data view
        this.setupDataView();
    }
    
    setupDataView() {
        // Create the data view HTML structure
        this.dataView.innerHTML = `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Data Export & Import</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">
                                Export your data to a JSON file for backup or transfer to another device. 
                                You can also import data from a previously exported file.
                            </p>
                            
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h5 class="mb-0">Export Data</h5>
                                        </div>
                                        <div class="card-body">
                                            <p>Select what data you want to export:</p>
                                            
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="export-all" checked>
                                                <label class="form-check-label" for="export-all">
                                                    <strong>All Data</strong>
                                                </label>
                                            </div>
                                            
                                            <div class="ms-4">
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input export-option" type="checkbox" id="export-notes" checked>
                                                    <label class="form-check-label" for="export-notes">
                                                        Notes
                                                    </label>
                                                </div>
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input export-option" type="checkbox" id="export-tasks" checked>
                                                    <label class="form-check-label" for="export-tasks">
                                                        Tasks
                                                    </label>
                                                </div>
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input export-option" type="checkbox" id="export-relationships" checked>
                                                    <label class="form-check-label" for="export-relationships">
                                                        Task-Note Relationships
                                                    </label>
                                                </div>
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input export-option" type="checkbox" id="export-goals" checked>
                                                    <label class="form-check-label" for="export-goals">
                                                        Goals
                                                    </label>
                                                </div>
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input export-option" type="checkbox" id="export-marks" checked>
                                                    <label class="form-check-label" for="export-marks">
                                                        Marks/Grades
                                                    </label>
                                                </div>
                                            </div>
                                            
                                            <div class="mt-3">
                                                <button class="btn btn-primary" id="export-btn">
                                                    <i class="bi bi-download me-1"></i>Export Data
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h5 class="mb-0">Import Data</h5>
                                        </div>
                                        <div class="card-body">
                                            <p>Import data from a previously exported file:</p>
                                            
                                            <div class="mb-3">
                                                <label for="import-file" class="form-label">Select JSON File</label>
                                                <input class="form-control" type="file" id="import-file" accept=".json">
                                            </div>
                                            
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="import-merge" checked>
                                                <label class="form-check-label" for="import-merge">
                                                    Merge with existing data (recommended)
                                                </label>
                                            </div>
                                            <div class="form-check mb-3">
                                                <input class="form-check-input" type="checkbox" id="import-replace">
                                                <label class="form-check-label" for="import-replace">
                                                    Replace all existing data (caution: this will delete current data)
                                                </label>
                                            </div>
                                            
                                            <div class="alert alert-info" role="alert">
                                                <i class="bi bi-info-circle me-2"></i>
                                                When merging, items with the same ID will be updated with the imported data.
                                            </div>
                                            
                                            <div class="mt-3">
                                                <button class="btn btn-primary" id="import-btn" disabled>
                                                    <i class="bi bi-upload me-1"></i>Import Data
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Data Statistics</h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-4 mb-3">
                                            <div class="card bg-light">
                                                <div class="card-body text-center">
                                                    <h3 id="notes-count">0</h3>
                                                    <p class="mb-0">Notes</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <div class="card bg-light">
                                                <div class="card-body text-center">
                                                    <h3 id="tasks-count">0</h3>
                                                    <p class="mb-0">Tasks</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <div class="card bg-light">
                                                <div class="card-body text-center">
                                                    <h3 id="goals-count">0</h3>
                                                    <p class="mb-0">Goals</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <div class="card bg-light">
                                                <div class="card-body text-center">
                                                    <h3 id="marks-count">0</h3>
                                                    <p class="mb-0">Subjects</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <div class="card bg-light">
                                                <div class="card-body text-center">
                                                    <h3 id="relationships-count">0</h3>
                                                    <p class="mb-0">Task-Note Relationships</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <p class="mb-0">
                                            <small class="text-muted" id="storage-usage">
                                                Local Storage Usage: Calculating...
                                            </small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.addEventListeners();
        
        // Update data statistics
        this.updateDataStatistics();
    }
    
    addEventListeners() {
        // Export all checkbox
        const exportAll = document.getElementById('export-all');
        if (exportAll) {
            exportAll.addEventListener('change', () => {
                const exportOptions = document.querySelectorAll('.export-option');
                exportOptions.forEach(option => {
                    option.checked = exportAll.checked;
                    option.disabled = exportAll.checked;
                });
            });
        }
        
        // Export options
        const exportOptions = document.querySelectorAll('.export-option');
        exportOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateExportAllCheckbox();
            });
        });
        
        // Export button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        // Import file input
        const importFile = document.getElementById('import-file');
        if (importFile) {
            importFile.addEventListener('change', () => {
                const importBtn = document.getElementById('import-btn');
                if (importBtn) {
                    importBtn.disabled = !importFile.files.length;
                }
            });
        }
        
        // Import merge/replace options
        const importMerge = document.getElementById('import-merge');
        const importReplace = document.getElementById('import-replace');
        
        if (importMerge && importReplace) {
            importMerge.addEventListener('change', () => {
                if (importMerge.checked) {
                    importReplace.checked = false;
                }
            });
            
            importReplace.addEventListener('change', () => {
                if (importReplace.checked) {
                    importMerge.checked = false;
                }
            });
        }
        
        // Import button
        const importBtn = document.getElementById('import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importData());
        }
    }
    
    updateExportAllCheckbox() {
        const exportAll = document.getElementById('export-all');
        const exportOptions = document.querySelectorAll('.export-option');
        
        let allChecked = true;
        exportOptions.forEach(option => {
            if (!option.checked) {
                allChecked = false;
            }
        });
        
        if (exportAll) {
            exportAll.checked = allChecked;
        }
    }
    
    updateDataStatistics() {
        // Update counts
        const notesCount = document.getElementById('notes-count');
        const tasksCount = document.getElementById('tasks-count');
        const goalsCount = document.getElementById('goals-count');
        const marksCount = document.getElementById('marks-count');
        const relationshipsCount = document.getElementById('relationships-count');
        const storageUsage = document.getElementById('storage-usage');
        
        if (notesCount) {
            notesCount.textContent = this.storageService.getNotes().length;
        }
        
        if (tasksCount) {
            tasksCount.textContent = this.storageService.getTasks().length;
        }
        
        if (goalsCount) {
            goalsCount.textContent = this.storageService.getGoals().length;
        }
        
        if (marksCount) {
            marksCount.textContent = this.storageService.getMarks().length;
        }
        
        if (relationshipsCount) {
           
(Content truncated due to size limit. Use line ranges to read in chunks)