import type { MenuList } from '@/interface/layout/menu.interface';

export const menuListHandle: MenuList = [
  // {
  //   code: 'dashboard',
  //   icon: 'dashboard',
  //   label: { zh_CN: '首页', en_US: 'Dashboard' },
  //   path: '/dashboard',
  // },
  {
    code: 'team-managament',
    icon: 'product',
    label: {
      en_US: 'Quản lý đội nhóm',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'list-of-stocks',
        label: {
          en_US: 'Danh sách nhân viên',
          zh_CN: '基本',
        },
        path: '/team-managament/list-of-employee',
      },
      // {
      //   code: 'service-pack',
      //   label: {
      //     en_US: 'Hoa hồng thành viên',
      //     zh_CN: '基本',
      //   },
      //   path: '/team-managament/membership-commission',
      // },
    ],
  },
  {
    code: 'customer-management',
    icon: 'notification',
    label: {
      en_US: 'Quản lý khách hàng',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'service-pack',
        label: {
          en_US: 'Danh sách khách hàng',
          zh_CN: '基本',
        },
        path: '/customer-management/list-customer',
      },
    ],
  },

  {
    code: 'contract',
    icon: 'contract',
    label: {
      en_US: 'Quản lý hợp đồng ',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'recommendations',
        label: {
          en_US: 'Hợp đồng có hiệu lực',
          zh_CN: '基本',
        },
        path: '/contract/active',
      },
      {
        code: 'recommendations',
        label: {
          en_US: 'Hợp đồng đã thanh lý',
          zh_CN: '基本',
        },
        path: '/contract/block',
      },
    ],
  },
  {
    code: 'interest-rate',
    icon: 'rate',
    label: {
      en_US: 'Quản lý hoa hồng',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'service-pack',
        label: {
          en_US: 'Hoa hồng thành viên',
          zh_CN: '基本',
        },
        path: '/interest-rate/set-interest-rate',
      },
    ],
  },
];
