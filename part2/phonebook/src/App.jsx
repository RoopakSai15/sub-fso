import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import axios from "axios";


function App() {
  const [filterStr, setFilterStr] = useState("");
  const [persons, setPersons] = useState({});
  const [newPerson, setNewPerson] = useState({name:'',number:''})


  const addPerson = (event) => {
    event.preventDefault();
    if(persons.find(({name}) => name === newPerson.name)){
      window.alert(`This ${newPerson.name} already there, gng!`);
    }else{
      const person = { ...newPerson, id: persons.length > 0 ? Math.max(...persons.map(p => p.id))+ 1: 1}
      setPersons([...persons, person]);
      setNewPerson({name:'',number:''});}
  }
  
  const onFormChange = ({target: {name, value}}) => {
    setNewPerson((newPerson) => ({
      ...newPerson,
      [name]: value,
    }));
  }

  const onFilterChange = (event) => {
    setFilterStr(event.target.value);
  }

  useEffect(()=>{
    console.log("effect")

    const eventHandler = response => {
      console.log("promise fulfilled")
      setPersons(response.data);
    }

    const promise = axios.get("http://localhost:3001/persons")
    promise.then(eventHandler)

  },[])

  return (
    <>
    <h2>Phonebook</h2>
    <Filter filterStr={filterStr} onFilterChange={onFilterChange}/>
    <h3>Add a new</h3>
    <PersonForm newPerson={newPerson} onFormChange={onFormChange} addPerson={addPerson} />
    <h3>Numbers</h3>
    <Persons persons={persons} filterStr={filterStr} />
    </>
  )
}

export default App;
