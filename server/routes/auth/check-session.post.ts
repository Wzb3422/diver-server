import z from 'zod'
import qs from 'querystring'
import { appid, appSecret, jwtSecret } from '~/constants';
import {
    StatusCodes,
    ReasonPhrases,
    getReasonPhrase,
} from 'http-status-codes';
import jwt from 'jsonwebtoken'
import { getAccessToken } from '~/utils/access-token'
import crypto from 'crypto'

const invalidTokenError = createError({
    status: StatusCodes.UNAUTHORIZED,
    statusMessage: getReasonPhrase(StatusCodes.UNAUTHORIZED),
    message: ReasonPhrases.UNAUTHORIZED,
})

export default eventHandler(async (event) => {
    const tokenFromHeader = event.headers.get('Authorization')
    const accessToken = await getAccessToken()

    if (!tokenFromHeader) {
        throw invalidTokenError
    }

    const jwtPayload = jwt.verify(tokenFromHeader, jwtSecret)
    console.log('jwtPayload', jwtPayload)

    const signature = crypto
        .createHmac('sha256', '')
        .update(message)
        .digest('hex');
    // https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/checkSessionKey.html
    const url = 'https://api.weixin.qq.com/wxa/checksession'
    const res = await fetch(`${url}?${qs.stringify({
        appid,
        secret: appSecret,
        js_code: code,
        grant_type: 'authorization_code'
    })}`, {
        method: 'GET'
    })
    const resObj = await res.json()
    if (resObj?.errcode) {

    }

    console.log('resObj', resObj)

    return {
        message: 'ok',
    };
});
