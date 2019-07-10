//game obj
var game = {
    body: document.getElementsByTagName('body')[0],
    container: document.getElementById('gameContainer'),
    guessCont: document.getElementById('guesses'),
    winCont: document.getElementById('wins'),
    wrong: document.getElementById('wrong'),
    headingText: document.getElementById('heading'),
    wordSpan: document.getElementById('letters'),
    loadWrap: document.getElementById('loaderWrapper'),
    loadText: document.getElementById('loadText'),
    finalWrapper: document.getElementById('finalWrapper'),
    grid: document.getElementById('grid'),
    guesses: 10,
    wins: 0,
    colorArray: [
        {name: "seafoam", colorMain: "BDFFF3", colorTwo: "74,194,154"}, 
        {name: "magenta", colorMain: "f953c6", colorTwo: "185,29,115"}, 
        {name: "lavender", colorMain: "e1ceff", colorTwo: "210,119,200"},
        {name: "aqua", colorMain: "A6FFCB", colorTwo: "18,216,250"}, 
        {name: "purple", colorMain: "E100FF", colorTwo: "127,0,255"}, 
        {name: "lime", colorMain: "DCE35B", colorTwo: "69,182,73"},
        {name: "citrus", colorMain: "FDC830", colorTwo: "243,115,53"},
        {name: "maroon", colorMain: "DA4453", colorTwo: "137,33,107"},
        {name: "peach", colorMain: "FFC371", colorTwo: "255,95,109"},
        {name: "violet", colorMain: "a415e9", colorTwo: "69,34,173"},
        {name: "crimson", colorMain: "e9152d", colorTwo: "173,34,73"},
        {name: "bubblegum", colorMain: "ff8ed0", colorTwo:"228,90,203"},
        {name: "rose", colorMain: "ffaddd", colorTwo: "255,110,139"},
        {name: "avocado", colorMain: "d9e45a", colorTwo: "157,178,48"},
        {name: "pumpkin", colorMain: "ff9b39", colorTwo: "228,88,44"},
        {name: "navy", colorMain: "394483", colorTwo: "16,22,58"},
        {name: "turquoise", colorMain: "63ecd3", colorTwo: "21,161,162"}
        ],
    loadingText: ["Getting things ready...", "Loading into the Matrix...", "Good news everyone! The page has loaded.", "Firing up the hyperdrive...", "One moment..."],
    randomWordLength: "",
    lettersArray: "",
    wrongLettersArray: [],
    correctLettersArray: [],
    soundCorrect: 'assets/sounds/positive.mp3',
    soundWrong: 'assets/sounds/negative.mp3',
    soundWin: 'assets/sounds/word_cleared.mp3',
    soundLose: 'assets/sounds/lose.mp3',
    sound(sound, volume){
        var newSound = new Audio(sound);
        newSound.volume = volume;
        newSound.play();
    },
    randomLoadText(){
        var random = Math.round(Math.random()*(game.loadingText.length - 1));
        this.loadText.innerHTML = this.loadingText[random];
    },
    letterBoxes(randomWordLength, lettersArray){

        for (var i = 0; i < randomWordLength; i++){
            var letterBox = document.createElement("span");
            letterBox.className = "letterBox";
            this.container.appendChild(letterBox);

            var letterSpan = document.createElement("span");
            letterSpan.innerHTML = "_";
            letterSpan.className = "letter";
            letterSpan.setAttribute('data-letter', lettersArray[i]);
            letterBox.appendChild(letterSpan);
        }
    },
    styles(colorOne, colorTwo, colorThree){
        this.body.style.background = 'linear-gradient(to right,' + colorOne + ',' + colorTwo + ')';
        this.grid.style.boxShadow = '1px 3px 16px ' + colorTwo + ' inset, -2px -2px 8px rgba(255,255,255,.1), 2px 2px 2px rgba(255,255,255,.1) ';
        this.headingText.style.textShadow = '2px 4px 6px ' + colorTwo;
        this.grid.style.backgroundColor = colorThree;
    },
    generator(randomNum){
        var random = this.colorArray[randomNum];
        var randomWord = random.name;
        var colorHex = "#" + random.colorMain; 
        var colorHexTwo = "rgb(" + random.colorTwo + ")";
        var colorHexTwoLight = "rgba(" + random.colorTwo + ", .25)";

        this.colorArray.splice(randomNum, 1);

        this.randomWordLength = randomWord.length;
        this.lettersArray = randomWord.split("", this.randomWordLength);
        
        this.letterBoxes(this.randomWordLength, this.lettersArray);
        this.styles(colorHex, colorHexTwo, colorHexTwoLight);
    },
    reset(randomNum){
        this.guesses = 10;
        this.guessCont.innerHTML = game.guesses;
        this.container.innerHTML = "";
        this.wrongLettersArray = [];
        this.correctLettersArray = [];
        this.wrong.innerHTML = "";

        this.generator(randomNum);
    },
    win(){
        this.wins += 1;
        this.sound(this.soundWin, .25);
        console.log('you have ' + this.wins + " wins!");
        this.winCont.innerHTML = this.wins;
    },
    lose(){
        this.finalWrapper.classList = "lose";
        this.finalWrapper.innerHTML = '<h1 class="inset">Game Over</h1>';
        console.log()
        this.sound(this.soundLose, .25);
        console.log('game over');
    },
    wrongGuess(key){
        if (this.wrongLettersArray.indexOf(key) === -1){
            this.sound(this.soundWrong, .25);
            this.guesses -= 1;
            this.guessCont.innerHTML = this.guesses;
            this.wrong.innerHTML += " " + key;
            this.wrongLettersArray.push(key);
        } else{
            console.log('already guessed ' + key);
        }
     
    }
    
}

game.randomLoadText();

window.onload = function(){
    var randomNum = Math.round(Math.random()*(game.colorArray.length - 1));
    game.reset(randomNum);
    game.loadWrap.className = 'loaded';
    game.loadText.classList = "fadeIn inset";
}

document.onkeydown = function(e){
    var keyCode = e.keyCode;
    var key = String.fromCharCode(keyCode).toLowerCase();
    var keyIndex = game.lettersArray.indexOf(key);
    var correctGuessesIndex = game.correctLettersArray.indexOf(key);
    var visible = document.querySelectorAll('.visible').length;    

    if (key.match(/[a-z]/)){

        if (keyIndex > -1 && game.guesses > 0 && correctGuessesIndex === -1){

            game.sound(game.soundCorrect, .025);

            document.querySelectorAll('[data-letter]').forEach(function(item){
                var dataLetter = item.getAttribute("data-letter");
                if(key === dataLetter && keyIndex > -1){
                    item.innerHTML = dataLetter;
                    item.className = "letter visible";
                    game.correctLettersArray.push(key);
                } 
            });

            if((game.randomWordLength - 1) === visible){

                game.win();

                if (game.colorArray.length > 0){
                    var randomNum = Math.round(Math.random()*(game.colorArray.length - 1));
                    setTimeout(function(){game.reset(randomNum);}, 1000); 
                } else{

                    //write for if someone goes through all options
                }
               
            }
    
        } else if (keyIndex < 0 && game.guesses > 0){
            game.wrongGuess(key);

        } else if (game.guesses === 0){
            game.lose();

            var randomNum = Math.round(Math.random()*(game.colorArray.length - 1));
            setTimeout(function(){game.reset(randomNum);}, 5000);
    
        } 

    } 

}

