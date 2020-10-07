$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义验证规则
    var form = layui.form;
    form.verify({
        // 密码规则  自定义
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须6-16位,且不能输入空格"
        ],
        // 确认密码规则
        repwd: function(value) {
            var pwd = $(".reg-box input[name=password]").val();
            // 比较
            if (value !== pwd) {
                return "两次输入密码不一致!"
            }
        }

    })

    // 注册功能
    var layer = layui.layer;
    $('#form_reg').on('submit', function(e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录!');
                // 手动切换到登录表单
                $('#link_login').click();

            }
        })
    })

    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您,登陆成功')
                localStorage.setItem('token', res.token)
                location.href = "/index.html"
            }
        })
    })
})