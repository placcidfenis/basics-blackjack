var gameMode = "waiting to start";
var roundScores = [];
var playerscore = 0;
var dealerscore = 0;
var playercards = [];
var dealercards = [];
var main = function (input) {
  var deck = createDeck();
  var shuffledDeck = shuffleDeck(deck);

  if (gameMode == "waiting to start") {
    gameMode = "Player Draw Cards";
    myOutputValue = `Player 1, hit submit to draw cards`;
  } else if (gameMode == "Player Draw Cards") {
    var playercards = [];
    var playerCard1 = shuffledDeck.pop();
    var playerCard2 = shuffledDeck.pop();
    playercards.push(playerCard1);
    playercards.push(playerCard2);
    playerscore = cardScoreCount(playercards);
    myOutputValue = `Player 1 drew ${playerCard1.name} and ${playerCard2.name}<br>Total Score :${playerscore}. Hit or Stay? `;
    var roundscore = {
      score: playerscore,
      player: "Player",
    };
    gameMode = "Player Hit Stay";
  } else if (gameMode == "Player Hit Stay") {
    while (input == "hit") {
      var playerCard3 = shuffledDeck.pop();
      //playercards.push(playerCard3);
      playerscore += playerCard3.value;
      myOutputValue = `Player 1 drew ${playerCard3.name}. Total Score : ${playerscore} <br>Hit or Stay?`;
      return myOutputValue;
    }
    gameMode = "Dealer Draw Cards";
  } else if (gameMode == "Dealer Draw Cards") {
    var dealercards = [];
    var dealerCard1 = shuffledDeck.pop();
    var dealerCard2 = shuffledDeck.pop();
    dealercards.push(dealerCard1);
    dealercards.push(dealerCard2);
    myOutputValue = `Dealer drew ${dealerCard1.name} and ${dealerCard2.name}`;

    dealerscore = cardScoreCount(dealercards);
    if (dealerscore < 17) {
      var dealerCard3 = shuffledDeck.pop();
      dealercards.push(dealerCard3);
      dealerscore += dealerCard3.value;
      myOutputValue += ` and ${dealerCard3.name}`;
    }
    myOutputValue += `<br>Total Score :${dealerscore}. `;
    gameMode = "Decide Winner";
    var roundscore = {
      score: dealerscore,
      player: "Dealer",
    };
    roundScores.push(roundscore);
  } else if (gameMode == "Decide Winner") {
    console.log(playerscore, dealerscore);
    if (playerscore < 21 && dealerscore > 21) {
      myOutputValue = `Player won.`;
    } else if (playerscore > 21 && dealerscore < 21) {
      myOutputValue = `Dealer won.`;
    } else if (playerscore > 21 && dealerscore > 21) {
      myOutputValue = `Both Player and Dealer have busted, Tie Game.`;
    } else if (playerscore > dealerscore && playerscore <= 21) {
      myOutputValue = `Player won.`;
    } else if (dealerscore > playerscore && dealerscore <= 21) {
      myOutputValue = `Dealer won`;
    } else if (playerscore == dealerscore) {
      myOutputValue = `Both Player and Dealer have same score, Tie Game.`;
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
  for (var i = 0; i < cards.length; i++) {
    score += cards[i].value;
  }
  return score;
};

// check for winner | scores is an array of score and name
// var winningCheck = function (scores) {
//   highscore = 0;
//   sorted = scores
//     .sort(function (a, b) {
//       return a.score - b.score;
//     })
//     .reverse();
//   for (var i = 0; i < sorted.length; i++) {
//     if (sorted[i].score > 21) {
//       sorted.splice(i, 1);
//     }
//   }
//   score;
//};
