"use strict";

const penduWord = document.querySelector(".pendu-result");
const displaySelectedLetter = document.querySelector(".pendu-displayLetter");
const body = document.querySelector("body");

const PENDU_SETTING = {
  oneOrTwoPlayer: 1,
  lifeCount: 6,
  //
  selectedLetter: "",
  // fetched txt as array
  txtToArray: [],
  //
  newGameWord: "",
  hiddenWord: [],
};

/*



*/

const toggleClass = () => {
  letterContainer.classList.toggle("hiddenLetter");
};

const letterContainer = document.querySelector(".pendu-displayLetter-container");

const test = document.querySelector(".hide-test");

test.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  toggleClass();
});

/*



*/

const logInfo = () => {
  console.log("current word : ", PENDU_SETTING.newGameWord);
  console.log(PENDU_SETTING.selectedLetter);
  console.log(PENDU_SETTING.lifeCount);
  console.log("-----------------------");
};

// =====================================================================================================================
// UTILITIES
// get a random index from an array
const randomIndex = (array) => {
  return Math.floor(Math.random() * array.length);
};

const createHiddenWord = (wordAsArray) => {
  for (let i = 0; i < wordAsArray.length; i++) {
    PENDU_SETTING.hiddenWord.push("-");
  }
};

const sendHiddenWordToHtml = (toDisplay) => {
  penduWord.innerHTML = `${toDisplay.join(" ")}`;
};

const sendSelectLetterToHtml = (letter) => {
  displaySelectedLetter.innerHTML = `${letter}`;
};

// RESET GAME AFTER A WIN OR LOSE
const reset = () => {
  PENDU_SETTING.lifeCount = 6;
  // reset the PENDU_SETTING.hiddenWord array at each "start / restart"
  PENDU_SETTING.hiddenWord = [];
  //
  setupNewGame(PENDU_SETTING.txtToArray);
};

// =====================================================================================================================
// =====================================================================================================================
// =====================================================================================================================
// TRANSFORM FETCHED .TXT INTO ARRAY
// ::::::::::::::::::::::::::::::::::::::::::::::::::::
const toArray = (textParam) => {
  // set text into array
  // use regex to "split" with space (\s) coma (,) or next line (\n)
  // + mean : eventualy several
  return (PENDU_SETTING.txtToArray = textParam.split(/[\s,\n]+/));
};

// FETCH .TXT
// ::::::::::::::::::::::::::::::::::::::::::::::::::::
const fetchPenduTxt = () => {
  // when consoleLog(response) got a basic "object", and as its a text need to use the method .text()
  // if console response.text() directly it send a promise with <state> pending
  // it mean it need another .then to process the received promise ( correct ?)
  fetch("./pendu-mots.txt")
    .then((response) => response.text())
    // trigger the transform into array
    .then((text) => toArray(text))
    // then trigger the setupNewGame for the first time
    // as its async function can be declared after ( as const )
    .then(() => setupNewGame(PENDU_SETTING.txtToArray));
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
// array : array of word coming from the fetch
const setupNewGame = (array) => {
  if (PENDU_SETTING.oneOrTwoPlayer == 1) {
    // select a random word from the .txt turned as array
    // generate lowerCase word
    PENDU_SETTING.newGameWord = array[randomIndex(array)].toLowerCase();
    // create the hidden word to be displayed in the html
    createHiddenWord(PENDU_SETTING.newGameWord);
    // set the html display
    sendHiddenWordToHtml(PENDU_SETTING.hiddenWord);
  }
};

// =====================================================================================================================
// =====================================================================================================================
// =====================================================================================================================

/**
 * It checks if the letter is in the word, if it is, it replaces the underscore with the letter,
 * if it's not, it decreases the life count
 * @param letter - the letter that the user has entered
 * @param currentGameWord - the word that the player is trying to guess
 * @param hiddenWord - the word to be guessed, but with all the letters hidden.
 */
const checkForLetter = (letter, currentGameWord, hiddenWord) => {
  for (const letterIndex in currentGameWord) {
    if (letter === currentGameWord.charAt(letterIndex)) {
      // here === do not work !? 🤷‍♂️
      if (letterIndex == 0) {
        // set first letter un uppercase
        hiddenWord[letterIndex] = letter.toUpperCase();
      } else {
        hiddenWord[letterIndex] = letter.toLowerCase();
      }
      // HTML DISPLAY
      sendHiddenWordToHtml(hiddenWord);
    }
  }
  if (!hiddenWord.includes(letter)) {
    PENDU_SETTING.lifeCount -= 1;
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
const winConsCheck = () => {
  // WIN CONDITION AND ACTION
  if (PENDU_SETTING.hiddenWord.includes("-") === false) {
    // no more "-" mean word found,
    console.log(" VICTORY ");
    reset();
  }
  // LOST CONDITION AND ACTION
  if (PENDU_SETTING.lifeCount === 0) {
    console.log("PERDU");
    reset();
  }
};

// =====================================================================================================================
// =====================================================================================================================
// =====================================================================================================================

const hangmanLogic = (letterFromInput) => {
  logInfo();
  // check if the letter is in the selected word
  checkForLetter(letterFromInput, PENDU_SETTING.newGameWord, PENDU_SETTING.hiddenWord);
  // at each letter input check for the winCons / lose
  winConsCheck();
};

// =====================================================================================================================
// =====================================================================================================================
// =====================================================================================================================

// toggleClass();
body.addEventListener("keyup", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const regex = /[A-Za-z]/;

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::
  //  EVERY KEY PRESS CHECK IF LETTER IF SO DISPLAY IN HTML
  // only length of 1 ( otherwise can display "shift" / "command"... and other function keys as string)
  if (e.key.length === 1 && e.key.match(regex) !== null) {
    PENDU_SETTING.selectedLetter = e.key.toLowerCase();
    sendSelectLetterToHtml(PENDU_SETTING.selectedLetter);
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::
  if (e.key === "Enter" && PENDU_SETTING.selectedLetter !== "") {
    // INVOKE GAME LOGIC WHEN "ENTER" and LETTER ISNT <empty.string>
    hangmanLogic(PENDU_SETTING.selectedLetter);
    // reset letter & display after send
    PENDU_SETTING.selectedLetter = "";
    sendSelectLetterToHtml(PENDU_SETTING.selectedLetter);
    //
    //
  } else if (e.key === "Enter" && PENDU_SETTING.selectedLetter === "") {
    // SEND ERR MESS IF ENTER & LETTER IS <empty.string>
    // ( else if as need to check if can send first, otherwise will send err mess after each succesfull send)
    console.log("Type a Key");
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::
  // DELETED LETTER
  if (e.key == "Backspace") {
    // RESET AFTER "DELETE"
    PENDU_SETTING.selectedLetter = "";
    sendSelectLetterToHtml(PENDU_SETTING.selectedLetter);
  }
});

// =====================================================================================================================
// trigger fetch at start ( this will trigger the setupNewGame for the first game)
fetchPenduTxt();
