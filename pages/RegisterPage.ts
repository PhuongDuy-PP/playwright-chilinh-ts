import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { RegisterData } from "../test-data/user";

export class RegisterPage extends BasePage {
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly phoneInput: Locator;
    readonly birthdayInput: Locator;
    readonly genderSelect: Locator;
    readonly registerBtn: Locator;

    constructor(page: Page) {
        super(page);
        // lấy theo id của ô input
        this.nameInput = page.locator('#name');
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.phoneInput = page.locator('#phone');
        this.birthdayInput = page.locator('#birthday');
        this.genderSelect = page.locator('#gender');
        this.registerBtn = page.getByRole('button', { name: 'Đăng ký' });
    }

    async open(): Promise<void> {
        await this.goto();
        await this.header.openRegisterModal();
    }

    async fillBirthday(birthday: string): Promise<void> {
        await this.birthdayInput.click();
        await this.birthdayInput.fill(birthday);
        // ấn phím enter trên bàn phím
        await this.birthdayInput.press('Enter');
    }

    async selectGender(gender: string): Promise<void> {
        await this.genderSelect.click();
        await this.page.locator('.ant-select-dropdown').getByTitle(gender).click();
    }

    async fillForm(data: RegisterData): Promise<void> {
        await this.nameInput.fill(data.name)
        await this.emailInput.fill(data.email)
        await this.passwordInput.fill(data.password)
        await this.phoneInput.fill(data.phone)
        await this.fillBirthday(data.birthday)
        await this.selectGender(data.gender)
        await this.registerBtn.click()
    }
}