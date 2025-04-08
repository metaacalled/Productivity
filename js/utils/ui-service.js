// UI Service for handling UI-related operations
export class UIService {
    constructor() {
        this.toastContainer = null;
        this.initToastContainer();
    }
    
    initToastContainer() {
        // Create toast container if it doesn't exist
        if (!document.querySelector('.toast-container')) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        } else {
            this.toastContainer = document.querySelector('.toast-container');
        }
    }
    
    // Show a toast notification
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast show bg-${type} text-white`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">${this.capitalizeFirstLetter(type)}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Auto-remove toast after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                this.toastContainer.removeChild(toast);
            }, 300);
        }, duration);
        
        // Add click event to close button
        const closeButton = toast.querySelector('.btn-close');
        closeButton.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                this.toastContainer.removeChild(toast);
            }, 300);
        });
    }
    
    // Create a modal dialog
    createModal(title, content, primaryButtonText, onPrimaryClick, secondaryButtonText = 'Cancel') {
        const modalId = 'dynamic-modal-' + Date.now();
        const modalHtml = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${secondaryButtonText}</button>
                            <button type="button" class="btn btn-primary" id="${modalId}-primary">${primaryButtonText}</button>
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
        
        // Add event listener to primary button
        const primaryButton = document.getElementById(`${modalId}-primary`);
        primaryButton.addEventListener('click', () => {
            onPrimaryClick();
            modal.hide();
        });
        
        // Add event listener to remove modal from DOM when hidden
        modalElement.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modalContainer);
        });
        
        // Show modal
        modal.show();
        
        return modal;
    }
    
    // Create a confirmation dialog
    confirmDialog(message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel') {
        return this.createModal('Confirmation', `<p>${message}</p>`, confirmText, onConfirm, cancelText);
    }
    
    // Format date
    formatDate(dateString, format = 'short') {
        const date = new Date(dateString);
        
        if (format === 'short') {
            return date.toLocaleDateString();
        } else if (format === 'long') {
            return date.toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } else if (format === 'time') {
            return date.toLocaleTimeString(undefined, { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (format === 'datetime') {
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString(undefined, { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (format === 'relative') {
            const now = new Date();
            const diff = now - date;
            
            // Convert milliseconds to seconds
            const seconds = Math.floor(diff / 1000);
            
            if (seconds < 60) {
                return 'just now';
            }
            
            // Convert seconds to minutes
            const minutes = Math.floor(seconds / 60);
            
            if (minutes < 60) {
                return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            }
            
            // Convert minutes to hours
            const hours = Math.floor(minutes / 60);
            
            if (hours < 24) {
                return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            }
            
            // Convert hours to days
            const days = Math.floor(hours / 24);
            
            if (days < 30) {
                return `${days} day${days > 1 ? 's' : ''} ago`;
            }
            
            // Convert days to months
            const months = Math.floor(days / 30);
            
            if (months < 12) {
                return `${months} month${months > 1 ? 's' : ''} ago`;
            }
            
            // Convert months to years
            const years = Math.floor(months / 12);
            
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
        
        return date.toLocaleDateString();
    }
    
    // Generate a unique ID
    generateId(prefix = '') {
        return prefix + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Create tag elements
    createTagElements(tags) {
        return tags.map(tag => `<span class="tag bg-primary bg-opacity-10 text-primary">${tag}</span>`).join(' ');
    }
    
    // Create priority badge
    createPriorityBadge(priority) {
        let badgeClass = '';
        let badgeText = priority;
        
        switch (priority.toLowerCase()) {
            case 'high':
                badgeClass = 'bg-danger';
                break;
            case 'medium':
                badgeClass = 'bg-warning text-dark';
                break;
            case 'low':
                badgeClass = 'bg-info text-dark';
                break;
            default:
                badgeClass = 'bg-secondary';
        }
        
        return `<span class="badge ${badgeClass}">${this.capitalizeFirstLetter(badgeText)}</span>`;
    }
    
    // Create status badge
    createStatusBadge(status) {
        let badgeClass = '';
        let badgeText = status.replace(/-/g, ' ');
        
        switch (status.toLowerCase()) {
            case 'completed':
            case 'done':
                badgeClass = 'bg-success';
                break;
            case 'in-progress':
                badgeClass = 'bg-primary';
                break;
            case 'not-started':
                badgeClass = 'bg-secondary';
                break;
            case 'overdue':
                badgeClass = 'bg-danger';
                break;
            default:
                badgeClass = 'bg-secondary';
        }
        
        return `<span class="badge ${badgeClass}">${this.capitalizeFirstLetter(badgeText)}</span>`;
    }
    
    // Create progress bar
    createProgressBar(progress, max = 100) {
        const percentage = Math.round((progress / max) * 100);
        let colorClass = 'bg-info';
        
        if (percentage >= 100) {
            colorClass = 'bg-success';
        } else if (percentage >= 75) {
            colorClass = 'bg-primary';
        } else if (percentage >= 50) {
            colorClass = 'bg-info';
        } else if (percentage >= 25) {
            colorClass = 'bg-warning';
        } else {
            colorClass = 'bg-danger';
        }
        
        return `
            <div class="progress">
                <div class="progress-bar ${colorClass}" role="progressbar" style="width: ${percentage}%" 
                    aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="${max}">
                    ${percentage}%
                </div>
            </div>
        `;
    }
    
    // Helper function to capitalize first letter
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Create a file download
    createFileDownload(content, filename, type = 'application/json') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Create a file upload input
    createFileUpload(onFileSelected, accept = '.json') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.style.display = 'none';
        
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                onFileSelected(e.target.files[0]);
            }
        });
        
        document.body.appendChild(input);
        input.click();
        
        // Remove input after selection
        input.addEventListener('change', () => {
            setTimeout(() => {
                document.body.removeChild(input);
            }, 100);
        });
    }
    
    // Create a drag and drop area
    createDragDropArea(element, onFileDrop, accept = '.json') {
        const dropArea = element;
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.add('dragover');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.remove('dragover');
            }, false);
        });
        
        dropArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                // Check file type
                const file = files[0];
                const fileType = file.type;
                
                if (accept === '.json' && fileType === 'application/json') {
                    onFileDrop(file);
                } else if (accept === '*' || file.name.endsWith(accept)) {
                    onFileDrop(file);
                } else {
                    this.showToast(`Invalid file type. Please upload a ${accept} file.`, 'warning');
                }
            }
        }, false);
    }
}
