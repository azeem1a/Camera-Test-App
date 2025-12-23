# Camera Test App

Small React (Vite) + Tailwind app to verify browser camera access. Kept simple and interview-friendly.

## Run
```bash
npm install
npm run dev   # http://localhost:5173
```

## Structure
```
src/
  components/
    Button.jsx          # Small reusable button
  pages/
    HomePage.jsx        # "/" static landing page
    CameraTestPage.jsx  # "/camera-test" core camera flow
  App.jsx               # Routes
  main.jsx              # Entry point
  index.css             # Tailwind + base styles
```

## Routes
- `/` Home: Title + button to start the test (no camera logic here).
- `/camera-test`: Requests permission, shows live preview, and handles states: idle, loading, active, stopped, error. Stops all tracks on stop/unmount and saves last status/error in `localStorage` only for user context.

## Camera Flow
- On “Start Camera Test”, calls `navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' } } })`.
- Stream is attached to `<video>`; `video.play()` is invoked so the preview appears.
- Tracks are stopped on stop/unmount; friendly errors for permission denied, missing camera, or generic failures.
- If autoplay is blocked, a “Resume Preview” button triggers `video.play()` manually.

## Notes
- No photos/recording; no media is stored or sent anywhere.
- Buttons disable during loading and show a spinner while permission is requested.
