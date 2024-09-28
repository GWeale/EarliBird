import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models.process import Process, initialize_processes
from models.optimization import optimize_operations
from models.simulation import run_simulation
from data.database import db_session, init_db

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chemical_plant.db'
db = SQLAlchemy(app)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

@app.route('/api/processes', methods=['GET'])
def get_processes():
    processes = Process.query.all()
    return jsonify([process.to_dict() for process in processes]), 200

@app.route('/api/optimize', methods=['POST'])
def optimize():
    data = request.json
    optimization_results = optimize_operations(data)
    return jsonify(optimization_results), 200

@app.route('/api/simulate', methods=['POST'])
def simulate():
    data = request.json
    simulation_results = run_simulation(data)
    return jsonify(simulation_results), 200

if __name__ == '__main__':
    if not os.path.exists('chemical_plant.db'):
        init_db()
        initialize_processes()
    app.run(debug=True)
