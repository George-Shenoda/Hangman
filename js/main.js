// main.js
import { generate } from "./random-words.js";
import { changeLanguage, translate } from "./translate.js";

// localStorage namespace helper
function appStorage(appName) {
  return {
    key(k) { return `${appName}__${k}`; },
    get(k) { return localStorage.getItem(this.key(k)); },
    set(k, v) { localStorage.setItem(this.key(k), v); },
    remove(k) { localStorage.removeItem(this.key(k)); }
  };
}

const storage = appStorage('Hangman');

// apply saved UI prefs
if (storage.get('dark') === 'yes') $(document.body).addClass('dark');
if (storage.get('lang')) {
  $('html').attr('lang', storage.get('lang'));
  $("#langs").val(storage.get('lang'));
}
if (storage.get('dir')) $('html').attr('dir', storage.get('dir'));
if (storage.get('audio')) {
  if (storage.get('audio') === 'yes') {
    $('.btn#audio').html(`<i class="fa-solid fa-volume-high"></i>`).removeClass("no");
  } else {
    $('.btn#audio').html(`<i class="fa-solid fa-volume-xmark"></i>`).addClass("no");
  }
}

changeLanguage();

// UI controls
$(".darkBtn").click(function () {
  $(document.body).toggleClass('dark');
  storage.set('dark', $(document.body).hasClass('dark') ? 'yes' : 'no');
});

$('.btn#audio').click(function () {
  const isNo = $(this).hasClass('no');
  if (isNo) {
    $(this).html(`<i class="fa-solid fa-volume-high"></i>`).removeClass("no");
    storage.set('audio', 'yes');
  } else {
    $(this).html(`<i class="fa-solid fa-volume-xmark"></i>`).addClass("no");
    storage.set('audio', 'no');
  }
});

// On language change: update html lang/dir, store, re-run changeLanguage and reset game
$('#langs').change(function () {
  const selected = $(this).find(':selected');
  const newLang = selected.val();
  const newDir = selected.data('dir') || 'ltr';
  $('html').attr('lang', newLang);
  $('html').attr('dir', newDir);
  storage.set('lang', newLang);
  storage.set('dir', newDir);
  changeLanguage();
  // Re-init letters and game for the new language
  initForLanguage(newLang);
  resetGame();
});

/* ---------- Game state ---------- */
let letters = Array.from("abcdefghijklmnopqrstuvwxyz"); // default
const ARletters = Array.from("ابتثجحخدذرزسشصضطظعغفقكلمنهوية");

let wrong = 0;
let word = [];      // array of characters of current word
let current = 0;    // number of correctly filled letters

/* ---------- Helpers ---------- */

// Normalizes and makes sure we have an array of characters
// Accepts generate() result which might be string, array, or Promise resolving to string/array.
async function getNewWordFor(lang) {
  const res = await maybePromise(() => generate(1, lang));
  // if generate returned array like ["ciao"], extract first
  let w = Array.isArray(res) ? (res[0] || "") : res || "";
  // normalize: string -> lower, then Array.from to get characters (works for Arabic too)
  w = String(w).toLowerCase();
  return Array.from(w);
}

// utility: if fn returns a promise or value, always await safely
async function maybePromise(fn) {
  try {
    const out = fn();
    if (out && typeof out.then === 'function') return await out;
    return out;
  } catch (err) {
    // If generate throws, return empty string
    console.error("generate() error:", err);
    return "";
  }
}

/* ---------- DOM building ---------- */

// Rebuild alphabet buttons according to language
function buildLettersFor(lang) {
  // choose letters set
  letters = (lang === 'ar') ? ARletters.slice() : Array.from("abcdefghijklmnopqrstuvwxyz");
  const $letters = $('.letters');
  $letters.empty();

  // Use event delegation instead of binding each span
  letters.forEach(letter => {
    const span = $("<span>", {
      text: letter,
      "class": "letter-box w-[55px] h-[55px] inline-block bg-[#009688] text-white text-2xl me-2.5 leading-[55px] uppercase font-bold cursor-pointer mb-3",
      "data-letter": letter
    });
    $letters.append(span);
  });
}

// create guess placeholders based on current `word` array
function createPlaceholders() {
  $('.guess').empty();
  for (let i = 0; i < word.length; i++) {
    let span = $("<span>", {
      "class": "letter-guess w-[60px] h-[60px] text-2xl mr-2.5 text-center leading-[60px] uppercase font-bold bg-[#fdfdfd] border-b-[3px] border-solid border-b-[#222] duration-300"
    });
    $('.guess').append(span);
  }
}

// reveal hangman parts based on wrong count
function revealHangmanParts() {
  // parts are controlled by wrong-N classes on .hangman-draw
  if ($(".hangman-draw").hasClass("wrong-1")) $(".draw").removeClass("hidden");
  if ($(".hangman-draw").hasClass("wrong-2")) $(".stand").removeClass("hidden");
  if ($(".hangman-draw").hasClass("wrong-3")) $(".hang").removeClass("hidden");
  if ($(".hangman-draw").hasClass("wrong-4")) $(".rope").removeClass("hidden");
  if ($(".hangman-draw").hasClass("wrong-5")) $(".man .head").removeClass("hidden");
  if ($(".hangman-draw").hasClass("wrong-6")) $(".man .body").removeClass("hidden");
  if ($(".hangman-draw").hasClass("wrong-7")) $(".man .hand1").removeClass("hidden");
  if ($(".hangman-draw").hasClass("wrong-8")) $(".man .hand2").removeClass("hidden");
  if ($(".hangman-draw").hasClass("wrong-9")) $(".man .leg1").removeClass("hidden");
  if ($(".hangman-draw").hasClass("wrong-10")) $(".man .leg2").removeClass("hidden");
}

/* ---------- Game flow ---------- */

// Initialize UI and game for a language (does not change storage)
async function initForLanguage(lang) {
  // rebuild letters
  buildLettersFor(lang);

  // get a new starting word
  word = await getNewWordFor(lang);
  current = 0;
  wrong = 0;

  // reset hangman visuals
  for (let i = 1; i <= 10; i++) {
    $(".hangman-draw").removeClass(`wrong-${i}`);
  }
  $(".draw, .stand, .hang, .rope, .man .head, .man .body, .man .hand1, .man .hand2, .man .leg1, .man .leg2").addClass("hidden");

  createPlaceholders();
}

// Reset game and start new round (keeps current language)
async function resetGame() {
  const lang = $('html').attr('lang') || 'en';
  word = await getNewWordFor(lang);
  // normalization already applied in getNewWordFor
  wrong = 0;
  current = 0;

  // wipe classes and visuals
  $('.letters').find('span').removeClass('clicked');
  $('.guess').empty();
  for (let i = 1; i <= 10; i++) {
    $(".hangman-draw").removeClass(`wrong-${i}`);
  }
  $(".draw, .stand, .hang, .rope, .man .head, .man .body, .man .hand1, .man .hand2, .man .leg1, .man .leg2").addClass("hidden");

  createPlaceholders();
}

/* ---------- Letter click handling (delegated) ---------- */

// Use delegated click so we don't rebind when rebuilding letters
$('.letters').on('click', 'span', function () {
  const $span = $(this);
  if ($span.hasClass('clicked')) return; // ignore double clicks
  $span.addClass('clicked');

  const picked = $span.data('letter');
  let matched = false;

  // iterate word characters and reveal matches (exact match)
  word.forEach((ltr, index) => {
    if (picked === ltr) {
      $($('.guess').children()[index]).text(word[index]);
      current++;
      matched = true;
    }
  });

  if (!matched) {
    wrong++;
    $(".hangman-draw").addClass(`wrong-${wrong}`);
    if (!$('.btn#audio').hasClass('no')) $("#fail")[0]?.play();
  } else {
    if (!$('.btn#audio').hasClass('no')) $("#success")[0]?.play();
  }

  // reveal hangman parts when needed
  revealHangmanParts();

  // win
  if (current === word.length) {
    $('.letters span').addClass("clicked");
    let div = $("<div>", {
      text: `${translate[$('html').attr('lang')]['message']}${wrong}`,
      "class": "w-full h-full z-10 bg-[#198754d6] fixed left-0 top-0 justify-center flex-col items-center text-[30px] flex text-white text-center"
    });
    let btn = $("<button>", {
      text: translate[$('html').attr('lang')]['button'],
      "class": "mt-10 text-white py-3 px-4 text-center rounded-sm cursor-pointer bg-[#f44336]"
    });
    $(div).append(btn);
    $(document.body).append(div);
    $(btn).click(function () {
      $(div).remove();
      resetGame();
    });
  }

  // lose
  if (wrong === 10) {
    $('.letters span').addClass("clicked");
    let div = $("<div>", {
      text: `${translate[$('html').attr('lang')]['messageF']}${word.join("")}`,
      "class": "end w-full h-full z-10 bg-red-300 fixed left-0 top-0 justify-center flex-col items-center text-[30px] flex text-white text-center"
    });
    let btn = $("<button>", {
      text: translate[$('html').attr('lang')]['button'],
      "class": "end mt-10 text-white py-3 px-4 text-center rounded-sm cursor-pointer bg-[#f44336]"
    });
    $(div).append(btn);
    $(document.body).append(div);
    $(btn).click(function () {
      $(div).remove();
      resetGame();
    });
  }
});

/* ---------- Initial boot ---------- */

async function init() {
  const lang = $('html').attr('lang') || 'en';
  await initForLanguage(lang);
}

// run
init();
