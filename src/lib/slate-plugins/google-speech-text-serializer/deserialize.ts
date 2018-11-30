import { Mark, Node, Value } from 'slate';
import { flatten } from 'ramda';

interface GSpeechTextOutput {
  results: GSpeechTextResult[];
}

interface GSpeechTextResult {
  alternatives: GSpeechTextAlternative[];
  languageCode: string;
}

interface GSpeechTextAlternative {
  transcript: string;
  confidence: number;
  words: GSpeechTextWord[];
}

interface GSpeechTextWord {
  startTime: GSpeechTextWordTime;
  endTime: GSpeechTextWordTime;
  word: string;
  speakerTag?: string;
}

interface GSpeechTextWordTime {
  seconds?: string;
  nanos?: number;
}

interface Options {
  blockType: string;
  wordMarkType: string;
  toJSON?: boolean;
}

export function deserialize(gsOutput: GSpeechTextOutput, options: Options) {
  const { blockType, toJSON = false } = options;
  const { results } = gsOutput;

  let prevWordsCount = 0;
  const json = {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: flatten(
        results.slice(0, results.length - 1).map((result, idx) => {
          const alt = result.alternatives[0];
          let words = alt.words;
          if (idx === results.length - 2) {
            words = words.slice(prevWordsCount);
          }
          prevWordsCount += words.length;

          return [
            {
              object: 'block',
              data: {
                confidence: alt.confidence,
                languageCode: result.languageCode,
              },
              type: blockType,
              nodes: [
                {
                  object: 'text',
                  leaves: createWordLeaves(words, options),
                },
              ],
            },
            {
              object: 'block',
              type: 'paragraph',
            },
          ];
        })
      ),
    },
  };

  return toJSON ? json : Value.fromJSON(json);
}

export function createWordLeaves(words: GSpeechTextWord[], options: Options) {
  const { wordMarkType } = options;
  return words.map((word, idx) => {
    return {
      object: 'leaf',
      text: idx === words.length - 1 ? word.word : word.word + ' ',
      marks: [
        Mark.create({
          type: wordMarkType,
          data: {
            startTime: extractWordTime(word.startTime),
            endTime: extractWordTime(word.endTime),
          },
        }),
      ],
    };
  });
}

function extractWordTime(timeObj: GSpeechTextWordTime) {
  const { nanos = 0, seconds = 0 } = timeObj;
  return parseFloat(`${seconds}.${nanos / 100000000}`);
}
