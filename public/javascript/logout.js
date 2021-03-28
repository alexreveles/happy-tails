function logout() {
 
    fetch('/api/volunteer/logout', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' }
    })
    .then(function(){
        document.location.replace('/');
    })
    .catch(err => {
        console.log(err);
    })
  }
  
  document.querySelector("#logout").addEventListener('click', logout);