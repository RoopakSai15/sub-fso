import { useState } from "react";

const Filter = ({filterStr, onFilterChange}) => {

    return (
        <div>
            Search: <input value={filterStr} onChange={onFilterChange}/>
        </div>
    )

}

export default Filter;