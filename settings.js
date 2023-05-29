let errorMessage = "";
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
      } catch (error) {
        console.error(error);
        }
        }   

        async function sendForm() {
          const newPassword = document.getElementById('newPassword').value;
          const confirmPassword = document.getElementById('confirmPassword').value;
          const currentPassword = document.getElementById('currentPassword').value;
          const button = document.getElementById('resetSubmit');
          const spinner = document.getElementById('spinner');
          button.classList.add('hidden');
          spinner.classList.remove('hidden');
          try {
            // Fetch the user ID
            const userIdResponse = await fetch(`/get-user-id`, {
              method: 'GET',
              credentials: 'include',
            });
            const { userId } = await userIdResponse.json();
            const body = JSON.stringify({ userId, currentPassword, newPassword, confirmPassword });
            console.log("calling route reset password");
            const response = await fetch(`/reset-password`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              body
            });
        
            if (response.ok) {
              document.querySelector('form').reset();
              button.classList.remove('hidden');
              spinner.classList.add('hidden');
              showSuccess();
            } else {
              // Handle error
              const errorData = await response.json();
              errorMessage = errorData.error;
              showError(errorMessage);
              document.querySelector('form').reset();
              button.classList.remove('hidden');
              spinner.classList.add('hidden');
            }
          } catch (error) {
            console.error(error);
          }
        }
        
        async function sendForm() {
          const newPassword = document.getElementById('newPassword').value;
          const confirmPassword = document.getElementById('confirmPassword').value;
          const currentPassword = document.getElementById('currentPassword').value;
          const button = document.getElementById('resetSubmit');
          const spinner = document.getElementById('spinner');
          button.classList.add('hidden');
          spinner.classList.remove('hidden');
          try {
            // Fetch the user ID
            const userIdResponse = await fetch(`/get-user-id`, {
              method: 'GET',
              credentials: 'include',
            });
            const { userId } = await userIdResponse.json();
            const body = JSON.stringify({ userId, currentPassword, newPassword, confirmPassword });
            console.log("calling route reset password");
            const response = await fetch(`/reset-password`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              body
            });
        
            if (response.ok) {
              document.querySelector('form').reset();
              button.classList.remove('hidden');
              spinner.classList.add('hidden');
              showSuccess();
              setTimeout(() => {
                location.reload();
              }, 500);
            } else {
              // Handle error
              const errorData = await response.json();
              errorMessage = errorData.error;
              showError(errorMessage);
              document.querySelector('form').reset();
              button.classList.remove('hidden');
              spinner.classList.add('hidden');
              setTimeout(() => {
                location.reload();
              }, 1000);
            }
          } catch (error) {
            console.error(error);
          }
        }
        
        async function sendFormEmail() {
          const newEmail = document.getElementById('newEmail').value;
          const currentEmail = document.getElementById('currentEmail').value;
          const button = document.getElementById('resetEmail');
          const spinner = document.getElementById('spinnerEmail');
          const isChecked = document.getElementById('emails').checked;
          button.classList.add('hidden');
          spinner.classList.remove('hidden');
          try {
            // Fetch the user ID
            console.log('test');
            const userIdResponse = await fetch(`/get-user-id`, {
              method: 'GET',
              credentials: 'include',
            });
            const { userId } = await userIdResponse.json();
            console.log(userId);
            const body = JSON.stringify({ userId, currentEmail, newEmail, isChecked });
            console.log("calling route reset email");
            const response = await fetch(`/reset-email`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              body
            });
        
            if (response.ok) {
              document.querySelector('form').reset();
              button.classList.remove('hidden');
              spinner.classList.add('hidden');
              showSuccessEmail();
              setTimeout(() => {
                location.reload();
              }, 500);
              
            } else {
              // Handle error
              const errorData = await response.json();
              errorMessage = errorData.error;
              showError(errorMessage);
              document.getElementById('resetFormEmail').reset();
              button.classList.remove('hidden');
              spinner.classList.add('hidden');
              setTimeout(() => {
                location.reload();
              }, 1000);
            }
          } catch (error) {
            console.error(error);
          }
        }

        var form = document.getElementById("resetPassword");
        function submitForm(event) {
           event.preventDefault();
        }
        form.addEventListener('submit', submitForm);

        var formemail = document.getElementById("resetFormEmail");
        function submitForm(event) {
           event.preventDefault();
        }
        formemail.addEventListener('submit', submitForm);

      
        function showError(errorMessage)  {
          const warningAlert = document.createElement("div");
  warningAlert.classList.add("flex", "p-4", "m-12", "text-sm", "text-red-800", "rounded-lg", "bg-red-100", "fixed", "bottom-0", "border", "border-red-200", "right-0", "opacity-0", "transition", "duration-300", "slide-up");
  warningAlert.setAttribute("role", "alert");
  warningAlert.innerHTML = `
    <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
    </svg>
    <span class="font-medium">${errorMessage}</span>
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

          function showSuccess()  {
            const warningAlert = document.createElement("div");
    warningAlert.classList.add("flex", "p-4", "m-12", "text-sm", "text-green-800", "rounded-lg", "bg-green-100", "fixed", "bottom-0", "border", "border-green-200", "right-0", "opacity-0", "transition", "duration-300", "slide-up");
    warningAlert.setAttribute("role", "alert");
    warningAlert.innerHTML = `
      <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
      </svg>
      <span class="font-medium">Password reset successfully!</span>
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


          function showSuccessEmail()  {
            const warningAlert = document.createElement("div");
    warningAlert.classList.add("flex", "p-4", "m-12", "text-sm", "text-green-800", "rounded-lg", "bg-green-100", "fixed", "bottom-0", "border", "border-green-200", "right-0", "opacity-0", "transition", "duration-300", "slide-up");
    warningAlert.setAttribute("role", "alert");
    warningAlert.innerHTML = `
      <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
      </svg>
      <span class="font-medium">Preferences changed successfully!</span>
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



fetchDecks();


async function checkPremium() {
  const plan = await getPlan();
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

async function getEmail()  {
  try {
    const response = await fetch('/email');
    const { email } = await response.json();
    return email;
  } catch (error) {
    console.log(error);
  }
} 



async function getGoogleData()  {
  try {
    const response = await fetch('/is-google-account');
    console.log(response.status);
    if (response.status === 200)  {
      const currentEmailField = document.getElementById('currentEmail');
      const newEmailField = document.getElementById('newEmail');
      currentEmailField.style.cursor = 'not-allowed';
      currentEmailField.style.cursor = 'not-allowed';
      currentEmailField.style.opacity = 0.3;
      newEmailField.style.opacity = 0.3;
      currentEmailField.disabled = true;
      newEmailField.disabled = true;
      currentEmailField.title = "Sign in with Google users cannot change their emails";
      newEmailField.title = "Sign in with Google users cannot change their emails";
    }
  } catch (error) {
    console.log(error);
  }
} 

async function checkMarketing() {
  try {
    const response = await fetch('/get-marketing-consent');
    if (response.status === 200)  {
    document.getElementById('emails').checked = true;
  } else if (response.status === 403) {
    document.getElementById('emails').checked = false;
  }
  } catch (error) {
    console.log(error);
  }
}

async function setEmail() {
  const email = await getEmail();
  document.getElementById('helloText').textContent = ('Hello, ' + email + '!');
  document.getElementById('currentEmail').value = (email);
}


checkMarketing();
checkPremium();
setEmail();
getGoogleData();

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