const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PYTHON_API_URL = "http://localhost:5002"; // Python API base URL

// Serve the HTML UI
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Stress Control</title>
    </head>
    <body>
      <h1>Stress Utility Control</h1>
      <button onclick="startStress()">Start Stress</button>
      <button onclick="stopStress()">Stop Stress</button>
      <script>
        async function startStress() {
          try {
            const response = await fetch("${PYTHON_API_URL}/start", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cpu_load: 2, duration: 60 }),
            });
            const data = await response.json();
            alert(data.message);
          } catch (error) {
            alert("Failed to start stress: " + error.message);
          }
        }

        async function stopStress() {
          try {
            const response = await fetch("${PYTHON_API_URL}/stop", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            alert(data.message);
          } catch (error) {
            alert("Failed to stop stress: " + error.message);
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(3000, () => {
  console.log("Web UI running on http://localhost:3000");
});
