

# Camera Test App

A small **React (Vite) + Tailwind CSS** web application that verifies whether a user’s browser can access the camera.
The app is intentionally **simple, readable, and interview-friendly**, focusing on clarity rather than over-engineering.



##  Purpose of the App

The goal of this app is to:

* Verify **browser camera permission**
* Display a **live camera preview**
* Handle common **camera-related states and errors**
* Cleanly **start and stop** camera access

This type of app is commonly used in:

* Proctoring platforms
* Video interview tools
* Device compatibility checks

---

##  Tech Stack

* **React** (with Vite)
* **Tailwind CSS** for styling
* **Browser MediaDevices API** (`getUserMedia`)
* **React Router** for routing
* **localStorage** for minimal state persistence


##  How to Run the Project


npm install
npm run dev


* App runs at: **[http://localhost:5173](http://localhost:5173)**
* Works on modern browsers that support `MediaDevices API`

---

## 📁 Project Structure

```
src/
 ├─ components/
 │   └─ Button.jsx          # Small reusable button component
 │
 ├─ pages/
 │   ├─ HomePage.jsx        # Landing page (no camera logic)
 │   └─ CameraTestPage.jsx  # Main camera testing logic
 │
 ├─ App.jsx                 # Route configuration
 ├─ main.jsx                # Application entry point
 ├─ index.css               # Tailwind + base styles
```


##  Application Routes

### `/` – Home Page

* Displays:

  * App title
  * Short description
  * “Start Camera Test” button
* No camera logic here (important design decision)

### `/camera-test` – Camera Test Page

* Handles the **entire camera lifecycle**
* Manages all camera states and errors
* Shows live video preview

---

##  Camera Flow (Step-by-Step)

### 1️⃣ Start Camera Test

When the user clicks **“Start Camera Test”**:
<img width="925" height="425" alt="image" src="https://github.com/user-attachments/assets/8f52c9c5-2dee-465d-af14-b30a10a730a8" />

* Requests permission for the **front camera**
* Browser prompts the user for access

---

### 2️⃣ Loading State

* Button is disabled
* Spinner is shown
* Prevents multiple permission requests

  <img width="1129" height="674" alt="image" src="https://github.com/user-attachments/assets/b14db3d2-0f36-44d2-8b71-7efccf795b11" />


---

###  Camera Active

* Live preview appears on screen
  <img width="981" height="633" alt="image" src="https://github.com/user-attachments/assets/59b653ba-c3b6-4706-b6b2-a4b368832aed" />


###  Stop Camera

When the user clicks **“Stop Camera Test”**:

<img width="784" height="495" alt="image" src="https://github.com/user-attachments/assets/c4011122-9dc9-4b98-a320-970c33f343b9" />


* All media tracks are stopped
* Camera hardware is released
* Video preview is cleared


## 🔄 Camera States Managed

The app explicitly handles these states:

* **Idle** – Before starting the test
* **Loading** – Waiting for permission
* **Active** – Camera is running
* **Stopped** – Camera was stopped by user
* **Error** – Any failure during the process

This makes the app predictable and easy to debug.

---

## ⚠️ Error Handling

User-friendly messages are shown for:

* ❌ Permission denied
 
 <img width="808" height="392" alt="image" src="https://github.com/user-attachments/assets/deab9348-6884-4b95-9593-d34986064bf9" />




##  localStorage Usage

* Stores **last camera status or error**
* Used only for **user context**
* No sensitive data
* No media stored


## Deployment 

* This application is deployed on Netlify 
* Project Live link :https://majestic-klepon-498e61.netlify.app/



Just tell me 👍
