import { LoginPage } from "../pages/LoginPage"
import { test as base } from "@playwright/test"
import { RegisterPage } from "../pages/RegisterPage"

type Fixtures = {
    loginPage: LoginPage,
    registerPage: RegisterPage
}

export const test = base.extend<Fixtures>({
    loginPage: async ({page}, use) => {
        await use(new LoginPage(page))
    },
    registerPage: async ({page}, use) => {
        await use(new RegisterPage(page))
    }
})

export { expect } from "@playwright/test"