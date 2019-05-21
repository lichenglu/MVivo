import * as tf from '@tensorflow/tfjs';

export class TFModel {
  public readonly src: string;
  private _model: tf.LayersModel;

  constructor(src: string) {
    this.src = src;
  }

  get model() {
    return this._model;
  }

  public loadModel = async () => {
    this._model = await tf.loadLayersModel(this.src);
  };
}
