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
const BASE_42 = USE_LOCAL_ASSETS ? "images/42" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/42";
const BASE_SOUND_42 = USE_LOCAL_ASSETS ? "sounds/42" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/42";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I42 = (file) => `${BASE_42}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S42 = (file) => `${BASE_SOUND_42}/${file}`;
const DEFAULT_BGM = S42("natsuyasumino_bouken.mp3");

// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    living: [I42("living.webp")],
    livingRight: [I42("living_right.webp")],
    livingLeft: [I42("living_left.webp")],
    tv: [],
    beetle: [],
    kitchen: [I42("kitchen.webp")],
    entrance: [I42("entrance.webp")],
    entranceLeft: [I42("entrance_left.webp")],
    storage: [I42("storage.webp")],
    end: [I42("end.webp")],
    trueEnd: [I42("true_end.webp")],
    modernEnd: [I42("modern_end.webp"), I42("modern_end2.webp"), I42("modern_end3.webp"), I42("modern_end4.webp")],
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


    bearBeetle: I42("bear_beetle.webp"),
    bearBeetleLostHorn: I42("bear_beetle_lost_horn.webp"),
    horn: I42("horn.webp"),
    hornZoom: I42("horn_zoom.webp"),
    handheldFireworksSet: I42("handheld_fireworks_set.webp"),
    beetleRight: I42("beetle_migimuki.webp"),
    beetleLeft: I42("beetle_hidarimuki.webp"),
    part1: I42("part_1.webp"),
    part2: I42("part_2.webp"),
    part3: I42("part_3.webp"),
    flowerSeal: I42("flower_seal.webp"),
    birdSeal: I42("bird_seal.webp"),
    seals: I42("seals.webp"),
    fukin: I42("fukin.webp"),
    fukinWet: I42("fukin_wet.webp"),
    fukinDirt: I42("fukin_dirt.webp"),
    dirt: I42("dirt.webp"),
    beetleFlying: I42("beetle_flying.webp"),
    memo: I42("memo.webp"),
    hammer: I42("hammer.webp"),
    jellyRed: I42("jelly_red.webp"),
    jellyYellow: I42("jelly_yellow.webp"),
    jellyBlue: I42("jelly_blue.webp"),
    jellyWhite: I42("jelly_white.webp"),
    frozenJellyBlue: I42("frozen_jelly_blue.webp"),
    tvChannel1: I42("tv_channel_1.webp"),
    tvChannel2: I42("tv_channel_2.webp"),
    tvChannel3: I42("tv_channel_3.webp"),
    tvChannel4: I42("tv_channel_4.webp"),
    tvChannel1En: I42("tv_channel_1_en.webp"),
    tvChannel2En: I42("tv_channel_2_en.webp"),
    tvChannel3En: I42("tv_channel_3.webp"),
    tvChannel4En: I42("tv_channel_4_en.webp"),
    fukinInBasket: I42("fukin_in_basket.webp"),
    fukinDartInBasket: I42("fukin_dart_in_basket.webp"),
    gate: I42("gate.webp"),
    handheldFireworksSet: I42("handheld_fireworks_set.webp"),
    bucket: I42("bucket.webp"),
    bucketWithWater: I42("bucket_with_water.webp"),
    stick: I42("stick.webp"),
    picPanelNotCompleted: I42("pic_panel_not_completed.webp"),
    picPanelCompleted: I42("pic_panel_completed.webp"),
  },
  modals: {
    picForShelf: I42("pic_for_shelf.webp"),
    picForShelf2: I42("pic_for_shelf_2.webp"),
    zabuton: I42("modal_zabuton.webp"),
    mato: I42("modal_mato.webp"),
    matoClose: I42("modal_mato_close.webp"),
    matoOpen: I42("modal_mato_open.webp"),
    shojiBroken: I42("modal_shoji_broken.webp"),
    shojiRepaired: I42("modal_shoji_repaired.webp"),
    flowerDirty: I42("modal_flower_dirty.webp"),
    flower: I42("modal_flower.webp"),
    flowerCleaning: I42("modal_flower_cleaning.webp"),
    fukinWater: I42("modal_fukin_water.webp"),
    somen: I42("modal_somen.webp"),
    attackTv: I42("modal_attack_tv.webp"),
    attackTvWithHammer: I42("modal_attack_tv_with_hammer.webp"),
    calendar: I42("modal_calendar.webp"),
    innerRefrigerator: I42("modal_inner_refrigerator.webp"),
    innerFleezer: I42("modal_inner_fleezer.webp"),
    futon: I42("modal_futon.webp"),
    futon2: I42("modal_futon_2.webp"),
    cleanFukin: I42("modal_clean_fukin.webp"),
    cleanFukin2: I42("modal_clean_fukin_2.webp"),
    meltJelly: I42("modal_melt_jelly.webp"),
    keyhole: I42("modal_keyhole.webp"),
    keyholeUnlock: I42("modal_keyhole_unlock.webp"),
    hornCut: I42("modal_horn_cut.webp"),
    bearFlying: I42("modal_bear_flying.webp"),
    games: I42("modal_games.webp"),
    iconBall: I42("icon_ball.webp"),
    iconPuzzle: I42("icon_puzzle.webp"),
    iconCar: I42("icon_car.webp"),
    iconHorse: I42("icon_horse.webp"),
    iconBattle: I42("icon_battle.webp"),
    book: I42("modal_book.webp"),
    bookBeetle: I42("book_beetle.webp"),
    bookBeetleEn: I42("book_beetle_en.webp"),
    bucketWater: I42("modal_bucket_water.webp"),
    bearYonda: I42("modal_bear_yonda.webp"),
    memo: I42("modal_memo.webp"),
    hikidoHole: I42("modal_hikido_hole.webp"),
    hikidoHoleStick: I42("modal_hikido_hole_stick.webp"),
    bearEating: I42("modal_bear_eating.webp"),
    bearHanabi: I42("modal_bear_hanabi.webp"),
    drawer: I42("modal_drawer.webp"),
    // badend: I42("badend.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState42";
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
let daemonBearEatingTimer = null;
let livingLeftTopDrawerClicks = [];

const BEETLE_SLOT_ORDER = ["top", "right", "bottom", "left"];
// 正解が決まったら、各方向に置くアイテムIDを設定する。
// 例: { top: "key", right: "battery", bottom: "driver", left: "coin" }
const BEETLE_CORRECT_ITEMS = {
  top: "jellyRed",
  right: "jellyWhite",
  bottom: "jellyBlue",
  left: "jellyYellow",
};

const SHELF_PUZZLE_SOLVED = [0, 1, 2, 3, 4, 5];
const ENTRANCE_LEFT_PUZZLE_ANSWER = [3, 4, 9, 10];

// 部屋データ
let rooms = {
  living: {
    name: "居間",
    description: "落ち着いた和室だ。",
    clickableAreas: [
      {
        x: 17.5, y: 62.6, width: 14.9, height: 5.9,
        onClick: clickWrap(() => changeRoom("beetle"), { allowAtNight: true }),
        description: "カブトムシの対戦台",
        zIndex: 6,
        usable: () => true,
      },
      {
        x: 22.5, y: 64.8, width: 2.3, height: 1.5,
        onClick: clickWrap(function () {

        }),
        description: '右向きカブトムシ',
        zIndex: 5,
        usable: () => false,
        item: { img: 'beetleRight', visible: () => !getMainFlags().rightBeetleLaunched }
      },
      {
        x: 26.5, y: 65.0, width: 2.3, height: 1.5,
        onClick: clickWrap(function () {

        }),
        description: '左向きカブトムシ',
        zIndex: 5,
        usable: () => false,
        item: { img: 'beetleLeft', visible: () => !getMainFlags().leftBeetleDisappeared }
      },
      {
        x: 83.9, y: 41.6, width: 15.2, height: 45.1,
        onClick: clickWrap(function () {
          changeRoom("livingRight");
        }),
        description: '右の棚',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 82.3, y: 61.5, width: 13.2, height: 21.1,
        onClick: clickWrap(function () {

        }),
        description: '右の棚発光部分',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 85.8, y: 70.9, width: 3.3, height: 4.2,
        onClick: clickWrap(function () {

        }),
        description: '右の棚のカブトムシ消失地点',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 65.6, y: 76.4, width: 22.7, height: 23.2,
        onClick: clickWrap(handleLivingBearBeetleClick),
        description: 'クマ妖精出現地点',
        zIndex: 6,
        usable: () => getMainFlags().bearBeetleAppeared,
        item: {
          img: () => getMainFlags().foundHorn ? 'bearBeetleLostHorn' : 'bearBeetle',
          visible: () => getMainFlags().bearBeetleAppeared
        }
      },
      {
        x: 0.2, y: 49.8, width: 13.4, height: 25.0,
        onClick: clickWrap(function () {
          changeRoom("livingLeft");
        }),
        description: '左の棚',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 42.6, y: 5.8, width: 3.8, height: 2.9,
        onClick: clickWrap(function () {
          updateMessage("電灯になにかが引っかかっている");
        }),
        description: '電灯に引っかかった紙、かつカブトムシ到達点',
        zIndex: 5,
        usable: () => !getMainFlags().memoDropStarted,
        item: { img: 'memo', visible: () => !getMainFlags().memoDropStarted }
      },
      {
        x: 41.0, y: 4.3, width: 7.0, height: 7.0,
        onClick: clickWrap(function () {
          updateMessage("カブトムシが電灯の近くにとまっている");
        }),
        description: '電灯に到着したカブトムシ',
        zIndex: 6,
        usable: () => getMainFlags().beetleFlyingAtLamp,
        item: { img: 'beetleFlying', visible: () => getMainFlags().beetleFlyingAtLamp }
      },
      {
        x: 20.1, y: 89.4, width: 6.7, height: 6.4,
        onClick: clickWrap(function () {
          showObj(null, "紙切れが床に落ちている", IMAGES.modals.memo, "絵が描かれた紙きれを確認した");
        }),
        description: 'メモが落ちてきた地点',
        zIndex: 5,
        usable: () => getMainFlags().memoDropped,
        item: { img: 'memo', visible: () => getMainFlags().memoDropped }
      },
      {
        x: 68.1, y: 50.3, width: 14.6, height: 13.0,
        onClick: clickWrap(handleLivingTvClick),
        description: 'テレビ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 70.2, y: 53.2, width: 6.9, height: 5.9,
        onClick: clickWrap(function () {

        }),
        description: 'テレビ画面',
        zIndex: 5,
        usable: () => false,
        item: { img: 'blueBack', visible: () => gameState.main.flags.tvOn }
      },
      {
        x: 21.0, y: 28.6, width: 40.0, height: 32.7,
        onClick: clickWrap(function () {
          updateMessage("窓の外にはすだれがかかっている");
        }),
        description: '窓',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 65.3, y: 22.7, width: 21.6, height: 16.6,
        onClick: clickWrap(handleLivingShojiClick),
        description: '障子',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(handleLivingShojiClick),
        description: '障子リペア後オーバーレイ',
        zIndex: 5,
        usable: () => false,
        item: { img: 'seals', visible: () => getMainFlags().shojiRepaired }
      },
      {
        x: 40.0, y: 88.0, width: 23.0, height: 10.5,
        onClick: clickWrap(handleLivingZabutonClick),
        description: '手前の座布団',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 37.0, y: 71.3, width: 8.3, height: 6.0,
        onClick: clickWrap(showLivingDeskNoteModal),
        description: '机の上の書置き',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0,
        y: 91,
        width: 9,
        height: 9,
        onClick: clickWrap(
          function () {
            changeRoom("kitchen");
          },
          { allowAtNight: true },
        ),
        description: "リビング左、キッチンへ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 91,
        y: 91,
        width: 9,
        height: 9,
        onClick: clickWrap(
          function () {
            changeRoom("entrance");
          },
          { allowAtNight: true },
        ),
        description: "リビング下、玄関へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  livingRight: {
    name: "居間・右の棚",
    description: "",
    clickableAreas: [
      {
        x: 7.6, y: 5.7, width: 20.1, height: 24.6,
        onClick: clickWrap(showMatryoshkaModal),
        description: 'マトリョーシカ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 8.2, y: 36.1, width: 32.9, height: 24.4,
        onClick: clickWrap(function () {
          showModal(
            "「カブトムシの豆知識」という本がある。",
            `<img src="${IMAGES.modals.book}" alt="カブトムシの豆知識の本" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`,
            [
              {
                text: "読む",
                action: () => {
                  closeModal();
                  showObj(
                    null,
                    "カブトムシの豆知識",
                    IMAGES.modals.bookBeetle,
                    "「カブトムシの豆知識」を読んだ",
                    IMAGES.modals.bookBeetleEn,
                  );
                },
              },
              { text: "閉じる", action: "close" },
            ],
          );
          updateMessage("「カブトムシの豆知識」という本がある。");
        }),
        description: '並んだ本',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 56.9, y: 52.1, width: 22.5, height: 9.6,
        onClick: clickWrap(function () {
          showObj(null, "ゲームのカセットがある", IMAGES.modals.games, "ゲームのカセットがある");
        }),
        description: 'ゲームのカセット',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 43.7, y: 49.5, width: 15.0, height: 10.6,
        onClick: clickWrap(function () {
          acquireItemOnce("foundFukin", "fukin", "タオルがある", IMAGES.items.fukin, "タオルを手に入れた")
        }),
        description: 'タオル',
        zIndex: 5,
        usable: () => !getMainFlags().foundFukin,
        item: { img: 'fukin', visible: () => !getMainFlags().foundFukin }
      },
      {
        x: 7.6, y: 65.6, width: 75.1, height: 23.6,
        onClick: clickWrap(handleLivingRightShelfClick),
        description: '棚の下段の引き戸',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 53.2, y: 69.0, width: 19.7, height: 17.9,
        onClick: clickWrap(function () {

        }),
        description: '引き戸の絵合わせパネル(パーツ不足)',
        zIndex: 5,
        usable: () => false,
        item: { img: 'picPanelNotCompleted', visible: () => !getMainFlags().shelfPartsInstalled }
      },
      {
        x: 53.2, y: 69.0, width: 19.7, height: 17.9,
        onClick: clickWrap(function () {

        }),
        description: '引き戸の絵合わせパネル(はめこみ完了)',
        zIndex: 5,
        usable: () => false,
        item: { img: 'picPanelCompleted', visible: () => getMainFlags().shelfPartsInstalled && !getMainFlags().shelfDoorOpen && !gameState.fx?.shelfDoorSlideStart }
      },
      {
        x: 91,
        y: 91,
        width: 9,
        height: 9,
        onClick: clickWrap(() => changeRoom("living"), { allowAtNight: true }),
        description: "居間へ戻る",
        zIndex: 10,
        usable: () => true,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  livingLeft: {
    name: "居間・左の棚",
    description: "",
    clickableAreas: [
      {
        x: 47.1, y: 26.8, width: 19.8, height: 18.6,
        onClick: clickWrap(() => handleLivingLeftTopDrawerClick("left")),
        description: '引き出し1段目左',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 70.2, y: 26.8, width: 19.5, height: 18.7,
        onClick: clickWrap(() => handleLivingLeftTopDrawerClick("right")),
        description: '引き出し1段目右',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 47.3, y: 48.6, width: 42.6, height: 18.6,
        onClick: clickWrap(showLivingLeftSecondDrawerPuzzle),
        description: '引き出し2段目',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 47.0, y: 70.9, width: 42.9, height: 21.8,
        onClick: clickWrap(handleLivingLeftThirdDrawerClick),
        description: '引き出し3段目',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91,
        y: 91,
        width: 9,
        height: 9,
        onClick: clickWrap(() => changeRoom("living"), { allowAtNight: true }),
        description: "居間へ戻る",
        zIndex: 10,
        usable: () => true,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  kitchen: {
    name: "キッチン",
    description: "食器や調理器具が並んでいる。",
    clickableAreas: [
      {
        x: 77.6, y: 34.8, width: 19.7, height: 12.5,
        onClick: clickWrap(function () {
          handleKitchenFreezerClick();
        }),
        description: '冷凍庫',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 78.2, y: 49.2, width: 18.8, height: 26.6,
        onClick: clickWrap(showKitchenFridgePuzzle),
        description: '冷蔵庫',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 29.1, y: 75.5, width: 39.9, height: 19.6,
        onClick: clickWrap(function () {
          showObj(null, "そうめんが盛りつけられたお皿がある", IMAGES.modals.somen, "そうめんのお皿を確認した");
        }),
        description: 'そうめんのお皿',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 31.6, y: 35.4, width: 22.2, height: 13.9,
        onClick: clickWrap(handleKitchenSinkClick),
        description: '流し',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 57.6, y: 51.0, width: 16.7, height: 5.0,
        onClick: clickWrap(handleKitchenMiddleDrawerClick),
        description: '台所の中段引き出し',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 52.2, y: 57.4, width: 22.1, height: 14.7,
        onClick: clickWrap(function () {

        }),
        description: 'シンクの下の扉',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91,
        y: 91,
        width: 9,
        height: 9,
        onClick: clickWrap(() => changeRoom("living"), { allowAtNight: true }),
        description: "キッチン右、居間へ",
        zIndex: 5,
        usable: () => true,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  entrance: {
    name: "玄関",
    description: "靴箱がある",
    clickableAreas: [
      {
        x: 39.2, y: 9.5, width: 49.4, height: 68.9,
        onClick: clickWrap(handleEntranceDoorClick),
        description: '玄関の扉',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 17.0, y: 17.4, width: 14.4, height: 14.4,
        onClick: clickWrap(function () {
          showObj(null, "カレンダーがかかっている", IMAGES.modals.calendar, "カレンダーを確認した");
        }),
        description: 'カレンダー',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 7.3, y: 46.1, width: 3.5, height: 3.3,
        onClick: clickWrap(function () {

        }),
        description: '花瓶の汚れ遠くから',
        zIndex: 5,
        usable: () => false,
        item: { img: 'dirt', visible: () => !getMainFlags().cleanFlower }
      },
      {
        x: 0,
        y: 28,
        width: 32,
        height: 68,
        onClick: clickWrap(() => changeRoom("entranceLeft"), { allowAtNight: true }),
        description: "玄関左の靴箱",
        zIndex: 5,
        usable: () => true,
      },
      {
        x: 91,
        y: 41,
        width: 9,
        height: 9,
        onClick: clickWrap(() => changeRoom("storage"), { allowAtNight: true }),
        description: "玄関右、押し入れへ",
        zIndex: 6,
        usable: () => true,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 91,
        y: 91,
        width: 9,
        height: 9,
        onClick: clickWrap(() => changeRoom("living"), { allowAtNight: true }),
        description: "玄関右下、居間へ戻る",
        zIndex: 6,
        usable: () => true,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  entranceLeft: {
    name: "玄関・靴箱",
    description: "玄関の靴箱だ。",
    clickableAreas: [
      {
        x: 21.8, y: 22.9, width: 7.8, height: 7.8,
        onClick: clickWrap(function () {

        }),
        description: '花瓶の汚れ',
        zIndex: 5,
        usable: () => false,
        item: { img: 'dirt', visible: () => !getMainFlags().cleanFlower }
      },
      {
        x: 10.1, y: 0.2, width: 32.0, height: 31.9,
        onClick: clickWrap(handleEntranceLeftFlowerClick),
        description: '花瓶',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 15.1, y: 40.0, width: 80.0, height: 42.8,
        onClick: clickWrap(handleEntranceMainStorageClick),
        description: '靴箱メイン収納部',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 15.4, y: 86.6, width: 39.4, height: 10.6,
        onClick: clickWrap(handleEntranceLeftDrawerClick),
        description: '靴箱引き出し左',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 59.5, y: 87.0, width: 35.5, height: 10.4,
        onClick: clickWrap(handleEntranceRightDrawerClick),
        description: '靴箱引き出し右',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0,
        y: 91,
        width: 9,
        height: 9,
        onClick: clickWrap(() => changeRoom("entrance"), { allowAtNight: true }),
        description: "玄関へ戻る",
        zIndex: 10,
        usable: () => true,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  storage: {
    name: "押し入れ",
    description: "",
    clickableAreas: [
      {
        x: 58.0, y: 35.3, width: 36.3, height: 22.0,
        onClick: clickWrap(function () {
          showStorageFutonModal();
        }),
        description: '布団',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 10.8, y: 78.4, width: 28.4, height: 21.1,
        onClick: clickWrap(function () {
          handleStorageLaundryBasketClick();
        }),
        description: '洗濯籠',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '洗濯籠に入ったタオル',
        zIndex: 5,
        usable: () => false,
        item: { img: 'fukinInBasket', visible: () => gameState.main.flags.fukinInBasket }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '洗濯籠に入った汚れたタオル',
        zIndex: 5,
        usable: () => false,
        item: { img: 'fukinDartInBasket', visible: () => gameState.main.flags.fukinDirtInBasket }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '現代へのゲート(表示)',
        zIndex: 5,
        usable: () => false,
        item: { img: 'gate', visible: () => getTvChannelIndex() === 3 }
      },
      {
        x: 57.2, y: 88.8, width: 38.2, height: 8.2,
        onClick: clickWrap(handleStorageModernGateClick),
        description: '現代へのゲート(クリック用)',
        zIndex: 5,
        usable: () => getTvChannelIndex() === 3,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91,
        y: 91,
        width: 9,
        height: 9,
        onClick: clickWrap(() => changeRoom("entrance"), { allowAtNight: true }),
        description: "玄関へ戻る",
        zIndex: 10,
        usable: () => true,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  beetle: {
    name: "カブトムシの戦闘盤",
    description: "2匹のカブトムシが戦っている。",
    clickableAreas: [
      {
        x: 20,
        y: 19,
        width: 60,
        height: 52,
        onClick: clickWrap(() => updateMessage("カブトムシたちが戦っている")),
        description: "戦っているカブトムシ",
        zIndex: 5,
        usable: () => !getMainFlags().beetleBattleEnded,
      },
      {
        x: 20,
        y: 19,
        width: 60,
        height: 52,
        onClick: clickWrap(() => updateMessage("カブトムシが誇らしげにのんびりしている。こちらが勝者なのだろう")),
        description: "のんびりしているカブトムシ",
        zIndex: 5,
        usable: () => getMainFlags().beetleBattleEnded && !getMainFlags().beetleSolved,
      },
      ...BEETLE_SLOT_ORDER.map((side) => ({
        x: () => getBeetleSlotArea(side).x,
        y: () => getBeetleSlotArea(side).y,
        width: () => getBeetleSlotArea(side).width,
        height: () => getBeetleSlotArea(side).height,
        onClick: clickWrap(() => handleBeetleSlotClick(side)),
        description: `${side} item slot`,
        zIndex: 7,
        usable: () => getMainFlags().beetleBattleEnded && !getMainFlags().beetleSolved,
      })),
      {
        x: 39,
        y: 91,
        width: 22,
        height: 7,
        onClick: clickWrap(checkBeetleAnswer),
        description: "OKボタン",
        zIndex: 7,
        usable: () => getMainFlags().beetleBattleEnded && !getMainFlags().beetleSolved,
      },
      {
        x: 43,
        y: 35,
        width: 14,
        height: 20,
        onClick: clickWrap(handleBeetleStickClick),
        description: "カブトムシが残した棒",
        zIndex: 7,
        usable: () => getMainFlags().beetleSolved && !getMainFlags().foundBeetleStick && !gameState.fx?.beetleJoySequence,
        item: {
          img: "stick",
          visible: () => getMainFlags().beetleSolved && !getMainFlags().foundBeetleStick && !gameState.fx?.beetleJoySequence,
        },
      },
      {
        x: 91,
        y: 91,
        width: 9,
        height: 9,
        onClick: clickWrap(() => changeRoom("living"), { allowAtNight: true }),
        description: "リビングへ戻る",
        zIndex: 8,
        usable: () => true,
        item: { img: "back", visible: () => true },
      },
    ],
  },

  tv: {
    name: "テレビ",
    description: "テレビの画面とチャンネルダイヤルがある。",
    clickableAreas: [
      {
        x: 8.5, y: 9.0, width: 65.5, height: 72.0,
        onClick: clickWrap(() => updateMessage(`チャンネル${getTvChannelIndex() + 1}が映っている。`)),
        description: "テレビ画面",
        zIndex: 5,
        usable: () => true,
        item: { img: getTvChannelImageKey, visible: () => true },
      },
      {
        x: 79.0, y: 11.0, width: 15.0, height: 21.0,
        onClick: clickWrap(handleTvChannelDialClick),
        description: "チャンネル選択ダイヤル",
        zIndex: 6,
        usable: () => true,
      },
      {
        x: 79.0, y: 33.0, width: 15.0, height: 20.0,
        onClick: clickWrap(handleTvLanguageDialClick),
        description: "言語切り替えダイヤル",
        zIndex: 6,
        usable: () => true,
      },
      {
        x: 89, y: 89, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("living"), { allowAtNight: true }),
        description: "居間へ戻る",
        zIndex: 10,
        usable: () => true,
        item: { img: "back", visible: () => true },
      },
    ],
  },









  end: {
    name: "ノーマルエンド",
    description: "夏の民家から脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 3.8, y: 16.8, width: 14.6, height: 15.3,
        onClick: clickWrap(function () {
          updateMessage("「ぶーん」");
        }),
        description: '飛ぶクマ妖精',
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
          showEndingReport("end");
        }),
        description: "ノーマルエンド",
      },
    ],
  },

  trueEnd: {
    name: "トゥルーエンド",
    description: "クマ妖精と一緒に花火を楽しみます。脱出おめでとうございます。",
    clickableAreas: [
      {
        x: 37.3, y: 30.9, width: 31.0, height: 24.4,
        onClick: clickWrap(function () {
          showObj(null, "「ぶんぶん！」", IMAGES.modals.bearHanabi, "クマ妖精は花火を振り回して楽しんでいる");
        }),
        description: '花火をするクマ妖精',
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
    bear: ["「呼んだ？」", "「夏だねえ」"],
    bear2: ["「ボクのツノが・・・」", "「一生懸命作ったのに」"],
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
    if (nextBackgroundState === 1 || nextBackgroundState === 3) {
      if (hasItem("fukinWet")) removeItem("fukinWet");
      changeBGM(S42("remoncake_and_hachimitsukoucha.mp3"));
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

// ゲーム初期化
function initGame() {
  renderNavigation();
  changeRoom("living");
  updateInventoryDisplay();
  updateMessage("気が付くと古びた和室に立っていた");
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

const NAV_DISCOVERY_ROOMS = new Set(["kitchen", "storage", "entrance"]);

function changeRoom(roomId) {
  const prevRoom = gameState.currentRoom;

  if (prevRoom === "livingLeft" && roomId !== "livingLeft") {
    livingLeftTopDrawerClicks = [];
  }

  if (roomId === "end" || roomId === "trueEnd") {
    removeItemsOnEndingArrival(["paper"]);
  }

  gameState.currentRoom = roomId;
  if (NAV_DISCOVERY_ROOMS.has(roomId)) {
    addNaviItem(roomId);
  }
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
  const roomDescription =
    roomId === "beetle" && f.beetleSolved
      ? "そして誰もいなくなった"
      : roomId === "beetle" && f.beetleBattleEnded
        ? "カブトムシが1匹だけでのんびりしている。"
        : room.description;
  const msg = room.name && room.name.trim() !== "" ? `${room.name}です。${roomDescription}` : roomDescription;
  if (roomId === "trueEnd") {
    updateMessageHTML(msg);
  } else {
    updateMessage(msg);
  }

  // BGM切替はそのまま
  if (roomId === "trueEnd") {
    changeBGM(S42("I_Need_Only_You.mp3"));
  } else if (roomId === "end") {
    const endBgState = gameState.end?.flags?.backgroundState ?? 0;
    changeBGM(endBgState === 0 ? S42("Playing_in_the_river.mp3") : S42("Playing_in_the_river.mp3"));
  } else if (roomId === "modernEnd") {
    const modernEndBgState = gameState.modernEnd?.flags?.backgroundState ?? 0;
    changeBGM(S42(modernEndBgState === 1 || modernEndBgState === 3 ? "remoncake_and_hachimitsukoucha.mp3" : "natsuno_owarini.mp3"));
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

const END_IDS = new Set(["end", "trueEnd", "modernEnd"]);

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

  drawBeetleRoom(ctx, canvas, roomId);
  drawTvRoom(ctx, canvas, roomId);
  drawLivingRightShelfDoor(ctx, canvas, roomId, bgImg);
  drawEntranceMainStorageDoor(ctx, canvas, roomId, bgImg);
  drawEntranceLeftDrawer(ctx, canvas, roomId, bgImg);
  drawEntranceRightDrawer(ctx, canvas, roomId, bgImg);
  drawKitchenMiddleDrawer(ctx, canvas, roomId, bgImg);

  drawShiwakePuzzle(ctx, canvas, roomId);
  drawBoardDoor(ctx, canvas, roomId);
  drawBoardChest(ctx, canvas, roomId);
  drawBoardDesk(ctx, canvas, roomId);
  drawBoardAdmin(ctx, canvas, roomId);

  // アイテム描画（未取得のみ）
  drawRoomItems(ctx, canvas, roomId);
  drawTvScreenOverlay(ctx, canvas, roomId);
  drawLivingBeetleMemoFx(ctx, canvas, roomId);
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

function drawTvRoom(ctx, canvas, roomId) {
  if (roomId !== "tv") return;
  const w = canvas.width;
  const h = canvas.height;
  const body = { x: w * 0.035, y: h * 0.055, w: w * 0.93, h: h * 0.79 };
  const screen = { x: w * 0.085, y: h * 0.09, w: w * 0.655, h: h * 0.72 };
  const controls = { x: w * 0.77, y: h * 0.09, w: w * 0.16, h: h * 0.72 };

  ctx.save();
  ctx.fillStyle = "#2b160f";
  ctx.fillRect(0, 0, w, h);

  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = w * 0.025;
  ctx.shadowOffsetY = h * 0.018;
  const cabinet = ctx.createLinearGradient(body.x, body.y, body.x, body.y + body.h);
  cabinet.addColorStop(0, "#aa895d");
  cabinet.addColorStop(0.18, "#76664f");
  cabinet.addColorStop(0.78, "#544938");
  cabinet.addColorStop(1, "#30271f");
  ctx.fillStyle = cabinet;
  ctx.strokeStyle = "#1c1713";
  ctx.lineWidth = Math.max(5, w * 0.012);
  roundRect(ctx, body.x, body.y, body.w, body.h, w * 0.025, true, true);

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = "#171612";
  ctx.strokeStyle = "#b2a185";
  ctx.lineWidth = Math.max(4, w * 0.008);
  roundRect(ctx, screen.x - w * 0.024, screen.y - h * 0.025, screen.w + w * 0.048, screen.h + h * 0.05, w * 0.045, true, true);

  ctx.fillStyle = "#343329";
  ctx.strokeStyle = "#1b1915";
  ctx.lineWidth = Math.max(3, w * 0.006);
  roundRect(ctx, controls.x, controls.y, controls.w, controls.h, w * 0.015, true, true);

  const drawDial = (cx, cy, radius, angle) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = radius * 0.3;
    ctx.shadowOffsetY = radius * 0.15;
    const dial = ctx.createRadialGradient(-radius * 0.28, -radius * 0.3, radius * 0.08, 0, 0, radius);
    dial.addColorStop(0, "#d2c8ad");
    dial.addColorStop(0.42, "#827c6b");
    dial.addColorStop(0.78, "#403d35");
    dial.addColorStop(1, "#171612");
    ctx.fillStyle = dial;
    ctx.strokeStyle = "#0e0d0b";
    ctx.lineWidth = Math.max(2, radius * 0.12);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.rotate(angle);
    ctx.strokeStyle = "#eee5cc";
    ctx.lineWidth = Math.max(2, radius * 0.13);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, radius * 0.12);
    ctx.lineTo(0, -radius * 0.62);
    ctx.stroke();
    ctx.restore();
  };

  const channelAngles = [-0.85, -0.28, 0.28, 0.85];
  drawDial(controls.x + controls.w / 2, controls.y + controls.h * 0.18, controls.w * 0.29, channelAngles[getTvChannelIndex()]);
  drawDial(controls.x + controls.w / 2, controls.y + controls.h * 0.42, controls.w * 0.24, uiLang === "en" ? 0.55 : -0.55);

  ctx.fillStyle = "#d8ccb0";
  ctx.font = `bold ${Math.max(10, Math.round(w * 0.018))}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("CH", controls.x + controls.w / 2, controls.y + controls.h * 0.29);
  ctx.fillText("JP / EN", controls.x + controls.w / 2, controls.y + controls.h * 0.51);

  // スピーカーグリル
  ctx.fillStyle = "#181713";
  const grilleX = controls.x + controls.w * 0.16;
  const grilleW = controls.w * 0.68;
  for (let i = 0; i < 7; i++) {
    roundRect(ctx, grilleX, controls.y + controls.h * (0.57 + i * 0.045), grilleW, Math.max(3, h * 0.012), 2, true, false);
  }

  // 下部の電源ランプとスイッチ
  ctx.fillStyle = "#d5b55b";
  ctx.beginPath();
  ctx.arc(controls.x + controls.w * 0.27, controls.y + controls.h * 0.91, controls.w * 0.045, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#171612";
  roundRect(ctx, controls.x + controls.w * 0.48, controls.y + controls.h * 0.875, controls.w * 0.32, controls.h * 0.07, 3, true, false);
  ctx.restore();
}

function drawTvScreenOverlay(ctx, canvas, roomId) {
  if (roomId !== "tv") return;
  const x = canvas.width * 0.085;
  const y = canvas.height * 0.09;
  const w = canvas.width * 0.655;
  const h = canvas.height * 0.72;
  ctx.save();
  ctx.strokeStyle = "rgba(15,14,11,0.9)";
  ctx.lineWidth = Math.max(5, canvas.width * 0.012);
  roundRect(ctx, x, y, w, h, canvas.width * 0.04, false, true);
  const glass = ctx.createLinearGradient(x, y, x + w, y + h);
  glass.addColorStop(0, "rgba(255,255,235,0.24)");
  glass.addColorStop(0.18, "rgba(255,255,255,0.04)");
  glass.addColorStop(0.7, "rgba(0,0,0,0.02)");
  glass.addColorStop(1, "rgba(0,0,0,0.24)");
  ctx.fillStyle = glass;
  roundRect(ctx, x, y, w, h, canvas.width * 0.04, true, false);
  ctx.restore();
}

function drawBeetleRoom(ctx, canvas, roomId) {
  if (roomId !== "beetle") return;

  const w = canvas.width;
  const h = canvas.height;
  const state = getBeetleState();
  const flags = getMainFlags();
  const battleEnded = !!flags.beetleBattleEnded;
  ctx.save();
  ctx.fillStyle = "#F6D085";
  ctx.fillRect(0, 0, w, h);

  // 中央の対戦枠
  const arena = { x: w * 0.2, y: h * 0.19, w: w * 0.6, h: h * 0.52 };
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.strokeStyle = "#55351f";
  ctx.lineWidth = Math.max(4, w * 0.009);
  roundRect(ctx, arena.x, arena.y, arena.w, arena.h, 12, true, true);

  const beetleW = arena.w * 0.43;
  const beetleH = arena.h * 0.64;
  const beetleY = arena.y + (arena.h - beetleH) / 2;
  const rightFacing = loadedImages[IMAGES.items.beetleRight];
  const leftFacing = loadedImages[IMAGES.items.beetleLeft];
  if (battleEnded) {
    const idleX = arena.x + (arena.w - beetleW) / 2 + Math.sin(performance.now() / 900) * w * 0.004;
    const idleY = beetleY + Math.sin(performance.now() / 1100) * h * 0.003;
    const joyFx = gameState.fx?.beetleJoySequence;
    if (joyFx) {
      const t = Math.max(0, Math.min(1, Number(joyFx.progress) || 0));
      const beetleAlpha = 1 - Math.max(0, (t - 0.68) / 0.24);
      const scale = 1 - Math.max(0, (t - 0.7) / 0.3) * 0.78;
      const cx = idleX + beetleW / 2;
      const cy = idleY + beetleH / 2 - Math.sin(Math.min(1, t / 0.42) * Math.PI * 4) * h * 0.018;

      if (leftFacing?.complete && beetleAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = beetleAlpha;
        ctx.translate(cx, cy);
        ctx.rotate(easeOutCubic(Math.min(1, t / 0.72)) * Math.PI * 2);
        ctx.drawImage(leftFacing, (-beetleW * scale) / 2, (-beetleH * scale) / 2, beetleW * scale, beetleH * scale);
        ctx.restore();
      }

      if (t < 0.62) {
        ctx.save();
        ctx.fillStyle = `rgba(116, 72, 178, ${1 - t / 0.75})`;
        ctx.font = `bold ${Math.round(w * 0.055)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("♪", cx - w * 0.06, cy - beetleH * 0.54 - Math.sin(t * Math.PI * 5) * h * 0.02);
        ctx.fillText("♫", cx + w * 0.07, cy - beetleH * 0.43 - Math.cos(t * Math.PI * 4) * h * 0.018);
        ctx.restore();
      }

      if (t > 0.58) drawBeetleLightOrb(ctx, cx, cy, w * (0.025 + Math.min(1, (t - 0.58) / 0.28) * 0.045), Math.min(1, (t - 0.58) / 0.2));
    } else if (!flags.beetleSolved && leftFacing?.complete) {
      ctx.drawImage(leftFacing, idleX, idleY, beetleW, beetleH);
    }
  } else {
    // 接触位置をわずかに往復させ、押し合っているように見せる。
    const push = Math.sin(performance.now() / 180) * w * 0.008;
    if (rightFacing?.complete) ctx.drawImage(rightFacing, arena.x + arena.w * 0.07 + push, beetleY, beetleW, beetleH);
    if (leftFacing?.complete) ctx.drawImage(leftFacing, arena.x + arena.w * 0.5 - push, beetleY, beetleW, beetleH);
  }

  if (battleEnded && !flags.beetleSolved) {
    // 上下左右のアイテム配置枠
    BEETLE_SLOT_ORDER.forEach((side) => {
      const area = getBeetleSlotArea(side);
      const x = (area.x / 100) * w;
      const y = (area.y / 100) * h;
      const sw = (area.width / 100) * w;
      const sh = (area.height / 100) * h;
      ctx.fillStyle = "rgba(255,255,255,0.68)";
      ctx.strokeStyle = "#76502d";
      ctx.lineWidth = Math.max(2, w * 0.004);
      ctx.setLineDash([7, 5]);
      roundRect(ctx, x, y, sw, sh, 9, true, true);
      ctx.setLineDash([]);

      const itemId = state.placements[side];
      const itemImg = itemId && loadedImages[IMAGES.items[itemId]];
      if (itemImg?.complete) {
        const pad = sw * 0.12;
        ctx.drawImage(itemImg, x + pad, y + pad, sw - pad * 2, sh - pad * 2);
      } else if (!itemId) {
        ctx.fillStyle = "rgba(85,53,31,0.5)";
        ctx.font = `${Math.round(w * 0.045)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("＋", x + sw / 2, y + sh / 2);
      }
    });

    // OKボタン
    const ok = { x: w * 0.39, y: h * 0.91, w: w * 0.22, h: h * 0.07 };
    ctx.fillStyle = flags.beetleSolved ? "#5eaa62" : "#fff7df";
    ctx.strokeStyle = "#55351f";
    ctx.lineWidth = Math.max(2, w * 0.004);
    roundRect(ctx, ok.x, ok.y, ok.w, ok.h, 10, true, true);
    ctx.fillStyle = "#3e291b";
    ctx.font = `bold ${Math.round(w * 0.035)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("OK", ok.x + ok.w / 2, ok.y + ok.h / 2);
  }
  ctx.restore();
}

function drawBeetleLightOrb(ctx, x, y, radius, alpha = 1) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.shadowColor = "rgba(255, 244, 150, 1)";
  ctx.shadowBlur = radius * 2.8;
  const glow = ctx.createRadialGradient(x - radius * 0.24, y - radius * 0.28, radius * 0.08, x, y, radius);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.35, "rgba(255,248,176,0.96)");
  glow.addColorStop(0.72, "rgba(255,198,70,0.5)");
  glow.addColorStop(1, "rgba(255,190,40,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLivingRightShelfDoor(ctx, canvas, roomId, bgImg) {
  if (roomId !== "livingRight" || !bgImg?.complete || !bgImg.naturalWidth) return;
  const flags = getMainFlags();
  const slideStart = gameState.fx?.shelfDoorSlideStart;
  if (!flags.shelfDoorOpen && !slideStart) return;

  const progress = flags.shelfDoorOpen ? 1 : Math.min(1, Math.max(0, (performance.now() - slideStart) / 700));
  const x = canvas.width * 0.45;
  const y = canvas.height * 0.655;
  const w = canvas.width * 0.38;
  const h = canvas.height * 0.24;
  const slideDistance = canvas.width * 0.355 * easeOutCubic(progress);

  ctx.save();
  ctx.fillStyle = "#24150d";
  ctx.fillRect(x, y, w, h);

  const sx = bgImg.naturalWidth * 0.45;
  const sy = bgImg.naturalHeight * 0.655;
  const sw = bgImg.naturalWidth * 0.38;
  const sh = bgImg.naturalHeight * 0.24;
  ctx.drawImage(bgImg, sx, sy, sw, sh, x - slideDistance, y, w, h);

  // 右側の引き戸に重ねた完成パネルも、戸と同じ距離だけ移動させる。
  const panelImg = loadedImages[IMAGES.items.picPanelCompleted];
  if (flags.shelfPartsInstalled && panelImg?.complete && panelImg.naturalWidth) {
    const panelX = canvas.width * 0.532 - slideDistance;
    const panelY = canvas.height * 0.69;
    const panelW = canvas.width * 0.197;
    const panelH = canvas.height * 0.179;
    ctx.drawImage(panelImg, panelX, panelY, panelW, panelH);
  }
  ctx.restore();
}

function drawEntranceLeftDrawer(ctx, canvas, roomId, bgImg) {
  if (roomId !== "entranceLeft" || !bgImg?.complete || !bgImg.naturalWidth) return;
  const state = getEntranceLeftPuzzleState();
  const slideStart = gameState.fx?.entranceLeftDrawerSlideStart;
  if (!slideStart) return;

  const elapsed = performance.now() - slideStart;
  const progress = elapsed < 500 ? elapsed / 500 : elapsed < 750 ? 1 : Math.max(0, 1 - (elapsed - 750) / 450);
  const eased = easeOutCubic(progress);
  const source = { x: 0.154, y: 0.866, w: 0.394, h: 0.106 };
  const baseX = canvas.width * source.x;
  const baseY = canvas.height * source.y;
  const baseW = canvas.width * source.w;
  const baseH = canvas.height * source.h;
  const growX = canvas.width * 0.008 * eased;
  const moveY = canvas.height * 0.015 * eased;

  ctx.save();
  ctx.fillStyle = "#21140d";
  ctx.fillRect(baseX, baseY, baseW, baseH);
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 12 * eased;
  ctx.shadowOffsetY = 8 * eased;
  ctx.drawImage(
    bgImg,
    bgImg.naturalWidth * source.x,
    bgImg.naturalHeight * source.y,
    bgImg.naturalWidth * source.w,
    bgImg.naturalHeight * source.h,
    baseX - growX,
    baseY + moveY,
    baseW + growX * 2,
    baseH * (1 + 0.04 * eased),
  );
  ctx.restore();
}

function drawEntranceMainStorageDoor(ctx, canvas, roomId, bgImg) {
  if (roomId !== "entranceLeft" || !bgImg?.complete || !bgImg.naturalWidth) return;
  const flags = getMainFlags();
  const slideStart = gameState.fx?.entranceMainStorageSlideStart;
  if (!flags.entranceMainStorageOpen && !slideStart) return;

  const duration = 850;
  const progress = flags.entranceMainStorageOpen ? 1 : Math.min(1, (performance.now() - slideStart) / duration);
  const eased = easeOutCubic(progress);
  const source = { x: 0.151, y: 0.4, w: 0.8, h: 0.428 };
  const baseX = canvas.width * source.x;
  const baseY = canvas.height * source.y;
  const baseW = canvas.width * source.w;
  const baseH = canvas.height * source.h;
  const halfW = baseW / 2;

  ctx.save();
  ctx.fillStyle = "#21140d";
  ctx.fillRect(baseX, baseY, halfW, baseH);
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 8 * eased;
  ctx.shadowOffsetX = -4 * eased;
  ctx.drawImage(
    bgImg,
    bgImg.naturalWidth * source.x,
    bgImg.naturalHeight * source.y,
    bgImg.naturalWidth * source.w * 0.5,
    bgImg.naturalHeight * source.h,
    baseX + halfW * eased,
    baseY,
    halfW,
    baseH,
  );
  ctx.restore();
}

function drawEntranceRightDrawer(ctx, canvas, roomId, bgImg) {
  if (roomId !== "entranceLeft" || !bgImg?.complete || !bgImg.naturalWidth) return;
  const slideStart = gameState.fx?.entranceRightDrawerSlideStart;
  if (!slideStart) return;

  const elapsed = performance.now() - slideStart;
  const progress = elapsed < 500 ? elapsed / 500 : elapsed < 750 ? 1 : Math.max(0, 1 - (elapsed - 750) / 450);
  const eased = easeOutCubic(progress);
  const source = { x: 0.595, y: 0.87, w: 0.355, h: 0.104 };
  const baseX = canvas.width * source.x;
  const baseY = canvas.height * source.y;
  const baseW = canvas.width * source.w;
  const baseH = canvas.height * source.h;
  const growX = canvas.width * 0.008 * eased;
  const moveY = canvas.height * 0.015 * eased;

  ctx.save();
  ctx.fillStyle = "#21140d";
  ctx.fillRect(baseX, baseY, baseW, baseH);
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 12 * eased;
  ctx.shadowOffsetY = 8 * eased;
  ctx.drawImage(
    bgImg,
    bgImg.naturalWidth * source.x,
    bgImg.naturalHeight * source.y,
    bgImg.naturalWidth * source.w,
    bgImg.naturalHeight * source.h,
    baseX - growX,
    baseY + moveY,
    baseW + growX * 2,
    baseH * (1 + 0.04 * eased),
  );
  ctx.restore();
}

function drawKitchenMiddleDrawer(ctx, canvas, roomId, bgImg) {
  if (roomId !== "kitchen" || !bgImg?.complete || !bgImg.naturalWidth) return;
  const slideStart = gameState.fx?.kitchenDrawerSlideStart;
  if (!slideStart) return;

  const elapsed = performance.now() - slideStart;
  const progress = elapsed < 450 ? elapsed / 450 : elapsed < 700 ? 1 : Math.max(0, 1 - (elapsed - 700) / 400);
  const eased = easeOutCubic(progress);
  const source = { x: 0.576, y: 0.51, w: 0.167, h: 0.05 };
  const baseX = canvas.width * source.x;
  const baseY = canvas.height * source.y;
  const baseW = canvas.width * source.w;
  const baseH = canvas.height * source.h;
  const growX = canvas.width * 0.006 * eased;
  const moveY = canvas.height * 0.025 * eased;

  ctx.save();
  ctx.fillStyle = "#21140d";
  ctx.fillRect(baseX, baseY, baseW, baseH);
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 12 * eased;
  ctx.shadowOffsetY = 8 * eased;
  ctx.drawImage(
    bgImg,
    bgImg.naturalWidth * source.x,
    bgImg.naturalHeight * source.y,
    bgImg.naturalWidth * source.w,
    bgImg.naturalHeight * source.h,
    baseX - growX,
    baseY + moveY,
    baseW + growX * 2,
    baseH * (1 + 0.12 * eased),
  );
  ctx.restore();
}

let beetleAnimationFrame = null;
function animateBeetleRoom() {
  if (gameState.currentRoom === "beetle") renderCanvasRoom();
  beetleAnimationFrame = requestAnimationFrame(animateBeetleRoom);
}
beetleAnimationFrame = requestAnimationFrame(animateBeetleRoom);

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

function handleLivingLeftTopDrawerClick(side) {
  playSE("se-metal");

  if (getMainFlags().foundJellyRed) {
    livingLeftTopDrawerClicks = [];
    updateMessage("もう何もなさそうだ");
    return;
  }

  const answer = ["right", "right", "left", "right", "left", "right", "left"];
  livingLeftTopDrawerClicks.push(side);
  if (livingLeftTopDrawerClicks.length > answer.length) {
    livingLeftTopDrawerClicks.shift();
  }
  const solved = livingLeftTopDrawerClicks.length === answer.length && livingLeftTopDrawerClicks.every((value, index) => value === answer[index]);
  if (!solved) return;

  livingLeftTopDrawerClicks = [];
  openLivingLeftTopDrawer();
}

function openLivingLeftTopDrawer() {
  const flags = getMainFlags();
  const roomId = "livingLeft";
  const areaDescription = "引き出し1段目左";
  const drawerOptions = {
    frontFill: "#8F3E1D",
    sideTop: "#d2cdc2",
    sideBottom: "#aaa398",
    gripStyle: "circleKnob",
    gripColor: "#D99F69",
    soundId: "se-hikidashi",
  };
  const closeDrawer = () => {
    playDeskDrawerCloseFx(roomId, areaDescription, { soundId: drawerOptions.soundId });
  };

  playDeskDrawerOpenFx(roomId, areaDescription, {
    ...drawerOptions,
    keepOpen: true,
    keepInputLocked: true,
    onDone: () => {
      if (flags.foundJellyRed) {
        updateMessage("引き出しの中にはもう何もない。");
        setTimeout(closeDrawer, 350);
        return;
      }
      acquireItemOnce("foundJellyRed", "jellyRed", "引き出しの中から昆虫用ゼリーが出てきた", IMAGES.items.jellyRed, "赤いゼリーを手に入れた。", closeDrawer);
    },
  });
}

function openLivingLeftSecondDrawer() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const roomId = "livingLeft";
  const areaDescription = "引き出し2段目";
  const drawerColors = {
    frontFill: "#8F3E1D",
    sideTop: "#d2cdc2",
    sideBottom: "#aaa398",
    gripStyle: "squareBarHandle",
    gripColor: "#BA6B33",
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
      if (f.foundPart2) {
        updateMessage("もう何もない。");
        setTimeout(closeDrawer, 350);
        return;
      }
      acquireItemOnce("foundPart2", "part2", "引き出しの中", IMAGES.items.part2, "絵のパーツ2を手に入れた。", closeDrawer);
    },
  });
}

function showLivingLeftSecondDrawerPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockLivingLeftSecondDrawer) {
    openLivingLeftSecondDrawer();
    return;
  }

  const letters = ["A", "B", "D", "E", "O", "R", "S", "W"];
  const squareStyle = [
    "width:min(20vw, 74px)",
    "height:min(20vw, 74px)",
    "min-width:52px",
    "min-height:52px",
    "border:2px solid #d7d7d7",
    "border-radius:4px",
    "background:#fff",
    "color:#3F7FA6",
    "font-size:clamp(24px, 7vw, 36px)",
    "font-weight:800",
    "line-height:1",
    "padding:0",
    "cursor:pointer",
    "box-shadow:0 2px 5px rgba(0,0,0,0.18)",
  ].join(";");
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:grid; grid-template-columns:repeat(4, minmax(0, 74px)); gap:9px; justify-content:center;">
        ${[0, 1, 2, 3].map((idx) => `<button id="livingLeftSecondDrawerLetter${idx}" type="button" aria-label="${idx + 1}文字目" style="${squareStyle}"></button>`).join("")}
      </div>
      <button id="livingLeftSecondDrawerOk" class="ok-btn" type="button">OK</button>
      <div id="livingLeftSecondDrawerHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("引き出し2段目", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("引き出し2段目はロックされている。");

  setTimeout(() => {
    const letterBtns = [0, 1, 2, 3].map((idx) => document.getElementById(`livingLeftSecondDrawerLetter${idx}`));
    const okBtn = document.getElementById("livingLeftSecondDrawerOk");
    const hintEl = document.getElementById("livingLeftSecondDrawerHint");
    if (letterBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const saved = Array.isArray(f.livingLeftSecondDrawerLetters) ? f.livingLeftSecondDrawerLetters : [0, 0, 0, 0];
    const state = [0, 1, 2, 3].map((idx) => {
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
        f.livingLeftSecondDrawerLetters = state.slice();
        playSE?.("se-pi");
        render();
      });
    });
    render();

    okBtn.addEventListener("click", () => {
      f.livingLeftSecondDrawerLetters = state.slice();
      const answer = state.map((letterIdx) => letters[letterIdx]).join("");
      if (answer === "WEAR") {
        f.unlockLivingLeftSecondDrawer = true;
        markProgress?.("unlock_living_left_second_drawer");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("引き出し2段目のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
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

function showLivingDeskNoteModal() {
  const flags = getMainFlags();
  flags.sawLivingDeskNote = true;
  const content = `
    <div style="max-width:420px; margin:0 auto; padding:32px 34px; background:#fffaf0; color:#3a3025; border:1px solid #d8c9aa; box-shadow:inset 0 0 30px rgba(120,90,45,0.12), 0 7px 20px rgba(50,35,20,0.2); font-family:'Yu Mincho','Hiragino Mincho ProN',serif; text-align:left; line-height:2; font-size:1.12em; letter-spacing:0.04em; transform:rotate(-0.5deg);">
      テレビがつかないときは叩いてみてね。<br>
      <span style="display:block; margin-top:18px; text-align:right;">おばあちゃんより</span>
    </div>
  `;
  showModal("机の上の書置き", content, [{ text: "閉じる", action: "close" }]);
  updateMessage("机の上に書置きがある。");
}

function handleLivingTvClick() {
  const flags = getMainFlags();
  if (flags.tvOn) {
    changeRoom("tv");
    return;
  }
  if (!flags.sawLivingDeskNote) {
    updateMessage("テレビはつかない。");
    return;
  }
  if (gameState.selectedItem === "hammer") {
    flags.tvOn = true;
    playSE?.("se-powerup");
    const content = `
      <img src="${IMAGES.modals.attackTvWithHammer}" alt="ハンマーでテレビを叩く" onerror="this.style.display='none'" style="width:400px;max-width:100%;max-height:65vh;object-fit:contain;display:block;margin:0 auto 18px;">
      <p style="text-align:center; line-height:1.8;">テレビを叩いてみた。・・・なんと、テレビが付いた！</p>
    `;
    showModal("テレビが付いた！", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
    updateMessage("テレビを叩いてみた。・・・なんと、テレビが付いた！");
    renderCanvasRoom?.();
    return;
  }

  showModal("テレビを手でたたいてみますか？", "<p style=\"text-align:center;\">テレビ画面は真っ暗だ</p>", [
    {
      text: "はい",
      action: () => {
        closeModal();
        playSE?.("se-punch");
        const content = `
          <img src="${IMAGES.modals.attackTv}" alt="テレビを叩く" onerror="this.style.display='none'" style="width:400px;max-width:100%;max-height:65vh;object-fit:contain;display:block;margin:0 auto 18px;">
          <p style="text-align:center; line-height:1.8;">テレビを叩いてみた。・・・しかし、テレビは動作しない</p>
        `;
        showModal("テレビを叩いてみた", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
        updateMessage("テレビを叩いてみた。・・・しかし、テレビは動作しない。");
      },
    },
    { text: "いいえ", action: "close" },
  ]);
}

function getTvChannelIndex() {
  const flags = getMainFlags();
  const channel = Number(flags.tvChannel);
  if (!Number.isInteger(channel) || channel < 0 || channel > 3) {
    flags.tvChannel = 0;
  }
  return flags.tvChannel;
}

function getTvChannelImageKey() {
  const languageSuffix = uiLang === "en" ? "En" : "";
  return `tvChannel${getTvChannelIndex() + 1}${languageSuffix}`;
}

function handleTvChannelDialClick() {
  const flags = getMainFlags();
  flags.tvChannel = (getTvChannelIndex() + 1) % 4;
  renderCanvasRoom?.();
  updateMessage(`チャンネル${flags.tvChannel + 1}に切り替えた。`);
}

function handleTvLanguageDialClick() {
  uiLang = uiLang === "en" ? "jp" : "en";
  renderCanvasRoom?.();
  updateMessage(uiLang === "en" ? "Switched the television display to English." : "テレビの表示を日本語に切り替えた。");
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
      title: "🎆 TRUE END",
      label: "TRUE END",
      desc: "夏休みの花火を楽しみました。おめでとうございます！",
    },

    end: {
      title: "🌤 NORMAL END ",
      label: "NORMAL",
      desc: "のどかな夏休みの風景が広がっています。脱出おめでとうございます！",
    },
    modernEnd: {
      title: "🏠 MODERN END",
      label: "MODERN",
      desc: "猛暑の時代へ転移しました。脱出おめでとうございます！",
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

  // 表示
  updateMessage(messages[idx]);
}

// 汎用マイルストーン送信用ヘルパ
function markProgress(step, extra = {}) {
  ANA.once("progress", step, { step, ...extra });
}

function getDefaultGameState() {
  return {
    currentRoom: "living",
    openRooms: ["living"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        unlockManageBoard: false,
        boardDeskRewritten: false,
        boardDoorRewritten: false,
        boardChestRewritten: false,
        boardDoorAnswers: {},
        boardAdminButtonStep: 0,
        transferBearFanOpenedCount: 0,
        timePhase: 0,
        isNight: false,
        beetleBattleEnded: false,
        beetleSolved: false,
        foundBeetleStick: false,
        sawLivingDeskNote: false,
        tvOn: false,
        tvChannel: 0,
        zabutonChecked: false,
        foundPart1: false,
        foundPart2: false,
        foundHammer: false,
        foundJellyRed: false,
        foundjellyWhite: false,
        unlockLivingLeftSecondDrawer: false,
        unlockLivingLeftThirdDrawer: false,
        livingLeftThirdDrawerEventDone: false,
        rightBeetleLaunched: false,
        leftBeetleDisappeared: false,
        bearBeetleAppeared: false,
        foundHorn: false,
        beetleFlyingAtLamp: false,
        memoDropStarted: false,
        memoDropped: false,
        livingLeftSecondDrawerLetters: [0, 0, 0, 0],
        shojiRepaired: false,
        shelfPartsInstalled: false,
        shelfPuzzleSolved: false,
        shelfDoorOpen: false,
        foundShelfKey: false,
        entranceLeftDrawerUnlocked: false,
        entranceRightDrawerUnlocked: false,
        entranceMainStorageUnlocked: false,
        entranceMainStorageOpen: false,
        foundBucket: false,
        foundHandheldFireworksSet: false,
        foundPart3: false,
        kitchenDrawerUnlocked: false,
        kitchenFridgeUnlocked: false,
        kitchenFridgeLevels: [0, 0, 0, 0],
        foundjellyYellow: false,
        foundFrozenJellyBlue: false,
        foundBirdSeal: false,
        foundFukin: false,
        fukinInBasket: false,
        fukinDirtInBasket: false,
        cleanFlower: false,
        entranceDoorUnlocked: false,
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
    beetle: {
      placements: { top: null, right: null, bottom: null, left: null },
    },
    shelfPuzzle: {
      pieces: [4, 0, 5, 2, 1, 3],
      selectedIndex: null,
    },
    entranceLeftPuzzle: {
      cells: [false, false, false, false, false, false, false, false, false, false, false, false],
    },
    entranceRightPuzzle: {
      icons: [0, 0, 0],
    },
    kitchenPuzzle: {
      digits: [0, 0, 0],
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
  const flags = gameState.main.flags;
  const oldLiving = gameState.living?.flags || {};
  const oldShelf = gameState.shelfPuzzle || {};
  const oldEntrance = gameState.entranceLeftPuzzle || {};
  const oldKitchen = gameState.kitchenPuzzle || {};
  const oldBeetle = gameState.beetle?.flags || {};

  if (oldLiving.zabutonChecked) flags.zabutonChecked = true;
  if (oldLiving.part1Claimed) flags.foundPart1 = true;
  if (oldLiving.shojiRepaired) flags.shojiRepaired = true;
  if (oldLiving.foundFukin) flags.foundFukin = true;
  if (oldShelf.partsInstalled) flags.shelfPartsInstalled = true;
  if (oldShelf.solved) flags.shelfPuzzleSolved = true;
  if (oldShelf.doorOpen) flags.shelfDoorOpen = true;
  if (oldShelf.keyClaimed) flags.foundShelfKey = true;
  if (oldEntrance.unlocked) flags.entranceLeftDrawerUnlocked = true;
  if (oldEntrance.part3Claimed) flags.foundPart3 = true;
  if (oldKitchen.unlocked) flags.kitchenDrawerUnlocked = true;
  if (oldKitchen.birdSealClaimed) flags.foundBirdSeal = true;
  if (oldBeetle.battleEnded) flags.beetleBattleEnded = true;
  if (oldBeetle.solved) flags.beetleSolved = true;
  if (flags.livingLeftThirdDrawerEventDone) flags.beetleBattleEnded = true;

  delete oldLiving.zabutonChecked;
  delete oldLiving.part1Claimed;
  delete oldLiving.shojiRepaired;
  delete oldLiving.foundFukin;
  delete oldShelf.partsInstalled;
  delete oldShelf.solved;
  delete oldShelf.doorOpen;
  delete oldShelf.keyClaimed;
  delete oldEntrance.unlocked;
  delete oldEntrance.drawerOpen;
  delete oldEntrance.part3Claimed;
  delete oldKitchen.unlocked;
  delete oldKitchen.birdSealClaimed;
  delete oldBeetle.battleEnded;
  delete oldBeetle.solved;
  return flags;
}

function handleLivingLeftThirdDrawerClick() {
  const flags = getMainFlags();
  if (flags.unlockLivingLeftThirdDrawer) {
    if (flags.livingLeftThirdDrawerEventDone) {
      updateMessage("引き出し3段目の中にはもう何もない。");
      return;
    }
    showLivingLeftThirdDrawerPrompt();
    return;
  }

  if (gameState.selectedItem !== "key") {
    updateMessage("引き出し3段目にはカギがかかっている。");
    return;
  }

  removeItem("key");
  flags.unlockLivingLeftThirdDrawer = true;
  markProgress?.("unlock_living_left_third_drawer");
  playSE?.("se-gacha");
  showModal("引き出し3段目", "<p style=\"text-align:center;\">カギを開けた</p>", [{ text: "閉じる", action: "close" }]);
  updateMessage("引き出し3段目のカギを開けた。");
  renderCanvasRoom?.();
}

function showLivingLeftThirdDrawerPrompt() {
  playSE("se-dosa");
  showModal("引き出し3段目", "<p style=\"text-align:center; line-height:1.8;\">ゴトゴト・・・何か引っかかっているようだ。<br>引き出しを思いっきり引っ張りますか？</p>", [
    {
      text: "はい",
      action: () => {
        if (gameState.inventory.length >= 14) {
          closeModal();
          updateMessage("アイテム欄がいっぱいだ。");
          return;
        }
        closeModal();
        startLivingLeftThirdDrawerEvent();
      },
    },
    { text: "いいえ", action: "close" },
  ]);
}

function handleLivingBearBeetleClick() {
  const flags = getMainFlags();

  if (flags.foundHorn) {
    if (gameState.selectedItem == "horn") {
      updateMessage("「・・・」");
      return;
    }

    talkToHintCharacter("main", "bear2");
    return;
  }
  if (gameState.selectedItem !== "hammer") {
    showObj(null, "「呼んだ？」", IMAGES.modals.bearYonda, "クマ妖精は立派なツノを付けている");

    return;
  }
  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return;
  }

  flags.foundHorn = true;
  addItem("horn");
  removeItem("hammer");
  playSE?.("se-punch");
  showObj(null, "「あっ・・・」", IMAGES.modals.hornCut, "クマ妖精のツノを手に入れた。");
  renderCanvasRoom();
}

function startLivingLeftThirdDrawerEvent() {
  const flags = getMainFlags();
  if (flags.livingLeftThirdDrawerEventDone) return;
  const sequenceFx = gameState.fx || (gameState.fx = {});
  if (sequenceFx.livingLeftThirdDrawerSequence) return;
  sequenceFx.livingLeftThirdDrawerSequence = true;
  const roomId = "livingLeft";
  const areaDescription = "引き出し3段目";
  const drawerOptions = {
    frontFill: "#8F3E1D",
    sideTop: "#d2cdc2",
    sideBottom: "#aaa398",
    gripStyle: "squareBarHandle",
    gripColor: "#BA6B33",
  };

  playDeskDrawerOpenFx(roomId, areaDescription, {
    ...drawerOptions,
    soundId: "se-punch",
    keepOpen: true,
    keepInputLocked: true,
    onDone: () => {
      if (!flags.foundHammer) {
        flags.foundHammer = true;
        addItem("hammer");
        markProgress?.("find_hammer");
      }
      const content = `<img src="${IMAGES.items.hammer}" alt="ハンマー" style="width:400px;max-width:100%;max-height:65vh;object-fit:contain;display:block;margin:0 auto 20px;">`;
      showModal("ハンマーを手に入れた", content, [{ text: "閉じる", action: "close" }], () => {
        playDeskDrawerCloseFx(roomId, areaDescription, {
          soundId: "se-hikidashi",
          onDone: startLivingBeetleFlightEvent,
        });
      });
      updateMessage("ハンマーを手に入れた。");
    },
  });
}

function drawLivingBeetleMemoFx(ctx, canvas, roomId) {
  if (roomId !== "living") return;
  const fx = gameState.fx || {};

  const beetleFx = fx.livingBeetleFlight;
  if (beetleFx?.roomId === roomId) {
    const startRect = getAreaRectPx("living", "右向きカブトムシ", canvas);
    const endRect = getAreaRectPx("living", "電灯に到着したカブトムシ", canvas);
    const img = loadedImages[IMAGES.items.beetleFlying];
    if (startRect && endRect && img?.complete && img.naturalWidth > 0) {
      const t = Math.max(0, Math.min(1, Number(beetleFx.progress) || 0));
      const eased = t * t * (3 - 2 * t);
      const startX = startRect.x + startRect.w / 2;
      const startY = startRect.y + startRect.h / 2;
      const endX = endRect.x + endRect.w / 2;
      const endY = endRect.y + endRect.h / 2;
      const x = startX + (endX - startX) * eased + Math.sin(t * Math.PI * 5) * canvas.width * 0.012;
      const y = startY + (endY - startY) * eased - Math.sin(t * Math.PI) * canvas.height * 0.055;
      const startSize = canvas.width * 0.045;
      const endSize = Math.max(endRect.w, endRect.h);
      const size = startSize + (endSize - startSize) * eased;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(t * Math.PI * 4) * 0.12);
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = Math.max(2, canvas.width * 0.004);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }

  const memoFx = fx.livingMemoFall;
  if (memoFx?.roomId === roomId) {
    const startRect = getAreaRectPx("living", "電灯に引っかかった紙、かつカブトムシ到達点", canvas);
    const endRect = getAreaRectPx("living", "メモが落ちてきた地点", canvas);
    const img = loadedImages[IMAGES.items.memo];
    if (startRect && endRect && img?.complete && img.naturalWidth > 0) {
      const t = Math.max(0, Math.min(1, Number(memoFx.progress) || 0));
      const eased = t * t;
      const startX = startRect.x + startRect.w / 2;
      const startY = startRect.y + startRect.h / 2;
      const endX = endRect.x + endRect.w / 2;
      const endY = endRect.y + endRect.h / 2;
      const x = startX + (endX - startX) * eased + Math.sin(t * Math.PI * 8) * canvas.width * 0.035 * (1 - t * 0.45);
      const y = startY + (endY - startY) * eased;
      const w = startRect.w + (endRect.w - startRect.w) * t;
      const h = startRect.h + (endRect.h - startRect.h) * t;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(t * Math.PI * 7) * 0.48 + t * Math.PI * 0.35);
      ctx.shadowColor = "rgba(0,0,0,0.24)";
      ctx.shadowBlur = Math.max(2, canvas.width * 0.003);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
  }

  const orbFx = fx.livingBeetleOrb;
  if (orbFx?.roomId === roomId) {
    const startRect = getAreaRectPx("living", "左向きカブトムシ", canvas);
    const endRect = getAreaRectPx("living", "右の棚", canvas);
    if (startRect && endRect) {
      const t = Math.max(0, Math.min(1, Number(orbFx.progress) || 0));
      const eased = t * t * (3 - 2 * t);
      const startX = startRect.x + startRect.w / 2;
      const startY = startRect.y + startRect.h / 2;
      const endX = endRect.x + endRect.w * 0.42;
      const endY = endRect.y + endRect.h * 0.56;
      const x = startX + (endX - startX) * eased;
      const y = startY + (endY - startY) * eased - Math.sin(t * Math.PI) * canvas.height * 0.12;
      drawBeetleLightOrb(ctx, x, y, canvas.width * (0.034 - t * 0.008), 1);
    }
  }

  const revealFx = fx.livingBeetleReveal;
  if (revealFx?.roomId === roomId) {
    const shelfRect = getAreaRectPx("living", "右の棚", canvas);
    const bearRect = getAreaRectPx("living", "クマ妖精出現地点", canvas);
    const t = Math.max(0, Math.min(1, Number(revealFx.progress) || 0));
    if (shelfRect) {
      const glowAlpha = Math.sin(Math.min(1, t / 0.72) * Math.PI);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = glowAlpha * 0.68;
      ctx.fillStyle = "rgba(255, 241, 150, 0.75)";
      ctx.shadowColor = "rgba(255, 226, 96, 1)";
      ctx.shadowBlur = canvas.width * 0.075;
      ctx.beginPath();
      ctx.ellipse(
        shelfRect.x + shelfRect.w * 0.42,
        shelfRect.y + shelfRect.h * 0.56,
        shelfRect.w * 0.36,
        shelfRect.h * 0.34,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.restore();
    }
    if (bearRect && t > 0.22) {
      const bearImg = loadedImages[IMAGES.items.bearBeetle];
      if (bearImg?.complete && bearImg.naturalWidth > 0) {
        const fade = easeOutCubic(Math.min(1, (t - 0.22) / 0.78));
        const scale = 0.84 + fade * 0.16;
        const drawW = bearRect.w * scale;
        const drawH = bearRect.h * scale;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.shadowColor = "rgba(255, 232, 130, 0.85)";
        ctx.shadowBlur = canvas.width * 0.025 * (1 - fade);
        ctx.drawImage(
          bearImg,
          bearRect.x + (bearRect.w - drawW) / 2,
          bearRect.y + (bearRect.h - drawH) / 2,
          drawW,
          drawH,
        );
        ctx.restore();
      }
    }
  }
}

function startLivingBeetleFlightEvent() {
  const flags = getMainFlags();
  flags.rightBeetleLaunched = true;
  flags.beetleFlyingAtLamp = false;
  flags.memoDropStarted = false;
  flags.memoDropped = false;
  changeRoom("living");

  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;
  fx.livingBeetleFlight = { roomId: "living", progress: 0 };
  const duration = 1650;
  const start = performance.now();

  const tick = (now) => {
    const currentFx = gameState.fx?.livingBeetleFlight;
    if (!currentFx) return;
    currentFx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (currentFx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete fx.livingBeetleFlight;
    flags.beetleFlyingAtLamp = true;
    startLivingMemoFallEvent();
  };

  updateMessage("カブトムシが電灯に向かって飛んでいった！");
  showToast("カブトムシたちの勝負がついたようだ");
  requestAnimationFrame(tick);
}

function startLivingMemoFallEvent() {
  const flags = getMainFlags();
  const fx = gameState.fx || (gameState.fx = {});
  flags.memoDropStarted = true;
  fx.livingMemoFall = { roomId: "living", progress: 0 };
  const duration = 1350;
  const start = performance.now();

  const tick = (now) => {
    const currentFx = gameState.fx?.livingMemoFall;
    if (!currentFx) return;
    currentFx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (currentFx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete fx.livingMemoFall;
    flags.memoDropped = true;
    flags.livingLeftThirdDrawerEventDone = true;
    flags.beetleBattleEnded = true;
    delete fx.livingLeftThirdDrawerSequence;
    fx.lockInput = false;
    renderCanvasRoom?.();
    markProgress?.("complete_living_beetle_memo_event");
    updateMessage("電灯に引っかかっていたメモが落ちてきた。");
  };

  requestAnimationFrame(tick);
}

function getBeetleState() {
  if (!gameState.beetle) gameState.beetle = {};
  if (!gameState.beetle.placements) gameState.beetle.placements = {};
  BEETLE_SLOT_ORDER.forEach((side) => {
    if (!(side in gameState.beetle.placements)) gameState.beetle.placements[side] = null;
  });
  return gameState.beetle;
}

function getBeetleSlotArea(side) {
  return {
    top: { x: 43, y: 3, width: 14, height: 14 },
    right: { x: 82, y: 39, width: 14, height: 14 },
    bottom: { x: 43, y: 75, width: 14, height: 14 },
    left: { x: 4, y: 39, width: 14, height: 14 },
  }[side];
}

function handleBeetleSlotClick(side) {
  const state = getBeetleState();
  if (!getMainFlags().beetleBattleEnded) {
    updateMessage("今はカブトムシの戦いを邪魔しないほうが良さそうだ");
    return;
  }
  const placedItem = state.placements[side];
  const selectedItem = gameState.selectedItem;

  if (!selectedItem) {
    if (!placedItem) {
      updateMessage("配置するアイテムを選んでください。");
      return;
    }
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。");
      return;
    }
    state.placements[side] = null;
    addItem(placedItem);
    updateMessage("アイテムを枠から戻しました。");
    renderCanvasRoom();
    return;
  }

  removeItem(selectedItem);
  if (placedItem) addItem(placedItem);
  state.placements[side] = selectedItem;
  updateMessage("選んだアイテムを枠に配置しました。");
  renderCanvasRoom();
}

function handleBeetleStickClick() {
  const flags = getMainFlags();
  if (!flags.beetleSolved || flags.foundBeetleStick || gameState.fx?.beetleJoySequence) return;
  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return;
  }

  acquireItemOnce("foundBeetleStick", "stick", "棒が落ちている", IMAGES.items.stick, "棒を手に入れた。");
  renderCanvasRoom();
}

function checkBeetleAnswer() {
  const state = getBeetleState();
  const flags = getMainFlags();
  if (flags.beetleSolved) return;
  if (!flags.beetleBattleEnded) {
    updateMessage("今はカブトムシの戦いを邪魔しないほうが良さそうだ");
    return;
  }
  if (!BEETLE_CORRECT_ITEMS) {
    updateMessage("カブトムシの仕掛けは、まだ判定条件が設定されていません。");
    return;
  }
  const isCorrect = BEETLE_SLOT_ORDER.every((side) => state.placements[side] === BEETLE_CORRECT_ITEMS[side]);
  if (isCorrect) {
    flags.beetleSolved = true;
    flags.leftBeetleDisappeared = true;
    flags.bearBeetleAppeared = false;
    BEETLE_SLOT_ORDER.forEach((side) => {
      state.placements[side] = null;
    });
    playSE?.("se-yorokobi");
    updateMessage("カブトムシが嬉しそうに喜んでいる！");
    startBeetleSolvedSequence();
  } else {
    playSE?.("se-error");
    updateMessage("アイテムの配置が違うようだ。");
  }
  renderCanvasRoom();
}

function startBeetleSolvedSequence() {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.beetleJoySequence || fx.livingBeetleOrb || fx.livingBeetleReveal) return;
  fx.lockInput = true;
  fx.beetleJoySequence = { roomId: "beetle", progress: 0 };
  const start = performance.now();
  const duration = 1900;

  const tick = (now) => {
    const currentFx = gameState.fx?.beetleJoySequence;
    if (!currentFx) return;
    currentFx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (currentFx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete fx.beetleJoySequence;
    changeRoom("living");
    startLivingBeetleOrbSequence();
  };

  requestAnimationFrame(tick);
}

function startLivingBeetleOrbSequence() {
  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;
  fx.livingBeetleOrb = { roomId: "living", progress: 0 };
  const start = performance.now();
  const duration = 1650;

  const tick = (now) => {
    const currentFx = gameState.fx?.livingBeetleOrb;
    if (!currentFx) return;
    currentFx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (currentFx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete fx.livingBeetleOrb;
    startLivingBeetleRevealSequence();
  };

  updateMessage("光の玉が右の棚へ飛んでいく。");
  requestAnimationFrame(tick);
}

function startLivingBeetleRevealSequence() {
  const flags = getMainFlags();
  const fx = gameState.fx || (gameState.fx = {});
  fx.lockInput = true;
  fx.livingBeetleReveal = { roomId: "living", progress: 0 };
  const start = performance.now();
  const duration = 1300;

  const tick = (now) => {
    const currentFx = gameState.fx?.livingBeetleReveal;
    if (!currentFx) return;
    currentFx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (currentFx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    flags.bearBeetleAppeared = true;
    delete fx.livingBeetleReveal;
    fx.lockInput = false;
    renderCanvasRoom?.();
    markProgress?.("solve_beetle_jelly_puzzle");
    updateMessage("右の棚が光り、クマ妖精が現れた！");
  };

  requestAnimationFrame(tick);
}

function getEntranceLeftPuzzleState() {
  if (!gameState.entranceLeftPuzzle) gameState.entranceLeftPuzzle = {};
  if (!Array.isArray(gameState.entranceLeftPuzzle.cells) || gameState.entranceLeftPuzzle.cells.length !== 12) {
    gameState.entranceLeftPuzzle.cells = Array(12).fill(false);
  }
  return gameState.entranceLeftPuzzle;
}

function getEntranceRightPuzzleState() {
  if (!gameState.entranceRightPuzzle) gameState.entranceRightPuzzle = {};
  if (!Array.isArray(gameState.entranceRightPuzzle.icons) || gameState.entranceRightPuzzle.icons.length !== 3) {
    gameState.entranceRightPuzzle.icons = [0, 0, 0];
  }
  return gameState.entranceRightPuzzle;
}

function handleEntranceLeftDrawerClick() {
  const state = getEntranceLeftPuzzleState();
  const flags = getMainFlags();
  if (!flags.entranceLeftDrawerUnlocked) {
    showEntranceLeftDrawerPuzzle();
    return;
  }

  const fx = gameState.fx || (gameState.fx = {});
  if (fx.entranceLeftDrawerSlideStart) return;
  playSE?.("se-hikidashi");
  fx.entranceLeftDrawerSlideStart = performance.now();
  const duration = 1200;
  const tick = (now) => {
    renderCanvasRoom();
    if (now - fx.entranceLeftDrawerSlideStart < duration) {
      requestAnimationFrame(tick);
      return;
    }
    delete fx.entranceLeftDrawerSlideStart;
    if (!flags.foundPart3) {
      flags.foundPart3 = true;
      addItem("part3");
      showObj(null, "絵のパーツを見つけた", IMAGES.items.part3, "左の引き出しから絵のパーツを手に入れた。");
    } else {
      updateMessage("左の引き出しの中には何もない。");
    }
    renderCanvasRoom();
  };
  requestAnimationFrame(tick);
}

function handleEntranceMainStorageClick() {
  const flags = getMainFlags();

  if (!flags.entranceMainStorageUnlocked) {
    if (gameState.selectedItem !== "stick") {
      showObj(null, "引き戸の扉に小さな穴がある", IMAGES.modals.hikidoHole, "引き戸は開かない。扉に小さな穴がある");
      return;
    }

    removeItem("stick");
    flags.entranceMainStorageUnlocked = true;
    playSE?.("se-kachi");
    showObj(
      null,
      "棒を小さな穴に差し込んでみた",
      IMAGES.modals.hikidoHoleStick,
      "棒を小さな穴に差し込んでみた",
    );
    return;
  }

  if (flags.entranceMainStorageOpen) {
    updateMessage("靴箱の中にはもう何もない。");
    return;
  }
  if (!flags.foundBucket && gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return;
  }

  const fx = gameState.fx || (gameState.fx = {});
  if (fx.entranceMainStorageSlideStart) return;
  fx.entranceMainStorageSlideStart = performance.now();
  const duration = 850;
  const tick = (now) => {
    renderCanvasRoom();
    if (now - fx.entranceMainStorageSlideStart < duration) {
      requestAnimationFrame(tick);
      return;
    }

    delete fx.entranceMainStorageSlideStart;
    flags.entranceMainStorageOpen = true;
    if (!flags.foundBucket) {
      flags.foundBucket = true;
      addItem("bucket");
      showObj(null, "靴箱の中にバケツがある", IMAGES.items.bucket, "バケツを手に入れた。");
    }
    renderCanvasRoom();
  };
  requestAnimationFrame(tick);
}

function handleEntranceRightDrawerClick() {
  const flags = getMainFlags();
  if (!flags.entranceRightDrawerUnlocked) {
    showEntranceRightDrawerPuzzle();
    return;
  }
  if (!flags.foundHandheldFireworksSet && gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return;
  }

  const fx = gameState.fx || (gameState.fx = {});
  if (fx.entranceRightDrawerSlideStart) return;
  playSE?.("se-hikidashi");
  fx.entranceRightDrawerSlideStart = performance.now();
  const duration = 1200;
  const tick = (now) => {
    renderCanvasRoom();
    if (now - fx.entranceRightDrawerSlideStart < duration) {
      requestAnimationFrame(tick);
      return;
    }
    delete fx.entranceRightDrawerSlideStart;
    if (!flags.foundHandheldFireworksSet) {
      flags.foundHandheldFireworksSet = true;
      addItem("handheldFireworksSet");
      showObj(
        null,
        "手持ち花火セットを見つけた",
        IMAGES.items.handheldFireworksSet,
        "右の引き出しから手持ち花火セットを手に入れた。",
      );
    } else {
      updateMessage("右の引き出しの中にはもう何もない。");
    }
    renderCanvasRoom();
  };
  requestAnimationFrame(tick);
}

function handleLivingZabutonClick() {
  const flags = getMainFlags();
  if (flags.zabutonChecked) {
    updateMessage("座布団の下には何もない。");
    return;
  }

  flags.zabutonChecked = true;
  if (!flags.foundPart1) {
    flags.foundPart1 = true;
    addItem("part1");
  }
  showObj(null, "座布団の下になにかある", IMAGES.modals.zabuton, "座布団の下になにかある。なにかのパーツを手に入れた");
}

function handleLivingShojiClick() {
  const flags = getMainFlags();

  if (flags.shojiRepaired) {
    showObj(null, "補修した障子", IMAGES.modals.shojiRepaired, "障子はきれいに補修されている。");
    return;
  }

  if (gameState.selectedItem === "birdSeal") {
    flags.shojiRepaired = true;
    removeItem("birdSeal");
    const content = `
      <div class="modal-anim">
        <img src="${IMAGES.modals.shojiBroken}" alt="穴の開いた障子">
        <img src="${IMAGES.modals.shojiRepaired}" alt="補修された障子">
      </div>
    `;
    showModal("障子を補修した", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
    updateMessage("障子補修シールを障子の穴に貼った");
    renderCanvasRoom();
    return;
  }

  showObj(null, "穴の開いた障子", IMAGES.modals.shojiBroken, "障子に穴が開いている。");
}

function showMatryoshkaModal() {
  const imageId = `matryoshkaImage_${Date.now()}`;
  let opened = false;
  const content = `<img id="${imageId}" src="${IMAGES.modals.matoClose}" alt="閉じたマトリョーシカ" style="display:block;width:min(72vw,420px);max-height:62vh;object-fit:contain;margin:0 auto 14px;">`;
  const openMatryoshka = () => {
    const image = document.getElementById(imageId);
    if (!image) return;
    opened = true;
    document.querySelectorAll("#modalButtons button").forEach((button) => (button.disabled = true));
    playSE?.("se-click");
    image.outerHTML = `
      <div class="modal-anim">
        <img src="${IMAGES.modals.matoOpen}" alt="開きかけのマトリョーシカ">
        <img src="${IMAGES.modals.mato}" alt="開いたマトリョーシカ">
      </div>
    `;
  };
  showModal(
    "マトリョーシカがある",
    content,
    [
      { text: "開ける", action: openMatryoshka },
      { text: "閉じる", action: "close" },
    ],
    () => {
      if (opened) updateMessage("マトリョーシカを元通り戻しておいた");
    },
    { contentClass: "showobj-modal" },
  );
  updateMessage("マトリョーシカがある。開けてみますか？");
}

function getKitchenPuzzleState() {
  if (!gameState.kitchenPuzzle) gameState.kitchenPuzzle = {};
  if (!Array.isArray(gameState.kitchenPuzzle.digits) || gameState.kitchenPuzzle.digits.length !== 3) {
    gameState.kitchenPuzzle.digits = [0, 0, 0];
  }
  return gameState.kitchenPuzzle;
}

function handleKitchenMiddleDrawerClick() {
  const state = getKitchenPuzzleState();
  const flags = getMainFlags();
  if (!flags.kitchenDrawerUnlocked) {
    showKitchenMiddleDrawerPuzzle();
    return;
  }

  const fx = gameState.fx || (gameState.fx = {});
  if (fx.kitchenDrawerSlideStart) return;
  playSE?.("se-hikidashi");
  fx.kitchenDrawerSlideStart = performance.now();
  const duration = 1100;
  const tick = (now) => {
    renderCanvasRoom();
    if (now - fx.kitchenDrawerSlideStart < duration) {
      requestAnimationFrame(tick);
      return;
    }
    delete fx.kitchenDrawerSlideStart;
    if (!flags.foundBirdSeal) {
      flags.foundBirdSeal = true;
      addItem("birdSeal");
      showObj(null, "障子の穴を補修するシールを見つけた", IMAGES.items.birdSeal, "台所の引き出しから障子の穴を補修するシールを手に入れた。");
    } else {
      updateMessage("台所の引き出しの中には何もない。");
    }
    renderCanvasRoom();
  };
  requestAnimationFrame(tick);
}

function handleKitchenFreezerClick() {
  const flags = getMainFlags();
  if (flags.foundFrozenJellyBlue) {
    updateMessage("冷凍庫の中にはもう何もない。");
    return;
  }
  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return;
  }

  flags.foundFrozenJellyBlue = true;
  addItem("frozenJellyBlue");
  showObj(null, "冷凍庫の中", IMAGES.modals.innerFleezer, "凍った青いゼリーを手に入れた。");
}

function handleKitchenSinkClick() {
  if (gameState.selectedItem === "bucket") {
    removeItem("bucket");
    addItem("bucketWithWater");
    playSE?.("se-water");
    showObj(null, "バケツに水を入れた", IMAGES.modals.bucketWater, "バケツに水を入れた");
    return;
  }

  if (gameState.selectedItem === "frozenJellyBlue") {
    removeItem("frozenJellyBlue");
    addItem("jellyBlue");
    playSE?.("se-water");
    showObj(null, "凍ったゼリーを溶かした", IMAGES.modals.meltJelly, "青いゼリーを解凍した。");
    return;
  }

  if (gameState.selectedItem === "fukinDirt") {
    removeItem("fukinDirt");
    addItem("fukinWet");
    playSE?.("se-water");
    showCleanFukinAnimation();
    updateMessage("タオルをきれいに洗った。");
    return;
  }

  if (gameState.selectedItem !== "fukin") {
    updateMessage("流しがある。");
    return;
  }

  removeItem("fukin");
  addItem("fukinWet");
  playSE?.("se-water");
  showObj(null, "タオルを濡らした", IMAGES.modals.fukinWater, "タオルを濡らした");
}

function showCleanFukinAnimation() {
  const content = `
    <div class="modal-anim">
      <img src="${IMAGES.modals.cleanFukin}" alt="汚れたタオルを洗っている">
      <img src="${IMAGES.modals.cleanFukin2}" alt="きれいになったタオル">
    </div>
  `;

  showModal("タオルをきれいに洗った", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
}

function handleEntranceLeftFlowerClick() {
  const flags = getMainFlags();
  if (flags.cleanFlower) {
    showObj(null, "花瓶に花が飾られている", IMAGES.modals.flower, "きれいになった花瓶に花が飾られている。");
    return;
  }

  if (gameState.selectedItem === "fukinWet") {
    flags.cleanFlower = true;
    removeItem("fukinWet");
    addItem("fukinDirt");
    playSE?.("se-cloth");
    showObj(null, "花瓶の汚れを拭いた", IMAGES.modals.flowerCleaning, "花瓶の汚れを拭いた");
    renderCanvasRoom();
    return;
  }

  showObj(null, "花瓶に花が飾られている", IMAGES.modals.flowerDirty, "花瓶が汚れている。");
}

function handleEntranceDoorClick() {
  const flags = getMainFlags();
  if (flags.entranceDoorUnlocked) {
    if (hasItem("bucketWithWater") && hasItem("handheldFireworksSet")) {
      removeItem("bucketWithWater");
      removeItem("handheldFireworksSet");
      travelWithSteps("trueEnd");
      return;
    }

    travelWithSteps("end");
    return;
  }

  if (gameState.selectedItem === "key") {
    updateMessage("カギが合わないようだ");
    return;
  }

  if (gameState.selectedItem !== "horn") {
    showObj(null, "玄関の扉には鍵がかかっている", IMAGES.modals.keyhole, "玄関の扉には、なぜか内側から鍵がかかっている");
    return;
  }

  removeItem("horn");
  flags.entranceDoorUnlocked = true;
  playSE?.("se-gacha");
  showObj(null, "カギ穴にツノを差し込んだ", IMAGES.modals.keyholeUnlock, "カギ穴にツノを差し込んだ。扉のロックが解除されたようだ");
}

function showKitchenFridgePuzzle() {
  const flags = getMainFlags();
  if (flags.kitchenFridgeUnlocked) {
    if (flags.foundjellyYellow) {
      updateMessage("冷蔵庫の中にはもう何もない。");
      return;
    }
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。");
      return;
    }
    flags.foundjellyYellow = true;
    addItem("jellyYellow");
    renderCanvasRoom?.();
    const content = `
      <img src="${IMAGES.modals.innerRefrigerator}" alt="冷蔵庫の中" style="width:400px;max-width:100%;max-height:65vh;object-fit:contain;display:block;margin:0 auto 18px;">
      <p style="text-align:center; line-height:1.8;">冷蔵庫に昆虫用ゼリー（黄色）がある</p>
    `;
    showModal("冷蔵庫の中", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
    updateMessage("昆虫用ゼリー（黄色）を手に入れた。");
    return;
  }

  const saved = Array.isArray(flags.kitchenFridgeLevels) ? flags.kitchenFridgeLevels : [0, 0, 0, 0];
  const levels = [0, 1, 2, 3].map((index) => {
    const value = Number(saved[index]);
    return Number.isInteger(value) && value >= 0 && value <= 4 ? value : 0;
  });
  flags.kitchenFridgeLevels = levels;

  const glassStyle = [
    "position:relative",
    "width:min(16vw,62px)",
    "height:min(46vw,190px)",
    "min-width:48px",
    "min-height:148px",
    "padding:0",
    "overflow:hidden",
    "cursor:pointer",
    "border:2px solid rgba(145,210,228,0.9)",
    "border-radius:8px 8px 12px 12px",
    "background:linear-gradient(90deg,rgba(205,244,255,0.2),rgba(232,250,255,0.62) 45%,rgba(178,229,243,0.26))",
    "box-shadow:inset 5px 0 8px rgba(255,255,255,0.38),inset -4px 0 8px rgba(92,175,200,0.18),0 4px 10px rgba(30,80,95,0.18)",
  ].join(";");
  const content = `
    <div style="display:flex;justify-content:center;align-items:flex-end;gap:10px;margin:10px auto 16px;">
      ${[0, 1, 2, 3]
      .map(
        (index) => `
            <button id="kitchenFridgeGlass${index}" type="button" aria-label="${index + 1}番目のグラス" style="${glassStyle}">
              <span id="kitchenFridgeBeer${index}" aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(90deg,rgba(244,207,88,0.78),rgba(255,232,139,0.9) 45%,rgba(230,184,55,0.82));transition:height 180ms ease-out;box-shadow:inset 0 4px 0 rgba(255,250,210,0.7);"></span>
              <span aria-hidden="true" style="position:absolute;inset:5px auto 8px 7px;width:5px;border-radius:999px;background:rgba(255,255,255,0.5);"></span>
            </button>
          `,
      )
      .join("")}
    </div>
    <div id="kitchenFridgeGuide" style="min-height:1.5em;text-align:center;"></div>
  `;
  const checkAnswer = () => {
    const answer = [0, 3, 2, 4];
    if (!levels.every((level, index) => level === answer[index])) {
      playSE?.("se-error");
      const guide = document.getElementById("kitchenFridgeGuide");
      if (guide) guide.textContent = "量が違うようだ。";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
      return;
    }
    flags.kitchenFridgeUnlocked = true;
    markProgress?.("unlock_kitchen_fridge");
    playSE?.("se-gacha");
    closeModal();
    updateMessage("冷蔵庫をアンロックした！");
    renderCanvasRoom?.();
  };

  showModal("冷蔵庫のロック", content, [{ text: "OK", action: checkAnswer }, { text: "閉じる", action: "close" }]);
  updateMessage("冷蔵庫はロックされている。");

  const render = () => {
    levels.forEach((level, index) => {
      const glass = document.getElementById(`kitchenFridgeGlass${index}`);
      const beer = document.getElementById(`kitchenFridgeBeer${index}`);
      if (glass) glass.setAttribute("aria-label", `${index + 1}番目のグラス、${level}/4`);
      if (beer) beer.style.height = `${level * 25}%`;
    });
    const guide = document.getElementById("kitchenFridgeGuide");
    if (guide) guide.textContent = "";
  };

  levels.forEach((level, index) => {
    const glass = document.getElementById(`kitchenFridgeGlass${index}`);
    if (!glass) return;
    glass.addEventListener("click", () => {
      levels[index] = (levels[index] + 1) % 5;
      flags.kitchenFridgeLevels = levels.slice();
      playSE?.("se-pi");
      render();
    });
  });
  render();
}

function showStorageFutonModal() {
  const flags = getMainFlags();
  const found = !!flags.foundjellyWhite;
  if (found) {
    updateMessage("布団の中にはもう何もない。");
    return;
  }

  const imageId = "storageFutonImage";
  const content = `
    <img id="${imageId}" src="${IMAGES.modals.futon}" alt="布団" style="width:400px;max-width:100%;max-height:65vh;object-fit:contain;display:block;margin:0 auto 18px;cursor:pointer;">
  `;

  showModal("押し入れの布団", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
  updateMessage("押し入れには、布団がしまってある。");

  document.getElementById(imageId)?.addEventListener("click", (event) => {
    if (flags.foundjellyWhite) return;
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
      return;
    }

    flags.foundjellyWhite = true;
    addItem("jellyWhite");
    event.currentTarget.src = IMAGES.modals.futon2;
    event.currentTarget.alt = "めくった布団";
    event.currentTarget.style.cursor = "default";
    updateMessage("布団の中から昆虫用ゼリー（白）を手に入れた。");
    renderCanvasRoom?.();
  }, { once: true });
}

function handleStorageLaundryBasketClick() {
  const flags = getMainFlags();

  if (flags.fukinInBasket || flags.fukinDirtInBasket) {
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
      return;
    }

    const itemInBasket = flags.fukinDirtInBasket ? "fukinDirt" : "fukinWet";
    flags.fukinInBasket = false;
    flags.fukinDirtInBasket = false;
    addItem(itemInBasket);
    updateMessage(itemInBasket === "fukinDirt"
      ? "洗濯籠から汚れたタオルを取り戻した。"
      : "洗濯籠から濡れたタオルを取り戻した。");
    renderCanvasRoom();
    return;
  }

  if (gameState.selectedItem === "fukinWet" || gameState.selectedItem === "fukinDirt") {
    const selectedFukin = gameState.selectedItem;
    removeItem(selectedFukin);
    flags.fukinInBasket = selectedFukin === "fukinWet";
    flags.fukinDirtInBasket = selectedFukin === "fukinDirt";
    updateMessage(selectedFukin === "fukinDirt"
      ? "汚れたタオルを洗濯籠に入れた。"
      : "濡れたタオルを洗濯籠に入れた。");
    renderCanvasRoom();
    return;
  }

  updateMessage("洗濯籠がある。");
}

function handleStorageModernGateClick() {
  const bearAppeared = !!getMainFlags().bearBeetleAppeared;
  const travelToModernEnd = () => {
    const modernEndFlags = gameState.modernEnd?.flags || (gameState.modernEnd = { flags: { backgroundState: 0 } }).flags;
    modernEndFlags.backgroundState = bearAppeared ? 2 : 0;
    keepOnlyItemsOnEndingArrival(["fukinWet"]);
    travelWithSteps("modernEnd", { useWarp: true, soundId: "se-fanta" });
  };

  if (!bearAppeared) {
    travelToModernEnd();
    return;
  }

  const content = `
    <img src="${IMAGES.modals.bearFlying}" alt="飛んで追いかけてくるクマ妖精" style="width:400px;max-width:100%;max-height:65vh;object-fit:contain;display:block;margin:0 auto 18px;">
    <p style="text-align:center;line-height:1.8;">どこに行くのー？ボクも行く</p>
  `;
  playSE?.("se-blow-away");
  showModal("クマ妖精が飛んできた", content, [{ text: "閉じる", action: "close" }], travelToModernEnd, { contentClass: "showobj-modal" });
  updateMessage("「どこに行くのー？ボクも行く」");
}

function showKitchenMiddleDrawerPuzzle() {
  const state = getKitchenPuzzleState();
  const flags = getMainFlags();
  if (flags.kitchenDrawerUnlocked) {
    updateMessage("台所の引き出しはアンロックされている。");
    return;
  }

  const content = `
    <img src="${IMAGES.modals.drawer}" alt="引き出し" style="display:block;width:min(60vw,280px);height:auto;object-fit:contain;margin:0 auto 8px;">
    <div aria-hidden="true" style="margin:0 auto 8px;text-align:center;font-size:4rem;font-weight:900;line-height:1;">&lt;</div>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(64px,96px));gap:12px;justify-content:center;align-items:center;margin:4px auto 14px;">
      ${[0, 1, 2]
      .map(
        (index) => `
            <button id="kitchenPuzzleDigit${index}" type="button" aria-label="${index + 1}桁目" style="box-sizing:border-box;width:100%;aspect-ratio:1;margin:0;padding:0;background:#fff;color:#111;border:2px solid #777;border-radius:5px;font-size:2.3rem;font-weight:900;cursor:pointer;"></button>
          `,
      )
      .join("")}
    </div>
    <div id="kitchenPuzzleGuide" style="min-height:1.5em;text-align:center;"></div>
  `;
  const checkAnswer = () => {
    if (state.digits.join("") !== "136") {
      playSE?.("se-error");
      const guide = document.getElementById("kitchenPuzzleGuide");
      if (guide) guide.textContent = "数字が違うようだ。";
      return;
    }
    flags.kitchenDrawerUnlocked = true;
    playSE?.("se-gacha");
    closeModal();
    updateMessage("台所の引き出しをアンロックした！");
    renderCanvasRoom();
  };
  showModal(
    "台所の引き出し",
    content,
    [
      { text: "OK", action: checkAnswer },
      { text: "閉じる", action: "close" },
    ],
    null,
    { contentClass: "showobj-modal" },
  );

  state.digits.forEach((digit, index) => {
    const button = document.getElementById(`kitchenPuzzleDigit${index}`);
    if (!button) return;
    button.textContent = String(digit);
    button.onclick = () => {
      state.digits[index] = (state.digits[index] + 1) % 10;
      button.textContent = String(state.digits[index]);
      playSE?.("se-click");
      const guide = document.getElementById("kitchenPuzzleGuide");
      if (guide) guide.textContent = "";
    };
  });
}

function showEntranceLeftDrawerPuzzle() {
  const state = getEntranceLeftPuzzleState();
  const flags = getMainFlags();
  if (flags.entranceLeftDrawerUnlocked) {
    updateMessage("左の引き出しはアンロックされている。");
    return;
  }

  const content = `
    <div id="entranceLeftPuzzleGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;width:min(72vw,420px);margin:0 auto;"></div>
    <p id="entranceLeftPuzzleGuide" style="min-height:1.5em;margin:12px 0 0;text-align:center;"></p>
  `;
  const checkAnswer = () => {
    const isCorrect = state.cells.every((active, index) => active === ENTRANCE_LEFT_PUZZLE_ANSWER.includes(index));
    if (!isCorrect) {
      playSE?.("se-error");
      const guide = document.getElementById("entranceLeftPuzzleGuide");
      if (guide) guide.textContent = "配置が違うようだ。";
      return;
    }
    flags.entranceLeftDrawerUnlocked = true;
    playSE?.("se-gacha");
    closeModal();
    updateMessage("左の引き出しをアンロックした！");
    renderCanvasRoom();
  };
  showModal(
    "左の引き出し",
    content,
    [
      { text: "OK", action: checkAnswer },
      { text: "閉じる", action: "close" },
    ],
    null,
    { contentClass: "showobj-modal" },
  );

  const render = () => {
    const grid = document.getElementById("entranceLeftPuzzleGrid");
    if (!grid) return;
    grid.innerHTML = "";
    state.cells.forEach((active, index) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.setAttribute("aria-label", `${Math.floor(index / 4) + 1}行${(index % 4) + 1}列`);
      cell.setAttribute("aria-pressed", String(active));
      cell.style.cssText = "box-sizing:border-box;display:flex;align-items:center;justify-content:center;aspect-ratio:1;margin:0;padding:0;background:#fff;border:2px solid #8b7355;border-radius:4px;cursor:pointer;";
      if (active) {
        const mark = document.createElement("span");
        mark.style.cssText = "display:block;width:48%;height:48%;background:#77d9ee;border:1px solid #45b8d2;";
        cell.appendChild(mark);
      }
      cell.onclick = () => {
        state.cells[index] = !state.cells[index];
        playSE?.("se-click");
        render();
      };
      grid.appendChild(cell);
    });
  };
  render();
}

function showEntranceRightDrawerPuzzle() {
  const state = getEntranceRightPuzzleState();
  const flags = getMainFlags();
  if (flags.entranceRightDrawerUnlocked) {
    updateMessage("右の引き出しはアンロックされている。");
    return;
  }

  const iconKeys = ["iconPuzzle", "iconCar", "iconBall", "iconBattle", "iconHorse"];
  const answer = ["iconHorse", "iconBall", "iconCar"];
  const content = `
    <div id="entranceRightPuzzleIcons" style="display:grid;grid-template-columns:repeat(3,minmax(72px,110px));gap:14px;justify-content:center;width:min(78vw,420px);margin:0 auto;"></div>
    <p id="entranceRightPuzzleGuide" style="min-height:1.5em;margin:12px 0 0;text-align:center;"></p>
  `;

  const checkAnswer = () => {
    const selectedKeys = state.icons.map((index) => iconKeys[index]);
    if (!selectedKeys.every((key, index) => key === answer[index])) {
      playSE?.("se-error");
      const guide = document.getElementById("entranceRightPuzzleGuide");
      if (guide) guide.textContent = "絵柄が違うようだ。";
      return;
    }

    flags.entranceRightDrawerUnlocked = true;
    playSE?.("se-gacha");
    closeModal();
    updateMessage("右の引き出しをアンロックした！");
    renderCanvasRoom();
  };

  showModal(
    "右の引き出し",
    content,
    [
      { text: "OK", action: checkAnswer },
      { text: "閉じる", action: "close" },
    ],
    null,
    { contentClass: "showobj-modal" },
  );

  const render = () => {
    const wrap = document.getElementById("entranceRightPuzzleIcons");
    const guide = document.getElementById("entranceRightPuzzleGuide");
    if (!wrap) return;
    wrap.innerHTML = "";
    state.icons.forEach((iconIndex, index) => {
      const iconKey = iconKeys[iconIndex];
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `${index + 1}番目の絵柄`);
      button.style.cssText = "box-sizing:border-box;display:flex;align-items:center;justify-content:center;aspect-ratio:1;margin:0;padding:8px;background:#fff;border:2px solid #8b7355;border-radius:5px;cursor:pointer;";
      const image = document.createElement("img");
      image.src = IMAGES.modals[iconKey];
      image.alt = `${index + 1}番目の絵柄`;
      image.style.cssText = "display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;";
      button.appendChild(image);
      button.onclick = () => {
        state.icons[index] = (state.icons[index] + 1) % iconKeys.length;
        playSE?.("se-click");
        if (guide) guide.textContent = "";
        render();
      };
      wrap.appendChild(button);
    });
  };
  render();
}

function getShelfPuzzleState() {
  if (!gameState.shelfPuzzle) gameState.shelfPuzzle = {};
  if (!Array.isArray(gameState.shelfPuzzle.pieces) || gameState.shelfPuzzle.pieces.length !== 6) {
    gameState.shelfPuzzle.pieces = [4, 0, 5, 2, 1, 3];
  }
  if (!("selectedIndex" in gameState.shelfPuzzle)) gameState.shelfPuzzle.selectedIndex = null;
  return gameState.shelfPuzzle;
}

function handleLivingRightShelfClick() {
  const state = getShelfPuzzleState();
  const flags = getMainFlags();
  if (!flags.shelfPartsInstalled) {
    const requiredParts = ["part1", "part2", "part3"];
    if (!requiredParts.every(hasItem)) {
      updateMessage("パーツがはめ込めそうなパネルだ。3つの空きスペースがある。");
      return;
    }
    requiredParts.forEach(removeItem);
    flags.shelfPartsInstalled = true;
    playSE?.("se-kachi");
    updateMessage("パーツをはめこんだ。");
    renderCanvasRoom();
    return;
  }
  if (!flags.shelfPuzzleSolved) {
    showShelfPicturePuzzle();
    return;
  }
  if (flags.shelfDoorOpen) {
    const completedPicture = flags.bearBeetleAppeared ? IMAGES.modals.picForShelf2 : IMAGES.modals.picForShelf;
    showObj(null, "完成した絵", completedPicture, "棚の引き戸は開いている。");
    return;
  }

  const fx = gameState.fx || (gameState.fx = {});
  if (fx.shelfDoorSlideStart) return;
  fx.shelfDoorSlideStart = performance.now();
  const duration = 700;
  const tick = (now) => {
    renderCanvasRoom();
    if (now - fx.shelfDoorSlideStart < duration) {
      requestAnimationFrame(tick);
      return;
    }
    delete fx.shelfDoorSlideStart;
    flags.shelfDoorOpen = true;
    if (!flags.foundShelfKey) {
      flags.foundShelfKey = true;
      addItem("key");
      showObj(null, "鍵を見つけた", IMAGES.items.key, "棚の中から鍵を手に入れた。");
    } else {
      updateMessage("棚の引き戸を開けた。");
    }
    renderCanvasRoom();
  };
  requestAnimationFrame(tick);
}

function showShelfPicturePuzzle() {
  const state = getShelfPuzzleState();
  const flags = getMainFlags();
  state.selectedIndex = null;
  const content = `
    <div id="shelfPuzzleGrid" style="display:grid;grid-template-columns:repeat(3,1fr);width:min(72vw,480px);aspect-ratio:1;margin:0 auto;gap:0;background:#5b351d;padding:5px;border:4px solid #5b351d;border-radius:8px;overflow:hidden;"></div>
    <p id="shelfPuzzleGuide" style="margin:12px 0 0;text-align:center;">入れ替える2つの絵を順番に選んでください</p>
  `;
  showModal("棚の絵合わせ", content, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });

  const render = () => {
    const grid = document.getElementById("shelfPuzzleGrid");
    const guide = document.getElementById("shelfPuzzleGuide");
    if (!grid) return;
    grid.innerHTML = "";
    state.pieces.forEach((piece, index) => {
      const cell = document.createElement("button");
      const col = piece % 3;
      const row = Math.floor(piece / 3);
      cell.type = "button";
      cell.setAttribute("aria-label", `絵のピース${index + 1}`);
      cell.style.cssText = `box-sizing:border-box;border:0;border-radius:0;margin:0;padding:0;cursor:pointer;background-color:transparent;background-image:url('${IMAGES.modals.picForShelf}');background-size:300% 200%;background-position:${col * 50}% ${row * 100}%;background-repeat:no-repeat;min-width:0;box-shadow:${state.selectedIndex === index ? "inset 0 0 0 4px #ffd700" : "none"};`;
      cell.onclick = () => {
        if (flags.shelfPuzzleSolved) return;
        if (state.selectedIndex === null) {
          state.selectedIndex = index;
          if (guide) guide.textContent = "入れ替えるもう1つの絵を選んでください";
          render();
          return;
        }
        if (state.selectedIndex === index) {
          state.selectedIndex = null;
          if (guide) guide.textContent = "選択を解除しました";
          render();
          return;
        }
        const first = state.selectedIndex;
        [state.pieces[first], state.pieces[index]] = [state.pieces[index], state.pieces[first]];
        state.selectedIndex = null;
        flags.shelfPuzzleSolved = SHELF_PUZZLE_SOLVED.every((piece, i) => state.pieces[i] === piece);
        playSE?.(flags.shelfPuzzleSolved ? "se-gacha" : "se-click");
        if (guide) guide.textContent = flags.shelfPuzzleSolved ? "絵が完成した！" : "絵を入れ替えた";
        if (flags.shelfPuzzleSolved) updateMessage("棚の絵合わせが完成した！");
        render();
      };
      grid.appendChild(cell);
    });
    if (guide && flags.shelfPuzzleSolved) guide.textContent = "絵が完成した！";
  };
  render();
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

    memo: "メモ",
    hammer: "ハンマー",
    horn: "クマ妖精のツノ",
    handheldFireworksSet: "手持ち花火セット",
    jellyRed: "昆虫用ゼリー（赤）",
    jellyYellow: "昆虫用ゼリー（黄色）",
    jellyWhite: "昆虫用ゼリー（白）",
    jellyBlue: "昆虫用ゼリー（青）",
    frozenJellyBlue: "凍った昆虫用ゼリー（青）",
    part1: "パーツ1",
    part2: "パーツ2",
    part3: "パーツ3",
    birdSeal: "障子の穴を補修するシール",
    fukin: "タオル",
    fukinWet: "濡れたタオル",
    fukinDirt: "汚れたタオル",
    stick: "小さな棒",
    bucket: "バケツ",
    bucketWithWater: "水の入ったバケツ",
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
  livingLeftTopDrawerClicks = [];
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

  if (!Array.isArray(merged.openRooms)) merged.openRooms = def.openRooms.slice();
  merged.openRooms = merged.openRooms.filter((roomId) => rooms[roomId]);
  if (merged.openRooms.length === 0) merged.openRooms = def.openRooms.slice();
  if (!merged.currentRoom || !rooms[merged.currentRoom]) merged.currentRoom = def.currentRoom;

  gameState = merged;
  livingLeftTopDrawerClicks = [];
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
