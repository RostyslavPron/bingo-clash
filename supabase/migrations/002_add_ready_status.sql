alter table session_players
add column if not exists is_ready boolean not null default false;