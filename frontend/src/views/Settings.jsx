import AvatarField from "../components/AvatarField";
import FirstNameField from "../components/FirstNameField";
import LastNameField from "../components/LastNameField";
import ChangePassword from "../components/ChangePassword";
import DeleteAccount from "../components/DeleteAccount";

const Settings = () => {
  return (
    <div style={{ padding: 10 }}>
      <h2>Settings</h2>
      <div className="flex flex-column gap-md" style={{ padding: 10 }}>
        <AvatarField />
        <h3>General Information</h3>
        <FirstNameField />
        <LastNameField />
        <ChangePassword />
        <DeleteAccount />
      </div>
    </div>
  );
};

export default Settings;
