const Settings = () => {
  return (
    <div style={{ padding: "10px 100px" }}>
      <h2>Settings</h2>
      <form>
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
              //   backgroundImage: previewImage && `url(${previewImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            tabIndex={1}
            // onClick={() => fileUploadRef.current.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // fileUploadRef.current.click();
              }
            }}
          >
            {/* {!previewImage && (
              <CameraIcon size={28} color="grey" strokeWidth="1.5px" />
            )} */}
          </div>
        </div>
        <div className="form-control">
          <label htmlFor="first-name">First Name</label>
          <input type="text" name="firstName" id="first-name" />
        </div>
        <div className="form-control">
          <label htmlFor="last-name">Last Name</label>
          <input type="text" name="lastName" id="last-name" />
        </div>
        <div className="form-control">
          <label htmlFor="bio">Bio</label>
          <textarea type="text" name="bio" id="bio" />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div className="form-control">
          <label htmlFor="new-password">New Password</label>
          <input type="text" name="newPassword" id="new-password" />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Settings;
