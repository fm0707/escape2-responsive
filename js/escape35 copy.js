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
const BASE_35 = USE_LOCAL_ASSETS ? "images/35" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/35";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I35 = (file) => `${BASE_35}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    desk: [I35("desk.webp")],
    sink: [I35("sink.webp")],
    stand: [I35("stand.webp")],
    door: [I35("door.webp")],
    jacketZoom: [I35("jacket_zoom.webp")],
    picOtogi: [I35("pic_otogi.webp")],
    textOtogi: [I35("text_otogi.webp")],
    lastPage: [I35("last_page.webp")],

    // end: [I35("end.webp")],
    // trueEnd: [I35("true_end.webp"), I35("true_end2.webp")],
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

    objectSaturn: I35("object_saturn.webp"),
    lightSaturn: I35("light_saturn.webp"),
    hammer: I35("hammer.webp"),
    key: I35("key.webp"),
    driver: I35("driver.webp"),
    glass: I35("glass.webp"),
    glassWater: I35("glass_water.webp"),
    glassWaterHot: I35("glass_water_hot.webp"),
    switchCover: I35("switch_cover.webp"),
    nameCard: I35("name_card.webp"),
    monshoMoon: I35("monsho_moon.webp"),
    box: I35("box.webp"),
    boxBroken: I35("box_broken.webp"),
    battery: I35("battery.webp"),
    potpourriSun: I35("potpourri_sun.webp"),
    interviewNote: I35("interview_note.webp"),
    interviewNoteEn: I35("interview_note_en.webp"),
    interviewNoteBack: I35("interview_note_back.webp"),
    map: I35("map.webp"),
    mapEn: I35("map_en.webp"),
    string: I35("string.webp"),
    loupe: I35("loupe.webp"),
  },
  modals: {
    clock: I35("modal_clock.webp"),
    tsubo: I35("modal_tsubo.webp"),
    tsuboGlass: I35("modal_tsubo_glass.webp"),
    tsuboWater: I35("modal_tsubo_water.webp"),
    objectSaturnCheck: I35("modal_object_saturn_check.webp"),
    putBattery: I35("modal_put_battery.webp"),
    picOtogi: I35("pic_otogi.webp"),
    moon0: I35("moon_0.webp"),
    moon1: I35("moon_1.webp"),
    moon2: I35("moon_2.webp"),
    moon3: I35("moon_3.webp"),
    moon4: I35("moon_4.webp"),
    moon5: I35("moon_5.webp"),
    moon6: I35("moon_6.webp"),
    moon7: I35("moon_7.webp"),
    barShort: I35("bar_short.webp"),
    barMiddle: I35("bar_middle.webp"),
    barLong: I35("bar_long.webp"),
    bell: I35("bell.webp"),
    bird: I35("bird.webp"),
    stone: I35("stone.webp"),
    rice: I35("rice.webp"),
    cup: I35("cup.webp"),
    pan: I35("pan.webp"),
    planets: I35("modal_planets.webp"),
    stringMoon: I35("modal_string_moon.webp"),
    stringTester: I35("modal_string_tester.webp"),
    mapN: I35("modal_map_n.webp"),
    hammerString: I35("modal_hammer_lie.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState35";
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
    currentRoom: "desk",
    openRooms: ["desk"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        foundKey: false,

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
  desk: {
    name: "机の前",
    description: "",
    clickableAreas: [
      {
        x: 26.4,
        y: 33.0,
        width: 20.5,
        height: 9.8,
        onClick: clickWrap(function () {
          changeRoom("picOtogi");
        }),
        description: "開いた本",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 6.6,
        y: 25.9,
        width: 17.1,
        height: 15.7,
        onClick: clickWrap(function () {}),
        description: "閉じた本",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 11.3,
        y: 0.6,
        width: 13.1,
        height: 15.6,
        onClick: clickWrap(
          function () {
            if (gameState.main.flags.isNight) {
              showObj(null, "", IMAGES.modals.stringMoon, "光る文字が浮かび上がっている");
            } else {
              updateMessage("黒い紙が貼られている");
            }
          },
          { allowAtNight: true },
        ),
        description: "黒塗りポスター左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 46.6,
        y: 2.1,
        width: 12.4,
        height: 15.6,
        onClick: clickWrap(
          function () {
            if (gameState.main.flags.isNight) {
              showObj(null, "", IMAGES.modals.stringTester, "光る文字が浮かび上がっている");
            } else {
              updateMessage("黒い紙が貼られている");
            }
          },
          { allowAtNight: true },
        ),
        description: "黒塗りポスター右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 27.4,
        y: 4.0,
        width: 16.0,
        height: 21.1,
        onClick: clickWrap(function () {
          updateMessage("どこかの村の写真だ");
        }),
        description: "土星村の写真",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 28.3,
        y: 23.6,
        width: 5.8,
        height: 5.6,
        onClick: clickWrap(function () {
          updateMessage("『土星村の写真』と書かれている");
        }),
        description: "土星村の写真メモ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 19.0,
        y: 17.2,
        width: 7.1,
        height: 7.1,
        onClick: clickWrap(function () {}),
        description: "小さいイラスト左",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 44.8,
        y: 19.1,
        width: 6.9,
        height: 8.0,
        onClick: clickWrap(function () {}),
        description: "小さいイラスト右",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 55.1,
        y: 22.6,
        width: 7.6,
        height: 18.0,
        onClick: clickWrap(function () {}),
        description: "レトロなライト",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 47.9,
        y: 28.2,
        width: 5.9,
        height: 11.1,
        onClick: clickWrap(function () {}),
        description: "羽ペン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 6.1,
        y: 47.6,
        width: 14.4,
        height: 5.8,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockDrawerLeftTop) {
            playDeskDrawerOpenFx("引き出し左上", "左上の引き出しが手前に開いた", () => {
              acquireItemOnce("foundPotpourriSun", "potpourriSun", "引き出しの中に何かある", IMAGES.items.potpourriSun, "ポプリを手に入れた");
            });
            return;
          }
          if (gameState.selectedItem === "key") {
            f.unlockDrawerLeftTop = true;
            clearUsingItem(true);
            playSE?.("se-gacha");
            showModal("引き出し左上", "引き出しの鍵を開けた", [{ text: "閉じる", action: "close" }]);
            updateMessage("引き出しの鍵を開けた");
            return;
          }
        }),
        description: "引き出し左上",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 6.1,
        y: 55.0,
        width: 14.4,
        height: 15.2,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockDrawerLeftBottom) {
            playDeskDrawerLeftBottomOpenFx(() => {
              acquireItemOnce("foundGlass", "glass", "引き出しの中に何かある", IMAGES.items.glass, "コップを手に入れた");
            });
            return;
          }
          showDeskDrawerLeftBottomPuzzle();
        }),
        description: "引き出し左下",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 22.3,
        y: 47.4,
        width: 26.7,
        height: 4.1,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockDrawerCenter) {
            playDeskDrawerCenterOpenFx(() => {
              acquireItemOnce("foundMonshoMoon", "monshoMoon", "引き出しの中に何かある", IMAGES.items.monshoMoon, "月の紋章が書かれた紙を手に入れた");
            });
            return;
          }
          showDeskDrawerCenterPuzzle();
        }),
        description: "引き出し中央",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 51.1,
        y: 47.9,
        width: 14.0,
        height: 5.7,
        onClick: clickWrap(function () {
          playDeskDrawerOpenFx("引き出し右上", "右上の引き出しが手前に開いた", () => {
            acquireItemOnce("foundMap", "map", "引き出しの中に何かある", IMAGES.items.map, "地図を手に入れた");
          });
        }),
        description: "引き出し右上",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 51.2,
        y: 55.2,
        width: 13.9,
        height: 6.3,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockDrawerRightMiddle) {
            playDeskDrawerOpenFx("引き出し右中", "右中の引き出しが手前に開いた", () => {
              acquireItemOnce("foundLoupe", "loupe", "引き出しの中に何かある", IMAGES.items.loupe, "学者の虫眼鏡を手に入れた");
            });
            return;
          }
          showDeskDrawerRightMiddlePuzzle();
        }),
        description: "引き出し右中",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 51.0,
        y: 63.3,
        width: 14.1,
        height: 7.0,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockDrawerRightBottom) {
            playDeskDrawerOpenFx("引き出し右下", "右下の引き出しが手前に開いた", () => {
              acquireItemOnce("foundInterviewNote", "interviewNote", "引き出しの中に何かある", IMAGES.items.interviewNote, "インタビューノートを手に入れた");
            });
            return;
          }
          showDeskDrawerRightBottomPuzzle();
        }),
        description: "引き出し右下",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 30.9,
        y: 80.5,
        width: 47.9,
        height: 17.7,
        onClick: clickWrap(function () {}),
        description: "ハッチ",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 75.8,
        y: 21.0,
        width: 12.8,
        height: 12.3,
        onClick: clickWrap(function () {
          acquireItemOnce("foundObjectSaturn", "objectSaturn", "土星モチーフのオブジェがある", IMAGES.items.objectSaturn, "土星モチーフのオブジェを手に入れた");
        }),
        description: "土星のオブジェ",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundObjectSaturn,
        item: { img: "objectSaturn", visible: () => !gameState.main.flags.foundObjectSaturn },
      },
      {
        x: 74.8,
        y: 55.6,
        width: 15.9,
        height: 15.4,
        onClick: clickWrap(function () {
          acquireItemOnce("foundHammer", "hammer", "木製のミニハンマーがある", IMAGES.items.hammer, "木製のミニハンマーを手に入れた");
        }),
        description: "木製のミニハンマー",
        zIndex: 5,
        usable: () => !gameState.main.flags.foundHammer,
        item: { img: "hammer", visible: () => !gameState.main.flags.foundHammer },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "光る文字",
        zIndex: 5,
        usable: () => false,
        item: { img: "string", visible: () => gameState.main.flags.timePhase === 2 },
      },
      {
        x: 0,
        y: 40.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("sink");
          },
          { allowAtNight: true },
        ),
        description: "机左、シンクへ",
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
            changeRoom("stand");
          },
          { allowAtNight: true },
        ),
        description: "机右、台へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  sink: {
    name: "シンクがある面",
    description: "",
    clickableAreas: [
      {
        x: 81.9,
        y: 4.0,
        width: 12.2,
        height: 12.5,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.planets, "絵が飾られている");
        }),
        description: "太陽系の抽象画",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 67.4,
        y: 43.8,
        width: 7.6,
        height: 7.8,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "glass") {
            playSinkWaterPourFx(() => {
              clearUsingItem(true);
              removeItem("glass");
              addItem("glassWaterHot");
              playSE?.("se-tea");
              updateMessage("コップにお湯をくんだ");
            });
            return;
          }
          updateMessage("お湯の蛇口だ");
        }),
        description: "お湯の蛇口",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 80.9,
        y: 43.8,
        width: 7.6,
        height: 7.5,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "glass") {
            playSinkWaterPourFx(() => {
              clearUsingItem(true);
              removeItem("glass");
              addItem("glassWater");
              playSE?.("se-tea");
              updateMessage("コップに水をくんだ");
            });
            return;
          }
          updateMessage("水の蛇口だ");
        }),
        description: "水の蛇口",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 70.0,
        y: 39.9,
        width: 2.8,
        height: 15.0,
        onClick: clickWrap(function () {}),
        description: "蛇口から出る水",
        zIndex: 5,
        usable: () => false,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 61.1,
        y: 52.8,
        width: 37.3,
        height: 6.2,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "glassWater" || gameState.selectedItem === "glassWaterHot") {
            const usedItem = gameState.selectedItem;
            clearUsingItem(true);
            removeItem(usedItem);
            addItem("glass");
            playSE?.("se-basha");
            updateMessage(usedItem === "glassWaterHot" ? "コップのお湯を捨てた" : "コップの水を捨てた");
            return;
          }
          updateMessage("流し台だ");
        }),
        description: "シンク台",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 24.6,
        y: 38.8,
        width: 24.3,
        height: 21.3,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "hammer") {
            f.boxBroken = true;
            playSE("se-punch");
            clearUsingItem(true);
            renderCanvasRoom();
            updateMessage("木箱をハンマーで壊した");
            return;
          }
          updateMessage("壊れかけた木箱がある");
        }),
        description: "箱",
        zIndex: 5,
        usable: () => !gameState.main.flags.boxBroken,
        item: { img: "box", visible: () => !gameState.main.flags.boxBroken },
      },
      {
        x: 21.0,
        y: 39.0,
        width: 30.3,
        height: 21.3,
        onClick: clickWrap(function () {
          updateMessage("壊れた木箱がある");
        }),
        description: "壊れた箱",
        zIndex: 5,
        usable: () => gameState.main.flags.boxBroken,
        item: { img: "boxBroken", visible: () => gameState.main.flags.boxBroken },
      },
      {
        x: 30.0,
        y: 47.0,
        width: 6.3,
        height: 6.3,
        onClick: clickWrap(function () {
          acquireItemOnce("foundBattery", "battery", "電池がある", IMAGES.items.battery, "電池を手に入れた");
        }),
        description: "電池",
        zIndex: 6,
        usable: () => gameState.main.flags.boxBroken && !gameState.main.flags.foundBattery,
        item: { img: "battery", visible: () => gameState.main.flags.boxBroken && !gameState.main.flags.foundBattery },
      },
      {
        x: 28.9,
        y: 65.2,
        width: 25.6,
        height: 26.9,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (f.unlockSinkCabinet) {
            playLockerDoorOpenFx(
              "キャビネット",
              () => {
                acquireItemOnce("foundDriver", "driver", "キャビネットの中に何かある", IMAGES.items.driver, "金色のクマ女神像ドライバーを手に入れた");
              },
              {
                roomId: "sink",
                hingeSide: "right",
                panelColors: ["#775335", "#775335", "#775335"],
                gripStyle: "roundTop",
                gripColor: "#A39C90",
              },
            );
            return;
          }
          showSinkCabinetPuzzle();
        }),
        description: "キャビネット",
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
            changeRoom("door");
          },
          { allowAtNight: true },
        ),
        description: "台左、ドアへ",
        zIndex: 5,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 93.6,
        y: 60.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("desk");
          },
          { allowAtNight: true },
        ),
        description: "台右、机へ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  door: {
    name: "ドアがある面",
    description: "",
    clickableAreas: [
      {
        x: 90.8,
        y: 31.8,
        width: 8.2,
        height: 12.7,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "driver") {
            f.removeCover = true;
            clearUsingItem(true);
            playSE?.("se-can");
            updateMessage("板のねじ止めを外した");
            renderCanvasRoom();
            return;
          }
          updateMessage("板がねじ止めされている。");
        }),
        description: "スイッチカバー",
        zIndex: 5,
        usable: () => !gameState.main.flags.removeCover,
        item: { img: "switchCover", visible: () => !gameState.main.flags.removeCover },
      },
      {
        x: 91.8,
        y: 33.1,
        width: 6.2,
        height: 10.4,
        onClick: clickWrap(
          function () {
            const f = gameState.main.flags || (gameState.main.flags = {});
            if (!f.removeCover) return;
            const nextIsNight = !(f.timePhase === 2 || f.isNight);
            f.timePhase = nextIsNight ? 2 : 0;
            f.isNight = nextIsNight;
            renderCanvasRoom?.();
            updateMessage(nextIsNight ? "部屋が暗くなった" : "部屋が明るくなった");
          },
          { allowAtNight: true },
        ),
        description: "スイッチ",
        zIndex: 5,
        usable: () => gameState.main.flags.removeCover,
        item: { img: "IMAGE_KEY", visible: () => gameState.main.flags.removeCover },
      },
      {
        x: 20.5,
        y: 31.3,
        width: 19.7,
        height: 39.1,
        onClick: clickWrap(function () {
          changeRoom("jacketZoom");
        }),
        description: "ジャケット",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 0.6,
        y: 18.9,
        width: 18.4,
        height: 18.8,
        onClick: clickWrap(function () {
          showObj(null, "時計だろうか？", IMAGES.modals.clock, "時計のようなものが壁に掛けられている");
        }),
        description: "時計",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 3.2,
        y: 66.9,
        width: 12.6,
        height: 32.5,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "glassWater" || gameState.selectedItem === "glassWaterHot") {
            const usedItem = gameState.selectedItem;
            const isHot = usedItem === "glassWaterHot";
            removeItem(usedItem);
            addItem("glass");
            clearUsingItem(true);
            playSE?.("se-tea");
            window._nextModal = () => {
              acquireItemOnce("foundKey", "key", "何かが浮き上がってきた", IMAGES.items.key, "カギを手に入れた");
            };
            showModal(
              `壺に${isHot ? "お湯" : "水"}を注いだ`,
              `
                <div style="text-align:center;">
                  <div class="modal-anim">
                    <img src="${IMAGES.modals.tsuboGlass}" alt="tsubo glass">
                    <img src="${IMAGES.modals.tsuboWater}" alt="tsubo water">
                  </div>
                  <div style="margin-top:12px;"></div>
                </div>
              `,
              [{ text: "閉じる", action: "close" }],
            );
            updateMessage(`壺に${isHot ? "お湯" : "水"}を注いだ`);
            return;
          }
          showObj(null, "細長い壺だ", IMAGES.modals.tsubo, "細長い壺だ。底には手が届かない…");
        }),
        description: "壺",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },

      {
        x: 45.5,
        y: 11.3,
        width: 38.3,
        height: 86.7,
        onClick: clickWrap(function () {}),
        description: "ドア",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 21.9,
        y: 9.1,
        width: 64.1,
        height: 10.4,
        onClick: clickWrap(function () {
          updateMessage("美味しいプリン　プリンボット、と書いてある");
        }),
        description: "看板上",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 29.4,
        y: 28.0,
        width: 48.6,
        height: 17.4,
        onClick: clickWrap(function () {
          updateMessage("プリンの品ぞろえが書かれている");
        }),
        description: "店奥貼り紙",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 70.8,
        y: 48.8,
        width: 16.3,
        height: 12.3,
        onClick: clickWrap(function () {
          showPuddingTabletPuzzle();
        }),
        description: "タブレット",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 14.6,
        y: 68.1,
        width: 18.1,
        height: 22.7,
        onClick: clickWrap(function () {
          updateMessage("キャラメルプリンが並んでいる");
        }),
        description: "キャラメルプリン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 34.4,
        y: 68.0,
        width: 18.9,
        height: 22.8,
        onClick: clickWrap(function () {
          updateMessage("イチゴプリンが並んでいる");
        }),
        description: "ストロベリープリン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 54.5,
        y: 67.9,
        width: 19.3,
        height: 22.9,
        onClick: clickWrap(function () {
          updateMessage("メロンプリンが並んでいる");
        }),
        description: "メロンプリン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 74.7,
        y: 67.9,
        width: 18.8,
        height: 22.7,
        onClick: clickWrap(function () {
          updateMessage("チョコプリンが並んでいる");
        }),
        description: "チョコプリン",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },

      {
        x: 43.1,
        y: 44.5,
        width: 20.2,
        height: 14.6,
        onClick: clickWrap(function () {
          const f = gameState.main.flags || (gameState.main.flags = {});
          if (gameState.selectedItem === "ticketPudding") {
            if (f.foundPuddingStrawberry) {
              updateMessage("「いらっしゃいませ」");
              return;
            }
            clearUsingItem(true);
            removeItem("ticketPudding");
            playSE?.("se-cyber");
            window._nextModal = {
              title: "はい。こちらをどうぞ",
              content: `<img src="${IMAGES.modals.roboPudding}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`,
              buttons: [
                {
                  text: "閉じる",
                  action: () => {
                    addItem("puddingStrawberry");
                    f.foundPuddingStrawberry = true;
                    updateMessage("いちごプリンを受け取った。");
                    closeModal();
                  },
                },
              ],
            };
            showModal("プリンロボにプリンの引換券を渡した", `<img src="${IMAGES.modals.roboTicket}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, [
              {
                text: "閉じる",
                action: () => {
                  playSE?.("se-hi-robo");
                  closeModal();
                },
              },
            ]);
            return;
          }
          if (gameState.selectedItem === "puddingStrawberry") {
            updateMessage("「おすすめのイチゴプリンです。とっても美味しいですよ」");
            return;
          }
          if (gameState.selectedItem === "onigiri") {
            updateMessage("「栄養豊富そうなおにぎりですね」");
            return;
          }
          if (f.foundPuddingStrawberry) {
            updateMessage("「当店のSNSアカウントも、良かったらフォローしてください。受付タブレットから見られますよ」");
            return;
          }
          updateMessage("「いらっしゃいませ」");
        }),
        description: "プリンロボ（クリック領域）",
        zIndex: 6,
        usable: () => !!gameState.main.flags.puddingRoboCalled,
        item: { img: "", visible: () => true },
      },
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        onClick: clickWrap(function () {}),
        description: "プリンロボ（表示領域、クリック不可）",
        zIndex: 5,
        usable: () => false,
        item: { img: "roboPuddingShop", visible: () => !!gameState.main.flags.puddingRoboCalled },
      },
      {
        x: 0,
        y: 50.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("stand");
          },
          { allowAtNight: true },
        ),
        description: "ドア左、台へ",
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
            changeRoom("sink");
          },
          { allowAtNight: true },
        ),
        description: "ドア右、流しへ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  stand: {
    name: "儀式台がある面",
    description: "",
    clickableAreas: [
      {
        x: 31.8,
        y: 0.6,
        width: 42.0,
        height: 40.3,
        onClick: clickWrap(function () {}),
        description: "窓",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 42.3,
        y: 58.2,
        width: 23.4,
        height: 15.8,
        onClick: clickWrap(function () {}),
        description: "儀式台、と書いてある紙",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 34.8,
        y: 48.7,
        width: 42.8,
        height: 8.6,
        onClick: clickWrap(function () {
          updateMessage("どのように使うのだろうか？");
        }),
        description: "儀式台",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 52.7,
        y: 33.1,
        width: 36.3,
        height: 29.0,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          updateMessage("おにぎり店の黒板だ");
        }),
        description: "おにぎりメニュー",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 6.1,
        y: 60.0,
        width: 17.8,
        height: 15.7,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          updateMessage("梅おにぎりが5個ならんでいる。");
        }),
        description: "梅おにぎり",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 29.8,
        y: 60.7,
        width: 18.4,
        height: 15.8,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          updateMessage("枝豆おにぎりは残り1つだ");
        }),
        description: "枝豆おにぎり",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 50.8,
        y: 63.8,
        width: 21.7,
        height: 12.1,
        onClick: clickWrap(function () {
          if (advanceOnigiriCoinSequence("kombu")) return;
          updateMessage("昆布おにぎりが3個並んでいる");
        }),
        description: "昆布おにぎり",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 73.5,
        y: 63.9,
        width: 23.9,
        height: 11.1,
        onClick: clickWrap(function () {
          if (advanceOnigiriCoinSequence("corn")) return;
          updateMessage("コーンおにぎりが3つ並んでいる");
        }),
        description: "コーンおにぎり",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 2.6,
        y: 78.9,
        width: 19.6,
        height: 8.5,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          updateMessage("梅、と書かれている");
        }),
        description: "梅ラベル",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 29.5,
        y: 79.2,
        width: 15.9,
        height: 7.9,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          updateMessage("枝豆、と書かれている");
        }),
        description: "枝豆ラベル",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 55.2,
        y: 79.0,
        width: 15.8,
        height: 7.8,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          updateMessage("昆布、と書かれている");
        }),
        description: "昆布ラベル",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 80.2,
        y: 79.5,
        width: 16.5,
        height: 7.7,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          updateMessage("コーン、と書かれている");
        }),
        description: "とうもろこしラベル",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 38.3,
        y: 55.3,
        width: 3.2,
        height: 2.9,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          acquireItemOnce("foundOnigiriCoin", "coin", "お皿の上にコインがある", IMAGES.items.coin, "クマコインを手に入れた", () => {
            const f = gameState.main.flags || (gameState.main.flags = {});
            f.showOnigiriCoin = false;
            renderCanvasRoom?.();
          });
        }),
        description: "お皿の上のコイン",
        zIndex: 5,
        usable: () => !!gameState.main.flags.showOnigiriCoin && !gameState.main.flags.foundOnigiriCoin,
        item: { img: "coin", visible: () => !!gameState.main.flags.showOnigiriCoin && !gameState.main.flags.foundOnigiriCoin },
      },
      {
        x: 34.4,
        y: 55.5,
        width: 11.3,
        height: 7.8,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          updateMessage("お皿がディスプレイされている");
        }),
        description: "お皿",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 25.1,
        y: 50.9,
        width: 7.2,
        height: 12.1,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          updateMessage("割りばしが立てられている");
        }),
        description: "割りばし",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 26.6,
        y: 31.4,
        width: 13.4,
        height: 6.2,
        onClick: clickWrap(function () {
          resetOnigiriCoinSequence();
          updateMessage("おにぎり型の飾りだ");
        }),
        description: "おにぎり型のかざり",
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
            changeRoom("desk");
          },
          { allowAtNight: true },
        ),
        description: "台左、机へ",
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
            changeRoom("door");
          },
          { allowAtNight: true },
        ),
        description: "台右、ドアへ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },

  jacketZoom: {
    name: "コート掛けに掛けられたジャケット",
    description: "",
    clickableAreas: [
      {
        x: 15.6,
        y: 73.2,
        width: 13.0,
        height: 12.0,
        onClick: clickWrap(function () {
          acquireItemOnce("foundNameCard", "nameCard", "名刺を見つけた", IMAGES.items.nameCard, "名刺を手に入れた");
        }),
        description: "ポケット",
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
            changeRoom("door");
          },
          { allowAtNight: true },
        ),
        description: "ジャケット戻る、ドア面へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },

  picOtogi: {
    name: "古い本",
    description: "",
    clickableAreas: [
      {
        x: 93.6,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("textOtogi");
          },
          { allowAtNight: true },
        ),
        description: "古い本1ページ目右、2ページ目へ",
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
            changeRoom("desk");
          },
          { allowAtNight: true },
        ),
        description: "古い本戻る、机面へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  textOtogi: {
    name: "古いの本文章ページ",
    description: "",
    clickableAreas: [
      {
        x: 7.0,
        y: 6.3,
        width: 86.3,
        height: 52.5,
        onClick: clickWrap(function () {
          updateMessage("さっぱり分からない…");
        }),
        description: "文章",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 9.1,
        y: 59.7,
        width: 34.4,
        height: 35.0,
        onClick: clickWrap(function () {
          updateMessage("付箋が貼られている。『土星村の伝承調査に有用。儀式の記述あり。』");
        }),
        description: "付箋",
        zIndex: 5,
        usable: () => true,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 93.6,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("lastPage");
          },
          { allowAtNight: true },
        ),
        description: "古い本2ページ目右、最後のページへ",
        zIndex: 5,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 0,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("picOtogi");
          },
          { allowAtNight: true },
        ),
        description: "古い本2ページ目左、1ページ目へ",
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
            changeRoom("desk");
          },
          { allowAtNight: true },
        ),
        description: "古い本2ページ目戻る、机面へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  lastPage: {
    name: "古い本の裏表紙の裏",
    description: "",
    clickableAreas: [
      {
        x: 0,
        y: 80.6,
        width: 6.4,
        height: 6.4,
        onClick: clickWrap(
          function () {
            changeRoom("picText");
          },
          { allowAtNight: true },
        ),
        description: "古い本の裏表紙の裏左、2ページ目へ",
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
            changeRoom("desk");
          },
          { allowAtNight: true },
        ),
        description: "古い本の裏表紙の裏戻る、机面へ",
        zIndex: 5,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  end: {
    name: "ノーマルエンド",
    description: "非常口から脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 39.8,
        y: 38.9,
        width: 35.1,
        height: 36.9,
        onClick: clickWrap(function () {
          updateMessage("満足そうだ。仕事はサボって良いのかな");
        }),
        description: "クマ妖精",
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

  trueEnd: {
    name: "トゥルーエンド",
    description: "脱出おめでとうございます！",
    clickableAreas: [
      {
        x: 32.2,
        y: 61.8,
        width: 38.7,
        height: 30.9,
        onClick: clickWrap(function () {
          updateMessage("家に帰ったら食べよう");
        }),
        description: "おにぎり",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 23.4,
        y: 35.6,
        width: 13.3,
        height: 16.0,
        onClick: clickWrap(function () {
          updateMessage("天然石ブースの店主が穏やかに手を振っている。");
        }),
        description: "狐店主",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 38.5,
        y: 40.7,
        width: 15.6,
        height: 13.7,
        onClick: clickWrap(function () {
          updateMessage("「さようなら」");
        }),
        description: "プリンロボ",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 55.3,
        y: 30.5,
        width: 12.1,
        height: 16.6,
        onClick: clickWrap(function () {
          updateMessage("「イベント参加してくれてありがとう」");
        }),
        description: "サステナブル店主",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 64.8,
        y: 48.5,
        width: 17.0,
        height: 10.9,
        onClick: clickWrap(function () {
          updateMessage("「またね」");
        }),
        description: "クマ妖精",
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: "IMAGE_KEY", visible: () => true },
      },
      {
        x: 24.1,
        y: 39.4,
        width: 55.0,
        height: 40.0,
        onClick: clickWrap(function () {
          updateMessage("変わったイベントだったな");
        }),
        description: "登場人物たち",
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

function travelToEndWithFootsteps() {
  const overlay = document.getElementById("roomEffectOverlay");
  if (hasItem("puddingStrawberry")) {
    removeItem("puddingStrawberry");
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
        gameState.trueEnd.flags.backgroundState = hasItem("onigiri") ? 1 : 0;
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
  changeRoom("desk");
  updateMessage("気が付くと机の前に立っていた。");
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
    changeBGM("sounds/34/haruno_otozure.mp3");
  } else if (roomId === "end") {
    changeBGM("sounds/34/Snack_time.mp3");
  } else {
    changeBGM("sounds/35/Storyteller.mp3");
  }

  // nav
  if (roomId === "eventArea" || roomId === "entrance" || roomId === "restArea" || roomId === "boothOnigiri" || roomId === "boothStone" || roomId === "boothSustainable" || roomId === "boothPudding") {
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
  drawEntranceShutterOpenFx(ctx, canvas, roomId);
  drawNewKeyholderGlowFx(ctx, canvas, roomId);
  drawPuddingTabletBlackoutFx(ctx, canvas, roomId);
  drawCelebrationSparkleFx(ctx, canvas, roomId);
  drawDeskDrawerOpenFx(ctx, canvas, roomId);
  drawSinkWaterPourFx(ctx, canvas, roomId);

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

function drawPuddingTabletBlackoutFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.puddingTabletBlackout;
  if (!fx || fx.roomId !== roomId) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const alpha = t <= 0.5 ? t / 0.5 : (1 - t) / 0.5;
  if (alpha <= 0) return;

  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${0.72 * alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawSinkWaterPourFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.sinkWaterPour;
  if (!fx || fx.roomId !== roomId) return;

  const rect = getAreaRectPx(roomId, fx.areaDescription, canvas);
  if (!rect) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const alpha = t < 0.2 ? t / 0.2 : t > 0.82 ? (1 - t) / 0.18 : 1;
  if (alpha <= 0) return;

  const streamW = Math.max(10, rect.w * 1.5);
  const streamX = rect.x + rect.w / 2 - streamW / 2;
  const streamY = rect.y;
  const streamH = rect.h;

  ctx.save();
  ctx.globalAlpha = 0.9 * alpha;

  const waterGrad = ctx.createLinearGradient(streamX, streamY, streamX, streamY + streamH);
  waterGrad.addColorStop(0, "rgba(205, 246, 255, 0.15)");
  waterGrad.addColorStop(0.2, "rgba(160, 232, 255, 0.9)");
  waterGrad.addColorStop(0.75, "rgba(96, 190, 240, 0.92)");
  waterGrad.addColorStop(1, "rgba(220, 248, 255, 0.2)");
  ctx.fillStyle = waterGrad;
  roundRect(ctx, streamX, streamY, streamW, streamH, Math.max(4, streamW * 0.28), true, false);

  ctx.globalAlpha = 0.5 * alpha;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(streamX + streamW * 0.22, streamY + 2, Math.max(2, streamW * 0.12), Math.max(6, streamH - 4));

  ctx.globalAlpha = 0.75 * alpha;
  ctx.fillStyle = "rgba(166, 232, 255, 0.72)";
  ctx.beginPath();
  ctx.ellipse(streamX + streamW / 2, streamY + streamH + 5, streamW * 0.58, Math.max(4, streamH * 0.1), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNewKeyholderGlowFx(ctx, canvas, roomId) {
  if (roomId !== "boothSustainable") return;
  const fx = gameState.fx?.newKeyholderGlow;
  if (!fx || fx.roomId !== "boothSustainable") return;

  const rect = getAreaRectPx("boothSustainable", "作ったキーホルダー", canvas);
  if (!rect) return;

  const pulse = (Math.sin(Date.now() / 220) + 1) / 2;
  const glowAlpha = 0.2 + pulse * 0.22;
  const strokeAlpha = 0.45 + pulse * 0.35;

  ctx.save();
  ctx.shadowColor = `rgba(255, 236, 140, ${0.45 + pulse * 0.25})`;
  ctx.shadowBlur = 8 + pulse * 12;
  ctx.fillStyle = `rgba(255, 236, 140, ${glowAlpha})`;
  roundRect(ctx, rect.x - 3, rect.y - 3, rect.w + 6, rect.h + 6, Math.max(4, rect.w * 0.35), true, false);
  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = `rgba(255,255,255,${strokeAlpha})`;
  roundRect(ctx, rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4, Math.max(3, rect.w * 0.3), false, true);
  ctx.restore();
}

function drawCelebrationSparkleFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.celebrationSparkle;
  if (!fx || fx.roomId !== roomId) return;

  const now = performance.now();
  const elapsed = now - fx.startedAt;
  const progress = Math.max(0, Math.min(1, elapsed / fx.duration));
  const fade = progress < 0.75 ? 1 : 1 - (progress - 0.75) / 0.25;
  if (fade <= 0) return;

  ctx.save();
  (fx.particles || []).forEach((p) => {
    const life = ((now - p.spawnAt) % p.life) / p.life;
    const y = ((p.y0 + life * p.travel) % (canvas.height + 40)) - 20;
    const alpha = (0.25 + (1 - life) * 0.75) * fade;
    const size = p.size * (0.85 + Math.sin((life + p.phase) * Math.PI * 2) * 0.18);

    ctx.globalAlpha = alpha;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10 + size * 1.8;
    ctx.translate(p.x, y);
    ctx.rotate((life + p.phase) * Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const r1 = size;
      const r2 = size * 0.34;
      ctx.lineTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
      ctx.lineTo(Math.cos(angle + Math.PI / 4) * r2, Math.sin(angle + Math.PI / 4) * r2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });
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

function openEntranceShutter() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  const fx = gameState.fx || (gameState.fx = {});
  if (f.unlockEntranceShutter || fx.lockInput || fx.entranceShutterOpen) return;
  if (gameState.currentRoom !== "entrance") return;

  removeItem("key");
  f.unlockEntranceShutter = true;
  fx.lockInput = true;
  fx.entranceShutterOpen = {
    roomId: "entrance",
    progress: 0,
  };

  playSE?.("se-shutter-open");
  renderCanvasRoom?.();

  const duration = 700;
  const start = performance.now();
  const tick = (now) => {
    const currentFx = gameState.fx?.entranceShutterOpen;
    if (!currentFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      renderCanvasRoom?.();
      return;
    }

    const t = Math.min(1, (now - start) / duration);
    currentFx.progress = t;
    renderCanvasRoom?.();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.entranceShutterOpen;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
    updateMessage("シャッターが開いた。");
  };

  requestAnimationFrame(tick);
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

  ctx.save();

  ctx.fillStyle = cavityColor;
  roundRect(ctx, rect.x + insetX, rect.y + insetY, rect.w - insetX * 2, Math.min(rect.h - insetY * 2, cavityH), Math.max(2, rect.h * 0.08), true, false);

  ctx.strokeStyle = cavityStroke;
  ctx.lineWidth = 1;
  roundRect(ctx, rect.x + insetX, rect.y + insetY, rect.w - insetX * 2, Math.min(rect.h - insetY * 2, cavityH), Math.max(2, rect.h * 0.08), false, true);

  const sideColor = ctx.createLinearGradient(rect.x, frontY, rect.x, frontY + rect.h);
  sideColor.addColorStop(0, "#ab7650");
  sideColor.addColorStop(1, "#a06d49");
  ctx.fillStyle = sideColor;
  ctx.fillRect(rect.x + rect.w * 0.06, frontY + rect.h * 0.55, rect.w * 0.88, Math.max(6, rect.h * 0.12));

  ctx.shadowColor = "rgba(0,0,0,0.28)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = Math.max(1, rect.h * 0.05);
  ctx.fillStyle = "#996641";
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
  const gripInset = Math.max(2, gripW * 0.16);
  const gripFlare = Math.max(1.5, gripW * 0.1);
  const gripBottomY = gripY + gripH;
  const gripMidY = gripY + gripH * 0.28;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1.2, rect.h * 0.045);
  ctx.strokeStyle = "#4C4241";
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
    panelColors: options.panelColors || null,
    gripStyle: options.gripStyle || null,
    gripColor: options.gripColor || null,
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

function playDeskDrawerCenterOpenFx(onDone) {
  playDeskDrawerOpenFx("引き出し中央", "中央の引き出しが手前に開いた", onDone);
}

function playDeskDrawerLeftBottomOpenFx(onDone) {
  playDeskDrawerOpenFx("引き出し左下", "左下の引き出しが手前に開いた", onDone);
}

function playDeskDrawerOpenFx(areaDescription, message, onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (gameState.currentRoom !== "desk" || fx.lockInput || fx.deskDrawerOpen) {
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
      desc: "お家に帰ろう",
    },

    end: {
      title: "🍮 NORMAL END ",
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfY_B46cEIAsUcV0teueSLyhd_UWzNhEJ7N762mu_6QG9DbCw/viewform";
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

function showPuddingMannerBadEnd() {
  const content = `
    <div style="text-align:center;">
      <img src="${IMAGES.modals.badend}" alt="bad end" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
      <div>あなたはマナー違反にもかかわらず、プリンを立ち食いした。<br>スタッフが非難するようにこちらを見ている…</div>
    </div>
  `;
  pauseBGM();
  playSE("se-zun");
  showModal("【BAD END】プリンは休憩エリアで。", content, [{ text: "最初から", action: "restart" }]);
  updateMessage("BAD END: プリンを立ち食いしてしまった");
}

function resetOnigiriCoinSequence() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  f.onigiriCoinSequence = [];
}

function advanceOnigiriCoinSequence(kind) {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.unlockEventAreaBoxRight || f.showOnigiriCoin || f.foundOnigiriCoin) {
    resetOnigiriCoinSequence();
    return false;
  }

  const target = ["corn", "kombu", "corn", "kombu"];
  const current = Array.isArray(f.onigiriCoinSequence) ? [...f.onigiriCoinSequence] : [];
  const expected = target[current.length];

  if (kind === expected) {
    current.push(kind);
  } else if (kind === target[0]) {
    current.length = 0;
    current.push(kind);
  } else {
    current.length = 0;
  }

  f.onigiriCoinSequence = current;
  if (current.length === target.length) {
    f.showOnigiriCoin = true;
    f.onigiriCoinSequence = [];
    playSE?.("se-can");
    renderCanvasRoom?.();
    updateMessage("チリーン。お皿の上にコインが現れた。");
    return true;
  }
  return false;
}

function showEventAreaBoxLeftPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockEventAreaBoxLeft) {
    updateMessage("1の箱のロックは解除されている");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="eventAreaBoxLeftGrid" style="display:grid; grid-template-columns:repeat(4, 74px); gap:12px; justify-content:center;"></div>
      <button id="eventAreaBoxLeftOk" class="ok-btn" type="button">OK</button>
      <div id="eventAreaBoxLeftHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("1の箱のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const grid = document.getElementById("eventAreaBoxLeftGrid");
    const okBtn = document.getElementById("eventAreaBoxLeftOk");
    const hintEl = document.getElementById("eventAreaBoxLeftHint");
    if (!grid || !okBtn || !hintEl) return;

    const cycle = ["lt", "lb", "rb", "rt"];
    const target = ["lt", "rb", "lb", "rt"];
    const state = [-1, -1, -1, -1];

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
      btn.setAttribute("aria-label", `図形 ${i + 1}`);

      const img = document.createElement("img");
      img.alt = "";
      img.style.width = "48px";
      img.style.height = "48px";
      img.style.objectFit = "contain";
      img.style.display = "block";
      img.style.opacity = "0";
      btn.appendChild(img);

      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % cycle.length;
        playSE?.("se-pi");
        repaint();
      });

      grid.appendChild(btn);
      return { img };
    });

    const repaint = () => {
      cells.forEach(({ img }, i) => {
        const key = cycle[state[i]];
        if (key) {
          img.src = IMAGES.items[key];
          img.style.opacity = "1";
        } else {
          img.removeAttribute("src");
          img.style.opacity = "0";
        }
      });
      hintEl.textContent = "";
    };

    okBtn.addEventListener("click", () => {
      const current = state.map((idx) => cycle[idx]);
      const ok = target.every((shape, idx) => current[idx] === shape);
      if (ok) {
        f.unlockEventAreaBoxLeft = true;
        markProgress?.("unlock_event_area_box_left");
        playSE?.("se-clear");
        window._nextModal = {
          title: "解除",
          content: "1の箱のロックを解除した",
          buttons: [
            {
              text: "閉じる",
              action: () => {
                window._nextModal = () => {
                  acquireItemOnce("foundPenLightEmpty", "penLightEmpty", "ペンライトが入っていた", IMAGES.items.penLightEmpty, "空のペンライトを手に入れた");
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

function showEventAreaBoxMiddlePuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockEventAreaBoxMiddle) {
    updateMessage("2の箱のロックは解除されている");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="eventAreaBoxMiddleGrid" style="display:grid; grid-template-columns:repeat(2, minmax(120px, 1fr)); gap:10px; width:min(100%, 360px);"></div>
      <button id="eventAreaBoxMiddleOk" class="ok-btn" type="button">OK</button>
      <div id="eventAreaBoxMiddleHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("2の箱のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const grid = document.getElementById("eventAreaBoxMiddleGrid");
    const okBtn = document.getElementById("eventAreaBoxMiddleOk");
    const hintEl = document.getElementById("eventAreaBoxMiddleHint");
    if (!grid || !okBtn || !hintEl) return;

    const targets = { heart: 3, comment: 2, plane: 0, marker: 2 };
    const config = [
      { key: "heart", label: "ハート" },
      { key: "comment", label: "コメント" },
      { key: "plane", label: "紙飛行機" },
      { key: "marker", label: "保存" },
    ];
    const state = { heart: 0, comment: 0, plane: 0, marker: 0 };
    const cells = config.map(({ key, label }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.minHeight = "132px";
      btn.style.padding = "10px";
      btn.style.display = "flex";
      btn.style.flexDirection = "column";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "space-between";
      btn.style.gap = "8px";
      btn.style.borderRadius = "10px";
      btn.style.border = "2px solid #e2e2e2";
      btn.style.background = "#ffffff";
      btn.style.width = "100%";
      btn.setAttribute("aria-label", `${label} ${key}`);

      const title = document.createElement("div");
      title.textContent = label;
      title.style.fontSize = "0.9em";
      title.style.fontWeight = "700";
      title.style.pointerEvents = "none";
      btn.appendChild(title);

      const icons = document.createElement("div");
      icons.style.display = "grid";
      icons.style.gridTemplateColumns = "repeat(3, 1fr)";
      icons.style.gap = "6px";
      icons.style.width = "100%";
      icons.style.minHeight = "52px";
      icons.style.alignItems = "center";
      icons.style.justifyItems = "center";
      icons.style.pointerEvents = "none";
      btn.appendChild(icons);

      btn.addEventListener("click", () => {
        state[key] = (state[key] + 1) % 7;
        playSE?.("se-pi");
        repaint();
      });

      grid.appendChild(btn);
      return { key, btn, icons };
    });

    const repaint = () => {
      cells.forEach(({ key, btn, icons }) => {
        icons.innerHTML = "";
        const amount = state[key];
        for (let i = 0; i < amount; i += 1) {
          const img = document.createElement("img");
          img.alt = "";
          img.src = IMAGES.modals[key];
          img.style.width = "24px";
          img.style.height = "24px";
          img.style.objectFit = "contain";
          img.style.pointerEvents = "none";
          icons.appendChild(img);
        }
        btn.style.borderColor = amount === targets[key] ? "#7ecb63" : "#e2e2e2";
        btn.style.background = amount === targets[key] ? "#f3fff0" : "#ffffff";
      });
      hintEl.textContent = "";
    };

    okBtn.addEventListener("click", () => {
      const ok = Object.keys(targets).every((key) => state[key] === targets[key]);
      if (ok) {
        f.unlockEventAreaBoxMiddle = true;
        markProgress?.("unlock_event_area_box_middle");
        playSE?.("se-clear");
        window._nextModal = {
          title: "解除",
          content: "2の箱のロックを解除した",
          buttons: [
            {
              text: "閉じる",
              action: () => {
                window._nextModal = () => {
                  acquireItemOnce("foundCardMystery", "cardMystery", "カードが入っていた", IMAGES.items.cardMystery, "謎のカードを手に入れた");
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

function showEventAreaBoxRightPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (!f.unlockEventAreaBoxMiddle) {
    updateMessage("2の箱がアンロックするまで起動しないようだ");
    return;
  }
  if (f.unlockEventAreaBoxRight) {
    updateMessage("3の箱のロックは解除されている");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div style="font-size:0.96em; color:#61523f; text-align:center;">謎カードから導かれる単語を入力</div>
      <input id="eventAreaBoxRightInput" class="puzzle-input" type="text" maxlength="12" placeholder="WORD" autocapitalize="off" autocomplete="off" spellcheck="false" style="width:220px; text-align:center; font-size:1.15em; letter-spacing:0.08em;">
      <button id="eventAreaBoxRightOk" class="ok-btn" type="button">OK</button>
      <div id="eventAreaBoxRightHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("3の箱のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const inputEl = document.getElementById("eventAreaBoxRightInput");
    const okBtn = document.getElementById("eventAreaBoxRightOk");
    const hintEl = document.getElementById("eventAreaBoxRightHint");
    if (!inputEl || !okBtn || !hintEl) return;

    const submit = () => {
      const answer = String(inputEl.value || "")
        .trim()
        .toLowerCase();
      if (answer === "moss") {
        f.unlockEventAreaBoxRight = true;
        markProgress?.("unlock_event_area_box_right");
        playSE?.("se-fanfale");
        window._nextModal = {
          title: "3の箱のロックを解除した",
          content: `
            <div style="text-align:center;">
              <div style="margin-bottom:16px;">えっ！あの人が…</div>
              <img src="${IMAGES.modals.bearShocked}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
            </div>
          `,
          buttons: [
            {
              text: "閉じる",
              action: () => {
                window._nextModal = () => {
                  acquireItemOnce("foundKey", "key", "鍵が入っていた", IMAGES.items.key, "鍵を手に入れた");
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
    };

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    });
    okBtn.addEventListener("click", submit);
    inputEl.focus();
  }, 0);
}

function showRestAreaCabinetPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockRestAreaCabinet) {
    updateMessage("キャビネットのロックは外れている。");
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <!--<img src="${IMAGES.modals.cabinet}" alt="" style="max-width:320px; width:100%; height:auto; object-fit:contain; display:block; margin:0 auto 2px;">-->
      <div id="restAreaCabinetDigits" style="display:flex; gap:14px; justify-content:center;">
        <button id="restAreaCabinetDigit0" type="button" class="nav-btn" aria-label="1桁目" style="width:72px; height:72px; border-radius:8px; border:2px solid #3b3b3b; background:#000; color:#fff; font-size:34px; font-weight:bold;">0</button>
        <button id="restAreaCabinetDigit1" type="button" class="nav-btn" aria-label="2桁目" style="width:72px; height:72px; border-radius:8px; border:2px solid #8d8e8e; background:#a7a8a8; color:#1f1f1f; font-size:34px; font-weight:bold;">0</button>
        <button id="restAreaCabinetDigit2" type="button" class="nav-btn" aria-label="3桁目" style="width:72px; height:72px; border-radius:8px; border:2px solid #d8d8d8; background:#fff; color:#111; font-size:34px; font-weight:bold;">0</button>
      </div>
      <button id="restAreaCabinetOk" class="ok-btn" type="button">OK</button>
      <div id="restAreaCabinetHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネットのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const digitBtns = [0, 1, 2].map((i) => document.getElementById(`restAreaCabinetDigit${i}`));
    const okBtn = document.getElementById("restAreaCabinetOk");
    const hintEl = document.getElementById("restAreaCabinetHint");
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
      if (state.join("") === "371") {
        f.unlockRestAreaCabinet = true;
        markProgress?.("unlock_rest_area_cabinet");
        playSE?.("se-gacha");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("キャビネットのロックが外れた。");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showPuddingTabletPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockPuddingTablet) {
    showModal("タブレット", "店舗のSNSが表示されている。見てみますか？", [
      {
        text: "はい",
        action: () => {
          closeModal();
          changeRoom("insta1");
        },
      },
      { text: "いいえ", action: "close" },
    ]);
    return;
  }

  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="puddingTabletGrid" style="display:grid; grid-template-columns:repeat(3, 68px); gap:10px; justify-content:center;"></div>
      <button id="puddingTabletCall" class="ok-btn" type="button">呼び出し</button>
      <div id="puddingTabletHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("タブレット", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const grid = document.getElementById("puddingTabletGrid");
    const callBtn = document.getElementById("puddingTabletCall");
    const hintEl = document.getElementById("puddingTabletHint");
    if (!grid || !callBtn || !hintEl) return;

    const target = [0, 2, 4, 5];
    const lit = Array.from({ length: 9 }, () => false);
    const cells = Array.from({ length: 9 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "68px";
      btn.style.height = "68px";
      btn.style.borderRadius = "8px";
      btn.style.border = "2px solid #9b9b9b";
      btn.style.background = "#8e8e8e";
      btn.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.18)";
      btn.setAttribute("aria-label", `マス ${i + 1}`);
      btn.addEventListener("click", () => {
        lit[i] = !lit[i];
        playSE?.("se-pi");
        repaint();
      });
      grid.appendChild(btn);
      return btn;
    });

    const repaint = () => {
      cells.forEach((btn, i) => {
        if (lit[i]) {
          btn.style.background = "radial-gradient(circle at 50% 45%, #fffef7 0%, #fff9db 35%, #fff2b8 68%, #f7e7a0 100%)";
          btn.style.borderColor = "#fff3c8";
          btn.style.boxShadow = "0 0 14px rgba(255, 243, 186, 0.82), inset 0 0 10px rgba(255,255,255,0.68)";
        } else {
          btn.style.background = "#8e8e8e";
          btn.style.borderColor = "#9b9b9b";
          btn.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.18)";
        }
      });
      hintEl.textContent = "";
    };

    callBtn.addEventListener("click", () => {
      const ok = target.every((idx) => lit[idx]) && lit.filter(Boolean).length === target.length;
      if (ok) {
        f.unlockPuddingTablet = true;
        markProgress?.("unlock_pudding_tablet");
        playSE?.("se-door-ring");
        closeModal();
        playPuddingTabletBlackoutFx(() => {
          f.puddingRoboCalled = true;
          renderCanvasRoom?.();
          updateMessage("プリンロボを呼び出した。");
        });
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "反応がない";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showDeskDrawerCenterPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockDrawerCenter) {
    updateMessage("中央の引き出しのロックは解除されている");
    return;
  }

  const cycle = ["a", "c", "e", "f", "h", "i", "k", "m", "n", "o", "r"];
  const target = ["m", "o", "o", "n"];
  const state = [0, 0, 0, 0];
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="deskDrawerCenterGrid" style="display:grid; grid-template-columns:repeat(4, 64px); gap:12px; justify-content:center;"></div>
      <button id="deskDrawerCenterOk" class="ok-btn" type="button">OK</button>
      <div id="deskDrawerCenterHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("引き出し中央のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const grid = document.getElementById("deskDrawerCenterGrid");
    const okBtn = document.getElementById("deskDrawerCenterOk");
    const hintEl = document.getElementById("deskDrawerCenterHint");
    if (!grid || !okBtn || !hintEl) return;

    const cells = Array.from({ length: 4 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "64px";
      btn.style.height = "64px";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.borderRadius = "8px";
      btn.style.border = "2px solid #d9d9d9";
      btn.style.background = "#ffffff";
      btn.style.color = "#222";
      btn.style.fontSize = "30px";
      btn.style.fontWeight = "700";
      btn.style.textTransform = "lowercase";
      btn.setAttribute("aria-label", `${i + 1}文字目`);

      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % cycle.length;
        playSE?.("se-pi");
        repaint();
      });

      grid.appendChild(btn);
      return btn;
    });

    const repaint = () => {
      cells.forEach((btn, i) => {
        const letter = cycle[state[i]];
        btn.textContent = letter;
        btn.style.borderColor = "#d9d9d9";
        btn.style.background = "#ffffff";
      });
      hintEl.textContent = "";
    };

    okBtn.addEventListener("click", () => {
      const answer = state.map((idx) => cycle[idx]);
      const ok = target.every((letter, idx) => answer[idx] === letter);
      if (ok) {
        f.unlockDrawerCenter = true;
        markProgress?.("unlock_drawer_center");
        playSE?.("se-clear");
        closeModal();
        updateMessage("中央の引き出しのロックが外れた");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showDeskDrawerLeftBottomPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockDrawerLeftBottom) {
    updateMessage("左下の引き出しのロックは解除されている");
    return;
  }

  const cycle = Array.from({ length: 10 }, (_, i) => `moon${i}`);
  const state = [0, 0];
  const target = ["moon6", "moon4"];
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="deskDrawerLeftBottomGrid" style="display:flex; align-items:center; justify-content:center; gap:14px;">
        <button id="deskDrawerLeftBottomMoon0" type="button" class="nav-btn" aria-label="左の月" style="width:88px; height:88px; border-radius:10px; border:2px solid #e2e2e2; background:#fff; display:grid; place-items:center; padding:0;"></button>
        <div style="font-size:34px; font-weight:700; line-height:1; color:#5c5145;">:</div>
        <button id="deskDrawerLeftBottomMoon1" type="button" class="nav-btn" aria-label="右の月" style="width:88px; height:88px; border-radius:10px; border:2px solid #e2e2e2; background:#fff; display:grid; place-items:center; padding:0;"></button>
      </div>
      <button id="deskDrawerLeftBottomOk" class="ok-btn" type="button">OK</button>
      <div id="deskDrawerLeftBottomHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("引き出し左下のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const buttons = [0, 1].map((i) => document.getElementById(`deskDrawerLeftBottomMoon${i}`));
    const okBtn = document.getElementById("deskDrawerLeftBottomOk");
    const hintEl = document.getElementById("deskDrawerLeftBottomHint");
    if (buttons.some((btn) => !btn) || !okBtn || !hintEl) return;

    const imgs = buttons.map((btn, i) => {
      const img = document.createElement("img");
      img.alt = "";
      img.style.width = "58px";
      img.style.height = "58px";
      img.style.objectFit = "contain";
      img.style.display = "block";
      btn.appendChild(img);
      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % cycle.length;
        playSE?.("se-pi");
        repaint();
      });
      return img;
    });

    const repaint = () => {
      imgs.forEach((img, i) => {
        img.src = IMAGES.modals[cycle[state[i]]];
      });
      hintEl.textContent = "";
    };

    okBtn.addEventListener("click", () => {
      const answer = state.map((idx) => cycle[idx]);
      const ok = target.every((moon, idx) => answer[idx] === moon);
      if (ok) {
        f.unlockDrawerLeftBottom = true;
        playSE?.("se-clear");
        closeModal();
        updateMessage("左下の引き出しのロックが外れた");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showDeskDrawerRightBottomPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockDrawerRightBottom) {
    updateMessage("右下の引き出しのロックは解除されている");
    return;
  }

  const cycle = ["barShort", "barMiddle", "barLong"];
  const target = ["barShort", "barMiddle", "barLong", "barMiddle"];
  const state = [0, 0, 0, 0];
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="deskDrawerRightBottomGrid" style="display:grid; grid-template-columns:repeat(4, 72px); gap:12px; justify-content:center;"></div>
      <button id="deskDrawerRightBottomOk" class="ok-btn" type="button">OK</button>
      <div id="deskDrawerRightBottomHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("引き出し右下のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const grid = document.getElementById("deskDrawerRightBottomGrid");
    const okBtn = document.getElementById("deskDrawerRightBottomOk");
    const hintEl = document.getElementById("deskDrawerRightBottomHint");
    if (!grid || !okBtn || !hintEl) return;

    const imgs = Array.from({ length: 4 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "72px";
      btn.style.height = "72px";
      btn.style.borderRadius = "10px";
      btn.style.border = "2px solid #e2e2e2";
      btn.style.background = "#fff";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.padding = "0";
      btn.setAttribute("aria-label", `${i + 1}本目`);

      const img = document.createElement("img");
      img.alt = "";
      img.style.width = "46px";
      img.style.height = "46px";
      img.style.objectFit = "contain";
      img.style.display = "block";
      btn.appendChild(img);

      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % cycle.length;
        playSE?.("se-pi");
        repaint();
      });

      grid.appendChild(btn);
      return img;
    });

    const repaint = () => {
      imgs.forEach((img, i) => {
        img.src = IMAGES.modals[cycle[state[i]]];
      });
      hintEl.textContent = "";
    };

    okBtn.addEventListener("click", () => {
      const answer = state.map((idx) => cycle[idx]);
      const ok = target.every((bar, idx) => answer[idx] === bar);
      if (ok) {
        f.unlockDrawerRightBottom = true;
        playSE?.("se-clear");
        closeModal();
        updateMessage("右下の引き出しのロックが外れた");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function showDeskDrawerRightMiddlePuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockDrawerRightMiddle) {
    updateMessage("右中の引き出しのロックは解除されている");
    return;
  }

  const target = ["down", "left", "up", "down", "left", "right"];
  const pressed = [];
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="deskDrawerRightMiddlePad" style="display:grid; grid-template-columns:repeat(3, 66px); grid-template-rows:repeat(3, 66px); gap:10px; grid-template-areas:'. up .' 'left center right' '. down .'; justify-content:center;"></div>
      <button id="deskDrawerRightMiddleOk" class="ok-btn" type="button">OK</button>
      <div id="deskDrawerRightMiddleHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("引き出し右中のロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const pad = document.getElementById("deskDrawerRightMiddlePad");
    const okBtn = document.getElementById("deskDrawerRightMiddleOk");
    const hintEl = document.getElementById("deskDrawerRightMiddleHint");
    if (!pad || !okBtn || !hintEl) return;

    const dirs = [
      { key: "up", area: "up" },
      { key: "left", area: "left" },
      { key: "right", area: "right" },
      { key: "down", area: "down" },
    ];

    dirs.forEach(({ key, area }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.gridArea = area;
      btn.style.width = "66px";
      btn.style.height = "66px";
      btn.style.borderRadius = "10px";
      btn.style.border = "2px solid #67b85a";
      btn.style.background = "#88d47a";
      btn.style.color = "#154212";
      btn.style.fontSize = "30px";
      btn.style.fontWeight = "700";
      btn.addEventListener("click", () => {
        pressed.push(key);
        if (pressed.length > target.length) pressed.shift();
        playSE?.("se-pi");
        hintEl.textContent = "";
      });
      pad.appendChild(btn);
    });

    okBtn.addEventListener("click", () => {
      const ok = pressed.length === target.length && target.every((dir, idx) => pressed[idx] === dir);
      if (ok) {
        f.unlockDrawerRightMiddle = true;
        playSE?.("se-clear");
        closeModal();
        updateMessage("右中の引き出しのロックが外れた");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });
  }, 0);
}

function showSinkCabinetPuzzle() {
  const f = gameState.main.flags || (gameState.main.flags = {});
  if (f.unlockSinkCabinet) {
    updateMessage("キャビネットのロックは解除されている");
    return;
  }

  const cycle = ["bird", "pan", "bell", "cup", "rice", "stone"];
  const target = ["bell", "stone", "rice"];
  const state = [0, 0, 0];
  const content = `
    <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; gap:14px;">
      <div id="sinkCabinetGrid" style="display:flex; flex-direction:column; gap:12px; align-items:center;"></div>
      <button id="sinkCabinetOk" class="ok-btn" type="button">OK</button>
      <div id="sinkCabinetHint" style="min-height:1.2em; font-size:0.92em; text-align:center;"></div>
    </div>
  `;

  showModal("キャビネットのロック", content, [{ text: "閉じる", action: "close" }]);

  setTimeout(() => {
    const grid = document.getElementById("sinkCabinetGrid");
    const okBtn = document.getElementById("sinkCabinetOk");
    const hintEl = document.getElementById("sinkCabinetHint");
    if (!grid || !okBtn || !hintEl) return;

    const imgs = Array.from({ length: 3 }, (_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-btn";
      btn.style.width = "88px";
      btn.style.height = "88px";
      btn.style.borderRadius = "10px";
      btn.style.border = "2px solid #bfe9f5";
      btn.style.background = "#e8f9ff";
      btn.style.display = "grid";
      btn.style.placeItems = "center";
      btn.style.padding = "0";
      btn.setAttribute("aria-label", `${i + 1}段目`);

      const img = document.createElement("img");
      img.alt = "";
      img.style.width = "54px";
      img.style.height = "54px";
      img.style.objectFit = "contain";
      img.style.display = "block";
      btn.appendChild(img);

      btn.addEventListener("click", () => {
        state[i] = (state[i] + 1) % cycle.length;
        playSE?.("se-pi");
        repaint();
      });

      grid.appendChild(btn);
      return img;
    });

    const repaint = () => {
      imgs.forEach((img, i) => {
        img.src = IMAGES.modals[cycle[state[i]]];
      });
      hintEl.textContent = "";
    };

    okBtn.addEventListener("click", () => {
      const answer = state.map((idx) => cycle[idx]);
      const ok = target.every((item, idx) => answer[idx] === item);
      if (ok) {
        f.unlockSinkCabinet = true;
        playSE?.("se-clear");
        closeModal();
        updateMessage("キャビネットのロックが外れた");
        return;
      }

      playSE?.("se-error");
      hintEl.textContent = "違うようだ";
      screenShake?.(document.getElementById("modalContent"), 120, "fx-shake");
    });

    repaint();
  }, 0);
}

function playPuddingTabletBlackoutFx(onDone) {
  const fx = gameState.fx || (gameState.fx = {});
  if (gameState.currentRoom !== "boothPudding") {
    onDone?.();
    return;
  }
  if (fx.lockInput || fx.puddingTabletBlackout) {
    onDone?.();
    return;
  }

  fx.lockInput = true;
  fx.puddingTabletBlackout = {
    roomId: "boothPudding",
    progress: 0,
  };
  renderCanvasRoom?.();

  const duration = 420;
  const start = performance.now();
  const tick = (now) => {
    const curFx = gameState.fx?.puddingTabletBlackout;
    if (!curFx) {
      if (gameState.fx) gameState.fx.lockInput = false;
      onDone?.();
      return;
    }

    const t = Math.min(1, (now - start) / duration);
    curFx.progress = t;
    renderCanvasRoom?.();

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    if (gameState.fx) {
      delete gameState.fx.puddingTabletBlackout;
      gameState.fx.lockInput = false;
    }
    renderCanvasRoom?.();
    onDone?.();
  };

  requestAnimationFrame(tick);
}

function showRestAreaPuddingEatPrompt() {
  showModal("プリンを食べますか？", "ここで飲食ができそうだ。", [
    {
      text: "はい",
      action: () => {
        const f = gameState.main.flags || (gameState.main.flags = {});
        removeItem("puddingStrawberry");
        addItem("huta");
        window._nextModal = {
          title: "容器を洗った",
          content: `<img src="${IMAGES.modals.wash}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`,
          buttons: [{ text: "閉じる", action: "close" }],
          before: () => {
            f.washedPuddingJar = true;
            playSE?.("se-jaguchi");
            renderCanvasRoom?.();
          },
        };
        showModal(
          "プリンを食べた。",
          `
            <div class="modal-anim">
              <img src="${IMAGES.modals.puddingEat}" alt="pudding eat 1">
              <img src="${IMAGES.modals.puddingEat2}" alt="pudding eat 2">
            </div>
          `,
          [
            {
              text: "閉じる",
              action: "close",
            },
          ],
        );
        updateMessage("プリンを食べた");
      },
    },
    { text: "いいえ", action: "close" },
  ]);
}

function openRestAreaCabinet() {
  playLockerDoorOpenFx(
    "キャビネット扉",
    () => {
      acquireItemOnce("foundBattery", "battery", "電池が入っていた", IMAGES.items.battery, "電池を手に入れた");
    },
    { roomId: "restArea", hingeSide: "right", panelColors: ["#6f7473", "#818685", "#747978"] },
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
    objectSaturn: "土星のオブジェ",
    lightSaturn: "土星のランプ",
    driver: "金色のクマ女神像ドライバー",
    monshoMoon: "月の紋章が書かれた紙",
    key: "カギ",
    glass: "コップ",
    glassWater: "水が入ったコップ",
    glassWaterHot: "お湯が入ったコップ",
    battery: "電池",
    hammer: "木製のミニハンマー",
    potpourriSun: "ポプリ",
    interviewNote: "インタビューノート",
    loupe: "学者の虫眼鏡",
    map: "古い地図",
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
  ensureInventoryPageState();
  const slots = document.querySelectorAll(".inventory-slot");
  const prevButton = document.getElementById("inventoryPrev");
  const nextButton = document.getElementById("inventoryNext");
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

        if (itemId === "objectSaturn") {
          buttons = [
            {
              text: "調べる",
              action: () => {
                window._nextModal = {
                  title: getItemName(itemId),
                  content: `<img src="${IMAGES.modals.objectSaturnCheck}" style="max-width:380px;max-height:80vh;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`,
                  buttons: [{ text: "閉じる", action: "close" }],
                };
                closeModal();
              },
            },
            { text: "閉じる", action: "close" },
          ];
        }

        if (itemId === "potpourriSun") {
          buttons = [
            {
              text: "匂いを嗅ぐ",
              action: () => {
                window._nextModal = {
                  title: getItemName(itemId),
                  content: "お日様のような温かい香りがする",
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

        if (itemId === "puddingStrawberry") {
          buttons = [
            {
              text: "食べる",
              action: () => {
                let text = "ここなら食べてもよさそうだ。椅子に座って食べよう";
                if (gameState.currentRoom !== "restArea") {
                  const f = gameState.main.flags || (gameState.main.flags = {});
                  if (f.badMannerPuddingRoom !== gameState.currentRoom) {
                    f.badMannerPuddingRoom = gameState.currentRoom;
                    f.badMannerPuddingAttempts = 0;
                  }
                  f.badMannerPuddingAttempts = (f.badMannerPuddingAttempts || 0) + 1;
                  if (f.badMannerPuddingAttempts >= 3) {
                    showPuddingMannerBadEnd();
                    return;
                  }
                  text = "ここで食べるのはマナー違反だ";
                }
                showModal("いちごプリン", text, [{ text: "閉じる", action: "close" }]);
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
          ];

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

          buttons.push({ text: "閉じる", action: "close" });
        }

        showModal(getItemName(itemId), content, buttons);
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
