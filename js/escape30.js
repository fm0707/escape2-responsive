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
const BASE_30 = USE_LOCAL_ASSETS ? "images/30" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/30";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I30 = (file) => `${BASE_30}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
// ゲーム設定 - 画像パスをここで管理
let IMAGES = {
  rooms: {
    gate: [I30("gate.webp")],
    ticketArea: [I30("ticket_area.webp")],
    fujiTunnel: [I30("fuji_tunnel.webp")],
    stampAreaFuji: [I30("stamp_area_fuji.webp")],
    stampAreaPond: [I30("stamp_area_pond.webp")],
    stampAreaMomiji: [I30("stamp_area_momiji.webp")],
    deskPond: [I30("desk_pond.webp")],
    winterArea: [I30("winter_area.webp")],

    // book1: {
    //   jp: [I30("book_1.png")],
    //   en: [I30("book_1en.png")],
    // },
    // book2: {
    //   jp: [I30("book_2.png")],
    //   en: [I30("book_2en.png")],
    // },

    end: [I30("end.webp"), I30("end2.webp")],
    trueEnd: [I30("true_end.webp"), I30("true_end2.webp")],
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
    robo: I30("robo.webp"),
    wallet: I30("wallet.webp"),
    walletFull: I30("wallet_full.webp"),
    walletOpen: I30("wallet_open.webp"),
    yen200: I30("200yen.webp"),
    ticket: I30("ticket.webp"),
    souvenirVoucher: I30("souvenir_voucher.webp"),
    lod: I30("lod.webp"),
    lodWithHook: I30("lod_hook.webp"),
    hook: I30("hook.webp"),
    sheet: I30("sheet0.webp"),
    sheetComplete3: I30("sheet_complete_3.webp"),
    sheetComplete3extra: I30("sheet_complete_3extra.webp"),
    stampViolet: I30("stamp_violet.webp"),
    stampGreen: I30("stamp_green.webp"),
    stampBrownBase: I30("stamp_brown_base.webp"),
    stampBrown1: I30("stamp_brown_1.webp"),
    stampBodyGreen: I30("stamp_body_green.webp"),
    tape: I30("tape.webp"),
    tsubo: I30("tsubo.webp"),
    tsuboFixed: I30("tsubo_fixed.webp"),
    tsuboWater: I30("tsubo_water.webp"),
    hisyaku: I30("hisyaku.webp"),
    net: I30("net.webp"),
    annualPassUnknown: I30("annual_pass_unknown.webp"),
    clock1: I30("clock_1.webp"),
    clock2: I30("clock_2.webp"),
    bearGuide: I30("bear_guide.webp"),
    manju: I30("manju_close.webp"),
    seal: I30("seal.webp"),
  },

  modals: {
    fujiNum: I30("fuji_num.webp"),
    fujiFlower: I30("modal_fuji_flower.webp"),
    walletOpen: I30("modal_wallet_open.webp"),
    posterRobo: I30("modal_poster_robo.webp"),
    posterRoboEn: I30("modal_poster_robo_en.webp"),
    posterStamp: I30("modal_poster_stamp.webp"),
    posterFuji: I30("modal_poster_fuji.webp"),
    posterFujiEn: I30("modal_poster_fuji_en.webp"),
    roboTicketRequire: I30("modal_robo_ticket_require.webp"),
    roboTicketComfirm: I30("modal_robo_ticket_comfirm.webp"),
    roboComfirmPond: I30("modal_robo_confirm_pond.webp"),
    roboComfirmWallet: I30("modal_robo_confirm_wallet.webp"),
    roboConfirmWallet: I30("modal_robo_confirm_wallet.webp"),
    roboGiveYen: I30("modal_robo_give_yen.webp"),
    stampPut: I30("modal_stamp_put.webp"),
    stampPut2: I30("modal_stamp_put2.webp"),
    pondNum: I30("modal_pond_num.webp"),
    ukiwaLine: I30("modal_ukiwa_line.webp"),
    badendPondMaster: I30("modal_badend_pond_master.webp"),
    annualPass: I30("modal_annual_pass.webp"),
    annualPassInfo: I30("modal_annual_pass_info.webp"),
    lanternH: I30("modal_lantern_h.webp"),
    lanternO: I30("modal_lantern_o.webp"),
    lanternN: I30("modal_lantern_n.webp"),
    lanternE: I30("modal_lantern_e.webp"),
    lanternY: I30("modal_lantern_y.webp"),
    tsuboFix1: I30("modal_tsubo_fix1.webp"),
    tsuboFix2: I30("modal_tsubo_fix2.webp"),
    tsuboWaterIn: I30("modal_tsubo_water_in.webp"),
    roboUpset: I30("modal_robo_upset.webp"),
    pondBoss: I30("modal_pond_boss.webp"),
    papiyon: I30("modal_papiyon.webp"),
    bearGuide: I30("modal_bear_guide.webp"),
    soulGive: I30("modal_soul_give.webp"),
    lockerTop: I30("modal_locker_top2.webp"),
    bearShocked: I30("modal_bear_shocked.webp"),
    sheetZoom: I30("modal_sheet_zoom.webp"),
    roboTicket: I30("modal_robo_ticket.webp"),

    // bearHappy: I30("modal_bear_happy.jpeg"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState30";
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
    currentRoom: "ticketArea",
    openRooms: ["ticketArea"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        plugOn: false,
        foundWallet: false,
        foundTicket: false,
        foundHook: false,
        foundKey: false,
        foundStampBodyGreen: false,
        foundHisyaku: false,
        foundTape: false,

        unlockMachine: false,
        unlockDrawerMain: false,
        unlockDrawerTop: false,
        unlockDrawerMiddle: false,
        unlockDrawerBottom: false,
        unlockDeskPondTop: false,
        unlockMomijiLockerTop: false,
        unlockMomijiLockerBottom: false,
        unlockGate: false,
        clearFishing: false,
        putStampBody: false,
        setHook: false,
        stampMomijiUsable: false,
        ticketMachineReady: false,
        ticketMachineSolved: false,
        fujiTunnelRoboChecked: false,
        fujiTunnelRoboLeaving: false,
        fujiTunnelRoboMoved: false,
        pondRoboLeaving: false,
        pondRoboMoved: false,
        fujiTunnelBearGuideGone: false,

        isNight: false,

        notebookDeckHintAdded: false,

        sheetStampCompleted: false,

        sheetStampCount: 0,
        sheetTakeCount: 0,
        sheetCurrentNo: 0,
        timePhase: 0,

        sheetStamps: {},
        sheetStampOrder: [],
        sheetOrderWrong: false,
        confirmPapiyon: false,
        unlockFujiTunnelBearGuide: false,
        winterSoulGiftDone: false,

        talkTo: { bear: 0 },
        backgroundState: 0,
      },
    },
    endWorse: {
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
    usingItem: null,
    endings: { true: false, normal2: false, normal: false },
  };
}

let gameState = getDefaultGameState();

const STAMP_SHEET_CORRECT_ORDER_FIRST = ["stampViolet", "stampGreen", "stampMomiji"];
const STAMP_SHEET_CORRECT_ORDER_EXTRA = ["stampMomiji", "stampViolet", "stampGreen"];

function resetActiveSheetProgress(f) {
  f.sheetStamps = {};
  f.sheetStampOrder = [];
  f.sheetStampCount = 0;
  f.sheetStampCompleted = false;
  f.sheetOrderWrong = false;
  f.sheetCurrentNo = 0;
}

function onTakeNewSheet() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.sheetTakeCount = (Number(f.sheetTakeCount) || 0) + 1;
  f.sheetCurrentNo = f.sheetTakeCount;
  f.sheetStamps = {};
  f.sheetStampOrder = [];
  f.sheetStampCount = 0;
  f.sheetStampCompleted = false;
  f.sheetOrderWrong = false;
}

function applySheetStamp(stampKey) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const stampState = f.sheetStamps || (f.sheetStamps = {});
  if (stampState[stampKey]) return { ok: false, reason: "already" };

  stampState[stampKey] = true;

  const order = Array.isArray(f.sheetStampOrder) ? f.sheetStampOrder : (f.sheetStampOrder = []);
  order.push(stampKey);

  const currentSheetNo = Number(f.sheetCurrentNo) || 1;
  const expectedOrder = currentSheetNo >= 2 ? STAMP_SHEET_CORRECT_ORDER_EXTRA : STAMP_SHEET_CORRECT_ORDER_FIRST;
  if (currentSheetNo >= 2) {
    const idx = order.length - 1;
    if (expectedOrder[idx] !== stampKey) {
      f.sheetOrderWrong = true;
    }
  }

  const stampCount = Object.values(stampState).filter(Boolean).length;
  f.sheetStampCount = stampCount;

  if (stampCount >= 3) {
    f.sheetStampCompleted = true;
    const shouldCreateExtra = currentSheetNo >= 2 && !!f.confirmPapiyon && !f.sheetOrderWrong;
    if (shouldCreateExtra) {
      f.unlockFujiTunnelBearGuide = true;
    }
    showToast("絵柄が完成した！");
    removeItem("sheet");
    addItem(shouldCreateExtra ? "sheetComplete3extra" : "sheetComplete3");
    resetActiveSheetProgress(f);
    return { ok: true, completed: true, wrongOrder: false };
  }

  return { ok: true, completed: false, wrongOrder: !!f.sheetOrderWrong };
}

// 部屋データ
let rooms = {
  gate: {
    name: "正門前",
    description: "",
    clickableAreas: [
      {
        x: 34.4,
        y: 54.8,
        width: 31.1,
        height: 29.3,
        onClick: clickWrap(
          function () {
            const f = gameState.main.flags || (gameState.main.flags = {});
            if (!f.unlockGate) {
              updateMessage("門はロックされている");
              return;
            }
            handleDoor();
          },
          { allowAtNight: true },
        ),
        description: "門",
        zIndex: 1,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 47.3,
        y: 66.7,
        width: 5.6,
        height: 5.0,
        onClick: clickWrap(
          function () {
            showGateLockPuzzle();
          },
          { allowAtNight: true },
        ),
        description: "門のロック",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 30.3,
        y: 13.7,
        width: 41.2,
        height: 17.5,
        onClick: clickWrap(function () {
          updateMessage("塀の外には街が広がっている");
        }),
        description: "塀の外には街が広がっている",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 67.4,
        y: 58.5,
        width: 3.6,
        height: 11.8,
        onClick: clickWrap(function () {}),
        description: "ロック表示部",
        zIndex: 5,
        usable: () => false,
        item: { img: () => (gameState.main.flags.unlockGate ? "greenBack" : "redBack"), visible: () => true },
      },

      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("ticketArea");
          },
          { allowAtNight: true },
        ),
        description: "正門戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  ticketArea: {
    name: "チケット売り場",
    description: "",
    clickableAreas: [
      {
        x: 45.9,
        y: 15.8,
        width: 3.8,
        height: 3.2,
        onClick: clickWrap(function () {}),
        description: "時計の針",
        zIndex: 5,
        usable: () => false,
        item: { img: "clock1", visible: () => !gameState.main.flags.openShop },
      },
      {
        x: 45.9,
        y: 15.2,
        width: 6.0,
        height: 3.9,
        onClick: clickWrap(function () {}),
        description: "時計の針2",
        zIndex: 5,
        usable: () => false,
        item: { img: "clock2", visible: () => gameState.main.flags.openShop },
      },
      {
        x: 34.4,
        y: 45.2,
        width: 11.7,
        height: 20.3,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.ticketMachineSolved) {
            updateMessage(f.foundTicket ? "もう何も出てこない" : "チケットが出ている");
            return;
          }
          if (hasItem("yen200")) {
            if (!f.ticketMachineReady) {
              f.ticketMachineReady = true;
              showModal("お金を入れた", "", [{ text: "閉じる", action: "close" }], () => {
                updateMessage("お金を入れた");
                removeItem("yen200");
                playSE("se-coin-return");
              });
            } else {
              showTicketMachinePuzzle();
            }
            return;
          }
          if (f.ticketMachineReady) {
            showTicketMachinePuzzle();
            return;
          }
          updateMessage("お金があれば買えそうだ");
        }),
        description: "チケットマシン",
        zIndex: 1,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 36.9,
        y: 57.3,
        width: 6.1,
        height: 4.6,
        onClick: clickWrap(function () {
          acquireItemOnce("foundTicket", "ticket", "出てきたチケット", IMAGES.items.ticket, "チケットを手に入れた");
        }),
        description: "出てきたチケット",
        zIndex: 5,
        usable: () => !!gameState.main.flags.ticketMachineSolved && !gameState.main.flags.foundTicket,
        item: { img: "ticket", visible: () => !!gameState.main.flags.ticketMachineSolved && !gameState.main.flags.foundTicket },
      },
      {
        x: 58.7,
        y: 36.4,
        width: 4.7,
        height: 7.1,
        onClick: clickWrap(function () {
          updateMessage("入場料は200円だ");
        }),
        description: "料金説明の紙",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 45.0,
        y: 33.2,
        width: 8.2,
        height: 6.7,
        onClick: clickWrap(function () {
          updateMessage("チケット売り場だ。誰もいない");
        }),
        description: "チケット売り場の紙",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 71.7,
        y: 14.9,
        width: 18.4,
        height: 11.6,
        onClick: clickWrap(function () {
          updateMessage("園の名称のようだ");
        }),
        description: "庭園の名前の表示",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 20.2,
        y: 52.2,
        width: 8.3,
        height: 8.2,
        onClick: clickWrap(function () {
          showObj(null, "年間パスポートの案内だ", IMAGES.modals.annualPassInfo, "年間パスポートの案内だ");
        }),
        description: "年間パスポートの案内",
        zIndex: 5,
        usable: () => gameState.main.flags.openShop,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 21.5,
        y: 61.0,
        width: 8.6,
        height: 4.5,
        onClick: clickWrap(function () {
          showObj(null, "年間パスポートの見本だ", IMAGES.modals.annualPass, "年間パスポートの見本だ");
        }),
        description: "年間パスポートの見本",
        zIndex: 5,
        usable: () => gameState.main.flags.openShop,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 14.1,
        y: 47.2,
        width: 5.3,
        height: 7.2,
        onClick: clickWrap(function () {
          updateMessage("オリジナルシールの案内だ");
        }),
        description: "シールの案内",
        zIndex: 5,
        usable: () => gameState.main.flags.openShop,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 10.1,
        y: 60.6,
        width: 8.7,
        height: 4.9,
        onClick: clickWrap(function () {
          updateMessage("オリジナルシールが並んでいる");
        }),
        description: "オリジナルシール",
        zIndex: 5,
        usable: () => gameState.main.flags.openShop,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 10.7,
        y: 53.7,
        width: 19.2,
        height: 11.6,
        onClick: clickWrap(function () {
          updateMessage("物販は、準備中のようだ");
        }),
        description: "ネット",
        zIndex: 5,
        usable: () => !gameState.main.flags.openShop,
        item: { img: "net", visible: () => !gameState.main.flags.openShop },
      },
      {
        x: 10.4,
        y: 71.8,
        width: 23.9,
        height: 27.4,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem == "souvenirVoucher") {
            if (f.gotSouvenirSeal) {
              updateMessage("交換は済んでいるようだ");
              return;
            }
            removeItem("souvenirVoucher");
            f.gotSouvenirSeal = true;
            addItem("seal");
            showModal("ふむ。お土産と引き換えですね。<br>こちらをどうぞ", `<img src="${IMAGES.modals.roboTicket}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
            updateMessage("シールを手に入れた");
            return;
          }
          if (gameState.selectedItem == "annualPassUnknown") {
            updateMessage("ご主人…");
            return;
          }
          if (gameState.selectedItem == "seal") {
            updateMessage("当園の魅力を伝えるオリジナルシールです");
            return;
          }
          updateMessage("お得な年間パスポートはいかがですか？");
        }),
        description: "管理ロボ",
        zIndex: 5,
        usable: () => gameState.main.flags.openShop,
        item: { img: "robo", visible: () => gameState.main.flags.openShop },
      },
      {
        x: 76.8,
        y: 35.8,
        width: 13.7,
        height: 13.5,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterRobo, "管理ロボのポスターだ", IMAGES.modals.posterRoboEn);
        }),
        description: "管理ポスター",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 69.9,
        y: 47.9,
        width: 11.1,
        height: 11.0,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterStamp, "スタンプラリーのポスターだ");
        }),
        description: "スタンプラリーポスター",
        zIndex: 4,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 17.0,
        y: 33.1,
        width: 11.7,
        height: 10.9,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterFuji, "藤棚のポスターだ", IMAGES.modals.posterFujiEn);
        }),
        description: "富士のポスター",
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
            changeRoom("fujiTunnel");
          },
          { allowAtNight: true },
        ),
        description: "チケット売り場左",
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
            changeRoom("gate");
          },
          { allowAtNight: true },
        ),
        description: "チケットエリア戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  fujiTunnel: {
    name: "藤棚",
    description: "",
    clickableAreas: [
      {
        x: 51.4,
        y: 67.3,
        width: 14.2,
        height: 11.8,
        onClick: clickWrap(function () {
          if (!gameState.main.flags.fujiTunnelRoboMoved) {
            updateMessage("管理ロボが出口を見張っている");
            return;
          }
          changeRoom("stampAreaFuji");
        }),
        description: "藤棚の先（出口）",
        zIndex: 1,
        usable: () => !!gameState.main.flags.fujiTunnelRoboMoved,
        item: { img: "blueBack", visible: () => !!gameState.main.flags.fujiTunnelRoboMoved },
      },
      {
        x: 51.1,
        y: 71.1,
        width: 13.8,
        height: 12.1,
        onClick: clickWrap(function () {
          const f = gameState.main.flags;
          if (gameState.selectedItem === "walletFull") {
            showModal(
              "管理ロボ",
              `
                <div style="text-align:center;">
                  <div class="modal-anim">
                    <img src="${IMAGES.modals.roboConfirmWallet}">
                    <img src="${IMAGES.modals.roboGiveYen}">
                  </div>
                  <p style="margin:12px 0 0;">落とし物ですか。ありがとうございます。これは謝礼です。</p>
                </div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            removeItem("walletFull");
            addItem("yen200");
            updateMessage("200円を手に入れた");
            return;
          }
          if (gameState.selectedItem === "ticket") {
            if (f.fujiTunnelRoboChecked || f.fujiTunnelRoboMoved) {
              updateMessage("管理ロボは別の場所へ移動したようだ");
              return;
            }
            f.fujiTunnelRoboChecked = true;
            f.fujiTunnelRoboLeaving = true;
            showObj(null, "ロボはチケットを確認した", IMAGES.modals.roboTicketComfirm, "管理ロボは別の場所へ移動したようだ");
            playSE("se-cyber");
            window.addEventListener("modal:closed", () => fadeOutFujiTunnelRobo(), { once: true });
            return;
          }
          showObj(null, "チケットをお持ちですか？", IMAGES.modals.roboTicketRequire, "管理ロボはチケットを要求している");
        }),
        description: "ロボ",
        zIndex: 5,
        usable: () => !gameState.main.flags.fujiTunnelRoboChecked,
        item: { img: "robo", visible: () => !gameState.main.flags.fujiTunnelRoboMoved },
      },
      {
        x: 78.9,
        y: 87.6,
        width: 5.9,
        height: 6.4,
        onClick: clickWrap(function () {
          acquireItemOnce("foundWallet", "walletFull", "財布が落ちていた", IMAGES.items.walletFull, "財布を拾った");
        }),
        description: "財布",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundWallet,
        item: { img: "wallet", visible: () => !gameState.main.flags.foundWallet },
      },
      {
        x: 0.3,
        y: 50.8,
        width: 43.4,
        height: 31.7,
        onClick: clickWrap(function () {
          updateMessage("藤棚の柵だ");
        }),
        description: "藤棚の柵",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 50.6,
        y: 57.5,
        width: 15.6,
        height: 7.2,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.fujiFlower, "藤の花だ");
        }),
        description: "藤の花",
        zIndex: 5,
        usable: () => true,
        item: { img: "", visible: () => true },
      },
      {
        x: 71.3,
        y: 70.2,
        width: 4.7,
        height: 6.6,
        onClick: clickWrap(function () {
          showObj("confirmPapiyon", "", IMAGES.modals.papiyon, "蝶が居る");
        }),
        description: "藤棚右の蝶",
        zIndex: 5,
        usable: () => hasItem("sheetComplete3"),
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 43.9,
        y: 68.7,
        width: 13.2,
        height: 13.2,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "hisyaku") {
            playSE("se-pop");

            showModal("痛っ！", `<img src="${IMAGES.modals.bearShocked}" style="width:400px;max-width:100%;display:block;margin:0 auto 12px;">`, [{ text: "閉じる", action: "close" }]);
            window.addEventListener("modal:closed", () => fadeOutFujiTunnelBearGuide(), { once: true });
            return;
          }
          showModal(
            "クマガイド",
            `
              <div style="text-align:center;margin-bottom:10px;">今ならシークレットガイドツアー開催中だよ！参加する？</div>
              <img src="${IMAGES.modals.bearGuide}" style="width:400px;max-width:100%;display:block;margin:0 auto 12px;">
            `,
            [
              {
                text: "はい",
                action: () => {
                  closeModal();
                  playSE?.("se-scene-change");
                  quickBlackFade?.(420);
                  setTimeout(() => {
                    changeRoom("winterArea");
                  }, 180);
                },
              },
              { text: "いいえ", action: "close" },
            ],
          );
        }),
        description: "クマガイド",
        zIndex: 5,
        usable: () => !!gameState.main.flags.unlockFujiTunnelBearGuide && !gameState.main.flags.fujiTunnelBearGuideGone,
        item: { img: "bearGuide", visible: () => !!gameState.main.flags.unlockFujiTunnelBearGuide && !gameState.main.flags.fujiTunnelBearGuideGone },
      },
      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("ticketArea");
          },
          { allowAtNight: true },
        ),
        description: "藤棚右",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  stampAreaFuji: {
    name: "藤のスタンプテント",
    description: "",
    clickableAreas: [
      {
        x: 39.6,
        y: 60.6,
        width: 12.6,
        height: 6.3,
        onClick: clickWrap(function () {
          if (gameState.selectedItem !== "sheet") {
            updateMessage("藤のスタンプだ");
            return;
          }

          const f = gameState.main.flags || (gameState.main.flags = {});
          const stampState = f.sheetStamps || (f.sheetStamps = {});
          if (stampState.stampViolet) {
            updateMessage("もう押してある");
            return;
          }
          const res = applySheetStamp("stampViolet");
          playSE?.("se-hanko");

          showModal(
            "藤のスタンプを押した",
            `
            <div class="modal-anim">
              <img src="${IMAGES.modals.stampPut}">
              <img src="${IMAGES.modals.stampPut2}">
            </div>
          `,
            [{ text: "閉じる", action: "close" }],
          );
          updateMessage(res.wrongOrder ? "スタンプを押した。順番が違うかもしれない" : "スタンプを押した");
        }),
        description: "スタンプ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 52.9,
        y: 63.6,
        width: 9.8,
        height: 5.2,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          const stampState = f.sheetStamps || {};
          const stampCount = Number.isFinite(f.sheetStampCount) ? f.sheetStampCount : Object.values(stampState).filter(Boolean).length;
          const isSheetCompleted = (!!f.sheetStampCompleted || stampCount >= 3) && !f.sheetOrderWrong;
          const complete3Count = gameState.inventory.filter((id) => id === "sheetComplete3").length;
          const canTakeSheet = !hasItem("sheet") || isSheetCompleted;

          if (f.unlockFujiTunnelBearGuide) {
            updateMessage("台紙はもう十分集めた。新しい台紙はもう取らなくてよさそうだ");
            return;
          }

          if (complete3Count >= 2) {
            updateMessage("完成した台紙が多い。先に1枚ゴミ箱に捨てよう");
            return;
          }

          if (!canTakeSheet) {
            updateMessage("今は、未完成のスタンプの台紙をすでに持っている");
            return;
          }

          showModal("スタンプの台紙がある。持っていきますか？", "", [
            {
              text: "はい",
              action: () => {
                addItem("sheet");
                onTakeNewSheet();
                updateMessage("スタンプの台紙を手に入れた");
                closeModal();
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "台紙",
        zIndex: 4,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 69.0,
        y: 64.8,
        width: 13.8,
        height: 18.8,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          const complete3Count = gameState.inventory.filter((id) => id === "sheetComplete3").length;
          if (complete3Count >= 2) {
            showModal("確認", "完成した台紙を1枚捨てますか？", [
              {
                text: "はい",
                action: () => {
                  removeItem("sheetComplete3");
                  closeModal();
                  updateMessage("完成した台紙をゴミ箱に捨てた");
                },
              },
              { text: "いいえ", action: "close" },
            ]);
            return;
          }
          if (!hasItem("sheet")) {
            updateMessage("ゴミ箱がある");
            return;
          }
          const currentNo = Number(f.sheetCurrentNo) || 1;
          if (currentNo <= 1) {
            updateMessage("ゴミ箱がある");
            return;
          }
          if (!f.sheetOrderWrong) {
            updateMessage("まだ捨てる必要はなさそうだ");
            return;
          }

          showModal("確認", "未完成の台紙を捨てますか？", [
            {
              text: "はい",
              action: () => {
                removeItem("sheet");
                resetActiveSheetProgress(f);
                closeModal();
                updateMessage("台紙をゴミ箱に捨てた");
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "ゴミ箱",
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
            changeRoom("stampAreaPond");
          },
          { allowAtNight: true },
        ),
        description: "スタンプエリア藤左",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 63.1,
        y: 41.5,
        width: 14.3,
        height: 13.4,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.ukiwaLine, "絵が描かれている");
        }),
        description: "テント内部の図",
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
            changeRoom("fujiTunnel");
          },
          { allowAtNight: true },
        ),
        description: "スタンプエリア藤戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  stampAreaPond: {
    name: "池のスタンプテント",
    description: "",
    clickableAreas: [
      {
        x: 34.2,
        y: 30.2,
        width: 15.4,
        height: 16.4,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.pondRoboMoved) {
            updateMessage("管理ロボは巡回に戻ったようだ");
            return;
          }
          if (gameState.selectedItem == "annualPassUnknown") {
            updateMessage("ご主人…");
            return;
          }
          if (gameState.selectedItem == "hisyaku") {
            updateMessage("叩かないでください");
            return;
          }
          if (f.clearFishing) {
            if (f.pondRoboLeaving) {
              updateMessage("管理ロボは巡回に戻ろうとしている");
              return;
            }
            f.pondRoboLeaving = true;
            showModal(
              "確認完了",
              `
                <div style="text-align:center;">
                  <img src="${IMAGES.modals.roboComfirmPond}" alt="robo confirm pond"
                    style="max-width:400px;width:100%;display:block;margin:0 auto 14px;">
                  <p style="margin:0;">異物除去確認しました。受付エリアの業務に移ります。</p>
                </div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            playSE("se-cyber");
            gameState.main.flags.openShop = true;
            window.addEventListener("modal:closed", () => fadeOutPondRobo(), { once: true });
            return;
          }
          playSE("se-glich");
          showObj(null, "池に異物検知。除去が必要です", IMAGES.modals.roboUpset, "池に異物が沈んでいるようだ");
        }),
        description: "ロボ",
        zIndex: 5,
        usable: () => !gameState.main.flags.pondRoboMoved,
        item: { img: "robo", visible: () => !gameState.main.flags.pondRoboMoved },
      },
      {
        x: 31.8,
        y: 62.5,
        width: 15.9,
        height: 14.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "hook") {
            removeItem("hook");
            f.setHook = true;
            renderCanvasRoom();
            updateMessage("釣り竿に釣り針を取り付けた");
            return;
          }
          updateMessage("釣り竿がある。釣り針が付いていない");
        }),

        description: "釣り竿（針無し）",
        zIndex: 5,
        usable: () => !gameState.main.flags.setHook,
        item: { img: "lod", visible: () => !gameState.main.flags.setHook },
      },
      {
        x: 30.8,
        y: 62.5,
        width: 16.9,
        height: 15.9,
        onClick: clickWrap(function () {
          if (gameState.main.flags.clearFishing) {
            updateMessage("池にはもう異物はない。釣りは必要なさそうだ");
            return;
          }
          showModal("確認", "釣り竿を使いますか？", [
            {
              text: "はい",
              action: () => {
                closeModal();
                showPondFishingGame();
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "釣り竿（針付き）",
        zIndex: 5,
        usable: () => gameState.main.flags.setHook,
        item: { img: "lodWithHook", visible: () => gameState.main.flags.setHook },
      },
      {
        x: 5.2,
        y: 72.9,
        width: 17.0,
        height: 13.1,
        onClick: clickWrap(function () {
          updateMessage("浮き輪がある");
        }),
        description: "浮き輪",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 10.0,
        y: 55.2,
        width: 18.8,
        height: 15.7,
        onClick: clickWrap(function () {
          if (gameState.selectedItem == "tsubo") {
            updateMessage("上手く水をすくえない…");
            return;
          }
          if (gameState.selectedItem == "tsuboFixed") {
            updateMessage("この壺では上手く水をすくえない…");
            return;
          }
          if (gameState.selectedItem == "hisyaku" && !hasItem("tsuboFixed")) {
            updateMessage("水をすくっても、入れるものが無い。なにか容器が必要だ");
            return;
          }
          if (gameState.selectedItem == "hisyaku" && hasItem("tsuboFixed")) {
            updateMessage("水をすくって壺に入れた");
            showObj(null, "水をすくって壺に入れた", IMAGES.modals.tsuboWaterIn, "水が入った壺を手に入れた");
            removeItem("tsuboFixed");
            addItem("tsuboWater");
            return;
          }
          showObj(null, "", IMAGES.modals.pondNum, "水面だ。底は良く見えない");
        }),
        description: "水面",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 71.9,
        y: 47.4,
        width: 10.4,
        height: 6.7,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "sheet") {
            if (!f.putStampBody) {
              updateMessage("スタンプ台はあるが、スタンプ本体が無いようだ");
              return;
            }
            const stampState = f.sheetStamps || (f.sheetStamps = {});
            if (stampState.stampGreen) {
              updateMessage("もう押してある");
              return;
            }
            const res = applySheetStamp("stampGreen");
            playSE?.("se-hanko");

            showModal(
              "緑のスタンプを押した",
              `
                <div class="modal-anim">
                  <img src="${IMAGES.modals.stampPut}">
                  <img src="${IMAGES.modals.stampPut2}">
                </div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            updateMessage(res.wrongOrder ? "スタンプを押した。順番が違うかもしれない" : "スタンプを押した");
            return;
          }
          if (f.putStampBody) {
            updateMessage("緑のスタンプ台にスタンプ本体が設置されている");
            return;
          }
          if (gameState.selectedItem === "stampBodyGreen") {
            removeItem("stampBodyGreen");
            f.putStampBody = true;
            showModal("設置完了", "スタンプ本体を設置した", [{ text: "閉じる", action: "close" }]);
            renderCanvasRoom();
            return;
          }
          updateMessage("緑のスタンプ台だ");
        }),
        description: "スタンプ台",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 73.0,
        y: 45.8,
        width: 7.2,
        height: 5.9,
        onClick: clickWrap(function () {}),
        description: "緑のスタンプ本体",
        zIndex: 5,
        usable: () => true,
        item: { img: "stampBodyGreen", visible: () => !!gameState.main.flags.putStampBody },
      },
      {
        x: 79.5,
        y: 55.4,
        width: 7.7,
        height: 14.1,
        onClick: clickWrap(function () {
          changeRoom("deskPond");
        }),
        description: "引き出し",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 38.3,
        y: 24.5,
        width: 8.6,
        height: 7.2,
        onClick: clickWrap(function () {
          changeRoom("stampAreaMomiji");
        }),
        description: "奥の通路",
        zIndex: 5,
        usable: () => gameState.main.flags.pondRoboMoved,
        item: { img: "blueBack", visible: () => gameState.main.flags.pondRoboMoved },
      },
      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("stampAreaFuji");
          },
          { allowAtNight: true },
        ),
        description: "池のスタンプエリア右",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },

  deskPond: {
    name: "池のテントの引き出し",
    description: "",
    clickableAreas: [
      {
        x: 52.4,
        y: 9.6,
        width: 38.5,
        height: 21.2,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockDeskPondTop) {
            showDeskPondTopPuzzle();
            return;
          }
          playDeskPondDrawerOpenFx("引き出し上段", () => {
            acquireItemOnce("foundStampBodyGreen", "stampBodyGreen", "スタンプの本体がある", IMAGES.items.stampBodyGreen, "緑のスタンプ本体を手に入れた");
          });
        }),
        description: "引き出し上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 52.4,
        y: 33.7,
        width: 38.1,
        height: 20.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockDrawerMiddle) {
            showDrawerMiddlePuzzle();
            return;
          }
          playDeskPondDrawerOpenFx("引き出し中段", () => {
            acquireItemOnce("foundHook", "hook", "釣り針がある", IMAGES.items.hook, "釣り針を手に入れた");
          });
        }),
        description: "引き出し中段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 52.5,
        y: 57.9,
        width: 38.3,
        height: 27.8,
        onClick: clickWrap(function () {
          playDeskPondDrawerOpenFx("引き出し下段", () => {
            acquireItemOnce("foundHisyaku", "hisyaku", "ひしゃくがある", IMAGES.items.hisyaku, "ひしゃくを手に入れた");
          });
        }),
        description: "引き出し下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 25.6,
        y: 50.4,
        width: 11.6,
        height: 7.5,
        onClick: clickWrap(function () {
          acquireItemOnce("foundAnnualPassUnknown", "annualPassUnknown", "何か落ちている", IMAGES.items.annualPassUnknown, "誰かの年間パスポートを手に入れた");
        }),
        description: "落ちているチケット",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundAnnualPassUnknown,
        item: { img: "annualPassUnknown", visible: () => !gameState.main.flags.foundAnnualPassUnknown },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("stampAreaPond");
          },
          { allowAtNight: true },
        ),
        description: "池のテントの引き出し戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },

  stampAreaMomiji: {
    name: "紅葉のスタンプテント",
    description: "",
    clickableAreas: [
      {
        x: 72.3,
        y: 75.0,
        width: 10.0,
        height: 7.7,
        onClick: clickWrap(function () {
          if (gameState.selectedItem == "tsuboWater") {
            removeItem("tsuboWater");
            addItem("tsuboFixed");
            playMomijiLeafEffect();
            showModal("水でインクを湿らせた", "<div>スタンプが使えるようになった</div>", [{ text: "閉じる", action: "close" }]);
            gameState.main.flags.stampMomijiUsable = true;
            return;
          }
          if (gameState.main.flags.stampMomijiUsable && gameState.selectedItem == "sheet") {
            const f = gameState.main.flags || (gameState.main.flags = {});
            const stampState = f.sheetStamps || (f.sheetStamps = {});
            if (stampState.stampMomiji) {
              updateMessage("もう押してある");
              return;
            }
            const res = applySheetStamp("stampMomiji");
            playSE?.("se-hanko");

            showModal(
              "紅葉のスタンプを押した",
              `
                <div class="modal-anim">
                  <img src="${IMAGES.modals.stampPut}">
                  <img src="${IMAGES.modals.stampPut2}">
                </div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            updateMessage(res.wrongOrder ? "スタンプを押した。順番が違うかもしれない" : "スタンプを押した");
            return;
          }
          if (gameState.main.flags.stampMomijiUsable) {
            updateMessage("紅葉のスタンプがある");
          } else {
            updateMessage("インクが乾燥してしまっている。もし水分があれば…");
          }
        }),
        description: "紅葉のスタンプ台",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 63.6,
        y: 68.3,
        width: 5.7,
        height: 6.8,
        onClick: clickWrap(function () {
          updateMessage("「お得な年間パスポート！お求めはチケット売り場にて」と書いてある");
        }),
        description: "テント内貼り紙",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 66.3,
        y: 28.5,
        width: 6.3,
        height: 4.6,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.lanternH, "灯篭だ");
        }),
        description: "灯篭H",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 15.5,
        y: 84.8,
        width: 7.1,
        height: 5.2,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.lanternO, "灯篭だ");
        }),
        description: "灯篭O",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 52.5,
        y: 74.4,
        width: 6.4,
        height: 5.2,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.lanternN, "灯篭だ");
        }),
        description: "灯篭N",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 18.9,
        y: 61.4,
        width: 5.9,
        height: 4.9,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.lanternE, "灯篭だ");
        }),
        description: "灯篭E",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 37.3,
        y: 28.9,
        width: 5.7,
        height: 4.5,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.lanternY, "灯篭だ");
        }),
        description: "灯篭Y",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 51.1,
        y: 8.0,
        width: 10.4,
        height: 8.7,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockMomijiLockerTop) {
            showMomijiLockerTopPuzzle();
            return;
          }
          if (f.foundTape) {
            showObj(null, "", IMAGES.modals.lockerTop, "ロッカー上段だ");
            return;
          }
          acquireItemOnce("foundTape", "tape", "テープがある", IMAGES.items.tape, "テープを手に入れた");
        }),
        description: "ロッカー上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 51.3,
        y: 17.5,
        width: 11.1,
        height: 9.2,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.unlockMomijiLockerBottom) {
            showMomijiLockerBottomPuzzle();
            return;
          }
          acquireItemOnce("foundSouvenirVoucher", "souvenirVoucher", "お土産引換券がある", IMAGES.items.souvenirVoucher, "お土産引換券を手に入れた");
        }),
        description: "ロッカー下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 5.4,
        y: 2.1,
        width: 32.2,
        height: 20.7,
        onClick: clickWrap(function () {
          updateMessage("見事な紅葉だ。");
        }),
        description: "紅葉",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 69.3,
        y: 80.7,
        width: 6.3,
        height: 9.0,
        onClick: clickWrap(function () {
          updateMessage("「この庭園を完成させた人物は、たびたびこの庭園を訪れて、四季折々の植物を楽しんでいたと伝えられています。」と書いてある");
        }),
        description: "貼り紙",
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
            changeRoom("stampAreaPond");
          },
          { allowAtNight: true },
        ),
        description: "スタンプエリア紅葉戻る",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },

  winterArea: {
    name: "冬のエリア",
    description: "",
    clickableAreas: [
      {
        x: 62.9,
        y: 1.1,
        width: 16.4,
        height: 19.7,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem == "annualPassUnknown") {
            updateMessage("「ほっほっほ…」");
            playSE("se-fofofo");
            return;
          }
          if (gameState.selectedItem == "seal") {
            updateMessage("「働き者じゃ」");
            playSE("se-fofofo");
            return;
          }
          if (gameState.selectedItem == "hisyaku") {
            updateMessage("叩いたりしたら、どうなるか分からない。やめておこう");
            return;
          }
          if (f.winterSoulGiftDone) {
            updateMessage("人魂は静かに漂っている");
            return;
          }
          playSE("se-fofofo");
          showModal("", `<div style="text-align:center;">よくぞ、ここまで来たな。<br>ロボを通して見ていたよ</div>`, [
            {
              text: "はい",
              action: () => {
                showModal(
                  "",
                  `
                      <div style="text-align:center;margin-bottom:10px;">これを持っていきなさい</div>
                      <img src="${IMAGES.modals.soulGive}" style="width:400px;max-width:100%;display:block;margin:0 auto 12px;">
                    `,
                  [
                    {
                      text: "受け取る",
                      action: () => {
                        f.winterSoulGiftDone = true;
                        closeModal();
                        acquireItemOnce("foundManju", "manju", "お饅頭を授かった", IMAGES.items.manju, "お饅頭を手に入れた");
                      },
                    },
                  ],
                );
              },
            },
          ]);
        }),
        description: "人魂",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 27.5,
        y: 22.2,
        width: 47.4,
        height: 27.1,
        onClick: clickWrap(function () {
          updateMessage("古そうな立派な橋だ");
        }),
        description: "立派な橋",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 27.2,
        y: 56.6,
        width: 20.8,
        height: 20.7,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem == "hisyaku") {
            updateMessage("ここまで連れてきてくれたガイドさんだ。やめておこう");
            return;
          }
          if (!f.winterSoulGiftDone) {
            updateMessage("クマガイドがこちらを見ている");
            return;
          }
          showModal("クマガイド", `<div style="text-align:center;">プロガイドだからおうちまで送るよ！</div>`, [
            {
              text: "はい",
              action: () => {
                closeModal();
                travelWithStepsTrueEnd();
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "クマガイド",
        zIndex: 5,
        usable: () => true,
        item: { img: "bearGuide", visible: () => true },
      },
    ],
  },
  end: {
    name: "ノーマルエンド",
    description: "不思議な庭園から脱出できました。おめでとうございます！",
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
    description: "自分の部屋に帰り着いた。夢だったのかな？でもお饅頭があるしクマが居るね",
    clickableAreas: [
      {
        x: 16.4,
        y: 62.6,
        width: 25.6,
        height: 25.3,
        onClick: clickWrap(function () {
          updateMessage("美味しい");
        }),
        description: "おまんじゅう",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 59.6,
        y: 23.6,
        width: 38.7,
        height: 34.8,
        onClick: clickWrap(function () {
          updateMessage("クマガイドはお饅頭を食べている。嬉しそうだ。");
        }),
        description: "クマガイド",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 23.6,
        y: 11.1,
        width: 31.4,
        height: 32.8,
        onClick: clickWrap(function () {
          updateMessage("嬉しそうだ。帰らなくていいのかな？");
        }),
        description: "クマガイド窓",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 69.1,
        y: 79.9,
        width: 14.8,
        height: 11.8,
        onClick: clickWrap(function () {
          updateMessage("現実だったのかな…");
        }),
        description: "シール",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 40.2,
        y: 50.4,
        width: 29.7,
        height: 28.4,
        onClick: clickWrap(function () {
          updateMessage("ヒンヤリしていて美味しい");
        }),
        description: "食べかけのお饅頭",
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
    bear: [],
  },
};

// 足音で数歩→ワープ演出→目的の部屋へ
function travelWithSteps(destRoom = "end", color = "#000") {
  const canvasEl = document.getElementById("gameCanvas");
  const overlay = document.getElementById("roomEffectOverlay");

  // 足音を鳴らす
  try {
    const se = document.getElementById("se-ashioto");
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
  if (hasItem("seal")) {
    gameState.trueEnd.flags.backgroundState++;
  }

  // 足音を鳴らす
  try {
    const se = document.getElementById("se-ashioto");
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
  changeRoom("ticketArea");
  updateMessage("気が付くとあなたはチケット売り場に立っていました");
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
    changeBGM("sounds/30/yasashi_yukini.mp3");
  } else if (roomId === "winterArea") {
    changeBGM("sounds/30/koto_rojiura.mp3");
  } else if (roomId === "end") {
    changeBGM("sounds/30/Moss_Garden_Transition.mp3");
  } else {
    changeBGM("sounds/30/wano_machinami.mp3");
  }

  // nav
  if (roomId === "stampAreaFuji" || roomId === "stampAreaPond" || roomId === "stampAreaMomiji" || roomId === "gate") {
    addNaviItem(roomId);
    renderNavigation();
  }
  if (roomId === "trueEnd" || roomId === "end" || roomId === "winterArea") {
    gameState.openRooms = [];
    // renderNavigation();
  }
  renderNavigation();
}

const END_IDS = new Set(["end", "endWorse", "trueEnd"]);

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
  drawDeskPondDrawerFx(ctx, canvas, roomId);

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

function drawDeskPondDrawerFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.deskPondDrawerOpen;
  if (!fx || roomId !== "deskPond" || fx.roomId !== "deskPond") return;
  const rect = getAreaRectPx("deskPond", fx.areaDescription, canvas);
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

  // 取っ手（上部中央）
  const knobCx = rect.x + rect.w / 2;
  const knobCy = frontY + Math.max(6, rect.h * 0.18);
  const knobR = Math.max(3, Math.min(rect.w, rect.h) * 0.06);
  ctx.fillStyle = "rgb(186, 121, 22)";
  ctx.strokeStyle = "rgba(90, 52, 10, 0.8)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(knobCx, knobCy, knobR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function playDeskPondDrawerOpenFx(areaDescription, onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.deskPondDrawerOpen) {
    onDone?.();
    return;
  }

  const roomId = gameState.currentRoom;
  if (roomId !== "deskPond") {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.deskPondDrawerOpen = {
    roomId: "deskPond",
    areaDescription,
    progress: 0,
  };
  playSE?.("se-hikidashi");
  renderCanvasRoom();

  const dur = 280;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.deskPondDrawerOpen;
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
        delete gameState.fx.deskPondDrawerOpen;
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

function clickWrap(fn, { allowAtNight = false } = {}) {
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
      title: "🏛️ TRUE END",
      label: "TRUE END",
      desc: "隠されたエリアに到達",
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
      secretText = "👻 誰だったのでしょう";
      break;

    case "end":
      secretText = "🏙️ 日常へと戻りました";
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLScLIWlfSFcEgbwuHAhjmfwiXrSVoU7IdQp0lxnYs-Gbb8JDgQ/viewform";

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


function showTicketMachinePuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (!f.ticketMachineReady) {
    updateMessage("お金があれば買えそうだ");
    return;
  }
  if (f.ticketMachineSolved) {
    updateMessage(f.foundTicket ? "もう何も出てこない" : "チケットが出ている");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <div id="ticketMachineSeq" style="font-size:1.05em; min-height:1.4em;">入力: </div>

      <div style="display:grid; grid-template-columns:56px 56px 56px; gap:8px; justify-content:center;">
        <button id="ticketPad1" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">1</button>
        <button id="ticketPad2" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">2</button>
        <button id="ticketPad3" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">3</button>
        <button id="ticketPad4" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">4</button>
        <button id="ticketPad5" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">5</button>
        <button id="ticketPad6" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">6</button>
        <button id="ticketPad7" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">7</button>
        <button id="ticketPad8" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">8</button>
        <button id="ticketPad9" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">9</button>
      </div>

      <div style="display:grid; grid-template-columns:56px 56px 56px; gap:8px; justify-content:center; align-items:center;">
        <div></div>
        <button id="ticketPad0" class="nav-btn" style="width:56px;height:56px;padding:0;font-size:28px;font-weight:900;background:#ececec;color:#111;">0</button>
        <button id="ticketPadOk" class="ok-btn" style="padding: 10px 0;width:56px;height:56px;margin-left:8px;">OK</button>
      </div>

      <div style="display:flex; gap:10px;">
        <button id="ticketPadClear" class="nav-btn">クリア</button>
      </div>
      <div id="ticketMachineHint" style="margin-top:2px; font-size:0.95em; min-height:1.2em;"></div>
    </div>
  `;

  showModal("4桁コードを入力", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const seqEl = document.getElementById("ticketMachineSeq");
    const hintEl = document.getElementById("ticketMachineHint");
    const okBtn = document.getElementById("ticketPadOk");
    const clearBtn = document.getElementById("ticketPadClear");
    const numBtns = Array.from({ length: 10 }, (_, n) => document.getElementById(`ticketPad${n}`));
    if (!seqEl || !hintEl || !okBtn || !clearBtn || numBtns.some((b) => !b)) return;

    const answer = [7, 2, 4, 5];
    let input = [];

    const repaint = () => {
      seqEl.textContent = `入力: ${input.join(",")}`;
    };

    const pushNum = (n) => {
      if (input.length >= answer.length) input = [];
      input.push(n);
      repaint();
      hintEl.textContent = "";
      try {
        playSE?.("se-pi");
      } catch (e) {}
    };

    const clearInput = () => {
      input = [];
      repaint();
      hintEl.textContent = "";
    };

    const judge = () => {
      const ok = input.length === answer.length && input.every((v, i) => v === answer[i]);
      if (!ok) {
        hintEl.textContent = "ちがうようだ。";
        try {
          playSE?.("se-error");
        } catch (e) {}
        screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
        return;
      }

      f.ticketMachineSolved = true;
      try {
        playSE?.("se-clear");
      } catch (e) {}
      closeModal();
      renderCanvasRoom?.();
      markProgress?.("unlock_ticket_machine");
      updateMessage("チケットが出てきた");
    };

    numBtns.forEach((btn, n) => {
      btn.addEventListener("click", () => pushNum(n));
    });
    clearBtn.addEventListener("click", clearInput);
    okBtn.addEventListener("click", judge);

    const onKey = (e) => {
      if (/^[0-9]$/.test(e.key)) pushNum(Number(e.key));
      if (e.key === "Enter") judge();
      if (e.key === "Escape") clearInput();
    };
    document.addEventListener("keydown", onKey);

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

    repaint();
    numBtns[1]?.focus();
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
      <input id="drawerMidInput" class="puzzle-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3"
        placeholder="3桁の数字"
        style="width:200px; text-align:center; letter-spacing:0.2em; font-size:1.2em;">
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
        .slice(0, 3);
      input.value = value;
      const ok = value === "642";
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
        .slice(0, 3);
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

function showDeskPondTopPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});

  if (f.unlockDeskPondTop) {
    updateMessage("引き出し上段は、もうアンロックされている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <div style="display:flex; gap:14px; justify-content:center; align-items:center;">
        <button id="pondTopWhiteBtn" class="nav-btn" type="button"
          style="width:62px;height:62px;padding:0;border-radius:10px;border:2px solid #666;background:#fff;"></button>
        <button id="pondTopRedBtn" class="nav-btn" type="button"
          style="width:62px;height:62px;padding:0;border-radius:10px;border:2px solid #6d1f1f;background:#d93838;"></button>
      </div>
      <button id="pondTopOkBtn" class="ok-btn" type="button">OK</button>
      <div id="pondTopHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("引き出しのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const whiteBtn = document.getElementById("pondTopWhiteBtn");
    const redBtn = document.getElementById("pondTopRedBtn");
    const okBtn = document.getElementById("pondTopOkBtn");
    const hintEl = document.getElementById("pondTopHint");
    if (!whiteBtn || !redBtn || !okBtn || !hintEl) return;

    const answer = ["W", "W", "R", "R", "W"];
    let input = [];

    function pushColor(c) {
      playSE("se-click");
      if (input.length >= 5) return;
      input.push(c);
    }

    whiteBtn.addEventListener("click", () => pushColor("W"));
    redBtn.addEventListener("click", () => pushColor("R"));

    okBtn.addEventListener("click", () => {
      const ok = answer.every((v, i) => v === input[i]);
      if (ok) {
        f.unlockDeskPondTop = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        markProgress?.("unlock_drawer_top");
        updateMessage("カチッ…引き出し上段のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      input = [];
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

function cleanupPondFishingGame() {
  const st = window.__pondFishingGame;
  if (!st) return;
  st.alive = false;
  if (st.rafId) cancelAnimationFrame(st.rafId);
  if (st.keyHandler) document.removeEventListener("keydown", st.keyHandler);
  if (st.closeCleanup) window.removeEventListener("modal:closed", st.closeCleanup);
  window.__pondFishingGame = null;
}

function failPondFishingGame() {
  cleanupPondFishingGame();
  closeModal();
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.kaniDead = true;
  triggerBadEndPondMaster();
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

function showPondFishingGame() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.setHook) {
    updateMessage("釣り針が付いていない");
    return;
  }
  if (f.clearFishing) {
    updateMessage("池の底はもう調べた");
    return;
  }

  cleanupPondFishingGame();

  const content = `
    <div id="pondFishingGame" style="margin-top:10px;">
      <div style="font-size:0.92em; margin-bottom:8px; line-height:1.5;">
        池の底の不審物（?）を狙え。<br>

      </div>
      <div id="pondFishingField" style="position:relative; width:min(340px, 100%); height:210px; margin:0 auto; border:2px solid #245f7a; border-radius:12px; overflow:hidden; background:linear-gradient(#a8d9ee 0%, #5db7d8 24%, #2d95ba 55%, #145f86 100%);">
        <div style="position:absolute; left:0; right:0; top:0; height:28px; background:rgba(255,255,255,0.25); border-bottom:1px solid rgba(255,255,255,0.35);"></div>
        <div id="pondFishingSuspicious" style="position:absolute; width:56px; height:22px; left:20px; top:165px; border-radius:8px; background:#5c4a33; border:2px solid #3e2e1f; color:#f7efc6; font-weight:700; display:flex; align-items:center; justify-content:center; user-select:none;">?</div>
        <!--<img id="pondFishingBoss" src="${IMAGES.modals.pondBoss}" alt="池の主"
  style="position:absolute; width:72px; height:26px; left:220px; top:138px; object-fit:contain; user-select:none;">-->

        <div id="pondFishingBoss" style="position:absolute; width:72px; height:26px; left:220px; top:138px; border-radius:14px; background:#5b2b2b; border:2px solid #2a0f0f; color:#ffd6d6; font-size:12px; display:flex; align-items:center; justify-content:center; user-select:none;">池の主</div>
        <div id="pondFishingLine" style="position:absolute; top:0; left:40px; width:2px; height:176px; background:#f4f4f4; box-shadow:0 0 2px rgba(0,0,0,0.45);"></div>
        <div id="pondFishingHook" style="position:absolute; left:34px; top:168px; width:14px; height:18px; border:2px solid #eee; border-top:none; border-radius:0 0 8px 8px; transform:rotate(12deg); background:rgba(255,255,255,0.08);"></div>
        <div id="pondFishingFlash" style="position:absolute; inset:0; background:rgba(255,255,255,0.0); pointer-events:none; transition:background 120ms;"></div>
      </div>
      <div style="display:flex; gap:10px; justify-content:center; align-items:center; margin-top:10px; flex-wrap:wrap;">
        <button id="pondFishingActionBtn" class="ok-btn" type="button">フックを当てる</button>
        <div id="pondFishingHits" style="font-weight:700;">ヒット: 0 / 3</div>
      </div>
      <div id="pondFishingStatus" style="margin-top:8px; min-height:1.2em; text-align:center; font-size:0.95em;">左右に動くフックの位置を合わせてください</div>
    </div>
  `;
  showModal("不審物を釣ろう", content, [{ text: "閉じる", action: "close" }]);

  const fieldEl = document.getElementById("pondFishingField");
  const suspiciousEl = document.getElementById("pondFishingSuspicious");
  const bossEl = document.getElementById("pondFishingBoss");
  const lineEl = document.getElementById("pondFishingLine");
  const hookEl = document.getElementById("pondFishingHook");
  const statusEl = document.getElementById("pondFishingStatus");
  const hitsEl = document.getElementById("pondFishingHits");
  const flashEl = document.getElementById("pondFishingFlash");
  const actionBtn = document.getElementById("pondFishingActionBtn");
  if (!fieldEl || !suspiciousEl || !bossEl || !lineEl || !hookEl || !statusEl || !hitsEl || !flashEl || !actionBtn) return;

  const fieldW = fieldEl.clientWidth || 340;
  const hookW = 14;
  const suspiciousW = 56;
  const bossW = 72;
  const minX = 8;
  const maxHookX = fieldW - hookW - 8;

  const st = {
    alive: true,
    rafId: 0,
    lastTs: 0,
    hookX: 40,
    hookDir: 1,
    hookSpeed: 170,
    suspiciousX: 20,
    suspiciousDir: 1,
    suspiciousSpeed: 52,
    bossX: Math.max(20, fieldW - 96),
    bossDir: -1,
    bossSpeed: 84,
    bossHitCount: 0,
    hitCount: 0,
    lockUntil: 0,
    keyHandler: null,
    closeCleanup: null,
  };
  window.__pondFishingGame = st;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function setStatus(msg) {
    if (!window.__pondFishingGame || !window.__pondFishingGame.alive) return;
    statusEl.textContent = msg;
  }

  function pulse(color) {
    flashEl.style.background = color;
    setTimeout(() => {
      if (flashEl) flashEl.style.background = "rgba(255,255,255,0)";
    }, 120);
  }

  function repositionSuspicious() {
    st.suspiciousX = clamp(18 + Math.random() * (fieldW - suspiciousW - 36), minX, fieldW - suspiciousW - 8);
    st.suspiciousDir = Math.random() < 0.5 ? -1 : 1;
    st.suspiciousSpeed = 48 + st.hitCount * 16 + Math.random() * 18;
  }

  function attemptHook() {
    if (!window.__pondFishingGame || !window.__pondFishingGame.alive) return;
    const now = performance.now();
    if (now < st.lockUntil) return;
    st.lockUntil = now + 380;

    const hookCenter = st.hookX + hookW / 2;
    const bossHit = hookCenter >= st.bossX && hookCenter <= st.bossX + bossW;
    const suspiciousHit = hookCenter >= st.suspiciousX && hookCenter <= st.suspiciousX + suspiciousW;

    if (bossHit) {
      st.bossHitCount += 1;
      pulse("rgba(255,40,40,0.28)");
      if (st.bossHitCount >= 2) {
        setStatus("池の主の怒りが限界に達した！");
        setTimeout(() => {
          if (window.__pondFishingGame && window.__pondFishingGame.alive) failPondFishingGame();
        }, 220);
      } else {
        setStatus("池の主に当たった！");
      }
      return;
    }

    if (suspiciousHit) {
      st.hitCount += 1;
      hitsEl.textContent = `ヒット: ${st.hitCount} / 3`;
      pulse("rgba(255,255,255,0.28)");

      if (st.hitCount >= 3) {
        f.clearFishing = true;
        setStatus("不審物を引っ掛けた！");
        cleanupPondFishingGame();
        setTimeout(() => {
          closeModal();
          try {
            playSE && playSE("se-angel");
          } catch (e) {}
          showModal(
            "釣り成功",
            `
              <div style="text-align:center;">
                <img src="${IMAGES.items.tsubo}" alt="tsubo"
                  style="max-width:220px;width:100%;display:block;margin:0 auto 14px;">
                <p style="margin:0;">池の底の不審物を回収できた。</p>
              </div>
            `,
            [{ text: "閉じる", action: "close" }],
          );
          updateMessage("池の底の不審物を回収した");
          addItem("tsubo");
        }, 120);
        return;
      }

      setStatus(`ヒット！ あと ${3 - st.hitCount} 回`);
      repositionSuspicious();
      st.bossSpeed += 12;
      return;
    }

    pulse("rgba(180,220,255,0.18)");
    setStatus("はずれ");
  }

  actionBtn.onclick = attemptHook;

  const keyHandler = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      attemptHook();
    }
  };
  st.keyHandler = keyHandler;
  document.addEventListener("keydown", keyHandler);

  const closeCleanup = () => cleanupPondFishingGame();
  st.closeCleanup = closeCleanup;
  window.addEventListener("modal:closed", closeCleanup);

  function tick(ts) {
    if (!window.__pondFishingGame || !window.__pondFishingGame.alive) return;
    if (!st.lastTs) st.lastTs = ts;
    const dt = Math.min(0.05, (ts - st.lastTs) / 1000);
    st.lastTs = ts;

    st.hookX += st.hookDir * st.hookSpeed * dt;
    if (st.hookX <= minX) {
      st.hookX = minX;
      st.hookDir = 1;
    } else if (st.hookX >= maxHookX) {
      st.hookX = maxHookX;
      st.hookDir = -1;
    }

    st.suspiciousX += st.suspiciousDir * st.suspiciousSpeed * dt;
    if (st.suspiciousX <= minX || st.suspiciousX >= fieldW - suspiciousW - 8) {
      st.suspiciousX = clamp(st.suspiciousX, minX, fieldW - suspiciousW - 8);
      st.suspiciousDir *= -1;
    }

    st.bossX += st.bossDir * st.bossSpeed * dt;
    if (st.bossX <= minX || st.bossX >= fieldW - bossW - 8) {
      st.bossX = clamp(st.bossX, minX, fieldW - bossW - 8);
      st.bossDir *= -1;
    }

    lineEl.style.left = `${Math.round(st.hookX + hookW / 2)}px`;
    hookEl.style.left = `${Math.round(st.hookX)}px`;
    suspiciousEl.style.left = `${Math.round(st.suspiciousX)}px`;
    bossEl.style.left = `${Math.round(st.bossX)}px`;

    st.rafId = requestAnimationFrame(tick);
  }

  st.rafId = requestAnimationFrame(tick);
}

function showGateLockPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockGate) {
    updateMessage("門のロックは外れている");
    return;
  }

  const inputId = `gateLockInput_${Date.now()}`;
  const okId = `gateLockOk_${Date.now()}`;
  const hintId = `gateLockHint_${Date.now()}`;
  const content = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:8px;">
      <input id="${inputId}" type="text" inputmode="latin" maxlength="4" autocomplete="off"
        style="width:140px;padding:10px 12px;text-align:center;font-size:22px;letter-spacing:0.18em;text-transform:lowercase;"
        placeholder="____">
      <button id="${okId}" class="ok-btn">OK</button>
      <div id="${hintId}" style="min-height:1.2em;font-size:0.95em;"></div>
    </div>
  `;

  showModal("門のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const input = document.getElementById(inputId);
    const okBtn = document.getElementById(okId);
    const hint = document.getElementById(hintId);
    if (!input || !okBtn) return;

    const normalize = () => {
      input.value = (input.value || "")
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 4)
        .toLowerCase();
    };

    const judge = () => {
      normalize();
      if (input.value === "real") {
        f.unlockGate = true;
        playSE?.("se-clear");
        closeModal();
        updateMessage("門のロックが外れた。");
        renderCanvasRoom?.();
        markProgress?.("unlock_gate");
        return;
      }

      playSE?.("se-error");
      if (hint) hint.textContent = "ちがうようだ。";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
      input.focus();
      if (typeof input.select === "function") input.select();
    };

    const onDocKey = (e) => {
      if (e.key !== "Enter") return;
      const modal = document.getElementById("modal");
      if (!modal || modal.style.display !== "flex") return;
      e.preventDefault();
      judge();
    };

    const cleanup = () => {
      document.removeEventListener("keydown", onDocKey);
    };

    input.addEventListener("input", normalize);
    okBtn.addEventListener("click", judge);
    document.addEventListener("keydown", onDocKey);
    window.addEventListener("modal:closed", cleanup, { once: true });

    input.focus();
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
      style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`;

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
    yen200: "200円",
    ticket: "入場券",
    souvenirVoucher: "お土産引換券",
    seal: "シール",
    walletFull: "財布",
    walletOpen: "開いた財布",
    sheet: "スタンプ台紙",
    sheetComplete3: "完成したスタンプ台紙",
    sheetComplete3extra: "完成したスタンプ台紙(2枚目)",
    tsubo: "壺",
    tsuboFixed: "修理した壺",
    tsuboWater: "水が入った壺",
    tape: "耐水和紙テープ",
    key: "鍵",
    hisyaku: "柄杓",
    stampBodyGreen: "緑のスタンプ本体",
    annualPassUnknown: "誰かの年間パスポート",
    manju: "四季のお饅頭",
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
  slots.forEach((slot, index) => {
    slot.innerHTML = "";
    if (gameState.inventory[index]) {
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

        // デフォの中身
        let content = `<img src="${img.src}" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`;
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

        showModal(getItemName(itemId), content, buttons);
      };
      slot.appendChild(magBtn);
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
