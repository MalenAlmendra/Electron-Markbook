//DOM Elements

const { app } = require("electron");

const linksSection=document.querySelector('.links'),
    errorMessage=document.querySelector('.error-message'),
    newLinkForm=document.querySelector('.new-link-form'),
    newLinkURL=document.querySelector('.new-link-url'),
    newLinkButton=document.querySelector('.new-link-button'),
    clearStorage=document.querySelector('.clear-storage')


    //DOM API's
    const {shell}=require('electron')

    const parser=new DOMParser();

    const parserResponse=(text)=>{
       return parser.parseFromString(text, 'text/html')
    }

    const findTitle=(nodes)=>{
        return nodes.querySelector('title').innerText;
    }

    const storeLink=(title, URL)=>{
        localStorage.setItem(URL,JSON.stringify({title,URL}))
    }

    const getLinks=()=>{
        return Object.keys(localStorage)
        .map(key =>JSON.parse(localStorage.getItem(key)))
    }
    
    const createLinkElement=(link)=>{
        return `
        <div>
            <h3>${link.title}</h3>
            <p><a href="${link.URL}">${link.URL}</a></p>
        </div>
        `
    }

    const renderLinks=()=>{
       const linksElements = getLinks().map(createLinkElement).join('')
       linksSection.innerHTML=linksElements
    }


    //Events
    renderLinks()

    const handleError=(error,url)=>{
        errorMessage.innerHTML=`
            There was an Issue adding "${url}" : ${error.message}
        `.trim();
        setTimeout(()=>{
            errorMessage.innerHTML=null
        },5000)
    }

    newLinkURL.addEventListener('keyup',(e)=>{
        
        newLinkButton.disabled=!newLinkURL.validity.valid
    })

    newLinkForm.addEventListener('submit',async (e)=>{
        e.preventDefault()
        console.log(newLinkURL.value)
        const url=newLinkURL.value

        try{
            const response= await fetch(url)
            const text=await response.text()
            const html= parserResponse(text)
            const title=findTitle(html)
            storeLink(title,url)
            renderLinks()
            newLinkForm.reset()
        } catch(e) {
            handleError(e,url)
        }
        
    })

    clearStorage.addEventListener('click',()=>{
        localStorage.clear()
        linksSection.innerHTML=''
    })

    linksSection.addEventListener('click',(e)=>{
        e.preventDefault()
        if(e.target.href){
            console.log(e.target.href)
            shell.openExternal(e.target.href)
        }
    })