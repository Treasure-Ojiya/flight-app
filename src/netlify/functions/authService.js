export async function handler(event) {
  const baseUrl = "https://freeapi.miniprojectideas.com/api/FlightBooking";

  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body || "{}");
    let endpoint;

    if (event.queryStringParameters?.action === "login") {
      endpoint = `${baseUrl}/Login`;
    } else if (event.queryStringParameters?.action === "register") {
      endpoint = `${baseUrl}/Register`;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid action" }),
      };
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(data),
      };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 405, body: "Method not allowed" };
}
