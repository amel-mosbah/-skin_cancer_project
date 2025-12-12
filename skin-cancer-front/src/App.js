import React, { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPrediction(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Veuillez choisir une image !");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);

    const response = await fetch(
      "https://skin-cancer-api-lmrp.onrender.com/predict",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    setPrediction(data.predicted_class);
    setLoading(false);
  };

  return (
    <div style={{ padding: 50, textAlign: "center" }}>
      <h1>Détection du cancer de la peau</h1>

      <input type="file" onChange={handleFileChange} />

      <br /><br />

      <button onClick={handleUpload}>
        Envoyer pour prédiction
      </button>

      <br /><br />

      {loading && <p>Analyse en cours...</p>}
      {prediction && <h2>Résultat : {prediction}</h2>}
    </div>
  );
}

export default App;
