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
const BASE_48 = USE_LOCAL_ASSETS ? "images/48" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/48";
const BASE_SOUND_48 = USE_LOCAL_ASSETS ? "sounds/48" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/48";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I48 = (file) => `${BASE_48}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S48 = (file) => `${BASE_SOUND_48}/${file}`;
const DEFAULT_BGM = S48("midnight_heartbreak.mp3");

// 48の背景・共通UI画像。アイテム／モーダル画像はここに追加する。
const IMAGES = {
  rooms: {
    heaven: [I48("heaven.webp")],
    end: [I48("end.webp"), I48("end2.webp")],
    trueEnd: [I48("true_end.webp"), I48("true_end2.webp")],
    roadLeft: [I48("road_left.webp")], roadRight: [I48("road_right.webp"), I48("road_right2.webp")], roadBakery: [I48("road_bakery.webp")],
    roadToyShopLeft: [I48("road_toyshop_left.webp")], roadToyShopRight: [I48("road_toyshop_right.webp")],
    roadFastfoodLeft: [I48("road_fastfood_left.webp")], roadFastfoodRight: [I48("road_fastfood_right.webp")]
  },
  items: {
    arrowRight: ICM("common/arrow_right.png"), arrowLeft: ICM("common/arrow_left.png"),
    arrowAbove: ICM("common/arrow_above.png"),
    roadArrow: I48("road_arrow.webp"),
    bearBack: I48("bear_back.webp"),
    bearCrying: I48("bear_crying.webp"),
    bearMatch: I48("bear_match.webp"),
    bearMatchIncoming: I48("bear_match_incoming.webp"),
    manWaiting: I48("man_waiting.webp"),
    manDelivering: I48("man_delivering.webp"),
    pocketTissue: I48("pocket_tissue.webp"),
    basket: I48("basket.webp"),
    money: I48("money.webp"),
    fadeBakery: I48("fade_bakery.webp"),
    fadeToyshop: I48("fade_toyshop.webp"),
    fadeFastfood: I48("fade_fastfood.webp"),
    oldWoman: I48("old_woman.webp"),
    oldWomanSitting: I48("old_woman_sitting.webp"),
    girl: I48("girl.webp"),
    cat: I48("cat.webp"),
    cat2: I48("cat2.webp"),
    manWithDoll: I48("man_with_doll.webp"),
    matchMen: I48("match_men.webp"),
    roboStands: I48("robo_stands.webp"),
    roboStep: I48("robo_step.webp"),
    remocon: I48("remocon.webp"),
    shineManhole: I48("shine_manhole.webp"),
    manWithBag: I48("man_with_bag.webp"),
    manStanding: I48("man_standing.webp"),
    dustBoxLid: I48("dustbox_lid.webp"),
    ticket: I48("ticket.webp"),
    crown: I48("crown.webp"),

  },
  modals: {
    manTissue: I48("modal_man_tissue.webp"),
    manTissueEn: I48("modal_man_tissue_en.webp"),
    iconStar: I48("icon_star.webp"),
    iconMoon: I48("icon_moon.webp"),
    iconAngel: I48("icon_angel.webp"),
    iconLeaf: I48("icon_leaf.webp"),
    vendingMachine1: I48("modal_vending_machine.webp"),
    bendingMachine2: I48("modal_vending_machine_2.webp"),
    canStar: I48("can_star.webp"),
    canMoon: I48("can_moon.webp"),
    canAngel: I48("can_angel.webp"),
    canLeaf: I48("can_leaf.webp"),
    bearLostBasket: I48("modal_bear_lost_basket.webp"),
    bearHappyWithBasket: I48("modal_bear_happy_with_basket.webp"),
    bearMotivated: I48("modal_bear_motivated.webp"),
    bearMotivatedEn: I48("modal_bear_motivated_en.webp"),
    bearStrikeMatch: I48("modal_bear_strike_match.webp"),
    bearStrikeMatchEn: I48("modal_bear_strike_match_en.webp"),
    bearSellMatch: I48("modal_bear_sell_match.webp"),
    bearSellMatchEn: I48("modal_bear_sell_match_en.webp"),
    bearDreamBread: I48("modal_bear_dream_bread.webp"),
    bearDreamFastfood: I48("modal_bear_dream_fastfood.webp"),
    bearDreamFastfood2: I48("modal_bear_dream_fastfood2.webp"),
    bearDreamFastfood3: I48("modal_bear_dream_fastfood3.webp"),
    bearPhone: I48("modal_bear_phone.webp"),
    bearPhoneEn: I48("modal_bear_phone_en.webp"),
    bearGohome: I48("modal_bear_gohome.webp"),
    bearGohomeEn: I48("modal_bear_gohome_en.webp"),
    bearPassMoney: I48("modal_bear_pass_money.webp"),
    bearAdmin: I48("modals_bear_admin.webp"),
    beadDreamToyshop: I48("modal_bear_dream_toyshop.webp"),
    bearDreamToyshop2: I48("modal_bear_dream_toyshop2.webp"),
    signboardCafe: I48("modal_signboard_cafe.webp"),
    signboardRamen: I48("modal_signboard_ramen.webp"),
    signboardTeishoku: I48("modal_signboard_teishoku.webp"),
    signboardBar: I48("modal_signboard_bar.webp"),
    girlDream: I48("modal_girl_dream.webp"),
    oldWoman: I48("modal_old_woman.webp"),
    oldWomenBuy: I48("modal_old_woman_buy.webp"),
    oldWomanBuyEn: I48("modal_old_woman_buy_en.webp"),
    exchangeOldWoman: I48("modal_exchange_old_woman.webp"),
    breadWindow: I48("modal_bread_window.webp"),
    posterCat: I48("modal_poster_cat.webp"),
    catOnBench: I48("modal_cat_on_bench.webp"),
    catShocked: I48("modal_cat_shocked.webp"),
    manWishBed: I48("modal_man_wish_bed.webp"),
    manWishBedEn: I48("modal_man_wish_bed_en.webp"),
    manGetMatch: I48("modal_man_get_match.webp"),
    manGetMatch2: I48("modal_man_get_match2.webp"),
    matchMen: I48("modal_match_men.webp"),
    roboStopped: I48("modal_robo_stopped.webp"),
    roboActivated: I48("modal_robo_activated.webp"),
    bearEatChicken: I48("modal_bear_eat_chicken.webp"),
    chicken: I48("modal_chieken.webp"),
    catPaint: I48("modal_cat_paint.webp"),
    manWork: I48("modal_man_work.webp"),
    manWorkEn: I48("modal_man_work_en.webp"),
    manGohome: I48("modal_man_gohome.webp"),
    manNotice: I48("modal_man_notice.webp"),
    bench: I48("modal_bench.webp"),
    ...Object.fromEntries(Array.from({ length: 4 }, (_, index) =>
      [`roboActive${index + 1}`, I48(`modal_robo_active_${index + 1}.webp`)])),
    ...Object.fromEntries(Array.from({ length: 6 }, (_, index) =>
      [`bread${index + 1}`, I48(`bread_${index + 1}.webp`)])),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState48";
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

// 座標はキャンバスに対するパーセント。オブジェクトや謎解きはここに追加する。
let rooms = {
  roadLeft: {
    name: "道の左側", description: "",
    clickableAreas: [
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("roadRight")),
        description: "道の右側へ", zIndex: 10,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 27.2, y: 51.4, width: 22.2, height: 26.1,
        onClick: clickWrap(() => {
          if (gameState.roadLeft.flags.bearReceivedBasket) changeRoom("roadBakery");
        }),
        description: '奥への矢印',
        zIndex: 5,
        usable: () => !!gameState.roadLeft.flags.bearReceivedBasket,
        item: { img: 'roadArrow', visible: () => !!gameState.roadLeft.flags.bearReceivedBasket }
      },
      {
        x: 57.4, y: 56.3, width: 6.9, height: 8.3,
        onClick: clickWrap(function () {
          showObj(null, "電柱に貼られたポスター", IMAGES.modals.posterCat, "電柱に貼られたポスターだ。");
        }),
        description: '電柱のポスター',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 15.1, y: 66.9, width: 14.0, height: 13.3,
        onClick: clickWrap(function () {
          if (gameState.roadLeft.flags.bearReceivedBasket) return;
          if (gameState.selectedItem === "basket" && hasItem("basket")) {
            gameState.roadLeft.flags.bearReceivedBasket = true;
            removeItem("basket");
            addItem("bearMatch");
            renderCanvasRoom();
            showModal("わあ！ありがとう！", `<img class="showobj-image" src="${IMAGES.modals.bearHappyWithBasket}">`, [
              { text: "次へ", action: () => showObj(null, "さっそく、マッチを売りに行こう！", IMAGES.modals.bearMotivated, "さっそく、マッチを売りに行こう！", IMAGES.modals.bearMotivatedEn, "Let's go sell matches right away!") }
            ], null, { contentClass: "showobj-modal" });
            updateMessage("わあ！ありがとう！");
            return;
          }
          gameState.roadLeft.flags.bearLostBasket = true;
          showObj(null, "かごを落としちゃった…", IMAGES.modals.bearLostBasket, "「かごを落としちゃった…」");
          renderCanvasRoom();
        }),
        description: 'クマ妖精',
        zIndex: 5,
        usable: () => !gameState.roadLeft.flags.bearReceivedBasket,
        item: { img: () => gameState.roadLeft.flags.bearLostBasket ? 'bearCrying' : 'bearBack', visible: () => !gameState.roadLeft.flags.bearReceivedBasket }
      },
    ],
  },
  roadBakery: {
    name: "路地", description: "",
    clickableAreas: [

      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '暗闇効果（パン屋）',
        zIndex: 5,
        usable: () => false,
        alpha: () => 1 - getBakeryLightProgress(),
        item: { img: 'fadeBakery', visible: () => getBakeryLightProgress() < 1 }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: 'ゴミ箱のふた',
        zIndex: 5,
        usable: () => false,

        item: { img: 'dustBoxLid', visible: () => !gameState.roadBakery.flags.dustBoxUnlocked }
      },
      {
        x: 68.8, y: 80.1, width: 11.4, height: 12.2,
        onClick: clickWrap(function () {
          if (!gameState.roadBakery.flags.dustBoxUnlocked) {
            openDustBoxPuzzle();
            return;
          }
          acquireItemOnce("foundTicket", "ticket", "紙を手に入れた", IMAGES.items.ticket, "ゴミ箱に引っかかっていた紙を手に入れた。");
        }),
        description: 'ゴミ箱',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 74.5, y: 81.8, width: 4.3, height: 3.0,
        onClick: clickWrap(function () {

        }),
        description: 'ゴミ箱に引っかかった紙',
        zIndex: 5,
        usable: () => false,
        item: { img: 'ticket', visible: () => gameState.roadBakery.flags.dustBoxUnlocked && !getMainFlags().foundTicket }
      },
      {
        x: 37.4, y: 87.0, width: 20.1, height: 11.9,
        onClick: clickWrap(() => openBakeryMatchSequence()),
        description: '円形の光',
        zIndex: 5,
        usable: () => !gameState.roadBakery.flags.bakeryLit,
        item: { img: 'IMAGE_KEY', visible: () => false }
      },
      {
        x: 37.0, y: 82.9, width: 15.4, height: 15.0,
        id: 'bakeryBear',
        onClick: clickWrap(function () {
          showObj(null, "マッチ売りのクマ妖精", IMAGES.modals.bearSellMatch, "マッチを売っている。", IMAGES.modals.bearSellMatchEn, "The bear fairy is selling matches.");
        }),
        description: '立っているクマ妖精（パン屋）',
        zIndex: 5,
        usable: () => !!gameState.roadBakery.flags.bakeryLit && !gameState.roadBakery.flags.bearRejoined,
        item: { img: 'bearMatch', visible: () => !!gameState.roadBakery.flags.bakeryLit && !gameState.roadBakery.flags.bearRejoined }
      },
      {
        x: 8.0, y: 67.7, width: 15.1, height: 18.2,
        onClick: clickWrap(function () {
          showObj(null, "パン屋のショーウインドウ", IMAGES.modals.breadWindow, "パン屋のショーウインドウだ。");
        }),
        description: 'パン屋のショーウインドウ',
        zIndex: 5,
        usable: () => !!gameState.roadBakery.flags.bakeryLit,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 81.7, y: 76.8, width: 17.9, height: 20.6,
        onClick: clickWrap(() => openOldWomanSequence()),
        description: '老婦人',
        zIndex: 5,
        usable: () => !!gameState.roadBakery.flags.bakeryLit && !gameState.roadBakery.flags.oldWomanExchanged,
        item: { img: 'oldWoman', visible: () => !!gameState.roadBakery.flags.bakeryLit && !gameState.roadBakery.flags.oldWomanExchanged }
      },
      {
        x: 50.5, y: 81.3, width: 8.7, height: 9.9,
        onClick: clickWrap(function () {
          showObj(null, "ベンチ", IMAGES.modals.bench, "ベンチだ。");
        }),
        description: 'ベンチクリック部',
        zIndex: 5,
        usable: () => !!gameState.roadBakery.flags.oldWomanExchanged,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 53.8, y: 77.2, width: 15.4, height: 15.8,
        onClick: clickWrap(function () {

        }),
        description: 'ベンチに座った老婦人',
        zIndex: 5,
        usable: () => false,
        item: { img: 'oldWomanSitting', visible: () => !!gameState.roadBakery.flags.oldWomanExchanged }
      },

      {
        x: 8.0, y: 85.4, width: 14.0, height: 14.2,
        onClick: clickWrap(function () {
          showObj(null, "「うちは、住宅ローンがあるからパンは買えないんだ。見ているだけなの」", IMAGES.modals.girlDream, "「うちは、住宅ローンがあるからパンは買えないんだ。見ているだけなの」",);
        }),
        description: '少女',
        zIndex: 5,
        usable: () => !!gameState.roadBakery.flags.bakeryLit,
        item: { img: 'girl', visible: () => !!gameState.roadBakery.flags.bakeryLit }
      },
      {
        x: 44.8, y: 72.8, width: 7.4, height: 8.1,
        onClick: clickWrap(() => openNoisePuzzle()),
        description: '騒音装置',
        zIndex: 5,
        usable: () => !!gameState.roadBakery.flags.bakeryLit,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: () => 54.9 + getCatMoveProgress() * 50,
        y: () => 80.7 + getCatMoveProgress() * 30,
        width: 8.7, height: 8.4,
        onClick: clickWrap(function () {
          showObj(null, "猫がいる", IMAGES.modals.catOnBench, "猫がベンチを占領している");
        }),
        description: '猫',
        zIndex: 5,
        usable: () => !!gameState.roadBakery.flags.bakeryLit && !gameState.roadBakery.flags.noiseUnlocked,
        item: { img: 'cat', visible: () => !!gameState.roadBakery.flags.bakeryLit && getCatMoveProgress() < 1 }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("roadToyShopLeft")),
        description: "おもちゃ屋の前へ", zIndex: 10,
        usable: () => !!gameState.roadBakery.flags.oldWomanExchanged,
        item: { img: "arrowRight", visible: () => !!gameState.roadBakery.flags.oldWomanExchanged },
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("roadLeft")),
        description: "道の左側へ戻る", zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },

    ],
  },
  roadToyShopLeft: {
    name: "おもちゃ屋の前", description: "",
    clickableAreas: [
      {
        x: 86.6, y: 55.2, width: 13.2, height: 34.3,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "bearMatch" && hasItem("bearMatch")) {
            openManGetMatchSequence();
            return;
          }
          showObj(null, "人形を持った男性", IMAGES.modals.manWishBed, "人形を持った男性だ。", IMAGES.modals.manWishBedEn, "A man holding a doll.");
        }),
        description: '人形を持った男性',
        zIndex: 5,
        usable: () => !gameState.roadToyShopLeft.flags.manReceivedMatch,
        item: { img: 'manWithDoll', visible: () => !gameState.roadToyShopLeft.flags.manReceivedMatch }
      },
      {
        x: 68.2, y: 72.6, width: 7.7, height: 5.8,
        onClick: clickWrap(function () {
          showObj(null, "テーブルの上のマッチ", IMAGES.modals.matchMen, "テーブルの上にマッチが置いてある。");
        }),
        description: 'テーブルの上のマッチ',
        zIndex: 5,
        usable: () => gameState.roadToyShopLeft.flags.manReceivedMatch,
        item: { img: 'matchMen', visible: () => gameState.roadToyShopLeft.flags.manReceivedMatch }
      },
      {
        x: 67.3, y: 78.3, width: 8.7, height: 7.0,
        onClick: clickWrap(function () {
          acquireItemOnce("foundRemote", "remocon", "リモコンを拾った", IMAGES.items.remocon, "落ちていたリモコンを拾った。");
        }),
        description: '落ちているリモコン',
        zIndex: 5,
        usable: () => getMainFlags().foundRemote !== true,
        item: { img: 'remocon', visible: () => getMainFlags().foundRemote !== true }
      },
      {
        x: 54.3, y: 41.1, width: 33.1, height: 29.4,
        onClick: clickWrap(() => openToyShopWindow()),
        description: 'ショーウインドウ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("roadToyShopRight")),
        description: "おもちゃ屋の右側へ", zIndex: 10,
        usable: () => !!gameState.roadToyShopLeft.flags.manReceivedMatch,
        item: { img: "arrowRight", visible: () => !!gameState.roadToyShopLeft.flags.manReceivedMatch },
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("roadBakery")),
        description: "パン屋の前へ戻る", zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
    ],
  },
  roadToyShopRight: {
    name: "おもちゃ屋の右側", description: "",
    clickableAreas: [
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '暗闇効果（おもちゃ屋）',
        zIndex: 5,
        usable: () => false,
        alpha: () => 1 - getToyShopLightProgress(),
        item: { img: 'fadeToyshop', visible: () => getToyShopLightProgress() < 1 }
      },
      {
        x: 74.1, y: 85.7, width: 21.3, height: 12.7,
        id: 'toyShopLight',
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "bearMatch" && hasItem("bearMatch")) {
            openBakeryMatchSequence("roadToyShopRight");
          } else {
            updateMessage("何かの立ち位置であるかのように光っている");
          }
        }),
        description: '円形の光（おもちゃ屋）',
        zIndex: 5,
        usable: () => !gameState.roadToyShopRight.flags.toyShopLit,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 77.1, y: 79.9, width: 18.8, height: 18.6,
        id: 'toyShopBear',
        onClick: clickWrap(function () {
          showObj(null, "マッチ売りのクマ妖精", IMAGES.modals.bearDreamToyshop2, "マッチ売りのクマ妖精だ。");
        }),
        description: 'クマ妖精立ち位置（おもちゃ屋）',
        zIndex: 5,
        usable: () => !!gameState.roadToyShopRight.flags.toyShopLit && !gameState.roadToyShopRight.flags.bearRejoined,
        item: { img: 'bearMatch', visible: () => !!gameState.roadToyShopRight.flags.toyShopLit && !gameState.roadToyShopRight.flags.bearRejoined }
      },
      {
        x: 7.4, y: 52.6, width: 10.7, height: 8.4,
        onClick: clickWrap(function () {
          updateMessage("「食事中」と書かれている");
        }),
        description: 'おもちゃ屋ドアの張り紙',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 5.0, y: 49.8, width: 15.5, height: 34.1,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "ticket" && hasItem("ticket")) {
            removeItem("ticket");
            addItem("crown");
            showObj(null, "交換チケットだね。はい、どうぞ", IMAGES.modals.manNotice, "おもちゃの王冠を手に入れた。");
            return;
          }
          updateMessage("「いらっしゃいませ」");
        }),
        description: '立っている男性',
        zIndex: 5,
        usable: isManStandingAvailable,
        item: { img: 'manStanding', visible: isManStandingAvailable }
      },
      {
        x: 37.1, y: 43.4, width: 39.6, height: 41.6,
        onClick: clickWrap(function () {
          updateMessage("ロボットが道をふさいでいる。");
        }),
        description: 'ロボ直立',
        zIndex: 5,
        usable: () => !!gameState.roadToyShopRight.flags.toyShopLit && !gameState.roadToyShopRight.flags.roboUnlocked,
        item: { img: () => gameState.roadToyShopRight.flags.roboUnlocked ? 'roboStep' : 'roboStands', visible: () => !!gameState.roadToyShopRight.flags.toyShopLit }
      },
      {
        x: 24.5, y: 58.9, width: 15.8, height: 20.8,
        onClick: clickWrap(() => openRoboPanelPuzzle()),
        description: 'ロボ操作パネル',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 82.7, y: 52.0, width: 16.9, height: 33.4,
        onClick: clickWrap(function () {
          openVendingMachine1();
        }),
        description: '自販機１',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 41.5, y: 45.4, width: 13.6, height: 36.3,
        onClick: clickWrap(() => changeRoom("roadFastfoodLeft")),
        description: 'ロボの奥への矢印',
        zIndex: 5,
        usable: () => !!gameState.roadToyShopRight.flags.roboUnlocked,
        item: { img: 'roadArrow', visible: () => !!gameState.roadToyShopRight.flags.roboUnlocked }
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("roadToyShopLeft")),
        description: "おもちゃ屋の左側へ戻る", zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
    ],
  },
  roadFastfoodLeft: {
    name: "繁華街", description: "",
    clickableAreas: [
      {
        x: 8.1, y: 55.3, width: 12.1, height: 11.6,
        onClick: clickWrap(function () {
          showObj(null, "寝そべる猫", IMAGES.modals.catPaint, "猫が寝そべっている。");
        }),
        description: '寝そべる猫',
        zIndex: 5,
        usable: () => true,
        item: { img: 'cat2', visible: () => true }
      },
      {
        x: 25.6, y: 46.6, width: 10.6, height: 22.0,
        onClick: clickWrap(function () {
          openVendingMachine2();
        }),
        description: '自販機２',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 41.1, y: 80.8, width: 41.6, height: 15.0,
        onClick: clickWrap(function () {
          if (gameState.roadFastfoodRight.flags.phoneCompleted) {
            travelWithSteps("heaven");
            return;
          }
          updateMessage("マンホールがある。");
        }),
        description: 'マンホール',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: 'マンホールの光',
        zIndex: 5,
        usable: () => false,
        item: { img: 'shineManhole', visible: () => !!gameState.roadFastfoodRight.flags.phoneCompleted }
      },
      {
        x: 26.0, y: 46.6, width: 34.5, height: 32.2,
        onClick: clickWrap(function () {
          const state = gameState;
          showObj(null, "袋を持った男性", IMAGES.modals.manGohome, "袋を持った男性が足早に去っていった。");
          window.addEventListener("modal:closed", () => {
            if (gameState === state) startManWithBagFade();
          }, { once: true });
        }),
        description: '袋を持った男性',
        zIndex: 5,
        usable: () => !gameState.roadFastfoodLeft.flags.manGone,
        alpha: getManWithBagAlpha,
        item: { img: 'manWithBag', visible: () => getManWithBagAlpha() > 0 }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("roadFastfoodRight")),
        description: "ファストフード店の右側へ", zIndex: 10,
        item: { img: "arrowRight", visible: () => true },
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("roadToyShopRight")),
        description: "おもちゃ屋の右側へ戻る", zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
    ],
  },
  roadFastfoodRight: {
    name: "繁華街の右側", description: "",
    clickableAreas: [
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(() => { }),
        description: "暗闇効果（ファストフード店）", zIndex: 5,
        usable: () => false,
        alpha: () => 1 - getFastfoodLightProgress(),
        item: { img: "fadeFastfood", visible: () => getFastfoodLightProgress() < 1 },
      },
      {
        x: 66.7, y: 73.4, width: 21.7, height: 12.7,
        id: "fastfoodLight",
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "bearMatch" && hasItem("bearMatch")) {
            openBakeryMatchSequence("roadFastfoodRight");
          } else {
            updateMessage("何かの立ち位置であるかのように光っている");
          }
        }),
        description: '円形の光（ファストフード店）',
        zIndex: 5,
        usable: () => !gameState.roadFastfoodRight.flags.fastfoodLit,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 70.2, y: 66.1, width: 17.0, height: 17.3,
        id: "fastfoodBear",
        onClick: clickWrap(function () {
          openFastfoodPhoneEvent();
        }),
        description: 'クマ妖精立ち位置（ファストフード店）',
        zIndex: 5,
        usable: () => !!gameState.roadFastfoodRight.flags.phoneIncoming || !!gameState.roadFastfoodRight.flags.phoneCompleted,
        item: { img: () => gameState.roadFastfoodRight.flags.phoneIncoming && !gameState.roadFastfoodRight.flags.phoneCompleted ? 'bearMatchIncoming' : 'bearMatch', visible: () => !!gameState.roadFastfoodRight.flags.fastfoodLit }
      },
      {
        x: 38.5, y: 36.1, width: 8.6, height: 16.7,
        onClick: clickWrap(function () {
          openFastfoodDoorPuzzle();
        }),
        description: 'ドア操作盤',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 15.9, y: 38.7, width: 21.3, height: 34.4,
        onClick: clickWrap(function () {
          if (gameState.roadFastfoodRight.flags.doorUnlocked) {
            openChickenOrder();
          } else {
            updateMessage("ドアはロックされているようだ。");
          }
        }),
        description: 'ドア',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("roadFastfoodLeft")),
        description: "ファストフード店の左側へ戻る", zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
    ],
  },
  roadRight: {
    name: "道の右側", description: "",
    clickableAreas: [
      {
        x: 0, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("roadLeft")),
        description: "道の左側へ", zIndex: 10,
        item: { img: "arrowLeft", visible: () => true },
      },
      {
        x: 69.8, y: 78.7, width: 7.0, height: 5.3,
        onClick: clickWrap(function () {
          if (!getMainFlags().manMoved || getMainFlags().foundBasket) return;
          acquireItemOnce("foundBasket", "basket", "かごを拾った", IMAGES.items.basket, "落ちていたかごを拾った。");
        }),
        description: '落ちているかご',
        zIndex: 5,
        usable: () => getMainFlags().manMoved === true && getMainFlags().foundBasket !== true,
        item: { img: 'basket', visible: () => getMainFlags().foundBasket !== true }
      },
      {
        x: () => 63.6 + getManMoveProgress() * 40,
        y: () => 64.1 + getManMoveProgress() * 25,
        width: 20.1, height: 19.8,
        onClick: clickWrap(function () {
          showObj(null, "信号待ちの男性", IMAGES.modals.manWork, "信号待ちの男性だ。", IMAGES.modals.manWorkEn);
        }),
        description: '信号待ちの男性',
        zIndex: 5,
        usable: () => getManMoveProgress() < 1,
        item: { img: 'manWaiting', visible: () => getManMoveProgress() < 1 }
      },
      {
        x: 76.5, y: 76.7, width: 23.5, height: 23.3,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (flags.receivedPocketTissue) {
            updateMessage("信号を渡り終えた男性だ。");
            return;
          }
          if (!hasItem("pocketTissue")) addItem("pocketTissue");
          if (!hasItem("pocketTissue")) return;
          flags.receivedPocketTissue = true;
          showObj(null, "ポケットティッシュをもらった", IMAGES.modals.manTissue,
            "ポケットティッシュをもらった。", IMAGES.modals.manTissueEn);
        }),
        description: '信号を渡り終えた男性',
        zIndex: 5,
        usable: () => getManMoveProgress() >= 1,
        item: { img: 'manDelivering', visible: () => getManMoveProgress() >= 1 }
      },
      {
        x: 59.6, y: 80.0, width: 8.5, height: 14.1,
        onClick: clickWrap(() => openCrossingPuzzle()),
        description: '押しボタン',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 3.2, y: 47.2, width: 22.4, height: 7.6,
        onClick: clickWrap(function () {
          showObj(null, "定食屋さんの看板", IMAGES.modals.signboardTeishoku, "定食屋さんの看板だ");
        }),
        description: '看板定食',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 28.2, y: 48.3, width: 27.1, height: 8.0,
        onClick: clickWrap(function () {
          showObj(null, "ラーメン屋さんの看板", IMAGES.modals.signboardRamen, "ラーメン屋さんの看板だ");
        }),
        description: '看板ラーメン',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 57.2, y: 48.1, width: 13.8, height: 7.4,
        onClick: clickWrap(function () {
          showObj(null, "バーの看板", IMAGES.modals.signboardBar, "バーの看板だ");
        }),
        description: '看板バー',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 86.0, y: 48.6, width: 13.8, height: 7.0,
        onClick: clickWrap(function () {
          showObj(null, "カフェの看板", IMAGES.modals.signboardCafe, "カフェの看板だ");
        }),
        description: '看板カフェ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
    ],
  },
  heaven: {
    name: "天界",
    description: "",
    clickableAreas: [
      {
        x: 36.2, y: 23.1, width: 27.2, height: 29.2,
        onClick: clickWrap(function () {
          openBearSageEvent();
        }),
        description: 'クマ賢者',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
    ],
  },
  end: {
    name: "天界エンド",
    description: "天界へと脱出しました！おめでとうございます！",
    clickableAreas: [{
      x: 0, y: 0, width: 100, height: 100,
      onClick: clickWrap(() => showEndingReport("end"), { allowAtNight: true }),
      description: "ノーマルエンド", zIndex: 0, usable: () => true,
    }],
  },
  trueEnd: {
    name: "トゥルーエンド",
    description: "路上から暖かい店内へ脱出しました！おめでとうございます！",
    clickableAreas: [
      {
        x: 9.5, y: 48.1, width: 24.3, height: 21.0,
        onClick: clickWrap(function () {
          if (gameState.trueEnd.flags.backgroundState === 0) {
            showObj(null, "「美味しいねえ。あれ？ボク何かしてる途中だったような…」", IMAGES.modals.bearEatChicken, "クマ妖精はチキンを食べている。");
            return;
          } else {
            showObj(null, "「似合う？えへへ…」", IMAGES.modals.bearEatChicken2, "クマ妖精は王冠を気に入ったようだ。");
            return;
          }
        }),
        description: 'チキンを食べるクマ妖精',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(() => showEndingReport("trueEnd"), { allowAtNight: true }),
        description: "トゥルーエンド", zIndex: 0, usable: () => true,
      }
    ],
  },
};

function showEndingReport(endingId = "end") {
  const elapsed = Math.max(0, Math.round((Date.now() - (ANA.start || Date.now())) / 1000));
  const playTime = `${Math.floor(elapsed / 60)}分${String(elapsed % 60).padStart(2, "0")}秒`;
  ANA.once("ending", endingId, { ending: endingId, time_sec: elapsed });
  showModal("エンディング", `
    <div style="max-width:520px;text-align:center;">
      <h2 style="margin-top:0;">${endingId === "trueEnd" ? "★ TRUE END" : "★ NORMAL END"}</h2>
      <p style="margin:6px 0 12px;font-weight:bold;">${rooms[endingId].description}</p>
      <p style="margin:4px 0;">プレイ時間：<b>${playTime}</b></p>
      <p style="margin:4px 0;">ヒント利用：<b>${ANA.hintCount || 0} 回</b></p>
      <p style="margin:12px 0;font-size:.9em;opacity:.85;">遊んでくれてありがとうございました！</p>
    </div>
  `, [
    { text: "最初から", action: "restart" },
    { text: "プレイ後アンケート", action: () => openFeedbackForm(endingId) },
    { text: "閉じる", action: "close" },
  ]);
}

function openFeedbackForm(endingId) {
  const feedbackUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeRRDE-ZukowuIDzbpgp4TkIYt177-plUIm2_7-mzZnxq2QxQ/viewform";
  const endingLabel = endingId === "trueEnd" ? "トゥルーエンド" : "ノーマルエンド";
  const params = new URLSearchParams({ "entry.666725843": endingLabel });
  window.open(`${feedbackUrl}?${params.toString()}`, "_blank", "noopener");
}

function openBearSageEvent() {
  const state = gameState;
  state.inventory = state.inventory.filter(itemId => itemId === "crown");
  state.money = 0;
  state.inventoryPage = 0;
  clearUsingItem();
  showModal("「おお！良い働きじゃ。」<br>お金を渡した。", `<img class="showobj-image" src="${IMAGES.modals.bearPassMoney}" alt="クマがお金を渡す">`, [
    {
      text: "次へ", action: () => {
        showObj(null, "そろそろ始めるか！", IMAGES.modals.bearAdmin, "そろそろ始めるか！");
        window.addEventListener("modal:closed", () => {
          if (gameState === state && state.currentRoom === "heaven") travelWithSteps("end");
        }, { once: true });
      }
    }
  ], null, { contentClass: "showobj-modal" });
}

let endingTravelActive = false;
function travelWithSteps(destRoom, { soundId = "se-fanta", transitionDelay = 480 } = {}) {
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

// 移動中の情報は一時保持。ロード時はmanMovedに応じて移動先を表示する。
let bakeryLightAnimation = null;
let toyShopLightAnimation = null;
let fastfoodLightAnimation = null;
const BAKERY_LIGHT_DURATION = 2800;

function openToyShopWindow() {
  const flags = gameState.roadToyShopLeft.flags;
  if (!flags.roboActivated) {
    if (gameState.selectedItem === "remocon" && hasItem("remocon")) {
      flags.roboActivated = true;
      removeItem("remocon");
      playSE("se-cyber");
      showObj(null, "ロボットたちが反応した", IMAGES.modals.roboActivated, "リモコンにロボットたちが反応した。");
    } else {
      showObj(null, "おもちゃ屋のショーウインドウ", IMAGES.modals.roboStopped, "ロボットが飾られている。");
    }
    return;
  }

  showObj(null, "おもちゃ屋のショーウインドウ", IMAGES.modals.roboActive1, "ロボットが飾られている。");
  const modal = document.getElementById("modal");
  const image = document.querySelector("#modalContent .showobj-image");
  const state = gameState;
  const startedAt = performance.now();
  function animate(now) {
    if (gameState !== state || !image?.isConnected || modal.style.display === "none") return;
    const frame = Math.floor((now - startedAt) / 400) % 4 + 1;
    const src = IMAGES.modals[`roboActive${frame}`];
    if (image.getAttribute("src") !== src) image.setAttribute("src", src);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function getFastfoodLightProgress() {
  if (!gameState.roadFastfoodRight.flags.fastfoodLit) return 0;
  if (fastfoodLightAnimation?.state !== gameState) return 1;
  return Math.min(1, (performance.now() - fastfoodLightAnimation.startedAt) / BAKERY_LIGHT_DURATION);
}

function getToyShopLightProgress() {
  if (!gameState.roadToyShopRight.flags.toyShopLit) return 0;
  if (toyShopLightAnimation?.state !== gameState) return 1;
  return Math.min(1, (performance.now() - toyShopLightAnimation.startedAt) / BAKERY_LIGHT_DURATION);
}

function getBakeryLightProgress() {
  if (!gameState.roadBakery.flags.bakeryLit) return 0;
  if (bakeryLightAnimation?.state !== gameState) return 1;
  return Math.min(1, (performance.now() - bakeryLightAnimation.startedAt) / BAKERY_LIGHT_DURATION);
}

function openBakeryMatchSequence(roomId = "roadBakery") {
  const isToyShop = roomId === "roadToyShopRight";
  const isFastfood = roomId === "roadFastfoodRight";
  const lightFlag = isFastfood ? "fastfoodLit" : isToyShop ? "toyShopLit" : "bakeryLit";
  if (gameState[roomId].flags[lightFlag]) return;
  if ((isToyShop || isFastfood) && (gameState.selectedItem !== "bearMatch" || !hasItem("bearMatch"))) return;
  const state = gameState;
  playSE("se-match");
  showModal("マッチ売りのクマは、マッチを擦った", `<img class="showobj-image" src="${uiLang === "en" ? IMAGES.modals.bearStrikeMatchEn : IMAGES.modals.bearStrikeMatch}">`, [
    {
      text: "次へ", action: () => {
        if (gameState !== state) return;
        playSE("se-fanta");
        showModal("幻想が広がる…", `<img class="showobj-image" src="${isFastfood ? IMAGES.modals.bearDreamFastfood : isToyShop ? IMAGES.modals.beadDreamToyshop : IMAGES.modals.bearDreamBread}">`, [
          { text: "閉じる", action: "close" }
        ], null, { contentClass: "showobj-modal" });
        // ×、閉じるボタン、背景クリックのどの閉じ方でも演出を開始する。
        window.addEventListener("modal:closed", () => {
          if (gameState === state) startBakeryLight(roomId);
        }, { once: true });
      }
    }
  ], null, { contentClass: "showobj-modal" });
}

function startBakeryLight(roomId = "roadBakery") {
  const isToyShop = roomId === "roadToyShopRight";
  const isFastfood = roomId === "roadFastfoodRight";
  const flag = isFastfood ? "fastfoodLit" : isToyShop ? "toyShopLit" : "bakeryLit";
  if (gameState[roomId].flags[flag]) return;
  gameState[roomId].flags[flag] = true;
  removeItem("bearMatch");
  const bearArea = rooms[roomId].clickableAreas.find(area => area.id === (isFastfood ? "fastfoodBear" : isToyShop ? "toyShopBear" : "bakeryBear"));
  const bearX = resolveAreaMetric(bearArea, "x");
  const bearY = resolveAreaMetric(bearArea, "y");
  const bearWidth = resolveAreaMetric(bearArea, "width");
  const bearHeight = resolveAreaMetric(bearArea, "height");
  const animation = {
    state: gameState, startedAt: performance.now(),
    particles: Array.from({ length: 100 }, () => ({
      x: bearX + Math.random() * bearWidth, y: bearY + Math.random() * bearHeight,
      angle: Math.random() * Math.PI * 2, distance: 15 + Math.random() * 65,
      delay: Math.random() * 0.25, size: 1 + Math.random() * 2.5
    }))
  };
  if (isFastfood) fastfoodLightAnimation = animation;
  else if (isToyShop) toyShopLightAnimation = animation;
  else bakeryLightAnimation = animation;
  function animate() {
    if (gameState !== animation.state || (isFastfood ? fastfoodLightAnimation : isToyShop ? toyShopLightAnimation : bakeryLightAnimation) !== animation) return;
    const finished = (isFastfood ? getFastfoodLightProgress() : isToyShop ? getToyShopLightProgress() : getBakeryLightProgress()) >= 1;
    if (finished) {
      if (isFastfood) {
        fastfoodLightAnimation = null;
        gameState.roadFastfoodRight.flags.phoneIncoming = true;
        playSE("se-phone");
      }
      else if (isToyShop) toyShopLightAnimation = null;
      else bakeryLightAnimation = null;
    }
    if (gameState.currentRoom === roomId) renderCanvasRoom();
    if (!finished) requestAnimationFrame(animate);
  }
  animate();
}

function openChickenOrder() {
  const state = gameState;
  const price = 1000;
  const formatYen = amount => `${amount.toLocaleString("ja-JP")}円`;
  const content = `
    <img class="showobj-image" src="${IMAGES.modals.chicken}" alt="チキン" onerror="this.style.display = 'none'">
    <p>チキン ${formatYen(price)}</p>
    <p>所持金 ${formatYen(state.money || 0)}</p>
    <p id="chickenOrderFeedback" role="status" aria-live="polite"></p>
  `;
  showModal("チキンの注文", content, [
    {
      text: "チキンを買う", action: () => {
        if (gameState !== state || state.currentRoom !== "roadFastfoodRight" || endingTravelActive) return;
        if ((state.money || 0) < price) {
          document.getElementById("chickenOrderFeedback").textContent = "お金が足りない。";
          return;
        }
        state.money -= price;
        if (state.money === 0) removeItem("money");
        else updateInventoryDisplay();
        closeModal();
        playSE("se-register");
        updateMessage("1,000円でチキンを買った！");
        travelWithSteps("trueEnd", { soundId: "se-ashioto" });
      }
    },
    { text: "閉じる", action: "close" }
  ], null, { contentClass: "showobj-modal" });
}

function openFastfoodDoorPuzzle() {
  const flags = gameState.roadFastfoodRight.flags;
  if (flags.doorUnlocked) {
    updateMessage("ドアのロックは解除されている。");
    return;
  }
  const { iconStar, iconMoon, iconAngel, iconLeaf } = IMAGES.modals;
  const icons = [iconStar, iconMoon, iconAngel, iconLeaf];
  const labels = ["星", "月", "天使", "葉"];
  const positions = [0, 0, 0];
  showModal("ドア操作盤", `
    <div id="fastfoodDoorIcons" style="display:flex;gap:8px;width:300px;max-width:100%;margin:16px auto;">
      ${positions.map((_, index) => `<button type="button" aria-label="${index + 1}マス目：星" style="flex:1;min-width:0;aspect-ratio:1;padding:6px;cursor:pointer"><img src="${iconStar}" alt="" style="display:block;width:100%;height:100%;object-fit:contain"></button>`).join("")}
    </div>
  `, [
    {
      text: "OK", action: () => {
        const [left, middle, right] = positions;
        if (icons[left] !== iconAngel || icons[middle] !== iconStar || icons[right] !== iconLeaf) return;
        flags.doorUnlocked = true;
        playSE("se-clear");
        closeModal();
        updateMessage("ドアのロックを解除した。");
      }
    },
    { text: "閉じる", action: "close" },
  ]);
  document.querySelectorAll("#fastfoodDoorIcons button").forEach((button, index) => {
    button.onclick = () => {
      positions[index] = (positions[index] + 1) % icons.length;
      button.firstElementChild.src = icons[positions[index]];
      button.setAttribute("aria-label", `${index + 1}マス目：${labels[positions[index]]}`);
    };
  });
}

function openFastfoodPhoneEvent() {
  const state = gameState;
  const flags = state.roadFastfoodRight.flags;
  if (flags.phoneCompleted) {
    showObj(null, "マッチ売りのクマ妖精", IMAGES.modals.bearDreamFastfood3, "マッチ売りのクマ妖精だ。");
    return;
  }
  if (!flags.phoneIncoming || flags.phoneCompleted) return;
  showObj(null, "マッチ売りのクマ妖精", IMAGES.modals.bearDreamFastfood2, "クマ妖精の電話が鳴っている。");
  const image = document.querySelector("#modalContent .showobj-image");
  image.style.cursor = "pointer";
  image.addEventListener("click", (event) => {
    const bounds = image.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    if (x < 0.4 || x > 0.94 || y < 0.5 || gameState !== state) return;
    showModal("電話に出るクマ妖精", `<img class="showobj-image" src="${uiLang === "en" ? IMAGES.modals.bearPhoneEn : IMAGES.modals.bearPhone}">`, [
      {
        text: "次へ", action: () => {
          if (gameState !== state) return;
          showObj(null, "クマ妖精", IMAGES.modals.bearGohome, "クマ妖精は電話を終えた。", IMAGES.modals.bearGohomeEn);
          window.addEventListener("modal:closed", () => {
            if (gameState !== state) return;
            flags.phoneIncoming = false;
            flags.phoneCompleted = true;
            renderCanvasRoom();
          }, { once: true });
        }
      }
    ], null, { contentClass: "showobj-modal" });
  });
}

function drawBakeryLight(ctx, canvas) {
  const isToyShop = gameState.currentRoom === "roadToyShopRight";
  const isFastfood = gameState.currentRoom === "roadFastfoodRight";
  const animation = isFastfood ? fastfoodLightAnimation : isToyShop ? toyShopLightAnimation : bakeryLightAnimation;
  if ((!isFastfood && !isToyShop && gameState.currentRoom !== "roadBakery") || animation?.state !== gameState) return;
  const progress = isFastfood ? getFastfoodLightProgress() : isToyShop ? getToyShopLightProgress() : getBakeryLightProgress();
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = "#fff3ba";
  ctx.shadowColor = "#ffd36a";
  ctx.shadowBlur = 12;
  for (const particle of animation.particles) {
    const t = (progress - particle.delay) / (1 - particle.delay);
    if (t <= 0 || t >= 1) continue;
    const distance = particle.distance * t;
    ctx.globalAlpha = Math.sin(Math.PI * t) * (1 - t);
    ctx.beginPath();
    ctx.arc((particle.x + Math.cos(particle.angle) * distance) / 100 * canvas.width,
      (particle.y + Math.sin(particle.angle) * distance) / 100 * canvas.height,
      particle.size * canvas.width / 640, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function openManGetMatchSequence() {
  const state = gameState;
  if (state.roadToyShopLeft.flags.manReceivedMatch || !hasItem("bearMatch")) return;
  showModal("おお、この箱は！", `<img class="showobj-image" src="${IMAGES.modals.manGetMatch}">`, [
    {
      text: "次へ", action: () => {
        if (gameState !== state || state.roadToyShopLeft.flags.manReceivedMatch) return;
        showModal("マッチが一箱売れた。", `<img class="showobj-image" src="${IMAGES.modals.manGetMatch2}">`, [
          { text: "閉じる", action: "close" }
        ], null, { contentClass: "showobj-modal" });
        playSE("se-register");
        updateMessage("マッチが一箱売れた。中身はいらないようだ");
        window.addEventListener("modal:closed", () => {
          if (gameState !== state || state.roadToyShopLeft.flags.manReceivedMatch) return;
          if (!addMoney(500)) return;
          state.roadToyShopLeft.flags.manReceivedMatch = true;
          updateMessage("男性から500円を受け取った。");
          renderCanvasRoom();
        }, { once: true });
      }
    },
    { text: "閉じる", action: "close" }
  ], null, { contentClass: "showobj-modal" });
  updateMessage("おお、この箱は！");
}

function openOldWomanSequence() {
  const state = gameState;
  if (state.roadBakery.flags.oldWomanExchanged) return;
  if (getCatMoveProgress() < 1) {
    showObj(null, "「座りたいねえ…」", IMAGES.modals.oldWoman, "「座りたいねえ…」");
    return;
  }
  showModal("老婦人", `<img class="showobj-image" src="${uiLang === "en" ? IMAGES.modals.oldWomanBuyEn : IMAGES.modals.oldWomenBuy}">`, [
    {
      text: "次へ", action: () => {
        if (gameState !== state || state.roadBakery.flags.oldWomanExchanged) return;
        showModal("老婦人", `<img class="showobj-image" src="${IMAGES.modals.exchangeOldWoman}">`, [
          { text: "閉じる", action: "close" }
        ], null, { contentClass: "showobj-modal" });
        window.addEventListener("modal:closed", () => {
          if (gameState !== state || state.roadBakery.flags.oldWomanExchanged) return;
          if (!addMoney(500)) return;
          state.roadBakery.flags.oldWomanExchanged = true;
          playSE("se-register");
          updateMessage("老婦人から500円を受け取った。");
          renderCanvasRoom();
        }, { once: true });
      }
    },
    { text: "閉じる", action: "close" }
  ], null, { contentClass: "showobj-modal" });
}

let catMoveAnimation = null;
const CAT_MOVE_DURATION = 1200;

function getCatMoveProgress() {
  if (!gameState.roadBakery.flags.catGone) return 0;
  if (catMoveAnimation?.state !== gameState) return 1;
  return Math.min(1, (performance.now() - catMoveAnimation.startedAt) / CAT_MOVE_DURATION);
}

function startCatMoving() {
  if (gameState.roadBakery.flags.catGone) return;
  gameState.roadBakery.flags.catGone = true;
  const animation = { state: gameState, startedAt: performance.now() };
  catMoveAnimation = animation;
  function animate() {
    if (gameState !== animation.state || catMoveAnimation !== animation) return;
    const finished = getCatMoveProgress() >= 1;
    if (finished) catMoveAnimation = null;
    if (gameState.currentRoom === "roadBakery") renderCanvasRoom();
    if (!finished) requestAnimationFrame(animate);
  }
  animate();
}

function openNoisePuzzle() {
  if (gameState.roadBakery.flags.noiseUnlocked) {
    updateMessage("騒音装置のロックは解除されている。");
    return;
  }
  const state = gameState;
  const breadOrder = [6, 3, 2, 5, 1, 4];
  const values = Array(3).fill(breadOrder[0]);
  const content = `<div style="display:flex;gap:8px;justify-content:center">${values.map((value, index) =>
    `<button type="button" class="noise-bread" aria-label="${index + 1}マス目：パン${value}" style="flex:1;min-width:0;max-width:120px;padding:6px;cursor:pointer"><img src="${IMAGES.modals[`bread${value}`]}" alt="パン${value}" style="display:block;width:100%;aspect-ratio:1;object-fit:contain"></button>`
  ).join("")}</div><p id="noisePuzzleFeedback" role="status" aria-live="polite"></p>`;
  showModal("騒音装置", content, [
    {
      text: "OK", action: () => {
        if (gameState !== state || state.roadBakery.flags.noiseUnlocked) return;
        if (values.join("") !== "541") {
          document.getElementById("noisePuzzleFeedback").textContent = "組み合わせが違うようだ。";
          return;
        }
        state.roadBakery.flags.noiseUnlocked = true;
        playSE("se-clear");
        showModal("猫はびっくりした！", `<img class="showobj-image" src="${IMAGES.modals.catShocked}">`, [
          { text: "閉じる", action: "close" }
        ], null, { contentClass: "showobj-modal" });
        window.addEventListener("modal:closed", () => {
          if (gameState === state) startCatMoving();
        }, { once: true });
        updateMessage("ロックが解除され、騒音装置が鳴り出した。");
      }
    },
    { text: "閉じる", action: "close" }
  ]);
  document.querySelectorAll(".noise-bread").forEach((button, index) => {
    button.onclick = () => {
      const currentIndex = breadOrder.indexOf(values[index]);
      values[index] = breadOrder[(currentIndex + 1) % breadOrder.length];
      const image = button.querySelector("img");
      image.src = IMAGES.modals[`bread${values[index]}`];
      image.alt = `パン${values[index]}`;
      button.setAttribute("aria-label", `${index + 1}マス目：パン${values[index]}`);
      document.getElementById("noisePuzzleFeedback").textContent = "";
      playSE("se-pi");
    };
  });
}

function openRoboPanelPuzzle() {
  const state = gameState;
  const flags = state.roadToyShopRight.flags;
  if (flags.roboUnlocked) {
    updateMessage("ロボ操作パネルはアンロックされている。");
    return;
  }
  const letters = ["A", "E", "L", "M", "O", "P", "R", "S", "T", "V"];
  const values = [0, 0, 0, 0];
  const content = `<div style="display:flex;justify-content:center;gap:8px;margin:20px 0;">${values.map((value, index) =>
    `<button type="button" class="robo-panel-letter notranslate" translate="no" aria-label="${index + 1}マス目：${letters[value]}" style="flex:0 1 64px;width:64px;min-width:0;aspect-ratio:1;padding:0;border:1px solid #aaa;border-radius:0;background:#ddd;color:#222;font-size:30px;font-weight:bold;cursor:pointer;">${letters[value]}</button>`
  ).join("")}</div><p id="roboPanelFeedback" role="status" aria-live="polite"></p>`;
  showModal("操作パネル", content, [
    {
      text: "OK", action: () => {
        if (gameState !== state || flags.roboUnlocked) return;
        if (values.map(value => letters[value]).join("") !== "PASS") {
          document.getElementById("roboPanelFeedback").textContent = "文字が違うようだ。";
          return;
        }
        flags.roboUnlocked = true;
        playSE("se-robo");
        closeModal();
        renderCanvasRoom();
        updateMessage("アンロックされ、ロボットが足を動かした。");
      }
    },
    { text: "閉じる", action: "close" }
  ]);
  document.querySelectorAll(".robo-panel-letter").forEach((button, index) => {
    button.onclick = () => {
      values[index] = (values[index] + 1) % letters.length;
      button.textContent = letters[values[index]];
      button.setAttribute("aria-label", `${index + 1}マス目：${button.textContent}`);
      document.getElementById("roboPanelFeedback").textContent = "";
      playSE("se-pi");
    };
  });
}

function openDustBoxPuzzle() {
  const state = gameState;
  const symbols = ["×", "△", "◎", "□"];
  let input = "";
  const content = `<div class="crossing-digits dust-box-symbols">${symbols.map(symbol =>
    `<button type="button" class="crossing-digit">${symbol}</button>`
  ).join("")}</div><p id="dustBoxFeedback" role="status" aria-live="polite"></p>`;
  showModal("ゴミ箱", content, [
    {
      text: "OK", action: () => {
        if (gameState !== state || state.roadBakery.flags.dustBoxUnlocked) return;
        if (input !== "□×□△◎") {
          input = "";
          feedback.textContent = "順番が違うようだ。";
          return;
        }
        state.roadBakery.flags.dustBoxUnlocked = true;
        playSE("se-clear");
        closeModal();
        renderCanvasRoom();
        updateMessage("ゴミ箱のロックが解除された。");
      }
    },
    { text: "閉じる", action: "close" }
  ], null, { contentClass: "dust-box-puzzle-modal" });
  const feedback = document.getElementById("dustBoxFeedback");
  document.querySelectorAll(".dust-box-symbols button").forEach((button, index) => {
    button.onclick = () => {
      input += symbols[index];
      feedback.textContent = input;
      playSE("se-pi");
    };
  });
}

function openCrossingPuzzle() {
  if (getMainFlags().manMoved) {
    updateMessage("信号はすでに切り替わっている。");
    return;
  }
  const digits = [0, 0, 0, 0];
  const puzzleState = gameState;
  const content = `<div class="crossing-digits">${digits.map((digit, index) =>
    `<button type="button" class="crossing-digit" data-digit="${index}" aria-label="${index + 1}桁目：${digit}">${digit}</button>`
  ).join("")}</div><p id="crossingPuzzleFeedback" role="status" aria-live="polite"></p>`;
  showModal("押しボタン", content, [
    {
      text: "👁 OK", action: () => {
        if (gameState !== puzzleState || getMainFlags().manMoved) return;
        if (digits.join("") !== "2346") {
          document.getElementById("crossingPuzzleFeedback").textContent = "数字が違うようだ。";
          return;
        }
        playSE("se-clear");
        closeModal();
        gameState.roadRight.flags.backgroundState = 1;
        startManMoving();
        renderCanvasRoom();
        updateMessage("ロックが解除され、信号が切り替わった。");
      }
    },
    { text: "閉じる", action: "close" }
  ], null, { contentClass: "crossing-puzzle-modal" });
  document.querySelectorAll(".crossing-digit").forEach((button, index) => {
    button.onclick = () => {
      digits[index] = (digits[index] + 1) % 10;
      playSE("se-pi");
      button.textContent = String(digits[index]);
      button.setAttribute("aria-label", `${index + 1}桁目：${digits[index]}`);
      document.getElementById("crossingPuzzleFeedback").textContent = "";
    };
  });
}

let manMoveAnimation = null;
const MAN_MOVE_DURATION = 12000;

function getManMoveProgress() {
  if (!getMainFlags().manMoved) return 0;
  if (manMoveAnimation?.state !== gameState) return 1;
  return Math.min(1, (performance.now() - manMoveAnimation.startedAt) / MAN_MOVE_DURATION);
}

function startManMoving() {
  if (getMainFlags().manMoved) return;
  getMainFlags().manMoved = true;
  const animation = { state: gameState, startedAt: performance.now() };
  manMoveAnimation = animation;
  function animate() {
    if (gameState !== animation.state || manMoveAnimation !== animation) return;
    const finished = getManMoveProgress() >= 1;
    if (finished) manMoveAnimation = null;
    if (gameState.currentRoom === "roadRight") renderCanvasRoom();
    if (!finished) requestAnimationFrame(animate);
  }
  animate();
}

let manWithBagFade = null;
const MAN_WITH_BAG_FADE_DURATION = 1000;

function isManStandingAvailable() {
  return getManWithBagAlpha() === 0;
}

function getManWithBagAlpha() {
  if (!gameState.roadFastfoodLeft.flags.manGone) return 1;
  if (manWithBagFade?.state !== gameState) return 0;
  return Math.max(0, 1 - (performance.now() - manWithBagFade.startedAt) / MAN_WITH_BAG_FADE_DURATION);
}

function startManWithBagFade() {
  gameState.roadFastfoodLeft.flags.manGone = true;
  const animation = { state: gameState, startedAt: performance.now() };
  manWithBagFade = animation;
  function animate() {
    if (gameState !== animation.state || manWithBagFade !== animation) return;
    const finished = getManWithBagAlpha() === 0;
    if (finished) manWithBagFade = null;
    if (gameState.currentRoom === "roadFastfoodLeft") renderCanvasRoom();
    if (finished && gameState.currentRoom === "roadToyShopRight") renderCanvasRoom();
    if (!finished) requestAnimationFrame(animate);
  }
  animate();
}

function getInventoryItemImage(itemId) { return IMAGES.items[itemId]; }

function initGame() {
  renderNavigation();
  changeRoom("roadRight");
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
const NAV_EXCLUDED_ROOM_IDS = new Set();

function changeRoom(roomId) {
  if (!rooms[roomId]) return;
  if (END_IDS.has(gameState.currentRoom) && !END_IDS.has(roomId)) return;
  const bakeryFlags = gameState.roadBakery.flags;
  if (gameState.currentRoom === "roadBakery" && roomId !== "roadBakery"
    && bakeryFlags.oldWomanExchanged && !bakeryFlags.bearRejoined) {
    if (!hasItem("bearMatch")) {
      if (gameState.inventory.length >= 14) {
        updateMessage("アイテム欄がいっぱいで、クマ妖精を連れていけない。");
        return;
      }
      addItem("bearMatch");
    }
    bakeryFlags.bearRejoined = true;
  }
  const toyShopFlags = gameState.roadToyShopRight.flags;
  if (gameState.currentRoom === "roadToyShopRight" && roomId !== "roadToyShopRight"
    && toyShopFlags.roboUnlocked && !toyShopFlags.bearRejoined) {
    if (!hasItem("bearMatch")) {
      if (gameState.inventory.length >= 14) {
        updateMessage("アイテム欄がいっぱいで、クマ妖精を連れていけない。");
        return;
      }
      addItem("bearMatch");
    }
    toyShopFlags.bearRejoined = true;
  }
  addNaviItem(roomId);
  gameState.currentRoom = roomId;
  if (END_IDS.has(roomId) && hasItem("crown")) {
    gameState.end.flags.backgroundState = 1;
    gameState.trueEnd.flags.backgroundState = 1;
    removeItem("crown");
  }
  if (roomId === "heaven" && !hasItem("bearMatch")) addItem("bearMatch");
  const roomBgm = {
    end: S48("morino_chiisana_party.mp3"),
    trueEnd: S48("nageyari_midnight.mp3"),
    heaven: S48("god's_realm.mp3"),
  };
  changeBGM(roomBgm[roomId] || DEFAULT_BGM);
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
  drawBakeryLight(ctx, canvas);

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

function getRoomBackgroundImage(roomId, state) {
  const images = IMAGES.rooms[roomId];
  if (!Array.isArray(images)) return images;
  return images[state[roomId]?.flags?.backgroundState ?? 0] || images[0];
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
    currentRoom: "roadRight", openRooms: ["roadRight"], openRoomsTmp: [], inventory: [], money: 0,
    main: {
      flags: {
        manMoved: false,
        receivedPocketTissue: false,
        foundBasket: false,
        foundTicket: false,
        foundRemote: false,
      }
    },
    roadLeft: { flags: { backgroundState: 0, bearLostBasket: false, bearReceivedBasket: false } },
    roadRight: { flags: { backgroundState: 0 } },
    roadBakery: { flags: { backgroundState: 0, bakeryLit: false, noiseUnlocked: false, catGone: false, oldWomanExchanged: false, bearRejoined: false, dustBoxUnlocked: false } },
    roadToyShopLeft: { flags: { backgroundState: 0, manReceivedMatch: false, roboActivated: false } },
    roadToyShopRight: { flags: { backgroundState: 0, toyShopLit: false, roboUnlocked: false, bearRejoined: false } },
    roadFastfoodLeft: { flags: { backgroundState: 0, manGone: false } },
    roadFastfoodRight: { flags: { backgroundState: 0, fastfoodLit: false, phoneIncoming: false, phoneCompleted: false, doorUnlocked: false } },
    heaven: { flags: { backgroundState: 0 } },
    end: { flags: { backgroundState: 0 } },
    trueEnd: { flags: { backgroundState: 0 } },
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

  // 進捗メモをここに追加する。

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


function openVendingMachine1() {
  showObj(null, "自販機", IMAGES.modals.vendingMachine1, "自販機です。");
  const image = document.querySelector("#modalContent .showobj-image");
  image.style.cursor = "pointer";
  image.addEventListener("click", (event) => {
    const bounds = image.getBoundingClientRect();
    const isTop = event.clientY - bounds.top < bounds.height / 2;
    showObj(null, isTop ? "STAR POWER" : "MOON TEA",
      isTop ? IMAGES.modals.canStar : IMAGES.modals.canMoon,
      isTop ? "STAR POWERの缶だ。" : "MOON TEAの缶だ。");
    window._nextModal = openVendingMachine1;
  });
}

function openVendingMachine2() {
  showObj(null, "自販機", IMAGES.modals.bendingMachine2, "自販機です。");
  const image = document.querySelector("#modalContent .showobj-image");
  image.style.cursor = "pointer";
  image.addEventListener("click", (event) => {
    const bounds = image.getBoundingClientRect();
    const isTop = event.clientY - bounds.top < bounds.height / 2;
    showObj(null, isTop ? "ANGEL SODA" : "HOT LEAF",
      isTop ? IMAGES.modals.canAngel : IMAGES.modals.canLeaf,
      isTop ? "ANGEL SODAの缶だ。" : "HOT LEAFの缶だ。");
    window._nextModal = openVendingMachine2;
  });
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;

  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderStatusIcons() {
  const area = document.getElementById("statusIconArea");
  if (area) area.innerHTML = "";
}

// アイテム管理
function addMoney(amount) {
  if (!Number.isSafeInteger(amount) || amount <= 0) return false;
  if (!hasItem("money") && gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return false;
  }
  gameState.money = (gameState.money || 0) + amount;
  if (!hasItem("money")) addItem("money");
  else {
    playSE("se-item");
    updateInventoryDisplay();
  }
  return true;
}

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
  const names = { basket: "かご", bearMatch: "マッチ売りのクマ", money: "お金", remocon: "リモコン", pocketTissue: "ポケットティッシュ", ticket: "おもちゃ引換券", crown: "おもちゃの王冠" };
  return names[itemId] || itemId;
}
function openInventoryItemDetail(itemId, slotIndex, fallbackSrc) {
  if (gameState.fx?.lockInput) return;
  const src = getInventoryItemImage(itemId) || fallbackSrc;
  if (itemId === "money") {
    showModal(getItemName(itemId), `<img src="${src}" style="max-width:100%;max-height:380px;display:block;margin:auto;"><p style="text-align:center;font-size:1.5em;font-weight:bold;">${(gameState.money || 0).toLocaleString("ja-JP")}円</p>`, [{ text: "閉じる", action: "close" }]);
    return;
  }
  showModal(getItemName(itemId), '<img src="' + src + '" style="max-width:100%;max-height:380px;display:block;margin:auto;">', [{ text: "閉じる", action: "close" }]);
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
    updateMessage("互換性のないセーブデータは、このひな型では使用できません。");
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
