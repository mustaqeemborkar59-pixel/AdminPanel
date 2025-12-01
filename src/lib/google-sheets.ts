
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
    // console.log('Raw data from Google Sheet:', JSON.stringify(rows, null, 2));

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
        
        // Correctly parse the DD/MM/YYYY date from the sheet.
        const parseDate = (dateStr: string): Date => {
            if (!dateStr) return new Date(); // Default to now if date is missing
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                const year = parseInt(parts[2], 10);
                return new Date(year, month, day);
            }
            // Fallback for other formats
            const parsed = new Date(dateStr);
            return isNaN(parsed.getTime()) ? new Date() : parsed;
        };

        const orderDate = parseDate(date);
        
        // This structure is closer to a Customer/Order hybrid.
        // We'll map it to the Order type for now.
        return {
          id: id,
          customerName: customerName || '',
          gmail: gmail || '',
          items: items,
          status: (status as OrderStatus) || 'pending',
          orderType: 'delivery', // Assuming all are delivery
          shippingAddress: billingAddress || '',
          trackingId: trackingId || '',
          totalAmount: totalAsNumber,
          subTotal: totalAsNumber, // Assuming total is subtotal for now
          taxAmount: 0, // Assuming no tax specified in sheet
          timestamp: orderDate.toISOString(),
          // The other fields from your spec like phone, pincode, etc., are not in the Order type,
          // but we are parsing them to avoid the crash.
        };
      } catch (e) {
        if (e instanceof Error) {
            console.error(`Failed to parse row for order ID ${id}. Error: ${e.message}`);
        } else {
            console.error(`An unknown error occurred while parsing row for order ID ${id}.`);
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
    // Fetch all of column A, including the header, to get a reliable index.
    const findResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:A`, // Search in the ID column (from the first row)
    });

    const rows = findResponse.data.values;
    if (!rows) return false;

    // Find the 0-based index of the row containing our orderId.
    const rowIndex = rows.findIndex(row => row[0] === orderId);

    if (rowIndex === -1) {
      console.error(`Order ID ${orderId} not found in sheet.`);
      return false;
    }
    
    // The actual sheet row number is the 0-based index + 1.
    const rowToUpdate = rowIndex + 1;
    
    // Status is in the second column (B).
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
