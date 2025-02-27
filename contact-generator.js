const fs = require('fs');
const faker = require('faker');

function generateContactsCsv(filename = "contacts.csv", numRecords = 1000) {
    const fieldnames = ["name", "email", "age"];
    const rows = [fieldnames.join(",")];

    for (let i = 0; i < numRecords; i++) {
        const name = faker.name.findName();
        const email = faker.internet.email();
        const age = Math.floor(Math.random() * (80 - 18 + 1)) + 18;
        rows.push([name, email, age].join(","));
    }

    fs.writeFileSync(filename, rows.join("\n"), "utf8");
    console.log(`CSV file '${filename}' with ${numRecords} records created successfully.`);
}

generateContactsCsv();
