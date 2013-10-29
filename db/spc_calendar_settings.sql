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

 Date: 10/28/2013 21:09:40 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `spc_calendar_settings`
-- ----------------------------
DROP TABLE IF EXISTS `spc_calendar_settings`;
CREATE TABLE `spc_calendar_settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `admin_id` int(10) unsigned DEFAULT NULL,
  `shortdate_format` varchar(20) DEFAULT NULL,
  `longdate_format` varchar(20) DEFAULT NULL,
  `timeformat` enum('core','standard') DEFAULT NULL,
  `custom_view` tinyint(3) unsigned DEFAULT NULL,
  `start_day` enum('Saturday','Sunday','Monday') DEFAULT NULL,
  `default_view` varchar(20) DEFAULT NULL,
  `wysiwyg` enum('1','0') DEFAULT '0',
  `staff_mode` enum('0','1') DEFAULT '0',
  `calendar_mode` enum('vertical','timeline') DEFAULT 'vertical',
  `timeline_day_width` mediumint(8) unsigned DEFAULT '360',
  `timeline_row_height` mediumint(8) unsigned DEFAULT '28',
  `timeline_show_hours` tinyint(3) unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `admin_id` (`admin_id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `spc_calendar_settings`
-- ----------------------------
BEGIN;
INSERT INTO `spc_calendar_settings` VALUES ('1', '2', '2', 'n/j/Y', 'lit_end', 'standard', '3', 'Monday', 'week', '0', '0', 'vertical', '720', '28', '1'), ('2', '3', '2', 'n/j/Y', 'lit_end', 'standard', '3', 'Monday', 'week', '0', '0', 'vertical', '720', '28', '1');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
