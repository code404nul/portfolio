const canvas = document.getElementById('connections');
const ctx = canvas.getContext('2d');

// Sélectionne toutes les bulles
const bubbles = document.querySelectorAll('.point');
const bubbleData = [];

// Sélectionne l'élément avec le dégradé
const degradeElement = document.querySelector('.degradé-haut');

// Variables pour gérer l'animation
let progress = 60; // Position initiale du dégradé
let direction = -1; // Direction du changement (-1 pour diminuer, 1 pour augmenter)

// Ajuste la taille du canvas à celle de la fenêtre
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Fonction pour dessiner les lignes entre les bulles
function drawConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas

    ctx.fillStyle = 'transparent'; // Définit une couleur de fond transparente
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Remplit le canvas avec cette couleur

    bubbleData.forEach((bubble1) => {
        bubbleData.forEach((bubble2) => {
            if (bubble1 !== bubble2) { // Évite de connecter une bulle à elle-même
                ctx.beginPath();
                ctx.moveTo(
                    bubble1.x + bubble1.element.offsetWidth / 2,
                    bubble1.y + bubble1.element.offsetHeight / 2
                );
                ctx.lineTo(
                    bubble2.x + bubble2.element.offsetWidth / 2,
                    bubble2.y + bubble2.element.offsetHeight / 2
                );
                ctx.strokeStyle = 'rgba(255, 116, 116, 0.86)'; // Couleur blanche semi-transparente
                ctx.lineWidth = 1; // Épaisseur de la ligne
                ctx.stroke();
            }
        });
    });
}

// Modifie la fonction d'animation pour inclure le dessin des lignes
function animateBubbles() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    bubbleData.forEach((data, index) => {
        // Met à jour la position
        data.x += data.dx;
        data.y += data.dy;

        // Vérifie les collisions avec les bords de l'écran
        if (data.x <= 0) {
            data.x = 0;
            data.dx *= -1;
        }
        if (data.x + data.element.offsetWidth >= screenWidth) {
            data.x = screenWidth - data.element.offsetWidth;
            data.dx *= -1;
        }
        if (data.y <= 0) {
            data.y = 0;
            data.dy *= -1;
        }
        if (data.y + data.element.offsetHeight >= screenHeight) {
            data.y = screenHeight - data.element.offsetHeight;
            data.dy *= -1;
        }

        // Vérifie les collisions avec les autres bulles
        bubbleData.forEach((otherData, otherIndex) => {
            if (index !== otherIndex && areBubblesColliding(data, otherData)) {
                resolveCollision(data, otherData);
            }
        });

        // Applique la nouvelle position
        data.element.style.transform = `translate(${data.x}px, ${data.y}px)`;
    });

    // Dessine les connexions
    drawConnections();

    // Continue l'animation
    requestAnimationFrame(animateBubbles);
}

// Vérifie si deux bulles sont en collision
function areBubblesColliding(bubble1, bubble2) {
    const dx = bubble1.x - bubble2.x;
    const dy = bubble1.y - bubble2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < (bubble1.element.offsetWidth / 2 + bubble2.element.offsetWidth / 2);
}

// Résout la collision entre deux bulles
function resolveCollision(bubble1, bubble2) {
    const dx = bubble1.x - bubble2.x;
    const dy = bubble1.y - bubble2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    const overlap = (bubble1.element.offsetWidth / 2 + bubble2.element.offsetWidth / 2) - distance;
    const adjustX = (dx / distance) * overlap / 2;
    const adjustY = (dy / distance) * overlap / 2;

    bubble1.x += adjustX;
    bubble1.y += adjustY;
    bubble2.x -= adjustX;
    bubble2.y -= adjustY;

    bubble1.dx *= -1;
    bubble1.dy *= -1;
    bubble2.dx *= -1;
    bubble2.dy *= -1;
}

// Initialise les données des bulles avec des positions aléatoires
bubbles.forEach((bubble) => {
    const x = Math.random() * (window.innerWidth - bubble.offsetWidth);
    const y = Math.random() * (window.innerHeight - bubble.offsetHeight);
    const dx = (Math.random() - 0.5) * 2; // Vitesse horizontale aléatoire
    const dy = (Math.random() - 0.5) * 2; // Vitesse verticale aléatoire

    bubbleData.push({ element: bubble, x, y, dx, dy });

    // Applique les positions initiales
    bubble.style.transform = `translate(${x}px, ${y}px)`;
});

// Fonction pour animer le dégradé
function animateDegrade() {
    // Met à jour la position du dégradé
    progress += direction * 0.1; // Change progressivement (ajuste 0.1 pour la vitesse)

    // Inverse la direction si on atteint les limites
    if (progress <= 30) direction = 1;
    if (progress >= 60) direction = -1;

    // Applique le nouveau dégradé
    degradeElement.style.background = `radial-gradient(ellipse at top left, #824718ff 0%, #0d0d0d ${progress}%)`;

    // Continue l'animation
    requestAnimationFrame(animateDegrade);
}

function startAnimation() {
    const canvas = document.getElementById('connections');
    const ctx = canvas.getContext('2d');
    const bubbles = document.querySelectorAll('.point');
    const bubbleData = [];
    const degradeElement = document.querySelector('.degradé-haut');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    bubbles.forEach((bubble) => {
        const x = Math.random() * (window.innerWidth - bubble.offsetWidth);
        const y = Math.random() * (window.innerHeight - bubble.offsetHeight);
        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;

        bubbleData.push({ element: bubble, x, y, dx, dy });
        bubble.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Ici tu inclues toutes tes fonctions : drawConnections, animateBubbles, animateDegrade
    animateBubbles();
    animateDegrade();
}

// Attendre que **toutes les images de bulles** soient chargées
const images = document.querySelectorAll('.point img');
let loadedImages = 0;

images.forEach((img) => {
    if (img.complete) {
        loadedImages++;
    } else {
        img.addEventListener('load', () => {
            loadedImages++;
            if (loadedImages === images.length) startAnimation();
        });
        img.addEventListener('error', () => {
            loadedImages++;
            if (loadedImages === images.length) startAnimation();
        });
    }
});

if (loadedImages === images.length) startAnimation();
