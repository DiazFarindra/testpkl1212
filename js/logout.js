function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        
        // If Log out successfull remove
        const sideLead = document.getElementById('side-lead')
        const rowContent1 = document.getElementById('rowContent1')
        sideLead.classList.remove('d-none')
        rowContent1.classList.remove('d-none')

        // then add
        const sideNavs = document.getElementById('side-navs')
        const rowContent2 = document.getElementById('rowContent2')
        sideNavs.classList.add('d-none')
        rowContent2.classList.add('d-none')

        window.location.reload(true)
        console.log('User signed out.');
    });
}