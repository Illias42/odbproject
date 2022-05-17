export const articleSchema = {

}

export const myArticlesSchema = {

}

export const createArticleSchema = {
    body: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
            title: {type: 'string'},
            content: {type: 'string'}
        }
    },
    response: {
        201: {
            message: {type: 'string'}
        }
    }
}