import { accountService } from '_services';

// const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

export function initFacebookSdk() {
    return new Promise((resolve) => {
        // wait for facebook sdk to initialize before starting the react app
        window.fbAsyncInit = function () {
            FB.init({
                appId: '3046697902325160',
                cookie: true,
                xfbml: true,
                version: 'v12.0'
            });
            FB.AppEvents.logPageView();

            // auto authenticate with the api if already logged in with facebook
            window.FB.getLoginStatus(({ authResponse }) => {
                if (authResponse) {
                    accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
                } else {
                    resolve();
                }
            });
        };

        (function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
        // window.fbAsyncInit = function () {
        //     window.FB.init({
        //         appId: facebookAppId,
        //         cookie: true,
        //         xfbml: true,
        //         version: 'v8.0'
        //     });
        //
        //     // auto authenticate with the api if already logged in with facebook
        //     window.FB.getLoginStatus(({ authResponse }) => {
        //         if (authResponse) {
        //             accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
        //         } else {
        //             resolve();
        //         }
        //     });
        // };

        // load facebook sdk script
        // (function (d, s, id) {
        //     var js,
        //         fjs = d.getElementsByTagName(s)[0];
        //     if (d.getElementById(id)) {
        //         return;
        //     }
        //     js = d.createElement(s);
        //     js.id = id;
        //     js.src = 'https://connect.facebook.net/en_US/sdk.js';
        //     fjs.parentNode.insertBefore(js, fjs);
        // })(document, 'script', 'facebook-jssdk');
    });
}
