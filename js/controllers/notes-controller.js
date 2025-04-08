// Notes Controller
import { Note } from '../models/note.js';

export class NotesController {
    constructor(storageService, uiService) {
        this.storageService = storageService;
        this.uiService = uiService;
        this.notesView = document.getElementById('notes-view');
    }
    
    init() {
        // Initialize the notes view
        this.setupNotesView();
    }
    
    setupNotesView() {
        // Create the notes view HTML structure
        this.notesView.innerHTML = `
            <div class="row mb-4">
                <div class="col-md-8">
                    <div class="input-group">
                        <input type="text" class="form-control" id="notes-search" placeholder="Search notes...">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Filter
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" id="notes-filter-menu">
                            <li><a class="dropdown-item" href="#" data-filter="all">All Notes</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="active">Active Notes</a></li>
                            <li><a class="dropdown-item" href="#" data-filter="archived">Archived Notes</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Tags</h6></li>
                            <div id="tag-filters"></div>
                        </ul>
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    <button class="btn btn-primary" id="new-note-btn">
                        <i class="bi bi-plus-lg me-1"></i>New Note
                    </button>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Notes</h5>
                            <span class="badge bg-primary" id="notes-count">0</span>
                        </div>
                        <div class="list-group list-group-flush" id="notes-list">
                            <div class="text-center text-muted py-3" id="notes-empty-message">No notes found</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card" id="note-detail-card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Note Details</h5>
                            <div>
                                <button class="btn btn-sm btn-outline-secondary me-1" id="archive-note-btn">
                                    <i class="bi bi-archive"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" id="delete-note-btn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="note-detail-placeholder" class="text-center text-muted py-5">
                                <i class="bi bi-journal-text display-4"></i>
                                <p class="mt-3">Select a note to view details or create a new note</p>
                            </div>
                            <div id="note-detail-content" class="d-none">
                                <div class="mb-3">
                                    <input type="text" class="form-control form-control-lg" id="note-title" placeholder="Note Title">
                                </div>
                                <div class="mb-3">
                                    <textarea class="form-control" id="note-content" rows="10" placeholder="Note Content"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="note-tags" class="form-label">Tags</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="note-tags" placeholder="Add tags (comma separated)">
                                        <button class="btn btn-outline-secondary" id="add-tag-btn">Add</button>
                                    </div>
                                    <div class="mt-2" id="note-tags-container"></div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted" id="note-last-updated"></small>
                                    <button class="btn btn-primary" id="save-note-btn">Save Note</button>
                                </div>
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
        // New note button
        const newNoteBtn = document.getElementById('new-note-btn');
        if (newNoteBtn) {
            newNoteBtn.addEventListener('click', () => this.createNewNote());
        }
        
        // Save note button
        const saveNoteBtn = document.getElementById('save-note-btn');
        if (saveNoteBtn) {
            saveNoteBtn.addEventListener('click', () => this.saveCurrentNote());
        }
        
        // Archive note button
        const archiveNoteBtn = document.getElementById('archive-note-btn');
        if (archiveNoteBtn) {
            archiveNoteBtn.addEventListener('click', () => this.toggleArchiveCurrentNote());
        }
        
        // Delete note button
        const deleteNoteBtn = document.getElementById('delete-note-btn');
        if (deleteNoteBtn) {
            deleteNoteBtn.addEventListener('click', () => this.deleteCurrentNote());
        }
        
        // Add tag button
        const addTagBtn = document.getElementById('add-tag-btn');
        if (addTagBtn) {
            addTagBtn.addEventListener('click', () => this.addTagToCurrentNote());
        }
        
        // Search input
        const searchInput = document.getElementById('notes-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.searchNotes(searchInput.value));
        }
        
        // Filter menu
        const filterMenu = document.getElementById('notes-filter-menu');
        if (filterMenu) {
            filterMenu.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-filter')) {
                    const filter = e.target.getAttribute('data-filter');
                    this.filterNotes(filter);
                }
            });
        }
    }
    
    refreshView() {
        this.loadNotes();
        this.updateTagFilters();
    }
    
    loadNotes() {
        const notes = this.storageService.getNotes();
        const notesList = document.getElementById('notes-list');
        const notesCount = document.getElementById('notes-count');
        const notesEmptyMessage = document.getElementById('notes-empty-message');
        
        // Update notes count
        if (notesCount) {
            notesCount.textContent = notes.length;
        }
        
        // Clear current list
        if (notesList) {
            notesList.innerHTML = '';
            
            if (notes.length === 0) {
                if (notesEmptyMessage) {
                    notesEmptyMessage.classList.remove('d-none');
                }
            } else {
                if (notesEmptyMessage) {
                    notesEmptyMessage.classList.add('d-none');
                }
                
                // Sort notes by updated date (newest first)
                const sortedNotes = [...notes].sort((a, b) => new Date(b.updated) - new Date(a.updated));
                
                // Add notes to list
                sortedNotes.forEach(note => {
                    const noteItem = document.createElement('a');
                    noteItem.href = '#';
                    noteItem.className = `list-group-item list-group-item-action note-item ${note.archived ? 'text-muted' : ''}`;
                    noteItem.setAttribute('data-note-id', note.id);
                    
                    const tagsHtml = note.tags.length > 0 
                        ? `<div class="mt-1">${this.uiService.createTagElements(note.tags)}</div>` 
                        : '';
                    
                    noteItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <h6 class="mb-1">${note.title}</h6>
                            ${note.archived ? '<span class="badge bg-secondary">Archived</span>' : ''}
                        </div>
                        <p class="mb-1 text-truncate">${note.content}</p>
                        ${tagsHtml}
                        <small class="text-muted">${this.uiService.formatDate(note.updated, 'relative')}</small>
                    `;
                    
                    noteItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.selectNote(note.id);
                    });
                    
                    notesList.appendChild(noteItem);
                });
            }
        }
    }
    
    updateTagFilters() {
        const notes = this.storageService.getNotes();
        const tagFiltersContainer = document.getElementById('tag-filters');
        
        if (tagFiltersContainer) {
            // Get all unique tags
            const allTags = new Set();
            notes.forEach(note => {
                note.tags.forEach(tag => allTags.add(tag));
            });
            
            // Clear current filters
            tagFiltersContainer.innerHTML = '';
            
            // Add tag filters
            if (allTags.size === 0) {
                tagFiltersContainer.innerHTML = '<li><a class="dropdown-item disabled" href="#">No tags found</a></li>';
            } else {
                Array.from(allTags).sort().forEach(tag => {
                    const tagItem = document.createElement('li');
                    tagItem.innerHTML = `<a class="dropdown-item" href="#" data-filter-tag="${tag}">${tag}</a>`;
                    tagItem.querySelector('a').addEventListener('click', () => this.filterNotesByTag(tag));
                    tagFiltersContainer.appendChild(tagItem);
                });
            }
        }
    }
    
    createNewNote() {
        // Create a new note
        const newNote = new Note();
        
        // Add to storage
        this.storageService.addNote(newNote);
        
        // Refresh notes list
        this.refreshView();
        
        // Select the new note
        this.selectNote(newNote.id);
        
        // Show success message
        this.uiService.showToast('New note created', 'success');
    }
    
    selectNote(noteId) {
        // Get note from storage
        const notes = this.storageService.getNotes();
        const note = notes.find(n => n.id === noteId);
        
        if (!note) return;
        
        // Update UI to show selected note
        const noteDetailPlaceholder = document.getElementById('note-detail-placeholder');
        const noteDetailContent = document.getElementById('note-detail-content');
        const noteTitle = document.getElementById('note-title');
        const noteContent = document.getElementById('note-content');
        const noteTagsContainer = document.getElementById('note-tags-container');
        const noteLastUpdated = document.getElementById('note-last-updated');
        const archiveNoteBtn = document.getElementById('archive-note-btn');
        
        // Update note list selection
        const noteItems = document.querySelectorAll('.note-item');
        noteItems.forEach(item => {
            if (item.getAttribute('data-note-id') === noteId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show note details
        if (noteDetailPlaceholder) noteDetailPlaceholder.classList.add('d-none');
        if (noteDetailContent) noteDetailContent.classList.remove('d-none');
        
        // Set note data
        if (noteTitle) noteTitle.value = note.title;
        if (noteContent) noteContent.value = note.content;
        
        // Set archive button text
        if (archiveNoteBtn) {
            if (note.archived) {
                archiveNoteBtn.innerHTML = '<i class="bi bi-archive-fill"></i>';
                archiveNoteBtn.title = 'Unarchive Note';
            } else {
                archiveNoteBtn.innerHTML = '<i class="bi bi-archive"></i>';
                archiveNoteBtn.title = 'Archive Note';
            }
        }
        
        // Set tags
        if (noteTagsContainer) {
            noteTagsContainer.innerHTML = '';
            note.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag bg-primary bg-opacity-10 text-primary me-1 mb-1';
                tagElement.innerHTML = `
                    ${tag}
                    <button type="button" class="btn-close btn-close-sm ms-1" aria-label="Remove tag"></button>
                `;
                
                // Add event listener to remove tag
                tagElement.querySelector('.btn-close').addEventListener('click', () => {
                    this.removeTagFromNote(noteId, tag);
                });
                
                noteTagsContainer.appendChild(tagElement);
            });
        }
        
        // Set last updated
        if (noteLastUpdated) {
            noteLastUpdated.textContent = `Last updated: ${this.uiService.formatDate(note.updated, 'datetime')}`;
        }
        
        // Store current note ID in the form
        noteDetailContent.setAttribute('data-note-id', noteId);
    }
    
    saveCurrentNote() {
        const noteDetailContent = document.getElementById('note-detail-content');
        const noteId = noteDetailContent.getAttribute('data-note-id');
        
        if (!noteId) return;
        
        // Get note data from form
        const noteTitle = document.getElementById('note-title').value;
        const noteContent = document.getElementById('note-content').value;
        
        // Get note from storage
        const notes = this.storageService.getNotes();
        const noteIndex = notes.findIndex(n => n.id === noteId);
        
        if (noteIndex === -1) return;
        
        // Update note
        const updatedNote = new Note(notes[noteIndex]);
        updatedNote.update({
            title: noteTitle,
            content: noteContent
        });
        
        // Save to storage
        this.storageService.updateNote(updatedNote);
        
        // Refresh notes list
        this.refreshView();
        
        // Re-select the note
        this.selectNote(noteId);
        
        // Show success message
        this.uiService.showToast('Note saved successfully', 'success');
    }
    
    toggleArchiveCurrentNote() {
        const noteDetailContent = document.getElementById('note-detail-content');
        const noteId = noteDetailContent.getAttribute('data-note-id');
        
        if (!noteId) return;
        
        // Get note from storage
        const notes = this.storageService.getNotes();
        const noteIndex = notes.findIndex(n => n.id === noteId);
        
        if (noteIndex === -1) return;
        
        // Toggle archive status
        const updatedNote = new Note(notes[noteIndex]);
        updatedNote.update({
            archived: !updatedNote.archived
        });
        
        // Save to storage
        this.storageService.updateNote(updatedNote);
        
        // Refresh notes list
        this.refreshView();
        
        // Re-select the note
        this.selectNote(noteId);
        
        // Show success message
        const action = updatedNote.archived ? 'archived' : 'unarchived';
        this.uiService.showToast(`Note ${action} successfully`, 'success');
    }
    
    deleteCurrentNote() {
        const noteDetailContent = document.getElementById('note-detail-content');
        const noteId = noteDetailContent.getAttribute('data-note-id');
        
        if (!noteId) return;
        
        // Confirm deletion
        this.uiService.confirmDialog('Are you sure you want to delete this note? This action cannot be undone.', () => {
            // Delete note
            this.storageService.deleteNote(noteId);
            
            // Refresh notes list
            this.refreshView();
            
            // Reset note detail view
            const noteDetailPlaceholder = document.getElementById('note-detail-placeholder');
            if (noteDetailPlaceholder) noteDetailPlaceholder.classList.remove('d-none');
            
            if (noteDetailContent) {
                noteDetailContent.classList.add('d-none');
                noteDetailContent.removeAttribute('data-note-id');
            }
            
            // Show success message
            this.uiService.showToast('Note deleted successfully', 'success');
        });
    }
    
    addTagToCurrentNote() {
        const noteDetailContent = document.getElementById('note-detail-content');
        const noteId = noteDetailContent.getAttribute('data-note-id');
        const tagInput = document.getElementById('note-tags');
        
        if (!noteId || !tagInput) return;
        
        // Get tags from input
        const tagsText = tagInput.value.trim();
        if (!tagsText) return;
        
        // Split by comma and trim
        const newTags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        // Get note from storage
        const notes = this.storageService.getNotes();
        const noteIndex = notes.findIndex(n => n.id === noteId);
        
        if (noteIndex === -1) return;
        
        // Update note with new tags
        const updatedNote = new Note(notes[noteIndex]);
        
        // Add each tag if it doesn't already exist
        newTags.forEach(tag => {
            if (!updatedNote.tags.includes(tag)) {
                updatedNote.addTag(tag);
            }
        });
        
        // Save to storage
        this.storageService.updateNote(updatedNote);
        
        // Clear tag input
        tagInput.value = '';
        
        // Refresh notes list
        this.refreshView();
        
        // Re-select the note
        this.selectNote(noteId);
    }
    
    removeTagFromNote(noteId, tagToRemove) {
        // Get note from storage
        const notes = this.storageService.getNotes();
        const noteIndex = notes.findIndex(n => n.id === noteId);
        
        if (noteIndex === -1) return;
        
        // Update note by removing tag
        const updatedNote = new Note(notes[noteIndex]);
        updatedNote.removeTag(tagToRemove);
        
        // Save to storage
        this.storageService.updateNote(updatedNote);
        
        // Refresh notes list
        this.refreshView();
        
        // Re-select the note
        this.selectNote(noteId);
    }
    
    searchNotes(query) {
        if (!query) {
            // If query is empty, show all notes
            this.loadNotes();
            return;
        }
        
        // Get all notes
        const notes = this.storageService.getNotes();
        
        // Filter notes by query
        const filteredNotes = notes.filter(note => {
            const titleMatch = note.title.toLowerCase().includes(query.toLowerCase());
            const contentMatch = note.content.toLowerCase().includes(query.toLowerCase());
            const tagMatch = note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
            
            return titleMatch || contentMatch || tagMatch;
        });
        
        // Update notes list with filtered notes
        this.displayFilteredNotes(filteredNotes);
    }
    
    filterNotes(filter) {
        // Get all notes
        const notes = this.storageService.getNotes();
        
        // Filter notes based on selected filter
        let filteredNotes = [];
        
        switch (filter) {
            case 'all':
                filteredNotes = notes;
                break;
            case 'active':
                filteredNotes = notes.filter(note => !note.archived);
                break;
            case 'archived':
                filteredNotes = notes.filter(note => note.archived);
                break;
            default:
                filteredNotes = notes;
        }
        
        // Update notes list with filtered notes
        this.displayFilteredNotes(filteredNotes);
    }
    
    filterNotesByTag(tag) {
        // Get all notes
        const notes = this.storageService.getNotes();
        
        // Filter notes by tag
        const filteredNotes = notes.filter(note => note.tags.includes(tag));
        
        // Update notes list with filtered notes
        this.displayFilteredNotes(filteredNotes);
    }
    
    displayFilteredNotes(filteredNotes) {
        const notesList = document.getElementById('notes-list');
        const notesEmptyMessage = document.getElementById('notes-empty-message');
        
        // Clear current list
        if (notesList) {
            notesList.innerHTML = '';
            
            if (filteredNotes.length === 0) {
                if (notesEmptyMessage) {
                    notesEmptyMessage.classList.remove('d-none');
                    notesEmptyMessage.textContent = 'No notes match your search';
                }
            } else {
                if (notesEmptyMessage) {
                    notesEmptyMessage.classList.add('d-none');
                }
                
                // Sort notes by updated date (newest first)
                const sortedNotes = [...filteredNotes].sort((a, b) => new Date(b.updated) - new Date(a.updated));
                
                // Add notes to list
                sortedNotes.forEach(note => {
                    const noteItem = document.createElement('a');
                    noteItem.href = '#';
                    noteItem.className = `list-group-item list-group-item-action note-item ${note.archived ? 'text-muted' : ''}`;
                    noteItem.setAttribute('data-note-id', note.id);
                    
                    const tagsHtml = note.tags.length > 0 
                        ? `<div class="mt-1">${this.uiService.createTagElements(note.tags)}</div>` 
                        : '';
                    
                    noteItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <h6 class="mb-1">${note.title}</h6>
                            ${note.archived ? '<span class="badge bg-secondary">Archived</span>' : ''}
                        </div>
                        <p class="mb-1 text-truncate">${note.content}</p>
                        ${tagsHtml}
                        <small class="text-muted">${this.uiService.formatDate(note.updated, 'relative')}</small>
                    `;
                    
                    noteItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.selectNote(note.id);
                    });
                    
                    notesList.appendChild(noteItem);
                });
            }
        }
    }
}
