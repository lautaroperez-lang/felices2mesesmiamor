// --- LÓGICA DE LA PANTALLA DE INICIO (CORAZÓN INTERACTIVO) ---
let clickCount = 0;
const totalClicks = 10;

const heartBtn = document.getElementById('heart-btn');
const progressBar = document.getElementById('progress-bar');
const counterText = document.getElementById('counter-text');
const enterBtn = document.getElementById('enter-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const mainContent = document.getElementById('main-content');

if (heartBtn) {
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
}

if (enterBtn) {
    enterBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        calcularDias();
        cargarYSincronizarMascota();
        renderizarRecuerdos();
    });
}

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
        if (activeTab) {
            activeTab.classList.remove('hidden-tab');
            activeTab.classList.add('active-tab');
        }
    });
});

// --- CÁLCULO DE DÍAS JUNTOS ---
function calcularDias() {
    const fechaInicio = new Date(2026, 7, 15); 
    const fechaActual = new Date();

    const diferenciaTiempo = fechaActual - fechaInicio;
    const diasJuntos = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

    const counterElement = document.getElementById('days-counter');
    if (counterElement) {
        if (diasJuntos >= 0) {
            counterElement.innerText = `${diasJuntos} Días ❤️`;
        } else {
            counterElement.innerText = `¡Faltan pocos días para comenzar! 🌿`;
        }
    }
}

// --- CARTA INTERACTIVA ---
const envelope = document.getElementById('envelope');
const letterContent = document.getElementById('letter-content');

if (envelope && letterContent) {
    envelope.addEventListener('click', () => {
        letterContent.classList.toggle('hidden');
    });
}

// --- SISTEMA PERSISTENTE DE LA MASCOTA VIRTUAL ---
let petState = {
    food: 50,
    love: 50,
    clean: 50,
    lastCareTime: Date.now()
};

function cargarYSincronizarMascota() {
    const saved = localStorage.getItem('stitch_pet_v3');
    if (saved) {
        petState = JSON.parse(saved);
        
        // Calcular tiempo transcurrido desde la última entrada o interacción
        const now = Date.now();
        const hoursPassed = (now - petState.lastCareTime) / (1000 * 60 * 60);

        if (hoursPassed > 0) {
            const loss = Math.floor(hoursPassed * 5); // Resta 5% de cada barra por cada hora
            petState.food = Math.max(0, petState.food - loss);
            petState.love = Math.max(0, petState.love - loss);
            petState.clean = Math.max(0, petState.clean - loss);
            petState.lastCareTime = now; // Sincroniza la hora tras aplicar la reducción
        }
    } else {
        // Primera inicialización si nunca se guardó
        petState.lastCareTime = Date.now();
    }
    actualizarVistaMascota();
}

function actualizarVistaMascota() {
    const avatarImg = document.getElementById('pet-avatar-img');
    const msg = document.getElementById('pet-status-msg');

    const foodBar = document.getElementById('food-bar');
    const loveBar = document.getElementById('love-bar');
    const cleanBar = document.getElementById('clean-bar');

    if (foodBar) foodBar.style.width = petState.food + '%';
    if (loveBar) loveBar.style.width = petState.love + '%';
    if (cleanBar) cleanBar.style.width = petState.clean + '%';

    const promedio = (petState.food + petState.love + petState.clean) / 3;

    if (promedio >= 65) {
        if (avatarImg) avatarImg.src = "stitch-feliz.jpg";
        if (msg) msg.innerText = "¡Stitch está súper feliz y lleno de energía contigo! 🥰💙";
    } else if (promedio >= 35) {
        if (avatarImg) avatarImg.src = "stitch-normal.jpg";
        if (msg) msg.innerText = "Stitch está tranquilo, pero necesita más mimos y comida... 🍗";
    } else {
        if (avatarImg) avatarImg.src = "stitch-triste.jpg";
        if (msg) msg.innerText = "¡Stitch está muy triste y débil! Cuidalo antes de que baje más... 😢";
    }

    // Persistencia continua en almacenamiento local
    localStorage.setItem('stitch_pet_v3', JSON.stringify(petState));
}

function darCuidado(tipo) {
    petState.lastCareTime = Date.now();

    if (tipo === 'food') petState.food = Math.min(100, petState.food + 20);
    if (tipo === 'love') petState.love = Math.min(100, petState.love + 20);
    if (tipo === 'clean') petState.clean = Math.min(100, petState.clean + 20);

    actualizarVistaMascota();
}

const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');
const cleanBtn = document.getElementById('clean-btn');

if (feedBtn) feedBtn.addEventListener('click', () => darCuidado('food'));
if (playBtn) playBtn.addEventListener('click', () => darCuidado('love'));
if (cleanBtn) cleanBtn.addEventListener('click', () => darCuidado('clean'));

// Comprobación continua cada minuto para desgastar si la pestaña queda abierta
setInterval(() => {
    if (mainContent && !mainContent.classList.contains('hidden')) {
        cargarYSincronizarMascota();
    }
}, 60000);

// --- SECCIÓN NUESTROS RECUERDOS (LOCALSTORAGE) ---
const memoryForm = document.getElementById('memory-form');
const memoriesGrid = document.getElementById('memories-grid');

if (memoryForm) {
    memoryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('memory-image');
        const titleInput = document.getElementById('memory-title').value;
        const descInput = document.getElementById('memory-desc').value;

        if (fileInput && fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();

            reader.onload = function (event) {
                const newMemory = {
                    image: event.target.result,
                    title: titleInput,
                    desc: descInput,
                    date: new Date().toLocaleDateString('es-AR')
                };

                guardarRecuerdo(newMemory);
                memoryForm.reset();
                renderizarRecuerdos();
            };

            reader.readAsDataURL(fileInput.files[0]);
        }
    });
}

function guardarRecuerdo(recuerdo) {
    const recuerdos = JSON.parse(localStorage.getItem('nuestros_recuerdos') || '[]');
    recuerdos.unshift(recuerdo);
    localStorage.setItem('nuestros_recuerdos', JSON.stringify(recuerdos));
}

function renderizarRecuerdos() {
    if (!memoriesGrid) return;

    const recuerdos = JSON.parse(localStorage.getItem('nuestros_recuerdos') || '[]');
    memoriesGrid.innerHTML = '';

    if (recuerdos.length === 0) {
        memoriesGrid.innerHTML = '<p class="subtitle">Aún no hay recuerdos agregados. ¡Sé el primero en subir uno!</p>';
        return;
    }

    recuerdos.forEach(recuerdo => {
        const card = document.createElement('div');
        card.className = 'photo-item';
        card.innerHTML = `
            <img src="${recuerdo.image}" alt="${recuerdo.title}">
            <p><strong>${recuerdo.title}</strong></p>
            <p>${recuerdo.desc}</p>
            <small>Agregado el ${recuerdo.date}</small>
        `;
        memoriesGrid.appendChild(card);
    });
}