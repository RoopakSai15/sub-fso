import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";
import Notification from "./components/Notification";

function App() {
  const [filterStr, setFilterStr] = useState("");
  const [allPersons, setAllPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({name:'',number:''})
  const [notification, setNotification] = useState()


  const addPerson = (event) => {
    event.preventDefault();
    
    const result = allPersons.find((person) => person.name === newPerson.name)

    if (!result){
      personService
        .create(newPerson)
        .then((person) => {
          setAllPersons(allPersons.concat(person))
          setNewPerson({name:'', number:''})
          setNotification({
            type: 'success',
            text: `${newPerson.name} has been added to the Phonebook`,
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000);
        })
    }else{
      if(window.confirm(`This ${newPerson.name} already exists in the Phonebook. replace the old number with a new one?`)){
        personService
          .update(result.id, newPerson)
          .then((updatedPerson) => {
            setAllPersons((prevPersons) => 
              prevPersons.map((person) => 
                person.id !== updatedPerson.id ? person : updatedPerson
              )
            )
            setNewPerson({name:'', number:''})
            setNotification({
              type: "success",
              text: `${newPerson.name} was successfully updated`,
            });
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              setAllPersons((prevPersons) => {
                prevPersons.filter((person) => person.id !== result.id)
              })
              setNotification({
                type: "error",
                text: `Information of ${newPerson.name} has already been removed from the server`,
              })
            } else {
              setNotification({
                type: "error",
                text: error.response?.data?.error || "unknown error",
              })
            } 
          })
      } 
    }

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

  const removeNumber = (id, name) => {
    if (window.confirm(`Delete ${name}'s number?`)){
      personService
        .remove(id).then(() => {
          setAllPersons((allPersons) => 
            allPersons.filter((person) => person.id !== id)
          )
          setNotification({
            type: 'error',
            text: `${name}'s details successfully deleted.`
          })
        })
    }
  }

  useEffect(()=>{
    personService.getAll().then(
      initialNumbers => {
        setAllPersons(initialNumbers)
      }
    )

  },[])

  useEffect(() => {
    if(notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 4000);

      return () => {
        clearTimeout(timer);
      }
    }

  }, [notification])

  return (
    <>
    <h2>Phonebook</h2>
    <Notification notification={notification}/>
    <Filter filterStr={filterStr} onFilterChange={onFilterChange}/>
    <h3>Add a new</h3>
    <PersonForm newPerson={newPerson} onFormChange={onFormChange} addPerson={addPerson} />
    <h3>Numbers</h3>
    <Persons persons={allPersons} filterStr={filterStr} removeNumber={removeNumber}/>
    </>
  )
}

export default App;
