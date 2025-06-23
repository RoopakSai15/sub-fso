const Persons = ({persons, filterStr, removeNumber}) => {
    const normFilter = filterStr.toLowerCase().trim();
    const fpersons = Array.isArray(persons) ? (normFilter.length === 0 ? persons : persons.filter((person)=>
        person.name.toLowerCase().includes(normFilter)
    )): [];

    return (
        <>
        {fpersons.map((person) => (
            <p key={person.id}>{person.name} {person.number} <button onClick={() => removeNumber(person.id, person.name)}>delete</button></p>
        ))}
        </>
    )

}

export default Persons;