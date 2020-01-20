
let prices = {};  // Latest stock price list from server
let tapeQue = {};
let tapeQueKeys = [];
let tickerPos = [ -20, -40, -60, -80, -100, -120 ];
//let ws = new WebSocket('ws://localhost:8080');
let ws = new WebSocket('wss://api.nile16.me');
let token = false;


/**********************************************************
 * Ticker-tape                                            *
 **********************************************************/


/**
 * Fills a que of stock quotes to be presented
 * by the ticker tape.
 *
 */
function fillTapeQue() {
    tapeQue = prices;
    tapeQueKeys = Object.keys(tapeQue);
}

/**
 * Get the next stock qoute.
 * Takes a stock qoute from the que of stock quotes and
 * returns it as a string.
 * When the que is empty fillTapeQue is called to refill the que.
 *
 * @returns {string} - Stocksymbol and price.
 */
function getNextQuote() {
    if (tapeQueKeys.length) {
        let stockSymbol = tapeQueKeys.shift();
        let s = stockSymbol;

        s += ":";
        s +=  tapeQue[stockSymbol];

        if (!tapeQueKeys.length) {
            fillTapeQue();
        }

        return s;
    } else {
        return "";
    }
}

/**
 * Runs the ticker tape.
 * The ticker tape consist of six divs that are moved from right
 * to left by changing the absolute positioned div's CSS property 'right'.
 * The div's positions are stored in the array 'tickerPos'.
 * When a div is in the far right starting position (-20%) it is
 * given a fresh stock qoute by 'getNextQuote'.
 * When a div has reached the far left position (100%) it is moved
 * back to the far right starting position (-20%).
 */
setInterval( () => {
    tickerPos = tickerPos.map((pos, i) => {
        if (pos == -20) {
            document.getElementById('ticker' + i).innerText = getNextQuote();
        }
        pos += 1;
        document.getElementById('ticker' + i).style.right = pos + "%";
        if (pos == 100) {
            pos = -20;
        }
        return pos;
    });
}, 100);

/**
 * Handling of incoming stock prices from websocket server.
 * Store prices in variable 'prices'.
 * When first prices are received, 'fillTapeQue' is called.
 */
ws.onopen = function() {
    let firstMessage = true;

    ws.onmessage = function (evt) {
        prices = JSON.parse(evt.data);
        if (firstMessage) {
            fillTapeQue();
            firstMessage = false;
        }
    };

    ws.onclose = function() {
        console.log('Connection lost');
    };
};


/**********************************************************
 * Communication with server API                          *
 **********************************************************/

/**
 * Sends an object to the server and calls a function
 * with the response.
 * Displays a 'contacting server...' message by making the div 'dimmer'
 * visible while waiting for a response.
 *
 * @param {object} data - object to send to server.
 * @param {function} callback - function to execute when server has responded.
 */
function sendData(data, callback) {
    document.getElementById('dimmer').style.display = "flex";
    fetch('https://api.nile16.me/', {
    //fetch('http://localhost:8080', {
        method: 'post',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        document.getElementById('dimmer').style.display = "none";
        callback(data);
    }).catch(function() {
        document.getElementById('dimmer').style.display = "none";
        callback({
            err: "Connection to server lost"
        });
    });
}


/**********************************************************
 * Error message                                          *
 **********************************************************/

/**
 * Displays an error message.
 *
 * @param {string} msg - The error message.
 */
function showErrorMsg(msg) {
    document.getElementById('errorMsg').innerHTML = "Error: " + msg;
}

/**
 * Removes any visible error message.
 *
 */
function clearErrorMsg() {
    document.getElementById('errorMsg').innerHTML = "";
}


/**********************************************************
 * Functions for making navbar links and views visible    *
 **********************************************************/

/**
 * Makes links in navigation bar visible.
 * Links not included in list are hidden.
 *
 * @param {Array.string} idList - List of link/div ids.
 */
function showLinks(idList) {
    Array.from(document.getElementsByClassName('navItem')).forEach(navEle=>{
        if (idList.includes(navEle.id)) {
            navEle.style.display = "flex";
        } else {
            navEle.style.display = "none";
        }
    });
}

/**
 * Makes a given view/screen visible.
 *
 * @param {string} id - View/div id.
 */
function showView(id) {
    Array.from(document.getElementsByClassName('view')).forEach(navEle=>{
        if (id == navEle.id) {
            navEle.style.display = "block";
        } else {
            navEle.style.display = "none";
        }
    });
}


/**********************************************************
 * Common for login and registration                      *
 **********************************************************/

/**
 * Validates an email address.
 *
 * @param {string} email - Email address.
 * @returns {boolean} - True if email is valid, false otherwise.
 */
function validateEmail(email) {
    var re = new RegExp (['^(([^<>()[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)',
        '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.',
        '[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+',
        '[a-zA-Z]{2,}))$'].join(''));

    return re.test(email);
}


/**********************************************************
 * Login                                                  *
 **********************************************************/

document.getElementById('loginLink').addEventListener("click", showLogin);
document.getElementById('loginButton').addEventListener("click", sendLogin);
document.getElementById('showPasswordCheckLogin')
    .addEventListener("click", togglePassWordVisiblityLogin);

/**
 * Makes the login form visible and display suitable links in navbar.
 */
function showLogin() {
    clearErrorMsg();
    showView('loginForm');
    showLinks(['registerLink']);
}

/**
 * Reads username and password from the form.
 * Called when the user press the "login"-button.
 * If email is valid and password present the login is sent to server.
 */
function sendLogin() {
    let email = document.getElementById('emailFieldLogin').value;
    let password = document.getElementById('passwordFieldLogin').value;

    if (!validateEmail(email)) {
        showErrorMsg("Email invalid");
    } else if (!password) {
        showErrorMsg("Password missing");
    } else {
        clearErrorMsg();
        sendData({
            cmd: "lin",
            ema: email,
            psw: password
        }, receiveLogin);
    }
}

/**
 * Handles response from server after login attempt.
 * If login was accepted the token provided by the server
 * is stored and the user's portfolio is shown,
 * otherwise the error from the server is displayed.
 */
function receiveLogin(data) {
    if (data.err) {
        showErrorMsg(data.err);
    } else {
        token = data.tok;
        showPortfolio();
    }
}

/**
 * Toggles password visibillity.
 */
function togglePassWordVisiblityLogin() {
    var x = document.getElementById("passwordFieldLogin");

    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

showLogin(); // Show initial login form


/**********************************************************
 * Registration                                           *
 **********************************************************/

document.getElementById('registerLink').addEventListener("click", showRegister);
document.getElementById('registerButton').addEventListener("click", sendRegister);
document.getElementById('showPasswordCheckReg')
    .addEventListener("click", togglePassWordVisiblityReg);

/**
 * Makes the registration form visible and display suitable links in navbar.
 */
function showRegister() {
    clearErrorMsg();
    showLinks(['loginLink']);
    showView('registerForm');
}

/**
 * Reads name, username and password from the form.
 * Called when the user press the "register"-button.
 * If email is valid and name and password present
 * the registration is sent to server.
 */
function sendRegister() {
    let name = document.getElementById('nameFieldReg').value;
    let email = document.getElementById('emailFieldReg').value;
    let password = document.getElementById('passwordFieldReg').value;

    if (!name) {
        showErrorMsg("Name missing");
    } else if (!validateEmail(email)) {
        showErrorMsg("Email invalid");
    } else if (!password) {
        showErrorMsg("Password missing");
    } else {
        clearErrorMsg();
        sendData({
            cmd: "reg",
            nam: name,
            ema: email,
            psw: password
        }, receiveRegister);
    }
}

/**
 * Handles response from server after registration attempt.
 * If registration was accepted the login form is shown,
 * otherwise the error from the server is displayed.
 */
function receiveRegister(data) {
    if (data.err) {
        showErrorMsg(data.err);
    } else {
        showLogin();
    }
}

/**
 * Toggles password visibillity.
 */
function togglePassWordVisiblityReg() {
    var x = document.getElementById("passwordFieldReg");

    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}


/**********************************************************
 * Fund Transfer                                          *
 **********************************************************/

document.getElementById('transferButton').addEventListener("click", sendTransfer);
document.getElementById('transferLink').addEventListener("click", showTransfer);

/**
 * Makes the fund transfer form visible and display suitable links in navbar.
 */
function showTransfer() {
    clearErrorMsg();
    showView('transferForm');
    showLinks(['logoutLink', 'tradeLink', 'portfolioLink']);
}

/**
 * Reads amount and transfer type from the transfer form.
 * Called when the user press the "transfer"-button.
 * If amount present the fund transfer is sent to server.
 */
function sendTransfer() {
    let amount = document.getElementById('amountField').value;
    let radios = document.getElementsByName('transTypeRadio');
    let type = false;

    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            type = radios[i].value;
            break;
        }
    }

    if (!amount) {
        showErrorMsg("Amount missing");
    } else {
        clearErrorMsg();
        sendData({
            cmd: "tra",
            tok: token,
            typ: type,
            amt: amount
        }, receiveTransfer);
    }
}

/**
 * Handles response from server after fund transfer attempt.
 * If the transfer was accepted the portfolio view is shown,
 * otherwise the error from the server is displayed.
 */
function receiveTransfer(data) {
    if (data.err) {
        showErrorMsg(data.err);
    } else {
        showPortfolio();
    }
}


/**********************************************************
 * Portfolio                                              *
 **********************************************************/

document.getElementById('portfolioLink').addEventListener("click", showPortfolio);

/**
 * Makes the portfolio view visible and display suitable links in navbar.
 * Requests the user's portfolio data from the server.
 */
function showPortfolio() {
    document.getElementById('portfolio').innerHTML = "";
    clearErrorMsg();
    showLinks(['logoutLink', 'transferLink', 'tradeLink']);
    showView('portfolioView');

    sendData({
        cmd: "dat",
        tok: token
    }, drawPortfolio);
}

/**
 * Handles response from server after request for user's portfolio data.
 * If the request for data was accepted the portfolio is drawn in a table,
 * otherwise the error from the server is displayed.
 */
function drawPortfolio(data) {
    if (!data.err) {
        let html = "<table class='portfolio'>";
        let totalShareValue = 0;

        document.getElementById('stockField').value = "";
        document.getElementById('quantField').value = "";

        html += "<th>Stock</th><th>Qty.</th><th>Est. Value</th>";

        if (Object.keys(data.shr).length !== 0) {
            for (let stock in data.shr) {
                let shareValue = data.shr[stock]*prices[stock];

                totalShareValue += shareValue;

                html += "<tr>";
                html += "<td>" + stock + "</td>";
                html += "<td>" + data.shr[stock] + "</td>";
                html += "<td>" + shareValue.toFixed(2) + "</td>";
                html += "</tr>";
            }
        } else {
            html += "<tr><td colspan='3'>None</td></tr>";
        }
        html += "<tr><td colspan='3'><hr></td></tr>";
        html += "<tr><td colspan='2'>Est. Portfolio Value</td><td>" +
            totalShareValue.toFixed(2) + "</td></tr>";
        html += "<tr><td colspan='2'>Cash Balance</td><td>" + data.bal.toFixed(2) + "</td></tr>";
        html += "<tr><td colspan='2'>Est. Account Value</td><td>" +
            (totalShareValue + data.bal).toFixed(2) + "</td></tr>";
        html += "</table>";
        document.getElementById('portfolio').innerHTML = html;
    } else {
        showErrorMsg(data.err);
    }
}

/**********************************************************
 * Trade                                                  *
 **********************************************************/

document.getElementById('tradeButton').addEventListener("click", sendTrade);
document.getElementById('tradeLink').addEventListener("click", showTrade);

/**
 * Makes the trade form visible and display suitable links in navbar.
 */
function showTrade() {
    clearErrorMsg();
    showLinks(['logoutLink', 'transferLink', 'portfolioLink']);
    showView('tradeForm');
}

/**
 * Reads stock and quantity from the trade form.
 * Called when the user press the "trade"-button.
 * If stock and quantity are present the trade is sent to server.
 */
function sendTrade() {
    let stock = document.getElementById('stockField').value.toUpperCase();
    let quant = document.getElementById('quantField').value;

    if (!stock) {
        showErrorMsg("Stock missing");
    } else if (!quant) {
        showErrorMsg("Quant invalid");
    } else {
        clearErrorMsg();
        sendData({
            cmd: "trd",
            tok: token,
            stk: stock,
            num: quant
        }, receiveTrade);
    }
}

/**
 * Handles response from server after trade attempt.
 * If the trade was accepted the portfolio view is shown,
 * otherwise the error from the server is displayed.
 */
function receiveTrade(data) {
    if (data.err) {
        showErrorMsg(data.err);
    } else {
        showPortfolio();
    }
}


/**********************************************************
 * Logout                                                 *
 **********************************************************/

document.getElementById('logoutLink').addEventListener("click", logout);

/**
 * Logs out the user by deleting the user token.
 *
 */
function logout() {
    token = false;
    showLogin();
}
