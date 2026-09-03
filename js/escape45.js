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
const USE_LOCAL_ASSETS = location.protocol === "file:" || location.hostname === "localhost" || location.search.includes("localimg=1");
const BASE_45 = USE_LOCAL_ASSETS ? "images/45" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/45";
const BASE_SOUND_45 = USE_LOCAL_ASSETS ? "sounds/45" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/45";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I45 = (file) => `${BASE_45}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S45 = (file) => `${BASE_SOUND_45}/${file}`;
const DEFAULT_BGM = S45("chill_summer.mp3");

// ゲーム設定 - 画像パスをここで管理
IMAGES = {
  rooms: {
    mainTable: [I45("main_table.webp")],
    drinkBar: [I45("drink_bar.webp")],
    entranceLeft: [I45("entrance_left.webp")],
    restRoom: [I45("rest_room.webp")],
    entranceRight: [I45("entrance_right.webp")],
    register: [I45("register.webp")],
    tabletLunch: [I45("tablet_lunch.webp")],
    tabletDessert: [I45("tablet_dessert.webp")],
    end: [I45("end.webp")],
    takeoutEnd: [I45("takeout_end.webp")],
    escapeEnd: [I45("end2.webp"), I45("escape_end2.webp")],
    trueEnd: [I45("true_end.webp"), I45("true_end2.webp")],
  },
  items: {
    bear: ICM("bear.png"),
    back: ICM("common/back.png"),
    arrowRight: ICM("common/arrow_right.png"),
    arrowLeft: ICM("common/arrow_left.png"),
    blackBack: ICM("common/black_back.png"),
    lang_en: ICM("common/en2.png"),
    lang_jp: ICM("common/jp.png"),
    key: ICM("common/key.webp"),
    battery: ICM("common/battery.webp"),




    cutleryFuta: I45("cutlery_futa.webp"),
    cutleryAfter: I45("cutlery_after.webp"),
    fork: I45("fork.webp"),
    glass: I45("glass_empty.webp"),
    glassEmpty: I45("glass_empty.webp"),
    glassIceMax: I45("glass_ice_max.webp"),
    glassNoIceOrange: I45("glass_no_ice_orange.webp"),
    glassNoIceMelon: I45("glass_no_ice_melon.webp"),
    glassNoIceGrape: I45("glass_no_ice_grape.webp"),
    glassIceOrange: I45("glass_ice_orange.webp"),
    glassIceMelon: I45("glass_ice_melon.webp"),
    glassIceGrape: I45("glass_ice_grape.webp"),
    glassIceCoffee: I45("glass_ice_coffee.webp"),
    cup: I45("cup_empty.webp"),
    cupEmpty: I45("cup_empty.webp"),
    cupCorn: I45("cup_corn.webp"),
    cupTomato: I45("cup_tomato.webp"),
    cupBroc: I45("cup_broc.webp"),
    ticketTakeout: I45("ticket_takeout.webp"),
    leverCover: I45("lever_cover.webp"),
    lever: I45("lever.webp"),
    bearSeated1: I45("bear_seated1.webp"),
    bearSeated2: I45("bear_seated2.webp"),
    bearSeated3: I45("bear_seated3.webp"),
    pastaMeatSauce: I45("pasta_meat_sauce.webp"),
    pastaCarbo: I45("pasta_carbo.webp"),
    pastaWahuKinoko: I45("pasta_wahu_kinoko.webp"),
    pastaMeatSauceAfter: I45("pasta_meat_sauce_after.webp"),
    pastaCarboAfter: I45("pasta_carbo_after.webp"),
    pastaWahuKinokoAfter: I45("pasta_wahu_kinoko_after.webp"),
    macchaIce: I45("maccha_ice.webp"),
    zuccotto: I45("zuccotto.webp"),
    tiramisu: I45("tiramisu.webp"),
    pudding: I45("pudding.webp"),
    ticket: I45("ticket.webp"),
    ticket2: I45("ticket2.webp"),
    takeoutBox: I45("takeout_box.webp"),
    slitCover: I45("slit_cover.webp"),
    registerDisp: I45("register_disp.webp"),


    take: I45("take.webp"),
    master: I45("master.webp"),



  },
  modals: {
    registerButtons: I45("modal_register_buttons.webp"),
    doughnuts: I45("modal_doughnuts.webp"),
    posterBear: I45("modal_poster_bear.webp"),
    posterLeaf: I45("modal_poster_leaf.webp"),
    dessert1: I45("modal_dessert1.webp"),
    dessert2: I45("modal_dessert2.webp"),
    dessert3: I45("modal_dessert3.webp"),
    dessert4: I45("modal_dessert4.webp"),
    dessert1En: I45("modal_dessert1_en.webp"),
    dessert2En: I45("modal_dessert2_en.webp"),
    dessert3En: I45("modal_dessert3_en.webp"),
    dessert4En: I45("modal_dessert4_en.webp"),
    glassIce1: I45("glass_ice1.webp"),
    glassIce2: I45("glass_ice2.webp"),
    glassIce3: I45("glass_ice3.webp"),
    glassIce4: I45("glass_ice4.webp"),
    juiceDispenser: I45("modal_juice_dispenser.webp"),
    cornSoup: I45("modal_corn_soup.webp"),
    tomatoSoup: I45("modal_tomato_soup.webp"),
    brocSoup1: I45("modal_broc_soup1.webp"),
    brocSoup2: I45("modal_broc_soup2.webp"),
    wantToilet: I45("modal_want_toilet.webp"),
    sink: I45("modal_sink.webp"),
    coffeeMachine: I45("modal_coffee_machine.webp"),
    coffeeMachineLever: I45("modal_coffee_machine_lever.webp"),
    coffeeMachineLeverSet: I45("modal_coffee_machine_lever_set.webp"),
    bearHopeCoffee: I45("modal_bear_hope_coffee.webp"),
    bearThanks: I45("modal_bear_thanks.webp"),
    bearCoffeePouring: I45("modal_bear_coffee_pouring.webp"),
    eatingMeatSauce: I45("modal_eating_meat_sauce.webp"),
    eatingCarbo: I45("modal_eating_carbo.webp"),
    eatingWahuKinoko: I45("modal_eating_wahu_kinoko.webp"),
    macchaIce: I45("modal_maccha_ice.webp"),
    zuccotto: I45("modal_zuccotto.webp"),
    tiramisu: I45("modal_tiramisu.webp"),
    pudding: I45("modal_pudding.webp"),
    bearSurprise: I45("modal_bear_surprise.webp"),
    bearEatingMacchaIce: I45("modal_bear_eating_maccha_ice.webp"),
    bearEatingZuccotto: I45("modal_bear_eating_zuccotto.webp"),
    bearEatingTiramisu: I45("modal_bear_eating_tiramisu.webp"),
    bearEatingPudding: I45("modal_bear_eating_pudding.webp"),
    tabletLock: I45("modal_tablet_lock.webp"),
    keyStorageLeft: I45("key_storage_left.webp"),
    keyStorageRight: I45("key_storage_right.webp"),




    kaguyahimeEating: I45("modal_kaguyahime_eating.webp"),
    iconTomato: I45("icon_tomato.webp"),
    iconCorn: I45("icon_corn.webp"),
    iconBroc: I45("icon_broc.webp"),
    kaguyaMaster: I45("modal_kaguya_master.webp"),

    // badend: I45("badend.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState45";
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

const TABLET_LUNCH_PASTAS = [
  {
    id: "mushroom",
    jp: { name: "和風キノコ", size: "大盛" },
    en: { name: "Japanese-style Mushroom", size: "Large" },
  },
  {
    id: "meatSauce",
    jp: { name: "ミートソース", size: "普通盛" },
    en: { name: "Meat Sauce", size: "Regular" },
  },
  {
    id: "carbonara",
    jp: { name: "カルボナーラ", size: "小盛" },
    en: { name: "Carbonara", size: "Small" },
  },
];

const TABLET_DESSERT_CODES = {
  cha: { image: "macchaIce", bearEating: "bearEatingMacchaIce", jp: "抹茶アイス", en: "Matcha Ice Cream" },
  nuts: { image: "zuccotto", bearEating: "bearEatingZuccotto", jp: "ズコット", en: "Zuccotto" },
  cocoa: { image: "tiramisu", bearEating: "bearEatingTiramisu", jp: "ティラミス", en: "Tiramisu" },
  purin: { image: "pudding", bearEating: "bearEatingPudding", jp: "プリン", en: "Pudding" },
};

const TABLET_LUNCH_TEXT = {
  jp: {
    lunch: "ランチ",
    dessert: "デザート",
    guideMain: "ランチセットをお選びください",
    guideSub: "すべてドリンク・スープバー付き",
    language: "English",
    order: "注文",
    orderedButton: "注文済み",
    comingSoon: "デザートは準備中です",
    ordered: "を注文しました。",
  },
  en: {
    lunch: "Lunch",
    dessert: "Dessert",
    guideMain: "Please choose a lunch set",
    guideSub: "All sets include the drink and soup bar",
    language: "日本語",
    order: "Order",
    orderedButton: "Ordered",
    comingSoon: "Dessert is coming soon",
    ordered: " has been ordered.",
  },
};

function getTabletLunchState() {
  if (!gameState.tabletLunch || typeof gameState.tabletLunch !== "object") {
    gameState.tabletLunch = {};
  }
  if (!['lunch', 'dessert'].includes(gameState.tabletLunch.activeTab)) {
    gameState.tabletLunch.activeTab = "lunch";
  }
  if (!TABLET_LUNCH_PASTAS.some((pasta) => pasta.id === gameState.tabletLunch.selectedPasta)) {
    gameState.tabletLunch.selectedPasta = null;
  }
  if (typeof gameState.tabletLunch.dessertCode !== "string") {
    gameState.tabletLunch.dessertCode = "";
  }
  if (!TABLET_DESSERT_CODES[gameState.tabletLunch.selectedDessert]) {
    gameState.tabletLunch.selectedDessert = null;
  }
  if (!TABLET_DESSERT_CODES[gameState.tabletLunch.orderedDessert]) {
    gameState.tabletLunch.orderedDessert = null;
  }
  if (typeof gameState.tabletLunch.dessertEaten !== "boolean") {
    gameState.tabletLunch.dessertEaten = false;
  }
  return gameState.tabletLunch;
}

function hasOrderedLunch() {
  return !!getTabletLunchState().orderedPasta;
}

function getOrderedDessertImageKey() {
  const state = getTabletLunchState();
  if (state.dessertEaten) return null;
  const dessert = TABLET_DESSERT_CODES[state.orderedDessert];
  return dessert?.image || null;
}

function showBearEatingDessert() {
  const state = getTabletLunchState();
  if (state.dessertEaten) return;
  const dessert = TABLET_DESSERT_CODES[state.orderedDessert];
  if (!dessert) return;

  updateMessage("「わあ、ボクの？むしゃむしゃ・・・」");
  playSE?.("se-eat");
  const content = `
    <div class="modal-anim">
      <img src="${IMAGES.modals.bearSurprise}" alt="デザートに驚くクマ妖精">
      <img src="${IMAGES.modals[dessert.bearEating]}" alt="${dessert.jp}を食べるクマ妖精">
    </div>`;
  const finishEatingDessert = () => {
    state.dessertEaten = true;
    markProgress?.("bear_eats_dessert", { dessert: state.orderedDessert });
    updateMessage("クマ妖精はデザートをきれいに食べ終えた。");
    flashInventoryItem("ticket");
    showToast("手持ちのランチご招待券が光った");
    renderCanvasRoom?.();
  };
  showModal(
    "「わあ、ボクの？むしゃむしゃ・・・」",
    content,
    [{ text: "閉じる", action: "close" }],
  );
  window.addEventListener("modal:closed", finishEatingDessert, { once: true });
}

function getOrderedPastaImageKey() {
  const state = getTabletLunchState();
  const imageKeys = state.pastaEaten ? {
    mushroom: "pastaWahuKinokoAfter",
    meatSauce: "pastaMeatSauceAfter",
    carbonara: "pastaCarboAfter",
  } : {
    mushroom: "pastaWahuKinoko",
    meatSauce: "pastaMeatSauce",
    carbonara: "pastaCarbo",
  };
  return imageKeys[state.orderedPasta] || null;
}

function shouldShowOrderedPasta() {
  const state = getTabletLunchState();
  return !!getOrderedPastaImageKey() && !(state.pastaEaten && state.orderedDessert);
}

function eatOrderedPastaWithFork() {
  const state = getTabletLunchState();
  if (!state.orderedPasta || !getMainFlags().bearGotCoffee) return;
  if (state.pastaEaten) {
    const pasta = TABLET_LUNCH_PASTAS.find((item) => item.id === state.orderedPasta);
    const imageKey = getOrderedPastaImageKey();
    const label = pasta?.[uiLang]?.name || "パスタ";
    showObj(
      null,
      `${label}を食べ終えた。`,
      IMAGES.items[imageKey],
      "パスタはきれいに食べ終えた。",
    );
    return;
  }
  if (gameState.selectedItem !== "fork") {
    updateMessage("パスタが届いている。フォークで食べよう。");
    return;
  }

  const pastaImages = {
    mushroom: {
      eating: IMAGES.modals.eatingWahuKinoko,
      after: IMAGES.items.pastaWahuKinokoAfter,
      name: "和風キノコパスタ",
    },
    meatSauce: {
      eating: IMAGES.modals.eatingMeatSauce,
      after: IMAGES.items.pastaMeatSauceAfter,
      name: "ミートソースパスタ",
    },
    carbonara: {
      eating: IMAGES.modals.eatingCarbo,
      after: IMAGES.items.pastaCarboAfter,
      name: "カルボナーラ",
    },
  };
  const pasta = pastaImages[state.orderedPasta];
  if (!pasta) return;

  removeItem("fork");
  const content = `
    <div class="modal-anim">
      <img src="${pasta.eating}" alt="${pasta.name}を食べている">
      <img src="${pasta.after}" alt="${pasta.name}を食べ終えた">
    </div>`;
  const finishEating = () => {
    state.pastaEaten = true;
    markProgress?.("eat_ordered_pasta", { pasta: state.orderedPasta });
    updateMessage("パスタをきれいに食べ終えた。");
    renderCanvasRoom?.();
  };
  showModal(
    `${pasta.name}を食べた`,
    content,
    [{ text: "閉じる", action: "close" }],
  );
  window.addEventListener("modal:closed", finishEating, { once: true });
}

function getDrinkGlassState() {
  if (!gameState.drinkGlass || typeof gameState.drinkGlass !== "object") {
    gameState.drinkGlass = { owned: false, hasIce: false, juice: null };
  }
  gameState.drinkGlass.owned = hasItem("glass");
  if (typeof gameState.drinkGlass.hasIce !== "boolean") gameState.drinkGlass.hasIce = false;
  if (typeof gameState.drinkGlass.juice !== "string") gameState.drinkGlass.juice = null;
  return gameState.drinkGlass;
}

function getSoupCupState() {
  if (!gameState.soupCup || typeof gameState.soupCup !== "object") {
    gameState.soupCup = { owned: false, soup: null, broccoliServed: false };
  }
  gameState.soupCup.owned = hasItem("cup");
  if (typeof gameState.soupCup.soup !== "string") gameState.soupCup.soup = null;
  if (typeof gameState.soupCup.broccoliServed !== "boolean") gameState.soupCup.broccoliServed = false;
  return gameState.soupCup;
}

function getInventoryItemImage(itemId) {
  if (itemId === "ticket") {
    return getTabletLunchState().dessertEaten ? IMAGES.items.ticket2 : IMAGES.items.ticket;
  }
  if (itemId === "cup") {
    const cup = getSoupCupState();
    if (!cup.soup) return IMAGES.items.cupEmpty;
    const soupName = cup.soup.charAt(0).toUpperCase() + cup.soup.slice(1);
    return IMAGES.items[`cup${soupName}`] || IMAGES.items.cupEmpty;
  }
  if (itemId !== "glass") return IMAGES.items[itemId];
  const glass = getDrinkGlassState();
  if (glass.juice) {
    const color = glass.juice.charAt(0).toUpperCase() + glass.juice.slice(1);
    return IMAGES.items[glass.hasIce ? `glassIce${color}` : `glassNoIce${color}`] || IMAGES.items.glass;
  }
  return glass.hasIce ? IMAGES.items.glassIceMax : IMAGES.items.glassEmpty;
}

function takeEmptyCup() {
  const cup = getSoupCupState();
  if (cup.owned) {
    updateMessage("スープカップはすでに持っている。");
    return;
  }
  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return;
  }

  cup.soup = null;
  addItem("cup");
  cup.owned = true;
  showObj(null, "空のスープカップを手に入れた", IMAGES.items.cupEmpty, "空のスープカップを手に入れた。");
}

function showSoupPot(soup) {
  const cup = getSoupCupState();
  const soupInfo = {
    corn: { label: "コーンスープ", image: IMAGES.modals.cornSoup },
    tomato: { label: "トマトスープ", image: IMAGES.modals.tomatoSoup },
    broc: {
      label: "ブロッコリースープ",
      image: cup.broccoliServed ? IMAGES.modals.brocSoup2 : IMAGES.modals.brocSoup1,
    },
  }[soup];
  if (!soupInfo) return;

  const canPour = cup.owned && !cup.soup && gameState.selectedItem === "cup";
  const buttons = [];
  if (canPour) {
    buttons.push({
      text: "カップに注ぐ",
      action: () => {
        cup.soup = soup;
        if (soup === "broc") cup.broccoliServed = true;
        gameState.selectedItem = "cup";
        gameState.selectedItemSlot = gameState.inventory.indexOf("cup");
        playSE?.("se-soup");
        updateInventoryDisplay();
        closeModal();
        showObj(null, `${soupInfo.label}入りのカップ`, getInventoryItemImage("cup"), `${soupInfo.label}をカップに注いだ。`);
        markProgress?.(`fill_cup_with_${soup}_soup`);
      },
    });
  }
  buttons.push({ text: "閉じる", action: "close" });

  showModal(
    soupInfo.label,
    `<img src="${soupInfo.image}" alt="${soupInfo.label}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`,
    buttons,
  );
  updateMessage(canPour ? `${soupInfo.label}をカップに注げそうだ。` : cup.soup ? "カップにはすでにスープが入っている。" : "スープを入れるカップを選択しよう。");
}

function showRestRoomSink() {
  const imageId = `restRoomSink_${Date.now()}`;
  showModal(
    "シンク",
    `<img id="${imageId}" class="showobj-image" src="${IMAGES.modals.sink}" alt="トイレのシンク" style="cursor:pointer;">`,
    [{ text: "閉じる", action: "close" }],
    null,
    { contentClass: "showobj-modal" },
  );

  const image = document.getElementById(imageId);
  if (!image) return;
  image.addEventListener("click", () => {
    const flags = getMainFlags();
    if (flags.foundRestRoomKey) {
      updateMessage("もう何もない。");
      return;
    }
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
      return;
    }

    flags.foundRestRoomKey = true;
    addItem("key");
    showObj(null, "カギを手に入れた", IMAGES.items.key, "シンクからカギを手に入れた。");
    markProgress?.("get_key_from_rest_room_sink");
  });
  updateMessage("シンクがある。画像を調べてみよう。");
}

function takeEmptyGlass() {
  const glass = getDrinkGlassState();
  if (glass.owned) {
    updateMessage("グラスはすでに持っている。");
    return;
  }
  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return;
  }

  glass.hasIce = false;
  glass.juice = null;
  addItem("glass");
  glass.owned = true;
  showObj(null, "空のグラスを手に入れた", IMAGES.items.glassEmpty, "空のグラスを手に入れた。");
}

function putIceInGlass() {
  const glass = getDrinkGlassState();
  if (gameState.selectedItem !== "glass" || !glass.owned) {
    updateMessage("氷を入れるグラスが必要だ。");
    return;
  }
  if (glass.juice) {
    updateMessage("ジュースが入っている。");
    return;
  }
  if (glass.hasIce) {
    updateMessage("グラスにはすでに氷が入っている。");
    return;
  }

  const animationId = `glassIceAnimation_${Date.now()}`;
  const frames = [
    IMAGES.modals.glassIce1,
    IMAGES.modals.glassIce2,
    IMAGES.modals.glassIce3,
    IMAGES.modals.glassIce4,
    IMAGES.items.glassIceMax,
  ];
  showModal(
    "グラスに氷を入れる",
    `<img id="${animationId}" src="${frames[0]}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`,
    [],
  );
  playSE?.("se-ice");

  let frameIndex = 0;
  const showNextFrame = () => {
    frameIndex += 1;
    const image = document.getElementById(animationId);
    if (image && frameIndex < frames.length) image.src = frames[frameIndex];
    if (frameIndex < frames.length - 1) {
      setTimeout(showNextFrame, 240);
      return;
    }

    setTimeout(() => {
      glass.hasIce = true;
      gameState.selectedItem = "glass";
      updateInventoryDisplay();
      showModal(
        "氷入りグラス",
        `<img src="${IMAGES.items.glassIceMax}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`,
        [{ text: "閉じる", action: "close" }],
      );
      updateMessage("グラスに氷を入れた。");
      markProgress?.("put_ice_in_glass");
    }, 240);
  };
  setTimeout(showNextFrame, 240);
}

function showJuiceDispenser() {
  const glass = getDrinkGlassState();
  if (!glass.owned) {
    updateMessage("ジュースを入れるグラスが必要だ。");
    return;
  }
  if (glass.juice) {
    updateMessage("グラスにはすでに飲み物が入っている。");
    return;
  }

  const fillGlass = (juice, label) => {
    glass.juice = juice;
    gameState.selectedItem = "glass";
    gameState.selectedItemSlot = gameState.inventory.indexOf("glass");
    playSE?.("se-tea");
    updateInventoryDisplay();
    closeModal();
    updateMessage(`${label}をグラスに入れた。`);
    markProgress?.(`fill_glass_with_${juice}_juice`);
  };

  showModal(
    "ジュースマシン",
    `<img src="${IMAGES.modals.juiceDispenser}" alt="ジュースマシン" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`,
    [
      { text: "オレンジジュース", action: () => fillGlass("orange", "オレンジジュース") },
      { text: "メロンジュース", action: () => fillGlass("melon", "メロンジュース") },
      { text: "グレープジュース", action: () => fillGlass("grape", "グレープジュース") },
      { text: "閉じる", action: "close" },
    ],
    null,
    { contentClass: "showobj-modal", columnButtons: true },
  );
}

function syncTabletLunchOverlayPosition() {
  const overlay = document.getElementById("tabletLunchUI");
  const gameCanvas = document.getElementById("gameCanvas");
  if (!overlay || !gameCanvas) return;
  overlay.style.left = `${gameCanvas.offsetLeft}px`;
  overlay.style.top = `${gameCanvas.offsetTop}px`;
  overlay.style.width = `${gameCanvas.clientWidth}px`;
  overlay.style.height = `${gameCanvas.clientHeight}px`;
}

function renderTabletLunchUI() {
  const overlay = document.getElementById("tabletLunchUI");
  if (!overlay) return;

  const isTabletRoom = gameState.currentRoom === "tabletLunch" || gameState.currentRoom === "tabletDessert";
  overlay.classList.toggle("is-visible", isTabletRoom);
  overlay.setAttribute("aria-hidden", String(!isTabletRoom));
  if (!isTabletRoom) return;

  syncTabletLunchOverlayPosition();
  const state = getTabletLunchState();
  const text = TABLET_LUNCH_TEXT[uiLang];
  const lunchActive = gameState.currentRoom === "tabletLunch";
  state.activeTab = lunchActive ? "lunch" : "dessert";
  const lunchTab = document.getElementById("tabletLunchTabLunch");
  const dessertTab = document.getElementById("tabletLunchTabDessert");

  lunchTab.textContent = text.lunch;
  dessertTab.textContent = text.dessert;
  lunchTab.classList.toggle("is-active", lunchActive);
  dessertTab.classList.toggle("is-active", !lunchActive);
  lunchTab.setAttribute("aria-selected", String(lunchActive));
  dessertTab.setAttribute("aria-selected", String(!lunchActive));
  dessertTab.disabled = !state.pastaEaten;
  dessertTab.setAttribute("aria-disabled", String(!state.pastaEaten));
  document.getElementById("tabletLunchPanelLunch").hidden = !lunchActive;
  document.getElementById("tabletLunchPanelDessert").hidden = lunchActive;
  document.getElementById("tabletLunchGuideMain").textContent = text.guideMain;
  document.getElementById("tabletLunchGuideSub").textContent = text.guideSub;

  const options = document.getElementById("tabletLunchOptions");
  options.innerHTML = TABLET_LUNCH_PASTAS.map((pasta) => {
    const label = pasta[uiLang];
    const selected = state.selectedPasta === pasta.id;
    return `
      <button class="tablet-lunch-option${selected ? " is-selected" : ""}" type="button"
        data-pasta-id="${pasta.id}" aria-pressed="${selected}" aria-label="${label.name}, ${label.size}">
        <span class="tablet-lunch-photo-frame" aria-hidden="true"></span>
        <span class="tablet-lunch-option-text">
          <span class="tablet-lunch-option-name">${label.name}</span>
          <span class="tablet-lunch-option-size">${label.size}</span>
        </span>
      </button>`;
  }).join("");

  options.querySelectorAll("[data-pasta-id]").forEach((button) => {
    button.addEventListener("click", () => {
      getTabletLunchState().selectedPasta = button.dataset.pastaId;
      playSE?.("se-click");
      renderTabletLunchUI();
    });
  });

  const dessertInput = document.getElementById("tabletDessertCode");
  const dessertPreview = document.getElementById("tabletDessertPreview");
  const selectedDessert = TABLET_DESSERT_CODES[state.selectedDessert];
  dessertInput.value = state.dessertCode;
  dessertInput.placeholder = uiLang === "en" ? "Enter code" : "英字コードを入力";
  dessertInput.setAttribute("aria-label", dessertInput.placeholder);
  dessertInput.disabled = !!state.orderedDessert;
  if (selectedDessert) {
    dessertPreview.src = IMAGES.modals[selectedDessert.image];
    dessertPreview.alt = selectedDessert[uiLang];
    dessertPreview.hidden = false;
  } else {
    dessertPreview.removeAttribute("src");
    dessertPreview.alt = "";
    dessertPreview.hidden = true;
  }

  document.getElementById("tabletLunchLanguage").textContent = text.language;
  const orderButton = document.getElementById("tabletLunchOrder");
  const ordered = lunchActive ? !!state.orderedPasta : !!state.orderedDessert;
  orderButton.textContent = ordered ? text.orderedButton : text.order;
  orderButton.disabled = ordered || (lunchActive ? !state.selectedPasta : !state.selectedDessert);
}

function initializeTabletLunchUI() {
  const backImage = document.getElementById("tabletLunchBackImage");
  if (backImage) backImage.src = IMAGES.items.back;

  document.getElementById("tabletLunchBack")?.addEventListener("click", () => {
    playSE?.("se-click");
    changeRoom("mainTable");
  });

  document.querySelectorAll("[data-tablet-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tabletTab;
      if (tab === "dessert" && !getTabletLunchState().pastaEaten) return;
      getTabletLunchState().activeTab = tab;
      playSE?.("se-click");
      changeRoom(tab === "dessert" ? "tabletDessert" : "tabletLunch");
    });
  });

  document.getElementById("tabletDessertCode")?.addEventListener("input", (event) => {
    const state = getTabletLunchState();
    const inputValue = event.target.value.replace(/[^a-z]/gi, "");
    event.target.value = inputValue;
    const code = inputValue.toLowerCase();
    const previousDessert = state.selectedDessert;
    state.dessertCode = inputValue;
    state.selectedDessert = TABLET_DESSERT_CODES[code] ? code : null;
    if (state.selectedDessert && state.selectedDessert !== previousDessert) playSE?.("se-kettei");
    renderTabletLunchUI();
  });

  document.getElementById("tabletLunchLanguage")?.addEventListener("click", () => {
    uiLang = uiLang === "jp" ? "en" : "jp";
    playSE?.("se-click");
    renderTabletLunchUI();
  });

  document.getElementById("tabletLunchOrder")?.addEventListener("click", () => {
    const state = getTabletLunchState();
    if (gameState.currentRoom === "tabletDessert") {
      if (!state.selectedDessert || state.orderedDessert) return;
      state.orderedDessert = state.selectedDessert;
      const dessert = TABLET_DESSERT_CODES[state.selectedDessert];
      const label = dessert[uiLang];
      updateMessage(uiLang === "en" ? `${label}${TABLET_LUNCH_TEXT.en.ordered}` : `${label}${TABLET_LUNCH_TEXT.jp.ordered}`);
      playSE?.("se-kettei");
      renderTabletLunchUI();
      showModal("注文完了", `<p style="margin:0;text-align:center;">${label}を注文した。</p>`, [
        { text: "閉じる", action: "close" },
      ]);
      window.dispatchEvent(new CustomEvent("tabletDessert:order", {
        detail: { dessertId: state.selectedDessert },
      }));
      return;
    }
    if (!state.selectedPasta || state.orderedPasta) return;
    state.orderedPasta = state.selectedPasta;
    const pasta = TABLET_LUNCH_PASTAS.find((item) => item.id === state.selectedPasta);
    const label = pasta[uiLang].name;
    updateMessage(uiLang === "en" ? `${label}${TABLET_LUNCH_TEXT.en.ordered}` : `${label}${TABLET_LUNCH_TEXT.jp.ordered}`);
    playSE?.("se-kettei");
    renderTabletLunchUI();
    showModal("注文完了", "<p style=\"margin:0;text-align:center;\">ランチを注文した。ドリンクバーに行ってみよう</p>", [
      { text: "閉じる", action: "close" },
    ]);
    window.dispatchEvent(new CustomEvent("tabletLunch:order", {
      detail: { pastaId: state.selectedPasta },
    }));
  });

  window.addEventListener("resize", syncTabletLunchOverlayPosition);
  if (window.ResizeObserver) {
    new ResizeObserver(syncTabletLunchOverlayPosition).observe(canvas);
  }
}

initializeTabletLunchUI();

function showDessertMenuModal(pageIndex = 0) {
  const pageCount = 4;
  const normalizedIndex = (pageIndex + pageCount) % pageCount;
  const pageNumber = normalizedIndex + 1;
  const imageKey = `dessert${pageNumber}${uiLang === "en" ? "En" : ""}`;
  const title = uiLang === "en"
    ? `Dessert Menu (${pageNumber}/${pageCount})`
    : `デザートメニュー（${pageNumber}/${pageCount}）`;
  const content = `<img class="showobj-image" src="${IMAGES.modals[imageKey]}" alt="${title}">`;

  showModal(title, content, [
    {
      text: "◀",
      action: () => {
        playSE?.("se-click");
        showDessertMenuModal(normalizedIndex - 1);
      },
    },
    {
      text: uiLang === "en" ? "日本語" : "English",
      action: () => {
        uiLang = uiLang === "en" ? "jp" : "en";
        playSE?.("se-click");
        showDessertMenuModal(normalizedIndex);
      },
    },
    {
      text: "▶",
      action: () => {
        playSE?.("se-click");
        showDessertMenuModal(normalizedIndex + 1);
      },
    },
    { text: uiLang === "en" ? "Close" : "閉じる", action: "close" },
  ], null, { contentClass: "showobj-modal dessert-menu-modal" });

  updateMessage(uiLang === "en" ? "A dessert menu." : "デザートメニューだ。");
}

function showCutleryBoxPuzzle() {
  const flags = getMainFlags();
  if (flags.cutleryStat === 2) {
    updateMessage("カトラリーボックスだ。");
    return;
  }
  if (flags.cutleryStat === 1) {
    if (hasItem("fork")) {
      flags.cutleryStat = 2;
      renderCanvasRoom?.();
      updateMessage("カトラリーボックスだ。");
      return;
    }
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう。");
      return;
    }
    flags.cutleryStat = 2;
    markProgress?.("get_fork");
    acquireItemOnce(
      "foundFork",
      "fork",
      "カトラリーボックスの中にフォークがあった",
      IMAGES.items.fork,
      "フォークを手に入れた。",
    );
    return;
  }

  const directions = ["up", "right", "down", "left"];
  const directionLabels = { up: "上", right: "右", down: "下", left: "左" };
  const directionAngles = { up: 0, right: 90, down: 180, left: 270 };
  const values = ["up", "up", "up"];
  const answer = ["left", "up", "down"];
  const icons = [
    { src: IMAGES.modals.iconTomato, name: "トマト" },
    { src: IMAGES.modals.iconCorn, name: "コーン" },
    { src: IMAGES.modals.iconBroc, name: "ブロッコリー" },
  ];

  const dial = (index) => `
    <div style="display:grid;grid-template:22% 56% 22% / 22% 56% 22%;width:min(100%,9rem);aspect-ratio:1;place-items:center;">
      <button type="button" data-cutlery-dial="${index}" data-direction="up" aria-label="${icons[index].name}を上に向ける" style="grid-area:1/2;width:clamp(1.35rem,5vw,2rem);height:clamp(1.35rem,5vw,2rem);padding:0;border-radius:50%;">&#9650;</button>
      <button type="button" data-cutlery-dial="${index}" data-direction="left" aria-label="${icons[index].name}を左に向ける" style="grid-area:2/1;width:clamp(1.35rem,5vw,2rem);height:clamp(1.35rem,5vw,2rem);padding:0;border-radius:50%;">&#9664;</button>
      <div style="grid-area:2/2;width:100%;aspect-ratio:1;border:5px solid #6e6254;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 38% 32%,#faf4df 0 13%,#c6b89f 55%,#746858 100%);box-shadow:inset 0 0 0 3px #e7dcc7,0 4px 7px rgba(0,0,0,.35);">
        <span data-cutlery-pointer="${index}" aria-hidden="true" style="display:block;font-size:clamp(1.6rem,5vw,2.3rem);line-height:1;color:#493d31;transform:rotate(${directionAngles[values[index]]}deg);transition:transform .15s ease;">&#8593;</span>
      </div>
      <button type="button" data-cutlery-dial="${index}" data-direction="right" aria-label="${icons[index].name}を右に向ける" style="grid-area:2/3;width:clamp(1.35rem,5vw,2rem);height:clamp(1.35rem,5vw,2rem);padding:0;border-radius:50%;">&#9654;</button>
      <button type="button" data-cutlery-dial="${index}" data-direction="down" aria-label="${icons[index].name}を下に向ける" style="grid-area:3/2;width:clamp(1.35rem,5vw,2rem);height:clamp(1.35rem,5vw,2rem);padding:0;border-radius:50%;">&#9660;</button>
    </div>`;

  const content = `
    <div style="width:min(94vw,520px);margin:6px auto 12px;">
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:center;margin-bottom:10px;">
        ${icons.map((icon) => `<img src="${icon.src}" alt="${icon.name}" style="display:block;width:min(100%,110px);aspect-ratio:1;object-fit:contain;margin:auto;">`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;justify-items:center;">
        ${icons.map((_, index) => dial(index)).join("")}
      </div>
      <p id="cutleryPuzzleGuide" aria-live="polite" style="min-height:1.5em;margin:12px 0 0;text-align:center;"></p>
    </div>`;

  showModal("カトラリーボックス", content, [
    {
      text: "OK",
      action: () => {
        if (!values.every((value, index) => value === answer[index])) {
          const guide = document.getElementById("cutleryPuzzleGuide");
          if (guide) guide.textContent = "ダイヤルの向きが違うようだ。";
          playSE?.("se-click");
          return;
        }
        flags.cutleryStat = 1;
        markProgress?.("unlock_cutlery_box");
        playSE?.("se-gacha");
        closeModal();
        updateMessage("カトラリーボックスのロックが外れた。");
        renderCanvasRoom?.();
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-cutlery-dial]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.cutleryDial);
      const direction = button.dataset.direction;
      if (!Number.isInteger(index) || !directions.includes(direction)) return;
      values[index] = direction;
      const pointer = document.querySelector(`[data-cutlery-pointer="${index}"]`);
      if (pointer) {
        pointer.style.transform = `rotate(${directionAngles[direction]}deg)`;
        pointer.setAttribute("aria-label", `${icons[index].name}：${directionLabels[direction]}`);
      }
      const guide = document.getElementById("cutleryPuzzleGuide");
      if (guide) guide.textContent = "";
      playSE?.("se-click");
    });
  });
}

function showTabletUnlockPuzzle() {
  const inputId = "tabletUnlockInput";
  const guideId = "tabletUnlockGuide";
  const content = `
    <p style="margin:0 0 10px;text-align:center;">カタカナまたは英字で入力してください</p>
    <input id="${inputId}" class="puzzle-input notranslate" type="text" inputmode="text"
      autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12"
      aria-label="アンロックワード">
    <p id="${guideId}" style="min-height:1.5em;margin:4px 0 0;text-align:center;" aria-live="polite"></p>
  `;

  const submitAnswer = () => {
    const input = document.getElementById(inputId);
    if (!input) return;
    const answer = input.value.trim().normalize("NFKC");
    const isCorrect = answer === "リミット" || answer.toLowerCase() === "dish";
    if (!isCorrect) {
      const guide = document.getElementById(guideId);
      if (guide) guide.textContent = "入力内容が違うようだ。";
      playSE?.("se-error");
      input.select();
      return;
    }

    getMainFlags().tabletUnlocked = true;
    markProgress?.("unlock_order_tablet");
    playSE?.("se-kettei");
    closeModal();
    changeRoom("tabletLunch");
  };

  showModal("タブレットのロック", content, [
    { text: "OK", action: submitAnswer },
    { text: "閉じる", action: "close" },
  ]);

  const input = document.getElementById(inputId);
  input?.addEventListener("input", () => {
    const guide = document.getElementById(guideId);
    if (guide) guide.textContent = "";
  });
  input?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    submitAnswer();
  });
  input?.focus();
}

function showRegisterButtonsPuzzle() {
  const flags = getMainFlags();
  if (flags.unlockRegister) {
    updateMessage("レジのロックは外れている。");
    return;
  }

  const answer = ["bottomLeft", "topRight", "topLeft", "bottomRight"];
  const input = [];
  const buttonAreas = [
    { id: "topLeft", label: "左上", left: 15.2, top: 18.0 },
    { id: "topRight", label: "右上", left: 53.0, top: 18.0 },
    { id: "bottomLeft", label: "左下", left: 15.2, top: 53.0 },
    { id: "bottomRight", label: "右下", left: 53.0, top: 53.0 },
  ];
  const content = `
    <div style="position:relative;width:min(76vw,500px);aspect-ratio:1;margin:8px auto 12px;">
      <img src="${IMAGES.modals.registerButtons}" alt="レジの4つの操作ボタン" style="display:block;width:100%;height:100%;object-fit:contain;">
      ${buttonAreas.map((area) => `<button type="button" data-register-button="${area.id}" aria-label="${area.label}のボタン" style="position:absolute;left:${area.left}%;top:${area.top}%;width:32%;height:32%;margin:0;padding:0;border:0;border-radius:3%;background:transparent;box-shadow:none;cursor:pointer;appearance:none;"></button>`).join("")}
    </div>
    <p id="registerButtonsGuide" style="min-height:1.5em;margin:0;text-align:center;"></p>
  `;

  showModal("レジ操作部", content, [
    {
      text: "OK",
      action: () => {
        const isCorrect = input.length === answer.length
          && input.every((value, index) => value === answer[index]);
        if (!isCorrect) {
          input.length = 0;
          const guide = document.getElementById("registerButtonsGuide");
          if (guide) guide.textContent = "何も起こらない。";
          playSE?.("se-error");
          return;
        }
        flags.unlockRegister = true;
        playSE?.("se-switch");
        markProgress?.("unlock_register");
        closeModal();
        renderCanvasRoom?.();
        updateMessage("カチッと、レジの下のほうで音がした。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  document.querySelectorAll("[data-register-button]").forEach((button) => {
    button.addEventListener("click", () => {
      input.push(button.dataset.registerButton);
      playSE?.("se-pi");
      const guide = document.getElementById("registerButtonsGuide");
      if (guide) guide.textContent = `${input.length}回入力した。`;
      button.style.boxShadow = "inset 0 0 0 4px rgba(255,255,255,.7)";
      setTimeout(() => {
        if (button.isConnected) button.style.boxShadow = "none";
      }, 120);
    });
  });
}

function useTicketAtRegisterSlit() {
  const flags = getMainFlags();
  if (!flags.unlockRegister) {
    updateMessage("スリットはカバーで塞がれている。");
    return;
  }
  const selectedTicket = gameState.selectedItem;
  if (selectedTicket !== "ticket" && selectedTicket !== "ticketTakeout") {
    updateMessage("チケットを入れるスリットのようだ。");
    return;
  }
  const isTakeoutTicket = selectedTicket === "ticketTakeout";
  if ((!isTakeoutTicket && flags.ticketUsed) || (isTakeoutTicket && flags.ticketTakeoutUsed)) {
    updateMessage("このチケットはすでに使用した。");
    return;
  }

  removeItem(selectedTicket);
  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  fxRoot.registerTicket = { roomId: "register", progress: 0, itemId: selectedTicket };
  updateMessage("チケットがスリットに吸い込まれていく……");

  const duration = 1000;
  const start = performance.now();
  const tick = (now) => {
    const fx = gameState.fx?.registerTicket;
    if (!fx) return;
    fx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (fx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    if (isTakeoutTicket) {
      flags.ticketTakeoutUsed = true;
      flags.takeoutBoxAppeared = true;
    } else {
      flags.ticketUsed = true;
      flags.unlockDoor = true;
    }
    delete gameState.fx.registerTicket;
    gameState.fx.lockInput = false;
    playSE?.(isTakeoutTicket ? "se-doorchime" : "se-yorokobi");
    markProgress?.(isTakeoutTicket ? "use_takeout_ticket_at_register" : "use_ticket_at_register");
    renderCanvasRoom?.();
    updateMessage(isTakeoutTicket
      ? "テイクアウト券が吸い込まれ、近くでゴトリと音がした。"
      : "チケットが吸い込まれ、ドアのロックが外れた。");
  };
  requestAnimationFrame(tick);
}

// 部屋データ
let rooms = {
  mainTable: {
    name: "テーブル席",
    description: "パスタ店のテーブル席だ。",
    clickableAreas: [
      {
        x: 0.2, y: 0.4, width: 17.5, height: 39.5,
        onClick: clickWrap(function () {
          showObj(null, "ポスターが貼られている", IMAGES.modals.posterBear, "ポスターが貼られている");
        }),
        description: '左ポスター',
        zIndex: 5,
        usable: () => true,
        item: { img: '', visible: () => true }
      },
      {
        x: 8, y: 59, width: 19, height: 28,
        onClick: clickWrap(() => {
          if (!hasItem("ticket")) {
            showModal(
              "注文用タブレット",
              `<img class="showobj-image" src="${IMAGES.modals.tabletLock}" alt="ロックされた注文用タブレット">`,
              [{ text: "閉じる", action: "close" }],
            );
            return;
          }
          if (getMainFlags().tabletUnlocked) {
            changeRoom(getTabletLunchState().pastaEaten ? "tabletDessert" : "tabletLunch");
            return;
          }
          showTabletUnlockPuzzle();
        }, { allowAtNight: true }),
        description: "注文用タブレット",
        zIndex: 8,
        usable: () => true,
      },
      {
        x: 50.2, y: 66.4, width: 12.2, height: 9.6,
        onClick: clickWrap(function () {
          showDessertMenuModal(0);
        }),
        description: 'デザートメニュー',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 30.6, y: 69.0, width: 13.5, height: 10.4,
        onClick: clickWrap(function () {
          acquireItemOnce("foundTicket", "ticket", "ランチご招待券がある", IMAGES.items.ticket, "ランチご招待券を手に入れた");
        }),
        description: 'ランチご招待券',
        zIndex: 5,
        usable: () => !getMainFlags().foundTicket,
        item: { img: 'ticket', visible: () => !getMainFlags().foundTicket }
      },
      {
        x: 68.7, y: 70.7, width: 17.7, height: 17.2,
        onClick: clickWrap(function () {
          showCutleryBoxPuzzle();
        }),
        description: 'カトラリーボックス',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: 'カトラリーボックスのふた',
        zIndex: 5,
        usable: () => false,
        item: { img: 'cutleryFuta', visible: () => getMainFlags().cutleryStat == 0 }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: 'カトラリーボックスの使用後',
        zIndex: 5,
        usable: () => false,
        item: { img: 'cutleryAfter', visible: () => getMainFlags().cutleryStat == 2 }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '着席してアイスコーヒーを飲むクマ妖精',
        zIndex: 5,
        usable: () => false,
        item: {
          img: () => {
            const state = getTabletLunchState();
            if (state.dessertEaten) return "bearSeated3";
            return state.pastaEaten ? "bearSeated2" : "bearSeated1";
          },
          visible: () => getMainFlags().bearGotCoffee,
        }
      },
      {
        x: 34.9, y: 49.0, width: 19.0, height: 16.6,
        onClick: clickWrap(function () {
          const state = getTabletLunchState();
          if (getOrderedDessertImageKey()) {
            showBearEatingDessert();
            return;
          }
          if (state.dessertEaten) {
            updateMessage("「美味しかったねえ。帰ろう」");
            return;
          }
          if (state.pastaEaten && !state.orderedDessert) {
            updateMessage("「次はデザートだね」");
            return;
          }
          updateMessage("ちゅー…");
        }),
        description: '着席してアイスコーヒーを飲むクマ妖精クリック領域',
        zIndex: 5,
        usable: () => getMainFlags().bearGotCoffee,
        item: { img: 'IMAGE_KEY', visible: () => getMainFlags().bearGotCoffee }
      },
      {
        x: 36.2, y: 75.4, width: 21.7, height: 18.1,
        onClick: clickWrap(function () {
          eatOrderedPastaWithFork();
        }),
        description: '届いたパスタ',
        zIndex: 5,
        usable: () => getMainFlags().bearGotCoffee && shouldShowOrderedPasta(),
        item: {
          img: () => getOrderedPastaImageKey(),
          visible: () => getMainFlags().bearGotCoffee && shouldShowOrderedPasta(),
        }
      },
      {
        x: 38.9, y: 76.8, width: 15.9, height: 14.4,
        onClick: clickWrap(function () {
          const dessert = TABLET_DESSERT_CODES[getTabletLunchState().orderedDessert];
          if (dessert) updateMessage(`${dessert[uiLang]}が届いている。`);
        }),
        description: '届いたデザート',
        zIndex: 5,
        usable: () => !!getOrderedDessertImageKey(),
        item: {
          img: () => getOrderedDessertImageKey(),
          visible: () => !!getOrderedDessertImageKey(),
        }
      },
      {
        x: 91, y: 45.5, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("drinkBar"), { allowAtNight: true }),
        description: "ドリンクバーへ移動",
        zIndex: 10,
        usable: () => hasOrderedLunch(),
        item: { img: "arrowRight", visible: () => hasOrderedLunch() },
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("entranceRight"), { allowAtNight: true }),
        description: "入口へ戻る",
        zIndex: 10,
        usable: () => hasOrderedLunch(),
        item: { img: "back", visible: () => hasOrderedLunch() },
      },
    ],
  },
  drinkBar: {
    name: "ドリンクバー",
    description: "ドリンクとスープのバーだ。",
    clickableAreas: [
      {
        x: 40.6, y: 23.0, width: 19.5, height: 20.2,
        onClick: clickWrap(function () {
          showObj(null, "鏡を覗き込んだ", IMAGES.modals.doughnuts, "鏡にポスターが映っている");
        }),
        description: '鏡',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 18.6, y: 41.1, width: 11.5, height: 24.6,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (!flags.setLever && gameState.selectedItem === "lever") {
            removeItem("lever");
            flags.setLever = true;
            playSE?.("se-kachi");
            markProgress?.("set_lever_on_coffee_machine");
            renderCanvasRoom?.();
            showObj(
              null,
              "レバーをセットした",
              IMAGES.modals.coffeeMachineLever,
              "レバーをセットした",
            );
            return;
          }
          if (flags.setLever && gameState.selectedItem === "glass") {
            const glass = getDrinkGlassState();
            if (glass.juice) {
              updateMessage("グラスにはすでに飲み物が入っている。");
              return;
            }
            if (!glass.hasIce) {
              updateMessage("アイスコーヒーには氷が必要だ");
              return;
            }
            glass.juice = "coffee";
            gameState.selectedItem = "glass";
            gameState.selectedItemSlot = gameState.inventory.indexOf("glass");
            playSE?.("se-tea");
            updateInventoryDisplay();
            markProgress?.("fill_glass_with_iced_coffee");
            showObj(
              null,
              "アイスコーヒー入りのグラス",
              IMAGES.items.glassIceCoffee,
              "アイスコーヒーをグラスに入れた。",
            );
            return;
          }
          if (flags.setLever) {
            showObj(
              null,
              "アイスコーヒーマシン",
              IMAGES.modals.coffeeMachineLeverSet,
              "レバーがセットされている",
            );
            return;
          }
          showObj(
            null,
            "アイスコーヒーマシン",
            IMAGES.modals.coffeeMachine,
            "アイスコーヒーマシンのレバーが無いようだ",
          );
        }),
        description: 'アイスコーヒーマシン',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: 'レバーけし',
        zIndex: 5,
        usable: () => false,
        item: { img: 'leverCover', visible: () => !getMainFlags().setLever }
      },
      {
        x: 30.4, y: 51.5, width: 8.5, height: 14.9,
        onClick: clickWrap(function () {
          putIceInGlass();
        }),
        description: '氷入れ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 39.0, y: 49.5, width: 11.3, height: 18.2,
        onClick: clickWrap(function () {
          showSoupPot("corn");
        }),
        description: 'スープ左：コーン',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 51.3, y: 49.6, width: 11.9, height: 18.0,
        onClick: clickWrap(function () {
          showSoupPot("tomato");
        }),
        description: 'スープ中：トマト',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 64.0, y: 49.7, width: 12.8, height: 17.5,
        onClick: clickWrap(function () {
          showSoupPot("broc");
        }),
        description: 'スープ右：ブロッコリー',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 76.9, y: 41.7, width: 15.6, height: 24.8,
        onClick: clickWrap(function () {
          updateMessage("ルイボスティーのようだ");
        }),
        description: 'ルイボスティーマシン',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },

      {
        x: 1.5, y: 38.1, width: 15.3, height: 26.9,
        onClick: clickWrap(function () {
          showJuiceDispenser();
        }),
        description: 'ジュースマシン',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 4.6, y: 71.5, width: 30.1, height: 9.7,
        onClick: clickWrap(function () {
          takeEmptyGlass();
        }),
        description: 'グラス置き場',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 37.8, y: 71.7, width: 23.2, height: 9.6,
        onClick: clickWrap(function () {
          takeEmptyCup();
        }),
        description: 'カップ置き場',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 35.1, y: 83.6, width: 31.4, height: 12.7,
        onClick: clickWrap(function () {
          handleDrinkBarMiddleCabinetClick();
        }),
        description: '下段キャビネット真ん中',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 66.9, y: 83.6, width: 32.0, height: 12.5,
        onClick: clickWrap(function () {
          handleDrinkBarRightCabinetClick();
        }),
        description: '下段キャビネット右',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 13.2, y: 77.2, width: 22.5, height: 22.4,
        onClick: clickWrap(function () {
          if (!getMainFlags().setLever) {
            showObj(
              null,
              "「アイスコーヒーが飲みたい・・・」",
              IMAGES.modals.bearHopeCoffee,
              "クマ妖精はアイスコーヒーが飲みたいようだ",
            );
            return;
          }
          const flags = getMainFlags();
          flags.bearGotCoffee = true;
          markProgress?.("bear_gets_coffee");
          playSE?.("se-tea");
          const content = `
            <div class="modal-anim">
              <img src="${IMAGES.modals.bearThanks}" alt="ありがとうと喜ぶクマ妖精">
              <img src="${IMAGES.modals.bearCoffeePouring}" alt="アイスコーヒーを注ぐクマ妖精">
            </div>
          `;
          showModal(
            "ありがとう！",
            content,
            [{ text: "閉じる", action: "close" }],
            null,
            { contentClass: "showobj-modal" },
          );
          updateMessage("「ありがとう！」クマ妖精は席へ戻っていった");
          renderCanvasRoom?.();
        }),
        description: 'クマ妖精',
        zIndex: 5,
        usable: () => !getMainFlags().bearGotCoffee,
        item: { img: 'bear', visible: () => !getMainFlags().bearGotCoffee }
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainTable"), { allowAtNight: true }),
        description: "テーブル席へ戻る",
        zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
    ],
  },
  entranceLeft: {
    name: "入口左側",
    description: "店の入口の左側だ。",
    clickableAreas: [
      {
        x: 5.6, y: 13.4, width: 23.3, height: 84.0,
        onClick: clickWrap(function () {
          if (getMainFlags().unlockDoor) {
            travelWithSteps(hasItem("takeoutBox") ? "takeoutEnd" : "end");
            return;
          }
          updateMessage("ドアはロックされているようだ");
        }),
        description: 'ドア',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 45.5, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("restRoom"), { allowAtNight: true }),
        description: "トイレへ移動",
        zIndex: 10,
        usable: () => getMainFlags().wantToilet,
        item: { img: "back", visible: () => getMainFlags().wantToilet },
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("entranceRight"), { allowAtNight: true }),
        description: "入口右側へ移動",
        zIndex: 10,
        item: { img: "arrowRight", visible: () => true },
      },
    ],
  },
  restRoom: {
    name: "トイレ",
    description: "店のトイレだ。",
    clickableAreas: [
      {
        x: 34.3, y: 60.8, width: 34.8, height: 15.4,
        onClick: clickWrap(function () {
          showRestRoomSink();
        }),
        description: 'シンク',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 45.5, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("entranceLeft"), { allowAtNight: true }),
        description: "入口左側へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  entranceRight: {
    name: "入口右側",
    description: "店の入口の右側だ。",
    clickableAreas: [
      {
        x: 40.5, y: 41.0, width: 17.1, height: 15.1,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.keyStorageLeft, "カギがボードに掛けられている");
        }),
        description: '鍵収納左',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 62.2, y: 27.7, width: 16.8, height: 19.5,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.keyStorageRight, "カギがボードに掛けられている");

        }),
        description: '鍵収納右',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 80.3, y: 38.3, width: 15.7, height: 16.3,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (!flags.takeoutBoxAppeared || flags.foundTakeoutBox) return;
          acquireItemOnce(
            "foundTakeoutBox",
            "takeoutBox",
            "テイクアウトボックスを受け取った",
            IMAGES.items.takeoutBox,
            "テイクアウトボックスを手に入れた。",
          );
          markProgress?.("get_takeout_box");
        }),
        description: 'テイクアウトボックス出現箇所',
        zIndex: 5,
        usable: () => getMainFlags().takeoutBoxAppeared && !getMainFlags().foundTakeoutBox,
        item: { img: 'takeoutBox', visible: () => getMainFlags().takeoutBoxAppeared && !getMainFlags().foundTakeoutBox }
      },
      {
        x: 14.6, y: 20.9, width: 20.2, height: 23.8,
        onClick: clickWrap(function () {
          showObj(null, "", IMAGES.modals.posterLeaf, "ポスターが壁に掛けられている");

        }),
        description: '壁のポスター',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 4.6, y: 44.9, width: 24.1, height: 22.9,
        onClick: clickWrap(() => changeRoom("register"), { allowAtNight: true }),
        description: 'レジ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 73.5, y: 57.1, width: 26.1, height: 34.5,
        onClick: clickWrap(function () {
          updateMessage("ケーキのショーケースだ。美味しそうなケーキが並んでいる。");
        }),
        description: 'ケーキのショーケース',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("entranceLeft"), { allowAtNight: true }),
        description: "入口左側へ移動",
        zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("mainTable"), { allowAtNight: true }),
        description: "テーブル席へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  register: {
    name: "レジ",
    description: "店のレジだ。",
    clickableAreas: [
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: 'スリットカバー',
        zIndex: 5,
        usable: () => false,
        item: {
          img: 'slitCover',
          visible: () => !getMainFlags().unlockRegister,
        }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: 'レジ表示',
        zIndex: 5,
        usable: () => false,
        item: {
          img: 'registerDisp',
          visible: () => getMainFlags().ticketUsed,
        }
      },
      {
        x: 22.7, y: 84.3, width: 52.6, height: 8.6,
        onClick: clickWrap(function () {
          useTicketAtRegisterSlit();
        }),
        description: 'スリット',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 50.7, y: 43.8, width: 35.4, height: 21.1,
        onClick: clickWrap(function () {
          showRegisterButtonsPuzzle();
        }),
        description: 'レジ操作部',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("entranceRight"), { allowAtNight: true }),
        description: "入口右側へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
    ],
  },
  tabletLunch: {
    name: "注文タブレット",
    description: "ランチ注文用のタブレットだ。",
    clickableAreas: [],
  },
  tabletDessert: {
    name: "注文タブレット",
    description: "デザート注文用のタブレットだ。",
    clickableAreas: [],
  },
  end: {
    name: "ノーマルエンド",
    description: "パスタハウスから無事に脱出できました。おめでとうございます！",
    clickableAreas: [
      {
        x: 57.9, y: 29.8, width: 31.3, height: 27.4,
        onClick: clickWrap(function () {
          updateMessage("「プレイありがとう・・・ぐう。zzz...」");
        }),
        description: '寝るクマ妖精',
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

  takeoutEnd: {
    name: "テイクアウトエンド",
    description: "デザートを持ち帰り、お家に帰りました。おめでとうございます！",
    clickableAreas: [
      {
        x: 43.3, y: 39.1, width: 35.8, height: 38.9,
        onClick: clickWrap(function () {
          updateMessage("「これも美味しそう」");
        }),
        description: 'スプーンを持つクマ妖精',
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
          showEndingReport("takeoutEnd");
        }),
        description: "テイクアウトエンド",
      },
    ],
  },


  trueEnd: {
    name: "トゥルーエンド",
    description: "脱出おめでとうございます。",
    clickableAreas: [

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

function travelWithSteps(destRoom, { soundId = "se-ashioto", transitionDelay = 480 } = {}) {
  const overlay = document.getElementById("roomEffectOverlay");

  playSE?.(soundId);

  if (overlay) {
    overlay.style.background = "#000";
    overlay.style.opacity = 1;
  }

  setTimeout(() => {
    changeRoom(destRoom);
    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = 0;
        overlay.style.background = "";
      }
    }, 100);
  }, transitionDelay);
}

function handleDrinkBarMiddleCabinetClick() {
  const flags = getMainFlags();
  if (!flags.drinkBarMiddleCabinetUnlocked) {
    showDrinkBarMiddleCabinetPuzzle();
    return;
  }
  if (gameState.fx?.drinkBarMiddleCabinet) return;
  // 旧セーブデータに「開きっぱなし」の状態が残っていても、通常の閉状態へ戻す。
  flags.drinkBarMiddleCabinetOpen = false;
  markProgress?.("open_drink_bar_middle_cabinet");
  startDrinkBarMiddleCabinetOpenFx();
}

function showDrinkBarMiddleCabinetPuzzle() {
  const flags = getMainFlags();
  const answer = ["left", "left", "right", "left", "left"];
  const sequence = [];
  const buttonStyle = "box-sizing:border-box;width:min(28vw,112px);aspect-ratio:1;margin:0;padding:0;border:3px solid #9fcbd8;border-radius:5px;background:#dff5fb;box-shadow:0 3px 7px rgba(0,0,0,.28);cursor:pointer;";
  const content = `
    <div style="display:flex;gap:28px;justify-content:center;margin:10px auto 18px;">
      <button type="button" data-drink-cabinet-direction="left" aria-label="左" style="${buttonStyle}"></button>
      <button type="button" data-drink-cabinet-direction="right" aria-label="右" style="${buttonStyle}"></button>
    </div>
    <p id="drinkBarMiddleCabinetGuide" style="min-height:1.5em;margin:0;text-align:center;" aria-live="polite"></p>
  `;
  showModal("下段キャビネット真ん中", content, [
    {
      text: "OK",
      action: () => {
        const isCorrect = sequence.length === answer.length
          && sequence.every((direction, index) => direction === answer[index]);
        if (!isCorrect) {
          const guide = document.getElementById("drinkBarMiddleCabinetGuide");
          if (guide) guide.textContent = "押す順番が違うようだ。";
          sequence.length = 0;
          playSE?.("se-error");
          return;
        }
        flags.drinkBarMiddleCabinetUnlocked = true;
        playSE?.("se-clear");
        markProgress?.("unlock_drink_bar_middle_cabinet");
        closeModal();
        updateMessage("カチッと音がして、下段キャビネットのロックが外れた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  document.querySelectorAll("[data-drink-cabinet-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      sequence.push(button.dataset.drinkCabinetDirection);
      const guide = document.getElementById("drinkBarMiddleCabinetGuide");
      if (guide) guide.textContent = "";
      button.animate?.(
        [{ transform: "scale(1)", background: "#dff5fb" }, { transform: "scale(.92)", background: "#adddea" }, { transform: "scale(1)", background: "#dff5fb" }],
        { duration: 160 },
      );
      playSE?.("se-click");
    });
  });
}

function startDrinkBarMiddleCabinetOpenFx() {
  const flags = getMainFlags();
  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  flags.drinkBarMiddleCabinetOpen = true;
  fxRoot.drinkBarMiddleCabinet = { roomId: "drinkBar", phase: "opening", progress: 0 };
  const duration = 850;
  const start = performance.now();
  const tick = (now) => {
    const fx = gameState.fx?.drinkBarMiddleCabinet;
    if (!fx || fx.phase !== "opening") return;
    fx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (fx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }
    gameState.fx.lockInput = false;
    if (!flags.foundLever) {
      acquireItemOnce(
        "foundLever",
        "lever",
        "キャビネットの中にレバーがあった",
        IMAGES.items.lever,
        "レバーを手に入れた。",
        startDrinkBarMiddleCabinetCloseFx,
      );
    } else {
      showModal(
        "下段キャビネット真ん中",
        '<p style="margin:0;text-align:center;">中にはもう何もない。</p>',
        [{ text: "閉じる", action: "close" }],
        startDrinkBarMiddleCabinetCloseFx,
      );
      updateMessage("中にはもう何もない。");
    }
  };
  requestAnimationFrame(tick);
}

function startDrinkBarMiddleCabinetCloseFx() {
  const flags = getMainFlags();
  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  fxRoot.drinkBarMiddleCabinet = { roomId: "drinkBar", phase: "closing", progress: 1 };
  playSE?.("se-door-close");
  const duration = 750;
  const start = performance.now();
  const tick = (now) => {
    const fx = gameState.fx?.drinkBarMiddleCabinet;
    if (!fx || fx.phase !== "closing") return;
    fx.progress = 1 - Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (fx.progress > 0) {
      requestAnimationFrame(tick);
      return;
    }
    flags.drinkBarMiddleCabinetOpen = false;
    delete gameState.fx.drinkBarMiddleCabinet;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
  };
  requestAnimationFrame(tick);
}

function handleDrinkBarRightCabinetClick() {
  const flags = getMainFlags();
  if (!flags.drinkBarRightCabinetUnlocked) {
    if (gameState.selectedItem !== "key") {
      updateMessage("カギがかかっている。");
      return;
    }
    removeItem("key");
    flags.drinkBarRightCabinetUnlocked = true;
    playSE?.("se-clear");
    updateMessage("カギを使って、下段キャビネット右のロックを外した。");
    markProgress?.("unlock_drink_bar_right_cabinet");
    return;
  }
  if (gameState.fx?.drinkBarRightCabinet) return;
  flags.drinkBarRightCabinetOpen = false;
  markProgress?.("open_drink_bar_right_cabinet");
  startDrinkBarRightCabinetOpenFx();
}

function startDrinkBarRightCabinetOpenFx() {
  const flags = getMainFlags();
  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  flags.drinkBarRightCabinetOpen = true;
  fxRoot.drinkBarRightCabinet = { roomId: "drinkBar", phase: "opening", progress: 0 };
  const duration = 850;
  const start = performance.now();
  const tick = (now) => {
    const fx = gameState.fx?.drinkBarRightCabinet;
    if (!fx || fx.phase !== "opening") return;
    fx.progress = Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (fx.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    gameState.fx.lockInput = false;
    if (!flags.foundTicketTakeout) {
      acquireItemOnce(
        "foundTicketTakeout",
        "ticketTakeout",
        "キャビネットの中にテイクアウト券があった",
        IMAGES.items.ticketTakeout,
        "テイクアウト券を手に入れた。",
        startDrinkBarRightCabinetCloseFx,
      );
      markProgress?.("get_ticket_takeout");
    } else {
      showModal(
        "下段キャビネット右",
        '<p style="margin:0;text-align:center;">中にはもう何もない。</p>',
        [{ text: "閉じる", action: "close" }],
        startDrinkBarRightCabinetCloseFx,
      );
      updateMessage("中にはもう何もない。");
    }
  };
  requestAnimationFrame(tick);
}

function startDrinkBarRightCabinetCloseFx() {
  const flags = getMainFlags();
  const fxRoot = gameState.fx || (gameState.fx = {});
  fxRoot.lockInput = true;
  fxRoot.drinkBarRightCabinet = { roomId: "drinkBar", phase: "closing", progress: 1 };
  playSE?.("se-door-close");
  const duration = 750;
  const start = performance.now();
  const tick = (now) => {
    const fx = gameState.fx?.drinkBarRightCabinet;
    if (!fx || fx.phase !== "closing") return;
    fx.progress = 1 - Math.min(1, (now - start) / duration);
    renderCanvasRoom?.();
    if (fx.progress > 0) {
      requestAnimationFrame(tick);
      return;
    }
    flags.drinkBarRightCabinetOpen = false;
    delete gameState.fx.drinkBarRightCabinet;
    gameState.fx.lockInput = false;
    renderCanvasRoom?.();
  };
  requestAnimationFrame(tick);
}

function initGame() {
  renderNavigation();
  changeRoom("mainTable");
  updateInventoryDisplay();
  updateMessage("パスタ店のテーブル席に着いた。");
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
  if (!END_IDS.has(roomId) && !NAV_EXCLUDED_ROOM_IDS.has(roomId)) {
    addNaviItem(roomId);
  }
  gameState.currentRoom = roomId;
  const room = rooms[roomId];

  // 背景＋アイテム＋クリックエリアをcanvasで全部再描画
  renderCanvasRoom();
  renderTabletLunchUI();
  const roomDescription = room.description;
  const msg = room.name && room.name.trim() !== "" ? `${room.name}です。${roomDescription}` : roomDescription;
  if (roomId === "trueEnd") {
    updateMessageHTML(msg);
  } else {
    updateMessage(msg);
  }

  // BGM切替はそのまま
  if (roomId === "trueEnd") {
    changeBGM(S45("donguri_hiroi.mp3"));
  } else if (roomId === "escapeEnd") {
    changeBGM(S45("the_dream_of_hisui.mp3"));
  } else if (roomId === "end") {
    changeBGM(S45("luminous_fantasy.mp3"));
  } else if (roomId === "takeoutEnd") {
    changeBGM(S45("nijiwo_marumete.mp3"));
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

const END_IDS = new Set(["end", "takeoutEnd", "escapeEnd", "trueEnd"]);
const NAV_EXCLUDED_ROOM_IDS = new Set(["tabletLunch", "tabletDessert"]);

// ===== changeRoom フック：=====
const _changeRoom_custom = changeRoom;
changeRoom = function (roomId) {
  _changeRoom_custom.apply(this, arguments);

  if (roomId === "restRoom" && !getMainFlags().restRoomUsed) {
    const flags = getMainFlags();
    const overlay = document.getElementById("roomEffectOverlay");
    const fxRoot = gameState.fx || (gameState.fx = {});
    flags.restRoomUsed = true;
    fxRoot.lockInput = true;
    playSE?.("se-bukubuku");
    updateMessage("用を済ませた");

    if (overlay) {
      overlay.style.background = "#000";
      overlay.style.opacity = "0.65";
    }

    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.style.background = "";
        }, 600);
      }
      if (gameState.fx) gameState.fx.lockInput = false;
      renderCanvasRoom?.();
    }, 1600);
    markProgress?.("use_rest_room_first_time");
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
  if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
    ctx.save();
    const phase = gameState.main?.flags?.timePhase ?? 0;
    const isNight = phase === 2;
    if (isNight && roomId !== "tabletLunch" && roomId !== "tabletDessert") {
      ctx.filter = "saturate(0.3) brightness(0.6)"; // 背景はちょい暗め
    } else {
      ctx.filter = "none";
    }
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  drawDrinkBarMiddleCabinetFx(ctx, canvas, roomId, bgImg);
  drawDrinkBarRightCabinetFx(ctx, canvas, roomId, bgImg);

  // アイテム描画（未取得のみ）
  drawRoomItems(ctx, canvas, roomId);
  drawRegisterTicketFx(ctx, canvas, roomId);
  drawClickableAreaGlows(ctx, canvas, roomId);

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

function drawRegisterTicketFx(ctx, canvas, roomId) {
  const fx = gameState.fx?.registerTicket;
  if (roomId !== "register" || !fx) return;

  const image = loadedImages[IMAGES.items[fx.itemId || "ticket"]];
  if (!image || !image.complete || image.naturalWidth <= 0) return;

  const t = Math.max(0, Math.min(1, Number(fx.progress) || 0));
  const ease = t * t * (3 - 2 * t);
  const width = canvas.width * 0.28;
  const naturalRatio = image.naturalHeight / image.naturalWidth;
  const height = width * naturalRatio;
  const x = canvas.width * 0.5 - width / 2;
  const startY = canvas.height * 0.66;
  const endY = canvas.height * 0.94;
  const y = startY + (endY - startY) * ease;
  const slitY = canvas.height * 0.885;

  ctx.save();
  // スリットより下を隠し、チケットが吸い込まれるように見せる。
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, slitY);
  ctx.clip();
  ctx.globalAlpha = t < 0.88 ? 1 : Math.max(0, (1 - t) / 0.12);
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
}

function drawDrinkBarMiddleCabinetFx(ctx, canvas, roomId, backgroundImage) {
  if (roomId !== "drinkBar" || !getMainFlags().drinkBarMiddleCabinetOpen) return;
  const area = rooms.drinkBar.clickableAreas.find((entry) => entry.description === "下段キャビネット真ん中");
  if (!area) return;
  const rect = getAreaDrawRect(area, canvas);
  const fx = gameState.fx?.drinkBarMiddleCabinet;
  const t = fx ? Math.max(0, Math.min(1, Number(fx.progress) || 0)) : 1;
  const eased = 1 - Math.pow(1 - t, 3);
  const halfW = rect.w / 2;
  const projectedW = Math.max(1, halfW * (1 - 0.78 * eased));
  ctx.save();
  ctx.fillStyle = "rgba(12, 9, 7, 0.98)";
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
  if (backgroundImage?.complete && backgroundImage.naturalWidth > 0) {
    const sourceY = backgroundImage.naturalHeight * (area.y / 100);
    const sourceW = backgroundImage.naturalWidth * (area.width / 2 / 100);
    const sourceH = backgroundImage.naturalHeight * (area.height / 100);
    const leftSourceX = backgroundImage.naturalWidth * (area.x / 100);
    const rightSourceX = leftSourceX + sourceW;
    const drawDoor = (sourceX, isLeft) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, Math.round(sourceW));
      offscreen.height = Math.max(1, Math.round(sourceH));
      offscreen.getContext("2d").drawImage(backgroundImage, sourceX, sourceY, sourceW, sourceH, 0, 0, offscreen.width, offscreen.height);
      const x = isLeft ? rect.x : rect.x + rect.w - projectedW;
      ctx.save();
      ctx.globalAlpha = 1 - eased * 0.08;
      ctx.drawImage(offscreen, x, rect.y, projectedW, rect.h);
      ctx.restore();
    };
    drawDoor(leftSourceX, true);
    drawDoor(rightSourceX, false);
  }
  ctx.save();
  ctx.strokeStyle = "rgba(72, 48, 28, .95)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.0025);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

function drawDrinkBarRightCabinetFx(ctx, canvas, roomId, backgroundImage) {
  if (roomId !== "drinkBar" || !getMainFlags().drinkBarRightCabinetOpen) return;
  const area = rooms.drinkBar.clickableAreas.find((entry) => entry.description === "下段キャビネット右");
  if (!area) return;
  const rect = getAreaDrawRect(area, canvas);
  const fx = gameState.fx?.drinkBarRightCabinet;
  const t = fx ? Math.max(0, Math.min(1, Number(fx.progress) || 0)) : 1;
  const eased = 1 - Math.pow(1 - t, 3);
  const halfW = rect.w / 2;
  const projectedW = Math.max(1, halfW * (1 - 0.78 * eased));
  ctx.save();
  ctx.fillStyle = "rgba(12, 9, 7, 0.98)";
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
  if (backgroundImage?.complete && backgroundImage.naturalWidth > 0) {
    const sourceY = backgroundImage.naturalHeight * (area.y / 100);
    const sourceW = backgroundImage.naturalWidth * (area.width / 2 / 100);
    const sourceH = backgroundImage.naturalHeight * (area.height / 100);
    const leftSourceX = backgroundImage.naturalWidth * (area.x / 100);
    const rightSourceX = leftSourceX + sourceW;
    const drawDoor = (sourceX, isLeft) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, Math.round(sourceW));
      offscreen.height = Math.max(1, Math.round(sourceH));
      offscreen.getContext("2d").drawImage(backgroundImage, sourceX, sourceY, sourceW, sourceH, 0, 0, offscreen.width, offscreen.height);
      const x = isLeft ? rect.x : rect.x + rect.w - projectedW;
      ctx.save();
      ctx.globalAlpha = 1 - eased * 0.08;
      ctx.drawImage(offscreen, x, rect.y, projectedW, rect.h);
      ctx.restore();
    };
    drawDoor(leftSourceX, true);
    drawDoor(rightSourceX, false);
  }
  ctx.save();
  ctx.strokeStyle = "rgba(72, 48, 28, .95)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.0025);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

function drawRoomItems(ctx, canvas, roomId) {
  const room = rooms[roomId];
  const fx = gameState.fx || {};

  // 通常のアイテム（演出中のカニだけスキップ）
  room.clickableAreas.forEach((area) => {
    if (area.item && area.item.visible && area.item.visible()) {
      const key = typeof area.item.img === "function" ? area.item.img() : area.item.img;

      const imgSrc = IMAGES.items[key] || IMAGES.modals[key];
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

function getRoomBackgroundImage(roomId, gameState) {
  const imgList = IMAGES.rooms[roomId];

  // 単一画像ならそのまま
  if (!Array.isArray(imgList)) {
    return imgList;
  }

  const state = gameState[roomId]?.flags?.backgroundState ?? 0;
  return imgList[state] || imgList[0];
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
      title: "🌕 TRUE END",
      label: "TRUE END",
      desc: "かぐや姫と一緒に月に到着しました。おめでとうございます！",
    },

    end: {
      title: "🍝 NORMAL END ",
      label: "NORMAL",
      desc: "パスタハウスから脱出できました。おめでとうございます！",
    },

    takeoutEnd: {
      title: "🥡 TAKEOUT END",
      label: "TAKEOUT END",
      desc: "テイクアウトボックスを受け取り、店を後にしました。おめでとうございます！",
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

    case "takeoutEnd":
      secretText = "🥡 テイクアウトのお土産を手に脱出しました";
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
      takeoutEnd: "テイクアウトエンド",
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
    currentRoom: "mainTable",
    openRooms: ["mainTable"],
    openRoomsTmp: [],
    inventory: [],
    tabletLunch: {
      activeTab: "lunch",
      selectedPasta: null,
      orderedPasta: null,
      pastaEaten: false,
      dessertCode: "",
      selectedDessert: null,
      orderedDessert: null,
      dessertEaten: false,
    },
    drinkGlass: {
      owned: false,
      hasIce: false,
      juice: null,
    },
    soupCup: {
      owned: false,
      soup: null,
      broccoliServed: false,
    },
    beverageDrinkCount: 0,
    main: {
      flags: {
        cutleryStat: 0,
        foundFork: false,
        tabletUnlocked: false,
        setLever: false,
        bearGotCoffee: false,
        wantToilet: false,
        restRoomUsed: false,
        foundRestRoomKey: false,
        drinkBarMiddleCabinetUnlocked: false,
        drinkBarMiddleCabinetOpen: false,
        foundLever: false,
        drinkBarRightCabinetUnlocked: false,
        drinkBarRightCabinetOpen: false,
        foundTicketTakeout: false,
        unlockRegister: false,
        ticketUsed: false,
        ticketTakeoutUsed: false,
        takeoutBoxAppeared: false,
        foundTakeoutBox: false,
        unlockDoor: false,
      },
    },

    end: { flags: {} },
    takeoutEnd: { flags: {} },
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
    key: "カギ",
    battery: "電池",
    ticket: "ランチご招待券",
    ticketTakeout: "テイクアウト券",
    takeoutBox: "テイクアウトボックス",
    glass: "グラス",
    cup: "スープカップ",
    lever: "レバー",
    fork: "フォーク",

  };
  return names[itemId] || itemId;
}

function countDrinkAndShowToiletPrompt() {
  const currentCount = Number.isFinite(gameState.beverageDrinkCount) ? gameState.beverageDrinkCount : 0;
  gameState.beverageDrinkCount = currentCount + 1;

  const flags = getMainFlags();
  if (gameState.beverageDrinkCount < 8 || flags.wantToilet) return false;

  flags.wantToilet = true;
  const message = "トイレに行きたくなってきた…";
  showModal(
    "トイレに行きたい",
    `<img src="${IMAGES.modals.wantToilet}" alt="トイレに行きたい" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">
     <p style="margin:0;text-align:center;font-weight:700;">${message}</p>`,
    [{ text: "閉じる", action: "close" }],
  );
  updateMessage(message);
  renderCanvasRoom?.();
  markProgress?.("want_toilet_after_8_drinks");
  return true;
}

function drinkJuiceFromGlass() {
  const glass = getDrinkGlassState();
  if (!glass.owned || !glass.juice) return;

  const juiceNames = {
    orange: "オレンジジュース",
    melon: "メロンジュース",
    grape: "グレープジュース",
    coffee: "アイスコーヒー",
  };
  const juiceName = juiceNames[glass.juice] || "ジュース";
  const message = `${juiceName}を飲んだ。おいしい。`;

  playSE?.("se-gokuri");
  removeItem("glass");
  glass.owned = false;
  glass.hasIce = false;
  glass.juice = null;
  updateInventoryDisplay();
  const toiletPromptShown = countDrinkAndShowToiletPrompt();
  if (!toiletPromptShown) {
    showModal(
      "ドリンクを飲んだ",
      `<p style="margin:0;text-align:center;font-weight:700;">${message}</p>`,
      [{ text: "閉じる", action: "close" }],
    );
    updateMessage(message);
  }
  markProgress?.("drink_juice");
}

function drinkSoupFromCup() {
  const cup = getSoupCupState();
  if (!cup.owned || !cup.soup) return;

  const soupMessages = {
    corn: "甘みがある美味しいコーンスープだ。",
    tomato: "コクがあり、さっぱりしていて美味しいスープだ。",
    broc: "クリーミーで美味しいスープだ",
  };
  const message = soupMessages[cup.soup] || "美味しいスープだ。";

  playSE?.("se-gokuri");
  removeItem("cup");
  cup.owned = false;
  cup.soup = null;
  updateInventoryDisplay();
  const toiletPromptShown = countDrinkAndShowToiletPrompt();
  if (!toiletPromptShown) {
    showModal(
      "スープを飲んだ",
      `<p style="margin:0;text-align:center;font-weight:700;">${message}</p>`,
      [{ text: "閉じる", action: "close" }],
    );
    updateMessage(message);
  }
  markProgress?.("drink_soup");
}

function openInventoryItemDetail(itemId, slotIndex, fallbackSrc) {
  const itemBaseSrc = getInventoryItemImage(itemId) || fallbackSrc;
  const itemEnSrc = IMAGES.items[`${itemId}En`];
  const hasEnVariant = !!itemEnSrc;

  let content = `<img src="${itemBaseSrc}" style="max-width:380px;max-height:380px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto 16px;">`;
  let buttons = [{ text: "閉じる", action: "close" }];

  if (itemId === "glass" && getDrinkGlassState().juice) {
    buttons = [
      { text: "飲む", action: drinkJuiceFromGlass },
      { text: "閉じる", action: "close" },
    ];
  }

  if (itemId === "cup" && getSoupCupState().soup) {
    buttons = [
      { text: "飲む", action: drinkSoupFromCup },
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
