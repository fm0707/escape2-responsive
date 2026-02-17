#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys

# ファイルパス
input_file = 'escape29.html'
output_file = 'escape29en.html'

# escape29.html を読み込む
with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 翻訳辞書（重要な日本語テキスト）
translations = {
    # メタデータ & タイトル
    '保育室を舞台にした無料ゲーム。スマホ＆PC対応。': 'A free escape game. Compatible with smartphones & PCs.',
    '工房からの脱出': 'Escape from the Workshop',
    
    # ゲーム内メッセージ
    '暗くてよく見えない': "It's too dark to see clearly.",
    'もう何もない': "There's nothing else here.",
    'グラスが沢山ある': 'There are many glasses.',
    
    # アイテム選択・使用
    'アイテムを選択した。': 'Item selected.',
    'アイテム選択を解除しました。': 'Item selection deselected.',
    'アイテム欄がいっぱいだ。どこかで減らしてこよう': 'Your item slots are full. Drop something somewhere.',
    '使用対象を選んでください': 'Select a target.',
    
    # 錬成システム
    '素材が2つ必要。': 'Two materials are required.',
    '素材を選んでからここに置ける': 'Select a material before placing it here.',
    '素材をセットした。': 'Material set.',
    '素材をインベントリに戻した。': 'Material returned to inventory.',
    '呪文が入力されていない。': 'No spell has been entered.',
    '呪文を入力してね（大文字・小文字は気にしない）': 'Enter the spell (case-insensitive)',
    '錬成中…': 'Synthesizing...',
    '（ゴゴゴ…）': '(Rumbling...)',
    '……': '...',
    '何も起きなかった': 'Nothing happened.',
    '成功！': 'Success!',
    '完成した！': 'Complete!',
    '注文の品ができた。外に出られそうだ': 'The order is ready. I might be able to get out.',
    'ハンマーの持ち手をよく見た': 'Examined the hammer handle closely.',
    
    # 工具選択
    '使いたい工具を選んでください': 'Select the tool you want to use.',
    '現在は': 'Currently holding ',
    'を持っている。使いたいものを選んで下さい': '. Select the one you want to use.',
    'を持った。': ' is now in hand.',
    '（クリックで持ち替え）': '(Click to swap)',
    
    # 引き出しパズル
    '引き出しのロック': 'Lock',
    '引き出し下段ロック': 'Bottom Drawer Lock',
    '引き出しは、もうアンロックされている。': 'The drawer is already unlocked.',
    '引き出し下段は、もうアンロックされている。': 'The bottom drawer is already unlocked.',
    'カチッ…引き出しのロックが外れた。': 'Click... The lock is open.',
    'カチッ…引き出し下段のロックが外れた。': 'Click... The bottom drawer is unlocked.',
    'ちがうようだ。': "That's not right.",
    'ちがうみたいだ。': "That doesn't seem right.",
    '違うようだ。': "That doesn't appear to be correct.",
    '入力: ': 'Input: ',
    
    # ナビゲーション
    'ナビ': 'Navigation',
    '移動先': 'Go to',
    '（ここ）': '(Here)',
    
    # メニューボタン
    '次へ': 'Next',
    '前へ': 'Previous',
    'やめる': 'Cancel',
    '閉じる': 'Close',
    'OK': 'OK',
    '消す': 'Clear',
    '調べる': 'Examine',
    '裏を見る': 'Check the back',
    
    # セーブ & ロード
    'セーブ1に保存しました！': 'Saved to Slot 1!',
    'セーブ2に保存しました！': 'Saved to Slot 2!',
    'セーブ1のデータがありません': 'No data in Slot 1',
    'セーブ2のデータがありません': 'No data in Slot 2',
    'セーブ1（空）': 'Slot 1 (Empty)',
    'セーブ2（空）': 'Slot 2 (Empty)',
    'セーブ1（日時不明）': 'Slot 1 (Time unknown)',
    'セーブ2（日時不明）': 'Slot 2 (Time unknown)',
    'セーブ1（読み込みエラー）': 'Slot 1 (Load error)',
    'セーブ2（読み込みエラー）': 'Slot 2 (Load error)',
    'セーブ1をロードしました！': 'Loaded Slot 1!',
    'セーブ2をロードしました！': 'Loaded Slot 2!',
    'セーブ先を選んでください': 'Select a save slot.',
    ' に上書き保存': ' (Overwrite)',
    'ロードするデータを選んでください': 'Select a save to load.',
    'セーブデータの読み込みに失敗しました': 'Failed to load save data.',
    
    # 手帳・レシピ図鑑
    '📖 レシピ図鑑': '📖 Recipe Codex',
    '今までに成功したレシピ': 'Recipes you have successfully created',
    '（レシピがまだ無い…錬成しよう）': '(No recipes yet... Try synthesizing!)',
    'No.': 'No.',
    '完成品': 'Result',
    '素材': 'Materials',
    '呪文': 'Spell',
    '進捗メモが書き足されている。': 'Progress notes are written.',
    '空白のページ。': 'A blank page.',
    'まだタスクはない。': 'No tasks yet.',
    
    # エンディング
    '🍙 TRUE END': '🍙 TRUE END',
    '🏃‍♀️‍➡️ END': '🏃‍♀️‍➡️ END',
    '🎆 NORMAL END ': '🎆 NORMAL END ',
    'エンディング': 'Ending',
    '評価はこちら': 'Rate here',
    'プレイ時間：': 'Play time: ',
    'ヒント利用：': 'Hints used: ',
    '無事依頼をこなして脱出できました！': 'You completed the quest and escaped safely!',
    '個性的な花火': 'Unique fireworks',
    '暗い森の中へ': 'Into the dark forest',
    '『工房からの脱出』': '"Escape from the Workshop"',
    'クリアログをコピーしました！': 'Clear log copied!',
    'コピーに失敗しました…': 'Copy failed...',
    
    # アイテム名
    'クマコイン': 'Bear Coin',
    'クマ妖精': 'Bear Fairy',
    'ドライバー': 'Driver',
    'ミラクルドライバー': 'Miracle Driver',
    'ハンマー': 'Hammer',
    'ラッキーハンマー': 'Lucky Hammer',
    'キャップオープナー': 'Cap Opener',
    '鍵': 'Key',
    'コア': 'Core',
    '青い宝石': 'Blue Gem',
    '赤い宝石': 'Red Gem',
    '緑の宝石': 'Green Gem',
    '紫の宝石': 'Purple Gem',
    '究極の宝石': 'Ultimate Gem',
    'おにぎり': 'Onigiri',
    'レシピの切れ端': 'Recipe Fragment',
    '紙の切れ端': 'Paper Fragment',
    '復元したレシピ': 'Restored Recipe',
    '赤色発光玉': 'Red Shining Orb',
    'ミラクル発光玉': 'Miracle Shining Orb',
    '焼きそば': 'Yakisoba',
    '塩': 'Salt',
    'ガラス': 'Glass',
    
    # まち時間メッセージ
    '錬成マシンの使い方を思い出した': 'I remembered how to use the synthesis machine.',
    
    # その他の文字列
    'BGM': 'BGM',
    '🔊 BGM': '🔊 BGM',
    '🔇 BGM': '🔇 BGM',
    'トゥルーエンド': 'True Ending',
    'ノーマルエンド': 'Normal Ending',
    '拡大': 'Magnify',
    '拡大表示': 'Enlarge',
}

# 翻訳を適用
for jp, en in translations.items():
    content = content.replace(jp, en)

# HTML言語属性を変更
content = content.replace('lang="ja"', 'lang="en"')

# escape29en.html として保存
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✓ {output_file} を作成しました")
print(f"✓ ファイルサイズ: {len(content):,} 文字")
