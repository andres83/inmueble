<?php

/*
 *
 * CREATE TABLE IF NOT EXISTS `spc_houses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activated` enum('0','1') DEFAULT '1',
  `neighborhood` int(10) unsigned DEFAULT NULL,
  `day` date DEFAULT NULL,
  `time` char(5) DEFAULT NULL,
  `judge` varchar(10) DEFAULT NULL,
  `expedient` text,
  `address` text,
  `type` tinyint(4) unsigned DEFAULT NULL,
  `areaBuilt` int(10) unsigned DEFAULT NULL,
  `areaTotal` int(10) unsigned DEFAULT NULL,
  `stratum` tinyint(2) unsigned DEFAULT NULL,
  `estate` text,
  `appraisal` int(15) unsigned DEFAULT NULL,
  `percentage` tinyint(4) unsigned DEFAULT NULL,
  `price` int(15) unsigned DEFAULT NULL,
  `posture` int(15) unsigned DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_neighborhood` (`neighborhood`),
  KEY `fk_type` (`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
 * 
 * CREATE TABLE IF NOT EXISTS `spc_states` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activated` enum('0','1') DEFAULT '1',
  `state` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `state` (`state`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
 * 
 * CREATE TABLE IF NOT EXISTS `spc_cities` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activated` enum('0','1') DEFAULT '1',
  `city` varchar(100) DEFAULT NULL,
  `state` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_state` (`state`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
 * 
 * CREATE TABLE IF NOT EXISTS `spc_neighborhoods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `city` int(10) unsigned DEFAULT NULL,
  `activated` enum('0','1') DEFAULT '1',
  `neighborhood` text,
  PRIMARY KEY (`id`),
  KEY `fk_city` (`city`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
 * 
 * CREATE TABLE IF NOT EXISTS `spc_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activated` enum('0','1') DEFAULT '1',
  `type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
 * 
 */
?>
