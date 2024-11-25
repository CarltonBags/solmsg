const {
    Connection,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction,
  } = require("@solana/web3.js");
  const bs58 = require('bs58'); // Ensure bs58 is also imported
  require("dotenv").config(); // Load environment variables
  
  const main = async () => {
    try {
      // Decode secret key from .env file
      const secretKey = "34hbiL78dwgsDsgBiM9jEQ6Hmht7wcstFoesJZvVV6iVUFGqWvkLodpAFpq1wjAcjiN4Kaka3rSZ4rmPDfsnzBU7";
      const sender = Keypair.fromSecretKey(bs58.default.decode(`${secretKey}`));
  
      // Set recipient public key
      const recipient = new PublicKey("7LMT4EHVk9Wif551qHw2vfaFXMVRk9peAeGSaA3gaPm7");
  
      // Create Solana connection
      const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  
      // Create a transaction for transferring lamports (set to 0 for just a memo)
      const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: sender.publicKey,
          toPubkey: recipient,
          lamports: 0, // No SOL transfer
        })
      );
  
      // Add the memo instruction
      transferTransaction.add(
        new TransactionInstruction({
          keys: [
            { pubkey: sender.publicKey, isSigner: true, isWritable: true },
          ],
          data: Buffer.from("Hey man. We, the community, really value you as a holder of $CBDC. Please join the official telegram group https://t.me/CBDCmemeonsol and reach out to a member of the team. See you in the chat!", "utf-8"), // Your memo message
          programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        })
      );
  
      // Send and confirm the transaction
      const signature = await sendAndConfirmTransaction(connection, transferTransaction, [sender]);
  
      console.log("Transaction successful with signature:", signature);
    } catch (err) {
      console.error("Error occurred:", err);
    }
  };
  
  main();
  