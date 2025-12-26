# FlowvaHub Rewards Hub (Technical Assessment)

This project recreates the Rewards Hub feature of FlowvaHub as part of the React Developer technical assessment. The focus is on accurate UI reproduction, real Supabase integration, clean React architecture, and proper handling of application states.

##  Live Demo

**Live URL:** [https://flowvahub-rewards-jade.vercel.app/](https://flowvahub-rewards-jade.vercel.app/)

## 🛠 Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Vanilla CSS (no external UI libraries)
- **Backend & Database:** [Supabase](https://supabase.com)
- **Authentication:** Supabase Auth
- **Data Access:** Supabase Client SDK

##  Features Implemented

- **Authentication:** Full email/password login using Supabase Auth.
- **Protected Routes:** Auth-gated Rewards Hub.
- **Points System:** Dynamic points balance display fetched from the user profile.
- **Earn Tab:**
  - Daily check-in logic with date-based validation.
  - "Earn more" action items with simulated states.
- **Redeem Tab:**
  - Rewards fetched dynamically from the database.
  - Support for locked, unlocked, and "coming soon" states.
  - Redemption logic that deducts points and records the transaction.
- **UX/UI:**
  - Skeleton loaders for better perceived performance.
  - Comprehensive loading, empty, and error states.
  - Hover elevations and interactive feedback.
  - Clean, modular component architecture.

##  Project Structure (High Level)

```text
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Shared dashboard layout components
│   └── rewards/       # Rewards-specific tabs and items
├── layout/            # Main application layout wrappers
├── lib/               # Utilities and Supabase client configuration
│   ├── supabase.ts
│   ├── profile.ts
│   └── rewards.ts
├── pages/             # Page-level components
│   └── RewardsDashboard.tsx
├── App.tsx            # Root component and routing
└── main.tsx           # Entry point
```

## Supabase Setup

### 1. Create a Supabase Project
- Go to [https://supabase.com](https://supabase.com)
- Create a new project.
- Copy your **Project URL** and **Anon Public Key**.

### 2. Environment Variables
Create a `.env` file in the project root and add your credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Tables
Run the following SQL in the Supabase SQL editor to set up the schema:

```sql
-- Profiles table to store user points
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  points integer default 0,
  created_at timestamp with time zone default now()
);

-- Rewards table for available items
create table rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  points_required integer not null,
  status text not null, -- 'active', 'coming-soon', etc.
  created_at timestamp with time zone default now()
);

-- Daily check-ins table to track streaks/daily claims
create table daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  checkin_date date not null,
  created_at timestamp with time zone default now(),
  unique (user_id, checkin_date)
);

-- Redemptions table to track history
create table redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  reward_id uuid references rewards(id),
  created_at timestamp with time zone default now()
);
```

## Running the Project Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The app will run at [http://localhost:5173](http://localhost:5173).

##  Authentication Flow

1. Users must be signed in to access the Rewards Hub.
2. If no active session exists, users are redirected to the authentication screen.
3. Authentication is handled via Supabase Auth (Email/Password).
4. On first login, a profile record is automatically created if it doesn't exist.

##  Data Flow

- **Session Management:** User session is retrieved from Supabase Auth.
- **Profile Data:** Points are fetched from the `profiles` table.
- **Rewards Listing:** Available rewards are fetched from the `rewards` table.
- **Mutations:** Daily check-ins and redemptions write directly to their respective tables.
- **Sync:** UI updates immediately following successful server mutations.

##  Assumptions & Trade-offs

- **Security:** Row Level Security (RLS) was disabled during development to prioritize core feature delivery.
- **Referrals:** Referral logic is visually implemented but does not handle server-side tracking.
- **Payouts:** Reward redemptions are simulated records and do not trigger external webhooks.
- **State Management:** Used React's built-in `useState` and `useEffect` as the scope did not necessitate heavier libraries like Redux or React Query.

## Notes

- No external UI libraries (Shadcn, Tailwind, etc.) were used to ensure pixel-perfect control over the design.
- Skeleton loaders are used instead of generic spinners for a premium feel.
- Toast notifications provide feedback for user-triggered actions.

## Submission
- **GitHub Repository:** [https://github.com/baniex/flowvahub-rewards](https://github.com/baniex/flowvahub-rewards)
- **Live Deployment:** [https://flowvahub-rewards-jade.vercel.app/](https://flowvahub-rewards-jade.vercel.app/)