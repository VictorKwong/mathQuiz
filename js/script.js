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
mathApp.extremeUnlocked = false;
mathApp.correctStreak = 0;
// Call this when showing a new question:
mathApp.startQuestionTimer = function() {
    mathApp.questionStartTime = Date.now();
};

mathApp.scoreBoard = function () {
    // Calculate answer time in seconds
    let answerTimeSeconds = 0;
    if (mathApp.questionStartTime) {
        answerTimeSeconds = (Date.now() - mathApp.questionStartTime) / 1000;
    }

    // Base points by difficulty
    let basePoints;
    switch (mathApp.currentDifficulty) {
        case 'easy':
            basePoints = 100;
            break;
        case 'hard':
            basePoints = 150;
            break;
        case 'extreme':
            basePoints = 300;
            break;
        default:
            basePoints = 0;
    }

    // Speed multiplier: faster than 5s = 1.5x, else 1x
    let speedMultiplier = answerTimeSeconds < 5 ? 1.5 : 1;

    // Streak multiplier: +10% per streak, max 3x
    mathApp.correctStreak = (mathApp.correctStreak || 0) + 1;
    let streakMultiplier = Math.min(1 + 0.1 * mathApp.correctStreak, 3);

    let points = Math.floor(basePoints * speedMultiplier * streakMultiplier);

    const $scoreElement = $('.javaUserScore');
    $scoreElement.html(`Score: ${mathApp.TotalScore} +${points} points!`);
    $scoreElement.addClass('score-animate');

    mathApp.TotalScore += points;

    setTimeout(() => {
        $scoreElement.html(`Score: ${mathApp.TotalScore}`);
        $scoreElement.removeClass('score-animate');
    }, 400); 

    // Reset timer for next question
    mathApp.questionStartTime = null;
};

mathApp.start = $('.javaStartButton').on('click', function () {
    mathApp.currentDifficulty = $(this).data('difficulty');

    // Show blocker immediately to block user interaction
    $('#uiBlocker').show();

    // Fade out start HUD smoothly
    $('.javaStartHUD').fadeOut(300, function () {
        $(this).addClass('hide transition-hide');

        // After fade out complete, fade in game HUD
        $('.javaGameHUD')
            .css('display', 'flex')
            .hide() // start hidden so fadeIn works
            .fadeIn(300)
            .addClass('show');

        // Reset state for game
        mathApp.TotalQuestion = 1;
        $('.javaQuestionTrack').html(`Question ${mathApp.TotalQuestion}:`);
        $('.javaUserAnswer').val('');
        $('.javaGameResult').hide();
        resetUIForNextQuestion();
        generateQuestion();

        // After game HUD fade in, unblock UI with fade out on blocker
        setTimeout(() => {
            $('#uiBlocker').fadeOut(200);
        }, 300); // delay matches fadeIn duration
    });
});


mathApp.Submit = $('.javaUserSubmit').on('click', function() {
    let rawInput = $('.javaUserAnswer').val().trim();

    if (rawInput === "Unlock1218" && !mathApp.extremeUnlocked) {
        mathApp.extremeUnlocked = true;

        $('.extremeMode').removeAttr('hidden');
        triggerEasterEgg(); // Fireworks

        $('.javaGameResult').css('color', '#FFD700')
            .show().html('🎉 Extreme mode unlocked!');

        mathApp.freezeMessage = true; // freeze further message updates briefly

        // After 2 seconds, allow normal messages again
        setTimeout(() => {
            mathApp.freezeMessage = false;
        }, 2000);

        return;
    }

    // If freezeMessage is true, prevent overwriting the success message
    if (mathApp.freezeMessage) {
        return;
    }

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
        mathApp.correctStreak = 0
        $('.javaGameResult').css('color', 'orange')
        .show()
        .html(`Almost! The correct answer is <strong>${correctAnswer}</strong>. Let's move on! 🚀`);
    }

    $('.javaUserNext').show();
});

mathApp.Next = $('.javaUserNext').on('click', function () {
    // Determine max questions based on current difficulty
    let maxQuestions;
    switch (mathApp.currentDifficulty) {
        case 'easy':
            maxQuestions = 5;
            break;
        case 'hard':
            maxQuestions = 10;
            break;
        case 'extreme':
            maxQuestions = 12;
            break;
        default:
            maxQuestions = 5; // fallback
    }

    // Check if quiz has ended
    if (mathApp.TotalQuestion === maxQuestions) {
        showEndScreen();
    } else {
        mathApp.TotalQuestion++;
        resetUIForNextQuestion();
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
        // Decide message and title based on score
        let title = "🎉 Great Job!";
        let message = "Thanks for playing — ready for another round?";

        if (mathApp.TotalScore >= 3600) {
            title = "🏆 Amazing Superstar!";
            message = "You crushed it with a high score! Can you do it again?";
        } else if (mathApp.TotalScore >= 1500) {
            title = "🔥 Awesome Work!";
            message = "You're doing great! Keep pushing for an even higher score!";
        } else if (mathApp.TotalScore >= 500) {
            title = "👍 Nice Effort!";
            message = "Good job! A little more practice and you'll master it!";
        } else if (mathApp.TotalScore > 0) {
            title = "🌟 Keep Going!";
            message = "Every point counts! Try again to improve your score!";
        } else {
            title = "🤔 Don't Give Up!";
            message = "Practice makes perfect — give it another try!";
        }

        // Update end screen texts
        $('.javaEndHUD').css('display', 'flex');
        $('.endTitle').text(title);
        $('.endMessage').text(message);

        $('.javaResultScore')
            .hide()
            .delay(200)
            .slideDown(500)
            .html(`Your Score: ${mathApp.TotalScore}`);
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
    mathApp.startQuestionTimer();
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

function triggerEasterEgg(count = 20) {
  const container = document.getElementById("fireworksContainer");
  if (!container) return;

  container.classList.remove("hidden");
  container.innerHTML = ""; // Clear previous fireworks

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const firework = document.createElement("div");
      firework.className = "firework";

      // Random position anywhere on screen (relative to center)
      const x = Math.random() * window.innerWidth - window.innerWidth / 2;
      const y = Math.random() * window.innerHeight - window.innerHeight / 2;

      firework.style.left = `${x}px`;
      firework.style.top = `${y}px`;

      // Create particles for this firework
      const particlesCount = 30;
      for (let j = 0; j < particlesCount; j++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.backgroundColor = getRandomColor();

        // Set random direction and distance for particle explosion
        const angle = (360 / particlesCount) * j + (Math.random() * 20 - 10); // spread with some randomness
        const distance = 100 + Math.random() * 50; // px

        // Convert angle to x and y offsets using trigonometry
        const dx = Math.cos(angle * (Math.PI / 180)) * distance;
        const dy = Math.sin(angle * (Math.PI / 180)) * distance;

        particle.style.setProperty("--dx", `${dx}px`);
        particle.style.setProperty("--dy", `${dy}px`);

        firework.appendChild(particle);
      }

      container.appendChild(firework);

      // Remove firework after animation duration
      setTimeout(() => {
        firework.remove();
      }, 1500);
    }, i * 300);
  }

  // Hide container after all fireworks finish
  setTimeout(() => {
    container.classList.add("hidden");
    container.innerHTML = "";
  }, count * 700 + 1500);
}

function getRandomColor() {
  const colors = ["#FFD700", "#FF4D4D", "#33CCFF", "#33FF99", "#FF66CC"];
  return colors[Math.floor(Math.random() * colors.length)];
}


mathApp.Restart = $('.javaUserReplay').on('click', function () {
    // 🎵 Fade out BGM quickly
    let fadeAudio = setInterval(() => {
        if (mathApp.audioBGM.volume > 0.01) {
            mathApp.audioBGM.volume -= 0.01;
        } else {
            mathApp.audioBGM.volume = 0;
            mathApp.audioBGM.pause();
            mathApp.audioBGM.currentTime = 0
            clearInterval(fadeAudio);
        }
    }, 30); // fast fade (adjust speed if needed)

    // Ensure blocker is fully visible before starting transition
    $('#uiBlocker').fadeIn(100, () => {
        // Fade out end HUD first
        $('.javaEndHUD').fadeOut(200, function() {
            $(this).addClass('hide').removeClass('show transition-hide');

            // Wait 300ms if you want a delay
            setTimeout(() => {
                // Reset scores/UI
                mathApp.TotalScore = 0;
                mathApp.TotalQuestion = 0;
                $('.javaUserScore').html(`Score: 0`);

                // Prepare start HUD to be faded in
                $('.javaStartHUD')
                    .removeClass('hide transition-hide')
                    .css({
                        display: 'flex',
                        opacity: 0  // start invisible for fade in
                    })
                    .addClass('show')
                    .show()
                    .animate({ opacity: 1 }, 400);  // fade in duration

                // Fade out blocker only after start HUD fade-in completes
                setTimeout(() => {
                    $('#uiBlocker').fadeOut(200);
                }, 400);
            }, 300);
        });
    });



});



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