const form = document.getElementById('return-form');
const startNavInput = document.getElementById('start-nav');
const endNavInput = document.getElementById('end-nav');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const resultArea = document.getElementById('result-area');
const holdingDaysSpan = document.getElementById('holding-days');
const annualizedReturnSpan = document.getElementById('annualized-return');
const errorMessageDiv = document.getElementById('error-message');

// --- OCR Elements ---
const imageUploadInput = document.getElementById('image-upload');
const loaderDiv = document.getElementById('loader');
const loaderStatusP = document.getElementById('loader-status');

// --- Event Listeners ---
form.addEventListener('submit', handleFormSubmit);
imageUploadInput.addEventListener('change', handleImageUpload);

// Clear errors/results when manual input changes
[startNavInput, endNavInput, startDateInput, endDateInput].forEach(input => {
    input.addEventListener('input', clearMessages);
});

// --- Functions ---

function handleFormSubmit(event) {
    event.preventDefault();
    clearMessages();

    const startNav = parseFloat(startNavInput.value);
    const endNav = parseFloat(endNavInput.value);
    const startDateStr = startDateInput.value;
    const endDateStr = endDateInput.value;

    if (!validateInputs(startNav, endNav, startDateStr, endDateStr)) {
        return; // Validation errors shown by validateInputs
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const holdingDays = calculateHoldingDays(startDate, endDate);

    if (holdingDays === null) return; // Error handled in calculateHoldingDays

    calculateAndDisplayReturn(startNav, endNav, holdingDays);
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return; // No file selected
    }
    if (!file.type.startsWith('image/')) {
        showError("请上传图片文件。");
        return;
    }

    clearMessages();
    showLoader('正在识别图片...');

    try {
        // Use Tesseract.js
        const { data: { text } } = await Tesseract.recognize(
            file,
            'eng', // English is usually enough for dates/numbers
            {
                logger: m => {
                    // console.log(m); // Log progress details if needed
                    if (m.status === 'recognizing text') {
                        const progress = (m.progress * 100).toFixed(0);
                        showLoader(`正在识别图片... ${progress}%`);
                    }
                }
            }
        );

        console.log("OCR Raw Result:", text); // Log raw text for debugging
        const extractedData = parseOcrText(text);

        if (extractedData) {
            // Populate the form fields
            startDateInput.value = extractedData.startDate;
            endDateInput.value = extractedData.endDate;
            startNavInput.value = extractedData.startNav;
            endNavInput.value = extractedData.endNav;
            showSuccess("已从图片自动填充数据，请核对后计算。");
        } else {
            showError("未能在图片中找到有效的起始和结束日期/净值数据。请检查图片或手动输入。");
        }

    } catch (error) {
        console.error("OCR Error:", error);
        showError("图片识别失败，请稍后重试或手动输入。");
    } finally {
        hideLoader();
        // Reset file input to allow uploading the same file again if needed
        imageUploadInput.value = null;
    }
}

function parseOcrText(text) {
    const lines = text.split('\n');
    const dataPairs = [];

    // Regex to find potential year (YYYY format)
    const yearRegex = /\b(20\d{2})\b/;
    // Regex for MM-DD date format
    const dateRegex = /\b(\d{2}-\d{2})\b/;
    // Regex for NAV format (1. followed by at least 5 digits)
    const navRegex = /\b(1\.\d{5,})\b/;

    let year = new Date().getFullYear(); // Default to current year

    // Try to find year in the first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const yearMatch = lines[i].match(yearRegex);
        if (yearMatch) {
            year = parseInt(yearMatch[1], 10);
            console.log(`Detected year: ${year}`);
            break;
        }
    }

    lines.forEach(line => {
        const dateMatch = line.match(dateRegex);
        const navMatch = line.match(navRegex);

        // Only consider lines where BOTH date and NAV are found
        if (dateMatch && navMatch) {
            const mmdd = dateMatch[1];
            const nav = parseFloat(navMatch[1]);
            const fullDateStr = `${year}-${mmdd}`; // Construct YYYY-MM-DD

            // Basic validation of constructed date string
            const dateObj = new Date(fullDateStr);
            if (!isNaN(dateObj.getTime()) && !isNaN(nav)) {
                 // Check if the date string matches the components (e.g., avoid Feb 30th)
                 const [month, day] = mmdd.split('-').map(Number);
                 if (dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day) {
                    dataPairs.push({ date: fullDateStr, nav: nav });
                 }
            }
        }
    });

    console.log("Parsed Data Pairs:", dataPairs);

    if (dataPairs.length < 2) {
        return null; // Not enough valid data points
    }

    // Sort by date ascending
    dataPairs.sort((a, b) => new Date(a.date) - new Date(b.date));

    const earliest = dataPairs[0];
    const latest = dataPairs[dataPairs.length - 1];

    return {
        startDate: earliest.date,
        startNav: earliest.nav.toFixed(6), // Format to 6 decimal places
        endDate: latest.date,
        endNav: latest.nav.toFixed(6)     // Format to 6 decimal places
    };
}


function validateInputs(startNav, endNav, startDateStr, endDateStr) {
    if (isNaN(startNav) || startNav <= 0) {
        showError("期初净值必须是大于 0 的数字。");
        return false;
    }
    if (isNaN(endNav) || endNav <= 0) {
        showError("期末净值必须是大于 0 的数字。");
        return false;
    }
    if (!startDateStr || !endDateStr) {
        showError("请选择期初和期末日期。");
        return false;
    }
    // Further date validation (format, sequence) happens in calculateHoldingDays
    return true;
}

function calculateHoldingDays(startDate, endDate) {
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        showError("输入的日期格式无效。");
        return null;
    }
    if (startDate >= endDate) {
        showError("期末日期必须晚于期初日期。");
        return null;
    }
    const timeDiff = endDate.getTime() - startDate.getTime();
    const holdingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (holdingDays <= 0) {
        showError("持有天数必须大于 0。");
        return null;
    }
    return holdingDays;
}

function calculateAndDisplayReturn(startNav, endNav, holdingDays) {
    try {
        const base = endNav / startNav;
        if (base <= 0) {
            showError("净值计算基础无效（期末/期初 <= 0）。");
            return;
        }
        const exponent = 365 / holdingDays;
        const annualizedReturn = (Math.pow(base, exponent) - 1) * 100;

        if (isNaN(annualizedReturn) || !isFinite(annualizedReturn)) {
             showError("计算结果无效，请检查输入数据。可能由于持有天数过短或净值差异过大导致。");
             return;
        }

        displayResult(holdingDays, annualizedReturn);
    } catch (error) {
        console.error("Calculation error:", error);
        showError("计算过程中发生未知错误。");
    }
}

function displayResult(days, rate) {
    holdingDaysSpan.textContent = days;
    annualizedReturnSpan.textContent = rate.toFixed(4);
    resultArea.style.display = 'block';
    errorMessageDiv.style.display = 'none';
}

function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
    resultArea.style.display = 'none';
}

function showSuccess(message) {
    // Using the error div for success messages too, but could create a separate one
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.color = 'var(--success-color)'; // Style as success
    errorMessageDiv.style.borderColor = 'var(--success-color)';
    errorMessageDiv.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
    errorMessageDiv.style.display = 'block';
    resultArea.style.display = 'none';
}

function clearMessages() {
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';
    // Reset error styles if it was used for success message
    errorMessageDiv.style.color = 'var(--error-color)';
    errorMessageDiv.style.borderColor = 'var(--error-color)';
    errorMessageDiv.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
    // Optionally hide results
    // resultArea.style.display = 'none';
}

function showLoader(statusText = '处理中...') {
    loaderStatusP.textContent = statusText;
    loaderDiv.style.display = 'flex'; // Use flex as defined in CSS
    // Disable buttons while loading maybe?
}

function hideLoader() {
    loaderDiv.style.display = 'none';
}
