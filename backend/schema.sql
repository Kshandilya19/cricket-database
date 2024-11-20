-- Disable Foreign Key Checks
CREATE DATABASE cricketdb;

USE cricketdb;

SET foreign_key_checks = 0;

-- Create Team Table
CREATE TABLE Team (
    Team_ID INT AUTO_INCREMENT PRIMARY KEY,
    Team_Name VARCHAR(100) NOT NULL,
    Team_Type ENUM('Domestic', 'International') DEFAULT NULL,
    Captain_ID INT DEFAULT NULL
);

-- Create Player Table
CREATE TABLE Player (
    Player_ID INT AUTO_INCREMENT PRIMARY KEY,
    Player_Name VARCHAR(100) NOT NULL,
    Gender ENUM('M', 'F', 'O') DEFAULT NULL,
    Role VARCHAR(20) NOT NULL,
    DOB DATE DEFAULT NULL,
    Team_ID INT,
    FOREIGN KEY (Team_ID) REFERENCES Team(Team_ID)
);

-- Create other tables as usual
CREATE TABLE Tournament (
    Tournament_ID INT AUTO_INCREMENT PRIMARY KEY,
    Tournament_Name VARCHAR(100) NOT NULL,
    Format ENUM('T20', 'ODI', 'Test') DEFAULT NULL,
    Level ENUM('Local', 'National', 'International') DEFAULT NULL,
    Start_Date DATE DEFAULT NULL,
    End_Date DATE DEFAULT NULL
);

CREATE TABLE Cricket_Match (
    Match_ID INT AUTO_INCREMENT PRIMARY KEY,
    Match_Date DATE NOT NULL,
    Tournament_ID INT,
    Team1_ID INT,
    Team2_ID INT,
    Winner INT DEFAULT NULL,
    Stage VARCHAR(20) DEFAULT NULL,
    FOREIGN KEY (Tournament_ID) REFERENCES Tournament(Tournament_ID),
    FOREIGN KEY (Team1_ID) REFERENCES Team(Team_ID),
    FOREIGN KEY (Team2_ID) REFERENCES Team(Team_ID)
);

CREATE TABLE Batting_Stats (
    Player_ID INT NOT NULL,
    Match_ID INT NOT NULL,
    Runs_Scored INT DEFAULT 0,
    Balls_Faced INT DEFAULT 0,
    Fours INT DEFAULT 0,
    Sixes INT DEFAULT 0,
    PRIMARY KEY (Player_ID, Match_ID),
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID),
    FOREIGN KEY (Match_ID) REFERENCES Cricket_Match(Match_ID)
);

CREATE TABLE Bowling_Stats (
    Player_ID INT NOT NULL,
    Match_ID INT NOT NULL,
    Overs_Bowled INT DEFAULT 0,
    Balls_Bowled INT DEFAULT 0,
    Runs_Conceded INT DEFAULT 0,
    Wickets_Taken INT DEFAULT 0,
    Maiden_Overs INT DEFAULT 0,
    PRIMARY KEY (Player_ID, Match_ID),
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID),
    FOREIGN KEY (Match_ID) REFERENCES Cricket_Match(Match_ID)
);
SET foreign_key_checks = 1;

ALTER TABLE Player
ADD CONSTRAINT fk_player_team
FOREIGN KEY (Team_ID) REFERENCES Team(Team_ID);

ALTER TABLE Team
ADD CONSTRAINT fk_team_captain
FOREIGN KEY (Captain_ID) REFERENCES Player(Player_ID);

ALTER TABLE Cricket_Match
ADD CONSTRAINT fk_cricket_match_tournament
FOREIGN KEY (Tournament_ID) REFERENCES Tournament(Tournament_ID),
ADD CONSTRAINT fk_cricket_match_team1
FOREIGN KEY (Team1_ID) REFERENCES Team(Team_ID),
ADD CONSTRAINT fk_cricket_match_team2
FOREIGN KEY (Team2_ID) REFERENCES Team(Team_ID);

ALTER TABLE Batting_Stats
ADD CONSTRAINT fk_batting_stats_player
FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID),
ADD CONSTRAINT fk_batting_stats_match
FOREIGN KEY (Match_ID) REFERENCES Cricket_Match(Match_ID);

ALTER TABLE Bowling_Stats
ADD CONSTRAINT fk_bowling_stats_player
FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID),
ADD CONSTRAINT fk_bowling_stats_match
FOREIGN KEY (Match_ID) REFERENCES Cricket_Match(Match_ID);

DELIMITER //
CREATE PROCEDURE GetTeamStats (IN team_id INT)
BEGIN
    SELECT
        Team_Name,
        COUNT(DISTINCT Player.Player_ID) AS Player_Count,
        COUNT(DISTINCT Cricket_Match.Match_ID) AS Matches_Played
    FROM Team
    LEFT JOIN Player ON Team.Team_ID = Player.Team_ID
    LEFT JOIN Cricket_Match ON Team.Team_ID IN (Cricket_Match.Team1_ID, Cricket_Match.Team2_ID)
    WHERE Team.Team_ID = team_id
    GROUP BY Team.Team_ID;
END //
DELIMITER ;

-- Trigger: Update check age
DELIMITER $$

CREATE TRIGGER check_player_age_before_insert
BEFORE INSERT ON player
FOR EACH ROW
BEGIN
    -- Declare the player_age variable
    DECLARE player_age INT;
    
    -- If DOB is provided, calculate the age based on Date of Birth
    IF NEW.DOB IS NOT NULL THEN
        SET player_age = TIMESTAMPDIFF(YEAR, NEW.DOB, CURDATE());

        -- Adjust for cases where the player has not yet had their birthday this year
        IF (MONTH(NEW.DOB) > MONTH(CURDATE())) OR (MONTH(NEW.DOB) = MONTH(CURDATE()) AND DAY(NEW.DOB) > DAY(CURDATE())) THEN
            SET player_age = player_age - 1;
        END IF;
        
        -- If the player is under 18, prevent the insertion
        IF player_age < 18 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Player must be 18 years or older to be added.';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Date of Birth (DOB) is required.';
    END IF;
END$$

DELIMITER ;

-- Enable Foreign Key Checks

