// Marks Controller
import { Mark } from '../models/mark.js';

export class MarksController {
    constructor(storageService, uiService) {
        this.storageService = storageService;
        this.uiService = uiService;
        this.marksView = document.getElementById('marks-view');
    }
    
    init() {
        // Initialize the marks view
        this.setupMarksView();
    }
    
    setupMarksView() {
        // Create the marks view HTML structure
        this.marksView.innerHTML = `
            <div class="row mb-4">
                <div class="col-md-8">
                    <div class="input-group">
                        <input type="text" class="form-control" id="marks-search" placeholder="Search subjects...">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Filter
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" id="marks-filter-menu">
                            <li><a class="dropdown-item" href="#" data-filter="all">All Subjects</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="current">Current Term</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="past">Past Terms</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Grade Ranges</h6></li>
                            <li><a class="dropdown-item" href="#" data-filter="grade-a">A Grade (90-100%)</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="grade-b">B Grade (80-89%)</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="grade-c">C Grade (70-79%)</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="grade-d">D Grade (60-69%)</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="grade-f">F Grade (0-59%)</a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    <button class="btn btn-primary" id="new-subject-btn">
                        <i class="bi bi-plus-lg me-1"></i>New Subject
                    </button>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Subjects</h5>
                            <span class="badge bg-primary" id="subjects-count">0</span>
                        </div>
                        <div class="list-group list-group-flush" id="subjects-list">
                            <div class="text-center text-muted py-3" id="subjects-empty-message">No subjects found</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card" id="subject-detail-card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Subject Details</h5>
                            <div>
                                <button class="btn btn-sm btn-outline-danger" id="delete-subject-btn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="subject-detail-placeholder" class="text-center text-muted py-5">
                                <i class="bi bi-mortarboard display-4"></i>
                                <p class="mt-3">Select a subject to view details or create a new subject</p>
                            </div>
                            <div id="subject-detail-content" class="d-none">
                                <div class="mb-3">
                                    <input type="text" class="form-control form-control-lg" id="subject-name" placeholder="Subject Name">
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="subject-term" class="form-label">Term</label>
                                        <input type="text" class="form-control" id="subject-term" placeholder="e.g., Spring 2025">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="subject-instructor" class="form-label">Instructor</label>
                                        <input type="text" class="form-control" id="subject-instructor" placeholder="Instructor Name">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="subject-description" class="form-label">Description</label>
                                    <textarea class="form-control" id="subject-description" rows="2" placeholder="Subject Description"></textarea>
                                </div>
                                
                                <div class="mb-4">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h5>Grade Components</h5>
                                        <button class="btn btn-sm btn-outline-primary" id="add-component-btn">
                                            <i class="bi bi-plus-lg me-1"></i>Add Component
                                        </button>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-hover" id="grade-components-table">
                                            <thead>
                                                <tr>
                                                    <th>Component</th>
                                                    <th>Weight</th>
                                                    <th>Grade</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="grade-components-body">
                                                <tr>
                                                    <td colspan="4" class="text-center text-muted">No grade components added</td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr class="table-secondary">
                                                    <th>Final Grade</th>
                                                    <th>100%</th>
                                                    <th id="final-grade">N/A</th>
                                                    <th></th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <h5>Grade Trend</h5>
                                    <div class="grade-chart-container">
                                        <canvas id="grade-chart"></canvas>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="subject-notes" class="form-label">Notes</label>
                                    <textarea class="form-control" id="subject-notes" rows="3" placeholder="Additional notes about this subject"></textarea>
                                </div>
                                
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted" id="subject-last-updated"></small>
                                    <button class="btn btn-primary" id="save-subject-btn">Save Subject</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal for adding/editing grade components -->
            <div class="modal fade" id="component-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="component-modal-title">Add Grade Component</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="component-form">
                                <div class="mb-3">
                                    <label for="component-name" class="form-label">Component Name</label>
                                    <input type="text" class="form-control" id="component-name" placeholder="e.g., Midterm Exam" required>
                                </div>
                                <div class="mb-3">
                                    <label for="component-weight" class="form-label">Weight (%)</label>
                                    <input type="number" class="form-control" id="component-weight" min="1" max="100" required>
                                </div>
                                <div class="mb-3">
                                    <label for="component-grade" class="form-label">Grade (%)</label>
                                    <input type="number" class="form-control" id="component-grade" min="0" max="100">
                                </div>
                                <div class="mb-3">
                                    <label for="component-date" class="form-label">Date</label>
                                    <input type="date" class="form-control" id="component-date">
                                </div>
                                <div class="mb-3">
                                    <label for="component-notes" class="form-label">Notes</label>
                                    <textarea class="form-control" id="component-notes" rows="2"></textarea>
                                </div>
                                <input type="hidden" id="component-id">
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger d-none" id="delete-component-btn">Delete</button>
                            <button type="button" class="btn btn-primary" id="save-component-btn">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.addEventListeners();
        
        // Load Chart.js if not already loaded
        this.loadChartJs();
    }
    
    addEventListeners() {
        // New subject button
        const newSubjectBtn = document.getElementById('new-subject-btn');
        if (newSubjectBtn) {
            newSubjectBtn.addEventListener('click', () => this.createNewSubject());
        }
        
        // Save subject button
        const saveSubjectBtn = document.getElementById('save-subject-btn');
        if (saveSubjectBtn) {
            saveSubjectBtn.addEventListener('click', () => this.saveCurrentSubject());
        }
        
        // Delete subject button
        const deleteSubjectBtn = document.getElementById('delete-subject-btn');
        if (deleteSubjectBtn) {
            deleteSubjectBtn.addEventListener('click', () => this.deleteCurrentSubject());
        }
        
        // Add component button
        const addComponentBtn = document.getElementById('add-component-btn');
        if (addComponentBtn) {
            addComponentBtn.addEventListener('click', () => this.openComponentModal());
        }
        
        // Save component button
        const saveComponentBtn = document.getElementById('save-component-btn');
        if (saveComponentBtn) {
            saveComponentBtn.addEventListener('click', () => this.saveComponent());
        }
        
        // Delete component button
        const deleteComponentBtn = document.getElementById('delete-component-btn');
        if (deleteComponentBtn) {
            deleteComponentBtn.addEventListener('click', () => this.deleteComponent());
        }
        
        // Search input
        const searchInput = document.getElementById('marks-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.searchSubjects(searchInput.value));
        }
        
        // Filter menu
        const filterMenu = document.getElementById('marks-filter-menu');
        if (filterMenu) {
            filterMenu.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-filter')) {
                    const filter = e.target.getAttribute('data-filter');
                    this.filterSubjects(filter);
                }
            });
        }
    }
    
    refreshView() {
        this.loadSubjects();
    }
    
    loadSubjects() {
        const marks = this.storageService.getMarks();
        const subjectsList = document.getElementById('subjects-list');
        const subjectsCount = document.getElementById('subjects-count');
        const subjectsEmptyMessage = document.getElementById('subjects-empty-message');
        
        // Update subjects count
        if (subjectsCount) {
            subjectsCount.textContent = marks.length;
        }
        
        // Clear current list
        if (subjectsList) {
            subjectsList.innerHTML = '';
            
            if (marks.length === 0) {
                if (subjectsEmptyMessage) {
                    subjectsEmptyMessage.classList.remove('d-none');
                }
            } else {
                if (subjectsEmptyMessage) {
                    subjectsEmptyMessage.classList.add('d-none');
                }
                
                // Sort subjects by term (most recent first) and then by name
                const sortedMarks = [...marks].sort((a, b) => {
                    // First sort by term (assuming term format like "Spring 2025")
                    if (a.term && b.term) {
                        // Extract year from term
                        const yearA = a.term.match(/\d{4}/);
                        const yearB = b.term.match(/\d{4}/);
                        
                        if (yearA && yearB) {
                            const yearDiff = parseInt(yearB[0]) - parseInt(yearA[0]);
                            if (yearDiff !== 0) return yearDiff;
                        }
                        
                        // If same year or no year found, sort alphabetically by term
                        return b.term.localeCompare(a.term);
                    }
                    if (a.term && !b.term) return -1;
                    if (!a.term && b.term) return 1;
                    
                    // Then sort by name
                    return a.name.localeCompare(b.name);
                });
                
                // Add subjects to list
                sortedMarks.forEach(mark => {
                    const subjectItem = document.createElement('a');
                    subjectItem.href = '#';
                    subjectItem.className = 'list-group-item list-group-item-action subject-item';
                    subjectItem.setAttribute('data-subject-id', mark.id);
                    
                    // Calculate final grade
                    const finalGrade = this.calculateFinalGrade(mark);
                    const gradeDisplay = finalGrade !== null ? `${finalGrade}%` : 'N/A';
                    const gradeClass = this.getGradeClass(finalGrade);
                    
                    subjectItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1">${mark.name}</h6>
                                <small class="text-muted">${mark.term || 'No term specified'}</small>
                            </div>
                            <span class="badge ${gradeClass}">${gradeDisplay}</span>
                        </div>
                    `;
                    
                    subjectItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.selectSubject(mark.id);
                    });
                    
                    subjectsList.appendChild(subjectItem);
                });
            }
        }
    }
    
    createNewSubject() {
        // Create a new subject
        const newMark = new Mark({
            name: 'New Subject',
            term: this.getCurrentTerm(),
            components: []
        });
        
        // Add to storage
        this.storageService.addMark(newMark);
        
        // Refresh subjects list
        this.refreshView();
        
        // Select the new subject
        this.selectSubject(newMark.id);
        
        // Show success message
        this.uiService.showToast('New subject created', 'success');
    }
    
    selectSubject(subjectId) {
        // Get subject from storage
        const marks = this.storageService.getMarks();
        const mark = marks.find(m => m.id === subjectId);
        
        if (!mark) return;
        
        // Update UI to show selected subject
        const subjectDetailPlaceholder = document.getElementById('subject-detail-placeholder');
        const subjectDetailContent = document.getElementById('subject-detail-content');
        const subjectName = document.getElementById('subject-name');
        const subjectTerm = document.getElementById('subject-term');
        const subjectInstructor = document.getElementById('subject-instructor');
        const subjectDescription = document.getElementById('subject-description');
        const subjectNotes = document.getElementById('subject-notes');
        const subjectLastUpdated = document.getElementById('subject-last-updated');
        
        // Update subject list selection
        const subjectItems = document.querySelectorAll('.subject-item');
        subjectItems.forEach(item => {
            if (item.getAttribute('data-subject-id') === subjectId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show subject details
        if (subjectDetailPlaceholder) subjectDetailPlaceholder.classList.add('d-none');
        if (subjectDetailContent) subjectDetailContent.classList.remove('d-none');
        
        // Set subject data
        if (subjectName) subjectName.value = mark.name;
        if (subjectTerm) subjectTerm.value = mark.term || '';
        if (subjectInstructor) subjectInstructor.value = mark.instructor || '';
        if (subjectDescription) subjectDescription.value = mark.description || '';
        if (subjectNotes) subjectNotes.value = mark.notes || '';
        
        // Set last updated
        if (subjectLastUpdated) {
            subjectLastUpdated.textContent = `Last updated: ${this.uiService.formatDate(mark.updated, 'datetime')}`;
        }
        
        // Load grade components
        this.loadGradeComponents(mark);
        
        // Update grade chart
        this.updateGradeChart(mark);
        
        // Store current subject ID in the form
        subjectDetailContent.setAttribute('data-subject-id', subjectId);
    }
    
    loadGradeComponents(mark) {
        const componentsBody = document.getElementById('grade-components-body');
        const finalGradeElement = document.getElementById('final-grade');
        
        if (!componentsBody) return;
        
        // Clear current components
        componentsBody.innerHTML = '';
        
        if (!mark.components || mark.components.length === 0) {
            componentsBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No grade components added</td></tr>';
            
            // Update final grade
            if (finalGradeElement) {
                finalGradeElement.textContent = 'N/A';
                finalGradeElement.className = '';
            }
            
            return;
        }
        
        // Sort components by date (if available) or by name
        const sortedComponents = [...mark.components].sort((a, b) => {
            if (a.date && b.date) {
                return new Date(a.date) - new Date(b.date);
            }
            if (a.date && !b.date) return -1;
            if (!a.date && b.date) return 1;
            
            return a.name.localeCompare(b.name);
        });
        
        // Add components to table
        sortedComponents.forEach(component => {
            const row = document.createElement('tr');
            
            // Format date
            const dateDisplay = component.date 
                ? this.uiService.formatDate(component.date) 
                : '';
            
            // Format grade
            const gradeDisplay = component.grade !== null && component.grade !== undefined 
                ? `${component.grade}%` 
                : 'Not graded';
            
            // Calculate weighted grade
            const weightedGrade = component.grade !== null && component.grade !== undefined 
                ? (component.grade * component.weight / 100).toFixed(2) 
                : 'N/A';
            
            row.innerHTML = `
                <td>
                    <div>${component.name}</div>
                    <small class="text-muted">${dateDisplay}</small>
                </td>
                <td>${component.weight}%</td>
                <td>
                    <div>${gradeDisplay}</div>
                    <small class="text-muted">Weighted: ${weightedGrade}</small>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary edit-component-btn" data-component-id="${component.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            `;
            
            // Add event listener to edit button
            const editBtn = row.querySelector('.edit-component-btn');
            editBtn.addEventListener('click', () => {
                this.openComponentModal(component.id);
            });
            
            componentsBody.appendChild(row);
        });
        
        // Calculate and update final grade
        const finalGrade = this.calculateFinalGrade(mark);
        if (finalGradeElement) {
            if (finalGrade !== null) {
                finalGradeElement.textContent = `${finalGrade}% (${this.getLetterGrade(finalGrade)})`;
                finalGradeElement.className = this.getGradeClass(finalGrade);
            } else {
                finalGradeElement.textContent = 'N/A';
                finalGradeElement.className = '';
            }
        }
    }
    
    saveCurrentSubject() {
        const subjectDetailContent = document.getElementById('subject-detail-content');
        const subjectId = subjectDetailContent.getAttribute('data-subject-id');
        
        if (!subjectId) return;
        
        // Get subject data from form
        const subjectName = document.getElementById('subject-name').value;
        const subjectTerm = document.getElementById('subject-term').value;
        const subjectInstructor = document.getElementById('subject-instructor').value;
        const subjectDescription = document.getElementById('subject-description').value;
        const subjectNotes = document.getElementById('subject-notes').value;
        
        // Get subject from storage
        const marks = this.storageService.getMarks();
        const markIndex = marks.findIndex(m => m.id === subjectId);
        
        if (markIndex === -1) return;
        
        // Update subject
        const updatedMark = new Mark(marks[markIndex]);
        updatedMark.update({
            name: subjectName,
            term: subjectTerm,
            instructor: subjectInstructor,
            description: subjectDescription,
            notes: subjectNotes
        });
        
        // Save to storage
        this.storageService.updateMark(updatedMark);
        
        // Refresh subjects list
        this.refreshView();
        
        // Re-select the subject
        this.selectSubject(subjectId);
        
        // Show success message
        this.uiService.showToast('Subject saved successfully', 'success');
    }
    
    deleteCurrentSubject() {
        const subjectDetailContent = document.getElementById('subject-detail-content');
        const subjectId = subjectDetailContent.getAttribute('data-subject-id');
        
        if (!subjectId) return;
        
        // Confirm deletion
        this.uiService.confirmDialog('Are you sure you want to delete this subject? This action cannot be undone.', () => {
            // Delete subject
            this.storageService.deleteMark(subjectId);
            
            // Refresh subjects list
            this.refreshView();
            
            // Reset subject detail view
            const subjectDetailPlaceholder = document.getElementById('subject-detail-placeholder');
            if (subjectDetailPlaceholder) subjectDetailPlaceholder.classList.remove('d-none');
            
            if (subjectDetailContent) {
                subjectDetailContent.classList.add('d-none');
                subjectDetailContent.removeAttribute('data-subject-id');
            }
            
            // Show success message
            this.uiService.showToast('Subject deleted successfully', 'success');
        });
    }
    
    openComponentModal(componentId = null) {
        const subjectDetailContent = document.getElementById('subject-detail-content');
        const subjectId = subjectDetailContent.getAttribute('data-subject-id');
        
        if (!subjectId) return;
        
        // Get subject from storage
        const marks = this.storageService.getMarks();
        const mark = marks.find(m => m.id === subjectId);
        
        if (!mark) return;
        
        // Get modal elements
        const componentModal = new bootstrap.Modal(document.getElementById('component-modal'));
        const componentForm = document.getElementById('component-form');
        const componentName = document.getElementById('component-name');
        const componentWeight = document.getElementById('component-weight');
        const componentGrade = document.getElementById('component-grade');
        const componentDate = document.getElementById('component-date');
        const componentNotes = document.getElementById('component-notes');
        const componentId_input = document.getElementById('component-id');
        const modalTitle = document.getElementById('component-modal-title');
        const deleteComponentBtn = document.getElementById('delete-component-btn');
        
        // Reset form
        componentForm.reset();
        componentId_input.value = '';
        
        if (componentId) {
            // Edit existing component
            const component = mark.components.find(c => c.id === componentId);
            
            if (component) {
                modalTitle.textContent = 'Edit Grade Component';
                componentName.value = component.name;
                componentWeight.value = component.weight;
                
                if (component.grade !== null && component.grade !== undefined) {
                    componentGrade.value = component.grade;
                }
                
                if (component.date) {
                    // Format date for date input
                    const date = new Date(component.date);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    
                    componentDate.value = `${year}-${month}-${day}`;
                }
                
                componentNotes.value = component.notes || '';
                componentId_input.value = componentId;
                deleteComponentBtn.classList.remove('d-none');
            }
        } else {
            // New component
            modalTitle.textContent = 'Add Grade Component';
            
            // Suggest weight based on remaining weight
            const totalWeight = mark.components.reduce((sum, c) => sum + c.weight, 0);
            const remainingWeight = 100 - totalWeight;
            
            if (remainingWeight > 0) {
                componentWeight.value = remainingWeight;
            } else {
                componentWeight.value = 10; // Default weight
            }
            
            deleteComponentBtn.classList.add('d-none');
        }
        
        // Show modal
        componentModal.show();
    }
    
    saveComponent() {
        const subjectDetailContent = document.getElementById('subject-detail-content');
        const subjectId = subjectDetailContent.getAttribute('data-subject-id');
        
        if (!subjectId) return;
        
        // Get component data from form
        const componentName = document.getElementById('component-name').value;
        const componentWeight = parseFloat(document.getElementById('component-weight').value);
        const componentGrade = document.getElementById('component-grade').value 
            ? parseFloat(document.getElementById('component-grade').value) 
            : null;
        const componentDate = document.getElementById('component-date').value;
        const componentNotes = document.getElementById('component-notes').value;
        const componentId = document.getElementById('component-id').value;
        
        // Validate form
        if (!componentName || isNaN(componentWeight)) {
            this.uiService.showToast('Please fill in all required fields', 'warning');
            return;
        }
        
        // Get subject from storage
        const marks = this.storageService.getMarks();
        const markIndex = marks.findIndex(m => m.id === subjectId);
        
        if (markIndex === -1) return;
        
        const mark = marks[markIndex];
        const updatedMark = new Mark(mark);
        
        // Check if total weight exceeds 100%
        let totalWeight = mark.components.reduce((sum, c) => sum + c.weight, 0);
        
        if (componentId) {
            // Editing existing component
            const existingComponent = mark.components.find(c => c.id === componentId);
            if (existingComponent) {
                totalWeight -= existingComponent.weight;
            }
        }
        
        totalWeight += componentWeight;
        
        if (totalWeight > 100) {
            this.uiService.showToast(`Total weight exceeds 100% (${totalWeight}%). Please adjust the weight.`, 'warning');
            return;
        }
        
        // Create component data
        const componentData = {
            name: componentName,
            weight: componentWeight,
            grade: componentGrade,
            date: componentDate ? new Date(componentDate).toISOString() : null,
            notes: componentNotes
        };
        
        if (componentId) {
            // Update existing component
            updatedMark.updateComponent(componentId, componentData);
        } else {
            // Add new component
            updatedMark.addComponent(componentData);
        }
        
        // Save to storage
        this.storageService.updateMark(updatedMark);
        
        // Close modal
        const componentModal = bootstrap.Modal.getInstance(document.getElementById('component-modal'));
        componentModal.hide();
        
        // Refresh subject view
        this.selectSubject(subjectId);
        
        // Show success message
        this.uiService.showToast('Grade component saved successfully', 'success');
    }
    
    deleteComponent() {
        const subjectDetailContent = document.getElementById('subject-detail-content');
        const subjectId = subjectDetailContent.getAttribute('data-subject-id');
        const componentId = document.getElementById('component-id').value;
        
        if (!subjectId || !componentId) return;
        
        // Confirm deletion
        this.uiService.confirmDialog('Are you sure you want to delete this grade component? This action cannot be undone.', () => {
            // Get subject from storage
            const marks = this.storageService.getMarks();
            const markIndex = marks.findIndex(m => m.id === subjectId);
            
            if (markIndex === -1) return;
            
            // Remove component
            const updatedMark = new Mark(marks[markIndex]);
            updatedMark.removeComponent(componentId);
            
            // Save to storage
            this.storageService.updateMark(updatedMark);
            
            // Close modal
            const componentModal = bootstrap.Modal.getInstance(document.getElementById('component-modal'));
            componentModal.hide();
            
            // Refresh subject view
            this.selectSubject(subjectId);
            
            // Show success message
            this.uiService.showToast('Grade component deleted successfully', 'success');
        });
    }
    
    updateGradeChart(mark) {
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.log('Chart.js not loaded yet');
            return;
        }
        
        const chartCanvas = document.getElementById('grade-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (this.gradeChart) {
            this.gradeChart.destroy();
        }
        
        // If no components with grades, show message
        if (!mark.components || mark.components.length === 0 || !mark.components.some(c => c.grade !== null && c.grade !== undefined)) {
            chartCanvas.style.display = 'none';
            const container = chartCanvas.parentElement;
            
            // Check if message already exists
            let message = container.querySelector('.no-data-message');
            if (!message) {
                message = document.createElement('p');
                message.className = 'text-center text-muted no-data-message';
                message.textContent = 'No grade data available to display chart';
                container.appendChild(message);
            }
            
            return;
        }
        
        // Show canvas and remove any no-data message
        chartCanvas.style.display = 'block';
        const noDataMessage = chartCanvas.parentElement.querySelector('.no-data-message');
        if (noDataMessage) {
            noDataMessage.remove();
        }
        
        // Sort components by date (if available) or by name
        const sortedComponents = [...mark.components]
            .filter(c => c.grade !== null && c.grade !== undefined)
            .sort((a, b) => {
                if (a.date && b.date) {
                    return new Date(a.date) - new Date(b.date);
                }
                if (a.date && !b.date) return -1;
                if (!a.date && b.date) return 1;
                
                return a.name.localeCompare(b.name);
            });
        
        // Prepare data for chart
        const labels = sortedComponents.map(c => c.name);
        const grades = sortedComponents.map(c => c.grade);
        
        // Calculate running average
        const runningAvg = [];
        let sum = 0;
        
        for (let i = 0; i < grades.length; i++) {
            sum += grades[i];
            runningAvg.push(sum / (i + 1));
        }
        
        // Create chart
        this.gradeChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Grade',
                        data: grades,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointRadius: 4
                    },
                    {
                        label: 'Running Average',
                        data: runningAvg,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Grade (%)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                return `${label}: ${value}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    searchSubjects(query) {
        if (!query) {
            // If query is empty, show all subjects
            this.loadSubjects();
            return;
        }
        
        // Get all subjects
        const marks = this.storageService.getMarks();
        
        // Filter subjects by query
        const filteredMarks = marks.filter(mark => {
            const nameMatch = mark.name.toLowerCase().includes(query.toLowerCase());
            const termMatch = mark.term && mark.term.toLowerCase().includes(query.toLowerCase());
            const instructorMatch = mark.instructor && mark.instructor.toLowerCase().includes(query.toLowerCase());
            const descriptionMatch = mark.description && mark.description.toLowerCase().includes(query.toLowerCase());
            
            return nameMatch || termMatch || instructorMatch || descriptionMatch;
        });
        
        // Update subjects list with filtered subjects
        this.displayFilteredSubjects(filteredMarks);
    }
    
    filterSubjects(filter) {
        // Get all subjects
        const marks = this.storageService.getMarks();
        
        // Filter subjects based on selected filter
        let filteredMarks = [];
        
        switch (filter) {
            case 'all':
                filteredMarks = marks;
                break;
            case 'current':
                const currentTerm = this.getCurrentTerm();
                filteredMarks = marks.filter(mark => mark.term === currentTerm);
                break;
            case 'past':
                const currentTerm = this.getCurrentTerm();
                filteredMarks = marks.filter(mark => mark.term !== currentTerm);
                break;
            case 'grade-a':
                filteredMarks = marks.filter(mark => {
                    const finalGrade = this.calculateFinalGrade(mark);
                    return finalGrade !== null && finalGrade >= 90;
                });
                break;
            case 'grade-b':
                filteredMarks = marks.filter(mark => {
                    const finalGrade = this.calculateFinalGrade(mark);
                    return finalGrade !== null && finalGrade >= 80 && finalGrade < 90;
                });
                break;
            case 'grade-c':
                filteredMarks = marks.filter(mark => {
                    const finalGrade = this.calculateFinalGrade(mark);
                    return finalGrade !== null && finalGrade >= 70 && finalGrade < 80;
                });
                break;
            case 'grade-d':
                filteredMarks = marks.filter(mark => {
                    const finalGrade = this.calculateFinalGrade(mark);
                    return finalGrade !== null && finalGrade >= 60 && finalGrade < 70;
                });
                break;
            case 'grade-f':
                filteredMarks = marks.filter(mark => {
                    const finalGrade = this.calculateFinalGrade(mark);
                    return finalGrade !== null && finalGrade < 60;
                });
                break;
            default:
                filteredMarks = marks;
        }
        
        // Update subjects list with filtered subjects
        this.displayFilteredSubjects(filteredMarks);
    }
    
    displayFilteredSubjects(filteredMarks) {
        const subjectsList = document.getElementById('subjects-list');
        const subjectsEmptyMessage = document.getElementById('subjects-empty-message');
        
        // Clear current list
        if (subjectsList) {
            subjectsList.innerHTML = '';
            
            if (filteredMarks.length === 0) {
                if (subjectsEmptyMessage) {
                    subjectsEmptyMessage.classList.remove('d-none');
                    subjectsEmptyMessage.textContent = 'No subjects match your search';
                }
            } else {
                if (subjectsEmptyMessage) {
                    subjectsEmptyMessage.classList.add('d-none');
                }
                
                // Sort subjects by term (most recent first) and then by name
                const sortedMarks = [...filteredMarks].sort((a, b) => {
                    // First sort by term (assuming term format like "Spring 2025")
                    if (a.term && b.term) {
                        // Extract year from term
                        const yearA = a.term.match(/\d{4}/);
                        const yearB = b.term.match(/\d{4}/);
                        
                        if (yearA && yearB) {
                            const yearDiff = parseInt(yearB[0]) - parseInt(yearA[0]);
                            if (yearDiff !== 0) return yearDiff;
                        }
                        
                        // If same year or no year found, sort alphabetically by term
                        return b.term.localeCompare(a.term);
                    }
                    if (a.term && !b.term) return -1;
                    if (!a.term && b.term) return 1;
                    
                    // Then sort by name
                    return a.name.localeCompare(b.name);
                });
                
                // Add subjects to list
                sortedMarks.forEach(mark => {
                    const subjectItem = document.createElement('a');
                    subjectItem.href = '#';
                    subjectItem.className = 'list-group-item list-group-item-action subject-item';
                    subjectItem.setAttribute('data-subject-id', mark.id);
                    
                    // Calculate final grade
                    const finalGrade = this.calculateFinalGrade(mark);
                    const gradeDisplay = finalGrade !== null ? `${finalGrade}%` : 'N/A';
                    const gradeClass = this.getGradeClass(finalGrade);
                    
                    subjectItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1">${mark.name}</h6>
                                <small class="text-muted">${mark.term || 'No term specified'}</small>
                            </div>
                            <span class="badge ${gradeClass}">${gradeDisplay}</span>
                        </div>
                    `;
                    
                    subjectItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.selectSubject(mark.id);
                    });
                    
                    subjectsList.appendChild(subjectItem);
                });
            }
        }
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
    
    getGradeClass(grade) {
        if (grade === null || grade === undefined) return 'bg-secondary';
        
        if (grade >= 90) return 'bg-success';
        if (grade >= 80) return 'bg-primary';
        if (grade >= 70) return 'bg-info';
        if (grade >= 60) return 'bg-warning';
        return 'bg-danger';
    }
    
    getCurrentTerm() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        // Determine current term based on month
        let term;
        if (month >= 0 && month <= 4) {
            term = 'Spring';
        } else if (month >= 5 && month <= 7) {
            term = 'Summer';
        } else {
            term = 'Fall';
        }
        
        return `${term} ${year}`;
    }
    
    loadChartJs() {
        // Check if Chart.js is already loaded
        if (typeof Chart !== 'undefined') {
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
            
            // Refresh current subject view if a subject is selected
            const subjectDetailContent = document.getElementById('subject-detail-content');
            if (subjectDetailContent && !subjectDetailContent.classList.contains('d-none')) {
                const subjectId = subjectDetailContent.getAttribute('data-subject-id');
                if (subjectId) {
                    this.selectSubject(subjectId);
                }
            }
        };
    }
}
