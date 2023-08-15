import PropType from "prop-types";

const PendingRequest = ({ request, filterRequest }) => {
  return <div>PendingRequest</div>;
};

PendingRequest.propTypes = {
  request: PropType.object,
  filterRequest: PropType.func,
};

export default PendingRequest;
