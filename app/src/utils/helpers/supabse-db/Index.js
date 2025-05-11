export const queryBuild = (...parts) => {

    let query = ``
    const partsLength = parts.length
    for (let partCounter = 0; partCounter < parts.length; partCounter++) {

        query += parts[partCounter]

        if (partCounter < partsLength - 1) {
            query += ','
        }

    }

    return query

}

export const selectCols = cols => cols.join(',')
export const CurrentTableAndForeignTables = (Current, ...tablesAndCold) => {
    // ...tablesAndCold = [{name,cols}]
    const foreignTablesQuery = tablesAndCold.map(({name,cols}) => `${name} ( ${cols} )`).join(',')
    return `${Current}, ${foreignTablesQuery}`

}
export const CurrentTableAndForeignTable = (Current,table, cols) => `${Current}, ${table} ( ${cols} )`
export const foreignTable = (table, cols) => `${table} ( ${cols} )`
export const tableName = name => `${import.meta.env.VITE_SUPABSE_DB_TABLE_NAME_PREFIX}_${import.meta.env.VITE_SUPABSE_DB_TABLE_VERSION_PREFIX}_${name}`
export const FunctionName = name => tableName(name)