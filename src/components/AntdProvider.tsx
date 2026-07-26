'use client';

import React from 'react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#E8899D',
          colorSuccess: '#2EAF7D',
          colorWarning: '#E8A838',
          colorError: '#D85545',
          colorInfo: '#5A9AB5',
          borderRadius: 12,
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 14,
          colorBgContainer: '#FFFFFF',
          colorBgLayout: '#FEFAF6',
          colorBorder: '#E8E0E2',
          controlHeight: 42,
          colorText: '#1A1A2E',
          colorTextSecondary: '#4A4A5A',
        },
        components: {
          Button: {
            primaryShadow: '0 4px 15px rgba(201, 107, 128, 0.3)',
            borderRadius: 12,
            controlHeight: 44,
            fontWeight: 600,
          },
          Input: {
            borderRadius: 12,
            controlHeight: 44,
          },
          Select: {
            borderRadius: 12,
            controlHeight: 44,
          },
          Card: {
            borderRadiusLG: 16,
          },
          Steps: {
            colorPrimary: '#E8899D',
          },
          Slider: {
            trackBg: '#E8899D',
            trackHoverBg: '#C96B80',
            handleColor: '#E8899D',
            handleActiveColor: '#C96B80',
            dotActiveBorderColor: '#E8899D',
          },
          Rate: {
            colorFillContent: '#E8E0E2',
          },
          Table: {
            headerBg: '#FDE8EE',
            headerColor: '#1A1A2E',
            borderRadius: 12,
          },
          Tag: {
            borderRadiusSM: 8,
          },
          Modal: {
            borderRadiusLG: 16,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
