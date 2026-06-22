const SAFARI_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15";

const DEFAULT_SETTINGS = {
    mode: "blacklist",
    sites: {}
};

let settingsCache = {
    mode: "blacklist",
    sites: {}
};

browser.storage.local.get(DEFAULT_SETTINGS).then(data => {
    settingsCache = data;
});

function saveCache() {
    browser.storage.local.set(settingsCache);
}

function isEnabled(hostname) {
    const listed = !!settingsCache.sites[hostname];
    if (settingsCache.mode === "blacklist")
        return !listed;
    return listed;
}

browser.runtime.onMessage.addListener((message) => {
    switch (message.type) {
        case "getSettings":
            return Promise.resolve(settingsCache);
        case "isEnabled":
            return Promise.resolve({
                enabled: isEnabled(message.hostname)
            });
        case "setSite":
            if (message.enabled) {
                if (settingsCache.mode === "blacklist") {
                    delete settingsCache.sites[message.hostname];
                }
                else{
                    settingsCache.sites[message.hostname] = true;

                }

            } else {
                if (settingsCache.mode === "blacklist") {
                    settingsCache.sites[message.hostname] = true;
                } else {
                    delete settingsCache.sites[message.hostname];
                }
            }
            saveCache();
            return Promise.resolve({
                success: true
            });
        case "setMode":
            settingsCache.mode = message.mode;
            settingsCache.sites = {};
            saveCache();
            return Promise.resolve({
                success: true
            });
        case "resetSites":
            settingsCache.sites = {};
            saveCache();
            return Promise.resolve({
                success: true
            });
    }
});

browser.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        let enabled;
        try {
            const hostname = new URL(details.url).hostname;
            enabled = isEnabled(hostname);
        } catch (e) {
            return {};
        }
        if (!enabled)
            return {};
        let found = false;
        for (const header of details.requestHeaders) {
            if (header.name.toLowerCase() === "user-agent") {
                header.value = SAFARI_UA;
                found = true;
                break;
            }
        }
        if (!found) {
            details.requestHeaders.push({
                name: "User-Agent",
                value: SAFARI_UA
            });
        }
        return {
            requestHeaders: details.requestHeaders
        };

    },
    {
        urls: ["<all_urls>"]
    },
    [
        "blocking",
        "requestHeaders"
    ]
);