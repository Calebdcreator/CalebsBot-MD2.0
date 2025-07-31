const { default: axios } = require("axios");
const os = require("os");
const fs = require("fs");

module.exports = {
  name: "menu",
  alias: ["help", "cmds", "commands"],
  category: "core",
  desc: "Shows all available commands in categories.",
  async run({ sock, m, prefix, commandName }) {
    const runtime = () => {
      const seconds = process.uptime();
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours}h ${minutes}m ${secs}s`;
    };

    const menu = `
╭━━━[ 🤖 *CALEBSBOT-MD2.0 MENU* ]━━━◆
┃ Prefix: ${prefix}
┃ Uptime: ${runtime()}
┃ User: @${m.sender.split("@")[0]}
┃ Total Commands: 400+
┃
┣━━━[ 🎮 FUN (50) ]━━━◆
┃ .joke      .meme        .truth
┃ .dare      .quote       .troll
┃ .pickup    .ratewaifu   .blush
┃ .wouldyourather .rizz   .silly
┃ .ghostping .trigger     .insult
┃ .petpet    .ship        .say
┃ .roast     .pun         .clown
┃ .vibecheck .howgay      .hornyrate
┃ .waifurate .nsfwcheck   .hot
┃ .marry     .kiss        .hug
┃ .confess   .shipgroup   .truthgame
┃ .daregame  .pickupai    .gamify
┃ .boreme    .8ball        .vibeme
┃ .emojify   .mood        .diceroll
┃ .capify    .fakequote   .saywhat
┃ .anifilter .lolrate     .funfact
┃ .animood   .anijoke     .iqtest
┃ .trollface .comicgen    .funnify

┣━━━[ 📸 MEDIA (50) ]━━━◆
┃ .viewonce   .photo2anime .toimg
┃ .sticker    .sticker2gif .tomp4
┃ .url2img    .caption     .mediafire
┃ .gdrive     .ytmp3       .ytmp4
┃ .play       .instadl     .twitterdl
┃ .fbdl       .soundcloud  .spotify
┃ .lyrics     .text2img    .animestyle
┃ .mirror     .colormatch  .deepai
┃ .compress   .ocr         .upscale
┃ .image2url  .upload      .removebg
┃ .draw       .blurface    .cropai
┃ .addmusic   .text2gif    .status
┃ .save       .ssweb       .screenrec
┃ .videospd   .audiotrim   .vidtrim
┃ .statussaver .watermark  .gifgen

┣━━━[ 🛠️ TOOLS (50) ]━━━◆
┃ .calc       .weather     .urlshort
┃ .qrgen      .fontgen     .ptext
┃ .ttstool    .translate   .binary
┃ .morse      .colorcode   .hashtag
┃ .findsong   .ping        .uptime
┃ .whoami     .iplookup    .github
┃ .npm        .ytsearch    .json
┃ .htmlgen    .md5         .base64
┃ .unitconv   .remind      .notepad
┃ .text2url   .screenshot  .calender
┃ .timer      .timezone    .currency
┃ .bmi        .agecalc     .grade
┃ .password   .otpgen      .bugreport
┃ .invitegen  .linkgen     .titlecase
┃ .ttsticker  .voice2text  .useragent

┣━━━[ 🤖 AI & CHATGPT (50) ]━━━◆
┃ .ai        .imggen       .speak
┃ .gpt       .write        .story
┃ .ask       .explain      .summarize
┃ .rephrase  .codegen      .debug
┃ .poem      .advise       .shoutout
┃ .review    .captiongen   .ytideas
┃ .productdesc .brandname  .bioai
┃ .imagify   .animate      .voicegen
┃ .vidgen    .dalle        .animegen
┃ .memeai    .resumegen    .cvbuilder
┃ .cookai    .translateai  .coverletter
┃ .qna       .facts        .dreamgen
┃ .nsfwai    .affirmai     .coverart
┃ .logoai    .textlogoai   .brandai
┃ .hackidea  .aiquotes     .funifyai

┣━━━[ 📚 EDUCATION (50) ]━━━◆
┃ .quiz     .fact        .define
┃ .math     .science     .chemistry
┃ .physics  .biology     .literature
┃ .history  .geography   .english
┃ .dictionary .periodictable .eqsolver
┃ .calcmarks .brainstorm  .thesisgen
┃ .revise   .flashcards  .quizgen
┃ .pastq    .notes       .cheatsheet
┃ .memorize .punchcard   .sophelper
┃ .translateedu .synonyms .antonyms
┃ .plagcheck .citation   .gpa
┃ .mockexam .learnlang   .spellcheck
┃ .stats    .histotips   .educhart
┃ .wordtype .tenses      .academicplan

┣━━━[ 🔞 NSFW (50) ]━━━◆
┃ [Private Only — Use .enable nsfw]
┃ .hentai     .lewd       .ecchi
┃ .trap       .nsfwpic    .blowjob
┃ .ahegao     .cum        .feet
┃ .boobs      .butts      .ass
┃ .thighs     .ero        .panties
┃ .anal       .yuri       .bdsm
┃ .gifnsfw    .cumgif     .hentaivid
┃ .doujin     .cosplay    .rule34
┃ .furry      .booru      .xvideos
┃ .pornhub    .r34search  .shota
┃ .loli       .waifunsfw  .trapvid
┃ .xnxx       .femdom     .nsfwstory
┃ .feetpics   .nsfwvoice  .hentaivoice
┃ .fetish     .milf       .latex

┣━━━[ 👥 GROUP (50) ]━━━◆
┃ .tagall     .kick       .hidetag
┃ .promote    .demote     .groupinfo
┃ .linkgroup  .revoke     .mute
┃ .unmute     .setdesc    .setname
┃ .welcome    .goodbye    .antilink
┃ .antibot    .groupbot   .warn
┃ .unwarn     .warnlist   .del
┃ .purge      .nsfwgroup  .admins
┃ .blocklist  .vote       .endvote
┃ .poll       .groupdp    .gpstatus
┃ .join       .leave      .ghost
┃ .totag      .mentionall .ban
┃ .unban      .botmode    .autokick
┃ .report     .rules      .gpstats
┃ .deleteall  .antifake   .antilag

┣━━━[ 🎲 GAMES (50) ]━━━◆
┃ .rps        .fasttype   .guess
┃ .snake      .tictactoe  .2048
┃ .chess      .quizgame   .hangman
┃ .scramble   .truthdare  .memory
┃ .numbergame .coinflip   .dice
┃ .slots      .bingo      .trivia
┃ .whoami     .whatisthis .flaggame
┃ .logoquiz   .unscramble .react
┃ .quizbattle .gambling   .truthspin
┃ .dicespin   .typegame   .brainrush
┃ .spotdiff   .countclick .whisper
┃ .shadowhunt .ghosthunt  .spintowin

╰━━━━━━━━━━━━━━━━━━━━━━━◆
`.trim();

    await sock.sendMessage(m.chat, { text: menu }, { quoted: m });
  }
};
