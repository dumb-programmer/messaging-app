import TabComponent from "../components/TabComponent";

const Requests = () => {
  return (
    <div>
      {/* <h2>Requests</h2> */}
      <TabComponent
        tabs={[
          { label: "Tab 1", body: <p>Hello, from Tab 1</p> },
          { label: "Tab 2", body: <p>Hello, from Tab 2</p> },
        ]}
      />
    </div>
  );
};

export default Requests;
