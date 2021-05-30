$(function() {
    var layer = layui.layer;
    var form = layui.form;
    getArticleInfo();
    function getArticleInfo() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章信息失败！')
                }
                var htmlStr = template('articleList',res);
                $('#articleCate').html(htmlStr);
            }
        })
    }

    // 注册点击添加按钮事件；
    var indexadd = null;
    $('#cateAdd').on('click',function(){
        indexadd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title:'添加文章分类',
            content: $('#articleAdd').html()
          });
    })
    // 为确定添加按钮绑定添加事件，并更新列表数据；
    $('body').on('submit','#articleTitle',function(e) {
        //阻止默认提交行为；
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('添加文章分类失败！')
                }
                // 更新文章分类列表
                getArticleInfo() ;
                layer.msg('添加文章分类成功！');
                //关闭弹窗；
                layer.close(indexadd);
            }
        })
    })

    //为编辑按钮绑定编辑事件；
    var indexEdit = null;
    $('#articleCate').on('click','.btn-edit',function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title:'修改文章分类',
            content: $('#articleEdit').html()
          });
        //获取所在行的id值；
        var id = $(this).attr('data-id');
        //发起ajax请求修改服务器数据；
        $.ajax({
            method:'GET',
            url:'/my/article/cates/' + id ,
            success:function(res) {
                form.val('form-edit',res.data);
            }
        })
    })

    //通过事件代理为确认修改按钮注册修改事件；
    $('body').on('submit','#formEdit',function(e) {
        // 阻止表单的默认提交行为；
        e.preventDefault();
        //发起ajax请求；
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新数据失败！')
                }
                layer.msg('更新数据成功！')
                //关闭弹出窗；
                layer.close(indexEdit);
                // 更新数据；
                getArticleInfo();
            }
        })
    })

    // 点击删除按钮弹出删除的对话框；
    var indexDel = null;
    $('tbody').on('click','.btn-del',function(){
        // 获取当前行的id；
        var id = $(this).attr('data-id');
        layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/' + id,
                success:function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除分组失败！')
                    }
                    layer.msg('删除分类成功！')
                    getArticleInfo();
                }
            })
            
            layer.close(index);
          });
    })

})