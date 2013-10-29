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

 Date: 10/28/2013 21:10:10 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `spc_types`
-- ----------------------------
DROP TABLE IF EXISTS `spc_types`;
CREATE TABLE `spc_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activated` enum('0','1') DEFAULT '1',
  `type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `spc_types`
-- ----------------------------
BEGIN;
INSERT INTO `spc_types` VALUES ('1', '1', 'Oficinas'), ('2', '1', 'Casas'), ('3', '1', 'Carros'), ('4', '1', 'Lotes'), ('5', '1', 'Avenidas'), ('6', '1', 'Aviones');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
