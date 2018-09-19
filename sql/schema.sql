SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS `scheduler`;
CREATE DATABASE IF NOT EXISTS `scheduler` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `scheduler`;


CREATE TABLE IF NOT EXISTS `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`), UNIQUE (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `bookables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `duration` int NOT NULL,
  `minNotice` int NOT NULL DEFAULT 0,
  `minCancelNotice` int NOT NULL DEFAULT 0,
  `maxFuture` int,
  `resourceId` int(11) NOT NULL,
  PRIMARY KEY (`id`), FOREIGN KEY (resourceId) REFERENCES resources(id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

COMMIT;