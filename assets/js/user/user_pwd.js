$(function( ) {
    var form = layui.form;

    //自定义表单规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'
        ] ,

        //判断新旧密码是否一致的规则
        samePwd:function(value) {//value指的是应用这个规则的输入栏的值；
            if(value === $('[name = password]').val()){
                return '新密码不能与原密码一致！'
            }
        },
        repwd:function(value) {
            if(value !== $('[name = newpassword]').val()) {
                return '两次密码不一致！';
            }
        }
    })

    //为表单绑定修改密码事件；
    $('.layui-form').on('submit',function(e) {
        // 阻止表单的默认提交功能；
        e.preventDefault();
        //发起ajax请求；
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layui.layer.msg('重置密码失败！'); 
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
        
    })
})