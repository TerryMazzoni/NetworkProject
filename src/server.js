const net = require("net");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.post("/calculate", (req, res) => {
    console.log("Received calculation request:", req.body);
    const { expression } = req.body;

    const client = new net.Socket();
    client.connect(8888, "127.0.0.1", () => {
        client.write(expression);
    });

    client.on("data", (data) => {
        res.json({ result: data.toString() });
        client.destroy();
    });

    client.on("error", () => {
        res.status(500).json({ result: "Error: Unable to connect to C server" });
    });
});

app.post("/dns", (req, res) => {
    console.log("Received DNS request:", req.body);
    const { dnsInput } = req.body;

    const client = new net.Socket();
    client.connect(8889, "127.0.0.1", () => {
        client.write(dnsInput);
    });

    client.on("data", (data) => {
        res.json({ response: data.toString() });
        client.destroy();
    });

    client.on("error", () => {
        res.status(500).json({ response: "Error: Unable to connect to DNS server" });
    });
});

app.listen(3001, () => {
  console.log("Node.js server running on http://localhost:3001");
});