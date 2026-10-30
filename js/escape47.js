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
  reset() {
    this.start = Date.now();
    this.hintCount = 0;
    this.sid = Math.random().toString(36).slice(2);
    this.sent.clear();
  },
  baseParams() {
    return {
      elapsed_sec: Math.round((Date.now() - this.start) / 1000),
      hints: this.hintCount || 0,
      save_version: typeof SAVE_VERSION === "number" ? SAVE_VERSION : null,
      room: gameState.currentRoom || null,
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
    closeModal();
  });

  // オーバーレイクリックでも閉じる
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
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
const USE_LOCAL_ASSETS = location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(location.hostname) || location.search.includes("localimg=1");
const BASE_47 = USE_LOCAL_ASSETS ? "images/47" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/47";
const BASE_SOUND_47 = USE_LOCAL_ASSETS ? "sounds/47" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/47";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I47 = (file) => `${BASE_47}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S47 = (file) => `${BASE_SOUND_47}/${file}`;
const DEFAULT_BGM = S47("gogoyojino_sanpoizumu.mp3");

// 47の背景・共通UI画像。アイテム／モーダル画像はここに追加する。
const IMAGES = {
  rooms: {
    seatWindow: [I47("seat_window.webp"), I47("seat_window_2.webp")],
    adminDoorFront: [I47("admin_door_front.webp")],
    adminDoorAbove: [I47("admin_door_above.webp")],
    entrance: [I47("entrance.webp")],
    adminRoom: [I47("admin_room.webp")],
    adminRoomCabinet: [I47("admin_room_cabinet.webp")],
    end: [I47("end.webp"), I47("end2.webp")],
    trueEnd: [I47("true_end.webp")],
  },
  items: {
    remocon: I47("remocon.webp"),
    remoconActive: I47("remocon_active.webp"),
    bearHappy: I47("bear_happy.webp"),
    bear: ICM("bear.png"), back: ICM("common/back.png"),
    arrowRight: ICM("common/arrow_right.png"), arrowLeft: ICM("common/arrow_left.png"),
    arrowAbove: ICM("common/arrow_above.png"),
    blackBack: ICM("common/black_back.png"),
    redBack: ICM("common/red_back.png"),
    greenBack: ICM("common/green_back.png"),
    lang_en: ICM("common/en2.png"), lang_jp: ICM("common/jp.png"),
    driver: ICM("common/driver.webp"),
    key: ICM("common/key.webp"), battery: ICM("common/battery.webp"),
    bigMisoLeaf: I47("modal_big_miso_leaf.webp"),
    memoInBag: I47("memo_in_bag.webp"),
    iconBalloon: I47("icon_balloon.webp"),
    lever: I47("lever.webp"),
    fanCover: I47("fan_cover.webp"),
    leaf: I47("leaf.webp"),
    malonet: I47("malonet.webp"),
    operaGlasses: I47("opera_glasses.webp"),
    grapeSoda: I47("grape_soda.webp"),
    sodaCold: I47("grape_soda_cold.webp"),
    sodaOpen: I47("grape_soda_cold_open.webp"),
    blackStar: I47("black_star.webp"),
    doorShine: I47("door_shine.webp"),
  },
  modals: {
    remoconFind: I47("modal_remocon_find.webp"),
    bearThinkVinea: I47("modal_bear_think_vinea.webp"),
    bearLeaf: I47("modal_bear_leaf.webp"),
    bearDrinksSoda: I47("modal_bear_drinks_soda.webp"),
    openSoda: I47("modal_open_soda.webp"),
    bearRefuseSoda: I47("modal_bear_refuse_soda.webp"),
    bearWantsSoda: I47("modal_bear_wants_soda.webp"),
    sodaCooling1: I47("modal_soda_cooling_1.webp"),
    sodaCooling2: I47("modal_soda_cooling_2.webp"),
    starStationZoom: I47("modal_star_station_zoom.webp"),
    starStationZoom2: I47("modal_star_station_zoom2.webp"),
    snowmanZoom: I47("modal_snowman_zoom.webp"),
    eatMalonet: I47("modal_eat_malonet.webp"),
    eatMalonetEn: I47("modal_eat_malonet_en.webp"),
    drawerDeskTop: I47("modal_drawer_desk_top.webp"),
    drawerDeskSecond: I47("modal_drawer_desk_second.webp"),
    drawerDeskThird: I47("modal_drawer_desk_third.webp"),
    mistFromFan: I47("modal_mist_from_fan.webp"),
    coldAirFromFan: I47("modal_cold_air_from_fan.webp"),
    bigMiso: I47("modal_big_miso.webp"),
    bigMisoLeaf: I47("modal_big_miso_leaf.webp"),
    posterMalonet: I47("modal_poster_malonet.webp"),
    trashMalonet: I47("modal_trash_malonet.webp"),
    drawerLeftAbove: I47("modal_drawer_left_above.webp"),
    bearClick: I47("modal_bear_click.webp"),
    useDriver1: I47("modal_use_driver_1.webp"),
    useDriver2: I47("modal_use_driver_2.webp"),
    guideMalonet: I47("modal_guide_malonet.webp"),
    guideMalonetEn: I47("modal_guide_malonet_en.webp"),
    guideGrape: I47("modal_guide_grape.webp"),
    guideGrapeEn: I47("modal_guide_grape_en.webp"),
    map: I47("modal_map.webp"),
    underTable: I47("modal_under_table.webp"),
    bearLookStar: I47("modal_bear_look_star.webp"),
    bearWishGrape: I47("modal_bear_wish_grape.webp"),
  },
};

// 景色を増やすときは、ここに画像と状態を追加する。
const WINDOW_SCENES = {
  autumn: { states: { normal: I47("modal_autumn_scene.webp"), afterMalonet: I47("modal_autumn_scene2.webp") } },
  snow: {
    states: {
      normal: I47("modal_snow_scene.webp"),
      changed: I47("modal_snow_scene2.webp"),
      afterMalonet: I47("modal_snow_scene_bear_exist_after_malonet.webp"),
      afterMalonetWithoutBear: I47("modal_snow_scene3.webp"),
    },
  },
  sky: { states: { normal: I47("modal_sky_scene.webp"), afterMalonet: I47("modal_sky_scene2.webp") } },
  stars: { states: { normal: I47("modal_star_scene.webp"), afterMalonet: I47("modal_star_scene2.webp") } },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState47";
const SAVE_VERSION = 2;
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

// 46と同じクリックエリア形式。各部屋のオブジェクトや謎解きを追加する。
let rooms = {
  seatWindow: {
    name: "座席",
    description: "",
    clickableAreas: [
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("adminDoorFront")),
        description: "管理室のドア前へ",
        zIndex: 10,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 33.4, y: 64.6, width: 11.3, height: 25.9,
        onClick: clickWrap(function () {
          unfoldSeatTable();
        }),
        description: 'たたまれたテーブル',
        zIndex: 5,
        usable: () => gameState.seatWindow.flags.backgroundState === 0,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 33.6, y: 64.9, width: 9.1, height: 10.3,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "sodaCold" && hasItem("sodaCold")) {
            removeItem("sodaCold");
            addItem("sodaOpen");
            markProgress("open_grape_soda");
            playSE("se-tansan");
            showObj(null, "グレープソーダの栓を開けた", IMAGES.modals.openSoda, "グレープソーダの栓を開けた");
            renderCanvasRoom();
            return;
          }
          showObj(null, '拡げられたテーブルの下', IMAGES.modals.underTable, '拡げられたテーブルの下。せんぬきが付いている。');
        }),
        description: '拡げられたテーブル下',
        zIndex: 5,
        usable: () => gameState.seatWindow.flags.backgroundState === 1,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 45.5, y: 92.9, width: 6.4, height: 5.7,
        onClick: clickWrap(function () {
          showObj('trash_malonet', 'お菓子のゴミが落ちている', IMAGES.modals.trashMalonet, 'お菓子のゴミが落ちている。');
        }),
        description: '落ちているお菓子のゴミ',
        zIndex: 5,
        usable: () => gameState.seatWindow.flags.backgroundState === 1,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 2.6, y: 67.6, width: 21.4, height: 13.8,
        onClick: clickWrap(function () {
          if (gameState.main.flags.getMemoInBag) {
            updateMessage("鞄の中にはもう何もない。");
            return;
          }
          if (gameState.selectedItem === "key" && hasItem("key")) {
            removeItem("key");
            acquireItemOnce("getMemoInBag", "memoInBag", "鞄の中からメモを見つけた", IMAGES.items.memoInBag, "鞄の中からメモを見つけた。");
            return;
          }
          updateMessage("カバンにはカギがかかっている。");
        }),
        description: '座席に置かれたカバン',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 72.4, y: 59.6, width: 25.6, height: 25.3,
        onClick: clickWrap(function () {
          if (getMainFlags().bearDrankSoda) {
            showObj(null, "VINEA駅に行けば、もっとおいしいブドウが食べられるかなあ", IMAGES.modals.bearThinkVinea, "「VINEA駅に行けば、もっとおいしいブドウが食べられるかなあ」");
            return;
          }
          if (gameState.selectedItem === "leaf" && hasItem("leaf")) {
            showObj(null, "静電気で葉っぱがくっついちゃった！", IMAGES.modals.bearLeaf, "「静電気で葉っぱがくっついちゃった！」あなたは葉っぱを剥がしてあげた。");
            return;
          }
          if (gameState.selectedItem === "sodaOpen" && hasItem("sodaOpen")) {
            removeItem("sodaOpen");
            getMainFlags().bearDrankSoda = true;
            markProgress("give_soda_to_bear");
            showObj(null, "ゴクゴク…", IMAGES.modals.bearDrinksSoda, "「ゴクゴク…」クマ妖精はグレープソーダを飲んだ。");
            renderCanvasRoom();
            return;
          }
          if (gameState.selectedItem === "grapeSoda" && hasItem("grapeSoda")) {
            showObj(null, "ソーダは冷えてないとねえ…", IMAGES.modals.bearRefuseSoda, "ソーダは冷えてないとねえ…");
            return;
          }
          if (gameState.selectedItem === "sodaCold" && hasItem("sodaCold")) {
            showObj(null, "わあ！ふたを開けて！", IMAGES.modals.bearWantsSoda, "わあ！ふたを開けて！");
            return;
          }
          if (gameState.selectedItem === "malonet" && hasItem("malonet")) {
            updateMessage("「今は飲み物が飲みたいなあ」");
            return;
          }
          updateMessage("「えへへ」");
          return;
        }),
        description: 'クマ妖精車内表示部',
        zIndex: 6,
        usable: () => !!gameState.main.flags.clickedSnowBear,
        item: { img: () => gameState.main.flags.bearDrankSoda ? 'bearHappy' : 'bear', visible: () => !!gameState.main.flags.clickedSnowBear }
      },
      {
        x: 0.1, y: 0.2, width: 85.7, height: 83.0,
        onClick: clickWrap(function () {

        }),
        description: '景色表示部',
        zIndex: 5,
        usable: () => false,
        item: { src: () => getWindowSceneImage(), visible: () => true, behindBackground: true }
      },
      {
        x: 0.2, y: 8.3, width: 33.6, height: 51.5,
        onClick: clickWrap(() => changeRoom("windowView")),
        description: '窓',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
    ],
  },
  windowView: {
    name: "窓の景色",
    description: "",
    clickableAreas: [
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("seatWindow")),
        description: "窓側の席へ",
        zIndex: 10,
        item: { img: "arrowAbove", rotateDeg: 180, visible: () => true },
      },
      {
        x: 54.9, y: 64.4, width: 10.2, height: 17.8,
        onClick: clickWrap(function () {
          gameState.main.flags.clickedSnowBear = true;
          markProgress("meet_snow_bear");
          setWindowScene("snow", "changed");
          showModal("！", `<img src="${IMAGES.modals.bearClick}" style="width:400px;max-width:100%;display:block;margin:auto;" alt="クマ妖精">`, [{ text: "閉じる", action: "close" }]);
        }),
        description: "雪だるまを作るクマ妖精",
        zIndex: 5,
        usable: () => gameState.windowScene.current === "snow" && !gameState.main.flags.clickedSnowBear,
      },
      {
        x: 60.3, y: 66.0, width: 14.6, height: 16.2,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "operaGlasses" && hasItem("operaGlasses")) {
            const image = IMAGES.modals.snowmanZoom;
            markProgress("view_snowman_with_opera_glasses");
            showModal("双眼鏡で雪だるまを見た", `<img src="${image}" alt="双眼鏡で見た雪だるま" style="max-width:100%;max-height:380px;display:block;margin:auto;">`, [{ text: "閉じる", action: "close" }]);
            return;
          }
        }),
        description: '雪だるま',
        zIndex: 5,
        usable: () => gameState.windowScene.current === "snow" && gameState.main.flags.clickedSnowBear,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 63.2, y: 27.7, width: 34.1, height: 31.3,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "operaGlasses" && hasItem("operaGlasses")) {
            const image = getMainFlags().ateMalonet ? IMAGES.modals.starStationZoom2 : IMAGES.modals.starStationZoom;
            markProgress(getMainFlags().ateMalonet ? "view_star_station_after_malonet" : "view_star_station_with_opera_glasses");
            showModal("双眼鏡で駅を見た", `<img src="${image}" alt="双眼鏡で見た星空の駅" style="max-width:100%;max-height:380px;display:block;margin:auto;">`, [{ text: "閉じる", action: "close" }]);
            return;
          }
          updateMessage("駅があるが遠くてよく見えない。");
        }),
        description: '星空の駅',
        zIndex: 5,
        usable: () => gameState.windowScene.current === "stars",
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
    ],
  },
  adminDoorFront: {
    name: "通路のドア前",
    description: "",
    clickableAreas: [
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("seatWindow")),
        description: "窓側の席へ",
        zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 32.5, y: 0, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("adminDoorAbove")),
        description: "管理室のドア上へ",
        zIndex: 10,
        item: { img: "arrowAbove", visible: () => true },
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("entrance")),
        description: "入口へ",
        zIndex: 10,
        item: { img: "arrowAbove", rotateDeg: 180, visible: () => true },
      },
      {
        x: 14.2, y: 12.7, width: 17.5, height: 17.2,
        onClick: clickWrap(function () {
          if (!gameState.main.flags.putLeafOnPoster && gameState.selectedItem === "leaf" && hasItem("leaf")) {
            removeItem("leaf");
            gameState.main.flags.putLeafOnPoster = true;
            markProgress("put_leaf_on_poster");
            showModal("ポスターの保護板に、葉っぱが静電気でくっついた", `<div class="modal-anim">
              <img src="${IMAGES.modals.bigMiso}" alt="葉っぱがくっつく前のBIG MISOのポスター">
              <img src="${IMAGES.modals.bigMisoLeaf}" alt="保護板に葉っぱがくっついたBIG MISOのポスター">
            </div>`, [{ text: "閉じる", action: "close" }]);
            renderCanvasRoom();
            return;
          }
          showObj('big_miso', 'ポスターだ。表面はアクリル板で保護されている。', gameState.main.flags.putLeafOnPoster ? IMAGES.modals.bigMisoLeaf : IMAGES.modals.bigMiso, 'ポスターが貼られている。表面はアクリル板で保護されている。');
        }),
        description: 'BIG MISOのポスター',
        zIndex: 5,
        usable: () => true,
        item: { img: 'bigMisoLeaf', visible: () => gameState.main.flags.putLeafOnPoster }
      },
      {
        x: 89.6, y: 28.7, width: 9.5, height: 8.9,
        onClick: clickWrap(function () {
          openAdminDoorLock();
        }),
        description: 'ドアロックUI',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 93.0, y: 29.5, width: 2.0, height: 1.4,
        onClick: clickWrap(function () {

        }),
        description: 'ドアロックUIインジケーター',
        zIndex: 5,
        usable: () => false,
        item: { img: () => gameState.main.flags.unlockAdminDoor ? 'greenBack' : 'redBack', visible: () => true }
      },
      {
        x: 53.7, y: 0.8, width: 32.3, height: 94.6,
        onClick: clickWrap(function () {
          if (gameState.main.flags.unlockAdminDoor) {
            changeRoom("adminRoom");
          } else {
            updateMessage("通路のドアはロックされている。");
          }
        }),
        description: '管理室へのドア',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },

    ],
  },
  adminDoorAbove: {
    name: "通路のドアの上",
    description: "",
    clickableAreas: [
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("adminDoorFront")),
        description: "管理室のドア前へ",
        zIndex: 10,
        item: { img: "arrowAbove", rotateDeg: 180, visible: () => true },
      },
      {
        x: 0.0, y: 9.8, width: 45.1, height: 45.1,
        onClick: clickWrap(function () {
          if (gameState.main.flags.removedFanCover) {
            handleOpenFanClick();
            return;
          }
          if (gameState.selectedItem !== "driver" || !hasItem("driver")) {
            updateMessage("換気扇のカバーはねじで固定されている。");
            return;
          }
          removeItem("driver");
          gameState.main.flags.removedFanCover = true;
          markProgress("remove_fan_cover");
          showModal("座席に上り、ねじを外した", `<div class="modal-anim">
            <img src="${IMAGES.modals.useDriver1}" alt="座席に上って換気扇のねじを外す">
            <img src="${IMAGES.modals.useDriver2}" alt="換気扇のカバーを外した">
          </div>`, [{ text: "閉じる", action: "close" }]);
          playSE("se-metal");
          renderCanvasRoom();
        }),
        description: '換気扇',
        zIndex: 5,
        usable: () => true,
        item: { img: 'fanCover', visible: () => !gameState.main.flags.removedFanCover }
      },
    ],
  },
  entrance: {
    name: "列車の乗降口",
    description: "",
    clickableAreas: [
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("adminDoorFront")),
        description: "管理室のドア前へ",
        zIndex: 10,
        item: { img: "arrowAbove", rotateDeg: 180, visible: () => true },
      },
      {
        x: 4.9, y: 40.4, width: 14.7, height: 14.8,
        onClick: clickWrap(function () {
          showObj('poster_malonet', 'お菓子のポスター', IMAGES.modals.posterMalonet, 'お菓子のポスターが貼られている。', null, 'There is a torn poster on the wall.');
        }),
        description: '破れているポスター',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 5.2, y: 68.1, width: 13.7, height: 24.2,
        onClick: clickWrap(function () {
          openWallStorageLock();
        }),
        description: '壁収納',
        zIndex: 5,
        usable: () => true,
        item: { img: 'blackBack', visible: () => gameState.main.flags.unlockWallStorage }
      },
      {
        x: 9.5, y: 78.6, width: 4.8, height: 5.8,
        onClick: clickWrap(function () {
          acquireItemOnce('getBagKey', 'key', 'カギ', IMAGES.items.key, '壁収納の中のカギを手に入れた。');
        }),
        description: '壁収納の中の鍵',
        zIndex: 6,
        usable: () => gameState.main.flags.unlockWallStorage && !gameState.main.flags.getBagKey,
        item: { img: 'key', visible: () => gameState.main.flags.unlockWallStorage && !gameState.main.flags.getBagKey }
      },
      {
        x: 34.2, y: 16.8, width: 38.1, height: 81.6,
        onClick: clickWrap(function () {
          const station = getMainFlags().acceptedStation;
          if (station !== "STELLA" && station !== "VINEA") {
            updateMessage("ドアはロックされている。");
            return;
          }
          travelWithSteps(station === "VINEA" ? "trueEnd" : "end");
        }),
        description: '出口ドア',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 42.3, y: 23.0, width: 22.0, height: 43.0,
        onClick: clickWrap(function () {

        }),
        description: '出口ドアの光',
        zIndex: 5,
        usable: () => false,
        item: { img: 'doorShine', visible: () => getMainFlags().acceptedStation === "STELLA" || getMainFlags().acceptedStation === "VINEA" }
      },
    ],
  },
  adminRoom: {
    name: "管理室",
    description: "",
    clickableAreas: [
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("adminDoorFront")),
        description: "管理室のドア前へ",
        zIndex: 10,
        item: { img: "arrowAbove", rotateDeg: 180, visible: () => true },
      },
      {
        x: 0.2, y: 54.7, width: 23.4, height: 41.2,
        onClick: clickWrap(function () {
          changeRoom("adminRoomCabinet");
        }),
        description: '管理室キャビネット',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 35.1, y: 44.7, width: 10.4, height: 4.8,
        onClick: clickWrap(function () {
          showModal("机の上のノート",
            '<p style="text-align:left;line-height:2.2;font-family:serif;font-size:18px;margin:24px 8px;">疲れているのだろうか。最近映像装置におかしなものが表示される…<br>甘いものでも食べて休憩したほうが良いかもしれない。</p>',
            [{ text: "閉じる", action: "close" }], null,
            { contentClass: "desk-note-modal" });
        }),
        description: '机の上のノート',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 44.8, y: 22.9, width: 32.0, height: 16.8,
        onClick: clickWrap(function () {
          openWindowSceneLevers();
        }),
        description: 'レバー操作部',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 70.4, y: 32.0, width: 4.5, height: 4.5,
        onClick: clickWrap(function () {

        }),
        description: '星のレバー表示部',
        zIndex: 5,
        usable: () => false,
        item: { img: 'lever', visible: () => !!gameState.main.flags.installedStarLever }
      },
      {
        x: 0.1, y: 1.9, width: 9.1, height: 33.5,
        onClick: clickWrap(function () {
          showObj(null, '路線図', IMAGES.modals.map, '路線図が貼られている。');
        }),
        description: '路線図',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0.1, y: 35.9, width: 12.9, height: 16.9,
        onClick: clickWrap(function () {
          openGuideBook();
        }),
        description: '本',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 72.8, y: 52.8, width: 10.7, height: 4.0,
        onClick: clickWrap(function () {
          openDeskUpperDrawerLock();
        }),
        description: '机の引き出し上段',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 73.1, y: 57.4, width: 10.3, height: 4.8,
        onClick: clickWrap(function () {
          if (getMainFlags().gotOperaGlassesFromDesk) {
            updateMessage("もう何もない。");
            return;
          }
          if (gameState.inventory.length >= 14) {
            updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
            return;
          }
          acquireItemOnce("gotOperaGlassesFromDesk", "operaGlasses", "双眼鏡を見つけた", IMAGES.modals.drawerDeskSecond, "机の引き出し中段から双眼鏡を手に入れた。");
        }),
        description: '机の引き出し中段',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 72.9, y: 62.5, width: 10.7, height: 11.3,
        onClick: clickWrap(function () {
          openDeskLowerDrawerLock();
        }),
        description: '机の引き出し下段',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 50.7, y: 40.7, width: 10.2, height: 6.7,
        onClick: clickWrap(function () {
          openStationTablet();
        }),
        description: '机の上のタブレット',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
    ],
  },
  adminRoomCabinet: {
    name: "管理室キャビネット",
    description: "",
    clickableAreas: [
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("adminRoom")),
        description: "管理室へ戻る",
        zIndex: 10,
        item: { img: "arrowAbove", rotateDeg: 180, visible: () => true },
      },
      {
        x: 3.1, y: 18.8, width: 46.6, height: 15.1,
        onClick: clickWrap(function () {
          openCabinetBalloonLock();
        }),
        description: '左上の引き出し',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 3.2, y: 35.4, width: 46.2, height: 51.3,
        onClick: clickWrap(function () {
          openCabinetShapeLock();
        }),
        description: '左下の収納',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 51.0, y: 19.0, width: 45.0, height: 67.9,
        onClick: clickWrap(function () {
          openCabinetRightStorageLock();
        }),
        description: '右下の収納',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
    ],
  },
  end: {
    name: "NORMAL END",
    description: "不思議な駅に到着しました。脱出おめでとうございます！",
    clickableAreas: [
      {
        x: 11.2, y: 23.1, width: 8.7, height: 7.2,
        onClick: clickWrap(function () {

        }),
        description: '黒い星',
        zIndex: 5,
        usable: () => false,
        item: { img: 'blackStar', visible: () => !gameState.main.flags.ateMalonet }
      },
      {
        x: 47.1, y: 52.1, width: 13.7, height: 19.1,
        onClick: clickWrap(function () {
          showObj(null, 'クマ妖精は流れ星になにか願っているようだ', IMAGES.modals.bearLookStar, 'クマ妖精は流れ星になにか願っているようだ');
        }),
        description: '星を眺めるクマ妖精',
        zIndex: 5,
        usable: () => gameState.end.flags.backgroundState === 0,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(() => showEndingReport("end"), { allowAtNight: true }),
        description: "ノーマルエンド", zIndex: 0, usable: () => true,
      },
    ],
  },
  trueEnd: {
    name: "TRUE END",
    description: "VINEA駅で列車を降りた。ブドウ狩りに行こう！",
    clickableAreas: [
      {
        x: 32.2, y: 70.3, width: 19.8, height: 24.6,
        onClick: clickWrap(function () {
          showObj(null, "クマ妖精はブドウを楽しみにしているようだ", IMAGES.modals.bearWishGrape, "クマ妖精はブドウを楽しみにしているようだ");
        }),
        description: 'ブドウ狩りに行くクマ妖精',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(() => showEndingReport("trueEnd"), { allowAtNight: true }),
        description: "トゥルーエンド", zIndex: 0, usable: () => true,
      },
    ],
  },
};

function openStationTablet() {
  if (getMainFlags().acceptedStation === "VINEA") {
    showModal("停車駅を受け付けました", `<p>${getMainFlags().acceptedStation}</p>`, [{ text: "閉じる", action: "close" }]);
    return;
  }
  const submit = () => {
    const station = document.getElementById("stationNameInput").value.trim().toUpperCase();
    if (station !== "STELLA" && !(station === "VINEA" && getMainFlags().bearDrankSoda)) {
      document.getElementById("stationTabletError").textContent = "停車駅名を確認してください。";
      return;
    }
    getMainFlags().acceptedStation = station;
    markProgress(`accept_station_${station.toLowerCase()}`, { station });
    showModal("停車駅を受け付けました", "", [{ text: "閉じる", action: "close" }]);
    playStationAnnouncement();
  };
  showModal(getMainFlags().acceptedStation === "STELLA" ? "行先変更" : "停車駅の設定", `
    <div class="station-tablet-screen">
      ${getMainFlags().acceptedStation === "STELLA" ? '<p>現在、STELLA駅を受け付けています。</p>' : ''}
      <label for="stationNameInput">停車駅名を入力</label>
      <input id="stationNameInput" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="30">
      <p id="stationTabletError" role="status" aria-live="polite"></p>
    </div>
  `, [{ text: "OK", action: submit }, { text: "閉じる", action: "close" }]);
  const input = document.getElementById("stationNameInput");
  input.onkeydown = event => {
    if (event.key === "Enter" && !event.isComposing) { event.preventDefault(); submit(); }
  };
  input.focus();
}

function playStationAnnouncement() {
  const chime = document.getElementById("se-pinponpan");
  const state = gameState;
  const onEnded = () => {
    chime.removeEventListener("error", onError);
    if (gameState === state) playSE("se-train");
  };
  const onError = () => { chime.removeEventListener("ended", onEnded); };
  chime.addEventListener("ended", onEnded, { once: true });
  chime.addEventListener("error", onError, { once: true });
  chime.currentTime = 0;
  chime.play().catch(() => {
    chime.removeEventListener("ended", onEnded);
    chime.removeEventListener("error", onError);
  });
}

let endingTravelActive = false;
function travelWithSteps(destRoom, { soundId = "se-gatan", transitionDelay = 480 } = {}) {
  if (endingTravelActive || !rooms[destRoom]) return;
  endingTravelActive = true;
  const state = gameState;
  const overlay = document.getElementById("roomEffectOverlay");
  state.fx ??= {};
  state.fx.lockInput = true;
  playSE(soundId);
  if (overlay) {
    overlay.style.background = "#000";
    overlay.style.pointerEvents = "auto";
    overlay.style.opacity = 1;
  }
  setTimeout(() => {
    if (gameState === state) changeRoom(destRoom);
    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = 0;
        overlay.style.background = "";
        overlay.style.pointerEvents = "none";
      }
      endingTravelActive = false;
      state.fx.lockInput = false;
    }, 100);
  }, transitionDelay);
}

function showEndingReport(endingId = "end") {
  const elapsed = Math.max(0, Math.round((Date.now() - (ANA.start || Date.now())) / 1000));
  const ENDING_INFO = {
    end: { title: "★ NORMAL END", desc: rooms.end.description, secretText: "🚋 脱出おめでとうございます" },
    trueEnd: { title: "🍇 TRUE END", desc: rooms.trueEnd.description, secretText: "💐 長い道のり、遊んでくれてありがとうございました" },
  };
  const info = ENDING_INFO[endingId] || ENDING_INFO.end;
  ANA.once("ending", endingId, { ending: endingId, time_sec: elapsed });
  showModal("エンディング", `
    <div style="max-width:520px;text-align:center;">
      <h2 style="margin-top:0;">${info.title}</h2>
      <p style="margin:6px 0 12px;font-weight:bold;">${info.desc}</p>
      <p style="margin:4px 0;">プレイ時間：<b>${Math.floor(elapsed / 60)}分${String(elapsed % 60).padStart(2, "0")}秒</b></p>
      <p style="margin:4px 0;">ヒント利用：<b>${ANA.hintCount || 0} 回</b></p>
      <p style="margin:12px 0;font-size:.9em;opacity:.85;">${info.secretText}</p>
    </div>
  `, [
    { text: "最初から", action: "restart" },
    { text: "プレイ後アンケート", action: () => openFeedbackForm(endingId) },
    { text: "閉じる", action: "close" },
  ]);
}
function openFeedbackForm(endingId) {
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeRRDE-ZukowuIDzbpgp4TkIYt177-plUIm2_7-mzZnxq2QxQ/viewform";
  const endingLabel = { end: "ノーマルエンド", trueEnd: "トゥルーエンド" }[endingId] || "エンド";
  const params = new URLSearchParams({ "entry.666725843": endingLabel });
  window.open(`${FEEDBACK_URL}?${params.toString()}`, "_blank", "noopener");
}

function openDeskUpperDrawerLock() {
  if (getMainFlags().unlockDeskUpperDrawer) {
    if (getMainFlags().gotMalonetFromDesk) {
      updateMessage("もう何もない。");
      return;
    }
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
      return;
    }
    acquireItemOnce("gotMalonetFromDesk", "malonet", "マロネットを見つけた", IMAGES.modals.drawerDeskTop, "机の引き出し上段からマロネットを手に入れた。");
    return;
  }
  const digits = [0, 0, 6, 0];
  showModal("机の引き出し上段のロック", `
    <div style="display:flex;justify-content:center;gap:8px;width:340px;max-width:100%;margin:24px auto;">
      ${digits.map((digit, index) => `
        <button type="button" id="deskUpperDigit${index}" ${index === 2 ? 'disabled aria-label="3桁目：6（固定）"' : `aria-label="${index + 1}桁目：${digit}"`}
          style="flex:1;min-width:0;aspect-ratio:1;padding:0;background:#FFF3B0;color:#111;border:2px solid #8a8055;border-radius:0;font-size:clamp(28px,8vw,44px);opacity:1;cursor:${index === 2 ? 'default' : 'pointer'};">${digit}</button>
      `).join("")}
    </div>
  `, [
    {
      text: "OK",
      action: () => {
        if (digits.join("") !== "3160") return;
        getMainFlags().unlockDeskUpperDrawer = true;
        markProgress("unlock_desk_upper_drawer");
        playSE("se-gacha");
        closeModal();
        renderCanvasRoom();
        updateMessage("机の引き出し上段をアンロックした。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  digits.forEach((_, index) => {
    if (index === 2) return;
    const button = document.getElementById(`deskUpperDigit${index}`);
    button.onclick = () => {
      digits[index] = (digits[index] + 1) % 10;
      button.textContent = String(digits[index]);
      button.setAttribute("aria-label", `${index + 1}桁目：${digits[index]}`);
      playSE("se-mouse");
    };
  });
}

function openDeskLowerDrawerLock() {
  if (getMainFlags().unlockDeskLowerDrawer) {
    if (getMainFlags().gotGrapeSodaFromDesk) {
      updateMessage("もう何もない。");
      return;
    }
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
      return;
    }
    acquireItemOnce("gotGrapeSodaFromDesk", "grapeSoda", "ブドウソーダを見つけた", IMAGES.modals.drawerDeskThird, "机の引き出し下段からブドウソーダを手に入れた。");
    return;
  }
  const letters = ["A", "B", "D", "E", "I", "L", "N", "R", "S", "T"];
  const positions = [0, 0, 0, 0];
  showModal("机の引き出し下段のロック", `
    <div style="display:flex;justify-content:center;gap:8px;width:340px;max-width:100%;margin:24px auto;">
      ${positions.map((_, index) => `
        <button type="button" id="deskLowerLetter${index}" translate="no" class="notranslate" aria-label="${index + 1}文字目：A"
          style="flex:1;min-width:0;aspect-ratio:1;padding:0;background:#fff;color:#111;border:2px solid #555;border-radius:0;font-size:clamp(28px,8vw,44px);cursor:pointer;">A</button>
      `).join("")}
    </div>
  `, [
    {
      text: "OK",
      action: () => {
        if (positions.map(position => letters[position]).join("") !== "BIAS") return;
        getMainFlags().unlockDeskLowerDrawer = true;
        markProgress("unlock_desk_lower_drawer");
        playSE("se-gacha");
        closeModal();
        renderCanvasRoom();
        updateMessage("机の引き出し下段をアンロックした。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  positions.forEach((_, index) => {
    const button = document.getElementById(`deskLowerLetter${index}`);
    button.onclick = () => {
      positions[index] = (positions[index] + 1) % letters.length;
      button.textContent = letters[positions[index]];
      button.setAttribute("aria-label", `${index + 1}文字目：${button.textContent}`);
      playSE("se-mouse");
    };
  });
}

function openCabinetRightStorageLock() {
  if (getMainFlags().unlockCabinetRightStorage) {
    if (getMainFlags().gotRemoconFromCabinet) {
      updateMessage("もう何もない。");
      return;
    }
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
      return;
    }
    const active = !!getMainFlags().installedStarLever;
    acquireItemOnce("gotRemoconFromCabinet", active ? "remoconActive" : "remocon", "リモコンを見つけた", IMAGES.modals.remoconFind, active ? "リモコンが反応した！" : "右下の収納からリモコンを手に入れた。");
    return;
  }
  const letters = ["S", "T", "U", "R"];
  const positions = [0, 0, 0, 0];
  showModal("右下の収納のロック", `
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;width:380px;max-width:100%;margin:24px auto;">
      ${positions.map((_, index) => `
        ${index === 2 ? '<span aria-hidden="true" style="font-size:28px;">-</span>' : ''}
        <button type="button" id="cabinetRightCode${index}" translate="no" class="notranslate" aria-label="${index + 1}桁目：${index < 2 ? 'S' : '0'}"
          style="flex:1;min-width:0;aspect-ratio:1;padding:0;background:#eee;color:#111;border:2px solid #555;border-radius:0;font-size:clamp(24px,7vw,40px);cursor:pointer;">${index < 2 ? 'S' : '0'}</button>
      `).join("")}
    </div>
  `, [
    {
      text: "OK",
      action: () => {
        const code = `${letters[positions[0]]}${letters[positions[1]]}-${positions[2]}${positions[3]}`;
        if (code !== "TR-47") return;
        getMainFlags().unlockCabinetRightStorage = true;
        markProgress("unlock_cabinet_right_storage");
        playSE("se-gacha");
        closeModal();
        renderCanvasRoom();
        updateMessage("右下の収納をアンロックした。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  positions.forEach((_, index) => {
    const button = document.getElementById(`cabinetRightCode${index}`);
    button.onclick = () => {
      positions[index] = (positions[index] + 1) % (index < 2 ? letters.length : 10);
      button.textContent = index < 2 ? letters[positions[index]] : String(positions[index]);
      button.setAttribute("aria-label", `${index + 1}桁目：${button.textContent}`);
      playSE("se-mouse");
    };
  });
}

function openCabinetShapeLock() {
  if (getMainFlags().unlockCabinetLowerStorage) {
    const flags = getMainFlags();
    if (flags.gotLeverFromCabinet) {
      updateMessage("もう何もない。");
      return;
    }
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
      return;
    }
    acquireItemOnce("gotLeverFromCabinet", "lever", "レバーを見つけた", IMAGES.items.lever, "左下の収納からレバーを手に入れた。");
    return;
  }

  const shapes = ["●", "▲", "▽", "■", "◇", "◎"];
  const positions = [0, 0, 0];
  showModal("左下の収納のロック", `
    <div style="display:flex;justify-content:center;gap:12px;width:300px;max-width:100%;margin:24px auto;">
      ${positions.map((_, index) => `
        <button type="button" id="cabinetShape${index}" aria-label="${index + 1}番目の図形：●"
          style="flex:1;min-width:0;aspect-ratio:1;padding:0;background:#83E4FF;color:#111;border:2px solid #555;border-radius:0;font-size:clamp(28px,9vw,48px);line-height:1;cursor:pointer;">●</button>
      `).join("")}
    </div>
  `, [
    {
      text: "OK",
      action: () => {
        if (positions.map(position => shapes[position]).join("") !== "▽◎◇") return;
        getMainFlags().unlockCabinetLowerStorage = true;
        markProgress("unlock_cabinet_lower_storage");
        playSE("se-gacha");
        closeModal();
        renderCanvasRoom();
        updateMessage("左下の収納をアンロックした。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  positions.forEach((_, index) => {
    const button = document.getElementById(`cabinetShape${index}`);
    button.onclick = () => {
      positions[index] = (positions[index] + 1) % shapes.length;
      button.textContent = shapes[positions[index]];
      button.setAttribute("aria-label", `${index + 1}番目の図形：${button.textContent}`);
      playSE("se-mouse");
    };
  });
}

function openGuideBook() {
  const pages = [
    { jp: IMAGES.modals.guideMalonet, en: IMAGES.modals.guideMalonetEn },
    { jp: IMAGES.modals.guideGrape, en: IMAGES.modals.guideGrapeEn },
  ];
  let page = 0;
  const refresh = () => {
    const english = uiLang === "en";
    document.getElementById("guideBookPage").src = pages[page][english ? "en" : "jp"];
    document.getElementById("guideBookPage").alt = `${english ? "Guidebook page" : "ガイドブック"} ${page + 1}`;
    document.getElementById("guideBookPageNumber").textContent = `${page + 1} / ${pages.length}`;
    document.getElementById("guideBookPrevious").disabled = page === 0;
    document.getElementById("guideBookNext").disabled = page === pages.length - 1;
    document.getElementById("guideBookLanguage").textContent = english ? "🌐 日本語" : "🌐 English";
  };
  showModal("ガイドブックがある。", `
    <img id="guideBookPage" class="showobj-image" alt="ガイドブック">
    <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin:12px 0;">
      <button type="button" id="guideBookPrevious" aria-label="前のページ">←</button>
      <span id="guideBookPageNumber" aria-live="polite"></span>
      <button type="button" id="guideBookNext" aria-label="次のページ">→</button>
    </div>
    <button type="button" id="guideBookLanguage">🌐 English</button>
  `, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
  document.getElementById("guideBookPrevious").onclick = () => {
    if (page > 0) { page--; refresh(); }
  };
  document.getElementById("guideBookNext").onclick = () => {
    if (page < pages.length - 1) { page++; refresh(); }
  };
  document.getElementById("guideBookLanguage").onclick = () => {
    uiLang = uiLang === "en" ? "jp" : "en";
    refresh();
  };
  refresh();
}

function openCabinetBalloonLock() {
  if (gameState.main.flags.unlockCabinetDrawer) {
    if (gameState.main.flags.getDriverFromDrawer) {
      updateMessage("もう何もない。");
    } else if (gameState.inventory.length >= 14) {
      showObj(null, "左上の引き出し", IMAGES.modals.drawerLeftAbove, "アイテム欄がいっぱいだ。どこかで減らしてこよう");
    } else {
      acquireItemOnce("getDriverFromDrawer", "driver", "ドライバーを見つけた", IMAGES.modals.drawerLeftAbove, "引き出しの中からドライバーを手に入れた。");
    }
    return;
  }
  const heights = [1, 1, 1, 1];
  showModal("引き出しのロック", `
    ${gameState.main.flags.ateMalonet ? '<p>4132という数字が頭に響いてきた…</p>' : ''}
    <div class="balloon-lock-panel">
      ${heights.map((_, index) => `
        <button type="button" id="balloonColumn${index}" class="balloon-lock-column" aria-label="${index + 1}列目：高さ1">
          <img id="balloonIcon${index}" src="${IMAGES.items.iconBalloon}" alt="" draggable="false" style="bottom:0%;">
        </button>
      `).join("")}
    </div>
  `, [
    {
      text: "OK",
      action: () => {
        if (heights.join(",") !== "4,1,3,2") return;
        gameState.main.flags.unlockCabinetDrawer = true;
        markProgress("unlock_cabinet_drawer");
        playSE("se-gacha");
        closeModal();
        renderCanvasRoom();
        updateMessage("左上の引き出しをアンロックした。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  heights.forEach((_, index) => {
    const button = document.getElementById(`balloonColumn${index}`);
    button.onclick = () => {
      heights[index] = heights[index] % 4 + 1;
      document.getElementById(`balloonIcon${index}`).style.bottom = `${(heights[index] - 1) * 25}%`;
      button.setAttribute("aria-label", `${index + 1}列目：高さ${heights[index]}`);
      playSE("se-mouse");
    };
  });
}

function openWindowSceneLevers() {
  if (!gameState.main.flags.installedStarLever && gameState.selectedItem === "lever" && hasItem("lever")) {
    removeItem("lever");
    gameState.main.flags.installedStarLever = true;
    markProgress("install_star_lever");
    playSE("se-gacha");
    renderCanvasRoom();
    showModal("レバーをセットした", "", [{ text: "閉じる", action: "close" }]);
    return;
  }
  const controls = [
    { id: "autumn", icon: "🍁", label: "紅葉" },
    { id: "sky", icon: "☁️", label: "雲" },
    { id: "snow", icon: "❄️", label: "雪" },
    { id: "stars", icon: "🌟", label: "星空" },
  ];
  const selectedItem = gameState.selectedItem;
  showModal("レバー操作", `
    <div class="scene-lever-panel">
      ${controls.map(control => `
        <div class="scene-lever-column">
          <div class="scene-lever-icon" role="img" aria-label="${control.label}">${control.icon}</div>
          <button type="button" id="sceneLever-${control.id}" class="scene-lever" aria-label="${control.label}のレバー">
            <span class="scene-lever-track" aria-hidden="true"></span>
    <span class="scene-lever-handle" aria-hidden="true"></span>
          </button>
        </div>
      `).join("")}
    </div>
    <p id="sceneLeverStatus" class="scene-lever-status" aria-live="polite"></p>
  `, [{ text: "閉じる", action: "close" }]);

  const refresh = () => {
    const installed = !!gameState.main.flags.installedStarLever;
    controls.forEach(control => {
      const button = document.getElementById(`sceneLever-${control.id}`);
      const missing = control.id === "stars" && !installed;
      const down = !missing && gameState.windowScene.current === control.id;
      button.classList.toggle("is-missing", missing);
      button.classList.toggle("is-down", down);
      button.setAttribute("aria-pressed", String(down));
      button.setAttribute("aria-disabled", String(missing && !(selectedItem === "lever" && hasItem("lever"))));
      button.setAttribute("aria-label", missing ? "星空のレバー取り付け穴" : `${control.label}のレバー`);
    });
    document.getElementById("sceneLeverStatus").textContent = "";
  };

  controls.forEach(control => {
    document.getElementById(`sceneLever-${control.id}`).onclick = () => {
      if (control.id === "stars" && !gameState.main.flags.installedStarLever) {
        if (selectedItem !== "lever" || !hasItem("lever")) return;
        removeItem("lever");
        gameState.main.flags.installedStarLever = true;
        markProgress("install_star_lever");
        playSE("se-gacha");
        renderCanvasRoom();
        refresh();
        document.getElementById("sceneLeverStatus").textContent = "星空のレバーを取り付けた。";
        return;
      }
      gameState.windowScene.hasOperatedLever = true;
      renderStatusIcons();
      if (gameState.windowScene.current === control.id) return;
      setWindowScene(control.id);
      markProgress(`change_scene_${control.id}`, { scene: control.id, tool: "lever" });
      playSE("se-gacha");
      refresh();
    };
  });
  refresh();
}

function openAdminDoorLock() {
  if (gameState.main.flags.unlockAdminDoor) {
    updateMessage("通路のドアはアンロックされている。");
    return;
  }

  // 入力はモーダルを開くたび、およびOKで判定するたびにリセットする。
  let sequence = "";
  showModal("ドアロック", `
    <div style="display:flex;justify-content:center;gap:32px;margin:24px 0;">
      <button type="button" id="adminDoorLockLeft" class="text-btn" aria-label="左" style="width:80px;height:64px;background:#fff;"></button>
      <button type="button" id="adminDoorLockRight" class="text-btn" aria-label="右" style="width:80px;height:64px;background:#fff;"></button>
    </div>
  `, [
    {
      text: "OK",
      action: () => {
        const correct = sequence === "LLRLRR";
        sequence = "";
        if (!correct) return;
        gameState.main.flags.unlockAdminDoor = true;
        markProgress("unlock_admin_door");
        removeItem("memoInBag");
        playSE("se-gacha");
        closeModal();
        renderCanvasRoom();
        updateMessage("通路のドアをアンロックした。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  // 押下順だけを記録し、ボタンや入力履歴の表示は変えない。
  document.getElementById("adminDoorLockLeft").onclick = () => { sequence += "L"; playSE("se-mouse"); };
  document.getElementById("adminDoorLockRight").onclick = () => { sequence += "R"; playSE("se-mouse"); };
}

function openWallStorageLock() {
  if (gameState.main.flags.unlockWallStorage) {
    updateMessage("壁収納はアンロックされている。");
    return;
  }

  const letters = ["A", "B", "E", "I", "L", "M", "N", "O", "S", "T"];
  const positions = Array(7).fill(0);
  const squares = positions.map((_, index) => `
    <button type="button" id="wallStorageLetter${index}" translate="no" class="notranslate" aria-label="${index + 1}文字目"
      style="flex:1;min-width:0;aspect-ratio:1;padding:0;background:#fff;color:#111;border:2px solid #888;border-radius:0;font-size:clamp(20px,6vw,34px);font-weight:bold;cursor:pointer;">A</button>
  `).join("");
  showModal("壁収納のロック", `
    <div style="display:flex;gap:3px;width:min(490px, calc(96vw - 52px));max-width:100%;margin:24px auto;">${squares}</div>
  `, [
    {
      text: "OK",
      action: () => {
        if (positions.map(position => letters[position]).join("") !== "MALONET") return;
        gameState.main.flags.unlockWallStorage = true;
        markProgress("unlock_wall_storage");
        playSE("se-gacha");
        closeModal();
        renderCanvasRoom();
        updateMessage("壁収納をアンロックした。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  positions.forEach((_, index) => {
    const button = document.getElementById(`wallStorageLetter${index}`);
    button.onclick = () => {
      positions[index] = (positions[index] + 1) % letters.length;
      button.textContent = letters[positions[index]];
      playSE("se-mouse");
    };
  });
}

function getInventoryItemImage(itemId) { return IMAGES.items[itemId]; }

function initGame() {
  renderNavigation();
  changeRoom("adminDoorFront");
  updateInventoryDisplay();

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

const END_IDS = new Set(["end", "trueEnd"]);
const NAV_EXCLUDED_ROOM_IDS = new Set(["windowView", "adminDoorAbove", "adminRoomCabinet", "end", "trueEnd"]);
function unfoldSeatTable() {
  const state = gameState;
  if (state.fx?.lockInput || state.seatWindow.flags.backgroundState !== 0) return;
  const overlay = document.getElementById("roomEffectOverlay");
  state.fx ??= {};
  state.fx.lockInput = true;
  hoveredAreaIndex = null;
  playSE("se-plug");
  if (overlay) {
    overlay.style.background = "#000";
    overlay.style.transition = "opacity 0.3s";
    overlay.style.pointerEvents = "auto";
    overlay.style.opacity = 1;
  }
  // 0.3秒で暗転してからテーブルを開く。
  setTimeout(() => {
    if (gameState === state) {
      state.seatWindow.flags.backgroundState = 1;
      markProgress("unfold_seat_table");
      renderCanvasRoom();
    }
    if (overlay) overlay.style.opacity = 0;
    setTimeout(() => {
      if (overlay) {
        overlay.style.background = "";
        overlay.style.pointerEvents = "none";
        overlay.style.transition = "";
      }
      state.fx.lockInput = false;
    }, 300);
  }, 300);
}

function changeRoom(roomId) {
  if (!rooms[roomId]) return;
  if (END_IDS.has(gameState.currentRoom) && !END_IDS.has(roomId)) return;
  addNaviItem(roomId);
  gameState.currentRoom = roomId;
  if (END_IDS.has(roomId)) {
    gameState.inventory = [];
    gameState.selectedItem = null;
    gameState.selectedItemSlot = null;
    gameState.usingItem = null;
    gameState.inventoryPage = 0;
    updateInventoryDisplay();
  }
  if (roomId === "end") {
    gameState.end.flags.backgroundState = gameState.main.flags.clickedSnowBear ? 0 : 1;
  }
  if (roomId === "windowView" && gameState.windowScene?.hasOperatedLever) {
    gameState.windowScene.hasViewedSceneAfterLever = true;
  }
  changeBGM(roomId === "trueEnd" ? S47("akibare.mp3") : roomId === "end" ? S47("jojouka_adokenai_hanashi.mp3") : DEFAULT_BGM);
  hoveredAreaIndex = null;
  renderCanvasRoom();
  const room = rooms[roomId];
  updateMessage(room.name + "です。" + room.description);
  renderNavigation();
}

function renderCanvasRoom() {
  renderStatusIcons();
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const roomId = gameState.currentRoom;
  const room = rooms[roomId];
  const bgImgSrc = getRoomBackgroundImage(roomId, gameState);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 景色など、背景の透過部分から見せる画像を先に描画。
  drawRoomItems(ctx, canvas, roomId, true);

  // 背景描画
  const bgImg = loadedImages[bgImgSrc];
  if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  }

  drawRoomItems(ctx, canvas, roomId);

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












function drawRoomItems(ctx, canvas, roomId, behindBackground = false) {
  const room = rooms[roomId];
  const fx = gameState.fx || {};

  // 通常のアイテム（演出中のカニだけスキップ）
  room.clickableAreas.forEach((area) => {
    if (Boolean(area.item?.behindBackground) !== behindBackground) return;
    if (area.item && area.item.visible && area.item.visible()) {
      const key = typeof area.item.img === "function" ? area.item.img() : area.item.img;

      const imgSrc = typeof area.item.src === "function" ? area.item.src() :
        area.item.src || IMAGES.items[key] || IMAGES.modals[key];
      const img = loadedImages[imgSrc];
      if (img && img.complete && img.naturalWidth > 0) {
        const areaAlpha = typeof area.alpha === "function" ? area.alpha() : area.alpha;
        const alpha = areaAlpha === undefined ? 1 : areaAlpha;
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

function getWindowSceneImage(state = gameState) {
  const current = state.windowScene?.current ?? "autumn";
  const scene = WINDOW_SCENES[current] || WINDOW_SCENES.autumn;
  const flags = state.main?.flags ?? {};
  if (current === "snow") {
    if (flags.ateMalonet) {
      return flags.clickedSnowBear ? scene.states.afterMalonetWithoutBear : scene.states.afterMalonet;
    }
    return flags.clickedSnowBear ? scene.states.changed : scene.states.normal;
  }
  if (flags.ateMalonet) return scene.states.afterMalonet;
  const sceneState = state.windowScene?.states?.[current] ?? "normal";
  return scene.states[sceneState] || scene.states.normal;
}

// 状態を省略して切り替えると、その景色の前回の状態を保持する。
function setWindowScene(sceneId, sceneState) {
  const scene = WINDOW_SCENES[sceneId];
  if (!scene || (sceneState !== undefined && !Object.hasOwn(scene.states, sceneState))) return false;
  gameState.windowScene ??= { current: "autumn", states: {} };
  gameState.windowScene.states ??= {};
  gameState.windowScene.current = sceneId;
  if (sceneState !== undefined) gameState.windowScene.states[sceneId] = sceneState;
  renderCanvasRoom();
  return true;
}

function getRoomBackgroundImage(roomId, gameState) {
  if (roomId === "windowView") return getWindowSceneImage(gameState);
  const imgList = IMAGES.rooms[roomId];

  // 単一画像ならそのまま
  if (!Array.isArray(imgList)) {
    return imgList;
  }

  const state = gameState[roomId]?.flags?.backgroundState ?? 0;
  return imgList[state] || imgList[0];
}

// 葉っぱの演出とアイテムの獲得は一度だけ行う。
async function handleOpenFanClick() {
  if (gameState.fx?.lockInput) return;
  if (gameState.windowScene.current === "snow") {
    if (gameState.selectedItem === "grapeSoda" && hasItem("grapeSoda")) {
      removeItem("grapeSoda");
      addItem("sodaCold");
      markProgress("cool_grape_soda");
      showModal("グレープソーダを冷気にあてた。", `<div class="modal-anim">
        <img src="${IMAGES.modals.sodaCooling1}" alt="グレープソーダを冷気にあてる">
        <img src="${IMAGES.modals.sodaCooling2}" alt="冷えたグレープソーダ">
      </div>`, [{ text: "閉じる", action: "close" }]);
      renderCanvasRoom();
      updateMessage("冷えたグレープソーダを手に入れた。");
      return;
    }
    showObj(null, "換気扇から冷気が入ってきた", IMAGES.modals.coldAirFromFan, "とても冷たい冷気が入ってきた");
    return;
  }
  if (gameState.windowScene.current === "sky") {
    showModal("換気扇から霧が入ってきた。", `<img src="${IMAGES.modals.mistFromFan}" alt="換気扇から入ってくる霧" style="max-width:100%;max-height:380px;display:block;margin:auto;">`, [{ text: "閉じる", action: "close" }]);
    updateMessage("換気扇から霧が入ってきた。");
    return;
  }
  if (gameState.windowScene.current !== "autumn") {
    updateMessage("換気扇のカバーは外れている。");
    return;
  }

  const flags = getMainFlags();
  if (flags.gotLeafFromFan) {
    updateMessage("換気扇がある");
    return;
  }
  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいで葉っぱを拾えない。");
    return;
  }
  const state = gameState;
  state.fx ??= {};
  state.fx.lockInput = true;
  try {
    await playFanLeafAnimation();
    if (gameState !== state) return;
    addItem("leaf");
    flags.gotLeafFromFan = true;
    markProgress("get_leaf_from_fan");
    updateMessage("換気扇から舞い落ちてきた葉っぱを手に入れた。");
  } finally {
    state.fx.lockInput = false;
  }
}

function playFanLeafAnimation() {
  document.getElementById("fan-leaf-effect")?.remove();
  const bounds = canvas.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.id = "fan-leaf-effect";
  Object.assign(layer.style, {
    position: "fixed", left: `${bounds.left}px`, top: `${bounds.top}px`,
    width: `${bounds.width}px`, height: `${bounds.height}px`,
    overflow: "hidden", pointerEvents: "none", zIndex: "20",
  });
  document.body.appendChild(layer);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animations = Array.from({ length: 5 }, (_, i) => {
    const leaf = document.createElement("img");
    leaf.src = IMAGES.items.leaf;
    leaf.alt = "";
    Object.assign(leaf.style, {
      position: "absolute", left: `${16 + i * 3}%`, top: "28%",
      width: "7%", height: "7%", objectFit: "contain", opacity: "0",
    });
    layer.appendChild(leaf);
    const drift = bounds.width * 0.08;
    const fall = bounds.height * 0.58;
    return leaf.animate(reducedMotion ? [
      { opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 0 },
    ] : [
      { transform: "translate(0, 0) rotate(-25deg)", opacity: 0 },
      { transform: `translate(${drift}px, ${fall * 0.25}px) rotate(35deg)`, opacity: 1, offset: 0.25 },
      { transform: `translate(${-drift * 0.5}px, ${fall * 0.5}px) rotate(-40deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${drift}px, ${fall * 0.75}px) rotate(30deg)`, opacity: 1, offset: 0.75 },
      { transform: `translate(0, ${fall}px) rotate(-20deg)`, opacity: 0 },
    ], { duration: reducedMotion ? 600 : 2600, delay: i * 160, easing: "ease-in-out" });
  });
  return Promise.allSettled(animations.map((animation) => animation.finished)).then(() => layer.remove());
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
  markProgress(`acquire_${flagKey}`, { item: itemId });
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

// 各部屋の状態・フラグは必要に応じて追加する。
function getDefaultGameState() {
  return {
    currentRoom: "adminDoorFront",
    openRooms: ["adminDoorFront"],
    openRoomsTmp: [], inventory: [],
    main: {
      flags: {
        installedStarLever: false, getStarLever: false,
        unlockCabinetDrawer: false,
        unlockDeskUpperDrawer: false,
        unlockDeskLowerDrawer: false,
        gotGrapeSodaFromDesk: false,
        gotMalonetFromDesk: false,
        gotOperaGlassesFromDesk: false,
        ateMalonet: false,
        acceptedStation: null,
        unlockCabinetLowerStorage: false,
        unlockCabinetRightStorage: false,
        gotRemoconFromCabinet: false,
        gotLeverFromCabinet: false,
        getDriverFromDrawer: false,
        removedFanCover: false,
        gotLeafFromFan: false,
        clickedSnowBear: false,
        bearDrankSoda: false,
        putLeafOnPoster: false, unlockAdminDoor: false, unlockWallStorage: false, getMemoInBag: false, timePhase: 0, isNight: false,
      }
    },
    seatWindow: { flags: { backgroundState: 0 } },
    windowView: { flags: {} },
    windowScene: {
      current: "autumn",
      hasOperatedLever: false,
      hasViewedSceneAfterLever: false,
      states: Object.fromEntries(Object.keys(WINDOW_SCENES).map((id) => [id, "normal"])),
    },
    adminDoorFront: { flags: {} },
    adminDoorAbove: { flags: {} },
    entrance: { flags: {} },
    adminRoom: { flags: {} },
    adminRoomCabinet: { flags: {} },
    end: { flags: {} },
    trueEnd: { flags: {} },
    selectedItem: null, selectedItemSlot: null, usingItem: null, inventoryPage: 0,
  };
}

function markProgress(step, extra = {}) { ANA.once("progress", step, { step, ...extra }); }

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

function activateRemoconIfReady() {
  if (!getMainFlags().installedStarLever) return;
  const index = gameState.inventory.indexOf("remocon");
  if (index === -1) return;
  gameState.inventory[index] = "remoconActive";
  if (gameState.selectedItem === "remocon") gameState.selectedItem = "remoconActive";
  updateInventoryDisplay();
  showToast("リモコンが反応した！");
}

function openRemoconControls() {
  if (!hasItem("remoconActive") || !getMainFlags().installedStarLever) return;
  const scenes = [
    { id: "autumn", icon: "🍁", label: "紅葉" },
    { id: "sky", icon: "☁️", label: "雲" },
    { id: "snow", icon: "❄️", label: "雪" },
    { id: "stars", icon: "🌟", label: "星空" },
  ];
  showModal("リモコン", `
    <img src="${IMAGES.items.remoconActive}" alt="リモコン" style="max-width:100%;max-height:380px;display:block;margin:auto;">
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:24px auto;">
      ${scenes.map(scene => `<button type="button" id="remoteScene-${scene.id}" class="text-btn"
        ${scene.id === "stars" && !getMainFlags().installedStarLever ? 'disabled' : ''}
        aria-label="${scene.label}" style="font-size:28px;" aria-pressed="${gameState.windowScene.current === scene.id}">${scene.icon}</button>`).join("")}
    </div>
  `, [{ text: "閉じる", action: "close" }]);
  scenes.forEach(scene => {
    document.getElementById(`remoteScene-${scene.id}`).onclick = () => {
      if (scene.id === "stars" && !getMainFlags().installedStarLever) return;
      if (gameState.windowScene.current !== scene.id) {
        setWindowScene(scene.id);
        markProgress(`remote_change_scene_${scene.id}`, { scene: scene.id, tool: "remocon" });
        playSE("se-mouse");
      }
      scenes.forEach(option => {
        document.getElementById(`remoteScene-${option.id}`).setAttribute("aria-pressed", String(gameState.windowScene.current === option.id));
      });
    };
  });
}

function renderStatusIcons() {
  activateRemoconIfReady();
  const area = document.getElementById("statusIconArea");
  if (!area) return;

  area.innerHTML = "";
  const visible = !END_IDS.has(gameState.currentRoom) && !!gameState.windowScene?.hasViewedSceneAfterLever;
  area.closest(".message-area")?.classList.toggle("has-scene-status", visible);
  if (!visible) return;
  const labels = { autumn: "🍁 紅葉", sky: "☁️ 雲", snow: "❄️ 雪", stars: "🌟 星空" };
  const badge = document.createElement("span");
  badge.className = "scene-status-badge";
  badge.classList.toggle("is-awakened", !!getMainFlags().ateMalonet);
  badge.textContent = `${getMainFlags().ateMalonet ? "景色👁" : "景色"}：${labels[gameState.windowScene.current] || labels.autumn}`;
  area.appendChild(badge);
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

function keepOnlyTakeInInventory() {
  const takeItems = gameState.inventory.filter((itemId) => itemId === "take");
  gameState.inventory = takeItems;
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
  const names = { key: "カギ", battery: "電池", driver: "ドライバー", memoInBag: "鞄の中のメモ", starLever: "星空のレバー", lever: "レバー", leaf: "葉っぱ", malonet: "マロネット", operaGlasses: "双眼鏡", grapeSoda: "ブドウソーダ" };
  if (itemId === "sodaCold") return "冷えたグレープソーダ";
  if (itemId === "sodaOpen") return "栓を開けたグレープソーダ";
  if (itemId === "remocon" || itemId === "remoconActive") return "リモコン";
  return names[itemId] || itemId;
}
function openInventoryItemDetail(itemId, slotIndex, fallbackSrc) {
  if (gameState.fx?.lockInput) return;
  const src = getInventoryItemImage(itemId) || fallbackSrc;
  const buttons = [];
  if (itemId === "remoconActive" && hasItem("remoconActive")) {
    openRemoconControls();
    return;
  }
  if (itemId === "malonet" && hasItem("malonet")) {
    buttons.push({
      text: "食べる",
      action: () => {
        if (!hasItem("malonet")) return;
        removeItem("malonet");
        playSE("se-eat");
        getMainFlags().ateMalonet = true;
        markProgress("eat_malonet");
        renderCanvasRoom();
        showObj(null, "マロネットを食べた。", IMAGES.modals.eatMalonet, "マロネットを食べた。", IMAGES.modals.eatMalonetEn, "You ate Malonet.");
      },
    });
  }
  buttons.push({ text: "閉じる", action: "close" });
  showModal(getItemName(itemId), '<img src="' + src + '" style="max-width:100%;max-height:380px;display:block;margin:auto;">', buttons);
}

function renderNavigation() {
  const navDiv = document.querySelector(".navigation");
  navDiv.innerHTML = "";
  if (END_IDS.has(gameState.currentRoom)) return;

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
    .filter((roomId) => rooms[roomId] && !NAV_EXCLUDED_ROOM_IDS.has(roomId))
    .forEach((roomId) => {
      const b = document.createElement("button");
      b.className = "nav-btn";
      b.textContent = rooms[roomId].name;
      b.onclick = () => changeRoom(roomId);
      navDiv.appendChild(b);
    });
}

function openNavModal() {
  if (END_IDS.has(gameState.currentRoom)) return;
  const cur = gameState.currentRoom;
  const listHtml = `
    <div style="display:flex;flex-direction:column;gap:10px;max-height:60vh;overflow:auto;">
      ${gameState.openRooms
      .filter((roomId) => rooms[roomId] && !NAV_EXCLUDED_ROOM_IDS.has(roomId))
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
  if (NAV_EXCLUDED_ROOM_IDS.has(room)) return false;
  if (!gameState.openRooms.includes(room)) {
    gameState.openRooms.push(room);
    return true;
  }
  return false;
}

// インベントリ表示更新
function flashInventoryItem(itemId) {
  const itemIndex = gameState.inventory.indexOf(itemId);
  if (itemIndex < 0) {
    updateInventoryDisplay();
    return;
  }

  gameState.inventoryPage = Math.floor(itemIndex / getInventoryPageSize());
  updateInventoryDisplay();
  requestAnimationFrame(() => {
    const slot = document.querySelector(`.inventory-slot[data-slot-index="${itemIndex}"]`);
    if (!slot) return;
    slot.classList.remove("inventory-flash");
    void slot.offsetWidth;
    slot.classList.add("inventory-flash");
    setTimeout(() => slot.classList.remove("inventory-flash"), 750);
  });
}

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
      img.src = getInventoryItemImage(invItemId);
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
    if (selectedItemId && getInventoryItemImage(selectedItemId)) {
      const thumbImg = document.createElement("img");
      thumbImg.src = getInventoryItemImage(selectedItemId);
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
      openInventoryItemDetail(selectedItemId, selectedSlotIndex, getInventoryItemImage(selectedItemId));
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
  const closeButton = buttons?.find(button => button.action === "close");
  if (closeButton) {
    const closeBar = document.createElement("div");
    closeBar.className = "modal-top-close-bar";
    const topClose = document.createElement("button");
    topClose.type = "button";
    topClose.className = "modal-top-close";
    topClose.textContent = "×";
    topClose.setAttribute("aria-label", "モーダルを閉じる");
    topClose.onclick = () => {
      closeModal();
      if (typeof onSequenceSuccess === "function") onSequenceSuccess();
    };
    closeBar.appendChild(topClose);
    modalContent.prepend(closeBar);
  }
  modalContent.scrollTop = 0;
  modalContent.scrollLeft = 0;
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
  ANA.reset();
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
  Object.values(WINDOW_SCENES).forEach((scene) => {
    Object.values(scene.states).forEach((src) => {
      if (loadedImages[src]) return;
      const img = new Image();
      img.onload = () => renderCanvasRoom();
      loadedImages[src] = img;
      img.src = src;
    });
  });
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
  if (gameState.fx?.lockInput) {
    updateMessage("演出が終わってからセーブしてください。");
    return;
  }
  const toSave = { ...gameState, __version: SAVE_VERSION };
  // 演出中だけ使う状態は保存しない。
  delete toSave.fx;

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

  if (!saved || saved.__version !== SAVE_VERSION) {
    updateMessage("旧47のセーブデータは、このひな型では使用できません。");
    return;
  }
  const def = getDefaultGameState();
  const merged = deepMerge(def, saved);
  // 過去に演出中に保存されたデータも、操作可能な状態で復元する。
  delete merged.fx;

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
  if (gameState.fx?.lockInput) {
    updateMessage("演出が終わってからセーブしてください。");
    return;
  }
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

window.addEventListener("resize", () => {
  renderNavigation();
  updateInventoryDisplay();
});

// ゲーム開始
preloadImages();
initGame();
