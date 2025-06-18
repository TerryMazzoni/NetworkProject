import { useState } from "react";
import lecturesData from "./lectureRessources.json";
import axios from "axios";

import "./styles.css";

export default function SocketProgramWebsite() {
  const [tab, setTab] = useState("intro");
  const [lectureTab, setLectureTab] = useState("lecture1");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [dnsInput, setDnsInput] = useState("");
  const [dnsResponse, setDnsResponse] = useState(null);

  async function handleCalcSubmit(e) {
    e.preventDefault();
    try {
      console.log("Sending expression:", expression);
      const response = await axios.post ("http://localhost:3001/calculate", { expression });
      console.log("Received response:", response.data);
      setResult(response.data.result);
    } catch (error) {
      setResult("Error: Unable to connect to server");
    }
  }

  function handleDnsSubmit(e) {
    e.preventDefault();
    try {
      console.log("Sending DNS input:", dnsInput);
      axios
        .post("http://localhost:3001/dns", { dnsInput })
        .then((response) => {
          console.log("Received DNS response:", response.data);
          setDnsResponse(response.data.response);
        })
        .catch((error) => {
          setDnsResponse("Error: Unable to connect to DNS server");
        });
    } catch (error) {
      setDnsResponse("Error: Unable to connect to DNS server");
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
            <div className="download-section">
              <a
                href="/server.c"
                download="server.c"
                className="download-btn"
              >
                Download Server Code
              </a>
            </div>
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
            <div className="download-section">
              <a
                href="/local_dns.c"
                download="local_dns.c"
                className="download-btn"
              >
                Download DNS code
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}