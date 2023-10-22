import React from 'react'
import Document from './Document'
import Tools from './Tools'
import {
  Bold,
  Italic,
  Underline,
  Super,
  Sub,
  Ordered,
  Unordered,
  Code,
  Left,
  Center,
  Right,
  Justify,
  Strike,
  BlockQuote,
  Download,
  Upload,
} from './ElementTools'

export default function Demo() {
  return (
    <div>
      <Document>
        <Tools>
          <Bold className='hola mundo' title='bold'>
            Bold
          </Bold>
          <Italic className='hola mundo' title='bold'>
            Italic
          </Italic>
          <Underline className='hola mundo' title='bold'>
            Underline
          </Underline>
          <Super className='hola mundo' title='bold'>
            Super
          </Super>
          <Sub className='hola mundo' title='bold'>
            Sub
          </Sub>
          <Ordered className='hola mundo' title='bold'>
            Ordered list
          </Ordered>
          <Unordered className='hola mundo' title='bold'>
            Unordered list
          </Unordered>
          <Code className='hola mundo' title='bold'>
            Code
          </Code>
        </Tools>
        <Tools>
          <Left className='hola mundo' title='bold'>
            Left
          </Left>
          <Center className='hola mundo' title='bold'>
            Center
          </Center>
          <Right className='hola mundo' title='bold'>
            Right
          </Right>
          <Justify className='hola mundo' title='bold'>
            Justify
          </Justify>
        </Tools>
        <Tools>
          <Strike className='hola mundo' title='bold'>
            Strike
          </Strike>
          <BlockQuote className='hola mundo' title='bold'>
            BlockQuote
          </BlockQuote>
          <Right className='hola mundo' title='bold'>
            Right
          </Right>
          <Justify className='hola mundo' title='bold'>
            Justify
          </Justify>
          <Download>descargar</Download>
          <Upload>subir</Upload>
        </Tools>
        <Document.Sheet></Document.Sheet>
      </Document>
    </div>
  )
}
