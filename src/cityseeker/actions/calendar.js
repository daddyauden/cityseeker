import axios from 'axios';
import RouteConfig from '../config/route';

function eventList(request) {
    const data = axios.post(RouteConfig.calendar.events, request).then(res => {
        return res.data;
    });

    return data;
}

module.exports = {
    eventList,
};
