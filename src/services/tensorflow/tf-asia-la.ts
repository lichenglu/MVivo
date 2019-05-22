import * as tf from '@tensorflow/tfjs';

import { TFModel } from './tf-model';
import tokenizer from './tokenizer.json';
import { padSequence, standardizeText } from './utils';

const SEQUENCE_LENGTH = 55;
const TRAINED_CODES = [
  'Personal advice',
  'Vocatives (addressing individual)',
  'Complementing, expressing appreciation',
  'Negative Activating',
  'Asking questions',
];
export class TFAsiaLAModel extends TFModel {
  public textToSequence = (text: string): tf.Tensor => {
    const stdText = standardizeText(text);
    let encoded = stdText.split(' ').map(txt => tokenizer[txt] || 0);
    encoded = padSequence(encoded, 0, SEQUENCE_LENGTH);
    return tf.tensor([encoded]);
  };

  public predict = (text: string) => {
    if (!this.model) {
      console.log(
        `this.model cannot be nullable. Make sure you have loaded model successfully`
      );
      return;
    }
    return (
      this.model
        .predict(this.textToSequence(text))
        // @ts-ignore
        .data()
        .then((prediction: Float32Array[]) => {
          return this.decodePrediction(prediction);
        })
    );
  };

  public decodePrediction = (prediction: Float32Array[]) => {
    return Array.from(prediction)
      .map((p, idx) => ({
        code: TRAINED_CODES[idx],
        prob: Number(p),
      }))
      .sort((a, b) => b.prob - a.prob);
  };
}
