const axios = require('axios')
const cheerio = require('cheerio')
const uuidv4 = require('uuid/v4')

const fetchEpisodes = async () => {
  const { data: html } = await axios.get('https://syntax.fm/')
  const $ = cheerio.load(html)
  const episodesInfo = $('div.show', 'body').map((i, elem) => {
    const episodeNumber = $('a', elem)
      .text()
      .substring(8, 11)
    const episodeTitle = $('a', elem)
      .text()
      .substring(11)
    const episodeUrl = `https://syntax.fm${$('a', elem).attr('href')}`
    return {
      id: uuidv4(),
      title: episodeTitle,
      number: episodeNumber,
      url: episodeUrl
    }
  })
  return episodesInfo.get()
}

const fetchEpisodeDetails = async episodes => {
  const addtlEpisodeData = episodes.map(episode => {
    if (episode.url.includes('undefined')) {
      return episode
    }

    return axios
      .get(episode.url)
      .then(res => res.data)
      .then(html => {
        const $ = cheerio.load(html)
        const releaseDate = $('p.show__date').text()
        const mp3 = $('a.button[download]').attr('href')
        episode.releaseDate = releaseDate
        episode.mp3 = mp3
        return episode
      })
  })
  return await Promise.all(addtlEpisodeData)
}

module.exports.fetchEpisodes = fetchEpisodes
module.exports.fetchEpisodeDetails = fetchEpisodeDetails
