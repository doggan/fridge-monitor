// TODO:

const BASE_URL = "http://localhost:3001";
// const BASE_URL = "https://hb1hugbr16.execute-api.us-east-1.amazonaws.com/release";

export const fetcher = async (url: string) => {
    const response = await fetch(BASE_URL + url,
        /*{
        headers: {
            // "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',

            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            // "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
    }*/);
    if (!response.ok) {
        throw new Error('An error occurred while fetching the data.');
    }
    return await response.json();
};