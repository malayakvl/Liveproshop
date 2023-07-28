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
    const { authResponse } = await new Promise(window.FB.login);
    store.dispatch(syncFbAction(authResponse));
}

async function registerFB(paramData) {
    const infoParam = paramData.split('_');
    const roleId = infoParam[0] ? infoParam[0] : 2;
    const locale = infoParam[1];
    const forFree = infoParam[2];
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
    // const authResponse = {
    //     accessToken:
    //         'EAArS9KI0vagBAGRrb0gSuSgMOfsuEZBM8InZCyVf0JcKCE2RVmRc5NZCfGs3zNR5zIrxMdzc7baTo2Gra9LLYKcZAZB40ZBpmWU1xpZB3kWJtBgRA7Ge1ZAqJx8wvZAGMidWimhyzHrtsz0pyNAjUxXhtOXLUJaFv7MGYyPf9QskObO5TCsBjbP6yxkJGHFbOxSXRwyoiSH3nCC8MZCEZB7tSzm',
    //     userID: '2763630843946760',
    //     expiresIn: 5541,
    //     signedRequest:
    //         'UVLZg3i-hV26oubUREkooPPLh97OGsyOubTKhBpOQPE.eyJ1c2VyX2lkIjoiMjc2MzYzMDg0Mzk0Njc2MCIsImNvZGUiOiJBUURUa0F3TVpuNjRtQlNzdXV6XzFsdmEtVlNKVGtwblVQNEcyTE5wNEhocGNNMUJidDR0ci1pZUNjVUpydWNwREZhWndDTnBEdFhjeHA0dnhUaGtjbEZjSkZZTGxwSG1QUF95TW9GQ2pHRThac0U1NlRlc0t6bnlwbDZxR0dmUW1STVF6U1hMVWRDZ0tMcTBlZmI5enRCVDNVWERYeXVCcFNFSnkzX3YxcXNyZnAwR2JLOUhMM0J0LVBFUl9ock1oQkRCUFRkNHZfUmFZcmZ3ZjlnbTdQNU5BamxhalRsajViTHVDY3Z0UWlpWU94QThyaFRyUkhaXzZPVkt4ZlFZeG15WENRVk5SMUNIczNuVEQydDZKRm0zRDZrSi1PczU5UEwzLUZCaFZ2WklsaFlOa0FRREd4LWpxMFBqUDdaTER0Rk5VWFd4MmQ4ZF8yWm81Q09EOUVpbCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjQzMjAzNjU5fQ',
    //     graphDomain: 'facebook',
    //     data_access_expiration_time: 1651004629
    // };
    if (authResponse) {
        store.dispatch(showLoaderAction(true));
        signIn('credentials_sdkfacebook_login', authResponse);
    } else {
        store.dispatch(setErrorToastAction('Could no autherntificate'));
    }
}

async function loginFBusiness() {
    // login with facebook then authenticate with the API to get a JWT auth token
    FB.login(
        function (response) {
            console.log(response);
        },
        {
            config_id: '1255981128419485' // right
            // configId: '<CONFIG_ID>' // wrong
        }
    );
    const { authResponse } = await new Promise(window.FB.login);
    if (authResponse) {
        store.dispatch(showLoaderAction(true));
        signIn('credentials_sdkfacebook_login', authResponse);
    } else {
        store.dispatch(setErrorToastAction('Could no autherntificate'));
    }
}

async function getAccountData(authResponse) {
    axios
        .get(
            `https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${authResponse.accessToken}`
        )
        .then((response) => {
            const { data } = response;
            if (data.error) {
                store.dispatch(setErrorToastAction('Could no autherntificate'));
            }
            data.accessToken = authResponse.accessToken;
            // data.providerId = authResponse.userID,
            data.expirationTime = authResponse.data_access_expiration_time;
            // data.callbackUrl = `${window.location.origin}/${
            //     authResponse.locale === 'fr' ? '' : 'en/'
            // }account`;
            data.callbackUrl = `${window.location.origin}/${
                authResponse.locale === 'fr' ? '' : 'en/'
            }${parseInt(authResponse.forFree) === 1 ? 'dashboard' : 'pricing'}`;
            console.log(data.callbackUrl);
            data.roleId = authResponse.roleId ? authResponse.roleId : 2;
            data.forFree = authResponse.forFree;
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
