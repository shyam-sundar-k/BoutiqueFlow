import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/settings.css";

export default function Settings() {
  const [settings, setSettings] = useState({
    boutique_name: "",
    owner_name: "",
    address: "",
    phone: "",
    email: "",
    gst_number: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/settings/");
      setSettings(res.data);
    } catch (err) {
      console.error("Error loading settings:", err);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = async () => {
    try {
      await axios.put(
        "http://127.0.0.1:8000/settings/",
        {
          boutique_name: settings.boutique_name,
          owner_name: settings.owner_name,
          address: settings.address,
          phone: settings.phone,
          email: settings.email,
          gst_number: settings.gst_number,
        }
      );

      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings.");
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-form">
          <label>Boutique Name</label>
          <input
            type="text"
            name="boutique_name"
            value={settings.boutique_name}
            onChange={handleChange}
          />

          <label>Owner Name</label>
          <input
            type="text"
            name="owner_name"
            value={settings.owner_name}
            onChange={handleChange}
          />

          <label>Address</label>
          <textarea
            name="address"
            rows="4"
            value={settings.address}
            onChange={handleChange}
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={settings.phone}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
          />

          <label>GST Number</label>
          <input
            type="text"
            name="gst_number"
            value={settings.gst_number}
            onChange={handleChange}
          />

          <button type="button" onClick={saveSettings}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}