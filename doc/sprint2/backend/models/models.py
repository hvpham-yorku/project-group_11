from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, func, ForeignKey, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography  

Base = declarative_base()

class User(Base):
    __tablename__ = "Users"  

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    firebase_uid = Column(String, unique=True, nullable=False)  # Add this field
    name = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    phone_number = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    user_type = Column(Text, nullable=False)  # 'passenger' or 'driver'
    availability = Column(Boolean, default=False)  # Only relevant for drivers

    # Relationship to the Driver_Details table
    driver_details = relationship("DriverDetails", back_populates="user", uselist=False)


    def __repr__(self):
        return f"<User(user_id={self.user_id}, name={self.name}, email={self.email}, user_type={self.user_type})>"


class DriverDetails(Base):
    __tablename__ = "Driver_Details"

    driver_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("Users.user_id"), nullable=False)
    drivers_license = Column(String, nullable=False)
    work_eligibility = Column(String, nullable=False)
    car_insurance = Column(String, nullable=False)
    sin = Column(Integer, nullable=False)  # Integer for SIN
    bank_details = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    # Relationship to the User table
    user = relationship("User", back_populates="driver_details")

class RideRequests(Base):
    __tablename__ = "RideRequests"

    request_id = Column(Integer, primary_key=True, autoincrement=True)
    passenger_id = Column(Integer, ForeignKey("Users.user_id"), nullable=False)
    driver_id = Column(Integer, ForeignKey('Users.user_id', ondelete='SET NULL'))
    pickup_location = Column(Geography(geometry_type='POINT', srid=4326), nullable=False)
    dropoff_location = Column(Geography(geometry_type='POINT', srid=4326), nullable=False)
    status = Column(String, default="pending", nullable=False)
    created_at = Column(DateTime, default=func.now())  # Ensure default timestamp
    
    # Relationships (optional, for ease of querying)
    passenger = relationship('User', foreign_keys=[passenger_id])
    driver = relationship('User', foreign_keys=[driver_id])
