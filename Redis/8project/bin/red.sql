DROP TABLE IF EXISTS `t_red_packet`;
CREATE TABLE `t_red_packet` (
	`id` INT ( 12 ) NOT NULL AUTO_INCREMENT COMMENT '红包ID',
	`type` TINYINT ( 12 ) NOT NULL COMMENT '1: 固定红包 2: 公平红包 3: 拼手速',
	`user_id` INT ( 12 ) NOT NULL COMMENT '发红包用户ID',
	`amount` INT(16) UNSIGNED NOT NULL COMMENT '红包总金额 单位：分',
	`send_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发红包时间',
	`total` INT ( 12 ) NOT NULL COMMENT '小红包总数',
	`unit_amount` INT ( 12 ) NOT NULL COMMENT '单个小红包金额 单位:分，仅限:固定红包',
	`stock` INT ( 12 ) NOT NULL COMMENT '剩余小红包个数',
	`version` INT ( 12 ) NOT NULL DEFAULT '0' COMMENT '版本',
	`note` VARCHAR ( 256 ) DEFAULT NULL COMMENT '备注',
	`create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY ( `id` ) 
) ENGINE = INNODB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8 COMMENT '红包表';

/* 插入一个2元金额，20个小红包，公平红包 */

insert  into `t_red_packet`(`type`, `user_id`, `amount`,`send_date`,`total`,`unit_amount`,`stock`,`version`,`note`) values (2, 1,'200.00','2020-12-01 10:47:20',20,'10',20,0,'200元金额，20个小红包，每个10元');

/*Table structure for table `t_user_red_packet` */
DROP TABLE
IF
	EXISTS `t_user_red_packet`;
CREATE TABLE `t_user_red_packet` (
	`id` INT ( 12 ) NOT NULL AUTO_INCREMENT COMMENT '编号ID',
	`red_packet_id` INT ( 12 ) NOT NULL COMMENT '红包编号',
	`user_id` INT ( 12 ) DEFAULT NULL COMMENT '抢红包用户编号',
	`amount` int(16) UNSIGNED NOT NULL COMMENT '抢红包金额 单位：分',
	`grab_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '抢红包时间',
	`note` VARCHAR ( 256 ) DEFAULT NULL COMMENT '备注',
	`create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`update_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY ( `id` ) 
) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT '用户抢红包表';