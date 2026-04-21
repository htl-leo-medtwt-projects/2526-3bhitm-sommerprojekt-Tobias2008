-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db_server
-- Erstellungszeit: 21. Apr 2026 um 14:03
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
  `is_creator` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `attendance`
--

INSERT INTO `attendance` (`username`, `event_id`, `is_creator`) VALUES
('anna2', 1, 0),
('anna2', 2, 0),
('lukas3', 1, 0),
('max1', 1, 1),
('max1', 2, 1),
('sophie4', 1, 0),
('tobi9', 2, 0);

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
('Getränke', 1, 2, 'Welche Getränke?', 'anna2', 'text'),
('Ort', 2, 3, 'Meeting Ort abstimmen', 'lukas3', 'text');

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
('Meeting', 'Projekt Kickoff', 'Start des Projekts', '2026-05-10', 'Wien', 10, 2, '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `friend`
--

CREATE TABLE `friend` (
  `user_a` varchar(30) NOT NULL,
  `user_b` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `friend`
--

INSERT INTO `friend` (`user_a`, `user_b`) VALUES
('max1', 'anna2'),
('max1', 'lukas3'),
('anna2', 'sophie4'),
('paul5', 'tobi9');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `item`
--

CREATE TABLE `item` (
  `name` varchar(50) NOT NULL,
  `event_id` int NOT NULL,
  `attribute_id` int NOT NULL,
  `is_done` tinyint DEFAULT NULL,
  `username` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `item`
--

INSERT INTO `item` (`name`, `event_id`, `attribute_id`, `is_done`, `username`) VALUES
('Pizza bestellen', 1, 1, 0, 'max1'),
('Getränke kaufen', 1, 2, 1, 'anna2');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product`
--

CREATE TABLE `product` (
  `name` varchar(50) NOT NULL,
  `price` int DEFAULT NULL,
  `product_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `product`
--

INSERT INTO `product` (`name`, `price`, `product_id`) VALUES
('Pizza', 10, 1),
('Cola', 3, 2),
('Kuchen', 5, 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `purchase`
--

CREATE TABLE `purchase` (
  `event_id` int NOT NULL,
  `product_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `purchase`
--

INSERT INTO `purchase` (`event_id`, `product_id`) VALUES
(1, 1),
(1, 2),
(2, 3);

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
  `date_of_birth` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`first_name`, `last_name`, `username`, `email`, `password`, `date_of_birth`) VALUES
('Anna', 'Meier', 'anna2', 'anna2@mail.com', 'pass', '1992-02-02'),
('Lukas', 'Schmidt', 'lukas3', 'lukas3@mail.com', 'pass', '1993-03-03'),
('Max', 'Mustermann', 'max1', 'max1@mail.com', 'pass', '1990-01-01'),
('Paul', 'Huber', 'paul5', 'paul5@mail.com', 'pass', '1995-05-05'),
('Sophie', 'Wagner', 'sophie4', 'sophie4@mail.com', 'pass', '1994-04-04'),
('Tobias', 'Neumann', 'tobi9', 'tobi9@mail.com', 'pass', '1991-09-09');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `vote`
--

CREATE TABLE `vote` (
  `attribute_id` int NOT NULL,
  `event_id` int NOT NULL,
  `attribute_username` varchar(30) NOT NULL,
  `voter_username` varchar(30) NOT NULL,
  `selected_option` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `vote`
--

INSERT INTO `vote` (`attribute_id`, `event_id`, `attribute_username`, `voter_username`, `selected_option`) VALUES
(1, 1, 'max1', 'anna2', 1),
(1, 1, 'max1', 'lukas3', 2),
(2, 1, 'anna2', 'max1', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `vote_option`
--

CREATE TABLE `vote_option` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `event_id` int NOT NULL,
  `attribute_id` int NOT NULL,
  `username` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `vote_option`
--

INSERT INTO `vote_option` (`id`, `name`, `event_id`, `attribute_id`, `username`) VALUES
(5, 'Pizza', 1, 1, 'max1'),
(6, 'Burger', 1, 1, 'max1'),
(7, 'Cola', 1, 2, 'anna2'),
(8, 'Fanta', 1, 2, 'anna2');

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
  ADD KEY `user_b` (`user_b`);

--
-- Indizes für die Tabelle `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`attribute_id`,`event_id`,`username`);

--
-- Indizes für die Tabelle `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- Indizes für die Tabelle `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`event_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- Indizes für die Tabelle `vote`
--
ALTER TABLE `vote`
  ADD PRIMARY KEY (`attribute_id`,`event_id`,`attribute_username`,`voter_username`),
  ADD KEY `voter_username` (`voter_username`);

--
-- Indizes für die Tabelle `vote_option`
--
ALTER TABLE `vote_option`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attribute_id` (`attribute_id`,`event_id`,`username`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `attribute`
--
ALTER TABLE `attribute`
  MODIFY `attribute_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `event`
--
ALTER TABLE `event`
  MODIFY `event_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `vote_option`
--
ALTER TABLE `vote_option`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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

--
-- Constraints der Tabelle `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`),
  ADD CONSTRAINT `purchase_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints der Tabelle `vote`
--
ALTER TABLE `vote`
  ADD CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`voter_username`) REFERENCES `user` (`username`);

--
-- Constraints der Tabelle `vote_option`
--
ALTER TABLE `vote_option`
  ADD CONSTRAINT `vote_option_ibfk_1` FOREIGN KEY (`attribute_id`,`event_id`,`username`) REFERENCES `attribute` (`attribute_id`, `event_id`, `username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
