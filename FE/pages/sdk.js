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

window.fbAsyncInit = function () {
    FB.init({
        appId: '3046697902325160',
        xfbml: true,
        version: 'v18.0'
    });
    // FB.login((response) => {
    //         // handle the response
    //         if (response.authResponse) {
    //             resolve(response);
    //         } else {
    //             reject(response);
    //         }
    //     },
    //     { scope: 'publish_video,manage_pages,pages_show_list,pages_messaging' }
    // );
};
