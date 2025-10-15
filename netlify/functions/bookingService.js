export async function handler(event) {
  const baseUrl = "https://freeapi.miniprojectideas.com/api/FlightBooking";

  try {
    if (event.httpMethod === "GET") {
      const res = await fetch(`${baseUrl}/GetAllCustomer`);
      const data = await res.json();
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(data),
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const res = await fetch(`${baseUrl}/BookTicket`, {
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
    }

    return { statusCode: 405, body: "Method not allowed" };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
