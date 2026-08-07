// --- Analytics helper ---
window.ANA = {
  start: Date.now(),
  hintCount: 0,
  send(ev, params = {}) {
    try {
      gtag("event", ev, params);
    } catch (e) { }
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
const BASE_43 = USE_LOCAL_ASSETS ? "images/43" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/43";
const BASE_SOUND_43 = USE_LOCAL_ASSETS ? "sounds/43" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/43";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I43 = (file) => `${BASE_43}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S43 = (file) => `${BASE_SOUND_43}/${file}`;
const DEFAULT_BGM = S43("kikyou.mp3");

// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    mainDoor: [I43("main_door.webp")],
    mainDesk: [I43("main_desk.webp")],
    mainTable: [I43("main_table.webp")],
    machineRoom: [I43("machine_room.webp")],
    mainWindow: [I43("main_window.webp")],
    end: [I43("end.webp"), I43("end2.webp")],
    trueEnd: [I43("true_end.webp")],
    modernEnd: [I43("modern_end.webp"), I43("modern_end2.webp"), I43("modern_end3.webp"), I43("modern_end4.webp")],
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
    blackBack: ICM("common/black_back.png"),
    lang_en: ICM("common/en2.png"),
    lang_jp: ICM("common/jp.png"),
    // key: ICM("common/key.webp"),
    battery: ICM("common/battery.webp"),
    driver: ICM("common/driver.webp"),


    key: I43("key.webp"),
    windowSummer: I43("window_summer.webp"),
    pencil: I43("pencil.webp"),
    tategami: I43("tategami.webp"),
    map: I43("map.webp"),
    mapBefore: I43("map_before.webp"),
    picFailure: I43("pic_failure.webp"),
    picNikuman: I43("pic_nikuman.webp"),
    picJelly: I43("pic_jelly.webp"),
    picNikumanOld: I43("pic_nikuman_old.webp"),
    picJellyOld: I43("pic_jelly_old.webp"),
    nikuman: I43("nikuman.webp"),
    nikumanPut: I43("nikuman_put.webp"),
    jelly: I43("jelly.webp"),
    jellyPut: I43("jelly_put.webp"),
    dish: I43("dish.webp"),
    picKids: I43("pic_kids.webp"),
    picKidsSet: I43("pic_kids_set.webp"),
    operaGlass: I43("opera_glass.webp"),
    flower: I43("flower.webp"),
    flowerSet: I43("flower_set.webp"),
    watageSet: I43("watage_set.webp"),
    watageBlown: I43("watage_blown.webp"),

    uchiwa: I43("uchiwa.webp"),
    gomi: I43("gomi.webp"),
    dollBear: I43("doll_bear.webp"),
    door: I43("door.webp"),
    bearLion: I43("bear_lion.webp"),
    leaf: I43("leaf.webp"),
    ghost: I43("ghost.webp"),

  },
  modals: {
    chair: I43("modal_chair.webp"),
    window: I43("modal_window.webp"),
    windowAfter: I43("modal_window_after.webp"),
    windowZoom: I43("modal_window_zoom.webp"),
    windowAfterZoom: I43("modal_window_zafter_zoom.webp"),
    mapWindow: I43("modal_window_map.webp"),
    mapWindowZoom: I43("modal_window_map_zoom.webp"),
    icon1: I43("icon_line_1.webp"),
    icon2: I43("icon_line_2.webp"),
    icon3: I43("icon_line_3.webp"),
    icon4: I43("icon_line_4.webp"),
    iconThunder: I43("icon_thunder.webp"),
    iconWind: I43("icon_wind.webp"),
    iconAdult: I43("icon_adult.webp"),
    iconKids: I43("icon_kids.webp"),
    iconLetter: I43("icon_letter.webp"),
    iconTel: I43("icon_tel.webp"),
    iconHyacinth: I43("icon_hyacinth.webp"),
    iconWatage: I43("icon_watage.webp"),
    iconTanpopo: I43("icon_tanpopo.webp"),
    wood: I43("modal_wood.webp"),
    picKidsLight: I43("modal_pic_kids_light.webp"),
    picFujin: I43("modal_pic_fujin.webp"),
    letter: I43("modal_letter.webp"),
    letterBack: I43("modal_letter_back.webp"),
    flower: I43("modal_flower.webp"),
    flowerSet: I43("modal_flower_set.webp"),
    notSet: I43("modal_not_set.webp"),
    watageSet: I43("modal_watage_set.webp"),
    watageBlown: I43("modal_watage_blown.webp"),
    picBear: I43("pic_bear.webp"),
    storageUnderDesk1: I43("modals.storage_under_desk_1.webp"),
    storageUnderDesk2: I43("modals.storage_under_desk_2.webp"),
    uchiwa: I43("modal_uchiwa.webp"),
    watageBlownAfter: I43("modal_watage_blown_after.webp"),
    gomi: I43("modal_gomi.webp"),
    dollBearTategami: I43("modal_doll_bear_tategami.webp"),
    dollBearFound: I43("modal_doll_bear_found.webp"),
    cabinet: I43("modal_cabinet.webp"),
    cabinetInner1: I43("modal_cabinet_inner_1.webp"),
    cabinetInner2: I43("modal_cabinet_inner_2.webp"),
    machineInnerPaper: I43("modal_machine_inner_paper.webp"),
    machineInner: I43("modal_machine_inner.webp"),
    oldNikumanInto: I43("modal_old_nikuman_into.webp"),
    nikumanInto: I43("modal_nikuman_into.webp"),
    jellyInto: I43("modal_jelly_into.webp"),
    badendBefore: I43("badend_before.webp"),
    badend: I43("badend.webp"),
    bearNikuman1: I43("modal_bear_nikuman_1.webp"),
    bearNikuman2: I43("modal_bear_nikuman_2.webp"),
    bearNikuman3: I43("modal_bear_nikuman_3.webp"),
    doorUnlock: I43("modal_door_unlock.webp"),
    dish: I43("dish.webp"),
    leaf: I43("modal_leaf.webp"),
    leafBefore: I43("modal_leaf_before.webp"),
    moon: I43("modal_moon.webp"),
    bearSleep: I43("modal_bear_sleep.webp"),

    // badend: I43("badend.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState43";
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

let gameState = getDefaultGameState();

const CHAIR_PUZZLE_ANSWER = ["left", "left", "right", "down", "up"];
const MAIN_DESK_DRAWER_ANSWER = [4, 3, 2];
const MAIN_DOOR_SECOND_DRAWER_ICONS = ["Thunder", "Wind", "Adult", "Kids", "Letter", "Tel"];
const MAIN_DOOR_SECOND_DRAWER_ANSWER = ["Wind", "Letter", "Kids", "Kids"];
const MAIN_DOOR_THIRD_DRAWER_ANSWER = "1939";
const MAIN_DOOR_CABINET_LETTERS = ["a,", "d", "e", "h", "i", "o", "p", "r", "s"];
const MAIN_DOOR_CABINET_ANSWER = "hide";
const MACHINE_DOOR_ICONS = ["hyacinth", "watage", "tanpopo"];
const MACHINE_DOOR_ANSWER = ["watage", "hyacinth", "hyacinth", "tanpopo"];

// 部屋データ
let rooms = {
  mainDoor: {
    name: "ドア",
    description: "ドアのある場所だ。",
    clickableAreas: [
      {
        x: 73.9, y: 61.1, width: 13.7, height: 6.3,
        onClick: clickWrap(showMainDeskLetter),
        description: '引き出し一段目',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 73.9, y: 68.9, width: 13.5, height: 6.2,
        onClick: clickWrap(showMainDoorSecondDrawerPuzzle),
        description: '引き出し二段目',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 74.1, y: 77.0, width: 13.3, height: 6.4,
        onClick: clickWrap(showMainDoorThirdDrawerPuzzle),
        description: '引き出し三段目',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 12.7, y: 60.9, width: 15.2, height: 24.8,
        onClick: clickWrap(showMainDoorCabinetPuzzle),
        description: 'キャビネット',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 36.7, y: 19.3, width: 27.4, height: 65.7,
        onClick: clickWrap(handleMainDoorExit),
        description: 'ドア',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainWindow"), { allowAtNight: true }),
        description: "窓へ左移動",
        zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainDesk"), { allowAtNight: true }),
        description: "デスクへ右移動",
        zIndex: 10,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  mainDesk: {
    name: "デスク",
    description: "デスクのある場所だ。",
    clickableAreas: [


      {
        x: 93.5, y: 46.7, width: 6.1, height: 13.1,
        onClick: clickWrap(function () {
          showObj(null, "風神の絵のようだ", IMAGES.modals.picFujin, "風神の絵を眺めた。");
        }),
        description: '風神の絵',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 73.6, y: 57.5, width: 18.8, height: 23.7,
        onClick: clickWrap(showMainDeskChairPuzzle),
        description: '椅子',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 46.7, y: 26.5, width: 43.0, height: 24.7,
        onClick: clickWrap(handleMainDeskWindowClick),
        description: '窓',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '窓の景色変更後',
        zIndex: 5,
        usable: () => false,
        item: { img: 'windowSummer', visible: () => getMainFlags().windowChanged }
      },
      {
        x: 77.9, y: 44.0, width: 7.5, height: 9.3,
        onClick: clickWrap(handleMainDeskVaseClick),
        description: '花瓶',
        zIndex: 6,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 78.3, y: 44.3, width: 7.5, height: 6.0,
        onClick: clickWrap(function () {

        }),
        description: '花瓶にセットされたタンポポ',
        zIndex: 5,
        usable: () => false,
        item: { img: 'flowerSet', visible: () => getMainFlags().vaseState === "flower" }
      },
      {
        x: 78.3, y: 44.3, width: 7.5, height: 6.0,
        onClick: clickWrap(function () {

        }),
        description: '花瓶にセットされた綿毛',
        zIndex: 5,
        usable: () => false,
        item: { img: 'watageSet', visible: () => getMainFlags().vaseState === "seedHead" }
      },
      {
        x: 78.3, y: 44.3, width: 7.5, height: 6.0,
        onClick: clickWrap(function () {

        }),
        description: '花瓶にセットされた綿毛、吹き飛ばされ後',
        zIndex: 5,
        usable: () => false,
        item: { img: 'watageBlown', visible: () => getMainFlags().vaseState === "blown" }
      },
      {
        x: 46.2, y: 51.8, width: 13.4, height: 10.6,
        onClick: clickWrap(showMainDeskBoxPuzzle),
        description: '机の上の箱',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 44.4, y: 65.4, width: 23.8, height: 4.5,
        onClick: clickWrap(showMainDeskDrawerPuzzle),
        description: '机の引き出し',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 41.3, y: 72.3, width: 11.2, height: 17.0,
        onClick: clickWrap(showUnderDeskPicBearPuzzle),
        description: '机の下の収納',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 42.7, y: 78.1, width: 6.0, height: 5.7,
        onClick: clickWrap(function () {

        }),
        description: '机の下の収納の表示部',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0.3, y: 74.6, width: 16.1, height: 7.4,
        onClick: clickWrap(handleMainDeskBedTray),
        description: 'ベッドのお盆',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 2.5, y: 75.4, width: 9.3, height: 6.3,
        onClick: clickWrap(function () {

        }),
        description: 'お盆の上の食物置き場',
        zIndex: 5,
        usable: () => false,
        item: {
          img: () => `${getMainFlags().bedTrayFood}Put`,
          visible: () => ["nikuman", "jelly"].includes(getMainFlags().bedTrayFood),
        }
      },
      {
        x: 0.6, y: 48.6, width: 28.6, height: 27.8,
        onClick: clickWrap(handleMainDeskGhostClick),
        description: 'おばけ出現部分',
        zIndex: 5,
        usable: () => gameState.fx?.ghostJelly?.phase === "waiting",
        item: { img: 'IMAGE_KEY', visible: () => false }
      },
      {
        x: 0.7, y: 66.1, width: 20.2, height: 8.2,
        onClick: clickWrap(function () {
          updateMessage("普通の枕だ。");
        }),
        description: '枕',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainDoor"), { allowAtNight: true }),
        description: "ドアへ左移動",
        zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainTable"), { allowAtNight: true }),
        description: "テーブルへ右移動",
        zIndex: 10,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  mainTable: {
    name: "テーブル",
    description: "テーブルのある場所だ。",
    clickableAreas: [
      {
        x: 24.8, y: 57.3, width: 28.5, height: 8.8,
        onClick: clickWrap(handleMainTableSketchbookClick),
        description: 'テーブルの上のスケッチブック',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 44.8, y: 67.5, width: 7.7, height: 6.6,
        onClick: clickWrap(function () {
          acquireItemOnce("foundOperaGlass", "operaGlass", "ベンチの下に双眼鏡がある", IMAGES.items.operaGlass, "ベンチの下から双眼鏡を手に入れた");
        }),
        description: 'ベンチの下の双眼鏡',
        zIndex: 5,
        usable: () => !getMainFlags().foundOperaGlass,
        item: { img: 'operaGlass', visible: () => !getMainFlags().foundOperaGlass }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () { }),
        description: 'イーゼルに置かれた子供の絵の表示',
        zIndex: 6,
        usable: () => false,
        item: { img: 'picKidsSet', visible: () => getMainFlags().picKidsSet }
      },
      {
        x: 62.0, y: 49.4, width: 22.2, height: 30.2,
        onClick: clickWrap(() => {
          showObj(null, "子供が描かれたスケッチ", IMAGES.modals.picKidsLight, "イーゼルに置かれた子供が描かれたスケッチを眺めた。");
        }),
        description: 'イーゼルに置かれた子供の絵',
        zIndex: 7,
        usable: () => getMainFlags().picKidsSet,
      },
      {
        x: 62.0, y: 49.4, width: 22.2, height: 30.2,
        onClick: clickWrap(handleMainTableEaselClick),
        description: 'イーゼル',
        zIndex: 5,
        usable: () => !getMainFlags().picKidsSet,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 10.1, y: 77.5, width: 6.4, height: 4.6,
        onClick: clickWrap(function () {
          showObj(null, "投げ捨てた絵", IMAGES.modals.gomi, "投げ捨てた絵がある。");
        }),
        description: '投げ捨てた絵',
        zIndex: 5,
        usable: () => getMainFlags().thrownGomi,
        item: { img: 'gomi', visible: () => getMainFlags().thrownGomi }
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainDesk"), { allowAtNight: true }),
        description: "デスクへ左移動",
        zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: 'ドア解放後',
        zIndex: 5,
        usable: () => false,
        item: { img: 'door', visible: () => getMainFlags().unlockMachineDoor }
      },
      {
        x: 87.2, y: 21.0, width: 10.4, height: 52.8,
        onClick: clickWrap(showMachineDoorPuzzle),
        description: 'ドア解放前クリック領域',
        zIndex: 5,
        usable: () => !getMainFlags().unlockMachineDoor && getMainFlags().unlockMachineDoorHintShown,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0.9, y: 44.5, width: 22.4, height: 22.6,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "picNikumanOld") {
            updateMessage("「えー・・・なんか不気味な絵だね」");
            return;
          }
          if (gameState.selectedItem === "picNikuman") {
            updateMessage("「肉まん？絵じゃないほうが良いなー」");
            return;
          }
          if (gameState.selectedItem === "jelly") {
            updateMessage("「わー、綺麗なゼリー！でも今は、お肉の気分だなー」");
            return;
          }
          if (gameState.selectedItem === "nikuman") {
            showBearNikumanEvent();
            return;
          }
          talkToHintCharacter("main", "bear");
        }),
        description: 'クマ妖精',
        zIndex: 5,
        usable: () => getMainFlags().bearAppear && !getMainFlags().bearDeparted,
        item: { img: 'bearLion', visible: () => getMainFlags().bearAppear && !getMainFlags().bearDeparted }
      },
      {
        x: 9.5, y: 90.6, width: 9.7, height: 8.5,
        onClick: clickWrap(function () {
          acquireItemOnce("foundKey", "key", "クマ妖精が落としたカギ", IMAGES.items.key, "カギを手に入れた。");
        }),
        description: '落としたカギ',
        zIndex: 5,
        usable: () => getMainFlags().bearDeparted && !getMainFlags().foundKey,
        item: { img: 'key', visible: () => getMainFlags().bearDeparted && !getMainFlags().foundKey }
      },
      {
        x: 87.2, y: 21.0, width: 10.4, height: 52.8,
        onClick: clickWrap(function () {
          changeRoom("machineRoom");
        }),
        description: 'ドア解放後クリック領域',
        zIndex: 5,
        usable: () => getMainFlags().unlockMachineDoor,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainWindow"), { allowAtNight: true }),
        description: "窓へ右移動",
        zIndex: 10,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  machineRoom: {
    name: "隠し小部屋",
    description: "食器棚のようなものがある",
    clickableAreas: [
      {
        x: 27.4, y: 27.1, width: 30.2, height: 22.7,
        onClick: clickWrap(showMachineRoomUpperCabinet),
        description: '食器棚の上扉',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 27.5, y: 52.0, width: 29.4, height: 10.7,
        onClick: clickWrap(handleMachineRoomSlot),
        description: '食器棚のスリット',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 31.7, y: 64.6, width: 22.0, height: 18.3,
        onClick: clickWrap(function () {
          updateMessage("穴が開いている");
        }),
        description: '排出口',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 25.2, y: 24.6, width: 34.5, height: 68.2,
        onClick: clickWrap(function () {

        }),
        description: '食器棚全体',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainTable"), { allowAtNight: true }),
        description: "テーブルへ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  mainWindow: {
    name: "窓",
    description: "窓のある場所だ。",
    clickableAreas: [
      {
        x: 59.3, y: 81.1, width: 8.0, height: 9.3,
        onClick: clickWrap(function () {
          acquireItemOnce("foundPencil", "pencil", "鉛筆がある", IMAGES.items.pencil, "鉛筆を手に入れた")
        }),
        description: '鉛筆',
        zIndex: 5,
        usable: () => !getMainFlags().foundPencil,
        item: { img: 'pencil', visible: () => !getMainFlags().foundPencil }
      },
      {
        x: 32.9, y: 16.4, width: 38.6, height: 65.7,
        onClick: clickWrap(function () {
          if (getMainFlags().chairPuzzleSolved && gameState.selectedItem === "operaGlass") {
            showObj(null, "双眼鏡で池を見た", IMAGES.modals.leaf, "池に浮かぶ葉を双眼鏡で眺めた。");
            return;
          }
          if (!getMainFlags().chairPuzzleSolved && gameState.selectedItem === "operaGlass") {
            showObj(null, "双眼鏡で池を見た", IMAGES.modals.leafBefore, "池を双眼鏡で眺めた。");
            return;
          }
          updateMessage("窓の外に池が見える。");
        }),
        description: '池が見える窓',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 55.8, y: 63.7, width: 4.3, height: 3.6,
        onClick: clickWrap(function () {

        }),
        description: '池に浮かぶ葉',
        zIndex: 5,
        usable: () => false,
        item: { img: 'leaf', visible: () => getMainFlags().chairPuzzleSolved }
      },
      {
        x: 8.0, y: 77.0, width: 13.6, height: 15.8,
        onClick: clickWrap(showMainWindowDiary),
        description: '日記',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainTable"), { allowAtNight: true }),
        description: "テーブルへ左移動",
        zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainDoor"), { allowAtNight: true }),
        description: "ドアへ右移動",
        zIndex: 10,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  end: {
    name: "ノーマルエンド",
    description: "脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 54.6, y: 32.4, width: 29.9, height: 28.9,
        onClick: clickWrap(function () {
          updateMessage("クマ妖精は、満足そうに肉まんを食べている");
        }),
        description: 'クマ妖精',
        zIndex: 5,
        usable: () => gameState.end.flags.backgroundState == 0,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 32.7, y: 34.9, width: 42.1, height: 43.5,
        onClick: clickWrap(function () {
          updateMessage("クマ妖精は、肉まんをかじられてしまった");

        }),
        description: '人の肉まんをかじるクマ妖精',
        zIndex: 5,
        usable: () => gameState.end.flags.backgroundState == 1,
        item: { img: 'IMAGE_KEY', visible: () => true }
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
    description: "謎のおばけも救うことができました。脱出おめでとうございます。",
    clickableAreas: [
      {
        x: 35.4, y: 61.0, width: 21.9, height: 13.9,
        onClick: clickWrap(function () {
          showObj(null, "クマ妖精は眠っている", IMAGES.modals.bearSleep, "クマ妖精は眠っている");
        }),
        description: '寝ているクマ妖精',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 66.1, y: 13.0, width: 15.1, height: 13.6,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "operaGlass") {
            showObj(null, "月を観察した", IMAGES.modals.moon, "月を観察した");
            return;
          }
          updateMessage("きれいな満月だ");
        }),
        description: 'きれいな満月',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
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
  modernEnd: {
    name: "灼熱の現代エンド",
    description: "どこかに転移しました。脱出おめでとうございます！",
    clickableAreas: [
      {
        x: 4.7, y: 35.9, width: 8.2, height: 8.2,
        onClick: clickWrap(function () {
          updateMessage("「あつい・・・」");
        }),
        description: '暑さにぐったりしたクマ妖精',
        zIndex: 5,
        usable: () => gameState.modernEnd.flags.backgroundState == 2,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 74.7, y: 37.5, width: 24.2, height: 24.6,
        onClick: clickWrap(function () {
          if (hasItem("fukinWet")) {
            playModernEndCafeTransition(gameState.modernEnd.flags.backgroundState + 1);
            return;
          } else {
            updateMessage("カフェに入れば涼しそうだけど・・・もう歩く気力がない。暑さ対策が必要だったな");
          }

        }),
        description: 'カフェ',
        zIndex: 5,
        usable: () => gameState.modernEnd.flags.backgroundState == 2 || gameState.modernEnd.flags.backgroundState == 0,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 33.7, y: 34.6, width: 33.2, height: 25.5,
        onClick: clickWrap(function () {
          showObj(null, "「ひんやり美味しい！」", IMAGES.modals.bearEating, "クマ妖精は満足しているようだ");
        }),
        description: 'アイスを食べるクマ妖精',
        zIndex: 5,
        usable: () => gameState.modernEnd.flags.backgroundState == 3,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {
          showEndingReport("modernEnd");
        }),
        description: "モダンエンド",
        usable: () => true,
      },
    ],
  },
};

const hintMessages = {
  main: {
    bear: ["「こんにちは」", "「さっきまで暗い場所にいた気がするよ」", "「変なマークがあったなー」"],
    bear2: ["「ボクのツノが・・・」", "「一生懸命作ったのに」"],
  },
};

const hintCharacters = {
  main: {
    bear: { name: "クマ妖精", image: IMAGES.items.bearLion },
    bear2: { name: "クマ妖精", image: IMAGES.items.bearLion },
  },
};

function playModernEndCafeTransition(nextBackgroundState) {
  const overlay = document.getElementById("roomEffectOverlay");
  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;
  playSE?.("se-ashioto");

  if (overlay) {
    overlay.style.background = "#000";
    overlay.style.opacity = 1;
  }

  setTimeout(() => {
    gameState.modernEnd.flags.backgroundState = nextBackgroundState;
    if (nextBackgroundState === 1) {
      markProgress?.("arrive_cafe");
    } else if (nextBackgroundState === 3) {
      markProgress?.("arrive_cafe_with_kuma");
    }
    if (nextBackgroundState === 1 || nextBackgroundState === 3) {
      if (hasItem("fukinWet")) removeItem("fukinWet");
      changeBGM(S43("remoncake_and_hachimitsukoucha.mp3"));
    }
    renderCanvasRoom();
    updateMessage("濡れタオルを頭にかぶせて、カフェに移動した。");

    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = 0;
      }
      setTimeout(() => {
        if (overlay) overlay.style.background = "";
        fx.lockInput = false;
      }, 520);
    }, 120);
  }, 480);
}

function travelWithSteps(destRoom, { useWarp = false, soundId = "se-ashioto" } = {}) {
  const overlay = document.getElementById("roomEffectOverlay");

  playSE?.(soundId);

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

function travelWithStepsTrueEnd(soundId = "se-ashioto") {
  const overlay = document.getElementById("roomEffectOverlay");
  const destRoom = "trueEnd";

  playSE?.(soundId);

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

function showMainDeskDrawerPuzzle() {
  const flags = getMainFlags();
  if (flags.mainDeskDrawerUnlocked) {
    playSE?.("se-hikidashi");
    acquireItemOnce(
      "foundPicKids",
      "picKids",
      "子供が描かれたスケッチ",
      IMAGES.items.picKids,
      "子供が描かれたスケッチを手に入れた。",
    );
    return;
  }

  const saved = Array.isArray(flags.mainDeskDrawerIcons) ? flags.mainDeskDrawerIcons : [1, 1, 1];
  const values = [0, 1, 2].map((index) => {
    const value = Number(saved[index]);
    return value >= 1 && value <= 4 ? value : 1;
  });
  flags.mainDeskDrawerIcons = values.slice();

  const squareStyle = "width:min(25vw,140px);aspect-ratio:1;padding:8px;border:3px solid #76502d;border-radius:8px;background:#f4e5bc;box-shadow:inset 0 0 10px rgba(70,38,10,.28);cursor:pointer;";
  const content = `
    <div style="display:flex;justify-content:center;gap:5px;margin:8px auto 16px;">
      ${values.map((value, index) => `<button type="button" data-desk-drawer-index="${index}" aria-label="${index + 1}番目の絵柄" style="${squareStyle}"><img src="${IMAGES.modals[`icon${value}`]}" alt="絵柄${value}" style="display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;"></button>`).join("")}
    </div>
    <p id="mainDeskDrawerGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("机の引き出し", content, [
    {
      text: "OK",
      action: () => {
        const correct = values.every((value, index) => value === MAIN_DESK_DRAWER_ANSWER[index]);
        if (!correct) {
          const guide = document.getElementById("mainDeskDrawerGuide");
          if (guide) guide.textContent = "絵柄が違うようだ。";
          playSE?.("se-error");
          return;
        }
        flags.mainDeskDrawerUnlocked = true;
        playSE?.("se-clear");
        markProgress?.("unlock_main_desk_drawer");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("カチッと音がして、机の引き出しのロックが外れた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-desk-drawer-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.deskDrawerIndex);
      values[index] = (values[index] % 4) + 1;
      flags.mainDeskDrawerIcons = values.slice();
      const img = button.querySelector("img");
      img.src = IMAGES.modals[`icon${values[index]}`];
      img.alt = `絵柄${values[index]}`;
      const guide = document.getElementById("mainDeskDrawerGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function handleMainTableSketchbookClick() {
  if (!hasItem("pencil")) {
    updateMessage("スケッチブックがある");
    return;
  }

  showModal("スケッチブック", "<p>鉛筆で絵を書いて見ますか？</p>", [
    { text: "描く", action: showSketchbookDrawingChoices },
    { text: "閉じる", action: "close" },
  ]);
  updateMessage("絵を書いて見ますか？");
}

function showSketchbookDrawingChoices() {
  const buttons = [
    { text: "適当に描く", action: () => drawSketchbookPicture("picFailure") },
  ];

  if (hasItem("picNikumanOld")) {
    buttons.push({
      text: "肉まんの絵に挑戦する",
      action: () => {
        if (hasItem("picNikuman")) {
          closeModal();
          updateMessage("この絵はさっき書いたな・・・");
          return;
        }
        drawSketchbookPicture("picNikuman");
      },
    });
  }
  if (hasItem("picJellyOld")) {
    buttons.push({ text: "ゼリーの絵に挑戦する", action: () => drawSketchbookPicture("picJelly") });
  }

  buttons.push({ text: "閉じる", action: "close" });
  showModal("何を描きますか？", "", buttons, null, { columnButtons: true });
}

function drawSketchbookPicture(itemId) {
  const pictureNames = {
    picFailure: "適当に描いた絵",
    picNikuman: "完成した肉まんの絵",
    picJelly: "完成したゼリーの絵",
  };
  const title = pictureNames[itemId];

  playSE?.("se-suribachi");
  showModal("シュシュシュシュ・・・", "", []);

  setTimeout(() => {
    if (itemId === "picFailure") {
      getMainFlags().thrownGomi = true;
      renderCanvasRoom?.();
    }
    if (itemId !== "picFailure" && !hasItem(itemId)) addItem(itemId);
    const discardedMessage = itemId === "picFailure"
      ? '<p style="margin:12px 0 0;text-align:center;">（絵を丸めて投げ捨てた）</p>'
      : "";
    showModal(
      title,
      `<img src="${IMAGES.items[itemId]}" alt="${title}" style="display:block;width:min(78vw,480px);max-height:68vh;object-fit:contain;margin:0 auto;">${discardedMessage}`,
      [{ text: "閉じる", action: "close" }],
      null,
      { contentClass: "showobj-modal" },
    );
    updateMessage(
      itemId === "picFailure"
        ? `${title}ができた。（絵を丸めて投げ捨てた）`
        : `${title}ができた。`,
    );
  }, 700);
}

function showMainDeskBoxPuzzle() {
  const flags = getMainFlags();
  if (flags.mainDeskBoxUnlocked) {
    acquireItemOnce(
      "foundPicJelly",
      "picJelly",
      "箱の中にゼリーの絵がある",
      IMAGES.items.picJelly,
      "ゼリーの絵を手に入れた。",
    );
    return;
  }

  const content = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin:8px auto 14px;">
      <label for="mainDeskBoxAnswer" style="font-weight:700;">英字を入力</label>
      <input id="mainDeskBoxAnswer" type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="20" style="box-sizing:border-box;width:min(72vw,320px);padding:10px 12px;border:2px solid #76502d;border-radius:6px;background:#fff;color:#222;font-size:1.2rem;text-align:center;">
      <p id="mainDeskBoxGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
    </div>
  `;

  const checkAnswer = () => {
    const input = document.getElementById("mainDeskBoxAnswer");
    if ((input?.value || "").trim().toLowerCase() !== "jelly") {
      const guide = document.getElementById("mainDeskBoxGuide");
      if (guide) guide.textContent = "英字が違うようだ。";
      playSE?.("se-error");
      return;
    }
    flags.mainDeskBoxUnlocked = true;
    playSE?.("se-kachi");
    closeModal();
    updateMessage("カチッと音がして、机の上の箱の鍵が開いた。");
  };

  showModal(
    "机の上の箱",
    content,
    [
      { text: "OK", action: checkAnswer },
      { text: "閉じる", action: "close" },
    ],
  );
  document.getElementById("mainDeskBoxAnswer")?.focus();
}

function showMainWindowDiary() {
  const content = `
    <article style="box-sizing:border-box;width:min(82vw,520px);max-height:65vh;overflow-y:auto;margin:0 auto;padding:clamp(24px,5vw,42px);border:1px solid #b79b65;border-radius:3px;background-color:#f3e6bd;background-image:linear-gradient(rgba(126,91,42,.055) 1px,transparent 1px),radial-gradient(circle at 18% 12%,rgba(255,255,255,.55),transparent 36%),radial-gradient(circle at 82% 88%,rgba(119,77,28,.12),transparent 42%);background-size:100% 1.85em,100% 100%,100% 100%;box-shadow:inset 0 0 28px rgba(87,54,17,.16),0 5px 18px rgba(0,0,0,.28);color:#3f2c1c;font-family:'Yu Mincho','Hiragino Mincho ProN',serif;line-height:1.85;text-align:left;">
      <section>
        <p style="margin:0 0 .45em;font-weight:800;">十月五日</p>
        <p style="margin:0;">創作に集中するため、まず日々の食事をどうにかしたい。<br>絵に描いたものが、そのまま現れればよいのだが。</p>
      </section>
      <section style="margin-top:2em;">
        <p style="margin:0 0 .45em;font-weight:800;">三月二十八日</p>
        <p style="margin:0;">体が熱い。食欲もない。<br>冷たいものなら、少しは喉を通るだろうか。</p>
      </section>
    </article>
  `;
  showModal(
    "日記",
    content,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );
  updateMessage("日記を読んだ。");
}

function handleMainDeskBedTray() {
  const flags = getMainFlags();
  const placedFood = flags.bedTrayFood;

  if (gameState.fx?.ghostJelly) {
    updateMessage("おばけがゼリーを見つめている……。");
    return;
  }

  if (["nikuman", "jelly"].includes(placedFood)) {
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいで、お盆から戻せない。");
      return;
    }
    flags.bedTrayFood = null;
    addItem(placedFood);
    renderCanvasRoom?.();
    updateMessage(placedFood === "nikuman" ? "お盆から肉まんを取った。" : "お盆からゼリーを取った。");
    return;
  }

  const selectedFood = gameState.selectedItem;
  if (!["nikuman", "jelly"].includes(selectedFood)) {
    updateMessage("ベッドの上にお盆がある。食べ物を置けそうだ。");
    return;
  }

  if (selectedFood === "jelly" && !flags.ghostTookJelly) {
    flags.bedTrayFood = "jelly";
    removeItem("jelly");
    renderCanvasRoom?.();
    playMainDeskGhostJellyEvent();
    return;
  }

  flags.bedTrayFood = selectedFood;
  removeItem(selectedFood);
  renderCanvasRoom?.();
  updateMessage(selectedFood === "nikuman" ? "お盆に肉まんを置いた。" : "お盆にゼリーを置いた。");
}

function playMainDeskGhostJellyEvent() {
  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;
  fx.ghostJelly = { roomId: "mainDesk", phase: "appearing", progress: 0, jellyPicked: false };
  playSE?.("se-obake-tojo");
  updateMessage("お盆にゼリーを置いた。何かが現れた……。");

  const duration = 2000;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.ghostJelly;
    if (!currentFx || currentFx.phase !== "appearing") return;

    currentFx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();

    if (currentFx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    currentFx.phase = "waiting";
    currentFx.progress = 1;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
  };
  requestAnimationFrame(tick);
}

function handleMainDeskGhostClick() {
  if (gameState.fx?.ghostJelly?.phase !== "waiting") return;

  showModal(
    "？？？",
    `<img src="${IMAGES.items.ghost}" class="showobj-image" alt="正体不明のおばけ"><p style="margin:14px 0 0;text-align:center;font-weight:800;">お花が咲いたおばけだ</p>`,
    [{ text: "閉じる", action: "close" }],
    startMainDeskGhostJellyDeparture,
    { contentClass: "showobj-modal" },
  );
  updateMessage("謎のおばけがゼリーを見つめている。");
}

function startMainDeskGhostJellyDeparture() {
  const ghostFx = gameState.fx?.ghostJelly;
  if (!ghostFx || ghostFx.phase !== "waiting") return;

  ghostFx.phase = "departing";
  ghostFx.progress = 0;
  gameState.fx.lockInput = true;
  const duration = 3000;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.ghostJelly;
    if (!currentFx || currentFx.phase !== "departing") return;

    currentFx.progress = Math.min(1, (now - start) / duration);
    if (currentFx.progress >= 0.52 && !currentFx.jellyPicked) {
      currentFx.jellyPicked = true;
      getMainFlags().bedTrayFood = null;
    }
    renderCanvasRoom?.();

    if (currentFx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.ghostJelly;
    gameState.fx.lockInput = false;
    const flags = getMainFlags();
    flags.bedTrayFood = null;
    flags.ghostTookJelly = true;
    renderCanvasRoom?.();
    updateMessage("おばけはゼリーを持って消えていった。");
  };
  requestAnimationFrame(tick);
}

function handleMainDoorExit() {
  const flags = getMainFlags();

  if (flags.mainDoorUnlocked) {
    if (gameState.fx?.ghostJelly) {
      const message = "なぜかドアを開ける手に力が入らない・・・";
      showModal(
        "視線を感じる。",
        `<p style="margin:0;text-align:center;font-weight:800;line-height:1.8;">${message}</p>`,
        [{ text: "閉じる", action: "close" }],
      );
      updateMessage(message);
      return;
    }

    if (hasItem("jelly")) {
      const message = "ドアを開ける手に力が入らない・・・";
      showModal(
        "ひんやりとした冷気を感じる。",
        `<p style="margin:0;text-align:center;font-weight:800;line-height:1.8;">${message}</p>`,
        [{ text: "閉じる", action: "close" }],
      );
      updateMessage(message);
      return;
    }

    travelWithSteps(flags.ghostTookJelly ? "trueEnd" : "end");
    return;
  }

  if (gameState.selectedItem !== "key") {
    updateMessage("ドアにはカギがかかっている");
    return;
  }

  flags.mainDoorUnlocked = true;
  removeItem("key");
  playSE?.("se-gacha");
  showModal(
    "カギでドアのロックを開けた",
    `<img src="${IMAGES.modals.doorUnlock}" class="showobj-image" alt="カギでドアのロックを開けた">`,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );
  updateMessage("カギでドアのロックを開けた。");
}

function showMachineRoomUpperCabinet() {
  const flags = getMainFlags();
  const hasPaper = !flags.foundPicNikumanOld;
  const imageId = `machineInner_${Date.now()}`;

  showModal(
    "食器棚の上扉",
    `<img id="${imageId}" src="${hasPaper ? IMAGES.modals.machineInnerPaper : IMAGES.modals.machineInner}" alt="食器棚の中" style="display:block;width:min(78vw,480px);max-height:68vh;object-fit:contain;margin:0 auto;${hasPaper ? "cursor:pointer;" : ""}">`,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );

  if (!hasPaper) {
    updateMessage("食器棚の中にはもう何もない。");
    return;
  }

  document.getElementById(imageId)?.addEventListener("click", (event) => {
    if (flags.foundPicNikumanOld) return;
    flags.foundPicNikumanOld = true;
    addItem("picNikumanOld");
    event.currentTarget.src = IMAGES.modals.machineInner;
    event.currentTarget.style.cursor = "default";
    updateMessage("古びた肉まんの絵を手に入れた。");
  }, { once: true });
}

function handleMachineRoomSlot() {
  const itemId = gameState.selectedItem;
  const configs = {
    picNikumanOld: {
      title: "古びた肉まんの絵を差し込んでみた。",
      image: IMAGES.modals.oldNikumanInto,
      consume: false,
      result: showOldNikumanBadEnd,
    },
    picNikuman: {
      title: "肉まんの絵を差し込んでみた。",
      image: IMAGES.modals.nikumanInto,
      consume: false,
      outputItem: "nikuman",
      blockIfOwned: true,
      outputTitle: "肉まんが出てきた",
      outputMessage: "肉まんを手に入れた。",
    },
    picJelly: {
      title: "ゼリーの絵を差し込んでみた。",
      image: IMAGES.modals.jellyInto,
      consume: true,
      outputItem: "jelly",
      outputTitle: "ゼリーが出てきた",
      outputMessage: "ゼリーを手に入れた。",
    },
  };
  const config = configs[itemId];

  if (!config) {
    updateMessage("スリットがある。紙を差し込めそうだ");
    return;
  }

  if (config.blockIfOwned && hasItem(config.outputItem)) {
    updateMessage("このアイテムは既に持っている");
    return;
  }

  playSE?.("se-paper");
  const content = `<img src="${config.image}" class="showobj-image" alt="${config.title}">`;
  showModal(
    config.title,
    content,
    [{ text: "閉じる", action: "close" }],
    () => {
      if (config.consume) removeItem(itemId);
      playMachineCabinetActivation(() => {
        if (config.result) {
          config.result();
          return;
        }
        addItem(config.outputItem);
        showModal(
          config.outputTitle,
          `<img src="${IMAGES.items[config.outputItem]}" class="showobj-image" alt="${config.outputTitle}">`,
          [{ text: "閉じる", action: "close" }],
          null,
          { contentClass: "showobj-modal" },
        );
        updateMessage(config.outputMessage);
      });
    },
    { contentClass: "showobj-modal" },
  );
}

function playMachineCabinetActivation(onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  const flash = document.getElementById("fxFlash");
  fx.lockInput = true;
  playSE?.("se-gogogo");

  canvas.getAnimations?.().forEach((animation) => animation.cancel());
  canvas.animate(
    [
      { transform: "translate(0,0)", filter: "brightness(1)" },
      { transform: "translate(-7px,2px)", filter: "brightness(2.8)", offset: 0.18 },
      { transform: "translate(7px,-2px)", filter: "brightness(1.5)", offset: 0.34 },
      { transform: "translate(-6px,-1px)", filter: "brightness(2.5)", offset: 0.5 },
      { transform: "translate(6px,2px)", filter: "brightness(1.4)", offset: 0.68 },
      { transform: "translate(-3px,0)", filter: "brightness(2)", offset: 0.84 },
      { transform: "translate(0,0)", filter: "brightness(1)" },
    ],
    { duration: 1500, easing: "ease-in-out" },
  );
  flash?.animate(
    [
      { opacity: 0, background: "rgba(255,245,180,0)" },
      { opacity: 0.55, background: "rgba(255,245,180,.8)", offset: 0.35 },
      { opacity: 0.18, background: "rgba(255,245,180,.3)", offset: 0.7 },
      { opacity: 0, background: "rgba(255,245,180,0)" },
    ],
    { duration: 1500, easing: "ease-out" },
  );

  setTimeout(() => {
    fx.lockInput = false;
    onDone?.();
  }, 1500);
}

function showOldNikumanBadEnd() {
  pauseBGM();
  playSE?.("se-fire");
  const content = `
    <div class="modal-anim">
      <img src="${IMAGES.modals.badendBefore}" alt="古びた肉まんの絵が反応する">
      <img src="${IMAGES.modals.badend}" alt="ぶち模様の肉まんを召喚">
    </div>
    <p style="text-align:center;font-weight:800;line-height:1.8;margin-top:14px;">
      あなたは気が遠くなり意識を失った。
    </p>
  `;
  showModal(
    "【BAD END】古びた肉まんの悪夢<br>恐ろしい顔の肉まんが飛び出してきた…！",
    content,
    [{ text: "最初から", action: "restart" }],
    null,
    { contentClass: "showobj-modal" },
  );
  updateMessage("BAD END: 古びた肉まんの悪夢");
}

function showMainDoorSecondDrawerPuzzle() {
  const flags = getMainFlags();
  if (flags.mainDoorSecondDrawerUnlocked) {
    if (!flags.foundFlower) playSE?.("se-hikidashi");
    acquireItemOnce(
      "foundFlower",
      "flower",
      "タンポポの造花",
      IMAGES.modals.flower,
      "タンポポの造花を手に入れた。",
    );
    return;
  }

  const saved = Array.isArray(flags.mainDoorSecondDrawerIcons) ? flags.mainDoorSecondDrawerIcons : [];
  const values = [0, 1, 2, 3].map((index) =>
    MAIN_DOOR_SECOND_DRAWER_ICONS.includes(saved[index]) ? saved[index] : "Thunder",
  );
  flags.mainDoorSecondDrawerIcons = values.slice();

  const squareStyle = "box-sizing:border-box;width:min(20vw,120px);aspect-ratio:1;padding:8px;border:2px solid #bbb;border-radius:4px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2);cursor:pointer;";
  const content = `
    <div style="display:flex;justify-content:center;gap:6px;margin:8px auto 16px;">
      ${values.map((value, index) => `<button type="button" data-main-door-second-drawer-index="${index}" aria-label="${index + 1}番目の絵柄" style="${squareStyle}"><img src="${IMAGES.modals[`icon${value}`]}" alt="${value}" style="display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;"></button>`).join("")}
    </div>
    <p id="mainDoorSecondDrawerGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("引き出し二段目", content, [
    {
      text: "OK",
      action: () => {
        const correct = values.every((value, index) => value === MAIN_DOOR_SECOND_DRAWER_ANSWER[index]);
        if (!correct) {
          const guide = document.getElementById("mainDoorSecondDrawerGuide");
          if (guide) guide.textContent = "絵柄が違うようだ。";
          playSE?.("se-error");
          return;
        }

        flags.mainDoorSecondDrawerUnlocked = true;
        playSE?.("se-clear");
        markProgress?.("unlock_main_door_second_drawer");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("カチッと音がして、引き出し二段目のロックが外れた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-main-door-second-drawer-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.mainDoorSecondDrawerIndex);
      const currentIconIndex = MAIN_DOOR_SECOND_DRAWER_ICONS.indexOf(values[index]);
      values[index] = MAIN_DOOR_SECOND_DRAWER_ICONS[(currentIconIndex + 1) % MAIN_DOOR_SECOND_DRAWER_ICONS.length];
      flags.mainDoorSecondDrawerIcons = values.slice();

      const img = button.querySelector("img");
      img.src = IMAGES.modals[`icon${values[index]}`];
      img.alt = values[index];
      const guide = document.getElementById("mainDoorSecondDrawerGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function showMainDoorThirdDrawerPuzzle() {
  const flags = getMainFlags();
  if (flags.mainDoorThirdDrawerUnlocked) {
    if (!flags.foundUchiwa) playSE?.("se-hikidashi");
    acquireItemOnce(
      "foundUchiwa",
      "uchiwa",
      "うちわを見つけた",
      IMAGES.modals.uchiwa,
      "うちわを手に入れた。",
    );
    return;
  }

  const savedDigits = Array.isArray(flags.mainDoorThirdDrawerDigits)
    ? flags.mainDoorThirdDrawerDigits
    : [0, 0, 0, 0];
  const digits = [0, 1, 2, 3].map((index) => {
    const digit = Number(savedDigits[index]);
    return Number.isInteger(digit) && digit >= 0 && digit <= 9 ? digit : 0;
  });
  flags.mainDoorThirdDrawerDigits = digits.slice();

  const digitStyle = "box-sizing:border-box;width:min(18vw,90px);aspect-ratio:1;padding:0;border:2px solid #777;border-radius:5px;background:#fff;color:#111;font-size:2.3rem;font-weight:900;cursor:pointer;";
  const content = `
    <div style="display:grid;grid-template-columns:repeat(4,minmax(54px,90px));gap:8px;justify-content:center;margin:8px auto 16px;">
      ${digits.map((digit, index) => `<button type="button" data-main-door-third-drawer-digit="${index}" aria-label="${index + 1}桁目" style="${digitStyle}">${digit}</button>`).join("")}
    </div>
    <p id="mainDoorThirdDrawerGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("引き出し三段目の数字ロック", content, [
    {
      text: "OK",
      action: () => {
        if (digits.join("") !== MAIN_DOOR_THIRD_DRAWER_ANSWER) {
          const guide = document.getElementById("mainDoorThirdDrawerGuide");
          if (guide) guide.textContent = "数字が違うようだ。";
          playSE?.("se-error");
          return;
        }

        flags.mainDoorThirdDrawerUnlocked = true;
        playSE?.("se-clear");
        markProgress?.("unlock_main_door_third_drawer");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("カチッと音がして、引き出し三段目のロックが外れた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-main-door-third-drawer-digit]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.mainDoorThirdDrawerDigit);
      digits[index] = (digits[index] + 1) % 10;
      flags.mainDoorThirdDrawerDigits = digits.slice();
      button.textContent = String(digits[index]);
      const guide = document.getElementById("mainDoorThirdDrawerGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function showMainDoorCabinetPuzzle() {
  const flags = getMainFlags();
  if (flags.mainDoorCabinetUnlocked) {
    handleUnlockedMainDoorCabinet(flags);
    return;
  }

  const savedLetters = Array.isArray(flags.mainDoorCabinetLetters)
    ? flags.mainDoorCabinetLetters
    : ["d", "d", "d", "d"];
  const letters = [0, 1, 2, 3].map((index) =>
    MAIN_DOOR_CABINET_LETTERS.includes(savedLetters[index]) ? savedLetters[index] : "d",
  );
  flags.mainDoorCabinetLetters = letters.slice();

  const panelStyle = "box-sizing:border-box;width:min(18vw,90px);aspect-ratio:1;padding:0;border:2px solid #aaa;border-radius:4px;background:#fff;color:#111;font-size:2.3rem;font-weight:700;cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,.18);";
  const content = `
    <img src="${IMAGES.modals.cabinet}" alt="文字ロックの付いたキャビネット" style="display:block;width:min(78vw,480px);max-height:42vh;object-fit:contain;margin:0 auto 14px;">
    <div style="display:grid;grid-template-columns:repeat(4,minmax(54px,90px));gap:8px;justify-content:center;margin:8px auto 16px;">
      ${letters.map((letter, index) => `<button type="button" data-main-door-cabinet-letter="${index}" aria-label="${index + 1}文字目" style="${panelStyle}">${letter}</button>`).join("")}
    </div>
    <p id="mainDoorCabinetGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("キャビネットの文字ロック", content, [
    {
      text: "OK",
      action: () => {
        if (letters.join("") !== MAIN_DOOR_CABINET_ANSWER) {
          const guide = document.getElementById("mainDoorCabinetGuide");
          if (guide) guide.textContent = "文字が違うようだ。";
          playSE?.("se-error");
          return;
        }

        flags.mainDoorCabinetUnlocked = true;
        playSE?.("se-clear");
        markProgress?.("unlock_main_door_cabinet");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("カチッと音がして、キャビネットのロックが外れた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-main-door-cabinet-letter]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.mainDoorCabinetLetter);
      const currentIndex = MAIN_DOOR_CABINET_LETTERS.indexOf(letters[index]);
      letters[index] = MAIN_DOOR_CABINET_LETTERS[(currentIndex + 1) % MAIN_DOOR_CABINET_LETTERS.length];
      flags.mainDoorCabinetLetters = letters.slice();
      button.textContent = letters[index];
      const guide = document.getElementById("mainDoorCabinetGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function handleUnlockedMainDoorCabinet(flags) {
  if (!flags.foundDollBear) {
    flags.foundDollBear = true;
    playSE?.("se-door-close");
    addItem("dollBear");
    showModal(
      "クマのぬいぐるみを見つけた",
      `<img src="${IMAGES.modals.dollBearFound}" alt="キャビネットの中で見つけたクマのぬいぐるみ" style="display:block;width:min(78vw,480px);max-height:68vh;object-fit:contain;margin:0 auto;">`,
      [{ text: "閉じる", action: "close" }],
      null,
      { contentClass: "showobj-modal" },
    );
    updateMessage("クマのぬいぐるみを手に入れた。");
    return;
  }

  const imageId = `mainDoorCabinetInner_${Date.now()}`;
  showModal(
    "キャビネットの中",
    `<img id="${imageId}" src="${IMAGES.modals.cabinetInner1}" alt="キャビネットの内部" style="display:block;width:min(78vw,480px);max-height:68vh;object-fit:contain;margin:0 auto;cursor:pointer;">`,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );

  const image = document.getElementById(imageId);
  image?.addEventListener("click", () => {
    image.src = IMAGES.modals.cabinetInner2;
    image.alt = "奥を調べた後のキャビネット内部";
  }, { once: true });
  updateMessage("キャビネットの中を調べた。");
}

function handleMainDeskWindowClick() {
  if (gameState.selectedItem === "mapBefore") {
    getMainFlags().unlockMachineDoorHintShown = true;
    const content = `
      <div class="modal-anim moda-anim">
        <img src="${IMAGES.modals.mapWindow}" alt="窓のテープ跡に紙を重ねる">
        <img src="${IMAGES.modals.mapWindowZoom}" alt="窓に重ねた紙を拡大して見る">
      </div>
    `;
    showModal(
      "窓のテープの跡に紙を重ねてみた",
      content,
      [{ text: "閉じる", action: "close" }],
      null,
      { contentClass: "showobj-modal" },
    );
    updateMessage("窓のテープの跡に紙を重ねてみた");
    return;
  }

  const changed = !!getMainFlags().windowChanged;
  const useOperaGlass = gameState.selectedItem === "operaGlass";
  const image = useOperaGlass
    ? changed
      ? IMAGES.modals.windowAfterZoom
      : IMAGES.modals.windowZoom
    : changed
      ? IMAGES.modals.windowAfter
      : IMAGES.modals.window;
  const title = useOperaGlass ? "双眼鏡で窓の外を見た" : "窓の外を見た";
  const message = useOperaGlass ? "双眼鏡で窓の外を眺めた。" : "窓の外を眺めた。";
  showObj(null, title, image, message);
}

function showMachineDoorPuzzle() {
  const flags = getMainFlags();
  if (flags.unlockMachineDoor) return;

  const savedIcons = Array.isArray(flags.machineDoorIcons) ? flags.machineDoorIcons : [];
  const icons = [0, 1, 2, 3].map((index) =>
    MACHINE_DOOR_ICONS.includes(savedIcons[index]) ? savedIcons[index] : "tanpopo",
  );
  flags.machineDoorIcons = icons.slice();

  const iconKey = (icon) => `icon${icon.charAt(0).toUpperCase()}${icon.slice(1)}`;
  const buttonStyle = "position:relative;z-index:2;box-sizing:border-box;width:min(20vw,110px);aspect-ratio:1;padding:5px;border:3px solid #6d5134;border-radius:7px;background:#fff;box-shadow:0 2px 7px rgba(0,0,0,.32);cursor:pointer;";
  const content = `
    <div style="position:relative;width:min(90vw,620px);margin:0 auto 12px;overflow:hidden;border-radius:5px;">
      <img src="${IMAGES.modals.wood}" alt="木製の扉" style="display:block;width:100%;height:auto;">
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 3%;">
        <span aria-hidden="true" style="position:absolute;left:10%;right:10%;top:50%;height:5px;transform:translateY(-50%);background:#372719;box-shadow:0 1px 2px rgba(255,255,255,.35);"></span>
        <div style="position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,minmax(48px,110px));gap:6px;justify-content:center;">
          ${icons.map((icon, index) => `<button type="button" data-machine-door-icon="${index}" aria-label="${index + 1}番目の絵柄" style="${buttonStyle}"><img src="${IMAGES.modals[iconKey(icon)]}" alt="${icon}" style="display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;"></button>`).join("")}
        </div>
      </div>
    </div>
    <p id="machineDoorPuzzleGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  const checkAnswer = () => {
    if (!icons.every((icon, index) => icon === MACHINE_DOOR_ANSWER[index])) {
      const guide = document.getElementById("machineDoorPuzzleGuide");
      if (guide) guide.textContent = "絵柄が違うようだ。";
      playSE?.("se-error");
      return;
    }
    flags.unlockMachineDoor = true;
    playSE?.("se-gogogo");
    markProgress?.("unlock_machine_door");
    closeModal();
    renderCanvasRoom?.();
    updateMessage("隠し扉が開いた。");
  };

  showModal(
    "壁をよく見ると、ボタンが並んでいる",
    content,
    [
      {
        text: "OK",
        action: checkAnswer,
        style: "background:#76502d;color:#fff;border:2px solid #4d321c;box-shadow:0 2px 5px rgba(0,0,0,.3);",
      },
      { text: "閉じる", action: "close" },
    ],
    null,
    { contentClass: "showobj-modal" },
  );

  document.querySelectorAll("[data-machine-door-icon]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.machineDoorIcon);
      const currentIndex = MACHINE_DOOR_ICONS.indexOf(icons[index]);
      icons[index] = MACHINE_DOOR_ICONS[(currentIndex + 1) % MACHINE_DOOR_ICONS.length];
      flags.machineDoorIcons = icons.slice();
      const image = button.querySelector("img");
      image.src = IMAGES.modals[iconKey(icons[index])];
      image.alt = icons[index];
      const guide = document.getElementById("machineDoorPuzzleGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function showMainDeskLetter() {
  playSE?.("se-hikidashi");
  const imageId = "mainDeskLetterImage";
  const content = `<img id="${imageId}" src="${IMAGES.modals.letter}" alt="封筒の中の手紙" style="max-width:100%;max-height:70vh;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto;cursor:pointer;">`;

  showModal("書信がある", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
  updateMessage("書信がある。");

  const image = document.getElementById(imageId);
  image?.addEventListener("click", () => {
    image.src = IMAGES.modals.letterBack;
    image.alt = "書信の裏面";
    image.style.cursor = "default";
    updateMessage("書信の裏面を確認した。");
  }, { once: true });
}

function handleMainTableEaselClick() {
  if (gameState.selectedItem !== "picKids") {
    updateMessage("イーゼルがある。紙を挟めそうだ");
    return;
  }

  const flags = getMainFlags();
  flags.picKidsSet = true;
  removeItem("picKids");
  playSE?.("se-paper");
  markProgress?.("set_pic_kids_on_easel");
  renderCanvasRoom();
  updateMessage("イーゼルに子供が描かれたスケッチを置いた。");
}

function handleMainDeskVaseClick() {
  const flags = getMainFlags();
  if (flags.vaseState === "flower") {
    showMainDeskFlowerSetModal();
    return;
  }

  if (flags.vaseState === "seedHead") {
    if (gameState.selectedItem === "uchiwa") {
      showWatageBlowModal();
      return;
    }
    showObj(null, "花瓶に挿したタンポポの綿毛", IMAGES.modals.watageSet, "花瓶に挿したタンポポの綿毛を眺めた。");
    return;
  }

  if (flags.vaseState === "blown") {
    showObj(null, "吹き飛ばされたタンポポの綿毛", IMAGES.modals.watageBlownAfter, "吹き飛ばされたタンポポの綿毛を眺めた。");
    return;
  }

  if (gameState.selectedItem !== "flower") {
    showObj(null, "花瓶", IMAGES.modals.notSet, "花瓶を眺めた。");
    return;
  }

  flags.vaseState = "flower";
  removeItem("flower");
  markProgress?.("set_flower_in_vase");
  renderCanvasRoom?.();
  updateMessage("花瓶にタンポポの造花を挿した。");
}

function showWatageBlowModal() {
  const imageId = "watageBlowModalImage";
  const content = `
    <style>
      @keyframes waveUchiwa {
        0%, 100% { transform:rotate(-14deg) translateY(2%); }
        50% { transform:rotate(18deg) translateY(-3%); }
      }
      .watage-blow-scene { position:relative;width:min(82vw,520px);margin:0 auto;overflow:hidden; }
      .watage-blow-scene > img:first-child { display:block;width:100%;height:auto; }
      .watage-blow-uchiwa {
        position:absolute;right:3%;bottom:5%;width:38%;height:auto;
        transform-origin:85% 88%;animation:waveUchiwa .34s ease-in-out 5;
        filter:drop-shadow(0 5px 6px rgba(0,0,0,.32));
      }
    </style>
    <div class="watage-blow-scene">
      <img id="${imageId}" src="${IMAGES.modals.watageSet}" alt="花瓶に挿したタンポポの綿毛">
      <img class="watage-blow-uchiwa" src="${IMAGES.items.uchiwa}" alt="綿毛を扇ぐうちわ">
    </div>
  `;

  showModal(
    "タンポポの綿毛",
    content,
    [{ text: "閉じる", action: "close" }],
    () => {
      clearUsingItem(true);
      playWatageFlightFx();
    },
    { contentClass: "showobj-modal" },
  );

  const closeButton = document.querySelector("#modalClose .modal-close-btn");
  if (closeButton) closeButton.disabled = true;
  updateMessage("うちわでタンポポの綿毛を扇いだ。");

  setTimeout(() => {
    const image = document.getElementById(imageId);
    if (!image) return;
    image.src = IMAGES.modals.watageBlown;
    image.alt = "綿毛が吹き飛ばされたタンポポ";
    document.querySelector(".watage-blow-uchiwa")?.remove();
    getMainFlags().vaseState = "blown";
    renderCanvasRoom?.();
    if (closeButton) closeButton.disabled = false;
    playSE?.("se-nami");
    updateMessage("タンポポの綿毛が吹き飛んだ。");
  }, 1800);
}

function showMainDeskFlowerSetModal() {
  const flowers = [
    { position: "左", left: 27.5, top: 26.5, size: 22 },
    { position: "左", left: 27.5, top: 26.5, size: 22 },
    { position: "右", left: 75.5, top: 28.5, size: 21 },
    { position: "下", left: 53.5, top: 46.5, size: 21 },
    { position: "上", left: 50.5, top: 10.5, size: 23 },
  ];
  const content = `
    <style>
      @keyframes flowerSetGlow {
        0%, 100% { opacity:0; transform:translate(-50%,-50%) scale(.82); }
        35%, 65% { opacity:1; transform:translate(-50%,-50%) scale(1.12); }
      }
      .flower-set-glow {
        position:absolute;
        aspect-ratio:1;
        border-radius:50%;
        pointer-events:none;
        opacity:0;
        background:radial-gradient(circle, rgba(255,255,205,.96) 0%, rgba(255,226,55,.62) 38%, rgba(255,190,0,.18) 62%, transparent 74%);
        box-shadow:0 0 18px 8px rgba(255,226,70,.8), 0 0 36px 14px rgba(255,177,0,.42);
        mix-blend-mode:screen;
        animation:flowerSetGlow 1s ease-in-out 1 both;
      }
      @media (prefers-reduced-motion: reduce) {
        .flower-set-glow { animation:none; opacity:0; }
      }
    </style>
    <div style="position:relative;width:min(82vw,520px);margin:0 auto 12px;overflow:hidden;">
      <img src="${IMAGES.modals.flowerSet}" alt="花瓶に挿した4輪のタンポポの造花" style="display:block;width:100%;height:auto;">
      ${flowers.map((flower, index) => `<span class="flower-set-glow" aria-hidden="true" data-position="${flower.position}" style="left:${flower.left}%;top:${flower.top}%;width:${flower.size}%;animation-delay:${index}s;"></span>`).join("")}
    </div>
  `;

  showModal("花瓶のタンポポ", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
  updateMessage("花瓶にタンポポの造花が挿してある。");
}

function showUnderDeskPicBearPuzzle() {
  const flags = getMainFlags();
  if (!flags.watageReachedStorage) {
    updateMessage("机の下に収納がある。");
    return;
  }

  if (flags.picBearPuzzleSolved) {
    handleUnlockedUnderDeskStorage(flags);
    return;
  }

  playSE?.("se-hikidashi");

  const defaultPieces = [8, 1, 5, 6, 3, 0, 7, 4, 2];
  const previousDefaultPieces = [1, 2, 0, 4, 5, 3, 7, 8, 6];
  const savedPieces = Array.isArray(flags.picBearPuzzlePieces) ? flags.picBearPuzzlePieces.map(Number) : [];
  const validPieces = savedPieces.length === 9
    && new Set(savedPieces).size === 9
    && savedPieces.every((piece) => Number.isInteger(piece) && piece >= 0 && piece < 9);
  const usesPreviousDefault = validPieces && savedPieces.every((piece, index) => piece === previousDefaultPieces[index]);
  const pieces = validPieces && !usesPreviousDefault ? savedPieces.slice() : defaultPieces.slice();
  flags.picBearPuzzlePieces = pieces.slice();
  let selectedIndex = null;

  const content = `
    <div id="picBearPuzzleGrid" style="display:grid;grid-template-columns:repeat(3,1fr);width:min(78vw,480px);aspect-ratio:1;margin:0 auto 12px;border:4px solid #76502d;background:#fff;">
      ${pieces.map((piece, index) => createPicBearPuzzleTile(piece, index)).join("")}
    </div>
    <p id="picBearPuzzleGuide" style="min-height:1.5em;margin:0;text-align:center;">2枚の絵を順番に選んで入れ替えよう。</p>
  `;

  showModal("収納の絵合わせ", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });

  const refreshTiles = () => {
    document.querySelectorAll("[data-pic-bear-tile-index]").forEach((tile) => {
      const index = Number(tile.dataset.picBearTileIndex);
      const piece = pieces[index];
      const col = piece % 3;
      const row = Math.floor(piece / 3);
      tile.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
      tile.style.boxShadow = selectedIndex === index ? "inset 0 0 0 5px #ffd700" : "none";
      tile.setAttribute("aria-pressed", selectedIndex === index ? "true" : "false");
    });
  };

  document.querySelectorAll("[data-pic-bear-tile-index]").forEach((tile) => {
    tile.addEventListener("click", () => {
      const index = Number(tile.dataset.picBearTileIndex);
      if (selectedIndex === null) {
        selectedIndex = index;
        playSE?.("se-click");
        refreshTiles();
        return;
      }

      if (selectedIndex === index) {
        selectedIndex = null;
        refreshTiles();
        return;
      }

      [pieces[selectedIndex], pieces[index]] = [pieces[index], pieces[selectedIndex]];
      selectedIndex = null;
      flags.picBearPuzzlePieces = pieces.slice();
      refreshTiles();

      if (!pieces.every((piece, pieceIndex) => piece === pieceIndex)) return;
      flags.picBearPuzzleSolved = true;
      playSE?.("se-clear");
      markProgress?.("solve_under_desk_pic_bear");
      const grid = document.getElementById("picBearPuzzleGrid");
      if (grid) grid.innerHTML = `<img src="${IMAGES.modals.picBear}" alt="完成したクマの絵" style="display:block;width:100%;height:100%;object-fit:contain;grid-column:1/-1;">`;
      const guide = document.getElementById("picBearPuzzleGuide");
      if (guide) guide.textContent = "クマの絵が完成した！";
      updateMessage("クマの絵が完成した！");
    });
  });
}

function handleUnlockedUnderDeskStorage(flags) {
  if (flags.foundUnderDeskMap) {
    showModal(
      "扉の絵は完成している",
      `<img src="${IMAGES.modals.picBear}" alt="完成したクマの絵" style="display:block;width:min(78vw,480px);max-height:68vh;object-fit:contain;margin:0 auto;">`,
      [{ text: "閉じる", action: "close" }],
      null,
      { contentClass: "showobj-modal" },
    );
    updateMessage("絵は完成している");
    return;
  }

  playSE?.("se-door-close");

  if (!flags.foundUnderDeskTategami) {
    flags.foundUnderDeskTategami = true;
    addItem("tategami");
    showModal(
      "謎の輪を見つけた",
      `<img src="${IMAGES.modals.storageUnderDesk1}" alt="机の下の収納にあった謎の輪" style="display:block;width:min(78vw,480px);max-height:68vh;object-fit:contain;margin:0 auto;">`,
      [{ text: "閉じる", action: "close" }],
      null,
      { contentClass: "showobj-modal" },
    );
    updateMessage("謎の輪を見つけた");
    return;
  }

  flags.foundUnderDeskMap = true;
  addItem("mapBefore");
  showModal(
    "よく見ると紙が張り付いている",
    `<img src="${IMAGES.modals.storageUnderDesk2}" alt="机の下の収納に張り付いていた紙" style="display:block;width:min(78vw,480px);max-height:68vh;object-fit:contain;margin:0 auto;">`,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );
  updateMessage("紙を手に入れた");
}

function createPicBearPuzzleTile(piece, index) {
  const col = piece % 3;
  const row = Math.floor(piece / 3);
  return `<button type="button" data-pic-bear-tile-index="${index}" aria-label="絵のピース${index + 1}" aria-pressed="false" style="box-sizing:border-box;min-width:0;border:1px solid rgba(90,60,30,.45);border-radius:0;padding:0;margin:0;cursor:pointer;background-color:#fff;background-image:url('${IMAGES.modals.picBear}');background-size:300% 300%;background-position:${col * 50}% ${row * 50}%;background-repeat:no-repeat;"></button>`;
}

function showMainDeskChairPuzzle() {
  const flags = getMainFlags();
  const solved = !!flags.chairPuzzleSolved;
  const savedInput = Array.isArray(flags.chairPuzzleInput) ? flags.chairPuzzleInput : [];
  flags.chairPuzzleInput = savedInput.slice(0, CHAIR_PUZZLE_ANSWER.length);

  const directionButtons = solved
    ? ""
    : `
      <button type="button" data-chair-direction="up" aria-label="上へ動かす" style="position:absolute;left:42%;top:14%;width:18%;height:30%;border:0;background:transparent;cursor:pointer;"></button>
      <button type="button" data-chair-direction="right" aria-label="右へ動かす" style="position:absolute;left:60%;top:42%;width:28%;height:18%;border:0;background:transparent;cursor:pointer;"></button>
      <button type="button" data-chair-direction="down" aria-label="下へ動かす" style="position:absolute;left:42%;top:60%;width:18%;height:28%;border:0;background:transparent;cursor:pointer;"></button>
      <button type="button" data-chair-direction="left" aria-label="左へ動かす" style="position:absolute;left:14%;top:42%;width:28%;height:18%;border:0;background:transparent;cursor:pointer;"></button>
    `;
  const ball = solved
    ? ""
    : `<div id="chairPuzzleBall" aria-hidden="true" style="position:absolute;left:51%;top:51%;width:18%;aspect-ratio:1;box-sizing:border-box;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle at 32% 28%,#fffce0 0 12%,#e9c85d 34%,#9a671b 72%,#4c2c0c 100%);border:1px solid rgba(65,35,6,.72);box-shadow:inset -3px -4px 6px rgba(55,26,0,.42),0 2px 5px rgba(0,0,0,.45);pointer-events:none;"></div>`;
  const content = `
    <div id="chairPuzzleBoard" style="position:relative;width:min(74vw,520px);margin:0 auto;line-height:0;touch-action:manipulation;user-select:none;">
      <img src="${IMAGES.modals.chair}" alt="十字の切り欠きがある木製椅子" style="display:block;width:100%;height:auto;">
      ${ball}
      ${directionButtons}
    </div>
    <p id="chairPuzzleStatus" style="min-height:1.5em;margin:12px 0 0;text-align:center;line-height:1.5;">${solved ? "中央の球は光になって消えた。" : "十字の方向を選んで球を動かそう。"}</p>
  `;

  showModal("椅子の背もたれ", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
  if (solved) return;

  const board = document.getElementById("chairPuzzleBoard");
  const ballEl = document.getElementById("chairPuzzleBall");
  const status = document.getElementById("chairPuzzleStatus");
  let animating = false;
  const vectors = {
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0],
  };

  board.querySelectorAll("[data-chair-direction]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (animating || flags.chairPuzzleSolved) return;
      animating = true;
      const direction = button.dataset.chairDirection;
      const [vx, vy] = vectors[direction];
      const distance = board.clientWidth * 0.27;
      playSE?.("se-curtain");
      const move = ballEl.animate(
        [
          { transform: "translate(-50%,-50%)", offset: 0 },
          { transform: `translate(-50%,-50%) translate(${vx * distance}px,${vy * distance}px)`, offset: 0.46 },
          { transform: `translate(-50%,-50%) translate(${vx * distance}px,${vy * distance}px)`, offset: 0.58 },
          { transform: "translate(-50%,-50%)", offset: 1 },
        ],
        { duration: 650, easing: "cubic-bezier(.3,.05,.25,1)" },
      );
      try {
        await move.finished;
      } catch (e) {
        animating = false;
        return;
      }

      flags.chairPuzzleInput.push(direction);
      const matches = flags.chairPuzzleInput.every((value, index) => value === CHAIR_PUZZLE_ANSWER[index]);
      if (!matches) {
        flags.chairPuzzleInput = [];
        animating = false;
        return;
      }

      if (flags.chairPuzzleInput.length < CHAIR_PUZZLE_ANSWER.length) {
        animating = false;
        return;
      }

      if (flags.vaseState !== "flower") {
        flags.chairPuzzleInput = [];
        status.textContent = "正しい順に動かしたが、何かが足りないようだ。";
        playSE?.("se-error");
        animating = false;
        return;
      }

      flags.chairPuzzleSolved = true;
      flags.windowChanged = true;
      flags.vaseState = "seedHead";
      flags.chairPuzzleInput = [];
      status.textContent = "球がまばゆく光り始めた。";
      playSE?.("se-clear");
      markProgress?.("solve_main_desk_chair");
      renderCanvasRoom?.();
      playSeasonChangeFlash();
      const vanish = ballEl.animate(
        [
          { opacity: 1, transform: "translate(-50%,-50%) scale(1)", filter: "brightness(1)", boxShadow: "0 0 5px rgba(255,230,100,.5)" },
          { opacity: 1, transform: "translate(-50%,-50%) scale(1.45)", filter: "brightness(3)", boxShadow: "0 0 34px 18px rgba(255,245,165,.95)", offset: 0.58 },
          { opacity: 0, transform: "translate(-50%,-50%) scale(.25)", filter: "brightness(5)", boxShadow: "0 0 54px 26px rgba(255,255,220,0)" },
        ],
        { duration: 1050, easing: "ease-in-out", fill: "forwards" },
      );
      try {
        await vanish.finished;
      } catch (e) { }
      closeModal();
      renderCanvasRoom();
      updateMessage("球は光になって窓のほうに吸い込まれていった。");
    });
  });
}

// ゲーム初期化
function initGame() {
  renderNavigation();
  changeRoom("mainDesk");
  updateInventoryDisplay();
  updateMessage("机の前に立っている");
  try {
    renderStatusIcons();
  } catch (e) { }
}

function resolveAreaMetric(area, key) {
  const value = area[key];
  return typeof value === "function" ? value() : value;
}

function getAreaDrawRect(area, canvas) {
  const baseX = (resolveAreaMetric(area, "x") / 100) * canvas.width;
  const baseY = (resolveAreaMetric(area, "y") / 100) * canvas.height;
  const baseW = (resolveAreaMetric(area, "width") / 100) * canvas.width;
  const baseH = (resolveAreaMetric(area, "height") / 100) * canvas.height;
  let x = baseX;
  let y = baseY;
  let w = baseW;
  let h = baseH;

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
  const arrivedAtEndWithNikuman = roomId === "end" && hasItem("nikuman");

  if (roomId === "end" || roomId === "trueEnd") {
    keepOnlyItemsOnEndingArrival(["operaGlass"]);
  } else if (roomId === "modernEnd") {
    removeItemsOnEndingArrival(["hammer"]);
  }

  gameState.currentRoom = roomId;
  if (roomId === "machineRoom") addNaviItem("machineRoom");
  const room = rooms[roomId];
  if (roomId === "end") {
    const endFlags = gameState.end?.flags || (gameState.end = { flags: { backgroundState: 0 } }).flags;
    endFlags.backgroundState = arrivedAtEndWithNikuman ? 1 : 0;
  }

  // 背景＋アイテム＋クリックエリアをcanvasで全部再描画
  renderCanvasRoom();
  const roomDescription = room.description;
  const msg = room.name && room.name.trim() !== "" ? `${room.name}です。${roomDescription}` : roomDescription;
  if (roomId === "trueEnd") {
    updateMessageHTML(msg);
  } else {
    updateMessage(msg);
  }

  // BGM切替はそのまま
  if (roomId === "trueEnd") {
    changeBGM(S43("yokazeni_hukarete.mp3"));
  } else if (roomId === "end") {
    changeBGM(S43("iikoto_atukana.mp3"));
  } else {
    changeBGM(DEFAULT_BGM);
  }

  // nav

  if (roomId === "trueEnd" || roomId === "end" || roomId === "modernEnd") {
    gameState.openRooms = [];
    // renderNavigation();
  }
  renderNavigation();
}

const END_IDS = new Set(["end", "trueEnd"]);

// ===== changeRoom フック：=====
const _changeRoom_custom = changeRoom;
changeRoom = function (roomId) {
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
  if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
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

  drawShiwakePuzzle(ctx, canvas, roomId);
  drawBoardDoor(ctx, canvas, roomId);
  drawBoardChest(ctx, canvas, roomId);
  drawBoardDesk(ctx, canvas, roomId);
  drawBoardAdmin(ctx, canvas, roomId);

  // アイテム描画（未取得のみ）
  drawRoomItems(ctx, canvas, roomId);
  drawMainDeskGhostJellyFx(ctx, canvas, roomId);
  drawMainDoorLetterStatusFlash(ctx, canvas, roomId);
  drawShiwakeEnvelopeSelection(ctx, canvas, roomId);
  drawClickableAreaGlows(ctx, canvas, roomId);
  drawDeliveryRecordFallFx(ctx, canvas, roomId);
  drawDeskDrawerOpenFx(ctx, canvas, roomId);
  drawWatageFlightFx(ctx, canvas, roomId);

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

    if (area.glowSoft) {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const pulse = 0.82 + 0.18 * Math.sin(Date.now() / 180);
      ctx.globalCompositeOperation = "lighter";
      [
        { rx: w * 0.72, ry: h * 0.62, alpha: 0.2 },
        { rx: w * 0.46, ry: h * 0.4, alpha: 0.28 },
      ].forEach((layer) => {
        ctx.shadowColor = `rgba(${color}, ${0.9 * pulse})`;
        ctx.shadowBlur = Math.max(22, Math.min(w, h) * 0.75);
        ctx.fillStyle = `rgba(${color}, ${layer.alpha * pulse})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, layer.rx, layer.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      return;
    }

    const glow = ctx.createLinearGradient(x, y, x + w, y);
    glow.addColorStop(0, `rgba(${color}, 0.18)`);
    glow.addColorStop(0.5, `rgba(${color}, 0.70)`);
    glow.addColorStop(1, `rgba(${color}, 0.18)`);
    ctx.fillStyle = glow;
    ctx.fillRect(x + insetX, y + insetY, Math.max(1, w - insetX * 2), Math.max(1, h - insetY * 2));

    ctx.strokeStyle = `rgba(${color}, 0.58)`;
    ctx.lineWidth = Math.max(1, Math.min(w, h) * 0.07);
    ctx.strokeRect(x + insetX, y + insetY, Math.max(1, w - insetX * 2), Math.max(1, h - insetY * 2));

    const shouldPress = typeof area.pressedWhen === "function" ? area.pressedWhen() : !!area.pressedWhen;
    if (shouldPress) {
      drawPressedSwitchInset(ctx, x + insetX, y + insetY, Math.max(1, w - insetX * 2), Math.max(1, h - insetY * 2), color);
    }

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

function drawPressedSwitchInset(ctx, x, y, w, h, color) {
  const lip = Math.max(1, h * 0.22);
  const side = Math.max(1, w * 0.035);

  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.shadowBlur = 0;

  const innerShade = ctx.createLinearGradient(x, y, x, y + h);
  innerShade.addColorStop(0, "rgba(0, 0, 0, 0.54)");
  innerShade.addColorStop(0.42, "rgba(0, 0, 0, 0.22)");
  innerShade.addColorStop(1, "rgba(255, 255, 255, 0.08)");
  ctx.fillStyle = innerShade;
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = "rgba(0, 0, 0, 0.46)";
  ctx.fillRect(x, y, w, lip);
  ctx.fillRect(x, y, side, h);

  ctx.fillStyle = `rgba(${color}, 0.42)`;
  ctx.fillRect(x + side, y + h - lip, Math.max(1, w - side * 2), lip);

  ctx.strokeStyle = "rgba(0, 0, 0, 0.64)";
  ctx.lineWidth = Math.max(1, Math.min(w, h) * 0.08);
  ctx.strokeRect(x, y, w, h);

  ctx.restore();
}

function drawDeliveryRecordFallFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.deliveryRecordFall;
  if (!fx || fx.roomId !== roomId) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const ease = 1 - Math.pow(1 - t, 2.2);
  const fade = t < 0.82 ? 1 : Math.max(0, 1 - (t - 0.82) / 0.18);
  const baseX = canvas.width * 0.53;
  const startY = canvas.height * 0.08;
  const endY = canvas.height * 0.88;
  const flutter = Math.sin(t * Math.PI * 9) * canvas.width * 0.035;
  const x = baseX + flutter;
  const y = startY + (endY - startY) * ease;
  const angle = Math.sin(t * Math.PI * 7) * 0.42 + t * Math.PI * 0.85;
  const paperW = canvas.width * 0.075;
  const paperH = canvas.height * 0.035;

  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
  ctx.shadowBlur = Math.max(4, canvas.width * 0.006);
  ctx.fillRect(-paperW / 2, -paperH / 2, paperW, paperH);
  ctx.strokeStyle = "rgba(190, 205, 220, 0.78)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.0015);
  ctx.strokeRect(-paperW / 2, -paperH / 2, paperW, paperH);
  ctx.restore();

  const shardCount = 4;
  for (let i = 0; i < shardCount; i++) {
    const phase = t + i * 0.14;
    const localT = Math.max(0, Math.min(1, phase));
    const sx = baseX + (i - 1.5) * canvas.width * 0.035 + Math.sin(localT * Math.PI * (5 + i)) * canvas.width * 0.018;
    const sy = startY + (endY - startY) * Math.pow(localT, 1.45) * (0.58 + i * 0.09);
    const sw = paperW * (0.22 + i * 0.025);
    const sh = paperH * 0.46;

    ctx.save();
    ctx.globalAlpha = fade * (0.52 - i * 0.06);
    ctx.translate(sx, sy);
    ctx.rotate(Math.sin(localT * Math.PI * 8 + i) * 0.55);
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
    ctx.restore();
  }
}

function drawShiwakePuzzle(ctx, canvas, roomId) {
  if (roomId !== "shiwake") return;

  const state = getShiwakeState();
  const shineActive = (gameState.fx?.shiwakeBoxesShineUntil || 0) > Date.now();
  ctx.save();
  ctx.fillStyle = "#BF7536";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  SHIWAKE_BOXES.forEach((box) => {
    const rect = getAreaDrawRect(getShiwakeBoxArea(box.slot), canvas);
    const labelH = rect.h * 0.24;
    const textColor = box.slot === 2 ? "#2f2710" : "#fff";

    ctx.fillStyle = "rgba(218, 220, 220, 0.94)";
    ctx.strokeStyle = "rgba(50, 32, 22, 0.95)";
    ctx.lineWidth = Math.max(2, canvas.width * 0.003);
    roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 8, true, true);

    ctx.fillStyle = box.color;
    roundRect(ctx, rect.x + 4, rect.y + 4, rect.w - 8, labelH, 5, true, false);

    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.round(canvas.height * 0.035)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(box.label, rect.x + rect.w / 2, rect.y + 4 + labelH / 2);

    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(rect.x + rect.w * 0.12, rect.y + rect.h * 0.35, rect.w * 0.76, Math.max(2, rect.h * 0.035));

    if (state.flags.solved) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 3;
      ctx.strokeRect(rect.x + 7, rect.y + 7, rect.w - 14, rect.h - 14);
    }

    if (shineActive) {
      const pulse = 0.55 + 0.35 * Math.sin(Date.now() / 70);
      ctx.save();
      ctx.shadowColor = "rgba(255, 248, 178, 1)";
      ctx.shadowBlur = Math.max(18, canvas.width * 0.035);
      ctx.strokeStyle = `rgba(255, 248, 178, ${pulse})`;
      ctx.lineWidth = Math.max(4, canvas.width * 0.006);
      roundRect(ctx, rect.x + 6, rect.y + 6, rect.w - 12, rect.h - 12, 8, false, true);
      ctx.fillStyle = `rgba(255, 248, 178, ${pulse * 0.22})`;
      roundRect(ctx, rect.x + 6, rect.y + 6, rect.w - 12, rect.h - 12, 8, true, false);
      ctx.restore();
    }
  });

  if (state.flags.envelopeStampPlaced && !gameState.main.flags.lettersShineEventDone) {
    const boxRect = getAreaDrawRect(getShiwakeBoxArea(2), canvas);
    const img = loadedImages[IMAGES.items.envelopeStamp];
    if (img && img.complete && img.naturalWidth > 0) {
      const w = boxRect.w * 0.78;
      const h = boxRect.h * 0.22;
      const x = boxRect.x + (boxRect.w - w) / 2;
      const y = boxRect.y + boxRect.h * 0.58;
      ctx.drawImage(img, x, y, w, h);
    }
  }

  const zoomDisabled = !!gameState.main.flags.lettersShineEventDone;
  const zoomRect = getAreaDrawRect(getShiwakeZoomArea(), canvas);
  ctx.fillStyle = zoomDisabled ? "#b8b1a8" : "#f7f2e8";
  ctx.strokeStyle = zoomDisabled ? "#766f68" : "#4d3425";
  ctx.lineWidth = 3;
  roundRect(ctx, zoomRect.x, zoomRect.y, zoomRect.w, zoomRect.h, 7, true, true);
  ctx.strokeStyle = zoomDisabled ? "#6a645e" : "#3d281e";
  ctx.lineWidth = Math.max(3, canvas.width * 0.004);
  if (zoomDisabled) ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.arc(zoomRect.x + zoomRect.w * 0.43, zoomRect.y + zoomRect.h * 0.42, Math.min(zoomRect.w, zoomRect.h) * 0.22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(zoomRect.x + zoomRect.w * 0.58, zoomRect.y + zoomRect.h * 0.58);
  ctx.lineTo(zoomRect.x + zoomRect.w * 0.75, zoomRect.y + zoomRect.h * 0.75);
  ctx.stroke();
  if (zoomDisabled) ctx.globalAlpha = 1;

  const okRect = getAreaDrawRect(getShiwakeOkArea(), canvas);
  ctx.fillStyle = state.flags.solved ? "#009E73" : "#f7f2e8";
  ctx.strokeStyle = "#4d3425";
  ctx.lineWidth = 3;
  roundRect(ctx, okRect.x, okRect.y, okRect.w, okRect.h, 7, true, true);
  ctx.fillStyle = state.flags.solved ? "#fff" : "#3d281e";
  ctx.font = `bold ${Math.round(canvas.height * 0.035)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("OK", okRect.x + okRect.w / 2, okRect.y + okRect.h / 2);

  ctx.restore();
}

const BOARD_DOOR_ROWS = [
  { address: "104", area: "MOON AREA", name: "SCOTT" },
  { address: "218", area: "FIRE AREA", name: "ALICE" },
  { address: "? ? ?", area: "MOON AREA", name: "MARINA" },
  { address: "402", area: "GOLDEN AREA", name: "JIRO" },
  { address: "540", area: "? ? ?", name: "EMI" },
];

const BOARD_DOOR_BLANKS = {
  seasideAddress: { row: 2, col: "address", answer: "307", label: "ADDRESS" },
  solisArea: { row: 4, col: "area", answer: "GOLDEN", displayAnswer: "GOLDEN AREA", label: "AREA" },
};
const BOARD_DOOR_AREA_OPTIONS = ["WATER", "GOLDEN", "MOON", "FIRE", "WOOD"];

function getBoardDoorAnswersFlag() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.boardDoorAnswers || typeof f.boardDoorAnswers !== "object") f.boardDoorAnswers = {};
  return f.boardDoorAnswers;
}

function getBoardDoorDisplayRows() {
  const answers = getBoardDoorAnswersFlag();
  return BOARD_DOOR_ROWS.map((row) => ({ ...row })).map((row, idx) => {
    Object.entries(BOARD_DOOR_BLANKS).forEach(([key, blank]) => {
      if (blank.row === idx && answers[key]) row[blank.col] = blank.displayAnswer || blank.answer;
    });
    return row;
  });
}

function getBoardDoorTableMetrics() {
  return { x: 2, y: 9.5, width: 96, height: 61 };
}

function getBoardDoorCellArea(key) {
  const blank = BOARD_DOOR_BLANKS[key];
  const table = getBoardDoorTableMetrics();
  const rowH = table.height / 6;
  const colRects = {
    address: { x: table.x, width: table.width * 0.26 },
    area: { x: table.x + table.width * 0.26, width: table.width * 0.42 },
    name: { x: table.x + table.width * 0.68, width: table.width * 0.32 },
  };
  const col = colRects[blank.col];
  return {
    x: col.x,
    y: table.y + rowH * (blank.row + 1),
    width: col.width,
    height: rowH,
  };
}

function isBoardDoorBlankClickable(key) {
  const f = gameState.main.flags || {};
  return !!f.boardDoorRewritten && !getBoardDoorAnswersFlag()[key];
}

function drawBoardDoor(ctx, canvas, roomId) {
  if (roomId !== "boardDoor") return;

  const f = gameState.main.flags || (gameState.main.flags = {});
  ctx.save();
  ctx.fillStyle = "#274f3d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const table = getBoardDoorTableMetrics();
  const x = canvas.width * (table.x / 100);
  const y = canvas.height * (table.y / 100);
  const w = canvas.width * (table.width / 100);
  const h = canvas.height * (table.height / 100);
  ctx.fillStyle = "#030604";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(230, 244, 222, 0.7)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.0018);
  ctx.strokeRect(x, y, w, h);

  if (!f.boardDoorRewritten) {
    const deliverImg = loadedImages[IMAGES.modals.deliver];
    if (deliverImg && deliverImg.complete && deliverImg.naturalWidth > 0) {
      const scale = Math.min(w / deliverImg.naturalWidth, h / deliverImg.naturalHeight);
      const imgW = deliverImg.naturalWidth * scale;
      const imgH = deliverImg.naturalHeight * scale;
      ctx.drawImage(deliverImg, x + (w - imgW) / 2, y + (h - imgH) / 2, imgW, imgH);
    }
    ctx.restore();
    return;
  }

  const rowH = h / 6;
  const col1X = x + w * 0.016;
  const col2X = x + w * 0.276;
  const col3X = x + w * 0.705;
  const fontSize = Math.round(canvas.width * 0.033);

  ctx.strokeStyle = "rgba(230, 244, 222, 0.18)";
  for (let i = 1; i < 6; i++) {
    const ly = y + rowH * i;
    ctx.beginPath();
    ctx.moveTo(x, ly);
    ctx.lineTo(x + w, ly);
    ctx.stroke();
  }

  Object.keys(BOARD_DOOR_BLANKS).forEach((key) => {
    if (!isBoardDoorBlankClickable(key)) return;
    const area = getBoardDoorCellArea(key);
    const rect = {
      x: canvas.width * (area.x / 100),
      y: canvas.height * (area.y / 100),
      w: canvas.width * (area.width / 100),
      h: canvas.height * (area.height / 100),
    };
    ctx.fillStyle = "rgba(255, 216, 77, 0.08)";
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  });

  drawBoardDeskText(ctx, "ADDRESS", col1X, y + rowH / 2, fontSize, "#eef7e8", "left", 800);
  drawBoardDeskText(ctx, "AREA", col2X, y + rowH / 2, fontSize, "#eef7e8", "left", 800);
  drawBoardDeskText(ctx, "NAME", col3X, y + rowH / 2, fontSize, "#eef7e8", "left", 800);

  const boardDoorAnswers = getBoardDoorAnswersFlag();
  const highlightNameSecondLetter = !!(boardDoorAnswers.seasideAddress && boardDoorAnswers.solisArea);
  getBoardDoorDisplayRows().forEach((row, idx) => {
    const cy = y + rowH * (idx + 1.5);
    drawBoardDeskText(ctx, row.address, col1X, cy, fontSize, "#eef7e8", "left", 800);
    drawBoardDeskText(ctx, row.area, col2X, cy, fontSize, "#eef7e8", "left", 800);
    drawBoardDoorNameText(ctx, row.name, col3X, cy, fontSize, highlightNameSecondLetter);
  });

  Object.keys(BOARD_DOOR_BLANKS).forEach((key) => {
    if (!isBoardDoorBlankClickable(key)) return;
    const area = getBoardDoorCellArea(key);
    const rect = {
      x: canvas.width * (area.x / 100),
      y: canvas.height * (area.y / 100),
      w: canvas.width * (area.width / 100),
      h: canvas.height * (area.height / 100),
    };
    const pad = Math.max(4, canvas.width * 0.006);
    ctx.strokeStyle = "#ffd84d";
    ctx.lineWidth = Math.max(2, canvas.width * 0.003);
    ctx.strokeRect(rect.x + pad, rect.y + pad, rect.w - pad * 2, rect.h - pad * 2);
    ctx.strokeStyle = "rgba(255, 216, 77, 0.85)";
    ctx.lineWidth = Math.max(2, canvas.width * 0.0025);
    ctx.beginPath();
    ctx.moveTo(rect.x + pad * 2, rect.y + rect.h - pad * 1.7);
    ctx.lineTo(rect.x + rect.w - pad * 2, rect.y + rect.h - pad * 1.7);
    ctx.stroke();
  });

  ctx.strokeStyle = "#ffd84d";
  ctx.lineWidth = Math.max(3, canvas.width * 0.004);
  ctx.lineCap = "round";
  const cornerLen = Math.min(w, h) * 0.16;
  ctx.beginPath();
  ctx.moveTo(x, y + cornerLen);
  ctx.lineTo(x, y);
  ctx.lineTo(x + cornerLen, y);
  ctx.stroke();

  ctx.restore();
}

function drawBoardDoorNameText(ctx, name, x, y, size, highlightSecondLetter) {
  const text = String(name || "");
  if (!highlightSecondLetter || text.length < 2) {
    drawBoardDeskText(ctx, text, x, y, size, "#eef7e8", "left", 800);
    return;
  }

  ctx.save();
  ctx.font = `800 ${size}px "Yu Gothic", "Hiragino Sans", "Meiryo", sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  let cursorX = x;
  Array.from(text).forEach((ch, idx) => {
    ctx.fillStyle = idx === 1 ? "#ffd84d" : "#eef7e8";
    ctx.fillText(ch, cursorX, y);
    cursorX += ctx.measureText(ch).width;
  });
  ctx.restore();
}

const BOARD_CHEST_BEFORE_LINES = [
  { fare: "240G", marks: "❤ ★" },
  { fare: "210G", marks: "☀ ❤" },
  { fare: "180G", marks: "★ ▲ " },
];

const BOARD_CHEST_AFTER_LINES = [{ fare: "270G", marks: "☀ ★" }];

function drawBoardChest(ctx, canvas, roomId) {
  if (roomId !== "boardChest") return;

  const f = gameState.main.flags || (gameState.main.flags = {});
  const lines = f.boardChestRewritten ? BOARD_CHEST_AFTER_LINES : BOARD_CHEST_BEFORE_LINES;
  const panelX = canvas.width * 0.08;
  const panelY = canvas.height * 0.12;
  const panelW = canvas.width * 0.84;
  const panelH = canvas.height * 0.56;
  const fontSize = Math.round(canvas.width * (f.boardChestRewritten ? 0.072 : 0.064));
  const gap = panelH / (lines.length + 1);

  ctx.save();
  ctx.fillStyle = "#274f3d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#071710";
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeStyle = "rgba(230, 244, 222, 0.78)";
  ctx.lineWidth = Math.max(2, canvas.width * 0.003);
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  lines.forEach((line, idx) => {
    const y = panelY + gap * (idx + 1);
    drawBoardDeskText(ctx, line.fare, panelX + panelW * 0.34, y, fontSize, "#f4fbef", "right", 900);
    drawBoardDeskText(ctx, line.marks, panelX + panelW * 0.43, y, fontSize, "#f4fbef", "left", 900);
  });

  ctx.restore();
}

const BOARD_DESK_AREAS = [
  { no: "1", en: "WATER AREA", shortEn: "WATER" },
  { no: "2", en: "GOLDEN AREA", shortEn: "GOLDEN" },
  { no: "3", en: "MOON AREA", shortEn: "MOON" },
  { no: "4", en: "FIRE AREA", shortEn: "FIRE" },
  { no: "5", en: "WOOD AREA", shortEn: "WOOD" },
];

const BOARD_DESK_FARE_TABLE = [
  ["30G", "180G", "240G", "270G", "300G"],
  ["180G", "30G", "150G", "240G", "270G"],
  ["240G", "150G", "30G", "180G", "240G"],
  ["270G", "240G", "180G", "30G", "150G"],
  ["300G", "270G", "240G", "150G", "30G"],
];

function drawBoardDesk(ctx, canvas, roomId) {
  if (roomId !== "boardDesk") return;

  const f = gameState.main.flags || (gameState.main.flags = {});
  ctx.save();
  ctx.fillStyle = "#274f3d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fillRect(canvas.width * 0.02, canvas.height * 0.08, canvas.width * 0.96, canvas.height * 0.66);

  if (f.boardDeskRewritten) {
    drawBoardDeskFareTable(ctx, canvas);
  } else {
    drawBoardDeskAreaList(ctx, canvas);
  }

  ctx.restore();
}

const BOARD_ADMIN_BUTTON_SEQUENCE = [5, 3, 0, 4];

function getBoardAdminButtonArea(index) {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return { x: 35 + col * 17, y: 28 + row * 17, width: 13, height: 13 };
}

function getBoardAdminOkArea() {
  return { x: 63.5, y: 76.5, width: 13, height: 10 };
}

function getBoardAdminButtonStep() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const value = Number(f.boardAdminButtonStep);
  f.boardAdminButtonStep = Number.isInteger(value) && value >= 0 && value <= BOARD_ADMIN_BUTTON_SEQUENCE.length ? value : 0;
  return f.boardAdminButtonStep;
}

function drawBoardAdmin(ctx, canvas, roomId) {
  if (roomId !== "boardAdmin") return;

  const f = gameState.main.flags || (gameState.main.flags = {});
  ctx.save();
  ctx.fillStyle = "#EEAB48";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (f.boardAdminRewritten) {
    const flyerImg = loadedImages[IMAGES.modals.flyer];
    if (flyerImg && flyerImg.complete && flyerImg.naturalWidth > 0) {
      const maxW = canvas.width * 0.98;
      const maxH = canvas.height * 0.86;
      const scale = Math.min(maxW / flyerImg.naturalWidth, maxH / flyerImg.naturalHeight);
      const w = flyerImg.naturalWidth * scale;
      const h = flyerImg.naturalHeight * scale;
      ctx.drawImage(flyerImg, (canvas.width - w) / 2, canvas.height * 0.04, w, h);
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
      roundRect(ctx, canvas.width * 0.18, canvas.height * 0.17, canvas.width * 0.64, canvas.height * 0.46, 8, true, false);
    }
    ctx.restore();
    return;
  }

  const step = getBoardAdminButtonStep();
  [0, 1, 2, 3, 4, 5].forEach((idx) => {
    const area = getBoardAdminButtonArea(idx);
    const rect = {
      x: canvas.width * (area.x / 100),
      y: canvas.height * (area.y / 100),
      w: canvas.width * (area.width / 100),
      h: canvas.height * (area.height / 100),
    };
    const size = Math.min(rect.w, rect.h);
    const x = rect.x + (rect.w - size) / 2;
    const y = rect.y + (rect.h - size) / 2;
    const pressedIndex = BOARD_ADMIN_BUTTON_SEQUENCE.slice(0, step).indexOf(idx);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = pressedIndex >= 0 ? "#1f4d35" : "#555";
    ctx.lineWidth = Math.max(2, canvas.width * (pressedIndex >= 0 ? 0.004 : 0.002));
    ctx.fillRect(x, y, size, size);
    ctx.strokeRect(x, y, size, size);
  });

  const okArea = getBoardAdminOkArea();
  const okRect = {
    x: canvas.width * (okArea.x / 100),
    y: canvas.height * (okArea.y / 100),
    w: canvas.width * (okArea.width / 100),
    h: canvas.height * (okArea.height / 100),
  };
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#555";
  ctx.lineWidth = Math.max(2, canvas.width * 0.0025);
  roundRect(ctx, okRect.x, okRect.y, okRect.w, okRect.h, 5, true, true);
  ctx.fillStyle = "#222";
  ctx.font = `bold ${Math.round(canvas.height * 0.035)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("OK", okRect.x + okRect.w / 2, okRect.y + okRect.h / 2);

  ctx.restore();
}

function drawBoardDeskAreaList(ctx, canvas) {
  const x = canvas.width * 0.04;
  const y = canvas.height * 0.14;
  const w = canvas.width * 0.92;
  const h = canvas.height * 0.53;
  const rowH = h / 6;
  const col1W = w * 0.34;

  ctx.fillStyle = "#071710";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(230, 244, 222, 0.78)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.002);
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "rgba(230, 244, 222, 0.12)";
  ctx.fillRect(x, y, w, rowH);

  for (let i = 1; i < 6; i++) {
    const ly = y + rowH * i;
    ctx.beginPath();
    ctx.moveTo(x, ly);
    ctx.lineTo(x + w, ly);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(x + col1W, y);
  ctx.lineTo(x + col1W, y + h);
  ctx.stroke();

  drawBoardDeskText(ctx, "AREA No", x + col1W / 2, y + rowH / 2, Math.round(canvas.width * 0.029), "#eef7e8", "center", 800);
  drawBoardDeskText(ctx, "AREA NAME", x + col1W + (w - col1W) / 2, y + rowH / 2, Math.round(canvas.width * 0.029), "#eef7e8", "center", 800);

  BOARD_DESK_AREAS.forEach((area, idx) => {
    const cy = y + rowH * (idx + 1.5);
    drawBoardDeskText(ctx, area.no, x + col1W / 2, cy, Math.round(canvas.width * 0.03), "#f4fbef", "center", 800);
    drawBoardDeskText(ctx, area.en, x + col1W + (w - col1W) / 2, cy, Math.round(canvas.width * 0.03), "#f4fbef", "center", 800);
  });
}

function drawBoardDeskFareTable(ctx, canvas) {
  const x = canvas.width * 0.01;
  const y = canvas.height * 0.095;
  const w = canvas.width * 0.98;
  const h = canvas.height * 0.61;
  const rowH = h / 6;
  const firstColW = w * 0.19;
  const colW = (w - firstColW) / 5;

  ctx.fillStyle = "#030604";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(230, 244, 222, 0.7)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.0018);
  ctx.strokeRect(x, y, w, h);

  ctx.strokeStyle = "rgba(230, 244, 222, 0.18)";
  for (let i = 1; i < 6; i++) {
    const ly = y + rowH * i;
    ctx.beginPath();
    ctx.moveTo(x, ly);
    ctx.lineTo(x + w, ly);
    ctx.stroke();
  }

  const headerFont = Math.round(canvas.width * 0.03);
  const bodyFont = Math.round(canvas.width * 0.03);
  drawBoardDeskText(ctx, "FROM / TO", x + firstColW * 0.04, y + rowH / 2, headerFont, "#eef7e8", "left", 800);

  BOARD_DESK_AREAS.forEach((area, idx) => {
    const cx = x + firstColW + colW * (idx + 0.5);
    drawBoardDeskText(ctx, area.shortEn, cx, y + rowH / 2, headerFont, "#eef7e8", "center", 800);
  });

  BOARD_DESK_AREAS.forEach((area, rowIdx) => {
    const cy = y + rowH * (rowIdx + 1.5);
    drawBoardDeskText(ctx, area.shortEn, x + firstColW * 0.04, cy, bodyFont, "#eef7e8", "left", 800);
    BOARD_DESK_FARE_TABLE[rowIdx].forEach((value, colIdx) => {
      const cx = x + firstColW + colW * (colIdx + 0.5);
      drawBoardDeskText(ctx, value, cx, cy, bodyFont, "#eef7e8", "center", 800);
    });
  });
}

function drawBoardDeskText(ctx, text, x, y, size, color, align = "center", weight = 700) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Yu Gothic", "Hiragino Sans", "Meiryo", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function drawShiwakeEnvelopeSelection(ctx, canvas, roomId) {
  if (roomId !== "shiwake") return;
  const selected = getShiwakeState().flags.selectedEnvelope;
  if (!selected) return;

  const rect = getAreaDrawRect(getShiwakeEnvelopeArea(selected), canvas);
  ctx.save();
  ctx.strokeStyle = "gold";
  ctx.lineWidth = Math.max(3, canvas.width * 0.004);
  ctx.setLineDash([8, 5]);
  ctx.strokeRect(rect.x - 4, rect.y - 4, rect.w + 8, rect.h + 8);
  ctx.restore();
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

        let pendulumRad = 0;
        const flagShakeFx = roomId === "mainDoor" && key === "flag" ? fx.mainDoorFlagShake : null;
        if (flagShakeFx?.roomId === "mainDoor") {
          const t = Math.max(0, Math.min(1, Number(flagShakeFx.progress) || 0));
          const decay = Math.pow(1 - t, 1.45);
          pendulumRad = Math.sin(t * Math.PI * 4.5) * ((22 * Math.PI) / 180) * decay;
        }

        // ★ drawRoomItems 内：ctx.drawImage(img, px, py, w, h); を置き換え
        const rotDeg = area.item && typeof area.item.rotateDeg === "function" ? area.item.rotateDeg() : area.item ? area.item.rotateDeg : 0;

        if (pendulumRad) {
          const pivotX = px + w * 0.5;
          const pivotY = py + h * 0.06;

          ctx.translate(pivotX, pivotY);
          ctx.rotate(pendulumRad);
          ctx.drawImage(img, -w * 0.5, -h * 0.06, w, h);
        } else if (rotDeg) {
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

function drawMainDeskGhostJellyFx(ctx, canvas, roomId) {
  const ghostFx = gameState.fx?.ghostJelly;
  if (!ghostFx || ghostFx.roomId !== roomId || roomId !== "mainDesk") return;

  const ghostRect = getAreaRectPx("mainDesk", "おばけ出現部分", canvas);
  const foodRect = getAreaRectPx("mainDesk", "お盆の上の食物置き場", canvas);
  const ghostImage = loadedImages[IMAGES.items.ghost];
  if (!ghostRect || !foodRect || !ghostImage?.complete || ghostImage.naturalWidth <= 0) return;

  const progress = Math.max(0, Math.min(1, Number(ghostFx.progress) || 0));
  const isDeparting = ghostFx.phase === "departing";
  const pickupAt = 0.52;
  const moveProgress = isDeparting ? Math.min(1, progress / pickupAt) : 0;
  const easedMove = 1 - Math.pow(1 - moveProgress, 3);
  const startX = ghostRect.x;
  const startY = ghostRect.y;
  const targetX = foodRect.x + foodRect.w / 2 - ghostRect.w / 2;
  const targetY = ghostRect.y + canvas.height * 0.075;
  const x = startX + (targetX - startX) * easedMove;
  const y = startY + (targetY - startY) * easedMove;
  const alpha = ghostFx.phase === "appearing"
    ? progress
    : isDeparting && progress >= pickupAt
      ? Math.max(0, 1 - (progress - pickupAt) / (1 - pickupAt))
      : 1;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(ghostImage, x, y, ghostRect.w, ghostRect.h);

  if (ghostFx.jellyPicked) {
    const jellyImage = loadedImages[IMAGES.items.jellyPut];
    if (jellyImage?.complete && jellyImage.naturalWidth > 0) {
      const jellyW = ghostRect.w * 0.42;
      const jellyH = ghostRect.h * 0.3;
      ctx.drawImage(
        jellyImage,
        x + ghostRect.w * 0.5 - jellyW * 0.5,
        y + ghostRect.h * 0.6,
        jellyW,
        jellyH,
      );
    }
  }
  ctx.restore();
}





function drawMainDoorLetterStatusFlash(ctx, canvas, roomId) {
  const fx = gameState.fx?.mainDoorLetterStatusFlash;
  if (!fx || fx.roomId !== roomId) return;

  const rect = getAreaRectPx(roomId, "ドア上手紙マーク", canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const blink = Math.sin(t * Math.PI * 8);
  const alpha = (0.18 + Math.max(0, blink) * 0.62) * (1 - Math.max(0, t - 0.82) / 0.18);
  if (alpha <= 0) return;

  const padX = rect.w * 0.16;
  const padY = rect.h * 0.12;
  const x = rect.x - padX;
  const y = rect.y - padY;
  const w = rect.w + padX * 2;
  const h = rect.h + padY * 2;
  const isClear = fx.variant === "clear";

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = isClear ? "rgba(30, 190, 82, 0.46)" : "rgba(230, 24, 24, 0.46)";
  ctx.strokeStyle = isClear ? "rgba(32, 230, 96, 0.98)" : "rgba(255, 20, 20, 0.98)";
  ctx.lineWidth = Math.max(2, Math.min(w, h) * 0.09);
  ctx.shadowColor = isClear ? "rgba(0, 220, 80, 0.9)" : "rgba(255, 0, 0, 0.9)";
  ctx.shadowBlur = Math.max(8, Math.min(w, h) * 0.45);
  roundRect(ctx, x, y, w, h, Math.max(4, h * 0.18), true, true);

  ctx.shadowBlur = 0;
  ctx.lineWidth = Math.max(1.5, Math.min(w, h) * 0.055);
  ctx.beginPath();
  ctx.moveTo(x + w * 0.12, y + h * 0.26);
  ctx.lineTo(x + w * 0.5, y + h * 0.58);
  ctx.lineTo(x + w * 0.88, y + h * 0.26);
  ctx.moveTo(x + w * 0.12, y + h * 0.74);
  ctx.lineTo(x + w * 0.38, y + h * 0.48);
  ctx.moveTo(x + w * 0.88, y + h * 0.74);
  ctx.lineTo(x + w * 0.62, y + h * 0.48);
  ctx.stroke();
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
  if (gripStyle === "circleKnob") {
    const radius = Math.max(5, rect.h * 0.18);
    const centerX = rect.x + rect.w / 2;
    const centerY = frontY + rect.h * 0.43;

    ctx.fillStyle = gripColor;
    ctx.strokeStyle = "rgba(63, 27, 13, 0.75)";
    ctx.lineWidth = Math.max(1, rect.h * 0.04);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    return;
  }

  if (gripStyle === "squareBarHandle") {
    const handleW = Math.max(30, rect.w * 0.32);
    const plateSize = Math.max(8, rect.h * 0.32);
    const barH = Math.max(6, rect.h * 0.2);
    const centerY = frontY + rect.h * 0.43;
    const leftX = rect.x + rect.w / 2 - handleW / 2;
    const rightX = rect.x + rect.w / 2 + handleW / 2;
    const outline = "#3f1b0d";

    ctx.shadowColor = "rgba(0,0,0,0.42)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = Math.max(1, rect.h * 0.04);

    // 左右の角形台座
    [leftX, rightX].forEach((cx) => {
      ctx.fillStyle = outline;
      ctx.fillRect(cx - plateSize * 0.58, centerY - plateSize * 0.58, plateSize * 1.16, plateSize * 1.16);
      ctx.fillStyle = gripColor;
      ctx.fillRect(cx - plateSize * 0.38, centerY - plateSize * 0.38, plateSize * 0.76, plateSize * 0.76);
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(cx - plateSize * 0.3, centerY - plateSize * 0.3, plateSize * 0.56, Math.max(1, plateSize * 0.12));
    });

    // 台座から少し手前に張り出す横長の握り
    const barX = leftX + plateSize * 0.12;
    const barW = rightX - leftX - plateSize * 0.24;
    const barY = centerY + plateSize * 0.08;
    ctx.fillStyle = outline;
    roundRect(ctx, barX - 2, barY - barH / 2 - 2, barW + 4, barH + 4, Math.max(1, barH * 0.18), true, false);
    const barGradient = ctx.createLinearGradient(0, barY - barH / 2, 0, barY + barH / 2);
    barGradient.addColorStop(0, "#d78a4b");
    barGradient.addColorStop(0.42, gripColor);
    barGradient.addColorStop(1, "#7c391a");
    ctx.fillStyle = barGradient;
    roundRect(ctx, barX, barY - barH / 2, barW, barH, Math.max(1, barH * 0.16), true, false);

    ctx.restore();
    return;
  }

  if (gripStyle === "archedHandle") {
    const handleW = Math.max(22, rect.w * 0.2);
    const handleH = Math.max(9, rect.h * 0.36);
    const leftX = rect.x + rect.w / 2 - handleW / 2;
    const rightX = rect.x + rect.w / 2 + handleW / 2;
    const topY = frontY + rect.h * 0.28;
    const bottomY = topY + handleH;
    const knobR = Math.max(4, rect.h * 0.18);
    const strokeW = Math.max(3, rect.h * 0.1);

    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = Math.max(1, rect.h * 0.03);

    [leftX, rightX].forEach((cx) => {
      const base = ctx.createRadialGradient(cx - knobR * 0.3, topY - knobR * 0.35, knobR * 0.2, cx, topY, knobR);
      base.addColorStop(0, "#5d5960");
      base.addColorStop(0.45, gripColor);
      base.addColorStop(1, "#111013");
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.arc(cx, topY, knobR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#111013";
      ctx.lineWidth = Math.max(1, strokeW * 0.28);
      ctx.stroke();
    });

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111013";
    ctx.lineWidth = strokeW + Math.max(1, strokeW * 0.45);
    ctx.beginPath();
    ctx.moveTo(leftX, topY);
    ctx.quadraticCurveTo(leftX, bottomY, leftX + handleW * 0.18, bottomY);
    ctx.lineTo(rightX - handleW * 0.18, bottomY);
    ctx.quadraticCurveTo(rightX, bottomY, rightX, topY);
    ctx.stroke();

    const handleGrad = ctx.createLinearGradient(0, topY, 0, bottomY);
    handleGrad.addColorStop(0, "#5d5960");
    handleGrad.addColorStop(0.45, gripColor);
    handleGrad.addColorStop(1, "#171619");
    ctx.strokeStyle = handleGrad;
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.moveTo(leftX, topY);
    ctx.quadraticCurveTo(leftX, bottomY, leftX + handleW * 0.18, bottomY);
    ctx.lineTo(rightX - handleW * 0.18, bottomY);
    ctx.quadraticCurveTo(rightX, bottomY, rightX, topY);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = Math.max(1, strokeW * 0.18);
    ctx.beginPath();
    ctx.moveTo(leftX + strokeW * 0.25, topY + strokeW * 0.15);
    ctx.quadraticCurveTo(leftX + strokeW * 0.25, bottomY - strokeW * 0.35, leftX + handleW * 0.2, bottomY - strokeW * 0.35);
    ctx.lineTo(rightX - handleW * 0.2, bottomY - strokeW * 0.35);
    ctx.stroke();

    ctx.restore();
    return;
  }

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

function drawWatageFlightFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.watageFlight;
  if (!fx || fx.roomId !== roomId) return;

  const vaseRect = getAreaRectPx(roomId, "花瓶", canvas);
  const storageRect = getAreaRectPx(roomId, "机の下の収納", canvas);
  if (!vaseRect || !storageRect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const flightEnd = 0.72;
  const flightT = Math.min(1, t / flightEnd);
  const startX = vaseRect.x + vaseRect.w * 0.5;
  const startY = vaseRect.y + vaseRect.h * 0.35;
  const endX = storageRect.x + storageRect.w * 0.5;
  const endY = storageRect.y + storageRect.h * 0.42;
  const controlX = (startX + endX) * 0.5;
  const controlY = Math.min(startY, endY) - canvas.height * 0.18;

  for (let index = 0; index < 14; index++) {
    const delay = index * 0.035;
    const p = Math.max(0, Math.min(1, (flightT - delay) / Math.max(0.01, 1 - delay)));
    if (p <= 0 || (flightT >= 1 && index % 3 === 0)) continue;
    const inv = 1 - p;
    const flutterX = Math.sin(p * Math.PI * (5 + index % 4) + index) * canvas.width * 0.012;
    const flutterY = Math.cos(p * Math.PI * 6 + index * 0.7) * canvas.height * 0.008;
    const x = inv * inv * startX + 2 * inv * p * controlX + p * p * endX + flutterX;
    const y = inv * inv * startY + 2 * inv * p * controlY + p * p * endY + flutterY;
    const radius = Math.max(1.5, canvas.width * (0.0025 + (index % 3) * 0.0007));

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "rgba(255,255,238,.9)";
    ctx.shadowColor = "rgba(255,255,220,.95)";
    ctx.shadowBlur = radius * 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (t < flightEnd) return;
  const glowT = (t - flightEnd) / (1 - flightEnd);
  const pulse = 0.45 + 0.55 * Math.max(0, Math.sin(glowT * Math.PI * 6));
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = `rgba(255,235,115,${0.22 * pulse})`;
  ctx.strokeStyle = `rgba(255,248,190,${0.9 * pulse})`;
  ctx.shadowColor = "rgba(255,220,70,.95)";
  ctx.shadowBlur = Math.max(18, storageRect.h * 0.8);
  ctx.lineWidth = Math.max(2, storageRect.h * 0.08);
  ctx.fillRect(storageRect.x, storageRect.y, storageRect.w, storageRect.h);
  ctx.strokeRect(storageRect.x, storageRect.y, storageRect.w, storageRect.h);
  ctx.restore();
}

function playWatageFlightFx() {
  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;
  fx.watageFlight = { roomId: "mainDesk", progress: 0 };
  renderCanvasRoom?.();

  const duration = 2700;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.watageFlight;
    if (!currentFx) return;
    currentFx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (currentFx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.watageFlight;
    gameState.fx.lockInput = false;
    getMainFlags().watageReachedStorage = true;
    markProgress?.("blow_watage_to_under_desk_storage");
    renderCanvasRoom?.();
    updateMessage("綿毛が机の下の収納へ飛んでいった。収納のあたりが光った。");
  };
  requestAnimationFrame(tick);
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

// 画面揺れ
function screenShake(el = document.documentElement, ms = 120, cls = "fx-shake") {
  if (!el) return;
  // 連打でも必ず発火させる
  el.classList.remove(cls);
  void el.offsetHeight; // reflow
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}

function playSeasonChangeFlash() {
  const flash = document.getElementById("fxFlash");
  if (!flash) return;

  flash.getAnimations?.().forEach((animation) => animation.cancel());
  flash.animate(
    [
      { opacity: 0, background: "rgba(255,255,225,0)", offset: 0 },
      { opacity: 0.58, background: "rgba(255,250,205,.9)", offset: 0.18 },
      { opacity: 0.24, background: "rgba(255,236,155,.55)", offset: 0.72 },
      { opacity: 0, background: "rgba(255,255,230,0)", offset: 1 },
    ],
    { duration: 1600, easing: "ease-out" },
  );
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





function showMainDeskBaggageModal(step = 1) {
  const currentStep = Math.max(1, Math.min(3, Number(step) || 1));
  const imgSrc = IMAGES.modals[`baggage${currentStep}`];
  const imageId = `mainDeskBaggageImage${currentStep}`;
  const text = currentStep === 3 ? `<p style="text-align:center;margin:0 0 16px;">荷物の配送票が貼られている</p>` : "";
  const cursor = currentStep < 3 ? "cursor:pointer;" : "";
  const content = `
    <img id="${imageId}" src="${imgSrc}" alt="置かれた荷物" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;${cursor}">
    ${text}
  `;

  showModal("置かれた荷物", content, [{ text: "閉じる", action: "close" }]);

  if (currentStep < 3) {
    document.getElementById(imageId)?.addEventListener("click", () => {
      showMainDeskBaggageModal(currentStep + 1);
    });
  }
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
      title: "👋🌕 TRUE END",
      label: "TRUE END",
      desc: "ハウスに居たおばけも成仏しました。おめでとうございます！",
    },

    end: {
      title: "🦁 NORMAL END ",
      label: "NORMAL",
      desc: "不思議なダンデライオンハウスから脱出しました。おめでとうございます！",
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeOmF5kBiDKwJVQ9XHnf54XKRWnDhYPQh4eA6_xehDvoH6YXA/viewform";
  const endingLabel =
    {
      trueEnd: "トゥルーエンド",
      end: "ノーマルエンド",
      modernEnd: "灼熱エンド",
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

  // キャラクター画像は固定し、セリフだけ会話ごとに切り替える
  const character = hintCharacters[roomId]?.[charId];
  const message = messages[idx];
  if (!character) {
    updateMessage(message);
    return;
  }

  const content = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;">
      <img src="${character.image}" alt="${character.name}" style="display:block;width:min(78vw,480px);max-height:60vh;object-fit:contain;">
      <p id="hintCharacterDialogue" role="button" tabindex="0" aria-label="クリックして次のセリフを表示" style="box-sizing:border-box;width:min(78vw,480px);margin:0;padding:14px 18px;border-radius:10px;background:rgba(255,255,255,.88);color:#2f2117;font-weight:700;line-height:1.8;text-align:center;cursor:pointer;user-select:none;">${message}</p>
    </div>
  `;
  showModal(
    character.name,
    content,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );
  const dialogue = document.getElementById("hintCharacterDialogue");
  const showNextDialogue = () => {
    flags.talkTo[charId]++;
    const nextIdx = (flags.talkTo[charId] - 1) % messages.length;
    const nextMessage = messages[nextIdx];
    dialogue.textContent = nextMessage;
    updateMessage(nextMessage);
  };
  dialogue?.addEventListener("click", showNextDialogue);
  dialogue?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    showNextDialogue();
  });
  updateMessage(message);
}

function showBearNikumanEvent() {
  const flags = getMainFlags();
  if (!flags.bearAppear || flags.bearDeparted || gameState.selectedItem !== "nikuman") return;

  removeItem("nikuman");
  showModal(
    "「わあ、おいしそう」",
    `<img src="${IMAGES.modals.bearNikuman1}" class="showobj-image" alt="肉まんを喜ぶクマ妖精">`,
    [
      {
        text: "次へ",
        action: () => {
          window._nextModal = showBearNikumanDeparture;
          closeModal();
        },
      },
    ],
    null,
    { contentClass: "showobj-modal" },
  );
  updateMessage("クマ妖精に肉まんを渡した。");
}

function showBearNikumanDeparture() {
  const content = `
    <div class="modal-anim">
      <img src="${IMAGES.modals.bearNikuman2}" alt="飛び立つクマ妖精">
      <img src="${IMAGES.modals.bearNikuman3}" alt="飛び去るクマ妖精">
    </div>
    <p style="text-align:center;font-weight:800;line-height:1.8;margin-top:14px;">
      何か落としたようだ。
    </p>
  `;
  showModal(
    "クマ妖精は飛び去って行った",
    content,
    [{ text: "閉じる", action: "close" }],
    () => {
      const flags = getMainFlags();
      flags.bearDeparted = true;
      renderCanvasRoom?.();
      updateMessage("クマ妖精は飛び去っていった。");
    },
    { contentClass: "showobj-modal" },
  );
}

// 汎用マイルストーン送信用ヘルパ
function markProgress(step, extra = {}) {
  ANA.once("progress", step, { step, ...extra });
}

function getDefaultGameState() {
  return {
    currentRoom: "mainDesk",
    openRooms: ["mainDesk"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        foundPencil: false,
        foundPicNikumanOld: false,
        bedTrayFood: null,
        ghostTookJelly: false,
        mainDeskBoxUnlocked: false,
        foundPicJelly: false,
        picKidsSet: false,
        foundFlower: false,
        vaseState: "empty",
        watageReachedStorage: false,
        picBearPuzzleSolved: false,
        foundUnderDeskTategami: false,
        foundUnderDeskMap: false,
        thrownGomi: false,
        picBearPuzzlePieces: [8, 1, 5, 6, 3, 0, 7, 4, 2],
        mainDoorSecondDrawerUnlocked: false,
        mainDoorSecondDrawerIcons: ["Thunder", "Thunder", "Thunder", "Thunder"],
        mainDoorThirdDrawerUnlocked: false,
        mainDoorThirdDrawerDigits: [0, 0, 0, 0],
        foundUchiwa: false,
        mainDoorCabinetUnlocked: false,
        mainDoorCabinetLetters: ["d", "d", "d", "d"],
        foundDollBear: false,
        mainDoorUnlocked: false,
        unlockMachineDoorHintShown: false,
        unlockMachineDoor: false,
        machineDoorIcons: ["tanpopo", "tanpopo", "tanpopo", "tanpopo"],
        bearAppear: false,
        bearDeparted: false,
        foundKey: false,

        talkTo: { bear: 0, wizard: 0 },
      },
    },

    end: {
      flags: { backgroundState: 0 },
    },
    trueEnd: {
      flags: { backgroundState: 0 },
    },
    modernEnd: {
      flags: { backgroundState: 0 },
    },

    selectedItem: null,
    selectedItemSlot: null,
    usingItem: null,
    inventoryPage: 0,
  };
}

function getMainFlags() {
  if (!gameState.main) gameState.main = {};
  if (!gameState.main.flags) gameState.main.flags = {};
  return gameState.main.flags;
}

































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

function keepOnlyItemsOnEndingArrival(itemIds) {
  const keep = new Set(itemIds);
  gameState.inventory = gameState.inventory.filter((itemId) => keep.has(itemId));
  gameState.selectedItem = null;
  gameState.selectedItemSlot = null;
  gameState.usingItem = null;
  gameState.inventoryPage = 0;
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

  const selectedItem = gameState.selectedItem;
  const combinesDollBearAndTategami =
    (selectedItem === "dollBear" && clickedItem === "tategami")
    || (selectedItem === "tategami" && clickedItem === "dollBear");
  if (combinesDollBearAndTategami && gameState.selectedItemSlot !== slotIndex) {
    showDollBearTategamiEvent();
    return;
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

function showDollBearTategamiEvent() {
  const flags = getMainFlags();
  if (flags.bearAppear) {
    clearUsingItem(true);
    updateMessage("この組み合わせでは、もう何も起こらない。");
    return;
  }

  flags.bearAppear = true;
  removeItemsOnEndingArrival(["dollBear", "tategami"]);
  playSE?.("se-fanta");

  const content = `
    <style>
      @keyframes dollBearTategamiVanish {
        0%, 32% { opacity:1; filter:blur(0); }
        100% { opacity:0; filter:blur(8px); }
      }
      @keyframes dollBearTategamiMist {
        0% { opacity:0; transform:scale(.82); }
        45%, 72% { opacity:.94; transform:scale(1.08); }
        100% { opacity:0; transform:scale(1.2); }
      }
    </style>
    <div style="position:relative;width:min(78vw,480px);margin:0 auto;overflow:hidden;">
      <img src="${IMAGES.modals.dollBearTategami}" alt="謎の輪を付けたクマのぬいぐるみ" style="display:block;width:100%;height:auto;animation:dollBearTategamiVanish 2.5s ease-in forwards;">
      <div aria-hidden="true" style="position:absolute;inset:-18%;pointer-events:none;opacity:0;background:radial-gradient(circle at 35% 55%,rgba(255,255,255,.96),rgba(225,235,240,.62) 24%,transparent 48%),radial-gradient(circle at 68% 42%,rgba(255,255,255,.9),rgba(205,220,230,.55) 27%,transparent 52%);filter:blur(13px);animation:dollBearTategamiMist 2.5s ease-out forwards;"></div>
    </div>
  `;
  showModal(
    "クマのぬいぐるみに謎の輪を使った",
    content,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );

  setTimeout(() => {
    renderCanvasRoom?.();
    showToast("テーブルのほうで物音がした");
  }, 2500);
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

    operaGlass: "双眼鏡",
    memo: "メモ",
    pencil: "鉛筆",
    uchiwa: "うちわ",
    dollBear: "クマのぬいぐるみ",
    tategami: "謎の輪",
    map: "間取り図",
    mapBefore: "紙",
    picFailure: "適当に描いた絵",
    picNikuman: "肉まんの絵",
    picJelly: "ゼリーの絵",
    picNikumanOld: "古びた肉まんの絵",
    picJellyOld: "ゼリーの見本の絵",
    nikuman: "肉まん",
    jelly: "5月のそよ風ゼリー",
    dish: "お皿",
    picKids: "子供が描かれたスケッチ",
    flower: "タンポポの造花",

  };
  return names[itemId] || itemId;
}

function openInventoryItemDetail(itemId, slotIndex, fallbackSrc) {
  const itemBaseSrc = IMAGES.items[itemId] || fallbackSrc;
  const itemEnSrc = IMAGES.items[`${itemId}En`];
  const hasEnVariant = !!itemEnSrc;

  let content = `<img src="${itemBaseSrc}" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`;
  let buttons = [{ text: "閉じる", action: "close" }];


  if (itemId === "fanClosed") {
    buttons = [
      {
        text: "開く",
        action: () => {
          removeItem("fanClosed");
          addItem("fanOpened");
          closeModal();
          showObj(null, "扇子を開いた", IMAGES.items.fanOpened, "扇子を開いた");
        },
      },
      { text: "閉じる", action: "close" },
    ];
  }

  if (itemId === "hat") {
    buttons = [
      {
        text: "調べる",
        action: () => {
          window._nextModal = {
            title: getItemName(itemId),
            content: `<img src="${IMAGES.modals.hat}" style="max-width:380px;max-height:80vh;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`,
            buttons: [{ text: "閉じる", action: "close" }],
          };
          closeModal();
        },
      },
      { text: "閉じる", action: "close" },
    ];
  }

  if (itemId === "horn") {
    buttons = [
      {
        text: "よく見る",
        action: () => {
          window._nextModal = {
            title: getItemName(itemId),
            content: `<img src="${IMAGES.items.hornZoom}" style="max-width:380px;max-height:80vh;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`,
            buttons: [{ text: "閉じる", action: "close" }],
          };
          closeModal();
        },
      },
      { text: "閉じる", action: "close" },
    ];
  }

  if (itemId === "nikuman" && getMainFlags().bearDeparted) {
    buttons = [
      {
        text: "食べる",
        action: () => {
          removeItem("nikuman");
          closeModal();
          showNikumanEatingSequence();
        },
      },
      { text: "閉じる", action: "close" },
    ];
  }

  showModal(getItemName(itemId), content, buttons);
}

function showNikumanEatingSequence() {
  showModal(
    "モグモグ",
    '<p style="margin:18px 0;text-align:center;font-size:1.4rem;font-weight:800;">おいしい肉まんだ。</p>',
    [],
  );

  setTimeout(() => {
    if (!hasItem("dish")) addItem("dish");
    showModal(
      "食べ終えた",
      `<img src="${IMAGES.modals.dish}" class="showobj-image" alt="肉まんを食べ終えて残ったお皿">`,
      [{ text: "閉じる", action: "close" }],
      null,
      { contentClass: "showobj-modal" },
    );
    updateMessage("肉まんを食べ終えた。");
  }, 900);
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
      slot.appendChild(img);
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
  } catch (e) { }
}

function updateMessageHTML(html) {
  const el = document.getElementById("msgText");
  el.innerHTML = html;
  try {
    renderStatusIcons();
  } catch (e) { }
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
      if (button.style) btn.style.cssText += button.style;
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
      } catch (e) { }
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
                } catch (e) { }
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
              } catch (e) { }
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
            } catch (e) { }
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
          } catch (e) { }
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
        } catch (e) { }
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
        } catch (e) { }
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
  migrateLegacyJellyItemIds(merged);

  if (!Array.isArray(merged.openRooms)) merged.openRooms = def.openRooms.slice();
  merged.openRooms = merged.openRooms.filter((roomId) => rooms[roomId]);
  if (merged.openRooms.length === 0) merged.openRooms = def.openRooms.slice();
  if (!merged.currentRoom || !rooms[merged.currentRoom]) merged.currentRoom = def.currentRoom;

  gameState = merged;
  getMainFlags();

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

function migrateLegacyJellyItemIds(state) {
  const replacements = {
    picJerry: "picJelly",
    picJerryOld: "picJellyOld",
    jerry: "jelly",
  };
  const replace = (itemId) => replacements[itemId] || itemId;

  if (Array.isArray(state.inventory)) {
    state.inventory = state.inventory.map(replace);
  }
  state.selectedItem = replace(state.selectedItem);
  state.usingItem = replace(state.usingItem);
}

function showToast(text, ms = 2600) {
  const el = document.getElementById("toast");
  if (!el) return;
  if (showToast.hideTimer) clearTimeout(showToast.hideTimer);
  el.textContent = text;
  el.style.opacity = "1";
  el.style.transform = "translateX(-50%) translateY(0)";
  showToast.hideTimer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(-8px)";
    showToast.hideTimer = null;
  }, ms);
}

window.addEventListener("resize", () => renderNavigation());

// ゲーム開始
preloadImages();
initGame();
