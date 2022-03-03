import db from '../db';
import DatabaseError from '../models/errors/database.error.models';
import User from '../models/user.model';

class UserRepository {
    TABLE = 'application_user';

    async findAll(): Promise<User[]> {
        const querySQL = `
            SELECT 
                uuid, username 
            FROM ${this.TABLE}
        `;

        const { rows } = await db.query<User>(querySQL);

        return rows || [];
    }

    async findById(uuid: string): Promise<User> {
        try {
            const querySQL = `
                SELECT 
                    uuid, username 
                FROM ${this.TABLE}
                WHERE uuid = $1
            `;

            const values = [uuid];

            const {
                rows: [user],
            } = await db.query<User>(querySQL, values);

            return user || {};
        } catch (error) {
            console.log(error);

            throw new DatabaseError('Erro na consulta por ID', error);
        }
    }

    async findByUserNameAndPassword(username: string, password: string): Promise<User | null> {
        try {
            const querySQL = `
                SELECT 
                    uuid, username 
                FROM ${this.TABLE}
                WHERE username = $1 AND password = crypt($2, 'my_salt')
            `;

            const values = [username, password];

            const {
                rows: [user],
            } = await db.query<User>(querySQL, values);

            return user || null;
        } catch (error) {
            console.log(error);

            throw new DatabaseError('Erro na consulta por ID', error);
        }
    }

    async create(user: User): Promise<string> {
        const querySQL = `
            INSERT INTO ${this.TABLE} (
                username,
                password
            )
            VALUES (
                $1,
                crypt($2, 'my_salt')
            )
            RETURNING uuid
        `;

        const values = [user.username, user.password];

        const {
            rows: [newUser],
        } = await db.query<{ uuid: string }>(querySQL, values);

        return newUser.uuid;
    }

    async update(user: User): Promise<void> {
        const querySQL = `
            UPDATE ${this.TABLE}
            SET
                username = $1,
                password = crypt($2, 'my_salt')
            WHERE uuid = $3
        `;

        const values = [user.username, user.password, user.uuid];
        await db.query(querySQL, values);
    }

    async remove(uuid: string): Promise<void> {
        const querySQL = `
            DELETE
            FROM ${this.TABLE}
            WHERE uuid = $1
        `;

        const values = [uuid];

        await db.query(querySQL, values);
    }
}

export default new UserRepository();
