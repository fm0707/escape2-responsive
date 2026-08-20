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
const BASE_44 = USE_LOCAL_ASSETS ? "images/44" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/44";
const BASE_SOUND_44 = USE_LOCAL_ASSETS ? "sounds/44" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/44";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I44 = (file) => `${BASE_44}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S44 = (file) => `${BASE_SOUND_44}/${file}`;
const DEFAULT_BGM = S44("haku.mp3");

// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    mainZashiki: [I44("main_zashiki.webp")],
    mainOshiire: [I44("main_oshiire.webp")],
    chibukuroInner: [I44("chibukuro_inner.webp")],
    shosai: [I44("shosai.webp")],
    deskZoom: [I44("desk_zoom.webp")],
    map: [I44("map.webp")],
    rooftop: [I44("rooftop.webp")],
    shlfZoom: [I44("shlf_zoom.webp")],
    rabbitPuzzle: [I44("rabbit_board.webp")],
    zatakuZoom: [I44("zataku_zoom.webp")],
    bookOrigami1: {
      jp: [I44("book_origami_1.webp")],
      en: [I44("book_origami_1_en.webp")],
    },
    bookOrigami2: {
      jp: [I44("book_origami_2.webp")],
      en: [I44("book_origami_2_en.webp")],
    },
    bookOrigami3: {
      jp: [I44("book_origami_3.webp")],
    },
    emaki1: [I44("emaki_1.webp")],
    emaki2: [I44("emaki_2.webp")],
    emaki3: [I44("emaki_3.webp")],
    emaki4: [I44("emaki_4.webp")],
    end: [I44("end.webp")],
    escapeEnd: [I44("end2.webp"), I44("escape_end2.webp")],
    trueEnd: [I44("true_end.webp"), I44("true_end2.webp")],
  },
  items: {
    back: ICM("common/back.png"),
    arrowRight: ICM("common/arrow_right.png"),
    arrowLeft: ICM("common/arrow_left.png"),
    blackBack: ICM("common/black_back.png"),
    lang_en: ICM("common/en2.png"),
    lang_jp: ICM("common/jp.png"),
    key: ICM("common/key.webp"),
    battery: ICM("common/battery.webp"),



    kakejiku: I44("kakejiku.webp"),
    himoZashiki: I44("himo_zashiki.webp"),
    himoZataku: I44("himo_zataku.webp"),
    himo: I44("himo.webp"),
    shoeHorn: I44("shoe_horn.webp"),
    hook: I44("hook.webp"),
    afterOpenCeilDoor: I44("after_open_ceil_door.webp"),
    origamiBluePink: I44("origami_blue_pink.webp"),
    craneBluePink: I44("crane_blue_pink.webp"),
    scissors: I44("scissors.webp"),
    rabbit: I44("rabbit.webp"),
    wetPaper: I44("wet_paper.webp"),
    remocon: I44("remocon.webp"),
    remoconSetBattery: I44("remocon_set_battery.webp"),
    tenbukuroOpened: I44("tenbukuro_opened.webp"),
    migishitaOpened: I44("migishita_opened.webp"),
    memo: I44("memo.webp"),
    memoWave: I44("memo_wave.webp"),
    ladder: I44("ladder.webp"),
    ladderDisp: I44("ladder_disp.webp"),
    tama: I44("tama.webp"),
    branch: I44("branch.webp"),
    branchDisp: I44("branch_disp.webp"),
    keyShine: I44("key_shine.webp"),
    take: I44("take.webp"),
    cage: I44("cage.webp"),
    cageAfter: I44("cage_after.webp"),
    kaguyahime: I44("kaguyahime.webp"),
    spaceShip: I44("space_ship.webp"),
    zokuRemove: I44("zoku_remove.webp"),
    master: I44("master.webp"),



  },
  modals: {
    cat: I44("modal_cat.webp"),
    fusuma: I44("modal_fusuma.webp"),
    fusuma2: I44("modal_fusuma2.webp"),
    boxDirty: I44("modal_box_dirty.webp"),
    boxCleaning: I44("modal_box_cleaning.webp"),
    boxCleaned: I44("modal_box_cleaned.webp"),
    boxOpen: I44("modal_box_open.webp"),
    zabuton: I44("modal_zabuton.webp"),
    hishigataNum: I44("modal_hishigata_num.webp"),
    kakejiku: I44("modal_kakejiku.webp"),
    tatami: I44("modal_tatami.webp"),
    bookMoon: I44("modal_book_moon.webp"),
    ceilBoard: I44("modal_ceil_board.webp"),
    tsubo1: I44("modal_tsubo_1.webp"),
    tsubo2: I44("modal_tsubo_2.webp"),
    tsubo3: I44("modal_tsubo_3.webp"),
    tsubo4: I44("modal_tsubo_4.webp"),
    tsubo5: I44("modal_tsubo_5.webp"),
    note: I44("modal_note.webp"),
    noteEn: I44("modal_note_en.webp"),
    makingCrane: I44("modal_making_crane.webp"),
    hookThrown: I44("modal_hook_thrown.webp"),
    takeThrown: I44("modal_take_thrown.webp"),
    kaguyahimeFromTake: I44("modal_kaguyahime_from_take.webp"),
    kaguyahimeEating: I44("modal_kaguyahime_eating.webp"),
    kaguyahimeCrying: I44("modal_kaguyahime_crying.webp"),
    drawerUpper: I44("modal_drawer_upper.webp"),
    drawerBottom: I44("modal_drawer_bottom.webp"),
    drawerLong: I44("modal_drawer_long.webp"),
    iconFish: I44("icon_fish.webp"),
    iconTake: I44("icon_take.webp"),
    iconApple: I44("icon_apple.webp"),
    iconMountain: I44("icon_mountain.webp"),
    iconTorii: I44("icon_torii.webp"),
    iconLeaf: I44("icon_leaf.webp"),
    iconFlower: I44("icon_flower.webp"),
    iconIdo: I44("icon_ido.webp"),
    iconBridge: I44("icon_bridge.webp"),
    string: I44("modal_string.webp"),
    kaguyaMaster: I44("modal_kaguya_master.webp"),

    // badend: I44("badend.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState44";
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

const TOKONOMA_LEFT_STORAGE_LETTERS = ["A", "E", "H", "L", "O", "P", "R", "S"];
const TOKONOMA_LEFT_STORAGE_ANSWER = "HELP";
const RABBIT_PUZZLE_ANSWER = ["down", "right", "left", "up"];
const RABBIT_PUZZLE_LETTERS = "LEGE";
const RABBIT_DRAWER_LETTERS = ["A", "D", "E", "F", "G", "I", "L", "N", "R"];
const RABBIT_DRAWER_ANSWER = "LEGEND";

function createEmakiNavigation(previousRoom, nextRoom) {
  return [
    previousRoom && {
      x: 0, y: 45.5, width: 9, height: 9,
      onClick: clickWrap(() => changeRoom(previousRoom), { allowAtNight: true }),
      description: "前のページへ戻る",
      zIndex: 10,
      item: { img: "arrowLeft", visible: () => true },
    },
    nextRoom && {
      x: 91, y: 45.5, width: 9, height: 9,
      onClick: clickWrap(() => changeRoom(nextRoom), { allowAtNight: true }),
      description: "次のページへ進む",
      zIndex: 10,
      item: { img: "arrowRight", visible: () => true },
    },
    {
      x: 91, y: 91, width: 9, height: 9,
      onClick: clickWrap(() => changeRoom("zatakuZoom"), { allowAtNight: true }),
      description: "座卓へ戻る",
      zIndex: 10,
      item: { img: "back", visible: () => true },
    },
  ].filter(Boolean);
}

function createBookOrigamiNavigation(previousRoom, nextRoom) {
  return [
    previousRoom && {
      x: 0, y: 45.5, width: 9, height: 9,
      onClick: clickWrap(() => changeRoom(previousRoom), { allowAtNight: true }),
      description: "前のページへ戻る",
      zIndex: 10,
      item: { img: "arrowLeft", visible: () => true },
    },
    nextRoom && {
      x: 91, y: 45.5, width: 9, height: 9,
      onClick: clickWrap(() => changeRoom(nextRoom), { allowAtNight: true }),
      description: "次のページへ進む",
      zIndex: 10,
      item: { img: "arrowRight", visible: () => true },
    },
    {
      x: 82, y: 91, width: 9, height: 9,
      onClick: clickWrap(() => {
        uiLang = uiLang === "jp" ? "en" : "jp";
        renderCanvasRoom();
        updateMessage(uiLang === "en" ? "English version." : "日本語版に切り替えた。");
      }, { allowAtNight: true }),
      description: "言語を切り替える",
      zIndex: 10,
      item: { img: () => uiLang === "jp" ? "lang_en" : "lang_jp", visible: () => true },
    },
    {
      x: 91, y: 91, width: 9, height: 9,
      onClick: clickWrap(() => changeRoom("zatakuZoom"), { allowAtNight: true }),
      description: "座卓へ戻る",
      zIndex: 10,
      item: { img: "back", visible: () => true },
    },
  ].filter(Boolean);
}

// 部屋データ
let rooms = {
  mainZashiki: {
    name: "座敷",
    description: "和室の座敷だ。",
    clickableAreas: [
      {
        x: 0.3, y: 28.9, width: 13.6, height: 52.1,
        onClick: clickWrap(function () {
          updateMessage("騒がしい物音が聞こえる。「姫はどこだ！探し出せ！」・・・ここから出ないほうが良さそうだ。");
        }),
        description: '左のふすま',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 86.2, y: 30.5, width: 13.4, height: 54.8,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (flags.zokuMoved) {
            if (flags.foundMaster) {
              updateMessage("ざわめきが聞こえる。ここから出るのは危険そうだ");

              return;
            }
            const imageId = `fusumaMaster_${Date.now()}`;
            showModal(
              "賊がいない。今なら…",
              `<img id="${imageId}" src="${IMAGES.modals.fusuma2}" class="showobj-image" alt="賊がいない。今なら…" style="${flags.foundMaster ? "" : "cursor:pointer;"}">`,
              [{ text: "閉じる", action: "close" }],
              null,
              { contentClass: "showobj-modal" },
            );
            updateMessage("賊がいない。今なら…");

            if (!flags.foundMaster) {
              document.getElementById(imageId)?.addEventListener("click", () => {
                closeModal();
                acquireItemOnce(
                  "foundMaster",
                  "master",
                  "負傷した屋敷の主人を保護した",
                  IMAGES.items.master,
                  "負傷した屋敷の主人を保護した",
                );
                markProgress?.("rescue_injured_master");
              }, { once: true });
            }
            return;
          }
          showObj(
            null,
            "不穏な気配がする。ここから出ると危険そうだ。",
            IMAGES.modals.fusuma,
            "不穏な気配がする。ここから出ると危険そうだ。",
          );
        }),
        description: '右のふすま',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 17.5, y: 53.8, width: 8.9, height: 9.2,
        onClick: clickWrap(function () {
          showObj(null, "猫の置物だ。", IMAGES.modals.cat, "猫の置物を眺めた。");
        }),
        description: '猫の置物',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 17.9, y: 64.3, width: 11.9, height: 7.1,
        onClick: clickWrap(function () {
          showTokonomaLeftStoragePuzzle();
        }),
        description: '床の間左の収納',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 24.0, y: 64.8, width: 5.2, height: 6.1,
        onClick: clickWrap(function () {
          acquireItemOnce(
            "foundScissors",
            "scissors",
            "はさみを見つけた",
            IMAGES.items.scissors,
            "はさみを手に入れた。",
          );
        }),
        description: 'はさみ',
        zIndex: 6,
        usable: () => getMainFlags().tokonomaLeftStorageUnlocked && !getMainFlags().foundScissors,
        item: { img: 'scissors', visible: () => getMainFlags().tokonomaLeftStorageUnlocked && !getMainFlags().foundScissors }
      },
      {
        x: 26.7, y: 33.6, width: 14.6, height: 30.9,
        onClick: clickWrap(function () {
          if (getMainFlags().kakejikuRaised) {
            acquireItemOnce("foundKakejikuKey", "key", "カギを見つけた", IMAGES.items.key, "カギを手に入れた。");
            return;
          }
          showObj(null, "掛け軸だ。", IMAGES.modals.kakejiku, "掛け軸を眺めた。");
        }),
        description: '掛け軸',
        zIndex: 5,
        usable: () => true,
        item: { img: 'kakejiku', visible: () => !getMainFlags().kakejikuRaised }
      },
      {
        x: 32.1, y: 49.8, width: 3.2, height: 3.0,
        onClick: clickWrap(function () {

        }),
        description: '掛け軸の裏の鍵',
        zIndex: 5,
        usable: () => false,
        item: { img: 'key', visible: () => getMainFlags().kakejikuRaised && !getMainFlags().foundKakejikuKey }
      },
      {
        x: 51, y: 30, width: 36, height: 47,
        onClick: clickWrap(() => changeRoom("shlfZoom"), { allowAtNight: true }),
        description: "棚を拡大する",
        zIndex: 5,
      },
      {
        x: 76.0, y: 50.2, width: 7.5, height: 7.5,
        onClick: clickWrap(function () {

        }),
        description: '遠目から見た青とピンクの折り鶴',
        zIndex: 5,
        usable: () => true,
        item: { img: 'craneBluePink', visible: () => getMainFlags().craneBluePinkSet }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '巻物のひも',
        zIndex: 5,
        usable: () => false,
        item: { img: 'himoZashiki', visible: () => !getMainFlags().himoCut }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '天袋開き後の表示',
        zIndex: 5,
        usable: () => false,
        item: { img: 'tenbukuroOpened', visible: () => getMainFlags().shlfUpperCabinetOpen }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '右下収納開き後の表示',
        zIndex: 5,
        usable: () => false,
        item: { img: 'migishitaOpened', visible: () => getMainFlags().shlfLowerRightStorageOpen }
      },
      {
        x: 51.7, y: 84.7, width: 20.6, height: 10.1,
        onClick: clickWrap(function () {
          acquireItemOnce(
            "foundMemo",
            "memo",
            "座布団の下にメモがあった",
            IMAGES.modals.zabuton,
            "メモを手に入れた。",
          );
        }),
        description: '座布団',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 19, y: 76, width: 31, height: 20,
        onClick: clickWrap(() => changeRoom("zatakuZoom"), { allowAtNight: true }),
        description: "座卓を拡大する",
        zIndex: 5,
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainOshiire"), { allowAtNight: true }),
        description: "押し入れ側へ移動",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  mainOshiire: {
    name: "押し入れ",
    description: "押し入れのある場所だ。",
    clickableAreas: [
      {
        x: 79.1, y: 39.1, width: 7.5, height: 9.1,
        onClick: clickWrap(function () {
          showObj(null, "何か書かれている。", IMAGES.modals.hishigataNum, "何か書かれている。");
        }),
        description: '右の収納棚上のひしがた',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 80.2, y: 55.6, width: 7.5, height: 22.6,
        onClick: clickWrap(function () {
          showOshiireRightPuzzle();
        }),
        description: '右の収納棚',
        zIndex: 5,
        usable: () => true,
        item: { img: 'blackBack', visible: () => getMainFlags().oshiireRightOpen }
      },
      {
        x: 80.2, y: 55.6, width: 7.5, height: 22.6,
        onClick: clickWrap(function () {
          acquireItemOnce("foundShoeHorn", "shoeHorn", "靴ベラを見つけた", IMAGES.items.shoeHorn, "靴ベラを手に入れた");
        }),
        description: '靴ベラ',
        zIndex: 6,
        usable: () => getMainFlags().oshiireRightOpen && !getMainFlags().foundShoeHorn,
        item: { img: 'shoeHorn', visible: () => getMainFlags().oshiireRightOpen && !getMainFlags().foundShoeHorn }
      },
      {
        x: 10.1, y: 67.9, width: 12.1, height: 13.8,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (flags.setBranch && gameState.selectedItem === "tama" && !flags.tamaSetInTsubo) {
            removeItem("tama");
            flags.tamaSetInTsubo = true;
            markProgress?.("set_tama_on_branch");
            showTsuboTamaAnimation();
            return;
          }
          if (flags.tamaSetInTsubo && !flags.foundKeyShine) {
            showTsuboFinalKeyModal();
            return;
          }
          if (flags.setBranch) {
            showObj(null, "枝を差した壺", IMAGES.modals.tsubo2, "枝を壺に差した");
            return;
          }
          if (gameState.selectedItem === "branch") {
            removeItem("branch");
            flags.setBranch = true;
            markProgress?.("set_branch_in_tsubo");
            renderCanvasRoom?.();
            showObj(null, "枝を壺に差した", IMAGES.modals.tsubo2, "枝を壺に差した");
            return;
          }
          showObj(null, "壺がある", IMAGES.modals.tsubo1, "壺がある");
        }),
        description: '壺',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 15.1, y: 64.8, width: 2.9, height: 6.1,
        onClick: clickWrap(function () {

        }),
        description: 'セットされた枝',
        zIndex: 5,
        usable: () => false,
        item: { img: 'branchDisp', visible: () => getMainFlags().setBranch }
      },
      {
        x: 37.3, y: 66.8, width: 25.3, height: 13.8,
        onClick: clickWrap(function () {
          if (getMainFlags().oshiireJibukuroUnlocked) {
            changeRoom("chibukuroInner");
          } else {
            showOshiireJibukuroPuzzle();
          }
        }),
        description: '地袋',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 25.7, y: 66.9, width: 48.8, height: 13.6,
        onClick: clickWrap(function () {

        }),
        description: '地袋全体',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 25.3, y: 18.3, width: 49.2, height: 43.6,
        onClick: clickWrap(function () {
          showMainOshiirePuzzle();
        }),
        description: '押し入れ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 37.4, y: 18.3, width: 25.2, height: 44.2,
        onClick: clickWrap(function () {

        }),
        description: '押し入れ開口部',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainZashiki"), { allowAtNight: true }),
        description: "座敷へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  chibukuroInner: {
    name: "地袋の中",
    description: "地袋の内部だ。",
    clickableAreas: [
      {
        x: 22.5, y: 34.2, width: 55.0, height: 35.1,
        onClick: clickWrap(function () {
          handleChibukuroBackWallClick();
        }),
        description: '奥の壁板',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 15.9, y: 78.4, width: 25.2, height: 16.1,
        onClick: clickWrap(function () {
          acquireItemOnce("foundBranch", "branch", "枝が落ちている", IMAGES.items.branch, "枝を手に入れた");
        }),
        description: '落ちている枝',
        zIndex: 5,
        usable: () => !getMainFlags().foundBranch,
        item: { img: 'branch', visible: () => !getMainFlags().foundBranch }
      },
      {
        x: 85.4, y: 39.7, width: 14.6, height: 22.8,
        onClick: clickWrap(function () {
          showObj(null, "紙が貼られている", IMAGES.modals.string, "紙が貼られている");
        }),
        description: '右の壁に貼られた紙',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainOshiire"), { allowAtNight: true }),
        description: "押し入れへ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  shosai: {
    name: "書斎",
    description: "",
    clickableAreas: [
      {
        x: 30.0, y: 4.9, width: 37.8, height: 17.3,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (gameState.selectedItem === "ladder" && !flags.ceilDoorOpen) {
            updateMessage("天井の扉が閉じているため、はしごは使えない。");
            return;
          }
          if (flags.ceilDoorOpen) {
            if (gameState.selectedItem === "ladder") {
              removeItem("ladder");
              flags.ladderPlaced = true;
              renderCanvasRoom();
              playSE?.("se-ashioto");
              markProgress?.("reach_rooftop_with_ladder");
              changeRoom("rooftop");
              return;
            }
            if (flags.ladderPlaced) {
              playSE?.("se-ashioto");
              changeRoom("rooftop");
              return;
            }
            updateMessage("天井の扉が開いている。");
            return;
          }
          if (gameState.selectedItem === "hook") {
            removeItem("hook");
            showModal(
              "天井の扉に向かって、ひも付きの靴ベラを投げた",
              `<img src="${IMAGES.modals.hookThrown}" class="showobj-image" alt="天井の扉に向かって、ひも付きの靴ベラを投げた">`,
              [{ text: "閉じる", action: "close" }],
              () => {
                flags.ceilDoorOpen = true;
                playSE?.("se-door-close");
                markProgress?.("open_shosai_ceiling_door");
                renderCanvasRoom?.();
                updateMessage("天井の扉が開いた。");
              },
              { contentClass: "showobj-modal" },
            );
            updateMessage("天井の扉に向かって、ひも付きの靴ベラを投げた");
            return;
          }
          if (gameState.selectedItem === "shoeHorn") {
            updateMessage("靴ベラを使っても、手が届かない。");
            return;
          }
          updateMessage("天井に扉がある。手が届かない");
        }),
        description: '天井の戸口',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 71.9, y: 77.4, width: 8.4, height: 7.3,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (!flags.unlockCage) {
            updateMessage("檻が閉じていて、竹に触れられない。");
            return;
          }
          if (flags.foundKaguyahime) {
            acquireItemOnce(
              "foundTake",
              "take",
              "竹が残っている",
              IMAGES.items.take,
              "竹を手に入れた。",
            );
            return;
          }

          const imageId = `takeImg_${Date.now()}`;
          showModal(
            "竹がある",
            `<img id="${imageId}" src="${IMAGES.items.take}" class="showobj-image" alt="竹がある" style="cursor:pointer;">`,
            [{ text: "閉じる", action: "close" }],
            null,
            { contentClass: "showobj-modal" },
          );
          updateMessage("竹がある");

          document.getElementById(imageId)?.addEventListener("click", () => {
            if (flags.foundKaguyahime) return;
            flags.foundKaguyahime = true;
            addItem("kaguyahime");
            markProgress?.("get_kaguyahime_from_take");
            renderCanvasRoom?.();
            showModal(
              "かぐや姫が竹から出てきた",
              `<img src="${IMAGES.modals.kaguyahimeFromTake}" class="showobj-image" alt="かぐや姫が竹から出てきた">`,
              [{ text: "閉じる", action: "close" }],
              null,
              { contentClass: "showobj-modal" },
            );
            updateMessage("かぐや姫が竹から出てきた");
          }, { once: true });
        }),
        description: '竹',
        zIndex: 5,
        usable: () => getMainFlags().unlockCage && !getMainFlags().foundTake,
        item: { img: 'take', visible: () => !getMainFlags().foundTake }
      },
      {
        x: 61.7, y: 62.7, width: 27.7, height: 25.0,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (flags.unlockCage) {
            updateMessage("檻の鍵は開いている。");
            return;
          }
          if (gameState.selectedItem !== "keyShine") {
            updateMessage("檻には鍵がかかっている。");
            return;
          }
          removeItem("keyShine");
          flags.unlockCage = true;
          playSE?.("se-gacha");
          markProgress?.("unlock_shosai_cage");
          renderCanvasRoom?.();
          updateMessage("輝くカギを使って、檻の鍵を開けた。");
        }),
        description: '檻',
        zIndex: 5,
        usable: () => true,
        item: {
          img: () => getMainFlags().unlockCage ? 'cageAfter' : 'cage',
          visible: () => true
        }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '天井の戸口開いた後',
        zIndex: 5,
        usable: () => false,
        item: { img: 'afterOpenCeilDoor', visible: () => getMainFlags().ceilDoorOpen }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: 'おかれたはしご',
        zIndex: 5,
        usable: () => false,
        item: { img: 'ladderDisp', visible: () => getMainFlags().ladderPlaced }
      },
      {
        x: 37.6, y: 89.7, width: 24.9, height: 10.1,
        onClick: clickWrap(function () {
          showObj(null, "床に落ちた扉だ。", IMAGES.modals.ceilBoard, "床に落ちた扉を眺めた。");
        }),
        description: '床に落ちた扉',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 10.3, y: 66.7, width: 37.1, height: 19.8,
        onClick: clickWrap(function () {
          changeRoom("deskZoom");
        }),
        description: '机',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("chibukuroInner"), { allowAtNight: true }),
        description: "地袋の中へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  deskZoom: {
    name: "机",
    description: "机を近くで見ている。",
    clickableAreas: [
      {
        x: 5.9, y: 19.1, width: 20.6, height: 14.6,
        onClick: clickWrap(function () {
          showObj(null, "月に関する本のようだ。", IMAGES.modals.bookMoon, "月に関する本のようだ。");
        }),
        description: '机の上の本',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 32.0, y: 23.6, width: 28.6, height: 14.2,
        onClick: clickWrap(function () {
          showObj(null, "誰かの手記がある", IMAGES.modals.note, "誰かの手記がある", IMAGES.modals.noteEn);
        }),
        description: '手記',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 68.8, y: 43.8, width: 23.2, height: 7.5,
        onClick: clickWrap(function () {
          showDeskTopDrawerPuzzle();
        }),
        description: '引き出し上段',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 68.7, y: 55.3, width: 23.3, height: 14.6,
        onClick: clickWrap(function () {
          showDeskBottomDrawerPuzzle();
        }),
        description: '引き出し下段',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0.3, y: 43.4, width: 61.9, height: 7.4,
        onClick: clickWrap(function () {
          const imageId = `drawerLong_${Date.now()}`;
          playSE?.("se-hikidashi");
          showModal(
            "横長の引き出し",
            `<img id="${imageId}" src="${IMAGES.modals.drawerLong}" class="showobj-image" alt="横長の引き出し" style="cursor:pointer;">`,
            [{ text: "閉じる", action: "close" }],
            null,
            { contentClass: "showobj-modal" },
          );
          document.getElementById(imageId)?.addEventListener("click", () => {
            closeModal();
            changeRoom("map");
          }, { once: true });
          updateMessage("横長の引き出しが開いた。");
        }),
        description: '横長の引き出し',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 81.4, y: 20.4, width: 13.6, height: 11.2,
        onClick: clickWrap(function () {
          updateMessage("すずりがある。")
        }),
        description: '机の上のすずり',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("shosai"), { allowAtNight: true }),
        description: "書斎へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  map: {
    name: "地図",
    description: "古そうな地図だ。",
    clickableAreas: [
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("deskZoom"), { allowAtNight: true }),
        description: "机へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  rooftop: {
    name: "屋上",
    description: "屋上に出た。",
    clickableAreas: [
      {
        x: 38.1, y: 71.0, width: 25.1, height: 19.0,
        onClick: clickWrap(function () {
          playSE?.("se-ashioto");
          changeRoom("shosai");
        }, { allowAtNight: true }),
        description: '登り口',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 2.1, y: 48.5, width: 19.9, height: 48.3,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (flags.spaceShipLanded) {
            updateMessage("よくわからないが、台の上のものに乗り込んでみよう");
            return;
          }
          if (flags.setKaguyahime) {
            updateMessage("かぐや姫がこちらを見ている・・・置き去りにすると怒られそうだ");
            return;
          }
          if (hasItem("master")) {
            updateMessage("屋敷の主人を抱えて降りるのは難しそうだ");
            return;
          }
          if (hasItem("kaguyahime")) {
            const count = Number.isInteger(flags.kaguyahimeRopeCount) ? flags.kaguyahimeRopeCount : 0;
            const dialogues = [
              "月に帰りたい・・・",
              "ここから降りるのか？ 月には帰れぬぞ",
              "わらわを連れて逃げるつもりか？",
              "……本当に行くのじゃな？",
            ];
            if (count < dialogues.length) {
              const dialogue = dialogues[count];
              flags.kaguyahimeRopeCount = count + 1;
              showObj(
                null,
                `「${dialogue}」`,
                IMAGES.items.kaguyahime,
                `「${dialogue}」とかぐや姫は言った`,
              );
              return;
            }

            travelToEscapeEnd();
            return;
          }
          travelWithSteps("end");
        }, { allowAtNight: true }),
        description: 'ロープ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 77.8, y: 27.5, width: 21.4, height: 22.5,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (flags.zokuMoved) {
            updateMessage("ここにいた賊は移動したようだ");
            return;
          }
          if (gameState.selectedItem === "take") {
            removeItem("take");
            flags.zokuMoved = true;
            document.getElementById("se-falling")?.addEventListener(
              "ended",
              () => playSE?.("se-attack"),
              { once: true },
            );
            playSE?.("se-falling");
            markProgress?.("move_rooftop_bandits_with_take");
            renderCanvasRoom?.();
            showObj(
              null,
              "竹を遠くへ投げた",
              IMAGES.modals.takeThrown,
              "賊の配置が変わったようだ",
            );
            return;
          }
          updateMessage("不審な賊がたむろしている。");
        }),
        description: '賊',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '賊消し',
        zIndex: 5,
        usable: () => false,
        item: { img: 'zokuRemove', visible: () => getMainFlags().zokuMoved }
      },
      {
        x: 40.2, y: 5.1, width: 18.4, height: 16.2,
        onClick: clickWrap(function () {
          updateMessage("きれいな月だ");
        }),
        description: '月',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 36.8, y: 37.1, width: 27.5, height: 11.3,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (flags.setKaguyahime) {
            showObj(
              null,
              "かぐや姫は台に立っている",
              IMAGES.items.kaguyahime,
              "かぐや姫は台に立っている",
            );
            return;
          }
          if (gameState.selectedItem !== "kaguyahime") {
            updateMessage("何かを置くための台のようだ。");
            return;
          }
          removeItem("kaguyahime");
          flags.setKaguyahime = true;
          markProgress?.("set_kaguyahime_on_rooftop_pedestal");
          renderCanvasRoom?.();
          updateMessage("かぐや姫を台に立たせた。");
        }),
        description: '台',
        zIndex: 5,
        usable: () => !getMainFlags().spaceShipLanded,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 43.5, y: 32.7, width: 14.7, height: 13.2,
        onClick: clickWrap(function () {

        }),
        description: 'かぐや姫表示位置',
        zIndex: 5,
        usable: () => false,
        alpha: () => {
          const fx = gameState.fx?.rooftopSpaceShip;
          if (!fx || fx.phase !== "arrival") return 1;
          return fx.progress < 0.68 ? 1 : Math.max(0, 1 - (fx.progress - 0.68) / 0.32);
        },
        item: {
          img: 'kaguyahime',
          visible: () => getMainFlags().setKaguyahime && !getMainFlags().spaceShipLanded
        }
      },
      {
        x: 38.7, y: 26.2, width: 23.3, height: 23.5,
        onClick: clickWrap(function () {
          const trueEndFlags = gameState.trueEnd?.flags
            || (gameState.trueEnd = { flags: { backgroundState: 0 } }).flags;
          trueEndFlags.backgroundState = hasItem("master") ? 1 : 0;
          travelWithSteps("trueEnd", { soundId: "se-byun", transitionDelay: 900 });
        }),
        description: '宇宙船着地点',
        zIndex: 5,
        usable: () => getMainFlags().spaceShipLanded,
        item: { img: 'spaceShip', visible: () => getMainFlags().spaceShipLanded }
      },
      {
        x: 46.3, y: 48.6, width: 6.9, height: 3.5,
        onClick: clickWrap(function () {
          if (!getMainFlags().setKaguyahime) {
            updateMessage("反応がない。");
            return;
          }
          showRooftopInputPanelPuzzle();
        }),
        description: '入力パネル',
        zIndex: 5,
        usable: () => true,
        glowWhen: () => getMainFlags().setKaguyahime && !getMainFlags().rooftopPanelCleared,
        glowSoft: true,
        glowColor: "255, 235, 140",
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
    ],
  },
  shlfZoom: {
    name: "棚",
    description: "棚を近くで見ている。",
    clickableAreas: [
      {
        x: 10.3, y: 3.7, width: 79.0, height: 14.6,
        onClick: clickWrap(function () {
          handleShlfUpperCabinetClick();
        }),
        description: '天袋',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 29.1, y: 3.6, width: 41.4, height: 14.6,
        onClick: clickWrap(function () {

        }),
        description: '天袋スライド部',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 10.4, y: 3.7, width: 20.1, height: 14.4,
        onClick: clickWrap(function () {

        }),
        description: '天袋左スライド後',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 68.8, y: 3.7, width: 20.3, height: 14.5,
        onClick: clickWrap(function () {

        }),
        description: '天袋右スライド後',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 16.7, y: 31.3, width: 14.6, height: 10.5,
        onClick: clickWrap(function () {
          changeRoom("rabbitPuzzle");
        }),
        description: 'ウサギの置物',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 10.4, y: 44.9, width: 27.4, height: 9.1,
        onClick: clickWrap(function () {
          showRabbitDrawerPuzzle();
        }),
        description: 'ウサギの置物の下の引き出し',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 50.0, y: 73.4, width: 38.6, height: 26.2,
        onClick: clickWrap(function () {
          showShlfLowerRightStoragePuzzle();
        }),
        description: '右下収納棚',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 71.2, y: 80.2, width: 14.6, height: 14.7,
        onClick: clickWrap(function () {
          acquireItemOnce("foundBattery", "battery", "電池を見つけた", IMAGES.items.battery, "電池を手に入れた");
        }),
        description: '右下収納の中の電池',
        zIndex: 6,
        usable: () => getMainFlags().shlfLowerRightStorageUnlocked && !gameState.fx?.shlfLowerRightStorage && !getMainFlags().foundBattery,
        item: { img: 'battery', visible: () => getMainFlags().shlfLowerRightStorageUnlocked && !gameState.fx?.shlfLowerRightStorage && !getMainFlags().foundBattery }
      },
      {
        x: 15.9, y: 87.6, width: 21.5, height: 11.6,
        onClick: clickWrap(function () {
          handleShlfWoodenBoxClick();
        }),
        description: '木箱',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 53.7, y: 43.7, width: 34.0, height: 10.0,
        onClick: clickWrap(function () {
          handleShlfCraneShelfClick();
        }),
        description: '折り鶴がある棚',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 70.1, y: 40.5, width: 18.1, height: 18.6,
        onClick: clickWrap(function () {

        }),
        description: '青とピンクの折り鶴表示箇所',
        zIndex: 5,
        usable: () => false,
        item: { img: 'craneBluePink', visible: () => getMainFlags().craneBluePinkSet }
      },

      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainZashiki"), { allowAtNight: true }),
        description: "座敷へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  rabbitPuzzle: {
    name: "ウサギの置物",
    description: "ウサギの向きを変えられそうだ。",
    clickableAreas: [
      {
        x: 35, y: 0, width: 30, height: 28,
        onClick: clickWrap(() => handleRabbitDirection("up"), { allowAtNight: true }),
        description: "上を向ける",
        zIndex: 5,
      },
      {
        x: 72, y: 32, width: 28, height: 36,
        onClick: clickWrap(() => handleRabbitDirection("right"), { allowAtNight: true }),
        description: "右を向ける",
        zIndex: 5,
      },
      {
        x: 35, y: 72, width: 30, height: 28,
        onClick: clickWrap(() => handleRabbitDirection("down"), { allowAtNight: true }),
        description: "下を向ける",
        zIndex: 5,
      },
      {
        x: 0, y: 32, width: 28, height: 36,
        onClick: clickWrap(() => handleRabbitDirection("left"), { allowAtNight: true }),
        description: "左を向ける",
        zIndex: 5,
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("shlfZoom"), { allowAtNight: true }),
        description: "棚へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  zatakuZoom: {
    name: "座卓",
    description: "座卓を近くで見ている。",
    clickableAreas: [
      {
        x: 45.3, y: 17.0, width: 21.8, height: 17.1,
        onClick: clickWrap(function () {
          handleOrigamiBookClick();
        }),
        description: '折り紙の本',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '巻物のひも',
        zIndex: 5,
        usable: () => false,
        item: { img: 'himoZataku', visible: () => !getMainFlags().himoCut }
      },
      {
        x: 19.7, y: 28.2, width: 14.7, height: 25.1,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (flags.himoCut) {
            changeRoom("emaki1");
            return;
          }

          if (gameState.selectedItem === "scissors") {
            removeItem("scissors");
            flags.himoCut = true;
            flags.foundHimo = true;
            addItem("himo");
            playSE?.("se-hasami");
            markProgress?.("cut_emaki_himo");
            renderCanvasRoom?.();
            updateMessage("巻物のひもを切り、丈夫そうな紐を手に入れた。");
            return;
          }

          updateMessage("巻物には、ひもが固く結ばれている。");

        }),
        description: '巻物',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 42.8, y: 64.1, width: 16.1, height: 13.1,
        onClick: clickWrap(function () {
          showObj(null, "畳のヘリだ。", IMAGES.modals.tatami, "畳のヘリを眺めた。");
        }),
        description: '畳のヘリ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainZashiki"), { allowAtNight: true }),
        description: "座敷へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  bookOrigami1: {
    name: "折り紙の本（表紙）",
    description: "折り紙の本の表紙だ。",
    clickableAreas: createBookOrigamiNavigation(null, "bookOrigami2"),
  },
  bookOrigami2: {
    name: "折り紙の本",
    description: "折り紙の折り方が載っている。",
    clickableAreas: createBookOrigamiNavigation("bookOrigami1", "bookOrigami3"),
  },
  bookOrigami3: {
    name: "折り紙の本（裏表紙）",
    description: "折り紙の本の裏表紙だ。",
    clickableAreas: createBookOrigamiNavigation("bookOrigami2", null),
  },
  emaki1: {
    name: "絵巻（一）",
    description: "絵巻の一ページ目だ。",
    clickableAreas: createEmakiNavigation(null, "emaki2"),
  },
  emaki2: {
    name: "絵巻（二）",
    description: "絵巻の二ページ目だ。",
    clickableAreas: createEmakiNavigation("emaki1", "emaki3"),
  },
  emaki3: {
    name: "絵巻（三）",
    description: "絵巻の三ページ目だ。",
    clickableAreas: createEmakiNavigation("emaki2", "emaki4"),
  },
  emaki4: {
    name: "絵巻（四）",
    description: "絵巻の四ページ目だ。",
    clickableAreas: createEmakiNavigation("emaki3", null),
  },
  end: {
    name: "ノーマルエンド",
    description: "閉ざされた座敷から無事に脱出できました。おめでとうございます！",
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

  escapeEnd: {
    name: "逃走エンド",
    description: "かぐや姫を連れ、賊に追われながら屋敷から脱出しました。",
    clickableAreas: [
      {
        x: 37.0, y: 22.6, width: 25.1, height: 29.7,
        onClick: clickWrap(function () {
          updateMessage("早く走るのじゃー");
        }),
        description: '背負われるかぐや姫',
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
          showEndingReport("escapeEnd");
        }),
        description: "逃走エンド",
      },
    ],
  },

  trueEnd: {
    name: "トゥルーエンド",
    description: "かぐや姫と一緒に月に到着しました。脱出おめでとうございます。",
    clickableAreas: [
      {
        x: 58.3, y: 37.3, width: 21.2, height: 22.9,
        onClick: clickWrap(function () {
          if (gameState.selectedItem == "take") {
            updateMessage("その中は、窮屈じゃった");
            return;
          }
          showObj(
            null,
            "「美味しいのう」",
            IMAGES.modals.kaguyahimeEating,
            "かぐや姫は満足そうにお団子を食べている。",
          );
        }),
        description: '団子を食べるかぐや姫',
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 42.1, y: 34.1, width: 43.2, height: 18.8,
        onClick: clickWrap(function () {
          showObj(null, "「はい、どうぞ」", IMAGES.modals.kaguyaMaster, "かぐや姫と屋敷の主人は仲が良さそうだ");
        }),
        description: 'かぐや姫と屋敷の主人',
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
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
};

function travelWithSteps(destRoom, { useWarp = false, soundId = "se-ashioto", transitionDelay = 480 } = {}) {
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
    }, transitionDelay);
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

function travelToEscapeEnd() {
  const overlay = document.getElementById("roomEffectOverlay");
  const modal = document.getElementById("modal");
  const fxRoot = gameState.fx || (gameState.fx = {});
  const chaseDialogue = getMainFlags().zokuMoved
    ? "「見逃すと思ったか！姫はあそこだ！追え！」"
    : "「いたぞ！あそこだ！追え！」";
  fxRoot.lockInput = true;

  playSE?.("se-ashioto");
  pauseBGM();
  if (overlay) {
    overlay.style.background = "#000";
    overlay.style.opacity = 1;
  }

  setTimeout(() => {
    if (modal) modal.style.zIndex = "10000";
    showModal(
      chaseDialogue,
      `<p style="font-size:1.2em;text-align:center;margin:18px 0 24px;">賊に見つかったようだ</p>`,
      [
        {
          text: "次へ",
          action: () => {
            closeModal();
            if (modal) modal.style.zIndex = "";
            const escapeEndFlags = gameState.escapeEnd?.flags
              || (gameState.escapeEnd = { flags: {} }).flags;
            escapeEndFlags.backgroundState = getMainFlags().zokuMoved ? 1 : 0;
            changeRoom("escapeEnd");

            setTimeout(() => {
              if (overlay) {
                overlay.style.opacity = 0;
                overlay.style.background = "";
              }
              if (gameState.fx) gameState.fx.lockInput = false;
            }, 100);
          },
        },
      ],
      null,
      { contentClass: "showobj-modal" },
    );
    updateMessage(chaseDialogue);
  }, 600);
}

function showTsuboTamaAnimation() {
  const imageId = `tsuboTama_${Date.now()}`;
  showModal(
    "枝に輝く玉を嵌めた",
    `<img id="${imageId}" class="showobj-image" src="${IMAGES.modals.tsubo3}" alt="枝に輝く玉を嵌めた">`,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );
  updateMessage("枝に輝く玉を嵌めた");

  setTimeout(() => {
    const image = document.getElementById(imageId);
    if (image) image.src = IMAGES.modals.tsubo4;
    playSE("se-kiroriro");
  }, 500);
  setTimeout(() => {
    const image = document.getElementById(imageId);
    if (!image) return;
    image.src = IMAGES.modals.tsubo5;
    makeTsuboFinalImageClickable(image);
  }, 1000);
}

function showTsuboFinalKeyModal() {
  const imageId = `tsuboKey_${Date.now()}`;
  showModal(
    "枝に輝く玉を嵌めた",
    `<img id="${imageId}" class="showobj-image" src="${IMAGES.modals.tsubo5}" alt="枝に輝く玉を嵌めた" style="cursor:pointer;">`,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );
  const image = document.getElementById(imageId);
  if (image) makeTsuboFinalImageClickable(image);
  updateMessage("枝に輝く玉を嵌めた");
}

function makeTsuboFinalImageClickable(image) {
  image.style.cursor = "pointer";
  image.addEventListener("click", () => {
    const flags = getMainFlags();
    if (flags.foundKeyShine) return;
    acquireItemOnce(
      "foundKeyShine",
      "keyShine",
      "輝くカギが現れた",
      IMAGES.items.keyShine,
      "輝くカギを手に入れた。",
    );
    markProgress?.("get_key_shine_from_tsubo");
    renderCanvasRoom?.();
  }, { once: true });
}

function showOshiireRightPuzzle() {
  const flags = getMainFlags();
  if (flags.oshiireRightOpen) {
    updateMessage("右の収納棚は開いている。");
    return;
  }

  const colors = [
    { name: "白", value: "#FFFFFF" },
    { name: "緑", value: "#3E7A57" },
    { name: "紫", value: "#76508F" },
    { name: "赤", value: "#A11723" },
    { name: "黄", value: "#F8E052" },
    { name: "紺", value: "#18356E" },
  ];
  const answer = [4, 3, 5];
  const saved = Array.isArray(flags.oshiireRightColors) ? flags.oshiireRightColors : [0, 0, 0];
  const values = [0, 1, 2].map((index) => {
    const value = Number(saved[index]);
    return Number.isInteger(value) && value >= 0 && value < colors.length ? value : 0;
  });
  flags.oshiireRightColors = values.slice();

  const content = `
    <div style="box-sizing:border-box;display:flex;flex-direction:column;width:min(64vw,300px);aspect-ratio:1;overflow:hidden;margin:8px auto 16px;border:4px solid #333;background:#fff;box-shadow:0 5px 16px rgba(0,0,0,.3);">
      ${values.map((value, index) => `<button type="button" data-oshiire-color-index="${index}" aria-label="${index + 1}段目：${colors[value].name}" style="box-sizing:border-box;flex:1 1 0;display:block;width:100%;min-width:0;min-height:0;margin:0;padding:0;border:0;border-radius:0;${index ? "border-top:2px solid #333;" : ""}background:${colors[value].value};box-shadow:none;cursor:pointer;appearance:none;"></button>`).join("")}
    </div>
    <p id="oshiireRightGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("右の収納棚", content, [
    {
      text: "OK",
      action: () => {
        if (!values.every((value, index) => value === answer[index])) {
          const guide = document.getElementById("oshiireRightGuide");
          if (guide) guide.textContent = "色が違うようだ。";
          playSE?.("se-error");
          return;
        }
        flags.oshiireRightOpen = true;
        playSE?.("se-clear");
        markProgress?.("unlock_oshiire_right_storage");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("カチッと音がして、右の収納棚のロックが外れた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-oshiire-color-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.oshiireColorIndex);
      values[index] = (values[index] + 1) % colors.length;
      flags.oshiireRightColors = values.slice();
      button.style.background = colors[values[index]].value;
      button.setAttribute("aria-label", `${index + 1}段目：${colors[values[index]].name}`);
      const guide = document.getElementById("oshiireRightGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function showMainOshiirePuzzle() {
  const flags = getMainFlags();
  if (flags.mainOshiireUnlocked) {
    updateMessage("押し入れは開いている。中にはもう何もない。");
    return;
  }

  const saved = Array.isArray(flags.mainOshiireDigits) ? flags.mainOshiireDigits : [0, 0, 0];
  const digits = [0, 1, 2].map((index) => {
    const value = Number(saved[index]);
    return Number.isInteger(value) && value >= 0 && value <= 9 ? value : 0;
  });
  flags.mainOshiireDigits = digits.slice();

  const digitStyle = "box-sizing:border-box;width:min(24vw,100px);aspect-ratio:1;min-width:0;margin:0;padding:0;border:2px solid #777;border-radius:5px;background:#fff;color:#111;font-size:2.5rem;font-weight:900;cursor:pointer;";
  const content = `
    <div style="display:grid;grid-template-columns:repeat(3,minmax(54px,100px));gap:9px;justify-content:center;margin:8px auto 16px;">
      ${digits.map((digit, index) => `<button type="button" data-main-oshiire-digit="${index}" aria-label="${index + 1}桁目" style="${digitStyle}">${digit}</button>`).join("")}
    </div>
    <p id="mainOshiireGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("押し入れ", content, [
    {
      text: "OK",
      action: () => {
        if (digits.join("") !== "155") {
          const guide = document.getElementById("mainOshiireGuide");
          if (guide) guide.textContent = "数字が違うようだ。";
          playSE?.("se-error");
          return;
        }

        flags.mainOshiireUnlocked = true;
        markProgress?.("unlock_main_oshiire");
        closeModal();
        startMainOshiireOpenFx(() => {
          acquireItemOnce(
            "foundLadder",
            "ladder",
            "押し入れの中にはしごがあった",
            IMAGES.items.ladder,
            "はしごを手に入れた。",
          );
        });
        updateMessage("押し入れの戸が左右に開き始めた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-main-oshiire-digit]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.mainOshiireDigit);
      digits[index] = (digits[index] + 1) % 10;
      flags.mainOshiireDigits = digits.slice();
      button.textContent = String(digits[index]);
      const guide = document.getElementById("mainOshiireGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function startMainOshiireOpenFx(onDone) {
  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  fxRoot.mainOshiireOpen = { roomId: "mainOshiire", progress: 0 };
  playSE?.("se-hikidashi");
  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const fx = gameState.fx?.mainOshiireOpen;
    if (!fx) return;
    fx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (fx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }
    delete gameState.fx.mainOshiireOpen;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
    onDone?.();
  };
  requestAnimationFrame(tick);
}

function showOshiireJibukuroPuzzle() {
  const flags = getMainFlags();
  if (flags.oshiireJibukuroUnlocked) {
    updateMessage("地袋は開いている。");
    return;
  }

  const answer = ["right", "left", "left", "left", "right", "right"];
  const sequence = [];
  flags.oshiireJibukuroSequence = [];
  const buttonStyle = "box-sizing:border-box;width:min(28vw,130px);aspect-ratio:1;margin:0;padding:0;border:3px solid #aaa;border-radius:8px;background:#fff;color:#222;font-size:clamp(1.4rem,6vw,2rem);font-weight:800;cursor:pointer;box-shadow:0 3px 7px rgba(0,0,0,.22);";
  const content = `
    <div style="display:flex;gap:18px;justify-content:center;margin:10px auto 18px;">
      <button type="button" data-jibukuro-direction="left" aria-label="左" style="${buttonStyle}"></button>
      <button type="button" data-jibukuro-direction="right" aria-label="右" style="${buttonStyle}"></button>
    </div>
    <p id="oshiireJibukuroGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("地袋", content, [
    {
      text: "OK",
      action: () => {
        const isCorrect = sequence.length === answer.length
          && sequence.every((value, index) => value === answer[index]);
        if (!isCorrect) {
          sequence.length = 0;
          flags.oshiireJibukuroSequence = [];
          const guide = document.getElementById("oshiireJibukuroGuide");
          if (guide) guide.textContent = "反応がない。入力がリセットされた。";
          playSE?.("se-error");
          return;
        }

        flags.oshiireJibukuroUnlocked = true;
        flags.oshiireJibukuroSequence = sequence.slice();
        playSE?.("se-clear");
        markProgress?.("unlock_oshiire_jibukuro");
        closeModal();
        startOshiireJibukuroOpenFx();
        updateMessage("カチッと音がして、地袋が左右に開いた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-jibukuro-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      if (sequence.length >= answer.length) sequence.length = 0;
      sequence.push(button.dataset.jibukuroDirection);
      flags.oshiireJibukuroSequence = sequence.slice();
      const guide = document.getElementById("oshiireJibukuroGuide");
      if (guide) guide.textContent = "";
      button.animate?.(
        [{ background: "#ddd", transform: "scale(.96)" }, { background: "#fff", transform: "scale(1)" }],
        { duration: 150 },
      );
      playSE?.("se-click");
    });
  });
}

function startOshiireJibukuroOpenFx() {
  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  fxRoot.oshiireJibukuro = { roomId: "mainOshiire", progress: 0 };
  const duration = 950;
  const start = performance.now();

  const tick = (now) => {
    const fx = gameState.fx?.oshiireJibukuro;
    if (!fx) return;
    fx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (fx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }
    delete gameState.fx.oshiireJibukuro;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
  };
  requestAnimationFrame(tick);
}

function handleChibukuroBackWallClick() {
  const flags = getMainFlags();
  if (flags.chibukuroBackWallOpen) {
    if (addNaviItem("shosai")) renderNavigation();
    changeRoom("shosai");
    return;
  }

  if (gameState.selectedItem !== "key") {
    updateMessage("奥の壁板にカギ穴がある。");
    return;
  }

  flags.chibukuroBackWallOpen = true;
  removeItem("key");
  markProgress?.("open_chibukuro_back_wall");
  renderCanvasRoom?.();
  updateMessage("カギを回すと、奥の壁板が開いた。淡い光が差し込んでいる。");

  playSE?.("se-gacha");
}

function showTokonomaLeftStoragePuzzle() {
  const flags = getMainFlags();
  if (flags.tokonomaLeftStorageUnlocked) {
    updateMessage("床の間左の収納は開いている。");
    return;
  }

  const saved = Array.isArray(flags.tokonomaLeftStorageLetters)
    ? flags.tokonomaLeftStorageLetters
    : ["A", "A", "A", "A"];
  const letters = [0, 1, 2, 3].map((index) =>
    TOKONOMA_LEFT_STORAGE_LETTERS.includes(saved[index]) ? saved[index] : "A",
  );
  flags.tokonomaLeftStorageLetters = letters.slice();

  const squareColors = ["#FFFFFF", "#F7D6D9", "#D8E7F7", "#F5D9EA"];
  const squareStyle = "box-sizing:border-box;width:min(18vw,90px);aspect-ratio:1;min-width:0;margin:0;padding:0;border:2px solid #aaa;border-radius:4px;color:#111;font-size:clamp(1.7rem,7vw,2.4rem);font-weight:800;cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,.18);";
  const content = `
    <div class="notranslate" translate="no" style="display:grid;grid-template-columns:repeat(4,minmax(48px,90px));gap:8px;justify-content:center;margin:8px auto 16px;">
      ${letters.map((letter, index) => `<button type="button" data-tokonoma-storage-letter="${index}" aria-label="${index + 1}文字目" style="${squareStyle}background:${squareColors[index]};">${letter}</button>`).join("")}
    </div>
    <p id="tokonomaStorageGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("床の間左の収納", content, [
    {
      text: "OK",
      action: () => {
        if (letters.join("") !== TOKONOMA_LEFT_STORAGE_ANSWER) {
          const guide = document.getElementById("tokonomaStorageGuide");
          if (guide) guide.textContent = "文字が違うようだ。";
          playSE?.("se-error");
          return;
        }

        flags.tokonomaLeftStorageUnlocked = true;
        playSE?.("se-clear");
        markProgress?.("unlock_tokonoma_left_storage");
        closeModal();
        startTokonomaLeftStorageOpenFx();
        updateMessage("カチッと音がして、床の間左の収納が開いた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-tokonoma-storage-letter]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.tokonomaStorageLetter);
      const currentIndex = TOKONOMA_LEFT_STORAGE_LETTERS.indexOf(letters[index]);
      letters[index] = TOKONOMA_LEFT_STORAGE_LETTERS[(currentIndex + 1) % TOKONOMA_LEFT_STORAGE_LETTERS.length];
      flags.tokonomaLeftStorageLetters = letters.slice();
      button.textContent = letters[index];
      const guide = document.getElementById("tokonomaStorageGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function startTokonomaLeftStorageOpenFx() {
  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  fxRoot.tokonomaLeftStorage = { roomId: "mainZashiki", progress: 0 };
  const duration = 850;
  const start = performance.now();

  const tick = (now) => {
    const fx = gameState.fx?.tokonomaLeftStorage;
    if (!fx) return;
    fx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (fx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }
    delete gameState.fx.tokonomaLeftStorage;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
  };
  requestAnimationFrame(tick);
}

function handleShlfUpperCabinetClick() {
  const flags = getMainFlags();

  if (flags.shlfUpperCabinetOpen) {
    if (!flags.foundOrigamiBluePink) {
      acquireItemOnce(
        "foundOrigamiBluePink",
        "origamiBluePink",
        "青とピンクの折り紙",
        IMAGES.items.origamiBluePink,
        "青とピンクの折り紙を手に入れた。",
      );
      return;
    }
    updateMessage("天袋は開いている。中にはもう何もない。");
    return;
  }

  const selectedTool = gameState.selectedItem;
  if (selectedTool !== "shoeHorn" && selectedTool !== "hook") {
    updateMessage("天袋には、手が届かない。");
    return;
  }

  flags.shlfUpperCabinetOpen = true;
  clearUsingItem();
  playSE?.("se-match");
  markProgress?.("open_shlf_upper_cabinet");

  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  fxRoot.shlfUpperCabinet = { roomId: "shlfZoom", progress: 0 };
  const duration = 3000;
  const start = performance.now();

  const tick = (now) => {
    const fx = gameState.fx?.shlfUpperCabinet;
    if (!fx) return;
    fx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();

    if (fx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    delete gameState.fx.shlfUpperCabinet;
    gameState.fx.lockInput = false;
    acquireItemOnce(
      "foundOrigamiBluePink",
      "origamiBluePink",
      "青とピンクの折り紙が落ちてきた",
      IMAGES.items.origamiBluePink,
      "青とピンクの折り紙を手に入れた。",
    );
    markProgress?.("get_origami_blue_pink");
  };

  updateMessage(
    selectedTool === "hook"
      ? "ひも付きの靴ベラを伸ばして、天袋の戸に引っかけた。"
      : "靴ベラを伸ばして、天袋の戸に引っかけた。",
  );
  requestAnimationFrame(tick);
}

function handleOrigamiBookClick() {
  if (gameState.selectedItem !== "origamiBluePink") {
    changeRoom("bookOrigami1");
    return;
  }

  const flags = getMainFlags();
  removeItem("origamiBluePink");
  flags.madeCraneBluePink = true;
  addItem("craneBluePink");
  playSE?.("se-paper");
  markProgress?.("make_crane_blue_pink");

  const content = `
    <div class="modal-anim">
      <img src="${IMAGES.modals.makingCrane}" alt="青とピンクの折り紙で鶴を折っている">
      <img src="${IMAGES.items.craneBluePink}" alt="完成した青とピンクの折り鶴">
    </div>
  `;
  showModal(
    "折り紙で鶴を折った",
    content,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );
  updateMessage("青とピンクの折り鶴を手に入れた。");
}

function handleShlfCraneShelfClick() {
  const flags = getMainFlags();

  if (flags.craneBluePinkSet) {
    updateMessage("棚の上には、4羽の折り鶴が置かれている。色は左から、白、赤、青、ピンクだ。");
    return;
  }

  if (gameState.selectedItem !== "craneBluePink") {
    updateMessage("棚の上には、折り鶴が置かれている。");
    return;
  }

  removeItem("craneBluePink");
  flags.craneBluePinkSet = true;
  playSE?.("se-paper");
  markProgress?.("set_crane_blue_pink_on_shelf");
  renderCanvasRoom?.();
  updateMessage("青とピンクの折り鶴を棚に置いた。");
}

function handleShlfWoodenBoxClick() {
  const flags = getMainFlags();

  if (flags.shlfWoodenBoxCleaned) {
    showCleanedWoodenBoxModal();
    return;
  }

  if (gameState.selectedItem !== "wetPaper") {
    showObj(null, "汚れた木箱だ。", IMAGES.modals.boxDirty, "汚れた木箱がある。触りたくないな。");
    return;
  }

  removeItem("wetPaper");
  flags.shlfWoodenBoxCleaned = true;
  playSE?.("se-cloth");
  markProgress?.("clean_shlf_wooden_box");
  showObj(null, "汚れた箱を拭いた", IMAGES.modals.boxCleaning, "ウェットティッシュで汚れた箱を拭いた。");
}

function showCleanedWoodenBoxModal() {
  const flags = getMainFlags();
  const imageId = `shlfCleanedBox_${Date.now()}`;
  const canOpen = !flags.foundRemocon;
  const content = `<img id="${imageId}" class="showobj-image" src="${IMAGES.modals.boxCleaned}" alt="きれいになった木箱" style="${canOpen ? "cursor:pointer;" : ""}">`;
  showModal(
    "きれいになった木箱だ。",
    content,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );
  updateMessage("きれいになった木箱がある。");

  if (!canOpen) return;
  document.getElementById(imageId)?.addEventListener("click", () => {
    if (flags.foundRemocon) return;
    flags.foundRemocon = true;
    addItem("remocon");
    markProgress?.("find_remocon_in_wooden_box");
    showObj(null, "箱の中にリモコンがある", IMAGES.modals.boxOpen, "リモコンを手に入れた。");
  }, { once: true });
}

function showShlfLowerRightStoragePuzzle() {
  const flags = getMainFlags();
  if (flags.shlfLowerRightStorageUnlocked) {
    updateMessage("右下収納棚は開いている。");
    return;
  }

  const saved = Array.isArray(flags.shlfLowerRightStorageDigits)
    ? flags.shlfLowerRightStorageDigits
    : [0, 0];
  const digits = [0, 1].map((index) => {
    const value = Number(saved[index]);
    return Number.isInteger(value) && value >= 0 && value <= 9 ? value : 0;
  });
  flags.shlfLowerRightStorageDigits = digits.slice();

  const digitStyle = "box-sizing:border-box;width:min(24vw,100px);aspect-ratio:1;min-width:0;margin:0;padding:0;border:2px solid #777;border-radius:5px;background:#fff;color:#111;font-size:2.5rem;font-weight:900;cursor:pointer;";
  const content = `
    <div style="display:grid;grid-template-columns:repeat(2,minmax(60px,100px));gap:10px;justify-content:center;margin:8px auto 16px;">
      ${digits.map((digit, index) => `<button type="button" data-shlf-lower-storage-digit="${index}" aria-label="${index + 1}桁目" style="${digitStyle}">${digit}</button>`).join("")}
    </div>
    <p id="shlfLowerStorageGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("右下収納棚", content, [
    {
      text: "OK",
      action: () => {
        if (digits.join("") !== "77") {
          const guide = document.getElementById("shlfLowerStorageGuide");
          if (guide) guide.textContent = "数字が違うようだ。";
          playSE?.("se-error");
          return;
        }

        flags.shlfLowerRightStorageUnlocked = true;
        removeItem("memo");
        playSE?.("se-clear");
        markProgress?.("unlock_shlf_lower_right_storage");
        closeModal();
        startShlfLowerRightStorageOpenFx();
        updateMessage("カチッと音がして、右下収納棚が開いた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-shlf-lower-storage-digit]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.shlfLowerStorageDigit);
      digits[index] = (digits[index] + 1) % 10;
      flags.shlfLowerRightStorageDigits = digits.slice();
      button.textContent = String(digits[index]);
      const guide = document.getElementById("shlfLowerStorageGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function showDeskTopDrawerPuzzle() {
  const flags = getMainFlags();
  if (flags.deskTopDrawerUnlocked) {
    updateMessage("机の上段の引き出しは開いている。中にはもう何もない。");
    return;
  }

  const availableLetters = ["A", "E", "O", "R", "S", "T", "V", "W"];
  const saved = Array.isArray(flags.deskTopDrawerLetters)
    ? flags.deskTopDrawerLetters
    : ["A", "A", "A", "A"];
  const letters = [0, 1, 2, 3].map((index) =>
    availableLetters.includes(saved[index]) ? saved[index] : "A",
  );
  flags.deskTopDrawerLetters = letters.slice();

  const letterStyle = "box-sizing:border-box;width:min(19vw,88px);aspect-ratio:1;min-width:0;margin:0;padding:0;border:2px solid #777;border-radius:5px;background:#FFF3B0;color:#111;font-size:2.3rem;font-weight:900;cursor:pointer;";
  const content = `
    <div class="notranslate" translate="no" style="display:grid;grid-template-columns:repeat(4,minmax(50px,88px));gap:8px;justify-content:center;margin:8px auto 16px;">
      ${letters.map((letter, index) => `<button type="button" data-desk-top-drawer-letter="${index}" aria-label="${index + 1}文字目" style="${letterStyle}">${letter}</button>`).join("")}
    </div>
    <p id="deskTopDrawerGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("机の上段の引き出し", content, [
    {
      text: "OK",
      action: () => {
        if (letters.join("") !== "WAVE") {
          const guide = document.getElementById("deskTopDrawerGuide");
          if (guide) guide.textContent = "文字が違うようだ。";
          playSE?.("se-error");
          return;
        }

        flags.deskTopDrawerUnlocked = true;
        playSE?.("se-hikidashi");
        markProgress?.("unlock_desk_top_drawer");
        closeModal();
        acquireItemOnce(
          "foundMemoWave",
          "memoWave",
          "引き出しの中にメモが入っていた",
          IMAGES.modals.drawerUpper,
          "波模様のメモを手に入れた。",
        );
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-desk-top-drawer-letter]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.deskTopDrawerLetter);
      const currentIndex = availableLetters.indexOf(letters[index]);
      letters[index] = availableLetters[(currentIndex + 1) % availableLetters.length];
      flags.deskTopDrawerLetters = letters.slice();
      button.textContent = letters[index];
      const guide = document.getElementById("deskTopDrawerGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function showDeskBottomDrawerPuzzle() {
  const flags = getMainFlags();
  if (flags.deskBottomDrawerUnlocked) {
    updateMessage("机の下段の引き出しは開いている。中にはもう何もない。");
    return;
  }

  const icons = [
    { key: "iconFish", name: "魚" },
    { key: "iconTake", name: "竹" },
    { key: "iconApple", name: "りんご" },
    { key: "iconMountain", name: "山" },
    { key: "iconTorii", name: "鳥居" },
    { key: "iconLeaf", name: "葉" },
    { key: "iconFlower", name: "花" },
    { key: "iconIdo", name: "井戸" },
    { key: "iconBridge", name: "橋" },
  ];
  const answer = [2, 8, 7, 1];
  const saved = Array.isArray(flags.deskBottomDrawerIcons) ? flags.deskBottomDrawerIcons : [0, 0, 0, 0];
  const values = [0, 1, 2, 3].map((index) => {
    const value = Number(saved[index]);
    return Number.isInteger(value) && value >= 0 && value < icons.length ? value : 0;
  });
  flags.deskBottomDrawerIcons = values.slice();

  const squareStyle = "box-sizing:border-box;width:min(19vw,88px);aspect-ratio:1;min-width:0;margin:0;padding:7px;border:2px solid #888;border-radius:4px;background:#fff;cursor:pointer;";
  const content = `
    <div style="display:grid;grid-template-columns:repeat(4,minmax(50px,88px));gap:8px;justify-content:center;margin:8px auto 16px;">
      ${values.map((value, index) => `<button type="button" data-desk-bottom-drawer-icon="${index}" aria-label="${index + 1}番目：${icons[value].name}" style="${squareStyle}"><img src="${IMAGES.modals[icons[value].key]}" alt="${icons[value].name}" style="display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;"></button>`).join("")}
    </div>
    <p id="deskBottomDrawerGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("机の下段の引き出し", content, [
    {
      text: "OK",
      action: () => {
        if (!values.every((value, index) => value === answer[index])) {
          const guide = document.getElementById("deskBottomDrawerGuide");
          if (guide) guide.textContent = "絵柄が違うようだ。";
          playSE?.("se-error");
          return;
        }

        flags.deskBottomDrawerUnlocked = true;
        playSE?.("se-hikidashi");
        markProgress?.("unlock_desk_bottom_drawer");
        closeModal();
        acquireItemOnce(
          "foundTama",
          "tama",
          "引き出しの中に輝く玉が入っていた",
          IMAGES.modals.drawerBottom,
          "輝く玉を手に入れた。",
        );
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-desk-bottom-drawer-icon]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.deskBottomDrawerIcon);
      values[index] = (values[index] + 1) % icons.length;
      flags.deskBottomDrawerIcons = values.slice();
      const icon = icons[values[index]];
      const image = button.querySelector("img");
      if (image) {
        image.src = IMAGES.modals[icon.key];
        image.alt = icon.name;
      }
      button.setAttribute("aria-label", `${index + 1}番目：${icon.name}`);
      const guide = document.getElementById("deskBottomDrawerGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function startShlfLowerRightStorageOpenFx() {
  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  fxRoot.shlfLowerRightStorage = { roomId: "shlfZoom", progress: 0 };
  const duration = 900;
  const start = performance.now();

  const tick = (now) => {
    const fx = gameState.fx?.shlfLowerRightStorage;
    if (!fx) return;
    fx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (fx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }
    delete gameState.fx.shlfLowerRightStorage;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
  };
  requestAnimationFrame(tick);
}

function handleRabbitDirection(direction) {
  const flags = getMainFlags();
  flags.rabbitDirection = direction;
  const wasSolved = !!flags.rabbitPuzzleSolved;
  const sequence = Array.isArray(flags.rabbitSequence) ? flags.rabbitSequence : [];
  if (sequence.length >= RABBIT_PUZZLE_ANSWER.length) sequence.length = 0;
  const expected = RABBIT_PUZZLE_ANSWER[sequence.length];
  if (direction === expected) {
    sequence.push(direction);
  } else {
    sequence.length = 0;
    if (direction === RABBIT_PUZZLE_ANSWER[0]) sequence.push(direction);
  }
  flags.rabbitSequence = sequence;

  if (sequence.length === RABBIT_PUZZLE_ANSWER.length) {
    flags.rabbitPuzzleSolved = true;
    if (!wasSolved) markProgress?.("solve_rabbit_direction_puzzle");
    updateMessage("ウサギの背中に文字が浮かび上がった。");
  } else {
    updateMessage("ウサギがそちらへ頭を向けた。");
  }
  renderCanvasRoom?.();
}

function showRabbitDrawerPuzzle() {
  const flags = getMainFlags();
  if (flags.rabbitDrawerUnlocked) {
    if (!flags.foundWetPaper) {
      acquireItemOnce(
        "foundWetPaper",
        "wetPaper",
        "ウェットティッシュを見つけた",
        IMAGES.items.wetPaper,
        "ウェットティッシュを手に入れた。",
      );
      return;
    }
    updateMessage("引き出しの中にはもう何もない。");
    return;
  }

  const saved = Array.isArray(flags.rabbitDrawerLetterIndexes)
    ? flags.rabbitDrawerLetterIndexes
    : [0, 0, 0, 0, 0, 0];
  const indexes = [0, 1, 2, 3, 4, 5].map((position) => {
    const value = Number(saved[position]);
    return Number.isInteger(value) && value >= 0 && value < RABBIT_DRAWER_LETTERS.length ? value : 0;
  });
  flags.rabbitDrawerLetterIndexes = indexes.slice();

  const squareStyle = "box-sizing:border-box;width:min(13vw,72px);aspect-ratio:1;min-width:0;margin:0;padding:0;border:2px solid #aaa;border-radius:4px;background:#fff;color:#111;font-size:clamp(1.35rem,5vw,2rem);font-weight:800;cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,.18);";
  const content = `
    <div class="notranslate" translate="no" style="display:grid;grid-template-columns:repeat(6,minmax(38px,72px));gap:5px;justify-content:center;margin:8px auto 16px;">
      ${indexes.map((value, index) => `<button type="button" data-rabbit-drawer-letter="${index}" aria-label="${index + 1}文字目" style="${squareStyle}">${RABBIT_DRAWER_LETTERS[value]}</button>`).join("")}
    </div>
    <p id="rabbitDrawerGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("ウサギの置物の下の引き出し", content, [
    {
      text: "OK",
      action: () => {
        const answer = indexes.map((value) => RABBIT_DRAWER_LETTERS[value]).join("");
        if (answer !== RABBIT_DRAWER_ANSWER) {
          const guide = document.getElementById("rabbitDrawerGuide");
          if (guide) guide.textContent = "文字が違うようだ。";
          playSE?.("se-error");
          return;
        }

        flags.rabbitDrawerUnlocked = true;
        playSE?.("se-hikidashi");
        markProgress?.("unlock_rabbit_drawer");
        closeModal();
        acquireItemOnce(
          "foundWetPaper",
          "wetPaper",
          "引き出しの中にウェットティッシュが入っていた",
          IMAGES.items.wetPaper,
          "ウェットティッシュを手に入れた。",
        );
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-rabbit-drawer-letter]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.rabbitDrawerLetter);
      indexes[index] = (indexes[index] + 1) % RABBIT_DRAWER_LETTERS.length;
      flags.rabbitDrawerLetterIndexes = indexes.slice();
      button.textContent = RABBIT_DRAWER_LETTERS[indexes[index]];
      const guide = document.getElementById("rabbitDrawerGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

// ゲーム初期化
function initGame() {
  renderNavigation();
  changeRoom("mainZashiki");
  updateInventoryDisplay();
  updateMessage("気が付くと、座敷に立っていた。");
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
  if (END_IDS.has(roomId)) {
    keepOnlyTakeInInventory();
  }
  if (roomId === "rooftop") {
    addNaviItem("rooftop");
  }
  gameState.currentRoom = roomId;
  const room = rooms[roomId];

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
    changeBGM(S44("donguri_hiroi.mp3"));
  } else if (roomId === "escapeEnd") {
    changeBGM(S44("the_dream_of_hisui.mp3"));
  } else if (roomId === "end") {
    changeBGM(S44("amayadori.mp3"));
  } else {
    changeBGM(DEFAULT_BGM);
  }

  // nav

  if (END_IDS.has(roomId)) {
    gameState.openRooms = [];
    // renderNavigation();
  }
  renderNavigation();
}

const END_IDS = new Set(["end", "escapeEnd", "trueEnd"]);

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

  drawShlfUpperCabinetFx(ctx, canvas, roomId, bgImg);
  drawMainOshiireOpenFx(ctx, canvas, roomId, bgImg);
  drawOshiireJibukuroFx(ctx, canvas, roomId, bgImg);
  drawChibukuroBackWallOpening(ctx, canvas, roomId);
  drawShlfLowerRightStorageFx(ctx, canvas, roomId, bgImg);
  drawTokonomaLeftStorageFx(ctx, canvas, roomId, bgImg);
  drawKakejikuRollUpFx(ctx, canvas, roomId);
  drawRabbitPuzzle(ctx, canvas, roomId);

  // アイテム描画（未取得のみ）
  drawRoomItems(ctx, canvas, roomId);
  drawRooftopSpaceShipFx(ctx, canvas, roomId);
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

function drawRooftopSpaceShipFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.rooftopSpaceShip;
  if (roomId !== "rooftop" || !fx || fx.phase !== "arrival") return;

  const image = loadedImages[IMAGES.items.spaceShip];
  if (!image || !image.complete || image.naturalWidth <= 0) return;

  const room = rooms.rooftop;
  const moonArea = room.clickableAreas.find((area) => area.description === "月");
  const landingArea = room.clickableAreas.find((area) => area.description === "宇宙船着地点");
  if (!moonArea || !landingArea) return;

  const moon = getAreaDrawRect(moonArea, canvas);
  const landing = getAreaDrawRect(landingArea, canvas);
  const t = Math.max(0, Math.min(1, fx.progress || 0));
  const eased = 1 - Math.pow(1 - t, 3);
  const startScale = 0.12;
  const scale = startScale + (1 - startScale) * eased;
  const centerX = moon.x + moon.w / 2 + (landing.x + landing.w / 2 - (moon.x + moon.w / 2)) * eased;
  const centerY = moon.y + moon.h / 2 + (landing.y + landing.h / 2 - (moon.y + moon.h / 2)) * eased;
  const boxW = landing.w * scale;
  const boxH = landing.h * scale;
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const boxRatio = boxW / boxH;
  const drawW = boxRatio > imageRatio ? boxH * imageRatio : boxW;
  const drawH = boxRatio > imageRatio ? boxH : boxW / imageRatio;

  ctx.save();
  ctx.shadowColor = "rgba(210, 235, 255, 0.9)";
  ctx.shadowBlur = Math.max(6, 20 * scale);
  ctx.drawImage(image, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
  ctx.restore();
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

function drawShlfUpperCabinetFx(ctx, canvas, roomId, backgroundImage) {
  if (roomId !== "shlfZoom" || !getMainFlags().shlfUpperCabinetOpen) return;

  const areas = rooms.shlfZoom.clickableAreas;
  const area = areas.find((entry) => entry.description === "天袋スライド部");
  const leftTargetArea = areas.find((entry) => entry.description === "天袋左スライド後");
  const rightTargetArea = areas.find((entry) => entry.description === "天袋右スライド後");
  if (!area || !leftTargetArea || !rightTargetArea) return;
  const rect = getAreaDrawRect(area, canvas);
  const leftTarget = getAreaDrawRect(leftTargetArea, canvas);
  const rightTarget = getAreaDrawRect(rightTargetArea, canvas);
  const fx = gameState.fx?.shlfUpperCabinet;
  const totalT = fx ? Math.max(0, Math.min(1, Number(fx.progress) || 0)) : 1;
  const openT = Math.min(1, totalT / 0.3);
  const easedOpen = 1 - Math.pow(1 - openT, 3);

  ctx.save();
  ctx.fillStyle = "rgba(15, 10, 9, 0.96)";
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();

  if (backgroundImage?.complete && backgroundImage.naturalWidth > 0) {
    const sx = backgroundImage.naturalWidth * (area.x / 100);
    const sy = backgroundImage.naturalHeight * (area.y / 100);
    const sw = backgroundImage.naturalWidth * (area.width / 100);
    const sh = backgroundImage.naturalHeight * (area.height / 100);
    const sourceHalfW = sw / 2;
    const drawHalfW = rect.w / 2;
    const leftStart = { x: rect.x, y: rect.y, w: drawHalfW, h: rect.h };
    const rightStart = { x: rect.x + drawHalfW, y: rect.y, w: drawHalfW, h: rect.h };
    const mix = (startValue, endValue) => startValue + (endValue - startValue) * easedOpen;

    ctx.drawImage(
      backgroundImage,
      sx, sy, sourceHalfW, sh,
      mix(leftStart.x, leftTarget.x),
      mix(leftStart.y, leftTarget.y),
      mix(leftStart.w, leftTarget.w),
      mix(leftStart.h, leftTarget.h),
    );
    ctx.drawImage(
      backgroundImage,
      sx + sourceHalfW, sy, sourceHalfW, sh,
      mix(rightStart.x, rightTarget.x),
      mix(rightStart.y, rightTarget.y),
      mix(rightStart.w, rightTarget.w),
      mix(rightStart.h, rightTarget.h),
    );
  }

  ctx.save();
  ctx.strokeStyle = "rgba(44, 27, 17, 0.95)";
  ctx.lineWidth = Math.max(2, canvas.width * 0.004);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();

  if (!fx || totalT < 0.28) return;
  const fallT = Math.min(1, (totalT - 0.28) / 0.72);
  const colors = ["#4EA5D9", "#F08FB3"];
  colors.forEach((color, index) => {
    const delayedT = Math.max(0, Math.min(1, fallT * 1.14 - index * 0.14));
    if (delayedT <= 0) return;
    const easedFall = delayedT * delayedT * (3 - 2 * delayedT);
    const baseX = rect.x + rect.w * (index === 0 ? 0.43 : 0.57);
    const x = baseX + Math.sin(delayedT * Math.PI * (7 + index) + index) * canvas.width * 0.055;
    const y = rect.y + rect.h * 0.55 + (canvas.height * 0.76 - rect.y) * easedFall;
    const paperW = canvas.width * 0.09;
    const paperH = paperW * 0.72;
    const angle = Math.sin(delayedT * Math.PI * 8 + index * 1.7) * 0.65 + delayedT * Math.PI * (index ? -1.2 : 1.1);
    const fade = delayedT < 0.86 ? 1 : Math.max(0, (1 - delayedT) / 0.14);

    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = Math.max(4, canvas.width * 0.008);
    ctx.fillRect(-paperW / 2, -paperH / 2, paperW, paperH);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.0015);
    ctx.strokeRect(-paperW / 2, -paperH / 2, paperW, paperH);
    ctx.restore();
  });
}

function drawMainOshiireOpenFx(ctx, canvas, roomId, backgroundImage) {
  if (roomId !== "mainOshiire" || !getMainFlags().mainOshiireUnlocked) return;

  const areas = rooms.mainOshiire.clickableAreas;
  const fullArea = areas.find((entry) => entry.description === "押し入れ");
  const doorArea = areas.find((entry) => entry.description === "押し入れ開口部");
  if (!fullArea || !doorArea) return;

  const fullRect = getAreaDrawRect(fullArea, canvas);
  const doorRect = getAreaDrawRect(doorArea, canvas);
  const halfW = doorRect.w / 2;
  const fx = gameState.fx?.mainOshiireOpen;
  const t = fx ? Math.max(0, Math.min(1, Number(fx.progress) || 0)) : 1;
  const eased = 1 - Math.pow(1 - t, 3);
  const mix = (from, to) => from + (to - from) * eased;

  ctx.save();
  ctx.fillStyle = "rgba(10, 8, 7, 0.98)";
  ctx.fillRect(doorRect.x, doorRect.y, doorRect.w, doorRect.h);
  ctx.restore();

  if (backgroundImage?.complete && backgroundImage.naturalWidth > 0) {
    const sx = backgroundImage.naturalWidth * (doorArea.x / 100);
    const sy = backgroundImage.naturalHeight * (doorArea.y / 100);
    const sw = backgroundImage.naturalWidth * (doorArea.width / 100);
    const sh = backgroundImage.naturalHeight * (doorArea.height / 100);
    const sourceHalfW = sw / 2;

    ctx.drawImage(
      backgroundImage,
      sx, sy, sourceHalfW, sh,
      mix(doorRect.x, fullRect.x), doorRect.y, halfW, doorRect.h,
    );
    ctx.drawImage(
      backgroundImage,
      sx + sourceHalfW, sy, sourceHalfW, sh,
      mix(doorRect.x + halfW, fullRect.x + fullRect.w - halfW), doorRect.y, halfW, doorRect.h,
    );
  }
}

function drawOshiireJibukuroFx(ctx, canvas, roomId, backgroundImage) {
  if (roomId !== "mainOshiire" || !getMainFlags().oshiireJibukuroUnlocked) return;

  const areas = rooms.mainOshiire.clickableAreas;
  const doorArea = areas.find((entry) => entry.description === "地袋");
  const fullArea = areas.find((entry) => entry.description === "地袋全体");
  if (!doorArea || !fullArea) return;

  const doorRect = getAreaDrawRect(doorArea, canvas);
  const fullRect = getAreaDrawRect(fullArea, canvas);
  const halfW = doorRect.w / 2;
  const fx = gameState.fx?.oshiireJibukuro;
  const t = fx ? Math.max(0, Math.min(1, Number(fx.progress) || 0)) : 1;
  const eased = 1 - Math.pow(1 - t, 3);
  const mix = (from, to) => from + (to - from) * eased;

  ctx.save();
  ctx.fillStyle = "rgba(12, 9, 8, 0.97)";
  ctx.fillRect(doorRect.x, doorRect.y, doorRect.w, doorRect.h);
  ctx.restore();

  if (backgroundImage?.complete && backgroundImage.naturalWidth > 0) {
    const sx = backgroundImage.naturalWidth * (doorArea.x / 100);
    const sy = backgroundImage.naturalHeight * (doorArea.y / 100);
    const sw = backgroundImage.naturalWidth * (doorArea.width / 100);
    const sh = backgroundImage.naturalHeight * (doorArea.height / 100);
    const sourceHalfW = sw / 2;
    const targetY = fullRect.y;
    const targetH = fullRect.h;

    ctx.drawImage(
      backgroundImage,
      sx, sy, sourceHalfW, sh,
      mix(doorRect.x, fullRect.x),
      mix(doorRect.y, targetY),
      halfW,
      mix(doorRect.h, targetH),
    );
    ctx.drawImage(
      backgroundImage,
      sx + sourceHalfW, sy, sourceHalfW, sh,
      mix(doorRect.x + halfW, fullRect.x + fullRect.w - halfW),
      mix(doorRect.y, targetY),
      halfW,
      mix(doorRect.h, targetH),
    );
  }

  ctx.save();
  ctx.strokeStyle = "rgba(45, 27, 17, 0.9)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.0025);
  ctx.strokeRect(doorRect.x, doorRect.y, doorRect.w, doorRect.h);
  ctx.restore();
}

function drawChibukuroBackWallOpening(ctx, canvas, roomId) {
  if (roomId !== "chibukuroInner" || !getMainFlags().chibukuroBackWallOpen) return;

  const area = rooms.chibukuroInner.clickableAreas.find((entry) => entry.description === "奥の壁板");
  if (!area) return;
  const rect = getAreaDrawRect(area, canvas);
  const centerX = rect.x + rect.w / 2;
  const centerY = rect.y + rect.h * 0.48;
  const radius = Math.max(rect.w, rect.h) * 0.72;

  ctx.save();
  ctx.fillStyle = "rgba(3, 4, 7, 0.98)";
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

  const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  glow.addColorStop(0, "rgba(255, 247, 196, 0.34)");
  glow.addColorStop(0.35, "rgba(226, 237, 205, 0.18)");
  glow.addColorStop(1, "rgba(205, 225, 210, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

  ctx.strokeStyle = "rgba(241, 231, 185, 0.3)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.0025);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

function drawTokonomaLeftStorageFx(ctx, canvas, roomId, backgroundImage) {
  if (roomId !== "mainZashiki" || !getMainFlags().tokonomaLeftStorageUnlocked) return;

  const area = rooms.mainZashiki.clickableAreas.find((entry) => entry.description === "床の間左の収納");
  if (!area) return;
  const rect = getAreaDrawRect(area, canvas);
  const halfW = rect.w / 2;
  const fx = gameState.fx?.tokonomaLeftStorage;
  const t = fx ? Math.max(0, Math.min(1, Number(fx.progress) || 0)) : 1;
  const eased = 1 - Math.pow(1 - t, 3);

  ctx.save();
  ctx.fillStyle = "rgba(13, 9, 8, 0.97)";
  ctx.fillRect(rect.x + halfW, rect.y, halfW, rect.h);
  ctx.restore();

  if (backgroundImage?.complete && backgroundImage.naturalWidth > 0) {
    const sx = backgroundImage.naturalWidth * ((area.x + area.width / 2) / 100);
    const sy = backgroundImage.naturalHeight * (area.y / 100);
    const sw = backgroundImage.naturalWidth * (area.width / 2 / 100);
    const sh = backgroundImage.naturalHeight * (area.height / 100);
    const drawX = rect.x + halfW * (1 - eased);
    ctx.drawImage(backgroundImage, sx, sy, sw, sh, drawX, rect.y, halfW, rect.h);
  }

  ctx.save();
  ctx.strokeStyle = "rgba(45, 27, 17, 0.9)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.0025);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

function drawShlfLowerRightStorageFx(ctx, canvas, roomId, backgroundImage) {
  if (roomId !== "shlfZoom" || !getMainFlags().shlfLowerRightStorageUnlocked) return;

  const area = rooms.shlfZoom.clickableAreas.find((entry) => entry.description === "右下収納棚");
  if (!area) return;
  const rect = getAreaDrawRect(area, canvas);
  const halfW = rect.w / 2;
  const fx = gameState.fx?.shlfLowerRightStorage;
  const t = fx ? Math.max(0, Math.min(1, Number(fx.progress) || 0)) : 1;
  const eased = 1 - Math.pow(1 - t, 3);

  ctx.save();
  ctx.fillStyle = "rgba(13, 9, 8, 0.97)";
  ctx.fillRect(rect.x + halfW, rect.y, halfW, rect.h);
  ctx.restore();

  if (backgroundImage?.complete && backgroundImage.naturalWidth > 0) {
    const sx = backgroundImage.naturalWidth * ((area.x + area.width / 2) / 100);
    const sy = backgroundImage.naturalHeight * (area.y / 100);
    const sw = backgroundImage.naturalWidth * (area.width / 2 / 100);
    const sh = backgroundImage.naturalHeight * (area.height / 100);
    const drawX = rect.x + halfW * (1 - eased);
    ctx.drawImage(backgroundImage, sx, sy, sw, sh, drawX, rect.y, halfW, rect.h);
  }

  ctx.save();
  ctx.strokeStyle = "rgba(45, 27, 17, 0.9)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.0025);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

function drawRabbitPuzzle(ctx, canvas, roomId) {
  if (roomId !== "rabbitPuzzle") return;

  const flags = getMainFlags();
  const rabbitImage = loadedImages[IMAGES.items.rabbit];
  if (!rabbitImage?.complete || rabbitImage.naturalWidth <= 0) return;

  const directionAngles = {
    right: 0,
    down: Math.PI / 2,
    left: Math.PI,
    up: -Math.PI / 2,
  };
  const direction = directionAngles[flags.rabbitDirection] === undefined ? "right" : flags.rabbitDirection;
  const angle = directionAngles[direction];
  const centerX = canvas.width * 0.5;
  const centerY = canvas.height * 0.5;
  const imageW = canvas.width * 0.4;
  const imageH = imageW * (rabbitImage.naturalHeight / rabbitImage.naturalWidth);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
  ctx.drawImage(rabbitImage, -imageW / 2, -imageH / 2, imageW, imageH);
  ctx.restore();

  const matchedCount = Math.min(
    RABBIT_PUZZLE_LETTERS.length,
    Array.isArray(flags.rabbitSequence) ? flags.rabbitSequence.length : 0,
  );
  if (matchedCount <= 0) return;

  const visibleLetters = RABBIT_PUZZLE_LETTERS[matchedCount - 1];
  ctx.save();
  ctx.font = `900 ${Math.round(canvas.width * 0.064)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(3, canvas.width * 0.006);
  ctx.strokeStyle = "#0B2F6B";
  ctx.fillStyle = "#2F80ED";
  ctx.shadowColor = "rgba(102, 204, 255, 0.95)";
  ctx.shadowBlur = Math.max(8, canvas.width * 0.018);
  ctx.strokeText(visibleLetters, centerX, centerY);
  ctx.fillText(visibleLetters, centerX, centerY);
  ctx.restore();
}

function drawKakejikuRollUpFx(ctx, canvas, roomId) {
  if (roomId !== "mainZashiki" || !getMainFlags().kakejikuRaised) return;

  const area = rooms.mainZashiki.clickableAreas.find((entry) => entry.description === "掛け軸");
  const image = loadedImages[IMAGES.items.kakejiku];
  if (!area || !image?.complete || image.naturalWidth <= 0) return;

  const rect = getAreaDrawRect(area, canvas);
  const fx = gameState.fx?.kakejikuRollUp;
  const t = fx ? Math.max(0, Math.min(1, Number(fx.progress) || 0)) : 1;
  const eased = 1 - Math.pow(1 - t, 3);
  const visibleRatio = 1 - eased * 0.84;
  const sourceH = image.naturalHeight * visibleRatio;
  const drawH = rect.h * visibleRatio;

  ctx.save();
  ctx.drawImage(
    image,
    0, 0, image.naturalWidth, sourceH,
    rect.x, rect.y, rect.w, drawH,
  );

  const rollH = Math.max(canvas.height * 0.012, rect.h * 0.055);
  const rollY = rect.y + drawH - rollH * 0.45;
  const gradient = ctx.createLinearGradient(rect.x, rollY, rect.x, rollY + rollH);
  gradient.addColorStop(0, "#243747");
  gradient.addColorStop(0.5, "#587082");
  gradient.addColorStop(1, "#172631");
  ctx.fillStyle = gradient;
  ctx.shadowColor = "rgba(0,0,0,.42)";
  ctx.shadowBlur = Math.max(3, canvas.width * 0.005);
  roundRect(ctx, rect.x + rect.w * 0.03, rollY, rect.w * 0.94, rollH, rollH / 2, true, false);
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

function playRooftopPanelClearFlash() {
  const flash = document.getElementById("fxFlash");
  if (!flash) return;

  flash.getAnimations?.().forEach((animation) => animation.cancel());
  flash.animate(
    [
      { opacity: 0, background: "#fff", offset: 0 },
      { opacity: 0.92, background: "#fff", offset: 0.2 },
      { opacity: 0, background: "#fff", offset: 1 },
    ],
    { duration: 600, easing: "ease-out" },
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

function showRooftopInputPanelPuzzle() {
  const flags = getMainFlags();
  if (flags.rooftopPanelCleared) {
    updateMessage("入力パネルは光を失った");
    return;
  }
  if (!Array.isArray(flags.rooftopPanelMarks) || flags.rooftopPanelMarks.length !== 9) {
    flags.rooftopPanelMarks = Array(9).fill("・");
  }

  const puzzleId = `rooftopPanel_${Date.now()}`;
  const cells = flags.rooftopPanelMarks.map((mark, index) => `
    <button
      type="button"
      id="${puzzleId}_${index}"
      class="rooftop-panel-cell"
      data-index="${index}"
      style="width:72px;height:72px;background:#fff;color:#111;border:2px solid #777;border-radius:4px;font-size:32px;line-height:1;cursor:pointer;"
    >${mark}</button>
  `).join("");

  const content = `
    <div id="${puzzleId}" style="display:grid;grid-template-columns:repeat(3,72px);gap:8px;justify-content:center;margin:18px auto 22px;">
      ${cells}
    </div>
  `;

  showModal(
    "入力パネル",
    content,
    [
      {
        text: "OK",
        action: () => {
          const answer = ["・", "・", "・", "｜", "｜", "｜", "・", "・", "・"];
          const isCorrect = answer.every((mark, index) => flags.rooftopPanelMarks[index] === mark);
          if (!isCorrect) {
            updateMessage("入力が違うようだ。");
            return;
          }

          flags.rooftopPanelCleared = true;
          markProgress?.("clear_rooftop_input_panel");
          closeModal();
          playRooftopPanelClearFlash();
          startRooftopSpaceShipArrivalFx();
        },
      },
      { text: "閉じる", action: "close" },
    ],
    null,
    { contentClass: "showobj-modal" },
  );

  document.querySelectorAll(`#${puzzleId} .rooftop-panel-cell`).forEach((cell) => {
    cell.addEventListener("click", () => {
      const index = Number(cell.dataset.index);
      const nextMark = flags.rooftopPanelMarks[index] === "・" ? "｜" : "・";
      flags.rooftopPanelMarks[index] = nextMark;
      cell.textContent = nextMark;
      playSE?.("se-click");
    });
  });

  updateMessage("入力パネルに九つの白いマスが並んでいる。");
}

function startRooftopSpaceShipArrivalFx() {
  const flags = getMainFlags();
  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  fxRoot.rooftopSpaceShip = {
    roomId: "rooftop",
    phase: "signal",
    progress: 0,
  };
  renderCanvasRoom?.();
  updateMessage("？？？");

  let arrivalStarted = false;
  const beginArrival = () => {
    if (arrivalStarted) return;
    arrivalStarted = true;
    playSE?.("se-gogogo");

    const fx = fxRoot.rooftopSpaceShip;
    if (!fx) return;
    fx.phase = "arrival";
    const duration = 4200;
    const start = performance.now();

    const tick = (now) => {
      const activeFx = gameState.fx?.rooftopSpaceShip;
      if (!activeFx) return;
      activeFx.progress = Math.min(1, (now - start) / duration);
      renderCanvasRoom?.();

      if (activeFx.progress < 1) {
        requestAnimationFrame(tick);
        return;
      }

      flags.spaceShipLanded = true;
      delete gameState.fx.rooftopSpaceShip;
      gameState.fx.lockInput = false;
      markProgress?.("spaceship_arrived_on_rooftop");
      renderCanvasRoom?.();
      updateMessage("？？？");
    };

    requestAnimationFrame(tick);
  };

  const sos = document.getElementById("se-sos");
  if (!sos) {
    beginArrival();
    return;
  }

  sos.currentTime = 0;
  sos.addEventListener("ended", beginArrival, { once: true });
  const playPromise = sos.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(beginArrival);
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
      title: "🌕 TRUE END",
      label: "TRUE END",
      desc: "かぐや姫と一緒に月に到着しました。おめでとうございます！",
    },

    end: {
      title: "🥷 NORMAL END ",
      label: "NORMAL",
      desc: "賊に襲われた屋敷から脱出できました。おめでとうございます！",
    },

    escapeEnd: {
      title: "🎋 ESCAPE END",
      label: "ESCAPE END",
      desc: "かぐや姫を連れ、賊の追跡をかわして屋敷から脱出しました！",
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

    case "escapeEnd":
      secretText = "🐻 かぐや姫を守り抜きました";
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSePA5SWP6jmv8k1NfEZ998pS_l6BBeA7MV1ZA7YHRqo7iTv0Q/viewform";
  const endingLabel =
    {
      trueEnd: "トゥルーエンド",
      escapeEnd: "逃走エンド",
      end: "ノーマルエンド",
    }[endingId] || "エンド";

  const params = new URLSearchParams({
    "entry.666725843": endingLabel,
  });

  window.open(`${FEEDBACK_URL}?${params.toString()}`, "_blank");
}

function markProgress(step, extra = {}) {
  ANA.once("progress", step, { step, ...extra });
}

function getDefaultGameState() {
  return {
    currentRoom: "mainZashiki",
    openRooms: ["mainZashiki"],
    openRoomsTmp: [],
    inventory: [],
    main: {
      flags: {
        himoCut: false,
        foundHimo: false,
        oshiireRightOpen: false,
        oshiireRightColors: [0, 0, 0],
        mainOshiireUnlocked: false,
        mainOshiireDigits: [0, 0, 0],
        foundLadder: false,
        ladderPlaced: false,
        foundBranch: false,
        setBranch: false,
        tamaSetInTsubo: false,
        foundKeyShine: false,
        unlockCage: false,
        foundKaguyahime: false,
        foundTake: false,
        kaguyahimeTalkedOnce: false,
        kaguyahimeRopeCount: 0,
        zokuMoved: false,
        foundMaster: false,
        setKaguyahime: false,
        rooftopPanelMarks: ["・", "・", "・", "・", "・", "・", "・", "・", "・"],
        rooftopPanelCleared: false,
        spaceShipLanded: false,
        oshiireJibukuroUnlocked: false,
        oshiireJibukuroSequence: [],
        chibukuroBackWallOpen: false,
        ceilDoorOpen: false,
        shlfUpperCabinetOpen: false,
        foundOrigamiBluePink: false,
        madeCraneBluePink: false,
        craneBluePinkSet: false,
        tokonomaLeftStorageUnlocked: false,
        tokonomaLeftStorageLetters: ["A", "A", "A", "A"],
        foundScissors: false,
        rabbitDirection: "right",
        rabbitSequence: [],
        rabbitPuzzleSolved: false,
        rabbitDrawerUnlocked: false,
        rabbitDrawerLetterIndexes: [0, 0, 0, 0, 0, 0],
        foundWetPaper: false,
        shlfWoodenBoxCleaned: false,
        foundRemocon: false,
        remoconBatterySet: false,
        foundMemo: false,
        deskTopDrawerUnlocked: false,
        deskTopDrawerLetters: ["A", "A", "A", "A"],
        foundMemoWave: false,
        deskBottomDrawerUnlocked: false,
        deskBottomDrawerIcons: [0, 0, 0, 0],
        foundTama: false,
        shlfLowerRightStorageUnlocked: false,
        shlfLowerRightStorageDigits: [0, 0],
        foundBattery: false,
        remoconButtonCounts: [0, 0, 0],
        kakejikuRaised: false,

        talkTo: { bear: 0, wizard: 0 },
      },
    },

    end: { flags: {} },
    escapeEnd: { flags: { backgroundState: 0 } },
    trueEnd: {
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

  const showsKaguyahimeWithMaster =
    (selectedItem === "kaguyahime" && clickedItem === "master")
    || (selectedItem === "master" && clickedItem === "kaguyahime");
  if (showsKaguyahimeWithMaster && gameState.selectedItemSlot !== slotIndex) {
    gameState.selectedItem = null;
    gameState.selectedItemSlot = null;
    updateInventoryDisplay();
    showObj(
      null,
      "「ご主人・・・まだ息はあるぞ」",
      IMAGES.modals.kaguyahimeCrying,
      "「ご主人・・・まだ息はあるぞ」",
    );
    return;
  }

  const combinesHimoAndShoeHorn =
    (selectedItem === "himo" && clickedItem === "shoeHorn")
    || (selectedItem === "shoeHorn" && clickedItem === "himo");
  if (combinesHimoAndShoeHorn && gameState.selectedItemSlot !== slotIndex) {
    combineHimoAndShoeHorn();
    return;
  }

  const combinesRemoconAndBattery =
    (selectedItem === "remocon" && clickedItem === "battery")
    || (selectedItem === "battery" && clickedItem === "remocon");
  if (combinesRemoconAndBattery && gameState.selectedItemSlot !== slotIndex) {
    combineRemoconAndBattery();
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

function combineHimoAndShoeHorn() {
  removeItemsOnEndingArrival(["himo", "shoeHorn"]);
  addItem("hook");
  markProgress?.("make_hook_with_himo_and_shoe_horn");
  showObj(
    null,
    "靴ベラに紐を巻き付けた",
    IMAGES.items.hook,
    "靴ベラに紐を巻き付けた",
  );
}

function combineRemoconAndBattery() {
  const flags = getMainFlags();
  removeItemsOnEndingArrival(["remocon", "battery"]);
  flags.remoconBatterySet = true;
  addItem("remoconSetBattery");
  markProgress?.("set_battery_in_remocon");
  showObj(
    null,
    "リモコンに電池を入れた",
    IMAGES.items.remoconSetBattery,
    "電池を入れたリモコンを手に入れた。",
  );
}

function showRemoconButtonPuzzle() {
  const flags = getMainFlags();
  if (flags.kakejikuRaised) {
    closeModal();
    updateMessage("リモコンはすでに作動したようだ。");
    return;
  }

  const saved = Array.isArray(flags.remoconButtonCounts) ? flags.remoconButtonCounts : [0, 0, 0];
  const counts = [0, 1, 2].map((index) => {
    const value = Number(saved[index]);
    return Number.isInteger(value) && value >= 0 ? value : 0;
  });
  flags.remoconButtonCounts = counts.slice();

  const remoteButtonStyle = "box-sizing:border-box;width:min(22vw,88px);aspect-ratio:1;margin:0;padding:0;border:2px solid #aebbb0;border-radius:14px;background:#fff;cursor:pointer;box-shadow:0 0 10px rgba(116,255,142,.42),inset 0 0 12px rgba(138,255,158,.2);transition:filter .1s,transform .1s,box-shadow .1s;";
  const content = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin:8px auto 16px;">
      ${counts.map((_, index) => `<button type="button" data-remocon-button="${index}" aria-label="上から${index + 1}番目のボタン" style="${remoteButtonStyle}"></button>`).join("")}
    </div>
    <p id="remoconButtonGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("リモコン", content, [
    {
      text: "OK",
      action: () => {
        const correct = counts[0] === 2 && counts[1] === 3 && counts[2] === 1;
        if (!correct) {
          counts.fill(0);
          flags.remoconButtonCounts = counts.slice();
          const guide = document.getElementById("remoconButtonGuide");
          if (guide) guide.textContent = "反応がない。入力がリセットされた。";
          playSE?.("se-error");
          return;
        }

        playSE?.("se-gogogo");
        removeItem("remoconSetBattery");
        markProgress?.("raise_main_zashiki_kakejiku");
        closeModal();
        changeRoom("mainZashiki");
        flags.kakejikuRaised = true;
        startKakejikuRollUpFx();
        updateMessage("リモコンが反応し、掛け軸が巻き上がり始めた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-remocon-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.remoconButton);
      counts[index] += 1;
      flags.remoconButtonCounts = counts.slice();
      button.setAttribute("aria-label", `上から${index + 1}番目のボタン、${counts[index]}回押下`);
      button.style.transform = "scale(.96)";
      button.style.boxShadow = "0 0 18px rgba(116,255,142,.85),inset 0 0 18px rgba(138,255,158,.42)";
      setTimeout(() => {
        button.style.transform = "";
        button.style.boxShadow = "0 0 10px rgba(116,255,142,.42),inset 0 0 12px rgba(138,255,158,.2)";
      }, 110);
      const guide = document.getElementById("remoconButtonGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function startKakejikuRollUpFx() {
  if (gameState.currentRoom !== "mainZashiki") {
    renderCanvasRoom?.();
    return;
  }

  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  fxRoot.kakejikuRollUp = { roomId: "mainZashiki", progress: 0 };
  const duration = 2400;
  const start = performance.now();

  const tick = (now) => {
    const fx = gameState.fx?.kakejikuRollUp;
    if (!fx) return;
    fx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (fx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }
    delete gameState.fx.kakejikuRollUp;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
  };
  requestAnimationFrame(tick);
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
    key: "カギ",
    battery: "電池",
    memo: "メモ",
    memoWave: "波模様のメモ",
    ladder: "はしご",
    tama: "輝く玉",
    branch: "枝",
    keyShine: "輝くカギ",
    kaguyahime: "かぐや姫",
    take: "竹",
    master: "屋敷の主人",

    origamiBluePink: "青とピンクの折り紙",
    craneBluePink: "青とピンクの折り鶴",
    scissors: "はさみ",
    himo: "丈夫そうな紐",
    shoeHorn: "靴ベラ",
    hook: "フック",
    wetPaper: "ウェットティッシュ",
    remocon: "リモコン",
    remoconSetBattery: "電池を入れたリモコン",

  };
  return names[itemId] || itemId;
}

function openInventoryItemDetail(itemId, slotIndex, fallbackSrc) {
  const itemBaseSrc = IMAGES.items[itemId] || fallbackSrc;
  const itemEnSrc = IMAGES.items[`${itemId}En`];
  const hasEnVariant = !!itemEnSrc;

  let content = `<img src="${itemBaseSrc}" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`;
  let buttons = [{ text: "閉じる", action: "close" }];

  if (itemId === "remocon") {
    content += '<p style="margin:0;text-align:center;font-weight:700;">電池が入っていないようだ。</p>';
  }

  if (itemId === "take") {
    content += '<p style="margin:0;text-align:center;font-weight:700;">少し重さがある</p>';
  }

  if (itemId === "remoconSetBattery") {
    buttons = [
      { text: "ボタンを押す", action: showRemoconButtonPuzzle },
      { text: "閉じる", action: "close" },
    ];
  }

  if (itemId === "kaguyahime") {
    buttons = [
      { text: "話す", action: showKaguyahimeDialogue },
      { text: "閉じる", action: "close" },
    ];
  }


  showModal(getItemName(itemId), content, buttons);
}

function showKaguyahimeDialogue() {
  const flags = getMainFlags();
  let dialogue = "屋敷の主人殿が、月へ帰してくださると言うので待っておったのじゃが……。いったい、どこへ行かれたのかのう";

  if (flags.kaguyahimeTalkedOnce) {
    dialogue = "上の方から月の光を感じるのう。";
  }

  if (gameState.currentRoom === "rooftop") {
    dialogue = "あの台に立てば、月へ合図を送れるかもしれぬ";
  }

  flags.kaguyahimeTalkedOnce = true;

  showObj(
    null,
    `「${dialogue}」`,
    IMAGES.items.kaguyahime,
    `かぐや姫は言った。「${dialogue}」`,
  );
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
