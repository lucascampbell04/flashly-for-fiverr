let currentTab = 'Flashcards';

async function fetchDecksRaw() {
    try {
      const response = await fetch('/user-decks', {
        credentials: 'include',
      });
  
      if (response.ok) {
        const decks = await response.json();
        const deckContainer = document.getElementById('deck-container');
  
        decks.forEach(deck => {
          const deckCard = createDeckCard(deck);
          deckContainer.appendChild(deckCard);
        });
      } else {
        console.error('Failed to fetch decks');
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  async function createDeckCard(deck) {
  console.log(deck);
  if (deck === 0) {
    const deckContainer = document.getElementById('deck-container');
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="text-center bg-white rounded-2xl shadow-lg border-r-4 border-b-2 border-indigo-700 py-8 px-4 sm:py-16 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        <h1 class="text-2xl font-bold text-gray-800 sm:text-4xl dark:text-white">Oh no!</h1>
        <p class="mt-3 text-gray-600 dark:text-gray-400">You don't have any decks yet.</p>
        <p class="text-gray-600 dark:text-gray-400">Click on the 'Generate' tab to make your first.</p>
        <div class="mt-6">
          <a class="w-full inline-flex justify-center items-center text-center bg-indigo-700 hover:bg-indigo-800 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800" href="generate.html">
            Start generating
          </a>
        </div>
      </div>`;
    deckContainer.appendChild(div);
  }

  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'max-w-fitcontent  p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700';

  const linkWrapper = document.createElement('a');
  linkWrapper.href = '/study';
  linkWrapper.className = 'flex items-center justify-center'; // Added justify-center class
  cardWrapper.appendChild(linkWrapper);

  const title = document.createElement('h5');
  title.className = 'mr-4 text-lg center font-semibold text-gray-900 dark:text-white';
  title.textContent = deck.name;
  linkWrapper.appendChild(title);

  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'flex flex-wrap items-center justify-center mt-4'; // Added justify-center class
  cardWrapper.appendChild(buttonWrapper);

  const buttonNames = ['Manage', 'Add card', 'Rename', 'Export', 'Delete'];
  const buttonClasses = ['bg-indigo-700', 'bg-indigo-700', 'bg-indigo-700', 'bg-indigo-700', 'bg-indigo-700', 'border-l'];

  for (let i = 0; i < buttonNames.length; i++) {
    const name = buttonNames[i];
    const buttonLink = document.createElement('a');
    buttonLink.href = '#';
    buttonLink.className = 'inline-flex items-center whitespace-nowrap px-3 py-2 mt-2 mr-2 text-sm font-medium text-center text-white rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:hover:bg-blue-700 dark:focus:ring-blue-800';
    buttonLink.textContent = name;
    buttonLink.classList.add(buttonClasses[i]);
    buttonWrapper.appendChild(buttonLink);

    if (name === 'Manage') {
      buttonLink.addEventListener('click', () => {
        showFlashcardsModal(deck.name, deck.flashcards, deck._id);
      });
    } else if (name === 'Delete') {
      const planResponse = await fetch('/plan');
      const { plan } = await planResponse.json();
      if (plan === 'free') {
        buttonLink.disabled = true;
        buttonLink.style.opacity = 0.5;
        buttonLink.title = 'This feature is not available in the Free plan';
        buttonLink.style.cursor = 'not-allowed';
      } else {
        buttonLink.addEventListener('click', () => {
          removeDeck(deck._id);
        });
      }
    } else if (name === 'Add card') {
      buttonLink.addEventListener('click', () => {
        setupAddCardButton(deck._id);
      });
    } else if (name === 'Rename') {
      buttonLink.addEventListener('click', () => {
        openRenameDeckModal(deck.name, deck._id);
      });
    } else if (name === 'Export') {
      const planResponse = await fetch('/plan');
      const { plan } = await planResponse.json();
      if (plan === 'free') {
        buttonLink.disabled = true;
        buttonLink.style.opacity = 0.5;
        buttonLink.title = 'This feature is not available in the Free plan';
        buttonLink.style.cursor = 'not-allowed';
      } else {
        buttonLink.addEventListener('click', () => {
          exportDeckToQuizlet(deck._id);
        });
        buttonLink.title = 'Export to Quizlet';
      }
    }
  }

  return cardWrapper;
}

  
  async function exportDeckToQuizlet(currentDeck) {
    try {
      const response = await fetch(`/deck/${currentDeck}`);
      if (!response.ok) {
        throw new Error('Error fetching deck data');
      }
      const deck = await response.json();
  
      // Process the deck data and generate Quizlet-compatible output
      const flashcards = deck.flashcards.map((flashcard) => {
        const { question, answer } = flashcard;
        return `${question}\t${answer}`;
      });
      const quizletContent = flashcards.join('\n');
  
      // Create a download link for the Quizlet file
      const element = document.createElement('a');
      const file = new Blob([quizletContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${deck.name}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    }
  }
  

    function showLoadingScreen() {
      const loadingScreen = document.getElementById('loading-screen');
      // Unhide the loading screen
      loadingScreen.classList.remove('hidden');
    
      // Hide the loading screen after 1 second
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 1000);
    }

    function showFlashcardsModal(deckName, flashcards, deckId) {
      const oldContainer = document.getElementById('tabContainer');
      if (oldContainer) {
        oldContainer.remove();
      }
      console.log('showFlashcardsModal called with', deckName, flashcards, deckId);
      const currentDeck = { deckName, flashcards, _id: deckId }; // Add this line
      let currentTab = "";
      const flashcardList = document.querySelector('#modal ul');
      console.log('flashcardList element:', flashcardList);
      flashcardList.id = 'flashcard-modal';
      flashcardList.innerHTML = '';

// Create tab container
const tabContainer = document.createElement('div');
tabContainer.className = "border-b border-gray-200 dark:border-gray-700 mb-4 w-full flex justify-center";
tabContainer.id = 'tabContainer';
flashcardList.parentElement.insertBefore(tabContainer, flashcardList);

// Create tab list
const tabList = document.createElement('ul');
tabList.className = "flex flex-wrap -mb-px";
tabContainer.appendChild(tabList);



// Tab names
const tabNames = ['Flashcards', 'Multiple Choice', 'True or False'];

// Create and append the tabs
tabNames.forEach((name, index) => {
  const tabItem = document.createElement('li');
  tabItem.className = 'mr-2';

  const tabButton = document.createElement('button');
  tabButton.className = 'inline-block text-indigo-700 font-medium hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-4 active:border-b-6 dark:text-gray-400 dark:hover:text-gray-300';
  tabButton.textContent = name;

  // Check if this tab is currently selected
  if (index === 0) {
    // Make the first tab bold with a purple underline
    tabButton.classList.add('font-bold', 'border-indigo-700', 'dark:border-purple-400', 'active');
  }

  // Add click event listener to each tab button
  tabButton.addEventListener('click', () => {
    // Remove bold and underline from all tabs
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('font-bold', 'border-indigo-700', 'dark:border-purple-400');
    });

    // Add bold and underline to the clicked tab
    tabButton.classList.add('font-bold', 'border-indigo-700', 'dark:border-purple-400', 'active');
  });

  tabButton.classList.add('tab-button');
  tabItem.appendChild(tabButton);
  tabList.appendChild(tabItem);
});

createQuestionsFC();
currentTab = document.querySelector('.active').textContent;
console.log(currentTab);
// Define activeTabButton variable
// Add click event listener to each tab button
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', function() {
    // Set activeTabButton to the clicked tab button
    currentTab = this.textContent;
    if (currentTab === "Flashcards") {
      createQuestionsFC();
    }
    else if (currentTab === "True or False") {
      createQuestionsTF();
    }
    else if (currentTab === "Multiple Choice") {
      createQuestionsMC();
    }
  });
});





        function createQuestionsFC()  {
        document.getElementById('flashcard-modal').innerHTML = "";
        const hasNonEmptyQuestions = flashcards.some(flashcard => flashcard.question.trim() !== '');

        if (!hasNonEmptyQuestions) {
          const section = document.createElement('section');
          section.innerHTML = ` <div class="relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-24 max-w-7xl">
          <div class="grid grid-cols-1">
            <div class="w-full max-w-lg mx-auto bg-white border-l-0 border-t-0 border border-b-2 border-r-4 border-indigo-700 bg-opacity-10 shadow-xl rounded-xl">
              <div class="p-6 lg:text-center">
                <h4 class="text-2xl font-semibold leading-none text-center text-indigo-700 lg:text-3xl">Hold up!</h4>
                <p class="mt-3 text-base text-center leading-relaxed text-gray-900">You haven't generated any questions yet. Visit the Generate page to get started!</p>
                <div class="mt-6">
                  <a href="generate.html" class="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-indigo-700 rounded-xl hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Go to Generate</a>
                </div>
              </div>
            </div>
          </div>
        </div>`;
        document.getElementById('flashcard-modal').appendChild(section);
        } else {
        flashcards.forEach(flashcard => {
        console.log(flashcard);

        const li = document.createElement('li');
        li.className = 'relative py-4 flashcard-item';
    
        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex flex-wrap justify-between';
        li.appendChild(contentDiv);

        const questionDiv = document.createElement('div');
        questionDiv.className = 'text-sm px-3 font-semibold w-1/2';
        questionDiv.textContent = flashcard.question;
        contentDiv.appendChild(questionDiv);

        const answerDiv = document.createElement('div');
        answerDiv.className = 'text-sm px-3 w-1/2 text-right';
        answerDiv.textContent = flashcard.answer;
        contentDiv.appendChild(answerDiv);
    
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-0 hidden z-50';
        li.appendChild(buttonsContainer);
    
        const modifyButton = document.createElement('button');
        modifyButton.className = 'focus:outline-none text-white bg-indigo-700 hover:text-white hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-900';
        modifyButton.textContent = 'Modify';
        buttonsContainer.appendChild(modifyButton);
    
        const removeButton = document.createElement('button');
        removeButton.className = 'focus:outline-none text-white bg-red-700 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-purple-900';
        removeButton.textContent = 'Remove';
        buttonsContainer.appendChild(removeButton);
        
        removeButton.addEventListener('click', () => {
          removeCard(deckId, flashcard._id);
        });
        li.addEventListener('mouseenter', () => {
          buttonsContainer.classList.remove('hidden');
        });
    
        li.addEventListener('mouseleave', () => {
          buttonsContainer.classList.add('hidden');
        });
    
        // Add an event listener to the Modify button
        modifyButton.addEventListener('click', () => {
          // Close the current modal
          document.getElementById('modal').classList.add('hidden');
    
          // Create a new modal with the same styles
          const newModal = document.createElement('div');
          newModal.className = 'fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center';
          newModal.innerHTML = `   
          <div class="relative w-full max-w-xl max-h-full">
              <!-- Modal content -->
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button type="button" id="closeModalButton" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                      <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                      <span class="sr-only">Close modal</span>
                  </button>
                  <div class="px-6 py-6 lg:px-8">
                      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit flashcard</h3>
                      <form class="space-y-6" action="#" id="modifyCardForm">
                          <div>
                              <label for="question" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question</label>
                              <input type="text" name="question" id="question" value='${flashcard.question}' class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="When was..." required>
                          </div>

                          <div>
                              <label for="question" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Answer</label>
                              <input type="text" name="answer" id="answer" value='${flashcard.answer}' placeholder="Was born in..." class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                          </div>
                          <div class="flex justify-between">
                          <button type="submit" class="w-full text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save changes</button>
                      </form>
              </div>
          </div>
      </div>`;
      
      
        // Append the new modal to the body
        document.body.appendChild(newModal);
      
        // Add event listeners to the Close and Save Changes buttons
        const closeButton = newModal.querySelector('#closeModalButton');
        closeButton.addEventListener('click', () => {
          newModal.remove();
          document.getElementById('modal').classList.remove('hidden');
        });
      
        const modifyCardForm = newModal.querySelector('#modifyCardForm');
        modifyCardForm.addEventListener('submit', event => {
          event.preventDefault();
      
          // Get the updated question and answer values from the form
          const questionInput = modifyCardForm.querySelector('input[name="question"]');
          const answerInput = modifyCardForm.querySelector('input[name="answer"]');
          const updatedQuestion = questionInput.value;
          const updatedAnswer = answerInput.value;
      
          // Call the modifyCard function with the appropriate parameters
          modifyCard(currentDeck._id, flashcard._id, updatedQuestion, updatedAnswer);
      
          // Update the flashcard object with the new values
          flashcard.question = updatedQuestion;
          flashcard.answer = updatedAnswer;
      
          // Update the question and answer fields in the original modal
          questionDiv.textContent = updatedQuestion;
          answerDiv.textContent = updatedAnswer;
      
          // Remove the new modal from the DOM
          newModal.remove();
      
          // Show the original modal again
          document.getElementById('modal').classList.remove('hidden');
        });
      });
      
      flashcardList.appendChild(li);
    
});
        }
        }

        function createQuestionsTF()  {
          document.getElementById('flashcard-modal').innerHTML = "";

          const hasNonEmptyQuestions = flashcards.some(flashcard => flashcard.question_tf.trim() !== '');

          if (!hasNonEmptyQuestions) {
            const section = document.createElement('section');
            section.innerHTML = ` <div class="relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-24 max-w-7xl">
            <div class="grid grid-cols-1">
              <div class="w-full max-w-lg mx-auto bg-white border-l-0 border-t-0 border border-b-2 border-r-4 border-indigo-700 bg-opacity-10 shadow-xl rounded-xl">
                <div class="p-6 lg:text-center">
                  <h4 class="text-2xl font-semibold leading-none text-center text-indigo-700 lg:text-3xl">Hold up!</h4>
                  <p class="mt-3 text-base text-center leading-relaxed text-gray-900">You haven't generated any true or false questions yet. Visit the Study page and select 'True or False' to generate some!</p>
                  <div class="mt-6">
                    <a href="study.html" class="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-indigo-700 rounded-xl hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Go to Study</a>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
          document.getElementById('flashcard-modal').appendChild(section);
          } else {
          flashcards.forEach(flashcard => { 
          console.log(flashcard);
          
          const li = document.createElement('li');
          li.className = 'relative py-4 flashcard-item';
      
          const contentDiv = document.createElement('div');
          contentDiv.className = 'flex flex-wrap justify-between';
          li.appendChild(contentDiv);

          const questionDivTF = document.createElement('div');
          questionDivTF.className = 'text-sm px-3 font-semibold w-1/2';
          questionDivTF.textContent = flashcard.question_tf;
          contentDiv.appendChild(questionDivTF);

          const answerDivTF = document.createElement('div');
          answerDivTF.className = 'text-sm px-3 w-1/2 text-right';
          answerDivTF.textContent = flashcard.answer_tf;
          contentDiv.appendChild(answerDivTF);

          const buttonsContainer = document.createElement('div');
          buttonsContainer.className = 'buttons-container absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-0 hidden z-50';
          li.appendChild(buttonsContainer);
      
          const modifyButton = document.createElement('button');
          modifyButton.className = 'focus:outline-none text-white bg-indigo-700 hover:text-white hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-900';
          modifyButton.textContent = 'Modify';
          buttonsContainer.appendChild(modifyButton);
      
          const removeButton = document.createElement('button');
          removeButton.className = 'focus:outline-none text-white bg-red-700 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-purple-900';
          removeButton.textContent = 'Remove';
          buttonsContainer.appendChild(removeButton);
          
          removeButton.addEventListener('click', () => {
            removeCard(deckId, flashcard._id);
          });
          li.addEventListener('mouseenter', () => {
            buttonsContainer.classList.remove('hidden');
          });
      
          li.addEventListener('mouseleave', () => {
            buttonsContainer.classList.add('hidden');
          });
      
          // Add an event listener to the Modify button
          modifyButton.addEventListener('click', () => {
            // Close the current modal
            document.getElementById('modal').classList.add('hidden');
      
            // Create a new modal with the same styles
            const newModal = document.createElement('div');
            newModal.className = 'fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center';
            newModal.innerHTML = `   
            <div class="relative w-full max-w-xl max-h-full">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" id="closeModalButton" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                    <div class="px-6 py-6 lg:px-8">
                        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit flashcard</h3>
                        <form class="space-y-6" action="#" id="modifyCardForm">
                            <div>
                                <label for="question" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">True or false:</label>
                                <input type="text" name="question" id="question" value='${flashcard.question_tf}' class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="When was..." required>
                            </div>

                            <div>
                                <label for="question" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Answer</label>
                                <input type="text" name="answer" id="answer" value='${flashcard.answer_tf}' placeholder="Was born in..." class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                            </div>
                            <div class="flex justify-between">
                            <button type="submit" class="w-full text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save changes</button>
                        </form>
                </div>
            </div>
        </div>`;
        
        
          // Append the new modal to the body
          document.body.appendChild(newModal);
        
          // Add event listeners to the Close and Save Changes buttons
          const closeButton = newModal.querySelector('#closeModalButton');
          closeButton.addEventListener('click', () => {
            newModal.remove();
            document.getElementById('modal').classList.remove('hidden');
          });
        
          const modifyCardForm = newModal.querySelector('#modifyCardForm');
          modifyCardForm.addEventListener('submit', event => {
            event.preventDefault();
        
            // Get the updated question and answer values from the form
            const questionInput = modifyCardForm.querySelector('input[name="question"]');
            const answerInput = modifyCardForm.querySelector('input[name="answer"]');
            const updatedQuestion = questionInput.value;
            const updatedAnswer = answerInput.value;
        
            // Call the modifyCard function with the appropriate parameters
            modifyCardTF(currentDeck._id, flashcard._id, updatedQuestion, updatedAnswer);
        
            // Update the flashcard object with the new values
            flashcard.question_tf = updatedQuestion;
            flashcard.answer_tf = updatedAnswer;
        
            // Update the question and answer fields in the original modal
            questionDivTF.textContent = updatedQuestion;
            answerDivTF.textContent = updatedAnswer;
        
            // Remove the new modal from the DOM
            newModal.remove();
        
            // Show the original modal again
            document.getElementById('modal').classList.remove('hidden');
          });
        });
      
        flashcardList.appendChild(li);
      
  });
}
          }

          function createQuestionsMC()  {
            document.getElementById('flashcard-modal').innerHTML = "";
            const hasNonEmptyQuestions = flashcards.some(flashcard => flashcard.question_mc.trim() !== '');

            if (!hasNonEmptyQuestions) {
              const section = document.createElement('section');
              section.innerHTML = ` <div class="relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-24 max-w-7xl">
              <div class="grid grid-cols-1">
                <div class="w-full max-w-lg mx-auto bg-white border-l-0 border-t-0 border border-b-2 border-r-4 border-indigo-700 bg-opacity-10 shadow-xl rounded-xl">
                  <div class="p-6 lg:text-center">
                    <h4 class="text-2xl font-semibold leading-none text-center text-indigo-700 lg:text-3xl">Hold up!</h4>
                    <p class="mt-3 text-base text-center leading-relaxed text-gray-900">You haven't generated any multiple choice questions yet. Visit the Study page and select 'Multiple Choice' to generate some!</p>
                    <div class="mt-6">
                      <a href="study.html" class="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-indigo-700 rounded-xl hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Go to Study</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
            document.getElementById('flashcard-modal').appendChild(section);
            } else {
            flashcards.forEach(flashcard => {
            console.log(flashcard);
    
            const li = document.createElement('li');
            li.className = 'relative py-4 flashcard-item';
        
            const contentDiv = document.createElement('div');
            contentDiv.className = 'flex flex-wrap justify-between';
            li.appendChild(contentDiv);
  
            const questionDivMC = document.createElement('div');
            questionDivMC.className = 'text-sm px-3 font-semibold w-1/3 text-left';
            questionDivMC.textContent = flashcard.question_mc;
            contentDiv.appendChild(questionDivMC);
  
            const input = flashcard.options_mc;
            const arr = JSON.parse(input);
            const str = arr.join('\n').replace(/,/g, '');
            const pairs = str.split(/([ABCD]\)\s+)/).filter(Boolean).reduce((acc, cur, idx) => {
              if (idx % 2 === 0) {
                acc.push(cur);
              } else {
                acc[acc.length - 1] += cur;
              }
              return acc;
            }, []);
            
            const array = pairs.map((str) => (str.trim() + ' '));
            const string = array.join('');
            console.log(array);
            const optionsDivMC = document.createElement('div');
            optionsDivMC.className = 'text-sm px-3 w-1/3 text-center';
            optionsDivMC.textContent = str;
            contentDiv.appendChild(optionsDivMC);

            const answerDivMC = document.createElement('div');
            answerDivMC.className = 'text-sm px-3 w-1/3 text-right';
            answerDivMC.textContent = flashcard.answer_mc;
            contentDiv.appendChild(answerDivMC);
        
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons-container absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-0 hidden z-50';
            li.appendChild(buttonsContainer);
        
            const modifyButton = document.createElement('button');
            modifyButton.className = 'focus:outline-none text-white bg-indigo-700 hover:text-white hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-900';
            modifyButton.textContent = 'Modify';
            buttonsContainer.appendChild(modifyButton);
        
            const removeButton = document.createElement('button');
            removeButton.className = 'focus:outline-none text-white bg-red-700 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-purple-900';
            removeButton.textContent = 'Remove';
            buttonsContainer.appendChild(removeButton);
            
            removeButton.addEventListener('click', () => {
              removeCard(deckId, flashcard._id);
            });
            li.addEventListener('mouseenter', () => {
              buttonsContainer.classList.remove('hidden');
            });
        
            li.addEventListener('mouseleave', () => {
              buttonsContainer.classList.add('hidden');
            });
        
            // Add an event listener to the Modify button
            modifyButton.addEventListener('click', () => {
              // Close the current modal
              document.getElementById('modal').classList.add('hidden');
        
              // Create a new modal with the same styles
              const newModal = document.createElement('div');
              newModal.className = 'fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center';
              newModal.innerHTML = `   
              <div class="relative w-full max-w-xl max-h-full">
                  <!-- Modal content -->
                  <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      <button type="button" id="closeModalButton" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                          <span class="sr-only">Close modal</span>
                      </button>
                      <div class="px-6 py-6 lg:px-8">
                          <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit flashcard</h3>
                          <form class="space-y-6" action="#" id="modifyCardForm">
                              <div>
                                  <label for="question" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question</label>
                                  <input type="text" name="question" id="question" value='${flashcard.question_mc}' class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="When was..." required>
                              </div>
                              <div>
                                  <label for="question" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Options</label>
                                  <input type="text" name="options" id="options" value='${string}' placeholder="Was born in..." class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                              </div>
                              <div>
                                  <label for="question" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Answer</label>
                                  <input type="text" name="answer" id="answer" value='${flashcard.answer_mc}' placeholder="Was born in..." class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                              </div>
                              <div class="flex justify-between">
                              <button type="submit" class="w-full text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save changes</button>
                          </form>
                  </div>
              </div>
          </div>`;
          
            // Append the new modal to the body
            document.body.appendChild(newModal);
          
            // Add event listeners to the Close and Save Changes buttons
            const closeButton = document.getElementById('closeModalButton');
            closeButton.addEventListener('click', () => {
              newModal.remove();
              document.getElementById('modal').classList.remove('hidden');
            });
          
            const modifyCardForm = document.getElementById('modifyCardForm');
            modifyCardForm.addEventListener('submit', event => {
              event.preventDefault();
          
              // Get the updated question and answer values from the form
              const questionInput = modifyCardForm.querySelector('input[name="question"]');
              const answerInput = modifyCardForm.querySelector('input[name="answer"]');
              const optionsInput = modifyCardForm.querySelector('input[name="options"]');
              const updatedQuestion = questionInput.value;
              const updatedAnswer = answerInput.value;
              const updatedOptions = optionsInput.value;
              const optionPairs = updatedOptions.split(/([ABCD]\)\s+)/).filter(Boolean).reduce((acc, cur, idx) => {
                if (idx % 2 === 0) {
                  acc.push(cur);
                } else {
                  acc[acc.length - 1] += cur;
                }
                return acc;
              }, []);
              
              const optionArray = optionPairs.map((str) => (str.trim() + ','));
              
              const optionString = JSON.stringify(optionArray);
              // Call the modifyCard function with the appropriate parameters
              modifyCardMC(currentDeck._id, flashcard._id, updatedQuestion, optionString, updatedAnswer);
          
              // Update the flashcard object with the new values
              flashcard.question_mc = updatedQuestion;
              flashcard.answer_mc = updatedAnswer;
              flashcard.options_mc = updatedOptions;

              // Update the question and answer fields in the original modal
              questionDivMC.textContent = updatedQuestion;
              answerDivMC.textContent = updatedAnswer;
              optionsDivMC.textContent = updatedOptions;

              // Remove the new modal from the DOM
              newModal.remove();
          
              // Show the original modal again
              document.getElementById('modal').classList.remove('hidden');
            });
          });
          
          flashcardList.appendChild(li);
        
    });
            }
          }

document.getElementById('modal').classList.remove('hidden');
}              

function refreshDecks() {
  const deckContainer = document.getElementById('deck-container');
  deckContainer.innerHTML = ''; // Remove all existing deck cards from the deck container
  fetchDecks(); // Generate new deck cards
}


function openRenameDeckModal(deckName, deckId) {
  const renameDeckModal = document.createElement('div');
  renameDeckModal.className = 'fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center backgroundmodal';
  renameDeckModal.innerHTML = `   
  <div class="relative w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button type="button" id="closeRenameDeckModal" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              <span class="sr-only">Close modal</span>
          </button>
          <div class="px-6 py-6 lg:px-8">
              <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Rename deck</h3>
              <form class="space-y-6" action="#" id="renameDeckForm">
                  <div>
                      <label for="deckName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deck name</label>
                      <input type="text" name="deckName" id="deckName" value='${deckName}' class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="When was..." required>
                  </div>
                  <div class="flex justify-between">
                  <button type="submit" id="saveDeckName" class="w-full text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save changes</button>
              </form>
      </div>
  </div>
</div>`;

    document.body.appendChild(renameDeckModal);
  
    // Add event listeners for the buttons
    document.getElementById('saveDeckName').addEventListener('click', () => {
      const newName = renameDeckModal.querySelector('input[name="deckName"]');
      updateDeckName(newName, deckId);

    });
    document.getElementById('closeRenameDeckModal').addEventListener('click', () => {
      document.body.removeChild(renameDeckModal);
    });
  
    // Prevent form submission
    document.getElementById('renameDeckForm').addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }
  
  async function updateDeckName(newName, deckId) {
    try {
      const response = await fetch(`/update-deck-name/${deckId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName.value }),
      });
  
      if (response.ok) {
        const updatedDeck = await response.json();
        // Reload the page to update the deck name
        document.getElementById('renameDeckForm').remove();
        document.querySelector('.backgroundmodal').remove();
refreshDecks();
showAlert("Deck renamed successfully!");

      } else {
        const error = await response.json();
        console.error(error.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  
  
    
    async function modifyCard(deckId, cardId, question, answer) {
      console.log(`Deck ID: ${deckId}, Card ID: ${cardId}`);

      try {
        const response = await fetch(`/update-card/${deckId}/${cardId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question, answer }),
          credentials: 'include',
        });
        const data = await response.json();
        showAlert("Card saved successfully!");
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    async function modifyCardTF(deckId, cardId, question, answer) {
      console.log(`Deck ID: ${deckId}, Card ID: ${cardId}`);

      try {
        const response = await fetch(`/update-card-tf/${deckId}/${cardId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question, answer }),
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    async function modifyCardMC(deckId, cardId, question, options, answer) {
      console.log(`Deck ID: ${deckId}, Card ID: ${cardId}`);

      try {
        const response = await fetch(`/update-card-mc/${deckId}/${cardId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question, options, answer }),
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    function setupAddCardButton(deckId) {
        // Create a new modal with similar styles
        const addCardModal = document.createElement('div');
        addCardModal.className = 'fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center';
        addCardModal.innerHTML = `   
        <div class="relative w-full max-w-xl max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" id="cancelAddCard" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Close modal</span>
                </button>
                <div class="px-6 py-6 lg:px-8">
                    <h3 class="text-xl font-medium text-gray-900 dark:text-white">Create new flashcard</h3>
                    <p class="mb-6 text-sm font-normal text-gray-500 dark:text-white">You can only create flashcards. If you visit the study tab and select a different study mode, we'll automatically generate the card in that format.</p>
                    <form class="space-y-6" action="#" id="addCardForm">
                        <div>
                            <label for="question" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question</label>
                            <input type="text" name="question" id="question" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="When was..." required>
                        </div>

                        <div>
                            <label for="question" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Answer</label>
                            <input type="text" name="answer" id="answer" placeholder="He was born in..." class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                        </div>
                        <div class="flex justify-between">
                        <button type="submit" class="w-full text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add card</button>
                    </form>
            </div>
        </div>
    </div>`;
    
        // Append the new modal to the body
        document.body.appendChild(addCardModal);
    
        // Add event listeners to the Add Card and Cancel buttons
        const cancelButton = addCardModal.querySelector('#cancelAddCard');
        cancelButton.addEventListener('click', () => {
          addCardModal.remove();
        });
    
        const addCardForm = addCardModal.querySelector('#addCardForm');
addCardForm.addEventListener('submit', event => {
  event.preventDefault();

  // Get the question and answer values from the form
  const questionInput = addCardForm.querySelector('input[name="question"]');
  const answerInput = addCardForm.querySelector('input[name="answer"]');
  const question = questionInput.value;
  const answer = answerInput.value;

  // Call the addCardToDeck API endpoint with the appropriate parameters
  fetch(`/deck/${deckId}/card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, answer }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to add card to deck');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    // Update the UI or do any other necessary tasks
  })
  .catch(error => {
    console.error(error);
    // Display an error message to the user or retry the request
  });

  // Remove the addCardModal from the DOM
  refreshDecks();
  setTimeout(() => {
    showAlert("Card added successfully!");
  }, 800);
  addCardModal.remove();
});
      }
    
    

    async function removeDeck(deckId) {
      // Display a confirmation modal
      showConfirmationModalDeck(async () => {
        try {
          const response = await fetch(`/deck/${deckId}`, {
            method: 'DELETE',
            credentials: 'include',
          });
    
          if (response.ok) {
            const message = await response.json();
            console.log(message);
            // Refresh the decks list after successful deletion
            const deckContainer = document.getElementById('deck-container');
            deckContainer.innerHTML = '';
            fetchDecks();
            showAlert("Deck removed successfully!");
          } else {
            console.error('Failed to remove deck');
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
    
    const removeCard = async (deckId, cardId) => {
      showConfirmationModalDeck(async () => {
        try {
          const response = await axios.delete(`/deck/${deckId}/card/${cardId}`, {
            withCredentials: true,
          });
    
          if (response.status === 200) {
            console.log("Card removed successfully");
            // Refresh the deck data to update the UI
            const updatedDeckData = await fetchDeck(deckId);
            // Update the modal with the updated deck data
            console.log(updatedDeckData.deck.deckName);
            showFlashcardsModal(updatedDeckData.deck.deckName, updatedDeckData.deck.flashcards, deckId);
          } else {
            console.error("Failed to remove the card");
          }
        } catch (error) {
          console.error("Error removing the card:", error);
        }
      });
    };

    async function fetchDeck(deckId) {
      try {
        const response = await fetch(`/deck/${deckId}`, {
          credentials: 'include',
        });
    
        if (response.ok) {
          const deckData = await response.json();
          const totalCount = deckData.flashcards.length;
          showLoadingScreen();
          return {
            deck: deckData,
            totalCount,
          };
        } else {
          console.error('Failed to fetch deck');
        }
      } catch (error) {
        console.error(error);
      }
    }
    
    function showConfirmationModalDeck(onConfirm) {
      const modal = document.createElement('div');
      modal.id = 'confirmation-modal';
      modal.className = 'fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-40 flex items-center justify-center hidden';
      modal.innerHTML = `
      <div class="relative w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" id="closeConfirmationModalDeck" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
                  <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  <span class="sr-only">Close modal</span>
              </button>
              <div class="p-6 text-center">
                  <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <h3 class="text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to remove this deck?</h3>
                  <p class="text-sm mb-5 font-normal text-gray-500 text-center">You can't undo this action once it's done.</p>
                  <button data-modal-hide="popup-modal" id="confirmButtonDeck" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                      Yes, I'm sure
                  </button>
                  <button data-modal-hide="popup-modal" id="cancelButtonDeck"  type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
              </div>
          </div>
      </div>
  </div>`;
        document.body.appendChild(modal);
      
        document.getElementById('confirmButtonDeck').addEventListener('click', () => {
          onConfirm();
          closeModal();
        });
      
        document.getElementById('closeConfirmationModalDeck').addEventListener('click', () => {
          closeModal();
        });
        document.getElementById('cancelButtonDeck').addEventListener('click', () => {
          closeModal();
        });
      
        function closeModal() {
          modal.classList.add('hidden');
          setTimeout(() => {
            document.body.removeChild(modal);
          }, 300);
        }
      
        setTimeout(() => {
          modal.classList.remove('hidden');
        }, 100);
      }

    function showConfirmationModalCard(onConfirm) {
      const modal = document.createElement('div');
      modal.id = 'confirmation-modal';
      modal.className = 'fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-40 flex items-center justify-center hidden';
      modal.innerHTML = `
      <div class="relative w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" id="closeConfirmationModal" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
                  <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  <span class="sr-only">Close modal</span>
              </button>
              <div class="p-6 text-center">
                  <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <h3 class="text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to remove this card?</h3>
                  <p class="text-sm mb-5 font-normal text-gray-500 text-center">The card will be removed from all 3 study types.</p>
                  <button data-modal-hide="popup-modal" id="confirmButton" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                      Yes, I'm sure
                  </button>
                  <button data-modal-hide="popup-modal" id="cancelButton"  type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
              </div>
          </div>
      </div>
  </div>`;
        document.body.appendChild(modal);
      
        document.getElementById('confirmButton').addEventListener('click', () => {
          onConfirm();
          closeModal();
        });
      
        document.getElementById('closeConfirmationModal').addEventListener('click', () => {
          closeModal();
        });
        document.getElementById('cancelButton').addEventListener('click', () => {
          closeModal();
        });
      
        function closeModal() {
          modal.classList.add('hidden');
          setTimeout(() => {
            document.body.removeChild(modal);
          }, 300);
        }
      
        setTimeout(() => {
          modal.classList.remove('hidden');
        }, 100);
      }
      
      async function getPlan()  {
        try {
          const response = await fetch('/plan');
          const { plan } = await response.json();
          if (response.ok)  {
            if (plan === "free")  {
              document.getElementById('cta').classList.remove('hidden');
            } else {
              document.getElementById('freetrial').classList.add('hidden');
            }
          }
        } catch (error) {
          console.log(error);
        }
      } 
        
      getPlan();
    
      async function fetchDecks() {
        try {
          const response = await fetch('/user-decks', {
            credentials: 'include',
          });
      
          if (response.ok) {
            const decks = await response.json();
            const deckContainer = document.getElementById('deck-container');
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
            deckCountFraction.textContent = userDecksCount + '/' + maxFreeDecks + ' Decks';
            if (decks.length === 0) {
              return createDeckCard(0);
            }
            // Create an array of promises for each deck
            const promises = decks.map(async (deck) => {
              return createDeckCard(deck);
            });
      
            // Wait for all the promises to resolve
            const deckCards = await Promise.all(promises);
      
            // Append the deck cards to the container
            deckCards.forEach((deckCard) => {
              deckContainer.appendChild(deckCard);
            });
      
            // Set the width of all deck cards to the width of the longest one
            let maxWidth = 0;
            deckCards.forEach((deckCard) => {
              maxWidth = Math.max(maxWidth, deckCard.offsetWidth);
            });
            deckCards.forEach((deckCard) => {
              deckCard.style.width = `${maxWidth}px`;
            });
      
            // Ensure each deck card is on its own row
            deckContainer.style.display = 'flex';
            deckContainer.style.flexWrap = 'wrap';
          } else {
            console.error('Failed to fetch decks');
          }
        } catch (error) {
          console.error(error);
        }
      }
      
      

  fetchDecks();

  document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("modal").classList.add("hidden");
  });

  document.querySelectorAll('.flashcard-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const buttonsContainer = item.querySelector('.buttons-container');
      buttonsContainer.classList.remove('hidden');
    });
  
    item.addEventListener('mouseleave', () => {
      const buttonsContainer = item.querySelector('.buttons-container');
      buttonsContainer.classList.add('hidden');
      });
      });      
    



      function test() {
optionsInput = "A) hello B) bye C) pog D) yay";
        const updatedOptions = optionsInput;
        const optionPairs = updatedOptions.split(/([ABCD]\)\s+)/).filter(Boolean).reduce((acc, cur, idx) => {
          if (idx % 2 === 0) {
            acc.push(cur);
          } else {
            acc[acc.length - 1] += cur;
          }
          return acc;
        }, []);
        
        const optionArray = optionPairs.map((str) => (str.trim() + ','));
        
        const optionString = JSON.stringify(optionArray);
        
        
        console.log(optionString);                  
      }

      test();


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