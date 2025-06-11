import { circles, images, createCircle, drawCircles } from "./script.js";
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
} from "./sounds.js";

// Classe pour gérer l'état des notes MIDI
class MidiNoteState {
  constructor() {
    this.activeNotes = new Map();
    this.animationFrame = null;
    this.animationInterval = 300; // 1000ms = 1 second between circles
    this.lastTime = 0;
    this.currentSound = null;
  }

  setNoteState(note, isDown, velocity) {
    // Mettre à jour l'état de la note
    this.activeNotes.set(note, isDown);

    // Si la note est active, lancer l'animation

    if (note === 16 || note === 17 || note === 18 || note === 19) {
      scaleCircles(note, velocity);

      // Modifier la taille des cercles
      // Ne pas traiter les messages de contrôle pour les cercles
      // Continuer l'animation des cercles
      // requestAnimationFrame(drawCircles);
      return;
    }

    if (isDown) {
      this.startAnimation();
    } else {
      this.stopAnimation();
    }
  }

  startAnimation() {
    const currentTime = Date.now();

    // Only create circles if enough time has passed
    if (currentTime - this.lastTime >= this.animationInterval) {
      // Créer un nouveau cercle pour la note active

      for (let [note, isActive] of this.activeNotes) {
        if (isActive) {
          let newCircle = null;

          // Créer le cercle approprié en fonction de la note
          if (note === 64) {
            newCircle = createCircle(images[0], "topLeft", true);
          } else if (note === 65) {
            newCircle = createCircle(images[0], "topQuarter2", true);
          } else if (note === 66) {
            newCircle = createCircle(images[0], "topQuarter3", true);
          } else if (note === 67) {
            newCircle = createCircle(images[1], "topRightCorner", true);
          } else if (note === 63) {
            newCircle = createCircle(images[1], "topRightCornerLower", true);
          } else if (note === 59) {
            newCircle = createCircle(images[1], "middleRight", true);
          } else if (note === 55) {
            newCircle = createCircle(images[2], "bottomRightCorner", true);
          } else if (note === 54) {
            newCircle = createCircle(images[2], "bottomQuarter3", true);
          } else if (note === 53) {
            newCircle = createCircle(images[2], "bottomQuarter2", true);
          } else if (note === 52) {
            newCircle = createCircle(images[3], "bottomLeftCorner", true);
          } else if (note === 56) {
            newCircle = createCircle(images[3], "middleLeft", true);
          } else if (note === 60) {
            newCircle = createCircle(images[3], "topLeftLower", true);
          }

          if (newCircle) {
            circles.push(newCircle);
            // Jouer le son correspondant

            const noteToSound = {
              64: 0,
              65: 1,
              66: 2,
              67: 3,
              63: 4,
              59: 5,
              55: 6,
              54: 7,
              53: 8,
              52: 9,
              56: 10,
              60: 11,
            };

            console.log([noteToSound[note]]);

            const sound = [
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
            ][noteToSound[note]];

            // Kill current sound before playing new one
            if (this.currentSound && this.currentSound !== sound) {
              this.killCurrentSound();
            }

            if (this.currentSound !== sound) {
              console.log("Playing sound:", noteToSound[note]);
              this.currentSound = sound; // Store the current sound
              sound.currentTime = 0;
              // Play the sound
              sound
                .play()
                .catch((error) =>
                  console.error(`Erreur son${soundIndex + 1}:`, error)
                );
            }
          }
        }
      }

      this.lastTime = currentTime;
    }

    // Dessiner les cercles (this runs at 60fps to keep animation smooth)
    drawCircles();

    // Continuer l'animation tant qu'une note est active
    const anyActive = Array.from(this.activeNotes.values()).some(
      (isActive) => isActive
    );
    if (anyActive) {
      this.animationFrame = requestAnimationFrame(() => this.startAnimation());
    }
  }

  // Method to kill/stop the current sound
  killCurrentSound() {
    if (this.currentSound) {
      // Faire un fondu du son sur 1000ms
      const fadeOutDuration = 1000; // durée en millisecondes
      const startVolume = this.currentSound.volume;
      const startTime = Date.now();

      const fadeOut = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / fadeOutDuration, 1);

        if (progress < 1) {
          this.currentSound.volume = startVolume * (1 - progress);
          requestAnimationFrame(fadeOut);
        } else {
          this.currentSound.pause();
          this.currentSound.currentTime = 0;
          this.currentSound.volume = startVolume; // Restaurer le volume initial
          this.currentSound = null;
        }
      };

      fadeOut();
    }
  }

  stopAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
      this.lastTime = 0;
      console.log(this.currentSound);
      this.killCurrentSound(); // Kill the current sound instead of just setting to null
    }
  }
}

// Configuration MIDI
const midi = {
  init() {
    console.log("hello");
    if (!navigator.requestMIDIAccess) {
      console.error("Web MIDI API non supporté");
      return;
    }

    navigator
      .requestMIDIAccess()
      .then((access) => {
        access.inputs.forEach((input) => {
          input.onmidimessage = (event) => {
            console.log(`Message MIDI reçu: ${event.data}`);
            const [status, note, velocity] = event.data;

            if (note === 16 || note === 17 || note === 18 || note === 19) {
              // Gérer les messages de contrôle pour les cercles
              scaleCircles(note, velocity);
              return; // Ne pas traiter les messages de contrôle pour les cercles
            }

            // Note On (144) ou Note Off (128)
            const isNoteOn = status === 153 && velocity > 0;
            const isNoteOff = status === 137;

            if (isNoteOn) {
              midiNoteState.setNoteState(note, true, velocity);
            } else if (isNoteOff) {
              midiNoteState.setNoteState(note, false, velocity);
            }
          };
          console.log(`Entrée MIDI connectée: ${input.name}`);
        });
      })
      .catch((err) => console.error("Erreur MIDI:", err));
  },
};

function scaleCircles(note, velocity) {
  console.log(`Scaling circles for note ${note} with velocity ${velocity}`);
  const targetScale = 0.3 + (velocity / 127) * 3.7;
  const interpolationFactor = 0.1;

  // Mapping between MIDI notes and image indices
  const noteToImageIndex = {
    16: 0,
    17: 1,
    18: 2,
    19: 3,
  };

  const imageIndex = noteToImageIndex[note];
  if (imageIndex === undefined) return;

  circles.forEach((circle) => {
    if (circle.image === images[imageIndex]) {
      if (!circle.originalRadius) {
        circle.originalRadius = circle.radius;
      }
      const currentScale = circle.radius / circle.originalRadius;
      const newScale =
        currentScale + (targetScale - currentScale) * interpolationFactor;
      circle.radius = circle.originalRadius * newScale;
    }
  });

  // Redessiner les cercles après la mise à l'échelle
  requestAnimationFrame(drawCircles);
}

// Créer une instance de MidiNoteState
const midiNoteState = new MidiNoteState();
// Initialiser la configuration MIDI
midi.init();

// Exporter les objets nécessaires
export { midi, midiNoteState };
// Temporary MIDI emulation: keyboard => MIDI
// Press 'q' to emulate MIDI note 65
// keydown: Note On (status 144), velocity 64; keyup: Note Off (status 128), velocity 64

window.addEventListener("keydown", (event) => {
  if (event.key === "q") {
    const note = 48;
    const velocity = 64;
    // Emulate Note On
    midiNoteState.setNoteState(note, true, velocity);
  }
  if (event.key === "w") {
    const note = 65;
    const velocity = 64;
    // Emulate Note On
    midiNoteState.setNoteState(note, true, velocity);
  }

  if (event.key === "e") {
    const note = 16;
    const velocity = 64;
    midiNoteState.setNoteState(note, true, velocity); // Emulate Note On
    // Emulate Note On
  }
});
window.addEventListener("keyup", (event) => {
  if (event.key === "q") {
    const note = 48;
    const velocity = 64;
    // Emulate Note Off
    midiNoteState.setNoteState(note, false, velocity);
  }
  if (event.key === "w") {
    const note = 65;
    const velocity = 64;
    // Emulate Note Off
    midiNoteState.setNoteState(note, false, velocity);
  }
});
