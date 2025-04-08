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
            relationshipsCount.textContent = this.storageService.getRelationships().length;
        }
        
        // Calculate storage usage
        if (storageUsage) {
            try {
                let totalSize = 0;
                
                // Calculate size of each data type
                const notes = this.storageService.getNotes();
                const tasks = this.storageService.getTasks();
                const goals = this.storageService.getGoals();
                const marks = this.storageService.getMarks();
                const relationships = this.storageService.getRelationships();
                
                totalSize += this.getJsonSize(notes);
                totalSize += this.getJsonSize(tasks);
                totalSize += this.getJsonSize(goals);
                totalSize += this.getJsonSize(marks);
                totalSize += this.getJsonSize(relationships);
                
                // Format size
                const formattedSize = this.formatBytes(totalSize);
                
                storageUsage.textContent = `Local Storage Usage: ${formattedSize}`;
            } catch (error) {
                console.error('Error calculating storage usage:', error);
                storageUsage.textContent = 'Local Storage Usage: Unable to calculate';
            }
        }
    }
    
    getJsonSize(data) {
        try {
            const json = JSON.stringify(data);
            return new Blob([json]).size;
        } catch (error) {
            console.error('Error calculating JSON size:', error);
            return 0;
        }
    }
    
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    exportData() {
        try {
            // Get export options
            const exportAll = document.getElementById('export-all').checked;
            const exportNotes = exportAll || document.getElementById('export-notes').checked;
            const exportTasks = exportAll || document.getElementById('export-tasks').checked;
            const exportRelationships = exportAll || document.getElementById('export-relationships').checked;
            const exportGoals = exportAll || document.getElementById('export-goals').checked;
            const exportMarks = exportAll || document.getElementById('export-marks').checked;
            
            // Prepare export data
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
            
            if (exportRelationships) {
                exportData.data.relationships = this.storageService.getRelationships();
            }
            
            if (exportGoals) {
                exportData.data.goals = this.storageService.getGoals();
            }
            
            if (exportMarks) {
                exportData.data.marks = this.storageService.getMarks();
            }
            
            // Convert to JSON
            const jsonData = JSON.stringify(exportData, null, 2);
            
            // Create download link
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create filename with date
            const date = new Date();
            const dateStr = date.toISOString().split('T')[0];
            const filename = `productivity_app_export_${dateStr}.json`;
            
            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            // Show success message
            this.uiService.showToast('Data exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.uiService.showToast('Error exporting data: ' + error.message, 'danger');
        }
    }
    
    importData() {
        try {
            // Get import file
            const importFile = document.getElementById('import-file');
            
            if (!importFile.files.length) {
                this.uiService.showToast('Please select a file to import', 'warning');
                return;
            }
            
            // Get import options
            const importMerge = document.getElementById('import-merge').checked;
            const importReplace = document.getElementById('import-replace').checked;
            
            if (!importMerge && !importReplace) {
                this.uiService.showToast('Please select either merge or replace option', 'warning');
                return;
            }
            
            // Read file
            const file = importFile.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    // Parse JSON
                    const importData = JSON.parse(event.target.result);
                    
                    // Validate data format
                    if (!importData.version || !importData.data) {
                        throw new Error('Invalid file format');
                    }
                    
                    // Confirm import if replacing data
                    if (importReplace) {
                        this.uiService.confirmDialog(
                            'This will replace all your existing data. This action cannot be undone. Are you sure you want to continue?',
                            () => this.processImport(importData, importMerge, importReplace)
                        );
                    } else {
                        this.processImport(importData, importMerge, importReplace);
                    }
                } catch (error) {
                    console.error('Error parsing import file:', error);
                    this.uiService.showToast('Error parsing import file: ' + error.message, 'danger');
                }
            };
            
            reader.onerror = (error) => {
                console.error('Error reading import file:', error);
                this.uiService.showToast('Error reading import file', 'danger');
            };
            
            reader.readAsText(file);
        } catch (error) {
            console.error('Error importing data:', error);
            this.uiService.showToast('Error importing data: ' + error.message, 'danger');
        }
    }
    
    processImport(importData, merge, replace) {
        try {
            // Process import based on options
            if (replace) {
                // Replace all data
                if (importData.data.notes) {
                    this.storageService.setNotes(importData.data.notes);
                } else {
                    this.storageService.setNotes([]);
                }
                
                if (importData.data.tasks) {
                    this.storageService.setTasks(importData.data.tasks);
                } else {
                    this.storageService.setTasks([]);
                }
                
                if (importData.data.relationships) {
                    this.storageService.setRelationships(importData.data.relationships);
                } else {
                    this.storageService.setRelationships([]);
                }
                
                if (importData.data.goals) {
                    this.storageService.setGoals(importData.data.goals);
                } else {
                    this.storageService.setGoals([]);
                }
                
                if (importData.data.marks) {
                    this.storageService.setMarks(importData.data.marks);
                } else {
                    this.storageService.setMarks([]);
                }
            } else if (merge) {
                // Merge data
                if (importData.data.notes) {
                    this.mergeData('notes', importData.data.notes);
                }
                
                if (importData.data.tasks) {
                    this.mergeData('tasks', importData.data.tasks);
                }
                
                if (importData.data.relationships) {
                    this.mergeData('relationships', importData.data.relationships);
                }
                
                if (importData.data.goals) {
                    this.mergeData('goals', importData.data.goals);
                }
                
                if (importData.data.marks) {
                    this.mergeData('marks', importData.data.marks);
                }
            }
            
            // Update data statistics
            this.updateDataStatistics();
            
            // Reset import file input
            const importFile = document.getElementById('import-file');
            if (importFile) {
                importFile.value = '';
            }
            
            // Disable import button
            const importBtn = document.getElementById('import-btn');
            if (importBtn) {
                importBtn.disabled = true;
            }
            
            // Show success message
            this.uiService.showToast('Data imported successfully', 'success');
            
            // Trigger app refresh
            window.dispatchEvent(new CustomEvent('app-data-imported'));
        } catch (error) {
            console.error('Error processing import:', error);
            this.uiService.showToast('Error processing import: ' + error.message, 'danger');
        }
    }
    
    mergeData(type, importItems) {
        // Get current items
        let currentItems;
        
        switch (type) {
            case 'notes':
                currentItems = this.storageService.getNotes();
                break;
            case 'tasks':
                currentItems = this.storageService.getTasks();
                break;
            case 'relationships':
                currentItems = this.storageService.getRelationships();
                break;
            case 'goals':
                currentItems = this.storageService.getGoals();
                break;
            case 'marks':
                currentItems = this.storageService.getMarks();
                break;
            default:
                return;
        }
        
        // Create map of current items by ID
        const currentItemsMap = new Map();
        currentItems.forEach(item => {
            currentItemsMap.set(item.id, item);
        });
        
        // Process import items
        importItems.forEach(importItem => {
            if (currentItemsMap.has(importItem.id)) {
                // Update existing item
                const currentItem = currentItemsMap.get(importItem.id);
                
                // Compare updated timestamps if available
                if (importItem.updated && currentItem.updated) {
                    const importDate = new Date(importItem.updated);
                    const currentDate = new Date(currentItem.updated);
                    
                    // Only update if import item is newer
                    if (importDate <= currentDate) {
                        return;
                    }
                }
                
                // Update item in map
                currentItemsMap.set(importItem.id, importItem);
            } else {
                // Add new item to map
                currentItemsMap.set(importItem.id, importItem);
            }
        });
        
        // Convert map back to array
        const mergedItems = Array.from(currentItemsMap.values());
        
        // Save merged items
        switch (type) {
            case 'notes':
                this.storageService.setNotes(mergedItems);
                break;
            case 'tasks':
                this.storageService.setTasks(mergedItems);
                break;
            case 'relationships':
                this.storageService.setRelationships(mergedItems);
                break;
            case 'goals':
                this.storageService.setGoals(mergedItems);
                break;
            case 'marks':
                this.storageService.setMarks(mergedItems);
                break;
        }
    }
}
