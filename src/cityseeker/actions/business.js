// import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import store from '../../store';
import RouteConfig from '../config/route';
import Log from '../utils/log';

function nearbyBusiness(request) {
    const data = axios.post(RouteConfig.business.list, request).then(res => {
        return res.data;
    });

    return data;
}

function info(request) {
    const data = axios.post(RouteConfig.business.info, request).then(res => {
        return res.data;
    });

    return data;
}

function send_email_code(email) {
    const state = store.getState();

    const data = axios
        .post(RouteConfig.business.verifyCode, {
            email,
            locale: state.system.locale,
        })
        .then(res => {
            return res.data;
        });

    return data;
}

function update_business(request) {
    const data = axios.put(RouteConfig.business.index, request).then(res => {
        return res.data;
    });

    return data;
}

function update(request) {
    const data = axios.put(RouteConfig.business.index, request).then(res => {
        return res.data;
    });

    return data;
}

function user_exist(request) {
    const data = axios.post(RouteConfig.business.exist, request).then(res => {
        return res.data;
    });

    return data;
}

function update_avator(request) {
    const data = axios.put(RouteConfig.business.avator, request).then(res => {
        return res.data;
    });

    return data;
}

function update_cover(request) {
    const data = axios.put(RouteConfig.business.cover, request).then(res => {
        return res.data;
    });

    return data;
}

function update_resume(request) {
    // return RNFetchBlob.fetch(
    //     'POST',
    //     RouteConfig.business.resume,
    //     {
    //         'Content-Type': 'multipart/form-data',
    //     },
    //     request,
    // )
    //     .then(res => {
    //         return JSON.parse(res.data);
    //     })
    //     .catch(e => {
    //         Log(e);
    //     });

    const data = axios
        .post(RouteConfig.business.resume, request, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(res => {
            return res.data;
        })
        .catch(e => Log(e));

    return data;
}

function username_check(username) {
    const data = axios
        .post(RouteConfig.business.check.username, {username})
        .then(res => {
            return res.data;
        });

    return data;
}

function email_check(email) {
    const data = axios
        .post(RouteConfig.business.check.email, {email})
        .then(res => {
            return res.data;
        });

    return data;
}

function phone_check(phone) {
    const data = axios
        .post(RouteConfig.business.check.phone, {phone})
        .then(res => {
            return res.data;
        });

    return data;
}

module.exports = {
    nearbyBusiness,
    info,
    update_business,
    update,
    user_exist,
    update_avator,
    update_cover,
    update_resume,
    send_email_code,
    username_check,
    email_check,
    phone_check,
};
