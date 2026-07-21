import register  from "./register";
import login  from "./login";
import { layout } from "./layout";
import { confirmPassword } from "./confirm-password";
import { verifyOtp } from "./verity-otp";
import { verifyEmail } from "./verify-email";
import { forgotPassword } from "./forgot-password";
import { resetPassword } from "./reset-password";

const auth = {register,login,layout, confirmPassword, verifyOtp, verifyEmail, forgotPassword, resetPassword};

export default auth