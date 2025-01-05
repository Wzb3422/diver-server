import z from 'zod'
import qs from 'querystring'
import { appid, appSecret, jwtSecret } from '~/constants';
import {
    StatusCodes,
    getReasonPhrase,
} from 'http-status-codes';
import jwt from 'jsonwebtoken'
import { handleMpError } from '~/utils/mp-error';

const schema = z.object({
    code: z.string()
})

export default eventHandler(async (event) => {
    const body = await readBody(event)
    const { code } = schema.parse(body)
    // code to session
    const url = 'https://api.weixin.qq.com/sns/jscode2session'
    const res = await fetch(`${url}?${qs.stringify({
        appid,
        secret: appSecret,
        js_code: code,
        grant_type: 'authorization_code'
    })}`, {
        method: 'GET'
    })
    const resObj = await res.json()

    handleMpError(resObj)

    const jwtPayload = {
        sessionKey: resObj.session_key,
        openid: resObj.openid,
    }

    const token = jwt.sign(jwtPayload, jwtSecret)

    return {
        token,
    };
});
