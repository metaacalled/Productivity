// Relationship Controller for managing task-note relationships
import { Relationship } from '../models/relationship.js';

export class RelationshipController {
    constructor(storageService, uiService) {
        this.storageService = storageService;
        this.uiService = uiService;
    }
    
    init() {
        // Initialize relationships if needed
        this.ensureRelationshipsIntegrity();
    }
    
    // Make sure relationships are valid (no orphaned relationships)
    ensureRelationshipsIntegrity() {
        const relationships = this.storageService.getRelationships();
        const tasks = this.storageService.getTasks();
        const notes = this.storageService.getNotes();
        
        const taskIds = new Set(tasks.map(task => task.id));
        const noteIds = new Set(notes.map(note => note.id));
        
        // Filter out relationships with invalid task or note IDs
        const validRelationships = relationships.filter(rel => 
            taskIds.has(rel.taskId) && noteIds.has(rel.noteId)
        );
        
        // Update storage if any invalid relationships were found
        if (validRelationships.length !== relationships.length) {
            this.storageService.setRelationships(validRelationships);
            console.log(`Removed ${relationships.length - validRelationships.length} invalid relationships`);
        }
    }
    
    // Get all relationships for a task
    getRelationshipsForTask(taskId) {
        const relationships = this.storageService.getRelationships();
        return relationships.filter(rel => rel.taskId === taskId);
    }
    
    // Get all relationships for a note
    getRelationshipsForNote(noteId) {
        const relationships = this.storageService.getRelationships();
        return relationships.filter(rel => rel.noteId === noteId);
    }
    
    // Get all notes linked to a task
    getNotesForTask(taskId) {
        const relationships = this.getRelationshipsForTask(taskId);
        const noteIds = relationships.map(rel => rel.noteId);
        const notes = this.storageService.getNotes();
        
        return notes.filter(note => noteIds.includes(note.id));
    }
    
    // Get all tasks linked to a note
    getTasksForNote(noteId) {
        const relationships = this.getRelationshipsForNote(noteId);
        const taskIds = relationships.map(rel => rel.taskId);
        const tasks = this.storageService.getTasks();
        
        return tasks.filter(task => taskIds.includes(task.id));
    }
    
    // Create a new relationship between a task and a note
    createRelationship(taskId, noteId, type = 'reference', description = '') {
        // Check if relationship already exists
        const relationships = this.storageService.getRelationships();
        const existingRel = relationships.find(rel => 
            rel.taskId === taskId && rel.noteId === noteId
        );
        
        if (existingRel) {
            // Update existing relationship if needed
            if (existingRel.type !== type || existingRel.description !== description) {
                const updatedRel = new Relationship(existingRel);
                updatedRel.update({
                    type: type,
                    description: description
                });
                
                this.storageService.updateRelationship(updatedRel);
                return updatedRel;
            }
            
            return existingRel;
        }
        
        // Create new relationship
        const newRelationship = new Relationship({
            taskId: taskId,
            noteId: noteId,
            type: type,
            description: description
        });
        
        this.storageService.addRelationship(newRelationship);
        return newRelationship;
    }
    
    // Delete a relationship
    deleteRelationship(relationshipId) {
        return this.storageService.deleteRelationship(relationshipId);
    }
    
    // Delete all relationships for a task
    deleteRelationshipsForTask(taskId) {
        const relationships = this.storageService.getRelationships();
        const filteredRelationships = relationships.filter(rel => rel.taskId !== taskId);
        
        if (filteredRelationships.length !== relationships.length) {
            this.storageService.setRelationships(filteredRelationships);
            return true;
        }
        
        return false;
    }
    
    // Delete all relationships for a note
    deleteRelationshipsForNote(noteId) {
        const relationships = this.storageService.getRelationships();
        const filteredRelationships = relationships.filter(rel => rel.noteId !== noteId);
        
        if (filteredRelationships.length !== relationships.length) {
            this.storageService.setRelationships(filteredRelationships);
            return true;
        }
        
        return false;
    }
    
    // Render linked notes for a task
    renderLinkedNotesForTask(taskId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const notes = this.getNotesForTask(taskId);
        const relationships = this.getRelationshipsForTask(taskId);
        
        // Clear container
        container.innerHTML = '';
        
        if (notes.length === 0) {
            container.innerHTML = '<p class="text-muted small">No notes linked to this task</p>';
            return;
        }
        
        // Create note elements
        notes.forEach(note => {
            const relationship = relationships.find(rel => rel.noteId === note.id);
            
            const noteElement = document.createElement('div');
            noteElement.className = 'linked-note mb-2 p-2 border rounded';
            noteElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${note.title}</h6>
                        <p class="mb-0 small text-truncate">${note.content}</p>
                        ${note.tags.length > 0 ? `<div class="mt-1">${this.uiService.createTagElements(note.tags)}</div>` : ''}
                        ${relationship.description ? `<div class="mt-1 small text-muted">${relationship.description}</div>` : ''}
                    </div>
                    <button type="button" class="btn-close btn-close-sm" aria-label="Remove link" data-relationship-id="${relationship.id}"></button>
                </div>
            `;
            
            // Add event listener to view note
            noteElement.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-close')) {
                    this.navigateToNote(note.id);
                }
            });
            
            // Add event listener to remove link
            const removeBtn = noteElement.querySelector('.btn-close');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const relId = e.target.getAttribute('data-relationship-id');
                this.deleteRelationship(relId);
                this.renderLinkedNotesForTask(taskId, containerId);
                this.uiService.showToast('Note link removed', 'success');
            });
            
            container.appendChild(noteElement);
        });
    }
    
    // Render linked tasks for a note
    renderLinkedTasksForNote(noteId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const tasks = this.getTasksForNote(noteId);
        const relationships = this.getRelationshipsForNote(noteId);
        
        // Clear container
        container.innerHTML = '';
        
        if (tasks.length === 0) {
            container.innerHTML = '<p class="text-muted small">No tasks linked to this note</p>';
            return;
        }
        
        // Create task elements
        tasks.forEach(task => {
            const relationship = relationships.find(rel => rel.taskId === task.id);
            
            const taskElement = document.createElement('div');
            taskElement.className = `linked-task mb-2 p-2 border rounded ${task.priority}-priority`;
            
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
            
            taskElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1 ${task.completed ? 'text-decoration-line-through' : ''}">${task.title}</h6>
                        <div class="d-flex align-items-center">
                            ${this.uiService.createPriorityBadge(task.priority)}
                            <span class="badge bg-secondary ms-1">${task.category || 'General'}</span>
                            ${overdueLabel}
                        </div>
                        ${dueDateText}
                        ${relationship.description ? `<div class="mt-1 small text-muted">${relationship.description}</div>` : ''}
                    </div>
                    <button type="button" class="btn-close btn-close-sm" aria-label="Remove link" data-relationship-id="${relationship.id}"></button>
                </div>
            `;
            
            // Add event listener to view task
            taskElement.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-close')) {
                    this.navigateToTask(task.id);
                }
            });
            
            // Add event listener to remove link
            const removeBtn = taskElement.querySelector('.btn-close');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const relId = e.target.getAttribute('data-relationship-id');
                this.deleteRelationship(relId);
                this.renderLinkedTasksForNote(noteId, containerId);
                this.uiService.showToast('Task link removed', 'success');
            });
            
            container.appendChild(taskElement);
        });
    }
    
    // Navigate to a note (switch to notes view and select the note)
    navigateToNote(noteId) {
        // Switch to notes view
        const notesLink = document.querySelector('.nav-link[data-view="notes"]');
        if (notesLink) {
            notesLink.click();
            
            // Wait for notes view to load
            setTimeout(() => {
                // Find and select the note
                const noteItem = document.querySelector(`.note-item[data-note-id="${noteId}"]`);
                if (noteItem) {
                    noteItem.click();
                }
            }, 100);
        }
    }
    
    // Navigate to a task (switch to tasks view and select the task)
    navigateToTask(taskId) {
        // Switch to tasks view
        const tasksLink = document.querySelector('.nav-link[data-view="tasks"]');
        if (tasksLink) {
            tasksLink.click();
            
            // Wait for tasks view to load
            setTimeout(() => {
                // Find and select the task
                const taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
                if (taskItem) {
                    taskItem.click();
                }
            }, 100);
        }
    }
    
    // Show modal to link a note to a task
    showLinkNoteToTaskModal(taskId, onLinkCreated = null) {
        // Get all notes
        const notes = this.storageService.getNotes();
        
        // Get existing relationships for this task
        const relationships = this.getRelationshipsForTask(taskId);
        const linkedNoteIds = relationships.map(rel => rel.noteId);
        
        // Filter out already linked notes
        const availableNotes = notes.filter(note => !linkedNoteIds.includes(note.id));
        
        // Create modal HTML
        const modalId = 'link-note-modal-' + Date.now();
        const modalHtml = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Link a Note</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="${modalId}-search" placeholder="Search notes...">
                            </div>
                            <div class="list-group" id="${modalId}-list">
                                ${availableNotes.length === 0 ? 
                                    '<div class="text-center text-muted py-3">No available notes to link</div>' : 
                                    ''}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Initialize modal
        const modalElement = document.getElementById(modalId);
        const modal = new bootstrap.Modal(modalElement);
        
        // Add notes to list
        const notesList = document.getElementById(`${modalId}-list`);
        const notesSearch = document.getElementById(`${modalId}-search`);
        
        if (availableNotes.length > 0) {
            this.renderNotesList(availableNotes, notesList, (noteId) => {
                this.createRelationship(taskId, noteId);
                modal.hide();
                if (onLinkCreated) onLinkCreated();
            });
        }
        
        // Add search functionality
        notesSearch.addEventListener('input', () => {
            const query = notesSearch.value.toLowerCase();
            
            // Filter notes by query
            const filteredNotes = availableNotes.filter(note => {
                const titleMatch = note.title.toLowerCase().includes(query);
                const contentMatch = note.content.toLowerCase().includes(query);
                const tagMatch = note.tags.some(tag => tag.toLowerCase().includes(query));
                
                return titleMatch || contentMatch || tagMatch;
            });
            
            // Update list
            this.renderNotesList(filteredNotes, notesList, (noteId) => {
                this.createRelationship(taskId, noteId);
                modal.hide();
                if (onLinkCreated) onLinkCreated();
            });
        });
        
        // Add event listener to remove modal from DOM when hidden
        modalElement.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modalContainer);
        });
        
        //
(Content truncated due to size limit. Use line ranges to read in chunks)