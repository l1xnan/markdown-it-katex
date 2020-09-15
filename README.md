# markdown-it-katex

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin to render math in markdown files.

## Installation
```
yarn add @lukasnehrke/markdown-it-katex
```
**Note:** You should not use this plugin in the browser. Render the math directly with [KaTeX](https://katex.org/docs/autorender.html).

## Usage
```js
import * as MarkdownIt from 'markdown-it'
import math from '@lukasnehrke/markdown-it-katex'

const md = new MarkdownIt()
md.use(math)

md.render('Pythagorean theorem: $a^2 + b^2 = c^2$')
```
