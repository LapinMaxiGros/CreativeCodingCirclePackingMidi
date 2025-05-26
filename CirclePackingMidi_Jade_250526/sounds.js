// Export sound variables
export let son1,
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
  sonEmail;

// Initialiser les sons
export function initSounds() {
  console.log(initSounds);
  son1 = new Audio("son/son1long.mp3");
  son2 = new Audio("son/son2long.mp3");
  son3 = new Audio("son/son3long.mp3");
  son4 = new Audio("son/son4long.mp3");
  son5 = new Audio("son/son5long.mp3");
  son6 = new Audio("son/son6long.mp3");
  son7 = new Audio("son/son7long.mp3");
  son8 = new Audio("son/son8long.mp3");
  son9 = new Audio("son/son9long.mp3");
  son10 = new Audio("son/son10long.mp3");
  son11 = new Audio("son/son11long.mp3");
  son12 = new Audio("son/son12long.mp3");
  sonAmbiance = new Audio("son/SonAmbiance.mp3");
  sonEmail = new Audio("son/email.mp3");

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
}
