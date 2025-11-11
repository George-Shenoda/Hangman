import { generate } from "https://esm.sh/random-words";

import { changeLanguage, translate } from "./translate.js";
generate

// localStorage namespace helper
function appStorage(appName) {
  return {
    key(k) { return `${appName}__${k}`; },
    get(k) {
      return localStorage.getItem(this.key(k));
    },
    set(k, v) {
      localStorage.setItem(this.key(k), v);
    },
    remove(k) {
      localStorage.removeItem(this.key(k));
    }
  };
}

// Use the storage helper
const storage = appStorage('Hangman');

if(storage.get('dark') === 'yes'){
    $(document.body).addClass('dark');
}
if(storage.get('lang')){
    $('html').attr('lang', storage.get('lang'))
    $("#langs").val(storage.get('lang'))
}
if(storage.get('dir')){
    $('html').attr('dir', storage.get('dir')) 
}
if(storage.get('audio')){
    if (storage.get('audio') === 'yes'){
        $('.btn#audio').html(`<i class="fa-solid fa-volume-high"></i>`)
        $('.btn#audio').removeClass("no")
    }
    else{
        $('.btn#audio').html(`<i class="fa-solid fa-volume-xmark"></i>`)
        $('.btn#audio').addClass("no")
    }
}

changeLanguage()

$(".darkBtn").click(function (e) { 
    $(document.body).toggleClass('dark');
    if($(document.body).hasClass('dark'))
        storage.set('dark', 'yes')
    else
        storage.set('dark', 'no')
});

$('.btn#audio').click(function (e){
    if($('.btn#audio').hasClass('no')){
        $('.btn#audio').html(`<i class="fa-solid fa-volume-high"></i>`) 
        $('.btn#audio').removeClass("no")
        storage.set('audio', 'yes');
    }
    else{
        $('.btn#audio').html(`<i class="fa-solid fa-volume-xmark"></i>`)
        $('.btn#audio').addClass("no")
        storage.set('audio', 'no');
    }
})

$('#langs').change(function (e) { 
    const selected = $(this).find(':selected');
    $('html').attr('lang', selected.val());
    $('html').attr('dir', selected.data('dir'));
    storage.set('lang', selected.val());
    storage.set('dir', selected.data('dir'))
    changeLanguage()
});

const letters = Array.from("abcdefghijklmnopqrstuvwxyz")

let wrong = 0;
let word = generate();
word = Array.from(word)
let current = 0;

letters.forEach(letter => {
    let span = $("<span>", {
        text: letter,
        "class": "letter-box w-[55px] h-[55px] inline-block bg-[#009688] text-white text-2xl me-2.5 leading-[55px] uppercase font-bold cursor-pointer mb-3"
    });
    $(span).click(function (e) {
        $(this).addClass("clicked")
        let thisSpan = $(this).text()
        let status = false;
        word.forEach((letter, index) => {
            if(thisSpan === letter){
                $($('.guess').children()[index]).text(word[index])
                current++;
                status = true
            }
        });
        if(!status){
            wrong++;
            $(".hangman-draw").addClass(`wrong-${wrong}`);
            if(!$('.btn#audio').hasClass('no'))
                $("#fail")[0].play()
        }else{
            if(!$('.btn#audio').hasClass('no'))
                $("#success")[0].play()
        }
        if (current === word.length){
            $('.letters span').addClass("clicked")
            let div = $("<div>",{ 
                text: `${translate[$('html').attr('lang')]['message']}${wrong}`,
                "class": "w-full h-full z-10 bg-[#198754d6] fixed left-0 top-0 justify-center flex-col items-center text-[30px] flex text-white text-center"
            })
            let btn = $("<button>",{ 
                text: ${translate[$('html').attr('lang')]['button']},
                "Class": "mt-10 text-white py-3 px-4 text-center rounded-sm cursor-pointer bg-[#f44336]"
            })
            $(div).append(btn)
            $(document.body).append(div)
            $(btn).click(function (e){
                $($(this).parent()).remove()
                resetGame()
            })
        }
        if(wrong === 10){
            $('.letters span').addClass("clicked")
            let div = $("<div>",{ 
                text: `${translate[$('html').attr('lang')]['messageF']}${word.join("")}`,
                "class": "end w-full h-full z-10 bg-red-300 fixed left-0 top-0 justify-center flex-col items-center text-[30px] flex text-white text-center"
            })
            let btn = $("<button>",{ 
                text: ${translate[$('html').attr('lang')]['button']},
                "Class": "end mt-10 text-white py-3 px-4 text-center rounded-sm cursor-pointer bg-[#f44336]"
            })
            $(div).append(btn)

            $(document.body).append(div)
            $(btn).click(function (e){
                $($(this).parent()).remove()
                resetGame()
            })
        }
        if($(".hangman-draw ").hasClass("wrong-1")){
            $(".draw").removeClass("hidden");
        }
        if($(".hangman-draw ").hasClass("wrong-2")){
            $(".stand").removeClass("hidden");
        }
        if($(".hangman-draw ").hasClass("wrong-3")){
            $(".hang").removeClass("hidden");
        }
        if($(".hangman-draw ").hasClass("wrong-4")){
            $(".rope").removeClass("hidden");
        }
        if($(".hangman-draw ").hasClass("wrong-5")){
            $(".man .head").removeClass("hidden");
        }
        if($(".hangman-draw ").hasClass("wrong-6")){
            $(".man .body").removeClass("hidden");
        }
        if($(".hangman-draw ").hasClass("wrong-7")){
            $(".man .hand1").removeClass("hidden");
        }
        if($(".hangman-draw ").hasClass("wrong-8")){
            $(".man .hand2").removeClass("hidden");
        }
        if($(".hangman-draw ").hasClass("wrong-9")){
            $(".man .leg1").removeClass("hidden");
        }
        if($(".hangman-draw ").hasClass("wrong-10")){
            $(".man .leg2").removeClass("hidden");
        }
    })
    $('.letters').append(span)
});

createGame()

function createGame(){
    for(let i = 0; i < word.length; i++){ 
        let span = $("<span>", {
            "class": "letter-guess w-[60px] h-[60px] text-2xl mr-2.5 text-center leading-[60px] uppercase font-bold bg-[#fdfdfd] border-b-[3px] border-solid border-b-[#222] duration-300"
        });
        $('.guess').append(span)
    }
}

function resetGame(){
    // get a new word
    word = generate();
    word = Array.from(String(word).toLowerCase());

    // remove any wrong-N classes from the hangman container
    for (let i = 1; i <= 10; i++) {
        $(".hangman-draw").removeClass(`wrong-${i}`);
    }

    // re-hide all hangman parts (add your hidden class back)
    $(".draw").addClass("hidden");
    $(".stand").addClass("hidden");
    $(".hang").addClass("hidden");
    $(".rope").addClass("hidden");
    $(".man .head").addClass("hidden");
    $(".man .body").addClass("hidden");
    $(".man .hand1").addClass("hidden");
    $(".man .hand2").addClass("hidden");
    $(".man .leg1").addClass("hidden");
    $(".man .leg2").addClass("hidden");

    // reset counters
    wrong = 0;
    current = 0;

    // reset UI: remove clicked state, re-enable letters, clear guess slots
    $('.letters span').removeClass("clicked")
    $('.guess').empty();

    // recreate guess placeholders for the new word
    createGame();
}
