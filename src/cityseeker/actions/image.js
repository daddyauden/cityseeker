import axios from 'axios';
import RouteConfig from '../config/route';

function list(request) {
    const data = axios.post(RouteConfig.image.list, request).then(res => {
        return res.data;
    });

    return data;
}

function remove(request) {
    const data = axios
        .delete(RouteConfig.image.delete, {
            data: request,
        })
        .then(res => {
            return res.data;
        });

    return data;
}

function addBusinessAlbum(data) {
    const images = axios.post(RouteConfig.image.business, data).then(res => {
        return res.data;
    });

    return images;
}

function addItemAlbum(data) {
    const images = axios.post(RouteConfig.image.item, data).then(res => {
        return res.data;
    });

    return images;
}

module.exports = {
    list,
    remove,
    addBusinessAlbum,
    addItemAlbum,
};
