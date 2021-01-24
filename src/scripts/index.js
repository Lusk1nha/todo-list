export {updateArrays}

const taskInput = document.querySelector('#taskInput')
const inputReset = document.querySelector("#inputReset")
const noTasks = document.querySelector('#noTasks')

const allTasks = { uncompletedTasks: [], completedTasks: [] }
const maxTasks = 15

const allPhrases = {
    infoPhrases: {
        "maxLimit": `Você atingiu o limite de ${maxTasks} tarefas`,
        "defaultLimit": `Você pode colocar até ${maxTasks} tarefas`,
        "emptyTasks": "Nem uma tarefa foi adicionada ainda"
    },

    errorsPhrases: {
        "maxLetter": "Sua tarefa está muito longa tente diminui-lá",
        "emptyValue": "Você deve escrever algo em sua tarefa"
    }
}


// * Check if the total of tasks
const emptyTasks = () => {
    const totalTasks = allTasks.completedTasks.length + allTasks.uncompletedTasks.length
    
    // ! if is above than 4 create a alert element with this information
    if ( totalTasks == maxTasks ) {
        noTasks.innerHTML = allPhrases.infoPhrases.maxLimit

    // ! if no have any tasks, create a alert with this information
    } else if ( totalTasks === 0 ) {
        noTasks.innerHTML = allPhrases.infoPhrases.emptyTasks

    // ! else remove all alerts
    } else {
        noTasks.innerHTML = allPhrases.infoPhrases.defaultLimit

    }
}
emptyTasks()


// * Clean the input value
const cleanValue = () => {
    return taskInput.value = ""
}


// * Send the input value
const taskContainer = () => {
    // ! if the input have only spaces without any other character, stop the function 
    let index = 0
    for ( const letter of taskInput.value.split('')) {
        const justSpaces = letter !== " " ? "no" : index++
        
        if ( justSpaces == "no" ) {
            break

        } else if ( index == taskInput.value.length ) {
            inputReset.classList.add('error')
            return effectErrors(taskInput, 2000, 'emptyValue')
            
        }
    }
    
    // ! if the user have more than maxTasks tasks the user can't add anymore task
    if ( (allTasks.uncompletedTasks.length + allTasks.completedTasks.length) >= maxTasks ) {
        return effectErrors(noTasks, 2000, 'maxLimit')
        
    }
    
    // ! if the length of characters is above then 55 letters, no execute the function
    else if ( taskInput.value.length >= 55 ) {
        inputReset.classList.add('error')
        return effectErrors(taskInput, 1500, 'maxLetter')

    } 
    
    // ! if the input answer is empty, the user can't set a task
    else if ( taskInput.value.length < 1 ) {
        inputReset.classList.add('error')
        return effectErrors(taskInput, 1500, 'emptyValue')
    }

    return createTask(taskInput.value)
}

// * Create the elements
const createTask = inputValue => {
    const uncompletedContainer = document.querySelector("#uncompleted")

    // ? Creating the div class="taskContainer"
    const taskContainer = document.createElement('div')
    taskContainer.className = "tasks"
    taskContainer.classList.add('uncompleted')
    uncompletedContainer.appendChild(taskContainer)

    // ? Creating the span class="drag"
    const dragElement = document.createElement('span')
    dragElement.className = "drag"
    taskContainer.appendChild(dragElement)

    const imageContainer = new Image();
    imageContainer.src = "../assets/drag_icon.svg"
    dragElement.appendChild(imageContainer)

    // ? Creating the div class="text"
    const textElement = document.createElement('div')
    textElement.className = "text"
    textElement.innerHTML = inputValue
    taskContainer.appendChild(textElement)
    taskInput.value = ""

    // ?? Creating the span class="done"
    const doneElement = document.createElement('span')
    doneElement.className = "done"
    doneElement.innerHTML = "✓"
    taskContainer.appendChild(doneElement)

    // ?? Creating the span class="remove"
    const removeElement = document.createElement('span')
    removeElement.className = "remove"
    taskContainer.appendChild(removeElement)

    // ??? Creating the icon trash and putting into the span class="remove"
    const iconElement = document.createElement('i')
    iconElement.className = "fa fa-trash-o"
    iconElement.style = "font-size: 22px"
    removeElement.appendChild(iconElement)

    dragElement.setAttribute('draggable', true)

    return updateArrays()
}

// * Change the task to Completed status
function completeFunction() {
    const completedContainer = document.querySelector('#completed')

    // ? Moving the div from uncompleted to completed 
    const taskContainer =  this.parentElement
    taskContainer.classList.remove('uncompleted')
    taskContainer.classList.add('completed')
    taskContainer.childNodes[0].setAttribute('draggable', false)

    completedContainer.appendChild(taskContainer)

    return updateArrays()
}

// * Delete the task
function deleteFunction() {
    const taskContainer = this.parentElement
    taskContainer.remove()

    return updateArrays()
}

// * Update the arrays with the new tasks
const updateArrays = () => {
    const tasks = document.querySelectorAll('.tasks')

    allTasks.completedTasks = document.querySelectorAll('.tasks.completed')
    allTasks.uncompletedTasks = document.querySelectorAll('.tasks.uncompleted')


    allTasks.completedTasks.forEach(element => {
        element.childNodes[0].classList.add('completed')

        // ! Clone the element to remove the event listeners 
        const elementClone = element.cloneNode(true)
        element.parentNode.replaceChild(elementClone, element)

    })

    tasks.forEach(task => task.classList.remove('selected'))

    addEventsInElements()
    return emptyTasks()
}

// * Give the class to the element to provide visual effects
const effectErrors = (element, time, whichError) => {
    if ( whichError != "maxLimit" ) {
        noTasks.innerHTML = allPhrases.errorsPhrases[whichError]

    }

    element.classList.add('error')

    const timer = setInterval(() => { // Timer to remove the error class in the element
        element.classList.remove('error')
        inputReset.classList.remove('error')
        clearInterval(timer)
        
    }, time)
}

// * Adding events in all done buttons and remove buttons
const addEventsInElements = () => {
    const addButton = document.querySelector('#addTask')

    const doneButtons = document.querySelectorAll('.done')
    const removeButtons = document.querySelectorAll('.remove')

    addButton.addEventListener('click', taskContainer)

    window.addEventListener('keydown', event => {
        if ( event.which === 13 ) {
            return taskContainer()
        }
    })
    
    inputReset.addEventListener('click', cleanValue)

    doneButtons.forEach(button => button.addEventListener("click", completeFunction))
    removeButtons.forEach(button => button.addEventListener("click", deleteFunction))

}
addEventsInElements()

