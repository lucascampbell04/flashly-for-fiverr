const pro = 'price_1MsngvCBn8HNEByTRuxyUiBW';
const student = 'price_1MsnDZCBn8HNEByTJ9dHor5V';

async function getPlan()  {
  try {
    const response = await fetch('/plan');
    const { plan } = await response.json();
    return plan;
  } catch (error) {
    console.log(error);
  }
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
          deckCountFraction.textContent = (userDecksCount + "/" + maxFreeDecks + " Decks")
          }
          setButtons();
      } catch (error) {
        console.error(error);
        }
        }   

  
        async function setButtons() {
          const freeButton = document.getElementById('freeButton');
          const studentButton = document.getElementById('studentButton');
          const proButton = document.getElementById('proButton');
        
          // The user's current plan
          const userPlan = await getPlan(); // Replace with the actual user plan
        
          if (userPlan === 'free') {
            console.log("plan is free");
            freeButton.textContent = 'You are already on this plan';
            freeButton.classList = "inline-block px-5 py-3 bg-gray-50 opacity-50 text-indigo-700 font-semibold text-center rounded-full dark:bg-violet-400 dark:text-gray-900";
            studentButton.addEventListener('click', () => {
              redirectToCheckout(student);
            });
            studentButton.style.cursor = 'pointer';
            proButton.style.cursor = 'pointer';
            proButton.addEventListener('click', () => {
              redirectToCheckout(pro);
            });
          } else if (userPlan === 'student') {
            studentButton.textContent = 'Manage subscription';
            studentButton.addEventListener('click', () => {
              window.open('https://billing.stripe.com/p/login/test_eVa5mrcvzgyU0WkcMM', '_blank');
            });
            freeButton.classList = "bg-white inline-block w-full px-5 py-3 font-bold text-center hover:bg-gray-100 rounded-full dark:bg-violet-400 text-indigo-700 dark:text-gray-900";
            freeButton.textContent = "Downgrade to Free";
            freeButton.addEventListener('click', () => {
              window.open('https://billing.stripe.com/p/login/test_eVa5mrcvzgyU0WkcMM', '_blank');
            });
            proButton.addEventListener('click', () => {
              window.open('https://billing.stripe.com/p/login/test_eVa5mrcvzgyU0WkcMM', '_blank');
            });
            freeButton.style.cursor = 'pointer';
            proButton.style.cursor = 'pointer';
          } else if (userPlan === 'pro') {
            freeButton.textContent = 'Downgrade to Free';
            freeButton.classList = "bg-white inline-block w-full px-5 py-3 font-bold text-center hover:bg-gray-100 rounded-full dark:bg-violet-400 text-indigo-700 dark:text-gray-900";
            studentButton.textContent = 'Downgrade to Student';
            proButton.textContent = 'Manage subscription';
            freeButton.addEventListener('click', () => {
              window.open('https://billing.stripe.com/p/login/test_eVa5mrcvzgyU0WkcMM', '_blank');
            });
            studentButton.addEventListener('click', () => {
              window.open('https://billing.stripe.com/p/login/test_eVa5mrcvzgyU0WkcMM', '_blank');
            });
            proButton.addEventListener('click', () => {
              window.open('https://billing.stripe.com/p/login/test_eVa5mrcvzgyU0WkcMM', '_blank');
            });
            studentButton.style.cursor = 'pointer';
            freeButton.style.cursor = 'pointer';
          }
        }
        
        function redirectToCheckout(priceId) {
          fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ priceId })
          })
          .then((response) => response.json())
          .then((session) => {
            if (session && session.url) {
              window.location.href = session.url;
            }
          })
          .catch((error) => {
            console.error('Error creating checkout session:', error);
          });
        }
  fetchDecks();

  async function getPlan()  {
    try {
      const response = await fetch('/plan');
      const { plan } = await response.json();
      if (response.ok)  {
        if (plan != "free")  {
          document.getElementById('freetrial').classList.add('hidden');
        } 
      }
      return plan;
    } catch (error) {
      console.log(error);
    }
  } 
    
  getPlan();

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