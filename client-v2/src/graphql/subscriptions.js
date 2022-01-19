import gql from 'graphql-tag';

export const PIN_ADDED_SUBSCRIPTION = gql`
  subscription {
    pinAdded {
      _id
      title
      content
      image
      category
      startDate
      endDate

      phone
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
      createdAt

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
          name
          picture
        }
      }
    }
  }
`;

export const PIN_UPDATED_SUBSCRIPTION = gql`
  subscription {
    pinUpdated {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        picture
        name
      }
      comments {
        text
        createdAt
        author {
          name
          picture
        }
      }
    }
  }
`;

export const PIN_DELETED_SUBSCRIPTION = gql`
  subscription {
    pinDeleted {
      _id
    }
  }
`;
