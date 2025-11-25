console.log("Arshrozy Printing System Loaded");

/* --- 1. GLOBAL SETTINGS --- */
const PHONE_NUMBER = "254769752124"; // Format without the +

/* --- 2. PRICING DATABASE --- */
const PRICES = {
    cards: { base: 14, spotuv: 10, folded: 20 },
    flyers: { a4: 35, a5: 15, a6: 10 },
    banners: { 
        rollup: 6000, xbanner: 5800, doorframe: 7500, 
        backdrop: 27000, teardrop: 15400 
    },
    stickers: { vinyl: 1380, reflective: 1800, magnet: 1150 },
    mugs: { standard: 500, magic: 800, travel: 1050, bottle: 750 },
    apparel: { tshirt: 580, hoodie: 1500, polo: 800 },
    stationery: { receipt: 500, calendar: 90, invoice: 500 }
};

/* --- 3. HELPER FUNCTIONS --- */

// Format currency
function formatMoney(amount) {
    return "KES " + amount.toLocaleString(undefined, {minimumFractionDigits: 2});
}

// Update the Total Text
function updateDisplay(id, value) {
    const el = document.getElementById(id);
    if(el) el.innerText = formatMoney(value);
}

// Get the 'value' (for math)
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : null;
}

// Get the 'Readable Text' (for WhatsApp)
// This grabs the text inside the <option> tag, e.g., "Spot UV (Shiny logo)"
function getLabel(id) {
    const el = document.getElementById(id);
    if (!el) return "";
    if (el.tagName === "SELECT") {
        return el.options[el.selectedIndex].text;
    }
    return el.value; // Fallback for input fields
}

// Open WhatsApp
function sendToWhatsApp(productCategory, detailsObj, totalId) {
    const totalEl = document.getElementById(totalId);
    const totalText = totalEl ? totalEl.innerText : "Check Price";
    
    // Build the message
    let msg = `*Order Request: ${productCategory}*\n------------------\n`;
    
    for (const [key, value] of Object.entries(detailsObj)) {
        msg += `*${key}:* ${value}\n`;
    }
    
    msg += `------------------\n*Estimated Total:* ${totalText}`;
    
    // Create Link
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

/* --- 4. CALCULATORS --- */

// Business Cards
function calcCards() {
    let qty = parseInt(getVal('c-qty')) || 0;
    if (qty < 100) qty = 100; // Enforce minimum 100
    
    const type = getVal('c-type');
    const sides = getVal('c-sides');
    
    let unit = PRICES.cards.base;
    if (type === 'spotuv') unit += PRICES.cards.spotuv;
    if (type === 'folded') unit = PRICES.cards.base + PRICES.cards.folded; 
    if (sides === 'double') unit += 5; 

    updateDisplay('c-total', unit * qty);
}

// Marketing (Flyers)
function calcFlyers() {
    const qty = parseInt(getVal('f-qty')) || 1000;
    const size = getVal('f-size');
    let unit = PRICES.flyers[size] || 0;
    updateDisplay('f-total', unit * qty);
}

// Banners
function calcBanners() {
    const qty = parseInt(getVal('b-qty')) || 1;
    const type = getVal('b-type');
    let unit = PRICES.banners[type] || 0;
    updateDisplay('b-total', unit * qty);
}

// Stickers
function calcStickers() {
    const qty = parseInt(getVal('s-qty')) || 1;
    const type = getVal('s-type');
    let unit = PRICES.stickers[type] || 0;
    updateDisplay('s-total', unit * qty);
}

// Mugs
function calcMugs() {
    const qty = parseInt(getVal('m-qty')) || 1;
    const type = getVal('m-type');
    let unit = PRICES.mugs[type] || 0;
    updateDisplay('m-total', unit * qty);
}

// Apparel
function calcApparel() {
    const qty = parseInt(getVal('a-qty')) || 1;
    const type = getVal('a-type');
    let unit = PRICES.apparel[type] || 0;
    updateDisplay('a-total', unit * qty);
}

// Stationery
function calcStationery() {
    const qty = parseInt(getVal('st-qty')) || 1;
    const type = getVal('st-type');
    let unit = PRICES.stationery[type] || 0;
    updateDisplay('st-total', unit * qty);
}

/* --- 5. INITIALIZATION & EVENTS --- */

document.addEventListener('DOMContentLoaded', () => {

    // A. Mobile Menu Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active'); // Toggles the CSS class to show/hide
            // Update button icon for fun (optional)
            menuBtn.innerText = nav.classList.contains('active') ? '✕' : '☰';
        });
    }

    // B. Carousel Init (Only runs if carousel exists on page)
    initCarousel(); 

    // C. Attach Calculator Events & WhatsApp Buttons
    
    // Helper to attach listeners
    const setupForm = (formId, calcFunc, waFunc) => {
        const form = document.getElementById(formId);
        if(!form) return;

        // 1. Attach Math Listeners to inputs
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', calcFunc);
            input.addEventListener('input', calcFunc);
        });
        
        // Run once on load
        calcFunc();

        // 2. Attach WhatsApp Click
        const btn = form.querySelector('.add-cart-btn');
        if(btn && waFunc) {
            btn.addEventListener('click', waFunc);
        }
    };

    // --- SETUP SPECIFIC FORMS ---

    // 1. Business Cards
    setupForm('card-form', calcCards, () => {
        sendToWhatsApp("Business Cards", {
            "Type": getLabel('c-type'),
            "Sides": getLabel('c-sides'),
            "Quantity": getVal('c-qty')
        }, 'c-total');
    });

    // 2. Flyers
    setupForm('flyer-form', calcFlyers, () => {
        sendToWhatsApp("Flyers / Marketing", {
            "Size": getLabel('f-size'),
            "Quantity": getVal('f-qty')
        }, 'f-total');
    });

    // 3. Banners
    setupForm('banner-form', calcBanners, () => {
        sendToWhatsApp("Large Format Banner", {
            "Type": getLabel('b-type'),
            "Quantity": getVal('b-qty')
        }, 'b-total');
    });

    // 4. Stickers
    setupForm('sticker-form', calcStickers, () => {
        sendToWhatsApp("Vinyl Stickers / Branding", {
            "Type": getLabel('s-type'),
            "Quantity (Units/Meters)": getVal('s-qty')
        }, 's-total');
    });

    // 5. Mugs
    setupForm('mug-form', calcMugs, () => {
        sendToWhatsApp("Mugs & Drinkware", {
            "Type": getLabel('m-type'),
            "Quantity": getVal('m-qty')
        }, 'm-total');
    });

    // 6. Apparel
    setupForm('apparel-form', calcApparel, () => {
        sendToWhatsApp("Branded Apparel", {
            "Garment": getLabel('a-type'),
            "Quantity": getVal('a-qty')
        }, 'a-total');
    });

    // 7. Stationery
    setupForm('stat-form', calcStationery, () => {
        sendToWhatsApp("Office Stationery", {
            "Item": getLabel('st-type'),
            "Quantity": getVal('st-qty')
        }, 'st-total');
    });

});

/* --- 6. UPDATED CAROUSEL LOGIC (With Loop & Auto-Play) --- */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    
    if (!track || !nextButton || !prevButton) return; 

    const slides = Array.from(track.children);
    
    // Calculate slide width including the gap (30px) from CSS
    const slideWidth = slides[0].getBoundingClientRect().width + 30; 

    // 1. Function to Move Slide
    const moveToSlide = (targetSlide) => {
        const targetIndex = slides.indexOf(targetSlide);
        // Move the track
        track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
        
        // Update classes
        const currentSlide = track.querySelector('.current-slide');
        if(currentSlide) currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    // 2. Next Button (With Loop)
    const nextSlide = () => {
        const currentSlide = track.querySelector('.current-slide');
        let nextSlide = currentSlide.nextElementSibling;
        
        // LOOP: If no next slide, go back to the first one
        if (!nextSlide) {
            nextSlide = slides[0];
        }
        
        moveToSlide(nextSlide);
    };

    // 3. Prev Button (With Loop)
    const prevSlide = () => {
        const currentSlide = track.querySelector('.current-slide');
        let prevSlide = currentSlide.previousElementSibling;

        // LOOP: If no prev slide, jump to the last one
        if (!prevSlide) {
            prevSlide = slides[slides.length - 1];
        }

        moveToSlide(prevSlide);
    };

    // 4. Event Listeners
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // 5. Auto-Play Feature
    let autoPlay = setInterval(nextSlide, 3000); // Change slide every 3 seconds

    // Stop auto-play when mouse enters the carousel area
    const container = document.querySelector('.carousel-section');
    container.addEventListener('mouseenter', () => {
        clearInterval(autoPlay);
    });

    // Restart auto-play when mouse leaves
    container.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextSlide, 3000);
    });
}// ===============================
// SITE-WIDE SEARCH FUNCTION
// ===============================
const searchInput = document.querySelector('.search-wrap input');
const searchBtn = document.querySelector('.search-wrap button');

if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    // Keyword map
    const pageMap = [
        { keywords: ['business', 'card', 'cards'], page: 'business-cards.html' },
        { keywords: ['banner', 'banners', 'rollup', 'roll up', 'x banner', 'backdrop'], page: 'banners.html' },
        { keywords: ['sticker', 'stickers', 'vinyl'], page: 'stickers.html' },
        { keywords: ['stationery', 'receipt', 'invoice', 'calendar'], page: 'stationery.html' },
        { keywords: ['mug', 'mugs', 'bottle', 'flask'], page: 'mugs.html' },
        { keywords: ['tshirt', 't-shirt', 'hoodie', 'apparel', 'shirt'], page: 'apparel.html' },
        { keywords: ['flyer', 'flyers', 'marketing'], page: 'marketing.html' }
    ];

    // Try to match a page
    for (let item of pageMap) {
        for (let word of item.keywords) {
            if (query.includes(word)) {
                window.location.href = item.page;
                return;
            }
        }
    }

    // If nothing matched
    alert('No matching products found. Try a different search term.');
}
