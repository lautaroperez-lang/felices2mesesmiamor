// --- LÓGICA DE LA PANTALLA DE INICIO (CORAZÓN INTERACTIVO) ---
let clickCount = 0;
const totalClicks = 10;

const heartBtn = document.getElementById('heart-btn');
const progressBar = document.getElementById('progress-bar');
const counterText = document.getElementById('counter-text');
const enterBtn = document.getElementById('enter-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const mainContent = document.getElementById('main-content');

heartBtn.addEventListener('click', () => {
    if (clickCount < totalClicks) {
        clickCount++;
        const percentage = (clickCount / totalClicks) * 100;
        progressBar.style.width = percentage + '%';
        counterText.innerText = `${clickCount} / ${totalClicks} clics`;

        if (clickCount === totalClicks) {
            enterBtn.classList.remove('hidden-btn');
            enterBtn.classList.add('visible-btn');
            enterBtn.disabled = false;
            counterText.innerText = "¡Amor completado al 100%! 💚";
        }
    }
});

enterBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    mainContent.classList.remove('hidden');
    calcularDias();
});

// --- NAVEGACIÓN POR PESTAÑAS ---
const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(tab => {
            tab.classList.remove('active-tab');
            tab.classList.add('hidden-tab');
        });

        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        const activeTab = document.getElementById(tabId);
        activeTab.classList.remove('hidden-tab');
        activeTab.classList.add('active-tab');
    });
});

// --- CÁLCULO DE DÍAS JUNTOS ---
function calcularDias() {
    // Agosto es el mes 7 (Enero = 0)
    const fechaInicio = new Date(2026, 7, 15); 
    const fechaActual = new Date();

    const diferenciaTiempo = fechaActual - fechaInicio;
    const diasJuntos = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

    if (diasJuntos >= 0) {
        document.getElementById('days-counter').innerText = `${diasJuntos} Días ❤️`;
    } else {
        document.getElementById('days-counter').innerText = `¡Faltan pocos días para comenzar! 🌿`;
    }
}

// --- CARTA INTERACTIVA ---
const envelope = document.getElementById('envelope');
const letterContent = document.getElementById('letter-content');

envelope.addEventListener('click', () => {
    letterContent.classList.toggle('hidden');
});