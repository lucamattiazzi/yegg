const findLocalIp = new Promise((resolve, reject) => {
  const RTCPeerConnection =
    window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
  if (!RTCPeerConnection) return reject(new Error('No Webrtc'))
  const pc = new RTCPeerConnection()
  const ips = []
  pc.createDataChannel('')
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer))
    .catch(err => reject(err))
  pc.onicecandidate = event => {
    if (!event || !event.candidate) {
      if (ips.length == 0) return reject(new Error('No Webrtc'))
      return resolve(ips)
    }
    const parts = event.candidate.candidate.split(' ')
    const ip = parts[4]
    if (!ips.some(e => e == ip)) ips.push(ip)
  }
})

export const findFriends = async handler => {
  const [ip] = await findLocalIp
  const baseIp = ip
    .split('.')
    .slice(0, -1)
    .join('.')
  const addresses = Array.from({ length: 256 }, (_, idx) => `http://${baseIp}.${idx}:8000`)
  addresses.forEach(async address => {
    try {
      await window.fetch(address, { mode: 'no-cors' })
      handler(address)
    } catch (e) {
      console.log(e)
    }
  })
}
