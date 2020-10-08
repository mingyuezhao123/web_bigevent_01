var baseURL = "http://ajax.frontend.itheima.net"

// ajaxPrefilter拦截所有ajax请求:get/post/ajax
$.ajaxPrefilter(function(params) {
    params.url = baseURL + params.url

    // 统一为有权限的my,设置headers请求头
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    params.complete = function(res) {
        //判断:如果身份认证失败,跳转回登录页面
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/login.html'
        }
    }
})