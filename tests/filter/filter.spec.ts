import {expect, test} from '../../fixtures/test-fixtures'

test.describe('Filter - Địa điểm', () => {
    const cities = [
        {name: 'Hồ Chí Minh', slug: 'ho-chi-minh'},
        {name: 'Hà Nội', slug: 'ha-noi'},
        {name: 'Đà Nẵng', slug: 'da-nang'},
        {name: 'Nha Trang', slug: 'nha-trang'},
        {name: 'Phú Quốc', slug: 'phu-quoc'},
        {name: 'Đà Lạt', slug: 'da-lat'},
        {name: 'Phan Thiết', slug: 'phan-thiet'},
        {name: 'Cần Thơ', slug: 'can-tho'},
    ]

    // dùng for để chạy test cho từng thành phố
    for(const city of cities) {
        test(`Lọc theo địa điểm ${city.name}`, async ({page, homePage}) => {
            await homePage.open()
            await homePage.selectLocation(city.name)

            await expect(homePage.locationField).toBeHidden()

            await homePage.search()

            await expect(page).toHaveURL(new RegExp(`/rooms/${city.slug}`))
        })
    }

    // test("Kết quả hiển thị đúng tên thành phố và có danh sách phòng", async ({homePage, page}) => {
    //     await homePage.open()
    //     await homePage.selectLocation('Hồ Chí Minh')
    //     await homePage.search()

    //     await expect(page.getByText(/Có \d+ chỗ ở tại Hồ Chí Minh/)).toBeVisible()
    // })
})

test.describe('Filter - Số khách', () => {
    test("Mặc định là 1 khách và nút trừ bị disable", async ({homePage}) => {
        await homePage.open()
        await homePage.openGuestPopup()

        await expect(homePage.guestPopup).toContainText('1')
        await expect(homePage.guestMinusBtn).toBeDisabled()
    })

    test("Tăng số khách lên 2 và nút trừ được enable", async ({homePage}) => {
        await homePage.open()
        await homePage.openGuestPopup()
        await homePage.addGuest(3)

        await expect(homePage.guestPopup).toContainText('4')
        await expect(homePage.guestMinusBtn).toBeEnabled()
    })

    test("Tăng 2 khách và giảm 1 khách => còn 2 khách", async ({homePage}) => {
        await homePage.open()
        await homePage.openGuestPopup()
        await homePage.addGuest(2)
        await homePage.guestMinusBtn.click()

        await expect(homePage.guestPopup).toContainText('2')
    })
})

test.describe('Filter - Ngày', () => {
    test("Chọn khoảng ngày phù hợp", async ({homePage}) => {
        // chọn ngày 10->15 của tháng sau để chắc chắn không phải là ngày quá khứ
        const next = new Date()
        next.setMonth(next.getMonth() + 1)
        const mm = String(next.getMonth() + 1).padStart(2, '0')
        const yyyy = next.getFullYear()

        await homePage.open()
        await homePage.selectDateRange(next, 10, 15)

        await expect(homePage.dateField).toHaveText(`10/${mm}/${yyyy} – 15/${mm}/${yyyy}`)

    })
})