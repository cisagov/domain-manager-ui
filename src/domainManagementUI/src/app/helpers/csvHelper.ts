export class CSVHelper {
    /**
     * Reads a CSV file and returns the contents as a string.
     * @param file
     */
    public async convertCsv(file: File): Promise<string> {
      let fileReader = new FileReader();
      fileReader.readAsText(file);
  
      return new Promise((resolve) => {
        fileReader.onload = (e) => {
          let x = fileReader.result.toString();
          resolve(x);
        };
      });
    }
  }
  