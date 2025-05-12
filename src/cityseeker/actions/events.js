import axios from 'axios';
import RouteConfig from '../config/route';

function add(request) {
    const data = axios.post(RouteConfig.events.add, request).then(res => {
        return res.data;
    });

    return data;
}

function info(request) {
    const data = axios.post(RouteConfig.events.info, request).then(res => {
        return res.data;
    });

    return data;
}

function list(request) {
    const data = axios.post(RouteConfig.events.list, request).then(res => {
        return res.data;
    });

    return data;
}

function calendar(request) {
    const data = axios.post(RouteConfig.events.calendar, request).then(res => {
        return res.data;
    });

    return data;
}

module.exports = {
    add,
    info,
    list,
    calendar,
};
