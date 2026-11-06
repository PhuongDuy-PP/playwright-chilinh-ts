import { LoginPage } from "../pages/LoginPage"
import { test as base } from "@playwright/test"
import { RegisterPage } from "../pages/RegisterPage"
import { HomePage } from "../pages/HomePage"
import { RoomDetailPage } from "../pages/RoomDetailPage"

type Fixtures = {
    loginPage: LoginPage,
    registerPage: RegisterPage,
    homePage: HomePage,
    roomDetailPage: RoomDetailPage
}

export const test = base.extend<Fixtures>({
    loginPage: async ({page}, use) => {
        await use(new LoginPage(page))
    },
    registerPage: async ({page}, use) => {
        await use(new RegisterPage(page))
    },
    homePage: async ({page}, use) => {
        await use(new HomePage(page))
    },
    roomDetailPage: async ({page}, use) => {
        await use(new RoomDetailPage(page))
    }
})

export { expect } from "@playwright/test"