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
const BASE_33 = USE_LOCAL_ASSETS ? "images/33" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/33";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I33 = (file) => `${BASE_33}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    workRoom: [I33("work_room.webp")],
    drinkArea: [I33("drink_area.webp")],
    coffeeMachine: [I33("coffee_machine.webp")],
    reception: [I33("reception.webp")],
    pcReception: [I33("pc_reception.webp")],
    locker: [I33("locker.webp")],
    adminDoor: [I33("admin_door.webp")],
    printerDesk: [I33("printer_desk.webp")],
    meetingRoom: [I33("meeting_room.webp")],
    adminRoom: [I33("admin_room.webp")],
    entrance: [I33("entrance.webp")],
    pcAdmin: [I33("admin_pc_desktop.webp")],
    end: [I33("end.webp"), I33("end2.webp")],
    trueEnd: [I33("true_end.webp"), I33("true_end2.webp")],
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
    coffeeAfter: I33("coffee_after.webp"),
    coffeeMachineAfter: I33("coffee_machine_after.webp"),
    string: I33("string.webp"),
    cup: I33("cup.webp"),
    cupWithWater: I33("cup_water.webp"),
    scissors: I33("scissors.webp"),
    reservationLog: I33("reservation_log.webp"),
    partBlue: I33("part_blue.webp"),
    partRed: I33("part_red.webp"),
    partYellow: I33("part_yellow.webp"),
    partGreen: I33("part_green.webp"),
    imgCamera: I33("img_camera.webp"),
    imgCamera2: I33("img_camera2.webp"),
    keyB: I33("key_b.webp"),
    jacket: I33("jacket.webp"),
    nameCard: I33("name_card.webp"),
    fertilizer: I33("fertilizer.webp"),
    book: I33("book.webp"),
    messOnBoard: I33("mess_on_board.webp"),
    numOnBoard: I33("num_on_board.webp"),
    kira: I33("kira.webp"),
    keyDesk: I33("key_desk.webp"),
    keyAdmin: I33("key_admin.webp"),
    eraser: I33("eraser.webp"),
    tile: I33("tile.webp"),
    elixir: ICM("common/elixir_modern.webp"),
  },
  modals: {
    fileboxes: I33("modal_fileboxes.webp"),
    memoListen: I33("modal_listen.webp"),
    note1: I33("modal_note_1.webp"),
    note2: I33("modal_note_2.webp"),
    rules: I33("modal_rules.webp"),
    rulesEn: I33("modal_rules_en.webp"),
    partBlueInCups: I33("modal_cup_part_blue.webp"),
    keyFound: I33("modal_key_found.webp"),
    jacketCard: I33("modal_jacket_card.webp"),
    pamphlet: I33("pamphlet.webp"),
    stringSquare: I33("modal_string_square.webp"),
    todo: I33("modal_todo.webp"),
    plantDry: I33("modal_plant_dry.webp"),
    waterToPlant: I33("modal_water_to_plant.webp"),
    plantHappy: I33("modal_plant_happy.webp"),
    fertilizerToPlant: I33("modal_fertilizer_to_plant.webp"),
    plantVeryHappy: I33("modal_plant_very_happy.webp"),
    plantSquare: I33("modal_plant_square.webp"),
    review5: I33("modal_review5.webp"),
    review4: I33("modal_review4.webp"),
    review35: I33("modal_review3_5.webp"),
    review5En: I33("modal_review5_en.webp"),
    review4En: I33("modal_review4_en.webp"),
    review35En: I33("modal_review3_5_en.webp"),
    partInBook: I33("modal_part_in_book.webp"),
    numOnBoardZoom: I33("num_on_board_zoom.webp"),
    bearAppear: I33("modal_bear_appear.webp"),
    thanksLetter: I33("modal_thanks_letter.webp"),
    thanksLetterEn: I33("modal_thanks_letter_en.webp"),
    tileUnite: I33("modal_tile_unite.webp"),
    drawerPartYellow: I33("modal_drawer_part_yellow.webp"),
    drawerCoin: I33("modal_drawer_coin.webp"),
    adminLogin: I33("modal_admin_login.webp"),
    milk: I33("milk.webp"),
    cheese: I33("cheese.webp"),
    carrot: I33("carrot.webp"),
    nut: I33("nut.webp"),
    picStudent: I33("modal_pic_student.webp"),
    findKeyDesk: I33("modal_find_key_desk.webp"),
    bearCoin: I33("modal_bear_coin.webp"),
    bearCoin2: I33("modal_bear_coin2.webp"),
    bearCoins: I33("modal_bear_coin2.webp"),
    posterMoon: I33("poster_moon.webp"),
    plantBad1: I33("modal_plant_bad1.webp"),
    plantBad2: I33("modal_plant_bad2.webp"),
    chair: I33("chair.webp"),
    phone: I33("phone.webp"),
    dish: I33("dish.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState33";
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
    currentRoom: "reception",
    openRooms: ["reception"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        cutString: false,
        makeCoffee: false,
        coffeeRecipeStep: 0,
        isNight: false,
        printerHistorySelection: 0,
        printerPaperVisible: false,
        lastPrintedFileId: null,

        talkTo: { bear: 0 },
        backgroundState: 0,
      },
    },
    workRoom: {
      flags: { backgroundState: 0 },
    },
    reception: {
      flags: { backgroundState: 0 },
    },
    locker: {
      flags: { backgroundState: 0 },
    },
    adminDoor: {
      flags: { backgroundState: 0 },
    },
    printerDesk: {
      flags: { backgroundState: 0 },
    },
    meetingRoom: {
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

// 部屋データ
let rooms = {
  workRoom: {
    name: "執務室",
    description: "",
    clickableAreas: [
      {
        x: 85.4,
        y: 74.4,
        width: 13.7,
        height: 5.4,
        onClick: clickWrap(function () {
          openWorkRoomDrawerTop();
        }),
        description: "引き出し上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 85.3,
        y: 80.3,
        width: 13.9,
        height: 4.6,
        onClick: clickWrap(function () {
          showWorkRoomDrawerMiddlePuzzle();
        }),
        description: "引き出し中段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 85.4,
        y: 85.3,
        width: 13.7,
        height: 9.1,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockWorkRoomDrawerBottom) {
            openWorkRoomDrawerBottom();
            return;
          }
          if (gameState.selectedItem === "keyDesk") {
            f.unlockWorkRoomDrawerBottom = true;
            removeItem("keyDesk");
            playSE?.("se-gacha");
            renderCanvasRoom?.();
            updateMessage("引き出し下段のロックが外れた。");
            return;
          }
          if (gameState.selectedItem === "keyB") {
            updateMessage("鍵が合わない");
            return;
          }
          updateMessage("引き出し下段には鍵がかかっている。");
        }),
        description: "引き出し下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 25.8,
        y: 73.9,
        width: 22.7,
        height: 23.3,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "jacket") {
            updateMessage("ボクには大きいみたい");
            return;
          }
          if (gameState.selectedItem === "elixir") {
            updateMessage("飲むと元気が出るよ");
            return;
          }
          if (gameState.selectedItem === "cupWithWater") {
            updateMessage("お水はいらないよ");
            return;
          }
          if (gameState.selectedItem === "coin" && hasItem("coin")) {
            if (f.gaveBearCoin) {
              updateMessage("クマ妖精は嬉しそうだ");
              return;
            }
            f.gaveBearCoin = true;
            f.unlockWorkRoomFridge = true;
            removeItem("coin");
            playSE("se-wa");
            showModal("「わあ、ありがとう！久しぶりにもらったよ」", `<img src="${IMAGES.modals.bearCoin}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [
              {
                text: "次へ",
                action: () => {
                  showModal("「お礼に、冷蔵庫の中身を持って行って！」", `<img src="${IMAGES.modals.bearCoins}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
                },
              },
            ]);
            return;
          }
          talkToHintCharacter("main", "bear");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.main.flags.bearAppearedFromDrawer,
        item: { img: "bear", visible: () => gameState.main.flags.bearAppearedFromDrawer },
      },
      {
        x: 60.3,
        y: 55.5,
        width: 16.8,
        height: 8.6,
        onClick: clickWrap(function () {
          showObj(null, "「集中できる静かな環境でした。また利用したいです。」", IMAGES.modals.review5, "「集中できる静かな環境でした。また利用したいです。」というレビューが表示されている", IMAGES.modals.review5En);
        }),
        description: "PC画面手前",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 56.4,
        y: 47.3,
        width: 9.0,
        height: 4.7,
        onClick: clickWrap(function () {
          showObj(null, "「どんな場所に居ても見守られているような、不思議な安心感を感じました。」", IMAGES.modals.review4, "「どんな場所に居ても見守られているような、不思議な安心感を感じました。」というレビューが表示されている", IMAGES.modals.review4En);
        }),
        description: "PC画面左奥",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 80.7,
        y: 47.5,
        width: 9.0,
        height: 4.9,
        onClick: clickWrap(function () {
          showObj(null, "「少しカメラが多すぎる気がしました。」", IMAGES.modals.review35, "「少しカメラが多すぎる気がしました。」というレビューが表示されている", IMAGES.modals.review35En);
        }),
        description: "PC画面右奥",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 92.2,
        y: 21.3,
        width: 7.5,
        height: 20.9,
        onClick: clickWrap(function () {
          showObj(null, "利用ルール", IMAGES.modals.rules, "利用ルールが掲示されている。「飲食は指定エリアのみ（違反10000円）、通話は指定通話ブースで（違反5000円）、30分以上の離席禁止（違反3000円）」", IMAGES.modals.rulesEn, "Usage rules are posted.");
        }),
        description: "利用ルール",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 52.1,
        y: 66.9,
        width: 5.6,
        height: 3.9,
        onClick: clickWrap(function () {
          showModal(
            "メモ",
            `
              <div class="modal-anim">
                <img src="${IMAGES.modals.note1}">
                <img src="${IMAGES.modals.note2}">
              </div>
            `,
            [{ text: "閉じる", action: "close" }],
          );
        }),
        description: "ノート",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 60.1,
        y: 54.8,
        width: 17.3,
        height: 10.0,
        onClick: clickWrap(function () {}),
        description: "PCディスプレイ手前",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 56.5,
        y: 47.4,
        width: 9.1,
        height: 4.9,
        onClick: clickWrap(function () {}),
        description: "PCディスプレイ奥左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 80.7,
        y: 47.5,
        width: 9.6,
        height: 4.8,
        onClick: clickWrap(function () {}),
        description: "PCディスプレイ奥右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 11.9,
        y: 33.6,
        width: 7.3,
        height: 15.5,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "cupWithWater") {
            updateMessage("この植物は生き生きとしている。お水は必要なさそうだ");
            return;
          }
          if (gameState.main.flags.loginPc) {
            acquireItemOnce("foundKeyB", "keyB", "鍵がある", IMAGES.modals.keyFound, "Bの鍵を手に入れた", () => {
              addViolationLogEntryOnce("keyBViolationLogged", {
                no: "1026",
                datetime: getCurrentPlayDateTime(),
                content: "長時間離席",
                fine: "3,000円",
              });
              showToast("「違反を検出しました。確認対象を追加します。」とアナウンスが流れた");
              playOptionalSE?.("se-kiroriro");
            });
            return;
          }
          updateMessage("生き生きとした植物だ");
        }),
        description: "植物左奥",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 13.7,
        y: 21.1,
        width: 3.5,
        height: 2.6,
        onClick: clickWrap(function () {
          updateMessage("監視カメラだ。");
        }),
        description: "カメラ左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 60.4,
        y: 20.1,
        width: 3.7,
        height: 2.6,
        onClick: clickWrap(function () {
          updateMessage("監視カメラだ。自分も録画されているのだろうか");
        }),
        description: "カメラ中",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 76.1,
        y: 3.8,
        width: 4.4,
        height: 3.3,
        onClick: clickWrap(function () {
          updateMessage("監視カメラだ。やけに多い気がする");
        }),
        description: "カメラ上左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 86.7,
        y: 4.6,
        width: 4.3,
        height: 3.8,
        onClick: clickWrap(function () {
          updateMessage("監視カメラだ。");
        }),
        description: "カメラ上右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("reception");
          },
          { allowAtNight: true },
        ),
        description: "ワークルーム戻る、受付へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },

      {
        x: 93.6,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("printerDesk");
        }),
        description: "ワークルーム右、プリンターデスクへ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 45.6,
        y: 31.0,
        width: 24.1,
        height: 14.6,
        onClick: clickWrap(function () {
          changeRoom("drinkArea");
        }),
        description: "ドリンクエリアへ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
    ],
  },
  drinkArea: {
    name: "ドリンクエリア",
    description: "",
    clickableAreas: [
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}, { allowAtNight: true }),
        description: "入ったコーヒー",
        zIndex: 5,
        usable: () => false,
        item: { img: "coffeeAfter", visible: () => gameState.main.flags.makeCoffee },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}, { allowAtNight: true }),
        description: "ひも",
        zIndex: 5,
        usable: () => false,
        item: { img: "string", visible: () => !gameState.main.flags.cutString },
      },
      {
        x: 46.5,
        y: 44.4,
        width: 15.4,
        height: 18.8,
        onClick: clickWrap(function () {
          changeRoom("coffeeMachine");
        }),
        description: "コーヒーマシン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 29.7,
        y: 51.1,
        width: 14.5,
        height: 11.3,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.foundPartBlue) {
            f.foundPartBlue = true;
            addItem("partBlue");
            showModal("マグカップの間になにかがある", `<img src="${IMAGES.modals.partBlueInCups}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
            updateMessage("何かのパーツを見つけた");
            return;
          }
          updateMessage("マグカップが置かれている");
        }),
        description: "マグカップ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 71.8,
        y: 50.7,
        width: 7.1,
        height: 21.1,
        onClick: clickWrap(function () {
          if (!hasItem("cup") && !hasItem("cupWithWater")) {
            addItem("cup");
            updateMessage("紙コップを手に入れた");
            return;
          }
          updateMessage("紙コップが積まれている");
        }),
        description: "紙コップ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 81.5,
        y: 62.0,
        width: 13.6,
        height: 18.4,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "cup") {
            playWaterServerFillFx();
            return;
          }
          updateMessage("ウォーターサーバーだ");
        }),
        description: "ウォーターサーバー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 84.1,
        y: 72.3,
        width: 4.2,
        height: 6.4,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "cup") {
            playWaterServerFillFx();
            return;
          }
          updateMessage("紙コップを置く場所だ");
        }),
        description: "ウォーターサーバーコップ配置箇所",
        zIndex: 5,
        usable: () => true,
        item: {
          img: "cup",
          visible: () => !!gameState.fx?.waterServerFill,
        },
      },
      {
        x: 79.0,
        y: 37.0,
        width: 15.7,
        height: 22.0,
        onClick: clickWrap(function () {
          updateMessage("ウォーターサーバーのボトルには水が入っている");
        }),
        description: "ウォーターサーバーボトル部",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 4.1,
        y: 23.9,
        width: 14.3,
        height: 14.0,
        onClick: clickWrap(function () {
          updateMessage("本が並んでいる");
        }),
        description: "本左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 30.1,
        y: 27.3,
        width: 18.6,
        height: 10.4,
        onClick: clickWrap(function () {
          updateMessage("本が積まれている");
        }),
        description: "本右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 40.4,
        y: 68.8,
        width: 9.1,
        height: 7.6,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "scissors") {
            gameState.main.flags.cutString = true;
            playOptionalSE?.("se-hasami");
            renderCanvasRoom?.();
            updateMessage("はさみで紐を切った");
            return;
          }
          updateMessage("紐が固く結ばれている");
        }),
        description: "紐部分",
        zIndex: 5,
        usable: () => !gameState.main.flags.cutString,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 19.9,
        y: 67.7,
        width: 50.3,
        height: 26.8,
        onClick: clickWrap(function () {
          playDrinkAreaCabinetOpenFx("キャビネット", () => {
            acquireItemOnce("foundReservationLog", "reservationLog", "予約記録がある", IMAGES.items.reservationLog, "予約記録を手に入れた");
          });
        }),
        description: "キャビネット",
        zIndex: 5,
        usable: () => gameState.main.flags.cutString,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 5.8,
        y: 8.1,
        width: 10.1,
        height: 11.2,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "cupWithWater") {
            updateMessage("元気そうなので、お水は必要なさそうだ。やめておこう");
            return;
          }
          updateMessage("生き生きとした植物だ");
        }),
        description: "植物上",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 18.5,
        y: 49.3,
        width: 9.6,
        height: 12.6,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "cupWithWater") {
            updateMessage("元気そうなので、お水は必要なさそうだ。やめておこう");
            return;
          }
          updateMessage("生き生きとした植物だ");
        }),
        description: "植物下",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 44.2,
        y: 6.3,
        width: 22.0,
        height: 19.0,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "cupWithWater") {
            updateMessage("お水は必要なさそうだ。やめておこう");
            return;
          }
          updateMessage("生き生きとした植物だ。垂れ下がっている");
        }),
        description: "植物右上",
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
            changeRoom("workRoom");
          },
          { allowAtNight: true },
        ),
        description: "ドリンクエリア戻る、執務室へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  coffeeMachine: {
    name: "コーヒーマシン",
    description: "",
    clickableAreas: [
      {
        x: 36.0,
        y: 26.1,
        width: 7.9,
        height: 9.2,
        onClick: clickWrap(function () {
          pressCoffeeMachineButton("bean");
        }),
        description: "豆ボタン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 46.0,
        y: 26.1,
        width: 8.3,
        height: 9.2,
        onClick: clickWrap(function () {
          pressCoffeeMachineButton("water");
        }),
        description: "水ボタン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 55.7,
        y: 26.1,
        width: 8.2,
        height: 9.2,
        onClick: clickWrap(function () {
          pressCoffeeMachineButton("milk");
        }),
        description: "ミルクボタン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 28.8,
        y: 45.4,
        width: 43.8,
        height: 40.0,
        onClick: clickWrap(function () {
          if (gameState.main.flags.makeCoffee) {
            updateMessage("コーヒーが入っている");
          } else {
            updateMessage("コーヒー用のポットだ");
          }
        }),
        description: "ポット",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}, { allowAtNight: true }),
        description: "入ったコーヒー",
        zIndex: 5,
        usable: () => false,
        item: { img: "coffeeMachineAfter", visible: () => gameState.main.flags.makeCoffee && !gameState.fx?.coffeeMachineFill },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("drinkArea");
          },
          { allowAtNight: true },
        ),
        description: "コーヒーマシン戻る、ドリンクエリアへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  reception: {
    name: "受付",
    description: "",
    clickableAreas: [
      {
        x: 19.5,
        y: 19.1,
        width: 23.8,
        height: 22.5,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.fileboxes, "ファイルボックスが並んでいる");
        }),
        description: "ファイルボックス",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 54.3,
        y: 53.6,
        width: 19.7,
        height: 11.5,
        onClick: clickWrap(function () {
          changeRoom("pcReception");
        }),
        description: "受付PC",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 86.0,
        y: 4.0,
        width: 8.5,
        height: 7.2,
        onClick: clickWrap(function () {
          updateMessage("監視カメラがある");
        }),
        description: "カメラ右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 37.9,
        y: 43.3,
        width: 13.0,
        height: 10.6,
        onClick: clickWrap(function () {
          showReceptionKeyboxPuzzle();
        }),
        description: "キーボックス",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 59.2,
        y: 30.8,
        width: 9.2,
        height: 10.4,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockWorkRoomFridge) {
            acquireItemOnce("foundElixir", "elixir", "冷蔵庫にドリンクが入っている", IMAGES.items.elixir, "ドリンクを手に入れた");
            return;
          }
          updateMessage("小型の冷蔵庫だ。開かない");
        }),
        description: "冷蔵庫",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 74.6,
        y: 31.8,
        width: 10.1,
        height: 9.4,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.picStudent, "写真が飾られている");
        }),
        description: "写真たて",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 81.4,
        y: 50.7,
        width: 18.5,
        height: 13.0,
        onClick: clickWrap(function () {
          updateMessage("今日は、4月8日だ");
        }),
        description: "黒板",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 81.4,
        y: 20.3,
        width: 8.6,
        height: 8.5,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "cupWithWater") {
            updateMessage("この植物は生き生きとしている。お水は必要なさそうだ");
            return;
          }
          updateMessage("元気そうな植物だ。フェイクグリーンかもしれない");
        }),
        description: "植物上",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 45.2,
        y: 32.4,
        width: 7.7,
        height: 8.5,
        onClick: clickWrap(function () {
          updateMessage("青々とした植物だ。フェイクグリーンかもしれない");
        }),
        description: "植物中",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 15.5,
        y: 55.8,
        width: 9.1,
        height: 9.5,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "cupWithWater") {
            updateMessage("この植物は生き生きとしている。お水は必要なさそうだ");
            return;
          }
          updateMessage("元気そうな植物だ。本物のように見える");
        }),
        description: "植物下",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 29.4,
        y: 60.1,
        width: 7.5,
        height: 5.5,
        onClick: clickWrap(function () {
          updateMessage("この施設の紹介カードのようだ");
        }),
        description: "施設の紹介カード",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0.4,
        y: 21.0,
        width: 12.4,
        height: 13.9,
        onClick: clickWrap(function () {
          updateMessage("時計がある");
        }),
        description: "時計",
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
            changeRoom("workRoom");
          },
          { allowAtNight: true },
        ),
        description: "受付戻る、ワークルームへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("locker");
        }),
        description: "受付左、ロッカーへ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 42.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("meetingRoom");
          },
          { allowAtNight: true },
        ),
        description: "受付右、会議室へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  pcReception: {
    name: "受付PC",
    description: "",
    clickableAreas: [
      {
        x: 43.8,
        y: 82.3,
        width: 33.6,
        height: 17.6,
        onClick: clickWrap(function () {
          showModal(
            "メモ",
            `
              <div style="display:flex;justify-content:center;padding:4px 0;">
                <div style="width:min(100%,380px);padding:22px 24px;border:1px solid rgba(138,108,72,0.42);border-radius:8px;background:linear-gradient(180deg,#f5eddc 0%,#eadabd 100%);box-shadow:0 8px 22px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.45);color:#3a2818;text-align:left;line-height:1.9;font-size:1rem;position:relative;">
                  <div style="position:absolute;inset:0;border-radius:8px;background:repeating-linear-gradient(180deg,rgba(120,90,60,0.05) 0,rgba(120,90,60,0.05) 1px,transparent 1px,transparent 30px);pointer-events:none;"></div>
                  <div style="position:relative;">PCのログインパスは、先月最後の予約IDにすること</div>
                </div>
              </div>
            `,
            [{ text: "閉じる", action: "close" }],
          );
        }),
        description: "メモ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 30.5,
        y: 32.9,
        width: 41.2,
        height: 17.8,
        onClick: clickWrap(function () {
          showPcReceptionLoginPuzzle();
        }),
        description: "PIN入力欄",
        zIndex: 5,
        usable: () => !gameState.main.flags.loginPc,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 3.2,
        y: 0.5,
        width: 93.1,
        height: 57.5,
        onClick: clickWrap(function () {
          updateMessage("監視カメラの画像が映っている");
        }),
        description: "ログイン後画像",
        zIndex: 5,
        usable: () => gameState.main.flags.loginPc,
        item: { img: () => (gameState.main.flags.foundKeyB ? "imgCamera2" : "imgCamera"), visible: () => gameState.main.flags.loginPc },
      },
      {
        x: 75.4,
        y: 45.0,
        width: 5.0,
        height: 5.1,
        onClick: clickWrap(function () {
          updateMessage("何かキラキラしている");
        }),
        description: "キラキラ",
        zIndex: 6,
        usable: () => !gameState.main.flags.foundDeskKey && gameState.main.flags.revealedDeskKey,
        item: { img: "kira", visible: () => !gameState.main.flags.foundDeskKey && gameState.main.flags.revealedDeskKey },
      },
      {
        x: 90,
        y: 90,
        width: 10,
        height: 10,
        onClick: clickWrap(
          function () {
            changeRoom("reception");
          },
          { allowAtNight: true },
        ),
        description: "受付PC戻る、受付へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  locker: {
    name: "ロッカー",
    description: "",
    clickableAreas: [
      {
        x: 32.1,
        y: 14.8,
        width: 12.6,
        height: 18.3,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockLockerA) {
            openLockerA();
            return;
          }
          showLockerAPuzzle();
        }),
        description: "ロッカーA",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 32.1,
        y: 35.0,
        width: 12.4,
        height: 18.2,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockLockerB) {
            openLockerB();
            return;
          }
          if (gameState.selectedItem === "keyB") {
            f.unlockLockerB = true;
            removeItem("keyB");
            playSE?.("se-gacha");
            renderCanvasRoom?.();
            updateMessage("Bの鍵でロッカーBのロックを外した。");
            return;
          }
          updateMessage("ロッカーBには鍵がかかっている。");
        }),
        description: "ロッカーB",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },

      {
        x: 32.2,
        y: 55.0,
        width: 12.5,
        height: 18.1,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockLockerC) {
            openLockerC();
            return;
          }
          showLockerCPuzzle();
        }),
        description: "ロッカーC",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 32.1,
        y: 75.2,
        width: 12.4,
        height: 18.2,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockLockerD) {
            openLockerD();
            return;
          }
          showLockerDPuzzle();
        }),
        description: "ロッカーD",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 17.0,
        y: 14.8,
        width: 12.5,
        height: 18.3,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockLockerI) {
            openLockerI();
            return;
          }
          showLockerIPuzzle();
        }),
        description: "ロッカーI",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 17.0,
        y: 35.0,
        width: 12.4,
        height: 18.2,
        onClick: clickWrap(function () {
          openEmptyLocker("J");
        }),
        description: "ロッカーJ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 17.0,
        y: 55.1,
        width: 12.5,
        height: 18.2,
        onClick: clickWrap(function () {
          openEmptyLocker("K");
        }),
        description: "ロッカーK",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 16.9,
        y: 75.2,
        width: 12.6,
        height: 18.1,
        onClick: clickWrap(function () {
          openEmptyLocker("L");
        }),
        description: "ロッカーL",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.8,
        y: 15.0,
        width: 12.4,
        height: 17.9,
        onClick: clickWrap(function () {
          openEmptyLocker("Q");
        }),
        description: "ロッカーQ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.9,
        y: 35.0,
        width: 12.2,
        height: 18.0,
        onClick: clickWrap(function () {
          openEmptyLocker("R");
        }),
        description: "ロッカーR",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.8,
        y: 54.9,
        width: 12.3,
        height: 18.1,
        onClick: clickWrap(function () {
          openEmptyLocker("S");
        }),
        description: "ロッカーS",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.8,
        y: 75.2,
        width: 12.5,
        height: 18.1,
        onClick: clickWrap(function () {
          openEmptyLocker("T");
        }),
        description: "ロッカーT",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 20.1,
        y: 2.1,
        width: 26.4,
        height: 6.4,
        onClick: clickWrap(function () {
          updateMessage("「ロッカーエリア」と書かれている");
        }),
        description: "ロッカーエリアの札",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 61.5,
        y: 45.2,
        width: 11.6,
        height: 21.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "cupWithWater") {
            if (f.wateredLockerPlant) {
              updateMessage("植物はすでに水分は足りていそうだ");
              return;
            }
            waterLockerPlant();
            return;
          }
          if (gameState.selectedItem === "fertilizer") {
            if (f.wateredLockerPlant) {
              fertilizeLockerPlant();
              return;
            }
            updateMessage("水分が足りないようだ。まずお水が必要だ");
            return;
          }
          if (gameState.selectedItem === "scissors" && f.fertilizedLockerPlant) {
            showPlantBadEnd();
            return;
          }
          if (f.fertilizedLockerPlant) {
            showLockerPlantSquare();
            return;
          }
          if (f.wateredLockerPlant) {
            showObj(null, "", IMAGES.modals.plantHappy, "植物は少し元気を取り戻したようだ");
            return;
          }
          showObj(null, "", IMAGES.modals.plantDry, "元気がない植物だ。少ししおれている");
        }),
        description: "廊下奥の植物",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 73.3,
        y: 46.8,
        width: 6.3,
        height: 24.6,
        onClick: clickWrap(function () {
          updateMessage("このウォーターサーバーは壊れているようだ");
        }),
        description: "廊下のウォーターサーバー",
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
            changeRoom("reception");
          },
          { allowAtNight: true },
        ),
        description: "ロッカー右、受付へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 56.2,
        y: 35.3,
        width: 8,
        height: 8,
        onClick: clickWrap(function () {
          changeRoom("adminDoor");
        }),
        description: "管理室ドアへ",
        zIndex: 5,
        item: { img: "arrowAbove", visible: () => true },
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
        description: "ロッカー戻る、エントランスへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  adminDoor: {
    name: "管理室ドア",
    description: "",
    clickableAreas: [
      {
        x: 52.3,
        y: 62.0,
        width: 14.3,
        height: 17.3,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "scissors") {
            updateMessage("ひもを切るとバラバラになってしまう。やめておこう");
            return;
          }
          if (!f.revealedDeskKey || f.foundDeskKey) {
            updateMessage("段ボールが置いてある");
            return;
          }
          acquireItemOnce("foundDeskKey", "keyDesk", "よく見ると、鍵が落ちている", IMAGES.modals.findKeyDesk, "机の鍵を手に入れた");
        }),
        description: "段ボールの陰に落ちている鍵",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => !gameState.main.flags.foundDeskKey && gameState.main.flags.revealedDeskKey },
      },
      {
        x: 45.5,
        y: 29.4,
        width: 5.5,
        height: 25.0,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterMoon, "栄養ドリンクかな？");
        }),
        description: "廊下の壁の絵",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 78.6,
        y: 33.3,
        width: 17.5,
        height: 36.7,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockAdminDoor) {
            changeRoom("adminRoom");
            return;
          }
          if (gameState.selectedItem === "keyAdmin") {
            f.unlockAdminDoor = true;
            removeItem("keyAdmin");
            playSE?.("se-gacha");
            renderCanvasRoom?.();
            updateMessage("管理室ドアのロックが外れた。");
            return;
          }
          if (gameState.selectedItem === "keyB" || gameState.selectedItem === "keyDesk") {
            updateMessage("鍵が合わない");
            return;
          }
          updateMessage("管理室ドアには鍵がかかっている。");
        }),
        description: "管理室ドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 81.9,
        y: 25.2,
        width: 11.4,
        height: 5.2,
        onClick: clickWrap(function () {
          updateMessage("ここは管理室のようだ");
        }),
        description: "管理室プレート",
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
            changeRoom("locker");
          },
          { allowAtNight: true },
        ),
        description: "管理室ドア戻る、ロッカーへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  printerDesk: {
    name: "プリンターデスク",
    description: "プリンター用のPCです。",
    clickableAreas: [
      {
        x: 16.2,
        y: 24.2,
        width: 43.6,
        height: 30.4,
        onClick: clickWrap(function () {
          showPrinterHistoryModal();
        }),
        description: "印刷用PC",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 72.9,
        y: 48.0,
        width: 18.8,
        height: 6.4,
        onClick: clickWrap(function () {
          updateMessage("プリント後の紙が出てくるエリアだ。");
        }),
        description: "プリント後の紙が出てくるエリア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 68.2,
        y: 38.8,
        width: 28.6,
        height: 18.6,
        onClick: clickWrap(function () {
          const printed = getLastPrintedDocument();
          if (!printed) return;
          showPrintedPaperModal(printed);
        }),
        description: "印刷された紙",
        zIndex: 6,
        usable: () => !!gameState.main?.flags?.printerPaperVisible,
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("workRoom");
        }),
        description: "プリンターデスク左、執務室へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
    ],
  },
  meetingRoom: {
    name: "会議室",
    description: "打ち合わせ用の部屋です。",
    clickableAreas: [
      {
        x: 47.1,
        y: 31.3,
        width: 16.2,
        height: 16.0,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.stringSquare, "文字が書かれたマスだ");
        }),
        description: "文字のマス",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 64.7,
        y: 38.0,
        width: 19.5,
        height: 15.0,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.todo, "TODOリストが貼られている");
        }),
        description: "todoリスト",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 31.4,
        y: 36.2,
        width: 15.3,
        height: 13.4,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "eraser") {
            eraseMeetingBoardMess();
            return;
          }
          updateMessage("ごちゃごちゃと何か描かれている");
        }),
        description: "ごちゃごちゃの絵",
        zIndex: 5,
        usable: () => !gameState.main.flags.eraseMess,
        item: { img: "messOnBoard", visible: () => !gameState.main.flags.eraseMess },
      },
      {
        x: 31.4,
        y: 36.2,
        width: 15.3,
        height: 13.4,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.numOnBoardZoom, "数字が見える");
        }),
        description: "消した後の絵",
        zIndex: 5,
        usable: () => gameState.main.flags.eraseMess,
        item: { img: "numOnBoard", visible: () => gameState.main.flags.eraseMess },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(function () {
          changeRoom("reception");
        }),
        description: "受付へ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
    ],
  },
  entrance: {
    name: "エントランス",
    description: "",
    clickableAreas: [
      {
        x: 51.1,
        y: 42.5,
        width: 14.4,
        height: 14.0,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockDoor) {
            updateMessage("タイルがはめ込まれている。");
            return;
          }
          if (gameState.selectedItem === "tile") {
            f.unlockDoor = true;
            removeItem("tile");
            playSE?.("se-gacha");
            renderCanvasRoom?.();
            updateMessage("タイルをはめ込むと、錠が外れる音がした。");
            return;
          }
          updateMessage("何かをはめ込むための枠のようだ。");
        }),
        description: "嵌め込み用枠",
        zIndex: 5,
        usable: () => true,
        item: { img: () => (gameState.main.flags.unlockDoor ? "tile" : "IMAGE_KEY"), visible: () => true },
      },
      {
        x: 56.0,
        y: 35.6,
        width: 4.4,
        height: 3.5,
        onClick: clickWrap(function () {}),
        description: "ドアロック表示",
        zIndex: 5,
        usable: () => false,
        item: { img: () => (gameState.main.flags.unlockDoor ? "greenBack" : "redBack"), visible: () => true },
      },
      {
        x: 31.1,
        y: 15.4,
        width: 38.1,
        height: 79.1,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockDoor) {
            if (gameState.main.flags.readWarmMail) {
              travelWithStepsTrueEnd();
              return;
            }
            travelToEndWithFootsteps();
            return;
          }
          updateMessage("ドアはまだ開かない。");
        }),
        description: "外へのドア",
        zIndex: 2,
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
            changeRoom("locker");
          },
          { allowAtNight: true },
        ),
        description: "エントランス戻る、ロッカーへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  adminRoom: {
    name: "管理室",
    description: "",
    clickableAreas: [
      {
        x: 71.3,
        y: 3.0,
        width: 14.8,
        height: 12.4,
        onClick: clickWrap(function () {
          showObj(null, "感謝状だ", IMAGES.modals.thanksLetter, "感謝状が飾ってある", IMAGES.modals.thanksLetterEn);
        }),
        description: "感謝状",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 84.4,
        y: 21.6,
        width: 12.3,
        height: 12.2,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.memoListen, "何かの標語だろうか");
        }),
        description: "メモリッスン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 45.3,
        y: 53.8,
        width: 21.0,
        height: 30.9,
        onClick: clickWrap(function () {
          updateMessage("使い込まれた椅子だ");
        }),
        description: "椅子",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 4.2,
        y: 36.1,
        width: 32.7,
        height: 23.9,
        onClick: clickWrap(function () {
          showAdminPcLoginPuzzle();
        }),
        description: "管理PC",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 10.2,
        y: 70.6,
        width: 12.6,
        height: 8.2,
        onClick: clickWrap(function () {
          showAdminRoomDrawerTopPuzzle();
        }),
        description: "管理室引き出し上段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 10.4,
        y: 83.1,
        width: 12.3,
        height: 7.5,
        onClick: clickWrap(function () {
          showAdminRoomDrawerBottomPuzzle();
        }),
        description: "管理室引き出し下段",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 32.6,
        y: 12.8,
        width: 27.5,
        height: 11.3,
        onClick: clickWrap(function () {
          showModal("確認", "「減免者一覧」というファイルがある。読みますか？", [
            {
              text: "はい",
              action: () => {
                showPaperDocumentModal("減免者一覧", {
                  heading: "利用料減免対象者一覧",
                  subtitle: "対象期間：2026年1月",
                  columns: ["No", "氏名", "申請区分", "減免率", "適用期間", "承認"],
                  rows: [
                    ["01", "栗島 アキ", "学習支援A", "50%", "2026/1/1～2026/1/31", "済"],
                    ["02", "伸丸 ミナト", "学習支援B", "30%", "2026/1/1～2026/1/31", "済"],
                    ["03", "耳長 キラ", "学習支援A", "50%", "2026/1/1～2026/1/31", "済"],
                  ],
                  notesTitle: "備考",
                  notes: ["学生証確認済", "学習目的利用に限る", "ドリンク無料対象者を含む"],
                });
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "本棚上段右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 1.0,
        y: 12.2,
        width: 27.1,
        height: 12.3,
        onClick: clickWrap(function () {
          showModal("確認", "「スタッフ応募書類」というファイルがある。読みますか？", [
            {
              text: "はい",
              action: () => {
                showPaperDocumentModal("スタッフ応募書類", {
                  heading: "OFFICE CRO-CO スタッフ応募シート",
                  sections: [
                    { label: "氏名", value: "耳長 キラ" },
                    { label: "年齢", value: "18歳" },
                    { label: "希望勤務日数", value: "週2～3日" },
                    { label: "希望時間帯", value: "平日 17:00～21:00 / 土日応相談" },
                    {
                      label: "志望動機",
                      value: "高校3年生の受験期に、学習支援制度を利用してOFFICE CRO-COを使わせていただきました。\n静かで安心して勉強できる環境にとても助けられました。\n自分も利用者を支える側として関わりたいと思い、応募いたしました。",
                    },
                    {
                      label: "自己PR",
                      value: "利用者の方が気持ちよく過ごせる空間づくりに貢献したいです。",
                    },
                  ],
                  notesTitle: "備考",
                  notes: ["学習支援減免制度 利用歴あり", "学生証確認済"],
                });
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "本棚上段左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 42.4,
        y: 26.5,
        width: 17.3,
        height: 13.7,
        onClick: clickWrap(function () {
          showModal("確認", "「月次運営報告」というファイルがある。読みますか？", [
            {
              text: "はい",
              action: () => {
                showPaperDocumentModal("月次運営報告", {
                  heading: "月次運営報告書（抜粋）",
                  subtitle: "2026年1月",
                  sections: [
                    { label: "売上計", value: "1,082,000円\n（うち違反金収入　362,000円）" },
                    { label: "支出計", value: "1,037,000円" },
                    { label: "営業利益", value: "45,000円" },
                  ],
                  notesTitle: "備考",
                  notes: ["カメラ台数増により違反件数増加", "防犯設備維持費および警備費負担大", "学習支援減免制度 継続中"],
                });
              },
            },
            { text: "いいえ", action: "close" },
          ]);
        }),
        description: "本棚中段",
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
            changeRoom("adminDoor");
          },
          { allowAtNight: true },
        ),
        description: "管理室戻る、管理室ドアへ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  pcAdmin: {
    name: "管理PC",
    description: "",
    clickableAreas: [
      {
        x: 24.3,
        y: 31.3,
        width: 19.0,
        height: 18.7,
        onClick: clickWrap(function () {
          showAdminPcWarmMail();
        }),
        description: "メールアイコン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 24.1,
        y: 5.8,
        width: 19.0,
        height: 19.7,
        onClick: clickWrap(function () {
          showAdminPcTrashExplorer();
        }),
        description: "ゴミ箱アイコン",
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
            changeRoom("adminRoom");
          },
          { allowAtNight: true },
        ),
        description: "管理PC戻る、管理室へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  end: {
    name: "ノーマルエンド",
    description: "不思議なコワーキングスペースから脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 35.7,
        y: 67.3,
        width: 10.6,
        height: 16.0,
        onClick: clickWrap(function () {
          updateMessage("美味しい");
        }),
        description: "プレイヤー",
        zIndex: 5,
        usable: () => gameState.end.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 23.8,
        y: 16.4,
        width: 14.8,
        height: 15.3,
        onClick: clickWrap(function () {
          updateMessage("クマ妖精はドリンクを飲んでいる");
        }),
        description: "飛ぶクマ妖精",
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
    description: "不思議なコワーキングスペースから脱出おめでとうございます！",
    clickableAreas: [
      {
        x: 9.3,
        y: 49.3,
        width: 21.1,
        height: 28.5,
        onClick: clickWrap(function () {
          updateMessage("クマ妖精は満足そうだ");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 31.3,
        y: 72.3,
        width: 14.1,
        height: 24.9,
        onClick: clickWrap(function () {
          updateMessage("深みのある味わいのドリンクだ");
        }),
        description: "プレイヤーの手",
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
    bear: ["おはよう", "お仕事しに来たの？"],
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

function travelToEndWithFootsteps() {
  const overlay = document.getElementById("roomEffectOverlay");
  if (hasItem("elixir")) {
    gameState.end.flags.backgroundState = Math.min(1, (gameState.end.flags.backgroundState || 0) + 1);
  }

  playSE?.("se-ashioto");

  if (overlay) {
    overlay.style.background = "#000";
    overlay.style.opacity = 1;
  }

  setTimeout(() => {
    changeRoom("end");
    setTimeout(() => {
      if (overlay) overlay.style.opacity = 0;
    }, 100);
  }, 480);
}

function travelWithStepsTrueEnd() {
  const overlay = document.getElementById("roomEffectOverlay");
  let destRoom = "trueEnd";
  const hasElixir = hasItem("elixir");
  if (hasElixir) {
    gameState.trueEnd.flags.backgroundState = 1;
    removeItem("elixir");
  }
  const calledEggBento = !!gameState.main?.flags?.calledEggBento;
  if (calledEggBento) {
    gameState.trueEnd.flags.backgroundState++;
  }

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

function eraseMeetingBoardMess() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const fx = gameState.fx || (gameState.fx = {});
  if (f.eraseMess) {
    updateMessage("数字が見える");
    return;
  }
  if (gameState.selectedItem !== "eraser" || !hasItem("eraser")) {
    updateMessage("ごちゃごちゃと何か描かれている");
    return;
  }

  removeItem("eraser");
  f.eraseMess = true;
  fx.meetingBoardErase = {
    roomId: "meetingRoom",
    progress: 0,
  };
  playOptionalSE?.("se-cloth");
  updateMessage("ごちゃごちゃした絵を消している…");
  renderCanvasRoom();

  const duration = 680;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.meetingBoardErase;
    if (!curFx) return;

    curFx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom();

    if (curFx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.meetingBoardErase;
    renderCanvasRoom();
    updateMessage("ごちゃごちゃした絵を消すと、数字が現れた。");
  };

  requestAnimationFrame(tick);
}

// ゲーム初期化
function initGame() {
  renderNavigation();
  changeRoom("reception");
  updateMessage("気が付くと受付に立っていた。");
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

  if (roomId === "pcReception" && f.foundKeyB) {
    f.revealedDeskKey = true;
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
    changeBGM("sounds/33/Juno.mp3");
  } else if (roomId === "end") {
    changeBGM("sounds/33/Midsummer_dream.mp3");
  } else {
    changeBGM("sounds/33/You_Behind_the_Veil.mp3");
  }

  // nav
  if (roomId === "locker" || roomId === "entrance" || roomId === "workRoom" || roomId === "printerDesk" || roomId === "reception" || roomId === "meetingRoom" || roomId === "adminRoom") {
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
  drawDrinkAreaCabinetDoorFx(ctx, canvas, roomId);
  drawCoffeeMachineButtonGlowFx(ctx, canvas, roomId);
  drawCoffeeMachineFillFx(ctx, canvas, roomId);
  drawWaterServerFillFx(ctx, canvas, roomId);
  drawWorkRoomDrawerFx(ctx, canvas, roomId);
  drawDeskDrawerFx(ctx, canvas, roomId);
  drawLockerDoorFx(ctx, canvas, roomId);
  drawShelfCabinetDoorFx(ctx, canvas, roomId);
  drawMeetingBoardEraseFx(ctx, canvas, roomId);
  drawWindowRightCabinetSlideFx(ctx, canvas, roomId);
  drawWindowLeftCabinetSlideFx(ctx, canvas, roomId);
  drawPrinterPaperFx(ctx, canvas, roomId);

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

function drawMeetingBoardEraseFx(ctx, canvas, roomId) {
  if (roomId !== "meetingRoom") return;
  const fx = gameState.fx?.meetingBoardErase;
  if (!fx || fx.roomId !== "meetingRoom") return;

  const rect = getAreaRectPx("meetingRoom", "ごちゃごちゃの絵", canvas);
  if (!rect) return;

  const messImg = loadedImages[IMAGES.items.messOnBoard];
  const numImg = loadedImages[IMAGES.items.numOnBoard];
  if (!messImg || !numImg) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const wipe = Math.min(1, t * 1.15);

  ctx.save();

  ctx.globalAlpha = 1 - t;
  ctx.drawImage(messImg, rect.x, rect.y, rect.w, rect.h);

  ctx.globalAlpha = Math.max(0, (t - 0.15) / 0.85);
  ctx.drawImage(numImg, rect.x, rect.y, rect.w, rect.h);

  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "#f2f2ef";
  const wipeWidth = rect.w * wipe;
  ctx.fillRect(rect.x, rect.y, wipeWidth, rect.h);

  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 4; i++) {
    const bandX = rect.x + wipeWidth - rect.w * (0.18 - i * 0.04);
    ctx.fillRect(bandX, rect.y, rect.w * 0.035, rect.h);
  }

  ctx.restore();
}

function drawDrinkAreaCabinetDoorFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.drinkAreaCabinetOpen;
  if (!fx || roomId !== "drinkArea" || fx.roomId !== "drinkArea") return;

  const rect = getAreaRectPx("drinkArea", fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const openEase = easeOutCubic(t);
  const hingeW = Math.max(2, rect.w * 0.038);
  const shadowW = rect.w * 0.18 * openEase;
  const panelDepth = rect.w * 0.16 * openEase;
  const topSkew = rect.h * 0.04 * openEase;

  ctx.save();

  if (openEase > 0.02) {
    const cavity = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y);
    cavity.addColorStop(0, "rgba(10, 7, 5, 0.96)");
    cavity.addColorStop(0.5, "rgba(20, 12, 8, 0.92)");
    cavity.addColorStop(1, "rgba(28, 18, 12, 0.88)");
    ctx.fillStyle = cavity;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

    ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
    ctx.fillRect(rect.x + rect.w - shadowW, rect.y, shadowW, rect.h);
    ctx.fillRect(rect.x, rect.y, shadowW, rect.h);
  }

  const visibleRatio = Math.max(0.18, 1 - openEase * 0.78);
  const halfW = rect.w / 2;
  const leftPanelW = halfW * visibleRatio;
  const rightPanelW = halfW * visibleRatio;
  const leftPanelX = rect.x;
  const rightPanelX = rect.x + rect.w - rightPanelW;
  const outerShorten = rect.h * 0.12 * openEase;

  const leftWood = ctx.createLinearGradient(leftPanelX, rect.y, leftPanelX + leftPanelW, rect.y);
  leftWood.addColorStop(0, "#8a643a");
  leftWood.addColorStop(0.55, "#AB814F");
  leftWood.addColorStop(1, "#c59a63");
  const rightWood = ctx.createLinearGradient(rightPanelX, rect.y, rightPanelX + rightPanelW, rect.y);
  rightWood.addColorStop(0, "#c59a63");
  rightWood.addColorStop(0.45, "#AB814F");
  rightWood.addColorStop(1, "#8a643a");

  const drawPanel = (side) => {
    const isLeft = side === "left";
    const panelX = isLeft ? leftPanelX : rightPanelX;
    const panelW = isLeft ? leftPanelW : rightPanelW;
    const grad = isLeft ? leftWood : rightWood;
    const outerX = isLeft ? rect.x : rect.x + rect.w;
    const innerTopX = isLeft ? panelX + panelW : panelX;
    const innerBottomX = isLeft ? panelX + panelW - panelDepth : panelX + panelDepth;
    const outerTopY = rect.y + outerShorten * 0.5;
    const outerBottomY = rect.y + rect.h - outerShorten;
    const innerTopY = rect.y + topSkew;
    const innerBottomY = rect.y + rect.h - topSkew * 0.35;

    ctx.save();
    ctx.fillStyle = grad;
    ctx.strokeStyle = "rgba(61, 36, 18, 0.95)";
    ctx.lineWidth = Math.max(1.4, rect.w * 0.02);
    ctx.beginPath();
    if (isLeft) {
      ctx.moveTo(outerX, outerTopY);
      ctx.lineTo(innerTopX, innerTopY);
      ctx.lineTo(innerBottomX, innerBottomY);
      ctx.lineTo(outerX, outerBottomY);
    } else {
      ctx.moveTo(innerTopX, innerTopY);
      ctx.lineTo(outerX, outerTopY);
      ctx.lineTo(outerX, outerBottomY);
      ctx.lineTo(innerBottomX, innerBottomY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const panelLine1 = isLeft ? outerX + panelW * 0.28 : outerX - panelW * 0.28;
    const panelLine2 = isLeft ? outerX + panelW * 0.62 : outerX - panelW * 0.62;
    ctx.strokeStyle = "rgba(90, 57, 27, 0.42)";
    ctx.lineWidth = Math.max(1, rect.w * 0.008);
    ctx.beginPath();
    ctx.moveTo(panelLine1, rect.y + rect.h * 0.16);
    ctx.lineTo(isLeft ? panelLine1 - panelDepth * 0.42 : panelLine1 + panelDepth * 0.42, rect.y + rect.h * 0.84);
    ctx.moveTo(panelLine2, rect.y + rect.h * 0.16);
    ctx.lineTo(isLeft ? panelLine2 - panelDepth * 0.42 : panelLine2 + panelDepth * 0.42, rect.y + rect.h * 0.84);
    ctx.stroke();
    ctx.restore();

    const gripW = Math.max(4, rect.w * 0.022);
    const gripH = Math.max(14, rect.h * 0.18);
    const gripAnchorX = isLeft ? outerX + panelW * 0.66 : outerX - panelW * 0.66;
    const gripShiftX = isLeft ? -panelDepth * 0.24 : panelDepth * 0.24;
    const gripX = gripAnchorX + gripShiftX - gripW / 2;
    const gripY = rect.y + rect.h * 0.14;
    const gripR = Math.max(2, gripW * 0.45);

    ctx.save();
    ctx.fillStyle = "#5e6670";
    roundRect(ctx, gripX, gripY, gripW, gripH, gripR, true, false);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = Math.max(1, gripW * 0.28);
    ctx.beginPath();
    ctx.moveTo(gripX + gripW * 0.32, gripY + gripH * 0.16);
    ctx.lineTo(gripX + gripW * 0.32, gripY + gripH * 0.84);
    ctx.stroke();
    ctx.restore();
  };

  drawPanel("left");
  drawPanel("right");

  ctx.restore();
}

function drawCoffeeMachineButtonGlowFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.coffeeMachineButtonGlow;
  if (!fx || roomId !== "coffeeMachine" || fx.roomId !== "coffeeMachine") return;

  const rect = getAreaRectPx("coffeeMachine", fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const pulse = Math.sin(t * Math.PI);
  const glowAlpha = 0.22 + pulse * 0.3;
  const strokeAlpha = 0.35 + pulse * 0.45;
  const hue = fx.kind === "water" ? "90, 200, 255" : fx.kind === "milk" ? "255, 243, 196" : "255, 205, 120";

  ctx.save();
  ctx.shadowColor = `rgba(${hue}, ${0.55 + pulse * 0.25})`;
  ctx.shadowBlur = 12 + pulse * 10;
  ctx.fillStyle = `rgba(${hue}, ${glowAlpha})`;
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, Math.max(5, rect.h * 0.18), true, false);
  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = `rgba(255,255,255,${strokeAlpha})`;
  roundRect(ctx, rect.x + 1, rect.y + 1, rect.w - 2, rect.h - 2, Math.max(4, rect.h * 0.16), false, true);
  ctx.restore();
}

function drawCoffeeMachineFillFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.coffeeMachineFill;
  if (!fx || roomId !== "coffeeMachine" || fx.roomId !== "coffeeMachine") return;

  const rect = getAreaRectPx("coffeeMachine", "入ったコーヒー", canvas);
  const img = loadedImages[IMAGES.items.coffeeMachineAfter];
  if (!rect || !img || !img.complete || img.naturalWidth <= 0) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const eased = easeOutCubic(t);
  const revealH = Math.max(1, Math.floor(rect.h * eased));
  const srcH = Math.max(1, Math.floor(img.naturalHeight * eased));

  ctx.save();
  ctx.drawImage(img, 0, img.naturalHeight - srcH, img.naturalWidth, srcH, rect.x, rect.y + rect.h - revealH, rect.w, revealH);
  ctx.restore();
}

function drawWaterServerFillFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.waterServerFill;
  if (!fx || roomId !== "drinkArea" || fx.roomId !== "drinkArea") return;

  const cupRect = getAreaRectPx("drinkArea", "ウォーターサーバーコップ配置箇所", canvas);
  const serverRect = getAreaRectPx("drinkArea", "ウォーターサーバー", canvas);
  if (!cupRect || !serverRect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const streamPhase = Math.max(0, Math.min(1, (t - 0.16) / 0.72));
  const fade = t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15;
  if (streamPhase <= 0 || fade <= 0) return;

  const nozzleX = serverRect.x + serverRect.w * 0.18;
  const nozzleY = serverRect.y + serverRect.h * 0.53;
  const cupCx = cupRect.x + cupRect.w * 0.52;
  const cupTopY = cupRect.y + cupRect.h * 0.18;
  const streamBottomY = nozzleY + (cupTopY - nozzleY) * easeOutCubic(streamPhase);
  const streamW = Math.max(4, cupRect.w * 0.34);
  const glowW = streamW * 1.9;

  ctx.save();
  ctx.globalAlpha = 0.9 * fade;
  ctx.fillStyle = "rgba(112, 206, 255, 0.65)";
  roundRect(ctx, cupCx - streamW / 2, nozzleY, streamW, Math.max(4, streamBottomY - nozzleY), Math.max(2, streamW * 0.45), true, false);

  ctx.globalAlpha = 0.35 * fade;
  ctx.fillStyle = "rgba(215, 246, 255, 0.85)";
  roundRect(ctx, cupCx - glowW / 2, nozzleY, glowW, Math.max(4, streamBottomY - nozzleY), Math.max(3, glowW * 0.5), true, false);

  if (streamPhase > 0.72) {
    const splashT = (streamPhase - 0.72) / 0.28;
    const splashW = cupRect.w * (0.48 + splashT * 0.22);
    const splashH = Math.max(3, cupRect.h * 0.16);
    ctx.globalAlpha = 0.45 * fade;
    ctx.fillStyle = "rgba(188, 236, 255, 0.88)";
    ctx.beginPath();
    ctx.ellipse(cupCx, cupTopY + splashH * 0.35, splashW / 2, splashH, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function pressCoffeeMachineButton(kind) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const expected = ["water", "water", "bean", "milk", "water", "water"];
  const labels = {
    water: "水ボタンを押した。",
    bean: "豆ボタンを押した。",
    milk: "ミルクボタンを押した。",
  };

  if (f.makeCoffee) {
    playCoffeeMachineButtonGlowFx(kind);
    updateMessage(labels[kind] || "ボタンを押した。");
    return;
  }

  playCoffeeMachineButtonGlowFx(kind);
  const curStep = Math.max(0, Number(f.coffeeRecipeStep) || 0);
  let nextStep = 0;
  if (expected[curStep] === kind) {
    nextStep = curStep + 1;
  } else if (expected[0] === kind) {
    nextStep = 1;
  }
  f.coffeeRecipeStep = nextStep;

  if (nextStep >= expected.length) {
    f.coffeeRecipeStep = 0;
    playCoffeeMachineFillFx();
    return;
  }

  updateMessage(labels[kind] || "ボタンを押した。");
}

function playCoffeeMachineButtonGlowFx(kind) {
  if (gameState.currentRoom !== "coffeeMachine") return;

  const fx = gameState.fx || (gameState.fx = {});
  const descriptions = {
    bean: "豆ボタン",
    water: "水ボタン",
    milk: "ミルクボタン",
  };

  fx.coffeeMachineButtonGlow = {
    roomId: "coffeeMachine",
    kind,
    areaDescription: descriptions[kind] || "水ボタン",
    progress: 0,
  };
  renderCanvasRoom();

  const dur = 180;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.coffeeMachineButtonGlow;
    if (!curFx || curFx.kind !== kind) return;

    const t = Math.min(1, (now - start) / dur);
    curFx.progress = t;
    renderCanvasRoom();
    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    if (gameState.fx?.coffeeMachineButtonGlow === curFx) {
      delete gameState.fx.coffeeMachineButtonGlow;
      renderCanvasRoom();
    }
  };

  requestAnimationFrame(tick);
}

function playDrinkAreaCabinetOpenFx(areaDescription, onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.drinkAreaCabinetOpen) {
    onDone?.();
    return;
  }

  if (gameState.currentRoom !== "drinkArea") {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.drinkAreaCabinetOpen = {
    roomId: "drinkArea",
    areaDescription,
    progress: 0,
  };

  playSE?.("se-door-close");
  renderCanvasRoom();

  const duration = 440;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.drinkAreaCabinetOpen;
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
        delete gameState.fx.drinkAreaCabinetOpen;
        gameState.fx.lockInput = false;
      }
      renderCanvasRoom();
      onDone?.();
    }, 120);
  };

  requestAnimationFrame(tick);
}

// ===== 演出ユーティリティ =====
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const PRINTER_DOCUMENTS = [
  {
    id: "life-handout",
    fileName: "2026_03_office-cro-co.pdf",
    modalTitle: "2026_03_オフィスクロコ.pdf",
    printPin: "9696",
    modalBody: `
      <div style="display:flex;flex-direction:column;gap:10px;text-align:left;color:#2d2216;line-height:1.8;">
        <div style="font-size:1.15em;font-weight:700;text-align:center;">請求書</div>
        <div>宛名：鈴木様</div>
        <div>利用期間：2026年3月</div>
        <div style="height:4px;"></div>
        <div>◇デスク利用料　¥12,000</div>
        <div>◇環境維持費　¥2,000</div>
        <div>◇見守りサービス料　¥2,000</div>
        <div>違反料金（計）　¥21,000</div>
        <div>（内訳非公開）</div>
        <div>◇システム利用料　¥1,200</div>
        <div>請求書発行手数料　¥300</div>
        <div style="height:4px;"></div>
        <div style="font-weight:700;">合計　¥38,500</div>
      </div>
    `,
  },
  {
    id: "coffee-recipe",
    fileName: "memo-coffee.txt",
    modalTitle: "コーヒーマシン操作メモ.txt",
    modalBody: `
      <div style="text-align:left;line-height:1.8;">
        <div>まず、水ボタン。2回押す</div>
        <div>つぎに、豆ボタン、ミルクボタンの順に押す</div>
        <div>最後に、水ボタンを2回押す。</div>
      </div>
    `,
  },
  {
    id: "violation_logs",
    fileName: "違反履歴ログ.txt",
    modalTitle: "違反履歴ログ.txt",
    renderBody: renderViolationLogsBody,
  },
  {
    id: "staff_notice",
    fileName: "to_staff_ver2.docx",
    modalTitle: "スタッフ各位_ver2.docx",
    modalBody: `
      <div style="text-align:left;line-height:1.9;">
        <div style="font-weight:700;">【運営方針に関する共有】</div>
        <div style="height:8px;"></div>
        <div>本施設の運営においては、以下の点を徹底してください。</div>
        <div style="height:8px;"></div>
        <div>・利用料・違反金の徴収は例外なく実施すること</div>
        <div>・減免対象者の確認は必ず所定のリストに基づくこと</div>
        <div style="height:8px;"></div>
        <div>なお、減免制度の運用については、外部への説明を行わないこと。</div>
        <div>本制度は当施設の運営基盤に関わる重要事項であり、取り扱いには十分注意してください。</div>
      </div>
    `,
  },
];

const ADMIN_PC_TRASH_FILES = [
  { fileName: "未送信_奨学生への返信.txt", kind: "テキスト ドキュメント", modifiedAt: "2026/03/18 09:42" },
  { fileName: "違反項目改訂案.docx", kind: "DOCXファイル", modifiedAt: "2026/03/20 14:08" },
  { fileName: "違反検知ロジック_v3.xlsx", kind: "XLSXファイル", modifiedAt: "2026/03/24 18:31" },
];

function showAdminPcTrashExplorer() {
  const formatShortDate = (value) => {
    const m = String(value || "").match(/^(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})$/);
    if (!m) return value;
    return `${Number(m[2])}/${Number(m[3])} ${m[4]}:${m[5]}`;
  };

  const rows = ADMIN_PC_TRASH_FILES.map(
    (file) => `
    <div style="display:grid;grid-template-columns:minmax(0,2.5fr) minmax(68px,0.9fr) minmax(76px,0.9fr);gap:8px;align-items:center;padding:6px 8px;border-bottom:1px solid #c7c7c7;background:#ffffff;font-size:0.9em;">
      <div style="display:flex;align-items:flex-start;gap:8px;min-width:0;">
        <span aria-hidden="true" style="font-size:18px;line-height:1;">📄</span>
        <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:normal;word-break:break-word;line-height:1.25;">${file.fileName}</span>
      </div>
      <div style="color:#222;white-space:nowrap;font-size:0.84em;">${formatShortDate(file.modifiedAt)}</div>
      <div style="color:#222;white-space:normal;overflow:hidden;text-overflow:ellipsis;font-size:0.84em;line-height:1.2;">${file.kind}</div>
    </div>
  `,
  ).join("");

  const content = `
    <div style="width:min(100%,580px);margin:0 auto;border:2px solid #ffffff;box-shadow:inset -1px -1px 0 #3f3f3f,inset 1px 1px 0 #d8d8d8,4px 4px 0 rgba(0,0,0,0.25);background:#c6c6c6;color:#111;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:5px 8px;background:linear-gradient(90deg,#0a2f83 0%,#2e68c7 100%);color:#fff;font-weight:700;font-size:0.95em;">
        <div>ゴミ箱</div>
        <div style="display:flex;gap:4px;">
          <span style="display:grid;place-items:center;width:16px;height:16px;border:1px solid rgba(255,255,255,0.7);background:#c6c6c6;color:#111;font-size:11px;line-height:1;">_</span>
          <span style="display:grid;place-items:center;width:16px;height:16px;border:1px solid rgba(255,255,255,0.7);background:#c6c6c6;color:#111;font-size:10px;line-height:1;">□</span>
          <span style="display:grid;place-items:center;width:16px;height:16px;border:1px solid rgba(255,255,255,0.7);background:#c6c6c6;color:#111;font-size:11px;line-height:1;">×</span>
        </div>
      </div>
      <div style="padding:8px;border-top:1px solid #ffffff;">
        <div style="border:1px solid #808080;box-shadow:inset 1px 1px 0 #ffffff,inset -1px -1px 0 #9a9a9a;background:#efefef;">
          <div style="padding:6px 8px;border-bottom:1px solid #b3b3b3;background:#ece9d8;font-size:0.9em;color:#333;">C:\\WINDOWS\\デスクトップ\\ゴミ箱</div>
          <div style="padding:6px 8px;border-bottom:1px solid #bcbcbc;background:#f4f4f4;font-size:0.88em;color:#333;">3 個のオブジェクト</div>
          <div style="display:grid;grid-template-columns:minmax(0,2.5fr) minmax(68px,0.9fr) minmax(76px,0.9fr);gap:8px;padding:5px 8px;background:#dfe3ea;border-top:1px solid #ffffff;border-bottom:1px solid #8f8f8f;font-size:0.82em;font-weight:700;color:#222;">
            <div>名前</div>
            <div>更新</div>
            <div>種類</div>
          </div>
          <div>${rows}</div>
        </div>
      </div>
    </div>
  `;

  showModal("", content, [{ text: "閉じる", action: "close" }]);
}

function showPrinterHistoryModal() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const selectedIndex = Math.max(0, Math.min(PRINTER_DOCUMENTS.length - 1, Number(f.printerHistorySelection) || 0));

  const rows = PRINTER_DOCUMENTS.map((doc, idx) => {
    const checked = idx === selectedIndex ? "checked" : "";
    return `
      <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid rgba(212,175,55,0.35);border-radius:10px;background:rgba(255,255,255,0.04);cursor:pointer;">
        <input type="radio" name="printerHistoryFile" value="${idx}" ${checked} style="accent-color:#d4af37;transform:scale(1.15);">
        <span style="text-align:left;word-break:break-all;">${doc.fileName}</span>
      </label>
    `;
  }).join("");

  const content = `
    <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
      <div style="font-weight:700;text-align:center;">再印刷するファイルを選んでください</div>
      <div style="display:flex;flex-direction:column;gap:8px;">${rows}</div>
      <div id="printerHistoryHint" style="min-height:1.2em;color:#ffd37a;text-align:center;font-size:0.92em;"></div>
    </div>
  `;

  showModal(
    "印刷履歴",
    content,
    [
      {
        text: "再印刷",
        action: () => {
          const selected = document.querySelector('input[name="printerHistoryFile"]:checked');
          const hintEl = document.getElementById("printerHistoryHint");
          if (!selected) {
            if (hintEl) hintEl.textContent = "再印刷するファイルを選択してください。";
            playOptionalSE("se-error");
            return;
          }

          const idx = Math.max(0, Math.min(PRINTER_DOCUMENTS.length - 1, Number(selected.value) || 0));
          f.printerHistorySelection = idx;
          closeModal();
          requestPrinterDocumentOutput(PRINTER_DOCUMENTS[idx]);
        },
      },
      { text: "閉じる", action: "close" },
    ],
    null,
    {
      columnButtons: true,
    },
  );
}

function drawPrinterPaperFx(ctx, canvas, roomId) {
  if (roomId !== "printerDesk") return;
  const fx = gameState.fx?.printerPaper;
  const f = gameState.main.flags || {};
  const isAnimating = !!(fx && fx.roomId === "printerDesk");
  const isVisible = !!f.printerPaperVisible;
  if (!isAnimating && !isVisible) return;

  const rect = getAreaRectPx("printerDesk", "プリント後の紙が出てくるエリア", canvas);
  if (!rect) return;

  const t = isAnimating ? Math.max(0, Math.min(1, Number(fx.progress) || 0)) : 1;
  const ease = easeOutCubic(t);
  const paperH = Math.max(rect.h * 2.5, canvas.height * 0.058);
  const sideOverhang = rect.w * (0.18 + 0.16 * ease);
  const topLift = rect.h * (0.9 + 0.5 * ease);
  const bottomDrop = rect.h * (0.08 + 0.12 * ease);
  const verticalShift = rect.h * 0.24;
  const leftInset = rect.w * 0.03;
  const rightInset = rect.w * 0.02;
  const topSag = paperH * 0.06;
  const bottomSag = paperH * 0.04;
  const depth = isAnimating ? Math.max(0, Math.min(1, (ease - 0.08) / 0.92)) : 1;
  const lerp = (a, b, k) => a + (b - a) * k;
  const rearCx = rect.x + rect.w * 0.52;
  const rearTopY = rect.y + rect.h * 0.42;
  const rearBottomY = rect.y + rect.h * 0.92;
  const rearHalfTop = rect.w * 0.1;
  const rearHalfBottom = rect.w * 0.18;

  const finalP1 = { x: rect.x - sideOverhang + leftInset, y: rect.y + rect.h + bottomDrop * 0.2 + verticalShift };
  const finalP2 = { x: rect.x + rect.w * 0.08, y: rect.y - topLift + verticalShift };
  const finalP3 = { x: rect.x + rect.w * 0.58, y: rect.y - topLift - topSag + verticalShift };
  const finalP4 = { x: rect.x + rect.w + sideOverhang - rightInset, y: rect.y - topLift * 0.86 + verticalShift };
  const finalP5 = { x: rect.x + rect.w + rect.w * 0.03, y: rect.y + rect.h + bottomDrop + verticalShift };
  const finalP6 = { x: rect.x + rect.w * 0.22, y: rect.y + rect.h + bottomDrop * 0.65 + bottomSag + verticalShift };

  const rearP1 = { x: rearCx - rearHalfBottom, y: rearBottomY };
  const rearP2 = { x: rearCx - rearHalfTop, y: rearTopY };
  const rearP3 = { x: rearCx + rearHalfTop * 0.2, y: rearTopY - rect.h * 0.03 };
  const rearP4 = { x: rearCx + rearHalfTop, y: rearTopY + rect.h * 0.02 };
  const rearP5 = { x: rearCx + rearHalfBottom, y: rearBottomY + rect.h * 0.02 };
  const rearP6 = { x: rearCx - rearHalfBottom * 0.15, y: rearBottomY + rect.h * 0.01 };

  const p1 = { x: lerp(rearP1.x, finalP1.x, depth), y: lerp(rearP1.y, finalP1.y, depth) };
  const p2 = { x: lerp(rearP2.x, finalP2.x, depth), y: lerp(rearP2.y, finalP2.y, depth) };
  const p3 = { x: lerp(rearP3.x, finalP3.x, depth), y: lerp(rearP3.y, finalP3.y, depth) };
  const p4 = { x: lerp(rearP4.x, finalP4.x, depth), y: lerp(rearP4.y, finalP4.y, depth) };
  const p5 = { x: lerp(rearP5.x, finalP5.x, depth), y: lerp(rearP5.y, finalP5.y, depth) };
  const p6 = { x: lerp(rearP6.x, finalP6.x, depth), y: lerp(rearP6.y, finalP6.y, depth) };

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.24)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "rgba(255, 250, 239, 0.98)";
  ctx.strokeStyle = "rgba(190, 178, 152, 0.95)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.quadraticCurveTo((p2.x + p3.x) / 2, p2.y - topSag * 0.5, p3.x, p3.y);
  ctx.quadraticCurveTo((p3.x + p4.x) / 2, p3.y + topSag * 0.35, p4.x, p4.y);
  ctx.lineTo(p5.x, p5.y);
  ctx.quadraticCurveTo((p5.x + p6.x) / 2, p5.y - bottomSag * 0.4, p6.x, p6.y);
  ctx.quadraticCurveTo((p6.x + p1.x) / 2, p6.y + bottomSag * 0.3, p1.x, p1.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
  ctx.beginPath();
  ctx.moveTo(lerp(rearCx - rearHalfTop * 0.7, rect.x + rect.w * 0.13, depth), lerp(rearTopY + 1, rect.y - topLift + verticalShift + 3, depth));
  ctx.lineTo(lerp(rearCx + rearHalfTop * 0.55, rect.x + rect.w * 0.78, depth), lerp(rearTopY - 1, rect.y - topLift + verticalShift - 1, depth));
  ctx.lineTo(lerp(rearCx + rearHalfTop * 0.48, rect.x + rect.w * 0.77, depth), lerp(rearTopY + 1, rect.y - topLift + verticalShift + 2, depth));
  ctx.lineTo(lerp(rearCx - rearHalfTop * 0.64, rect.x + rect.w * 0.14, depth), lerp(rearTopY + 3, rect.y - topLift + verticalShift + 6, depth));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(130, 130, 130, 0.14)";
  for (let i = 0; i < 3; i++) {
    const y = lerp(rearTopY + rect.h * (0.08 + i * 0.08), rect.y + rect.h * (0.2 + i * 0.24), depth);
    const startX = lerp(rearCx - rearHalfTop * 0.55, rect.x + rect.w * (0.17 + i * 0.02), depth);
    const width = lerp(rearHalfTop * 0.9, rect.w * (0.58 - i * 0.04), depth);
    ctx.fillRect(startX, y, width, 1);
  }

  ctx.fillStyle = "rgba(255, 232, 173, 0.16)";
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, Math.max(3, rect.h * 0.25), true, false);
  ctx.restore();
}

function getLastPrintedDocument() {
  const fileId = gameState.main?.flags?.lastPrintedFileId;
  if (!fileId) return null;
  return PRINTER_DOCUMENTS.find((doc) => doc.id === fileId) || null;
}

function getPrinterDocumentBody(doc) {
  if (!doc) return "";
  if (typeof doc.renderBody === "function") return doc.renderBody(doc);
  return doc.modalBody || "";
}

function showPrintedPaperModal(doc) {
  const content = `
    <div style="display:flex;flex-direction:column;gap:14px;text-align:left;">
      <div style="padding:10px 12px;border:1px solid rgba(212,175,55,0.35);border-radius:10px;background:rgba(255,255,255,0.04);word-break:break-all;">
        ${doc.fileName}
      </div>
      <div style="padding:16px 18px;border-radius:12px;background:rgba(255,250,239,0.96);color:#2d2216;border:1px solid rgba(160,130,90,0.4);">
        ${getPrinterDocumentBody(doc)}
      </div>
    </div>
  `;
  showModal(doc.modalTitle, content, [{ text: "閉じる", action: "close" }]);
}

function requestPrinterDocumentOutput(doc) {
  if (doc?.printPin) {
    showPrinterDocumentPinModal(doc);
    return;
  }
  startPrinterOutputFx(doc);
}

function showPrinterDocumentPinModal(doc) {
  const content = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;">
      <div style="font-size:0.96em;color:#ddd7c4;">このファイルの印刷にはPINが必要です</div>
      <input id="printerDocumentPinInput" class="puzzle-input" type="text" inputmode="numeric" maxlength="4" placeholder="PIN" autocomplete="off" spellcheck="false" style="width:180px;text-align:center;font-size:1.15em;letter-spacing:0.2em;">
      <button id="printerDocumentPinOk" class="ok-btn" type="button">印刷</button>
      <div id="printerDocumentPinHint" style="min-height:1.2em;font-size:0.92em;text-align:center;"></div>
    </div>
  `;

  showModal(`PIN認証 - ${doc.fileName}`, content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const input = document.getElementById("printerDocumentPinInput");
    const okBtn = document.getElementById("printerDocumentPinOk");
    const hintEl = document.getElementById("printerDocumentPinHint");
    if (!input || !okBtn || !hintEl) return;

    const submit = () => {
      if ((input.value || "").trim() === doc.printPin) {
        closeModal();
        startPrinterOutputFx(doc);
        return;
      }
      playOptionalSE("se-error");
      hintEl.textContent = "PINが違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    };

    input.focus();
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
    });
    okBtn.addEventListener("click", submit);
  }, 0);
}

function startPrinterOutputFx(doc, onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || gameState.currentRoom !== "printerDesk") {
    onDone?.();
    return;
  }
  const f = gameState.main.flags || (gameState.main.flags = {});

  fx.lockInput = true;
  fx.printerPaper = {
    roomId: "printerDesk",
    areaDescription: "プリント後の紙が出てくるエリア",
    progress: 0,
    fileName: doc.fileName,
  };
  f.lastPrintedFileId = doc.id;
  f.printerPaperVisible = false;

  playOptionalSE("se-printer");
  setTimeout(() => playOptionalSE("se-paper"), 140);
  updateMessage(`「${doc.fileName}」を再印刷した。`);
  renderCanvasRoom();

  const dur = 900;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.printerPaper;
    if (!curFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      onDone?.();
      return;
    }

    curFx.progress = Math.min(1, (now - start) / dur);
    renderCanvasRoom();
    if (curFx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setTimeout(() => {
      if (gameState.fx) {
        delete gameState.fx.printerPaper;
        gameState.fx.lockInput = false;
      }
      const flags = gameState.main.flags || (gameState.main.flags = {});
      flags.printerPaperVisible = true;
      renderCanvasRoom();
      onDone?.();
    }, 900);
  };

  requestAnimationFrame(tick);
}

function drawSlidingDrawerFx(ctx, rect, progress, options = {}) {
  if (!rect) return;

  const t = Math.max(0, Math.min(1, Number(progress) || 0));
  const slidePx = Math.max(12, rect.h * (options.slideRatio || 0.32)) * easeOutCubic(t);
  const insetX = Math.max(3, rect.w * 0.03);
  const insetY = Math.max(2, rect.h * 0.04);
  const cavityH = Math.max(8, Math.min(rect.h * 0.55, slidePx + rect.h * 0.18));

  const cavityColor = options.cavityColor || "rgb(22, 14, 9)";
  const cavityStroke = options.cavityStroke || "rgba(255, 220, 160, 0.18)";
  const frontFill = options.frontFill || "rgb(211, 161, 84)";
  const frontStroke = options.frontStroke || "rgba(180, 140, 95, 0.45)";
  const highlightStroke = options.highlightStroke || "rgba(230, 200, 150, 0.28)";
  const shadowColor = options.shadowColor || "rgba(0,0,0,0.35)";
  const shadowBlur = options.shadowBlur || 10;
  const knobStroke = options.knobStroke || "rgba(214, 220, 227, 0.98)";
  const knobHighlight = options.knobHighlight || "rgba(255, 255, 255, 0.5)";

  ctx.save();

  ctx.fillStyle = cavityColor;
  roundRect(ctx, rect.x + insetX, rect.y + insetY, rect.w - insetX * 2, Math.min(rect.h - insetY * 2, cavityH), Math.max(4, rect.h * 0.08), true, false);

  ctx.strokeStyle = cavityStroke;
  ctx.lineWidth = 1.5;
  roundRect(ctx, rect.x + insetX, rect.y + insetY, rect.w - insetX * 2, Math.min(rect.h - insetY * 2, cavityH), Math.max(4, rect.h * 0.08), false, true);

  const frontY = rect.y + slidePx;
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetY = Math.max(2, rect.h * 0.06);
  ctx.fillStyle = frontFill;
  ctx.strokeStyle = frontStroke;
  ctx.lineWidth = 2;
  roundRect(ctx, rect.x, frontY, rect.w, rect.h, Math.max(5, rect.h * 0.08), true, true);

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = highlightStroke;
  ctx.beginPath();
  ctx.moveTo(rect.x + 2, frontY + 2);
  ctx.lineTo(rect.x + rect.w - 2, frontY + 2);
  ctx.stroke();

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
  ctx.strokeStyle = knobStroke;

  ctx.beginPath();
  ctx.moveTo(knobX, knobY);
  ctx.lineTo(knobX, knobY + knobH - knobR);
  ctx.quadraticCurveTo(knobX, knobY + knobH, knobX + knobR, knobY + knobH);
  ctx.lineTo(knobX + knobW - knobR, knobY + knobH);
  ctx.quadraticCurveTo(knobX + knobW, knobY + knobH, knobX + knobW, knobY + knobH - knobR);
  ctx.lineTo(knobX + knobW, knobY);
  ctx.stroke();

  ctx.strokeStyle = knobHighlight;
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

function drawWorkRoomDrawerFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.workRoomDrawerOpen;
  if (!fx || roomId !== "workRoom" || fx.roomId !== "workRoom") return;
  const rect = getAreaRectPx("workRoom", fx.areaDescription, canvas);
  if (!rect) return;
  drawSlidingDrawerFx(ctx, rect, fx.progress, {
    slideRatio: 0.68,
    frontFill: "#905E36",
    frontStroke: "rgba(96, 67, 31, 0.72)",
    highlightStroke: "rgba(210, 176, 112, 0.18)",
    shadowBlur: 8,
    knobStroke: "rgba(136, 144, 154, 0.95)",
    knobHighlight: "rgba(225, 230, 236, 0.28)",
  });
}

function drawDeskDrawerFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.deskDrawerOpen;
  if (!fx || roomId !== "desk" || fx.roomId !== "desk") return;
  const rect = getAreaRectPx("desk", fx.areaDescription, canvas);
  if (!rect) return;
  drawSlidingDrawerFx(ctx, rect, fx.progress);
}

function playWorkRoomDrawerOpenFx(areaDescription, onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.workRoomDrawerOpen) {
    onDone?.();
    return;
  }

  const roomId = gameState.currentRoom;
  if (roomId !== "workRoom") {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.workRoomDrawerOpen = {
    roomId: "workRoom",
    areaDescription,
    progress: 0,
  };
  playSE?.("se-hikidashi");
  renderCanvasRoom();

  const dur = 320;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.workRoomDrawerOpen;
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
        delete gameState.fx.workRoomDrawerOpen;
        gameState.fx.lockInput = false;
      }
      renderCanvasRoom();
      onDone?.();
    }, 220);
  };
  requestAnimationFrame(tick);
}

function playWaterServerFillFx(onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.waterServerFill) {
    onDone?.();
    return;
  }

  if (gameState.currentRoom !== "drinkArea") {
    onDone?.();
    return;
  }
  if (!hasItem("cup") || hasItem("cupWithWater")) {
    updateMessage("紙コップを使えない。");
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.waterServerFill = {
    roomId: "drinkArea",
    progress: 0,
  };
  playOptionalSE?.("se-tea");
  renderCanvasRoom();

  const dur = 900;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.waterServerFill;
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

    removeItem("cup");
    addItem("cupWithWater");
    updateMessage("紙コップに水を注いだ。");

    setTimeout(() => {
      if (gameState.fx) {
        delete gameState.fx.waterServerFill;
        gameState.fx.lockInput = false;
      }
      renderCanvasRoom();
      onDone?.();
    }, 120);
  };

  requestAnimationFrame(tick);
}

function playCoffeeMachineFillFx(onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.coffeeMachineFill) {
    onDone?.();
    return;
  }
  if (gameState.currentRoom !== "coffeeMachine") {
    onDone?.();
    return;
  }

  const f = gameState.main.flags || (gameState.main.flags = {});
  fx.lockInput = true;
  fx.coffeeMachineFill = {
    roomId: "coffeeMachine",
    progress: 0,
  };
  f.makeCoffee = true;
  playOptionalSE?.("se-tea");
  renderCanvasRoom();

  const dur = 2250;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.coffeeMachineFill;
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

    updateMessage("コーヒーができあがった。");
    setTimeout(() => {
      if (gameState.fx) {
        delete gameState.fx.coffeeMachineFill;
        gameState.fx.lockInput = false;
      }
      renderCanvasRoom();
      onDone?.();
    }, 120);
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
  woodBase.addColorStop(0, "#b98e68");
  woodBase.addColorStop(0.45, "#D1A781");
  woodBase.addColorStop(1, "#a77d59");

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

function playLockerDoorOpenFx(areaDescription, onDone, options) {
  options = options || {};
  const fx = gameState.fx || (gameState.fx = {});
  if (fx.lockInput || fx.lockerDoorOpen) {
    onDone?.();
    return;
  }

  const roomId = options.roomId || gameState.currentRoom;
  if (gameState.currentRoom !== roomId) {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.lockerDoorOpen = {
    roomId,
    areaDescription,
    progress: 0,
    hingeSide: options.hingeSide || "right",
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
  return `2026/04/09 ${hh}:${mi}`;
}

function getViolationLogRows() {
  const baseRows = [
    { no: "1023", datetime: "2026/04/08 14:32", content: "通話行為", fine: "5,000円" },
    { no: "1024", datetime: "2026/04/08 15:05", content: "飲食行為", fine: "10,000円" },
    { no: "1025", datetime: "2026/04/08 18:47", content: "長時間離席", fine: "3,000円" },
  ];
  const extraRows = Array.isArray(gameState.main?.flags?.violationLogExtraRows) ? gameState.main.flags.violationLogExtraRows : [];
  return baseRows.concat(extraRows);
}

function renderViolationLogsBody() {
  const rowsHtml = getViolationLogRows()
    .map(
      (row) => `
        <tr>
          <td style="border:1px solid rgba(120,90,60,0.25);padding:6px 8px;">${row.no}</td>
          <td style="border:1px solid rgba(120,90,60,0.25);padding:6px 8px;">${row.datetime}</td>
          <td style="border:1px solid rgba(120,90,60,0.25);padding:6px 8px;">${row.content}</td>
          <td style="border:1px solid rgba(120,90,60,0.25);padding:6px 8px;text-align:right;">${row.fine}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="display:flex;flex-direction:column;gap:10px;text-align:left;color:#2d2216;">
      <div style="font-weight:700;">違反履歴ログ</div>
      <table style="width:100%;border-collapse:collapse;font-size:0.94em;">
        <thead>
          <tr>
            <th style="border:1px solid rgba(120,90,60,0.35);padding:6px 8px;background:rgba(120,90,60,0.08);text-align:left;">No.</th>
            <th style="border:1px solid rgba(120,90,60,0.35);padding:6px 8px;background:rgba(120,90,60,0.08);text-align:left;">日時</th>
            <th style="border:1px solid rgba(120,90,60,0.35);padding:6px 8px;background:rgba(120,90,60,0.08);text-align:left;">内容</th>
            <th style="border:1px solid rgba(120,90,60,0.35);padding:6px 8px;background:rgba(120,90,60,0.08);text-align:right;">罰金</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  `;
}

function addViolationLogEntryOnce(flagKey, entry) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f[flagKey]) return;
  f[flagKey] = true;
  if (!Array.isArray(f.violationLogExtraRows)) f.violationLogExtraRows = [];
  f.violationLogExtraRows.push(entry);
}

function maybeToastGyozaReady(itemId) {
  if (itemId !== "dish" && itemId !== "oil") return;
  const hasDishNow = itemId === "dish" || hasItem("dish");
  const hasOilNow = itemId === "oil" || hasItem("oil");
  if (hasDishNow && hasOilNow) {
    showToast("餃子が焼けそうだ");
  }
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
  maybeToastGyozaReady(itemId);
  renderCanvasRoom();

  const afterClose = () => {
    onAfterClose?.();
    maybeUniteColorParts(itemId);
  };

  showModal(title, `<img src="${imgSrc}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }], afterClose);
  updateMessage(msg);
}

function maybeUniteColorParts(itemId) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (itemId !== "partYellow" || f.unitedColorParts) return;
  if (!hasItem("partRed") || !hasItem("partGreen") || !hasItem("partBlue") || !hasItem("partYellow")) return;

  f.unitedColorParts = true;
  ["partRed", "partGreen", "partBlue", "partYellow"].forEach((id) => removeItem(id));
  addItem("tile");
  playSE?.("se-up");

  showModal(
    "パーツが揃った！",
    `
      <div class="modal-anim">
        <img src="${IMAGES.modals.tileUnite}">
        <img src="${IMAGES.items.tile}">
      </div>
    `,
    [{ text: "閉じる", action: "close" }],
  );
  updateMessage("タイルが完成した。");
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
      title: "🐊 TRUE END",
      label: "TRUE END",
      desc: "ビジネスは厳しいです",
    },

    end: {
      title: "👟 NORMAL END ",
      label: "NORMAL END ",
      desc: "無事謎を解いて脱出できました！",
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
      secretText = "🎥 おめでとうございます";
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdZQQrcy9cUOMD_RIt6DxghDmowGS8nNrsisrz3mTG9DyPEmQ/viewform";

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

function ensurePaperDocumentStyle() {
  if (document.getElementById("paperDocumentStyle")) return;
  const style = document.createElement("style");
  style.id = "paperDocumentStyle";
  style.textContent = `
    .paper-doc{
      width:min(100%, 720px);
      margin:0 auto;
      padding:24px 24px 20px;
      border-radius:10px;
      border:1px solid rgba(134, 105, 70, 0.42);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 14%),
        repeating-linear-gradient(180deg, rgba(136,102,62,0.045) 0, rgba(136,102,62,0.045) 1px, transparent 1px, transparent 30px),
        linear-gradient(180deg, #f6eedf 0%, #ebddc5 100%);
      box-shadow:0 12px 30px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.55);
      color:#3a2a19;
      text-align:left;
      font-family:"Yu Mincho", "Hiragino Mincho ProN", serif;
    }
    .paper-doc-heading{
      margin:0 0 6px;
      font-size:1.18rem;
      font-weight:700;
      letter-spacing:0.04em;
    }
    .paper-doc-subtitle{
      margin:0 0 16px;
      font-size:0.95rem;
      color:#5a4732;
    }
    .paper-doc-table{
      width:100%;
      border-collapse:collapse;
      margin:0 0 16px;
      background:rgba(255,255,255,0.28);
      font-size:0.92rem;
    }
    .paper-doc-table th,
    .paper-doc-table td{
      border:1px solid rgba(123, 94, 57, 0.5);
      padding:8px 10px;
      vertical-align:top;
    }
    .paper-doc-table th{
      background:rgba(155, 126, 86, 0.16);
      font-weight:700;
      text-align:center;
    }
    .paper-doc-notes-title{
      margin:0 0 6px;
      font-weight:700;
    }
    .paper-doc-section{
      margin:0 0 14px;
      line-height:1.9;
    }
    .paper-doc-label{
      font-weight:700;
    }
    .paper-doc-value{
      white-space:pre-wrap;
    }
    .paper-doc-notes{
      margin:0;
      padding-left:1.25em;
      line-height:1.8;
    }
    .paper-doc-notes li{
      margin:0;
    }
  `;
  document.head.appendChild(style);
}

function showPaperDocumentModal(title, doc) {
  ensurePaperDocumentStyle();
  const heading = doc.heading ? `<div class="paper-doc-heading">${escapeHtml(doc.heading)}</div>` : "";
  const subtitle = doc.subtitle ? `<div class="paper-doc-subtitle">${escapeHtml(doc.subtitle)}</div>` : "";
  const table =
    Array.isArray(doc.columns) && doc.columns.length > 0
      ? `
      <table class="paper-doc-table">
        <thead>
          <tr>${doc.columns.map((col) => `<th>${escapeHtml(col)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${(doc.rows || []).map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    `
      : "";
  const notesTitle = doc.notesTitle ? `<div class="paper-doc-notes-title">${escapeHtml(doc.notesTitle)}：</div>` : "";
  const notes = Array.isArray(doc.notes) && doc.notes.length > 0 ? `<ul class="paper-doc-notes">${doc.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>` : "";
  const sections =
    Array.isArray(doc.sections) && doc.sections.length > 0
      ? doc.sections
          .map((section) => {
            const label = section.label ? `<span class="paper-doc-label">${escapeHtml(section.label)}：</span>` : "";
            const value = section.value ? `<span class="paper-doc-value">${escapeHtml(section.value)}</span>` : "";
            return `<div class="paper-doc-section">${label}${value}</div>`;
          })
          .join("")
      : "";

  const content = `
    <div class="paper-doc">
      ${heading}
      ${subtitle}
      ${table}
      ${sections}
      ${notesTitle}
      ${notes}
    </div>
  `;

  showModal(title, content, [{ text: "閉じる", action: "close" }]);
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
    return timeMin < 7 ? { itemId: "gyozaUndercooked", title: "焼き目が薄い餃子" } : { itemId: "gyozaOvercooked", title: "やや焼き過ぎの餃子" };
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

function showPlantBadEnd() {
  const content = `
    <div style="text-align:center;">
      <div class="modal-anim">
        <img src="${IMAGES.modals.plantBad1}" alt="plant bad 1">
        <img src="${IMAGES.modals.plantBad2}" alt="plant bad 2">
      </div>
      <div>BAD END: 怒れる植物に襲われた</div>
    </div>
  `;
  pauseBGM();
  playSE("se-negative");
  showModal("BAD END", content, [{ text: "最初から", action: "restart" }]);
  updateMessage("BAD END: 怒れる植物に襲われた");
}



function showAdminRoomDrawerTopPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockAdminRoomDrawerTop) {
    playSE?.("se-hikidashi");
    acquireItemOnce("foundPartYellow", "partYellow", "黄色いパーツが入っていた", IMAGES.items.partYellow, "黄色いパーツを手に入れた");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="adminDrawerHeartGrid" style="display:grid; grid-template-columns:repeat(2, 74px); gap:12px; justify-content:center;"></div>
      <button id="adminDrawerHeartOk" class="ok-btn" type="button">OK</button>
      <div id="adminDrawerHeartHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("管理室引き出し上段のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const grid = document.getElementById("adminDrawerHeartGrid");
    const okBtn = document.getElementById("adminDrawerHeartOk");
    const hintEl = document.getElementById("adminDrawerHeartHint");
    if (!grid || !okBtn || !hintEl) return;

    const cycle = ["small", "medium", "large"];
    const target = ["medium", "large", "medium", "small"];
    const state = [0, 0, 0, 0];

    const sizeMap = {
      small: "22px",
      medium: "34px",
      large: "46px",
    };

    const cells = Array.from({ length: 4 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "74px";
      btn.style.height = "74px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "10px";
      btn.style.border = "2px solid #ececec";
      btn.style.background = "#ffffff";
      btn.style.boxShadow = "0 6px 14px rgba(0,0,0,0.08)";
      btn.setAttribute("aria-label", `ハート ${i + 1}`);

      const heart = document.createElement("span");
      heart.textContent = "❤";
      heart.style.display = "block";
      heart.style.lineHeight = "1";
      heart.style.color = "#f27cab";
      heart.style.transition = "font-size 120ms ease";
      btn.appendChild(heart);

      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % cycle.length;
        playSE?.("se-pi");
        repaint();
      });

      grid.appendChild(btn);
      return { btn, heart };
    });

    const repaint = () => {
      cells.forEach(({ heart }, i) => {
        const sizeKey = cycle[state[i]];
        heart.style.fontSize = sizeMap[sizeKey];
      });
      hintEl.textContent = "";
    };

    okBtn.addEventListener("click", () => {
      const current = state.map((idx) => cycle[idx]);
      const ok = target.every((size, idx) => current[idx] === size);
      if (ok) {
        f.unlockAdminRoomDrawerTop = true;
        playSE?.("se-clear");
        window._nextModal = {
          title: "解除",
          content: "引き出し上段のロックを解除した",
          buttons: [
            {
              text: "閉じる",
              action: () => {
                window._nextModal = () => {
                  playSE?.("se-hikidashi");
                  acquireItemOnce("foundPartYellow", "partYellow", "黄色いパーツが入っていた", IMAGES.modals.drawerPartYellow, "黄色いパーツを手に入れた");
                };
                closeModal();
              },
            },
          ],
        };
        closeModal();
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showAdminRoomDrawerBottomPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockAdminRoomDrawerBottom) {
    playSE?.("se-hikidashi");
    acquireItemOnce("foundCoin", "coin", "引き出しの中にコインがある", IMAGES.modals.drawerCoin, "クマコインを手に入れた");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="adminDrawerBottomRow" style="display:flex; align-items:center; justify-content:center; gap:12px;">
        <div id="adminDrawerBottomLeft" style="display:flex; gap:12px;"></div>
        <div aria-hidden="true" style="font-size:34px; line-height:1;">🐊</div>
        <div id="adminDrawerBottomRight" style="display:flex; gap:12px;"></div>
      </div>
      <button id="adminDrawerBottomOk" class="ok-btn" type="button">OK</button>
      <div id="adminDrawerBottomHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("管理室引き出し下段のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const leftRow = document.getElementById("adminDrawerBottomLeft");
    const rightRow = document.getElementById("adminDrawerBottomRight");
    const okBtn = document.getElementById("adminDrawerBottomOk");
    const hintEl = document.getElementById("adminDrawerBottomHint");
    if (!leftRow || !rightRow || !okBtn || !hintEl) return;

    const cycle = ["milk", "cheese", "carrot", "nut"];
    const target = ["carrot", "nut", "milk", "cheese"];
    const state = [-1, -1, -1, -1];

    const cells = Array.from({ length: 4 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "72px";
      btn.style.height = "72px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "10px";
      btn.style.border = "2px solid #ececec";
      btn.style.background = "#ffffff";
      btn.style.boxShadow = "0 6px 14px rgba(0,0,0,0.08)";
      btn.setAttribute("aria-label", `食材 ${i + 1}`);

      const img = document.createElement("img");
      img.style.width = "46px";
      img.style.height = "46px";
      img.style.objectFit = "contain";
      img.style.display = "none";
      btn.appendChild(img);

      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % cycle.length;
        playSE?.("se-pi");
        repaint();
      });

      if (i < 2) {
        leftRow.appendChild(btn);
      } else {
        rightRow.appendChild(btn);
      }
      return { img };
    });

    const repaint = () => {
      cells.forEach(({ img }, i) => {
        const idx = state[i];
        if (idx < 0) {
          img.style.display = "none";
          img.removeAttribute("src");
          return;
        }
        img.src = IMAGES.modals[cycle[idx]];
        img.style.display = "block";
      });
      hintEl.textContent = "";
    };

    okBtn.addEventListener("click", () => {
      const current = state.map((idx) => (idx < 0 ? "" : cycle[idx]));
      const ok = target.every((name, idx) => current[idx] === name);
      if (ok) {
        f.unlockAdminRoomDrawerBottom = true;
        playSE?.("se-clear");
        window._nextModal = {
          title: "解除",
          content: "引き出し下段のロックを解除した",
          buttons: [
            {
              text: "閉じる",
              action: () => {
                window._nextModal = () => {
                  playSE?.("se-hikidashi");
                  acquireItemOnce("foundCoin", "coin", "引き出しの中にコインがある", IMAGES.modals.drawerCoin, "クマコインを手に入れた");
                };
                closeModal();
              },
            },
          ],
        };
        closeModal();
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showWorkRoomDrawerMiddlePuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockWorkRoomDrawerMiddle) {
    playWorkRoomDrawerOpenFx("引き出し中段", () => {
      acquireItemOnce("foundScissors", "scissors", "はさみがある", IMAGES.items.scissors, "はさみを手に入れた");
    });
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="workRoomDrawerMiddleRow" style="display:flex; gap:12px; justify-content:center; align-items:center;"></div>
      <button id="workRoomDrawerMiddleOk" class="ok-btn" type="button">OK</button>
      <div id="workRoomDrawerMiddleHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("引き出し中段のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("workRoomDrawerMiddleRow");
    const okBtn = document.getElementById("workRoomDrawerMiddleOk");
    const hintEl = document.getElementById("workRoomDrawerMiddleHint");
    if (!row || !okBtn || !hintEl) return;

    const target = ["L", "L", "L", "M", "M", "M", "M", "M", "R"];
    const input = [];
    const defs = [
      { key: "M", color: "#8D5C33", label: "中" },
      { key: "R", color: "#DFC592", label: "右" },
      { key: "L", color: "#261408", label: "左" },
    ];

    defs.forEach((def) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `${def.label}ボタン`);
      btn.style.width = "72px";
      btn.style.height = "72px";
      btn.style.padding = "0";
      btn.style.borderRadius = "10px";
      btn.style.border = "2px solid rgba(255,255,255,0.18)";
      btn.style.background = def.color;
      btn.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 14px rgba(0,0,0,0.28)";
      btn.style.cursor = "pointer";
      btn.addEventListener("click", () => {
        input.push(def.key);
        playSE?.("se-pi");
        btn.animate(
          [
            { transform: "scale(1)", filter: "brightness(1)" },
            { transform: "scale(0.96)", filter: "brightness(1.28)" },
            { transform: "scale(1)", filter: "brightness(1)" },
          ],
          { duration: 150, easing: "ease-out" },
        );
        hintEl.textContent = "";
      });
      row.appendChild(btn);
    });

    okBtn.addEventListener("click", () => {
      const ok = input.length === target.length && target.every((v, i) => input[i] === v);
      const coffeeOk = !!gameState.main?.flags?.makeCoffee;
      if (ok && coffeeOk) {
        f.unlockWorkRoomDrawerMiddle = true;
        playSE?.("se-clear");
        closeModal();
        updateMessage("引き出し中段のロックが外れた。");
        return;
      }

      playSE?.("se-error");
      input.length = 0;
      hintEl.textContent = "開かないようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showLockerIPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockLockerI) {
    openLockerI();
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; justify-content:center; align-items:center; gap:16px;">
      <div id="lockerIRow" style="display:flex; flex-direction:column; gap:10px; align-items:center;"></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
        <button id="lockerIOk" class="ok-btn" type="button">OK</button>
        <div id="lockerIHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
      </div>
    </div>
  `;

  showModal("ロッカーIのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("lockerIRow");
    const okBtn = document.getElementById("lockerIOk");
    const hintEl = document.getElementById("lockerIHint");
    if (!row || !okBtn || !hintEl) return;

    const cycle = ["phone", "dish", "chair"];
    const target = ["phone", "dish", "chair", "chair"];
    const state = [0, 0, 0, 0];

    const cells = Array.from({ length: 4 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "74px";
      btn.style.height = "74px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "8px";
      btn.style.border = "2px solid #d8d8d8";
      btn.style.background = "#fff";
      btn.setAttribute("aria-label", `記号 ${i + 1}`);

      const img = document.createElement("img");
      img.alt = "";
      img.style.width = "56px";
      img.style.height = "56px";
      img.style.objectFit = "contain";
      img.style.pointerEvents = "none";
      btn.appendChild(img);

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
        const img = btn.querySelector("img");
        if (img) img.src = IMAGES.modals[cycle[state[i]]];
      });
      hintEl.textContent = "";
    }

    okBtn.addEventListener("click", () => {
      const current = state.map((idx) => cycle[idx]);
      const symbolsOk = target.every((v, i) => current[i] === v);
      const logOk = !!gameState.main?.flags?.violationLogExtraRows;
      if (symbolsOk && logOk) {
        f.unlockLockerI = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("ロッカーIのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showLockerAPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockLockerA) {
    openLockerA();
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; justify-content:center; align-items:center; gap:16px;">
      <div id="lockerARow" style="display:flex; flex-direction:column; gap:10px; align-items:center;"></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
        <button id="lockerAOk" class="ok-btn" type="button">OK</button>
        <div id="lockerAHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
      </div>
    </div>
  `;

  showModal("ロッカーAのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("lockerARow");
    const okBtn = document.getElementById("lockerAOk");
    const hintEl = document.getElementById("lockerAHint");
    if (!row || !okBtn || !hintEl) return;

    const cycle = [
      { color: "#f08a2b", label: "オレンジ", textColor: "#1f1307" },
      { color: "#2d7be8", label: "青", textColor: "#ffffff" },
      { color: "#f48ac2", label: "ピンク", textColor: "#3b1227" },
      { color: "#f1cf38", label: "黄色", textColor: "#2b2300" },
      { color: "#48a65a", label: "緑", textColor: "#ffffff" },
    ];
    const target = ["黄色", "青", "黄色"];
    const state = [0, 0, 0];

    const cells = Array.from({ length: 3 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "74px";
      btn.style.height = "74px";
      btn.style.padding = "0";
      btn.style.borderRadius = "8px";
      btn.style.border = "2px solid rgba(255,255,255,0.65)";
      btn.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.35)";
      btn.style.fontSize = "15px";
      btn.style.fontWeight = "700";
      btn.style.lineHeight = "1.2";
      btn.setAttribute("aria-label", `色 ${i + 1}`);
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
        const current = cycle[state[i]];
        btn.style.background = current.color;
        btn.style.color = current.textColor;
        btn.textContent = current.label;
      });
      hintEl.textContent = "";
    }

    okBtn.addEventListener("click", () => {
      const current = state.map((idx) => cycle[idx].label);
      const ok = target.every((v, i) => current[i] === v);
      if (ok) {
        f.unlockLockerA = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("ロッカーAのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showLockerCPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockLockerC) {
    openLockerC();
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="lockerCDigits" style="display:flex; gap:14px; justify-content:center;">
        <button id="lockerCDigit0" type="button" class="nav-btn" aria-label="1桁目" style="width:72px; height:72px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; font-size:34px; font-weight:bold;">0</button>
        <button id="lockerCDigit1" type="button" class="nav-btn" aria-label="2桁目" style="width:72px; height:72px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; font-size:34px; font-weight:bold;">0</button>
      </div>
      <button id="lockerCOk" class="ok-btn" type="button">OK</button>
      <div id="lockerCHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("ロッカーCのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const digitBtns = [0, 1].map((i) => document.getElementById(`lockerCDigit${i}`));
    const okBtn = document.getElementById("lockerCOk");
    const hintEl = document.getElementById("lockerCHint");
    if (digitBtns.some((btn) => !btn) || !okBtn || !hintEl) return;

    const state = [0, 0];
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

    const submit = () => {
      if (`${state[0]}${state[1]}` === "27") {
        f.unlockLockerC = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("ロッカーCのロックが外れた。");
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    };

    repaint();
    okBtn.addEventListener("click", submit);
  }, 0);
}

function showReceptionKeyboxPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockReceptionKeybox) {
    updateMessage("キーボックスのロックは外れている。");
    return;
  }

  const hasAllParts = hasItem("partRed") && hasItem("partBlue") && hasItem("partGreen");
  if (!hasAllParts) {
    updateMessage("キーボックスのようだ。ロックがかかっている");
    return;
  }

  const content = `
    <div style="margin-top:12px; display:flex; flex-direction:column; align-items:center; gap:16px;">
      <div style="font-size:0.95em; color:#61523f; text-align:center;">回転式ロックが起動した</div>
      <div style="display:flex; gap:14px; justify-content:center; align-items:center; padding:18px 20px; border-radius:20px; background:linear-gradient(180deg,#444 0%,#272727 100%); box-shadow:inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -4px 12px rgba(0,0,0,0.45), 0 10px 24px rgba(0,0,0,0.18);">
        <button id="receptionKeyboxDial0" class="reception-keybox-dial" type="button" aria-label="左の数字を変更" style="width:72px; height:72px; border:none; border-radius:16px; background:radial-gradient(circle at 35% 30%, #fbfbfb 0%, #dadada 42%, #8b8b8b 68%, #3b3b3b 100%); box-shadow:inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -8px 10px rgba(0,0,0,0.35), 0 5px 12px rgba(0,0,0,0.32); color:#171717; font-size:2rem; font-weight:700; cursor:pointer;">0</button>
        <button id="receptionKeyboxDial1" class="reception-keybox-dial" type="button" aria-label="中央の数字を変更" style="width:72px; height:72px; border:none; border-radius:16px; background:radial-gradient(circle at 35% 30%, #fbfbfb 0%, #dadada 42%, #8b8b8b 68%, #3b3b3b 100%); box-shadow:inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -8px 10px rgba(0,0,0,0.35), 0 5px 12px rgba(0,0,0,0.32); color:#171717; font-size:2rem; font-weight:700; cursor:pointer;">0</button>
        <button id="receptionKeyboxDial2" class="reception-keybox-dial" type="button" aria-label="右の数字を変更" style="width:72px; height:72px; border:none; border-radius:16px; background:radial-gradient(circle at 35% 30%, #fbfbfb 0%, #dadada 42%, #8b8b8b 68%, #3b3b3b 100%); box-shadow:inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -8px 10px rgba(0,0,0,0.35), 0 5px 12px rgba(0,0,0,0.32); color:#171717; font-size:2rem; font-weight:700; cursor:pointer;">0</button>
      </div>
      <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
        <button id="receptionKeyboxReset" class="nav-btn" type="button">リセット</button>
        <button id="receptionKeyboxOk" class="ok-btn" type="button">OK</button>
      </div>
      <div id="receptionKeyboxHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キーボックスのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const digits = [0, 0, 0];
    const dialButtons = [0, 1, 2].map((idx) => document.getElementById(`receptionKeyboxDial${idx}`));
    const resetBtn = document.getElementById("receptionKeyboxReset");
    const okBtn = document.getElementById("receptionKeyboxOk");
    const hintEl = document.getElementById("receptionKeyboxHint");
    if (!resetBtn || !okBtn || !hintEl || dialButtons.some((btn) => !btn)) return;

    const repaint = () => {
      dialButtons.forEach((btn, idx) => {
        btn.textContent = String(digits[idx]);
      });
      hintEl.textContent = "";
    };

    dialButtons.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        digits[idx] = (digits[idx] + 1) % 10;
        btn.textContent = String(digits[idx]);
        playSE?.("se-pi");
        hintEl.textContent = "";
      });
    });

    resetBtn.addEventListener("click", () => {
      digits[0] = 0;
      digits[1] = 0;
      digits[2] = 0;
      playSE?.("se-click");
      repaint();
    });

    okBtn.addEventListener("click", () => {
      if (digits.join("") === "235") {
        f.unlockReceptionKeybox = true;
        playSE?.("se-clear");
        window._nextModal = () => {
          acquireItemOnce("foundKeyAdmin", "keyAdmin", "鍵が入っていた", IMAGES.items.keyAdmin, "管理室の鍵を手に入れた");
        };
        closeModal();
        renderCanvasRoom?.();
        updateMessage("キーボックスのロックが外れ、管理室の鍵を手に入れた");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showLockerDPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockLockerD) {
    openLockerD();
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="lockerDRow" style="display:flex; gap:6px; justify-content:center; align-items:center; flex-wrap:nowrap; width:100%; max-width:320px;"></div>
      <button id="lockerDOk" class="ok-btn" type="button">OK</button>
      <div id="lockerDHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("ロッカーDのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const row = document.getElementById("lockerDRow");
    const okBtn = document.getElementById("lockerDOk");
    const hintEl = document.getElementById("lockerDHint");
    if (!row || !okBtn || !hintEl) return;

    const cycle = ["a", "c", "d", "e", "g", "h", "i", "l", "m", "n", "o", "p", "r", "s", "t", "u"];
    const target = ["p", "l", "a", "n", "t"];
    const state = [0, 0, 0, 0, 0];

    const cells = Array.from({ length: 5 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "calc((100% - 24px) / 5)";
      btn.style.maxWidth = "56px";
      btn.style.minWidth = "44px";
      btn.style.height = "62px";
      btn.style.padding = "0";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "8px";
      btn.style.border = "2px solid #d8d8d8";
      btn.style.background = "#fff";
      btn.style.color = "#151515";
      btn.style.fontSize = "30px";
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
        f.unlockLockerD = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("ロッカーDのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function openWorkRoomDrawerTop() {
  playWorkRoomDrawerOpenFx("引き出し上段", () => {
    showModal("パンフレットが入っている", `<img src="${IMAGES.modals.pamphlet}" style="max-width:380px;max-height:80vh;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`, [{ text: "閉じる", action: "close" }]);
    updateMessage("パンフレットが入っている");
  });
}

function openWorkRoomDrawerBottom() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  playWorkRoomDrawerOpenFx("引き出し下段", () => {
    if (!f.bearAppearedFromDrawer) {
      f.bearAppearedFromDrawer = true;
      showModal("クマ妖精が入っていた", `<img src="${IMAGES.modals.bearAppear}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [{ text: "閉じる", action: "close" }]);
      updateMessage("クマ妖精が入っていた");
      playSE("se-piko");
      return;
    }
    updateMessage("引き出し下段が開いた。");
  });
}

function openLockerD() {
  playLockerDoorOpenFx(
    "ロッカーD",
    () => {
      acquireItemOnce("foundBook", "book", "本がある", IMAGES.items.book, "本を手に入れた");
    },
    { roomId: "locker", hingeSide: "right" },
  );
}

function waterLockerPlant() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.wateredLockerPlant) {
    updateMessage("植物は少し元気を取り戻したようだ");
    return;
  }
  if (!hasItem("cupWithWater")) {
    updateMessage("元気がない植物だ。少ししおれている");
    return;
  }

  f.wateredLockerPlant = true;
  removeItem("cupWithWater");
  gameState.inventory.push("cup");
  updateInventoryDisplay();
  playOptionalSE?.("se-tea");
  showModal(
    "廊下の植物に水をあげた",
    `
      <div class="modal-anim">
        <img src="${IMAGES.modals.waterToPlant}">
        <img src="${IMAGES.modals.plantHappy}">
      </div>
    `,
    [{ text: "閉じる", action: "close" }],
  );
  updateMessage("元気がない植物に水をあげた。少し元気になったようだ");
}

function fertilizeLockerPlant() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.wateredLockerPlant) {
    updateMessage("水分が足りないようだ。まずお水が必要だ");
    return;
  }
  if (f.fertilizedLockerPlant) {
    showLockerPlantSquare();
    return;
  }

  f.fertilizedLockerPlant = true;
  removeItem("fertilizer");
  showModal(
    "廊下の植物に肥料をあげた",
    `
      <div class="modal-anim">
        <img src="${IMAGES.modals.fertilizerToPlant}">
        <img src="${IMAGES.modals.plantVeryHappy}">
      </div>
    `,
    [{ text: "閉じる", action: "close" }],
  );
  updateMessage("植物はとても喜んでいる。葉に模様が浮かび上がった");
}

function showLockerPlantSquare() {
  showObj(null, "", IMAGES.modals.plantSquare, "植物は生命力にあふれている");
}

function openLockerA() {
  playLockerDoorOpenFx(
    "ロッカーA",
    () => {
      acquireItemOnce("foundPartRed", "partRed", "赤いパーツがある", IMAGES.items.partRed, "赤いパーツを手に入れた");
    },
    { roomId: "locker", hingeSide: "right" },
  );
}

function openLockerB() {
  playLockerDoorOpenFx(
    "ロッカーB",
    () => {
      acquireItemOnce("foundJacket", "jacket", "ジャケットがある", IMAGES.items.jacket, "ジャケットを手に入れた");
    },
    { roomId: "locker", hingeSide: "right" },
  );
}

function openLockerC() {
  playLockerDoorOpenFx(
    "ロッカーC",
    () => {
      acquireItemOnce("foundEraser", "eraser", "ホワイトボード用消し具がある", IMAGES.items.eraser, "ホワイトボード用消し具を手に入れた");
    },
    { roomId: "locker", hingeSide: "right" },
  );
}

function openLockerI() {
  playLockerDoorOpenFx(
    "ロッカーI",
    () => {
      acquireItemOnce("foundFertilizer", "fertilizer", "肥料がある", IMAGES.items.fertilizer, "肥料を手に入れた");
    },
    { roomId: "locker", hingeSide: "right" },
  );
}

function openEmptyLocker(letter) {
  playLockerDoorOpenFx(
    `ロッカー${letter}`,
    () => {
      updateMessage("何も入っていない");
    },
    { roomId: "locker", hingeSide: "right" },
  );
}

function showPcReceptionLoginPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.loginPc) return;

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="font-size:0.96em; color:#555; text-align:center;">受付PCのログイン画面が表示されている</div>
      <input id="pcReceptionLoginInput" class="puzzle-input" type="text" maxlength="5" placeholder="PASSWORD" autocapitalize="off" autocomplete="off" spellcheck="false" style="width:220px; text-align:center; font-size:1.15em; letter-spacing:0.08em;">
      <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
        <button id="pcReceptionLoginButton" class="ok-btn" type="button">ログイン</button>
      </div>
      <div id="pcReceptionLoginHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("PCログイン", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const input = document.getElementById("pcReceptionLoginInput");
    const loginBtn = document.getElementById("pcReceptionLoginButton");
    const hintEl = document.getElementById("pcReceptionLoginHint");
    if (!input || !loginBtn || !hintEl) return;

    const submit = () => {
      const value = (input.value || "").trim().toUpperCase();
      if (value === "R-040") {
        f.loginPc = true;
        playSE?.("se-clear");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("受付PCにログインできた。");
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "PINが違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    };

    input.focus();
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
    });
    loginBtn.addEventListener("click", submit);
  }, 0);
}

function showAdminPcLoginPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.adminPcLoggedIn) {
    changeRoom("pcAdmin");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <img src="${IMAGES.modals.adminLogin}" style="width:400px; max-width:100%; display:block; margin:0 auto 4px;">
      <input id="adminPcLoginInput" class="puzzle-input" type="text" maxlength="12" placeholder="PASSWORD" autocapitalize="off" autocomplete="off" spellcheck="false" style="width:220px; text-align:center; font-size:1.15em; letter-spacing:0.08em;">
      <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
        <button id="adminPcLoginButton" class="ok-btn" type="button">ログイン</button>
      </div>
      <div id="adminPcLoginHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("PCログイン", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const input = document.getElementById("adminPcLoginInput");
    const loginBtn = document.getElementById("adminPcLoginButton");
    const hintEl = document.getElementById("adminPcLoginHint");
    if (!input || !loginBtn || !hintEl) return;

    const submit = () => {
      const value = (input.value || "").trim().toLowerCase();
      if (value === "gate") {
        f.adminPcLoggedIn = true;
        playSE?.("se-clear");
        closeModal();
        showModal("管理PC", "管理PCにログインできた", [{ text: "閉じる", action: "close" }]);
        return;
      }
      playSE?.("se-error");
      hintEl.textContent = "パスワードが違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    };

    input.focus();
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
    });
    loginBtn.addEventListener("click", submit);
  }, 0);
}

function showAdminPcWarmMail() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const firstRead = !f.readWarmMail;
  f.readWarmMail = true;

  if (firstRead) {
    const onClosed = () => {
      window.removeEventListener("modal:closed", onClosed);
      showToast("心温まるメールを読んだ");
      playSE("se-hp-charge");
    };
    window.addEventListener("modal:closed", onClosed);
  }

  const content = `
    <div style="max-width:520px; margin:0 auto; padding:18px 18px 20px; border-radius:14px; background:linear-gradient(180deg, #f7fafc, #edf3f8); color:#1f2937; box-shadow:inset 0 0 0 1px rgba(120,140,160,0.18); text-align:left;">
      <div style="display:flex; flex-direction:column; gap:10px; font-size:0.98rem; line-height:1.7;">
        <div><strong>from:</strong> ki-mi2010@suramail.com</div>
        <div><strong>to:</strong> info@cro-co.com</div>
        <div><strong>title:</strong>Re:承認のお知らせ</div>
        <div style="margin-top:6px; padding-top:12px; border-top:1px solid rgba(120,140,160,0.25);">
          ありがとうございます！夜遅くまで安全に勉強できてとても助かります。<br>減免者には無料のドリンクもすごく元気が出ます。将来は、OFFICE CRO-COで働きたいです。
        </div>
      </div>
    </div>
  `;

  showModal("メール", content, [{ text: "閉じる", action: "close" }]);
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
    scissors: "はさみ",
    driver: "ドライバー",
    cup: "紙コップ",
    cupWithWater: "水入りの紙コップ",
    reservationLog: "予約記録",
    keyB: "Bの鍵",
    keyDesk: "机の鍵",
    keyAdmin: "管理室の鍵",
    jacket: "ジャケット",
    nameCard: "名刺",
    fertilizer: "肥料",
    book: "本",
    eraser: "ホワイトボード用消し具",
    elixir: "ドリンク",
    partBlue: "青いパーツ",
    partRed: "赤いパーツ",
    partYellow: "黄色いパーツ",
    partGreen: "緑のパーツ",
    tile: "タイル",
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

        if (itemId === "book") {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.foundPartGreen) {
            buttons = [
              {
                text: "調べる",
                action: () => {
                  window._nextModal = () => {
                    acquireItemOnce("foundPartGreen", "partGreen", "何か挟まっていた", IMAGES.modals.partInBook, "緑のパーツを手に入れた");
                  };
                  closeModal();
                },
              },
              { text: "閉じる", action: "close" },
            ];
          }
        }

        if (itemId === "jacket") {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (!f.foundNameCard) {
            buttons = [
              {
                text: "調べる",
                action: () => {
                  window._nextModal = () => {
                    acquireItemOnce("foundNameCard", "nameCard", "名刺がある", IMAGES.modals.jacketCard, "名刺を手に入れた");
                  };
                  closeModal();
                },
              },
              { text: "閉じる", action: "close" },
            ];
          }
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

window.addEventListener("keydown", (e) => {
  if (e.key === "F2") {
    DEV_MODE = !DEV_MODE;
    renderCanvasRoom();
  }
});

// ゲーム開始
preloadImages();
initGame();
