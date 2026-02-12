// Core Alpine.js setup for Django Showroom
import persist from '@alpinejs/persist';
import Alpine from 'alpinejs';

// Import component directives
import '../../components/cotton/alpine.js';

// Initialize Alpine
document.addEventListener('DOMContentLoaded', () => {
    Alpine.plugin(persist);
    window.Alpine = Alpine;
    Alpine.start();
});
