// DOM Elements
const loginForm = document.getElementById('loginForm');
const searchBar = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');


    
   

// Search Functionality
searchBtn.addEventListener('click', function() {
    handleSearch();
});

searchBar.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const query = searchBar.value.trim();
    
    if (!query) {
        alert('Please enter a question');
        return;
    }
    
    // Demo response (replace with actual AI integration)
    alert(`Processing your question: "${query}"\n\nThis is where your AI would provide an answer about ${getSubjectFromQuery(query)}`);
    
    // Clear search bar
    searchBar.value = '';
}

// Helper function to detect subject from query
function getSubjectFromQuery(query) {
    const subjects = {
        'coa': 'Computer Organization & Architecture',
        'dbms': 'Database Management Systems',
        'os': 'Operating Systems',
        'compiler': 'Compiler Design',
        'architecture': 'Computer Organization & Architecture',
        'database': 'Database Management Systems',
        'operating': 'Operating Systems',
        'deadlock': 'Operating Systems',
        'starvation': 'Operating Systems'
    };
    
    const lowerQuery = query.toLowerCase();
    
    for (let keyword in subjects) {
        if (lowerQuery.includes(keyword)) {
            return subjects[keyword];
        }
    }
    
    return 'Core CS subjects';
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation for search
function showLoadingAnimation() {
    const originalText = searchBtn.textContent;
    searchBtn.textContent = 'Processing...';
    searchBtn.disabled = true;
    
    setTimeout(() => {
        searchBtn.textContent = originalText;
        searchBtn.disabled = false;
    }, 2000);
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards
    document.querySelectorAll('.about-card, .subject-card, .step-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + L to focus on login
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('username').focus();
    }
    
    // Ctrl + F to focus on search
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchBar.focus();
    }
});

// Form validation styling
function addValidationStyling() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ff6b6b';
            } else {
                this.style.borderColor = '#4CAF50';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
        });
    });
}

// Initialize validation styling
addValidationStyling();

// Console welcome message
console.log(`
🎓 AI Classroom Assistant
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Welcome to the AI Powered Classroom Assistant!
This platform helps B-TECH students with:
• Computer Organization & Architecture (COA)
• Database Management Systems (DBMS)  
• Operating Systems (OS)
• Compiler Design

Demo Login Credentials:
Username: student
Password: password
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
