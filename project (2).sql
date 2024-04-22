-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 16, 2024 at 07:38 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `robo`
--

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `PID` int NOT NULL,
  `PName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PDes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PTarget` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SharedUID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `timeproject` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `EndTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `statecrawl` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`PID`, `PName`, `PDes`, `PTarget`, `SharedUID`, `username`, `timeproject`, `EndTime`, `statecrawl`) VALUES
(89, 'kmutnb', '', 'http://www.sci.kmutnb.ac.th/', NULL, 'Breeze1234', '2024-02-24 07:30:39', '2024-02-24 07:32:22', NULL),
(111, 'sci_kmutnb', '', 'http://www.sci.kmutnb.ac.th/', NULL, 'Breeze123', '2024-03-11 17:26:52', '2024-03-11 17:32:22', NULL),
(130, 'gineiei', 'gin & juice project', 'https://ginandjuice.shop/', NULL, 'angieeiei', '2024-03-19 16:43:26', '2024-03-19 17:38:00', 1),
(137, 'uni', '', 'http://cs.kmutnb.ac.th/', NULL, 'Breeze123', '2024-03-29 17:02:32', '2024-03-29 17:03:52', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`PID`),
  ADD KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `PID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
