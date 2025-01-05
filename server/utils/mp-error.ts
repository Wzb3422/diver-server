import {
    StatusCodes,
    getReasonPhrase,
} from 'http-status-codes';

/** throw error when found errcode */
export const handleMpError = (resJson: any) => {
    if (resJson?.errcode) {
        const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        throw createError({
            status: statusCode,
            statusMessage: getReasonPhrase(statusCode),
            message: resJson?.errmsg,
            data: resJson,
        })
    }
}
