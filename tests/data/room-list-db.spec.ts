import { Locator } from "@playwright/test"
import { closeDb, query } from "../../utils/db"
import { test, expect } from "../../fixtures/test-fixtures"

const cities = [
    {name: 'Hồ Chí Minh', slug: 'ho-chi-minh', locationId: 1},
    {name: 'Cần Thơ', slug: 'can-tho', locationId: 2},
    {name: 'Nha Trang', slug: 'nha-trang', locationId: 3},
    {name: 'Hà Nội', slug: 'ha-noi', locationId: 4},
    {name: 'Phú Quốc', slug: 'phu-quoc', locationId: 5},
    {name: 'Đà Nẵng', slug: 'da-nang', locationId: 6},
    {name: 'Phan Thiết', slug: 'phan-thiet', locationId: 8},
    {name: 'Đà Lạt', slug: 'da-lat', locationId: 7}
]

type Room = {
    id?: number,
    name: string,
    guests: number,
    bedrooms: number,
    price: number,
}

const getRoomsFromDB = async (locationId: number): Promise<Room[]> => {
    const rows = await query(`
        SELECT id, ten_phong, khach, phong_ngu, gia_tien
        FROM phong_thue
        WHERE ma_vi_tri = $1
        ORDER BY id`
    , [locationId])

    return rows.map(({id, ten_phong, khach, phong_ngu, gia_tien}) => ({
        id,
        name: ten_phong,
        guests: khach,
        bedrooms: phong_ngu,
        price: Number(gia_tien)
    }))
}

const getRoomsFromUI = async (roomCards: Locator): Promise<Room[]> => {
    const names = await roomCards.locator('p.text-xl').allInnerTexts()

    const guests = await roomCards.locator('p', {hasText: /\d+ khách/}).allInnerTexts()

    const prices = await roomCards.locator('span.font-bold').allInnerTexts()

    return names.map((name, i) => ({
        name,
        guests: Number(guests[i].match(/(\d+) khách/)![1]),
        bedrooms: Number(guests[i].match(/(\d+) phòng ngủ/)![1]),
        price: Number(prices[i].replace(/[^\d.]/g, ''))
    }))
}

const compareRooms = (roomsFromDB: Room[], roomsFromUI: Room[]): string[] => {
    const errors: string[] = []

    // if (roomsFromDB.length !== roomsFromUI.length) errors.push(`Số lượng phòng hiển thị trên UI (${roomsFromUI.length}) không khớp với DB (${roomsFromDB.length})`)
    
    let total = Math.min(roomsFromDB.length, roomsFromUI.length)
    const fields = ['name', 'guests', 'bedrooms', 'price'] as const
    for (let i = 0; i < total; i++) {
        fields.filter((field) => roomsFromUI[i][field] !== roomsFromDB[i][field])
            .forEach((field) => errors.push(`Phòng thứ ${i+1}: ${field} hiển thị trên UI (${roomsFromUI[i][field]}) không khớp với DB (${roomsFromDB[i][field]})`))
    }

    return errors
}

test.afterAll(async () => {
    await closeDb()
})

test.describe("Danh sách phòng; UI và DB", () => {
    // case 1 -> 8: khớp tất cả dữ liệu
    for (const {name, slug, locationId} of cities) {
        test(`Dữ liệu phòng ${name} treen UI khớp với DB`, async ({page, homePage, roomDetailPage}) => {
            await homePage.open()
            await homePage.selectLocation(name)
            await homePage.search()
            await expect(page).toHaveURL(new RegExp(`/rooms/${slug}`))
            await expect(roomDetailPage.roomCards.first()).toBeVisible()

            // B2: đọc các card đang hiển thị trên UI thành mảng Room[]
            const ui = await getRoomsFromUI(roomDetailPage.roomCards)

            // B3: đọc dữ liệu từ DB thành mảng Room[]
            const db = await getRoomsFromDB(locationId)

            expect(compareRooms(db, ui)).toEqual([])
        })
    }
})