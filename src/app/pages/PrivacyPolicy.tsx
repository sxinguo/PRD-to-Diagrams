export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fafafa", padding: "80px 20px 40px" }}>
      <div className="max-w-3xl mx-auto" style={{ background: "#fff", borderRadius: "16px", padding: "48px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#1e0a3c", marginBottom: "8px" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "32px" }}>
          Last Updated: May 20, 2026
        </p>

        <div style={{ color: "#374151", fontSize: "15px", lineHeight: "1.8" }}>
          <p style={{ marginBottom: "24px" }}>
            PRD Chart ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mermaid chart and diagram generation service.
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Information We Collect
          </h2>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#374151", marginTop: "20px", marginBottom: "12px" }}>
            Account Information
          </h3>
          <ul style={{ marginLeft: "24px", marginBottom: "16px", listStyle: "disc" }}>
            <li>Email address (for authentication via Supabase)</li>
            <li>User ID (automatically generated)</li>
            <li>Subscription plan and credits information</li>
          </ul>

          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#374151", marginTop: "20px", marginBottom: "12px" }}>
            Usage Data
          </h3>
          <ul style={{ marginLeft: "24px", marginBottom: "24px", listStyle: "disc" }}>
            <li>PRD text content you input for diagram generation</li>
            <li>Generated diagrams (Mermaid code and SVG outputs)</li>
            <li>Transaction history and credit usage records</li>
            <li>Browser type, device information, and IP address</li>
          </ul>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            How We Use Your Information
          </h2>
          <ul style={{ marginLeft: "24px", marginBottom: "24px", listStyle: "disc" }}>
            <li>To provide and maintain our diagram generation service</li>
            <li>To process your PRD documents and generate diagrams</li>
            <li>To manage your account, credits, and subscription</li>
            <li>To improve our AI models and service quality</li>
            <li>To send service-related notifications</li>
            <li>To prevent fraud and ensure platform security</li>
          </ul>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Data Storage and Security
          </h2>
          <p style={{ marginBottom: "16px" }}>
            Your data is stored securely using Supabase infrastructure with industry-standard encryption:
          </p>
          <ul style={{ marginLeft: "24px", marginBottom: "24px", listStyle: "disc" }}>
            <li>All data transmission is encrypted using HTTPS/TLS</li>
            <li>Database access is protected by authentication and authorization</li>
            <li>We implement regular security audits and updates</li>
            <li>Your PRD content is processed temporarily and not permanently stored unless you save it</li>
          </ul>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Data Sharing and Third Parties
          </h2>
          <p style={{ marginBottom: "16px" }}>
            We do not sell your personal information. We may share data with:
          </p>
          <ul style={{ marginLeft: "24px", marginBottom: "24px", listStyle: "disc" }}>
            <li><strong>Supabase:</strong> For authentication and database services</li>
            <li><strong>Payment processors:</strong> For handling subscription payments</li>
            <li><strong>AI service providers:</strong> For diagram generation (data is processed and not retained)</li>
            <li><strong>Legal authorities:</strong> When required by law or to protect our rights</li>
          </ul>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Your Rights
          </h2>
          <p style={{ marginBottom: "16px" }}>You have the right to:</p>
          <ul style={{ marginLeft: "24px", marginBottom: "24px", listStyle: "disc" }}>
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Export your data in a portable format</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Data Retention
          </h2>
          <p style={{ marginBottom: "24px" }}>
            We retain your account information and transaction history for as long as your account is active. After account deletion, we may retain certain data for legal compliance and fraud prevention purposes for up to 90 days.
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Cookies and Tracking
          </h2>
          <p style={{ marginBottom: "24px" }}>
            We use essential cookies for authentication and session management. We do not use third-party advertising cookies or tracking pixels.
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Children's Privacy
          </h2>
          <p style={{ marginBottom: "24px" }}>
            Our service is not intended for users under 13 years of age. We do not knowingly collect information from children.
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Changes to This Policy
          </h2>
          <p style={{ marginBottom: "24px" }}>
            We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our service.
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Contact Us
          </h2>
          <p style={{ marginBottom: "8px" }}>
            If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
          </p>
          <p style={{ marginBottom: "4px" }}>
            <strong>Email:</strong> feedback9980@163.com
          </p>
        </div>
      </div>
    </div>
  );
}
