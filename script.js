// Calcular días juntos desde el 15 de agosto de 2026
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

// Abrir / Cerrar Carta
const envelope = document.getElementById('envelope');
const letterContent = document.getElementById('letter-content');

envelope.addEventListener('click', () => {
    letterContent.classList.toggle('hidden');
});

window.onload = function() {
    calcularDias();
};