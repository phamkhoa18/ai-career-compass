'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Form, message } from 'antd';
import { Lock, User, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok) {
        message.success('Đăng nhập thành công!');
        router.push('/admin/dashboard');
      } else {
        message.error(data.error || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      message.error('Lỗi kết nối đến máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob w-96 h-96 bg-primary-light top-0 left-0" />
      <div className="blob w-[30rem] h-[30rem] bg-secondary-light bottom-0 right-0" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-main mb-2">Hệ Thống Quản Trị</h1>
            <p className="text-text-secondary text-sm">Đăng nhập để xem thống kê và báo cáo</p>
          </div>

          <Form name="admin_login" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
            >
              <Input
                prefix={<User size={18} className="text-text-light mr-2" />}
                placeholder="Nhập tài khoản"
                className="rounded-xl h-12"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<Lock size={18} className="text-text-light mr-2" />}
                placeholder="Nhập mật khẩu"
                className="rounded-xl h-12"
              />
            </Form.Item>

            <Form.Item className="mt-8 mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/30"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
        
        <p className="text-center text-xs text-text-light mt-8 font-medium">
          &copy; {new Date().getFullYear()} Hướng Nghiệp Tương Lai. Dành cho Ban Quản Trị.
        </p>
      </div>
    </div>
  );
}
