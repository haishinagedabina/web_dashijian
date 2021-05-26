$(function() {
    var form = layui.form;
    var layer = layui.layer;

    //设置昵称长度限制；
    form.verify({
        nickname:function(value){
            if(value.length < 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！';
            }
        }
    })
    inituserInfo();

    function inituserInfo() {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取用户数据失败！')
                }
                //快速未表单赋值；调用form.val()；
                form.val('formUserInfo',res.data)
            }
        })
    }

    //重置表单的数据；
    $('.btnResert').on('click',function(e) {
        //阻止表单的默认提交行为；
        e.preventDefault();
        //更新表单的信息；
        inituserInfo();
    })

    // 修改用户信息；
    $('.layui-form').on('submit',function(e) {
        //阻止表单的默认提交行为；
        e.preventDefault();
        // 提交修改信息；
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('更新用户信息失败！')
              }
              layer.msg('更新用户信息成功！')
              // 调用父页面中的方法，重新渲染用户的头像和用户的信息
              window.parent.getUserInfo()
            }
          })
    })
})