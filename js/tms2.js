function domaincheck() {
    var domain = document.domain;
    if (domain == "3kh0.github.io") {
        console.log("This page is on the 3kh0.github.io domain!")
        var referrer = document.referrer; // grab referrer
        if (referrer != "null") { 
            // this prevents (almost) any embed!
            document.write("<h1>Hello gamers! Please go <a href='https://3kh0.github.io/'>here</a> for better games.</h1><h3>Site-owners, if you are confused on why this happened, please read <a href='https://github.com/3kh0/3kh0.github.io/wiki/Note-to-people-stealing-my-games'>this</a>.</h3>");
            console.log("Sorry, this page was embeded, and that is not allowed!")
        }
    } else {
        // this will run if the script is run on a domain different to 3kh0.github.io
        document.write("<h1>Hello gamers! Please go <a href='https://3kh0.github.io/'>here</a> for better games.</h1><h3>Site-owners, if you are confused on why this happened, please read <a href='https://github.com/3kh0/3kh0.github.io/wiki/Note-to-people-stealing-my-games'>this</a>.</h3>");
    }
}

// Only for debug
function msg() {
    document.write("<h1>Hello gamers! Please go <a href='https://3kh0.github.io/'>here</a> for better games.</h1><h3>Site-owners, if you are confused on why this happened, please read <a href='https://github.com/3kh0/3kh0.github.io/wiki/Note-to-people-stealing-my-games'>this</a>.</h3>");
    console.log("Done! :)")
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