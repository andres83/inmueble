/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50144
 Source Host           : localhost
 Source Database       : maraton

 Target Server Type    : MySQL
 Target Server Version : 50144
 File Encoding         : utf-8

 Date: 10/28/2013 21:09:53 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `spc_houses`
-- ----------------------------
DROP TABLE IF EXISTS `spc_houses`;
CREATE TABLE `spc_houses` (
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
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `spc_houses`
-- ----------------------------
BEGIN;
INSERT INTO `spc_houses` VALUES ('1', '1', '2', null, null, null, null, 'cr 11# 21 - 53', '1', null, null, null, null, null, null, null, null, null), ('2', '1', '2', null, null, null, null, '', '2', null, null, null, null, null, null, null, null, null), ('3', '1', '2', null, null, null, null, 'Tr 43A 99 17', '2', null, null, null, null, null, null, null, null, null), ('4', '1', '3', null, null, null, null, 'Tv 43A 99 17', '3', null, null, null, null, null, null, null, null, null), ('5', '1', '3', null, null, null, null, 'Mi casa', '4', null, null, null, null, null, null, null, null, null), ('6', '1', '1', null, null, null, null, 'Mi casa', '1', null, null, null, null, null, null, null, null, null), ('7', '1', '5', null, null, null, null, 'Nueva casa', '5', null, null, null, null, null, null, null, null, null), ('8', '1', '6', null, null, null, null, 'Lo mas bello de acá', '5', null, null, null, null, null, null, null, null, null), ('9', '1', '7', null, null, null, null, 'Cl siempre viva', '2', null, null, null, null, null, null, null, null, null), ('10', '1', '7', '0000-00-00', null, null, null, 'que lote', '4', null, null, null, null, null, null, null, null, null), ('11', '1', '7', '2013-03-31', null, null, null, 'Ultima Avenida', '5', null, null, null, null, null, null, null, null, null);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
