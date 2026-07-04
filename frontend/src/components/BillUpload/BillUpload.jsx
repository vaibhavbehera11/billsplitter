import { useState } from "react";
import api from "../../services/api";

function BillUpload({ onItemsExtracted }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setError("");

    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose a bill image.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("billImage", file);

      const response = await api.post(
        "/ai/parse-bill",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        onItemsExtracted(response.data.items || []);
        setFile(null);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to scan bill.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 mt-6">
      <h3 className="text-lg font-semibold mb-3">
        Scan Bill
      </h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-white"
      >
        {loading ? "Scanning..." : "Scan Bill"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

export default BillUpload;