const routers = [
    {
        path: '/',
        meta: { title: '' },
        component: (resolve) => require(['./views/login.vue'], resolve)
    }, {
        path: '/home',
        meta: { requireAuth: true },
        component: (resolve) => require(['./views/home.vue'], resolve),
        redirect: { name: 'system-count' },
        children: [
            {
                path: 'total',
                meta: { requireAuth: true },
                title: '首页',
                name: 'system-count',
                component: (resolve) => require(['./views/systemCount/systemCount.vue'], resolve)
            },
            {
                path: 'custom',
                meta: { requireAuth: true },
                title: '客户管理',
                name: 'custom-admin',
                component: (resolve) => require(['./views/custom/admin.vue'], resolve),
                redirect: { name: 'member-admin' },
                children: [
                    {
                        path: '',
                        meta: { requireAuth: true },
                        component: (resolve) => require(['./views/custom/member/member.vue'], resolve),
                    },
                    {
                        path: 'member',
                        meta: { requireAuth: true },
                        title: '会员管理',
                        name: 'member-admin',
                        component: (resolve) => require(['./views/custom/member/member.vue'], resolve)
                    },
                    {
                        path: 'vehicle',
                        meta: { requireAuth: true },
                        title: '车辆管理',
                        name: 'vehicle-admin',
                        component: (resolve) => require(['./views/custom/vehicle/vehicle.vue'], resolve)
                    },
                    {
                        path: 'company',
                        meta: { requireAuth: true },
                        title: '企业管理',
                        name: 'company-admin',
                        component: (resolve) => require(['./views/custom/company/company.vue'], resolve),

                    },
                    {
                        path: 'client',
                        meta: { requireAuth: true },
                        title: '客户审核',
                        name: 'client-admin',
                        component: (resolve) => require(['./views/custom/promoter/client.vue'], resolve),

                    },
                    {
                        path: 'score',
                        meta: { requireAuth: true },
                        title: '积分结算',
                        name: 'score-admin',
                        component: (resolve) => require(['./views/custom/promoter/score.vue'], resolve),

                    },
                    {
                        path: 'count',
                        name: 'company-count',
                        meta: { requireAuth: true },
                        component: (resolve) => require(['./views/custom/company/companyCount/companyCount.vue'], resolve),
                    }
                ]
            }, {
                path: 'system',
                meta: { requireAuth: true },
                title: '系统设置',
                name: 'system-admin',
                component: (resolve) => require(['./views/system/admin.vue'], resolve),
                redirect: { name: 'user-admin' },
                children: [
                    {
                        path: '',
                        meta: { requireAuth: true },
                        component: (resolve) => require(['./views/system/user/user.vue'], resolve),
                    },
                    {
                        path: 'user',
                        meta: { requireAuth: true },
                        title: '后台用户',
                        name: 'user-admin',
                        component: (resolve) => require(['./views/system/user/user.vue'], resolve)
                    },
                    {
                        path: 'message',
                        meta: { requireAuth: true },
                        title: '大众消息',
                        name: 'message-admin',
                        component: (resolve) => require(['./views/system/message/message.vue'], resolve)
                    },
                    {
                        path: 'media',
                        meta: { requireAuth: true },
                        title: '多媒体上传',
                        name: 'media-admin',
                        component: (resolve) => require(['./views/system/media/media.vue'], resolve)
                    },
                    {
                        path: 'advert',
                        meta: { requireAuth: true },
                        title: '轮播广告上传',
                        name: 'advert-admin',
                        component: (resolve) => require(['./views/system/advert/advert.vue'], resolve)
                    }, {
                        path: 'guide',
                        meta: { requireAuth: true },
                        title: '注册引导页',
                        name: 'guide-admin',
                        component: (resolve) => require(['./views/system/guide/guide.vue'], resolve)
                    },
                    {
                        path: 'mould',
                        meta: { requireAuth: true },
                        title: '图片模板上传',
                        name: 'mould-admin',
                        component: (resolve) => require(['./views/system/mould/mould.vue'], resolve)
                    },
                    {
                        path: 'product',
                        meta: { requireAuth: true },
                        title: '服务产品',
                        name: 'product-admin',
                        component: (resolve) => require(['./views/system/product/product.vue'], resolve)
                    },
                    {
                        path: 'market',
                        meta: { requireAuth: true },
                        title: '销售区域设置',
                        name: 'market-admin',
                        component: (resolve) => require(['./views/system/market/market.vue'], resolve)
                    },
                    {
                        path: 'royalty',
                        meta: { requireAuth: true },
                        title: '业务提成设置',
                        name: 'royalty-admin',
                        component: (resolve) => require(['./views/system/market/royalty.vue'], resolve)
                    }
                ]
            }
        ]
    }
];
export default routers;