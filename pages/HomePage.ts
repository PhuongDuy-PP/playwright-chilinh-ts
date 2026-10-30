import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
    // 3 ô của thanh tìm kiếm
    readonly locationField: Locator
    readonly dateField: Locator
    readonly guestField: Locator
    readonly searchBtn: Locator

    // popup chọn địa điểm
    readonly locationPopup: Locator

    // popup chọn khách
    readonly guestPopup: Locator
    readonly guestPlusBtn: Locator
    readonly guestMinusBtn: Locator

    // lịch chọn ngày
    readonly calendarMonths: Locator

    constructor(page: Page) {
        super(page)

        this.locationField = page.getByText('Bạn sắp đi đâu?')

        // /......./ => ký hiệu khai báo regex trong javascript
        // ^ => bắt đầu chuỗi
        // \d => một ký tự số từ 0 - 9
        // {2} => xuất hiện đúng 2 lần
        // d{2} => xuất hiện đúng 2 lần
        // \/ => dấu gạch chéo / (vì / là ký tự đặc biệt trong regex nên phải escape bằng \)
        // $ => kết thúc chuỗi
        // dd/mm/yyyy – dd/mm/yyyy
        this.dateField = page.getByText(/^\d{2}\/\d{2}\/\d{4} – \d{2}\/\d{2}\/\d{4}$/)

        this.guestField = page.getByText('Thêm khách')

        // button tìm kiếm
        // role="img" aria-label="search"
        // => getByRole('img', { name: 'search' })
        this.searchBtn = page.getByRole('img', { name: 'search' })

        // do popup địa điểm ko có id để tìm
        // => tìm theo tiêu đề
        // từ heading tìm được => tìm cha gần nhất => locator('..')
        this.locationPopup = page.getByRole('heading', {name: 'Tìm kiếm địa điểm'}).locator('..')

        this.guestPopup = page.getByText('Khách', { exact: true }).locator('..')

        this.guestPlusBtn = this.guestPopup.getByRole('button', {name: '+', exact: true})
        this.guestMinusBtn = this.guestPopup.getByRole('button', {name: '-', exact: true})

        this.calendarMonths = page.locator('.rdrMonth')
    }

    async open(): Promise<void> {
        await this.goto()
    }

    async openGuestPopup(): Promise<void> {
        await this.guestField.click()
    }

    async selectLocation(city: string): Promise<void> {
        await this.locationField.click()
        await this.locationPopup.getByText(city, { exact: true }).click()
    }

    async addGuest(times: number): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.guestPlusBtn.click()
        }
    }

    // tìm tháng theo tiêu đề
    // Oct 31, 2026 
    // click vào ngày bất kỳ => điền vào ô input 
    async clickDay(month: Date, day: number): Promise<void> {
        // dd/mm/yyyy => ngày của EN-US: Oct 31, 2026
        const title = month.toLocaleString('en-US', { month: 'short', year: 'numeric' })
        await this.calendarMonths
                .filter({hasText: title})
                .locator('.rdrDay:not(.rdrDayDisabled)')
                .filter({hasText: new RegExp(`^${day}`)})
                .click()
    }

    async search(): Promise<void> {
        await this.searchBtn.click()
    }

    async selectDateRange(month: Date, fromDay: number, toDay: number): Promise<void> {
        await this.dateField.click()
        await this.clickDay(month, fromDay)
        await this.clickDay(month, toDay)
    }
}