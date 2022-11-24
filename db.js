import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "itra_task4",
  password: "root",
  port: 5432,
});

export default pool;
