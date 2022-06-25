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

var main = function (input) {
  var deck = createDeck();
  var shuffledDeck = shuffleDeck(deck);

  if (gameMode == "no of players") {
    if (input < 1 || isNaN(input)) {
      myOutputValue = `Need at least 1 player to start.`;
    } else {
      myOutputValue = `Game started with ${input} players and Dealer.`;
      gameMode = "New Player Draw Cards";
      noOfPlayers = input;
      // add a list of ALL PLAYERS and Dealer
      for (var i = 1; i <= noOfPlayers; i++) {
        playerList.push(`Player ${i}`);
      }
      playerList.push("Dealer");
    }
  } else if (playerNo <= noOfPlayers && gameMode == "New Player Draw Cards") {
    var playercards = dealCards(shuffledDeck);
    playerscore = cardScoreCount(playercards);
    myOutputValue = `Player ${playerNo} drew ${playercards[0].name} and ${playercards[1].name}<br>Total Score :${playerscore}. Hit or Stay? `;
    var roundscore = {
      score: playerscore,
      player: `Player ${playerNo}`,
    };
    gameMode = "Player Hit Stay";
  } else if (playerNo <= noOfPlayers && gameMode == "Player Hit Stay") {
    if (input.toLowerCase() == "hit") {
      var playerNewCard = shuffledDeck.pop();
      // if player draws an Ace and scores >21, Ace is reduced to 1 point.
      if (playerNewCard.rank == 1 && playerscore + playerNewCard.value > 21) {
        playerNewCard.value = 1;
      }
      playerscore += playerNewCard.value;
      // if player hits and bursts, move on to next player
      if (playerscore >= 21) {
        var roundscore = {
          score: playerscore,
          player: `Player ${playerNo}`,
        };
        roundScores.push(roundscore);

        gameMode = "New Player Draw Cards";
        myOutputValue = `Player ${playerNo} drew ${playerNewCard.name}. Total Score : ${playerscore} <br>It is ${playerList[playerNo]}'s turn.`;
        playerNo += 1;
        if (playerNo > noOfPlayers) {
          gameMode = "Dealer Draw Card";
        }
        return myOutputValue;
      }
      myOutputValue = `Player ${playerNo} drew ${playerNewCard.name}. Total Score : ${playerscore} <br>Hit or Stay?`;
      return myOutputValue;
    } else if (input.toLowerCase() != "hit" || playerscore > 21) {
      var roundscore = {
        score: playerscore,
        player: `Player ${playerNo}`,
      };
      roundScores.push(roundscore);
      playerNo += 1;
      gameMode = "New Player Draw Cards";
    }
    if (playerNo > noOfPlayers) {
      gameMode = "Dealer Draw Card";
    }
  } else if (playerNo >= noOfPlayers && gameMode == "Dealer Draw Card") {
    var dealercards = [];
    var dealerCard1 = shuffledDeck.pop();
    var dealerCard2 = shuffledDeck.pop();
    dealercards.push(dealerCard1);
    dealercards.push(dealerCard2);
    myOutputValue = `Dealer drew ${dealerCard1.name} and ${dealerCard2.name}`;

    dealerscore = cardScoreCount(dealercards);
    do {
      var dealerCard3 = shuffledDeck.pop();
      dealercards.push(dealerCard3);
      dealerscore += dealerCard3.value;
      myOutputValue += ` and ${dealerCard3.name}`;
    } while (dealerscore < 17);
    myOutputValue += `<br>Total Score :${dealerscore}. `;
    gameMode = "Decide Winner";
    var roundscore = {
      score: dealerscore,
      player: "Dealer",
    };
    roundScores.push(roundscore);
  } else if (gameMode == "Decide Winner") {
    console.log(playerscore, dealerscore);
    var winners = winnerCheck(roundScores);
    console.log(winners);
    if (winners.length == 0) {
      myOutputValue = `Tie Game. Both Dealer and Player have bust.`;
    } else if (winners.length > 1) {
      var addW = "";
      for (var i = 1; i < winners.length; i++) {
        addW += `and ${winners[i].player}`;
      }
      myOutputValue = `${winners[0].player} ${addW} have won with ${winners[0].score} points.`;
    } else {
      myOutputValue = `${winners[0].player} has won with ${winners[0].score} points.`;
    }

    gameMode = "waiting to start";
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
      };
      if (card.rank == 1) {
        card.name = `Ace of ${suits[i]}`;
        card.value = 11;
      } else if (card.rank == 11) {
        card.name = `Jack of ${suits[i]}`;
        card.value = 10;
      } else if (card.rank == 12) {
        card.name = `Queen of ${suits[i]}`;
        card.value = 10;
      } else if (card.rank == 13) {
        card.name = `King of ${suits[i]}`;
        card.value = 10;
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
  // if Ace in hand and score bursts (>21), Ace to be counted as 1 point instead of 11
  if (score > 21 && aceCount > 0) {
    score -= 10;
  }
  return score;
};

// check for winner | scores is an array of score and name, returns a list of winners
var winnerCheck = function (scores) {
  var highscore = 0;
  var winners = [];
  sorted = scores
    .sort(function (a, b) {
      return a.score - b.score;
    })
    .reverse();
  console.log(sorted);
  for (var i = 0; i < sorted.length; i++) {
    if (sorted[i].score > 21) {
      sorted.splice(i, 1);
    }
  }
  highscore = sorted[0].score;
  for (var j = 0; j < sorted.length; j++) {
    if (sorted[j].score == highscore) {
      winners.push(sorted[j]);
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
