-- TABLES: Users, Books
-- INTERSECTION TABLES: UserBooks (contains wishlist, etc.), UserReviews

DROP PROCEDURE IF EXISTS sp_load_db;
DELIMITER $$
CREATE PROCEDURE sp_load_db()
BEGIN
    SET FOREIGN_KEY_CHECKS=0;

    -- ------------------------------------------
    -- Drop and create Books table
    -- ------------------------------------------
    DROP TABLE IF EXISTS `Books`;
    CREATE TABLE `Books` (
        `bookID` INT NOT NULL AUTO_INCREMENT,
        `title` VARCHAR(255) NOT NULL,
        `authorFirst` VARCHAR(255) NOT NULL,
        `authorLast` VARCHAR(255) NOT NULL,
        `publisher` VARCHAR(255) NULL,
        `publicationDate` DATE NULL,
        `pageCount` INT NULL,
        `isbn` CHAR(17) NOT NULL UNIQUE,
        `genre` VARCHAR(255) NULL,
        `synopsis` TEXT NULL,
        `coverImg` VARCHAR(255) NULL,
        PRIMARY KEY(`bookID`)
    )
    ENGINE = InnoDB;

    -- ------------------------------------------
    -- Drop and create Users table
    -- ------------------------------------------
    DROP TABLE IF EXISTS `Users`;
    CREATE TABLE `Users` (
        `userID` INT NOT NULL AUTO_INCREMENT,
        `firstName` VARCHAR(255) NOT NULL,
        `lastName` VARCHAR(255) NOT NULL,
        `birthdate` DATE NOT NULL,
        `email` VARCHAR(255) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL,
        PRIMARY KEY(`userID`)
    )
    ENGINE = InnoDB;

    -- ------------------------------------------
    -- Drop and create UserBooks table
    -- ------------------------------------------
    DROP TABLE IF EXISTS `UserBooks`;
    CREATE TABLE `UserBooks` (
        `userBookID` INT NOT NULL AUTO_INCREMENT,
        `userID` INT NOT NULL,
        `bookID` INT NOT NULL,
        status ENUM('wishlist', 'reading', 'read') NOT NULL,
        PRIMARY KEY(`userBookID`),
        FOREIGN KEY(`userID`) REFERENCES `Users`(`userID`) ON DELETE CASCADE,
        FOREIGN KEY(`bookID`) REFERENCES `Books`(`bookID`) ON DELETE CASCADE
    )
    ENGINE = InnoDB;

    -- ------------------------------------------
    -- Drop and create UserReviews table
    -- ------------------------------------------
    DROP TABLE IF EXISTS `UserReviews`;
    CREATE TABLE `UserReviews` (
        `reviewID` INT NOT NULL AUTO_INCREMENT,
        `userID` INT NOT NULL,
        `bookID` INT NOT NULL,
        `rating` TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        `reviewText` TEXT NULL,
        PRIMARY KEY(`reviewID`),
        UNIQUE KEY(`userID`, `bookID`),
        FOREIGN KEY(`userID`) REFERENCES `Users`(`userID`) ON DELETE CASCADE,
        FOREIGN KEY(`bookID`) REFERENCES `Books`(`bookID`) ON DELETE CASCADE
    )
    ENGINE=InnoDB

    -- ------------------------------------------
    -- Insert sample books
    -- ------------------------------------------
    INSERT INTO Books (title, authorFirst, authorLast, publisher, publicationDate, pageCount, isbn, genre, synopsis, coverImg)
    VALUES 
    ('Wise Man''s Fear', 'Patrick', 'Rothfuss', 'DAW Books', '2011-03-01', 994, '9780756404734', 'Fantasy', 'The second book in the Kingkiller Chronicle, following Kvothe''s journey as he hones his skills in magic, music, and survival, exploring dangerous lands and complex relationships while seeking knowledge and vengeance.', 'uploads/wise-mans-fear.png'),
    ('Meditations', 'Marcus', 'Aurelius', 'CreateSpace Independent', '2016-11-07', 194, '9781539952299', 'Philosophy', 'A collection of personal reflections by the Roman emperor, offering timeless insights on self-discipline, virtue, and how to live a thoughtful and ethical life.', 'uploads/meditations.png'),
    ('One Hundred Years of Solitude', 'Gabriel Garcia', 'Marquez', 'Harper Perennial', '2006-02-21', 417, '9780060883287', 'Magical Realism', 'A multi-generational saga of the Buendía family in the mythical town of Macondo, blending magical realism with history, love, and human folly.', 'uploads/100-years-of-solitude.png'),
    ('Dungeon Crawler Carl', 'Matt', 'Dinniman', 'Ace', '2024-08-27', 464, '9780593820247', 'Fantasy', 'A darkly comedic and action-packed sci-fi/fantasy story about Carl navigating a deadly, game-like dungeon in a post-apocalyptic world alongside an unlikely companion.', 'uploads/dungeon-crawler-carl.png'),
    ('Stoner', 'John', 'Williams', 'NYRB Classics', '2006-06-20', 288, '9781590171998', 'Classics', 'A quiet, deeply human portrait of William Stoner, a university professor, chronicling his work, relationships, and inner life in mid-20th-century America.', 'uploads/stoner.png'),
    ('Slaughterhouse-Five', 'Kurt', 'Vonnegut', 'Dial Press Trade', '1999-01-12', 288, '9780385333849', 'Literary Fiction', 'A satirical, time-jumping tale of Billy Pilgrim, a soldier who becomes “unstuck in time,” reflecting on war, trauma, and the absurdity of human existence.', 'uploads/slaughterhouse-five.png'),
    ('Intermezzo', 'Sally', 'Rooney', 'Farrar', '2024-09-24', 464, '9780374602635', 'Literary Fiction', 'Generally, Intermezzo refers to short, reflective, or lyrical writings, often exploring moments of personal insight, emotion, or brief episodes of life.', 'uploads/intermezzo.png'),
    ('Gravity''s Rainbow', 'Thomas', 'Pynchon', 'Penguin', '2012-06-13', 776, '9780143039945', 'Literary Fiction', 'A sprawling, complex, and darkly comedic novel set at the end of World War II, exploring science, paranoia, and the mysterious V-2 rocket in postwar Europe.', 'uploads/gravitys-rainbow.png'),
    ('Blood Meridian', 'Cormac', 'McCarthy', 'Vintage', '1992-05-05', 368, '9780679728757', 'Literary Fiction', 'A brutal, poetic Western following “the Kid” as he encounters violence and philosophical darkness on the 19th-century American frontier.', 'uploads/blood-meridian.png'),
    ('Ulysses', 'James', 'Joyce', 'Vintage', '1990-06-16', 783, '9780679722762', 'Classics', 'A day-in-the-life epic in Dublin, following Leopold Bloom, exploring ordinary events with extraordinary linguistic experimentation and deep psychological insight.', 'uploads/ulysses.png'),
    ('Moby Dick', 'Herman', 'Melville', 'Penguin', '2002-12-31', 720, '9780142437247', 'Classics', 'Captain Ahab''s obsessive hunt for the white whale, Moby Dick, unfolds alongside rich explorations of whaling, philosophy, and the human spirit.', 'uploads/moby-dick.png');

SET FOREIGN_KEY_CHECKS=1;

END $$
DELIMITER ;