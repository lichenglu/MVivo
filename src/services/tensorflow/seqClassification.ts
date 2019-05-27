import * as tf from '@tensorflow/tfjs';

import { MLModel, MLModelProps, MLModelProtocol } from './model';
import { padSequence, standardizeText } from './utils';

interface SequenceClassificationModelProps extends MLModelProps {
  tokenizer: { [key: string]: number };
  labels: string[];
  maxSequenceLength: number;
}

export class SequenceClassificationModel extends MLModel
  implements SequenceClassificationModelProps, MLModelProtocol {
  public readonly tokenizer: { [key: string]: number };
  public readonly labels: string[];
  public readonly maxSequenceLength: number;

  constructor(props: SequenceClassificationModelProps) {
    super(props);
    this.tokenizer = props.tokenizer;
    this.labels = props.labels;
    this.maxSequenceLength = props.maxSequenceLength;
  }

  public textToSequence = (text: string): tf.Tensor => {
    const stdText = standardizeText(text);
    let encoded = stdText.split(' ').map(txt => this.tokenizer[txt] || 0);
    encoded = padSequence(encoded, 0, this.maxSequenceLength);
    return tf.tensor([encoded]);
  };

  public predict = async (text: string): Promise<object[]> => {
    if (!this.model) {
      console.log(
        `this.model cannot be nullable. Make sure you have loaded model successfully`
      );
      throw new Error('[predict] model is required, but is now undefined');
    }
    const prediction = await this.model
      .predict(this.textToSequence(text))
      // @ts-ignore
      .data();

    return this.decodePrediction(prediction);
  };

  private decodePrediction = (prediction: Float32Array[]) => {
    return Array.from(prediction)
      .map((p, idx) => ({
        code: this.labels[idx],
        prob: Number(p),
      }))
      .sort((a, b) => b.prob - a.prob);
  };
}
