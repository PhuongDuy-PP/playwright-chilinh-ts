import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RoomDetailPage extends BasePage {
    readonly roomCards: Locator
    readonly bookBtn: Locator
    readonly guestPlusBtn: Locator
    readonly guestMinusBtn: Locator
    readonly guestCount: Locator
    readonly notification: Locator
    readonly confirmModal: Locator
    readonly confirmBtn: Locator

    constructor(page: Page) {
        super(page)
        this.roomCards = page.locator('.ant-card')
        this.bookBtn = page.getByRole('button', {name: 'Đặt phòng'})
        // this.bookBtn=page.locator('button:has-text("Đặt phòng")')
        this.guestPlusBtn = page.getByRole('button', {name: '+', exact: true})
        this.guestMinusBtn = page.getByRole('button', {name: '-', exact: true})
        this.guestCount = page.getByText(/^\d+ khách$/)
        this.notification = page.locator('.ant-notification')
        this.confirmModal = page.getByRole('dialog')
        this.confirmBtn = this.confirmModal.getByRole('button', {name: 'Xác nhận'})
    }

    async openRoom(index: number): Promise<void> {
        await this.roomCards.nth(index).click()
    }

    async gotoRoom(id: number): Promise<void> {
        await this.goto(`/room-detail/${id}`)
    }
}