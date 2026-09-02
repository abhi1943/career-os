
// ======================================================
// CareerOS Database Configuration
// ======================================================

const mysql = require("mysql2/promise");

// ======================================================
// LOAD ENVIRONMENT VARIABLES
// ======================================================

require("dotenv").config();

// ======================================================
// DATABASE CONFIGURATION
// ======================================================

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

    // --------------------------------------------------
    // CONNECTION POOL
    // --------------------------------------------------

    waitForConnections: true,

    // Keep the pool small because the hosting database
    // has a limited max_user_connections value.
    connectionLimit: 3,

    // Do not allow an unlimited queue of requests.
    queueLimit: 20,

    // --------------------------------------------------
    // IDLE CONNECTION MANAGEMENT
    // --------------------------------------------------

    // Close idle connections after 30 seconds.
    idleTimeout: 30000,

    // --------------------------------------------------
    // KEEP ALIVE
    // --------------------------------------------------

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
  
