import axios from 'axios';
import env from '../config/env';
import common from './common';

let util = {

};
util.title = function (title) {
    title = title ? title : '驮道后台管理系统';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    common.website :
    env === 'production' ?
    common.website :
    common.website;

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

export default util;