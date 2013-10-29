/**
 * Smart PHP Calendar
 *
 * Copyright (c) 2012 Yasin Dagli, Smart PHP Calendar, All rights reserved.
 *
 * This file is protected by international laws. Reverse engineering this file is strictly prohibited.
 */
$(function () {
    $("#do-login").bind("click", function () {
        var c = $("#username").val(),
            b = $("#password").val();
        $("#statusMsg").addClass("error").text("Please wait.").slideDown("slow");
        if("" == c || "" == b) return $("#statusMsg").addClass("error").text("Please type your username and password.").slideDown("slow"), !1;
        $.ajax({
            type: "post",
            dataType: "json",
            url: "AdcpEngine.php",
            data: {
                sender: "login",
                doLogin: !0,
                adcpAppRequest: "core/login/checkLogin",
                params: [c, b]
            },
            success: function (a) {
                if(!1 === a.success) $("#statusMsg").addClass("error").text(a.errorMsg).slideDown("slow");
                else {
                    a: {
                        for(var a = window.navigator.userAgent, b = ["android", "iphone", "ipad", "blackberry", "palm"], c = RegExp(""), d = 0; d < b.length; d++) if(c.compile(b[d], "i"), c.test(a)) {
                            a = !0;
                            break a;
                        }
                        a = !1;
                    }
                    a ? window.location.href = "m" : (a = window.location.toString().split("/"), a.pop(), a = a.join("/"), window.location.href = a);
                }
            }
        });
        return !1;
    });
    $("#do-register").bind("click", function () {
        var c = $("#username_register").val(),
	        b = $("#password_register").val(),
	        d = $("#password_register_confirm").val(),
	        e = $("#email_register").val(),
        	f = {'password' :b , 'username' : c , 'email' : e };
        
        $("#statusMsg_register").addClass("error").text("Please wait.").slideDown("slow");
        if("" == c || "" == b || "" == d || "" == e) return $("#statusMsg_register").addClass("error").text("Please type all the fields.").slideDown("slow"), !1;
        if(b!==d) return $("#statusMsg_register").addClass("error").text("The two passwords doesn't match.").slideDown("slow"), !1;
        $.ajax({
            type: "post",
            dataType: "json",
            url: "AdcpEngine.php",
            data: {
                sender: "login",
                doLogin: !0,
                adcpAppRequest: "core/user/createUser",
                params: [f]
            },
            success: function (a) {
                if(!1 === a.success) $("#statusMsg_register").addClass("error").text(a.errorMsg).slideDown("slow");
                else {
                    a: {
                        for(var a = window.navigator.userAgent, b = ["android", "iphone", "ipad", "blackberry", "palm"], c = RegExp(""), d = 0; d < b.length; d++) if(c.compile(b[d], "i"), c.test(a)) {
                            a = !0;
                            break a;
                        }
                        a = !1;
                    }
                    a ? window.location.href = "m" : (a = window.location.toString().split("/"), a.pop(), a = a.join("/"), window.location.href = a);
                }
            }
        });
        return !1;
    });
    $("#forgot-pass").on("click", function () {
        $("#reset-pass-dialog").dialog("open");
    });
    $("#reset-pass-dialog").dialog({
        title: "Reset Password",
        autoOpen: !1,
        modal: !0,
        buttons: {
            Cancel: function () {
                $("#reset-pass-dialog").dialog("close");
            },
            "Reset Password": function () {
                var c = $("#reset-pass-dialog-email").val();
                $("#reset-pass-dialog").dialog("close");
                $("#statusMsg").addClass("error").text("Please wait...").slideDown("slow");
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: "AdcpEngine.php",
                    data: {
                        sender: "login",
                        doLogin: !0,
                        adcpAppRequest: "core/login/resetPass",
                        params: [c]
                    },
                    success: function (b) {
                        !1 === b.success ? $("#statusMsg").addClass("error").text(b.errorMsg).slideDown("slow") : $("#statusMsg").addClass("error").text("Your new password has been sent to your email.").slideDown("slow");
                    }
                })
            }
        }
    })
});