import { useState } from "react";
import lecturesData from "./lectureRessources.json";

import "./styles.css";

export default function SocketProgramWebsite() {
  const [tab, setTab] = useState("intro");
  const [lectureTab, setLectureTab] = useState("lecture1");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [dnsInput, setDnsInput] = useState("");
  const [dnsResponse, setDnsResponse] = useState(null);

  const dnsDB = useState({
    "www.google.com": "222.222.22.2",
    "portal.dankook.ac.kr": "123.123.12.1",
    "www.example.com": "98.76.54.32",
    "www.project.com": "12.34.56.78"
  });

  function handleCalcSubmit(e) {
    e.preventDefault();
    try {
      if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        throw new Error("Invalid expression");
      }
      const calculated = Function(`return (${expression})`)();
      setResult(calculated);
    } catch {
      setResult("Error: Invalid expression");
    }
  }

  function handleDnsSubmit(e) {
    e.preventDefault();
    const input = dnsInput.trim();
    const parts = input.split(/[(),\s]+/).filter(Boolean);
    const action = parts[0];
    const domain = parts[1];
    const ip = parts[2];
    const db = dnsDB[0];
    const updateDB = dnsDB[1];

    if (action === "R") {
      if (db[domain]) {
        setDnsResponse(`${domain} → ${db[domain]}`);
      } else {
        setDnsResponse("Error: Domain not found.");
      }
    } else if (action === "W") {
      if (db[domain]) {
        setDnsResponse("Error: Domain already exists.");
      } else {
        updateDB({ ...db, [domain]: ip });
        setDnsResponse(`Saved: ${domain} → ${ip}`);
      }
    } else {
      setDnsResponse("Error: Invalid format. Use (R, domain) or (W, domain, IP)");
    }
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-700 drop-shadow-sm">Socket Programming Projects</h1>

      <div className="tabs">
        {[
          { key: "intro", label: "Self Introduction" },
          { key: "lectureRessources", label: "Lecture Ressources" },
          { key: "program1", label: "Socket Program #1" },
          { key: "program2", label: "Socket Program #2" },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`tab-btn ${tab === key ? "active" : ""}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card">


        {tab === "intro" && (
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">About Me</h2>
            <p className="text-slate-700">{lecturesData.selfIntroduction}</p>
          </div>
        )}


        {tab === "lectureRessources" && (
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Lecture Ressources</h2>
            <p className="text-slate-700">This section will contain resumes of the lesson ressources.</p>

            {/* Inner Tabs */}
            <div className="inner-tabs">
            {lecturesData.lectures.map(({ key, label }) => (
              <button
                key={key}
                className={`inner-tab-btn ${lectureTab === key ? "active" : ""}`}
                onClick={() => setLectureTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Inner Tab Content */}
          <div className="inner-tab-content">
            {lecturesData.lectures.map(({ key, title, content }) =>
              lectureTab === key ? (
                <div key={key}>
                  <h3 className="text-xl font-bold text-blue-600">{title}</h3>
                  {content.split("\n").map((line, index) => {
                    if (line.startsWith("###")) {
                      return (
                        <p key={index} className="text-slate-700">
                          <strong>{line.replace("###", "").trim()}</strong>
                        </p>
                      );
                    }
                    return (
                      <p key={index} className="text-slate-700">{line}</p>
                    );
                  })}
                </div>
              ) : null
            )}
          </div>
        </div>
        )}


        {tab === "program1" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-800">Socket Program #1</h2>
            <p className="text-slate-700">Client sends an arithmetic expression. Server computes the result and returns it.</p>
            <form onSubmit={handleCalcSubmit} className="space-y-3">
              <div className="form-group">
                <input
                  type="text"
                  className="input"
                  placeholder="Enter expression like (3+5)/3-7*4"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                />
                <button type="submit" className="submit">Calculate</button>
              </div>
            </form>
            {result && result !== "Error: Invalid expression" ? (
              <p className="response green">Server response: {result}</p>
            ) : result === "Error: Invalid expression" ? (
              <p className="response red">Server response: {result}</p>
            ) : null}
          </div>
        )}


        {tab === "program2" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-800">Socket Program #2</h2>
            <p className="text-slate-700">Simulates a local DNS server with query and registration support.</p>
            <form onSubmit={handleDnsSubmit} className="space-y-3">
              <div className="form-group">
                <input
                  type="text"
                  className="input"
                  placeholder="(R, www.google.com) or (W, www.myhome.com, 1.2.3.4)"
                  value={dnsInput}
                  onChange={(e) => setDnsInput(e.target.value)}
                />
                <button type="submit" className="submit dns">Submit</button>
              </div>
            </form>
            {dnsResponse && <p className="response purple">Server response: {dnsResponse}</p>}
          </div>
        )}
      </div>
    </div>
  );
}