import axios from 'axios';
import RouteConfig from '../config/route';

function create(request) {
    const data = axios.post(RouteConfig.item.index, request).then(res => {
        return res.data;
    });

    return data;
}

function info(request) {
    const data = axios.post(RouteConfig.item.info, request).then(res => {
        return res.data;
    });

    return data;
}

function update(request) {
    const data = axios.put(RouteConfig.item.index, request).then(res => {
        return res.data;
    });

    return data;
}

function update_banner(data) {
    const banner = axios.put(RouteConfig.item.banner, data).then(res => {
        return res.data;
    });

    return banner;
}

module.exports = {
    create,
    info,
    update,
    update_banner,
};
