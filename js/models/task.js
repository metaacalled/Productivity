// Task Model
export class Task {
    constructor(data = {}) {
        this.id = data.id || 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        this.title = data.title || 'Untitled Task';
        this.description = data.description || '';
        this.dueDate = data.dueDate || null;
        this.priority = data.priority || 'medium'; // low, medium, high
        this.status = data.status || 'not-started'; // not-started, in-progress, completed, overdue
        this.category = data.category || 'General';
        this.completed = data.completed || false;
        this.completedDate = data.completedDate || null;
        this.created = data.created || new Date().toISOString();
        this.updated = data.updated || new Date().toISOString();
        this.subtasks = data.subtasks || [];
        this.recurring = data.recurring || null; // daily, weekly, monthly
        this.reminderTime = data.reminderTime || null;
        this.location = data.location || null;
    }
    
    update(data) {
        if (data.title !== undefined) this.title = data.title;
        if (data.description !== undefined) this.description = data.description;
        if (data.dueDate !== undefined) this.dueDate = data.dueDate;
        if (data.priority !== undefined) this.priority = data.priority;
        if (data.status !== undefined) this.status = data.status;
        if (data.category !== undefined) this.category = data.category;
        if (data.subtasks !== undefined) this.subtasks = data.subtasks;
        if (data.recurring !== undefined) this.recurring = data.recurring;
        if (data.reminderTime !== undefined) this.reminderTime = data.reminderTime;
        if (data.location !== undefined) this.location = data.location;
        
        // Handle completion status
        if (data.completed !== undefined && this.completed !== data.completed) {
            this.completed = data.completed;
            this.completedDate = data.completed ? new Date().toISOString() : null;
            this.status = data.completed ? 'completed' : (this.status === 'completed' ? 'in-progress' : this.status);
        }
        
        this.updated = new Date().toISOString();
    }
    
    addSubtask(title) {
        const subtask = {
            id: 'subtask-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            title: title,
            completed: false
        };
        this.subtasks.push(subtask);
        this.updated = new Date().toISOString();
        return subtask;
    }
    
    updateSubtask(subtaskId, data) {
        const index = this.subtasks.findIndex(subtask => subtask.id === subtaskId);
        if (index !== -1) {
            if (data.title !== undefined) this.subtasks[index].title = data.title;
            if (data.completed !== undefined) this.subtasks[index].completed = data.completed;
            this.updated = new Date().toISOString();
            return true;
        }
        return false;
    }
    
    removeSubtask(subtaskId) {
        const index = this.subtasks.findIndex(subtask => subtask.id === subtaskId);
        if (index !== -1) {
            this.subtasks.splice(index, 1);
            this.updated = new Date().toISOString();
            return true;
        }
        return false;
    }
    
    complete() {
        this.completed = true;
        this.completedDate = new Date().toISOString();
        this.status = 'completed';
        this.updated = new Date().toISOString();
    }
    
    uncomplete() {
        this.completed = false;
        this.completedDate = null;
        this.status = 'in-progress';
        this.updated = new Date().toISOString();
    }
    
    isOverdue() {
        if (!this.dueDate || this.completed) return false;
        return new Date(this.dueDate) < new Date();
    }
    
    getProgress() {
        if (this.completed) return 100;
        if (this.subtasks.length === 0) return this.status === 'in-progress' ? 50 : 0;
        
        const completedSubtasks = this.subtasks.filter(subtask => subtask.completed).length;
        return Math.round((completedSubtasks / this.subtasks.length) * 100);
    }
    
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            status: this.status,
            category: this.category,
            completed: this.completed,
            completedDate: this.completedDate,
            created: this.created,
            updated: this.updated,
            subtasks: this.subtasks,
            recurring: this.recurring,
            reminderTime: this.reminderTime,
            location: this.location
        };
    }
    
    static fromJSON(json) {
        return new Task(json);
    }
}
