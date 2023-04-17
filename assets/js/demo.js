var version = '1.0.0b';
var inactivityTimer = 0;

function hiddeAlertMessage(){
    $('.pos-alert-message').hide();
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

$(document).ready(function(){
    var timer_datetime = null;
    timer_datetime = setInterval(function(){
        d = new Date();
        $('#pos-local-time').text(d.toLocaleDateString()+' '+d.toLocaleTimeString());
        if(inactivityTimer > 300){
            if(!$('.pos-cover-start').is(':visible')) $('.pos-cover-start').fadeIn();
        }else{
            inactivityTimer++;
        }
    }, 1000);

    $('.pos-details-software').html('<span id="pos-local-time">-</span><br />ID '+configSoftware.site_id+' ('+configSoftware.client_name+') - Version: '+version);

    cKeyboard_config.input_target ="#username";
    cKeyboard();

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


});


$(document).off('click', 'body');
$(document).on('click', 'body', function(e){
    inactivityTimer = 0;
});

$(document).off('click', '.pos-ticket-footer .pos-ticket-type-system');
$(document).on('click', '.pos-ticket-footer .pos-ticket-type-system', function(e){
    if(!$('.pos-ticket-button-bv-value-lbl').hasClass('pos-type-ticket-4')){
        $(this).toggleClass('active');
    }
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

$(document).off('click', '.pos-checkticket-table-acts .pos-button-ct-action');
$(document).on('click', '.pos-checkticket-table-acts .pos-button-ct-action', function(e){
    var element = $('.pos-table-content-scroll');
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
});

$(document).off('click', '.pos-cover-start');
$(document).on('click', '.pos-cover-start', function(e){
    $(this).fadeOut();
});

$(document).off('click', '.pos-footer-acts .button-pos-act');
$(document).on('click', '.pos-footer-acts .button-pos-act', function(e){
    var action = $(this).attr('data-action');
    if(action == 'close'){
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

$(document).off('click', '.pos-content .pos-content-sport-menu .pos-sport-menu-optlst > ul > li > a');
$(document).on('click', '.pos-content .pos-content-sport-menu .pos-sport-menu-optlst > ul > li > a', function(e){
    $(this).parent().toggleClass('pos-sp-menu-opened');
});

$(document).off('click', '.pos-content-events-list .pos-sport-event-item-view-details, .pos-content-events-list .pos-sport-event-item-view-moddsv');
$(document).on('click', '.pos-content-events-list .pos-sport-event-item-view-details, .pos-content-events-list .pos-sport-event-item-view-moddsv', function(e){
    if(!$('body').hasClass('event-view')) $('body').addClass('event-view');
    $('.pos-content-events-view').removeClass('active');
    $('.pos-content-event-view').addClass('active');
    if(!$('.pos-content-event-view .pos-content-event-list').hasClass('liveEventView')) $('.pos-content-event-view .pos-content-event-list').addClass('liveEventView');
});

function clickOdd(object, ci, ei, gi, qi, en, cn, oddtn, oddn, ha, evdt, syty){
    if($(object).hasClass('pos-oddv-selected')){
        $(object).removeClass('pos-oddv-selected');
    }else{
        $(object).addClass('pos-oddv-selected');
    }
}
