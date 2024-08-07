import ky from 'ky';

const kyInstance = ky.create({
    parseJson: (text: string) => JSON.parse(
        text, (key, value) => key.endsWith('At') ? new Date(value) : value
    )
})

export default kyInstance;