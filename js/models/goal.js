// Goal Model
export class Goal {
    constructor(data = {}) {
        this.id = data.id || 'goal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        this.title = data.title || 'Untitled Goal';
        this.description = data.description || '';
        this.targetDate = data.targetDate || null;
        this.progress = data.progress || 0;
        this.category = data.category || 'Personal';
        this.completed = data.completed || false;
        this.completedDate = data.completedDate || null;
        this.created = data.created || new Date().toISOString();
        this.updated = data.updated || new Date().toISOString();
        this.milestones = data.milestones || [];
        this.recurring = data.recurring || null; // daily, weekly, monthly
        this.streakCount = data.streakCount || 0;
        this.lastUpdated = data.lastUpdated || null;
    }
    
    update(data) {
        if (data.title !== undefined) this.title = data.title;
        if (data.description !== undefined) this.description = data.description;
        if (data.targetDate !== undefined) this.targetDate = data.targetDate;
        if (data.progress !== undefined) this.progress = data.progress;
        if (data.category !== undefined) this.category = data.category;
        if (data.milestones !== undefined) this.milestones = data.milestones;
        if (data.recurring !== undefined) this.recurring = data.recurring;
        
        // Handle completion status
        if (data.completed !== undefined && this.completed !== data.completed) {
            this.completed = data.completed;
            this.completedDate = data.completed ? new Date().toISOString() : null;
            if (data.completed) this.progress = 100;
        }
        
        // Update streak if applicable
        if (this.recurring && data.progress !== undefined) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
            
            if (this.lastUpdated !== today) {
                this.lastUpdated = today;
                
                // Check if the last update was yesterday for daily goals
                if (this.recurring === 'daily') {
                    const yesterday = new Date(now);
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toISOString();
                    
                    if (this.lastUpdated === yesterdayStr) {
                        this.streakCount++;
                    } else {
                        this.streakCount = 1; // Reset streak
                    }
                }
                // For weekly and monthly goals, we'd need more complex logic
            }
        }
        
        this.updated = new Date().toISOString();
    }
    
    addMilestone(title) {
        const milestone = {
            id: 'milestone-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            title: title,
            completed: false
        };
        this.milestones.push(milestone);
        this.updated = new Date().toISOString();
        return milestone;
    }
    
    updateMilestone(milestoneId, data) {
        const index = this.milestones.findIndex(milestone => milestone.id === milestoneId);
        if (index !== -1) {
            if (data.title !== undefined) this.milestones[index].title = data.title;
            if (data.completed !== undefined) this.milestones[index].completed = data.completed;
            this.updated = new Date().toISOString();
            
            // Update progress based on milestones
            if (this.milestones.length > 0) {
                const completedMilestones = this.milestones.filter(m => m.completed).length;
                this.progress = Math.round((completedMilestones / this.milestones.length) * 100);
                
                // Check if all milestones are completed
                if (completedMilestones === this.milestones.length) {
                    this.completed = true;
                    this.completedDate = new Date().toISOString();
                } else {
                    this.completed = false;
                    this.completedDate = null;
                }
            }
            
            return true;
        }
        return false;
    }
    
    removeMilestone(milestoneId) {
        const index = this.milestones.findIndex(milestone => milestone.id === milestoneId);
        if (index !== -1) {
            this.milestones.splice(index, 1);
            this.updated = new Date().toISOString();
            
            // Update progress based on remaining milestones
            if (this.milestones.length > 0) {
                const completedMilestones = this.milestones.filter(m => m.completed).length;
                this.progress = Math.round((completedMilestones / this.milestones.length) * 100);
            }
            
            return true;
        }
        return false;
    }
    
    complete() {
        this.completed = true;
        this.completedDate = new Date().toISOString();
        this.progress = 100;
        
        // Complete all milestones
        this.milestones.forEach(milestone => {
            milestone.completed = true;
        });
        
        this.updated = new Date().toISOString();
    }
    
    uncomplete() {
        this.completed = false;
        this.completedDate = null;
        
        // Update progress based on milestones
        if (this.milestones.length > 0) {
            const completedMilestones = this.milestones.filter(m => m.completed).length;
            this.progress = Math.round((completedMilestones / this.milestones.length) * 100);
        } else {
            this.progress = 0;
        }
        
        this.updated = new Date().toISOString();
    }
    
    isOverdue() {
        if (!this.targetDate || this.completed) return false;
        return new Date(this.targetDate) < new Date();
    }
    
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            targetDate: this.targetDate,
            progress: this.progress,
            category: this.category,
            completed: this.completed,
            completedDate: this.completedDate,
            created: this.created,
            updated: this.updated,
            milestones: this.milestones,
            recurring: this.recurring,
            streakCount: this.streakCount,
            lastUpdated: this.lastUpdated
        };
    }
    
    static fromJSON(json) {
        return new Goal(json);
    }
}
