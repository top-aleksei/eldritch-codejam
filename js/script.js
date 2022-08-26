import ancientsData from "./data/ancients.js";
import blueCardsData from "./data/cardsjs/blue.js";
import greenCardsData from "./data/cardsjs/green.js";
import brownCardsData from "./data/cardsjs/brown.js";

let ancientsContainer = document.querySelector(".a__container");
let levelContainer = document.querySelector(".level__container");
let shuffleBTN = document.querySelector(".shuffle-button");
let resultContainer = document.querySelector(".result-stages");

let closedCards = document.querySelector(".card-back");
let openedCards = document.querySelector(".card-front");

let st1 = document.querySelector(".st1");
let st2 = document.querySelector(".st2");
let st3 = document.querySelector(".st3");
alert(
  "Для удобства проверки в консоли будет отображаться колода в виде массива, где нулевой объект - самая нижняя карта, последний - верхняя"
);

// SHUFLE BTN
function shuffleBTNfunctions() {
  openedCards.src = "";
  resultContainer.style.opacity = 1;
  makeCardDeck();
  startStackQty();
  startCardsVisability();
  count = 0;
  closedCards.addEventListener("click", openCards);
}

let selectedAncient;
let selectedAncientID;
let selectedLevel;

let qtyGreenCards;
let qtyBrownCards;
let qtyBlueCards;

let tempAllGreenCards;
let tempAllBrownCards;
let tempAllBlueCards;

let stage1cards = [];
let stage2cards = [];
let stage3cards = [];
let allStagesCards = [];

let gr1st, gr2st, gr3st;
let br1st, br2st, br3st;
let bl1st, bl2st, bl3st;

let count = 0;

// evListener for Ancients
ancientsContainer.onclick = function (ev) {
  levelContainer.style.opacity = 1;
  resultContainer.style.opacity = 0;
  shuffleBTN.style.opacity = 0;
  openedCards.style.opacity = 0;
  closedCards.style.opacity = 0;
  let target = ev.target.closest(".ancient-item");
  if (!target) return;
  if (target == selectedAncient) return;
  chooseAncient(target);
  countTotalCards(target.id);
  asignQtyOfCardsOnStage(target.id);
  removeActiveLevel();
  closedCards.removeEventListener("click", openCards);
  selectedLevel = null;
};

function countTotalCards(anc) {
  let a = ancientsData[anc];
  qtyGreenCards =
    a.firstStage.greenCards +
    a.secondStage.greenCards +
    a.thirdStage.greenCards;
  qtyBlueCards =
    a.firstStage.blueCards + a.secondStage.blueCards + a.thirdStage.blueCards;
  qtyBrownCards =
    a.firstStage.brownCards +
    a.secondStage.brownCards +
    a.thirdStage.brownCards;
}
function chooseAncient(anc) {
  if (selectedAncient) {
    selectedAncient.classList.remove("ancient-active");
  }
  selectedAncient = anc;
  selectedAncientID = anc.id;
  selectedAncient.classList.add("ancient-active");
}

// //evListener for levels
levelContainer.onclick = function (ev) {
  let level = ev.target.closest(".level");
  if (!level) return;
  if (level == selectedLevel) return;
  chooseLevel(level);
  shuffleBTN.style.opacity = 1;
  shuffleBTN.addEventListener("click", shuffleBTNfunctions);
  tempAllGreenCards = grabAllCards(qtyGreenCards, greenCardsData);
  tempAllBrownCards = grabAllCards(qtyBrownCards, brownCardsData);
  tempAllBlueCards = grabAllCards(qtyBlueCards, blueCardsData);
  openedCards.style.opacity = 0;
  closedCards.style.opacity = 0;
  resultContainer.style.opacity = 0;
};

function chooseLevel(lvl) {
  if (selectedLevel) {
    selectedLevel.classList.remove("active-level");
  }
  selectedLevel = lvl;
  selectedLevel.classList.add("active-level");
}

// take cards for all 3 stages
function grabAllCards(qty, data) {
  let arr;
  if (selectedLevel.id == "easy") {
    arr = easyLevelCards(qty, data);
  } else if (selectedLevel.id == "high") {
    arr = hardLevelCards(qty, data);
  } else if (selectedLevel.id == "veryEasy") {
    arr = veryEasyLevelCards(qty, data);
  } else if (selectedLevel.id == "veryHigh") {
    arr = veryHardLevelCards(qty, data);
  } else {
    arr = middleLevelCards(qty, data);
  }
  return arr;
}

function makeCardDeck() {
  stage1cards = [];
  stage2cards = [];
  stage3cards = [];
  allStagesCards = [];
  addCardsToStage(stage3cards, tempAllGreenCards, gr3st);
  addCardsToStage(stage3cards, tempAllBlueCards, bl3st);
  addCardsToStage(stage3cards, tempAllBrownCards, br3st);
  stage3cards.sort(() => Math.random() - 0.5);
  addCardsToStage(stage2cards, tempAllGreenCards, gr2st);
  addCardsToStage(stage2cards, tempAllBlueCards, bl2st);
  addCardsToStage(stage2cards, tempAllBrownCards, br2st);
  stage2cards.sort(() => Math.random() - 0.5);
  addCardsToStage(stage1cards, tempAllGreenCards, gr1st);
  addCardsToStage(stage1cards, tempAllBlueCards, bl1st);
  addCardsToStage(stage1cards, tempAllBrownCards, br1st);
  stage1cards.sort(() => Math.random() - 0.5);
  allStagesCards = stage3cards.concat(stage2cards).concat(stage1cards);
  console.log(allStagesCards);
}

function asignQtyOfCardsOnStage(name) {
  let a = ancientsData[name];
  gr1st = a.firstStage.greenCards;
  gr2st = a.secondStage.greenCards;
  gr3st = a.thirdStage.greenCards;
  br1st = a.firstStage.brownCards;
  br2st = a.secondStage.brownCards;
  br3st = a.thirdStage.brownCards;
  bl1st = a.firstStage.blueCards;
  bl2st = a.secondStage.blueCards;
  bl3st = a.thirdStage.blueCards;
}

function addCardsToStage(arrStage, arrTemp, n) {
  for (let i = 0; i < n; i++) {
    let x = arrTemp.pop();
    arrStage.push(x);
  }
}

// OPEN CARDS AND EVERETHING WITH

function openCards() {
  let x = allStagesCards.pop();
  openedCards.src = x.cardFace;
  openedCards.style.opacity = 1;
  console.log(allStagesCards);
  changeStackQty(x);

  if (allStagesCards.length == 0) {
    closedCards.style.opacity = 0;
    closedCards.removeEventListener("click", openCards);
  }
  shuffleBTN.removeEventListener("click", shuffleBTNfunctions);
}

function startCardsVisability() {
  openedCards.style.opacity = 0;
  closedCards.style.opacity = 1;
}

function startStackQty() {
  st1.children[0].textContent = gr1st;
  st1.children[1].textContent = br1st;
  st1.children[2].textContent = bl1st;
  st2.children[0].textContent = gr2st;
  st2.children[1].textContent = br2st;
  st2.children[2].textContent = bl2st;
  st3.children[0].textContent = gr3st;
  st3.children[1].textContent = br3st;
  st3.children[2].textContent = bl3st;
}

function changeStackQty(card) {
  let stage;
  if (count < stage1cards.length) {
    stage = st1;
  } else if (count < stage1cards.length + stage2cards.length) {
    stage = st2;
  } else {
    stage = st3;
  }
  switch (card.color) {
    case "green":
      stage.children[0].textContent--;
      break;
    case "brown":
      stage.children[1].textContent--;
      break;
    case "blue":
      stage.children[2].textContent--;
      break;
  }
  count++;
}

function easyLevelCards(qty, data) {
  let arr;
  arr = data
    .filter((el) => el.difficulty != "hard")
    .sort(() => Math.random() - 0.5)
    .slice(-qty);
  return arr;
}

function hardLevelCards(qty, data) {
  let arr;
  arr = data
    .filter((el) => el.difficulty != "easy")
    .sort(() => Math.random() - 0.5)
    .slice(-qty);
  return arr;
}

function middleLevelCards(qty, data) {
  return data.sort(() => Math.random() - 0.5).slice(-qty);
}

function veryEasyLevelCards(qty, data) {
  let arr;
  arr = data.filter((el) => el.difficulty == "easy");
  if (qty < arr.length) {
    return arr.slice(-qty).sort(() => Math.random() - 0.5);
  } else if (arr.length == qty) {
    return arr.sort(() => Math.random() - 0.5);
  } else {
    let additionalCards = data
      .filter((el) => el.difficulty == "normal")
      .sort(() => Math.random() - 0.5)
      .slice(arr.length - qty);
    return arr.concat(additionalCards).sort(() => Math.random() - 0.5);
  }
}

function veryHardLevelCards(qty, data) {
  let arr;
  arr = data.filter((el) => el.difficulty == "hard");
  if (qty < arr.length) {
    return arr.slice(-qty).sort(() => Math.random() - 0.5);
  } else if (arr.length == qty) {
    return arr.sort(() => Math.random() - 0.5);
  } else {
    let additionalCards = data
      .filter((el) => el.difficulty == "normal")
      .sort(() => Math.random() - 0.5)
      .slice(arr.length - qty);
    return arr.concat(additionalCards).sort(() => Math.random() - 0.5);
  }
}

function removeActiveLevel() {
  [...levelContainer.children].forEach((element) => {
    element.classList.remove("active-level");
  });
}
