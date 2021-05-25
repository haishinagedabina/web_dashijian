$(function () {
    
    getUserInfo();

    var layer = layui.layer;
    //注册点击退出事件；
    $('.loGout').on('click',function() {
        //提示用户是否确定退出；
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' },
        function(index) {
            //1.清空本地存储；
            localStorage.removeItem('token');
            // 2.跳转到登录页面；
            location.href = '/login.html';
            // 3.关闭confirm提示框
            layer.close(index);
        })
    })
})



// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      // headers 就是请求头配置对象
    //   headers: {
    //     Authorization: localStorage.getItem('token') || ''
    //   },
      success: function(res) {
        if (res.status !== 0) {
          return layui.layer.msg('获取用户信息失败！')
        }
        // 调用 renderAvatar 渲染用户的头像
        renderAvatar(res.data);
      }
    })
  }

  function renderAvatar(user) {
    // 1.获取用户的名称；
    var name = user.nickname? user.nickname : user.username;
    // 2.将用户名填充至欢迎板块；
    $('.username').html('欢迎&nbsp;&nbsp;'+ name);
    //3.渲染头像；
    if(user.user_pic !== null) {
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    }else {
        
        $('.layui-nav-img').hide();
        //渲染头像文字；
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
  }