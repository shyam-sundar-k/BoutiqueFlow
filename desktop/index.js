const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");

let mainWindow;
let backendProcess = null;

function waitForBackend(callback) {
    let attempts = 0;
    const maxAttempts = 40; // 20 seconds

    const check = () => {

        http.get("http://127.0.0.1:8000/", (res) => {

            console.log("Backend Ready");

            callback();

        }).on("error", () => {

            attempts++;

            if (attempts >= maxAttempts) {

                dialog.showErrorBox(
                    "Backend Error",
                    "FastAPI backend failed to start.\n\nCheck the console logs."
                );

                if (mainWindow) {
                    mainWindow.webContents.openDevTools();
                }

                return;
            }

            setTimeout(check, 500);

        });

    };

    check();
}

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        autoHideMenuBar: true,
        title: "Sri Annur Readymades POS",
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (!app.isPackaged) {

        mainWindow.loadURL("http://localhost:5173");
        mainWindow.webContents.openDevTools();
        return;

    }

    console.log("Resources Path:");
    console.log(process.resourcesPath);

    const backendPath = path.join(
        process.resourcesPath,
        "backend",
        "BoutiqueFlowBackend.exe"
    );

    console.log("Backend Path:");
    console.log(backendPath);

    if (!fs.existsSync(backendPath)) {

        dialog.showErrorBox(
            "Backend Missing",
            `Cannot find backend:\n\n${backendPath}`
        );

        return;

    }

    backendProcess = spawn(backendPath, [], {
        detached: false,
        windowsHide: true
    });

    backendProcess.stdout.on("data", (data) => {
        console.log(data.toString());
    });

    backendProcess.stderr.on("data", (data) => {
        console.error(data.toString());
    });

    backendProcess.on("error", (err) => {

        dialog.showErrorBox(
            "Backend Launch Error",
            err.message
        );

    });

    backendProcess.on("exit", (code) => {

        console.log("Backend exited:", code);

    });

    waitForBackend(() => {

        const indexPath = path.join(
            process.resourcesPath,
            "frontend",
            "index.html"
        );

        console.log("Loading:");
        console.log(indexPath);

        mainWindow.loadFile(indexPath);

    });

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {

    if (backendProcess) {

        backendProcess.kill();

    }

    if (process.platform !== "darwin") {

        app.quit();

    }

});

app.on("activate", () => {

    if (BrowserWindow.getAllWindows().length === 0) {

        createWindow();

    }

});