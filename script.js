var gameMode = "no of players";
var gameStart = false;
var roundScores = [];
var playerscore = 0;
var dealerscore = 0;
var playercards = [];
var dealercards = [];
var playerNo = 1;
var noOfPlayers = 0;
var playerList = [];
var roundCards = [];
var round = 1;
var winners = [];
var even = [];
var chiplist = [];
var betlist = [];
var shuffledDeck = [];

var main = function (input) {
  console.log("cards=", shuffledDeck.length);

  if (gameMode == "no of players") {
    if (input < 1 || isNaN(input)) {
      myOutputValue = `Need at least 1 player to start.`;
    } else {
      myOutputValue = `Round ${round}: Game started with ${input} players and Dealer. Player 1 Please Place Your Bet.`;
      gameMode = "Place Bets";
      noOfPlayers = Number(input);
      // add a list of ALL PLAYERS and Dealer
      for (var i = 1; i <= noOfPlayers; i++) {
        playerList.push(`Player ${i}`);
      }
      for (var j = 0; j < noOfPlayers; j++) {
        chiplist.push(100);
      }
      playerList.push("Dealer");
    }
    return myOutputValue;
  } else if (gameMode == "Place Bets" && playerNo <= noOfPlayers) {
    if (input < 1 || input > 100 || isNaN(input)) {
      myOutputValue = `Invalid Amount.`;
    } else {
      betlist.push(input);
      chiplist[playerNo - 1] -= input;
      myOutputValue = `Player ${playerNo} has bet ${input} coins. Next Player to place bet.`;
      playerNo += 1;
      console.log(playerNo);
      if (playerNo > noOfPlayers) {
        gameMode = "New Player Draw Cards";
        playerNo = 1;
        var deck = createDeck();
        shuffledDeck = shuffleDeck(deck);
        return `All Bets Have Been Placed, Player 1 Hit Submit to Draw Cards`;
      }
    }
  } else if (playerNo <= noOfPlayers && gameMode == "New Player Draw Cards") {
    myOutputValue = "";
    playercards = dealCards(shuffledDeck);
    playerscore = cardScoreCount(playercards);
    myOutputValue += showhand(playercards);

    myOutputValue += `<br>Player ${playerNo} drew ${playercards[0].name} and ${playercards[1].name}<br>Total Score :${playerscore}. Hit or Stay? `;
    var roundscore = {
      score: playerscore,
      player: `${playerNo}`,
    };
    gameMode = "Player Hit Stay";
    return myOutputValue;
  } else if (playerNo <= noOfPlayers && gameMode == "Player Hit Stay") {
    myOutputValue = "";

    if (input.toLowerCase() == "hit") {
      myOutputValue = "";
      var playerNewCard = shuffledDeck.pop();
      playercards.push(playerNewCard);
      playerscore = cardScoreCount(playercards);

      playercards = aceValidation(playercards, playerscore);

      playerscore = cardScoreCount(playercards);
      // if player hits and bursts, move on to next player
      if (playerscore >= 21) {
        var roundscore = {
          score: playerscore,
          player: `${playerNo}`,
        };
        roundScores.push(roundscore);
        console.log(roundscore);
        gameMode = "New Player Draw Cards";
        myOutputValue += showhand(playercards);
        myOutputValue += `<br>Player ${playerNo} drew ${playerNewCard.name}. Total Score : ${playerscore} <br>It is ${playerList[playerNo]}'s turn.`;
        playerNo += 1;
        if (playerNo > noOfPlayers) {
          gameMode = "Dealer Draw Card";
        }
        return myOutputValue;
      }

      console.log("playerNo =", playerNo);
      console.log(gameMode);

      myOutputValue += showhand(playercards);
      myOutputValue += `<br>Player ${playerNo} drew ${playerNewCard.name}. Total Score : ${playerscore} <br>Hit or Stay?`;

      return myOutputValue;
    } else if (input.toLowerCase() == "stay" || playerscore > 21) {
      var roundscore = {
        score: playerscore,
        player: `${playerNo}`,
      };
      roundScores.push(roundscore);
      roundCards.push(playercards);
      myOutputValue += showhand(playercards);
      myOutputValue += `<br>Player ${playerNo} chooses to stay. Total Score : ${playerscore} <br>It is ${playerList[playerNo]}'s turn.`;
      playerNo += 1;
      if (playerNo > noOfPlayers) {
        gameMode = "Dealer Draw Card";
      } else {
        gameMode = "New Player Draw Cards";
      }
      console.log("playerNo =", playerNo);
      console.log(gameMode);
      return myOutputValue;
    }
  } else if (playerNo >= noOfPlayers && gameMode == "Dealer Draw Card") {
    var dealercards = [];
    var dealerCard1 = shuffledDeck.pop();
    var dealerCard2 = shuffledDeck.pop();
    dealercards.push(dealerCard1);
    dealercards.push(dealerCard2);
    myOutputValue = `Dealer drew ${dealerCard1.name} and ${dealerCard2.name}<br>`;

    dealerscore = cardScoreCount(dealercards);

    while (dealerscore < 17) {
      var dealerCard3 = shuffledDeck.pop();
      dealercards.push(dealerCard3);
      dealerscore += dealerCard3.value;
      dealercards = aceValidation(dealercards, dealerscore);
      myOutputValue += ` and ${dealerCard3.name}<br>`;
    }

    myOutputValue += showhand(dealercards);
    myOutputValue += `<br>Total Score :${dealerscore}. `;

    gameMode = "Decide Winner";
    var roundscore = {
      score: dealerscore,
      player: "Dealer",
    };
    roundCards.push(dealercards);
    //roundScores.push(roundscore);
    console.log(roundScores);
    return myOutputValue;
  } else if (gameMode == "Decide Winner") {
    console.log(roundScores);
    winners = winnerCheck(roundScores);
    for (var i = 0; i < winners.length; i++) {
      if (winners[i].score == dealerscore) {
        even.push(winners.splice(i, 1)[0]);
      }
    }
    var addW = "";
    for (var i = 1; i < winners.length; i++) {
      addW += `<br>Player ${winners[i].player} has won with ${winners[i].score} points.`;
    }
    if (dealerscore > 21) {
      if (winners.length == 0) {
        myOutputValue = `Everyone has busted.`;
      }
      myOutputValue = `The Dealer has busted. <br>Player ${winners[0].player} has won with ${winners[0].score} points. ${addW}`;
    } else if (dealerscore <= 21) {
      if (winners.length > 0 && winners[0].score > dealerscore) {
        myOutputValue = `<br>Player ${winners[0].player} has won with ${winners[0].score}points. ${addW}`;
      } else if (winners.length > 0 && winners[0].score == dealerscore) {
        var addW = "";
        for (var i = 1; i < winners.length; i++) {
          addW += `and ${winners[i].player}`;
        }
        myOutputValue = `<br>Player ${winners[0].player} ${addW} has tied with the dealer with ${winners[0].score}points.`;
      } else if (winners.length == 0) {
        myOutputValue = `The Dealer has won with ${dealerscore} points. Better luck next time!`;
      }
    }
    myOutputValue += `<br>Hit Submit to Distribute Winnings`;
    gameMode = "Distributing Winnings";
    myOutputValue += `<br>Player Scores:`;
    for (var i = 0; i < roundScores.length; i++) {
      var wincondition = "";
      if (
        (roundScores[i].score <= 21 && roundScores[i].score > dealerscore) ||
        (dealerscore > 21 && roundScores[i] <= 21)
      ) {
        wincondition = `WINS BET`;
      } else if (
        (roundScores[i].score < 21 && roundScores[i].score < dealerscore) ||
        roundScores[i].score > 21
      ) {
        wincondition = `LOSES BET`;
      } else if (
        roundScores[i].score <= 21 &&
        roundScores[i].score == dealerscore
      ) {
        wincondition = `BREAKS EVEN`;
      }

      myOutputValue += `<br>Player ${roundScores[i].player} : ${roundScores[i].score} points | ${wincondition}`;
    }

    return myOutputValue;
  } else if (gameMode == "Distributing Winnings") {
    myOutputValue = "";
    gameMode = "Reset Game";
    // if card points > dealer, player wins bet
    for (var i = 0; i < winners.length; i++) {
      chiplist[winners[i].player - 1] += betlist[winners[i].player - 1] * 2;
    }
    // if same card points as dealer, player breaks even
    for (var k = 0; k < even.length; k++) {
      chiplist[even[k].player - 1] += betlist[even[k].player - 1];
    }
    for (var j = 0; j < chiplist.length; j++) {
      myOutputValue += `Player ${j + 1} : ${chiplist[j]}<br>`;
    }
    myOutputValue += `<br>Hit Submit to Start a New Round.`;
  } else if (gameMode == "Reset Game") {
    round += 1;
    gameReset = resetGame();
    return gameReset;
  }
  return myOutputValue;
};

var createDeck = function () {
  deck = [];
  var suits = ["diamonds", "hearts", "clubs", "spades"];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 1; j <= 13; j++) {
      var card = {
        rank: j,
        suit: suits[i],
        name: `${j} of ${suits[i]}`,
        value: j,
        image: `${j}_of_${suits[i]}.png`,
      };
      if (card.rank == 1) {
        card.name = `Ace of ${suits[i]}`;
        card.value = 11;
        card.image = `ace_of_${suits[i]}.png`;
      } else if (card.rank == 11) {
        card.name = `Jack of ${suits[i]}`;
        card.value = 10;
        card.image = `jack_of_${suits[i]}.png`;
      } else if (card.rank == 12) {
        card.name = `Queen of ${suits[i]}`;
        card.value = 10;
        card.image = `queen_of_${suits[i]}.png`;
      } else if (card.rank == 13) {
        card.name = `King of ${suits[i]}`;
        card.value = 10;
        card.image = `king_of_${suits[i]}.png`;
      }
      deck.push(card);
    }
  }
  return deck;
};

var getRandomIndex = function (x) {
  return Math.floor(Math.random() * x);
};

var shuffleDeck = function (deck) {
  for (var i = 0; i < deck.length; i++) {
    var randomIndex = getRandomIndex(deck.length);
    var placeholder = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = placeholder;
  }
  return deck;
};

var cardScoreCount = function (cards) {
  score = 0;
  aceCount = 0;
  for (var i = 0; i < cards.length; i++) {
    score += cards[i].value;
    if (cards[i].rank == 1) {
      aceCount += 1;
    }
  }
  if (aceCount == cards.length) {
    score = 21;
  }

  return score;
};

var winnerCheck = function (scores) {
  // sort the playerscores descending order
  sorted = scores
    .sort(function (a, b) {
      return a.score - b.score;
    })
    .reverse();
  var winners = [];
  var losers = [];
  if (dealerscore > 21) {
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].score <= 21) {
        winners.push(sorted[i]);
      }
    }
  }
  if (dealerscore <= 21) {
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].score >= dealerscore && sorted[i].score <= 21) {
        winners.push(sorted[i]);
      }
    }
  }
  return winners;
};

var dealCards = function (shuffledDeck) {
  var playercards = [];
  var playerCard1 = shuffledDeck.pop();
  var playerCard2 = shuffledDeck.pop();
  playercards.push(playerCard1);
  playercards.push(playerCard2);
  return playercards;
};

var dealOneCard = function (playercards, cardDeck) {
  var playerNewCard = cardDeck.pop();
  playercards.push(playerNewCard);
  return playercards;
};

var resetGame = function () {
  gameMode = "Place Bets";
  playerNo = 1;
  roundCards = [];
  roundScores = [];
  playercards = [];
  dealercards = [];
  betlist = [];
  myOutputValue = `Round ${round}: Game started with ${noOfPlayers} players and Dealer. Player 1 please place your bet.`;
  return myOutputValue;
};

var showhand = function (cards) {
  var hand = "";
  for (var i = 0; i < cards.length; i++) {
    hand += `<img class="showcards" src="cards/${cards[i].image}"style="display:inline-block">`;
  }
  return hand;
};

var aceValidation = function (cards, score) {
  if (score > 21) {
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].rank == 1) {
        cards[i].value = 1;
        return cards;
      }
    }
  }
  return cards;
};
