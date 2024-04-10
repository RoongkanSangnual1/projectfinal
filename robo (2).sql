-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2024 at 04:22 AM
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
-- Table structure for table `att_ps`
--

CREATE TABLE `att_ps` (
  `ATT_ID` int(11) NOT NULL,
  `URL_ID` int(11) DEFAULT NULL,
  `PID` int(11) DEFAULT NULL,
  `OID` int(11) DEFAULT NULL,
  `URL` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `vul_evidence` varchar(255) DEFAULT NULL,
  `parameters` varchar(255) DEFAULT NULL,
  `method` varchar(10) DEFAULT NULL,
  `status_code` varchar(10) DEFAULT NULL,
  `reason` varchar(10) DEFAULT NULL,
  `host` varchar(10) DEFAULT NULL,
  `httpver` varchar(10) DEFAULT NULL,
  `req_header` longtext DEFAULT NULL,
  `req_body` longtext DEFAULT NULL,
  `res_header` longtext DEFAULT NULL,
  `res_body` longtext DEFAULT NULL,
  `Severity` varchar(255) NOT NULL,
  `length` int(11) DEFAULT NULL,
  `URI` varchar(255) DEFAULT NULL,
  `state` varchar(10) DEFAULT NULL,
  `payload` varchar(255) DEFAULT NULL,
  `vul_name` varchar(255) DEFAULT NULL,
  `vul_des` varchar(5000) DEFAULT NULL,
  `vul_sol` varchar(5000) DEFAULT NULL,
  `vul_ref` varchar(255) DEFAULT NULL,
  `OType` varchar(255) DEFAULT NULL
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
  MODIFY `ATT_ID` int(11) NOT NULL AUTO_INCREMENT;

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
