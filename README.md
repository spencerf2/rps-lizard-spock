# Welcome to this dApp Repository!

## The name of the game is Rock, Paper, Scissors, Lizard, Spock

### Requirements

- Node.js version 20.18 or higher
- MetaMask browser extension

### Note on folder organization

- contract: holds a standard HardHat project.
  - It was used to create a local blockchain testnet for the purpose of building the frontend with quick feedback on contract interactions
  - Two additions were made:
    1. Added RPS.sol -> https://github.com/clesaege/RPS/blob/master/RPS.sol
    2. Used it to create the ABI and initcode used by ethers.js in the webapp
- webapp: the frontend of the game, which interacts with RPS.sol.
  - This is a standrd Vite with React and TypeScript project modified to interact with the smart contract.

### Running Locally

1. Clone the repository
2. Setup local blockchain:

```bash
cd contract
npm install
npx hardhat node
```

3. Setup webapp:

```bash
cd ../webapp
npm install
npm run dev
```

4. Add HardHat network to MetaMask:
   - Network name: HardHat
   - New RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency symbol: GOHH
5. Switch to HardHat network in MetaMask
6. Visit http://localhost:5173/

## Instructions

You may test it out by visiting: WEBSITE_TO_BE_ADDED_HERE_LATER

- Suggested: Open your browser console while playing to see the game's state transitions. Note that UI improvements are listed under the "Future improvements" section below. (You can access the browser console by right clicking anywhere on the game and selecting "Inspect". Then you can select the "Console" tab.)

- Visit WEBSITE_TO_BE_ADDED_HERE_LATER.
- Create a MetaMask account if you don't already have one.
- Install the MetaMask browser extension (Chromium based browsers are recommended [like Google Chrome or Microsoft Edge]).
- Switch networks to the Sepolia testnet. You may need to select "Show test networks" for it to be a visible option.
- Get some Sepolia ETH from a faucet (https://cloud.google.com/application/web3/faucet/ethereum/sepolia or https://www.alchemy.com/faucets/ethereum-sepolia)
- Select a weapon as Player 1.
- Set a stake amount. 0.01 is suggested.
- Enter the MetaMask Ethereum Blockchain address for Player 2 (you may want to create a second account for yourself to test this)
- Click "Let the Game Begin!"
- MetaMask should pop up and ask you to Confirm the transaction. Confirm
- Wait for transaction to be mined. The page will refresh to the next game state automatically.
- Click the yellow contract address and send it to player 2. OR refresh your page and continue as player 2:

As Player 2:

- Switch MetaMask accounts so you are player 2
- "Click to Connect MetaMask"
- Enter the contract address Player 1 provided and click "Search"
- Select your move
- Click "Battle!"
- Click "Confirm" when MetaMask pops up.
- Wait for the transaction to be mined and the page to refresh.

As Player 1:

- Switch MetaMask accounts so you are player 1 again
- Refresh the page
- "Click to Connect MetaMask"
- Click the "Reveal Results" button
- Wait for the transaction to be mined. The page will refresh automatically to show the outcome of the game.

Note:

- You can login with yet a third MetaMask Ethereum account and lookup a contract address for a game that's in session or which has ended.
  You'll be treated as a spectator in the game.

## Future Improvements

### Security

- Could be utilizing MetaMask's secure storage snap rather than saving the salt and Player 1's move to their local cache (which they may accidentally delete thereby preventing them from revealing the results at the end of the game)

### Performance

- Currently using an inefficient brute force method to collect the game's end results when someone looks up the game's contract address after the game ended.
  - A more elegant solution would be to utilize the Etherscan API to look up the contract on the Sepolia network. From there it'd be easier to see what Player 1's
    weapon was.
  - This more elegant solution would also check for the current environment the game is running in. Brute force is fine when the game is running locally. It's less
    fine when using Sepolia, but is sufficient to demo this application.

### User Experience

- The UI could be enhanced to more clearly show what's happening as we wait for the player moves to be mined and saved to the Sepolia blockchain.
- Currently the time each player has to make their move before forefitting is hardcoded (And thus confusing rather than helpful). Adding the actual timeout countdown would be a nice improvement.
- Show that a game was never played, rather than showing the game was a tie or that Player 2 won
  - Currently Player 2 / a Spectator erroneously sees the game was a tie when Player 2 never made their move
  - Currently Player 2 / a Spectator erroneously sees that Player 2 won when Player 1 does not reveal the results

### Technical Improvements

- There's a TODO left in the code to make it so that if a spectator looks up the game, then they aren't given write access to the contract. The contract's code makes
  write operations by a non-player impossible, but still, it'd be a bit more technically sound.
