
export const getValue = props => [parseInt(props[props.ids[0]]), parseInt(props[props.ids[1]])]

export function datetoISOString(date){
    return date.toISOString()
}