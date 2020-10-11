$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
        // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        // 5.设置图片
    $('#coverFile').change(function(e) {
        // e.target指的是#coverFile 改变的是谁,e.target就是谁
        var file = e.target.files[0];
        if (file == undefined) {
            return layer.msg('获取失败')
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 6.设置状态
    var state = "已发布";
    $('#btnSave2').on('click', function() {
            state = "草稿";
        })
        // 7.添加文章
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 创建formdata对象,收集数据
        var fd = new FormData(this);
        // 放入状态
        fd.append('state', state);
        // 放入图片
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //  将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                console.log(...fd);
                //  发起 ajax 数据请求
                publishArticle(fd)
            })

    })

    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)

                }
                layer.msg('恭喜您,添加文章成功,跳转中...')
                setTimeout(function() {
                    window.parent.document.querySelector('#art_list').click()
                }, 1500)
            }
        })
    }
})