// test KHÔNG tự dọn dẹp dữ liệu. Mọi dữ liệu mock đều được ghi vào database
// => fixture để tự xóa dữ liệu theo thứ tự con -> cha
// booking -> comment -> room -> location -> user
// booking/comment tham chiếu tới room/user nên phải xóa trước
import { test as base, request } from "@playwright/test"
import { APIRequestContext } from "@playwright/test"
import { API_URL, buildRoom, json, signin, TOKEN_CYBERSOFT } from "../utils/api-helper"

// vì tạo data room, user,... => cần phải admin
export interface Admin {
    id: number
    email: string
    token: string
}

interface Mock {
    room(overrides?: Record<string, unknown>): Promise<any>
}

type TestFixtures = {
    mock: Mock
}

type WorkerFixtures = {
    api: APIRequestContext,
    admin: Admin
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
    api: [async ({}, use) => {
        // setup môi trường gọi API thông qua playwright
        // setup địa chỉ API: API_URL
        // setup tokenCybersoft: TOKEN_CYBERSOFT
        // => object request của playwright
        const api = await request.newContext({
            baseURL: API_URL,
            extraHTTPHeaders: {
                tokenCybersoft: TOKEN_CYBERSOFT
            }
        })
        // dùng use để truyền api xuống test
        await use(api)
        // dispose api để dọn dẹp bộ nhớ
        await api.dispose()
        // scope: 'worker' => api chỉ tạo 1 lần cho tất cả test, không tạo lại cho từng test
    }, { scope: 'worker' }],

    // setup admin để dùng cho việc tạo dữ liệu mock
    admin: [async ({api}, use) => {
        const {token, user} = await signin(api, process.env.ADMIN_EMAIL ?? '', process.env.ADMIN_PASSWORD ?? '')
        await use({
            id: user.id,
            email: user.email,
            token
        })
    }, { scope: 'worker' }],

    // tạo mock dữ liệu cho việc booking phòng nghỉ
    mock: async ({api, admin}, use) => {
        const headers = {
            token: admin.token,
            tokenCybersoft: TOKEN_CYBERSOFT
        }

        const mock: Mock = {
            async room(overrides) {
                const res = await api.post('/api/phong-thue', {
                    headers,
                    // hàm buildRoom trong api-fixtures.ts sẽ tạo dữ liệu mock room
                    data: buildRoom(overrides)
                })
                const room = (await json(res)).content
                console.log(`Tạo dữ liệu mock room: ${room.tenPhong} (id: ${room.id})`)
                return room
            }
        }
        await use(mock)

        // teardown
        // xóa dữ liệu mock room vừa tạo
        // get Room
        // lấy id của room vừa tạo => gọi API xóa room
        // const roomId = mock.room?.id
        const res = await api.delete(`/api/phong-thue/${mock.room.id}`, {headers})
        // kiểm tra xem xóa dữ liệu mock room có thành công hay không
        console.log(res.status())
        console.log(await res.text())
        if (res.status() === 200) {
            console.log(`Xóa dữ liệu mock room: ${mock.room.tenPhong} (id: ${mock.room.id})`)
        } else {
            console.error(`Xóa dữ liệu mock room thất bại: ${mock.room.tenPhong} (id: ${mock.room.id})`)
        }
    }
})

export { expect } from "@playwright/test"