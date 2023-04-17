var version = '1.0.6b';
var socket = null;
var socket_reserve = null;
var stLang = {
    "en": [
        "Click here to start your bet.",
        "Betslip",
        "Click your quota to insert it in the coupon.",
        "Welcome to XLive!",
        "Sistem",
        "Place bet",
        "Complete",
        "Weekly",
        "Tomorrow",
        "Today",
        "Next 8h",
        "Next 4h",
        "Next 2h",
        "Next 1h",
        "Check ticket",
        "Login",
        "Local credit",
        "Login",
        "Scores",
        "Check ticket",
        "Start time",
        "Teams",
        "League",
        "Scores",
        "You do not have enough money on this device (minimum 2.00).",
        "Please enter the money.",
    ],
    "it": [
        "Clicca qui per iniziare a scommettere.",
        "Scommesse",
        "Cliccare su una quota per inserirla nel coupon.",
        "Benvenuto in XLive!",
        "Sistema",
        "Scommetti",
        "Completa",
        "Settimana",
        "Domani",
        "Oggi",
        "Prossime 8h",
        "Prossime 4h",
        "Prossime 2h",
        "Prossime 1h",
        "Verifica biglietti",
        "Entra",
        "Local credit",
        "Entra",
        "Resultati",
        "Verifica Biglietti",
        "Ora di inizio",
        "Apparecchiatura",
        "Campionato",
        "Fine partita",
        "Non hai abbastanza soldi per questo dispositivo (min. 2.00).",
        "Si prega di inserire i soldi.",
    ],
    "es": [
        "Haz click aqui para empezar tu apuesta.",
        "Coupon",
        "Haz click en una quota para agregarla al coupon.",
        "Bienvenido a XLive!",
        "Sistema",
        "Apostar",
        "Completa",
        "Semana",
        "Mana&ntilde;a",
        "Hoy",
        "Proximas 8h",
        "Proximas 4h",
        "Proximas 2h",
        "Proximas 1h",
        "Verificar coupon",
        "Entra",
        "Credito local",
        "Entra",
        "Resultados",
        "Verificar ticket",
        "Hora de inicio",
        "Equipos",
        "Campionato",
        "Resultado",
        "No tienes suficiente dinero en este dispositivo (mínimo 2.00).",
        "Ingrese el dinero.",
    ],
    "fr": [
        "Clicca qui per iniziare a scommettere.",
        "Scommesse",
        "Cliccare su una quota per inserirla nel coupon.",
        "Benvenuto in XLive!",
        "Sistema",
        "Scommetti",
        "Completa",
        "Settimana",
        "Domani",
        "Oggi",
        "Prossime 8h",
        "Prossime 4h",
        "Prossime 2h",
        "Prossime 1h",
        "Verifica biglietti",
        "Entra",
        "Local credit",
        "Entra",
        "Resultati",
        "Verifica Biglietti",
        "Ora di inizio",
        "Apparecchiatura",
        "Campionato",
        "Fine partita",
        "Non hai abbastanza soldi per questo dispositivo (min. 2.00).",
        "Si prega di inserire i soldi.",
    ]
}

var inactivityTimer = 0;

function createCookie(name,value,days) {
    var d = new Date();
    d.setTime(d.getTime() + (days));
    var expires = "expires="+ d.toUTCString();
    var c = document.cookie = name + "='" + value + "';" + expires + ";path=/";
}
function readCookie(cname) {
    var name = cname + "=";
    var decodedCookie = document.cookie;
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

function resolveUnknownCharsName(html){
    html = html.replace("&apos;", ' ');
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return decode_utf8(txt.value);
}

function decode_utf8(uri, mod) {
    var out = new String(),
        arr,
        i = 0,
        l,
        x;
    typeof mod === "undefined" ? mod = 0 : 0;
    arr = uri.split(/(%(?:d0|d1)%.{2})/);
    for (l = arr.length; i < l; i++) {
        try {
            x = decodeURIComponent(escape(arr[i]));
        } catch (e) {
            x = mod ? arr[i].replace(/%(?!\d+)/g, '%25') : arr[i];
        }
        out += x;
    }
    return out;
}

var specialSportsList = [
    39, 76, 72, 48, 54, 40, 53, 89, 43, 52, 42, 41, 50
];

function createAlertMessage(type, message){
    var type_icon = '<i class="fa fa-question-circle" aria-hidden="true"></i>';
    if(type == 'error') type_icon = '<i class="fa fa-exclamation-triangle" aria-hidden="true" style="color:red;"></i>';
    else if(type == 'warning') type_icon = '<i class="fa fa-exclamation-circle" aria-hidden="true" style="color: darkorange;"></i>';
    else if(type == 'info') type_icon = '<i class="fa fa-comment" aria-hidden="true" style="color: dodgerblue;"></i>';
    else if(type == 'success') type_icon = '<i class="fa fa-check-circle" aria-hidden="true" style="color: forestgreen;"></i>';
    $('.pos-alert-message .pos-alert-message-content .pos-alert-message-type').html(type_icon);
    $('.pos-alert-message .pos-alert-message-content .pos-alert-message-text').html(message);
    $('.pos-alert-message').show();
}

function hiddeAlertMessage(){
    $('.pos-alert-message').hide();
}

function createSportMenu(){
    $.ajax({
        url: configSoftware.service_p,
        method: "POST",
        dataType: 'json',
        data: {
            'operationtype':4000,
            'info': JSON.stringify({
                "siteid":configSoftware.site_id,
                "sessionId":localStorage.getItem('ACTSESS'),
                "systemCode":configSoftware.sys_code,
                'ti': $('.pos-sport-menu-time-selector .pos-sport-menu-time-selector-item.active').attr('data-tid'),
                'lng': configSoftware.language
            })
        },
        success:function (data) {
            if(data.operationMessage == 'success'){
                var json = JSON.parse(data.info);
                //console.debug("New data",json);
                generateSportMenu(json);
            }else{
                if (data.operationId == -25) {
                    logoutClient();
                } else {
                    createAlertMessage('error', data.operationMessage);
                }
            }
        },
        error: function(xhr, ajaxOptions, thrownError){
            createAlertMessage('error', 'Service unavailable');
        }
    });
}

function createEventsList(si) {
    var cils = [],cgis = [];
    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="' + si + '"] > ul > li > ul > li.pos-opened-coi').each(function () {
        if(typeof $(this).attr('data-coi') !== 'undefined'){
            if (cils.indexOf(parseInt($(this).attr('data-coi'))) === -1) cils.push(parseInt($(this).attr('data-coi')));
        }
        if(typeof $(this).attr('data-live') !== 'undefined'){
            if (cgis.indexOf(parseInt($(this).attr('data-live'))) === -1) cgis.push(parseInt($(this).attr('data-live')));
        }
    });
    if (cils.length == 0 || cgis.length == 0) {
        $('.pos-content-events-view .pos-sport-events-view-optlst.active .pos-sport-events-list-prematch, .pos-content-events-view .pos-sport-events-view-optlst.active .pos-sport-events-list-live, .pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view.active').empty();
        fixSportMenuOpeneds();
    }
    if (cgis.length > 0){
        var live_id = '',cgis_live = '';
        var index = 0;
        $.each(configSoftware.link_live, function(i,v){
            if(v == si && index == 0) {index++;live_id = i;}
            else if(v == si && index > 0) {index++;live_id += ','+i}
        });
        socket.send('{"opt":2,"lng":"'+configSoftware.language+'", "evti":0, "si":0, "sil":['+live_id+'], "cil":[], "ski": '+configSoftware.site_id+'}');
    }
    if (cils.length > 0){
        $.ajax({
            url: configSoftware.service_p,
            method: "POST",
            dataType: 'json',
            data: {
                'operationtype': 4001,
                'info': JSON.stringify({
                    "siteid": configSoftware.site_id,
                    "sessionId": localStorage.getItem('ACTSESS'),
                    "systemCode": configSoftware.sys_code,
                    'ti': $('.pos-sport-menu-time-selector .pos-sport-menu-time-selector-item.active').attr('data-tid'),
                    'lng': configSoftware.language,
                    "cil": cils,
                    "opt": 1,
                    "si": si
                })
            },
            success: function (data) {
                if (data.operationMessage == 'success') {
                    var json = JSON.parse(data.info);
                    //console.debug('Events list', json);
                    prepareEventsList(json);
                    if (cgis.length > 0){
                        var live_id = '',cgis_live = '';
                        var index = 0;
                        $.each(configSoftware.link_live, function(i,v){
                            if(v == si && index == 0) {index++;live_id = i;}
                            else if(v == si && index > 0) {index++;live_id += ','+i}
                        });
                        socket.send('{"opt":2,"lng":"'+configSoftware.language+'", "evti":0, "si":0, "sil":['+live_id+'], "cil":[], "ski": '+configSoftware.site_id+'}');
                    }
                } else {
                    if (data.operationId == -25) {
                        logoutClient();
                    } else {
                        createAlertMessage('error', data.operationMessage);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                createAlertMessage('error', 'Service unavailable');
            }
        });
    }
}

function prepareEventsList(data){
    var eventsList = [];
    $.each(data, function(i,v){
        $.each(v.eventList, function(ie,ve){
            ve.sn = v.sn;
            ve['cgen'] = v.cgen;
            ve['cgi'] = v.cgi;
            ve['cgn'] = v.cgn;
            ve['ci'] = v.ci;
            ve['cn'] = v.cn;
            eventsList.push(ve);
        });
    });
    eventsList.sort((a, b) => a.sd - b.sd);

    //console.debug('Events list', eventsList);

    $('.pos-content-events-view .pos-sport-events-view-optlst.active .pos-sport-events-list-prematch, .pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view.active').empty();

    //create events list
    var types_added = [];
    if($('body').width() < 1100){
        var allowed_types = [
            104, //soccer
            261, //tennis
            109, //basket
            1028, //f1
            170, //icehockey
            203, //pallavollo
            175, //handball
            201, //rugby
            309, //table tennis
            316, //baseball
            159, //Football Americano
            1033, //ufc
            248, //boxing
            216, //calcio a5
            251, //cricket
            429, //squash
        ];
    }else{
        var allowed_types = [
            104,149,1164, //soccer
            261,1947, //tennis
            109, //basket
            1028,1125,1126, //f1
            170, //icehockey
            203,202, //pallavollo
            175,210,211, //handball
            201,205, //rugby
            309, //table tennis
            316, //baseball
            159,166, //Football Americano
            1033, //ufc
            248, //boxing
            216, //calcio a5
            251, //cricket
            429, //squash
        ];
    }
    var codds_global = 0;
    $.each(eventsList, function(i,v){
        if(v.evtn.indexOf('-') !== -1){
            var splitEventName = v.evtn.split('-');
            splitEventName = '<div class="pos-sport-event-item-view-details-name-team">'+splitEventName[0]+'</div><div class="pos-sport-event-item-view-details-name-spliter"> : </div><div class="pos-sport-event-item-view-details-name-team">'+splitEventName[1]+'</div>';
        }else{
            var splitEventName = '<div class="pos-sport-event-item-view-details-name-team fullw">'+v.evtn+'</div>';
        }
        var time = new Date(v.sd);
        var hourFixZero = (time.getHours().toString().length == 1 ? '0'+time.getHours() : time.getHours());
        var minuteFixZero = (time.getMinutes().toString().length == 1 ? '0'+time.getMinutes() : time.getMinutes());
        var stringTime = hourFixZero + ":" + minuteFixZero;
        var monthFix = (time.getMonth()+1);
        var dayFix = time.getDate();
        var html_odds_event = '';
        $.each(v.oddsTypeList, function(iot, vot){
            if(types_added.indexOf(vot.oddti) === -1 && allowed_types.indexOf(vot.oddti) !== -1){
                types_added.push(vot.oddti);
                if(vot.oddti == 8) {
                    codds_global++;
                }
                codds_global = (codds_global+vot.oddsList.length);
            }
            if(allowed_types.indexOf(vot.oddti) !== -1){
                var odds_html = '';
                if(vot.oddti == 8) {
                    odds_html += '<div class="pos-subhead-oddscnt-view-odds-lbln handicap">'+(vot.ha == 0 ? '-' : vot.ha)+'</div>';
                }
                $.each(vot.oddsList, function(iod, vod){
                    var $clickQuote = "";
                    var valueQuote;
                    if(vod.vl == '-1'){
                        valueQuote = '<i class="fa fa-lock" aria-hidden="true"></i>';
                    }else if(vod.vl == 1 || vod.vl < 1){
                        valueQuote = '-';
                    }else{
                        $clickQuote = "clickOdd(this, '"+v.ci+"', '"+(v.evtc != 0 ? v.evtc : v.evti)+"', '"+vot.oddti+"', '"+vod.oddi+"', '"+resolveUnknownCharsName(v.evtn)+"', '"+v.cn+"', '"+vot.oddtn+"', '"+vod.oddn+"', '"+vod.ha+"', '"+v.sd+"', 1)";
                        valueQuote = vod.vl;
                    }
                    odds_html += '<div onclick="'+$clickQuote+'"  data-oddid="'+vod.oddi+'" data-oddval="'+vod.vl+'" class="pos-subhead-oddscnt-view-odds-lbln '+(vod.vl == 0 ? 'oddlocked' : '')+'">'+(vod.vl == 0 ? '<i class="fa fa-lock" aria-hidden="true"></i>' : vod.vl)+'</div>';
                });
                html_odds_event += '<div class="pos-subhead-oddscnt-view-oddgroup"><div class="pos-subhead-oddscnt-view-odds-list">'+odds_html+'</div></div>';
            }
        });
        $('.pos-content-events-view .pos-sport-events-view-optlst[data-sid="'+v.si+'"] .pos-sport-events-list-prematch').append('<div data-event-id="'+v.evti+'" data-cil="'+v.ci+'" data-sid="'+v.si+'" class="pos-sport-event-item-view"><div class="pos-sport-event-item-view-datetime">'+stringTime+'<br />'+dayFix+'/'+monthFix+'</div><div class="pos-sport-event-item-view-details" style="width: calc(100% - 75px - 55px - '+(codds_global*50)+'px)"><div class="pos-sport-event-item-view-details-score">-:-</div><div class="pos-sport-event-item-view-details-name">'+splitEventName+'</div><div class="pos-sport-event-item-view-details-league">'+v.cn+', '+v.cgen+'</div></div><div class="pos-sport-event-item-view-odds" style="width: '+(codds_global*50)+'px;">'+html_odds_event+'</div><div class="pos-sport-event-item-view-moddsv"><i class="fa fa-plus" aria-hidden="true"></i></div></div>');
    });
    //create subhead odds
    types_added = [];
    $.each(eventsList, function(i,v){

        $.each(v.oddsTypeList, function(iot, vot){
            if(types_added.indexOf(vot.oddti) === -1 && allowed_types.indexOf(vot.oddti) !== -1){
                types_added.push(vot.oddti);
                var odds_html = '';
                var codds = 0;
                if(vot.oddti == 8) {
                    codds++;
                    odds_html += '<div class="pos-subhead-oddscnt-view-odds-lbln">&nbsp;</div>';
                }
                codds = (codds+vot.oddsList.length);
                $.each(vot.oddsList, function(iod, vod){
                    odds_html += '<div class="pos-subhead-oddscnt-view-odds-lbln">'+vod.oddn+'</div>';
                });
                if(!$('.pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view[data-sid="'+v.si+'"] .pos-subhead-oddscnt-view-oddgroup[data-oddti="'+vot.oddti+'"]').length) $('.pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view[data-sid="'+v.si+'"]').append('<div class="pos-subhead-oddscnt-view-oddgroup" data-oddti="'+vot.oddti+'"><div class="pos-subhead-oddscnt-view-oddtiname">'+vot.oddtn+'</div><div class="pos-subhead-oddscnt-view-odds-list">'+odds_html+'</div></div>');
            }
        });
    });

    fixSportMenuOpeneds();
}

function prepareEventsListLive(data){
    //console.debug('SM Live Events', data);
    $('.pos-content-events-view .pos-sport-events-view-optlst.active .pos-sport-events-list-live').empty();

    var fixed_categs = [];
    $.each(data, function(i,v){
        v.cn = replaceAll(v.cn, "Stati Uniti", "USA");
        v.cgn = replaceAll(v.cgn, "US Major League Soccer", "MLS");
        v.cgn = replaceAll(v.cgn, "USA United Soccer League", "USL Championship");
        fixed_categs.push(v);
    });
    data = fixed_categs;
    fixed_categs = [];

    var cgis = [];
    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst.active > ul > li > ul > li.pos-opened-coi').each(function () {
        if(typeof $(this).attr('data-live') !== 'undefined'){
            if (cgis.indexOf(parseInt($(this).attr('data-live'))) === -1) cgis.push(parseInt($(this).attr('data-live')));
        }
    });

    var header_width = 0;
    $('.pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view.active .pos-subhead-oddscnt-view-oddgroup').each(function(){
        header_width = (header_width+$(this).width());
    });

    var types_added = [];
    var allowed_types = [
        10278, //soccer
        //tennis
        //basket
        //f1
        //icehockey
        //pallavollo
        //handball
        //rugby
        //table tennis
        10208, //baseball
        //Football Americano
        //ufc
        //boxing
        //calcio a5
        //cricket
        //squash
    ];
    if(header_width == 0){
        $.each(data, function(i,v){
            $.each(v.odtl, function(iot, vot){
                if(types_added.indexOf(vot.otei) === -1 && allowed_types.indexOf(vot.otei) !== -1){
                    types_added.push(vot.otei);
                    var odds_html = '';
                    var codds = 0;
                    if(vot.otei == 8) {
                        codds++;
                        odds_html += '<div class="pos-subhead-oddscnt-view-odds-lbln">&nbsp;</div>';
                    }
                    codds = (codds+vot.oil.length);
                    $.each(vot.oil, function(iod, vod){
                        odds_html += '<div class="pos-subhead-oddscnt-view-odds-lbln">'+vod.on+'</div>';
                    });
                    if(!$('.pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view[data-sid="'+configSoftware.link_live[v.si]+'"] .pos-subhead-oddscnt-view-oddgroup[data-oddti="'+vot.otei+'"]').length)  $('.pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view[data-sid="'+configSoftware.link_live[v.si]+'"]').append('<div class="pos-subhead-oddscnt-view-oddgroup" data-oddti="'+vot.otei+'"><div class="pos-subhead-oddscnt-view-oddtiname">'+vot.otn+'</div><div class="pos-subhead-oddscnt-view-odds-list">'+odds_html+'</div></div>');
                }
            });
        });
    }

    if(header_width == 0){
        $('.pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view.active .pos-subhead-oddscnt-view-oddgroup').each(function(){
            header_width = (header_width+$(this).width());
        });
    }

    //create events list
    types_added = [];
    var codds_global = 0;
    $.each(data, function(i,v){
        if(cgis.indexOf(v.cgi) !== -1){
            if(v.mn.indexOf(' v ') !== -1){
                var splitEventName = v.mn.split(' v ');
                splitEventName = '<div class="pos-sport-event-item-view-details-name-team">'+splitEventName[0]+'</div><div class="pos-sport-event-item-view-details-name-spliter"> : </div><div class="pos-sport-event-item-view-details-name-team">'+splitEventName[1]+'</div>';
            }else{
                var splitEventName = '<div class="pos-sport-event-item-view-details-name-team fullw">'+v.mn+'</div>';
            }
            var time = new Date(v.smt);
            var hourFixZero = (time.getHours().toString().length == 1 ? '0'+time.getHours() : time.getHours());
            var minuteFixZero = (time.getMinutes().toString().length == 1 ? '0'+time.getMinutes() : time.getMinutes());
            var stringTime = hourFixZero + ":" + minuteFixZero;
            var monthFix = (time.getMonth()+1);
            var dayFix = time.getDate();
            var html_odds_event = '';
            var localcodds = 0;
            $.each(v.odtl, function(iot, vot){
                if(types_added.indexOf(vot.otei) === -1 && allowed_types.indexOf(vot.otei) !== -1){
                    types_added.push(vot.otei);
                    codds_global = (codds_global+vot.oil.length);
                }
                if(allowed_types.indexOf(vot.otei) !== -1){
                    localcodds = (localcodds+vot.oil.length);
                    var odds_html = '';
                    $.each(vot.oil, function(iod, vod){
                        var $clickQuote = "";
                        var valueQuote;
                        if(vod.vl == '-1'){
                            valueQuote = '<i class="fa fa-lock" aria-hidden="true"></i>';
                        }else if(vod.vl == 1 || vod.vl < 1){
                            valueQuote = '-';
                        }else{
                            $clickQuote = "clickOdd(this, '"+v.ci+"', '"+v.mid+"', '"+vot.oti+"', '"+vod.oi+"', '"+resolveUnknownCharsName(v.mn)+"', '"+v.cn+"', '"+vot.otn+"', '"+vod.on+"', '"+vod.ha+"', '"+v.smt+"', 2)";
                            valueQuote = vod.vl;
                        }
                        odds_html += '<div onclick="'+$clickQuote+'" data-oddid="'+vod.oi+'" data-oddval="'+vod.ov+'" class="oddBtnSelector pos-subhead-oddscnt-view-odds-lbln '+(vod.ov == 0 ? 'oddlocked' : '')+'">'+(vod.ov == 0 ? '<i class="fa fa-lock" aria-hidden="true"></i>' : vod.ov)+'</div>';
                    });
                    html_odds_event += '<div class="pos-subhead-oddscnt-view-oddgroup"><div class="pos-subhead-oddscnt-view-odds-list">'+odds_html+'</div></div>';
                }
            });
            if((localcodds*50) < header_width){
                html_odds_event += '<div class="all-odds-locked" style="width: '+(header_width-(localcodds*50))+'px;"><i class="fa fa-lock" aria-hidden="true"></i></div>';
            }
            $('.pos-content-events-view .pos-sport-events-view-optlst[data-sid="'+configSoftware.link_live[v.si]+'"] .pos-sport-events-list-live').append('<div data-event-id="'+v.mid+'" class="pos-sport-event-item-view pos-item-live-event"><div class="pos-sport-event-item-view-datetime">'+stringTime+'<br />'+dayFix+'/'+monthFix+'</div><div class="pos-sport-event-item-view-details" style="width: calc(100% - 75px - 55px - '+header_width+'px)"><div class="pos-sport-event-item-view-details-score">'+v.ms.replace('-', ':')+'</div><div class="pos-sport-event-item-view-details-name">'+splitEventName+'</div><div class="pos-sport-event-item-view-details-league">'+v.cgn+', '+v.cn+'</div><div class="pos-sport-event-item-view-details-actualtime">'+v.st+'</div></div><div class="pos-sport-event-item-view-odds" style="width: '+header_width+'px;">'+html_odds_event+'</div><div class="pos-sport-event-item-view-moddsv"><i class="fa fa-plus" aria-hidden="true"></i></div></div>');
        }
    });
    fixSportMenuOpeneds();
}

function fixSportMenuOpeneds(){
    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst > ul > li > ul').each(function(){
        var total_elements = $(this).find('li').length;
        var elements_opened = $(this).find('li.pos-opened-coi').length;
        if(total_elements == elements_opened){
            $(this).parent().addClass('pos-opened-ci');
        }else{
            if($(this).parent().hasClass('pos-opened-ci')) $(this).parent().removeClass('pos-opened-ci');
        }
    });
    rTicketFuncs.selectedCouponOdds();
}

function openEventViewer(mid){
    if($('.pos-sport-event-item-view[data-event-id="'+mid+'"]').hasClass('pos-item-live-event')){
        if(!$('body').hasClass('event-view')) $('body').addClass('event-view');
        $('.pos-content-events-view').removeClass('active');
        $('.pos-content-event-view').addClass('active');
        socket.send('{"opt":3, "lng": "'+configSoftware.language+'", "evti":'+mid+',"evtil":[null], "ski": '+configSoftware.site_id+'}');
        if(!$('.pos-content-event-view .pos-content-event-list').hasClass('liveEventView')) $('.pos-content-event-view .pos-content-event-list').addClass('liveEventView');
    }else{
        if(!$('body').hasClass('event-view')) $('body').addClass('event-view');
        $.ajax({
            url: configSoftware.service_p,
            method: "POST",
            dataType: 'json',
            data: {
                'operationtype': 4001,
                'info': JSON.stringify({
                    "siteid": configSoftware.site_id,
                    "sessionId": localStorage.getItem('ACTSESS'),
                    "systemCode": configSoftware.sys_code,
                    'ti': $('.pos-sport-menu-time-selector .pos-sport-menu-time-selector-item.active').attr('data-tid'),
                    'lng': configSoftware.language,
                    "cil": [parseInt($('.pos-sport-event-item-view[data-event-id="'+mid+'"]').attr('data-cil'))],
                    "opt": 2,
                    "evti": parseInt(mid),
                    "si": parseInt($('.pos-sport-event-item-view[data-event-id="'+mid+'"]').attr('data-sid'))
                })
            },
            success: function (data) {
                if (data.operationMessage == 'success') {
                    var json = JSON.parse(data.info);
                    $('.pos-content-events-view').removeClass('active');
                    $('.pos-content-event-view').addClass('active');
                    generateHtmlEventView(json);
                } else {
                    if (data.operationId == -25) {
                        logoutClient();
                    } else {
                        createAlertMessage('error', data.operationMessage);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                createAlertMessage('error', 'Service unavailable');
            }
        });
        if($('.pos-content-event-view .pos-content-event-list').hasClass('liveEventView')) $('.pos-content-event-view .pos-content-event-list').removeClass('liveEventView');
    }
}

function loadOddGroupOdds(mid, grid){
    $.ajax({
        url: configSoftware.service_p,
        method: "POST",
        dataType: 'json',
        data: {
            'operationtype': 4001,
            'info': JSON.stringify({
                "siteid": configSoftware.site_id,
                "sessionId": localStorage.getItem('ACTSESS'),
                "systemCode": configSoftware.sys_code,
                'ti': $('.pos-sport-menu-time-selector .pos-sport-menu-time-selector-item.active').attr('data-tid'),
                'lng': configSoftware.language,
                "cil": [parseInt($('.pos-sport-event-item-view[data-event-id="'+mid+'"]').attr('data-cil'))],
                "opt": 2,
                "evti": parseInt(mid),
                "si": parseInt($('.pos-sport-event-item-view[data-event-id="'+mid+'"]').attr('data-sid')),
                "ogrp": grid
            })
        },
        success: function (data) {
            if (data.operationMessage == 'success') {
                var data = JSON.parse(data.info);
                var html_list_odds = '';
                $.each(data[0].eventList[0].oddsTypeList, function(iod, vod){
                    var odds_items = '';
                    $.each(vod.oddsList, function(io, vo){
                        var $clickQuote = "";
                        var valueQuote;
                        if(vo.vl == '-1'){
                            valueQuote = '<i class="fa fa-lock" aria-hidden="true"></i>';
                        }else if(vo.vl == 1 || vo.vl < 1){
                            valueQuote = '-';
                        }else{
                            $clickQuote = "clickOdd(this, '"+data[0].ci+"', '"+(data[0].eventList[0].evtc != 0 ? data[0].eventList[0].evtc : data[0].eventList[0].evti)+"', '"+vod.oddti+"', '"+vo.oddi+"', '"+resolveUnknownCharsName(data[0].eventList[0].evtn)+"', '"+data[0].cn+"', '"+vod.oddtn+"', '"+vo.oddn+"', '"+vo.ha+"', '"+data[0].eventList[0].sd+"', 1)";
                            valueQuote = vo.vl;
                        }
                        odds_items += '<div onclick="'+$clickQuote+'" data-oddid="'+vo.oddi+'" data-oddval="'+vo.vl+'" class="oddBtnSelector pos-event-odd-item-quote '+(vo.vl == 0 ? 'oddlocked' : '')+'" style="width: '+(vod.oddsList.length > 5 ? '33.333332' : (100/vod.oddsList.length))+'%;"><div class="pos-event-odd-item-quote-name">'+vo.oddn+'</div><span>'+(vo.vl == 0 ? '<i class="fa fa-lock" aria-hidden="true"></i>' : vo.vl)+'</span></div>';
                    });
                    html_list_odds += '<div class="pos-event-odd-group-item-list"><div class="pos-event-odd-group-name"><i class="fa fa-info-circle" aria-hidden="true"></i> '+vod.oddtn+'</div><div class="pos-event-odd-group-oddsgp">'+odds_items+'</div></div>';
                });
                $('.pos-event-odd-group-tab-content[data-tab="'+grid+'"]').html(html_list_odds);
                rTicketFuncs.selectedCouponOdds();
            } else {
                if (data.operationId == -25) {
                    logoutClient();
                } else {
                    createAlertMessage('error', data.operationMessage);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            createAlertMessage('error', 'Service unavailable');
        }
    });
}

function generateHtmlEventView(data){
    //console.debug("Event details", data);
    var splitName = data[0].eventList[0].evtn.split('-');
    var time = new Date(data[0].eventList[0].sd);
    var hourFixZero = (time.getHours().toString().length == 1 ? '0'+time.getHours() : time.getHours());
    var minuteFixZero = (time.getMinutes().toString().length == 1 ? '0'+time.getMinutes() : time.getMinutes());
    var stringTime = hourFixZero + ":" + minuteFixZero;
    var monthFix = (time.getMonth()+1);
    var dayFix = time.getDate();
    var html_list_odds = '';
    $.each(data[0].eventList[0].oddsTypeList, function(iod, vod){
        var odds_items = '';
        $.each(vod.oddsList, function(io, vo){
            var $clickQuote = "";
            var valueQuote;
            if(vo.vl == '-1'){
                valueQuote = '<i class="fa fa-lock" aria-hidden="true"></i>';
            }else if(vo.vl == 1 || vo.vl < 1){
                valueQuote = '-';
            }else{
                $clickQuote = "clickOdd(this, '"+data[0].ci+"', '"+(data[0].eventList[0].evtc != 0 ? data[0].eventList[0].evtc : data[0].eventList[0].evti)+"', '"+vod.oddti+"', '"+vo.oddi+"', '"+resolveUnknownCharsName(data[0].eventList[0].evtn)+"', '"+data[0].cn+"', '"+vod.oddtn+"', '"+vo.oddn+"', '"+vo.ha+"', '"+data[0].eventList[0].sd+"', 1)";
                valueQuote = vo.vl;
            }
            odds_items += '<div onclick="'+$clickQuote+'" data-oddid="'+vo.oddi+'" data-oddval="'+vo.vl+'" class="oddBtnSelector pos-event-odd-item-quote '+(vo.vl == 0 ? 'oddlocked' : '')+'" style="width: '+(vod.oddsList.length > 5 ? '33.333332' : (100/vod.oddsList.length))+'%;"><div class="pos-event-odd-item-quote-name">'+vo.oddn+'</div><span>'+(vo.vl == 0 ? '<i class="fa fa-lock" aria-hidden="true"></i>' : vo.vl)+'</span></div>';
        });
        html_list_odds += '<div class="pos-event-odd-group-item-list"><div class="pos-event-odd-group-name"><i class="fa fa-info-circle" aria-hidden="true"></i> '+vod.oddtn+'</div><div class="pos-event-odd-group-oddsgp">'+odds_items+'</div></div>';
    });
    var tabs_ogs = '', contents_ogs = '';
    $.each(data[0].oddsGroupList, function(ig,iv){
        tabs_ogs += '<div class="pos-event-odds-groups-tabs-item" data-tab="'+iv.gi+'" onclick="loadOddGroupOdds('+data[0].eventList[0].evti+', '+iv.gi+')">'+iv.gn+'</div>';
        contents_ogs += '<div class="pos-event-odd-group-tab-content" data-tab="'+iv.gi+'"></div>';
    });
    $('.pos-content-event-view .pos-content-event-list').html('<div class="pos-event-details-head"><div class="pos-event-details-tophead"><div class="pos-event-details-tophead-team-logo-home"><img src="assets/imgs/HOME_TEAM1.png" /></div><div class="pos-event-details-tophead-timeinfo">'+monthFix+'/'+dayFix+' '+stringTime+'</div><div class="pos-event-details-tophead-league">'+data[0].cgn+', '+data[0].cn+'</div><div class="pos-event-details-tophead-team-logo-away"><img src="assets/imgs/HOME_TEAM2.png" /></div><div class="pos-event-details-tophead-scoredetails"><div class="pos-event-details-tophead-scoredetails-team">'+splitName[0]+'</div><div class="pos-event-details-tophead-scoredetails-spliter">-:-</div><div class="pos-event-details-tophead-scoredetails-team">'+splitName[1]+'</div></div></div><div class="pos-event-details-subhead"><div class="pos-event-details-prev-event"><i class="fa fa-angle-left" aria-hidden="true"></i></div><div class="pos-event-details-next-event"><i class="fa fa-angle-right" aria-hidden="true"></i></div></div></div><div class="pos-event-odds-groups-tabs"><div class="pos-event-odds-groups-tabs-item active" data-tab="all">All <span>'+data[0].eventList[0].oddsTypeList.length+'</span></div>'+tabs_ogs+'</div><div class="pos-event-odd-group-tab-content active" data-tab="all">'+html_list_odds+'</div>'+contents_ogs)
}

function generateHtmlEventViewLive(data){
    //console.debug("Event details", data);
    var v = data;
    var splitName = data.mn.split(' v ');
    var html_list_odds = '';
    $.each(v.odtl, function(iod, vod){
        var odds_items = '';
        $.each(vod.oil, function(io, vo){
            var $clickQuote = "";
            var valueQuote;
            if(vo.vl == '-1'){
                valueQuote = '<i class="fa fa-lock" aria-hidden="true"></i>';
            }else if(vo.vl == 1 || vo.vl < 1){
                valueQuote = '-';
            }else{
                $clickQuote = "clickOdd(this, '"+v.ci+"', '"+v.mid+"', '"+vod.oti+"', '"+vo.oi+"', '"+resolveUnknownCharsName(v.mn)+"', '"+v.cn+"', '"+vod.otn+"', '"+vo.on+"', '"+vo.ha+"', '"+v.smt+"', 2)";
                valueQuote = vo.vl;
            }
            odds_items += '<div onclick="'+$clickQuote+'" data-oddid="'+vo.oi+'" data-oddval="'+vo.ov+'" class="oddBtnSelector pos-event-odd-item-quote '+(vo.ov == 0 ? 'oddlocked' : '')+'" style="width: '+(vod.oil.length > 5 ? '33.333332' : (100/vod.oil.length))+'%;"><div class="pos-event-odd-item-quote-name">'+vo.on+'</div><span>'+(vo.ov == 0 ? '<i class="fa fa-lock" aria-hidden="true"></i>' : vo.ov)+'</span></div>';
        });
        html_list_odds += '<div class="pos-event-odd-group-item-list"><div class="pos-event-odd-group-name"><i class="fa fa-info-circle" aria-hidden="true"></i> '+vod.otn+'</div><div class="pos-event-odd-group-oddsgp">'+odds_items+'</div></div>';
    });
    $('.pos-content-event-view .pos-content-event-list').html('<div class="pos-event-details-head"><div class="pos-event-details-tophead"><div class="pos-event-details-tophead-team-logo-home"><img src="assets/imgs/HOME_TEAM1.png" /></div><div class="pos-event-details-tophead-timeinfo">'+v.mt+'\'</div><div class="pos-event-details-tophead-league">'+v.cgn+', '+v.cn+'</div><div class="pos-event-details-tophead-team-logo-away"><img src="assets/imgs/HOME_TEAM2.png" /></div><div class="pos-event-details-tophead-scoredetails"><div class="pos-event-details-tophead-scoredetails-team">'+splitName[0]+'</div><div class="pos-event-details-tophead-scoredetails-spliter">'+v.ms.replace('-', ':')+'</div><div class="pos-event-details-tophead-scoredetails-team">'+splitName[1]+'</div></div></div><div class="pos-event-details-subhead"><div class="pos-event-details-prev-event"><i class="fa fa-angle-left" aria-hidden="true"></i></div><div class="pos-tracker-content"></div><div class="pos-event-details-next-event"><i class="fa fa-angle-right" aria-hidden="true"></i></div></div></div><div class="pos-event-odds-groups-tabs"><div class="pos-event-odds-groups-tabs-item active" data-tab="all">All <span>'+v.odtl.length+'</span></div></div><div class="pos-event-odd-group-tab-content active" data-tab="all">'+html_list_odds+'</div>')
    rTicketFuncs.selectedCouponOdds();

    SCDN.init({
        lang: configSoftware.language,
        match_id: v.mid,
        container: '.pos-tracker-content'
    });
    SCDN.settings.isLogged = true;
}

function updateMatchLiveDetails(data){
    console.debug("Event details update", data);
    var v = data;
    $('.pos-event-details-head .pos-event-details-tophead .pos-event-details-tophead-timeinfo').html(v.mt+'\'');
    $('.pos-event-details-tophead-scoredetails .pos-event-details-tophead-scoredetails-spliter').html(v.ms.replace('-', ':'));
    $.each(v.odtl, function(iot,vot){
        $.each(vot.oil, function(io,vo){
            if($('.oddBtnSelector[data-oddid="'+vo.oi+'"]').hasClass('oddlocked')){
                $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').removeClass('oddlocked');
            }
            if(vo.ov > 0){
                var actual_value = parseFloat($('.oddBtnSelector[data-oddid="'+vo.oi+'"]').attr('data-oddval'));
                if(vo.ov > actual_value){
                    if($('.oddBtnSelector[data-oddid="'+vo.oi+'"] span').find('div').length){
                        $('.oddBtnSelector[data-oddid="'+vo.oi+'"] span').find('div').remove();
                    }
                    $('.oddBtnSelector[data-oddid="'+vo.oi+'"] span').html(vo.ov+'<div class="odd-up-indicator"></div>');
                }else if(actual_value < vo.ov){
                    if($('.oddBtnSelector[data-oddid="'+vo.oi+'"] span').find('div').length){
                        $('.oddBtnSelector[data-oddid="'+vo.oi+'"] span').find('div').remove();
                    }
                    $('.oddBtnSelector[data-oddid="'+vo.oi+'"] span').html(vo.ov+'<div class="odd-down-indicator"></div>');
                }
                $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').attr('data-oddval', vo.ov);
            }else{
                if(!$('.oddBtnSelector[data-oddid="'+vo.oi+'"]').hasClass('oddlocked')){
                    $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').addClass('oddlocked');
                    $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').attr('data-oddval', vo.ov);
                    $('.oddBtnSelector[data-oddid="'+vo.oi+'"] span').html('<i class="fa fa-lock" aria-hidden="true"></i>');
                }
            }
        });
    });
    clearTimeout(timeoutClearOddsIndicators);
    timeoutClearOddsIndicators = setTimeout(function(){
        $('.odd-down-indicator, .odd-up-indicator').remove();
    }, 3000);
    rTicketFuncs.selectedCouponOdds();
}

function generateHtmlSportIcon(id){
    var html = '<span class="pos-beticons specials"></span>';
    if(id == 1) html = '<span class="pos-beticons soccer"></span>';
    else if(id == 2) html = '<span class="pos-beticons basketball"></span>';
    else if(id == 3) html = '<span class="pos-beticons ice-hockey"></span>';
    else if(id == 4) html = '<span class="pos-beticons tennis"></span>';
    else if(id == 7) html = '<span class="pos-beticons handball"></span>';
    else if(id == 12) html = '<span class="pos-beticons boxing"></span>';
    else if(id == 17) html = '<span class="pos-beticons volleyball"></span>';
    else if(id == 8) html = '<span class="pos-beticons american-football"></span>';
    else if(id == 14) html = '<span class="pos-beticons table-tennis"></span>';
    else if(id == 15) html = '<span class="pos-beticons rugby"></span>';
    else if(id == 11) html = '<span class="pos-beticons darts"></span>';
    else if(id == 21) html = '<span class="pos-beticons baseball"></span>';
    else if(id == 24) html = '<span class="pos-beticons futsal"></span>';
    else if(id == 39) html = '<span class="pos-beticons soccer-special"></span>';
    else if(id == 55) html = '<span class="pos-beticons mma"></span>';
    else if(id == 53 || id == 89) html = '<span class="pos-beticons motorsport"></span>';
    return html;
}

function generateHtmlSportIconScores(id){
    var html = '<span class="pos-beticons specials"></span>';
    if(id == 1) html = '<span class="pos-beticons soccer"></span>';
    else if(id == 3) html = '<span class="pos-beticons basketball"></span>';
    else if(id == 2) html = '<span class="pos-beticons ice-hockey"></span>';
    else if(id == 4) html = '<span class="pos-beticons tennis"></span>';
    else if(id == 5) html = '<span class="pos-beticons baseball"></span>';
    else if(id == 6) html = '<span class="pos-beticons volleyball"></span>';
    else if(id == 10) html = '<span class="pos-beticons table-tennis"></span>';
    return html;
}

function generateHtmlSportNameScores(id){
    var html = 'Unknown';
    if(id == 1) html = 'Soccer';
    else if(id == 3) html = 'Basketball';
    else if(id == 2) html = 'Ice Hockey';
    else if(id == 4) html = 'Tennis';
    else if(id == 5) html = 'Baseball';
    else if(id == 6) html = 'Volleyball';
    else if(id == 10) html = 'Table Tennis';
    return html;
}

function generateSportMenu(data){
    //count events
    var events_nr = [];
    $.each(data, function(i,v){
        events_nr[v.id] = ((typeof events_nr[v.id] === 'undefined' ? 0 : parseInt(events_nr[v.id]))+v.evt);
    });
    //sport options
    $('.pos-header-menu ul, .pos-sport-menu-list, .pos-content-events-list').empty();
    $.each(data, function(i,v){
        if(configSoftware.disable_sports.indexOf(v.id) === -1){
            if(!$('.pos-header-menu ul li[data-sid="'+v.id+'"]').length){
                if(i == 0){
                    $('.pos-subheader .pos-subhead-menu .pos-subhead-menu-uplbl').html(generateHtmlSportIcon(v.id)+' '+v.sn);
                }
                $('.pos-header-menu ul').append('<li class="pos-menu-opt-icon '+(i == 0 ? 'active' : '')+'" data-sid="'+v.id+'" data-sname="'+v.sn+'">\n' +
                    '                        <div class="pos-header-lbl-master">\n' +
                    '                            '+generateHtmlSportIcon(v.id)+'\n' +
                    '                            '+(specialSportsList.indexOf(v.id) === -1 ? '<span class="pos-header-lbl-live">0</span> ' : '')+''+events_nr[v.id]+'\n' +
                    '                        </div>\n' +
                    '                    </li>');
            }
            if(!$('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"]').length){
                $('.pos-content-sport-menu .pos-sport-menu-list').append('<div class="pos-sport-menu-optlst '+(i == 0 ? 'active' : '')+'" data-sid="'+v.id+'"><ul></ul></div>');
            }
            if(!$('.pos-content-events-list .pos-sport-events-view-optlst[data-sid="'+v.id+'"]').length){
                $('.pos-content-events-list').append('<div class="pos-sport-events-view-optlst '+(i == 0 ? 'active' : '')+'" data-sid="'+v.id+'"><div class="pos-sport-events-list-live"></div><div class="pos-sport-events-list-prematch"></div></div>');
            }
            if(!$('.pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view[data-sid="'+v.id+'"]').length){
                $('.pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt').append('<div class="pos-subhead-oddscnt-view '+(i == 0 ? 'active' : '')+'" data-sid="'+v.id+'"></div>');
            }
        }
    });
    //prepare lists
    $.each(data, function(i,v){
        if(configSoftware.disable_sports.indexOf(v.id) === -1){
            if(!$('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="'+v.cgi1+'"]').length){
                $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul').append('<li data-ci="'+v.cgi1+'"><div class="pos-btn-select-allin"></div><a class="citem '+v.cgn1+'" data-name="'+v.cgn1+'" href="javascript:void(0)"><i class="fa fa-angle-right" aria-hidden="true"></i> '+v.cgn1+' <span class="pos-sp-totalevts-live">0</span><span class="pos-sp-totalevts">'+v.evt+'</span></a><ul class="manimenu '+v.cgn1+'"></ul></li>');
            }else{
                var countEvts = parseInt($('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="'+v.cgi1+'"] > a > span.pos-sp-totalevts').html());
                $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="'+v.cgi1+'"] > a > span.pos-sp-totalevts').html((countEvts+v.evt));
            }
        }
    });
    $.each(data, function(i,v){
        if(configSoftware.disable_sports.indexOf(v.id) === -1){
            v.coll = (v.cn != '' && v.cn != null)?v.cn:v.cen;
            if(v.coll == '-'){
                if(!$('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="'+v.cgi1+'"] > ul > li[data-coi="'+v.ci+'"]').length){
                    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="'+v.cgi1+'"] > ul').append('<li data-coi="'+v.ci+'" data-sid="'+v.id+'" data-coll="'+v.coll+'"><a class="fmitem">'+v.coll+'&nbsp;<span class="pos-sp-totalevts-live">0</span><span class="pos-sp-totalevts">'+v.evt+'</span></a></li>');
                }
            }else{
                if(!$('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="'+v.cgi1+'"] > ul > li[data-coll="'+v.coll+'"]').length){
                    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="'+v.cgi1+'"] > ul').append('<li data-coi="'+v.ci+'" data-sid="'+v.id+'" data-coll="'+v.coll+'"><a class="fmitem">'+v.coll+'&nbsp;<span class="pos-sp-totalevts-live">0</span><span class="pos-sp-totalevts">'+v.evt+'</span></a></li>');
                }else{
                    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="'+v.cgi1+'"] > ul > li[data-coll="'+v.coll+'"]').attr('data-coi', $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="'+v.cgi1+'"] > ul > li[data-coll="'+v.coll+'"]').attr('data-coi')+','+v.ci)
                }
            }
        }
    });
    //create favorite list
    $.each(data, function(i,v){
        if(configSoftware.disable_sports.indexOf(v.id) === -1){
            if(typeof configSoftware.favorites[v.id] !== 'undefined' && configSoftware.favorites[v.id].indexOf(v.coi) !== -1){
                if(!$('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="favorites"]').length){
                    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul').prepend('<li class="pos-sp-menu-opened" data-ci="favorites"><div class="pos-btn-select-allin"></div><a class="citem favorites" href="javascript:void(0)"><i class="fa fa-angle-right" aria-hidden="true"></i> Preferiti <span class="pos-sp-totalevts-live">0</span><span class="pos-sp-totalevts">'+v.evt+'</span></a><ul class="manimenu favorites"></ul></li>');
                }else{
                    var countEvts = parseInt($('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="favorites"] > a > span.pos-sp-totalevts').html());
                    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="favorites"] > a > span.pos-sp-totalevts').html((countEvts+v.evt));
                }
                v.coll = (v.cn != '' && v.cn != null)?v.cn:v.cen;
                if(!$('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="favorites"] > ul > li[data-coi="'+v.ci+'"]').length){
                    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="favorites"] > ul').append('<li data-coi="'+v.ci+'" data-sid="'+v.id+'" data-coll="'+v.coll+'"><a class="fmitem '+v.cgn1+'">'+v.coll+'&nbsp;<span class="pos-sp-totalevts-live">0</span><span class="pos-sp-totalevts">'+v.evt+'</span></a><ul></ul></li>');
                }else{
                    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="favorites"] > ul > li[data-coll="'+v.coll+'"]').attr('data-coi', $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+v.id+'"] > ul > li[data-ci="favorites"] > ul > li[data-coll="'+v.coll+'"]').attr('data-coi')+','+v.ci)
                }
            }
        }
    });
    //open default sport if exists
    if($('.pos-header .pos-header-menu ul li[data-sid="'+configSoftware.default_sport+'"]').length){
        $('.pos-header .pos-header-menu ul li[data-sid="'+configSoftware.default_sport+'"]').click();
    }

    socket.send('{"opt":1, "lng": "'+configSoftware.language+'", "ski": '+configSoftware.site_id+'}');
}

function addSportMenuLive(data){
    //console.debug("SM Live", data);

    var fixed_categs = [];
    $.each(data, function(i,v){
        v.cn = replaceAll(v.cn, "Stati Uniti", "USA");
        v.cn = replaceAll(v.cn, "Mondo", "Internazionali Club");
        v.cn = replaceAll(v.cn, "South Korea", "Corea del Sud");
        v.cgn = replaceAll(v.cgn, "US Major League Soccer", "MLS");
        v.cgn = replaceAll(v.cgn, "USA United Soccer League", "USL Championship");
        v.cgn = replaceAll(v.cgn, "Club Friendly", "Amichevoli Club");
        v.cgn = replaceAll(v.cgn, "South Korean K-League", "K-League 1");
        fixed_categs.push(v);
    });
    data = fixed_categs;
    fixed_categs = [];

    //set events nr live on menu
    $.each(data, function(i,v){
        var total_events = parseInt($('.pos-header .pos-header-menu ul li[data-sid="'+configSoftware.link_live[v.si]+'"] .pos-header-lbl-live').html());
        total_events++;
        $('.pos-header .pos-header-menu ul li[data-sid="'+configSoftware.link_live[v.si]+'"] .pos-header-lbl-live').html(total_events).show();
        if($('.pos-header .pos-header-menu ul li[data-sid="'+configSoftware.link_live[v.si]+'"]').hasClass('without-live-counter')){
            $(this).removeClass('without-live-counter');
        }
    });
    //set nr live on sport menu
    $.each(data, function(i,v){
        var finded = false;
        var mfinded = false;
        $('.pos-content .pos-content-sport-menu .pos-sport-menu-optlst[data-sid="'+configSoftware.link_live[v.si]+'"] > ul > li').each(function(){
            if(typeof $(this).find('a').attr('data-name') !== 'undefined'){
                if($(this).find('a').first().attr('data-name') == v.cn || $(this).find('a').first().attr('data-name').indexOf(v.cn) !== -1){
                    mfinded = true;
                    //console.debug('Finded', v.cn);
                    $(this).find('ul > li').each(function(){
                        if($(this).attr('data-coll') == v.cgn || $(this).attr('data-coll').indexOf(v.cgn) !== -1){
                            if(typeof $(this).attr('data-live') === 'undefined'){
                                $(this).attr('data-live', v.cgi);
                            }
                            finded = true;
                            var liveEventsNr = parseInt($(this).find('a > .pos-sp-totalevts-live').html());
                            liveEventsNr++;
                            $(this).find('a').first().find('.pos-sp-totalevts-live').html(liveEventsNr).show();
                        }
                    });
                    var liveEventsNr = parseInt($(this).find('a > .pos-sp-totalevts-live').html());
                    liveEventsNr++;
                    $(this).find('a').first().find('.pos-sp-totalevts-live').html(liveEventsNr).show();
                    if(!finded){
                        if(!$(this).find('ul > li[data-live="'+v.cgi+'"]').length){
                            $(this).find('ul').append('<li data-live="'+v.cgi+'" data-sid="'+configSoftware.link_live[v.si]+'" data-coll="'+v.cgn+'"><a class="fmitem">'+v.cgn+'&nbsp;<span class="pos-sp-totalevts-live" style="display: inline;">1</span><span class="pos-sp-totalevts">0</span></a></li>');
                        }else{
                            var actualEventsNr = parseInt($(this).find('ul > li[data-live="'+v.cgi+'"] .pos-sp-totalevts-live').text());
                            $(this).find('ul > li[data-live="'+v.cgi+'"] .pos-sp-totalevts-live').text((actualEventsNr+1));
                        }
                    }
                }
            }
        });
        if(!mfinded){
            if(!$('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+configSoftware.link_live[v.si]+'"] > ul > li[data-ci="'+v.ci+'"]').length){
                if($('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+configSoftware.link_live[v.si]+'"] > ul li[data-ci="favorites"]').length){
                    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+configSoftware.link_live[v.si]+'"] > ul li[data-ci="favorites"]').after('<li data-ci="'+v.ci+'"><div class="pos-btn-select-allin"></div><a class="citem '+v.cn+'" data-name="'+v.cn+'" href="javascript:void(0)"><i class="fa fa-angle-right" aria-hidden="true"></i> '+v.cn+' <span class="pos-sp-totalevts-live" style="display: inline;">1</span><span class="pos-sp-totalevts">0</span></a><ul class="manimenu '+v.cn+'"><li data-live="'+v.cgi+'" data-sid="'+configSoftware.link_live[v.si]+'" data-coll="'+v.cgn+'"><a class="fmitem">'+v.cgn+'&nbsp;<span class="pos-sp-totalevts-live" style="display: inline;">1</span><span class="pos-sp-totalevts">0</span></a></li></ul></li>');
                }else{
                    $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+configSoftware.link_live[v.si]+'"] > ul').prepend('<li data-ci="'+v.ci+'"><div class="pos-btn-select-allin"></div><a class="citem '+v.cn+'" data-name="'+v.cn+'" href="javascript:void(0)"><i class="fa fa-angle-right" aria-hidden="true"></i> '+v.cn+' <span class="pos-sp-totalevts-live" style="display: inline;">1</span><span class="pos-sp-totalevts">0</span></a><ul class="manimenu '+v.cn+'"><li data-live="'+v.cgi+'" data-sid="'+configSoftware.link_live[v.si]+'" data-coll="'+v.cgn+'"><a class="fmitem">'+v.cgn+'&nbsp;<span class="pos-sp-totalevts-live" style="display: inline;">1</span><span class="pos-sp-totalevts">0</span></a></li></ul></li>');
                }
            }else{
                var countEvts = parseInt($('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+configSoftware.link_live[v.si]+'"] > ul > li[data-ci="'+v.ci+'"] > a > span.pos-sp-totalevts-live').html());
                $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst[data-sid="'+configSoftware.link_live[v.si]+'"] > ul > li[data-ci="'+v.ci+'"] > a > span.pos-sp-totalevts-live').html((countEvts+v.evt));
            }
        }
    });
    //clear empty live sports
    $('.pos-header .pos-header-menu ul li').each(function(){
        if($(this).find('.pos-header-lbl-live').text() == '0') {
            $(this).find('.pos-header-lbl-live').hide();
            if(!$(this).hasClass('without-live-counter')){
                $(this).addClass('without-live-counter');
            }
        }
    });
    $('.pos-content .pos-content-sport-menu .pos-sport-menu-optlst > ul li').each(function(){
        if($(this).find('.pos-sp-totalevts-live').text() == '0') {
            $(this).find('.pos-sp-totalevts-live').hide();
        }
    });

    $('.pos-content .pos-content-sport-menu .pos-sport-menu-optlst.active > ul > li').each(function(){
        if($(this).find('.pos-sp-totalevts-live').is(':visible') && $(this).find('.pos-sp-totalevts-live').html() != '0'){
            $(this).find('.pos-btn-select-allin').click();
        }
    });
    rTicketFuncs.generateCoupon();
}

var timeoutClearOddsIndicators = null;
function updateOddsLive(data){
    //console.debug('ODD UPDATE', data);
    $.each(data, function(i,v){
        $.each(v.odtl, function(iot,vot){
            $.each(vot.oil, function(io,vo){
                if($('.oddBtnSelector[data-oddid="'+vo.oi+'"]').hasClass('oddlocked')){
                    $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').removeClass('oddlocked');
                }
                if(vo.ov > 0){
                    var actual_value = parseFloat($('.oddBtnSelector[data-oddid="'+vo.oi+'"]').attr('data-oddval'));
                    if(vo.ov > actual_value){
                        if($('.oddBtnSelector[data-oddid="'+vo.oi+'"]').find('div').length){
                            $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').find('div').remove();
                        }
                        $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').html(vo.ov+'<div class="odd-up-indicator"></div>');
                    }else if(actual_value < vo.ov){
                        if($('.oddBtnSelector[data-oddid="'+vo.oi+'"]').find('div').length){
                            $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').find('div').remove();
                        }
                        $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').html(vo.ov+'<div class="odd-down-indicator"></div>');
                    }
                    $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').attr('data-oddval', vo.ov);
                }else{
                    if(!$('.oddBtnSelector[data-oddid="'+vo.oi+'"]').hasClass('oddlocked')){
                        $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').addClass('oddlocked');
                        $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').attr('data-oddval', vo.ov);
                        $('.oddBtnSelector[data-oddid="'+vo.oi+'"]').html('<i class="fa fa-lock" aria-hidden="true"></i>');
                    }
                }
            });
        });
    });

    clearTimeout(timeoutClearOddsIndicators);
    timeoutClearOddsIndicators = setTimeout(function(){
        $('.odd-down-indicator, .odd-up-indicator').remove();
    }, 3000);
}

function loginClient(){
    $.ajax({
        url: 'https://jvs-serve.redline.click/?src='+btoa(configSoftware.service_h+'/login_check'),
        method: "POST",
        dataType: 'json',
        data: {
            '_username': $('#username').val(),
            '_password': CryptoJS.MD5($('#password').val()).toString(),
            'lang': configSoftware.language
        },
        success: function (data) {
            if (data.success == true) {
                localStorage.setItem('ACTSESS', data.session_id);
                localStorage.setItem('PHPSESS', data.php_session);
                localStorage.setItem('ACTUSER', $('#username').val());
                $('.pos-window-extra[data-name="login"]').hide();
                $('.button-pos-act[data-action="login-user"]').attr('onclick', '');
                $('.button-pos-act[data-action="login-user"] span').last().html($('#username').val());
                refreshClientCredit();
            } else {
                if (data.opId == -25) {
                    logoutClient()
                } else {
                    createAlertMessage('error', data.msg);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            createAlertMessage('error', 'Service unavailable');
        }
    });
}

function refreshClientCredit(){
    $.ajax({
        url: configSoftware.service_u,
        method: "POST",
        dataType: 'json',
        data: {
            'operationtype': 3003,
            'info': JSON.stringify({
                "siteid": configSoftware.site_id,
                "sessionId": localStorage.getItem('ACTSESS'),
                "systemCode": configSoftware.sys_code,
                'lng': configSoftware.language,
            })
        },
        success: function (data) {
            $('.button-pos-act[data-action="credit-user"] > span:nth-child(2)').text(data.credits)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            createAlertMessage('error', 'Service unavailable');
        }
    });
}

function logoutClient(){
    localStorage.removeItem('ACTSESS');
    localStorage.removeItem('ACTUSER');
    window.location.reload();
}

function statisticsScores(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    $.get('https://statistics.easybet.ng/live_score/'+day+'-'+(month < 10 ? '0'+month : month)+'-'+year, function(data){
        var sport_opened = 0;
        //create header menu
        if(data == null) return false;

        $.each(data.S, function(i,v){
            if(i == 0) {
                sport_opened = v.P;
                $('.pos-score-subhead-nav').html(generateHtmlSportNameScores(v.P));
            }
            if(!$('.pos-score-head-nav ul li[data-sid="'+v.P+'"]').length) $('.pos-score-head-nav ul').append('<li class="pos-menu-opt-icon '+(i == 0 ? 'active' : '')+'" data-sid="'+v.P+'" data-sname="'+generateHtmlSportNameScores(v.P)+'">\n' +
                '                        <div class="pos-header-lbl-master">\n' +
                '                            '+generateHtmlSportIconScores(v.P)+'\n' +
                '                        </div>\n' +
                '                    </li>');
            $.each(v.G, function(ei, ev){
                var date = new Date(ev.D*1000);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var formattedTime = hours + '.' + minutes.substr(-2);

                var statusEvent = '';
                if(ev.St == 3){
                    if(ev.St == 2) statusEvent = 'LIVE';
                    else if(ev.St == 3) statusEvent = 'FINISHED';
                    var scoreMatch = '0:0';
                    var scoreByTimes = '';
                    if(ev.St == 3 || ev.St == 2) {
                        var homeScore = 0;
                        var awayScore = 0;
                        $.each(ev.P, function(pi, pv){
                            var separe = ',';
                            if(pi == 0){separe = '';}
                            scoreByTimes += separe+pv.H+':'+pv.A;
                            homeScore += pv.H;
                            awayScore += pv.A;
                        });
                        scoreMatch = homeScore+':'+awayScore;
                    }
                    try {
                        var subhtml = '<tr data-bysport="'+v.P+'"><td>'+formattedTime+'</td><td>'+ev.H.T+' - '+ev.A.T+'</td><td>'+v.T.T+'</td><td>'+scoreMatch+' ('+scoreByTimes+')</td></tr>';
                        $('.pos-score-table tbody').append(subhtml);
                    }
                    catch(err) {

                    }
                }
            });
        });

        $('.pos-score-table tbody tr').each(function(){
            if($(this).attr('data-bysport') == sport_opened){
                $(this).show();
            }else{
                $(this).hide();
            }
        })
    });
}

function openLoginWindow(){
    $('.pos-window-extra[data-name="login"]').show();
}

function openScoresWindow(){
    $('.pos-window-extra[data-name="scores"]').show();
    statisticsScores();
}

function openCheckTicketWindow(){
    $('.pos-window-extra[data-name="check-ticket"]').show();
}

function openLangSelector(){
    if($('.pos-language-selector').is(':visible')){
        $('.pos-language-selector').hide();
    }else{
        $('.pos-language-selector').show();
    }
}

/********************/
var toPrint = '';
var lang = configSoftware.language;
toPrint = ',"lng":"'+lang+'"';
var sendMessage1 = '{"opt":1'+toPrint+', "ski": '+configSoftware.site_id+'}';
var sendMessage3 = '{"opt":7'+toPrint+', "ski": '+configSoftware.site_id+'}';
var sendMessage4 = '{"opt":2'+toPrint+', "evti":0, "si":0, "sil":[7,37], "cil":[], "ski": '+configSoftware.site_id+'}';
var sendMessage5 = '{"opt":3'+toPrint+', "evti":2141404,"evtil":[null], "ski": '+configSoftware.site_id+'}';
var sendMessage2 = '{"opt":5'+toPrint+', "ski": '+configSoftware.site_id+'}';

function wsConnect(link){
    socket = new WebSocket(link);

    if(socket.readyState === socket.CLOSED){

    }

    socket.onmessage=function (event) {
        return event.data;
    };
}

function wsReserveConnect(){
    socket_reserve = new WebSocket(configSoftware.service_r);

    socket_reserve.onclose = function() {

    };

    socket_reserve.onopen = function (event) {
        console.log('Status Reserve: ' + socket_reserve.readyState);
    };

    socket_reserve.onmessage=function (event) {
        var messageJSON = JSON.parse(event.data);
        if(messageJSON == 98){
            wsReserveSendCmd(99);
        }
        if(messageJSON.stsid == 0 && messageJSON.opt == 0 && typeof messageJSON.tkid != 'undefined'){
            // console.log('ticket in waiting');
        }
        if(messageJSON.stsid == 0 && messageJSON.opt == 100 && typeof messageJSON.tkid != 'undefined'){
            // console.log('ticket accepted');
            change_status_ticket_reserved(messageJSON.tkid,1);
            // remove_ticket_reserved(messageJSON.tkid);
        }
        if(messageJSON.stsid == 0 && messageJSON.opt == 101 && typeof messageJSON.tkid != 'undefined'){
            // console.log('ticket refused');
            change_status_ticket_reserved(messageJSON.tkid,2);
            // remove_ticket_reserved(messageJSON.tkid);
        }
        if(messageJSON.stsid == 0 && messageJSON.opt == 105 && typeof messageJSON.tkid != 'undefined' && typeof messageJSON.info != 'undefined'){
            //notifier.error('Biglietto '+messageJSON.tkid+': '+messageJSON.info);
        }
        if(messageJSON.stsid == 0 && messageJSON.opt == 109 && typeof messageJSON.tkid != 'undefined' && typeof messageJSON.totWin != 'undefined'){
            change_status_ticket_reserved(messageJSON.tkid,3);
            add_ticket_request_change(messageJSON);
        }
        if(messageJSON.stsid == 0 && messageJSON.opt == 107 && typeof messageJSON.tkid != 'undefined' && typeof messageJSON.totBet != 'undefined'){
            change_status_ticket_reserved(messageJSON.tkid,3);
            add_ticket_request_change(messageJSON);
        }
        if(messageJSON.stsid == 0 && messageJSON.opt == 108 && typeof messageJSON.tkid != 'undefined' && typeof messageJSON.oddsInfo != 'undefined'){
            change_status_ticket_reserved(messageJSON.tkid,3);
            add_ticket_request_change(messageJSON);
        }
    }
}

function change_status_ticket_reserved(tkt,status) {

    var status_html = 'IN ATTESA';
    if (status == 0) {
        status_html = 'IN ATTESA';
    }
    if (status == 1) {
        status_html = 'ACCETTATA';
        setTimeout(function(){
            reserveRefuseProp()
        }, 3900);
    }
    if (status == 2) {
        setTimeout(function(){
            reserveRefuseProp()
        }, 3900);
        status_html = 'RIFIUTATE';
    }
    if (status == 3) {
        status_html = 'IN ATTESA DELL&#039;UTENTE';
        $('.pos-ticket-accept-sys .pos-ticket-reserve-actions').show();
    }
    $('p[data-reserve="' + tkt + '"]').html('<span>'+tkt+'</span> '+status_html);

    if(readCookie('reserved_tickets_list') != null) {

        var reserved_tickets_list = JSON.parse(readCookie('reserved_tickets_list').replace(/'/g, ""));
        var now = Math.round((new Date()).getTime() / 1000 + 61) ;
        if(typeof reserved_tickets_list.find(x => x.code === tkt) != 'undefined') {
            reserved_tickets_list.find(x => x.code === tkt).status = status;
            reserved_tickets_list.find(x => x.code === tkt).time = now;

            if(status == 1) {
                var ptkc = reserved_tickets_list.find(x => x.code === tkt).ptkc;
                var username = null;
                add_repeat_tcket(ptkc,username,tkt);
            }

            createCookie('reserved_tickets_list_567401', JSON.stringify(reserved_tickets_list), ((1000 * 60) * 3));
        }
    }
    return false;
}

function reserveRefuseProp(){
    $('.pos-ticket-submit-actions').show();
    $('.pos-ticket-accept-sys, .pos-ticket-accept-sys .pos-ticket-reserve-actions').hide();
}

function reserveAcceptProp(){
    var tkid = $('.pos-ticket-accept-sys .pos-ticket-accept-details > p').attr('data-reserve');
    var reserved_change_tickets = JSON.parse(readCookie('reserved_change_tickets').replace(/'/g, ""));
    var ticket_change_info = reserved_change_tickets.find(x => x.code === tkid);

    //if(proposal_type == '109') {
        var value = ticket_change_info.totWin;
    wsReserveSendCmd({
            "opt": 109,
            "sessionId": "235eab5a72decee94ea24f2c6dd7673e",
            "lng": "IT",
            "tkid": tkid,
            "userType": 1,
            "usrres": "accept",
            "totWin": value
        });
    //}
    //if(proposal_type == '107') {
        var value = ticket_change_info.totBet;
    wsReserveSendCmd({
            "opt": 107,
            "sessionId": "235eab5a72decee94ea24f2c6dd7673e",
            "lng": "IT",
            "tkid": tkid,
            "userType": 1,
            "usrres": "accept",
            "totBet": value
        });
    //}
    //if(proposal_type == '108') {
    wsReserveSendCmd({
            "opt": 108,
            "sessionId": "235eab5a72decee94ea24f2c6dd7673e",
            "lng": "IT",
            "tkid": tkid,
            "userType": 1,
            "usrres": "accept",
            "oddsInfo": ticket_change_info.oddsInfo
        });
    //}
    $('.pos-ticket-submit-actions').show();
    $('.pos-ticket-accept-sys, .pos-ticket-accept-sys .pos-ticket-reserve-actions').hide();
}

function wsReserveSendCmd(data){
    if(socket_reserve.readyState == 1){
        socket_reserve.send(JSON.stringify(data));
    }
}

function add_ticket_reserved(data,ptkc){
    if(socket_reserve.readyState == 1){
        var username = localStorage.getItem('ACTUSER');
        if(readCookie('reserved_tickets_list') !== null){
            var reserved_tickets_list = JSON.parse(readCookie('reserved_tickets_list').replace(/'/g, ''));
        }else{
            var reserved_tickets_list = [];
        }
        wsReserveSendCmd({"opt":105, "sessionId": localStorage.getItem('ACTSESS'), "lng": configSoftware.language, "tkid": data.tkc, "userType":1});
        var time = Math.round((new Date()).getTime() / 1000) + 180;
        reserved_tickets_list.push({code: data.tkc, status: 0, username:username, time: time, ptkc:ptkc});
        createCookie('reserved_tickets_list', JSON.stringify(reserved_tickets_list), ((1000 * 60) * 3));
        $('.pos-ticket-accept-sys').show();
        $('.pos-ticket-submit-actions, .pos-ticket-accept-sys .pos-ticket-reserve-actions').hide();
        var status = 'IN ATTESA';
        var htmlPr = '<p data-reserve="'+data.tkc+'"><span>'+data.tkc+'</span> '+status+'.</p>';
        $('.pos-ticket-accept-sys .pos-ticket-accept-details').append(htmlPr);
    }
}

function replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}

$(document).ready(function () {

    var storedLanguage = localStorage.getItem('ACTUAL_LANG');
    if(storedLanguage == null) storedLanguage = configSoftware.language;
    if(configSoftware.language_availables.indexOf(storedLanguage) === -1) storedLanguage = configSoftware.language;

    var html = $('body').html();
    $.each(stLang[storedLanguage], function(i,v){
        var name = '[LANG_ID'+i+']';
        html = replaceAll(html, name, v);
    });
    html = html.replace('[ACTUAL_LANG]', storedLanguage.toUpperCase());
    $('body').html(html);

    $('.pos-details-software').html('<span id="pos-local-time">-</span><br />ID '+configSoftware.site_id+' ('+configSoftware.client_name+') - Version: '+version);

    var timer_datetime = null;
    timer_datetime = setInterval(function(){
        d = new Date();
        $('#pos-local-time').text(d.toLocaleDateString()+' '+d.toLocaleTimeString());
        if(inactivityTimer > 300){
            if(!$('.pos-cover-start').is(':visible')) $('.pos-cover-start').fadeIn();
        }else{
            inactivityTimer++;
        }
        if(socket_reserve == null && localStorage.getItem('ACTSESS') !== null){

        }
    }, 1000);

    cKeyboard_config.input_target ="#username";
    cKeyboard();

    if(localStorage.getItem('ACTSESS') !== null){
        $('.button-pos-act[data-action="login-user"]').attr('onclick', '');
        $('.button-pos-act[data-action="login-user"] span').last().html(localStorage.getItem('ACTUSER'));
        refreshClientCredit();
    }

    var isHoverActiveA = 0;
    $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').hover(function(){
        var onlyOnePerSeg = 0;
        isHoverActiveA = 1;
        $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').on('mousewheel DOMMouseScroll', function(event) {
            if(onlyOnePerSeg == 0){
                inactivityTimer = 0;
                onlyOnePerSeg = 1;
                if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
                    $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').animate({'scrollTop':'-=72px'}, 'fast');
                }
                else {
                    $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').animate({'scrollTop':'+=72px'}, 'fast');
                }
                setTimeout(function(){onlyOnePerSeg = 0;}, 500);
            }
            return false;
        });
    }, function(){ isHoverActiveA = 0; });

    var isHoverActiveB = 0;
    $('.pos-content-events-list').hover(function(){
        var onlyOnePerSeg = 0;
        isHoverActiveB = 1;
        $('.pos-content-events-list').on('mousewheel DOMMouseScroll', function(event) {
            if(onlyOnePerSeg == 0){
                inactivityTimer = 0;
                onlyOnePerSeg = 1;
                if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
                    $('.pos-content-events-list').animate({'scrollTop':'-=90px'}, 'fast');
                }
                else {
                    $('.pos-content-events-list').animate({'scrollTop':'+=90px'}, 'fast');
                }
                setTimeout(function(){onlyOnePerSeg = 0;}, 500);
            }
            return false;
        });
    }, function(){ isHoverActiveB = 0; });

    var isHoverActiveC = 0;
    $('.pos-content-event-view .pos-content-event-list').hover(function(){
        var onlyOnePerSeg = 0;
        isHoverActiveC = 1;
        $('.pos-content-event-view .pos-content-event-list').on('mousewheel DOMMouseScroll', function(event) {
            if(onlyOnePerSeg == 0){
                inactivityTimer = 0;
                onlyOnePerSeg = 1;
                if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
                    $('.pos-content-event-view .pos-content-event-list').animate({'scrollTop':'-=90px'}, 'fast');
                }
                else {
                    $('.pos-content-event-view .pos-content-event-list').animate({'scrollTop':'+=90px'}, 'fast');
                }
                setTimeout(function(){onlyOnePerSeg = 0;}, 500);
            }
            return false;
        });
    }, function(){ isHoverActiveC = 0; });

    $('.pos-language-selector').empty();
    $.each(configSoftware.language_availables, function(i,v){
        $('.pos-language-selector').append('<div class="pos-language-item '+(storedLanguage == v ? 'selected' : '')+'" data-lang="'+v+'"><i class="fa fa-language" aria-hidden="true"></i> '+v+'</div>')
    });

    //createSportMenu('.selectorSport', 1, 1);

    statisticsScores();

    wsConnect(configSoftware.service_l);

    socket.onclose = function() {
        //$('#status_service').html('DISCONNECTED').attr('style', 'color:red;');
    };

    socket.onopen = function (event) {

        console.log('Status: ' + socket.readyState);
    };

    socket.onmessage=function (event) {

        //$('#status_service').html('CONNECTED').attr('style', 'color:green;');

        //console.debug("Sport", event);

        time = new Date().getTime();
        if(+(event).data == 98){
            //sendRequest(false, -1);
        }else {
            var data = JSON.parse(event.data.replace('\\"info\":\\"', '\\"info\\":').slice(0, -1) + '}');
            if (!data['info']) {
                return true;
            }
            var clearData = data['info'].replace(/\\n/g, "\\n").replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, "\\&").replace(/\\r/g, "\\r").replace(/\\t/g, "\\t").replace(/\\b/g, "\\b").replace(/\\f/g, "\\f").replace(/[\u0000-\u0019]+/g, "");
            var json_decoded = JSON.parse(clearData);

            if (data['operationId'] == 0) {
                if (data['opt'] == 1) {
                    addSportMenuLive(json_decoded);
                }
                else if (data['opt'] == 2) {
                    prepareEventsListLive(json_decoded);
                }
                else if (data['opt'] == 100 || data['opt'] == 11  || data['opt'] == 12 || data['opt'] == 13) {
                    if(data['opt'] == 11){

                    }
                    if(data['opt'] == 12){
                        updateOddsLive(json_decoded);
                    }
                    if(data['opt'] == 13){
                        updateMatchLiveDetails(json_decoded);
                    }
                } else {
                    if (data['opt'] == 5) {
                    }else if (data['opt'] == 3){
                        if(data['operationMessage'] == 'error'){
                            createAlertMessage("error", "-1");
                        }
                        else
                        {
                            generateHtmlEventViewLive(json_decoded);
                        }
                    }else if (data['opt'] == 6){

                    }
                }
            }
            else
            {

            }
        }
    };

});

/*------------------*/

$(document).off('click', 'body');
$(document).on('click', 'body', function(e){
    inactivityTimer = 0;
});

$(document).off('click', '.pos-language-selector .pos-language-item');
$(document).on('click', '.pos-language-selector .pos-language-item', function(e){
    var langSelected = $(this).attr('data-lang');
    localStorage.setItem('ACTUAL_LANG', langSelected);
    window.location.reload();
});

$(document).off('click', '.pos-ticket-footer .pos-ticket-type-system');
$(document).on('click', '.pos-ticket-footer .pos-ticket-type-system', function(e){
    if(!$('.pos-ticket-button-bv-value-lbl').hasClass('pos-type-ticket-4')){
        $(this).toggleClass('active');
        rTicketFuncs.setCouponInfo(0);
    }
});

var timerUpdateCoupon = null;
$(document).off('click', '.pos-ticket-coupon-value-bet .pos-ticket-button-bv-value');
$(document).on('click', '.pos-ticket-coupon-value-bet .pos-ticket-button-bv-value', function(e){
    var addval = 1;
    var action = $(this).attr('data-action');
    var actval = parseFloat($('.pos-ticket-button-bv-value-lbl .pos-ticket-real-bet').html());
    if(action=='plus'){
        if(actval < 1001){
            actval = (actval+addval);
        }
        $('.pos-ticket-button-bv-value-lbl .pos-ticket-real-bet').html(actval.toFixed(2))
    }else{
        if(actval >= 1){
            actval = (actval-addval);
        }else{
            actval = 0;
        }
        $('.pos-ticket-button-bv-value-lbl .pos-ticket-real-bet').html(actval.toFixed(2))
    }
    clearTimeout(timerUpdateCoupon);
    timerUpdateCoupon = setTimeout(function(){
        rTicketFuncs.setCouponInfo(0);
    }, 999);
});

$(document).off('click', '.pos-header .pos-header-menu .pos-header-menu-right-btn');
$(document).on('click', '.pos-header .pos-header-menu .pos-header-menu-right-btn', function(e){
    var left = $('.pos-header .pos-header-menu').scrollLeft();
    $('.pos-header .pos-header-menu').animate({scrollLeft: (left+120)}, 300, function(){
        var left = $('.pos-header .pos-header-menu').scrollLeft();
        if(left > 0){
            $('.pos-header .pos-header-menu .pos-header-menu-left-btn').show();
        }
    });
});

$(document).off('click', '.pos-header .pos-header-menu .pos-header-menu-left-btn');
$(document).on('click', '.pos-header .pos-header-menu .pos-header-menu-left-btn', function(e){
    var left = $('.pos-header .pos-header-menu').scrollLeft();
    $('.pos-header .pos-header-menu').animate({scrollLeft: (left-120)}, 300, function(){
        var left = $('.pos-header .pos-header-menu').scrollLeft();
        if(left < 1){
            $('.pos-header .pos-header-menu .pos-header-menu-left-btn').hide();
        }
    });
});

$(document).off('click', '.pos-content .pos-content-sport-menu .pos-sport-menu-footer .pos-content-position-btn');
$(document).on('click', '.pos-content .pos-content-sport-menu .pos-sport-menu-footer .pos-content-position-btn', function(e){
    var action = $(this).attr('data-action');
    if(action == 'down'){
        var top = $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').scrollTop();
        $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').animate({scrollTop: (top+47)}, 300, function(){
            var top = $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').scrollTop();
            if(top > 0){
                $('.pos-content .pos-content-sport-menu .pos-sport-menu-footer .pos-content-position-btn[data-action="upall"], .pos-content .pos-content-sport-menu .pos-sport-menu-footer .pos-content-position-btn[data-action="up"]').removeClass('pos-btn-disabled');
            }
        });
    }else if(action == 'up'){
        var top = $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').scrollTop();
        $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').animate({scrollTop: (top-47)}, 300, function(){
            var top = $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').scrollTop();
            if(top < 1){
                $('.pos-content .pos-content-sport-menu .pos-sport-menu-footer .pos-content-position-btn[data-action="upall"], .pos-content .pos-content-sport-menu .pos-sport-menu-footer .pos-content-position-btn[data-action="up"]').addClass('pos-btn-disabled');
            }
        });
    }else if(action == 'upall'){
        var top = $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').scrollTop();
        $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').animate({scrollTop: 0}, 300, function(){
            var top = $('.pos-content .pos-content-sport-menu .pos-sport-menu-list').scrollTop();
            if(top < 1){
                $('.pos-content .pos-content-sport-menu .pos-sport-menu-footer .pos-content-position-btn[data-action="upall"], .pos-content .pos-content-sport-menu .pos-sport-menu-footer .pos-content-position-btn[data-action="up"]').addClass('pos-btn-disabled');
            }
        });
    }
});

$(document).off('click', '.pos-button-ct-action');
$(document).on('click', '.pos-button-ct-action', function(e){
    var action = $(this).attr('data-action');
    if(action == 'down'){
        var top = $('.pos-table-content-scroll').scrollTop();
        $('.pos-table-content-scroll').animate({scrollTop: (top+47)}, 300, function(){
            var top = $('.pos-table-content-scroll').scrollTop();
            if(top > 0){
                $('.pos-button-ct-action[data-action="upall"], .pos-button-ct-action[data-action="up"]').removeClass('pos-btn-disabled');
            }
        });
    }else if(action == 'up'){
        var top = $('.pos-table-content-scroll').scrollTop();
        $('.pos-table-content-scroll').animate({scrollTop: (top-47)}, 300, function(){
            var top = $('.pos-table-content-scroll').scrollTop();
            if(top < 1){
                $('.pos-button-ct-action[data-action="upall"], .pos-button-ct-action[data-action="up"]').addClass('pos-btn-disabled');
            }
        });
    }else if(action == 'upall'){
        var top = $('.pos-table-content-scroll').scrollTop();
        $('.pos-table-content-scroll').animate({scrollTop: 0}, 300, function(){
            var top = $('.pos-table-content-scroll').scrollTop();
            if(top < 1){
                $('.pos-button-ct-action[data-action="upall"], .pos-button-ct-action[data-action="up"]').addClass('pos-btn-disabled');
            }
        });
    }
});

$(document).off('click', '.pos-window-extra-footer .pos-content-position-btn');
$(document).on('click', '.pos-window-extra-footer .pos-content-position-btn', function(e){
    var element = $(this).parent().parent().parent().find('.pos-window-extra-body');
    var action = $(this).attr('data-action');
    if(action == 'down'){
        var top = element.scrollTop();
        element.animate({scrollTop: (top+47)}, 300, function(){

        });
    }else if(action == 'up'){
        var top = element.scrollTop();
        element.animate({scrollTop: (top-47)}, 300, function(){

        });
    }else if(action == 'upall'){
        var top = element.scrollTop();
        element.animate({scrollTop: 0}, 300, function(){

        });
    }
});

$(document).off('click', '.pos-ticket-footer .pos-ticket-button-scroll');
$(document).on('click', '.pos-ticket-footer .pos-ticket-button-scroll', function(e){
    var element = $('.pos-ticket .pos-ticket-body');
    var action = $(this).attr('data-action');
    if(action == 'down'){
        var top = element.scrollTop();
        element.animate({scrollTop: (top+47)}, 300, function(){

        });
    }else if(action == 'up'){
        var top = element.scrollTop();
        element.animate({scrollTop: (top-47)}, 300, function(){

        });
    }else if(action == 'upall'){
        var top = element.scrollTop();
        element.animate({scrollTop: 0}, 300, function(){

        });
    }
});

$(document).off('click', '.pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn');
$(document).on('click', '.pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn', function(e){
    var action = $(this).attr('data-action');
    if($('body').hasClass('event-view')){
        if(action == 'down'){
            var top = $('.pos-content-event-view .pos-content-event-list').scrollTop();
            $('.pos-content-event-view .pos-content-event-list').animate({scrollTop: (top+90)}, 300, function(){
                var top = $('.pos-content-event-view .pos-content-event-list').scrollTop();
                if(top > 0){
                    $('.pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="upall"], .pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="up"]').removeClass('pos-btn-disabled');
                }
            });
        }else if(action == 'up'){
            var top = $('.pos-content-event-view .pos-content-event-list').scrollTop();
            $('.pos-content-event-view .pos-content-event-list').animate({scrollTop: (top-90)}, 300, function(){
                var top = $('.pos-content-event-view .pos-content-event-list').scrollTop();
                if(top < 1){
                    $('.pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="upall"], .pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="up"]').addClass('pos-btn-disabled');
                }
            });
        }else if(action == 'upall'){
            var top = $('.pos-content-event-view .pos-content-event-list').scrollTop();
            $('.pos-content-event-view .pos-content-event-list').animate({scrollTop: 0}, 300, function(){
                var top = $('.pos-content-event-view .pos-content-event-list').scrollTop();
                if(top < 1){
                    $('.pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="upall"], .pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="up"]').addClass('pos-btn-disabled');
                }
            });
        }
    }else{
        if(action == 'down'){
            var top = $('.pos-content .pos-content-events-list').scrollTop();
            $('.pos-content .pos-content-events-list').animate({scrollTop: (top+90)}, 300, function(){
                var top = $('.pos-content .pos-content-events-list').scrollTop();
                if(top > 0){
                    $('.pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="upall"], .pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="up"]').removeClass('pos-btn-disabled');
                }
            });
        }else if(action == 'up'){
            var top = $('.pos-content .pos-content-events-list').scrollTop();
            $('.pos-content .pos-content-events-list').animate({scrollTop: (top-90)}, 300, function(){
                var top = $('.pos-content .pos-content-events-list').scrollTop();
                if(top < 1){
                    $('.pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="upall"], .pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="up"]').addClass('pos-btn-disabled');
                }
            });
        }else if(action == 'upall'){
            var top = $('.pos-content .pos-content-events-list').scrollTop();
            $('.pos-content .pos-content-events-list').animate({scrollTop: 0}, 300, function(){
                var top = $('.pos-content .pos-content-events-list').scrollTop();
                if(top < 1){
                    $('.pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="upall"], .pos-content .pos-content-footer .pos-content-position-control .pos-content-position-btn[data-action="up"]').addClass('pos-btn-disabled');
                }
            });
        }
    }
});

$(document).off('click', '.pos-content .pos-content-sport-menu .pos-sport-menu-time');
$(document).on('click', '.pos-content .pos-content-sport-menu .pos-sport-menu-time', function(e){
    $('.pos-sport-menu-time-selector').toggleClass('active');
});

$(document).off('click', '.pos-sport-menu-time-selector .pos-sport-menu-time-selector-item');
$(document).on('click', '.pos-sport-menu-time-selector .pos-sport-menu-time-selector-item', function(e){
    $('.pos-sport-menu-time-selector .pos-sport-menu-time-selector-item.active').removeClass('active');
    $(this).addClass('active');
    $('#smTimeSelected').html($(this).attr('data-lbl'));
    createSportMenu();
});

$(document).off('click', '.pos-header .pos-header-menu ul li');
$(document).on('click', '.pos-header .pos-header-menu ul li', function(e){
    if($('body').hasClass('event-view')){
        $('body').removeClass('event-view');
        $('.pos-content-events-view').addClass('active');
        $('.pos-content-event-view').removeClass('active');
    }
    $('.pos-header .pos-header-menu ul li.active, .pos-content .pos-content-sport-menu .pos-sport-menu-optlst.active, .pos-content-events-list .pos-sport-events-view-optlst.active, .pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view.active').removeClass('active');
    $(this).addClass('active');
    var sport_id = $(this).attr('data-sid');
    var sport_name = $(this).attr('data-sname');
    $('.pos-content .pos-content-sport-menu .pos-sport-menu-optlst[data-sid="'+sport_id+'"], .pos-content-events-list .pos-sport-events-view-optlst[data-sid="'+sport_id+'"], .pos-subheader .pos-subhead-menu .pos-subhead-menu-oddscnt .pos-subhead-oddscnt-view[data-sid="'+sport_id+'"]').addClass('active');
    $('.pos-subheader .pos-subhead-menu .pos-subhead-menu-uplbl').html(generateHtmlSportIcon(sport_id)+' '+sport_name);

    if($('.pos-content .pos-content-sport-menu .pos-sport-menu-optlst.active .pos-opened-coi').length == 0){
        var added = 0;
        $('.pos-content .pos-content-sport-menu .pos-sport-menu-optlst.active > ul > li').each(function(){
            if($(this).find('.pos-sp-totalevts-live').is(':visible') && $(this).find('.pos-sp-totalevts-live').html() != '0'){
                $(this).find('.pos-btn-select-allin').click();
                added++;
            }
        });
        if(added == 0){
            $('.pos-content .pos-content-sport-menu .pos-sport-menu-optlst.active > ul > li').each(function(){
                if(added < 2){
                    $(this).find('.pos-btn-select-allin').click();
                    added++;
                }
            });
        }
    }
    rTicketFuncs.selectedCouponOdds();
});

$(document).off('click', '.pos-content .pos-content-sport-menu .pos-sport-menu-optlst > ul > li > a');
$(document).on('click', '.pos-content .pos-content-sport-menu .pos-sport-menu-optlst > ul > li > a', function(e){
    $(this).parent().toggleClass('pos-sp-menu-opened');
});

$(document).off('click', '.pos-cover-start');
$(document).on('click', '.pos-cover-start', function(e){
    $(this).fadeOut();
    createSportMenu('.selectorSport', 1, 1);
});

$(document).off('click', '.pos-footer-acts .button-pos-act');
$(document).on('click', '.pos-footer-acts .button-pos-act', function(e){
    var action = $(this).attr('data-action');
    if(action == 'close'){
        localStorage.removeItem('ACTSESS');
        localStorage.removeItem('ACTUSER');
        window.location.reload();
    }
});

$(document).off('click', '.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst > ul > li > ul > li');
$(document).on('click', '.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst > ul > li > ul > li', function(e){
    if($(this).hasClass('pos-opened-coi')){
        $(this).removeClass('pos-opened-coi');
        var coi = $(this).attr('data-coi');
        $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst > ul > li > ul > li[data-coi="'+coi+'"]').each(function(){
            if($(this).hasClass('pos-opened-coi')) $(this).removeClass('pos-opened-coi');
        });
    }else{
        $(this).addClass('pos-opened-coi');
        var coi = $(this).attr('data-coi');
        $('.pos-content-sport-menu .pos-sport-menu-list .pos-sport-menu-optlst > ul > li > ul > li[data-coi="'+coi+'"]').each(function(){
            if(!$(this).hasClass('pos-opened-coi')) $(this).addClass('pos-opened-coi');
        });
    }
    createEventsList($(this).attr('data-sid'));
});

$(document).off('click', '.pos-content .pos-content-sport-menu .pos-sport-menu-optlst > ul > li .pos-btn-select-allin');
$(document).on('click', '.pos-content .pos-content-sport-menu .pos-sport-menu-optlst > ul > li .pos-btn-select-allin', function(e){
    if($(this).parent().hasClass('pos-opened-ci')){
        $(this).parent().find('ul > li').each(function(){
            if($(this).hasClass('pos-opened-coi')) $(this).removeClass('pos-opened-coi');
        });
    }else{
        $(this).parent().find('ul > li').each(function(){
            if(!$(this).hasClass('pos-opened-coi')) $(this).addClass('pos-opened-coi');
        });
    }
    createEventsList($(this).parent().parent().parent().attr('data-sid'));
});

$(document).off('click', '.pos-content-events-list .pos-sport-event-item-view-details, .pos-content-events-list .pos-sport-event-item-view-moddsv');
$(document).on('click', '.pos-content-events-list .pos-sport-event-item-view-details, .pos-content-events-list .pos-sport-event-item-view-moddsv', function(e){
    openEventViewer($(this).parent().attr('data-event-id'));
});

$(document).off('click', '.pos-event-odds-groups-tabs .pos-event-odds-groups-tabs-item');
$(document).on('click', '.pos-event-odds-groups-tabs .pos-event-odds-groups-tabs-item', function(e){
    $('.pos-event-odds-groups-tabs .pos-event-odds-groups-tabs-item.active, .pos-event-odd-group-tab-content.active').removeClass('active');
    $(this).addClass('active');
    $('.pos-event-odd-group-tab-content[data-tab="'+$(this).attr('data-tab')+'"]').addClass('active');
});

$(document).off('click', '#username');
$(document).on('click', '#username', function(e){
    cKeyboard_config.input_target ="#username";
});
$(document).off('click', '#password');
$(document).on('click', '#password', function(e){
    cKeyboard_config.input_target ="#password";
});

$(document).off('click', '.pos-score-head-nav ul li');
$(document).on('click', '.pos-score-head-nav ul li', function(e){
    $('.pos-score-head-nav ul li.active').removeClass('active');
    $(this).addClass('active');
    var sport_id = $(this).attr('data-sid');
    $('.pos-score-table tbody tr').each(function(){
        if($(this).attr('data-bysport') == sport_id){
            $(this).show();
        }else{
            $(this).hide();
        }
    })
});

$(document).off('click', '.pos-content-event-view > .pos-content-footer > .pos-content-position-btn');
$(document).on('click', '.pos-content-event-view > .pos-content-footer > .pos-content-position-btn', function(e){
    $('.pos-header .pos-header-menu ul li.active').click();
});


function clickOdd(object, ci, ei, gi, qi, en, cn, oddtn, oddn, ha, evdt, syty){
    if($(object).hasClass('pos-oddv-selected')){
        var jsonCoupon = JSON.parse(localStorage.getItem('couponTemp'));
        if(jsonCoupon != null){
            var index=0; for ( index; index<jsonCoupon.length; index++ ) {
                if(jsonCoupon[index] != null){
                    if ( jsonCoupon[index].qi == qi ) {
                        rTicketFuncs.removeOdd(jsonCoupon[index].ci, jsonCoupon[index].ei, jsonCoupon[index].gi, jsonCoupon[index].qi, jsonCoupon[index].en, jsonCoupon[index].cn, jsonCoupon[index].ptkdi);
                    }
                }
            }
        }
        $(object).removeClass('pos-oddv-selected');
    }else{
        var oddRule = 'none';
        if($(object).hasClass('tripla')){oddRule = 'tripla';}
        else if($(object).hasClass('quadrupla')){oddRule = 'quadrupla';}
        else if($(object).hasClass('quintupla')){oddRule = 'quintupla';}
        rTicketFuncs.addOdd($(object).attr('data-oddval'), ci, ei, gi, qi, en, cn, oddtn, oddn, ha, evdt, syty, oddRule);
        $(object).addClass('pos-oddv-selected');
    }
}

function getSysBetDetails(gCouponDetails) {

    var sysBetD = [];

    sysBetD = [{"ty": gCouponDetails.type, "bet": gCouponDetails.cs, "co": 1, "maxb": 0, "maxw": 0, "minb": 0, "minw": 0}];

    return sysBetD;
}

function ticket_combinations(set, k) {
    if(k > set){
        return 0;
    }else{
        var r = 1;
        for (var d = 1; d < k; d++){
            r *= set--;
            r /= d;
        }
        return r;
    }
}

$(window).on('resize', function(){
    window.location.reload();
});

function checkCouponDetails(){
    $.ajax({
        url: configSoftware.service_p,
        method: "POST",
        dataType: 'json',
        data:{
            'operationtype': 4002,
            'info': JSON.stringify({
                "siteid":configSoftware.site_id,
                "sessionId":localStorage.getItem('ACTSESS'),
                "systemCode":configSoftware.sys_code,
                'opt':4,
                'tkid': 'TKT-'+$('.pos-checkticket-inputs .pos-virtualinput').html(),
                'lng': configSoftware.language
            })
        },
        success:function (data) {
            if(data.operationMessage == 'success'){
                constructCouponDetails(data);
            }
            else {
                createAlertMessage('Error', data.operationMessage)
            }
        },
        error: function(xhr, ajaxOptions, thrownError){
            createAlertMessage('error', 'Service unavailable');
        }
    })
    $('.pos-checkticket-inputs .pos-virtualinput').html('');
}

$(document).off('click', '.pos-virtual-numpad .pos-virtual-numpad-line .pos-virtual-numeric-key')
$(document).on('click', '.pos-virtual-numpad .pos-virtual-numpad-line .pos-virtual-numeric-key', function(e){
    if($(this).html() == 'C'){
        var remove = $('.pos-checkticket-inputs .pos-virtualinput').html().substr(0, ($('.pos-checkticket-inputs .pos-virtualinput').html().length-1))
        $('.pos-checkticket-inputs .pos-virtualinput').html(remove)
    }else if($(this).html() == 'GO'){
        checkCouponDetails();
    }else{
        $('.pos-checkticket-inputs .pos-virtualinput').html($('.pos-checkticket-inputs .pos-virtualinput').html()+$(this).html());
    }
});