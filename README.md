# 《一個人的聖誕》舞台視覺原型

目前製作範圍為第一幕「孤獨與現實」：七個手動推進的畫面，包括房間、朋友聚會照片、工作訊息、帳單、親人離世、悲傷及最後黑場。畫面中的字幕、通知和操作台使用繁體中文。此原型不是完整劇本或最終版 PPT。

## 演出操作

1. 在同一台電腦、同一個瀏覽器中開啟 `operator.html`，點「打開舞台畫面」；允許瀏覽器開啟彈出視窗。
2. 把舞台視窗移到投影幕，點選該視窗並按 F 進入全螢幕。回到操作台，按「下一個畫面」開始。
3. 每個畫面的動畫自動播放，但**不會自動進入下一個畫面**。請依操作台上「演員與操作提示」和演員的實際動作手動推進。最後一個畫面會淡至黑場並保持。
4. 右方向鍵或空白鍵：下一個畫面；左方向鍵：上一個畫面；R：重播；B：立即黑場／解除；F：切換目前視窗的全螢幕。重播會重新開始當前畫面。
5. 網頁的雙視窗使用 BroadcastChannel 同步，並以 localStorage 事件作後備；必須使用同一瀏覽器設定檔和相同網站來源，**不能跨手機和電腦同步**。狀態保存在瀏覽器內。

如將畫面與整場 PowerPoint 結合，須先排練應用程式切換；目前尚未輸出 PPT 或影片。所有畫面暫無聲音；表演前須依授權狀況選擇並測試音樂與音效。

## 本機與 GitHub Pages

在專案目錄執行 `python3 -m http.server 8000`，開啟 `http://localhost:8000/operator.html`。不要直接用 `file://` 開啟，舞台和操作台需使用完全相同的協定、主機與連接埠。GitHub Pages 使用相對路徑；`index.html` 為舞台，`operator.html` 為操作台。

## 編輯與擴充

- `scenes/scene01.js` 是第一幕七個提示點的資料。可調整 `title`、`description`、`cue`、`caption`、`captionAt`、`duration`、背景和手機 `notifications`。時間單位為秒。`duration` 是動畫時長，不是強制切換時間；最後畫面以 `fadeAt` 和 `fadeDuration` 控制淡黑。
- 通知依 `at` 逐條出現，請保持時間遞增。第一幕最後淡黑後等待人工推進。
- 在 `scenes/index.js` 按順序加入新幕的提示資料。目前渲染器支援房間、手機通知、手機照片和結尾字幕；不同形式需要在 `js/stageDisplay.js` 中擴充。
- `js/sceneManager.js` 管理同步及時間；`js/audioManager.js` 預留音軌播放。音軌可指定 `{ src, at, end, volume, fadeIn, fadeOut }`，預覽靜音，舞台播放。瀏覽器可能需要先在舞台視窗互動才允許播放音訊。請使用已獲授權的素材並實測。
- `assets/images/bedroom-cold.png`、`bills-table.png`、`friends-christmas.png` 為原型生成素材；`morning-room.png` 為先前手機原型素材。帳單鏡頭與房間不是同一實景拍攝，視覺空間連續性仍可改善。`assets/audio/` 和 `assets/videos/` 目前沒有素材。

## 驗證與注意事項

執行 `node --experimental-default-type=module tests/sceneManager.test.mjs` 測試場景狀態與後備同步。實際演出前仍須測試雙螢幕、投影對比度、字體、現場走位及音量；全螢幕只能由使用者在目標視窗操作。第二至第四幕、音效、配樂、PowerPoint 匯出及跨裝置控制尚未完成。
