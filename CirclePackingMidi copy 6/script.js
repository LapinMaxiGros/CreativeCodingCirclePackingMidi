const canvas = document.getElementById("circleCanvas");
const ctx = canvas.getContext("2d");

// Configuration MIDI simplifiée
const midi = {
  init() {
    if (!navigator.requestMIDIAccess) {
      console.error("Web MIDI API non supporté");
      return;
    }

    // Objet pour stocker les intervalles actifs
    const activeIntervals = {};

    navigator
      .requestMIDIAccess()
      .then((access) => {
        access.inputs.forEach((input) => {
          input.onmidimessage = (event) => {
            const [status, note, velocity] = event.data;
            console.log("message du controleur", status, note, velocity);

            // Note On (144) ou Note Off (128)
            const isNoteOn = status === 144 && velocity > 0;
            const isNoteOff =
              status === 128 || (status === 144 && velocity === 0);

            if (isNoteOn) {
              // Démarrer l'intervalle pour cette note
              if (!activeIntervals[note]) {
                activeIntervals[note] = setInterval(() => {
                  if (note === 64) {
                    let newCircle = createCircle(images[0], "topLeft");
                    if (newCircle) {
                      circles.push(newCircle);
                      son1.currentTime = 0;
                      son1
                        .play()
                        .catch((error) => console.error("Erreur son1:", error));
                      drawCircles();
                    }
                  } else if (note === 65) {
                    let newCircle = createCircle(images[0], "topQuarter2");
                    if (newCircle) {
                      circles.push(newCircle);
                      son2.currentTime = 0;
                      son2
                        .play()
                        .catch((error) => console.error("Erreur son2:", error));
                      drawCircles();
                    }
                  } else if (note === 66) {
                    let newCircle = createCircle(images[0], "topQuarter3");
                    if (newCircle) {
                      circles.push(newCircle);
                      son3.currentTime = 0;
                      son3
                        .play()
                        .catch((error) => console.error("Erreur son3:", error));
                      drawCircles();
                    }
                  } else if (note === 67) {
                    let newCircle = createCircle(images[1], "topRightCorner");
                    if (newCircle) {
                      circles.push(newCircle);
                      son4.currentTime = 0;
                      son4
                        .play()
                        .catch((error) => console.error("Erreur son4:", error));
                      drawCircles();
                    }
                  } else if (note === 63) {
                    let newCircle = createCircle(
                      images[1],
                      "topRightCornerLower"
                    );
                    if (newCircle) {
                      circles.push(newCircle);
                      son5.currentTime = 0;
                      son5
                        .play()
                        .catch((error) => console.error("Erreur son5:", error));
                      drawCircles();
                    }
                  } else if (note === 59) {
                    let newCircle = createCircle(images[1], "middleRight");
                    if (newCircle) {
                      circles.push(newCircle);
                      son6.currentTime = 0;
                      son6
                        .play()
                        .catch((error) => console.error("Erreur son6:", error));
                      drawCircles();
                    }
                  } else if (note === 55) {
                    let newCircle = createCircle(
                      images[2],
                      "bottomRightCorner"
                    );
                    if (newCircle) {
                      circles.push(newCircle);
                      son7.currentTime = 0;
                      son7
                        .play()
                        .catch((error) => console.error("Erreur son7:", error));
                      drawCircles();
                    }
                  } else if (note === 54) {
                    let newCircle = createCircle(images[2], "bottomQuarter3");
                    if (newCircle) {
                      circles.push(newCircle);
                      son8.currentTime = 0;
                      son8
                        .play()
                        .catch((error) => console.error("Erreur son8:", error));
                      drawCircles();
                    }
                  } else if (note === 53) {
                    let newCircle = createCircle(images[2], "bottomQuarter2");
                    if (newCircle) {
                      circles.push(newCircle);
                      son9.currentTime = 0;
                      son9
                        .play()
                        .catch((error) => console.error("Erreur son9:", error));
                      drawCircles();
                    }
                  } else if (note === 52) {
                    let newCircle = createCircle(images[3], "bottomLeftCorner");
                    if (newCircle) {
                      circles.push(newCircle);
                      son10.currentTime = 0;
                      son10
                        .play()
                        .catch((error) =>
                          console.error("Erreur son10:", error)
                        );
                      drawCircles();
                    }
                  } else if (note === 56) {
                    let newCircle = createCircle(images[3], "middleLeft");
                    if (newCircle) {
                      circles.push(newCircle);
                      son11.currentTime = 0;
                      son11
                        .play()
                        .catch((error) =>
                          console.error("Erreur son11:", error)
                        );
                      drawCircles();
                    }
                  } else if (note === 60) {
                    let newCircle = createCircle(images[3], "topLeftLower");
                    if (newCircle) {
                      circles.push(newCircle);
                      son12.currentTime = 0;
                      son12
                        .play()
                        .catch((error) =>
                          console.error("Erreur son12:", error)
                        );
                      drawCircles();
                    }
                  }
                }, 200); // Créer un nouveau rond toutes les 200ms
              }
            } else if (isNoteOff) {
              // Arrêter l'intervalle pour cette note
              if (activeIntervals[note]) {
                clearInterval(activeIntervals[note]);
                delete activeIntervals[note];
              }
            }

            // Gérer les messages de contrôle (CC)
            if (note === 16) {
              // Note 16 pour contrôler la taille des rond.png
              const targetScale = 0.3 + (velocity / 127) * 3.7;
              const interpolationFactor = 0.1;

              circles.forEach((circle) => {
                if (circle.image === images[0]) {
                  if (!circle.originalRadius) {
                    circle.originalRadius = circle.radius;
                  }
                  const currentScale = circle.radius / circle.originalRadius;
                  const newScale =
                    currentScale +
                    (targetScale - currentScale) * interpolationFactor;
                  circle.radius = circle.originalRadius * newScale;
                }
              });

              requestAnimationFrame(drawCircles);
            } else if (note === 17) {
              // Note 17 pour contrôler la taille des rond2.png
              const targetScale = 0.3 + (velocity / 127) * 3.7;
              const interpolationFactor = 0.1;

              circles.forEach((circle) => {
                if (circle.image === images[1]) {
                  if (!circle.originalRadius) {
                    circle.originalRadius = circle.radius;
                  }
                  const currentScale = circle.radius / circle.originalRadius;
                  const newScale =
                    currentScale +
                    (targetScale - currentScale) * interpolationFactor;
                  circle.radius = circle.originalRadius * newScale;
                }
              });

              requestAnimationFrame(drawCircles);
            } else if (note === 18) {
              // Note 18 pour contrôler la taille des rond3.png
              const targetScale = 0.3 + (velocity / 127) * 3.7;
              const interpolationFactor = 0.1;

              circles.forEach((circle) => {
                if (circle.image === images[2]) {
                  if (!circle.originalRadius) {
                    circle.originalRadius = circle.radius;
                  }
                  const currentScale = circle.radius / circle.originalRadius;
                  const newScale =
                    currentScale +
                    (targetScale - currentScale) * interpolationFactor;
                  circle.radius = circle.originalRadius * newScale;
                }
              });

              requestAnimationFrame(drawCircles);
            } else if (note === 19) {
              // Note 19 pour contrôler la taille des rond5.png
              const targetScale = 0.3 + (velocity / 127) * 3.7;
              const interpolationFactor = 0.1;

              circles.forEach((circle) => {
                if (circle.image === images[3]) {
                  if (!circle.originalRadius) {
                    circle.originalRadius = circle.radius;
                  }
                  const currentScale = circle.radius / circle.originalRadius;
                  const newScale =
                    currentScale +
                    (targetScale - currentScale) * interpolationFactor;
                  circle.radius = circle.originalRadius * newScale;
                }
              });

              requestAnimationFrame(drawCircles);
            } else if (velocity > 0 && note === 64) {
              let newCircle = createCircle(images[0], "topLeft");
              if (newCircle) {
                circles.push(newCircle);
                son1.currentTime = 0;
                son1
                  .play()
                  .catch((error) => console.error("Erreur son1:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 65) {
              let newCircle = createCircle(images[0], "topQuarter2");
              if (newCircle) {
                circles.push(newCircle);
                son2.currentTime = 0;
                son2
                  .play()
                  .catch((error) => console.error("Erreur son2:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 66) {
              let newCircle = createCircle(images[0], "topQuarter3");
              if (newCircle) {
                circles.push(newCircle);
                son3.currentTime = 0;
                son3
                  .play()
                  .catch((error) => console.error("Erreur son3:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 67) {
              let newCircle = createCircle(images[1], "topRightCorner");
              if (newCircle) {
                circles.push(newCircle);
                son4.currentTime = 0;
                son4
                  .play()
                  .catch((error) => console.error("Erreur son4:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 63) {
              let newCircle = createCircle(images[1], "topRightCornerLower");
              if (newCircle) {
                circles.push(newCircle);
                son5.currentTime = 0;
                son5
                  .play()
                  .catch((error) => console.error("Erreur son5:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 59) {
              let newCircle = createCircle(images[1], "middleRight");
              if (newCircle) {
                circles.push(newCircle);
                son6.currentTime = 0;
                son6
                  .play()
                  .catch((error) => console.error("Erreur son6:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 55) {
              let newCircle = createCircle(images[2], "bottomRightCorner");
              if (newCircle) {
                circles.push(newCircle);
                son7.currentTime = 0;
                son7
                  .play()
                  .catch((error) => console.error("Erreur son7:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 54) {
              let newCircle = createCircle(images[2], "bottomQuarter3");
              if (newCircle) {
                circles.push(newCircle);
                son8.currentTime = 0;
                son8
                  .play()
                  .catch((error) => console.error("Erreur son8:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 53) {
              let newCircle = createCircle(images[2], "bottomQuarter2");
              if (newCircle) {
                circles.push(newCircle);
                son9.currentTime = 0;
                son9
                  .play()
                  .catch((error) => console.error("Erreur son9:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 52) {
              let newCircle = createCircle(images[3], "bottomLeftCorner");
              if (newCircle) {
                circles.push(newCircle);
                son10.currentTime = 0;
                son10
                  .play()
                  .catch((error) => console.error("Erreur son10:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 56) {
              let newCircle = createCircle(images[3], "middleLeft");
              if (newCircle) {
                circles.push(newCircle);
                son11.currentTime = 0;
                son11
                  .play()
                  .catch((error) => console.error("Erreur son11:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 60) {
              let newCircle = createCircle(images[3], "topLeftLower");
              if (newCircle) {
                circles.push(newCircle);
                son12.currentTime = 0;
                son12
                  .play()
                  .catch((error) => console.error("Erreur son12:", error));
                drawCircles();
              }
            } else if (velocity > 0 && note === 55) {
              // Créer 20 cercles aléatoires
              for (let i = 0; i < 20; i++) {
                // Choisir une image aléatoire parmi les trois
                const randomImage =
                  images[Math.floor(Math.random() * images.length)];
                let newCircle = createCircle(randomImage);
                if (newCircle) {
                  circles.push(newCircle);
                }
              }
              // Jouer un son aléatoire
              const randomSound = [son1, son2, son3, son4][
                Math.floor(Math.random() * 4)
              ];
              randomSound.currentTime = 0;
              randomSound
                .play()
                .catch((error) => console.error("Erreur son:", error));
              drawCircles();
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
let imageFiles = [
  "img/rond.png",
  "img/rond2.png",
  "img/rond3.png",
  "img/rond5.png",
];
let oeilImage = null;
let oeilX = 0;
let oeilY = 0;
let rond4Image = null;
let rond4Circle = null; // Nouveau cercle pour rond4

// Variables pour l'animation
let isAnimating = false;
let animationFrame;
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
const gravity = 1.5;
const enhancedGravity = 2.5;
const randomMovement = 0.005;
const friction = 0.99;
const maxSpeed = 4.0;
const collisionResponse = 0.7;
const growthSpeed = 2;

// Système pour suivre les collisions
let collisionTracker = new Set();

// Sons pour les vidéos
let son1 = new Audio("son/son1-.mp3");
let son2 = new Audio("son/son2-.mp3");
let son3 = new Audio("son/son3-.mp3");
let son4 = new Audio("son/son4-.mp3");
let son5 = new Audio("son/son5-.mp3");
let son6 = new Audio("son/son6-.mp3");
let son7 = new Audio("son/son7-.mp3");
let son8 = new Audio("son/son8-.mp3");
let son9 = new Audio("son/son9-.mp3");
let son10 = new Audio("son/son10-.mp3");
let son11 = new Audio("son/son11-.mp3");
let son12 = new Audio("son/son12-.mp3");
let sonAmbiance = new Audio("son/SonAmbiance.mp3");
let sonEmail = new Audio("son/email.mp3");

son1.volume = 0.5;
son2.volume = 0.5;
son3.volume = 0.5;
son4.volume = 0.5;
son5.volume = 0.5;
son6.volume = 0.5;
son7.volume = 0.3;
son8.volume = 0.3;
son9.volume = 0.5;
son10.volume = 0.5;
son11.volume = 0.5;
son12.volume = 0.5;
sonAmbiance.volume = 0.3;
sonEmail.volume = 0.5;

// Variables pour stocker les associations son/vidéo
let videoSoundMap = {
  "rond.png": son1,
  "rond2.png": son2,
  "rond3.png": son3,
  "rond5.png": son4,
};

// Charger les images
function loadImages() {
  return new Promise((resolve, reject) => {
    let loadedImages = 0;

    // Charger l'image de l'œil
    oeilImage = new Image();
    oeilImage.src = "img/oeil.png";
    oeilImage.onload = () => {
      console.log("Image de l'œil chargée");
      oeilX = Math.random() * (canvas.width - 400);
      oeilY = Math.random() * (canvas.height - 400);
    };

    // Charger rond4.png
    rond4Image = new Image();
    rond4Image.src = "img/rond4.png";
    rond4Image.onload = () => {
      console.log("Image rond4.png chargée");
      // Créer le cercle rond4 au centre avec un rayon plus petit
      rond4Circle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 120, // Réduction du rayon de 150 à 120
        image: rond4Image,
        vx: 0,
        vy: 0,
      };
    };

    // Charger les autres images
    for (let i = 0; i < imageFiles.length; i++) {
      const img = new Image();
      img.src = imageFiles[i];
      img.onload = () => {
        images[i] = img;
        loadedImages++;
        if (loadedImages === imageFiles.length) {
          resolve();
        }
      };
    }
  });
}

// Modifier la fonction isInBounds pour être plus permissive
function isInBounds(x, y) {
  const margin = 100; // Marge de sécurité
  return (
    x >= -margin &&
    x <= canvas.width + margin &&
    y >= -margin &&
    y <= canvas.height + margin
  );
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
function createCircle(specificImage = null, specialPosition = null) {
  let x, y;
  let attempts = 0;
  const maxAttempts = 100;
  let bestPosition = null;

  for (let i = 0; i < maxAttempts; i++) {
    // Définir la zone de spawn en fonction de l'image
    if (specialPosition === "topLeftLower") {
      x = 0;
      y = canvas.height * 0.4;
    } else if (specialPosition === "middleLeft") {
      x = 0;
      y = canvas.height * 0.7; // Position à 70% de la hauteur au lieu du milieu
    } else if (specialPosition === "middleTop") {
      // Position spéciale pour la touche Z : milieu en haut
      x = canvas.width / 2;
      y = 0;
    } else if (specialPosition === "middleRight") {
      // Position spéciale pour la touche Z : milieu droite
      x = canvas.width;
      y = (canvas.height * 2) / 3; // Position à 2/3 de la hauteur
    } else if (specialPosition === "middleBottom") {
      // Position spéciale pour la touche N : milieu en bas
      x = canvas.width / 2;
      y = canvas.height;
    } else if (specialPosition === "topLeft") {
      // Position spéciale pour la touche Q : coin haut gauche
      x = 0;
      y = 0;
    } else if (specialPosition === "topQuarter2") {
      // Position spéciale pour la touche W : 1/4 du haut
      x = canvas.width / 4;
      y = 0;
    } else if (specialPosition === "topQuarter3") {
      // Position spéciale pour la touche E : 3/4 du haut
      x = (canvas.width * 3) / 4;
      y = 0;
    } else if (specialPosition === "topRightCorner") {
      // Position spéciale pour la touche R : coin droit en haut
      x = canvas.width;
      y = 0;
    } else if (specialPosition === "topRightCornerLower") {
      // Position spéciale pour la touche T : coin droit en haut mais plus bas
      x = canvas.width;
      y = canvas.height / 3; // Position à 1/3 de la hauteur
    } else if (specialPosition === "bottomRightCorner") {
      // Position spéciale pour la touche U : coin bas droit
      x = canvas.width;
      y = canvas.height;
    } else if (specialPosition === "bottomLeftCorner") {
      // Position spéciale pour la touche A : coin bas gauche
      x = 0;
      y = canvas.height;
    } else if (specialPosition === "bottomQuarter2") {
      // Position spéciale pour la touche S : bas à 1/4 de la largeur
      x = canvas.width / 4;
      y = canvas.height;
    } else if (specialPosition === "bottomQuarter3") {
      // Position spéciale pour la touche D : bas à 3/4 de la largeur
      x = (canvas.width * 3) / 4;
      y = canvas.height;
    } else if (specificImage === images[0]) {
      // rond.png
      // Zone haut gauche (20% de la largeur et hauteur)
      x = Math.random() * (canvas.width * 0.2);
      y = Math.random() * (canvas.height * 0.2);
    } else if (specificImage === images[1]) {
      // rond2.png
      // Zone haut droite (20% de la largeur et hauteur)
      x = canvas.width * 0.8 + Math.random() * (canvas.width * 0.2);
      y = Math.random() * (canvas.height * 0.2);
    } else if (specificImage === images[2]) {
      // rond3.png
      // Zone bas droite (20% de la largeur et hauteur)
      x = canvas.width * 0.8 + Math.random() * (canvas.width * 0.2);
      y = canvas.height * 0.8 + Math.random() * (canvas.height * 0.2);
    } else if (specificImage === images[3]) {
      // rond5.png
      // Zone bas gauche (20% de la largeur et hauteur)
      x = Math.random() * (canvas.width * 0.2);
      y = canvas.height * 0.8 + Math.random() * (canvas.height * 0.2);
    } else {
      // Pour les cercles aléatoires, utiliser toute la zone
      x = Math.random() * (canvas.width - maxRadius * 2) + maxRadius;
      y = Math.random() * (canvas.height - maxRadius * 2) + maxRadius;
    }

    if (isInBounds(x, y)) {
      bestPosition = { x, y };
      break;
    }
  }

  if (bestPosition) {
    // Probabilité de 30% d'avoir un rond plus gros
    const isBigger = Math.random() < 0.3;
    let radius;

    if (isBigger) {
      // Pour les ronds plus gros, utiliser une taille entre 1.8x et 3x la taille normale
      const sizeMultiplier = 1.8 + Math.random() * 1.2;
      radius =
        (minRadius + Math.random() * (maxRadius - minRadius)) * sizeMultiplier;
    } else {
      // Taille normale
      radius = minRadius + Math.random() * (maxRadius - minRadius);
    }

    let randomImage =
      specificImage || images[Math.floor(Math.random() * images.length)];
    return {
      x: bestPosition.x,
      y: bestPosition.y,
      radius: radius,
      originalRadius: radius,
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

// Ajouter ces variables au début du fichier avec les autres variables d'animation
let isExploding = false;
let explosionForce = 0;
const maxExplosionForce = 15;
let isStabilized = false;
let targetX = 0;
let targetY = 0;
let fadeOutStarted = false;
let fadeOutOpacity = 1;
let fadeOutStartTime = 0;

// Fonction d'animation
function animate() {
  if (!isAnimating) return;

  // Vérifier la collision entre rond4 et l'œil
  if (rond4Circle && oeilImage) {
    const eyeCenterX = oeilX + 200;
    const eyeCenterY = oeilY + 200;
    const distToOeil = Math.sqrt(
      Math.pow(rond4Circle.x - eyeCenterX, 2) +
        Math.pow(rond4Circle.y - eyeCenterY, 2)
    );

    // Si rond4 est proche de l'œil, l'attirer vers son centre
    if (distToOeil < (rond4Circle.radius + 200) * 0.8) {
      // Calculer la direction vers le centre de l'œil
      const dx = eyeCenterX - rond4Circle.x;
      const dy = eyeCenterY - rond4Circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        // Force d'attraction plus forte quand ils sont proches
        const attractionForce =
          2.0 * (1 - distance / (rond4Circle.radius + 200));

        // Appliquer la force d'attraction
        rond4Circle.vx += (dx / distance) * attractionForce;
        rond4Circle.vy += (dy / distance) * attractionForce;

        // Limiter la vitesse maximale
        const speed = Math.sqrt(
          rond4Circle.vx * rond4Circle.vx + rond4Circle.vy * rond4Circle.vy
        );
        const maxSpeed = 3.0;
        if (speed > maxSpeed) {
          rond4Circle.vx = (rond4Circle.vx / speed) * maxSpeed;
          rond4Circle.vy = (rond4Circle.vy / speed) * maxSpeed;
        }
      }

      // Si la collision est très profonde, stabiliser et déclencher l'explosion
      if (distToOeil < (rond4Circle.radius + 200) * 0.5 && !isExploding) {
        console.log("Explosion déclenchée !");
        // Jouer le son email.mp3 immédiatement
        sonEmail.currentTime = 0;
        sonEmail
          .play()
          .catch((error) => console.error("Erreur son email:", error));

        isExploding = true;
        explosionForce = maxExplosionForce;
        isStabilized = true;
        targetX = eyeCenterX;
        targetY = eyeCenterY;
      }
    }
  }

  // Stabiliser rond4 si nécessaire
  if (isStabilized && rond4Circle) {
    // Réduire progressivement la vitesse
    rond4Circle.vx *= 0.8;
    rond4Circle.vy *= 0.8;

    // Amener doucement rond4 à sa position cible
    const dx = targetX - rond4Circle.x;
    const dy = targetY - rond4Circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      rond4Circle.x += dx * 0.1;
      rond4Circle.y += dy * 0.1;
    } else {
      // Position finale exacte
      rond4Circle.x = targetX;
      rond4Circle.y = targetY;
      rond4Circle.vx = 0;
      rond4Circle.vy = 0;
    }
  }

  // Modifier la partie de l'animation qui gère l'explosion
  if (isExploding) {
    // Appliquer la force d'explosion à tous les cercles sauf rond4
    for (let circle of circles) {
      if (circle === rond4Circle) continue;

      // Calculer la direction depuis le centre de l'explosion
      const dx = circle.x - centerX;
      const dy = circle.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Normaliser la direction
      const dirX = dx / distance;
      const dirY = dy / distance;

      // Force de base plus forte
      const baseForce = 30; // Augmenté de 15 à 30

      // Ajouter une légère variation aléatoire pour plus de naturel
      const randomFactor = 0.9 + Math.random() * 0.6; // Entre 0.9 et 1.5

      // Appliquer la force avec une accélération progressive
      circle.vx = dirX * baseForce * randomFactor;
      circle.vy = dirY * baseForce * randomFactor;

      // Ajouter une légère rotation pour plus de fluidité
      const rotationSpeed = 0.03; // Augmenté de 0.02 à 0.03
      circle.vx += (Math.random() - 0.5) * rotationSpeed;
      circle.vy += (Math.random() - 0.5) * rotationSpeed;

      // Mettre à jour la position avec une accélération progressive
      circle.x += circle.vx;
      circle.y += circle.vy;
    }

    // Supprimer les cercles qui sortent de l'écran
    circles = circles.filter((circle) => {
      if (circle === rond4Circle) return true;
      return isInBounds(circle.x, circle.y);
    });

    // Démarrer le fondu seulement quand tous les ronds sont sortis
    if (!fadeOutStarted && circles.length <= 1) {
      // Attendre un court instant pour s'assurer que tous les ronds sont bien sortis
      setTimeout(() => {
        fadeOutStarted = true;
        fadeOutStartTime = Date.now();
      }, 500);
    }

    // Gérer le fondu
    if (fadeOutStarted) {
      const elapsedTime = Date.now() - fadeOutStartTime;
      fadeOutOpacity = Math.max(0, 1 - elapsedTime / 1000); // 1 seconde de fondu

      // Ajuster le volume du son d'ambiance
      sonAmbiance.volume = fadeOutOpacity * 0.3; // 0.3 est le volume initial

      // Si le fondu est terminé, rafraîchir la page
      if (fadeOutOpacity <= 0) {
        isExploding = false;
        circles = circles.filter((circle) => circle === rond4Circle);
        sonAmbiance.pause();
        // Rafraîchir la page
        window.location.reload();
      }
    }
  }

  // Modifier la partie de l'animation qui gère les collisions
  if (!isExploding) {
    // Appliquer la physique à tous les cercles
    for (let circle of circles) {
      if (circle === selectedCircle || circle === rond4Circle) continue;

      // Calculer la direction vers le centre
      const dx = centerX - circle.x;
      const dy = centerY - circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        // Vérifier si le cercle est proche de rond4
        let currentGravity = gravity;

        // Ajuster la gravité en fonction de la taille du cercle
        if (circle.radius > maxRadius * 0.7) {
          currentGravity *= 1.5;
        }

        if (rond4Circle) {
          const distToRond4 = Math.sqrt(
            Math.pow(circle.x - rond4Circle.x, 2) +
              Math.pow(circle.y - rond4Circle.y, 2)
          );
          if (distToRond4 < 200) {
            currentGravity = enhancedGravity;
          }
        }

        // Appliquer la gravité vers le centre avec des limites
        const maxForce = 1.0;
        const forceX = (dx / distance) * currentGravity;
        const forceY = (dy / distance) * currentGravity;

        circle.vx += Math.max(-maxForce, Math.min(maxForce, forceX));
        circle.vy += Math.max(-maxForce, Math.min(maxForce, forceY));

        // Ajouter un mouvement aléatoire plus contrôlé
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

        // Vérifier les collisions avec les autres cercles
        let hasCollision = false;
        for (let otherCircle of circles) {
          if (circle === otherCircle) continue;
          if (checkCollision(circle, otherCircle, newX, newY)) {
            hasCollision = true;
          }
        }

        // Vérifier la collision avec rond4
        if (rond4Circle) {
          if (checkCollision(circle, rond4Circle, newX, newY)) {
            hasCollision = true;
          }
        }

        // Si le mouvement est possible, déplacer le cercle
        if (!hasCollision) {
          circle.x = newX;
          circle.y = newY;
        } else {
          // Si collision, réduire la vitesse mais pas trop
          circle.vx *= 0.7;
          circle.vy *= 0.7;
        }
      }
    }
  }

  // Appliquer la friction à rond4
  if (rond4Circle) {
    rond4Circle.vx *= friction;
    rond4Circle.vy *= friction;

    // Déplacer rond4 avec vérification des limites
    let newX = rond4Circle.x + rond4Circle.vx;
    let newY = rond4Circle.y + rond4Circle.vy;

    if (isInBounds(newX, newY)) {
      rond4Circle.x = newX;
      rond4Circle.y = newY;
    } else {
      // Si hors limites, réduire la vitesse
      rond4Circle.vx *= 0.5;
      rond4Circle.vy *= 0.5;
    }
  }

  drawCircles();
  animationFrame = requestAnimationFrame(animate);
}

// Modifier la fonction checkCollision pour être plus stable
function checkCollision(circle, otherCircle, newX, newY) {
  const newDistance = Math.sqrt(
    Math.pow(newX - otherCircle.x, 2) + Math.pow(newY - otherCircle.y, 2)
  );

  if (newDistance < circle.radius + otherCircle.radius) {
    // Calculer la direction de la collision
    const angle = Math.atan2(newY - otherCircle.y, newX - otherCircle.x);

    // Calculer le chevauchement
    const overlap = circle.radius + otherCircle.radius - newDistance;

    // Déplacer les cercles pour résoudre la collision
    const moveX = Math.cos(angle) * overlap * 0.5;
    const moveY = Math.sin(angle) * overlap * 0.5;

    // Vérifier que le déplacement ne fait pas sortir du canvas
    const newCircleX = circle.x + moveX;
    const newCircleY = circle.y + moveY;
    const newOtherX = otherCircle.x - moveX;
    const newOtherY = otherCircle.y - moveY;

    // Appliquer le déplacement même si légèrement hors limites
    circle.x = newCircleX;
    circle.y = newCircleY;
    otherCircle.x = newOtherX;
    otherCircle.y = newOtherY;

    // Calculer la composante tangentielle pour le glissement
    const tangentX = -Math.sin(angle);
    const tangentY = Math.cos(angle);

    // Projeter la vélocité sur la tangente pour le glissement
    const dotProduct = circle.vx * tangentX + circle.vy * tangentY;
    circle.vx = tangentX * dotProduct * 0.8;
    circle.vy = tangentY * dotProduct * 0.8;

    // Même chose pour l'autre cercle
    const otherDotProduct =
      otherCircle.vx * tangentX + otherCircle.vy * tangentY;
    otherCircle.vx = tangentX * otherDotProduct * 0.8;
    otherCircle.vy = tangentY * otherDotProduct * 0.8;

    return true;
  }
  return false;
}

// Dessiner les cercles
function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner l'œil avec opacité
  if (oeilImage && oeilImage.complete) {
    ctx.globalAlpha = fadeOutOpacity;
    ctx.drawImage(oeilImage, oeilX, oeilY, 400, 400);
  }

  // Dessiner rond4 avec opacité
  if (rond4Circle && rond4Circle.image && rond4Circle.image.complete) {
    ctx.globalAlpha = fadeOutOpacity;
    ctx.drawImage(
      rond4Circle.image,
      rond4Circle.x - rond4Circle.radius,
      rond4Circle.y - rond4Circle.radius,
      rond4Circle.radius * 2,
      rond4Circle.radius * 2
    );
  }

  // Réinitialiser l'opacité pour les autres cercles
  ctx.globalAlpha = 1;

  // Dessiner les cercles
  for (let circle of circles) {
    if (circle.image) {
      ctx.drawImage(
        circle.image,
        circle.x - circle.radius,
        circle.y - circle.radius,
        circle.radius * 2,
        circle.radius * 2
      );
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

    // Jouer le son correspondant à l'image
    if (newCircle.image === images[0]) {
      son1.currentTime = 0;
      son1.play().catch((error) => console.error("Erreur son1:", error));
    } else if (newCircle.image === images[1]) {
      son2.currentTime = 0;
      son2.play().catch((error) => console.error("Erreur son2:", error));
    } else if (newCircle.image === images[2]) {
      son3.currentTime = 0;
      son3.play().catch((error) => console.error("Erreur son3:", error));
    } else if (newCircle.image === images[3]) {
      son4.currentTime = 0;
      son4.play().catch((error) => console.error("Erreur son4:", error));
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
  } else if (event.key === "u" || event.key === "U") {
    let newCircle = createCircle(images[1], "bottomRightCorner");
    if (newCircle) {
      circles.push(newCircle);
      son2.currentTime = 0;
      son2.play().catch((error) => console.error("Erreur son2:", error));
      drawCircles();
    }
  } else if (event.key === "n" || event.key === "N") {
    let newCircle = createCircle(images[3], "middleBottom");
    if (newCircle) {
      circles.push(newCircle);
      son4.currentTime = 0;
      son4.play().catch((error) => console.error("Erreur son4:", error));
      drawCircles();
    }
  } else if (event.key === "z" || event.key === "Z") {
    let newCircle = createCircle(images[1], "middleRight");
    if (newCircle) {
      circles.push(newCircle);
      son2.currentTime = 0;
      son2.play().catch((error) => console.error("Erreur son2:", error));
      drawCircles();
    }
  } else if (event.key === "t" || event.key === "T") {
    let newCircle = createCircle(images[1], "topRightCornerLower");
    if (newCircle) {
      circles.push(newCircle);
      son2.currentTime = 0;
      son2.play().catch((error) => console.error("Erreur son2:", error));
      drawCircles();
    }
  } else if (event.key === "m" || event.key === "M") {
    let newCircle = createCircle(images[3]); // rond5.png
    if (newCircle) {
      circles.push(newCircle);
      son4.currentTime = 0;
      son4.play().catch((error) => console.error("Erreur son4:", error));
      drawCircles();
    }
  } else if (event.key === "i") {
    let newCircle = createCircle(images[0]);
    if (newCircle) {
      circles.push(newCircle);
      son1.currentTime = 0;
      son1.play().catch((error) => console.error("Erreur son1:", error));
      drawCircles();
    }
  } else if (event.key === "o") {
    let newCircle = createCircle(images[1]);
    if (newCircle) {
      circles.push(newCircle);
      son2.currentTime = 0;
      son2.play().catch((error) => console.error("Erreur son2:", error));
      drawCircles();
    }
  } else if (event.key === "p") {
    let newCircle = createCircle(images[2]);
    if (newCircle) {
      circles.push(newCircle);
      son3.currentTime = 0;
      son3.play().catch((error) => console.error("Erreur son3:", error));
      drawCircles();
    }
  } else if (event.key === "j") {
    let newCircle = createCircle(images[3]);
    if (newCircle) {
      circles.push(newCircle);
      son4.currentTime = 0;
      son4.play().catch((error) => console.error("Erreur son4:", error));
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
  } else if (event.key === "q" || event.key === "Q") {
    let newCircle = createCircle(images[0], "topLeft");
    if (newCircle) {
      circles.push(newCircle);
      son1.currentTime = 0;
      son1.play().catch((error) => console.error("Erreur son1:", error));
      drawCircles();
    }
  } else if (event.key === "w" || event.key === "W") {
    let newCircle = createCircle(images[0], "topQuarter2");
    if (newCircle) {
      circles.push(newCircle);
      son1.currentTime = 0;
      son1.play().catch((error) => console.error("Erreur son1:", error));
      drawCircles();
    }
  } else if (event.key === "e" || event.key === "E") {
    let newCircle = createCircle(images[0], "topQuarter3");
    if (newCircle) {
      circles.push(newCircle);
      son1.currentTime = 0;
      son1.play().catch((error) => console.error("Erreur son1:", error));
      drawCircles();
    }
  } else if (event.key === "r" || event.key === "R") {
    let newCircle = createCircle(images[0], "topRightCorner");
    if (newCircle) {
      circles.push(newCircle);
      son1.currentTime = 0;
      son1.play().catch((error) => console.error("Erreur son1:", error));
      drawCircles();
    }
  } else if (event.key === "a" || event.key === "A") {
    let newCircle = createCircle(images[2], "bottomLeftCorner");
    if (newCircle) {
      circles.push(newCircle);
      son3.currentTime = 0;
      son3.play().catch((error) => console.error("Erreur son3:", error));
      drawCircles();
    }
  } else if (event.key === "s" || event.key === "S") {
    let newCircle = createCircle(images[2], "bottomQuarter2");
    if (newCircle) {
      circles.push(newCircle);
      son3.currentTime = 0;
      son3.play().catch((error) => console.error("Erreur son3:", error));
      drawCircles();
    }
  } else if (event.key === "d" || event.key === "D") {
    let newCircle = createCircle(images[2], "bottomQuarter3");
    if (newCircle) {
      circles.push(newCircle);
      son3.currentTime = 0;
      son3.play().catch((error) => console.error("Erreur son3:", error));
      drawCircles();
    }
  } else if (event.key === "f" || event.key === "F") {
    let newCircle = createCircle(images[3], "bottomLeftCorner");
    if (newCircle) {
      circles.push(newCircle);
      son4.currentTime = 0;
      son4.play().catch((error) => console.error("Erreur son4:", error));
      drawCircles();
    }
  } else if (event.key === "g" || event.key === "G") {
    let newCircle = createCircle(images[3], "middleLeft");
    if (newCircle) {
      circles.push(newCircle);
      son4.currentTime = 0;
      son4.play().catch((error) => console.error("Erreur son4:", error));
      drawCircles();
    }
  } else if (event.key === "h" || event.key === "H") {
    let newCircle = createCircle(images[3], "topLeft");
    if (newCircle) {
      circles.push(newCircle);
      son4.currentTime = 0;
      son4.play().catch((error) => console.error("Erreur son4:", error));
      drawCircles();
    }
  }
});

// Configuration initiale
async function setup() {
  try {
    await loadImages();
    // Ne plus créer de cercles initiaux
    // Démarrer l'animation immédiatement
    isAnimating = true;
    animate();
    // Lancer le son d'ambiance au chargement de la page
    sonAmbiance
      .play()
      .catch((error) => console.error("Erreur son d'ambiance:", error));
  } catch (error) {
    console.error("Erreur lors du chargement des images", error);
  }
}

setup();
