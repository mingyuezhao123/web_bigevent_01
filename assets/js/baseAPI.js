var baseURL = "http://ajax.frontend.itheima.net"

// ajaxPrefilter拦截所有ajax请求:get/post/ajax
$.ajaxPrefilter(function(params) {
    params.url = baseURL + params.url
})