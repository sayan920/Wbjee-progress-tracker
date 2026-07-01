import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

export default function AuthScreen() {
  const { signUpWithEmail, signInWithEmail, signInWithGoogle, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const resetError = () => setError("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetError();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (isSignup && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      if (isSignup) {
        await signUpWithEmail(form.email.trim(), form.password);
      } else {
        await signInWithEmail(form.email.trim(), form.password);
      }
    } catch (authError) {
      setError(readableError(authError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    resetError();
    setSubmitting(true);

    try {
      await signInWithGoogle();
    } catch (authError) {
      setError(readableError(authError));
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setForm(initialForm);
    setError("");
  };

  return (
    <div style={shell}>
      <div style={orbLeft} />
      <div style={orbRight} />

      <div style={layout}>
        <section style={heroCard}>
          <div style={brandBadge}>SS</div>
          <div style={eyebrow}>StudySpace Access</div>
          <h1 style={heroTitle}>Keep your study space personal, secure, and ready across sessions.</h1>
          <p style={heroText}>
            Sign in to unlock your existing StudySpace workspace without changing the dashboard,
            chapters, practice flow, or AI pages you already have.
          </p>

          <div style={featureList}>
            <div style={featureCard}>
              <strong style={featureTitle}>Focused access</strong>
              <div style={featureText}>Only authenticated users can enter the app.</div>
            </div>
            <div style={featureCard}>
              <strong style={featureTitle}>Multiple sign-in options</strong>
              <div style={featureText}>Use email/password or continue with Google.</div>
            </div>
            <div style={featureCard}>
              <strong style={featureTitle}>Ready for cloud sync</strong>
              <div style={featureText}>This auth layer is prepared for the next Firestore step.</div>
            </div>
          </div>
        </section>

        <section style={authCard}>
          <div style={tabRow}>
            <button
              type="button"
              style={tabButton(mode === "login")}
              onClick={() => switchMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              style={tabButton(mode === "signup")}
              onClick={() => switchMode("signup")}
            >
              Sign Up
            </button>
          </div>

          <div style={cardEyebrow}>{isSignup ? "Create account" : "Welcome back"}</div>
          <h2 style={cardTitle}>{isSignup ? "Start your StudySpace account" : "Sign in to continue"}</h2>
          <p style={cardText}>
            {isSignup
              ? "Use your email to create an account, or continue quickly with Google."
              : "Log in with your email and password, or continue with Google."}
          </p>

          <form onSubmit={handleSubmit} style={formStyle}>
            {isSignup ? (
              <label style={field}>
                <span style={fieldLabel}>Name</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  style={input}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
            ) : null}

            <label style={field}>
              <span style={fieldLabel}>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                style={input}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label style={field}>
              <span style={fieldLabel}>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                style={input}
                placeholder="Enter your password"
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            </label>

            {isSignup ? (
              <label style={field}>
                <span style={fieldLabel}>Confirm Password</span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                  style={input}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </label>
            ) : null}

            {error ? <div style={errorBox}>{error}</div> : null}

            <button type="submit" style={primaryButton} disabled={submitting || loading}>
              {submitting ? "Please wait..." : isSignup ? "Create Account" : "Login"}
            </button>
          </form>

          <div style={divider}>
            <span style={dividerLine} />
            <span style={dividerText}>or</span>
            <span style={dividerLine} />
          </div>

          <button type="button" style={secondaryButton} onClick={handleGoogle} disabled={submitting || loading}>
            Continue with Google
          </button>
        </section>
      </div>
    </div>
  );
}

function readableError(error) {
  const code = error?.code || "";

  if (code.includes("invalid-credential")) return "The email or password is incorrect.";
  if (code.includes("user-not-found")) return "No account was found for that email.";
  if (code.includes("wrong-password")) return "The email or password is incorrect.";
  if (code.includes("email-already-in-use")) return "That email is already in use.";
  if (code.includes("weak-password")) return "Choose a stronger password with at least 6 characters.";
  if (code.includes("popup-closed-by-user")) return "Google sign-in was closed before completing.";
  return "Authentication failed. Please try again.";
}

const shell = {
  position: "relative",
  minHeight: "100vh",
  overflow: "hidden",
  background: "#050816",
  color: "#f8fafc",
  padding: "24px"
};

const orbLeft = {
  position: "fixed",
  top: "-120px",
  left: "-90px",
  width: "380px",
  height: "380px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(127,90,240,0.42), transparent 70%)",
  filter: "blur(120px)",
  pointerEvents: "none"
};

const orbRight = {
  position: "fixed",
  right: "-120px",
  bottom: "-90px",
  width: "420px",
  height: "420px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(0,198,255,0.28), transparent 72%)",
  filter: "blur(140px)",
  pointerEvents: "none"
};

const layout = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "22px",
  maxWidth: "1180px",
  margin: "0 auto",
  minHeight: "calc(100vh - 48px)",
  alignItems: "center"
};

const heroCard = {
  padding: "32px",
  borderRadius: "32px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.92), rgba(15,23,42,0.64))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 30px 80px -48px rgba(0,0,0,0.9)",
  textAlign: "left"
};

const brandBadge = {
  display: "grid",
  placeItems: "center",
  width: "60px",
  height: "60px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #7f5af0, #00c6ff)",
  color: "#fff",
  fontWeight: 800,
  letterSpacing: "0.08em"
};

const eyebrow = {
  marginTop: "18px",
  color: "#7dd3fc",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const heroTitle = {
  margin: "12px 0 0",
  fontSize: "clamp(2rem, 5vw, 3.75rem)",
  lineHeight: 1.02,
  color: "#f8fafc"
};

const heroText = {
  marginTop: "16px",
  color: "#cbd5e1",
  lineHeight: 1.7,
  maxWidth: "560px",
  textAlign: "left"
};

const featureList = {
  display: "grid",
  gap: "12px",
  marginTop: "26px"
};

const featureCard = {
  padding: "16px 18px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)"
};

const featureTitle = {
  color: "#f8fafc"
};

const featureText = {
  marginTop: "6px",
  color: "#cbd5e1",
  lineHeight: 1.55
};

const authCard = {
  padding: "28px",
  borderRadius: "30px",
  background: "linear-gradient(145deg, rgba(8,15,33,0.96), rgba(8,15,33,0.84))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 30px 80px -48px rgba(0,0,0,0.9)",
  textAlign: "left"
};

const tabRow = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "10px"
};

const tabButton = (active) => ({
  minHeight: "50px",
  padding: "12px 14px",
  borderRadius: "16px",
  border: active ? "1px solid rgba(125,211,252,0.3)" : "1px solid rgba(255,255,255,0.06)",
  background: active
    ? "linear-gradient(135deg, rgba(127,90,240,0.22), rgba(0,198,255,0.14))"
    : "rgba(255,255,255,0.04)",
  color: "#f8fafc",
  fontWeight: active ? 700 : 600,
  cursor: "pointer"
});

const cardEyebrow = {
  marginTop: "24px",
  color: "#c084fc",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const cardTitle = {
  margin: "10px 0 0",
  color: "#f8fafc",
  fontSize: "32px",
  lineHeight: 1.08
};

const cardText = {
  marginTop: "12px",
  color: "#cbd5e1",
  lineHeight: 1.6,
  textAlign: "left"
};

const formStyle = {
  display: "grid",
  gap: "14px",
  marginTop: "20px"
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};

const fieldLabel = {
  color: "#94a3b8",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.12em"
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: "52px",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(2,6,23,0.72)",
  color: "#f8fafc",
  outline: "none"
};

const primaryButton = {
  minHeight: "54px",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(90deg, #7f5af0, #00c6ff)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer"
};

const secondaryButton = {
  ...primaryButton,
  background: "rgba(255,255,255,0.05)"
};

const divider = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  margin: "18px 0"
};

const dividerLine = {
  flex: 1,
  height: "1px",
  background: "rgba(255,255,255,0.08)"
};

const dividerText = {
  color: "#94a3b8",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.12em"
};

const errorBox = {
  padding: "14px 16px",
  borderRadius: "16px",
  background: "rgba(248,113,113,0.12)",
  border: "1px solid rgba(248,113,113,0.16)",
  color: "#fecaca"
};
