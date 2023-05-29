const flashcardCounter = document.getElementById("flashcard-counter");
         
const importButton = document.getElementById("import");
const modifyButton = document.getElementById("modify");

function updateImportAndModifyButtonsVisibility() {
          const buttonContainer = document.querySelector(".button-container");
          if (flashcards.length > 0) {
            buttonContainer.style.display = "flex";
          } else {
            buttonContainer.style.display = "none";
          }

          importButton.disabled = flashcards.length === 0;
          modifyButton.disabled = flashcards.length === 0;
        }

function updateCounterDisplay() {
  flashcardCounter.textContent = `${counter + 1} / ${flashcards.length}`;
  if (flashcards.length > 0)    {
    flashcardCounter.classList.remove("hidden");
  }
  else {
    flashcardCounter.classList.add("hidden");
  }
}



async function importFlashcards() {
  if (flashcards.length === 0) {
    alert("There are no flashcards to import.");
    return;
  }

  try {
    const response = await axios.get("/login-check", { withCredentials: true });

    if (response.status === 200) {
      document.getElementById('modal').classList.add('hidden');
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
              <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Import deck</h3>
              <form class="space-y-6" action="#" id="renameDeckForm">
                <div>
                  <label for="deckName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deck name</label>
                  <input type="text" name="deckName" id="deckName" placeholder='This can be anything...' class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="When was..." required>
                </div>
                <div class="flex justify-between">
                  <button type="submit" id="saveDeckName" class="w-full text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>`;

      const closeRenameDeckModalButton = renameDeckModal.querySelector("#closeRenameDeckModal");
      closeRenameDeckModalButton.addEventListener("click", () => {
        document.body.removeChild(renameDeckModal);
      });

      const renameDeckForm = renameDeckModal.querySelector("#renameDeckForm");
      renameDeckForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const deckNameInput = renameDeckModal.querySelector("#deckName");
        const deckName = deckNameInput.value.trim();

        if (!deckName) {
          showAlert("Import cancelled.");
          document.body.removeChild(renameDeckModal);
          return;
        }
        const flashcardsData = Array.from(flashcards).map((card) => {
          return {
            question: card.querySelector(".front").innerText,
            answer: card.querySelector(".back").innerText,
            question_tf: "",
            answer_tf: "",
            question_mc: "",
            answer_mc: "",
            easy: 0,
          };
        });

        console.log(flashcardsData);

        try {
          await axios.post(
            "/save-deck",
            { name: deckName, flashcards: flashcardsData, beenStudied: false, studyMode: 'none' },
            { withCredentials: true }
          );
          showSuccess("Flashcards successfully imported.");
        } catch (error) {
          console.error("Error importing flashcards:", error);
          showAlert("You've already imported 3 decks. Upgrade to import more.");
        }

        document.body.removeChild(renameDeckModal);
      });

      document.body.appendChild(renameDeckModal);
    } else {
      alert("Please log in to save your flashcards.");
    }
  } catch (error) {
    console.error("Error importing flashcards:", error);
    showAlert("Error importing flashcards. Please try again.");
  }
}




function closeModal() {
            document.getElementById("modal").classList.add("hidden");
            document.body.classList.remove("modal-active");
            updateCounterDisplay();
        }

// Add the "Modify" button functionality
function modifyFlashcards() {
  const cardIndex = parseInt(prompt("Enter the number of the flashcard you want to modify:"));

  if (cardIndex > 0 && cardIndex <= flashcards.length) {
    const question = prompt("Enter the new question:", flashcards[cardIndex - 1].querySelector(".front").innerText);
    const answer = prompt("Enter the new answer:", flashcards[cardIndex - 1].querySelector(".back").innerText);

    flashcards[cardIndex - 1].querySelector(".front").innerText = question;
    flashcards[cardIndex - 1].querySelector(".back").innerText = answer;
  } else {
    alert("Modification cancelled.");
  }
}

    
const flashcardsElement = document.getElementById("flashcards");
let flashcards = flashcardsElement.children;
let counter = 0;

const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

function updateButtonsVisibility() {
  const buttons = [previousButton, nextButton];
  buttons.forEach((button) => {
    button.disabled = flashcards.length === 0;
  });
  previousButton.disabled = counter === 0;
  nextButton.disabled = counter === flashcards.length - 1;
}

document.addEventListener("DOMContentLoaded", function () {
    
const typewriterText = document.getElementById("typewriter-text");
const typewriter = new Typewriter(typewriterText, {
  loop: true,
  delay: 50,
});
typewriter
.pauseFor(2000)
.typeString("We're generating your flashcards now. This only happens once.")
.pauseFor(1300)
.deleteAll()
.typeString("This can take anywhere from 1 to 5 minutes.")
.pauseFor(3000)
.deleteAll()
.typeString("AI is working hard to generate your flashcards.")
.pauseFor(3000)
.deleteAll()
.typeString("If you're enjoying Flashly, please share us with your friends!")
.pauseFor(3000)
.start();  
  
  updateButtonsVisibility();
  updateCounterDisplay();
  updateImportAndModifyButtonsVisibility();
  getRandomMeme();
  previousButton.addEventListener("click", moveToPreviousFlashcard);
  nextButton.addEventListener("click", moveToNextFlashcard);
});

async function getRandomMeme() {
const apiUrl = "https://api.giphy.com/v1/gifs/trending?api_key=cAQ1mP15e48H4YH1EeQHPByQbXTbItIg&limit=25&rating=g";
const memeElement = document.getElementById("random-meme");

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

// Bind the file upload inputs to a change event listener
document.getElementById('image-upload').addEventListener('change', handleFileUpload);
document.getElementById('pdf-upload').addEventListener('change', handleFileUpload);
document.getElementById('document-upload').addEventListener('change', handleFileUpload);
document.getElementById('ppt-upload').addEventListener('change', handleFileUpload);

// Bind the buttons to a click event listener to trigger the file upload inputs
document.getElementById('image-button').addEventListener('click', () => {
  document.getElementById('image-upload').click();
});
document.getElementById('pdf-button').addEventListener('click', () => {
  document.getElementById('pdf-upload').click();
});
document.getElementById('document-button').addEventListener('click', () => {
  document.getElementById('document-upload').click();
});
document.getElementById('ppt-button').addEventListener('click', () => {
  document.getElementById('ppt-upload').click();
});

async function handleFileUpload() {
  const file = event.target.files[0];

  if (!file) {
    alert('Please select a file to upload.');
    return;
  }


  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/convert-to-text', {
      method: 'POST',
      body: formData,
    });

    const text = await response.text();

    generatePrompt(text);
  } catch (error) {
    console.error(error);
    alert('Error uploading file. Please try again later.');
  }
}

async function checkPremium() {
  const plan = await getPlan();
  if (plan != "pro")  {
   const premiumButtons = document.getElementsByClassName('premium');
   console.log(premiumButtons);
   for (var i=0; i < premiumButtons.length;i++) {
  premiumButtons[i].classList.add('opacity-20')
  premiumButtons[i].disabled = true;
  premiumButtons[i].style.cursor = 'not-allowed';
  }
  document.getElementById('premium-div').classList.remove('hidden');
  }
  if (plan != "free")  {
    document.getElementById('freetrial').classList.add('hidden');
  } 
}
checkPremium();
async function getPlan()  {
  try {
    const response = await fetch('/plan');
    const { plan } = await response.json();
    return plan;
  } catch (error) {
    console.log(error);
  }
} 

function moveToPreviousFlashcard() {
  if (counter > 0) {
    // hide the current flashcard
    flashcards[counter].style.display = "none";
    // decrease the counter
    counter--;
    // show the previous flashcard
    flashcards[counter].style.display = "block";
    updateButtonsVisibility();
    updateCounterDisplay();
  }
}

function moveToNextFlashcard() {
  if (counter < flashcards.length - 1) {
    // hide the current flashcard
    flashcards[counter].style.display = "none";
    // increase the counter
    counter++;
    // show the next flashcard
    flashcards[counter].style.display = "block";
    updateButtonsVisibility();
    updateCounterDisplay();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  for (let i = 1; i < flashcards.length; i++) {
    flashcards[i].style.display = "none";
  }

  updateButtonsVisibility();
  updateImportAndModifyButtonsVisibility();
  
});

function showAlert(message)  {
  const warningAlert = document.createElement("div");
  warningAlert.classList.add("flex", "p-4", "m-12", "text-sm", "text-yellow-800", "rounded-lg", "bg-yellow-100", "dark:bg-gray-800", "dark:text-yellow-300", "fixed", "bottom-0", "border", "border-yellow-200", "right-0", "opacity-0", "transition", "duration-300", "slide-up");
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
}

function showSuccess(message)  {
  const warningAlert = document.createElement("div");
  warningAlert.classList.add("flex", "p-4", "m-12", "text-sm", "text-gray-700", "rounded-lg", "bg-green-100", "dark:bg-gray-800", "dark:text-yellow-300", "fixed", "bottom-0", "border", "border-gray-200", "right-0", "opacity-0", "transition", "duration-300", "slide-up");
  warningAlert.setAttribute("role", "alert");
  warningAlert.innerHTML = `
  <div class="flex-shrink-0">
  <svg class="h-4 w-4 text-green-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
  </svg>
</div>
<div class="ml-3">
  <p class="text-sm text-gray-700 dark:text-gray-400">
   ${message}
  </p>
</div>
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
}

async function generatePrompt(text) {
  let prompt;

  if (text) {
    prompt = text;
  } else {
    prompt = document.getElementById("prompt").value;
    
  if (!prompt)  {
      console.log("none");
      showAlert("Please enter text or upload a file.");
      console.log('done');
      return;
    }
    else if (prompt.length < 30)  {
      showAlert("Your text is very short. Please input a bit more for correct generation.");
      return;
    }
  }

  flashcards = flashcardsElement.children;
  const responseElement = document.getElementById("responseElement");
  document.getElementById("loading-screen").classList.remove("hidden");
  const memeElement = document.getElementById("random-meme");
memeElement.innerHTML = "";
getRandomMeme();
    try {
      const response = await axios.post('/generate-flashcards', {
        prompt: prompt,
      });

      // Clear the flashcards element in case there are any flashcards already
      flashcardsElement.innerHTML = "";

      // Create the flashcards from the response
      const messages = response.data.trim().split('\n');
      const questionCards = messages
        .filter((message) => message.trim().startsWith("Q:"))
        .map((message) => message.substring(2).trim());
      const answerCards = messages
        .filter((message) => message.trim().startsWith("A:"))
        .map((message) => message.substring(2).trim());

      questionCards.forEach((question, index) => {
        const cardElement = createFlashcard(question, answerCards[index]);
        flashcardsElement.appendChild(cardElement);
        for (let i = 1; i < flashcards.length; i++) {
          flashcards[i].style.display = "none";
        }
      });

      document.getElementById("loading-screen").classList.add("hidden");
      updateButtonsVisibility();
      updateImportAndModifyButtonsVisibility();
      updateCounterDisplay();
      document.getElementById("modal").classList.remove("hidden");
      document.body.classList.add("modal-active");

    } catch (error) {
      console.error(error);
      responseElement.innerText = error.message;
}
}
    function createFlashcard(question, answer) {
const cardElement = document.createElement("div");
cardElement.className = "w-full sm:w-96 h-72 p-4 m-4 rounded-lg shadow-md relative flex items-center justify-center cursor-pointer card mx-auto";

const frontElement = document.createElement("div");
frontElement.className = "card-front shadow-lg absolute top-0 left-0 w-full min-h-[24rem] p-4 bg-indigo-700 text-white font-medium text-lg text-center flex items-center justify-center rounded-lg front";
frontElement.innerText = question;

const backElement = document.createElement("div");
backElement.className = "card-back flashcard-back shadow-lg absolute top-0 left-0 w-full min-h-[24rem] p-4 bg-white text-indigo-700 font-medium text-lg text-center flex items-center justify-center rounded-lg back";
backElement.innerText = answer;

cardElement.appendChild(frontElement);
cardElement.appendChild(backElement);

return cardElement;
}


    function removeEmpty(elm){
      return (elm != null && elm !== false && elm !== "");
    }

    async function fetchDecks() {
    try {
      const response = await fetch('/user-decks', {
        credentials: 'include',
      });
  
      if (response.ok) {
        const decks = await response.json();
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
        deckCountFraction.textContent = (userDecksCount + "/" + maxFreeDecks + " Decks");
      } else {
        console.error('Failed to fetch decks');
      }
    } catch (error) {
      console.error(error);
    }
  }

  fetchDecks();

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
  