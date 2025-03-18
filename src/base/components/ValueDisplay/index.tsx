import React from 'react'

type Props = {
    value: string | number | boolean | null | undefined,
    formatFunction?: ((text: any) => string)[],
    defaultValue?: number | string,
    suffixes?: string,
    suffixesWhenDefault?: boolean,
    prefixes?: string
    prefixesWhenDefault?: boolean,
}

/**
 * @param value : string | number | boolean | null | undefined
 * @param formatFunction : array callback function ((text:any)=>string)
 * @param defaultValue : value will show when empty data
 * @param suffixes : suffixes in right side text
 * @param prefixes : suffixes in left side text
 * @param suffixesWhenDefault : trigger suffixes in left side default value
 * @param prefixesWhenDefault : trigger suffixes in right side default value
 * @returns value | '-'
 *  description : this component will return default dash "-"
 */

const ValueDisplay = (
    {
        value,
        formatFunction,
        suffixes,
        defaultValue = '-',
        suffixesWhenDefault,
        prefixes,
        prefixesWhenDefault
    }: Props) => {

    // const staticFormatFunction =[
    //     (value : any)=> typeof value === 'string' ? value.replace('[+]',' - ') : value 
    // ]

    // value : undefined | null
    if (value === null || value === undefined) {
        return <>
            {prefixesWhenDefault && prefixes}
            {defaultValue}
            {suffixesWhenDefault && suffixes}
        </>
    }

    //  middleware format
    const constHandleFormat = () => {
        let formatValue = value

        // static format
        // for (let callback of staticFormatFunction) {
        //     formatValue = callback(formatValue)
        // }

        // cust format
        if (!formatFunction) return formatValue
        for (let callback of formatFunction) {
            formatValue = callback(formatValue)
        }
        return formatValue
    }

    return (
        <>
            {prefixes}
            {constHandleFormat()}
            {suffixes}
        </>
    )
}

export default ValueDisplay