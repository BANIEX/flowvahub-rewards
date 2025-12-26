FlowvaHub Rewards Hub (Technical Assessment)

This project recreates the Rewards Hub feature of FlowvaHub as part of the React Developer technical assessment. The focus is on accurate UI reproduction, real Supabase integration, clean React architecture, and proper handling of application states.

Live Demo

Live URL:
<PASTE_DEPLOYED_URL_HERE>

Tech Stack

Frontend: React (Vite)

Styling: Plain CSS

Backend & Database: Supabase

Authentication: Supabase Auth

Data Access: Supabase client (no custom backend)

Features Implemented

Supabase email/password authentication

Protected Rewards Hub (auth-gated)

Earn Points tab

Points balance display

Daily check-in logic

Earn-more actions

Redeem Rewards tab

Rewards fetched from Supabase

Locked / unlocked / coming-soon states

Reward redemption logic

Skeleton loaders during data fetching

Proper loading, empty, and error states

Hover elevation and disabled UI states

Clean component separation

Project Structure (High Level)
src/
├── components/
│   ├── dashboard/
│   ├── rewards/
│   ├── auth/
├── layout/
├── lib/
│   ├── supabase.ts
│   ├── profile.ts
│   ├── rewards.ts
├── pages/
│   ├── RewardsDashboard.tsx
├── App.tsx
└── main.tsx

Supabase Setup
1. Create a Supabase Project

Go to https://supabase.com

Create a new project

Copy the Project URL and Anon Public Key

2. Environment Variables

Create a .env file in the project root:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

3. Database Tables

Run the following SQL in the Supabase SQL editor:

-- Profiles table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  points integer default 0,
  created_at timestamp default now()
);

-- Rewards table
create table rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  points_required integer not null,
  status text not null,
  created_at timestamp default now()
);

-- Daily check-ins table
create table daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  checkin_date date not null,
  created_at timestamp default now(),
  unique (user_id, checkin_date)
);

-- Redemptions table
create table redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  reward_id uuid references rewards(id),
  created_at timestamp default now()
);

Running the Project Locally
npm install
npm run dev


The app will run at http://localhost:5173.

Authentication Flow

Users must be signed in to access the Rewards Hub.

If no active session exists, users are redirected to a simple authentication screen.

Authentication is handled entirely via Supabase Auth.

On first login, a profile row is created from the frontend if it does not exist.

Data Flow

User session is retrieved from Supabase Auth.

Profile data (points) is fetched from the profiles table.

Rewards are fetched from the rewards table.

Daily check-ins and reward redemptions write directly to Supabase.

UI updates immediately after successful mutations.

Assumptions & Trade-offs

Row Level Security (RLS) was intentionally disabled during development to focus on core functionality and speed of delivery.

Referral logic is visually represented but does not implement a full referral tracking system.

Rewards payout effects are simulated and do not trigger real-world actions.

React Query or global state management libraries were not used, as the feature scope did not require them.

Notes

No external UI libraries or design systems were used to allow full control over visual accuracy.

Skeleton loaders are used instead of spinners for better perceived performance.

Toast notifications are shown only for user-triggered actions (e.g. claiming points, redeeming rewards).

Submission

GitHub repository: <PASTE_GITHUB_REPO_URL>

Live deployment: <PASTE_DEPLOYED_URL_HERE>