from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import subprocess
import logging
import sys
import os

port = int(os.getenv("API_PORT", 5002))
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()  # Log to console
    ]
)

# Store the subprocess so we can stop it later
stress_process = None

def check_stress_util():
    """Check if the stress utility is available."""
    try:
        subprocess.run(["stress", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        logging.info("Stress utility is available.")
    except FileNotFoundError:
        logging.error("Stress utility is not installed. Please install it before running this application.")
        sys.exit(1)
    except Exception as e:
        logging.error(f"An error occurred while checking for the stress utility: {e}")
        sys.exit(1)

@app.route("/start", methods=["POST"])
def start_stress():
    global stress_process

    # Log the incoming request
    logging.info("Received request to start stress utility.")
    logging.info(f"Request data: {request.json}")

    # Check if stress is already running
    if stress_process and stress_process.poll() is None:
        logging.warning("Attempt to start stress utility, but it is already running.")
        return jsonify({"status": "error", "message": "Stress already running"}), 400

    # Get parameters from the request
    cpu_load = request.json.get("cpu_load", 2)  # Default: 2 cores
    duration = request.json.get("duration", 10)  # Default: 10 seconds

    try:
        # Start the stress process
        logging.info(f"Starting stress with CPU load: {cpu_load}, Duration: {duration}s")
        stress_process = subprocess.Popen(["stress", "--cpu", str(cpu_load), "--timeout", str(duration)])
        logging.info("Stress utility started successfully.")
        return jsonify({"status": "success", "message": "Stress started"}), 200
    except Exception as e:
        logging.error(f"Error starting stress utility: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/stop", methods=["POST"])
def stop_stress():
    global stress_process

    # Log the incoming request
    logging.info("Received request to stop stress utility.")

    # Check if stress is running
    if stress_process and stress_process.poll() is None:
        logging.info("Stopping stress utility.")
        stress_process.terminate()
        stress_process.wait()
        logging.info("Stress utility stopped successfully.")
        return jsonify({"status": "success", "message": "Stress stopped"}), 200
    else:
        logging.warning("Attempt to stop stress utility, but no process is running.")
        return jsonify({"status": "error", "message": "No stress process running"}), 400

@app.route("/", methods=["GET"])
def health_check():
    logging.info("Health check endpoint hit.")
    return jsonify({"status": "success", "message": "Stress API is running"}), 200

if __name__ == "__main__":
    logging.info("Starting the Stress API server.")

    # Check for stress utility before starting the app
    check_stress_util()

    app.run(host="0.0.0.0", port=port)
    


