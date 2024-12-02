# Database Setup

This folder contains the database schema and instructions for setting up the RideEase database. While the primary database is hosted in the cloud, this setup serves as a backup or for local development in case the cloud database is unavailable.

## Files in This Folder
- **database_schema.sql**: Contains the SQL commands to create the database structure.

## Prerequisites
- PostgreSQL installed locally or access to a PostgreSQL-compatible cloud database.
- Command-line access to `psql` or a database management tool like pgAdmin.

## Setup Instructions

### Option 1: Import Schema (Local Backup)
1. Open your terminal and navigate to this folder:
    ```bash
    cd path/to/project-group_11/doc/sprint2/db
    ```

2. Create a new database:
    ```bash
    createdb rideease_db
    ```

3. Import the schema into the database:
    ```bash
    psql rideease_db < database_schema.sql
    ```

### Option 2: Cloud Database (Primary)
The cloud database is currently in development and will serve as the primary database for RideEase. The connection string for the cloud database will be provided once it is finalized.

---

## Environment Variables
For both local and cloud databases, ensure your `.env` file includes the correct database connection string:

### Example for Local Setup:
```plaintext
DATABASE_URL=postgres://username:password@localhost:5432/rideease_db
```

### Example for Cloud Setup:
```plaintext
DATABASE_URL=postgres://username:password@cloud-hostname:5432/rideease_db
```

