import fs from "fs";
import path from "path";

const logFilePath = path.join(__dirname, "../../logs/combined.log");

export const getRawLogs = (): string[] => {
  if (!fs.existsSync(logFilePath)) {
    throw new Error("Log file not found");
  }

  return fs.readFileSync(logFilePath, "utf8").split("\n").filter(Boolean);
};
