async function updateHeader() {
  const isLoggedIn = await checkLoginStatus();
  const headerContainer = document.getElementById('header-container');
  if (isLoggedIn) {
    headerContainer.innerHTML = `
    <header class="">
    <nav class="z-10 w-full absolute"><div class="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
        <div class="flex flex-wrap items-center justify-between py-2 gap-6 md:py-4 md:gap-0 relative">
            <img src="/img/LogoLong.png" class="w-1/12 flex-shrink-0 ob">
            <input aria-hidden="true" type="checkbox" name="toggle_nav" id="toggle_nav" class="hidden peer">
            <div class="relative z-20 w-full flex justify-between lg:w-max md:px-0">
                <div class="relative flex items-center lg:hidden max-h-10">
                    <label role="button" for="toggle_nav" aria-label="humburger" id="hamburger" class="relative  p-6 -mr-6">
                        <div aria-hidden="true" id="line" class="m-auto h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"></div>
                        <div aria-hidden="true" id="line2" class="m-auto mt-2 h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"></div>
                    </label>
                </div>
            </div>
            <div aria-hidden="true" class="fixed z-10 inset-0 h-screen w-screen bg-white/70 backdrop-blur-2xl origin-bottom scale-y-0 transition duration-500 peer-checked:origin-top peer-checked:scale-y-100 lg:hidden dark:bg-gray-900/70"></div>
            <div class="flex-col z-20 flex-wrap gap-6 p-8 rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-600/10 justify-end w-full invisible opacity-0 translate-y-1  absolute top-full left-0 transition-all duration-300 scale-95 origin-top 
                        lg:relative lg:scale-100 lg:peer-checked:translate-y-0 lg:translate-y-0 lg:flex lg:flex-row lg:items-center lg:gap-0 lg:p-0 lg:bg-transparent lg:w-7/12 lg:visible lg:opacity-100 lg:border-none
                        peer-checked:scale-100 peer-checked:opacity-100 peer-checked:visible lg:shadow-none 
                        dark:shadow-none dark:bg-gray-800 dark:border-gray-700">
                <div class="text-gray-600 dark:text-gray-300 lg:pr-4 lg:w-auto w-full lg:pt-0">
                    <ul class="tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0">
                        <li>
                            <button onclick="window.scrollTo({
                                top:1150,
                                behavior: 'smooth',
                            })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                                <span>The Solution</span>
                            </button>
                        </li>
                        <li>
                            <button onclick="window.scrollTo({
                                top:2000,
                                behavior: 'smooth',
                            })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                                <span>Features</span>
                        </button>
                        </li>
                        <li>
                            <button onclick="window.scrollTo({
                                top:2550,
                                behavior: 'smooth',
                            })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                                <span>How it Works</span>
                        </button>
                        </li>
                        <li>
                            <button onclick="window.scrollTo({
                                top:3232,
                                behavior: 'smooth',
                            })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                                <span>Testimonials</span>
                        </button>
                        </li>
                        <li>
                            <a href="#" id="logout-btn" class="block md:px-4 transition hover:text-primary">
                                <span>Log out</span>
                            </a>
                        </li>
                    </ul>
                </div>
  
                <div class="mt-12 lg:mt-0">
                    <a
                        href="study.html"
                        class="relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full rounded-full bg-indigo-700 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                        >
                        <span class="relative text-sm font-semibold text-white"
                            >Enter Flashly</span
                        >
                    </a>
                </div>
            </div>
        </div>
  </div></nav></header>
    `;
  } else {
    headerContainer.innerHTML = `
    <header class="">
    <nav class="z-10 w-full absolute"><div class="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
        <div class="flex flex-wrap items-center justify-between py-2 gap-6 md:py-4 md:gap-0 relative">
            <img src="/img/LogoLong.png" class="w-1/12 flex-shrink-0 ob">
            <input aria-hidden="true" type="checkbox" name="toggle_nav" id="toggle_nav" class="hidden peer">
            <div class="relative z-20 w-full flex justify-between lg:w-max md:px-0">
                <div class="relative flex items-center lg:hidden max-h-10">
                    <label role="button" for="toggle_nav" aria-label="humburger" id="hamburger" class="relative  p-6 -mr-6">
                        <div aria-hidden="true" id="line" class="m-auto h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"></div>
                        <div aria-hidden="true" id="line2" class="m-auto mt-2 h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"></div>
                    </label>
                </div>
            </div>
            <div aria-hidden="true" class="fixed z-10 inset-0 h-screen w-screen bg-white/70 backdrop-blur-2xl origin-bottom scale-y-0 transition duration-500 peer-checked:origin-top peer-checked:scale-y-100 lg:hidden dark:bg-gray-900/70"></div>
            <div class="flex-col z-20 flex-wrap gap-6 p-8 rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-600/10 justify-end w-full invisible opacity-0 translate-y-1  absolute top-full left-0 transition-all duration-300 scale-95 origin-top 
                        lg:relative lg:scale-100 lg:peer-checked:translate-y-0 lg:translate-y-0 lg:flex lg:flex-row lg:items-center lg:gap-0 lg:p-0 lg:bg-transparent lg:w-7/12 lg:visible lg:opacity-100 lg:border-none
                        peer-checked:scale-100 peer-checked:opacity-100 peer-checked:visible lg:shadow-none 
                        dark:shadow-none dark:bg-gray-800 dark:border-gray-700">
                <div class="text-gray-600 dark:text-gray-300 lg:pr-4 lg:w-auto w-full lg:pt-0">
                    <ul class="tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0">
                    <li>
                    <button onclick="window.scrollTo({
                        top:1150,
                        behavior: 'smooth',
                    })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                        <span>The Solution</span>
                    </button>
                </li>
                <li>
                    <button onclick="window.scrollTo({
                        top:2000,
                        behavior: 'smooth',
                    })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                        <span>Features</span>
                </button>
                </li>
                <li>
                    <button onclick="window.scrollTo({
                        top:2550,
                        behavior: 'smooth',
                    })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                        <span>How it Works</span>
                </button>
                </li>
                <li>
                    <button onclick="window.scrollTo({
                        top:3232,
                        behavior: 'smooth',
                    })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                        <span>Testimonials</span>
                </button>
                </li>
                        <li>
                            <a href="login.html" class="block md:px-4 transition hover:text-primary">
                                <span>Log in</span>
                            </a>
                        </li>
                    </ul>
                </div>
  
                <div class="mt-12 lg:mt-0">
                    <a
                        href="signup.html"
                        class="relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full rounded-full bg-indigo-700 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                        >
                        <span class="relative text-sm font-semibold text-white"
                            >Sign up for free</span
                        >
                    </a>
                </div>
            </div>
        </div>
  </div></nav></header>
    `;
  }
  const logoutButton = document.querySelector('#logout-btn');
        if (logoutButton) {
          logoutButton.addEventListener('click', async function() {
            try {
              const response = await fetch('/logout', {
                method: 'GET',
                credentials: 'include'
              });
              const data = await response.json();
              console.log(data.message); // Log the server response message
              window.location.href = '/'; // Redirect the user to the login page
            } catch (error) {
              console.error(error);
            }
          });
        }   
}

async function checkLoginStatus() {
  try {
    const response = await fetch('/login-check', { credentials: 'include' });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function getLoggedInHeader() {
  return `
  <header class="">
  <nav class="z-10 w-full absolute"><div class="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
      <div class="flex flex-wrap items-center justify-between py-2 gap-6 md:py-4 md:gap-0 relative">
          <img src="/img/LogoLong.png" class="w-1/12 flex-shrink-0 ob">
          <input aria-hidden="true" type="checkbox" name="toggle_nav" id="toggle_nav" class="hidden peer">
          <div class="relative z-20 w-full flex justify-between lg:w-max md:px-0">
              <div class="relative flex items-center lg:hidden max-h-10">
                  <label role="button" for="toggle_nav" aria-label="humburger" id="hamburger" class="relative  p-6 -mr-6">
                      <div aria-hidden="true" id="line" class="m-auto h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"></div>
                      <div aria-hidden="true" id="line2" class="m-auto mt-2 h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"></div>
                  </label>
              </div>
          </div>
          <div aria-hidden="true" class="fixed z-10 inset-0 h-screen w-screen bg-white/70 backdrop-blur-2xl origin-bottom scale-y-0 transition duration-500 peer-checked:origin-top peer-checked:scale-y-100 lg:hidden dark:bg-gray-900/70"></div>
          <div class="flex-col z-20 flex-wrap gap-6 p-8 rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-600/10 justify-end w-full invisible opacity-0 translate-y-1  absolute top-full left-0 transition-all duration-300 scale-95 origin-top 
                      lg:relative lg:scale-100 lg:peer-checked:translate-y-0 lg:translate-y-0 lg:flex lg:flex-row lg:items-center lg:gap-0 lg:p-0 lg:bg-transparent lg:w-7/12 lg:visible lg:opacity-100 lg:border-none
                      peer-checked:scale-100 peer-checked:opacity-100 peer-checked:visible lg:shadow-none 
                      dark:shadow-none dark:bg-gray-800 dark:border-gray-700">
              <div class="text-gray-600 dark:text-gray-300 lg:pr-4 lg:w-auto w-full lg:pt-0">
                  <ul class="tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0">
                      <li>
                          <button onclick="window.scrollTo({
                              top:1300,
                              behavior: 'smooth',
                          })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                              <span>The Problem</span>
                          </button>
                      </li>
                      <li>
                          <button onclick="window.scrollTo({
                              top:1300,
                              behavior: 'smooth',
                          })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                              <span>Features</span>
                      </button>
                      </li>
                      <li>
                          <button onclick="window.scrollTo({
                              top:1900,
                              behavior: 'smooth',
                          })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                              <span>How it Works</span>
                      </button>
                      </li>
                      <li>
                          <button onclick="window.scrollTo({
                              top:2625,
                              behavior: 'smooth',
                          })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                              <span>Testimonials</span>
                      </button>
                      </li>
                      <li>
                          <a href="#" id="logout-btn" class="block md:px-4 transition hover:text-primary">
                              <span>Log out</span>
                          </a>
                      </li>
                  </ul>
              </div>

              <div class="mt-12 lg:mt-0">
                  <a
                      href="study.html"
                      class="relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full rounded-full bg-indigo-700 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                      >
                      <span class="relative text-sm font-semibold text-white"
                          >Enter Flashly</span
                      >
                  </a>
              </div>
          </div>
      </div>
</div></nav></header>
  `;
}

function getLoggedOutHeader() {
  return `
  <header class="">
  <nav class="z-10 w-full absolute"><div class="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
      <div class="flex flex-wrap items-center justify-between py-2 gap-6 md:py-4 md:gap-0 relative">
          <img src="/img/LogoLong.png" class="w-1/12 flex-shrink-0 ob">
          <input aria-hidden="true" type="checkbox" name="toggle_nav" id="toggle_nav" class="hidden peer">
          <div class="relative z-20 w-full flex justify-between lg:w-max md:px-0">
              <div class="relative flex items-center lg:hidden max-h-10">
                  <label role="button" for="toggle_nav" aria-label="humburger" id="hamburger" class="relative  p-6 -mr-6">
                      <div aria-hidden="true" id="line" class="m-auto h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"></div>
                      <div aria-hidden="true" id="line2" class="m-auto mt-2 h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"></div>
                  </label>
              </div>
          </div>
          <div aria-hidden="true" class="fixed z-10 inset-0 h-screen w-screen bg-white/70 backdrop-blur-2xl origin-bottom scale-y-0 transition duration-500 peer-checked:origin-top peer-checked:scale-y-100 lg:hidden dark:bg-gray-900/70"></div>
          <div class="flex-col z-20 flex-wrap gap-6 p-8 rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-600/10 justify-end w-full invisible opacity-0 translate-y-1  absolute top-full left-0 transition-all duration-300 scale-95 origin-top 
                      lg:relative lg:scale-100 lg:peer-checked:translate-y-0 lg:translate-y-0 lg:flex lg:flex-row lg:items-center lg:gap-0 lg:p-0 lg:bg-transparent lg:w-7/12 lg:visible lg:opacity-100 lg:border-none
                      peer-checked:scale-100 peer-checked:opacity-100 peer-checked:visible lg:shadow-none 
                      dark:shadow-none dark:bg-gray-800 dark:border-gray-700">
              <div class="text-gray-600 dark:text-gray-300 lg:pr-4 lg:w-auto w-full lg:pt-0">
                  <ul class="tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0">
                      <li>
                          <button onclick="window.scrollTo({
                              top:800,
                              behavior: 'smooth',
                          })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                              <span>The Solution</span>
                          </button>
                      </li>
                      <li>
                          <button onclick="window.scrollTo({
                              top:1300,
                              behavior: 'smooth',
                          })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                              <span>Features</span>
                      </button>
                      </li>
                      <li>
                          <button onclick="window.scrollTo({
                              top:1900,
                              behavior: 'smooth',
                          })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                              <span>How it Works</span>
                      </button>
                      </li>
                      <li>
                          <button onclick="window.scrollTo({
                              top:2625,
                              behavior: 'smooth',
                          })" class="block md:px-4 transition tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0 hover:text-primary">
                              <span>Testimonials</span>
                      </button>
                      </li>
                      <li>
                          <a href="login.html" class="block md:px-4 transition hover:text-primary">
                              <span>Log in</span>
                          </a>
                      </li>
                  </ul>
              </div>

              <div class="mt-12 lg:mt-0">
                  <a
                      href="signup.html"
                      class="relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full rounded-full bg-indigo-700 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                      >
                      <span class="relative text-sm font-semibold text-white"
                          >Sign up for free</span
                      >
                  </a>
              </div>
          </div>
      </div>
</div></nav></header>
  `;
}


document.addEventListener("DOMContentLoaded", updateHeader);
