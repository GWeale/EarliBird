from data.database import db_session
from sqlalchemy import Column, Integer, String, Float

class Process(db_session):
    __tablename__ = 'processes'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    input_flow = Column(Float, nullable=False)
    output_flow = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    pressure = Column(Float, nullable=False)
    efficiency = Column(Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'input_flow': self.input_flow,
            'output_flow': self.output_flow,
            'temperature': self.temperature,
            'pressure': self.pressure,
            'efficiency': self.efficiency
        }

def initialize_processes():
    processes = [
        Process(name='Reactor', input_flow=100.0, output_flow=95.0, temperature=350.0, pressure=15.0, efficiency=0.95),
        Process(name='Distillation Column', input_flow=95.0, output_flow=90.0, temperature=150.0, pressure=10.0, efficiency=0.90),
        Process(name='Heat Exchanger', input_flow=90.0, output_flow=85.0, temperature=200.0, pressure=12.0, efficiency=0.92),
        Process(name='Separator', input_flow=85.0, output_flow=80.0, temperature=100.0, pressure=8.0, efficiency=0.88),
        Process(name='Storage Tank', input_flow=80.0, output_flow=75.0, temperature=25.0, pressure=5.0, efficiency=0.85)
    ]
    db_session.add_all(processes)
    db_session.commit()
