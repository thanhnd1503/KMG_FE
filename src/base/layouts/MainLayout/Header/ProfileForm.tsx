import { Button, Flex, Form, Input, Radio } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import useAuth from '@base/hooks/useAuth';
import { CloseOutlined } from '@ant-design/icons';
import useToast from '@base/hooks/useToast';
import CustomButton from '@base/components/Button/CustomButton/index';
import { formConfig } from '@base/configs/antdConfig';
import classNames from 'classnames/bind';
import styles from './Header.module.css';
const cx = classNames.bind(styles);

export interface IProfileFormProps {
  handleClose: VoidFunction;
}

export default function ProfileForm(props: IProfileFormProps) {
  const { user, updateProfile } = useAuth();
  const [profileForm] = useForm();
  const onSubmit = async (values: any) => {
    delete values.confirmPassword;
    updateProfile(values);
  };

  return (
    <div className={cx('profile-wrapper')}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 15 }}>
        <Title level={5} style={{ color: '#6D6D6D' }}>
          내 프로필 수정
        </Title>
        <Button type="text" onClick={props.handleClose}>
          <CloseOutlined />
        </Button>
      </Flex>
      <Form
        form={profileForm}
        {...formConfig}
        onFinish={onSubmit}
        labelCol={{
          span: 8
        }}
        colon={false}
        initialValues={{
          name: user?.name,
          phone: user?.mobile || '0920240624',
          email: user?.email
        }}
      >
        <Flex justify="center" align="center" vertical>
          <div className={cx('profile-form')}>
            <Form.Item label="ID">
              <Text>{user?.username}</Text>
            </Form.Item>
            <Form.Item label="비밀번호" name="password">
              <Input.Password placeholder="비밀번호" />
            </Form.Item>
            <Form.Item
              dependencies={['password']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if ((getFieldValue('password') || value) && getFieldValue('password') !== value) {
                      return Promise.reject(new Error('Confirm password do not match!'));
                    }
                    return Promise.resolve();
                  }
                })
              ]}
              label="비밀번호 확인"
              name="confirmPassword"
            >
              <Input.Password placeholder="비밀번호 확인" />
            </Form.Item>
            <Form.Item label="이름" name="name" rules={[{ required: true }]}>
              <Input placeholder="이름" />
            </Form.Item>
            <Form.Item
              label="휴대폰 번호"
              name="phone"
              rules={[{ pattern: /^[0-9]+$/, message: 'Phone number only contains number' }, { required: true }]}
            >
              <Input placeholder="휴대폰 번호" />
            </Form.Item>
            <Form.Item label="이메일" name="email" rules={[{ type: 'email' }, { required: true }]}>
              <Input placeholder="이메일" />
            </Form.Item>
            {/* <Form.Item label="법인 가입 알림" name="notificationOption">
              <Radio.Group>
                <Radio value={'0'}>받지 않음</Radio>
                <Radio value={'kakao'}>카카오톡</Radio>
              </Radio.Group>
            </Form.Item> */}
          </div>
          <CustomButton round size="large" type="primary" style={{ marginTop: 12 }} htmlType="submit">
            수정하기
          </CustomButton>
        </Flex>
      </Form>
    </div>
  );
}
