import axios from 'axios';
import RouteConfig from '../config/route';

export function add(request) {
    const data = axios.post(RouteConfig.complain.add, request).then(res => {
        return res.data;
    });

    return data;
}
