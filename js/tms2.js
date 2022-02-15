function domaincheck() {
    if (document.domain == "3kh0.github.io") {
        console.log("You are on the right page!");
    } else {
        document.write("<h1>Hello gamers! Please go <a href='https://3kh0.github.io/'>here</a> for better games.</h1><h3>Site-owners, if you are confused on why this happened, please read <a href='https://github.com/3kh0/3kh0.github.io/wiki/Note-to-people-stealing-my-games'>this</a>.</h3>");
    }
}
function domaincheckF() {
    if (document.domain == "cheese.github.io") {
        console.log("You are on the right page!");
    } else {
        document.write("<h1>Hello gamers! Please go <a href='https://3kh0.github.io/'>here</a> for better games.</h1><h3>Site-owners, if you are confused on why this happened, please read <a href='https://github.com/3kh0/3kh0.github.io/wiki/Note-to-people-stealing-my-games'>this</a>.</h3>");
    }
}
function referrercheck() {
    var referrer = document.referrer;
    if (referrer != "3kh0.github.io") {
        document.write("<h1>Hello gamers! Please go <a href='https://3kh0.github.io/'>here</a> for better games.</h1><h3>Site-owners, if you are confused on why this happened, please read <a href='https://github.com/3kh0/3kh0.github.io/wiki/Note-to-people-stealing-my-games'>this</a>.</h3>");
    } else {
        console.log("You are on the right page!");
    }
}
function referrercheckF() {
    var referrer = document.referrer;
    if (referrer != "cheese.github.io") {
        document.write("<h1>Hello gamers! Please go <a href='https://3kh0.github.io/'>here</a> for better games.</h1><h3>Site-owners, if you are confused on why this happened, please read <a href='https://github.com/3kh0/3kh0.github.io/wiki/Note-to-people-stealing-my-games'>this</a>.</h3>");
    } else {
        console.log("You are on the right page!");
    }
}