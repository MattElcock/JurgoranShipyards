import { gql } from '@apollo/client'
import { omit } from 'lodash'
import { useEffect, useState } from 'react'
import { client } from '../../apollo-client'

type StarshipReturn = {
  id: string
  attributes: Starship
}

type Image = {
  url: string
  alternativeText: string
}

type ImageData = {
  data: ImageReturn
}

type ImageReturn = {
  id: string
  attributes: Image
}

type Starship = {
  name: string
  type: string
  subtype: string
  cost: number
  image: ImageData
}

export interface StarshipState extends Starship {
  id: string
}

const useListStarships = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<StarshipState[]>()
  const apiClient = client

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      const response = await apiClient.query({
        query: gql`
          query Starships {
            starships {
              data {
                id
                attributes {
                  name
                  type
                  subtype
                  cost
                  image {
                    data {
                      attributes {
                        url
                        alternativeText
                      }
                    }
                  }
                }
              }
            }
          }
        `,
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
  }, [apiClient])

  return { isLoading, data }
}

export { useListStarships }
