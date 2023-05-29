
let deckId = 0;
let totalCount = 0;
let studiedCount = 0;
let masteredCards = [];
let currentDeck = null;
let currentDeckName = null;
let generationInProgress = false;
let completedModalActive = false;
let allEasyEnough = false;
let studyType = "flashcards";
const easyButton = document.getElementById('easy-button');
const mediumButton = document.getElementById('medium-button');
const hardButton = document.getElementById('hard-button');
const correctSound = new Audio('../audio/success.mp3');
const incorrectSound = new Audio('../audio/fail.mp3');
const errorSound = new Audio('../audio/error.mp3');

easyButton.addEventListener('click', () => {
  hideFormFC();
	handleAnswer('Easy');
  easyButton.disabled = true;
  mediumButton.disabled = true;
  hardButton.disabled = true;
});

mediumButton.addEventListener('click', () => {
  hideFormFC();
	handleAnswer('Medium');
  easyButton.disabled = true;
  mediumButton.disabled = true;
  hardButton.disabled = true;
});

hardButton.addEventListener('click', () => {
  hideFormFC();
	handleAnswer('Hard');
  easyButton.disabled = true;
  mediumButton.disabled = true;
  hardButton.disabled = true;
});


async function handleAnswer(grade) {
  const currentCardIndex = getCurrentCardIndex();
  const decks = await fetchDecksRaw();
  const flashcardContainer = document.getElementById('flashcard-container');
  const card = flashcardContainer.children[currentCardIndex];
  const question = card.querySelector('.question').textContent
  deckId = await findDeck(question);
  console.log(question);
  let cardId;
  
  for (const deck of decks) {
  for (const c of deck.flashcards) {
  if (c.question === question) {
  cardId = c._id;
  break;
  }
  }
  if (cardId) {
  break;
  }
  }
  
  if (grade == 'Easy') {
  try {
  await updateCardEasyValueEasy(deckId, cardId);
  } catch (error) {
  console.error(error);
  }
  } else if (grade == 'Medium') {
  try {
    await updateCardEasyValueMedium(deckId, cardId);
  } catch (error) {
  console.error(error);
  }
  } else if (grade == 'Hard') {
    try {
      await updateCardEasyValueHard(deckId, cardId);
    } catch (error) {
    console.error(error);
    }
    }
  
  if (await isCardEasyEnough(deckId, cardId)) {
  moveToCompleted(currentCardIndex);
  }
  showNextCard();
  
  trackProgressFC(deckId);
  }
  
  async function updateCardEasyValueEasy(deckId, cardId) {
  const response = await fetch(`/easy/${deckId}/${cardId}`, {
  method: 'PATCH',
  credentials: 'include',
  });
  
  if (!response.ok) {
  throw new Error('Failed to update easy value of card');
  }
  }

  async function updateCardEasyValueMedium(deckId, cardId) {
    const mode = await getDeckMode();
    if (mode === 'short-term')  {
      console.log("Mode is short term, grading as medium.");
    const response = await fetch(`/medium/${deckId}/${cardId}`, {
    method: 'PATCH',
    credentials: 'include',
    });
    
    if (!response.ok) {
    throw new Error('Failed to update easy value of card');
    }
    } else {
      console.log("Mode is long term, resetting card.");
      const response = await fetch(`/reset-easy/${deckId}/${cardId}`, {
    method: 'PATCH',
    credentials: 'include',
    });
    
    if (!response.ok) {
    throw new Error('Failed to update easy value of card');
    }
    }
    }

    async function updateCardEasyValueHard(deckId, cardId) {
      const mode = await getDeckMode();
      if (mode === 'short-term')  {
      console.log("Mode is short term, grading as hard.");
      const response = await fetch(`/hard/${deckId}/${cardId}`, {
      method: 'PATCH',
      credentials: 'include',
      });
      
      if (!response.ok) {
      throw new Error('Failed to update easy value of card');
      }
      } else {
        console.log("Mode is long term, resetting card.");
        const response = await fetch(`/reset-easy/${deckId}/${cardId}`, {
      method: 'PATCH',
      credentials: 'include',
      });
      
      if (!response.ok) {
      throw new Error('Failed to update easy value of card');
      }
      }
    }
  
  async function resetCardEasyValue(deckId, cardId) {
  const response = await fetch(`/reset-easy/${deckId}/${cardId}`, {
  method: 'PATCH',
  credentials: 'include',
  });
  
  if (!response.ok) {
  throw new Error('Failed to reset easy value of card');
  }
  }
  

  async function showNextCard(raw) {
    easyButton.disabled = true;
    mediumButton.disabled = true;
    hardButton.disabled = true;
    const flashcardContainer = document.getElementById('flashcard-container');
    const cards = flashcardContainer.getElementsByClassName('flashcard');
    // Fetch deck data again
    const deckData = await fetchDeck(currentDeck);
    const deckFlashcards = deckData.deck.flashcards;
  
    allEasyEnough = true;
    for (let i = 0; i < deckFlashcards.length; i++) {
      if (deckFlashcards[i].easy < 3) {
        allEasyEnough = false;
        break;
      }
    }

      if (allEasyEnough === false) {
        let currentCardIndex = -1;
        for (let i = 0; i < cards.length; i++) {
          if (cards[i].style.display === 'block') {
            cards[i].style.display = 'none';
            currentCardIndex = i;
            break;
          }
        }

        const deckId = currentDeck;
    
        const nextCardIndex = await getNextQuestion(deckId);
    
        cards[nextCardIndex].style.display = 'block';
        showFormFC();

        easyButton.disabled = false;
        mediumButton.disabled = false;
        hardButton.disabled = false;
      }

      if (!raw)  {
      checkCompleted();
    }
    if (studyType === "truefalse") {
      populateTrueFalseQuestion(currentDeck);
    }
    else if (studyType === "multiplechoice") {
      populateMultipleChoiceQuestion(currentDeck);
    }
  }

function showCompletedModal() {
  if (completedModalActive === true)  {
    return;
  } else {
    hideFormTF();
    hideFormFC();
    hideForm();
completedModalActive = true;
  const modal = document.createElement('div');
        modal.innerHTML = `
            <div id="popup-modal" tabindex="-1" class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-40 flex items-center justify-center">
                <div class="relative w-full max-w-md max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div class="p-6 text-center">
                        <svg class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg> 
                      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Congratulations!</h3>
                            <p class="mb-5 text-gray-500 dark:text-gray-400">You have completed the deck!</p>
                            <button data-modal-hide="popup-modal" type="button" onclick="closeModal()" class="text-indigo-700 bg-white hover:bg-gray-100 focus:ring-4 border border-indigo-700 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Close
                            </button>
                            <button data-modal-hide="popup-modal" type="button" id="restartbtn" onclick="restartDeck()" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Start over
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        easyButton.disabled = true;
        mediumButton.disabled = true;
        hardButton.disabled = true;
        document.body.appendChild(modal);
        document.getElementById('restartbtn').addEventListener('click', function () {
            document.getElementById('popup-modal').remove();
            completedModalActive = false;
        });
      }
}
  
async function checkCompleted() {
  const deckData = await fetchDeck(currentDeck);
  const deckFlashcards = deckData.deck.flashcards;

  let allEasyEnough = true;
  for (let i = 0; i < deckFlashcards.length; i++) {
    if (deckFlashcards[i].easy < 3) {
      allEasyEnough = false;
      break;
    }
  }

  console.log("Deck completed: ", allEasyEnough)

  if (allEasyEnough === true) {
    showCompletedModal();
  }
  if (studyType === "truefalse")  {
    hideFormTF();
  }
}

function closeModal() {
	document.getElementById('popup-modal').remove();
  completedModalActive = false;
}



async function getNextQuestion(deckId) {
  hideForm();
  hideFormTF();
	try {
		// Fetch current deck
		const {
			deck
		} = await fetchDeck(deckId);
    const sortedFlashcards = deck.flashcards.filter(card => card.easy < 3).sort((a, b) => a.easy - b.easy);
		const nextCardIndex = deck.flashcards.indexOf(sortedFlashcards[0]);
		if (nextCardIndex !== -1) {
			return nextCardIndex;
		} else {
			console.log('The deck has been mastered');
			return 0;
		}
	} catch (error) {
		console.error(error);
	}
}

async function isCardEasyEnough(deckId, cardId) {
	try {
		const response = await fetch(`/card-easy/${deckId}/${cardId}`, {
			method: 'POST',
			credentials: 'include',
		});

		if (response.ok) {
			const {
				easy
			} = await response.json();
			return easy >= 3;
		} else {
			console.error('Failed to fetch card easy value');
			return false;
		}
	} catch (error) {
		console.error(error);
		return false;
	}
}




function getCurrentCardIndex() {
	const flashcardContainer = document.getElementById('flashcard-container');
	const currentCard = flashcardContainer.querySelector('.flashcard[style="display: block;"]');
	return Array.prototype.indexOf.call(flashcardContainer.children, currentCard);
}

async function fetchDecksRaw() {
	try {
		const response = await fetch('/user-decks', {
			credentials: 'include',
		});

		if (response.ok) {
			const decks = await response.json();

			return decks;

		} else {
			console.error('Failed to fetch decks');
		}
	} catch (error) {
		console.error(error);
	}
}


async function fetchDecks() {
  document.getElementById('nodecks').classList.add('hidden');
	try {
		const response = await fetch('/user-decks', {
			credentials: 'include',
		});

		if (response.ok) {
			const decks = await response.json();
			const deckSelectFlashcards = document.getElementById('deckFlashcards');
			const deckSelectMultipleChoice = document.getElementById('deckMultipleChoice');
      const deckSelectTrueFalse = document.getElementById('deckTrueFalse');
			const deckCountText = document.getElementById('deckCountText');
			const deckProgressBar = document.getElementById('deckProgressBar');
			const deckCountFraction = document.getElementById('deckCountFraction');
			const maxFreeDecks = 3;
			const userDecksCount = decks.length;

			// Update the trial box text
			if (userDecksCount < maxFreeDecks) {
        deckCountText.innerHTML = `You've created ${userDecksCount}/${maxFreeDecks} free decks. <span class="text-md text-white font-bold opacity-100 hover:text-gray-100 hover:underline ease-in-out"><a href="billing.html">Upgrade</a></span> to keep studying!`;
			} else {
				deckCountText.innerHTML = `You've generated the maximum number of decks on the free plan. <span class="text-md text-white font-bold opacity-100 hover:text-gray-100 hover:underline ease-in-out"><a href="billing.html">Upgrade</a></span> now to create more!`;
			}

			// Update the progress bar
			const progress = (userDecksCount / maxFreeDecks) * 100;
			deckProgressBar.innerHTML = `
              <div class="h-0.5 bg-white rounded-full" style="width: ${progress}%;"></div>
              <div class="h-0.5 bg-indigo-500 rounded-full" style="width: ${100 - progress}%;"></div>
            `;
			deckCountFraction.textContent = `${userDecksCount}/${maxFreeDecks} Decks`;

            // Check if the user has decks
            if (userDecksCount === 0) {
              document.getElementById('nodecks').classList.remove('hidden');
              document.getElementById('notVerifiedBanner').classList.add('hidden');
              return; // Exit the function
            } else {
              document.getElementById('flashcards').classList.remove('hidden');
            }

			// Create an array of promises to populate dropdown options
			const dropdownPromises = decks.map(async (deck) => {
				const optionFlashcards = document.createElement('option');
				optionFlashcards.value = deck._id;
				optionFlashcards.text = deck.name;
				deckSelectFlashcards.add(optionFlashcards);

				const optionMultipleChoice = document.createElement('option');
				optionMultipleChoice.value = deck._id;
				optionMultipleChoice.text = deck.name;
				deckSelectMultipleChoice.add(optionMultipleChoice);
			
      const optionTrueFalse = document.createElement('option');
      optionTrueFalse.value = deck._id;
      optionTrueFalse.text = deck.name;
      deckSelectTrueFalse.add(optionTrueFalse);

    });
			// Wait for all dropdown options to be populated before continuing
			await Promise.all(dropdownPromises);

			// Run the other code in the background
			for (let i = 0; i < decks.length; i++) {
				const deck = decks[i];
				if (i === 0) {
          if ((deck.beenStudied === false) && (await getPlan() === "pro")) {
            document.getElementById('studyOptionScreen').classList.remove('hidden');
          }
					deckId = deck._id;
          document.title = `Study - ${deck.name}`
          currentDeck = deckId;
					totalCount = deck.flashcards.length;
					checkDeckEasyValues(deckId);
					if (studyType === 'flashcards') {
						displayFlashcards(deck.flashcards);
					} else if (studyType === 'multiplechoice') {
						const isMC = await checkIfMultipleChoiceExists(deckId);
            if (isMC === false && generationInProgress === false) {
              generationInProgress = true;
              await generateMultipleChoiceQuestions(deckId);
              }
              generationInProgress = false;
              populateMultipleChoiceQuestion(deckId, 0);
              trackProgressMC(currentDeck);
            }
          else if (studyType === 'truefalse') {
						const isTF = await checkIfTrueFalseExists(deckId);
            if (isTF === false && generationInProgress === false) {
              generationInProgress = true;
              await generateTrueFalseQuestions(currentDeck);
              }
              generationInProgress = false;
              populateTrueFalseQuestion(currentDeck, 0);
              trackProgressTF(currentDeck);
					}
				}
			}
			trackProgressFC(deckId);
      checkCompleted();
		} else {
			console.error('Failed to fetch decks');
		}
	} catch (error) {
		console.error(error);
	}

}

document.getElementById('shortTermButton').addEventListener('click', function() {
  document.getElementById('studyOptionScreen').classList.add('hidden');
  updateDeckMode('short-term');
});

document.getElementById('longTermButton').addEventListener('click', function() {
  document.getElementById('studyOptionScreen').classList.add('hidden');
  updateDeckMode('long-term');
});

async function updateDeckMode(studyMode) {
  try {
    const response = await fetch(`/update-deck-mode/${currentDeck}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mode: studyMode }),
    });

    if (response.ok) {
console.log("Deck mode set to ", studyMode);
    } else {
      const error = await response.json();
      console.error(error.message);
    }
  } catch (error) {
    console.error(error);
  }
  trackProgressFC(currentDeck);
  trackProgressMC(currentDeck);
  trackProgressTF(currentDeck);
}


async function findDeck(question) {
	try {
		const response = await fetch('/user-decks', {
			credentials: 'include',
		});

		if (response.ok) {
			const decks = await response.json();
			let deckId, cardId;
			for (const deck of decks) {
				for (const card of deck.flashcards) {
					if (card.question === question) {
						deckId = deck._id;
						return deckId;
					}
				}
				if (deckId && cardId) {
					break;
				}
			}
		} else {
			console.error('Failed to fetch decks or card');
		}
	} catch (error) {
		console.error(error);
	}
}


async function findBoth(question) {
	try {
		const response = await fetch('/user-decks', {
			credentials: 'include',
		});

		if (response.ok) {
			const decks = await response.json();
			let deckId, cardId;
			for (const deck of decks) {
				for (const card of deck.flashcards) {
					if (card.question_mc === question || card.question === question) {
						deckId = deck._id;
            cardId = card._id;
            return { deckId, cardId };
					}
				}
				if (deckId && cardId) {
					break;
				}
			}
		} else {
			console.error('Failed to fetch decks or card');
		}
	} catch (error) {
		console.error(error);
	}
}

async function findBothTF(question) {
	try {
		const response = await fetch('/user-decks', {
			credentials: 'include',
		});

		if (response.ok) {
			const decks = await response.json();
			let deckId, cardId;
			for (const deck of decks) {
				for (const card of deck.flashcards) {
					if (card.question_tf === question) {
						deckId = deck._id;
            cardId = card._id;
            return { deckId, cardId };
					}
				}
				if (deckId && cardId) {
					break;
				}
			}
		} else {
			console.error('Failed to fetch decks or card');
		}
	} catch (error) {
		console.error(error);
	}
}

async function findCard(question) {
	try {
		const response = await fetch('/user-decks', {
			credentials: 'include',
		});

		if (response.ok) {
			const decks = await response.json();
			let deckId, cardId;
			for (const deck of decks) {
				for (const card of deck.flashcards) {
					if (card.question === question) {
						deckId = deck._id;
						cardId = card._id;
						return cardId;
					}
				}
				if (deckId && cardId) {
					break;
				}
			}
		} else {
			console.error('Failed to fetch decks or card');
		}
	} catch (error) {
		console.error(error);
	}
}

const handleDeckChange = async (deckId) => {
  
	clearCompletedContainer();
	const result = await fetchDeck(deckId);
	checkDeckEasyValues(deckId);
	const {
		deck,
		totalCount
	} = result;
  if (deck.beenStudied === false) {
    document.getElementById('studyOptionScreen').classList.remove('hidden');
  }
	if (studyType === 'flashcards') {
    hideFormFC();
		displayFlashcards(deck.flashcards);
		trackProgressFC(deckId);
    document.title = `Study - ${deck.name}`
	} else if (studyType === 'multiplechoice') {
		const isMC = await checkIfMultipleChoiceExists(deckId);
		if (isMC === false && generationInProgress === false) {
    generationInProgress = true;
	  await generateMultipleChoiceQuestions(deckId);
		}
    generationInProgress = false;
    document.title = `Study - ${deck.name}`
		populateMultipleChoiceQuestion(deckId, 0);
    trackProgressMC(currentDeck);
	}
  else if (studyType === 'truefalse') {
    const isTF = await checkIfTrueFalseExists(deckId);
    if (isTF === false && generationInProgress === false) {
      generationInProgress = true;
      await generateTrueFalseQuestions(currentDeck);
      }
      generationInProgress = false;
      document.title = `Study - ${deck.name}`
      if (allEasyEnough === false)  {
      populateTrueFalseQuestion(currentDeck, 0);
    }
      trackProgressTF(currentDeck);
    }
    checkCompleted();
}

async function trackProgressTF(deckId) {
	if (!deckId) {
		return;
	}
	const deck = await fetchDeck(deckId);
	const totalCards = deck.totalCount;
	const completedCards = deck.deck.flashcards.filter(card => card.easy >= 3);
	const progressTF = document.getElementById('progressTF');
	const percentageTF = document.getElementById('percentageTF');
	const progressBarTF = document.getElementById('progress-barTF');

	progressTF.textContent = `${completedCards.length}/${totalCards} Mastered`;
	const percentage = Math.floor((completedCards.length / totalCards) * 100);
	percentageTF.textContent = `${percentage}%`;

	// Set the initial width only if it's not set yet
	if (!progressBarTF.style.width) {
		progressBarTF.style.width = '0%';
	}

	const currentWidth = progressBarTF.style.width;

	progressBarTF.animate(
		[{
				width: currentWidth - currentWidth,
			},
			{
				width: `${percentage}%`,
			},
		], {
			duration: 500,
			easing: 'ease-out',
			fill: 'forwards',
		}
	);
}

async function trackProgressFC(deckId) {
	if (!deckId) {
		return;
	}
	const deck = await fetchDeck(deckId);
	const totalCards = deck.totalCount;
	const completedCards = deck.deck.flashcards.filter(card => card.easy >= 3);
	const progressMC = document.getElementById('progressFC');
	const percentageMC = document.getElementById('percentageFC');
	const progressBarMC = document.getElementById('progress-barFC');
  const mode = await fetchMode(deckId);
  if (mode != "none") {
	progressMC.textContent = `${completedCards.length}/${totalCards} Mastered - ${mode}`;
  }
  else { progressMC.textContent = `${completedCards.length}/${totalCards} Mastered`; }
	const percentage = Math.floor((completedCards.length / totalCards) * 100);
	percentageMC.textContent = `${percentage}%`;

	// Set the initial width only if it's not set yet
	if (!progressBarMC.style.width) {
		progressBarMC.style.width = '0%';
	}

	const currentWidth = progressBarMC.style.width;

	progressBarMC.animate(
		[{
				width: currentWidth - currentWidth,
			},
			{
				width: `${percentage}%`,
			},
		], {
			duration: 500,
			easing: 'ease-out',
			fill: 'forwards',
		}
	);
}

async function resetProgress(deckId) {
	if (!deckId) {
		return;
	}
	const deck = await fetchDeck(deckId);
	const totalCards = deck.totalCount;
	const completedCards = 0;
	const progressMC = document.getElementById('progressFC');
	const percentageMC = document.getElementById('percentageFC');
	const progressBarMC = document.getElementById('progress-barFC');

	progressMC.textContent = `${completedCards}/${totalCards} Mastered`;
	const percentage = Math.floor((completedCards / totalCards) * 100);
	percentageMC.textContent = `${percentage}%`;

	// Set the initial width only if it's not set yet
	if (!progressBarMC.style.width) {
		progressBarMC.style.width = '0%';
	}

	const currentWidth = progressBarMC.style.width;

	progressBarMC.animate(
		[{
				width: currentWidth - currentWidth,
			},
			{
				width: `${percentage}%`,
			},
		], {
			duration: 500,
			easing: 'ease-out',
			fill: 'forwards',
		}
	);
}

async function trackProgressMC(deckId) {
	const deck = await fetchDeck(deckId);
	const totalCards = deck.totalCount;
	const completedCards = deck.deck.flashcards.filter(card => card.easy >= 3).length;
	const progressMC = document.getElementById('progressMC');
	const percentageMC = document.getElementById('percentageMC');
	const progressBarMC = document.getElementById('progress-barMC');

	progressMC.textContent = `${completedCards}/${totalCards} Mastered`;
	const percentage = Math.floor((completedCards / totalCards) * 100);
	percentageMC.textContent = `${percentage}%`;

	// Set the initial width only if it's not set yet
	if (!progressBarMC.style.width) {
		progressBarMC.style.width = '0%';
	}

	const currentWidth = progressBarMC.style.width;

	progressBarMC.animate(
		[{
				width: currentWidth - currentWidth,
			},
			{
				width: `${percentage}%`,
			},
		], {
			duration: 500,
			easing: 'ease-out',
			fill: 'forwards',
		}
	);
}

document.getElementById('deckFlashcards').addEventListener('change', async (event) => {
  hideFormFC();
  const optionElement = document.querySelector(`option[value="${event.target.value}"]`);
  currentDeck = optionElement.value;
	await handleDeckChange(event.target.value);
  console.log(currentDeck);
});

document.getElementById('deckMultipleChoice').addEventListener('change', async (event) => {
  const optionElement = document.querySelector(`option[value="${event.target.value}"]`);
  currentDeck = optionElement.value;
	await handleDeckChange(event.target.value);
  console.log(currentDeck);
});

document.getElementById('deckTrueFalse').addEventListener('change', async (event) => {
  const optionElement = document.querySelector(`option[value="${event.target.value}"]`);
  currentDeck = optionElement.value;
	await handleDeckChange(event.target.value);
  console.log(currentDeck);
});

document.getElementById('startoverFC').addEventListener('click', async function() {
  allEasyEnough = false;
	restartDeck();
  showFormFC();
});
document.getElementById('startoverMC').addEventListener('click', async function() {
  allEasyEnough = false;
	restartDeck();
  showForm();
});
document.getElementById('startoverTF').addEventListener('click', async function() {
  allEasyEnough = false;
	restartDeck();
  showFormTF();
});

async function restartDeck() {
	const flashcardContainer = document.getElementById('flashcard-container');
	const currentCardIndex = getCurrentCardIndex();
	const card = flashcardContainer.children[currentCardIndex];
	const question = card.querySelector('.question').textContent
	const deckId = await findDeck(question);
	const {
		deck
	} = await fetchDeck(deckId);
	resetDeckEasyValues(currentDeck);
  if (studyType === "flashcards") {
    clearCompletedContainer();
    displayFlashcards(deck.flashcards);
    trackProgressFC(currentDeck);
    showFormFC();
    easyButton.disabled = false;
    mediumButton.disabled = false;
    hardButton.disabled = false;
  }
  else if (studyType === "multiplechoice")  {
    resetDeckEasyValues(currentDeck);
    clearCompletedContainer();
    populateMultipleChoiceQuestion(currentDeck);
    trackProgressMC(currentDeck);

  }
  else if (studyType === "truefalse") {
    resetDeckEasyValues(currentDeck);
    clearCompletedContainer();
    populateTrueFalseQuestion(currentDeck);
    trackProgressTF(currentDeck);
  }
	resetProgress(deckId);
}

async function resetDeckEasyValues(deckId) {
	try {
		const response = await fetch(`/reset-easy/${deckId}`, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error);
		}
		const responseData = await response.json();
		console.log("reset successfully:");
		console.log(responseData.message);
	} catch (error) {
		console.error(error);
	}
}

function clearCompletedContainer() {
	const ul = document.querySelector('#completed-container ul');
  const ulmc = document.querySelector('#completed-container-mc ul');
  const ultf = document.querySelector('#completed-container-tf ul');
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}
  while (ulmc.firstChild) {
		ulmc.removeChild(ulmc.firstChild);
	}
  while (ultf.firstChild) {
		ultf.removeChild(ultf.firstChild);
	}
}

const completedContainer = document.getElementById("completed-container");
const completedContainerMC = document.getElementById("completed-container-mc");
const completedContainerTF = document.getElementById("completed-container-tf");
const ul = completedContainer.querySelector("ul");
const ulmc = completedContainerMC.querySelector("ul");
const ultf = completedContainerTF.querySelector("ul");

// function to toggle hidden class on completed container
function toggleCompletedContainer() {
	if (ul.children.length > 0) {
		completedContainer.classList.remove("hidden");
	} else {
		completedContainer.classList.add("hidden");
	}
  if (ulmc.children.length > 0) {
		completedContainerMC.classList.remove("hidden");
	} else {
		completedContainerMC.classList.add("hidden");
	}
  if (ultf.children.length > 0) {
		completedContainerTF.classList.remove("hidden");
	} else {
		completedContainerTF.classList.add("hidden");
	}
}

// listen for changes in the ul element
const observer = new MutationObserver(function() {
	toggleCompletedContainer();
});

observer.observe(ul, {
	childList: true
});

// initial check
toggleCompletedContainer();

const loadingScreen = document.getElementById('loading-screen-mc');
const loadingScreenTF = document.getElementById('loading-screen-tf');

// Function to show the loading screen
function showLoadingScreenMC() {
  loadingScreen.classList.remove('hidden');
  const typewriterText = document.getElementById("typewriter-text");
  const typewriter = new Typewriter(typewriterText, {
    loop: false,
    delay: 50,
  });
  typewriter
    .pauseFor(1000)
    .typeString("We're getting your multiple choice questions ready. This only happens once.")
    .pauseFor(1300)
    .deleteChars(18)
    .typeString("may take a second.")
    .pauseFor(3000)
    .deleteAll()
    .typeString("Beautiful weather today, right?")
    .pauseFor(3000)
    .deleteAll()
    .typeString("If you're enjoying Flashly, please share us with your friends!")
    .start();  
    getRandomMeme();
}

function showLoadingScreenTF() {
  loadingScreenTF.classList.remove('hidden');
  const typewriterText = document.getElementById("typewriter-text-tf");
  const typewriter = new Typewriter(typewriterText, {
    loop: false,
    delay: 50,
  });
  typewriter
    .pauseFor(1000)
    .typeString("We're getting your true or false questions ready. This only happens once.")
    .pauseFor(1300)
    .deleteChars(18)
    .typeString("may take a second.")
    .pauseFor(3000)
    .deleteAll()
    .typeString("Beautiful weather today, right?")
    .pauseFor(3000)
    .deleteAll()
    .typeString("If you're enjoying Flashly, please share us with your friends!")
    .start();  
    getRandomMemeTF();
}

// Function to hide the loading screen
function hideLoadingScreen() {
  loadingScreen.classList.add('hidden');
}

function hideLoadingScreenTF() {
  loadingScreenTF.classList.add('hidden');
}

async function generateMultipleChoiceQuestions(deckId) {
  console.log(`Function called with deckId of ${deckId}`);
  try {
    showLoadingScreenMC(); // Show the loading screen before the fetch call
    const {
      deck
    } = await fetchDeck(deckId);
    console.log(`Result before function: ${deck}`);
    const cards = deck.flashcards;
    const pairs = [];
    cards.forEach((card) => {
      if (card.question && card.answer) {
        pairs.push(`Q: ${card.question}\nA: ${card.answer}`);
      }
    });
    console.log("Successfully extracted pairs: " + pairs);
    const response = await fetch(`/generate-multiple-choice`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: pairs.join(',\n'),
        deckId
      })
    });
    console.log(response.data);
    if (response.status === 200) {
      hideLoadingScreen(); // Hide the loading screen if the response is successful
      populateMultipleChoiceQuestion(currentDeck);
    }
  } catch (error) {
    console.error(error);
    hideLoadingScreen(); // Hide the loading screen in case of an error
  }
}

async function generateTrueFalseQuestions(deckId) {
  console.log(`Function called with deckId of ${deckId}`);
  try {
    showLoadingScreenTF(); // Show the loading screen before the fetch call
    const {
      deck
    } = await fetchDeck(deckId);
    console.log(`Result before function: ${deck}`);
    const cards = deck.flashcards;
    const pairs = [];
    cards.forEach((card) => {
      if (card.question && card.answer) {
        pairs.push(`Q: ${card.question}\nA: ${card.answer}`);
      }
    });
    console.log("Successfully extracted pairs: " + pairs);
    const response = await fetch(`/generate-truefalse`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: pairs.join(',\n'),
        deckId
      })
    });
    console.log(response.data);
    if (response.status === 200) {
      hideLoadingScreenTF(); // Hide the loading screen if the response is successful
      populateTrueFalseQuestion(currentDeck);

    }
  } catch (error) {
    console.error(error);
    hideLoadingScreenTF(); // Hide the loading screen in case of an error
  }
}




function createFlashcard(flashcard) {
	const card = document.createElement('div');
	card.classList.add('flashcard', 'max-w-2xl', 'mx-auto', 'mb-8');

	card.innerHTML = `
    <div class="flashcard-inner p-8 rounded-lg">
      <div class="flashcard-front shadow-lg absolute top-0 left-0 w-full min-h-[24rem] p-4 bg-indigo-700 text-white font-medium text-2xl text-center flex items-center justify-center rounded-lg">
        <div class="question">${flashcard.question}</div>
      </div>
      <div class="flashcard-back shadow-lg absolute top-0 left-0 w-full min-h-[24rem] p-4 bg-white text-indigo-700 font-medium text-2xl text-center flex items-center justify-center rounded-lg">
        <div class="answer">${flashcard.answer}</div>
      </div>
    </div>
  `;

	return card;
}


function displayFlashcards(flashcards) {
  easyButton.disabled = false;
  mediumButton.disabled = false;
  hardButton.disabled = false;
	const flashcardContainer = document.getElementById('flashcard-container');
	flashcardContainer.innerHTML = ''; // Clear the existing flashcards

	flashcards.forEach((flashcard, index) => {
		const card = createFlashcard(flashcard);
		if (index === 0) {
			card.style.display = 'block';
		} else {
			card.style.display = 'none';
		}
		flashcardContainer.appendChild(card);
	});
	gradedCards = {}; // Reset gradedCards when new flashcards are displayed
  showNextCard(true);
  showFormFC();
}

async function checkAnswerTF() {

  const selectedOptions = document.querySelectorAll(".selected");
  selectedOptions.forEach((option) => option.checked = false);
  const selectedOption = document.querySelector('input[name="answer"]:checked');
if (!selectedOption) {
  errorSound.volume = 0.4;
  errorSound.play();
  const warningAlert = document.createElement("div");
  warningAlert.classList.add("flex", "p-4", "m-12", "text-sm", "text-yellow-800", "rounded-lg", "bg-yellow-100", "dark:bg-gray-800", "dark:text-yellow-300", "fixed", "bottom-0", "border", "border-yellow-200", "right-0", "opacity-0", "transition", "duration-300", "slide-up");
  warningAlert.setAttribute("role", "alert");
  warningAlert.innerHTML = `
    <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
    </svg>
    <span class="font-medium">Please select an answer.</span>
  `;
  document.body.appendChild(warningAlert);
  // Trigger a reflow to enable transition
  warningAlert.offsetHeight;
  warningAlert.classList.add("opacity-100");

  setTimeout(() => {
    warningAlert.style.opacity = '0';
    setTimeout(() => {
      warningAlert.remove();
    }, 500); // Wait for transition to finish before removing element
  }, 3000);
  
  return;
}

  const parent = selectedOption.parentNode;
  const optionsParent = selectedOption.parentNode.parentNode;
  const questionText = document.getElementById('TFquestion');
  console.log(questionText);
  console.log(optionsParent);
  // if answer is correct
  const { deckId, cardId } = await findBothTF(questionText.textContent);
  if (parent.classList.contains('answer')) {
    if (correctSound.paused) { // check if the audio is not currently playing
      correctSound.play();
    } else {
      correctSound.currentTime = 0; // reset the audio to the beginning
    }  
    await updateCardEasyValueEasy(deckId, cardId);
    const response = await fetch(`/card-easy/${deckId}/${cardId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ deckId, cardId })
    });
    
    const { easy } = await response.json(); // Extract the value of the "easy" property
    const hehe = await findCardIndexTF(currentDeck, questionText.textContent);
    console.log("easy: ", easy);
    console.log(hehe);
          if (easy >= 3)  {
            moveToCompleted(await findCardIndexTF(currentDeck, questionText.textContent));
          }
    questionText.textContent = 'Correct!';
    const checkmark = document.createElement("i");
    checkmark.classList.add("fas", "fa-check", "text-indigo-700", "text-xl", "px-3");
    parent.appendChild(checkmark);
    parent.style.background = "rgba(144, 238, 144, 0.4)";
    parent.style.animation = "slide-in 0.5s ease";
    const options = optionsParent.querySelectorAll('.flex.items-center.w-full');
    for (let i = 0; i < options.length; i++) {
      if (options[i] !== parent) {
        options[i].querySelector('input[name="answer"]').disabled = true;
        options[i].style.background = "rgba(255, 128, 128, 0.4)";
        options[i].style.animation = "slide-in 0.5s ease";
        const xIcon = document.createElement("i");
        xIcon.classList.add("fas", "fa-times", "text-indigo-700", "text-xl", "px-3");
        options[i].appendChild(xIcon);
      }
      optionsParent.querySelectorAll('div').forEach(div => div.style.pointerEvents = "none");
    }
    // if answer is incorrect
  } else {
    questionText.textContent = 'Incorrect';
    incorrectSound.volume = 0.4;
    if (incorrectSound.paused) { // check if the audio is not currently playing
      incorrectSound.play();
    } else {
      incorrectSound.currentTime = 0; // reset the audio to the beginning
    }  
    updateCardEasyValueHard(deckId, cardId);
    const options = optionsParent.querySelectorAll('.flex.items-center.w-full');
    for (let i = 0; i < options.length; i++) {
      options[i].querySelector('input[name="answer"]').disabled = true;
      options[i].style.animation = "slide-in 0.5s ease";
      if (options[i].classList.contains('answer')) {
        options[i].style.background = "rgba(144, 238, 144, 0.4)";
        const checkmark = document.createElement("i");
        checkmark.classList.add("fas", "fa-check", "text-indigo-700", "text-xl", "px-3");
        options[i].appendChild(checkmark);
      } else {
        options[i].style.background = "rgba(255, 128, 128, 0.4)";
        const xIcon = document.createElement("i");
        xIcon.classList.add("fas", "fa-times", "text-indigo-700", "text-xl", "px-3");
        options[i].appendChild(xIcon);
      }
      optionsParent.querySelectorAll('div').forEach(div => div.style.pointerEvents = "none");
    }
  }
  const actionButton = document.querySelector('#actionButtonTF');
  console.log(actionButton + "is the actionbuttontf");
    actionButton.textContent = "Next"; // change button text to 'Next'
    actionButton.classList.add('next');
    actionButton.classList.remove('submit');
    trackProgressTF(currentDeck);
}

async function checkAnswer() {
  const selectedOptions = document.querySelectorAll(".selected");
  selectedOptions.forEach((option) => option.checked = false);
  const selectedOption = document.querySelector('input[name="answer"]:checked');
if (!selectedOption) {
  errorSound.volume = 0.4;
  if (errorSound.paused) { // check if the audio is not currently playing
    errorSound.play();
  } else {
    errorSound.currentTime = 0; // reset the audio to the beginning
  }  
  const warningAlert = document.createElement("div");
  warningAlert.classList.add("flex", "p-4", "m-12", "text-sm", "text-yellow-800", "rounded-lg", "bg-yellow-100", "dark:bg-gray-800", "dark:text-yellow-300", "fixed", "bottom-0", "border", "border-yellow-200", "right-0", "opacity-0", "transition", "duration-300", "slide-up");
  warningAlert.setAttribute("role", "alert");
  warningAlert.innerHTML = `
    <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
    </svg>
    <span class="font-medium">Please select an answer.</span>
  `;
  document.body.appendChild(warningAlert);
  // Trigger a reflow to enable transition
  warningAlert.offsetHeight;
  warningAlert.classList.add("opacity-100");

  setTimeout(() => {
    warningAlert.style.opacity = '0';
    setTimeout(() => {
      warningAlert.remove();
    }, 500); // Wait for transition to finish before removing element
  }, 3000);
  
  return;
}

  const parent = selectedOption.parentNode;
  const optionsParent = selectedOption.parentNode.parentNode;
  const questionText = document.getElementById('MCquestion');
  console.log(questionText);
  console.log(optionsParent);
  // if answer is correct
  const { deckId, cardId } = await findBoth(questionText.textContent);
  if (parent.classList.contains('answer')) {
    if (correctSound.paused) { // check if the audio is not currently playing
      correctSound.play();
    } else {
      correctSound.currentTime = 0; // reset the audio to the beginning
    }  
    updateCardEasyValueEasy(deckId, cardId);
    const response = await fetch(`/card-easy/${deckId}/${cardId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ deckId, cardId })
});

const { easy } = await response.json(); // Extract the value of the "easy" property
const hehe = await findCardIndex(currentDeck, questionText.textContent);
console.log("easy: ", easy);
console.log(hehe);
      if (easy >= 3)  {
        moveToCompleted(await findCardIndex(currentDeck, questionText.textContent));
      }
    questionText.textContent = 'Correct!';
    const checkmark = document.createElement("i");
    checkmark.classList.add("fas", "fa-check", "text-indigo-700", "text-xl", "px-3");
    parent.appendChild(checkmark);
    parent.style.background = "rgba(144, 238, 144, 0.4)";
    parent.style.animation = "slide-in 0.5s ease";
    const options = optionsParent.querySelectorAll('.flex.items-center.w-full');
    for (let i = 0; i < options.length; i++) {
      if (options[i] !== parent) {
        options[i].querySelector('input[name="answer"]').disabled = true;
        options[i].style.background = "rgba(255, 128, 128, 0.4)";
        options[i].style.animation = "slide-in 0.5s ease";
        const xIcon = document.createElement("i");
        xIcon.classList.add("fas", "fa-times", "text-indigo-700", "text-xl", "px-3");
        options[i].appendChild(xIcon);
      }
      optionsParent.querySelectorAll('div').forEach(div => div.style.pointerEvents = "none");
    }
    
    // if answer is incorrect
  } else {
    questionText.textContent = 'Incorrect';
    incorrectSound.volume = 0.4;
    if (incorrectSound.paused) { // check if the audio is not currently playing
      incorrectSound.play();
    } else {
      incorrectSound.currentTime = 0; // reset the audio to the beginning
    }  
    updateCardEasyValueHard(deckId, cardId);
    const options = optionsParent.querySelectorAll('.flex.items-center.w-full');
    for (let i = 0; i < options.length; i++) {
      options[i].querySelector('input[name="answer"]').disabled = true;
      options[i].style.animation = "slide-in 0.5s ease";
      if (options[i].classList.contains('answer')) {
        options[i].style.background = "rgba(144, 238, 144, 0.4)";
        const checkmark = document.createElement("i");
        checkmark.classList.add("fas", "fa-check", "text-indigo-700", "text-xl", "px-3");
        options[i].appendChild(checkmark);
      } else {
        options[i].style.background = "rgba(255, 128, 128, 0.4)";
        const xIcon = document.createElement("i");
        xIcon.classList.add("fas", "fa-times", "text-indigo-700", "text-xl", "px-3");
        options[i].appendChild(xIcon);
      }
      optionsParent.querySelectorAll('div').forEach(div => div.style.pointerEvents = "none");
    }
  }
  const actionButton = document.querySelector('#actionButton');
    actionButton.textContent = "Next"; // change button text to 'Next'
    actionButton.classList.add('next');
    actionButton.classList.remove('submit');
    trackProgressMC(currentDeck);
}
function shuffleOptions(options) {
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}
window.addEventListener('DOMContentLoaded', function()  {
  const actionButton = document.querySelector("#actionButton");
  actionButton.addEventListener("click", function() {
    if (actionButton.classList.contains('submit'))  {
      checkAnswer();
    }
    else if (actionButton.classList.contains('next')) {
      hideForm();
      const selectedOption = document.querySelector('input[name="answer"]:checked');
      selectedOption.style = "";
      const optionsParent = selectedOption.parentNode.parentNode;
      const options = optionsParent.querySelectorAll('.flex.items-center.w-full');
        for (let i = 0; i < options.length; i++) {
          options[i].style = "";
          options[i].querySelector('input').disabled = false;
          optionsParent.querySelectorAll('div').forEach(div => div.style.pointerEvents = "true");
        }
        optionsParent.querySelectorAll('i').forEach(i => i.remove());
        showNextCard();
        console.log(currentDeck);
            }
  });
  const actionButtonTF = document.querySelector("#actionButtonTF");
  actionButtonTF.addEventListener("click", function() {
    if (actionButtonTF.classList.contains('submit'))  {
      checkAnswerTF();
    }
    else if (actionButtonTF.classList.contains('next')) {
      hideFormTF();
      const selectedOption = document.querySelector('input[name="answer"]:checked');
      selectedOption.style = "";
      const optionsParent = selectedOption.parentNode.parentNode;
      const options = optionsParent.querySelectorAll('.flex.items-center.w-full');
        for (let i = 0; i < options.length; i++) {
          options[i].style = "";
          options[i].querySelector('input').disabled = false;
          optionsParent.querySelectorAll('div').forEach(div => div.style.pointerEvents = "true");
        }
        optionsParent.querySelectorAll('i').forEach(i => i.remove());
        showNextCard();
        console.log(currentDeck);
            }
  });

});

async function getRandomMeme() {
	const apiUrl = "https://api.giphy.com/v1/gifs/trending?api_key=cAQ1mP15e48H4YH1EeQHPByQbXTbItIg&limit=25&rating=g";
	const memeElement = document.getElementById("random-meme");
  memeElement.innerHTML = "";
	try {
		const response = await fetch(apiUrl);
		const data = await response.json();
		const gifs = data.data;
		const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

		const img = document.createElement("img");
		img.src = randomGif.images.fixed_height.url;
		img.alt = randomGif.title;

		// Set the width and height based on screen size
		const screenSize = window.innerWidth;
		if (screenSize <= 640) { // For small screens
			img.width = 150;
			img.height = 150;
		} else { // For larger screens
			img.width = 300;
			img.height = 300;
		}

		img.className = "rounded-lg";
		memeElement.appendChild(img);
	} catch (error) {
		console.error("Error fetching random gif:", error);
	}
}
async function getRandomMemeTF() {
	const apiUrl = "https://api.giphy.com/v1/gifs/trending?api_key=cAQ1mP15e48H4YH1EeQHPByQbXTbItIg&limit=25&rating=g";
	const memeElement = document.getElementById("random-meme-tf");
  memeElement.innerHTML = "";
	try {
		const response = await fetch(apiUrl);
		const data = await response.json();
		const gifs = data.data;
		const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

		const img = document.createElement("img");
		img.src = randomGif.images.fixed_height.url;
		img.alt = randomGif.title;

		// Set the width and height based on screen size
		const screenSize = window.innerWidth;
		if (screenSize <= 640) { // For small screens
			img.width = 150;
			img.height = 150;
		} else { // For larger screens
			img.width = 300;
			img.height = 300;
		}

		img.className = "rounded-lg";
		memeElement.appendChild(img);
	} catch (error) {
		console.error("Error fetching random gif:", error);
	}
}

function showLoadingScreen() {
	const loadingScreen = document.getElementById('loading-screen');
	// Unhide the loading screen
	loadingScreen.classList.remove('hidden');

	// Hide the loading screen after 1 second
	setTimeout(() => {
		loadingScreen.classList.add('hidden');
	}, 800);
}


async function fetchDeck(deckId) {
	try {
		const response = await fetch(`/deck/${deckId}`, {
			credentials: 'include',
		});
		if (response.ok) {
			const deck = await response.json();
			const totalCount = deck.flashcards.length;
			return {
				deck,
				totalCount,
			};
		} else {
			console.error('Failed to fetch deck');
		}
	} catch (error) {
		console.error(error);
	}
}

async function fetchMode(deckId) {
	try {
		const response = await fetch(`/mode/${deckId}`, {
			credentials: 'include',
		});
		if (response.ok) {
			const mode = await response.json();
			if (mode === "short-term")  {
        return "Rapid Study";
      } else if (mode === "long-term")  {
        return "Full Study";
      } else  {
        return "none";
      }

		} else {
			console.error('Failed to fetch deck');
		}
	} catch (error) {
		console.error(error);
	}
}

async function fetchDeckText(deckId) {
	try {
		const response = await fetch(`/deck/${deckId}`, {
			credentials: 'include',
		});

		if (response.ok) {
			const deck = await response.json();
			let combinedString = '';
			for (let i = 0; i < deck.flashcards.length; i++) {
				const flashcard = deck.flashcards[i];
				combinedString += `${flashcard.question}\n${flashcard.answer}\n\n`;
			}
			return combinedString.trim();
		} else {
			console.error('Failed to fetch deck');
		}
	} catch (error) {
		console.error(error);
	}
}


function removeCompletedItemByQuestion(questionText) {
  const completedContainer = document.getElementById('completed-container');
  const completedContainerMC = document.getElementById('completed-container-mc');
  const completedContainerTF = document.getElementById('completed-container-tf');

  // search for the li element with the given question text in completedContainer
  const liToRemove = Array.from(completedContainer.querySelectorAll('li')).find(li => {
    const question = li.querySelector('.truncate');
    return question && question.textContent === questionText;
  });

  if (liToRemove) {
    liToRemove.remove();
  }

  // search for the li element with the given question text in completedContainerMC
  const liMCToRemove = Array.from(completedContainerMC.querySelectorAll('li')).find(li => {
    const question = li.querySelector('.truncate');
    return question && question.textContent === questionText;
  });

  if (liMCToRemove) {
    liMCToRemove.remove();
  }
   // search for the li element with the given question text in completedContainerMC
   const liTFToRemove = Array.from(completedContainerTF.querySelectorAll('li')).find(li => {
    const question = li.querySelector('.truncate');
    return question && question.textContent === questionText;
  });

  if (liTFToRemove) {
    liTFToRemove.remove();
  }
  
  trackProgressMC(currentDeck);
  trackProgressFC(currentDeck);
  trackProgressTF(currentDeck);

}



function moveToCompleted(cardIndex) {
  console.log("function called with index ", cardIndex);
  const flashcardContainer = document.getElementById('flashcard-container');
  const card = flashcardContainer.children[cardIndex];
  const question = card.querySelector('.question').textContent;
  const answer = card.querySelector('.answer').textContent;
  const completedContainer = document.getElementById('completed-container');
  const completedContainerMC = document.getElementById('completed-container-mc');
  const completedContainerTF = document.getElementById('completed-container-tf');
  const li = document.createElement('li');
  li.classList.add('py-3', 'sm:py-4');

  const div = document.createElement('div');
  div.classList.add('flex', 'items-center', 'space-x-4');

  const divFlex = document.createElement('div');
  divFlex.classList.add('flex-1', 'min-w-0');

  const pQuestion = document.createElement('p');
  pQuestion.classList.add('text-sm', 'font-medium', 'text-gray-900', 'truncate', 'dark:text-white');
  pQuestion.textContent = question;

  const pAnswer = document.createElement('p');
  pAnswer.classList.add('text-sm', 'text-gray-500', 'truncate', 'dark:text-gray-400');
  pAnswer.textContent = answer;

  const divButton = document.createElement('div');
  divButton.classList.add('inline-flex', 'items-center', 'text-base', 'font-semibold', 'text-gray-900', 'dark:text-white');

  const buttonReset = document.createElement('button');
  buttonReset.classList.add('text-indigo-700', 'hover:text-indigo-900', 'hover:underline', 'text-center', 'px-4', 'py-2', 'rounded-full', 'font-medium');
  buttonReset.textContent = 'Reset';
  buttonReset.addEventListener('click', async function()  {
    const { deckId, cardId } = await findBoth(question);
    resetCardEasyValue(deckId, cardId);
    removeCompletedItemByQuestion(question);
    trackProgressFC(currentDeck);
  })
  divFlex.appendChild(pQuestion);
  divFlex.appendChild(pAnswer);
  divButton.appendChild(buttonReset);
  div.appendChild(divFlex);
  div.appendChild(divButton);
  li.appendChild(div);

  completedContainer.querySelector('ul').appendChild(li);

  const liMC = document.createElement('li');
  liMC.classList.add('py-3', 'sm:py-4');

  const divMC = document.createElement('div');
  divMC.classList.add('flex', 'items-center', 'space-x-4');

  const divFlexMC = document.createElement('div');
  divFlexMC.classList.add('flex-1', 'min-w-0');

  const pQuestionMC = document.createElement('p');
  pQuestionMC.classList.add('text-sm', 'font-medium', 'text-gray-900', 'truncate', 'dark:text-white');
  pQuestionMC.textContent = question;

  const pAnswerMC = document.createElement('p');
  pAnswerMC.classList.add('text-sm', 'text-gray-500', 'truncate', 'dark:text-gray-400');
  pAnswerMC.textContent = answer;

  const divButtonMC = document.createElement('div');
  divButtonMC.classList.add('inline-flex', 'items-center', 'text-base', 'font-semibold', 'text-gray-900', 'dark:text-white');

  const buttonResetMC = document.createElement('button');
  buttonResetMC.classList.add('text-indigo-700', 'hover:text-indigo-900', 'hover:underline', 'text-center', 'px-4', 'py-2', 'rounded-full', 'font-medium');
  buttonResetMC.textContent = 'Reset';
  buttonResetMC.addEventListener('click', async function()  {
    const { deckId, cardId } = await findBoth(question);
    resetCardEasyValue(deckId, cardId);
    removeCompletedItemByQuestion(question);
    trackProgressMC(currentDeck);

  })
  divFlexMC.appendChild(pQuestionMC);
  divFlexMC.appendChild(pAnswerMC);
  divButtonMC.appendChild(buttonResetMC);
  divMC.appendChild(divFlexMC);
  divMC.appendChild(divButtonMC);
  liMC.appendChild(divMC);

  console.log(liMC);
  completedContainerMC.querySelector('ul').appendChild(liMC);
  

  const liTF = document.createElement('li');
  liTF.classList.add('py-3', 'sm:py-4');

  const divTF = document.createElement('div');
  divTF.classList.add('flex', 'items-center', 'space-x-4');

  const divFlexTF = document.createElement('div');
  divFlexTF.classList.add('flex-1', 'min-w-0');

  const pQuestionTF = document.createElement('p');
  pQuestionTF.classList.add('text-sm', 'font-medium', 'text-gray-900', 'truncate', 'dark:text-white');
  pQuestionTF.textContent = question;

  const pAnswerTF = document.createElement('p');
  pAnswerTF.classList.add('text-sm', 'text-gray-500', 'truncate', 'dark:text-gray-400');
  pAnswerTF.textContent = answer;

  const divButtonTF = document.createElement('div');
  divButtonTF.classList.add('inline-flex', 'items-center', 'text-base', 'font-semibold', 'text-gray-900', 'dark:text-white');

  const buttonResetTF = document.createElement('button');
  buttonResetTF.classList.add('text-indigo-700', 'hover:text-indigo-900', 'hover:underline', 'text-center', 'px-4', 'py-2', 'rounded-full', 'font-medium');
  buttonResetTF.textContent = 'Reset';
  buttonResetTF.addEventListener('click', async function()  {
    const { deckId, cardId } = await findBoth(question);
    resetCardEasyValue(deckId, cardId);
    removeCompletedItemByQuestion(question);
    trackProgressTF(currentDeck);

  })
  divFlexTF.appendChild(pQuestionTF);
  divFlexTF.appendChild(pAnswerTF);
  divButtonTF.appendChild(buttonResetTF);
  divTF.appendChild(divFlexTF);
  divTF.appendChild(divButtonTF);
  liTF.appendChild(divTF);

  completedContainerTF.querySelector('ul').appendChild(liTF);
}


async function resetCardEasyValue(currentDeck, cardId) {
	console.log("resetting easy value of deck", currentDeck, "card", cardId);
	try {
		const response = await fetch(` /reset-easy/${currentDeck}/${cardId}`, {
			method: 'PATCH',
			credentials: 'include',
		});

		if (!response.ok) {
			console.error('Failed to reset card easy value');
		}
	} catch (error) {
		console.error(error);
	}
}

async function resetDeck(deckid) {
	console.log("resetting easy value of deck", deckid);
	try {
		const response = await fetch(`/reset-deck/${deckId}`, {
			method: 'PATCH',
			credentials: 'include',
		});

		if (!response.ok) {
			console.error('Failed to reset deck easy values');
		}
	} catch (error) {
		console.error(error);
	}
}

async function checkDeckEasyValues(deckId) {
	try {
		const response = await fetch(`/deck/${deckId}/easy-values`, {
			credentials: 'include',
		});
		if (!response.ok) {
			console.error('Failed to fetch easy values');
			return;
		}

		const easyValues = await response.json();
		easyValues.forEach((card, index) => {
			if (card.easy >= 3) {
				moveToCompleted(card.index);
			}
		});
	} catch (error) {
		console.error(error);
	}
}
async function getEasyValues(deckId) {
	try {
		const response = await fetch(`/deck/${deckId}/easy-values`, {
			credentials: 'include',
		});
		if (!response.ok) {
			console.error('Failed to fetch easy values');
			return;
		}

		const easyValues = await response.json();
		return easyValues;
	} catch (error) {
		console.error(error);
	}
}

async function getMasteredCards() {
	console.log("deck id:" + deckId);
	const fetchedDeck = await fetchDeck(deckId);
	console.log(fetchedDeck);
	try {
		console.log("deck length: " + fetchedDeck.deck.flashcards.length);
		for (let i = 0; i < fetchedDeck.deck.flashcards.length; i++) {
			const card = fetchedDeck.deck.flashcards[i];
			const response = await fetch(`/card-easy/${deckId}/${card._id}`, {
				method: 'POST',
				credentials: 'include',
			});

			if (response.ok) {
				const {
					easy
				} = await response.json();
				if (easy >= 3) {
					masteredCards++;
				}
			} else {
				console.error('Failed to fetch card easy value');
			}
		}
	} catch (error) {
		console.error(error);
	}
}

function hideForm() {
  const formParts = document.querySelectorAll('.formPart');
  const spinner = document.getElementById('formSpinnerMC');
  for (let i=0;i<formParts.length;i++)  {
    formParts[i].classList.add('hidden');
  }
  spinner.classList.remove('hidden');
}

function hideFormRaw() {
  const formParts = document.querySelectorAll('.formPart');
  for (let i=0;i<formParts.length;i++)  {
    formParts[i].classList.add('hidden');
  }
}

function hideFormRawTF() {
  const formParts = document.querySelectorAll('.formPartTF');
  for (let i=0;i<formParts.length;i++)  {
    formParts[i].classList.add('hidden');
  }
}

function hideFormTF() {
  const formParts = document.querySelectorAll('.formPartTF');
  const spinner = document.getElementById('formSpinnerTF');
  for (let i=0;i<formParts.length;i++)  {
    formParts[i].classList.add('hidden');
  }
  spinner.classList.remove('hidden');
}

function hideFormFC() {
  const formParts = document.querySelectorAll('.formPartFC');
  const spinner = document.getElementById('formSpinnerFC');
  for (let i=0;i<formParts.length;i++)  {
    formParts[i].classList.add('hidden');
  }
  spinner.classList.remove('hidden');
}

function showFormFC() {
  const formParts = document.querySelectorAll('.formPartFC');
  const spinner = document.getElementById('formSpinnerFC');
  for (let i=0;i<formParts.length;i++)  {
    formParts[i].classList.remove('hidden');
  }
  spinner.classList.add('hidden');
}

function showForm() {
  const formParts = document.querySelectorAll('.formPart');
  const spinner = document.getElementById('formSpinnerMC');
  for (let i=0;i<formParts.length;i++)  {
    formParts[i].classList.remove('hidden');
  }
  spinner.classList.add('hidden');
}

function showFormTF() {
  const formParts = document.querySelectorAll('.formPartTF');
  const spinner = document.getElementById('formSpinnerTF');
  for (let i=0;i<formParts.length;i++)  {
    formParts[i].classList.remove('hidden');
  }
  spinner.classList.add('hidden');
}

function truncateText(text, maxLength, label) {

  return text;
}

async function findCardIndex(deckId, question) {
  try {
      // Fetch the deck
      const deck = await fetchDeck(deckId);
      
      const index = deck.deck.flashcards.findIndex(card => card.question === question);
      
      // If the card was not found, throw an error
      if (index === -1) {
          throw new Error('Card not found in deck');
      }
      
      // Return the index
      return index;
  } catch (error) {
      console.error(error);
      return -1;
  }
}

async function findCardIndexTF(deckId, question) {
  try {
      // Fetch the deck
      const deck = await fetchDeck(deckId);
      
      const index = deck.deck.flashcards.findIndex(card => card.question_tf === question);
      
      // If the card was not found, throw an error
      if (index === -1) {
          throw new Error('Card not found in deck');
      }
      
      // Return the index
      return index;
  } catch (error) {
      console.error(error);
      return -1;
  }
}

async function populateMultipleChoiceQuestion(deckId) {
  if (allEasyEnough === true) {
    hideForm();
    return;
  }
  console.log("Populating multiple choice..");
  const selectedOptions = document.querySelectorAll("input[type=radio]");
  selectedOptions.forEach((option) => option.checked = false);
  trackProgressMC(currentDeck);
  hideForm();
  try {
  const { deck, totalCount } = await fetchDeck(deckId);
  // Find the next question that has an easy value of less than 3
  let questionIndex = await getNextQuestion(deckId);
  console.log("Index: ", questionIndex);
  if (questionIndex === -1) {
  console.log("The deck has been mastered");
  hideForm();
  return;
  }
  allEasyEnough = false;

  console.log("Survived purging");
  // If there are still unanswered questions, get the question and its options
const question = deck.flashcards[questionIndex];
let { question_mc, options_mc, answer_mc } = question;

    // Remove comma at the end of question_mc
    if (question_mc.endsWith(",")) {
      question_mc = question_mc.slice(0, -1);
    }

// Populate the UI with the question and its options
const questionText = document.querySelector(
  ".w-full.mt-4.mb-5.text-xl.font-semibold.text-gray-700.text-center"
);
const optionOne = document.querySelector("#optionOne");
const optionTwo = document.querySelector("#optionTwo");
const optionThree = document.querySelector("#optionThree");
const optionFour = document.querySelector("#optionFour");
const actionButton = document.querySelector("#actionButton");
let options = null;
actionButton.textContent = "Check Answer";
actionButton.classList.remove("next");
actionButton.classList.add("submit");

questionText.textContent = question_mc;

if (options_mc) {
  options = JSON.parse(options_mc);
  // Remove comma at the end of each option
  options = options.map((option) =>
    option.endsWith(",") ? option.slice(0, -1) : option
  );
  // Shuffle the options
  options = shuffleOptions(options);
} else {
  console.log("No parsable options. Quitting function...");
  return;
}


console.log(options[0]);
console.log(options[1]);
console.log(options[2]);
console.log(options[3]);
console.log(options);

const maxLength = 75;

optionOne.querySelector('label').textContent = truncateText(options[0].substring(options[0].indexOf(")") + 2), maxLength, optionOne.querySelector('label'));
optionTwo.querySelector('label').textContent = truncateText(options[1].substring(options[1].indexOf(")") + 2), maxLength, optionTwo.querySelector('label'));
optionThree.querySelector('label').textContent = truncateText(options[2].substring(options[2].indexOf(")") + 2), maxLength, optionThree.querySelector('label'));
optionFour.querySelector('label').textContent = truncateText(options[3].substring(options[3].indexOf(")") + 2), maxLength, optionFour.querySelector('label'));

// Remove the answer class from all options
optionOne.classList.remove("answer");
optionTwo.classList.remove("answer");
optionThree.classList.remove("answer");
optionFour.classList.remove("answer");

    // Remove comma at the end of answer_mc
    if (answer_mc.endsWith(",")) {
      answer_mc = answer_mc.slice(0, -1);
    }

// Find the option with the same text as the answer and add the answer class
const answerText = answer_mc.substring(3);
if (optionOne.querySelector('label').textContent === answerText) {
  optionOne.classList.add("answer");
} else if (optionTwo.querySelector('label').textContent === answerText) {
  optionTwo.classList.add("answer");
} else if (optionThree.querySelector('label').textContent === answerText) {
  optionThree.classList.add("answer");
} else if (optionFour.querySelector('label').textContent === answerText) {
  optionFour.classList.add("answer");
} else {
  console.log(`Invalid answer value: ${answerText}`);
}
console.log("Showing form...");
showForm();
} catch (error) {
  console.error(error);
  }
  }

  async function populateTrueFalseQuestion(deckId) {
    console.trace();
    console.log("Populating true false..");
    const selectedOptions = document.querySelectorAll("input[type=radio]");
    selectedOptions.forEach((option) => option.checked = false);
    trackProgressTF(currentDeck);
    hideFormTF();
    try {
    const { deck, totalCount } = await fetchDeck(deckId);
    // Find the next question that has an easy value of less than 3
    let questionIndex = await getNextQuestion(deckId);
    console.log("Index: ", questionIndex);
    if (questionIndex === -1) {
    console.log("The deck has been mastered");
    hideFormTF();
    return;
    }
    allEasyEnough = false;

    console.log("Survived purging");
    // If there are still unanswered questions, get the question and its options
  const question = deck.flashcards[questionIndex];
  let { question_tf, answer_tf } = question;
  
      // Remove comma at the end of question_mc
      if (question_tf.endsWith(",")) {
        question_tf = question_tf.slice(0, -1);
      }
  
  // Populate the UI with the question and its options
  const questionText = document.getElementById("TFquestion");
  const optionTrue = document.querySelector("#optionTrue");
  const optionFalse = document.querySelector("#optionFalse");
  const actionButton = document.getElementById("actionButtonTF");
  
  actionButton.textContent = "Check Answer";
  actionButton.classList.remove("next");
  actionButton.classList.add("submit");
  questionText.textContent = question_tf;
  
        // Remove comma at the end of answer_tf
        if (answer_tf.endsWith(",")) {
          answer_tf = answer_tf.slice(0, -1);
        }
  
    // Clear the answer
    let answer = null;
    optionTrue.classList.remove("answer");
    optionFalse.classList.remove("answer");

    const answerText = answer_tf;
    if (answerText === "True") {
      answer = "True";
      optionTrue.classList.add("answer");
    }
    else if (answerText === "False")  {
      answer = "False";
      optionFalse.classList.add("answer");
    }
  console.log("answer_tf: " + answer_tf);
  console.log("answer: " + answer);
  
    showFormTF();
  } catch (error) {
    console.error(error);
    }
    }




async function checkIfMultipleChoiceExists(deckId) {
	try {
		const {
			deck
		} = await fetchDeck(deckId);
		const cards = deck.flashcards;
		for (let card of cards) {
			if (!card.question_mc || !card.options_mc || !card.answer_mc) {
				return false; // return false as soon as a card without any of the required properties is found
			}
		}
		return true; // if all cards have all the required properties, return true
	} catch (error) {
		console.error(error);
		return false; // if an error occurs, return false
	}
}

async function checkIfTrueFalseExists(deckId) {
	try {
		const {
			deck
		} = await fetchDeck(deckId);
		const cards = deck.flashcards;
		for (let card of cards) {
			if (!card.question_tf || !card.answer_tf) {
				return false; // return false as soon as a card without any of the required properties is found
			}
		}
		return true; // if all cards have all the required properties, return true
	} catch (error) {
		console.error(error);
		return false; // if an error occurs, return false
	}
}

const modeSelectorFC = document.getElementById("modeFC");
const modeSelectorMC = document.getElementById("modeMC");
const modeSelectorTF = document.getElementById("modeTF");

modeSelectorFC.addEventListener("change", (event) => {
  const deckSelector = document.getElementById('deckFlashcards');
  deckSelector.value = currentDeck;
	handleModeChange(event.target.value);
	trackProgressFC(currentDeck);
});

modeSelectorMC.addEventListener("change", (event) => {
  const deckSelector = document.getElementById('deckMultipleChoice');
  deckSelector.value = currentDeck;
	handleModeChange(event.target.value);
	trackProgressMC(currentDeck);
});

modeSelectorTF.addEventListener("change", (event) => {
  const deckSelector = document.getElementById('deckTrueFalse');
  deckSelector.value = currentDeck;
	handleModeChange(event.target.value);
	trackProgressTF(currentDeck);
});

async function handleModeChange(selectedValue) {
	const multiplechoiceSec = document.getElementById("multiplechoice");
	const flashcardSec = document.getElementById("flashcards");
  const trueFalseSec = document.getElementById("truefalse");
	if (selectedValue === "Flashcards") {
    const deckSelector = document.getElementById('deckFlashcards');
    deckSelector.value = currentDeck;
		studyType = "flashcards";
		flashcardSec.classList.remove('hidden');
		multiplechoiceSec.classList.add('hidden');
    trueFalseSec.classList.add('hidden');
		modeSelectorMC.value = "Flashcards";
		modeSelectorFC.value = "Flashcards";
    modeSelectorTF.value = "Flashcards";
		console.log(studyType);
		let deck = await fetchDeck(currentDeck);
    if (deck.beenStudied === false) {
      document.getElementById('studyOptionScreen').classList.remove('hidden');
    }
		displayFlashcards(deck.deck.flashcards);
	} else if (selectedValue === "True or False") {
    const deckSelector = document.getElementById('deckTrueFalse');
    deckSelector.value = currentDeck;
    let deck = await fetchDeck(currentDeck);
    if (deck.beenStudied === false) {
      document.getElementById('studyOptionScreen').classList.remove('hidden');
    }
		studyType = "truefalse";
		console.log(studyType);
		flashcardSec.classList.add('hidden');
		multiplechoiceSec.classList.add('hidden');
    trueFalseSec.classList.remove('hidden');
		modeSelectorMC.value = "True or False";
		modeSelectorFC.value = "True or False";
    modeSelectorTF.value = "True or False";
	} else if (selectedValue === "Multiple Choice") {
    const deckSelector = document.getElementById('deckMultipleChoice');
    deckSelector.value = currentDeck;
    let deck = await fetchDeck(currentDeck);
    if (deck.beenStudied === false) {
      document.getElementById('studyOptionScreen').classList.remove('hidden');
    }
		studyType = "multiplechoice";
		console.log(studyType);
		flashcardSec.classList.add('hidden');
    trueFalseSec.classList.add('hidden');
		multiplechoiceSec.classList.remove('hidden');
		modeSelectorMC.value = "Multiple Choice";
		modeSelectorFC.value = "Multiple Choice";
    modeSelectorTF.value = "Multiple Choice";
		const isMC = await checkIfMultipleChoiceExists(deckId);
      if (isMC === false && generationInProgress === false) {
      generationInProgress = true;
      await generateMultipleChoiceQuestions(deckId);
      }
      generationInProgress = false;
      populateMultipleChoiceQuestion(deckId, 0);
      trackProgressMC(currentDeck);
    }
  handleDeckChange(currentDeck);
}

async function getDeckMode() {
  try {
    const response = await fetch(`/deck-mode/${currentDeck}`);
    if (!response.ok) {
      throw new Error('Error fetching study mode');
    }
    const mode = await response.text();
    return mode;
  } catch (error) {
    console.error(error);
    // Handle error appropriately
    return null;
  }
}

async function checkPremium() {
  const plan = await getPlan();
  if (plan === "free")  {
    const premiumButtons = document.getElementsByClassName('premium');
    console.log(premiumButtons);
    for (var i=0; i < premiumButtons.length;i++) {
   premiumButtons[i].disabled = true;
   premiumButtons[i].classList.add('opacity-100');
   premiumButtons[i].style.cursor = 'not-allowed';
   premiumButtons[i].title = "Upgrade to Student plan to access multiple choice and true or false questions.";
  }
  const premiumicon = document.getElementById('premium-label');
  premiumicon.classList.remove('hidden');
  premiumicon.classList.add('cursor-pointer');
} else {
  const premiumicon = document.getElementById('premium-label');
  premiumicon.classList.add('hidden');
  premiumicon.classList.add('cursor-pointer');
  const premiumtext = document.getElementById('premium-text');
  premiumtext.classList.add('hidden');
  premiumtext.classList.add('cursor-pointer');
}
if (plan != "free")  {
  document.getElementById('freetrial').classList.add('hidden');
} 
}

async function getPlan()  {
  try {
    const response = await fetch('/plan');
    const { plan } = await response.json();
    return plan;
  } catch (error) {
    console.log(error);
  }
} 

function showAlert(message)  {
  const warningAlert = document.createElement("div");
warningAlert.classList.add("flex", "p-4", "m-12", "text-sm", "text-green-800", "rounded-lg", "bg-green-100", "dark:bg-gray-800", "dark:text-yellow-300", "fixed", "bottom-0", "border", "border-green-200", "right-0", "opacity-0", "transition", "duration-300", "slide-up");
warningAlert.setAttribute("role", "alert");
warningAlert.innerHTML = `
<svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
</svg>
<span class="font-medium">${message}</span>
`;
document.body.appendChild(warningAlert);
// Trigger a reflow to enable transition
warningAlert.offsetHeight;
warningAlert.classList.add("opacity-100");

setTimeout(() => {
warningAlert.style.opacity = '0';
setTimeout(() => {
warningAlert.remove();
}, 500); // Wait for transition to finish before removing element
}, 3000);

return;
}

fetchDecks();
showLoadingScreen();
checkPremium();


async function checkVerified()  {
  try {
    const response = await fetch('/check-verified');
    console.log(response);  
    if (response.status === 200)  {
      return;
    } else {
      document.getElementById('notVerifiedBanner').classList.remove('hidden');
    }
  } catch (error) {
    console.log(error);
  }
} 

// Get the resend email button element by its ID
const resendEmailButton = document.getElementById('resendEmail');

// Add a click event listener to the button
resendEmailButton.addEventListener('click', async () => {
  try {
    // Fetch the user's email from the backend route
    const emailResponse = await fetch('/user-email');
    if (!emailResponse.ok) {
      throw new Error('Failed to retrieve user email');
    }
    const emailData = await emailResponse.json();
    const userEmail = emailData.email;

    // Send a fetch request to the backend route to resend the verification email
    const response = await fetch('/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }), // Use the retrieved user email
    });

    if (!response.ok) {
      throw new Error('Failed to resend verification email');
    }
    document.getElementById('resendEmail').textContent = 'Email sent';
    const data = await response.json();
    console.log(data.message); // Display the success message in the console or handle it as needed
  } catch (error) {
    console.error(error);
    // Handle the error as needed (display an error message, show a notification, etc.)
  }
});
checkVerified();
function toggleDropdown() {
  var subButtons = document.getElementById("subButtons");
  var dropdownIcon = document.getElementById("dropdown-icon");

  subButtons.classList.toggle("show");
  dropdownIcon.style.transform = subButtons.classList.contains("show") ? "rotate(-90deg)" : "rotate(90deg)";
}