(() => {
    if (window.__SafariMaskInjected__)
        return;
    window.__SafariMaskInjected__ = true;
    const safariUA =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15";
    
    function override(obj, prop, value) {
        try {
            Object.defineProperty(obj, prop, {
                get: () => value,
                configurable: true
            });
        } catch (e) {}
    }

    function overrideBoth(prop, value) {
        override(Navigator.prototype, prop, value);
        override(window.navigator, prop, value);
    }

    overrideBoth("userAgent", safariUA);

    overrideBoth(
        "appVersion",
        safariUA
    );

    overrideBoth(
        "vendor",
        "Apple Computer, Inc."
    );

    overrideBoth(
        "platform",
        "MacIntel"
    );

    overrideBoth(
        "productSub",
        "20030107"
    );

    overrideBoth(
        "language",
        "en-US"
    );

    overrideBoth(
        "languages",
        Object.freeze(["en-US"])
    );

    overrideBoth(
        "maxTouchPoints",
        0
    );

    overrideBoth(
        "webdriver",
        false
    );

    overrideBoth(
        "userAgentData",
        undefined
    );

    overrideBoth(
        "oscpu",
        undefined
    );

    overrideBoth(
        "buildID",
        undefined
    );

    overrideBoth(
        "plugins",
        Object.freeze([])
    );

    overrideBoth(
        "mimeTypes",
        Object.freeze([])
    );

    const firefoxProps = [
        "mozGetUserMedia",
        "mozRTCPeerConnection",
        "mozInnerScreenX",
        "mozInnerScreenY"
    ];

    for (const prop of firefoxProps) {
        try {
            delete Navigator.prototype[prop];
        } catch (e) {}
        try {
            delete window[prop];
        } catch (e) {}
    }

    if (window.speechSynthesis) {
        const fakeVoices = [
            {
                name: "Samantha",
                lang: "en-US",
                default: true,
                localService: true,
                voiceURI: "Samantha"
            }
        ];
        try {
            speechSynthesis.getVoices = () => fakeVoices;
        } catch (e) {}
    }

    try {
        delete window.chrome;
    } catch (e) {}
})();