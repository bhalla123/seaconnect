 
const get = (res, resData, message) => {
    return res.json({
        success: true,
        code: 200,
        message: message,
        data: resData
    });
}

const post = (res, resData,message) => {
    return res.json({
        success: true,
        code: 200,
        message: message,
        data: resData
    });
}

const del = (res, resData , message) => {
    return res.json({
        success: true,
        code: 200,
        message: message,
        data: resData
    });
}

const put = (res, resData , message) => {
    return res.json({
        success: true,
        code: 200,
        message: message,
        data: resData
    });
}
const Error = (res, resData, message) => {
    return res.status(400).json({
        success: false,
        code: 400,
        message: message,
    });
}

const getError = (err, message) => {
    return {
        success: false,
        code: 400,
        message: message,
        //data:err
    };
}

const successWithoutData = (res, message) => {
    return res.status(200).json({
        success: true,
        code: 200,
        message: message
    });
}

const unauthorized = (res, message) => {
    return res.status(401).json({
        success: false,
        code: 401,
        message: 'User is Unauthorized',
        data: {}
    });
}

const onError = (res, err, message) => {
    return res.status(400).json(getError(err,message));
}

module.exports = {
    get,
    post,
    put,
    del,
    onError,
    unauthorized,
    Error,
    successWithoutData
}
