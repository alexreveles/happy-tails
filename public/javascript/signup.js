async function signupFormHandler(event) {
  console.log('prevent default ')
  event.preventDefault();

  console.log('signup form handler')
  const username = document.querySelector('#username-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const v_fname = document.querySelector('#fname').value.trim();
  const v_lname = document.querySelector('#lname').value.trim();
  console.log(username + v_fname + v_lname)

  
  if (username && password) {
    console.log('username and password filled out')
    const response = await fetch('/api/volunteer', {
      method: 'post',
      body: JSON.stringify({
        username,
        password,
        v_fname,
       v_lname
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      console.log(response)
      document.location.replace('/dashboard/');
    } else {
      alert(response.statusText);
    }
  }
}

// document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.getElementById('signup-form').addEventListener('submit', signupFormHandler);