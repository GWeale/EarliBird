import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [processes, setProcesses] = useState([]);
  const [optimization, setOptimization] = useState({});
  const [simulation, setSimulation] = useState({ time: [], states: [] });
  const [simulationParams, setSimulationParams] = useState({ time_steps: 100, initial_conditions: {} });

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    const res = await axios.get('http://localhost:5000/api/processes');
    setProcesses(res.data);
  };

  const handleOptimize = async () => {
    const res = await axios.post('http://localhost:5000/api/optimize', {
      max_input_flow: 1000,
      min_output_flow: 500,
      max_temperature: 400,
      max_pressure: 20
    });
    setOptimization(res.data);
  };

  const handleSimulate = async () => {
    const res = await axios.post('http://localhost:5000/api/simulate', simulationParams);
    setSimulation(res.data);
  };

  const renderChart = () => {
    if (simulation.time.length === 0) return null;
    const data = simulation.time.map((t, index) => {
      let entry = { time: t };
      simulation.states[index] && Object.keys(simulation.states[index]).forEach(key => {
        entry[key] = simulation.states[index][key];
      });
      return entry;
    });
    return (
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        {processes.map(process => (
          <Line key={process.name} type="monotone" dataKey={process.name} stroke="#8884d8" />
        ))}
      </LineChart>
    );
  };

  return (
    <div className="container">
      <h1 className="mt-4">Chemical Plant Optimization</h1>
      <div className="mt-4">
        <h2>Processes</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Input Flow</th>
              <th>Output Flow</th>
              <th>Temperature</th>
              <th>Pressure</th>
              <th>Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {processes.map(process => (
              <tr key={process.id}>
                <td>{process.name}</td>
                <td>{process.input_flow}</td>
                <td>{process.output_flow}</td>
                <td>{process.temperature}</td>
                <td>{process.pressure}</td>
                <td>{process.efficiency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <h2>Optimization</h2>
        <button className="btn btn-primary" onClick={handleOptimize}>Run Optimization</button>
        <pre className="mt-3">{JSON.stringify(optimization, null, 2)}</pre>
      </div>
      <div className="mt-4">
        <h2>Simulation</h2>
        <button className="btn btn-secondary" onClick={handleSimulate}>Run Simulation</button>
        {renderChart()}
      </div>
    </div>
  );
}

export default App;
