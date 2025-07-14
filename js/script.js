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

mathApp.start = $('.javaStartButton').on('click', function () {
    // Block user interactions
    $('#uiBlocker').show();

    // Animate start HUD out
    $('.javaStartHUD')
        .addClass('transition-hide')
        .delay(100)
        .queue(function (next) {
            $(this).addClass('hide');
            next();
        });

    // Wait for exit animation, then show game HUD
    setTimeout(() => {
        $('.javaStartHUD').hide();

        // Show game HUD with animation
        $('.javaGameHUD')
            .css('display', 'flex')
            .addClass('show');

        // Reset state
        mathApp.TotalQuestion++;
        $('.javaQuestionTrack').html(`Question ${mathApp.TotalQuestion}:`);
        $('.javaUserAnswer').val('');
        $('.javaGameResult').hide();

        let x = Math.floor(Math.random() * 10) + 1,
            y = Math.floor(Math.random() * 10) + 1;
        let questionSign = mathApp.RandomSign(mathApp.easySign);

        $('.javaGameQuestion').show().html(`${x} ${questionSign.visual} ${y} = <span>?</span>`);
        mathApp.computerAnswer = mathApp.easyCalc(x, y, questionSign.factor);

        // Unblock interactions
        $('#uiBlocker').fadeOut(200);
    }, 500); // Matches CSS transition time
});

mathApp.Submit = $('.javaUserSubmit').on('click', function() {
    let rawInput = $('.javaUserAnswer').val().trim();
    if (rawInput === "") {
        $('.javaGameResult').css('color', 'orange').show().html('Please enter the answer :)');
        return;
    }
    
    let userAnswer = parseFloat(rawInput);
    if (isNaN(userAnswer)) {
        $('.javaGameResult').css('color', 'orange').show().html('Please enter a valid number :)');
        return;
    }

    // Compare using number with some tolerance for decimals (if needed)
    let correctAnswer = mathApp.computerAnswer;
    let isCorrect = (Math.abs(userAnswer - correctAnswer) < 0.01); // tolerance for float answers

    $('.javaUserSubmit').hide();
    $('.javaUserAnswer').prop('disabled', true);

    if (isCorrect) {
        mathApp.scoreBoard();
        $('.javaGameResult').css('color', 'lightgreen')
        .show().html('Correct! :)');
    } else {
        $('.javaGameResult').css('color', 'orange')
        .show()
        .html(`Almost! The correct answer is <strong>${correctAnswer}</strong>. Let's move on! 🚀`);
    }

    $('.javaUserNext').show();
});

mathApp.Next = $('.javaUserNext').on('click', function () {
    // Check if quiz has ended
    if (mathApp.TotalQuestion === 5) {
        showEndScreen();
    } else {
        mathApp.TotalQuestion++;
        // UI reset for next question
        resetUIForNextQuestion();
        // Generate and display next question
        generateQuestion();
    }

});


function resetUIForNextQuestion() {
    $('.javaUserAnswer')
        .prop('disabled', false)
        .val('')
        .focus();

    $('.javaUserNext, .javaGameResult').hide();
    $('.javaUserSubmit').show();

    $('.javaQuestionTrack').html(`Question ${mathApp.TotalQuestion}:`);
}

function showEndScreen() {
    $('.javaGameHUD').fadeOut(300, function () {
        $('.javaEndHUD').css('display', 'flex');
        $('.javaResultScore')
            .hide()
            .delay(200)
            .slideDown(500)
            .html(`Your Score: ${mathApp.TotalScore * 100}`);
    });
}

function generateQuestion() {
    const rand = Math.random();
    const x = getRandomNumber();
    const y = getRandomNumber();

    if (rand <= 0.5) {
        // Simple question
        const sign = mathApp.RandomSign(mathApp.easySign);
        displayQuestion(`${x} ${sign.visual} ${y} = <span>?</span>`);
        mathApp.computerAnswer = mathApp.easyCalc(x, y, sign.factor);
    } else {
        // More complex question
        const z = getRandomNumber();
        const sign1 = mathApp.RandomSign(mathApp.easySign);
        const sign2 = mathApp.RandomSign(mathApp.easySign);
        displayQuestion(`${x} ${sign1.visual} ${y} ${sign2.visual} ${z} = <span>?</span>`);
        mathApp.computerAnswer = mathApp.easyLongCalc(x, y, z, sign1.factor, sign2.factor);
    }
}

function displayQuestion(html) {
    $('.javaGameQuestion')
        .hide()
        .html(html)
        .fadeIn(200);
}

function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

mathApp.Restart = $('.javaUserReplay').on('click',function(){
    $('.javaEndHUD').hide();
    $('.javaGameHUD')
            .css('display', 'flex')
            .addClass('show');
    mathApp.TotalScore = 0;
    mathApp.TotalQuestion = 1;
    $('.javaUserScore').html(`Score: 0`);
    resetUIForNextQuestion();
    generateQuestion();
})


//Audio Part
$('.javaStartButton, .javaUserSubmit, .javaUserReplay, .javaUserNext').mouseenter(function(){
    audioHover = document.getElementById('javaMStartHover');
    audioHover.volume = mathApp.sfxVolume;
    audioHover.play();
})

$('.javaStartButton, .javaUserSubmit, .javaUserReplay, .javaUserNext').mouseleave(function(){
    audioHover = document.getElementById('javaMStartHover');
    audioHover.pause();
    audioHover.currentTime = 0;
})

$('.javaStartButton').click(function() {
    audioClick = document.getElementById('javaMStart');
    audioClick.volume = mathApp.sfxVolume;
    audioClick.play();
    audioBGM = document.getElementById('javaMBgm');
    audioBGM.volume = mathApp.bgmVolume;
    audioBGM.loop = true;
    setTimeout(function(){audioBGM.play()}, 2500);
})

$('.javaUserSubmit, .javaUserReplay').click(function() {
    audioClick = document.getElementById('javaMStart');
    audioClick.pause();
    audioClick.currentTime = 0;
    audioClick.volume = mathApp.sfxVolume;
    audioClick.play();
})

mathApp.audioBGM = document.getElementById('javaMBgm');
mathApp.audioHover = document.getElementById('javaMStartHover');
mathApp.audioClick = document.getElementById('javaMStart');

mathApp.bgmVolume = 0.05;
mathApp.sfxVolume = 0.15;

mathApp.updateVolumeDisplays = function() {
  $('#bgmLevel').text(`${Math.round(this.bgmVolume * 100)}%`);
  $('#sfxLevel').text(`${Math.round(this.sfxVolume * 100)}%`);
}

mathApp.applyVolumes = function() {
  this.audioBGM.volume = this.bgmVolume;
  this.audioHover.volume = this.sfxVolume;
  this.audioClick.volume = this.sfxVolume;
}

mathApp.adjustVolume = function(type, delta) {
  if (type === 'bgm') {
    this.bgmVolume = Math.min(Math.max(this.bgmVolume + delta, 0), 1);
  } else if (type === 'sfx') {
    this.sfxVolume = Math.min(Math.max(this.sfxVolume + delta, 0), 1);
  }
  this.updateVolumeDisplays();
  this.applyVolumes();
}

// Event listeners
$('#bgmUp').click(() => mathApp.adjustVolume('bgm', 0.05));
$('#bgmDown').click(() => mathApp.adjustVolume('bgm', -0.05));
$('#sfxUp').click(() => mathApp.adjustVolume('sfx', 0.05));
$('#sfxDown').click(() => mathApp.adjustVolume('sfx', -0.05));

$('.openSettings').on('click', function () {
  $('#volumeOverlay').fadeIn(200);
});

$('#closeModal, #backToGame').on('click', function () {
  $('#volumeOverlay').fadeOut(200);
});

$('#volumeOverlay').on('click', function (e) {
  const modal = document.getElementById('volumeModal');
  if (!modal.contains(e.target)) {
    $('#volumeOverlay').fadeOut(200);
  }
});

mathApp.init = function(){
    mathApp.updateVolumeDisplays();
    mathApp.applyVolumes();
    mathApp.start;
}

$(document).ready(function(){
    mathApp.init();
});