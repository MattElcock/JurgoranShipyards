import {
  Button,
  Heading,
  List,
  ListItem,
  Stack,
  Icon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Radio,
  RadioGroup,
  Select,
  Box,
} from '@chakra-ui/react'
import { ShopItem } from 'components/ShopItem'
import { useListStarships } from 'api/useListStarships'
import { StarshipState } from 'api/useListStarships/useListStarships'
import { useShoppingCart } from 'providers/ShoppingCartProvider'
import { MdFilterList } from 'react-icons/md'
import { useState } from 'react'
import { camelCase } from 'lodash'
import Head from 'next/head'

const Shop = () => {
  const [typeFilter, setTypeFilter] = useState('')
  const [subtypeFilter, setSubtypeFilter] = useState('')
  const [sort, setSort] = useState('asc')
  const { data } = useListStarships(typeFilter, subtypeFilter, sort)
  const { shoppingCart, updateShoppingCart } = useShoppingCart()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const addToCartHandler = (starship: StarshipState) => {
    updateShoppingCart([
      ...shoppingCart,
      {
        name: starship.name,
        cost: starship.cost,
        id: starship.id,
        requesition: starship.requisition,
      },
    ])
  }

  const handleFiltersClick = () => {
    onOpen()
  }

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type)
    setSubtypeFilter('')
  }

  const handleSubtypeFilter = (subtype: string) => {
    setSubtypeFilter(subtype)
  }

  const handleShowOptions = () => {
    onClose()
  }

  const handleSortChange = (sort: string) => {
    setSort(sort)
  }

  return (
    <>
      <Head>
        <title>Starships | Jurgoran Shipyard</title>
      </Head>
      <Stack spacing={5}>
        <Heading as="h1">All Starships</Heading>
        <Box display="flex">
          <Button
            borderColor="gray.700"
            rightIcon={<Icon as={MdFilterList} w={5} h={5} />}
            width="50%"
            justifyContent="space-between"
            variant="outline"
            fontWeight="normal"
            borderRightRadius={0}
            onClick={() => handleFiltersClick()}
          >
            Filters
          </Button>
          <Select
            width="50%"
            borderLeft="0"
            borderLeftRadius={0}
            borderColor="gray.700"
            value={sort}
            onChange={(sort) => handleSortChange(sort.target.value)}
          >
            <option value="asc">Price: low - high</option>
            <option value="desc">Price: high - low</option>
          </Select>
        </Box>
        <List spacing={5}>
          {data?.map((starship) => (
            <ListItem key={starship.id}>
              <ShopItem
                id={starship.id}
                title={starship.name}
                tags={[starship.type, starship.subtype]}
                cost={starship.cost}
                imageUrl={starship.imageUrl}
                imageAltText={starship.imageAlt}
                requesition={starship.requisition}
                addToCartHandler={() => addToCartHandler(starship)}
                readMoreLink={''}
              />
            </ListItem>
          ))}
        </List>
      </Stack>
      <Drawer onClose={onClose} isOpen={isOpen} size="full">
        <DrawerOverlay />
        <DrawerContent
          data-theme="dark"
          bg="chakra-body-bg"
          color="chakra-body-text"
        >
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            <Stack spacing={5}>
              <Stack spacing={3}>
                <Heading size="sm">Type</Heading>
                <RadioGroup
                  defaultValue=""
                  value={typeFilter}
                  onChange={(type) => handleTypeFilterChange(type)}
                >
                  <Stack>
                    <Radio value="">All</Radio>
                    <Radio value="dreadnought">Dreadnoughts</Radio>
                    <Radio value="destroyer">Destroyers</Radio>
                    <Radio value="support">Support</Radio>
                    <Radio value="starfighter">Starfighters</Radio>
                  </Stack>
                </RadioGroup>
              </Stack>

              <Stack spacing={3}>
                <Heading size="sm">Subtype</Heading>
                <RadioGroup
                  defaultValue=""
                  value={subtypeFilter}
                  onChange={(subtype) => handleSubtypeFilter(subtype)}
                >
                  <Stack>
                    <Radio value="">All</Radio>
                    {typeFilter === 'support' &&
                      ['Transport', 'Strategic'].map((subtype) => (
                        <Radio key={subtype} value={camelCase(subtype)}>
                          {subtype}
                        </Radio>
                      ))}
                    {typeFilter === 'starfighter' &&
                      [
                        'Bomber',
                        'Gunship',
                        'Scout',
                        'Strike Fighter',
                        'Interceptor',
                      ].map((subtype) => (
                        <Radio key={subtype} value={camelCase(subtype)}>
                          {subtype}
                        </Radio>
                      ))}
                  </Stack>
                </RadioGroup>
              </Stack>
              <Button
                width="full"
                colorScheme="orange"
                onClick={() => handleShowOptions()}
              >
                Show {(data || []).length} result
                {((data || []).length > 1 || (data || []).length === 0) && 's'}
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Shop
