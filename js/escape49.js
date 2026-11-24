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

window._nextModal = null;
const canvas = document.getElementById("gameCanvas");
const DEV_MODE = new URLSearchParams(location.search).has("dev");
let uiLang = "jp"; // 'jp' | 'en'
const USE_LOCAL_ASSETS = location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(location.hostname) || location.search.includes("localimg=1");
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";

const I49 = (file) => `${BASE_COMMON}/49/${file}`;
const I48 = (file) => `${BASE_COMMON}/48/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;

const BGM_BASE = USE_LOCAL_ASSETS
  ? "sounds/49"
  : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/49";
const DEFAULT_BGM = `${BGM_BASE}/minitua_garden.mp3`;
const ENDING_BGM = {
  end: `${BGM_BASE}/ochibakara_hitohiranoyukihe.mp3`,
  trueEnd: `${BGM_BASE}/trekking.mp3`,
};

const IMAGES = {
  rooms: {
    gate: [I49("gate.webp")],
    storageFront: [I49("storage_front.webp")],
    main: [I49("main.webp")],
    mainRight: [I49("main_right.webp")],
    mainLeft: [I49("main_left.webp")],
    shop: [I49("shop.webp")],
    indoor: [I49("indoor.webp")],
    cafe: [I49("cafe.webp")],
    well: [I49("well.webp")],
    innerWell: [I49("inner_well.webp")],
    end: [I49("end.webp"), I49("end2.webp")],
    trueEnd: [I49("true_end.webp"), I49("true_end2.webp"), I49("true_end3.webp")],
  },
  items: {
    key: ICM("common/key.webp"),
    roadArrow: I49("road_arrow.webp"),
    bear: I49("bear.webp"),
    bearCrying: I49(USE_LOCAL_ASSETS ? "bear._cryingwebp.webp" : "bear_crying.webp"),
    bearItem: I49("bear_item.webp"),
    trash: I49("trash.webp"),
    arrowLeft: `${BASE_COMMON}/common/arrow_left.png`,
    arrowRight: `${BASE_COMMON}/common/arrow_right.png`,
    roboTicket: I49("robo_ticket.webp"),
    roboBox: I49("robo_box.webp"),
    takeout: I49("takeout.webp"),
    ticket: I49("ticket.webp"),
    senko: I49("senko.webp"),
    senkoFire: I49("senko_fire.webp"),
    roboCamera: I49("robo_camera.webp"),
    roboCamera2: I49("robo_camera2.webp"),
    leaves: I49("leaves.webp"),
    broom: I49("broom.webp"),
    rope: I49("rope.webp"),
    memoStar: I49("memo_star.webp"),
    tarsh: I49("trash.webp"),
    underCounterStorage: I49("under_counter_storage.webp"),
    ropeDisp: I49("rope_disp.webp"),
    frog: I49("frog.webp"),
    frog2: I49("frog2.webp"),
    frog3: I49("frog3.webp"),
    keyFortune: I49("key_fortune.webp"),
    senbei: I49("senbei.webp"),
    guidebook: I49("guidebook.webp"),
    smoke: I49("smoke.webp"),
    tourouLid: I49("tourou_lid.webp"),
    ehon: I49("ehon.webp"),
  },
  modals: {
    ehonMain: I49("ehon_main.webp"),
    ehonMainEn: I49("ehon_main_en.webp"),
    ehon1: I49("ehon1b.webp"),
    ehon1En: I49("ehon1b_en.webp"),
    ehon2: I49("ehon2b.webp"),
    ehon2En: I49("ehon2b_en.webp"),
    ehon3: I49("ehon3b.webp"),
    ehon3En: I49("ehon3b_en.webp"),
    ehon4: I49("ehon4.webp"),
    ehon4En: I49("ehon4_en.webp"),
    guidePage: I49("modal_guide_page.webp"),
    guidePageEn: I49("modal_guide_page_en.webp"),
    bearSenbei: I49("modal_bear_senbei.webp"),
    bearSenbei2: I49("modal_bear_senbei2.webp"),
    bearHappy: I49("modal_bear_happy.webp"),
    bearShiritoi: I49("modal_bear_shiritori.webp"),
    pic: I49("modal_pic.webp"),
    trash: I49("modal_trash.webp"),
    underLeaves: I49("modal_under_leaves.webp"),
    senkoLeaf: I49("modal_senko_leaf.webp"),
    senkoLeaf2: I49("modal_senko_leaf2.webp"),
    badend: I49("badend.webp"),
    roboTicketReceive: I49("modal_robo_ticket_receive.webp"),
    ticketGet: I49("modal_ticket_get.webp"),
    butsu1: I49("modal_butsu_1.webp"),
    butsu2: I49("modal_butsu_2.webp"),
    butsu3: I49("modal_butsu_3.webp"),
    butsu4: I49("modal_butsu_4.webp"),
    butsu5: I49("modal_butsu_5.webp"),
    butsu6: I49("modal_butsu_6.webp"),
    butsu1AfterKurayami: I49("modal_butsu_1_after_kurayami.webp"),
    butsu2AfterKurayami: I49("modal_butsu_2_after_kurayami.webp"),
    butsu3AfterKurayami: I49("modal_butsu_3_after_kurayami.webp"),
    butsu4AfterKurayami: I49("modal_butsu_4_after_kurayami.webp"),
    butsu5AfterKurayami: I49("modal_butsu_5_after_kurayami.webp"),
    butsu6AfterKurayami: I49("modal_butsu_6_after_kurayami.webp"),
    senkoFire: I49("modal_fire_senko.webp"),
    infinityAmulet: I49("modal_infinity_amulet.webp"),
    infinityCard: I49("modal_infinity_card.webp"),
    bookBird: I49("modal_book_bird.webp"),
    bookEye: I49("modal_book_eye.webp"),
    bookApple: I49("modal_book_apple.webp"),
    bookDaruma: I49("modal_book_daruma.webp"),
    iconFrog: I49("icon_frog.webp"),
    iconApple: I49("icon_apple.webp"),
    iconBird: I49("icon_bird.webp"),
    iconDaruma: I49("icon_daruma.webp"),
    iconEye: I49("icon_eye.webp"),
    senkoBaseCircle: I49("modal_senko_base_circle.webp"),
    senkoBaseCirclePutSenkoBefore: I49("modal_senko_base_circle_put_senko_before.webp"),
    senkoBaseCirclePutSenko: I49("modal_senko_base_circle_put_senko.webp"),
    senkoBaseCirclePutSenko2: I49("modal_senko_base_circle_put_senko2.webp"),
    senkoBaseTri: I49("modal_senko_base_tri.webp"),
    senkoCloseUp: I49("modal_senko_closeup.webp"),
    senkoBaseSquare: I49("modal_senko_base_square.webp"),
    "10yen": I49("modal_10yen.webp"),
    "1yen": I49("modal_1yen.webp"),
    blockGate: I49("modal_block_gate.webp"),
    noren: I49("modal_noren.webp"),
    posterDaruma: I49("modal_poster_daruma2.webp"),
    omamori: I49("modal_omamori.webp"),
    tatehuda: I49("modal_tatehuda.webp"),
    openStorage: I49("modal_open_storage.webp"),
    unlockRightStorage: I49("modal_unlock_right_storage.webp"),
    keyGetFailed: I49("modal_key_get_failed.webp"),
    bearFlying: I49("modal_bear_flying.webp"),
    bearKey: I49("modal_bear_key.webp"),
    sekitou1: I49("modal_sekitou_1.webp"),
    sekitou2: I49("modal_sekitou_2.webp"),
    sekitou3: I49("modal_sekitou_3.webp"),
    tape: I49("modal_tape.webp"),
    ground: I49("modal_ground.webp"),
    tourou: I49("modal_tourou.webp"),
    dustBox: I49("modal_dustbox.webp"),
    saisenbako: I49("modal_saisenbako.webp"),
    roboAngry: I49("modal_robo_angry.webp"),

    // escape48から引き継いだエンディングイベント用素材。
    bearPassMoney: I48("modal_bear_pass_money.webp"),
    bearAdmin: I48("modals_bear_admin.webp"),
    chicken: I48("modal_chicken.webp"),
  },
};

const SAVE_KEY = "escapeGameState49";
const SAVE_VERSION = 1;
const SAVE_KEYS = [SAVE_KEY + "_1", SAVE_KEY + "_2"];

const END_IDS = new Set(["end", "trueEnd"]);
const DARK_CORRIDOR_IDS = new Set(["kurayami1", "kurayami2", "kurayami3", "kurayami4", "kurayami5"]);

const talkToMovedFrog = cycleClickMessages("innerWell.frogAfterMove", [
  "「ご利益を受けたのだなケロ」",
  "「もしかしたら、ワシの役目もそろそろ終わるのかもしれぬケロ」",
  "「…」",
]);
const talkToFrogAfterFortuneKey = cycleClickMessages("innerWell.frogAfterFortuneKey", [
  "「ケロ」",
  "「ケロケロ…」",
  "ただのカエルのようだ。",
]);

// clickableAreas の座標はキャンバスに対するパーセント。
const rooms = {
  main: {
    name: "本殿前",
    description: "",
    clickableAreas: [
      {
        x: 33.1, y: 47.9, width: 33.6, height: 12.6,
        onClick: clickWrap(function () {
          changeRoom("indoor");
        }),
        description: 'お寺入り口',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 44.6, y: 56.6, width: 10.1, height: 15.8,
        onClick: clickWrap(openLargeIncenseBurner),
        description: '大きな香炉',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 64.8, y: 67.2, width: 11.0, height: 10.6,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "broom" && hasItem("broom")) {
            updateMessage("「ボクは自分で空を飛べるから、いらないよ」");
            return;
          }
          if (gameState.selectedItem === "memoStar" && hasItem("memoStar")) {
            updateMessage("「星が重なってるんだねえ」");
            return;
          }
          showObj(null, "クマ妖精「今日は七五三のお参りなんだ！」", IMAGES.items.bear, "クマ妖精は、写真を撮られている。");
        }),
        description: 'クマ妖精',
        zIndex: 5,
        usable: () => !getMainFlags().completeKurayami,
        item: { img: 'bear', visible: () => !getMainFlags().completeKurayami }
      },
      {
        x: 25.6, y: 78.9, width: 14.6, height: 15.8,
        onClick: clickWrap(function () {
          showObj(null, "千歳飴のゴミ", IMAGES.modals.trash, "千歳飴のゴミが落ちている。");
        }),
        description: '千歳飴のゴミ',
        zIndex: 5,
        usable: () => Boolean(getMainFlags().completeKurayami),
        item: { img: 'trash', visible: () => Boolean(getMainFlags().completeKurayami) }
      },
      {
        x: 66.6, y: 68.9, width: 17.3, height: 16.4,
        onClick: clickWrap(openCameraRobot),
        description: 'カメラ係りのロボ',
        zIndex: 5,
        usable: () => true,
        item: { img: getCameraRobotImageKey, visible: () => true }
      },
      {
        x: 0.6, y: 57.8, width: 10.4, height: 20.4,
        onClick: clickWrap(function () {
          changeRoom("shop");
        }),
        description: '左の建物',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      roomArrow(0, "arrowLeft", "mainLeft", "左側へ"),
      roomArrow(44, "arrowRight", "gate", "門へ戻る", 90),
      roomArrow(88, "arrowRight", "mainRight", "右側へ"),

    ],
  },
  mainRight: {
    name: "6体の仏像",
    description: "",
    clickableAreas: [
      {
        x: 23.6, y: 43.2, width: 8.2, height: 18.8,
        onClick: clickWrap(() => showBuddhaStatue(1, "一番奥の仏像")),
        description: '仏像1',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 31.9, y: 41.8, width: 9.5, height: 19.8,
        onClick: clickWrap(() => showBuddhaStatue(2, "奥から2番目の仏像")),
        description: '仏像2',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 41.7, y: 40.8, width: 10.4, height: 21.4,
        onClick: clickWrap(() => showBuddhaStatue(3, "奥から3番目の仏像")),
        description: '仏像3',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 52.1, y: 39.8, width: 11.7, height: 23.2,
        onClick: clickWrap(() => showBuddhaStatue(4, "奥から4番目の仏像")),
        description: '仏像4',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 64.3, y: 39.2, width: 12.8, height: 25.1,
        onClick: clickWrap(() => showBuddhaStatue(5, "奥から5番目の仏像")),
        description: '仏像5',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 77.5, y: 37.9, width: 15.5, height: 28.6,
        onClick: clickWrap(() => showBuddhaStatue(6, "奥から6番目の仏像")),
        description: '仏像6',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 22.8, y: 63.0, width: 10.6, height: 13.6,
        onClick: clickWrap(showSquareIncenseStand),
        description: '線香台',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 55.6, y: 64.1, width: 19.9, height: 21.7,
        onClick: clickWrap(useIncenseLightingStand),
        description: '着火台',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 4.9, y: 44.7, width: 15.1, height: 21.9,
        onClick: clickWrap(function () {
          changeRoom("well");
        }),
        description: '井戸',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      roomArrow(88, "arrowRight", "main", "正面へ戻る", 90)],
  },
  well: {
    name: "井戸", description: "", clickableAreas: [
      {
        x: 0, y: 0, width: 100, height: 100,
        description: '設置されたロープ表示用',
        zIndex: 5,
        usable: () => false,
        item: { img: 'ropeDisp', visible: () => gameState.well.flags.ropeInstalled }
      },
      {
        x: 34.4, y: 12.1, width: 45.1, height: 38.7,
        onClick: clickWrap(function () {
          const flags = gameState.well.flags;
          if (flags.ropeInstalled) {
            travelWithSteps("innerWell", { soundId: "se-falling", transitionDelay: 600 });
          } else if (gameState.selectedItem === "rope" && hasItem("rope")) {
            flags.ropeInstalled = true;
            removeItem("rope");
            markProgress("install_well_rope");
            renderCanvasRoom();
            updateMessage("井戸のフックにロープを取り付けた。");
          } else {
            updateMessage("井戸だ。フックが付いている");
          }
        }),
        description: '井戸',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0.6, y: 41.7, width: 35.4, height: 44.6,
        onClick: clickWrap(function () {
          acquireItemOnce("foundBroom", "broom", "ほうき", IMAGES.items.broom, "ほうきを手に入れた！");
        }),
        description: 'ほうき',
        zIndex: 5,
        usable: () => !getMainFlags().foundBroom,
        item: { img: 'broom', visible: () => !getMainFlags().foundBroom },
      },
      roomArrow(88, "arrowRight", "mainRight", "戻る", 90),

    ]
  },
  innerWell: {
    name: "井戸の中",
    description: "",
    clickableAreas: [
      {
        x: 1.2, y: 87.1, width: 15.7, height: 11.1,
        onClick: clickWrap(() => showPictureBook()),
        description: '絵本',
        zIndex: 5,
        usable: () => true,
        item: { img: 'ehon', visible: () => true }
      },
      {
        x: 1.3, y: 24.6, width: 11.8, height: 22.1,
        onClick: clickWrap(function () {
          showObj(null, "壁のタペストリー", IMAGES.modals.tape, "タペストリーがかかっている");
        }),
        description: '左側タペストリー',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 75.9, y: 54.0, width: 11.9, height: 14.1,
        onClick: clickWrap(openInnerWellChest),
        description: '宝箱',
        zIndex: 5,
        usable: () => getMainFlags().completeKurayami,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 86.8, y: 28.9, width: 12.8, height: 37.6,
        onClick: clickWrap(function () {
          showObj(null, "御朱印帳がある", IMAGES.modals.bookDaruma, "御朱印帳がある");
        }),
        description: '本棚',
        zIndex: 5,
        usable: () => getMainFlags().completeKurayami,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 64.8, y: 53.7, width: 23.7, height: 25.1,
        onClick: clickWrap(function () {
          updateMessage("「ご利益を持たぬものに話すことはない。立ち去れケロ！」");
        }),
        description: 'カエル初期位置',
        zIndex: 5,
        usable: () => !getMainFlags().completeKurayami,
        item: { img: 'frog', visible: () => !getMainFlags().completeKurayami }
      },
      {
        x: 20.9, y: 56.6, width: 27.7, height: 27.1,
        onClick: () => {
          if (getMainFlags().fortuneKeyUsed) talkToFrogAfterFortuneKey();
          else talkToMovedFrog();
        },
        description: 'カエル移動後',
        zIndex: 5,
        usable: () => getMainFlags().completeKurayami,
        item: { img: () => getMainFlags().fortuneKeyUsed ? 'frog3' : 'frog2', visible: () => getMainFlags().completeKurayami }
      },
      roomArrow(44, "arrowRight", "well", "井戸の外へ戻る", -90, { y: 0 })
    ],
  },
  mainLeft: {
    name: "大きな仏像",
    description: "",
    clickableAreas: [
      {
        x: 36.8, y: 17.5, width: 30.1, height: 38.5,
        onClick: clickWrap(function () {
          updateMessage("穏やかな顔の仏像だ");
        }),
        description: '仏像',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 36.1, y: 86.0, width: 29.3, height: 10.5,
        onClick: clickWrap(showIncenseOffering),
        description: 'お供え物部分',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 36.3, y: 89.1, width: 6.4, height: 5.3,
        onClick: clickWrap(function () {

        }),
        description: '線香の煙表示用',
        zIndex: 5,
        usable: () => false,
        item: { img: 'smoke', visible: () => gameState.mainLeft.flags.incenseOffered }
      },
      {
        x: 17.8, y: 83.0, width: 11.5, height: 7.7,
        onClick: clickWrap(examineLeaves),
        description: '積もった落ち葉',
        zIndex: 5,
        alpha: () => 1 - (gameState.fx?.leafSweep?.progress ?? 0),
        item: { img: 'leaves', visible: () => !gameState.mainLeft.flags.leavesSwept }
      },
      {
        x: 14.0, y: 62.9, width: 11.7, height: 11.0,
        onClick: clickWrap(openStorageDoor),
        description: '左奥の扉',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      roomArrow(88, "arrowRight", "main", "正面へ戻る", 90)],
  },
  shop: {
    name: "売店", description: "", clickableAreas: [
      {
        x: 53.5, y: 11.5, width: 7.4, height: 7.6,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "bearItem" && hasItem("bearItem")) {
            const { bearFlying, bearKey } = IMAGES.modals;
            acquireItemOnce("foundKey", "key", "カギを手に入れた！", [bearFlying, bearKey], "クマ妖精が屋根のカギを取ってくれた！");
            return;
          }
          if (gameState.selectedItem === "broom" && hasItem("broom")) {
            showObj(null, "届かない。", IMAGES.modals.keyGetFailed, "届かない。");
            return;
          }
          updateMessage("何かあるが、手が届かない");
        }),
        description: '屋根にあるカギ',
        zIndex: 5,
        usable: () => !getMainFlags().foundKey,
        item: { img: 'key', visible: () => !getMainFlags().foundKey }
      },
      {
        x: 22.9, y: 61.6, width: 11.3, height: 10.9,
        onClick: clickWrap(function () {
          showObj(null, "お守りの棚", IMAGES.modals.omamori, "六種類のお守りが並んでいる。");
        }),
        description: '六種類のお守り',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 35.4, y: 65.8, width: 10.4, height: 6.5,
        onClick: clickWrap(() => showAmuletGuide()),
        description: '六種類のお守りの説明',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 47.2, y: 64.3, width: 17.0, height: 9.1,
        onClick: clickWrap(() => showInfinityAmulet()),
        description: '無限のお守り',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 47.5, y: 57.0, width: 15.8, height: 7.6,
        onClick: clickWrap(() => showGoshuinBook()),
        description: '御朱印帳売り場',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 66.7, y: 37.7, width: 13.2, height: 9.2,
        onClick: clickWrap(function () {
          showObj(null, "のれん", IMAGES.modals.noren, "のれんがかかっている。");
        }),
        description: 'のれん',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 24.1, y: 76.7, width: 15.4, height: 11.9,
        onClick: clickWrap(openLeftCounterStorage),
        description: 'カウンター左の収納',
        zIndex: 5,
        usable: () => true,
        item: { img: 'underCounterStorage', visible: () => getMainFlags().unlockLeftStorage }
      },
      {
        x: 26.4, y: 77.8, width: 9.2, height: 9.0,
        onClick: clickWrap(function () {
          acquireItemOnce("foundSenbei", "senbei", "満腹煎餅を手に入れた", IMAGES.items.senbei, "満腹煎餅を手に入れた");
        }),
        description: 'せんべい',
        zIndex: 6,
        usable: () => getMainFlags().unlockLeftStorage && !getMainFlags().foundSenbei,
        item: { img: 'senbei', visible: () => getMainFlags().unlockLeftStorage && !getMainFlags().foundSenbei }
      },
      {
        x: 60.3, y: 76.9, width: 15.3, height: 11.8,
        onClick: clickWrap(openRightCounterStorage),
        description: 'カウンター右の収納',
        zIndex: 5,
        usable: () => true,
        item: { img: 'underCounterStorage', visible: () => getMainFlags().unlockRightStorage }
      },
      {
        x: 63.9, y: 78.3, width: 9.1, height: 9.2,
        description: '闇の回廊攻略本',
        zIndex: 6,
        usable: () => false,
        item: { img: 'guidebook', visible: () => getMainFlags().unlockRightStorage && !getMainFlags().foundGuidebook }
      },
      roomArrow(88, "arrowRight", "main", "正面へ戻る", 90),

    ]
  },
  indoor: {
    name: "お寺内部", description: "", clickableAreas: [
      {
        x: 34.5, y: 59.4, width: 12.6, height: 13.8,
        onClick: clickWrap(receiveCorridorTicket),
        description: 'チケット係のロボ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'roboTicket', visible: () => true }
      },
      {
        x: 66.9, y: 51.9, width: 8.6, height: 9.4,
        onClick: clickWrap(function () {
          showObj(null, "ダルマのポスター", IMAGES.modals.posterDaruma, "ポスターが貼られている。");
        }),
        description: '達磨ポスター',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 15.3, y: 60.6, width: 13.9, height: 13.4,
        onClick: clickWrap(function () {
          showObj(null, "賽銭箱", IMAGES.modals.saisenbako, "賽銭箱だ");
        }),
        description: '賽銭箱',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 70.5, y: 62.2, width: 4.9, height: 9.3,
        onClick: clickWrap(examineDustBox),
        description: 'ゴミ箱',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 76.7, y: 50.8, width: 11.7, height: 21.3,
        onClick: clickWrap(openTicketMachine),
        description: 'チケットマシン',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 44.6, y: 51.2, width: 10.4, height: 18.4,
        onClick: clickWrap(() => changeRoom("kurayami1")),
        description: '闇の回廊入口',
        zIndex: 6,
        usable: () => Boolean(gameState.indoor.flags.corridorUnlocked),
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      roomArrow(88, "arrowRight", "cafe", "カフェへ進む", 0, {
        y: 44,
        usable: () => Boolean(gameState.cafe.flags.visited),
      }),
      roomArrow(88, "arrowRight", "main", "正面へ戻る", 90),

    ]
  },
  gate: {
    name: "門",
    description: "",
    clickableAreas: [
      {
        x: 29.4, y: 72.5, width: 24.6, height: 26.2,
        onClick: clickWrap(function () {
          const dialogue = getMainFlags().completeKurayami
            ? "ご利益を検出しました。お通りください"
            : "ご利益が検出できません。対象の通行を妨害します";
          updateMessage(`チェック係りのロボ「${dialogue}」`);
        }),
        description: '門の前のチェック係りロボ',
        zIndex: 5,
        usable: () => true,
        item: { img: 'roboTicket', visible: () => true }
      },
      {
        x: 32.3, y: 58.4, width: 32.9, height: 32.2,
        onClick: clickWrap(function () {
          const { completeKurayami, fortuneKeyUsed } = getMainFlags();
          if (completeKurayami || fortuneKeyUsed) {
            const destination = fortuneKeyUsed ? "trueEnd" : "end";
            const leaveGate = () => {
              if (hasItem("bearItem")) gameState[destination].flags.backgroundState = 1;
              travelWithSteps(destination, { soundId: "se-ashioto" });
            };
            showModal("外に出ますか？", "", [
              {
                text: "はい",
                action: () => {
                  if (hasItem("keyFortune")) {
                    removeItem("keyFortune");
                    showModal("幸運のカギは煙のように消え失せた", "", [
                      { text: "閉じる", action: "close" },
                    ], leaveGate);
                    return;
                  }
                  closeModal();
                  leaveGate();
                },
              },
              { text: "いいえ", action: "close" },
            ]);
            return;
          }

          playSE("se-punch");
          showObj(null, "ロボに通行を妨害された。", IMAGES.modals.blockGate, "「通行は許可できませぬ！」");
        }),
        description: '門',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      roomArrow(88, "arrowRight", "main", "正面へ進む", 90)
    ],
  },
  storageFront: {
    name: "物置前",
    description: "",
    clickableAreas: [
      {
        x: 0.7, y: 60.2, width: 13.0, height: 21.9,
        onClick: clickWrap(showLantern),
        description: '灯篭',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 3.7, y: 68.2, width: 2.8, height: 2.9,
        description: '灯篭のふた',
        zIndex: 5,
        usable: () => false,
        item: { img: 'tourouLid', visible: () => !isLanternUnlocked() }
      },
      {
        x: 59.3, y: 87.3, width: 14.2, height: 7.7,
        onClick: clickWrap(function () {
          showObj(null, "地面に何か書かれている", IMAGES.modals.ground, "地面に何か書かれている");
        }),
        description: '地面の落書き',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 59.9, y: 62.1, width: 15.7, height: 15.0,
        onClick: clickWrap(function () {
          showObj(null, "立札", IMAGES.modals.tatehuda, "立札が立っている。");
        }),
        description: '立札',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 81.7, y: 61.8, width: 14.4, height: 17.2,
        onClick: clickWrap(openShedDoor),
        description: '物置の扉',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 26.3, y: 36.1, width: 13.9, height: 10.2,
        onClick: clickWrap(function () {
          showObj(null, "石塔の一番上", IMAGES.modals.sekitou1, "石塔の一番上の段だ。");
        }),
        description: '石塔一番上',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 24.9, y: 47.0, width: 17.2, height: 10.4,
        onClick: clickWrap(function () {
          showObj(null, "石塔の二段目", IMAGES.modals.sekitou2, "石塔の二段目だ。");
        }),
        description: '石塔の2段目',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 23.8, y: 58.1, width: 19.4, height: 14.0,
        onClick: clickWrap(function () {
          showObj(null, "石塔の三段目", IMAGES.modals.sekitou3, "石塔の三段目だ。");
        }),
        description: '石塔の三段目',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 18.3, y: 72.0, width: 21.7, height: 20.2,
        onClick: clickWrap(interactWithHungryBear),
        description: 'おなかが空いたクマ妖精',
        zIndex: 5,
        usable: isHungryBearPresent,
        item: { img: 'bearCrying', visible: isHungryBearPresent }
      },
      roomArrow(88, "arrowRight", "mainLeft", "仏像前へ戻る", 90)
    ],
  },
  kurayami1: {
    name: "闇の回廊1",
    description: "何も見えない……。",
    background: "#000",
    clickableAreas: [
      {
        x: 0, y: 0, width: 20.9, height: 100,
        onClick: clickWrap(function () {
          updateMessage("冷たい壁が手に触れる。");
        }),
        description: '左の壁',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 79, y: 0, width: 21, height: 100,
        onClick: clickWrap(function () {
          updateMessage("壁はざらざらとした手触りだ。");
        }),
        description: '右の壁',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 44, y: 32, width: 12, height: 12,
        onClick: clickWrap(() => changeRoom("kurayami2")),
        description: "奥へ進む",
        clickSound: "se-ashioto",
        item: { img: "roadArrow", visible: () => true },
      }],
  },
  kurayami2: {
    name: "闇の回廊2",
    description: "自分の足音がやけに大きく聞こえる。",
    background: "#000",
    clickableAreas: [
      {
        x: 0, y: 0, width: 20.9, height: 100,
        onClick: clickWrap(function () {
          updateMessage("冷たい壁が手に触れる。");
        }),
        description: '左の壁',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 79, y: 0, width: 21, height: 100,
        onClick: clickWrap(function () {
          updateMessage("壁はざらざらとした手触りだ。");
        }),
        description: '右の壁',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 44, y: 32, width: 12, height: 12,
        onClick: clickWrap(() => changeRoom("kurayami3")),
        description: "奥へ進む",
        clickSound: "se-ashioto",
        item: { img: "roadArrow", visible: () => true },
      }],
  },
  kurayami3: {
    name: "闇の回廊3",
    description: "暗闇に押しつぶされそうだ……。",
    background: "#000",
    clickableAreas: [
      {
        x: 0, y: 0, width: 20.9, height: 100,
        onClick: clickWrap(function () {
          updateMessage("冷たい壁が手に触れる。");
        }),
        description: '左の壁',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 79, y: 0, width: 21, height: 100,
        onClick: clickWrap(function () {
          updateMessage("壁はなめらかな手触りだ。");
        }),
        description: '右の壁',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 44, y: 32, width: 12, height: 12,
        onClick: clickWrap(() => changeRoom("kurayami4")),
        description: "奥へ進む",
        clickSound: "se-ashioto",
        item: { img: "roadArrow", visible: () => true },
      }],
  },
  kurayami4: {
    name: "闇の回廊4",
    description: "奥から、かすかに風が吹いてくる。",
    background: "#000",
    clickableAreas: [
      {
        x: 0, y: 0, width: 20.9, height: 100,
        onClick: clickWrap(function () {
          updateMessage("冷たい壁が手に触れる。");
        }),
        description: '左の壁',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 79, y: 0, width: 21, height: 100,
        onClick: clickWrap(function () {
          updateMessage("壁は木でできているような手触りだ。");
        }),
        description: '右の壁',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 79.6, y: 79.1, width: 18.8, height: 13.1,
        onClick: clickWrap(useFortuneKey),
        description: '幸運のカギ穴',
        zIndex: 6,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 44, y: 32, width: 12, height: 12,
        onClick: clickWrap(() => changeRoom("kurayami5")),
        description: "奥へ進む",
        clickSound: "se-ashioto",
        item: { img: "roadArrow", visible: () => true },
      }],
  },
  kurayami5: {
    name: "闇の回廊5",
    description: "向こうに小さな明かりが見える。",
    background: "corridorExit",
    clickableAreas: [
      {
        x: 0, y: 0, width: 20.9, height: 100,
        onClick: clickWrap(function () {
          updateMessage("壁が手に触れる。");
        }),
        description: '左の壁',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 79, y: 0, width: 21, height: 100,
        onClick: clickWrap(function () {
          updateMessage("壁はつるつるとした手触りだ。");
        }),
        description: '右の壁',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 44, y: 32, width: 12, height: 12,
        onClick: clickWrap(completeDarkCorridor),
        description: "カフェへ進む",
        clickSound: "se-ashioto",
        item: { img: "roadArrow", visible: () => true },
      }],
  },
  cafe: {
    name: "休憩所",
    description: "",
    clickableAreas: [
      {
        x: 41.2, y: 64.8, width: 28.1, height: 28.1,
        onClick: clickWrap(function () {
          const flags = getMainFlags();
          if (flags.foundBox) {
            updateMessage("仏のご加護がありますように");
            return;
          }
          if (!flags.talkedToCafeRobot) markProgress("talk_to_cafe_robot");
          flags.talkedToCafeRobot = true;
          const message = "おめでとうございます。こちらをどうぞ";
          acquireItemOnce("foundBox", "takeout", message, IMAGES.items.roboBox, message);
        }),
        description: '店員ロボ',
        zIndex: 5,
        usable: () => getMainFlags().fortuneKeyUsed,
        item: { img: () => getMainFlags().foundBox ? 'roboTicket' : 'roboBox', visible: () => getMainFlags().fortuneKeyUsed }
      },
      roomArrow(88, "arrowRight", "indoor", "屋内へ戻る", 90),
    ],
  },
  end: {
    name: "ノーマルエンド",
    description: "ちょっと不思議なお寺から脱出しました！おめでとうございます！",
    clickableAreas: [
      {
        x: 52.0, y: 59.8, width: 33.1, height: 28.8,
        onClick: clickWrap(function () {
          updateMessage("へんなお寺だったな…");
        }),
        description: '掌(state0)',
        zIndex: 5,
        usable: () => gameState.end.flags.backgroundState == 0,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 36.0, y: 33.2, width: 29.6, height: 55.2,
        onClick: clickWrap(function () {
          updateMessage("「なんか、お手手が光ってるね」");
        }),
        description: '掌を見るクマ妖精(state1)',
        zIndex: 5,
        usable: () => gameState.end.flags.backgroundState == 1,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(() => showEndingReport("end")),
        description: "ノーマルエンド",
      }],
  },
  trueEnd: {
    name: "トゥルーエンド",
    description: "幸運のカギを開けて脱出しました！おめでとうございます！",
    clickableAreas: [
      {
        x: 54.1, y: 28.9, width: 29.3, height: 32.8,
        onClick: clickWrap(function () {
          updateMessage("クマ妖精は、ドーナツを見つめている。");
        }),
        description: 'ドーナツを見るクマ妖精(state1)',
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 53.4, y: 38.8, width: 27.2, height: 28.0,
        onClick: clickWrap(function () {
          updateMessage("「美味しいね」");

        }),
        description: 'ドーナツを食べるクマ妖精(state2)',
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 2,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 15.9, y: 59.2, width: 17.2, height: 16.7,
        onClick: clickWrap(function () {
          updateMessage("「ケロケロ」");
        }),
        description: 'カエル(state2)',
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 2,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(() => showEndingReport("trueEnd")),
        description: "トゥルーエンド",
      }],
  },
};

function roomArrow(x, img, destination, description, rotateDeg = 0, { y = 88, usable = () => true } = {}) {
  return {
    x, y, width: 12, height: 12,
    onClick: clickWrap(() => changeRoom(destination)),
    description,
    zIndex: 10,
    usable,
    item: { img, visible: usable, rotateDeg },
  };
}

let gameState = getDefaultGameState();

function getDefaultGameState() {
  return {
    currentRoom: "gate",
    openRooms: ["gate"],
    inventory: [],
    clickMessageIndexes: {},
    money: 0,
    ...Object.fromEntries(Object.keys(rooms).map(roomId => [roomId, { flags: { backgroundState: 0 } }])),
    main: {
      flags: {
        foundBroom: false,
        unlockLeftStorage: false,
        unlockRightStorage: false,
        innerWellChestUnlocked: false,
        foundKeyFortune: false,
        fortuneKeyUsed: false,
        completeKurayami: false,
        leavesSwept: false,
        foungSenbei: false,
        foundGuidebook: false,
        foundBox: false,
        talkedToCafeRobot: false,
      }
    },
    selectedItem: null,
    selectedItemSlot: null,
    usingItem: null,
    inventoryPage: 0,
  };
}

function showEndingReport(endingId = "end") {
  const elapsed = Math.max(0, Math.round((Date.now() - (ANA.start || Date.now())) / 1000));
  const playTime = `${Math.floor(elapsed / 60)}分${String(elapsed % 60).padStart(2, "0")}秒`;
  showModal("エンディング", `
    <div style="max-width:520px;text-align:center;">
      <h2 style="margin-top:0;">${rooms[endingId].name}</h2>
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
  const feedbackUrl = "https://docs.google.com/forms/d/e/1FAIpQLSci7uR6ocGVAekIT_onbaUaExXR-8G7KaH7hVO-EXfENeOS8g/viewform";
  const endingLabel = rooms[endingId].name;
  const params = new URLSearchParams({ "entry.666725843": endingLabel });
  window.open(`${feedbackUrl}?${params.toString()}`, "_blank", "noopener");
}


let endingTravelActive = false;
function travelWithSteps(destRoom, { soundId = "se-fanta", transitionDelay = 480 } = {}) {
  if (endingTravelActive || !Object.hasOwn(rooms, destRoom)) return;
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

function getInventoryItemImage(itemId) { return IMAGES.items[itemId]; }

function initGame() {
  renderNavigation();
  changeRoom(gameState.currentRoom);
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
      playSE(area.clickSound ?? "se-click");
    } else if (area.action) {
      handleAreaClick(area.action, e); // 互換のために残してもOK
    }
  }
});

function blockCafeDeparture() {
  if (gameState.currentRoom !== "cafe") return false;

  const { fortuneKeyUsed, talkedToCafeRobot, foundBox } = getMainFlags();
  if (!fortuneKeyUsed || talkedToCafeRobot || foundBox) return false;

  updateMessage("誰か立っている。話してみよう");
  return true;
}

function changeRoom(roomId) {
  if (!Object.hasOwn(rooms, roomId)) return;
  const previousRoom = gameState.currentRoom;
  const isEnding = END_IDS.has(roomId);
  if (END_IDS.has(previousRoom) && !isEnding) return;
  if (roomId !== previousRoom && blockCafeDeparture()) return;
  addNaviItem(roomId);
  gameState.currentRoom = roomId;
  if (roomId === "cafe") gameState.cafe.flags.visited = true;
  if (isEnding) {
    if (hasItem("crown")) {
      gameState.end.flags.backgroundState = 1;
      gameState.trueEnd.flags.backgroundState = Math.max(1, gameState.trueEnd.flags.backgroundState);
    }
    gameState.inventory = [];
    gameState.money = 0;
    gameState.inventoryPage = 0;
    clearUsingItem();
  }
  if (isEnding && roomId !== previousRoom) {
    ANA.once("ending", roomId, {
      ending: roomId,
      time_sec: Math.max(0, Math.round((Date.now() - (ANA.start || Date.now())) / 1000)),
      background_state: gameState[roomId].flags.backgroundState,
    });
  }
  syncRoomBGM();
  hoveredAreaIndex = null;
  renderCanvasRoom();
  const room = rooms[roomId];
  updateMessage(room.description || room.name + "です。");
  renderNavigation();

  if (roomId === "kurayami1" && roomId !== previousRoom && hasItem("senkoFire")) {
    removeItem("senkoFire");
    showModal("線香はロボに回収された", "", [{ text: "閉じる", action: "close" }]);
  }
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
  if (room.background) {
    ctx.save();
    if (room.background === "corridorExit") {
      const glow = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, 0, canvas.height * 0.46);
      glow.addColorStop(0, "#33302a");
      glow.addColorStop(1, "#000");
      ctx.fillStyle = glow;
    } else {
      ctx.fillStyle = room.background;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  } else if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.save();
    ctx.fillStyle = "#24140d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f4f1e8";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(room.name, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  }

  drawRoomItems(ctx, canvas, roomId);
  if (roomId === "mainLeft" && gameState.fx?.leafSweep) {
    drawSweepingBroom(ctx, canvas, gameState.fx.leafSweep);
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

function drawRoomItems(ctx, canvas, roomId, behindBackground = false) {
  const room = rooms[roomId];

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

        // 小さなアイテムを見つけやすくするための光。
        if (area.item.glow) {
          ctx.shadowColor = "rgba(80, 180, 255, 1)";
          ctx.shadowBlur = Math.max(16, canvas.width * 0.035);
          // 光を重ねて、明るい背景でも青い縁が見えるようにする。
          ctx.drawImage(img, px, py, w, h);
          ctx.drawImage(img, px, py, w, h);
        }

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

        ctx.restore();
      }
    }
  });
}

function examineDustBox() {
  if (gameState.selectedItem !== "senkoFire" || !hasItem("senkoFire")) {
    updateMessage("ゴミ箱がある");
    return;
  }

  removeItem("senkoFire");
  showImageModal("ゴミ箱に火のついた線香を入れた。", IMAGES.modals.dustBox, null, [
    { text: "次へ", action: showAngryRobot },
  ]);
}

async function showAngryRobot() {
  showImageModal("ロボが怒っている！", IMAGES.modals.roboAngry, null, []);
  const robotImage = document.querySelector("#modalContent .showobj-image");
  await robotImage.decode().catch(() => { });
  playSE("se-punch");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offsets = reducedMotion ? [0, 0] : [0, -8, 8, -6, 6, -3, 3, 0];
  const shake = document.documentElement.animate(
    offsets.map(x => ({ transform: `translateX(${x}px)` })),
    { duration: 800 },
  );
  await shake.finished;
  closeModal();
  changeRoom("main");
  updateMessage("怒ったロボにお寺から追い出された。");
}

function examineLeaves() {
  if (gameState.mainLeft.flags.leavesSwept) {
    showObj(null, "落ち葉の下", IMAGES.modals.underLeaves, "落ち葉を掃いた跡だ。");
    return;
  }
  if (gameState.selectedItem === "senkoFire" && hasItem("senkoFire")) {
    const { senkoLeaf, senkoLeaf2 } = IMAGES.modals;
    showModal("落ち葉に線香を近づけた。", `
      <div class="modal-anim">
        <img src="${senkoLeaf}" alt="落ち葉に線香を近づける">
        <img src="${senkoLeaf2}" alt="落ち葉に火が移る">
      </div>
    `, [{ text: "次へ", action: showLeavesBadEnd }], null, { contentClass: "showobj-modal" });
    return;
  }
  sweepLeaves();
}

function showLeavesBadEnd() {
  pauseBGM();
  playSE("se-barner");
  ANA.once("ending", "badEnd", {
    ending: "badEnd",
    time_sec: Math.max(0, Math.round((Date.now() - (ANA.start || Date.now())) / 1000)),
  });
  const title = "【BAD END】仏像の怒り";
  showModal(title, `
    <img class="showobj-image" src="${IMAGES.modals.badend}" alt="落ち葉の火事">
    <p style="text-align:center;font-weight:800;line-height:1.8;margin-top:14px;">
      あなたは、放火に怒った仏像の消火活動に巻き込まれてしまった。
    </p>
  `, [{ text: "最初から", action: "restart" }], null, { contentClass: "showobj-modal" });
  updateMessage(title);
}

function sweepLeaves() {
  if (gameState.selectedItem !== "broom" || !hasItem("broom")) {
    updateMessage("落ち葉が積もっている。");
    return;
  }

  const state = gameState;
  const area = rooms.mainLeft.clickableAreas.find(area => area.item?.img === "leaves");
  const sweep = { area, progress: 0 };
  state.fx ??= {};
  state.fx.leafSweep = sweep;
  state.fx.lockInput = true;
  playSE("se-suribachi");

  const startedAt = performance.now();
  function animate(now) {
    if (gameState !== state) return;
    sweep.progress = Math.min(1, (now - startedAt) / 1500);
    if (sweep.progress < 1) {
      if (state.currentRoom === "mainLeft") renderCanvasRoom();
      requestAnimationFrame(animate);
      return;
    }

    state.mainLeft.flags.leavesSwept = true;
    markProgress("sweep_leaves");
    delete state.fx.leafSweep;
    state.fx.lockInput = false;
    if (state.currentRoom === "mainLeft") {
      hoveredAreaIndex = null;
      renderCanvasRoom();
      updateMessage("落ち葉を掃いた。");
    }
  }

  renderCanvasRoom();
  requestAnimationFrame(animate);
}

function drawSweepingBroom(ctx, canvas, { area, progress }) {
  const broom = loadedImages[IMAGES.items.broom];
  if (!broom?.complete || !broom.naturalWidth) return;
  const { x, y, w, h } = getAreaDrawRect(area, canvas);
  const width = w * 1.7;
  const height = width * broom.naturalHeight / broom.naturalWidth;
  const swing = Math.sin(progress * 6 * Math.PI);
  ctx.drawImage(broom, x + (w - width) / 2 + swing * w * 0.65, y + h * 0.25 - height, width, height);
}

function getRoomBackgroundImage(roomId, state) {
  const images = IMAGES.rooms[roomId];
  if (!Array.isArray(images)) return images;
  return images[state[roomId]?.flags?.backgroundState ?? 0] || images[0];
}

function acquireItemOnce(flagKey, itemId, title, imgSrc, msg, onAfterClose) {
  const f = gameState.main.flags;
  if (f[flagKey]) {
    updateMessage("もう何もない");
    return;
  }
  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return;
  }
  f[flagKey] = true;
  addItem(itemId);
  markProgress(`acquire_${flagKey}`, { item: itemId });
  renderCanvasRoom();

  const afterClose = () => {
    onAfterClose?.();
  };

  const buttons = [{ text: "閉じる", action: "close" }];
  if (Array.isArray(imgSrc)) {
    const frames = imgSrc.map(src => `<img src="${src}" alt="">`).join("");
    showModal(title, `<div class="modal-anim">${frames}</div>`, buttons, afterClose, { contentClass: "showobj-modal" });
  } else {
    showModal(title, `<img src="${imgSrc}" style="width:400px;max-width:100%;display:block;margin:0 auto 20px;">`, buttons, afterClose);
  }
  updateMessage(msg);
}

function clickWrap(fn) {
  return function (...args) {
    fn.apply(this, args);
    clearUsingItem();
  };
}

// 対象ごとに固有のIDを指定し、クリックのたびに次のメッセージを表示する。
function cycleClickMessages(id, messages) {
  return clickWrap(() => {
    const indexes = gameState.clickMessageIndexes;
    const index = (indexes[id] ?? 0) % messages.length;
    updateMessage(messages[index]);
    indexes[id] = (index + 1) % messages.length;
  });
}

const ACTION_HANDLERS = {};

function handleAreaClick(action, event) {
  const handler = typeof action === "function" ? action : ACTION_HANDLERS[action];
  if (typeof handler === "function") handler(event);
}

function markProgress(step, extra = {}) { ANA.once("progress", step, { step, ...extra }); }

function getCameraRobotImageKey() {
  return getMainFlags().completeKurayami ? "roboCamera2" : "roboCamera";
}

function openCameraRobot() {
  const imageKey = getCameraRobotImageKey();
  const image = IMAGES.items[imageKey];
  if (imageKey === "roboCamera") {
    playSE("se-shutter");
    showObj(null, "カメラ係りのロボ「記念写真の撮影中です。」", image, "カメラ係りのロボは、写真を撮影している。");
    return;
  }

  const buttons = [{ text: "閉じる", action: "close" }];
  showModal("良い写真が撮れました", `
    <button id="cameraRobotPhoto" type="button" aria-label="記念写真を見る">
      <img class="showobj-image" src="${image}" alt="カメラ係りのロボ">
    </button>
  `, buttons, null, { contentClass: "showobj-modal" });
  document.getElementById("cameraRobotPhoto").onclick = () => {
    showImageModal("記念写真", IMAGES.modals.pic, null, buttons);
  };
  updateMessage("ロボは写真をチェックしている。");
}

function getMainFlags() {
  if (!gameState.main) gameState.main = {};
  if (!gameState.main.flags) gameState.main.flags = {};
  return gameState.main.flags;
}

function showObj(flagKey, title, imgSrc, msg, altImgSrc, msgEn) {
  const f = gameState.main.flags;
  const wasFlagOn = flagKey ? !!f[flagKey] : false;
  if (flagKey) f[flagKey] = true;
  if (flagKey && !wasFlagOn) {
    markProgress?.(`important_flag_${flagKey}`, { flagKey });
  }

  showImageModal(title, imgSrc, altImgSrc, [{ text: "閉じる", action: "close" }]);
  updateMessage(uiLang === "en" && altImgSrc ? msgEn || msg : msg);
}

function useFortuneKey() {
  if (gameState.selectedItem === "key" && hasItem("key")) {
    updateMessage("形があわない");
    return;
  }

  const flags = getMainFlags();
  if (flags.fortuneKeyUsed) {
    updateMessage("カギ穴だったようだ。カギはどこかへ消えてしまった");
    return;
  }
  if (gameState.selectedItem !== "keyFortune" || !hasItem("keyFortune")) {
    updateMessage("？…金属のような冷たい感触がある。");
    return;
  }

  removeItem("keyFortune");
  flags.fortuneKeyUsed = true;
  markProgress("use_fortune_key");
  updateMessage("暖かい光を感じた");

  const light = document.getElementById("fortuneLight");
  light.addEventListener("animationend", () => light.classList.remove("glowing"), { once: true });
  light.classList.add("glowing");
}

function completeDarkCorridor() {
  const flags = getMainFlags();
  const firstCompletion = !flags.completeKurayami;
  flags.completeKurayami = true;
  if (firstCompletion) markProgress("complete_dark_corridor");
  changeRoom("cafe");
  if (firstCompletion) {
    playSE("se-kiroriro");
    showModal("ご利益を受けたような気がする", "", [{ text: "閉じる", action: "close" }]);
  }
}

function receiveCorridorTicket() {
  const flags = gameState.indoor.flags;
  if (flags.corridorUnlocked) {
    updateMessage("仏像ロボ「どうぞお進みください」");
    return;
  }
  if (gameState.selectedItem !== "ticket" || !hasItem("ticket")) {
    updateMessage("仏像ロボ「この先に進むには、チケットが必要です」");
    return;
  }

  removeItem("ticket");
  flags.corridorUnlocked = true;
  markProgress("unlock_dark_corridor");
  playSE("se-cyber");
  showObj(null, "「チケットを確認しました。先へお進みください。」", IMAGES.modals.roboTicketReceive, "チケットを渡した。");
}

function openTicketMachine() {
  const flags = gameState.indoor.flags;
  if (flags.ticketIssued) {
    updateMessage("チケットは発券済みだ。");
    return;
  }

  const digits = [0, 0, 0, 0];
  const labels = ["底の十の位", "底の一の位", "指数の十の位", "指数の一の位"];
  const digitButton = index => `<button type="button" aria-label="${labels[index]} 0">0</button>`;
  showModal("チケットマシン", `
    <div class="ticket-machine-number">
      <div class="ticket-machine-base">${digitButton(0)}${digitButton(1)}</div>
      <div class="ticket-machine-exponent">${digitButton(2)}${digitButton(3)}</div>
    </div>
    <p id="ticketMachineFeedback" role="status"></p>
  `, [
    {
      text: "OK",
      action: () => {
        const feedback = document.getElementById("ticketMachineFeedback");
        if (digits.join("") !== "1068") {
          feedback.textContent = "チケットは出てこない。";
          return;
        }
        if (!addItem("ticket")) {
          feedback.textContent = "アイテム欄がいっぱいだ。";
          return;
        }
        flags.ticketIssued = true;
        markProgress("issue_corridor_ticket", { item: "ticket" });
        showObj(null, "チケットを手に入れた。", IMAGES.modals.ticketGet, "チケットを手に入れた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  const feedback = document.getElementById("ticketMachineFeedback");
  document.querySelectorAll(".ticket-machine-number button").forEach((button, index) => {
    button.onclick = () => {
      const digit = (digits[index] + 1) % 10;
      digits[index] = digit;
      button.textContent = digit;
      button.setAttribute("aria-label", `${labels[index]} ${digit}`);
      feedback.textContent = "";
    };
  });
}

function openStorageDoor() {
  const flags = gameState.mainLeft.flags;
  if (flags.storageDoorUnlocked) {
    changeRoom("storageFront");
    return;
  }

  showDoorSymbolPuzzle("左奥の扉", ["◇", "△", "〇", "□"], "□〇△◇", () => {
    flags.storageDoorUnlocked = true;
    markProgress("unlock_storage_door");
    closeModal();
    playSE("se-clear");
    updateMessage("左奥の扉の鍵が開いた。");
  }, "&lt;");
}

function openShedDoor() {
  const flags = gameState.storageFront.flags;
  if (flags.shedDoorUnlocked) {
    acquireItemOnce("foundRope", "rope", "物置にはロープがある", IMAGES.modals.openStorage, "ロープを手に入れた！");
    return;
  }

  showDoorSymbolPuzzle("物置の扉", ["◎", "♪", "↑", "π", "+", "♡"], "♪π♡", () => {
    flags.shedDoorUnlocked = true;
    markProgress("unlock_shed_door");
    closeModal();
    playSE("se-gacha");
    updateMessage("物置の扉の鍵が開いた。");
  });
}

function isHungryBearPresent() {
  const flags = getMainFlags();
  return flags.completeKurayami && !flags.bearJoined;
}

function interactWithHungryBear() {
  if (gameState.selectedItem === "takeout" && hasItem("takeout")) {
    const message = "わあ！一緒に食べようよ";
    removeItem("takeout");
    markProgress("give_takeout_to_bear");
    updateMessage(message);
    showModal(message, `<img class="showobj-image" src="${IMAGES.modals.bearHappy}" alt="喜ぶクマ妖精" onerror="this.style.display = 'none'">`, [{
      text: "次へ",
      action: () => {
        gameState.trueEnd.flags.backgroundState = 2;
        closeModal();
        travelWithSteps("trueEnd", { soundId: "se-fanta" });
      },
    }], null, { contentClass: "showobj-modal" });
    return;
  }

  if (gameState.selectedItem !== "senbei" || !hasItem("senbei")) {
    showObj(null, "「おなかが空いちゃった…」", IMAGES.items.bearCrying, "クマ妖精はおなかが空いている。");
    return;
  }

  const { bearSenbei, bearSenbei2 } = IMAGES.modals;
  showModal("わあ！おせんべい。ポリポリ…♪", `
    <div class="modal-anim">
      <img src="${bearSenbei}" alt="">
      <img src="${bearSenbei2}" alt="おせんべいを食べるクマ妖精">
    </div>
  `, [{
    text: "次へ",
    action: () => {
      removeItem("senbei");
      getMainFlags().bearJoined = true;
      addItem("bearItem");
      markProgress("recruit_bear", { item: "bearItem" });
      renderCanvasRoom();
      showObj(null, "ボク、一緒に行くよ！", IMAGES.items.bearItem, "クマ妖精が仲間になった。");
    },
  }], null, { contentClass: "showobj-modal" });
}

function openInnerWellChest() {
  const flags = getMainFlags();
  if (flags.innerWellChestUnlocked) {
    const itemId = "keyFortune";
    const name = getItemName(itemId);
    acquireItemOnce("foundKeyFortune", itemId, name, getInventoryItemImage(itemId), `${name}を手に入れた！`);
    return;
  }

  const symbols = [
    ["iconFrog", "カエル"],
    ["iconApple", "リンゴ"],
    ["iconBird", "鳥"],
    ["iconDaruma", "だるま"],
    ["iconEye", "目"],
  ];
  const answer = ["iconBird", "iconDaruma", "iconApple", "iconEye"];
  const positions = Array(answer.length).fill(0);
  const [firstIcon, firstName] = symbols[0];

  showModal("宝箱", `
    <div class="inner-well-chest-lock">
      ${positions.map((_, index) => `
        <button type="button" aria-label="${index + 1}番目: ${firstName}">
          <img src="${IMAGES.modals[firstIcon]}" alt="">
        </button>
      `).join('<span aria-hidden="true">→</span>')}
    </div>
    <p id="innerWellChestFeedback" role="status"></p>
  `, [
    {
      text: "OK",
      action: () => {
        if (!positions.every((position, index) => symbols[position][0] === answer[index])) {
          feedback.textContent = "宝箱は開かない。";
          return;
        }
        flags.innerWellChestUnlocked = true;
        markProgress("unlock_inner_well_chest");
        closeModal();
        playSE("se-clear");
        updateMessage("宝箱の鍵が開いた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  const feedback = document.getElementById("innerWellChestFeedback");
  document.querySelectorAll(".inner-well-chest-lock button").forEach((button, index) => {
    const image = button.querySelector("img");
    button.onclick = () => {
      positions[index] = (positions[index] + 1) % symbols.length;
      const [icon, name] = symbols[positions[index]];
      image.src = IMAGES.modals[icon];
      button.setAttribute("aria-label", `${index + 1}番目: ${name}`);
      feedback.textContent = "";
    };
  });
}

function openRightCounterStorage() {
  if (getMainFlags().unlockRightStorage) {
    const message = "闇の回廊の攻略本を手に入れた";
    acquireItemOnce("foundGuidebook", "guidebook", message, IMAGES.items.guidebook, message);
    return;
  }

  if (gameState.selectedItem === "key" && hasItem("key")) {
    playSE("se-gacha");
    removeItem("key");
    showObj("unlockRightStorage", "カギを開けた。", IMAGES.modals.unlockRightStorage, "カギを開けた。");
    renderCanvasRoom();
    return;
  }

  if (gameState.selectedItem === "keyFortune" && hasItem("keyFortune")) {
    updateMessage("カギが合わない");
    return;
  }
  updateMessage("カギがかかっている");
}

function openLeftCounterStorage() {
  const flags = getMainFlags();
  if (flags.unlockLeftStorage) {
    updateMessage("カウンター左の収納は開いている。");
    return;
  }

  const answer = [0, 2, 1, 1, 0, 2];
  const levels = ["低", "中", "高"];
  const positions = Array(answer.length).fill(0);
  showModal("カウンター左の収納", `
    <div class="counter-storage-bars">
      ${positions.map((_, index) => `<button type="button" data-level="0" aria-label="${index + 1}番目: ${levels[0]}"><span aria-hidden="true"></span></button>`).join("")}
    </div>
    <p id="counterStorageFeedback" role="status"></p>
  `, [
    {
      text: "OK",
      action: () => {
        if (!positions.every((level, index) => level === answer[index])) {
          feedback.textContent = "収納は開かない。";
          return;
        }
        flags.unlockLeftStorage = true;
        markProgress("unlock_left_counter_storage");
        closeModal();
        playSE("se-clear");
        renderCanvasRoom();
        updateMessage("カウンター左の収納が開いた。");
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  const feedback = document.getElementById("counterStorageFeedback");
  document.querySelectorAll(".counter-storage-bars button").forEach((button, index) => {
    button.onclick = () => {
      const level = (positions[index] + 1) % levels.length;
      positions[index] = level;
      button.dataset.level = String(level);
      button.setAttribute("aria-label", `${index + 1}番目: ${levels[level]}`);
      feedback.textContent = "";
    };
  });
}

function showDoorSymbolPuzzle(title, symbols, answer, onUnlock, sign, wrongAnswerMessage = "扉は開かない。") {
  const positions = Array(answer.length).fill(0);
  showModal(title, `
    ${sign ? `<div class="storage-door-sign">${sign}</div>` : ""}
    <div class="storage-door-symbols">
      ${positions.map((_, index) => `<button type="button" aria-label="${index + 1}番目: ${symbols[0]}">${symbols[0]}</button>`).join("")}
    </div>
    <p id="storageDoorFeedback" role="status"></p>
  `, [
    {
      text: "OK",
      action: () => {
        if (positions.map(index => symbols[index]).join("") !== answer) {
          document.getElementById("storageDoorFeedback").textContent = wrongAnswerMessage;
          return;
        }
        onUnlock();
      },
    },
    { text: "閉じる", action: "close" },
  ]);

  const feedback = document.getElementById("storageDoorFeedback");
  document.querySelectorAll(".storage-door-symbols button").forEach((button, index) => {
    button.onclick = () => {
      positions[index] = (positions[index] + 1) % symbols.length;
      const symbol = symbols[positions[index]];
      button.textContent = symbol;
      button.setAttribute("aria-label", `${index + 1}番目: ${symbol}`);
      feedback.textContent = "";
    };
  });
}

function showBuddhaStatue(number, title = `仏像${number}`) {
  const imageKey = `butsu${number}`;
  const clearedImage = getMainFlags().completeKurayami
    ? IMAGES.modals[`${imageKey}AfterKurayami`]
    : undefined;
  showObj(null, title, clearedImage ?? IMAGES.modals[imageKey], "仏像がある。");
}

function openLargeIncenseBurner() {
  const title = "大きな香炉";
  const { senkoBaseTri, senkoCloseUp } = IMAGES.modals;
  const buttons = [{ text: "閉じる", action: "close" }];
  showModal(title, `
    <button id="incenseBurnerZoom" type="button" aria-label="線香を拡大する">
      <img class="showobj-image" src="${senkoBaseTri}" alt="大きな香炉">
    </button>
  `, buttons, null, { contentClass: "showobj-modal" });
  document.getElementById("incenseBurnerZoom").onclick = () => {
    showImageModal(title, senkoCloseUp, null, buttons);
  };
}

function showIncenseOffering() {
  const flags = gameState.mainLeft.flags;
  const {
    senkoBaseCircle,
    senkoBaseCirclePutSenkoBefore,
    senkoBaseCirclePutSenko,
    senkoBaseCirclePutSenko2,
  } = IMAGES.modals;
  const title = "香炉";
  if (!flags.incenseOffered && gameState.selectedItem === "senkoFire" && hasItem("senkoFire")) {
    removeItem("senkoFire");
    flags.incenseOffered = true;
    markProgress("offer_incense");
    showModal(title, `
      <div class="modal-anim">
        <img src="${senkoBaseCirclePutSenkoBefore}" alt="">
        <img src="${senkoBaseCirclePutSenko}" alt="">
        <img src="${senkoBaseCirclePutSenko2}" alt="線香を供えた香炉">
      </div>
    `, [{ text: "閉じる", action: "close" }], null, { contentClass: "showobj-modal" });
    updateMessage("線香を供えた。");
    return;
  }

  const image = flags.incenseOffered ? senkoBaseCirclePutSenko2 : senkoBaseCircle;
  const message = flags.incenseOffered ? "線香が供えられている。" : "丸い香炉がある。";
  showObj(null, title, image, message);
}

function useIncenseLightingStand() {
  if (gameState.selectedItem === "senko" && hasItem("senko")) {
    removeItem("senko");
    addItem("senkoFire");
    markProgress("light_incense");
    showObj(null, "線香に火をつけた。", IMAGES.modals.senkoFire, "線香に火をつけた。");
  } else if (hasItem("senko") || hasItem("senkoFire")) {
    updateMessage("線香がある");
  } else if (addItem("senko")) {
    markProgress("acquire_incense", { item: "senko" });
    updateMessage("線香を手に入れた。");
  }
}

function showAmuletGuide() {
  const amulets = [
    ["赤色", "力のお守り", "#a12b2b"],
    ["緑色", "夢のお守り", "#037819"],
    ["青色", "勉学のお守り", "#20598b"],
    ["黄色", "幸運のお守り", "#745600"],
    ["橙色", "安心のお守り", "#9a450a"],
    ["ピンク色", "心のお守り", "#9b3563"],
  ];
  const cells = amulets.map(([color, name, ink]) =>
    `<li style="color: ${ink}"><span>${color}：</span><span>${name}</span></li>`
  ).join("");
  const content = `<ul class="amulet-guide-grid">${cells}</ul><p>各６００円</p>`;
  showModal("六種類のお守りの説明", content,
    [{ action: "close" }], null, { contentClass: "amulet-guide-modal" });
}

function showInfinityAmulet() {
  const { infinityAmulet, infinityCard } = IMAGES.modals;
  showImagePages("無限のお守り", [
    { src: infinityAmulet, alt: "無限のお守り" },
    { src: infinityCard, alt: "無限のお守りのカード" },
  ]);
}

function showGoshuinBook() {
  if (gameState.selectedItem === "bearItem" && hasItem("bearItem")) {
    const message = "とり→りんご→？、あれ、だめだなあ";
    showModal(message, `<img class="showobj-image" src="${IMAGES.modals.bearShiritoi}" alt="しりとりを考えるクマ妖精" onerror="this.style.display = 'none'">`, [
      { text: "閉じる", action: "close" },
    ], null, { contentClass: "showobj-modal" });
    updateMessage(message);
    return;
  }

  const { bookBird, bookEye, bookApple } = IMAGES.modals;
  showImagePages("御朱印帳", [
    { src: bookBird, alt: "鳥のページ" },
    { src: bookEye, alt: "目のページ" },
    { src: bookApple, alt: "りんごのページ" },
  ]);
}

function showPictureBook(index = 0) {
  const pageKeys = ["ehonMain", "ehon1", "ehon2", "ehon3", "ehon4"];
  const key = pageKeys[index];
  const buttons = [];
  if (index > 0) {
    buttons.push({ text: "←", action: () => showPictureBook(index - 1) });
  }
  if (index < pageKeys.length - 1) {
    buttons.push({ text: "→", action: () => showPictureBook(index + 1) });
  }
  buttons.push({ text: "閉じる", action: "close" });
  showImageModal("絵本", IMAGES.modals[key], IMAGES.modals[`${key}En`], buttons);
}

function showImagePages(title, pages, index = 0) {
  const { src, alt } = pages[index];
  const buttons = [];
  if (index > 0) {
    buttons.push({ text: "←", action: () => showImagePages(title, pages, index - 1) });
  }
  if (index < pages.length - 1) {
    buttons.push({ text: "→", action: () => showImagePages(title, pages, index + 1) });
  }
  buttons.push({ text: "閉じる", action: "close" });
  showModal(title, `<img class="showobj-image" src="${src}" alt="${alt}">`, buttons, null, { contentClass: "showobj-modal" });
}

function isLanternUnlocked() {
  return gameState.storageFront.flags.lanternUnlocked || getMainFlags().foundMemo || hasItem("memoStar");
}

function showLantern() {
  if (!isLanternUnlocked()) {
    showDoorSymbolPuzzle("灯篭のふた", "0123456789", "547", () => {
      gameState.storageFront.flags.lanternUnlocked = true;
      closeModal();
      renderCanvasRoom();
      playSE("se-clear");
      updateMessage("灯篭のふたが開いた。");
    }, null, "ふたは開かない。");
    return;
  }

  if (getMainFlags().foundMemo || hasItem("memoStar")) {
    updateMessage("もう何もない");
    return;
  }

  const buttons = [{ text: "閉じる", action: "close" }];
  showModal("何か紙が貼られている", `
    <button id="lanternMemo" type="button" aria-label="紫の星のメモを取る">
      <img class="showobj-image" src="${IMAGES.modals.tourou}" alt="灯篭">
    </button>
  `, buttons, null, { contentClass: "showobj-modal" });
  document.getElementById("lanternMemo").onclick = () => {
    acquireItemOnce("foundMemo", "memoStar", "紫の星のメモ", IMAGES.items.memoStar, "紫の星のメモを手に入れた");
  };
  updateMessage("灯篭の奥に紙が貼られている");
}

function showSquareIncenseStand() {
  const title = "線香を立てる香炉";
  const buttons = [{ text: "閉じる", action: "close" }];
  const regionStyle = "position:absolute;bottom:0;width:50%;height:50%;margin:0;padding:0;background:transparent;";
  showModal(title, `
    <div style="position:relative;width:fit-content;margin:0 auto 20px;">
      <img class="showobj-image" src="${IMAGES.modals.senkoBaseSquare}" alt="${title}" style="margin:0;">
      <button id="incenseStand10Yen" type="button" aria-label="10円玉を見る" style="${regionStyle}left:0;"></button>
      <button id="incenseStand1Yen" type="button" aria-label="1円玉を見る" style="${regionStyle}right:0;"></button>
    </div>
  `, buttons, null, { contentClass: "showobj-modal" });
  document.getElementById("incenseStand10Yen").onclick = () => {
    showImageModal("10円玉", IMAGES.modals["10yen"], null, buttons);
  };
  document.getElementById("incenseStand1Yen").onclick = () => {
    showImageModal("1円玉", IMAGES.modals["1yen"], null, buttons);
  };
  updateMessage("線香が立てられている。");
}

function showImageModal(title, imgSrc, altImgSrc, buttons) {
  const imgId = "objImg_" + Date.now();
  const src = uiLang === "en" && altImgSrc ? altImgSrc : imgSrc;
  const content = `<img id="${imgId}" class="showobj-image" src="${src}">`;

  if (altImgSrc) {
    buttons = [{
      text: "🌐 EN/JP",
      action: () => {
        const el = document.getElementById(imgId);
        if (!el) return;

        uiLang = uiLang === "en" ? "jp" : "en";
        el.src = uiLang === "en" ? altImgSrc : imgSrc;
      },
    }, ...buttons];
  }

  showModal(title, content, buttons, null, { contentClass: "showobj-modal" });
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;

  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderStatusIcons() {
  const area = document.getElementById("statusIconArea");
  if (!area) return;
  area.innerHTML = getMainFlags().completeKurayami
    ? '<span class="blessing-icon" role="img" aria-label="ご利益" title="ご利益">✦</span>'
    : "";
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
    return true;
  } else {
    updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
    return false;
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
    roboTicket: "ロボチケット", ticket: "チケット", money: "お金", crown: "王冠", senko: "線香",
    senkoFire: "火のついた線香", broom: "ほうき", rope: "ロープ", bearItem: "クマ妖精", key: "カギ", keyFortune: "幸運のカギ",
    guidebook: "闇の回廊の攻略本", takeout: "テイクアウト", memoStar: "紫の星のメモ", senbei: "煎餅"
  };
  return names[itemId] || itemId;
}
function openInventoryItemDetail(itemId, slotIndex, fallbackSrc) {
  if (gameState.fx?.lockInput) return;
  const src = getInventoryItemImage(itemId) || fallbackSrc;
  if (itemId === "bearItem") {
    showBearItemDetail();
    return;
  }
  if (itemId === "money") {
    showModal(getItemName(itemId), `<img src="${src}" style="max-width:100%;max-height:380px;display:block;margin:auto;"><p style="text-align:center;font-size:1.5em;font-weight:bold;">${(gameState.money || 0).toLocaleString("ja-JP")}円</p>`, [{ text: "閉じる", action: "close" }]);
    return;
  }
  const buttons = [{ text: "閉じる", action: "close" }];
  if (itemId === "guidebook") {
    buttons.unshift({
      text: "読む",
      action: () => showImageModal(getItemName(itemId), IMAGES.modals.guidePage, IMAGES.modals.guidePageEn, [
        { text: "閉じる", action: "close" },
      ]),
    });
  }
  showModal(getItemName(itemId), '<img src="' + src + '" style="max-width:100%;max-height:380px;display:block;margin:auto;">', buttons);
}

function getBearDialogue() {
  if (gameState.main.flags.foundKey) {
    return ["わーい", "役に立つクマだよ"];
  }

  return ["ボク、実は飛べるんだよ", "おせんべい、ごちそうさま！"];
}

function showBearItemDetail() {
  const lines = getBearDialogue();
  let index = 0;
  showModal(getItemName("bearItem"), `
    <img class="showobj-image" src="${IMAGES.items.bearItem}" alt="クマ妖精">
    <p id="bearDialogue" role="status"></p>
  `, [
    {
      text: "話す",
      action: () => {
        document.getElementById("bearDialogue").textContent = lines[index];
        index = (index + 1) % lines.length;
      },
    },
    { text: "閉じる", action: "close" },
  ], null, { contentClass: "showobj-modal" });
}

function renderNavigation() {
  const navDiv = document.querySelector(".navigation");
  navDiv.innerHTML = "";
  if (!canUseNavigation()) return;

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
    .filter(isNavigationRoom)
    .forEach((roomId) => {
      const b = document.createElement("button");
      b.className = "nav-btn";
      b.textContent = rooms[roomId].name;
      b.onclick = () => changeRoom(roomId);
      navDiv.appendChild(b);
    });
}

function openNavModal() {
  if (!canUseNavigation() || blockCafeDeparture()) return;
  const cur = gameState.currentRoom;
  const listHtml = `
    <div style="display:flex;flex-direction:column;gap:10px;max-height:60vh;overflow:auto;">
      ${gameState.openRooms
      .filter(isNavigationRoom)
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

function canUseNavigation() {
  const roomId = gameState.currentRoom;
  return !END_IDS.has(roomId) && !DARK_CORRIDOR_IDS.has(roomId);
}

function isNavigationRoom(roomId) {
  return Object.hasOwn(rooms, roomId)
    && roomId !== "innerWell"
    && roomId !== "cafe"
    && !END_IDS.has(roomId)
    && !DARK_CORRIDOR_IDS.has(roomId);
}

function addNaviItem(room) {
  if (!isNavigationRoom(room)) return false;
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
      magBtn.innerHTML = '<img src="' + BASE_COMMON + '/magnifier.png" alt="拡大">';
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
    isBGMPlaying = true;
    isBGMInitialized = true;
    syncRoomBGM();
  }
}
window.addEventListener("click", initBGMOnce, { once: true });

function toggleBGM() {
  if (DARK_CORRIDOR_IDS.has(gameState.currentRoom)) return;
  isBGMPlaying = !isBGMPlaying;
  syncRoomBGM();
}

function syncRoomBGM() {
  const bgm = document.getElementById("bgm");
  const button = document.getElementById("bgm-toggle");
  changeBGM(ENDING_BGM[gameState.currentRoom] ?? DEFAULT_BGM);
  const inCorridor = DARK_CORRIDOR_IDS.has(gameState.currentRoom);
  const shouldPlay = isBGMPlaying && !inCorridor;
  button.disabled = inCorridor;
  button.textContent = shouldPlay ? "🔊 BGM" : "🔇 BGM";
  if (!shouldPlay) bgm.pause();
  else if (bgm.paused) bgm.play();
}

function changeBGM(newSrc) {
  const bgm = document.getElementById("bgm");
  // ファイル名のみで比較
  const current = bgm.src.split("/").pop();
  const next = newSrc.split("/").pop();
  if (current === next) return; // すでにそのBGMなら何もしない

  bgm.pause();
  bgm.src = newSrc;
  bgm.load();
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

const loadedImages = {};

function preloadImages() {
  const sources = [
    ...Object.values(IMAGES.rooms).flat(),
    ...Object.values(IMAGES.items),
  ];
  for (const src of new Set(sources)) {
    const img = new Image();
    loadedImages[src] = img;
    img.onload = renderCanvasRoom;
    img.src = src;
  }
}

const startupModalSources = [IMAGES.modals.blockGate];

async function preloadModalImage(src, priority) {
  const img = new Image();
  img.fetchPriority = priority;
  img.src = src;
  // 表示時の読み込みで再試行できるよう、先読みの失敗で進行を止めない。
  await img.decode().catch(() => {});
}

async function preloadRemainingModalImages() {
  const sources = new Set(Object.values(IMAGES.modals));
  for (const src of startupModalSources) sources.delete(src);

  for (const src of sources) {
    await preloadModalImage(src, "low");
  }
}

// save&load
function isSaveBlocked() {
  return gameState.fx?.lockInput;
}

function saveGameToSlot(slotIndex) {
  if (isSaveBlocked()) {
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
  merged.openRooms = merged.openRooms.filter(isNavigationRoom);
  if (merged.openRooms.length === 0) merged.openRooms = def.openRooms.slice();
  if (!Object.hasOwn(rooms, merged.currentRoom)) merged.currentRoom = def.currentRoom;

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
  if (isSaveBlocked()) {
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

async function startGame() {
  canvas.inert = true;
  updateMessage("画像を読み込んでいます…");
  const startupImages = startupModalSources.map(src => preloadModalImage(src, "high"));
  preloadImages();

  let timeoutId;
  await Promise.race([
    Promise.all(startupImages),
    new Promise(resolve => { timeoutId = setTimeout(resolve, 5000); }),
  ]);
  clearTimeout(timeoutId);

  initGame();
  canvas.inert = false;
  void preloadRemainingModalImages();
}

startGame();
