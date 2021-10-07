const btnLogout = document.getElementById('logout');

btnLogout.addEventListener('click', async function () {

    // remove the below return if you wanna test the AJAX way
    return;

    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: { 'content-type': 'application/json' }
        });

        if (response.status === 200) {
            window.location.replace('/login');
        } else {
            alert('Something went wrong, not able to logout.');
        }
    } catch (error) {
        alert('Something went wrong, not able to logout.');
    }
});
