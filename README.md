# Fullstack App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Description

The Fullstack App is a web application designed to manage customer data. It provides a user-friendly interface for viewing, adding, updating, and deleting customer records. The app is built using Next.js for the frontend and MySQL for the backend database, ensuring a seamless and efficient user experience. The application is styled using Tailwind CSS, offering a modern and responsive design.

## Getting Started

### Database Setup

1. Copy the `.env_example` file to `.env` and fill in the environment variables:

```bash
cp .env_example .env
```

2. Run the Docker container:

```bash
docker compose up -d
```

3. Run the development server:  

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Scripts

- **dev**: Runs the Next.js development server.
- **build**: Builds the application for production.
- **start**: Starts the Next.js production server.
- **lint**: Runs the linter.

## Dependencies

- **next**: ^14.0.0
- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **mysql2**: ^3.2.0
- **sqlite**: ^5.0.1
- **sqlite3**: ^5.1.6

## DevDependencies

- **@types/node**: ^20.0.0
- **@types/react**: ^18.2.0
- **@types/react-dom**: ^18.2.0
- **@types/sqlite3**: ^3.1.11
- **typescript**: ^5.0.0
- **autoprefixer**: ^10.0.0
- **postcss**: ^8.0.0
- **tailwindcss**: ^3.0.0

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
