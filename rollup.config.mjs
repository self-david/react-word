import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import { createRequire } from 'node:module'
const requireFile = createRequire(import.meta.url)
const pkg = requireFile('./package.json')

export default {
  input: 'src/index.js', // Punto de entrada de tu librería
  output: [
    {
      file: pkg.main,
      format: 'cjs', // CommonJS para Node
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es', // ES module para importaciones
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: false,
    }), // Para que Rollup entienda las importaciones de módulos de Node
    commonjs(), // Para que Rollup entienda los módulos en formato CommonJS
    babel({
      exclude: 'node_modules/**', // Solo transpila nuestro código fuente
      babelHelpers: 'bundled',
    }),
    postcss({
      extensions: ['.css'],
    }),
  ],
  external: Object.keys(pkg.peerDependencies || {}), // No incluir en el bundle las dependencias pares
}
