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
            
(Content truncated due to size limit. Use line ranges to read in chunks)