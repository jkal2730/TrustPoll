# TrustPoll

A reliable voting system based on Ethereum smart contract.

## Current implementaion features
- Register candidate (include Fee) 
- voting logic
- return poll result
- connect frontend (Next.js + wagmi)

## Limitations of Ensuring One Person = One Vote in Blockchain-Based Voting

While blockchain technology provides immutability and transparency, applying it to real-world voting introduces several challenges when trying to enforce the principle of "one person, one vote" in a secure and private manner.

### 1. Off-Chain Identity Verification Paradox

- Even if a voter's identity is verified off-chain (e.g., using a government-issued ID), the actual act of voting must take place in an on-chain environment where anonymity is preserved.
- This introduces a paradox: there is no reliable way to ensure that the voter uses **only the verified account** during voting, since the link between identity and wallet must be broken to preserve privacy.

### 2. Challenges of Physical Voting Stations

- One proposed solution is to set up physical voting booths similar to traditional elections, where voter identity can be verified before allowing access to a voting interface (e.g., tablet or kiosk).
- However, this introduces a new risk: **if a voting tablet is compromised**, it may leak private information or even cast unauthorized votes.
- Unlike personal devices, shared public devices are much more susceptible to **tampering or hacking**, especially if they are reused across voters.

### 3. Privacy vs. Control Trade-off

- Ensuring that only one vote is cast per person often requires tracking which wallet belongs to whom.
- However, **tracking wallet-to-identity relationships** undermines the fundamental principle of **secret ballots**.
- Without this linkage, it's difficult to prevent double registration or vote manipulation.

### Conclusion

These limitations show that while blockchain can enhance integrity and transparency, **guaranteeing both privacy and uniqueness of votes** in a decentralized system without relying on trusted third parties or centralized infrastructure remains a significant technical and philosophical challenge.
