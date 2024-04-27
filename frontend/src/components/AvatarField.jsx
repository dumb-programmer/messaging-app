import { useRef, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import updateUser from "../api/updateUser";

const AvatarField = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileUploadRef = useRef();

  const { auth, updateAuth } = useAuthContext();

  const handleSubmit = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await updateUser(auth.user._id, auth.token, formData);
      if (response.ok) {
        setLoading(false);
        const { user } = await response.json();
        updateAuth((auth) => ({
          ...auth,
          user,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        className="form-control"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          className="profile-picture-upload"
          style={{
            backgroundImage: `${
              !previewImage
                ? `url("http://localhost:3000/${auth.user.avatar}")`
                : `url(${previewImage})`
            }`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          tabIndex={1}
          onClick={() => fileUploadRef.current.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fileUploadRef.current.click();
            }
          }}
        >
          {/* {!previewImage && (
              <CameraIcon size={28} color="grey" strokeWidth="1.5px" />
            )} */}
        </div>
      </div>
      <input
        onChange={
          !loading
            ? async (e) => {
                setPreviewImage(
                  URL.createObjectURL(fileUploadRef.current.files[0])
                );
                await handleSubmit(e.target.files[0]);
              }
            : null
        }
        ref={fileUploadRef}
        type="file"
        id="avatar"
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AvatarField;
