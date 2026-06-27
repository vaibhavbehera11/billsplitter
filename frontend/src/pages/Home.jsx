import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-700">
            Bill Splitter
          </h1>

          <p className="text-gray-500 mt-3">
            Split bills with friends in real time.
          </p>
        </div>

        <div className="space-y-4">

          <button
            onClick={() => navigate("/create-session")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Create Session
          </button>

          <button
            onClick={() => navigate("/join-session")}
            className="w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 rounded-xl font-semibold transition"
          >
            Join Session
          </button>

        </div>

      </div>
    </div>
  );
}

export default Home;