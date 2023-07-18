export function initCookiesSdkFr() {
    return (
        <>
        </>
    )
    return new Promise((resolve) => {
        console.log('here we are');
        // wait for facebook sdk to initialize before starting the react app
        window.axeptioSettings = {
            clientId: '64ae6d6ce5df9529c865dfb0',
            cookiesVersion: 'liveproshop-fr'
        };

        (function(d, s) {
            var t = d.getElementsByTagName(s)[0], e = d.createElement(s);
            e.async = true; e.src = "//static.axept.io/sdk.js";
            t.parentNode.insertBefore(e, t);
        })(document, 'script');
    });
}
