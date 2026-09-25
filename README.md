# TLS ALPN Negotiate

Selects the mutually supported application protocol from a ClientHello ALPN list and a server preference order.

```js
import { selectAlpnProtocol } from 'tls-alpn-negotiate';

const protocol = selectAlpnProtocol(
  ['h2', 'http/1.1'], // client offer
  ['h2', 'http/1.1']  // server preference
);
console.log(protocol); // 'h2'
```

## Why this library exists

TLS clients and servers often support several application protocols, but the handshake requires them to agree on exactly one. RFC 7301 defines ALPN for this purpose: the client sends its list, and the server picks one. The server's preference order should win because servers are typically operated with a deliberate protocol rollout policy. This library implements that negotiation in a small, dependency-free function that can be embedded in TLS server implementations or test harnesses.

## Behaviour and edge cases

The function returns `null` when there is no shared protocol. This is deliberate: failure to negotiate is a normal ALPN outcome and callers usually want to handle it without an exception. Protocol names are compared as exact strings, so `h2` and `H2` are different protocols. Inputs must be arrays; a non-array argument throws a `TypeError`. The server list may contain non-string values only if they are never reached before a match, but the function validates each candidate it inspects.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

