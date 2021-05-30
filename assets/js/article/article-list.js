$(function() {
    // 初始化变量；
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义时间格式函数
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth()+ 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零函数；
    function padZero(n) {
        return n > 9 ? n : '0' + n ;
    }

    //定义请求数据模式；
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    getTableInfo();
    getarticleCate();
    // 发起ajax请求获取服务器数据
    function getTableInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败！')
            }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table',res);
                $('#article-list').html(htmlStr);
                pageRender(res.total)//调用页面切换函数；
            }
        })
    }

    // 获取文章类别的数据请求函数；
    function getarticleCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                // 渲染数据
                var htmlStr = template('tpl-select',res);
                $('[name = cate_id]').html(htmlStr)
                //通过layUI重新渲染数据：
                form.render();
            }
        })
    }

    // 未筛选按钮绑定筛选事件；
    $('#form-search').on('submit',function(e) {
        // 阻止表单的默认提交行为；
        e.preventDefault();
        // 更新q对象的值；
        var cate_id = $('[name = cate_id]').val();
        var states = $('[name = state]').val();
        q.cate_id = cate_id;
        q.state = states;
        //重新发起获取文章列表请求；
        getTableInfo();
    })

    // 通过laypage.render()方法设置页面切换功能；
    function pageRender(total){
        laypage.render({
            elem: 'laypage' ,//指定存放的容器；
            count: total ,//数据总数，从服务端得到
            limit:q.pagesize,//每页显示的数量
            limits:[2,3,5,10],//每页显示数目的选项卡；
            curr:q.pagenum,
            layout:['count','limit','prev', 'page', 'next','skip'],
            jump: function(obj, first){
                // 更新q的数据；
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                //处罚jump的方式有两种；
                //1.点击页码的时候回处罚jump回调；
                //2.只要触发了laypage。render（）方法就会触发jump回调；
                //可以通过first的值来确定是通过哪种方式触发的函数回调；
                //如果first的值是true，则通过方式2来触发，
                //如果first的值不是true，那就是通过方式1来触发回调；
                if(!first) {
                    getTableInfo();
                }
              }
          });
    }
    // 通过代理的形式，为删除按钮绑定点击事件处理函数；
    $('#article-list').on('click','.btn-del',function(){
        // 获取到文章的id值；
        var id = $(this).attr('data-id');
        var len = $('.btn-del').length;
        // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
        $.ajax({
          method: 'GET',
          url: '/my/article/delete/' + id,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('删除文章失败！')
            }
            layer.msg('删除文章成功！')
            // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
            // 如果没有剩余的数据了,则让页码值 -1 之后,
            // 再重新调用 initTable 方法
            // 4
            if (len === 1) {
              // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
              // 页码值最小必须是 1
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            }
            getTableInfo();
          }
        })
  
        layer.close(index)
      })
    })

    // 通过事件代理为编辑按钮注册编辑功能
    $('#article-list').on('click','.btn-edit',function(){
       location.href = '/article/aticle-pub.html' ;
       
    })
})