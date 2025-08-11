import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Payment Successful</h1>
        <p>Thank you! Your payment has been processed.</p>
        <Link className="underline" to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default Success;


