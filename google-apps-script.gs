// Google Apps Script code to handle registrations and save screenshots
// 
// To install this:
// 1. Open the Google Sheet associated with your registrations.
// 2. Go to Extensions -> Apps Script.
// 3. Delete any default code in Code.gs and paste this script.
// 4. Click Save (disk icon).
// 5. Deploy as a Web App:
//    - Click "Deploy" -> "New deployment"
//    - Choose type: "Web app"
//    - Description: "Circuitron Registrations API"
//    - Execute as: "Me (your-email@gmail.com)"
//    - Who has access: "Anyone"
//    - Click "Deploy", authorize permissions, and copy the new "Web app URL".
// 6. Paste the copied URL into your `.env.local` file as `GOOGLE_SCRIPT_URL`.

const FOLDER_ID = "1qROD7ZAphS-G8c1imydmQRJdAE1gM5IF"; // Google Drive folder ID for screenshots

function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);
    
    const name = data.name || "Unknown";
    const phone = data.phone || "";
    const email = data.email || "";
    const college = data.college || "";
    const department = data.department || "";
    const year = data.year || "";
    const isIeee = data.isIeee;
    const ieeeId = data.ieeeId || "N/A";
    const regType = data.regType || "";
    const amount = data.amount || 0;
    
    const screenshotBase64 = data.screenshotBase64;
    const screenshotMimeType = data.screenshotMimeType || "image/jpeg";
    const screenshotFileName = data.screenshotFileName || "screenshot.jpg";
    
    // Determine the file extension (e.g., jpg, png)
    let fileExtension = "jpg";
    if (screenshotMimeType.includes("png")) {
      fileExtension = "png";
    } else if (screenshotMimeType.includes("gif")) {
      fileExtension = "gif";
    } else if (screenshotMimeType.includes("pdf")) {
      fileExtension = "pdf";
    } else {
      const parts = screenshotFileName.split(".");
      if (parts.length > 1) {
        fileExtension = parts[parts.length - 1].toLowerCase();
      }
    }
    
    // Format name to contain only safe alphanumeric characters and hyphens/underscores
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/g, "");
    
    // Determine IEEE status string as requested: "ieee member" or "non ieee member"
    const ieeeStatus = isIeee ? "ieee member" : "non ieee member";
    
    // Construct new filename, e.g. "kashi-ieee member.jpg"
    const newFileName = `${cleanName}-${ieeeStatus}.${fileExtension}`;
    
    let fileCellValue = "";
    
    // Save screenshot to the Google Drive Folder
    if (screenshotBase64) {
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const decodedData = Utilities.base64Decode(screenshotBase64);
      const blob = Utilities.newBlob(decodedData, screenshotMimeType, newFileName);
      const file = folder.createFile(blob);
      
      // Make the file publicly viewable so you can view it directly from the Google Sheet link
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      const fileUrl = file.getUrl();
      
      // Create Hyperlink formula for Google Sheets (displays the filename as the link text)
      fileCellValue = `=HYPERLINK("${fileUrl}", "${newFileName}")`;
    }
    
    // Split timestamp into Date and Time (using script timezone)
    const timestamp = new Date();
    const timezone = Session.getScriptTimeZone();
    const formattedDate = Utilities.formatDate(timestamp, timezone, "yyyy-MM-dd");
    const formattedTime = Utilities.formatDate(timestamp, timezone, "HH:mm:ss");
    
    // Append details to the Google Sheet (Active sheet in the Spreadsheet) in the exact order requested:
    // Date, Time, name, Phone Number, Mail ID, College, Department, Year of Study, IEEE Status, IEEE-ID, Amount, Screenshot
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    sheet.appendRow([
      formattedDate,
      formattedTime,
      name,
      phone,
      email,
      college,
      department,
      year,
      ieeeStatus, // "ieee member" or "non ieee member"
      ieeeId,
      amount,
      fileCellValue // Hyperlink formatting pointing to the saved file location in Drive
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Registration recorded and screenshot saved successfully!",
      fileUrl: fileCellValue
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to handle GET requests (e.g. verifying unique IEEE ID)
function doGet(e) {
  try {
    const action = e.parameter.action;
    const id = e.parameter.id;
    
    if (action === "checkIeee" && id) {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const data = sheet.getDataRange().getValues();
      
      // Assuming IEEE ID is in Column 10 (Index 9 in 0-indexed values: Date, Time, name, Phone Number, Mail ID, College, Department, Year of Study, IEEE Status, IEEE-ID)
      // Adjust this index if your columns are ordered differently
      const ieeeIdColIndex = 9; 
      let registered = false;
      
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][ieeeIdColIndex]).trim() === String(id).trim()) {
          registered = true;
          break;
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        registered: registered
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Invalid action or parameters."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
