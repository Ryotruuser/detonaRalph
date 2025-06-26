const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        resultText: document.querySelector(".result-text"),
        gameOverMenu: document.querySelector(".bottom-menu"),
        bonusPoint: document.querySelector(".extra-points"),
        bonusTime: document.querySelector(".extra-time"),
        winner: `Um passo firme na trilha dos lendários. Titulo recebido <h3 class='winner'>'Desafiante'</h3> sua pontuação:`,
        elite: `Elite reconhece elite. Bem-vindo ao círculo. Titulo recebido <h3 class='elite'>'Elite'</h3> sua pontuação:`,
        legendary: `Seu nome será lembrado... por aqueles que ousarem desafiar. Titulo recebido <h3 class='legendary'> 'Lendário(a)'</h3> sua pontuação:`,
        godlike: `GODLIKE.Nem os devs estavam preparados pra isso. Titulo recebido <h3 class='godlike'>'GODLIKE' </h3>sua pontuação:`,
    },
    values:{
        initialGameVelocity: 1000,
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        initialLevelTime: 10,
        easyGamePace: 50,
        mediumGamePace:100,
        hardGamePace: 150,
        winnerGamePace: 200,
        godlikeGamePace: 250,
        currentTime: 10,
        totLives: 3,
        lives: 3,
        bonusPoint: 10,
        bonusTime: 10,
        firstLevelCap: 5,
        secondLevelCap: 25,
        thirdLevelCap: 50,
        fourthLevelCap: 75,
        winnerLevelCap: 100,
        winner: 100,
        elite: 150,
        legendary: 175,
        godlike: 200,
        levels:{
            first: false,
            second: false,
            third: false,
            fouth: false,
            winner: false
        }
    },
    actions:{
        timerId: null,
        countDownTimerId: setInterval(countDown, 1000),
    },
};

window.addEventListener("click", ()=>{
    const audio = document.getElementById("bg-audio");
    audio.muted = false;
    audio.volume = 0.1;
    audio.play();
});

function extraPointOpacity(value){
    state.view.bonusPoint.style.opacity = value;
}

function extraTimeOpacity(value){
    state.view.bonusTime.style.opacity = value;
}

function nextLevel(){
    const result = state.values.result;

    if(result === state.values.firstLevelCap && !state.values.levels.first){

        state.values.levels.first = true;
        playSound("levelPassed");
        state.values.result += state.values.bonusPoint;
        state.view.score.textContent = state.values.result;
        state.view.bonusPoint.textContent = "+" + state.values.bonusPoint;
        extraPointOpacity(1);
        state.values.gameVelocity -= state.values.easyGamePace ;
        moveEnemy();

    }else if(result === state.values.secondLevelCap && !state.values.levels.second){

        state.values.levels.second = true;
        playSound("levelPassed");
        state.values.currentTime += state.values.bonusTime;
        state.view.timeLeft.textContent = state.values.currentTime;
        state.view.bonusTime.textContent = "+" + state.values.bonusTime;
        extraTimeOpacity(1);
        state.values.gameVelocity -= state.values.mediumGamePace ;
        moveEnemy();

    }else if(result === state.values.thirdLevelCap && !state.values.levels.third){

        state.values.levels.third = true;
        playSound("levelPassed");
        livesAdd(1);
        state.values.result += state.values.bonusPoint;
        state.view.score.textContent = state.values.result;
        state.view.bonusPoint.textContent = "+" + state.values.bonusPoint;
        extraPointOpacity(1);
        playSound("levelPassed");
        state.values.currentTime += state.values.bonusTime;
        state.view.timeLeft.textContent = state.values.currentTime;
        state.view.bonusTime.textContent = "+" + state.values.bonusTime;
        extraTimeOpacity(1);
        state.values.gameVelocity -= state.values.hardGamePace ;
        moveEnemy();

    }else if(result === state.values.fourthLevelCap && !state.values.levels.fouth){
        
        state.values.levels.fouth = true;
        playSound("levelPassed");
        state.values.currentTime += state.values.bonusTime;
        state.view.timeLeft.textContent = state.values.currentTime;
        state.view.bonusTime.textContent = "+" + state.values.bonusTime;
        extraTimeOpacity(1);
        state.values.gameVelocity -= state.values.winnerGamePace;
        moveEnemy();

    }else if(result === state.values.winnerLevelCap && !state.values.levels.winner){

        state.values.levels.winner = true;
        playSound("levelPassed");
        livesAdd(1);
        state.values.result += state.values.bonusPoint;
        state.view.score.textContent = state.values.result;
        state.view.bonusPoint.textContent = "+" + state.values.bonusPoint;
        extraPointOpacity(1);
        playSound("levelPassed");
        state.values.currentTime += state.values.bonusTime;
        state.view.timeLeft.textContent = state.values.currentTime;
        state.view.bonusTime.textContent = "+" + state.values.bonusTime;
        extraTimeOpacity(1);
        state.values.gameVelocity -= state.values.godlikeGamePace ;
        moveEnemy();

    }
}

function resetGame(){
    clearInterval(state.values.timerId);
    state.values.gameVelocity = state.values.initialGameVelocity;
    extraPointOpacity(0);
    extraTimeOpacity(0);
    state.values.currentTime = state.values.initialLevelTime;
    state.values.result = 0
    state.values.lives = state.values.totLives;

    state.values.levels = {
        first: false,
        second: false,
        third: false,
        fouth: false,
        winner: false
    };

    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = "x" + state.values.lives;

    moveEnemy();
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    state.view.gameOverMenu.style.opacity = 0;
}

function livesAdd(livesQnt){
    state.values.lives += livesQnt;
    state.view.lives.textContent = "x" + state.values.lives;
}

function livesOver(){
    state.values.lives--;
    state.view.lives.textContent = "x" + state.values.lives;
}

function countDown(){
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;
    nextLevel();

    if(state.values.currentTime <= 0 && state.values.lives > 0){
        livesOver();
        state.values.currentTime = state.values.initialLevelTime;
        state.view.timeLeft.textContent = state.values.currentTime;
    }else if(state.values.currentTime <= 0 && state.values.lives === 0){
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
        if(state.values.result >= state.values.legendary){
            state.view.resultText.innerHTML = state.view.legendary + state.values.result;
            state.view.gameOverMenu.style.opacity = 1;
        }else if(state.values.result >= state.values.elite){
            state.view.resultText.innerHTML = state.view.elite + state.values.result;
            state.view.gameOverMenu.style.opacity = 1;
        }else if(state.values.result >= state.values.winner){
            state.view.resultText.innerHTML = state.view.winner + state.values.result;
            state.view.gameOverMenu.style.opacity = 1;
        }else if(state.values.result < 100){
            state.view.resultText.textContent = `Game Over! Seu resultado final foi ${state.values.result}`;
            state.view.gameOverMenu.style.opacity = 1;
        }
        
    }else if(state.values.result >= state.values.godlike){
        playSound("GODLIKE");
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
        state.view.resultText.innerHTML = state.view.godlike + state.values.result;
        state.view.gameOverMenu.style.opacity = 1;
    }

}

function playSound(audioName){
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function randomSquare(){
    state.view.squares.forEach((square)=>{
        square.classList.remove("enemy");
    })

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;


}

function moveEnemy(){
    clearInterval(state.values.timerId);
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity)
}

function addListenerHitBox(){

    state.view.squares.forEach((square)=>{
        square.addEventListener("mousedown", ()=>{
            extraPointOpacity(0);
            extraTimeOpacity(0);
            if(square.id === state.values.hitPosition && state.values.currentTime > 0){
                state.values.result++
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            }
        })
    })
}

function initialize(){
    moveEnemy();
    addListenerHitBox();
}

initialize();
