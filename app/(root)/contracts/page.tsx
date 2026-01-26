import React from 'react'
import ContractsList from './ContractsList'

const page = () => {
  return (
    <section>
      <ContractsList data={[]} isLoading={false} />
    </section>
  )
}

export default page
