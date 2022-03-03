var selectedChar = null;
var WelcomePercentage = "30vh"
ctrpMultiCharacters = {}
var Loaded = false;

$(document).ready(function (){
    window.addEventListener('message', function (event) {
        var data = event.data;

        if (data.action == "ui") {
            if (data.toggle) {
                $('.container').show();
                $(".welcomescreen").fadeIn(250);
                ctrpMultiCharacters.resetAll();

                var originalText = "Retrieve player information";
                var loadingProgress = 0;
                var loadingDots = 0;
                $("#loading-text").html(originalText);
                var DotsInterval = setInterval(function() {
                    $("#loading-text").append(".");
                    loadingDots++;
                    loadingProgress++;
                    if (loadingProgress == 3) {
                        originalText = "Validate player data"
                        $("#loading-text").html(originalText);
                    }
                    if (loadingProgress == 4) {
                        originalText = "Retrieve player characters"
                        $("#loading-text").html(originalText);
                    }
                    if (loadingProgress == 6) {
                        originalText = "Validate player characters"
                        $("#loading-text").html(originalText);
                    }
                    if(loadingDots == 4) {
                        $("#loading-text").html(originalText);
                        loadingDots = 0;
                    }
                }, 500);

                setTimeout(function(){
                    $.post('https://qb-multicharacter/setupCharacters');
                    setTimeout(function(){
                        clearInterval(DotsInterval);
                        loadingProgress = 0;
                        originalText = "Get data";
                        $(".welcomescreen").fadeOut(550);
                        ctrpMultiCharacters.fadeInDown('.character-info', '20%', 400);
                        ctrpMultiCharacters.fadeInDown('.characters-list', '20%', 400);
                        $.post('https://qb-multicharacter/removeBlur');
                    }, 2000);
                }, 2000);
            } else {
                $('.container').fadeOut(250);
                ctrpMultiCharacters.resetAll();
            }
        }

        if (data.action == "setupCharacters") {
            setupCharacters(event.data.characters)
        }

        if (data.action == "setupCharInfo") {
            setupCharInfo(event.data.chardata)
        }
    });

    $('.datepicker').datepicker();
});

$('.continue-btn').click(function(e){
    e.preventDefault();

    // ctrpMultiCharacters.fadeOutUp('.welcomescreen', undefined, 400);
    // ctrpMultiCharacters.fadeOutDown('.server-log', undefined, 400);
    // setTimeout(function(){
    //     ctrpMultiCharacters.fadeInDown('.characters-list', '20%', 400);
    //     ctrpMultiCharacters.fadeInDown('.character-info', '20%', 400);
    //     $.post('https://qb-multicharacter/setupCharacters');
    // }, 400)
});

$('.disconnect-btn').click(function(e){
    e.preventDefault();

    $.post('https://qb-multicharacter/closeUI');
    $.post('https://qb-multicharacter/disconnectButton');
});

function setupCharInfo(cData) {
    if (cData == 'empty') {
        $('.character-info-valid').html('<span class="no-char">The selected character slot is not yet in use.<br>This character has no information yet.</span>');
    } else {
        var gender = "Man"
        if (cData.charinfo.gender == 1) { gender = "Woman" }
        $('.character-info-valid').html(
        '<br><br><div class="character-info-box"><span id="info-label2">'+cData.charinfo.firstname+' '+cData.charinfo.lastname+'</span></div>' +
        '<div class="character-info-box"><span id="info-label3">DATE-OF-BIRTH : '+cData.charinfo.birthdate+' | SEX : '+gender+'</span></div>' +
        '<div class="character-info-box"><span id="info-label4">'+cData.charinfo.nationality+' | JOB : '+cData.job.label+'-'+cData.job.gradelabel+'</span></div>' +
        '<div class="character-info-box"><span id="info-label6">PH.NO - </span><span id="aisee">'+cData.charinfo.phone+'</span></div><br>' +
        '<div class="character-info-box"><span id="info-label6">CASH -</span><span id="info-label5">&dollar; '+cData.money.cash+'</span></div>' +
        '<div class="character-info-box"><span id="info-label6">BANK -</span><span id="info-label5">&dollar; '+cData.money.bank+'</span></div>'
        
        );
    }
}

function setupCharacters(characters) {
    $.each(characters, function(index, char){
        $('#char-'+char.cid).html("");
        $('#char-'+char.cid).data("citizenid", char.citizenid);
        setTimeout(function(){
            $('#char-'+char.cid).html('<span id="slot-name">'+char.charinfo.firstname+' '+char.charinfo.lastname+'<span id="cid">' + char.citizenid + '</span></span>');
            $('#char-'+char.cid).data('cData', char)
            $('#char-'+char.cid).data('cid', char.cid)
        }, 100)
    })
}

$(document).on('click', '#close-log', function(e){
    e.preventDefault();
    selectedLog = null;
    $('.welcomescreen').css("filter", "none");
    $('.server-log').css("filter", "none");
    $('.server-log-info').fadeOut(250);
    logOpen = false;
});

$(document).on('click', '.character', function(e) {
    var cDataPed = $(this).data('cData');
    e.preventDefault();
    if (selectedChar === null) {
        selectedChar = $(this);
        if ((selectedChar).data('cid') == "") {
            $(selectedChar).addClass("char-selected");
            setupCharInfo('empty')
            $("#play-text").html("+");
            $("#play").css({"display":"block"});
            $("#delete").css({"display":"none"});
            $.post('https://qb-multicharacter/cDataPed', JSON.stringify({
                cData: cDataPed
            }));
        } else {
            $(selectedChar).addClass("char-selected");
            setupCharInfo($(this).data('cData'))
            $("#play-text").html("ᐅ");
            $("#delete-text").html("X");
            $("#play").css({"display":"block"});
            $("#delete").css({"display":"block"});
            $.post('https://qb-multicharacter/cDataPed', JSON.stringify({
                cData: cDataPed
            }));
        }
    } else if ($(selectedChar).attr('id') !== $(this).attr('id')) {
        $(selectedChar).removeClass("char-selected");
        selectedChar = $(this);
        if ((selectedChar).data('cid') == "") {
            $(selectedChar).addClass("char-selected");
            setupCharInfo('empty')
            $("#play-text").html("+");
            $("#play").css({"display":"block"});
            $("#delete").css({"display":"none"});
            $.post('https://qb-multicharacter/cDataPed', JSON.stringify({
                cData: cDataPed
            }));
        } else {
            $(selectedChar).addClass("char-selected");
            setupCharInfo($(this).data('cData'))
            $("#play-text").html("ᐅ");
            $("#delete-text").html("X");
            $("#play").css({"display":"block"});
            $("#delete").css({"display":"block"});
            $.post('https://qb-multicharacter/cDataPed', JSON.stringify({
                cData: cDataPed
            }));
        }
    }
});

$(document).on('click', '#create', function(e){
    e.preventDefault();
    $.post('https://qb-multicharacter/createNewCharacter', JSON.stringify({
        firstname: $('#first_name').val(),
        lastname: $('#last_name').val(),
        nationality: $('#nationality').val(),
        birthdate: $('#birthdate').val(),
        gender: $('select[name=gender]').val(),
        cid: $(selectedChar).attr('id').replace('char-', ''),
    }));
    $(".container").fadeOut(150);
    $('.characters-list').css("filter", "none");
    $('.character-info').css("filter", "none");
    ctrpMultiCharacters.fadeOutDown('.character-register', '125%', 400);
    refreshCharacters()
});

$(document).on('click', '#accept-delete', function(e){
    $.post('https://qb-multicharacter/removeCharacter', JSON.stringify({
        citizenid: $(selectedChar).data("citizenid"),
    }));
    $('.character-delete').fadeOut(150);
    $('.characters-block').css("filter", "none");
    refreshCharacters()
});

function refreshCharacters() {
    $('.characters-list').html('<div class="character" id="char-1" data-cid=""><span id="slot-name">Empty Slot<span id="cid"></span></span></div><div class="character" id="char-2" data-cid=""><span id="slot-name">Empty Slot<span id="cid"></span></span></div><div class="character" id="char-3" data-cid=""><span id="slot-name">Empty Slot<span id="cid"></span></span></div><div class="character" id="char-4" data-cid=""><span id="slot-name">Empty Slot<span id="cid"></span></span></div><div class="character" id="char-5" data-cid=""><span id="slot-name">Empty Slot<span id="cid"></span></span></div><div class="character-btn" id="play"><p id="play-text">Select a character</p></div><div class="character-btn" id="delete"><p id="delete-text">Select a character</p></div>')
    setTimeout(function(){
        $(selectedChar).removeClass("char-selected");
        selectedChar = null;
        $.post('https://qb-multicharacter/setupCharacters');
        $("#delete").css({"display":"none"});
        $("#play").css({"display":"none"});
        ctrpMultiCharacters.resetAll();
    }, 100)
}

$("#close-reg").click(function (e) {
    e.preventDefault();
    $('.characters-list').css("filter", "none")
    $('.character-info').css("filter", "none")
    ctrpMultiCharacters.fadeOutDown('.character-register', '125%', 400);
})

$("#close-del").click(function (e) {
    e.preventDefault();
    $('.characters-block').css("filter", "none");
    $('.character-delete').fadeOut(150);
})

$("#cancel-text").click(function (e) {
    e.preventDefault();
    $('.characters-block').css("filter", "none");
    $('.character-delete').fadeOut(150);
})

$(document).on('click', '#play', function(e) {
    e.preventDefault();
    var charData = $(selectedChar).data('cid');

    if (selectedChar !== null) {
        if (charData !== "") {
            $.post('https://qb-multicharacter/selectCharacter', JSON.stringify({
                cData: $(selectedChar).data('cData')
            }));
            // ctrpMultiCharacters.fadeInDown('.welcomescreen', WelcomePercentage, 400);
            // ctrpMultiCharacters.fadeInDown('.server-log', '25%', 400);
            setTimeout(function(){
                ctrpMultiCharacters.fadeOutDown('.characters-list', "-40%", 400);
                ctrpMultiCharacters.fadeOutDown('.character-info', "-40%", 400);
                ctrpMultiCharacters.resetAll();
            }, 1500);
        } else {
            $('.characters-list').css("filter", "blur(1000px)")
            $('.character-info').css("filter", "blur(1000px)")
            ctrpMultiCharacters.fadeInDown('.character-register', '25%', 400);
        }
    }
});

$(document).on('click', '#delete', function(e) {
    e.preventDefault();
    var charData = $(selectedChar).data('cid');

    if (selectedChar !== null) {
        if (charData !== "") {
            $('.characters-block').css("filter", "blur(2px)")
            $('.character-delete').fadeIn(250);
        }
    }
});

ctrpMultiCharacters.fadeOutUp = function(element, time) {
    $(element).css({"display":"block"}).animate({top: "-80.5%",}, time, function(){
        $(element).css({"display":"none"});
    });
}

ctrpMultiCharacters.fadeOutDown = function(element, percent, time) {
    if (percent !== undefined) {
        $(element).css({"display":"block"}).animate({top: percent,}, time, function(){
            $(element).css({"display":"none"});
        });
    } else {
        $(element).css({"display":"block"}).animate({top: "103.5%",}, time, function(){
            $(element).css({"display":"none"});
        });
    }
}

ctrpMultiCharacters.fadeInDown = function(element, percent, time) {
    $(element).css({"display":"block"}).animate({top: percent,}, time);
}

ctrpMultiCharacters.resetAll = function() {
    $('.characters-list').hide();
    $('.characters-list').css("top", "-40");
    $('.character-info').hide();
    $('.character-info').css("top", "-40");
    // $('.welcomescreen').show();
    //$('.welcomescreen').css("top", WelcomePercentage);
    $('.server-log').show();
    $('.server-log').css("top", "25%");
}
