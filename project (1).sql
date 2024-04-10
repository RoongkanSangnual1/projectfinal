-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2024 at 04:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
  `PID` int(11) NOT NULL,
  `PName` varchar(255) DEFAULT NULL,
  `PDes` varchar(255) DEFAULT NULL,
  `PTarget` varchar(255) DEFAULT NULL,
  `SharedUID` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `timeproject` timestamp NOT NULL DEFAULT current_timestamp(),
  `EndTime` timestamp NOT NULL DEFAULT current_timestamp(),
  `statecrawl` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`PID`, `PName`, `PDes`, `PTarget`, `SharedUID`, `username`, `timeproject`, `EndTime`, `statecrawl`) VALUES
(89, 'kmutnb', '', 'http://www.sci.kmutnb.ac.th/', NULL, 'Breeze1234', '2024-02-24 07:30:39', '2024-02-24 07:32:22', NULL),
(111, 'sci_kmutnb', '', 'http://www.sci.kmutnb.ac.th/', NULL, 'Breeze123', '2024-03-11 17:26:52', '2024-03-11 17:32:22', NULL),
(113, 'cs', '', 'http://cs.kmutnb.ac.th/', NULL, 'Breeze123', '2024-03-13 12:51:22', '2024-03-13 12:52:26', NULL),
(118, 'Sc1', '', 'http://sci.kmutnb.ac.th/', NULL, 'Breeze123', '2024-03-13 17:42:56', '2024-03-13 17:48:47', NULL),
(120, 'selfDOS', 'test on our own website', 'http://localhost:3000/', NULL, 'Breeze123', '2024-03-14 13:51:51', '2024-03-14 13:52:17', NULL),
(123, 'sqllab1', '', 'https://0a6d009504d111fd84d9ff5f003c0010.web-security-academy.net/', NULL, 'Breeze123', '2024-03-17 16:52:48', '2024-03-17 16:52:50', 1),
(130, 'gineiei', 'gin & juice project', 'https://ginandjuice.shop/', NULL, 'angieeiei', '2024-03-19 16:43:26', '2024-03-19 17:38:00', 1),
(134, 'LatelyCS', '', 'http://cs.kmutnb.ac.th/', NULL, 'Breeze123', '2024-03-29 06:52:09', '2024-03-29 06:54:18', 1),
(136, 'snoopy', '', 'http://cs.kmutnb.ac.th/', NULL, 'Breeze123', '2024-03-29 16:49:59', '2024-03-29 16:51:21', 1),
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
  MODIFY `PID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

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
