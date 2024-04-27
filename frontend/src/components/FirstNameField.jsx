import { useState } from "react";
import PenIcon from "../icons/PenIcon";
import updateUser from "../api/updateUser";
import useAuthContext from "../hooks/useAuthContext";

const FirstNameField = () => {
  const { auth, updateAuth } = useAuthContext();
  const [value, setValue] = useState(auth.user.firstName);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", value);
      const response = await updateUser(auth.user._id, auth.token, formData);
      if (response.ok) {
        setLoading(false);
        updateAuth((auth) => ({
          ...auth,
          user: { ...auth.user, firstName: value },
        }));
        setEdit(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-field">
      <label
        htmlFor="firstName"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        First Name
        {!edit && (
          <button className="btn icon-btn" onClick={() => setEdit(true)}>
            <PenIcon size={16} color="grey" strokeWidth="1.5px" />
          </button>
        )}
      </label>
      {edit ? (
        <div style={{ position: "relative" }}>
          <input
            type="text"
            style={{ width: "100%" }}
            id="firstName"
            name="firstName"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div
            className="flex gap-md"
            style={{ position: "absolute", top: 2, right: 10 }}
          >
            <button
              className="btn secondary-btn"
              onClick={() => setEdit(false)}
            >
              Cancel
            </button>
            <button
              className="btn primary-btn"
              onClick={!loading ? handleSubmit : (e) => e.preventDefault()}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p
          style={{
            fontSize: "0.8rem",
            backgroundColor: "#f7f6f2",
            padding: 5,
            borderRadius: 5,
          }}
        >
          {value}{" "}
        </p>
      )}
    </div>
  );
};

export default FirstNameField;
