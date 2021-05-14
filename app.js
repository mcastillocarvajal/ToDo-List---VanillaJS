const form = document.getElementById('form')
const input = document.getElementById('input')
const taskList = document.getElementById('task-list')
const template = document.getElementById('template').content
const fragment = document.createDocumentFragment()
let tasks = {}

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }
    renderTasks()
})

form.addEventListener("submit", e => {
    e.preventDefault()
    setTask(e)
})

taskList.addEventListener('click', e => {
    btnAction(e)
})


const setTask = e => {
    if (input.value.trim() === ''){
        console.log('empty')
        return
    }
    const task = {
        id: Date.now(),
        text: input.value,
        done: false
    }

    tasks[task.id] = task
    // console.log(tasks)

    form.reset()
    input.focus()

    renderTasks()
}

const renderTasks = () => {

    localStorage.setItem('tasks', JSON.stringify(tasks))

    if(Object.values(tasks).length === 0) {
        taskList.innerHTML = `
            <div class="alert alert-dark text-center">No pending tasks 👌</div>
        `
        return
    }

    taskList.innerHTML = ''
    Object.values(tasks).forEach(task => {
        const clone = template.cloneNode(true)
        clone.querySelector('p').textContent = task.text

        if(task.done) {
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        clone.querySelectorAll('.fas')[0].dataset.id = task.id
        clone.querySelectorAll('.fas')[1].dataset.id = task.id
        fragment.appendChild(clone)
    })
    taskList.appendChild(fragment)
} 

const btnAction = e => {
    if (e.target.classList.contains('fa-check-circle')) {
        tasks[e.target.dataset.id].done = true
        renderTasks()
    }

    if (e.target.classList.contains('fa-minus-circle')) {
        delete tasks[e.target.dataset.id]
        renderTasks()
    }

    if (e.target.classList.contains('fa-undo-alt')) {
        tasks[e.target.dataset.id].done = false
        renderTasks()
    }
    e.stopPropagation()
}