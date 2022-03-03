import { Pool } from 'pg';

const connectionString = 'postgres://tficeivy:0AIYiRt2ZKF7PjCNq9y4ya7pTTu0j54p@kashin.db.elephantsql.com/tficeivy';

const db = new Pool({ connectionString });

export default db;
