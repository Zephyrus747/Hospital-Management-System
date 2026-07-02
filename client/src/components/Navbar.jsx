import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          HMS
        </Link>

        <div className="space-x-4">
          <Link
            to="/"
            className="hover:text-blue-200 transition"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;