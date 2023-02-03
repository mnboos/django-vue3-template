Feature("Login functionality");

Scenario("should be able to login", ({ I }) => {
    I.amOnPage("/");
    I.click("Anmelden");
    I.see("E-Mail");
    I.see("Passwort");
    I.fillField("E-Mail", process.env.E2E_USER || "");
    I.fillField("Passwort", process.env.E2E_PASSWORD || "");
    I.click("#login");
    I.seeElement("#menuLogout");
});

Scenario("should stay on login page with wrong credentials", ({ I }) => {
    I.amOnPage("/");
    I.click("Anmelden");
    I.see("E-Mail");
    I.see("Passwort");
    I.fillField("E-Mail", process.env.E2E_USER || "");
    I.fillField("Passwort", "blablub");
    I.click("#login");
    I.see("Login failed");
});
