# Project: metahair

## Project Overview

This is a Next.js e-commerce application for a hair products brand named "metahair". The project is built with Next.js 15, React 19, and TypeScript. It uses MongoDB as the database with Mongoose as the ODM. The application includes features for displaying products, managing a shopping cart, and an admin section for managing products, orders, and other settings. It also integrates with Cloudinary for image storage and Resend for sending emails. The frontend is styled with Tailwind CSS.

The application uses Next.js App Router, with a mix of Server Components for data fetching and Client Components for interactivity. The main page (`app/page.tsx`) is a Server Component that fetches initial data like new arrivals and featured products.

## Building and Running

### Prerequisites

*   Node.js 18+
*   A MongoDB database (local or on MongoDB Atlas)

### Setup & Running

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your MongoDB connection string:
    ```
    MONGODB_URI=your_mongodb_connection_string
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build, run:
```bash
npm run build
```

To start the production server, run:
```bash
npm run start
```

## Development Conventions

*   **Framework:** The project is built on the Next.js framework, utilizing the App Router.
*   **Language:** The codebase is written in TypeScript.
*   **Styling:** Tailwind CSS is used for styling.
*   **Database:** MongoDB is the database, and Mongoose is used as the ODM. Schemas for models like `Product`, `Category`, and `Order` are defined in the `models/` directory.
*   **API:** API routes are created using Route Handlers within the `app/api/` directory.
*   **Components:** Reusable UI components are located in the `components/` directory.
*   **Database Connection:** The database connection is managed in `lib/db.ts` and is cached for performance in a serverless environment.
*   **Environment Variables:** The application relies on environment variables for configuration, such as the database URI. These should be stored in a `.env.local` file for local development.
