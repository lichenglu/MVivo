/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 *   @property {Array} onlyIn
 *   @property {Array} ignoreIn
 * @return {Object}
 */

interface SoftBreakOpts {
  shift: boolean;
}

function SoftBreak(options: SoftBreakOpts = { shift: false }) {
  return {
    onKeyDown(event, change, next) {
      if (event.key !== 'Enter') return next();
      if (options.shift && event.shiftKey === false) return next();
      return change.insertText('\n');
    },
  };
}

/**
 * Export.
 */

export default SoftBreak;
