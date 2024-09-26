// Import required modules: express for server creation, redis for Redis interaction, and promisify for async Redis calls
import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

// Initialize an Express server and set the port
const app = express();
const port = 1245;

// Create a Redis client and promisify the Redis GET function to allow async/await usage
const client = createClient();
const getAsync = promisify(client.get).bind(client);

// Define the product list with initial data
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

// Function to get an item from the list by its ID
function getItemById(id) {
  return listProducts.find((product) => product.itemId === id);
}

// Function to reserve stock for a specific item by ID in Redis
function reserveStockById(itemId, stock) {
  client.set(`item.${itemId}`, stock);
}

// Async function to get the current reserved stock for an item by ID from Redis
async function getCurrentReservedStockById(itemId) {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : null;
}

// Route to list all products in JSON format
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Route to get the details of a specific product by its ID, including current stock
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);  // Parse itemId from the request parameters
  const product = getItemById(itemId);  // Retrieve the product by its ID

  if (!product) {
    res.json({ status: 'Product not found' });  // If the product doesn't exist, return an error response
    return;
  }

  // Get the current stock from Redis; if null, use the initial available quantity
  const currentQuantity = await getCurrentReservedStockById(itemId) || product.initialAvailableQuantity;

  // Respond with the product details and the current quantity
  res.json({ ...product, currentQuantity });
});

// Route to reserve a product by ID
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);  // Parse itemId from the request parameters
  const product = getItemById(itemId);  // Retrieve the product by its ID

  if (!product) {
    res.json({ status: 'Product not found' });  // If the product doesn't exist, return an error response
    return;
  }

  // Get the current stock from Redis or use the initial available quantity
  let currentStock = await getCurrentReservedStockById(itemId) || product.initialAvailableQuantity;

  if (currentStock <= 0) {
    res.json({ status: 'Not enough stock available', itemId });  // If there's no stock available, return an error response
    return;
  }

  // Decrease the stock by 1 and reserve it in Redis
  reserveStockById(itemId, --currentStock);

  // Confirm the reservation and return the updated status
  res.json({ status: 'Reservation confirmed', itemId });
});

// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
