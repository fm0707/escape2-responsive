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
const BASE_38 = USE_LOCAL_ASSETS ? "images/38" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/38";
const BASE_SOUND_38 = USE_LOCAL_ASSETS ? "sounds/38" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/38";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I38 = (file) => `${BASE_38}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S38 = (file) => `${BASE_SOUND_38}/${file}`;
const DEFAULT_BGM = S38("insomnia.mp3");
// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    mainDoor: [I38("main_door.webp")],
    mainCounter: [I38("main_counter.webp")],
    mainTable: [I38("main_table.webp")],
    mainStorage: [I38("main_storage.webp")],
    board: [I38("board.webp")],
    canInner: [I38("can_inner.webp")],
    kitchenDoor: [I38("kitchen_door.webp")],
    kitchen: [I38("kitchen.webp")],

    end: [I38("end.webp"), I38("end2.webp")],
    trueEnd: [I38("true_end.webp"), I38("true_end2.webp"), I38("true_end3.webp")],
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
    key: ICM("common/key.webp"),
    battery: ICM("common/battery.webp"),
    driver: ICM("common/driver.webp"),

    card: I38("card.webp"),
    glassVessel: I38("glass_vessel.webp"),
    glassVesselBroken: I38("glass_vessel_broken.webp"),
    tv: I38("tv.webp"),
    tv2: I38("tv2.webp"),
    remocon: I38("remocon.webp"),
    remoconBack: I38("remocon_back.webp"),
    cup: I38("cup.webp"),
    cupWithTea: I38("cup_with_tea.webp"),
    koma: I38("koma.webp"),
    cross: I38("cross.webp"),
    bolt: I38("bolt.webp"),
    boltBoard: I38("bolt_board.webp"),
    tape: I38("tape.webp"),
    teaPowder: I38("tea_powder.webp"),
    earplug: I38("earplug.webp"),
    candy: I38("candy.webp"),
    review3: I38("review_3.webp"),
    kebab: I38("kebab.webp"),
  },
  modals: {
    iconCat: I38("icon_cat.webp"),
    iconBear: I38("icon_bear.webp"),
    iconPlane: I38("icon_plane.webp"),
    iconHorse: I38("icon_horse.webp"),
    iconCar: I38("icon_car.webp"),
    iconShip: I38("icon_ship.webp"),
    iconFish: I38("icon_fish.webp"),
    iconFlower: I38("icon_flower.webp"),
    iconCandy: I38("icon_candy.webp"),
    picCatBlack1: I38("pic_cat_black_1.webp"),
    picCatBlack2: I38("pic_cat_black_2.webp"),
    picCatBlack3: I38("pic_cat_black_3.webp"),
    picCatBlack4: I38("pic_cat_black_4.webp"),
    picCatBlack5: I38("pic_cat_black_5.webp"),
    picCatMike1: I38("pic_cat_mike_1.webp"),
    picCatMike2: I38("pic_cat_mike_2.webp"),
    picCatMike3: I38("pic_cat_mike_3.webp"),
    picCatMike4: I38("pic_cat_mike_4.webp"),
    picCatMike5: I38("pic_cat_mike_5.webp"),
    picCatKiji1: I38("pic_cat_kiji_1.webp"),
    picCatKiji2: I38("pic_cat_kiji_2.webp"),
    picCatKiji3: I38("pic_cat_kiji_3.webp"),
    picCatKiji4: I38("pic_cat_kiji_4.webp"),
    picCatKiji5: I38("pic_cat_kiji_5.webp"),
    posterCat: I38("modal_poster_cat.webp"),
    posterRadio: I38("modal_poster_radio.webp"),
    posterRadioEn: I38("modal_poster_radio_en.webp"),
    radioBigSound: I38("modal_radio_big_sound.webp"),
    badendRadio: I38("badend_radio.webp"),
    boardgames: I38("modal_board_games.webp"),
    newspaper: I38("modal_newspaper.webp"),
    batterySet: I38("modal_battery_set.webp"),
    magazine7: I38("modal_magazine_7.webp"),
    magazine7en: I38("modal_magazine_7_en.webp"),
    magazine2: I38("modal_magazine_2.webp"),
    magazine2en: I38("modal_magazine_2_en.webp"),
    magazine3: I38("modal_magazine_3.webp"),
    magazine3en: I38("modal_magazine_3_en.webp"),
    manualGame: I38("modal_manual_game.webp"),
    clock1010: I38("modal_clock_1010.webp"),
    clock12: I38("modal_clock_12.webp"),
    clock9: I38("modal_clock_9.webp"),
    kamonWave: I38("kamon_wave.webp"),
    kamonFlower: I38("kamon_flower.webp"),
    kamonSquare: I38("kamon_square.webp"),
    kamonStar: I38("kamon_star.webp"),
    komaPut: I38("modal_koma_put.webp"),
    komaJump: I38("modal_koma_jump.webp"),
    karuta: I38("modal_karuta.webp"),
    cupFish: I38("modal_cup_fish.webp"),
    window: I38("modal_window.webp"),
    car: I38("modal_car.webp"),
    posterHorse: I38("modal_poster_horse.webp"),
    posterShip: I38("modal_poster_ship.webp"),
    posterFlower: I38("modal_poster_flower.webp"),
    driverTv: I38("modal_driver_tv.webp"),
    driverCookie: I38("modal_driver_cookie.webp"),
    teaPowder: I38("modal_tea_powder.webp"),
    teaMake: I38("modal_tea_make.webp"),
    bearTea: I38("modal_bear_tea.webp"),
    bearVanish: I38("modal_bear_vanish.webp"),
    bearKebab1: I38("modal_bear_kebab.webp"),
    bearKebab2: I38("modal_bear_kebab2.webp"),
    qr: I38("qr.webp"),
    review1: I38("review_1.webp"),
    review2: I38("review_2.webp"),
    review4: I38("review_4.webp"),
    review1en: I38("review_1_en.webp"),
    review2en: I38("review_2_en.webp"),
    review3en: I38("review_3_en.webp"),
    review4en: I38("review_4_en.webp"),
    iconRamen: I38("icon_ramen.webp"),
    iconGyoza: I38("icon_gyoza.webp"),
    iconOnigiri: I38("icon_onigiri.webp"),
    iconKebab: I38("icon_kebab.webp"),
    objectFoot: I38("modal_object_foot.webp"),
    picOasis: I38("modal_pic_oasis.webp"),
    bearEat: I38("modal_bear_eat.webp"),
  },
};

const CARD_GRID_CELLS = [
  { key: "topLeft", max: 2, icon: IMAGES.modals.iconFish, label: "FISH" },
  { key: "topCenter", max: 2, icon: IMAGES.modals.iconFlower, label: "FLOWER" },
  { key: "topRight", max: 3, icon: IMAGES.modals.iconCat, label: "CAT" },
  { key: "middleLeft", max: 2, icon: IMAGES.modals.iconBear, label: "BEAR" },
  { key: "middleCenter", max: 1, icon: IMAGES.modals.iconCandy, label: "CANDY" },
  { key: "middleRight", max: 5, icon: IMAGES.modals.iconPlane, label: "PLANE" },
  { key: "bottomLeft", max: 1, icon: IMAGES.modals.iconShip, label: "SHIP" },
  { key: "bottomCenter", max: 3, icon: IMAGES.modals.iconCar, label: "CAR" },
  { key: "bottomRight", max: 2, icon: IMAGES.modals.iconHorse, label: "HORSE" },
];

const RADIO_DIAL_DIRECTIONS = [
  { label: "上", angle: 0 },
  { label: "右上", angle: 45 },
  { label: "右", angle: 90 },
  { label: "右下", angle: 135 },
  { label: "下", angle: 180 },
  { label: "左下", angle: 225 },
  { label: "左", angle: 270 },
  { label: "左上", angle: 315 },
];

// ゲーム状態
const SAVE_KEY = "escapeGameState38";
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
    currentRoom: "mainDoor",
    openRooms: ["mainDoor"],
    openRoomsTmp: [],
    inventory: ["card"],
    main: {
      flags: {
        unlockArmoryTreasureChest: false,
        unlockMainCounterCabinet: false,
        unlockMainStorageSlimLockerLeft: false,
        unlockMainStorageSlimLockerSecond: false,
        unlockMainStorageSlimLockerThird: false,
        unlockMainStorageSlimLockerRight: false,
        unlockMainStorageRightLocker: false,
        unlockMainDoor: false,
        unlockKitchenDoor: false,
        unlockKitchenExitDoor: false,
        unlockKitchenFridge: false,
        unlockMailbox: false,
        unlockKitchenBox: false,
        unlockEntranceShutter: false,
        unlockShelfLeftCabinetMiddle: false,
        unlockWindowRightVabinet: false,
        unlockLockerCenterTop: false,
        gaveKebabToBearFairy: false,
        boardKomaPlaced: false,
        bearAppear: false,
        brokenVessel: false,
        removeBoltBoard: false,
        removeBoltCookie: false,
        putEarPlug: false,
        putMirror: false,
        radioActivated: false,
        tvPowerOn: false,
        videoTapeInserted: false,
        isNight: false,
        isCurtainClosed: false,
        foundRemocon: false,
        foundCanInnerTeaPowder: false,
        foundKitchenDrawerKey: false,
        foundMainCounterCabinetCup: false,
        foundMainStorageRightLockerTape: false,
        foundMainStorageSlimLockerLeftBattery: false,
        foundMainStorageSlimLockerSecondDriver: false,
        foundMainStorageSlimLockerThirdEarplug: false,
        foundMainStorageSlimLockerRightKoma: false,
        foundKitchenFridgeKebab: false,
        foundMailboxMessage: false,
        foundKitchenBoxCleanDish: false,
        foundMirror: false,
        foundTranceiverMessage: false,
        foundTranceiverPudding: false,
        foundKitchenBoxPudding: false,
        foundMainDoorCard: true,
        unlockTranceiverUpperDoor: false,
        unlockTranceiverLowerDoor: false,
        checkGreenClock: false,
        guardMasterDrinkItem: "",
        badMannerPuddingAttempts: 0,
        badMannerPuddingRoom: "",
        onigiriCoinSequence: [],
        bookReturnRoom: "",
        daemonBearSoupDeniedCount: 0,
        daemonBearBackTurned: false,
        daemonBearEating: false,
        daemonBearFinishedPudding: false,
        succeedFireSpell: false,
        repairedGlassByWizard: false,
        kingDepartureTimeMinutes: 12 * 60,
        radioDialDirections: [0, 0],
        mainStorageRightLockerCats: [0, 0, 0],
        mainStorageSlimLockerLeftLetters: [0, 0, 0, 0, 0],
        mainStorageSlimLockerSecondLetters: [0, 0, 0, 0],
        mainStorageSlimLockerThirdSymbols: [0, 0, 0],
        mainStorageSlimLockerRightKamons: [0, 0, 0],
        cardFinds: {},
        glassWithWineDrinkCount: 0,
        sheetStamps: {},

        talkTo: { bear: 0, wizard: 0 },
      },
    },

    end: {
      flags: { backgroundState: 0 },
    },
    trueEnd: {
      flags: { backgroundState: 0 },
    },

    flags: { trueEndUnlocked: false },
    selectedItem: null,
    selectedItemSlot: null,
    usingItem: null,
    inventoryPage: 0,
    endings: { true: false, normal2: false, normal: false },
  };
}

let gameState = getDefaultGameState();
let daemonBearEatingTimer = null;

// 部屋データ
let rooms = {
  mainDoor: {
    name: "出口ドア前",
    description: "",
    clickableAreas: [
      {
        x: 61.9,
        y: 40.9,
        width: 6.4,
        height: 8.6,
        onClick: clickWrap(handleMainDoorQrReaderClick),
        description: "ドア横QRリーダー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 36.9,
        y: 29.3,
        width: 20.1,
        height: 45.2,
        onClick: clickWrap(handleMainDoorClick),
        description: "ドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 6.7,
        y: 34.5,
        width: 6.4,
        height: 9.0,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterCat, "映画のポスターが貼られている");
        }),
        description: "猫映画のポスター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 10.5,
        y: 52.6,
        width: 5.7,
        height: 6.3,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.magazine7, "雑誌がある", IMAGES.modals.magazine7en);
        }),
        description: "雑誌左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 17.0,
        y: 52.6,
        width: 5.7,
        height: 6.3,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.magazine2, "雑誌がある", IMAGES.modals.magazine2en);
        }),
        description: "雑誌中",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 23.7,
        y: 52.6,
        width: 6.0,
        height: 6.3,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.magazine3, "雑誌がある", IMAGES.modals.magazine3en);
        }),
        description: "雑誌右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 73.7,
        y: 30.6,
        width: 10.4,
        height: 13.6,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterFlower, "お花の絵が飾られている");
          findCardMarks("topCenter", ["mainDoorFlowerPosterA", "mainDoorFlowerPosterB"], "カードが反応した");
        }),
        description: "お花の絵",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },

      {
        x: 66.6,
        y: 81.8,
        width: 10.8,
        height: 5.4,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.newspaper, "新聞に謎の図が書かれている");
        }),
        description: "新聞",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 14.2,
        y: 72.0,
        width: 9.0,
        height: 7.5,
        onClick: clickWrap(function () {
          showObj(null, "四角錐の置物だ", IMAGES.modals.objectFoot, "置物が置いてある");
        }),
        description: "四角錐のオブジェ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainCounter");
          },
          { allowAtNight: true },
        ),
        description: "ドア面左、カウンターへ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainTable");
          },
          { allowAtNight: true },
        ),
        description: "ドア面右、長テーブル面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  mainTable: {
    name: "長テーブルがある面",
    description: "",
    clickableAreas: [
      {
        x: 62.3,
        y: 36.9,
        width: 10.2,
        height: 6.7,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.radioActivated) {
            updateMessage("ラジオがある");
            return;
          }
          showRadioDialPuzzle();
        }),
        description: "ラジオ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 45.9,
        y: 37.6,
        width: 8.2,
        height: 6.5,
        onClick: clickWrap(function () {}),
        description: "テレビ画面",
        zIndex: 5,
        usable: () => false,
        item: {
          img: () => (gameState.main.flags.videoTapeInserted ? "tv2" : "tv"),
          visible: () => gameState.main.flags.tvPowerOn || gameState.main.flags.videoTapeInserted,
        },
      },
      {
        x: 43.9,
        y: 35.5,
        width: 14.4,
        height: 10.4,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.tvPowerOn || f.videoTapeInserted) {
            const tvImg = f.videoTapeInserted ? IMAGES.items.tv2 : IMAGES.items.tv;
            const tvMsg = f.videoTapeInserted ? "ビデオが再生されている。" : "テレビがついている。時代劇だ。";
            showObj(null, "", tvImg, tvMsg);
            return;
          }
          if (gameState.selectedItem === "remocon") {
            f.tvPowerOn = true;
            playSE?.("se-mouse");
            renderCanvasRoom?.();
            updateMessage("テレビの電源を入れた。");
            return;
          }
          updateMessage("テレビがある。");
        }),
        description: "テレビ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 51.1,
        y: 54.8,
        width: 4.5,
        height: 2.6,
        onClick: clickWrap(function () {
          acquireItemOnce("foundRemocon", "remoconBack", "リモコンが落ちていた", IMAGES.items.remoconBack, "リモコンを手に入れた");
        }),
        description: "テレビ下リモコン",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundRemocon,
        item: { img: "remocon", visible: () => !gameState.main.flags.foundRemocon },
      },
      {
        x: 44.2,
        y: 47.1,
        width: 14.0,
        height: 6.6,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem !== "driver") {
            updateMessage("テレビ台に板がねじ止めされている。");
            return;
          }
          f.removeBoltBoard = true;
          playSE?.("se-neji");
          renderCanvasRoom?.();
          showObj(null, "", IMAGES.modals.driverTv, "ねじを外した。");
        }),
        description: "テレビ台をねじ止めしている板",
        zIndex: 5,
        usable: () => !gameState.main.flags.removeBoltBoard,
        item: { img: "boltBoard", visible: () => !gameState.main.flags.removeBoltBoard },
      },
      {
        x: 47.3,
        y: 49.7,
        width: 8.0,
        height: 3.3,
        onClick: clickWrap(handleVideoDeckClick),
        description: "ビデオデッキ",
        zIndex: 6,
        usable: () => gameState.main.flags.removeBoltBoard,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 80.1,
        y: 34.9,
        width: 10.0,
        height: 8.6,
        onClick: clickWrap(function () {
          findCardMark("topRight", "mainDoorMikeCat", "カードが反応した");
          updateMessage("三毛猫の置物だ");
        }),
        description: "三毛猫の置物",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 44.2,
        y: 20.1,
        width: 12.5,
        height: 11.0,
        onClick: clickWrap(function () {
          showObj(null, "時計は12時を指している", IMAGES.modals.clock12, "時計は12時を指している");
        }),
        description: "時計12時",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 87.0,
        y: 59.4,
        width: 12.6,
        height: 7.5,
        onClick: clickWrap(function () {
          showTvGuideNewspaper();
        }),
        description: "新聞（テレビ欄）",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 2.7,
        y: 23.2,
        width: 6.8,
        height: 10.5,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterRadio, "ラジオが故障していることを警告するポスターが貼られている", IMAGES.modals.posterRadioEn);
        }),
        description: "ラジオのポスター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 10.4,
        y: 32.8,
        width: 3.7,
        height: 5.5,
        onClick: clickWrap(function () {
          showRecordingNotice();
        }),
        description: "録画に関する注意",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 12.5,
        y: 42.1,
        width: 13.5,
        height: 13.5,
        onClick: clickWrap(function () {
          updateMessage("ガラス容器がある。蓋は開かない。");
        }),
        description: "ガラス容器",
        zIndex: 5,
        usable: () => !gameState.main.flags.brokenVessel,
        item: { img: "glassVessel", visible: () => !gameState.main.flags.brokenVessel },
      },
      {
        x: 8.8,
        y: 47.0,
        width: 15.4,
        height: 12.0,
        onClick: clickWrap(function () {}),
        description: "ガラス容器割れた後",
        zIndex: 5,
        usable: () => false,
        item: { img: "glassVesselBroken", visible: () => gameState.main.flags.brokenVessel },
      },
      {
        x: 8.9,
        y: 48.2,
        width: 13.5,
        height: 13.2,
        onClick: clickWrap(function () {
          findCardMark("middleCenter", "mainTableCandy", "カードが反応した");
          updateMessage("大きなキャンディがある");
        }),
        description: "キャンディ",
        zIndex: 5,
        usable: () => gameState.main.flags.brokenVessel,
        item: { img: "candy", visible: () => gameState.main.flags.brokenVessel },
      },
      {
        x: 27.5,
        y: 26.4,
        width: 9.8,
        height: 19.0,
        onClick: clickWrap(function () {
          changeRoom("kitchenDoor");
        }),
        description: "テレビ左奥",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "長テーブルがある面左、ドアへ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainStorage");
          },
          { allowAtNight: true },
        ),
        description: "長テーブルがある面右、ロッカー面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  mainCounter: {
    name: "ドリンクコーナー",
    description: "",
    clickableAreas: [
      {
        x: 15.2,
        y: 25.2,
        width: 14.0,
        height: 18.4,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.window, "窓の外に飛行機が見える");
          findCardMarks("middleRight", ["mainCounterWindowPlaneA", "mainCounterWindowPlaneB", "mainCounterWindowPlaneC", "mainCounterWindowPlaneD", "mainCounterWindowPlaneE"], "カードが反応した");
        }),
        description: "窓の外の飛行機",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 35.5,
        y: 23.1,
        width: 25.0,
        height: 11.7,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.karuta, "カルタのような札だ");
        }),
        description: "カルタ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 68.9,
        y: 13.1,
        width: 17.2,
        height: 15.9,
        onClick: clickWrap(function () {
          showObj(null, "時計は10時10分を指している", IMAGES.modals.clock1010, "時計は10時10分を指している");
        }),
        description: "時計10時10分",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 66.6,
        y: 28.2,
        width: 10.3,
        height: 10.1,
        onClick: clickWrap(function () {
          findCardMark("topRight", "mainCounterStripedCat", "カードが反応した");
          updateMessage("シマ猫の置物だ");
        }),
        description: "シマ猫の置物",
        zIndex: 5,
        usable: () => true,
      },
      {
        x: 44.7,
        y: 43.6,
        width: 15.2,
        height: 19.0,
        onClick: clickWrap(handleTeaPotClick),
        description: "ポット",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 80.5,
        y: 43.8,
        width: 14.5,
        height: 17.7,
        onClick: clickWrap(function () {
          showObj(null, "魚の絵が描かれたマグカップがある", IMAGES.modals.cupFish, "魚の絵が描かれたマグカップがある");
          findCardMarks("topLeft", ["mainCounterFishMugA", "mainCounterFishMugB"], "カードが反応した");
        }),
        description: "魚のマグカップ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 40.0,
        y: 67.5,
        width: 24.4,
        height: 23.7,
        onClick: clickWrap(function () {
          showMainCounterCabinetPuzzle();
        }),
        description: "キャビネット",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 72.7,
        y: 56.2,
        width: 2.8,
        height: 2.5,
        onClick: clickWrap(function () {}),
        description: "クッキー缶のねじ",
        zIndex: 5,
        usable: () => false,
        item: { img: "bolt", visible: () => !gameState.main.flags.removeBoltCookie },
      },
      {
        x: 66.9,
        y: 52.9,
        width: 14.3,
        height: 9.3,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "driver" && !f.removeBoltCookie) {
            f.removeBoltCookie = true;
            playSE?.("se-neji");
            renderCanvasRoom?.();
            showObj(null, "", IMAGES.modals.driverCookie, "ねじを外した。");
            return;
          }
          if (f.removeBoltCookie) {
            changeRoom("canInner");
            return;
          }
          updateMessage(f.removeBoltCookie ? "クッキー缶だ。" : "クッキー缶だ。ねじ止めされている。");
        }),
        description: "クッキー缶",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 79.1,
        y: 88.5,
        width: 7.4,
        height: 5.8,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.items.review3, "アンケートの紙が落ちている", IMAGES.modals.review3en);
        }),
        description: "アンケート3",
        zIndex: 5,
        usable: () => true,
        item: { img: "review3", visible: () => true },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainStorage");
          },
          { allowAtNight: true },
        ),
        description: "ドリンクコーナー左、ロッカー面へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 65.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "ドリンクコーナー右、ドアへ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  canInner: {
    name: "クッキー缶の中",
    description: "",
    clickableAreas: [
      {
        x: 27.5,
        y: 33.1,
        width: 34.9,
        height: 30.9,
        onClick: clickWrap(function () {
          acquireItemOnce("foundCanInnerTeaPowder", "teaPowder", "お茶パウダーが入っている", IMAGES.items.teaPowder, "お茶パウダーを手に入れた");
        }),
        description: "お茶パウダー",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundCanInnerTeaPowder,
        item: { img: "teaPowder", visible: () => !gameState.main.flags.foundCanInnerTeaPowder },
      },
      {
        x: 43.7,
        y: 20.8,
        width: 19.9,
        height: 19.7,
        onClick: clickWrap(showCanInnerNewspaperClipping),
        description: "新聞の切り抜き",
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
            changeRoom("mainCounter");
          },
          { allowAtNight: true },
        ),
        description: "クッキー缶の中戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  mainStorage: {
    name: "ロッカーがある面",
    description: "",
    clickableAreas: [
      {
        x: 4.8,
        y: 27.1,
        width: 25.6,
        height: 7.4,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.boardgames, "ボードゲームが置かれている");
        }),
        description: "本棚上ゲーム類",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 19.7,
        y: 48.1,
        width: 10.6,
        height: 6.2,
        onClick: clickWrap(function () {
          showObj(null, "ミニカーがある", IMAGES.modals.car, "ミニカーがある");
          findCardMarks("bottomCenter", ["mainStorageMinicarA", "mainStorageMinicarB", "mainStorageMinicarC"], "カードが反応した");
        }),
        description: "ミニカー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 33.2,
        y: 29.8,
        width: 6.3,
        height: 35.3,
        onClick: clickWrap(function () {
          showMainStorageSlimLockerLeftPuzzle();
        }),
        description: "細長いロッカー左端",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 41.2,
        y: 29.7,
        width: 6.1,
        height: 35.3,
        onClick: clickWrap(function () {
          showMainStorageSlimLockerSecondPuzzle();
        }),
        description: "細長いロッカー左から2番目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 49.1,
        y: 29.9,
        width: 6.3,
        height: 35.2,
        onClick: clickWrap(function () {
          showMainStorageSlimLockerThirdPuzzle();
        }),
        description: "細長いロッカー左から3番目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 57.0,
        y: 29.8,
        width: 6.1,
        height: 35.2,
        onClick: clickWrap(function () {
          showMainStorageSlimLockerRightPuzzle();
        }),
        description: "細長いロッカー右端",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 84.6,
        y: 16.3,
        width: 10.5,
        height: 9.6,
        onClick: clickWrap(function () {
          showObj(null, "時計は9時を指している", IMAGES.modals.clock9, "時計は9時を指している");
        }),
        description: "時計9時",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 83.0,
        y: 29.1,
        width: 7.6,
        height: 10.3,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterHorse, "競馬愛好会のポスターが貼られている");
          findCardMarks("bottomRight", ["mainStorageHorsePosterA", "mainStorageHorsePosterB"], "カードが反応した");
        }),
        description: "競馬倶楽部のポスター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 14.5,
        y: 17.5,
        width: 8.6,
        height: 7.5,
        onClick: clickWrap(function () {
          findCardMark("topRight", "mainStorageBlackCat", "カードが反応した");
          updateMessage("黒猫の置物だ");
        }),
        description: "黒猫の置物",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 68.0,
        y: 31.2,
        width: 10.6,
        height: 33.2,
        onClick: clickWrap(function () {
          showMainStorageRightLockerPuzzle();
        }),
        description: "右の大きいロッカー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0.6,
        y: 70.5,
        width: 17.0,
        height: 7.4,
        onClick: clickWrap(function () {
          changeRoom("board");
        }),
        description: "置かれたゲーム盤",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 18.4,
        y: 70.6,
        width: 6.7,
        height: 3.9,
        onClick: clickWrap(function () {
          showObj(null, "ボードゲームの説明書だ", IMAGES.modals.manualGame, "ボードゲームの説明書がある");
        }),
        description: "ゲーム説明書",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 40.5,
        y: 66.5,
        width: 22.8,
        height: 22.7,
        onClick: clickWrap(handleBearFairyClick),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.main.flags.bearAppear && !gameState.main.flags.gaveKebabToBearFairy,
        item: { img: "bear", visible: () => gameState.main.flags.bearAppear && !gameState.main.flags.gaveKebabToBearFairy },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainTable");
          },
          { allowAtNight: true },
        ),
        description: "ロッカーがある面左、長テーブル面へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainCounter");
          },
          { allowAtNight: true },
        ),
        description: "ロッカーがある面右、ドリンクコーナーへ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },

  board: {
    name: "ゲーム盤",
    description: "",
    clickableAreas: [
      {
        x: 6.3,
        y: 7.7,
        width: 87.5,
        height: 83.4,
        onClick: clickWrap(function () {
          handleBoardClick();
        }),
        description: "盤面",
        zIndex: 6,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 68.0,
        y: 60.0,
        width: 31.8,
        height: 26.1,
        onClick: clickWrap(function () {
          handleBoardPlacedKomaClick();
        }),
        description: "置いた後の駒位置",
        zIndex: 7,
        usable: () => gameState.main.flags.boardKomaPlaced && !gameState.main.flags.bearAppear,
        item: { img: "koma", visible: () => gameState.main.flags.boardKomaPlaced && !gameState.main.flags.bearAppear },
      },
      {
        x: 72.0,
        y: 8.3,
        width: 20.6,
        height: 19.9,
        onClick: clickWrap(function () {
          updateMessage("刀傷がついている");
        }),
        description: "傷1",
        zIndex: 7,
        usable: () => gameState.main.flags.boardKomaPlaced,
        item: { img: "cross", visible: () => gameState.main.flags.boardKomaPlaced },
      },
      {
        x: 28.9,
        y: 29.3,
        width: 21.1,
        height: 19.9,
        onClick: clickWrap(function () {
          updateMessage("刀傷がついている");
        }),
        description: "傷2",
        zIndex: 7,
        usable: () => gameState.main.flags.boardKomaPlaced,
        item: { img: "cross", visible: () => gameState.main.flags.boardKomaPlaced },
      },
      {
        x: 6.9,
        y: 50.2,
        width: 21.0,
        height: 20.0,
        onClick: clickWrap(function () {
          updateMessage("刀傷がついている");
        }),
        description: "傷3",
        zIndex: 7,
        usable: () => gameState.main.flags.boardKomaPlaced,
        item: { img: "cross", visible: () => gameState.main.flags.boardKomaPlaced },
      },
      {
        x: 28.9,
        y: 71.1,
        width: 20.8,
        height: 19.0,
        onClick: clickWrap(function () {
          updateMessage("刀傷がついている");
        }),
        description: "傷4",
        zIndex: 7,
        usable: () => gameState.main.flags.boardKomaPlaced,
        item: { img: "cross", visible: () => gameState.main.flags.boardKomaPlaced },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainStorage");
          },
          { allowAtNight: true },
        ),
        description: "盤面戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  kitchenDoor: {
    name: "テレビ奥の扉前",
    description: "",
    clickableAreas: [
      {
        x: 34.6,
        y: 21.8,
        width: 29.6,
        height: 57.4,
        onClick: clickWrap(handleKitchenDoorClick),
        description: "厨房へのドア",
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
            changeRoom("mainTable");
          },
          { allowAtNight: true },
        ),
        description: "キッチンドア前戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  kitchen: {
    name: "厨房",
    description: "",
    clickableAreas: [
      {
        x: 33.2,
        y: 27.1,
        width: 6.8,
        height: 6.8,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.review2, "アンケートの紙が貼られている", IMAGES.modals.review2en);
        }),
        description: "アンケート2",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 39.5,
        y: 34.0,
        width: 7.2,
        height: 7.1,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.review4, "アンケートの紙が貼られている", IMAGES.modals.review4en);
        }),
        description: "アンケート4",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 32.4,
        y: 38.6,
        width: 7.0,
        height: 6.9,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.review1, "アンケートの紙が貼られている", IMAGES.modals.review1en);
        }),
        description: "アンケート1",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 62.7,
        y: 41.5,
        width: 12.8,
        height: 15.8,
        onClick: clickWrap(handleKitchenFridgeClick),
        description: "冷蔵庫",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 69.3,
        y: 43.7,
        width: 4.9,
        height: 3.7,
        onClick: clickWrap(function () {
          showObj(null, "古い写真だ", IMAGES.modals.picOasis, "古い写真が貼られている");
        }),
        description: "冷蔵庫の写真",
        zIndex: 6,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 36.2,
        y: 59.7,
        width: 10.6,
        height: 3.3,
        onClick: clickWrap(function () {
          acquireItemOnce("foundKitchenDrawerKey", "key", "引き出しの中にカギがある", IMAGES.items.key, "カギを手に入れた");
        }),
        description: "引き出し",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 76.9,
        y: 26.2,
        width: 19.1,
        height: 43.6,
        onClick: clickWrap(handleKitchenExitDoorClick),
        description: "ドア",
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
            changeRoom("mainTable");
          },
          { allowAtNight: true },
        ),
        description: "キッチン戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  end: {
    name: "ノーマルエンド",
    description: "不思議な娯楽室から脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 71.1,
        y: 44.6,
        width: 28.0,
        height: 37.3,
        onClick: clickWrap(function () {
          updateMessage("「ちょっと辛いなあ」");
        }),
        description: "ケバブを食べるクマ妖精",
        zIndex: 5,
        usable: () => gameState.end.flags.backgroundState == 1,
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
    name: "裏庭エンド",
    description: "裏庭へ脱出しました！おめでとうございます。",
    clickableAreas: [
      {
        x: 27.9,
        y: 20.3,
        width: 61.9,
        height: 39.8,
        onClick: clickWrap(function () {
          updateMessage("ピンク色の花が元気に咲き誇っている");
        }),
        description: "説明",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 14.5,
        y: 16.5,
        width: 47.7,
        height: 43.4,
        onClick: clickWrap(function () {
          playSE?.("se-eat");
          gameState.trueEnd.flags.backgroundState = 2;
          renderCanvasRoom();
          showObj(null, "「本場の味だねえ」", IMAGES.modals.bearEat, "クマ妖精はケバブサンドを完食した");
        }),
        description: "裏庭でケバブを食べるクマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 14.6,
        y: 13.9,
        width: 69.9,
        height: 47.6,
        onClick: clickWrap(function () {
          updateMessage("zzz…");
        }),
        description: "満腹のクマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 2,
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
    bear: ["「こんにちは」", "「え？駒？」", "「お腹空いたなあ…」"],
  },
};

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
  changeRoom("mainDoor");
  updateInventoryDisplay();
  updateMessage("気が付くと不思議なカードを手にして見知らぬ部屋に立っていた。");
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
  if (roomId === "end" && f.guardMasterDrinkItem === "glassWithWine") {
    gameState.end.flags.backgroundState = 1;
  }
  if ((roomId === "end" || roomId === "trueEnd") && f.gaveKebabToBearFairy) {
    gameState[roomId].flags.backgroundState = 1;
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
    changeBGM(S38("honwaka_geishun.mp3"));
  } else if (roomId === "end") {
    changeBGM(S38("minnade_odekake.mp3"));
  } else {
    changeBGM(DEFAULT_BGM);
  }

  // nav
  if (roomId === "kitchen") {
    addNaviItem(roomId);
    renderNavigation();
  }
  if (roomId === "trueEnd" || roomId === "end") {
    gameState.openRooms = [];
    // renderNavigation();
  }
  renderNavigation();
}

const END_IDS = new Set(["end", "trueEnd"]);

// ===== changeRoom フック：=====
const _changeRoom_custom = changeRoom;
changeRoom = function (roomId) {
  const prevRoom = gameState.currentRoom;
  _changeRoom_custom.apply(this, arguments);
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (prevRoom !== roomId) {
    f.badMannerPuddingAttempts = 0;
    f.badMannerPuddingRoom = "";
    f.onigiriCoinSequence = [];
  }

  if (roomId === "end") {
  }

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
  drawDeskDrawerOpenFx(ctx, canvas, roomId);
  drawCabinetTopOpenFx(ctx, canvas, roomId);
  drawBarrelWinePourFx(ctx, canvas, roomId);

  drawLockerDoorFx(ctx, canvas, roomId);

  if (gameState.main?.flags?.isCurtainClosed) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

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

function drawBarrelWinePourFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.barrelPour;
  if (!fx || roomId !== "barrel" || fx.roomId !== "barrel") return;

  const isWater = fx.kind === "water";
  const cupRect = getAreaRectPx("barrel", isWater ? "水のコップ位置" : "ワインのコップ位置", canvas);
  const barrelRect = getAreaRectPx("barrel", isWater ? "水の樽" : "ワインの樽", canvas);
  if (!cupRect || !barrelRect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const placeT = Math.min(1, t / 0.25);
  const fillT = Math.max(0, Math.min(1, (t - 0.25) / 0.58));
  const shineT = Math.max(0, Math.min(1, (t - 0.78) / 0.22));

  const glassW = Math.max(cupRect.w * 1.35, canvas.width * 0.045);
  const glassH = Math.max(cupRect.h * 1.45, canvas.height * 0.075);
  const gx = cupRect.x + cupRect.w / 2 - glassW / 2;
  const gy = cupRect.y + cupRect.h - glassH;
  const alpha = easeOutCubic(placeT);

  ctx.save();
  ctx.globalAlpha = alpha;

  const streamX = cupRect.x + cupRect.w / 2;
  const streamY0 = barrelRect.y + barrelRect.h * 0.64;
  const streamY1 = gy + glassH * 0.2;
  if (t > 0.18 && t < 0.82) {
    ctx.strokeStyle = isWater ? "rgba(130, 205, 240, 0.88)" : "rgba(128, 24, 42, 0.88)";
    ctx.lineWidth = Math.max(3, canvas.width * 0.004);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(streamX, streamY0);
    ctx.quadraticCurveTo(streamX - glassW * 0.08, (streamY0 + streamY1) / 2, streamX, streamY1);
    ctx.stroke();
  }

  ctx.lineWidth = Math.max(2, canvas.width * 0.0024);
  ctx.strokeStyle = "rgba(232, 246, 255, 0.95)";
  ctx.fillStyle = "rgba(210, 235, 245, 0.16)";
  ctx.beginPath();
  ctx.moveTo(gx + glassW * 0.2, gy + glassH * 0.05);
  ctx.lineTo(gx + glassW * 0.8, gy + glassH * 0.05);
  ctx.lineTo(gx + glassW * 0.68, gy + glassH * 0.92);
  ctx.quadraticCurveTo(gx + glassW * 0.5, gy + glassH, gx + glassW * 0.32, gy + glassH * 0.92);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const liquidH = glassH * 0.62 * easeOutCubic(fillT);
  if (liquidH > 0) {
    ctx.fillStyle = isWater ? "rgba(105, 195, 235, 0.56)" : "rgba(104, 12, 34, 0.9)";
    ctx.beginPath();
    ctx.moveTo(gx + glassW * 0.32, gy + glassH * 0.92);
    ctx.lineTo(gx + glassW * 0.68, gy + glassH * 0.92);
    ctx.lineTo(gx + glassW * 0.68 - glassW * 0.08 * fillT, gy + glassH * 0.92 - liquidH);
    ctx.lineTo(gx + glassW * 0.32 + glassW * 0.08 * fillT, gy + glassH * 0.92 - liquidH);
    ctx.closePath();
    ctx.fill();
  }

  if (shineT > 0) {
    ctx.globalAlpha = alpha * shineT;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.86)";
    ctx.lineWidth = Math.max(1.5, canvas.width * 0.0018);
    ctx.beginPath();
    ctx.moveTo(gx + glassW * 0.38, gy + glassH * 0.16);
    ctx.lineTo(gx + glassW * 0.32, gy + glassH * 0.7);
    ctx.stroke();
  }

  ctx.restore();
}

function playBarrelPourFx(kind, onDone, duration = 1150) {
  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;
  fx.barrelPour = {
    roomId: "barrel",
    kind,
    progress: 0,
  };

  playSE?.("se-tea");
  renderCanvasRoom?.();

  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.barrelPour;
    if (!currentFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      onDone?.();
      return;
    }

    const t = Math.min(1, (now - start) / duration);
    currentFx.progress = t;
    renderCanvasRoom?.();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.barrelPour;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
    onDone?.();
  };

  requestAnimationFrame(tick);
}

function playWinePourFx(onDone, duration = 1150) {
  playBarrelPourFx("wine", onDone, duration);
}

function playWaterPourFx(onDone, duration = 1150) {
  playBarrelPourFx("water", onDone, duration);
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
    const recessedW = Math.max(12, rect.w * 0.32);
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

function handleTeaPotClick() {
  if (hasItem("cupWithTea")) {
    updateMessage("湯飲みにはお茶が入っている。");
    return;
  }

  if (!hasItem("cup") || !hasItem("teaPowder")) {
    updateMessage("お湯が出るポットだ。");
    return;
  }

  removeItem("cup");
  removeItem("teaPowder");
  addItem("cupWithTea");
  markProgress?.("got_cup_with_tea");

  const content = `
    <div style="text-align:center;">
      <div class="modal-anim moda-anim">
        <img src="${IMAGES.modals.teaPowder}" alt="お茶パウダーを入れる">
        <img src="${IMAGES.modals.teaMake}" alt="お茶を作る">
      </div>
    </div>
  `;
  playSE?.("se-tea");
  showModal("お茶を作った", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("湯飲みにお茶を入れた。");
}

function handleVideoDeckClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.videoTapeInserted) {
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいでビデオテープを取り出せない。");
      return;
    }
    f.videoTapeInserted = false;
    addItem("tape");
    playSE?.("se-mouse");
    renderCanvasRoom?.();
    updateMessage("ビデオテープを取り出した。");
    return;
  }

  if (gameState.selectedItem !== "tape") {
    updateMessage("ビデオデッキがある。");
    return;
  }

  removeItem("tape");
  f.videoTapeInserted = true;
  f.tvPowerOn = true;
  playSE?.("se-mouse");
  renderCanvasRoom?.();
  updateMessage("ビデオテープを入れた。");
}

function handleBoardClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.boardKomaPlaced && !f.bearAppear) {
    updateMessage("クマの駒が置かれている。");
    return;
  }

  if (gameState.selectedItem !== "koma") {
    updateMessage("ボードゲームの盤面だ。");
    return;
  }

  removeItem("koma");
  f.boardKomaPlaced = true;
  markProgress?.("board_koma_placed");
  renderCanvasRoom?.();

  const content = `
    <div style="text-align:center;">
      <div class="modal-anim">
        <img src="${IMAGES.modals.komaPut}" alt="駒を置く">
        <img src="${IMAGES.modals.komaJump}" alt="駒が跳ねる">
      </div>
    </div>
  `;
  playSE?.("se-hanko");
  setTimeout(() => playSE?.("se-pop"), 520);
  showModal("駒を置いた", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("クマの駒を置いた。");
}

function handleMainDoorQrReaderClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainDoor) {
    updateMessage("ドアのロックは外れている。");
    return;
  }

  if (gameState.selectedItem !== "card") {
    updateMessage("QRリーダーがある。");
    return;
  }

  if (!isCardGridComplete()) {
    updateMessage("カードをかざしたが、何も起こらない。");
    return;
  }

  f.unlockMainDoor = true;
  playSE?.("se-cyber");
  renderCanvasRoom?.();
  updateMessage("ドアのロックが外れた。");
}

function handleMainDoorClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.unlockMainDoor) {
    updateMessage("ドアはロックされている。");
    return;
  }

  travelWithSteps("end");
}

function handleKitchenDoorClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockKitchenDoor) {
    changeRoom("kitchen");
    return;
  }

  showKitchenDoorPuzzle();
}

function showKitchenDoorPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <p style="margin:0; line-height:1.8; text-align:center;">ドアがロックされている。</p>
      <input id="kitchenDoorPasscode" class="puzzle-input" type="text" maxlength="16" placeholder="パスワード" autocapitalize="off" autocomplete="off" spellcheck="false" style="width:220px; max-width:100%; text-align:center; font-size:1.05em; letter-spacing:0.08em;">
      <button id="kitchenDoorPasscodeOk" class="ok-btn" type="button">OK</button>
      <div id="kitchenDoorPasscodeHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("ドア", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("ドアがロックされている。");

  setTimeout(() => {
    const inputEl = document.getElementById("kitchenDoorPasscode");
    const okBtn = document.getElementById("kitchenDoorPasscodeOk");
    const hintEl = document.getElementById("kitchenDoorPasscodeHint");
    if (!inputEl || !okBtn || !hintEl) return;

    const submit = () => {
      const answer = String(inputEl.value || "")
        .trim()
        .toLowerCase();
      if (answer === "secret") {
        f.unlockKitchenDoor = true;
        markProgress?.("unlock_kitchen_door");
        playSE?.("se-gacha");
        closeModal();
        updateMessage("ドアのロックが外れた。");
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

function handleKitchenExitDoorClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockKitchenExitDoor) {
    travelWithSteps("trueEnd");
    return;
  }

  if (gameState.selectedItem !== "key") {
    updateMessage("ドアはロックされている。");
    return;
  }

  removeItem("key");
  f.unlockKitchenExitDoor = true;
  markProgress?.("unlock_kitchen_exit_door");
  playSE?.("se-gacha");
  renderCanvasRoom?.();
  updateMessage("ドアのロックが外れた。");
}

function handleBoardPlacedKomaClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.boardKomaPlaced) {
    updateMessage("駒を置けそうだ。");
    return;
  }

  if (f.bearAppear) {
    updateMessage("武士の駒は消えている。");
    return;
  }

  if (gameState.selectedItem !== "cupWithTea") {
    updateMessage("クマの駒が置かれている。");
    return;
  }

  removeItem("cupWithTea");
  playSE?.("se-piko");
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.bearTea}" alt="武士の駒にお茶を差し出した" style="width:400px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;">武士の駒にお茶を差し出した</p>
    </div>
  `;
  showModal("武士の駒", content, [{ text: "次へ", action: showBoardBearVanishModal }]);
  updateMessage("武士の駒にお茶を差し出した");
}

function showBoardBearVanishModal() {
  playSE?.("se-fanta");
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.bearVanish}" alt="消える武士の駒" style="width:400px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;">？</p>
    </div>
  `;
  showModal("？", content, [{ text: "閉じる", action: "close" }], () => {
    const f = gameState.main.flags || (gameState.main.flags = {});
    f.bearAppear = true;
    markProgress?.("bear_appear");
    findCardMark("middleLeft", "boardBearAppear", "カードが反応した");
    renderCanvasRoom?.();
  });
  updateMessage("？");
}

function handleBearFairyClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.gaveKebabToBearFairy) {
    updateMessage("クマ妖精はもういない。");
    return;
  }

  if (gameState.selectedItem !== "kebab") {
    talkToHintCharacter("main", "bear");
    return;
  }

  removeItem("kebab");
  f.gaveKebabToBearFairy = true;
  markProgress?.("gave_kebab_to_bear_fairy");
  playSE?.("se-piko");
  renderCanvasRoom?.();

  const content = `
    <div style="text-align:center;">
      <div class="modal-anim">
        <img src="${IMAGES.modals.bearKebab1}" alt="ケバブを受け取ったクマ妖精">
        <img src="${IMAGES.modals.bearKebab2}" alt="ケバブを受け取ったクマ妖精">
      </div>
      <p style="margin:0; line-height:1.8;">クマ妖精にケバブサンドを渡した</p>
    </div>
  `;
  showModal("「わあ！美味しそう！」", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("クマ妖精にケバブサンドを渡した。クマ妖精は飛び去って行った");
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
      title: "🌸 GARDEN END",
      label: "GARDEN END",
      desc: "ピンクの可愛い花が咲いた裏庭に脱出しました",
    },

    end: {
      title: "🌳 NORMAL END ",
      label: "NORMAL",
      desc: "無事に脱出しました",
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLScRTMw2Uv9hUYCsvBdnPn2tVz-qFvbIaCOZSngdzVtgVqhXmA/viewform";
  const endingLabel =
    {
      trueEnd: "裏庭エンド",
      end: "ノーマルエンド",
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

function renderRadioDirectionDial(index, label) {
  return `
    <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
      <button id="radioDirectionDial${index}" type="button" aria-label="${label}のダイヤル"
        style="position:relative; width:72px; height:72px; border-radius:50%; border:3px solid #2c2d2b; background:radial-gradient(circle at 35% 30%, #d7d7d2 0%, #9a9b95 44%, #5b5d59 72%, #242521 100%); box-shadow:inset 0 3px 5px rgba(255,255,255,0.42), inset 0 -8px 10px rgba(0,0,0,0.42), 0 3px 6px rgba(0,0,0,0.35); cursor:pointer; touch-action:none;">
        <span style="position:absolute; left:50%; top:6px; width:2px; height:10px; background:rgba(20,20,18,0.62); transform:translateX(-50%);"></span>
        <span style="position:absolute; right:6px; top:50%; width:10px; height:2px; background:rgba(20,20,18,0.62); transform:translateY(-50%);"></span>
        <span style="position:absolute; left:50%; bottom:6px; width:2px; height:10px; background:rgba(20,20,18,0.62); transform:translateX(-50%);"></span>
        <span style="position:absolute; left:6px; top:50%; width:10px; height:2px; background:rgba(20,20,18,0.62); transform:translateY(-50%);"></span>
        <span id="radioDirectionNeedle${index}" style="position:absolute; left:50%; top:13px; width:5px; height:25px; border-radius:4px; background:#171816; transform-origin:50% 100%; transform:translateX(-50%) rotate(0deg); box-shadow:0 1px 2px rgba(255,255,255,0.26);"></span>
        <span style="position:absolute; left:50%; top:50%; width:16px; height:16px; border-radius:50%; background:radial-gradient(circle at 36% 32%, #fafafa, #777 64%, #1e1f1d 100%); transform:translate(-50%, -50%); box-shadow:0 1px 4px rgba(0,0,0,0.55);"></span>
      </button>
      <div style="font-size:0.84em; color:#1c1d1a; font-weight:700;">${label}</div>
      <div id="radioDirectionLabel${index}" style="min-width:3.2em; padding:2px 6px; border-radius:4px; background:#20211f; color:#e6e2d6; font-size:0.8em; font-weight:700; text-align:center;">上</div>
    </div>
  `;
}

function showRadioDialPuzzle() {
  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="position:relative; width:min(92vw, 430px); aspect-ratio:2.55 / 1; padding:12px 14px; border-radius:7px; border:3px solid #262722; background:linear-gradient(180deg, #9b9d96 0%, #6f736c 45%, #454943 100%); box-shadow:inset 0 3px 0 rgba(255,255,255,0.18), inset 0 -5px 10px rgba(0,0,0,0.36), 0 5px 12px rgba(0,0,0,0.3); box-sizing:border-box;">
        <div style="position:absolute; left:28px; top:-12px; width:86px; height:14px; border:3px solid #272822; border-bottom:none; border-radius:8px 8px 0 0; background:linear-gradient(180deg, #a9aa9f, #666a63);"></div>
        <div style="height:100%; display:grid; grid-template-columns:minmax(86px, 1fr) 1.45fr; gap:14px; align-items:center;">
          <div style="justify-self:center; width:min(25vw, 92px); aspect-ratio:1; border-radius:50%; border:4px solid #1f211e; background:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0 2px, transparent 2.6px) 0 0 / 9px 9px, radial-gradient(circle at 38% 32%, #3d413b, #050605 72%); box-shadow:inset 0 0 13px rgba(0,0,0,0.8), 0 2px 4px rgba(255,255,255,0.18);"></div>
          <div style="display:flex; justify-content:center; align-items:center; gap:18px; min-width:0;">
            ${renderRadioDirectionDial(0, "左")}
            ${renderRadioDirectionDial(1, "右")}
          </div>
        </div>
      </div>
      <button id="radioDirectionOk" class="ok-btn" type="button">OK</button>
      <div id="radioDirectionHint" style="min-height:1.2em; font-size:0.9em;"></div>
    </div>
  `;

  showModal("ラジオ", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const f = gameState.main.flags || (gameState.main.flags = {});
    const saved = Array.isArray(f.radioDialDirections) ? f.radioDialDirections : [0, 0];
    const selected = [0, 1].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < RADIO_DIAL_DIRECTIONS.length ? value : 0;
    });

    const repaint = (idx) => {
      const needle = document.getElementById(`radioDirectionNeedle${idx}`);
      const label = document.getElementById(`radioDirectionLabel${idx}`);
      const direction = RADIO_DIAL_DIRECTIONS[selected[idx]];
      if (needle) needle.style.transform = `translateX(-50%) rotate(${direction.angle}deg)`;
      if (label) label.textContent = direction.label;
    };

    const setFromPointer = (idx, e) => {
      const dial = document.getElementById(`radioDirectionDial${idx}`);
      if (!dial) return;
      const rect = dial.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const deg = ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
      selected[idx] = Math.round(deg / 45) % RADIO_DIAL_DIRECTIONS.length;
      repaint(idx);
    };

    [0, 1].forEach((idx) => {
      const dial = document.getElementById(`radioDirectionDial${idx}`);
      if (!dial) return;
      let dragging = false;
      dial.addEventListener("pointerdown", (e) => {
        dragging = true;
        dial.setPointerCapture?.(e.pointerId);
        setFromPointer(idx, e);
      });
      dial.addEventListener("pointermove", (e) => {
        if (dragging) setFromPointer(idx, e);
      });
      dial.addEventListener("pointerup", () => {
        dragging = false;
      });
      dial.addEventListener("pointercancel", () => {
        dragging = false;
      });
      dial.addEventListener("click", (e) => {
        if (e.detail === 0) {
          selected[idx] = (selected[idx] + 1) % RADIO_DIAL_DIRECTIONS.length;
          repaint(idx);
        }
      });
      repaint(idx);
    });

    const okBtn = document.getElementById("radioDirectionOk");
    if (okBtn) {
      okBtn.addEventListener("click", () => {
        f.radioDialDirections = selected.slice();
        const left = RADIO_DIAL_DIRECTIONS[selected[0]].label;
        const right = RADIO_DIAL_DIRECTIONS[selected[1]].label;
        if (selected[0] === 4 && selected[1] === 2) {
          if (f.putEarPlug) {
            showRadioBigSoundModal();
          } else {
            showRadioBadEnd();
          }
          return;
        }
        closeModal();
        updateMessage(`ラジオのダイヤルを左:${left}、右:${right}に合わせた。`);
      });
    }
  }, 0);
}

function showRadioBigSoundModal() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.brokenVessel = true;
  f.putEarPlug = false;
  f.radioActivated = true;
  const message = "耳栓はもう不要なようだ";
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.radioBigSound}" alt="ラジオの大音量" style="width:400px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;">${escapeHtml(message)}</p>
    </div>
  `;
  showModal("ラジオから音の圧力を感じた。", content, [{ text: "閉じる", action: "close" }]);
  screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
  renderCanvasRoom();
  renderStatusIcons();
  updateMessage(message);
}

function showRadioBadEnd() {
  playSE("se-android");
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.badendRadio}" alt="ラジオの大音量" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
    </div>
  `;
  pauseBGM();
  showModal("【BAD END】大音量があなたを襲った", content, [{ text: "最初から", action: "restart" }]);
  updateMessage("BAD END: ラジオの大音量");
}

function showMainCounterCabinetPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainCounterCabinet) {
    playLockerDoorOpenFx("mainCounter", "キャビネット", {
      hingeSide: "right",
      panelColors: ["#8b5a35", "#c28a58", "#6f4224"],
      gripStyle: "slimSilver",
      gripColor: "#d8dde2",
      soundId: "se-door-close",
      onDone: () => {
        acquireItemOnce("foundMainCounterCabinetCup", "cup", "キャビネットの中に湯飲みがある", IMAGES.items.cup, "湯飲みを手に入れた");
      },
    });
    return;
  }

  const digitStyle = [
    "width:min(22vw, 82px)",
    "height:min(22vw, 82px)",
    "max-width:82px",
    "max-height:82px",
    "border:2px solid #777",
    "border-radius:4px",
    "background:#fff",
    "color:#111",
    "font-size:40px",
    "font-weight:700",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08)",
  ].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <p style="margin:0; line-height:1.8; text-align:center;">キャビネットがロックされている。</p>
      <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
        <button id="mainCounterCabinetDigit0" type="button" aria-label="左の数字" style="${digitStyle}">0</button>
        <button id="mainCounterCabinetDigit1" type="button" aria-label="中央の数字" style="${digitStyle}">0</button>
        <button id="mainCounterCabinetDigit2" type="button" aria-label="右の数字" style="${digitStyle}">0</button>
      </div>
      <button id="mainCounterCabinetOk" class="ok-btn" type="button">OK</button>
      <div id="mainCounterCabinetHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネットのロック", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("キャビネットがロックされている。");

  setTimeout(() => {
    const digitBtns = [0, 1, 2].map((i) => document.getElementById(`mainCounterCabinetDigit${i}`));
    const okBtn = document.getElementById("mainCounterCabinetOk");
    const hintEl = document.getElementById("mainCounterCabinetHint");
    if (digitBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const state = [0, 0, 0];
    digitBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % 10;
        btn.textContent = String(state[i]);
        hintEl.textContent = "";
        playSE?.("se-pi");
      });
    });

    okBtn.addEventListener("click", () => {
      if (state.join("") === "723") {
        f.unlockMainCounterCabinet = true;
        markProgress?.("unlock_main_counter_cabinet");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("キャビネットのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showMainStorageRightLockerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainStorageRightLocker) {
    playLockerDoorOpenFx("mainStorage", "右の大きいロッカー", {
      hingeSide: "right",
      panelColors: ["#6f6f67", "#9b9d96", "#4f534d"],
      gripStyle: "capsule",
      gripColor: "#303438",
      soundId: "se-door-close",
      onDone: () => {
        acquireItemOnce("foundMainStorageRightLockerTape", "tape", "ロッカーの中にビデオテープがある", IMAGES.items.tape, "ビデオテープを手に入れた", () => {
          findCardMark("bottomLeft", "mainStorageRightLockerTapeShip", "カードが反応した");
        });
      },
    });
    return;
  }

  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
        <button id="catLockerDial0" type="button" aria-label="黒猫の絵を切り替える" style="width:min(25vw, 112px); aspect-ratio:1; padding:8px; border:2px solid #555; border-radius:4px; background:#fff; cursor:pointer; box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08);">
          <img id="catLockerImg0" src="${IMAGES.modals.picCatBlack1}" alt="黒猫" style="width:100%; height:100%; object-fit:contain; display:block;">
        </button>
        <button id="catLockerDial1" type="button" aria-label="三毛猫の絵を切り替える" style="width:min(25vw, 112px); aspect-ratio:1; padding:8px; border:2px solid #555; border-radius:4px; background:#fff; cursor:pointer; box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08);">
          <img id="catLockerImg1" src="${IMAGES.modals.picCatMike1}" alt="三毛猫" style="width:100%; height:100%; object-fit:contain; display:block;">
        </button>
        <button id="catLockerDial2" type="button" aria-label="キジ猫の絵を切り替える" style="width:min(25vw, 112px); aspect-ratio:1; padding:8px; border:2px solid #555; border-radius:4px; background:#fff; cursor:pointer; box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08);">
          <img id="catLockerImg2" src="${IMAGES.modals.picCatKiji1}" alt="キジ猫" style="width:100%; height:100%; object-fit:contain; display:block;">
        </button>
      </div>
      <button id="catLockerOk" class="ok-btn" type="button">OK</button>
      <div id="catLockerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("右の大きいロッカー", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const imageSets = [
      [IMAGES.modals.picCatBlack1, IMAGES.modals.picCatBlack2, IMAGES.modals.picCatBlack3, IMAGES.modals.picCatBlack4, IMAGES.modals.picCatBlack5],
      [IMAGES.modals.picCatMike1, IMAGES.modals.picCatMike2, IMAGES.modals.picCatMike3, IMAGES.modals.picCatMike4, IMAGES.modals.picCatMike5],
      [IMAGES.modals.picCatKiji1, IMAGES.modals.picCatKiji2, IMAGES.modals.picCatKiji3, IMAGES.modals.picCatKiji4, IMAGES.modals.picCatKiji5],
    ];
    const saved = Array.isArray(f.mainStorageRightLockerCats) ? f.mainStorageRightLockerCats : [0, 0, 0];
    const selected = [0, 1, 2].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < imageSets[idx].length ? value : 0;
    });

    const repaint = (idx) => {
      const img = document.getElementById(`catLockerImg${idx}`);
      if (img) img.src = imageSets[idx][selected[idx]];
    };

    [0, 1, 2].forEach((idx) => {
      const btn = document.getElementById(`catLockerDial${idx}`);
      if (!btn) return;
      btn.addEventListener("click", () => {
        selected[idx] = (selected[idx] + 1) % imageSets[idx].length;
        repaint(idx);
      });
      repaint(idx);
    });

    const okBtn = document.getElementById("catLockerOk");
    const hintEl = document.getElementById("catLockerHint");
    if (!okBtn) return;
    okBtn.addEventListener("click", () => {
      f.mainStorageRightLockerCats = selected.slice();
      if (selected[0] === 2 && selected[1] === 3 && selected[2] === 1) {
        f.unlockMainStorageRightLocker = true;
        markProgress?.("unlock_main_storage_right_locker");
        playSE?.("se-gacha");
        closeModal();
        updateMessage("右の大きいロッカーのロックが外れた。");
        return;
      }
      if (hintEl) hintEl.textContent = "何も起こらない。";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showMainStorageSlimLockerLeftPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainStorageSlimLockerLeft) {
    playLockerDoorOpenFx("mainStorage", "細長いロッカー左端", {
      hingeSide: "right",
      panelColors: ["#676760", "#9b9d96", "#4d514b"],
      gripStyle: "capsule",
      gripColor: "#303438",
      soundId: "se-door-close",
      onDone: () => {
        acquireItemOnce("foundMainStorageSlimLockerLeftBattery", "battery", "ロッカーの中に電池がある", IMAGES.items.battery, "電池を手に入れた");
      },
    });
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:4px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3, 4]
          .map(
            (idx) => `
              <button id="slimLockerLeftLetter${idx}" type="button" class="nav-btn" aria-label="${idx + 1}文字目"
                style="width:min(14.5vw, 58px); height:min(14.5vw, 58px); min-width:38px; min-height:38px; border-radius:4px; border:2px solid #555; background:#fff; color:#111; font-size:clamp(22px, 8vw, 30px); font-weight:bold; padding:0;">A</button>
            `,
          )
          .join("")}
      </div>
      <button id="slimLockerLeftOk" class="ok-btn" type="button">OK</button>
      <div id="slimLockerLeftHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("細長いロッカー左端", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const letters = ["A", "B", "D", "E", "I", "L", "M", "R", "T", "U"];
    const saved = Array.isArray(f.mainStorageSlimLockerLeftLetters) ? f.mainStorageSlimLockerLeftLetters : [0, 0, 0, 0, 0];
    const state = [0, 1, 2, 3, 4].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < letters.length ? value : 0;
    });
    const letterBtns = [0, 1, 2, 3, 4].map((idx) => document.getElementById(`slimLockerLeftLetter${idx}`));
    const okBtn = document.getElementById("slimLockerLeftOk");
    const hintEl = document.getElementById("slimLockerLeftHint");
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
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainStorageSlimLockerLeftLetters = state.slice();
      const answer = state.map((index) => letters[index]).join("");
      if (answer === "TABLE") {
        f.unlockMainStorageSlimLockerLeft = true;
        markProgress?.("unlock_main_storage_slim_locker_left");
        playSE?.("se-gacha");
        closeModal();
        updateMessage("細長いロッカー左端のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showMainStorageSlimLockerSecondPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainStorageSlimLockerSecond) {
    playLockerDoorOpenFx("mainStorage", "細長いロッカー左から2番目", {
      hingeSide: "right",
      panelColors: ["#676760", "#9b9d96", "#4d514b"],
      gripStyle: "capsule",
      gripColor: "#303438",
      soundId: "se-door-close",
      onDone: () => {
        acquireItemOnce("foundMainStorageSlimLockerSecondDriver", "driver", "ロッカーの中にドライバーがある", IMAGES.items.driver, "ドライバーを手に入れた");
      },
    });
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3]
          .map(
            (idx) => `
              <button id="slimLockerSecondLetter${idx}" type="button" class="nav-btn" aria-label="${idx + 1}文字目"
                style="width:min(16vw, 64px); height:min(16vw, 64px); min-width:42px; min-height:42px; border-radius:4px; border:2px solid #555; background:#fff; color:#111; font-size:clamp(24px, 8vw, 32px); font-weight:bold; padding:0;">A</button>
            `,
          )
          .join("")}
      </div>
      <button id="slimLockerSecondOk" class="ok-btn" type="button">OK</button>
      <div id="slimLockerSecondHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("細長いロッカー左から2番目", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const letters = ["A", "B", "D", "E", "G", "H", "I", "M", "N", "O", "S", "U"];
    const saved = Array.isArray(f.mainStorageSlimLockerSecondLetters) ? f.mainStorageSlimLockerSecondLetters : [0, 0, 0, 0];
    const state = [0, 1, 2, 3].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < letters.length ? value : 0;
    });
    const letterBtns = [0, 1, 2, 3].map((idx) => document.getElementById(`slimLockerSecondLetter${idx}`));
    const okBtn = document.getElementById("slimLockerSecondOk");
    const hintEl = document.getElementById("slimLockerSecondHint");
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
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainStorageSlimLockerSecondLetters = state.slice();
      const answer = state.map((index) => letters[index]).join("");
      if (answer === "GAME") {
        f.unlockMainStorageSlimLockerSecond = true;
        markProgress?.("unlock_main_storage_slim_locker_second");
        playSE?.("se-gacha");
        closeModal();
        updateMessage("細長いロッカー左から2番目のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showMainStorageSlimLockerThirdPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainStorageSlimLockerThird) {
    playLockerDoorOpenFx("mainStorage", "細長いロッカー左から3番目", {
      hingeSide: "right",
      panelColors: ["#676760", "#9b9d96", "#4d514b"],
      gripStyle: "capsule",
      gripColor: "#303438",
      soundId: "se-door-close",
      onDone: () => {
        acquireItemOnce("foundMainStorageSlimLockerThirdEarplug", "earplug", "ロッカーの中に耳栓がある", IMAGES.items.earplug, "耳栓を手に入れた");
      },
    });
    return;
  }

  const symbolStyle = [
    "width:min(18vw, 72px)",
    "height:min(18vw, 72px)",
    "min-width:46px",
    "min-height:46px",
    "border-radius:4px",
    "border:2px solid #555",
    "background:#fff",
    "color:#111",
    "font-size:clamp(24px, 8vw, 34px)",
    "font-weight:bold",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "padding:0",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08)",
  ].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:8px; justify-content:center; align-items:center;">
        ${[0, 1, 2]
          .map(
            (idx) => `
              <button id="slimLockerThirdSymbol${idx}" type="button" aria-label="${idx + 1}つ目の記号" style="${symbolStyle}">★</button>
            `,
          )
          .join("")}
      </div>
      <button id="slimLockerThirdOk" class="ok-btn" type="button">OK</button>
      <div id="slimLockerThirdHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("細長いロッカー左から3番目", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const symbols = ["★", "〇", "♪", "☆", "□"];
    const saved = Array.isArray(f.mainStorageSlimLockerThirdSymbols) ? f.mainStorageSlimLockerThirdSymbols : [0, 0, 0];
    const state = [0, 1, 2].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < symbols.length ? value : 0;
    });
    const symbolBtns = [0, 1, 2].map((idx) => document.getElementById(`slimLockerThirdSymbol${idx}`));
    const okBtn = document.getElementById("slimLockerThirdOk");
    const hintEl = document.getElementById("slimLockerThirdHint");
    if (symbolBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const repaint = () => {
      symbolBtns.forEach((btn, idx) => {
        btn.textContent = symbols[state[idx]];
      });
      hintEl.textContent = "";
    };

    symbolBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % symbols.length;
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainStorageSlimLockerThirdSymbols = state.slice();
      if (state[0] === 4 && state[1] === 1 && state[2] === 4) {
        f.unlockMainStorageSlimLockerThird = true;
        markProgress?.("unlock_main_storage_slim_locker_third");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("細長いロッカー左から3番目のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showMainStorageSlimLockerRightPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainStorageSlimLockerRight) {
    playLockerDoorOpenFx("mainStorage", "細長いロッカー右端", {
      hingeSide: "right",
      panelColors: ["#676760", "#9b9d96", "#4d514b"],
      gripStyle: "capsule",
      gripColor: "#303438",
      soundId: "se-door-close",
      onDone: () => {
        acquireItemOnce("foundMainStorageSlimLockerRightKoma", "koma", "ロッカーの中に駒がある", IMAGES.items.koma, "駒を手に入れた", () => {
          findCardMark("middleLeft", "mainStorageSlimLockerRightKomaBear", "カードが反応した");
        });
      },
    });
    return;
  }

  const dialStyle = ["width:min(22vw, 92px)", "aspect-ratio:1", "padding:16px", "border:2px solid #555", "border-radius:50%", "background:#111", "cursor:pointer", "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08)"].join(";");
  const imgStyle = "width:100%; height:100%; object-fit:contain; display:block;";
  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 92px)); gap:10px; justify-content:center; justify-items:center; align-items:center;">
        <button id="slimLockerRightDial0" type="button" aria-label="上の紋章を切り替える" style="${dialStyle}; grid-column:1 / 3;">
          <img id="slimLockerRightImg0" src="${IMAGES.modals.kamonWave}" alt="上の紋章" style="${imgStyle}">
        </button>
        <button id="slimLockerRightDial1" type="button" aria-label="下左の紋章を切り替える" style="${dialStyle}">
          <img id="slimLockerRightImg1" src="${IMAGES.modals.kamonWave}" alt="下左の紋章" style="${imgStyle}">
        </button>
        <button id="slimLockerRightDial2" type="button" aria-label="下右の紋章を切り替える" style="${dialStyle}">
          <img id="slimLockerRightImg2" src="${IMAGES.modals.kamonWave}" alt="下右の紋章" style="${imgStyle}">
        </button>
      </div>
      <button id="slimLockerRightOk" class="ok-btn" type="button">OK</button>
      <div id="slimLockerRightHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("細長いロッカー右端", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const symbols = [IMAGES.modals.kamonWave, IMAGES.modals.kamonFlower, IMAGES.modals.kamonSquare, IMAGES.modals.kamonStar];
    const saved = Array.isArray(f.mainStorageSlimLockerRightKamons) ? f.mainStorageSlimLockerRightKamons : [0, 0, 0];
    const state = [0, 1, 2].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < symbols.length ? value : 0;
    });
    const okBtn = document.getElementById("slimLockerRightOk");
    const hintEl = document.getElementById("slimLockerRightHint");

    const repaint = (idx) => {
      const img = document.getElementById(`slimLockerRightImg${idx}`);
      if (img) img.src = symbols[state[idx]];
      if (hintEl) hintEl.textContent = "";
    };

    [0, 1, 2].forEach((idx) => {
      const btn = document.getElementById(`slimLockerRightDial${idx}`);
      if (!btn) return;
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % symbols.length;
        playSE?.("se-pi");
        repaint(idx);
      });
      repaint(idx);
    });

    if (!okBtn) return;
    okBtn.addEventListener("click", () => {
      f.mainStorageSlimLockerRightKamons = state.slice();
      if (state[0] === 1 && state[1] === 2 && state[2] === 3) {
        f.unlockMainStorageSlimLockerRight = true;
        markProgress?.("unlock_main_storage_slim_locker_right");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("細長いロッカー右端のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      if (hintEl) hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function handleKitchenFridgeClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.unlockKitchenFridge) {
    acquireItemOnce("foundKitchenFridgeKebab", "kebab", "冷蔵庫にケバブサンドが入っていた", IMAGES.items.kebab, "ケバブサンドを手に入れた");
    return;
  }

  const foods = [
    { key: "gyoza", img: IMAGES.modals.iconGyoza, label: "餃子" },
    { key: "ramen", img: IMAGES.modals.iconRamen, label: "ラーメン" },
    { key: "onigiri", img: IMAGES.modals.iconOnigiri, label: "おにぎり" },
    { key: "kebab", img: IMAGES.modals.iconKebab, label: "ケバブ" },
  ];
  const answer = ["ramen", "kebab", "onigiri", "gyoza"];
  const foodButtons = foods
    .map(
      (food) => `
        <button class="fridge-food-btn" type="button" data-food="${food.key}" aria-label="${food.label}" style="width:112px; aspect-ratio:1; border:2px solid #d28da0; border-radius:8px; background:#ffdce7; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 0 rgba(130,70,85,0.2);">
          <img src="${food.img}" alt="${food.label}" style="width:78px; height:78px; object-fit:contain; display:block;">
        </button>
      `,
    )
    .join("");

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:16px;">
      <div id="fridgeFoodGrid" style="display:grid; grid-template-columns:repeat(2, 112px); gap:12px; justify-content:center;">
        ${foodButtons}
      </div>
      <button id="fridgeFoodOk" class="ok-btn" type="button">OK</button>
      <div id="fridgeFoodHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("冷蔵庫のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const okBtn = document.getElementById("fridgeFoodOk");
    const hintEl = document.getElementById("fridgeFoodHint");
    const buttons = Array.from(document.querySelectorAll(".fridge-food-btn"));
    if (!okBtn || !hintEl || buttons.length === 0) return;

    const pressed = [];
    const reset = () => {
      pressed.length = 0;
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (pressed.length >= answer.length) reset();
        pressed.push(btn.dataset.food);
        playSE?.("se-click");
      });
    });

    okBtn.addEventListener("click", () => {
      const isCorrect = pressed.length === answer.length && answer.every((key, idx) => pressed[idx] === key);
      if (isCorrect) {
        f.unlockKitchenFridge = true;
        markProgress?.("unlock_kitchen_fridge");
        playSE?.("se-gacha");
        closeModal();
        updateMessage("冷蔵庫のロックが解除された。");
        renderCanvasRoom?.();
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "押す順番が違うようだ";
      reset();
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function handleDoor() {
  // エンディング遷移共通ハンドラ
  const trueEndFlg = gameState.flags.trueEndUnlocked;
  const goEnding = () => {
    gameState.inventory = gameState.inventory.filter((itemId) => itemId === "dinner");
    gameState.selectedItem = null;
    gameState.selectedItemSlot = null;
    gameState.usingItem = null;
    updateInventoryDisplay?.();

    if (trueEndFlg) {
      gameState.endings.true = true;
      travelWithStepsTrueEnd();
    } else {
      travelWithSteps("end");
    }
  };

  goEnding();
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

  const content = `<img id="${imgId}" src="${isEn ? altImgSrc : imgSrc}"
      style="display:block;margin:0 auto 20px;width:auto;height:auto;max-width:min(92vw,560px);max-height:min(72vh,460px);object-fit:contain;">`;

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

  showModal(title, content, buttons);
  updateMessage(isEn ? msgEn || msg : msg);
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

function getCardFinds() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.cardFinds || typeof f.cardFinds !== "object" || Array.isArray(f.cardFinds)) {
    f.cardFinds = {};
  }
  return f.cardFinds;
}

function getCardCellFinds(cellKey) {
  const finds = getCardFinds();
  if (!Array.isArray(finds[cellKey])) {
    finds[cellKey] = [];
  }
  return finds[cellKey];
}

function isCardGridComplete(finds = getCardFinds()) {
  return CARD_GRID_CELLS.every((cell) => {
    const count = Array.isArray(finds[cell.key]) ? finds[cell.key].length : 0;
    const max = Number(cell.max) || 0;
    return max <= 0 || count >= max;
  });
}

function findCardMark(cellKey, markId, foundMessage = "カードに記録した。") {
  if (!hasItem("card")) {
    updateMessage("猫がいる。");
    return;
  }

  const finds = getCardFinds();
  const wasCardComplete = isCardGridComplete(finds);
  const cellFinds = getCardCellFinds(cellKey);
  const cell = CARD_GRID_CELLS.find((entry) => entry.key === cellKey);
  const max = Number(cell?.max) || 0;
  if (cellFinds.includes(markId)) {
    updateMessage("これはもう発見済だ。");
    return;
  }
  if (max > 0 && cellFinds.length >= max) {
    updateMessage("このマスにはこれ以上記録できない。");
    return;
  }

  cellFinds.push(markId);
  playSE?.("se-kettei");
  flashInventoryItem("card");
  if (!wasCardComplete && isCardGridComplete(finds)) {
    showToast("カードが光ったようだ");
  } else if (foundMessage) {
    showToast(foundMessage);
  }
}

function findCardMarks(cellKey, markIds, foundMessage = "カードに記録した。") {
  if (!hasItem("card")) return;

  const finds = getCardFinds();
  const wasCardComplete = isCardGridComplete(finds);
  const cellFinds = getCardCellFinds(cellKey);
  const cell = CARD_GRID_CELLS.find((entry) => entry.key === cellKey);
  const max = Number(cell?.max) || 0;
  const beforeCount = cellFinds.length;

  markIds.forEach((markId) => {
    if (cellFinds.includes(markId)) return;
    if (max > 0 && cellFinds.length >= max) return;
    cellFinds.push(markId);
  });

  if (cellFinds.length === beforeCount) {
    updateMessage(max > 0 && cellFinds.length >= max ? "これはもう発見済だ。" : "このマスにはこれ以上記録できない。");
    return;
  }

  playSE?.("se-kettei");
  flashInventoryItem("card");
  if (!wasCardComplete && isCardGridComplete(finds)) {
    showToast("カードが光ったようだ");
  } else if (foundMessage) {
    showToast(foundMessage);
  }
}

function flashInventoryItem(itemId) {
  const itemIndex = gameState.inventory.indexOf(itemId);
  if (itemIndex === -1) return;

  const pageSize = getInventoryPageSize();
  const pageStart = gameState.inventoryPage * pageSize;
  const visibleIndex = itemIndex - pageStart;
  if (visibleIndex < 0 || visibleIndex >= pageSize) return;

  const slots = document.querySelectorAll(".inventory-slot");
  const slot = slots[visibleIndex];
  if (!slot) return;

  slot.classList.remove("inventory-flash");
  void slot.offsetWidth;
  slot.classList.add("inventory-flash");
  window.setTimeout(() => {
    slot.classList.remove("inventory-flash");
  }, 720);
}

function renderCardGrid() {
  const finds = getCardFinds();
  const isCardComplete = isCardGridComplete(finds);
  const cells = CARD_GRID_CELLS.map((cell) => {
    const count = Array.isArray(finds[cell.key]) ? finds[cell.key].length : 0;
    const max = Number(cell.max) || 0;
    const isComplete = max > 0 && count >= max;
    const bullets = "●".repeat(Math.min(count, max || count));
    const iconHtml = cell.icon ? `<img src="${cell.icon}" alt="" style="position:absolute;left:50%;top:43%;width:64%;height:64%;object-fit:contain;transform:translate(-50%,-50%);">` : "";
    const labelHtml = cell.label && isCardComplete ? `<div style="position:absolute;left:50%;top:68%;transform:translate(-50%,-50%);font-size:22px;font-weight:900;line-height:1;color:#8f8f8f;text-shadow:0 0 3px #fff,0 0 3px #fff;">${escapeHtml(cell.label)}</div>` : "";

    return `
      <div style="position:relative;aspect-ratio:1/1;border-right:2px solid #111;border-bottom:2px solid #111;background:${isComplete ? "#dff2dc" : "#fff"};box-sizing:border-box;overflow:hidden;">
        ${iconHtml}
        ${labelHtml}
        <div style="position:absolute;left:4px;right:4px;bottom:5px;min-height:18px;text-align:center;font-size:17px;line-height:1;color:#111;letter-spacing:2px;white-space:nowrap;">${bullets}</div>
      </div>
    `;
  }).join("");

  return `
    <div style="position:relative;width:min(84vw,390px);margin:0 auto 12px;background:#fff;color:#111;border:2px solid #111;box-sizing:border-box;">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);box-sizing:border-box;">
        ${cells}
      </div>
      <div style="background:${isCardComplete ? "#dff2dc" : "#fff"};padding:12px 0 14px;box-sizing:border-box;">
        ${isCardComplete ? `<img src="${IMAGES.modals.qr}" alt="QR" style="width:33.333%;aspect-ratio:1;object-fit:contain;display:block;margin:0 auto;">` : `<div aria-hidden="true" style="width:33.333%;aspect-ratio:1;margin:0 auto;"></div>`}
      </div>
    </div>
  `;
}

function renderStatusIcons() {
  const area = document.getElementById("statusIconArea");
  if (!area) return;

  // すでにあれば再描画だけ（追加予定が増えてもここで管理）
  area.innerHTML = "";

  const f = gameState.main?.flags || {};
  if (f.putEarPlug) {
    area.innerHTML += `
      <div class="status-icon" title="耳栓を装備中" aria-label="耳栓を装備中">
        <img src="${IMAGES.items.earplug}" alt="耳栓装備中" style="width:18px;height:18px;object-fit:contain;">
      </div>
    `;
  }
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
    remoconBack: "リモコン（電池無し）",
    remocon: "リモコン",
    card: "不思議なカード",
    earplug: "耳栓",
    glass: "コップ",
    battery: "電池",
    driver: "ドライバー",
    tape: "ビデオテープ",
    teaPowder: "お茶パウダー",
    cup: "湯飲み",
    cupWithTea: "お茶入りの湯飲み",
    koma: "侍の駒",
    glassVessel: "ガラスの容器",
    kebab: "ケバブサンド",
  };
  return names[itemId] || itemId;
}

function openInventoryItemDetail(itemId, slotIndex, fallbackSrc) {
  const itemBaseSrc = IMAGES.items[itemId] || fallbackSrc;
  const itemEnSrc = IMAGES.items[`${itemId}En`];
  const hasEnVariant = !!itemEnSrc;

  let content = `<img src="${itemBaseSrc}" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`;
  let buttons = [{ text: "閉じる", action: "close" }];

  if (itemId === "card") {
    content = renderCardGrid();
  }

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

  if (itemId === "earplug") {
    buttons = [
      {
        text: "装備する",
        action: () => {
          const f = gameState.main.flags || (gameState.main.flags = {});
          f.putEarPlug = true;
          removeItem("earplug");
          renderStatusIcons();
          updateMessage("耳栓を装備した。");
          closeModal();
        },
      },
      { text: "閉じる", action: "close" },
    ];
  }

  const addMemoInspectButton = () => {
    if (itemId !== "memo") return;
    buttons.unshift({
      text: "調べる",
      action: () => {
        window._nextModal = {
          title: getItemName(itemId),
          content: "紙に線のようなへこみがあるようだ",
          buttons: [{ text: "閉じる", action: "close" }],
        };
        closeModal();
      },
    });
  };
  addMemoInspectButton();

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
    addMemoInspectButton();

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
  let modalHtml = `<h3>${title}</h3><div>${content}</div>`;
  if (buttons && buttons.length > 0) {
    const columnStyle = options.columnButtons ? "display:flex; flex-direction:column; gap:12px; align-items:stretch;" : "text-align:center; display:flex; gap:10px; justify-content:center;";

    modalHtml += `<div id="modalButtons" style="${columnStyle}"></div>`;
    modalHtml += `<div id="modalClose" style="margin-top:25px;text-align:center;"></div>`;
  }
  document.getElementById("modalContent").innerHTML = modalHtml;
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
    bgm.volume = 0.3;
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
  if (!merged.openRooms.includes("mainDoor")) merged.openRooms.push("mainDoor");
  if (!merged.currentRoom || !rooms[merged.currentRoom]) merged.currentRoom = def.currentRoom;

  const mergedFlags = merged.main?.flags || {};
  if (mergedFlags.unlockTranceiverUpperDoor && !mergedFlags.unlockMailbox) mergedFlags.unlockMailbox = true;
  if (mergedFlags.foundTranceiverMessage && !mergedFlags.foundMailboxMessage) mergedFlags.foundMailboxMessage = true;
  if (mergedFlags.unlockTranceiverLowerDoor && !mergedFlags.unlockKitchenBox) mergedFlags.unlockKitchenBox = true;
  if ((mergedFlags.foundTranceiverPudding || mergedFlags.foundKitchenBoxPudding) && !mergedFlags.foundKitchenBoxCleanDish) mergedFlags.foundKitchenBoxCleanDish = true;
  if (!merged.inventory.includes("card")) merged.inventory.unshift("card");
  mergedFlags.foundMainDoorCard = true;

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
