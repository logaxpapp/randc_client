// src/util/parseFile.ts
import Papa from 'papaparse';
// For Excel:
import * as XLSX from 'xlsx';

/**
 * parseFile
 * 
 * Takes a File (CSV or XLS/XLSX) and returns a Promise of an array of objects
 * shaped like { firstName, lastName, email, phone } 
 * 
 * 1) If file extension is .csv or .txt => parse with Papa
 * 2) If .xls or .xlsx => parse with SheetJS
 */
export async function parseFile(file: File): Promise<Array<{ 
  firstName: string; 
  lastName: string; 
  email: string; 
  phone?: string; 
}>> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv' || extension === 'txt') {
    return parseCsv(file);
  } else if (extension === 'xls' || extension === 'xlsx') {
    return parseExcel(file);
  } else {
    throw new Error('Unsupported file type. Please upload a CSV or Excel file.');
  }
}

/** Parse CSV with Papa Parse */
function parseCsv(file: File): Promise<Array<any>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true, // expects the first row to be column names
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors?.length) {
          return reject(results.errors[0]);
        }
        // results.data is the array of row objects
        resolve(results.data as Array<any>);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
}

/** Parse Excel with SheetJS */
function parseExcel(file: File): Promise<Array<any>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        // Assuming we only read the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convert to JSON. 'header: 1' => no header row => returns arrays
        // We'll assume the file does have a header row, so let's do { header: 1 } or
        // use XLSX.utils.sheet_to_json for a header-based approach
        // Force/cast the return type to any[][]
            const json = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                defval: '',
            }) as any[][];
            
            const [headerRow, ...rows] = json; // both are any[]
            const arrayOfObjects = rows.map((row: any[]) => {
                return {
                firstName: row[0],
                lastName: row[1],
                email: row[2],
                phone: row[3],
                };
            });
        // Convert each row array into an object
        
        resolve(arrayOfObjects);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
