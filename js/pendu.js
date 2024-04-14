"use strict";

import {fetchPenduTxt} from "./pendu-fetch.js";

import {body} from "./htmlElements.js";

import SETTINGS from "./gameSettings.js";

import {handleKeyInput} from "./inputHandling.js";

import {createHtmlLifeCount} from "./htmlElementsHandling.js";

body.addEventListener("keyup", (e) => {
  e.preventDefault();
  e.stopPropagation();

  handleKeyInput(e);
});

// trigger fetch at start ( this will also trigger the setupNewGame for the first game )
fetchPenduTxt();
// only need to create the life count display once as nothing is deleted but just hidden
createHtmlLifeCount();
// get node list once created for futher usage
SETTINGS.lifeElementList = document.querySelectorAll("[class*=bx-ghost]");
