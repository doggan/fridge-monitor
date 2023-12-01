const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
if (!BASE_API_URL) {
    throw Error("BASE_API_URL not defined.")
}

export const fetcher = async (url: string) => {
    const response = await fetch(BASE_API_URL + url);
    if (!response.ok) {
        throw new Error('An error occurred while fetching the data.');
    }
    return await response.json();
};