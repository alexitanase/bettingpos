
function calculateProd(oddsList, numElements){
    var prod = 0;
    for(var i = 0; i < numElements; i++){
        if(prod == 0) prod = oddsList[i];
        else prod = prod*oddsList[i];
    }
    return prod;
}

function calculateMaxProd(oddsList, numElements) {
    var prod = 0;
    for(var i = 0; i < numElements; i++){
        if(prod == 0) prod = oddsList[(oddsList.length - i - 1)];
        else prod = prod*oddsList[(oddsList.length - i - 1)];
    }
    return prod;
}

var rTicketFuncs = {
    "setOddSystem": function(qi, ptkdi, status){
        var ptkc_sp = localStorage.getItem('TEMP_PTKC');
        var gCouponDetails = rTicketFuncs.getCouponAr();
        $.ajax({
            url: configSoftware.service_p,
            method: "POST",
            dataType: 'json',
            async: false,
            data:{
                'operationtype': 4002,
                'info': JSON.stringify({
                    "siteid":configSoftware.site_id,
                    "sessionId":localStorage.getItem('ACTSESS'),
                    "systemCode":configSoftware.sys_code,
                    'opt':8,
                    'eoi':qi,
                    'ptkc': ptkc_sp,
                    'ptkdi': ptkdi,
                    'ty': gCouponDetails.type,
                    'ab': gCouponDetails.cs,
                    'sysBetDet': sysBetD,
                    'lng': configSoftware.language,
                    'isfo': status
                })
            },
            success:function (data) {
                rTicketFuncs.generateCoupon();
            },
            error: function(xhr, ajaxOptions, thrownError){

            }
        })
    },
    "addOdd": function(ov, ci, ei, gi, qi, en, cn, oddtn, oddn, ha, evdt, syty, rule){
        var ptkc_sp = localStorage.getItem('TEMP_PTKC');
        var gCouponDetails = rTicketFuncs.getCouponAr();
        $.ajax({
            url: configSoftware.service_p,
            method: "POST",
            dataType: 'json',
            async: true,
            data:{
                'operationtype': 4002,
                'info': JSON.stringify({
                    "siteid":configSoftware.site_id,
                    "sessionId":localStorage.getItem('ACTSESS'),
                    "systemCode":configSoftware.sys_code,
                    'opt':1,
                    'eoi':qi,
                    'ptkc': ptkc_sp,
                    'syty': syty,
                    'ov': parseFloat(ov),
                    'ty': gCouponDetails.type,
                    'ab': gCouponDetails.cs,
                    'sysBetDet': getSysBetDetails(gCouponDetails),
                    'lng': configSoftware.language
                })
            },
            success:function (data) {
                localStorage.setItem('TEMP_PTKC', data.ptkc);
                var jsonCoupon = JSON.parse(localStorage.getItem('couponTemp'));
                var oddchanged = 'null', lastoddchg = 0;
                if(data.eoi !== undefined && data.eov !== undefined ){
                    lastoddchg = qi;
                    if(syty !== 2)
                        qi = data.eoi;
                    ov = data.eov;
                    oddchanged = 'yes';
                }
                var listBetCustomer = {
                    "ci": ci,
                    "ei": ei,
                    "gi": gi,
                    "qi": qi,
                    "en": en,
                    "cn": cn,
                    "ov": ov,
                    "ptkdi": data.ptkdi,
                    'oddtn': oddtn,
                    'oddn': oddn,
                    'oddchg': oddchanged,
                    'oddchgid': lastoddchg,
                    'hnd': ha,
                    'evdt': evdt,
                    'syty': syty,
                    'rule': rule,
                    'isfo': 0
                };

                if(jsonCoupon == null){
                    listBetCustomer = [listBetCustomer];
                    localStorage.setItem('couponTemp', JSON.stringify(listBetCustomer));
                }else{
                    jsonCoupon.push(listBetCustomer);
                    localStorage.setItem('couponTemp', JSON.stringify(jsonCoupon));
                }

                rTicketFuncs.setCouponInfo(0);

                rTicketFuncs.generateCoupon();
            },
            error: function(xhr, ajaxOptions, thrownError){

            }
        })
    },
    "removeIsSended": false,
    "removeOdd": function(ci, ei, gi, qi, en, cn, ptkdi){
        ptkc_sp = localStorage.getItem('TEMP_PTKC');

        var gCouponDetails = rTicketFuncs.getCouponAr();
        $.ajax({
            url: configSoftware.service_p,
            method: "POST",
            dataType: 'json',
            async: false,
            data:{
                'operationtype': 4002,
                'info': JSON.stringify({
                    "siteid":configSoftware.site_id,
                    "sessionId":localStorage.getItem('ACTSESS'),
                    "systemCode":configSoftware.sys_code,
                    'opt':2,
                    'eoi':qi,
                    'ptkc': ptkc_sp,
                    'ptkdi': ptkdi,
                    'ab': gCouponDetails.cs,
                    'sysBetDet': getSysBetDetails(gCouponDetails),
                    'lng': configSoftware.language
                })
            },
            success:function (data) {
                var jsonCoupon = JSON.parse(localStorage.getItem('couponTemp'));
                var newCoupon = [];
                if(jsonCoupon != null){
                    var index=0; for ( index; index<jsonCoupon.length; index++ ) {
                        if(jsonCoupon[index] != null){
                            if ( jsonCoupon[index].qi != qi ) {
                                newCoupon.push(jsonCoupon[index]);
                            }
                        }
                    }
                }
                localStorage.setItem('couponTemp', JSON.stringify(newCoupon));
                if(newCoupon.length == 0){
                    rTicketFuncs.emptyCoupon();
                }else{
                    rTicketFuncs.setCouponInfo(0);
                    rTicketFuncs.generateCoupon();
                }
            },
            error: function(xhr, ajaxOptions, thrownError){

            }
        })
    },
    "generateCoupon": function(){
        rTicketFuncs.selectedCouponOdds();
        var jsonCoupon = JSON.parse(localStorage.getItem('couponTemp'));
        console.debug("Coupon", jsonCoupon);
        if(jsonCoupon != null){
            $('.pos-ticket .pos-ticket-odds-list').empty();
            var events = 0;
            var index=0; for ( index; index<jsonCoupon.length; index++ ) {
                if(jsonCoupon[index] != null){
                    if($('.pos-ticket .pos-ticket-odds-list .pos-ticket-odd-item[data-evti="'+jsonCoupon[index].ei+'"]').length) {
                        $('.pos-ticket .pos-ticket-odds-list .pos-ticket-odd-item[data-evti="'+jsonCoupon[index].ei+'"] .pos-ticket-odd-item-oddslst').append('<div class="pos-ticket-odd-item-oddslst-itm"><span>'+jsonCoupon[index].oddtn+':</span><span>'+jsonCoupon[index].oddn+'</span><span>'+jsonCoupon[index].ov+'</span></div>');
                    }else{
                        events++;
                        $('.pos-ticket .pos-ticket-odds-list').append('<div class="pos-ticket-odd-item '+(jsonCoupon[index].syty == 2 ? 'pos-ticket-livebet' : '')+'" data-evti="'+jsonCoupon[index].ei+'"><span onclick="rTicketFuncs.removeOdd('+jsonCoupon[index].ci+', '+jsonCoupon[index].ei+', '+jsonCoupon[index].gi+', '+jsonCoupon[index].qi+', \'\', \'\', \''+jsonCoupon[index].ptkdi+'\');" class="fa fa-times" aria-hidden="true"></span><span class="pos-ticket-odd-item-en">'+jsonCoupon[index].en+'</span><span class="pos-ticket-odd-item-cn">'+jsonCoupon[index].cn+'</span><div class="pos-ticket-odd-item-oddslst"><div class="pos-ticket-odd-item-oddslst-itm"><span>'+jsonCoupon[index].oddtn+':</span><span>'+jsonCoupon[index].oddn+'</span><span>'+jsonCoupon[index].ov+'</span></div></div></div>');
                    }
                }
            }
            $('.pos-ticket-header').attr('data-nrevts', events);
            rTicketFuncs.setCouponInfo(0);
            $('.pos-ticket .pos-ticket-no-odds').hide();
            if(parseFloat($('.pos-ticket-coupon-value-bet .pos-ticket-button-bv-value-lbl .pos-ticket-real-bet').html()) <= 0){
                $('.pos-ticket .pos-ticket-no-credit').show();
            }
        }else{
            $('.pos-ticket .pos-ticket-odds-list').empty();
            $('.pos-ticket-bet-infolist').empty()
                .append('<div class="pos-ticket-bet-infoline">Scommese <span>0</span></div>')
                .append('<div class="pos-ticket-bet-infoline">Total quote <span>---</span></div>')
                .append('<div class="pos-ticket-bet-infoline">&nbsp;</div>')
                .append('<div class="pos-ticket-bet-infoline">Poss. recompensa <span class="posibleWinLbl">0.00</span></div>');
            $('.pos-ticket .pos-ticket-no-odds').show();
            $('.pos-ticket .pos-ticket-no-credit').hide();
        }
    },
    "emptyCoupon": function(){
        $('.pos-ticket-coupon-value-bet .pos-ticket-button-bv-value-lbl .pos-ticket-real-bet').html('0.00')
        localStorage.removeItem('couponTemp');
        localStorage.removeItem('TEMP_PTKC');
        $('.pos-ticket-button-bv-value-lbl .pos-ticket-real-bet').html('0.00');
        rTicketFuncs.generateCoupon();
    },
    "selectedCouponOdds": function(){
        var jsonCoupon = JSON.parse(localStorage.getItem('couponTemp'));
        $('.pos-oddv-selected').removeClass('pos-oddv-selected');
        if(jsonCoupon != null){
            var index=0; for ( index; index<jsonCoupon.length; index++ ) {
                if(jsonCoupon[index] != null){
                    $('div[data-oddid="'+jsonCoupon[index].qi+'"]').addClass('pos-oddv-selected')
                }
            }
        }
    },
    "getCouponAr": function(){
        var arr = [], coupon = {}, typeTicket = 1, warnChanged = 0;
        var correctArr = {};
        var activeCombined = 0;
        $('.pos-ticket-odd-item').each(function() {
            $(this).find('.pos-ticket-odd-item-oddslst-itm').each(function(){
                var theOdd = parseFloat($(this).find('span:nth-child(3)').text());
                arr.push(parseFloat(theOdd));
            });
        });
        var correctArr = {}, correctOne = [], countArr = 0;
        $('.pos-ticket-odd-item').each(function() {
            $(this).find('.pos-ticket-odd-item-oddslst-itm').each(function(){
                var theOdd = parseFloat($(this).find('span:nth-child(3)').text());
                correctOne.push(parseFloat(theOdd));
            });
            correctArr[countArr] = correctOne;
            correctOne = [];
            countArr++;
        });
        $('.pos-ticket-odd-item').each(function(){
            totalEvents++;
            if($(this).find('.pos-ticket-odd-item-oddslst-itm').length > 1){
                activeCombined = 1;
            }
        });
        var totalEvents = parseInt($('.pos-ticket-header').attr('data-nrevts'));
        if($('.pos-ticket-type-system').hasClass('active') && activeCombined == 0)
        {
            typeTicket = 3;
        }else{
            if(activeCombined == 1){
                typeTicket = 4;
                if(!$('.pos-ticket-button-bv-value-lbl').hasClass('pos-type-ticket-4')){
                    $('.pos-ticket-button-bv-value-lbl').addClass('pos-type-ticket-4');
                    if($('.pos-ticket-footer .pos-ticket-type-system').hasClass('active')){
                        $('.pos-ticket-footer .pos-ticket-type-system').removeClass('active').addClass('pos-btn-disabled');
                    }else{
                        $('.pos-ticket-footer .pos-ticket-type-system').addClass('pos-btn-disabled');
                    }
                }
            }else{
                if($('.pos-ticket-button-bv-value-lbl').hasClass('pos-type-ticket-4')){
                    $('.pos-ticket-button-bv-value-lbl').removeClass('pos-type-ticket-4');
                }
                if($('.pos-ticket-header').attr('data-nrevts') == '1'){
                    typeTicket = 1;
                    $('.pos-ticket-footer .pos-ticket-type-system').addClass('pos-btn-disabled');
                }else{
                    typeTicket = 2;
                    $('.pos-ticket-footer .pos-ticket-type-system').removeClass('pos-btn-disabled');
                }
            }
        }
        var automaticTransfer = 0;
        coupon.odds = arr;
        coupon.oddsCorrect = correctArr;
        coupon.type = typeTicket;
        var couponStrake = parseFloat($('.pos-ticket-coupon-value-bet .pos-ticket-button-bv-value-lbl .pos-ticket-real-bet').html());
        if(couponStrake == '' || couponStrake == 'NaN' || isNaN(couponStrake)) couponStrake = 0;
        coupon.cs = couponStrake;
        coupon.agency = 0;
        var agUserId = 0;
        coupon.aguser = agUserId;
        var TicketId = localStorage.getItem('TEMP_PTKC');
        coupon.ptkc = TicketId;
        coupon.events = totalEvents;
        coupon.atg = automaticTransfer;
        coupon.warnOdd = warnChanged;
        return coupon;
    },
    "setCouponInfo": function(det, eoi, evti){
        if(det == 0)
        {
            var sysBetD = [], couponDetails = rTicketFuncs.getCouponAr();
            var ascOdds = couponDetails.odds.sort(function(a, b){return a-b});
            if(couponDetails.type == 3)
            {
                var arr = [];
                $('.pos-ticket-odd-item').each(function() {
                    $(this).find('.pos-ticket-odd-item-oddslst-itm').each(function(){
                        var theOdd = parseFloat($(this).find('span:nth-child(3)').text());
                        arr.push(parseFloat(theOdd));
                    });
                });
                var jsonCoupon = JSON.parse(localStorage.getItem('couponTemp'));
                if(jsonCoupon != null){
                    var counterItems = 1, counterAux=1, allCombNr = 0;
                    var index=0; for ( index; index<jsonCoupon.length; index++ ) {
                        if(jsonCoupon[index] != null){
                            if(counterItems >= counterAux) {
                                var fixedOdds = 0;
                                var combinationsTot = ticket_combinations(arr.length - fixedOdds, arr.length - counterItems + 1);
                                if(fixedOdds == counterItems && combinationsTot == 0) combinationsTot = 1;
                                allCombNr = (allCombNr+combinationsTot);
                            }
                            counterItems++;
                        }
                    }
                    index=0, counterItems = 1, counterAux=1; for ( index; index<jsonCoupon.length; index++ ) {
                        if(jsonCoupon[index] != null){
                            if(counterItems >= counterAux) {
                                var fixedOdds = 0;
                                var combinationsTot = ticket_combinations(arr.length - fixedOdds, arr.length - counterItems + 1);
                                if(fixedOdds == counterItems && combinationsTot == 0) combinationsTot = 1;
                                if(combinationsTot < 1900 && combinationsTot > 0){
                                    var tyLst = {"ty": counterItems, "bet": (parseFloat(couponDetails.cs)/allCombNr).toFixed(4), "co": parseInt($(this).parent().find('span.comb').text()), "maxb": 0, "maxw": 0, "minb": 0, "minw": 0}
                                    sysBetD.push(tyLst);
                                }
                            }
                            counterItems++;
                        }
                    }
                }
                $('#theCoupon .scrollable #systable ul li input[type="checkbox"]').each(function(){
                    if($(this).attr('id') != 'check_all' && $(this).is(':checked')){
                        var betact = $(this).parent().find('input[type=text]').val();
                        if(betact == '' || isNaN(betact)) {betact = 0;}
                        var minWin = betact*calculateProd(ascOdds, parseFloat($(this).val()));
                        var maxWin = betact*calculateMaxProd(ascOdds, parseFloat($(this).val()));

                    }
                });
            }else{
                var minWin = couponDetails.cs*calculateProd(ascOdds, 1);
                var maxWin = couponDetails.cs*calculateMaxProd(ascOdds, 1);
                sysBetD = [{"ty": 1, "bet": couponDetails.cs, "co": 1, "maxb": 0, "maxw": maxWin, "minb": 0, "minw": minWin}];
            }
            if(sysBetD.length == 0 && couponDetails.type == 3){
                sysBetD = [{"ty": 2, "bet": couponDetails.cs, "co": 1, "maxb": 0, "maxw": 0, "minb": 0, "minw": 0}];
            }else if(sysBetD.length == 0){
                var minWin = couponDetails.cs*calculateProd(ascOdds, 0);
                var maxWin = couponDetails.cs*calculateMaxProd(ascOdds, 0);
                sysBetD = [{"ty": 0, "bet": 0, "co": 0, "maxb": 0, "maxw": maxWin, "minb": 0, "minw": minWin}];
            }

            var jsonToSend;
            if(typeof eoi !== 'undefined' && eoi != 0){
                jsonToSend = {
                    'operationtype': 4002,
                    'info': JSON.stringify({
                        "siteid":configSoftware.site_id,
                        "sessionId":localStorage.getItem('ACTSESS'),
                        "systemCode":configSoftware.sys_code,
                        'opt':6,
                        'ptkc': couponDetails.ptkc,
                        'syty': 1,
                        'ab': couponDetails.cs,
                        'ty': couponDetails.type,
                        'sysBetDet': sysBetD,
                        'lng': configSoftware.language,
                        'eoi': eoi,
                        'evti': evti
                    })
                }
            }else{
                jsonToSend = {
                    'operationtype': 4002,
                    'info': JSON.stringify({
                        "siteid":configSoftware.site_id,
                        "sessionId":localStorage.getItem('ACTSESS'),
                        "systemCode":configSoftware.sys_code,
                        'opt':6,
                        'ptkc': couponDetails.ptkc,
                        'syty': 1,
                        'ab': couponDetails.cs,
                        'ty': couponDetails.type,
                        'sysBetDet': sysBetD,
                        'lng': configSoftware.language
                    })
                }
            }

            $.ajax({
                url: configSoftware.service_p,
                method: "POST",
                dataType: 'json',
                data: jsonToSend,
                success:function (data) {
                    if(data.operationMessage == 'success'){
                        var det = JSON.parse(data.det);
                        console.debug(det);
                        var betValue = $('.pos-ticket-button-bv-value-lbl .pos-ticket-real-bet').html();
                        if(det.type == 4){
                            $('.pos-ticket-button-bv-value-lbl .pos-ticket-integral-bet span:nth-child(2)').html(det.colNumber);
                            $('.pos-ticket-button-bv-value-lbl .pos-ticket-integral-bet span:nth-child(1)').html((parseFloat(betValue)/det.colNumber).toFixed(2));
                        }
                        $('.pos-ticket-bet-infolist').empty()
                            .append('<div class="pos-ticket-bet-infoline">Scommese <span>'+betValue+'</span></div>')
                            .append('<div class="pos-ticket-bet-infoline">Total quote <span>'+det.maxOdd+'</span></div>')
                            .append('<div class="pos-ticket-bet-infoline">&nbsp;</div>')
                            .append('<div class="pos-ticket-bet-infoline">Poss. recompensa <span class="posibleWinLbl">'+det.maxWin+'</span></div>');
                    }
                },
                error: function(xhr, ajaxOptions, thrownError){
                    //showAlertMessage('Error', 'Service unavailable');
                }
            })
        }
    },
    "confirmBet": function(){

        var couponDetails = rTicketFuncs.getCouponAr();

        var url = configSoftware.service_p;

        if(couponDetails.cs > 0 && couponDetails.ptkc != ''){

            if(localStorage.getItem('ACTSESS') == null){
                rTicketFuncs.emptyCoupon();
                rTicketFuncs.generatePreticket(1, couponDetails.ptkc);
                return false;
            }

            if(!$('.pos-ticket-footer .pos-ticket-type-system').hasClass('active'))
            {
                if(couponDetails.type == 1){
                    $.ajax({
                        url: url,
                        method: "POST",
                        dataType: 'json',
                        data:{
                            'operationtype': 4002,
                            'info': JSON.stringify({
                                "siteid":configSoftware.site_id,
                                "sessionId":localStorage.getItem('ACTSESS'),
                                "systemCode":configSoftware.sys_code,
                                'opt':3,
                                'ptkc': couponDetails.ptkc,
                                'puid': couponDetails.aguser,
                                'isa': couponDetails.atg,
                                'ab': couponDetails.cs,
                                'ty': 1,
                                'sysBetDet': [{"ty": 1, "bet": couponDetails.cs, "co": 1, 'maxb': 0, 'maxw': 0, 'minb': 0, 'minw': 0}],
                                'lng': configSoftware.language
                            })
                        },
                        success:function (data) {
                            if(data.operationMessage == 'success'){
                                rTicketFuncs.emptyCoupon();
                                createAlertMessage("success", "Scommessa effettuata con successo.");
                            }
                            else if(data.operationMessage == 'reserve'){
                                add_ticket_reserved(data,couponDetails.ptkc);
                                rTicketFuncs.emptyCoupon();
                            }
                            else {
                                createAlertMessage('error', data.operationMessage)
                            }
                        },
                        error: function(xhr, ajaxOptions, thrownError){
                            createAlertMessage('error', 'Service unavailable');
                        }
                    })
                }else if(couponDetails.type == 2){
                    $.ajax({
                        url: url,
                        method: "POST",
                        dataType: 'json',
                        data:{
                            'operationtype': 4002,
                            'info': JSON.stringify({
                                "siteid":configSoftware.site_id,
                                "sessionId":localStorage.getItem('ACTSESS'),
                                "systemCode":configSoftware.sys_code,
                                'opt':3,
                                'ptkc': couponDetails.ptkc,
                                'puid': couponDetails.aguser,
                                'isa': couponDetails.atg,
                                'ab': couponDetails.cs,
                                'ty': 2,
                                'sysBetDet': [{"ty": 2, "bet": couponDetails.cs, "co": 1, 'maxb': 0, 'maxw': 0, 'minb': 0, 'minw': 0}],
                                'lng': configSoftware.language
                            })
                        },
                        success:function (data) {
                            if(data.operationMessage == 'success'){
                                rTicketFuncs.emptyCoupon();
                                createAlertMessage("success", "Scommessa effettuata con successo.");
                            }
                            else if(data.operationMessage == 'reserve'){
                                add_ticket_reserved(data,couponDetails.ptkc);
                                rTicketFuncs.emptyCoupon();
                            }
                            else {
                                createAlertMessage('Error', data.operationMessage)
                            }
                        },
                        error: function(xhr, ajaxOptions, thrownError){
                            createAlertMessage('error', 'Service unavailable');
                        }
                    })
                }else if (couponDetails.type != 4) {
                } else {
                    $.ajax({
                        url: url,
                        method: "POST",
                        dataType: 'json',
                        data: {
                            'operationtype': 4002,
                            'info': JSON.stringify({
                                "siteid":configSoftware.site_id,
                                "sessionId":localStorage.getItem('ACTSESS'),
                                "systemCode":configSoftware.sys_code,
                                'opt': 3,
                                'ptkc': couponDetails.ptkc,
                                'puid': couponDetails.aguser,
                                'isa': couponDetails.atg,
                                'ab': couponDetails.cs,
                                'ty': 4,
                                'sysBetDet': [{
                                    "ty": 4,
                                    "bet": couponDetails.cs,
                                    "co": 1,
                                    'maxb': 0,
                                    'maxw': 0,
                                    'minb': 0,
                                    'minw': 0
                                }],
                                'lng': configSoftware.language
                            })
                        },
                        success: function (data) {
                            if (data.operationMessage == 'success') {
                                rTicketFuncs.emptyCoupon();
                                createAlertMessage("success", "Scommessa effettuata con successo.");
                            }
                            else if(data.operationMessage == 'reserve'){
                                add_ticket_reserved(data,couponDetails.ptkc);
                                rTicketFuncs.emptyCoupon();
                            }
                            else {
                                createAlertMessage('Error', data.operationMessage)
                            }
                        },
                        error: function(xhr, ajaxOptions, thrownError){
                            createAlertMessage('error', 'Service unavailable');
                        }
                    })
                }
            }
            else
            {
                var sysBetD = [];
                $('#theCoupon .scrollable #systable ul li input[type="checkbox"]').each(function(){
                    if($(this).attr('id') != 'check_all' && $(this).is(':checked')){
                        var tyLst = {"ty": parseInt($(this).val()), "bet": parseFloat($(this).parent().find('input[type=text]').val()), "co": parseInt($(this).parent().find('span.comb').text()), 'maxb': 0, 'maxw': 0, 'minb': 0, 'minw': 0}
                        sysBetD.push(tyLst);
                    }
                });
                $.ajax({
                    url: url,
                    method: "POST",
                    dataType: 'json',
                    data:{
                        'operationtype': 4002,
                        'info': JSON.stringify({
                            "siteid":configSoftware.site_id,
                            "sessionId":localStorage.getItem('ACTSESS'),
                            "systemCode":configSoftware.sys_code,
                            'opt':3,
                            'ptkc': couponDetails.ptkc,
                            'puid': couponDetails.aguser,
                            'isa': couponDetails.atg,
                            'ab': couponDetails.cs,
                            'ty': 3,
                            'sysBetDet': sysBetD,
                            'lng': configSoftware.language
                        })
                    },
                    success:function (data) {
                        if(data.operationMessage == 'success'){
                            rTicketFuncs.emptyCoupon();
                            createAlertMessage("success", "Scommessa effettuata con successo.");
                        }
                        else if(data.operationMessage == 'reserve'){
                            add_ticket_reserved(data,couponDetails.ptkc);
                            rTicketFuncs.emptyCoupon();
                        }
                        else {
                            createAlertMessage('Error', data.operationMessage)
                        }
                    },
                    error: function(xhr, ajaxOptions, thrownError){
                        createAlertMessage('error', 'Service unavailable');
                    }
                })
            }
        }else{
            createAlertMessage('error', 'Coupon empty');
        }
    },
    "generatePreticket": function(print, ptkt){
        var printFunction = '';
        var htmlHead = '<title>Ticket: '+ptkt+'</title><style type="text/css" media="print"></style>';
        htmlHead += printFunction+'<link rel="stylesheet" media="all" href="assets/css/ticket.new.css"><link rel="stylesheet" media="all" href="assets/css/ticket_print_view.css"><style>@media print { @page {margin-top:0px;margin-bottom:0px;} body {padding-top:72px;padding-bottom:72px;} }</style>';
        var htmlCoupon = '<div class="ticketHeader"><div class="xlive-logo">XLIVE</div><div class="no_media_print">&nbsp;</div><p>Mandate accepted on: <b></b></p><p>Code of acceptance: <b>'+ptkt+'</b></p></div>';
        htmlCoupon += '<div class="ticketFooter"><div id="barcodeTarget" class="barcodeTarget"></div><p style="text-align:center;">Bet reserved</p></div>';
        var BarcodeSettings = {
            bgColor: '#FFF',
            color: '#000',
            barWidth: '2',
            barHeight: '50',
            moduleSize: '5',
            posX: '10',
            posY: '20',
            addQuietZone: '1'
        };
        var barvalid = ptkt;
        var windowTicket = window.open("", "Ticket: "+ptkt, "tollbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizeables=no,width=520,height=700");
        if (windowTicket == null || typeof(windowTicket)=='undefined') {

            createAlertMessage("warning", "No allowed!");

        }else{
            $(windowTicket.document.body).ready(function(){
                $(windowTicket.document.body).append(htmlCoupon);
                $(windowTicket.document.head).append(htmlHead);
                $(windowTicket.document.body).find('#barcodeTarget').barcode(barvalid, 'code128', BarcodeSettings);
                if(print == 1){windowTicket.focus();setTimeout(function(){windowTicket.print();windowTicket.close();},1001);}
            });
        }
    },

};

function constructCouponDetails(data){
    var det = JSON.parse(data.det);
    console.debug("Ticket det", det);
    var info = JSON.parse(data.info);
    console.debug("Ticket info", info);

    var create_date = new Date(info.cr);
    var dayCreateTicket = create_date.getDay();
    dayCreateTicket = (dayCreateTicket.toString().length == 1 ? '0'+dayCreateTicket : dayCreateTicket);
    var monthCreateTicket = (create_date.getMonth()+1);
    monthCreateTicket = (monthCreateTicket.toString().length == 1 ? '0'+monthCreateTicket : monthCreateTicket);
    var hourCreateTicket = create_date.getHours();
    hourCreateTicket = (hourCreateTicket.toString().length == 1 ? '0'+hourCreateTicket : hourCreateTicket);
    var minuteCreateTicket = create_date.getMinutes();
    minuteCreateTicket = (minuteCreateTicket.toString().length == 1 ? '0'+minuteCreateTicket : minuteCreateTicket);

    var ticket_type = 'Single';
    if(info.ty == 1){
        ticket_type = 'Single';
    }else if(info.ty == 2){
        ticket_type = 'Multiple';
    }else if(info.ty == 3){
        ticket_type = 'Integral';
    }else if(info.ty == 4){
        ticket_type = 'Combined';
    }

    var status_ticket = '-';
    if(info.status == 0){
        status_ticket = 'CHIUSO';
    }else if(info.status == 1){
        status_ticket = 'APERTO';
    }

    var eventsHtml = '';
    $.each(info.ticketDettailMap, function(i,v){
        $.each(v, function(ei,ev){
            var event_date = new Date(ev.evtd);
            var eventDay = event_date.getDay();
            eventDay = (eventDay.toString().length == 1 ? '0'+eventDay : eventDay);
            var eventMonth = (event_date.getMonth());
            eventMonth = (eventMonth.toString().length == 1 ? '0'+eventMonth : eventMonth);

            var status_event = '-';
            if(info.status == 0){
                status_event = 'CHIUSO';
            }else if(info.status == 1){
                status_event = 'APERTO';
            }

            eventsHtml += '                <tr style="'+(ev.isw ? 'background:rgba(0, 230, 0, 0.4);' : (info.status == 1 ? 'background: rgba(230, 187, 20, 0.4);' : 'background:rgba(230, 1, 4, 0.4);'))+'">\n' +
                '                    <td>'+generateHtmlSportIcon(ev.si)+'</td>\n' +
                '                    <td>'+ev.cgn+', '+ev.cn+'<br />'+ev.evtn+'<br />'+eventDay+'/'+eventMonth+'/'+event_date.getFullYear()+'</td>\n' +
                '                    <td>Resto de la partita: '+(ev.evtr !== null ? ev.evtr : '-')+'<br />'+ev.odtn+': '+ev.oddn+'</td>\n' +
                '                    <td>'+ev.ov+'</td>\n' +
                '                    <td>-</td>\n' +
                '                    <td>'+status_event+'</td>\n' +
                '                </tr>\n' ;
        });
    });

    $('#ticket-details').html('<div class="pos-ticket-lbl-id">Numbero del biglietto '+info.code+'</div>\n' +
        '        <div class="pos-ticket-details-table" style="border-right: 1px solid #000;">\n' +
        '            <div class="pos-ticket-details-line">\n' +
        '                Scommesse <span>'+info.tb+'</span>\n' +
        '            </div>\n' +
        '            <div class="pos-ticket-details-line">\n' +
        '                Bonus <span>'+info.bonus+'</span>\n' +
        '            </div>\n' +
        '            <div class="pos-ticket-details-line">\n' +
        '                Quota totale <span>'+info.maxOdds+'</span>\n' +
        '            </div>\n' +
        '            <div class="pos-ticket-details-line">\n' +
        '                Tipo scommessa <span>'+ticket_type+'</span>\n' +
        '            </div>\n' +
        '            <div class="pos-ticket-details-line">\n' +
        '                Vincita massima <span>'+info.maxWin+'</span>\n' +
        '            </div>\n' +
        '            <div class="pos-ticket-details-line">\n' +
        '                Min. poss. payout <span>'+info.minWin+'</span>\n' +
        '            </div>\n' +
        '            <div class="pos-ticket-details-line">\n' +
        '                &nbsp;\n' +
        '            </div>\n' +
        '            <div class="pos-ticket-details-line">\n' +
        '                &nbsp;\n' +
        '            </div>\n' +
        '            <div class="pos-ticket-details-line">\n' +
        '                &nbsp;\n' +
        '            </div>\n' +
        '            <div class="pos-ticket-details-line">\n' +
        '                &nbsp;\n' +
        '            </div>\n' +
        '        </div><div class="pos-ticket-details-table">\n' +
        '        <div class="pos-ticket-details-line">\n' +
        '            Stato <span>'+status_ticket+'</span>\n' +
        '        </div>\n' +
        '        <div class="pos-ticket-details-line">\n' +
        '            Creato in data <span>'+dayCreateTicket+'/'+monthCreateTicket+'/'+create_date.getFullYear()+' '+hourCreateTicket+':'+minuteCreateTicket+'</span>\n' +
        '        </div>\n' +
        '        <div class="pos-ticket-details-line">\n' +
        '            Utente <span>'+info.uname+'</span>\n' +
        '        </div>\n' +
        '        <div class="pos-ticket-details-line">\n' +
        '            &nbsp;\n' +
        '        </div>\n' +
        '        <div class="pos-ticket-details-line">\n' +
        '            &nbsp;\n' +
        '        </div>\n' +
        '        <div class="pos-ticket-details-line">\n' +
        '            &nbsp;\n' +
        '        </div>\n' +
        '        <div class="pos-ticket-details-line">\n' +
        '            &nbsp;\n' +
        '        </div>\n' +
        '        <div class="pos-ticket-details-line">\n' +
        '            &nbsp;\n' +
        '        </div>\n' +
        '        <div class="pos-ticket-details-line">\n' +
        '            &nbsp;\n' +
        '        </div>\n' +
        '        <div class="pos-ticket-details-line">\n' +
        '            &nbsp;\n' +
        '        </div>\n' +
        '    </div>\n' +
        '        <div>\n' +
        '            <div class="pos-lblstatus-checkticket">'+status_ticket+'</div>\n' +
        '        </div>\n' +
        '        <div class="pos-table-content-scroll">\n' +
        '            <table class="pos-table-ticket">\n' +
        '                <thead>\n' +
        '                <tr><th>&nbsp;</th><th>Evento</th><th>Pronostico</th><th>Quota</th><th>Corretto</th><th>Stato</th></tr>\n' +
        '                </thead>\n' +
        '                <tbody>\n' + eventsHtml +
        '                </tbody>\n' +
        '            </table>\n' +
        '        </div>\n' +
        '        <div class="pos-checkticket-table-acts">\n' +
        '            <div class="pos-button-ct-action" data-action="upall"><span class="fa fa-angle-double-up" aria-hidden="true"></span></div>\n' +
        '            <div class="pos-button-ct-action" data-action="up"><i class="fa fa-angle-up" aria-hidden="true"></i></div>\n' +
        '            <div class="pos-button-ct-action" data-action="down"><i class="fa fa-angle-down" aria-hidden="true"></i></div>\n' +
        '        </div>')
}