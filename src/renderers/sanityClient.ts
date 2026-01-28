const SANITY_PROJECT_ID = 'p7jx21nd'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2023-08-01'

export const buildSanityUrl = (query: string) => {
  const encoded = encodeURIComponent(query)
  return `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encoded}`
}
