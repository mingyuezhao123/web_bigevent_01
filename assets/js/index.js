$(function() {
        getUserInfo();
        var layer = layui.layer
            // 点击按钮，实现退出功能  
        $('#btnLogout').on('click', function() {
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                //do something      // 1. 清空本地存储中的 token     
                localStorage.removeItem('token')
                    // 2. 重新跳转到登录页面     
                location.href = '/login.html'
                    // 关闭 confirm 询问框      
                layer.close(index)
            })
        })
    })
    // 获取用户的基本信息

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 渲染用户头像
            renderAvatar(res.data)
        },
        // 无论成功或者失败,都会触发complete方法
        // complete: function(res) {
        //     console.log(res);
        //     //判断:如果身份认证失败,跳转回登录页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token');
        //         location.href = '/login.html'
        //     }

        // }
    })
}

function renderAvatar(user) {
    //   1.获取用户的名称
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}