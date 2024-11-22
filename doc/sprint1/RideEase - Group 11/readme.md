# RideEase Setup Guide

This guide will walk you through setting up the RideEase project on your local machine.

## Steps to Get Started

1. **Clone the Repository**  
   First, clone the repository to your local machine using the following command:
   
bash
   git clone <repository-url>
   
2. **Install Expo Go App on Your Phone**  
   Download the [Expo Go App](https://expo.dev/client) from the App Store (iOS) or Google Play (Android). Once installed, make sure to enable the local network on your phone to connect to the development server.

3. **Navigate to the Project Directory**  
   Open a terminal and change to the project directory:
   
bash
   cd "./doc/sprint1/RiseEase - Group 11/RideEase"
   
4. **Add Expo to Your Project**  
   Run the following command to add Expo to your project:
   
bash
   npm add expo
   
5. **Download and Install Node.js**  
   Download and install the LTS (Long Term Support) version of [Node.js](https://nodejs.org/).

6. **Install Required Packages**  
   Run the following commands to install the necessary dependencies:
   
bash
   npm install nativewind
   npm install --save-dev tailwindcss@3.3.2
   npm install react-native-safe-area-context
   
7. **Run the Project**  
   Once the dependencies are installed, you can start the project by running:
   
bash
   expo start
   
## Additional Notes
- Ensure that you have a stable internet connection for package installations.
- If you run into any issues during the setup, try checking the logs in the terminal or the Expo Go App for more information.

---