import { faker } from "@faker-js/faker";

export const validUser = {
    email: process.env.TEST_EMAIL ?? '',
    password: process.env.TEST_PASSWORD ?? ''
}

export const invalidUser = {
    email: "wrongEmail",
    password: "wrongPassword"
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender: 'Nam' | 'Nữ';
}

export const generateRegisterData = (): RegisterData => {
    const birthday = faker.date.birthdate({ min: 18, max: 65, mode: 'age' })
    const dd = String(birthday.getDate()).padStart(2, '0');
    const mm = String(birthday.getMonth() + 1).padStart(2, '0');
    const yyyy = birthday.getFullYear();

    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        phone: `09${faker.string.numeric(8)}`,
        birthday: `${dd}/${mm}/${yyyy}`,
        gender: faker.helpers.arrayElement(['Nam', 'Nữ']) as 'Nam' | 'Nữ'
    }
}