import type { FC } from 'react';

import { LockOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Dropdown, Layout, Modal, Space, theme as antTheme, Tooltip, Typography } from 'antd';
import { createElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Avator from '@/assets/header/avator.jpeg';
import { ReactComponent as EnUsSvg } from '@/assets/header/en_US.svg';
import Guest from '@/assets/header/guest.png';
import { ReactComponent as LanguageSvg } from '@/assets/header/language.svg';
import Logo from '@/assets/header/logo.png';
import { ReactComponent as MoonSvg } from '@/assets/header/moon.svg';
import { ReactComponent as SunSvg } from '@/assets/header/sun.svg';
import { LocaleFormatter, useLocale } from '@/locales';
import { setGlobalState } from '@/stores/global.store';
import { setUserItem } from '@/stores/user.store';

import { logoutAsync } from '../../stores/user.action';
import { salePosition } from '../UserManagement/UserManagement/UserManagement';
import FormChangePassword from './formChangePassword';
import HeaderNoticeComponent from './notice';

const { Header } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

type Action = 'userInfo' | 'userSetting' | 'logout';

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
  const { logged, locale, device, user } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.global);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const token = antTheme.useToken();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();

  const onActionClick = async (action: Action) => {
    switch (action) {
      case 'userInfo':
        return;
      case 'userSetting':
        return;
      case 'logout':
        const res = Boolean(await dispatch(logoutAsync()));

        res && navigate('/login');

        return;
    }
  };

  const toLogin = () => {
    navigate('/login');
  };

  const selectLocale = ({ key }: { key: any }) => {
    dispatch(setUserItem({ locale: key }));
    localStorage.setItem('locale', key);
  };

  const onChangeTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);
    dispatch(
      setGlobalState({
        theme: newTheme,
      }),
    );
  };

  return (
    <Header className="layout-page-header bg-2" style={{ backgroundColor: token.token.colorBgContainer }}>
      {device !== 'MOBILE' && (
        <div className="logo" style={{ width: collapsed ? 80 : 200 }}>
          <img src={Logo} alt="Logo" style={{ marginRight: collapsed ? '2px' : '20px' }} />
        </div>
      )}
      <div className="layout-page-header-main">
        <div onClick={toggle}>
          <span id="sidebar-trigger">{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
        </div>
        <div className="actions">
          <Space size="middle">
            <Text>[{user?.staff_code}]</Text>
            <Space>
              <Text>{user?.fullname}</Text>
              <Text>-</Text>
              <Text>{salePosition?.[Number(user?.SaleLevel?.level) - 1]}</Text>
            </Space>
          </Space>
          <Tooltip
            title={formatMessage({
              id: theme === 'dark' ? 'gloabal.tips.theme.lightTooltip' : 'gloabal.tips.theme.darkTooltip',
            })}
          >
            <span>
              {createElement(theme === 'dark' ? SunSvg : MoonSvg, {
                onClick: onChangeTheme,
              })}
            </span>
          </Tooltip>
          {/* <HeaderNoticeComponent /> */}
          {/* <Dropdown
              menu={{
                onClick: info => selectLocale(info),
                items: [
                  {
                    key: 'zh_CN',
                    icon: <ZhCnSvg />,
                    disabled: locale === 'zh_CN',
                    label: '简体中文',
                  },
                  {
                    key: 'en_US',
                    icon: <EnUsSvg />,
                    disabled: locale === 'en_US',
                    label: 'English',
                  },
                ],
              }}
            >
              <span>
                <LanguageSvg id="language-change" />
              </span>
            </Dropdown> */}

          {logged ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: '1',
                    icon: <LockOutlined />,
                    label: <span onClick={() => setOpen(true)}>Đổi mật khẩu</span>,
                  },
                  {
                    key: '2',
                    icon: <LogoutOutlined />,
                    label: (
                      <span onClick={() => onActionClick('logout')}>
                        <LocaleFormatter id="header.avator.logout" />
                      </span>
                    ),
                  },
                ],
              }}
            >
              <span className="user-action">
                <img src={user?.avatar_url || Guest} className="user-avator" alt="avator" style={{ borderRadius: 6 }} />
              </span>
            </Dropdown>
          ) : (
            <span style={{ cursor: 'pointer' }} onClick={toLogin}>
              {formatMessage({ id: 'gloabal.tips.login' })}
            </span>
          )}
        </div>
        <Modal
          title="Thay đổi mật khẩu"
          centered
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          // width={1000}
          footer={false}
        >
          <FormChangePassword />
        </Modal>
      </div>
    </Header>
  );
};

export default HeaderComponent;
