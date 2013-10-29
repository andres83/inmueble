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

 Date: 10/28/2013 21:10:00 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `spc_neighborhoods`
-- ----------------------------
DROP TABLE IF EXISTS `spc_neighborhoods`;
CREATE TABLE `spc_neighborhoods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `city` int(10) unsigned DEFAULT NULL,
  `activated` enum('0','1') DEFAULT '1',
  `neighborhood` text,
  PRIMARY KEY (`id`),
  KEY `fk_city` (`city`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `spc_neighborhoods`
-- ----------------------------
BEGIN;
INSERT INTO `spc_neighborhoods` VALUES ('1', '4', '1', 'Los Andes'), ('2', '1', '1', 'Los Andes Plaza'), ('3', '1', '1', ''), ('4', '4', '1', 'La quinta'), ('5', '6', '1', 'Casa de la Gau'), ('6', '5', '1', 'Bello'), ('7', '7', '1', 'Pueblito');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
