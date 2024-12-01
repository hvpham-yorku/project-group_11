from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, func, ForeignKey, TIMESTAMP, Numeric, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography  

Base = declarative_base()

class User(Base):
    __tablename__ = "Users"  

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    firebase_uid = Column(String, unique=True, nullable=False)
    name = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    password = Column(Text, nullable=False)  # Plain text password, change to encrypted password if there's still time.
    phone_number = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    user_type = Column(Text, nullable=False)  # 'passenger' or 'driver'
    availability = Column(Boolean, default=False)  # Only relevant for drivers

    # Relationship to the Driver_Details table
    driver_details = relationship("DriverDetails", back_populates="user", uselist=False)

    # Add relationship to BankAccount
    bank_accounts = relationship("BankAccount", back_populates="user")

    # Add relationship to Payment
    payments = relationship("Payment", back_populates="user")




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
    fare = Column(Numeric(10, 2))  # Consolidated fare column

    
    # Relationships
    passenger = relationship('User', foreign_keys=[passenger_id])
    driver = relationship('User', foreign_keys=[driver_id])

    # Relationship to the Payment table
    payments = relationship("Payment", back_populates="ride")


class BankAccount(Base):
    __tablename__ = "BankAccount"

    account_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("Users.user_id", ondelete="CASCADE"), nullable=False)
    account_number = Column(String(16), unique=True, nullable=False)
    account_type = Column(Text, nullable=False)  # 'savings' or 'checking'
    balance = Column(Numeric(15, 2), default=0.00, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationship with User
    user = relationship("User", back_populates="bank_accounts")

    # Table-level constraints
    __table_args__ = (
        CheckConstraint("account_type IN ('savings', 'checking')", name="check_account_type"),
    )

    def __repr__(self):
        return f"<BankAccount(account_id={self.account_id}, user_id={self.user_id}, balance={self.balance})>"

class Payment(Base):
    __tablename__ = "Payments"

    payment_id = Column(Integer, primary_key=True, autoincrement=True)
    bank_account_id = Column(Integer, ForeignKey("BankAccount.account_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("Users.user_id", ondelete="CASCADE"), nullable=False)
    ride_id = Column(Integer, ForeignKey("RideRequests.request_id", ondelete="CASCADE"), nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(Text, default="USD", nullable=False)  # Default currency
    payment_method = Column(Text, nullable=False)  # Add validation like 'credit_card', 'cash', 'bank_transfer'
    payment_status = Column(Text, default="pending", nullable=False)  # 'pending', 'completed', 'failed'
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="payments")  # Link to User table
    bank_account = relationship("BankAccount")  # Link to BankAccount table
    ride = relationship("RideRequests")  # Link to RideRequests table

    def __repr__(self):
        return (f"<Payment(payment_id={self.payment_id}, user_id={self.user_id}, "
                f"amount={self.amount}, status={self.payment_status})>")
