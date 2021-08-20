export const CREATE_PIN_MUTATION = `
    mutation CreatePin($createPinInput: CreatePinInput) {
        createPin(input: $createPinInput){
            _id
            title
            content
            image
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
