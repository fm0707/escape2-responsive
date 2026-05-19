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
const BASE_37 = USE_LOCAL_ASSETS ? "images/37" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/37";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I37 = (file) => `${BASE_37}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    entrance: [I37("entrance.webp")],
    courtyard: [I37("courtyard.webp")],
    insideTeoshi: [I37("inside_teoshi.webp")],
    kitchen: [I37("kitchen.webp")],
    barrel: [I37("barrel.webp")],
    studyRoom: [I37("study_room.webp")],
    kingRoom: [I37("king_room.webp")],
    jailCorridor: [I37("jail_corridor.webp")],
    jail: [I37("jail.webp")],
    backEntrance: [I37("back_entrance.webp"), I37("back_entrance2.webp")],

    leftSecondFloor: [I37("left_second_floor.webp")],
    guardRoom: [I37("guard_room.webp"), I37("guard_room2.webp")],
    armory: [I37("armory.webp")],
    book1: { jp: I37("book_1.webp"), en: I37("book_1_en.webp") },
    book2: { jp: I37("book_2.webp"), en: I37("book_2_en.webp") },
    book3: { jp: I37("book_3.webp"), en: I37("book_3_en.webp") },
    book4: { jp: I37("book_4.webp"), en: I37("book_4_en.webp") },

    end: [I37("end.webp"), I37("end2.webp")],
    trueEndBefore: [I37("true_end_before.webp")],
    trueEnd: [I37("true_end.webp")],
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

    daemonBear: I37("bear_daemon.webp"),
    archer: I37("archer.webp"),
    money: I37("money.webp"),
    waterT: I37("water_t.webp"),
    afterDoorBroken: I37("after_door_broken.webp"),
    teko: I37("teko.webp"),
    message: I37("message.webp"),
    messageFortune: I37("message_fortune.webp"),
    fireKitchen: I37("fire_kitchen.webp"),
    wizard: I37("wizard.webp"),
    wizardSmile: I37("wizard_smile.webp"),
    glassBroken: I37("glass_broken.webp"),
    glass: I37("glass.webp"),
    glassWithWine: I37("glass_with_wine.webp"),
    glassWithWater: I37("glass_with_water.webp"),
    boxClosed: I37("box_closed.webp"),
    boxOpened: I37("box_opened.webp"),
    jailHole: I37("jail_hole.webp"),
    bearEating: I37("bear_eating.webp"),
    bearBack: I37("bear_back.webp"),
    ghost: I37("ghost.webp"),
    cleanDish: I37("clean_dish.webp"),
    soupDish: I37("soup_dish.webp"),
    lock: I37("lock.webp"),
  },
  modals: {
    guardMaster1: I37("guard_master_1.webp"),
    guardMaster3: I37("guard_master_3.webp"),
    guardMasterDrinkWine: I37("modal_guard_master_drink_wine.webp"),
    guardMasterDrinkWater: I37("modal_guard_master_drink_water.webp"),
    guardMasterPaper: I37("modal_guard_master_paper.webp"),
    ministerZoom: I37("modal_minister_zoom.webp"),
    ministerZoomEn: I37("modal_minister_zoom_en.webp"),
    kingZoom: I37("modal_king_zoom.webp"),
    kingConsent: I37("modal_king_consent.webp"),
    ministerShocked: I37("modal_minister_shocked.webp"),
    ministerAngry: I37("modal_minister_angry.webp"),
    inJail: I37("modal_in_jail.webp"),
    soldierMoney: I37("modal_soldier_money.webp"),
    suiban: I37("modal_suiban.webp"),
    suiban2: I37("modal_suiban2.webp"),
    ehon: I37("modal_ehon.webp"),
    shirt: I37("modal_shirt.webp"),
    iconBook: I37("icon_book.webp"),
    iconMatch: I37("icon_match.webp"),
    iconCushion: I37("icon_cushion.webp"),
    iconSoup: I37("icon_soup.webp"),
    iconTee: I37("icon_tee.webp"),
    iconShoes: I37("icon_shoes.webp"),
    wizardConfuse: I37("wizard_confuse.webp"),
    wizardConsent: I37("wizard_consent.webp"),
    wizardFailed: I37("modal_wizard_failed.webp"),
    wizardGlass: I37("modal_wizard_glass.webp"),
    bookFire: I37("book_fire.webp"),
    bookDaemon: I37("book_daemon.webp"),
    timetable: I37("timetable.webp"),
    ghostHappy: I37("modal_ghost_happy.webp"),
    ghostSad: I37("modal_ghost_sad.webp"),
    tapestry: I37("tapestry.webp"),
    drinkWine: I37("modal_drink_wine.webp"),
    drinkWater: I37("modal_drink_water.webp"),
    fireMagicFailed: I37("modal_fire_magic_failed.webp"),
    bearPower: I37("modal_bear_power.webp"),
    bearSpell: I37("modal_bear_spell.webp"),
    bearSoup: I37("modal_bear_soup.webp"),
    bearHappy: I37("modal_bear_happy.webp"),
    bearDisappointed: I37("modal_bear_disappointed.webp"),
    badendBear: I37("badend_bear.webp"),
    badendBear2: I37("badend_bear2.webp"),
    badendDefeat: I37("badend_defeat.webp"),
    badendDrunk: I37("badend_drunk.webp"),
    washDish: I37("modal_wash_dish.webp"),
    soup: I37("modal_soup.webp"),
    end: I37("end.mp4"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState37";
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
    currentRoom: "entrance",
    openRooms: ["entrance"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        unlockArmoryTreasureChest: false,
        foundArmoryTreasureChestMoney: false,
        unlockLeftSecondFloorLeftEntrance: false,
        unlockLeftSecondFloorDoor: false,
        unlockLeftSecondFloorButtonPushed: false,
        unlockMailbox: false,
        unlockKitchenBox: false,
        guardMasterDrinkItem: null,
        glassWithWineDrinkCount: 0,
        foundMailboxMessage: false,
        foundKitchenBoxCleanDish: false,
        daemonBearArrived: false,
        daemonBearSoupDeniedCount: 0,
        daemonBearBackTurned: false,
        daemonBearFinishedPudding: false,
        foundTeko: false,
        foundKey: false,
        foundGlass: false,

        talkTo: { bear: 0, wizard: 0 },
      },
    },
    guardRoom: {
      flags: { backgroundState: 0 },
    },
    backEntrance: {
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
  guardRoom: {
    name: "兵士の詰所",
    description: "",
    clickableAreas: [
      {
        x: 57.6,
        y: 38.4,
        width: 14.0,
        height: 22.1,
        onClick: clickWrap(function () {
          showObj(null, "「傭兵の扱いは難しいな」", IMAGES.modals.guardMaster1, "兵士長は困っている");
        }),
        description: "兵士長1",
        zIndex: 5,
        usable: () => gameState.guardRoom.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 71.5,
        y: 61.4,
        width: 16.8,
        height: 14.9,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "money") {
            clearUsingItem(true);
            removeItem("money");
            showGuardRoomSoldierMoneyEvent();
            return;
          }

          updateMessage("傭兵「兵士長の命令？金がないとなあ…」");
        }),
        description: "右の赤マント傭兵",
        zIndex: 5,
        usable: () => gameState.guardRoom.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 34.7,
        y: 45.9,
        width: 18.5,
        height: 20.8,
        onClick: clickWrap(function () {
          updateMessage("傭兵「…」");
        }),
        description: "左の緑マント傭兵",
        zIndex: 5,
        usable: () => gameState.guardRoom.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 14.5,
        y: 65.6,
        width: 15.2,
        height: 25.9,
        onClick: clickWrap(function () {
          updateMessage("傭兵「傭兵に限らず、足は大事だからな。いざというときはさっさと逃げないと」");
        }),
        description: "左下茶色マント傭兵",
        zIndex: 5,
        usable: () => gameState.guardRoom.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 14.2,
        y: 47.5,
        width: 12.5,
        height: 33.0,
        onClick: clickWrap(function () {
          updateMessage("茶色マントの傭兵が並んでいる");
        }),
        description: "左端茶色マント傭兵",
        zIndex: 5,
        usable: () => gameState.guardRoom.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 33.2,
        y: 47.8,
        width: 17.0,
        height: 34.5,
        onClick: clickWrap(function () {
          updateMessage("緑色マントの傭兵が並んでいる");
        }),
        description: "緑マントの傭兵",
        zIndex: 5,
        usable: () => gameState.guardRoom.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 54.4,
        y: 47.8,
        width: 18.1,
        height: 35.4,
        onClick: clickWrap(function () {
          updateMessage("赤色マントの傭兵が並んでいる");
        }),
        description: "赤いマントの傭兵",
        zIndex: 5,
        usable: () => gameState.guardRoom.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.8,
        y: 48.0,
        width: 17.2,
        height: 36.1,
        onClick: clickWrap(function () {
          updateMessage("青色マントの傭兵が並んでいる");
        }),
        description: "青いマントの傭兵",
        zIndex: 5,
        usable: () => gameState.guardRoom.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 67.1,
        y: 36.7,
        width: 12.8,
        height: 13.9,
        onClick: clickWrap(function () {
          handleGuardMasterAfterLineupClick();
        }),
        description: "兵士長整列後",
        zIndex: 6,
        usable: () => gameState.guardRoom.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.7,
        y: 35.6,
        width: 8.0,
        height: 16.3,
        onClick: clickWrap(function () {
          changeRoom("armory");
        }),
        description: "兵士詰め所出入口、武器庫へ",
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
            changeRoom("courtyard");
          },
          { allowAtNight: true },
        ),
        description: "兵士詰め所戻る、中庭へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  courtyard: {
    name: "中庭",
    description: "",
    clickableAreas: [
      {
        x: 78.5,
        y: 74.5,
        width: 5.7,
        height: 18.2,
        onClick: clickWrap(function () {
          changeRoom("guardRoom");
        }),
        description: "手前右通路、兵士詰め所へ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 15.0,
        y: 73.3,
        width: 8.6,
        height: 19.2,
        onClick: clickWrap(function () {
          changeRoom("jailCorridor");
        }),
        description: "手前左通路、牢へ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.2,
        y: 43.8,
        width: 3.9,
        height: 8.2,
        onClick: clickWrap(function () {
          changeRoom("kitchen");
        }),
        description: "右奥扉、厨房へ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 23.0,
        y: 26.3,
        width: 12.4,
        height: 10.3,
        onClick: clickWrap(function () {
          changeRoom("leftSecondFloor");
        }),
        description: "左上扉付近",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 45.2,
        y: 38.1,
        width: 8.7,
        height: 8.5,
        onClick: clickWrap(function () {
          changeRoom("kingRoom");
        }),
        description: "正面奥",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 6.1,
        y: 49.3,
        width: 15.8,
        height: 8.0,
        onClick: clickWrap(function () {
          showObj(null, "赤いシャツ、白いシャツ、青いズボンが干されている", IMAGES.modals.shirt, "洗濯物が干されている");
        }),
        description: "左洗濯物",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 60.5,
        y: 52.5,
        width: 14.9,
        height: 8.7,
        onClick: clickWrap(function () {
          changeRoom("insideTeoshi");
        }),
        description: "焚火周辺",
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
            changeRoom("entrance");
          },
          { allowAtNight: true },
        ),
        description: "中庭戻る、ドアの前へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  entrance: {
    name: "出入口",
    description: "",
    clickableAreas: [
      {
        x: 66.6,
        y: 38.5,
        width: 9.7,
        height: 10.7,
        onClick: clickWrap(function () {
          showEntranceNoticeModal();
        }),
        description: "貼り紙",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 17.9,
        y: 58.2,
        width: 13.0,
        height: 31.9,
        onClick: clickWrap(function () {
          updateMessage("...？よく見ると立ったまま眠っている");
        }),
        description: "兵士",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 40.4,
        y: 28.0,
        width: 42.2,
        height: 60.5,
        onClick: clickWrap(function () {
          if (gameState.selectedItem == "key") {
            updateMessage("鍵があわない");
            return;
          }
          updateMessage("扉は固く閉ざされている");
        }),
        description: "扉",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 82.5,
        y: 55.0,
        width: 17.3,
        height: 23.0,
        onClick: clickWrap(function () {
          showMailboxPasscode();
        }),
        description: "郵便ポスト",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 86.2,
        y: 68.8,
        width: 5.4,
        height: 4.8,
        onClick: clickWrap(function () {
          showMailboxPasscode();
        }),
        description: "郵便ポスト取り出し口",
        zIndex: 6,
        usable: () => gameState.main.flags.unlockMailbox && !gameState.main.flags.foundMailboxMessage,
        item: {
          img: "message",
          visible: () => gameState.main.flags.unlockMailbox && !gameState.main.flags.foundMailboxMessage,
          rotateDeg: -4,
        },
      },
      {
        x: 64.5,
        y: 81.3,
        width: 17.9,
        height: 17.9,
        onClick: clickWrap(function () {
          if (gameState.main.flags.daemonBearBackTurned) {
            updateMessage("ボクは砦を守るんだから…こんなことで怒らないぞ…ブツブツ");
            return;
          }
          if (gameState.main.flags.daemonBearEating) {
            showObj(null, "スープに集中している。<br>デーモンの業務がおろそかになっていないだろうか…", IMAGES.items.bearEating, "デーモンクマはスープに集中している。デーモンの業務がおろそかになっていないだろうか…");
            return;
          }
          if (gameState.selectedItem === "soupDish") {
            showDaemonBearSoupModal();
            return;
          }
          if (gameState.selectedItem === "teko") {
            updateMessage("「まさか、それで叩いたりしないよね？」");
            return;
          }
          if (gameState.selectedItem === "glassWithWine") {
            updateMessage("「ワインを飲むと、眠くなっちゃうから…」");
            return;
          }
          showDaemonBearTalkModal();
        }),
        description: "デーモンクマ",
        zIndex: 5,
        usable: () => gameState.main.flags.daemonBearArrived,
        item: {
          img: () => (gameState.main.flags.daemonBearEating ? "bearEating" : gameState.main.flags.daemonBearBackTurned ? "bearBack" : "daemonBear"),
          visible: () => gameState.main.flags.daemonBearArrived || !!gameState.fx?.daemonBearFloatIn,
        },
      },
      {
        x: 1.2,
        y: 42.9,
        width: 15.3,
        height: 38.9,
        onClick: clickWrap(function () {
          changeRoom("courtyard");
        }),
        description: "左通路、中庭へ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
    ],
  },
  leftSecondFloor: {
    name: "左上扉前",
    description: "",
    clickableAreas: [
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "ドア崩壊後",
        zIndex: 5,
        usable: () => false,
        item: { img: "afterDoorBroken", visible: () => gameState.main.flags.unlockLeftSecondFloorDoor },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "水",
        zIndex: 5,
        usable: () => false,
        item: { img: "waterT", visible: () => gameState.main.flags.unlockLeftSecondFloorButtonPushed },
      },
      {
        x: 73.2,
        y: 57.5,
        width: 7.0,
        height: 6.6,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockLeftSecondFloorButtonPushed) {
            updateMessage("ボタンはすでに押されている");
            return;
          }

          showModal("ボタンがある", `<p style="margin:0; line-height:1.8;"></p>`, [
            {
              text: "押す",
              action: () => {
                f.unlockLeftSecondFloorButtonPushed = true;
                playSE?.("se-switch");
                playSE?.("se-water");
                closeModal();
                renderCanvasRoom?.();
                updateMessage("ボタンを押した。");
              },
            },
            { text: "閉じる", action: "close" },
          ]);
          updateMessage("ボタンがある。");
        }),
        description: "ドアのボタン",
        zIndex: 5,
        usable: () => gameState.main.flags.unlockLeftSecondFloorDoor,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 84.2,
        y: 66.2,
        width: 12.9,
        height: 18.2,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          const img = f.unlockLeftSecondFloorButtonPushed ? IMAGES.modals.suiban2 : IMAGES.modals.suiban;
          showObj(null, f.unlockLeftSecondFloorButtonPushed ? "水が文字のような形になっている" : "水盤がある", img, "水盤がある");
        }),
        description: "水盤",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 34.7,
        y: 44.0,
        width: 13.0,
        height: 30.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockLeftSecondFloorLeftEntrance) {
            showLeftSecondFloorLeftEntrancePuzzle();
            return;
          }
          changeRoom("studyRoom");
        }),
        description: "左入り口",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 67.4,
        y: 51.3,
        width: 16.2,
        height: 30.2,
        onClick: clickWrap(function () {
          showLeftSecondFloorDoorPuzzle();
        }),
        description: "右扉",
        zIndex: 5,
        usable: () => !gameState.main.flags.unlockLeftSecondFloorDoor,
        item: { img: "IMAGE_KEY", visible: () => true },
      },


      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("courtyard");
          },
          { allowAtNight: true },
        ),
        description: "左上扉前戻る、中庭へ",
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
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}, { allowAtNight: true }),
        description: "炎",
        zIndex: 5,
        usable: () => false,
        item: { img: "fireKitchen", visible: () => gameState.main.flags.succeedFireSpell },
      },
      {
        x: 4.2,
        y: 48.8,
        width: 16.1,
        height: 24.1,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "cleanDish") {
            removeItem("cleanDish");
            addItem("soupDish");
            playSE("se-tea");
            showModal(
              "スープを注いだ",
              `
                <div style="text-align:center;">
                  <img src="${IMAGES.items.soupDish}" alt="スープ入りの容器" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
                </div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            updateMessage("スープを注いだ");
            return;
          }
          if (gameState.main.flags.succeedFireSpell) {
            showObj(null, "美味しそうなスープが火にかけられている", IMAGES.modals.soup, "美味しそうなスープが火にかけられている");
            return;
          }
          updateMessage("中身はスープのようだ");
        }),
        description: "鍋",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 26.0,
        y: 62.8,
        width: 14.0,
        height: 20.7,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "glassBroken" && gameState.main.flags.succeedFireSpell) {
            clearUsingItem(true);
            removeItem("glassBroken");
            showWizardRepairGlassEvent();
            return;
          }

          if (gameState.main.flags.repairedGlassByWizard) {
            talkToHintCharacter("main", "wizard2");
            return;
          }

          if (gameState.main.flags.succeedFireSpell) {
            talkToHintCharacter("main", "wizard");
            return;
          }
          showWizardFireSpellIntro();
        }),
        description: "魔法使い",
        zIndex: 5,
        usable: () => true,
        item: { img: () => (gameState.main.flags.succeedFireSpell ? "wizardSmile" : "wizard"), visible: () => true },
      },
      {
        x: 25.7,
        y: 87.8,
        width: 12.6,
        height: 11.1,
        onClick: clickWrap(function () {
          handleLockedKitchenBox();
        }),
        description: "鍵のかかった小箱",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 33.8,
        y: 94.1,
        width: 1.6,
        height: 1.9,
        onClick: clickWrap(function () {}),
        description: "鍵のかかった小箱のロック",
        zIndex: 5,
        usable: () => false,
        item: { img: "lock", visible: () => !gameState.main.flags.unlockKitchenBox },
      },
      {
        x: 58.8,
        y: 57.3,
        width: 10.4,
        height: 21.3,
        onClick: clickWrap(function () {
          updateMessage("「ふう、重い」");
        }),
        description: "荷物を運ぶ男性",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 87.0,
        y: 53.6,
        width: 12.6,
        height: 19.4,
        onClick: clickWrap(function () {
          updateMessage("「…」女性はひたすら野菜を切っている");
        }),
        description: "女性",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 49.8,
        y: 40.6,
        width: 21.1,
        height: 18.8,
        onClick: clickWrap(function () {
          changeRoom("barrel");
        }),
        description: "飲料樽",
        zIndex: 6,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 2.1,
        y: 2.3,
        width: 38.4,
        height: 25.7,
        onClick: clickWrap(function () {
          updateMessage("食材がぶら下げられている");
        }),
        description: "吊り下げられた保存食",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 76.2,
        y: 71.6,
        width: 7.8,
        height: 9.6,
        onClick: clickWrap(function () {
          updateMessage("ピッチャーがある");
        }),
        description: "ピッチャー",
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
            changeRoom("courtyard");
          },
          { allowAtNight: true },
        ),
        description: "厨房戻る、中庭へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  barrel: {
    name: "樽の前",
    description: "",
    clickableAreas: [
      {
        x: 23.4,
        y: 41.8,
        width: 19.3,
        height: 16.7,
        onClick: clickWrap(function () {
          handleWineBarrelClick();
        }),
        description: "ワインの樽",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 31.3,
        y: 58.6,
        width: 5.1,
        height: 5.9,
        onClick: clickWrap(function () {}),
        description: "ワインのコップ位置",
        zIndex: 5,
        usable: () => false,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 57.1,
        y: 41.4,
        width: 18.7,
        height: 16.0,
        onClick: clickWrap(function () {
          handleWaterBarrelClick();
        }),
        description: "水の樽",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 64.1,
        y: 58.5,
        width: 4.9,
        height: 6.1,
        onClick: clickWrap(function () {}),
        description: "水のコップ位置",
        zIndex: 5,
        usable: () => false,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("kitchen");
          },
          { allowAtNight: true },
        ),
        description: "樽戻る、厨房へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  studyRoom: {
    name: "学習室",
    description: "",
    clickableAreas: [
      {
        x: 26.0,
        y: 31.3,
        width: 24.4,
        height: 7.4,
        onClick: clickWrap(function () {
          showModal("「とりでの、ちいさな力持ち」という絵本がある。", `<img src="${IMAGES.modals.ehon}" alt="絵本" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;"><p style="margin:0; line-height:1.8;">読みますか？</p>`, [
            {
              text: "読む",
              action: () => {
                const f = gameState.main.flags || (gameState.main.flags = {});
                f.bookReturnRoom = gameState.currentRoom;
                closeModal();
                changeRoom("book1");
              },
            },
            { text: "閉じる", action: "close" },
          ]);
          updateMessage("「とりでの、ちいさな力持ち」という絵本がある。");
        }),
        description: "本棚上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 26.2,
        y: 40.3,
        width: 24.4,
        height: 6.9,
        onClick: clickWrap(function () {
          showObj(null, "『初級炎魔法』", IMAGES.modals.bookFire, "初級炎魔法の巻物がある");
        }),
        description: "本棚上から2段目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 26.1,
        y: 49.2,
        width: 24.3,
        height: 7.1,
        onClick: clickWrap(function () {
          showTimeSymbolPaperModal();
        }),
        description: "本棚下から2段目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 26.0,
        y: 58.0,
        width: 10.2,
        height: 6.6,
        onClick: clickWrap(function () {
          showObj(null, "『実践黒魔法』", IMAGES.modals.bookDaemon, "『実践黒魔法』という本がある");
        }),
        description: "本棚最下段左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 44.1,
        y: 58.4,
        width: 6.7,
        height: 6.6,
        onClick: clickWrap(function () {
          showOldBrookRecordModal();
        }),
        description: "本棚最下段右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 60.2,
        y: 25.7,
        width: 15.1,
        height: 14.6,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.timetable, "時刻を示す図のようだ");
        }),
        description: "タペストリー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 59.8,
        y: 49.3,
        width: 10.7,
        height: 5.0,
        onClick: clickWrap(function () {
          handleStudyRoomOpenedBox();
        }),
        description: "箱開いたあと",
        zIndex: 5,
        usable: () => gameState.main.flags.openBox,
        item: { img: "boxOpened", visible: () => true },
      },
      {
        x: 59.8,
        y: 47.3,
        width: 10.9,
        height: 7.1,
        onClick: clickWrap(function () {
          showStudyRoomBoxPuzzle();
        }),
        description: "箱閉まる",
        zIndex: 5,
        usable: () => !gameState.main.flags.openBox,
        item: { img: "boxClosed", visible: () => !gameState.main.flags.openBox },
      },
      {
        x: 0.2,
        y: 30.6,
        width: 11.5,
        height: 54.7,
        onClick: clickWrap(function () {
          changeRoom("leftSecondFloor");
        }),
        description: "扉",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
    ],
  },
  armory: {
    name: "武器庫",
    description: "",
    clickableAreas: [
      {
        x: 30.4,
        y: 43.0,
        width: 20.4,
        height: 44.2,
        onClick: clickWrap(function () {
          if (gameState.selectedItem == "money") {
            updateMessage("傭兵「すごいお金だね。リーダーが喜びそうだ」");
            return;
          }
          updateMessage("傭兵「戦いは気が進まないよ…」");
        }),
        description: "弓兵",
        zIndex: 5,
        usable: () => gameState.guardRoom.flags.backgroundState == 0,
        item: { img: "archer", visible: () => gameState.guardRoom.flags.backgroundState == 0 },
      },
      {
        x: 39.7,
        y: 64.6,
        width: 13.0,
        height: 14.3,
        onClick: clickWrap(function () {
          acquireItemOnce("foundTeko", "teko", "金てこがある", IMAGES.items.teko, "金てこを手に入れた");
        }),
        description: "金てこ",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundTeko && gameState.guardRoom.flags.backgroundState == 1,
        item: { img: "teko", visible: () => !gameState.main.flags.foundTeko && gameState.guardRoom.flags.backgroundState == 1 },
      },
      {
        x: 17.6,
        y: 52.8,
        width: 39.5,
        height: 18.2,
        onClick: clickWrap(function () {
          updateMessage("盾が並んでいる");
        }),
        description: "盾全体",
        zIndex: 4,
        usable: () => gameState.guardRoom.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 32.2,
        y: 55.2,
        width: 12.9,
        height: 15.6,
        onClick: clickWrap(function () {
          updateMessage("緑色の盾に、文字が書かれている");
        }),
        description: "緑の盾",
        zIndex: 5,
        usable: () => gameState.guardRoom.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 59.0,
        y: 61.9,
        width: 22.1,
        height: 19.0,
        onClick: clickWrap(function () {
          showArmoryTreasureChestPuzzle();
        }),
        description: "宝箱",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 8.7,
        y: 88.7,
        width: 6.3,
        height: 8.0,
        onClick: clickWrap(function () {
          acquireItemOnce("foundGlass", "glassBroken", "割れたコップがある", IMAGES.items.glassBroken, "割れたコップを手に入れた");
        }),
        description: "コップ",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundGlass,
        item: { img: "glassBroken", visible: () => !gameState.main.flags.foundGlass },
      },
      {
        x: 82.5,
        y: 42.2,
        width: 15.2,
        height: 28.9,
        onClick: clickWrap(function () {
          updateMessage("立派な鎧だ");
        }),
        description: "鎧",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 6.7,
        y: 12.4,
        width: 52.7,
        height: 34.8,
        onClick: clickWrap(function () {
          updateMessage("武器が保管されている");
        }),
        description: "武器",
        zIndex: 4,
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
            changeRoom("guardRoom");
          },
          { allowAtNight: true },
        ),
        description: "武器庫戻る、兵士詰め所へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  jailCorridor: {
    name: "牢",
    description: "",
    clickableAreas: [
      {
        x: 11.3,
        y: 16.3,
        width: 27.2,
        height: 63.7,
        onClick: clickWrap(function () {
          changeRoom("jail");
        }),
        description: "牢内部へ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 76.2,
        y: 32.6,
        width: 20.5,
        height: 29.2,
        onClick: clickWrap(function () {
          updateMessage("人の気配はない");
        }),
        description: "通路奥",
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
            changeRoom("courtyard");
          },
          { allowAtNight: true },
        ),
        description: "牢の廊下戻る、中庭へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  jail: {
    name: "牢内部",
    description: "",
    clickableAreas: [
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "穴",
        zIndex: 5,
        usable: () => false,
        item: { img: "jailHole", visible: () => gameState.main.flags.removeStone },
      },
      {
        x: 23.6,
        y: 91.6,
        width: 33.2,
        height: 8.3,
        onClick: clickWrap(function () {
          handleJailFloorStone();
        }),
        description: "床石",
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
            changeRoom("jailCorridor");
          },
          { allowAtNight: true },
        ),
        description: "牢内部右、牢廊下へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  backEntrance: {
    name: "裏口",
    description: "",
    clickableAreas: [
      {
        x: 65.3,
        y: 48.5,
        width: 13.0,
        height: 15.7,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "soupDish") {
            showModal(
              "「…」",
              `
                <div style="text-align:center;">
                  <img src="${IMAGES.modals.ghostSad}" alt="悲しむおばけ" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
                  <p style="margin:0; line-height:1.8;"></p>
                </div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            updateMessage("…");
            return;
          }
          const f = gameState.main.flags || (gameState.main.flags = {});
          f.talkedBackEntranceGhost = true;
          updateMessage("謎のおばけ「あの扉さえ開けば、外に出られたのに」");
        }),
        description: "おばけ",
        zIndex: 5,
        usable: () => !gameState.main.flags.daemonBearEating && !gameState.main.flags.daemonBearFinishedPudding,
        item: { img: "ghost", visible: () => !gameState.main.flags.daemonBearEating && !gameState.main.flags.daemonBearFinishedPudding },
      },
      {
        x: 77.1,
        y: 37.8,
        width: 14.5,
        height: 21.1,
        onClick: clickWrap(function () {
          if (gameState.main.flags.daemonBearEating) {
            travelToTrueEndBefore();
            return;
          }
          updateMessage("門は封印されているようだ");
        }),
        description: "門",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 22.5,
        y: 39.6,
        width: 10.2,
        height: 27.0,
        onClick: clickWrap(function () {
          changeRoom("jail");
        }),
        description: "左ドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
    ],
  },
  insideTeoshi: {
    name: "手押し車内部",
    description: "",
    clickableAreas: [
      {
        x: 44.0,
        y: 49.6,
        width: 28.3,
        height: 29.6,
        onClick: clickWrap(function () {
          updateMessage("文字が書かれた茶色いタイルがある");
        }),
        description: "タイル",
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
            changeRoom("courtyard");
          },
          { allowAtNight: true },
        ),
        description: "手押し車戻る、中庭へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  kingRoom: {
    name: "王様の部屋",
    description: "",
    clickableAreas: [
      {
        x: 65.8,
        y: 32.2,
        width: 21.1,
        height: 30.6,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "money") {
            clearUsingItem(true);
            showMinisterMoneyBadEnd();
            return;
          }

          showObj(null, "大臣<br>「王よ、どっしりと構えていれば良いのです」", IMAGES.modals.ministerZoom, "大臣の心の声が聞こえた気がした", IMAGES.modals.ministerZoomEn);
        }),
        description: "大臣",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 28.9,
        y: 42.6,
        width: 22.7,
        height: 21.1,
        onClick: clickWrap(function () {
          showKingMessageModal();
        }),
        description: "王様",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 88.7,
        y: 17.3,
        width: 11.3,
        height: 34.1,
        onClick: clickWrap(function () {
          updateMessage("兵士は微動だにしない");
        }),
        description: "兵士",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0.2,
        y: 6.3,
        width: 33.2,
        height: 30.5,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.tapestry, "タペストリーが掛けられている");
        }),
        description: "タペストリー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 44.3,
        y: 68.9,
        width: 30.2,
        height: 16.5,
        onClick: clickWrap(function () {
          updateMessage("作戦は決まっているように読み取れる");
        }),
        description: "机の上の作戦用紙",
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
            changeRoom("courtyard");
          },
          { allowAtNight: true },
        ),
        description: "王様の部屋戻る、中庭へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },

  book1: {
    name: "絵本1ページ目",
    description: "",
    clickableAreas: [
      {
        x: 93.6,
        y: 66.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("book2");
          },
          { allowAtNight: true },
        ),
        description: "1ページ目右、2ページ目へ",
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
            returnFromBook();
          },
          { allowAtNight: true },
        ),
        description: "絵本戻る",
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
  book2: {
    name: "絵本2ページ目",
    description: "",
    clickableAreas: [
      {
        x: 93.6,
        y: 66.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("book3");
          },
          { allowAtNight: true },
        ),
        description: "2ページ目右、3ページ目へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 0,
        y: 66.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("book1");
        }),
        description: "2ページ目目左、1ページ目へ",
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
            returnFromBook();
          },
          { allowAtNight: true },
        ),
        description: "絵本戻る",
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
  book3: {
    name: "絵本3ページ目",
    description: "",
    clickableAreas: [
      {
        x: 93.6,
        y: 66.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("book4");
          },
          { allowAtNight: true },
        ),
        description: "3ページ目右、4ページ目へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 0,
        y: 66.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("book2");
        }),
        description: "3ページ目目左、2ページ目へ",
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
            returnFromBook();
          },
          { allowAtNight: true },
        ),
        description: "絵本戻る",
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
  book4: {
    name: "絵本4ページ目",
    description: "",
    clickableAreas: [
      {
        x: 0,
        y: 66.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("book3");
        }),
        description: "4ページ目目左、3ページ目へ",
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
            returnFromBook();
          },
          { allowAtNight: true },
        ),
        description: "絵本戻る",
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
  end: {
    name: "出撃エンド",
    description: "出撃に乗じて脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 3.3,
        y: 78.9,
        width: 4.5,
        height: 6.9,
        onClick: clickWrap(function () {
          updateMessage("あなたは出撃の混乱に乗じて脱出できました。");
        }),
        description: "プレイヤー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 25.5,
        y: 60.9,
        width: 17.6,
        height: 24.1,
        onClick: clickWrap(function () {
          updateMessage("兵士長が先導している");
        }),
        description: "兵士長",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 21.6,
        y: 6.5,
        width: 19.0,
        height: 21.0,
        onClick: clickWrap(function () {
          updateMessage("デーモンクマが見守っている");
        }),
        description: "デーモンクマ",
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
  trueEndBefore: {
    name: "門の外",
    description: "遠くに集落が見える",
    clickableAreas: [
      {
        x: 49.0,
        y: 53.1,
        width: 4.3,
        height: 4.2,
        onClick: clickWrap(function () {
          updateMessage("あれは…？");
        }),
        description: "おばけ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 64.5,
        y: 36.6,
        width: 23.4,
        height: 8.2,
        onClick: clickWrap(function () {
          travelFromTrueEndBeforeToTrueEnd();
        }),
        description: "集落",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
    ],
  },

  trueEnd: {
    name: "脱獄エンド",
    description: "門を出て進むと、寂れた集落にたどり着きました。脱出おめでとうございます！",
    clickableAreas: [
      {
        x: 40.4,
        y: 50.3,
        width: 18.3,
        height: 25.4,
        onClick: clickWrap(function () {
          updateMessage("窓から中をのぞいている");
        }),
        description: "お化け",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
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
    bear: ["「あ、見つかっちゃった」", "「通信プロセスのお手伝いしてたんだ」"],
    wizard: ["「すぐ忘れちゃうんだよね」", "「あとで、兵士長さんのコップも直さないと…」"],
    wizard2: ["「コップ、ぴかぴかになったでしょ」", "「割れものは気をつけて持ってね」"],
  },
};

function getSleepingBearHint() {
  const f = gameState.main?.flags || {};

  if (!f.unlockShelfLeftCabinetMiddle) {
    return "「お水が、ぽたぽた…むにゃ」";
  }

  if (!f.isCurtainClosed && !f.unlockWindowRightVabinet) {
    return "「まどには…カーテン…むにゃ」";
  }

  if (!f.unlockWindowRightVabinet) {
    return "「たまには本が読みたいな…むにゃ」";
  }

  if (f.foundMirror && !f.putMirror) {
    return "「鏡は…ピカッ」";
  }

  if (f.checkGreenClock && !f.unlockLockerCenterTop) {
    return "「五色の時計が…授業が始まっちゃう…」";
  }

  return "「むにゃ…」クマ妖精は眠っている";
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

function travelToTrueEndWithLongBlackout() {
  const overlay = document.getElementById("roomEffectOverlay");
  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;
  playSE?.("se-ashioto");

  if (overlay) {
    overlay.style.background = "#000";
    overlay.style.opacity = 1;
  }

  setTimeout(() => {
    changeRoom("trueEnd");
    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = 0;
        overlay.style.background = "";
      }
      if (gameState.fx) gameState.fx.lockInput = false;
    }, 450);
  }, 1600);
}

function travelToTrueEndBefore() {
  playSE?.("se-ashioto");
  changeRoom("trueEndBefore");
}

function travelFromTrueEndBeforeToTrueEnd() {
  const overlay = document.getElementById("roomEffectOverlay");
  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;

  if (overlay) {
    overlay.style.background = "#000";
    overlay.style.opacity = 1;
  }

  setTimeout(() => {
    changeRoom("trueEnd");
    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = 0;
        overlay.style.background = "";
      }
      if (gameState.fx) gameState.fx.lockInput = false;
    }, 120);
  }, 450);
}

// ゲーム初期化
function initGame() {
  renderNavigation();
  changeRoom("entrance");
  updateMessage("気が付くと見知らぬ砦の扉の前に立っていた。");
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
    changeBGM("sounds/37/hometown_biregia.mp3");
  } else if (roomId === "trueEndBefore") {
    changeBGM("sounds/37/backyard_de_hitori.mp3");
  } else if (roomId === "end") {
    changeBGM("sounds/37/gunkan_march.mp3");
  } else {
    changeBGM("sounds/37/ikusa_no_zenya.mp3");
  }

  // nav
  if (roomId === "courtyard" || roomId === "kitchen" || roomId === "kingRoom" || roomId === "guardRoom" || roomId === "armory" || roomId === "studyRoom") {
    addNaviItem(roomId);
    renderNavigation();
  }
  if (roomId === "trueEnd" || roomId === "end" || roomId === "trueEndBefore") {
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

function drawEntranceShutterOpenFx(ctx, canvas, roomId) {
  if (roomId !== "entrance") return;

  const f = gameState.main.flags || {};
  const fx = gameState.fx?.entranceShutterOpen;
  if (!f.unlockEntranceShutter && (!fx || fx.roomId !== "entrance")) return;

  const rect = getAreaRectPx("entrance", "シャッター", canvas);
  if (!rect) return;

  const t = fx ? Math.max(0, Math.min(1, Number(fx.progress) || 0)) : 1;
  const eased = easeOutCubic(t);
  const slideY = rect.h * 1.06 * eased;
  const panelY = rect.y - slideY;
  const skyImg = loadedImages[IMAGES.items.sky];

  ctx.save();

  if (skyImg && skyImg.complete && skyImg.naturalWidth > 0) {
    ctx.drawImage(skyImg, rect.x, rect.y, rect.w, rect.h);
  } else {
    const sky = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
    sky.addColorStop(0, "#8fd3ff");
    sky.addColorStop(0.55, "#66c0ff");
    sky.addColorStop(1, "#dff6ff");
    ctx.fillStyle = sky;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  }

  if (panelY + rect.h > rect.y) {
    const shutter = ctx.createLinearGradient(rect.x, panelY, rect.x, panelY + rect.h);
    shutter.addColorStop(0, "#8f948f");
    shutter.addColorStop(0.5, "#727871");
    shutter.addColorStop(1, "#5d635d");
    ctx.fillStyle = shutter;
    ctx.fillRect(rect.x, panelY, rect.w, rect.h);

    ctx.strokeStyle = "rgba(70, 76, 70, 0.95)";
    ctx.lineWidth = Math.max(1, rect.h * 0.01);
    for (let i = 0; i < 11; i++) {
      const y = panelY + (rect.h / 11) * i;
      ctx.beginPath();
      ctx.moveTo(rect.x, y);
      ctx.lineTo(rect.x + rect.w, y);
      ctx.stroke();
    }

    ctx.fillStyle = "#6e746e";
    ctx.fillRect(rect.x, panelY + rect.h - Math.max(10, rect.h * 0.06), rect.w, Math.max(10, rect.h * 0.06));
  }

  ctx.restore();
}

function playNewKeyholderGlowFx(duration = 3200) {
  const fx = gameState.fx || (gameState.fx = {});
  fx.newKeyholderGlow = {
    roomId: "boothSustainable",
    until: Date.now() + duration,
  };

  const tick = () => {
    const currentFx = gameState.fx?.newKeyholderGlow;
    if (!currentFx) return;

    if (Date.now() >= currentFx.until) {
      delete gameState.fx.newKeyholderGlow;
      renderCanvasRoom?.();
      return;
    }

    renderCanvasRoom?.();
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function playCelebrationSparkleFx(duration = 3200) {
  const fx = gameState.fx || (gameState.fx = {});
  const roomId = gameState.currentRoom;
  const now = performance.now();
  const palette = ["#fff4a8", "#ffffff", "#ffd86b", "#d7fff1", "#ffe3f7", "#ffd1a6", "#c8f7ff"];
  fx.celebrationSparkle = {
    roomId,
    startedAt: now,
    duration,
    particles: Array.from({ length: 56 }, (_, i) => ({
      x: ((i + 0.5) / 56) * canvas.width + Math.sin(i * 12.7) * 22,
      y0: -20 - (i % 8) * 26,
      travel: canvas.height + 150 + (i % 7) * 30,
      size: 6 + (i % 5) * 1.9,
      color: palette[i % palette.length],
      life: 1050 + (i % 8) * 150,
      spawnAt: now - (i % 12) * 80,
      phase: (i % 10) / 10,
    })),
  };

  const tick = () => {
    const currentFx = gameState.fx?.celebrationSparkle;
    if (!currentFx) return;
    if (performance.now() >= currentFx.startedAt + currentFx.duration) {
      delete gameState.fx.celebrationSparkle;
      renderCanvasRoom?.();
      return;
    }
    renderCanvasRoom?.();
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function playDaemonBearFloatInFx(onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  fx.daemonBearFloatIn = {
    roomId: "entrance",
    progress: 0,
  };

  const duration = 1800;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.daemonBearFloatIn;
    if (!currentFx) {
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

    delete gameState.fx.daemonBearFloatIn;
    renderCanvasRoom?.();
    onDone?.();
  };

  requestAnimationFrame(tick);
}

function playMadoriRoomHighlightFx(areaDescription, color = "green", duration = 650) {
  const fx = gameState.fx || (gameState.fx = {});
  if (gameState.currentRoom !== "madoriDisplay") return;

  fx.madoriRoomHighlight = {
    roomId: "madoriDisplay",
    areaDescription,
    color,
    progress: 0,
  };

  renderCanvasRoom?.();

  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.madoriRoomHighlight;
    if (!currentFx) return;

    const t = Math.min(1, (now - start) / duration);
    currentFx.progress = t;
    renderCanvasRoom?.();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.madoriRoomHighlight;
    renderCanvasRoom?.();
  };

  requestAnimationFrame(tick);
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
  const gripStyle = fx.gripStyle === "roundTop" ? "roundTop" : "capsule";
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

  const gripH = Math.max(14, rect.h * 0.165);
  const gripW = Math.max(5, rect.w * 0.11);
  const gripInset = Math.max(rect.w * 0.1, panelW * 0.14);
  const gripX = hingeSide === "left" ? panelX + panelW - gripInset - gripW : panelX + gripInset;
  const gripY = gripStyle === "roundTop" ? rect.y + rect.h * 0.08 : rect.y + (rect.h - gripH) / 2 + rect.h * 0.03;
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
    ctx.fillStyle = gripColor;
    roundRect(ctx, gripX, gripY, gripW, gripH, gripR, true, false);

    ctx.fillStyle = "#58626b";
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

function getCurrentPlayDateTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  return `2026/04/08 ${hh}:${mi}`;
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

function handleWineBarrelClick() {
  if (gameState.selectedItem !== "glass") {
    updateMessage("ワインの樽だ。");
    return;
  }

  removeItem("glass");
  updateMessage("コップをワインの樽の下に置いた。");
  playWinePourFx(() => {
    addItem("glassWithWine");
    markProgress?.("got_glass_with_wine");
    updateMessage("コップにワインを注いだ。");
  });
}

function handleWaterBarrelClick() {
  if (gameState.selectedItem !== "glass") {
    updateMessage("水の樽だ。");
    return;
  }

  removeItem("glass");
  updateMessage("コップを水の樽の下に置いた。");
  playWaterPourFx(() => {
    addItem("glassWithWater");
    markProgress?.("got_glass_with_water");
    updateMessage("コップに水を注いだ。");
  });
}

function returnFromBook() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const returnRoom = f.bookReturnRoom;
  changeRoom(returnRoom && rooms[returnRoom] ? returnRoom : "studyRoom");
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
      title: "🏠 ESCAPE END",
      label: "ESCAPE END",
      desc: "見知らぬ村にたどりつきました",
    },

    end: {
      title: "⚔️ MARCHING END ",
      label: "MARCHING",
      desc: "出撃に乗じて脱出しました",
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc-SJGWVTVvSyZYsp9jO2JFN-iZWguDQDc9xyy0n1sHcrSuuA/viewform";
  const endingLabel =
    {
      trueEnd: "脱〇エンド",
      end: "出〇エンド",
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

function showMinisterMoneyBadEnd() {
  const content = `
    <div style="text-align:center;">
      <div class="modal-anim">
        <img src="${IMAGES.modals.ministerShocked}" alt="minister shocked">
        <img src="${IMAGES.modals.ministerAngry}" alt="minister angry">
      </div>
      <div style="margin-top:12px;"></div>
    </div>
  `;
  pauseBGM();
  playSE("se-soreha");
  showModal("「そ、それは…盗人め！こやつを捕らえよ！」", content, [{ text: "次へ", action: showMinisterJailBadEnd }]);
  updateMessage("そ、それは…盗人め！こやつを捕らえよ！");
}

function showMinisterJailBadEnd() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.inJail}" alt="in jail" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
    </div>
  `;
  playSE("se-shakin");
  showModal("【BAD END】投獄されました", content, [{ text: "最初から", action: "restart" }]);
  updateMessage("BAD END: 投獄されました");
}

function showDaemonBearTalkModal() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.items.daemonBear}" alt="デーモンベア" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;"></p>
    </div>
  `;
  const buttons = [
    { text: "あなたは誰？", action: showDaemonBearWhoModal },
    { text: "呪文を唱える", action: showDaemonBearSpellModal },
    { text: "閉じる", action: "close" },
  ];
  if (f.daemonBearFinishedPudding) {
    buttons.splice(1, 0, { text: "美味しかった？", action: showDaemonBearPuddingAftertasteModal });
  }
  showModal("デーモンベア「呼んだ？」", content, buttons);
}

function showDaemonBearWhoModal() {
  showModal(
    "デーモンベア",
    `
      <div style="text-align:center;">
        <img src="${IMAGES.modals.bearPower}" alt="デーモンベア" style="width:400px;max-width:70%;display:block;margin:0 auto 16px;">
        <p style="margin:0; line-height:1.8;">砦をささえる可愛いデーモンだよ</p>
      </div>
    `,
    [{ text: "閉じる", action: "close" }],
  );
  updateMessage("「砦を支える可愛いデーモンだよ」");
}

function showDaemonBearPuddingAftertasteModal() {
  showModal(
    "「うん！」",
    `
      <div style="text-align:center;">
        <img src="${IMAGES.modals.bearHappy}" alt="喜ぶデーモンベア" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
        <p style="margin:0; line-height:1.8;">美味しかったよ</p>
      </div>
    `,
    [{ text: "閉じる", action: "close" }],
  );
  updateMessage("美味しかったようだ");
}

function showDaemonBearSoupModal() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.bearSoup}" alt="スープを見るデーモンベア" style="width:400px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;"></p>
    </div>
  `;
  showModal("「わあ。食べていいの？」", content, [
    {
      text: "いいよ",
      action: () => {
        closeModal();
        startDaemonBearEatingSoup();
      },
    },
    { text: "やっぱりだめ", action: handleDaemonBearSoupDenied },
  ]);
  updateMessage("わあ。食べていいの？");
}

function handleDaemonBearSoupDenied() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.daemonBearSoupDeniedCount = (Number(f.daemonBearSoupDeniedCount) || 0) + 1;
  if (f.daemonBearSoupDeniedCount >= 3) {
    f.daemonBearBackTurned = true;
    closeModal();
    renderCanvasRoom?.();
    updateMessage("ボクは砦を守るんだから…こんなことで怒らないぞ…ブツブツ");
    return;
  }

  showDaemonBearDisappointedModal();
}

function startDaemonBearEatingSoup(duration = 60000) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const backEntranceFlags = gameState.backEntrance?.flags || (gameState.backEntrance = { flags: { backgroundState: 0 } }).flags;

  removeItem("soupDish");
  f.daemonBearEating = true;
  f.daemonBearFinishedPudding = false;
  backEntranceFlags.backgroundState = 1;
  markProgress?.("daemon_bear_eating_soup");
  updateMessage("デーモンベアは仕事を休んでスープを味わっている。");
  renderCanvasRoom?.();

  if (daemonBearEatingTimer) clearTimeout(daemonBearEatingTimer);
  daemonBearEatingTimer = setTimeout(() => {
    f.daemonBearEating = false;
    f.daemonBearFinishedPudding = true;
    backEntranceFlags.backgroundState = 0;
    daemonBearEatingTimer = null;
    if (gameState.currentRoom === "entrance" || gameState.currentRoom === "backEntrance") {
      renderCanvasRoom?.();
    }
  }, duration);
}

function showDaemonBearDisappointedModal() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.bearDisappointed}" alt="がっかりするデーモンベア" style="width:400px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;"></p>
    </div>
  `;
  showModal("「…」", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("デーモンクマは落胆しているようだ");
}

function showDaemonBearSpellModal() {
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <img src="${IMAGES.modals.bearSpell}" alt="呪文を待つデーモンベア" style="width:320px;max-width:100%;display:block;margin:0 auto 2px;">
      <input id="daemonBearSpellInput" class="puzzle-input" type="text" maxlength="16" placeholder="呪文を入力" autocapitalize="off" autocomplete="off" spellcheck="false" style="width:220px; max-width:100%; text-align:center; font-size:1.05em; letter-spacing:0.08em;">
      <button id="daemonBearSpellOk" class="ok-btn" type="button">OK</button>
      <div id="daemonBearSpellHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("呪文を唱える", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const inputEl = document.getElementById("daemonBearSpellInput");
    const okBtn = document.getElementById("daemonBearSpellOk");
    const hintEl = document.getElementById("daemonBearSpellHint");
    if (!inputEl || !okBtn || !hintEl) return;

    const submit = () => {
      const answer = String(inputEl.value || "")
        .trim()
        .toLowerCase();
      if (answer === "kill") {
        showDaemonBearKillBadEnd();
        return;
      }
      if (answer === "kindle sun") {
        playSE("se-splay");
        showModal(
          "ぷす…",
          `
            <div style="text-align:center;">
              <img src="${IMAGES.modals.fireMagicFailed}" alt="失敗した炎呪文" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
              <p style="margin:0; line-height:1.8;">あなたは炎呪文の適性がないようだ。</p>
            </div>
          `,
          [{ text: "閉じる", action: "close" }],
        );
        updateMessage("あなたは炎呪文の適性がないようだ。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "何も起こらない";
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

function showDaemonBearKillBadEnd() {
  const talkedGhost = !!gameState.main.flags?.talkedBackEntranceGhost && !gameState.main.flags?.daemonBearFinishedPudding;
  const animationHtml = talkedGhost
    ? `
      <div class="modal-anim frames" style="height:min(400px, 80vw);">
        <img src="${IMAGES.modals.badendBear}" alt="停止するデーモンベア">
        <img src="${IMAGES.modals.ghostHappy}" alt="喜ぶおばけ">
        <img src="${IMAGES.modals.badendBear2}" alt="停止したデーモンベア">
      </div>
    `
    : `
      <div class="modal-anim">
        <img src="${IMAGES.modals.badendBear}" alt="停止するデーモンベア">
        <img src="${IMAGES.modals.badendBear2}" alt="停止したデーモンベア">
      </div>
    `;
  const content = `
    <div style="text-align:center;">
      ${animationHtml}
      <div style="margin-top:12px;"></div>
    </div>
  `;
  pauseBGM();
  playSE("se-android");
  showModal("【BAD END】デーモンは停止しました。砦の時も、静かに止まりました。", content, [{ text: "最初から", action: "restart" }]);
  updateMessage("BAD END: デーモン停止");
}

function showWizardFireSpellIntro() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.wizardConfuse}" alt="困っている魔法使い" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;"></p>
    </div>
  `;
  showModal("「火の呪文を忘れちゃって…」", content, [
    { text: "呪文を教える", action: showWizardFireSpellPuzzle },
    { text: "閉じる", action: "close" },
  ]);
  updateMessage("火の呪文を忘れちゃって…");
}

function showWizardFireSpellPuzzle() {
  const firstWords = ["FIRE", "SPARK", "FLARE", "KINDLE", "SCROLL"];
  const secondWords = ["LIGHT", "LUMEN", "SUN", "AURORA", "SIGNAL"];
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <button id="wizardSpellWord0" class="nav-btn notranslate" translate="no" type="button" style="width:min(78vw, 340px); height:58px; border-radius:6px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:1.35em; font-weight:700; letter-spacing:0;">${firstWords[0]}</button>
      <button id="wizardSpellWord1" class="nav-btn notranslate" translate="no" type="button" style="width:min(78vw, 340px); height:58px; border-radius:6px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:1.35em; font-weight:700; letter-spacing:0;">${secondWords[0]}</button>
      <button id="wizardSpellOk" class="ok-btn" type="button">OK</button>
      <div id="wizardSpellHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("火の呪文", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const firstBtn = document.getElementById("wizardSpellWord0");
    const secondBtn = document.getElementById("wizardSpellWord1");
    const okBtn = document.getElementById("wizardSpellOk");
    const hintEl = document.getElementById("wizardSpellHint");
    if (!firstBtn || !secondBtn || !okBtn || !hintEl) return;

    const indices = [0, 0];
    const repaint = () => {
      firstBtn.textContent = firstWords[indices[0]];
      secondBtn.textContent = secondWords[indices[1]];
    };

    firstBtn.addEventListener("click", () => {
      indices[0] = (indices[0] + 1) % firstWords.length;
      repaint();
    });
    secondBtn.addEventListener("click", () => {
      indices[1] = (indices[1] + 1) % secondWords.length;
      repaint();
    });
    okBtn.addEventListener("click", () => {
      if (firstWords[indices[0]] === "KINDLE" && secondWords[indices[1]] === "SUN") {
        showWizardFireSpellSuccess();
        return;
      }

      playSE?.("se-sigh");
      showWizardFireSpellFailed();
    });
  }, 0);
}

function showWizardFireSpellFailed() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.wizardFailed}" alt="魔法使い" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
    </div>
  `;
  showModal("「…」", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("…");
}

function showWizardFireSpellSuccess() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.succeedFireSpell = true;
  markProgress?.("succeed_fire_spell");
  playSE?.("se-fire");
  renderCanvasRoom?.();

  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.wizardConsent}" alt="納得した魔法使い" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;"></p>
    </div>
  `;
  showModal("「そうだった！」", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("魔法使いが火の呪文を唱えた。");
}

function showWizardRepairGlassEvent() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.repairedGlassByWizard = true;
  markProgress?.("repair_glass_by_wizard");
  addItem("glass");
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.wizardGlass}" alt="コップを直す魔法使い" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;">魔法使いは炎の呪文を唱えた</p>
    </div>
  `;
  showModal("任せて！直せるよ", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("コップを直してもらった。");
}

function showKingMessageModal() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.kingZoom}" alt="王様" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;">占い師殿の伝言はまだか。</p>
    </div>
  `;
  showModal("王様", content, [
    { text: "出撃時刻を伝える", action: showKingDepartureTimeModal },
    { text: "閉じる", action: "close" },
  ]);
  updateMessage("占い師殿の伝言はまだか。");
}

function showKingDepartureTimeModal() {
  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="kingDepartureDial" style="position:relative; width:min(72vw, 300px); aspect-ratio:1; border-radius:50%; overflow:hidden; border:3px solid #d8d8d8; background:linear-gradient(to bottom, #f2a23a 0 50%, #182949 50% 100%); box-shadow:inset 0 0 18px rgba(0,0,0,0.3); touch-action:none; cursor:pointer;">
        <div style="position:absolute; left:0; right:0; top:50%; height:2px; background:rgba(255,255,255,0.28);"></div>
        <div style="position:absolute; top:0; bottom:0; left:50%; width:2px; background:rgba(255,255,255,0.28);"></div>
        <div style="position:absolute; left:7%; top:50%; transform:translateY(-50%); font-weight:700; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.65);">6</div>
        <div style="position:absolute; left:50%; top:5%; transform:translateX(-50%); font-weight:700; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.65);">12</div>
        <div style="position:absolute; right:6%; top:50%; transform:translateY(-50%); font-weight:700; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.65);">18</div>
        <div style="position:absolute; left:50%; bottom:5%; transform:translateX(-50%); font-weight:700; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.65);">0</div>
        <div id="kingDepartureHand" style="position:absolute; left:50%; top:10%; width:4px; height:40%; background:#fff; border-radius:4px; transform-origin:50% 100%; transform:translateX(-50%) rotate(0deg); box-shadow:0 1px 6px rgba(0,0,0,0.55);"></div>
        <div style="position:absolute; left:50%; top:50%; width:18px; height:18px; border-radius:50%; background:#fff; transform:translate(-50%, -50%); box-shadow:0 1px 5px rgba(0,0,0,0.45);"></div>
        <div id="kingDepartureTimeLabel" style="position:absolute; left:50%; top:50%; transform:translate(-50%, 18px); padding:4px 10px; border-radius:6px; background:rgba(0,0,0,0.58); color:#fff; font-weight:700; font-size:1.05em; font-variant-numeric:tabular-nums;">12:00</div>
      </div>
      <button id="kingDepartureOk" class="ok-btn" type="button">OK</button>
      <div style="font-size:0.9em; opacity:0.82;">30分単位で指定</div>
    </div>
  `;

  showModal("出撃時刻を伝える", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const dial = document.getElementById("kingDepartureDial");
    const hand = document.getElementById("kingDepartureHand");
    const label = document.getElementById("kingDepartureTimeLabel");
    const okBtn = document.getElementById("kingDepartureOk");
    if (!dial || !hand || !label || !okBtn) return;

    const f = gameState.main.flags || (gameState.main.flags = {});
    let selectedMinutes = typeof f.kingDepartureTimeMinutes === "number" ? f.kingDepartureTimeMinutes : 12 * 60;

    const formatTime = (minutes) => {
      const normalized = ((minutes % 1440) + 1440) % 1440;
      const hh = String(Math.floor(normalized / 60)).padStart(2, "0");
      const mm = String(normalized % 60).padStart(2, "0");
      return `${hh}:${mm}`;
    };

    const repaint = () => {
      const hour = selectedMinutes / 60;
      const angle = (hour - 12) * 15;
      hand.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      label.textContent = formatTime(selectedMinutes);
    };

    const setFromPointer = (e) => {
      const rect = dial.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
      const rawHours = (12 + deg / 15 + 24) % 24;
      selectedMinutes = Math.round((rawHours * 60) / 30) * 30;
      if (selectedMinutes >= 1440) selectedMinutes = 0;
      repaint();
    };

    let dragging = false;
    dial.addEventListener("pointerdown", (e) => {
      dragging = true;
      dial.setPointerCapture?.(e.pointerId);
      setFromPointer(e);
    });
    dial.addEventListener("pointermove", (e) => {
      if (dragging) setFromPointer(e);
    });
    dial.addEventListener("pointerup", () => {
      dragging = false;
    });
    dial.addEventListener("pointercancel", () => {
      dragging = false;
    });

    okBtn.addEventListener("click", () => {
      f.kingDepartureTimeMinutes = selectedMinutes;
      const timeText = formatTime(selectedMinutes);
      closeModal();
      updateMessage(`出撃時刻を${timeText}と伝えた。`);
      if (timeText === "22:30" && hasItem("messageFortune")) {
        showKingConsentModal();
      } else {
        showKingDefeatConsentModal();
      }
    });

    repaint();
  }, 0);
}

function showKingConsentModal() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.kingConsent}" alt="納得した王様" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;">王様は納得したようだ</p>
    </div>
  `;
  showModal("「そうか！そろそろだな」", content, [{ text: "閉じる", action: "close" }], showEndMovieFromKingConsent);
}

function showKingDefeatConsentModal() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.kingConsent}" alt="納得した王様" style="width:320px;max-width:100%;display:block;margin:0 auto 16px;">
      <p style="margin:0; line-height:1.8;">全軍、出撃せよ</p>
    </div>
  `;
  showModal("「そうか。分かったぞ」", content, [{ text: "次へ", action: showKingDefeatBadEnd }]);
  updateMessage("そうか。分かったぞ");
}

function showKingDefeatBadEnd() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.badendDefeat}" alt="全滅" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
      <p style="margin:0; line-height:1.8;">しかし、あなたは脱出できました</p>
    </div>
  `;
  pauseBGM();
  playSE("se-zun");
  showModal("【BAD END】そして、誰も帰ってこなかった", content, [{ text: "最初から", action: "restart" }]);
  updateMessage("しかし、あなたは脱出できました。");
}

function showWineDrunkBadEnd() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.badendDrunk}" alt="ワインを飲み過ぎた" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
      <p style="margin:0; line-height:1.8;">【BAD END】ワインを飲み過ぎた。</p>
    </div>
  `;
  pauseBGM();
  playSE("se-negative");
  showModal("【BAD END】ワインを飲み過ぎた。", content, [{ text: "最初から", action: "restart" }]);
  updateMessage("BAD END: ワインを飲み過ぎた。");
}

function showDrinkModal(imgSrc, altText, showBadEndAfterClose) {
  const content = `
    <div style="text-align:center;">
      <img src="${imgSrc}" alt="${altText}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
      <p style="margin:0; line-height:1.8;">一気飲みした</p>
    </div>
  `;
  showModal("ゴクゴク…", content, [{ text: "閉じる", action: "close" }]);
  if (showBadEndAfterClose) {
    window._nextModal = showWineDrunkBadEnd;
  }
  updateMessage("一気飲みした");
}

function showEndMovieFromKingConsent() {
  const videoId = "kingConsentEndMovie";
  const bgm = document.getElementById("bgm");
  const bgmToggle = document.getElementById("bgm-toggle");
  const resumeBGMAfterMovie = isBGMPlaying;
  let endingStarted = false;
  if (bgm && isBGMPlaying) {
    bgm.pause();
    isBGMPlaying = false;
    if (bgmToggle) bgmToggle.textContent = "🔇 BGM";
  }

  const goEnd = () => {
    if (endingStarted) return;
    endingStarted = true;

    const video = document.getElementById(videoId);
    if (video) video.pause();
    const overlay = document.getElementById("roomEffectOverlay");
    if (overlay) {
      overlay.style.transition = "none";
      overlay.style.background = "#000";
      overlay.style.opacity = 1;
    }
    closeModal();

    setTimeout(() => {
      if (resumeBGMAfterMovie) {
        isBGMPlaying = true;
        if (bgmToggle) bgmToggle.textContent = "🔊 BGM";
      }
      changeRoom("end");
      setTimeout(() => {
        if (overlay) {
          overlay.style.transition = "";
          overlay.style.opacity = 0;
          overlay.style.background = "";
        }
      }, 100);
    }, 450);
  };

  const content = `
    <div style="text-align:center;">
      <video id="${videoId}" src="${IMAGES.modals.end}" autoplay playsinline controls style="width:480px;max-width:100%;display:block;margin:0 auto 16px;background:#000;"></video>
      <p id="kingConsentEndMovieHint" style="margin:0; line-height:1.8;"></p>
    </div>
  `;

  showModal("出撃", content, [{ text: "スキップ", action: goEnd }]);

  setTimeout(() => {
    const video = document.getElementById(videoId);
    const hint = document.getElementById("kingConsentEndMovieHint");

    if (!video) {
      goEnd();
      return;
    }

    video.addEventListener("ended", goEnd, { once: true });
    const playPromise = video.play?.();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        if (hint) hint.textContent = "動画を再生すると出撃します。";
      });
    }
  }, 0);
}

function showTimeSymbolPaperModal() {
  const rows = [
    [0, "Moon", "月"],
    [4, "Owl", "フクロウ"],
    [6, "Sunrise", "日の出"],
    [8, "Rooster", "ニワトリ"],
    [10, "Horse", "馬"],
    [12, "Sun", "太陽"],
    [14, "Lion", "ライオン"],
    [16, "Wolf", "オオカミ"],
    [18, "Dog", "犬"],
    [20, "Eagle", "ワシ"],
  ];
  const tableRows = rows
    .map(
      ([time, symbol, jp]) => `
        <tr>
          <td style="padding:6px 14px 6px 0; text-align:right; font-variant-numeric:tabular-nums;">${time}</td>
          <td style="padding:6px 0;"><span class="notranslate" translate="no">${symbol}</span>（${jp}）</td>
        </tr>
      `,
    )
    .join("");

  const content = `
    <div style="max-width:420px; margin:0 auto; padding:24px 28px; background:#fff8dc; color:#2a2116; border:1px solid #d9c58d; box-shadow:inset 0 0 28px rgba(130,95,35,0.14), 0 6px 18px rgba(60,40,20,0.18); text-align:left; line-height:1.65;">
      <table style="width:100%; border-collapse:collapse; font-size:1.02em;">
        <thead>
          <tr>
            <th style="padding:0 14px 8px 0; text-align:right; border-bottom:1px solid #bda66b;">Time</th>
            <th style="padding:0 0 8px 0; text-align:left; border-bottom:1px solid #bda66b;">Symbol</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
  `;

  showModal("古い紙片", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("本棚に古い紙片が挟まっている。");
}

function showEntranceNoticeModal() {
  const content = `
    <div style="max-width:420px; margin:0 auto; padding:28px 30px; background:#fff8dc; color:#2a2116; border:1px solid #d9c58d; box-shadow:inset 0 0 28px rgba(130,95,35,0.14), 0 6px 18px rgba(60,40,20,0.18); text-align:left; line-height:1.9; font-size:1.05em;">
      出撃時刻まで、許可なく通行を禁ず<br>
      <div style="margin-top:18px; text-align:right;">大臣</div>
    </div>
  `;
  showModal("貼り紙", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("貼り紙がある。");
}

function showOldBrookRecordModal() {
  const content = `
    <div style="max-width:420px; margin:0 auto; padding:24px 28px; background:#fff8dc; color:#2a2116; border:1px solid #d9c58d; box-shadow:inset 0 0 28px rgba(130,95,35,0.14), 0 6px 18px rgba(60,40,20,0.18); text-align:left; line-height:1.85;">
      被告：<span class="notranslate" translate="no">Brook</span><br>
      家族：妻・幼い息子あり<br>
      容疑：砦への不法侵入および食料の持ち出し<br>
      備考：脱走を試みたか。消息不明。
    </div>
  `;
  showModal("古い記録がある", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("古い記録がある。");
}

function handleJailFloorStone() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.removeStone) {
    playSE?.("se-ashioto");
    changeRoom("backEntrance");
    return;
  }

  if (gameState.selectedItem !== "teko") {
    updateMessage("床石がガタガタしている。");
    return;
  }

  f.removeStone = true;
  markProgress?.("remove_jail_floor_stone");
  showModal("床石を金てこでどかした", `<p style="margin:0; line-height:1.8; text-align:center;"></p>`, [{ text: "閉じる", action: "close" }]);
  renderCanvasRoom?.();
  updateMessage("床石を金てこでどかした。");
}

function showGuardRoomSoldierMoneyEvent() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.soldierMoney}" alt="soldier money" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
    </div>
  `;
  showModal("おっ。気前が良いな", content, [{ text: "閉じる", action: "close" }], finishGuardRoomSoldierMoneyEvent);
  playSE("se-coinget");
  updateMessage("おっ。気前が良いな");
}

function finishGuardRoomSoldierMoneyEvent() {
  const f = gameState.guardRoom.flags || (gameState.guardRoom.flags = {});
  flashScreen("black", 650);
  setTimeout(() => {
    f.backgroundState = 1;
    renderCanvasRoom?.();
    updateMessage("傭兵たちは整列した。");
  }, 150);
}

function handleGuardMasterAfterLineupClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.guardMasterDrinkItem) {
    updateMessage("「いつでも出撃できそうだな」");
    return;
  }

  if (gameState.selectedItem === "glassWithWine" || gameState.selectedItem === "glassWithWater") {
    showGuardMasterDrinkEvent(gameState.selectedItem);
    return;
  }

  showGuardMasterAfterLineupModal();
}

function showGuardMasterAfterLineupModal() {
  const message = "「やる気を出してくれたようだな！安心して喉が渇いてきたよ」";
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.guardMaster3}" alt="兵士長" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
    </div>
  `;
  showModal("「やる気を出してくれたようだな！安心して喉が渇いてきたよ」", content, [{ text: "閉じる", action: "close" }]);
  updateMessage(message);
}

function showGuardMasterDrinkEvent(itemId) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const isWine = itemId === "glassWithWine";
  const message = "助かるぞ、そういえば占い師殿からこれを預かっていた";
  const firstImage = isWine ? IMAGES.modals.guardMasterDrinkWine : IMAGES.modals.guardMasterDrinkWater;

  f.guardMasterDrinkItem = itemId;
  removeItem(itemId);
  const content = `
    <div style="text-align:center;">
      <div class="modal-anim">
        <img src="${firstImage}" alt="飲み物を受け取る兵士長">
        <img src="${IMAGES.modals.guardMasterPaper}" alt="紙を渡す兵士長">
      </div>
      <p style="margin:0; line-height:1.8;"></p>
    </div>
  `;
  showModal("「助かるぞ、そういえば占い師殿からこれを預かっていた」", content, [{ text: "閉じる", action: "close" }], () => {
    addItem("messageFortune");
    markProgress?.("got_message_fortune");
    updateMessage("占い師からの紙を受け取った。");
  });
  updateMessage(message);
}

function showLeftSecondFloorDoorPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockLeftSecondFloorDoor) {
    updateMessage("右扉は開いている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="leftSecondFloorDoorIcons" style="display:flex; gap:4px; justify-content:center;">
        <button id="leftSecondFloorDoorIcon0" type="button" class="nav-btn" aria-label="1つ目" style="width:72px; height:72px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; display:flex; align-items:center; justify-content:center; padding:1px;"></button>
        <button id="leftSecondFloorDoorIcon1" type="button" class="nav-btn" aria-label="2つ目" style="width:72px; height:72px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; display:flex; align-items:center; justify-content:center; padding:1px;"></button>
        <button id="leftSecondFloorDoorIcon2" type="button" class="nav-btn" aria-label="3つ目" style="width:72px; height:72px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; display:flex; align-items:center; justify-content:center; padding:1px;"></button>
        <button id="leftSecondFloorDoorIcon3" type="button" class="nav-btn" aria-label="4つ目" style="width:72px; height:72px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; display:flex; align-items:center; justify-content:center; padding:1px;"></button>
      </div>
      <button id="leftSecondFloorDoorOk" class="ok-btn" type="button">OK</button>
      <div id="leftSecondFloorDoorHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("２階右扉のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const icons = [
      { key: "tee", img: IMAGES.modals.iconTee },
      { key: "book", img: IMAGES.modals.iconBook },
      { key: "soup", img: IMAGES.modals.iconSoup },
      { key: "shoes", img: IMAGES.modals.iconShoes },
      { key: "match", img: IMAGES.modals.iconMatch },
      { key: "cushion", img: IMAGES.modals.iconCushion },
    ];
    const iconBtns = [0, 1, 2, 3].map((i) => document.getElementById(`leftSecondFloorDoorIcon${i}`));
    const okBtn = document.getElementById("leftSecondFloorDoorOk");
    const hintEl = document.getElementById("leftSecondFloorDoorHint");
    if (iconBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const state = [0, 0, 0, 0];
    const repaint = () => {
      iconBtns.forEach((btn, i) => {
        const icon = icons[state[i]];
        btn.innerHTML = `<img src="${icon.img}" alt="${icon.key}" style="width:68px;height:68px;object-fit:contain;display:block;">`;
      });
      hintEl.textContent = "";
    };

    iconBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % icons.length;
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      const answer = state.map((index) => icons[index].key).join(",");
      if (answer === "book,match,cushion,soup") {
        f.unlockLeftSecondFloorDoor = true;
        markProgress?.("unlock_left_second_floor_door");
        playSE?.("se-falldown");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("扉が崩れ落ちた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showLeftSecondFloorLeftEntrancePuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockLeftSecondFloorLeftEntrance) {
    changeRoom("studyRoom");
    return;
  }

  const rectStyle = "width:180px;height:52px;border-radius:6px;border:2px solid rgba(255,255,255,0.72);color:#fff;font-size:30px;font-weight:bold;display:flex;align-items:center;justify-content:center;";
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <p style="margin:0; line-height:1.8; text-align:center;">ドアがロックされている。</p>
      <div id="leftSecondFloorLeftEntranceDigits" style="display:flex; flex-direction:column; gap:8px; align-items:center;">
        <button id="leftSecondFloorLeftEntranceDigit0" type="button" class="nav-btn" aria-label="上の数字" style="${rectStyle}background:#1f64c8;">0</button>
        <button id="leftSecondFloorLeftEntranceDigit1" type="button" class="nav-btn" aria-label="真ん中の数字" style="${rectStyle}background:#238344;">0</button>
        <button id="leftSecondFloorLeftEntranceDigit2" type="button" class="nav-btn" aria-label="下の数字" style="${rectStyle}background:#bd2f2f;">0</button>
      </div>
      <button id="leftSecondFloorLeftEntranceOk" class="ok-btn" type="button">OK</button>
      <div id="leftSecondFloorLeftEntranceHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("左入り口のロック", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("ドアがロックされている。");

  setTimeout(() => {
    const digitBtns = [0, 1, 2].map((i) => document.getElementById(`leftSecondFloorLeftEntranceDigit${i}`));
    const okBtn = document.getElementById("leftSecondFloorLeftEntranceOk");
    const hintEl = document.getElementById("leftSecondFloorLeftEntranceHint");
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
      if (state.join("") === "352") {
        f.unlockLeftSecondFloorLeftEntrance = true;
        markProgress?.("unlock_left_second_floor_left_entrance");
        playSE?.("se-switch");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("左入り口のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showArmoryTreasureChestPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockArmoryTreasureChest) {
    acquireItemOnce("foundArmoryTreasureChestMoney", "money", "宝箱の中にお金がある", IMAGES.items.money, "お金を手に入れた");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="armoryTreasureChestLetters" style="display:flex; gap:12px; justify-content:center;">
        <button id="armoryTreasureChestLetter0" type="button" class="nav-btn" aria-label="1文字目" style="width:64px; height:64px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:32px; font-weight:bold;">A</button>
        <button id="armoryTreasureChestLetter1" type="button" class="nav-btn" aria-label="2文字目" style="width:64px; height:64px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:32px; font-weight:bold;">A</button>
        <button id="armoryTreasureChestLetter2" type="button" class="nav-btn" aria-label="3文字目" style="width:64px; height:64px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:32px; font-weight:bold;">A</button>
      </div>
      <button id="armoryTreasureChestOk" class="ok-btn" type="button">OK</button>
      <div id="armoryTreasureChestHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("宝箱のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const letters = ["A", "C", "E", "F", "I", "K", "M", "O", "P", "S", "T", "Y"];
    const letterBtns = [0, 1, 2].map((i) => document.getElementById(`armoryTreasureChestLetter${i}`));
    const okBtn = document.getElementById("armoryTreasureChestOk");
    const hintEl = document.getElementById("armoryTreasureChestHint");
    if (letterBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const state = [0, 0, 0];
    const repaint = () => {
      letterBtns.forEach((btn, i) => {
        btn.textContent = letters[state[i]];
      });
      hintEl.textContent = "";
    };

    letterBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % letters.length;
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      const answer = state.map((index) => letters[index]).join("");
      if (answer === "ATM") {
        f.unlockArmoryTreasureChest = true;
        markProgress?.("unlock_armory_treasure_chest");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("宝箱のロックが解除された。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showStudyRoomBoxPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.openBox) {
    updateMessage("箱は開いている。");
    return;
  }

  const circleStyle = "position:absolute;width:78px;height:78px;border-radius:50%;border:2px solid #cfcfd4;background:#fff;color:#111;box-shadow:inset 0 2px 8px rgba(0,0,0,0.08);";
  const circleInnerStyle = "display:flex;align-items:center;justify-content:center;width:100%;height:100%;";
  const circleDigitStyle = "font-size:31px;line-height:1;color:#111;font-weight:800;";
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="studyRoomBoxDigits" style="position:relative;width:276px;height:258px;margin:0 auto;">
        <button id="studyRoomBoxDigit0" type="button" class="nav-btn" aria-label="F" style="${circleStyle} left:99px; top:0;">
          <span style="${circleInnerStyle}"><span class="study-room-box-digit-value" style="${circleDigitStyle}">0</span></span>
        </button>
        <button id="studyRoomBoxDigit1" type="button" class="nav-btn" aria-label="D" style="${circleStyle} left:54px; top:94px;">
          <span style="${circleInnerStyle}"><span class="study-room-box-digit-value" style="${circleDigitStyle}">0</span></span>
        </button>
        <button id="studyRoomBoxDigit2" type="button" class="nav-btn" aria-label="E" style="${circleStyle} left:144px; top:94px;">
          <span style="${circleInnerStyle}"><span class="study-room-box-digit-value" style="${circleDigitStyle}">0</span></span>
        </button>
        <button id="studyRoomBoxDigit3" type="button" class="nav-btn" aria-label="A" style="${circleStyle} left:0; top:180px;">
          <span style="${circleInnerStyle}"><span class="study-room-box-digit-value" style="${circleDigitStyle}">0</span></span>
        </button>
        <button id="studyRoomBoxDigit4" type="button" class="nav-btn" aria-label="B" style="${circleStyle} left:99px; top:180px;">
          <span style="${circleInnerStyle}"><span class="study-room-box-digit-value" style="${circleDigitStyle}">0</span></span>
        </button>
        <button id="studyRoomBoxDigit5" type="button" class="nav-btn" aria-label="C" style="${circleStyle} left:198px; top:180px;">
          <span style="${circleInnerStyle}"><span class="study-room-box-digit-value" style="${circleDigitStyle}">0</span></span>
        </button>
      </div>
      <button id="studyRoomBoxOk" class="ok-btn" type="button">OK</button>
      <div id="studyRoomBoxHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("箱のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const digitBtns = [0, 1, 2, 3, 4, 5].map((i) => document.getElementById(`studyRoomBoxDigit${i}`));
    const okBtn = document.getElementById("studyRoomBoxOk");
    const hintEl = document.getElementById("studyRoomBoxHint");
    if (digitBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const state = [0, 0, 0, 0, 0, 0];
    const repaint = () => {
      digitBtns.forEach((btn, i) => {
        const valueEl = btn.querySelector(".study-room-box-digit-value");
        if (valueEl) valueEl.textContent = String(state[i]);
      });
      hintEl.textContent = "";
    };

    digitBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % 10;
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      const answer = state.join("");
      if (answer === "615014") {
        f.openBox = true;
        markProgress?.("unlock_study_room_box");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("箱のロックが解除された。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function handleStudyRoomOpenedBox() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.foundStudyRoomBoxKey) {
    updateMessage("箱の中は空だ。");
    return;
  }

  acquireItemOnce("foundStudyRoomBoxKey", "key", "箱の中にカギがある", IMAGES.items.key, "カギを手に入れた");
}

function showDoorAdminLockPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockDoorAdmin) {
    updateMessage("ドアロックは解除されている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="doorAdminLockDigits" style="display:flex; gap:12px; justify-content:center;">
        <button id="doorAdminLockDigit0" type="button" class="nav-btn" aria-label="1桁目" style="width:64px; height:64px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:32px; font-weight:bold;">0</button>
        <button id="doorAdminLockDigit1" type="button" class="nav-btn" aria-label="2桁目" style="width:64px; height:64px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:32px; font-weight:bold;">0</button>
        <button id="doorAdminLockDigit2" type="button" class="nav-btn" aria-label="3桁目" style="width:64px; height:64px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:32px; font-weight:bold;">0</button>
        <button id="doorAdminLockDigit3" type="button" class="nav-btn" aria-label="4桁目" style="width:64px; height:64px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:32px; font-weight:bold;">0</button>
      </div>
      <button id="doorAdminLockOk" class="ok-btn" type="button">OK</button>
      <div id="doorAdminLockHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("ドアロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const digitBtns = [0, 1, 2, 3].map((i) => document.getElementById(`doorAdminLockDigit${i}`));
    const okBtn = document.getElementById("doorAdminLockOk");
    const hintEl = document.getElementById("doorAdminLockHint");
    if (digitBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const state = [0, 0, 0, 0];
    const repaint = () => {
      digitBtns.forEach((btn, i) => {
        btn.textContent = String(state[i]);
      });
      hintEl.textContent = "";
    };

    digitBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % 10;
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      if (state.join("") === "5975") {
        f.unlockDoorAdmin = true;
        markProgress?.("unlock_door_admin");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("ドアロックが解除された。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showCabinetTopPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockCabinetTop) {
    updateMessage("キャビネット最上段のロックは解除されている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="cabinetTopGrid" style="display:grid; grid-template-columns:repeat(2, 64px); gap:12px; justify-content:center;">
        <button id="cabinetTopCell0" type="button" class="nav-btn" aria-label="左上" style="width:64px; height:64px; padding:0; display:flex; align-items:center; justify-content:center; line-height:1; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#7a1515; font-size:32px; font-weight:bold;">☆</button>
        <button id="cabinetTopCell1" type="button" class="nav-btn" aria-label="右上" style="width:64px; height:64px; padding:0; display:flex; align-items:center; justify-content:center; line-height:1; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#7a1515; font-size:32px; font-weight:bold;">☆</button>
        <button id="cabinetTopCell3" type="button" class="nav-btn" aria-label="左下" style="width:64px; height:64px; padding:0; display:flex; align-items:center; justify-content:center; line-height:1; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#7a1515; font-size:32px; font-weight:bold;">☆</button>
        <button id="cabinetTopCell2" type="button" class="nav-btn" aria-label="右下" style="width:64px; height:64px; padding:0; display:flex; align-items:center; justify-content:center; line-height:1; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#7a1515; font-size:32px; font-weight:bold;">☆</button>
      </div>
      <button id="cabinetTopOk" class="ok-btn" type="button">OK</button>
      <div id="cabinetTopHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネット最上段のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const symbols = ["☆", "〇", "◇", "□", "▽", "△"];
    const target = ["□", "〇", "□", "△"];
    const cells = [0, 1, 2, 3].map((i) => document.getElementById(`cabinetTopCell${i}`));
    const okBtn = document.getElementById("cabinetTopOk");
    const hintEl = document.getElementById("cabinetTopHint");
    if (cells.some((btn) => !btn) || !okBtn || !hintEl) return;

    const state = [0, 0, 0, 0];
    const repaint = () => {
      cells.forEach((btn, i) => {
        btn.textContent = symbols[state[i]];
      });
      hintEl.textContent = "";
    };

    cells.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % symbols.length;
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      const answer = state.map((idx) => symbols[idx]);
      const ok = target.every((symbol, i) => answer[i] === symbol);
      if (ok) {
        f.unlockCabinetTop = true;
        markProgress?.("unlock_cabinet_top");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("キャビネット最上段のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showCabinetBottomPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockCabinetBottom) {
    updateMessage("キャビネット最下段のロックは解除されている。");
    return;
  }

  const buttonStyle = "width:64px; height:64px; padding:0; display:flex; align-items:center; justify-content:center; line-height:1; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:28px; font-weight:bold;";
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:grid; grid-template-columns:repeat(3, 64px); grid-template-rows:repeat(3, 64px); gap:10px; justify-content:center;">
        <div></div>
        <button id="cabinetBottomNorth" type="button" class="nav-btn" aria-label="N" style="${buttonStyle}">N</button>
        <div></div>
        <button id="cabinetBottomWest" type="button" class="nav-btn" aria-label="W" style="${buttonStyle}"></button>
        <div></div>
        <button id="cabinetBottomEast" type="button" class="nav-btn" aria-label="E" style="${buttonStyle}"></button>
        <div></div>
        <button id="cabinetBottomSouth" type="button" class="nav-btn" aria-label="S" style="${buttonStyle}"></button>
        <div></div>
      </div>
      <button id="cabinetBottomOk" class="ok-btn" type="button">OK</button>
      <div id="cabinetBottomHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネット最下段のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const okBtn = document.getElementById("cabinetBottomOk");
    const hintEl = document.getElementById("cabinetBottomHint");
    const buttons = [
      ["E", document.getElementById("cabinetBottomEast")],
      ["S", document.getElementById("cabinetBottomSouth")],
      ["W", document.getElementById("cabinetBottomWest")],
      ["N", document.getElementById("cabinetBottomNorth")],
    ];
    if (!okBtn || !hintEl || buttons.some(([, btn]) => !btn)) return;

    const target = ["E", "S", "E", "W"];
    const input = [];
    const repaint = () => {
      hintEl.textContent = "";
    };

    buttons.forEach(([direction, btn]) => {
      btn.addEventListener("click", () => {
        if (input.length >= target.length) input.shift();
        input.push(direction);
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      const ok = target.every((direction, i) => input[i] === direction);
      if (ok) {
        f.unlockCabinetBottom = true;
        markProgress?.("unlock_cabinet_bottom");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("キャビネット最下段のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showStaffRoomTopDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockStaffRoomTopDrawer) {
    updateMessage("上段の引き出しのロックは解除されている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="staffRoomTopDrawerButtons" style="display:flex; gap:14px; justify-content:center;">
        <button id="staffRoomTopDrawerLeft" type="button" class="nav-btn" aria-label="左" style="width:76px; height:58px; border-radius:10px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:24px; font-weight:bold;"></button>
        <button id="staffRoomTopDrawerRight" type="button" class="nav-btn" aria-label="右" style="width:76px; height:58px; border-radius:10px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:24px; font-weight:bold;"></button>
      </div>
      <button id="staffRoomTopDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="staffRoomTopDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("引き出し上段のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const leftBtn = document.getElementById("staffRoomTopDrawerLeft");
    const rightBtn = document.getElementById("staffRoomTopDrawerRight");
    const okBtn = document.getElementById("staffRoomTopDrawerOk");
    const hintEl = document.getElementById("staffRoomTopDrawerHint");
    if (!leftBtn || !rightBtn || !okBtn || !hintEl) return;

    const target = ["L", "R", "R", "L", "L", "R"];
    const input = [];
    const pushInput = (value) => {
      input.push(value);
      if (input.length > target.length) input.shift();
      hintEl.textContent = "";
      playSE?.("se-pi");
    };

    leftBtn.addEventListener("click", () => pushInput("L"));
    rightBtn.addEventListener("click", () => pushInput("R"));

    okBtn.addEventListener("click", () => {
      const ok = input.length === target.length && target.every((value, i) => input[i] === value);
      if (ok) {
        f.unlockStaffRoomTopDrawer = true;
        markProgress?.("unlock_staff_room_top_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("上段の引き出しのロックが外れた。");
        return;
      }

      input.length = 0;
      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showStaffRoomCabinetTopPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockStaffRoomCabinetTop) {
    updateMessage("キャビネット上段のロックは解除されている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="staffRoomCabinetTopDigits" style="display:flex; gap:12px; justify-content:center;">
        <button id="staffRoomCabinetTopDigit0" type="button" class="nav-btn" aria-label="1桁目" style="width:64px; height:64px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:32px; font-weight:bold;">0</button>
        <button id="staffRoomCabinetTopDigit1" type="button" class="nav-btn" aria-label="2桁目" style="width:64px; height:64px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:32px; font-weight:bold;">0</button>
        <button id="staffRoomCabinetTopDigit2" type="button" class="nav-btn" aria-label="3桁目" style="width:64px; height:64px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:32px; font-weight:bold;">0</button>
      </div>
      <button id="staffRoomCabinetTopOk" class="ok-btn" type="button">OK</button>
      <div id="staffRoomCabinetTopHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネット上段のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const digitBtns = [0, 1, 2].map((i) => document.getElementById(`staffRoomCabinetTopDigit${i}`));
    const okBtn = document.getElementById("staffRoomCabinetTopOk");
    const hintEl = document.getElementById("staffRoomCabinetTopHint");
    if (digitBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const state = [0, 0, 0];
    const repaint = () => {
      digitBtns.forEach((btn, i) => {
        btn.textContent = String(state[i]);
      });
      hintEl.textContent = "";
    };

    digitBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % 10;
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      if (state.join("") === "728") {
        f.unlockStaffRoomCabinetTop = true;
        markProgress?.("unlock_staff_room_cabinet_top");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("キャビネット上段のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showStaffRoomCabinetMiddlePuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockStaffRoomCabinetMiddle) {
    updateMessage("キャビネット中段のロックは解除されている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <input id="staffRoomCabinetMiddleInput" class="puzzle-input" type="text" maxlength="12" placeholder="英字6文字" autocapitalize="off" autocomplete="off" spellcheck="false" style="width:220px; text-align:center; font-size:1.15em; letter-spacing:0.08em;">
      <button id="staffRoomCabinetMiddleOk" class="ok-btn" type="button">OK</button>
      <div id="staffRoomCabinetMiddleHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネット中段のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const inputEl = document.getElementById("staffRoomCabinetMiddleInput");
    const okBtn = document.getElementById("staffRoomCabinetMiddleOk");
    const hintEl = document.getElementById("staffRoomCabinetMiddleHint");
    if (!inputEl || !okBtn || !hintEl) return;

    const submit = () => {
      const answer = String(inputEl.value || "")
        .trim()
        .toLowerCase();
      if (answer === "noodle") {
        f.unlockStaffRoomCabinetMiddle = true;
        markProgress?.("unlock_staff_room_cabinet_middle");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("キャビネット中段のロックが外れた。");
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

function showStaffRoomPcLogin() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockStaffRoomPc) {
    changeRoom("desktop");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="width:min(82vw, 340px); padding:18px; box-sizing:border-box; border:2px solid #2b3340; background:#eef2f6; color:#1d2530; text-align:center;">
        <div style="font-size:1.05em; font-weight:700; margin-bottom:14px;">LOGIN</div>
        <input id="staffRoomPcPassword" class="puzzle-input" type="password" maxlength="16" placeholder="英字5文字" autocapitalize="off" autocomplete="off" spellcheck="false" style="width:220px; max-width:100%; text-align:center; font-size:1.05em; letter-spacing:0.08em;">
      </div>
      <button id="staffRoomPcLogin" class="ok-btn" type="button">ログイン</button>
      <div id="staffRoomPcHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("デスクトップPC", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const inputEl = document.getElementById("staffRoomPcPassword");
    const loginBtn = document.getElementById("staffRoomPcLogin");
    const hintEl = document.getElementById("staffRoomPcHint");
    if (!inputEl || !loginBtn || !hintEl) return;

    const submit = () => {
      const answer = String(inputEl.value || "")
        .trim()
        .toLowerCase();
      if (answer === "bento") {
        f.unlockStaffRoomPc = true;
        markProgress?.("unlock_staff_room_pc");
        playSE?.("se-cyber");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("PCにログインした。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "パスワードが違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    };

    loginBtn.addEventListener("click", submit);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    });
    inputEl.focus();
  }, 0);
}

function showMailboxPasscode() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  const startTransmission = () => {
    f.daemonBearArrived = false;
    changeRoom("entrance");
    updateMessage("通信プロセスが起動した。");
    playDaemonBearFloatInFx(() => {
      f.daemonBearArrived = true;
      renderCanvasRoom?.();
      updateMessage("通信文が届いているかもしれない");
    });
  };

  if (f.unlockMailbox) {
    acquireItemOnce("foundMailboxMessage", "message", "通信ポストにメッセージがある", IMAGES.items.message, "メッセージを手に入れた");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="width:min(82vw, 340px); padding:18px; box-sizing:border-box; border:2px solid #2b3340; background:#eef2f6; color:#1d2530; text-align:center;">
        <div style="font-size:1.05em; font-weight:700; margin-bottom:14px;">⚔️パスコードを入力してください</div>
        <input id="mailboxPasscode" class="puzzle-input" type="text" maxlength="4" placeholder="英字4文字" autocapitalize="off" autocomplete="off" spellcheck="false" style="width:220px; max-width:100%; text-align:center; font-size:1.05em; letter-spacing:0.12em;">
      </div>
      <button id="mailboxPasscodeOk" class="ok-btn" type="button">OK</button>
      <div id="mailboxPasscodeHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("郵便ポストのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const inputEl = document.getElementById("mailboxPasscode");
    const okBtn = document.getElementById("mailboxPasscodeOk");
    const hintEl = document.getElementById("mailboxPasscodeHint");
    if (!inputEl || !okBtn || !hintEl) return;

    const submit = () => {
      const answer = String(inputEl.value || "").trim();
      if (answer.toLowerCase() === "post") {
        f.unlockMailbox = true;
        markProgress?.("unlock_mailbox");
        playSE?.("se-cyber");
        showModal("通信プロセス呼出", `<p style="margin:0; line-height:1.8; text-align:center;">ピピピ…</p>`, [{ text: "OK", action: "close" }], startTransmission);
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "パスコードが違うようだ";
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

function handleLockedKitchenBox() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (!f.unlockKitchenBox) {
    if (gameState.selectedItem === "key") {
      removeItem("key");
      f.unlockKitchenBox = true;
      markProgress?.("unlock_kitchen_box");
      playSE?.("se-gacha");
      renderCanvasRoom?.();
      updateMessage("小箱のロックが解除された。");
      return;
    }

    updateMessage("小箱には鍵がかかっている。");
    return;
  }

  if (f.foundKitchenBoxCleanDish) {
    updateMessage("小箱の中は空だ。");
    return;
  }

  acquireItemOnce("foundKitchenBoxCleanDish", "cleanDish", "小箱の中にきれいな容器がある", IMAGES.items.cleanDish, "きれいな容器を手に入れた");
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
      if ((gameState.main.flags.complaintCallScore || 0) >= 2) {
        gameState.trueEnd.flags.backgroundState = 1;
      }
      travelWithStepsTrueEnd();
    } else {
      if ((gameState.main.flags.complaintCallScore || 0) >= 2) {
        gameState.end.flags.backgroundState = 1;
      }

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
    message: "斥候のメッセージ",
    messageFortune: "占い師の紙",
    teko: "金てこ",
    glassBroken: "割れたコップ",
    glass: "コップ",
    glassWithWine: "ワイン入りコップ",
    glassWithWater: "水入りコップ",
    money: "金貨",
    cleanDish: "きれいな容器",
    soupDish: "スープ入りの容器",
  };
  return names[itemId] || itemId;
}

function openInventoryItemDetail(itemId, slotIndex, fallbackSrc) {
  const itemBaseSrc = IMAGES.items[itemId] || fallbackSrc;
  const itemEnSrc = IMAGES.items[`${itemId}En`];
  const hasEnVariant = !!itemEnSrc;

  let content = `<img src="${itemBaseSrc}" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`;
  let buttons = [{ text: "閉じる", action: "close" }];

  if (itemId === "manual") {
    buttons = [
      {
        text: "読む",
        action: () => {
          window._nextModal = {
            title: "クレーム処理マニュアル",
            content: `
                    <div style="max-width:560px; margin:0 auto; padding:26px 28px; background:#fffdf2; color:#2b2116; border:1px solid #d8c99c; box-shadow:inset 0 0 24px rgba(120,90,40,0.12), 0 6px 18px rgba(80,60,30,0.14); text-align:left; line-height:1.85; font-size:1em;">
                      <div style="font-weight:bold; font-size:1.08em; margin-bottom:10px;">クレーム対応の極意</div>
                      <ol style="margin:0; padding-left:1.6em;">
                        <li>絵本からクレームがあった物件の電話番号を調べる</li>
                        <li>電話を掛ける</li>
                        <li>謝罪する。</li>
                        <li>対応方針を伝える</li>
                      </ol>
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

  if (itemId === "fileProperty") {
    buttons = [
      {
        text: "中を見る",
        action: () => {
          const f = gameState.main.flags || (gameState.main.flags = {});
          f.propertyReturnRoom = gameState.currentRoom;
          closeModal();
          changeRoom("property1");
        },
      },
      { text: "閉じる", action: "close" },
    ];
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

// 初回クリック時にだけBGMを再生
function initBGMOnce() {
  if (!isBGMInitialized) {
    const bgm = document.getElementById("bgm");
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
function playOptionalSE(id) {
  const se = document.getElementById(id);
  if (!se || !se.src) return;
  try {
    se.currentTime = 0;
    se.play();
  } catch (e) {}
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
