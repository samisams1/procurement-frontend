import { Typography } from '@mui/material'
import React from 'react'

const TermsCondition = () => {
  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
      <Typography variant="h6" style={{ textDecoration: 'underline', fontWeight: 'bold', textAlign: 'center' }}>
        Terms of Sales
      </Typography>
      <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
        <Typography>
          Please order your purchase before valid days
        </Typography>
      </div>
      <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
        <Typography>
          Buyers are responsible for the requested items
        </Typography>
      </div>
      <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
        <Typography>
          If any change please notify us before 24hrs
        </Typography>
      </div>
      <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
        <Typography>
          If any change please notify us before 24hrs
        </Typography>
      </div>
    </div>
  )
}

export default TermsCondition