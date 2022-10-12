export class GenericDialogSettings {
  data: any;
  keyHeader: string;
  valueHeader: string;

  constructor(data: any, keyHeader = 'Key', valueHeader = 'Value') {
    this.keyHeader = keyHeader;
    this.valueHeader = valueHeader;
    this.data = data;
  }
}
