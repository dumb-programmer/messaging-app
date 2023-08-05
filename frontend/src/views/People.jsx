import TabComponent from "../components/TabComponent";

const People = () => {
  return (
    <div>
      <TabComponent
        tabs={[
          { label: "Contacts List", body: <p>Here are your contacts</p> },
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
