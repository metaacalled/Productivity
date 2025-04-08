// Note Model
export class Note {
    constructor(data = {}) {
        this.id = data.id || 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        this.title = data.title || 'Untitled Note';
        this.content = data.content || '';
        this.tags = data.tags || [];
        this.created = data.created || new Date().toISOString();
        this.updated = data.updated || new Date().toISOString();
        this.archived = data.archived || false;
        this.attachments = data.attachments || []; // For future file attachment support
    }
    
    update(data) {
        if (data.title !== undefined) this.title = data.title;
        if (data.content !== undefined) this.content = data.content;
        if (data.tags !== undefined) this.tags = data.tags;
        if (data.archived !== undefined) this.archived = data.archived;
        if (data.attachments !== undefined) this.attachments = data.attachments;
        this.updated = new Date().toISOString();
    }
    
    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
            this.updated = new Date().toISOString();
        }
    }
    
    removeTag(tag) {
        const index = this.tags.indexOf(tag);
        if (index !== -1) {
            this.tags.splice(index, 1);
            this.updated = new Date().toISOString();
        }
    }
    
    archive() {
        this.archived = true;
        this.updated = new Date().toISOString();
    }
    
    unarchive() {
        this.archived = false;
        this.updated = new Date().toISOString();
    }
    
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            tags: this.tags,
            created: this.created,
            updated: this.updated,
            archived: this.archived,
            attachments: this.attachments
        };
    }
    
    static fromJSON(json) {
        return new Note(json);
    }
}
