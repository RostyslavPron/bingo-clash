create table profiles (
    id uuid primary key,
    display_name text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table game_sessions (
    id uuid primary key default gen_random_uuid(),
    game_name text not null,
    invite_code text not null unique,
    host_id uuid not null,
    status text not null default 'lobby',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    constraint game_session_status_check
    check (status in ('lobby', 'active', 'paused', 'ended'))
);

create table session_players (
    id uuid primary key default gen_random_uuid(),

    session_id uuid not null
        references game_sessions(id)
        on delete cascade,

    player_id uuid not null,

    display_name text not null,

    is_host boolean not null default false,

    joined_at timestamptz default now(),
    last_seen timestamptz default now()
);





alter table session_players
add constraint unique_player_per_session
unique(session_id, player_id);

create index idx_game_sessions_invite_code
on game_sessions(invite_code);

create index idx_session_players_session_id
on session_players(session_id);

create index idx_session_players_player_id
on session_players(player_id);





alter table profiles enable row level security;
alter table game_sessions enable row level security;
alter table session_players enable row level security;






create policy "profiles_select"
on profiles
for select
using (true);

create policy "profiles_insert"
on profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update"
on profiles
for update
using (auth.uid() = id);