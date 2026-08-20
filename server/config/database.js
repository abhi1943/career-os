// ======================================================
// CareerOS Database Configuration
// ======================================================
//
// STEP 20.1 — Persistent Database
//
// Database:
// MySQL
//
// Driver:
// mysql2
//
// Responsibilities:
// - Create MySQL connection pool
// - Reuse database connections
// - Keep database configuration in one place
// - Support async/await queries
//
// ======================================================

const mysql = require("mysql2/promise");

// ======================================================
// LOAD ENVIRONMENT VARIABLES
// ======================================================

require("dotenv").config();

// ======================================================
// DATABASE CONFIGURATION
// ======================================================

console.log("🔍 Database configuration:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
        ? "SET"
        : "NOT SET",
    database: process.env.DB_NAME,
});

const pool = mysql.createPool({
    host:
        process.env.DB_HOST ||
        "localhost",

    port:
        Number(
            process.env.DB_PORT ||
            3306
        ),

    user:
        process.env.DB_USER ||
        "root",

    password:
        process.env.DB_PASSWORD ||
        "",

    database:
        process.env.DB_NAME ||
        "career_os",

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,

    enableKeepAlive: true,

    keepAliveInitialDelay: 0,
});

// ======================================================
// TEST DATABASE CONNECTION
// ======================================================

async function testDatabaseConnection() {
    let connection;

    try {
        connection =
            await pool.getConnection();

        console.log(
            "✅ CareerOS MySQL database connected successfully."
        );

        return true;
    } catch (error) {
        console.error(
            "❌ CareerOS MySQL database connection failed:",
            error.message
        );

        return false;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    pool,
    testDatabaseConnection,
};