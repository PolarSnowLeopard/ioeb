// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: {
      name: 'home'
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
            title: '首页',
            keepAlive: true,
            icon: 'home',
            permission: ['admin', 'publisher', 'user']
        },
        component: () => import('@/views/dashboard/Analysis')
      },
      // 技术资源服务发布
      {
        path: '/virtual',
        name: 'virtual',
        redirect: '/schedule/divideSys',
        component: RouteView,
        meta: { title: '技术资源服务发布', keepAlive: true, icon: 'cloud', permission: ['admin', 'publisher'] },
        children: [
          {
            path: '/virtual/diagram',
            name: 'diagram',
            component: () => import('@/views/microservices/PresetTemplate'),
            meta: { title: '资源微服务化标准模版', keepAlive: true, permission: ['admin', 'publisher'] }
          },
          {
            path: '/schedule/divideSys',
            name: 'divideSys',
            component: () => import('@/views/schedule/DivideSystem'),
            meta: { title: '单体应用微服务化参考', keepAlive: true, permission: ['admin', 'publisher'] }
          },
          {
            path: '/schedule/divideSys2',
            name: 'divideSys2',
            meta: { title: '应用微服务封装与发布', keepAlive: true, permission: ['admin', 'publisher'] },
            component: () => import('@/views/service-publish/publish')
          },
          {
            path: '/service/detail',
            name: 'ServiceDetail',
            component: () => import('@/views/microservices/modules/ServiceDetail'),
            hidden: true,
            meta: { title: '服务规范', keepAlive: true }
          },
          {
            path: '/service/Category',
            name: 'ServiceCategory',
            component: () => import('@/views/microservices/ServiceCategory'),
            hidden: true,
            meta: { title: '服务类别详情-前沿装备类', keepAlive: true }
          },
          {
            path: '/service/Category1',
            name: 'ServiceCategory1',
            component: () => import('@/views/microservices/ServiceCategory1'),
            hidden: true,
            meta: { title: '服务类别详情-反洗钱合规类', keepAlive: true }
          },
          {
            path: '/service/Category2',
            name: 'ServiceCategory2',
            component: () => import('@/views/microservices/ServiceCategory2'),
            hidden: true,
            meta: { title: '服务类别详情-数据隐私保护类', keepAlive: true }
          },
          {
            path: '/service/Category3',
            name: 'ServiceCategory3',
            component: () => import('@/views/microservices/ServiceCategory3'),
            hidden: true,
            meta: { title: '服务类别详情-智能运维管理类', keepAlive: true }
          },
          {
            path: '/service/Category4',
            name: 'ServiceCategory4',
            component: () => import('@/views/microservices/ServiceCategory4'),
            hidden: true,
            meta: { title: '服务类别详情-数据分析与决策类', keepAlive: true }
          },
          {
            path: '/service/Category5',
            name: 'ServiceCategory5',
            component: () => import('@/views/microservices/ServiceCategory5'),
            hidden: true,
            meta: { title: '服务类别详情-网络安全防护类', keepAlive: true }
          }
        ]
      },
      // 微服务容器化管理
      {
        path: '/microservices',
        name: 'microservices',
        redirect: '/microservices/template',
        component: RouteView,
        meta: { title: '微服务容器化管理', keepAlive: true, icon: 'copy', permission: ['admin', 'publisher'] },
        children: [
          {
            path: '/microservices/list',
            name: 'microservices_list',
            component: () => import('@/views/microservices/ServiceList'),
            meta: { title: '技术资源微服务管理', keepAlive: true, permission: ['admin', 'publisher'] }
          },
          {
            path: '/microservices/service',
            name: 'service',
            component: () => import('@/views/microservices/Service'),
            meta: { title: '微服务测试与验证', keepAlive: true, permission: ['admin', 'publisher'] }
          },
          {
            path: '/microservices/container',
            name: 'container',
            component: () => import('@/views/microservices/Container'),
            meta: { title: '容器创建及部署', keepAlive: true, permission: ['admin', 'publisher'] }
          },
          {
            path: '/microservices/container/logs',
            name: 'container_logs',
            component: () => import('@/views/microservices/modules/Logs'),
            hidden: true,
            meta: { keepAlive: true, title: '容器日志' }
          },
          {
            path: '/microservices/container/json',
            name: 'container_output',
            component: () => import('@/views/microservices/modules/JsonContainer'),
            hidden: true,
            meta: { keepAlive: true, title: '容器详细信息' }
          }
        ]
      },
      // 应用服务动态组合
      {
        path: '/schedule',
        name: 'schedule',
        redirect: '/schedule/ef',
        component: RouteView,
        meta: { title: '应用服务动态组合', keepAlive: true, icon: 'copy', permission: ['user'] },
        children: [
          {
            path: '/schedule/ef',
            name: 'schedule_ef',
            component: () => import('@/views/schedule/Schedule'),
            meta: { title: '服务组合体动态编排', keepAlive: true, permission: ['user'] }
          },
          {
            path: '/dashboard/generator',
            name: 'generator',
            component: () => import('@/views/dashboard/Generator'),
            meta: { title: '服务组合体代码生成', keepAlive: true, permission: ['user'] }
          }
        ]
      },
      // 用户管理
      {
        path: '/management',
        name: 'management',
        redirect: '/management/role',
        component: RouteView,
        meta: { title: '用户管理', keepAlive: true, icon: 'setting', permission: ['admin', 'publisher'] },
        children: [
          {
            path: '/management/role',
            name: 'management_role',
            component: () => import('@/views/management/Role'),
            meta: { title: '角色管理', keepAlive: true, permission: ['admin', 'publisher'] }
          },
          {
            path: '/management/user',
            name: 'management_user',
            component: () => import('@/views/management/User'),
            meta: { title: '用户管理', keepAlive: true, permission: ['admin', 'publisher'] }
          },
          {
            path: '/management/permission',
            name: 'management_permission',
            component: () => import('@/views/management/PermissionList'),
            meta: { title: '用户权限', keepAlive: true, permission: ['admin', 'publisher'] }
          },
          {
            path: '/management/tenant',
            name: 'management_tenant',
            component: () => import('@/views/management/TenantList'),
            meta: { title: '租户管理', keepAlive: true, permission: ['admin', 'publisher'] }
          }
        ]
      },
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/endpoint',
        component: RouteView,
        meta: { title: '平台监控', keepAlive: true, icon: bxAnaalyse, permission: ['admin', 'publisher'] },
        children: [
          {
            path: '/dashboard/endpoint',
            name: 'Endpoint',
            component: () => import('@/views/dashboard/EndpointInfo'),
            meta: { title: '实时数据', keepAlive: false, permission: ['admin', 'publisher'] }
          },
          {
            path: '/dashboard/eureka',
            name: 'eureka',
            component: () => import('@/views/dashboard/Eureka'),
            meta: { title: '系统状态', keepAlive: true, permission: ['admin', 'publisher'] }
          }
        ]
      },
      // 应用实例
      {
        path: '/application',
        name: 'application',
        redirect: '/application/aircraft/history',
        component: RouteView,
        meta: { title: '应用实例', keepAlive: true, icon: 'pushpin', permission: ['user'] },
        children: [
          {
            path: '/application/aircraft',
            name: 'aircraft',
            redirect: '/application/aircraft/history',
            component: PageView,
            meta: { title: '应用实例：前沿装备远程操控系统', icon: 'pushpin', permission: ['user'] },
            children: [
              {
                path: '/application/aircraft/history',
                name: '轨迹页面',
                meta: { title: '体验安排', keepAlive: true, permission: ['user'] },
                component: () => import('@/views/Aircraft/History')
              },
              {
                path: '/application/aircraft/select',
                name: '前沿装备列表',
                meta: { title: '装备选择', keepAlive: true, permission: ['user'] },
                component: () => import('@/views/Aircraft/List')
              },
              {
                path: '/application/aircraft/live',
                name: '远程操纵',
                meta: { title: '远程实时操控', keepAlive: true, permission: ['user'] },
                component: () => import('@/views/Aircraft/Live')
              },
              {
                path: '/application/aircraft/simulate',
                name: '模拟远程操控',
                meta: { title: '模拟远程操控', keepAlive: true, permission: ['user'] },
                component: () => import('@/views/Aircraft/Simulate')
              }
            ]
          },
          {
            path: '/application/platform',
            name: '虚拟仿真案例应用',
            component: RouteView,
            meta: { title: '应用实例：虚拟仿真案例云微服务', icon: 'flag', permission: ['user'] },
            children: [
              {
                path: 'https://www.google.com',
                name: 'platform_info',
                meta: { title: '虚拟仿真教学档案', target: '_blank', permission: ['user'] }
              },
              {
                path: 'http://www.google.com',
                name: 'platform_list',
                meta: { title: '虚拟仿真列表', target: '_blank', permission: ['user'] }
              },
              {
                path: 'https://google.com',
                name: 'platform_other',
                meta: { title: '虚拟仿真体验', target: '_blank', permission: ['user'] }
              }
            ]
          }
        ]
      },
      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人中心', icon: 'user', keepAlive: true, permission: ['admin', 'publisher', 'user'] },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['admin', 'publisher', 'user'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['admin', 'publisher', 'user'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['admin', 'user']
                }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['admin', 'publisher', 'user'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['admin', 'publisher', 'user'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['admin', 'publisher', 'user']
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  }
]
