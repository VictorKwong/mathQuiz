//Global Variable(s)
let trueAnswer;
let trueAr = [];
let countZero;
let countOne;
let check = {};
let tries = 0;
//DOM Challenge
function updateTextInput(val,id) {
    document.getElementById(id).value=val;
    for (let i = 1; i < 5; i++){
        let x = 'textInput' + i;
            if (i===1){
                answer = "" + document.getElementById(x).value;
            }else{
                answer = answer + document.getElementById(x).value;
            }
        }
    document.getElementById('userAnswer').innerHTML = answer;
}

//user submit answer
function mySubmitFunction() {
    let ar = [];
    let answer;
    let userZero;
    let userOne;
    let resultcomment;
    for (let i = 1; i < 5; i++){
        let x = 'textInput' + i;
        ar[i-1] = parseInt(document.getElementById(x).value);
            if (i===1){
                answer = "" + document.getElementById(x).value;
            }else{
                answer = answer + document.getElementById(x).value;
            }
        }
    document.getElementById('userAnswer').innerHTML = answer;

    //check user how many 0 and 1
    check = {};
    for (i = 0; i < ar.length; i++){
        if (check[ar[i]]){
            check[ar[i]] += 1;
        } else {
            check[ar[i]] = 1;
        }
    }
    userZero = check[0];
    userOne = check[1];
    //compare trueAnswer, correct digit(s), incorrect digit(s),correct digit(s) in worng position
    let cd = 0;
    let incd = 0;   
    for (i = 0; i < 4; i++){
        if(ar[i] === trueAr[i]){
            cd = cd + 1;
        }else{
            incd = incd + 1;
        }
    }
    tries = tries + 1;
    //display comment
    if(cd != 0){
    document.getElementById('correctd').innerHTML = "Correct Digit(s): " + cd
    resultcomment = ", Correct Digit(s): " + cd
    }else{
        document.getElementById('correctd').innerHTML = ""
        resultcomment = ""
    }
    if((incd === 2 || incd === 4) && countZero === userZero && countOne === userOne && cd != 4){
        document.getElementById('incorrectd').innerHTML = "Correct Digit(s) in wrong position: " + incd
        resultcomment += ", Correct Digit(s) in wrong position: " + incd
    }else if(incd != 0){
        document.getElementById('incorrectd').innerHTML = "Incorrect Digit(s): " + incd
        resultcomment += ", Incorrect Digit(s): " + incd
    }else{
        document.getElementById('incorrectd').innerHTML = ""
    }
    //check if wins
    if(cd === 4){
        document.getElementById('result').innerHTML = "You have access the hidden code!"
        resultcomment += ", You have access the hidden code!"
        document.getElementById("submitLayout").style.color = "green";
        document.getElementById("submitLayout").disabled = true;
    }else{
        document.getElementById('result').innerHTML = ""
    }
    document.getElementById('tries').innerHTML = "Attempt: " + tries


    let listResult = document.getElementsByClassName('resultOverflow')[0];

    let newListItem = document.createElement('p');
    newListItem.textContent = answer + resultcomment
    if(cd === 4){
        newListItem.style.color = "Green";
    }else{
        newListItem.style.color = "Red";
    }
    listResult.appendChild(newListItem);
    listResult.scrollTop = listResult.scrollHeight;
}

//modal Hint Open
let modal = document.getElementById("modalBackground")
function myHintFunction(){
    modal.style.display = "block";
}
//modal Hint Close
document.getElementsByClassName("close")[0].onclick = modalCloseFunction;

function modalCloseFunction(){
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

//start, random generate answer
function myStartGame(){
    document.getElementsByClassName('secondScene')[0].style.display = 'block';
    check = {};
    //Math.floor(Math.random() *2)
    for (let i = 0; i < 4 ; i++){
        let x = Math.floor(Math.random() *2);
        trueAr[i] = x;
            if (i===0){
                trueAnswer = "" + x;
            }else{
                trueAnswer = trueAnswer + x;
            }
            if (check[trueAr[i]]){
                check[trueAr[i]] += 1;
            } else {
                check[trueAr[i]] = 1;
            }
        }
    countZero = check[0];
    countOne = check[1];
    document.getElementsByClassName('firstScene')[0].style.display = 'none';
    document.getElementsByClassName('headerLayout')[0].style.height = 'auto';
    
}