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
const BASE_36 = USE_LOCAL_ASSETS ? "images/36" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/36";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I36 = (file) => `${BASE_36}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    counter: [I36("counter.webp")],
    counterRight: [I36("counter_right.webp")],
    entrance: [I36("entrance.webp")],
    doorAdmin: [I36("door_admin.webp")],
    cabinet: [I36("cabinet.webp")],
    madoriDisplay: [I36("madori_display.webp")],
    staffRoom: [I36("staff_room.webp")],
    fax: { jp: I36("fax.webp"), en: I36("fax_en.webp") },
    desktop: { jp: I36("desktop.webp"), en: I36("desktop_en.webp") },
    boxInner: [I36("box_inner.webp")],
    property1: { jp: I36("property_1.webp"), en: I36("property_1_en.webp") },
    property2: { jp: I36("property_2.webp"), en: I36("property_2_en.webp") },
    property3: { jp: I36("property_3.webp"), en: I36("property_3_en.webp") },
    property4: { jp: I36("property_4.webp"), en: I36("property_4_en.webp") },
    property5: { jp: I36("property_5.webp"), en: I36("property_5_en.webp") },
    end: [I36("end.webp"), I36("end2.webp")],
    trueEnd: [I36("true_end.webp"), I36("true_end2.webp")],
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

    stamp: I36("stamp.webp"),
    memo: I36("memo.webp"),
    memoEn: I36("memo_en.webp"),
    fileFresh: I36("file_fresh.webp"),
    fileFreshEn: I36("file_fresh_en.webp"),
    manual: I36("file_manual.webp"),
    fileProperty: I36("file_property.webp"),
    boardDirty: I36("board_dirty.webp"),
    board: I36("board.webp"),
    alcohol: I36("alcohol.webp"),
    tissue: I36("tissue.webp"),
    wetTissue: I36("wet_tissue.webp"),
    key: I36("key.webp"),
    handyLight: I36("handy_light.webp"),
    doorMsg: I36("door_msg.webp"),
    time: I36("time.webp"),
    coupon: I36("coupon.webp"),
    desktop: I36("desktop.webp"),
    locked: I36("locked.webp"),
    dinner: I36("dinner.webp"),
    picBear: I36("pic_bear.webp"),
  },
  modals: {
    kasatate: I36("modal_kasa.webp"),
    certificate: I36("certificate.webp"),
    certificateEn: I36("certificate_en.webp"),
    posterZero: I36("modal_poster_zero.webp"),
    posterZeroEn: I36("modal_poster_zero_en.webp"),
    schedule: I36("modal_schedule.webp"),
    tissueAlcohol: I36("modal_tissue_alcohol.webp"),
    boardTissue1: I36("modal_board_tissue_1.webp"),
    boardTissue2: I36("modal_board_tissue_2.webp"),
    memoLight: I36("modal_memo_light.webp"),
    memoLightEn: I36("modal_memo_light_en.webp"),
    stampPush: I36("modal_stamp_push.webp"),
    stampPushed: I36("modal_stamp_pushed.webp"),
    faxSecond: I36("fax_second.webp"),
    customer: I36("modal_customer.webp"),
    stream: I36("modal_stream.webp"),
    bearDinner: I36("modal_bear_dinner.webp"),
    interview: I36("modal_interview.webp"),
    goods: I36("modal_goods.webp"),
    badend: I36("badend.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState36";
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
        foundKey: false,
        unlockDoorAdmin: false,
        unlockCabinetTop: false,
        unlockCabinetBottom: false,
        unlockStaffRoomCabinetTop: false,
        unlockStaffRoomCabinetMiddle: false,
        unlockStaffRoomPc: false,
        unlockPickupDoor: false,
        gotFileFresh: false,
        gotCabinetBottomMemo: false,
        foundCoupon: false,
        calledStreamCoupon: false,
        complaintCallStarted: false,
        complaintCallCompleted: false,
        complaintCallScore: 0,
        complaintCallChoices: [],

        talkTo: { bear: 0 },
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

// 部屋データ
let rooms = {
  entrance: {
    name: "ドアの前",
    description: "",
    clickableAreas: [
      {
        x: 18.2,
        y: 57.1,
        width: 17.6,
        height: 22.5,
        onClick: clickWrap(function () {
          showObj(null, "傘立てだ", IMAGES.modals.kasatate, "傘立てがある");
        }),
        description: "傘立て",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 39.1,
        y: 30.8,
        width: 22.6,
        height: 45.6,
        onClick: clickWrap(function () {
          if (gameState.main.flags.complaintCallCleared) {
            showModal("ドア", "ドアは開けられそうだ。外に出ますか？", [
              {
                text: "はい",
                action: () => {
                  closeModal();
                  handleDoor();
                },
              },
              { text: "いいえ", action: "close" },
            ]);
            return;
          }

          updateMessage("ドアは開かない");
        }),
        description: "ドア",
        zIndex: 4,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 43.6,
        y: 35.4,
        width: 13.5,
        height: 7.0,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.items.doorMsg, "『未処理のクレームがあります。ドアロック中です』");
        }),
        description: "ドア表示部",
        zIndex: 5,
        usable: () => !gameState.main.flags.complaintCallCleared,
        item: { img: "doorMsg", visible: () => !gameState.main.flags.complaintCallCleared },
      },
      {
        x: 47.9,
        y: 59.8,
        width: 19.1,
        height: 19.9,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "dinner") {
            showObj(null, "うわあ、美味しそう…", IMAGES.modals.bearDinner, "「うわあ、美味しそう…」");
            return;
          }
          if (gameState.selectedItem === "fileFresh") {
            updateMessage("ボクは新入社員じゃないよ");
            return;
          }

          updateMessage("お仕事お疲れさま。迎えに来たよ");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.main.flags.complaintCallCleared,
        item: { img: "bear", visible: () => gameState.main.flags.complaintCallCleared },
      },
      {
        x: 64.3,
        y: 39.4,
        width: 15.6,
        height: 14.9,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockPickupDoor) {
            changeRoom("boxInner");
            return;
          }

          updateMessage("おそらく、外部からの荷物を受け取る扉だろう。ロックされているようだ");
        }),
        description: "宅配受け取り扉",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 71.1,
        y: 42.3,
        width: 2.5,
        height: 2.0,
        onClick: clickWrap(function () {}),
        description: "受け取り扉インジケーター",
        zIndex: 5,
        usable: () => false,
        item: { img: () => (gameState.main.flags.unlockPickupDoor ? "greenBack" : "redBack"), visible: () => true },
      },
      {
        x: 67.8,
        y: 58.3,
        width: 14.1,
        height: 22.5,
        onClick: clickWrap(function () {
          updateMessage("観葉植物が置いてある");
        }),
        description: "観葉植物",
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
            changeRoom("counter");
          },
          { allowAtNight: true },
        ),
        description: "ドア面戻る、カウンターへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  boxInner: {
    name: "宅配受け取り扉の内部",
    description: "",
    clickableAreas: [
      {
        x: 18.9,
        y: 71.8,
        width: 29.2,
        height: 17.7,
        onClick: clickWrap(function () {
          acquireItemOnce("gotDinner", "dinner", "お弁当が届いている", IMAGES.items.dinner, "お弁当を手に入れた");
          gameState.flags.trueEndUnlocked = true;
        }),
        description: "配達されたお弁当",
        zIndex: 5,
        usable: () => !gameState.main.flags.gotDinner && gameState.main.flags.calledStreamCoupon,
        item: { img: "dinner", visible: () => !gameState.main.flags.gotDinner && gameState.main.flags.calledStreamCoupon },
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
        description: "受け取り扉の中戻る、ドアの前へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  counter: {
    name: "カウンター",
    description: "",
    clickableAreas: [
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "時計オーバー",
        zIndex: 1,
        usable: () => false,
        item: { img: "time", visible: () => gameState.main.flags.complaintCallCleared },
      },
      {
        x: 43.7,
        y: 25.9,
        width: 3.6,
        height: 2.1,
        onClick: clickWrap(function () {
          updateMessage("時計がある");
        }),
        description: "時計右上",
        zIndex: 5,
        usable: () => true,
        item: { img: "", visible: () => true },
      },
      {
        x: 32.4,
        y: 53.9,
        width: 3.9,
        height: 1.6,
        onClick: clickWrap(function () {
          updateMessage("時計がある");
        }),
        description: "時計左下",
        zIndex: 5,
        usable: () => true,
        item: { img: "", visible: () => true },
      },
      {
        x: 25.5,
        y: 21.1,
        width: 6.3,
        height: 6.9,
        onClick: clickWrap(function () {
          showCounterWallClockModal();
        }),
        description: "壁のアナログ時計",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 90.1,
        y: 43.1,
        width: 5.7,
        height: 13.4,
        onClick: clickWrap(function () {
          updateMessage("消火器がある");
        }),
        description: "消火器",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 18.0,
        y: 28.2,
        width: 19.5,
        height: 10.0,
        onClick: clickWrap(function () {
          updateMessage("看板がある。売買、賃貸、管理と書いてある");
        }),
        description: "看板",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 89.6,
        y: 30.8,
        width: 6.1,
        height: 4.5,
        onClick: clickWrap(function () {
          showObj(null, "感謝状", IMAGES.modals.certificate, "不動産屋に対する感謝状が飾ってある", IMAGES.modals.certificateEn);
        }),
        description: "賞状",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 58.0,
        y: 36.8,
        width: 18.8,
        height: 20.9,
        onClick: clickWrap(function () {
          changeRoom("counterRight");
        }),
        description: "右応接エリア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 31.1,
        y: 40.1,
        width: 7.8,
        height: 5.7,
        onClick: clickWrap(function () {
          changeRoom("madoriDisplay");
        }),
        description: "ディスプレイ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 39.6,
        y: 29.0,
        width: 10.7,
        height: 19.3,
        onClick: clickWrap(function () {
          changeRoom("doorAdmin");
        }),
        description: "事務室ドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 2.7,
        y: 25.7,
        width: 14.0,
        height: 30.1,
        onClick: clickWrap(function () {
          changeRoom("cabinet");
        }),
        description: "キャビネット",
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
        description: "カウンター戻る、ドア面へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  counterRight: {
    name: "カウンター右端",
    description: "",
    clickableAreas: [
      {
        x: 51.4,
        y: 1.3,
        width: 27.1,
        height: 27.4,
        onClick: clickWrap(function () {
          updateMessage("心癒される植物がある");
        }),
        description: "植物",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 64.2,
        y: 66.7,
        width: 5.3,
        height: 4.2,
        onClick: clickWrap(function () {
          acquireItemOnce("foundTissue", "tissue", "ポケットティッシュがある", IMAGES.items.tissue, "ポケットティッシュを手に入れた");
        }),
        description: "ティッシュ",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundTissue,
        item: { img: "tissue", visible: () => !gameState.main.flags.foundTissue },
      },
      {
        x: 37.6,
        y: 28.6,
        width: 20.3,
        height: 14.8,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.items.picBear, "絵が貼ってある");
        }),
        description: "クマの絵",
        zIndex: 5,
        usable: () => true,
        item: { img: "", visible: () => true },
      },
      {
        x: 8.8,
        y: 45.4,
        width: 29.5,
        height: 9.2,
        onClick: clickWrap(function () {
          showObj(null, "顧客アンケートに落書きが書かれている", IMAGES.modals.interview, "顧客アンケートに落書きが書かれている");
        }),
        description: "カウンターの上の紙",
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
            changeRoom("counter");
          },
          { allowAtNight: true },
        ),
        description: "カウンター→戻る、カウンターへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  doorAdmin: {
    name: "ドア",
    description: "",
    clickableAreas: [
      {
        x: 0.4,
        y: 69.3,
        width: 12.5,
        height: 29.6,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.cleanedBoard && gameState.selectedItem === "tissue") {
            updateMessage("ティッシュでこすってみた。汚れがとれない。");
            return;
          }
          if (!f.cleanedBoard && gameState.selectedItem === "wetTissue") {
            f.cleanedBoard = true;
            removeItem("wetTissue");
            playSE?.("se-cloth");
            renderCanvasRoom?.();
            showModal(
              "ウェットティッシュで看板の汚れを拭いた",
              `
                <div class="modal-anim">
                  <img src="${IMAGES.modals.boardTissue1}" alt="board wipe 1">
                  <img src="${IMAGES.modals.boardTissue2}" alt="board wipe 2">
                </div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            updateMessage("ウェットティッシュで看板の汚れを拭いた");
            return;
          }

          const boardImage = f.cleanedBoard ? IMAGES.items.board : IMAGES.items.boardDirty;
          showObj(null, "売物件用の看板だ", boardImage, "売物件用の看板だ");
        }),
        description: "ボード",
        zIndex: 5,
        usable: () => true,
        item: { img: () => (gameState.main.flags.cleanedBoard ? "board" : "boardDirty"), visible: () => true },
      },
      {
        x: 24.1,
        y: 11.3,
        width: 27.3,
        height: 4.4,
        onClick: clickWrap(function () {
          updateMessage("スタッフルームと書かれている");
        }),
        description: "スタッフルームのプレート",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 21.2,
        y: 40.3,
        width: 8.9,
        height: 9.9,
        onClick: clickWrap(function () {
          showDoorAdminLockPuzzle();
        }),
        description: "ドアロック部",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 18.9,
        y: 6.6,
        width: 38.2,
        height: 89.1,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockDoorAdmin) {
            changeRoom("staffRoom");
            return;
          }
          updateMessage("ドアにはロックがかかっている。");
        }),
        description: "ドア",
        zIndex: 1,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 23.7,
        y: 41.9,
        width: 3.8,
        height: 3.0,
        onClick: clickWrap(function () {}),
        description: "ドアロックインジケーター",
        zIndex: 5,
        usable: () => false,
        item: { img: () => (gameState.main.flags.unlockDoorAdmin ? "greenBack" : "redBack"), visible: () => true },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("counter");
          },
          { allowAtNight: true },
        ),
        description: "ドア戻る、カウンターへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },

  cabinet: {
    name: "キャビネット",
    description: "",
    clickableAreas: [
      {
        x: 72.4,
        y: 48.7,
        width: 7.4,
        height: 26.2,
        onClick: clickWrap(function () {
          updateMessage("青いファイルだ。");
        }),
        description: "青いファイル左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 79.9,
        y: 48.7,
        width: 6.6,
        height: 26.3,
        onClick: clickWrap(function () {
          updateMessage("緑色のファイルだ。");
        }),
        description: "緑のファイル",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 87.1,
        y: 48.8,
        width: 6.6,
        height: 26.3,
        onClick: clickWrap(function () {
          updateMessage("黄色いファイルだ。");
        }),
        description: "黄色のファイル",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 94.3,
        y: 48.7,
        width: 5.7,
        height: 26.6,
        onClick: clickWrap(function () {
          updateMessage("青いファイルだ。");
        }),
        description: "青いファイル右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 29.1,
        y: 4.3,
        width: 40.2,
        height: 22.3,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockCabinetTop) {
            playCabinetTopOpenFx(() => {
              acquireItemOnce("foundStamp", "stamp", "キャビネットの中にスタンプがある", IMAGES.items.stamp, "スタンプを手に入れた");
            });
            return;
          }
          showCabinetTopPuzzle();
        }),
        description: "キャビネット最上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 28.8,
        y: 28.1,
        width: 40.5,
        height: 22.5,
        onClick: clickWrap(function () {
          playCabinetShelfOpenFx("キャビネット上から2番目", () => {
            acquireItemOnce("gotFileFresh", "fileFresh", "新人研修ファイルがある", IMAGES.items.fileFresh, "新人研修ファイルを手に入れた。");
          });
        }),
        description: "キャビネット上から2番目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 28.9,
        y: 51.9,
        width: 40.0,
        height: 22.6,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockCabinetThirdShelf) {
            openCabinetThirdShelf();
            return;
          }

          if (gameState.selectedItem === "key") {
            f.unlockCabinetThirdShelf = true;
            markProgress?.("unlock_cabinet_third_shelf");
            removeItem("key");
            playSE?.("se-gacha");
            renderCanvasRoom?.();
            openCabinetThirdShelf();
            return;
          }

          updateMessage("鍵がかかっている");
        }),
        description: "キャビネット上から3段目",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 29.2,
        y: 75.3,
        width: 39.6,
        height: 23.0,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockCabinetBottom) {
            openCabinetBottomShelf();
            return;
          }
          showCabinetBottomPuzzle();
        }),
        description: "キャビネット最下段",
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
            changeRoom("counter");
          },
          { allowAtNight: true },
        ),
        description: "キャビネット戻る、カウンターへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  madoriDisplay: {
    name: "ディスプレイに表示された間取り図",
    description: "",
    clickableAreas: [
      {
        x: 41.2,
        y: 63.1,
        width: 28.3,
        height: 12.4,
        onClick: clickWrap(function () {
          playMadoriRoomHighlightFx("リビング", "green");
          updateMessage("リビング");
        }),
        description: "リビング",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 9.0,
        y: 17.4,
        width: 16.6,
        height: 10.2,
        onClick: clickWrap(function () {
          playMadoriRoomHighlightFx("洋室1", "yellow");
          updateMessage("洋室1");
        }),
        description: "洋室1",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 10.4,
        y: 50.8,
        width: 15.9,
        height: 9.3,
        onClick: clickWrap(function () {
          playMadoriRoomHighlightFx("洋室2", "blue");
          updateMessage("洋室2");
        }),
        description: "洋室2",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 15.2,
        y: 71.4,
        width: 13.7,
        height: 8.2,
        onClick: clickWrap(function () {
          playMadoriRoomHighlightFx("洋室3", "blue");
          updateMessage("洋室3");
        }),
        description: "洋室3",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 33.8,
        y: 13.2,
        width: 8.4,
        height: 4.2,
        onClick: clickWrap(function () {
          updateMessage("玄関");
        }),
        description: "玄関",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 33.6,
        y: 29.2,
        width: 8.0,
        height: 4.8,
        onClick: clickWrap(function () {
          updateMessage("廊下");
        }),
        description: "廊下",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 49.4,
        y: 18.3,
        width: 10.4,
        height: 5.5,
        onClick: clickWrap(function () {
          updateMessage("洗面所");
        }),
        description: "洗面所",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 60.9,
        y: 30.2,
        width: 6.2,
        height: 3.5,
        onClick: clickWrap(function () {
          updateMessage("トイレ");
        }),
        description: "トイレ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 63.8,
        y: 19.3,
        width: 9.9,
        height: 3.2,
        onClick: clickWrap(function () {
          updateMessage("お風呂");
        }),
        description: "お風呂",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 31.0,
        y: 87.3,
        width: 13.2,
        height: 4.1,
        onClick: clickWrap(function () {
          updateMessage("バルコニー");
        }),
        description: "バルコニー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 77.2,
        y: 22.8,
        width: 22.6,
        height: 54.6,
        onClick: clickWrap(function () {
          updateMessage("今週のおすすめ物件！と書かれている。「J」とは畳1畳を表しているようだ");
        }),
        description: "右の文字",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 82.9,
        y: 1.6,
        width: 10.6,
        height: 13.8,
        onClick: clickWrap(function () {
          updateMessage("南向きバルコニーの、日当たりが良さそうな物件だ");
        }),
        description: "方位",
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
            changeRoom("counter");
          },
          { allowAtNight: true },
        ),
        description: "ディスプレイに表示された間取り図戻る、カウンターへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  staffRoom: {
    name: "スタッフ用の部屋",
    description: "",
    clickableAreas: [
      {
        x: 58.7,
        y: 42.0,
        width: 13.9,
        height: 14.4,
        onClick: clickWrap(function () {
          showObj(null, "スケジュール表だ", IMAGES.modals.schedule, "スケジュール表が貼ってある");
        }),
        description: "スケジュール表",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 38.4,
        y: 31.2,
        width: 14.7,
        height: 14.9,
        onClick: clickWrap(function () {
          showObj(null, "ポスターだ", IMAGES.modals.posterZero, "ブラックな雰囲気を感じさせるポスターが貼ってある", IMAGES.modals.posterZeroEn);
        }),
        description: "ゼロポスター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 33.4,
        y: 48.8,
        width: 18.8,
        height: 18.8,
        onClick: clickWrap(function () {
          showStaffRoomPcLogin();
        }),
        description: "デスクトップPC",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 38.3,
        y: 51.1,
        width: 11.9,
        height: 9.3,
        onClick: clickWrap(function () {}),
        description: "PC画面",
        zIndex: 5,
        usable: () => false,
        item: { img: "desktop", visible: () => gameState.main.flags.unlockStaffRoomPc },
      },
      {
        x: 4.8,
        y: 52.7,
        width: 24.1,
        height: 34.9,
        onClick: clickWrap(function () {
          if (gameState.main.flags.complaintCallCleared) {
            showModal("プリンター兼FAX", "新しいFAXが届いている。読みますか？", [
              {
                text: "はい",
                action: () => {
                  showModal("FAX", `<img src="${IMAGES.modals.faxSecond}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
                  updateMessage("FAXを読んだ");
                },
              },
              { text: "いいえ", action: "close" },
            ]);
            return;
          }

          showModal("プリンター兼FAX", "顧客からのクレームが届いている。読みますか？", [
            {
              text: "はい",
              action: () => {
                closeModal();
                changeRoom("fax");
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "プリンター兼FAX",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 82.2,
        y: 55.1,
        width: 12.7,
        height: 9.2,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockStaffRoomCabinetTop) {
            playStaffRoomCabinetShelfOpenFx("キャビネット上段", () => {
              acquireItemOnce("foundFileProperty", "fileProperty", "キャビネットの中に物件ファイルがある", IMAGES.items.fileProperty, "物件ファイルを手に入れた");
            });
            return;
          }

          showStaffRoomCabinetTopPuzzle();
        }),
        description: "キャビネット上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 82.3,
        y: 65.3,
        width: 12.6,
        height: 9.4,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockStaffRoomCabinetMiddle) {
            openStaffRoomCabinetMiddleShelf();
            return;
          }
          showStaffRoomCabinetMiddlePuzzle();
        }),
        description: "キャビネット中段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 82.2,
        y: 75.9,
        width: 12.6,
        height: 8.8,
        onClick: clickWrap(function () {
          playStaffRoomCabinetShelfOpenFx("キャビネット下段", () => {
            showModal("備品", `<img src="${IMAGES.modals.goods}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">備品が入っている。関係なさそうだ`, [{ text: "閉じる", action: "close" }]);
            updateMessage("備品が入っている。関係なさそうだ");
          });
        }),
        description: "キャビネット下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 84.7,
        y: 44.7,
        width: 10.2,
        height: 8.7,
        onClick: clickWrap(function () {
          updateMessage("植物がある");
        }),
        description: "キャビネット上の植物",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 64.3,
        y: 70.0,
        width: 13.4,
        height: 4.6,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockStaffRoomTopDrawer) {
            playStaffRoomTopDrawerOpenFx(() => {
              acquireItemOnce("foundStaffRoomTopDrawerKey", "key", "引き出しの中に鍵がある", IMAGES.items.key, "鍵を手に入れた");
            });
            return;
          }

          showStaffRoomTopDrawerPuzzle();
        }),
        description: "引き出し上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 64.3,
        y: 75.3,
        width: 13.5,
        height: 4.5,
        onClick: clickWrap(function () {
          playStaffRoomDrawerOpenFx("引き出し中段", "中段の引き出しが手前に開いた", () => {
            acquireItemOnce("foundManual", "manual", "引き出しの中にマニュアルがある", IMAGES.items.manual, "クレーム処理マニュアルを手に入れた");
          });
        }),
        description: "引き出し中段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 64.2,
        y: 80.2,
        width: 13.4,
        height: 8.0,
        onClick: clickWrap(function () {
          playStaffRoomDrawerOpenFx("引き出し下段", "下段の引き出しが手前に開いた", () => {
            acquireItemOnce("foundAlcohol", "alcohol", "引き出しの中に何かある", IMAGES.items.alcohol, "消毒用アルコールを手に入れた");
          });
        }),
        description: "引き出し下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 57.8,
        y: 63.1,
        width: 8.0,
        height: 4.6,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.stampedStaffRoomNote) {
            showModal("ノート", `<img src="${IMAGES.modals.stampPushed}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
            updateMessage("スタンプが押されている");
            return;
          }

          if (gameState.selectedItem === "stamp") {
            f.stampedStaffRoomNote = true;
            clearUsingItem(true);
            playSE?.("se-hanko");
            showModal(
              "スタンプを押した",
              `
                <div class="modal-anim">
                  <img src="${IMAGES.modals.stampPush}" alt="stamp push 1">
                  <img src="${IMAGES.modals.stampPushed}" alt="stamp push 2">
                </div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            updateMessage("スタンプを押した");
            return;
          }

          updateMessage("白紙のページが開かれたノートだ");
        }),
        description: "ノート",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 57.8,
        y: 57.3,
        width: 7.7,
        height: 5.1,
        onClick: clickWrap(function () {
          updateMessage("卓上カレンダーだ");
        }),
        description: "卓上カレンダー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 46.5,
        y: 69.2,
        width: 14.9,
        height: 15.9,
        onClick: clickWrap(function () {
          updateMessage("普通の椅子だ");
        }),
        description: "椅子",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 66.0,
        y: 57.3,
        width: 11.5,
        height: 8.6,
        onClick: clickWrap(function () {
          showTelephoneDialer();
        }),
        description: "電話",
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
            changeRoom("doorAdmin");
          },
          { allowAtNight: true },
        ),
        description: "スタッフ用の部屋戻る、ドア前へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  fax: {
    name: "顧客からのクレームFAX",
    description: "",
    clickableAreas: [
      {
        x: 2.0,
        y: 16.6,
        width: 64.6,
        height: 44.8,
        onClick: clickWrap(function () {
          updateMessage("朝早くから、上の部屋の足音がうるさい、というクレームだ");
        }),
        description: "文章",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 58.3,
        y: 63.5,
        width: 35.3,
        height: 35.4,
        onClick: clickWrap(function () {
          updateMessage("部屋の写真が貼ってある");
        }),
        description: "部屋の写真",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 90,
        y: 40,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("staffRoom");
          },
          { allowAtNight: true },
        ),
        description: "fax戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 90, // 中央寄せ（50基準で少し左）
        y: 55, // 一番下
        width: 10,
        height: 10,
        onClick: clickWrap(function () {
          uiLang = uiLang === "jp" ? "en" : "jp";
          // playSE('se-change');
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
  desktop: {
    name: "PCのデスクトップ画面",
    description: "",
    clickableAreas: [
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "ロックアイコン",
        zIndex: 5,
        usable: () => false,
        item: { img: "locked", visible: () => !gameState.main.flags.unlockPickupDoor },
      },
      {
        x: 1.4,
        y: 12.6,
        width: 16.2,
        height: 15.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockPickupDoor) {
            updateMessage("もうアンロックされている");
            return;
          }

          f.unlockPickupDoor = true;
          playSE?.("se-clear");
          renderCanvasRoom?.();
          updateMessage("ロックを解除した");
          showToast?.("エントランスドアのほうでかすかな物音がした");
        }),
        description: "受け取り扉開錠アイコン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 90,
        y: 40,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("staffRoom");
          },
          { allowAtNight: true },
        ),
        description: "デスクトップ戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 90, // 中央寄せ（50基準で少し左）
        y: 55, // 一番下
        width: 10,
        height: 10,
        onClick: clickWrap(function () {
          uiLang = uiLang === "jp" ? "en" : "jp";
          // playSE('se-change');
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
  property1: {
    name: "物件ファイル1ページ目",
    description: "",
    clickableAreas: [
      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("property2");
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
            returnFromPropertyFile();
          },
          { allowAtNight: true },
        ),
        description: "物件ファイル戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 90,
        y: 62,
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
  property2: {
    name: "物件ファイル2ページ目",
    description: "",
    clickableAreas: [
      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("property3");
          },
          { allowAtNight: true },
        ),
        description: "2ページ目右、3ページ目へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("property1");
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
            returnFromPropertyFile();
          },
          { allowAtNight: true },
        ),
        description: "物件ファイル戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 90,
        y: 62,
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
  property3: {
    name: "物件ファイル3ページ目",
    description: "",
    clickableAreas: [
      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("property4");
          },
          { allowAtNight: true },
        ),
        description: "3ページ目右、4ページ目へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("property2");
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
            returnFromPropertyFile();
          },
          { allowAtNight: true },
        ),
        description: "物件ファイル戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 90,
        y: 62,
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
  property4: {
    name: "物件ファイル4ページ目",
    description: "",
    clickableAreas: [
      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("property5");
          },
          { allowAtNight: true },
        ),
        description: "4ページ目右、5ページ目へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("property3");
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
            returnFromPropertyFile();
          },
          { allowAtNight: true },
        ),
        description: "物件ファイル戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 90,
        y: 62,
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
  property5: {
    name: "物件ファイル5ページ目",
    description: "",
    clickableAreas: [
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("property4");
        }),
        description: "5ページ目目左、4ページ目へ",
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
            returnFromPropertyFile();
          },
          { allowAtNight: true },
        ),
        description: "物件ファイル戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 90,
        y: 62,
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
    name: "ノーマルエンド",
    description: "見事にクレーム処理を済ませて脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 38.7,
        y: 49.2,
        width: 34.0,
        height: 36.5,
        onClick: clickWrap(function () {
          updateMessage("もうすぐ家に着くことでしょう");
        }),
        description: "プレイヤーキャラとクマ妖精",
        zIndex: 5,
        usable: () => gameState.end.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => gameState.end.flags.backgroundState == 0 },
      },
      {
        x: 50.0,
        y: 23.5,
        width: 24.4,
        height: 26.0,
        onClick: clickWrap(function () {
          updateMessage("家まで送ってくれるそうだ");
        }),
        description: "飛んでいるクマ妖精",
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
    description: "脱出おめでとうございます！",
    clickableAreas: [
      {
        x: 55.7,
        y: 22.6,
        width: 39.4,
        height: 36.9,
        onClick: clickWrap(function () {
          updateMessage("口を開けて待ち構えている");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 70.7,
        y: 67.7,
        width: 20.2,
        height: 15.8,
        onClick: clickWrap(function () {
          updateMessage("せっかくなので、インスタントスープを作った");
        }),
        description: "スープ",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 52.0,
        y: 19.6,
        width: 37.9,
        height: 32.1,
        onClick: clickWrap(function () {
          updateMessage("「この餃子、なんだか懐かしい味がするよ」");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 69.3,
        y: 55.5,
        width: 18.2,
        height: 12.4,
        onClick: clickWrap(function () {
          updateMessage("インスタントの卵スープを作った");
        }),
        description: "説明",
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
    bear: ["「ここは非常口だよ。ただでは通せないなあ」"],
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

  if (hasItem("puddingStrawberry")) {
    removeItem("puddingStrawberry");
  }

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
  changeRoom("entrance");
  updateMessage("気が付くとガラスのドアの前に立っていた。");
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
    changeBGM("sounds/36/nanigenai_nitijo_hikari.mp3");
  } else if (roomId === "end") {
    changeBGM("sounds/36/Restart.mp3");
  } else {
    changeBGM("sounds/36/Night_Plankton.mp3");
  }

  // nav
  if (roomId === "counter" || roomId === "staffRoom") {
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
  drawMadoriRoomHighlightFx(ctx, canvas, roomId);
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

function drawMadoriRoomHighlightFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.madoriRoomHighlight;
  if (!fx || fx.roomId !== roomId) return;

  const rect = getAreaRectPx(roomId, fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const pulse = Math.sin(t * Math.PI);
  if (pulse <= 0) return;

  const colors =
    fx.color === "blue"
      ? {
          shadow: "62, 104, 183",
          fill: "62, 104, 183",
          stroke: "185, 205, 245",
        }
      : fx.color === "red"
        ? {
            shadow: "255, 80, 80",
            fill: "245, 45, 45",
            stroke: "255, 205, 205",
          }
        : fx.color === "yellow"
          ? {
              shadow: "255, 235, 0",
              fill: "255, 230, 0",
              stroke: "255, 248, 185",
            }
          : fx.color === "purple"
            ? {
                shadow: "150, 55, 255",
                fill: "95, 20, 170",
                stroke: "215, 180, 255",
              }
            : {
                shadow: "66, 160, 88",
                fill: "66, 160, 88",
                stroke: "190, 235, 200",
              };
  const pad = Math.max(3, Math.min(rect.w, rect.h) * 0.08);
  const radius = Math.max(4, Math.min(rect.w, rect.h) * 0.12);

  ctx.save();
  ctx.shadowColor = `rgba(${colors.shadow}, ${0.5 * pulse})`;
  ctx.shadowBlur = 14 + 14 * pulse;
  ctx.fillStyle = `rgba(${colors.fill}, ${0.34 * pulse})`;
  roundRect(ctx, rect.x - pad, rect.y - pad, rect.w + pad * 2, rect.h + pad * 2, radius, true, false);

  ctx.shadowBlur = 0;
  ctx.lineWidth = Math.max(2, Math.min(rect.w, rect.h) * 0.05);
  ctx.strokeStyle = `rgba(${colors.stroke}, ${0.78 * pulse})`;
  roundRect(ctx, rect.x - pad * 0.5, rect.y - pad * 0.5, rect.w + pad, rect.h + pad, radius * 0.8, false, true);
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
function playCabinetTopOpenFx(onDone) {
  playCabinetShelfOpenFx("キャビネット最上段", onDone);
}

function playStaffRoomCabinetShelfOpenFx(areaDescription, onDone) {
  playCabinetShelfOpenFx(areaDescription, onDone, {
    roomId: "staffRoom",
    frontFill: "#46505A",
  });
}

function openStaffRoomCabinetMiddleShelf() {
  playStaffRoomCabinetShelfOpenFx("キャビネット中段", () => {
    acquireItemOnce("foundCoupon", "coupon", "クーポンがある", IMAGES.items.coupon, "クーポンを手に入れた。");
  });
}

function openCabinetThirdShelf() {
  playCabinetShelfOpenFx("キャビネット上から3段目", () => {
    acquireItemOnce("foundHandyLight", "handyLight", "ハンディライトがある", IMAGES.items.handyLight, "ハンディライトを手に入れた");
  });
}

function openCabinetBottomShelf() {
  playCabinetShelfOpenFx("キャビネット最下段", () => {
    acquireItemOnce("gotCabinetBottomMemo", "memo", "顧客対応メモがある", IMAGES.items.memo, "顧客対応メモを手に入れた。");
  });
}

function playCabinetShelfOpenFx(areaDescription, onDone, options = {}) {
  const fx = gameState.fx || (gameState.fx = {});
  const roomId = options.roomId || "cabinet";
  if (gameState.currentRoom !== roomId || fx.lockInput || fx.cabinetTopOpen) {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.cabinetTopOpen = {
    roomId,
    areaDescription,
    progress: 0,
    frontFill: options.frontFill || null,
  };

  playSE?.("se-door-close");
  renderCanvasRoom?.();

  const duration = 560;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.cabinetTopOpen;
    if (!currentFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      renderCanvasRoom?.();
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

    setTimeout(() => {
      if (gameState.fx) {
        delete gameState.fx.cabinetTopOpen;
        gameState.fx.lockInput = false;
      }
      renderCanvasRoom?.();
      updateMessage(`${areaDescription}が下開きで開いた。`);
      onDone?.();
    }, 180);
  };

  requestAnimationFrame(tick);
}

function playStaffRoomTopDrawerOpenFx(onDone) {
  playStaffRoomDrawerOpenFx("引き出し上段", "上段の引き出しが手前に開いた", onDone);
}

function playStaffRoomDrawerOpenFx(areaDescription, message, onDone) {
  playDeskDrawerOpenFx(areaDescription, message, onDone, {
    roomId: "staffRoom",
    frontFill: "#6A412D",
    sideTop: "#7A4C35",
    sideBottom: "#543120",
    gripStyle: "recessed",
    gripColor: "#3F2B20",
  });
}

function playDeskDrawerOpenFx(areaDescription, message, onDone, options = {}) {
  const fx = gameState.fx || (gameState.fx = {});
  const roomId = options.roomId || "desk";
  if (gameState.currentRoom !== roomId || fx.lockInput || fx.deskDrawerOpen) {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.deskDrawerOpen = {
    roomId,
    areaDescription,
    progress: 0,
    frontFill: options.frontFill || null,
    sideTop: options.sideTop || null,
    sideBottom: options.sideBottom || null,
    gripStyle: options.gripStyle || null,
    gripColor: options.gripColor || null,
  };

  playSE?.("se-hikidashi");
  renderCanvasRoom?.();

  const duration = 560;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.deskDrawerOpen;
    if (!currentFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      renderCanvasRoom?.();
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

    delete gameState.fx.deskDrawerOpen;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
    updateMessage(message);
    onDone?.();
  };

  requestAnimationFrame(tick);
}

function playSinkWaterPourFx(onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (gameState.currentRoom !== "sink" || fx.lockInput || fx.sinkWaterPour) {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.sinkWaterPour = {
    roomId: "sink",
    areaDescription: "蛇口から出る水",
    progress: 0,
  };

  renderCanvasRoom?.();

  const duration = 620;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.sinkWaterPour;
    if (!currentFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      renderCanvasRoom?.();
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

    delete gameState.fx.sinkWaterPour;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
    onDone?.();
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

// 画面フラッシュ（type: 'white' | 'red' | 'black'）
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

function returnFromPropertyFile() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const returnRoom = f.propertyReturnRoom;
  changeRoom(returnRoom && rooms[returnRoom] ? returnRoom : "staffRoom");
}

const PHONE_CALL_DATA = {
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
};

const PHONE_CALL_FALLBACK = {
  title: "発信結果",
  message: "…つながらない。",
  seId: "se-noise",
};

const COMPLAINT_CALL_BGM_SRC = "sounds/36/kuhaku_no_ne.mp3";

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

function startComplaintCallBgm() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const bgm = document.getElementById("bgm");
  f.complaintCallPrevBgm = bgm?.getAttribute("src") || bgm?.src || "";
  if (COMPLAINT_CALL_BGM_SRC) {
    changeBGM(COMPLAINT_CALL_BGM_SRC);
  }
}

function restoreComplaintCallBgm() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (COMPLAINT_CALL_BGM_SRC && f.complaintCallPrevBgm) {
    changeBGM(f.complaintCallPrevBgm);
  }
  delete f.complaintCallPrevBgm;
}

function beginComplaintCallEvent() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.complaintCallStarted = true;
  f.complaintCallCompleted = false;
  f.complaintCallScore = 0;
  f.complaintCallChoices = [];
  startComplaintCallBgm();
  showComplaintCallStep(0);
}

function showComplaintCallStep(stepIndex) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const firstChoice = f.complaintCallChoices?.[0];
  const steps = [
    {
      customer: "お客さん「クレーム見てくれた？ずっと困っているんですけど！」",
      choices: [
        { text: "申し訳ございません。まず詳しい状況をお伺いします。", good: true },
        { text: "あなたが神経質すぎるのでは？", good: false },
      ],
    },
    {
      customer: firstChoice === 1 ? "お客さん「神経質って、どういうことですか？ちゃんと対応してください！」" : "お客さん「…。それで、対応はしてくれるんですか？」",
      choices: [
        { text: "はい、騒音に配慮するよう物件全体に呼びかけてまいります", good: true },
        { text: "はい、とりあえず様子見でお願いできますか？", good: false },
      ],
    },
  ];

  const step = steps[stepIndex];
  if (!step) {
    finishComplaintCallEvent();
    return;
  }

  const buttons = step.choices.map((choice, choiceIndex) => ({
    text: choice.text,
    action: () => {
      f.complaintCallChoices[stepIndex] = choiceIndex;
      if (choice.good) f.complaintCallScore = (f.complaintCallScore || 0) + 1;
      showComplaintCallStep(stepIndex + 1);
    },
  }));

  showModal(
    step.customer,
    `
      <img src="${IMAGES.modals.customer}" style="max-width:320px;max-height:46vh;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 14px;">
    `,
    buttons,
    null,
    { columnButtons: true },
  );
}

function finishComplaintCallEvent() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.complaintCallCompleted = true;
  const score = f.complaintCallScore || 0;
  if (score === 0) {
    showComplaintNoiseBadEnd();
    return;
  }

  const success = score >= 1;
  if (success) {
    f.complaintCallCleared = true;
    playSE?.("se-fanfale");
    showToast?.("エントランスドアのほうで物音がした");
  }
  const message = score >= 2 ? "お客さんは満足げに受話器を置いた。我ながら完ぺきな対応だ" : score === 1 ? "お客さんはやや不満そうだが、何とか乗り切った" : "対応がまずかったようだ。もう一度、対応の流れを確認しよう。";
  showModal("クレームを処理した", `<p style="margin:0; line-height:1.8;">${message}</p>`, [{ text: "閉じる", action: "close" }], () => {
    restoreComplaintCallBgm();
  });
  updateMessage(success ? "ピーヒョロロ…ジジジ" : message);
}

function showCounterWallClockModal() {
  const tickHtml = [
    ["N", "50%", "6%", "translate(-50%, 0)"],
    ["NE", "81%", "18%", "translate(-50%, -50%)"],
    ["E", "94%", "50%", "translate(-100%, -50%)"],
    ["SE", "81%", "82%", "translate(-50%, -50%)"],
    ["S", "50%", "94%", "translate(-50%, -100%)"],
    ["SW", "19%", "82%", "translate(-50%, -50%)"],
    ["W", "6%", "50%", "translate(0, -50%)"],
    ["NW", "19%", "18%", "translate(-50%, -50%)"],
  ]
    .map(([label, left, top, transform]) => `<span class="counter-clock-mark" style="left:${left};top:${top};transform:${transform};">${label}</span>`)
    .join("");

  const content = `
    <style>
      .counter-clock-frame {
        width: min(70vw, 340px);
        aspect-ratio: 1 / 1;
        margin: 4px auto 18px;
        padding: 18px;
        box-sizing: border-box;
        background: linear-gradient(135deg, #6b3b19, #9b642e 45%, #4c2810);
        border: 5px solid #3a1d0b;
        box-shadow: inset 0 0 0 5px rgba(255,255,255,0.12), 0 8px 18px rgba(0,0,0,0.24);
      }
      .counter-clock-face {
        position: relative;
        width: 100%;
        height: 100%;
        background: #fffdf5;
        border: 2px solid #2f2118;
        box-sizing: border-box;
        overflow: hidden;
      }
      .counter-clock-face::before,
      .counter-clock-face::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        background: rgba(47,33,24,0.24);
        transform: translate(-50%, -50%);
      }
      .counter-clock-face::before {
        width: 82%;
        height: 1px;
      }
      .counter-clock-face::after {
        width: 1px;
        height: 82%;
      }
      .counter-clock-mark {
        position: absolute;
        z-index: 2;
        color: #2f2118;
        font-size: 18px;
        font-weight: 800;
        line-height: 1;
      }
      .counter-clock-needle {
        position: absolute;
        z-index: 3;
        left: 50%;
        top: 50%;
        width: 34%;
        height: 5px;
        border-radius: 999px;
        background: #22150f;
        transform: rotate(0deg);
        transform-origin: 0 50%;
        transition: transform 520ms ease-in-out;
      }
      .counter-clock-needle::after {
        content: "";
        position: absolute;
        right: -8px;
        top: 50%;
        width: 0;
        height: 0;
        border-top: 7px solid transparent;
        border-bottom: 7px solid transparent;
        border-left: 13px solid #22150f;
        transform: translateY(-50%);
      }
      .counter-clock-center {
        position: absolute;
        z-index: 4;
        left: 50%;
        top: 50%;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #6b3b19;
        border: 3px solid #22150f;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
      }
    </style>
    <div class="counter-clock-frame" aria-label="方位時計">
      <div class="counter-clock-face">
        ${tickHtml}
        <div id="counterClockNeedle" class="counter-clock-needle"></div>
        <div class="counter-clock-center"></div>
      </div>
    </div>
  `;

  showModal("壁のアナログ時計", content, [{ text: "閉じる", action: "close" }]);

  const sequence = [0, 90, 0, 180];
  let step = 0;
  const moveNeedle = () => {
    const needle = document.getElementById("counterClockNeedle");
    if (!needle) return;
    needle.style.transform = `rotate(${sequence[step]}deg)`;
    step++;
    if (step < sequence.length) {
      setTimeout(moveNeedle, 900);
    }
  };
  setTimeout(moveNeedle, 450);
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
      if (input === "3203") {
        if (f.complaintCallCleared) {
          const result = PHONE_CALL_FALLBACK;
          setTimeout(() => {
            try {
              playSE(result.seId);
            } catch (e) {}
            showModal("発信結果", `<p style="margin:0; line-height:1.8;">${result.message}</p>`, [{ text: "閉じる", action: "close" }]);
          }, 200);
          return;
        }

        hintEl.textContent = "発信中...";
        callBtn.disabled = true;
        clearBtn.disabled = true;
        try {
          playSE("se-call");
        } catch (e) {}
        setTimeout(() => {
          try {
            playSE("se-gacha");
          } catch (e) {}
          beginComplaintCallEvent();
        }, 1100);
        return;
      }

      if (input === "9950") {
        if (!hasItem("coupon") || f.calledStreamCoupon) {
          const result = PHONE_CALL_FALLBACK;
          setTimeout(() => {
            try {
              playSE(result.seId);
            } catch (e) {}
            showModal("発信結果", `<p style="margin:0; line-height:1.8;">${result.message}</p>`, [{ text: "閉じる", action: "close" }]);
          }, 200);
          return;
        }

        f.calledStreamCoupon = true;
        hintEl.textContent = "発信中...";
        callBtn.disabled = true;
        clearBtn.disabled = true;
        try {
          playSE("se-call");
        } catch (e) {}
        setTimeout(() => {
          try {
            playSE("se-receiver");
          } catch (e) {}
          showModal(
            "発信結果",
            `
              <div style="text-align:center;">
                <img src="${IMAGES.modals.stream}" style="width:400px;max-width:100%;display:block;margin:0 auto 16px;">
                <p style="margin:0; line-height:1.8; text-align:left;">はい、streamです。…クーポン券ご利用ですね。</p>
              </div>
            `,
            [{ text: "お願いします", action: "close" }],
          );
          updateMessage("デリバリー専門店に電話を掛けた");
        }, 1100);
        return;
      }

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
      title: "🏠 TRUE END",
      label: "TRUE END",
      desc: "お家に帰ってきました",
    },

    end: {
      title: "🌕 NORMAL END ",
      label: "NORMAL END ",
      desc: "プレイありがとうございました！",
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfILZd1JSjBZcfe6Xp-4_TtxKAHv-XhFPsw3Vu_-uaH5A3DvA/viewform";
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

function showComplaintNoiseBadEnd() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.badend}" alt="bad end" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
      <div>お客さんを怒らせてしまった…</div>
    </div>
  `;
  pauseBGM();
  playSE("se-shakin");
  showModal("【BAD END:音の暴力】＃％＆＊＠！！？？", content, [{ text: "最初から", action: "restart" }]);
  updateMessage("BAD END: 音の暴力");
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
    if (isCurtainRodPair) {
      clearUsingItem(true);
      removeItem("curtain");
      removeItem("rod");
      addItem("curtainRod");
      showModal("カーテンと突っ張り棒を組み合わせた！", `<img src="${IMAGES.items.curtainRod}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
      updateMessage("カーテンと突っ張り棒を組み合わせた！");
      return;
    }

    const isBatteryPenLightPair = (a === "battery" && b === "penLightEmpty") || (a === "penLightEmpty" && b === "battery");
    if (isBatteryPenLightPair) {
      clearUsingItem(true);
      removeItem("battery");
      removeItem("penLightEmpty");
      addItem("penLight");
      showModal("電池をペンライトにセットした", `<img src="${IMAGES.modals.batterySet}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
      updateMessage("電池をペンライトにセットした");
      return;
    }

    const isBatterySaturnPair = (a === "battery" && b === "objectSaturn") || (a === "objectSaturn" && b === "battery");
    if (isBatterySaturnPair) {
      clearUsingItem(true);
      removeItem("battery");
      removeItem("objectSaturn");
      addItem("lightSaturn");
      playSE("se-switch");
      showModal("電池をセットした", `<img src="${IMAGES.modals.putBattery}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
      updateMessage("電池をセットした");
      return;
    }

    const isAlcoholTissuePair = (a === "alcohol" && b === "tissue") || (a === "tissue" && b === "alcohol");
    if (isAlcoholTissuePair) {
      clearUsingItem(true);
      removeItem("alcohol");
      removeItem("tissue");
      addItem("wetTissue");
      showModal("ポケットティッシュに消毒用アルコールを垂らした", `<img src="${IMAGES.modals.tissueAlcohol}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
      updateMessage("ポケットティッシュに消毒用アルコールを垂らした");
      return;
    }

    const isHandyLightMemoPair = (a === "handyLight" && b === "memo") || (a === "memo" && b === "handyLight");
    if (isHandyLightMemoPair) {
      clearUsingItem(true);
      playSE?.("se-switch");
      const memoLightImage = uiLang === "en" ? IMAGES.modals.memoLightEn : IMAGES.modals.memoLight;
      showModal("メモをライトで照らした", `<img src="${memoLightImage}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
      updateMessage("メモをライトで照らした");
      return;
    }

    const isLoupeMapPair = (a === "loupe" && b === "map") || (a === "map" && b === "loupe");
    if (isLoupeMapPair) {
      clearUsingItem(true);
      showModal("学者の虫眼鏡を使った。文字が浮かび上がっている", `<img src="${IMAGES.modals.mapN}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
      updateMessage("学者の虫眼鏡を使った。文字が浮かび上がっている");
      return;
    }

    const isLoupeHammerPair = (a === "loupe" && b === "hammer") || (a === "hammer" && b === "loupe");
    if (isLoupeHammerPair) {
      clearUsingItem(true);
      showModal("学者の虫眼鏡を使った。文字が浮かび上がっている", `<img src="${IMAGES.modals.hammerString}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
      updateMessage("学者の虫眼鏡を使った。文字が浮かび上がっている");
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
    key: "カギ",
    memo: "顧客対応メモ",
    stamp: "スタンプ",
    tissue: "ティッシュ",
    alcohol: "アルコール",
    wetTissue: "ウェットティッシュ",
    coupon: "クーポン",
    handyLight: "懐中電灯",
    dinner: "お弁当",

    fileFresh: "新人研修ファイル",
    manual: "クレーム処理マニュアル",
    fileProperty: "物件ファイル",
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
                        <li>物件ファイルからクレームがあった物件の電話番号を調べる</li>
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

// ゲーム開始
preloadImages();
initGame();
