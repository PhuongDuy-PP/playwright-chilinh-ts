import { faker } from '@faker-js/faker'
import { APIRequestContext, APIResponse } from '@playwright/test'

export const API_URL = "https://airbnbnew.cybersoft.edu.vn"
export const TOKEN_CYBERSOFT = process.env.TOKEN_CYBERSOFT ?? ''

// define schema response của tất cả API
// statusCode, message (nếu có), content, dateTime
export interface ApiBody<T = any> {
    statusCode: number
    message?: string
    content: T
    dateTime: string
}

// vì response trả về có dạng chuỗi json, nên cần parse về object trước khi dùng
export const json = async <T = any>(response: APIResponse): Promise<ApiBody<T>> => {
    const data = await response.json();
    return data;
};

// để tạo dữ liệu mock cho việc booking phòng nghỉ
// API buildBooking
// API buildComment
// API buildUser
// API removeBooking
// API getBooking

const tag = () => `apitest-${Date.now()}-${faker.string.alphanumeric(5)}`

// Record<string, unknown> => object có key là string, value là unknown
export const buildRoom = (overrides: Record<string, unknown> = {}) => {
    return {
        // tên phòng dùng faker để tạo dữ liệu ngẫu nhiên để tránh trùng lặp dữ liệu
        tenPhong: `Room ${tag()}`,
        khach: 3,
        phongNgu: 2,
        giuong: 2,
        phongTam: 1,
        moTa: "Dữ liệu mock cho việc test",
        giaTien: 100,
        mayGiat: true,
        banLa: true,
        tivi: true,
        dieuHoa: true,
        wifi: true,
        bep: true,
        doXe: true,
        hoBoi: true,
        banUi: true,
        maViTri: 1,
        hinhAnh: "",
        ...overrides
    }
}

export const signin = async (api: APIRequestContext, email: string, password: string) => {
    const res = await api.post('/api/auth/signin', { data: { email, password } })
    const body = await json(res)
    return {
        status: res.status(),
        token: body.content?.token as string,
        user: body.content?.user as any
    }
}

export const getBooking = async (api: APIRequestContext, userId: number, roomId: number) => {
    const res = await api.get(`/api/dat-phong/lay-theo-nguoi-dung/${userId}`)
    const content = (await json(res)).content

    // filter để lấy booking vừa được tạo
    return content.filter((booking: any) => booking.maPhong === roomId)
}