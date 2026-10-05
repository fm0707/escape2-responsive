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
const USE_LOCAL_ASSETS = location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(location.hostname) || location.search.includes("localimg=1");
const BASE_46 = USE_LOCAL_ASSETS ? "images/46" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images/46";
const BASE_SOUND_46 = USE_LOCAL_ASSETS ? "sounds/46" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/sounds/46";
const BASE_COMMON = USE_LOCAL_ASSETS ? "images" : "https://pub-40dbb77d211c4285aa9d00400f68651b.r2.dev/images";
const I46 = (file) => `${BASE_46}/${file}`;
const ICM = (file) => `${BASE_COMMON}/${file}`;
const S46 = (file) => `${BASE_SOUND_46}/${file}`;
const DEFAULT_BGM = S46("ojamamushi_ha_docchi.mp3");

// 46の背景・共通UI画像。アイテム／モーダル画像はここに追加する。
const IMAGES = {
  rooms: {
    houseWara: [I46("field.webp")],
    houseWood: [I46("field.webp")],
    houseBrick: [I46("field.webp")],
    storage: [I46("field.webp")],
    bonfire: [I46("field.webp")],
    storageInner: [I46("storage_inner.webp")],
    shrineZoom: [I46("shrine_zoom.webp")],
    shrineLeft: [I46("shrine_left.webp")],
    shrineTablet: [I46("stone_tablet_power.webp")],
    end: [I46("end.webp")],
    trueEnd: [I46("true_end.webp"), I46("true_end2.webp")],
  },
  items: {
    bear: ICM("bear.png"), back: ICM("common/back.png"),
    arrowRight: ICM("common/arrow_right.png"), arrowLeft: ICM("common/arrow_left.png"),
    blackBack: ICM("common/black_back.png"),
    lang_en: ICM("common/en2.png"), lang_jp: ICM("common/jp.png"),
    key: ICM("common/key.webp"), battery: ICM("common/battery.webp"),
    houseWara: I46("house_wara.webp"),
    houseWood: I46("house_wood.webp"),
    houseBrick: I46("house_brick.webp"),
    houseWaraBroken: I46("house_wara_broken.webp"),
    houseWoodBroken: I46("house_wood_broken.webp"),
    signWara: I46("sign_wara.webp"),
    signWood: I46("sign_wood.webp"),
    signBrick: I46("sign_brick.webp"),
    storage: I46("storage.webp"),
    bonfire: I46("bonfire.webp"),
    bonfireAfter: I46("bonfire_after.webp"),
    shrine: I46("shrine.webp"),
    bird: I46("bird.webp"),
    operaGlass: I46("opera_glass.webp"),
    boxCap: I46("box_cap.webp"),
    boxCapOpended: I46("box_cap_opened.webp"),
    cap: I46("cap.webp"),
    bearWithCap: I46("bearWithCap.webp"),
    bearWithCapSide: I46("bearWithCapSide.webp"),
    bearFleeze: I46("bear_fleeze.webp"),
    step: I46("step.webp"),
    waterGunDisp: I46("water_gun_disp.webp"),
    waterGun: I46("water_gun.webp"),
    susukiDisp: I46("susuki_disp.webp"),
    susuki: I46("susuki.webp"),
    boxRed: I46("box_red.webp"),
    boxRedOpened: I46("box_red_opened.webp"),
    scissors: I46("scissors.webp"),
    candle: I46("candle.webp"),
    candleOn: I46("candle_on.webp"),
    iconPigWara: I46("icon_pig_wara.webp"),
    iconPigWood: I46("icon_pig_wood.webp"),
    gem: I46("gem.webp"),
    iconHuman: I46("icon_human.webp"),
    boxCalcLid: I46("box_calc_lid.webp"),
    safeClose: I46("safe_close.webp"),
    safeOpen: I46("safe_open.webp"),
    potato: I46("potato.webp"),
    bakedPotato: I46("baked_potato.webp"),
    match: I46("match.webp"),
  },
  modals: {
    birdZoom: I46("bird_zoom.webp"),
    bearSneeze: I46("modal_bear_sneeze.webp"),
    bearReceiveCap: I46("modal_bear_receive_cap.webp"),
    bearWalking: I46("modal_bear_walking.webp"),
    bearThinking: I46("modal_bear_thinking.webp"),
    bearWatchClock: I46("modal_bear_watch_clock.webp"),
    bakingPotato: I46("modal_bakeing_potato.webp"),
    extinguishFire: I46("modal_extinguish_fire.webp"),
    sneezeBefore: I46("modal_sneeze_before.webp"),
    sneeze1: I46("modal_sneeze1.webp"),
    sneeze2: I46("modal_sneeze2.webp"),
    sneeze3: I46("modal_sneeze3.webp"),
    candleOn: I46("modal_candle_on.webp"),
    stoneTabletString: I46("stone_tablet_string.webp"),
    bearGun1: I46("modal_bear_gun1.webp"),
    bearGun2: I46("modal_bear_gun2.webp"),
    bearGun3: I46("modal_bear_gun3.webp"),
    clock: I46("modal_clock.webp"),
    pigs: I46("modal_pigs.webp"),
    bearEating: I46("modal_bear_eating.webp"),
    bearShockedWara: I46("modal_bear_shocked_wara.webp"),
    bearShockedWood: I46("modal_bear_shocked_wood.webp"),
    bearFire: I46("modal_bear_fire.webp"),
    potatoNobake: I46("modal_potato_nobake.webp"),
    bearButterEvent1: I46("modal_bear_butter_event1.webp"),
    bearButterEvent2: I46("modal_bear_butter_event2.webp"),
    badend: I46("badend.webp"),
    badendWInd: I46("badend_wind.webp"),
  },
};

// ゲーム状態
const SAVE_KEY = "escapeGameState46";
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

// 45と同じクリックエリア形式。各部屋のオブジェクトや謎解きを追加する。
let rooms = {
  houseWara: {
    name: "わらの家",
    description: "",
    clickableAreas: [
      // ここに調べる場所やアイテムなどを追加
      {
        x: 8.2, y: 43.8, width: 38.7, height: 38.7,
        onClick: clickWrap(function () {

        }),
        description: 'わらの家',
        zIndex: 5,
        usable: () => !getMainFlags().houseWaraBroken,
        item: { img: 'houseWara', visible: () => !getMainFlags().houseWaraBroken },
      },
      {
        x: 23.0, y: 68.8, width: 13.5, height: 11.2,
        onClick: clickWrap(function () {
          acquireItemOnce("gotCandle", "candle", "ろうそくが落ちている", IMAGES.items.candle, "ろうそくを手に入れた。");
        }),
        description: 'ろうそく',
        zIndex: 6,
        usable: () => getMainFlags().houseWaraBroken && !getMainFlags().gotCandle,
        item: { img: 'candle', visible: () => getMainFlags().houseWaraBroken && !getMainFlags().gotCandle }
      },
      {
        x: 8.2, y: 43.8, width: 38.7, height: 38.7,
        onClick: clickWrap(function () {
          if (getMainFlags().houseWaraBroken && gameState.selectedItem === "bearWithCap" && hasItem("bearWithCap")) {
            showObj(null, "ええー！お家が壊れてる！", IMAGES.modals.bearShockedWara, "わらの家の残骸がある。");
            return;
          }
          updateMessage("わらの家の残骸がある。");
        }),
        description: 'わらの家破壊後',
        zIndex: 5,
        usable: () => true,
        item: { img: 'houseWaraBroken', visible: () => getMainFlags().houseWaraBroken },
      },
      {
        x: 38.9, y: 70.4, width: 17.8, height: 17.8,
        onClick: clickWrap(function () {
          showObj(null, 'わらの家立札', IMAGES.items.signWara, '立札を調べた。');
        }),
        description: 'わらの家立札',
        zIndex: 6,
        usable: () => true,
        item: { img: 'signWara', visible: () => true }
      },
      {
        x: 63.4, y: 73.6, width: 23.2, height: 23.2,
        onClick: clickWrap(function () {
          placeBearOnStep("putBearOnStepWara");
        }),
        description: '台',
        zIndex: 5,
        usable: () => true,
        item: { img: 'step', visible: () => true }
      },
      {
        x: 63.4, y: 59.4, width: 23.0, height: 23.0,
        onClick: clickWrap(function () {
          takeBearFromStep("putBearOnStepWara");
        }),
        description: '台に乗るクマ妖精',
        zIndex: 6,
        usable: () => getMainFlags().putBearOnStepWara,
        item: { img: 'bearWithCapSide', visible: () => getMainFlags().putBearOnStepWara }
      },

    ],
  },
  houseWood: {
    name: "木の家",
    description: "",
    clickableAreas: [
      // ここに調べる場所やアイテムなどを追加
      {
        x: 8.2, y: 43.8, width: 38.7, height: 38.7,
        onClick: clickWrap(function () {

        }),
        description: '木の家',
        zIndex: 5,
        usable: () => !getMainFlags().houseWoodBroken,
        item: { img: 'houseWood', visible: () => !getMainFlags().houseWoodBroken },
      },
      {
        x: 38.9, y: 70.4, width: 17.8, height: 17.8,
        onClick: clickWrap(function () {
          showObj(null, '木の家立札', IMAGES.items.signWood, '立札を調べた。');
        }),
        description: '木の家立札',
        zIndex: 6,
        usable: () => true,
        item: { img: 'signWood', visible: () => true }
      },
      {
        x: 79.4, y: 8.4, width: 11.3, height: 9.1,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "operaGlass") {
            showObj(null, "鳥を双眼鏡で見た。", IMAGES.modals.birdZoom, "鳥を双眼鏡で見た。");
          } else {
            updateMessage("空に鳥が飛んでいる。");
          }
        }),
        description: '空の鳥',
        zIndex: 5,
        usable: () => true,
        item: { img: 'bird', visible: () => true }
      },
      {
        x: 63.4, y: 73.6, width: 23.2, height: 23.2,
        onClick: clickWrap(function () {
          placeBearOnStep("putBearOnStepWood");
        }),
        description: '台',
        zIndex: 5,
        usable: () => true,
        item: { img: 'step', visible: () => true }
      },
      {
        x: 63.4, y: 59.4, width: 23.0, height: 23.0,
        onClick: clickWrap(function () {
          takeBearFromStep("putBearOnStepWood");
        }),
        description: '台に乗るクマ妖精',
        zIndex: 6,
        usable: () => getMainFlags().putBearOnStepWood,
        item: { img: 'bearWithCapSide', visible: () => getMainFlags().putBearOnStepWood }
      },
      {
        x: 20.1, y: 76.1, width: 9.7, height: 9.5,
        onClick: clickWrap(function () {
          acquireItemOnce("gotWoodGem", "gem", "宝珠", IMAGES.items.gem, "宝珠を手に入れた。");
        }),
        description: '木の家の宝珠',
        zIndex: 6,
        usable: () => getMainFlags().houseWoodBroken && !getMainFlags().gotWoodGem,
        item: { img: 'gem', visible: () => getMainFlags().houseWoodBroken && !getMainFlags().gotWoodGem }
      },
    ],
  },
  houseBrick: {
    name: "レンガの家",
    description: "",
    clickableAreas: [
      // ここに調べる場所やアイテムなどを追加
      {
        x: 8.2, y: 43.8, width: 38.7, height: 38.7,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "key" && hasItem("key") && !getMainFlags().houseBrickUnlocked) {
            getMainFlags().houseBrickUnlocked = true;
            removeItem("key");
            playSE("se-gacha");
            showModal("ドアの鍵を開けた。", "", [{ text: "閉じる", action: "close" }]);
            updateMessage("ドアの鍵を開けた。");
            markProgress("brick_door_unlocked");
            return;
          }
          if (getMainFlags().houseBrickUnlocked) {
            travelWithSteps(hasItem("bakedPotato") ? "trueEnd" : "end");
            return;
          }
          updateMessage("レンガの家がある。ドアには鍵がかかっている。");
        }),
        description: 'レンガの家',
        zIndex: 5,
        usable: () => true,
        item: { img: 'houseBrick', visible: () => true },
      },
      {
        x: 38.9, y: 70.4, width: 17.8, height: 17.8,
        onClick: clickWrap(function () {
          showObj(null, 'レンガの家立札', IMAGES.items.signBrick, '立札を調べた。');
        }),
        description: 'レンガの家立札',
        zIndex: 6,
        usable: () => true,
        item: { img: 'signBrick', visible: () => true }
      },
      {
        x: 63.4, y: 73.6, width: 23.2, height: 23.2,
        onClick: clickWrap(function () {
          placeBearOnStep("putBearOnStepBrick");
        }),
        description: '台',
        zIndex: 5,
        usable: () => true,
        item: { img: 'step', visible: () => true }
      },
      {
        x: 63.4, y: 59.4, width: 23.0, height: 23.0,
        onClick: clickWrap(function () {
          takeBearFromStep("putBearOnStepBrick");
        }),
        description: '台に乗るクマ妖精',
        zIndex: 6,
        usable: () => getMainFlags().putBearOnStepBrick,
        item: { img: 'bearWithCapSide', visible: () => getMainFlags().putBearOnStepBrick }
      },
      {
        x: 10.1, y: 35.7, width: 9.8, height: 8.9,
        onClick: clickWrap(function () {

        }),
        description: '煙突上端',
        zIndex: 5,
        usable: () => false,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
    ],
  },
  storage: {
    name: "倉庫",
    description: "",
    clickableAreas: [
      // ここに調べる場所やアイテムなどを追加
      {
        x: 59.5, y: 44.0, width: 39.4, height: 39.4,
        onClick: clickWrap(function () {
          if (getMainFlags().storageUnlocked) {
            changeRoom("storageInner");
          } else {
            showStoragePuzzle();
          }
        }),
        description: '物置',
        zIndex: 5,
        usable: () => true,
        item: { img: 'storage', visible: () => true }
      },
      {
        x: 5.4, y: 50.0, width: 46.4, height: 40.1,
        onClick: clickWrap(function () {
          if (getMainFlags().gotSusuki) {
            updateMessage("すすきが生えている。");
            return;
          }
          if (gameState.selectedItem === "scissors" && hasItem("scissors")) {
            removeItem("scissors");
            playSE("se-hasami");
            acquireItemOnce("gotSusuki", "susuki", "すすき", IMAGES.items.susuki, "ハサミですすきを切り取った。すすきを手に入れた。");
            markProgress("susuki_cut");
            return;
          }
          updateMessage("すすきが生えている。");
        }),
        description: '生えているすすき',
        zIndex: 5,
        usable: () => true,
        item: { img: 'susukiDisp', visible: () => true }
      },
    ],
  },
  bonfire: {
    name: "たき火",
    description: "",
    clickableAreas: [
      // ここに調べる場所やアイテムなどを追加
      {
        x: 65.5, y: 58.3, width: 8.3, height: 8.3,
        onClick: clickWrap(function () {
          changeRoom("shrineZoom");
        }),
        description: 'ほこら',
        zIndex: 5,
        usable: () => getMainFlags().gotBear,
        item: { img: 'shrine', visible: () => true }
      },
      {
        x: 52.4, y: 62.9, width: 19.2, height: 19.2,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "cap" && hasItem("cap")) {
            removeItem("cap");
            getMainFlags().gotBear = true;
            addItem("bearWithCap");
            markProgress("bear_received_cap");
            const message = "「わあ、ありがとう！これで一緒に行けるよ」";
            const subMessage = "クマ妖精に暖かそうなニット帽を渡した。";
            const content = `
              <div class="modal-anim">
                <img src="${IMAGES.modals.bearReceiveCap}" alt="ニット帽を受け取るクマ妖精">
                <img src="${IMAGES.modals.bearWalking}" alt="一緒に歩くクマ妖精">
              </div>
              <p style="text-align:center;">${subMessage}</p>
            `;
            showModal(message, content, [{ text: "閉じる", action: "close" }]);
            updateMessage(subMessage);
            renderCanvasRoom();
            return;
          }
          playSE("se-sneeze");
          showObj(null, '「寒いね…ここから動けないよ」', IMAGES.modals.bearSneeze, 'クマ妖精は、焚火のそばから動けないようだ。');
        }),
        description: '焚火に当たるクマ妖精',
        zIndex: 5,
        usable: () => !getMainFlags().gotBear,
        item: { img: 'bearFleeze', visible: () => !getMainFlags().gotBear }
      },
      {
        x: 31.0, y: 62.7, width: 38.1, height: 36.4,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "match" && hasItem("match") && getMainFlags().bonfireExtinguished) {
            getMainFlags().bonfireExtinguished = false;
            playSE("se-match");
            updateMessage("超強力マッチでたき火に再び火をつけた。");
            markProgress("bonfire_relit");
            renderCanvasRoom();
            return;
          }
          if (gameState.selectedItem === "potato" && hasItem("potato")) {
            if (getMainFlags().bonfireExtinguished) {
              updateMessage("たき火が消えているので、さつまいもを焼けない。");
              return;
            }
            removeItem("potato");
            addItem("bakedPotato");
            showObj(null, "さつまいもを焼いた", IMAGES.modals.bakingPotato, "さつまいもを焼いて、焼き芋を手に入れた。");
            markProgress("potato_baked");
            return;
          }
          if (gameState.selectedItem === "bearWithCap") {
            showObj(null, "「ポカポカ…」", IMAGES.modals.bearFire, "クマ妖精は、焚火で温まっている。");
            return;
          }
          if (gameState.selectedItem === "candle" && hasItem("candle")) {
            if (getMainFlags().bonfireExtinguished) {
              updateMessage("たき火が消えているので、火をつけられない。");
              return;
            }
            removeItem("candle");
            addItem("candleOn");
            showObj(null, "ろうそくに火をつけた。", IMAGES.modals.candleOn, "たき火でろうそくに火をつけた。");
            markProgress("candle_lit");
            return;
          }
          if (gameState.selectedItem === "waterGun" && hasItem("waterGun") && !getMainFlags().bonfireExtinguished) {
            const power = getWaterGunPower();
            if (power === 1 || power === 2) showBonfireWaterGunEvent();
            else if (power === 3) {
              getMainFlags().bonfireExtinguished = true;
              playSE("se-gril");
              showObj(null, "たき火を消した。", IMAGES.modals.extinguishFire, "水鉄砲でたき火を消した。");
              markProgress("bonfire_extinguished");
              renderCanvasRoom();
            }
          } else {
            updateMessage(getMainFlags().bonfireExtinguished ? "たき火は消えている。" : "たき火が燃えている。");
          }
        }),
        description: 'たき火',
        zIndex: 5,
        usable: () => true,
        item: { img: () => !getMainFlags().bonfireExtinguished ? 'bonfire' : 'bonfireAfter', visible: () => true },
      },
      {
        x: 45.4, y: 84.7, width: 9.9, height: 8.3,
        onClick: clickWrap(function () {
          acquireItemOnce("gotKeyFromBonfire", "key", "鍵", IMAGES.items.key, "たき火のそばから鍵を手に入れた。");
        }),
        description: '鍵',
        zIndex: 6,
        usable: () => getMainFlags().bonfireExtinguished && !getMainFlags().gotKeyFromBonfire,
        item: { img: 'key', visible: () => getMainFlags().bonfireExtinguished && !getMainFlags().gotKeyFromBonfire }
      },
      {
        x: 7.8, y: 83.5, width: 12.0, height: 11.2,
        onClick: clickWrap(function () {
          if (!getMainFlags().bonfireExtinguished || !getMainFlags().gotPotato || getMainFlags().gotMatch) return;
          if (gameState.inventory.length >= 14) {
            updateMessage("アイテム欄がいっぱいだ。どこかで減らしてこよう");
            return;
          }
          acquireItemOnce("gotMatch", "match", "超強力マッチ", IMAGES.items.match, "超強力マッチを手に入れた。");
        }),
        description: '落ちている超強力マッチ',
        zIndex: 5,
        usable: () => getMainFlags().bonfireExtinguished && getMainFlags().gotPotato && !getMainFlags().gotMatch,
        item: { img: 'match', visible: () => getMainFlags().bonfireExtinguished && getMainFlags().gotPotato && !getMainFlags().gotMatch }
      },



    ],
  },
  storageInner: {
    name: "倉庫の中",
    description: "",
    clickableAreas: [
      {
        x: 14.1, y: 16.2, width: 11.8, height: 11.8,
        onClick: clickWrap(function () {
          acquireItemOnce("gotOperaGlass", "operaGlass", "双眼鏡", IMAGES.items.operaGlass, "双眼鏡を手に入れた。");
        }),
        description: '双眼鏡',
        zIndex: 5,
        usable: () => true,
        item: { img: 'operaGlass', visible: () => !getMainFlags().gotOperaGlass }
      },
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '電卓が付いた木箱のふた',
        zIndex: 5,
        usable: () => false,
        item: { img: 'boxCalcLid', visible: () => !getMainFlags().boxCalcUnlocked }
      },
      {
        x: 34.5, y: 29.8, width: 19.5, height: 17.5,
        onClick: clickWrap(function () {
          if (getMainFlags().boxCalcUnlocked) {
            if (getMainFlags().gotCalcGem) {
              showCalcBoxPuzzle();
              return;
            }
            if (!getMainFlags().gotCalcGem && gameState.inventory.length >= 14) {
              updateMessage("アイテム欄がいっぱいだ。");
              return;
            }
            acquireItemOnce("gotCalcGem", "gem", "宝珠", IMAGES.items.gem, "木箱から宝珠を手に入れた。");
          } else {
            showCalcBoxPuzzle();
          }
        }),
        description: '電卓が付いた木箱',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 54.4, y: 28.2, width: 18.8, height: 18.6,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "bearWithCap" && hasItem("bearWithCap")) {
            showObj(null, "おやつの時間まで、あと何分だろう…", IMAGES.modals.bearWatchClock, "クマ妖精がアナログ時計を眺めている。");
            return;
          }
          showObj(null, "アナログ時計", IMAGES.modals.clock, "アナログ時計を調べた。");
        }),
        description: 'アナログ時計',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 73.8, y: 28.6, width: 18.1, height: 18.4,
        onClick: clickWrap(function () {
          showSafeClockPuzzle();
        }),
        description: '金庫',
        zIndex: 5,
        usable: () => !getMainFlags().safeOpened,
        item: { img: 'safeClose', visible: () => !getMainFlags().safeOpened }
      },
      {
        x: 73.8, y: 28.6, width: 18.1, height: 18.4,
        onClick: clickWrap(function () {

        }),
        description: '金庫開いた後',
        zIndex: 5,
        usable: () => getMainFlags().safeOpened,
        item: { img: 'safeOpen', visible: () => getMainFlags().safeOpened }
      },
      {
        x: 75.3, y: 31.2, width: 14.5, height: 14.6,
        onClick: clickWrap(function () {
          acquireItemOnce("gotPotato", "potato", "さつまいも", IMAGES.items.potato, "さつまいもを手に入れた。");
        }),
        description: 'さつまいも',
        zIndex: 6,
        usable: () => getMainFlags().safeOpened && !getMainFlags().gotPotato,
        item: { img: 'potato', visible: () => getMainFlags().safeOpened && !getMainFlags().gotPotato }
      },
      {
        x: 16.7, y: 66.1, width: 22.2, height: 22.2,
        onClick: clickWrap(function () {
          showCapBoxPuzzle();
        }),
        description: '帽子入り木箱',
        zIndex: 5,
        usable: () => !gameState.main.flags.boxOpened,
        item: { img: 'boxCap', visible: () => !gameState.main.flags.boxOpened }
      },
      {
        x: 16.7, y: 62.1, width: 22.2, height: 22.2,
        onClick: clickWrap(function () {
          acquireItemOnce("gotCap", "cap", "暖かそうなニット帽", IMAGES.items.cap, "暖かそうなニット帽を手に入れた。");
        }),
        description: '帽子入り木箱開いた状態',
        zIndex: 5,
        usable: () => gameState.main.flags.boxOpened,
        item: { img: 'boxCapOpended', visible: () => gameState.main.flags.boxOpened }
      },
      {
        x: 65.6, y: 64.6, width: 24.9, height: 20.7,
        onClick: clickWrap(function () {
          showRedToolboxPuzzle();
        }),
        description: '赤い工具箱',
        zIndex: 5,
        usable: () => !getMainFlags().boxRedUnlocked,
        item: { img: 'boxRed', visible: () => !getMainFlags().boxRedUnlocked }
      },
      {
        x: 65.6, y: 64.6, width: 24.9, height: 20.7,
        onClick: clickWrap(function () {
          acquireItemOnce("gotScissors", "scissors", "ハサミ", IMAGES.items.scissors, "ハサミを手に入れた。");
        }),
        description: '赤い工具箱アンロック後',
        zIndex: 5,
        usable: () => getMainFlags().boxRedUnlocked,
        item: { img: 'boxRedOpened', visible: () => getMainFlags().boxRedUnlocked }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("storage"), { allowAtNight: true }),
        description: "倉庫へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },

      // ここに調べる場所やアイテムなどを追加
    ],
  },
  shrineZoom: {
    name: "祠",
    description: "",
    clickableAreas: [
      {
        x: 0, y: 0, width: 100, height: 100,
        onClick: clickWrap(function () {

        }),
        description: '水鉄砲表示',
        zIndex: 0,
        usable: () => false,
        item: { img: 'waterGunDisp', visible: () => !getMainFlags().gotWaterGun }
      },
      {
        x: 29.2, y: 60.5, width: 9.1, height: 19.6,
        onClick: clickWrap(function () {
          acquireItemOnce("gotWaterGun", "waterGun", "水鉄砲がある", IMAGES.items.waterGun, "水鉄砲を手に入れた。");
        }),
        description: '水鉄砲クリック部',
        zIndex: 5,
        usable: () => !getMainFlags().gotWaterGun,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 35.4, y: 37.6, width: 29.7, height: 42.6,
        onClick: clickWrap(function () {
          if (gameState.shrineZoom.flags.candlePlaced) changeRoom("shrineTablet");
          else updateMessage("石板があるが、暗くてよく見えない");
        }),
        description: '石板',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 70.2, y: 67.8, width: 8.4, height: 18.7,
        onClick: clickWrap(function () {
          if (gameState.shrineZoom.flags.candlePlaced) {
            updateMessage("火のついたろうそくが置かれている。");
            return;
          }
          if (gameState.selectedItem === "candleOn" && hasItem("candleOn")) {
            removeItem("candleOn");
            gameState.shrineZoom.flags.candlePlaced = true;
            markProgress("shrine_candle_placed");
            updateMessage("ろうそく立てに火のついたろうそくを置いた。祠が明るくなった。");
            renderCanvasRoom();
            return;
          }
          updateMessage("ろうそく立てがある。");
        }),
        description: 'ろうそく立て',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 65.5, y: 52.1, width: 18.3, height: 16.6,
        onClick: clickWrap(function () {

        }),
        description: 'ろうそく表示部',
        zIndex: 5,
        usable: () => false,
        item: { img: 'candleOn', visible: () => gameState.shrineZoom.flags.candlePlaced }
      },
      {
        x: 91, y: 91, width: 9, height: 9,
        onClick: clickWrap(() => changeRoom("bonfire"), { allowAtNight: true }),
        description: "たき火へ戻る",
        zIndex: 10,
        item: { img: "back", visible: () => true },
      },
      // ここに調べる場所やアイテムなどを追加
    ],
  },
  end: {
    name: "ノーマルエンド",
    description: "寒い草原から、暖かいレンガの家にたどり着きました。脱出おめでとうございます！",
    clickableAreas: [
      {
        x: 6.4, y: 37.1, width: 37.1, height: 22.9,
        onClick: clickWrap(function () {
          updateMessage("（お家を壊して、ごめんね）");
        }),
        description: '赤と青の子豚',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 49.4, y: 31.3, width: 45.4, height: 29.0,
        onClick: clickWrap(function () {
          if (gameState.selectedItem === "potato") {
            removeItem("potato");
            showObj(null, "「あとで焼こうね」", IMAGES.modals.potatoNobake, "焼いていないさつまいもを手土産に差し出した。");
            return;
          }
          updateMessage("黄色い子ブタとクマ妖精は、お茶を飲んでいる");
        }),
        description: '黄色の子豚とクマ妖精',
        zIndex: 5,
        usable: () => true,
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
    name: "トゥルーエンド",
    description: "焼き芋を手土産にしたので、子豚たちも機嫌を直しました。脱出おめでとうございます！",
    clickableAreas: [
      {
        x: 2.1, y: 34.5, width: 64.0, height: 24.2,
        onClick: clickWrap(function () {
          showObj(null, '「わーい！」', IMAGES.modals.pigs, '子豚たちが、嬉しそうに焼き芋を食べている。');
        }),
        description: '子豚たち',
        zIndex: 5,
        usable: () => true,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 68.6, y: 24.6, width: 27.7, height: 29.4,
        onClick: clickWrap(function () {
          updateMessage("クマ妖精は、嬉しそうだ。");
        }),
        description: '焼き芋に喜ぶクマ妖精',
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 0,
        item: { img: 'IMAGE_KEY', visible: () => true }
      },
      {
        x: 69.7, y: 27.8, width: 25.8, height: 22.1,
        onClick: clickWrap(function () {
          showObj(null, '「美味しい！」', IMAGES.modals.bearEating, 'クマ妖精は、焼き芋にバターを塗っている。');
        }),
        description: 'バターを塗るクマ妖精',
        zIndex: 5,
        usable: () => gameState.trueEnd.flags.backgroundState == 1,
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

let endingTravelActive = false;
function travelWithSteps(destRoom, { soundId = "se-ashioto", transitionDelay = 480 } = {}) {
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
    if (gameState === state) changeRoom(destRoom, { fromTravel: true });
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
    end: { title: "🐷 NORMAL END", desc: rooms.end.description, secretText: "🐷 脱出おめでとうございます" },
    trueEnd: { title: "🍠 TRUE END", desc: rooms.trueEnd.description, secretText: "💐 長い道のり、遊んでくれてありがとうございました" },
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
  const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc9n1qenCU8e5mzmCv9aQUtyWaYMWN7YFi7SJ0hpjz2RHtBhQ/viewform";
  const endingLabel = { end: "ノーマルエンド", trueEnd: "トゥルーエンド" }[endingId] || "エンド";
  const params = new URLSearchParams({ "entry.666725843": endingLabel });
  window.open(`${FEEDBACK_URL}?${params.toString()}`, "_blank", "noopener");
}

rooms.shrineZoom.clickableAreas.push({
  x: 0, y: 91, width: 9, height: 9, zIndex: 10,
  onClick: clickWrap(() => changeRoom("shrineLeft"), { allowAtNight: true }),
  description: "祠の左側へ",
  usable: () => gameState.shrineZoom.flags.candlePlaced,
  item: { img: "arrowLeft", visible: () => gameState.shrineZoom.flags.candlePlaced },
});
rooms.shrineLeft = {
  name: "祠の左側", description: "",
  clickableAreas: [
    {
      x: 33.5, y: 69.9, width: 34.3, height: 11.5,
      onClick: clickWrap(function () {
        if (gameState.selectedItem === "bearWithCap" && hasItem("bearWithCap")) {
          showObj(null, "反対から読んでも読める文字もあるんだねえ", IMAGES.modals.bearThinking, "クマ妖精が石板の文字を眺めている。");
          return;
        }
        showStringTablet();
      }, { allowAtNight: true }),
      description: '文字が書かれた石板',
      zIndex: 5,
      usable: () => true,
      item: { img: 'IMAGE_KEY', visible: () => true }
    },
    {
      x: 91, y: 91, width: 9, height: 9, zIndex: 10,
      onClick: clickWrap(() => changeRoom("shrineZoom"), { allowAtNight: true }),
      description: "祠へ戻る",
      item: { img: "arrowRight", visible: () => true },
    },
  ],
};
rooms.shrineTablet = {
  name: "謎の石板", description: "なにか嵌め込めそうなくぼみがある。",
  clickableAreas: [
    {
      x: 91, y: 91, width: 9, height: 9, zIndex: 10,
      onClick: clickWrap(() => changeRoom("shrineZoom"), { allowAtNight: true }),
      description: "祠へ戻る", item: { img: "back", visible: () => true }
    },
  ],
};
for (const [kind, x] of [["wind", 27.9], ["water", 60.8]]) {
  for (const [index, y] of [22, 37.3].entries()) {
    rooms.shrineTablet.clickableAreas.push({
      x, y, width: 12, height: 12, zIndex: 5,
      description: (kind === "wind" ? "風" : "水") + "の宝珠のくぼみ" + (index + 1),
      onClick: clickWrap(() => toggleTabletGem(kind, index), { allowAtNight: true }),
    });
  }
  rooms.shrineTablet.clickableAreas.push({
    x, y: 52.2, width: 12, height: 12, zIndex: 5,
    description: "固定された宝珠",
    onClick: clickWrap(() => updateMessage("石板に固定されているようだ。"), { allowAtNight: true }),
  });
}

function showSafeClockPuzzle() {
  const digits = [0, 0, 0];
  showModal("金庫の時刻ロック", `
    <div class="safe-clock-display notranslate" translate="no">
      <button type="button" data-safe-digit="0" aria-label="時">0</button>
      <span>:</span>
      <button type="button" data-safe-digit="1" aria-label="分の十の位">0</button>
      <button type="button" data-safe-digit="2" aria-label="分の一の位">0</button>
    </div>
    <p id="safeClockFeedback" aria-live="polite" style="min-height:1.5em;"></p>
  `, [
    {
      text: "OK",
      action: () => {
        if (digits.join("") !== "314") {
          document.getElementById("safeClockFeedback").textContent = "開かない。";
          playSE("se-error");
          return;
        }
        getMainFlags().safeOpened = true;
        markProgress("safe_unlocked");
        playSE("se-gacha");
        closeModal();
        updateMessage("金庫の鍵が開いた。");
        renderCanvasRoom();
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  document.querySelectorAll("#modalContent [data-safe-digit]").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.safeDigit);
      digits[index] = (digits[index] + 1) % (index === 1 ? 6 : 10);
      button.textContent = digits[index];
      document.getElementById("safeClockFeedback").textContent = "";
      playSE("se-click");
    });
  });
}

function calculateBoxExpression(expression) {
  if (!/^\d+(?:[+−×÷]\d+)*$/.test(expression)) return null;
  const tokens = expression.match(/\d+|[+−×÷]/g);
  let total = 0;
  let term = Number(tokens[0]);
  let sign = 1;
  for (let i = 1; i < tokens.length; i += 2) {
    const value = Number(tokens[i + 1]);
    if (tokens[i] === "×") term *= value;
    else if (tokens[i] === "÷") {
      if (value === 0) return null;
      term /= value;
    } else {
      total += sign * term;
      term = value;
      sign = tokens[i] === "+" ? 1 : -1;
    }
  }
  const result = total + sign * term;
  return Number.isFinite(result) ? result : null;
}

function showCalcBoxPuzzle() {
  const unlocked = !!getMainFlags().boxCalcUnlocked;
  let expression = unlocked ? "8+8×8" : "";
  let entered = false;
  const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", "+", "Enter"];
  showModal("電卓が付いた木箱", `
    <div class="box-calculator${unlocked ? " box-calculator-unlocked" : ""}" translate="no">
      <div class="box-calculator-display notranslate">
        <div id="boxCalcInput" aria-label="入力式" aria-live="polite">${expression || "0"}</div>
        <div id="boxCalcResult" aria-label="計算結果" aria-live="polite">${unlocked ? "72" : "&nbsp;"}</div>
      </div>
      <div class="box-calculator-keys">
        ${keys.map(key => `<button type="button" data-calc-key="${key}"${unlocked ? " disabled" : ""}${key === "Enter" ? ' class="box-calculator-enter"' : ''}>${key}</button>`).join("")}
      </div>
      <p id="boxCalcFeedback" aria-live="polite"></p>
    </div>
  `, [{ text: "閉じる", action: "close" }]);
  document.querySelectorAll("#modalContent [data-calc-key]").forEach(button => {
    button.addEventListener("click", () => {
      if (getMainFlags().boxCalcUnlocked) return;
      const key = button.dataset.calcKey;
      if (key === "Enter") {
        const result = calculateBoxExpression(expression);
        document.getElementById("boxCalcResult").textContent = result === null ? "Error" : String(result);
        entered = true;
        if (expression === "8+8×8") {
          getMainFlags().boxCalcUnlocked = true;
          document.querySelector("#modalContent .box-calculator").classList.add("box-calculator-unlocked");
          playSE("se-idea");
          markProgress("calc_box_unlocked");
          document.getElementById("boxCalcFeedback").textContent = "木箱の鍵が開いた。";
          document.querySelectorAll("#modalContent [data-calc-key]").forEach(keyButton => keyButton.disabled = true);
          updateMessage("電卓が付いた木箱の鍵が開いた。");
          renderCanvasRoom();
        } else {
          document.getElementById("boxCalcFeedback").textContent = "開かない。";
        }
        return;
      }
      if (entered) {
        expression = "";
        entered = false;
        document.getElementById("boxCalcResult").textContent = "";
        document.getElementById("boxCalcFeedback").textContent = "";
      }
      if (expression.length >= 40) return;
      expression += key;
      document.getElementById("boxCalcInput").textContent = expression;
    });
  });
}

function showStringTablet() {
  const letters = ["火", "8", "K", "十", "3", "8", "月", "X", "F", "山", "8", "R"];
  const rotated = letters.map(() => false);
  showModal("文字が書かれた石板", `
    <div class="string-tablet-scroll" translate="no">
      <canvas id="stringTabletCanvas" class="notranslate" translate="no" width="1024" height="1024" aria-label="石板の文字。文字をクリックすると180度回転します。"></canvas>
    </div>
  `, [{ text: "閉じる", action: "close" }], null, { contentClass: "string-tablet-modal" });
  const tablet = document.getElementById("stringTabletCanvas");
  const ctx = tablet.getContext("2d");
  const image = new Image();
  const left = 90;
  const cellWidth = 70;
  const centerY = 510;
  const draw = () => {
    if (!tablet.isConnected) return;
    ctx.clearRect(0, 0, tablet.width, tablet.height);
    if (image.complete && image.naturalWidth > 0) ctx.drawImage(image, 0, 0, 1024, 1024);
    letters.forEach((letter, index) => {
      ctx.save();
      ctx.translate(left + (index + 0.5) * cellWidth, centerY);
      if (rotated[index]) ctx.rotate(Math.PI);
      ctx.font = '400 52px "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", "Noto Serif JP", serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#202020";
      ctx.fillText(letter, 0, 0);
      ctx.restore();
    });
  };
  const hitIndex = event => {
    const rect = tablet.getBoundingClientRect();
    const x = (event.clientX - rect.left) * tablet.width / rect.width;
    const y = (event.clientY - rect.top) * tablet.height / rect.height;
    const index = Math.floor((x - left) / cellWidth);
    return index >= 0 && index < letters.length && Math.abs(y - centerY) <= 55 ? index : -1;
  };
  tablet.addEventListener("click", event => {
    const index = hitIndex(event);
    if (index < 0) return;
    rotated[index] = !rotated[index];
    draw();
  });
  tablet.addEventListener("mousemove", event => {
    tablet.style.cursor = hitIndex(event) >= 0 ? "pointer" : "default";
  });
  image.onload = draw;
  image.src = IMAGES.modals.stoneTabletString;
  draw();
}

function getTabletSlots(kind) {
  gameState.shrineTablet ??= { flags: {} };
  const flags = gameState.shrineTablet.flags;
  if (!Array.isArray(flags[kind])) {
    // 旧セーブのパワーも、宝珠の配置に引き継ぐ。
    const power = gameState[kind === "wind" ? "windPower" : "waterGunPower"];
    flags[kind] = [power >= 2, power >= 3];
  }
  return flags[kind];
}

function toggleTabletGem(kind, index) {
  const slots = getTabletSlots(kind);
  if (slots[index]) {
    if (gameState.inventory.length >= 14) {
      updateMessage("アイテム欄がいっぱいで宝珠を取り外せない。");
      return;
    }
    slots[index] = false;
    addItem("gem");
    playSE("se-powerdown");
  } else {
    if (gameState.selectedItem !== "gem" || !hasItem("gem")) {
      updateMessage("くぼみがある。");
      return;
    }
    removeItem("gem");
    slots[index] = true;
    playSE("se-powerup");
  }
  gameState.windPower = 1 + getTabletSlots("wind").filter(Boolean).length;
  gameState.waterGunPower = 1 + getTabletSlots("water").filter(Boolean).length;
  updateMessage(slots[index] ? "宝珠を嵌めた。" : "宝珠を外した。");
  renderCanvasRoom();
}

function drawTabletPower(ctx, canvas) {
  for (const [kind, x, color] of [["wind", 0.339, "#a6ffd5"], ["water", 0.668, "#8cddff"]]) {
    const slots = getTabletSlots(kind);
    const power = 1 + slots.filter(Boolean).length;
    const centerX = x * canvas.width;
    const centerY = canvas.height * 0.82;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const radius = canvas.width * 0.20;
    const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    glow.addColorStop(0, color);
    glow.addColorStop(1, "transparent");
    ctx.globalAlpha = [0, 0.12, 0.32, 0.58][power];
    ctx.fillStyle = glow;
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();
    const gem = loadedImages[IMAGES.items.gem];
    if (!gem || !gem.complete || !gem.naturalWidth) continue;
    slots.forEach((filled, index) => {
      if (!filled) return;
      const size = canvas.width * 0.12;
      const y = canvas.height * [0.22, 0.373][index];
      ctx.save();
      // 宝珠の外側を切り抜き、画像の四隅が石板に重ならないようにする。
      ctx.beginPath();
      ctx.ellipse(centerX, y + canvas.height * 0.06, size / 2, canvas.height * 0.06, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(gem, centerX - size / 2, y, size, canvas.height * 0.12);
      ctx.restore();
    });
  }
}

// 左矢印でこの順に巡回し、右矢印で逆順に戻る。
const OUTDOOR_ROOM_IDS = ["houseWara", "houseWood", "houseBrick", "storage", "bonfire"];
OUTDOOR_ROOM_IDS.forEach((roomId, index) => {
  const leftRoom = OUTDOOR_ROOM_IDS[(index + 1) % OUTDOOR_ROOM_IDS.length];
  const rightRoom = OUTDOOR_ROOM_IDS[(index + OUTDOOR_ROOM_IDS.length - 1) % OUTDOOR_ROOM_IDS.length];
  rooms[roomId].clickableAreas.push(
    {
      x: 0, y: 91, width: 9, height: 9,
      onClick: clickWrap(() => changeRoom(leftRoom), { allowAtNight: true }),
      description: leftRoom + "へ",
      zIndex: 10,
      item: { img: "arrowLeft", visible: () => true },
    },
    {
      x: 91, y: 91, width: 9, height: 9,
      onClick: clickWrap(() => changeRoom(rightRoom), { allowAtNight: true }),
      description: rightRoom + "へ",
      zIndex: 10,
      item: { img: "arrowRight", visible: () => true },
    },
  );
});

// 赤・青・黄の順に記号を切り替える倉庫の鍵。
function showCapBoxPuzzle() {
  let sequence = [];
  const content = `
    <div class="cap-box-buttons">
      <button type="button" class="cap-box-direction" data-direction="←" aria-label="左">←</button>
      <button type="button" class="cap-box-direction" data-direction="→" aria-label="右">→</button>
    </div>
    <p id="capBoxSequence" aria-live="polite" style="min-height:1.5em;text-align:center;"></p>
    <p id="capBoxFeedback" aria-live="polite" style="min-height:1.5em;text-align:center;"></p>
  `;
  showModal("木箱のロック", content, [
    {
      text: "OK",
      action: () => {
        if (sequence.join("") !== "→←←→→") {
          sequence = [];
          document.getElementById("capBoxSequence").textContent = "";
          document.getElementById("capBoxFeedback").textContent = "開かない。";
          playSE("se-error");
          return;
        }
        getMainFlags().boxOpened = true;
        markProgress("cap_box_unlocked");
        playSE("se-gacha");
        closeModal();
        updateMessage("木箱の鍵が開いた。");
        renderCanvasRoom();
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  document.querySelectorAll("#modalContent .cap-box-direction").forEach(button => {
    button.addEventListener("click", () => {
      sequence.push(button.dataset.direction);
      document.getElementById("capBoxSequence").textContent = sequence.join("");
      document.getElementById("capBoxFeedback").textContent = "";
      playSE("se-click");
    });
  });
}

function showRedToolboxPuzzle() {
  const digits = [0, 0, 0];
  const content = `
    <div style="display:flex;justify-content:center;gap:12px;margin:24px 0;">
      ${digits.map((digit, index) => `<button type="button" class="red-toolbox-digit" data-index="${index}" aria-label="${index + 1}桁目" style="width:64px;height:80px;font-size:36px;background:#dff4fc;color:#243746;border:2px solid #8fbacb;border-radius:8px;">${digit}</button>`).join("")}
    </div>
    <p id="redToolboxFeedback" aria-live="polite" style="text-align:center;min-height:1.5em;"></p>
  `;
  showModal("赤い工具箱のロック", content, [
    {
      text: "OK",
      action: () => {
        if (digits.join("") !== "534") {
          document.getElementById("redToolboxFeedback").textContent = "開かない。";
          playSE("se-error");
          return;
        }
        getMainFlags().boxRedUnlocked = true;
        markProgress("red_toolbox_unlocked");
        playSE("se-gacha");
        closeModal();
        updateMessage("赤い工具箱の鍵が開いた。");
        renderCanvasRoom();
      },
    },
    { text: "閉じる", action: "close" },
  ], null, { contentClass: "red-toolbox-modal" });
  document.querySelectorAll("#modalContent .red-toolbox-digit").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      digits[index] = (digits[index] + 1) % 10;
      button.textContent = digits[index];
      document.getElementById("redToolboxFeedback").textContent = "";
      playSE("se-click");
    });
  });
}

function getWaterGunPower() {
  return [1, 2, 3].includes(gameState.waterGunPower) ? gameState.waterGunPower : 1;
}

function showBonfireWaterGunEvent() {
  if (![1, 2].includes(getWaterGunPower())) return;
  // 開くたびに最初の5個から再生する。セーブ状態には含めない。
  const sparkCounts = [5, 3, 4];
  let shotIndex = 0;
  let firing = false;
  const content = `
    <div class="bonfire-water-scene">
      <img class="bonfire-water-fire" src="${IMAGES.items.bonfire}" alt="たき火">
      <div class="bonfire-water-sparks" aria-hidden="true"></div>
    </div>
  `;
  showModal("たき火に水鉄砲を打つ", content, [
    {
      text: "水鉄砲",
      img: IMAGES.items.waterGun,
      action: async () => {
        if (firing) return;
        const count = sparkCounts[shotIndex++] || 0;
        playSE("se-water");
        if (!count) return;
        firing = true;
        const button = document.querySelector("#modalButtons button");
        const layer = document.querySelector("#modalContent .bonfire-water-sparks");
        button.disabled = true;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const animations = [];
        for (let index = 0; index < count; index++) {
          const spark = document.createElement("span");
          spark.className = "bonfire-water-spark";
          layer.appendChild(spark);
          const angle = Math.PI + (index + 0.5) * Math.PI / count;
          const dx = Math.cos(angle) * layer.clientWidth * 0.38;
          const dy = Math.sin(angle) * layer.clientHeight * 0.45;
          const target = "translate(" + dx + "px," + dy + "px)";
          const animation = spark.animate(reducedMotion ? [
            { transform: target, opacity: 1 },
            { transform: target, opacity: 1 },
            { transform: target, opacity: 0 },
          ] : [
            { transform: "translate(0,0)", opacity: 1 },
            { transform: target, opacity: 1, offset: 0.7 },
            { transform: "translate(" + dx + "px," + (dy + 20) + "px)", opacity: 0 },
          ], { duration: 1000, easing: "ease-out", fill: "forwards" });
          animations.push(animation.finished.catch(() => { }).then(() => spark.remove()));
        }
        await Promise.all(animations);
        firing = false;
        if (button.isConnected) button.disabled = false;
      },
    },
    { text: "閉じる", action: "close" },
  ], null, { contentClass: "bonfire-water-modal" });
}

function showStoragePuzzle() {
  const symbols = ["◆", "■", "●", "▲"];
  const selected = [-1, -1, -1];
  const colors = ["赤", "青", "黄"];
  const content = `
    <div class="storage-symbol-row">
      ${colors.map((color, index) => '<button type="button" class="storage-symbol storage-symbol-' + index + '" data-symbol-index="' + index + '" aria-label="' + color + 'の記号：未選択"></button>').join("")}
    </div>
    <p id="storagePuzzleFeedback" aria-live="polite" style="min-height:1.5em;text-align:center;"></p>
  `;
  showModal("物置の鍵", content, [
    {
      text: "OK",
      action: () => {
        if (selected.map(index => symbols[index]).join("") !== "●■▲") {
          document.getElementById("storagePuzzleFeedback").textContent = "開かない。";
          playSE("se-error");
          return;
        }
        getMainFlags().storageUnlocked = true;
        markProgress("storage_unlocked");
        playSE("se-open");
        closeModal();
        updateMessage("物置の鍵が開いた。");
        renderCanvasRoom();
      },
    },
    { text: "閉じる", action: "close" },
  ]);
  document.querySelectorAll("#modalContent .storage-symbol").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.symbolIndex);
      selected[index] = (selected[index] + 1) % symbols.length;
      button.textContent = symbols[selected[index]];
      button.setAttribute("aria-label", colors[index] + "の記号：" + button.textContent);
      document.getElementById("storagePuzzleFeedback").textContent = "";
      playSE("se-click");
    });
  });
}

const SNEEZE_ROOMS = {
  houseWara: { bearFlag: "putBearOnStepWara", brokenFlag: "houseWaraBroken", power: 1, pig: "iconPigWara" },
  houseWood: { bearFlag: "putBearOnStepWood", brokenFlag: "houseWoodBroken", power: 2, pig: "iconPigWood" },
  houseBrick: { bearFlag: "putBearOnStepBrick", brokenFlag: "houseBrickBroken", power: 3 },
};

// 木の家の破壊後も、わらの家と同じ位置に残骸を表示する。
rooms.houseWood.clickableAreas.push({
  x: 8.2, y: 45.8, width: 38.7, height: 38.7,
  onClick: clickWrap(function () {
    if (gameState.selectedItem === "bearWithCap" && hasItem("bearWithCap")) {
      showObj(null, "ええー！お家が壊れてる！", IMAGES.modals.bearShockedWood, "木の家の残骸がある");
      return;
    }
    updateMessage("木の家の残骸がある");
  }),
  description: "木の家破壊後",
  zIndex: 5, usable: () => getMainFlags().houseWoodBroken,
  item: { img: "houseWoodBroken", visible: () => getMainFlags().houseWoodBroken },
});

function getWindPower() {
  return [1, 2, 3].includes(gameState.windPower) ? gameState.windPower : 1;
}

function showBearSneezeEvent(roomId) {
  const config = SNEEZE_ROOMS[roomId];
  const flags = getMainFlags();
  if (!config || !flags[config.bearFlag] || gameState.selectedItem !== "susuki" || !hasItem("susuki")) return false;
  if (flags[config.brokenFlag]) {
    updateMessage("無駄に、クマ妖精のくしゃみを誘発させるのはやめよう");
    return true;
  }
  const power = getWindPower();
  const state = gameState;
  showModal("クマ妖精のくしゃみ", `<div class="modal-anim">
    <img src="${IMAGES.modals.sneezeBefore}" alt="すすきでくしゃみが出そうなクマ妖精">
    <img src="${IMAGES.modals['sneeze' + power]}" alt="風パワー${power}のくしゃみ">
  </div>`, [{ text: "閉じる", action: "close" }]);
  playSE("se-sneeze" + power);
  window.addEventListener("modal:closed", () => {
    if (gameState !== state) return;
    if (config.pig && power >= config.power) {
      flags[config.brokenFlag] = true;
      markProgress(roomId + "_broken", { wind_power: power });
      updateMessage(rooms[roomId].name + "が壊れ、ブタが逃げていった。");
      startPigEscape(roomId, config.pig);
    } else if (roomId === "houseBrick" && power === 3) {
      startHumanWindFlight();
    } else {
      updateMessage("くしゃみの風圧では、家は壊れなかった。");
      renderCanvasRoom();
    }
  }, { once: true });
  return true;
}

let windBadEndActive = false;
let humanWindFlight = null;
function startHumanWindFlight() {
  const state = gameState;
  windBadEndActive = true;
  state.fx ??= {};
  state.fx.lockInput = true;
  const flight = { progress: 0 };
  humanWindFlight = flight;
  const start = performance.now();
  updateMessage("くしゃみの風で吹き飛ばされた！");
  const tick = now => {
    if (humanWindFlight !== flight) return;
    if (gameState !== state) {
      humanWindFlight = null;
      windBadEndActive = false;
      state.fx.lockInput = false;
      return;
    }
    flight.progress = Math.min(1, (now - start) / 1600);
    renderCanvasRoom();
    if (flight.progress < 1) {
      requestAnimationFrame(tick);
      return;
    }
    pauseBGM();
    isBGMPlaying = false;
    const bgmButton = document.getElementById("bgm-toggle");
    if (bgmButton) bgmButton.textContent = "🔇 BGM";
    playSE("se-explosion");
    showModal("【BAD END】煙突にはまった", `
      <img src="${IMAGES.modals.badendWInd}" alt="煙突にはまってしまった" style="display:block;width:400px;max-width:100%;margin:0 auto;">
      <p style="text-align:center;font-weight:800;line-height:1.8;margin-top:14px;">あなたは吹き飛ばされ、煙突に嵌まってしまった</p>
    `, [{ text: "最初から", action: "restart" }], null, { contentClass: "showobj-modal" });
    updateMessage("BAD END: あなたは吹き飛ばされ、煙突に嵌まってしまった");
    markProgress("wind_chimney_badend");
  };
  requestAnimationFrame(tick);
}

let pigEscape = null;
function startPigEscape(roomId, imageKey) {
  const state = gameState;
  const animation = { roomId, imageKey, progress: 0 };
  pigEscape = animation;
  const start = performance.now();
  const tick = now => {
    if (pigEscape !== animation) return;
    if (gameState !== state || gameState.currentRoom !== roomId) {
      pigEscape = null;
      renderCanvasRoom();
      return;
    }
    animation.progress = Math.min(1, (now - start) / 1100);
    if (animation.progress === 1) pigEscape = null;
    renderCanvasRoom();
    if (pigEscape === animation) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

let bearWaterBadEndActive = false;
function showBearWaterGunEvent(roomId) {
  const config = SNEEZE_ROOMS[roomId];
  if (!config || !getMainFlags()[config.bearFlag] || gameState.selectedItem !== "waterGun" || !hasItem("waterGun")) return false;
  const power = getWaterGunPower();
  if (power === 3) {
    bearWaterBadEndActive = true;
    pauseBGM();
    isBGMPlaying = false;
    const bgmButton = document.getElementById("bgm-toggle");
    if (bgmButton) bgmButton.textContent = "🔇 BGM";
    playSE("se-gya");
    showModal("【BAD END】クマ妖精の怒り", `
      <div class="modal-anim">
        <img src="${IMAGES.modals.bearGun3}" alt="強い水鉄砲を浴びたクマ妖精">
        <img src="${IMAGES.modals.badend}" alt="クマ妖精の怒りによるバッドエンド">
      </div>
      <p style="text-align:center;font-weight:800;line-height:1.8;margin-top:14px;">あなたは気が遠くなり意識を失った。</p>
    `, [{ text: "最初から", action: "restart" }], null, { contentClass: "showobj-modal" });
    const firstFrame = document.querySelector("#modalContent .modal-anim img:first-child");
    firstFrame.addEventListener("animationend", () => {
      if (bearWaterBadEndActive && firstFrame.isConnected) playSE("se-gogogo");
    }, { once: true });
    updateMessage("BAD END: クマ妖精の怒り");
    markProgress("bear_water_badend", { room: roomId });
  } else {
    playSE(power === 1 ? "se-piko" : "se-gya");
    showObj(null, "クマ妖精に水鉄砲を使った。", IMAGES.modals["bearGun" + power], "台の上のクマ妖精に水鉄砲を使った。");
  }
  return true;
}

function placeBearOnStep(flagKey) {
  if (showBearWaterGunEvent(gameState.currentRoom)) return;
  if (showBearSneezeEvent(gameState.currentRoom)) return;
  const flags = getMainFlags();
  if (flags[flagKey]) {
    takeBearFromStep(flagKey);
    return;
  }
  if (gameState.selectedItem !== "bearWithCap" || !hasItem("bearWithCap")) {
    updateMessage("台がある。何か置けそうだ");
    return;
  }
  removeItem("bearWithCap");
  flags[flagKey] = true;
  updateMessage("クマ妖精を台に乗せた。");
  renderCanvasRoom();
}

function takeBearFromStep(flagKey) {
  if (showBearButterEvent(flagKey)) return;
  if (showBearWaterGunEvent(gameState.currentRoom)) return;
  if (showBearSneezeEvent(gameState.currentRoom)) return;
  const flags = getMainFlags();
  if (!flags[flagKey]) return;
  if (gameState.inventory.length >= 14) {
    updateMessage("アイテム欄がいっぱいだ。");
    return;
  }
  flags[flagKey] = false;
  addItem("bearWithCap");
  updateMessage("クマ妖精を台から降ろし、一緒に連れていくことにした。");
  renderCanvasRoom();
}

function showBearButterEvent(flagKey) {
  const flags = getMainFlags();
  if (!flags[flagKey] || flags.bearSearchingButter || gameState.selectedItem !== "bakedPotato" || !hasItem("bakedPotato")) return false;
  flags.bearSearchingButter = true;
  ["putBearOnStepWara", "putBearOnStepWood", "putBearOnStepBrick"].forEach(key => flags[key] = false);
  removeItem("bearWithCap");
  showModal("「焼き芋にはバターだよね！探してくる！」", `<div class="modal-anim">
    <img src="${IMAGES.modals.bearButterEvent1}" alt="焼き芋にはバターだよね！">
    <img src="${IMAGES.modals.bearButterEvent2}" alt="バターを探しに行くクマ妖精">
  </div>`, [{ text: "閉じる", action: "close" }]);
  updateMessage("クマ妖精はバターを探しに行った。");
  markProgress("bear_searching_butter");
  renderCanvasRoom();
  return true;
}

function getInventoryItemImage(itemId) { return IMAGES.items[itemId]; }

function initGame() {
  renderNavigation();
  changeRoom("houseWara");
  updateInventoryDisplay();
  updateMessage("気が付くと、冷たい風が吹く野原に立っていた。");
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
const NAV_EXCLUDED_ROOM_IDS = new Set(["storageInner", "shrineLeft", "shrineTablet"]);
function changeRoom(roomId, { fromTravel = false } = {}) {
  if (endingTravelActive && !fromTravel) return;
  if (END_IDS.has(gameState.currentRoom) && !END_IDS.has(roomId)) return;
  if (windBadEndActive) return;
  if (!rooms[roomId]) return;
  if (roomId === "trueEnd" && getMainFlags().bearSearchingButter) {
    gameState.trueEnd ??= { flags: {} };
    gameState.trueEnd.flags ??= {};
    gameState.trueEnd.flags.backgroundState = 1;
  }
  addNaviItem(roomId);
  gameState.currentRoom = roomId;
  changeBGM(roomId === "end" ? S46("chiisana_ochakai.mp3")
    : roomId === "trueEnd" ? S46("nurumeno_kocha.mp3") : DEFAULT_BGM);
  hoveredAreaIndex = null;
  renderCanvasRoom();
  const room = rooms[roomId];
  updateMessage(room.name + "です。" + room.description);
  renderNavigation();
  if (END_IDS.has(roomId)) {
    gameState.inventory = gameState.inventory.filter(itemId => itemId === "potato");
    gameState.selectedItem = null;
    gameState.selectedItemSlot = null;
    gameState.usingItem = null;
    gameState.inventoryPage = 0;
    updateInventoryDisplay();
    ANA.once("ending_reached", roomId, { ending_id: roomId, is_true: roomId === "trueEnd" });
  }
}

function renderCanvasRoom() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const roomId = gameState.currentRoom;
  const room = rooms[roomId];
  const bgImgSrc = getRoomBackgroundImage(roomId, gameState);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景描画
  const endingBackground = loadedImages[bgImgSrc];
  const bgImg = END_IDS.has(roomId) && !(endingBackground?.complete && endingBackground.naturalWidth > 0)
    ? loadedImages[I46("field.webp")] : endingBackground;
  if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
    ctx.save();
    const phase = gameState.main?.flags?.timePhase ?? 0;
    const isNight = phase === 2;
    if (isNight && !END_IDS.has(roomId)) {
      ctx.filter = "saturate(0.3) brightness(0.6)"; // 背景はちょい暗め
    } else {
      ctx.filter = "none";
    }
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }


  // アイテム描画（未取得のみ）
  drawRoomItems(ctx, canvas, roomId);
  if (roomId === "shrineTablet") drawTabletPower(ctx, canvas);
  if (humanWindFlight && roomId === "houseBrick") {
    const img = loadedImages[IMAGES.items.iconHuman];
    if (img && img.complete && img.naturalWidth > 0) {
      const p = humanWindFlight.progress;
      const house = rooms.houseBrick.clickableAreas.find(area => area.item?.img === "houseBrick");
      const chimneyX = (house.x + house.width * 0.255) / 100;
      const chimneyY = house.y / 100;
      const x = (0.75 + (chimneyX - 0.75) * p) * canvas.width;
      const y = (0.76 + (chimneyY - 0.76) * p - 0.20 * Math.sin(Math.PI * p)) * canvas.height;
      const size = canvas.width * 0.10;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p * Math.PI * 4);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }
  if (pigEscape && pigEscape.roomId === roomId) {
    const img = loadedImages[IMAGES.items[pigEscape.imageKey]];
    if (img && img.complete && img.naturalWidth > 0) {
      const size = canvas.width * 0.12;
      ctx.save();
      ctx.globalAlpha = 1 - Math.max(0, (pigEscape.progress - 0.75) / 0.25);
      ctx.drawImage(img, canvas.width * (0.20 - 0.40 * pigEscape.progress), canvas.height * 0.65, size, size);
      ctx.restore();
    }
  }

  // ろうそく設置時に shrineZoom.flags.candlePlaced = true にすると明るさが戻る。
  if (roomId === "shrineZoom" && !gameState.shrineZoom?.flags?.candlePlaced) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
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

// 各部屋の状態・フラグは必要に応じて追加する。
function getDefaultGameState() {
  return {
    currentRoom: "houseWara",
    openRooms: ["houseWara"],
    openRoomsTmp: [], inventory: [],
    main: {
      flags: {
        storageUnlocked: false,
        houseBrickUnlocked: false,
        gotOperaGlass: false,
        gotBear: false,
        putBearOnStepWara: false,
        putBearOnStepWood: false,
        putBearOnStepBrick: false,
        bearSearchingButter: false,
        bonfireExtinguished: false,
        gotMatch: false,
        houseWaraBroken: false,
        houseWoodBroken: false,
        houseBrickBroken: false,
        timePhase: 0, // 0=昼,1=夕方,2=夜
        boxOpened: false,
        gotCap: false,
        boxRedUnlocked: false,
        gotScissors: false,
        gotSusuki: false,
        boxCalcUnlocked: false,
        gotCalcGem: false,
        safeOpened: false,
      }
    },
    houseWara: { flags: {} }, houseWood: { flags: {} }, houseBrick: { flags: {} },
    storage: { flags: {} }, bonfire: { flags: {} }, storageInner: { flags: {} }, shrineZoom: { flags: { candlePlaced: false } },
    waterGunPower: 1, // 水鉄砲のパワー（1〜3）
    windPower: 1, // 祠の宝珠で強化する風パワー（1〜3）
    shrineTablet: { flags: {} },
    shrineLeft: { flags: {} },
    end: { flags: {} }, trueEnd: { flags: {} },
    selectedItem: null, selectedItemSlot: null, usingItem: null, inventoryPage: 0,
  };
}

function markProgress(step, extra = {}) { ANA.once("progress", step, extra); }

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
  const names = { key: "カギ", battery: "電池", operaGlass: "双眼鏡", cap: "暖かそうなニット帽", bearWithCap: "防寒装備を着たクマ妖精" };
  if (itemId === "scissors") return "ハサミ";
  if (itemId === "waterGun") return "水鉄砲";
  if (itemId === "susuki") return "すすき";
  if (itemId === "candle") return "ろうそく";
  if (itemId === "candleOn") return "火のついたろうそく";
  if (itemId === "gem") return "宝珠";
  if (itemId === "potato") return "さつまいも";
  if (itemId === "bakedPotato") return "焼き芋";
  if (itemId === "match") return "超強力マッチ";
  return names[itemId] || itemId;
}
function openInventoryItemDetail(itemId, slotIndex, fallbackSrc) {
  if (gameState.fx?.lockInput || bearWaterBadEndActive || windBadEndActive) return;
  const src = getInventoryItemImage(itemId) || fallbackSrc;
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
  if (closeButton && !bearWaterBadEndActive && !windBadEndActive) {
    const closeBar = document.createElement("div");
    closeBar.className = "modal-top-close-bar";
    const topClose = document.createElement("button");
    topClose.type = "button";
    topClose.className = "modal-top-close";
    topClose.textContent = "×";
    topClose.setAttribute("aria-label", "モーダルを閉じる");
    topClose.onclick = () => {
      if (bearWaterBadEndActive || windBadEndActive) return;
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
  if (bearWaterBadEndActive || windBadEndActive) return;
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
  if (bearWaterBadEndActive || windBadEndActive) {
    bearWaterBadEndActive = false;
    windBadEndActive = false;
    humanWindFlight = null;
    changeBGM(DEFAULT_BGM);
  }
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

  if (!saved || saved.__version !== SAVE_VERSION) {
    updateMessage("旧46のセーブデータは、このひな型では使用できません。");
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
