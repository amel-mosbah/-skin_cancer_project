import React, { useState } from "react";

const CLASS_INFO = {
  nv: {
    name: "Nevus (Benign mole)",
    description:
      "A very common benign skin lesion. Usually harmless and does not require treatment.",
  },
  mel: {
    name: "Melanoma",
    description:
      "An aggressive type of skin cancer. Immediate medical consultation is strongly recommended.",
  },
  bkl: {
    name: "Benign Keratosis",
    description:
      "A non-cancerous skin growth often related to aging or sun exposure.",
  },
  bcc: {
    name: "Basal Cell Carcinoma",
    description:
      "A common skin cancer with slow growth. Medical treatment is required.",
  },
  akiec: {
    name: "Actinic Keratosis",
    description:
      "A pre-cancerous lesion caused by sun exposure. Requires medical follow-up.",
  },
  df: {
    name: "Dermatofibroma",
    description:
      "A benign skin lesion, firm to the touch and generally harmless.",
  },
  vasc: {
    name: "Vascular Lesion",
    description:
      "A lesion related to blood vessels. Usually benign.",
  },
};

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setResult(null);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handlePredict = async () => {
    if (!file) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch(
        "https://skin-cancer-api-lmrp.onrender.com/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setResult(CLASS_INFO[data.predicted_class]);
    } catch (error) {
      alert("Prediction failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 text-center">

        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Skin Cancer Detection
        </h1>
        <p className="text-gray-500 mb-6">
          Upload a skin lesion image to get an AI-based prediction
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mx-auto mb-4 block text-sm"
        />

        {preview && (
          <div className="flex justify-center mb-6">
            <img
              src={preview}
              alt="preview"
              className="w-64 h-64 object-cover rounded-xl border shadow"
            />
          </div>
        )}

        <button
          onClick={handlePredict}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition"
        >
          Run Prediction
        </button>

        {loading && (
          <p className="mt-4 text-gray-600 animate-pulse">
            Analyzing image...
          </p>
        )}

        {result && (
          <div className="mt-6 border rounded-xl p-5 bg-gray-50 shadow-md animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800">
              Prediction Result
            </h2>
            <p className="mt-2 font-bold text-blue-600">
              {result.name}
            </p>
            <p className="mt-2 text-gray-700 text-sm">
              {result.description}
            </p>

            <p className="mt-4 text-xs text-gray-500">
              ⚠️ This AI prediction is for educational purposes only and does not
              replace professional medical diagnosis.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
