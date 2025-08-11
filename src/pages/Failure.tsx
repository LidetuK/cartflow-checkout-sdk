import { Link } from 'react-router-dom';

const Failure = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Payment Failed</h1>
        <p>Sorry, your payment could not be completed.</p>
        <Link className="underline" to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default Failure;


