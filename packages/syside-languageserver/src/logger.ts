import fs from "fs";
import path from "path";

// Define the debug file path (you can change this to your desired location)
const debugFilePath = path.join(__dirname, "LogRecord.log");

// Utility to log messages into the debug file
export function logToDebugFile(message: string): void {
    const timestamp = new Date().toISOString(); // Add timestamp to each log
    const logMessage = `[${timestamp}] ${message}\n`;

    // Append the message to the debug.log file
    fs.appendFile(debugFilePath, logMessage, (err) => {
        if (err) {
            console.error("Error writing to debug file:", err);
        }
    });
}
