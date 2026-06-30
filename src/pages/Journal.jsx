import { useState, useEffect } from "react";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [hours, setHours] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem("journal");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  // Save data
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("journal", JSON.stringify(entries));
    }
  }, [entries, loaded]);

  const addEntry = () => {
    if (!text || !hours) return;

    const newEntry = {
      date: new Date().toLocaleDateString(),
      text,
      hours
    };

    setEntries([newEntry, ...entries]);
    setText("");
    setHours("");
  };

  if (!loaded) return null;

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Journal</h2>

      <input
        placeholder="What did you study?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        placeholder="Hours"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />

      <button onClick={addEntry}>Add</button>

      <div style={{ marginTop: "20px" }}>
        {entries.map((e, i) => (
          <div key={i} style={cardStyle}>
            <p>{e.date}</p>
            <p>{e.text}</p>
            <p>{e.hours} hrs</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1e293b",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px"
};