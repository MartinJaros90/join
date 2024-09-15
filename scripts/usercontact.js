let initialsForUser = [];
let randomNumbersForUser = [];
let userCompare

function getUserForContacts(user) {
    console.log(user);
}

/**
 * Create a string of a color to choose the css-class
 * 
 * @returns random color
 */
function createColor() {
    let colorArray = ["yellow", "orange", "turquoise", "purple", "lightpurple", "blue", "lightblue", "pink", "lightred", "green"]
    let color = colorArray[createRandomNumbers()]
    return color;
}


/**
 * Creates a random Number, that will decide what color the circle gets
 * 
 * @returns random color-Number
 */
function createRandomNumbers() {
    if (randomNumbersForUser.length > 9) {
        randomNumbers = [];
    }
    let n = randomNumbersForUser.length - 1;
    let finalNumber = randomNumbersForUser.length;
    while (n < finalNumber) {
        let x = Math.floor((Math.random() * 10));
        if (!randomNumbersForUser.includes(x)) {
            randomNumbersForUser.push(x);
            n++;
        }
    }
    let colorNumber = randomNumbersForUser[randomNumbersForUser.length - 1];
    return colorNumber;
}


/**
 * Creates initials with maximum two letters
 * 
 * @param {string} name - name of the contact that is used to create the initials
 */
function createInitials(name) {
    let words = name.split(" ");
    initialsForUser = [];
    words.length = 2;
    words.forEach((element) => initialsForUser.push(element.charAt(0)));
}


function jsonToArrayUser(json) {
    let result = [];
    let keys = Object.keys(json);
    keys.forEach(function (key) {
      result.push(json[key]);
    });
    return result;
  }