/**
 * Smart PHP Calendar
 *
 * Copyright (c) 2012 Yasin Dagli, Smart PHP Calendar, All rights reserved.
 *
 * This file is protected by international laws. Reverse engineering this file is strictly prohibited.
 */
$(function () {
    SPC.version = "1.6";
    SPC.today = SPC.currentDate;
    SPC.LAST_ACTION = "";
    SPC.ns = function (a) {
        for(var a = a.split("."), b = window, c = 0, d = a.length; c < d; c++) "object" !== typeof b[a[c]] && (b[a[c]] = {}), b = b[a[c]]
    };
    SPC.require = function (a) {
        var b = document.getElementsByTagName("head")[0],
            c = document.createElement("script");
        c.setAttribute("src", a);
        c.setAttribute("async", !0);
        b.appendChild(c)
    };
    SPC.getUserPref = function (a, b) {
        return b ? SPC.userPrefs[b][a] : SPC.userPrefs[a]
    };
    SPC.ns("SPC.Core");
    SPC.Dom = {};
    SPC.jQuery = {};
    SPC.ns("SPC.Calendar.Timeline");
    SPC.Calendar.Dom = {};
    SPC.Calendar.jQuery = {};
    SPC.Calendar.Event = {};
    SPC.Calendar.Plugins = {};
    SPC.jQuery.window = $(window);
    SPC.jQuery.document = $(document);
    SPC.jQuery.body = $(document.body);
    SPC.jQuery.appWrapper = $("#spc-app-wrapper");
    SPC.Core.ALPHABET = (window.spcAlphabet || "ABCDEFGHIJKLMNOPQRSTUVWXYZ#").split("");
    SPC.SYSTEM_LANGUAGE = SPC.userPrefs.language;
    SPC.USERID = +SPC.userPrefs.id;
    SPC.ADMINID = +SPC.userPrefs.admin_id;
    SPC.USERNAME = SPC.userPrefs.username;
    SPC.USER_EMAIL = SPC.userPrefs.email;
    SPC.USER_ROLE = SPC.userPrefs.role;
    SPC.USER_TIMEFORMAT = SPC.getUserPref("timeformat", "calendar");
    SPC.Calendar.START_DAY_OF_WEEK = 0;
    "Monday" == SPC.userPrefs.calendar.start_day ? SPC.Calendar.START_DAY_OF_WEEK = 1 : "Saturday" == SPC.userPrefs.calendar.start_day && (SPC.Calendar.START_DAY_OF_WEEK = 6);
    SPC.SCROLLBAR_WIDTH = function () {
        var a = 0,
            b = $("<div />").css({
                width: 100,
                height: 100,
                overflow: "auto",
                position: "absolute",
                top: -1E3,
                left: -1E3
            }).prependTo("body").append("<div />").find("div").css({
                width: "100%",
                height: 200
            }),
            a = 100 - b.width();
        b.parent().remove();
        return a
    }();
    $("#spc-loading-msg").css({
        opacity: 0.6
    });
    SPC.showLoadingMsg = !0;
    SPC.Loading = function (a) {
        SPC.showLoadingMsg == false ? SPC.showLoadingMsg = true : a ? $("#spc-loading-msg").hide() : $("#spc-loading-msg").show()
    };
    SPC.checkPermission = function (a) {
        if(SPC.userPrefs.permissions[a] == "0") {
            SPC.flashMsg(SPC.translate("You do not have permission to do this operation!"), "error");
            return false
        }
        return true
    };
    $.ajaxSetup({
        type: "POST",
        dataType: "json",
        cache: !1,
        url: SPC.ENGINE_PATH || "SpcEngine.php",
        error: function () {},
        beforeSend: function () {
            /mobile/.test(SPC.sender) ? $.mobile.showPageLoadingMsg() : $("#spc-ajax-loader").show()
        },
        complete: function () {
            /mobile/.test(SPC.sender) ? $.mobile.hidePageLoadingMsg() : $("#spc-ajax-loader").hide()
        },
        converters: {}
    });
    $.ajaxPrefilter(function (a, b) {
        SPC.Calendar.Timeline.setCurScrollPositions && SPC.Calendar.Timeline.setCurScrollPositions();
        var c = $.extend(a.data, b.data, {
            sender: SPC.sender
        }, {
            spcUserData: SPC.userData
        });
        a.data = $.param(c);
        var d = b.success;
        a.success = function (a) {
            a.success == false ? SPC.flashMsg(a.errorMsg, "error") : d(a)
        }
    });
    SPC.ajax = function (a, b, c) {
        return $.ajax({
            data: {
                spcAppRequest: a,
                params: b
            },
            success: function (a) {
                c(a)
            }
        })
    };
    SPC.evalJsonResponse = function (a, b) {
        a.success == false ? SPC.flashMsg(a.errorMsg, "error") : b()
    };
    SPC.translate = function (a, b) {
        if(!SPC.i18n[a]) {
            SPC.flashMsg("Undefined key: " + a, "error");
            throw {
                error: "Undefined key: " + a
            };
        }
        var c = SPC.i18n[a];
        b === void 0 && (b = true);
        return b ? c.substr(0, 1).toUpperCase() + c.substr(1) : c
    };
    SPC.jQuery.body.prepend("<div id='spc-ajax-loader' style='display: none;'></div>");
    $("#spc-ajax-loader").css({
        opacity: 0.1
    });
    SPC.jQuery.body.delegate("#spc-refresh", "click", function () {
        SPC.Calendar.refresh()
    }).delegate("#search-form", "submit", function () {
        $("#do-search").trigger("click");
        return false
    });
    $("#logout").click(function () {
        $.ajax({
            data: {
                spcAppRequest: "core/login/logout"
            },
            success: function () {
                window.location.reload()
            }
        })
    })
});