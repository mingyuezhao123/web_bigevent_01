$(function() {
    // 1.文章类别列表展示
    initArtCateList();
    // 封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                // 传的是对象,用的是属性
                var str = template('tpl-art-cate', res);
                $('tbody').html(str);
            }
        })
    }

    // 2.显示添加文章分类列表
    var layer = layui.layer;
    var form = layui.form
    $('#btnAdd').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                title: '添加文章分类',
                area: ['500px', '250px'],
                content: $('#dialog-add').html()
            })
        })
        // 3.提交文章分类添加(事件委托)
    var indexAdd = null;
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'post',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList();
                    layer.msg('恭喜你,文章类别添加成功!');
                    layer.close(indexAdd)
                }
            })
        })
        // 修改 展示表单
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
                type: 1,
                title: '修改文章分类',
                area: ['500px', '250px'],
                content: $('#dialog-edit').html()
            })
            // 获取Id,发送ajax获取数据,渲染到页面
        var Id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改-提交
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg('恭喜您,文章类别更新成功!');
                layer.close(indexEdit)

            }
        })
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function() {
        var Id = $(this).attr('data-id');
        // 显示对话框
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList();
                    layer.msg('恭喜您,文章类别删除成功!');
                    layer.close(index);
                }
            })
        })
    })

})