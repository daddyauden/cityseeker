import axios from 'axios';
import RouteConfig from '../config/route';

function add(request) {
    const data = axios.post(RouteConfig.feed.add, request).then(res => {
        return res.data;
    });

    return data;
}

function info(request) {
    const data = axios.post(RouteConfig.feed.info, request).then(res => {
        return res.data;
    });

    return data;
}

module.exports = {
    add,
    info,
};
