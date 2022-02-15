function domaincheck() {
    if (document.domain == "3kh0.github.io") {
        console.log("You are on the right page!"); // Show success
        // check if page is in a iframe
        var referrer = document.referrer;
        if (referrer != "3kh0.github.io") {
            // is in iframe and not on og domain
            document.write("<h1>Hello gamers! Please go <a href='https://3kh0.github.io/'>here</a> for better games.</h1><h3>Site-owners, if you are confused on why this happened, please read <a href='https://github.com/3kh0/3kh0.github.io/wiki/Note-to-people-stealing-my-games'>this</a>.</h3>");
        } else {
            console.log("You are on the right page!"); // Show success
        }
    } else {
        // not correct page
        document.write("<h1>Hello gamers! Please go <a href='https://3kh0.github.io/'>here</a> for better games.</h1><h3>Site-owners, if you are confused on why this happened, please read <a href='https://github.com/3kh0/3kh0.github.io/wiki/Note-to-people-stealing-my-games'>this</a>.</h3>");
    }
}

// Only for debug
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