const mathApp = {};

mathApp.RandomSign = function(unique){
    const randomIndex = Math.floor(Math.random() * unique.length);
    return unique[randomIndex];
}

mathApp.Sign = [
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

mathApp.easyCalc = function (a, b, sign) {
    const operations = {
        '+': a + b,
        '-': a - b,
        '*': a * b,
        '/': a / b
    };

    let ans = operations[sign];
    if (sign === '/' && !Number.isInteger(ans)) {
        ans = Number(ans.toFixed(1));
    }
    return Number(ans);
};


mathApp.easyLongCalc = function (var1, var2, var3, sign1, sign2) {
    const expression = `${var1} ${sign1} ${var2} ${sign2} ${var3}`;
    let ans = eval(expression); 
    if (!Number.isInteger(ans)) {
        ans = Number(ans.toFixed(1));
    }
    return Number(ans);
};

mathApp.hardCalc = function (var1, var2, var3, sign1, sign2) {
    const expression = `${var1} ${sign1} ${var2} ${sign2} ${var3}`;
    let ans = eval(expression);
    if (!Number.isInteger(ans)) {
        ans = Number(ans.toFixed(1));
    }
    return Number(ans);
};

mathApp.hardLongCalc = function (var1, var2, var3, var4, sign1, sign2, sign3) {
    const expression = `${var1} ${sign1} ${var2} ${sign2} ${var3} ${sign3} ${var4}`;
    let ans = eval(expression);
    if (!Number.isInteger(ans)) {
        ans = Number(ans.toFixed(1));
    }
    return Number(ans);
};

mathApp.extremeCalc = function (var1, var2, var3, var4, sign1, sign2, sign3) {
    const expression = `${var1} ${sign1} ${var2} ${sign2} ${var3} ${sign3} ${var4}`;
    let ans = eval(expression);
    if (!Number.isInteger(ans)) {
        ans = Number(ans.toFixed(1));
    }
    return Number(ans);
};

mathApp.extremeLongCalc = function (var1, var2, var3, var4, var5, sign1, sign2, sign3, sign4) {
    const expression = `${var1} ${sign1} ${var2} ${sign2} ${var3} ${sign3} ${var4} ${sign4} ${var5} `;
    let ans = eval(expression);
    if (!Number.isInteger(ans)) {
        ans = Number(ans.toFixed(1));
    }
    return Number(ans);
};


mathApp.TotalScore = 0;
mathApp.TotalQuestion = 0;
mathApp.currentDifficulty = '';

mathApp.scoreBoard = function(){
    mathApp.TotalScore++;
    $('.javaUserScore').html(`Score: ${mathApp.TotalScore * 100}`);
}

mathApp.start = $('.javaStartButton').on('click', function () {
    mathApp.currentDifficulty = $(this).data('difficulty')

    $('#uiBlocker').show(); // Block user interactions

    $('.javaStartHUD')
        .addClass('transition-hide')
        .delay(100)
        .queue(function (next) {
            $(this).addClass('hide');
            next();
        });

    setTimeout(() => {
        $('.javaStartHUD').hide();

        $('.javaGameHUD')
            .css('display', 'flex')
            .addClass('show');

        // Reset state
        mathApp.TotalQuestion = 1;
        $('.javaQuestionTrack').html(`Question ${mathApp.TotalQuestion}:`);
        $('.javaUserAnswer').val('');
        $('.javaGameResult').hide();

        // Generate question based on difficulty
        generateQuestion();

        $('#uiBlocker').fadeOut(200); // Unblock
    }, 500);
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

function getRandomNumber() {
    if (mathApp.currentDifficulty === 'hard') {
        return Math.floor(Math.random() * 50) + 1;
    } else if (mathApp.currentDifficulty === 'extreme') {
        return Math.floor(Math.random() * 100) + 1;
    }
    return Math.floor(Math.random() * 10) + 1; // easy
}

function generateQuestion() {
    const difficulty = mathApp.currentDifficulty || 'easy';
    const rand = Math.random();

    let numbers = [];
    let signs = [];

    if (difficulty === 'easy') {
        if (rand <= 0.5) {
            // x sign y
            const x = getRandomNumber();
            const y = getRandomNumber();
            const sign = mathApp.RandomSign(mathApp.Sign);
            displayQuestion(`${x} ${sign.visual} ${y} = <span>?</span>`);
            mathApp.computerAnswer = mathApp.easyCalc(x, y, sign.factor);
            return;
        } else {
            // x sign y sign z
            numbers = [getRandomNumber(), getRandomNumber(), getRandomNumber()];
            signs = [mathApp.RandomSign(mathApp.Sign), mathApp.RandomSign(mathApp.Sign)];
            displayQuestion(`${numbers[0]} ${signs[0].visual} ${numbers[1]} ${signs[1].visual} ${numbers[2]} = <span>?</span>`);
            mathApp.computerAnswer = mathApp.easyLongCalc(numbers[0], numbers[1], numbers[2], signs[0].factor, signs[1].factor);
            return;
        }

    } else if (difficulty === 'hard') {
        if (rand <= 0.5) {
            // x sign y sign z
            numbers = [getRandomNumber(), getRandomNumber(), getRandomNumber()];
            signs = [mathApp.RandomSign(mathApp.Sign), mathApp.RandomSign(mathApp.Sign)];
            displayQuestion(`${numbers[0]} ${signs[0].visual} ${numbers[1]} ${signs[1].visual} ${numbers[2]} = <span>?</span>`);
            mathApp.computerAnswer = mathApp.hardCalc(numbers[0], numbers[1], numbers[2], signs[0].factor, signs[1].factor);
            return;
        } else {
            // x sign y sign z sign i
            numbers = [getRandomNumber(), getRandomNumber(), getRandomNumber(), getRandomNumber()];
            signs = [mathApp.RandomSign(mathApp.Sign), mathApp.RandomSign(mathApp.Sign), mathApp.RandomSign(mathApp.Sign)];
            displayQuestion(`${numbers[0]} ${signs[0].visual} ${numbers[1]} ${signs[1].visual} ${numbers[2]} ${signs[2].visual} ${numbers[3]} = <span>?</span>`);
            mathApp.computerAnswer = mathApp.hardLongCalc(numbers[0], numbers[1], numbers[2], numbers[3], signs[0].factor, signs[1].factor, signs[2].factor);
            return;
        }

    } else if (difficulty === 'extreme') {
        if (rand <= 0.5) {
            // x sign y sign z sign i
            numbers = [getRandomNumber(), getRandomNumber(), getRandomNumber(), getRandomNumber()];
            signs = [mathApp.RandomSign(mathApp.Sign), mathApp.RandomSign(mathApp.Sign), mathApp.RandomSign(mathApp.Sign)];
            displayQuestion(`${numbers[0]} ${signs[0].visual} ${numbers[1]} ${signs[1].visual} ${numbers[2]} ${signs[2].visual} ${numbers[3]} = <span>?</span>`);
            mathApp.computerAnswer = mathApp.extremeCalc(numbers[0], numbers[1], numbers[2], numbers[3], signs[0].factor, signs[1].factor, signs[2].factor);
            return;
        } else {
            // x sign y sign z sign i sign k
            numbers = [getRandomNumber(), getRandomNumber(), getRandomNumber(), getRandomNumber(), getRandomNumber()];
            signs = [
                mathApp.RandomSign(mathApp.Sign),
                mathApp.RandomSign(mathApp.Sign),
                mathApp.RandomSign(mathApp.Sign),
                mathApp.RandomSign(mathApp.Sign)
            ];
            displayQuestion(`${numbers[0]} ${signs[0].visual} ${numbers[1]} ${signs[1].visual} ${numbers[2]} ${signs[2].visual} ${numbers[3]} ${signs[3].visual} ${numbers[4]} = <span>?</span>`);
            mathApp.computerAnswer = mathApp.extremeLongCalc(
                numbers[0], numbers[1], numbers[2], numbers[3], numbers[4],
                signs[0].factor, signs[1].factor, signs[2].factor, signs[3].factor
            );
            return;
        }
    }
}
function displayQuestion(html) {
    $('.javaGameQuestion')
        .hide()
        .html(html)
        .fadeIn(200);
}

function getRandomNumber() {
    if (mathApp.currentDifficulty === 'hard') {
        return Math.floor(Math.random() * 50) + 1;
    } else if (mathApp.currentDifficulty === 'extreme') {
        return Math.floor(Math.random() * 100) + 1;
    }
    // Default: easy
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
$('.javaUserSubmit, .javaUserReplay, .javaUserNext').mouseenter(function(){
    audioHover = document.getElementById('javaMStartHover');
    audioHover.volume = mathApp.sfxVolume;
    audioHover.play();
})

$('.javaUserSubmit, .javaUserReplay, .javaUserNext').mouseleave(function(){
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