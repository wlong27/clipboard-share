# Clipboard Share App

A web-based clipboard sharing application built with TypeScript, React, and Node.js/Express. Users can paste text into a shared textbox, protected by a 6-digit pin. The first user sets the pin; others must enter it to access or reset the clipboard.

---

## Features

- **Pin-protected access:** Only users with the correct 6-digit pin can view or update the clipboard.
- **Clipboard sharing:** Users can copy/paste text in a shared textbox.
- **Pin setup/reset:** First user sets the pin; users can reset it if they know the current pin.
- **Material Design UI:** Modern, responsive interface.

---

## Project Structure

```
clipboard-share/
├── package.json           # Backend dependencies & scripts
├── server.ts              # Express backend API
├── tsconfig.json          # Backend TypeScript config
├── prompt.md              # Project requirements
└── client/                # Frontend (React)
    ├── package.json       # Frontend dependencies & scripts
    ├── tsconfig.json      # Frontend TypeScript config
    ├── vite.config.ts     # Vite config
    ├── index.html         # Frontend entry point
    └── src/
        ├── App.tsx        # (Legacy/alt) React component
        ├── index.tsx      # Main React component
        ├── main.tsx       # React entry point
        ├── theme.ts       # Material theme variables
        └── react-app-env.d.ts
```

---

## How to Launch the Project

### 1. **Install Dependencies**

- **Backend:**
  ```bash
  cd clipboard-share
  npm install
  ```
- **Frontend:**
  ```bash
  cd client
  npm install
  ```

### 2. **Start the Backend**

From the `clipboard-share` folder:

```bash
npm start
```

This starts the Express server on port 3001.

### 3. **Start the Frontend**

From the `clipboard-share/client` folder:

```bash
npm run dev
```

This starts the Vite dev server (default: http://localhost:5173).

### 4. **Access the App**

- Open your browser and go to [http://localhost:5173](http://localhost:5173)
- Enter a 6-digit pin to set up or access the clipboard.

---

## Notes

- The backend stores clipboard text and pin in memory (not persistent).
- For production, consider deploying the backend (Node.js) and frontend (React static build) to cloud services (e.g., AWS, Azure).
- Update the API URL in the frontend if deploying backend to a different host.

---

## Requirements

See `prompt.md` for the original project requirements.
