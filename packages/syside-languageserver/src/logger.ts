import fs from "fs";
import path from "path";

// Define the debug file path (you can change this to your desired location)
const debugFilePath = path.join(__dirname, "LogRecord.log");

// Utility to log messages into the debug file
export function logToDebugFile(message: string): void {
    // Append the message to the debug.log file
    fs.appendFile(debugFilePath, message, (err) => {
        if (err) {
            console.error("Error writing to debug file:", err);
        }
    });
}
