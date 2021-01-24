import {updateArrays} from './index.js';

let listElements = document.querySelectorAll('.tasks.uncompleted')
let actualElement

const noTasks = document.querySelector('#noTasks')
const addButton = document.querySelector('#addTask')
addButton.addEventListener('click', dragActive)

function dragActive() { // When the user press the add button, actualize the array with elements
    listElements = document.querySelectorAll('.tasks.uncompleted')
    listElements.forEach(element => addEventsDragsAndDrops(element))

}   

function dragStart(e) { // When start the drag event
    listElements = document.querySelectorAll('.tasks')
    actualElement = this

    actualElement.style.opacity = "0.4"
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', this.innerHTML)

}

function dragEnter() { // When enter in any element in drag event
    this.classList.add('selected')

}

function dragging() { // When the user move element in drag event
    noTasks.hidden = false
    noTasks.style.display = "flex"
    noTasks.innerHTML = "Mova até onde deseja trocar"

}

function dragLeave(e) { // When leave the selected element in drag event
    e.stopPropagation()
    this.classList.remove('selected')

}

function dragOver(e) { // When stay over any element in the drag event
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    this.classList.add('selected')

    return false
}

function dragDrop(e) { // When drop the element in the drag event
    if ( actualElement != this ) {
        actualElement.innerHTML = this.innerHTML
        this.innerHTML = e.dataTransfer.getData('text/html')

    }

    listElements.forEach(element => element.style.opacity = '1')
    updateArrays()

    return false
}

function dragEnd() { // When end the drag event
    const listElements = document.querySelectorAll('.tasks.uncompleted')
    
    listElements.forEach(element => {
        element.style.opacity = "1"

    })

    updateArrays()
}

const addEventsDragsAndDrops = element => { // Adding events in elements
    element.addEventListener('dragstart', dragStart)
    element.addEventListener('dragenter', dragEnter)
    element.addEventListener('dragover', dragOver)
    element.addEventListener('dragleave', dragLeave)
    element.addEventListener('drop', dragDrop)
    element.addEventListener('dragend', dragEnd)
    element.addEventListener('drag', dragging)

}

setInterval(dragActive, 1000)
