import { appid, appSecret, jwtSecret } from '~/constants';
import qs from 'querystring'
import dayjs from 'dayjs';
import { handleMpError } from './mp-error';

let accessToken = ''
let expirationTimestamp = 0

const isExpired = () => {
    const now = dayjs().unix()
    return now > expirationTimestamp
}

export const getAccessToken = async () => {
    if (accessToken && !isExpired()) {
        return accessToken
    }
    const url = 'https://api.weixin.qq.com/cgi-bin/token';
    const res = await fetch(`${url}?${qs.stringify({
        appid,
        secret: appSecret,
        grant_type: 'client_credential'
    })}`, {
        method: 'GET'
    })
    const resObj = await res.json()

    handleMpError(resObj)

    accessToken = resObj.access_token
    expirationTimestamp = dayjs().unix() + resObj.expires_in - 180 // 提前 3 分钟刷新 access_token

    return accessToken
}
