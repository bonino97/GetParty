export const CREATE_PIN_MUTATION = `
  mutation CreatePin (
    $title: String!, 
    $content: String!, 
    $image: String,
    $category: String,
    $startDate: Date,
    $endDate: Date,

    $phone: String,
    $location: LocationInput,

    $availableTickets: Int,
    $priceOfTicket: Int,
    $takeFees: Boolean,

    $isPeriodic: Boolean,
    $isPrivate: Boolean,

    $entryRequirements: String,
    $tags: [String],
    $instagram: String,
    $twitter: String,
    $facebook: String,

    $latitude: Float,
    $longitude: Float,

    $tickets: [TicketsInput]
    ) {
    createPin(input: {
      title: $title,
      image: $image,
      content: $content,
      category: $category,
      startDate: $startDate,
      endDate: $endDate,
      
      phone: $phone,
      location: $location,

      availableTickets: $availableTickets,
      priceOfTicket: $priceOfTicket,
      takeFees: $takeFees,
      
      isPeriodic: $isPeriodic,
      isPrivate: $isPrivate,
      entryRequirements: $entryRequirements,
      
      tags: $tags,
      instagram: $instagram,
      twitter: $twitter,
      facebook: $facebook,

      latitude: $latitude,
      longitude: $longitude,

      tickets: $tickets
      
    }) {
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

      tickets {
        ticketId
        quantity
        price
        title
        description
        createdAt
      }
    }
  }
`;

export const DELETE_PIN_MUTATION = `
  mutation DeletePin ($pinId: ID!) {
    deletePin(pinId: $pinId) {
      _id
    }
  }
`;

export const CREATE_COMMENT_MUTATION = `
  mutation CreateComment ($pinId: ID!, $text: String!) {
    createComment(pinId: $pinId, text: $text) {
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

export const REGISTER_MUTATION = `
  mutation Register (
    $email: String
    $password: String
    $name: String
    $termsAndConditions: Boolean
    ) {
    register(input: {
      email: $email
      password: $password
      name: $name
      termsAndConditions: $termsAndConditions
    }) {
      _id
    }
  }
`;

export const CONFIRM_ACCOUNT_MUTATION = `
mutation ConfirmAccount (
  $token: String
  ) {
  confirmAccount(input: {
    token: $token
  }) {
    _id
  }
}
`;

export const LOGIN_MUTATION = `
  mutation Login (
    $email: String
    $password: String
    ) {
    login(input: {
      email: $email
      password: $password
    }) {
      name
      email
      picture
      role
      jwt
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = `
  mutation ForgotPassword (
    $email: String
    ) {
    forgotPassword(input: {
      email: $email
    }) {
      name
      email
    }
  }
`;

export const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword (
    $password: String
    $token: String
    ) {
    resetPassword(input: {
      password: $password
      token: $token
    }) {
      name
      email
    }
  }
`;
