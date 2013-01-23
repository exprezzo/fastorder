/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50508
Source Host           : localhost:3306
Source Database       : fastt

Target Server Type    : MYSQL
Target Server Version : 50508
File Encoding         : 65001

Date: 2013-01-23 16:37:53
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `almacenes`
-- ----------------------------
DROP TABLE IF EXISTS `almacenes`;
CREATE TABLE `almacenes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of almacenes
-- ----------------------------
INSERT INTO `almacenes` VALUES ('1', 'Cocina');
INSERT INTO `almacenes` VALUES ('2', 'Barra');
INSERT INTO `almacenes` VALUES ('3', 'almacen A');
INSERT INTO `almacenes` VALUES ('4', 'Otro Almacen');

-- ----------------------------
-- Table structure for `pedidos`
-- ----------------------------
DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_almacen` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pedidos
-- ----------------------------
INSERT INTO `pedidos` VALUES ('148', '1', '2013-01-22 18:48:57');
INSERT INTO `pedidos` VALUES ('149', '1', '2013-01-23 19:25:20');
INSERT INTO `pedidos` VALUES ('150', '1', '2013-01-23 19:26:47');
INSERT INTO `pedidos` VALUES ('151', '1', '2013-01-23 21:21:56');
INSERT INTO `pedidos` VALUES ('152', '1', '2013-01-23 21:22:47');
INSERT INTO `pedidos` VALUES ('153', '1', '2013-01-23 21:44:24');
INSERT INTO `pedidos` VALUES ('154', '1', '2013-01-23 21:46:17');
INSERT INTO `pedidos` VALUES ('155', '1', '2013-01-23 21:59:05');
INSERT INTO `pedidos` VALUES ('156', '1', '2013-01-23 22:00:09');
INSERT INTO `pedidos` VALUES ('157', '1', '2013-01-23 22:00:37');
INSERT INTO `pedidos` VALUES ('158', '1', '2013-01-23 22:00:57');
INSERT INTO `pedidos` VALUES ('159', '1', '2013-01-23 22:02:13');
INSERT INTO `pedidos` VALUES ('160', '1', '2013-01-23 22:02:33');
INSERT INTO `pedidos` VALUES ('161', '1', '2013-01-23 22:02:56');
INSERT INTO `pedidos` VALUES ('162', '1', '2013-01-24 00:36:21');
INSERT INTO `pedidos` VALUES ('163', '1', '2013-01-24 00:36:36');

-- ----------------------------
-- Table structure for `pedidos_productos`
-- ----------------------------
DROP TABLE IF EXISTS `pedidos_productos`;
CREATE TABLE `pedidos_productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_articulo` int(11) DEFAULT NULL,
  `fk_pedido` int(11) DEFAULT NULL,
  `cantidad` float(18,6) DEFAULT NULL,
  `fk_um` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pedidos_productos
-- ----------------------------
INSERT INTO `pedidos_productos` VALUES ('3', '2', '148', '9.000000', '0');
INSERT INTO `pedidos_productos` VALUES ('4', '0', '148', '0.000000', '0');
INSERT INTO `pedidos_productos` VALUES ('5', '2', '151', '0.000000', '0');
INSERT INTO `pedidos_productos` VALUES ('6', '2', '153', '0.000000', '0');
INSERT INTO `pedidos_productos` VALUES ('7', '2', '153', '0.000000', '0');
INSERT INTO `pedidos_productos` VALUES ('8', '3', '153', '9.000000', '0');
INSERT INTO `pedidos_productos` VALUES ('9', '4', '153', '8.000000', '0');
INSERT INTO `pedidos_productos` VALUES ('10', '0', '156', '0.000000', '0');
INSERT INTO `pedidos_productos` VALUES ('11', '1', '162', '7.000000', '3');

-- ----------------------------
-- Table structure for `productos`
-- ----------------------------
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` char(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of productos
-- ----------------------------
INSERT INTO `productos` VALUES ('1', 'prod1');
INSERT INTO `productos` VALUES ('2', 'prod2');
INSERT INTO `productos` VALUES ('3', 'prod3');
INSERT INTO `productos` VALUES ('4', 'prod4');
INSERT INTO `productos` VALUES ('5', 'prod5');

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
INSERT INTO `system_users` VALUES ('zesar1', 0x1E398E80A894F4559B8CB0E74C8BEBBA, 'cbibriesca@hotmail.com', '2', null, '1', 'Zesar X', 'pic_1.jpg', 'retro_blue_background.jpg', 'sdfas ad asdasd a dasd ad asd asd asd asd as asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd  as as as dasd sad asd asd asd asd asd asd as', '0', '1', '1', '1', '1355958733');
INSERT INTO `system_users` VALUES ('cesarx', 0x1E398E80A894F4559B8CB0E74C8BEBBA, 'cesar@correo.com', '1', null, '2', '0', null, null, 'asdf', '1', '1', '1', '1', null);
INSERT INTO `system_users` VALUES ('asdfasdf', 0x1E398E80A894F4559B8CB0E74C8BEBBA, 'asd@asd.com', '1', null, '3', '0', null, null, 'asdf', '1', '1', '1', '1', null);
INSERT INTO `system_users` VALUES ('', 0x1E398E80A894F4559B8CB0E74C8BEBBA, '', '1', null, '4', '0', null, null, 'asfd', '1', '1', '1', '1', '1355891612');
INSERT INTO `system_users` VALUES ('username', 0x1E398E80A894F4559B8CB0E74C8BEBBA, 'asdf@sadf.com', '1', null, '5', 'name', null, null, 'asdf', '1', '1', '1', '1', null);
INSERT INTO `system_users` VALUES ('zesar2', 0x1E398E80A894F4559B8CB0E74C8BEBBA, 'zesar2@test.com', '1', null, '6', 'Zesar 2', null, null, null, '1', '1', '1', '0', null);
INSERT INTO `system_users` VALUES ('fouser', 0x1E398E80A894F4559B8CB0E74C8BEBBA, 'userx2@email.com', '1', null, '10', '0', null, null, null, '1', '1', '1', '0', null);

-- ----------------------------
-- Table structure for `tmp_pedidos`
-- ----------------------------
DROP TABLE IF EXISTS `tmp_pedidos`;
CREATE TABLE `tmp_pedidos` (
  `id` int(11) NOT NULL DEFAULT '0',
  `fk_almacen` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `IdTmp` int(11) NOT NULL AUTO_INCREMENT,
  `creado` datetime NOT NULL,
  PRIMARY KEY (`IdTmp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tmp_pedidos
-- ----------------------------

-- ----------------------------
-- Table structure for `tmp_pedidos_productos`
-- ----------------------------
DROP TABLE IF EXISTS `tmp_pedidos_productos`;
CREATE TABLE `tmp_pedidos_productos` (
  `id` int(11) NOT NULL,
  `fk_articulo` int(11) DEFAULT NULL,
  `fk_pedido` int(11) DEFAULT NULL,
  `cantidad` float(18,6) DEFAULT NULL,
  `fk_um` int(11) unsigned DEFAULT NULL,
  `IdTmp` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`IdTmp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tmp_pedidos_productos
-- ----------------------------

-- ----------------------------
-- Table structure for `um`
-- ----------------------------
DROP TABLE IF EXISTS `um`;
CREATE TABLE `um` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `abrev` char(255) NOT NULL,
  `descripcion` char(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of um
-- ----------------------------
INSERT INTO `um` VALUES ('1', 'PZA', null);
INSERT INTO `um` VALUES ('2', 'U', null);
INSERT INTO `um` VALUES ('3', 'Kg', null);
INSERT INTO `um` VALUES ('4', 'M', null);
INSERT INTO `um` VALUES ('5', 'Km', null);
