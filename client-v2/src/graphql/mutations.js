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
      longitude: $longitude
      
    }) {
      _id
      createdAt
      title 
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
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
