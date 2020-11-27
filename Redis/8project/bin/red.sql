DROP TABLE IF EXISTS `t_red_packet`;

CREATE TABLE `t_red_packet` (
  `id` int(12) NOT NULL AUTO_INCREMENT COMMENT '红包ID',
  `user_id` int(12) NOT NULL COMMENT '发红包用户ID',
  `amount` decimal(16,2) NOT NULL COMMENT '红包金额',
  `send_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '发红包时间',
  `total` int(12) NOT NULL COMMENT '小红包总数',
  `unit_amount` decimal(12,0) NOT NULL COMMENT '单个小红包金额',
  `stock` int(12) NOT NULL COMMENT '剩余小红包个数',
  `version` int(12) NOT NULL DEFAULT '0' COMMENT '版本',
  `note` varchar(256) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT '红包表';

/*插入一个20万元金额，2万个小红包，每个10元的红包数据 */

insert  into `t_red_packet`(`user_id`,`amount`,`send_date`,`total`,`unit_amount`,`stock`,`version`,`note`) values (1,'200000.00','2020-12-01 10:47:20',20000,'10',20000,0,'20万元金额，2万个小红包，每个10元');

/*Table structure for table `t_user_red_packet` */

DROP TABLE IF EXISTS `t_user_red_packet`;

CREATE TABLE `t_user_red_packet` (
  `id` int(12) NOT NULL AUTO_INCREMENT COMMENT '编号ID',
  `red_packet_id` int(12) NOT NULL COMMENT '红包编号',
  `user_id` int(12) NOT NULL COMMENT '抢红包用户编号',
  `amount` decimal(16,2) NOT NULL COMMENT '抢红包金额',
  `grab_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '抢红包时间',
  `note` varchar(256) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '用户抢红包表';