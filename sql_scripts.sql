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
--  [match_date_time] [datetime] NOT NULL,
-- 	[home_team] [varchar](50) NOT NULL,
-- 	[away_team] [varchar](50) NOT NULL,
-- 	[venue] [varchar](50) NOT NULL,
-- 	[score] [varchar](50) NULL,
--  [referee_id] [int] NOT NULL,
--  [is_over] [bit] NOT NULL,
-- [stage] [varchar](30) NOT NULL,
-- );

-- CREATE TABLE dbo.matches_event_log(
-- 	   match_id [int],
--     event_date_time [datetime], 
--     minute_in_game [int], -- 13
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
-- DROP TABLE dbo.users;
-- DROP TABLE dbo.favorite_matches;
-- DROP TABLE dbo.user_roles;
-- Drop Table dbo.matches;
--***************************************************
-- 
-- UPDATE user_roles set user_role='union_representative' where user_id=8;
-- select * from dbo.user_roles where user_id=8 AND user_role='union_rep'; 
-- INSERT INTO dbo.user_roles(user_id,user_role)  VALUES(8,'referee')

-- SELECT user_id  FROM user_roles WHERE user_role = 'referee' AND user_id not in 
-- (SELECT referee_id from matches WHERE
--  CAST(matches.match_date_time As date) = CAST('2012-12-22 03:59:12' As date))
-- SELECT match_id from matches WHERE 
-- ((home_team = 'OB' or away_team= 'ob') or (home_team = 'AGF' or away_team= 'AGF'))  and
-- CAST(matches.match_date_time As date) = CAST('2012-12-22 03:59:12.000' As date)


-- SELECT * from dbo.matches WHERE home_team = 'OB' or away_team= 'OB';

-- SELECT * FROM dbo.matches_event_log WHERE match_id=(SELECT match_id FROM dbo.matches WHERE is_over=1);

-- SELECT matches.*,eventLogs.* 
-- FROM 
-- (SELECT * from dbo.matches WHERE home_team = 'OB' or away_team= 'OB') AS matches
-- LEFT JOIN
-- (SELECT * FROM dbo.matches_event_log WHERE match_id=(SELECT match_id FROM dbo.matches WHERE is_over=1)) AS eventLogs 
-- ON (matches.match_id=eventLogs.match_id);



-- UPDATE matches SET is_over=1 WHERE match_id=2;
-- insert into matches_event_log values(2,'2024-11-18 03:59:12',15,'Goal','Aviachai scored the goal again');
-- select * from matches
-- select * from matches_event_log


-- SELECT * FROM dbo.matches_event_log WHERE match_id IN (SELECT match_id FROM dbo.matches WHERE is_over=1); 

