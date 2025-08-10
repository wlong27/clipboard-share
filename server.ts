import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let clipboardText = "";
let pinCode: string | null = null;

// Middleware to check pin
function requirePin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { pin } = req.body;
  if (!pinCode) {
    return res.status(400).json({ error: "Pin not set yet." });
  }
  if (pin !== pinCode) {
    return res.status(401).json({ error: "Invalid pin." });
  }
  next();
}

// Set pin and text (first user)
app.post("/set", (req: express.Request, res: express.Response) => {
  const { pin, text } = req.body;
  if (pinCode) {
    return res.status(400).json({ error: "Pin already set." });
  }
  if (!/^[0-9]{6}$/.test(pin)) {
    return res.status(400).json({ error: "Pin must be 6 digits." });
  }
  pinCode = pin;
  clipboardText = text || "";
  res.json({ success: true });
});

// Authenticate and get clipboard
app.post("/auth", (req: express.Request, res: express.Response) => {
  const { pin } = req.body;
  if (!pinCode) {
    return res.status(400).json({ error: "Pin not set yet." });
  }
  if (pin !== pinCode) {
    return res.status(401).json({ error: "Invalid pin." });
  }
  res.json({ text: clipboardText });
});

// Update clipboard text
app.post(
  "/update",
  requirePin,
  (req: express.Request, res: express.Response) => {
    clipboardText = req.body.text || "";
    res.json({ success: true });
  }
);

// Reset pin
app.post(
  "/reset-pin",
  requirePin,
  (req: express.Request, res: express.Response) => {
    const { newPin } = req.body;
    if (!/^[0-9]{6}$/.test(newPin)) {
      return res.status(400).json({ error: "New pin must be 6 digits." });
    }
    pinCode = newPin;
    res.json({ success: true });
  }
);

// Health check
app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("Clipboard Share API running");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
