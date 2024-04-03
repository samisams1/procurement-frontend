import React from 'react'
import { Text } from '@react-pdf/renderer'


const parantComponet = () => {
  return (
    <div>
        <Text>This is the content of the parent component.</Text>
      <Text>It can contain any valid React components.</Text>
    </div>
  )
}

export default parantComponet