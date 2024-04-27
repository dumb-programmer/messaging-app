import IncomingRequests from "../components/IncomingRequests";
import PendingRequests from "../components/PendingRequests";
import TabComponent from "../components/TabComponent";

const Requests = () => {
  return (
    <TabComponent
      tabs={[
        { label: "Incoming", body: <IncomingRequests /> },
        { label: "Pending", body: <PendingRequests /> },
      ]}
    />
  );
};

export default Requests;
