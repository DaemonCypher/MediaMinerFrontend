import "./LoginToggle.css";

export default function LoginToggle({ user, onLogin, onLogout, variant = "desktop"}) {
  const isMobile = variant === "mobile";
  let baseClass = "login-toggle";

  if (isMobile) {
    baseClass += " login-toggle--mobile";
  } else {
    baseClass += " login-toggle--desktop";
  }

  if (!user) {
    return (
      <button type="button" onClick={onLogin} className={`${baseClass} login-toggle--login`}>
        Sign in
      </button>
    );
  }

  return (
    <button type="button" onClick={onLogout} className={`${baseClass} login-toggle--logout`}>
      Sign out
    </button>
  );
}
