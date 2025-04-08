// Main Application Entry Point
import { AppController } from './controllers/app-controller.js';
import { StorageService } from './utils/storage-service.js';
import { UIService } from './utils/ui-service.js';

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize services
    const storageService = new StorageService();
    const uiService = new UIService();
    
    // Initialize main controller
    const app = new AppController(storageService, uiService);
    
    // Start the application
    app.init();
    
    console.log('Productivity App initialized successfully');
});
