import Cookies from "js-cookie";

let common = {
    website: 'https://tuodao.tqwl.net',
    //website: 'http://localhost:22222',
    //website: 'http://192.168.101.11:22222',
    //website: 'http://192.168.101.12:22222',
    //website: 'https://dev.tqwl.net',
    articleState: {
        draft: 'draft',
        published: 'published'
    },
    memberState: {
        normal: 'normal',
        locked: 'locked',
        parse(kind) {
            switch (kind) {
                case "normal":
                    return "正常";
                case "locked":
                    return "锁定";
                default:
                    return "正常";
            }
        }
        
    },
    vehicleState: {
        empty: { code: 'empty', name: '空车' },
        carpool: { code: 'carpool', name: '可拼车' },
        transport: { code: 'transport', name: '运输中' },
        off: { code: 'off', name: '停运' }
    },

    convertKindToString: {
        0x08: { code: 0x08, name: '普货' },
        0x01: { code: 0x01, name: '专线' },
        0x0100: { code: 0x0100, name: '冷链' },
        0x04: { code: 0x04, name: '零担(快运)' },
        0x02: { code: 0x02, name: '快递' },
        0x10: { code: 0x10, name: '大件运输' },
        0x20: { code: 0x20, name: '危化品' },
        0x80: { code: 0x80, name: '国际物流' },
        0x40: { code: 0x40, name: '物流园区' }
    },

    convertKindToNumber: {
        '普货': { code: 0x08, name: '普货' },
        '专线': { code: 0x01, name: '专线' },
        '冷链': { code: 0x0100, name: '冷链' },
        '零担(快运)': { code: 0x04, name: '零担(快运)' },
        '快递': { code: 0x02, name: '快递' },
        '大件运输': { code: 0x10, name: '大件运输' },
        '危化品': { code: 0x20, name: '危化品' },
        '国际物流': { code: 0x80, name: '国际物流' },
        '物流园区': { code: 0x40, name: '物流园区' }
    },
    royaltyState: {
        new: { code: 'new', name: '未兑' },
        took: { code: 'took', name: '已兑' }
    },

    checkState: {
        uncheck: { code: 'uncheck', name: '未审核' },
        pass: { code: 'pass', name: '通过' },
        failed: { code: 'failed', name: '失败' }
    },

    roleKind: {
        admin: "admin",
        backstager: "backstager",
        manager: "manager",
        leader: "leader",
        promoter: "promoter",
        company: "company",
        employee: "employee",
        driver: "driver",
        guest: "guest",
        agency: "agency",
        netfreight: "netfreight",
        member: "member",
        parse(kind) {
            switch (kind) {
                case "admin":
                    return "管理员";
                case "backstager":
                    return "客服";
                case "manager":
                    return "主管";
                case "leader":
                    return "组长";
                case "promoter":
                    return "推广员";
                case "company":
                    return "企业";
                case "employee":
                    return "员工";
                case "driver":
                    return "司机";
                case "guest":
                    return "游客";
                case "agency":
                    return "信息部";
                case "netfreight":
                    return "无车承运";
                default:
                    return "会员";
            }
        }
    },
    user: {
        token: Cookies.get("user.token"),
        //"tt/qJwGPyderpCFscGEPshbFLFQII7UmKaY9i/m01oZYwQEYXMz2K2KBB4+R77xqmVEKGDftkxyT4RPtbHDjbPk2ebzZ2F8Utdx8T3D9ndLMVPde4NXOUL5b+hcBiq4jg+xI7gbm3Jnb9ecbaITtnbCxgtAxRVnpJUM+RtpkcsU=",
        account: Cookies.get("user.account"),
        id: Cookies.get("user.id"),
        name: Cookies.get("user.name"),
        role: Cookies.get("user.role"),
        readload() {
            this.token = Cookies.get("user.token");
            this.account = Cookies.get("user.account");
            this.id = Cookies.get("user.id");
            this.name = Cookies.get("user.name");
            this.role = Cookies.get("user.role");
        },
        hasRoles(roles) {
            if (!roles)
                return false;
            for (const role of roles) {
                if (this.role === role) return true
            }

            return false;
        },
    },
    messageKind: {
        cargo: 0x0004 | 0x0100,
        car: 0x0004 | 0x0200,
        parse(kind) {
            switch (kind) {
                case this.cargo:
                    return "货源";
                case this.car:
                    return "车源";
            }
        }
    },

    //直辖市城市验证
    inCityArray(cityName) {
        let creg = ["北京", "天津", "上海", "重庆"];
        return creg.indexOf(cityName) > -1;
    },

    formatCity(city) {
        city = city || "";
        if (city.startsWith("北京") || city.startsWith("天津") || city.startsWith("上海") || city.startsWith("重庆")) {
            city = city.replace("/", "");
        } else {
            let list = city.split("/");
            if (list.length > 1)
                list.splice(0, 1);
            city = list.join("");
        }
        return city;
    },

    //格式化经营路线区域
    formatAdmin(address) {
        let list = address.split('/');
        switch (list.length) {
            case 1:
                address = list[0];
                break;
            case 2:
                address = list[1];
                break;
            case 3:
                address = list[2];
                break;
        }
        return address;
    },
    // 对Date的扩展，将 Date 转化为指定格式的String  
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，  
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)  
    // 例子：  
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423  
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
    dateFromat(date, fmt) { //author: meizz
        var o = {
            "M+": date.getMonth() + 1, //月份  
            "d+": date.getDate(), //日  
            "h+": date.getHours(), //小时  
            "m+": date.getMinutes(), //分  
            "s+": date.getSeconds(), //秒  
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度  
            "S": date.getMilliseconds() //毫秒  
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    round(value, m) {
        let p = Math.pow(10, m);
        return Math.round(value * p) / p;
    },
    parseImageUrl(filename) {
        return this.website + '/images/' + filename;
    },
    parseObjectImagesUrl(images, kind) {
        let list = [];
        for (let item of images) {
            list.push({
                id: item.id,
                status: "finished",
                kind: kind,
                filename: item.filename,
                url: this.website + "/images/" + item.filename
            });
        }
        return list;
    },
    parseStringImagesUrl(filenameList, kind) {
        let list = [];
        for (let item of filenameList) {
            list.push({
                status: "finished",
                kind: kind,
                filename: item,
                url: this.website + "/images/" + item
            });
        }
        return list;
    }
};
export default common;