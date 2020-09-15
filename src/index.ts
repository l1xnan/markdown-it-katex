import * as katex from 'katex'
import * as Renderer from "markdown-it/lib/renderer";
import { PluginWithOptions } from 'markdown-it/lib'
import { RuleInline } from 'markdown-it/lib/parser_inline'
import { RenderRule } from "markdown-it/lib/renderer"

export interface PluginOptions {
  delimiter: string
  render: RenderRule|null
  katexOptions: katex.KatexOptions
}

const defaultOptions = {
  delimiter: '$',
  render: null,
  katexOptions: {}
}

const math_plugin: PluginWithOptions<PluginOptions> = (md, options = defaultOptions) => {

  const tokenize: RuleInline = (state, silent) => {
    let pos = state.pos
    const ch = state.src[pos]

    if (ch !== options.delimiter) {
      return false
    }

    let display = false
    const start = pos++
    const max = state.posMax

    while (pos < max && state.src[pos] === options.delimiter) {
      display = true
      pos++
    }

    const marker = state.src.slice(start, pos)

    let matchEnd = pos
    let matchStart = state.src.indexOf(options.delimiter, matchEnd)

    while (matchStart !== -1) {
      matchEnd = matchStart + 1
      while (matchEnd < max && state.src[matchEnd] === options.delimiter) {
        matchEnd++
      }
      if (matchEnd - matchStart === marker.length) {
        if (!silent) {
          const token = state.push('math_inline', '', 0)
          token.markup = marker
          token.content = state.src.slice(pos, matchStart).replace(/\n/g, ' ').replace(/^ (.+) $/, '$1')
          if (display) {
            token.attrSet('display-mode', 'true')
          }
        }
        state.pos = matchEnd
        return true
      }
    }

    if (!silent) {
      state.pending += marker
    }

    state.pos += marker.length
    return true;
  }

  const renderInline: Renderer.RenderRule = (tokens, idx, _options, env, self) => {
    env.hasMath = true
    return katex.renderToString(tokens[idx].content, {
      ...options.katexOptions,
      displayMode: !!tokens[idx].attrGet('display-mode')
    })
  }

  md.inline.ruler.before('emphasis', 'math_inline', tokenize)
  md.renderer.rules['math_inline'] = options.render || renderInline
}

export default math_plugin
