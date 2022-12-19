import { Box, Heading } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const DynamicCartSummary = dynamic(
  () =>
    import('../../../containers/CartSummary').then(
      (component) => component.CartSummary
    ),
  {
    ssr: false,
  }
)

const Cart = () => {
  return (
    <>
      <Head>
        <title>Shopping Cart | Jurgoran Shipyard</title>
      </Head>
      <Box>
        <Heading as="h1" mb={2}>
          Your Shopping Cart
        </Heading>
        <DynamicCartSummary />
      </Box>
    </>
  )
}

export default Cart
