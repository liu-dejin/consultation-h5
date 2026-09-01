import { LoginByCodeApi, LoginByPasswordApi } from "@/api/common";
import type { LoginReq } from "@/types/common";
import { useUserStore } from "@/stores/useUserStore";
import { Button, Checkbox, Form, Image, Input, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline, LeftOutline, RightOutline } from "antd-mobile-icons";
import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [isPassword, setIsPassword] = useState(true);
  const [visible, setVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  // 已登录用户访问登录页，直接回跳
  if (user?.token) {
    return <Navigate to={redirect} replace />;
  }

  const switchLoginType = () => {
    form.resetFields();
    setIsPassword((prev) => !prev);
  };

  const LoginFormRules = {
    mobileRules: [
      { required: true, message: "请输入手机号" },
      { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" },
    ],
    passwordRules: [
      { required: true, message: "请输入密码" },
      { min: 6, message: "密码长度不能少于6位" },
      { max: 20, message: "密码长度不能超过20位" },
    ],
    codeRules: [
      { required: true, message: "请输入验证码" },
      { pattern: /^\d{6}$/, message: "验证码为6位数字" },
    ],
  };

  const handleLogin = async (values: LoginReq) => {
    if (!agreed) {
      Toast.show({ content: "请先勾选同意用户协议及隐私协议" });
      return;
    }
    setLoading(true);
    try {
      const res = isPassword ? await LoginByPasswordApi(values) : await LoginByCodeApi(values);
      // 存储 token 与用户信息，并跳转首页（或来源页）
      setUser(res.data);
      Toast.show({ content: "登录成功", icon: "success" });
      navigate(redirect, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5">
      <div className="flex h-11 justify-between items-center">
        <div>
          <LeftOutline fontSize={18} />
        </div>
        <div className="text-(--cp-primary) text-sm">注册</div>
      </div>
      <div className="h-[10vw]"></div>
      <div className="flex justify-between items-baseline">
        <div className="text-3xl">{isPassword ? "密码" : "手机验证码"}登录</div>
        <div className="text-sm flex items-center" onClick={switchLoginType}>
          <div>{isPassword ? "手机验证码" : "密码"}登录</div>
          <RightOutline />
        </div>
      </div>
      <div className="h-[10vw]"></div>
      <div>
        <Form form={form} onFinish={handleLogin}>
          <Form.Item name="mobile" rules={LoginFormRules.mobileRules}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          {isPassword ? (
            <Form.Item name="password" rules={LoginFormRules.passwordRules}>
              <div className="flex items-center">
                <Input placeholder="请输入密码" type={visible ? "text" : "password"} />
                <div>
                  {!visible ? (
                    <EyeInvisibleOutline onClick={() => setVisible(true)} />
                  ) : (
                    <EyeOutline onClick={() => setVisible(false)} />
                  )}
                </div>
              </div>
            </Form.Item>
          ) : (
            <Form.Item name="code" rules={LoginFormRules.codeRules}>
              <Input placeholder="请输入验证码" />
            </Form.Item>
          )}
          <div className="h-[5vw]"></div>
          <div className="text-sm ml-3">
            <Checkbox
              style={{
                "--icon-size": "18px",
                "--font-size": "14px",
              }}
              checked={agreed}
              onChange={() => setAgreed((prev) => !prev)}
            >
              我已同意
              <span className="text-(--cp-primary) cursor-pointer">用户协议</span>及
              <span className="text-(--cp-primary) cursor-pointer">隐私协议</span>
            </Checkbox>
          </div>
          <div className="h-[5vw]"></div>
          <div>
            <Button
              block
              shape="rounded"
              type="submit"
              color="primary"
              size="large"
              loading={loading}
            >
              提交
            </Button>
          </div>
        </Form>
      </div>
      <div className="h-[5vw]"></div>

      <div>忘记密码?</div>
      <div className="h-[20vw]"></div>
      <div className="flex items-center justify-center flex-col gap-3">
        <div>第三方登录</div>
        <div>
          <Image width={44} height={44} src="https://cp.itheima.net/assets/qq.7e9221ab.svg"></Image>
        </div>
      </div>
    </div>
  );
};

export default Login;
