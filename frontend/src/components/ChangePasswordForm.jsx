import PropTypes from "prop-types";
import { useState } from "react";
import updateUser from "../api/updateUser";
import useAuthContext from "../hooks/useAuthContext";

const initialErrors = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePasswordForm = ({ onCancel, onSuccess }) => {
  const [data, setData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState(initialErrors);

  const { auth } = useAuthContext();

  // TODO: Extract form submission logic into a useMutation hook
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(initialErrors);
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("newPassword", data.newPassword);
    formData.append("confirmPassword", data.confirmPassword);
    try {
      const response = await updateUser(auth.user._id, auth.token, formData);
      if (response.ok) {
        onSuccess();
      } else {
        throw new Error("Error", {
          cause: {
            response,
            responseData: await response.json(),
          },
        });
      }
    } catch (error) {
      switch (error?.cause?.response.status) {
        case 400:
        case 403:
          setErrors((errors) => ({
            ...errors,
            [error?.cause?.responseData?.error.field]:
              error?.cause?.responseData?.error.message,
          }));
          break;
      }
    }
  };

  const handleInput = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      style={{ minWidth: "min(500px, 85vw)", padding: 10 }}
      onSubmit={handleSubmit}
    >
      <h3>Change Password</h3>
      <div className="form-control">
        <label htmlFor="password">
          Password <span aria-label="required">*</span>
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className={`${errors.password ? "input__invalid" : null}`}
          value={data.password}
          onChange={handleInput}
          required
        />
        <span className="error-message">{errors.password}</span>
      </div>
      <div className="form-control">
        <label htmlFor="new-password">
          New password <span aria-label="required">*</span>
        </label>
        <input
          type="password"
          name="newPassword"
          id="new-password"
          className={`${errors.newPassword ? "input__invalid" : null}`}
          value={data.newPassword}
          onChange={handleInput}
          required
        />
        <span className="error-message">{errors.newPassword}</span>
      </div>
      <div className="form-control">
        <label htmlFor="confirm-password">
          Confirm new password <span aria-label="required">*</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirm-password"
          className={`${errors.confirmPassword ? "input__invalid" : null}`}
          value={data.confirmPassword}
          onChange={handleInput}
          required
        />
        <span className="error-message">{errors.confirmPassword}</span>
      </div>
      <div className="flex justify-end gap-md">
        <button className="btn secondary-btn" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn primary-btn" type="submit">
          Change Password
        </button>
      </div>
    </form>
  );
};

ChangePasswordForm.propTypes = {
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default ChangePasswordForm;
