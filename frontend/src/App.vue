<script setup>
import { ref, onMounted } from 'vue'

const currentInput = ref('')
const todoList = ref([])
const state_in_process = ref(false);
const state_completed = ref(false);

onMounted(() => {
  getTodoList()
})

const getTodoList = async () => {
  const response = await fetch('http://localhost:3000/entries')
  todoList.value = await response.json()
}

const createNewTodo = async () => {
  if (currentInput.value.length === 0) {
    return
  }

  await fetch('http://localhost:3000/entries', {
    method: 'POST',
    body: JSON.stringify({ text: currentInput.value }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  getTodoList()
}

const deleteAllTodo = async () => {
  await fetch('http://localhost:3000/deleteAll', {
    method: 'DELETE'
  })

  getTodoList()
}

const onDeleteHandler = async (id) => {
  await fetch('http://localhost:3000/deleteId', {
    method: 'DELETE',
    body: JSON.stringify({ id: id }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  getTodoList()
}

const onProcessHandler = async (id, state_in_process) => {
  await fetch('http://localhost:3000/updateId', {
    method: 'PUT',
    body: JSON.stringify({id: id, state_in_process: state_in_process}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  getTodoList()
}

const onProcessFilter = () => {
  state_in_process.value = !state_in_process.value;
  state_completed.value = false;
}

const onCompletedFilter = () => {
  state_completed.value = !state_completed.value;
  state_in_process.value = false;
}

</script>

<template>
  <div class="wrapper">
    <div class="wrapper__block">
      <h1>TODO dev.</h1>
      <div class="wrapper__main-block">
        <form>
          <input
            v-model="currentInput"
            class="wrapper__main-block_input"
            type="text"
            placeholder="Type your text."
          />
          <button @click.prevent="createNewTodo" class="wrapper__main-block_button">Add</button>
        </form>
      </div>
      <div class="wrapper__list">
        <div class="wrapper__list-top">
          <h1>List:</h1>
          <ul class="wrapper__list-top_filter">
            <li @click="onCompletedFilter">Completed</li>
            <li @click="onProcessFilter">In process</li>
            <li @click="deleteAllTodo">Delete all</li>
          </ul>
        </div>
        <ul>
          <li class="wrapper__list-item" v-for="todo in todoList" :key="todo.id">
            {{ todo.todo_text }}
            <div class="wrapper__list-buttons">
              <button @click="() => onDeleteHandler(todo.id)">Delete</button>
              <button @click="() => onProcessHandler(todo.id, todo.is_completed)">
                {{ todo.is_completed ? 'Completed' : 'Complete' }}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper__list-buttons {
  display: flex;
  gap: 15px;
}

.wrapper__list-buttons button {
  border: 1px solid rgb(138, 170, 231);
  background-color: inherit;
  padding: 5px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.wrapper__list-item {
  display: flex;
  width: 400px;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 20px;
}

.wrapper__list-top {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 60px;
}

.wrapper__list-top_filter {
  display: flex;
  gap: 20px;
}

.wrapper__list-top_filter li {
  padding: 5px;
  border: solid 1px rgb(138, 170, 231);
  cursor: pointer;
  border-radius: 6px;
}

.wrapper__main-block_button {
  outline: none;
  border: 1px solid rgb(138, 170, 231);
  background-color: inherit;
  padding: 8px 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.wrapper__main-block_button:hover {
  color: white;
  background-color: rgb(138, 170, 231);
}

.wrapper__main-block_input {
  padding: 15px;
  outline: none;
  border: solid 1px rgb(138, 170, 231);
  border-radius: 4px;
}

.wrapper {
  background-color: rgb(138, 170, 231);
  height: 100svh;
  padding-top: 120px;
}

.wrapper__main-block_input::placeholder {
  font-size: 16px;
}

.wrapper__main-block_input {
  font-size: 16px;
}

.wrapper__block {
  width: 60%;
  margin: 0 auto;
  height: 100%;
  padding: 45px;
  background-color: white;
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.wrapper__main-block {
  display: flex;
  justify-content: center;
  font-size: 18px;
}

.wrapper__main-block form {
  display: flex;
  gap: 50px;
}
</style>
