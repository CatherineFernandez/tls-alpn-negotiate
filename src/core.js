/**
 * Selects a single ALPN protocol from the client's advertised list,
 * ordered by the server's preference.
 *
 * The TLS ALPN extension allows a client to offer a list of protocols and
 * a server to choose exactly one. The server's preference takes priority
 * because servers often have strong operational reasons to prefer one
 * protocol version over another (for example, HTTP/2 before HTTP/1.1).
 *
 * This function deliberately returns `null` rather than throwing when no
 * overlap exists. ALPN negotiation is a normal part of TLS handshakes and
 * failure to agree is a common, non-exceptional condition that callers
 * usually handle by proceeding without ALPN or by falling back to a
 * default protocol.
 *
 * @param {readonly string[]} clientProtocols - Protocols offered by the
 *   client, in the order the client sent them.
 * @param {readonly string[]} serverProtocols - Protocols the server
 *   supports, in the server's preference order (most preferred first).
 * @returns {string | null} The first server-preferred protocol that also
 *   appears in the client list, or `null` if there is no overlap.
 */
export function selectAlpnProtocol(clientProtocols, serverProtocols) {
  if (!Array.isArray(clientProtocols) || !Array.isArray(serverProtocols)) {
    throw new TypeError('Both arguments must be arrays of protocol names');
  }

  const clientSet = new Set(clientProtocols);

  for (const protocol of serverProtocols) {
    if (typeof protocol !== 'string') {
      throw new TypeError('ALPN protocol names must be strings');
    }

    if (clientSet.has(protocol)) {
      return protocol;
    }
  }

  return null;
}
