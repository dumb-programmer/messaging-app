import ContactList from "../components/ContactList";
import SendRequest from "../components/SendRequest";
import TabComponent from "../components/TabComponent";

const People = () => {
  return (
    <div>
      <TabComponent
        tabs={[
          { label: "Contacts List", body: <ContactList /> },
          {
            label: "Send Request",
            body: <SendRequest />,
          },
        ]}
      />
    </div>
  );
};

export default People;
