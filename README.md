# 📈 理财年化收益率计算器 (Annualized Yield Calculator - apycalc)

[![部署状态](https://img.shields.io/badge/状态-活跃-brightgreen)](<!-- 替换为你的 Live Demo 链接 -->)
[![技术栈](https://img.shields.io/badge/技术栈-HTML_CSS_JS-blueviolet)](https://developer.mozilla.org/)
[![OCR引擎](https://img.shields.io/badge/OCR-Tesseract.js-orange)](https://github.com/naptha/tesseract.js)
[![GitHub Pages](https://img.shields.io/badge/部署-GitHub%20Pages-brightgreen)](<!-- 替换为你的 GitHub Pages 链接 -->)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一款现代、美观且支持 OCR 图片识别的理财产品年化收益率（几何平均法）计算器。旨在提供便捷、精准的收益率估算体验。

✨ **[在线体验 (Live Demo)](https://returncalc.pages.dev/)** ✨

<!-- 
建议在此处添加一张计算器界面的截图或 GIF 动图
![计算器截图](screenshot.png) 
-->

## 🚀 主要特性 (Features)

*   **精准计算:** 采用**几何平均法**计算年化收益率，更科学地反映复利效应。
    $$ \text{年化收益率} = \left( \left( \frac{\text{期末净值}}{\text{期初净值}} \right)^{\frac{365}{\text{持有天数}}} - 1 \right) \times 100\% $$
*   **OCR 智能识别:** 支持**上传**理财收益截图（如手机 App 截图），利用 Tesseract.js **自动识别**并提取关键数据。
*   **自动数据提取:** 智能解析 OCR 结果，自动识别图片中的**最早**和**最晚**的有效“日期-净值”对，并填充至表单。
*   **手动输入兼容:** 同时也支持用户**手动输入**期初/期末的日期和单位净值。
*   **优雅 UI & UX:**
    *   现代、简洁、响应式的用户界面设计。
    *   清晰的标签置顶输入框布局。
    *   精致的聚焦效果和按钮交互动画。
    *   友好的加载状态提示和错误反馈。
*   **纯前端实现:** 无需后端服务，可在任何支持现代浏览器的设备上运行，方便部署到 GitHub Pages 等静态托管平台。
*   **跨平台:** 可在桌面和移动设备上良好运行。

## 🛠️ 技术栈 (Technology Stack)

*   **HTML5:** 构建页面结构。
*   **CSS3:**
    *   实现页面样式和布局 (Flexbox)。
    *   响应式设计 (@media queries)。
    *   自定义变量 (CSS Variables) 方便主题管理。
    *   细致的过渡和动画效果。
*   **JavaScript (ES6+):**
    *   实现核心计算逻辑。
    *   处理用户交互事件。
    *   输入验证。
    *   DOM 操作。
*   **[Tesseract.js](https://github.com/naptha/tesseract.js):** 强大的纯 JavaScript OCR 库，用于在浏览器端识别图片中的文字。
*   **[Google Fonts (Noto Sans SC)](https://fonts.google.com/specimen/Noto+Sans+SC):** 提供优雅的中文字体支持。

## 💡 如何工作 (How It Works)

1.  **OCR 处理 (如果上传图片):**
    *   用户选择图片文件。
    *   `Tesseract.js` 在浏览器中加载并处理图片，识别出包含的文本。
    *   JavaScript 解析返回的文本：
        *   按行分割。
        *   使用正则表达式查找年份 (`YYYY`)、日期 (`MM-DD`) 和单位净值 (`1.xxxxxx`)。
        *   过滤掉无效数据行（如缺少日期或净值）。
        *   将有效的日期和净值配对存储。
        *   按日期排序，提取最早和最晚的数据点。
    *   自动将提取的数据填充到对应的表单字段。
2.  **手动输入:** 用户可以直接在表单中输入或修改数据。
3.  **计算:**
    *   用户点击“计算”按钮。
    *   JavaScript 获取表单中的期初/期末日期和净值。
    *   进行输入验证（非空、数字有效性、日期顺序等）。
    *   计算持有天数。
    *   应用几何平均年化收益率公式进行计算。
    *   将计算结果（持有天数、年化收益率）显示在结果区域。

## ▶️ 本地运行 (Getting Started)

这是一个纯静态的前端项目，无需复杂的构建步骤。

1.  **克隆仓库:**
    ```bash
    git clone https://github.com/<your-username>/<repository-name>.git 
    # 例如： git clone https://github.com/your-username/apycalc.git
    ```
    或者直接下载 ZIP 文件。

2.  **导航到目录:**
    ```bash
    cd <repository-name> 
    # 例如： cd apycalc
    ```

3.  **打开 HTML 文件:**
    在你的浏览器中直接打开 `licaishouyi/index.html` 文件即可。

    *   对于某些浏览器，本地直接打开可能因安全策略限制 Tesseract.js 的 Web Worker 加载。如果遇到问题，建议使用一个简单的本地 HTTP 服务器运行：
        *   如果你安装了 Node.js: `npx serve .` (在项目根目录下运行)
        *   如果你安装了 Python 3: `python -m http.server` (在项目根目录下运行)
        然后访问 `http://localhost:<port>/licaishouyi/`。

## 📄 开源许可 (License)

本项目采用 [MIT License](LICENSE) 开源许可。

## 🙏 致谢 (Acknowledgements)

*   感谢 [Tesseract.js](https://github.com/naptha/tesseract.js) 团队提供了强大的前端 OCR 能力。
*   感谢 [Google Fonts](https://fonts.google.com/) 提供了高质量的字体。

---

*希望这个工具能帮助你更方便地估算理财收益！* ⭐
