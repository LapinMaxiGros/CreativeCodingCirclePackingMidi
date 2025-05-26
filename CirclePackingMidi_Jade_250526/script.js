import { initSounds } from "./sounds.js";
import {
  son1,
  son2,
  son3,
  son4,
  son5,
  son6,
  son7,
  son8,
  son9,
  son10,
  son11,
  son12,
  sonAmbiance,
  sonEmail,
} from "./sounds.js";

export const canvas = document.getElementById("circleCanvas");
// get pixel ratio

export const ctx = canvas.getContext("2d");

// Définir la taille du canvas pour qu'il occupe toute la page
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Appeler resizeCanvas au chargement et lors du redimensionnement
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Configuration initiale
async function setup() {
  try {
    await loadImages();
    // Ne pas démarrer l'animation immédiatement
    isAnimating = false;
    // Initialiser les sons
    initSounds();
    // Lancer le son d'ambiance immédiatement
    if (sonAmbiance) {
      sonAmbiance.volume = 0.3;
      sonAmbiance.loop = true;
      sonAmbiance
        .play()
        .catch((error) => console.error("Erreur son d'ambiance:", error));
    }
  } catch (error) {
    console.error("Erreur lors du chargement des images", error);
  }
}

export let circles = [];
export let images = [];
let minRadius = 5;
let maxRadius = 50;
let selectedCircle = null;

// Tableaux des fichiers d'images

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
let explosionForce = 0;
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
const gravity = 1.5;
const enhancedGravity = 2.5;
const randomMovement = 0.005;
const friction = 0.99;
const maxSpeed = 4.0;
const collisionResponse = 0.7;
const growthSpeed = 2;

// A définir
let eyeSize = 0;

// Système pour suivre les collisions
let collisionTracker = new Set();

// Charger les images

// #region Loading images
function loadImages() {
  return new Promise((resolve, reject) => {
    let loadedImages = 0;

    // Charger rond4.png
    rond4Image = new Image();
    rond4Image.src = "img/para.png";
    rond4Image.onload = () => {
      // Créer le cercle rond4 au centre avec un rayon plus petit
      rond4Circle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 200, // Augmentation du rayon de 120 à 200
        image: rond4Image,
        vx: 0,
        vy: 0,
      };

      // Charger l'image de l'œil
      oeilImage = new Image();
      oeilImage.src = "img/oeil.png";
      oeilImage.onload = () => {
        let validPosition = false;
        // Try up to 20 times to find a position far enough from the center
        for (let i = 0; i < 20; i++) {
          const candidateX = Math.random() * (canvas.width - 400);
          const candidateY = Math.random() * (canvas.height - 400);
          // Calculate distance from oeil center to canvas center
          const eyeCenterX = candidateX + 200;
          const eyeCenterY = candidateY + 200;
          const distToCenter = Math.sqrt(
            Math.pow(eyeCenterX - canvas.width / 2, 2) +
              Math.pow(eyeCenterY - canvas.height / 2, 2)
          );
          // Require a safe distance from the center (rond4Circle)
          if (distToCenter > 350) {
            // 350 is a safe margin, adjust if needed
            oeilX = candidateX;
            oeilY = candidateY;
            validPosition = true;
            break;
          }
        }
        // Fallback: if not found, just use a random position
        if (!validPosition) {
          oeilX = Math.random() * (canvas.width - 400);
          oeilY = Math.random() * (canvas.height - 400);
        }
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
      images.push(img);
    }
  });
}
// #endregion

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

// Créer un cercle
export function createCircle(specificImage = null, specialPosition = null) {
  let x, y;
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

// Ajouter ces variables au début du fichier avec les autres variables d'animation
let isExploding = false;
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

        // check if sonEmail is loaded
        if (!sonEmail || !sonEmail.readyState) {
          console.error("Le son email n'est pas prêt à être joué.");
          return;
        }
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
// utiliser ce drawCircles in place of the original shared.js drawCircles function
export function drawCircles() {
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

// Fonction pour démarrer le jeu
function startGame() {
  const startScreen = document.getElementById("startScreen");
  const gameScreen = document.getElementById("gameScreen");

  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  isAnimating = true;
  animate();
}

// Ajouter l'écouteur d'événements pour le bouton start
document.getElementById("startButton").addEventListener("click", startGame);

setup();
