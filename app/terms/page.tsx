/**
 * Terms of Service / 服务条款
 * Static legal page — required for App Store and Play Store listings.
 */

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of Wishflow.',
};

const sectionStyle: React.CSSProperties = { marginBottom: 28 };
const h2Style: React.CSSProperties = { fontSize: 18, margin: '0 0 8px' };
const pStyle: React.CSSProperties = {
  margin: '0 0 10px',
  fontSize: 14,
  lineHeight: 1.85,
  color: 'var(--text)',
};

export default function TermsPage() {
  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <h1 className="h1" style={{ margin: '24px 0 6px' }}>Terms of Service</h1>
      <p className="muted" style={{ marginBottom: 32 }}>Effective date: July 3, 2026 · Wishflow (愿航)</p>

      <section style={sectionStyle}>
        <h2 style={h2Style}>1. The service</h2>
        <p style={pStyle}>
          Wishflow is a personal wish-keeping and visualization app. It is offered as-is,
          free of charge, for personal, non-commercial use.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>2. Your account</h2>
        <p style={pStyle}>
          An account is optional. If you create one, keep your credentials safe — you are
          responsible for activity under your account. You can delete your account at any
          time in Settings; deletion removes your cloud data permanently.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>3. Your content</h2>
        <p style={pStyle}>
          Wishes, connections, and fragments you create belong to you. You grant us only the
          rights needed to store and display them back to you, and to process wish text
          through our AI provider to generate imagery. We claim no other rights over your
          content.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>4. Acceptable use</h2>
        <p style={pStyle}>
          Don't use Wishflow to store unlawful content, attempt to access other users' data,
          or interfere with the service's operation.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>5. No guarantees</h2>
        <p style={pStyle}>
          Wishflow is a companion, not a professional service. It provides no medical,
          psychological, financial, or legal advice. We aim for high availability and safe
          storage but cannot guarantee uninterrupted service — please use the export feature
          for backups that matter to you.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>6. Liability</h2>
        <p style={pStyle}>
          To the maximum extent permitted by law, Wishflow is provided without warranties,
          and our liability for any claim related to the service is limited to the amount
          you paid for it (currently zero).
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>7. Changes</h2>
        <p style={pStyle}>
          We may update these terms as the service evolves. Material changes will be noted
          on this page with a new effective date. Continuing to use Wishflow after a change
          means you accept the updated terms.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Contact</h2>
        <p style={pStyle}>
          <a href="mailto:cqyestateyuki@gmail.com" style={{ color: 'var(--wish)' }}>cqyestateyuki@gmail.com</a>
        </p>
      </section>

      <div className="divider" />

      <h1 className="h1" style={{ fontSize: 28, margin: '0 0 6px' }}>服务条款（中文）</h1>
      <p className="muted" style={{ marginBottom: 24 }}>生效日期：2026 年 7 月 3 日</p>

      <section style={sectionStyle}>
        <p style={pStyle}>
          <b>服务：</b>愿航是一款个人愿望保管与可视化应用，按现状免费提供，供个人非商业使用。
        </p>
        <p style={pStyle}>
          <b>账号：</b>账号是可选的。如注册账号，请妥善保管凭据；你可以随时在「个人中心」删除账号，
          云端数据将被永久移除。
        </p>
        <p style={pStyle}>
          <b>你的内容：</b>你创建的愿望、连接与碎片归你所有。我们仅获得为你存储、展示、
          以及通过 AI 服务生成意象图所必需的权利。
        </p>
        <p style={pStyle}>
          <b>合理使用：</b>请勿存储违法内容、尝试访问他人数据或干扰服务运行。
        </p>
        <p style={pStyle}>
          <b>免责：</b>愿航是陪伴工具，不提供医疗、心理、财务或法律建议。请对重要数据使用导出功能自行备份。
          在法律允许的最大范围内，我们的责任以你为服务支付的金额为限（目前为零）。
        </p>
        <p style={pStyle}>
          <b>条款变更：</b>条款如有重大变更，将在本页注明新的生效日期。
        </p>
        <p style={pStyle}>
          <b>联系：</b><a href="mailto:cqyestateyuki@gmail.com" style={{ color: 'var(--wish)' }}>cqyestateyuki@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
