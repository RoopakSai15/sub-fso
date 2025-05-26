const CountryFilter = ({filterStr, handleFilter}) => {
    return (
        <div>
            find Countries: <input value={filterStr} onChange={handleFilter}/>
        </div>
    )
}

export default CountryFilter;