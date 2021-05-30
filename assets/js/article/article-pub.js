$(function() {
    var layer = layui.layer;
    var form = layui.form;

    getArticleCate();
    // 初始化富文本编辑器
    initEditor();
    // 更新文章类别
    function getArticleCate() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0) {
                  return  layer.msg('获取文章类别失败！')
                }
                var  htmlStr = template('tpl-cate',res);
                $('[name = cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 实现图片裁剪效果
     // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 实现上传图片功能；
    $('#upload').on('click',function() {
        $('#uplodeBtn').click();
     })
    // 监听文件选择框的change事件
    $('#uplodeBtn').on('change',function(e){
        // 拿到用户上传的文件；
        var file = e.target.files[0];
        // 判断用户是否上传了文件；
        if(!file){
            return;
        }
        // 将文件转换为url地址；
        var newImgURL = URL.createObjectURL(file);
        // 销毁原来的图片，并将新的图片渲染到裁剪区；
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态；
    var art_state = '已发布';

    // 将文章存为草稿；
    $('#draft').on('click',function(){
        art_state = '草稿';
    })

    //为表单绑定提交功能；
    $('#art-pub').on('submit',function(e) {
        // 1.阻止表单的默认提交行为；
        e.preventDefault();
        //2. 获取表单的数据；
        var fd = new FormData($(this)[0]);
        // 3.将发布状态添加到fd中；
        fd.append('state',art_state);
        // 4.将封面转换为一个文件；
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 将文件存到fd中；
                fd.append('cover_img',blob);
                // 发起ajax请求，将文章数据存到服务器；
                releaseArticle(fd);
                
            })
            
    })

    //发起ajax请求；
    function  releaseArticle(fd) {
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data: fd,
            //向服务器发送formData请求时，必须添加以下两个配置项；
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！');
                // 发布文章后，自动跳转到文章列表页面；
                location.href = '/article/article-list.html';
            }
        })
    }

   
})