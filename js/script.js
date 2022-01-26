const mathApp = {};

mathApp.RandomSign = function(unique){
    const randomIndex = Math.floor(Math.random() * unique.length);
    return unique[randomIndex];
}

mathApp.easySign = [
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
    }]
mathApp.easyCalc = function(var1,var2,sign){
    let ans = 0;
    switch(sign){
        case '+':
            ans = var1 + var2;
            return Number(ans);
        case '-':
            ans = var1 - var2;
            return Number(ans);
        case '*':
            ans = var1 * var2;
            return Number(ans);
        case '/':
            ans = var1 / var2;
            if(!Number.isInteger(ans)){
                ans = ans.toFixed(1);
            }
            return Number(ans);
    }
}
mathApp.easyLongCalc = function(var1,var2,var3,sign1,sign2){
    let ans = 0;
    switch(true){
        case (sign1 === '+' && sign2 === '+'):
            ans = var1 + var2 + var3;
            return Number(ans);
        case (sign1 === '+' && sign2 === '-'):
            ans = var1 + var2 - var3;
            return Number(ans);
        case (sign1 === '+' && sign2 === '*'):
            ans = var1 + var2 * var3;
            return Number(ans);
        case (sign1 === '-' && sign2 === '+'):
            ans = var1 - var2 + var3;
            return Number(ans);
        case (sign1 === '-' && sign2 === '-'):
            ans = var1 - var2 - var3;
            return Number(ans);
        case (sign1 === '-' && sign2 === '*'):
            ans = var1 - var2 * var3;
            return Number(ans);
        case (sign1 === '*' && sign2 === '+'):
            ans = var1 * var2 + var3;
            return Number(ans);
        case (sign1 === '*' && sign2 === '-'):
            ans = var1 * var2 - var3;
            return Number(ans);
        case (sign1 === '*' && sign2 === '*'):
            ans = var1 * var2 * var3;
            return Number(ans);
    }
}

mathApp.TotalScore = 0;
mathApp.TotalQuestion = 0;

mathApp.scoreBoard = function(){
    mathApp.TotalScore++;
    $('.javaUserScore').html(`Score: ${mathApp.TotalScore * 100}`);
}

mathApp.start = $('.javaStartButton').on('click',function(){
    mathApp.TotalQuestion++;
    $('.javaQuestionTrack').html(`Question ${mathApp.TotalQuestion}:`)
    $('.javaUserAnswer').val('');
    $('.javaStartHUD, .javaGameResult').hide();
    $('.javaGameHUD').show();
    let x = (Math.floor(Math.random() * 10) + 1),
    y = (Math.floor(Math.random() * 10) + 1);
    let questionSign = mathApp.RandomSign(mathApp.easySign)
    $('.javaGameQuestion').show().html(`${x} ${questionSign.visual} ${y} = <span>?</span>`);
    mathApp.computerAnswer = mathApp.easyCalc(x,y,questionSign.factor);
    
    // javaGameQuestion
})

mathApp.Submit = $('.javaUserSubmit').on('click',function(){
    let userAnswer = parseInt($('.javaUserAnswer').val().trim())
    if (userAnswer === "" || isNaN(userAnswer)){
        $('.javaGameResult').show().html('Please enter the answer :)');
    }else{
    switch(userAnswer){
        case mathApp.computerAnswer:
        case (mathApp.computerAnswer).toFixed(1):
            mathApp.scoreBoard();
            $('.javaUserSubmit').hide();
            $('.javaGameResult').css('color','lightgreen');
            $('.javaGameResult').hide().delay().slideDown(500).html('Correct!');
            $('.javaUserNext').show();
            break;
        default:
            $('.javaUserSubmit').hide();
            $('.javaGameResult').css('color','red');
            $('.javaGameResult').hide().delay().slideDown(500).html('Try again!');
            $('.javaUserNext').show();
            break;
        }
    }
})

mathApp.Next = $('.javaUserNext').on('click',function(){
    mathApp.TotalQuestion++;
    $('.javaQuestionTrack').html(`Question ${mathApp.TotalQuestion}:`)
    $('.javaUserAnswer').val('');
    $('.javaUserNext, .javaGameResult').hide();
    $('.javaUserSubmit').show();
    if (mathApp.TotalQuestion === 6){
        $('.javaGameHUD').hide();
        $('.javaEndHUD').show();
        $('.javaResultScore').hide().delay().slideDown(500).html(`Your Score: ${mathApp.TotalScore * 100}`);
    }else{
    let ranProbability = Math.random();

    switch(true){
        case (ranProbability <= 0.5):
        //easy question
            x = (Math.floor(Math.random() * 10) + 1),
            y = (Math.floor(Math.random() * 10) + 1);
            let questionSign = mathApp.RandomSign(mathApp.easySign)
            $('.javaGameQuestion').show().html(`${x} ${questionSign.visual} ${y} = <span>?</span>`);
            mathApp.computerAnswer = mathApp.easyCalc(x,y,questionSign.factor);
            break;
        case (ranProbability > 0.5):
            x = (Math.floor(Math.random() * 10) + 1),
            y = (Math.floor(Math.random() * 10) + 1),
            z = (Math.floor(Math.random() * 10) + 1);
            let questionSign1 = mathApp.RandomSign(mathApp.easySign)
            let questionSign2 = mathApp.RandomSign(mathApp.easySign)
            $('.javaGameQuestion').show().html(`${x} ${questionSign1.visual} ${y} ${questionSign2.visual} ${z} = <span>?</span>`);
            mathApp.computerAnswer = mathApp.easyLongCalc(x,y,z,questionSign1.factor,questionSign2.factor);
            break;
    }}
})

mathApp.Restart = $('.javaUserReplay').on('click',function(){
    $('.javaEndHUD').hide();
    $('.javaStartHUD').show();
    mathApp.TotalScore = 0;
    mathApp.TotalQuestion = 0;
    $('.javaUserScore').html(`Score: ${mathApp.TotalScore * 100}`);
})


//Audio Part
$('.javaStartButton, .javaUserSubmit, .javaUserReplay, .javaUserNext').mouseenter(function(){
    audioHover = document.getElementById('javaMStartHover');
    audioHover.volume = 0.15;
    audioHover.play();
})

$('.javaStartButton, .javaUserSubmit, .javaUserReplay, .javaUserNext').mouseleave(function(){
    audioHover = document.getElementById('javaMStartHover');
    audioHover.pause();
    audioHover.currentTime = 0;
})

$('.javaStartButton').click(function() {
    audioClick = document.getElementById('javaMStart');
    audioClick.volume = 0.15;
    audioClick.play();
    audioBGM = document.getElementById('javaMBgm');
    audioBGM.volume = 0.033;
    audioBGM.loop = true;
    setTimeout(function(){audioBGM.play()}, 2500);
})

$('.javaUserSubmit, .javaUserReplay').click(function() {
    audioClick = document.getElementById('javaMStart');
    audioClick.pause();
    audioClick.currentTime = 0;
    audioClick.volume = 0.15;
    audioClick.play();
})

$('.javaUserReplay').click(function() {
    audioBGM = document.getElementById('javaMBgm');
    const fadeAudio = setInterval(() => {
        if (audioBGM.volume !== 0) {
          audioBGM.volume -= 0.001
          audioBGM.volume = audioBGM.volume.toFixed(4)
        }
        if (audioBGM.volume < 0.0001) {
            audioBGM.pause();
            audioBGM.currentTime = 0;
          clearInterval(fadeAudio);
        }
        $('.javaStartButton').click(function() {
            audioBGM.volume = 0.033;
            clearInterval(fadeAudio);
        })
      }, 50);

})


mathApp.init = function(){
    mathApp.start;
}

$(document).ready(function(){
    mathApp.init();
});