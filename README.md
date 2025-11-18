# Facebook Ads Monitoring & Control Dashboard

A production-grade Facebook Ads monitoring and control dashboard built with Next.js 15, TypeScript, and TailwindCSS. Features real-time data synchronization, campaign management, and comprehensive analytics.

## Features

- 🔐 **Secure Authentication**: Hardcoded admin accounts with JWT-based session management
- 📊 **Real-time Dashboard**: Auto-refreshing account metrics and campaign data
- 🎯 **Campaign Control**: Pause/activate individual campaigns or bulk pause all campaigns
- 🔄 **Auto-sync**: Automatic data synchronization every 10 seconds
- 📱 **Responsive Design**: Mobile-first design with touch-friendly interface
- 🎨 **Modern UI**: Built with shadcn/ui components and TailwindCSS
- 🧪 **Simulation Mode**: Test with fake data without Facebook API
- 🔌 **Facebook Integration**: Full Facebook Marketing API support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, SWR
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: SQLite (development), configurable for production
- **UI Components**: shadcn/ui with Radix UI primitives
- **Authentication**: JWT with HTTP-only cookies
- **API Integration**: Facebook Marketing API

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd facebook-ads-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure your environment**
   Edit `.env` file with your settings:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # Authentication
   JWT_SECRET="your-secret-key-change-in-production"

   # Environment Mode (simulation or production)
   APP_ENV="simulation"

   # Facebook API (only needed in production)
   FACEBOOK_ACCESS_TOKEN="your-facebook-access-token"
   FACEBOOK_BUSINESS_ID="your-facebook-business-id"
   ```

5. **Initialize the database**
   ```bash
   npm run db:push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Environment Modes

### Simulation Mode (Default)

Set `APP_ENV="simulation"` in your `.env` file to enable simulation mode:

- ✅ No Facebook API required
- ✅ Generates realistic fake data
- ✅ Perfect for development and testing
- ✅ All UI features work normally

### Production Mode

Set `APP_ENV="production"` to use real Facebook data:

- Requires Facebook System User Token
- Requires Facebook Business Manager ID
- Connects to actual Facebook Ad Accounts
- Real campaign control functionality

## Authentication

The dashboard uses hardcoded admin accounts (no user registration):

| Username | Password |
|----------|----------|
| `snafu`  | `random@123` |
| `sid`    | `random@1234` |

Both accounts have full administrative privileges.

## API Endpoints

### Authentication
- `POST /api/login` - Authenticate user and set session cookie
- `POST /api/logout` - Clear session cookie

### Accounts
- `GET /api/accounts` - Get all ad accounts with latest metrics
- `GET /api/accounts/[id]` - Get account details and campaigns
- `POST /api/accounts/[id]/pause-all` - Pause all campaigns in account

### Campaigns
- `POST /api/campaigns/[id]/set-status` - Set campaign status (ACTIVE/PAUSED)

### Sync
- `POST /api/sync` - Manual data synchronization

## Database Schema

The application uses the following main entities:

- **Vendors**: Ad account vendors/clients
- **AdAccounts**: Facebook ad accounts
- **AccountMetrics**: Daily performance metrics
- **AccountActions**: Audit log for all actions

## Facebook API Setup

### Prerequisites

1. Facebook Business Manager account
2. System User with appropriate permissions
3. Access token with required scopes

### Required Permissions

Your System User needs these permissions:
- `ads_management`
- `ads_read`
- `business_management`
- `pages_show_list`

### Getting Your Credentials

1. Create a System User in Facebook Business Manager
2. Assign the System User to your ad accounts
3. Generate an access token with the required scopes
4. Get your Business Manager ID from Business Settings

## Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard:
   ```
   DATABASE_URL=your-production-database-url
   JWT_SECRET=your-secure-jwt-secret
   APP_ENV=production
   FACEBOOK_ACCESS_TOKEN=your-facebook-token
   FACEBOOK_BUSINESS_ID=your-business-id
   ```
3. **Deploy** - Vercel will automatically build and deploy

### Setting up Cron Jobs

For automatic data synchronization, set up a Vercel Cron Job:

1. Create `vercel.json`:
   ```json
   {
     "crons": [
       {
         "path": "/api/sync",
         "schedule": "*/5 * * * *"
       }
     ]
   }
   ```

2. Deploy to Vercel
3. Enable cron jobs in Vercel dashboard

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database

### Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/              # shadcn/ui components
│   ├── AccountCard.tsx  # Account card component
│   └── CampaignPanel.tsx # Campaign management panel
└── lib/                 # Utility libraries
    ├── auth.ts          # Authentication utilities
    ├── facebook.ts      # Facebook API client
    ├── simulation.ts    # Simulation layer
    └── db.ts           # Database client
```

## Features in Detail

### Dashboard

- **Overview Cards**: Total accounts, active accounts, total spend, total clicks
- **Account Grid**: Responsive grid showing all ad accounts with metrics
- **Real-time Updates**: Auto-refresh every 10 seconds using SWR
- **Status Indicators**: Color-coded status badges (red for problematic accounts)

### Account Cards

Each account card displays:
- Account name and vendor
- Status badge with color coding
- Today's metrics: spend, spend cap, clicks, CPC, balance, impressions
- Account ID with copy functionality
- Last updated timestamp
- Red background for disabled/unsettled accounts

### Campaign Management

- **Campaign List**: View all campaigns for selected account
- **Individual Control**: Pause/activate single campaigns
- **Bulk Actions**: Pause all active campaigns at once
- **Real-time Status**: Live campaign status updates
- **Audit Trail**: All actions are logged for accountability

### Security Features

- **Session Management**: HTTP-only, secure cookies
- **Route Protection**: Middleware protects all routes except login
- **Audit Logging**: All actions tracked with user attribution
- **CSRF Protection**: Built-in Next.js CSRF protection

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure `DATABASE_URL` is correctly set
   - Run `npm run db:push` to initialize schema

2. **Facebook API Errors**
   - Verify access token is valid and not expired
   - Check System User permissions
   - Ensure Business Manager ID is correct

3. **Authentication Issues**
   - Clear browser cookies
   - Verify JWT_SECRET is set
   - Check middleware configuration

4. **Sync Not Working**
   - Check environment mode (simulation vs production)
   - Verify API credentials in production mode
   - Check browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation for Facebook Marketing API