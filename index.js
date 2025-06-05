
    const symbols = ['🍎', '🍌', '🍇', '🍉', '🍓', '🥝', '🍒', '🍍'];
    const gameBoard = document.getElementById('game-board');
    const attemptsSpan = document.getElementById('attempts');
    const messageDiv = document.getElementById('message');
    const restartBtn = document.getElementById('restart');

    const flipSound = document.getElementById('flip-sound');
    const matchSound = document.getElementById('match-sound');
    const noMatchSound = document.getElementById('no-match-sound');
    const winSound = document.getElementById('win-sound');

    let cards = [];
    let flippedCards = [];
    let matchedCount = 0;
    let attempts = 0;
    let lockBoard = false;
    let messageTimeout = null;

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function createCard(symbol) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.symbol = symbol;

      const front = document.createElement('div');
      front.classList.add('front');
      front.textContent = symbol;

      const back = document.createElement('div');
      back.classList.add('back');
      back.textContent = '❓';

      card.appendChild(front);
      card.appendChild(back);

      card.addEventListener('click', () => {
        if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        flipSound.play();
        flipCard(card);
        if (flippedCards.length === 2) checkMatch();
      });

      return card;
    }

    function flipCard(card) {
      card.classList.add('flipped');
      flippedCards.push(card);
    }

    function showMessage(text, color = 'green') {
      clearTimeout(messageTimeout);
      messageDiv.textContent = text;
      messageDiv.style.color = color;
      messageDiv.classList.add('visible');
      messageTimeout = setTimeout(() => {
        messageDiv.classList.remove('visible');
      }, 1800);
    }

    function checkMatch() {
      lockBoard = true;
      attempts++;
      attemptsSpan.textContent = attempts;

      const [card1, card2] = flippedCards;
      if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCount += 2;
        matchSound.play();
        showMessage('✅ Great! Match found!', 'green');
        resetFlippedCards();
        lockBoard = false;

        if (matchedCount === cards.length) {
          winSound.play();
          showMessage('🎉 Congratulations! You won the game!', 'blue');
        }
      } else {
        noMatchSound.play();
        showMessage('❌ Not a match. Try again!', 'red');
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          resetFlippedCards();
          lockBoard = false;
        }, 1200);
      }
    }

    function resetFlippedCards() {
      flippedCards = [];
    }

    function setupGame() {
      cards = [];
      flippedCards = [];
      matchedCount = 0;
      attempts = 0;
      lockBoard = false;
      attemptsSpan.textContent = attempts;
      messageDiv.textContent = '';
      messageDiv.classList.remove('visible');
      gameBoard.innerHTML = '';

      const doubledSymbols = [...symbols, ...symbols];
      shuffle(doubledSymbols);

      doubledSymbols.forEach(symbol => {
        const card = createCard(symbol);
        cards.push(card);
        gameBoard.appendChild(card);
      });
    }

    restartBtn.addEventListener('click', setupGame);

    setupGame();