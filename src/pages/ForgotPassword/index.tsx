import { ForgotPasswordApi, SendForgotCodeApi } from "@/api/common";
import { Button, Form, Input, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline, LeftOutline } from "antd-mobile-icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

type ForgotPasswordFormValues = {
  email: string;
  code: string;
  password: string;
};

const RESEND_INTERVAL = 60;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

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
      await SendForgotCodeApi({ email });
      Toast.show({ content: "验证码已发送至邮箱" });
      setCountdown(RESEND_INTERVAL);
    } catch {
      // 已由拦截器 Toast
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    const payload = {
      email: values.email.trim().toLowerCase(),
      code: values.code.trim(),
      password: values.password,
    };
    setSubmitting(true);
    try {
      await ForgotPasswordApi(payload);
      Toast.show({ content: "重置成功，请用新密码登录", icon: "success" });
      navigate("/login", { replace: true });
    } catch {
      // 已由拦截器 Toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-107.5 flex-col px-5 pb-6">
      <div className="flex h-11 shrink-0 items-center justify-between">
        <button type="button" className="-ml-2 p-2" aria-label="返回" onClick={() => navigate(-1)}>
          <LeftOutline fontSize={18} />
        </button>
        <button
          type="button"
          className="-mr-2 py-2 pl-4 text-sm text-(--cp-primary)"
          onClick={() => navigate("/login")}
        >
          去登录
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <h1 className="text-[30px] font-medium leading-none tracking-tight text-(--cp-text1)">
          忘记密码
        </h1>
        <span className="shrink-0 text-sm text-(--cp-text3)">通过验证码重置</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-(--cp-text3)">
        请输入邮箱与验证码，重置后请使用新密码登录
      </p>

      <div className="mt-8">
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{ "--border-inner": "transparent" } as React.CSSProperties}
        >
          <div className="flex flex-col">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "请输入邮箱" },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "请输入正确的邮箱地址",
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <div className="flex h-12 items-center border-b border-(--cp-line)">
                <Input
                  placeholder="请输入邮箱"
                  className="flex-1 text-[15px] [--placeholder-color:var(--cp-tip)]"
                />
              </div>
            </Form.Item>

            <Form.Item
              name="code"
              rules={[
                { required: true, message: "请输入验证码" },
                { pattern: /^\d{6}$/, message: "验证码为6位数字" },
              ]}
              style={{ marginBottom: 0 }}
            >
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

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入新密码" },
                { min: 6, message: "密码长度不能少于6位" },
                { max: 20, message: "密码长度不能超过20位" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <div className="flex h-12 items-center border-b border-(--cp-line)">
                <Input
                  placeholder="请输入新密码（6-20位）"
                  type={visible ? "text" : "password"}
                  className="flex-1 text-[15px] [--placeholder-color:var(--cp-tip)]"
                />
                <button
                  type="button"
                  className="-mr-1 shrink-0 p-2 text-(--cp-text3)"
                  onClick={() => setVisible((v) => !v)}
                  aria-label={visible ? "隐藏密码" : "显示密码"}
                >
                  {visible ? <EyeOutline fontSize={20} /> : <EyeInvisibleOutline fontSize={20} />}
                </button>
              </div>
            </Form.Item>
          </div>

          <div className="mt-6">
            <Button
              block
              shape="rounded"
              type="submit"
              color="primary"
              size="large"
              loading={submitting}
              className="h-11 text-[16px]"
            >
              重置密码
            </Button>
          </div>
        </Form>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="py-2 text-sm text-(--cp-text3)"
            onClick={() => navigate("/login")}
          >
            想起密码了？去登录
          </button>
        </div>
      </div>

      <div className="mt-auto pt-10" />
    </div>
  );
};

export default ForgotPassword;
