import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/api`;

export async function getPageData(slug: string) {
    const res = await fetch(`${baseUrl}/pages?slug=${slug}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    });
    const resp = await res.json();
    if (res.ok && resp.data) {
        return resp.data;
    } else {
        return {};
    }
}

export async function getAllPages() {
    const res = await fetch(`${baseUrl}/pages/all`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    });
    const resp = await res.json();
    if (res.ok && resp.data) {
        return resp.data;
    } else {
        return {};
    }
}
