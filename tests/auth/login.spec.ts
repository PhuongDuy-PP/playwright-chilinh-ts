import { expect, test } from "../../fixtures/test-fixtures";
import { invalidUser, validUser } from "../../test-data/user";

test.describe("Login", () => {

    test("Login with valid credentials", async ({loginPage}) => {
        await loginPage.open();
        await loginPage.login(validUser.email, validUser.password);

        // mong đợi login modal không còn hiển thị nữa
        await expect(loginPage.usernameInput).toBeHidden();
    })

    test("Login with invalid credentials", async ({loginPage}) => {
        await loginPage.open();
        await loginPage.login(invalidUser.email, invalidUser.password);
        // mong đợi login modal vẫn còn hiển thị
        await expect(loginPage.usernameInput).toBeVisible();
    })
})