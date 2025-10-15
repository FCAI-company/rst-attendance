import fs from "fs";
import path from "path";
import { encryptData, decryptData } from "../cryptoUtils";

const DATA_FILE = path.join(process.cwd(), "data", "records.enc");

function ensureFileExists() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, encryptData([]));
}

export function readRecords(): any[] {
  ensureFileExists();
  const encrypted = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return decryptData(encrypted);
  } catch {
    return [];
  }
}

export function writeRecords(records: any[]) {
  ensureFileExists();
  const encrypted = encryptData(records);
  fs.writeFileSync(DATA_FILE, encrypted, "utf-8");
}

export function addRecord(record: any) {
  const records = readRecords();
  records.push(record);
  writeRecords(records);
}

export function updateRecord(id: string, newData: any) {
  const records = readRecords();
  console.log("Current records before update:", records);
  const index = records.findIndex((r) => r.id === id);
  if (index !== -1) {
    records[index] = { id, newData };
    writeRecords(records);
  }else{
    addRecord({id,newData});
  }
}
