import axios from 'axios';
import RouteConfig from '../config/route';

export function add(request) {
    const data = axios.post(RouteConfig.job.index, request).then(res => {
        return res.data;
    });

    return data;
}

export function info(request) {
    const data = axios.post(RouteConfig.job.info, request).then(res => {
        return res.data;
    });

    return data;
}

export function update(request) {
    const data = axios.put(RouteConfig.job.index, request).then(res => {
        return res.data;
    });

    return data;
}
