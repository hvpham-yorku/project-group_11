The goal of sprint 2 is to fully commit to 17 user stories that combine the essential features of the project together. As mentioned in sprint0, this is a three-tier application where we would have the presentation layer, application layer, and data layer.

For the completion of this project, we would need the presentation tier for all user stories below (using React Native and Expo), as well as the application layer (using Flask) and data layer (using Postgreqsl).

**Tasks that were completed in Sprint1**

1. Create a "Get Started" page with an engaging, user-friendly design that welcomes users, similar to the intuitive onboarding experiences found in modern apps.
2. Create a Sign Up page for the User. (Combination of User Study 1 and 2)
3. Have a verification code sent on the User's email they provided to authenticate the user.
4. Create a Sign In page for the User.
5. Create a Home page where the user is directed to once they have signed in with their RideEase account.

**17 User Stories to work on:**

1.  As a passenger, I want to create an account and provide my information so that I can use the app’s services. (Needs to be updated in Sprint 2)
2. As a driver, I want to create an account and provide my necessary documents so that I can use the app’s services to find passengers. (Needs to be updated in Sprint 2)
3. As a passenger, I want to set a destination and view the estimated fare so that I know the cost of my ride before booking.
4. As a driver, I want to view incoming ride requests with passenger information so that I can choose to accept or decline.
5. As a passenger, I want to see the driver's estimated time of arrival once the ride is booked so that I can prepare for pickup.
6. As a passenger, I want to be able to track the driver’s location live so that I know the progress of my ride.
7. As a driver, I want to be able to navigate to the pickup location with the GPS provided in-app for ease of access.
8. As an admin, I want to be able to view a dashboard showing all active rides so that I can monitor platform activity.
9. As a passenger, I want the option to rate my driver after the ride is complete so that I can share feedback.
10. As a driver, I want to be able to review my payments for each ride so that I can track my earnings.
11. As a driver, I want a confirmation of payment after each completed ride to ensure I receive accurate compensation.
12. As an admin, I want to be able to review any complaints or feedback from users to ensure quality service.
13. As a passenger, I want to receive notifications if my driver is delayed so that I can adjust my plans.
14. As a driver, I want to see an option to log out of the app so that I can securely end my session.
15. As a passenger, I want to be able to edit my profile information (such as address or payment details) so that my information remains accurate.
16. As an admin, I want to have a way to view user documents for background checks, ensuring user verification.
17. As a driver, I want to set my availability status (online/offline) so that I only receive ride requests when I’m available.

**The team consists of 5 members:** Ahmad, Ryan, Hassan, AbdulBasit, and Allen.

**The participants of this sprint are**: Ahmad, Ryan, Hassan, AbdulBasit, and Allen. (5/5)

All participants were present. Meeting took place on Nov 28, 2024 at 6pm.


**Spikes / Topics that require further research by the groups for this sprint are:**

1. Frontend and Backend Connection: How can we ensure smooth communication between the React Native frontend and Flask backend, especially for user sign-ups, login, and ride requests?

2. Real-Time GPS Tracking: How can we implement real-time GPS tracking to show driver locations and estimated arrival times on the passenger’s screen?

3. Handling User Profile Updates (Backend & Frontend Sync): How can we ensure that when users update their profile information (address, payment details), the changes are correctly reflected in both the frontend and the backend?


As the goal of this sprint was to add some essential features to the project, the members are divided and assigned to handle the discussed user stories above.

### Team Capacity
1. Ahmad: 20 hours per week
2. Ryan: 18 hours per week
3. Hassan: 16 hours per week
4. Allen: 15 hours per week
5. AbdulBasit: 12 hours per week


**Workflow of the app:**
1. Create a backend branch on github. Create the Application layer and the data layer for each of the user stories. Push the files to the branch and later push them to the main branch.
2. Once the backend has been tested and the result work the way expected, we later design a workflow on Figma for each of the corresponding front-end pages. Figma link shared between group members.
3. Upon completion of the Figma workflow, we will work on the Presentation layer and each of the members designing the front-end pages would have their own branches (front-end-ryan, front-end-hassan, front-end-allen) where the each of the group members push their changes to their branch.
4. Frequently pull updates from the shared base branch (front-end) to keep everyone’s work aligned and and merge individual branches.

### Division of Tasks

**Backend for all user studies** Ahmad

Ahmad will set up the backend for each user story with the database.

**Setting a workflow for the frontend pages and functionalities** Hassan and Ryan

Hassan and Ryan will design pages on Figma based on the backend implemented by Ahmad. Design a workflow for how each of the pages work, what will be displayed, and to which pages the users would be navigated to based on the input of the users.

**Frontend pages for all user stories** Ryan, Hassan, and Allen

Hassan would work on the following places: Sign Up option page, updated Sign Up page for passengers and drivers, Ratings pages, Complaint page.

Ryan would work on the following pages: Updated Home Page / Ride Request Page, View Requests Page, Accept Request Page, Ride in Progress Page, Driver Pickup Page, Ride Completion Page, Fare Calculation Page, and Get Driver ETA Page.

Allen would work on the following pages: Driver Profile Page, Driver Payment History Page, Set Availability Page, and Update Profile Page.

**Connecting the frontend and backend** Ryan and Ahmad

Ryan and Ahmad will integrate the React Native frontend with the Flask backend, focusing on user sign-up, login, ride requests, and ratings. They’ll establish API endpoints in Flask, connect them to the frontend, and ensure smooth data flow and real-time updates (like ride status and GPS tracking).

**Note-Taking and documentation** AbdulBasit

AbdulBasit will create the System Design document, including the  CRC Cards and a Software Architecture Diagram following the MVC model. Additionally, he will manage project tracking in Jira, ensuring tasks are assigned, user stories are linked, and bugs or blockers are addressed, while keeping the team updated on sprint progress.

