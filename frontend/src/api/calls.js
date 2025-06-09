export async function callSetupGame(setupData) {
  const gameResponse = await fetch(
    `${process.env.REACT_APP_API_URL}/setupGame/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(setupData),
    }
  );

  return await gameResponse.json();
}

export async function callMakeMove(gameEvent) {
  const gameResponse = await fetch(
    `${process.env.REACT_APP_API_URL}/makeMove/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameEvent),
    }
  );

  return await gameResponse.json();
}
