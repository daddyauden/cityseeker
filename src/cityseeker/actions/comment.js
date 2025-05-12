import axios from 'axios';
import RouteConfig from '../config/route';

function add(request) {
    return axios.post(RouteConfig.comment.add, request).then(res => {
        return res.data;
    });
}

module.exports = {
    add,
};
