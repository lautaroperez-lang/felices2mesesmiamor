// --- CONFIGURACIÓN DE FIREBASE EN LA NUBE CON TUS LLAVES ---
const firebaseConfig = {
  apiKey: "AIzaSyDaXXx-Bvx1-Gn0f4w3NCeE8Y3d59Zybpo",
  authDomain: "mascotastitch.firebaseapp.com",
  projectId: "mascotastitch",
  storageBucket: "mascotastitch.firebasestorage.app",
  messagingSenderId: "786158126868",
  appId: "1:786158126868:web:e7ea960a30d0803d312401",
  measurementId: "G-4M89LYY6NX"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const petDocRef = db.collection('mascota').doc('stitch');
const recuerdosCollectionRef = db.collection('recuerdos');

// Identificación del usuario
let usuarioActual = localStorage.getItem('nombre_cuidador');
if (!usuarioActual) {
    usuarioActual = prompt("¿Quién ingresa a la pagina hoy? (Escribe: Lauti o Valet)") || "Alguien especial";
    localStorage.setItem('nombre_cuidador', usuarioActual);
}

// --- PANTALLA DE INICIO ---
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
        iniciarSincronizacionNube();
        escucharRecuerdosNube();
    });
}

// --- NAVEGACIÓN ---
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

// --- CÁLCULO DE DÍAS ---
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

// --- MASCOTA EN LA NUBE ---
function iniciarSincronizacionNube() {
    petDocRef.onSnapshot(doc => {
        if (doc.exists) {
            let data = doc.data();
            const ahora = Date.now();
            const horasPasadas = (ahora - data.lastCareTime) / (1000 * 60 * 60);

            if (horasPasadas >= 0.1) {
                const desgaste = Math.floor(horasPasadas * 5);
                if (desgaste > 0) {
                    data.food = Math.max(0, data.food - desgaste);
                    data.love = Math.max(0, data.love - desgaste);
                    data.clean = Math.max(0, data.clean - desgaste);
                    data.lastCareTime = ahora;
                    petDocRef.set(data);
                }
            }
            renderizarMascota(data);
        } else {
            const estadoInicial = {
                food: 50,
                love: 50,
                clean: 50,
                lastCareTime: Date.now(),
                ultimoCuidador: "Ninguno"
            };
            petDocRef.set(estadoInicial);
            renderizarMascota(estadoInicial);
        }
    }, err => {
        console.error("Error en Firestore:", err);
    });
}

function renderizarMascota(estado) {
    const foodBar = document.getElementById('food-bar');
    const loveBar = document.getElementById('love-bar');
    const cleanBar = document.getElementById('clean-bar');

    if (foodBar) foodBar.style.width = estado.food + '%';
    if (loveBar) loveBar.style.width = estado.love + '%';
    if (cleanBar) cleanBar.style.width = estado.clean + '%';

    const promedio = (estado.food + estado.love + estado.clean) / 3;
    const avatarImg = document.getElementById('pet-avatar-img');
    const msg = document.getElementById('pet-status-msg');

    let textoCuidador = estado.ultimoCuidador ? ` (Último mimo de ${estado.ultimoCuidador})` : '';

    if (promedio >= 65) {
        if (avatarImg) avatarImg.src = "images (5).jpg";
        if (msg) msg.innerText = `Stitch está súper feliz y lleno de energía 🥰💙${textoCuidador}`;
    } else if (promedio >= 35) {
        if (avatarImg) avatarImg.src = "stitchnormal.jpg";
        if (msg) msg.innerText = `Stitch está tranquilo, pero necesita más mimos y comida... 🍗${textoCuidador}`;
    } else {
        if (avatarImg) avatarImg.src = "stitchtriste.jpg";
        if (msg) msg.innerText = `¡Stitch está muy triste y débil! Cuidalo antes de que baje más... ${textoCuidador}`;
    }
}

function darCuidado(tipo) {
    petDocRef.get().then(doc => {
        let estado = doc.exists ? doc.data() : { food: 50, love: 50, clean: 50 };
        estado.lastCareTime = Date.now();
        estado.ultimoCuidador = usuarioActual;

        if (tipo === 'food') estado.food = Math.min(100, estado.food + 20);
        if (tipo === 'love') estado.love = Math.min(100, estado.love + 20);
        if (tipo === 'clean') estado.clean = Math.min(100, estado.clean + 20);

        petDocRef.set(estado);
    });
}

const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');
const cleanBtn = document.getElementById('clean-btn');

if (feedBtn) feedBtn.addEventListener('click', () => darCuidado('food'));
if (playBtn) playBtn.addEventListener('click', () => darCuidado('love'));
if (cleanBtn) cleanBtn.addEventListener('click', () => darCuidado('clean'));

// --- SECCIÓN NUESTROS RECUERDOS (FIRESTORE EN TIEMPO REAL) ---
const memoryForm = document.getElementById('memory-form');
const memoriesGrid = document.getElementById('memories-grid');

function escucharRecuerdosNube() {
    if (!memoriesGrid) return;

    recuerdosCollectionRef.orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        memoriesGrid.innerHTML = '';

        if (snapshot.empty) {
            memoriesGrid.innerHTML = '<p class="subtitle">Aún no hay recuerdos guardados en la nube. ¡Suban el primero!</p>';
            return;
        }

        snapshot.forEach(doc => {
            const recuerdo = doc.data();
            const idDoc = doc.id;

            const card = document.createElement('div');
            card.className = 'photo-item memory-card-item';
            card.innerHTML = `
                <img src="${recuerdo.image}" alt="${recuerdo.title}">
                <p><strong>${recuerdo.title}</strong></p>
                <p>${recuerdo.desc}</p>
                <small>Subido por ${recuerdo.autor || 'Alguien especial'} el ${recuerdo.date}</small>
                <button class="delete-memory-btn" onclick="eliminarRecuerdoNube('${idDoc}')">🗑️ Eliminar</button>
            `;
            memoriesGrid.appendChild(card);
        });
    }, err => {
        console.error("Error al obtener recuerdos:", err);
    });
}

if (memoryForm) {
    memoryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('memory-image');
        const titleInput = document.getElementById('memory-title').value;
        const descInput = document.getElementById('memory-desc').value;

        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;

                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 500;
                    const scaleFactor = MAX_WIDTH / img.width;

                    if (img.width > MAX_WIDTH) {
                        canvas.width = MAX_WIDTH;
                        canvas.height = img.height * scaleFactor;
                    } else {
                        canvas.width = img.width;
                        canvas.height = img.height;
                    }

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

                    const newMemory = {
                        image: compressedBase64,
                        title: titleInput,
                        desc: descInput,
                        autor: usuarioActual,
                        date: new Date().toLocaleDateString('es-AR'),
                        timestamp: Date.now()
                    };

                    recuerdosCollectionRef.add(newMemory).then(() => {
                        memoryForm.reset();
                    }).catch(err => {
                        console.error("Error al guardar en Firebase:", err);
                        alert("Error al subir. Intenta con una imagen más pequeña.");
                    });
                };
            };

            reader.readAsDataURL(file);
        }
    });
}

function eliminarRecuerdoNube(idDoc) {
    if (confirm("¿Seguro que quieres borrar este recuerdo para los dos?")) {
        recuerdosCollectionRef.doc(idDoc).delete().catch(err => {
            console.error("Error al eliminar de Firebase:", err);
        });
    }
}
