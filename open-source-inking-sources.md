# 開源書寫工具核實

- `perfect-freehand` GitHub：https://github.com/steveruizok/perfect-freehand
  - MIT license；TypeScript library。
  - `getStroke` 接收含 x、y、pressure 的輸入點，輸出可渲染的筆劃外框。
  - 支援 `simulatePressure: false` 使用實際 Apple Pencil 壓力，並有 `smoothing`、`streamline`、`thinning` 等選項。
- npm：https://www.npmjs.com/package/perfect-freehand
  - 目前核實版本 1.2.3，內置 TypeScript 型別，零 dependencies。
- MDN Pointer Events：https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
  - `pointerType` 可區分 pen、touch、mouse；`pressure` 為 0–1；`setPointerCapture()` 可把後續事件重新導向指定元素。
  - `pointercancel` 可能在瀏覽器接管平移／縮放時發生，因此仍需保留原生事件完成及取消流程。

採用決定：保留現有原生 Pointer Events 作 Apple Pencil-only 輸入、手指導航及雙指縮放；以 MIT `perfect-freehand` 作筆劃平滑／壓力渲染層。開源平滑層不能單獨修復首筆事件遺失，因此首筆問題仍需在 pointerdown、metrics 初始化、pointer capture 及 pointercancel 流程修正。
