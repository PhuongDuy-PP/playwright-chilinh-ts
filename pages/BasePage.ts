import { Locator, Page } from "@playwright/test";
import { HeaderComponent } from "./components/HeaderComponent";

export abstract class BasePage {
    readonly header: HeaderComponent;

    // readonly notification: Locator;

    constructor(protected readonly page: Page) {
        this.header = new HeaderComponent(page);
    }

    async goto(path = '/'): Promise<void> {
        await this.page.goto(path);
    }

    getCurrentUrl(): string {
        return this.page.url();
    }
}