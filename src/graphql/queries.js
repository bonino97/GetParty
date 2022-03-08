export const ME_QUERY = `
  query MyProfile {
    me {
      _id
      name
      email
      picture
      authBy
      role
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
      category
      startDate
      endDate

      location {
        address
        city
        state
        zipCode
        country
      }

      availableTickets
      priceOfTicket
      takeFees

      isPeriodic
      isPrivate
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

export const GET_PIN_BY_SLUG_QUERY = `
  query GetPinBySlug($slug: String) {
    getPinBySlug(input: {
      slug: $slug
    }) {
      _id
      createdAt
      title
      content
      phone
      image
      category
      startDate
      endDate

      location {
        address
        city
        state
        zipCode
        country
      }

      availableTickets
      priceOfTicket
      takeFees

      isPeriodic
      isPrivate
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
