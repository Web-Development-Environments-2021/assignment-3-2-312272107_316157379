--***************************************************

--Tables
--CREATE
-- CREATE TABLE [dbo].[users](
-- 	[user_id] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,    
--  [username] [varchar](50) NOT NULL UNIQUE,
-- 	[password] [varchar](50) NOT NULL,
-- 	[first_name] [varchar](50) NULL,
-- 	[last_name] [varchar](50) NULL,
-- 	[email] [varchar](50) NULL,
-- 	[profile_pic] [varchar](50) NULL,
--  [last_search] [varchar](50) NULL
-- )




-- CREATE TABLE user_roles(
-- 	user_id int,
--  user_role varchar(30) NOT NULL,
-- 	FOREIGN KEY (user_id) REFERENCES dbo.users(user_id),
--     PRIMARY KEY(user_id,user_role),
-- );



-- CREATE TABLE [dbo].[matches](
-- 	[match_id] [int] PRIMARY KEY IDENTITY(1,1),    
--     [match_date_time] [datetime] NOT NULL,
-- 	[home_team] [varchar](50) NOT NULL,
-- 	[away_team] [varchar](50) NOT NULL,
-- 	[venue] [varchar](50) NOT NULL,
-- 	[home_team_goals] [int] NULL,
-- 	[away_team_goals] [int] NULL,
--     [referee_id] [int] NOT NULL,
--     [is_over] [bit] NOT NULL,
--     [stage] [varchar](30) NULL,

-- );


-- CREATE TABLE dbo.matches_event_log(
-- 	   match_id [int],
--     event_date_time [datetime], 
--     minute_in_game [int], 
--     event_type [varchar](20), 
--     description [varchar](200),
-- 	FOREIGN KEY (match_id) REFERENCES dbo.matches(match_id),
--     PRIMARY KEY(match_id,event_date_time),
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


--***************************************************

-- Deletion
-- DELETE FROM dbo.user_roles
-- DELETE FROM dbo.users
-- DELETE FROM dbo.matches
-- DELETE FROM dbo.matches_event_log
-- DELETE FROM dbo.favorite_matches


-- Drop Table dbo.matches_event_log 
-- DROP TABLE dbo.users;
-- DROP TABLE dbo.favorite_matches;
-- DROP TABLE dbo.user_roles;
-- Drop Table dbo.matches;
--*************************************************** 

-- update matches SET is_over=0 WHERE match_id=7;
-- select * from matches 
-- delete from matches_event_log
    





