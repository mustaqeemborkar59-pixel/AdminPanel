import { google } from 'googleapis';
import { Order, OrderItem, OrderStatus, Customer } from '@/types';

let sheets: ReturnType<typeof google.sheets> | null = null;

// This function handles authentication and returns an authorized Google Sheets API client.
const getSheetsClient = () => {
  // Use cached client if it exists
  if (sheets) {
    return sheets;
  }
  
  // Ensure environment variables are loaded and available.
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('Missing Google Sheets API credentials in environment variables.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      private_key: privateKey,
      client_email: clientEmail,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Create and cache new client
  sheets = google.sheets({ version: 'v4', auth });
  return sheets;
};

// This function fetches all orders from the specified Google Sheet.
export const getOrders = async (): Promise<Order[]> => {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME;

  if (!spreadsheetId || !sheetName) {
    throw new Error('Missing GOOGLE_SHEET_ID or GOOGLE_SHEET_NAME in environment variables.');
  }
  
  const sheetsClient = getSheetsClient();
  // Fetching a wider range to accommodate all customer columns
  const range = `${sheetName}!A2:N`; 

  try {
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    
    // Log the raw data from the sheet for debugging
    console.log('Raw data from Google Sheet:', JSON.stringify(rows, null, 2));

    if (!rows || rows.length === 0) {
      return [];
    }

    // Maps the spreadsheet rows to Order objects.
    const orders: Order[] = rows.map((row): Order | null => {
      // Basic validation to skip empty or malformed rows.
      if (!row || !row[0]) return null;
      
      const [
        id, 
        status, 
        customerName, 
        phone, 
        altPhone, 
        billingAddress, 
        pincode, 
        gmail, 
        productsString, // Column I (index 8)
        total, 
        date, 
        paymentDate, 
        trackingId, 
        vendorName
      ] = row;


      try {
        const totalAsNumber = total ? parseFloat(total.replace(/,/g, '')) : 0;

        // Custom parser for the product string
        const parseProducts = (productStr: string): OrderItem[] => {
            if (!productStr || !productStr.includes('(x')) {
                return [];
            }
            
            // This is a simple parser based on the format "Product Name (xQTY, V:...)".
            // It might need to be made more robust if the format has variations.
            const nameMatch = productStr.match(/^(.*) \(/);
            const qtyMatch = productStr.match(/\(x(\d+)/);

            const name = nameMatch ? nameMatch[1].trim() : 'Unknown Product';
            const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 0;
            
            // Assuming price is not in the string, we'll have to set it to 0 or calculate it.
            // For now, let's use a placeholder. The total amount is available.
            const price = qty > 0 ? totalAsNumber / qty : 0;

            if (qty > 0) {
              return [{ name, qty, price, itemId: 'N/A' }];
            }
            return [];
        };

        const items: OrderItem[] = parseProducts(productsString || '');
        
        // This structure is closer to a Customer/Order hybrid.
        // We'll map it to the Order type for now.
        return {
          id: id,
          customerName: customerName || '',
          items: items,
          status: (status as OrderStatus) || 'pending',
          orderType: 'delivery', // Assuming all are delivery
          shippingAddress: billingAddress || '',
          trackingId: trackingId || '',
          totalAmount: totalAsNumber,
          subTotal: totalAsNumber, // Assuming total is subtotal for now
          taxAmount: 0, // Assuming no tax specified in sheet
          timestamp: date ? new Date(date).toISOString() : new Date().toISOString(),
          // The other fields from your spec like phone, pincode, etc., are not in the Order type,
          // but we are parsing them to avoid the crash.
        };
      } catch (e) {
        if (e instanceof Error) {
            console.error(`Failed to parse product string for order ID ${id}. The content was: "${productsString}". Error: ${e.message}`);
        } else {
            console.error(`Failed to parse product string for order ID ${id}. The content was: "${productsString}".`);
        }
        return null;
      }
    }).filter((order): order is Order => order !== null); // Filter out any null (malformed) orders

    return orders;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw new Error('Failed to communicate with Google Sheets API.');
  }
};

// This function updates the status of a specific order in the Google Sheet.
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME;

   if (!spreadsheetId || !sheetName) {
    throw new Error('Missing GOOGLE_SHEET_ID or GOOGLE_SHEET_NAME in environment variables.');
  }

  const sheetsClient = getSheetsClient();

  try {
    // First, find the row number of the order to update.
    const findResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:A`, // Search in the ID column
    });

    const rows = findResponse.data.values;
    if (!rows) return false;

    const rowIndex = rows.findIndex(row => row[0] === orderId);
    if (rowIndex === -1) {
      console.error(`Order ID ${orderId} not found in sheet.`);
      return false;
    }

    // Assuming headers are on row 1, data starts on row 2.
    // If our search range starts from A1, rowIndex is the correct 0-based index.
    // The sheet row number is rowIndex + 1. But since we started from A2, rowIndex + 2
    const rowToUpdate = rowIndex + 2;
    
    // Status is now in the second column (B)
    const columnToUpdate = 'B';

    // Now, update the status in the 'B' column for that row.
    const updateResponse = await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!${columnToUpdate}${rowToUpdate}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[status]],
      },
    });

    return updateResponse.status === 200;
  } catch (error) {
    console.error(`Failed to update order ${orderId} status:`, error);
    return false;
  }
};
