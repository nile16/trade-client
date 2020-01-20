/**
 * Test for getting started with Selenium.
 */
"use strict";



const assert = require("assert");
const test = require("selenium-webdriver/testing");
const webdriver = require("selenium-webdriver");
const By = webdriver.By;

let browser;


// Test suite
test.describe("Client tests", function() {
    test.beforeEach(function(done) {
        this.timeout(10000);
        browser = new webdriver.Builder().
            withCapabilities(webdriver.Capabilities.firefox()).build();

        browser.get("http://localhost:8082/");
        done();
    });

    test.afterEach(function(done) {
        this.timeout(0);
        browser.quit();
        done();
    });


    function assertH2(target) {
        browser.findElement(By.css("h2")).then(function(element) {
            element.getText().then(function(text) {
                assert.equal(text, target);
            });
        });
    }

    function assertError(target) {
        browser.findElement(By.id("errorMsg")).then(function(element) {
            element.getText().then(function(text) {
                assert.equal(text, target);
            });
        });
    }

    //Test cases
    test.it("Index page", function(done) {
        this.timeout(20000);
        browser.sleep(1000);

        browser.getTitle().then(function(title) {
            assert.equal(title, "BTH Trader");
        });

        assertH2("Login");

        done();
    });

    test.it("Login", function(done) {
        this.timeout(20000);
        assertH2("Login");
        browser.sleep(1000);
        browser.findElement(By.id("emailFieldLogin")).sendKeys("nils@bth.se");
        browser.sleep(1000);
        browser.findElement(By.id("passwordFieldLogin")).sendKeys("1234");
        browser.sleep(1000);
        browser.findElement(By.id("loginButton")).click();
        browser.sleep(2000);
        assertError("");
        browser.sleep(1000);
        done();
    });

    test.it("Login with wrong password", function(done) {
        this.timeout(20000);
        assertH2("Login");
        browser.sleep(1000);
        browser.findElement(By.id("emailFieldLogin")).sendKeys("nils@bth.se");
        browser.sleep(1000);
        browser.findElement(By.id("passwordFieldLogin")).sendKeys("12345");
        browser.sleep(1000);
        browser.findElement(By.id("loginButton")).click();
        browser.sleep(2000);
        assertError("Error: Wrong password");
        browser.sleep(1000);
        done();
    });

    test.it("Login with wrong email", function(done) {
        this.timeout(20000);
        assertH2("Login");
        browser.sleep(1000);
        browser.findElement(By.id("emailFieldLogin")).sendKeys("nilss@bth.se");
        browser.sleep(1000);
        browser.findElement(By.id("passwordFieldLogin")).sendKeys("1234");
        browser.sleep(1000);
        browser.findElement(By.id("loginButton")).click();
        browser.sleep(2000);
        assertError("Error: Email not registered");
        browser.sleep(1000);
        done();
    });


    test.it("Login and deposit", function(done) {
        this.timeout(20000);
        assertH2("Login");
        browser.sleep(1000);
        browser.findElement(By.id("emailFieldLogin")).sendKeys("nils@bth.se");
        browser.sleep(1000);
        browser.findElement(By.id("passwordFieldLogin")).sendKeys("1234");
        browser.sleep(1000);
        browser.findElement(By.id("loginButton")).click();
        browser.sleep(2000);
        assertError("");
        browser.findElement(By.id("transferLink")).click();
        browser.sleep(1000);
        browser.findElement(By.id("radioDeposit")).click();
        browser.sleep(1000);
        browser.findElement(By.id("amountField")).sendKeys("10000");
        browser.sleep(1000);
        browser.findElement(By.id("transferButton")).click();
        browser.sleep(2000);
        assertError("");
        done();
    });


    test.it("Login and buy stock", function(done) {
        this.timeout(20000);
        assertH2("Login");
        browser.sleep(1000);
        browser.findElement(By.id("emailFieldLogin")).sendKeys("nils@bth.se");
        browser.sleep(1000);
        browser.findElement(By.id("passwordFieldLogin")).sendKeys("1234");
        browser.sleep(1000);
        browser.findElement(By.id("loginButton")).click();
        browser.sleep(2000);
        assertError("");
        browser.findElement(By.id("tradeLink")).click();
        browser.sleep(1000);
        browser.findElement(By.id("stockField")).sendKeys("BTH");
        browser.sleep(1000);
        browser.findElement(By.id("quantField")).sendKeys("1");
        browser.sleep(1000);
        browser.findElement(By.id("tradeButton")).click();
        browser.sleep(2000);
        assertError("");
        done();
    });


    test.it("Login and sell stock", function(done) {
        this.timeout(20000);
        assertH2("Login");
        browser.sleep(1000);
        browser.findElement(By.id("emailFieldLogin")).sendKeys("nils@bth.se");
        browser.sleep(1000);
        browser.findElement(By.id("passwordFieldLogin")).sendKeys("1234");
        browser.sleep(1000);
        browser.findElement(By.id("loginButton")).click();
        browser.sleep(2000);
        assertError("");
        browser.findElement(By.id("tradeLink")).click();
        browser.sleep(1000);
        browser.findElement(By.id("stockField")).sendKeys("BTH");
        browser.sleep(1000);
        browser.findElement(By.id("quantField")).sendKeys("-1");
        browser.sleep(1000);
        browser.findElement(By.id("tradeButton")).click();
        browser.sleep(2000);
        assertError("");
        done();
    });


    test.it("Login and withdraw", function(done) {
        this.timeout(20000);
        assertH2("Login");
        browser.sleep(1000);
        browser.findElement(By.id("emailFieldLogin")).sendKeys("nils@bth.se");
        browser.sleep(1000);
        browser.findElement(By.id("passwordFieldLogin")).sendKeys("1234");
        browser.sleep(1000);
        browser.findElement(By.id("loginButton")).click();
        browser.sleep(2000);
        assertError("");
        browser.findElement(By.id("transferLink")).click();
        browser.sleep(1000);
        browser.findElement(By.id("radioWithdraw")).click();
        browser.sleep(1000);
        browser.findElement(By.id("amountField")).sendKeys("10000");
        browser.sleep(1000);
        browser.findElement(By.id("transferButton")).click();
        browser.sleep(2000);
        assertError("");
        done();
    });



});
