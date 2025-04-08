// Storage Service for handling data persistence
export class StorageService {
    constructor() {
        this.storagePrefix = 'productivity_app_';
        this.storageKeys = {
            notes: this.storagePrefix + 'notes',
            tasks: this.storagePrefix + 'tasks',
            goals: this.storagePrefix + 'goals',
            marks: this.storagePrefix + 'marks',
            relationships: this.storagePrefix + 'relationships',
            settings: this.storagePrefix + 'settings',
            firstRun: this.storagePrefix + 'first_run'
        };
    }
    
    // Check if this is the first run of the application
    isFirstRun() {
        return localStorage.getItem(this.storageKeys.firstRun) !== 'false';
    }
    
    setFirstRun(value) {
        localStorage.setItem(this.storageKeys.firstRun, value.toString());
    }
    
    // Notes CRUD operations
    getNotes() {
        const notes = localStorage.getItem(this.storageKeys.notes);
        return notes ? JSON.parse(notes) : [];
    }
    
    setNotes(notes) {
        localStorage.setItem(this.storageKeys.notes, JSON.stringify(notes));
    }
    
    addNote(note) {
        const notes = this.getNotes();
        notes.push(note);
        this.setNotes(notes);
    }
    
    updateNote(updatedNote) {
        const notes = this.getNotes();
        const index = notes.findIndex(note => note.id === updatedNote.id);
        if (index !== -1) {
            notes[index] = updatedNote;
            this.setNotes(notes);
            return true;
        }
        return false;
    }
    
    deleteNote(noteId) {
        const notes = this.getNotes();
        const filteredNotes = notes.filter(note => note.id !== noteId);
        if (filteredNotes.length < notes.length) {
            this.setNotes(filteredNotes);
            return true;
        }
        return false;
    }
    
    mergeNotes(newNotes) {
        const currentNotes = this.getNotes();
        const mergedNotes = [...currentNotes];
        
        newNotes.forEach(newNote => {
            const existingIndex = mergedNotes.findIndex(note => note.id === newNote.id);
            if (existingIndex !== -1) {
                // Update existing note
                mergedNotes[existingIndex] = newNote;
            } else {
                // Add new note
                mergedNotes.push(newNote);
            }
        });
        
        this.setNotes(mergedNotes);
    }
    
    // Tasks CRUD operations
    getTasks() {
        const tasks = localStorage.getItem(this.storageKeys.tasks);
        return tasks ? JSON.parse(tasks) : [];
    }
    
    setTasks(tasks) {
        localStorage.setItem(this.storageKeys.tasks, JSON.stringify(tasks));
    }
    
    addTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        this.setTasks(tasks);
    }
    
    updateTask(updatedTask) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            tasks[index] = updatedTask;
            this.setTasks(tasks);
            return true;
        }
        return false;
    }
    
    deleteTask(taskId) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        if (filteredTasks.length < tasks.length) {
            this.setTasks(filteredTasks);
            return true;
        }
        return false;
    }
    
    mergeTasks(newTasks) {
        const currentTasks = this.getTasks();
        const mergedTasks = [...currentTasks];
        
        newTasks.forEach(newTask => {
            const existingIndex = mergedTasks.findIndex(task => task.id === newTask.id);
            if (existingIndex !== -1) {
                // Update existing task
                mergedTasks[existingIndex] = newTask;
            } else {
                // Add new task
                mergedTasks.push(newTask);
            }
        });
        
        this.setTasks(mergedTasks);
    }
    
    // Goals CRUD operations
    getGoals() {
        const goals = localStorage.getItem(this.storageKeys.goals);
        return goals ? JSON.parse(goals) : [];
    }
    
    setGoals(goals) {
        localStorage.setItem(this.storageKeys.goals, JSON.stringify(goals));
    }
    
    addGoal(goal) {
        const goals = this.getGoals();
        goals.push(goal);
        this.setGoals(goals);
    }
    
    updateGoal(updatedGoal) {
        const goals = this.getGoals();
        const index = goals.findIndex(goal => goal.id === updatedGoal.id);
        if (index !== -1) {
            goals[index] = updatedGoal;
            this.setGoals(goals);
            return true;
        }
        return false;
    }
    
    deleteGoal(goalId) {
        const goals = this.getGoals();
        const filteredGoals = goals.filter(goal => goal.id !== goalId);
        if (filteredGoals.length < goals.length) {
            this.setGoals(filteredGoals);
            return true;
        }
        return false;
    }
    
    mergeGoals(newGoals) {
        const currentGoals = this.getGoals();
        const mergedGoals = [...currentGoals];
        
        newGoals.forEach(newGoal => {
            const existingIndex = mergedGoals.findIndex(goal => goal.id === newGoal.id);
            if (existingIndex !== -1) {
                // Update existing goal
                mergedGoals[existingIndex] = newGoal;
            } else {
                // Add new goal
                mergedGoals.push(newGoal);
            }
        });
        
        this.setGoals(mergedGoals);
    }
    
    // Marks CRUD operations
    getMarks() {
        const marks = localStorage.getItem(this.storageKeys.marks);
        return marks ? JSON.parse(marks) : [];
    }
    
    setMarks(marks) {
        localStorage.setItem(this.storageKeys.marks, JSON.stringify(marks));
    }
    
    addMark(mark) {
        const marks = this.getMarks();
        marks.push(mark);
        this.setMarks(marks);
    }
    
    updateMark(updatedMark) {
        const marks = this.getMarks();
        const index = marks.findIndex(mark => mark.id === updatedMark.id);
        if (index !== -1) {
            marks[index] = updatedMark;
            this.setMarks(marks);
            return true;
        }
        return false;
    }
    
    deleteMark(markId) {
        const marks = this.getMarks();
        const filteredMarks = marks.filter(mark => mark.id !== markId);
        if (filteredMarks.length < marks.length) {
            this.setMarks(filteredMarks);
            return true;
        }
        return false;
    }
    
    mergeMarks(newMarks) {
        const currentMarks = this.getMarks();
        const mergedMarks = [...currentMarks];
        
        newMarks.forEach(newMark => {
            const existingIndex = mergedMarks.findIndex(mark => mark.id === newMark.id);
            if (existingIndex !== -1) {
                // Update existing mark
                mergedMarks[existingIndex] = newMark;
            } else {
                // Add new mark
                mergedMarks.push(newMark);
            }
        });
        
        this.setMarks(mergedMarks);
    }
    
    // Relationships CRUD operations
    getRelationships() {
        const relationships = localStorage.getItem(this.storageKeys.relationships);
        return relationships ? JSON.parse(relationships) : [];
    }
    
    setRelationships(relationships) {
        localStorage.setItem(this.storageKeys.relationships, JSON.stringify(relationships));
    }
    
    addRelationship(relationship) {
        const relationships = this.getRelationships();
        relationships.push(relationship);
        this.setRelationships(relationships);
    }
    
    updateRelationship(updatedRelationship) {
        const relationships = this.getRelationships();
        const index = relationships.findIndex(rel => rel.id === updatedRelationship.id);
        if (index !== -1) {
            relationships[index] = updatedRelationship;
            this.setRelationships(relationships);
            return true;
        }
        return false;
    }
    
    deleteRelationship(relationshipId) {
        const relationships = this.getRelationships();
        const filteredRelationships = relationships.filter(rel => rel.id !== relationshipId);
        if (filteredRelationships.length < relationships.length) {
            this.setRelationships(filteredRelationships);
            return true;
        }
        return false;
    }
    
    mergeRelationships(newRelationships) {
        const currentRelationships = this.getRelationships();
        const mergedRelationships = [...currentRelationships];
        
        newRelationships.forEach(newRel => {
            const existingIndex = mergedRelationships.findIndex(rel => rel.id === newRel.id);
            if (existingIndex !== -1) {
                // Update existing relationship
                mergedRelationships[existingIndex] = newRel;
            } else {
                // Add new relationship
                mergedRelationships.push(newRel);
            }
        });
        
        this.setRelationships(mergedRelationships);
    }
    
    // Settings operations
    getSettings() {
        const settings = localStorage.getItem(this.storageKeys.settings);
        return settings ? JSON.parse(settings) : {
            theme: 'light',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            defaultView: 'dashboard',
            notifications: true
        };
    }
    
    setSettings(settings) {
        localStorage.setItem(this.storageKeys.settings, JSON.stringify(settings));
    }
    
    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.setSettings(settings);
    }
    
    // Data export/import
    exportAllData() {
        return {
            notes: this.getNotes(),
            tasks: this.getTasks(),
            goals: this.getGoals(),
            marks: this.getMarks(),
            relationships: this.getRelationships(),
            settings: this.getSettings()
        };
    }
    
    importAllData(data, replace = false) {
        if (replace) {
            // Replace all data
            if (data.notes) this.setNotes(data.notes);
            if (data.tasks) this.setTasks(data.tasks);
            if (data.goals) this.setGoals(data.goals);
            if (data.marks) this.setMarks(data.marks);
            if (data.relationships) this.setRelationships(data.relationships);
            if (data.settings) this.setSettings(data.settings);
        } else {
            // Merge with existing data
            if (data.notes) this.mergeNotes(data.notes);
            if (data.tasks) this.mergeTasks(data.tasks);
            if (data.goals) this.mergeGoals(data.goals);
            if (data.marks) this.mergeMarks(data.marks);
            if (data.relationships) this.mergeRelationships(data.relationships);
            
            // For settings, we'll merge individual properties
            if (data.settings) {
                const currentSettings = this.getSettings();
                this.setSettings({...currentSettings, ...data.settings});
            }
        }
    }
    
    // Clear all data
    clearAllData() {
        localStorage.removeItem(this.storageKeys.notes);
        localStorage.removeItem(this.storageKeys.tasks);
        localStorage.removeItem(this.storageKeys.goals);
        localStorage.removeItem(this.storageKeys.marks);
        localStorage.removeItem(this.storageKeys.relationships);
        // Don't clear settings or firstRun flag
    }
}
