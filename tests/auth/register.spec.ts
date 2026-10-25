import { expect, test } from "../../fixtures/test-fixtures";
import { generateRegisterData } from "../../test-data/user";

test.describe("Register", () => {
    test("Register new user", async ({registerPage, loginPage}) => {
        await registerPage.open();
        // tạo dữ liệu đăng ký mới
        const newUser = generateRegisterData();
        await registerPage.fillForm(newUser);

        await expect(loginPage.usernameInput).toBeVisible();
    })
})