const clockJava = {};

clockJava.tick = function(){
    let currentTimer = new Date();
    let hour = currentTimer.getHours();
    let minute = currentTimer.getMinutes();
    let second = currentTimer.getSeconds();
    let ampm = 'AM';
    if(hour === 0){
        hour = 12;
    }
    if(hour > 12){
            hour = hour - 12;
            ampm = 'PM';
    }
    let Sum = [hour,minute,second]
        for(i = 0; i < Sum.length; i++){
            if(Sum[i].toString().length === 1){
                Sum[i] = '0' + Sum[i];
            }
        }
    $(`#javaClockDisplay`).html(`${Sum[0]} : ${Sum[1]} : ${Sum[2]} ${ampm}`)
    setTimeout(clockJava.tick, 1000);
}

clockJava.init = function(){
    clockJava.tick();
}

$(document).ready(function(){
    clockJava.init();
    
});