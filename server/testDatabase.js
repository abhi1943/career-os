const {
    testDatabaseConnection,
} = require("./config/database");

async function test() {
    const connected =
        await testDatabaseConnection();

    process.exit(
        connected ? 0 : 1
    );
}

test();