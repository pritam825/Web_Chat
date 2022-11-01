const generateMessages = (username , text , id) =>{
    return {
        text ,
        username,
        id,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessages = (username ,id , url) =>{
    return {
        username,
        id,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessages,
    generateLocationMessages
}