# Bulk Action Platform

## Overview
The Bulk Action Platform is designed to streamline and automate bulk operations across various systems. This platform provides a user-friendly interface and robust backend to handle large-scale actions efficiently.

## Features
- **User-friendly Interface**: Easy to navigate and perform bulk actions.
- **Scalability**: Capable of handling large volumes of data and actions.
- **Automation**: Automates repetitive tasks to save time and reduce errors.
- **Integration**: Seamlessly integrates with various systems and APIs.

## Installation
To install the Bulk Action Platform, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/hy-25/bulk-action-platform.git
    ```
2. Navigate to the project directory:
    ```bash
    cd bulk-action-platform
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Usage
To start the platform, run the following command:
```bash
npm run dev
```
This will launch the application on `http://localhost:3000`.

## API Documentation
The Bulk Action Platform provides a comprehensive API to interact with the system. Below is the postman collection containing endpoints:

[Postman Collection](https://api.postman.com/collections/31935989-e87de680-3edb-4953-9a84-d2a2f5f6f3c6?access_key=PMAT-01JN5RXYGGZ9NHN0CQN5TQDNSV)

## Database Setup
The platform requires SQL and Redis databases. Follow these steps to set them up:

### SQL Database
1. Install a SQL database (e.g., MySql).
2. Create a new database and user.
3. Update the database configuration in `.env` as DATABASE_URL.

### Redis
1. Install Redis.
2. Start the Redis server.
3. Update the Redis configuration in `.env` as REDIS_URL.


## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.




