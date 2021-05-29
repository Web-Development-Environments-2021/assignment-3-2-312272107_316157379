--***************************************************

--Tables
-- CREATE TABLE [dbo].[users](
-- 	[user_id] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,    
--     [username] [varchar](50) NOT NULL UNIQUE,
-- 	[password] [varchar](50) NOT NULL,
-- 	[first_name] [varchar](50) NULL,
-- 	[last_name] [varchar](50) NULL,
-- 	[email] [varchar](50) NULL,
-- 	[profile_pic] [varchar](50) NULL,
-- )

-- CREATE TABLE user_roles(
-- 	user_id int,
--     role varchar(30) NOT NULL,
-- 	FOREIGN KEY (user_id) REFERENCES dbo.users(user_id),
--     PRIMARY KEY(user_id,role),
-- );

-- CREATE TABLE [dbo].[matches](
-- 	[match_id] [int] PRIMARY KEY IDENTITY(1,1),    
--     [match_date] [date] NOT NULL,
-- 	[hour] [time] NOT NULL,
-- 	[home_team] [varchar](50) NOT NULL,
-- 	[away_team] [varchar](50) NOT NULL,
-- 	[venue] [varchar](50) NOT NULL,
-- 	[score] [varchar](50) NULL, 
-- )

-- CREATE TABLE dbo.matches_event_log(
-- 	   match_id [int],
--     event_date [date], --1992-11-23
--     event_time [time], -- 23:30:13
--     minute_in_game [int], -- 13
--     event_type [varchar](20), 
--     description [varchar](200),
-- 	FOREIGN KEY (match_id) REFERENCES dbo.matches(match_id),
--     PRIMARY KEY(match_id,event_date,event_time),
-- );


-- CREATE TABLE dbo.favorite_matches(
--     user_id [int],
--     match_id [int],
-- 	FOREIGN KEY (user_id) REFERENCES dbo.users(user_id),
--     FOREIGN KEY (match_id) REFERENCES dbo.matches(match_id),
--     PRIMARY KEY(user_id,match_id),
-- );
-- CREATE TABLE dbo.favorite_teams(
--     user_id [int],
--     team_id [int],
-- 	FOREIGN KEY (user_id) REFERENCES dbo.users(user_id),
--     PRIMARY KEY(user_id,team_id),
-- );
-- CREATE TABLE dbo.favorite_players(
--     user_id [int],
--     player_id [int],
-- 	FOREIGN KEY (user_id) REFERENCES dbo.users(user_id),
--     PRIMARY KEY(user_id,player_id),
-- );


--***************************************************

-- Selection
-- select * from dbo.matches
-- select * from dbo.users
-- select * from dbo.user_roles
-- select * from dbo.matches_event_log

-- SELECt * FROM dbo.matches WHERE match_id IN ('[8,9].join(',')');

-- SELECT TOP 1 *
-- FROM dbo.matches
-- WHERE dbo.matches.match_date > (SELECT CAST( GETDATE() AS Date ))
-- ORDER BY dbo.matches.match_date ASC


--***************************************************

-- Deletion
-- DELETE FROM dbo.user_roles
-- DELETE FROM dbo.users
-- DELETE FROM dbo.matches
-- DELETE FROM dbo.matches_event_log
-- DELETE FROM dbo.favorite_matches


-- Drop Table dbo.matches_event_log 

--***************************************************


-- INSERT INTO dbo.favorite_matches
-- VALUES (10,8)
