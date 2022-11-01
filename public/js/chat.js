const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const selfMessageTemplate = document.querySelector('#self-message-template').innerHTML
const friendMessageTemplate = document.querySelector('#friend-message-template').innerHTML
const selfLocationTemplate = document.querySelector('#self-location-template').innerHTML
const friendLocationTemplate = document.querySelector('#friend-location-template').innerHTML
const sidebarTemplate =  document.querySelector('#sidebar-template').innerHTML

//Options

const {username , room} = Qs.parse(location.search , {ignoreQueryPrefix: true})

const autoScroll = () => {
    const newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight
    const containerHeight = $messages.scrollHeight
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight  <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
        }
}


socket.on('msgSend' , (msg) => {
    console.log(msg)
    console.log(socket.id)
    // const html = Mustache.render(messageTemplate , {
    //     message: msg.text,
    //     username: msg.username,
    //     createdAt: moment(msg.createdAt).format('h:mm a')
    // })

    var html = {}
    

    if(socket.id === msg.id){
        html = Mustache.render(selfMessageTemplate , {
                message: msg.text,
                username: msg.username,
                createdAt: moment(msg.createdAt).format('h:mm a')
              })
    }else{
        html = Mustache.render(friendMessageTemplate , {
            message: msg.text,
            username: msg.username,
            createdAt: moment(msg.createdAt).format('h:mm a')
          })
    }

    $messages.insertAdjacentHTML('beforeend' , html)
    autoScroll()
})

socket.on('location-Message' , (message) => {
    console.log(URL)
    // const html = Mustache.render(locationTemplate , {
    //     url: message.url,
    //     username: message.username,
    //     createdAt: moment(message.createdAt).format('h:mm a')

    // })

    var html = {}

    if(socket.id === message.id){
        html = Mustache.render(selfLocationTemplate , {
                  url: message.url,
                  username: message.username,
                  createdAt: moment(message.createdAt).format('h:mm a')
              })
    }else{
        html = Mustache.render(friendLocationTemplate , {
                 url: message.url,
                 username: message.username,
                 createdAt: moment(message.createdAt).format('h:mm a')
          })
    }
    $messages.insertAdjacentHTML('beforeend' , html)
    autoScroll()
})

socket.on('roomData' , ({room , users}) => {
   const html = Mustache.render(sidebarTemplate , {
     room,
     users
   })
   document.querySelector('#sidebar').innerHTML = html

})


$messageForm.addEventListener('submit' , (e) =>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled' , 'disabled')

    const message = document.querySelector('input').value
    socket.emit('sendmessage' , message , (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
          return console.log(error)
        }
        console.log('Message Delivered')
    })
})


$sendLocationButton.addEventListener('click' , () =>{

    $sendLocationButton.setAttribute('disabled' , 'disabled')

    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude , longitude} = position.coords
        socket.emit('send-location' , {latitude , longitude} , () => {
               $sendLocationButton.removeAttribute('disabled')
               console.log('Location Shared')
        })
    })
})

socket.emit('join' , {username , room} , (error) => {
     if(error) {
        alert(error)
        location.href = '/'
     }
})