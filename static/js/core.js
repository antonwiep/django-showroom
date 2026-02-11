// Core Alpine.js setup for Django Storybook
import persist from '@alpinejs/persist';
import Alpine from 'alpinejs';

// Import design-system component directives
import '../../design-system/cotton/alpine.js';

// Initialize Alpine
document.addEventListener('DOMContentLoaded', () => {
    Alpine.plugin(persist);
    window.Alpine = Alpine;
    Alpine.start();
});
