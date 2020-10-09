$(function() {
    var form = layui.form;
    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            samePwd: function(value) {
                if (value == $('[name=oldPwd]').val()) {
                    return '原密码和新密码不能相同'
                }
            },
            rePwd: function(value) {
                if (value !== $('[name=newPwd]').val()) {
                    return '两次新密码输入不一致'
                }
            }
        })
        // 2.表单提交
    $('.layui-form').on('submit', function(e) {
        // 阻止默认行为(同步提交行为 form表单的action 同步提交会刷新页面 而且数据是空的)
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('更新密码成功');
                $('.layui-form')[0].reset()
            }

        })
    })
})