/**
 * Smart PHP Calendar
 *
 * Copyright (c) 2012 Yasin Dagli, Smart PHP Calendar, All rights reserved.
 *
 * This file is protected by international laws. Reverse engineering this file is strictly prohibited.
 */
$(function () {
    function z(b) {
        return b.split("").reverse().join("")
    }

    function w(b) {
        return b.reverse()
    }

    function D(b) {
        var c = [],
            d, e;
        for(e in b) d = 1 == b[e] ? 0 : 1, c.push(d);
        return c.join("")
    }

    function B(b, c) {
        return b != c ? !1 : !0
    }
    var p = window.location.search;
    if(-1 < p.indexOf("?") && /d=([0-9]{4}\-[0-9]{2}\-[0-9]{2})/.test(p)) {
        var r = location.search.match(/d=([0-9]{4}\-[0-9]{2}\-[0-9]{2})/)[1];
        SPC.currentDate = r
    }
    SPC.Calendar.jQuery.SpcCalAppWrapper = $("#smartphpcalendar-wrapper");
    document.getElementById("spc-main-app").onselectstart = function () {
        return !1
    };
    $.ajax({
        data: {
            spcAppRequest: "calendar/calendar/getUserCalendars"
        },
        success: function (b) {
            SPC.USER_CALENDARS = b.userCalendars;
            var c = "";
            SPC.Array.foreach(SPC.USER_CALENDARS, function (b, e) {
                c += "<option value='" + b + "' data-access-key='" + e.access_key + "'>" + e.name + "</option>"
            });
            $("#calendars-settings-dialog-tabs-3-calendar, #calendar-import-export-dialog-export-calendar").html(c).change()
        }
    });
    SPC.Calendar.initCalReminders = function () {
        $.ajax({
            data: {
                spcAppRequest: "calendar/reminder/initCalReminders"
            },
            success: function (b) {
                SPC.defaultReminders = b.defaultReminders;
                SPC.defaultPopupReminderMessages = b.defaultPopupReminderMessages
            }
        })
    };
    SPC.Calendar.initCalReminders();
    SPC.Calendar.TIMESLOT_MINUTE_SIZE = 2 / 3;
    SPC.Calendar.DAY_IN_SECOND = 86400;
    SPC.Calendar.openView = function (b) {
        b = b || SPC.Calendar.currentView;
        $("#spc-cal-" + b + "-view-btn").click()
    };
    SPC.API = {};
    SPC.API.User = {};
    SPC.API.call = function (b, c, d) {
        if("function" === typeof SPC.API.User[b]) return SPC.API.User[b].apply(d, c || [])
    };
    SPC.Calendar.initApi = function (b) {
        SPC.API.User = b
    };
    SPC.getView = function () {
        return SPC.Calendar.currentView
    };
    SPC.changeView = function (b) {
        SPC.Calendar.openView(b)
    };
    SPC.Calendar.refresh = SPC.refresh = function (b) {
        SPC.Calendar.getCalendar(SPC.Calendar.currentView, SPC.currentDate, null, b)
    };
    SPC.Calendar.goDate = function (b, c, d) {
        SPC.currentDate = [b, SPC.Date.dateConverter.padZeroLeft(c), SPC.Date.dateConverter.padZeroLeft(d)].join("-");
        SPC.Calendar.refresh()
    };
    SPC.Calendar.prev = function () {
        $("#cal-pager-prev").trigger("click")
    };
    SPC.Calendar.next = function () {
        $("#cal-pager-next").trigger("click")
    };
    SPC.Calendar.today = function () {
        $("#cal-pager-today").trigger("click")
    };
    SPC.API.getEventDialogState = function (b) {
        var b = b || SPC.Calendar.getActiveEventDialog(),
            c = {
                calendarId: $("#" + b + "-event-dialog-calendar option:selected").val(),
                calendarName: $("#" + b + "-event-dialog-calendar option:selected").text(),
                startDate: $("#" + b + "-event-dialog-start-date").val(),
                startTime: $("#" + b + "-event-dialog-start-time").val(),
                endDate: $("#" + b + "-event-dialog-end-date").val(),
                endTime: $("#" + b + "-event-dialog-end-time").val(),
                title: $("#" + b + "-event-dialog-title").val(),
                location: $("#" + b + "-event-dialog-location").val(),
                description: $("#" + b + "-event-dialog-description").val(),
                image: $("#" + b + "-event-dialog-image").data("name") || "",
                busy: document.getElementById(b + "-event-dialog-availability-busy").checked,
                "public": document.getElementById(b + "-event-dialog-privacy-public").checked,
                repeat: SPC.Calendar.Event.getRepeatOptions(),
                reminders: []
            };
        $("#" + b + "-event-dialog-reminders .reminder").each(function () {
            c.reminders.push({
                type: $(this).find(".type option:selected").val(),
                time: $(this).find(".time").val(),
                timeUnit: $(this).find(".time-type option:selected").val()
            })
        });
        c.eventType = SPC.Calendar.Event.getEventType({
            start_date: c.startDate,
            end_date: c.endDate,
            start_time: c.startTime,
            end_time: c.endTime
        });
        return c
    };
    SPC.API.getEventSummary = function (b) {
        return {
            eventId: b.attr("data-event-id"),
            calendarId: b.attr("data-calendar-id"),
            calendarName: SPC.USER_CALENDARS[b.attr("data-calendar-id")].name,
            startDate: b.attr("data-start-date"),
            startTime: b.attr("data-start-time"),
            endDate: b.attr("data-end-date"),
            endTime: b.attr("data-end-time"),
            title: b.attr("data-title"),
            eventColor: SPC.USER_CALENDARS[b.attr("data-calendar-id")].color
        }
    };
    SPC.activeCalendars = [];
    SPC.Calendar.Dialogs = {};
    SPC.Calendar.Dom.SpcMainApp = document.getElementById("spc-main-app");
    SPC.Calendar.jQuery.SpcMainApp = $(SPC.Calendar.Dom.SpcMainApp);
    SPC.Calendar.Dialogs.addEventDialog = $("#add-event-dialog");
    SPC.Calendar.Dialogs.editEventDialog = $("#edit-event-dialog");
    $("#spc-main-app").height($(window).height() - $("#spc-main-app").offset().top - 3);
    SPC.jQuery.window.bind("resize", function () {
        SPC.eventResizeStart || ($("#spc-main-app").height($(window).height() - $("#spc-main-app").offset().top - 3), SPC.Calendar.refresh())
    });
    SPC.Calendar.startDayOfWeek = 1;
    SPC.Calendar.endDayOfWeek = 0;
    p = $("#start_day").val();
    "Sunday" == p ? (SPC.Calendar.startDayOfWeek = 0, SPC.Calendar.endDayOfWeek = 6) : "Saturday" == p && (SPC.Calendar.startDayOfWeek = 6, SPC.Calendar.endDayOfWeek = 0);
    SPC.sidebarCalendar = $("#sidebar-calendar").datepicker({
        inline: !0,
        dateFormat: "yy-mm-dd",
        changeMonth: !0,
        changeYear: !0,
        firstDay: SPC.Calendar.startDayOfWeek,
        onSelect: function (b) {
            SPC.currentDate = b;
            SPC.Calendar.refresh()
        },
        onChangeMonthYear: function () {
            SPC.Calendar.datePickerSignedDates = []
        }
    });
    SPC.getSidebarCalendarDate = function (b) {
        return SPC.Date.strToObj(b)
    };
    SPC.initSidebarCalendar = function (b) {
        if(!b) b = SPC.currentDate;
        SPC.sidebarCalendar.datepicker("setDate", SPC.getSidebarCalendarDate(b))
    };
    "public" == SPC.sender && ($("#display-event-dialog").dialog({
        title: "Smart PHP Calendar",
        autoOpen: !1,
        modal: !0,
        width: 770,
        height: 400,
        resizable: !0,
        open: function () {
            SPC.API.call("displayEventDialogOpen", [SPC.spcEvent])
        },
        beforeClose: function () {
            SPC.API.call("displayEventDialogBeforeClose", [SPC.spcEvent])
        },
        close: function () {
            SPC.API.call("displayEventDialogClose", [SPC.spcEvent])
        }
    }), SPC.Calendar.handlePublicEvent = function () {
        var b = $(this),
            c = b.attr("data-event-id");
        $.ajax({
            dataType: "json",
            data: {
                spcAppRequest: "calendar/event/getEvent",
                params: [c]
            },
            success: function (c) {
                var c = c.event,
                    e = c.title != "" ? c.title : SPC.translate("(No title)"),
                    g = c.location,
                    h = decodeURIComponent(encodeURIComponent(c.description).replace(/%0A|%0D|%0D%0A/g, "<br />")),
                    k = c.image;
                $("#display-event-dialog").dialog("option", "title", e);
                $("#display-event-dialog-date").html(SPC.Calendar.Event.getPublicEventDateTitle(c));
                $("#display-event-dialog-repeat-parent").hide();
                if(c.repeat_type != "none") {
                    e = "<strong class='field-label'>" + SPC.translate("repeat") + "</strong>: " + SPC.Calendar.Event.Repeat.getRepeatEventSummary(c);
                    $("#display-event-dialog-repeat").html(e);
                    $("#display-event-dialog-repeat-parent").show()
                }
                $("#display-event-dialog-location-parent").hide();
                if(g != "") {
                    g = "<strong>" + SPC.translate("location") + "</strong>:                                    <a                                        href='http://maps.google.com/?q=" + encodeURIComponent(g) + "'                                        target='_blank'>" + g + "</a>";
                    $("#display-event-dialog-location").html(g);
                    $("#display-event-dialog-location-parent").show()
                }
                $("#display-event-dialog-description").html(h);
                $("#display-event-dialog-image-parent").hide();
                if(k != "") {
                    $("#display-event-dialog-image").attr("src",
                    c.imagePath);
                    $("#display-event-dialog-image-parent").show()
                }
                SPC.API.call("eventClick", [SPC.API.getEventSummary(b), B]);
                $("#display-event-dialog").dialog("open")
            }
        })
    });
    "private" == SPC.sender && (SPC.Calendar.handlePrivateEvent = function () {
        SPC.event = this;
        var b = $(this);
        if(/go-date/.test($(B.target).attr("class")) || SPC.eventDragStart === true || SPC.mDown === true || SPC.eventResizeStart === true || SPC.monthEventDrag.dragPhase !== "stop") return false;
        SPC.currentEvent.eventId = b.attr("data-event-id");
        SPC.calendarId = b.attr("data-calendar-id");
        SPC.currentEvent.startDate = b.attr("data-start-date");
        SPC.currentEvent.endDate = b.attr("data-end-date");
        SPC.currentEvent.startTime = b.attr("data-start-time");
        SPC.currentEvent.endTime = b.attr("data-end-time");
        $.ajax({
            data: {
                spcAppRequest: "calendar/event/getEvent",
                params: [SPC.currentEvent.eventId]
            },
            success: function (c) {
                var c = c.event,
                    d = $.extend(SPC.API.getEventSummary(b), c);
                if(SPC.API.call("eventClick", [d, B]) !== false) {
                    SPC.currentEvent.eventTitle = c.title;
                    SPC.currentEvent.location = c.location;
                    SPC.currentEvent.eventDescription = c.description;
                    SPC.currentEvent.available = Number(c.available);
                    SPC.currentEvent._public = Number(c["public"]);
                    SPC.currentEvent.image = c.image;
                    SPC.currentEvent.repeatType = c.repeat_type;
                    SPC.currentEvent.invitation = c.invitation;
                    SPC.currentEvent.invitationEventId = c.invitation_event_id;
                    SPC.currentEvent.invitationCreatorId = c.invitation_creator_id;
                    $("#edit-event-dialog-calendar").val(SPC.calendarId);
                    $("#edit-event-dialog-start-date").val(SPC.Date.dateConverter.coreToUser(SPC.currentEvent.startDate));
                    $("#edit-event-dialog-start-time").val(SPC.Date.convertTimeFormat(SPC.currentEvent.startTime));
                    $("#edit-event-dialog-end-date").val(SPC.Date.dateConverter.coreToUser(SPC.currentEvent.endDate));
                    $("#edit-event-dialog-end-time").val(SPC.Date.convertTimeFormat(SPC.currentEvent.endTime));
                    $("#edit-event-dialog-all-day").attr("checked", false).trigger("change");
                    SPC.currentEvent.startTime == "00:00" && SPC.currentEvent.endTime == "00:00" && $("#edit-event-dialog-all-day").attr("checked", true).trigger("change");
                    $("#edit-event-dialog-title").val(SPC.currentEvent.eventTitle);
                    $("#edit-event-dialog-location").val(SPC.currentEvent.location);
                    $("#edit-event-dialog-description").val(SPC.currentEvent.eventDescription);
                    $("#edit-event-dialog-availability-busy")[0].checked = true;
                    $("#edit-event-dialog-availability-available")[0].checked = Boolean(SPC.currentEvent.available);
                    $("#edit-event-dialog-privacy-private")[0].checked = true;
                    $("#edit-event-dialog-privacy-public")[0].checked = Boolean(SPC.currentEvent._public);
                    $("#edit-event-dialog-availability-busy").trigger("change");
                    $("#edit-event-dialog-privacy-public").trigger("change");
                    $("#edit-event-dialog-reminders .spc-reminder-list").html(SPC.getDefaultReminderBoxes(c.reminders));
                    SPC.addEventImage("edit", c.created_by, SPC.currentEvent.image);
                    $("#edit-event-dialog-repeat .ui-button-text").text(SPC.translate("repeat"));
                    if(c.repeat_type != "none") {
                        SPC.Calendar.Dialogs.repeatEventDialog.state.repeatType = c.repeat_type;
                        SPC.Calendar.Dialogs.repeatEventDialog.state.interval = c.repeat_interval;
                        d = c.repeat_data;
                        if(c.repeat_type == "weekly") {
                            var e = d.split(","),
                                g = [];
                            $.each(e, function (b, c) {
                                g.push(document.getElementById("repeat-event-dialog-weekly-repeat-day-" + c))
                            });
                            SPC.Calendar.Dialogs.repeatEventDialog.state.$weeklyRepeatDaysCheckboxes = $(g)
                        }
                        if(c.repeat_type == "monthly") {
                            SPC.Calendar.Dialogs.repeatEventDialog.state.$monthlyRepeatSpecialOptionRadio = $("#repeat-event-dialog-monthly-repeat-options-day-of-the-month-radio");
                            SPC.Calendar.Dialogs.repeatEventDialog.state.monthlyRepeatDayNumber = SPC.Date.parseDate(SPC.currentEvent.startDate).day;
                            if(d != "") {
                                SPC.Calendar.Dialogs.repeatEventDialog.state.$monthlyRepeatSpecialOptionRadio = $("#repeat-event-dialog-monthly-repeat-options-day-of-the-week-radio");
                                SPC.Calendar.Dialogs.repeatEventDialog.state.monthlyRepeatWeekIndex = +d.substr(0, 1);
                                SPC.Calendar.Dialogs.repeatEventDialog.state.monthlyRepeatDayIndex = +d.substr(1, 1)
                            }
                        }
                        SPC.Calendar.Dialogs.repeatEventDialog.state.occurences = c.repeat_count;
                        SPC.Calendar.Dialogs.repeatEventDialog.state.endDate = c.repeat_end_date == "9999-01-01" ? "" : SPC.Date.dateConverter.coreToUser(c.repeat_end_date);
                        SPC.Calendar.Dialogs.repeatEventDialog.state.$endRadio = $("#repeat-event-dialog-never-radio");
                        if(c.repeat_count != 0) SPC.Calendar.Dialogs.repeatEventDialog.state.$endRadio = $("#repeat-event-dialog-after-radio");
                        if(c.repeat_end_date != "9999-01-01") SPC.Calendar.Dialogs.repeatEventDialog.state.$endRadio = $("#repeat-event-dialog-end-date-radio");
                        $("#edit-event-dialog-repeat .ui-button-text").text(SPC.translate(c.repeat_type))
                    }
                    $("#edit-event-dialog-edit-guests-wrapper").hide();
                    $("#edit-event-dialog .add-event-guests").hide();
                    $("#edit-event-dialog-edit-guests-radio :radio").attr("checked", false).trigger("change");
                    if(SPC.currentEvent.invitation == "1") {
                        $("#edit-event-dialog-edit-guests-wrapper").show();
                        d = c.invitationResponse;
                        d != "pending" && $("#edit-event-dialog-response-invitation-" + d).attr("checked", true).trigger("change")
                    } else $("#edit-event-dialog .add-event-guests").show();
                    $("#edit-event-dialog-created-by-row").hide();
                    if(c.created_by != SPC.USERNAME) {
                        $("#edit-event-dialog-created-by").text(c.created_by);
                        $("#edit-event-dialog-created-by-row").show()
                    }
                    $("#edit-event-dialog-modified-by-row").hide();
                    if(c.modified_by != null && c.modified_by != SPC.USERNAME) {
                        $("#edit-event-dialog-modified-by").text(c.modified_by);
                        $("#edit-event-dialog-modified-by-row").show()
                    }
                    $("#edit-event-dialog").dialog("open")
                }
            }
        })
    });
    $(document.body).delegate(".spc-event", "click", function () {
        SPC.sender == "private" ? SPC.Calendar.handlePrivateEvent.call(this) : SPC.sender == "public" && SPC.Calendar.handlePublicEvent.call(this);
        return false
    });
    SPC.Calendar.Event.getEventTitle = function (b) {
        return b || SPC.translate("(No title)")
    };
    SPC.Calendar.Event.getEventData = function (b) {
        return 'data-event-id="' + b.id + '"\t\t\t\t\t\t data-calendar-id="' + b.cal_id + '"\t\t\t\t\t\t data-start-date="' + b.start_date + '"\t\t\t\t\t\t data-start-time="' + b.start_time + '"\t\t\t\t\t\t data-end-date="' + b.end_date + '"\t\t\t\t\t\t data-end-time="' + b.end_time + '"\t\t\t\t\t\t data-title="' + b.title + '"\t\t\t\t\t\t data-event-color="' + SPC.USER_CALENDARS[b.cal_id].color + '"\t\t\t\t\t\t data-event-type="' + b.type + '"                         data-invitation="' + b.invitation + '"'
    };
    SPC.Calendar.WeekCalScrollPos = 0;
    SPC.Calendar.initWeekCalScroll = function () {
        $("#spc-week-cal-tmpl-wrapper").bind("scroll", function () {
            SPC.Calendar.WeekCalScrollPos = $(this).scrollTop()
        })
    };
    SPC.Calendar.Event.getEventElement = function (b, c, d) {
        var e,
        g = SPC.Calendar.Event.getEventTitle(d.title),
            h, k, i = d.cal_id;
        k = SPC.USER_CALENDARS[i].type;
        var m = SPC.USER_CALENDARS[i].permission,
            s = SPC.USER_CALENDARS[i].color,
            o = SPC.USER_CALENDARS[i].eventTimerangeColor,
            i = SPC.Calendar.Event.getEventData(d),
            n = "",
            p = "",
            u = "";
        d.invitation_event_id != "0" && (m = "see");
        k == "group" && d.created_by == SPC.USERNAME && (m = "change");
        if(SPC.USERNAME != d.created_by) var t = d.created_by;
        k = t ? "(" + t + ")" : "";
        if(d.repeat_type != "none") {
            n = "repeat";
            p = "<span class='ui-icon ui-icon-arrowreturn-1-e spc-event-repeat-icon'></span>"
        }
        d.invitation == 1 && (u = "<span class='ui-icon ui-icon-person spc-event-invitation-icon'></span>");
        if(c == "all_day") return '<div\t\t\t\t\t\t\tclass="spc-event all-day ' + m + " " + n + ' ui-corner-all"\t\t\t\t\t\t\tstyle="background-color: ' + s + ';"' + i + '><div class="spc-event-title hidden" style="overflow: hidden;">' + (g + p + u) + '</div><span class="event-owner-username">' + k + "</span></div>";
        if(c == "multi_day") {
            b = "2px";
            d.continueIcon && (b = "16px");
            return e = '<div\t\t\t\t\t\t\tclass="spc-event multi-day ' + m + " " + n + ' ui-corner-all"\t\t\t\t\t\t\tstyle="background-color: ' + s + ';"' + i + ">" + d.onGoingIcon + '<div class="spc-event-title">' + (g + p) + "</div>" + d.continueIcon + '<span class="event-owner-username" style="right: ' + b + ';">' + k + "</span>\t\t\t\t\t\t</div>"
        }
        if(b == "week" && c == "standard") {
            e = "<span class='spc-week-event-title-start-time'>" + SPC.Date.convertTimeFormat(d.start_time) + "</span> - \t\t\t\t\t\t\t<span class='spc-week-event-title-end-time'>" + SPC.Date.convertTimeFormat(d.end_time) + "</span>";
            d.height < 35 && d.width < 140 && (e = "<span class='spc-week-event-title-start-time'>" + SPC.Date.convertTimeFormat(d.start_time) + "</span>\t\t\t\t\t\t\t\t<span class='spc-week-event-title-end-time'></span>");
            h = d.height < 35 ? "spc-little-event-title" : "spc-event-title";
            e = "<div\t\t\t\t\t\t\t\t\tclass='spc-event-wrapper'\t\t\t\t\t\t\t\t\tstyle='\t\t\t\t\t\t\t\t\t\tposition: absolute;\t\t\t\t\t\t\t\t\t\twidth: " + d.width + "px;\t\t\t\t\t\t\t\t\t\ttop: " + d.top + "px;\t\t\t\t\t\t\t\t\t\tmargin-left: " + d.marginLeft + "px;\t\t\t\t\t\t\t\t\t\tleft: " + d.left + "px;'>\t\t\t\t\t\t\t\t\t\t\t<div " + i + "class='spc-event standard-week " + m + " " + n + " ui-corner-all'\t\t\t\t\t\t\t\t\t\t\t\tstyle='\t\t\t\t\t\t\t\t\t\t\t\t\twidth: " + d.width + "px;\t\t\t\t\t\t\t\t\t\t\t\t\theight: " + d.height + "px;\t\t\t\t\t\t\t\t\t\t\t\t\tbackground-color: " + s + ";\t\t\t\t\t\t\t\t\t\t\t\t\tborder: 1px solid " + o + "'>" + ("<div class='spc-week-event-header'>" + (e + p + u) + "</div>") + "<div class='spc-event-title " + h + "'>" + g + "</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class='event-owner-username'>" + k + "</span>\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>"
        }
        b == "month" && c == "standard" && (e = '<div\t\t\t\t\t\t\t\tclass="spc-event standard ' + m + " " + n + ' ui-corner-all"\t\t\t\t\t\t\t\tstyle="color: ' + s + ' !important;"' + i + '><span class="spc-event-title f-left">' + SPC.Date.convertTimeFormat(d.start_time) + " " + g + '</span><sub style="position: absolute; right: 0; margin: 0 6px; font-weight: bold; font-size: 12px;">' + (t ? "<span style='display: inline-block; padding: 0 3px;' title='" + t + "'>*</span>" : "") + "</sub>\t\t\t\t\t\t\t </div>");
        return e
    };
    SPC.Calendar.Event.getWeekCalEventTop = function (b) {
        b = b.split(":");
        return(+b[0] * 60 + +b[1]) * SPC.Calendar.TIMESLOT_MINUTE_SIZE
    };
    SPC.Calendar.Event.getWeekCalEventHeight = function (b, c) {
        c == "00:00" && (c = "23:59");
        b = b.split(":");
        c = c.split(":");
        return(+c[0] * 60 + +c[1] - (+b[0] * 60 + +b[1])) * SPC.Calendar.TIMESLOT_MINUTE_SIZE
    };
    SPC.Calendar.Event.defineWeekCalStandardEventWidth = function (b, c) {
        SPC.Array.foreach(c, function (c, d) {
            d.width = b - 10
        });
        for(var d, e = 1, g = 0, h = 0, k = c.length; e < k; e++) {
            d = false;
            for(var i = g; i < e; i++) if(c[e].start_time < c[i].end_time || c[e].start_time == c[i].start_time) {
                d = true;
                h++;
                break
            }
            if(d) {
                if(c[e].start_time > c[e - 1].end_time) for(d = e - 2; d >= 0; d--) if(c[e].start_time < c[d].end_time) {
                    h = c[d].q ? c[d].q + 1 : 1;
                    break
                }
                for(d = g; d <= e; d++) {
                    c[e].width = b - 10 - h * 7;
                    c[e].marginLeft = h * 7;
                    c[e].q = h
                }
            } else {
                g = e;
                h = 0
            }
        }
    };
    SPC.Calendar.Event.placeWeekCalEvents = function (b) {
        var c = $("#spc-week-cal-header td:eq(1)").width();
        SPC.Array.foreach(b, function (b, e) {
            SPC.Calendar.Event.defineWeekCalStandardEventWidth(c, e);
            var g = $("#spc-week-cal-header").find("." + b).position().left,
                h = $("#spc-week-cal-tmpl-wrapper");
            SPC.Array.foreach(e, function (b, d) {
                d.left = g;
                d.top = SPC.Calendar.Event.getWeekCalEventTop(d.start_time);
                d.height = SPC.Calendar.Event.getWeekCalEventHeight(d.start_time, d.end_time);
                h.append(SPC.Calendar.Event.getEventElement("week", "standard", d, c))
            })
        })
    };
    SPC.Calendar.getWeekCalNavDate = function (b) {
        var c = SPC.userPrefs.calendar.longdate_format,
            d = b[0],
            e = SPC.Array.end(b),
            b = SPC.Date.parseDate(d),
            g = b.day,
            h = b.year,
            k = SPC.Date.parseDate(e),
            i = k.day,
            m = k.year,
            d = SPC.Date.getMonthName(d, true),
            e = SPC.Date.getMonthName(e, true);
        return c == "lit_end" || c == "big_end" ? b.year != k.year ? g + " " + d + " " + h + " - " + i + " " + e + " " + m : d != e ? g + " " + d + " - " + i + " " + e + ", " + h : g + " - " + i + " " + d + ", " + h : b.year != k.year ? d + " " + g + " " + h + " - " + e + " " + i + " " + m : d != e ? d + " " + g + " - " + e + " " + i + ", " + h : d + " " + g + " - " + i + ", " + h
    };
    SPC.Calendar.updateNavDate = function (b, c) {
        var d;
        SPC.initSidebarCalendar();
        switch(b) {
            case "day":
            case "agenda":
                d = SPC.Date.getUserLongDate(c[0]);
                break;
            case "custom":
            case "week":
                d = SPC.Calendar.getWeekCalNavDate(c);
                break;
            case "month":
                d = SPC.Date.getMonthName(SPC.currentDate) + " " + SPC.currentDate.split("-")[0];
                break;
            case "year":
                d = SPC.currentDate.split("-")[0]
        }
        $("#spc-cal-nav-date").html(d)
    };
    SPC.Calendar.Event.setEventTitleDimensions = function () {
        SPC.Calendar.jQuery.SpcCalAppWrapper.find(".spc-event").each(function () {
            $(".spc-event-title", this).css({
                width: $(this).width() - 30 + "px",
                display: "inline-block"
            })
        })
    };
    SPC.Calendar.getPagerDate = function (b, c, d) {
        c = c || SPC.Calendar.currentView;
        d = d || SPC.currentDate;
        parsedDate = SPC.Date.parseDate(d);
        if(c == "month") return SPC.Date.objToStr(new Date(parsedDate.year, (b == "next" ? parsedDate.month + 1 : parsedDate.month - 1) - 1, 1));
        if(c == "year") return SPC.Date.objToStr(new Date(b == "next" ? parsedDate.year + 1 : parsedDate.year - 1, parsedDate.month - 1, 1));
        var e;
        switch(c) {
            case "day":
                e = 1;
                break;
            case "week":
                e = 7;
                break;
            case "custom":
                e = SPC.userPrefs.calendar.custom_view;
                break;
            case "agenda":
                e = 1
        }
        return b == "next" ? SPC.Date.addDate(d, +e) : SPC.Date.addDate(d, -e)
    };
    SPC.Calendar.getWeekCalHeaderUserDate = function (b) {
        var c = SPC.Date.getDayName(b, true),
            d = SPC.Date.getMonthName(b, true),
            b = SPC.Date.parseDate(b);
        return c + ", " + d + " " + b.day
    };
    SPC.Calendar.getWeekCalendarHeader = function (b) {
        var c = "<table id='spc-week-cal-header'>\t\t\t\t\t\t\t<tbody>\t\t\t\t\t\t\t\t<tr>\t\t\t\t\t\t\t\t\t<td id='spc-week-cal-header-first-cell'></td>",
            d = "style='width: " + 96 / b.length + "%;'",
            e;
        SPC.Array.foreach(b, function (b, h) {
            e = "";
            h == SPC.today && (e = "today");
            c = c + ("<td\t\t\t\t\t\t\tclass='spc-week-cal-header-date go-date " + h + " " + e + " black-text-shadow'\t\t\t\t\t\t\t" + d + "\t\t\t\t\t\t\tdata-date='" + h + "'>" + SPC.Calendar.getWeekCalHeaderUserDate(h) + "</td>")
        });
        return c = c + "</tr>\t\t\t\t\t</tbody>\t\t\t\t</table>"
    };
    SPC.Calendar.getWeekCalendarMultiDayEventBar = function (b, c) {
        var d = c.all_day,
            e = c.multi_day,
            g = b[0].split("-"),
            h = g[0],
            k = g[1],
            g = +g[2],
            i = b.length,
            m = 96 / i,
            s = SPC.Array.end(b);
        SPC.Calendar.jQuery.SpcCalAppWrapper.width();
        var o = '<div id="multi-day-event-table-wrapper">                                    <table class="spc-month-all-day-box-table">                                        <tbody>                                            <tr>                                                <td style="width: 4%; border: 1px solid transparent; border-right-color: #ddd;"></td>',
            n;
        SPC.Array.foreach(b, function (b, c) {
            n = SPC.Date.parseDate(c);
            o = o + ('<td\t\t\t\t\t\t\t\t\t\tclass="spc-month-all-day-box-cell"\t\t\t\t\t\t\t\t\t\tstyle="height: 100%; border: 1px solid #ddd; width: ' + m + '%;">\t\t\t\t\t\t\t\t\t\t\t<div\t\t\t\t\t\t\t\t\t\t\t\tclass="spc-month-all-day-box"\t\t\t\t\t\t\t\t\t\t\t\tstyle="height: 100%;">\t\t\t\t\t\t\t\t\t\t\t\t<span class="date hidden">' + c + '</span>\t\t\t\t\t\t\t\t\t\t\t\t<span class="day-num hidden">' + n.day + '</span>\t\t\t\t\t\t\t\t\t\t\t\t<span class="m-c-day-element-index hidden">' + b + "</span>\t\t\t\t\t\t\t\t\t\t\t</div>                                    </td>")
        });
        var o = o + "</tr>\t\t\t\t\t\t\t\t</tbody>\t\t\t\t\t\t\t</table>",
            o = o + '<table                                id="multi-day-event-table"                                cellspacing="0"                                cellpadding="0"                                style="width: 100%;">                                <tbody>',
            p, u, t, r, y, C, x;
        j = 0;
        a: for(; j < 20; j++) {
            if(SPC.Object.length(e) == 0 && SPC.Object.length(d) == 0) break;
            o = o + '<tr>\t\t\t\t\t\t\t\t\t<td style="width: 4%;"></td>';
            x = false;
            for(q = 0; q < i; q++) {
                p = 0;
                u = g + q;
                t = (new Date(h, k - 1, u)).getTime() / 1E3;
                u = b[q];
                for(var w in e) {
                    r = e[w];
                    C = y = "";
                    if(u >= r.start_date && u <= r.end_date && !(x == true && r.start_date != u)) {
                        eventEndDateTs = SPC.Date.strToObj(r.end_date).getTime() / 1E3;
                        p = (eventEndDateTs - t) / SPC.Calendar.DAY_IN_SECOND;
                        p = p >= i - q ? i - q : p + 1;
                        r.start_date < u && (C = '<span class="ff ui-icon ui-icon-carat-1-w f-left"></span>');
                        r.end_date > s && (y = '<span class="ff ui-icon ui-icon-carat-1-e f-right"></span>');
                        delete e[w];
                        break
                    }
                }
                if(p > 0) {
                    r.onGoingIcon = C;
                    r.continueIcon = y;
                    if(p == i) {
                        o = o + ('<td colspan="' + i + '">' + SPC.Calendar.Event.getEventElement("week", "multi_day", r) + "</td>");
                        continue a
                    } else {
                        o = o + ('<td colspan="' + p + '">' + SPC.Calendar.Event.getEventElement("week", "multi_day", r) + "</td>");
                        x = true;
                        q = q + (p - 1)
                    }
                } else {
                    dayEvent = "&nbsp;";
                    if(d[u]) {
                        for(var E in d[u]) {
                            dayEvent = SPC.Calendar.Event.getEventElement("week", "all_day", d[u][E]);
                            delete d[u][E];
                            break
                        }
                        SPC.Object.length(d[u]) == 0 && delete d[u]
                    }
                    o = o + ('<td class="m-c-empty-cell" style="width: ' + m + '%;"><span class="m-c-day-element-index hidden">' + q + "</span>" + dayEvent + "</td>")
                }
            }
            o = o + "</tr>"
        }
        o = o + '<tr>\t\t\t\t\t\t\t\t<td style="width: 4%;">';
        SPC.Array.foreach(b, function (b) {
            o = o + ('<td class="m-c-empty-cell" style="width: ' + m + '%;">                                        <span class="m-c-day-element-index hidden">' + b + '</span>                                        <div style="height: 16px;"></div>                                    </td>')
        });
        o = o + "</tr>";
        return o = o + "</tbody>\t\t\t\t\t\t\t\t</table>\t\t\t\t\t\t\t</div>"
    };
    SPC.Calendar.getWeekCalendarBodyTemplate = function (b, c) {
        if(SPC.Calendar.getWeekCalendarBodyTemplate[b]) return SPC.Calendar.getWeekCalendarBodyTemplate[b];
        var d = SPC.userPrefs.calendar.timeformat,
            e = "style='width: " + 96 / c.length + "%;'",
            g = "<div id='spc-week-cal-tmpl-wrapper'>\t\t\t\t\t\t<table id='spc-week-cal-tmpl'>\t\t\t\t\t\t\t<tbody>",
            h = 0,
            k, i;
        SPC.Array.foreach(SPC.Calendar.timeSlots, function (b, s) {
            cellClass = "";
            /30/.test(b) && (cellClass = "spc-weel-cal-row-half");
            g = g + "<tr>";
            d == "standard" && (s = s.replace(/00/, "").replace(":", ""));
            cellClass || (g = g + ("<td rowspan='2' class='spc-week-cal-row-time'>" + s + "</td>"));
            SPC.Array.foreach(c, function (c) {
                k = h + "_" + c;
                i = "data-index='" + k + "'\t\t\t\t\t\t\t\tdata-time='" + b + "'";
                g = g + ("<td\t\t\t\t\t\t\tclass='spc-week-cal-timeslot " + k + " " + cellClass + "''\t\t\t\t\t\t\t" + i + " " + e + ">\t\t\t\t\t\t</td>")
            });
            g = g + "</tr>";
            h++
        });
        g = g + "<tr class='hidden'>\t\t\t\t\t<td></td>";
        SPC.Array.foreach(c, function (b) {
            k = "48_" + b;
            i = "data-index='" + k + "'\t\t\t\t\t\t\tdata-time='00:00'";
            g = g + ("<td\t\t\t\t\t\tclass='spc-week-cal-timeslot " + k + "''\t\t\t\t\t\t" + i + " " + e + ">\t\t\t\t\t</td>")
        });
        g = g + "</tr>";
        g = g + "</tbody>\t\t\t\t\t</table>\t\t\t\t</div>";
        return SPC.Calendar.getWeekCalendarBodyTemplate[b] = g
    };
    SPC.Calendar.setWeekCalDimensions = function () {
        var b = $("#spc-week-cal-tmpl").width();
        $("#spc-week-cal-top").width(b);
        $("#spc-week-cal-tmpl-wrapper").height($(window).height() - $("#spc-week-cal-tmpl-wrapper").offset().top - 6);
        $(".spc-month-all-day-box-table").height($("#multi-day-event-table").height())
    };
    SPC.Calendar.drawWeekCalendar = function (b, c, d, e) {
        var g = '<div id="spc-week-cal-top">' + SPC.Calendar.getWeekCalendarHeader(c) + SPC.Calendar.getWeekCalendarMultiDayEventBar(c, d) + "</div>",
            g = g + SPC.Calendar.getWeekCalendarBodyTemplate(b, c);
        $("#spc-main-app").html(g);
        SPC.Calendar.setWeekCalDimensions();
        SPC.Calendar.Event.placeWeekCalEvents(d.standard);
        SPC.Calendar.Event.setEventTitleDimensions();
        SPC.Calendar.initTimeSlotSelector();
        SPC.Calendar.Event.initMultiDayEventDnd();
        SPC.Calendar.Event.initStandardEventDndAndResize();
        SPC.Calendar.initWeekCalScroll();
        (SPC.LAST_ACTION == "calendar:event:create" || SPC.LAST_ACTION == "calendar:event:update" || SPC.LAST_ACTION == "calendar:calendar-settings:update") && $("#spc-week-cal-tmpl-wrapper").scrollTop(SPC.Calendar.WeekCalScrollPos);
        SPC.checkPopupReminder();
        e && e()
    };
    SPC.Calendar.getMonthCalendarHeader = function (b) {
        for(var c = "<table id='spc-month-cal-header'>\t\t\t\t\t\t\t<tbody>\t\t\t\t\t\t\t\t<tr>", d = 0; d < 7; d++) c = c + ("<td class='spc-month-cal-header-date black-text-shadow'>" + SPC.Date.getDayName(b[d]) + "</td>");
        return c + "</tr>                </tbody>            </table>"
    };
    SPC.Calendar.getMonthCalFirstWeekSpace = function (b) {
        for(var c = 0, d, e = 0; e < 7; e++) {
            d = SPC.Date.parseDate(b[e]);
            if(d.day == 1) break;
            c++
        }
        return c
    };
    SPC.Calendar.getLastDateOfWeek = function (b) {
        var c = SPC.Date.parseDate(b);
        SPC.Date.strToObj(b).getDay();
        var d;
        switch(SPC.Calendar.START_DAY_OF_WEEK) {
            case 0:
                d = 6;
                break;
            case 1:
                d = 0;
                break;
            case 6:
                d = 5
        }
        for(var e, b = 0; b < 7; b++) {
            e = new Date(c.year, c.month - 1, c.day + b);
            if(e.getDay() == d) break
        }
        return SPC.Date.objToStr(e)
    };
    $(".m-c-show-more-event").live("click", function () {
        var b = +$(this).siblings(".m-c-day-element-index").text(),
            c = $(".m-c-day-header")[b],
            d = $(c).parents(".month-cal-row").position().top,
            e = SPC.Calendar.jQuery.SpcMainApp.height();
        $(this).data("open", true);
        $(".m-c-more-events." + b).css({
            position: "absolute",
            top: d,
            left: $(c).position().left + 1,
            width: $(".m-c-day-header").width() - 10 + "px",
            "z-index": 5
        }).prependTo($("#spc-main-app")).show();
        SPC.Calendar.Event.setEventTitleDimensions();
        var g = $(".m-c-more-events." + b).height();
        $(c).parents(".month-cal-row").position().top + g > e && $(".m-c-more-events." + b).css({
            top: d - (g - (e - d)) - 10
        });
        return false
    });
    $(".m-c-more-events-close").live("click", function (b) {
        b.stopPropagation();
        $(this).data("open", false);
        $(this).closest(".m-c-more-events").hide()
    });
    SPC.Calendar.drawMonthCalendar = function (b, c, d) {
        var e = SPC.jQuery.window.height() - SPC.Calendar.jQuery.SpcMainApp.offset().top,
            g = Math.round(b.length / 7),
            h = Math.round(e / (g * 20)) - 1;
        SPC.Array.end(b);
        for(var k = SPC.Date.parseDate(SPC.currentDate).month,
        i = c.all, m = c.all_day, s = c.multi_day, o = c.standard, n = SPC.Calendar.getMonthCalendarHeader(b), p = 1 - SPC.Calendar.getMonthCalFirstWeekSpace(b), u = 0, t, v = 0; v < g; v++) {
            c = $.extend({}, s);
            dateEventCounts = [];
            var n = n + ('<div\t\t\t\t\t\t\tclass="month-cal-row"\t\t\t\t\t\t\tstyle="\t\t\t\t\t\t\t\tposition: relative;\t\t\t\t\t\t\t\theight: ' + (e - $("#spc-month-cal-header").height()) / g + 'px !important;\t\t\t\t\t\t\t\twidth: 100%;">'),
                n = n + '<table\t\t\t\t\t\t\tclass="spc-month-all-day-box-table">\t\t\t\t\t\t\t\t<tbody>\t\t\t\t\t\t\t\t\t<tr>',
                y;
            for(t = 0; t < 7; t++) {
                u = v * 7 + t;
                y = "border-bottom: 0;";
                v == g - 1 && (y = "border-bottom: 1px solid #ddd;");
                n = n + ('<td\t\t\t\t\t\t\t\t\tclass="spc-month-all-day-box-cell"\t\t\t\t\t\t\t\t\tstyle="' + y + '">\t\t\t\t\t\t\t\t\t\t<div class="spc-month-all-day-box">\t\t\t\t\t\t\t\t\t\t\t<span class="date hidden">' + b[u] + '</span>\t\t\t\t\t\t\t\t\t\t\t<span class="day-num hidden">' + parseInt(b[u].split("-")[1], 10) + '</span>\t\t\t\t\t\t\t\t\t\t\t<span class="m-c-day-element-index hidden">' + (v * 7 + t) + "</span>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</td>")
            }
            n = n + "</tr>\t\t\t\t\t\t\t</tbody>\t\t\t\t\t\t</table>";
            n = n + '<table class="smart-month" cellspacing="0" cellpadding="0">';
            j = 0;
            a: for(; j < h; j++) {
                n = n + "<tr>";
                rowStart = false;
                for(q = 0; q < 7; q++) {
                    currentDate = p + q;
                    colspan = 0;
                    r = b[v * 7 + q];
                    parsedDate = SPC.Date.parseDate(r);
                    dateTs = SPC.Date.strToObj(r).getTime() / 1E3;
                    dayNum = parsedDate.day;
                    todayClass = todayColor = "";
                    dayActive = "month-day-passive";
                    parsedDate.month == k && (dayActive = "month-day-active");
                    r == SPC.today && (todayClass = "today");
                    monthName = "";
                    if(j == 0) {
                        dayNum == 1 && (monthName = SPC.Date.getMonthName(r, true));
                        n = n + ('<td\t\t\t\t\t\t\t\t\t\t\tclass="m-c-day-header ' + dayActive + " " + todayClass + " " + r + '">\t\t\t\t\t\t\t\t\t\t\t\t<span class="m-c-day-num go-date" data-date="' + r + '">' + monthName + +dayNum + '<span class="date hidden">' + r + '</span>\t\t\t\t\t\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t\t\t\t\t\t<span class="m-c-day-element-index hidden">' + (v * 7 + q) + '</span>\t\t\t\t\t\t\t\t\t\t\t\t<span class="date hidden">' + r + "</span>\t\t\t\t\t\t\t\t\t\t</td>")
                    } else if(j == h - 1) if(i[r]) if(i[r].length > h - 2) {
                        monthMoreEvents = '<div class="m-c-more-events ' + (v * 7 + q) + ' ui-corner-all hidden spc-widget-shadow">                                                        <div style="position: relative; font-weight: bold; margin: 2px;">' + SPC.Date.getUserLongDate(r) + '<span                                                                    class="m-c-more-events-close ui-icon ui-icon-close pointer"                                                                    style="position: absolute; top: -3px; right: -3px;">                                                                </span>                                                        </div>';
                        SPC.Array.foreach(i[r], function (b, c) {
                            __type = c.type.replace("_", "-");
                            __title = c.title != "" ? c.title : SPC.translate("(No title)");
                            __color = SPC.USER_CALENDARS[c.cal_id].color;
                            __permission = SPC.USER_CALENDARS[c.cal_id].permission;
                            __startDate = c.start_date;
                            __endDate = c.end_date;
                            __eventStyle = "background-color: " + __color + ";";
                            if(__type == "standard") {
                                __eventStyle = "color: " + __color + ";";
                                __title = '<span class="bold">' + SPC.Date.convertTimeFormat(c.start_time) + "</span> " + __title
                            }
                            eventData = SPC.Calendar.Event.getEventData(c);
                            monthMoreEvents = monthMoreEvents + ('<div                                                            class="spc-event ' + __type + " " + __permission + ' ui-corner-all"                                                            style="' + __eventStyle + ' height: 15px; padding: 1px 0; margin: 1px 0;"' + eventData + ">");
                            __type == "multi-day" && __startDate < r && (monthMoreEvents = monthMoreEvents + '<span class="ui-icon ui-icon-carat-1-w ff" style="float: left;"></span>');
                            monthMoreEvents = monthMoreEvents + ('<div class="spc-event-title">' + __title + "</div>");
                            __type == "multi-day" && __endDate > r && (monthMoreEvents = monthMoreEvents + '<span class="ff ui-icon ui-icon-carat-1-e" style="float: right;"></span>');
                            monthMoreEvents = monthMoreEvents + "</div>"
                        });
                        monthMoreEvents = monthMoreEvents + "</div>";
                        n = n + ('<td class="center" style="height: 100px;">\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="m-c-day-element-index hidden">' + (v * 7 + q) + '</span>\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="m-c-show-more-event pointer">+' + (i[r].length - (h - 2)) + monthMoreEvents + "</span>\t\t\t\t\t\t\t\t\t\t\t\t</td>")
                    } else n = n + ('<td style="height: 100px;"> <span class="m-c-day-element-index hidden">' + (v * 7 + q) + "</span> </td>");
                    else n = n + ('<td style="height: 100px;"> <span class="m-c-day-element-index hidden">' + (v * 7 + q) + "</span> </td>");
                    else {
                        var w;
                        for(w in c) {
                            t = c[w];
                            ongoingIcon = continueIcon = eventTitle = "";
                            if(r >= t.start_date && r <= t.end_date && !(rowStart == true && t.start_date != r) && !(t.started && q != 0)) {
                                eventEndDateTs = SPC.Date.strToObj(t.end_date).getTime() / 1E3;
                                dayDiff = (eventEndDateTs - dateTs) / SPC.Calendar.DAY_IN_SECOND;
                                colspan = dayDiff >= 7 - q ? 7 - q : dayDiff + 1;
                                t.start_date < r && (ongoingIcon = '<span class="ff ui-icon ui-icon-carat-1-w f-left"></span>');
                                t.end_date > SPC.Calendar.getLastDateOfWeek(r) && (continueIcon = '<span class="ff ui-icon ui-icon-carat-1-e f-right"></span>');
                                t.started || (s[w].started = true);
                                delete c[w];
                                break
                            }
                        }
                        if(colspan > 0) {
                            t.onGoingIcon = ongoingIcon;
                            t.continueIcon = continueIcon;
                            if(colspan == 7) {
                                n = n + ('<td colspan="7">' + SPC.Calendar.Event.getEventElement("month", "multi_day", t) + "</td>");
                                continue a
                            } else {
                                n = n + ('<td colspan="' + colspan + '">' + SPC.Calendar.Event.getEventElement("month", "multi_day", t) + "</td>");
                                rowStart = true;
                                q = q + (colspan - 1)
                            }
                        } else {
                            dayEvent = "&nbsp;";
                            if(m[r]) for(var x in m[r]) {
                                dayEvent = SPC.Calendar.Event.getEventElement("month", "all_day", m[r][x]);
                                delete m[r][x];
                                break
                            }
                            if(o[r] && dayEvent == "&nbsp;") for(x in o[r]) {
                                dayEvent = SPC.Calendar.Event.getEventElement("month", "standard", o[r][x]);
                                delete o[r][x];
                                break
                            }
                            n = n + ('<td class="m-c-empty-cell">\t\t\t\t\t\t\t\t\t\t\t\t<span class="m-c-day-num hidden">' + dayNum + '</span>\t\t\t\t\t\t\t\t\t\t\t\t<span class="m-c-day-element-index hidden">' + (v * 7 + q) + "</span>" + dayEvent + "</td>")
                        }
                    }
                }
                n = n + "</tr>"
            }
            n = n + "</table> </div>";
            p = p + 7
        }
        $("#spc-main-app").html(n);
        SPC.Calendar.Event.setEventTitleDimensions();
        SPC.Calendar.Event.initMultiDayEventDnd();
        d && d()
    };
    SPC.Calendar.drawAgenda = function (b, c) {
        var d = "<div id='spc-agenda-wrapper'>\t\t\t\t\t\t\t<table id='spc-agenda'>\t\t\t\t\t\t\t\t</tbody>",
            e, g, h, k;
        SPC.Array.foreach(b, function (b, m) {
            SPC.Array.foreach(c[m], function (b, i) {
                h = SPC.USER_CALENDARS[i.cal_id].permission;
                k = SPC.Calendar.Event.getEventData(i);
                g = SPC.USER_CALENDARS[i.cal_id].color;
                e = SPC.Date.convertTimeFormat(i.start_time) + " - " + SPC.Date.convertTimeFormat(i.end_time);
                i.type != "standard" && (e = "All day");
                if(b == 0) {
                    d = d + "<tr class='agenda-header'>";
                    d = d + ("<td rowspan='" + c[m].length + "' class='spc-agenda-date'>" + SPC.Date.getUserLongDate(m) + "</td><td class='spc-event agenda " + h + "' " + k + "><span class='spc-agenda-time'>" + e + "</span><span class='spc-agenda-title' style='color: " + g + ";'>" + SPC.Calendar.Event.getEventTitle(i.title) + "</span></td>")
                } else d = d + ("<tr><td class='spc-event agenda " + h + "' " + k + "><span class='spc-agenda-time'>" + e + "</span><span class='spc-agenda-title' style='color: " + g + ";'>" + SPC.Calendar.Event.getEventTitle(i.title) + "</span></td>");
                d = d + "</tr>"
            })
        });
        d = d + "</tbody>\t\t\t\t</table>\t\t\t</div>";
        SPC.Calendar.jQuery.SpcMainApp.html(d)
    };
    SPC.Calendar.drawYearCalendar = function (b, c) {
        b = b.all;
        SPC.Calendar.drawYearCalendar.events = b;
        for(var d = SPC.Date.parseDate(SPC.currentDate), e, g, h, k = "", i, m, s, o, n = "<div id='spc-year-cal-wrapper'>\t\t\t\t\t\t\t<table id='spc-year-cal-wrapper-table'>\t\t\t\t\t\t\t\t<tbody>",
        p = 0, u = 1; u <= 12; u++) {
            g = d.year + "-" + SPC.Date.dateConverter.padZeroLeft(u) + "-01";
            h = SPC.Date.getMonthName(g);
            g = SPC.Date.getCalendarViewDates("month", g);
            i = g.length / 7;
            e = "";
            u == SPC.parsedToday.month && d.year == SPC.parsedToday.year && (e = "cur-month");
            (u - 1) % 2 == 0 && (n = n + "<tr class='spc-year-cal-wrapper-table-row'>");
            n = n + ("<td>\t\t\t\t\t\t\t<table class='spc-year-cal-month'>\t\t\t\t\t\t\t\t<caption>\t\t\t\t\t\t\t\t\t<div class='black-text-shadow ui-corner-all " + e + "'>" + h + "</div>\t\t\t\t\t\t\t\t</caption>\t\t\t\t\t\t\t\t<thead>");
            if(!k) for(h = 0; h < 7; h++) k = k + ("<th class='black-text-shadow'>" + SPC.Date.getDayName(g[h], true) + "</th>");
            for(var n = n + k, n = n + "</head>", n = n + "<tbody>", r = 0; r < i; r++) {
                for(var n = n + "<tr>", v = 0; v < 7; v++) {
                    m = "active";
                    h = g[r * 7 + v];
                    e = SPC.Date.parseDate(h);
                    e.month != u && (m = "passive");
                    o = "";
                    h == SPC.today && (o = "today");
                    s = "";
                    if(b[h]) s = b[h].length;
                    n = n + ("<td>\t\t\t\t\t\t\t\t\t<div\t\t\t\t\t\t\t\t\t\tclass='spc-year-cal-month-day ui-corner-all " + m + " " + o + "'\t\t\t\t\t\t\t\t\t\tdata-date='" + h + "'>" + e.day + "<span  class='spc-year-cal-month-day-event-count'>" + s + "</span>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</td>")
                }
                n = n + "</tr>"
            }
            n = n + "</tbody>\t\t\t\t\t</table>\t\t\t\t</td>";
            p++;
            if(p == 2) {
                n = n + "</tr>";
                p = 0
            }
        }
        SPC.Calendar.jQuery.SpcMainApp.html(n + "</tbody>\t\t\t </table>\t\t</div>");
        if(SPC.Date.parseDate(SPC.currentDate).year == SPC.parsedToday.year) {
            d = SPC.Calendar.jQuery.SpcMainApp.find(".cur-month").position().top;
            $("#spc-year-cal-wrapper").scrollTop(d)
        }
        c && c()
    };
    $("#spc-year-cal-event-list-dialog").dialog({
        title: "",
        width: 500,
        height: 500
    });
    SPC.Calendar.drawYearCalendarEventList = function (b) {
        var c = $("#spc-year-cal-event-list-dialog"),
            d = SPC.Calendar.drawYearCalendar.events[b],
            e, g = "<table id='spc-year-cal-event-list-dialog-table'>\t\t\t\t\t\t\t<caption><span class='go-date' data-date='" + b + "'>" + SPC.Date.getUserLongDate(b) + "</span>\t\t\t\t\t\t\t</caption>\t\t\t\t\t\t\t<tbody>",
            b = b || c.data("date");
        SPC.Array.foreach(d, function (b, c) {
            eventData = SPC.Calendar.Event.getEventData(c);
            permission = SPC.USER_CALENDARS[c.cal_id].permission;
            e = SPC.Date.convertTimeFormat(c.start_time) + " - " + SPC.Date.convertTimeFormat(c.end_time);
            eventColor = SPC.USER_CALENDARS[c.cal_id].color;
            c.type != "standard" && (e = SPC.translate("All day"));
            g = g + ("<tr>\t\t\t\t\t\t\t<td class='spc-event agenda " + permission + "'" + eventData + "><span class='spc-agenda-time'>" + e + "</span><span class='spc-agenda-title' style='color: " + eventColor + ";'>" + SPC.Calendar.Event.getEventTitle(c.title) + "</span>\t\t\t\t\t\t\t</td>\t\t\t\t\t\t</tr>")
        });
        g = g + "</tbody>\t\t\t\t\t</table>";
        c.html(g);
        var d = SPC.Date.getMonthName(b),
            h = SPC.Date.parseDate(b).year;
        c.dialog("option", "title",
        d + ", " + h);
        c.data("date", b);
        c.dialog("open")
    };
    SPC.Calendar.jQuery.SpcMainApp.delegate(".spc-year-cal-month-day", "click", function () {
        var b = $(this).attr("data-date");
        if(SPC.Calendar.drawYearCalendar.events[b]) SPC.Calendar.drawYearCalendarEventList(b);
        else {
            SPC.currentDate = b;
            SPC.Calendar.openView("day")
        }
    });
    SPC.Calendar.drawCalendar = function (b, c, d, e) {
        SPC.Calendar.updateNavDate(b, c);
        switch(b) {
            case "day":
            case "week":
            case "custom":
                SPC.Calendar.drawWeekCalendar(b, c, d, e);
                break;
            case "month":
                SPC.Calendar.drawMonthCalendar(c,
                d, e);
                break;
            case "agenda":
                SPC.Calendar.drawAgenda(c, d.all, e);
                break;
            case "year":
                SPC.Calendar.drawYearCalendar(d, e);
                break;
            default:
                SPC.flashMsg("Unknown view " + b)
        }
    };
    SPC.Calendar.definePrintPageDates = function (b, c) {
        var d = c[0],
            e = SPC.Array.end(c);
        if(b == "month") var d = SPC.Date.parseDate(SPC.currentDate),
            e = d.year,
            g = SPC.Date.dateConverter.padZeroLeft(d.month),
            d = e + "-" + g + "-01",
            e = e + "-" + g + "-" + SPC.Date.getEndOfMonth(SPC.currentDate);
        d = "print.php?startDate=" + d + "&endDate=" + e + "&cals=" + encodeURIComponent(SPC.Calendar.getActiveCalendars().join(","));
        $("#print-calendar").attr("href", d)
    };
    l = SPC_LICENSE_KEY;
    var A = window.location.hostname.substr(window.location.hostname.indexOf(SPC_DOMAIN));
    (function () {
        var b = [],
            c;
        for(c in w(z(A).split(""))) {
            cC = w(z(A).split(""))[c].charCodeAt(0);
            cCB = Number(cC).toString(2);
            cCRB = D(cCB.split(""));
            cCBRDN = parseInt(w(cCB.split("")).join(""), 2);
            cCRBCDN = parseInt(cCRB, 2);
            cCRRBDN = parseInt(w(D(cCB.split("")).split("")).join(""), 2);
            b.push(cCRBCDN);
            b.push(cCRRBDN);
            c != w(z(A).split("")).length - 1 && b.push(String.fromCharCode((w(z(A).split(""))[c].charCodeAt(0) + w(z(A).split(""))[Number(c) + 1].charCodeAt(0)) / 2).toUpperCase())
        }
        window.f = l;
        window.a = b.join("")
    })();
    if(a == f) {
        SPC.Calendar.getActiveCalendars = function () {
            var b = [],
                c;
            $(".calendar").each(function () {
                c = this.id.split("-")[1];
                /on/.test(this.className) && SPC.Array.arraySearch(c, b) === false && b.push(c)
            });
            return b
        };
        SPC.Calendar.XHRs = [];
        SPC.Calendar.getCalendar = function (b, c, d) {
            b = b || SPC.Calendar.currentView;
            c = c || SPC.currentDate;
            if(b == SPC.Calendar.currentView) {
                c = SPC.Date.getCalendarViewDates(b, c, d);
                d = SPC.Calendar.getActiveCalendars().join(",");
                $(".ui-draggable", SPC.Calendar.Dom.SpcMainApp).draggable("destroy");
                d || (d = "0");
                SPC.Calendar.definePrintPageDates(b, c);
                b = SPC.Calendar.getEvents(b, c, d, SPC.Calendar.drawCalendar);
                SPC.Calendar.XHRs.push(b);
                if(SPC.Calendar.XHRs.length > 1) {
                    SPC.Calendar.XHRs.pop();
                    SPC.Array.foreach(SPC.Calendar.XHRs, function (b, c) {
                        c.abort()
                    });
                    SPC.Calendar.XHRs = []
                }
            }
        };
        $("#spc-cal-view-buttons").delegate("input", "click", function () {
            $("#spc-cal-view-buttons input").removeClass("ui-state-active");
            SPC.Calendar.currentView = $(this).attr("data-view-name");
            SPC.Calendar.getCalendar();
            $(this).addClass("ui-state-active")
        });
        $("#spc-cal-pager").delegate(".spc-cal-page", "click", function () {
            var b = $(this).attr("data-direction");
            SPC.currentDate = b == "today" ? SPC.today : SPC.Calendar.getPagerDate(b);
            SPC.Calendar.getCalendar()
        });
        SPC.Calendar.openView(SPC.userPrefs.calendar.default_view);
        SPC.monthEventDrag = {};
        SPC.monthEventDrag.dragPhase = "stop";
        SPC.Calendar.timeSlotselector = {};
        SPC.SE = {};
        SPC.Calendar.initTimeSlotSelector = function () {
            if(SPC.sender == "public") return false;
            $("#spc-timeslot-seletor-time-bar").remove();
            $("#spc-week-cal-tmpl-wrapper").append('<div id="spc-timeslot-seletor-time-bar">                       <span id="spc-timeslot-seletor-time-bar-start-time"></span> -                        <span id="spc-timeslot-seletor-time-bar-end-time"></span>                   </div>');
            var b, c, d;
            $("#spc-week-cal-tmpl tbody").unbind("mousedown").bind("mousedown", function (e) {
                if(/spc-week-cal-timeslot/.test(e.target.className)) {
                    SPC.mDown = true;
                    if(!(SPC.eventDragStart === true || SPC.eventResizeStart === true)) {
                        b = e.target;
                        c = $(b);
                        var e = c.attr("data-index").split("_"),
                            g = $("#spc-week-cal-header tbody td").eq(+e[1] + 1).attr("data-date");
                        c.attr("data-time");
                        d = g;
                        b.style.backgroundColor = SPC.currentCalendarColor;
                        SPC.firstRow = +e[0];
                        SPC.firstCol = +e[1];
                        SPC.$timeslotSelectorBar = $("#spc-timeslot-seletor-time-bar");
                        SPC.selectorStartTitle = document.getElementById("spc-timeslot-seletor-time-bar-start-time");
                        SPC.selectorEndTitle = document.getElementById("spc-timeslot-seletor-time-bar-end-time");
                        SPC.Calendar.timeSlotselector.slotColor = "transparent";
                        e = document.getElementById("spc-week-cal-tmpl body");
                        for(g = 0; g < 49; g++) SPC.SE[g + "_" + SPC.firstCol] = $("td." + g + "_" + SPC.firstCol, e)[0];
                        SPC.selectorOneClick = true
                    }
                }
            }).unbind("mouseover").bind("mouseover", function (b) {
                if(/spc-week-cal-timeslot/.test(b.target.className) && !(SPC.eventDragStart === true || SPC.eventResizeStart === true)) {
                    SPC.selectorOneClick = false;
                    b = $(b.target).attr("data-index").split("_");
                    SPC.currentRow = +b[0];
                    SPC.currentCol = +b[1];
                    if(SPC.mDown) {
                        SPC.scopeStart = Math.min(SPC.firstRow, SPC.currentRow);
                        SPC.scopeEnd = Math.max(SPC.firstRow, SPC.currentRow);
                        for(b = 0; b < SPC.scopeStart; b++) SPC.SE[b + "_" + SPC.firstCol].style.backgroundColor = SPC.Calendar.timeSlotselector.slotColor;
                        for(b = SPC.scopeStart; b <= SPC.scopeEnd + 1; b++) SPC.SE[b + "_" + SPC.firstCol].style.backgroundColor = SPC.currentCalendarColor;
                        for(b = SPC.scopeEnd + 1; b <= 47; b++) if(SPC.SE[b + "_" + SPC.firstCol]) SPC.SE[b + "_" + SPC.firstCol].style.backgroundColor = SPC.Calendar.timeSlotselector.slotColor;
                        var b = $(SPC.SE[SPC.scopeStart + "_" + SPC.firstCol]).attr("data-time"),
                            c = $(SPC.SE[SPC.scopeEnd + 1 + "_" + SPC.firstCol]).attr("data-time");
                        SPC.selectorStartTitle.innerHTML = SPC.Date.convertTimeFormat(b);
                        SPC.selectorEndTitle.innerHTML = SPC.Date.convertTimeFormat(c);
                        SPC.$timeslotSelectorBar.css({
                            top: $(SPC.SE[SPC.scopeStart + "_" + SPC.firstCol]).position().top + "px",
                            left: $(SPC.SE[SPC.scopeStart + "_" + SPC.firstCol]).position().left + "px"
                        }).show()
                    }
                }
            });
            $("#spc-week-cal-tmpl tbody, #spc-timeslot-seletor-time-bar").unbind("mouseup").bind("mouseup", function () {
                if(!(SPC.eventDragStart === true || SPC.eventResizeStart === true) && SPC.mDown) {
                    SPC.mDown = false;
                    var e = d,
                        g = "",
                        h = "";
                    SPC.selectedSlots = {};
                    if(SPC.selectorOneClick) {
                        SPC.selectedSlots[SPC.firstRow + "_" + SPC.firstCol] = b;
                        g = c.attr("data-time");
                        h = $(SPC.SE[SPC.firstRow + 1 + "_" + SPC.firstCol]).attr("data-time");
                        SPC.selectorStartTitle.innerHTML = SPC.Date.convertTimeFormat(g);
                        SPC.selectorEndTitle.innerHTML = SPC.Date.convertTimeFormat(h);
                        SPC.$timeslotSelectorBar.css({
                            top: $(b).position().top,
                            left: $(b).position().left
                        }).show()
                    } else for(g = SPC.scopeStart; g <= SPC.scopeEnd; g++) SPC.selectedSlots[g + "_" + SPC.firstCol] = SPC.SE[g + "_" + SPC.firstCol];
                    $("#add-event-dialog-start-date").val(SPC.Date.dateConverter.coreToUser(e));
                    $("#add-event-dialog-end-date").val(SPC.Date.dateConverter.coreToUser(e));
                    $("#add-event-dialog-start-time").val(SPC.selectorStartTitle.innerHTML);
                    $("#add-event-dialog-end-time").val(SPC.selectorEndTitle.innerHTML);
                    $("#add-event-dialog").dialog("open")
                }
            })
        };
        SPC.monthCalDayRangeSelector = {};
        SPC.monthCalDayRangeSelector.selectorStart = !1;
        $("#spc-main-app").delegate(".spc-month-all-day-box-table td, #multi-day-event-table td, .smart-month td", "mousedown", function (b) {
            if(SPC.sender == "public") return false;
            if(!/spc-event|m-c-show-more-event|go-date|ui-icon/i.test($(b.target).attr("class")) && SPC.monthEventDrag.dragPhase == "stop") {
                SPC.monthCalDayRangeSelector.selectorStart = true;
                SPC.D = +$(this).find(".m-c-day-element-index").text();
                $(".spc-month-all-day-box-table").css({
                    "z-index": 1
                })
            }
        });
        $("#spc-main-app").bind("mouseover", function (b) {
            var b = b.target,
                c = $(b).attr("class");
            if(SPC.monthEventDrag.dragPhase != "stop") {
                $(".spc-month-all-day-box, .spc-month-all-day-box-table td").css({
                    "background-color": "transparent"
                });
                if(c == "spc-month-all-day-box") {
                    SPC.y = b;
                    if(SPC.monthEventDrag.eventType != "multi_day") $(b).css({
                        "background-color": SPC.monthEventDrag.eventColor,
                        opacity: 0.4
                    });
                    else {
                        b = +$(b).find(".m-c-day-element-index").eq(0).text();
                        for(c = b + SPC.monthEventDrag.eventDayCount; b < c; b++) $(".spc-month-all-day-box").eq(b).css({
                            "background-color": SPC.monthEventDrag.eventColor,
                            opacity: 0.4
                        })
                    }
                } else if(c == "spc-month-all-day-box-cell") {
                    SPC.y = $(b).find("div")[0];
                    $(b).find("div").css({
                        "background-color": SPC.monthEventDrag.eventColor,
                        opacity: 0.4
                    });
                    if(SPC.monthEventDrag.eventType != "multi_day") $(b).find("div").css({
                        "background-color": SPC.monthEventDrag.eventColor,
                        opacity: 0.4
                    });
                    else {
                        b = parseInt($(b).find(".m-c-day-element-index").eq(0).text(), 10);
                        for(c = b + SPC.monthEventDrag.eventDayCount; b < c; b++) $(".spc-month-all-day-box").eq(b).css({
                            "background-color": SPC.currentCalendarColor,
                            opacity: 0.4
                        })
                    }
                }
            }
        }).bind("mouseover", function (b) {
            if(SPC.monthCalDayRangeSelector.selectorStart) {
                b = +$(b.target).find(".m-c-day-element-index").eq(0).text();
                SPC.monthCalDayRangeSelector.selectorStartIndex = Math.min(SPC.D, b);
                SPC.monthCalDayRangeSelector.selectorEndIndex = Math.max(SPC.D, b);
                $(".spc-month-all-day-box").css({
                    "background-color": "transparent",
                    opacity: 1
                });
                for(b = SPC.monthCalDayRangeSelector.selectorStartIndex; b <= SPC.monthCalDayRangeSelector.selectorEndIndex; b++) $(".spc-month-all-day-box").eq(b).css({
                    "background-color": SPC.currentCalendarColor,
                    opacity: 0.4
                })
            }
        }).bind("mouseup", function (b) {
            if(SPC.monthCalDayRangeSelector.selectorStart) {
                b = parseInt($(b.target).find(".m-c-day-element-index").text(),
                10);
                SPC.monthCalDayRangeSelector.selectorStartIndex = Math.min(SPC.D, b);
                SPC.monthCalDayRangeSelector.selectorEndIndex = Math.max(SPC.D, b);
                $(".spc-month-all-day-box").css({
                    "background-color": "transparent",
                    opacity: 1
                });
                for(b = SPC.monthCalDayRangeSelector.selectorStartIndex; b <= SPC.monthCalDayRangeSelector.selectorEndIndex; b++) $(".spc-month-all-day-box").eq(b).css({
                    "background-color": SPC.currentCalendarColor,
                    opacity: 0.5
                });
                var b = $(".spc-month-all-day-box").eq(SPC.monthCalDayRangeSelector.selectorStartIndex).find(".date").text(),
                    c = $(".spc-month-all-day-box").eq(SPC.monthCalDayRangeSelector.selectorEndIndex).find(".date").text(),
                    d = SPC.Date.convertTimeFormat("00:00");
                $("#add-event-dialog-start-date").val(SPC.Date.dateConverter.coreToUser(b));
                $("#add-event-dialog-end-date").val(SPC.Date.dateConverter.coreToUser(c));
                $("#add-event-dialog-start-time").val(d);
                $("#add-event-dialog-end-time").val(d);
                $("#add-event-dialog").dialog("option", "modal", true);
                $("#add-event-dialog").dialog("open");
                $("#add-event-dialog-all-day").attr("checked",
                true).trigger("change");
                SPC.monthCalDayRangeSelector.selectorStart = false
            }
        });
        SPC.Calendar.Event.initMultiDayEventDnd = function () {
            if(SPC.sender == "public") return false;
            $(".spc-event.multi-day.change,\t\t  .spc-event.all-day.change,\t\t  .spc-event.standard.change", SPC.Calendar.Dom.SpcMainApp).draggable({
                create: function () {},
                helper: function (b) {
                    var c = $(this);
                    SPC.monthEventDrag.dragPhase = "init";
                    SPC.monthEventDrag.eventColor = c.attr("data-event-color");
                    $(".spc-month-all-day-box").css({
                        "background-color": "transparent",
                        opacity: 1
                    });
                    var d = $(".spc-month-all-day-box", SPC.Calendar.Dom.SpcMainApp).width(),
                        b = b.pageX - c.offset().left - d / 2 + "px",
                        e = c.attr("data-title"),
                        e = e != "" ? e : SPC.translate("(No title)");
                    SPC.monthEventDrag.eventType = c.attr("data-event-type");
                    if(SPC.monthEventDrag.eventType == "standard") e = SPC.Date.convertTimeFormat(c.attr("data-start-time")) + " " + e;
                    else if(SPC.monthEventDrag.eventType == "multi_day") {
                        var g = c.attr("data-start-date").split("-"),
                            h = c.attr("data-end-date").split("-"),
                            c = c.attr("data-start-time"),
                            g = (new Date(g[0],
                            g[1] - 1, g[2])).getTime(),
                            h = (new Date(h[0], h[1] - 1, h[2])).getTime(),
                            h = parseInt((h - g) / 864E5, 10) + 1,
                            e = c != "00:00" ? "(" + h + SPC.translate("days") + ") " + SPC.Date.convertTimeFormat(c) + " " + e : "(" + h + SPC.translate("days") + ") " + e;
                        SPC.monthEventDrag.eventDayCount = h
                    }
                    return SPC.monthEventDrag.eventType == "standard" ? $("<span></span>").addClass("ui-corner-all").css({
                        color: SPC.monthEventDrag.eventColor,
                        position: "absolute",
                        width: d,
                        "margin-left": b,
                        padding: "1px 2px",
                        "z-index": 5
                    }).html(e) : $("<div></div>").addClass("ui-corner-all").css({
                        "background-color": SPC.monthEventDrag.eventColor,
                        color: "#fff",
                        position: "absolute",
                        width: d,
                        "margin-left": b,
                        padding: "4px 0",
                        "z-index": 5
                    }).html(e)
                },
                cursor: "pointer",
                start: function (b, c) {
                    SPC.monthEventDrag.dragPhase = "start";
                    $(".spc-month-all-day-box-table").css("z-index", 60);
                    $(this).css({
                        opacity: 0.5
                    });
                    SPC.API.call("eventDragStart", [SPC.API.getEventSummary($(this)), b, c])
                },
                drag: function (b, c) {
                    SPC.monthEventDrag.dragPhase = "drag";
                    SPC.API.call("eventDrag", [SPC.API.getEventSummary($(this)), b, c])
                },
                stop: function (b, c) {
                    var d = $(this);
                    SPC.API.call("eventDragStop", [SPC.API.getEventSummary(d), b, c]);
                    var e = $(SPC.y).find(".date").text(),
                        g = e;
                    if(SPC.monthEventDrag.eventType == "multi_day") var h = e.split("-"),
                        g = h[0],
                        k = parseInt(h[1], 10) - 1,
                        h = +h[2] + (parseInt(SPC.monthEventDrag.eventDayCount) - 1),
                        g = new Date(g, k, h),
                        g = g.getFullYear() + "-" + (+g.getMonth() + 1) + "-" + g.getDate();
                    var k = d.attr("data-event-id"),
                        h = d.attr("data-start-time"),
                        i = d.attr("data-end-time"),
                        m = d.attr("data-invitation");
                    if(e == "0000-00-00" || g == "0000-00-00") SPC.Calendar.refresh();
                    else {
                        var s = {
                            spcAppRequest: "calendar/event/dragEvent",
                            params: {
                                isArray: true,
                                id: k,
                                startDate: e,
                                endDate: g,
                                startTime: h,
                                endTime: i,
                                invitation: m,
                                userFields: {}
                            }
                        };
                        $.extend(s.userFileds, SPC.API.call("eventDragUpdateBeforeRequest", [SPC.API.getEventSummary(d)]));
                        $.ajax({
                            data: s,
                            success: function (b) {
                                SPC.LAST_ACTION = "calendar:event:update";
                                SPC.flashMsg(SPC.translate("Event Saved"));
                                SPC.refresh();
                                $.extend(s.userFileds, SPC.API.call("eventDragUpdateAfterRequest", [SPC.API.getEventSummary(d), b]))
                            }
                        });
                        setTimeout(function () {
                            SPC.monthEventDrag.dragPhase = "stop"
                        }, 10)
                    }
                }
            })
        };
        SPC.Calendar.Event.initStandardEventDndAndResize = function () {
            if(SPC.sender == "public") return false;
            $(".spc-event.change", document.getElementById("spc-week-cal-tmpl-wrapper")).resizable({
                handles: "n,s",
                grid: [0, 3],
                distance: 0,
                animateDuration: "fast",
                start: function (b, c) {
                    SPC.eventResizeStart = true;
                    var d = $(this);
                    d.css({
                        opacity: "0.6",
                        "z-index": "1000"
                    });
                    SPC.API.call("eventResizeStart", [SPC.API.getEventSummary(d), b, c])
                },
                resize: function (b, c) {
                    SPC.mDown = false;
                    var d = $(this),
                        k, i;
                    if($.ui.curResizeDirection == "n") {
                        k = d.attr("data-end-time").split(":");
                        i = parseInt(60 * d.height() / 40 / 5);
                        k = (new Date(2010, 1, 1, k[0], Number(k[1]) - i * 5)).getTime();
                        i = SPC.Date.convertTime(k);
                        d.attr("data-start-time", SPC.Date.convertTime(k, "core"));
                        $(".spc-week-event-title-start-time", d).text(i)
                    } else {
                        k = d.attr("data-start-time").split(":");
                        i = parseInt(60 * d.height() / 40 / 5);
                        k = (new Date(2010, 1, 1, k[0], Number(k[1]) + i * 5)).getTime();
                        i = SPC.Date.convertTime(k);
                        d.attr("data-end-time", SPC.Date.convertTime(k, "core"));
                        $(".spc-week-event-title-end-time", d).text(i)
                    }
                    SPC.API.call("eventResize", [SPC.API.getEventSummary(d),
                    b, c])
                },
                stop: function (b, c) {
                    var d = $(this);
                    SPC.mDown = false;
                    d.css("opacity", "1");
                    if(SPC.API.call("eventResizeStop", [SPC.API.getEventSummary(d), b, c]) !== false) {
                        SPC.event = this;
                        SPC.currentEvent.eventId = d.attr("data-event-id");
                        SPC.currentEvent.endTime = d.attr("data-end-time");
                        SPC.currentEvent.invitation = d.attr("data-invitation");
                        var k = {
                            spcAppRequest: "calendar/event/resizeEvent",
                            params: {
                                isArray: true,
                                id: SPC.currentEvent.eventId,
                                startTime: d.attr("data-start-time"),
                                endTime: SPC.currentEvent.endTime,
                                invitation: SPC.currentEvent.invitation,
                                userFields: {}
                            }
                        };
                        d.attr("data-end-time", SPC.currentEvent.endTime);
                        k.userData = $.extend(k.params.userFileds, SPC.API.call("resizeUpdateBeforeRequest", [SPC.API.getEventSummary(d)]));
                        $.ajax({
                            data: k,
                            success: function (b) {
                                SPC.LAST_ACTION = "calendar:event:update";
                                SPC.flashMsg(SPC.translate("Event Saved"));
                                SPC.refresh();
                                SPC.API.call("resizeUpdateAfterRequest", [SPC.API.getEventSummary(d), b])
                            }
                        });
                        setTimeout(function () {
                            SPC.eventResizeStart = false
                        }, 10)
                    }
                }
            });
            var b = document.getElementById("spc-week-cal-tmpl-wrapper"),
                c = $(".spc-week-cal-timeslot:eq(0)", b),
                d = c.width() + 1;
            c.height();
            c = SPC.Calendar.currentView == "day" ? [1, 3] : [d, 3];
            $(".spc-event.change", b).draggable({
                containment: b,
                grid: c,
                distance: 30,
                start: function (b, c) {
                    b.stopPropagation();
                    var d = $(this);
                    d.css({
                        "z-index": 9999,
                        opacity: 0.7
                    });
                    SPC.eventDragStart = true;
                    SPC.mDown = false;
                    var k = d.attr("data-start-date"),
                        i = k.split("-");
                    SPC.dragStartDate = k;
                    var k = +i[2],
                        m = +i[1] - 1,
                        i = i[0],
                        s = d.attr("data-start-time");
                    SPC.WEEK.DD.dateTs = (new Date(i, m, k)).getTime();
                    SPC.WEEK.DD.left = d.position().left;
                    SPC.WEEK.DD.top = d.position().top;
                    SPC.eventOffsetStart = d.position().top;
                    SPC.eventOffsetStart = c.position.top;
                    SPC.eventStartTime = s.split(":");
                    SPC.eventHeight = d.height();
                    SPC.API.call("eventDragStart", [SPC.API.getEventSummary(d), b, c])
                },
                drag: function (b, c) {
                    b.stopPropagation();
                    var d = $(this),
                        k = parseInt((Number(SPC.eventStartTime[1]) + (c.position.top - SPC.eventOffsetStart) * 60 / 40) / 5),
                        i = new Date(2010, 1, 1, SPC.eventStartTime[0], k * 5),
                        k = i.getTime();
                    SPC.Date.convertTime(k, "core");
                    k = SPC.Date.convertTime(k);
                    $(".spc-week-event-title-start-time",
                    d).text(k);
                    var m = Math.ceil(60 * SPC.eventHeight / 200) * 5,
                        i = (new Date(2010, 1, 1, i.getHours(), Number(i.getMinutes()) + m)).getTime();
                    SPC.Date.convertTime(i, "core");
                    i = SPC.Date.convertTime(i);
                    $(".spc-week-event-title-end-time", d).text(i);
                    d.attr("data-start-time", SPC.Date.convertTimeFormat(k));
                    d.attr("data-end-time", SPC.Date.convertTimeFormat(i));
                    SPC.API.call("eventDrag", [SPC.API.getEventSummary(d), b, c])
                },
                stop: function (b, c) {
                    b.stopPropagation();
                    var h = $(this),
                        k = [];
                    SPC.API.call("eventDragStop", [SPC.API.getEventSummary(h)]);
                    $(".spc-week-cal-header-date", document.getElementById("spc-week-cal-header")).each(function () {
                        k.push($(this).attr("data-date"))
                    });
                    var i = {
                        spcAppRequest: "calendar/event/dragEvent",
                        params: {
                            isArray: true,
                            id: h.attr("data-event-id"),
                            startTime: SPC.Date.convertTimeFormat($(".spc-week-event-title-start-time", h).text(), "core"),
                            endTime: SPC.Date.convertTimeFormat($(".spc-week-event-title-end-time", h).text(), "core"),
                            invitation: h.attr("data-invitation"),
                            userFields: {}
                        }
                    };
                    if(SPC.Calendar.currentView == "staff") $.extend(i.params, {
                        calId: SPC.Calendar.Staff.Vertical.getStaffCalIdFromElementPosition(c.offset.left),
                        startDate: SPC.currentDate,
                        endDate: SPC.currentDate
                    });
                    else {
                        var m = parseInt((h.position().left - SPC.WEEK.DD.left) / (d - 5));
                        $.extend(i.params, {
                            startDate: k[$.inArray(SPC.dragStartDate, k) + m],
                            endDate: k[$.inArray(SPC.dragStartDate, k) + m]
                        })
                    }
                    h.attr("data-start-date", i.startDate);
                    h.attr("data-start-time", i.startTime);
                    h.attr("data-end-date", i.endDate);
                    h.attr("data-end-time", i.endTime);
                    i.userFields = $.extend(i.userFields, SPC.API.call("dragUpdateBeforeRequest", [SPC.API.getEventSummary(h)]));
                    $.ajax({
                        data: i,
                        success: function (b) {
                            SPC.LAST_ACTION = "calendar:event:update";
                            SPC.flashMsg(SPC.translate("Event Saved"));
                            SPC.API.call("dragUpdateAfterRequest", [SPC.API.getEventSummary(h), b]);
                            SPC.refresh()
                        }
                    });
                    SPC.mDown = false;
                    setTimeout(function () {
                        SPC.eventDragStart = false
                    }, 10)
                }
            })
        };
        SPC.flashMsg = function (b, c, d) {
            d = d || 5E3;
            c = c || "info";
            typeof SPC.flashMsgTimeoutId !== "undefined" && window.clearTimeout(SPC.flashMsgTimeoutId);
            var e = $("#status"),
                g = e.parent("td");
            c == "info" ? g.removeClass("flash-msg-error").addClass("flash-msg-info") : c == "error" && g.removeClass("flash-msg-info").addClass("flash-msg-error");
            e.html(b);
            e.show();
            SPC.flashMsgTimeoutId = setTimeout(function () {
                e.hide();
                g.removeClass()
            }, d)
        };
        $("#search-dialog").dialog({
            title: SPC.translate("Search Results"),
            autoOpen: !1,
            modal: !1,
            width: 600,
            height: 350
        });
        $("#do-search").bind("click", function (b) {
            b.preventDefault();
            b = $("#search_box").val();
            SPC.ajax("core/search/search", [b, "calendar"], function (b) {
                b = b.result;
                b.sort(function (b, c) {
                    return b.start_date == c.start_date ? 0 : b.start_date < c.start_date ? -1 : 1
                });
                var d = "<table id='event-search-list-table'>                                <tbody>",
                    e, g, h, k, i, m, s, o, n;
                SPC.Array.foreach(b, function (b, c) {
                    e = SPC.USER_CALENDARS[c.cal_id].permission;
                    g = SPC.USER_CALENDARS[c.cal_id].color;
                    h = SPC.Calendar.Event.getEventData(c);
                    m = c.start_date;
                    o = c.start_time;
                    s = c.end_date;
                    n = c.end_time;
                    k = SPC.Calendar.Event.getEventTitle(c.title);
                    i = SPC.Date.getUserLongDate(m) + ", " + SPC.Date.convertTimeFormat(o) + " - " + SPC.Date.convertTimeFormat(n);
                    c.type == "standard" && o == "00:00" && n == "00:00" && (i = SPC.Date.getUserLongDate(m) + ", " + SPC.translate("All day"));
                    c.type == "multi_day" && (i = o == "00:00" && n == "00:00" ? SPC.Date.getUserLongDate(m) + " - " + SPC.Date.getUserLongDate(s) : i + (SPC.Date.getUserLongDate(m) + ", " + SPC.Date.convertTimeFormat(o) + " - " + SPC.Date.getUserLongDate(s) + ", " + SPC.Date.convertTimeFormat(n)));
                    d = d + ("<tr>                                <td class='spc-event agenda " + e + "' " + h + ">                                    <span style='width: 350px; display: inline-block;'>" + i + "</span>                                    <span style='color: " + g + ";'>" + k + "</span>                                </td>                            </tr>")
                });
                d = d + "</tbody>                        </table>";
                $("#search-result-box").html(d)
            })
        });
        $("#search").bind("focus", function () {
            var b = $(this);
            if(b.val().toLowerCase() == SPC.translate("Search").toLowerCase()) {
                b.val("");
                b.css({
                    color: "#000",
                    "font-style": "normal"
                })
            }
        }).bind("blur", function () {
            var b = $(this);
            if(b.val().toLowerCase() == "") {
                b.css({
                    color: "#999",
                    "font-style": "italic"
                });
                b.val(SPC.translate("Search"))
            }
        });
        $("#search-form").bind("submit",

        function () {
            var b = $("#search").val();
            if(b == "") return false;
            $("#search_box").val(b);
            $("#do-search").trigger("click");
            $("#search-dialog").dialog("open");
            return false
        });
        SPC.Calendar.drawClock = function (b) {
            if($.inArray(SPC.Calendar.currentView, ["day", "week", "custom"]) != -1) {
                $(".timemarker").remove();
                $(".timemarker-dot").remove();
                var c, d;
                d = $("#spc-week-cal-header .today");
                if(d.length) {
                    c = d.position().left;
                    d = d.width();
                    $("#spc-week-cal-tmpl-wrapper").append('<div class="timemarker"\t\t\t\t\t\t\t\t\t\tstyle="\t\t\t\t\t\t\t\t\t\t\tz-index: 999;\t\t\t\t\t\t\t\t\t\t\theight: 0;\t\t\t\t\t\t\t\t\t\t\tborder: 1px solid #FF7F6E;\t\t\t\t\t\t\t\t\t\t\twidth: ' + d + "px;\t\t\t\t\t\t\t\t\t\t\tbackground-color: red;\t\t\t\t\t\t\t\t\t\t\tposition: absolute;\t\t\t\t\t\t\t\t\t\t\ttop: " + b + "px;\t\t\t\t\t\t\t\t\t\t\tleft: " + c + 'px;"></div>')
                }
                if($(".spc-week-cal-row-time:eq(0)", SPC.Calendar.Dom.SpcMainApp).length) {
                    c = $(".spc-week-cal-row-time:eq(0)", SPC.Calendar.Dom.SpcMainApp).position().left + $(".spc-week-cal-row-time:eq(0)").width();
                    $("#spc-week-cal-tmpl-wrapper").append('<div class="timemarker-dot"\t\t\t\t\t\t\t\t\t\t\tstyle="\t\t\t\t\t\t\t\t\t\t\t\tz-index: 999;\t\t\t\t\t\t\t\t\t\t\t\theight: 0;\t\t\t\t\t\t\t\t\t\t\t\tborder: 1px solid #FF7F6E;\t\t\t\t\t\t\t\t\t\t\t\twidth: 3px;\t\t\t\t\t\t\t\t\t\t\t\tbackground-color: red;\t\t\t\t\t\t\t\t\t\t\t\tposition: absolute;\t\t\t\t\t\t\t\t\t\t\t\ttop: ' + b + "px;\t\t\t\t\t\t\t\t\t\t\t\tleft: " + c + 'px;"></div>')
                }
                SPC.LAST_ACTION != "calendar:event:create" && (SPC.LAST_ACTION != "calendar:event:update" && SPC.LAST_ACTION != "calendar:calendar-settings:update") && $("#spc-week-cal-tmpl-wrapper").scrollTop(b);
                SPC.LAST_ACTION = ""
            }
        };
        SPC.remindedEvents = [];
        SPC.appInit = !1;
        SPC.checkPopupReminder = function () {
            if(SPC.Calendar.pupupReminderChecker != "interval") SPC.Calendar.drawClock(SPC.Calendar.timeMarkerPos);
            else {
                SPC.showLoadingMsg = false;
                $.ajax({
                    data: {
                        spcAppRequest: "calendar/reminder/checkPopupReminder"
                    },
                    success: function (b) {
                        SPC.Calendar.drawClock(b.timemarker);
                        SPC.Calendar.timeMarkerPos = b.timemarker;
                        if(b.events.length > 0) for(var b = b.events, c, d = 0, e = b.length; d < e; d++) if(SPC.Array.arraySearch(b[d].id, SPC.remindedEvents) === false) {
                            SPC.remindedEvents.push(b[d].id);
                            (c = SPC.Calendar.getReminderPopupMsg(b[d].cal_id, b[d])) && alert(c)
                        }
                        SPC.Calendar.pupupReminderChecker = ""
                    }
                })
            }
        };
        SPC.LAST_ACTION = "";
        SPC.Calendar.getReminderPopupMsg = function (b, c) {
            c.title = c.title || SPC.translate("(No title)");
            return SPC.defaultPopupReminderMessages[b].replace(/%calendar%/ig,
            SPC.USER_CALENDARS[c.cal_id].name).replace(/%start-date%/ig, SPC.Date.dateConverter.coreToUser(c.start_date)).replace(/%start-time%/ig, SPC.Date.convertTimeFormat(c.start_time)).replace(/%end-date%/ig, SPC.Date.dateConverter.coreToUser(c.end_date)).replace(/%end-time%/ig, SPC.Date.convertTimeFormat(c.end_time)).replace(/%title%/ig, c.title).replace(/%location%/ig, c.location).replace(/%description%/ig, c.description)
        };
        SPC.Calendar.pupupReminderChecker = "interval";
        setInterval(function () {
            SPC.Calendar.pupupReminderChecker = "interval";
            SPC.checkPopupReminder()
        }, 6E4);
        SPC.checkPopupReminder();
        $.fn.spcDrawReminders = function () {
            var b = $(this),
                c = SPC.eventReminderCount,
                d = '<li>\t\t\t\t\t\t\t\t<span class="group reminder">\t\t\t\t\t\t\t\t\t<select class="type">\t\t\t\t\t\t\t\t\t\t<option value="email">Email</option>\t\t\t\t\t\t\t\t\t\t<option value="popup">Popup</option>\t\t\t\t\t\t\t\t\t</select>\t\t\t\t\t\t\t\t\t<input class="time" type="text" value="10" style="width: 56px;"/>\t\t\t\t\t\t\t\t\t<select class="time-type">\t\t\t\t\t\t\t\t\t\t<option value="minute">' + SPC.translate("minutes") + '</option>\t\t\t\t\t\t\t\t\t\t<option value="hour">' + SPC.translate("hours") + '</option>\t\t\t\t\t\t\t\t\t\t<option value="day">' + SPC.translate("days") + '</option>\t\t\t\t\t\t\t\t\t\t<option value="week">' + SPC.translate("weeks") + '</option>\t\t\t\t\t\t\t\t\t</select>\t\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t\t<span style="display: inline-block;" class="ui-icon ui-icon-minus spc-delete-reminder"></span>\t\t\t\t\t\t\t\t<span style="display: inline-block;" class="ui-icon ui-icon-plus spc-add-reminder"></span>\t\t\t\t\t\t\t</li>';
            b.prepend("<ul class='spc-reminder-list'>" + d + "</ul>");
            b.find(".reminder").length == c && b.find(".spc-add-reminder").hide();
            b.delegate(".spc-add-reminder", "click", function () {
                $(".spc-reminder-list", b).find(".spc-add-reminder").remove();
                $(".spc-reminder-list", b).append(d);
                b.find(".reminder").length == c && b.find(".spc-add-reminder").remove()
            }).delegate(".spc-delete-reminder", "click", function () {
                $(this).closest("li").remove();
                b.find(".spc-add-reminder").length || b.find("li:last").append('<span style="display: inline-block;" class="ui-icon ui-icon-plus spc-add-reminder"></span>');
                b.find("li").length || b.find(".spc-reminder-list").append('<span style="display: inline-block;" class="ui-icon ui-icon-plus spc-add-reminder"></span>')
            })
        };
        SPC.getDefaultReminderBoxes = function (b) {
            if(!b || b.length == 0) return '<li>\t\t\t\t\t\t<span style="display: inline-block;" class="ui-icon ui-icon-plus spc-add-reminder"></span>\t\t\t\t\t</li>';
            for(var c, d, e, g = {
                minute: SPC.translate("minutes"),
                hour: SPC.translate("hours"),
                day: SPC.translate("days"),
                week: SPC.translate("weeks")
            }, h = "", k = b.length, i = 0; i < k; i++) {
                c = b[i].type;
                d = b[i].time;
                e = b[i].time_unit;
                var h = h + '<li>\t\t\t\t\t\t\t\t<span class="group reminder">\t\t\t\t\t\t\t\t<select class="type">',
                    h = c == "popup" ? h + '<option value="email">Email</option>\t\t\t\t\t\t\t\t<option value="popup" selected="selected">Popup</option>' : h + '<option value="email" selected="selected">Email</option>\t\t\t\t\t\t\t\t<option value="popup">Popup</option>',
                    h = h + "</select>",
                    h = h + (' <input class="time" type="text" value="' + d + '" style="width: 56px;"/> '),
                    h = h + '<select class="time-type">',
                    m;
                for(m in g) h = e == m ? h + ('<option value="' + m + '" selected="selected">' + g[m] + "</option>") : h + ('<option value="' + m + '">' + g[m] + "</option>");
                h = h + '</select>\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t<span style="display: inline-block;" class="ui-icon ui-icon-minus spc-delete-reminder"></span>';
                h = k < SPC.eventReminderCount && i == k - 1 ? h + '<span style="display: inline-block;" class="ui-icon ui-icon-plus spc-add-reminder"></span>\t\t\t\t\t\t</li>' : h + "</li>"
            }
            return h
        };
        $("#edit-calendar-dialog-reminders").spcDrawReminders();
        $("#add-event-dialog-reminders").spcDrawReminders();
        $("#edit-event-dialog-reminders").spcDrawReminders();
        jQuery.fn.smartTimeBox = function (b) {
            function c() {
                var c = ["00", "00"],
                    g = $(b.parentDate).val(),
                    h = $(b.dependElementParentDate).val();
                g == h && (c = SPC.Date.convertTimeFormat(e.val(), "core").split(":"));
                g = [];
                h = Number(c[0]);
                for(c = SPC.Date.mktime(h, Number(c[1])); h <= 23; h++) {
                    for(var s = 0; s <= 30; s = s + 30) {
                        g.push(SPC.Date.convertTime(c));
                        c = c + 18E5
                    }
                    if(h == 23) break
                }
                if(d.next(".smart-time-box").length) d.next(".smart-time-box").html("<li>" + g.join("</li><li>") + "</li>");
                else {
                    g = "<ul class='smart-time-box'> <li>" + g.join("</li><li>") + "</li> </ul>";
                    d.after(g)
                }
            }
            var d = $(this),
                b = $.extend(b, {});
            d.bind("click", function (b) {
                b.stopPropagation();
                d.next(".smart-time-box").css({
                    left: d.position().left + "px",
                    top: d.position().top + d.height() + 5 + "px"
                });
                d.next(".smart-time-box").show()
            });
            if(b.dependElement) {
                var e = $(b.dependElement);
                c();
                d.bind("initTimeBox", function () {
                    c()
                });
                $(b.parentDate).bind("change", function () {
                    c()
                });
                $("#add-event-dialog, #edit-event-dialog").bind("dialogopen", function () {
                    c()
                })
            } else {
                var g = "<ul class='smart-time-box'>",
                    h;
                for(h in SPC.Calendar.timeSlots) g = g + ("<li>" + SPC.Date.convertTimeFormat(SPC.Calendar.timeSlots[h]) + "</li>");
                d.after(g + "</ul>")
            }
            d.next(".smart-time-box").bind("click", function (c) {
                c.stopPropagation();
                if(c.target.tagName.toLowerCase() == "li") {
                    $(c.target).parent().hide();
                    if(b.dependElement) d.val($(c.target).text());
                    else {
                        d.val($(c.target).text());
                        c = $(b.siblingTimeBox);
                        c.trigger("initTimeBox");
                        var e = c.next(".smart-time-box").find("li:eq(1)").text();
                        c.val(e)
                    }
                }
            })
        };
        $("#add-event-dialog-start-time").smartTimeBox({
            parentDate: "#add-event-dialog-start-date",
            siblingTimeBox: "#add-event-dialog-end-time"
        });
        $("#add-event-dialog-end-time").smartTimeBox({
            parentDate: "#add-event-dialog-end-date",
            dependElement: "#add-event-dialog-start-time",
            dependElementParentDate: "#add-event-dialog-start-date"
        });
        $("#edit-event-dialog-start-time").smartTimeBox({
            parentDate: "#edit-event-dialog-start-date",
            siblingTimeBox: "#edit-event-dialog-end-time"
        });
        $("#edit-event-dialog-end-time").smartTimeBox({
            parentDate: "#edit-event-dialog-end-date",
            dependElement: "#edit-event-dialog-start-time",
            dependElementParentDate: "#edit-event-dialog-start-date"
        });
        $(".ui-dialog").live("click", function (b) {
            $(b.target).parents(".smart-time-box").length == 0 && $(this).find(".smart-time-box").hide()
        });
        SPC.WEEK = {};
        SPC.WEEK.DD = {};
        SPC.drawCalendars = function (b) {
            SPC.myCalendars = [];
            SPC.otherCalendars = [];
            SPC.groupCalendars = [];
            var c = "",
                d = "",
                e = "",
                g = "",
                h, k, i, m = "",
                s = "",
                o = "";
            i = "";
            for(var n in b) {
                SPC.sender == "public" && (b[n].status = "on");
                k = b[n].owner;
                if(k == "self") {
                    SPC.myCalendars.push(b[n]);
                    h = b[n].id
                } else if(k == "other") {
                    SPC.otherCalendars.push(b[n]);
                    h = b[n].cal_id
                } else if(k == "group") {
                    SPC.groupCalendars.push(b[n]);
                    h = b[n].cal_id;
                    SPC.USER_ROLE == "admin" && (h = b[n].id)
                } else continue;
                if(b[n].show_in_list == "1") {
                    i = b[n].type;
                    m = b[n].name;
                    s = b[n].description;
                    o = b[n].color;
                    i = '<span class="calendarId hidden">' + h + '</span>\t\t\t\t\t\t\t   <span class="calendar-name hidden">' + m + '</span>\t\t\t\t\t\t\t   <span class="calendar-description hidden">' + s + '</span>\t\t\t\t\t\t\t   <span class="calendar-color hidden">' + o + '</span>                               <span class="calendar-type hidden">' + i + "</span>";
                    i = SPC.USER_ROLE == "admin" && k == "group" ? i + '<span class="calendar-owner hidden">self</span>' : i + ('<span class="calendar-owner hidden">' + k + "</span>");
                    i = SPC.sender == "private" ? '<span class="edit-calendar ui-icon ui-icon-carat-1-s pointer"> ' + i + " </span>" : "";
                    if(k == "self") {
                        c = b[n].status == "on" ? c + ('<tr>\t\t\t\t\t\t\t\t\t\t\t<td id="calendar-' + h + '" title="' + m + '" class="calendar on">\t\t\t\t\t\t\t\t\t\t\t\t<div                                                    class="' + o + '"\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="                                                        border: 1px solid ' + o + ";                                                        background-color: " + o + ';">' + m.substr(0, 20) + ' </div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t\t<td style="width: 5px;">' + i + "</td>\t\t\t\t\t\t\t\t\t\t</tr>") : c + ('<tr>\t\t\t\t\t\t\t\t\t\t\t<td id="calendar-' + h + '" title="' + m + '" class="calendar off ui-corner-all">\t\t\t\t\t\t\t\t\t\t\t\t<div                                                    class="' + o + '"\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="border: 1px solid ' + o + ';">' + m.substr(0, 20) + ' </div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t\t<td style="width: 5px;">' + i + "</td>\t\t\t\t\t\t\t\t\t\t</tr>");
                        g = g + ('<option value="' + h + '" class="' + o + '">' + m + "</option>")
                    } else if(k == "other") {
                        if(SPC.userPrefs.calendar.staff_mode != "1") {
                            d = b[n].status == "on" ? d + ('<tr>\t\t\t\t\t\t\t\t\t\t\t<td id="calendar-' + h + '" title="' + m + '" class="calendar on">\t\t\t\t\t\t\t\t\t\t\t\t<div                                                    class="' + o + '"\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="                                                        border: 1px solid ' + o + ";                                                        background-color: " + o + ';">' + m.substr(0, 20) + ' </div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t\t<td style="width: 5px;">' + i + "</td>\t\t\t\t\t\t\t\t\t\t</tr>") : d + ('<tr>\t\t\t\t\t\t\t\t\t\t\t<td id="calendar-' + h + '" title="' + m + '" class="calendar off ui-corner-all">\t\t\t\t\t\t\t\t\t\t\t\t<div\t\t\t\t\t\t\t\t\t\t\t\t\tclass="' + o + '"\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="border: 1px solid ' + o + ';">' + m.substr(0, 20) + ' </div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t\t<td style="width: 5px;">' + i + "</td>\t\t\t\t\t\t\t\t\t\t</tr>");
                            b[n].permission == "change" && (g = g + ('<option value="' + h + '" class="' + o + '">' + m + "</option>"))
                        }
                    } else if(k == "group" && SPC.userPrefs.calendar.staff_mode != "1" && SPC.USER_ROLE != "super") {
                        e = b[n].status == "on" ? e + ('<tr>\t\t\t\t\t\t\t\t\t\t\t<td id="calendar-' + h + '" title="' + m + '" class="calendar on">\t\t\t\t\t\t\t\t\t\t\t\t<div\t\t\t\t\t\t\t\t\t\t\t\t\tclass="' + o + '"\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="                                                        border: 1px solid ' + o + ";                                                        background-color: " + o + ';">' + m.substr(0, 20) + ' </div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t\t<td style="width: 5px;">' + i + "</td>\t\t\t\t\t\t\t\t\t\t</tr>") : e + ('<tr>\t\t\t\t\t\t\t\t\t\t\t<td id="calendar-' + h + '" title="' + m + '" class="calendar off ui-corner-all">\t\t\t\t\t\t\t\t\t\t\t\t<div\t\t\t\t\t\t\t\t\t\t\t\t\tclass="' + o + '"\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="border: 1px solid ' + o + ';">' + m.substr(0, 20) + ' </div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t\t<td style="width: 5px;">' + i + "</td>\t\t\t\t\t\t\t\t\t\t</tr>");
                        g = g + ('<option value="' + h + '" class="' + o + '">' + m + "</option>")
                    }
                }
            }
            $("#calendars-table tbody").html(c);
            $("#other-calendars-table tbody").html(d);
            $("#group-calendars-table tbody").html(e);
            $("#add-event-dialog-calendar,\t\t   #edit-event-dialog-calendar").html(g)
        };
        SPC.getCalendars = function () {
            $.ajax({
                data: {
                    spcAppRequest: "calendar/calendar/getCalendars"
                },
                success: function (b) {
                    SPC.USER_CALENDARS = b.calendars;
                    SPC.drawCalendars(SPC.USER_CALENDARS);
                    SPC.getCurrentCalendar();
                    SPC.Calendar.refresh()
                }
            })
        };
        SPC.getCalendars();
        if("super" == SPC.USER_ROLE || "admin" == SPC.USER_ROLE) SPC.getAdminUsersWithCalendars = function (b) {
            $.ajax({
                data: {
                    spcAppRequest: "calendar/calendar/getUsersCalendars"
                },
                success: function (c) {
                    b.call(null, c)
                }
            })
        }, $("#show-users-calendars-dialog").dialog({
            title: SPC.translate("User Calendars"),
            width: 210,
            height: "auto",
            autoOpen: !1,
            modal: !1,
            resizable: !1,
            position: [220, 100]
        }), SPC.getUsersCalendars = function (b) {
            $.ajax({
                data: {
                    spcAppRequest: "calendar/calendar/getUsersCalendars"
                },
                success: function (c) {
                    var d = SPC.USER_ROLE,
                        e,
                        g, h = "";
                    if(d == "admin") {
                        var k = c.users,
                            i;
                        for(i in k) {
                            h = h + ("<h3 class='show-users-calendars-dialog-username'>\t\t\t\t\t\t\t\t\t\t<span class='ui-icon ui-icon-carat-1-s' style='float: left; margin: 1px 0 0 -5px;'></span>" + i + "</h3>");
                            if(k[i][0].cal_name) {
                                for(var h = h + "<ul class='show-users-calendars-dialog-user-calendars ui-corner-all' style='margin-left: 10px;'>", m = 0, s = k[i].length; m < s; m++) {
                                    c = k[i][m].cal_id;
                                    d = k[i][m].cal_name;
                                    e = k[i][m].color;
                                    g = k[i][m].status;
                                    h = g == "on" ? h + ('<li id="calendar-' + c + '" title="' + d + '" class="calendar on"><div\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="' + e + ' ui-corner-all"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: #fff;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 2px 4px;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder: 1px solid #ddd;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tbackground-color:' + e + '">' + d.substr(0, 20) + " </div>\t\t\t\t\t\t\t\t\t\t\t\t</li>") : h + ('<li id="calendar-' + c + '" title="' + d + '" class="calendar off"><div\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="' + e + ' ui-corner-all"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: ' + e + ';\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 2px 4px;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder: 1px solid #ddd;">' + d.substr(0, 20) + " </div>\t\t\t\t\t\t\t\t\t\t\t\t</li>")
                                }
                                h = h + "</ul>"
                            }
                        }
                    } else if(d == "super") {
                        var o = c.admins;
                        for(i in o) {
                            h = h + ("<h3 class='show-users-calendars-dialog-username admin'>\t\t\t\t\t\t\t\t\t\t\t<span class='ui-icon ui-icon-carat-1-s' style='float: left; margin: 1px 0 0 -5px;'></span>\t\t\t\t\t\t\t\t\t\t\t\t" + o[i].username + "\t\t\t\t\t\t\t\t\t\t</h3> <div>");
                            if(typeof o[i].calendars !== "undefined" && o[i].calendars[0].cal_name !== null) {
                                h = h + "<ul class='show-users-calendars-dialog-user-calendars ui-corner-all' style='margin-left: 10px;'>";
                                m = 0;
                                for(s = o[i].calendars.length; m < s; m++) {
                                    c = o[i].calendars[m].cal_id;
                                    d = o[i].calendars[m].cal_name;
                                    e = o[i].calendars[m].color;
                                    g = o[i].calendars[m].status;
                                    h = g == "on" ? h + ('<li id="calendar-' + c + '" title="' + d + '" class="calendar on"><div\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="' + e + ' ui-corner-all"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: #fff;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 2px 4px;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder: 1px solid #ddd;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tbackground-color:' + e + '">' + d.substr(0, 20) + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t</li>") : h + ('<li id="calendar-' + c + '" title="' + d + '" class="calendar off"><div class="' + e + ' ui-corner-all"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: ' + e + '; \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 2px 4px; \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder: 1px solid #ddd;">' + d.substr(0, 20) + " </div>\t\t\t\t\t\t\t\t\t\t\t\t</li>")
                                }
                                h = h + "</ul>"
                            }
                            for(k in o[i].users) {
                                h = h + ("<h3 class='show-users-calendars-dialog-username' style='margin-left: 10px;'>\t\t\t\t\t\t\t\t\t\t\t<span class='ui-icon ui-icon-carat-1-s' style='float: left; margin: 1px 0 0 -5px;'></span>\t\t\t\t\t\t\t\t\t\t\t\t" + k + "\t\t\t\t\t\t\t\t\t\t</h3>");
                                if(o[i].users[k][0].cal_name) {
                                    h = h + "<ul class='show-users-calendars-dialog-user-calendars ui-corner-all' style='margin-left: 20px;'>";
                                    m = 0;
                                    for(s = o[i].users[k].length; m < s; m++) {
                                        c = o[i].users[k][m].cal_id;
                                        d = o[i].users[k][m].cal_name;
                                        e = o[i].users[k][m].color;
                                        g = o[i].users[k][m].status;
                                        h = g == "on" ? h + ('<li id="calendar-' + c + '" title="' + d + '" class="calendar on"><div\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="' + e + ' ui-corner-all"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: #fff;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 2px 4px;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder: 1px solid #ddd;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tbackground-color:' + e + '">' + d.substr(0, 20) + "</div>\t\t\t\t\t\t\t\t\t\t\t\t\t</li>") : h + ('<li id="calendar-' + c + '" title="' + d + '" class="calendar off"><div\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="' + e + ' ui-corner-all"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: ' + e + ';\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 2px 4px;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder: 1px solid #ddd;">' + d.substr(0, 20) + " </div>\t\t\t\t\t\t\t\t\t\t\t\t\t</li>")
                                    }
                                    h = h + "</ul>"
                                }
                            }
                            h = h + "</div>"
                        }
                    }
                    $("#show-users-calendars-dialog-content").html(h);
                    b && b();
                    SPC.Calendar.openView(SPC.userPrefs.calendar.default_view)
                }
            })
        }, $("#show-users-calendars").bind("click", function (b) {
            b.stopPropagation();
            $("#show-users-calendars-dialog").dialog("open")
        }), SPC.getUsersCalendars(), $("#show-users-calendars-dialog").delegate(".show-users-calendars-dialog-username", "click", function () {
            if($(this).find(".ui-icon").attr("class") == "ui-icon ui-icon-carat-1-s") {
                $(this).find(".ui-icon").attr("class", "ui-icon ui-icon-carat-1-e");
                /admin/.test($(this).attr("class")) ? $(this).next("div").slideUp() : $(this).next("ul").slideUp()
            } else {
                $(this).find(".ui-icon").attr("class", "ui-icon ui-icon-carat-1-s");
                /admin/.test($(this).attr("class")) ? $(this).next("div").slideDown() : $(this).next("ul").slideDown()
            }
        }).delegate(".show-users-calendars-dialog-expand-all", "click", function () {
            $("#show-users-calendars-dialog").find("ul").show().end().find(".ui-icon").attr("class", "ui-icon ui-icon-carat-1-s")
        }).delegate(".show-users-calendars-dialog-collapse-all", "click", function () {
            $("#show-users-calendars-dialog").find("ul").hide().end().find(".ui-icon").attr("class", "ui-icon ui-icon-carat-1-e")
        }), $("#add-event-dialog-show-users-calendars").button(), $("#add-event-dialog-show-users-calendars").bind("click", function () {
            $("#add-event-dialog-show-users-calendars")[0].checked ? SPC.getAdminUsersWithCalendars(function (b) {
                var c = "";
                if(SPC.USER_ROLE == "admin") {
                    var d = b.users,
                        e, g;
                    for(g in d) {
                        for(var c = c + ("<optgroup label='" + g + "'>"), b = 0, h = d[g].length; b < h; b++) {
                            e = d[g][b];
                            c = c + ("<option\t\t\t\t\t\t\t\t\t\t\t\tclass='" + e.color + "'\t\t\t\t\t\t\t\t\t\t\t\tvalue='" + e.cal_id + "'>&nbsp;&nbsp;" + e.cal_name + "</option>")
                        }
                        c = c + "</optgroup>"
                    }
                } else if(SPC.USER_ROLE == "super") {
                    e = b.admins;
                    for(g in e) {
                        c = c + ("<optgroup label='" + e[g].calendars[0].username + "'>");
                        b = 0;
                        for(h = e[g].calendars.length; b < h; b++) e[g].calendars[b].cal_name && (c = c + ("<option\t\t\t\t\t\t\t\t\t\t\t\t\tvalue='" + e[g].calendars[b].cal_id + "'\t\t\t\t\t\t\t\t\t\t\t\t\tclass='" + e[g].calendars[b].color + "'\t\t\t\t\t\t\t\t\t\t\t\t\tstyle='margin-left: 10px;'>" + e[g].calendars[b].cal_name + "</option>"));
                        c = c + "</optgroup>";
                        for(d in e[g].users) {
                            c = c + ("<optgroup label='" + d + "' style='margin-left: 10px;'>");
                            b = 0;
                            for(h = e[g].users[d].length; b < h; b++) e[g].users[d][b].cal_name && (c = c + ("<option\t\t\t\t\t\t\t\t\t\t\t\t\t\tvalue='" + e[g].users[d][b].cal_id + "'\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass='" + e[g].users[d][b].color + "'\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle='margin-left: 10px;'>" + e[g].users[d][b].cal_name + "</option>"));
                            c = c + "</optgroup>"
                        }
                    }
                }
                $("#add-event-dialog-calendar, #edit-event-dialog-calendar").append(c)
            }) : SPC.getCalendars()
        });
        SPC.currentCalendarId = null;
        SPC.currentCalendarColor = null;
        $(".calendar").live("click", function () {
            var b = $(this),
                c = "on",
                d = 0;
            b.parents("#other-calendars-table").length != 0 && (d = 1);
            if(b.parents("#group-calendars-table").length != 0) {
                d = 1;
                SPC.USER_ROLE == "admin" && (d = 0)
            }
            if(/on/.test(b.attr("class"))) {
                c = "off";
                b.attr("class", "calendar off");
                b.find("div").css({
                    "background-color": "transparent"
                })
            } else {
                b.attr("class", "calendar on");
                b.find("div").css({
                    "background-color": b.find("div").attr("class").split(" ")[0],
                    color: "#333"
                })
            }
            c = {
                spcAppRequest: "calendar/calendar/setCalendarStatus",
                params: [this.id.split("-")[1], c, d]
            };
            b.parents("#show-users-calendars-dialog").length && c.params.push(true);
            $.ajax({
                data: c,
                success: function () {
                    SPC.LAST_ACTION = "calendar:event:update";
                    SPC.Calendar.refresh()
                }
            })
        });
        SPC.getCurrentCalendar = function () {
            if(typeof $("#calendars .calendar:first").attr("class") != "undefined") {
                if(/on/.test($("#calendars .calendar:first").attr("class"))) {
                    SPC.currentCalendarColor = $("#calendars .calendar:first").find("div").attr("class").split(" ")[0];
                    SPC.currentCalendarId = $("#calendars .calendar:first").attr("id").split("-")[1]
                }
                var b = [],
                    c = [];
                $("#calendars .calendar").each(function () {
                    if(/on/.test($(this).attr("class"))) {
                        b.push($(this).attr("id").split("-")[1]);
                        c.push($(this).find("div").attr("class").split(" ")[0])
                    }
                });
                if(b.length == 1) {
                    SPC.currentCalendarColor = c[0];
                    SPC.currentCalendarId = b[0]
                } else {
                    SPC.currentCalendarColor = $("#calendars .calendar:first").find("div").attr("class").split(" ")[0];
                    SPC.currentCalendarId = $("#calendars .calendar:first").attr("id").split("-")[1]
                }
            }
        };
        p = {};
        p[SPC.translate("Create")] = function () {
            if($("#create-calendar-dialog-name").val() == "") SPC.flashMsg(SPC.translate("Please type a calendar name"), "error");
            else {
                var b = $("#create-calendar-dialog"),
                    c = $("#create-calendar-dialog-name").val(),
                    d = $("#create-calendar-dialog-description").val(),
                    e = $("#create-calendar-dialog-color").val(),
                    g = b.data("createCalendarType");
                $.ajax({
                    data: {
                        spcAppRequest: "calendar/calendar/createCalendar",
                        params: {
                            isArray: true,
                            name: c,
                            description: d,
                            color: e,
                            type: g
                        }
                    },
                    success: function () {
                        b.dialog("close");
                        SPC.getCalendars()
                    }
                })
            }
        };
        $("#create-calendar-dialog").dialog({
            title: SPC.translate("Create Calendar"),
            autoOpen: !1,
            modal: !1,
            resizable: !1,
            width: 570,
            height: "auto",
            buttons: p,
            open: function () {
                $("#create-calendar-dialog-name").val("");
                $("#create-calendar-dialog-description").val("");
                $("#create-calendar-dialog-color").val("")
            }
        });
        $("#create-calendar").bind("click", function (b) {
            b.stopPropagation();
            b = $("#create-calendar-dialog");
            b.dialog("option", "title", SPC.translate("Create Calendar"));
            b.data("createCalendarType", "user");
            b.dialog("open")
        });
        $("#create-group-calendar").bind("click", function (b) {
            b.stopPropagation();
            b = $("#create-calendar-dialog");
            b.dialog("option", "title", SPC.translate("Create Group Calendar"));
            b.data("createCalendarType", "group");
            b.dialog("open")
        });
        SPC.Calendar.Dialogs.editCalendarDialog = $("#edit-calendar-dialog");
        SPC.Calendar.Dialogs.editCalendarDialog.dialog({
            title: SPC.translate("Calendar Settings"),
            autoOpen: !1,
            modal: !1,
            resizable: !1,
            width: 600,
            height: 500
        });
        SPC.Calendar.jQuery.SpcCalAppWrapper.delegate(".edit-calendar", "click", function () {
            var b = $(".calendarId", this).text(),
                c = $(".calendar-owner",
                this).text(),
                d = $(".calendar-type", this).text(),
                e = $(".calendar-name", this).text(),
                g = $(".calendar-description", this).text(),
                h = $(".calendar-color", this).text();
            SPC.Calendar.Dialogs.editCalendarDialog.data({
                calendarId: b,
                "calendar-owner": c,
                "calendar-type": d
            }).dialog("option", "title", e + " " + SPC.translate("Calendar Settings"));
            $("#edit-calendar-dialog-name").val(e);
            $("#edit-calendar-dialog-description").val(g);
            $("#edit-calendar-dialog-color").val(h).css({
                "background-color": $("#edit-calendar-dialog-color").val()
            });
            SPC.Calendar.Dialogs.editCalendarDialog.dialog("open");
            $(".edit-calendar-dialog-tabs-1").trigger("click");
            c != "self" ? $(".edit-calendar-dialog-tabs-2,\t\t\t  .edit-calendar-dialog-tabs-3,\t\t\t  .edit-calendar-dialog-tabs-4").hide() : $(".edit-calendar-dialog-tabs-2,\t\t\t  .edit-calendar-dialog-tabs-3,\t\t\t  .edit-calendar-dialog-tabs-4").show();
            SPC.getSharedCalendarUsers(b)
        });
        $("#edit-calendar-dialog-tabs-1-save").bind("click", function () {
            var b = $("#edit-calendar-dialog").data("calendarId"),
                c = $("#edit-calendar-dialog").data("calendar-owner"),
                d = $("#edit-calendar-dialog-name").val(),
                e = $("#edit-calendar-dialog-description").val(),
                g = $("#edit-calendar-dialog-color").val();
            $.ajax({
                data: {
                    spcAppRequest: "calendar/calendar/updateCalendar",
                    params: {
                        isArray: true,
                        calendarId: b,
                        owner: c,
                        name: d,
                        description: e,
                        color: g
                    }
                },
                success: function () {
                    SPC.LAST_ACTION = "calendar:calendar-settings:update";
                    SPC.Calendar.refresh();
                    SPC.getCalendars();
                    $("#edit-calendar-dialog").dialog("close")
                }
            })
        });
        $("#edit-calendar-dialog-tabs-1-hide").bind("click", function () {
            var b = $("#edit-calendar-dialog").data("calendarId"),
                c = $("#edit-calendar-dialog").data("calendar-owner");
            SPC.changeCalendarListStatus(b, c, "0")
        });
        $("#edit-calendar-dialog-tabs-1-delete").bind("click", function () {
            if(window.confirm(SPC.translate("Are you sure?"))) if($("#edit-calendar-dialog").data("calendar-owner") == "group") SPC.flashMsg(SPC.translate("You can not delete the group calendar!"), "error");
            else {
                var b = SPC.Calendar.Dialogs.editCalendarDialog.data();
                $.ajax({
                    data: {
                        spcAppRequest: "calendar/calendar/deleteCalendar",
                        params: [b.calendarId, b["calendar-owner"],
                        b["calendar-type"]]
                    },
                    success: function () {
                        SPC.getCalendars();
                        SPC.Calendar.refresh();
                        $("#edit-calendar-dialog").dialog("close")
                    }
                })
            }
        });
        SPC.saveDefaultReminders = function (b, c) {
            var d = $("#edit-calendar-dialog").data("calendarId"),
                e = {
                    spcAppRequest: "calendar/reminder/saveDefaultReminders",
                    params: {
                        isArray: true,
                        calId: d,
                        reminders: []
                    }
                }, g, h, k, i;
            if(c) e.params.saveForAll = true;
            $("#edit-calendar-dialog-tabs-3 .reminder").each(function () {
                g = $(this);
                h = g.find(".type").val();
                k = g.find(".time").val();
                i = g.find(".time-type").val();
                e.params.reminders.push({
                    type: h,
                    time: k,
                    timeType: i
                })
            });
            $.ajax({
                data: e,
                success: function () {
                    SPC.flashMsg(SPC.translate("Default reminders was saved successfully"));
                    c ? $.each(SPC.defaultReminders, function (b) {
                        SPC.defaultReminders[b] = e.params.reminders
                    }) : SPC.defaultReminders[d] = e.params.reminders;
                    SPC.Calendar.initCalReminders()
                }
            })
        };
        $(".edit-calendar-dialog-save-reminders").bind("click", function (b) {
            SPC.saveDefaultReminders(b)
        });
        $(".edit-calendar-dialog-save-reminders-for-all").bind("click", function (b) {
            SPC.saveDefaultReminders(b,
            true)
        });
        $(".edit-calendar-dialog-tabs-4").bind("click", function () {
            var b = $("#edit-calendar-dialog").data("calendarId");
            $.ajax({
                data: {
                    spcAppRequest: "calendar/reminder/getReminderMessages",
                    params: [b]
                },
                success: function (b) {
                    var d = b.messages.email,
                        b = b.messages.popup;
                    $("#edit-calendar-dialog-reminder-msg-email").val(d);
                    $("#edit-calendar-dialog-reminder-msg-popup").val(b)
                }
            })
        });
        SPC.saveReminderMessage = function (b) {
            var c = $("#edit-calendar-dialog").data("calendarId"),
                d = $("#edit-calendar-dialog-reminder-msg-email").val(),
                e = $("#edit-calendar-dialog-reminder-msg-popup").val(),
                c = {
                    spcAppRequest: "calendar/reminder/saveReminderMessage",
                    params: {
                        isArray: true,
                        calId: c,
                        messages: {
                            email: d,
                            popup: e
                        }
                    }
                };
            if(b) c.params.saveForAll = true;
            $.ajax({
                data: c,
                success: function () {
                    SPC.flashMsg(SPC.translate("Reminder messages were successfully saved"));
                    SPC.defaultPopupReminderMessages[c] = e;
                    if(b) for(var c in SPC.defaultPopupReminderMessages) SPC.defaultPopupReminderMessages[c] = e
                }
            })
        };
        $(".edit-calendar-dialog-save-reminder-message").bind("click", function () {
            SPC.saveReminderMessage()
        });
        $(".edit-calendar-dialog-save-reminder-message-for-all").bind("click", function () {
            SPC.saveReminderMessage(true)
        });
        $(".edit-calendar-dialog-tabs-3").bind("click", function () {
            var b = $("#edit-calendar-dialog").data("calendarId");
            $.ajax({
                data: {
                    spcAppRequest: "calendar/reminder/getDefaultReminders",
                    params: [b]
                },
                success: function (b) {
                    $("#edit-calendar-dialog-tabs-3").find(".spc-reminder-list").html(SPC.getDefaultReminderBoxes(b.defaultReminders))
                }
            })
        });
        SPC.editCalendarDialogTabs = $("#edit-calendar-dialog-tabs").tabs();
        $(".spc-colorboxes li").bind("click", function () {
            $(this).parents("div").find(".spc-color").css({
                "background-color": $(this).attr("title")
            }).val($(this).attr("title"))
        });
        $(".edit-calendar-dialog-tabs-2").bind("click", function () {
            SPC.getSharedCalendarUsers($("#edit-calendar-dialog").data("calendarId"))
        });
        $("#new-share").bind("click", function () {
            var b = $("#edit-calendar-dialog").data("calendarId"),
                c = $("#new-share-username").val(),
                d = $("#new-share-permission option:selected").val(),
                e = $("#edit-calendar-dialog-name").val(),
                g = $("#edit-calendar-dialog-description").val();
            c ? $.ajax({
                data: {
                    spcAppRequest: "calendar/calendar/shareCalendar",
                    params: {
                        isArray: true,
                        calendarId: b,
                        sharedUsername: c,
                        permission: d,
                        name: e,
                        description: g
                    }
                },
                success: function () {
                    SPC.getSharedCalendarUsers($("#edit-calendar-dialog").data("calendarId"))
                }
            }) : SPC.flashMsg(SPC.translate("Please type a username"), "error")
        });
        SPC.getSharedCalendarUsers = function (b) {
            $.ajax({
                data: {
                    spcAppRequest: "calendar/calendar/getCalendarShareList",
                    params: [b]
                },
                success: function (b) {
                    SPC.drawSharedCalendarList(b.sharedUsers)
                }
            })
        };
        SPC.drawSharedCalendarList = function (b) {
            for(var c = "", d = "", e = 0, g = b.length; e < g; e++) {
                d = b[e].permission == "see" ? '<select class="share-permission">\t\t\t\t\t\t\t\t\t<option value="see" selected="selected">' + SPC.translate("See all events") + '</option>\t\t\t\t\t\t\t\t\t<option value="change">' + SPC.translate("Make changes to events") + "</option>                                </select>" : '<select class="share-permission">\t\t\t\t\t\t\t\t\t<option value="see">' + SPC.translate("See all events") + '</option>\t\t\t\t\t\t\t\t\t<option value="change" selected="selected">' + SPC.translate("Make changes to events") + "</option>\t\t\t\t\t\t\t\t</select>";
                c = c + ('<tr class="' + b[e].id + '">\t\t\t\t\t\t<td>' + b[e].username + "</td>\t\t\t\t\t\t<td>" + d + '</td>\t\t\t\t\t\t<td> <span class="delete-shared-calendar ui-icon ui-icon-trash pointer"></span> </td>\t\t\t\t\t</tr>')
            }
            $("#calendar-share-table tfoot").html(c)
        };
        $("#edit-calendar-dialog-tabs-2").delegate(".share-permission", "change", function () {
            $.ajax({
                data: {
                    spcAppRequest: "calendar/calendar/changeSharedCalendarPermission",
                    params: {
                        isArray: true,
                        sharedCalendarId: $(this).parents("tr").attr("class"),
                        permission: $(this).val()
                    }
                },
                success: function () {
                    SPC.getSharedCalendarUsers($("#edit-calendar-dialog").data("calendarId"))
                }
            })
        });
        $("#edit-calendar-dialog-tabs-2").delegate(".delete-shared-calendar", "click", function () {
            window.confirm(SPC.translate("Are you sure?")) && $.ajax({
                data: {
                    spcAppRequest: "calendar/calendar/deleteSharedCalendar",
                    params: [$(this).parents("tr").attr("class")]
                },
                success: function () {
                    SPC.getSharedCalendarUsers($("#edit-calendar-dialog").data("calendarId"))
                }
            })
        });
        $("#calendars-settings-dialog").dialog({
            title: SPC.translate("settings"),
            autoOpen: !1,
            modal: !1,
            resizable: !1,
            width: 600,
            height: 400
        });
        $(".calendars-settings").bind("click", function (b) {
            b.stopPropagation();
            b = this.className;
            /self/.test(b) ? $(".calendars-settings-dialog-tabs-1").trigger("click") : /other/.test(b) ? $(".calendars-settings-dialog-tabs-2").trigger("click") : /group/.test(b) && $(".calendars-settings-dialog-tabs-3").trigger("click");
            $("#calendars-settings-dialog").dialog("open")
        });
        SPC.calendarSettignsDialogTabs = $("#calendars-settings-dialog-tabs").tabs();
        $(".calendars-settings-dialog-tabs-1").bind("click", function () {
            for(var b = "", c = SPC.myCalendars, d, e, g, h, k, i, m = 0; m < c.length; m++) {
                d = c[m].id;
                e = c[m].name;
                h = c[m].show_in_list;
                k = c[m]["public"];
                i = c[m].access_key;
                g = '<input class="calendar-settings-show-checkbox self" type="checkbox" />';
                h == 1 && (g = '<input class="calendar-settings-show-checkbox self" type="checkbox" checked="checked" />');
                h = '<input class="calendar-settings-public-checkbox self" type="checkbox" />';
                k == 1 && (h = '<input class="calendar-settings-public-checkbox self" type="checkbox" checked="checked" />');
                k = "<a href='export.php?m=calendar&a=exportCalendar&calId=" + d + "&accessKey=" + i + "'>ical</a>";
                i = "<a target='_blank' href='rss.php?u=" + SPC.USERNAME + "&cal=" + e + "&calId=" + d + "'>rss</a>";
                b = b + ('<tr class="' + d + '">\t\t\t\t\t\t<td>' + e + "</td>\t\t\t\t\t\t<td>" + g + "</td>\t\t\t\t\t\t<td>" + h + "</td>                        <td>" + k + "</td>                        <td>" + i + "</td>\t\t\t\t\t</tr>")
            }
            $("#my-calendars-settings-table tbody").html(b)
        });
        $(".calendars-settings-dialog-tabs-2").bind("click", function () {
            for(var b = "", c = SPC.otherCalendars, d, e, g, h = 0; h < c.length; h++) {
                d = c[h].cal_id;
                e = c[h].name;
                showInList = c[h].show_in_list;
                g = '<input class="calendar-settings-show-checkbox other" type="checkbox" />';
                showInList == 1 && (g = '<input class="calendar-settings-show-checkbox other" type="checkbox" checked="checked" />');
                b = b + ('<tr class="' + d + '">\t\t\t\t\t\t<td>' + e + "</td>\t\t\t\t\t\t<td>" + g + "</td>\t\t\t\t\t</tr>")
            }
            $("#other-calendars-settings-table tbody").html(b)
        });
        $(".calendars-settings-dialog-tabs-3").bind("click", function () {
            for(var b = "", c = SPC.groupCalendars, d = SPC.USER_ROLE == "admin" ? "self" : "group", e = d == "self" ? "" : "disabled='disabled'", g, h, k, i, m = 0; m < c.length; m++) {
                g = c[m].id;
                h = c[m].name;
                showInList = c[m].show_in_list;
                i = c[m]["public"];
                k = '<input class="calendar-settings-show-checkbox ' + d + '" type="checkbox" />';
                showInList == 1 && (k = '<input class="calendar-settings-show-checkbox ' + d + '" type="checkbox" checked="checked" />');
                calendarPublicCheckBox = '<input class="calendar-settings-public-checkbox ' + d + '" type="checkbox" ' + e + " />";
                i == 1 && (calendarPublicCheckBox = '<input class="calendar-settings-public-checkbox ' + d + '" type="checkbox" checked="checked" ' + e + " />");
                b = b + ('<tr class="' + g + '">\t\t\t\t\t\t<td>' + h + "</td>\t\t\t\t\t\t<td>" + k + "</td>\t\t\t\t\t\t<td>" + calendarPublicCheckBox + "</td>\t\t\t\t\t</tr>")
            }
            $("#group-calendars-settings-table tbody").html(b)
        });
        $("#calendars-settings-dialog").delegate(".calendar-settings-show-checkbox", "click", function () {
            var b = $(this).parents("tr").attr("class"),
                c = /self/.test($(this).attr("class")) ? "self" : "other";
            SPC.changeCalendarListStatus(b, c, this.checked == true ? 1 : 0)
        }).delegate(".calendar-settings-public-checkbox", "click", function () {
            if(!$(this).attr("disabled")) {
                var b = $(this).parents("tr").attr("class");
                $.ajax({
                    data: {
                        spcAppRequest: "calendar/calendar/changeCalendarPublicStatus",
                        params: {
                            isArray: true,
                            calendarId: b,
                            status: this.checked ? 1 : 0
                        }
                    },
                    success: function () {
                        SPC.getCalendars()
                    }
                })
            }
        });
        SPC.changeCalendarListStatus = function (b, c, d) {
            $.ajax({
                data: {
                    spcAppRequest: "calendar/calendar/changeCalendarListStatus",
                    params: {
                        isArray: true,
                        calendarId: b,
                        owner: c,
                        status: d
                    }
                },
                success: function () {
                    SPC.getCalendars();
                    SPC.Calendar.refresh()
                }
            })
        };
        SPC.calendarImportExportTabs = $("#calendar-import-export-dialog-tabs").tabs();
        $("#calendar-import-export-dialog").dialog({
            title: SPC.translate("Import / Export Calendars"),
            modal: !1,
            autoOpen: !1,
            width: 400,
            height: 220,
            resizable: !1
        });
        $("#calendar-import-export").bind("click", function (b) {
            b.stopPropagation();
            $("#calendar-import-export-dialog").dialog("open")
        });
        $("#upload-target").bind("load",

        function () {
            var b = $(this).contents().find("body").text();
            if(b != "") {
                b = $.parseJSON(b);
                if(b.success == false) SPC.flashMsg("Upload failed: " + b.errorMsg, "error");
                else {
                    SPC.flashMsg();
                    SPC.flashMsg("Import Success");
                    SPC.Calendar.refresh();
                    $("#calendar-import-export-dialog").dialog("close")
                }
            }
        });
        $("#calendars-settings-dialog-tabs-3-calendar").bind("change", function () {
            $("#calendars-settings-dialog-tabs-3-cal-id").val($("option:selected", this).val())
        }).trigger("change");
        $("#calendars-settings-dialog-tabs-3-import-calendar").bind("click",

        function () {
            if(SPC.demo) alert("This operation cannot be done in the demo version.");
            else {
                SPC.flashMsg(SPC.translate("Importing..."));
                $("#upload-form").submit()
            }
        }).button();
        $("#calendar-import-export-dialog-export-calendar").bind("change", function () {
            var b = $("option:selected", this),
                c = b.val(),
                b = b.attr("data-access-key");
            $("#calendar-import-export-dialog-export-tab-export-link").attr("href", "export.php?m=calendar&a=exportCalendar&calId=" + c + "&accessKey=" + b)
        }).trigger("change");
        "1" == SPC.userPrefs.calendar.wysiwyg && (p = SPC.CalendarRTEConfig || {
            toolbar: [{
                name: "basicstyles",
                items: "Bold Italic Underline Strike - RemoveFormat".split(" ")
            }, {
                name: "paragraph",
                items: "NumberedList BulletedList - Outdent Indent - Blockquote - JustifyLeft JustifyCenter JustifyRight JustifyBlock".split(" ")
            }],
            height: 100,
            width: 526
        }, $("#add-event-dialog-description,           #edit-event-dialog-description").ckeditor(p));
        SPC.Calendar.getActiveEventDialog = function () {
            return SPC.Calendar.Dialogs.addEventDialog.dialog("isOpen") ? "add" : "edit"
        };
        $("#add-event-dialog-all-day").button();
        $("#add-event-dialog-availability").buttonset();
        $("#add-event-dialog-privacy").buttonset();
        $("#edit-event-dialog-all-day").button();
        $("#edit-event-dialog-availability").buttonset();
        $("#edit-event-dialog-privacy").buttonset();
        $("#add-event-dialog-availability-available").next("label").addClass("ui-corner-left");
        $("#add-event-dialog-availability-busy").next("label").addClass("ui-corner-right");
        $("#add-event-dialog-privacy-private").next("label").addClass("ui-corner-left");
        $("#add-event-dialog-privacy-public").next("label").addClass("ui-corner-right");
        $("#edit-event-dialog-availability-available").next("label").addClass("ui-corner-left");
        $("#edit-event-dialog-availability-busy").next("label").addClass("ui-corner-right");
        $("#edit-event-dialog-privacy-private").next("label").addClass("ui-corner-left");
        $("#edit-event-dialog-privacy-public").next("label").addClass("ui-corner-right");
        SPC.Date.dateConverter.getEventType = function (b, c) {
            return b == c ? "standard" : "multi_day"
        };
        $("#add-event-dialog-event-details").bind("click", function () {
            if($(this).attr("class") == "ui-icon ui-icon-carat-1-s") {
                $(this).attr("class", "ui-icon ui-icon-carat-1-n");
                $("#add-event-dialog-details-table tbody").slideDown("fast")
            } else {
                $(this).attr("class", "ui-icon ui-icon-carat-1-s");
                $("#add-event-dialog-details-table tbody").slideUp("fast")
            }
        });
        $("#edit-event-dialog-event-details").bind("click", function () {
            if($(this).attr("class") == "ui-icon ui-icon-carat-1-s") {
                $(this).attr("class", "ui-icon ui-icon-carat-1-n");
                $("#edit-event-dialog-details-table tbody").slideDown("fast")
            } else {
                $(this).attr("class", "ui-icon ui-icon-carat-1-s");
                $("#edit-event-dialog-details-table tbody").slideUp("fast")
            }
        });
        $("#add-event-dialog-repeat,         #edit-event-dialog-repeat").button({
            icons: {
                primary: "ui-icon-arrowreturnthick-1-e"
            }
        });
        SPC.Calendar.Dialogs.addEventDialog.addEventDialogButtons = {};
        SPC.Calendar.Dialogs.addEventDialog.addEventDialogButtons[SPC.translate("Create Event")] = function () {
            if(SPC.API.call("createEvent", [SPC.API.getEventDialogState()]) !== false) {
                var b = document.getElementById("add-event-dialog-all-day").checked,
                    c = SPC.Date.dateConverter.userToCore($("#add-event-dialog-start-date").val()),
                    d = b ? "00:00" : SPC.Date.convertTimeFormat($("#add-event-dialog-start-time").val(), "core"),
                    e = SPC.Date.dateConverter.userToCore($("#add-event-dialog-end-date").val()),
                    b = b ? "00:00" : SPC.Date.convertTimeFormat($("#add-event-dialog-end-time").val(), "core"),
                    g = SPC.Date.dateConverter.getEventType(c, e),
                    h = $("#add-event-dialog-title").val(),
                    k = $("#add-event-dialog-location").val(),
                    i = $("#add-event-dialog-description").val(),
                    m = Number($("#add-event-dialog-availability-available")[0].checked),
                    s = $("#add-event-dialog-image").data("name") || "",
                    o = Number($("#add-event-dialog-privacy-public")[0].checked);
                if(/^[\d]{4}-[\d]{2}-[\d]{2}$/.test(c)) if(/^[\d]{4}-[\d]{2}-[\d]{2}$/.test(e)) if(/^[\d]{2}:[\d]{2}$/.test(d)) if(/^[\d]{2}:[\d]{2}$/.test(b)) if(c > e) SPC.flashMsg(SPC.translate("End time can not be less than start time"), "error");
                else if(c == e && d > b && b != "00:00") SPC.flashMsg(SPC.translate("End time can not be less than start time"), "error");
                else {
                    var n = {
                        spcAppRequest: "calendar/event/insertEvent",
                        params: {
                            isArray: true,
                            event: {
                                cal_id: SPC.currentCalendarId,
                                type: g,
                                start_date: c,
                                start_time: d,
                                end_date: e,
                                end_time: b,
                                title: h,
                                location: k,
                                description: i,
                                available: m,
                                image: s,
                                "public": o
                            },
                            reminders: {},
                            userFields: {}
                        }
                    };
                    $.extend(n.params.event, SPC.Calendar.Event.getRepeatOptions());
                    var p, r, t, v = n.params.event.repeat_type == "none" ? "0" : "1";
                    $("#add-event-dialog-reminders .reminder").each(function (b) {
                        p = $(this);
                        g = p.find(".type").val();
                        r = p.find(".time").val();
                        t = p.find(".time-type").val();
                        n.params.reminders[b] = {
                            type: g,
                            time: r,
                            time_unit: t,
                            is_repeating_event: v
                        }
                    });
                    c = SPC.Calendar.Dialogs.addGuestsDialog.getGuests();
                    if(SPC.Object.length(c) != 0) {
                        n.params.event.invitation = 1;
                        n.params.event.invitation_creator_id = SPC.USERID;
                        n.params.guests = c
                    }
                    $.extend(n.userFields, SPC.API.call("createEventBeforeRequest", [SPC.API.getEventDialogState("add")]));
                    $.ajax({
                        data: n,
                        success: function (b) {
                            SPC.LAST_ACTION = "calendar:event:create";
                            SPC.refresh();
                            $("#add-event-dialog").dialog("close");
                            SPC.flashMsg(SPC.translate("Event Created"));
                            SPC.API.call("createEventAfterRequest", [SPC.API.getEventDialogState("add"),
                            b])
                        }
                    })
                } else SPC.flashMsg(SPC.translate("Incorrect end time"), "error");
                else SPC.flashMsg(SPC.translate("Incorrect start time"), "error");
                else SPC.flashMsg(SPC.translate("Incorrect end date"), "error");
                else SPC.flashMsg(SPC.translate("Incorrect start date"), "error")
            }
        };
        SPC.Calendar.Dialogs.addEventDialog.dialog({
            title: SPC.translate("Create Event"),
            autoOpen: !1,
            modal: !0,
            width: "auto",
            height: "auto",
            resizable: !1,
            draggable: !0,
            buttons: SPC.Calendar.Dialogs.addEventDialog.addEventDialogButtons,
            open: function () {
                var b = $("#add-event-dialog-calendar option:selected").attr("value");
                $("#add-event-dialog-calendar").val(SPC.currentCalendarId);
                $("#add-event-dialog-title").val("");
                $("#add-event-dialog-title").focus();
                $("#add-event-dialog-description").val("");
                $("#add-event-dialog-location").val("");
                $("#add-event-dialog-all-day").attr("checked", false).trigger("change");
                $("#add-event-dialog-availability-busy").attr("checked", true);
                $("#add-event-dialog-availability-public").attr("checked", false);
                $("#add-event-dialog-privacy-private")[0].checked = true;
                if(SPC.USER_CALENDARS[b]["public"] == 1) $("#add-event-dialog-privacy-public")[0].checked = true;
                $("#add-event-dialog-availability-busy").trigger("change");
                $("#add-event-dialog-privacy-public").trigger("change");
                $("#add-event-dialog-reminders .spc-reminder-list").html(SPC.getDefaultReminderBoxes(SPC.defaultReminders[b]));
                $("#add-event-dialog-repeat .ui-button-text").text(SPC.translate("repeat"));
                SPC.Calendar.Dialogs.repeatEventDialog.state = {};
                SPC.API.call("createEventDialogOpen", [SPC.API.getEventDialogState()])
            },
            beforeClose: function () {
                return SPC.API.call("createEventDialogBeforeClose", [SPC.API.getEventDialogState()])
            },
            close: function () {
                SPC.API.call("createEventDialogClose");
                for(var b in SPC.selectedSlots) SPC.selectedSlots[b].style.backgroundColor = SPC.Calendar.timeSlotselector.slotColor;
                SPC.SE = {};
                SPC.selectedSlots = {};
                SPC.monthCalDayRangeSelector.selectorStartIndex = void 0;
                SPC.monthCalDayRangeSelector.selectorEndIndex = void 0;
                SPC.$timeslotSelectorBar && SPC.$timeslotSelectorBar.hide();
                $(".spc-month-all-day-box-table").css({
                    "z-index": -1
                });
                $(".spc-month-all-day-box").css({
                    "background-color": "transparent",
                    opacity: 1
                });
                SPC.removeEventImage("add");
                SPC.Calendar.Dialogs.repeatEventDialog.state = {};
                SPC.Calendar.Dialogs.addGuestsDialog.clearGuests()
            }
        });
        $("#add-event-dialog-calendar").bind("change", function () {
            SPC.currentCalendarId = $("#add-event-dialog-calendar option:selected").val();
            SPC.currentCalendarColor = $("#add-event-dialog-calendar option:selected").attr("class");
            for(var b in SPC.selectedSlots) SPC.selectedSlots[b].style.backgroundColor = SPC.currentCalendarColor;
            for(b = SPC.monthCalDayRangeSelector.selectorStartIndex; b <= SPC.monthCalDayRangeSelector.selectorEndIndex; b++) $(".spc-month-all-day-box", SPC.Calendar.Dom.SpcMainApp).eq(b).css({
                "background-color": SPC.currentCalendarColor,
                opacity: 0.5
            });
            $("#add-event-dialog-privacy-private")[0].checked = true;
            if(SPC.USER_CALENDARS[SPC.currentCalendarId]["public"] == 1) $("#add-event-dialog-privacy-public")[0].checked = true;
            $("#add-event-dialog-privacy-public").trigger("change");
            $("#add-event-dialog-reminders .spc-reminder-list").html(SPC.getDefaultReminderBoxes(SPC.defaultReminders[SPC.currentCalendarId]))
        });
        $("#add-event-dialog-all-day").bind("change", function () {
            this.checked ? $("#add-event-dialog-start-time, #add-event-dialog-end-time").hide() : $("#add-event-dialog-start-time, #add-event-dialog-end-time").show()
        }).bind("click", function () {
            $(this).trigger("change")
        });
        $("#add-event-dialog-start-date").bind("change", function () {
            $("#add-event-dialog-end-date").val($(this).val())
        });
        "1" == SPC.userPrefs.calendar.wysiwyg && $("#add-event-dialog, #edit-event-dialog").delegate(".image-copy-to-rte", "click", function () {
            var b = SPC.Calendar.getActiveEventDialog(),
                c = SPC.getImagePath($(this).siblings("img").data("name")),
                b = $("#" + b + "-event-dialog-description");
            b.val(b.val() + "<img src='" + c + "' />")
        });
        $("#edit-event-dialog-start-date").bind("change", function () {
            $("#edit-event-dialog-end-date").val($(this).val())
        });
        SPC.currentEvent = {};
        SPC.editEventDialogButtons = {};
        SPC.editEventDialogButtons[SPC.translate("save")] = function () {
            if(SPC.API.call("editEvent", [SPC.API.getEventDialogState()]) !== false) {
                if(SPC.currentEvent.invitation == 1 && SPC.currentEvent.invitationEventId != 0) {
                    if(!window.confirm(SPC.translate("Only guests and reminders will be updated!"))) return
                } else if(!/change/.test(SPC.event.className)) {
                    SPC.flashMsg("You can't change this calendar!", "error");
                    return
                }
                SPC.currentEvent.calendarId = $("#edit-event-dialog-calendar option:selected").val();
                SPC.currentEvent.startDate = SPC.Date.dateConverter.userToCore($("#edit-event-dialog-start-date").val());
                SPC.currentEvent.endDate = SPC.Date.dateConverter.userToCore($("#edit-event-dialog-end-date").val());
                SPC.currentEvent.type = SPC.Date.dateConverter.getEventType(SPC.currentEvent.startDate, SPC.currentEvent.endDate);
                SPC.currentEvent.allDay = document.getElementById("edit-event-dialog-all-day").checked;
                SPC.currentEvent.startTime = SPC.currentEvent.allDay ? "00:00" : SPC.Date.convertTimeFormat($("#edit-event-dialog-start-time").val(), "core");
                SPC.currentEvent.endTime = SPC.currentEvent.allDay ? "00:00" : SPC.Date.convertTimeFormat($("#edit-event-dialog-end-time").val(), "core");
                SPC.currentEvent.eventTitle = $("#edit-event-dialog-title").val();
                SPC.currentEvent.location = $("#edit-event-dialog-location").val();
                SPC.currentEvent.eventDescription = $("#edit-event-dialog-description").val();
                SPC.currentEvent.available = Number($("#edit-event-dialog-availability-available")[0].checked);
                SPC.currentEvent._public = Number($("#edit-event-dialog-privacy-public")[0].checked);
                SPC.currentEvent.image = $("#edit-event-dialog-image").data("name") || "";
                if(/^[\d]{4}-[\d]{2}-[\d]{2}$/.test(SPC.currentEvent.startDate)) if(/^[\d]{4}-[\d]{2}-[\d]{2}$/.test(SPC.currentEvent.endDate)) if(/^[\d]{2}:[\d]{2}$/.test(SPC.currentEvent.startTime)) if(/^[\d]{2}:[\d]{2}$/.test(SPC.currentEvent.endTime)) if(SPC.currentEvent.startDate > SPC.currentEvent.endDate) SPC.flashMsg(SPC.translate("End time can not be less than start time"), "error");
                else if(SPC.currentEvent.startDate == SPC.currentEvent.endDate && SPC.currentEvent.startTime > SPC.currentEvent.endTime && SPC.currentEvent.endTime != "00:00") SPC.flashMsg(SPC.translate("End time can not be less than start time"), "error");
                else {
                    var b = {
                        spcAppRequest: "calendar/event/updateEvent",
                        params: {
                            isArray: true,
                            event: {
                                id: SPC.currentEvent.eventId,
                                cal_id: SPC.currentEvent.calendarId,
                                type: SPC.currentEvent.type,
                                start_date: SPC.currentEvent.startDate,
                                start_time: SPC.currentEvent.startTime,
                                end_date: SPC.currentEvent.endDate,
                                end_time: SPC.currentEvent.endTime,
                                title: SPC.currentEvent.eventTitle,
                                location: SPC.currentEvent.location,
                                description: SPC.currentEvent.eventDescription,
                                available: SPC.currentEvent.available,
                                "public": SPC.currentEvent._public,
                                invitation: SPC.currentEvent.invitation,
                                invitation_creator_id: SPC.currentEvent.invitationCreatorId,
                                image: SPC.currentEvent.image
                            },
                            userFields: {},
                            reminders: {}
                        }
                    };
                    $.extend(b.params.event,
                    SPC.Calendar.Event.getRepeatOptions());
                    if(SPC.currentEvent.invitation == "1") {
                        var c = $("#edit-event-dialog-edit-guests-radio :radio:checked").val() || "pending";
                        b.params.event.invitation_response = c;
                        b.params.invitationEventId = SPC.currentEvent.invitationEventId;
                        b.params.guestAdder = "user";
                        if(SPC.currentEvent.invitationEventId == 0) {
                            b.params.invitationEventId = SPC.currentEvent.eventId;
                            b.params.guestAdder = "owner"
                        }
                    }
                    if(SPC.Calendar.Dialogs.editEventDialog.updateGuests) {
                        var c = SPC.Calendar.Dialogs.addGuestsDialog.getGuests(),
                            d = SPC.Object.length(c);
                        if(SPC.currentEvent.invitation == 0 && d != 0) {
                            b.params.createNewInvitation = true;
                            b.params.event.invitation = 1;
                            b.params.event.invitation_creator_id = SPC.USERID
                        }
                        if(d != 0) {
                            if(SPC.currentEvent.invitation == "1") {
                                b.params.updateGuests = true;
                                if(c[SPC.USERID]) c[SPC.USERID].response = b.params.event.invitation_response
                            }
                            b.params.guests = c
                        }
                    }
                    var e, g, h, k, i = b.params.event.repeat_type == "none" ? "0" : "1";
                    $("#edit-event-dialog-reminders .reminder").each(function (c) {
                        e = $(this);
                        g = e.find(".type option:selected").val();
                        h = e.find(".time").val();
                        k = e.find(".time-type option:selected").val();
                        b.params.reminders[c] = {
                            type: g,
                            time: h,
                            time_unit: k,
                            is_repeating_event: i
                        }
                    });
                    $.extend(b.userFields, SPC.API.call("editEventBeforeRequest", [SPC.API.getEventDialogState("edit")]));
                    $.ajax({
                        data: b,
                        success: function (b) {
                            SPC.Calendar.refresh(function () {
                                $("#spc-year-cal-event-list-dialog").dialog("isOpen") && SPC.Calendar.drawYearCalendarEventList($("#spc-year-cal-event-list-dialog").data("date"))
                            });
                            $("#edit-event-dialog").dialog("close");
                            SPC.flashMsg(SPC.translate("Event Saved"));
                            SPC.LAST_ACTION = "calendar:event:update";
                            SPC.API.call("editEventAfterRequest", [SPC.API.getEventDialogState("edit"), b])
                        }
                    })
                } else SPC.flashMsg("Incorrect end time", "error");
                else SPC.flashMsg("Incorrect start time", "error");
                else SPC.flashMsg("Incorrect end date", "error");
                else SPC.flashMsg("Incorrect start date", "error")
            }
        };
        $("#edit-event-dialog-calendar").bind("change", function () {
            var b = $("#edit-event-dialog-calendar option:selected").val();
            $("#edit-event-dialog-privacy-private")[0].checked = true;
            if(SPC.USER_CALENDARS[b]["public"] == 1) $("#edit-event-dialog-privacy-public")[0].checked = true;
            $("#edit-event-dialog-privacy-public").trigger("change")
        });
        SPC.editEventDialogButtons[SPC.translate("Delete")] = function () {
            if(SPC.API.call("deleteEvent", [SPC.API.getEventDialogState()]) !== false) if(!/change/.test($(SPC.event).attr("class")) && SPC.currentEvent.invitationEventId == "0") SPC.flashMsg("You can't change this calendar!", "error");
            else if(window.confirm(SPC.translate("Are you sure?"))) {
                SPC.API.call("deleteEventBeforeRequest", [SPC.API.getEventDialogState("edit")]);
                $.ajax({
                    data: {
                        spcAppRequest: "calendar/event/deleteEvent",
                        params: [SPC.currentEvent.eventId, SPC.currentEvent.invitation, SPC.currentEvent.invitationEventId]
                    },
                    success: function (b) {
                        SPC.flashMsg(SPC.translate("Event Deleted"));
                        $(SPC.event).remove();
                        $("#edit-event-dialog").dialog("close");
                        SPC.Calendar.refresh();
                        SPC.API.call("deleteEventAfterRequest", [SPC.API.getEventDialogState(), b])
                    }
                })
            }
        };
        SPC.Calendar.Dialogs.editEventDialog.dialog({
            title: SPC.translate("Edit Event"),
            autoOpen: !1,
            modal: !0,
            width: "auto",
            height: "auto",
            resizable: !1,
            buttons: SPC.editEventDialogButtons,
            open: function () {
                SPC.API.call("editEventDialogOpen", [SPC.API.getEventDialogState()]);
                $("#edit-event-dialog-title").focus()
            },
            beforeClose: function () {
                return SPC.API.call("editEventDialogBeforeClose", [SPC.API.getEventDialogState()])
            },
            close: function () {
                SPC.API.call("editEventDialogClose");
                SPC.removeEventImage("edit");
                SPC.Calendar.Dialogs.repeatEventDialog.state = {};
                SPC.Calendar.Dialogs.addGuestsDialog.clearGuests();
                SPC.Calendar.Dialogs.editEventDialog.updateGuests = false
            }
        });
        $("#edit-event-dialog-all-day").bind("change", function () {
            this.checked ? $("#edit-event-dialog-start-time, #edit-event-dialog-end-time").hide() : $("#edit-event-dialog-start-time, #edit-event-dialog-end-time").show()
        }).bind("click", function () {
            $(this).trigger("change")
        });
        p = {};
        p[SPC.translate("done")] = function () {
            SPC.Calendar.Dialogs.repeatEventDialog.saveState();
            var b = SPC.Calendar.Dialogs.repeatEventDialog.state.repeatType,
                c = SPC.Calendar.getActiveEventDialog();
            b == "none" ? $("#" + c + "-event-dialog-repeat .ui-button-text").text(SPC.translate("repeat")) : $("#" + c + "-event-dialog-repeat .ui-button-text").text(SPC.translate(b));
            c == "edit" && $("#edit-event-dialog-start-date").val($("#repeat-event-dialog-starts-on").val()).change();
            SPC.Calendar.Dialogs.repeatEventDialog.dialog("close")
        };
        p[SPC.translate("cancel")] = function () {
            SPC.Calendar.Dialogs.repeatEventDialog.dialog("close")
        };
        SPC.Calendar.Dialogs.repeatEventDialog = $("#repeat-event-dialog").dialog({
            title: SPC.translate("repeat"),
            width: 420,
            buttons: p
        });
        SPC.Calendar.Event.getRepeatOptions = function () {
            var b = {}, b = SPC.Calendar.Dialogs.repeatEventDialog.state.repeatType || "none",
                c;
            if(b == "none") b = {
                repeat_type: "none",
                repeat_interval: 0,
                repeat_count: 0,
                repeat_data: ""
            };
            else {
                var d, e;
                switch(SPC.Calendar.Dialogs.repeatEventDialog.state.$endRadio[0].id) {
                    case "repeat-event-dialog-never-radio":
                        e = 0;
                        d = "9999-01-01";
                        break;
                    case "repeat-event-dialog-after-radio":
                        e = $("#repeat-event-dialog-count").val();
                        d = "9999-01-01";
                        break;
                    case "repeat-event-dialog-end-date-radio":
                        e = 0;
                        d = SPC.Date.dateConverter.userToCore(SPC.Calendar.Dialogs.repeatEventDialog.state.endDate)
                }
                if(b == "weekly") {
                    c = [];
                    SPC.Calendar.Dialogs.repeatEventDialog.state.$weeklyRepeatDaysCheckboxes.each(function () {
                        c.push($(this).val())
                    });
                    if(c.length != 0) c = c.join(",");
                    else {
                        var g = SPC.Date.dateConverter.userToCore($("#repeat-event-dialog-starts-on").val());
                        c = SPC.Date.strToObj(g).getDay()
                    }
                }
                if(b == "monthly") {
                    c = "";
                    document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-week-radio").checked && (c = document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-week-weekindex").value + "," + document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-week-dayindex").value)
                }
                b = {
                    repeat_type: SPC.Calendar.Dialogs.repeatEventDialog.state.repeatType,
                    repeat_interval: SPC.Calendar.Dialogs.repeatEventDialog.state.interval,
                    repeat_count: e,
                    repeat_end_date: d,
                    repeat_data: c
                }
            }
            return b
        };
        SPC.Calendar.Dialogs.repeatEventDialog.init = function () {
            SPC.Calendar.Dialogs.repeatEventDialog.dialog("open");
            var b = $("#repeat-event-dialog-repeat-type"),
                c = $("#repeat-event-dialog-interval"),
                d = $("#repeat-event-dialog-starts-on"),
                e = $("#repeat-event-dialog-count"),
                g = $("#repeat-event-dialog-end-date"),
                h = SPC.Calendar.Dialogs.repeatEventDialog.state.repeatType || "none";
            $("#repeat-event-dialog-weekly-repeat-days input:checkbox").attr("checked", false).trigger("change");
            if(h == "none") {
                b.val("none");
                b.change();
                c.val("1");
                e.val("");
                g.val("");
                $("#repeat-event-dialog-never-radio")[0].checked = true
            } else {
                b.val(h);
                b.change();
                c.val(SPC.Calendar.Dialogs.repeatEventDialog.state.interval);
                h == "weekly" && SPC.Calendar.Dialogs.repeatEventDialog.state.$weeklyRepeatDaysCheckboxes.attr("checked",
                true).trigger("change");
                if(h == "monthly") {
                    SPC.Calendar.Dialogs.repeatEventDialog.state.$monthlyRepeatSpecialOptionRadio.attr("checked", true);
                    document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-month").value = SPC.Calendar.Dialogs.repeatEventDialog.state.monthlyRepeatDayNumber;
                    document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-week-weekindex").value = SPC.Calendar.Dialogs.repeatEventDialog.state.monthlyRepeatWeekIndex;
                    document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-week-dayindex").value = SPC.Calendar.Dialogs.repeatEventDialog.state.monthlyRepeatDayIndex
                }
                SPC.Calendar.Dialogs.repeatEventDialog.state.$endRadio.click();
                e.val(SPC.Calendar.Dialogs.repeatEventDialog.state.occurences);
                g.val(SPC.Calendar.Dialogs.repeatEventDialog.state.endDate)
            }
            d.attr("disabled", true);
            if(SPC.Calendar.getActiveEventDialog() == "add") d.val($("#add-event-dialog-start-date").val());
            else {
                d.attr("disabled", false);
                b = $("#edit-event-dialog-start-date").val();
                SPC.currentEvent.repeatType != "none" && (b = SPC.Date.dateConverter.coreToUser(SPC.Calendar.Event.Repeat.Events[SPC.currentEvent.eventId].start_date));
                d.val(b)
            }
        };
        SPC.Calendar.Dialogs.repeatEventDialog.state = {};
        SPC.Calendar.Dialogs.repeatEventDialog.saveState = function () {
            var b = $("#repeat-event-dialog-repeat-type"),
                c = b.val(),
                d = $("#repeat-event-dialog-interval");
            $("#repeat-event-dialog-starts-on");
            var e = $("#repeat-event-dialog-count"),
                g = $("#repeat-event-dialog-end-date");
            SPC.Calendar.Dialogs.repeatEventDialog.state.repeatType = b.val();
            SPC.Calendar.Dialogs.repeatEventDialog.state.interval = d.val();
            if(c == "weekly") SPC.Calendar.Dialogs.repeatEventDialog.state.$weeklyRepeatDaysCheckboxes = $("#repeat-event-dialog-weekly-repeat-days input:checkbox:checked");
            if(c == "monthly") {
                SPC.Calendar.Dialogs.repeatEventDialog.state.$monthlyRepeatSpecialOptionRadio = $("input[name='repeat-event-dialog-monthly-repeat-options']:checked");
                SPC.Calendar.Dialogs.repeatEventDialog.state.monthlyRepeatDayNumber = document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-month").value;
                SPC.Calendar.Dialogs.repeatEventDialog.state.monthlyRepeatWeekIndex = document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-week-weekindex").value;
                SPC.Calendar.Dialogs.repeatEventDialog.state.monthlyRepeatDayIndex = document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-week-dayindex").value
            }
            SPC.Calendar.Dialogs.repeatEventDialog.state.$endRadio = $("#repeat-event-dialog-end-date-row input:radio:checked");
            SPC.Calendar.Dialogs.repeatEventDialog.state.occurences = e.val();
            SPC.Calendar.Dialogs.repeatEventDialog.state.endDate = g.val()
        };
        SPC.Calendar.Dialogs.repeatEventDialog.delegate("#repeat-event-dialog-repeat-type", "change", function () {
            var b = $("#repeat-event-dialog-interval-time-unit");
            $("#repeat-event-dialog-table tr:not(:first)").show();
            $("#repeat-event-dialog-weekly-repeat-days-row").hide();
            $("#repeat-event-dialog-monthly-repeat-options-row").hide();
            switch($(this).val()) {
                case "none":
                    $("#repeat-event-dialog-starts-on,                       #repeat-event-dialog-count                       #repeat-event-dialog-end-date").attr("disabled", true);
                    $("#repeat-event-dialog-table tr:not(:first)").hide();
                    break;
                case "daily":
                    b.text(SPC.translate("days"));
                    break;
                case "weekly":
                    b.text(SPC.translate("weeks"));
                    $("#repeat-event-dialog-weekly-repeat-days-row").show();
                    break;
                case "monthly":
                    b.text(SPC.translate("months"));
                    var c = document.getElementById("add-event-dialog-start-date").value;
                    if(SPC.Calendar.getActiveEventDialog() == "edit") c = document.getElementById("edit-event-dialog-start-date").value;
                    c = SPC.Date.dateConverter.userToCore(c);
                    b = SPC.Date.parseDate(c);
                    document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-month").value = b.day;
                    var d = SPC.Date.getCalendarViewDates("month", c),
                        e;
                    SPC.Array.foreach(d, function (b, d) {
                        if(d == c) {
                            e = Math.ceil(b / 7);
                            return false
                        }
                    });
                    d = SPC.Date.strToObj(c).getDay();
                    (new Date(b.year, b.month - 1, 1)).getDay() > d && e--;
                    document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-week-weekindex").value = Math.ceil(b.day / 7);
                    document.getElementById("repeat-event-dialog-monthly-repeat-options-day-of-the-week-dayindex").value = d;
                    $("#repeat-event-dialog-monthly-repeat-options-row").show();
                    break;
                case "yearly":
                    b.text(SPC.translate("years"))
            }
        }).delegate("input[type='radio']", "click", function () {
            var b = this.id;
            $("#repeat-event-dialog-count").attr("disabled", true);
            $("#repeat-event-dialog-count").val("");
            $("#repeat-event-dialog-end-date").attr("disabled", true);
            $("#repeat-event-dialog-end-date").val("");
            switch(b) {
                case "repeat-event-dialog-after-radio":
                    $("#repeat-event-dialog-count").attr("disabled", false).val(3);
                    break;
                case "repeat-event-dialog-end-date-radio":
                    b = SPC.Date.dateConverter.userToCore($("#repeat-event-dialog-starts-on").val());
                    b = SPC.Date.addDate(b, 30);
                    $("#repeat-event-dialog-end-date").attr("disabled",
                    false).val(SPC.Date.dateConverter.coreToUser(b))
            }
        });
        SPC.Calendar.Dialogs.addEventDialog.delegate("#add-event-dialog-repeat", "click", function () {
            SPC.Calendar.Dialogs.repeatEventDialog.init()
        });
        SPC.Calendar.Dialogs.editEventDialog.delegate("#edit-event-dialog-repeat", "click", function () {
            SPC.Calendar.Dialogs.repeatEventDialog.init()
        });
        SPC.Calendar.Dialogs.addGuestsDialog = $("#add-guests-dialog");
        SPC.Calendar.Dialogs.addGuestsDialog.guestListHTML = "";
        SPC.Calendar.Dialogs.addGuestsDialog.clearGuests = function () {
            SPC.Calendar.Dialogs.addGuestsDialog.guestListHTML = "";
            $("#add-guests-dialog-table tbody").html("")
        };
        SPC.Calendar.Dialogs.addGuestsDialog.saveGuests = function () {
            SPC.Calendar.Dialogs.addGuestsDialog.guestListHTML = $("#add-guests-dialog-table tbody").html()
        };
        SPC.Calendar.Dialogs.addGuestsDialog.buttons = {};
        SPC.Calendar.Dialogs.addGuestsDialog.buttons[SPC.translate("done")] = function () {
            SPC.Calendar.Dialogs.addGuestsDialog.saveGuests();
            SPC.Calendar.Dialogs.addGuestsDialog.dialog("close")
        };
        SPC.Calendar.Dialogs.addGuestsDialog.buttons[SPC.translate("cancel")] = function () {
            SPC.Calendar.Dialogs.addGuestsDialog.dialog("close")
        };
        SPC.Calendar.Dialogs.addGuestsDialog.dialog({
            title: SPC.translate("guests"),
            modal: !0,
            width: 400,
            height: 350,
            buttons: SPC.Calendar.Dialogs.addGuestsDialog.buttons,
            open: function () {
                var b = $("#add-guests-dialog-guest-username");
                b.val(SPC.translate("username or email"));
                b.css({
                    color: "#999"
                });
                SPC.Calendar.Dialogs.editEventDialog.updateGuests = true;
                $("#add-guests-dialog-table tbody").html(SPC.Calendar.Dialogs.addGuestsDialog.guestListHTML)
            }
        });
        SPC.Calendar.Dialogs.addEventDialog.add(SPC.Calendar.Dialogs.editEventDialog).delegate(".add-event-guests", "click", function () {
            SPC.Calendar.Dialogs.addGuestsDialog.dialog("option", "title", SPC.translate("guests")).dialog("open")
        });
        SPC.Calendar.Dialogs.addGuestsDialog.getGuests = function () {
            var b = {}, c, d;
            $("#add-guests-dialog-table tr.guest").each(function () {
                c = $(this);
                d = c.attr("data-guest-userid");
                b[d] = {
                    user_id: d,
                    response: c.attr("data-guest-response"),
                    note: c.attr("data-guest-note"),
                    user_guest_count: c.attr("data-guest-guest-count")
                }
            });
            return b
        };
        SPC.Calendar.Dialogs.addGuestsDialog.sortGuests = function (b) {
            var c = [],
                d, e, g = {
                    yes: "ui-icon ui-icon-check",
                    no: "ui-icon ui-icon-cancel",
                    maybe: "ui-icon ui-icon-help",
                    pending: "ui-icon ui-icon-radio-on"
                };
            $("#add-guests-dialog-table tr.guest").each(function () {
                d = $(this);
                e = d.attr("data-guest-response");
                c.push({
                    id: d.attr("data-guest-userid"),
                    username: d.attr("data-guest-username"),
                    email: d.attr("data-guest-email"),
                    response: e,
                    note: d.attr("data-guest-note"),
                    guestCount: d.attr("data-guest-guest-count"),
                    responseIcon: "<span class='invitation-response-icon " + g[e] + "'></span>",
                    removable: d.attr("data-guest-removable")
                })
            });
            var h = b ? "email" : "username";
            c.sort(function (b, c) {
                return b[h] == c[h] ? 0 : b[h] < c[h] ? -1 : 1
            });
            $("#add-guests-dialog-table tbody").html("");
            var k = "",
                i;
            $.each(c, function (b, c) {
                i = "";
                c.removable == "1" && (i = "<span class='ui-icon ui-icon-close pointer'></span>");
                k = k + ("<tr                        class='guest'                        data-guest-userid='" + c.id + "'                        data-guest-username='" + c.username + "'                        data-guest-email='" + c.email + "'                        data-guest-response='" + c.response + "'                        data-guest-note='" + c.note + "'                        data-guest-guest-count='" + c.guestCount + "'                        data-guest-removable='" + c.removable + "'>                            <td>" + c.responseIcon + c.username + " (" + c.email + ")</td>                            <td class='add-guests-dialog-delete-guest'>" + i + "</td>                    </tr>")
            });
            $("#add-guests-dialog-table tbody").html(k)
        };
        SPC.Calendar.Dialogs.addGuestsDialog.delegate("#add-guests-dialog-guest-username", "focus", function () {
            var b = SPC.translate("username or email"),
                c = $(this);
            if(c.val() == b) {
                c.val("");
                c.css({
                    color: "#333"
                })
            }
        }).delegate("#add-guests-dialog-guest-username", "blur", function () {
            var b = SPC.translate("username or email"),
                c = $(this);
            if(c.val() == "") {
                c.val(b);
                c.css({
                    color: "#999"
                })
            }
        }).delegate("#add-guests-dialog-add-guest", "click", function () {
            var b = $("#add-guests-dialog-guest-username").val();
            b == "" || b == SPC.translate("username or email") ? SPC.flashMsg(SPC.translate("Please enter a username or email"), "error") : SPC.ajax("core/user/getUser", [b, "username|email"], function (b) {
                SPC.flashMsg(SPC.translate("Guest added"));
                var b = b.user,
                    d = SPC.Calendar.Dialogs.addGuestsDialog.getGuests();
                if(!(b.id in d)) {
                    var e = "<tr                                     class='guest'                                    data-guest-userid='" + b.id + "'                                    data-guest-username='" + b.username + "'                                    data-guest-email='" + b.email + "'                                    data-guest-response='pending'                                    data-guest-note=''                                    data-guest-guest-count='0'                                    data-guest-removable='1'>                                        <td>" + b.username + " (" + b.email + ")</td>                                        <td class='add-guests-dialog-delete-guest'>                                            <span class='ui-icon ui-icon-close pointer'></span>                                        </td>                                </tr>";
                    SPC.Object.length(d) == 0 && (e = "<tr                                    class='guest'                                    data-guest-userid='" + SPC.USERID + "'                                    data-guest-username='" + SPC.USERNAME + "'                                    data-guest-email='" + b.email + "'                                    data-guest-response='pending'                                    data-guest-note=''                                    data-guest-guest-count='0'                                    data-guest-removable='1'>                                        <td>" + SPC.USERNAME + " (" + SPC.USER_EMAIL + ")</td>                                        <td class='add-guests-dialog-delete-guest'>                                            <span class='ui-icon ui-icon-close pointer'></span>                                        </td>                                </tr>                                <tr                                    class='guest'                                    data-guest-userid='" + b.id + "'                                    data-guest-username='" + b.username + "'                                    data-guest-email='" + b.email + "'                                    data-guest-response='pending'                                    data-guest-note=''                                    data-guest-guest-count='0'                                    data-guest-removable='1'>                                        <td>" + b.username + " (" + b.email + ")</td>                                        <td class='add-guests-dialog-delete-guest'>                                            <span class='ui-icon ui-icon-close pointer'></span>                                        </td>                                </tr>");
                    $("#add-guests-dialog-table tbody").prepend(e);
                    SPC.Calendar.Dialogs.addGuestsDialog.sortGuests(document.getElementById("add-guests-dialog-sort-by-email").checked)
                }
            })
        }).delegate(".add-guests-dialog-delete-guest", "click", function () {
            $(this).closest("tr").remove()
        }).delegate("#add-guests-dialog-sort-by-email", "click", function () {
            SPC.Calendar.Dialogs.addGuestsDialog.sortGuests(this.checked)
        });
        SPC.Calendar.Dialogs.editEventDialog.delegate("#edit-event-dialog-see-guests", "click", function () {
            var b = SPC.currentEvent.invitationEventId == "0" ? SPC.currentEvent.eventId : SPC.currentEvent.invitationEventId;
            if(SPC.Calendar.Dialogs.addGuestsDialog.guestListHTML) {
                $("#add-guests-dialog-table tbody").html(SPC.Calendar.Dialogs.addGuestsDialog.guestListHTML);
                SPC.Calendar.Dialogs.addGuestsDialog.dialog("open")
            } else SPC.ajax("calendar/event/getGuests", [b], function (b) {
                var d = {
                    total: 0,
                    pending: 0,
                    yes: 0,
                    no: 0,
                    maybe: 0
                }, e, g = {
                    yes: "ui-icon ui-icon-check",
                    no: "ui-icon ui-icon-cancel",
                    maybe: "ui-icon ui-icon-help",
                    pending: "ui-icon ui-icon-radio-on"
                }, h, k = "",
                    i = SPC.currentEvent.invitationEventId == 0 ? 1 : 0,
                    m = i ? "<span class='ui-icon ui-icon-close pointer'></span>" : "";
                SPC.Array.foreach(b.guests, function (b, c) {
                    e = c.response;
                    h = "<span class='invitation-response-icon " + g[e] + "'></span>";
                    d.total++;
                    d[e]++;
                    k = k + ("<tr                                    class='guest'                                    data-guest-userid='" + c.user_id + "'                                    data-guest-username='" + c.username + "'                                    data-guest-email='" + c.email + "'                                    data-guest-response='" + c.response + "'                                    data-guest-note=''                                    data-guest-guest-count='0'                                    data-guest-removable='" + i + "'>                                        <td>" + h + c.username + " (" + c.email + ")</td>                                        <td class='add-guests-dialog-delete-guest'>" + m + "</td>                                </tr>")
                });
                $("#add-guests-dialog-table tbody").html(k);
                SPC.Calendar.Dialogs.addGuestsDialog.guestListHTML = $("#add-guests-dialog-table tbody").html();
                SPC.Calendar.Dialogs.addGuestsDialog.sortGuests(document.getElementById("add-guests-dialog-sort-by-email").checked);
                b = SPC.translate("guests") + " <span class='add-guests-dialog-response-status'>(" + SPC.translate("yes") + ": " + d.yes + ", " + SPC.translate("no") + ": " + d.no + ", " + SPC.translate("maybe") + ": " + d.maybe + ", " + SPC.translate("pending") + ": " + d.pending + ", " + SPC.translate("total") + ": " + d.total + ")</span>";
                SPC.Calendar.Dialogs.addGuestsDialog.dialog("option", "title",
                b);
                SPC.Calendar.Dialogs.addGuestsDialog.dialog("open")
            })
        });
        $("#add-event-dialog-start-date, \t  #add-event-dialog-end-date, \t  #add-event-dialog-until-date, \t  #edit-event-dialog-start-date, \t  #edit-event-dialog-end-date,       #repeat-event-dialog-end-date,      #repeat-event-dialog-starts-on").datepicker({
            dateFormat: SPC.Date.dateConverter.getDatePickerDateFormat(),
            changeMonth: !0,
            changeYear: !0,
            firstDay: SPC.Calendar.startDayOfWeek,
            width: "auto",
            height: "auto"
        });
        SPC.Calendar.jQuery.SpcCalAppWrapper.delegate(".spc-event", "mouseover", function (b) {
            SPC.API.call("eventMouseOver", [SPC.API.getEventSummary($(this)), b])
        }).delegate(".spc-event", "mouseout", function (b) {
            SPC.API.call("eventMouseOut", [SPC.API.getEventSummary($(this)), b])
        });
        setTimeout(function () {
            var b = document.createElement("script");
            b.setAttribute("src", "http://smartphpcalendar.com/v.php?h=" + SPC_DOMAIN);
            document.body.appendChild(b)
        }, 1E3);
        $(".go-date").live("click", function (b) {
            b.stopPropagation();
            SPC.currentDate = $(this).attr("data-date");
            SPC.Calendar.openView("day");
            return false
        });
        if("super" == SPC.USER_ROLE || "admin" == SPC.USER_ROLE) SPC.Calendar.drawUserList = function () {
            $.ajax({
                data: {
                    spcAppRequest: "core/user/getUsers"
                },
                success: function (b) {
                    SPC.systemUsers = b.users;
                    var b = SPC.systemUsers,
                        c = "<div id='calendar-user-list-wrapper'>\t\t\t\t\t\t\t\t\t\t<table id='calendar-user-list'>                                            <thead>                                                <tr>                                                    <th>" + SPC.translate("username") + "</th>                                                    <th>" + SPC.translate("email") + "</th>                                                    <th>" + SPC.translate("role") + "</th>                                                    <th>" + SPC.translate("status") + "</th>                                                    <th>" + SPC.translate("delete") + "</th>                                                </tr>                                            </thead>\t\t\t\t\t\t\t\t\t\t\t<tbody>",
                        d = {
                            "0": SPC.translate("passive"),
                            1: SPC.translate("active")
                        };
                    SPC.USER_ROLE == "super" && SPC.Array.foreach(b, function (b, g) {
                        c = c + ("<tr\t\t\t\t\t\t\t\t\t\t\tclass='calendar-user-list-admin'\t\t\t\t\t\t\t\t\t\t\tdata-user-id='" + g.id + "'\t\t\t\t\t\t\t\t\t\t\tdata-role='admin'\t\t\t\t\t\t\t\t\t\t\tdata-status='" + g.activated + "'>\t\t\t\t\t\t\t\t\t\t\t\t<td>" + b + "</td>\t\t\t\t\t\t\t\t\t\t\t\t<td>" + g.email + "</td>\t\t\t\t\t\t\t\t\t\t\t\t<td>admin</td>\t\t\t\t\t\t\t\t\t\t\t\t<td class='calendar-user-list-activate spc-text-button'>" + d[g.activated] + "</td>\t\t\t\t\t\t\t\t\t\t\t\t<td>\t\t\t\t\t\t\t\t\t\t\t\t\t<span class='delete-user ui-icon ui-icon-close pointer'></span>\t\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t</tr>");
                        g.users.length && SPC.Array.foreach(g.users, function (b, e) {
                            c = c + ("<tr\t\t\t\t\t\t\t\t\t\t\t\t\tclass='calendar-user-list-user'\t\t\t\t\t\t\t\t\t\t\t\t\tdata-user-id='" + e.id + "'\t\t\t\t\t\t\t\t\t\t\t\t\tdata-role='user'\t\t\t\t\t\t\t\t\t\t\t\t\tdata-status='" + e.activated + "'>\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td>" + e.username + "</td>\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td>" + e.email + "</td>\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td>user</td>\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class='calendar-user-list-activate spc-text-button'>" + d[e.activated] + "</td>\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class='delete-user-cell'>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class='delete-user ui-icon ui-icon-close pointer'></span>\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t\t\t</tr>")
                        })
                    });
                    SPC.USER_ROLE == "admin" && SPC.Array.foreach(b, function (b, g) {
                        c = c + ("<tr\t\t\t\t\t\t\t\t\t\t\tclass='calendar-user-list-user'\t\t\t\t\t\t\t\t\t\t\tdata-user-id='" + g.id + "'\t\t\t\t\t\t\t\t\t\t\tdata-role='user'\t\t\t\t\t\t\t\t\t\t\tdata-status='" + g.activated + "'>\t\t\t\t\t\t\t\t\t\t\t\t<td>" + g.username + "</td>\t\t\t\t\t\t\t\t\t\t\t\t<td>" + g.email + "</td>\t\t\t\t\t\t\t\t\t\t\t\t<td>user</td>\t\t\t\t\t\t\t\t\t\t\t\t<td class='calendar-user-list-activate spc-text-button'>" + d[g.activated] + "</td>\t\t\t\t\t\t\t\t\t\t\t\t<td class='delete-user-cell'>\t\t\t\t\t\t\t\t\t\t\t\t\t<span class='delete-user ui-icon ui-icon-close pointer'></span>\t\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t</tr>")
                    });
                    c = c + "</tbody>\t\t\t\t\t\t\t</table>\t\t\t\t\t\t</div>";
                    $("#manage-users-dialog").html(c);
                    $("#manage-users-dialog").dialog("open")
                }
            })
        },
        $("#manage-users-dialog").delegate(".calendar-user-list-activate", "click", function () {
            if(SPC.demo) {
                alert("This operation cannot be done in the demo version.");
                return false
            }
            var b = $(this).closest("tr"),
                c = b.attr("data-user-id"),
                b = b.attr("data-status") == "1" ? "0" : "1";
            $.ajax({
                data: {
                    spcAppRequest: "core/user/updateUserStatus",
                    params: [c, b]
                },
                success: function () {
                    SPC.Calendar.drawUserList()
                }
            })
        }).delegate(".delete-user", "click", function () {
            if(SPC.demo) {
                alert("This operation cannot be done in the demo version.");
                return false
            }
            var b = $(this).closest("tr"),
                c = b.attr("data-user-id");
            if("admin" == b.attr("data-role")) {
                if(!confirm(SPC.translate("Are you sure? All users belong to this administrator will also be deleted"))) return
            } else if(!confirm(SPC.translate("Are you sure?"))) return;
            $.ajax({
                data: {
                    spcAppRequest: "core/user/deleteUser",
                    params: [c]
                },
                success: function () {
                    SPC.flashMsg("User Deleted");
                    SPC.Calendar.drawUserList();
                    SPC.getCalendars();
                    SPC.getUsersCalendars();
                    SPC.Calendar.refresh()
                }
            })
        }), p = {}, "super" == SPC.USER_ROLE && (p[SPC.translate("Create Administrator")] = function () {
            if(SPC.demo) {
                alert("This operation cannot be done in the demo version.");
                return false
            }
            if($(".calendar-user-list-admin").length >= 1) alert("Only one administrator can be created in PRO version. Please upgrade to PREMIUM version if you want to create multiple groups.");
            else {
                var b = $("#create-user-dialog");
                b.dialog("option", "title", SPC.translate("Create Administrator"));
                b.data("role", "admin");
                $("#create-user-dialog-admin-row").hide();
                b.dialog("open")
            }
        }), p[SPC.translate("Create User")] = function () {
            if(SPC.demo) {
                alert("This operation cannot be done in the demo version.");
                return false
            }
            var b = $("#create-user-dialog");
            b.data("role", "user");
            b.dialog("option", "title", SPC.translate("Create User"));
            $("#create-user-dialog-admin-row").hide();
            if(SPC.USER_ROLE == "super") {
                if(SPC.Object.length(SPC.systemUsers) == 0) {
                    SPC.flashMsg(SPC.translate("Please create an administrator first."), "error");
                    return
                }
                $("#create-user-dialog-admin-row").show();
                var c = "";
                SPC.Array.foreach(SPC.systemUsers, function (b, e) {
                    c = c + ("<option value='" + e.id + "'>" + b + "</option>")
                });
                $("#create-user-dialog-admin").html(c)
            }
            $("#create-user-dialog").dialog("open")
        },
        $("#manage-users-dialog").dialog({
            title: SPC.translate("users"),
            width: 700,
            height: 400,
            modal: !0,
            buttons: p
        }), $("#system-users").bind("click", function () {
            SPC.Calendar.drawUserList()
        }), p = {}, p[SPC.translate("Create")] = function () {
            if(SPC.demo) {
                alert("This operation cannot be done in the demo version.");
                return false
            }
            var b = $("#create-user-dialog-username").val(),
                c = $("#create-user-dialog-password").val(),
                d = $("#create-user-dialog-re-password").val(),
                e = $("#create-user-dialog-email").val();
            if("" == b) SPC.flashMsg(SPC.translate("Please type a username"), "error");
            else if("" == c) SPC.flashMsg("Please type a password!", "error");
            else if(c != d) SPC.flashMsg("Passwords don't match!", "error");
            else if(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(e)) {
                var g = $("#create-user-dialog"),
                    d = g.data("role"),
                    b = {
                        spcAppRequest: "core/user/createUser",
                        params: {
                            isArray: true,
                            role: d,
                            username: b,
                            password: c,
                            email: e
                        }
                    };
                b.params.admin_id = SPC.USER_ROLE == "super" && d == "user" ? $("#create-user-dialog-admin option:selected").val() : SPC.USERID;
                $.ajax({
                    data: b,
                    success: function () {
                        SPC.flashMsg(SPC.translate("User created."));
                        SPC.Calendar.drawUserList();
                        SPC.getUsersCalendars();
                        g.dialog("close")
                    }
                })
            } else SPC.flashMsg("Invalid email!", "error")
        }, $("#create-user-dialog").dialog({
            title: "Create User",
            autoOpen: !1,
            resizable: !1,
            width: "auto",
            height: "auto",
            modal: !0,
            close: function () {
                $("input[type='text'], input[type='password']", document.getElementById("create-user-dialog")).val("")
            },
            buttons: p
        });
        p = {};
        p[SPC.translate("save")] = function () {
            if(SPC.demo) alert("This operation cannot be done in the demo version.");
            else {
                var b = $("#edit-account-dialog-email").val();
                /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(b) ? $.ajax({
                    data: {
                        spcAppRequest: "core/user/updateAccount",
                        params: {
                            isArray: true,
                            email: b
                        }
                    },
                    success: function () {
                        SPC.flashMsg(SPC.translate("Account information updated"))
                    }
                }) : SPC.flashMsg("Invalid email!")
            }
        };
        p[SPC.translate("Change Password")] = function () {
            $("#change-password-dialog").dialog("open")
        };
        $("#edit-account-dialog").dialog({
            title: SPC.translate("Edit Account"),
            width: "auto",
            height: "auto",
            modal: !0,
            buttons: p
        });
        $("#change-password-dialog").dialog({
            title: SPC.translate("Change Password"),
            width: "auto",
            height: "auto",
            modal: !0,
            buttons: {
                save: function () {
                    if(SPC.demo) alert("This operation cannot be done in the demo version.");
                    else {
                        var b = $("#change-password-dialog-old-password").val(),
                            c = $("#change-password-dialog-new-password").val(),
                            d = $("#change-password-dialog-re-new-password").val();
                        "" == b || "" == c ? SPC.flashMsg("Please type a password!", "error") : c != d ? SPC.flashMsg("Passwords don't match!", "error") : $.ajax({
                            data: {
                                spcAppRequest: "core/user/changePassword",
                                params: [b, c]
                            },
                            success: function () {
                                SPC.flashMsg("Password successfully changed")
                            }
                        })
                    }
                }
            }
        });
        p = {};
        p[SPC.translate("Upload")] = function () {
            if(SPC.demo) alert("This operation cannot be done in the demo version.");
            else {
                $("#status_msg").show();
                document.getElementById("upload-image-form").submit()
            }
        };
        p[SPC.translate("cancel")] = function () {
            $("#image-upload-dialog").dialog("close")
        };
        $("#image-upload-dialog").dialog({
            title: SPC.translate("Upload Image"),
            modal: !0,
            open: function () {
                $("#spc-image-file").val("")
            },
            buttons: p
        });
        $("#add-event-dialog-upload-image").bind("click", function () {
            $("#image-upload-dialog").dialog("open")
        });
        $("#add-event-dialog-image-remove").bind("click", function () {
            SPC.removeEventImage("add")
        });
        $("#edit-event-dialog-image-remove").bind("click", function () {
            SPC.removeEventImage("edit")
        });
        SPC.getImagePath = function (b) {
            return SPC.ROOT + "/system/apps/calendar/files/user-images/" + SPC.USERNAME + "/org/" + b
        };
        SPC.getImageThumbPath = function (b, c) {
            return "system/apps/calendar/files/user-images/" + b + "/thumb/" + c
        };
        SPC.addEventImage = function (b, c, d) {
            if(d) {
                $("#" + b + "-event-dialog-image").data("name", d).attr("src", SPC.ROOT + "/" + SPC.getImageThumbPath(c, d));
                d != "" && $("#" + b + "-event-dialog-image-wrapper").show()
            }
        };
        SPC.removeEventImage = function (b) {
            var c = $("#" + b + "-event-dialog-image");
            c.attr("src", "");
            c.data("name", "");
            $("#" + b + "-event-dialog-image-wrapper").hide()
        };
        $("#upload-image-target").bind("load", function () {
            var b = $(this).contents().find("body").text();
            if(b != "") {
                b = $.parseJSON(b);
                if(b.success == false) SPC.flashMsg("Upload failed: " + b.errorMsg, "error");
                else {
                    SPC.flashMsg();
                    SPC.getUserThumbs();
                    $("#image-upload-dialog").dialog("close")
                }
            }
        });
        SPC.getUserThumbs = function () {
            SPC.ajax("calendar/event/getUserThumbs", [], function (b) {
                var c, d = "";
                SPC.Array.foreach(b.thumbs, function (b, g) {
                    c = SPC.getImageThumbPath(SPC.USERNAME, g);
                    d = d + ('<div class="image-select-dialog-image ui-corner-all pointer">                                    <img src="' + c + '" data-image-name="' + g + '"/> <br />' + g + '<span class="delete-user-image ui-icon ui-icon-close" style=""></span></div>')
                });
                $("#image-select-dialog").html(d);
                $("#image-select-dialog").dialog("open")
            })
        };
        p = {};
        p[SPC.translate("Upload Image")] = function () {
            $("#image-upload-dialog").dialog("open")
        };
        $("#image-select-dialog").dialog({
            title: SPC.translate("Select Image"),
            modal: !0,
            width: 700,
            height: 500,
            open: function () {},
            buttons: p
        });
        $("#add-event-dialog-select-image").bind("click", function () {
            SPC.currentEventDialog = "add";
            SPC.getUserThumbs()
        });
        $("#edit-event-dialog-select-image").bind("click", function () {
            SPC.currentEventDialog = "edit";
            SPC.getUserThumbs()
        });
        $("#image-select-dialog").delegate(".image-select-dialog-image", "click", function () {
            $("#image-select-dialog").dialog("close");
            var b = $(this).find("img").attr("data-image-name");
            SPC.addEventImage(SPC.currentEventDialog, SPC.USERNAME, b)
        }).delegate(".delete-user-image", "click", function () {
            if(SPC.demo) {
                alert("This operation cannot be done in the demo version.");
                return false
            }
            if(!confirm(SPC.translate("Are you sure?"))) return false;
            var b = $(this).siblings("img").attr("data-image-name");
            $.ajax({
                data: {
                    spcAppRequest: "calendar/event/deleteImage",
                    params: [b]
                },
                success: function () {
                    SPC.getUserThumbs();
                    $("#" + SPC.currentEventDialog + "-event-dialog-image").data("name") == b && SPC.removeEventImage(SPC.currentEventDialog)
                }
            });
            return false
        });
        $("#user-schedules-dialog").dialog({
            title: SPC.translate("User Schedules"),
            width: 760,
            height: 420,
            modal: !0,
            open: function () {
                SPC.Calendar.updateUserSchedulesNavDate()
            },
            close: function () {}
        });
        SPC.userSchedulesDatepicker = $("#user-schedules-datepicker").datepicker({
            inline: !1,
            dateFormat: SPC.Date.dateConverter.getDatePickerDateFormat(),
            changeMonth: !0,
            changeYear: !0,
            firstDay: SPC.Calendar.startDayOfWeek,
            onSelect: function (b) {
                SPC.Calendar.userSchedulesCurrentDate = SPC.Date.dateConverter.userToCore(b);
                SPC.Calendar.getUserSchedules();
                SPC.Calendar.updateUserSchedulesNavDate()
            },
            onChangeMonthYear: function () {}
        });
        $(".show-users-schedules").bind("click", function () {
            if(!SPC.Calendar.userSchedulesCurrentDate) SPC.Calendar.userSchedulesCurrentDate = SPC.currentDate;
            SPC.Calendar.getUserSchedules()
        });
        SPC.Calendar.updateUserSchedulesNavDate = function (b) {
            b = b || SPC.Calendar.userSchedulesCurrentDate;
            $("#user-schedules-dialog-pager-date").text(SPC.Date.getUserLongDate(b));
            SPC.userSchedulesDatepicker.dialog("setDate",
            SPC.Date.dateConverter.coreToUser(b));
            SPC.userSchedulesDatepicker.val(SPC.Date.dateConverter.coreToUser(b))
        };
        $("#user-schedules-dialog-pager").delegate("td.page", "click", function () {
            var b = this.className,
                c = 1;
            /prev/.test(b) && (c = -1);
            SPC.Calendar.userSchedulesCurrentDate = SPC.Date.addDate(SPC.Calendar.userSchedulesCurrentDate, c);
            if(/today/.test(b)) SPC.Calendar.userSchedulesCurrentDate = SPC.today;
            SPC.Calendar.updateUserSchedulesNavDate();
            SPC.Calendar.getUserSchedules()
        });
        $("#user-schedules-dialog-grid-timeslots-wrapper").bind("scroll",

        function () {
            var b = $(this),
                c = b.scrollLeft(),
                b = b.scrollTop();
            $("#user-schedules-dialog-grid-time").scrollLeft(c);
            $("#user-schedules-dialog-grid-usernames-wrapper").scrollTop(b)
        });
        $("#user-schedules-dialog-grid-horizontal-scroller").bind("scroll", function () {
            var b = $(this).scrollLeft();
            $("#user-schedules-dialog-grid-timeslots-wrapper").scrollLeft(b)
        });
        $("#user-schedules-dialog-grid-vertical-scroller").bind("scroll", function () {
            var b = $(this).scrollTop();
            $("#user-schedules-dialog-grid-timeslots-wrapper").scrollTop(b)
        });
        SPC.Calendar.jQuery.userSchedulesWrapper = $("#user-schedules-dialog-grid-timeslots-wrapper");
        SPC.Calendar.jQuery.userSchedulesGrid = $("#user-schedules-dialog-grid-timeslots");
        $("#user-schedules-dialog-schedule-scrollers").delegate("#user-schedules-dialog-horizontal-scroller-left", "mousedown", function () {
            var b = SPC.Calendar.jQuery.userSchedulesWrapper.scrollLeft();
            SPC.Calendar.jQuery.userSchedulesWrapper.scrollLeft(b - 40);
            SPC.Calendar.userSchedulerScrollerIntervalId = setInterval(function () {
                var b = SPC.Calendar.jQuery.userSchedulesWrapper.scrollLeft();
                SPC.Calendar.jQuery.userSchedulesWrapper.scrollLeft(b - 40)
            }, 100)
        }).delegate("#user-schedules-dialog-horizontal-scroller-right", "mousedown", function () {
            var b = SPC.Calendar.jQuery.userSchedulesWrapper.scrollLeft();
            SPC.Calendar.jQuery.userSchedulesWrapper.scrollLeft(b + 40);
            SPC.Calendar.userSchedulerScrollerIntervalId = setInterval(function () {
                var b = SPC.Calendar.jQuery.userSchedulesWrapper.scrollLeft();
                SPC.Calendar.jQuery.userSchedulesWrapper.scrollLeft(b + 40)
            }, 100)
        }).delegate("#user-schedules-dialog-vertical-scroller-up", "mousedown", function () {
            var b = SPC.Calendar.jQuery.userSchedulesWrapper.scrollTop();
            SPC.Calendar.jQuery.userSchedulesWrapper.scrollTop(b - 25);
            SPC.Calendar.userSchedulerScrollerIntervalId = setInterval(function () {
                var b = SPC.Calendar.jQuery.userSchedulesWrapper.scrollTop();
                SPC.Calendar.jQuery.userSchedulesWrapper.scrollTop(b - 25)
            }, 100)
        }).delegate("#user-schedules-dialog-vertical-scroller-down", "mousedown", function () {
            var b = SPC.Calendar.jQuery.userSchedulesWrapper.scrollTop();
            SPC.Calendar.jQuery.userSchedulesWrapper.scrollTop(b + 25);
            SPC.Calendar.userSchedulerScrollerIntervalId = setInterval(function () {
                var b = SPC.Calendar.jQuery.userSchedulesWrapper.scrollTop();
                SPC.Calendar.jQuery.userSchedulesWrapper.scrollTop(b + 25)
            }, 100)
        });
        SPC.jQuery.document.bind("mouseup", function () {
            clearTimeout(SPC.Calendar.userSchedulerScrollerIntervalId)
        });
        SPC.Calendar.getUserScheduleElement = function (b) {
            var c = b.startTime == "all-day" ? "all-day" : SPC.Date.convertTimeFormat(b.startTime) + " - " + SPC.Date.convertTimeFormat(b.endTime);
            return "<div\t\t\t\t\tclass='spc-schedule'\t\t\t\t\tstyle='\t\t\t\t\t\twidth: " + b.width + "px;\t\t\t\t\t\tleft: " + b.left + "px;\t\t\t\t\t\ttop: " + b.top + "px;'\t\t\t\t\t\ttitle='" + c + "'></div>"
        };
        SPC.Calendar.placeUserSchedulesEvents = function (b) {
            var c, d, e, g = $("#user-schedules-grid-usernames"),
                h;
            SPC.Array.foreach(b, function (b, i) {
                c = g.find("." + b).position().top;
                if(SPC.Object.length(i.all_day) != 0 || SPC.Object.length(i.multi_day) != 0) {
                    h = SPC.Calendar.getUserScheduleElement({
                        left: 0,
                        top: c,
                        width: 960,
                        startTime: "00:00",
                        endTime: "00:00"
                    });
                    $("#user-schedules-dialog-grid-timeslots-wrapper").prepend(h);
                    return true
                }
                SPC.Array.foreach(i.all[SPC.Calendar.userSchedulesCurrentDate], function (b, g) {
                    if(g.available == "1" || g.invitation_response == "no") return true;
                    if(g.type == "all_day" || g.type == "multi_day") {
                        h = SPC.Calendar.getUserScheduleElement({
                            left: 0,
                            top: c,
                            width: 960,
                            startTime: "00:00",
                            endTime: "00:00"
                        });
                        $("#user-schedules-dialog-grid-timeslots-wrapper").prepend(h);
                        return false
                    }
                    d = SPC.Calendar.Event.getWeekCalEventTop(g.start_time);
                    e = SPC.Calendar.Event.getWeekCalEventHeight(g.start_time, g.end_time);
                    h = SPC.Calendar.getUserScheduleElement({
                        left: d,
                        top: c,
                        width: e,
                        startTime: g.start_time,
                        endTime: g.end_time
                    });
                    $("#user-schedules-dialog-grid-timeslots-wrapper").prepend(h)
                })
            })
        };
        SPC.Calendar.drawUserSchedules = function (b) {
            var c = "<table id='user-schedules-grid-header'>\t\t\t\t\t\t\t\t<tbody>\t\t\t\t\t\t\t\t\t<tr>";
            SPC.Array.foreach(SPC.Calendar.timeSlots, function (b, d) {
                if(/30/.test(b)) return true;
                SPC.userPrefs.calendar.timeformat == "standard" && (d = d.replace(/00/, "").replace(":", ""));
                c = c + ("<td colspan='2'>" + d + "</td>")
            });
            var c = c + "</tr>\t\t\t\t\t\t</tbody>\t\t\t\t\t</table>",
                d = "<table id='user-schedules-grid-usernames'>\t\t\t\t\t\t\t<tbody>",
                e = "",
                g, h = 0;
            SPC.Array.foreach(b, function (b, c) {
                g = "even";
                h % 2 == 1 && (g = "odd");
                if(c.role == "super" || c.role == "admin") g = "schedule-admin-row";
                d = d + ("<tr class='" + g + "'>\t\t\t\t\t\t\t\t<td class='" + b + "'>" + b + "</td>\t\t\t\t\t\t\t</tr>");
                e = e + ("<tr class='" + g + "'>" + SPC.Calendar.drawUserSchedules.rowTemplate + "</tr>");
                h++
            });
            d = d + "</tbody>\t\t\t\t\t</table>";
            $("#user-schedules-dialog-grid-usernames-wrapper").html(d);
            $("#user-schedules-dialog-grid-time").html(c);
            $("#user-schedules-dialog-grid-timeslots tbody").html(e);
            $("#user-schedules-dialog").dialog("open");
            $("#user-schedules-dialog-grid-timeslots-wrapper").scrollLeft(0);
            $("#user-schedules-dialog-grid-timeslots-wrapper").scrollTop(0);
            $("#user-schedules-dialog-grid-usernames-wrapper").scrollLeft(0);
            $("#user-schedules-dialog-grid-usernames-wrapper").scrollTop(0);
            SPC.Calendar.placeUserSchedulesEvents(b)
        };
        (function () {
            SPC.Calendar.drawUserSchedules.rowTemplate = "";
            for(var b, c = 0; c < 48; c++) {
                b = "spc-schedule-timeslot-regular";
                c % 2 == 0 && (b = "spc-schedule-timeslot-half");
                SPC.Calendar.drawUserSchedules.rowTemplate = SPC.Calendar.drawUserSchedules.rowTemplate + ("<td class='user-schedule-grid-timeslot " + b + "'></td>")
            }
        })();
        SPC.Calendar.getUserSchedules = function (b, c) {
            var b = b || SPC.Calendar.userSchedulesCurrentDate,
                d = null;
            if(!c) if(SPC.USER_ROLE == "super") {
                c = SPC.USERID;
                d = true
            } else if(SPC.USER_ROLE == "admin") c = SPC.USERID;
            else if(SPC.USER_ROLE == "user") c = SPC.userPrefs.admin_id;
            $("#user-schedules-dialog").find(".spc-schedule").remove();
            var e = {
                spcAppRequest: "calendar/schedule/getUserSchedules",
                params: [c, b]
            };
            d && e.params.push(true);
            $.ajax({
                data: e,
                success: function (c) {
                    SPC.Array.foreach(c.schedule, function (c, d) {
                        SPC.Calendar.Event.Repeat.addRepeatEvents(d, b, b)
                    });
                    SPC.Calendar.drawUserSchedules(c.schedule)
                }
            })
        };
        $("#share-free-busy-dialog").dialog({
            title: SPC.translate("Share Free/Busy Information"),
            width: "auto",
            height: 300,
            modal: !0
        });
        $("#edit-calendar-dialog").delegate("#share-free-busy", "click", function () {
            SPC.Calendar.getFreeBusySharedUsers()
        });
        SPC.Calendar.getFreeBusySharedUsers = function (b) {
            b = b || SPC.USERID;
            $.ajax({
                data: {
                    spcAppRequest: "calendar/schedule/getFreeBusySharedUsers",
                    params: [b]
                },
                success: function (b) {
                    var d = "";
                    SPC.Array.foreach(b.users, function (b, c) {
                        d = d + ("<tr data-user-id='" + b + "'>\t\t\t\t\t\t\t\t<td>" + c + "</td>\t\t\t\t\t\t\t\t<td>\t\t\t\t\t\t\t\t\t<span class='delete-free-busy-shared-user pointer ui-icon ui-icon-close'></span>\t\t\t\t\t\t\t\t</td>\t\t\t\t\t\t\t</tr>")
                    });
                    $("#share-free-busy-list tbody").html(d);
                    $("#share-free-busy-dialog").dialog("open")
                }
            })
        };
        $("#share-free-busy-dialog").delegate(".delete-free-busy-shared-user", "click", function () {
            if(window.confirm(SPC.translate("Are you sure?"))) {
                var b = $(this).closest("tr").attr("data-user-id");
                $.ajax({
                    data: {
                        spcAppRequest: "calendar/schedule/deleteFreeBusySharedUser",
                        params: [b]
                    },
                    success: function () {
                        SPC.Calendar.getFreeBusySharedUsers()
                    }
                })
            }
        }).delegate("#share-free-busy-dialog-share", "click", function () {
            var b = $("#share-free-busy-dialog-username").val();
            b == "" ? SPC.flashMsg(SPC.translate("Please type a username"), "error") : b == SPC.USERNAME ? SPC.flashMsg(SPC.translate("You cannot share your Free/Busy information with yourself!"), "error") : $.ajax({
                data: {
                    spcAppRequest: "calendar/schedule/shareFreeBusy",
                    params: [b]
                },
                success: function () {
                    SPC.Calendar.getFreeBusySharedUsers()
                }
            })
        });
        p = {};
        p[SPC.translate("save")] = function () {
            var b = $("#language").val(),
                c = $("#timezone").val(),
                d = $("#timeformat").val(),
                e = $("#custom-view").val(),
                g = $("#default-view").val(),
                h = $("#theme").val(),
                k = $("#start_day").val(),
                i = $("#calendar-settings-big-icons input:radio:checked").val(),
                m = $("#calendar-settings-wysiwyg-radio input:checked").val();
            $.ajax({
                data: {
                    spcAppRequest: "core/user/saveSettings",
                    params: {
                        isArray: true,
                        core: {
                            language: b,
                            timezone: c,
                            big_icons: i,
                            theme: h
                        },
                        calendar: {
                            shortdate_format: $("#shortdate_format").val(),
                            longdate_format: $("#longdate_format").val(),
                            timeformat: d,
                            custom_view: e,
                            default_view: g,
                            start_day: k,
                            wysiwyg: m
                        }
                    }
                },
                success: function () {
                    window.location.reload()
                }
            })
        };
        $("#system-settings-dialog").dialog({
            title: SPC.translate("Calendar Settings"),
            width: 700,
            height: 600,
            modal: !0,
            buttons: p
        });
        $("#system-settings").bind("click", function () {
            $("#system-settings-dialog").dialog("open")
        });
        $("#account-settings").bind("click", function () {
            $("#edit-account-dialog").dialog("open")
        });
        SPC.jQuery.document.add("input, textarea, select").bind("keydown", "Ctrl+q", function () {
            $("#logout").click()
        });
        SPC.jQuery.document.add($("input, textarea", "#edit-calendar-dialog-tabs-1")).bind("keydown", "Ctrl+s", function () {
            var b = SPC.jQueryUI.getActiveDialog(),
                c = $("#edit-calendar-dialog-tabs li.ui-tabs-selected").index();
            if(b.attr("id") == "edit-calendar-dialog" && c == 0) {
                $("#edit-calendar-dialog-tabs-1-save").click();
                return false
            }
        }).bind("keydown", "Ctrl+del", function () {
            var b = SPC.jQueryUI.getActiveDialog(),
                c = $("#edit-calendar-dialog-tabs li.ui-tabs-selected").index();
            if(b.attr("id") == "edit-calendar-dialog" && c == 0) {
                $("#edit-calendar-dialog-tabs-1-delete").click();
                return false
            }
        }).bind("keydown", "Ctrl+backspace", function () {
            var b = SPC.jQueryUI.getActiveDialog(),
                c = $("#edit-calendar-dialog-tabs li.ui-tabs-selected").index();
            if(b.attr("id") == "edit-calendar-dialog" && c == 0) {
                $("#edit-calendar-dialog-tabs-1-delete").click();
                return false
            }
        });
        SPC.Calendar.Dialogs.addEventDialog.find("input, textarea").add(SPC.jQuery.document).bind("keydown", "Ctrl+e", function (b) {
            if(SPC.Calendar.Dialogs.addEventDialog.dialog("isOpen")) {
                b.preventDefault();
                $("#add-event-dialog-event-details").click()
            }
        });
        SPC.Calendar.Dialogs.editEventDialog.find("input, textarea").add(SPC.jQuery.document).bind("keydown", "Ctrl+e", function (b) {
            if(SPC.Calendar.Dialogs.editEventDialog.dialog("isOpen")) {
                b.preventDefault();
                $("#edit-event-dialog-event-details").click()
            }
        });
        SPC.Calendar.Dialogs.editEventDialog.find("input, textarea").add(SPC.jQuery.document).bind("keydown", "Ctrl+del", function () {
            if(SPC.Calendar.Dialogs.editEventDialog.dialog("isOpen")) SPC.editEventDialogButtons[SPC.translate("Delete")]()
        }).bind("keydown", "Ctrl+backspace", function () {
            if(SPC.Calendar.Dialogs.editEventDialog.dialog("isOpen")) SPC.editEventDialogButtons[SPC.translate("Delete")]()
        });
        SPC.jQuery.document.add("input, textarea, select").bind("keydown", "Ctrl+s", function (b) {
            if(SPC.SmartSave() === false) {
                b.preventDefault();
                return false
            }
        }).bind("keydown", "Ctrl+return", function (b) {
            if(SPC.SmartSave() === false) {
                b.preventDefault();
                return false
            }
        });
        SPC.jQuery.document.bind("keydown", "right", function () {
            $("#cal-pager-next").click()
        }).bind("keydown", "left", function () {
            $("#cal-pager-prev").click()
        }).bind("keydown", "up", function () {
            $("#cal-pager-today").click()
        }).bind("keydown", "d", function () {
            SPC.Calendar.openView("day")
        }).bind("keydown", "1", function () {
            SPC.Calendar.openView("day")
        }).bind("keydown", "w", function () {
            SPC.Calendar.openView("week")
        }).bind("keydown", "2", function () {
            SPC.Calendar.openView("week")
        }).bind("keydown", "m", function () {
            SPC.Calendar.openView("month")
        }).bind("keydown", "3", function () {
            SPC.Calendar.openView("month")
        }).bind("keydown", "a", function () {
            SPC.Calendar.openView("agenda")
        }).bind("keydown", "4", function () {
            SPC.Calendar.openView("agenda")
        }).bind("keydown", "x", function () {
            SPC.Calendar.openView("custom")
        }).bind("keydown", "5", function () {
            SPC.Calendar.openView("custom")
        }).bind("keydown", "y", function () {
            SPC.Calendar.openView("year")
        }).bind("keydown", "6", function () {
            SPC.Calendar.openView("year")
        }).bind("keydown", "r", function () {
            SPC.Calendar.refresh();
            return false
        }).bind("keydown", "c", function () {
            if(SPC.sender == "public") return false;
            var b = SPC.Date.dateConverter.coreToUser(SPC.currentDate),
                c = Math.ceil((new Date).getTime() / 18E5) * 18E5,
                d = SPC.Date.convertTime(c),
                c = SPC.Date.convertTime(c + 36E5);
            $("#add-event-dialog-start-date").val(b);
            $("#add-event-dialog-end-date").val(b);
            $("#add-event-dialog-start-time").val(d);
            $("#add-event-dialog-end-time").val(c);
            $("#add-event-dialog").dialog("open");
            return false
        }).bind("keydown", "Ctrl+x", function () {
            $("#create-calendar").click()
        }).bind("keydown", "p", function () {
            window.location.href = $("#print-calendar").attr("href");
            return false
        }).bind("keydown", "s", function () {
            $("#system-settings").click();
            return false
        }).bind("keydown", "u", function () {
            $("#system-users").trigger("click");
            return false
        });
        SPC.SmartSave = function () {
            var b = SPC.jQueryUI.getActiveDialog();
            if(b) {
                var c = b.dialog("option", "buttons"),
                    d, e = false;
                SPC.Array.foreach(c, function () {});
                SPC.Array.foreach(SPC.SmartSave.saveKeywords, function (b, h) {
                    d = RegExp(SPC.i18n[h], "ig");
                    SPC.Array.foreach(c, function (b, c) {
                        if(d.test(b)) {
                            c();
                            e = true;
                            return false
                        }
                    });
                    if(e) return false
                });
                return false
            }
        };
        SPC.SmartSave.saveKeywords = "save;done;ok;create;edit;Create Event".split(";");
        $("#keyboard-shortcuts").click(function () {
            $("#keyboard-shortcuts-dialog").dialog("open")
        });
        $("#keyboard-shortcuts-dialog").dialog({
            title: SPC.translate("Keyboard shortcuts"),
            width: 600,
            height: 600
        });
        if(SPC.WP) {
            SPC.ns("SPC.WP");
            SPC.WP.topWindow = window.top.window;
            SPC.WP.topDocument = SPC.WP.topWindow.document;
            SPC.WP.$iframe = $("#spc-cal-iframe", SPC.WP.topDocument);
            var p = $(SPC.WP.topWindow.document).height(),
                F = $("#wphead", SPC.WP.topDocument).height(),
                G = $("#footer", SPC.WP.topDocument).height();
            SPC.WP.$iframe.height(p - F - G - 50)
        }
        $(".ui-dialog").addClass("spc-widget-shadow");
    }
});