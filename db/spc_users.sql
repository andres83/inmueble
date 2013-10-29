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

 Date: 10/28/2013 21:10:14 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `spc_users`
-- ----------------------------
DROP TABLE IF EXISTS `spc_users`;
CREATE TABLE `spc_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activated` enum('0','1') DEFAULT '1',
  `admin_id` int(10) unsigned DEFAULT NULL,
  `role` enum('super','admin','user') DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `timezone` varchar(30) DEFAULT NULL,
  `language` varchar(3) DEFAULT NULL,
  `theme` varchar(20) DEFAULT NULL,
  `big_icons` tinyint(3) unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `i_username` (`username`),
  KEY `fk_admin_id` (`admin_id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `spc_users`
-- ----------------------------
BEGIN;
INSERT INTO `spc_users` VALUES ('1', '1', '1', 'super', 'andres83', 'ad8b30c2d5011ae9686fe60c83eccbd0829eb07f74cdc0e0f0aa56f01f42c2a1', 'andres83@gmail.com', 'America/Bogota', 'en', 'smart-space', '1'), ('19', '1', '1', 'user', 'admin', '576c6df203386864c8fba64ea1b91e08403360a4b4d70028357510b062a7016c', 'admin@mail.com', null, null, null, '1'), ('3', '1', '2', 'user', 'user', '351d466f6da6ceecccdfdf6b1580c50e47f69bd21fc9a9c7077b0e14fba674ca', 'user@mail.com', 'Europe/Istanbul', 'en', 'smart-space', '1'), ('5', '1', '2', 'user', 'user1', 'd763b3d6ca8aa3eb123c68a33493fe051462248b02d8dabdd3d56e60d5d6a2d2', 'user1@mail.com', 'Europe/Istanbul', 'en', 'aristo', '0'), ('17', '1', '1', 'user', 'miguel', '65022daaf80432698deed865942a6ef191c2fd55ad5bcf52463b90ac111af6ea', 'miguel@gmail.com', 'Europe/Istanbul', 'en', 'smart-space', '1'), ('18', '1', '1', 'user', 'juan', 'af897f026cb7b66709287d90abe378703ddff7e48b4f59d3e8050b915df4132a', 'juan@mail.com', 'America/Bogota', 'en', 'smart-space', '1'), ('20', '1', '1', 'user', 'juanita', 'bddc03fdb35dc4bb234887c392f055e8a9cd2dcbe778f4bb6ff1f4683ecc5461', 'juanita@mail.com', null, null, null, '1');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
