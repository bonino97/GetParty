export const ME_QUERY = `
  query MyProfile {
    me {
      _id
      name
      email
      picture
    }
  }
`;

export const GET_PINS_QUERY = `
  query GetPins {
    getPins {
      _id
      createdAt
      title
      content
      phone
      image
      partyType
      startDate
      endDate

      location {
        street
        city
        state
        zipCode
        country
      }

      availableTickets
      priceOfTicket
      takeFees

      periodicParty
      publicParty
      entryRequirements
      tags
      instagram
      twitter
      facebook

      slug

      latitude
      longitude

      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
`;
