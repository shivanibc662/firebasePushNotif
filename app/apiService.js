export const API = async (url, body) => {
    console.log("url =>> ",url);
    console.log("body =>> ",body);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(body)
    });
    const jsonData = await response.json();
    console.log("jsonData =>>> ",jsonData);
    return jsonData;
}