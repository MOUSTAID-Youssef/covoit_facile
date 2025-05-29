import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white/70 backdrop-blur-xl shadow-xl fixed w-full top-0 z-50 transition-all duration-300 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">CovoitFacile</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-500 inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-indigo-50/50 rounded-t-lg"
              >
                Accueil
              </Link>
              <Link
                to="/create"
                className="border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-500 inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-indigo-50/50 rounded-t-lg"
              >
                Proposer un trajet
              </Link>
              <Link
                to="/faq"
                className="border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-500 inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-indigo-50/50 rounded-t-lg"
              >
                FAQ
              </Link>
              <Link
                to="/test"
                className="border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-500 inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-indigo-50/50 rounded-t-lg"
              >
                test
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out hover:bg-indigo-50/50 hover:scale-105"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 ease-in-out hover:shadow-indigo-500/25 hover:scale-105 hover:translate-y-[-2px]"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;