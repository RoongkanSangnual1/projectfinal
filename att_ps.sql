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
-- Table structure for table `att_ps`
--

CREATE TABLE `att_ps` (
  `ATT_ID` int NOT NULL,
  `URL_ID` int DEFAULT NULL,
  `PID` int DEFAULT NULL,
  `OID` int DEFAULT NULL,
  `URL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vul_evidence` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parameters` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `method` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status_code` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reason` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `host` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `httpver` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `req_header` longtext COLLATE utf8mb4_general_ci,
  `req_body` longtext COLLATE utf8mb4_general_ci,
  `res_header` longtext COLLATE utf8mb4_general_ci,
  `res_body` longtext COLLATE utf8mb4_general_ci,
  `Severity` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `length` int DEFAULT NULL,
  `URI` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `state` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payload` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vul_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vul_des` varchar(5000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vul_sol` varchar(5000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vul_ref` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `OType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `att_ps`
--
ALTER TABLE `att_ps`
  ADD PRIMARY KEY (`ATT_ID`),
  ADD KEY `URL_ID` (`URL_ID`),
  ADD KEY `PID` (`PID`),
  ADD KEY `OID` (`OID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `att_ps`
--
ALTER TABLE `att_ps`
  MODIFY `ATT_ID` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `att_ps`
--
ALTER TABLE `att_ps`
  ADD CONSTRAINT `att_ps_ibfk_1` FOREIGN KEY (`URL_ID`) REFERENCES `urllist` (`URL_ID`),
  ADD CONSTRAINT `att_ps_ibfk_2` FOREIGN KEY (`PID`) REFERENCES `project` (`PID`),
  ADD CONSTRAINT `att_ps_ibfk_3` FOREIGN KEY (`OID`) REFERENCES `owasp` (`OID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
