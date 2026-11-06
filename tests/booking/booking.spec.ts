import { expect, test } from "../../fixtures/test-fixtures"
import { validUser } from "../../test-data/user"

const ROOM_ID = 1

test.describe('Booking - Chưa đăng nhập', () => {
    test("Bấm đặt phòng khi chưa đăng nhập thì hiển thị thông báo đăng nhập", async({roomDetailPage}) => {
        await roomDetailPage.gotoRoom(ROOM_ID)
        await roomDetailPage.bookBtn.click()

        await expect(roomDetailPage.notification).toContainText('Vui lòng đăng nhập để tiếp tục đặt phòng.')
    })
})

test.describe('Booking - Đã đăng nhập', () => {
    // trước mỗi test case => login trước
    test.beforeEach(async ({loginPage}) => {
        await loginPage.open()
        await loginPage.login(validUser.email, validUser.password)
        await expect(loginPage.usernameInput).toBeHidden()
    })

    test('Hiển thị đúng thông tin giá của phòng', async ({roomDetailPage, page}) => {
        await roomDetailPage.gotoRoom(ROOM_ID)

        // ngày mặc định là 7 đêm: 28 x 7 = 196, + phí dọn: 8, 204
        await expect(page.getByText('$28 x 7 nights')).toBeVisible()
        await expect(page.getByText('$ 196')).toBeVisible()
        await expect(page.getByText('$ 8')).toBeVisible()
        await expect(page.getByText('204')).toBeVisible()
    })

    test('Số khách: mặc định 1, tăng được nhưng không vượt quá 3 khách', async ({roomDetailPage}) => {
        await roomDetailPage.gotoRoom(ROOM_ID)
        await expect(roomDetailPage.guestCount).toHaveText('1 khách')

        // bấm 5 lần nhưng phòng chỉ chứa 3 khách
        for (let i = 0; i < 5; i++) {
            await roomDetailPage.guestPlusBtn.click()
        }

        await expect(roomDetailPage.guestCount).toHaveText('3 khách')
    })

    test('Số khách không giảm dưới 1 khách', async ({roomDetailPage}) => {
        await roomDetailPage.gotoRoom(ROOM_ID)
        await roomDetailPage.guestMinusBtn.click()

        await expect(roomDetailPage.guestCount).toHaveText('1 khách')
    })

    test('Bấm đặt phòng để hiển thị popup xách nhận đúng ngày và số khách', async ({roomDetailPage}) => {
        await roomDetailPage.gotoRoom(ROOM_ID)
        await roomDetailPage.guestPlusBtn.click()
        await roomDetailPage.bookBtn.click()

        await expect(roomDetailPage.confirmModal).toContainText('Bạn có muốn đặt phòng')
        await expect(roomDetailPage.confirmModal).toContainText('Lượng khách: 02')
        await expect(roomDetailPage.confirmModal).toContainText(/Ngày sử dụng: \d{2}-\d{2}-\d{4} - \d{2}-\d{2}-\d{4}/)
    })
})