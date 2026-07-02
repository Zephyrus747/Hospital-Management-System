import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          HMS
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="hover:text-blue-200 transition"
          >
            Home
          </Link>

          <span className="hidden md:block">
            Dr. John Dorian
          </span>

          <Link
            to="/login"
            className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;