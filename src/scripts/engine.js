const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        resultText: document.querySelector(".result-text"),
        gameOverMenu: document.querySelector(".bottom-menu"),
    },
    values:{
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        initialLevelTime: 60,
        currentTime: 60,
        totLives: 3,
        lives: 3,
    },
    actions:{
        timerId: null,
        countDownTimerId: setInterval(countDown, 10),
    }
};


function resetGame(){
    state.values.currentTime = state.values.initialLevelTime;
    state.values.result = 0
    state.values.lives = state.values.totLives;

    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = "x" + state.values.lives;

    state.actions.countDownTimerId = setInterval(countDown, 10);

    state.view.gameOverMenu.style.opacity = 0;
}

function livesOver(){
    state.values.lives--;
    state.view.lives.textContent = "x" + state.values.lives;
}

function countDown(){
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

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

    // if(state.values.currentTime <= 0){
    //     clearInterval(state.actions.countDownTimerId);
    //     clearInterval(state.actions.timerId);
    //     alert(`Game Over! O seu resultado foi ${state.values.result}`)
    // }
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
            if(square.id === state.values.hitPosition){
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

if(state.values.lives > 0){
    initialize();
}
