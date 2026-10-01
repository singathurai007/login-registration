import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  value,
  onChange,
  placeholder = "Enter password",
  name = "password"
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />

      <button
        type="button"
        className="password-toggle"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

export default PasswordInput;