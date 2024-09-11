let initialsSummary = [];

/**
 * switch to board
 */
function navigateToBoard() {
    window.location.href = 'board.html'
}

/**
 * set the Daytime on Greeting after Login from User
 */
function setDaytimeOnGreeting() {
    let myDate = new Date();    
    let hrs = myDate.getHours();
    let greet;
    if (hrs < 12)
        greet = 'Good Morning,';
    else if (hrs >= 12 && hrs <= 17)
        greet = 'Good Afternoon,';
    else if (hrs >= 17 && hrs <= 24)
        greet = 'Good Evening,';
    document.getElementById('daytime-greeting').innerHTML = greet;
}

/**
 * set the Name from the User on Greeting after Login
 */
async function setUsernameOnGreeting() {
    const response = await fetch(BASE_URL_USER + "/users.json");
    const data = await response.json();
    let UserKeys = Object.values(data);      
    let userEmail = JSON.parse(localStorage.getItem('email'));
    for (let i = 0; i < UserKeys.length; i++) {
        const currentUser = UserKeys[i];     
        if (currentUser.email == userEmail) {
            document.getElementById('username-greeting').innerHTML = currentUser.name;
            createInitialsForHeader(currentUser.name);
            return;
        } else {
            let userNameNoRemember = JSON.parse(sessionStorage.getItem('name'));
            document.getElementById('username-greeting').innerHTML = userNameNoRemember;
            createInitialsForHeader(userNameNoRemember);
            return;
        }
    }
}

function createInitialsForHeader(name) {
    let words = name.split(" ");
    initialsSummary = [];
    words.length = 2;
    words.forEach((element) => initialsSummary.push(element.charAt(0)));
    sessionStorage.setItem('Initials', JSON.stringify(initialsSummary));
}

async function showInitialsForHeader() {
    await setUsernameOnGreeting();
    let initialsHeader = JSON.parse(sessionStorage.getItem('Initials'));
    if (initialsHeader) {
        let firstInitial = initialsHeader[0];
        let secondInitial = initialsHeader[1];
        let combinedInitials = firstInitial + (secondInitial ? secondInitial : '');
        document.getElementById('initials-header').innerHTML = combinedInitials;
    }
}

async function getTasksFromFirebase(path = "/tasks") {
    const response = await fetch(BASE_URL_USER + path + ".json");
    const data = await response.json();
    let UserTasksArray = Object.values(data);
    const taskLength = UserTasksArray.length;
    document.getElementById('summary-bottom-tasks').innerHTML = taskLength;
    
    
}