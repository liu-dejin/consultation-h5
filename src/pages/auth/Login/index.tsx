import { LoginByCodeApi, LoginByPasswordApi, SendLoginCodeApi } from "@/api/auth";
import type { LoginReq } from "@/types/auth";
import { useUserStore } from "@/stores/useUserStore";
import { Button, Checkbox, Form, Image, Input, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline, LeftOutline, RightOutline } from "antd-mobile-icons";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";

const RESEND_INTERVAL = 60;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [isPassword, setIsPassword] = useState(true);
  const [visible, setVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<number | null>(null);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (countdown <= 0) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (timerRef.current) return;
    timerRef.current = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [countdown]);

  if (user?.token && user?.refreshToken) {
    return <Navigate to={redirect} replace />;
  }

  const switchLoginType = () => {
    form.resetFields();
    setCountdown(0);
    setIsPassword((prev) => !prev);
  };

  const LoginFormRules = {
    emailRules: [
      { required: true, message: "请输入邮箱" },
      {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "请输入正确的邮箱地址",
      },
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

  const handleSendCode = async () => {
    try {
      await form.validateFields(["email"]);
    } catch {
      return;
    }
    const email = (form.getFieldValue("email") as string)?.trim();
    if (!email) return;
    setSending(true);
    try {
      await SendLoginCodeApi({ email });
      Toast.show({ content: "验证码已发送至邮箱" });
      setCountdown(RESEND_INTERVAL);
    } catch {
      // 已由拦截器 Toast
    } finally {
      setSending(false);
    }
  };

  const handleLogin = async (values: LoginReq) => {
    if (!agreed) {
      Toast.show({ content: "请先勾选同意用户协议及隐私协议" });
      return;
    }
    const payload: LoginReq = {
      email: values.email.trim().toLowerCase(),
      ...(isPassword ? { password: values.password } : { code: values.code }),
    };
    setLoading(true);
    try {
      const res = isPassword ? await LoginByPasswordApi(payload) : await LoginByCodeApi(payload);
      setUser(res.data);
      Toast.show({ content: "登录成功", icon: "success" });
      navigate(redirect, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-107.5 flex-col  px-5 pb-6">
      <div className="flex h-11 shrink-0 items-center justify-between">
        <button type="button" className="-ml-2 p-2" aria-label="返回" onClick={() => navigate(-1)}>
          <LeftOutline fontSize={18} />
        </button>
        <button
          type="button"
          className="-mr-2 py-2 pl-4 text-sm text-(--cp-primary)"
          onClick={() => navigate("/register")}
        >
          注册
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <h1 className="text-[30px] font-medium leading-none tracking-tight text-(--cp-text1)">
          {isPassword ? "密码" : "验证码"}登录
        </h1>
        <button
          type="button"
          className="-mr-2 flex shrink-0 items-center gap-1 py-2 pl-3 text-sm text-(--cp-text2)"
          onClick={switchLoginType}
        >
          <span>{isPassword ? "验证码" : "密码"}登录</span>
          <RightOutline fontSize={11} />
        </button>
      </div>

      <div className="mt-8">
        <Form
          form={form}
          onFinish={handleLogin}
          style={{ "--border-inner": "transparent" } as React.CSSProperties}
        >
          <div className="flex flex-col">
            <Form.Item name="email" rules={LoginFormRules.emailRules} style={{ marginBottom: 0 }}>
              <div className="flex h-12 items-center border-b border-(--cp-line)">
                <Input
                  placeholder="请输入邮箱"
                  className="flex-1 text-[15px] [--placeholder-color:var(--cp-tip)]"
                />
              </div>
            </Form.Item>

            <div className="min-h-12">
              {isPassword ? (
                <Form.Item
                  name="password"
                  rules={LoginFormRules.passwordRules}
                  style={{ marginBottom: 0 }}
                >
                  <div className="flex h-12 items-center border-b border-(--cp-line)">
                    <Input
                      placeholder="请输入密码"
                      type={visible ? "text" : "password"}
                      className="flex-1 text-[15px] [--placeholder-color:var(--cp-tip)]"
                    />
                    <button
                      type="button"
                      className="-mr-1 shrink-0 p-2 text-(--cp-text3)"
                      onClick={() => setVisible((v) => !v)}
                      aria-label={visible ? "隐藏密码" : "显示密码"}
                    >
                      {visible ? (
                        <EyeOutline fontSize={20} />
                      ) : (
                        <EyeInvisibleOutline fontSize={20} />
                      )}
                    </button>
                  </div>
                </Form.Item>
              ) : (
                <Form.Item name="code" rules={LoginFormRules.codeRules} style={{ marginBottom: 0 }}>
                  <div className="flex h-12 items-center gap-3 border-b border-(--cp-line)">
                    <Input
                      placeholder="请输入邮箱验证码"
                      className="flex-1 text-[15px] [--placeholder-color:var(--cp-tip)]"
                    />
                    <button
                      type="button"
                      className={`shrink-0 py-2 text-sm ${countdown > 0 ? "text-(--cp-text3)" : "text-(--cp-primary)"}`}
                      disabled={sending || countdown > 0}
                      onClick={handleSendCode}
                    >
                      {countdown > 0 ? `${countdown}s后重发` : sending ? "发送中..." : "获取验证码"}
                    </button>
                  </div>
                </Form.Item>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Checkbox
              style={
                {
                  "--icon-size": "18px",
                  "--font-size": "14px",
                  "--adm-color-primary": "var(--cp-primary)",
                } as React.CSSProperties
              }
              checked={agreed}
              onChange={() => setAgreed((prev) => !prev)}
            >
              <span className="text-[var(--cp-text2)]">我已同意</span>
              <span className="cursor-pointer text-[var(--cp-primary)]"> 用户协议</span>
              <span className="text-[var(--cp-text2)]"> 及 </span>
              <span className="cursor-pointer text-[var(--cp-primary)]">隐私协议</span>
            </Checkbox>
          </div>

          <div className="mt-6">
            <Button
              block
              shape="rounded"
              type="submit"
              color="primary"
              size="large"
              loading={loading}
              className="h-11 text-[16px]"
            >
              登录
            </Button>
          </div>
        </Form>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="py-2 text-sm text-(--cp-text3)"
            onClick={() => navigate("/forgot-password")}
          >
            忘记密码？
          </button>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-3 pt-10">
        <div className="text-sm text-[var(--cp-tip)]">第三方登录</div>
        <button type="button" className="rounded-full p-1" aria-label="QQ 登录">
          <Image width={44} height={44} src="https://cp.itheima.net/assets/qq.7e9221ab.svg" />
        </button>
      </div>
    </div>
  );
};

export default Login;
