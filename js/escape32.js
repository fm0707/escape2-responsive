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
const BASE_32 = USE_LOCAL_ASSETS ? "images/32" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/32";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I32 = (file) => `${BASE_32}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
// ゲーム設定 - 画像パスをここで管理
let IMAGES = {
  rooms: {
    mainBoard: [I32("main_board.webp")],
    mainWindow: [I32("main_window.webp")],
    mainShelf: [I32("main_shelf.webp")],
    mainDoor: [I32("main_door.webp")],
    lockerInnerRightTop: [I32("locker_inner.webp")],
    lockerInnerCenterTop: [I32("locker_inner.webp")],

    end: [I32("end.webp"), I32("end2.webp")],
    trueEnd: [I32("true_end.webp"), I32("true_end2.webp"), I32("true_end3.webp")],
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
    bearSleep: I32("bear_sleep.webp"),
    curtain: I32("curtain.webp"),
    rod: I32("rod.webp"),
    curtainRod: I32("curtain_rod.webp"),
    curtainSet: I32("curtain_set.webp"),
    gyozaCover: I32("gyoza_cover.webp"),
    clockCover: I32("clock_cover.webp"),
    dish: I32("dish.webp"),
    step: I32("step.webp"),
    splayBottle: I32("splay_bottle.webp"),
    splayBottleWithWater: I32("splay_bottle_water.webp"),
    memoMori: I32("memo_mori.webp"),
    memoMoriEn: I32("memo_mori_en.webp"),
    watchOrange: I32("watch_orange.webp"),
    oil: I32("oil.webp"),
    gyozaRaw: I32("gyoza_raw.webp"),
    gyozaUndercooked: I32("gyoza_undercooked.webp"),
    gyozaPerfect: I32("gyoza_perfect.webp"),
    gyozaOvercooked: I32("gyoza_overcooked.webp"),
    gyozaBurnt: I32("gyoza_burnt.webp"),
    memoGyoza: I32("memo_gyoza.webp"),
    mirror: I32("mirror.webp"),
    mirrorPut: I32("mirror_put.webp"),
    driver: I32("driver.webp"),
    timetable: I32("timetable.webp"),
    classJournal: I32("class_journal.webp"),
    sauce: I32("sauce.webp"),
    hagaki: I32("hagaki.webp"),
  },

  modals: {
    posterPlay: I32("modal_poster_play.webp"),
    picDry: I32("modal_pic_dry.webp"),
    picGrill: I32("modal_pic_grill.webp"),
    book: I32("modal_book.webp"),
    gyoza: I32("modal_gyoza.webp"),
    gyozaKawa: I32("modal_gyoza_kawa.webp"),
    clockRed: I32("modal_clock_red.webp"),
    clockBlue: I32("modal_clock_blue.webp"),
    clockYellow: I32("modal_clock_yellow.webp"),
    schedule: I32("modal_schedule.webp"),
    pourWater: I32("modal_pour_water.webp"),
    badend: I32("badend.webp"),
    flower: I32("modal_flower.webp"),
    flowerZoom: I32("modal_flower_zoom.webp"),
    bearGRaw: I32("bear_g_raw.webp"),
    bearGUndercooked: I32("bear_g_undercooked.webp"),
    bearGPerfect: I32("bear_g_perfect.webp"),
    bearGOvercooked: I32("bear_g_overcooked.webp"),
    bearGBurnt: I32("bear_g_burnt.webp"),
    bearSauce: I32("modal_bear_sauce.webp"),
    bearDoor: I32("modal_bear_door.webp"),
    bearHope: I32("modal_bear_hope.webp"),
    mirrorBack: I32("mirror_back.webp"),
    putMirrorClosed: I32("modal_put_mirror_closed.webp"),
    putMirrorOpened: I32("modal_put_mirror_opened.webp"),
    nob: I32("modal_nob.webp"),
    nobDriver: I32("modal_nob_driver.webp"),
    nobHole: I32("modal_nob_hole.webp"),
    nobMirror: I32("modal_nob_mirror.webp"),
    nobClock: I32("modal_mirror_clock.webp"),
    bearWater: I32("modal_bear_splay.webp"),
    bearSplay: I32("modal_bear_splay.webp"),
    bearWind: I32("modal_bear_wind.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState32";
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
    currentRoom: "mainBoard",
    openRooms: ["mainBoard"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        unlockWindowRightVabinet: false,
        unlockShelfLeftCabinetMiddle: false,
        unlockShelfLeftCabinetBottom: false,
        unlockLockerLeftTop: false,
        unlockLockerLeftBottom: false,
        unlockLockerCenterTop: false,
        unlockLockerRightTop: false,
        unlockLockerRightBottom: false,
        unlockShelfLeftCabinetTop: false,
        putStep: false,
        removedPrepDoorKnob: false,
        bearSprayedCount: 0,
        unlockSafe: false,
        gyozaGrilled: false,
        gyozaWet: false,
        gyozaKawaWet: false,

        isCurtainClosed: false,
        isNight: false,

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
  mainBoard: {
    name: "家庭科室の黒板側",
    description: "",
    clickableAreas: [
      {
        x: 60.4,
        y: 13.6,
        width: 9.9,
        height: 9.1,
        onClick: clickWrap(function () {
          showObj(null, "赤い針の時計だ。3時5分を指している", IMAGES.modals.clockRed, "赤い針の時計だ。3時5分を指している");
        }),
        description: "赤い針の時計",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 46.6,
        y: 12.0,
        width: 12.8,
        height: 12.5,
        onClick: clickWrap(function () {
          showObj(null, "授業のスケジュールだ", IMAGES.modals.schedule, "授業のスケジュールだ");
        }),
        description: "説明",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 74.0,
        y: 51.5,
        width: 3.7,
        height: 4.1,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.removedPrepDoorKnob) {
            if (gameState.selectedItem === "mirror") {
              window._nextModal = {
                title: "ドアノブ",
                content: `<img src="${IMAGES.modals.nobClock}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;"><div style="text-align:center;">緑の針の時計が、12:05を指している</div>`,
                buttons: [{ text: "閉じる", action: "close" }],
              };
              showModal("ドアノブ", `<img src="${IMAGES.modals.nobMirror}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;"><div style="text-align:center;">手鏡を差し入れてみた</div>`, [{ text: "次へ", action: "close" }]);
              updateMessage("手鏡を差し入れてみた");
              return;
            }
            showObj(null, "", IMAGES.modals.nobHole, "穴から覗いてみた。暗くてよく見えない");
            return;
          }
          if (gameState.selectedItem === "driver") {
            f.removedPrepDoorKnob = true;
            showModal(
              "ドアノブ",
              `
                <div class="modal-anim">
                  <img src="${IMAGES.modals.nobDriver}">
                  <img src="${IMAGES.modals.nobHole}">
                </div>
                <div style="text-align:center;">ドライバーでドアノブを外した</div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            updateMessage("ドライバーでドアノブを外した");
            return;
          }
          showObj(null, "", IMAGES.modals.nob, "ドアのノブだ");
        }),
        description: "準備室のドアノブ",
        zIndex: 5,
        usable: () => true,
        item: { img: "blackBack", visible: () => gameState.main.flags.removedPrepDoorKnob },
      },
      {
        x: 73.4,
        y: 28.0,
        width: 19.4,
        height: 33.6,
        onClick: clickWrap(function () {
          updateMessage("開かない");
        }),
        description: "準備室のドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 60.6,
        y: 28.1,
        width: 5.2,
        height: 15.5,
        onClick: clickWrap(function () {
          updateMessage("平成9年9月30日と書いてある");
        }),
        description: "黒板の日付",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 16.4,
        y: 27.2,
        width: 43.8,
        height: 5.0,
        onClick: clickWrap(function () {
          updateMessage("「餃子を作ってお別れ会をしよう」と書いてある");
        }),
        description: "お別れ会をしようの文字",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 23.2,
        y: 33.4,
        width: 36.5,
        height: 17.8,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.picGrill, "餃子の作り方が書いてある");
        }),
        description: "ギョーザ作り方の絵",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 60.9,
        y: 44.4,
        width: 4.9,
        height: 8.8,
        onClick: clickWrap(function () {
          updateMessage("当番はDoiさんらしい");
        }),
        description: "日直",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 3.2,
        y: 36.3,
        width: 15.0,
        height: 6.7,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.picDry, "乾いた餃子には、水を掛けると良いらしい");
        }),
        description: "黒板のドライの絵",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 45.1,
        y: 58.2,
        width: 17.2,
        height: 7.1,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.gyozaGrilled) {
            updateMessage("もう餃子は焼き終えている");
            return;
          }
          if (hasItem("oil") && hasItem("dish") && f.gyozaWet && f.foundMemoGyoza) {
            showModal("確認", "餃子を焼きますか？", [
              { text: "はい", action: () => showGyozaMiniGame() },
              { text: "いいえ", action: "close" },
            ]);
            return;
          }
          if (f.gyozaWet && !f.foundMemoGyoza) {
            updateMessage("餃子の様子をもう少し見ておこう");
            return;
          }
          if (!f.gyozaWet) {
            updateMessage("餃子が乾いているから焼けない");
            return;
          }
          if (!hasItem("oil") || !hasItem("dish")) {
            updateMessage("油と皿があれば餃子を焼けそうだ");
            return;
          }
          updateMessage("フライパンがある");
        }),
        description: "フライパン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 53.5,
        y: 71.6,
        width: 22.1,
        height: 10.7,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.gyozaGrilled) {
            updateMessage("もう餃子は無い");
            return;
          }
          if (gameState.selectedItem === "splayBottleWithWater") {
            if (f.gyozaWet) {
              updateMessage("すでに水を吹きかけてある");
              return;
            }
            f.gyozaWet = true;
            playSE?.("se-kirifuki");
            showWaterSprayModal("餃子に水を吹きかけた");
            updateMessage("餃子に水を吹きかけた");
            return;
          }
          if (f.gyozaWet) {
            if (!f.foundMemoGyoza) {
              showModal("餃子", `<img src="${IMAGES.modals.gyoza}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [
                {
                  text: "閉じる",
                  action: () => {
                    closeModal();
                    f.foundMemoGyoza = true;
                    addItem("memoGyoza");
                    showToast("念のため餃子をスケッチした");
                    updateMessage("メモを手に入れた");
                  },
                },
              ]);
              return;
            }
            showObj(null, "餃子はしっとりしている", IMAGES.modals.gyoza, "餃子はしっとりしている");
            return;
          }
          updateMessage("乾燥した餃子がある");
        }),
        description: "餃子",
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
        description: "餃子カバー",
        zIndex: 5,
        usable: () => false,
        item: { img: "gyozaCover", visible: () => gameState.main.flags.gyozaGrilled },
      },
      {
        x: 76.5,
        y: 75.3,
        width: 11.8,
        height: 5.7,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "splayBottleWithWater") {
            if (f.gyozaKawaWet) {
              updateMessage("すでに水を吹きかけてある");
              return;
            }
            f.gyozaKawaWet = true;
            playSE?.("se-kirifuki");
            showWaterSprayModal("餃子の皮に水を吹きかけた");
            updateMessage("餃子の皮に水を吹きかけた");
            return;
          }
          if (f.gyozaKawaWet) {
            showObj(null, "", IMAGES.modals.gyozaKawa, "餃子の皮に水を吹きかけた");
            return;
          }
          updateMessage("餃子の皮がある。乾燥しきっている");
        }),
        description: "餃子の皮",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 28.0,
        y: 13.2,
        width: 11.6,
        height: 9.2,
        onClick: clickWrap(function () {
          updateMessage("スピーカーだ");
        }),
        description: "スピーカー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 77.0,
        y: 19.8,
        width: 12.6,
        height: 4.7,
        onClick: clickWrap(function () {
          updateMessage("準備室の表示だ");
        }),
        description: "準備室の札",
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
            changeRoom("mainWindow");
          },
          { allowAtNight: true },
        ),
        description: "黒板、左",
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
            changeRoom("mainShelf");
          },
          { allowAtNight: true },
        ),
        description: "黒板、右",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  mainWindow: {
    name: "家庭科室の窓側",
    description: "",
    clickableAreas: [
      {
        x: 78.9,
        y: 0.1,
        width: 14.1,
        height: 11.3,
        onClick: clickWrap(function () {
          showObj(null, "黄色い針の時計だ。2時15分を指している", IMAGES.modals.clockYellow, "黄色い針の時計だ。2時15分を指している");
        }),
        description: "黄色い針の時計",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 78.4,
        y: 13.8,
        width: 16.0,
        height: 23.8,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterPlay, "餃子が描かれたポスターだ");
        }),
        description: "プレイポスター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 78.7,
        y: 42.3,
        width: 6.7,
        height: 8.3,
        onClick: clickWrap(function () {
          updateMessage("「時計をよく見て、授業時間を守ろうね」と書いてある");
        }),
        description: "お知らせ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 70.0,
        y: 58.1,
        width: 19.8,
        height: 14.5,
        onClick: clickWrap(function () {
          updateMessage("食器を洗う道具がある");
        }),
        description: "食器を洗う道具",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 6.1,
        y: 6.3,
        width: 60.2,
        height: 50.7,
        onClick: clickWrap(function () {
          updateMessage("窓は開かない。外の景色が見える");
        }),
        description: "窓",
        zIndex: 2,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.4,
        y: 3.4,
        width: 2.7,
        height: 3.3,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "curtainRod") {
            if (f.isCurtainClosed) {
              updateMessage("すでにカーテンが設置されている");
              return;
            }
            f.isCurtainClosed = true;
            removeItem("curtainRod");
            renderCanvasRoom();
            updateMessage("カーテンを設置した");
            return;
          }
          if (f.isCurtainClosed) {
            updateMessage("カーテンが設置されている");
            return;
          }
          updateMessage("フックがある。突っ張り棒などを通せそうだ");
        }),
        description: "フック左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 68.0,
        y: 4.0,
        width: 2.3,
        height: 2.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "curtainRod") {
            if (f.isCurtainClosed) {
              updateMessage("すでにカーテンが設置されている");
              return;
            }
            f.isCurtainClosed = true;
            removeItem("curtainRod");
            renderCanvasRoom();
            updateMessage("カーテンを設置した");
            return;
          }
          if (f.isCurtainClosed) {
            updateMessage("カーテンが設置されている");
            return;
          }
          updateMessage("フックがある。突っ張り棒などを通せそうだ");
        }),
        description: "フック右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: -0.6,
        y: 3.0,
        width: 73.7,
        height: 25.6,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.isCurtainClosed) return;
          showModal("確認", "カーテンを取り外しますか？", [
            {
              text: "はい",
              action: () => {
                closeModal();
                f.isCurtainClosed = false;
                addItem("curtainRod");
                renderCanvasRoom();
                updateMessage("カーテンを取り外した");
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "設置したカーテン",
        zIndex: 5,
        usable: () => gameState.main.flags.isCurtainClosed,
        item: { img: "curtainSet", visible: () => gameState.main.flags.isCurtainClosed },
      },
      {
        x: 47.9,
        y: 59.9,
        width: 6.5,
        height: 9.4,
        onClick: clickWrap(function () {
          showRightTapDripModal();
        }),
        description: "蛇口右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 31.8,
        y: 59.5,
        width: 5.3,
        height: 9.0,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "splayBottle") {
            removeItem("splayBottle");
            addItem("splayBottleWithWater");
            playSE?.("se-jaguchi");
            showModal("水を霧吹きに入れた", `<img src="${IMAGES.modals.pourWater}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
            updateMessage("水を霧吹きに入れた");
            return;
          }
          playSE?.("se-jaguchi");
          showLeftTapWaterModal();
        }),
        description: "蛇口左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 72.3,
        y: 84.0,
        width: 12.6,
        height: 14.4,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockWindowRightVabinet) {
            playWindowRightCabinetSlideFx("窓側下、右戸棚", () => {
              acquireItemOnce("foundSplayBottle", "splayBottle", "霧吹きがある", IMAGES.items.splayBottle, "霧吹きを手に入れた");
            });
            return;
          }
          showWindowRightCabinetPuzzle();
        }),
        description: "窓側下、右戸棚",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0.6,
        y: 84.2,
        width: 14.5,
        height: 14.5,
        onClick: clickWrap(function () {
          playWindowLeftCabinetSlideFx("窓側下、左戸棚", () => {
            updateMessage("何もない");
          });
        }),
        description: "窓側下、左戸棚",
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
            changeRoom("mainDoor");
          },
          { allowAtNight: true },
        ),
        description: "窓、左",
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
            changeRoom("mainBoard");
          },
          { allowAtNight: true },
        ),
        description: "窓、右",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  mainDoor: {
    name: "家庭科室のドア側",
    description: "",
    clickableAreas: [
      {
        x: 19.6,
        y: 75.9,
        width: 23.3,
        height: 21.2,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "splayBottleWithWater") {
            f.bearSprayedCount = Number(f.bearSprayedCount || 0) + 1;
            if (f.bearSprayedCount === 1) {
              playSE("se-kirifuki");
              showModal("クマ妖精", `<img src="${IMAGES.modals.bearSplay}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;"><div style="text-align:center;">む…むず…</div>`, [{ text: "閉じる", action: "close" }]);
              updateMessage("む…むず…");
              return;
            }
            playSE("se-kirifuki");
            pauseBGM();
            playSE("se-kushami");
            playSE("se-fire");
            showModal("【BAD END】クマ妖精のくしゃみ", `<div style="text-align:center;"><img src="${IMAGES.modals.bearWind}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;"><div>あなたはクマ妖精のくしゃみの風圧で吹き飛ばされ、気を失った</div></div>`, [
              { text: "最初から", action: "restart" },
            ]);
            return;
          }
          updateMessage("「むにゃ…」クマ妖精は眠っている");
        }),
        description: "寝ているクマ妖精",
        zIndex: 5,
        usable: () => !gameState.main.flags.gyozaGrilled,
        item: { img: "bearSleep", visible: () => !gameState.main.flags.gyozaGrilled },
      },
      {
        x: 21.7,
        y: 71.1,
        width: 26.0,
        height: 26.9,
        onClick: clickWrap(function () {
          triggerBearGyozaEnding();
        }),
        description: "立っているクマ",
        zIndex: 5,
        usable: () => gameState.main.flags.gyozaGrilled,
        item: { img: "bear", visible: () => gameState.main.flags.gyozaGrilled },
      },
      {
        x: 13.2,
        y: 19.2,
        width: 33.3,
        height: 74.2,
        onClick: clickWrap(function () {
          updateMessage("クマ妖精がドアをふさいでいる");
        }),
        description: "ドア",
        zIndex: 4,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 51.0,
        y: 71.6,
        width: 9.8,
        height: 24.5,
        onClick: clickWrap(function () {
          updateMessage("ただの消火器のようだ");
        }),
        description: "消火器",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0.6,
        y: 43.2,
        width: 5.3,
        height: 8.0,
        onClick: clickWrap(function () {
          updateMessage("スイッチは反応しない");
        }),
        description: "スイッチ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 14.1,
        y: 0.4,
        width: 13.7,
        height: 8.5,
        onClick: clickWrap(function () {
          updateMessage("「月曜日は赤、火曜日はオレンジ、水曜日は緑、木曜日は黄色、金曜日は青」と書いてある");
        }),
        description: "貼り紙",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 62.4,
        y: 19.8,
        width: 10.8,
        height: 36.6,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockLockerLeftTop) {
            playLockerDoorOpenFx("ロッカー左上", () => {
              acquireItemOnce("foundRod", "rod", "突っ張り棒がある", IMAGES.items.rod, "突っ張り棒を手に入れた");
            });
            return;
          }
          showLockerLeftTopClockPuzzle();
        }),
        description: "ロッカー左上",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.4,
        y: 19.8,
        width: 10.4,
        height: 36.7,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockLockerCenterTop) {
            openLockerCenterTopInterior();
            return;
          }
          showLockerCenterTopPuzzle();
        }),
        description: "ロッカー中上",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 87.9,
        y: 20.1,
        width: 10.6,
        height: 36.4,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockLockerRightTop) {
            openLockerRightTopInterior();
            return;
          }
          showLockerRightTopPuzzle();
        }),
        description: "ロッカー右上",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 62.7,
        y: 58.4,
        width: 10.4,
        height: 34.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockLockerLeftBottom) {
            playLockerDoorOpenFx("ロッカー左下", () => {
              acquireItemOnce("foundWatchOrange", "watchOrange", "オレンジの時計がある", IMAGES.items.watchOrange, "オレンジの時計を手に入れた");
            });
            return;
          }
          showLockerLeftBottomPuzzle();
        }),
        description: "ロッカー左下",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.0,
        y: 58.4,
        width: 10.9,
        height: 35.3,
        onClick: clickWrap(function () {
          playLockerDoorOpenFx("ロッカー中下", () => {
            acquireItemOnce("foundStep", "step", "踏み台がある", IMAGES.items.step, "踏み台を手に入れた");
          });
        }),
        description: "ロッカー中下",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 87.7,
        y: 58.5,
        width: 10.8,
        height: 34.8,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockLockerRightBottom) {
            updateMessage("開かない");
            return;
          }
          playLockerDoorOpenFx("ロッカー右下", () => {
            acquireItemOnce("foundOil", "oil", "オイルがある", IMAGES.items.oil, "オイルを手に入れた");
          });
        }),
        description: "ロッカー右下",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 90.0,
        y: 69.7,
        width: 6.3,
        height: 6.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "watchOrange") {
            if (f.unlockLockerRightBottom) {
              updateMessage("すでにアンロックされている");
              return;
            }
            showInfraredUnlockModal(() => {
              f.unlockLockerRightBottom = true;
              renderCanvasRoom?.();
              markProgress?.("unlock_locker_right_bottom");
              updateMessage("ロッカー右下のロックが外れた。");
            });
            return;
          }
          updateMessage("赤外線受信マークが付いている");
        }),
        description: "ロッカー右下の赤外線受信部",
        zIndex: 6,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 55.8,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainShelf");
          },
          { allowAtNight: true },
        ),
        description: "ドア、左",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 54.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainWindow");
          },
          { allowAtNight: true },
        ),
        description: "ドア、右",
        zIndex: 9,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  mainShelf: {
    name: "家庭科室の棚",
    description: "",
    clickableAreas: [
      {
        x: 80.9,
        y: 6.2,
        width: 10.2,
        height: 12.2,
        onClick: clickWrap(function () {
          updateMessage("植物が置いてある");
        }),
        description: "植物",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 59.8,
        y: 4.0,
        width: 11.7,
        height: 11.8,
        onClick: clickWrap(function () {
          if (gameState.main.flags.isCurtainClosed) {
            showObj(null, "青い針の時計だ。9時5分を指している", IMAGES.modals.clockBlue, "青い針の時計だ。9時5分を指している");
            return;
          }
          updateMessage("時計がある。光が当たっていて読み取れない");
        }),
        description: "青い針の時計",
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
        description: "時計に当たる光",
        zIndex: 5,
        usable: () => false,
        item: { img: "clockCover", visible: () => !gameState.main.flags.isCurtainClosed },
      },
      {
        x: 43.6,
        y: 35.4,
        width: 10.0,
        height: 8.9,
        onClick: clickWrap(function () {
          showObj(null, "本が並んでいる", IMAGES.modals.book, "本が並んでいる");
        }),
        description: "本",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 16.0,
        y: 46.4,
        width: 37.5,
        height: 44.1,
        onClick: clickWrap(function () {
          updateMessage("授業に使う道具が並んでいる");
        }),
        description: "調理器具左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 56.3,
        y: 36.3,
        width: 38.2,
        height: 18.5,
        onClick: clickWrap(function () {
          updateMessage("授業に使うボウルやバットが並んでいる");
        }),
        description: "調理器具右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 83.0,
        y: 62.3,
        width: 11.7,
        height: 5.6,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.putMirror) {
            const isClosed = !!f.isCurtainClosed;
            const mirrorImg = isClosed ? IMAGES.modals.putMirrorClosed : IMAGES.modals.putMirrorOpened;
            const mirrorText = isClosed ? "何かがぼんやり写っている。もう少し明るければ…" : "何かが映っている";
            showModal("手鏡", `<img src="${mirrorImg}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;"><div style="text-align:center;">${mirrorText}</div>`, [
              {
                text: "手鏡を取る",
                action: () => {
                  addItem("mirror");
                  f.putMirror = false;
                  closeModal();
                  renderCanvasRoom();
                  updateMessage("手鏡を取った");
                },
              },
              { text: "閉じる", action: "close" },
            ]);
            return;
          }
          if (gameState.selectedItem === "mirror") {
            f.putMirror = true;
            removeItem("mirror");
            updateMessage("手鏡を置いた");
            renderCanvasRoom();
            return;
          }
          updateMessage("何か置けそうな台だ");
        }),
        description: "鏡の台",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 84.2,
        y: 56.5,
        width: 9.1,
        height: 9.4,
        onClick: clickWrap(function () {}),
        description: "置いた手鏡",
        zIndex: 5,
        usable: () => false,
        item: { img: "mirrorPut", visible: () => gameState.main.flags.putMirror },
      },
      {
        x: 56.3,
        y: 69.7,
        width: 9.8,
        height: 9.1,
        onClick: clickWrap(function () {
          acquireItemOnce("foundDish", "dish", "お皿がある", IMAGES.items.dish, "お皿を手に入れた");
        }),
        description: "重ねられたお皿",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 72.9,
        y: 19.7,
        width: 22.4,
        height: 12.4,
        onClick: clickWrap(function () {
          if (!gameState.main.flags.putStep) {
            updateMessage("手が届かない");
            return;
          }
          playShelfCabinetDoorOpenFx("棚の上のキャビネット", () => {
            acquireItemOnce("foundCurtain", "curtain", "カーテンがある", IMAGES.items.curtain, "カーテンを手に入れた");
          });
        }),
        description: "棚の上のキャビネット",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 76.9,
        y: 84.1,
        width: 20.2,
        height: 14.9,
        onClick: clickWrap(function () {
          if (f.putStep) {
            updateMessage("踏み台が置いてある");
            return;
          }
          updateMessage("踏み台を置けそうだ");
        }),
        description: "踏み台置き場",
        zIndex: 5,
        usable: () => false,
        item: { img: "step", visible: () => gameState.main.flags.putStep },
      },
      {
        x: 79.5,
        y: 95.9,
        width: 17.4,
        height: 4.0,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "step") {
            if (f.putStep) {
              updateMessage("すでに踏み台が置いてある");
              return;
            }
            f.putStep = true;
            removeItem("step");
            updateMessage("踏み台を置いた");
            renderCanvasRoom();
            return;
          }
          updateMessage("何かが置いてあったような跡だ");
        }),
        description: "踏み台の跡",
        zIndex: 5,
        usable: () => !gameState.main.flags.putStep,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0.6,
        y: 48.4,
        width: 11.4,
        height: 12.5,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockShelfLeftCabinetTop) {
            playShelfCabinetDoorOpenFx("棚左キャビネット上段", () => {
              acquireShelfLeftCabinetTopItems();
            });
            return;
          }
          showShelfLeftCabinetTopPuzzle();
        }),
        description: "棚左キャビネット上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.0,
        y: 63.1,
        width: 10.9,
        height: 12.5,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockShelfLeftCabinetMiddle) {
            playShelfCabinetDoorOpenFx("棚左キャビネット中段", () => {
              acquireItemOnce("foundMemoMori", "memoMori", "メモがある", IMAGES.items.memoMori, "メモを手に入れた");
            });
            return;
          }
          showShelfLeftCabinetMiddlePuzzle();
        }),
        description: "棚左キャビネット中段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0.9,
        y: 77.5,
        width: 10.9,
        height: 12.4,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockShelfLeftCabinetBottom) {
            showShelfLeftCabinetBottomPuzzle();
            return;
          }
          playShelfCabinetDoorOpenFx("棚左キャビネット下段", () => {
            acquireItemOnce("foundDriver", "driver", "ドライバーがある", IMAGES.items.driver, "ドライバーを手に入れた");
          });
        }),
        description: "棚左キャビネット下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 40.8,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("mainBoard");
          },
          { allowAtNight: true },
        ),
        description: "棚、左",
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
        description: "棚、右",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
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

  lockerInnerRightTop: {
    name: "右上ロッカー内部",
    description: "",
    clickableAreas: [
      {
        x: 52.6,
        y: 73.5,
        width: 22.1,
        height: 22.8,
        onClick: clickWrap(function () {
          showLockerRightTopJournal();
        }),
        description: "学級日誌",
        zIndex: 5,
        usable: () => true,
        item: { img: "classJournal", visible: () => true },
      },
      {
        x: 29.9,
        y: 80.5,
        width: 17.4,
        height: 18.3,
        onClick: clickWrap(function () {
          acquireItemOnce("foundMirror", "mirror", "手鏡がある", IMAGES.items.mirror, "手鏡を手に入れた");
        }),
        description: "手鏡",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundMirror,
        item: { img: "mirror", visible: () => !gameState.main.flags.foundMirror },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            closeLockerRightTopInterior();
          },
          { allowAtNight: true },
        ),
        description: "右上ロッカー戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  lockerInnerCenterTop: {
    name: "中上ロッカー内部",
    description: "",
    clickableAreas: [
      {
        x: 35.2,
        y: 60.4,
        width: 19.8,
        height: 21.8,
        onClick: clickWrap(function () {
          acquireItemOnce("foundSauce", "sauce", "餃子のたれがある", IMAGES.items.sauce, "餃子のたれを手に入れた");
        }),
        description: "餃子のたれ",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundSauce,
        item: { img: "sauce", visible: () => !gameState.main.flags.foundSauce },
      },
      {
        x: 56.2,
        y: 83.6,
        width: 20.1,
        height: 9.9,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.items.hagaki, "移転のお知らせのはがきだ");
        }),
        description: "はがき",
        zIndex: 5,
        usable: () => true,
        item: { img: "hagaki", visible: () => true },
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
        description: "中上ロッカー戻る",
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
    description: "不思議な家庭科室から脱出できました。おめでとうございます！",
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
    description: "餃子でピクニックです。脱出おめでとうございます！",
    clickableAreas: [
      {
        x: 24.4,
        y: 18.6,
        width: 38.9,
        height: 30.4,
        onClick: clickWrap(function () {
          updateMessage("嬉しそうだ");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 18.0,
        y: 19.6,
        width: 41.0,
        height: 39.1,
        onClick: clickWrap(function () {
          updateMessage("満足そうだ");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 20.2,
        y: 19.1,
        width: 42.7,
        height: 38.2,
        onClick: clickWrap(function () {
          updateMessage("神妙な顔つきだ");
        }),
        description: "クマ妖精",
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
  changeRoom("mainBoard");
  updateMessage("気が付くと家庭科室に、立ち尽くしていた。");
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
    changeBGM("sounds/32/amanogawa.mp3");
  } else if (roomId === "end") {
    changeBGM("sounds/32/Restart.mp3");
  } else {
    changeBGM("sounds/32/haruno_otozure.mp3");
  }

  // nav
  // if (roomId === "home" || roomId === "masterRoom") {
  //   addNaviItem(roomId);
  //   renderNavigation();
  // }
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

  if (roomId === "end") {
    const f = gameState.main.flags || (gameState.main.flags = {});
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
  drawLockerDoorFx(ctx, canvas, roomId);
  drawShelfCabinetDoorFx(ctx, canvas, roomId);
  drawWindowRightCabinetSlideFx(ctx, canvas, roomId);
  drawWindowLeftCabinetSlideFx(ctx, canvas, roomId);

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

function drawLockerDoorFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.lockerDoorOpen;
  if (!fx || fx.roomId !== roomId) return;

  const rect = getAreaRectPx(roomId, fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, fx.progress || 0));
  const openEase = Math.sin(t * Math.PI);
  const visibleRatio = Math.max(0.08, 1 - openEase * 0.92);
  const panelW = rect.w * visibleRatio;
  const panelX = rect.x + rect.w - panelW;
  const hingeW = Math.max(3, rect.w * 0.05);
  const shadowW = rect.w * 0.22 * openEase;
  const handleR = Math.max(3, Math.min(rect.w, rect.h) * 0.06);
  const woodBase = ctx.createLinearGradient(panelX, rect.y, panelX + panelW, rect.y);
  woodBase.addColorStop(0, "rgb(104, 70, 49)");
  woodBase.addColorStop(0.45, "rgb(128, 87, 62)");
  woodBase.addColorStop(1, "rgb(88, 60, 43)");

  ctx.save();

  if (openEase > 0.02) {
    const cavity = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y);
    cavity.addColorStop(0, "rgba(8, 4, 2, 0.98)");
    cavity.addColorStop(0.55, "rgba(16, 9, 5, 0.94)");
    cavity.addColorStop(1, "rgba(26, 14, 8, 0.88)");
    ctx.fillStyle = cavity;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(rect.x + rect.w - shadowW, rect.y, shadowW, rect.h);
  }

  ctx.fillStyle = woodBase;
  ctx.fillRect(panelX, rect.y, panelW, rect.h);

  ctx.strokeStyle = "rgba(52, 26, 10, 0.95)";
  ctx.lineWidth = Math.max(2, rect.w * 0.03);
  ctx.strokeRect(panelX, rect.y, panelW, rect.h);

  ctx.fillStyle = "#7f8a95";
  ctx.fillRect(rect.x + rect.w - hingeW, rect.y, hingeW, rect.h);

  const gripH = Math.max(14, rect.h * 0.165);
  const gripW = Math.max(5, rect.w * 0.11);
  const gripX = panelX + Math.max(rect.w * 0.1, panelW * 0.14);
  const gripY = rect.y + (rect.h - gripH) / 2 + rect.h * 0.03;
  const gripR = Math.max(2, gripW * 0.45);

  ctx.fillStyle = "#6f7982";
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

  ctx.restore();
}

function playLockerDoorOpenFx(areaDescription, onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.lockerDoorOpen) {
    onDone?.();
    return;
  }

  const roomId = gameState.currentRoom;
  if (roomId !== "mainDoor") {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.lockerDoorOpen = {
    roomId,
    areaDescription,
    progress: 0,
  };

  playSE?.("se-door-close");
  renderCanvasRoom();

  const duration = 460;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.lockerDoorOpen;
    if (!curFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      onDone?.();
      return;
    }

    const t = Math.min(1, (now - start) / duration);
    curFx.progress = t;
    renderCanvasRoom();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setTimeout(() => {
      if (gameState.fx) {
        delete gameState.fx.lockerDoorOpen;
        gameState.fx.lockInput = false;
      }
      renderCanvasRoom();
      onDone?.();
    }, 120);
  };

  requestAnimationFrame(tick);
}

function drawShelfCabinetDoorFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.shelfCabinetDoorOpen;
  if (!fx || fx.roomId !== roomId) return;

  const rect = getAreaRectPx(roomId, fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, fx.progress || 0));
  const openEase = Math.sin(t * Math.PI);
  const isDoubleDoor = !!fx.doubleDoor;
  const hingeW = Math.max(2, rect.w * 0.045);
  const shadowW = rect.w * 0.2 * openEase;

  ctx.save();

  if (openEase > 0.02) {
    const cavity = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y);
    cavity.addColorStop(0, "rgba(7, 4, 2, 0.98)");
    cavity.addColorStop(0.55, "rgba(14, 8, 5, 0.95)");
    cavity.addColorStop(1, "rgba(20, 12, 7, 0.9)");
    ctx.fillStyle = cavity;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

    ctx.fillStyle = "rgba(0, 0, 0, 0.48)";
    ctx.fillRect(rect.x + rect.w - shadowW, rect.y, shadowW, rect.h);
  }

  if (isDoubleDoor) {
    const visibleRatio = Math.max(0.08, 1 - openEase * 0.92);
    const halfW = rect.w / 2;
    const leftPanelW = halfW * visibleRatio;
    const rightPanelW = halfW * visibleRatio;
    const leftPanelX = rect.x;
    const rightPanelX = rect.x + rect.w - rightPanelW;

    const leftWood = ctx.createLinearGradient(leftPanelX, rect.y, leftPanelX + leftPanelW, rect.y);
    leftWood.addColorStop(0, "rgb(124, 108, 82)");
    leftWood.addColorStop(0.55, "rgb(147, 128, 97)");
    leftWood.addColorStop(1, "rgb(164, 143, 109)");
    const rightWood = ctx.createLinearGradient(rightPanelX, rect.y, rightPanelX + rightPanelW, rect.y);
    rightWood.addColorStop(0, "rgb(164, 143, 109)");
    rightWood.addColorStop(0.45, "rgb(147, 128, 97)");
    rightWood.addColorStop(1, "rgb(124, 108, 82)");

    ctx.fillStyle = leftWood;
    ctx.fillRect(leftPanelX, rect.y, leftPanelW, rect.h);
    ctx.fillStyle = rightWood;
    ctx.fillRect(rightPanelX, rect.y, rightPanelW, rect.h);

    ctx.strokeStyle = "rgba(52, 26, 10, 0.95)";
    ctx.lineWidth = Math.max(1.5, rect.w * 0.022);
    ctx.strokeRect(leftPanelX, rect.y, leftPanelW, rect.h);
    ctx.strokeRect(rightPanelX, rect.y, rightPanelW, rect.h);

    ctx.fillStyle = "#626b73";
    ctx.fillRect(rect.x, rect.y, hingeW, rect.h);
    ctx.fillRect(rect.x + rect.w - hingeW, rect.y, hingeW, rect.h);

    const gripH = Math.max(11, rect.h * 0.19);
    const gripW = Math.max(3, rect.w * 0.045);
    const gripY = rect.y + (rect.h - gripH) / 2 + rect.h * 0.03;
    const gripR = Math.max(1.5, gripW * 0.4);
    const grips = [leftPanelX + Math.max(halfW * 0.08, leftPanelW - gripW - halfW * 0.06), rightPanelX + Math.max(halfW * 0.06, rightPanelW * 0.08)];

    grips.forEach((gripX) => {
      ctx.fillStyle = "#596169";
      roundRect(ctx, gripX, gripY, gripW, gripH, gripR, true, false);

      ctx.fillStyle = "#474f56";
      ctx.beginPath();
      ctx.arc(gripX + gripW / 2, gripY, gripW * 0.5, 0, Math.PI * 2);
      ctx.arc(gripX + gripW / 2, gripY + gripH, gripW * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = Math.max(1, gripW * 0.16);
      ctx.beginPath();
      ctx.moveTo(gripX + gripW * 0.26, gripY + gripW * 0.18);
      ctx.lineTo(gripX + gripW * 0.26, gripY + gripH - gripW * 0.18);
      ctx.stroke();
    });
  } else {
    const visibleRatio = Math.max(0.08, 1 - openEase * 0.92);
    const panelW = rect.w * visibleRatio;
    const panelX = rect.x + rect.w - panelW;

    const woodBase = ctx.createLinearGradient(panelX, rect.y, panelX + panelW, rect.y);
    woodBase.addColorStop(0, "rgb(104, 70, 49)");
    woodBase.addColorStop(0.45, "rgb(128, 87, 62)");
    woodBase.addColorStop(1, "rgb(88, 60, 43)");

    ctx.fillStyle = woodBase;
    ctx.fillRect(panelX, rect.y, panelW, rect.h);

    ctx.strokeStyle = "rgba(52, 26, 10, 0.95)";
    ctx.lineWidth = Math.max(1.5, rect.w * 0.025);
    ctx.strokeRect(panelX, rect.y, panelW, rect.h);

    ctx.fillStyle = "#626b73";
    ctx.fillRect(rect.x + rect.w - hingeW, rect.y, hingeW, rect.h);

    const gripH = Math.max(11, rect.h * 0.19);
    const gripW = Math.max(3, rect.w * 0.075);
    const gripX = panelX + Math.max(rect.w * 0.085, panelW * 0.12);
    const gripY = rect.y + (rect.h - gripH) / 2 + rect.h * 0.03;
    const gripR = Math.max(1.5, gripW * 0.4);

    ctx.fillStyle = "#596169";
    roundRect(ctx, gripX, gripY, gripW, gripH, gripR, true, false);

    ctx.fillStyle = "#474f56";
    ctx.beginPath();
    ctx.arc(gripX + gripW / 2, gripY, gripW * 0.5, 0, Math.PI * 2);
    ctx.arc(gripX + gripW / 2, gripY + gripH, gripW * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = Math.max(1, gripW * 0.16);
    ctx.beginPath();
    ctx.moveTo(gripX + gripW * 0.26, gripY + gripW * 0.18);
    ctx.lineTo(gripX + gripW * 0.26, gripY + gripH - gripW * 0.18);
    ctx.stroke();
  }

  ctx.restore();
}

function playShelfCabinetDoorOpenFx(areaDescription, onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.shelfCabinetDoorOpen) {
    onDone?.();
    return;
  }

  const roomId = gameState.currentRoom;
  if (roomId !== "mainShelf") {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.shelfCabinetDoorOpen = {
    roomId,
    areaDescription,
    progress: 0,
    doubleDoor: areaDescription === "棚の上のキャビネット",
  };

  playSE?.("se-door-close");
  renderCanvasRoom();

  const duration = 420;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.shelfCabinetDoorOpen;
    if (!curFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      onDone?.();
      return;
    }

    const t = Math.min(1, (now - start) / duration);
    curFx.progress = t;
    renderCanvasRoom();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setTimeout(() => {
      if (gameState.fx) {
        delete gameState.fx.shelfCabinetDoorOpen;
        gameState.fx.lockInput = false;
      }
      renderCanvasRoom();
      onDone?.();
    }, 120);
  };

  requestAnimationFrame(tick);
}

function drawWindowRightCabinetSlideFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.windowRightCabinetSlide;
  if (!fx || fx.roomId !== roomId) return;

  const rect = getAreaRectPx(roomId, fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, fx.progress || 0));
  const eased = easeOutCubic(t);
  const slideX = rect.w * 1.05 * eased;
  const woodBase = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y);
  woodBase.addColorStop(0, "rgb(78, 60, 36)");
  woodBase.addColorStop(0.45, "rgb(97, 75, 45)");
  woodBase.addColorStop(1, "rgb(66, 50, 30)");

  ctx.save();

  const cavity = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y);
  cavity.addColorStop(0, "rgba(8, 5, 3, 0.96)");
  cavity.addColorStop(0.6, "rgba(17, 10, 6, 0.92)");
  cavity.addColorStop(1, "rgba(24, 15, 9, 0.86)");
  ctx.fillStyle = cavity;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

  ctx.strokeStyle = "rgba(255, 228, 184, 0.12)";
  ctx.lineWidth = Math.max(1, rect.w * 0.02);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);

  const panelX = rect.x + slideX;
  const panelVisibleX = Math.max(panelX, rect.x);
  const panelVisibleW = Math.max(0, rect.w - Math.max(0, panelVisibleX - rect.x));
  if (panelVisibleW > 0.5) {
    ctx.fillStyle = woodBase;
    ctx.fillRect(panelVisibleX, rect.y, panelVisibleW, rect.h);

    ctx.strokeStyle = "rgba(52, 26, 10, 0.95)";
    ctx.lineWidth = Math.max(1.5, rect.w * 0.025);
    ctx.strokeRect(panelVisibleX, rect.y, panelVisibleW, rect.h);

    const gripH = Math.max(12, rect.h * 0.18);
    const gripW = Math.max(3, rect.w * 0.07);
    const gripR = Math.max(1.5, gripW * 0.4);
    const gripX = panelX + Math.max(rect.w * 0.09, rect.w * 0.12);
    const gripY = rect.y + (rect.h - gripH) / 2 + rect.h * 0.03;

    if (gripX < rect.x + rect.w && gripX + gripW > rect.x) {
      ctx.fillStyle = "#525a62";
      roundRect(ctx, gripX, gripY, gripW, gripH, gripR, true, false);

      ctx.fillStyle = "#3f464d";
      ctx.beginPath();
      ctx.arc(gripX + gripW / 2, gripY, gripW * 0.48, 0, Math.PI * 2);
      ctx.arc(gripX + gripW / 2, gripY + gripH, gripW * 0.48, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawWindowLeftCabinetSlideFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.windowLeftCabinetSlide;
  if (!fx || fx.roomId !== roomId) return;

  const rect = getAreaRectPx(roomId, fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, fx.progress || 0));
  const eased = easeOutCubic(t);
  const slideX = rect.w * 1.05 * eased;
  const woodBase = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y);
  woodBase.addColorStop(0, "rgb(78, 60, 36)");
  woodBase.addColorStop(0.45, "rgb(97, 75, 45)");
  woodBase.addColorStop(1, "rgb(66, 50, 30)");

  ctx.save();

  const cavity = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y);
  cavity.addColorStop(0, "rgba(8, 5, 3, 0.96)");
  cavity.addColorStop(0.6, "rgba(17, 10, 6, 0.92)");
  cavity.addColorStop(1, "rgba(24, 15, 9, 0.86)");
  ctx.fillStyle = cavity;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

  ctx.strokeStyle = "rgba(255, 228, 184, 0.12)";
  ctx.lineWidth = Math.max(1, rect.w * 0.02);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);

  const panelX = rect.x - slideX;
  const panelVisibleX = Math.max(rect.x, panelX);
  const panelVisibleW = Math.max(0, Math.min(rect.x + rect.w, panelX + rect.w) - panelVisibleX);
  if (panelVisibleW > 0.5) {
    ctx.fillStyle = woodBase;
    ctx.fillRect(panelVisibleX, rect.y, panelVisibleW, rect.h);

    ctx.strokeStyle = "rgba(52, 26, 10, 0.95)";
    ctx.lineWidth = Math.max(1.5, rect.w * 0.025);
    ctx.strokeRect(panelVisibleX, rect.y, panelVisibleW, rect.h);

    const gripH = Math.max(12, rect.h * 0.18);
    const gripW = Math.max(3, rect.w * 0.07);
    const gripR = Math.max(1.5, gripW * 0.4);
    const gripX = panelX + rect.w - Math.max(rect.w * 0.09, rect.w * 0.12) - gripW;
    const gripY = rect.y + (rect.h - gripH) / 2 + rect.h * 0.03;

    if (gripX < rect.x + rect.w && gripX + gripW > rect.x) {
      ctx.fillStyle = "#525a62";
      roundRect(ctx, gripX, gripY, gripW, gripH, gripR, true, false);

      ctx.fillStyle = "#3f464d";
      ctx.beginPath();
      ctx.arc(gripX + gripW / 2, gripY, gripW * 0.48, 0, Math.PI * 2);
      ctx.arc(gripX + gripW / 2, gripY + gripH, gripW * 0.48, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function playWindowRightCabinetSlideFx(areaDescription, onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.windowRightCabinetSlide) {
    onDone?.();
    return;
  }

  const roomId = gameState.currentRoom;
  if (roomId !== "mainWindow") {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.windowRightCabinetSlide = {
    roomId,
    areaDescription,
    progress: 0,
  };

  playSE?.("se-curtain");
  renderCanvasRoom();

  const duration = 380;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.windowRightCabinetSlide;
    if (!curFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      onDone?.();
      return;
    }

    const t = Math.min(1, (now - start) / duration);
    curFx.progress = t;
    renderCanvasRoom();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setTimeout(() => {
      if (gameState.fx) {
        delete gameState.fx.windowRightCabinetSlide;
        gameState.fx.lockInput = false;
      }
      renderCanvasRoom();
      onDone?.();
    }, 120);
  };

  requestAnimationFrame(tick);
}

function playWindowLeftCabinetSlideFx(areaDescription, onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.windowLeftCabinetSlide) {
    onDone?.();
    return;
  }

  const roomId = gameState.currentRoom;
  if (roomId !== "mainWindow") {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.windowLeftCabinetSlide = {
    roomId,
    areaDescription,
    progress: 0,
  };

  playSE?.("se-curtain");
  renderCanvasRoom();

  const duration = 380;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.windowLeftCabinetSlide;
    if (!curFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      onDone?.();
      return;
    }

    const t = Math.min(1, (now - start) / duration);
    curFx.progress = t;
    renderCanvasRoom();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setTimeout(() => {
      if (gameState.fx) {
        delete gameState.fx.windowLeftCabinetSlide;
        gameState.fx.lockInput = false;
      }
      renderCanvasRoom();
      onDone?.();
    }, 120);
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

function maybeToastGyozaReady(itemId) {
  if (itemId !== "dish" && itemId !== "oil") return;
  const hasDishNow = itemId === "dish" || hasItem("dish");
  const hasOilNow = itemId === "oil" || hasItem("oil");
  if (hasDishNow && hasOilNow) {
    showToast("餃子が焼けそうだ");
  }
}

function acquireShelfLeftCabinetTopItems() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.foundShelfLeftCabinetTopItems) {
    updateMessage("もう何もない");
    return;
  }
  f.foundShelfLeftCabinetTopItems = true;
  addItem("timetable");
  renderCanvasRoom();
  showModal(
    "時刻表がある",
    `<div style="display:flex; justify-content:center; align-items:flex-start;">
      <img src="${IMAGES.items.timetable}" style="width:180px;max-width:100%;display:block;">
    </div>`,
    [{ text: "閉じる", action: "close" }],
  );
  updateMessage("時刻表を手に入れた");
}

function acquireItemOnce(flagKey, itemId, title, imgSrc, msg) {
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
  maybeToastGyozaReady(itemId);
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
      title: "🌼 TRUE END",
      label: "TRUE END",
      desc: "特製のたれと餃子でピクニックです",
    },

    end: {
      title: "🥟 NORMAL END ",
      label: "NORMAL END ",
      desc: "無事謎を解いて脱出できました！",
    },
  };

  const info = ENDING_INFO[endingId] || ENDING_INFO.end;

  // エンド別ひとこと
  let secretText = "";
  switch (endingId) {
    case "trueEnd":
      secretText = "🏫 長い道のり、遊んでくれてありがとうございました";
      break;

    case "end":
      secretText = "⌚ 次はどこに行くんでしょう";
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLScR5-DeZ7KsouLjc1LBF_RiQQlyyWL3NeF7YB0QH3CsPmz5ig/viewform";

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

function showWindowRightCabinetPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockWindowRightVabinet) {
    playWindowRightCabinetSlideFx("窓側下、右戸棚");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="windowRightCabinetDigits" style="display:flex; gap:5px; justify-content:center; align-items:center; flex-wrap:nowrap; width:100%; max-width:320px;"></div>
      <button id="windowRightCabinetOk" class="ok-btn" type="button">OK</button>
      <div id="windowRightCabinetHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("窓右下戸棚のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("windowRightCabinetDigits");
    const okBtn = document.getElementById("windowRightCabinetOk");
    const hintEl = document.getElementById("windowRightCabinetHint");
    if (!row || !okBtn || !hintEl) return;

    const target = ["2", "1", "1", "9", "3", "3"];
    const digits = Array.from({ length: 6 }, () => 0);

    const cells = Array.from({ length: 6 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "38px";
      btn.style.minWidth = "38px";
      btn.style.height = "56px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "8px";
      btn.style.border = "2px solid #b9b9b9";
      btn.style.background = "linear-gradient(180deg, #ffffff, #ececec)";
      btn.style.color = "#1f1f1f";
      btn.style.fontSize = "24px";
      btn.style.fontWeight = "700";
      btn.style.fontFamily = "Georgia, serif";
      btn.setAttribute("aria-label", `数字 ${i + 1}`);
      btn.addEventListener("click", () => {
        digits[i] = (digits[i] + 1) % 10;
        playSE?.("se-pi");
        repaint();
      });
      row.appendChild(btn);
      return btn;
    });

    function repaint() {
      cells.forEach((btn, i) => {
        btn.textContent = String(digits[i]);
      });
      hintEl.textContent = "";
    }

    okBtn.addEventListener("click", () => {
      const current = digits.map(String);
      const ok = target.every((v, i) => current[i] === v);
      if (ok) {
        f.unlockWindowRightVabinet = true;
        playSE?.("se-clear");
        closeModal();
        markProgress?.("unlock_window_right_cabinet");
        updateMessage("窓右下戸棚のロックが外れた。");
        // playWindowRightCabinetSlideFx("窓側下、右戸棚");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function ensureTapDripStyle() {
  if (document.getElementById("tapDripStyle")) return;
  const style = document.createElement("style");
  style.id = "tapDripStyle";
  style.textContent = `
    .tap-drip-wrap{
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:12px;
      margin-top:8px;
    }
    .tap-drip-stage{
      position:relative;
      width:min(220px, 72vw);
      height:220px;
      overflow:hidden;
      border-radius:14px;
      background:linear-gradient(180deg, rgba(255,255,255,0.08), rgba(80,120,150,0.06));
      border:1px solid rgba(212,175,55,0.25);
    }
    .tap-drip-faucet{
      position:absolute;
      top:18px;
      left:50%;
      width:92px;
      height:22px;
      transform:translateX(-50%);
      border-radius:8px 8px 6px 6px;
      background:linear-gradient(180deg, #d9dde2, #8a929c);
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.45);
    }
    .tap-drip-faucet::before{
      content:"";
      position:absolute;
      right:8px;
      top:12px;
      width:20px;
      height:46px;
      border-radius:0 0 10px 10px;
      background:linear-gradient(180deg, #c9ced4, #7c858f);
    }
    .tap-drip-faucet::after{
      content:"";
      position:absolute;
      right:4px;
      top:50px;
      width:28px;
      height:10px;
      border-radius:0 0 8px 8px;
      background:linear-gradient(180deg, #d9dde2, #8a929c);
    }
    .tap-drip-drop{
      position:absolute;
      left:calc(50% + 28px);
      top:68px;
      width:10px;
      height:15px;
      border-radius:50% 50% 55% 55%;
      background:radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(150,220,255,0.95) 38%, rgba(36,145,210,0.96) 70%, rgba(18,94,150,0.98) 100%);
      transform-origin:center top;
      animation:tap-drip-fall 520ms ease-in forwards;
      box-shadow:0 0 8px rgba(120,210,255,0.4);
    }
    @keyframes tap-drip-fall{
      0%{ transform:translateY(0) scale(0.7, 0.9); opacity:0; }
      12%{ opacity:1; }
      72%{ opacity:1; }
      100%{ transform:translateY(122px) scale(1.08, 1.18); opacity:0; }
    }
    .tap-water-stream{
      position:absolute;
      left:calc(50% + 28px);
      top:68px;
      width:10px;
      height:0;
      border-radius:999px;
      background:linear-gradient(180deg, rgba(215,247,255,0.96), rgba(106,198,242,0.94) 35%, rgba(42,151,210,0.95) 70%, rgba(20,110,170,0.92) 100%);
      box-shadow:0 0 10px rgba(120,210,255,0.35);
      animation:tap-water-open 240ms ease-out forwards, tap-water-flow 700ms linear infinite;
    }
    .tap-water-stream.is-closing{
      animation:tap-water-close 260ms ease-in forwards;
    }
    @keyframes tap-water-open{
      from{ height:0; opacity:0; }
      to{ height:128px; opacity:1; }
    }
    @keyframes tap-water-close{
      from{ height:128px; opacity:1; }
      to{ height:0; opacity:0; }
    }
    @keyframes tap-water-flow{
      0%{ filter:brightness(1); }
      50%{ filter:brightness(1.08); }
      100%{ filter:brightness(0.98); }
    }
  `;
  document.head.appendChild(style);
}

function showRightTapDripModal() {
  ensureTapDripStyle();

  const content = `
    <div class="tap-drip-wrap">
      <div id="tapDripStage" class="tap-drip-stage">
        <div class="tap-drip-faucet"></div>
      </div>
      <div style="font-size:0.95em; color:#e7e0cf;">とぽ…</div>
    </div>
  `;

  showModal("蛇口", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const stage = document.getElementById("tapDripStage");
    if (!stage) return;

    const schedule = [320, 620, 920, 1900, 2200, 2500, 2800, 4000];
    schedule.forEach((delay) => {
      setTimeout(() => {
        const currentStage = document.getElementById("tapDripStage");
        if (!currentStage) return;
        const drop = document.createElement("span");
        drop.className = "tap-drip-drop";
        currentStage.appendChild(drop);
        setTimeout(() => drop.remove(), 560);
      }, delay);
    });
  }, 0);
}

function showLeftTapWaterModal() {
  ensureTapDripStyle();

  const content = `
    <div class="tap-drip-wrap">
      <div id="tapWaterStage" class="tap-drip-stage">
        <div class="tap-drip-faucet"></div>
      </div>
      <div style="font-size:0.95em; color:#e7e0cf;">水が出る。</div>
    </div>
  `;

  showModal("蛇口", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const stage = document.getElementById("tapWaterStage");
    if (!stage) return;

    const stream = document.createElement("span");
    stream.className = "tap-water-stream";
    stage.appendChild(stream);

    setTimeout(() => {
      const current = document.querySelector("#tapWaterStage .tap-water-stream");
      if (!current) return;
      current.classList.add("is-closing");
      setTimeout(() => current.remove(), 280);
    }, 2600);
  }, 0);
}

function ensureWaterSprayStyle() {
  if (document.getElementById("waterSprayStyle")) return;
  const style = document.createElement("style");
  style.id = "waterSprayStyle";
  style.textContent = `
    .water-spray-wrap{
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:12px;
      margin-top:8px;
    }
    .water-spray-stage{
      position:relative;
      width:min(240px, 76vw);
      height:180px;
      overflow:hidden;
      border-radius:14px;
      background:radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18), rgba(76,118,138,0.12) 45%, rgba(12,24,32,0.2) 100%);
      border:1px solid rgba(180,210,225,0.28);
    }
    .water-spray-burst{
      position:absolute;
      left:54px;
      bottom:42px;
      width:162px;
      height:94px;
      background:
        radial-gradient(circle, rgba(214,245,255,0.98) 0 20%, transparent 24%) 6px 14px / 38px 28px repeat,
        radial-gradient(circle, rgba(120,210,255,0.88) 0 18%, transparent 23%) 18px 4px / 34px 25px repeat,
        linear-gradient(90deg, rgba(185,235,255,0.82), rgba(95,190,240,0.1));
      clip-path:polygon(0 48%, 100% 0, 100% 100%);
      filter:drop-shadow(0 0 10px rgba(130,220,255,0.4));
      animation:water-spray-burst 720ms ease-out forwards;
      transform-origin:left center;
    }
    @keyframes water-spray-burst{
      0%{ opacity:0; transform:scaleX(0.25) scaleY(0.6); }
      18%{ opacity:1; }
      100%{ opacity:0; transform:scaleX(1) scaleY(1); }
    }
  `;
  document.head.appendChild(style);
}

function showWaterSprayModal(message) {
  ensureWaterSprayStyle();
  const content = `
    <div class="water-spray-wrap">
      <div class="water-spray-stage">
        <div class="water-spray-burst"></div>
      </div>
      <div style="font-size:0.95em; color:#e7e0cf;">${message}</div>
    </div>
  `;
  showModal("霧吹き", content, [{ text: "閉じる", action: "close" }]);
}

function ensureInfraredUnlockStyle() {
  if (document.getElementById("infraredUnlockStyle")) return;
  const style = document.createElement("style");
  style.id = "infraredUnlockStyle";
  style.textContent = `
    .infrared-unlock-wrap{
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:12px;
      margin-top:8px;
    }
    .infrared-unlock-stage{
      position:relative;
      width:min(260px, 78vw);
      height:150px;
      overflow:hidden;
      border-radius:14px;
      background:linear-gradient(180deg, rgba(8,18,28,0.95), rgba(16,28,42,0.98));
      border:1px solid rgba(140,170,210,0.28);
    }
    .infrared-unlock-watch,
    .infrared-unlock-receiver{
      position:absolute;
      top:50%;
      transform:translateY(-50%);
      width:54px;
      height:54px;
      border-radius:14px;
      display:grid;
      place-items:center;
      font-size:24px;
      font-weight:700;
      color:#f5f7fa;
      box-shadow:0 0 16px rgba(0,0,0,0.28);
    }
    .infrared-unlock-watch{
      left:20px;
      background:linear-gradient(180deg, #f0b14e, #b96b1d);
    }
    .infrared-unlock-receiver{
      right:20px;
      background:linear-gradient(180deg, #7b8796, #43505f);
    }
    .infrared-unlock-beam{
      position:absolute;
      left:74px;
      top:50%;
      width:112px;
      height:4px;
      transform:translateY(-50%);
      background:linear-gradient(90deg, rgba(255,120,120,0), rgba(255,90,90,0.98) 18%, rgba(255,125,70,0.96) 52%, rgba(255,220,120,0.1));
      box-shadow:0 0 12px rgba(255,90,90,0.7);
      opacity:0;
      animation:infrared-beam 900ms ease-out forwards;
    }
    .infrared-unlock-pulse{
      position:absolute;
      right:42px;
      top:50%;
      width:18px;
      height:18px;
      border:2px solid rgba(255,210,120,0.95);
      border-radius:999px;
      transform:translate(50%, -50%) scale(0.2);
      opacity:0;
      animation:infrared-pulse 900ms ease-out forwards;
    }
    @keyframes infrared-beam{
      0%{ opacity:0; transform:translateY(-50%) scaleX(0.1); }
      18%{ opacity:1; }
      72%{ opacity:1; }
      100%{ opacity:0; transform:translateY(-50%) scaleX(1); }
    }
    @keyframes infrared-pulse{
      0%, 30%{ opacity:0; transform:translate(50%, -50%) scale(0.2); }
      45%{ opacity:1; }
      100%{ opacity:0; transform:translate(50%, -50%) scale(4.2); }
    }
  `;
  document.head.appendChild(style);
}

function showInfraredUnlockModal(onDone) {
  ensureInfraredUnlockStyle();
  const content = `
    <div class="infrared-unlock-wrap">
      <div class="infrared-unlock-stage">
        <div class="infrared-unlock-watch">⌚</div>
        <div class="infrared-unlock-beam"></div>
        <div class="infrared-unlock-receiver">IR</div>
        <div class="infrared-unlock-pulse"></div>
      </div>
      <div style="font-size:0.95em; color:#e7e0cf;">赤外線通信をしている...</div>
    </div>
  `;
  showModal("赤外線通信", content, [{ text: "閉じる", action: "close" }]);
  playSE?.("se-pi");
  setTimeout(() => {
    closeModal();
    playSE?.("se-clear");
    onDone?.();
  }, 980);
}

function ensureGyozaMiniGameStyle() {
  if (document.getElementById("gyozaMiniGameStyle")) return;
  const style = document.createElement("style");
  style.id = "gyozaMiniGameStyle";
  style.textContent = `
    .gyoza-game-wrap{
      margin-top:8px;
      display:flex;
      flex-direction:column;
      gap:12px;
      align-items:center;
      color:#f1edd7;
    }
    .gyoza-game-board{
      width:min(420px, 92vw);
      padding:14px 14px 16px;
      border-radius:16px;
      background:#1c4b2f;
      box-shadow:inset 0 0 0 1px rgba(255,255,255,0.08);
    }
    .gyoza-game-bars{
      display:grid;
      gap:10px;
      margin-bottom:12px;
    }
    .gyoza-game-label{
      display:flex;
      justify-content:space-between;
      align-items:center;
      font-size:12px;
      margin-bottom:4px;
      color:#efe7bc;
    }
    .gyoza-game-bar{
      position:relative;
      height:14px;
      border-radius:999px;
      overflow:hidden;
      background:rgba(6, 20, 12, 0.5);
      box-shadow:inset 0 1px 3px rgba(0,0,0,0.35);
    }
    .gyoza-game-time-fill{
      position:absolute;
      inset:0 auto 0 0;
      width:0%;
      background:linear-gradient(90deg, #f2e394, #f7c85f, #d28529);
    }
    .gyoza-game-time-target{
      position:absolute;
      top:0;
      bottom:0;
      left:68%;
      width:6%;
      background:rgba(247, 235, 163, 0.34);
      border-left:1px solid rgba(255,245,190,0.6);
      border-right:1px solid rgba(255,245,190,0.6);
    }
    .gyoza-game-heat-zones{
      position:absolute;
      inset:0;
      background:linear-gradient(90deg, #c96f2f 0 33%, #6ca84a 33% 67%, #cf6f34 67% 100%);
      opacity:0.85;
    }
    .gyoza-game-heat-marker{
      position:absolute;
      top:-3px;
      width:10px;
      height:20px;
      border-radius:999px;
      background:#fff8d7;
      box-shadow:0 0 10px rgba(255,245,180,0.45);
      transform:translateX(-50%);
    }
    .gyoza-game-pan-wrap{
      display:flex;
      justify-content:center;
      margin-bottom:12px;
    }
    .gyoza-game-pan{
      position:relative;
      width:min(260px, 62vw);
      aspect-ratio:1 / 1;
      border-radius:50%;
      background:radial-gradient(circle at 40% 32%, #434343, #191919 52%, #050505 82%);
      box-shadow:inset 0 0 18px rgba(255,255,255,0.05), 0 10px 22px rgba(0,0,0,0.35);
    }
    .gyoza-game-oil{
      position:absolute;
      inset:22% 18%;
      border-radius:50%;
      background:radial-gradient(circle at 46% 40%, rgba(255,245,170,0.34), rgba(233,198,82,0.18) 45%, rgba(255,220,120,0.08) 70%, rgba(255,220,120,0) 100%);
      opacity:0;
      transition:opacity 140ms linear;
      pointer-events:none;
    }
    .gyoza-game-pan.has-oil .gyoza-game-oil{
      opacity:1;
    }
    .gyoza-game-pan::after{
      content:"";
      position:absolute;
      right:-42px;
      top:50%;
      width:58px;
      height:16px;
      border-radius:0 10px 10px 0;
      background:linear-gradient(180deg, #3f2d1b, #1f140a);
      transform:translateY(-50%);
    }
    .gyoza-game-dumpling{
      position:absolute;
      width:54px;
      height:30px;
      border-radius:60% 60% 46% 46%;
      background:var(--dumpling-color, #f4efde);
      box-shadow:inset 0 -3px 0 rgba(90,55,18,0.14), inset 0 3px 0 rgba(255,255,255,0.3);
      transition:background 120ms linear;
    }
    .gyoza-game-dumpling::before{
      content:"";
      position:absolute;
      inset:6px 8px auto 8px;
      height:8px;
      border-top:2px solid rgba(120,82,40,0.35);
      border-radius:999px;
    }
    .gyoza-game-status{
      min-height:1.2em;
      text-align:center;
      font-size:13px;
      color:#f7efcf;
      margin-bottom:10px;
    }
    .gyoza-game-controls{
      display:flex;
      gap:10px;
      justify-content:center;
      flex-wrap:wrap;
    }
    .gyoza-game-heat-controls{
      display:flex;
      gap:10px;
      justify-content:center;
      margin-bottom:12px;
    }
    .gyoza-game-heat-controls .nav-btn{
      min-width:88px;
    }
    .gyoza-game-controls .nav-btn,
    .gyoza-game-controls .ok-btn{
      min-width:96px;
    }
    .gyoza-game-result{
      text-align:center;
      line-height:1.7;
      color:#f5edd0;
    }
  `;
  document.head.appendChild(style);
}

function getGyozaScoreLabel(score) {
  if (score >= 9) return "とても上手に焼けた";
  if (score >= 5) return "それなりに焼けた";
  return "焼き加減はいまひとつだった";
}

function getGyozaResultItem(score, timeMin) {
  if (score >= 9) {
    return { itemId: "gyozaPerfect", title: "すばらしい焼き上がりの餃子" };
  }
  if (score >= 5) {
    return timeMin < 7 ? { itemId: "gyozaUndercooked", title: "やや生焼けの餃子" } : { itemId: "gyozaOvercooked", title: "やや焼き過ぎの餃子" };
  }
  return timeMin < 7 ? { itemId: "gyozaRaw", title: "生焼けの餃子" } : { itemId: "gyozaBurnt", title: "焦げた餃子" };
}

function getHeldGyozaResult() {
  const patterns = [
    { itemId: "gyozaRaw", img: IMAGES.modals.bearGRaw, text: "「ふむふむ。もうちょっと焼いてほしかったなー」" },
    { itemId: "gyozaUndercooked", img: IMAGES.modals.bearGUndercooked, text: "「うん。美味しいよ」" },
    { itemId: "gyozaPerfect", img: IMAGES.modals.bearGPerfect, text: "「うーん。素晴らしい焼き加減！たれがあればもっと…」" },
    { itemId: "gyozaOvercooked", img: IMAGES.modals.bearGOvercooked, text: "「ちょっと焼き過ぎ？でも美味しい！」" },
    { itemId: "gyozaBurnt", img: IMAGES.modals.bearGBurnt, text: "「えー…」" },
  ];
  return patterns.find((entry) => hasItem(entry.itemId)) || null;
}

function triggerBearGyozaEnding() {
  const held = getHeldGyozaResult();
  if (!held) {
    updateMessage("クマ妖精が何か食べたそうにしている");
    return;
  }

  if (hasItem("sauce")) {
    showModal("「良い匂い！ぴったりなたれもあるんだね！きっとおいしく食べられるよ！」", `<img src="${IMAGES.modals.bearSauce}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [
      {
        text: "次へ",
        action: () => {
          playSE?.("se-door");
          showModal("「ピクニックしようよ！」", `<img src="${IMAGES.modals.bearDoor}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [
            {
              text: "閉じる",
              action: () => {
                if (held.itemId === "gyozaPerfect") {
                  gameState.trueEnd.flags.backgroundState = 1;
                } else if (held.itemId === "gyozaBurnt") {
                  gameState.trueEnd.flags.backgroundState = 2;
                }
                removeItem(held.itemId);
                removeItem("sauce");
                closeModal();
                travelWithStepsTrueEnd();
              },
            },
          ]);
        },
      },
    ]);
    return;
  }

  showModal("「良い香り！餃子？食べたい！」", `<img src="${IMAGES.modals.bearHope}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;"><div style="text-align:center;">クマ妖精は期待に満ち溢れている</div>`, [
    {
      text: "餃子をあげる",
      action: () => {
        removeItem(held.itemId);
        playSE("se-eat");
        showModal(held.text, `<img src="${held.img}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;"><div style="text-align:center;"></div>`, [
          {
            text: "次へ",
            action: () => {
              playSE?.("se-door");
              showModal("「そろそろ帰ろうよ」", `<img src="${IMAGES.modals.bearDoor}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [
                {
                  text: "そうだね",
                  action: () => {
                    if (held.itemId === "gyozaPerfect") {
                      gameState.end.flags.backgroundState++;
                    }
                    closeModal();
                    playSE?.("se-ashioto");
                    quickBlackFade();
                    setTimeout(() => {
                      changeRoom("end");
                    }, 280);
                  },
                },
              ]);
            },
          },
        ]);
      },
    },
  ]);
}

function showGyozaBadEnd() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.badend}" alt="bad end" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
      <div>フライパンに餃子が焦げ付いた…</div>
    </div>
  `;
  pauseBGM();
  playSE("se-grill");
  showModal("BAD END", content, [{ text: "最初から", action: "restart" }]);
  updateMessage("フライパンに餃子が焦げ付いた…");
}

function showGyozaMiniGame() {
  ensureGyozaMiniGameStyle();
  closeModal();
  changeBGM?.("sounds/32/cooking_theme.mp3");

  const content = `
    <div class="gyoza-game-wrap">
      <div class="gyoza-game-board">
        <div class="gyoza-game-bars">
          <div>
            <div class="gyoza-game-label"><span>焼き時間</span><span id="gyozaGameTimeText">0:00 / 10:00</span></div>
            <div class="gyoza-game-bar">
              <div class="gyoza-game-time-target"></div>
              <div id="gyozaGameTimeFill" class="gyoza-game-time-fill"></div>
            </div>
          </div>
          <div>
            <div class="gyoza-game-label"><span>火力</span><span>中央を維持</span></div>
            <div class="gyoza-game-bar">
              <div class="gyoza-game-heat-zones"></div>
              <div id="gyozaGameHeatMarker" class="gyoza-game-heat-marker"></div>
            </div>
            <div class="gyoza-game-heat-controls">
              <button id="gyozaGameHeatLeftBtn" class="nav-btn" type="button">← 火を弱める</button>
              <button id="gyozaGameHeatRightBtn" class="nav-btn" type="button">火を強める →</button>
            </div>
          </div>
        </div>
        <div class="gyoza-game-pan-wrap">
          <div class="gyoza-game-pan" id="gyozaGamePan">
            <div class="gyoza-game-oil"></div>
            <div class="gyoza-game-dumpling" style="left:56px; top:72px; display:none;"></div>
            <div class="gyoza-game-dumpling" style="left:108px; top:58px; display:none;"></div>
            <div class="gyoza-game-dumpling" style="left:154px; top:82px; display:none;"></div>
          </div>
        </div>
        <div id="gyozaGameStatus" class="gyoza-game-status">油を引いてから餃子を入れる</div>
        <div class="gyoza-game-controls">
          <button id="gyozaGameOilBtn" class="nav-btn" type="button">オイル</button>
          <button id="gyozaGameGyozaBtn" class="nav-btn" type="button">餃子</button>
          <button id="gyozaGamePlateBtn" class="ok-btn" type="button">お皿に出す</button>
        </div>
      </div>
    </div>
  `;

  showModal("餃子焼き", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const timeFill = document.getElementById("gyozaGameTimeFill");
    const timeText = document.getElementById("gyozaGameTimeText");
    const heatMarker = document.getElementById("gyozaGameHeatMarker");
    const statusEl = document.getElementById("gyozaGameStatus");
    const oilBtn = document.getElementById("gyozaGameOilBtn");
    const gyozaBtn = document.getElementById("gyozaGameGyozaBtn");
    const plateBtn = document.getElementById("gyozaGamePlateBtn");
    const heatLeftBtn = document.getElementById("gyozaGameHeatLeftBtn");
    const heatRightBtn = document.getElementById("gyozaGameHeatRightBtn");
    const panEl = document.getElementById("gyozaGamePan");
    const dumplings = Array.from(document.querySelectorAll("#gyozaGamePan .gyoza-game-dumpling"));
    if (!timeFill || !timeText || !heatMarker || !statusEl || !oilBtn || !gyozaBtn || !plateBtn || !heatLeftBtn || !heatRightBtn || !panEl || dumplings.length === 0) return;

    let done = false;
    const state = {
      oilAdded: false,
      gyozaInPan: false,
      timeMin: 0,
      heatPos: 0.5,
      heatVel: 0.04,
      heatErrorSum: 0,
      heatSamples: 0,
    };

    const cleanup = () => {
      if (timer) clearInterval(timer);
      window.removeEventListener("modal:closed", onClosed);
      changeBGM?.("sounds/32/haruno_otozure.mp3");
    };
    const onClosed = () => cleanup();
    window.addEventListener("modal:closed", onClosed);

    const setStatus = (text) => {
      statusEl.textContent = text;
    };

    const getDumplingColor = () => {
      if (!state.gyozaInPan) return "#f4efde";
      if (state.timeMin < 3) return "#efe6d1";
      if (state.timeMin < 6) return "#e1bd7b";
      if (state.timeMin < 7.4) return "#ca8f41";
      if (state.timeMin < 8.7) return "#966331";
      return "#5f3a1f";
    };

    const repaint = () => {
      timeFill.style.width = `${Math.max(0, Math.min(100, (state.timeMin / 10) * 100))}%`;
      const whole = Math.floor(state.timeMin);
      const sec = Math.floor((state.timeMin - whole) * 60);
      timeText.textContent = `${whole}:${String(sec).padStart(2, "0")} / 10:00`;
      heatMarker.style.left = `${state.heatPos * 100}%`;
      const dumplingColor = getDumplingColor();
      dumplings.forEach((el) => {
        el.style.display = state.gyozaInPan ? "block" : "none";
        el.style.setProperty("--dumpling-color", dumplingColor);
      });
      panEl.classList.toggle("has-oil", state.oilAdded);
      oilBtn.disabled = state.oilAdded;
      gyozaBtn.disabled = state.gyozaInPan;
      plateBtn.disabled = !state.gyozaInPan;
    };

    const finishWithScore = () => {
      if (done) return;
      done = true;
      cleanup();
      const timeDiff = Math.abs(state.timeMin - 7);
      const timeScore = Math.max(0, 5 - timeDiff * 5);
      const avgHeatError = state.heatSamples > 0 ? state.heatErrorSum / state.heatSamples : 0.5;
      const heatScore = Math.max(0, 5 - avgHeatError * 10);
      const total = Math.max(1, Math.min(10, Math.round(timeScore + heatScore)));
      const resultText = getGyozaScoreLabel(total);
      const resultItem = getGyozaResultItem(total, state.timeMin);
      const f = gameState.main.flags || (gameState.main.flags = {});
      f.gyozaGrilled = true;
      removeItem("dish");
      addItem(resultItem.itemId);
      closeModal();
      playSE?.("se-dodon");
      showModal("焼き上がり", `<div class="gyoza-game-result"><div style="font-size:1.15em; font-weight:700;">${total} / 10 点</div><div>${resultText}</div><div style="margin-top:6px;">${resultItem.title}を手に入れた。</div></div>`, [
        {
          text: "閉じる",
          action: () => {
            closeModal();
            showToast("良い香りでクマ妖精が目を覚ましたようだ");
          },
        },
      ]);
      updateMessage(`${resultItem.title}を手に入れた。`);
      renderCanvasRoom?.();
    };

    const failOilLess = () => {
      if (done) return;
      done = true;
      cleanup();
      closeModal();
      showGyozaBadEnd();
    };

    oilBtn.addEventListener("click", () => {
      if (done || state.oilAdded) return;
      state.oilAdded = true;
      playSE?.("se-click");
      setStatus("フライパンに油を引いた");
      repaint();
    });

    gyozaBtn.addEventListener("click", () => {
      if (done || state.gyozaInPan) return;
      if (!state.oilAdded) {
        failOilLess();
        return;
      }
      state.gyozaInPan = true;
      playSE?.("se-click");
      setStatus("餃子を焼いている");
      repaint();
    });

    plateBtn.addEventListener("click", () => {
      if (done || !state.gyozaInPan) return;
      playSE?.("se-click");
      finishWithScore();
    });

    heatLeftBtn.addEventListener("click", () => {
      if (done || !state.gyozaInPan) return;
      state.heatPos = Math.max(0.04, state.heatPos - 0.12);
      state.heatVel = Math.max(-0.08, state.heatVel - 0.025);
      playSE?.("se-pi");
      setStatus("火を少し弱めた");
      repaint();
    });

    heatRightBtn.addEventListener("click", () => {
      if (done || !state.gyozaInPan) return;
      state.heatPos = Math.min(0.96, state.heatPos + 0.12);
      state.heatVel = Math.min(0.08, state.heatVel + 0.025);
      playSE?.("se-pi");
      setStatus("火を少し強めた");
      repaint();
    });

    const timer = setInterval(() => {
      if (done) return;
      state.heatVel += (Math.random() - 0.5) * 0.012;
      state.heatVel = Math.max(-0.08, Math.min(0.08, state.heatVel));
      state.heatPos += state.heatVel;
      if (state.heatPos <= 0.05 || state.heatPos >= 0.95) {
        state.heatVel *= -0.8;
      }
      state.heatPos = Math.max(0.05, Math.min(0.95, state.heatPos));

      if (state.gyozaInPan) {
        state.timeMin = Math.min(10, state.timeMin + 0.07);
        state.heatErrorSum += Math.abs(state.heatPos - 0.5);
        state.heatSamples += 1;
        if (state.timeMin >= 8.5) {
          setStatus("焦げそうだ");
        } else if (state.timeMin >= 6.5) {
          setStatus("そろそろ取り出し時かも");
        }
        if (state.timeMin >= 10) {
          finishWithScore();
          return;
        }
      }
      repaint();
    }, 100);

    repaint();
  }, 0);
}

function showShelfLeftCabinetMiddlePuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockShelfLeftCabinetMiddle) {
    playShelfCabinetDoorOpenFx("棚左キャビネット中段");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="shelfLeftCabinetMiddleDigits" style="display:flex; gap:8px; justify-content:center; align-items:center;"></div>
      <button id="shelfLeftCabinetMiddleOk" class="ok-btn" type="button">OK</button>
      <div id="shelfLeftCabinetMiddleHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネットのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("shelfLeftCabinetMiddleDigits");
    const okBtn = document.getElementById("shelfLeftCabinetMiddleOk");
    const hintEl = document.getElementById("shelfLeftCabinetMiddleHint");
    if (!row || !okBtn || !hintEl) return;

    const target = ["3", "4", "1"];
    const digits = [0, 0, 0];

    const cells = Array.from({ length: 3 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "50px";
      btn.style.height = "64px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "8px";
      btn.style.border = "2px solid #9ec9dc";
      btn.style.background = "linear-gradient(180deg, #effbff, #cfeef8)";
      btn.style.color = "#14465e";
      btn.style.fontSize = "28px";
      btn.style.fontWeight = "700";
      btn.style.fontFamily = "Georgia, serif";
      btn.setAttribute("aria-label", `数字 ${i + 1}`);
      btn.addEventListener("click", () => {
        digits[i] = (digits[i] + 1) % 10;
        playSE?.("se-pi");
        repaint();
      });
      row.appendChild(btn);
      return btn;
    });

    function repaint() {
      cells.forEach((btn, i) => {
        btn.textContent = String(digits[i]);
      });
      hintEl.textContent = "";
    }

    okBtn.addEventListener("click", () => {
      const current = digits.map(String);
      const ok = target.every((v, i) => current[i] === v);
      if (ok) {
        f.unlockShelfLeftCabinetMiddle = true;
        playSE?.("se-clear");
        closeModal();
        markProgress?.("unlock_shelf_left_cabinet_middle");
        updateMessage("棚左キャビネット中段のロックが外れた。");
        // playShelfCabinetDoorOpenFx("棚左キャビネット中段");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showShelfLeftCabinetBottomPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockShelfLeftCabinetBottom) {
    playShelfCabinetDoorOpenFx("棚左キャビネット下段");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:grid; grid-template-columns:repeat(3, 60px); grid-template-rows:repeat(3, 60px); gap:8px; justify-content:center; align-items:center;">
        <div></div>
        <button id="shelfLeftCabinetBottomUp" class="nav-btn" type="button" style="width:60px; height:60px; padding:0; border-radius:8px; background:#ffffff; color:#1a1a1a; border:2px solid #d9d9d9; font-size:28px; font-weight:700;">N</button>
        <div></div>
        <button id="shelfLeftCabinetBottomLeft" class="nav-btn" type="button" style="width:60px; height:60px; padding:0; border-radius:8px; background:#ffffff; border:2px solid #d9d9d9;"></button>
        <div></div>
        <button id="shelfLeftCabinetBottomRight" class="nav-btn" type="button" style="width:60px; height:60px; padding:0; border-radius:8px; background:#ffffff; border:2px solid #d9d9d9;"></button>
        <div></div>
        <button id="shelfLeftCabinetBottomDown" class="nav-btn" type="button" style="width:60px; height:60px; padding:0; border-radius:8px; background:#ffffff; border:2px solid #d9d9d9;"></button>
        <div></div>
      </div>
      <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
        <button id="shelfLeftCabinetBottomClear" class="nav-btn" type="button">クリア</button>
        <button id="shelfLeftCabinetBottomOk" class="ok-btn" type="button">OK</button>
      </div>
      <div id="shelfLeftCabinetBottomHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネットのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const hintEl = document.getElementById("shelfLeftCabinetBottomHint");
    const clearBtn = document.getElementById("shelfLeftCabinetBottomClear");
    const okBtn = document.getElementById("shelfLeftCabinetBottomOk");
    if (!hintEl || !clearBtn || !okBtn) return;

    const order = [];
    const target = ["left", "up", "right", "down"];
    const buttons = {
      left: document.getElementById("shelfLeftCabinetBottomLeft"),
      up: document.getElementById("shelfLeftCabinetBottomUp"),
      right: document.getElementById("shelfLeftCabinetBottomRight"),
      down: document.getElementById("shelfLeftCabinetBottomDown"),
    };

    const repaint = () => {
      Object.entries(buttons).forEach(([key, btn]) => {
        if (!btn) return;
        const pressed = order.includes(key);
        btn.style.background = pressed ? "#d0d0d0" : "#ffffff";
        btn.style.borderColor = pressed ? "#b7b7b7" : "#d9d9d9";
        btn.disabled = pressed;
      });
      hintEl.textContent = "";
    };

    Object.entries(buttons).forEach(([key, btn]) => {
      if (!btn) return;
      btn.addEventListener("click", () => {
        if (order.includes(key)) return;
        order.push(key);
        playSE?.("se-pi");
        repaint();
      });
    });

    clearBtn.addEventListener("click", () => {
      order.length = 0;
      playSE?.("se-click");
      repaint();
    });

    okBtn.addEventListener("click", () => {
      const ok = order.length === target.length && target.every((dir, idx) => order[idx] === dir);
      if (ok) {
        f.unlockShelfLeftCabinetBottom = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_shelf_left_cabinet_bottom");
        updateMessage("棚左キャビネット下段のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showLockerLeftTopClockPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.unlockLockerLeftTop) {
    playLockerDoorOpenFx("ロッカー左上", () => {
      acquireItemOnce("foundRod", "rod", "突っ張り棒がある", IMAGES.items.rod, "突っ張り棒を手に入れた");
    });
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="font-size:0.95em; color:#ddd7c4;">時刻</div>
      <div id="lockerLeftTopClockRow" style="display:flex; align-items:center; gap:8px; justify-content:center; flex-wrap:nowrap;"></div>
      <button id="lockerLeftTopClockOk" class="ok-btn" type="button">OK</button>
      <div id="lockerLeftTopClockHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("Moriロッカーのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("lockerLeftTopClockRow");
    const okBtn = document.getElementById("lockerLeftTopClockOk");
    const hintEl = document.getElementById("lockerLeftTopClockHint");
    if (!row || !okBtn || !hintEl) return;

    const state = {
      hour: 0,
      minuteIndex: 0,
    };
    const minuteValues = [0, 10, 20, 30, 40, 50];

    const makeCell = (label, onClick) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "82px";
      btn.style.height = "68px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "12px";
      btn.style.border = "2px solid #506060";
      btn.style.background = "linear-gradient(180deg, #182424, #0a1313)";
      btn.style.boxShadow = "inset 0 0 0 1px rgba(140, 255, 220, 0.12), 0 4px 12px rgba(0,0,0,0.28)";
      btn.style.color = "#8ff7d3";
      btn.style.fontSize = "34px";
      btn.style.fontWeight = "700";
      btn.style.fontFamily = "'Courier New', monospace";
      btn.setAttribute("aria-label", label);
      btn.addEventListener("click", onClick);
      row.appendChild(btn);
      return btn;
    };

    const hourBtn = makeCell("hour", () => {
      state.hour = (state.hour + 1) % 13;
      playSE?.("se-pi");
      repaint();
    });

    const sep = document.createElement("div");
    sep.textContent = ":";
    sep.style.fontSize = "34px";
    sep.style.fontWeight = "700";
    sep.style.color = "#8ff7d3";
    sep.style.fontFamily = "'Courier New', monospace";
    row.appendChild(sep);

    const minuteBtn = makeCell("minutes", () => {
      state.minuteIndex = (state.minuteIndex + 1) % minuteValues.length;
      playSE?.("se-pi");
      repaint();
    });

    function repaint() {
      hourBtn.textContent = String(state.hour);
      minuteBtn.textContent = String(minuteValues[state.minuteIndex]).padStart(2, "0");
      hintEl.textContent = "";
    }

    okBtn.addEventListener("click", () => {
      const hourOk = state.hour === 9;
      const minuteOk = minuteValues[state.minuteIndex] === 40;
      if (hourOk && minuteOk) {
        f.unlockLockerLeftTop = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_locker_left_top");
        updateMessage("ロッカー左上のロックが外れた。");
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showLockerLeftBottomPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.unlockLockerLeftBottom) {
    playLockerDoorOpenFx("ロッカー左下", () => {
      acquireItemOnce("foundWatchOrange", "watchOrange", "オレンジの時計がある", IMAGES.items.watchOrange, "オレンジの時計を手に入れた");
    });
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="width:100%; max-width:280px; display:flex; justify-content:center;">
        <div style="background:#f3ecb2; color:#111; width:64px; height:44px; border-radius:8px; display:grid; place-items:center; font-size:28px; font-weight:900; box-shadow:inset 0 1px 0 rgba(255,255,255,0.55);">▼</div>
      </div>
      <div id="lockerLeftBottomRow" style="display:flex; gap:10px; justify-content:center; align-items:center;"></div>
      <button id="lockerLeftBottomOk" class="ok-btn" type="button">OK</button>
      <div id="lockerLeftBottomHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("ロッカーのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("lockerLeftBottomRow");
    const okBtn = document.getElementById("lockerLeftBottomOk");
    const hintEl = document.getElementById("lockerLeftBottomHint");
    if (!row || !okBtn || !hintEl) return;

    const cycle = ["●", "▲", "★", "♪", "■", "◇", "◎"];
    const target = ["♪", "★", "◇"];
    const state = [0, 0, 0];

    const cells = Array.from({ length: 3 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "64px";
      btn.style.height = "64px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "6px";
      btn.style.border = "2px solid #d8d8d8";
      btn.style.background = "#fff";
      btn.style.color = "#1a1a1a";
      btn.style.fontSize = "30px";
      btn.style.fontWeight = "700";
      btn.style.fontFamily = "'Yu Gothic', 'Hiragino Kaku Gothic ProN', sans-serif";
      btn.setAttribute("aria-label", `記号 ${i + 1}`);
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
        f.unlockLockerLeftBottom = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_locker_left_bottom");
        updateMessage("ロッカー左下のロックが外れた。");
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showShelfLeftCabinetTopPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockShelfLeftCabinetTop) {
    playShelfCabinetDoorOpenFx("棚左キャビネット上段");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="shelfLeftCabinetTopRow" style="display:flex; gap:10px; justify-content:center; align-items:center;"></div>
      <button id="shelfLeftCabinetTopOk" class="ok-btn" type="button">OK</button>
      <div id="shelfLeftCabinetTopHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネットのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("shelfLeftCabinetTopRow");
    const okBtn = document.getElementById("shelfLeftCabinetTopOk");
    const hintEl = document.getElementById("shelfLeftCabinetTopHint");
    if (!row || !okBtn || !hintEl) return;

    const target = [3, 5, 4];
    const counts = [0, 0, 0];
    const colors = ["#F4EE6C", "#83837C", "#F473FF"];

    const cells = colors.map((color, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "64px";
      btn.style.height = "64px";
      btn.style.padding = "0";
      btn.style.borderRadius = "8px";
      btn.style.border = "2px solid rgba(255,255,255,0.65)";
      btn.style.background = color;
      btn.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.35)";
      btn.setAttribute("aria-label", `色 ${i + 1}`);
      btn.addEventListener("click", () => {
        counts[i] += 1;
        playSE?.("se-pi");
        repaint();
      });
      row.appendChild(btn);
      return btn;
    });

    function repaint() {
      cells.forEach((btn, i) => {
        btn.textContent = String(counts[i]);
        btn.style.color = i === 1 ? "#f5f5f5" : "#222";
        btn.style.fontSize = "22px";
        btn.style.fontWeight = "700";
      });
      hintEl.textContent = "";
    }

    okBtn.addEventListener("click", () => {
      const ok = target.every((v, i) => counts[i] === v);
      if (ok) {
        f.unlockShelfLeftCabinetTop = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_shelf_left_cabinet_top");
        updateMessage("棚左キャビネット上段のロックが外れた。");
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showLockerRightTopPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.unlockLockerRightTop) {
    openLockerRightTopInterior();
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="lockerRightTopRow" style="display:flex; gap:8px; justify-content:center; align-items:center; flex-wrap:nowrap;"></div>
      <button id="lockerRightTopOk" class="ok-btn" type="button">OK</button>
      <div id="lockerRightTopHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("ロッカーのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("lockerRightTopRow");
    const okBtn = document.getElementById("lockerRightTopOk");
    const hintEl = document.getElementById("lockerRightTopHint");
    if (!row || !okBtn || !hintEl) return;

    const cycle = ["A", "D", "E", "F", "H", "I", "L", "M", "N", "O", "R", "U", "Y"];
    const target = ["D", "I", "A", "R", "Y"];
    const state = [0, 0, 0, 0, 0];

    const cells = Array.from({ length: 5 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "52px";
      btn.style.height = "64px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "8px";
      btn.style.border = "2px solid #d8d8d8";
      btn.style.background = "#fff";
      btn.style.color = "#151515";
      btn.style.fontSize = "28px";
      btn.style.fontWeight = "700";
      btn.style.fontFamily = "'Georgia', serif";
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
        f.unlockLockerRightTop = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_locker_right_top");
        updateMessage("ロッカー右上のロックが外れた。");
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function openLockerRightTopInterior() {
  playLockerDoorOpenFx("ロッカー右上", () => {
    changeRoom("lockerInnerRightTop");
  });
}

function openLockerCenterTopInterior() {
  playLockerDoorOpenFx("ロッカー中上", () => {
    changeRoom("lockerInnerCenterTop");
  });
}

function closeLockerRightTopInterior() {
  changeRoom("mainDoor");
}

function showLockerCenterTopPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockLockerCenterTop) {
    openLockerCenterTopInterior();
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="display:flex; gap:8px; justify-content:center; align-items:center;">
        <div style="width:28px; height:28px; border-radius:4px; background:#2d7be8; border:1px solid rgba(0,0,0,0.18);"></div>
        <div style="width:28px; height:28px; border-radius:4px; background:#f1cf38; border:1px solid rgba(0,0,0,0.18);"></div>
        <div style="width:28px; height:28px; border-radius:4px; background:#d74848; border:1px solid rgba(0,0,0,0.18);"></div>
        <div style="width:28px; height:28px; border-radius:4px; background:#f08a2b; border:1px solid rgba(0,0,0,0.18);"></div>
        <div style="width:28px; height:28px; border-radius:4px; background:#48a65a; border:1px solid rgba(0,0,0,0.18);"></div>
      </div>
      <div style="font-size:0.92em; color:#555; text-align:center;">青、黄、赤、オレンジ、緑</div>
      <div style="font-size:0.98em; font-weight:700;">キーを1回入力</div>
      
      <input id="lockerCenterTopInput" class="puzzle-input" type="text" maxlength="1" placeholder="" style="width:180px; text-align:center; font-size:1.2em;">
      <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
        <button id="lockerCenterTopOk" class="ok-btn" type="button">OK</button>
      </div>
      <div id="lockerCenterTopHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("中央上ロッカーのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const input = document.getElementById("lockerCenterTopInput");
    const okBtn = document.getElementById("lockerCenterTopOk");
    const hintEl = document.getElementById("lockerCenterTopHint");
    if (!input || !okBtn || !hintEl) return;

    input.focus();
    input.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "　") {
        input.value = event.key;
        event.preventDefault();
      }
    });

    okBtn.addEventListener("click", () => {
      if (input.value === " " || input.value === "　") {
        f.unlockLockerCenterTop = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_locker_center_top");
        updateMessage("ロッカー中上のロックが外れた。");
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showLockerRightTopJournal() {
  showModal("確認", "学級日誌がある。読みますか？", [
    {
      text: "はい",
      action: () => {
        const journalHtml = `
          <div style="max-width:420px; margin:0 auto; padding:20px 18px; border-radius:14px; background:linear-gradient(180deg, #f7f0d8, #eadbb2); color:#3c2f1b; box-shadow:inset 0 0 0 1px rgba(120,90,40,0.18);">
            <img src="${IMAGES.modals.flower}" style="width:100%; max-width:280px; display:block; margin:0 auto 18px; border-radius:10px; object-fit:contain;">
            <div style="display:flex; flex-direction:column; gap:12px; font-size:1rem; line-height:1.8; text-align:left;">
              <div>「9/19 もうすぐ新幹線が開通。そうしたらこの学校とはお別れなんだね」</div>
              <div>「9/22 みんなで育てたお花、きれいに咲いたよ」</div>
              <div>「9/23 たまごっち、欲しいな」</div>
              <div>「9/26 小川君の家の餃子、めちゃ美味しい。たれが絶品」</div>
            </div>
          </div>
        `;
        showModal("学級日誌", journalHtml, [
          {
            text: "よく見る",
            action: () => {
              showModal("左から、黄色、グレー、ピンクの花が咲いている", `<img src="${IMAGES.modals.flowerZoom}" style="max-width:420px;max-height:80vh;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`, [{ text: "閉じる", action: "close" }]);
            },
          },
          { text: "閉じる", action: "close" },
        ]);
      },
    },
    { text: "いいえ", action: "close" },
  ]);
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

    const isCurtainRodPair = (a === "curtain" && b === "rod") || (a === "rod" && b === "curtain");
    if (isCurtainRodPair) {
      clearUsingItem(true);
      removeItem("curtain");
      removeItem("rod");
      addItem("curtainRod");
      showModal("カーテンと突っ張り棒を組み合わせた！", `<img src="${IMAGES.items.curtainRod}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
      updateMessage("カーテンと突っ張り棒を組み合わせた！");
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
    dish: "皿",
    step: "踏み台",
    curtain: "カーテン",
    rod: "突っ張り棒",
    curtainRod: "カーテンと突っ張り棒",
    memoMori: "メモ",
    memoGyoza: "餃子のメモ",
    splayBottle: "霧吹き",
    splayBottleWithWater: "水入り霧吹き",
    watchOrange: "オレンジの時計",
    oil: "オイル",
    sauce: "特製餃子のたれ",
    mirror: "手鏡",
    timetable: "時間割",
    gyozaRaw: "生焼けの餃子",
    gyozaUndercooked: "焼き目が薄い餃子",
    gyozaPerfect: "完ぺきな焼き上がりの餃子",
    gyozaOvercooked: "やや焼き過ぎの餃子",
    gyozaBurnt: "焦げた餃子",
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

        if (itemId === "watchOrange") {
          buttons = [
            {
              text: "調べる",
              action: () => {
                window._nextModal = {
                  title: getItemName(itemId),
                  content: "赤外線通信ボタンがある",
                  buttons: [{ text: "閉じる", action: "close" }],
                };
                closeModal();
              },
            },
            { text: "閉じる", action: "close" },
          ];
        }

        if (itemId === "mirror") {
          buttons = [
            {
              text: "調べる",
              action: () => {
                window._nextModal = {
                  title: "鏡の裏面",
                  content: `<img src="${IMAGES.modals.mirrorBack}" style="max-width:380px;max-height:80vh;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`,
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
