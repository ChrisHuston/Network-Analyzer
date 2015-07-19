CREATE DATABASE  IF NOT EXISTS `network_analyzer` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `network_analyzer`;
-- MySQL dump 10.13  Distrib 5.6.24, for osx10.8 (x86_64)
--
-- Host: localhost    Database: network_analyzer
-- ------------------------------------------------------
-- Server version	5.5.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `connections`
--

DROP TABLE IF EXISTS `connections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `connections` (
  `profile_id1` int(11) NOT NULL,
  `profile_id2` int(11) NOT NULL,
  `net_id` varchar(12) NOT NULL,
  PRIMARY KEY (`profile_id1`,`profile_id2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles` (
  `profile_id` int(11) NOT NULL AUTO_INCREMENT,
  `net_id` varchar(12) NOT NULL,
  `full_name` varchar(96) NOT NULL,
  `industry` varchar(120) DEFAULT NULL,
  `same_industry` tinyint(1) unsigned NOT NULL,
  `school` varchar(120) DEFAULT NULL,
  `same_school` tinyint(1) unsigned NOT NULL,
  `is_faculty` tinyint(1) unsigned NOT NULL,
  `more_senior` tinyint(1) unsigned NOT NULL,
  `same_level` tinyint(1) unsigned NOT NULL,
  `more_junior` tinyint(1) unsigned NOT NULL,
  `same_gender` tinyint(1) unsigned NOT NULL,
  `same_nationality` tinyint(1) unsigned NOT NULL,
  `same_ethnicity` tinyint(1) unsigned NOT NULL,
  `tech_skill` tinyint(1) unsigned NOT NULL,
  `finance_skill` tinyint(1) unsigned NOT NULL,
  `ops_skill` tinyint(1) unsigned NOT NULL,
  `sales_skill` tinyint(1) unsigned NOT NULL,
  `prod_skill` tinyint(1) unsigned NOT NULL,
  `gm_skill` tinyint(1) unsigned NOT NULL,
  `vc_skill` tinyint(1) unsigned NOT NULL,
  `other_skill` tinyint(1) unsigned NOT NULL,
  `same_skill` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`profile_id`)
) ENGINE=InnoDB AUTO_INCREMENT=958 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `summaries`
--

DROP TABLE IF EXISTS `summaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `summaries` (
  `net_id` varchar(12) NOT NULL,
  `user_name` varchar(120) NOT NULL,
  `course_id` mediumint(8) unsigned NOT NULL,
  `section_id` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`net_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-07-18 15:23:28
