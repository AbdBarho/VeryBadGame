const Path = require('path');
const InlineSource = require('inline-source');
const FS = require('fs');

module.exports = {
  context: Path.resolve(__dirname),
  entry: './index.ts',
  mode: 'production',
  output: {
    path: Path.join(__dirname, './dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: 'ts-loader'
    }]
  },
  plugins: [{
    apply: function(compiler) {
      compiler.hooks.done.tap('Inline source', async function() {
        const html = await InlineSource.inlineSource(Path.resolve('./index.html'), {
          compress: false // compressing actually breaks the code
        });
        if (!FS.existsSync('./build')) {
          FS.mkdirSync('./build');
        }
        await FS.writeFileSync('./build/index.html', html, { encoding: 'utf8' });
        console.log('source has been inlined');
      })
    }
  }]
};
