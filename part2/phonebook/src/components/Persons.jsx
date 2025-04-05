const Persons = ({persons, filterStr}) => {
    const normFilter = filterStr.toLowerCase().trim();

    

    const fpersons = Array.isArray(persons) ? (normFilter.length === 0 ? persons : persons.filter((person)=>
        person.name.toLowerCase().includes(normFilter)
    )): [];

    return (
        <>
        {fpersons.map((person) => (
            <p key={person.id}>{person.name} {person.number}</p>
        ))}
        </>
    )

}

export default Persons;