import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    readonly usernameInput: Locator
    readonly passwordInput: Locator
    readonly loginBtn: Locator

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByPlaceholder('Vui lòng nhập tài khoản')
        this.passwordInput = page.getByRole('textbox', {name: 'Mật khẩu'})
        this.loginBtn = page.getByRole('button', {name: 'Đăng nhập'})
    }

    async open(): Promise<void> {
        await this.goto();
        await this.header.openLoginModal();
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginBtn.click();
    }

    // function to check if login modal is visible
    async isLoginModalVisible(): Promise<boolean> {
        return await this.usernameInput.isVisible();
    }
}