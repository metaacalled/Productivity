// Relationship Model for Task-Note connections
export class Relationship {
    constructor(data = {}) {
        this.id = data.id || 'rel-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        this.taskId = data.taskId || null;
        this.noteId = data.noteId || null;
        this.type = data.type || 'reference'; // reference, dependency, etc.
        this.created = data.created || new Date().toISOString();
        this.updated = data.updated || new Date().toISOString();
        this.description = data.description || '';
    }
    
    update(data) {
        if (data.taskId !== undefined) this.taskId = data.taskId;
        if (data.noteId !== undefined) this.noteId = data.noteId;
        if (data.type !== undefined) this.type = data.type;
        if (data.description !== undefined) this.description = data.description;
        
        this.updated = new Date().toISOString();
    }
    
    toJSON() {
        return {
            id: this.id,
            taskId: this.taskId,
            noteId: this.noteId,
            type: this.type,
            created: this.created,
            updated: this.updated,
            description: this.description
        };
    }
    
    static fromJSON(json) {
        return new Relationship(json);
    }
}
