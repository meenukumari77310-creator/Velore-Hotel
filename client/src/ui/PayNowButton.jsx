import { useNavigate } from "react-router-dom";

const PayNowButton = ({ bookingId, email, amount }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event-payment-info?bookingId=${bookingId}`);
  };

  return (
    <button className="btn btn-success btn-sm mt-2" onClick={handleClick}>
      Pay Now
    </button>
  );
};

export default PayNowButton;
