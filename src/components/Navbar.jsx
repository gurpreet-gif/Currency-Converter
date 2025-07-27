import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">UniRate</Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
