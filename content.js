(async () => {
    if (window.__SafariMaskContent__)
        return;
    window.__SafariMaskContent__ = true;
    if (
        location.protocol !== "http:" &&
        location.protocol !== "https:"
    )
        return;
    const response = await browser.runtime.sendMessage({
        type: "isEnabled",
        hostname: location.hostname
    });
    if (!response.enabled)
        return;
    const script = document.createElement("script");
    script.src = browser.runtime.getURL("inject.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
})();