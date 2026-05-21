# SubTrackr

SubTrackr is a full-stack subscription tracking application for managing recurring payments, monitoring upcoming renewals, tracking monthly budget usage, and organizing subscriptions by category and payment method.

The project includes a modern dashboard, subscription assistant tools, dark/light mode, budget tracking, and automatic service suggestions for popular subscription platforms.

## Features

- User registration and login with JWT authentication
- Add, edit and delete subscriptions
- Manage categories
- Manage payment methods
- Monthly budget tracking
- Dashboard analytics
- Spending by category chart
- Subscriptions by status chart
- Billing cycle breakdown chart
- Upcoming renewals section
- Most expensive subscription insights
- Subscription assistant:
  - Website URL
  - Management URL
  - Cancel guide
  - Planned cancellation date
  - Reminder days before renewal
- Auto-fill subscription details for popular services
- Light and dark mode
- Responsive UI for desktop and mobile

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Recharts

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs

## Project Structure

```txt
subtrackr/
  client/
    app/
    components/
    lib/
    public/
    package.json

  server/
    prisma/
    src/
      config/
      controllers/
      middlewares/
      routes/
    package.json

  docker-compose.yml
  README.md