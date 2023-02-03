import * as Codeceptjs from "codeceptjs";

Feature("questioncondition");

Scenario("test questioncondition", ({ I }) => {
    //login into django admin tool
    I.amOnPage("http://localhost:8000/admin/api/condition");
    I.fillField("input[name=username]", "admin");
    I.fillField("input[name=password]", "admin");
    I.click("input[type=submit]");
    I.wait(1);

    //remove all conditions
    I.click("#action-toggle");
    I.click("select[name=action]");
    I.selectOption("[name=action]", "delete_selected");
    I.click("button[class=button]");
    I.click("form input[type=submit]");
    I.wait(1);

    //remove all questionconditions
    I.amOnPage("http://localhost:8000/admin/api/questioncondition");
    I.click("#action-toggle");
    I.click("select[name=action]");
    I.selectOption("[name=action]", "delete_selected");
    I.click("button[class=button]");
    I.click("form input[type=submit]");
    I.wait(1);

    //login test
    I.amOnPage("/login");
    I.wait(1);
    I.fillField("input[type=email]", "admin");
    I.fillField("input[type=password]", "admin");
    I.click("//button[@id='submitbutton']");
    I.wait(1);

    //naviate to questioncondition
    I.click("button[id=stammdaten]");
    I.click("a[id=questioncondition]");
    //questioncondition test
    //add condition-blocks
    I.wait(2);
    I.click("#Umgang");
    I.click("button[id=addConditionBlock]");
    I.wait(1);
    I.click("button[id=addConditionBlock]");
    I.wait(1);
    I.click("button[id=addConditionBlock]");
    I.wait(1);

    //add conditions
    I.click(".addButton");
    I.wait(1);
    I.click(".addButton");
    I.wait(1);
    //merge conditions
    I.click(".mergeButton");
    I.wait(1);
    //delete conditions
    I.click(".deleteButton");
    I.wait(1);
    I.saveScreenshot("questioncondition.jpg");
});
