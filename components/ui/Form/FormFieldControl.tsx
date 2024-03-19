'use client'

import React, {memo} from 'react'
import {Controller} from 'react-hook-form'

const FormFieldControl = ({control, name, Component, ...props}: any) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({fieldState, field: {ref, ...rest}}) => (
        <Component
          className="mb-4"
          {...rest}
          {...props}
          error={Boolean(fieldState.invalid)}
          helperText={fieldState?.error?.message}
          name={name}
        />
      )}
    />
  )
}

export default memo(FormFieldControl)
