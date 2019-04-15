const fs = require('fs')
const { fetchEpisodes, fetchEpisodeDetails } = require('./fetchEpisodes')

const go = async () => {
  const episodes = await fetchEpisodes()
  const episodeDetails = await fetchEpisodeDetails(episodes)
  fs.writeFileSync('episodeData.js', JSON.stringify(episodeDetails, null, 2))
}

go()
