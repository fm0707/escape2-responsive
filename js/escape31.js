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
const BASE_31 = USE_LOCAL_ASSETS ? "images/31" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/31";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I31 = (file) => `${BASE_31}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
// ゲーム設定 - 画像パスをここで管理
let IMAGES = {
  rooms: {
    mainLeft: [I31("main_left.webp")],
    mainRight: [I31("main_right.webp")],
    home: [I31("home.webp")],
    homeLeft: [I31("home_left.webp")],
    homeRight: [I31("home_right.webp")],
    homeTrain: [I31("home_train.webp")],
    masterRoom: [I31("master_room.webp")],
    bench: I31("bench.webp"),
    boxInner: I31("box_inner.webp"),
    desk: I31("desk.webp"),

    end: I31("end.webp"),
    trueEnd: [I31("true_end.webp"), I31("true_end2.webp")],
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
    lock: I31("lock.webp"),
    huta: I31("huta.webp"),
    driver: I31("driver.webp"),
    key: I31("key.webp"),
    operaGlass: I31("opera_glass.webp"),
    ball: I31("ball.webp"),
    net: I31("net.webp"),
    ruler: I31("ruler.webp"),
    letter: I31("letter.webp"),
    letterEn: I31("letter_en.webp"),
    rosenzu: I31("rosen.webp"),
    brokenDual: I31("broken_dial.webp"),
    board: I31("board.webp"),
    boardShine: I31("board_shine.webp"),
  },

  modals: {
    posterKumasuiTouge: I31("modal_poster_kumasui_touge.webp"),
    posterCaution: I31("modal_poster_caution.webp"),
    rakugaki: I31("modal_rakugaki.webp"),
    stone: I31("modal_stone.webp"),
    stoneDriver: I31("modal_stone_driver.webp"),
    posterKinko: I31("modal_poster_kinko.webp"),
    posterHaisen: I31("modal_poster_haisen.webp"),
    posterKinkoEn: I31("modal_poster_kinko_en.webp"),
    posterHaisenEn: I31("modal_poster_haisen_en.webp"),
    memoTel: I31("modal_memo_tel.webp"),
    memoTelEn: I31("modal_memo_tel_en.webp"),
    posterTaxi: I31("modal_poster_taxi.webp"),
    ballBefore: I31("modal_ball_before.webp"),
    ballAfter: I31("modal_ball_after.webp"),
    moutain: I31("modal_mountain.webp"),
    timetable: I31("modal_time_table.webp"),
    info: I31("modal_info.webp"),
    ekiban: I31("modal_ekiban.webp"),
    sticker: I31("modal_sticker.webp"),
    windowOutside: I31("modal_window_outside.webp"),
    windowOutsideZoom: I31("modal_window_outside_zoom.webp"),
    badend: I31("badend.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState31";
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
    currentRoom: "mainLeft",
    openRooms: ["mainLeft"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        unlockBaggage: false,
        unlockSafe: false,
        safeDialBroken: false,
        unlockWoodBox: false,
        unlockMasterRoomDoor: false,
        unlockDrawerBottom: false,
        unlockDrawerMiddle: false,
        unlockDrawerTop: false,
        unlockDrawerLeftTop: false,

        openedStoneLid: false,
        foundDriver: false,
        foundOperaGlass: false,
        foundRosenzu: false,
        foundBoard: false,

        isNight: false,

        notebookDeckHintAdded: false,
        ballPokedWithRuler: false,
        callTaxi: false,
        calledEggBento: false,

        talkTo: { bear: 0 },
        backgroundState: 0,
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
    usingItem: null,
    endings: { true: false, normal2: false, normal: false },
  };
}

let gameState = getDefaultGameState();

// 部屋データ
let rooms = {
  mainLeft: {
    name: "駅舎",
    description: "",
    clickableAreas: [
      {
        x: 54.7,
        y: 18.1,
        width: 9.2,
        height: 8.2,
        onClick: clickWrap(function () {
          updateMessage("針が失われている");
        }),
        description: "アナログ時計",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 65.1,
        y: 20.2,
        width: 9.9,
        height: 5.3,
        onClick: clickWrap(function () {
          updateMessage("何も表示されていない");
        }),
        description: "デジタル時計",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 56.2,
        y: 33.9,
        width: 16.5,
        height: 9.1,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterKumasuiTouge, "観光ポスターだ");
        }),
        description: "ポスタークマスイ峠",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 46.7,
        y: 34.8,
        width: 9.0,
        height: 11.9,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterCaution, "立ち入り禁止のポスターだ");
        }),
        description: "警告ポスター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 92.1,
        y: 32.0,
        width: 5.1,
        height: 13.8,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.timetable, "時刻表だ");
        }),
        description: "時刻表",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 81.4,
        y: 61.8,
        width: 12.3,
        height: 11.0,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockBaggage) {
            acquireItemOnce("foundOperaGlass", "operaGlass", "双眼鏡がある", IMAGES.items.operaGlass, "双眼鏡を手に入れた");
            return;
          }
          showBaggageLockPuzzle();
        }),
        description: "ベンチ上の荷物",
        zIndex: 4,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 82.8,
        y: 65.8,
        width: 3.4,
        height: 5.2,
        onClick: clickWrap(function () {}),
        description: "荷物の鍵",
        zIndex: 5,
        usable: () => false,
        item: { img: "lock", visible: () => !gameState.main.flags.unlockBaggage },
      },
      {
        x: 29.1,
        y: 67.7,
        width: 14.6,
        height: 8.9,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockWoodBox) {
            changeRoom("boxInner");
            return;
          }
          showWoodBoxPuzzle();
        }),
        description: "木箱",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 29.0,
        y: 66.8,
        width: 13.8,
        height: 4.1,
        onClick: clickWrap(function () {}),
        description: "木箱の蓋",
        zIndex: 5,
        usable: () => false,
        item: { img: "huta", visible: () => !gameState.main.flags.unlockWoodBox },
      },
      {
        x: 80.3,
        y: 29.7,
        width: 6.2,
        height: 29.0,
        onClick: clickWrap(function () {
          updateMessage("奥はトイレのようだ");
        }),
        description: "奥のトイレ入り口",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 28.7,
        y: 25.7,
        width: 8.6,
        height: 27.1,
        onClick: clickWrap(function () {
          updateMessage("ガラスが曇っていて、良く見えない");
        }),
        description: "窓",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 50.8,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("home");
          },
          { allowAtNight: true },
        ),
        description: "駅舎左、左",
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
            changeRoom("mainRight");
          },
          { allowAtNight: true },
        ),
        description: "駅舎左、右",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  mainRight: {
    name: "駅舎奥",
    description: "",
    clickableAreas: [
      {
        x: 38.6,
        y: 2.4,
        width: 39.5,
        height: 17.2,
        onClick: clickWrap(function () {}),
        description: "駅長室の表示",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 62.8,
        y: 54.2,
        width: 7.3,
        height: 4.3,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.sticker, "ステッカーが貼られている");
        }),
        description: "ステッカー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 40.1,
        y: 22.8,
        width: 35.7,
        height: 74.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockMasterRoomDoor) {
            changeRoom("masterRoom");
            return;
          }
          if (gameState.selectedItem === "key") {
            f.unlockMasterRoomDoor = true;
            removeItem("key");
            showModal(
              "解錠",
              `
                <div class="door-unlock-anim">
                  <div class="door-unlock-lock"></div>
                  <img class="door-unlock-key" src="${IMAGES.items.key}" alt="鍵">
                </div>
                <p style="margin:0;">鍵を使って駅長室のドアのロックを解除した</p>
              `,
              [{ text: "閉じる", action: "close" }],
              () => {
                playSE("se-gacha");
              },
            );
            updateMessage("鍵を使って駅長室のドアのロックを解除した");

            return;
          }
          updateMessage("鍵がかかっていて開かない");
        }),
        description: "駅長室のドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 40.6,
        y: 64.5,
        width: 3.9,
        height: 4.1,
        onClick: clickWrap(function () {}),
        description: "鍵穴",
        zIndex: 5,
        usable: () => false,
        item: { img: "IMAGE_KEY", visible: () => true },
      },

      {
        x: 0,
        y: 50.8,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainLeft");
          },
          { allowAtNight: true },
        ),
        description: "駅舎右、左",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
    ],
  },
  home: {
    name: "ホーム",
    description: "",
    clickableAreas: [
      {
        x: 16.1,
        y: 45.3,
        width: 10.1,
        height: 15.8,
        onClick: clickWrap(function () {
          changeRoom("mainLeft");
        }),
        description: "駅舎入り口",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 62.9,
        y: 37.6,
        width: 23.9,
        height: 17.2,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "board") {
            removeItem("board");
            showModal("", "駅名板をセットした", [{ text: "閉じる", action: "close" }]);
            window._nextModal = function () {
              const crossingSeId = document.getElementById("se-humikiri") ? "se-humikiri" : "se-fumikiri";
              const homeTrainTransitionDelay = 800;
              quickBlackFade(homeTrainTransitionDelay);
              playSE(crossingSeId);
              setTimeout(() => {
                changeRoom("homeTrain");
              }, homeTrainTransitionDelay);
            };
            return;
          }

          if (hasItem("board")) {
            updateMessage("さっきまでと様子が違う。何かはめ込めそうだ");
            return;
          }

          showObj(null, "駅番号の一部しか読めない。", IMAGES.modals.ekiban, "駅名表示板だ。汚れていて一部しか読めない。");
        }),
        description: "駅名表示板",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 45.5,
        y: 58.4,
        width: 4.3,
        height: 3.8,
        onClick: clickWrap(function () {}),
        description: "ボール",
        zIndex: 4,
        usable: () => false,
        item: { img: "ball", visible: () => true },
      },
      {
        x: 40.3,
        y: 52.2,
        width: 13.2,
        height: 12.2,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "ruler" && !f.ballPokedWithRuler) {
            f.ballPokedWithRuler = true;
            showModal(
              "ボールがある",
              `
                <div style="text-align:center;">
                  <p style="margin:0 0 12px;">定規でボールをつついてみた</p>
                  <div class="modal-anim">
                    <img src="${IMAGES.modals.ballBefore}">
                    <img src="${IMAGES.modals.ballAfter}">
                  </div>
                </div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            updateMessage("定規でボールをつついてみた");
            return;
          }
          if (f.ballPokedWithRuler) {
            showObj(null, "ボールがある", IMAGES.modals.ballAfter, "ボールがある");
            return;
          }
          showObj(null, "ボールがある", IMAGES.modals.ballBefore, "クモの巣が張っている。触りたくないな");
        }),
        description: "クモの巣",
        zIndex: 5,
        usable: () => true,
        item: { img: "net", visible: () => true },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}, { allowAtNight: true }),
        description: "ホーム、光",
        zIndex: 5,
        usable: () => false,
        item: { img: "boardShine", visible: () => hasItem("board") },
      },
      {
        x: 0,
        y: 50.8,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("homeLeft");
          },
          { allowAtNight: true },
        ),
        description: "ホーム、左",
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
            changeRoom("homeRight");
          },
          { allowAtNight: true },
        ),
        description: "ホーム、右",
        zIndex: 5,
        usable: () => gameState.main.flags.callTaxi,
        item: { img: "arrowRight", visible: () => gameState.main.flags.callTaxi },
      },
    ],
  },
  homeLeft: {
    name: "ホーム左",
    description: "",
    clickableAreas: [
      {
        x: 66.1,
        y: 50.9,
        width: 13.8,
        height: 9.5,
        onClick: clickWrap(function () {
          changeRoom("bench");
        }),
        description: "ベンチ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 15.2,
        y: 2.1,
        width: 70.2,
        height: 26.4,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "operaGlass" && gameState.main.flags.foundLetter) {
            showObj(null, "", IMAGES.modals.moutain, "双眼鏡で山を見た");
            return;
          }
          updateMessage("雄大な山々だ");
        }),
        description: "山",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 79.7,
        y: 34.8,
        width: 12.8,
        height: 11.6,
        onClick: clickWrap(function () {
          updateMessage("野生の藤の花が咲いている");
        }),
        description: "藤",
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
            changeRoom("home");
          },
          { allowAtNight: true },
        ),
        description: "ホーム左、右",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  homeRight: {
    name: "ホーム右",
    description: "",
    clickableAreas: [
      {
        x: 52.8,
        y: 52.1,
        width: 18.7,
        height: 12.9,
        onClick: clickWrap(function () {
          const overlay = document.getElementById("roomEffectOverlay");
          if (overlay) {
            overlay.style.background = "#000";
            overlay.style.opacity = "1";
          }
          playSE("se-bus");
          setTimeout(() => {
            changeRoom("end");
            setTimeout(() => {
              if (overlay) overlay.style.opacity = "0";
            }, 120);
          }, 420);
        }),
        description: "タクシー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },

      {
        x: 0,
        y: 50.8,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("home");
          },
          { allowAtNight: true },
        ),
        description: "ホーム右、左",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
    ],
  },
  masterRoom: {
    name: "駅長室",
    description: "",
    clickableAreas: [
      {
        x: 49.2,
        y: 38.7,
        width: 10.2,
        height: 10.1,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterHaisen, "お知らせが貼られている", IMAGES.modals.posterHaisenEn);
        }),
        description: "ポスター廃線",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 38.1,
        y: 31.1,
        width: 10.8,
        height: 11.1,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterKinko, "お知らせが貼られている", IMAGES.modals.posterKinkoEn);
        }),
        description: "ポスター金庫",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 13.8,
        y: 49.4,
        width: 4.8,
        height: 4.6,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.memoTel, "電話メモだ", IMAGES.modals.memoTelEn);
        }),
        description: "電話上メモ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 18.7,
        y: 29.4,
        width: 15.5,
        height: 20.6,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterTaxi, "タクシーを呼べば帰れるかもしれない。");
        }),
        description: "タクシーポスター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 11.3,
        y: 11.7,
        width: 15.8,
        height: 14.7,
        onClick: clickWrap(function () {
          updateMessage("時計は止まっている");
        }),
        description: "時計",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 18.9,
        y: 54.1,
        width: 12.7,
        height: 8.9,
        onClick: clickWrap(function () {
          showTelephoneDialer();
        }),
        description: "電話",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 53.0,
        y: 65.3,
        width: 13.4,
        height: 17.6,
        onClick: clickWrap(function () {
          showSafeDialPuzzle();
        }),
        description: "金庫",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 57.8,
        y: 71.4,
        width: 8.8,
        height: 16.7,
        onClick: clickWrap(function () {}),
        description: "壊れたダイアル",
        zIndex: 5,
        usable: () => false,
        item: { img: "brokenDual", visible: () => gameState.main.flags.safeDialBroken },
      },
      {
        x: 37.0,
        y: 69.2,
        width: 12.7,
        height: 18.6,
        onClick: clickWrap(function () {
          changeRoom("desk");
        }),
        description: "引き出し",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 67.6,
        y: 68.3,
        width: 9.1,
        height: 16.9,
        onClick: clickWrap(function () {
          updateMessage("古いストーブだ");
        }),
        description: "ストーブ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 86.3,
        y: 18.8,
        width: 11.4,
        height: 38.3,
        onClick: clickWrap(function () {
          if (gameState.selectedItem == "operaGlass") {
            showObj(null, "", IMAGES.modals.windowOutsideZoom, "気球が見える");
            return;
          }
          showObj(null, "", IMAGES.modals.windowOutside, "外が見える");
        }),
        description: "窓",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 86.7,
        y: 68.0,
        width: 11.5,
        height: 13.2,
        onClick: clickWrap(function () {
          showObj(null, "紙が挟まっている", IMAGES.modals.info, "駅の資料のようだ。");
        }),
        description: "本棚上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 85.0,
        y: 81.5,
        width: 11.0,
        height: 11.3,
        onClick: clickWrap(function () {
          updateMessage("古い資料がある");
        }),
        description: "本棚下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 45.8,
        y: 11.1,
        width: 7.3,
        height: 14.2,
        onClick: clickWrap(function () {
          updateMessage("時代を感じさせるランタンだ");
        }),
        description: "ランタン",
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
            changeRoom("mainRight");
          },
          { allowAtNight: true, allowAfterTaxi: true },
        ),
        description: "駅長室戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },

  desk: {
    name: "机",
    description: "",
    clickableAreas: [
      {
        x: 62.7,
        y: 8.7,
        width: 34.1,
        height: 13.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockDrawerTop) {
            showDrawerTopPuzzle();
            return;
          }
          playDeskDrawerOpenFx("引き出し上段", () => {
            acquireItemOnce("foundRosenzu", "rosenzu", "路線図がある", IMAGES.items.rosenzu, "路線図を手に入れた");
          });
        }),
        description: "引き出し上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 62.5,
        y: 24.2,
        width: 34.4,
        height: 14.5,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockDrawerMiddle) {
            showDrawerMiddlePuzzle();
            return;
          }
          playDeskDrawerOpenFx("引き出し中段", () => {
            acquireItemOnce("foundLetter", "letter", "手紙がある", IMAGES.items.letter, "手紙を手に入れた");
          });
        }),
        description: "引き出し中段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 62.6,
        y: 40.3,
        width: 34.3,
        height: 31.3,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockDrawerBottom) {
            showDrawerBottomPuzzle();
            return;
          }
          playDeskDrawerOpenFx("引き出し下段", () => {
            showModal("確認", "駅務引継ぎメモがある。読みますか？", [
              {
                text: "はい",
                action: () => {
                  closeModal();
                  const memoHtml = `
                    <div style="max-width:540px;margin:0 auto;padding:24px 22px;line-height:1.95;background:
                      radial-gradient(circle at 20% 18%, rgba(255,255,255,0.32), rgba(255,255,255,0) 44%),
                      radial-gradient(circle at 78% 82%, rgba(150,110,70,0.12), rgba(150,110,70,0) 48%),
                      repeating-linear-gradient(0deg, rgba(90,70,45,0.05) 0, rgba(90,70,45,0.05) 1px, transparent 1px, transparent 5px),
                      linear-gradient(180deg, #f4ead2 0%, #e7d7b6 100%);
                      border:1px solid #bca783;border-radius:6px;
                      box-shadow:inset 0 0 0 1px #efe2c4, inset 0 0 34px rgba(138,108,72,0.15), 0 10px 24px rgba(0,0,0,0.26);
                      color:#3d2f1f;font-family:'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif;
                      white-space:pre-line;text-align:left;">
本日の下り135D、交換設備のある一つ先の駅にて上り24M通過待ち。
停車は数分ほどの見込み。
なお、非常時連絡用として日本タクシーの番号を電話機の短縮229に登録済み。
                    </div>
                  `;
                  showModal("駅務引継ぎメモ", memoHtml, [{ text: "閉じる", action: "close" }]);
                },
              },
              { text: "いいえ", action: "close" },
            ]);
          });
        }),
        description: "引き出し下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.6,
        y: 8.5,
        width: 54.2,
        height: 7.3,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockDrawerLeftTop) {
            showDrawerLeftTopRhythmGame();
            return;
          }
          playDeskDrawerOpenFx("引き出し左上", () => {
            acquireItemOnce("foundRuler", "ruler", "定規がある", IMAGES.items.ruler, "定規を手に入れた");
          });
        }),
        description: "引き出し左上",
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
            changeRoom("masterRoom");
          },
          { allowAtNight: true },
        ),
        description: "引き出し戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },

  bench: {
    name: "ベンチ",
    description: "",
    clickableAreas: [
      {
        x: 33.0,
        y: 16.7,
        width: 20.4,
        height: 22.4,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.rakugaki, "落書きがある");
        }),
        description: "落書き",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 38.9,
        y: 89.8,
        width: 19.1,
        height: 6.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "driver") {
            if (hasItem("key")) {
              updateMessage("石の蓋はすでに開いている");
              return;
            }
            showObj(null, "ドライバーで蓋を開けた", IMAGES.modals.stoneDriver, "鍵を手に入れた");
            f.openedStoneLid = true;
            addItem("key");
            updateMessage("鍵を手に入れた");
            return;
          }
          if (f.openedStoneLid) {
            updateMessage("石がある");
            return;
          }
          showModal("確認", "石がある。調べますか？", [
            {
              text: "はい",
              action: () => {
                closeModal();
                showObj(null, "", IMAGES.modals.stone, "石を調べた");
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "石",
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
            changeRoom("homeLeft");
          },
          { allowAtNight: true },
        ),
        description: "ベンチ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },

  boxInner: {
    name: "木箱内部",
    description: "",
    clickableAreas: [
      {
        x: 19.3,
        y: 29.2,
        width: 38.4,
        height: 36.0,
        onClick: clickWrap(function () {
          updateMessage("古い帽子だ");
        }),
        description: "帽子",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 61.1,
        y: 46.6,
        width: 26.2,
        height: 33.7,
        onClick: clickWrap(function () {
          showModal("確認", "業務日誌のようだ。読みますか？", [
            {
              text: "はい",
              action: () => {
                closeModal();
                const journalHtml = `
                  <div style="max-width:520px;margin:0 auto;padding:22px 20px;line-height:1.9;background:#f5edd7;border:1px solid #c7b792;border-radius:4px;box-shadow:inset 0 0 0 1px #efe3c2,0 8px 20px rgba(0,0,0,0.22);color:#3b2f1f;font-family:'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif;white-space:pre-line;text-align:left;">
6月12日

ホームのベンチの脚が少しぐらついていた。
応急処置で締め直したが、後日点検が必要。
待合室の観光ポスターも色あせてきたな。

6月15日

駅長室の鍵をまた事務所に置き忘れて帰ってしまった。
スペアがあって助かった。

6月18日

駅長室のスペアキー作成。
ホーム上、いつもの場所に配置。
あの石、見た目は普通だけど便利だな。
                  </div>
                `;
                showModal("業務日誌", journalHtml, [{ text: "閉じる", action: "close" }]);
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "日誌",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 29.3,
        y: 65.4,
        width: 18.0,
        height: 16.7,
        onClick: clickWrap(function () {
          acquireItemOnce("foundDriver", "driver", "ドライバーがある", IMAGES.items.driver, "ドライバーを手に入れた");
        }),
        description: "ドライバー",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundDriver,
        item: { img: "driver", visible: () => !gameState.main.flags.foundDriver },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("mainLeft");
          },
          { allowAtNight: true },
        ),
        description: "木箱内部戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  homeTrain: {
    name: "ホーム",
    description: "不思議な電車が来ました",
    clickableAreas: [
      {
        x: 45.7,
        y: 32.9,
        width: 22.3,
        height: 49.2,
        onClick: clickWrap(function () {
          travelWithStepsTrueEnd();
        }),
        description: "ドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 86.9,
        y: 45.4,
        width: 13.1,
        height: 10.4,
        onClick: clickWrap(function () {
          updateMessage("迎えに来たよー");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 24.4,
        y: 30.8,
        width: 10.1,
        height: 3.1,
        onClick: clickWrap(function () {
          updateMessage("どこに行くんだろう…");
        }),
        description: "上の行き先表示",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 18.1,
        y: 58.5,
        width: 11.0,
        height: 6.9,
        onClick: clickWrap(function () {
          updateMessage("行先は不明だが、乗るしかなさそうだ");
        }),
        description: "下の行き先表示",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
    ],
  },
  end: {
    name: "ノーマルエンド",
    description: "不思議な廃駅から脱出できました。おめでとうございます！",
    clickableAreas: [
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
    description: "迎えに来たクマ妖精と共にどこかへ向かっています。脱出おめでとうございます！",
    clickableAreas: [
      {
        x: 25.4,
        y: 58.8,
        width: 20.1,
        height: 21.8,
        onClick: clickWrap(function () {
          updateMessage("大人しく外を見ている");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },

      {
        x: 8.8,
        y: 45.9,
        width: 32.0,
        height: 25.0,
        onClick: clickWrap(function () {
          updateMessage("とても嬉しそうに目を輝かせている。");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0.9,
        y: 86.9,
        width: 15.1,
        height: 10.4,
        onClick: clickWrap(function () {
          updateMessage("お弁当の包み紙だ");
        }),
        description: "",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => gameState.trueEnd.flags.backgroundState == 1 },
      },
      {
        x: 32.0,
        y: 72.4,
        width: 54.0,
        height: 16.0,
        onClick: clickWrap(function () {
          updateMessage("美味しそうなお弁当だ");
        }),
        description: "お弁当",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => gameState.trueEnd.flags.backgroundState == 1 },
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
    bear: [],
  },
};

// 足音で数歩→ワープ演出→目的の部屋へ
function travelWithSteps(destRoom = "end", color = "#000") {
  const canvasEl = document.getElementById("gameCanvas");
  const overlay = document.getElementById("roomEffectOverlay");

  // 足音を鳴らす
  try {
    const se = document.getElementById("se-train");
    if (se) {
      se.currentTime = 0;
      se.play();
    }
  } catch (e) {}

  // 画面を黒フェードに
  if (overlay) {
    overlay.style.background = color; // 黒スクリーン
    overlay.style.opacity = 1; // しっかり黒
  }

  let step = 0;
  const stepTimer = setInterval(() => {
    step++;

    if (step >= 3) {
      clearInterval(stepTimer);

      if (overlay) {
        changeRoom(destRoom);
      }

      setTimeout(() => {
        // 演出後に綺麗に消す
        if (overlay) {
          // overlay.style.background = '';
          overlay.style.opacity = 0;
        }
      }, 100);
    }
  }, 160);
}

function travelWithStepsTrueEnd() {
  const overlay = document.getElementById("roomEffectOverlay");
  let destRoom = "trueEnd";
  const calledEggBento = !!gameState.main?.flags?.calledEggBento;
  if (calledEggBento) {
    gameState.trueEnd.flags.backgroundState++;
  }

  // 足音を鳴らす
  try {
    const se = document.getElementById("se-train");
    if (se) {
      se.currentTime = 0;
      se.play();
    }
  } catch (e) {}

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

function quickBlackFade(duration = 300) {
  const fade = document.getElementById("roomEffectOverlay");
  if (!fade) return;

  // まず一瞬で黒くする
  fade.style.background = "#000";
  fade.style.opacity = "1";

  // duration ms 後に透明へ戻す
  setTimeout(() => {
    fade.style.opacity = "0";
  }, duration);
}

// ゲーム初期化
function initGame() {
  renderNavigation();
  changeRoom("mainLeft");
  updateMessage("気が付くとあなたは古い駅舎に立っていました");
  try {
    renderStatusIcons();
  } catch (e) {}
}

function findHitArea(x, y, clickableAreas, canvas) {
  // zIndex降順で
  const sorted = clickableAreas.slice().sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
  for (const area of sorted) {
    // 必要ならusable判定もここで
    const usable = area.usable === undefined ? true : typeof area.usable === "function" ? area.usable() : area.usable;

    if (!usable) continue; // 使えないエリアは判定しない
    const ax = (area.x / 100) * canvas.width;
    const ay = (area.y / 100) * canvas.height;
    const aw = (area.width / 100) * canvas.width;
    const ah = (area.height / 100) * canvas.height;
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
    const calledEggBento = !!gameState.main?.flags?.calledEggBento;
    changeBGM(calledEggBento ? "sounds/31/kazemakase.mp3" : "sounds/31/itsuka_wasureru_hibi.mp3");
  } else if (roomId === "end") {
    changeBGM("sounds/31/gemini_end_31.mp3");
  } else if (roomId === "homeTrain") {
    pauseBGM();
  } else {
    changeBGM("sounds/31/dust_and_memory.mp3");
  }

  // nav
  if (roomId === "home" || roomId === "masterRoom") {
    addNaviItem(roomId);
    renderNavigation();
  }
  if (roomId === "trueEnd" || roomId === "end" || roomId === "homeTrain") {
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

  if (roomId === "end") {
    const f = gameState.main.flags || (gameState.main.flags = {});
    if (f.playHanabiOnEnd) {
      f.playHanabiOnEnd = false;
      playSE?.("se-hanabi");
    }
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
  drawDeskDrawerFx(ctx, canvas, roomId);

  // alchemyRoom: 呪文表示欄にテキストを描画
  if (roomId === "alchemyRoom") {
    const f = ensureAlchemyState();
    const spell = String(f.spellText || "").trim();
    if (spell) {
      // 呪文表示欄のクリックエリア（x:77.6,y:61.9,w:17.9,h:5.6）に合わせて描く（% → px）
      const px = canvas.width * (77.6 / 100);
      const py = canvas.height * (61.9 / 100);
      const w = canvas.width * (17.9 / 100);
      const h = canvas.height * (5.6 / 100);

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // 読みやすさ優先で縁取り
      const fontSize = Math.max(12, Math.min(22, Math.floor(h * 2.2)));
      ctx.font = `bold ${fontSize}px Arial`;
      const cx = px + w / 2;
      const cy = py + h / 2;
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(0,0,0,0.65)";
      ctx.fillStyle = "#fff";
      // 長すぎる場合は末尾を…
      const maxChars = 10;
      const disp = spell.length > maxChars ? spell.slice(0, maxChars - 1) + "…" : spell;
      ctx.strokeText(disp, cx, cy);
      ctx.fillText(disp, cx, cy);
      ctx.restore();
    }
  }

  // stringBoard: 鍵セット後の演出＆メッセージ表示
  if (roomId === "stringBoard") {
    const f = gameState.main.flags || (gameState.main.flags = {});
    const until = f.stringBoardFlashUntil || 0;
    const now = Date.now();
    if (now < until) {
      const glow = Math.min(1, (until - now) / 450);
      const areas = [
        { x: 12, y: 18, w: 16, h: 22 },
        { x: 32, y: 18, w: 16, h: 22 },
        { x: 52, y: 18, w: 16, h: 22 },
        { x: 72, y: 18, w: 16, h: 22 },
      ];
      ctx.save();
      ctx.globalAlpha = glow;
      ctx.strokeStyle = "rgba(80,170,255,0.95)";
      ctx.lineWidth = 4;
      ctx.shadowColor = "rgba(80,170,255,0.95)";
      ctx.shadowBlur = 18;
      areas.forEach((a) => {
        const px = canvas.width * (a.x / 100);
        const py = canvas.height * (a.y / 100);
        const pw = canvas.width * (a.w / 100);
        const ph = canvas.height * (a.h / 100);
        ctx.strokeRect(px, py, pw, ph);
      });
      ctx.restore();
    }

    // 回転ボタン下に回転回数の●を表示
    if (!f.letterRotCount) f.letterRotCount = { l: 0, o: 0, c: 0, k: 0 };
    const buttons = [
      { key: "l", x: 12 },
      { key: "c", x: 52 },
      { key: "k", x: 72 },
    ];
    buttons.forEach((btn) => {
      const dotCount = f.letterRotCount[btn.key] || 0;
      const dotCx = canvas.width * ((btn.x + 8) / 100);
      const dotCy = canvas.height * (52 / 100); // ボタン下(y=43の下)
      const dotRadius = Math.max(3, Math.min(5, canvas.width * 0.01));
      const dotSpacing = dotRadius * 4;

      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      for (let i = 0; i < dotCount; i++) {
        const offsetX = (i - (dotCount - 1) / 2) * dotSpacing;
        ctx.beginPath();
        ctx.arc(dotCx + offsetX, dotCy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (f.setKeyRevealed) {
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.72;
      const lineImg = loadedImages[IMAGES.items.lineOnigiri];
      if (lineImg && lineImg.complete) {
        const targetW = Math.max(360, Math.min(canvas.width * 0.78, 780));
        const targetH = targetW * (lineImg.naturalHeight / lineImg.naturalWidth);
        ctx.drawImage(lineImg, cx - targetW / 2, cy - targetH / 2, targetW, targetH);
      }
    }
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
      const ax = (hoverArea.x / 100) * canvas.width;
      const ay = (hoverArea.y / 100) * canvas.height;
      const aw = (hoverArea.width / 100) * canvas.width;
      const ah = (hoverArea.height / 100) * canvas.height;
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
        const px = (area.x / 100) * canvas.width;
        const py = (area.y / 100) * canvas.height;
        const w = (area.width / 100) * canvas.width;
        const h = (area.height / 100) * canvas.height;
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

// ===== 演出ユーティリティ =====
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function drawDeskDrawerFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.deskDrawerOpen;
  if (!fx || roomId !== "desk" || fx.roomId !== "desk") return;
  const rect = getAreaRectPx("desk", fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const slidePx = Math.max(12, rect.h * 0.32) * easeOutCubic(t);
  const insetX = Math.max(3, rect.w * 0.03);
  const insetY = Math.max(2, rect.h * 0.04);
  const cavityH = Math.max(8, Math.min(rect.h * 0.55, slidePx + rect.h * 0.18));

  ctx.save();

  // 引き出しの空いた奥行き（元位置を暗くして「開いた」感じを出す）
  ctx.fillStyle = "rgb(22, 14, 9)";
  roundRect(ctx, rect.x + insetX, rect.y + insetY, rect.w - insetX * 2, Math.min(rect.h - insetY * 2, cavityH), Math.max(4, rect.h * 0.08), true, false);

  // 暗い溝の縁
  ctx.strokeStyle = "rgba(255, 220, 160, 0.18)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, rect.x + insetX, rect.y + insetY, rect.w - insetX * 2, Math.min(rect.h - insetY * 2, cavityH), Math.max(4, rect.h * 0.08), false, true);

  // 手前に引き出された前板（背景の上に半透明板を重ねる）
  const frontY = rect.y + slidePx;
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = Math.max(2, rect.h * 0.06);
  ctx.fillStyle = "rgb(211, 161, 84)";
  ctx.strokeStyle = "rgba(180, 140, 95, 0.45)";
  ctx.lineWidth = 2;
  roundRect(ctx, rect.x, frontY, rect.w, rect.h, Math.max(5, rect.h * 0.08), true, true);

  // 上端ハイライト
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = "rgba(230, 200, 150, 0.28)";
  ctx.beginPath();
  ctx.moveTo(rect.x + 2, frontY + 2);
  ctx.lineTo(rect.x + rect.w - 2, frontY + 2);
  ctx.stroke();

  // 取っ手（上部中央）：シルバーのコの字 |___|
  const knobCx = rect.x + rect.w / 2;
  const knobTopY = frontY + Math.max(5, rect.h * 0.14);
  const knobW = Math.max(10, rect.w * 0.3);
  const knobH = Math.max(6, rect.h * 0.2);
  const knobX = knobCx - knobW / 2;
  const knobY = knobTopY;
  const knobR = Math.max(1.5, Math.min(knobW, knobH) * 0.18);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1.8, rect.h * 0.045);
  ctx.strokeStyle = "rgba(214, 220, 227, 0.98)";

  ctx.beginPath();
  // 左縦線
  ctx.moveTo(knobX, knobY);
  ctx.lineTo(knobX, knobY + knobH - knobR);
  // 下辺（角を少し丸める）
  ctx.quadraticCurveTo(knobX, knobY + knobH, knobX + knobR, knobY + knobH);
  ctx.lineTo(knobX + knobW - knobR, knobY + knobH);
  ctx.quadraticCurveTo(knobX + knobW, knobY + knobH, knobX + knobW, knobY + knobH - knobR);
  // 右縦線
  ctx.lineTo(knobX + knobW, knobY);
  ctx.stroke();

  // 金属感のハイライト
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = Math.max(1, rect.h * 0.02);
  ctx.beginPath();
  ctx.moveTo(knobX + 1, knobY + 1);
  ctx.lineTo(knobX + 1, knobY + knobH - 2);
  ctx.moveTo(knobX + 1, knobY + knobH - 1);
  ctx.lineTo(knobX + knobW - 1, knobY + knobH - 1);
  ctx.moveTo(knobX + knobW - 1, knobY + knobH - 2);
  ctx.lineTo(knobX + knobW - 1, knobY + 1);
  ctx.stroke();

  ctx.restore();
}

function playDeskDrawerOpenFx(areaDescription, onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.deskDrawerOpen) {
    onDone?.();
    return;
  }

  const roomId = gameState.currentRoom;
  if (roomId !== "desk") {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.deskDrawerOpen = {
    roomId: "desk",
    areaDescription,
    progress: 0,
  };
  playSE?.("se-hikidashi");
  renderCanvasRoom();

  const dur = 280;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.deskDrawerOpen;
    if (!curFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      onDone?.();
      return;
    }
    const t = Math.min(1, (now - start) / dur);
    curFx.progress = t;
    renderCanvasRoom();
    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setTimeout(() => {
      if (gameState.fx) {
        delete gameState.fx.deskDrawerOpen;
        gameState.fx.lockInput = false;
      }
      renderCanvasRoom();
      onDone?.();
    }, 180);
  };
  requestAnimationFrame(tick);
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
function pointInRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

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
function screenFlash(type = "white", durMs = 180) {
  const f = document.getElementById("fxFlash");
  if (!f) return;
  f.style.animation = "none"; // 連打対策
  // 強制reflowでアニメ再適用
  // eslint-disable-next-line no-unused-expressions
  f.offsetHeight;
  const key = type === "red" ? "flashRed" : type === "black" ? "flashBlack" : "flashWhite";
  f.style.animation = `${key} ${durMs}ms ease`;
  // ページ全体を極小シェイク
  document.documentElement.classList.add("fx-shake");
  setTimeout(() => document.documentElement.classList.remove("fx-shake"), 120);
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

function toggleNight() {
  quickBlackFade();
  setTimeout(() => {
    renderCanvasRoom();
  }, 300);
}

function acquireItemOnce(flagKey, itemId, title, imgSrc, msg) {
  const f = gameState.main.flags;
  if (f[flagKey]) {
    if (itemId == "glass") {
      updateMessage("グラスが沢山ある");
    } else {
      updateMessage("もう何もない");
    }

    return;
  }
  f[flagKey] = true;
  addItem(itemId);
  renderCanvasRoom();

  showModal(title, `<img src="${imgSrc}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
  updateMessage(msg);
}

function fadeOutFujiTunnelRobo() {
  const f = gameState.main.flags;
  const room = rooms.fujiTunnel;
  if (!room || !Array.isArray(room.clickableAreas)) return;
  const roboArea = room.clickableAreas.find((a) => a.description === "ロボ");
  if (!roboArea) return;
  if (roboArea._fadeTimer) return;

  let step = 0;
  const steps = 8;
  roboArea.alpha = 1;
  renderCanvasRoom();

  roboArea._fadeTimer = setInterval(() => {
    step += 1;
    roboArea.alpha = Math.max(0, 1 - step / steps);
    renderCanvasRoom();
    if (step >= steps) {
      clearInterval(roboArea._fadeTimer);
      roboArea._fadeTimer = null;
      delete roboArea.alpha;
      f.fujiTunnelRoboLeaving = false;
      f.fujiTunnelRoboMoved = true;
      renderCanvasRoom();
    }
  }, 70);
}

function fadeOutFujiTunnelBearGuide() {
  const f = gameState.main.flags;
  const room = rooms.fujiTunnel;
  if (!room || !Array.isArray(room.clickableAreas)) return;
  const bearArea = room.clickableAreas.find((a) => a.description === "クマガイド");
  if (!bearArea) return;
  if (bearArea._fadeTimer) return;
  if (f.fujiTunnelBearGuideGone) return;

  let step = 0;
  const steps = 8;
  bearArea.alpha = 1;
  renderCanvasRoom();

  bearArea._fadeTimer = setInterval(() => {
    step += 1;
    bearArea.alpha = Math.max(0, 1 - step / steps);
    renderCanvasRoom();
    if (step >= steps) {
      clearInterval(bearArea._fadeTimer);
      bearArea._fadeTimer = null;
      delete bearArea.alpha;
      f.fujiTunnelBearGuideGone = true;
      renderCanvasRoom();
      playSE("se-bear-cry");
      updateMessage("クマガイドは逃げて行った。きっともう会えない。");
    }
  }, 70);
}

function fadeOutPondRobo() {
  const f = gameState.main.flags;
  const room = rooms.stampAreaPond;
  if (!room || !Array.isArray(room.clickableAreas)) return;
  const roboArea = room.clickableAreas.find((a) => a.description === "ロボ");
  if (!roboArea) return;
  if (roboArea._fadeTimer) return;

  let step = 0;
  const steps = 8;
  roboArea.alpha = 1;
  renderCanvasRoom();

  roboArea._fadeTimer = setInterval(() => {
    step += 1;
    roboArea.alpha = Math.max(0, 1 - step / steps);
    renderCanvasRoom();
    if (step >= steps) {
      clearInterval(roboArea._fadeTimer);
      roboArea._fadeTimer = null;
      delete roboArea.alpha;
      f.pondRoboLeaving = false;
      f.pondRoboMoved = true;
      renderCanvasRoom();
    }
  }, 70);
}

function clickWrap(fn, { allowAtNight = false, allowAfterTaxi = false } = {}) {
  return function (...args) {
    if (gameState.currentRoom === "masterRoom" && gameState.main.flags.callTaxi && !allowAfterTaxi) {
      updateMessage("もう帰れる。ここを調べる必要はない気がした。");
      return;
    }
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
      title: "🚃 TRUE END",
      label: "TRUE END",
      desc: "不思議な電車に乗ってしまいました",
    },

    end: {
      title: "🌳 NORMAL END ",
      label: "NORMAL END ",
      desc: "無事謎を解いて脱出できました！",
    },
  };

  const info = ENDING_INFO[endingId] || ENDING_INFO.end;

  // エンド別ひとこと
  let secretText = "";
  switch (endingId) {
    case "trueEnd":
      secretText = "🚃 どこに向かっているのでしょう";
      break;

    case "end":
      secretText = "🚙 日常へと戻りました";
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
function copyClearLog(label, timeStr) {
  const text = `『日本庭園の脱出』${label} クリア\n` + `プレイ時間：${timeStr}\n` + `ヒント利用：${ANA.hintCount || 0}回\n` + `#脱出ゲーム #保育室からの脱出`;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("クリアログをコピーしました！");
    })
    .catch(() => {
      alert("コピーに失敗しました…");
    });
}

// アンケート
function openFeedbackForm(endingId) {
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLScNOcW22M0jCNtJ_H5fAi28wUxTta5hEzW56PWpShH9CFdnpw/viewform";

  const endingLabel =
    {
      trueEnd: "トゥルーエンド",
      end: "ノーマルエンド",
      endWorse: "エンド",
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

function openNotebook() {
  const m = document.getElementById("notebookModal");
  if (!m) return;
  m.style.display = "flex";
  switchNotebookTab("notes"); // 毎回noteから開く

  // ★ 進捗タスク（NOTES）も更新しておく
  renderNotebookTasks();

  if (gameState.main?.flags?.notebookDeckHintAdded) {
    addDeckDoorHintNote();
  }
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

const PHONE_CALL_DATA = {
  735: {
    title: "発信結果",
    message: "こちらはKUMASUI鉄道遺失物センターです。現在は業務を受け付けておりません。",
    seId: "se-call",
  },
  229: {
    title: "発信結果",
    message: "お話し中だ。",
    seId: "se-busy",
  },
  577: {
    title: "発信結果",
    message: "お話し中だ。",
    seId: "se-busy",
  },
  110: {
    title: "発信結果",
    message: "いたずら電話はやめよう",
    seId: "",
  },
  119: {
    title: "発信結果",
    message: "いたずら電話はやめておこう",
    seId: "",
  },
  112: {
    title: "発信結果",
    message: "いたずら電話はやめよう",
    seId: "",
  },
};

const PHONE_CALL_FALLBACK = {
  title: "発信結果",
  message: "…つながらない。",
  seId: "se-noise",
};

function getPhoneCallResult(number) {
  return PHONE_CALL_DATA[number] || PHONE_CALL_FALLBACK;
}

function playDialToneDigit(digit) {
  const seMap = {
    0: "se-push0",
    1: "se-push1",
    2: "se-push2",
    3: "se-push3",
    4: "se-push4",
    5: "se-push5",
    6: "se-push6",
    7: "se-push7",
    8: "se-push8",
    9: "se-push9",
  };
  try {
    playSE(seMap[digit] || "se-click");
  } catch (e) {}
}

function showTelephoneDialer() {
  try {
    playSE("se-receiver");
  } catch (e) {}

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <div id="telDialInput" style="min-height:1.5em; font-size:1.2em; letter-spacing:0.18em; font-weight:700;">----</div>
      <div style="display:grid; grid-template-columns:56px 56px 56px; gap:8px; justify-content:center;">
        <button id="telPad1" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">1</button>
        <button id="telPad2" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">2</button>
        <button id="telPad3" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">3</button>
        <button id="telPad4" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">4</button>
        <button id="telPad5" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">5</button>
        <button id="telPad6" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">6</button>
        <button id="telPad7" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">7</button>
        <button id="telPad8" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">8</button>
        <button id="telPad9" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">9</button>
      </div>
      <div style="display:grid; grid-template-columns:56px 56px 56px; gap:8px; justify-content:center;">
        <button id="telPadClear" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:12px;font-weight:700;background:#d7d7d7;color:#111;">CLR</button>
        <button id="telPad0" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">0</button>
        <div></div>
      </div>
      <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
        <button id="telCallBtn" class="ok-btn">発信</button>
        <button id="telCloseBtn" class="nav-btn" type="button">閉じる</button>
      </div>
      <div id="telDialHint" style="min-height:1.2em; font-size:0.92em;"></div>
    </div>
  `;

  showModal("電話", content, []);

  setTimeout(() => {
    const inputEl = document.getElementById("telDialInput");
    const hintEl = document.getElementById("telDialHint");
    const callBtn = document.getElementById("telCallBtn");
    const closeBtn = document.getElementById("telCloseBtn");
    const clearBtn = document.getElementById("telPadClear");
    const numBtns = Array.from({ length: 10 }, (_, n) => document.getElementById(`telPad${n}`));
    if (!inputEl || !hintEl || !callBtn || !closeBtn || !clearBtn || numBtns.some((b) => !b)) return;

    let input = "";

    const renderInput = () => {
      inputEl.textContent = (input + "----").slice(0, 4);
    };

    const pushNum = (n) => {
      if (input.length >= 4) return;
      input += String(n);
      renderInput();
      hintEl.textContent = "";
      playDialToneDigit(n);
    };

    const doCall = () => {
      if (input.length === 0) {
        hintEl.textContent = "番号を入力してください。";
        return;
      }

      const f = gameState.main.flags || (gameState.main.flags = {});
      const isTaxi = input === "229";
      const firstTaxiCall = isTaxi && !f.callTaxi;
      if (firstTaxiCall) f.callTaxi = true;
      const isEggBento = input === "577";
      const firstEggBentoCall = isEggBento && !f.calledEggBento;
      if (firstEggBentoCall) f.calledEggBento = true;

      const result = firstTaxiCall
        ? {
            title: "発信結果",
            message: "日本タクシーです。配車依頼を受け付けました。すぐ向かいますので、外でお待ちください",
            seId: "se-call",
          }
        : firstEggBentoCall
          ? {
              title: "発信結果",
              message: "仕出し弁当EGGです。ご注文ですね。手配させていただきます。ガチャ",
              seId: "se-call",
            }
          : getPhoneCallResult(input);
      try {
        // playSE("se-call");
      } catch (e) {}
      setTimeout(() => {
        try {
          playSE(result.seId);
        } catch (e) {}
        showModal(
          result.title,
          `<p style="margin:0; line-height:1.8;">${result.message}</p>`,
          [{ text: "閉じる", action: "close" }],
          firstTaxiCall
            ? () => {
                showToast("タクシーを呼んだ。ホームに出てみよう");
              }
            : null,
        );
      }, 200);
    };

    numBtns.forEach((btn, n) => {
      btn.addEventListener("click", () => pushNum(n));
    });

    clearBtn.addEventListener("click", () => {
      input = "";
      renderInput();
      hintEl.textContent = "";
      try {
        playSE("se-click");
      } catch (e) {}
    });

    callBtn.addEventListener("click", doCall);
    closeBtn.addEventListener("click", () => {
      closeModal();
    });

    renderInput();
  }, 0);
}

function showSafeDialPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockSafe) {
    acquireItemOnce("foundBoard", "board", "駅名板がある", IMAGES.items.board, "駅名板を手に入れた");
    return;
  }
  if (f.safeDialBroken) {
    showModal("金庫", "ダイヤルが壊れている…", [{ text: "閉じる", action: "close" }]);
    return;
  }

  showModal("確認", "ダイヤルが劣化している…1回しか入力できないかもしれない。入力しますか？", [
    {
      text: "はい",
      action: () => {
        closeModal();

        const content = `
          <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
            <input id="safeDialInput" class="puzzle-input" type="text" maxlength="32"
              placeholder="入力"
              style="width:240px; text-align:center; font-size:1.05em; color:#0b2e6d; font-weight:700;">
            <button id="safeDialOk" class="ok-btn" type="button">OK</button>
            <div id="safeDialHint" style="margin-top:2px; font-size:0.95em; min-height:1.2em;"></div>
          </div>
        `;

        showModal("金庫のダイヤル", content, [{ text: "閉じる", action: "close" }]);

        setTimeout(() => {
          const input = document.getElementById("safeDialInput");
          const okBtn = document.getElementById("safeDialOk");
          const hint = document.getElementById("safeDialHint");
          if (!input || !okBtn) return;

          const judge = () => {
            const value = String(input.value || "").trim();
            if (value === "38katsura") {
              f.unlockSafe = true;
              playSE?.("se-clear");
              closeModal();
              renderCanvasRoom?.();
              updateMessage("カチッ…金庫のロックが外れた。");
              return;
            }

            playSE?.("se-door-close");
            f.safeDialBroken = true;
            closeModal();
            triggerBadEndSafeDial();
            renderCanvasRoom();
          };

          okBtn.addEventListener("click", judge);
          input.addEventListener("input", () => {
            if (hint) hint.textContent = "";
          });
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") judge();
          });
          input.focus();
        }, 0);
      },
    },
    { text: "いいえ", action: "close" },
  ]);
}

function showWoodBoxPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockWoodBox) {
    updateMessage("木箱は、もうアンロックされている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <div id="woodBoxRow" style="display:flex; gap:8px; justify-content:center; align-items:center;"></div>
      <button id="woodBoxOk" class="ok-btn" type="button">OK</button>
      <div id="woodBoxHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("木箱のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("woodBoxRow");
    const okBtn = document.getElementById("woodBoxOk");
    const hintEl = document.getElementById("woodBoxHint");
    if (!row || !okBtn || !hintEl) return;

    const cycle = ["A", "B", "D", "E", "I", "K", "L", "N", "O", "U", "X"];
    const target = ["O", "L", "D"];
    const state = [0, 0, 0];

    const cells = Array.from({ length: 3 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "58px";
      btn.style.height = "58px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "8px";
      btn.style.border = "2px solid #777";
      btn.style.background = "#fff";
      btn.style.color = "#111";
      btn.style.fontSize = "30px";
      btn.style.fontWeight = "700";
      btn.style.fontFamily = "Georgia, serif";
      btn.setAttribute("aria-label", `文字 ${i + 1}`);
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % cycle.length;
        playSE?.("se-pi");
        repaint();
      });
      row.appendChild(btn);
      return btn;
    });

    function repaint() {
      cells.forEach((btn, i) => {
        btn.textContent = cycle[state[i]];
      });
      hintEl.textContent = "";
    }

    okBtn.addEventListener("click", () => {
      const current = state.map((idx) => cycle[idx]);
      const ok = target.every((v, i) => current[i] === v);
      if (ok) {
        f.unlockWoodBox = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_wood_box");
        updateMessage("木箱のロックが外れた。");
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

// 引き出し中段（数字ロック 3桁）
function showDrawerMiddlePuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.unlockDrawerMiddle) {
    updateMessage("引き出しは、もうアンロックされている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <input id="drawerMidInput" class="puzzle-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2"
        placeholder="数字を入力"
        style="width:200px; text-align:center; letter-spacing:0.2em; font-size:1.2em; color:#0b2e6d; font-weight:700;">
      <div style="display:flex; gap:10px; align-items:center; justify-content:center;">
        <button id="drawerMidOk" class="ok-btn">OK</button>
      </div>

      <div id="drawerMidHint" style="margin-top:2px; font-size:0.95em; min-height:1.2em;"></div>
    </div>
  `;

  showModal("引き出しのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const input = document.getElementById("drawerMidInput");
    const okBtn = document.getElementById("drawerMidOk");
    const hint = document.getElementById("drawerMidHint");
    if (!input || !okBtn) return;

    const judge = () => {
      const value = String(input.value || "")
        .replace(/\D/g, "")
        .slice(0, 2);
      input.value = value;
      const ok = value === "61";
      if (ok) {
        f.unlockDrawerMiddle = true;
        playSE?.("se-clear");
        closeModal();
        updateMessage("カチッ…引き出しのロックが外れた。");
        renderCanvasRoom?.();
        markProgress?.("unlock_drawer_middle");
      } else {
        playSE?.("se-error");
        if (hint) hint.textContent = "ちがうようだ。";
        screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
      }
    };

    okBtn.addEventListener("click", judge);

    input.addEventListener("input", () => {
      input.value = String(input.value || "")
        .replace(/\D/g, "")
        .slice(0, 2);
      if (hint) hint.textContent = "";
    });

    // キーボード：Enter=OK
    const onKey = (e) => {
      if (e.key === "Enter") judge();
    };
    document.addEventListener("keydown", onKey);

    // closeModalフックで掃除（既存パズルと同じ作法）
    const _origCloseModal = window.closeModal;
    if (typeof _origCloseModal === "function") {
      window.closeModal = function () {
        try {
          document.removeEventListener("keydown", onKey);
        } catch (e) {}
        window.closeModal = _origCloseModal;
        return _origCloseModal.apply(this, arguments);
      };
    }

    input.focus();
  }, 0);
}

function cleanupDrawerLeftTopRhythmGame() {
  const st = window.__drawerLeftTopRhythmGame;
  if (!st) return;
  st.alive = false;
  if (st.rafId) cancelAnimationFrame(st.rafId);
  if (st.keyHandler) document.removeEventListener("keydown", st.keyHandler);
  if (st.closeCleanup) window.removeEventListener("modal:closed", st.closeCleanup);
  window.__drawerLeftTopRhythmGame = null;
}

function showDrawerLeftTopRhythmGame() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockDrawerLeftTop) {
    playDeskDrawerOpenFx("引き出し左上", () => {
      acquireItemOnce("foundRuler", "ruler", "定規がある", IMAGES.items.ruler, "定規を手に入れた");
    });
    return;
  }

  cleanupDrawerLeftTopRhythmGame();

  const content = `
    <div id="drawerLeftTopRhythmGame" style="margin-top:8px;">
      <div style="font-size:0.92em;line-height:1.6;margin-bottom:8px;text-align:left;">
        引っかかりをリズムで緩めてから、一気に引っ張る。<br>
        リズム調整: 画面の <b>左 / 右</b> を交互にタップ。<br>
        引っ張り: <b>引っ張る</b> を連打
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div>
          <div style="font-size:0.85em;margin-bottom:4px;">引っかかり</div>
          <div style="height:12px;background:#3a2a1f;border:1px solid #6d4d37;border-radius:10px;overflow:hidden;">
            <div id="drawerLeftTopJamBar" style="height:100%;width:100%;background:linear-gradient(90deg,#ffcc80,#e86a4b);transition:width 80ms linear;"></div>
          </div>
        </div>
        <div>
          <div style="font-size:0.85em;margin-bottom:4px;">引っ張り</div>
          <div style="height:12px;background:#1f2f3f;border:1px solid #315673;border-radius:10px;overflow:hidden;">
            <div id="drawerLeftTopPullBar" style="height:100%;width:0%;background:linear-gradient(90deg,#7ad7ff,#2d8fd6);transition:width 80ms linear;"></div>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;align-items:center;margin-top:10px;flex-wrap:wrap;">
        <button id="drawerLeftTopTapA" class="ok-btn" type="button" style="min-width:72px;">左</button>
        <button id="drawerLeftTopTapD" class="ok-btn" type="button" style="min-width:72px;">右</button>
        <button id="drawerLeftTopPullBtn" class="ok-btn" type="button" style="min-width:96px;">引っ張る</button>
      </div>
      <div id="drawerLeftTopBeat" style="margin:10px auto 0;width:24px;height:24px;border-radius:999px;background:#7b5f4c;box-shadow:0 0 0 0 rgba(255,210,160,0.2);transition:transform 90ms ease, box-shadow 120ms ease;"></div>
      <div id="drawerLeftTopStatus" style="margin-top:8px;min-height:1.2em;text-align:center;font-size:0.95em;">左/右をリズムよく交互にタップ</div>
    </div>
  `;

  showModal("引き出し左上", content, [{ text: "閉じる", action: "close" }]);

  const jamBar = document.getElementById("drawerLeftTopJamBar");
  const pullBar = document.getElementById("drawerLeftTopPullBar");
  const beatEl = document.getElementById("drawerLeftTopBeat");
  const statusEl = document.getElementById("drawerLeftTopStatus");
  const tapABtn = document.getElementById("drawerLeftTopTapA");
  const tapDBtn = document.getElementById("drawerLeftTopTapD");
  const pullBtn = document.getElementById("drawerLeftTopPullBtn");
  if (!jamBar || !pullBar || !beatEl || !statusEl || !tapABtn || !tapDBtn || !pullBtn) return;

  const st = {
    alive: true,
    rafId: 0,
    closeCleanup: null,
    phase: "rhythm",
    seq: ["A", "D", "A", "D", "A", "D"],
    seqIndex: 0,
    jam: 100,
    pull: 0,
    beatMs: 620,
    toleranceMs: 160,
    nextBeatAt: performance.now() + 900,
    lastTs: 0,
  };
  window.__drawerLeftTopRhythmGame = st;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function setStatus(msg) {
    if (!window.__drawerLeftTopRhythmGame?.alive) return;
    statusEl.textContent = msg;
  }

  function renderBars() {
    jamBar.style.width = `${clamp(st.jam, 0, 100)}%`;
    pullBar.style.width = `${clamp(st.pull, 0, 100)}%`;
  }

  function pulseBeat(active) {
    if (active) {
      beatEl.style.transform = "scale(1.12)";
      beatEl.style.boxShadow = "0 0 0 10px rgba(255, 206, 154, 0.22)";
      beatEl.style.background = "#f4a96a";
      return;
    }
    beatEl.style.transform = "scale(1)";
    beatEl.style.boxShadow = "0 0 0 0 rgba(255, 206, 154, 0)";
    beatEl.style.background = st.phase === "pull" ? "#69b8f0" : "#7b5f4c";
  }

  function success() {
    f.unlockDrawerLeftTop = true;
    cleanupDrawerLeftTopRhythmGame();
    closeModal();
    playSE?.("se-clear");
    markProgress?.("unlock_drawer_left_top");
    playDeskDrawerOpenFx("引き出し左上", () => {
      acquireItemOnce("foundRuler", "ruler", "定規がある", IMAGES.items.ruler, "定規を手に入れた");
    });
  }

  function handleRhythmInput(key, now) {
    if (key !== "A" && key !== "D") return false;

    const expected = st.seq[st.seqIndex];
    const diff = Math.abs(now - st.nextBeatAt);
    const ok = key === expected && diff <= st.toleranceMs;

    if (ok) {
      st.seqIndex += 1;
      st.jam = Math.max(0, st.jam - 17);
      st.nextBeatAt += st.beatMs;
      while (st.nextBeatAt < now - st.beatMs * 0.5) st.nextBeatAt += st.beatMs;
      setStatus(`調整中... ${st.seqIndex}/${st.seq.length}`);

      if (st.seqIndex >= st.seq.length || st.jam <= 0) {
        st.phase = "pull";
        st.pull = Math.max(st.pull, 20);
        setStatus("いまだ！「引っ張る」を連打");
      }
      return true;
    }

    st.jam = Math.min(100, st.jam + 11);
    st.seqIndex = Math.max(0, st.seqIndex - 1);
    st.nextBeatAt = now + st.beatMs * 0.95;
    setStatus("タイミングがずれた");
    playSE?.("se-error");
    screenShake?.(document.getElementById("modalContent"), 90, "fx-shake");
    return true;
  }

  function handlePullInput(key) {
    if (key !== " " && key !== "Enter") return false;
    st.pull = Math.min(100, st.pull + 22);
    st.jam = Math.max(0, st.jam - 3);
    if (st.pull >= 100) {
      setStatus("ガタッ...開いた！");
      setTimeout(() => {
        if (window.__drawerLeftTopRhythmGame?.alive) success();
      }, 120);
    }
    return true;
  }

  const handleTap = (kind) => {
    if (!window.__drawerLeftTopRhythmGame?.alive) return;
    if (kind === "A" || kind === "D") playSE?.("se-block");
    if (kind === "PULL") playSE?.("se-punch");
    const now = performance.now();

    let consumed = false;
    if (st.phase === "rhythm") {
      if (kind === "A" || kind === "D") {
        consumed = handleRhythmInput(kind, now);
      } else if (kind === "PULL") {
        setStatus("先に左/右でリズム調整する");
      }
    } else if (kind === "PULL") {
      consumed = handlePullInput("Enter");
    } else {
      setStatus("「引っ張る」を連打");
    }

    if (consumed) renderBars();
  };

  tapABtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    handleTap("A");
  });
  tapDBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    handleTap("D");
  });
  pullBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    handleTap("PULL");
  });

  const closeCleanup = () => cleanupDrawerLeftTopRhythmGame();
  st.closeCleanup = closeCleanup;
  window.addEventListener("modal:closed", closeCleanup);

  function tick(ts) {
    if (!window.__drawerLeftTopRhythmGame?.alive) return;
    if (!st.lastTs) st.lastTs = ts;
    const dt = Math.min(0.05, (ts - st.lastTs) / 1000);
    st.lastTs = ts;

    if (st.phase === "rhythm") {
      if (ts > st.nextBeatAt + st.toleranceMs + 220) {
        st.jam = Math.min(100, st.jam + 6);
        st.nextBeatAt += st.beatMs;
        setStatus("リズムを保って調整する");
      }
      const beatDiff = Math.abs(ts - st.nextBeatAt);
      pulseBeat(beatDiff <= 95);
    } else {
      st.pull = Math.max(0, st.pull - dt * 10);
      pulseBeat(false);
      if (st.pull <= 0) setStatus("もう一度、力を込めて引っ張る");
    }

    renderBars();
    st.rafId = requestAnimationFrame(tick);
  }

  renderBars();
  st.rafId = requestAnimationFrame(tick);
}

function showDrawerTopPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.unlockDrawerTop) {
    updateMessage("引き出し上段は、もうアンロックされている。");
    return;
  }

  const letters = ["A", "D", "E", "H", "I", "J", "K", "L", "N", "O", "R", "T"];
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <div style="display:flex; gap:14px; justify-content:center; align-items:center;">
        <button id="drawerTopCell0" class="nav-btn" type="button"
          style="width:62px;height:62px;padding:0;border-radius:10px;border:2px solid #666;background:#fff;font-size:1.6em;font-weight:700;color:#222;"></button>
        <button id="drawerTopCell1" class="nav-btn" type="button"
          style="width:62px;height:62px;padding:0;border-radius:10px;border:2px solid #666;background:#fff;font-size:1.6em;font-weight:700;color:#222;"></button>
        <button id="drawerTopCell2" class="nav-btn" type="button"
          style="width:62px;height:62px;padding:0;border-radius:10px;border:2px solid #666;background:#fff;font-size:1.6em;font-weight:700;color:#222;"></button>
        <button id="drawerTopCell3" class="nav-btn" type="button"
          style="width:62px;height:62px;padding:0;border-radius:10px;border:2px solid #666;background:#fff;font-size:1.6em;font-weight:700;color:#222;"></button>
      </div>
      <button id="drawerTopOkBtn" class="ok-btn" type="button">OK</button>
      <div id="drawerTopHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("引き出しのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const cells = [0, 1, 2, 3].map((i) => document.getElementById(`drawerTopCell${i}`));
    const okBtn = document.getElementById("drawerTopOkBtn");
    const hintEl = document.getElementById("drawerTopHint");
    if (cells.some((c) => !c) || !okBtn || !hintEl) return;

    const indexes = [-1, -1, -1, -1];
    cells.forEach((cell, i) => {
      cell.addEventListener("click", () => {
        playSE?.("se-click");
        indexes[i] = (indexes[i] + 1) % letters.length;
        cell.textContent = letters[indexes[i]];
        hintEl.textContent = "";
      });
    });

    okBtn.addEventListener("click", () => {
      const word = indexes.map((idx) => (idx >= 0 ? letters[idx] : "")).join("");
      const ok = word === "DIAL";
      if (ok) {
        f.unlockDrawerTop = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_drawer_top");
        updateMessage("カチッ…引き出し上段のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showDrawerBottomPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockDrawerBottom) {
    updateMessage("引き出し下段は、もうアンロックされている。");
    return;
  }

  const target = [3, 2, 5];
  const digits = [0, 0, 0];
  const dialColors = ["#5170ff", "#5ce1e6", "#ffde59"];
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <div style="display:flex; gap:10px; align-items:center; justify-content:center;">
        <button id="drawerBottomDial0" type="button"
          style="width:64px;height:64px;padding:0;border-radius:10px;border:2px solid #5b7f8b;background:${dialColors[0]};font-size:1.8em;font-weight:700;color:#fff;">0</button>
        <button id="drawerBottomDial1" type="button"
          style="width:64px;height:64px;padding:0;border-radius:10px;border:2px solid #5b7f8b;background:${dialColors[1]};font-size:1.8em;font-weight:700;color:#0f2f33;">0</button>
        <button id="drawerBottomDial2" type="button"
          style="width:64px;height:64px;padding:0;border-radius:10px;border:2px solid #5b7f8b;background:${dialColors[2]};font-size:1.8em;font-weight:700;color:#0f2f33;">0</button>
      </div>
      <button id="drawerBottomOkBtn" class="ok-btn" type="button">OK</button>
      <div id="drawerBottomHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("引き出しのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const dials = [0, 1, 2].map((i) => document.getElementById(`drawerBottomDial${i}`));
    const okBtn = document.getElementById("drawerBottomOkBtn");
    const hintEl = document.getElementById("drawerBottomHint");
    if (dials.some((d) => !d) || !okBtn || !hintEl) return;

    dials.forEach((dial, i) => {
      dial.addEventListener("click", () => {
        playSE?.("se-click");
        digits[i] = (digits[i] + 1) % 10;
        dial.textContent = String(digits[i]);
        hintEl.textContent = "";
      });
    });

    okBtn.addEventListener("click", () => {
      const ok = target.every((v, i) => digits[i] === v);
      if (ok) {
        f.unlockDrawerBottom = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_drawer_bottom");
        updateMessage("カチッ…引き出し下段のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showBaggageLockPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockBaggage) {
    updateMessage("荷物の鍵は外れている。");
    return;
  }

  const digits = [0, 0, 0];
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <div style="display:flex; flex-direction:column; gap:10px; align-items:center;">
        <button id="baggageDial0" type="button"
          style="width:64px;height:64px;padding:0;border-radius:10px;border:2px solid #666;background:#fff;font-size:1.8em;font-weight:700;color:#222;">0</button>
        <button id="baggageDial1" type="button"
          style="width:64px;height:64px;padding:0;border-radius:10px;border:2px solid #666;background:#fff;font-size:1.8em;font-weight:700;color:#222;">0</button>
        <button id="baggageDial2" type="button"
          style="width:64px;height:64px;padding:0;border-radius:10px;border:2px solid #666;background:#fff;font-size:1.8em;font-weight:700;color:#222;">0</button>
      </div>
      <button id="baggageLockOkBtn" class="ok-btn" type="button">OK</button>
      <div id="baggageLockHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("荷物の鍵", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const dials = [0, 1, 2].map((i) => document.getElementById(`baggageDial${i}`));
    const okBtn = document.getElementById("baggageLockOkBtn");
    const hintEl = document.getElementById("baggageLockHint");
    if (dials.some((d) => !d) || !okBtn || !hintEl) return;

    dials.forEach((dial, i) => {
      dial.addEventListener("click", () => {
        playSE?.("se-click");
        digits[i] = (digits[i] + 1) % 10;
        dial.textContent = String(digits[i]);
        hintEl.textContent = "";
      });
    });

    okBtn.addEventListener("click", () => {
      const code = digits.join("");
      if (code === "735") {
        f.unlockBaggage = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("カチッ…荷物の鍵が外れた。");
        markProgress?.("unlock_baggage");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showMomijiLockerTopPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.unlockMomijiLockerTop) {
    updateMessage("ロッカー上段は、もうアンロックされている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <div id="momijiLockerTopRow" style="display:flex; flex-direction:column; gap:6px; justify-content:center; align-items:center;"></div>
      <button id="momijiLockerTopOk" class="ok-btn" type="button">OK</button>
      <div id="momijiLockerTopHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("ロッカーのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("momijiLockerTopRow");
    const okBtn = document.getElementById("momijiLockerTopOk");
    const hintEl = document.getElementById("momijiLockerTopHint");
    if (!row || !okBtn || !hintEl) return;

    // ユーザー指定の循環に lanternN が抜けていたため、目標 HONEY を作れるよう N を含める
    const cycle = ["Y", "O", "H", "N", "E"];
    const imgByLetter = {
      Y: IMAGES.modals.lanternY,
      O: IMAGES.modals.lanternO,
      H: IMAGES.modals.lanternH,
      N: IMAGES.modals.lanternN,
      E: IMAGES.modals.lanternE,
    };
    const target = ["H", "O", "N", "E", "Y"];
    const state = [0, 0, 0, 0, 0]; // 初期は全て Y

    const cells = Array.from({ length: 5 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "58px";
      btn.style.height = "58px";
      btn.style.padding = "0";
      btn.style.display = "block";
      btn.style.borderRadius = "10px";
      btn.style.overflow = "hidden";
      btn.style.border = "2px solid #777";
      btn.setAttribute("aria-label", `ランタン ${i + 1}`);
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % cycle.length;
        repaint();
      });
      row.appendChild(btn);
      return btn;
    });

    function repaint() {
      cells.forEach((btn, i) => {
        const letter = cycle[state[i]];
        btn.innerHTML = `<img src="${imgByLetter[letter]}" alt="lantern ${letter}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
      });
      hintEl.textContent = "";
    }

    okBtn.addEventListener("click", () => {
      const current = state.map((idx) => cycle[idx]);
      const ok = target.every((v, i) => current[i] === v);
      if (ok) {
        f.unlockMomijiLockerTop = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_locker_top");
        updateMessage("ロッカー上段のロックが外れた。");
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showMomijiLockerBottomPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.unlockMomijiLockerBottom) {
    updateMessage("ロッカー下段は、もうアンロックされている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <div id="momijiLockerBottomRow" style="display:flex; flex-direction:column; gap:6px; justify-content:center; align-items:center;"></div>
      <button id="momijiLockerBottomOk" class="ok-btn" type="button">OK</button>
      <div id="momijiLockerBottomHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("ロッカーのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("momijiLockerBottomRow");
    const okBtn = document.getElementById("momijiLockerBottomOk");
    const hintEl = document.getElementById("momijiLockerBottomHint");
    if (!row || !okBtn || !hintEl) return;

    const cycle = ["A", "E", "H", "I", "K", "M", "N", "O", "S", "Y"];
    const target = ["H", "O", "N", "E", "Y"];
    const state = [0, 0, 0, 0, 0];

    const cells = Array.from({ length: 5 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "58px";
      btn.style.height = "58px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "10px";
      btn.style.border = "2px solid #777";
      btn.style.fontSize = "26px";
      btn.style.fontWeight = "700";
      btn.style.fontFamily = "Georgia, serif";
      btn.style.background = "linear-gradient(180deg, #fff7de, #e8d29f)";
      btn.style.color = "#4a2d08";
      btn.setAttribute("aria-label", `文字 ${i + 1}`);
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % cycle.length;
        playSE?.("se-pi");
        repaint();
      });
      row.appendChild(btn);
      return btn;
    });

    function repaint() {
      cells.forEach((btn, i) => {
        btn.textContent = cycle[state[i]];
      });
      hintEl.textContent = "";
    }

    okBtn.addEventListener("click", () => {
      const current = state.map((idx) => cycle[idx]);
      const ok = target.every((v, i) => current[i] === v);
      if (ok) {
        f.unlockMomijiLockerBottom = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_locker_bottom");
        updateMessage("ロッカー下段のロックが外れた。");
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function triggerBadEndPondMaster() {
  try {
    screenFlash && screenFlash("black");
  } catch (e) {}
  try {
    pauseBGM && pauseBGM();
  } catch (e) {}
  try {
    playSE && playSE("se-basha");
    playSE && playSE("se-uwaa");
  } catch (e) {}

  try {
    markProgress && markProgress("bad_pond_master");
  } catch (e) {}

  showModal(
    "【BAD END】池の主が襲い掛かってきた。",
    `
      <div style="text-align:center;">
        <img src="${IMAGES.modals.badendPondMaster}" alt="bad end pond master"
          style="max-width:420px;width:100%;display:block;margin:0 auto 14px;border-radius:12px;">
        <p style="margin:0;">池の主を怒らせてしまった…</p>
      </div>
    `,
    [{ text: "最初から", action: "restart" }],
  );
}

function triggerBadEndSafeDial() {
  try {
    screenFlash && screenFlash("black");
  } catch (e) {}
  try {
    pauseBGM && pauseBGM();
  } catch (e) {}

  try {
    markProgress && markProgress("bad_safe_dial");
  } catch (e) {}

  showModal(
    "【BAD END】薄れゆく意識",
    `
      <div style="text-align:center;">
        <img src="${IMAGES.modals.badend}" alt="bad end safe dial"
          style="max-width:420px;width:100%;display:block;margin:0 auto 14px;border-radius:12px;">
        <p style="margin:0;">金庫が壊れ、ダイヤルがあなたの足に直撃した。痛みで意識が遠のいていく…</p>
      </div>
    `,
    [{ text: "最初から", action: "restart" }],
  );
}

function handleDoor() {
  // エンディング遷移共通ハンドラ
  const trueEndFlg = gameState.flags.trueEndUnlocked;
  const goEnding = () => {
    if (trueEndFlg) {
      gameState.endings.true = true;
      travelWithStepsTrueEnd();
    } else {
      if (hasItem("seal")) gameState.end.flags.backgroundState++;
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
    if (isTsuboFixPair) {
      clearUsingItem(true);
      removeItem("tape");
      removeItem("tsubo");
      addItem("tsuboFixed");
      showModal(
        "壺を修理した",
        `
          <div class="modal-anim">
            <img src="${IMAGES.modals.tsuboFix1}">
            <img src="${IMAGES.modals.tsuboFix2}">
          </div>
        `,
        [{ text: "閉じる", action: "close" }],
      );
      updateMessage("壺を修理した");
      return;
    }
    const isRecipePair = (a === "recipe1" && b === "recipe2") || (a === "recipe2" && b === "recipe1");
    if (isRecipePair) {
      clearUsingItem(true);
      showModal("レシピの切れ端を組み合わせますか？", "", [
        {
          text: "はい",
          action: () => {
            closeModal();
            removeItem("recipe1");
            removeItem("recipe2");
            addItem("recipeFixed");
            updateMessage("レシピを組み合わせた");
          },
        },
        { text: "いいえ", action: "close" },
      ]);
      return;
    }
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
    ruler: "定規",
    driver: "ドライバー",
    board: "駅名の板",
    operaGlass: "双眼鏡",
    letter: "手紙",
    rosenzu: "路線図",
  };
  return names[itemId] || itemId;
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
  gameState.openRooms.forEach((roomId) => {
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
  const slots = document.querySelectorAll(".inventory-slot");
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  const mobileFilledSlotMinSize = "56px";
  slots.forEach((slot, index) => {
    slot.innerHTML = "";
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

        const itemId = gameState.inventory[index];
        const itemBaseSrc = IMAGES.items[itemId] || img.src;
        const itemEnSrc = IMAGES.items[`${itemId}En`];
        const hasEnVariant = !!itemEnSrc;

        // デフォの中身
        let content = `<img src="${itemBaseSrc}" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`;
        let buttons = [{ text: "閉じる", action: "close" }];

        if (itemId === "sheet") {
          const f = gameState.main.flags || {};
          const stampState = f.sheetStamps || {};
          const hasBrownStamp = !!(stampState.stampBrown || stampState.stampMomiji);
          const sheetLayers = [IMAGES.items.sheet, stampState.stampViolet ? IMAGES.items.stampViolet : null, stampState.stampGreen ? IMAGES.items.stampGreen : null, hasBrownStamp ? IMAGES.items.stampBrownBase : null, hasBrownStamp ? IMAGES.items.stampBrown1 : null].filter(Boolean);

          content = `
            <div style="position:relative;max-width:380px;width:min(380px, 100%);margin:0 auto 16px;">
              ${sheetLayers
                .map(
                  (src, layerIndex) => `
                    <img src="${src}" style="
                      display:block;
                      width:100%;
                      height:auto;
                      ${layerIndex === 0 ? "position:relative;" : "position:absolute;inset:0;"}
                      object-fit:contain;
                      pointer-events:none;
                    ">
                  `,
                )
                .join("")}
            </div>
          `;
        }

        if (itemId === "sheetComplete3") {
          buttons = [
            {
              text: "よく見る",
              action: () => {
                window._nextModal = {
                  title: getItemName(itemId),
                  content: `<img src="${IMAGES.modals.sheetZoom}" style="max-width:380px;max-height:80vh;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`,
                  buttons: [{ text: "閉じる", action: "close" }],
                };
                closeModal();
              },
            },
            { text: "閉じる", action: "close" },
          ];
        }

        if (hasEnVariant && itemId !== "sheet" && itemId !== "sheetComplete3") {
          const zoomImgId = `invZoom_${Date.now()}_${index}`;
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
            { text: "閉じる", action: "close" },
          ];
        }

        showModal(getItemName(itemId), content, buttons);
      };
      slot.appendChild(magBtn);
    } else {
      slot.style.minWidth = "";
      slot.style.minHeight = "";
    }
    // ★選択中ならselectedクラス追加
    if (gameState.selectedItemSlot === index) {
      slot.classList.add("selected");
    } else {
      slot.classList.remove("selected");
    }
  });
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

function playMomijiLeafEffect() {
  if (typeof document === "undefined" || !document.body) return;

  if (!document.getElementById("momijiFxStyle")) {
    const style = document.createElement("style");
    style.id = "momijiFxStyle";
    style.textContent = `
      .momiji-fx-layer{
        position:fixed;
        inset:0;
        pointer-events:none;
        overflow:hidden;
        z-index:10010;
      }
      .momiji-fx-leaf{
        position:absolute;
        top:-12vh;
        left:0;
        font-size:clamp(18px, 3vw, 34px);
        line-height:1;
        opacity:0;
        filter:drop-shadow(0 2px 2px rgba(50,20,0,0.18));
        animation-name:momiji-fall, momiji-sway, momiji-spin, momiji-fade;
        animation-timing-function:linear, ease-in-out, ease-in-out, linear;
        animation-fill-mode:forwards, both, both, forwards;
      }
      @keyframes momiji-fall { from { transform: translateY(-8vh); } to { transform: translateY(118vh); } }
      @keyframes momiji-sway { 0% { margin-left:-10px; } 50% { margin-left:12px; } 100% { margin-left:-8px; } }
      @keyframes momiji-spin { 0% { rotate:0deg; } 50% { rotate:140deg; } 100% { rotate:320deg; } }
      @keyframes momiji-fade { 0% { opacity:0; } 8% { opacity:.95; } 90% { opacity:.9; } 100% { opacity:0; } }
    `;
    document.head.appendChild(style);
  }

  const layer = document.createElement("div");
  layer.className = "momiji-fx-layer";
  document.body.appendChild(layer);

  const reduceMotion = !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const count = reduceMotion ? 8 : 20;
  let cleanupMs = 0;
  const symbols = ["&#x1F341;", "&#x1F342;"];

  for (let i = 0; i < count; i++) {
    const leaf = document.createElement("span");
    leaf.className = "momiji-fx-leaf";
    leaf.innerHTML = symbols[Math.random() < 0.8 ? 0 : 1];

    const left = Math.random() * 100;
    const delay = Math.random() * (reduceMotion ? 0.3 : 0.8);
    const fallDur = (reduceMotion ? 0.9 : 1.4) + Math.random() * (reduceMotion ? 0.5 : 1.0);
    const swayDur = 0.8 + Math.random() * 0.9;
    const spinDur = 0.9 + Math.random() * 1.1;
    leaf.style.left = `${left}vw`;
    leaf.style.fontSize = `${16 + Math.random() * 24}px`;
    leaf.style.animationDuration = `${fallDur}s, ${swayDur}s, ${spinDur}s, ${fallDur}s`;
    leaf.style.animationDelay = `${delay}s, ${delay}s, ${delay}s, ${delay}s`;
    leaf.style.color = ["#d8471d", "#b62f18", "#e08d1f", "#c96a17"][Math.floor(Math.random() * 4)];
    cleanupMs = Math.max(cleanupMs, Math.ceil((delay + fallDur) * 1000) + 120);

    layer.appendChild(leaf);
  }

  setTimeout(() => {
    layer.remove();
  }, cleanupMs || 2400);
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
function stopSE(id) {
  const se = document.getElementById(id);
  se.pause();
}

// どこかで最初に一度だけ呼ぶ
let loadedImages = {};
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
  el.textContent = text;
  el.style.opacity = "1";
  el.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(-8px)";
  }, ms);
}

window.addEventListener("resize", () => renderNavigation());

window.addEventListener("keydown", (e) => {
  if (e.key === "F2") {
    DEV_MODE = !DEV_MODE;
    renderCanvasRoom();
  }
});

// ゲーム開始
preloadImages();
initGame();
