import PropType from "prop-types";

const IncomingRequest = ({ request, filterRequest }) => {
  return <div>IncomingRequest</div>;
};

IncomingRequest.propTypes = {
  request: PropType.object,
  filterRequest: PropType.func,
};

export default IncomingRequest;
