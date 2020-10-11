$(function() {
    template.defaults.imports.dataFormat = function(dtstr) {
        var dt = new Date(dtstr);
        var y = zero(dt.getFullYear());
        var m = zero(dt.getMonth() + 1);
        var d = zero(dt.getDate());
        var hh = zero(dt.getHours());
        var mm = zero(dt.getMinutes());
        var ss = zero(dt.getSeconds())
        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ":" + ss
    }

    function zero(n) {
        return n > 9 ? n : '0' + n
    }
    // 1.定义提交参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据
        cate_id: "", //文章分类的id
        state: "" //文章的状态，可选值有：已发布、草稿
    };
    var layer = layui.layer;
    var form = layui.form
    initTable();
    initCate()

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                console.log(res.data);
                var str = template('tpl-table', res);
                $('tbody').html(str);
                renderPage(res.total);
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                console.log(res);
                var str = template('tpl-cate', res);
                $('[name=cate_id]').html(str)
                    // 通知layui重新渲染表单区域的结构
                form.render()
            }
        })
    }
    //    4.筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        q.state = state;
        q.cate_id = cate_id;
        initTable()
    })
    var laypage = layui.laypage;
    // 5.分页
    function renderPage(total) {
        // 渲染分页结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum, //第几页
            // 分页模块设置,显示那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页显示多少条数据的选择器
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调 undefined
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调 true
            jump: function(obj, first) {
                // obj包含了当前分页的所有参数,比如:
                // console.log(first,obj.curr,obj.limit );
                //  赋值页面
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 首次不执行
                if (!first) {
                    initTable()
                }
            }
        });
    }
    // 6.删除
    var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length;
        var Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }

                    layer.msg('恭喜您,删除成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                    layer.close(index)
                }
            });



        })
    })
})