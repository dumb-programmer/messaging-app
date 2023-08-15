import IncomingRequests from "../components/IncomingRequests";
import PendingRequests from "../components/PendingRequests";
import TabComponent from "../components/TabComponent";

const Requests = () => {
  return (
    <div>
      <TabComponent
        tabs={[
          { label: "Incoming", body: <IncomingRequests /> },
          { label: "Pending", body: <PendingRequests /> },
        ]}
      />
    </div>
  );
};

export default Requests;
