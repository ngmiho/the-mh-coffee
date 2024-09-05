import * as XLSX from "xlsx/xlsx.mjs";

export class ExportToExcel {
  static getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  static exportToExcel(data, sheetName, fileName) {
    return new Promise((resolve, reject) => {
      var wb = XLSX.utils.book_new();
      var ws = XLSX.utils.json_to_sheet(data);

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, `${fileName}.xlsx`);

      resolve("ok");
    });
  }
}
