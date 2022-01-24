const mathApp = {};

mathApp.sign = [
    {
        visual: '➕',
        factor: '+'
    },
    {   
        visual: '➖',
        factor: '-'
    },
    {
        visual: '✖',
        factor: '*'
    },
    {
        visual: '➗',
        factor: '/'
    }
    ]


mathApp.start = $('.javaStartButton').on('click',function(){
    $('.javaStartHUD').hide();
})


mathApp.init = function(){
    console.log('test');
    mathApp.start;
}

$(document).ready(function(){
    mathApp.init();
});