export function RefundPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fafafa", padding: "80px 20px 40px" }}>
      <div className="max-w-3xl mx-auto" style={{ background: "#fff", borderRadius: "16px", padding: "48px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#1e0a3c", marginBottom: "8px" }}>
          Refund Policy
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "32px" }}>
          Last Updated Date: April 22, 2025
        </p>

        <div style={{ color: "#374151", fontSize: "15px", lineHeight: "1.8" }}>
          <p style={{ marginBottom: "24px" }}>
            Thank you for choosing the subscription service of PRD Chart. Before making a purchase, please carefully read this refund policy.
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            All Sales Are Final Transactions
          </h2>
          <p style={{ marginBottom: "16px" }}>
            Due to the instant access nature of digital services, all subscription fees (including monthly/annual plans), once paid, are deemed final transactions and no refunds will be given. This includes but is not limited to the following situations:
          </p>
          <ul style={{ marginLeft: "24px", marginBottom: "24px", listStyle: "disc" }}>
            <li>Unused subscription duration</li>
            <li>Insufficient use of the account</li>
            <li>Cancellation due to personal reasons of the user</li>
            <li>The service functions meet the description but do not meet the user's expectations</li>
          </ul>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Exception Handling for Service Interruptions
          </h2>
          <p style={{ marginBottom: "24px" }}>
            If there is a major service interruption that lasts continuously for more than 72 hours and is not caused by force majeure, users can apply for compensation of equivalent service duration. This compensation is the sole remedy and does not involve cash refunds.
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Dispute Resolution
          </h2>
          <p style={{ marginBottom: "16px" }}>
            If you have any questions about the deduction, please contact feedback9980@163.com within 7 working days and provide:
          </p>
          <ul style={{ marginLeft: "24px", marginBottom: "24px", listStyle: "disc" }}>
            <li>Transaction ID</li>
            <li>Deduction voucher</li>
            <li>Problem description</li>
          </ul>
          <p style={{ marginBottom: "24px" }}>
            We will conduct an investigation and provide a written reply within 15 working days.
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Right to Change the Policy
          </h2>
          <p style={{ marginBottom: "24px" }}>
            PRD Chart reserves the right to modify this policy at any time. The revised policy will take effect immediately after being publicly announced on the website.
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e0a3c", marginTop: "32px", marginBottom: "16px" }}>
            Recognition of Terms
          </h2>
          <p style={{ marginBottom: "8px" }}>By paying the subscription fee, you:</p>
          <ul style={{ marginLeft: "24px", listStyle: "disc" }}>
            <li>Have fully understood and accepted this policy</li>
            <li>Confirm the special nature of digital services</li>
            <li>Agree to waive any right to request a refund</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
