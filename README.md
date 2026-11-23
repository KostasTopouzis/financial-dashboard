# Acme Financial Dashboard v0.1.2

The Acme dashboard is a freelancer dashboard app that in its final version will allow users to create an account, log in and view their data in their own personal workspace. 

## New Features

v0.1.2 makes no visible changes to the app:

- The dashboard pages now always load their data from the database when they are opened, instead of using a copy made when the app was built.
- The app can now be built without a database connection, so the GitHub Actions workflow no longer needs any database credentials.

## Project History 

After completing the Next.js App Router financial dashboard tutorial I sadly realized that it left the app in an incomplete and unsatisfactory state. Originally, I thought of creating a new, more modern dashboard application from scratch. After some thought though, I decided to grab the opportunity to refactor the already existing project in order to modernize its styling, give a more unique character to its brand name and logo presentation, and add extra functionality not implemented in the tutorial project itself. That would not only give me the chance to better internalize and review everything I had learned, but also work in a simulation of real working conditions, where it would often be necessary to refactor an existing codebase rather than creating one yourself anew.

## Portfolio Project Purpose

This project is a portfolio piece meant to demonstrate the following abilities:

- The ability to thoroughly study and get acquainted with an existing codebase, draw conclusions as to what needs to be improved, and make suggestions therein.
- The ability to refactor an existing project and migrate to different tools without compromising the integrity of the given tech stack.
- The ability to organize a complex, multi-step workflow, by breaking it into pieces and follow them to the end.
- The ability to organize resources efficiently and realistically.
- A good grasp of React and Next.js fundamentals.
- Experience with CI/CD operations, deployment workflows and configuration management.

The app's core functionality as left after completing the tutorial (v0.1.0) was as follows:

- Log in with an email and password. The dashboard is only visible to signed-in users, and users can sign out at any time.
- See an overview of the business at a glance: total collected and pending payments, number of invoices and customers, a revenue chart for the past year, and the latest invoices.
- Browse all invoices in a paginated list and search them by customer name, email, amount, date or status.
- Create new invoices, edit existing ones, and delete those no longer needed. Forms point out missing or invalid information before saving.
- Get a friendly message when something goes wrong or an invoice cannot be found, with the option to try again.
- The Customers page exists only as a placeholder and does not show any data yet.

After the end of the refactoring process, my aim is to present the user with the following functionality:

- Sign up for an account and get a personal workspace. Each user sees and manages only their own customers and invoices.
- Try the app straight away with a ready-made demo account, without having to sign up.
- Give invoices a due date. Unpaid invoices past their due date are automatically shown as overdue.
- Mark an invoice as paid with a single click.
- See at a glance who owes money and how late the payment is, grouped into 0–30, 31–60 and 60+ days overdue.
- View a revenue chart based on the payments actually received, and narrow it down to the last 30 days, the last quarter or the last year.

![Acme Dashboard home page](/public/home-page.png)

## Tech Stack

- ![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
- ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
- ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
- ![Auth.js](https://img.shields.io/badge/Auth.js-5_beta-7C3AED)
- ![Zod](https://img.shields.io/badge/Zod-3-3E67B1?logo=zod&logoColor=white)
- ![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)
- ![pnpm](https://img.shields.io/badge/pnpm-12-F69220?logo=pnpm&logoColor=white)

## Learning Goals

- improve my experience with data fetching and API requests, and deal with the various problems that arise in the process.
- design better solutions for potential users.
- be able to begin from a basic, generic functionality and gradually provide a more expertized and distinctive application purpose.
- get deeper into React and explore its potential at greater depth.
- get an even more concrete understanding of browser behavior and debugging approaches.
- increase my experience and familiarity with DevOps practices, CI/CD operations, and professional development workflows.

## AI-Assisted Development

Claude Code was used as an AI coding assistant during the development of this project. My learning goals for this project (and, therefore, the skills it is meant to demonstrate) are mostly focused in the following areas:

- overall full-stack design and integration
- implementation of serverless programming patterns
- data fetching from external API sources
- security concerns (authentication, validation, login mechanisms)
- implementation of appropriate business practices

It is impossible in our times to fully separate code written by AI and human hand, but my contribution is more acutely felt in the areas above. For this project then, I take a greater share of responsibility for the code handling API requests, data manipulation/management, general backend logic and DevOps practices. And of course setting up the project and creating its initial template, defining its purpose and requirements, directing design iterations, reviewing generated code and integrating components into the application.

Now, in other areas... well, besides using Claude Code as a general assistant to speed up processes, I particularly used its services for UI design exploration, visual styling, and implementation of frontend components. My usual strategy is to describe the brand/project aimed aesthetic and target audience (`docs/ai/design-directions/brand-character.md`), create or adjust the necessary skills (as found in the relevant `.claude` folder), set up guidelines and then ask it to present me with two or three alternative stylings that I can review and choose from. Then, I may tinker a bit with the code myself to refine them further.

AI-generated code was reviewed and adapted as needed. But the overall responsibility and any possible flaws of the project are mine.

## How to Run

Visit the live site: [https://financial-dashboard-one-bice.vercel.app/](https://financial-dashboard-one-bice.vercel.app/)

### Run locally

You will need Node.js 20.9 or later, [pnpm](https://pnpm.io/) and a PostgreSQL database (for example a free Supabase or Neon database).

1. Clone the repository and install the dependencies:

   ```bash
   git clone https://github.com/KostasTopouzis/financial-dashboard.git
   cd nextjs-dashboard
   pnpm install
   ```

2. Create a `.env` file in the project root with the following variables:

   ```env
   # Connection string of your PostgreSQL database
   POSTGRES_URL=postgres://user:password@host:port/database

   # Secret used to sign login sessions (generate one with: npx auth secret)
   AUTH_SECRET=your-secret

   # Base URL of the app
   AUTH_URL=http://localhost:3000/api/auth
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Fill the database with sample data by visiting [http://localhost:3000/seed](http://localhost:3000/seed) once. This creates the tables and adds sample users, customers, invoices and revenue.

5. Open [http://localhost:3000](http://localhost:3000) and log in with the sample account:

   - Email: `user@nextmail.com`
   - Password: `123456`

To try a production build instead, run `pnpm build` followed by `pnpm start`.

## Insights

Check the docs folder for material concerning this project: bugs that remain to be fixed, areas that still need improvement, the problems I faced during the project's construction, skills I learned or improved, areas I hope to improve in the future, and general realizations or thoughts I had during this project.

## License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is distributed under the MIT License. See the `LICENSE` file for the full text and details.

## How to Reach Me

* You can reach me via the email address on my profile page or through my LinkedIn profile: [Kostas Topouzis | LinkedIn](https://www.linkedin.com/in/kostas-topouzis-03992b410/)
* If you are interested, you can also check my music on my official artist channel. I operate under the name Vayos Avramides: [Vayos Avramides | YouTube](https://www.youtube.com/@vayosavramides). Also, feel free to follow my Facebook channel: [Vayos Avramides | Facebook](https://www.facebook.com/profile.php?id=61594800706567)
