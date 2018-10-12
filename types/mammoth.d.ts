declare module 'mammoth' {
  interface Options {
    styleMap: string[];
    includeDefaultStyleMap: boolean;
  }
  interface Result {
    value: string;
    messages: string[];
  }

  interface Input {
    arrayBuffer: ArrayBuffer;
    path?: string;
  }

  export interface Mammoth {
    convertToHtml(input: Input, options?: Options): Promise<Result>;
    extractRawText(input: Input): Promise<Result>;
  }

  var instance: Mammoth;

  export { instance as default };
}
