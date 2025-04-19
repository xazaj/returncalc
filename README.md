# 📈 理财年化收益率计算器 

[![状态](https://img.shields.io/badge/状态-活跃-brightgreen)](https://returncalc.pages.dev/)
[![技术栈](https://img.shields.io/badge/技术栈-HTML_CSS_JS_Tesseract.js-blueviolet)](https://developer.mozilla.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一款现代、支持 OCR 图片识别的理财产品年化收益率（几何平均法）计算器。

✨ **[在线体验 (Live Demo)](https://returncalc.pages.dev/)** ✨

<!-- 
建议在此处添加一张计算器界面的截图或 GIF 动图
![计算器截图](screenshot.png) 
-->

## 🚀 主要特性 (Features)

*   **精准计算:** 采用**几何平均法**计算年化收益率，更科学地反映复利效应。
    ```
    年化收益率 = [ (期末净值 / 期初净值) ** (365 / 持有天数) - 1 ] * 100%
    ```
*   **OCR 智能识别:** 支持**上传**理财收益截图，利用 Tesseract.js **自动识别**并提取关键数据（最早和最晚的日期-净值对）。
*   **手动输入兼容:** 支持用户**手动输入**期初/期末的日期和单位净值。
*   **简洁易用:** 现代、响应式的用户界面。
*   **纯前端:** 无需后端，可直接在浏览器运行。

## 💡 原理与工作流程 (Principle & Workflow)

1.  **计算核心:** 基于用户提供的期初净值、期末净值和持有天数，使用上述几何平均公式计算年化收益率。
2.  **OCR 处理 (可选):**
    *   用户上传截图后，浏览器端的 Tesseract.js 识别图片中的文字。
    *   脚本解析文本，提取有效的日期和净值数据。
    *   自动填充识别出的最早和最晚数据点到表单。
3.  **手动输入:** 用户可直接填写或修改表单数据。
4.  **执行计算:** 点击"计算"按钮，进行输入验证后显示结果。

## ▶️ 如何使用 (Getting Started)

这是一个纯静态的前端项目。

1.  **克隆仓库:**
    ```bash
    git clone https://github.com/xazaj/returncalc.git
    cd returncalc
    ```
2.  **打开文件:**
    在浏览器中直接打开 `licaishouyi/index.html` 文件。
    *   **注意:** 若 OCR 功能因浏览器安全策略无法使用，请通过本地 HTTP 服务器访问，例如：
        *   Node.js: `npx serve .` (在项目根目录运行)
        *   Python 3: `python -m http.server` (在项目根目录运行)
        然后访问 `http://localhost:<port>/licaishouyi/`。

## 🛠️ 主要技术 (Tech Stack)

*   HTML5, CSS3, JavaScript (ES6+)
*   [Tesseract.js](https://github.com/naptha/tesseract.js) (用于 OCR)

## 📄 开源许可 (License)

本项目采用 [MIT License](LICENSE) 开源许可。

---

*希望这个工具能帮助你更方便地估算理财收益！* ⭐
