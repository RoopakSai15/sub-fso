const PersonForm = ({newPerson, onFormChange, addPerson}) => {

    return (
        <>
            <form onSubmit={addPerson}>
                <div>
                    name: <input name="name" value={newPerson.name} onChange={onFormChange} />
                    <br/>
                    number: <input name="number" value={newPerson.number} onChange={onFormChange} />
                </div>
                <div>
                    <button type="submit">Add</button>
                </div>
            </form>
        </>
    )
}

export default PersonForm;