// --- Analytics helper ---
window.ANA = {
  start: Date.now(),
  hintCount: 0,
  send(ev, params = {}) {
    try {
      gtag("event", ev, params);
    } catch (e) {}
  },
};

window.addEventListener("DOMContentLoaded", () => {
  const a = document.querySelector('a[href*="_hint.html"]');
  if (a) {
    a.addEventListener("click", () => {
      ANA.hintCount++;
      ANA.send("open_hint", { count: ANA.hintCount });
    });
  }
});

window.ANA = Object.assign(window.ANA || {}, {
  sid: Math.random().toString(36).slice(2),
  sent: new Set(),
  baseParams() {
    return {
      elapsed_sec: Math.round((Date.now() - this.start) / 1000),
      hints: this.hintCount || 0,
      save_version: typeof SAVE_VERSION === "number" ? SAVE_VERSION : null,
      room: (window.gameState && gameState.currentRoom) || null,
      sid: this.sid,
    };
  },
  once(ev, key = "", params = {}) {
    const k = `${ev}:${key}`;
    if (this.sent.has(k)) return;
    this.sent.add(k);
    this.send(ev, { ...this.baseParams(), ...params });
  },
});

// 汎用マイルストーン送信用ヘルパ
function markProgress(step, extra = {}) {
  ANA.once("progress", step, { step, ...extra });
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".modal-overlay");

  const closeBtn = document.querySelector(".close-btn");

  // 初期状態で非表示
  modal.style.display = "none";

  // 閉じる
  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // オーバーレイクリックでも閉じる
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});

document.querySelectorAll("#modal button").forEach((btn) => {
  if (btn.textContent === "OK") {
    btn.classList.add("ok-btn");
  }
});

window._nextModal = null;
const canvas = document.getElementById("gameCanvas");
let DEV_MODE = false;
let uiLang = "jp"; // 'jp' | 'en'
const USE_LOCAL_ASSETS = location.protocol === "file:" || location.hostname === "localhost" || location.search.includes("localimg=1");
const BASE_40 = USE_LOCAL_ASSETS ? "images/40" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/40";
const BASE_SOUND_40 = USE_LOCAL_ASSETS ? "sounds/40" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/40";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I40 = (file) => `${BASE_40}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S40 = (file) => `${BASE_SOUND_40}/${file}`;
const DEFAULT_BGM = S40("tsunoruomoiha_hoshizorani.mp3");
const tanabataSong = document.getElementById("se-tanabata-song");
if (tanabataSong) tanabataSong.src = S40("tanabata_song.mp3");
// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    mainDoor: [I40("main_door.webp")],
    mainDesk: [I40("main_desk.webp")],
    mainWindow: [I40("main_window.webp")],
    mainKitchen: [I40("main_kitchen.webp")],
    calendar: [I40("calendar.webp")],
    sasaZoom: [I40("sasa_zoom.webp")],
    freezer: [I40("freezer.webp")],
    anime1: [I40("anime_1.webp")],
    anime2: [I40("anime_2.webp")],
    anime3: [I40("anime_3.webp")],
    anime4: [I40("anime_4.webp")],
    anime5: [I40("anime_5.webp")],
    anime6: [I40("anime_6.webp"), I40("anime_6_2.webp")],
    rainEnd: [I40("rain_end.webp"), I40("rain_end2.webp"), I40("rain_end3.webp")],
    end: [I40("end.webp")],
    trueEnd: [I40("true_end.webp"), I40("true_end2.webp")],
  },
  items: {
    coin: ICM("bear_coin.png"),
    bear: ICM("bear.png"),
    back: ICM("common/back.png"),
    arrowRight: ICM("common/arrow_right.png"),
    arrowLeft: ICM("common/arrow_left.png"),
    arrowAbove: ICM("common/arrow_above.png"),
    redBack: ICM("common/red_back.png"),
    greenBack: ICM("common/green_back.png"),
    blueBack: ICM("common/blue_back.png"),
    blackBack: ICM("common/black_back.png"),
    lang_en: ICM("common/en2.png"),
    lang_jp: ICM("common/jp.png"),
    // key: ICM("common/key.webp"),
    battery: ICM("common/battery.webp"),
    driver: ICM("common/driver.webp"),

    anime1: [I40("anime_1.webp")],
    anime4: [I40("anime_4.webp")],

    key: I40("key.webp"),
    match: I40("match.webp"),
    smoke: I40("smoke.webp"),
    smokeNaname: I40("smoke_naname.webp"),
    katoriSenkoBefore: I40("katori_senko_before.webp"),
    katoriSenko: I40("katori_senko.webp"),
    katoriSenkoBurnt: I40("katori_senko_burnt.webp"),
    katoriSenkoBlown: I40("katori_senko_blown.webp"),
    codeAfter: I40("code_after.webp"),
    powerCode: I40("power_code.webp"),
    cleanser: I40("cleanser.webp"),
    burntFlypan: I40("burnt_flypan.webp"),
    flypan: I40("flypan.webp"),
    lockCabinet: I40("lock_cabinet.webp"),
    mop: I40("mop.webp"),
    dust: I40("dust.webp"),
    jug: I40("jug.webp"),
    jugWater: I40("jug_water.webp"),
    cupWater: I40("cup_water.webp"),
    ash: I40("ash.webp"),
    stick: I40("stick.webp"),
    fertilizer: I40("fertilizer.webp"),
    fog: I40("fog.webp"),
    shine: I40("shine.webp"),
    teruteru: I40("teruteru.webp"),
    tanzakuBlack: I40("tanzaku_black.webp"),
    tanzakuBlackYoko: I40("tanzaku_black_yoko.webp"),
    sky1: I40("sky_1.webp"),
    sky2: I40("sky_2.webp"),
    raincoat: I40("raincoat.webp"),
    sweet: I40("sweet.webp"),
    pen: I40("pen.webp"),
    memo: I40("memo.webp"),
  },
  modals: {
    smoke: I40("modal_smoke.webp"),
    smokeNaname: I40("modal_smoke_naname.webp"),
    oil: I40("modal_oil.webp"),
    mustard: I40("modal_mustard.webp"),
    codeConnect: I40("modal_code_connect.webp"),
    katoriSenko: I40("modal_katori_senko.webp"),
    orihimeSode: I40("modal_orihime_sode.webp"),
    hikoboshiSode: I40("modal_hikoboshi_sode.webp"),
    insideOven: I40("modal_inside_oven.webp"),
    cleanFlypan: I40("modal_clean_flypan.webp"),
    flypanShine: I40("modal_flypan_shine.webp"),
    cleanFan: I40("modal_fan_clean.webp"),
    rug: I40("modal_rug.webp"),
    rugAfter: I40("modal_rug_after.webp"),
    jugPour: I40("modal_jug_pour.webp"),
    modalL: I40("modal_l.webp"),
    modalA: I40("modal_a.webp"),
    modalK: I40("modal_k.webp"),
    modalE: I40("modal_e.webp"),
    plant: I40("modal_plant.webp"),
    plantShine: I40("modal_plant_shine.webp"),
    stick: I40("modal_stick.webp"),
    tanzakuAnim1: I40("modal_tanzaku_anim_1.webp"),
    tanzakuAnim2: I40("modal_tanzaku_anim_2.webp"),
    tanzakuAnim3: I40("modal_tanzaku_anim_3.webp"),
    tanzakuAnim4: I40("modal_tanzaku_anim_4.webp"),
    bearAnim1: I40("modal_bear_stop.webp"),
    bearAnim2: I40("modal_bear_notice.webp"),
    bearAnim3: I40("modal_bear_smoke.webp"),
    teruteruGet: I40("modal_teruteru_get.webp"),
    teruteruSet: I40("modal_teruteru_set.webp"),
    drawer: I40("modal_drawer2.webp"),
    drawerThird: I40("modal_drawer_third.webp"),
    book: I40("book.webp"),
    bookTeruteru: I40("book_teruteru.webp"),
    bookTeruteruEn: I40("book_teruteru_en.webp"),
    refrigeratorMemo: I40("refrigerator_memo.webp"),
    freezerMemo: I40("freezer_memo.webp"),
    icetray: I40("ice_tray.webp"),
    underSink: I40("modal_under_sink.webp"),
    bearReceive: I40("modal_bear_receive.webp"),
    bearEat: I40("modal_bear_eat.webp"),
    // badendDinner: I40("badend_dinner.webp"),
    // badendDinnerEn: I40("badend_dinner_en.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState40";
const SAVE_VERSION = 1;
const SAVE_KEYS = [SAVE_KEY + "_1", SAVE_KEY + "_2"];

// 旧1スロットセーブがあれば、自動でスロット1に移行
(function migrateOldSave() {
  try {
    const old = localStorage.getItem(SAVE_KEY);
    const slot1 = localStorage.getItem(SAVE_KEYS[0]);
    if (old && !slot1) {
      localStorage.setItem(SAVE_KEYS[0], old);
      // 必要なら古いキーは消してもOK
      // localStorage.removeItem(SAVE_KEY);
      console.log("旧セーブデータをスロット1に移行しました");
    }
  } catch (e) {
    console.warn("セーブデータ移行に失敗", e);
  }
})();

function getDefaultGameState() {
  return {
    currentRoom: "mainWindow",
    openRooms: ["mainWindow"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        fireSenko: false,
        senkoBurned: false,
        senkoBlown: false,
        projectorPowerOn: false,
        fanCleaned: false,
        pourWater: false,
        glassMelodySolved: false,
        glassMelodyInputs: [],
        flypanCleaned: false,
        useFertilizer: false,
        tanzakuLightEventDone: false,
        timePhase: 0,
        isNight: false,
        foundTeruteru: false,
        teruteruSet: false,
        weatherSkyState: 0,
        foundMainKitchenStick: false,
        foundMainKitchenOvenBurntFlypan: false,
        foundMainKitchenMatch: false,
        unlockMainKitchenFreezer: false,
        mainKitchenFreezerLetters: [0, 0, 0],
        unlockMainKitchenRefrigerator: false,
        foundMainKitchenRefrigeratorSweet: false,
        foundMainKitchenUpperCabinetJug: false,
        unlockMainKitchenUpperCabinet: false,
        mainKitchenUpperCabinetLetters: [0, 0, 0, 0],
        foundMainKitchenLowerRightCabinetMop: false,
        unlockMainKitchenLowerRightCabinet: false,
        mainKitchenLowerRightCabinetLetters: [0, 0, 0, 0, 0],
        unlockMainKitchenLowerLeftCabinet: false,
        foundMainKitchenLowerLeftCabinetRaincoat: false,
        unlockMainDoorCabinet: false,
        mainDoorCabinetInputs: [],
        foundMainDoorCabinetKey: false,
        bearAppear: false,
        gaveSweetToBearFairy: false,
        unlockSafe: false,
        foundWashitsuSafeYen300: false,
        washitsuSafeDigits: [],
        washitsuSafeDialNumber: 0,
        unlockMainDeskTopDrawer: false,
        foundMainDeskTopDrawerPowerCode: false,
        mainDeskTopDrawerDigits: [0, 0, 0, 0],
        unlockMainDeskSecondDrawer: false,
        foundMainDeskSecondDrawerFertilizer: false,
        mainDeskSecondDrawerDigits: [1, 1],
        unlockMainDeskThirdDrawer: false,
        foundMainDeskThirdDrawerMemo: false,
        mainDeskThirdDrawerBars: [0, 0, 0, 0],
        unlockMainDeskBottomDrawer: false,
        foundMainDeskBottomDrawerCleanser: false,
        mainDeskBottomDrawerSymbols: [1, 1, 1, 1, 1],
        unlockMainTvLeftDrawer: false,
        foundMainTvLeftDrawerBattery: false,
        mainTvLeftDrawerDigits: [0, 0, 0, 0, 0, 0],
        unlockMainTvRightDrawer: false,
        foundMainTvRightDrawerMemoSafe: false,
        mainTvRightDrawerLetters: [0, 0, 0, 0],
        unlockBox: false,
        mainDoorBoxDigits: [0, 0, 0, 0],
        glassWithWineDrinkCount: 0,
        talkTo: { bear: 0, wizard: 0 },
      },
    },

    tvDinner: {
      flags: { backgroundState: 0 },
    },
    anime6: {
      flags: { backgroundState: 0 },
    },

    end: {
      flags: { backgroundState: 0 },
    },
    trueEnd: {
      flags: { backgroundState: 0 },
    },
    rainEnd: {
      flags: { backgroundState: 0 },
    },
    selectedItem: null,
    selectedItemSlot: null,
    usingItem: null,
    inventoryPage: 0,
  };
}

let gameState = getDefaultGameState();
let daemonBearEatingTimer = null;

function shouldUseSmokeNaname() {
  const f = gameState.main?.flags || {};
  return !!(f.fireSenko && !f.senkoBurned && f.fanCleaned);
}

function areAllTanzakuLit() {
  const f = gameState.main?.flags || {};
  return !!(f.flypanCleaned && f.useFertilizer && f.foundMainDeskTopDrawerPowerCode && f.fanCleaned && f.glassMelodySolved);
}

// 部屋データ
let rooms = {
  mainDoor: {
    name: "ドア前",
    description: "",
    clickableAreas: [
      {
        x: 29.8,
        y: 69.0,
        width: 14.1,
        height: 6.0,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.modalK, "飾り皿が飾られている");
        }),
        description: "飾り皿",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 15.1,
        y: 69.6,
        width: 13.5,
        height: 5.3,
        onClick: clickWrap(handleMainDoorBookClick),
        description: "本",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "延長コードと光",
        zIndex: 5,
        usable: () => false,
        item: { img: "codeAfter", visible: () => gameState.main.flags.projectorPowerOn },
      },
      {
        x: 45.6,
        y: 85.3,
        width: 17.3,
        height: 11.9,
        onClick: clickWrap(handleProjectorCodeClick),
        description: "プロジェクターのコード",
        zIndex: 5,
        usable: () => !gameState.main.flags.projectorPowerOn,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 30.3,
        y: 79.3,
        width: 13.8,
        height: 6.9,
        onClick: clickWrap(function () {
          if (gameState.main.flags.projectorPowerOn) {
            updateMessage("プロジェクターは動作している");
            return;
          }
          updateMessage("プロジェクターがある");
        }),
        description: "プロジェクター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 13.2,
        y: 26.1,
        width: 48.8,
        height: 31.5,
        onClick: clickWrap(function () {
          if (gameState.main.flags.projectorPowerOn) {
            changeRoom(gameState.main.flags.tanzakuLightEventDone ? "anime4" : "anime1");
            return;
          }
          updateMessage("白いスクリーンだ");
        }),
        description: "スクリーン",
        zIndex: 5,
        usable: () => true,
        item: { img: () => (gameState.main.flags.tanzakuLightEventDone ? "anime4" : "anime1"), visible: () => gameState.main.flags.projectorPowerOn },
      },
      {
        x: 72.3,
        y: 31.7,
        width: 21.0,
        height: 48.1,
        onClick: clickWrap(function () {
          const weatherSkyState = Number(gameState.main.flags.weatherSkyState) || 0;
          if (weatherSkyState === 2) {
            travelWithSteps(gameState.main.flags.gaveSweetToBearFairy ? "trueEnd" : "end");
            return;
          }
          if (weatherSkyState < 2 && gameState.inventory.includes("raincoat")) {
            showModal("レインコートを着て外に出ますか？", "", [
              {
                text: "はい",
                action: () => {
                  removeItem("raincoat");
                  closeModal();
                  travelWithSteps("rainEnd");
                },
              },
              { text: "いいえ", action: "close" },
            ]);
            return;
          }
          updateMessage("外は激しく雨が降っているようだ。出るのは危険かもしれない");
        }),
        description: "ドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 45.0,
        y: 69.8,
        width: 14.0,
        height: 10.3,
        onClick: clickWrap(handleMainDoorCabinetClick),
        description: "キャビネット",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 16.5,
        y: 61.7,
        width: 11.6,
        height: 11.6,
        onClick: clickWrap(function () {
          updateMessage("余った短冊が置いてある");
        }),
        description: "横向きの黒い短冊",
        zIndex: 5,
        usable: () => !gameState.main.flags.bearAppear,
        item: { img: "tanzakuBlackYoko", visible: () => !gameState.main.flags.bearAppear },
      },
      {
        x: 38.2,
        y: 48.9,
        width: 19.4,
        height: 19.0,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "sweet") {
            handleMainDoorBearSweetClick();
            return;
          }
          if (gameState.main.flags.weatherSkyState < 2 && gameState.main.flags.gaveSweetToBearFairy) {
            talkToHintCharacter("main", "bear3");
            return;
          }
          if (gameState.main.flags.weatherSkyState < 2) {
            talkToHintCharacter("main", "bear");
            return;
          }

          if (gameState.main.flags.weatherSkyState == 2 && gameState.main.flags.gaveSweetToBearFairy) {
            talkToHintCharacter("main", "bear4");
            return;
          }
          talkToHintCharacter("main", "bear2");
        }),
        description: "現れたクマ妖精",
        zIndex: 6,
        usable: () => gameState.main.flags.bearAppear,
        item: { img: "bear", visible: () => gameState.main.flags.bearAppear },
      },
      {
        x: 59.2,
        y: 83.0,
        width: 7.7,
        height: 7.0,
        onClick: clickWrap(function () {
          acquireItemOnce("foundTeruteru", "teruteru", "テルテル坊主が落ちている", IMAGES.modals.teruteruGet, "テルテル坊主を拾った");
        }),
        description: "落ちているテルテル坊主",
        zIndex: 5,
        usable: () => gameState.main.flags.bearAppear && !gameState.main.flags.foundTeruteru,
        item: { img: "teruteru", visible: () => gameState.main.flags.bearAppear && !gameState.main.flags.foundTeruteru },
      },
      {
        x: 0,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainDesk");
          },
          { allowAtNight: true },
        ),
        description: "ドア面左、机面へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainKitchen");
          },
          { allowAtNight: true },
        ),
        description: "ドア面右、キッチン面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  anime1: {
    name: "七夕アニメ",
    description: "左岸の織姫です",
    clickableAreas: [
      {
        x: 22.3,
        y: 53.2,
        width: 11.6,
        height: 13.1,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.orihimeSode, "織姫の衣装だ");
        }),
        description: "織姫の袖",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 9.8,
        y: 33.7,
        width: 16.9,
        height: 17.1,
        onClick: clickWrap(function () {
          updateMessage("織姫は、悲しそうにしている");
        }),
        description: "織姫",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 93.6,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("anime2");
          },
          { allowAtNight: true },
        ),
        description: "アニメ1右、2へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "アニメ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  anime2: {
    name: "七夕アニメ",
    description: "右岸の彦星です",
    clickableAreas: [
      {
        x: 63.6,
        y: 39.0,
        width: 14.7,
        height: 13.9,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.hikoboshiSode, "彦星の衣装だ");
        }),
        description: "彦星の袖",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.1,
        y: 15.5,
        width: 19.9,
        height: 19.8,
        onClick: clickWrap(function () {
          updateMessage("彦星は、悲しそうにしている");
        }),
        description: "彦星",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("anime1");
          },
          { allowAtNight: true },
        ),
        description: "アニメ2左、1へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("anime3");
          },
          { allowAtNight: true },
        ),
        description: "アニメ2右、3へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "アニメ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  anime3: {
    name: "七夕アニメ",
    description: "大雨で増水した天の川です",
    clickableAreas: [
      {
        x: 0,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("anime2");
          },
          { allowAtNight: true },
        ),
        description: "アニメ3左、2へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },

      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "アニメ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  anime4: {
    name: "七夕アニメ",
    description: "左岸の織姫です",
    clickableAreas: [
      {
        x: 9.8,
        y: 33.7,
        width: 16.9,
        height: 17.1,
        onClick: clickWrap(function () {
          updateMessage("織姫は、笑顔だ");
        }),
        description: "織姫",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 93.6,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("anime5");
          },
          { allowAtNight: true },
        ),
        description: "アニメ4右、5へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "アニメ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  anime5: {
    name: "七夕アニメ",
    description: "右岸の彦星です",
    clickableAreas: [
      {
        x: 75.1,
        y: 15.5,
        width: 19.9,
        height: 19.8,
        onClick: clickWrap(function () {
          updateMessage("彦星は、笑顔だ");
        }),
        description: "彦星",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("anime4");
          },
          { allowAtNight: true },
        ),
        description: "アニメ5左、4へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("anime6");
          },
          { allowAtNight: true },
        ),
        description: "アニメ5右、6へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "アニメ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  anime6: {
    name: "七夕アニメ",
    description: "天の川にかかった光の橋で出会えた織姫と彦星です",
    clickableAreas: [
      {
        x: 71.6,
        y: 0.6,
        width: 27.7,
        height: 27.7,
        onClick: clickWrap(handleAnime6RunningBearClick),
        description: "走るクマ妖精",
        zIndex: 5,
        usable: () => !gameState.main.flags.bearAppear,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 31.5,
        y: 26.1,
        width: 45.4,
        height: 23.6,
        onClick: clickWrap(function () {
          updateMessage("彦星「一年ぶりだね」織姫「嬉しい！」再会を喜んでいるようだ");
        }),
        description: "織姫と彦星",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("anime5");
          },
          { allowAtNight: true },
        ),
        description: "アニメ6左、5へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },

      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "アニメ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  mainDesk: {
    name: "机がある面",
    description: "",
    clickableAreas: [
      {
        x: 6.5,
        y: 13.4,
        width: 22.6,
        height: 22.4,
        onClick: clickWrap(function () {
          changeRoom("calendar");
        }),
        description: "カレンダー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 70.5,
        y: 5.4,
        width: 14.9,
        height: 12.9,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.modalA, "額縁が飾られている");
        }),
        description: "ひし形の額縁",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 13.5,
        y: 35.9,
        width: 10.9,
        height: 10.4,
        onClick: clickWrap(function () {}),
        description: "ほこり",
        zIndex: 5,
        usable: () => false,
        item: { img: "dust", visible: () => !gameState.main.flags.fanCleaned },
      },
      {
        x: 13.6,
        y: 38.5,
        width: 10.9,
        height: 14.8,
        onClick: clickWrap(handleMainDeskFanClick),
        description: "扇風機",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 11.1,
        y: 36.6,
        width: 16.3,
        height: 15.0,
        onClick: clickWrap(function () {}),
        description: "扇風機の円形部分",
        zIndex: 5,
        usable: () => false,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 49.9,
        y: 45.0,
        width: 11.8,
        height: 10.6,
        onClick: clickWrap(handleKatoriSenkoClick),
        description: "蚊取り線香",
        zIndex: 5,
        usable: () => !gameState.main.flags.fireSenko && !gameState.main.flags.senkoBurned,
        item: { img: "katoriSenkoBefore", visible: () => !gameState.main.flags.fireSenko && !gameState.main.flags.senkoBurned },
      },
      {
        x: 49.9,
        y: 45.0,
        width: 11.8,
        height: 10.6,
        onClick: clickWrap(function () {
          updateMessage("蚊取り線香に火がついている。");
        }),
        description: "火が付いた蚊取り線香",
        zIndex: 5,
        usable: () => gameState.main.flags.fireSenko && !gameState.main.flags.senkoBurned,
        item: { img: "katoriSenko", visible: () => gameState.main.flags.fireSenko && !gameState.main.flags.senkoBurned },
      },
      {
        x: 49.9,
        y: 45.0,
        width: 11.8,
        height: 10.6,
        onClick: clickWrap(function () {
          updateMessage("蚊取り線香は燃え尽きた。");
        }),
        description: "燃え尽きた蚊取り線香",
        zIndex: 5,
        usable: () => gameState.main.flags.senkoBurned && !gameState.main.flags.senkoBlown,
        item: { img: "katoriSenkoBurnt", visible: () => gameState.main.flags.senkoBurned && !gameState.main.flags.senkoBlown },
      },
      {
        x: 49.9,
        y: 45.0,
        width: 11.8,
        height: 10.6,
        onClick: clickWrap(function () {
          updateMessage("蚊取り線香は燃え尽きた。");
        }),
        description: "灰が飛ばされた蚊取り線香",
        zIndex: 5,
        usable: () => gameState.main.flags.senkoBurned && gameState.main.flags.senkoBlown,
        item: { img: "katoriSenkoBlown", visible: () => gameState.main.flags.senkoBurned && gameState.main.flags.senkoBlown },
      },
      {
        x: 50.1,
        y: 24.8,
        width: 27.7,
        height: 24.4,
        onClick: clickWrap(function () {
          showObj(null, "煙が立ち上っている", shouldUseSmokeNaname() ? IMAGES.modals.smokeNaname : IMAGES.modals.smoke, "煙が立ち上っている");
        }),
        description: "煙",
        zIndex: 6,
        usable: () => gameState.main.flags.fireSenko && !gameState.main.flags.senkoBurned,
        item: { img: () => (shouldUseSmokeNaname() ? "smokeNaname" : "smoke"), visible: () => gameState.main.flags.fireSenko && !gameState.main.flags.senkoBurned },
      },
      {
        x: 48.5,
        y: 83.5,
        width: 39.1,
        height: 15.3,
        onClick: clickWrap(function () {
          showObj(null, "床にマットが敷かれている", gameState.main.flags.fanCleaned && gameState.main.flags.senkoBurned ? IMAGES.modals.rugAfter : IMAGES.modals.rug, "床にマットが敷かれている");
        }),
        description: "ラグ",
        zIndex: 5,
        usable: () => true,
        item: { img: "ash", visible: () => gameState.main.flags.fanCleaned && gameState.main.flags.senkoBurned },
      },
      {
        x: 72.2,
        y: 37.0,
        width: 22.7,
        height: 8.8,
        onClick: clickWrap(handleMainDeskCupClick),
        description: "コップ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "コップの水",
        zIndex: 5,
        usable: () => false,
        item: { img: "cupWater", visible: () => gameState.main.flags.pourWater },
      },
      {
        x: 75.5,
        y: 49.2,
        width: 19.3,
        height: 5.4,
        onClick: clickWrap(showMainDeskTopDrawerPuzzle),
        description: "引き出し最上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.6,
        y: 56.7,
        width: 19.2,
        height: 5.4,
        onClick: clickWrap(showMainDeskSecondDrawerPuzzle),
        description: "引き出し2段目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.4,
        y: 63.9,
        width: 19.6,
        height: 5.5,
        onClick: clickWrap(showMainDeskThirdDrawerPuzzle),
        description: "引き出し3段目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.6,
        y: 71.5,
        width: 19.2,
        height: 5.4,
        onClick: clickWrap(showMainDeskBottomDrawerPuzzle),
        description: "引き出し最下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },

      {
        x: 0,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainWindow");
          },
          { allowAtNight: true },
        ),
        description: "机がある面左、窓面へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "机がある面右、ドア面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  calendar: {
    name: "カレンダー",
    description: "",
    clickableAreas: [
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainDesk");
          },
          { allowAtNight: true },
        ),
        description: "カレンダー戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  mainWindow: {
    name: "窓のある面",
    description: "",
    clickableAreas: [
      {
        x: 77.2,
        y: 13.4,
        width: 14.6,
        height: 12.1,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.modalE, "額縁が飾られている。少し色あせている。");
        }),
        description: "三角形の額縁",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.1,
        y: 21.8,
        width: 30.3,
        height: 47.4,
        onClick: clickWrap(function () {
          if (!gameState.main.flags.tanzakuLightEventDone && areAllTanzakuLit()) {
            showTanzakuLightEvent();
            return;
          }
          changeRoom("sasaZoom");
        }),
        description: "笹飾り",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 4.0,
        y: 37.2,
        width: 3.4,
        height: 10.4,
        onClick: clickWrap(function () {}),
        description: "赤い短冊",
        zIndex: 5,
        usable: () => false,
        glowWhen: () => gameState.main.flags.flypanCleaned && !gameState.main.flags.tanzakuLightEventDone,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 10.8,
        y: 40.0,
        width: 3.3,
        height: 10.2,
        onClick: clickWrap(function () {}),
        description: "青い短冊",
        zIndex: 5,
        usable: () => false,
        glowWhen: () => gameState.main.flags.useFertilizer && !gameState.main.flags.tanzakuLightEventDone,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 17.3,
        y: 41.9,
        width: 4.0,
        height: 9.6,
        onClick: clickWrap(function () {}),
        description: "黄色い短冊",
        zIndex: 5,
        usable: () => false,
        glowWhen: () => gameState.main.flags.foundMainDeskTopDrawerPowerCode && !gameState.main.flags.tanzakuLightEventDone,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 26.2,
        y: 41.2,
        width: 4.6,
        height: 9.6,
        onClick: clickWrap(function () {}),
        description: "白い短冊",
        zIndex: 5,
        usable: () => false,
        glowWhen: () => gameState.main.flags.fanCleaned && !gameState.main.flags.tanzakuLightEventDone,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 22.1,
        y: 55.0,
        width: 4.4,
        height: 9.6,
        onClick: clickWrap(function () {}),
        description: "紫の短冊",
        zIndex: 5,
        usable: () => false,
        glowWhen: () => gameState.main.flags.glassMelodySolved && !gameState.main.flags.tanzakuLightEventDone,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 5.0,
        y: 50.7,
        width: 3.1,
        height: 10.1,
        onClick: clickWrap(function () {}),
        description: "黒の短冊",
        zIndex: 5,
        usable: () => false,
        item: { img: "tanzakuBlack", visible: () => gameState.main.flags.bearAppear },
      },
      {
        x: 2.1,
        y: 70.7,
        width: 5.3,
        height: 4.4,
        onClick: clickWrap(function () {
          updateMessage("ペンがある。短冊に願いを書くのに使ったものだろうか");
        }),
        description: "ペン",
        zIndex: 5,
        usable: () => !gameState.main.flags.bearAppear,
        item: { img: "pen", visible: () => !gameState.main.flags.bearAppear },
      },
      {
        x: 20.2,
        y: 69.4,
        width: 5.7,
        height: 3.5,
        onClick: clickWrap(function () {
          updateMessage("ペンがある。短冊に願いを書くのに使ったものだろうか");
        }),
        description: "ペン",
        zIndex: 5,
        usable: () => gameState.main.flags.bearAppear,
        item: { img: "pen", visible: () => gameState.main.flags.bearAppear },
      },
      {
        x: 19.8,
        y: 74.3,
        width: 10.8,
        height: 7.4,
        onClick: clickWrap(function () {
          playSE?.("se-hikidashi");
          showObj(null, "引き出しには七夕モチーフのトランプが入っている", IMAGES.modals.drawer, "引き出しを開けた。");
        }),
        description: "引き出し",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 79.4,
        y: 48.6,
        width: 19.7,
        height: 15.5,
        onClick: clickWrap(function () {}),
        description: "霧または輝き",
        zIndex: 5,
        usable: () => false,
        item: { img: () => (!gameState.main.flags.useFertilizer ? "fog" : "shine"), visible: () => true },
      },
      {
        x: 79.9,
        y: 44.0,
        width: 17.9,
        height: 31.9,
        onClick: clickWrap(function () {
          handleMainWindowPlantClick();
        }),
        description: "観葉植物",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 33.1,
        y: 15.3,
        width: 34.0,
        height: 47.7,
        onClick: clickWrap(function () {
          if (gameState.main.flags.weatherSkyState < 2) {
            updateMessage("雨が激しくふっている。星は見えない");
            return;
          }
          updateMessage("雨がやみ、綺麗な夜空が見える");
        }),
        description: "窓",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 72.9,
        y: 35.8,
        width: 6.8,
        height: 12.5,
        onClick: clickWrap(handleMainWindowHookClick),
        description: "窓際のフック",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 73.7,
        y: 45.5,
        width: 7.0,
        height: 12.6,
        onClick: clickWrap(function () {
          updateMessage("テルテル坊主がぶら下がっている");
        }),
        description: "テルテル坊主表示位置",
        zIndex: 5,
        usable: () => gameState.main.flags.teruteruSet,
        item: { img: "teruteru", visible: () => gameState.main.flags.teruteruSet },
      },

      {
        x: 0,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainKitchen");
          },
          { allowAtNight: true },
        ),
        description: "窓面左、キッチン面へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainDesk");
          },
          { allowAtNight: true },
        ),
        description: "窓面右、机面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  sasaZoom: {
    name: "七夕の笹飾り",
    description: "",
    clickableAreas: [
      {
        x: 6.7,
        y: 2.2,
        width: 12.1,
        height: 41.4,
        onClick: clickWrap(function () {
          showTanzakuModal("red", "赤い短冊", "体が重い。余計なものを落としてすっきりできますように", gameState.main.flags.flypanCleaned ? { text: "CLE", side: "right", color: "#ff8a00" } : null);
        }),
        description: "赤い短冊",
        zIndex: 5,
        usable: () => true,
        glowWhen: () => gameState.main.flags.flypanCleaned && !gameState.main.flags.tanzakuLightEventDone,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 31.2,
        y: 16.5,
        width: 12.0,
        height: 39.1,
        onClick: clickWrap(function () {
          showTanzakuModal("blue", "青い短冊", "元気が出ない。もう一度きらきら輝けますように");
        }),
        description: "青い短冊",
        zIndex: 5,
        usable: () => true,
        glowWhen: () => gameState.main.flags.useFertilizer && !gameState.main.flags.tanzakuLightEventDone,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 54.4,
        y: 23.4,
        width: 12.1,
        height: 31.9,
        onClick: clickWrap(function () {
          showTanzakuModal("yellow", "黄色の短冊", "ぐるぐる回る人生に飽きた。いつか燃え尽きられますように", gameState.main.flags.foundMainDeskTopDrawerPowerCode ? { text: "AN", side: "left", color: "#ff8a00" } : null);
        }),
        description: "黄色の短冊",
        zIndex: 5,
        usable: () => true,
        glowWhen: () => gameState.main.flags.foundMainDeskTopDrawerPowerCode && !gameState.main.flags.tanzakuLightEventDone,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 81.5,
        y: 17.5,
        width: 18.2,
        height: 43.6,
        onClick: clickWrap(function () {
          showTanzakuModal("white", "白い短冊", "息苦しい。綺麗な空気が吸えますように", gameState.main.flags.fanCleaned ? { shape: "pentagon", side: "left", color: "#1a0f08" } : null);
        }),
        description: "白い短冊",
        zIndex: 5,
        usable: () => true,
        glowWhen: () => gameState.main.flags.fanCleaned && !gameState.main.flags.tanzakuLightEventDone,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 67.1,
        y: 64.2,
        width: 16.6,
        height: 34.7,
        onClick: clickWrap(function () {
          showTanzakuModal("purple", "紫の短冊", "喉が渇いた。潤って綺麗な声で歌えますように", gameState.main.flags.glassMelodySolved ? { shape: "diamond", side: "right", color: "#1a0f08" } : null);
        }),
        description: "紫の短冊",
        zIndex: 5,
        usable: () => true,
        glowWhen: () => gameState.main.flags.glassMelodySolved && !gameState.main.flags.tanzakuLightEventDone,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 11.0,
        y: 51.1,
        width: 15.8,
        height: 45.7,
        onClick: clickWrap(function () {
          const message = gameState.main.flags.gaveSweetToBearFairy ? "あなたに良いことがありますように" : "美味しいおやつが食べられますように";
          showBlackTanzakuModal(message);
        }),
        description: "黒の短冊",
        zIndex: 5,
        usable: () => gameState.main.flags.bearAppear,
        item: { img: "tanzakuBlack", visible: () => gameState.main.flags.bearAppear },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainWindow");
          },
          { allowAtNight: true },
        ),
        description: "笹飾り戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  mainKitchen: {
    name: "キッチンがある面",
    description: "",
    clickableAreas: [
      {
        x: 14.8,
        y: 24.1,
        width: 9.4,
        height: 11.1,
        onClick: clickWrap(function () {
          acquireItemOnce("foundMainKitchenStick", "stick", "箸立てに箸が入っている", IMAGES.modals.stick, "箸を手に入れた");
        }),
        description: "箸立て",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 86.6,
        y: 26.0,
        width: 8.9,
        height: 8.8,
        onClick: clickWrap(function () {
          showObj(null, "ケチャップとマスタードがある", IMAGES.modals.mustard, "ケチャップとマスタードがある");
        }),
        description: "マスタード",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 24.9,
        y: 12.9,
        width: 9.9,
        height: 10.4,
        onClick: clickWrap(function () {
          showObj(null, "オイルとソースがある", IMAGES.modals.oil, "オイルとソースがある");
        }),
        description: "オイル",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 35.9,
        y: 9.3,
        width: 13.2,
        height: 13.6,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.modalL, "時計がある");
        }),
        description: "時計",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 49.9,
        y: 62.5,
        width: 25.3,
        height: 4.0,
        onClick: clickWrap(function () {
          handleMainKitchenDrawerClick();
        }),
        description: "横長引き出し",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 76.1,
        y: 65.9,
        width: 20.9,
        height: 13.7,
        onClick: clickWrap(handleMainKitchenOvenClick),
        description: "オーブン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 72.9,
        y: 46.2,
        width: 13.1,
        height: 10.4,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.flypanShine, "フライパンは、ピカピカだ");
        }),
        description: "きれいになったフライパン",
        zIndex: 5,
        usable: () => gameState.main.flags.flypanCleaned,
        item: { img: "flypan", visible: () => gameState.main.flags.flypanCleaned },
      },
      {
        x: 57.9,
        y: 72.9,
        width: 10.9,
        height: 3.8,
        onClick: clickWrap(function () {}),
        description: "下段キャビネット右のロック",
        zIndex: 5,
        usable: () => false,
        item: { img: "lockCabinet", visible: () => !gameState.main.flags.unlockMainKitchenLowerRightCabinet },
      },
      {
        x: 50.0,
        y: 67.2,
        width: 24.9,
        height: 12.5,
        onClick: clickWrap(showMainKitchenLowerRightCabinetPuzzle),
        description: "下段キャビネット右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 23.9,
        y: 62.6,
        width: 25.2,
        height: 16.5,
        onClick: clickWrap(handleMainKitchenLowerLeftCabinetClick),
        description: "シンク下キャビネット",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 24.9,
        y: 23.4,
        width: 24.6,
        height: 12.5,
        onClick: clickWrap(handleMainKitchenUpperCabinetClick),
        description: "上段キャビネット",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 26.0,
        y: 44.3,
        width: 14.6,
        height: 13.6,
        onClick: clickWrap(handleMainKitchenFaucetClick),
        description: "蛇口",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 2.8,
        y: 43.1,
        width: 19.7,
        height: 11.0,
        onClick: clickWrap(handleMainKitchenFreezerClick),
        description: "冷凍庫",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 2.9,
        y: 55.1,
        width: 19.1,
        height: 26.4,
        onClick: clickWrap(handleMainKitchenRefrigeratorClick),
        description: "冷蔵庫下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },

      {
        x: 0,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "キッチン面左、ドア面へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainWindow");
          },
          { allowAtNight: true },
        ),
        description: "キッチン面右、窓面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  freezer: {
    name: "冷凍庫内部",
    description: "",
    clickableAreas: [
      {
        x: 10.1,
        y: 52.2,
        width: 65.0,
        height: 38.6,
        onClick: clickWrap(function () {
          showObj(null, "製氷皿がある", IMAGES.modals.icetray, "製氷皿がある");
        }),
        description: "製氷皿",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainKitchen");
          },
          { allowAtNight: true },
        ),
        description: "冷凍庫戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  rainEnd: {
    name: "ノーマルエンド2",
    description: "土砂降りの雨の中、あなたは勇敢にも一歩を踏み出しました！",
    clickableAreas: [
      {
        x: 1.9,
        y: 70.9,
        width: 20.4,
        height: 24.5,
        onClick: clickWrap(function () {
          updateMessage("クマ妖精は、少し心配しているようだ");
        }),
        description: "心配そうなクマ妖精",
        zIndex: 5,
        usable: () => gameState.rainEnd.flags.backgroundState == 2,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {
          showEndingReport("rainEnd");
        }),
        description: "ノーマルエンド2",
      },
    ],
  },
  end: {
    name: "ノーマルエンド",
    description: "雨の夜の部屋から脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 67.2,
        y: 64.0,
        width: 27.1,
        height: 27.1,
        onClick: clickWrap(function () {
          updateMessage("クマ妖精は手を振っている");
        }),
        description: "手を振るクマ妖精",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {
          showEndingReport("end");
        }),
        description: "ノーマルエンド",
      },
    ],
  },

  trueEnd: {
    name: "トゥルーエンド",
    description: "クマ妖精がなにかおまじないをかけてくれています！脱出おめでとうございます。",
    clickableAreas: [
      {
        x: 21.7,
        y: 54.1,
        width: 52.6,
        height: 40.2,
        onClick: clickWrap(function () {
          if (gameState.trueEnd.flags.backgroundState == 0) {
            gameState.trueEnd.flags.backgroundState = 1;
            renderCanvasRoom();
          }
          updateMessage("幸運がありますように！");
        }),
        description: "おまじないをかけるクマ妖精",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 56.8,
        y: 14.0,
        width: 18.1,
        height: 16.0,
        onClick: clickWrap(function () {
          updateMessage("うっすらと何かが見える");
        }),
        description: "織姫と彦星",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {
          updateMessage("脱出成功です!おめでとうございます！");
          showEndingReport("trueEnd");
        }),
        description: "トゥルーエンド",
        usable: () => true,
      },
    ],
  },
};

const hintMessages = {
  main: {
    bear: ["「呼んだ？」", "「ふう、間に合った」"],
    bear2: ["「雨が止んだね」", "「えへへ」"],
    bear3: ["「わーい」", "「願いが叶ったよ。書いてみるものだね」"],
    bear4: ["「わーい！」", "「願いが叶ったよ。雨も止んだね」"],
  },
};

function showDinnerReservationBadEnd() {
  closeModal();
  playSE?.("se-elevator2");

  const overlay = document.getElementById("roomEffectOverlay");
  if (overlay) {
    overlay.classList.remove("warp-active");
    overlay.style.background = "#000";
    overlay.style.opacity = 1;
  }

  setTimeout(() => {
    if (overlay) {
      overlay.style.opacity = 0;
      overlay.style.background = "";
    }

    playSE?.("se-android");
    const imgSrc = uiLang === "en" ? IMAGES.modals.badendDinnerEn : IMAGES.modals.badendDinner;
    const content = `
      <div style="text-align:center;">
        <img src="${imgSrc}" alt="レストランなのはな" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
      </div>
    `;
    pauseBGM();
    showModal("【BAD END】予約のない食事", content, [{ text: "最初から", action: "restart" }]);
    updateMessage("BAD END: 予約のない食事");
  }, 2000);
}

function travelWithSteps(destRoom, { useWarp = false } = {}) {
  const overlay = document.getElementById("roomEffectOverlay");

  playSE?.("se-ashioto");

  if (overlay) {
    overlay.style.background = useWarp ? "#fff" : "#000";
    overlay.style.opacity = 1;
  }

  if (!useWarp) {
    setTimeout(() => {
      changeRoom(destRoom);
      setTimeout(() => {
        if (overlay) {
          overlay.style.opacity = 0;
          overlay.style.background = "";
        }
      }, 100);
    }, 480);
    return;
  }

  let step = 0;
  const stepTimer = setInterval(() => {
    step++;

    if (step >= 3) {
      clearInterval(stepTimer);

      if (overlay) {
        overlay.classList.add("warp-active");
        changeRoom(destRoom);
        overlay.style.background = "";
      }

      setTimeout(() => {
        if (overlay) {
          overlay.classList.remove("warp-active");
          overlay.style.opacity = 0;
          overlay.style.background = "";
        }
      }, 900);
    }
  }, 260);
}

function travelWithStepsTrueEnd() {
  const overlay = document.getElementById("roomEffectOverlay");
  const destRoom = "trueEnd";

  playSE?.("se-ashioto");

  // 画面を黒フェードに
  if (overlay) {
    overlay.style.background = "#fff";
    overlay.style.opacity = 1;
  }

  let step = 0;
  const stepTimer = setInterval(() => {
    step++;

    if (step >= 3) {
      clearInterval(stepTimer);

      // 黒→ワープ光へ切替
      if (overlay) {
        overlay.classList.add("warp-active");
        changeRoom(destRoom);
        overlay.style.background = ""; // warp の白発光に戻す
      }

      setTimeout(() => {
        // 演出後に綺麗に消す
        if (overlay) {
          overlay.classList.remove("warp-active");
          overlay.style.opacity = 0;
        }
      }, 900);
    }
  }, 260);
}

// ゲーム初期化
function initGame() {
  renderNavigation();
  changeRoom("mainWindow");
  updateInventoryDisplay();
  updateMessage("気が付くと雨が降る景色が見える部屋に立っていた。");
  try {
    renderStatusIcons();
  } catch (e) {}
}

function getAreaDrawRect(area, canvas) {
  const baseX = (area.x / 100) * canvas.width;
  const baseY = (area.y / 100) * canvas.height;
  const baseW = (area.width / 100) * canvas.width;
  const baseH = (area.height / 100) * canvas.height;
  let x = baseX;
  let y = baseY;
  let w = baseW;
  let h = baseH;
  const itemKey = area.item && (typeof area.item.img === "function" ? area.item.img() : area.item.img);

  if (itemKey === "arrowLeft" || itemKey === "arrowRight") {
    const scale = 1.4;
    const nextW = w * scale;
    const nextH = h * scale;
    x -= (nextW - w) / 2;
    y -= (nextH - h) / 2;
    w = nextW;
    h = nextH;

    // 画面端では拡大分を内側へ寄せて、見切れを防ぐ
    if (baseX <= 0) x = 0;
    if (baseX + baseW >= canvas.width) x = canvas.width - w;
    if (baseY <= 0) y = 0;
    if (baseY + baseH >= canvas.height) y = canvas.height - h;
  }

  return { x, y, w, h };
}

function findHitArea(x, y, clickableAreas, canvas) {
  // zIndex降順で
  const sorted = clickableAreas.slice().sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
  for (const area of sorted) {
    // 必要ならusable判定もここで
    const usable = area.usable === undefined ? true : typeof area.usable === "function" ? area.usable() : area.usable;

    if (!usable) continue; // 使えないエリアは判定しない
    const { x: ax, y: ay, w: aw, h: ah } = getAreaDrawRect(area, canvas);
    if (x >= ax && x <= ax + aw && y >= ay && y <= ay + ah) {
      return area; // 最初にヒットしたものだけ返す！
    }
  }
  return null;
}

let hoveredAreaIndex = null; // 今hoverしてるエリア（なければnull）
canvas.addEventListener("mousemove", function (e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const room = rooms[gameState.currentRoom];
  const area = findHitArea(x, y, room.clickableAreas, canvas);
  const idx = area ? room.clickableAreas.indexOf(area) : null;
  if (hoveredAreaIndex !== idx) {
    hoveredAreaIndex = idx;
    renderCanvasRoom();
  }
});

canvas.addEventListener("mouseout", function () {
  if (hoveredAreaIndex !== null) {
    hoveredAreaIndex = null;
    renderCanvasRoom();
  }
});

canvas.addEventListener("click", function (e) {
  // 入力ロック中はクリック無効（演出中など）
  if (gameState.fx && gameState.fx.lockInput) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  // ★今いる部屋のエリアだけ判定！
  const room = rooms[gameState.currentRoom];
  const area = findHitArea(x, y, room.clickableAreas, canvas);

  // if (area) {
  //     handleAreaClick(area.action, e);
  // }
  if (area) {
    if (typeof area.onClick === "function") {
      area.onClick(e);
      playSE("se-click");
    } else if (area.action) {
      handleAreaClick(area.action, e); // 互換のために残してもOK
    }
  }
});

function changeRoom(roomId) {
  const prevRoom = gameState.currentRoom;

  gameState.currentRoom = roomId;
  const room = rooms[roomId];
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (roomId === "end" && gameState.tvDinner?.flags?.backgroundState === 0) {
    const endFlags = gameState.end?.flags || (gameState.end = { flags: { backgroundState: 0 } }).flags;
    endFlags.backgroundState = 0;
  }

  if (roomId === "end" || roomId === "restaurant") {
    removeItemsOnEndingArrival(["key", "remocon", "cushion", "scale", "daikonkun", "memoSafe"]);
  }

  // 背景＋アイテム＋クリックエリアをcanvasで全部再描画
  renderCanvasRoom();
  const msg = room.name && room.name.trim() !== "" ? `${room.name}です。${room.description}` : room.description;
  if (roomId === "trueEnd") {
    updateMessageHTML(msg);
  } else {
    updateMessage(msg);
  }

  // BGM切替はそのまま
  if (roomId === "trueEnd") {
    changeBGM(S40("playback_eighties.mp3"));
  } else if (roomId === "end") {
    const endBgState = gameState.end?.flags?.backgroundState ?? 0;
    changeBGM(endBgState === 0 ? S40("midnight_party.mp3") : S40("tabiyukeba.mp3"));
  } else if (roomId === "rainEnd") {
    changeBGM(S40("Echo_In_The_Rain.mp3"));
  } else {
    changeBGM(DEFAULT_BGM);
  }

  // nav

  if (roomId === "trueEnd" || roomId === "end" || roomId === "rainEnd") {
    gameState.openRooms = [];
    // renderNavigation();
  }
  renderNavigation();
}

const END_IDS = new Set(["end", "trueEnd", "rainEnd"]);

// ===== changeRoom フック：=====
const _changeRoom_custom = changeRoom;
changeRoom = function (roomId) {
  if (roomId === "rainEnd") {
    const rainEndFlags = gameState.rainEnd?.flags || (gameState.rainEnd = { flags: { backgroundState: 0 } }).flags;
    rainEndFlags.backgroundState = gameState.main.flags.gaveSweetToBearFairy ? 2 : gameState.inventory.includes("sweet") ? 1 : 0;
  }
  _changeRoom_custom.apply(this, arguments);

  if (END_IDS.has(roomId)) {
    const elapsed = Math.round((Date.now() - ANA.start) / 1000);
    ANA.endTimes = ANA.endTimes || {};
    if (!ANA.endTimes[roomId]) ANA.endTimes[roomId] = elapsed;

    const isTrue = roomId === "trueEnd";
    ANA.send("ending_reached", {
      ending_id: roomId,
      is_true: isTrue,
      elapsed_sec: elapsed,
      hints: ANA.hintCount,
    });
    // setTimeout(() => showFeedbackModal(roomId), 1500);
  }
};

function renderCanvasRoom() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const roomId = gameState.currentRoom;
  const room = rooms[roomId];
  const bgImgSrc = getRoomBackgroundImage(roomId, gameState);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景描画
  const bgImg = loadedImages[bgImgSrc];
  if (bgImg && bgImg.complete) {
    ctx.save();
    const phase = gameState.main?.flags?.timePhase ?? 0;
    const isNight = phase === 2;
    if (isNight) {
      ctx.filter = "saturate(0.3) brightness(0.6)"; // 背景はちょい暗め
    } else {
      ctx.filter = "none";
    }
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // アイテム描画（未取得のみ）
  drawRoomItems(ctx, canvas, roomId);
  drawFanSpinLines(ctx, canvas, roomId);
  drawClickableAreaGlows(ctx, canvas, roomId);
  drawDeskDrawerOpenFx(ctx, canvas, roomId);
  drawCabinetTopOpenFx(ctx, canvas, roomId);

  drawLockerDoorFx(ctx, canvas, roomId);

  drawMainWindowSkyOverlay(ctx, canvas, roomId);

  // ★ ここから重なり優先のhover枠線を描画
  if (hoveredAreaIndex !== null && hoveredAreaIndex !== undefined) {
    // zIndex降順でソート
    const sortedAreas = room.clickableAreas
      .map((area, i) => ({ ...area, __idx: i }))
      .filter((area) => (area.usable === undefined ? true : typeof area.usable === "function" ? area.usable() : area.usable))
      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
    // hoveredAreaIndexと一致するエリアをzIndex順で1つだけ枠描画
    const hoverArea = sortedAreas.find((area) => area.__idx === hoveredAreaIndex);
    if (hoverArea) {
      const { x: ax, y: ay, w: aw, h: ah } = getAreaDrawRect(hoverArea, canvas);
      ctx.save();
      ctx.strokeStyle = "gold";
      ctx.lineWidth = 2;
      ctx.strokeRect(ax, ay, aw, ah);
      ctx.restore();
    }
  }

  if (DEV_MODE) {
    ctx.save();
    ctx.lineWidth = 2;

    room.clickableAreas.forEach((a) => {
      ctx.strokeStyle = "rgba(255,0,0,0.8)";
      ctx.fillStyle = "rgba(255,0,0,0.35)";
      ctx.font = "14px sans-serif";
      const px = (a.x / 100) * canvas.width;
      const py = (a.y / 100) * canvas.height;
      const pw = (a.width / 100) * canvas.width;
      const ph = (a.height / 100) * canvas.height;

      // 半透明の枠
      ctx.fillRect(px, py, pw, ph);
      ctx.strokeRect(px, py, pw, ph);

      // description 表示
      if (a.description) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(px, py - 18, ctx.measureText(a.description).width + 8, 18);

        ctx.fillStyle = "white";
        ctx.fillText(a.description, px + 4, py - 4);
      }
    });

    ctx.restore();
  }
}

function drawClickableAreaGlows(ctx, canvas, roomId) {
  const room = rooms[roomId];
  if (!room?.clickableAreas) return;

  room.clickableAreas.forEach((area) => {
    const shouldGlow = typeof area.glowWhen === "function" ? area.glowWhen() : !!area.glowWhen;
    if (!shouldGlow) return;

    const { x, y, w, h } = getAreaDrawRect(area, canvas);
    const insetX = Math.max(1, w * 0.08);
    const insetY = Math.max(1, h * 0.04);
    const color = area.glowColor || "255, 255, 238";

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.shadowColor = `rgba(${color}, 1)`;
    ctx.shadowBlur = Math.max(18, Math.min(w, h) * 1.35);

    const glow = ctx.createLinearGradient(x, y, x + w, y);
    glow.addColorStop(0, `rgba(${color}, 0.18)`);
    glow.addColorStop(0.5, `rgba(${color}, 0.70)`);
    glow.addColorStop(1, `rgba(${color}, 0.18)`);
    ctx.fillStyle = glow;
    ctx.fillRect(x + insetX, y + insetY, Math.max(1, w - insetX * 2), Math.max(1, h - insetY * 2));

    ctx.strokeStyle = `rgba(${color}, 0.58)`;
    ctx.lineWidth = Math.max(1, Math.min(w, h) * 0.07);
    ctx.strokeRect(x + insetX, y + insetY, Math.max(1, w - insetX * 2), Math.max(1, h - insetY * 2));

    if (area.glowCheck !== false) {
      const checkSize = Math.max(18, Math.min(58, Math.min(w * 0.9, h * 0.55)));
      ctx.shadowColor = "rgba(0, 225, 255, 1)";
      ctx.shadowBlur = Math.max(10, checkSize * 0.38);
      ctx.fillStyle = "#20e6ff";
      ctx.strokeStyle = "rgba(0, 92, 255, 0.95)";
      ctx.lineWidth = Math.max(1.5, checkSize * 0.06);
      ctx.font = `900 ${checkSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeText("✓", x + w / 2, y + h / 2);
      ctx.fillText("✓", x + w / 2, y + h / 2);
    }
    ctx.restore();
  });
}

function drawRoomItems(ctx, canvas, roomId) {
  const room = rooms[roomId];
  const fx = gameState.fx || {};

  // 通常のアイテム（演出中のカニだけスキップ）
  room.clickableAreas.forEach((area) => {
    if (area.item && area.item.visible && area.item.visible()) {
      const key = typeof area.item.img === "function" ? area.item.img() : area.item.img;

      const img = loadedImages[IMAGES.items[key]];
      if (img && img.complete && img.naturalWidth > 0) {
        const alpha = area.alpha ? area.alpha : 1;
        let { x: px, y: py, w, h } = getAreaDrawRect(area, canvas);
        ctx.save();
        ctx.globalAlpha = alpha;

        // ★ 夜モードなら彩度＋明るさを落とす
        const phase = gameState.main?.flags?.timePhase ?? 0;
        const isNight = phase === 2;
        if (isNight) {
          // 値は好みで調整
          ctx.filter = "saturate(0.4) brightness(0.8)";
        } else {
          ctx.filter = "none";
        }

        const daemonBearFx = roomId === "entrance" && key === "daemonBear" ? fx.daemonBearFloatIn : null;
        if (daemonBearFx?.roomId === "entrance") {
          const t = Math.max(0, Math.min(1, Number(daemonBearFx.progress) || 0));
          const eased = easeOutCubic(t);
          const spiralRadiusX = canvas.width * 0.16 * (1 - t);
          const spiralRadiusY = canvas.height * 0.08 * (1 - t);
          const spiralAngle = t * Math.PI * 7.5 - Math.PI / 2;
          const spiralX = Math.cos(spiralAngle) * spiralRadiusX;
          const spiralY = Math.sin(spiralAngle) * spiralRadiusY;
          ctx.globalAlpha = alpha * (0.42 + 0.58 * t);
          py = -h - canvas.height * 0.04 + (py + h + canvas.height * 0.04) * eased + spiralY;
          px += spiralX;
        }

        // ★ drawRoomItems 内：ctx.drawImage(img, px, py, w, h); を置き換え
        const rotDeg = area.item && typeof area.item.rotateDeg === "function" ? area.item.rotateDeg() : area.item ? area.item.rotateDeg : 0;

        if (rotDeg) {
          const rad = (rotDeg * Math.PI) / 180;
          const cx = px + w / 2;
          const cy = py + h / 2;

          ctx.translate(cx, cy);
          ctx.rotate(rad);
          ctx.drawImage(img, -w / 2, -h / 2, w, h);
        } else {
          ctx.drawImage(img, px, py, w, h);
        }

        // ctx.drawImage(img, px, py, w, h);
        ctx.restore();
      }
    }
  });
}

function drawFanSpinLines(ctx, canvas, roomId) {
  if (roomId !== "mainDesk" || !gameState.main?.flags?.fanCleaned) return;

  const room = rooms[roomId];
  const area = room?.clickableAreas?.find((a) => a.description === "扇風機の円形部分");
  if (!area) return;

  const { x, y, w, h } = getAreaDrawRect(area, canvas);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const radius = Math.min(w, h) * 0.46;
  const innerRadius = radius * 0.22;

  ctx.save();
  ctx.lineCap = "round";

  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 7 + (i * Math.PI * 2) / 6;
    const start = angle - Math.PI / 9;
    const end = angle + Math.PI / 9;

    ctx.globalAlpha = 0.74;
    ctx.strokeStyle = "rgba(20, 34, 42, 0.78)";
    ctx.lineWidth = Math.max(2.4, radius * 0.13);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start, end);
    ctx.stroke();

    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.96)";
    ctx.lineWidth = Math.max(1.4, radius * 0.075);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start, end);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.92;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = Math.max(1.4, radius * 0.055);
  for (let i = 0; i < 3; i++) {
    const angle = Math.PI / 5 + (i * Math.PI * 2) / 3;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * innerRadius, cy + Math.sin(angle) * innerRadius);
    ctx.lineTo(cx + Math.cos(angle) * radius * 0.85, cy + Math.sin(angle) * radius * 0.85);
    ctx.stroke();
  }

  ctx.restore();
}

function drawMainWindowSkyOverlay(ctx, canvas, roomId) {
  if (roomId !== "mainWindow") return;
  const skyState = Number(gameState.main?.flags?.weatherSkyState) || 0;
  if (skyState <= 0) return;

  const key = skyState === 1 ? "sky1" : "sky2";
  const img = loadedImages[IMAGES.items[key]];
  if (!img || !img.complete || img.naturalWidth <= 0) return;

  ctx.save();
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function playLockerDoorOpenFx(roomId, areaDescription, options = {}) {
  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;
  fx.lockerDoorOpen = {
    roomId,
    areaDescription,
    progress: 0,
    hingeSide: options.hingeSide || "right",
    panelColors: options.panelColors,
    gripStyle: options.gripStyle,
    gripColor: options.gripColor,
  };

  playSE?.(options.soundId || "se-gacha");
  renderCanvasRoom?.();

  const duration = options.duration || 850;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.lockerDoorOpen;
    if (!currentFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      options.onDone?.();
      return;
    }

    const t = Math.min(1, (now - start) / duration);
    currentFx.progress = t;
    renderCanvasRoom?.();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.lockerDoorOpen;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
    options.onDone?.();
  };

  requestAnimationFrame(tick);
}

function drawLockerDoorFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.lockerDoorOpen;
  if (!fx || fx.roomId !== roomId) return;

  const rect = getAreaRectPx(roomId, fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, fx.progress || 0));
  const openEase = Math.sin(t * Math.PI);
  const visibleRatio = Math.max(0.08, 1 - openEase * 0.92);
  const panelW = rect.w * visibleRatio;
  const hingeSide = fx.hingeSide === "left" ? "left" : "right";
  const panelX = hingeSide === "left" ? rect.x : rect.x + rect.w - panelW;
  const hingeW = Math.max(3, rect.w * 0.05);
  const shadowW = rect.w * 0.22 * openEase;
  const woodBase = ctx.createLinearGradient(panelX, rect.y, panelX + panelW, rect.y);
  const panelColors = Array.isArray(fx.panelColors) && fx.panelColors.length === 3 ? fx.panelColors : ["#b98e68", "#D1A781", "#a77d59"];
  const gripStyle = fx.gripStyle === "roundTop" || fx.gripStyle === "slimSilver" ? fx.gripStyle : "capsule";
  const gripColor = fx.gripColor || "#6f7982";
  woodBase.addColorStop(0, panelColors[0]);
  woodBase.addColorStop(0.45, panelColors[1]);
  woodBase.addColorStop(1, panelColors[2]);

  ctx.save();

  if (openEase > 0.02) {
    const cavity = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y);
    cavity.addColorStop(0, "rgba(8, 4, 2, 0.98)");
    cavity.addColorStop(0.55, "rgba(16, 9, 5, 0.94)");
    cavity.addColorStop(1, "rgba(26, 14, 8, 0.88)");
    ctx.fillStyle = cavity;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    if (hingeSide === "left") {
      ctx.fillRect(rect.x, rect.y, shadowW, rect.h);
    } else {
      ctx.fillRect(rect.x + rect.w - shadowW, rect.y, shadowW, rect.h);
    }
  }

  ctx.fillStyle = woodBase;
  ctx.fillRect(panelX, rect.y, panelW, rect.h);

  ctx.strokeStyle = "rgba(52, 26, 10, 0.95)";
  ctx.lineWidth = Math.max(2, rect.w * 0.03);
  ctx.strokeRect(panelX, rect.y, panelW, rect.h);

  ctx.fillStyle = "#7f8a95";
  ctx.fillRect(hingeSide === "left" ? rect.x : rect.x + rect.w - hingeW, rect.y, hingeW, rect.h);

  const gripH = gripStyle === "slimSilver" ? Math.max(18, rect.h * 0.34) : Math.max(14, rect.h * 0.165);
  const gripW = gripStyle === "slimSilver" ? Math.max(4, rect.w * 0.055) : Math.max(5, rect.w * 0.11);
  const gripInset = Math.max(rect.w * 0.1, panelW * 0.14);
  const gripX = hingeSide === "left" ? panelX + panelW - gripInset - gripW : panelX + gripInset;
  const gripY = gripStyle === "roundTop" ? rect.y + rect.h * 0.08 : gripStyle === "slimSilver" ? rect.y + rect.h * 0.24 : rect.y + (rect.h - gripH) / 2 + rect.h * 0.03;
  const gripR = Math.max(2, gripW * 0.45);

  if (gripStyle === "roundTop") {
    const knobR = Math.max(5, gripW * 0.58);
    const knobCx = gripX + gripW / 2;
    const knobCy = gripY + knobR;
    ctx.fillStyle = gripColor;
    ctx.beginPath();
    ctx.arc(knobCx, knobCy, knobR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = Math.max(1, knobR * 0.15);
    ctx.beginPath();
    ctx.arc(knobCx - knobR * 0.12, knobCy - knobR * 0.12, knobR * 0.72, Math.PI * 1.1, Math.PI * 1.8);
    ctx.stroke();
  } else {
    if (gripStyle === "slimSilver") {
      const metal = ctx.createLinearGradient(gripX, gripY, gripX + gripW, gripY);
      metal.addColorStop(0, "#7f858b");
      metal.addColorStop(0.35, gripColor);
      metal.addColorStop(0.7, "#f7f9fb");
      metal.addColorStop(1, "#8b9299");
      ctx.fillStyle = metal;
    } else {
      ctx.fillStyle = gripColor;
    }
    roundRect(ctx, gripX, gripY, gripW, gripH, gripR, true, false);

    ctx.fillStyle = gripStyle === "slimSilver" ? "#858c93" : "#58626b";
    ctx.beginPath();
    ctx.arc(gripX + gripW / 2, gripY, gripW * 0.55, 0, Math.PI * 2);
    ctx.arc(gripX + gripW / 2, gripY + gripH, gripW * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
    ctx.lineWidth = Math.max(1, gripW * 0.18);
    ctx.beginPath();
    ctx.moveTo(gripX + gripW * 0.28, gripY + gripW * 0.2);
    ctx.lineTo(gripX + gripW * 0.28, gripY + gripH - gripW * 0.2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDeskDrawerOpenFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.deskDrawerOpen;
  if (!fx || fx.roomId !== roomId) return;

  const rect = getAreaRectPx(roomId, fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const slidePx = Math.max(12, rect.h * 0.32) * easeOutCubic(t);
  if (slidePx <= 0) return;

  const insetX = Math.max(3, rect.w * 0.03);
  const insetY = Math.max(2, rect.h * 0.04);
  const cavityH = Math.max(8, Math.min(rect.h * 0.55, Math.max(12, rect.h * 0.32) + rect.h * 0.18));
  const frontY = rect.y + slidePx;
  const frontRadius = Math.max(2, rect.h * 0.08);
  const frontStroke = "rgba(191, 156, 126, 0.28)";
  const highlightStroke = "rgba(255,255,255,0.16)";
  const cavityColor = "rgb(22, 14, 9)";
  const cavityStroke = "rgba(255, 220, 160, 0.14)";
  const frontFill = fx.frontFill || "#996641";
  const sideTop = fx.sideTop || "#ab7650";
  const sideBottom = fx.sideBottom || "#a06d49";
  const gripStyle = fx.gripStyle || "pull";
  const gripColor = fx.gripColor || "#4C4241";

  ctx.save();

  ctx.fillStyle = cavityColor;
  roundRect(ctx, rect.x + insetX, rect.y + insetY, rect.w - insetX * 2, Math.min(rect.h - insetY * 2, cavityH), Math.max(2, rect.h * 0.08), true, false);

  ctx.strokeStyle = cavityStroke;
  ctx.lineWidth = 1;
  roundRect(ctx, rect.x + insetX, rect.y + insetY, rect.w - insetX * 2, Math.min(rect.h - insetY * 2, cavityH), Math.max(2, rect.h * 0.08), false, true);

  const sideColor = ctx.createLinearGradient(rect.x, frontY, rect.x, frontY + rect.h);
  sideColor.addColorStop(0, sideTop);
  sideColor.addColorStop(1, sideBottom);
  ctx.fillStyle = sideColor;
  ctx.fillRect(rect.x + rect.w * 0.06, frontY + rect.h * 0.55, rect.w * 0.88, Math.max(6, rect.h * 0.12));

  ctx.shadowColor = "rgba(0,0,0,0.28)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = Math.max(1, rect.h * 0.05);
  ctx.fillStyle = frontFill;
  ctx.strokeStyle = frontStroke;
  ctx.lineWidth = 1;
  roundRect(ctx, rect.x, frontY, rect.w, rect.h, frontRadius, true, true);

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = highlightStroke;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rect.x + 2, frontY + 2);
  ctx.lineTo(rect.x + rect.w - 2, frontY + 2);
  ctx.stroke();

  const gripW = Math.max(10, rect.w * 0.22);
  const gripH = Math.max(6, rect.h * 0.22);
  const gripX = rect.x + rect.w / 2 - gripW / 2;
  const gripY = frontY + Math.max(4, rect.h * 0.12);
  if (gripStyle === "recessed") {
    const gripWidthRatio = Number(fx.gripWidthRatio) || 0.32;
    const recessedW = Math.max(12, rect.w * gripWidthRatio);
    const recessedH = Math.max(3, rect.h * 0.16);
    const recessedX = rect.x + rect.w / 2 - recessedW / 2;
    const recessedY = frontY + rect.h * 0.36 - recessedH / 2;
    const recessedR = Math.max(2, recessedH * 0.45);

    ctx.shadowColor = "rgba(0,0,0,0.36)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = Math.max(1, rect.h * 0.03);
    ctx.fillStyle = gripColor;
    roundRect(ctx, recessedX, recessedY, recessedW, recessedH, recessedR, true, false);

    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(recessedX + recessedR, recessedY + 1);
    ctx.lineTo(recessedX + recessedW - recessedR, recessedY + 1);
    ctx.stroke();

    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.moveTo(recessedX + recessedR, recessedY + recessedH - 1);
    ctx.lineTo(recessedX + recessedW - recessedR, recessedY + recessedH - 1);
    ctx.stroke();

    ctx.restore();
    return;
  }

  const gripInset = Math.max(2, gripW * 0.16);
  const gripFlare = Math.max(1.5, gripW * 0.1);
  const gripBottomY = gripY + gripH;
  const gripMidY = gripY + gripH * 0.28;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1.2, rect.h * 0.045);
  ctx.strokeStyle = gripColor;
  ctx.beginPath();
  ctx.moveTo(gripX, gripY);
  ctx.quadraticCurveTo(gripX - gripFlare, gripY + gripH * 0.04, gripX - gripFlare * 0.7, gripMidY);
  ctx.quadraticCurveTo(gripX - gripFlare * 0.2, gripBottomY, gripX + gripInset, gripBottomY);
  ctx.lineTo(gripX + gripW - gripInset, gripBottomY);
  ctx.quadraticCurveTo(gripX + gripW + gripFlare * 0.2, gripBottomY, gripX + gripW + gripFlare * 0.7, gripMidY);
  ctx.quadraticCurveTo(gripX + gripW + gripFlare, gripY + gripH * 0.04, gripX + gripW, gripY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(gripX + 1, gripY + 0.5);
  ctx.quadraticCurveTo(gripX - gripFlare * 0.45, gripY + gripH * 0.12, gripX + gripInset * 0.7, gripBottomY - 0.8);
  ctx.moveTo(gripX + gripInset * 0.9, gripBottomY - 0.8);
  ctx.lineTo(gripX + gripW - gripInset * 0.9, gripBottomY - 0.8);
  ctx.moveTo(gripX + gripW - 1, gripY + 0.5);
  ctx.quadraticCurveTo(gripX + gripW + gripFlare * 0.45, gripY + gripH * 0.12, gripX + gripW - gripInset * 0.7, gripBottomY - 0.8);
  ctx.stroke();

  ctx.restore();
}

function drawCabinetTopOpenFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.cabinetTopOpen;
  if (!fx || fx.roomId !== roomId) return;

  const rect = getAreaRectPx(roomId, fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const eased = easeOutCubic(t);
  if (eased <= 0) return;

  const insetX = Math.max(4, rect.w * 0.025);
  const insetY = Math.max(3, rect.h * 0.05);
  const radius = Math.max(3, rect.h * 0.08);
  const topY = rect.y;
  const bottomY = rect.y + rect.h * (1 - 0.32 * eased);
  const bottomOutset = rect.w * 0.22 * eased;

  ctx.save();

  ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, radius, true, false);

  const cavity = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
  cavity.addColorStop(0, "rgba(22, 14, 9, 0.96)");
  cavity.addColorStop(1, "rgba(8, 5, 4, 0.96)");
  ctx.fillStyle = cavity;
  roundRect(ctx, rect.x + insetX, rect.y + insetY, rect.w - insetX * 2, rect.h - insetY * 2, radius, true, false);
  ctx.strokeStyle = "rgba(255, 220, 160, 0.16)";
  ctx.lineWidth = 1;
  roundRect(ctx, rect.x + insetX, rect.y + insetY, rect.w - insetX * 2, rect.h - insetY * 2, radius, false, true);

  ctx.shadowColor = "rgba(0,0,0,0.32)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = Math.max(2, rect.h * 0.06);

  const frontFill = fx.frontFill || null;
  if (frontFill) {
    ctx.fillStyle = frontFill;
  } else {
    const doorColor = ctx.createLinearGradient(rect.x, topY, rect.x, bottomY);
    doorColor.addColorStop(0, "#9aa3ab");
    doorColor.addColorStop(0.5, "#869099");
    doorColor.addColorStop(1, "#6f7a84");
    ctx.fillStyle = doorColor;
  }
  ctx.strokeStyle = "rgba(48, 56, 64, 0.95)";
  ctx.lineWidth = Math.max(1.4, rect.h * 0.035);
  ctx.beginPath();
  ctx.moveTo(rect.x, topY);
  ctx.lineTo(rect.x + rect.w, topY);
  ctx.lineTo(rect.x + rect.w + bottomOutset, bottomY);
  ctx.lineTo(rect.x - bottomOutset, bottomY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rect.x + 2, topY + 2);
  ctx.lineTo(rect.x + rect.w - 2, topY + 2);
  ctx.stroke();

  const gripW = Math.max(24, rect.w * 0.32);
  const gripH = Math.max(3, rect.h * 0.06);
  const gripX = rect.x + rect.w / 2 - gripW / 2;
  const gripY = topY + (bottomY - topY) * 0.66;
  ctx.fillStyle = "#C9D4D8";
  roundRect(ctx, gripX, gripY, gripW, gripH, Math.max(3, gripH * 0.45), true, false);

  ctx.restore();
}

// ===== 演出ユーティリティ =====
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function getAreaRectPx(roomId, areaDescription, canvas) {
  const room = rooms[roomId];
  const area = room?.clickableAreas?.find((a) => a.description === areaDescription);
  if (!area) return null;
  return {
    x: (area.x / 100) * canvas.width,
    y: (area.y / 100) * canvas.height,
    w: (area.width / 100) * canvas.width,
    h: (area.height / 100) * canvas.height,
  };
}

function getRoomBackgroundImage(roomId, gameState) {
  let imgList = IMAGES.rooms[roomId]; // ★ const → let

  // ★ book1〜3みたいに {jp:[], en:[]} 形式なら言語で選ぶ
  if (imgList && !Array.isArray(imgList) && (imgList.jp || imgList.en)) {
    imgList = imgList[uiLang] || imgList.jp || imgList.en;
  }

  // 単一画像ならそのまま
  if (!Array.isArray(imgList)) {
    return imgList;
  }

  const state = gameState[roomId]?.flags?.backgroundState ?? 0;
  return imgList[state] || imgList[0];
}

// 小物ユーティリティ
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (typeof r === "number") r = { tl: r, tr: r, br: r, bl: r };
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// フラッシュレイヤを用意
(function ensureFlashLayer() {
  if (!document.getElementById("fxFlash")) {
    const d = document.createElement("div");
    d.id = "fxFlash";
    document.body.appendChild(d);
  }
})();

// 画面フラッシュ（type: 'white' | 'red' | 'black'）
function flashScreen(type = "white", duration = 650) {
  const f = document.getElementById("fxFlash");
  if (!f) return;
  f.style.animation = "none";
  void f.offsetHeight;
  const key = type === "red" ? "flashRed" : type === "black" ? "flashBlack" : "flashWhite";
  f.style.animation = `${key} ${duration}ms ease-out 1`;
}

// 画面揺れ
function screenShake(el = document.documentElement, ms = 120, cls = "fx-shake") {
  if (!el) return;
  // 連打でも必ず発火させる
  el.classList.remove(cls);
  void el.offsetHeight; // reflow
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}

function acquireItemOnce(flagKey, itemId, title, imgSrc, msg, onAfterClose) {
  const f = gameState.main.flags;
  if (f[flagKey]) {
    if (itemId == "dish") {
      updateMessage("お皿が重ねられている");
    } else {
      updateMessage("もう何もない");
    }

    return;
  }
  f[flagKey] = true;
  addItem(itemId);
  renderCanvasRoom();

  const afterClose = () => {
    onAfterClose?.();
  };

  showModal(title, `<img src="${imgSrc}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }], afterClose);
  updateMessage(msg);
}

function playDeskDrawerOpenFx(roomId, areaDescription, options = {}) {
  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;
  fx.deskDrawerOpen = {
    roomId,
    areaDescription,
    progress: 0,
    frontFill: options.frontFill,
    sideTop: options.sideTop,
    sideBottom: options.sideBottom,
    gripStyle: options.gripStyle,
    gripColor: options.gripColor,
    gripWidthRatio: options.gripWidthRatio,
  };

  playSE?.(options.soundId || "se-gacha");
  renderCanvasRoom?.();

  const duration = options.duration || 850;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.deskDrawerOpen;
    if (!currentFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      options.onDone?.();
      return;
    }

    const t = Math.min(1, (now - start) / duration);
    currentFx.progress = t;
    renderCanvasRoom?.();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    if (options.keepOpen) {
      currentFx.progress = 1;
      if (!options.keepInputLocked) gameState.fx.lockInput = false;
      renderCanvasRoom?.();
      options.onDone?.();
      return;
    }

    delete gameState.fx.deskDrawerOpen;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
    options.onDone?.();
  };

  requestAnimationFrame(tick);
}

function playDeskDrawerCloseFx(roomId, areaDescription, options = {}) {
  const fx = gameState.fx || (gameState.fx = {});
  const drawerFx = fx.deskDrawerOpen;
  if (!drawerFx || drawerFx.roomId !== roomId || drawerFx.areaDescription !== areaDescription) {
    fx.lockInput = false;
    options.onDone?.();
    return;
  }

  fx.lockInput = true;
  playSE?.(options.soundId || "se-hikidashi");

  const duration = options.duration || 650;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.deskDrawerOpen;
    if (!currentFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      options.onDone?.();
      return;
    }

    const t = Math.min(1, (now - start) / duration);
    currentFx.progress = 1 - easeOutCubic(t);
    renderCanvasRoom?.();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.deskDrawerOpen;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
    options.onDone?.();
  };

  requestAnimationFrame(tick);
}

function handleProjectorCodeClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.projectorPowerOn) {
    updateMessage("延長コードは接続されている。");
    return;
  }

  if (gameState.selectedItem !== "powerCode") {
    updateMessage("プロジェクターのコードがコンセントまで届かない。");
    return;
  }

  removeItem("powerCode");
  f.projectorPowerOn = true;
  markProgress?.("projector_power_on");
  playSE?.("se-mouse");
  renderCanvasRoom?.();
  showObj(null, "延長コードを接続した", IMAGES.modals.codeConnect, "延長コードを接続した。");
}

function handleMainDoorBookClick() {
  const description = "「日本の言い伝え」という本がある。";
  const content = `<img src="${IMAGES.modals.book}" alt="日本の言い伝えの本" class="showobj-image">`;

  showModal(
    description,
    content,
    [
      {
        text: "読む",
        action: () => {
          const pageImgId = `bookTeruteru_${Date.now()}`;
          const pageSrc = uiLang === "en" ? IMAGES.modals.bookTeruteruEn : IMAGES.modals.bookTeruteru;
          window._nextModal = {
            title: "日本の言い伝え",
            content: `<img id="${pageImgId}" src="${pageSrc}" alt="日本の言い伝えの本文" class="showobj-image">`,
            buttons: [
              {
                text: "🌐 EN/JP",
                action: () => {
                  const pageImg = document.getElementById(pageImgId);
                  if (!pageImg) return;
                  uiLang = uiLang === "en" ? "jp" : "en";
                  pageImg.src = uiLang === "en" ? IMAGES.modals.bookTeruteruEn : IMAGES.modals.bookTeruteru;
                },
              },
              { text: "閉じる", action: "close" },
            ],
          };
          closeModal();
        },
      },
      { text: "閉じる", action: "close" },
    ],
    null,
    { contentClass: "showobj-modal" },
  );
  updateMessage(description);
}

function handleMainDoorBearSweetClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.gaveSweetToBearFairy) {
    updateMessage("クマ妖精はもう七夕ゼリーを食べた。");
    return;
  }

  removeItem("sweet");
  f.gaveSweetToBearFairy = true;
  markProgress?.("gave_sweet_to_bear_fairy");
  playSE?.("se-eat");
  renderCanvasRoom?.();

  const content = `
    <div class="modal-anim">
      <img src="${IMAGES.modals.bearReceive}" alt="七夕ゼリーを受け取るクマ妖精">
      <img src="${IMAGES.modals.bearEat}" alt="七夕ゼリーを食べるクマ妖精">
    </div>
  `;
  showModal("クマ妖精に七夕ゼリーを渡した", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("クマ妖精は七夕ゼリーをあっという間に完食した");
}

function handleMainDoorCabinetClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainDoorCabinet) {
    playSE?.("se-door-close");
    if (f.foundMainDoorCabinetKey) {
      updateMessage("もう何もない");
      return;
    }
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
      return;
    }

    f.foundMainDoorCabinetKey = true;
    markProgress?.("found_main_door_cabinet_key");
    addItem("key");
    renderCanvasRoom?.();
    showObj(null, "キャビネットの中", IMAGES.items.key, "カギを手に入れた。");
    return;
  }

  const squareStyle = ["width:min(20vw, 78px)", "height:min(20vw, 78px)", "min-width:54px", "min-height:54px", "border:2px solid #777", "border-radius:3px", "background:#fff", "padding:0", "cursor:pointer", "box-shadow:0 2px 5px rgba(0,0,0,0.2)"].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
        <button id="mainDoorCabinetUp" type="button" aria-label="上のボタン" style="${squareStyle}"></button>
        <button id="mainDoorCabinetDown" type="button" aria-label="下のボタン" style="${squareStyle}"></button>
      </div>
      <button id="mainDoorCabinetOk" class="ok-btn" type="button">OK</button>
      <div id="mainDoorCabinetHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネット", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("キャビネットがロックされている。");

  setTimeout(() => {
    const upBtn = document.getElementById("mainDoorCabinetUp");
    const downBtn = document.getElementById("mainDoorCabinetDown");
    const okBtn = document.getElementById("mainDoorCabinetOk");
    const hintEl = document.getElementById("mainDoorCabinetHint");
    if (!upBtn || !downBtn || !okBtn || !hintEl) return;

    let inputs = Array.isArray(f.mainDoorCabinetInputs) ? f.mainDoorCabinetInputs.filter((value) => value === "up" || value === "down") : [];

    const press = (value, button) => {
      inputs.push(value);
      f.mainDoorCabinetInputs = inputs.slice();
      hintEl.textContent = `${inputs.length}回入力`;
      playSE?.("se-pi");
      button.style.background = "#d8d8d8";
      setTimeout(() => {
        if (button.isConnected) button.style.background = "#fff";
      }, 100);
    };

    upBtn.addEventListener("click", () => press("up", upBtn));
    downBtn.addEventListener("click", () => press("down", downBtn));
    okBtn.addEventListener("click", () => {
      const answer = ["down", "up", "up", "down", "up"];
      const isCorrect = inputs.length === answer.length && inputs.every((value, index) => value === answer[index]);
      if (isCorrect) {
        f.unlockMainDoorCabinet = true;
        f.mainDoorCabinetInputs = [];
        markProgress?.("unlock_main_door_cabinet");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("キャビネットのロックが外れた。");
        return;
      }

      inputs = [];
      f.mainDoorCabinetInputs = [];
      playSE?.("se-error");
      hintEl.textContent = "違うようだ。入力がリセットされた。";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    if (inputs.length > 0) hintEl.textContent = `${inputs.length}回入力済み`;
  }, 0);
}

function syncSenkoBlownFlag(flags) {
  if (!flags) return false;
  flags.senkoBlown = !!flags.senkoBurned && !!flags.fanCleaned;
  return flags.senkoBlown;
}

function handleMainDeskFanClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.fanCleaned) {
    updateMessage("扇風機は回っている。");
    return;
  }

  if (gameState.selectedItem !== "mop") {
    updateMessage("扇風機がある。ほこりまみれだ。");
    return;
  }

  removeItem("mop");
  f.fanCleaned = true;
  syncSenkoBlownFlag(f);
  markProgress?.("fan_cleaned");
  renderCanvasRoom?.();
  showObj(null, "扇風機を掃除した", IMAGES.modals.cleanFan, "扇風機のほこりを取った。扇風機は元気に回りだした");
}

function handleMainWindowPlantClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.useFertilizer) {
    updateMessage("植物は元気になって、輝いている。");
    return;
  }

  if (gameState.selectedItem !== "fertilizer") {
    updateMessage("植物はあまり元気が無いようだ");
    return;
  }

  removeItem("fertilizer");
  f.useFertilizer = true;
  markProgress?.("use_fertilizer");
  renderCanvasRoom?.();

  const content = `
    <div class="modal-anim">
      <img src="${IMAGES.modals.plant}" alt="肥料をあげる前の植物">
      <img src="${IMAGES.modals.plantShine}" alt="元気になって輝く植物">
    </div>
  `;
  showModal("肥料を使った", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("植物は元気になった。");
}

function handleMainWindowHookClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.teruteruSet) {
    updateMessage("テルテル坊主がかかっている。");
    return;
  }

  if (gameState.selectedItem !== "teruteru") {
    updateMessage("窓際に小さなフックがある。");
    return;
  }

  removeItem("teruteru");
  f.teruteruSet = true;
  markProgress?.("set_teruteru");
  renderCanvasRoom?.();

  showModal("テルテル坊主をかけた", `<img src="${IMAGES.modals.teruteruSet}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }], startSkyClearSequence);
  updateMessage("テルテル坊主をかけた");
}

function startSkyClearSequence() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.weatherSkyState = 1;
  renderCanvasRoom?.();

  setTimeout(() => {
    f.weatherSkyState = 2;
    flashScreen("white");
    renderCanvasRoom?.();
    showToast?.("雨が止んだようだ");
  }, 900);
}

function showTanzakuLightEvent() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.tanzakuLightEventDone = true;
  markProgress?.("tanzaku_light_event");
  playSE?.("se-fanta");
  renderCanvasRoom?.();

  const content = `
    <div class="modal-anim frames" style="aspect-ratio:1 / 1;">
      <img src="${IMAGES.modals.tanzakuAnim1}" alt="短冊の光 1">
      <img src="${IMAGES.modals.tanzakuAnim2}" alt="短冊の光 2">
      <img src="${IMAGES.modals.tanzakuAnim3}" alt="短冊の光 3">
      <img src="${IMAGES.modals.tanzakuAnim4}" alt="短冊の光 4">
    </div>
  `;
  showModal("短冊の光が…？", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("短冊の光が…？");
}

function handleAnime6RunningBearClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.bearAppear) {
    updateMessage("クマ妖精が現れた。");
    return;
  }

  const content = `
    <div class="modal-anim frames" style="aspect-ratio:1 / 1;">
      <img src="${IMAGES.modals.bearAnim1}" alt="走るクマ妖精 1">
      <img src="${IMAGES.modals.bearAnim2}" alt="走るクマ妖精 2">
      <img src="${IMAGES.modals.bearAnim3}" alt="走るクマ妖精 3">
    </div>
  `;

  showModal("間に合わなかったね。…ん？", content, [{ text: "閉じる", action: "close" }], () => {
    playSE?.("se-fanta");
    const anime6Flags = gameState.anime6?.flags || (gameState.anime6 = { flags: { backgroundState: 0 } }).flags;
    anime6Flags.backgroundState = 1;
    f.bearAppear = true;
    markProgress?.("anime6_bear_appear");
    renderCanvasRoom?.();
    updateMessage("間に合わなかったね。…ん？");
  });
  updateMessage("間に合わなかったね。…ん？");
}

function handleMainDeskCupClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.pourWater) {
    if (f.glassMelodySolved) {
      updateMessage("コップからきれいな音がした。");
      return;
    }
    if (!hasItem("stick")) {
      updateMessage("水が入ったコップが並んでいる。叩いたら音が出るかもしれない。");
      return;
    }
    showGlassMelodyPuzzle();
    return;
  }

  if (gameState.selectedItem !== "jugWater") {
    updateMessage("目盛りが付いたコップがある。中には何も入っていない");
    return;
  }

  removeItem("jugWater");
  f.pourWater = true;
  markProgress?.("pour_water_into_cup");
  playSE?.("se-water");
  renderCanvasRoom?.();
  updateMessage("コップに水を注いだ。");
}

function showGlassMelodyPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const cups = [
    { note: "do", soundId: "se-do", water: 70 },
    { note: "fa", soundId: "se-fa", water: 40 },
    { note: "so", soundId: "se-so", water: 30 },
    { note: "ra", soundId: "se-ra", water: 20 },
  ];
  const content = `
    <div class="glass-melody-panel">
      <div class="glass-melody-row notranslate" translate="no">
        ${cups
          .map(
            (cup, idx) => `
              <button id="glassMelodyCup${idx}" class="glass-melody-button" type="button" aria-label="左から${idx + 1}番目のコップ">
                <span class="glass-melody-cup">
                  <span class="glass-melody-water" style="height:${cup.water}%;"></span>
                  <span class="glass-melody-highlight"></span>
                </span>
              </button>
            `,
          )
          .join("")}
      </div>
      <div id="glassMelodyProgress" class="glass-melody-progress" aria-label="入力回数"></div>
      <button id="glassMelodyReset" class="text-btn" type="button">リセット</button>
      <div id="glassMelodyHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("水の入ったコップ", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("水の量が違う4つのコップが並んでいる。");

  setTimeout(() => {
    const answer = ["do", "do", "fa", "so", "ra", "ra", "ra"];
    const allowedNotes = new Set(cups.map((cup) => cup.note));
    const saved = Array.isArray(f.glassMelodyInputs) ? f.glassMelodyInputs : [];
    const inputs = saved.filter((note) => allowedNotes.has(note)).slice(0, answer.length);
    const cupBtns = cups.map((_, idx) => document.getElementById(`glassMelodyCup${idx}`));
    const resetBtn = document.getElementById("glassMelodyReset");
    const progressEl = document.getElementById("glassMelodyProgress");
    const hintEl = document.getElementById("glassMelodyHint");
    if (cupBtns.some((btn) => !btn) || !resetBtn || !progressEl || !hintEl) return;

    let acceptingInput = inputs.length < answer.length;
    const repaint = () => {
      progressEl.innerHTML = answer.map((_, idx) => `<span class="glass-melody-dot${idx < inputs.length ? " is-filled" : ""}"></span>`).join("");
    };
    const resetInputs = (showMessage) => {
      inputs.length = 0;
      f.glassMelodyInputs = [];
      acceptingInput = true;
      cupBtns.forEach((btn) => {
        btn.disabled = false;
      });
      resetBtn.disabled = false;
      repaint();
      hintEl.textContent = showMessage ? "違うようだ" : "";
    };

    cupBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        if (!acceptingInput) return;
        const cup = cups[idx];
        inputs.push(cup.note);
        f.glassMelodyInputs = inputs.slice();
        playSE?.(cup.soundId);
        btn.classList.remove("is-struck");
        void btn.offsetWidth;
        btn.classList.add("is-struck");
        hintEl.textContent = "";
        repaint();

        if (inputs.length < answer.length) return;
        acceptingInput = false;
        cupBtns.forEach((button) => {
          button.disabled = true;
        });
        resetBtn.disabled = true;

        const isCorrect = inputs.every((note, inputIdx) => note === answer[inputIdx]);
        if (!isCorrect) {
          setTimeout(() => {
            playSE?.("se-error");
            resetInputs(true);
            screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
          }, 350);
          return;
        }

        f.glassMelodySolved = true;
        f.glassMelodyInputs = [];
        removeItem("stick");
        markProgress?.("solve_glass_melody");
        renderCanvasRoom?.();
        setTimeout(() => {
          window._nextModal = {
            title: "メロディ",
            content: `<p style="margin:10px 0; line-height:1.8; text-align:center;">どこからかメロディが流れた。</p>`,
            buttons: [{ text: "閉じる", action: "close" }],
            after: () => playSE?.("se-tanabata-song"),
          };
          closeModal();
          updateMessage("どこからかメロディが流れた。");
        }, 450);
      });
    });

    resetBtn.addEventListener("click", () => {
      if (!acceptingInput) return;
      playSE?.("se-click");
      resetInputs(false);
    });

    if (inputs.length >= answer.length) resetInputs(false);
    else repaint();
  }, 0);
}

function handleKatoriSenkoClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.fireSenko) {
    updateMessage("蚊取り線香に火がついている。");
    return;
  }

  if (gameState.selectedItem !== "match") {
    updateMessage("蚊取り線香だ。火をつけられそうだ。");
    return;
  }

  removeItem("match");
  f.fireSenko = true;
  markProgress?.("fire_katori_senko");
  playSE?.("se-match");
  renderCanvasRoom?.();
  showObj(null, "蚊取り線香に火をつけた", IMAGES.modals.katoriSenko, "蚊取り線香に火をつけた。");
}

function handleMainKitchenOvenClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.foundMainKitchenOvenBurntFlypan) {
    updateMessage("オーブンの中にはもう何もない。");
    return;
  }

  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return;
  }

  f.foundMainKitchenOvenBurntFlypan = true;
  markProgress?.("found_main_kitchen_oven_burnt_flypan");
  addItem("burntFlypan");
  playSE?.("se-door-close");
  renderCanvasRoom?.();
  showObj(null, "オーブンの中", IMAGES.modals.insideOven, "焦げたフライパンを手に入れた。");
}

function handleMainKitchenFaucetClick() {
  if (gameState.selectedItem === "jugWater") {
    updateMessage("水差しには水が入っている。");
    return;
  }

  if (gameState.selectedItem !== "jug") {
    updateMessage("蛇口がある。");
    return;
  }

  removeItem("jug");
  addItem("jugWater");
  playSE?.("se-tea");
  showObj(null, "水をくんだ", IMAGES.modals.jugPour, "水差しに水を入れた。");
}

function handleMainKitchenLowerLeftCabinetClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.unlockMainKitchenLowerLeftCabinet) {
    if (gameState.selectedItem !== "key") {
      updateMessage("シンク下キャビネットには鍵がかかっている。");
      return;
    }

    removeItem("key");
    f.unlockMainKitchenLowerLeftCabinet = true;
    markProgress?.("unlock_main_kitchen_lower_left_cabinet");
    playSE?.("se-gacha");
    renderCanvasRoom?.();
    updateMessage("シンク下キャビネットのロックが外れた。");
    return;
  }

  if (f.foundMainKitchenLowerLeftCabinetRaincoat) {
    updateMessage("もうなにもない");
    return;
  }
  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return;
  }

  f.foundMainKitchenLowerLeftCabinetRaincoat = true;
  markProgress?.("found_main_kitchen_lower_left_cabinet_raincoat");
  addItem("raincoat");
  renderCanvasRoom?.();
  showObj(null, "シンク下にレインコートがある", IMAGES.modals.underSink, "レインコートを手に入れた");
}

function handleMainKitchenFreezerClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainKitchenFreezer) {
    changeRoom("freezer");
    return;
  }

  const letterStyle = [
    "width:min(20vw, 76px)",
    "height:min(20vw, 76px)",
    "min-width:54px",
    "min-height:54px",
    "border:2px solid #777",
    "border-radius:4px",
    "background:#fff",
    "color:#111",
    "font-size:clamp(30px, 9vw, 42px)",
    "font-weight:800",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "padding:0",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08), 0 2px 5px rgba(0,0,0,0.18)",
  ].join(";");
  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div class="notranslate" translate="no" lang="en" style="display:flex; gap:8px; justify-content:center; align-items:center;">
        ${[0, 1, 2]
          .map(
            (idx) => `
              <button id="mainKitchenFreezerLetter${idx}" type="button" aria-label="${idx + 1}文字目" style="${letterStyle}">A</button>
            `,
          )
          .join("")}
      </div>
      <button id="mainKitchenFreezerPasscodeOk" class="ok-btn" type="button">OK</button>
      <div id="mainKitchenFreezerPasscodeHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("冷凍庫", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
  updateMessage("冷凍庫がロックされている。");

  setTimeout(() => {
    const letters = ["A", "C", "E", "I", "L", "M", "N", "T"];
    const saved = Array.isArray(f.mainKitchenFreezerLetters) ? f.mainKitchenFreezerLetters : [0, 0, 0];
    const state = [0, 1, 2].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < letters.length ? value : 0;
    });
    const letterBtns = [0, 1, 2].map((idx) => document.getElementById(`mainKitchenFreezerLetter${idx}`));
    const okBtn = document.getElementById("mainKitchenFreezerPasscodeOk");
    const hintEl = document.getElementById("mainKitchenFreezerPasscodeHint");
    if (letterBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const repaint = () => {
      letterBtns.forEach((btn, idx) => {
        btn.textContent = letters[state[idx]];
      });
      hintEl.textContent = "";
    };

    letterBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % letters.length;
        f.mainKitchenFreezerLetters = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainKitchenFreezerLetters = state.slice();
      const answer = state.map((index) => letters[index]).join("");
      if (answer === "ICE") {
        f.unlockMainKitchenFreezer = true;
        markProgress?.("unlock_main_kitchen_freezer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("冷凍庫のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function handleMainKitchenRefrigeratorClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainKitchenRefrigerator) {
    if (f.foundMainKitchenRefrigeratorSweet) {
      updateMessage("もう何もない");
      return;
    }
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
      return;
    }

    f.foundMainKitchenRefrigeratorSweet = true;
    markProgress?.("found_main_kitchen_refrigerator_sweet");
    addItem("sweet");
    renderCanvasRoom?.();
    showObj(null, "冷蔵庫の中にゼリーがあった", IMAGES.items.sweet, "七夕ゼリーを手に入れた。");
    return;
  }

  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
      <img src="${IMAGES.modals.refrigeratorMemo}" alt="冷蔵庫下段のメモ" class="showobj-image">
      <input id="mainKitchenRefrigeratorPasscode" class="puzzle-input notranslate" type="text" maxlength="16" aria-label="英字を入力" placeholder="英字を入力" autocapitalize="off" autocomplete="off" spellcheck="false" translate="no" lang="en" style="width:220px; max-width:100%; text-align:center; font-size:1.05em; letter-spacing:0.08em;">
      <button id="mainKitchenRefrigeratorPasscodeOk" class="ok-btn" type="button">OK</button>
      <div id="mainKitchenRefrigeratorPasscodeHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("冷蔵庫下段", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
  updateMessage("冷蔵庫下段がロックされている。");

  setTimeout(() => {
    const inputEl = document.getElementById("mainKitchenRefrigeratorPasscode");
    const okBtn = document.getElementById("mainKitchenRefrigeratorPasscodeOk");
    const hintEl = document.getElementById("mainKitchenRefrigeratorPasscodeHint");
    if (!inputEl || !okBtn || !hintEl) return;

    const submit = () => {
      const answer = String(inputEl.value || "")
        .trim()
        .toLowerCase();
      if (answer === "fruit") {
        f.unlockMainKitchenRefrigerator = true;
        markProgress?.("unlock_main_kitchen_refrigerator");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("冷蔵庫下段のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    };

    okBtn.addEventListener("click", submit);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    });
    inputEl.focus();
  }, 0);
}

function handleMainKitchenDrawerClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const roomId = "mainKitchen";
  const areaDescription = "横長引き出し";
  const drawerColors = {
    frontFill: "#E2E2DF",
    sideTop: "#c9c9c5",
    sideBottom: "#aaa9a5",
    gripStyle: "recessed",
    gripColor: "#777773",
    gripWidthRatio: 0.16,
    soundId: "se-hikidashi",
  };

  const closeDrawer = () => {
    playDeskDrawerCloseFx(roomId, areaDescription, { soundId: drawerColors.soundId });
  };

  playDeskDrawerOpenFx(roomId, areaDescription, {
    ...drawerColors,
    keepOpen: true,
    keepInputLocked: true,
    onDone: () => {
      if (f.foundMainKitchenMatch) {
        updateMessage("もう何もない");
        setTimeout(closeDrawer, 350);
        return;
      }

      acquireItemOnce("foundMainKitchenMatch", "match", "引き出しにマッチがある", IMAGES.items.match, "マッチを手に入れた", closeDrawer);
    },
  });
}

function clickWrap(fn, { allowAtNight = false, allowAfterTaxi = false } = {}) {
  return function (...args) {
    if (gameState.main.flags.isNight && !allowAtNight) {
      updateMessage("暗くてよく見えない");
      return;
    }
    fn.apply(this, args);

    // アイテム選択解除は今まで通り
    gameState.selectedItem = null;
    gameState.selectedItemSlot = null;
    updateInventoryDisplay();
  };
}

function handleMainKitchenUpperCabinetClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainKitchenUpperCabinet) {
    acquireItemOnce("foundMainKitchenUpperCabinetJug", "jug", "上段キャビネットに水差しが入っている", IMAGES.items.jug, "水差しを手に入れた");
    return;
  }

  showMainKitchenUpperCabinetPuzzle();
}

function showMainKitchenUpperCabinetPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainKitchenUpperCabinet) {
    handleMainKitchenUpperCabinetClick();
    return;
  }

  const baseShapeStyle = [
    "width:clamp(44px, 17vw, 72px)",
    "height:clamp(44px, 17vw, 72px)",
    "min-width:44px",
    "min-height:44px",
    "flex:0 0 auto",
    "margin:0",
    "border:0",
    "background:#f7f4df",
    "color:#1e2a24",
    "font-size:clamp(26px, 8vw, 38px)",
    "font-weight:800",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "padding:0",
    "cursor:pointer",
    "filter:drop-shadow(0 2px 4px rgba(0,0,0,0.24))",
  ].join("; ");
  const shapeStyles = [
    `${baseShapeStyle}; border-radius:50%; background:#fff`,
    `${baseShapeStyle}; clip-path:polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); background:#fff`,
    `${baseShapeStyle}; clip-path:polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); background:#fff`,
    `${baseShapeStyle}; clip-path:polygon(50% 0%, 100% 100%, 0% 100%); background:#fff; align-items:flex-end; padding-bottom:min(4vw, 14px)`,
  ];

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <p style="margin:0; line-height:1.8; text-align:center;">上段キャビネットがロックされている。</p>
      <div class="notranslate" translate="no" lang="en" style="display:flex; gap:clamp(4px, 2vw, 10px); justify-content:center; align-items:center; flex-wrap:nowrap; max-width:100%;">
        ${[0, 1, 2, 3]
          .map(
            (idx) => `
              <button id="mainKitchenUpperCabinetLetter${idx}" type="button" class="notranslate" translate="no" lang="en" aria-label="${idx + 1}文字目" style="${shapeStyles[idx]}">A</button>
            `,
          )
          .join("")}
      </div>
      <button id="mainKitchenUpperCabinetOk" class="ok-btn" type="button">OK</button>
      <div id="mainKitchenUpperCabinetHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("上段キャビネット", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("上段キャビネットがロックされている。");

  setTimeout(() => {
    const letters = ["A", "C", "E", "K", "L", "O", "S", "V"];
    const saved = Array.isArray(f.mainKitchenUpperCabinetLetters) ? f.mainKitchenUpperCabinetLetters : [0, 0, 0, 0];
    const state = [0, 1, 2, 3].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < letters.length ? value : 0;
    });
    const letterBtns = [0, 1, 2, 3].map((idx) => document.getElementById(`mainKitchenUpperCabinetLetter${idx}`));
    const okBtn = document.getElementById("mainKitchenUpperCabinetOk");
    const hintEl = document.getElementById("mainKitchenUpperCabinetHint");
    if (letterBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const repaint = () => {
      letterBtns.forEach((btn, idx) => {
        btn.textContent = letters[state[idx]];
      });
      hintEl.textContent = "";
    };

    letterBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % letters.length;
        f.mainKitchenUpperCabinetLetters = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainKitchenUpperCabinetLetters = state.slice();
      const answer = state.map((index) => letters[index]).join("");
      if (answer === "LAKE") {
        f.unlockMainKitchenUpperCabinet = true;
        markProgress?.("unlock_main_kitchen_upper_cabinet");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("上段キャビネットのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showMainKitchenLowerRightCabinetPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainKitchenLowerRightCabinet) {
    acquireItemOnce("foundMainKitchenLowerRightCabinetMop", "mop", "キャビネットに掃除用のほこり取りが入っている", IMAGES.items.mop, "掃除用のほこり取りを手に入れた");
    return;
  }

  const letterStyle = [
    "width:min(16vw, 68px)",
    "height:min(16vw, 68px)",
    "min-width:48px",
    "min-height:48px",
    "border:2px solid #777",
    "border-radius:4px",
    "background:#fff",
    "color:#111",
    "font-size:clamp(26px, 7vw, 38px)",
    "font-weight:800",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "padding:0",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08), 0 2px 5px rgba(0,0,0,0.18)",
  ].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div class="notranslate" translate="no" lang="en" style="display:flex; gap:6px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3, 4]
          .map(
            (idx) => `
              <button id="mainKitchenLowerRightCabinetLetter${idx}" type="button" class="notranslate" translate="no" lang="en" aria-label="${idx + 1}文字目" style="${letterStyle}">A</button>
            `,
          )
          .join("")}
      </div>
      <button id="mainKitchenLowerRightCabinetOk" class="ok-btn" type="button">OK</button>
      <div id="mainKitchenLowerRightCabinetHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("赤と黄色に塗られたキャビネット", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("赤と黄色に塗られたキャビネットがロックされている。");

  setTimeout(() => {
    const letters = ["A", "C", "E", "L", "N", "O", "P", "R", "T"];
    const saved = Array.isArray(f.mainKitchenLowerRightCabinetLetters) ? f.mainKitchenLowerRightCabinetLetters : [0, 0, 0, 0, 0];
    const state = [0, 1, 2, 3, 4].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < letters.length ? value : 0;
    });
    const letterBtns = [0, 1, 2, 3, 4].map((idx) => document.getElementById(`mainKitchenLowerRightCabinetLetter${idx}`));
    const okBtn = document.getElementById("mainKitchenLowerRightCabinetOk");
    const hintEl = document.getElementById("mainKitchenLowerRightCabinetHint");
    if (letterBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const repaint = () => {
      letterBtns.forEach((btn, idx) => {
        btn.textContent = letters[state[idx]];
      });
      hintEl.textContent = "";
    };

    letterBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % letters.length;
        f.mainKitchenLowerRightCabinetLetters = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainKitchenLowerRightCabinetLetters = state.slice();
      const answer = state.map((index) => letters[index]).join("");
      if (answer === "CLEAN") {
        f.unlockMainKitchenLowerRightCabinet = true;
        markProgress?.("unlock_main_kitchen_lower_right_cabinet");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("赤と黄色に塗られたキャビネットのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

// アクション名 → 実行関数
const ACTION_HANDLERS = {
  // --- 移動系 ---
  examine_start_door_left() {
    // changeRoom('startRight');
  },
};

// エリアクリック処理
function handleAreaClick(action, event) {
  const handler = ACTION_HANDLERS[action];
  playSE("se-click");

  // area.onClick 方式（将来のため）
  if (typeof action === "function") {
    action(event);
    return;
  }

  // action名（従来の方式）にも対応
  const fn = ACTION_HANDLERS[action];
  if (fn) {
    fn(event);
    return;
  }
  console.warn("未定義のaction:", action);
}

// クリアレポート表示
function showEndingReport(endingId = "end") {
  const elapsedSec = Math.round((Date.now() - (ANA.start || Date.now())) / 1000);
  const m = Math.floor(elapsedSec / 60);
  const s = elapsedSec % 60;
  const timeStr = `${m}分${s.toString().padStart(2, "0")}秒`;

  // 今作用エンド情報
  const ENDING_INFO = {
    trueEnd: {
      title: "🐟 DINNER END",
      label: "DINNER END",
      desc: "脱出してお風呂、ご飯を楽しみました",
    },

    end: {
      title: "🌟 NORMAL END ",
      label: "NORMAL",
      desc: "みんなの願いをかなえ、無事に脱出しました",
    },
    rainEnd: {
      title: "☔ NORMAL END2 ",
      label: "NORMAL2",
      desc: "雨の中頑張ってお家に帰りましょう",
    },
  };

  const info = ENDING_INFO[endingId] || ENDING_INFO.end;

  // エンド別ひとこと
  let secretText = "";
  switch (endingId) {
    case "trueEnd":
      secretText = "💐 長い道のり、遊んでくれてありがとうございました";
      break;

    case "end":
      secretText = "👣 脱出おめでとうございます";
      break;
    case "rainEnd":
      secretText = "👣 脱出おめでとうございます";
      break;
    default:
      secretText = "";
  }

  // GA送信
  ANA.once("ending", endingId, {
    ending: endingId,
    time_sec: elapsedSec,
  });

  const html = `
        <div style="max-width:520px; text-align:center;">
            <h2 style="margin-top:0;">${info.title}</h2>
            <p style="margin:6px 0 12px 0; font-weight:bold;">${info.desc}</p>
            <p style="margin:4px 0;">プレイ時間：<b>${timeStr}</b></p>
            <p style="margin:4px 0;">ヒント利用：<b>${ANA.hintCount || 0} 回</b></p>
            ${secretText ? `<p style="margin:12px 0; font-size:.9em; opacity:.85;">${secretText}</p>` : ""}


        </div>
    `;

  showModal("エンディング", html, [
    {
      text: "最初から",
      action: "restart",
    },
    {
      text: "プレイ後アンケート",
      action: () => openFeedbackForm(endingId),
    },
    {
      text: "閉じる",
      action: () => {
        closeModal();
      },
    },
  ]);
}

// クリアログ生成（既存のがあればそのまま流用でOK）
// アンケート
function openFeedbackForm(endingId) {
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfqGLrLDVjLffn5u7bTHlPrANSnTrshVVQzRsBsKy5E4g6V4Q/viewform";
  const endingLabel =
    {
      trueEnd: "ディナーエンド",
      end: "ノーマルエンド",
      rainEnd: "ノーマルエンド2",
    }[endingId] || "エンド";

  const params = new URLSearchParams({
    "entry.666725843": endingLabel,
  });

  window.open(`${FEEDBACK_URL}?${params.toString()}`, "_blank");
}

function talkToHintCharacter(roomId, charId) {
  // flags取得
  let flags = gameState[roomId].flags;
  // まだカウント無ければ初期化
  if (!flags.talkTo) flags.talkTo = {};
  if (!flags.talkTo[charId]) flags.talkTo[charId] = 0;

  // カウントアップ
  flags.talkTo[charId]++;

  // セリフリスト取得
  const messages = hintMessages[roomId][charId];

  // 範囲外なら最後のメッセージ
  const idx = (flags.talkTo[charId] - 1) % messages.length;
  console.log(flags.talkTo[charId]);

  // 表示
  updateMessage(messages[idx]);
}

// ▼ 手帳モーダル 操作用

function switchNotebookTab(tabId) {
  const tabs = document.querySelectorAll(".notebook-tab");
  const contents = document.querySelectorAll(".notebook-tab-content");

  tabs.forEach((btn) => {
    const t = btn.getAttribute("data-tab");
    btn.classList.toggle("active", t === tabId);
  });

  contents.forEach((c) => c.classList.remove("active"));

  const active = document.getElementById("notebook-tab-" + tabId);
  if (active) active.classList.add("active");

  // ★ タブを開いた瞬間に中身を最新化
  if (tabId === "notes") renderNotebookTasks();
}

function closeNotebook() {
  const m = document.getElementById("notebookModal");
  if (!m) return;
  m.style.display = "none";
}

function renderNotebookTasks() {
  const notesBody = document.getElementById("notebook-notes-body");
  if (!notesBody) return;

  const flags = gameState && gameState.main && gameState.main.flags ? gameState.main.flags : {};

  // 既存の「タスク枠」だけ差し替える（他の追記メモが将来増えても消さない）
  const old = document.getElementById("notebook-tasks");
  if (old) old.remove();

  const tasks = [];

  const allSolved = true;
  if (allSolved) {
    tasks.push({ text: "test", done: false });
  }

  // キャプションも進捗用に寄せる（タスクなしなら元のニュアンスに戻す）
  const cap = document.querySelector("#notebook-tab-notes .notebook-cap");
  if (cap) {
    cap.textContent = tasks.length > 0 ? "進捗メモが書き足されている。" : "空白のページ。";
  }

  const wrap = document.createElement("div");
  wrap.id = "notebook-tasks";
  wrap.className = "notebook-note";

  if (tasks.length === 0) {
    wrap.innerHTML = `<p style="margin:0;">まだタスクはない。</p>`;
    notesBody.prepend(wrap);
    return;
  }

  const rows = tasks
    .map((t) => {
      const mark = t.done ? "✅" : "⬜";
      const style = t.done ? "text-decoration:line-through;opacity:0.75;" : "";
      return `
      <li style="display:flex;gap:8px;align-items:flex-start;">
        <span style="width:1.2em;display:inline-block;">${mark}</span>
        <span style="${style}">${t.text}</span>
      </li>
    `;
    })
    .join("");

  wrap.innerHTML = `
    <div style="font-weight:700;margin:0 0 8px 0;">進捗</div>
    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
      ${rows}
    </ul>
  `;

  notesBody.prepend(wrap);
}

// オーバーレイクリックで閉じたい場合（任意）
document.addEventListener("click", (e) => {
  const modal = document.getElementById("notebookModal");
  if (!modal) return;
  if (modal.style.display === "flex" && e.target === modal) {
    closeNotebook();
  }
});

function showWashitsuSafePuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockSafe) {
    if (!f.foundWashitsuSafeYen300) {
      acquireItemOnce("foundWashitsuSafeYen300", "yen300", "金庫の中に300円がある", IMAGES.items.yen300, "300円を手に入れた");
      return;
    }

    updateMessage("金庫は開いている。");
    return;
  }

  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const dialSize = "min(72vw, 320px)";
  const numberStyle = [
    "position:absolute",
    "left:50%",
    "top:50%",
    "width:34px",
    "height:34px",
    "border-radius:50%",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "background:#f4f6f7",
    "color:#17232c",
    "font-size:18px",
    "font-weight:800",
    "box-shadow:0 1px 3px rgba(0,0,0,0.22)",
    "user-select:none",
    "pointer-events:none",
  ].join(";");
  const numberMarks = numbers
    .map((num) => {
      const angle = num * 36;
      const rad = (angle * Math.PI) / 180;
      const x = 50 + Math.sin(rad) * 34;
      const y = 50 - Math.cos(rad) * 34;
      return `<span class="safe-dial-number" data-safe-number="${num}" style="${numberStyle}; left:${x}%; top:${y}%; transform:translate(-50%, -50%);">${num}</span>`;
    })
    .join("");
  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="washitsuSafeDial" role="slider" aria-label="金庫のダイヤル" aria-valuemin="0" aria-valuemax="9" aria-valuenow="0"
        style="position:relative; width:${dialSize}; aspect-ratio:1; border-radius:50%; background:radial-gradient(circle at 36% 30%, #75899a 0%, #324554 50%, #14232d 100%); border:10px solid #d8e0e6; box-shadow:inset 0 0 0 10px #eef3f6, inset 0 0 24px rgba(0,0,0,0.45), 0 8px 18px rgba(0,0,0,0.32); cursor:pointer; touch-action:none;">
        <div style="position:absolute; left:50%; top:8px; width:4px; height:26px; border-radius:4px; background:#fff; transform:translateX(-50%); box-shadow:0 1px 2px rgba(0,0,0,0.28);"></div>
        ${numberMarks}
        <div id="washitsuSafeDialCenter" style="position:absolute; left:50%; top:50%; width:82px; height:82px; border-radius:50%; transform:translate(-50%, -50%); background:radial-gradient(circle at 38% 32%, #dce7ef, #8ea2b0 68%, #334655 100%); color:#14232d; display:flex; align-items:center; justify-content:center; font-size:34px; font-weight:900; box-shadow:inset 0 2px 7px rgba(255,255,255,0.48), inset 0 -5px 10px rgba(0,0,0,0.28);">0</div>
      </div>
      <div id="washitsuSafeInput" style="display:grid; grid-template-columns:repeat(4, 46px); gap:8px; justify-content:center;"></div>
      <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
        <button id="washitsuSafeEnter" class="text-btn" type="button">入力</button>
        <button id="washitsuSafeBack" class="text-btn" type="button">戻す</button>
        <button id="washitsuSafeOk" class="ok-btn" type="button">OK</button>
      </div>
      <div id="washitsuSafeHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("金庫のダイヤル", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("金庫にダイヤルが付いている。");

  setTimeout(() => {
    const savedDigits = Array.isArray(f.washitsuSafeDigits) ? f.washitsuSafeDigits : [];
    const digits = savedDigits
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 0 && value <= 9)
      .slice(0, 4);
    const savedDial = Number(f.washitsuSafeDialNumber);
    let selected = Number.isInteger(savedDial) && savedDial >= 0 && savedDial <= 9 ? savedDial : 0;
    const dial = document.getElementById("washitsuSafeDial");
    const center = document.getElementById("washitsuSafeDialCenter");
    const inputEl = document.getElementById("washitsuSafeInput");
    const enterBtn = document.getElementById("washitsuSafeEnter");
    const backBtn = document.getElementById("washitsuSafeBack");
    const okBtn = document.getElementById("washitsuSafeOk");
    const hintEl = document.getElementById("washitsuSafeHint");
    const numberEls = Array.from(document.querySelectorAll(".safe-dial-number"));
    if (!dial || !center || !inputEl || !enterBtn || !backBtn || !okBtn || !hintEl) return;

    const saveState = () => {
      f.washitsuSafeDigits = digits.slice();
      f.washitsuSafeDialNumber = selected;
    };

    const repaint = () => {
      center.textContent = String(selected);
      dial.setAttribute("aria-valuenow", String(selected));
      numberEls.forEach((el) => {
        const isSelected = Number(el.dataset.safeNumber) === selected;
        el.style.backgroundColor = isSelected ? "#ffe49b" : "#f4f6f7";
        el.style.color = isSelected ? "#111" : "#17232c";
      });
      inputEl.innerHTML = [0, 1, 2, 3]
        .map((idx) => {
          const value = digits[idx] ?? "";
          return `<div style="width:46px;height:46px;border:2px solid #555;border-radius:4px;background:#fff;color:#111;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;box-sizing:border-box;">${value}</div>`;
        })
        .join("");
      hintEl.textContent = "";
    };

    const setFromPointer = (e) => {
      const rect = dial.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const deg = ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
      selected = Math.round(deg / 36) % 10;
      saveState();
      repaint();
    };

    let dragging = false;
    dial.addEventListener("pointerdown", (e) => {
      dragging = true;
      dial.setPointerCapture?.(e.pointerId);
      setFromPointer(e);
      playSE?.("se-pi");
    });
    dial.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      setFromPointer(e);
    });
    dial.addEventListener("pointerup", () => {
      dragging = false;
    });
    dial.addEventListener("pointercancel", () => {
      dragging = false;
    });

    enterBtn.addEventListener("click", () => {
      if (digits.length >= 4) {
        digits.shift();
      }
      digits.push(selected);
      saveState();
      playSE?.("se-kachi");
      repaint();
    });

    backBtn.addEventListener("click", () => {
      digits.pop();
      saveState();
      playSE?.("se-kachi");
      repaint();
    });

    okBtn.addEventListener("click", () => {
      saveState();
      if (digits.join("") === "1624") {
        f.unlockSafe = true;
        markProgress?.("unlock_safe");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("金庫のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function openMainDeskTopDrawer() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const roomId = "mainDesk";
  const areaDescription = "引き出し最上段";
  const drawerColors = {
    frontFill: "#99562C",
    sideTop: "#7f4524",
    sideBottom: "#63351b",
    gripStyle: "recessed",
    gripColor: "#5a321f",
    gripWidthRatio: 0.16,
    soundId: "se-hikidashi",
  };

  const closeDrawer = () => {
    playDeskDrawerCloseFx(roomId, areaDescription, { soundId: drawerColors.soundId });
  };

  playDeskDrawerOpenFx(roomId, areaDescription, {
    ...drawerColors,
    keepOpen: true,
    keepInputLocked: true,
    onDone: () => {
      if (f.foundMainDeskTopDrawerPowerCode) {
        updateMessage("もう何もない");
        setTimeout(closeDrawer, 350);
        return;
      }

      acquireItemOnce("foundMainDeskTopDrawerPowerCode", "powerCode", "引き出しに延長コードがある", IMAGES.items.powerCode, "延長コードを手に入れた", closeDrawer);
      f.senkoBurned = true;
      syncSenkoBlownFlag(f);
      markProgress?.("senko_burned");
      renderCanvasRoom?.();
    },
  });
}

function showMainDeskTopDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainDeskTopDrawer) {
    openMainDeskTopDrawer();
    return;
  }

  const digitStyle = [
    "width:min(19vw, 72px)",
    "height:min(19vw, 72px)",
    "min-width:52px",
    "min-height:52px",
    "border:2px solid #777",
    "border-radius:4px",
    "background:#fff",
    "color:#111",
    "font-size:clamp(30px, 9vw, 42px)",
    "font-weight:800",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "padding:0",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08), 0 2px 5px rgba(0,0,0,0.18)",
  ].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:8px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3]
          .map(
            (idx) => `
              <button id="mainDeskTopDrawerDigit${idx}" type="button" aria-label="${idx + 1}桁目" style="${digitStyle}">0</button>
            `,
          )
          .join("")}
      </div>
      <button id="mainDeskTopDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="mainDeskTopDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("一番上の引き出し", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("一番上の引き出しがロックされている。");

  setTimeout(() => {
    const digitBtns = [0, 1, 2, 3].map((idx) => document.getElementById(`mainDeskTopDrawerDigit${idx}`));
    const okBtn = document.getElementById("mainDeskTopDrawerOk");
    const hintEl = document.getElementById("mainDeskTopDrawerHint");
    if (digitBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const saved = Array.isArray(f.mainDeskTopDrawerDigits) ? f.mainDeskTopDrawerDigits : [0, 0, 0, 0];
    const state = [0, 1, 2, 3].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value <= 9 ? value : 0;
    });
    const repaint = () => {
      digitBtns.forEach((btn, idx) => {
        btn.textContent = String(state[idx]);
      });
      hintEl.textContent = "";
    };

    digitBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % 10;
        f.mainDeskTopDrawerDigits = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainDeskTopDrawerDigits = state.slice();
      if (state.join("") === "4024") {
        f.unlockMainDeskTopDrawer = true;
        markProgress?.("unlock_main_desk_top_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("一番上の引き出しのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function openMainDeskSecondDrawer() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const roomId = "mainDesk";
  const areaDescription = "引き出し2段目";
  const drawerColors = {
    frontFill: "#99562C",
    sideTop: "#7f4524",
    sideBottom: "#63351b",
    gripStyle: "recessed",
    gripColor: "#5a321f",
    gripWidthRatio: 0.16,
    soundId: "se-hikidashi",
  };

  playDeskDrawerOpenFx(roomId, areaDescription, {
    ...drawerColors,
    keepOpen: true,
    keepInputLocked: true,
    onDone: () => {
      if (f.foundMainDeskSecondDrawerFertilizer) {
        updateMessage("もう何もない");
        setTimeout(() => {
          playDeskDrawerCloseFx(roomId, areaDescription, { soundId: drawerColors.soundId });
        }, 350);
        return;
      }

      acquireItemOnce("foundMainDeskSecondDrawerFertilizer", "fertilizer", "引き出しに肥料がある", IMAGES.items.fertilizer, "肥料を手に入れた", () => {
        playDeskDrawerCloseFx(roomId, areaDescription, { soundId: drawerColors.soundId });
      });
    },
  });
}

function showMainDeskSecondDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainDeskSecondDrawer) {
    openMainDeskSecondDrawer();
    return;
  }

  const baseDigitStyle = [
    "width:min(20vw, 76px)",
    "height:min(20vw, 76px)",
    "min-width:54px",
    "min-height:54px",
    "border:2px solid #777",
    "border-radius:4px",
    "color:#111",
    "font-size:clamp(32px, 9vw, 44px)",
    "font-weight:800",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "padding:0",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08), 0 2px 5px rgba(0,0,0,0.18)",
  ].join(";");
  const digitStyles = [`${baseDigitStyle};background:#9876b5;border-color:#64477e;color:#fff`, `${baseDigitStyle};background:#fff`];
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
        ${[0, 1]
          .map(
            (idx) => `
              <button id="mainDeskSecondDrawerDigit${idx}" type="button" aria-label="${idx + 1}桁目" style="${digitStyles[idx]}">1</button>
            `,
          )
          .join("")}
      </div>
      <button id="mainDeskSecondDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="mainDeskSecondDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("二番目の引き出し", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("二番目の引き出しがロックされている。");

  setTimeout(() => {
    const digitBtns = [0, 1].map((idx) => document.getElementById(`mainDeskSecondDrawerDigit${idx}`));
    const okBtn = document.getElementById("mainDeskSecondDrawerOk");
    const hintEl = document.getElementById("mainDeskSecondDrawerHint");
    if (digitBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const saved = Array.isArray(f.mainDeskSecondDrawerDigits) ? f.mainDeskSecondDrawerDigits : [1, 1];
    const state = [0, 1].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 1 && value <= 13 ? value : 1;
    });
    const repaint = () => {
      digitBtns.forEach((btn, idx) => {
        btn.textContent = String(state[idx]);
      });
      hintEl.textContent = "";
    };

    digitBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = state[idx] >= 13 ? 1 : state[idx] + 1;
        f.mainDeskSecondDrawerDigits = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainDeskSecondDrawerDigits = state.slice();
      if (state[0] === 1 && state[1] === 13) {
        f.unlockMainDeskSecondDrawer = true;
        markProgress?.("unlock_main_desk_second_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("二番目の引き出しのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

const MAIN_DESK_THIRD_DRAWER_ANSWER = Object.freeze([2, 0, 3, 1]);
const MAIN_DESK_THIRD_DRAWER_BAR_WIDTHS = Object.freeze(["25%", "50%", "75%", "100%"]);

function openMainDeskThirdDrawer() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const roomId = "mainDesk";
  const areaDescription = "引き出し3段目";
  const drawerColors = {
    frontFill: "#99562C",
    sideTop: "#7f4524",
    sideBottom: "#63351b",
    gripStyle: "recessed",
    gripColor: "#5a321f",
    gripWidthRatio: 0.16,
    soundId: "se-hikidashi",
  };

  const closeDrawer = () => {
    playDeskDrawerCloseFx(roomId, areaDescription, { soundId: drawerColors.soundId });
  };

  playDeskDrawerOpenFx(roomId, areaDescription, {
    ...drawerColors,
    keepOpen: true,
    keepInputLocked: true,
    onDone: () => {
      if (f.foundMainDeskThirdDrawerMemo) {
        updateMessage("もう何もない");
        setTimeout(closeDrawer, 350);
        return;
      }

      acquireItemOnce("foundMainDeskThirdDrawerMemo", "memo", "引き出しにメモがある", IMAGES.modals.drawerThird, "メモを手に入れた", closeDrawer);
    },
  });
}

function showMainDeskThirdDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainDeskThirdDrawer) {
    openMainDeskThirdDrawer();
    return;
  }

  const barButtonStyle = [
    "width:min(19vw, 72px)",
    "height:min(19vw, 72px)",
    "min-width:52px",
    "min-height:52px",
    "border:2px solid #242424",
    "border-radius:4px",
    "background:#3f3f3f",
    "display:flex",
    "align-items:center",
    "justify-content:flex-start",
    "padding:8px",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(255,255,255,0.06), 0 2px 5px rgba(0,0,0,0.24)",
  ].join(";");
  const barStyle = ["display:block", "width:25%", "height:8px", "border-radius:999px", "background:#fff", "pointer-events:none", "transition:width 150ms ease"].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3]
          .map(
            (idx) => `
              <button id="mainDeskThirdDrawerBar${idx}" type="button" aria-label="${idx + 1}番目の棒" style="${barButtonStyle}">
                <span style="${barStyle}"></span>
              </button>
            `,
          )
          .join("")}
      </div>
      <button id="mainDeskThirdDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="mainDeskThirdDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("三番目の引き出し", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("三番目の引き出しがロックされている。");

  setTimeout(() => {
    const saved = Array.isArray(f.mainDeskThirdDrawerBars) ? f.mainDeskThirdDrawerBars : [0, 0, 0, 0];
    const state = [0, 1, 2, 3].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value <= 3 ? value : 0;
    });
    const barBtns = [0, 1, 2, 3].map((idx) => document.getElementById(`mainDeskThirdDrawerBar${idx}`));
    const okBtn = document.getElementById("mainDeskThirdDrawerOk");
    const hintEl = document.getElementById("mainDeskThirdDrawerHint");
    if (barBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const repaint = () => {
      barBtns.forEach((btn, idx) => {
        const bar = btn.querySelector("span");
        if (bar) bar.style.width = MAIN_DESK_THIRD_DRAWER_BAR_WIDTHS[state[idx]];
        btn.setAttribute("aria-label", `${idx + 1}番目の棒、長さ${state[idx] + 1}`);
      });
      hintEl.textContent = "";
    };

    barBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % 4;
        f.mainDeskThirdDrawerBars = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainDeskThirdDrawerBars = state.slice();
      if (state.every((value, idx) => value === MAIN_DESK_THIRD_DRAWER_ANSWER[idx])) {
        f.unlockMainDeskThirdDrawer = true;
        markProgress?.("unlock_main_desk_third_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("三番目の引き出しのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function openMainDeskBottomDrawer() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const roomId = "mainDesk";
  const areaDescription = "引き出し最下段";
  const drawerColors = {
    frontFill: "#99562C",
    sideTop: "#7f4524",
    sideBottom: "#63351b",
    gripStyle: "recessed",
    gripColor: "#5a321f",
    gripWidthRatio: 0.16,
    soundId: "se-hikidashi",
  };

  const closeDrawer = () => {
    playDeskDrawerCloseFx(roomId, areaDescription, { soundId: drawerColors.soundId });
  };

  playDeskDrawerOpenFx(roomId, areaDescription, {
    ...drawerColors,
    keepOpen: true,
    keepInputLocked: true,
    onDone: () => {
      if (f.foundMainDeskBottomDrawerCleanser) {
        updateMessage("もう何もない");
        setTimeout(closeDrawer, 350);
        return;
      }

      acquireItemOnce("foundMainDeskBottomDrawerCleanser", "cleanser", "引き出しにクレンザーがある", IMAGES.items.cleanser, "クレンザーを手に入れた", closeDrawer);
    },
  });
}

function showMainDeskBottomDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainDeskBottomDrawer) {
    openMainDeskBottomDrawer();
    return;
  }

  const symbolStyle = [
    "width:min(16vw, 68px)",
    "height:min(16vw, 68px)",
    "min-width:48px",
    "min-height:48px",
    "border:2px solid #777",
    "border-radius:4px",
    "background:#fff",
    "color:#111",
    "font-size:clamp(25px, 7vw, 36px)",
    "font-weight:800",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "padding:0",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08), 0 2px 5px rgba(0,0,0,0.18)",
  ].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3, 4]
          .map(
            (idx) => `
              <button id="mainDeskBottomDrawerSymbol${idx}" type="button" aria-label="${idx + 1}番目" style="${symbolStyle}">❤</button>
            `,
          )
          .join("")}
      </div>
      <button id="mainDeskBottomDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="mainDeskBottomDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("一番下の引き出し", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("一番下の引き出しがロックされている。");

  setTimeout(() => {
    const symbols = ["●", "❤"];
    const saved = Array.isArray(f.mainDeskBottomDrawerSymbols) ? f.mainDeskBottomDrawerSymbols : [1, 1, 1, 1, 1];
    const state = [0, 1, 2, 3, 4].map((idx) => (Number(saved[idx]) === 1 ? 1 : 0));
    const symbolBtns = [0, 1, 2, 3, 4].map((idx) => document.getElementById(`mainDeskBottomDrawerSymbol${idx}`));
    const okBtn = document.getElementById("mainDeskBottomDrawerOk");
    const hintEl = document.getElementById("mainDeskBottomDrawerHint");
    if (symbolBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const repaint = () => {
      symbolBtns.forEach((btn, idx) => {
        btn.textContent = symbols[state[idx]];
        btn.style.color = "#111";
      });
      hintEl.textContent = "";
    };

    symbolBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = state[idx] === 0 ? 1 : 0;
        f.mainDeskBottomDrawerSymbols = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainDeskBottomDrawerSymbols = state.slice();
      if (state.join("") === "01001") {
        f.unlockMainDeskBottomDrawer = true;
        markProgress?.("unlock_main_desk_bottom_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("一番下の引き出しのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showMainTvLeftDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainTvLeftDrawer) {
    acquireItemOnce("foundMainTvLeftDrawerBattery", "battery", "テレビ台の左の引き出しに電池がある", IMAGES.items.battery, "電池を手に入れた");
    return;
  }

  const tileStyle = [
    "width:min(25vw, 112px)",
    "height:min(25vw, 112px)",
    "min-width:72px",
    "min-height:72px",
    "border:2px solid #8a8a8a",
    "border-radius:2px",
    "background:#b8b8b8",
    "color:#111",
    "font-size:clamp(30px, 11vw, 52px)",
    "font-weight:700",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "position:relative",
    "cursor:pointer",
    "padding:0",
    "box-shadow:inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 5px rgba(0,0,0,0.18)",
  ].join(";");
  const countStyle = ["position:absolute", "right:6px", "bottom:5px", "min-width:1.4em", "height:1.4em", "border-radius:999px", "background:rgba(0,0,0,0.68)", "color:#fff", "font-size:clamp(12px, 3.5vw, 15px)", "font-weight:700", "line-height:1.4em", "text-align:center", "display:none"].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:grid; grid-template-columns:repeat(3, minmax(72px, 112px)); gap:14px; justify-content:center;">
        ${[0, 1, 2, 3, 4, 5]
          .map(
            (idx) => `
              <button id="mainTvLeftDrawerTile${idx}" type="button" aria-label="${idx + 1}番" style="${tileStyle}">
                <span>${idx + 1}</span>
                <span id="mainTvLeftDrawerCount${idx}" style="${countStyle}">0</span>
              </button>
            `,
          )
          .join("")}
      </div>
      <button id="mainTvLeftDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="mainTvLeftDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("テレビ台の左の引き出し", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("テレビ台の左の引き出しがロックされている。");

  setTimeout(() => {
    const saved = Array.isArray(f.mainTvLeftDrawerDigits) ? f.mainTvLeftDrawerDigits : [0, 0, 0, 0, 0, 0];
    const state = [0, 1, 2, 3, 4, 5].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value <= 9 ? value : 0;
    });
    const tileBtns = [0, 1, 2, 3, 4, 5].map((idx) => document.getElementById(`mainTvLeftDrawerTile${idx}`));
    const countEls = [0, 1, 2, 3, 4, 5].map((idx) => document.getElementById(`mainTvLeftDrawerCount${idx}`));
    const okBtn = document.getElementById("mainTvLeftDrawerOk");
    const hintEl = document.getElementById("mainTvLeftDrawerHint");
    if (tileBtns.some((btn) => !btn) || countEls.some((el) => !el) || !okBtn || !hintEl) return;

    const repaint = () => {
      countEls.forEach((el, idx) => {
        el.textContent = String(state[idx]);
        el.style.display = state[idx] > 0 ? "block" : "none";
      });
      tileBtns.forEach((btn, idx) => {
        btn.style.outline = state[idx] > 0 ? "3px solid #222" : "none";
        btn.style.outlineOffset = "-5px";
      });
      hintEl.textContent = "";
    };

    const pressTile = (idx) => {
      state[idx] += 1;
      f.mainTvLeftDrawerDigits = state.slice();
      playSE?.("se-pi");
      repaint();
    };

    tileBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => pressTile(idx));
    });

    okBtn.addEventListener("click", () => {
      f.mainTvLeftDrawerDigits = state.slice();
      const isCorrect = state.every((count, idx) => count === (idx === 1 || idx === 5 ? 3 : 0));
      if (isCorrect) {
        f.unlockMainTvLeftDrawer = true;
        markProgress?.("unlock_main_tv_left_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("テレビ台の左の引き出しのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      state.fill(0);
      f.mainTvLeftDrawerDigits = state.slice();
      repaint();
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showMainTvRightDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainTvRightDrawer) {
    acquireItemOnce("foundMainTvRightDrawerMemoSafe", "memoSafe", "テレビ台の右の引き出しにメモがある", IMAGES.items.memoSafe, "メモを手に入れた");
    return;
  }

  const squareStyle = [
    "width:min(17vw, 66px)",
    "height:min(17vw, 66px)",
    "min-width:42px",
    "min-height:42px",
    "border-radius:4px",
    "border:2px solid #568da3",
    "background:#c9f1ff",
    "color:#12313d",
    "font-size:clamp(24px, 8vw, 34px)",
    "font-weight:800",
    "padding:0",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(255,255,255,0.45), 0 2px 0 rgba(40,80,95,0.18)",
  ].join("; ");

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:8px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3]
          .map(
            (idx) => `
              <button id="mainTvRightDrawerLetter${idx}" class="notranslate" translate="no" lang="en" type="button" aria-label="${idx + 1}文字目" style="${squareStyle}">A</button>
            `,
          )
          .join("")}
      </div>
      <button id="mainTvRightDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="mainTvRightDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("テレビ台の右の引き出し", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("テレビ台の右の引き出しがロックされている。");

  setTimeout(() => {
    const letters = ["A", "E", "G", "R", "S", "T", "V", "W"];
    const saved = Array.isArray(f.mainTvRightDrawerLetters) ? f.mainTvRightDrawerLetters : [0, 0, 0, 0];
    const state = [0, 1, 2, 3].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < letters.length ? value : 0;
    });
    const letterBtns = [0, 1, 2, 3].map((idx) => document.getElementById(`mainTvRightDrawerLetter${idx}`));
    const okBtn = document.getElementById("mainTvRightDrawerOk");
    const hintEl = document.getElementById("mainTvRightDrawerHint");
    if (letterBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const repaint = () => {
      letterBtns.forEach((btn, idx) => {
        btn.textContent = letters[state[idx]];
      });
      hintEl.textContent = "";
    };

    letterBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % letters.length;
        f.mainTvRightDrawerLetters = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainTvRightDrawerLetters = state.slice();
      const answer = state.map((index) => letters[index]).join("");
      if (answer === "WAVE") {
        f.unlockMainTvRightDrawer = true;
        markProgress?.("unlock_main_tv_right_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("テレビ台の右の引き出しのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showMainDoorBoxPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockBox) {
    updateMessage("箱は開いている。");
    return;
  }

  const digitStyle = [
    "width:min(24vw, 84px)",
    "height:min(24vw, 84px)",
    "max-width:84px",
    "max-height:84px",
    "border:2px solid #6e4f1f",
    "border-radius:4px",
    "background:#BA8B37",
    "color:#3b1f0f",
    "font-size:42px",
    "font-weight:800",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(255,255,255,0.16), 0 2px 5px rgba(0,0,0,0.22)",
  ].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <p style="margin:0; line-height:1.8; text-align:center;">箱がロックされている。</p>
      <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 84px)); gap:10px; justify-content:center; align-items:center;">
        <button id="mainDoorBoxDigit0" type="button" aria-label="左上の数字" style="${digitStyle};">0</button>
        <button id="mainDoorBoxDigit1" type="button" aria-label="右上の数字" style="${digitStyle};">0</button>
        <button id="mainDoorBoxDigit2" type="button" aria-label="左下の数字" style="${digitStyle};">0</button>
        <button id="mainDoorBoxDigit3" type="button" aria-label="右下の数字" style="${digitStyle};">0</button>
      </div>
      <button id="mainDoorBoxOk" class="ok-btn" type="button">OK</button>
      <div id="mainDoorBoxHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("閉じた箱", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("箱がロックされている。");

  setTimeout(() => {
    const digitBtns = [0, 1, 2, 3].map((i) => document.getElementById(`mainDoorBoxDigit${i}`));
    const okBtn = document.getElementById("mainDoorBoxOk");
    const hintEl = document.getElementById("mainDoorBoxHint");
    if (digitBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const saved = Array.isArray(f.mainDoorBoxDigits) ? f.mainDoorBoxDigits : [0, 0, 0, 0];
    const state = [0, 1, 2, 3].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value <= 9 ? value : 0;
    });
    const repaint = (idx) => {
      digitBtns[idx].textContent = String(state[idx]);
      hintEl.textContent = "";
    };

    digitBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % 10;
        f.mainDoorBoxDigits = state.slice();
        playSE?.("se-pi");
        repaint(i);
      });
      repaint(i);
    });

    okBtn.addEventListener("click", () => {
      f.mainDoorBoxDigits = state.slice();
      if (state.join("") === "7264") {
        f.unlockBox = true;
        markProgress?.("unlock_main_door_box");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("箱のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showObj(flagKey, title, imgSrc, msg, altImgSrc, msgEn) {
  const f = gameState.main.flags;
  const wasFlagOn = flagKey ? !!f[flagKey] : false;
  if (flagKey) f[flagKey] = true;
  if (flagKey && !wasFlagOn) {
    markProgress?.(`important_flag_${flagKey}`, { flagKey });
  }

  const imgId = "objImg_" + Date.now();

  // ★ uiLangに連動：enなら alt を初期表示（あれば）
  const hasEn = !!altImgSrc;
  let isEn = uiLang === "en" && hasEn;

  const content = `<img id="${imgId}" class="showobj-image" src="${isEn ? altImgSrc : imgSrc}">`;

  const buttons = [];

  // ★ 「言語切替」ボタン：uiLangも一緒にトグルして全体と同期
  if (hasEn) {
    buttons.push({
      text: "🌐 EN/JP",
      action: () => {
        const el = document.getElementById(imgId);
        if (!el) return;

        uiLang = uiLang === "en" ? "jp" : "en";
        isEn = uiLang === "en";

        el.src = isEn ? altImgSrc : imgSrc;

        // メッセージも切替（英語文が無いなら既存msgを使う）
        // updateMessage(isEn ? (msgEn || 'Showing English version') : msg);
      },
    });
  }

  buttons.push({ text: "閉じる", action: "close" });

  showModal(title, content, buttons, null, { contentClass: "showobj-modal" });
  updateMessage(isEn ? msgEn || msg : msg);
}

function showLighthouseModal() {
  const content = `
    <style>
      #lighthouseModalView {
        position: relative;
        width: min(92vw, 560px);
        margin: 0 auto 18px;
        overflow: hidden;
        border-radius: 4px;
      }

      #lighthouseModalView img {
        display: block;
        width: 100%;
        height: auto;
      }

      #lighthouseModalView .lighthouse-glow,
      #lighthouseModalView .lighthouse-beam {
        position: absolute;
        pointer-events: none;
        opacity: 0;
        animation: lighthousePulse 4s ease-in-out infinite;
      }

      #lighthouseModalView .lighthouse-glow {
        left: 58.6%;
        top: 16.5%;
        width: 9.2%;
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 235, 0.98) 0%, rgba(255, 236, 132, 0.82) 34%, rgba(255, 230, 105, 0) 72%);
        transform: translate(-50%, -50%);
        filter: blur(1px);
        mix-blend-mode: screen;
      }

      #lighthouseModalView .lighthouse-beam {
        left: 0;
        top: 11.5%;
        width: 100%;
        height: 13%;
        background:
          linear-gradient(90deg, rgba(255, 244, 170, 0) 0%, rgba(255, 244, 170, 0.16) 36%, rgba(255, 252, 220, 0.58) 58%, rgba(255, 244, 170, 0.16) 80%, rgba(255, 244, 170, 0) 100%);
        filter: blur(5px);
        mix-blend-mode: screen;
      }

      @keyframes lighthousePulse {
        0%, 52%, 100% { opacity: 0; }
        62%, 82% { opacity: 1; }
      }
    </style>
    <div id="lighthouseModalView" aria-label="灯台">
      <img src="${IMAGES.modals.lighthouse}" alt="灯台">
      <div class="lighthouse-beam" aria-hidden="true"></div>
      <div class="lighthouse-glow" aria-hidden="true"></div>
    </div>
  `;

  showModal("灯台", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("灯台が見える。");
}

function buildTvGuideNewspaperContent(title, summary, dateText = "203X/6/1") {
  const body = escapeHtml(summary).replace(/\n/g, "<br>");
  return `
    <div style="
      width:min(88vw, 520px);
      margin:0 auto 18px;
      padding:18px 18px 20px;
      color:#1f1b15;
      background:#f3eddd;
      border:2px solid #2b2720;
      box-shadow:0 0 0 4px #d6ccb6 inset;
      font-family:'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif;
      text-align:left;
      line-height:1.65;
    ">
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        padding-bottom:6px;
        margin-bottom:10px;
        border-bottom:3px double #2b2720;
        font-size:14px;
        font-weight:bold;
      ">
        <span>${escapeHtml(dateText)} テレビ欄</span>
        <span>10:00</span>
      </div>
      <div style="
        display:grid;
        grid-template-columns:64px 1fr;
        gap:12px;
        align-items:start;
      ">
        <div style="
          padding:6px 4px;
          border:1px solid #2b2720;
          text-align:center;
          font-size:24px;
          font-weight:bold;
          line-height:1.05;
          background:rgba(255,255,255,0.32);
        ">時<br>代<br>劇</div>
        <div>
          <div style="
            margin-bottom:8px;
            padding-bottom:6px;
            border-bottom:1px solid #575044;
            font-size:24px;
            font-weight:bold;
            letter-spacing:0;
          ">${escapeHtml(title)}</div>
          <div style="font-size:16px;">${body}</div>
        </div>
      </div>
    </div>`;
}

function showTvGuideNewspaper() {
  const title = "天命　第29回　交差する刃";
  const summary = "それぞれが信じる正義のため、刃を向け合う三人。もはや言葉は届かない。戦乱の世が生んだ悲劇は、やがて国の行く末をも左右する大きなうねりとなっていく。";
  const content = buildTvGuideNewspaperContent(title, summary);

  showModal("新聞（テレビ欄）", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("新聞のテレビ欄に時代劇の紹介が載っている。");
}

function showCanInnerNewspaperClipping() {
  const title = "天命　第30話「刃を休める日」";
  const summary = `復讐だけを見据えて歩み続ける三ツ星紋の若者。
旅の老人は茶を差し出しながら、
「人は足元を見失うと転ぶものだ」
と静かに語る。
束の間の語らいの中で、若者は気づく。
足元にこそ、見落としていた真実が隠れていることを――。`;
  const content = buildTvGuideNewspaperContent(title, summary, "203X/6/2");

  showModal("新聞の切り抜き", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("新聞の切り抜きに時代劇の紹介が載っている。");
}

function showRecordingNotice() {
  const content = `
    <div style="
      width:min(84vw, 440px);
      margin:0 auto 18px;
      padding:22px 24px;
      background:#ffe8ef;
      color:#3a2430;
      border:2px solid #d99aaa;
      border-radius:6px;
      box-shadow:0 0 0 4px rgba(255,255,255,0.55) inset;
      text-align:left;
      line-height:1.85;
      font-size:16px;
    ">
      <div style="margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #d99aaa; font-size:22px; font-weight:bold; text-align:center;">録画時のお願い</div>
      <div>
        共用のビデオデッキを使うときは、<br>
        他の方のテープに上書き録画しないようご注意ください。<br>
        録画前に、ラベルをよく確認しましょう。
      </div>
    </div>`;

  showModal("録画に関する注意", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("録画に関する注意書きがある。");
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;

  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderStatusIcons() {
  const area = document.getElementById("statusIconArea");
  if (!area) return;

  // すでにあれば再描画だけ（追加予定が増えてもここで管理）
  area.innerHTML = "";
}

// アイテム管理
function addItem(itemId) {
  playSE("se-item");
  if (gameState.inventory.length < 14) {
    gameState.inventory.push(itemId);
    updateInventoryDisplay();
  } else {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
  }
}

function removeItem(itemId) {
  const index = gameState.inventory.indexOf(itemId);
  if (index !== -1) {
    gameState.inventory.splice(index, 1);
    gameState.selectedItem = null;
    gameState.selectedItemSlot = null;
    updateInventoryDisplay();
  }
}

function removeItemsOnEndingArrival(itemIds) {
  let changed = false;
  itemIds.forEach((itemId) => {
    let index = gameState.inventory.indexOf(itemId);
    while (index !== -1) {
      gameState.inventory.splice(index, 1);
      changed = true;
      index = gameState.inventory.indexOf(itemId);
    }
  });

  if (!changed) return;
  gameState.selectedItem = null;
  gameState.selectedItemSlot = null;
  updateInventoryDisplay();
}

function hasItem(itemId) {
  return gameState.inventory.includes(itemId);
}

function getInventoryPageSize() {
  return window.matchMedia("(max-width: 600px)").matches ? 5 : 7;
}

function getInventoryPageCount() {
  return Math.max(1, Math.ceil(gameState.inventory.length / getInventoryPageSize()));
}

function clampInventoryPage(page) {
  return Math.min(Math.max(page, 0), getInventoryPageCount() - 1);
}

function ensureInventoryPageState() {
  if (typeof gameState.inventoryPage !== "number" || Number.isNaN(gameState.inventoryPage)) {
    gameState.inventoryPage = 0;
  }
  gameState.inventoryPage = clampInventoryPage(gameState.inventoryPage);
}

function setInventoryPage(page) {
  ensureInventoryPageState();
  const nextPage = clampInventoryPage(page);
  if (gameState.inventoryPage === nextPage) return;
  gameState.inventoryPage = nextPage;
  updateInventoryDisplay();
}

function syncInventoryPageToSelection() {
  if (typeof gameState.selectedItemSlot !== "number") return;
  gameState.inventoryPage = clampInventoryPage(Math.floor(gameState.selectedItemSlot / getInventoryPageSize()));
}

function useItem(slotIndex) {
  const clickedItem = gameState.inventory[slotIndex];
  if (!clickedItem) return;

  // -------------------------
  // 1) 「使用対象を選んでください」中なら、クリックされたアイテムを対象として判定
  //    ・別アイテムクリックでフラグ解除（成功/失敗どっちでも）
  //    ・失敗時は無音（メッセージも出さない）
  // -------------------------
  if (gameState.usingItem) {
    // 同じスロットを押したらキャンセル（メッセージは出しても出さなくてもOK）
    if (gameState.usingItem.slotIndex === slotIndex) {
      clearUsingItem(true);
      return;
    }

    return;
  }

  // -------------------------
  // 2) 塩をクリックしたら「使用対象選択モード」へ
  // -------------------------
  if (clickedItem === "salt") {
    gameState.usingItem = { itemId: clickedItem, slotIndex };
    gameState.selectedItem = clickedItem;
    gameState.selectedItemSlot = slotIndex;
    updateMessage("使用対象を選んでください");
    updateInventoryDisplay();
    return;
  }

  // -------------------------
  // 3) それ以外は今まで通りの挙動（既存ロジック）
  // -------------------------

  // ★すでに選択中のスロットを再クリック → 解除
  if (gameState.selectedItem && gameState.selectedItemSlot !== slotIndex) {
    const a = gameState.selectedItem;
    const b = clickedItem;
    const isRemoconBatteryPair = (a === "battery" && b === "remoconBack") || (a === "remoconBack" && b === "battery");
    if (isRemoconBatteryPair) {
      removeItem("battery");
      removeItem("remoconBack");
      addItem("remocon");
      showModal("電池を入れた", `<img src="${IMAGES.modals.batterySet}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
      updateMessage("電池を入れた");
      return;
    }

    const isCleanFlypanPair = (a === "burntFlypan" && b === "cleanser") || (a === "cleanser" && b === "burntFlypan");
    if (isCleanFlypanPair) {
      const f = gameState.main.flags || (gameState.main.flags = {});
      removeItem("burntFlypan");
      removeItem("cleanser");
      f.flypanCleaned = true;
      markProgress?.("flypan_cleaned");
      playSE?.("se-cloth");
      renderCanvasRoom?.();
      showObj(null, "フライパンを磨いた", IMAGES.modals.cleanFlypan, "きれいになったフライパンをキッチンに置いた。");
      return;
    }

    const isTsuboFixPair = (a === "tape" && b === "tsubo") || (a === "tsubo" && b === "tape");

    const isCurtainRodPair = (a === "curtain" && b === "rod") || (a === "rod" && b === "curtain");
  }

  if (gameState.selectedItemSlot === slotIndex) {
    gameState.selectedItem = null;
    gameState.selectedItemSlot = null;
    updateMessage("アイテム選択を解除しました。");
    updateInventoryDisplay();
    return;
  }

  // ★通常の選択
  gameState.selectedItem = clickedItem;
  gameState.selectedItemSlot = slotIndex;
  updateMessage("アイテムを選択した。");
  updateInventoryDisplay();
}

function clearUsingItem(silent = true) {
  gameState.usingItem = null;
  gameState.selectedItem = null;
  gameState.selectedItemSlot = null;
  updateInventoryDisplay();
  // silent=true ならメッセージ更新もしない（失敗時は無音）
  if (!silent) updateMessage("アイテム選択を解除しました。");
}

function getItemName(itemId) {
  const names = {
    coin: "クマコイン",
    bear: "クマ妖精",
    key: "カギ",
    match: "マッチ",
    powerCode: "延長コード",
    cleanser: "クレンザー",
    burntFlypan: "焦げたフライパン",
    mop: "掃除用のほこり取り",
    stick: "箸",
    fertilizer: "肥料",
    jug: "水差し",
    jugWater: "水の入った水差し",
    battery: "電池",
    driver: "ドライバー",
    camera: "カメラ",
    picDaikonkun: "大根くんの写真",
    picDaikonkunBear: "大根くんとクマ妖精の写真",
    picBear: "クマ妖精の写真",
    daikonkun: "大根くんのぬいぐるみ",
    scale: "定規",
    yukata: "浴衣",
    memoSafe: "金庫のメモ",
    milk: "牛乳",
    yen300: "300円",
    raincoat: "レインコート",
    sweet: "七夕ゼリー",
    memo: "メモ",
  };
  return names[itemId] || itemId;
}

function openInventoryItemDetail(itemId, slotIndex, fallbackSrc) {
  const itemBaseSrc = IMAGES.items[itemId] || fallbackSrc;
  const itemEnSrc = IMAGES.items[`${itemId}En`];
  const hasEnVariant = !!itemEnSrc;

  let content = `<img src="${itemBaseSrc}" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`;
  let buttons = [{ text: "閉じる", action: "close" }];

  if (itemId === "message") {
    buttons = [
      {
        text: "読む",
        action: () => {
          window._nextModal = {
            title: "斥候のメッセージ",
            content: `
              <div style="max-width:420px; margin:0 auto; padding:24px 28px; background:#fff8dc; color:#2a2116; border:1px solid #d9c58d; box-shadow:inset 0 0 28px rgba(130,95,35,0.14), 0 6px 18px rgba(60,40,20,0.18); text-align:left; line-height:1.85;">
                敵陣は鷲の刻に歩哨を交代した。砦から敵陣までは30分かかる
              </div>
            `,
            buttons: [{ text: "閉じる", action: "close" }],
          };
          closeModal();
        },
      },
      { text: "閉じる", action: "close" },
    ];
  }

  if (itemId === "messageFortune") {
    buttons = [
      {
        text: "読む",
        action: () => {
          window._nextModal = {
            title: "占い師の紙",
            content: `
              <div style="max-width:420px; margin:0 auto; padding:24px 28px; background:#fff8dc; color:#2a2116; border:1px solid #d9c58d; box-shadow:inset 0 0 28px rgba(130,95,35,0.14), 0 6px 18px rgba(60,40,20,0.18); text-align:left; line-height:1.85;">
                次の敵陣の交代時刻に敵を攻めよ。敵は3時間ごとに歩哨を交代する
              </div>
            `,
            buttons: [{ text: "閉じる", action: "close" }],
          };
          closeModal();
        },
      },
      { text: "閉じる", action: "close" },
    ];
  }

  if (itemId === "glassWithWine" || itemId === "glassWithWater") {
    const drinkName = itemId === "glassWithWine" ? "ワイン" : "水";
    buttons = [
      {
        text: "飲む",
        action: () => {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (itemId === "glassWithWine") {
            f.glassWithWineDrinkCount = (Number(f.glassWithWineDrinkCount) || 0) + 1;
          }
          removeItem(itemId);
          addItem("glass");
          updateMessage(`${drinkName}を飲んだ。`);
          const showBadEndAfterDrink = itemId === "glassWithWine" && f.glassWithWineDrinkCount >= 2;
          closeModal();
          if (itemId === "glassWithWine") {
            showDrinkModal(IMAGES.modals.drinkWine, "ワインを飲む", showBadEndAfterDrink);
          } else {
            showDrinkModal(IMAGES.modals.drinkWater, "水を飲む");
          }
        },
      },
      { text: "閉じる", action: "close" },
    ];
  }

  if (itemId === "milk" && gameState.currentRoom === "restaurant") {
    buttons = [
      {
        text: "飲む",
        action: () => {
          window._nextModal = {
            title: "「飲食物の持ち込みはご遠慮ください」",
            content: `
              <img src="${IMAGES.modals.restaurant}" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">
              「お預かりいたしますね」
            `,
            buttons: [{ text: "閉じる", action: "close" }],
          };
          closeModal();
          removeItem("milk");
          updateMessage("牛乳は持ち去られてしまった");
        },
      },
      { text: "閉じる", action: "close" },
    ];
  }

  if (hasEnVariant && itemId !== "sheet" && itemId !== "sheetComplete3") {
    const zoomImgId = `invZoom_${Date.now()}_${typeof slotIndex === "number" ? slotIndex : "selected"}`;
    let isEn = uiLang === "en";
    content = `<img id="${zoomImgId}" src="${isEn ? itemEnSrc : itemBaseSrc}" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`;
    buttons = [
      {
        text: "🌐 EN/JP",
        action: () => {
          const target = document.getElementById(zoomImgId);
          if (!target) return;
          uiLang = uiLang === "en" ? "jp" : "en";
          isEn = uiLang === "en";
          target.src = isEn ? itemEnSrc : itemBaseSrc;
        },
      },
    ];
    if (itemId === "interviewNote") {
      buttons.push({
        text: "裏を見る",
        action: () => {
          window._nextModal = {
            title: "インタビューノート",
            content: `<img src="${IMAGES.modals.interviewNoteBack}" style="max-width:380px;max-height:80vh;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">付箋が貼られている`,
            buttons: [{ text: "閉じる", action: "close" }],
          };
          closeModal();
        },
      });
    }

    if (itemId === "fileFresh") {
      buttons.push({
        text: "中を読む",
        action: () => {
          window._nextModal = {
            title: "新人研修ファイル",
            content: `
                    <div style="max-width:560px; margin:0 auto; padding:24px 26px; background:#fffdf2; color:#2b2116; border:1px solid #d8c99c; box-shadow:inset 0 0 24px rgba(120,90,40,0.12); text-align:left; line-height:1.75; font-size:0.96em; white-space:pre-line;">
■ 木造（Wooden Structure）
軽くてコストが安い、施工が早い
断熱性が高く、住み心地が良い
耐火性・耐久性は他構造より劣る
シロアリ・湿気対策が重要

■ 鉄骨造（Steel Structure）
強度が高く、間取りの自由度が高い
品質が安定しやすい（工場製作）
木造より耐久性が高い
断熱性・防音性はやや弱め

■ 鉄筋コンクリート造（RC）
耐火性・耐久性・遮音性が高い
重量があり地震時の安定性が高い
気密性が高く、断熱設計が重要
コストが高く、工期が長い
                    </div>
                  `,
            buttons: [{ text: "閉じる", action: "close" }],
          };
          closeModal();
        },
      });
    }

    buttons.push({ text: "閉じる", action: "close" });
  }

  showModal(getItemName(itemId), content, buttons);
}

function renderNavigation() {
  const navDiv = document.querySelector(".navigation");
  navDiv.innerHTML = "";

  const isMobile = window.matchMedia("(max-width: 600px)").matches;

  if (isMobile) {
    const btn = document.createElement("button");
    btn.className = "nav-btn";
    btn.textContent = "ナビ";
    btn.onclick = () => openNavModal();
    navDiv.appendChild(btn);
    return;
  }

  // PCは従来通り（ルームボタン並べる）
  gameState.openRooms
    .filter((roomId) => rooms[roomId])
    .forEach((roomId) => {
      const b = document.createElement("button");
      b.className = "nav-btn";
      b.textContent = rooms[roomId].name;
      b.onclick = () => changeRoom(roomId);
      navDiv.appendChild(b);
    });
}

function openNavModal() {
  const cur = gameState.currentRoom;
  const listHtml = `
    <div style="display:flex;flex-direction:column;gap:10px;max-height:60vh;overflow:auto;">
      ${gameState.openRooms
        .filter((roomId) => rooms[roomId])
        .map((roomId) => {
          const isHere = roomId === cur;
          return `
          <button class="nav-btn" style="width:100%; opacity:${isHere ? 0.5 : 1};"
            ${isHere ? "disabled" : ""}
            onclick="(function(){ closeModal(); changeRoom('${roomId}'); })()">
            ${rooms[roomId].name}${isHere ? "（ここ）" : ""}
          </button>
        `;
        })
        .join("")}
    </div>
  `;
  showModal("移動先", listHtml, [{ text: "閉じる", action: "close" }]);
}

function addNaviItem(room) {
  if (!gameState.openRooms.includes(room)) {
    gameState.openRooms.push(room);
    return true;
  }
  return false;
}

// インベントリ表示更新
function updateInventoryDisplay() {
  ensureInventoryPageState();
  const slots = document.querySelectorAll(".inventory-slot");
  const prevButton = document.getElementById("inventoryPrev");
  const nextButton = document.getElementById("inventoryNext");
  const inspectButton = document.getElementById("inventoryInspect");
  const clearButton = document.getElementById("inventoryClear");
  const selectedName = document.getElementById("inventorySelectedName");
  const selectedThumb = document.getElementById("inventorySelectedThumb");
  const pageSize = getInventoryPageSize();
  const pageStart = gameState.inventoryPage * pageSize;
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  const mobileFilledSlotMinSize = "42px";
  slots.forEach((slot, visibleIndex) => {
    slot.style.display = visibleIndex < pageSize ? "flex" : "none";
    if (visibleIndex >= pageSize) return;
    const index = pageStart + visibleIndex;
    slot.innerHTML = "";
    slot.onclick = () => useItem(index);
    slot.dataset.slotIndex = String(index);
    if (gameState.inventory[index]) {
      if (isMobile) {
        slot.style.minWidth = mobileFilledSlotMinSize;
        slot.style.minHeight = mobileFilledSlotMinSize;
      } else {
        slot.style.minWidth = "";
        slot.style.minHeight = "";
      }
      const invItemId = gameState.inventory[index];
      const img = document.createElement("img");
      img.src = IMAGES.items[invItemId];
      img.onerror = function () {
        // 画像が読み込めない場合はプレースホルダーを表示
        this.style.display = "none";
        const placeholder = document.createElement("div");
        placeholder.className = "image-placeholder";
        placeholder.textContent = getItemName(invItemId);
        placeholder.style.width = "60px";
        placeholder.style.height = "60px";
        slot.appendChild(placeholder);
      };
      if (invItemId === "sheet") {
        const f = gameState.main.flags || {};
        const stampState = f.sheetStamps || {};
        const hasBrownStamp = !!(stampState.stampBrown || stampState.stampMomiji);
        const thumbLayers = [IMAGES.items.sheet, stampState.stampViolet ? IMAGES.items.stampViolet : null, stampState.stampGreen ? IMAGES.items.stampGreen : null, hasBrownStamp ? IMAGES.items.stampBrownBase : null, hasBrownStamp ? IMAGES.items.stampBrown1 : null].filter(Boolean);

        const thumb = document.createElement("div");
        thumb.style.position = "relative";
        thumb.style.width = "100%";
        thumb.style.height = "100%";

        thumbLayers.forEach((src, layerIndex) => {
          const layerImg = layerIndex === 0 ? img : document.createElement("img");
          layerImg.src = src;
          layerImg.style.position = "absolute";
          layerImg.style.inset = "0";
          layerImg.style.width = "100%";
          layerImg.style.height = "100%";
          layerImg.style.objectFit = "contain";
          layerImg.style.pointerEvents = "none";
          thumb.appendChild(layerImg);
        });
        slot.appendChild(thumb);
      } else {
        slot.appendChild(img);
      }
      const magBtn = document.createElement("div");
      magBtn.className = "magnifier-btn";
      magBtn.title = "拡大表示";
      magBtn.innerHTML = '<img src="https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/magnifier.png" alt="拡大">';
      magBtn.onclick = (e) => {
        e.stopPropagation();
        openInventoryItemDetail(gameState.inventory[index], index, img.src);
      };
      slot.appendChild(magBtn);
    } else {
      slot.style.minWidth = "";
      slot.style.minHeight = "";
    }
    if (gameState.selectedItemSlot === index) {
      slot.classList.add("selected");
    } else {
      slot.classList.remove("selected");
    }
  });

  if (prevButton) {
    prevButton.disabled = gameState.inventoryPage <= 0;
    prevButton.onclick = () => setInventoryPage(gameState.inventoryPage - 1);
  }
  if (nextButton) {
    nextButton.disabled = gameState.inventoryPage >= getInventoryPageCount() - 1;
    nextButton.onclick = () => setInventoryPage(gameState.inventoryPage + 1);
  }

  const selectedSlotIndex = typeof gameState.selectedItemSlot === "number" ? gameState.selectedItemSlot : null;
  const selectedItemId = selectedSlotIndex !== null ? gameState.inventory[selectedSlotIndex] : null;

  if (selectedThumb) {
    selectedThumb.innerHTML = "";
    if (selectedItemId && IMAGES.items[selectedItemId]) {
      const thumbImg = document.createElement("img");
      thumbImg.src = IMAGES.items[selectedItemId];
      thumbImg.alt = getItemName(selectedItemId);
      selectedThumb.appendChild(thumbImg);
    }
  }

  if (selectedName) {
    selectedName.textContent = selectedItemId ? getItemName(selectedItemId) : "なし";
  }

  if (inspectButton) {
    inspectButton.disabled = !selectedItemId;
    inspectButton.onclick = () => {
      if (!selectedItemId) return;
      openInventoryItemDetail(selectedItemId, selectedSlotIndex, IMAGES.items[selectedItemId]);
    };
  }

  if (clearButton) {
    clearButton.disabled = !selectedItemId;
    clearButton.onclick = () => {
      if (!selectedItemId) return;
      clearUsingItem(false);
    };
  }
}

// メッセージ更新
function updateMessage(message) {
  //document.getElementById('messageArea').innerHTML = message;
  document.getElementById("msgText").textContent = message;
  try {
    renderStatusIcons();
  } catch (e) {}
}

function updateMessageHTML(html) {
  const el = document.getElementById("msgText");
  el.innerHTML = html;
  try {
    renderStatusIcons();
  } catch (e) {}
  el.querySelectorAll("a").forEach((a) => {
    a.target = "_blank";
    a.rel = "noopener";
    a.style.color = "#d4af37";
    a.style.textDecoration = "underline";
  });
}

// モーダル表示
function showModal(title, content, buttons, onSequenceSuccess, options) {
  options = options || {};
  const modalContent = document.getElementById("modalContent");
  modalContent.className = "modal-content";
  if (options.contentClass) modalContent.classList.add(...options.contentClass.split(/\s+/).filter(Boolean));
  let modalHtml = `<h3>${title}</h3><div>${content}</div>`;
  if (buttons && buttons.length > 0) {
    const columnStyle = options.columnButtons ? "display:flex; flex-direction:column; gap:12px; align-items:stretch;" : "text-align:center; display:flex; gap:10px; justify-content:center;";

    modalHtml += `<div id="modalButtons" style="${columnStyle}"></div>`;
    modalHtml += `<div id="modalClose" style="margin-top:25px;text-align:center;"></div>`;
  }
  modalContent.innerHTML = modalHtml;
  document.getElementById("modal").style.display = "flex";

  if (!buttons || buttons.length === 0) return;

  let pressed = [];
  let heartCnt = 0;
  let checkCnt = 0;
  let houseCnt = 0;

  // 画像/通常ボタンとcloseボタンで分ける
  const modalButtons = document.getElementById("modalButtons");
  const modalClose = document.getElementById("modalClose");

  buttons.forEach((button, idx) => {
    // 閉じるボタンは下へ
    if (button.action === "close") {
      const btn = document.createElement("button");
      btn.textContent = button.text || "閉じる";
      btn.className = "modal-close-btn";
      btn.onclick = function () {
        closeModal();
        if (typeof onSequenceSuccess === "function") {
          onSequenceSuccess();
        }
      };
      modalClose.appendChild(btn);
    } else {
      const btn = document.createElement("button");
      btn.style.margin = "0 10px 10px 0";
      if (button.img) {
        btn.innerHTML = `<img src="${button.img}" alt="${button.text || ""}" style="width:80px;height:80px;vertical-align:middle;">`;
      } else {
        btn.textContent = button.text;
        btn.className = "text-btn";
      }
      btn.onclick = function () {
        if (button.action === "restart") {
          restartGame();
        } else if (typeof button.action === "function") {
          button.action();
        } else if (typeof button.action === "string") {
          closeModal();
          handleAreaClick(button.action);
        }
      };
      modalButtons.appendChild(btn);
    }
  });
}

function showTanzakuModal(color, title, text, marker) {
  const markerSide = marker?.side === "right" ? "right" : "left";
  let markerContent = "";
  if (marker?.shape === "pentagon") {
    markerContent = `<svg class="tanzaku-marker-shape" viewBox="0 0 48 48" aria-hidden="true"><polygon points="24 4 44 19 36 44 12 44 4 19"></polygon></svg>`;
  } else if (marker?.shape === "diamond") {
    markerContent = `<svg class="tanzaku-marker-shape" viewBox="0 0 48 48" aria-hidden="true"><polygon points="24 4 44 24 24 44 4 24"></polygon></svg>`;
  } else if (marker?.text) {
    markerContent = marker.text;
  }
  const markerHtml = markerContent ? `<span class="tanzaku-marker tanzaku-marker-${markerSide} notranslate" translate="no" lang="en" style="--marker-color:${marker.color || "#ff8a00"}">${markerContent}</span>` : "";
  showModal(title, `${markerHtml}<p class="tanzaku-message">${text}</p>`, [{ text: "閉じる", action: "close" }], null, {
    contentClass: `tanzaku-paper-modal tanzaku-${color}`,
  });
}

function showBlackTanzakuModal(text, showBack = false) {
  const frontContent = `<p class="tanzaku-message">${text}</p>`;
  const backContent = `
    <div
      aria-label="長さの異なる4本の白い棒"
      style="min-height:180px; display:flex; align-items:center; justify-content:center; gap:4px;"
    >
      ${MAIN_DESK_THIRD_DRAWER_ANSWER.map(
        (value) => `
          <span style="width:min(12vw, 64px); aspect-ratio:1; box-sizing:border-box; display:flex; align-items:center; justify-content:flex-start; padding:7px; background:#3f3f3f; border:1px solid rgba(255,255,255,0.3); border-radius:3px;">
            <span style="display:block; width:${MAIN_DESK_THIRD_DRAWER_BAR_WIDTHS[value]}; height:8px; border-radius:999px; background:#fff;"></span>
          </span>
        `,
      ).join("")}
    </div>
  `;
  const buttons = [
    {
      text: showBack ? "表を見る" : "裏を見る",
      action: () => showBlackTanzakuModal(text, !showBack),
    },
    { text: "閉じる", action: "close" },
  ];

  showModal("黒の短冊", showBack ? backContent : frontContent, buttons, null, {
    contentClass: "tanzaku-paper-modal tanzaku-darkgray",
  });
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  // 次のモーダルが登録されていれば表示
  if (window._nextModal) {
    // 登録内容は {title, content, buttons, after} オブジェクト
    let modal = window._nextModal;
    window._nextModal = null; // クリア

    if (typeof modal === "function") {
      try {
        modal();
      } catch (e) {}
      window.dispatchEvent(new Event("modal:closed"));
      return;
    }

    if (modal.before) modal.before();
    showModal(modal.title, modal.content, modal.buttons);
    if (modal.after) modal.after();
  }
  window.dispatchEvent(new Event("modal:closed"));
}

// ゲームリスタート
function restartGame() {
  gameState = getDefaultGameState();
  closeModal();
  initGame();
  updateInventoryDisplay();
}

let isBGMPlaying = false;
let isBGMInitialized = false; // 初回クリック判定用

function setDefaultBGMSource() {
  const bgm = document.getElementById("bgm");
  if (bgm && !bgm.getAttribute("src")) {
    bgm.src = DEFAULT_BGM;
  }
}

setDefaultBGMSource();

// 初回クリック時にだけBGMを再生
function initBGMOnce() {
  if (!isBGMInitialized) {
    const bgm = document.getElementById("bgm");
    setDefaultBGMSource();
    bgm.volume = 0.25;
    bgm.play();
    isBGMPlaying = true;
    isBGMInitialized = true;
    document.getElementById("bgm-toggle").textContent = "🔊 BGM";
  }
}
window.addEventListener("click", initBGMOnce, { once: true });

function toggleBGM() {
  const bgm = document.getElementById("bgm");
  const btn = document.getElementById("bgm-toggle");
  if (!isBGMPlaying) {
    bgm.play();
    isBGMPlaying = true;
    btn.textContent = "🔊 BGM";
  } else {
    bgm.pause();
    isBGMPlaying = false;
    btn.textContent = "🔇 BGM";
  }
}

function changeBGM(newSrc) {
  const bgm = document.getElementById("bgm");
  // ファイル名のみで比較
  const current = bgm.src.split("/").pop();
  const next = newSrc.split("/").pop();
  if (current === next) return; // すでにそのBGMなら何もしない

  const isPlaying = isBGMPlaying;
  bgm.pause();
  bgm.src = newSrc;
  bgm.load();
  if (isPlaying) {
    bgm.play();
  }
}

function pauseBGM() {
  const bgm = document.getElementById("bgm");
  bgm.src = "";
  bgm.pause();
}

function playSE(id) {
  const se = document.getElementById(id);
  se.currentTime = 0;
  se.play();
}
// どこかで最初に一度だけ呼ぶ
let loadedImages = {};
let loadedVideos = {};
function isVideoSrc(src) {
  return typeof src === "string" && /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(src);
}
function preloadVideo(src) {
  if (loadedVideos[src]) return;

  const video = document.createElement("video");
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.src = src;
  video.load();
  loadedVideos[src] = video;
}
function preloadImages() {
  // 部屋画像
  Object.values(IMAGES.rooms).forEach((val) => {
    // ★追加：{jp:[...], en:[...]} 形式
    if (val && typeof val === "object" && !Array.isArray(val)) {
      ["jp", "en"].forEach((lang) => {
        const list = val[lang];
        if (Array.isArray(list)) {
          list.forEach((src) => {
            if (!loadedImages[src]) {
              const img = new Image();
              img.onload = () => {
                try {
                  renderCanvasRoom();
                } catch (e) {}
              };
              img.src = src;
              loadedImages[src] = img;
            }
          });
        } else if (typeof list === "string") {
          if (!loadedImages[list]) {
            const img = new Image();
            img.onload = () => {
              try {
                renderCanvasRoom();
              } catch (e) {}
            };
            img.src = list;
            loadedImages[list] = img;
          }
        }
      });
      return; // ★このvalの処理は終わり
    }
    if (Array.isArray(val)) {
      val.forEach((src) => {
        if (!loadedImages[src]) {
          const img = new Image();
          img.onload = () => {
            try {
              renderCanvasRoom();
            } catch (e) {}
          };
          img.src = src;
          loadedImages[src] = img;
        }
      });
    } else if (typeof val === "string") {
      if (!loadedImages[val]) {
        const img = new Image();
        img.onload = () => {
          try {
            renderCanvasRoom();
          } catch (e) {}
        };
        img.src = val;
        loadedImages[val] = img;
      }
    }
  });
  // アイテム画像
  Object.values(IMAGES.items).forEach((src) => {
    if (!loadedImages[src]) {
      const img = new Image();
      img.onload = () => {
        try {
          renderCanvasRoom();
        } catch (e) {}
      };
      img.src = src;
      loadedImages[src] = img;
    }
  });
  // モーダル画像
  Object.values(IMAGES.modals).forEach((src) => {
    if (isVideoSrc(src)) {
      preloadVideo(src);
      return;
    }
    if (!loadedImages[src]) {
      const img = new Image();
      img.onload = () => {
        try {
          renderCanvasRoom();
        } catch (e) {}
      };
      img.src = src;
      loadedImages[src] = img;
    }
  });
}

// save&load
function saveGameToSlot(slotIndex) {
  const toSave = { ...gameState, __version: SAVE_VERSION };

  const payload = {
    data: toSave,
    savedAt: Date.now(),
  };

  localStorage.setItem(SAVE_KEYS[slotIndex], JSON.stringify(payload));
  updateMessage(`セーブ${slotIndex + 1}に保存しました！`);
}

function loadGameFromSlot(slotIndex) {
  const raw = localStorage.getItem(SAVE_KEYS[slotIndex]);
  if (!raw) {
    updateMessage(`セーブ${slotIndex + 1}のデータがありません`);
    return;
  }

  let saved;
  try {
    const parsed = JSON.parse(raw);
    // 新形式：{ data: {...}, savedAt: ... }
    if (parsed && parsed.data) {
      saved = parsed.data;
    } else {
      // 旧形式：そのまま gameState が入っている
      saved = parsed;
    }
  } catch (e) {
    console.error(e);
    updateMessage("セーブデータの読み込みに失敗しました");
    return;
  }

  const def = getDefaultGameState();
  const merged = deepMerge(def, saved);

  if (!Array.isArray(merged.openRooms)) merged.openRooms = def.openRooms.slice();
  merged.openRooms = merged.openRooms.filter((roomId) => rooms[roomId]);
  if (merged.openRooms.length === 0) merged.openRooms = def.openRooms.slice();
  if (!merged.currentRoom || !rooms[merged.currentRoom]) merged.currentRoom = def.currentRoom;

  const mergedFlags = merged.main?.flags || {};
  if (mergedFlags.foundMainDeskTopDrawerPowerCode) mergedFlags.senkoBurned = true;
  syncSenkoBlownFlag(mergedFlags);
  gameState = merged;

  changeRoom(gameState.currentRoom);
  updateInventoryDisplay?.();
  renderNavigation?.();
  updateMessage(`セーブ${slotIndex + 1}をロードしました！`);
}

function getSaveSlotLabel(slotIndex) {
  const raw = localStorage.getItem(SAVE_KEYS[slotIndex]);
  if (!raw) {
    return `セーブ${slotIndex + 1}（空）`;
  }
  try {
    const parsed = JSON.parse(raw);
    const savedAt = parsed.savedAt;
    if (!savedAt) {
      return `セーブ${slotIndex + 1}（日時不明）`;
    }
    const d = new Date(savedAt);
    const jp = d.toLocaleString("ja-JP");
    return `セーブ${slotIndex + 1}（${jp}）`;
  } catch {
    return `セーブ${slotIndex + 1}（読み込みエラー）`;
  }
}

function openLoadMenu() {
  const buttons = [
    {
      text: getSaveSlotLabel(0),
      action: () => {
        loadGameFromSlot(0);
        closeModal();
      },
    },
    {
      text: getSaveSlotLabel(1),
      action: () => {
        loadGameFromSlot(1);
        closeModal();
      },
    },
    { text: "やめる", action: "close" },
  ];

  showModal("ロードするデータを選んでください", "", buttons, null, {
    columnButtons: true,
  });
}

function saveGame() {
  const buttons = [
    {
      text: getSaveSlotLabel(0) + " に上書き保存",
      action: () => {
        saveGameToSlot(0);
        closeModal();
      },
    },
    {
      text: getSaveSlotLabel(1) + " に上書き保存",
      action: () => {
        saveGameToSlot(1);
        closeModal();
      },
    },
    { text: "やめる", action: "close" },
  ];

  showModal("セーブ先を選んでください", "", buttons, null, {
    columnButtons: true,
  });
}

function loadGame() {
  openLoadMenu();
}

function deepMerge(target, source) {
  if (source === undefined || source === null) return target;
  if (Array.isArray(source)) return source.slice();
  if (typeof source === "object") {
    const out = target && typeof target === "object" ? { ...target } : {};
    for (const k of Object.keys(source)) {
      out[k] = deepMerge(target ? target[k] : undefined, source[k]);
    }
    return out;
  }
  return source;
}

function showToast(text, ms = 2600) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = text;
  el.style.opacity = "1";
  el.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(-8px)";
  }, ms);
}

window.addEventListener("resize", () => renderNavigation());

// ゲーム開始
preloadImages();
initGame();
