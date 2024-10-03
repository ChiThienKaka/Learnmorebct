import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';

const ErrorGiangVien: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        icon={<LockOutlined style={{ fontSize: '64px', color: '#ff4d4f' }} />}
        status="403"
        title="403 - Không có quyền truy cập"
        subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra quyền của bạn hoặc đăng nhập với tài khoản khác."
        extra={[
          <Button type="primary" onClick={handleBackHome} key="home">
            Về Trang Chủ
          </Button>,
        ]}
      />
    </div>
  );
};

export default ErrorGiangVien;
