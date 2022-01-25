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
            console.log(ans);
            return Number(ans);
        case '-':
            ans = var1 - var2;
            console.log(ans);
            return Number(ans);
        case '*':
            ans = var1 * var2;
            console.log(ans);
            return Number(ans);
        case '/':
            ans = var1 / var2;
            console.log(ans);
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
    $('.javaUserAnswer').val('');
    $('.javaStartHUD, .javaGameResult').hide();
    $('.javaGameHUD').show();
    let x = (Math.floor(Math.random() * 10) + 1),
    y = (Math.floor(Math.random() * 10) + 1);
    let questionSign = mathApp.RandomSign(mathApp.easySign)
    $('.javaGameQuestion').show().html(`${x} ${questionSign.visual} ${y} = <span>?</span>`);
    mathApp.computerAnswer = mathApp.easyCalc(x,y,questionSign.factor);
    mathApp.TotalQuestion++;
    // javaGameQuestion
})

mathApp.Submit = $('.javaUserSubmit').on('click',function(){
    let userAnswer = parseInt($('.javaUserAnswer').val().trim())
    console.log(userAnswer);
    console.log(isNaN(userAnswer));
    console.log(mathApp.computerAnswer);
    if (userAnswer === "" || isNaN(userAnswer)){
        $('.javaGameResult').html('Please enter the answer :)');
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
    $('.javaUserAnswer').val('');
    $('.javaUserNext, .javaGameResult').hide();
    $('.javaUserSubmit').show();
    if (mathApp.TotalQuestion === 6){
        $('.javaGameHUD').hide();
        $('.javaEndHUD').show();
        $('.javaResultScore').hide().delay().slideDown(500).html(`Your Score: ${mathApp.TotalScore * 100}`);
    }else{
    let ranProbability = Math.random();
    console.log(ranProbability);

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



mathApp.init = function(){
    mathApp.start;
}

$(document).ready(function(){
    mathApp.init();
});