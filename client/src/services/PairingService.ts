/**
 * Clientside service for initiating the server-side pairing process to a robot.
 */
sessionStorage.setItem('pairingToken', '');

export const PairingService = {
  pair: async (robot_id: string) => {
    console.log('PairingService.pair called with robot_id:', robot_id);
    const response = await fetch('/pair', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ robot_id: robot_id })
    });
    if (response.ok) {
      console.log('Successfully paired with robot:', robot_id);
      const data = await response.json();
      sessionStorage.setItem('pairingToken', data.pairing_token);
      sessionStorage.setItem('robotId', robot_id);
    }
  }
}
