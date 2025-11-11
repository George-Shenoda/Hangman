const wordLists = {
  it: [
    "sono","io","il suo","che","lui","era","per","su","come","con",
    "loro","essere","a","uno","avere","questo","da","di","caldo","parola",
    "ma","cosa","alcuni","è","quello","voi","o","aveva","il","di",
    "a","e","un","in","noi","lattina","fuori","altro","erano","che / quale",
    "fare","loro","tempo","se","volontà","come","detto","un","ogni","dire",
    "fa","fisso","tre","desiderare","aria","bene","anche","giocare","piccolo","fine",
    "mettere","casa","leggere","mano","portare","grande","compitare","aggiungere","anche","terra",
    "qui","devo","grande","alto","tale","seguire","atto","perché","chiedere","maschi",
    "cambiamento","è andato","luce","tipo","spento","bisogno","casa","immagine","provare","noi",
    "di nuovo","animale","punto","madre","mondo","vicino","costruire","se stesso","terra","padre",
    "qualsiasi","nuovo","lavoro","parte","prendere","ottenere","posto","fatto","vivere","dove",
    "dopo","indietro","poco","solo","turno","uomo","anno","è venuto","spettacolo","ogni",
    "buono","me","dare","il nostro","sotto","nome","molto","attraverso","solo","forma",
    "frase","grande","pensare","dire","aiutare","basso","linea","differire","turno","causa",
    "molto","dire","prima","spostare","diritto","ragazzo","vecchio","troppo","stesso","lei",
    "tutto","ci","quando","su","uso","il tuo","modo","circa","molti","allora",
    "loro","scrivere","sarebbe","come","così","queste","lei","lungo","rendere","cosa",
    "vedere","lui","due","ha","guardare","di più","giorno","potuto","andare","venire",
    "ha fatto","numero","suono","no","più","persone","il mio","oltre","sapere","acqua",
    // … continue until 1,000 words …
    "rabbia","richiesta","continente"
  ],

  ar: [
    "سلام","قمر","مدرسة","شجرة","كتاب","مدينة","بحر","صديق",
    "نجمة","حب","بيت","سماء","قلب","وردة","طريق","شمس","ليل",
    "ماء","ريح","نهر","هواء","صداقة","علم","حديقة","قلم","باب","نافذة",
    "ولد","بنت","رجل","امرأة","طعام","نوم","عمل","سعادة","حزن","لعب",
    "سيارة","شارع","زهرة","أرض","عين","أذن","وقت","يوم","ليلة","سنة",
    "طفل","أكل","شرب","جلس","وقف","ذهب","جاء","سمع","رأى","تكلم",
    "كتب","قرأ","ركض","سبح","مشى","قفز","فتح","أغلق","ابتسم","ضحك",
    "بكى","صعد","نزل","دخل","خرج","قوي","ضعيف","سريع","بطيء","قديم",
    "جديد","كبير","صغير","طويل","قصير","حار","بارد","ممتاز","ممتنع","جاهل",
    "نظيف","قذر","قريب","بعيد","حار","بارد","سعيد","حزين","غاضب","خائف",
    "مجنون","سليم","مريض","سريع","بطيء","قوي","ضعيف","ذكي","غبي","لطيف",
    "قبيح","جميل","قبيح","صعب","سهل","قوي","ضعيف","صغير","كبير","متوسط",
    // … expand until ~500 words …
  ],

  en: [
    "hello","love","book","sea","house","pizza","sun","night",
    "road","flower","moon","friend","heart","time","family",
    "water","wind","mountain","party","dream","city","garden",
    "bicycle","school","star","bread","wine","music","art",
    "man","woman","child","boy","girl","food","drink","dog","cat","bird",
    "car","train","bus","plane","sky","earth","river","lake","tree","flower",
    "happy","sad","angry","love","hate","see","hear","say","do","make",
    "run","walk","jump","sit","stand","think","know","want","need","give",
    "take","get","help","play","work","read","write","listen","speak","move",
    "look","watch","eat","drink","sleep","wake","jump","fall","rise","stand",
    "sit","open","close","push","pull","carry","throw","catch","buy","sell",
    "build","destroy","draw","paint","sing","dance","run","walk","drive","ride",
    "swim","fly","climb","think","believe","know","understand","forget","remember","learn",
    // … expand until ~500 words …
  ]
};

/**
 * Generate random words in a given language
 * @param {number} count Number of words (default 1)
 * @param {string} lang Language: 'italian', 'arabic', 'english' (default 'english')
 * @returns {string[]} Array of random words
 */
export function generate(count = 1, lang = "english") {
  const list = wordLists[lang.toLowerCase()];
  if (!list) throw new Error(`Language "${lang}" not supported.`);
  const result = [];
  for (let i = 0; i < count; i++) {
    const word = list[Math.floor(Math.random() * list.length)];
    result.push(word);
  }
  return result;
}
