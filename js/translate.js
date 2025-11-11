export let translate = {
    en: {
        game: "Hangman",
        message: "Great Jop, no of Wrong Attempts: ",
        messageF: "Game Over, The Word was: ",
        button: "New game"
    },
    ar:{
        game: "هانجمان",
        message: "احسنت، عدد المحاولات الخاطئة: ",
        messageF: "لقد خسرت، الكلمة كانت: ",
        button: "لعبه جديدة"
    },
    it:{
        game: "Hangman",
        message: "Game Over, La Parola è: ",
        messageF: "Ottimo lavoro, nessun tentativo sbagliato: ",
        button: "Nuovo gioco"
    }
}

export function changeLanguage(){
    let lang = translate[$('html').attr('lang')]
    document.title = lang['game'];
    $('.game-name').html(lang['game']);
    $(".category .word").html(lang['word']);
}