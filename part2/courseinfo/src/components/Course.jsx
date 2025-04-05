function Header({name}) {
    return (
        <>
        <h1>{name}</h1>
        </>
    )
}
function Parts({parts}){
    return (
        <>
        {parts.map((part) => <Part key={part.id} part={part}/>)}
        </>
    )
}
function Part({part}) {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}
function Total({parts}){
    const total = parts.reduce((sum, part) => sum + part.exercises,0)
    return (
        <h3>total of {total}
        </h3>
    )
}
function Course({course}){
    return(
        <>
        <Header name={course.name}/>
        <Parts parts={course.parts} />
        <Total parts={course.parts}/>
        </>
    )
}

export default Course;