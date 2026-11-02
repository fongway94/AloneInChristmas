# 《一個人的聖誕》舞台視覺系統

四幕、26 個可手動推進的舞台畫面，配合真實演員演出。畫面字幕、手機訊息與操作台使用繁體中文。每個畫面會播放主要動畫，之後環境仍會緩慢移動並等待操作員依演員的進度推進。第一幕結尾自動淡至黑場；全劇最後一句字幕會保持，下一次推進進入黑場。

## 兩種演出方式

### 網頁版：動態效果

1. 在同一台電腦、同一個瀏覽器中開啟 `operator.html`，點「打開舞台畫面」，允許瀏覽器開啟彈出視窗。
2. 把舞台視窗移到投影幕，點選該視窗並按 F 進入全螢幕。回到操作台，按「下一個畫面」開始。
3. 依照操作台上「演員與操作提示」及演員的實際動作推進。畫面不會自動跳到下一段。最後字幕留在畫面上，等演出結束才按下一個畫面進入黑場。
4. 右方向鍵或空白鍵：下一個畫面；左方向鍵：上一個畫面；R：重播；B：立即黑場／解除；F：切換目前視窗的全螢幕。重播會重新開始當前畫面。
5. 雙視窗使用 BroadcastChannel 同步，並以 localStorage 事件作後備；必須使用同一瀏覽器設定檔和相同網站來源，**不能跨手機和電腦同步**。狀態保存在瀏覽器內。

### PowerPoint 版：靜態逐頁提示

`deliverables/stage-cues.pptx` 有 33 張投影片，含前後黑場。工作訊息拆成多張投影片，讓操作員逐則推進。每張投影片的備忘稿有劇情與切換提示；字幕及手機元件為可編輯文字和形狀。

這是**靜態提示版，不是網頁動畫或影片**：手機震動、時間軸、環境慢動和自動出現訊息不會保留；投影片設定手動推進及淡化轉場。沒有內嵌音樂或音效。可用 PowerPoint「重用投影片」將整份投影片插入第四組和第六組之間，保留來源格式，再檢查每張的順序、轉場與備忘稿；也可依主辦方需求移除重複的黑場。不同 PowerPoint 版本可能處理轉場或字體不同，請在演出電腦先測試。

兩種版本都需要操作員依演員的節奏留白；劇情與口白尚可按實際劇本調整。四幕建議演出時間為 2、2、3、2 分鐘，另預留約 1 分鐘給場景轉換與停頓，實際以排練為準。動畫的「約需時間」不是整場表演的倒數。

## 舞台及聲音

街景背景刻意不畫人物與長椅：熱鬧人群由配角演出，第三、四幕使用實體長椅道具。街景及長椅背景以相同街道為視覺參考，但不是完全一致的實景，走位和接景需排練確認。音效方向見操作台、投影片備忘稿與 `docs/stage-rundown.md`。目前**沒有內嵌任何聲音**；請自行準備具授權的音樂和音效，並確保音量不蓋過演員對白。

## 本機與 GitHub Pages

在專案目錄執行 `python3 -m http.server 8000`，開啟 `http://localhost:8000/operator.html`。不要直接用 `file://` 開啟，舞台和操作台需使用完全相同的協定、主機與連接埠。GitHub Pages 使用相對路徑；`index.html` 為舞台，`operator.html` 為操作台。

## 編輯、擴充與重新產生 PPT

- 四幕皆以寫實靜態背景為底，結合同步的雨絲、街燈光暈、鏡頭緩移、通知或字幕動畫；不是實拍影片或人物走動動畫。第一幕的黑場會停止可見動態。
- `scenes/scene01.js` 至 `scene04.js` 分別記錄四幕的畫面。可調整 `title`、`description`、`cue`、`caption`、`captionAt`、`duration`、背景、`warmth` 和手機 `notifications`。時間單位為秒。`duration` 是動畫時長，不是強制切換時間。
- 通知依 `at` 逐條出現，請保持時間遞增。第一幕最後以 `fadeAt` 和 `fadeDuration` 淡黑，並等待人工推進。
- 在 `scenes/index.js` 按順序排列各幕。目前渲染器支援房間／街景、手機通知、手機照片和結尾字幕；不同視覺形式需要擴充 `js/stageDisplay.js`。`scenes/index.js` 預設依背景選擇動態，可在個別場景設定 `motion: { preset, intensity }` 覆蓋；`js/atmosphere.js` 支援 `rain-left`、`rain-right`、`street`、`bench`。
- 重新產生 PPT 需要 Node.js、Python、`python-pptx` 和 `Pillow`，執行 `python3 tools/create_powerpoint.py`。這會覆寫 `deliverables/stage-cues.pptx`；自行修改過的投影片請先另存。
- `js/sceneManager.js` 管理同步及時間；`js/audioManager.js` 預留音軌播放。音軌可指定 `{ src, at, end, volume, fadeIn, fadeOut }`，預覽靜音，舞台播放。瀏覽器可能需要先在舞台視窗互動才允許播放音訊。請使用已獲授權的素材並實測。
- `assets/images/` 的房間、帳單、聚會照片及街景為生成素材；`morning-room.png` 為先前手機原型素材。`assets/audio/` 和 `assets/videos/` 目前沒有素材。

## 驗證與注意事項

執行 `node --experimental-default-type=module tests/sceneManager.test.mjs` 與 `node --experimental-default-type=module tests/atmosphere.test.mjs`，測試場景狀態、後備同步及環境動態。實際演出前仍須測試 PowerPoint 相容性、雙螢幕、投影對比度、字體、現場走位及音量；全螢幕只能由使用者在目標視窗操作。配樂、音效、影片輸出及跨裝置控制尚未完成。
