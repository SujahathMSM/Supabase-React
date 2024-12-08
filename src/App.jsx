/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./App.css";
import supabase from "./supabase-client";
import { useEffect } from "react";

const App = () => {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("todolist").select("*");

    if (error) {
      console.log("An error while fetching data: " + JSON.stringify(error));
    } else {
      console.log(data);
      setTodoList(data);
    }
  };

  const addTodo = async () => {
    const newTodoData = {
      task: newTodo,
      isCompleted: false,
    };
    const { data, error } = await supabase
      .from("todolist")
      .insert([newTodoData])
      .select()
      .single();
    if (error) {
      console.log(
        "An Error occurred while adding data: " + JSON.stringify(error)
      );
    } else {
      setTodoList((list) => [...list, data]);
      setNewTodo("");
    }
  };

  const completeTask = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("todolist")
      .update({ isCompleted: !isCompleted })
      .eq("id", id)
      .select();
    if (error) {
      console.log("An error while updating: " + JSON.stringify(error));
    } else {
      const updatedTodo = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(updatedTodo);
    }
  };

  const deleteTask = async (id) => {
    const { data, error } = await supabase
      .from("todolist")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.log("An error while deleting: " + JSON.stringify(error));
    } else {
      console.log(data);
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div>
      <h3>Supabase with REACT - a simple CRUD operation</h3>
      <h2>TODO LIST</h2>
      <div>
        <input
          className="inputText"
          type="text"
          value={newTodo}
          placeholder="Todo"
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="myButton" onClick={addTodo}>
          Add todo item
        </button>
      </div>
      <ul>
        {todoList.map((todo) => (
          <li key={todo.id}>
            <p>{todo.task}</p>
            <button
              className="myButton"
              onClick={() => completeTask(todo.id, todo.isCompleted)}
            >
              {todo.isCompleted ? "Undo" : "Complete Task"}
            </button>
            <button className="myButton" onClick={() => deleteTask(todo.id)}>
              Delete Task
            </button>
          </li>
        ))}
      </ul>
      <footer className="footer">Developed by: Sujahath MSM</footer>
    </div>
  );
};

export default App;
