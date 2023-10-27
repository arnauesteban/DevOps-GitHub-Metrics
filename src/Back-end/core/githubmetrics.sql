-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           11.3.0-MariaDB - mariadb.org binary distribution
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour githubmetrics
DROP DATABASE IF EXISTS `githubmetrics`;
CREATE DATABASE IF NOT EXISTS `githubmetrics` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `githubmetrics`;

-- Listage de la structure de table githubmetrics. metricsissueslt
DROP TABLE IF EXISTS `metricsissueslt`;
CREATE TABLE IF NOT EXISTS `metricsissueslt` (
  `issueID` int(11) DEFAULT NULL,
  `TimeStamp` int(11) DEFAULT NULL,
  `Description` int(11) DEFAULT NULL,
  `LeadTime` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Listage des données de la table githubmetrics.metricsissueslt : ~0 rows (environ)

-- Listage de la structure de table githubmetrics. metricsltpr
DROP TABLE IF EXISTS `metricsltpr`;
CREATE TABLE IF NOT EXISTS `metricsltpr` (
  `PullRequestID` int(11) DEFAULT NULL,
  `TimeStamp` datetime DEFAULT NULL,
  `Description` int(11) DEFAULT NULL,
  `LeadTime` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Listage des données de la table githubmetrics.metricsltpr : ~0 rows (environ)

-- Listage de la structure de table githubmetrics. metricssnapshot
DROP TABLE IF EXISTS `metricssnapshot`;
CREATE TABLE IF NOT EXISTS `metricssnapshot` (
  `ProjectID` int(11) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  `Backlog` int(11) DEFAULT NULL,
  `A_Faire` int(11) DEFAULT NULL,
  `En_Cours` int(11) DEFAULT NULL,
  `Revue` int(11) DEFAULT NULL,
  `Complété` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Listage des données de la table githubmetrics.metricssnapshot : ~0 rows (environ)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
