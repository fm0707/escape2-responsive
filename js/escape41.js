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
const BASE_41 = USE_LOCAL_ASSETS ? "images/41" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/41";
const BASE_SOUND_41 = USE_LOCAL_ASSETS ? "sounds/41" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/41";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I41 = (file) => `${BASE_41}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S41 = (file) => `${BASE_SOUND_41}/${file}`;
const DEFAULT_BGM = S41("amayadori.mp3");

// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    mainDoor: [I41("main_door.webp")],
    mainDesk: [I41("main_desk.webp")],
    mainChest: [I41("main_chest.webp")],
    mainAdminDoor: [I41("main_admin_door.webp")],
    transferRoom: [I41("transfer_room.webp")],

    end: [I41("end.webp"), I41("end2.webp")],
    trueEnd: [I41("true_end.webp"), I41("true_end2.webp")],
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

    envelope1: I41("envelope_1.webp"),
    envelope2: I41("envelope_2.webp"),
    envelope3: I41("envelope_3.webp"),
    envelope4: I41("envelope_4.webp"),
    envelope5: I41("envelope_5.webp"),
    envelopes: I41("envelopes.webp"),
    envelopeNostamp: I41("envelope_nostamp.webp"),
    envelopeStamp: I41("envelope_stamp.webp"),
    enveloipeNostamps: I41("envelope_nostamp.webp"),
    enveloipeStamps: I41("envelope_stamp.webp"),
    stampStar: I41("stamp_star.webp"),
    stampHeart: I41("stamp_heart.webp"),
    stampTriangle: I41("stamp_triangle.webp"),
    stampSun: I41("stamp_sun.webp"),
    card: I41("card.webp"),
    lockManage: I41("lock_manage.webp"),
    wifi2: I41("wifi_2.webp"),
    wifi3: I41("wifi_3.webp"),
    wifi4: I41("wifi_4.webp"),
    wifi2Black: I41("wifi_2_black.webp"),
    flag: I41("flag.webp"),
    fanClosed: I41("fan_closed.webp"),
    fanOpened: I41("fan_opened.webp"),
    fanPart: I41("fan_part.webp"),
    bag: I41("bag.webp"),
    hat: I41("hat.webp"),
    potionBack: I41("potion_back.webp"),
    paper: I41("paper.webp"),
    boxClosed: I41("box_closed.webp"),
    insideShutter: I41("inside_shutter.webp"),
    cargoTag: I41("cargo_tag.webp"),
    manjuBox: I41("manju_box.webp"),
    map: I41("map.webp"),
    shutterClose: I41("shutter_close.webp"),
    shutterOpen: I41("shutter_open.webp"),
    deliveryRecord: I41("modal_delivery_record.webp"),

    // key: I41("key.webp"),
    magicalPotion: I41("magical_potion.webp"),
  },
  modals: {
    sign: I41("modal_sign.webp"),
    signZoom: I41("modal_sign_zoom.webp"),
    baggage1: I41("modal_baggage_1.webp"),
    baggage2: I41("modal_baggage_2.webp"),
    baggage3: I41("modal_baggage_3.webp"),
    lettersShine1: I41("modal_letters_shine_1.webp"),
    lettersShine2: I41("modal_letters_shine_2.webp"),
    lettersShine3: I41("modal_letters_shine_3.webp"),
    paperOnFailure: I41("modal_paper_on_failure.webp"),
    paperOnSuccess: I41("modal_paper_on_success.webp"),
    tankFill: I41("modal_tank_fill.webp"),
    shelf: I41("modal_shelf.webp"),
    boxOpenBefore: I41("modal_box_open_before.webp"),
    boxOpen1: I41("modal_box_open_1.webp"),
    boxOpen2: I41("modal_box_open_2.webp"),
    bearUpset: I41("modal_bear_upset.webp"),
    bearGeton: I41("modal_bear_geton.webp"),
    flyer: I41("modal_flyer.webp"),
    deliver: I41("modal_deliver.webp"),
    kabuki: I41("modal_kabuki.webp"),
    hat: I41("modal_hat.webp"),
    letterStamping: I41("modal_letter_stamping.webp"),
    letterStamped: I41("modal_letter_stamped.webp"),
    pressSwitchFloor: I41("modal_press_switch_floor.webp"),
    pressSwitchFloorAfter: I41("modal_press_switch_floor_after.webp"),
    pressSwitchWall: I41("modal_press_switch_wall.webp"),
    pressSwitchWallAfter: I41("modal_press_switch_wall_after.webp"),
    bearCard: I41("modal_bear_card.webp"),
    bearFan: I41("modal_bear_fan.webp"),
    badend: I41("badend.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState41";
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
    inventory: [],
    main: {
      flags: {
        clearShiwake: false,
        openShutter: false,
        lettersShineEventDone: false,
        lettersShineModalShown: false,
        foundCard: false,
        foundBag: false,
        foundPaper: false,
        foundFan: false,
        foundManjuBox: false,
        foundMainDoorCabinetKey: false,
        foundMainChestTopDrawerEnvelopeNostamp: false,
        foundMainChestSecondDrawerHat: false,
        foundMainChestThirdDrawerMagicalPotion: false,
        unlockMainDoorCabinet: false,
        unlockBox: false,
        unlockMainChestTopDrawer: false,
        unlockMainChestSecondDrawer: false,
        unlockMainChestThirdDrawer: false,
        unlockManageBoard: false,
        unlockAdminDoor: false,
        clearMainDeskStampPuzzle: false,
        chargeEnergy: false,
        receiveCargo: false,
        receiveManjuBox: false,
        bearAppear: false,
        gaveSweetToBearFairy: false,
        fanCleaned: false,
        flypanCleaned: false,
        glassMelodySolved: false,
        boardDeskRewritten: false,
        boardDoorRewritten: false,
        boardChestRewritten: false,
        boardAdminRewritten: false,
        boardDoorAnswers: {},
        boardAdminButtonStep: 0,
        mainDoorCabinetInputs: [],
        mainDeskStampSelection: [],
        mainDeskBoxLetters: [0, 0, 0, 0, 0],
        mainChestTopDrawerColors: [0, 0, 0, 0],
        mainChestSecondDrawerDigits: { top: 1, right: 1, left: 1, bottom: 1 },
        mainChestThirdDrawerDigits: [0, 0, 0],
        putCardOnSwitch: false,
        openBlueShutter: false,
        deliveryRecordDropped: false,
        transferPanel: {
          started: false,
          mode: "receive",
          destination: "1",
          message: "",
          status: "RECEIVE READY",
        },
        returnShelfItems: {},
        transferBearFanOpenedCount: 0,
        glassWithWineDrinkCount: 0,
        sheetStamps: {},
        timePhase: 0,
        weatherSkyState: 0,
        isNight: false,
        talkTo: { bear: 0, wizard: 0 },
      },
    },
    shiwake: {
      envelopes: {
        envelope1: null,
        envelope2: null,
        envelope3: null,
        envelope4: null,
        envelope5: null,
      },
      flags: {
        selectedEnvelope: null,
        solved: false,
        envelopeStampPlaced: false,
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

    selectedItem: null,
    selectedItemSlot: null,
    usingItem: null,
    inventoryPage: 0,
  };
}

let gameState = getDefaultGameState();
let daemonBearEatingTimer = null;

const SHIWAKE_BOXES = [
  { slot: 1, label: "WATER", color: "#0072B2" },
  { slot: 2, label: "GOLDEN", color: "#F0E442" },
  { slot: 3, label: "MOON", color: "#CC79A7" },
  { slot: 4, label: "FIRE", color: "#D55E00" },
  { slot: 5, label: "WOOD", color: "#009E73" },
];
const SHIWAKE_ENVELOPES = ["envelope1", "envelope2", "envelope3", "envelope4", "envelope5"];
const SHIWAKE_CORRECT = { envelope1: 3, envelope2: 1, envelope3: 5, envelope4: 2, envelope5: 4 };

function getShiwakeState() {
  if (!gameState.shiwake) gameState.shiwake = {};
  if (!gameState.shiwake.envelopes) gameState.shiwake.envelopes = {};
  SHIWAKE_ENVELOPES.forEach((key) => {
    if (!(key in gameState.shiwake.envelopes)) gameState.shiwake.envelopes[key] = null;
  });
  if (!gameState.shiwake.flags) gameState.shiwake.flags = {};
  return gameState.shiwake;
}

function getShiwakeBoxArea(slot) {
  const idx = slot - 1;
  return { x: 2 + idx * 19.4, y: 9, width: 18.4, height: 48 };
}

function getShiwakeEnvelopeHomeArea(index) {
  return { x: 4 + index * 18.7, y: 61, width: 17.5, height: 15.5 };
}

function getShiwakeOkArea() {
  return { x: 50, y: 83, width: 12.5, height: 8.8 };
}

function getShiwakeZoomArea() {
  return { x: 38, y: 83, width: 9, height: 8.8 };
}

function getShiwakeEnvelopeArea(envelopeKey) {
  const state = getShiwakeState();
  const slot = state.envelopes[envelopeKey];
  const index = SHIWAKE_ENVELOPES.indexOf(envelopeKey);
  if (!slot) return getShiwakeEnvelopeHomeArea(index);

  const box = getShiwakeBoxArea(slot);
  const inSlot = SHIWAKE_ENVELOPES.filter((key) => state.envelopes[key] === slot);
  const order = Math.max(0, inSlot.indexOf(envelopeKey));
  return {
    x: box.x + 1.4,
    y: box.y + 13.8 + order * 6.0,
    width: box.width - 2.8,
    height: 11.3,
  };
}

function selectShiwakeEnvelope(envelopeKey) {
  const state = getShiwakeState();
  if (state.flags.solved) return;
  state.flags.selectedEnvelope = state.flags.selectedEnvelope === envelopeKey ? null : envelopeKey;
  updateMessage(state.flags.selectedEnvelope ? `${envelopeKey.replace("envelope", "封筒")}を選んだ` : "封筒の選択をやめた");
  renderCanvasRoom();
}

function moveSelectedShiwakeEnvelope(slot) {
  if (tryPlaceStampedEnvelopeInShiwake(slot)) return;

  const state = getShiwakeState();
  const selected = state.flags.selectedEnvelope;
  if (!selected) {
    if (gameState.main.flags.lettersShineEventDone) {
      updateMessage("仕分け用の箱だ");
      return true;
    }
    if (state.flags.solved || gameState.main.flags.clearShiwake) {
      updateMessage("箱に封筒が仕分けられている");
      return;
    }
    updateMessage("移動する封筒を選んでください");
    return;
  }
  state.envelopes[selected] = slot;
  updateMessage("封筒を箱に仕分けた");
  renderCanvasRoom();
}

function tryPlaceStampedEnvelopeInShiwake(slot) {
  if (gameState.selectedItem !== "envelopeStamp") return false;

  const state = getShiwakeState();
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.clearShiwake) {
    updateMessage("まず、最初の5つの封筒を仕分けよう");
    return true;
  }

  if (state.flags.envelopeStampPlaced || f.lettersShineEventDone) {
    updateMessage("切手を貼った封筒はもう置いてある");
    return true;
  }

  if (slot !== 2) {
    playSE?.("se-error");
    updateMessage("ここに置くものではないようだ");
    return true;
  }

  state.flags.envelopeStampPlaced = true;
  markProgress?.("letters_shine_event");
  removeItem("envelopeStamp");
  startShiwakeBoxesShine();
  setTimeout(() => {
    f.lettersShineEventDone = true;
    renderCanvasRoom?.();
    tryShowLettersShineModal();
  }, 650);
  updateMessage("切手を貼った封筒をGOLDENの仕分け箱に置くと、封筒が光ってどこかへ移動したようだ");
  return true;
}

function startShiwakeBoxesShine() {
  const fx = gameState.fx || (gameState.fx = {});
  fx.shiwakeBoxesShineUntil = Date.now() + 900;
  playSE?.("se-fanta");

  const tick = () => {
    renderCanvasRoom?.();
    if ((gameState.fx?.shiwakeBoxesShineUntil || 0) > Date.now()) {
      requestAnimationFrame(tick);
    }
  };
  tick();
}

function showLettersShineModal() {
  const frames = [IMAGES.modals.lettersShine1, IMAGES.modals.lettersShine2, IMAGES.modals.lettersShine3];
  const content = `
    <div class="modal-anim frames" style="aspect-ratio:1 / 1;">
      ${frames.map((src) => `<img src="${src}" alt="">`).join("")}
    </div>
  `;
  showModal("封筒が光った", content, [{ text: "閉じる", action: "close" }]);
}

function tryShowLettersShineModal() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.clearShiwake || !f.lettersShineEventDone || f.lettersShineModalShown) return;
  f.lettersShineModalShown = true;
  showLettersShineModal();
}

function showSelectedShiwakeEnvelope() {
  if (gameState.main.flags.lettersShineEventDone) {
    updateMessage("封筒はもう確認できない");
    return;
  }

  const selected = getShiwakeState().flags.selectedEnvelope;
  if (!selected) {
    updateMessage("拡大する封筒を選んでください");
    return;
  }
  showObj(null, "", IMAGES.items[selected], `${selected.replace("envelope", "封筒")}を確認した`);
}

function checkShiwakeAnswer() {
  const state = getShiwakeState();
  if (state.flags.solved) return;

  const ok = SHIWAKE_ENVELOPES.every((key) => state.envelopes[key] === SHIWAKE_CORRECT[key]);
  if (ok) {
    state.flags.solved = true;
    state.flags.selectedEnvelope = null;
    gameState.main.flags.clearShiwake = true;
    markProgress?.("clear_shiwake");
    playSE?.("se-clear");
    showModal("仕分け完了", "<p>正しく仕分けできた。近くで物音がしたようだ</p>", [{ text: "閉じる", action: "close" }], tryShowLettersShineModal);
    updateMessage("正しく仕分けできた。近くで物音がしたようだ");
  } else {
    updateMessage("仕分けが違うようだ");
  }
  renderCanvasRoom();
}

// 部屋データ
let rooms = {
  shiwake: {
    name: "郵便仕分け室",
    description: "",
    clickableAreas: [
      ...SHIWAKE_BOXES.map((box) => ({
        x: () => getShiwakeBoxArea(box.slot).x,
        y: () => getShiwakeBoxArea(box.slot).y,
        width: () => getShiwakeBoxArea(box.slot).width,
        height: () => getShiwakeBoxArea(box.slot).height,
        onClick: clickWrap(() => moveSelectedShiwakeEnvelope(box.slot)),
        description: `${box.label}の仕分け箱`,
        zIndex: 4,
        usable: () => true,
      })),
      ...SHIWAKE_ENVELOPES.map((key) => ({
        x: () => getShiwakeEnvelopeArea(key).x,
        y: () => getShiwakeEnvelopeArea(key).y,
        width: () => getShiwakeEnvelopeArea(key).width,
        height: () => getShiwakeEnvelopeArea(key).height,
        onClick: clickWrap(() => selectShiwakeEnvelope(key)),
        description: key.replace("envelope", "封筒"),
        zIndex: 9,
        usable: () => !getShiwakeState().flags.solved,
        item: { img: key, visible: () => !gameState.main.flags.lettersShineEventDone },
      })),
      {
        x: () => getShiwakeZoomArea().x,
        y: () => getShiwakeZoomArea().y,
        width: () => getShiwakeZoomArea().width,
        height: () => getShiwakeZoomArea().height,
        onClick: clickWrap(showSelectedShiwakeEnvelope),
        description: "虫眼鏡ボタン",
        zIndex: 6,
        usable: () => !gameState.main.flags.lettersShineEventDone,
      },
      {
        x: () => getShiwakeOkArea().x,
        y: () => getShiwakeOkArea().y,
        width: () => getShiwakeOkArea().width,
        height: () => getShiwakeOkArea().height,
        onClick: clickWrap(checkShiwakeAnswer),
        description: "OKボタン",
        zIndex: 6,
        usable: () => !getShiwakeState().flags.solved,
      },
      {
        x: 89,
        y: 84,
        width: 8,
        height: 8,
        onClick: clickWrap(function () {
          changeRoom("mainChest");
        }),
        description: "仕分け室戻る",
        zIndex: 7,
        usable: () => true,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  mainDoor: {
    name: "郵便局の出口ドア前",
    description: "",
    clickableAreas: [
      {
        x: 38,
        y: 2.6,
        width: 21.9,
        height: 21.9,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "fanOpened") {
            playMainDoorFlagShakeFx();
            updateMessage("開いた扇子で旗をあおいだ。");
            return;
          }

          updateMessage("旗が飾られている。");
        }),
        description: "旗右",
        zIndex: 5,
        usable: () => true,
        item: { img: "flag", visible: () => true },
      },
      {
        x: 6.3,
        y: 27.4,
        width: 28.8,
        height: 22.4,
        onClick: clickWrap(function () {
          changeRoom("boardDoor");
        }),
        description: "ドア横黒板",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 61.1,
        y: 11.2,
        width: 8.5,
        height: 5.5,
        onClick: clickWrap(function () {}),
        description: "ドア上手紙マーク",
        zIndex: 5,
        usable: () => false,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 50.5,
        y: 26.7,
        width: 29.3,
        height: 60.9,
        onClick: clickWrap(function () {
          if (gameState.fx?.mainDoorExitPending) return;

          if (!hasItem("bag") || !hasItem("hat")) {
            playMainDoorLetterErrorFlash();
            playSE?.("se-pon");
            showToast("退室チェックエラー。配達員の装備が揃っていません");
            updateMessage("退室チェックエラー。配達員の装備が揃っていません");
            return;
          }

          playMainDoorLetterClearFlash();
          playSE?.("se-fanta");
          showToast("退室チェッククリア。配達員を送出します");
          removeItemsOnEndingArrival(["bag", "hat"]);

          const fx = gameState.fx || (gameState.fx = {});
          fx.mainDoorExitPending = true;
          fx.lockInput = true;
          setTimeout(() => {
            flashScreen("black", 900);
          }, 850);
          setTimeout(() => {
            if (gameState.fx) {
              delete gameState.fx.mainDoorExitPending;
              gameState.fx.lockInput = false;
            }
            changeRoom("end");
          }, 1050);
        }),
        description: "ドア",
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
            changeRoom("mainChest");
          },
          { allowAtNight: true },
        ),
        description: "ドア面左、たんす面へ",
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
            changeRoom("mainAdminDoor");
          },
          { allowAtNight: true },
        ),
        description: "ドア面右、転送室ドア面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  boardDoor: {
    name: "黒板",
    description: "",
    clickableAreas: [
      {
        x: 90,
        y: 88,
        width: 8,
        height: 8,
        onClick: clickWrap(
          function () {
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "黒板戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
      {
        x: 38.5,
        y: 76.5,
        width: 23,
        height: 20,
        onClick: clickWrap(handleBoardDoorWifiClick),
        description: "黒板下の通信機",
        zIndex: 8,
        usable: () => true,
        item: { img: "wifi4", visible: () => true },
      },
      {
        x: () => getBoardDoorTableMetrics().x,
        y: () => getBoardDoorTableMetrics().y,
        width: () => getBoardDoorTableMetrics().width,
        height: () => getBoardDoorTableMetrics().height,
        onClick: clickWrap(handleBoardDoorTableClick),
        description: "ドア横黒板の表",
        zIndex: 6,
        usable: () => !!(gameState.main.flags || {}).boardDoorRewritten,
      },
      {
        x: () => getBoardDoorCellArea("seasideAddress").x,
        y: () => getBoardDoorCellArea("seasideAddress").y,
        width: () => getBoardDoorCellArea("seasideAddress").width,
        height: () => getBoardDoorCellArea("seasideAddress").height,
        onClick: clickWrap(() => showBoardDoorAnswerInput("seasideAddress")),
        description: "ドア横黒板 ADDRESS 不明欄",
        zIndex: 7,
        usable: () => isBoardDoorBlankClickable("seasideAddress"),
      },
      {
        x: () => getBoardDoorCellArea("solisArea").x,
        y: () => getBoardDoorCellArea("solisArea").y,
        width: () => getBoardDoorCellArea("solisArea").width,
        height: () => getBoardDoorCellArea("solisArea").height,
        onClick: clickWrap(() => showBoardDoorAnswerInput("solisArea")),
        description: "ドア横黒板 AREA 不明欄",
        zIndex: 7,
        usable: () => isBoardDoorBlankClickable("solisArea"),
      },
    ],
  },
  mainChest: {
    name: "タンスのある面",
    description: "",
    clickableAreas: [
      {
        x: 25.0,
        y: 46.0,
        width: 45.2,
        height: 7.2,
        onClick: clickWrap(function () {
          changeRoom("shiwake");
        }),
        description: "仕分けボックス",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 67.6,
        y: 49.0,
        width: 10.9,
        height: 3.9,
        onClick: clickWrap(function () {}),
        description: "封筒",
        zIndex: 5,
        usable: () => false,
        item: { img: "envelopes", visible: () => !gameState.main.flags.clearShiwake },
      },
      {
        x: 44.8,
        y: 32.7,
        width: 13.2,
        height: 7.5,
        onClick: clickWrap(function () {
          acquireItemOnce("foundCard", "card", "ずっしりと重く、魔力を放つカードがある", IMAGES.items.card, "魔法のカードを手に入れた");
        }),
        description: "壁の隠し収納",
        zIndex: 5,
        usable: () => gameState.main.flags.clearShiwake,
        item: { img: "blackBack", visible: () => gameState.main.flags.clearShiwake },
      },
      {
        x: 47.4,
        y: 34.1,
        width: 7.9,
        height: 4.8,
        onClick: clickWrap(function () {}),
        description: "壁の隠し収納の中のカード",
        zIndex: 5,
        usable: () => false,
        item: { img: "card", visible: () => gameState.main.flags.clearShiwake && !gameState.main.flags.foundCard },
      },
      {
        x: 3.0,
        y: 25.3,
        width: 20.6,
        height: 24.2,
        onClick: clickWrap(function () {
          changeRoom("boardChest");
        }),
        description: "引き出しそばの黒板",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 26.1,
        y: 58.7,
        width: 48.1,
        height: 6.6,
        onClick: clickWrap(showMainChestTopDrawerPuzzle),
        description: "引き出し一段目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 26.2,
        y: 67.5,
        width: 47.9,
        height: 6.7,
        onClick: clickWrap(showMainChestSecondDrawerPuzzle),
        description: "引き出し2段目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 25.9,
        y: 76.3,
        width: 48.0,
        height: 6.6,
        onClick: clickWrap(showMainChestThirdDrawerPuzzle),
        description: "引き出し3段目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.2,
        y: 72.4,
        width: 24.4,
        height: 22.9,
        onClick: clickWrap(function () {
          if (!gameState.main.flags.lettersShineEventDone) {
            updateMessage("かばんが置かれている");
            return;
          }
          acquireItemOnce("foundBag", "bag", "かばんがある", IMAGES.items.bag, "かばんを手に入れた");
        }),
        description: "かばん",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundBag,
        glowWhen: () => gameState.main.flags.lettersShineEventDone && !gameState.main.flags.foundBag,
        glowColor: "255, 248, 178",
        glowCheck: false,
        glowSoft: true,
        item: { img: "bag", visible: () => !gameState.main.flags.foundBag },
      },
      {
        x: 83.7,
        y: 81.0,
        width: 12.9,
        height: 8.9,
        onClick: clickWrap(function () {
          acquireItemOnce("foundPaper", "paper", "紙が落ちている", IMAGES.items.paper, "穴が開いた紙を手に入れた");
        }),
        description: "かばんを取った後に落ちている紙",
        zIndex: 5,
        usable: () => gameState.main.flags.foundBag && !gameState.main.flags.foundPaper,
        item: { img: "paper", visible: () => gameState.main.flags.foundBag && !gameState.main.flags.foundPaper },
      },
      {
        x: 1.1,
        y: 77.1,
        width: 19.1,
        height: 8.9,
        onClick: clickWrap(handleMainChestFloorSwitchClick),
        description: "床のスイッチ",
        zIndex: 5,
        usable: () => !(gameState.main.flags.deliveryRecordDropped && !gameState.main.flags.putCardOnSwitch),
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 4.1,
        y: 78.8,
        width: 12.5,
        height: 2.5,
        onClick: clickWrap(function () {}),
        description: "床のスイッチ発光部分",
        zIndex: 5,
        usable: () => false,
        glowWhen: () => gameState.main.flags.putCardOnSwitch,
        glowColor: "80, 210, 255",
        glowCheck: false,
        pressedWhen: () => gameState.main.flags.putCardOnSwitch,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 7.5,
        y: 77.3,
        width: 5.7,
        height: 6.2,
        onClick: clickWrap(function () {}),
        description: "床のスイッチの上に置かれたカード",
        zIndex: 5,
        usable: () => false,
        item: { img: "card", visible: () => gameState.main.flags.putCardOnSwitch },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainDesk");
          },
          { allowAtNight: true },
        ),
        description: "たんす面左、机面へ",
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
        description: "たんす面右、ドア面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  boardChest: {
    name: "黒板",
    description: "",
    clickableAreas: [
      {
        x: 90,
        y: 88,
        width: 8,
        height: 8,
        onClick: clickWrap(
          function () {
            changeRoom("mainChest");
          },
          { allowAtNight: true },
        ),
        description: "黒板戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
      {
        x: 38.5,
        y: 76.5,
        width: 23,
        height: 20,
        onClick: clickWrap(handleBoardChestWifiClick),
        description: "黒板下の通信機",
        zIndex: 8,
        usable: () => true,
        item: { img: "wifi2", visible: () => true },
      },
    ],
  },
  mainDesk: {
    name: "机がある面",
    description: "",
    clickableAreas: [
      {
        x: 18.7,
        y: 27.2,
        width: 31.6,
        height: 22.1,
        onClick: clickWrap(function () {
          changeRoom("boardDesk");
        }),
        description: "デスク前の黒板",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 15.9,
        y: 53.2,
        width: 14.8,
        height: 13.3,
        onClick: clickWrap(showMainDeskBoxPuzzle),
        description: "机上の箱",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 17.3,
        y: 54.8,
        width: 12.5,
        height: 5.6,
        onClick: clickWrap(function () {}),
        description: "机上の箱開いた後の黒部分",
        zIndex: 5,
        usable: () => false,
        item: { img: "blackBack", visible: () => gameState.main.flags.unlockBox },
      },
      {
        x: 17.5,
        y: 55.6,
        width: 11.6,
        height: 4.1,
        onClick: clickWrap(function () {
          acquireItemOnce("foundFan", "fanClosed", "箱の中に扇子がある", IMAGES.items.fanClosed, "扇子を手に入れた");
        }),
        description: "机上の箱開いた後の黒部分内部の扇子",
        zIndex: 5,
        usable: () => gameState.main.flags.unlockBox && !gameState.main.flags.foundFan,
        item: { img: "fanPart", visible: () => gameState.main.flags.unlockBox && !gameState.main.flags.foundFan },
      },

      {
        x: 30.7,
        y: 55.4,
        width: 28.7,
        height: 18.6,
        onClick: clickWrap(function () {
          if (hasItem("envelopeNostamp")) {
            showMainDeskStampPuzzle();
            return;
          }

          updateMessage("業務用のデスクだ。封筒に切手を貼ったりすることができそうだ");
        }),
        description: "デスク上",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 64.4,
        y: 65.7,
        width: 14.2,
        height: 10.5,
        onClick: clickWrap(showMainDeskDraftLetterModal),
        description: "書きかけの手紙",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 38.8,
        y: 81.1,
        width: 13.9,
        height: 13.9,
        onClick: clickWrap(function () {
          updateMessage("椅子がある");
        }),
        description: "椅子",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 79.2,
        y: 65.1,
        width: 20.3,
        height: 25.7,
        onClick: clickWrap(function () {
          showMainDeskBaggageModal(1);
        }),
        description: "置かれた荷物",
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
            changeRoom("mainAdminDoor");
          },
          { allowAtNight: true },
        ),
        description: "机がある面左、転送室ドア面へ",
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
            changeRoom("mainChest");
          },
          { allowAtNight: true },
        ),
        description: "机がある面右、たんす面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  boardDesk: {
    name: "黒板",
    description: "",
    clickableAreas: [
      {
        x: 90,
        y: 88,
        width: 8,
        height: 8,
        onClick: clickWrap(
          function () {
            changeRoom("mainDesk");
          },
          { allowAtNight: true },
        ),
        description: "黒板戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
      {
        x: 38.5,
        y: 76.5,
        width: 23,
        height: 20,
        onClick: clickWrap(handleBoardDeskWifiClick),
        description: "黒板下の通信機",
        zIndex: 8,
        usable: () => true,
        item: { img: "wifi3", visible: () => true },
      },
    ],
  },
  transferRoom: {
    name: "荷物の転送室",
    description: "",
    clickableAreas: [
      {
        x: 40.5,
        y: 21.5,
        width: 18.4,
        height: 29.1,
        onClick: clickWrap(showTransferPanelModal),
        description: "操作パネル",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 43.3,
        y: 52.8,
        width: 14.2,
        height: 13.7,
        onClick: clickWrap(showReceivedCargoBoxModal),
        description: "受信した箱",
        zIndex: 5,
        usable: () => gameState.main.flags.receiveCargo && !gameState.main.flags.bearAppear,
        item: { img: "boxClosed", visible: () => gameState.main.flags.receiveCargo && !gameState.main.flags.bearAppear },
      },
      {
        x: 43.8,
        y: 58.5,
        width: 9.4,
        height: 8.9,
        onClick: clickWrap(function () {
          acquireItemOnce("foundManjuBox", "manjuBox", "溶岩饅頭を手に入れた", IMAGES.items.manjuBox, "溶岩饅頭を手に入れた");
        }),
        description: "受信した饅頭ボックス",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundManjuBox && gameState.main.flags.receiveManjuBox,
        item: { img: "manjuBox", visible: () => !gameState.main.flags.foundManjuBox && gameState.main.flags.receiveManjuBox },
      },
      {
        x: 78.5,
        y: 24.9,
        width: 18.5,
        height: 21.9,
        onClick: clickWrap(handleReturnShelfClick),
        description: "備品棚のシャッター",
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
        description: "備品棚のシャッター内部",
        zIndex: 5,
        usable: () => false,
        item: { img: "insideShutter", visible: () => gameState.main.flags.openShutter },
      },
      {
        x: 78.7,
        y: 24.8,
        width: 12.8,
        height: 11.4,
        onClick: clickWrap(() => retrieveReturnShelfItem("hat")),
        description: "シャッター内帽子",
        zIndex: 8,
        usable: () => isReturnShelfItemPlaced("hat"),
        item: { img: "hat", visible: () => isReturnShelfItemPlaced("hat") },
      },
      {
        x: 78.1,
        y: 35.1,
        width: 10.6,
        height: 10.7,
        onClick: clickWrap(() => retrieveReturnShelfItem("card")),
        description: "シャッター内カード",
        zIndex: 8,
        usable: () => isReturnShelfItemPlaced("card"),
        item: { img: "card", visible: () => isReturnShelfItemPlaced("card") },
      },
      {
        x: 85.3,
        y: 33.5,
        width: 12.6,
        height: 12.7,
        onClick: clickWrap(() => retrieveReturnShelfItem("bag")),
        description: "シャッター内かばん",
        zIndex: 8,
        usable: () => isReturnShelfItemPlaced("bag"),
        item: { img: "bag", visible: () => isReturnShelfItemPlaced("bag") },
      },
      {
        x: 5.4,
        y: 62.1,
        width: 20.6,
        height: 20.6,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "card") {
            showObj(null, "「うわあー」", IMAGES.modals.bearCard, "「うわあー」");
            return;
          }
          if (gameState.selectedItem == "manjuBox") {
            updateMessage("「わあ、美味しそうー。ボクのおやつ？」");
            return;
          }
          if (gameState.selectedItem === "fanOpened") {
            handleTransferBearFanOpenedUse();
            return;
          }
          talkToHintCharacter("main", "bear");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.main.flags.bearAppear,
        item: { img: "bear", visible: () => gameState.main.flags.bearAppear },
      },
      {
        x: 1.5,
        y: 56.5,
        width: 10.5,
        height: 9.6,
        onClick: clickWrap(function () {
          updateMessage("はかりの数字は動いていない。クマ妖精は浮いているのかもしれない");
        }),
        description: "はかり",
        zIndex: 5,
        usable: () => gameState.main.flags.bearAppear,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 39.6,
        y: 70.1,
        width: 18.0,
        height: 13.0,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.items.cargoTag, "荷札が落ちている");
        }),
        description: "破れた荷札",
        zIndex: 5,
        usable: () => gameState.main.flags.bearAppear,
        item: { img: "cargoTag", visible: () => gameState.main.flags.bearAppear },
      },
      {
        x: 1.2,
        y: 33.4,
        width: 19.3,
        height: 7.1,
        onClick: clickWrap(function () {
          updateMessage("『人材調達および定着化計画書』というファイルが置かれている");
        }),
        description: "棚のファイル",
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
            changeRoom("mainAdminDoor");
          },
          { allowAtNight: true },
        ),
        description: "転送室戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },

  mainAdminDoor: {
    name: "奥の部屋へのドアがある面",
    description: "",
    clickableAreas: [
      {
        x: 67.7,
        y: 60.4,
        width: 0.6,
        height: 1.7,
        onClick: clickWrap(function () {}),
        description: "ドアロック部",
        zIndex: 5,
        usable: () => false,
        item: { img: () => (gameState.main.flags.unlockAdminDoor ? "greenBack" : "redBack"), visible: () => true },
      },
      {
        x: 69.0,
        y: 36.7,
        width: 20.0,
        height: 50.6,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockAdminDoor) {
            changeRoom("transferRoom");
            return;
          }

          updateMessage("室内のドアはロックされている。");
        }),
        description: "転送室ドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 57.8,
        y: 62.9,
        width: 5.3,
        height: 4.8,
        onClick: clickWrap(handleMainAdminDoorWallSwitchClick),
        description: "壁のスイッチ",
        zIndex: 5,
        usable: () => !gameState.main.flags.deliveryRecordDropped,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 47.7,
        y: 93.1,
        width: 12.1,
        height: 5.5,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.items.deliveryRecord, "配達記録のようだ");
        }),
        description: "落ちてきた配達記録",
        zIndex: 5,
        usable: () => gameState.main.flags.deliveryRecordDropped,
        item: { img: "deliveryRecord", visible: () => gameState.main.flags.deliveryRecordDropped },
      },
      {
        x: 41.3,
        y: 39.6,
        width: 15.8,
        height: 21.3,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.shelf, "棚がある");
        }),
        description: "棚",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 11.0,
        y: 26.6,
        width: 29.3,
        height: 36.8,
        onClick: clickWrap(handleMainAdminDoorControlPanelClick),
        description: "制御盤",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 21.3,
        y: 41.2,
        width: 9.3,
        height: 5.8,
        onClick: clickWrap(function () {}),
        description: "制御盤ロック",
        zIndex: 5,
        usable: () => true,
        item: { img: "lockManage", visible: () => !gameState.main.flags.unlockManageBoard },
      },
      {
        x: 4.3,
        y: 63.8,
        width: 12.6,
        height: 11.1,
        onClick: clickWrap(handleMainAdminDoorEnergyTankClick),
        description: "エネルギータンク",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 6.0,
        y: 66.9,
        width: 9.6,
        height: 6.3,
        onClick: clickWrap(function () {}),
        description: "タンク内エネルギー表示部",
        zIndex: 5,
        usable: () => false,
        item: { img: "potionBack", visible: () => gameState.main.flags.chargeEnergy },
      },
      {
        x: 34.5,
        y: 75.5,
        width: 15.2,
        height: 15.3,
        onClick: clickWrap(function () {
          showObj(null, "見取り図のようだ", IMAGES.items.map, "部屋の見取り図のようだ");
        }),
        description: "map",
        zIndex: 5,
        usable: () => true,
        item: { img: "map", visible: () => true },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "天井の閉じた青いシャッター",
        zIndex: 5,
        usable: () => false,
        item: { img: "shutterClose", visible: () => !gameState.main.flags.openBlueShutter },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "天井の開いた青いシャッター",
        zIndex: 5,
        usable: () => false,
        item: { img: "shutterOpen", visible: () => gameState.main.flags.openBlueShutter },
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
        description: "転送室ドア面左、ドア面へ",
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
            changeRoom("mainDesk");
          },
          { allowAtNight: true },
        ),
        description: "転送室ドア右、机面へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },

  boardAdmin: {
    name: "管理制御盤",
    description: "",
    clickableAreas: [
      {
        x: 90,
        y: 88,
        width: 8,
        height: 8,
        onClick: clickWrap(
          function () {
            changeRoom("mainAdminDoor");
          },
          { allowAtNight: true },
        ),
        description: "制御盤戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
      {
        x: 38.5,
        y: 76.5,
        width: 23,
        height: 20,
        onClick: clickWrap(handleBoardAdminWifiClick),
        description: "制御盤下の通信機",
        zIndex: 8,
        usable: () => true,
        item: { img: "wifi2Black", visible: () => true },
      },
      ...[0, 1, 2, 3, 4, 5].map((idx) => ({
        x: () => getBoardAdminButtonArea(idx).x,
        y: () => getBoardAdminButtonArea(idx).y,
        width: () => getBoardAdminButtonArea(idx).width,
        height: () => getBoardAdminButtonArea(idx).height,
        onClick: clickWrap(() => pressBoardAdminButton(idx)),
        description: `管理制御盤 ${idx + 1}番ボタン`,
        zIndex: 7,
        usable: () => !((gameState.main.flags || {}).boardAdminRewritten || (gameState.main.flags || {}).unlockAdminDoor),
      })),
      {
        x: () => getBoardAdminOkArea().x,
        y: () => getBoardAdminOkArea().y,
        width: () => getBoardAdminOkArea().width,
        height: () => getBoardAdminOkArea().height,
        onClick: clickWrap(submitBoardAdminButtons),
        description: "管理制御盤 OKボタン",
        zIndex: 7,
        usable: () => !((gameState.main.flags || {}).boardAdminRewritten || (gameState.main.flags || {}).unlockAdminDoor),
      },
    ],
  },

  end: {
    name: "ノーマルエンド",
    description: "不思議な郵便局から脱出できました。配達を頑張りましょう",
    clickableAreas: [
      {
        x: 30.0,
        y: 46.8,
        width: 17.1,
        height: 37.8,
        onClick: clickWrap(function () {
          updateMessage("帽子をかぶると、配達員の心得が頭に浮かんできた。そうだ。きっと自分は配達員だったんだ");
        }),
        description: "配達員",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 15.5,
        y: 70.5,
        width: 12.8,
        height: 15.1,
        onClick: clickWrap(function () {
          updateMessage("「郵便屋さんになるの？がんばってー」");
        }),
        description: "見送るクマ妖精",
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
    name: "トゥルーエンド",
    description: "クマ妖精と一緒に地球に向かっています。脱出おめでとうございます。",
    clickableAreas: [
      {
        x: 15.5,
        y: 17.7,
        width: 20.5,
        height: 24.3,
        onClick: clickWrap(function () {
          updateMessage("「もうすぐ着くね」");
        }),
        description: "宇宙のクマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 48.1,
        y: 60.8,
        width: 50.6,
        height: 38.2,
        onClick: clickWrap(function () {
          if (hasItem("manjuBox")) {
            startTrueEndManjuBoxTransition();
            return;
          } else {
            updateMessage("地球にもうすぐ着きそうだ");
          }
        }),
        description: "地球",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 32.4,
        y: 0.7,
        width: 32.9,
        height: 14.1,
        onClick: clickWrap(function () {
          updateMessage("外は猛暑ですが、お部屋はとても涼しいです");
        }),
        description: "エアコン",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 14.5,
        y: 21.7,
        width: 70.9,
        height: 51.9,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "fanOpened") {
            showObj(null, "「・・・」", IMAGES.modals.bearFan, "クマ妖精は、何かを空想しているようだ");
            return;
          }
          updateMessage("美味しいと良いね");
        }),
        description: "まんじゅうを食べるクマとプレイヤー",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
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
    bear: ["「呼んだ？」", "「呼ばれたような気がしたんだ」", "「でも、ちょっと帰りたいかも」"],
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

// ゲーム初期化
function initGame() {
  renderNavigation();
  changeRoom("mainDoor");
  updateInventoryDisplay();
  updateMessage("気が付くと見知らぬ郵便局に立っていた");
  try {
    renderStatusIcons();
  } catch (e) {}
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

  if (roomId === "end" || roomId === "trueEnd") {
    removeItemsOnEndingArrival(["paper"]);
  }

  gameState.currentRoom = roomId;
  const room = rooms[roomId];
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (roomId === "end") {
    const endFlags = gameState.end?.flags || (gameState.end = { flags: { backgroundState: 0 } }).flags;
    if (f.bearAppear) {
      endFlags.backgroundState = 1;
    } else if (gameState.tvDinner?.flags?.backgroundState === 0) {
      endFlags.backgroundState = 0;
    }
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
    const trueEndBgState = gameState.trueEnd?.flags?.backgroundState ?? 0;
    changeBGM(trueEndBgState === 1 ? S41("otenba_jenifer.mp3") : S41("space_hopper.mp3"));
  } else if (roomId === "end") {
    const endBgState = gameState.end?.flags?.backgroundState ?? 0;
    changeBGM(endBgState === 0 ? S41("Heliopause_Waltz.mp3") : S41("Heliopause_Waltz.mp3"));
  } else {
    changeBGM(DEFAULT_BGM);
  }

  // nav

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
  drawMainDoorLetterStatusFlash(ctx, canvas, roomId);
  drawShiwakeEnvelopeSelection(ctx, canvas, roomId);
  drawClickableAreaGlows(ctx, canvas, roomId);
  drawDeliveryRecordFallFx(ctx, canvas, roomId);
  drawDeskDrawerOpenFx(ctx, canvas, roomId);

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





function playMainDoorFlagShakeFx() {
  const fx = gameState.fx || (gameState.fx = {});
  const id = Date.now();
  fx.mainDoorFlagShake = {
    id,
    roomId: "mainDoor",
    progress: 0,
  };

  renderCanvasRoom?.();

  const duration = 1100;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.mainDoorFlagShake;
    if (!currentFx || currentFx.id !== id) return;

    const t = Math.min(1, (now - start) / duration);
    currentFx.progress = t;
    renderCanvasRoom?.();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.mainDoorFlagShake;
    renderCanvasRoom?.();
  };

  requestAnimationFrame(tick);
}

function playMainDoorLetterErrorFlash() {
  playMainDoorLetterStatusFlash("error");
}

function playMainDoorLetterClearFlash() {
  playMainDoorLetterStatusFlash("clear");
}

function playMainDoorLetterStatusFlash(variant = "error") {
  const fx = gameState.fx || (gameState.fx = {});
  const id = Date.now();
  fx.mainDoorLetterStatusFlash = {
    id,
    roomId: "mainDoor",
    progress: 0,
    variant,
  };

  renderCanvasRoom?.();

  const duration = 1300;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.mainDoorLetterStatusFlash;
    if (!currentFx || currentFx.id !== id) return;

    const t = Math.min(1, (now - start) / duration);
    currentFx.progress = t;
    renderCanvasRoom?.();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.mainDoorLetterStatusFlash;
    renderCanvasRoom?.();
  };

  requestAnimationFrame(tick);
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

function showMainDeskDraftLetterModal() {
  const content = `
    <div style="max-width:420px; margin:0 auto; padding:26px 30px; background:#fff8dc; color:#2a2116; border:1px solid #d9c58d; box-shadow:inset 0 0 28px rgba(130,95,35,0.14), 0 6px 18px rgba(60,40,20,0.18); text-align:left; line-height:1.9; font-size:1.04em;">
      行き先が見つからないときは、その場所を強く念じながら、進む力をしばらく込めてみるといい。
    </div>
  `;
  showModal("書きかけの手紙", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("書きかけの手紙がある。");
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


function handleBoardDeskWifiClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (gameState.selectedItem !== "card") {
    updateMessage("なにかをかざす場所のようだ");
    return;
  }

  f.boardDeskRewritten = !f.boardDeskRewritten;
  playSE?.("se-cyber");
  renderCanvasRoom();
  updateMessage(f.boardDeskRewritten ? "カードの力で黒板の内容が書き換わった" : "カードの力で黒板の内容が元に戻った");
}

function handleBoardDoorWifiClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (gameState.selectedItem !== "card") {
    updateMessage("なにかをかざす場所のようだ");
    return;
  }

  f.boardDoorRewritten = !f.boardDoorRewritten;
  playSE?.("se-cyber");
  renderCanvasRoom();
  updateMessage(f.boardDoorRewritten ? "カードの力で黒板の内容が書き換わった" : "カードの力で黒板の内容が元に戻った");
}

function handleBoardDoorTableClick() {
  if (gameState.selectedItem !== "paper") {
    updateMessage("住所録だ");
    return;
  }

  const answers = getBoardDoorAnswersFlag();
  const imgSrc = answers.seasideAddress ? IMAGES.modals.paperOnSuccess : IMAGES.modals.paperOnFailure;
  showModal("穴が開いた紙を重ねてみた", `<img src="${imgSrc}" class="showobj-image" alt="穴が開いた紙">`, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
  updateMessage("穴が開いた紙を表に重ねてみた");
}

function handleMainAdminDoorEnergyTankClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockManageBoard) {
    updateMessage("エネルギーは満たされている");
    return;
  }

  if (gameState.selectedItem !== "magicalPotion") {
    updateMessage("容器の中は、ほとんど空っぽだ");
    return;
  }

  removeItem("magicalPotion");
  f.chargeEnergy = true;
  f.unlockManageBoard = true;
  markProgress?.("unlock_manage_board");
  playSE?.("se-tea");
  showModal("エネルギータンクにテラパワーエナジーを注いだ", `<img src="${IMAGES.modals.tankFill}" class="showobj-image" alt="エネルギータンク">`, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
  renderCanvasRoom?.();
  updateMessage("テラパワーエナジーをタンクに注いだ");
}

function handleMainAdminDoorControlPanelClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.unlockManageBoard) {
    updateMessage("エネルギー切れのようだ");
    return;
  }

  changeRoom("boardAdmin");
}

function getTransferPanelState() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.transferPanel || typeof f.transferPanel !== "object") {
    f.transferPanel = {
      started: false,
      mode: "receive",
      destination: "1",
      message: "",
      status: "RECEIVE READY",
    };
  }

  const st = f.transferPanel;
  st.started = !!st.started;
  st.mode = st.mode === "send" ? "send" : "receive";
  if (!["1", "2", "3", "3.65", "4", "5"].includes(st.destination)) st.destination = "1";
  st.message = typeof st.message === "string" ? st.message.slice(0, 80) : "";
  if (!st.status) st.status = st.started ? "PANEL READY" : "RECEIVE READY";
  return st;
}

function getTransferPanelStatusLabel(status, mode = "receive") {
  const noTranslate = (text) => `<span class="notranslate" translate="no" lang="en">${escapeHtml(String(text))}</span>`;
  const labels = {
    "RECEIVE READY": `受信待機 / ${noTranslate("RECEIVE READY")}`,
    "PANEL READY": `操作可能 / ${noTranslate("PANEL READY")}`,
    "SEND MODE": `送信モード / ${noTranslate("SEND MODE")}`,
    "RECEIVE MODE": `受信モード / ${noTranslate("RECEIVE MODE")}`,
    "CARGO RECEIVED": `荷物受信 / ${noTranslate("CARGO RECEIVED")}`,
    "CARGO READY": `荷物待機 / ${noTranslate("CARGO READY")}`,
    "RECEIVE FAILED": `何も受信できなかった / ${noTranslate("RECEIVE FAILED")}`,
    "SEND FAILED": `送出失敗 / ${noTranslate("SEND FAILED")}`,
    "ENERGY LOW": `エネルギー不足 / ${noTranslate("ENERGY LOW")}`,
    "OVER WEIGHT": `負荷超過 / ${noTranslate("LOAD OVER")}`,
    "TRANSFER COMPLETE": `転送完了 / ${noTranslate("TRANSFER COMPLETE")}`,
  };
  if (labels[status]) return labels[status];
  if (String(status || "").startsWith("DEST ")) {
    const value = String(status).slice(5);
    return mode === "send" ? `送信先 ${escapeHtml(value)} / ${noTranslate(`DEST ${value}`)}` : `受信元 ${escapeHtml(value)} / ${noTranslate(`SOURCE ${value}`)}`;
  }
  return status ? noTranslate(status) : `受信待機 / ${noTranslate("RECEIVE READY")}`;
}

function showTransferPanelModal() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const st = getTransferPanelState();
  if (f.receiveCargo && !f.bearAppear) {
    updateMessage("箱が邪魔で操作しづらい");
    return;
  }

  const unlocked = !!st.started;
  const energyOk = !!f.unlockManageBoard;
  const hasCargo = !!f.receiveCargo;
  const carrierItemsTooHeavy = hasItem("hat") || hasItem("bag") || hasItem("card");
  const weightOver = st.mode === "send" && (carrierItemsTooHeavy || (hasCargo && st.destination !== "3.65"));
  if (st.status === "OVER WEIGHT" && !weightOver) {
    st.status = st.mode === "send" ? `DEST ${st.destination}` : "PANEL READY";
  }
  const weightValue = weightOver ? 126 : !hasCargo ? 28 : 72;
  const energyValue = energyOk ? 88 : 24;
  const disabledAttr = unlocked ? "" : " disabled";
  const panelStyle = ["max-width:560px", "margin:0 auto", "padding:18px", "border-radius:6px", "background:linear-gradient(180deg,#2b3338,#151b1f)", "color:#edf7ff", "border:2px solid #6f7d86", "box-shadow:inset 0 0 22px rgba(255,255,255,0.08),0 8px 24px rgba(0,0,0,0.3)"].join(";");
  const buttonBase = ["border:1px solid #7f919c", "border-radius:4px", "background:#27353c", "color:#fff", "font-size:1.04em", "font-weight:800", "cursor:pointer", "box-sizing:border-box", "touch-action:manipulation", "user-select:none"].join(";");
  const inactiveButton = "opacity:0.44; cursor:not-allowed;";
  const leverStyle = [
    buttonBase,
    "width:min(76vw,300px)",
    "height:56px",
    "position:relative",
    "background:#111a1f",
    "display:flex",
    "align-items:center",
    "justify-content:space-between",
    "padding:5px 12px",
    "font-size:0.92em",
    "line-height:1.15",
    "letter-spacing:0.02em",
    unlocked ? "" : inactiveButton,
  ].join(";");
  const knobLeft = st.mode === "send" ? "calc(100% - 51px)" : "5px";
  const displayText = getTransferPanelStatusLabel(st.status || (unlocked ? "PANEL READY" : "RECEIVE READY"), st.mode);
  const routeLabel = st.mode === "send" ? '送信先 / <span class="notranslate" translate="no" lang="en">DEST</span>' : '受信元 / <span class="notranslate" translate="no" lang="en">SOURCE</span>';
  const meter = (jpLabel, enLabel, value, over, ok) => {
    const needleDeg = -132 + Math.min(1.15, Math.max(0, value / 100)) * 264;
    const accent = over ? "#ff334d" : ok ? "#38d274" : "#ffd25a";
    return `
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <div style="font-size:0.9em; font-weight:900; letter-spacing:0.04em; text-align:center;">${jpLabel} / <span class="notranslate" translate="no" lang="en">${enLabel}</span></div>
        <div style="position:relative; width:82px; height:82px; border-radius:50%; background:radial-gradient(circle at 45% 42%,#34454f 0,#162127 62%,#080c0f 100%); border:5px solid #c9d5dc; box-shadow:inset 0 0 10px rgba(0,0,0,0.7),0 2px 8px rgba(0,0,0,0.35);">
          <div style="position:absolute; left:50%; top:50%; width:4px; height:31px; background:${accent}; border-radius:4px; transform-origin:50% 92%; transform:translate(-50%,-92%) rotate(${needleDeg}deg); box-shadow:0 0 8px ${accent};"></div>
          <div style="position:absolute; left:50%; top:50%; width:12px; height:12px; border-radius:50%; background:#e8f0f3; transform:translate(-50%,-50%);"></div>
          <div style="position:absolute; left:50%; bottom:9px; transform:translateX(-50%); font-size:11px; font-weight:900; color:${accent};">${over ? '超過/<span class="notranslate" translate="no" lang="en">OVER</span>' : ok ? '<span class="notranslate" translate="no" lang="en">OK</span>' : '低/<span class="notranslate" translate="no" lang="en">LOW</span>'}</div>
        </div>
      </div>`;
  };
  const content = `
    <div id="transferPanelRoot" style="${panelStyle}">
      <style>
        @keyframes transferButtonPulse {
          0%, 100% { box-shadow:0 0 0 rgba(104, 210, 255, 0); filter:brightness(1); }
          50% { box-shadow:0 0 18px rgba(104, 210, 255, 0.92); filter:brightness(1.22); }
        }
      </style>
      <div style="display:flex; justify-content:center; gap:44px; font-size:1.02em; font-weight:900; letter-spacing:0.08em; margin-bottom:8px;">
        <span style="color:${st.mode === "receive" ? "#8be8ff" : "#75858c"};">受信 / <span class="notranslate" translate="no" lang="en">RECEIVE</span></span>
        <span style="color:${st.mode === "send" ? "#8be8ff" : "#75858c"};">送信 / <span class="notranslate" translate="no" lang="en">SEND</span></span>
      </div>
      <div style="display:flex; justify-content:center; margin-bottom:16px;">
        <button id="transferModeLever" type="button"${disabledAttr} style="${leverStyle}" aria-label="送受信モード切替">
          <span>受信<br><span class="notranslate" translate="no" lang="en">RECEIVE</span></span><span>送信<br><span class="notranslate" translate="no" lang="en">SEND</span></span>
          <span style="position:absolute; left:${knobLeft}; top:5px; width:46px; height:34px; border-radius:4px; background:linear-gradient(180deg,#e9f2f7,#8296a1); box-shadow:0 2px 6px rgba(0,0,0,0.45); transition:left 160ms ease;"></span>
        </button>
      </div>
      <div id="transferMagicDisplay" style="margin:0 auto 18px; width:min(82vw,380px); min-height:70px; border-radius:999px; background:radial-gradient(circle at 50% 45%,#1577d9 0,#073f83 62%,#041d3f 100%); color:#fff; display:flex; align-items:center; justify-content:center; text-align:center; padding:10px 22px; font-size:1.12em; font-weight:900; letter-spacing:0.02em; box-shadow:inset 0 0 22px rgba(255,255,255,0.34),0 0 18px rgba(64,165,255,0.55);">${displayText}</div>
      <div style="display:flex; justify-content:center; gap:min(12vw,84px); margin-bottom:18px;">
        ${meter("負荷", "LOAD", weightValue, weightOver, hasCargo)}
        ${meter("エネルギー", "ENERGY", energyValue, false, energyOk)}
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:5px; margin-bottom:18px;">
        <div style="font-size:0.9em; font-weight:900; letter-spacing:0.04em; color:#cfe8ef;">${unlocked ? routeLabel : '受信元 / <span class="notranslate" translate="no" lang="en">SOURCE</span>'}</div>
        <div style="display:flex; align-items:center; justify-content:center; gap:12px;">
          <button id="transferDestPrev" type="button"${disabledAttr} style="${buttonBase}; width:42px; height:38px; font-size:20px; ${unlocked ? "" : inactiveButton}" aria-label="転送先を戻す">◀</button>
          <div style="min-width:120px; height:42px; display:flex; align-items:center; justify-content:center; border-radius:4px; background:#0a1519; border:1px solid #6c838f; color:#dff9ff; font-size:1.42em; font-weight:900; letter-spacing:0.08em;">
            <span id="transferDestinationValue" class="notranslate" translate="no" lang="en">${unlocked ? st.destination : ""}</span>
          </div>
          <button id="transferDestNext" type="button"${disabledAttr} style="${buttonBase}; width:42px; height:38px; font-size:20px; ${unlocked ? "" : inactiveButton}" aria-label="転送先を進める">▶</button>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:5px; margin:0 auto 14px; width:min(82vw,380px);">
        <label for="transferMessageInput" style="font-size:0.9em; font-weight:900; letter-spacing:0.04em;">メッセージ / <span class="notranslate" translate="no" lang="en">MESSAGE</span></label>
        <input id="transferMessageInput" class="notranslate" translate="no" lang="en" type="text" maxlength="80"${disabledAttr} value="${escapeHtml(st.message)}" placeholder="${unlocked ? "MESSAGE" : "入力不可 / LOCKED"}" style="width:100%; box-sizing:border-box; padding:9px 10px; border-radius:4px; border:1px solid #6c838f; background:${unlocked ? "#081217" : "#20282d"}; color:${unlocked ? "#dff9ff" : "#87949b"}; font-size:1em; font-weight:800;">
      </div>
      <div style="display:flex; justify-content:center;">
        <button id="transferExecute" class="ok-btn" type="button" style="min-width:190px; ${unlocked ? "" : "animation:transferButtonPulse 950ms ease-in-out infinite;"}">転送 / <span class="notranslate" translate="no" lang="en">TRANSFER</span></button>
      </div>
    </div>
  `;

  showModal('転送操作パネル / <span class="notranslate" translate="no" lang="en">Transfer Panel</span>', content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });

  setTimeout(() => {
    const leverBtn = document.getElementById("transferModeLever");
    const prevBtn = document.getElementById("transferDestPrev");
    const nextBtn = document.getElementById("transferDestNext");
    const messageInput = document.getElementById("transferMessageInput");
    const transferBtn = document.getElementById("transferExecute");
    if (!transferBtn) return;

    const reopen = () => showTransferPanelModal();
    const destinations = ["1", "2", "3", "4", "5"];
    const LONG_PRESS_MS = 700;

    leverBtn?.addEventListener("click", () => {
      if (!getTransferPanelState().started) return;
      const state = getTransferPanelState();
      state.mode = state.mode === "receive" ? "send" : "receive";
      state.status = state.mode === "send" ? "SEND MODE" : "RECEIVE MODE";
      playSE?.("se-pi");
      closeModal();
      reopen();
    });

    const moveDestination = (delta) => {
      const state = getTransferPanelState();
      if (!state.started) return;
      if (state.destination === "3.65") {
        state.destination = delta > 0 ? "4" : "3";
        state.status = `DEST ${state.destination}`;
        playSE?.("se-pi");
        closeModal();
        reopen();
        return;
      }
      const idx = Math.max(0, destinations.indexOf(state.destination));
      state.destination = destinations[(idx + delta + destinations.length) % destinations.length];
      state.status = `DEST ${state.destination}`;
      playSE?.("se-pi");
      closeModal();
      reopen();
    };
    const bindDestinationButton = (btn, delta, allowHiddenDestination = false) => {
      if (!btn) return;
      let longPressTimer = null;
      let longPressHandled = false;

      const clearLongPress = () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
      };

      btn.addEventListener("pointerdown", (e) => {
        if (!getTransferPanelState().started) return;
        longPressHandled = false;
        btn.setPointerCapture?.(e.pointerId);
        if (allowHiddenDestination) {
          clearLongPress();
          longPressTimer = setTimeout(() => {
            const state = getTransferPanelState();
            if (!state.started || state.destination !== "3") return;
            longPressHandled = true;
            state.destination = "3.65";
            state.status = "DEST 3.65";
            playSE?.("se-kachi");
            const valueEl = document.getElementById("transferDestinationValue");
            const displayEl = document.getElementById("transferMagicDisplay");
            if (valueEl) valueEl.textContent = state.destination;
            if (displayEl) displayEl.innerHTML = getTransferPanelStatusLabel(state.status, state.mode);
          }, LONG_PRESS_MS);
        }
      });

      btn.addEventListener("pointerup", () => {
        clearLongPress();
        if (longPressHandled) {
          closeModal();
          reopen();
          return;
        }
        moveDestination(delta);
      });
      btn.addEventListener("pointerleave", clearLongPress);
      btn.addEventListener("pointercancel", clearLongPress);
    };

    bindDestinationButton(prevBtn, -1);
    bindDestinationButton(nextBtn, 1, true);
    messageInput?.addEventListener("input", () => {
      const state = getTransferPanelState();
      if (!state.started) return;
      state.message = messageInput.value.slice(0, 80);
    });

    transferBtn.addEventListener("click", () => {
      const state = getTransferPanelState();
      if (!state.started) {
        state.started = true;
        state.mode = "receive";
        state.status = "CARGO RECEIVED";
        f.receiveCargo = true;
        markProgress?.("transfer_receive_cargo");
        playSE?.("se-fanta");
        renderCanvasRoom?.();
        closeModal();
        updateMessage("荷物を受信した。");
        return;
      }

      if (state.mode === "receive") {
        if (state.destination === "4" && /lava/i.test(state.message || "")) {
          state.status = "CARGO RECEIVED";
          f.receiveCargo = true;
          f.receiveManjuBox = true;
          playSE?.("se-fanta");
          renderCanvasRoom?.();
          closeModal();
          updateMessage("荷物を受信した。");
          return;
        }

        state.status = "RECEIVE FAILED";
        playSE?.("se-error");
        closeModal();
        reopen();
        return;
      }

      if (!f.unlockManageBoard) {
        state.status = "ENERGY LOW";
        playSE?.("se-error");
        screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
        closeModal();
        reopen();
        return;
      }
      if (hasItem("hat") || hasItem("bag") || hasItem("card")) {
        state.status = "OVER WEIGHT";
        const wasShutterOpen = !!f.openShutter;
        f.openShutter = true;
        playSE?.("se-error");
        if (!wasShutterOpen) playSE?.("se-shutter-open");
        showToast("負荷超過を検出しました。備品返却を推奨します");
        renderCanvasRoom();
        screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
        closeModal();
        return;
      }
      if (state.destination !== "3.65") {
        state.status = "SEND FAILED";
        playSE?.("se-error");
        showToast("送出に失敗しました");
        screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
        closeModal();
        reopen();
        return;
      }

      f.receiveCargo = false;
      state.status = "TRANSFER COMPLETE";
      markProgress?.("transfer_send_cargo");
      closeModal();
      renderCanvasRoom?.();
      startTransferTrueEndSequence();
    });
  }, 0);
}

function startTransferTrueEndSequence() {
  playSE?.("se-pinponpan");
  updateMessage("転送が受け付けられた。");
  showTransferCountdownModal();
}

function showTransferCountdownModal() {
  showModal("転送を受け付けました。", `<div style="text-align:center; font-size:1.2em; font-weight:800; line-height:1.8;">カウントダウン。<br><span class="notranslate" translate="no" lang="en" style="font-size:1.5em; letter-spacing:0.08em;">5, 4, 3, 2, 1...</span></div>`, [
    {
      text: "次へ",
      action: () => {
        closeModal();
        showTransferBearBoardingModal();
      },
    },
  ]);
}

function showTransferBearBoardingModal() {
  const content = `
    <div class="modal-anim">
      <img src="${IMAGES.modals.bearUpset}" alt="慌てるクマ妖精">
      <img src="${IMAGES.modals.bearGeton}" alt="転送に乗り込むクマ妖精">
    </div>
    <div style="text-align:center; font-size:1.15em; font-weight:800; margin-top:10px;">クマ妖精が飛びついてきた。</div>
  `;
  showModal("「えー！待ってー」", content, [
    {
      text: "次へ",
      action: () => {
        closeModal();
        flashScreen("black", 900);
        setTimeout(() => {
          travelWithStepsTrueEnd("se-fanta");
        }, 220);
      },
    },
  ]);
}

function startTrueEndManjuBoxTransition() {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput) return;

  fx.lockInput = true;
  flashScreen("black", 3200);
  setTimeout(() => {
    gameState.trueEnd.flags.backgroundState = 1;
    changeBGM(S41("otenba_jenifer.mp3"));
    removeItem("manjuBox");
    renderCanvasRoom();
    updateMessage("いつの間にか涼しい和室に着いていた");
  }, 1400);
  setTimeout(() => {
    if (gameState.fx) gameState.fx.lockInput = false;
  }, 3200);
}

function showReceivedCargoBoxModal() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.receiveCargo || f.bearAppear) return;

  showModal("箱を開けますか？", "", [
    {
      text: "開ける",
      action: () => {
        if (document.getElementById("se-box-open")) playSE("se-box-open");
        f.bearAppear = true;
        f.receiveCargo = false;
        closeModal();
        renderCanvasRoom?.();
        const content = `
          <div class="modal-anim frames" style="aspect-ratio:1 / 1;">
            <img src="${IMAGES.modals.boxOpenBefore}" alt="箱を開ける前">
            <img src="${IMAGES.modals.boxOpen1}" alt="箱を開ける">
            <img src="${IMAGES.modals.boxOpen2}" alt="箱を開けた">
          </div>
        `;
        showModal("箱を開けた", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
        updateMessage("箱を開けた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);
}

function handleTransferBearFanOpenedUse() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.transferBearFanOpenedCount = (Number(f.transferBearFanOpenedCount) || 0) + 1;

  if (f.transferBearFanOpenedCount >= 3) {
    playSE?.("se-gogogo");
    pauseBGM();
    const content = `
      <img src="${IMAGES.modals.badend}" class="showobj-image" alt="クマの眼光">
      <p style="text-align:center; font-weight:800; line-height:1.8; margin-top:14px;">
        「そんなにボクの本気ポーズが見たいの…？」<br>
        あなたは気が遠くなり意識を失った。
      </p>
    `;
    showModal("【BAD END】クマの眼光", content, [{ text: "最初から", action: "restart" }], null, { contentClass: "showobj-modal" });
    updateMessage("BAD END: クマの眼光");
    return;
  }

  showObj(null, "ドドン！", IMAGES.modals.kabuki, "クマ妖精はポーズをとっている。扇子は返してもらった");
  playSE("se-dodon");
}

const RETURN_SHELF_ITEMS = {
  hat: "制帽",
  bag: "かばん",
  card: "カード",
};

function getReturnShelfItems() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.returnShelfItems || typeof f.returnShelfItems !== "object") f.returnShelfItems = {};
  return f.returnShelfItems;
}

function isReturnShelfItemPlaced(itemId) {
  const f = gameState.main.flags || {};
  return !!(f.openShutter && getReturnShelfItems()[itemId]);
}

function handleReturnShelfClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.openShutter) {
    updateMessage("シャッターは閉まっている");
    return;
  }

  const itemId = gameState.selectedItem;
  if (!RETURN_SHELF_ITEMS[itemId]) {
    updateMessage("備品を返却できそうだ");
    return;
  }

  const shelfItems = getReturnShelfItems();
  if (shelfItems[itemId]) {
    updateMessage(`${RETURN_SHELF_ITEMS[itemId]}はすでに備品棚に置いてある`);
    return;
  }

  removeItem(itemId);
  shelfItems[itemId] = true;
  playSE?.("se-item");
  renderCanvasRoom?.();
  updateMessage(`${RETURN_SHELF_ITEMS[itemId]}を備品棚に置いた`);
}

function retrieveReturnShelfItem(itemId) {
  const shelfItems = getReturnShelfItems();
  if (!shelfItems[itemId]) return;
  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。");
    return;
  }

  shelfItems[itemId] = false;
  addItem(itemId);
  renderCanvasRoom?.();
  updateMessage(`${RETURN_SHELF_ITEMS[itemId]}を備品棚から取り戻した`);
}

function handleMainChestFloorSwitchClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.putCardOnSwitch) {
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。");
      return;
    }

    f.putCardOnSwitch = false;
    addItem("card");
    renderCanvasRoom?.();
    updateMessage("床のスイッチからカードを取り戻した");
    return;
  }

  if (gameState.selectedItem !== "card") {
    showMainChestFloorSwitchModal();
    playSE("se-kachi");
    return;
  }

  removeItem("card");
  f.putCardOnSwitch = true;
  playSE("se-kachi");
  renderCanvasRoom?.();
  updateMessage("カードを床のスイッチに置いた");
}

function showMainChestFloorSwitchModal() {
  const title = "床のスイッチを踏んでみた";
  const content = `
    <div class="modal-anim">
      <img src="${IMAGES.modals.pressSwitchFloor}" alt="">
      <img src="${IMAGES.modals.pressSwitchFloorAfter}" alt="">
    </div>
  `;
  const message = "床のスイッチを踏んでみた。足を離すと元に戻った。";
  showModal(title, content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
  updateMessage(message);
}

function handleMainAdminDoorWallSwitchClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.putCardOnSwitch && !f.openBlueShutter) {
    showMainAdminDoorWallSwitchModal("壁のスイッチを押してみた", startBlueShutterOpenEvent);
    playSE("se-kachi");
    if (document.getElementById("se-shutter-open")) playSE("se-shutter-open");
    return;
  }

  showMainAdminDoorWallSwitchModal("壁のスイッチを押してみた。手を離すと元に戻った", null, true);
  playSE("se-kachi");
}

function showMainAdminDoorWallSwitchModal(title, afterClose, useAfterFrame = false) {
  const content = useAfterFrame
    ? `
      <div class="modal-anim">
        <img src="${IMAGES.modals.pressSwitchWall}" alt="">
        <img src="${IMAGES.modals.pressSwitchWallAfter}" alt="">
      </div>
    `
    : `<img class="showobj-image" src="${IMAGES.modals.pressSwitchWall}">`;
  showModal(title, content, [{ text: "閉じる", action: "close" }], afterClose, { contentClass: "showobj-modal" });
  updateMessage(title);
}

function startBlueShutterOpenEvent() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.openBlueShutter) return;

  f.openBlueShutter = true;
  f.deliveryRecordDropped = false;
  markProgress?.("open_blue_shutter");

  renderCanvasRoom?.();
  playDeliveryRecordFallFx();
}

function playDeliveryRecordFallFx() {
  const fx = gameState.fx || (gameState.fx = {});
  const id = Date.now();
  fx.lockInput = true;
  fx.deliveryRecordFall = {
    id,
    roomId: "mainAdminDoor",
    progress: 0,
  };

  const duration = 1500;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.deliveryRecordFall;
    if (!currentFx || currentFx.id !== id) return;

    const t = Math.min(1, (now - start) / duration);
    currentFx.progress = t;
    renderCanvasRoom?.();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.deliveryRecordFall;
    gameState.fx.lockInput = false;
    gameState.main.flags.deliveryRecordDropped = true;
    renderCanvasRoom?.();
    updateMessage("なにかが落ちてきた");
  };

  requestAnimationFrame(tick);
}

function handleBoardAdminWifiClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (gameState.selectedItem !== "card") {
    updateMessage("なにかをかざす場所のようだ");
    return;
  }

  f.boardAdminRewritten = !f.boardAdminRewritten;
  playSE?.("se-cyber");
  renderCanvasRoom();
  updateMessage(f.boardAdminRewritten ? "カードの力で制御盤の画面が切り替わった" : "カードの力で制御盤の画面が元に戻った");
}

function pressBoardAdminButton(index) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if ((gameState.main.flags || {}).unlockAdminDoor) {
    updateMessage("ロックは解除されている");
    return;
  }

  const step = getBoardAdminButtonStep();
  if (step >= BOARD_ADMIN_BUTTON_SEQUENCE.length) {
    updateMessage("OKボタンで確認できそうだ");
    return;
  }

  if (index === BOARD_ADMIN_BUTTON_SEQUENCE[step]) {
    f.boardAdminButtonStep = step + 1;
    if (f.boardAdminButtonStep < BOARD_ADMIN_BUTTON_SEQUENCE.length) {
      // playSE?.("se-pi");
    }
    renderCanvasRoom();
    return;
  }

  f.boardAdminButtonStep = 0;
  renderCanvasRoom();
}

function submitBoardAdminButtons() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockAdminDoor) {
    updateMessage("ロックは解除されている");
    return;
  }

  if (getBoardAdminButtonStep() >= BOARD_ADMIN_BUTTON_SEQUENCE.length) {
    f.unlockAdminDoor = true;
    f.boardAdminButtonStep = 0;
    markProgress?.("unlock_admin_door");
    playSE?.("se-gacha");
    renderCanvasRoom();
    showModal("近くのドアから音がした", "<p>ガチャ…</p>", [{ text: "閉じる", action: "close" }]);
    updateMessage("近くのドアから音がした");
    return;
  }

  f.boardAdminButtonStep = 0;
  playSE?.("se-error");
  renderCanvasRoom();
  updateMessage("違うようだ");
}

function normalizeBoardDoorAnswer(value) {
  return String(value || "")
    .trim()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function showBoardDoorAnswerInput(key) {
  const blank = BOARD_DOOR_BLANKS[key];
  if (!blank || !isBoardDoorBlankClickable(key)) return;

  if (blank.col === "address") {
    showBoardDoorAddressInput(key, blank);
    return;
  }

  if (blank.col === "area") {
    showBoardDoorAreaInput(key, blank);
    return;
  }

  showBoardDoorNameInput(key, blank);
}

function submitBoardDoorAnswer(key, value, hintEl, inputEl = null) {
  const blank = BOARD_DOOR_BLANKS[key];
  const normalized = normalizeBoardDoorAnswer(value);
  const answer = normalizeBoardDoorAnswer(blank.answer);
  if (normalized === answer) {
    getBoardDoorAnswersFlag()[key] = true;
    playSE?.("se-clear");
    closeModal();
    renderCanvasRoom();
    updateMessage("黒板の空欄が埋まった");
    return true;
  }

  playSE?.("se-error");
  if (hintEl) hintEl.textContent = "違うようだ";
  inputEl?.select?.();
  return false;
}

function showBoardDoorNameInput(key, blank) {
  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
      <input id="boardDoorAnswerInput" class="puzzle-input notranslate" type="text" maxlength="24" aria-label="${blank.label}を入力" placeholder="${blank.label}" autocapitalize="off" autocomplete="off" spellcheck="false" translate="no" lang="en" style="width:220px; max-width:100%; text-align:center; font-size:1.1em; letter-spacing:0.08em;">
      <button id="boardDoorAnswerOk" class="ok-btn" type="button">OK</button>
      <div id="boardDoorAnswerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>`;

  showModal("黒板の空欄", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });

  setTimeout(() => {
    const inputEl = document.getElementById("boardDoorAnswerInput");
    const okBtn = document.getElementById("boardDoorAnswerOk");
    const hintEl = document.getElementById("boardDoorAnswerHint");
    if (!inputEl || !okBtn || !hintEl) return;

    const submit = () => {
      submitBoardDoorAnswer(key, inputEl.value, hintEl, inputEl);
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

function showBoardDoorAddressInput(key, blank) {
  const digitStyle = "width:54px;height:54px;border:2px solid #555;border-radius:4px;background:#fff;color:#111;font-size:28px;font-weight:900;text-align:center;";
  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:10px; justify-content:center;">
        <button id="boardDoorAddressDigit0" type="button" aria-label="1桁目" style="${digitStyle}">0</button>
        <button id="boardDoorAddressDigit1" type="button" aria-label="2桁目" style="${digitStyle}">0</button>
        <button id="boardDoorAddressDigit2" type="button" aria-label="3桁目" style="${digitStyle}">0</button>
      </div>
      <button id="boardDoorAddressOk" class="ok-btn" type="button">OK</button>
      <div id="boardDoorAddressHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>`;

  showModal("黒板の空欄", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });

  setTimeout(() => {
    const digits = [0, 0, 0];
    const digitBtns = digits.map((_, idx) => document.getElementById(`boardDoorAddressDigit${idx}`));
    const okBtn = document.getElementById("boardDoorAddressOk");
    const hintEl = document.getElementById("boardDoorAddressHint");
    if (digitBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const render = () => digitBtns.forEach((btn, idx) => (btn.textContent = String(digits[idx])));
    digitBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        digits[idx] = (digits[idx] + 1) % 10;
        render();
      });
    });
    okBtn.addEventListener("click", () => submitBoardDoorAnswer(key, digits.join(""), hintEl));
    render();
  }, 0);
}

function showBoardDoorAreaInput(key, blank) {
  let selectedIdx = 0;
  const content = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
      <button id="boardDoorAreaChoice" type="button" class="text-btn notranslate" translate="no" lang="en" style="min-width:220px; padding:12px 18px; font-size:1.1em; font-weight:800; letter-spacing:0.08em; background:#1f4d35; color:#fff; border-color:#163826;">${BOARD_DOOR_AREA_OPTIONS[selectedIdx]}</button>
      <button id="boardDoorAreaOk" class="ok-btn" type="button">OK</button>
      <div id="boardDoorAreaHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>`;

  showModal("黒板の空欄", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });

  setTimeout(() => {
    const choiceBtn = document.getElementById("boardDoorAreaChoice");
    const okBtn = document.getElementById("boardDoorAreaOk");
    const hintEl = document.getElementById("boardDoorAreaHint");
    if (!choiceBtn || !okBtn || !hintEl) return;

    const render = () => (choiceBtn.textContent = BOARD_DOOR_AREA_OPTIONS[selectedIdx]);
    choiceBtn.addEventListener("click", () => {
      selectedIdx = (selectedIdx + 1) % BOARD_DOOR_AREA_OPTIONS.length;
      render();
    });
    okBtn.addEventListener("click", () => submitBoardDoorAnswer(key, BOARD_DOOR_AREA_OPTIONS[selectedIdx], hintEl));
    render();
  }, 0);
}

function handleBoardChestWifiClick() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (gameState.selectedItem !== "card") {
    updateMessage("なにかをかざす場所のようだ");
    return;
  }

  f.boardChestRewritten = !f.boardChestRewritten;
  playSE?.("se-cyber");
  renderCanvasRoom();
  updateMessage(f.boardChestRewritten ? "カードの力で黒板の内容が書き換わった" : "カードの力で黒板の内容が元に戻った");
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
      title: "🌎 TRUE END",
      label: "TRUE END",
      desc: "地球に帰還、おめでとうございます！",
    },

    end: {
      title: "✉ NORMAL END ",
      label: "NORMAL",
      desc: "配達員としてがんばりましょう。脱出おめでとうございます！",
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLScM2OJAKuVqP4GBFw__FHgUxf9u9PCERuBtqgl8p5LZyDzHlw/viewform";
  const endingLabel =
    {
      trueEnd: "トゥルーエンド",
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

function showMainDeskStampPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.clearMainDeskStampPuzzle) {
    updateMessage("封筒に切手を貼り終えている。");
    return;
  }

  const stampOptions = [
    { id: "star", img: IMAGES.items.stampStar, label: "星の切手", disabled: true },
    { id: "heart", img: IMAGES.items.stampHeart, label: "ハートの切手" },
    { id: "triangle", img: IMAGES.items.stampTriangle, label: "三角の切手" },
    { id: "sun", img: IMAGES.items.stampSun, label: "太陽の切手" },
  ];
  const saved = Array.isArray(f.mainDeskStampSelection) ? f.mainDeskStampSelection.filter((id) => stampOptions.some((opt) => opt.id === id && !opt.disabled)).slice(0, 2) : [];
  const slotStyle = ["width:min(28vw, 112px)", "height:min(18vw, 76px)", "min-width:82px", "min-height:58px", "border:2px dashed #8b6d4e", "border-radius:4px", "background:#fff8e8", "display:flex", "align-items:center", "justify-content:center"].join(";");
  const stampButtonStyle = ["width:min(24vw, 88px)", "height:min(24vw, 88px)", "min-width:68px", "min-height:68px", "border:2px solid #7b6249", "border-radius:4px", "background:#fff", "padding:5px", "cursor:pointer", "display:flex", "align-items:center", "justify-content:center"].join(";");
  const stampImgStyle = "max-width:100%;max-height:100%;object-fit:contain;display:block;";
  const content = `
    <div style="margin-top:0; display:flex; flex-direction:column; align-items:center; gap:8px;">
      <img src="${IMAGES.items.envelopeNostamp}" alt="切手のない封筒" style="width:min(82vw, 400px); max-height:210px; object-fit:contain; display:block;">
      <div style="display:flex; gap:8px; justify-content:center; align-items:center;">
        <div id="mainDeskStampSlot0" style="${slotStyle};"></div>
        <div id="mainDeskStampSlot1" style="${slotStyle};"></div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(2, minmax(68px, 88px)); gap:8px; justify-content:center; align-items:center;">
        ${stampOptions
          .map(
            (opt) => `
              <button id="mainDeskStampButton_${opt.id}" type="button" aria-label="${opt.label}" style="${stampButtonStyle};${opt.disabled ? "filter:grayscale(1);opacity:0.42;" : ""}">
                <img src="${opt.img}" alt="${opt.label}" style="${stampImgStyle}">
              </button>
            `,
          )
          .join("")}
      </div>
      <button id="mainDeskStampOk" class="ok-btn" type="button">OK</button>
      <div id="mainDeskStampHint" style="min-height:1em; font-size:0.9em; line-height:1.1; text-align:center;"></div>
    </div>
  `;

  showModal("切手を選ぶ", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("封筒に貼る切手を選ぼう。");

  setTimeout(() => {
    const slotEls = [0, 1].map((idx) => document.getElementById(`mainDeskStampSlot${idx}`));
    const okBtn = document.getElementById("mainDeskStampOk");
    const hintEl = document.getElementById("mainDeskStampHint");
    if (slotEls.some((el) => !el) || !okBtn || !hintEl) return;

    const selected = saved.slice();
    const repaint = () => {
      slotEls.forEach((slotEl, idx) => {
        const stampId = selected[idx];
        const opt = stampOptions.find((item) => item.id === stampId);
        slotEl.innerHTML = opt ? `<img src="${opt.img}" alt="${opt.label}" style="${stampImgStyle}">` : "";
      });
      stampOptions.forEach((opt) => {
        const btn = document.getElementById(`mainDeskStampButton_${opt.id}`);
        if (!btn || opt.disabled) return;
        btn.style.outline = selected.includes(opt.id) ? "3px solid #2f8cff" : "none";
      });
      hintEl.textContent = "";
    };

    stampOptions.forEach((opt) => {
      const btn = document.getElementById(`mainDeskStampButton_${opt.id}`);
      if (!btn) return;
      btn.addEventListener("click", () => {
        if (opt.disabled) {
          playSE?.("se-error");
          hintEl.textContent = "星の切手は品切れなようだ";
          return;
        }

        if (selected.length < 2) {
          selected.push(opt.id);
        } else {
          selected.shift();
          selected.push(opt.id);
        }
        f.mainDeskStampSelection = selected.slice();
        playSE?.("se-pi");
        repaint();
      });
    });

    okBtn.addEventListener("click", () => {
      f.mainDeskStampSelection = selected.slice();
      const answer = selected.slice().sort().join(",");
      if (answer === ["sun", "triangle"].sort().join(",")) {
        f.clearMainDeskStampPuzzle = true;
        markProgress?.("clear_main_desk_stamp_puzzle");
        playSE?.("se-hanko");
        removeItem("envelopeNostamp");
        if (!hasItem("envelopeStamp")) {
          gameState.inventory.push("envelopeStamp");
          updateInventoryDisplay();
        }
        closeModal();
        showModal(
          "封筒に切手を貼った",
          `
            <div class="modal-anim" style="aspect-ratio:1 / 1;">
              <img src="${IMAGES.modals.letterStamping}" alt="">
              <img src="${IMAGES.modals.letterStamped}" alt="">
            </div>
          `,
          [{ text: "閉じる", action: "close" }],
        );
        updateMessage("封筒に切手を貼った。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showMainDeskBoxPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockBox) {
    acquireItemOnce("foundFan", "fanClosed", "箱の中に扇子がある", IMAGES.items.fanClosed, "扇子を手に入れた");
    return;
  }

  const letters = ["A", "C", "E", "H", "I", "L", "M", "N", "O", "S"];
  const cellStyle = [
    "width:min(18vw, 54px)",
    "height:min(11vh, 48px)",
    "min-width:44px",
    "min-height:38px",
    "border:2px solid #0b4d21",
    "border-radius:4px",
    "background:#01320E",
    "color:#FFD84D",
    "font-size:28px",
    "font-weight:900",
    "line-height:1",
    "text-align:center",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(255,255,255,0.08), 0 2px 5px rgba(0,0,0,0.22)",
  ].join(";");
  const content = `
    <div style="margin-top:6px; display:flex; flex-direction:column; align-items:center; gap:10px;">
      <div style="display:flex; flex-direction:column; gap:5px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3, 4].map((idx) => `<button id="mainDeskBoxLetter${idx}" class="notranslate" translate="no" lang="en" type="button" aria-label="${idx + 1}文字目" style="${cellStyle}">A</button>`).join("")}
      </div>
      <button id="mainDeskBoxOk" class="ok-btn" type="button">OK</button>
      <div id="mainDeskBoxHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("机上の箱", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("机上の箱がロックされている。");

  setTimeout(() => {
    const letterBtns = [0, 1, 2, 3, 4].map((idx) => document.getElementById(`mainDeskBoxLetter${idx}`));
    const okBtn = document.getElementById("mainDeskBoxOk");
    const hintEl = document.getElementById("mainDeskBoxHint");
    if (letterBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const saved = Array.isArray(f.mainDeskBoxLetters) ? f.mainDeskBoxLetters : [0, 0, 0, 0, 0];
    const state = [0, 1, 2, 3, 4].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < letters.length ? value : 0;
    });
    const render = () => {
      letterBtns.forEach((btn, idx) => {
        btn.textContent = letters[state[idx]];
      });
      hintEl.textContent = "";
    };

    letterBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % letters.length;
        f.mainDeskBoxLetters = state.slice();
        playSE?.("se-pi");
        render();
      });
    });
    render();

    okBtn.addEventListener("click", () => {
      f.mainDeskBoxLetters = state.slice();
      const answer = state.map((letterIdx) => letters[letterIdx]).join("");
      if (answer === "CLAIM") {
        f.unlockBox = true;
        markProgress?.("unlock_main_desk_box");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("机上の箱のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function openMainChestTopDrawer() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const roomId = "mainChest";
  const areaDescription = "引き出し一段目";
  const drawerColors = {
    frontFill: "#A05A27",
    sideTop: "#8d4c22",
    sideBottom: "#6c3718",
    gripStyle: "archedHandle",
    gripColor: "#252326",
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
      if (f.foundMainChestTopDrawerEnvelopeNostamp) {
        updateMessage("もう何もない");
        setTimeout(closeDrawer, 350);
        return;
      }

      acquireItemOnce("foundMainChestTopDrawerEnvelopeNostamp", "envelopeNostamp", "引き出しに封筒がある", IMAGES.items.envelopeNostamp, "切手のない封筒を手に入れた", closeDrawer);
    },
  });
}

function openMainChestSecondDrawer() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const roomId = "mainChest";
  const areaDescription = "引き出し2段目";
  const drawerColors = {
    frontFill: "#A05A27",
    sideTop: "#8d4c22",
    sideBottom: "#6c3718",
    gripStyle: "archedHandle",
    gripColor: "#252326",
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
      if (f.foundMainChestSecondDrawerHat) {
        updateMessage("もう何もない");
        setTimeout(closeDrawer, 350);
        return;
      }

      acquireItemOnce("foundMainChestSecondDrawerHat", "hat", "引き出しに制帽がある", IMAGES.items.hat, "制帽を手に入れた", closeDrawer);
    },
  });
}

function openMainChestThirdDrawer() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const roomId = "mainChest";
  const areaDescription = "引き出し3段目";
  const drawerColors = {
    frontFill: "#A05A27",
    sideTop: "#8d4c22",
    sideBottom: "#6c3718",
    gripStyle: "archedHandle",
    gripColor: "#252326",
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
      if (f.foundMainChestThirdDrawerMagicalPotion) {
        updateMessage("もう何もない");
        setTimeout(closeDrawer, 350);
        return;
      }

      acquireItemOnce("foundMainChestThirdDrawerMagicalPotion", "magicalPotion", "引き出しにテラパワーエナジーがある", IMAGES.items.magicalPotion, "テラパワーエナジーを手に入れた", closeDrawer);
    },
  });
}

function showMainChestTopDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainChestTopDrawer) {
    openMainChestTopDrawer();
    return;
  }

  const colors = ["#fff", "#FFF513", "#FF1329", "#B913FF", "#898989", "#13D5FF"];
  const answer = ["#FFF513", "#FFF513", "#B913FF", "#13D5FF"];
  const cellStyle = ["width:min(22vw, 78px)", "height:min(22vw, 78px)", "min-width:56px", "min-height:56px", "border:2px solid #5b4a3c", "border-radius:4px", "padding:0", "cursor:pointer", "box-shadow:inset 0 0 0 2px rgba(255,255,255,0.28), 0 2px 5px rgba(0,0,0,0.2)"].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 78px)); gap:10px; justify-content:center; align-items:center;">
        ${[0, 1, 2, 3].map((idx) => `<button id="mainChestTopDrawerCell${idx}" type="button" aria-label="${idx + 1}番目の色" style="${cellStyle};"></button>`).join("")}
      </div>
      <button id="mainChestTopDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="mainChestTopDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("一段目の引き出し", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("一段目の引き出しがロックされている。");

  setTimeout(() => {
    const cellBtns = [0, 1, 2, 3].map((idx) => document.getElementById(`mainChestTopDrawerCell${idx}`));
    const okBtn = document.getElementById("mainChestTopDrawerOk");
    const hintEl = document.getElementById("mainChestTopDrawerHint");
    if (cellBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const saved = Array.isArray(f.mainChestTopDrawerColors) ? f.mainChestTopDrawerColors : [0, 0, 0, 0];
    const state = [0, 1, 2, 3].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value < colors.length ? value : 0;
    });
    const repaint = () => {
      cellBtns.forEach((btn, idx) => {
        const color = colors[state[idx]];
        btn.style.background = color;
        btn.style.borderColor = color.toLowerCase() === "#fff" ? "#b8b8b8" : "#5b4a3c";
      });
      hintEl.textContent = "";
    };

    cellBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % colors.length;
        f.mainChestTopDrawerColors = state.slice();
        playSE?.("se-pi");
        repaint();
      });
    });
    repaint();

    okBtn.addEventListener("click", () => {
      f.mainChestTopDrawerColors = state.slice();
      const selected = state.map((colorIdx) => colors[colorIdx]);
      if (selected.every((color, idx) => color.toUpperCase() === answer[idx].toUpperCase())) {
        f.unlockMainChestTopDrawer = true;
        markProgress?.("unlock_main_chest_top_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("一段目の引き出しのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showMainChestSecondDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainChestSecondDrawer) {
    openMainChestSecondDrawer();
    return;
  }

  const tileStyle = [
    "width:min(23vw, 84px)",
    "height:min(23vw, 84px)",
    "min-width:64px",
    "min-height:64px",
    "border:2px solid rgba(255,255,255,0.72)",
    "border-radius:4px",
    "color:#fff",
    "display:flex",
    "flex-direction:column",
    "align-items:center",
    "justify-content:center",
    "gap:5px",
    "padding:10px",
    "cursor:pointer",
    "box-shadow:inset 0 0 0 2px rgba(255,255,255,0.12), 0 2px 5px rgba(0,0,0,0.22)",
  ].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 84px)); grid-template-rows:repeat(3, minmax(0, 84px)); gap:10px; justify-content:center; align-items:center;">
        <button id="mainChestSecondDrawerDigitTop" type="button" aria-label="上の線" style="${tileStyle}; grid-column:2; grid-row:1; background:#EEAB48; color:#111;"></button>
        <button id="mainChestSecondDrawerDigitLeft" type="button" aria-label="左の線" style="${tileStyle}; grid-column:1; grid-row:2; background:#01320E;"></button>
        <button id="mainChestSecondDrawerDigitRight" type="button" aria-label="右の線" style="${tileStyle}; grid-column:3; grid-row:2; background:#01320E;"></button>
        <button id="mainChestSecondDrawerDigitBottom" type="button" aria-label="下の線" style="${tileStyle}; grid-column:2; grid-row:3; background:#01320E;"></button>
      </div>
      <button id="mainChestSecondDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="mainChestSecondDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("二段目の引き出し", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("二段目の引き出しがロックされている。");

  setTimeout(() => {
    const positions = ["top", "right", "left", "bottom"];
    const ids = {
      top: "mainChestSecondDrawerDigitTop",
      right: "mainChestSecondDrawerDigitRight",
      left: "mainChestSecondDrawerDigitLeft",
      bottom: "mainChestSecondDrawerDigitBottom",
    };
    const digitBtns = positions.map((pos) => document.getElementById(ids[pos]));
    const okBtn = document.getElementById("mainChestSecondDrawerOk");
    const hintEl = document.getElementById("mainChestSecondDrawerHint");
    if (digitBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const saved = f.mainChestSecondDrawerDigits && typeof f.mainChestSecondDrawerDigits === "object" ? f.mainChestSecondDrawerDigits : {};
    const state = {
      top: Number.isInteger(Number(saved.top)) && Number(saved.top) >= 1 && Number(saved.top) <= 5 ? Number(saved.top) : 1,
      right: Number.isInteger(Number(saved.right)) && Number(saved.right) >= 1 && Number(saved.right) <= 5 ? Number(saved.right) : 1,
      left: Number.isInteger(Number(saved.left)) && Number(saved.left) >= 1 && Number(saved.left) <= 5 ? Number(saved.left) : 1,
      bottom: Number.isInteger(Number(saved.bottom)) && Number(saved.bottom) >= 1 && Number(saved.bottom) <= 5 ? Number(saved.bottom) : 1,
    };
    const saveState = () => {
      f.mainChestSecondDrawerDigits = { top: state.top, right: state.right, left: state.left, bottom: state.bottom };
    };
    const buildLines = (count, color) =>
      Array.from({ length: count }, () => `<span aria-hidden="true" style="display:block; width:78%; height:5px; border-radius:999px; background:${color}; box-shadow:0 1px 2px rgba(0,0,0,0.28);"></span>`).join("");
    const render = () => {
      positions.forEach((pos, idx) => {
        const lineColor = pos === "top" ? "#111" : "#fff";
        digitBtns[idx].innerHTML = buildLines(state[pos], lineColor);
      });
      hintEl.textContent = "";
    };

    positions.forEach((pos, idx) => {
      digitBtns[idx].addEventListener("click", () => {
        state[pos] = state[pos] >= 5 ? 1 : state[pos] + 1;
        saveState();
        playSE?.("se-pi");
        render();
      });
    });
    render();

    okBtn.addEventListener("click", () => {
      saveState();
      if (state.top === 2 && state.right === 3 && state.left === 4 && state.bottom === 2) {
        f.unlockMainChestSecondDrawer = true;
        markProgress?.("unlock_main_chest_second_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("二段目の引き出しのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showMainChestThirdDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockMainChestThirdDrawer) {
    openMainChestThirdDrawer();
    return;
  }

  const squareStyle = [
    "position:relative",
    "width:min(22vw, 72px)",
    "height:min(22vw, 72px)",
    "min-width:56px",
    "min-height:56px",
    "border:2px solid #555",
    "border-radius:4px",
    "background:#fff",
    "color:#111",
    "font-size:30px",
    "font-weight:900",
    "text-align:center",
    "cursor:pointer",
    "box-shadow:0 2px 5px rgba(0,0,0,0.2)",
  ].join(";");
  const cornerLineStyle = "position:absolute;display:block;background:#ffd84d;pointer-events:none;border-radius:999px;";
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
        <button id="mainChestThirdDrawerDigit0" type="button" aria-label="1桁目" style="${squareStyle}">
          <span style="${cornerLineStyle}left:-3px;top:-3px;width:30px;height:6px;"></span>
          <span style="${cornerLineStyle}left:-3px;top:-3px;width:6px;height:30px;"></span>
          <span id="mainChestThirdDrawerDigitText0">0</span>
        </button>
        <button id="mainChestThirdDrawerDigit1" type="button" aria-label="2桁目" style="${squareStyle}">
          <span id="mainChestThirdDrawerDigitText1">0</span>
        </button>
        <button id="mainChestThirdDrawerDigit2" type="button" aria-label="3桁目" style="${squareStyle}">
          <span id="mainChestThirdDrawerDigitText2">0</span>
        </button>
      </div>
      <button id="mainChestThirdDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="mainChestThirdDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("三段目の引き出し", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("三段目の引き出しがロックされている。");

  setTimeout(() => {
    const digitBtns = [0, 1, 2].map((idx) => document.getElementById(`mainChestThirdDrawerDigit${idx}`));
    const digitTexts = [0, 1, 2].map((idx) => document.getElementById(`mainChestThirdDrawerDigitText${idx}`));
    const okBtn = document.getElementById("mainChestThirdDrawerOk");
    const hintEl = document.getElementById("mainChestThirdDrawerHint");
    if (digitBtns.some((btn) => !btn) || digitTexts.some((el) => !el) || !okBtn || !hintEl) return;

    const saved = Array.isArray(f.mainChestThirdDrawerDigits) ? f.mainChestThirdDrawerDigits : [0, 0, 0];
    const state = [0, 1, 2].map((idx) => {
      const value = Number(saved[idx]);
      return Number.isInteger(value) && value >= 0 && value <= 9 ? value : 0;
    });
    const render = () => {
      digitTexts.forEach((el, idx) => (el.textContent = String(state[idx])));
      hintEl.textContent = "";
    };

    digitBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        state[idx] = (state[idx] + 1) % 10;
        f.mainChestThirdDrawerDigits = state.slice();
        playSE?.("se-pi");
        render();
      });
    });
    render();

    okBtn.addEventListener("click", () => {
      f.mainChestThirdDrawerDigits = state.slice();
      if (state.join("") === "365") {
        f.unlockMainChestThirdDrawer = true;
        markProgress?.("unlock_main_chest_third_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("三段目の引き出しのロックが外れた。");
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
    card: "魔法のカード（ずっしりとした重さを感じる）",
    bag: "魔法の配達かばん",
    hat: "魔法の制帽",
    paper: "穴が開いた紙切れ",
    magicalPotion: "テラパワーエナジー",
    manjuBox: "溶岩まんじゅうの箱",
    memo: "メモ",
    fanClosed: "扇子",
    fanOpened: "開いた扇子",
    envelopeNostamp: "切手が貼られていない封筒",
    envelopeStamp: "切手が貼られた封筒",
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
  const markerContent = marker?.text || "";
  const markerHtml = markerContent ? `<span class="tanzaku-marker tanzaku-marker-${markerSide} notranslate" translate="no" lang="en" style="--marker-color:${marker.color || "#ff8a00"}">${markerContent}</span>` : "";
  showModal(title, `${markerHtml}<p class="tanzaku-message">${text}</p>`, [{ text: "閉じる", action: "close" }], null, {
    contentClass: `tanzaku-paper-modal tanzaku-${color}`,
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
