import { useState } from "react";
import PropType from "prop-types";
import PenIcon from "../icons/PenIcon";
import useAuthContext from "../hooks/useAuthContext";
import updateUser from "../api/updateUser";

const BioField = ({ bio }) => {
  const [value, setValue] = useState(bio);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const { auth, updateAuth } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bio", value);
      const response = await updateUser(auth.user._id, auth.token, formData);
      if (response.ok) {
        setLoading(false);
        updateAuth((auth) => ({
          ...auth,
          user: { ...auth.user, bio: value },
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
        htmlFor="bio"
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        Bio
        <button className="icon-btn" onClick={() => setEdit(true)}>
          <PenIcon size={16} color="grey" strokeWidth="1.5px" />
        </button>
      </label>
      {edit ? (
        <div>
          <textarea
            type="text"
            id="bio"
            name="bio"
            style={{ width: "100%" }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
          <div className="flex-end" style={{ marginTop: 10 }}>
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
            padding: 10,
            borderRadius: 5,
          }}
        >
          {value}
        </p>
      )}
    </div>
  );
};

BioField.propTypes = {
  bio: PropType.string,
};

export default BioField;
