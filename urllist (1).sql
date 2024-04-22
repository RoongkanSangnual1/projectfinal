-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 16, 2024 at 07:37 AM
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
-- Table structure for table `urllist`
--

CREATE TABLE `urllist` (
  `URL_ID` int NOT NULL,
  `PID` int DEFAULT NULL,
  `URL` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `method` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status_code` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reason` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `httpver` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `req_header` longtext COLLATE utf8mb4_general_ci,
  `req_body` longtext COLLATE utf8mb4_general_ci,
  `res_header` longtext COLLATE utf8mb4_general_ci,
  `res_body` longtext COLLATE utf8mb4_general_ci,
  `URI` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `state` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `length` int DEFAULT NULL,
  `isredirect` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `redirect_to` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ActionFound` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `urllist`
--
ALTER TABLE `urllist`
  ADD PRIMARY KEY (`URL_ID`),
  ADD KEY `PID` (`PID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `urllist`
--
ALTER TABLE `urllist`
  MODIFY `URL_ID` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `urllist`
--
ALTER TABLE `urllist`
  ADD CONSTRAINT `urllist_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `project` (`PID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
