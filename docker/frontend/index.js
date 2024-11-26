const express = require("express");
const app = express();

const API_URL = process.env.BACKEND_URI || "http://localhost:5002";

// Serve index.html with the API_URL injected
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Stress Controller</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          width: 300px;
        }
        h1 {
          font-size: 24px;
          color: #25d366;
          margin-bottom: 20px;
        }
        select, input, button {
          font-size: 16px;
          padding: 10px;
          margin: 10px 0;
          border: none;
          border-radius: 5px;
          width: 100%;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        input {
          background-color: #f9f9f9;
        }
        button {
          background-color: #25d366;
          color: white;
        }
        button:hover {
          background-color: #1da851;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Stress Controller</h1>
        <label for="cpu-cores">Number of CPU Cores:</label>
        <select id="cpu-cores">
          <option value="1">1 Core</option>
          <option value="2">2 Cores</option>
          <option value="4">4 Cores</option>
          <option value="8">8 Cores</option>
        </select>

        <label for="duration">Duration (seconds):</label>
        <input id="duration" type="number" placeholder="Enter duration" min="1" />

        <button id="start-button">Start Stress</button>
        <button id="stop-button">Stop Stress</button>
      </div>

      <script>
        const API_URL = "${API_URL}";

        document.getElementById("start-button").addEventListener("click", async () => {
          const cpuLoad = document.getElementById("cpu-cores").value;
          const duration = document.getElementById("duration").value;

          if (!duration || duration <= 0) {
            alert("Please enter a valid duration.");
            return;
          }

          try {
            const response = await fetch("${API_URL}/start", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                cpu_load: parseInt(cpuLoad, 10),
                duration: parseInt(duration, 10)
              })
            });
            const result = await response.json();
            alert(result.status);
          } catch (error) {
            alert("Failed to start stress: " + error.message);
          }
        });

        document.getElementById("stop-button").addEventListener("click", async () => {
          try {
            const response = await fetch("${API_URL}/stop", { method: "POST" });
            const result = await response.json();
            alert(result.status);
          } catch (error) {
            alert("Failed to stop stress: " + error.message);
          }
        });
      </script>
    </body>
  </html>
  `);
});

// Start the server
app.listen(3000, () => {
  console.log("UI running on http://localhost:3000");
  console.log("API_URL:", API_URL);
});
