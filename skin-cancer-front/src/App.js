import React, { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dictionnaire des descriptions pour chaque classe
  const classDescriptions = {
    bkl: "Kératose bénigne — lésion non dangereuse.",
    nv: "Nævus (grain de beauté) — généralement bénin.",
    df: "Dermatofibrome — tumeur bénigne de la peau.",
    mel: "Mélanome — cancer agressif de la peau.",
    vasc: "Lésion vasculaire — généralement bénigne.",
    bcc: "Carcinome basocellulaire — cancer de la peau peu agressif mais à traiter.",
    akiec: "Carcinome intra-épidermique — lésion précancéreuse."
  };

  // Lorsqu'une image est sélectionnée
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPrediction(null);

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Envoi au backend
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

      {/* Upload */}
      <input type="file" onChange={handleFileChange} />
      <br /><br />

      {/* Preview image */}
      {previewImage && (
        <div>
          <h3>Image sélectionnée :</h3>
          <img
            src={previewImage}
            alt="Preview"
            style={{
              width: "350px",
              borderRadius: "10px",
              marginTop: "10px",
              boxShadow: "0 0 8px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}

      <br />

      {/* Prediction button */}
      <button onClick={handleUpload}>Envoyer pour prédiction</button>

      <br /><br />

      {/* Loading */}
      {loading && <p>Analyse en cours...</p>}

      {/* Prediction result */}
      {prediction && (
        <>
          <h2>Résultat : {prediction}</h2>

          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            <strong>{classDescriptions[prediction]}</strong>
          </p>
        </>
      )}
    </div>
  );
}

export default App;

