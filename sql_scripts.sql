-- CREATE TABLE [dbo].[users](
-- 	[user_id] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,    
--     [user_name] [varchar](50) NOT NULL UNIQUE,
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

-- CREATE TABLE matches_event_log(
-- 	match_id [int],
--     match_date [date],
--     event_time [time], -- 23:30 
--     minute_in_match [int], -- 13
--     description [varchar](200),
-- 	FOREIGN KEY (match_id) REFERENCES dbo.matches(match_id),
--     PRIMARY KEY(match_id,match_date,event_time),
-- );

-- select * from dbo.matches

-- Deletion

-- select * from dbo.users
-- select * from dbo.user_roles

-- DELETE FROM dbo.user_roles
-- DELETE FROM dbo.users



