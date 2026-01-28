import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'p7jx21nd',
    dataset: 'production'
  },
  deployment: {
    appId: 'h7f202wqwkaq9tq9xmuru9w3',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
