import ContactList from "../components/ContactList";
import TabComponent from "../components/TabComponent";

const People = () => {
  return (
    <div>
      <TabComponent
        tabs={[
          { label: "Contacts List", body: <ContactList /> },
          {
            label: "Send Request",
            body: <p>You can send request from here</p>,
          },
        ]}
      />
    </div>
  );
};

export default People;
