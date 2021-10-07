const btnLogin = document.getElementById('login');
const btnCloseAlert = document.querySelector('.btn-close');

(function () {
    const query = new URLSearchParams(location.search);
    if (query && query.get('error')) {
        history.pushState(null, null, location.pathname);
        showError(query.get('error'));
    }
})();

btnLogin.addEventListener('click', async function () {

    // remove the below return if you wanna test the AJAX way
    return;

    try {
        const txtUsername = document.getElementById('username');
        const txtPassword = document.getElementById('password');
        const chkRememberMe = document.getElementById('rememberMe');

        const username = txtUsername && txtUsername.value;
        const password = txtPassword && txtPassword.value;
        const rememberMe = chkRememberMe && chkRememberMe.checked;
        const body = JSON.stringify({ username, password, rememberMe });

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body
        });
    
        if (response.status === 200) {
            window.location.replace('/');
        } else {
            showError('Invalid Credentials');
        }
    } catch (error) {
        showError('Something went wrong');
    }
});
btnCloseAlert.addEventListener('click', function () {
    const dvAlert = document.querySelector('.alert');
    dvAlert.classList.add('d-none');
});

function showError(error) {
    const dvAlert = document.querySelector('.alert');
    const spnAlert = document.querySelector('.alert span');
    spnAlert.textContent = error;
    dvAlert.classList.remove('d-none');
}