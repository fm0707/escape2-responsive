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
const BASE_39 = USE_LOCAL_ASSETS ? "images/39" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/39";
const BASE_SOUND_39 = USE_LOCAL_ASSETS ? "sounds/39" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/39";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I39 = (file) => `${BASE_39}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S39 = (file) => `${BASE_SOUND_39}/${file}`;
const DEFAULT_BGM = S39("unabarano_walz.mp3");
// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    mainDoor: [I39("main_door.webp")],
    mainTv: [I39("main_tv.webp")],
    mainWindow: [I39("main_window.webp")],
    mainBed: [I39("main_bed.webp")],
    washitsu: [I39("washitsu.webp")],
    balconyCenter: [I39("balcony_center.webp")],
    balconyLeft: [I39("balcony_left.webp")],
    balconyRight: [I39("balcony_right.webp")],
    doorFront: [I39("door_front.webp")],
    sidetable: [I39("sidetable.webp")],
    kakejikuZoom: [I39("kakejiku_zoom.webp")],
    tvMenu: { jp: I39("tv_menu.webp"), en: I39("tv_menu_en.webp") },
    tvBath: { jp: I39("tv_bath.webp"), en: I39("tv_bath_en.webp") },
    tvDinner: {
      jp: [I39("tv_dinner.webp"), I39("tv_dinner_2.webp")],
      en: [I39("tv_dinner_en.webp"), I39("tv_dinner_2_en.webp")],
    },
    hall: [I39("hall.webp")],
    robby: [I39("robby.webp")],
    restaurant: [I39("end_restaurant.webp")],
    end: [I39("end.webp"), I39("end2.webp")],
    trueEnd: [I39("true_end.webp")],
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

    remocon: I39("remocon.webp"),
    remoconBack: I39("remocon_back.webp"),
    basketWithSweet: I39("basket_with_sweet.webp"),
    basket: I39("basket.webp"),
    sweet: I39("sweet.webp"),
    tvWifi: I39("tv_wifi.webp"),
    tvMenu: I39("tv_menu.webp"),
    safeOpen: I39("safe_open.webp"),
    daikonkun: I39("daikon_kun.webp"),
    cushion: I39("cushion.webp"),
    box: I39("box.webp"),
    boxOpen: I39("box_open.webp"),
    picDaikonkun: I39("pic_daikonkun.webp"),
    picDaikonkunBear: I39("pic_daikonkun_bear.webp"),
    picBear: I39("pic_bear.webp"),
    camera: I39("camera.webp"),
    scale: I39("scale.webp"),
    yukata: I39("yukata.webp"),
    yen300: I39("yen_300.webp"),
    milk: I39("milk.webp"),
    memoSafe: I39("memo_safe.webp"),
  },
  modals: {
    posterLighthouse: I39("modal_poster_lighthouse.webp"),
    posterLighthouseEn: I39("modal_poster_lighthouse_en.webp"),
    basket1: I39("modal_basket_1.webp"),
    basket2: I39("modal_basket_2.webp"),
    basketPaper: I39("modal_basket_paper.webp"),
    pillow: I39("modal_pillow.webp"),
    posterFuro: I39("poster_furo.webp"),
    posterFuroEn: I39("poster_furo_en.webp"),
    map: I39("map.webp"),
    mapEn: I39("map_en.webp"),
    memo: I39("memo.webp"),
    memoEn: I39("memo_en.webp"),
    batterySet: I39("modal_battery_set.webp"),
    balconyRight: I39("modal_balcony_right.webp"),
    balconyLeft: I39("modal_balcony_left.webp"),
    keyFind: I39("modal_key_find.webp"),
    daikonkunChallenge: I39("modal_daikonkun_challenge.webp"),
    daikonkunFailure: I39("modal_daikonkun_failure.webp"),
    daikonkunSucceed: I39("modal_daikonkun_succeed.webp"),
    cameraTake: I39("modal_camera_take.webp"),
    cameraPrint: I39("modal_camera_print.webp"),
    keyScale: I39("modal_key_scale.webp"),
    keyScale2: I39("modal_key_scale2.webp"),
    model: I39("modal_model.webp"),
    modelScale: I39("modal_model_scale.webp"),
    lighthouse: I39("modal_lighthouse.webp"),
    bearBath: I39("modal_bear_bath.webp"),
    bearHappy: I39("modal_bear_happy.webp"),
    milkGet: I39("modal_milk_get.webp"),
    badendDinner: I39("badend_dinner.webp"),
    badendDinnerEn: I39("badend_dinner_en.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState39";
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
    currentRoom: "mainTv",
    openRooms: ["mainTv"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        unpackSweet: false,
        putCushion: false,
        putDaikonkun: false,
        sidetableButtonInputs: [],
        unlockSidetableDrawer: false,
        foundSidetableCamera: false,
        tookPicDaikonkun: false,
        tookPicDaikonkunBear: false,
        tookPicBear: false,
        kakejikuButtonInputs: [],
        unlockKakejiku: false,
        foundKakejikuScale: false,
        foundMainTvBackKey: false,
        unlockWashitsuSafeBottomStorage: false,
        foundWashitsuSafeBottomStorageYukata: false,
        foundWashitsuSafeYen300: false,
        foundRemocon: false,
        foundDaikonkun: false,
        unlockMainTvLeftDrawer: false,
        mainTvLeftDrawerDigits: [0, 0, 0, 0, 0, 0],
        foundMainTvLeftDrawerBattery: false,
        unlockMainTvRightDrawer: false,
        mainTvRightDrawerLetters: [0, 0, 0, 0],
        foundMainTvRightDrawerMemoSafe: false,
        tvPowerOn: false,
        videoTapeInserted: false,
        connectWifi: false,
        tvWifiNumberIndex: 0,
        tvWifiWordIndex: 0,
        mainDoorKanaIndexes: [0, 0, 0],
        unlockMainDoor: false,
        unlockRobbyElevator: false,
        robbyElevatorLetters: [0, 0, 0, 0, 0],
        unlockKitchenDoor: false,
        unlockKitchenExitDoor: false,
        boardKomaPlaced: false,
        bearAppear: false,
        gaveKebabToBearFairy: false,
        unlockBox: false,
        mainDoorBoxDigits: [0, 0, 0, 0],
        unlockSafe: false,
        washitsuSafeDigits: [],
        washitsuSafeDialNumber: 0,
        badMannerPuddingAttempts: 0,
        badMannerPuddingRoom: "",
        onigiriCoinSequence: [],
        isNight: false,
        sheetStamps: {},
        glassWithWineDrinkCount: 0,

        talkTo: { bear: 0, wizard: 0 },
      },
    },

    tvDinner: {
      flags: { backgroundState: 0 },
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
    name: "出入口ドア前",
    description: "",
    clickableAreas: [
      {
        x: 34.7,
        y: 31.5,
        width: 16.8,
        height: 33.2,
        onClick: clickWrap(function () {
          changeRoom("doorFront");
        }),
        description: "ドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.1,
        y: 25.3,
        width: 16.4,
        height: 16.2,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterLighthouse, "観光情報のポスターが貼られている", IMAGES.modals.posterLighthouseEn);
        }),
        description: "灯台のポスター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.2,
        y: 79.2,
        width: 18.3,
        height: 17.5,
        onClick: clickWrap(function () {
          showMainDoorBoxPuzzle();
        }),
        description: "閉じた箱",
        zIndex: 5,
        usable: () => !gameState.main.flags.unlockBox,
        item: { img: "box", visible: () => !gameState.main.flags.unlockBox },
      },
      {
        x: 0.2,
        y: 78.0,
        width: 20.8,
        height: 20.7,
        onClick: clickWrap(function () {
          acquireItemOnce("foundMainDoorBoxCushion", "cushion", "箱の中に小さな座布団が入っている", IMAGES.items.cushion, "小さな座布団を手に入れた");
        }),
        description: "開いた箱",
        zIndex: 5,
        usable: () => gameState.main.flags.unlockBox,
        item: { img: "boxOpen", visible: () => gameState.main.flags.unlockBox },
      },
      {
        x: 77.2,
        y: 28.2,
        width: 22.4,
        height: 53.2,
        onClick: clickWrap(function () {
          changeRoom("washitsu");
        }),
        description: "和室へ",
        zIndex: 3,
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
            changeRoom("mainTv");
          },
          { allowAtNight: true },
        ),
        description: "ドア面左、テレビ面へ",
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
            changeRoom("mainBed");
          },
          { allowAtNight: true },
        ),
        description: "ドア面右、ベッド面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  doorFront: {
    name: "ドア前",
    description: "",
    clickableAreas: [
      {
        x: 42.2,
        y: 14.7,
        width: 24.7,
        height: 24.9,
        onClick: clickWrap(function () {
          showObj(null, "館内図だ", IMAGES.modals.map, "館内図が貼られている", IMAGES.modals.mapEn);
        }),
        description: "館内図",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 34.1,
        y: 6.8,
        width: 40.4,
        height: 92.1,
        onClick: clickWrap(function () {
          handleMainDoorClick();
        }),
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
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "ドア前戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  mainTv: {
    name: "テレビがある面",
    description: "",
    clickableAreas: [
      {
        x: 28.1,
        y: 38.8,
        width: 38.8,
        height: 20.8,
        onClick: clickWrap(handleMainTvScreenClick),
        description: "テレビ画面",
        zIndex: 5,
        usable: () => true,
        item: {
          img: () => (gameState.main.flags.connectWifi ? "tvMenu" : "tvWifi"),
          visible: () => gameState.main.flags.tvPowerOn,
        },
      },
      {
        x: 15.7,
        y: 67.9,
        width: 20.8,
        height: 9.5,
        onClick: clickWrap(showMainTvLeftDrawerPuzzle),
        description: "テレビ台引き出し左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 58.5,
        y: 67.9,
        width: 18.8,
        height: 9.6,
        onClick: clickWrap(showMainTvRightDrawerPuzzle),
        description: "テレビ台引き出し右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 52.2,
        y: 84.2,
        width: 12.1,
        height: 6.4,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.memo, "Wi-Fiパスワードの案内に走り書きが書かれている", IMAGES.modals.memoEn);
        }),
        description: "テーブルの上の書置き",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 37.2,
        y: 68.0,
        width: 20.7,
        height: 3.1,
        onClick: clickWrap(handleMainTvBackClick),
        description: "テレビ台中央奥",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 85.8,
        y: 63.0,
        width: 11.9,
        height: 12.2,
        onClick: clickWrap(function () {
          updateMessage("ふかふかのクッションだ");
        }),
        description: "ソファのクッション",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 19.4,
        y: 62.7,
        width: 7.2,
        height: 3.5,
        onClick: clickWrap(function () {
          updateMessage("メモ帳がある");
        }),
        description: "メモ",
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
            changeRoom("mainWindow");
          },
          { allowAtNight: true },
        ),
        description: "テレビがある面左、窓面へ",
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
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "テレビがある面右、ドア面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  tvMenu: {
    name: "テレビメニュー画面",
    description: "",
    clickableAreas: [
      {
        x: 6.3,
        y: 21.1,
        width: 65.6,
        height: 18.7,
        onClick: clickWrap(function () {
          changeRoom("tvBath");
        }),
        description: "大浴場混雑度ボタン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 6.6,
        y: 43.6,
        width: 65.0,
        height: 18.3,
        onClick: clickWrap(function () {
          changeRoom("tvDinner");
        }),
        description: "夕食時間予約ボタン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.9,
        y: 67.7,
        width: 31.6,
        height: 32.0,
        onClick: clickWrap(function () {
          updateMessage("お土産に人気のクッキーらしい。");
        }),
        description: "お土産に人気のクッキー",
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
            changeRoom("mainTv");
          },
          { allowAtNight: true },
        ),
        description: "テレビ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 90,
        y: 78,
        width: 10,
        height: 10,
        onClick: clickWrap(function () {
          uiLang = uiLang === "jp" ? "en" : "jp";
          renderCanvasRoom();
        }),
        description: "Language Toggle",
        zIndex: 10,
        item: {
          img: () => (uiLang === "jp" ? "lang_en" : "lang_jp"),
          visible: () => true,
        },
      },
    ],
  },
  tvBath: {
    name: "大浴場混雑度の画面",
    description: "",
    clickableAreas: [
      {
        x: 2.9,
        y: 2.4,
        width: 41.5,
        height: 10.9,
        onClick: clickWrap(function () {
          changeRoom("tvMenu");
        }),
        description: "TOPへ戻るボタン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 3.8,
        y: 23.5,
        width: 93.6,
        height: 71.9,
        onClick: clickWrap(function () {
          updateMessage("露天風呂は人気があるようだ");
        }),
        description: "混雑度表示",
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
            changeRoom("mainTv");
          },
          { allowAtNight: true },
        ),
        description: "テレビ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 90,
        y: 78,
        width: 10,
        height: 10,
        onClick: clickWrap(function () {
          uiLang = uiLang === "jp" ? "en" : "jp";
          renderCanvasRoom();
        }),
        description: "Language Toggle",
        zIndex: 10,
        item: {
          img: () => (uiLang === "jp" ? "lang_en" : "lang_jp"),
          visible: () => true,
        },
      },
    ],
  },
  tvDinner: {
    name: "夕食予約の画面",
    description: "",
    clickableAreas: [
      {
        x: 2.9,
        y: 2.4,
        width: 41.5,
        height: 10.9,
        onClick: clickWrap(function () {
          changeRoom("tvMenu");
        }),
        description: "TOPへ戻るボタン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 3.6,
        y: 15.6,
        width: 90.9,
        height: 67.2,
        onClick: clickWrap(showTvDinnerReservationPuzzle),
        description: "予約欄",
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
            changeRoom("mainTv");
          },
          { allowAtNight: true },
        ),
        description: "テレビ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 90,
        y: 78,
        width: 10,
        height: 10,
        onClick: clickWrap(function () {
          uiLang = uiLang === "jp" ? "en" : "jp";
          renderCanvasRoom();
        }),
        description: "Language Toggle",
        zIndex: 10,
        item: {
          img: () => (uiLang === "jp" ? "lang_en" : "lang_jp"),
          visible: () => true,
        },
      },
    ],
  },
  mainWindow: {
    name: "バルコニー前",
    description: "",
    clickableAreas: [
      {
        x: 10.9,
        y: 54.2,
        width: 24.3,
        height: 44.7,
        onClick: clickWrap(function () {
          if (gameState.selectedItem == "cushion") {
            removeItem("cushion");
            gameState.main.flags.putCushion = true;
            updateMessage("小さい座布団を置いた");
            renderCanvasRoom();
            return;
          }

          if (gameState.selectedItem == "daikonkun") {
            if (gameState.main.flags.putCushion) {
              removeItem("daikonkun");
              gameState.main.flags.putDaikonkun = true;
              showObj(null, "大根くんのぬいぐるみを置いた", IMAGES.modals.daikonkunSucceed, "大根くんのぬいぐるみをぬい撮りスタンドに置いた");
              renderCanvasRoom();
              return;

              daikonkunSucceed;
            } else {
              const content = `
              <div style="text-align:center;">
                <div class="modal-anim moda-anim">
                  <img src="${IMAGES.modals.daikonkunChallenge}" alt="大根くんをたてかける">
                  <img src="${IMAGES.modals.daikonkunFailure}" alt="大根くんがたおれる">
                </div>
              </div>
            `;
              showModal("大根くんをスタンドに立てかけようとした", content, [{ text: "閉じる", action: "close" }]);
              updateMessage("大根くんは倒れてしまった");

              return;
            }
          }
          if (gameState.selectedItem == "camera" && gameState.main.flags.putDaikonkun) {
            if (gameState.main.flags.tookPicDaikonkun) {
              updateMessage("もうこの写真は撮影した");
              return;
            }

            gameState.main.flags.tookPicDaikonkun = true;
            addItem("picDaikonkun");
            const content = `
              <div style="text-align:center;">
                <div class="modal-anim">
                  <img src="${IMAGES.modals.cameraTake}" alt="大根くんを撮影する">
                  <img src="${IMAGES.modals.cameraPrint}" alt="大根くんの写真が出る">
                </div>
              </div>
            `;
            playSE?.("se-shutter");
            showModal("大根くんのナイスショットを撮影した", content, [{ text: "閉じる", action: "close" }]);
            updateMessage("大根くんのナイスショットを撮影した");
            return;
          }
          if (gameState.main.flags.putDaikonkun) {
            updateMessage("ぬい撮りスタンドには大根くんのぬいぐるみが置かれている。");
            return;
          }
          updateMessage("ぬい撮りスタンドと書かれている。ぬいぐるみを置いて撮影するための台だ。");
        }),
        description: "ぬい撮りスタンド",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 18.7,
        y: 72.0,
        width: 8.6,
        height: 3.6,
        onClick: clickWrap(function () {}),
        description: "小さな座布団置き場所",
        zIndex: 5,
        usable: () => false,
        item: { img: "cushion", visible: () => gameState.main.flags.putCushion },
      },
      {
        x: 12.6,
        y: 54.2,
        width: 20.6,
        height: 20.7,
        onClick: clickWrap(function () {}),
        description: "大根くん表示位置",
        zIndex: 5,
        usable: () => false,
        item: { img: "daikonkun", visible: () => gameState.main.flags.putDaikonkun },
      },
      {
        x: 20.3,
        y: 10.6,
        width: 59.2,
        height: 77.0,
        onClick: clickWrap(function () {
          changeRoom("balconyCenter");
        }),
        description: "バルコニーへ",
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
            changeRoom("mainBed");
          },
          { allowAtNight: true },
        ),
        description: "バルコニー左、ベッド面へ",
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
            changeRoom("mainTv");
          },
          { allowAtNight: true },
        ),
        description: "バルコニー右、テレビ面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  washitsu: {
    name: "和室",
    description: "",
    clickableAreas: [
      {
        x: 56.3,
        y: 65.6,
        width: 10.8,
        height: 6.2,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unpackSweet) {
            showObj(null, "", IMAGES.items.sweet, "美味しそうなお菓子だ");
            return;
          }
          updateMessage("お皿が置かれている");
        }),
        description: "クッキーが乗ったお皿",
        zIndex: 5,
        usable: () => true,
        item: { img: "sweet", visible: () => gameState.main.flags.unpackSweet },
      },
      {
        x: 41.9,
        y: 58.9,
        width: 12.9,
        height: 11.7,
        onClick: clickWrap(handleBasketWithSweetClick),
        description: "お菓子入りバスケット",
        zIndex: 5,
        usable: () => !gameState.main.flags.unpackSweet,
        item: { img: "basketWithSweet", visible: () => !gameState.main.flags.unpackSweet },
      },
      {
        x: 41.9,
        y: 58.9,
        width: 12.9,
        height: 11.7,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.basketPaper, "お菓子が入っていたかごだ");
        }),
        description: "お菓子なしバスケット",
        zIndex: 5,
        usable: () => true,
        item: { img: "basket", visible: () => gameState.main.flags.unpackSweet },
      },
      {
        x: 79.0,
        y: 37.8,
        width: 10.5,
        height: 10.7,
        onClick: clickWrap(showWashitsuSafePuzzle),
        description: "金庫",
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
        description: "開いた金庫",
        zIndex: 5,
        usable: () => false,
        item: { img: "safeOpen", visible: () => gameState.main.flags.unlockSafe },
      },
      {
        x: 80.4,
        y: 50.6,
        width: 9.2,
        height: 15.4,
        onClick: clickWrap(handleWashitsuSafeBottomStorageClick),
        description: "金庫下の鍵付き収納",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 7.7,
        y: 12.4,
        width: 18.4,
        height: 44.7,
        onClick: clickWrap(function () {
          changeRoom("kakejikuZoom");
        }),
        description: "掛け軸",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 7.5,
        y: 58.2,
        width: 18.6,
        height: 2.1,
        onClick: clickWrap(handleKakejikuBottomClick),
        description: "掛け軸下",
        zIndex: 5,
        usable: () => true,
        item: { img: "blackBack", visible: () => gameState.main.flags.unlockKakejiku && !gameState.main.flags.foundKakejikuScale },
      },
      {
        x: 8.1,
        y: 58.6,
        width: 17.0,
        height: 1.4,
        onClick: clickWrap(function () {}),
        description: "定規表示領域",
        zIndex: 5,
        usable: () => false,
        item: { img: "scale", visible: () => gameState.main.flags.unlockKakejiku && !gameState.main.flags.foundKakejikuScale },
      },
      {
        x: 30.3,
        y: 50.6,
        width: 10.8,
        height: 13.1,
        onClick: clickWrap(function () {
          if (gameState.selectedItem == "scale") {
            showObj(null, "定規を当てた。", IMAGES.modals.modelScale, "灯台の模型に定規を当てた");
          } else {
            showObj(null, "1/100スケールの灯台の模型だ。", IMAGES.modals.model, "灯台の模型がある");
          }
        }),
        description: "灯台の模型",
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
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "和室戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  kakejikuZoom: {
    name: "和室の掛け軸",
    description: "",
    clickableAreas: [
      {
        x: 20.8,
        y: 6.3,
        width: 7.1,
        height: 6.8,
        onClick: clickWrap(function () {
          handleKakejikuButton("LU");
        }),
        description: "ボタン左上",
        zIndex: 5,
        usable: () => !gameState.main.flags.unlockKakejiku,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 21.6,
        y: 80.5,
        width: 7.0,
        height: 6.7,
        onClick: clickWrap(function () {
          handleKakejikuButton("LD");
        }),
        description: "ボタン左下",
        zIndex: 5,
        usable: () => !gameState.main.flags.unlockKakejiku,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.5,
        y: 6.7,
        width: 7.2,
        height: 6.7,
        onClick: clickWrap(function () {
          handleKakejikuButton("RU");
        }),
        description: "ボタン右上",
        zIndex: 5,
        usable: () => !gameState.main.flags.unlockKakejiku,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.2,
        y: 80.8,
        width: 7.2,
        height: 6.6,
        onClick: clickWrap(function () {
          handleKakejikuButton("RD");
        }),
        description: "ボタン右下",
        zIndex: 5,
        usable: () => !gameState.main.flags.unlockKakejiku,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 33.3,
        y: 90.5,
        width: 36.3,
        height: 5.3,
        onClick: clickWrap(function () {
          updateMessage("「DAIKON」というタイトルのようだ");
        }),
        description: "タイトル",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 35.4,
        y: 10.6,
        width: 32.4,
        height: 70.9,
        onClick: clickWrap(function () {
          updateMessage("大根の絵が描かれている");
        }),
        description: "水墨画",
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
            changeRoom("washitsu");
          },
          { allowAtNight: true },
        ),
        description: "掛け軸戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  mainBed: {
    name: "ベッドがある面",
    description: "",
    clickableAreas: [
      {
        x: 63.0,
        y: 46.8,
        width: 20.1,
        height: 11.9,
        onClick: clickWrap(handleRightPillowClick),
        description: "右の枕",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 45.9,
        y: 21.7,
        width: 13.8,
        height: 10.4,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterFuro, "イベントの告知のようだ", IMAGES.modals.posterFuroEn);
        }),
        description: "壁の絵",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 50.1,
        y: 61.2,
        width: 5.4,
        height: 4.7,
        onClick: clickWrap(function () {}),
        description: "大根君表示",
        zIndex: 5,
        usable: () => false,
        item: { img: "daikonkun", visible: () => !gameState.main.flags.foundDaikonkun },
      },

      {
        x: 46.2,
        y: 51.9,
        width: 13.1,
        height: 16.1,
        onClick: clickWrap(function () {
          changeRoom("sidetable");
        }),
        description: "サイドテーブル周辺",
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
        description: "ベッドがある面左、ドア面へ",
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
            changeRoom("mainWindow");
          },
          { allowAtNight: true },
        ),
        description: "ベッドがある面右、バルコニー前へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  sidetable: {
    name: "ベッドサイドテーブル",
    description: "",
    clickableAreas: [
      {
        x: 32.3,
        y: 60.4,
        width: 34.3,
        height: 29.1,
        onClick: clickWrap(function () {
          acquireItemOnce("foundDaikonkun", "daikonkun", "大根くんのぬいぐるみがある", IMAGES.items.daikonkun, "大根くんのぬいぐるみを手に入れた");
        }),
        description: "大根君",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundDaikonkun,
        item: { img: "daikonkun", visible: () => !gameState.main.flags.foundDaikonkun },
      },
      {
        x: 25.6,
        y: 46.6,
        width: 10.4,
        height: 10.4,
        onClick: clickWrap(function () {
          handleSidetableButton("L");
        }),
        description: "左ボタン",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundSidetableCamera,
      },
      {
        x: 63.6,
        y: 46.4,
        width: 11.0,
        height: 10.4,
        onClick: clickWrap(function () {
          handleSidetableButton("R");
        }),
        description: "右ボタン",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundSidetableCamera,
      },
      {
        x: 16.1,
        y: 43.5,
        width: 68.8,
        height: 16.2,
        onClick: clickWrap(handleSidetableDrawerClick),
        description: "引き出し",
        zIndex: 5,
        usable: () => true,
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainBed");
          },
          { allowAtNight: true },
        ),
        description: "サイドテーブル戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  balconyCenter: {
    name: "バルコニー",
    description: "",
    clickableAreas: [
      {
        x: 74.6,
        y: 24.7,
        width: 24.5,
        height: 26.9,
        onClick: clickWrap(function () {
          showLighthouseModal();
        }),
        description: "灯台",
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
            changeRoom("balconyLeft");
          },
          { allowAtNight: true },
        ),
        description: "バルコニー左、左面へ",
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
            changeRoom("balconyRight");
          },
          { allowAtNight: true },
        ),
        description: "バルコニー右、右面へ",
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
            changeRoom("mainWindow");
          },
          { allowAtNight: true },
        ),
        description: "バルコニー戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  balconyLeft: {
    name: "バルコニー左",
    description: "",
    clickableAreas: [
      {
        x: 7.0,
        y: 1.6,
        width: 68.3,
        height: 60.7,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.balconyLeft, "隙間から覗いた");
        }),
        description: "仕切り壁",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("balconyCenter");
          },
          { allowAtNight: true },
        ),
        description: "バルコニー左面右、バルコニーセンターへ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  balconyRight: {
    name: "バルコニー右",
    description: "",
    clickableAreas: [
      {
        x: 24.9,
        y: 1.1,
        width: 73.3,
        height: 68.6,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.balconyRight, "隙間から覗いた");
        }),
        description: "仕切り壁",
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
            changeRoom("balconyCenter");
          },
          { allowAtNight: true },
        ),
        description: "バルコニー右面左、バルコニーセンターへ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
    ],
  },
  hall: {
    name: "エレベーターホール",
    description: "",
    clickableAreas: [
      {
        x: 0.9,
        y: 13.1,
        width: 40.9,
        height: 63.9,
        onClick: clickWrap(function () {
          showHallElevatorModal();
        }),
        description: "エレベーター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 70.0,
        y: 21.9,
        width: 28.3,
        height: 42.4,
        onClick: clickWrap(function () {
          handleHallVendingMachineClick();
        }),
        description: "自販機",
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
            changeRoom("doorFront");
          },
          { allowAtNight: true },
        ),
        description: "ホール戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  robby: {
    name: "ロビー",
    description: "",
    clickableAreas: [
      {
        x: 65.4,
        y: 22.1,
        width: 16.1,
        height: 27.8,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockRobbyElevator) {
            showToast?.("エレベーターに乗った");
            travelWithElevatorRide("trueEnd");
            return;
          }

          updateMessage("扉は開かない");
        }),
        description: "エレベーター扉",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 83.5,
        y: 27.7,
        width: 6.5,
        height: 9.5,
        onClick: clickWrap(showRobbyElevatorPuzzle),
        description: "エレベーターUI",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 36.5,
        y: 37.6,
        width: 16.3,
        height: 24.8,
        onClick: clickWrap(function () {
          if (gameState.selectedItem == "picDaikonkunBear") {
            updateMessage("えへへ");
            return;
          }
          updateMessage("「ごくごく…」");
        }),
        description: "ミルクを飲むクマ妖精",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 13.4,
        y: 40.9,
        width: 21.8,
        height: 25.3,
        onClick: clickWrap(handleRobbyDaikonStandClick),
        description: "大根くんのぬいぐるみの台",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 32.5,
        y: 20.8,
        width: 16.4,
        height: 15.6,
        onClick: clickWrap(function () {
          updateMessage("そろそろ、夕食の時間かもしれない");
        }),
        description: "窓の外",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 63.2,
        y: 56.5,
        width: 15.7,
        height: 30.5,
        onClick: clickWrap(function () {
          updateMessage("カルシウムは大事だ。");
        }),
        description: "手に持った牛乳",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
    ],
  },
  restaurant: {
    name: "一人でディナーエンド",
    description: "海の見える部屋から脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {
          showEndingReport("restaurant");
        }),
        description: "一人でディナーエンド",
      },
    ],
  },
  end: {
    name: "ノーマルエンド",
    description: "海の見える部屋から脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 53.7,
        y: 54.0,
        width: 19.4,
        height: 18.2,
        onClick: clickWrap(handleEndBathBearClick),
        description: "お湯に浮くクマ妖精",
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
    name: "ディナーエンド",
    description: "夕食の時間です！脱出おめでとうございます。",
    clickableAreas: [
      {
        x: 33.2,
        y: 49.7,
        width: 32.0,
        height: 15.4,
        onClick: clickWrap(function () {
          updateMessage("美味しそうなマグロの刺身だ");
        }),
        description: "マグロの刺身",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 66.3,
        y: 56.4,
        width: 27.3,
        height: 40.3,
        onClick: clickWrap(handleTrueEndBuffetBearClick),
        description: "ビュッフェのクマ妖精",
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
    bear: ["「こんにちは」", "「え？駒？」", "「お腹空いたなあ…」"],
  },
};

function showHallElevatorModal() {
  showModal("エレベーター", "", [
    { text: "7階：レストランなのはな", action: handleHallElevatorDinnerSelect },
    { text: "8階：大浴場", action: () => travelWithElevatorRide("end", { endBackgroundState: 1 }) },
    { text: "閉じる", action: "close" },
  ]);
}

function handleHallElevatorDinnerSelect() {
  const flags = gameState.tvDinner?.flags || (gameState.tvDinner = { flags: { backgroundState: 0 } }).flags;
  if (flags.backgroundState === 0) {
    showDinnerReservationBadEnd();
    return;
  }

  travelWithElevatorRide("restaurant");
}

function handleHallVendingMachineClick() {
  if (gameState.selectedItem !== "yen300") {
    updateMessage("飲み物の自動販売機だ。お金があれば飲み物が買えそうだ");
    return;
  }
  if (hasItem("milk")) {
    updateMessage("もう飲み物は買った");
    return;
  }

  removeItem("yen300");
  playSE?.("se-vendingmachine");
  addItem("milk");
  showModal("牛乳を買った", `<img src="${IMAGES.modals.milkGet}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
  updateMessage("牛乳を2本買った。");
}

function travelWithElevatorRide(destRoom, options = {}) {
  closeModal();
  playSE?.("se-elevator2");

  const overlay = document.getElementById("roomEffectOverlay");
  if (overlay) {
    overlay.classList.remove("warp-active");
    overlay.style.background = "#000";
    overlay.style.opacity = 1;
  }

  setTimeout(() => {
    if (destRoom === "end" && Number.isInteger(options.endBackgroundState)) {
      gameState.end.flags.backgroundState = options.endBackgroundState;
    }
    changeRoom(destRoom);
  }, 1000);

  setTimeout(() => {
    if (overlay) {
      overlay.style.opacity = 0;
      overlay.style.background = "";
    }
  }, 2000);
}

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
  changeRoom("mainTv");
  updateInventoryDisplay();
  updateMessage("気が付くと見知らぬ部屋に立っていた。");
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
    changeBGM(S39("Serene_Sunlit.mp3"));
  } else if (roomId === "end" || roomId === "restaurant") {
    const endBgState = gameState.end?.flags?.backgroundState ?? 0;
    changeBGM(endBgState === 0 ? S39("yukino_furunakano_onsen.mp3") : S39("tabiyukeba.mp3"));
  } else {
    changeBGM(DEFAULT_BGM);
  }

  // nav
  if (roomId === "washitsu") {
    addNaviItem(roomId);
    renderNavigation();
  }
  if (roomId === "trueEnd" || roomId === "end" || roomId === "robby" || roomId === "restaurant") {
    gameState.openRooms = [];
    // renderNavigation();
  }
  renderNavigation();
}

const END_IDS = new Set(["end", "trueEnd", "restaurant"]);

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

    delete gameState.fx.deskDrawerOpen;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
    options.onDone?.();
  };

  requestAnimationFrame(tick);
}

function handleSidetableButton(input) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.foundSidetableCamera) return;

  const answer = ["L", "R", "R", "R", "L"];
  const inputs = Array.isArray(f.sidetableButtonInputs) ? f.sidetableButtonInputs.slice() : [];
  inputs.push(input);
  f.sidetableButtonInputs = inputs.slice(-answer.length);

  playSE?.("se-click");
  updateMessage(input === "L" ? "左のボタンを押した。" : "右のボタンを押した。");

  if (f.sidetableButtonInputs.length !== answer.length) return;

  const solved = answer.every((value, idx) => f.sidetableButtonInputs[idx] === value);
  if (!solved) {
    f.sidetableButtonInputs = [];
    playSE?.("se-error");
    updateMessage("順番が違うようだ。");
    return;
  }

  f.unlockSidetableDrawer = true;
  f.sidetableButtonInputs = [];
  markProgress?.("unlock_sidetable_drawer");
  playDeskDrawerOpenFx("sidetable", "引き出し", {
    frontFill: "#D58941",
    sideTop: "#a8734c",
    sideBottom: "#835638",
    gripStyle: "recessed",
    gripColor: "#49372d",
    soundId: "se-hikidashi",
    onDone: () => {
      acquireItemOnce("foundSidetableCamera", "camera", "引き出しにカメラがある", IMAGES.items.camera, "カメラを手に入れた");
    },
  });
}

function handleSidetableDrawerClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.foundSidetableCamera) {
    updateMessage("もうなにもない");
    return;
  }
  if (!f.unlockSidetableDrawer) {
    updateMessage("引き出しは閉まっている。");
    return;
  }

  playDeskDrawerOpenFx("sidetable", "引き出し", {
    frontFill: "#D58941",
    sideTop: "#a8734c",
    sideBottom: "#835638",
    gripStyle: "recessed",
    gripColor: "#49372d",
    soundId: "se-hikidashi",
    onDone: () => {
      acquireItemOnce("foundSidetableCamera", "camera", "引き出しにカメラがある", IMAGES.items.camera, "カメラを手に入れた");
    },
  });
}

function handleKakejikuButton(input) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockKakejiku) return;

  const answer = ["LD", "RU", "RD", "LU", "RD", "RU"];
  const inputs = Array.isArray(f.kakejikuButtonInputs) ? f.kakejikuButtonInputs.slice() : [];
  inputs.push(input);
  f.kakejikuButtonInputs = inputs;
  playSE?.("se-mouse");

  const isValidPrefix = f.kakejikuButtonInputs.every((value, idx) => answer[idx] === value);
  if (!isValidPrefix) {
    f.kakejikuButtonInputs = [];
    return;
  }

  if (f.kakejikuButtonInputs.length !== answer.length) return;

  f.unlockKakejiku = true;
  f.kakejikuButtonInputs = [];
  markProgress?.("unlock_kakejiku");
  playSE?.("se-metal");
  renderCanvasRoom?.();
  showModal("何か物音がした", "", [{ text: "閉じる", action: "close" }]);
  updateMessage("何か物音がした");
}

function handleKakejikuBottomClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.unlockKakejiku) {
    updateMessage("壁に線が入っている");
    return;
  }

  acquireItemOnce("foundKakejikuScale", "scale", "定規がある", IMAGES.items.scale, "定規を手に入れた");
}

function handleMainTvBackClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.foundMainTvBackKey) {
    updateMessage("もう何もない");
    return;
  }

  if (gameState.selectedItem !== "scale") {
    showObj(null, "", IMAGES.modals.keyFind, "何か見えるが手が届かない");
    return;
  }

  f.foundMainTvBackKey = true;
  const content = `
    <div style="text-align:center;">
      <div class="modal-anim moda-anim">
        <img src="${IMAGES.modals.keyScale}" alt="定規でテレビ台の奥を探る">
        <img src="${IMAGES.modals.keyScale2}" alt="鍵を引き寄せる">
      </div>
    </div>
  `;
  showModal("テレビ台の奥", content, [{ text: "閉じる", action: "close" }], () => {
    addItem("key");
    showModal("カギを手に入れた", `<img src="${IMAGES.items.key}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
    updateMessage("カギを手に入れた");
  });
  updateMessage("定規で奥を探った");
}

function handleWashitsuSafeBottomStorageClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockWashitsuSafeBottomStorage) {
    acquireItemOnce("foundWashitsuSafeBottomStorageYukata", "yukata", "収納の中に浴衣がある", IMAGES.items.yukata, "浴衣を手に入れた");
    return;
  }

  if (gameState.selectedItem !== "key") {
    updateMessage("鍵がかかっている。");
    return;
  }

  removeItem("key");
  f.unlockWashitsuSafeBottomStorage = true;
  markProgress?.("unlock_washitsu_safe_bottom_storage");
  playSE?.("se-gacha");
  renderCanvasRoom?.();
  updateMessage("金庫下の収納の鍵を開けた。");
}

function handleRightPillowClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.foundRemocon) {
    updateMessage("枕がある。");
    return;
  }

  f.foundRemocon = true;
  addItem("remoconBack");
  renderCanvasRoom();
  showModal("枕の下にリモコンがあった", `<img src="${IMAGES.modals.pillow}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
  updateMessage("枕の下にリモコンがあった");
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

function handleMainTvScreenClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.connectWifi) {
    changeRoom("tvMenu");
    return;
  }

  if (f.tvPowerOn) {
    showTvWifiPuzzle();
    return;
  }

  if (gameState.selectedItem === "remocon") {
    f.tvPowerOn = true;
    playSE?.("se-mouse");
    updateMessage("テレビをつけた");
    renderCanvasRoom();
    return;
  }

  updateMessage("テレビがある。");
}

function showTvWifiPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.connectWifi) {
    changeRoom("tvMenu");
    return;
  }

  const boxStyle = [
    "min-width:64px",
    "height:54px",
    "padding:0 10px",
    "border:2px solid #555",
    "border-radius:4px",
    "background:#fff",
    "color:#111",
    "font-size:20px",
    "font-weight:700",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08)",
  ].join(";");
  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="width:min(82vw, 400px); padding:24px 18px; box-sizing:border-box; background:#050505; color:#fff; text-align:center; border-radius:4px;">
        <div style="font-size:clamp(26px, 8vw, 42px); font-weight:800; letter-spacing:0;">HOTEL Wi-Fi</div>
      </div>
      <div style="display:flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap;">
        <button id="tvWifiNumber" type="button" aria-label="数字" style="${boxStyle}; width:64px;">1</button>
        <span style="min-width:34px; height:54px; padding:0 6px; box-sizing:border-box; display:flex; align-items:center; justify-content:center; background:#e5e5e5; color:#111; border-radius:4px; font-size:28px; line-height:1; font-weight:700;">_</span>
        <button id="tvWifiWord" type="button" aria-label="名前" style="${boxStyle}; min-width:104px;">hinoki</button>
        <button id="tvWifiConnect" class="ok-btn" type="button">CONNECT</button>
      </div>
      <div id="tvWifiHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("Wi-Fi接続", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("テレビにWi-Fi接続画面が表示されている。");

  setTimeout(() => {
    const words = ["hinoki", "fuji", "midori", "yomogi", "goten", "roman"];
    const savedNumber = Number(f.tvWifiNumberIndex);
    const savedWord = Number(f.tvWifiWordIndex);
    let numberIndex = Number.isInteger(savedNumber) && savedNumber >= 0 && savedNumber < 6 ? savedNumber : 0;
    let wordIndex = Number.isInteger(savedWord) && savedWord >= 0 && savedWord < words.length ? savedWord : 0;
    const numberBtn = document.getElementById("tvWifiNumber");
    const wordBtn = document.getElementById("tvWifiWord");
    const connectBtn = document.getElementById("tvWifiConnect");
    const hintEl = document.getElementById("tvWifiHint");
    if (!numberBtn || !wordBtn || !connectBtn || !hintEl) return;

    const repaint = () => {
      numberBtn.textContent = String(numberIndex + 1);
      wordBtn.textContent = words[wordIndex];
      hintEl.textContent = "";
    };

    numberBtn.addEventListener("click", () => {
      numberIndex = (numberIndex + 1) % 6;
      f.tvWifiNumberIndex = numberIndex;
      playSE?.("se-pi");
      repaint();
    });

    wordBtn.addEventListener("click", () => {
      wordIndex = (wordIndex + 1) % words.length;
      f.tvWifiWordIndex = wordIndex;
      playSE?.("se-pi");
      repaint();
    });

    connectBtn.addEventListener("click", () => {
      f.tvWifiNumberIndex = numberIndex;
      f.tvWifiWordIndex = wordIndex;
      if (numberIndex + 1 === 5 && words[wordIndex] === "goten") {
        f.connectWifi = true;
        markProgress?.("connect_wifi");
        playSE?.("se-cyber");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("Wi-Fiに接続した。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "接続できないようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showTvDinnerReservationPuzzle() {
  const flags = gameState.tvDinner?.flags || (gameState.tvDinner = { flags: { backgroundState: 0 } }).flags;
  if (flags.backgroundState === 1) {
    updateMessage("夕食時間は予約済みだ。");
    return;
  }

  const fixedStyle = ["font-size:clamp(34px, 11vw, 56px)", "font-weight:900", "line-height:1", "color:#fff", "min-width:72px", "text-align:center"].join("; ");
  const colonStyle = ["font-size:clamp(34px, 11vw, 56px)", "font-weight:900", "line-height:1", "color:#fff", "padding-bottom:28px"].join("; ");
  const inputStyle = [
    "width:min(23vw, 112px)",
    "height:min(23vw, 88px)",
    "min-width:72px",
    "min-height:58px",
    "box-sizing:border-box",
    "border:3px solid #fff",
    "background:#000",
    "color:#fff",
    "font-size:clamp(30px, 10vw, 50px)",
    "font-weight:900",
    "text-align:center",
    "outline:none",
    "padding:0 4px",
  ].join("; ");
  const labelStyle = ["height:20px", "margin-top:6px", "font-size:13px", "font-weight:700", "letter-spacing:0", "line-height:1", "color:#fff", "text-align:center"].join("; ");

  const content = `
    <div style="max-width:560px; margin:0 auto; padding:24px 18px 18px; background:#000; color:#fff; text-align:center;">
      <div style="font-size:clamp(30px, 9vw, 48px); font-weight:900; line-height:1.15; margin-bottom:26px;">ご予約時間</div>
      <div style="display:flex; justify-content:center; align-items:flex-end; gap:clamp(8px, 3vw, 28px);">
        <div>
          <div style="${fixedStyle}">18</div>
          <div style="${labelStyle}">H</div>
        </div>
        <div style="${colonStyle}">:</div>
        <div>
          <input id="tvDinnerMinute" type="text" inputmode="numeric" autocomplete="off" maxlength="2" aria-label="分" style="${inputStyle}">
          <div style="${labelStyle}">M</div>
        </div>
        <div style="${colonStyle}">:</div>
        <div>
          <input id="tvDinnerSecond" type="text" inputmode="numeric" autocomplete="off" maxlength="2" aria-label="秒" style="${inputStyle}">
          <div style="${labelStyle}">S</div>
        </div>
      </div>
      <button id="tvDinnerReservationOk" class="ok-btn" type="button" style="margin-top:18px;">OK</button>
      <div id="tvDinnerReservationHint" style="min-height:1.2em; margin-top:8px; font-size:0.92em; color:#fff; text-align:center;"></div>
    </div>
  `;

  showModal("夕食時間予約", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("夕食の予約時間を入力するようだ。");

  setTimeout(() => {
    const minuteInput = document.getElementById("tvDinnerMinute");
    const secondInput = document.getElementById("tvDinnerSecond");
    const okBtn = document.getElementById("tvDinnerReservationOk");
    const hintEl = document.getElementById("tvDinnerReservationHint");
    if (!minuteInput || !secondInput || !okBtn || !hintEl) return;

    const normalizeDigits = (el) => {
      el.value = el.value.replace(/\D/g, "").slice(0, 2);
    };
    [minuteInput, secondInput].forEach((input) => {
      input.addEventListener("input", () => normalizeDigits(input));
    });

    okBtn.addEventListener("click", () => {
      normalizeDigits(minuteInput);
      normalizeDigits(secondInput);
      if (minuteInput.value === "4" && secondInput.value === "33") {
        flags.backgroundState = 1;
        markProgress?.("reserve_tv_dinner");
        playSE?.("se-cyber");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("夕食時間を予約した。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "予約できないようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    minuteInput.focus();
  }, 0);
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

function handleRobbyDaikonStandClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (gameState.selectedItem !== "camera") {
    updateMessage("大根くんのぬいぐるみが置かれている。");
    return;
  }

  if (f.tookPicDaikonkunBear) {
    updateMessage("もう写真は撮った");
    return;
  }

  playSE?.("se-shutter");
  flashScreen?.("white", 650);
  showToast?.("写真を撮った");
  f.tookPicDaikonkunBear = true;
  addItem("picDaikonkunBear");

  updateMessage("写真を撮った。");
}

function handleTrueEndBuffetBearClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (gameState.selectedItem !== "camera") {
    updateMessage("「マグロ！」");
    return;
  }

  if (f.tookPicBear) {
    updateMessage("もう写真は撮った");
    return;
  }

  playSE?.("se-shutter");
  flashScreen?.("white", 650);
  showToast?.("写真を撮った");
  f.tookPicBear = true;
  addItem("picBear");

  updateMessage("写真を撮った。");
}

function handleEndBathBearClick() {
  if (gameState.selectedItem === "camera") {
    updateMessage("お風呂でカメラは使えない");
    return;
  }

  if (gameState.selectedItem !== "milk") {
    showObj(null, "「いい湯だなー」", IMAGES.modals.bearBath, "クマ妖精はお風呂を堪能している");
    return;
  }

  if (!hasItem("yukata") || !hasItem("picDaikonkun")) {
    updateMessage("「おっ。牛乳だ！いいねー」");
    return;
  }

  removeItem("milk");
  removeItem("yukata");
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.bearHappy}" alt="喜ぶクマ妖精" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
      <p style="margin:0; line-height:1.8;">クマ妖精は喜んでいる</p>
    </div>
  `;
  showModal("「わあ、湯上りにぴったりだね」", content, [{ text: "閉じる", action: "close" }], () => {
    travelWithSteps("robby");
  });
  updateMessage("わあ、湯上りにぴったりだね");
}

function showRobbyElevatorPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockRobbyElevator) {
    updateMessage("エレベーターは動きそうだ。");
    return;
  }

  const squareStyle = [
    "width:min(15vw, 62px)",
    "height:min(15vw, 62px)",
    "min-width:42px",
    "min-height:42px",
    "border:2px solid #555",
    "border-radius:4px",
    "background:#fff",
    "color:#111",
    "font-size:clamp(24px, 8vw, 34px)",
    "font-weight:800",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "padding:0",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08)",
  ].join("; ");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div class="notranslate" translate="no" lang="en" style="display:flex; gap:6px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3, 4]
          .map(
            (idx) => `
              <button id="robbyElevatorLetter${idx}" type="button" class="notranslate" translate="no" lang="en" aria-label="${idx + 1}文字目" style="${squareStyle}">A</button>
            `,
          )
          .join("")}
      </div>
      <button id="robbyElevatorOk" class="ok-btn" type="button">OK</button>
      <div id="robbyElevatorHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("エレベーター", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("エレベーターの行先入力パネルのようだ。");

  setTimeout(() => {
    const letters = ["A", "E", "I", "N", "P", "R", "S", "T", "Y"];
    const saved = Array.isArray(f.robbyElevatorLetters) ? f.robbyElevatorLetters : [0, 0, 0, 0, 0];
    const state = [0, 1, 2, 3, 4].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < letters.length ? value : 0;
    });
    const letterBtns = [0, 1, 2, 3, 4].map((idx) => document.getElementById(`robbyElevatorLetter${idx}`));
    const okBtn = document.getElementById("robbyElevatorOk");
    const hintEl = document.getElementById("robbyElevatorHint");
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
        f.robbyElevatorLetters = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.robbyElevatorLetters = state.slice();
      const answer = state.map((index) => letters[index]).join("");
      if (answer === "PARTY") {
        f.unlockRobbyElevator = true;
        markProgress?.("unlock_robby_elevator");
        playSE?.("se-gacha");
        closeModal();
        updateMessage("エレベーターのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function handleMainDoorQrReaderClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainDoor) {
    updateMessage("ドアのロックは外れている。");
    return;
  }

  f.unlockMainDoor = true;
  markProgress?.("unlock_main_door");
  playSE?.("se-cyber");
  renderCanvasRoom?.();
  updateMessage("ドアのロックが外れた。");
}

function handleMainDoorClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.unlockMainDoor) {
    showMainDoorKanaPuzzle();
    return;
  }

  changeRoom("hall");
}

function showMainDoorKanaPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainDoor) {
    changeRoom("hall");
    return;
  }

  const squareStyle = [
    "width:min(23vw, 84px)",
    "height:min(23vw, 84px)",
    "max-width:84px",
    "max-height:84px",
    "border:2px solid #9b8240",
    "border-radius:4px",
    "background:#fff0a8",
    "color:#2b2412",
    "font-size:clamp(32px, 10vw, 44px)",
    "font-weight:800",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "padding:0",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(255,255,255,0.55), 0 2px 5px rgba(0,0,0,0.18)",
  ].join("; ");

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <p style="margin:0; line-height:1.8; text-align:center;">ドアがロックされている。</p>
      <div class="notranslate" translate="no" lang="ja" style="display:flex; gap:10px; justify-content:center; align-items:center;">
        ${[0, 1, 2]
          .map(
            (idx) => `
              <button id="mainDoorKana${idx}" type="button" class="notranslate" translate="no" lang="ja" aria-label="${idx + 1}文字目" style="${squareStyle}">ひ</button>
            `,
          )
          .join("")}
      </div>
      <button id="mainDoorKanaOk" class="ok-btn" type="button">OK</button>
      <div id="mainDoorKanaHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("ドア", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("ドアがロックされている。");

  setTimeout(() => {
    const kana = ["ひ", "ふ", "み", "よ", "ご", "ろ", "な", "は"];
    const saved = Array.isArray(f.mainDoorKanaIndexes) ? f.mainDoorKanaIndexes : [0, 0, 0];
    const state = [0, 1, 2].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < kana.length ? value : 0;
    });
    const kanaBtns = [0, 1, 2].map((idx) => document.getElementById(`mainDoorKana${idx}`));
    const okBtn = document.getElementById("mainDoorKanaOk");
    const hintEl = document.getElementById("mainDoorKanaHint");
    if (kanaBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const repaint = () => {
      kanaBtns.forEach((btn, idx) => {
        btn.textContent = kana[state[idx]];
      });
      hintEl.textContent = "";
    };

    kanaBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % kana.length;
        f.mainDoorKanaIndexes = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainDoorKanaIndexes = state.slice();
      const answer = state.map((index) => kana[index]).join("");
      if (answer === "なごみ") {
        f.unlockMainDoor = true;
        markProgress?.("unlock_main_door");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("ドアのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function handleBasketWithSweetClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unpackSweet) {
    updateMessage("お菓子が置かれている。");
    return;
  }

  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.basket1}" alt="お菓子入りバスケット" style="width:400px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;"></p>
    </div>
  `;

  showModal("お菓子が置かれている", content, [
    {
      text: "開封する",
      action: () => {
        f.unpackSweet = true;
        renderCanvasRoom?.();
        window._nextModal = {
          title: "お菓子を開封した",
          content: `
            <div style="text-align:center;">
              <div class="modal-anim">
                <img src="${IMAGES.modals.basket1}" alt="開封前のバスケット">
                <img src="${IMAGES.modals.basket2}" alt="開封後のバスケット">
              </div>
            </div>
          `,
          buttons: [{ text: "閉じる", action: "close" }],
        };
        closeModal();
        updateMessage("お菓子を開封した。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);
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
      title: "🐟 DINNER END",
      label: "DINNER END",
      desc: "脱出してお風呂、ご飯を楽しみました",
    },

    end: {
      title: "🛁 NORMAL END ",
      label: "NORMAL",
      desc: "閉ざされた部屋から無事に脱出しました",
    },
    restaurant: {
      title: "🍽️ ALONE DINNER END ",
      label: "ALONE DINNER END",
      desc: "閉ざされた部屋から無事に脱出しました。誰かを待たせていなかった…？",
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
    case "restaurant":
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdwW2uIjVlS3JERbhPyb9zSE4bUXMoI8m-eQjTiLJ_BO_U3Wg/viewform";
  const endingLabel =
    {
      trueEnd: "ディナーエンド",
      end: "ノーマルエンド",
      restaurant: "一人でディナーエンド",
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

function showMainTvLeftDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainTvLeftDrawer) {
    acquireItemOnce("foundMainTvLeftDrawerBattery", "battery", "テレビ台の左の引き出しに電池がある", IMAGES.items.battery, "電池を手に入れた");
    return;
  }

  const digitStyle = [
    "width:min(12.5vw, 54px)",
    "height:min(12.5vw, 54px)",
    "min-width:30px",
    "min-height:30px",
    "border:2px solid #555",
    "border-radius:4px",
    "background:#fff",
    "color:#111",
    "font-size:clamp(18px, 6vw, 30px)",
    "font-weight:700",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(0,0,0,0.08)",
  ].join(";");
  const arrowStyle = [
    "width:min(12.5vw, 54px)",
    "height:24px",
    "min-width:30px",
    "border:1px solid #777",
    "border-radius:4px",
    "background:#f4f4f4",
    "color:#111",
    "font-size:15px",
    "font-weight:800",
    "line-height:1",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "cursor:pointer",
    "padding:0",
  ].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:2px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3, 4, 5]
          .map(
            (idx) => `
              <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                <button id="mainTvLeftDrawerUp${idx}" type="button" aria-label="${idx + 1}桁目を増やす" style="${arrowStyle}">▲</button>
                <button id="mainTvLeftDrawerDigit${idx}" type="button" aria-label="${idx + 1}桁目" style="${digitStyle}">0</button>
                <button id="mainTvLeftDrawerDown${idx}" type="button" aria-label="${idx + 1}桁目を減らす" style="${arrowStyle}">▼</button>
              </div>
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
      return Number.isInteger(value) && value >= 0 && value < 10 ? value : 0;
    });
    const digitBtns = [0, 1, 2, 3, 4, 5].map((idx) => document.getElementById(`mainTvLeftDrawerDigit${idx}`));
    const upBtns = [0, 1, 2, 3, 4, 5].map((idx) => document.getElementById(`mainTvLeftDrawerUp${idx}`));
    const downBtns = [0, 1, 2, 3, 4, 5].map((idx) => document.getElementById(`mainTvLeftDrawerDown${idx}`));
    const okBtn = document.getElementById("mainTvLeftDrawerOk");
    const hintEl = document.getElementById("mainTvLeftDrawerHint");
    if (digitBtns.some((btn) => !btn) || upBtns.some((btn) => !btn) || downBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const repaint = () => {
      digitBtns.forEach((btn, idx) => {
        btn.textContent = String(state[idx]);
      });
      hintEl.textContent = "";
    };

    const changeDigit = (idx, delta) => {
      state[idx] = (state[idx] + delta + 10) % 10;
      f.mainTvLeftDrawerDigits = state.slice();
      playSE?.("se-pi");
      repaint();
    };

    digitBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => changeDigit(idx, 1));
    });
    upBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => changeDigit(idx, 1));
    });
    downBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => changeDigit(idx, -1));
    });

    okBtn.addEventListener("click", () => {
      f.mainTvLeftDrawerDigits = state.slice();
      const answer = state.join("");
      if (answer === "262626") {
        f.unlockMainTvLeftDrawer = true;
        markProgress?.("unlock_main_tv_left_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("テレビ台の左の引き出しのロックが外れた。");
        return;
      }

      playSE?.("se-error");
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
              <button id="mainTvRightDrawerLetter${idx}" type="button" aria-label="${idx + 1}文字目" style="${squareStyle}">A</button>
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
    cushion: "小さな座布団",
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
