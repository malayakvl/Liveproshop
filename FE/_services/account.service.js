import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import store from '../app/store';
import { syncFbAction } from '../redux/user/actions';
import { setErrorToastAction } from '../redux/layouts';
import { signIn } from 'next-auth/client';
import { showLoaderAction } from '../redux/layouts/actions';

const accountSubject = new BehaviorSubject(null);

export const accountService = {
    loginFB,
    logout,
    syncFB,
    registerFB
};

async function syncFB() {
    const { authResponse } = await new Promise(
        window.FB.login(
            function (response) {
                // handle the response
                store.dispatch(syncFbAction(response.authResponse));
                return response;
            },
            {
                scope: 'pages_show_list,pages_messaging,pages_read_engagement,pages_read_user_content,pages_manage_posts,business_management'
            }
        )
    );
    // console.log('AUTH RESPONCE', authResponse);
    store.dispatch(syncFbAction(authResponse));
}

async function registerFB(paramData, commentId) {
    const infoParam = paramData.split('_');
    const roleId = infoParam[0] ? infoParam[0] : 1;
    const locale = infoParam[1];
    const forFree = infoParam[2];
    // console.log('Register FB SDK', roleId);
    // login with facebook then authenticate with the API to get a JWT auth token
    const { authResponse } = await new Promise(window.FB.login);
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
    // console.log('AUTH RESPONSE LOGIN', authResponse);
    if (authResponse) {
        store.dispatch(showLoaderAction(true));
        signIn('credentials_sdkfacebook_login', authResponse);
    } else {
        store.dispatch(setErrorToastAction('Could no autherntificate'));
    }
}

async function getAccountData(authResponse) {
    const loginOptions = {
        // scope: 'pages_show_list,pages_messaging,pages_read_engagement,pages_read_user_content,read_insights'
        scope: 'email,pages_show_list,pages_messaging,pages_read_engagement,pages_read_user_content'
    };
    if (parseInt(authResponse.roleId) === 1) {
        console.log('AUTH RESPONSE', authResponse);
        axios
            .get(
                `https://graph.facebook.com/v21.0/me?fields=id,name,email&access_token=${authResponse.accessToken}`,
                loginOptions
            )
            .then((response) => {
                const { data } = response;
                console.log(authResponse);
                if (data.error) {
                    store.dispatch(setErrorToastAction('Could no autherntificate'));
                }
                // console.log('AUTH RESPONCE HERE', authResponse.roleId);
                data.accessToken = authResponse.accessToken;
                data.roleId = 1;
                data.callbackUrl = `${window.location.origin}/${
                    authResponse.locale === 'fr' ? '' : 'en/'
                }dashboard`;
                store.dispatch(showLoaderAction(true));
                signIn('credentials_sdkfacebook', data);
            });
    }
    axios
        .get(
            `https://graph.facebook.com/v21.0/me?fields=name,email,accounts&access_token=${authResponse.accessToken}`,
            loginOptions
        )
        .then((response) => {
            const { data } = response;
            if (data.error) {
                store.dispatch(setErrorToastAction('Could no autherntificate'));
            }
            // console.log('AUTH RESPONCE HERE', authResponse.roleId);
            data.accessToken = authResponse.accessToken;
            data.expirationTime = authResponse.data_access_expiration_time;
            if (authResponse.email) {
                data.email = authResponse.email;
            }
            if (parseInt(authResponse.roleId) === 1) {
                data.callbackUrl = `${window.location.origin}/${
                    authResponse.locale === 'fr' ? '' : 'en/'
                }dashboard`;
            } else {
                data.callbackUrl = `${window.location.origin}/${
                    authResponse.locale === 'fr' ? '' : 'en/'
                }${parseInt(authResponse.forFree) === 1 ? 'dashboard' : 'pricing'}`;
            }
            data.roleId = authResponse.roleId ? authResponse.roleId : 2;
            data.forFree = authResponse.forFree;
            data.userAccounts = JSON.stringify(data.accounts);
            data.userBusiness = JSON.stringify(data.businesses);
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
