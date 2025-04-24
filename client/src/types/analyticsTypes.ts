interface DataSchema{
    date: string,
    pending: number,
    serving: number,
    success: number
}

interface ResponseAnalytics{
    dataAnalytics: DataSchema[]
    status:string,
    error: string,
}
export type {DataSchema, ResponseAnalytics}