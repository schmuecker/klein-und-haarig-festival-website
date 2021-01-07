require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const { REACT_APP_MAILCHIMP_API_TICKET } = process.env

module.exports = {
  siteMetadata: {
    title: `Klein und Haarig Festival`,
    description: `A small festival in the black forest organised by Bunte Platte e.V.`,
    author: `Bunte Platte e.V.`,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-mailchimp",
      options: {
        endpoint: REACT_APP_MAILCHIMP_API_TICKET, // string; add your MC list endpoint here; see instructions below
        timeout: 3500, // number; the amount of time, in milliseconds, that you want to allow mailchimp to respond to your request before timing out. defaults to 3500
      },
    },
  ],
}
