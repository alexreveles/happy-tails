async function loginFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (username && password) {
    const response = await fetch('/api/volunteer/login', {
      method: 'post',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      // After successfully logged in, redirect to the dashboard
      document.location.replace('/dashboard');
    }
    else {
      alert(response.statusText);
    };
  };
};

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);