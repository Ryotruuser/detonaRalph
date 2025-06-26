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
    },
    values:{
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        initialLevelTime: 30,
        nextLevelPace: 200,
        currentTime: 30,
        totLives: 3,
        lives: 3,
        bonusPoint: 10,
    },
    actions:{
        timerId: null,
        countDownTimerId: setInterval(countDown, 1000),
    }
};

window.addEventListener("click", ()=>{
    const audio = document.getElementById("bg-audio");
    audio.muted = false;
    audio.volume = 0.1;
    audio.play();
});

function showHideExtraPoint(value){
    state.view.bonusPoint.style.opacity = value;
}

function nextLevel(){
    if(state.values.result === 5 && state.values.lives > 0){
        state.values.result += state.values.bonusPoint;
        state.view.bonusPoint.textContent = "+" + state.values.bonusPoint;
        livesAdd(1);
        state.view.score.textContent = state.values.result;
        showHideExtraPoint(1);
        playSound("levelPassed");
        
    }
}

function resetGame(){
    state.values.currentTime = state.values.initialLevelTime;
    state.values.result = 0
    state.values.lives = state.values.totLives;

    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = "x" + state.values.lives;

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
        state.values.currentTime = 10;
        state.view.timeLeft.textContent = state.values.currentTime;
    }else if(state.values.currentTime <= 0 && state.values.lives === 0){
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
        state.view.resultText.textContent = `Game Over! Seu resultado final foi ${state.values.result}`;
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
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity)
}

function addListenerHitBox(){
    state.view.squares.forEach((square)=>{
        square.addEventListener("mousedown", ()=>{
            showHideExtraPoint(0);
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
