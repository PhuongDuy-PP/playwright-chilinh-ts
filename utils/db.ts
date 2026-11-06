import {Pool} from 'pg'

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

export const query = async <T = any>(sql: string, params: any[] = []): Promise<T[]> =>{
    const {rows} = await pool.query(sql, params)
    return rows
}

export const closeDb = () => pool.end()