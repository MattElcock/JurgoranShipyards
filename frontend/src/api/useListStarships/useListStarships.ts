import { gql } from '@apollo/client'
import { omit } from 'lodash'
import { useEffect, useState } from 'react'
import { client } from '../../apollo-client'

type StarshipReturn = {
  id: string
  attributes: Starship
}

type Starship = {
  name: string
  type: string
  subtype: string
  cost: number
  requisition: boolean
  imageUrl: string
  imageAlt: string
}

export interface StarshipState extends Starship {
  id: string
}

const useListStarships = (type: string, subtype: string, sort: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<StarshipState[]>()
  const apiClient = client

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      const response = await apiClient.query({
        query: gql`
          query Starships($filters: StarshipFiltersInput, $sort: [String]) {
            starships(filters: $filters, sort: $sort) {
              data {
                id
                attributes {
                  name
                  type
                  subtype
                  cost
                  imageUrl
                  imageAlt
                  requisition
                }
              }
            }
          }
        `,
        variables: {
          filters: {
            ...(type && {
              type: {
                eq: type,
              },
            }),
            ...(subtype && {
              subtype: {
                eq: subtype,
              },
            }),
          },
          sort: [`cost:${sort}`],
        },
      })

      setData(
        response.data.starships.data.map(({ id, attributes }: StarshipReturn) =>
          omit(
            {
              ...attributes,
              id,
            },
            '__typename'
          )
        )
      )
      setIsLoading(false)
    }

    fetchData()
  }, [apiClient, type, subtype, sort])

  return { isLoading, data }
}

export { useListStarships }
