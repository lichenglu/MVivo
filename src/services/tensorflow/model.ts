import * as tf from '@tensorflow/tfjs';

export interface MLModelProtocol {
  predict?: (...args: any) => Promise<any>;
  readonly model: object;
  loadModel: () => Promise<void>;
}

export interface MLModelProps {
  src: string;
}

export class MLModel implements MLModelProtocol {
  public readonly src: string;
  private _model: tf.LayersModel;

  constructor({ src }: MLModelProps) {
    this.src = src;
  }

  get model() {
    return this._model;
  }

  public loadModel = async () => {
    try {
      this._model = await tf.loadLayersModel(this.src);
    } catch (err) {
      console.log(`[Model loadModel] failed: ${err}`);
      throw err;
    }
  };
}
