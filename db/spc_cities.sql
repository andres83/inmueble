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

 Date: 10/28/2013 21:09:48 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `spc_cities`
-- ----------------------------
DROP TABLE IF EXISTS `spc_cities`;
CREATE TABLE `spc_cities` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activated` enum('0','1') DEFAULT '1',
  `city` varchar(100) DEFAULT NULL,
  `state` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_state` (`state`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `spc_cities`
-- ----------------------------
BEGIN;
INSERT INTO `spc_cities` VALUES ('1', '1', 'Leticia', '1'), ('2', '1', '', null), ('3', '1', 'Bogota', null), ('4', '0', 'Bogota', '1'), ('5', '1', 'Cauca', '1'), ('6', '1', 'Molinos', '1'), ('7', '1', 'Barranquilla', '5');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
