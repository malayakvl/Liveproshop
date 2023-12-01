import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import store from '../app/store';
import { syncFbAction } from '../redux/user/actions';
import { setErrorToastAction } from '../redux/layouts';
import { signIn } from 'next-auth/client';
import { showLoaderAction } from '../redux/layouts/actions';

// import { history } from '_helpers';

// const baseUrl = `${process.env.REACT_APP_API_URL}/accounts`;
const accountSubject = new BehaviorSubject(null);

export const accountService = {
    loginFB,
    logout,
    syncFB,
    registerFB
};

async function syncFB() {
    // login with facebook then authenticate with the API to get a JWT auth token
    // const { authResponse } = await new Promise(window.FB.login);
    // console.log('public_profile,email,pages_show_list');
    // FB.login(
    //     function (response) {
    //         // handle the response
    //     },
    //     {
    //         scope: 'public_profile,email,pages_show_list,publish_video,pages_messaging'
    //     }
    // );
    const { authResponse } = await new Promise(
        // window.FB.login(
        //     function (response) {
        //         // handle the response
        //         console.log('!!!!!!!', response.authResponse);
        //         store.dispatch(syncFbAction(response.authResponse));
        //         return response;
        //     },
        //     {
        //         scope: 'public_profile,email,pages_show_list,publish_video,pages_messaging'
        //     }
        // )
        window.FB.login(
            function (response) {
                // handle the response
                store.dispatch(syncFbAction(response.authResponse));
                return response;
            },
            {
                scope: 'pages_show_list,pages_messaging,pages_read_engagement,pages_read_user_content'
            }
        )
    );
    console.log('AUTH RESPONCE', authResponse);
    store.dispatch(syncFbAction(authResponse));
}

async function registerFB(paramData, commentId) {
    const infoParam = paramData.split('_');
    const roleId = infoParam[0] ? infoParam[0] : 2;
    // const commentId = infoParam[0] ? infoParam[0] : 2;
    const locale = infoParam[1];
    const forFree = infoParam[2];
    console.log('Register FB SDK');
    // login with facebook then authenticate with the API to get a JWT auth token
    // const { authResponse } = await new Promise(window.FB.login);
    const { authResponse } = await new Promise(window.FB.login);

    // login and add stores
    // const loginOptions = {
    //     scope: 'publish_video,manage_pages,pages_show_list,pages_messaging'
    // };
    // const { authResponse } = await new Promise((resolve, reject) => {
    //     window.FB.login(
    //         (response) => {
    //             // handle the response
    //             if (response.authResponse) {
    //                 resolve(response);
    //             } else {
    //                 reject(response);
    //             }
    //         },
    //         { scope: 'email,pages_show_list,pages_messaging,publish_video' }
    //     );
    // });
    authResponse.roleId = roleId;
    authResponse.locale = locale;
    authResponse.forFree = forFree;
    if (authResponse) {
        await getAccountData(authResponse);
    } else {
        store.dispatch(setErrorToastAction('Could no autherntificate'));
    }
}

async function loginFB() {
    // login with facebook then authenticate with the API to get a JWT auth token
    const { authResponse } = await new Promise(window.FB.login);
    // const loginOptions = {
    //     scope: 'publish_video,manage_pages,pages_show_list,pages_messaging'
    // };
    // const { authResponse } = await new Promise((resolve, reject) => {
    //     window.FB.login((response) => {
    //         // handle the response
    //         if (response.authResponse) {
    //             resolve(response);
    //         } else {
    //             reject(response);
    //         }
    //     }, loginOptions);
    // });
    if (authResponse) {
        store.dispatch(showLoaderAction(true));
        signIn('credentials_sdkfacebook_login', authResponse);
    } else {
        store.dispatch(setErrorToastAction('Could no autherntificate'));
    }
}

async function getAccountData(authResponse) {
    // console.log(
    //     'SEND RESPONCSE TO THIS URL',
    //     `https://graph.facebook.com/v17.0/me?fields=name,accounts&access_token=${authResponse.accessToken}`
    // );
    // const loginOptions = {
    //     scope: 'pages_show_list,pages_messaging,pages_manage_metadata,pages_read_user_content'
    // };
    const loginOptions = {
        scope: 'pages_show_list,pages_messaging,pages_read_engagement,pages_read_user_content,read_insights'
    };
    axios
        .get(
            `https://graph.facebook.com/v17.0/me?fields=name,accounts&access_token=${authResponse.accessToken}`, loginOptions)
        .then((response) => {
            const { data } = response;
            if (data.error) {
                store.dispatch(setErrorToastAction('Could no autherntificate'));
            }
            data.accessToken = authResponse.accessToken;
            data.expirationTime = authResponse.data_access_expiration_time;
            data.callbackUrl = `${window.location.origin}/${
                authResponse.locale === 'fr' ? '' : 'en/'
            }${parseInt(authResponse.forFree) === 1 ? 'dashboard' : 'pricing'}`;
            data.roleId = authResponse.roleId ? authResponse.roleId : 2;
            data.forFree = authResponse.forFree;
            data.userAccounts = JSON.stringify(data.accounts);
            store.dispatch(showLoaderAction(true));
            signIn('credentials_sdkfacebook', data);
        });
}

function logout() {
    // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
    window.FB.api('/me/permissions', 'delete', null, () => window.FB.logout());
    stopAuthenticateTimer();
    accountSubject.next(null);
    history.push('/login');
}

// helper methods

let authenticateTimeout;

function stopAuthenticateTimer() {
    // cancel timer for re-authenticating with the api
    clearTimeout(authenticateTimeout);
}

// curl -i -X GET "https://graph.facebook.com/2763630843946760/accounts?access_token=EAArS9KI0vagBO46CIW5SZCe2ZCHRAyxmvNEcwZC4GMJCEmYuoZCGxmCcv7hNA5QP9zDQ6EbYPjKTaGSdP5e1J7fkXwM3w1sjzHXnTBDJpkEdeQ06qf42svmCgubo6ZBgKWiXAZA5i32ZAIUpcKfZCWGaZC2sNGCS92RgtHqi2ZCoOtuQyNx3tigaN60aPp8Rm8jwXvFxvLCeixZBlbs8Ka2dsM2Uopg6ecZD"
