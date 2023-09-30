const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Parse JSON request body

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/convert", async (req, res) => {
  try {
    console.log("Convert request received");
    console.log("RED BODY:", req.body);
    // Get the checkbox states and button display states from the request
    const { checkboxStates, buttonDisplay } = req.body;
    console.log(checkboxStates);

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load the locally hosted HTML file
    await page.goto(`file://${__dirname}/index.html`, {
      waitUntil: "networkidle2",
    });

    // Update checkbox states based on the request data
    for (const checkboxId in checkboxStates) {
      if (checkboxStates.hasOwnProperty(checkboxId)) {
        const isChecked = checkboxStates[checkboxId];
        await page.evaluate(
          (id, checked) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
              checkbox.checked = checked;
            }
          },
          checkboxId,
          isChecked
        );
      }
    }

    // Update button displays based on the request data
    for (const buttonId in buttonDisplay) {
      console.log(buttonId);
      if (buttonDisplay.hasOwnProperty(buttonId)) {
        const displayValue = buttonDisplay[buttonId];
        await page.evaluate(
          (id, display) => {
            const button = document.getElementById(id);
            if (button) {
              button.style.display = display;
            }
          },
          buttonId,
          displayValue
        );
      }
    }

    // Capture a screenshot of the entire webpage
    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 100,
      fullPage: true,
    });

    // Save the screenshot as a JPG file in the public directory
    const screenshotPath = path.join(__dirname, "public", "page.jpg");
    fs.writeFileSync(screenshotPath, screenshot);

    // Close the browser
    await browser.close();

    console.log("Webpage converted to JPG");
    res.status(200).send("Webpage converted to JPG");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
