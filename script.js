console.log("Arshrozy Printing System Loaded");

/* --- PRICING DATABASE --- */
const PRICES = {
    cards: { base: 14, spotuv: 10, folded: 20 }, // Per card
    flyers: { a4: 35, a5: 15, a6: 10 },          // Per flyer
    banners: { 
        rollup: 6000, xbanner: 5800, doorframe: 7500, 
        backdrop: 27000, teardrop: 15400 
    },
    stickers: { vinyl: 1380, reflective: 1800, magnet: 1150 }, // Per meter or unit
    mugs: { standard: 500, magic: 800, travel: 1050, bottle: 750 },
    apparel: { tshirt: 580, hoodie: 1500, polo: 800 },
    stationery: { receipt: 500, calendar: 90, invoice: 500 }
};

/* --- FORMAT CURRENCY --- */
function formatMoney(amount) {
    return "KES " + amount.toLocaleString(undefined, {minimumFractionDigits: 2});
}

function updateDisplay(id, value) {
    const el = document.getElementById(id);
    if(el) el.innerText = formatMoney(value);
}

/* --- CALCULATOR FUNCTIONS --- */

// 1. Business Cards
function calcCards() {
    const qty = parseInt(document.getElementById('c-qty').value) || 100;
    const type = document.getElementById('c-type').value;
    const sides = document.getElementById('c-sides').value;
    
    let unit = PRICES.cards.base;
    if (type === 'spotuv') unit += PRICES.cards.spotuv;
    if (type === 'folded') unit = PRICES.cards.base + PRICES.cards.folded; // Higher base
    if (sides === 'double') unit += 5; // Extra for double side

    updateDisplay('c-total', unit * qty);
}

// 2. Marketing (Flyers)
function calcFlyers() {
    const qty = parseInt(document.getElementById('f-qty').value) || 1000;
    const size = document.getElementById('f-size').value;
    let unit = PRICES.flyers[size];
    updateDisplay('f-total', unit * qty);
}

// 3. Banners
function calcBanners() {
    const qty = parseInt(document.getElementById('b-qty').value) || 1;
    const type = document.getElementById('b-type').value;
    let unit = PRICES.banners[type];
    updateDisplay('b-total', unit * qty);
}

// 4. Stickers
function calcStickers() {
    const qty = parseInt(document.getElementById('s-qty').value) || 1; // Meters or Units
    const type = document.getElementById('s-type').value;
    let unit = PRICES.stickers[type];
    updateDisplay('s-total', unit * qty);
}

// 5. Mugs
function calcMugs() {
    const qty = parseInt(document.getElementById('m-qty').value) || 1;
    const type = document.getElementById('m-type').value;
    updateDisplay('m-total', PRICES.mugs[type] * qty);
}

// 6. Apparel
function calcApparel() {
    const qty = parseInt(document.getElementById('a-qty').value) || 1;
    const type = document.getElementById('a-type').value;
    updateDisplay('a-total', PRICES.apparel[type] * qty);
}

// 7. Stationery
function calcStationery() {
    const qty = parseInt(document.getElementById('st-qty').value) || 1;
    const type = document.getElementById('st-type').value;
    updateDisplay('st-total', PRICES.stationery[type] * qty);
}

/* --- AUTO-RUN ON LOAD --- */
document.addEventListener('DOMContentLoaded', () => {
    // Attach listeners safely
    const attach = (id, func) => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('change', func);
            el.addEventListener('input', func);
            func(); // Run once immediately
        }
    };

    attach('card-form', calcCards);
    attach('flyer-form', calcFlyers);
    attach('banner-form', calcBanners);
    attach('sticker-form', calcStickers);
    attach('mug-form', calcMugs);
    attach('apparel-form', calcApparel);
    attach('stat-form', calcStationery);
});