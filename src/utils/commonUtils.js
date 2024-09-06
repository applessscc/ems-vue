import httpRequest from '@/utils/httpRequest'
import $ from 'jquery'

export function saveVisitLog(operation) {
    let visitUrl = window.location.href;
    let params = {
        operation: operation,
        method: 'report',
        params: visitUrl
    };
    httpRequest({
        url: httpRequest.adornUrl('/report/electricitybu/saveVisitLog'),
        method: 'post',
        data: httpRequest.adornData(params)
    }).then(({ data }) => {
        console.log(data);
    })
}

export function getDictParams(code) {
    var result = [];
    if (!code) return result;
    //获取缓存的数据字典
    var storageDict = sessionStorage.getItem("dict_code_" + code);
    if (storageDict) {
        return JSON.parse(storageDict);
    }
    //请求后台获取数据字典
    $.ajax({
        url: httpRequest.adornUrl('/sys/dictitem/list'),
        method: 'get',
        async: false,
        data: {
            page: 1,
            limit: 1000,
            code: code
        },
        success: (data) => {
            if (data && data.code === 0) {
                result = data.page.list;
                sessionStorage.setItem("dict_code_" + code, JSON.stringify(result));
            } else {
                console.log(data);
            }
        },
        error: (res) => {
            console.log(res);
        }
    })

    return result;
}