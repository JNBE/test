let code = {
    /**业务类型 */
    businessTypeList: [
        { 'code': '1002996', 'title': '干线普货运输' },
        { 'code': '1003997', 'title': '城市配送' },
        { 'code': '1003998', 'title': '农村配送' },
        { 'code': '1002998', 'title': '集装箱运输' },
        { 'code': '1003999', 'title': '其他' }
    ],
    getBusinessType(title){
        for (let item of this.businessTypeList) {
            if (item.title === title) {
              return item;      
            }
        }
    },
    hasBusinessType(title) {
        for (let item of this.businessTypeList) {
          if (item.title === title) {
            return true;      
          }
        }
        return false;   
    },

    /**车牌类型 */
    plateTypeList: [
        { 'code': '01', 'title': '大型汽车号牌' },
        { 'code': '02', 'title': '小型汽车号牌' },
        { 'code': '99', 'title': '其他号牌' },
    ],
    getPlateType(title){
        for (let item of this.plateTypeList) {
            if (item.title === title) {
              return item;      
            }
        }
    },
    hasPlateType(title) {
        for (let item of this.plateTypeList) {
          if (item.title === title) {
            return true;      
          }
        }
        return false;   
    },
    
    /**车辆类型 */
    vehicleTypeList: [
        { 'code': 'H01', 'title': '普通货车' },
        { 'code': 'H02', 'title': '厢式货车' },
        { 'code': 'H03', 'title': '封闭货车' },
        { 'code': 'H04', 'title': '罐式货车' },
        { 'code': 'H05', 'title': '平板货车' },
        { 'code': 'H06', 'title': '集装箱车' },
        { 'code': 'H07', 'title': '自卸货车' },
        { 'code': 'H08', 'title': '特殊结构货车' },
        { 'code': 'H09', 'title': '仓栅式货车' },
        { 'code': 'G01', 'title': '普通挂车' },
        { 'code': 'G02', 'title': '厢式挂车' },
        { 'code': 'G03', 'title': '罐式挂车' },
        { 'code': 'G04', 'title': '平板挂车' },
        { 'code': 'G05', 'title': '集装箱挂车' },
        { 'code': 'G06', 'title': '自卸挂车' },
        { 'code': 'G07', 'title': '仓栅式挂车' },
        { 'code': 'G09', 'title': '专项作业挂车' },
        { 'code': 'Q00', 'title': '牵引车' },
        { 'code': 'X91', 'title': '车辆运输车' },
        { 'code': 'X92', 'title': '车辆运输车(单排)' },
        { 'code': 'Z00', 'title': '专项作业车' }

    ],
   
    getVehicleType(title){
        for (let item of this.vehicleTypeList) {
            if (item.title === title) {
              return item;      
            }
        }
    },
    hasVehicleType(title) {
        for (let item of this.vehicleTypeList) {
          if (item.title === title) {
            return true;      
          }
        }
        return false;   
    },

    /***货物类型 */
    cargoTypeList: [
        { 'code': '90', 'title': '电子产品' },
        { 'code': '92', 'title': '商品汽车' },
        { 'code': '93', 'title': '冷藏货物' },
        { 'code': '94', 'title': '大宗货物' },
        { 'code': '95', 'title': '快速消费品' },
        { 'code': '96', 'title': '农产品' },
        { 'code': '999', 'title': '其他' },
    ],
    getCargoType(title){
        for (let item of this.cargoTypeList) {
            if (item.title === title) {
              return item;      
            }
        }
    },
    hasCargoType(title) {
        for (let item of this.cargoTypeList) {
          if (item.title === title) {
            return true;      
          }
        }
        return false;   
    },

    /***付款方式 */
    payMethodList: [
        { 'code': '33', 'title': '银行汇票' },
        { 'code': '39', 'title': '银行转账' },
        { 'code': '42', 'title': '现金支付' },
        {
            'code': '7',
            'title': '第三方平台支付',
            'children': [
                { 'code': '71', 'title': '支付宝支付' },
                { 'code': '72', 'title': '微信支付' }
            ]
        },
        {
            'code': '9',
            'title': '其他方式支付',
            'children': [
                { 'code': '91', 'title': '油卡支付' },
                { 'code': '92', 'title': '道路桥闸通行费支付' }
            ]
        },

    ],
    
    getPayMethod(title){
        let list =[
            { 'code': '33', 'title': '银行汇票' },
            { 'code': '39', 'title': '银行转账' },
            { 'code': '42', 'title': '现金支付' },
            { 'code': '7', 'title': '第三方平台支付' },
            { 'code': '71', 'title': '支付宝支付' },
            { 'code': '72', 'title': '微信支付' },
            { 'code': '9', 'title': '其他方式支付' },
            { 'code': '91', 'title': '油卡支付' },
            { 'code': '92', 'title': '道路桥闸通行费支付' }
        ];
        for (let item of list) {
            if (item.title === title) {
              return item;      
            }
        }
        return null;
    },
    hasPayMethod(title) {
        let list =[
            { 'code': '33', 'title': '银行汇票' },
            { 'code': '39', 'title': '银行转账' },
            { 'code': '42', 'title': '现金支付' },
            { 'code': '7', 'title': '第三方平台支付' },
            { 'code': '71', 'title': '支付宝支付' },
            { 'code': '72', 'title': '微信支付' },
            { 'code': '9', 'title': '其他方式支付' },
            { 'code': '91', 'title': '油卡支付' },
            { 'code': '92', 'title': '道路桥闸通行费支付' }
        ];
        for (let item of list) {
          if (item.title === title) {
            return true;      
          }
        }
        return false;   
    },

    /***报文功能代码 */
    messsageFunctionCodeList: [
        { 'value': '1', 'label': '删除', 'EN-name': 'Cancellation' },
        { 'value': '5', 'label': '更新', 'EN-name': 'Replace' },
        { 'value': '9', 'label': '新增', 'EN-name': 'Original' },
    ],

    /**常用报文类型 */
    actionType: {
        LOGINK_CN_TRANSPORT_PREBOOKING: 'LOGINK_CN_TRANSPORT_PREBOOKING',
        JTWL_ENTRUST_TRANS_BookingNote: 'JTWL_ENTRUST_TRANS_BookingNote',
        LOGINK_CN_TRANSPORT_WAYBILL: 'LOGINK_CN_TRANSPORT_WAYBILL',
        LOGINK_CN_TRANS_VEHICLEDISPATCHING: 'LOGINK_CN_TRANS_VEHICLEDISPATCHING',
        JTWL_ENTRUST_TRANS_BookingNoteStatus: 'JTWL_ENTRUST_TRANS_BookingNoteStatus',
        ZJWL_LOGINK_HWGZ_SHIPMENTRETURN: 'ZJWL_LOGINK_HWGZ_SHIPMENTRETURN',
        ZJWL_LOGINK_HWGZ_YSLJobNote: 'ZJWL_LOGINK_HWGZ_YSLJobNote',
        JTWL_ENTRUST_CONTAINER_BookingNote: 'JTWL_ENTRUST_CONTAINER_BookingNote',
        JTWL_ENTRUST_CONTAINER_DispatchInfomation: 'JTWL_ENTRUST_CONTAINER_DispatchInfomation',
        JTWL_ENTRUST_CONTAINER_ContainerSeal: 'JTWL_ENTRUST_CONTAINER_ContainerSeal',
        JTWL_ENTRUST_AGENT_ShippingNote: 'JTWL_ENTRUST_AGENT_ShippingNote',
        LOGINK_CN_FORWARDER_B00KINGCONFIRM: 'LOGINK_CN_FORWARDER_B00KINGCONFIRM',
        LOGINK_CN_CONTAINERTRUCK_CLP: 'LOGINK_CN_CONTAINERTRUCK_CLP',
        LOGINK_CN_CONTAINERTRUCK_EIR: 'LOGINK_CN_CONTAINERTRUCK_EIR',
        JTWL_ENTRUST_Storage_EnterWarehouseNotice: 'JTWL_ENTRUST_Storage_EnterWarehouseNotice',
        JTWL_ENTRUST_Storage_EnterWarehouseDetail: 'JTWL_ENTRUST_Storage_EnterWarehouseDetail',
        JTWL_ENTRUST_Storage_OutWarehouseNotice: 'JTWL_ENTRUST_Storage_OutWarehouseNotice',
        JTWL_ENTRUST_Storage_OutWarehouseDetail: 'JTWL_ENTRUST_Storage_OutWarehouseDetail',
        JTWL_ENTRUST_Terminal_EnterWarehouseNotice: 'JTWL_ENTRUST_Terminal_EnterWarehouseNotice',
        JTWL_ENTRUST_Terminal_EnterWarehouseDetail: 'JTWL_ENTRUST_Terminal_EnterWarehouseDetail',
        JTWL_ENTRUST_Terminal_StuffingContainerNotice: 'JTWL_ENTRUST_Terminal_StuffingContainerNotice',
        JTWL_ENTRUST_Terminal_EWStuffingContainer: 'JTWL_ENTRUST_Terminal_EWStuffingContainer',
        ZJWL_CLZX_KZX_BASEINFO_Upload: 'ZJWL_CLZX_KZX_BASEINFO_Upload',
        ZJWL_CLZX_KZX_CARD_RemarkUpload: 'ZJWL_CLZX_KZX_CARD_RemarkUpload',
        JTWL_XYZX_WLJD_CHELIANGCHURU_UpLoad: 'JTWL_XYZX_WLJD_CHELIANGCHURU_UpLoad',
        LOGINK_CN_CREDIT_ENTERPRISE: 'LOGINK_CN_CREDIT_ENTERPRISE',
        LOGINK_CN_CREDIT_VEHICLE: 'LOGINK_CN_CREDIT_VEHICLE',
        LOGINK_CN_CREDIT_PERSON: 'LOGINK_CN_CREDIT_PERSON',
        parse(type) {
            switch (type) {
                case 'LOGINK_CN_TRANSPORT_PREBOOKING':
                    return "普通货物运输预约单";
                case 'JTWL_ENTRUST_TRANS_BookingNote':
                    return "普通货物托单";
                case 'LOGINK_CN_TRANSPORT_WAYBILL':
                    return "普通货物运单";
                case 'LOGINK_CN_TRANS_VEHICLEDISPATCHING':
                    return "普通运输派车单";
                case 'JTWL_ENTRUST_TRANS_BookingNoteStatus':
                    return "普通运输托运状态变化单";
                case 'ZJWL_LOGINK_HWGZ_SHIPMENTRETURN':
                    return "普通运输回执单";
                case 'ZJWL_LOGINK_HWGZ_YSLJobNote':
                    return "危险品道路运输电子路单";
                case 'JTWL_ENTRUST_CONTAINER_BookingNote':
                    return "集装箱运输托运单";
                case 'JTWL_ENTRUST_CONTAINER_DispatchInfomation':
                    return "集装箱运输派车单";
                case 'JTWL_ENTRUST_CONTAINER_ContainerSeal':
                    return "集装箱运输回执单";
                case 'JTWL_ENTRUST_AGENT_ShippingNote':
                    return "海运托运单";
                case 'LOGINK_CN_FORWARDER_B00KINGCONFIRM':
                    return "配舱回单";
                case 'LOGINK_CN_CONTAINERTRUCK_CLP':
                    return "装箱单";
                case 'LOGINK_CN_CONTAINERTRUCK_EIR':
                    return "设备交接单";
                case 'JTWL_ENTRUST_Storage_EnterWarehouseNotice':
                    return "普通仓库入库通知单";
                case 'JTWL_ENTRUST_Storage_EnterWarehouseDetail':
                    return "普通仓库入库明细单";
                case 'JTWL_ENTRUST_Storage_OutWarehouseNotice':
                    return "普通仓库出库通知单";
                case 'JTWL_ENTRUST_Storage_OutWarehouseDetail':
                    return "普通仓储出库明细单";
                case 'JTWL_ENTRUST_Terminal_EnterWarehouseNotice':
                    return "CFS仓库入库通知单";
                case 'JTWL_ENTRUST_Terminal_EnterWarehouseDetail':
                    return "CFS仓库入库明细单";
                case 'JTWL_ENTRUST_Terminal_StuffingContainerNotice':
                    return "CFS仓库出库通知单";
                case 'JTWL_ENTRUST_Terminal_EWStuffingContainer':
                    return "CFS仓库出库单";
                case 'ZJWL_CLZX_KZX_BASEINFO_Upload':
                    return "车辆卡注册信息上传";
                case 'ZJWL_CLZX_KZX_CARD_RemarkUpload':
                    return "车辆园区登记信息上传";
                case 'JTWL_XYZX_WLJD_CHELIANGCHURU_UpLoad':
                    return "车辆进出信息";
                case 'LOGINK_CN_CREDIT_ENTERPRISE':
                    return "企业信用信息上传";
                case 'LOGINK_CN_CREDIT_VEHICLE':
                    return "车辆信用信息上传";
                case 'LOGINK_CN_CREDIT_PERSON':
                    return "人员信用信息上传";
                default:
                    return "";
            }
        }

    },

    /**银行类型代码 */
    bankCodeList: [
        {'code': 'BKCH', 'title': '中国银行'},
        {'code': 'ABOC', 'title': '农业银行'},
        {'code': 'ICBK', 'title': '工商银行'},
        {'code': 'PCBC', 'title': '建设银行'},
        {'code': 'PSBC', 'title': '邮政储蓄'},
        {'code': 'COMM', 'title': '交通银行'},
        {'code': 'CMBC', 'title': '招商银行'},
        {'code': 'SZDB', 'title': '平安银行'},
        {'code': 'CIBK', 'title': '中信银行'},
        {'code': 'MSBC', 'title': '民生银行'},

        {'code': 'GDBK', 'title': '广发银行'},
        {'code': 'SPDB', 'title': '浦发银行'},
        {'code': 'FJIB', 'title': '兴业银行'},
        {'code': 'EVER', 'title': '光大银行'},
        {'code': 'ZJCB', 'title': '浙商银行'},
        {'code': 'CTBA', 'title': '澳大利亚联邦银行'},
        {'code': 'ANBK', 'title': '鞍山银行'},
        {'code': 'ANZB', 'title': '澳新银行'},
        {'code': 'NOLA', 'title': '北德意志州银行'},
        {'code': 'CHBH', 'title': '渤海银行'},

        {'code': 'BRCB', 'title': '北京农村商业银行'},
        {'code': 'BJCN', 'title': '北京银行'},
        {'code': 'BARC', 'title': '巴克莱银行'},
        {'code': 'BARB', 'title': '巴罗达银行'},
        {'code': 'KRED', 'title': '比利时联合银行'},
        {'code': 'BTCB', 'title': '包商银行'},
        {'code': 'CDRC', 'title': '成都农村商业银行'},
        {'code': 'CBOC', 'title': '成都银行'},
        {'code': 'CSCB', 'title': '常熟农村商业银行'},
        {'code': 'DDBK', 'title': '丹东银行'},
        
        {'code': 'CRLY', 'title': '东方汇理银行'},
        {'code': 'DGCB', 'title': '东莞银行'},
        {'code': 'UOVB', 'title': '大华银行'},
        {'code': 'DLCB', 'title': '大连银行'},
        {'code': 'DSBA', 'title': '大新银行'},
        {'code': 'DECC', 'title': '德阳银行'},
        {'code': 'BEAS', 'title': '东亚银行'},
        {'code': 'DYSH', 'title': '东营银行'},
        {'code': 'DEUT', 'title': '德意志银行'},
        {'code': 'FSBC', 'title': '富邦华一银行'},

        {'code': 'KCCB', 'title': '富滇银行'},
        {'code': 'BNPA', 'title': '法国巴黎银行'},
        {'code': 'NATX', 'title': '法国外贸银行'},
        {'code': 'SGCL', 'title': '法国兴业银行'},
        {'code': 'PNBP', 'title': '富国银行'},
        {'code': 'FZCB', 'title': '福建海峡银行'},
        {'code': 'FXBK', 'title': '阜新银行'},
        {'code': 'GDHB', 'title': '广东华兴银行'},
        {'code': 'RCNH', 'title': '广东南海农村商业银行'},
        {'code': 'RCCS', 'title': '广东顺德农村商业银行'},
        
        {'code': 'SDBC', 'title': '国家开发银行'},
        {'code': 'GLBK', 'title': '桂林银行'},
        {'code': 'CZNB', 'title': '国民银行'},
        {'code': 'BGBK', 'title': '广西北部湾银行'},
        {'code': 'GYCB', 'title': '贵阳银行'},
        {'code': 'GZRC', 'title': '广州农村商业银行'},
        {'code': 'BKGZ', 'title': '赣州银行'},
        {'code': 'GZCB', 'title': '广州银行'},
        {'code': 'BKSH', 'title': '河北银行'},
        {'code': 'BKHD', 'title': '邯郸银行'},

        {'code': 'HCCB', 'title': '哈尔滨银行'},
        {'code': 'HSBC', 'title': '汇丰银行'},
        {'code': 'KODB', 'title': '韩国产业银行'},
        {'code': 'SHBK', 'title': '韩国新韩银行'},
        {'code': 'WHCB', 'title': '汉口银行'},
        {'code': 'INGB', 'title': '荷兰安智银行'},
        {'code': 'RABO', 'title': '荷兰合作银行'},
        {'code': 'DRCB', 'title': '黑龙江东宁农村商业银行'},
        {'code': 'EWBK', 'title': '华美银行'},
        {'code': 'CITI', 'title': '花旗银行'},

        {'code': 'OCBC', 'title': '华侨银行'},
        {'code': 'HASE', 'title': '恒生银行'},
        {'code': 'CNMB', 'title': '华商银行'},
        {'code': 'HXBK', 'title': '华夏银行'},
        {'code': 'HNBN', 'title': '韩亚银行'},
        {'code': 'HRCN', 'title': '惠州农村商业银行'},
        {'code': 'HZCB', 'title': '杭州银行'},
        {'code': 'JHCB', 'title': '金华银行'},
        {'code': 'BOJJ', 'title': '九江银行'},
        {'code': 'HCRR', 'title': '吉林珲村农村商业银行'},

        {'code': 'JTCB', 'title': '吉林九台农村商业银行'},
        {'code': 'JLBK', 'title': '吉林银行'},
        {'code': 'NOSC', 'title': '加拿大丰业银行'},
        {'code': 'ROYC', 'title': '加拿大皇家银行'},
        {'code': 'BKJN', 'title': '济宁银行'},
        {'code': 'DYCB', 'title': '江苏丹阳农村商业银行'},
        {'code': 'HRCB', 'title': '江苏海安农村商业银行'},
        {'code': 'HMCB', 'title': '江苏海门农村商业银行'},
        {'code': 'RCWJ', 'title': '江苏靖江农村商业银行'},
        {'code': 'JYCB', 'title': '江苏江阴农村商业银行'},

        {'code': 'JRCB', 'title': '江苏姜堰农村商业银行'},
        {'code': 'NRCB', 'title': '江苏南通农村商业银行'},
        {'code': 'PZCB', 'title': '江苏邳州农村商业银行'},
        {'code': 'RRCB', 'title': '江苏如东农村商业银行'},
        {'code': 'RGCB', 'title': '江苏如皋农村商业银行'},
        {'code': 'JSCB', 'title': '江苏射阳农村商业银行'},
        {'code': 'WJRB', 'title': '江苏吴江农村商业银行'},
        {'code': 'JYHR', 'title': '江苏盐城黄海农村商业银行'},
        {'code': 'BOJS', 'title': '江苏银行'},
        {'code': 'JSHB', 'title': '晋商银行'},

        {'code': 'URCC', 'title': '江苏宜兴农村商业银行'},
        {'code': 'YZRC', 'title': '江苏扬州农村商业银行'},
        {'code': 'JRZC', 'title': '江苏紫金农村商业银行'},
        {'code': 'BOJX', 'title': '嘉兴银行'},
        {'code': 'CIYU', 'title': '集友银行'},
        {'code': 'JZCB', 'title': '锦州银行'},
        {'code': 'CKLB', 'title': '昆仑银行'},
        {'code': 'BOLF', 'title': '廊坊银行'},
        {'code': 'LJBC', 'title': '龙江银行'},
        {'code': 'LSCC', 'title': '乐山市商业银行'},

        {'code': 'LWCB', 'title': '莱商银行'},
        {'code': 'LYCB', 'title': '临商银行'},
        {'code': 'LCOM', 'title': '辽阳银行'},
        {'code': 'BOLY', 'title': '洛阳银行'},
        {'code': 'LZCB', 'title': '兰州银行'},
        {'code': 'LZBK', 'title': '柳州银行'},
        {'code': 'CHAS', 'title': '摩根大通银行'},
        {'code': 'BOFO', 'title': '美国建东银行'},
        {'code': 'MSBK', 'title': '摩根士丹利国际银行'},
        {'code': 'NAGO', 'title': '民古屋银行'},

        {'code': 'BOFA', 'title': '美国银行'},
        {'code': 'MBBE', 'title': '马来亚银行'},
        {'code': 'BOFM', 'title': '蒙特利尔银行'},
        {'code': 'DHBC', 'title': '宁波东海银行'},
        {'code': 'BINH', 'title': '宁波通商银行'},
        {'code': 'BKNB', 'title': '宁波银行'},
        {'code': 'NCCC', 'title': '南充市商业银行'},
        {'code': 'NCCK', 'title': '南昌银行'},
        {'code': 'NJCB', 'title': '南京银行'},
        {'code': 'HSSY', 'title': '内蒙古银行'},

        {'code': 'YCCB', 'title': '宁夏银行'},
        {'code': 'NYCB', 'title': '南洋商业银行'},
        {'code': 'BNYM', 'title': '纽约银行'},
        {'code': 'SSVB', 'title': '浦发硅谷银行'},
        {'code': 'BKKB', 'title': '盘谷银行'},
        {'code': 'QDRC', 'title': '青岛农村商业银行'},
        {'code': 'QCCB', 'title': '青岛银行'},
        {'code': 'BOXN', 'title': '青海银行'},
        {'code': 'JNSH', 'title': '齐鲁银行'},
        {'code': 'ZBBK', 'title': '齐商银行'},

        {'code': 'IBKO', 'title': '企业银行'},
        {'code': 'QRCB', 'title': '泉州农村商业银行'},
        {'code': 'BKQZ', 'title': '泉州银行'},
        {'code': 'ESSE', 'title': '瑞典北欧斯安银行'},
        {'code': 'CRES', 'title': '瑞士信贷银行'},
        {'code': 'UBSW', 'title': '瑞士银行'},
        {'code': 'MHCB', 'title': '瑞穗银行'},
        {'code': 'RZCB', 'title': '日照银行'},
        {'code': 'SGRB', 'title': '山东寿光农村商业银行'},
        {'code': 'MBTC', 'title': '首都银行'},

        {'code': 'ZDRB', 'title': '山东张店农村商业银行'},
        {'code': 'ABNA', 'title': '苏格兰皇家银行'},
        {'code': 'SHRC', 'title': '上海农村商业银行'},
        {'code': 'BOSH', 'title': '上海银行'},
        {'code': 'SYCB', 'title': '盛京银行'},
        {'code': 'SMBC', 'title': '三井住友银行'},
        {'code': 'BOTK', 'title': '三菱东京日联银行'},
        {'code': 'IBXH', 'title': '厦门国际银行'},
        {'code': 'RCXM', 'title': '厦门农村商业银行'},
        {'code': 'CBXM', 'title': '厦门银行'},

        {'code': 'YDBK', 'title': '陕西药都农村商业银行'},
        {'code': 'SXCB', 'title': '绍兴银行'},
        {'code': 'SRCC', 'title': '深圳农村商业银行'},
        {'code': 'BHRC', 'title': '天津滨海农村商业银行'},
        {'code': 'TJRC', 'title': '天津农村商业银行'},
        {'code': 'TCCB', 'title': '天津银行'},
        {'code': 'BOTS', 'title': '唐山市商业银行'},
        {'code': 'TZBK', 'title': '台州银行'},
        {'code': 'WRCB', 'title': '潍坊农村商业银行'},
        {'code': 'WFCB', 'title': '潍坊银行'},

        {'code': 'WRCC', 'title': '武汉农村商业银行'},
        {'code': 'KOEX', 'title': '外换银行'},
        {'code': 'WHBK', 'title': '威海银行'},
        {'code': 'UCCB', 'title': '乌鲁木齐商业银行'},
        {'code': 'HFCB', 'title': '徽商银行'},
        {'code': 'WZCB', 'title': '温州银行'},
        {'code': 'IXAB', 'title': '西安银行'},
        {'code': 'CBNB', 'title': '协和银行'},
        {'code': 'DBSS', 'title': '新加坡发展银行'},
        {'code': 'COXI', 'title': '新联商业银行'},

        {'code': 'WPAC', 'title': '西太平洋银行'},
        {'code': 'YBRC', 'title': '延边农村商业银行'},
        {'code': 'BCIT', 'title': '意大利联合圣保罗银行'},
        {'code': 'BROM', 'title': '意大利联合信贷'},
        {'code': 'WIHB', 'title': '永亨银行'},
        {'code': 'YKCB', 'title': '营口银行'},
        {'code': 'HVBK', 'title': '友利银行'},
        {'code': 'ZFRB', 'title': '烟台农村商业银行'},
        {'code': 'CRCK', 'title': '长春农村商业银行'},
        {'code': 'SCBL', 'title': '渣打银行'},

        {'code': 'ICBC', 'title': '兆丰国际商业银行'},
        {'code': 'EIBC', 'title': '中国进出口银行'},
        {'code': 'ADBN', 'title': '中国农业发展银行'},
        {'code': 'CTCB', 'title': '中国信托银行'},
        {'code': 'ZRCB', 'title': '珠海农村商业银行'},
        {'code': 'CZCB', 'title': '浙江稠州银行'},
        {'code': 'HCRC', 'title': '浙江禾城农村商业银行'},
        {'code': 'YHBK', 'title': '浙江杭州余杭农村商业银行'},
        {'code': 'ZJMT', 'title': '浙江民泰商业银行'},
        {'code': 'ZJTL', 'title': '浙江泰隆商业银行'},

        {'code': 'LCBK', 'title': '浙江温州鹿城农村商业银行'},
        {'code': 'ZXBK', 'title': '浙江新昌农村商业银行'},
        {'code': 'YWBK', 'title': '浙江义乌农村商业银行'},
        {'code': 'ZJRB', 'title': '浙江诸暨农村商业银行'},
        {'code': 'ZJPT', 'title': '浙江舟山普陀农村商业银行'},
        {'code': 'CQRB', 'title': '重庆农村商业银行'},
        {'code': 'CTGB', 'title': '重庆三峡银行'},
        {'code': 'CQCB', 'title': '重庆银行'},
        {'code': 'CHCC', 'title': '长沙银行'},
        {'code': 'ZXBC', 'title': '正信银行'},

        {'code': 'ZZBK', 'title': '郑州银行'},
        {'code': '9999', 'title': '其他（如第三方支付牌照）'},
    ],
    
    hasBank(bank) {
        for (let item of this.bankCodeList) {
          if (item.title === bank) {
            return true;      
          }
        }
        return false;   
    },
    getBank(bankName){
        for (let item of this.bankCodeList) {
            if (item.title === bankName) {
              return item;      
            }
        }
    },
    findBanks(bankName){
        let banks = [];
        let i = 0;
        if(bankName){
            for (let item of this.bankCodeList) {
                if (item.title.indexOf(bankName) != -1) {
                    let t = {};
                    t.idx = i++;
                    t.code = item.code;
                    t.title = item.title;
                    banks.push(t);    
                }
            }
        }else{
            for (let item of this.bankCodeList) {
                let t = {};
                t.idx = i++;
                t.code = item.code;
                t.title = item.title;
                banks.push(t);    
            } 
        }      
        return banks;   
    }

};
export default code;