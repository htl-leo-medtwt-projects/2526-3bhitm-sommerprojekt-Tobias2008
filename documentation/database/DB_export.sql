-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db_server
-- Erstellungszeit: 15. Jun 2026 um 22:29
-- Server-Version: 9.4.0
-- PHP-Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `PreGame`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `attendance`
--

CREATE TABLE `attendance` (
  `username` varchar(30) NOT NULL,
  `event_id` int NOT NULL,
  `is_creator` tinyint NOT NULL,
  `has_favorited` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `attendance`
--

INSERT INTO `attendance` (`username`, `event_id`, `is_creator`, `has_favorited`) VALUES
('2', 45, 0, 0),
('2', 52, 0, 0),
('2', 54, 0, 0),
('Admin', 1, 0, 0),
('Admin', 2, 0, 1),
('Admin', 12, 1, 0),
('Admin', 39, 1, 0),
('admin', 43, 1, 0),
('admin', 44, 1, 0),
('admin', 45, 1, 1),
('admin', 46, 1, 0),
('admin', 47, 1, 0),
('admin', 48, 1, 0),
('admin', 50, 1, 0),
('admin', 51, 1, 0),
('admin', 52, 1, 0),
('admin', 53, 1, 0),
('admin', 54, 1, 0),
('Admin', 55, 0, 0),
('anna2', 1, 0, 1),
('anna2', 9, 1, 1),
('anna2', 45, 0, 0),
('anna2', 54, 0, 0),
('JulianX', 45, 0, 0),
('JulianX', 48, 0, 0),
('JulianX', 50, 0, 0),
('JulianX', 51, 0, 0),
('JulianX', 54, 0, 0),
('JulianX', 55, 0, 0),
('kuss', 12, 0, 0),
('kuss', 45, 0, 0),
('kuss', 48, 0, 0),
('kuss', 50, 0, 0),
('kuss', 51, 0, 0),
('kuss', 52, 0, 0),
('kuss', 54, 0, 0),
('kuss', 55, 0, 0),
('Kussischek', 1, 1, 1),
('Kussischek', 2, 1, 1),
('Kussischek', 3, 1, 1),
('Kussischek', 12, 0, 0),
('Kussischek', 20, 1, 1),
('Kussischek', 21, 1, 1),
('Kussischek', 30, 1, 1),
('Kussischek', 45, 0, 0),
('lukas3', 1, 0, 0),
('lukas3', 10, 1, 0),
('lukas3', 16, 1, 1),
('lukas3', 45, 0, 0),
('lukas3', 54, 0, 0),
('max1', 1, 1, 0),
('max1', 2, 1, 0),
('max1', 11, 1, 1),
('max1', 15, 1, 0),
('max1', 45, 0, 0),
('max1', 54, 0, 0),
('p', 45, 0, 0),
('p', 54, 0, 0),
('paul5', 12, 0, 0),
('paul5', 45, 0, 0),
('sophie4', 1, 1, 1),
('sophie4', 12, 0, 0),
('sophie4', 45, 0, 0),
('test123', 12, 0, 0),
('test123', 45, 0, 0),
('Test1233', 12, 0, 0),
('Test1233', 45, 0, 0),
('Test12333', 12, 0, 0),
('Test12333', 45, 0, 0),
('Test123334', 12, 0, 0),
('Test123334', 45, 0, 0),
('test1234566', 12, 0, 0),
('TestiHIHI', 12, 0, 0),
('TestiHIHI', 45, 0, 0),
('tobi9', 1, 0, 0),
('tobi9', 13, 1, 1),
('tobi9', 18, 1, 0),
('Tobias123', 12, 0, 0),
('Tobias123', 55, 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `attribute`
--

CREATE TABLE `attribute` (
  `name` varchar(50) NOT NULL,
  `event_id` int NOT NULL,
  `attribute_id` int NOT NULL,
  `information` varchar(2500) DEFAULT NULL,
  `username` varchar(30) NOT NULL,
  `attribute_type` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `attribute`
--

INSERT INTO `attribute` (`name`, `event_id`, `attribute_id`, `information`, `username`, `attribute_type`) VALUES
('Essen', 1, 1, 'Was gibt es zu essen?', 'max1', 'text'),
('Ort', 2, 1, 'Meeting Ort abstimmen', 'lukas3', 'text'),
('Getränke', 1, 2, 'Welche Getränke?', 'anna2', 'text'),
('test123', 1, 4, '', 'admin', 'text'),
('123', 1, 5, '', 'admin', 'text'),
('1234', 1, 6, '', 'admin', 'text'),
('final', 1, 7, '', 'admin', 'text'),
('123', 1, 8, '', 'admin', 'text'),
('123', 1, 9, '', 'admin', 'text'),
('test', 1, 10, '', 'admin', 'text'),
('TestCat', 2, 11, '', 'admin', 'text'),
('trest', 45, 17, '', 'admin', 'text'),
('Essen', 45, 18, '', 'admin', 'text'),
('Sachen zum klauen', 12, 19, '', 'Tobias123', 'text');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `event`
--

CREATE TABLE `event` (
  `name` varchar(50) NOT NULL,
  `title_text` varchar(255) NOT NULL,
  `information` varchar(2500) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `max_members` int DEFAULT NULL,
  `event_id` int NOT NULL,
  `image_src` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `event`
--

INSERT INTO `event` (`name`, `title_text`, `information`, `event_date`, `location`, `max_members`, `event_id`, `image_src`) VALUES
('Geburtstag', 'Max Party', 'Geburtstagsfeier', '2026-05-01', 'Linz', 20, 1, ''),
('Meeting', 'Projekt Kickoff', 'Start des Projekts', '2026-05-10', 'Wien', 10, 2, ''),
('Geburtstag', 'Max Party', 'Geburtstagsfeier mit Freunden', '2026-05-01', 'Linz', 20, 3, ''),
('Geburtstag', 'Max Party', 'Geburtstagsfeier mit Freunden', '2026-05-01', 'Linz', 20, 4, ''),
('Geburtstag', 'Max Party', 'Geburtstagsfeier mit Freunden', '2026-05-01', 'Linz', 20, 5, ''),
('Geburtstag', 'Max Party', 'Geburtstagsfeier mit Freunden', '2026-05-01', 'Linz', 20, 6, ''),
('Geburtstag', 'Max Party', 'Geburtstagsfeier mit Freunden', '2026-05-01', 'Linz', 20, 7, ''),
('Geburtstag Anna', 'Anna Birthday Bash', 'Große Geburtstagsfeier mit Freunden', '2026-06-01', 'Linz', 30, 9, ''),
('Gaming Night', 'CS2 Tournament', 'Zockabend mit Turniermodus', '2026-05-20', 'Wien', 10, 10, ''),
('BBQ Party', 'Summer BBQ', 'Grillen im Garten mit Musik', '2026-06-10', 'Salzburg', 20, 11, ''),
('Study Group', 'Exam Prep', 'Gemeinsam für Prüfungen lernen', '2026-05-15', 'Innsbruck', 12, 12, ''),
('Weekend Meetup', 'Friends Hangout', 'Essen gehen und chillen', '2026-06-18', 'Graz', 15, 13, ''),
('Hiking Trip', 'Bergtour', 'Wandern in den Alpen', '2026-06-05', 'Tirol', 6, 15, ''),
('LAN Party', 'PC Gaming Night', 'Zocken die ganze Nacht', '2026-06-12', 'Wien', 16, 16, ''),
('Beach Day', 'Sommer am See', 'Chillen am Wasser', '2026-06-22', 'Attersee', 25, 17, ''),
('Study Session', 'Mathe Crashkurs', 'Gemeinsam für Mathe lernen', '2026-05-30', 'Salzburg', 10, 18, ''),
('Kussischek', 'Gaming Night', 'Turniere & Drinks', '2026-05-10', 'Vienna Arena', 120, 20, 'img/e2.jpg'),
('Kussischek', 'Opening Night', 'Start Event der Serie', '2026-05-01', 'Vienna', 150, 21, 'img/e1.jpg'),
('Kussischek', 'Summer Party', 'Outdoor Event', '2026-06-01', 'Donau', 200, 30, 'img/e3.jpg'),
('1', '2', '3', '2026-05-22', '3', 3, 31, NULL),
('11', '1', '1', '2026-05-06', '1', 1, 32, NULL),
('TestEvent', 'Ich teste bild', 'test', '2026-05-14', 'Linz', 12, 33, '../../ressources/images/uploads/6a154d40bc574.png'),
('t1', 't1', 't1', '2026-05-05', 't1', 12, 34, '../../ressources/images/uploads/6a1597fc7d2b8.png'),
('t1', 't1', 't1', '2026-05-06', 't1', 12, 35, '../../ressources/images/uploads/6a15982adbe24.png'),
('t1t', 't1t1', 't1', '2026-04-09', 't1', 12, 36, NULL),
('Lernparty', 'viel zeit zum lernen', 'ich will lernen mit dir', '2026-05-29', NULL, 2, 37, NULL),
('Admin test', 'trest', 'ttete', '0002-02-23', NULL, 12, 38, '../../ressources/images/uploads/6a1aeaec13d18.png'),
('Admin test', 'trest', 'ttete', '0002-02-23', NULL, 12, 39, '../../ressources/images/uploads/6a1aeb2b1fd71.png'),
('t', 't', 't', '2026-06-04', '1', 1, 43, NULL),
('t', 't', 't', '2026-06-04', 't', 1, 44, '../../ressources/images/uploads/6a2f06a9d4f98.jpg'),
('Sonennwendfeuer', 'Vorglühen bei Julian', 'Wir werden bei Julian fürs Sonnenwendfeuer vorglühen. Danach werden wir mit Zug und Co zu einer Aufführung von Ella fahren, hoffentlich gut überstehen und danach nach Leonding zum Sonnenwendfeuer fahren. Mitgenommen muss zu Julian eigentlich nur Getränke, aber dazu mehr bei Category', '2026-06-20', 'Bei Julian', 16, 45, '../../ressources/images/uploads/6a2f06d57ee0e.jpg'),
('t1', '51', 'r1', '2026-06-12', 'r', 12, 46, '../../ressources/images/uploads/6a3032fa394f6.png'),
('t2', 't2', 't2', '2026-06-04', 't2', 22, 47, '../../ressources/images/uploads/6a303366b6600.png'),
('t3', 't3', 't3', '2026-06-18', 't3', 434, 48, '../../ressources/images/uploads/6a3033cbdfda6.png'),
('t4', 't3', 't3', '2026-06-18', 't3', 434, 50, '../../ressources/images/uploads/6a303432d92cd.png'),
('t4', 't4', 't4', '0004-04-04', 't', 12, 51, '../../ressources/images/uploads/6a30344e379f4.png'),
('t4', 't4', 't4', '0004-04-04', 't', 12, 52, '../../ressources/images/uploads/6a303466988de.png'),
('t', '1', '1', '2026-06-04', '2', 4, 53, '../../ressources/images/uploads/6a3039ea3b62c.png'),
('33333333t', '1', '1', '2026-06-04', '2', 4, 54, '../../ressources/images/uploads/6a303a5264a6d.png'),
('Schulstreik', 'Lass mal alle schule Streiken', 'ganz viel infos zum Schulstreik!!!', '2026-06-25', 'HTL LEONDING', 1000, 55, '../../ressources/images/uploads/6a307043b4a4c.png');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `friend`
--

CREATE TABLE `friend` (
  `user_a` varchar(30) NOT NULL,
  `user_b` varchar(30) NOT NULL,
  `accepted` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `friend`
--

INSERT INTO `friend` (`user_a`, `user_b`, `accepted`) VALUES
('admin', '2', 1),
('admin', 'anna2', 1),
('admin', 'JulianX', 1),
('admin', 'lukas3', 1),
('admin', 'max1', 1),
('admin', 'p', 1),
('admin', 'paul5', 1),
('admin', 'sophie4', 1),
('admin', 'test123', 1),
('admin', 'Test1233', 1),
('admin', 'Test12333', 1),
('admin', 'Test123334', 1),
('admin', 'test1234566', 1),
('admin', 'TestiHIHI', 1),
('admin', 'tobi', 0),
('admin', 'tobi1estt23', 0),
('admin', 'tobi9', 0),
('kuss', 'admin', 1),
('Kussischek', 'admin', 1),
('Tobias123', 'Admin', 1),
('Tobias123', 'anna2', 0),
('Tobias123', 'JulianX', 1),
('Tobias123', 'kuss', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `item`
--

CREATE TABLE `item` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `event_id` int NOT NULL,
  `attribute_id` int NOT NULL,
  `username` varchar(30) NOT NULL,
  `is_done` tinyint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `item`
--

INSERT INTO `item` (`id`, `name`, `event_id`, `attribute_id`, `username`, `is_done`) VALUES
(1, 'Pizza bestellen', 1, 1, 'max1', 1),
(2, 'Pasta bestellen', 1, 1, 'max1', 1),
(3, 'Cola kaufen', 1, 2, 'anna2', 1),
(4, 'Fanta kaufen', 1, 2, 'anna2', 0),
(5, 'Treffpunkt Wien', 2, 1, 'lukas3', 0),
(6, '21', 1, 1, 'max1', 1),
(7, '123', 1, 1, 'max1', 1),
(8, 'test', 1, 1, 'max1', 1),
(9, '123', 1, 1, 'max1', 0),
(10, 'Testt', 1, 1, 'max1', 1),
(15, 'test', 45, 17, 'admin', 0),
(16, 'Stifte', 12, 19, 'Tobias123', 0),
(17, 'Laptops', 12, 19, 'Tobias123', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(25) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `image_src` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`first_name`, `last_name`, `username`, `email`, `password`, `date_of_birth`, `image_src`) VALUES
('2', '2', '2', '2@22', '$2y$10$wlJR4Jo4vfetlOPoWfM3terNZFR5pnlJjIP8rgqkZ2qmNgwHVWL0O', '0002-02-02', 'blue'),
('Tobias', 'Payreder', 'Admin', 'test@gmail.com', '$2y$10$pmoYGgYOPRA8jqqnHgsqbeuekUN7uA7iE5i1LD1H2vd3f0GLPItDG', '2008-10-17', 'purple'),
('Anna', 'Meier', 'anna2', 'anna2@mail.com', 'pass', '1992-02-02', NULL),
('Julian ', 'Warlischek', 'JulianX', 'warlischekjulian@gmail.com', '$2y$10$OzJy5qJ/.YFFQBKHBmqpdeLriYSNWesGnZIzgyalfKc5oulQ/hZXG', '2009-08-18', 'blue'),
('Julian', 'Warlischek', 'kuss', 'kuss@kuss.kuss', '$2y$10$WMLvqzMXA/hhDhNaLvz/kuedoYL8r4jf5QYZ0qg5Gd2zSg19zMNcC', '2009-08-18', 'darkgreen'),
('Julian', 'Warlischek', 'Kussischek', 'j.war@gmail.com', '$2y$10$P5x85LdydaYSgkc1lgN6BeXmmrYMPTfyblG.6W98R/396QAj/duEm', '2009-08-18', 'red'),
('Lukas', 'Schmidt', 'lukas3', 'lukas3@mail.com', 'pass', '1993-03-03', NULL),
('Max', 'Mustermann', 'max1', 'max1@mail.com', 'pass', '1990-01-01', NULL),
('Test', 't', 'p', 'p@.c', '$2y$10$P/67DikD.F/gRv0G/pehge5blVLOW2Rwt0VkGEBex.556wskoKKlq', '2026-06-02', '../../../ressources/images/profile/pre-saved-images/darkredMonster.jpg'),
('Paul', 'Huber', 'paul5', 'paul5@mail.com', 'pass', '1995-05-05', NULL),
('Sophie', 'Wagner', 'sophie4', 'sophie4@mail.com', 'pass', '1994-04-04', NULL),
('grteg', 'erger', 'test123', 'rjggnreg@gmail.c', '$2y$10$q81pYX37jTD7FEL.p5T49eGOfxs5I48dlpG76KuEvJbKm7YvZbUEa', '2026-05-01', 'darkred'),
('Test1233', 'Test1233', 'Test1233', 'Test1233@Test1233', '$2y$10$9axLyzMt2ddJSo9vQYfH.ucUit6lQwWZ2chv7uAvkwDB.XT/j4LKi', '0001-01-01', '../../../ressources/images/profile/pre-saved-images/darkgreenMonster.jpg'),
('Test123333', 'Test12333', 'Test12333', 'Test1233@Test1233', '$2y$10$Rj8nLsHTKio8DDOrVLAfXOCpV9mY/NEe7MIrzUKzERRLdWpX2lHWC', '0001-01-01', '../../../ressources/images/profile/pre-saved-images/darkgreenMonster.jpg'),
('Test1233334', 'Test123334', 'Test123334', 'Test1233@Test1233', '$2y$10$8pzYUmS8Qigq5rkVNRVf3ed0Rv4v6TDaMgldg1vJGaTJvH//CJQli', '0001-01-01', '../../../ressources/images/profile/pre-saved-images/darkgreenMonster.jpg'),
('t', 't', 'test1234566', 't@t.t', '$2y$10$43xB0m208Ln61.vPWRupWewjLYNRSyPe.GANV2KIrYngtOuyNZ3eO', '0001-01-01', '../../../ressources/images/profile/pre-saved-images/darkredMonster.jpg'),
('Test', 'Test', 'TestiHIHI', 'test@gmx.com', '$2y$10$QKxzwTa1lME.ai01i3VYteylw.iR22IUQigv5HCnSamE0b63/foNK', '2026-05-13', 'darkred'),
('Tobias', 'Payreder', 'tobi', '.@gmail.com.', '$2y$10$QsnVUJsGWzXYOy.E27dAfO7MxH6RKPcyY1TWKtmYtia7/hBeH8HYe', '2008-10-17', 'blue'),
('Tobias', 'Payreder', 'tobi1estt23', 'tobiaspayreder2008@gmail.comfr', '$2y$10$J26GtxPyQHjjS..XQijzJeux/g/X9hNGhnxrskwGX.QHewUfszjp2', '0001-01-01', 'black'),
('Tobias', 'Neumann', 'tobi9', 'tobi9@mail.com', '$2y$10$GnmSY1SIZoFMr/7nQAAecOFVQZv8aX.kWcYLJIeW2CqaM4jasrJ7m', '1991-09-09', NULL),
('Tobias', 'Payreder', 'Tobias123', 'tpayreder@students.htl-leonding.ac.at', '$2y$10$hTkx/eSVoG92AlLssgvSfe.cQ1a.HGhj2Z4H7DeR/YYTFzsngz4q.', '2008-10-17', '../../ressources/images/profile/pre-saved-images/lightblueMonster.jpg'),
('ü', 'ü', 'ü', 'ü@.c', '$2y$10$M.K6BQ6ZeJNqMoR8J1QR9.YpCcBiyk/HZxe.30ydFMHZBQK63mPem', '2026-06-18', '../../../ressources/images/profile/pre-saved-images/darkredMonster.jpg'),
('Test123', 'erferf', 'werfe', 'rujgnrekjg@gmail.com', '$2y$10$1rM1y4ERWKwKYMmUQzeazeeYivj2BHrmSovR0IRYF2jTvWTxAiUge', '2026-05-29', 'darkred');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`username`,`event_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indizes für die Tabelle `attribute`
--
ALTER TABLE `attribute`
  ADD PRIMARY KEY (`attribute_id`,`event_id`,`username`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `username` (`username`);

--
-- Indizes für die Tabelle `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`event_id`);

--
-- Indizes für die Tabelle `friend`
--
ALTER TABLE `friend`
  ADD PRIMARY KEY (`user_a`,`user_b`),
  ADD UNIQUE KEY `unique_friendship` (`user_a`,`user_b`),
  ADD KEY `user_b` (`user_b`);

--
-- Indizes für die Tabelle `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_ibfk_1` (`attribute_id`,`event_id`,`username`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `attribute`
--
ALTER TABLE `attribute`
  MODIFY `attribute_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT für Tabelle `event`
--
ALTER TABLE `event`
  MODIFY `event_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT für Tabelle `item`
--
ALTER TABLE `item`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`),
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`);

--
-- Constraints der Tabelle `attribute`
--
ALTER TABLE `attribute`
  ADD CONSTRAINT `attribute_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`),
  ADD CONSTRAINT `attribute_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

--
-- Constraints der Tabelle `friend`
--
ALTER TABLE `friend`
  ADD CONSTRAINT `friend_ibfk_1` FOREIGN KEY (`user_a`) REFERENCES `user` (`username`),
  ADD CONSTRAINT `friend_ibfk_2` FOREIGN KEY (`user_b`) REFERENCES `user` (`username`);

--
-- Constraints der Tabelle `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `item_ibfk_1` FOREIGN KEY (`attribute_id`,`event_id`,`username`) REFERENCES `attribute` (`attribute_id`, `event_id`, `username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
