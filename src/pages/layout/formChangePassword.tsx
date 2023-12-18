import { Button, Form, Input, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const passwordValidator = (value: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-"!@#%&/,><\':;|_~`])\S{7,99}$/;

  if (value.match(passwordRegex)) {
    return true;
  }

  return false;
};

const FormChangePassword = () => {
  const [form] = Form.useForm();

  const { user } = useSelector(state => state.user);

  const onFinish = (values: any) => {};

  useEffect(() => {
    if (user.email) {
      form.setFieldsValue({ email: user.email });
    }
  }, [user]);

  return (
    <Form
      form={form}
      name="register"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      scrollToFirstError
    >
      <Form.Item name="email" label="Email">
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="oldPassword"
        label="Mật khẩu cũ"
        rules={[
          {
            required: true,
            message: 'Không được bỏ trống!',
          },
          {
            validator(_, value) {
              if (!value || passwordValidator(value)) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error(
                  'Mật khẩu tối thiểu 8 ký tự và phải có ít nhất 1 chữ số, 1 chữ cái in hoa và 1 kí tự đặc biệt',
                ),
              );
            },
          },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Mật khẩu cũ" />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="Mật khẩu mới"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập Mật khẩu!',
          },
          {
            validator(_, value) {
              if (!value || passwordValidator(value)) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error(
                  'Mật khẩu tối thiểu 8 ký tự và phải có ít nhất 1 chữ số, 1 chữ cái in hoa và 1 kí tự đặc biệt',
                ),
              );
            },
          },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Mật khẩu mới" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Nhập lại mật khẩu mới"
        dependencies={['newPassword']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập lại mật khẩu!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('Mật khẩu không trùng!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Nhập lại mật khẩu" />
      </Form.Item>
      <Form.Item style={{ marginTop: '' }}>
        <Spin spinning={false}>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Spin>
      </Form.Item>
    </Form>
  );
};

export default FormChangePassword;
