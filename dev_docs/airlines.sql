/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50508
Source Host           : localhost:3306
Source Database       : airlines

Target Server Type    : MYSQL
Target Server Version : 50508
File Encoding         : 65001

Date: 2013-01-12 01:53:26
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `destinos`
-- ----------------------------
DROP TABLE IF EXISTS `destinos`;
CREATE TABLE `destinos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` char(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of destinos
-- ----------------------------
INSERT INTO `destinos` VALUES ('1', 'Mazatlan');
INSERT INTO `destinos` VALUES ('2', 'La Paz');
INSERT INTO `destinos` VALUES ('3', 'Los Cabos');
INSERT INTO `destinos` VALUES ('4', 'Puerto Vallarta');
INSERT INTO `destinos` VALUES ('5', 'Culiacan');

-- ----------------------------
-- Table structure for `pasajeros`
-- ----------------------------
DROP TABLE IF EXISTS `pasajeros`;
CREATE TABLE `pasajeros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_reservacion` int(11) NOT NULL,
  `nombre` char(255) NOT NULL,
  `apellidos` char(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pasajeros
-- ----------------------------
INSERT INTO `pasajeros` VALUES ('115', '71', 'Cesar', 'Bibriesca');
INSERT INTO `pasajeros` VALUES ('116', '72', 'Gerardo', 'Ortiz');

-- ----------------------------
-- Table structure for `reservaciones`
-- ----------------------------
DROP TABLE IF EXISTS `reservaciones`;
CREATE TABLE `reservaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` char(255) DEFAULT NULL,
  `telefono` char(255) DEFAULT NULL,
  `nombre` char(255) DEFAULT NULL,
  `fk_vuelo` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of reservaciones
-- ----------------------------
INSERT INTO `reservaciones` VALUES ('71', 'cesar@email.com', '9848034', 'cesar', '251');
INSERT INTO `reservaciones` VALUES ('72', 'gerardo@email.com', '9801010', 'Gerardo', '252');

-- ----------------------------
-- Table structure for `system_users`
-- ----------------------------
DROP TABLE IF EXISTS `system_users`;
CREATE TABLE `system_users` (
  `nick` char(255) NOT NULL,
  `pass` blob,
  `email` char(255) NOT NULL,
  `rol` int(11) DEFAULT '1',
  `fbid` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) NOT NULL DEFAULT '0',
  `picture` varchar(255) DEFAULT NULL,
  `originalName` char(255) DEFAULT NULL,
  `bio` varchar(150) DEFAULT NULL,
  `allowFavorites` tinyint(1) DEFAULT '1',
  `allowShared` tinyint(1) DEFAULT '1',
  `allowLiked` tinyint(1) DEFAULT '1',
  `keepLoged` tinyint(1) DEFAULT '0',
  `request` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nick` (`nick`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of system_users
-- ----------------------------
INSERT INTO `system_users` VALUES ('zesar1', 0x88C6F87C8E0DFFBA20CA68680FA1311A, 'cbibriesca@hotmail.com', '2', null, '1', 'Zesar X', 'pic_1.jpg', 'retro_blue_background.jpg', 'sdfas ad asdasd a dasd ad asd asd asd asd as asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd  as as as dasd sad asd asd asd asd asd asd as', '0', '1', '1', '1', '1355958733');
INSERT INTO `system_users` VALUES ('cesarx', 0x88C6F87C8E0DFFBA20CA68680FA1311A, 'cesar@correo.com', '1', null, '2', '0', null, null, 'asdf', '1', '1', '1', '1', null);
INSERT INTO `system_users` VALUES ('asdfasdf', 0x88C6F87C8E0DFFBA20CA68680FA1311A, 'asd@asd.com', '1', null, '3', '0', null, null, 'asdf', '1', '1', '1', '1', null);
INSERT INTO `system_users` VALUES ('', 0x88C6F87C8E0DFFBA20CA68680FA1311A, '', '1', null, '4', '0', null, null, 'asfd', '1', '1', '1', '1', '1355891612');
INSERT INTO `system_users` VALUES ('username', 0x88C6F87C8E0DFFBA20CA68680FA1311A, 'asdf@sadf.com', '1', null, '5', 'name', null, null, 'asdf', '1', '1', '1', '1', null);
INSERT INTO `system_users` VALUES ('zesar2', 0x88C6F87C8E0DFFBA20CA68680FA1311A, 'zesar2@test.com', '1', null, '6', 'Zesar 2', null, null, null, '1', '1', '1', '0', null);
INSERT INTO `system_users` VALUES ('fouser', 0x27BE5E2F67AD42313ECEF2FD0CCCFBAB, 'userx2@email.com', '1', null, '10', '0', null, null, null, '1', '1', '1', '0', null);

-- ----------------------------
-- Table structure for `vuelos`
-- ----------------------------
DROP TABLE IF EXISTS `vuelos`;
CREATE TABLE `vuelos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fk_origen` char(255) NOT NULL,
  `fk_destino` char(255) NOT NULL,
  `fecha` datetime NOT NULL,
  `asientos_disponibles` int(11) DEFAULT NULL,
  `numVuelo` char(255) DEFAULT NULL,
  `costo` float(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of vuelos
-- ----------------------------
INSERT INTO `vuelos` VALUES ('1', '1', '2', '2013-01-10 16:43:17', '20', '250', '1500.00');
INSERT INTO `vuelos` VALUES ('2', '1', '2', '2013-01-10 16:43:46', '40', '251', '1500.00');
INSERT INTO `vuelos` VALUES ('3', '1', '2', '2013-01-10 16:50:32', '20', '252', '1500.00');
INSERT INTO `vuelos` VALUES ('4', '1', '2', '2013-01-11 12:25:00', '50', '253', '1600.00');
INSERT INTO `vuelos` VALUES ('5', '1', '4', '2013-01-11 12:31:29', '12', '255', '1500.00');
