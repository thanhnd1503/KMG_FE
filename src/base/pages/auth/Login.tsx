import { useContext, useEffect, useState } from 'react';
import { Button, Checkbox, Col, Flex, Form, Image, Input, Layout, Modal, Row, Space, Typography, notification, theme } from 'antd';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { LoginData } from '@base/types/auth';
import useUserActions from '@base/hooks/useUserActions';
import useToast from '@base/hooks/useToast';
import axios from 'axios';
import { formConfig } from '@base/configs/antdConfig';

const { Title, Paragraph, Text } = Typography;

function LoginPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { login, loginSuccess } = useUserActions();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(false);
  const [isMobileView, setIsMobileView] = useState(false)
  const onSubmit = async (formData: LoginData) => {
    setIsLoading(true);
    try {
      const res = await login(formData);
      if (res?.success) {
        const result = await loginSuccess(res);
        // localStorage.setItem('accessToken', `Bearer ${res?.access_token}`);
        if (result) {
          navigate('/');
          showToast({ content: 'Login successfully', type: 'success' });
        }
      } else {
        setError('Wrong login information!');
      }
      setIsLoading(false);
    } catch (error: any) {
      setError(error);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if(width < 480){
        setIsMobileView(true)
      }else{
        setIsMobileView(false)
      }
    };
    handleResize();

    // calc calcWidthContent when resize window
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const [form] = useForm();
  return (
    <div style={{ maxWidth: 532, margin: 'auto', height: '100vh' }}>
      <Flex style={{ height: '100%' }} align="center" justify="center" vertical>
        <Title style={{ color: 'var(--primary-color)', fontSize: 38 }}>702 Prime</Title>
        <Form
          form={form}
          labelCol={{
            style: { fontWeight: 600 }
          }}
          size={isMobileView ? 'middle' :'large'}
          {...formConfig}
          onFinish={onSubmit}
          style={{ width: '100%', padding:'20px' }}
        >
          <Flex justify="center" vertical>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Please input your username!'
                }
              ]}
              name="username"
            >
              <Input placeholder="아이디 입력" />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]}
              hasFeedback
              validateStatus={error ? 'error' : isLoading ? 'validating' : ''}
              help={error}
              name="password"
            >
              <Input.Password
                onChange={() => {
                  if (error) setError('');
                }}
                placeholder="비밀번호 입력"
              />
            </Form.Item>
            <Button type="primary" style={{ marginTop: 10 }} htmlType="submit">
              로그인
            </Button>
            <Form.Item>
              <Checkbox>자동 로그인</Checkbox>
            </Form.Item>
          </Flex>
        </Form>
      </Flex>
    </div>
  );
}

export default LoginPage;
