'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Button, message, ConfigProvider, theme } from 'antd';
import { DashboardOutlined, TeamOutlined, LogoutOutlined, SafetyCertificateOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      messageApi.success('Đã đăng xuất!');
      router.push('/admin/login');
    } catch (e) {
      messageApi.error('Lỗi khi đăng xuất');
    }
  };

  const handleMenuClick = (e: { key: string }) => {
    router.push(e.key);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: '#F3F4F6',
            headerBg: '#FFFFFF',
            siderBg: '#0f172a', // Slate 900
          },
          Menu: {
            darkItemBg: '#0f172a',
            darkItemSelectedBg: '#3b82f6', // Blue 500
            darkItemHoverBg: '#1e293b', // Slate 800
            darkItemColor: '#94a3b8',
            darkItemSelectedColor: '#FFFFFF',
            itemBorderRadius: 12,
            itemMarginInline: 12,
          }
        },
      }}
    >
      {contextHolder}
      <Layout style={{ minHeight: '100vh', background: '#F3F4F6', padding: '16px' }}>
        
        {/* Floating Detached Sider */}
        <Sider 
          theme="dark" 
          width={260}
          breakpoint="lg" 
          collapsedWidth="0"
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
          collapsible
          style={{ 
            borderRadius: 24, 
            overflow: 'hidden', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            height: 'calc(100vh - 32px)',
            position: 'sticky',
            top: 16,
            left: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <SafetyCertificateOutlined style={{ fontSize: collapsed ? 24 : 28, color: '#3b82f6', marginRight: collapsed ? 0 : 12, transition: 'all 0.2s' }} />
            {!collapsed && <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>VIN<span style={{color: '#3b82f6'}}>CODE</span></span>}
          </div>
          <div style={{ flex: 1, padding: '24px 0' }}>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[pathname]}
              onClick={handleMenuClick}
              style={{ borderRight: 0, background: 'transparent' }}
              items={[
                {
                  key: '/admin/dashboard',
                  icon: <DashboardOutlined style={{ fontSize: 18 }} />,
                  label: <span style={{ fontWeight: 600, fontSize: 15 }}>Tổng quan</span>,
                },
                {
                  key: '/admin/students',
                  icon: <TeamOutlined style={{ fontSize: 18 }} />,
                  label: <span style={{ fontWeight: 600, fontSize: 15 }}>Danh sách học sinh</span>,
                },
              ]}
            />
          </div>
          <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
             {!collapsed && (
               <a href="https://vincode.xyz/" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>
                 Powered by <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>Vincode</span>
               </a>
             )}
          </div>
        </Sider>
        
        {/* Main Layout Area */}
        <Layout style={{ background: 'transparent', paddingLeft: collapsed ? 0 : 24, transition: 'all 0.2s', width: '100%' }}>
          
          {/* Floating Header */}
          <Header style={{ 
            padding: '0 16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: '#FFFFFF',
            borderRadius: 20,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
            height: 72,
            lineHeight: '72px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 16, width: 40, height: 40, borderRadius: 12 }}
              />
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }} className="hidden sm:block">
                Hệ Thống Quản Trị
              </div>
            </div>
            <Button 
              type="text" 
              danger 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
              style={{ fontWeight: 600, borderRadius: 12 }}
            >
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </Header>
          
          {/* Content Area */}
          <Content style={{ 
            marginTop: 24, 
            background: 'transparent',
            borderRadius: 24, 
            overflow: 'auto',
          }}>
            {children}
          </Content>
        </Layout>

      </Layout>
    </ConfigProvider>
  );
}

