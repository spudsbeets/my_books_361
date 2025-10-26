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
    INSERT INTO Books (title, authorFirst, authorLast, publisher, publicationDate, pageCount, isbn, coverImg)
    VALUES 
    ("Wise Man's Fears", "Patrick", "Rothfuss", "DAW Books", "2011-03-01", 994, "9780756404734", "uploads/wise-mans-fear.png"),
    ("Meditations", "Marcus", "Aurelius", "CreateSpace Independent", "2016-11-07", 194, "9781539952299", "uploads/meditations.png"),
    ("One Hundred Years of Solitude", "Gabriel Garcia", "Marquez", "Harper Perennial", "2006-02-21", 417, "9780060883287", "uploads/100-years-of-solitude.png"),
    ("Dungeon Crawler Carl", "Matt", "Dinniman", "Ace", "2024-08-27", 464, "9780593820247", "uploads/dungeon-crawler-carl.png"),
    ("Stoner", "John", "Williams", "NYRB Classics", "2006-06-20", 288, "9781590171998", "uploads/stoner.png"),
    ("Slaughterhouse-Five", "Kurt", "Vonnegut", "Dial Press Trade", "1999-01-12", 288, "9780385333849", "uploads/slaughterhouse-five.png"),
    ("Intermezzo", "Sally", "Rooney", "Farrar", "2024-09-24", 464, "9780374602635", "uploads/intermezzo.png"),
    ("Gravity's Rainbow", "Thomas", "Pynchon", "Penguin", "2012-06-13", 776, "9780143039945", "uploads/gravitys-rainbow.png"),
    ("Blood Meridian", "Cormac", "McCarthy", "Vintage", "1992-05-05", 368, "9780679728757", "uploads/blood-meridian.png"),
    ("Ulysses", "James", "Joyce", "Vintage", "1990-06-16", 783, "9780679722762", "uploads/ulysses.png");

SET FOREIGN_KEY_CHECKS=1;

END $$
DELIMITER ;