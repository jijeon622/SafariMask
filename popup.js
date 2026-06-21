const siteToggle = document.getElementById("siteToggle");
const settingsButton = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const resetButton = document.getElementById("resetButton");
const modeRadios = document.querySelectorAll('input[name="settingsMode"]');

let currentHostname = "";

async function getCurrentHostname() {

    const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true
    });

    if (!tabs.length)
        return "";

    const url = new URL(tabs[0].url);

    return url.hostname;

}

async function refreshToggle() {

    currentHostname = await getCurrentHostname();

    if (!currentHostname) {

        siteToggle.disabled = true;
        return;

    }

    siteToggle.disabled = false;

    const response = await browser.runtime.sendMessage({
        type: "isEnabled",
        hostname: currentHostname
    });

    siteToggle.checked = response.enabled;

}

async function loadSettings() {

    const settings = await browser.runtime.sendMessage({
        type: "getSettings"
    });

    for (const radio of modeRadios) {

        radio.checked = (radio.value === settings.mode);

    }

}

settingsButton.addEventListener("click", () => {

    settingsPanel.classList.toggle("hidden");

});

siteToggle.addEventListener("change", async () => {

    await browser.runtime.sendMessage({

        type: "setSite",
        hostname: currentHostname,
        enabled: siteToggle.checked

    });

    const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true
    });

    browser.tabs.reload(tabs[0].id);

});

for (const radio of modeRadios) {

    radio.addEventListener("change", async () => {

        if (!radio.checked)
            return;

        await browser.runtime.sendMessage({

            type: "setMode",
            mode: radio.value

        });

        await refreshToggle();

        const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true
        });

        if (tabs.length) {
            browser.tabs.reload(tabs[0].id);
        }

    });

}

resetButton.addEventListener("click", async () => {

    await browser.runtime.sendMessage({

        type: "resetSites"

    });

    await refreshToggle();

});

(async () => {

    await loadSettings();
    await refreshToggle();

})();