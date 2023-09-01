import { useState } from "react";
import PropType from "prop-types";
import PenIcon from "../icons/PenIcon";
import useAuthContext from "../hooks/useAuthContext";
import updateUser from "../api/updateUser";

const LastNameField = () => {
  const { auth, updateAuth } = useAuthContext();
  const [value, setValue] = useState(auth.user.lastName);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("lastName", value);
      const response = await updateUser(auth.user._id, auth.token, formData);
      if (response.ok) {
        setLoading(false);
        updateAuth((auth) => ({
          ...auth,
          user: { ...auth.user, lastName: value },
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
        htmlFor="lastName"
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        Last Name
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
            id="lastName"
            name="lastName"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div style={{ position: "absolute", top: 4, right: 0 }}>
            <button style={{ marginRight: 10 }} onClick={() => setEdit(false)}>
              Cancel
            </button>
            <button
              style={{ marginRight: 10 }}
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
          {value}
        </p>
      )}
    </div>
  );
};

LastNameField.propTypes = {
  lastName: PropType.string,
};

export default LastNameField;
