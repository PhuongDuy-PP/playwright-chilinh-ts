import { Locator, Page } from "@playwright/test";

export class HeaderComponent {
    readonly logo: Locator;
    readonly avatarBtn: Locator;
    readonly loginBtn: Locator;
    readonly registerBtn: Locator;
    readonly navHome: Locator;

    constructor(page: Page) {
        // getByText('Cybersoft')
        // page.locator()
        this.logo = page.getByRole('link', {name: 'Cybersoft'})

        // this.avatarBtn = page.locator('nav button.rounded-full')
        // dùng xpath //img[@src='https://cdn-icons-png.flaticon.com/512/6596/6596121.png']
        this.avatarBtn = page.locator('//img[@src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"]')
        // page.getByText('Đăng nhập')
        // page.locator('button:has-text("Đăng nhập")')
        this.loginBtn = page.getByRole('button', {name: 'Đăng nhập'})

        this.registerBtn = page.getByRole('button', {name: 'Đăng ký'})

        this.navHome = page.getByRole('link', {name: 'Home'})
    }

    async openUserMenu(): Promise<void> {
        await this.avatarBtn.click();
        // auto-wait tới khi element visiable + enabled + stable
    }

    async openLoginModal(): Promise<void> {
        await this.openUserMenu();
        await this.loginBtn.click();
    }

    async openRegisterModal(): Promise<void> {
        await this.openUserMenu();
        await this.registerBtn.click();
    }

}