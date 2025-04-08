// Mark/Grade Model
export class Mark {
    constructor(data = {}) {
        this.id = data.id || 'mark-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        this.title = data.title || 'Untitled Mark';
        this.category = data.category || 'General';
        this.date = data.date || new Date().toISOString();
        this.score = data.score !== undefined ? data.score : 0;
        this.maxScore = data.maxScore !== undefined ? data.maxScore : 100;
        this.weight = data.weight !== undefined ? data.weight : 1;
        this.notes = data.notes || '';
        this.created = data.created || new Date().toISOString();
        this.updated = data.updated || new Date().toISOString();
    }
    
    update(data) {
        if (data.title !== undefined) this.title = data.title;
        if (data.category !== undefined) this.category = data.category;
        if (data.date !== undefined) this.date = data.date;
        if (data.score !== undefined) this.score = data.score;
        if (data.maxScore !== undefined) this.maxScore = data.maxScore;
        if (data.weight !== undefined) this.weight = data.weight;
        if (data.notes !== undefined) this.notes = data.notes;
        
        this.updated = new Date().toISOString();
    }
    
    getPercentage() {
        return (this.score / this.maxScore) * 100;
    }
    
    getGrade() {
        const percentage = this.getPercentage();
        
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    }
    
    getWeightedScore() {
        return (this.score / this.maxScore) * this.weight;
    }
    
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            category: this.category,
            date: this.date,
            score: this.score,
            maxScore: this.maxScore,
            weight: this.weight,
            notes: this.notes,
            created: this.created,
            updated: this.updated
        };
    }
    
    static fromJSON(json) {
        return new Mark(json);
    }
}
