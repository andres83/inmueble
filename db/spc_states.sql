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

 Date: 10/28/2013 21:10:05 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `spc_states`
-- ----------------------------
DROP TABLE IF EXISTS `spc_states`;
CREATE TABLE `spc_states` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activated` enum('0','1') DEFAULT '1',
  `state` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `state` (`state`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `spc_states`
-- ----------------------------
BEGIN;
INSERT INTO `spc_states` VALUES ('1', '1', 'Amazonas'), ('2', '1', 'Bolivar'), ('3', '1', 'Cordoba'), ('4', '1', 'Cauca'), ('5', '1', 'Atlantico'), ('6', '1', 'Vichada'), ('7', '1', 'Nariño'), ('8', '1', 'Cundinamarca'), ('9', '1', 'Guajira');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
