const canvas = document.getElementById("circleCanvas");
const ctx = canvas.getContext("2d");

// Configuration MIDI simplifiée
const midi = {
  init() {
    if (!navigator.requestMIDIAccess) {
      console.error("Web MIDI API non supporté");
      return;
    }

    navigator
      .requestMIDIAccess()
      .then((access) => {
        // Configurer les entrées MIDI
        access.inputs.forEach((input) => {
          input.onmidimessage = (event) => {
            const [status, note, velocity] = event.data;
            console.log(
              `MIDI: ${
                status === 144 ? "Note On" : "Note Off"
              }, Note: ${note}, Vélocité: ${velocity}`
            );

            // Si c'est un message Note On (144) et que la note est 48 (pad)
            if (status === 144 && velocity > 0 && note === 48) {
              let newCircle = createCircle(images[0]);
              if (newCircle) {
                circles.push(newCircle);
                son1.currentTime = 0;
                son1
                  .play()
                  .catch((error) => console.error("Erreur son1:", error));
                drawCircles();
              }
            }
          };
          console.log(`Entrée MIDI connectée: ${input.name}`);
        });
      })
      .catch((err) => console.error("Erreur MIDI:", err));
  },
};

// Démarrer la configuration MIDI
midi.init();

// Définir la taille du canvas pour qu'il occupe toute la page
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Appeler resizeCanvas au chargement et lors du redimensionnement
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let circles = [];
let minRadius = 5;
let maxRadius = 50;
let selectedCircle = null;
let isDragging = false;

// Tableaux des fichiers d'images
let images = [];
let imageFiles = ["img/rond.png", "img/rond2.png", "img/rond3.png"];

// Variables pour l'animation
let isAnimating = false;
let animationFrame;
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
const gravity = 0.3;
const randomMovement = 0.01;
const friction = 0.98;
const maxSpeed = 1.5;
const collisionResponse = 0.7;
const growthSpeed = 2;

// Système pour suivre les collisions
let collisionTracker = new Set();

// Sons pour les vidéos
let son1 = new Audio("son/son1.mp3");
let son2 = new Audio("son/son2.mp3");
let son3 = new Audio("son/son3.mp3");
let son4 = new Audio("son/son4.mp3");
let son5 = new Audio("son/son5.mp3");
let son6 = new Audio("son/son6.mp3");
let son7 = new Audio("son/son7.mp3");
let son8 = new Audio("son/son8.mp3");
son1.volume = 0.5;
son2.volume = 0.5;
son3.volume = 0.5;
son4.volume = 0.5;
son5.volume = 0.5;
son6.volume = 0.5;
son7.volume = 0.1;
son8.volume = 0.1;

// Configurer le son8 pour qu'il se répète en boucle
son8.loop = true;

// Variables pour stocker les associations son/vidéo
let videoSoundMap = {
  "lol.mp4": son1,
  "lol2.mp4": son2,
  "lol3.mp4": son3,
};

// Charger les images
function loadImages() {
  return new Promise((resolve, reject) => {
    let loadedImages = 0;
    for (let i = 0; i < imageFiles.length; i++) {
      console.log("Tentative de chargement de l'image:", imageFiles[i]);
      const img = new Image();
      img.src = imageFiles[i];

      img.onload = () => {
        console.log("Image prête à être utilisée:", imageFiles[i]);
        images[i] = img;
        loadedImages++;
        if (loadedImages === imageFiles.length) {
          console.log("Toutes les images sont chargées");
          resolve();
        }
      };

      img.onerror = (error) => {
        console.error(
          "Erreur lors du chargement de l'image:",
          imageFiles[i],
          error
        );
        reject(error);
      };
    }
  });
}

// Fonction pour vérifier si un point est dans les limites du canvas
function isInBounds(x, y) {
  return x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height;
}

// Fonction pour trouver le rayon maximum possible pour une position donnée
function findMaxRadius(x, y) {
  let maxR = maxRadius;

  // Vérifier la distance par rapport aux bords du canvas
  maxR = Math.min(maxR, x, y, canvas.width - x, canvas.height - y);

  // Vérifier la distance par rapport aux autres cercles
  for (let circle of circles) {
    const distance = Math.sqrt(
      Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)
    );
    maxR = Math.min(maxR, distance - circle.radius);
  }

  // Ajouter une variation aléatoire plus importante
  const randomFactor = 0.3 + Math.random() * 0.7; // Variation entre 30% et 100% de la taille maximale possible
  maxR = maxR * randomFactor;

  // Assurer que le rayon ne soit pas inférieur au minimum
  return Math.max(maxR, minRadius);
}

// Créer un cercle
function createCircle(specificImage = null) {
  let x, y;
  let attempts = 0;
  const maxAttempts = 100;
  let bestPosition = null;

  for (let i = 0; i < maxAttempts; i++) {
    x = Math.random() * (canvas.width - maxRadius * 2) + maxRadius;
    y = Math.random() * (canvas.height - maxRadius * 2) + maxRadius;

    if (isInBounds(x, y)) {
      bestPosition = { x, y };
      break;
    }
  }

  if (bestPosition) {
    // Générer un rayon complètement aléatoire entre minRadius et maxRadius
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    let randomImage =
      specificImage || images[Math.floor(Math.random() * images.length)];
    return {
      x: bestPosition.x,
      y: bestPosition.y,
      radius: radius,
      image: randomImage,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    };
  }

  return null;
}

// Fonction pour vérifier si un point est dans un cercle
function isPointInCircle(x, y, circle) {
  const distance = Math.sqrt(
    Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)
  );
  return distance <= circle.radius;
}

// Gestionnaires d'événements de la souris
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Vérifier si le clic est sur un cercle
  for (let circle of circles) {
    if (isPointInCircle(x, y, circle)) {
      selectedCircle = circle;
      isDragging = true;
      break;
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging && selectedCircle) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculer la distance entre le centre du cercle et la souris
    const distance = Math.sqrt(
      Math.pow(x - selectedCircle.x, 2) + Math.pow(y - selectedCircle.y, 2)
    );

    // Calculer la différence avec le rayon actuel
    const radiusDiff = distance - selectedCircle.radius;

    // Ajuster le rayon en fonction de la direction du mouvement
    let newRadius = selectedCircle.radius + radiusDiff * 0.3;

    // Limiter la taille entre minRadius et maxRadius
    newRadius = Math.max(minRadius, Math.min(newRadius, maxRadius));

    selectedCircle.radius = newRadius;
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
  selectedCircle = null;
});

// Fonction d'animation
function animate() {
  if (!isAnimating) return;

  // Appliquer la physique à tous les cercles
  for (let circle of circles) {
    if (circle === selectedCircle) continue;

    // Calculer la direction vers le centre
    const dx = centerX - circle.x;
    const dy = centerY - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Appliquer la gravité vers le centre
      circle.vx += (dx / distance) * gravity;
      circle.vy += (dy / distance) * gravity;

      // Ajouter un mouvement aléatoire
      circle.vx += (Math.random() - 0.5) * randomMovement;
      circle.vy += (Math.random() - 0.5) * randomMovement;

      // Appliquer la friction
      circle.vx *= friction;
      circle.vy *= friction;

      // Limiter la vitesse maximale
      const speed = Math.sqrt(circle.vx * circle.vx + circle.vy * circle.vy);
      if (speed > maxSpeed) {
        circle.vx = (circle.vx / speed) * maxSpeed;
        circle.vy = (circle.vy / speed) * maxSpeed;
      }

      // Calculer la nouvelle position
      let newX = circle.x + circle.vx;
      let newY = circle.y + circle.vy;

      // Vérifier les collisions
      for (let otherCircle of circles) {
        if (circle === otherCircle) continue;

        const newDistance = Math.sqrt(
          Math.pow(newX - otherCircle.x, 2) + Math.pow(newY - otherCircle.y, 2)
        );

        if (newDistance < circle.radius + otherCircle.radius) {
          // Vérifier si c'est la première collision d'un nouveau rond avec un rond du centre
          const isNewCircle = !collisionTracker.has(circle);
          const isCenterCircle = isNearCenter(otherCircle);

          if (isNewCircle && isCenterCircle) {
            // Jouer le son de collision
            son7.currentTime = 0;
            son7
              .play()
              .catch((error) =>
                console.error("Erreur lors de la lecture du son7:", error)
              );
            // Marquer le cercle comme ayant déjà eu une collision
            collisionTracker.add(circle);
          }

          // Calculer la direction de la collision
          const angle = Math.atan2(newY - otherCircle.y, newX - otherCircle.x);

          // Calculer le chevauchement
          const overlap = circle.radius + otherCircle.radius - newDistance;

          // Déplacer les cercles pour résoudre la collision
          const moveX = Math.cos(angle) * overlap * 0.5;
          const moveY = Math.sin(angle) * overlap * 0.5;

          circle.x += moveX;
          circle.y += moveY;
          otherCircle.x -= moveX;
          otherCircle.y -= moveY;

          // Calculer la composante tangentielle pour le glissement
          const tangentX = -Math.sin(angle);
          const tangentY = Math.cos(angle);

          // Projeter la vélocité sur la tangente pour le glissement
          const dotProduct = circle.vx * tangentX + circle.vy * tangentY;
          circle.vx = tangentX * dotProduct * collisionResponse;
          circle.vy = tangentY * dotProduct * collisionResponse;

          // Même chose pour l'autre cercle
          const otherDotProduct =
            otherCircle.vx * tangentX + otherCircle.vy * tangentY;
          otherCircle.vx = tangentX * otherDotProduct * collisionResponse;
          otherCircle.vy = tangentY * otherDotProduct * collisionResponse;
        }
      }

      // Si le mouvement est possible et dans les limites du canvas, déplacer le cercle
      if (isInBounds(newX, newY)) {
        circle.x = newX;
        circle.y = newY;
      }
    }
  }

  drawCircles();
  animationFrame = requestAnimationFrame(animate);
}

// Dessiner les cercles
function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let circle of circles) {
    if (circle.image) {
      try {
        ctx.drawImage(
          circle.image,
          circle.x - circle.radius,
          circle.y - circle.radius,
          circle.radius * 2,
          circle.radius * 2
        );
      } catch (error) {
        console.error("Erreur lors du dessin de l'image:", error);
      }
    }
  }
}

// Fonction pour vérifier si un cercle est proche du centre
function isNearCenter(circle) {
  const distance = Math.sqrt(
    Math.pow(circle.x - centerX, 2) + Math.pow(circle.y - centerY, 2)
  );
  return distance < 200; // Ajustez cette valeur selon vos besoins
}

// Ajouter un cercle
function addCircle(specificImage = null) {
  let newCircle = createCircle(specificImage);
  if (newCircle) {
    circles.push(newCircle);
    // Ajouter le nouveau cercle au tracker
    collisionTracker.add(newCircle);

    // Jouer le son correspondant à la vidéo
    const videoName = newCircle.image.src.split("/").pop();
    const sound = videoSoundMap[videoName];
    if (sound) {
      sound.currentTime = 0;
      sound
        .play()
        .catch((error) =>
          console.error("Erreur lors de la lecture du son:", error)
        );
    }

    drawCircles();
  }
}

// Supprimer un cercle
function removeCircle() {
  if (circles.length > 0) {
    circles.pop();
    drawCircles();
  }
}

// Gestionnaire d'événements pour les touches
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    addCircle();
  } else if (event.key === "ArrowDown") {
    removeCircle();
  } else if (event.key === "i") {
    let newCircle = createCircle(images[0]);
    if (newCircle) {
      circles.push(newCircle);
      son1.currentTime = 0;
      son1
        .play()
        .catch((error) =>
          console.error("Erreur lors de la lecture du son1:", error)
        );
      drawCircles();
    }
  } else if (event.key === "o") {
    let newCircle = createCircle(images[1]);
    if (newCircle) {
      circles.push(newCircle);
      son2.currentTime = 0;
      son2
        .play()
        .catch((error) =>
          console.error("Erreur lors de la lecture du son2:", error)
        );
      drawCircles();
    }
  } else if (event.key === "p") {
    let newCircle = createCircle(images[2]);
    if (newCircle) {
      circles.push(newCircle);
      son3.currentTime = 0;
      son3
        .play()
        .catch((error) =>
          console.error("Erreur lors de la lecture du son3:", error)
        );
      drawCircles();
    }
  } else if (event.key === "j") {
    let newCircle = createCircle(images[0]);
    if (newCircle) {
      circles.push(newCircle);
      son4.currentTime = 0;
      son4
        .play()
        .catch((error) =>
          console.error("Erreur lors de la lecture du son4:", error)
        );
      drawCircles();
    }
  } else if (event.key === "k") {
    let newCircle = createCircle(images[1]);
    if (newCircle) {
      circles.push(newCircle);
      son5.currentTime = 0;
      son5
        .play()
        .catch((error) =>
          console.error("Erreur lors de la lecture du son5:", error)
        );
      drawCircles();
    }
  } else if (event.key === "l") {
    let newCircle = createCircle(images[2]);
    if (newCircle) {
      circles.push(newCircle);
      son6.currentTime = 0;
      son6
        .play()
        .catch((error) =>
          console.error("Erreur lors de la lecture du son6:", error)
        );
      drawCircles();
    }
  }
});

// Configuration initiale
async function setup() {
  try {
    await loadImages();
    // Créer quelques cercles initiaux
    for (let i = 0; i < 10; i++) {
      addCircle();
    }
    // Démarrer l'animation immédiatement
    isAnimating = true;
    animate();
  } catch (error) {
    console.error("Erreur lors du chargement des images", error);
  }
}

setup();
