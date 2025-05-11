// third party
import {
    format as FnsFormat,
    addMinutes as FnsAddMinutes,
    parseISO as FnsParseISO,
    fromUnixTime as FnsFromUnixTime
} from "date-fns"

export const formatTime = time => FnsFormat(new Date(`${new Date().getFullYear()}-01-01 ${time}`), 'HH:mm')

export const formatDateTimeFromUnix = unixTime => FnsFormat(FnsFromUnixTime(unixTime), 'dd.MM yyy')
export const formatDateTime = date => FnsFormat(date, 'dd.MM yyy HH:mm')
export const formatDate = date => FnsFormat(date, 'dd.MM yyy')
export const formatDateFromDB = date => formatDate(FnsParseISO(date))
export const formatDateTimeFromDB = date => formatDateTime(FnsParseISO(date))

export const formatDateForDB = date => FnsFormat(date, 'yyyy-MM-dd')

export const addMinutesToDate = (date, minutes) => FnsAddMinutes(date, minutes)
export const addDaysToDate = (date, days) => {
    date.setDate(date.getDate() + days)
    return date
}